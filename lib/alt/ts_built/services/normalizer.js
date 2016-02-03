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
        _.each(keyMaps, function (keyMap) {
            part[keyMap.key] = {
                name: keyMap.name,
                content: part[keyMap.key],
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
            var eachYearStore = findOrCreate(chartData.dataList, year, {});
            eachYearStore.title = yearDataList[0].year.name;
            var remap = {};
            _.each(yearDataList, function (d) {
                var store = findOrCreate(remap, d[sort].content, {});
                store[d[split].content] = d;
            });
            console.log('1', chartData);
            _.each(sortMaps, function (sortMap) {
                var sortElement = remap[sortMap.key];
                if (!sortElement) {
                    return;
                }
                _.each(sortElement, function (splitValue, splitKey) {
                    // splitごとのchart全体のデータの入れ物
                    var dataList = findOrCreate(eachYearStore, splitKey, {});
                    //sortの順番にしたがって、チャートシリーズが全て入ったobjectを挿入する
                    _.each(keyMaps, function (keyMap) {
                        var data = findOrCreate(dataList, sortMap.key, { sort: sortMap });
                        data[keyMap.key] = splitValue[keyMap.key].content;
                    });
                });
            });
            console.log('eachYearStore', eachYearStore);
            _.each(splitterMaps, function (spMap) {
                var store = eachYearStore[spMap.key];
                var chartList = findOrCreate(eachYearStore, 'chartList', []);
                var array = [];
                _.each(sortMaps, function (sortMap) {
                    array.push(store[sortMap.key]);
                });
                chartList.push({
                    key: spMap.key,
                    name: spMap.name,
                    data: array
                });
                //delete eachYearStore[keyMap.key];
            });
        });
        // max処理
        _.each(chartData.dataList, function (dataSet) {
            _.each(keyMaps, function (keyMap) {
                var tableData = dataSet[keyMap.key];
                _.each(tableData, function (data) {
                    var maxStore = 0;
                    _.each(splitterMaps, function (sp) {
                        maxStore += data[sp.key] || 0;
                    });
                    maxStore > chartData.max && (chartData.max = maxStore);
                });
            });
        });
    }
    console.log('normalized', chartData);
    return chartData;
}
function normalizeRegularStackBarData(arranged, table, split, sort) {
    if (!_.isObject(arranged)) {
        return [];
    }
    var keyMaps = detectTableKeyMap(table);
    var splitterMaps = detectSplitterMap(split);
    var sortMaps = detectSplitterMap(sort);
    var chartSeries = splitterMaps.map(function (keyMap) { return ({ field: keyMap.key, name: keyMap.name }); });
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
            var eachYearStore = findOrCreate(chartData.dataList, year, {});
            eachYearStore.title = yearDataList[0].year.name;
            var remap = {};
            _.each(yearDataList, function (d) {
                var store = findOrCreate(remap, d[sort].content, {});
                store[d[split].content] = d;
            });
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
                    });
                });
            });
            _.each(keyMaps, function (keyMap) {
                var store = eachYearStore[keyMap.key];
                var chartList = findOrCreate(eachYearStore, 'chartList', []);
                var array = [];
                _.each(sortMaps, function (sortMap) {
                    array.push(store[sortMap.key]);
                });
                chartList.push({
                    key: keyMap.key,
                    name: keyMap.name,
                    data: array
                });
                //delete eachYearStore[keyMap.key];
            });
        });
        _.each(chartData.dataList, function (dataSet) {
            _.each(keyMaps, function (keyMap) {
                var tableData = dataSet[keyMap.key];
                _.each(tableData, function (data) {
                    var maxStore = 0;
                    _.each(splitterMaps, function (sp) {
                        maxStore += data[sp.key] || 0;
                    });
                    maxStore > chartData.max && (chartData.max = maxStore);
                });
            });
        });
    }
    console.log('normalized', chartData);
    return chartData;
}
//# sourceMappingURL=normalizer.js.map