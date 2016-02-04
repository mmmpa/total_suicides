var constants_1 = require("../initializers/constants");
var _ = require('lodash');
function normalizeStackBarData(props) {
    var data = props.data, split = props.split, table = props.table, rotation = props.rotation, sort = props.sort;
    var arranged = arrangeData(data, table);
    if (rotation == 'true') {
        return normalizeRotatedStackBarData(arranged, table, split, sort);
    }
    else {
        return normalizeRegularStackBarData(arranged, table, split, sort);
    }
}
exports.normalizeStackBarData = normalizeStackBarData;
function detectTableKeyMap(table) {
    return constants_1.default[(table + "Props")];
}
function detectSplitterMap(split) {
    return constants_1.default.splitters[split];
}
function findOrCreate(hash, key, initial) {
    if (!hash[key]) {
        hash[key.toString()] = initial;
    }
    return hash[key];
}
function arrangeData(data, table) {
    if (!_.isArray(data)) {
        return null;
    }
    var keyMaps = detectTableKeyMap(table);
    var splitters = constants_1.default.splitters;
    var arranged = {};
    data.map(function (part) {
        part.total = part.gender;
        // 各splitのkeyでアクセスできるようにする
        _.each(splitters, function (keys, name) {
            if (!part[name]) {
                return;
            }
            //項目のstore
            var splitStore = findOrCreate(arranged, name, {});
            var dataArray = findOrCreate(splitStore, part[name].content, []);
            dataArray.push(part);
        });
        // tableの各要素からsplitにアクセスできるようにする
        var total = _.reduce(keyMaps, function (a, keyMap) { return a + part[keyMap.key]; }, 0);
        _.each(keyMaps, function (keyMap) {
            part[keyMap.key] = {
                name: keyMap.name,
                content: part[keyMap.key],
                par: par(part[keyMap.key], total),
                src: part,
                key: keyMap.key
            };
        });
        // 各項目の属性ごとに値を割り当て
        _.each(keyMaps, function (keyMap) {
            var partStore = findOrCreate(arranged, keyMap.key, {});
            _.each(splitters, function (keys, name) {
                partStore[name] = arranged[name];
            });
        });
    });
    console.log('arranged', arranged);
    return arranged;
}
function par(n, total) {
    return Math.round(n / total * 1000) / 10;
}
function normalizeRotatedStackBarData(arranged, table, split, sort) {
    console.log('rotated');
    console.log(arranged);
    var keyMaps = detectTableKeyMap(table);
    var splitterMaps = detectSplitterMap(split);
    var sortMaps = detectSplitterMap(sort);
    var chartSeries = keyMaps.map(function (keyMap) { return ({ field: keyMap.key, name: keyMap.name }); });
    var chartData = {
        chartSeries: chartSeries,
        dataList: {},
        max: 0
    };
    if (sort == 'year') {
    }
    else {
        _.each(arranged.year, function (yearDataList, year) {
            var eachYearStore = findOrCreate(chartData.dataList, year, { title: yearDataList[0].year.name });
            var remap = remapArray(yearDataList, split, sort);
            _.each(sortMaps, function (sortMap) {
                var sortElement = remap[sortMap.key];
                if (!sortElement) {
                    return;
                }
                _.each(sortElement, function (splitValue, splitKey) {
                    _.each(keyMaps, function (keyMap) {
                        var dataList = findOrCreate(eachYearStore, splitKey, {});
                        var data = findOrCreate(dataList, sortMap.key, { sort: sortMap });
                        data[keyMap.key] = splitValue[keyMap.key].content;
                        data[keyMap.key + 'par'] = splitValue[keyMap.key].par;
                    });
                });
            });
            eachYearStore.chartList = convert(eachYearStore, splitterMaps, sortMaps);
        });
        // max処理
        chartData.max = getMax(chartData.dataList, splitterMaps, keyMaps);
    }
    console.log('normalized', chartData);
    return chartData;
}
function remapArray(dataList, series, sort) {
    var result = {};
    _.each(dataList, function (d) {
        var store = findOrCreate(result, d[sort].content, {});
        store[d[series].content] = d;
    });
    return result;
}
function convert(eachYearStore, themeMap, sortMap) {
    var result = [];
    _.each(themeMap, function (theme) {
        var store = eachYearStore[theme.key];
        var array = [];
        _.each(sortMap, function (sort) {
            array.push(store[sort.key]);
        });
        result.push({
            key: theme.key,
            name: theme.name,
            data: _.compact(array)
        });
    });
    return result;
}
function getMax(dataList, themeMap, seriesMap) {
    var max = 0;
    _.each(dataList, function (dataSet) {
        _.each(themeMap, function (theme) {
            var tableData = dataSet[theme.key];
            _.each(tableData, function (data) {
                var total = 0;
                _.each(seriesMap, function (series) {
                    total += data[series.key] || 0;
                });
                total > max && (max = total);
            });
        });
    });
    return max;
}
function normalizeRegularStackBarData(arranged, table, split, sort) {
    if (!_.isObject(arranged)) {
        return [];
    }
    var keyMaps = detectTableKeyMap(table);
    var splitterMaps = detectSplitterMap(split);
    var sortMaps = detectSplitterMap(sort);
    var chartSeries = _.compact(splitterMaps.map(function (keyMap) {
        if (arranged[split][keyMap.key]) {
            return { field: keyMap.key, name: keyMap.name };
        }
    }));
    var chartData = {
        chartSeries: chartSeries,
        dataList: {},
        max: 0
    };
    if (sort == 'year') {
        chartData.dataList = {
            _: {
                title: '年ごとの遷移',
                chartList: {}
            }
        };
        var store = chartData.dataList._.chartList;
        _.each(arranged[split], function (splitData, key) {
            _.each(splitData, function (spData) {
                _.each(keyMaps, function (keyMap) {
                    var columnStore = findOrCreate(store, keyMap.key, { name: keyMap.name, data: {} });
                    var yearStore = findOrCreate(columnStore.data, spData.year.content, { sort: spData.year });
                    yearStore[key] = spData[keyMap.key].content;
                    yearStore[key + 'par'] = spData[keyMap.key].par;
                });
            });
        });
        _.each(keyMaps, function (keyMap) {
            var target = store[keyMap.key];
            target.data = _.map(target.data, function (value) {
                var maxStore = 0;
                _.each(splitterMaps, function (sp) {
                    maxStore += value[sp.key] || 0;
                });
                maxStore > chartData.max && (chartData.max = maxStore);
                return value;
            });
        });
    }
    else {
        _.each(arranged.year, function (yearDataList, year) {
            var eachYearStore = findOrCreate(chartData.dataList, year, { title: yearDataList[0].year.name });
            var remap = remapArray(yearDataList, split, sort);
            _.each(sortMaps, function (sortMap) {
                var sortElement = remap[sortMap.key];
                if (!sortElement) {
                    return;
                }
                _.each(sortElement, function (splitValue, splitKey) {
                    _.each(keyMaps, function (keyMap) {
                        var dataList = findOrCreate(eachYearStore, keyMap.key, {});
                        var data = findOrCreate(dataList, sortMap.key, { sort: sortMap });
                        data[splitKey] = splitValue[keyMap.key].content;
                        data[splitKey + 'par'] = splitValue[keyMap.key].par;
                    });
                });
            });
            eachYearStore.chartList = convert(eachYearStore, keyMaps, sortMaps);
        });
        chartData.max = getMax(chartData.dataList, keyMaps, splitterMaps);
    }
    console.log('normalized', chartData);
    return chartData;
}
//# sourceMappingURL=normalizer.js.map