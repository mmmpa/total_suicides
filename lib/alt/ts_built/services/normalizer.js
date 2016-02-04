var constants_1 = require("../initializers/constants");
var _ = require('lodash');
var table_1 = require("../models/table");
function normalize(params) {
    var title = params.title, column = params.column, row = params.row, table = params.table, data = params.data;
    var titleMap = detectKeyMap(title);
    var columnMap = detectKeyMap(column);
    var rowMap = detectKeyMap(row);
    console.log({ data: data });
    var titleGrouped = {};
    _.each(data, function (d) {
        _.each(titleMap, function (_a) {
            var key = _a.key, name = _a.name;
            var content = d.number;
            if (constants_1.default.isIncludedTable(title)) {
                content = d[key];
            }
            else {
                if (d[title].content != key) {
                    return;
                }
            }
            var store = findOrCreate(titleGrouped, key, []);
            var year = d.year, gender = d.gender, area = d.area;
            store.push({ year: year, gender: gender, area: area, data: d, content: content });
        });
    });
    var rowGroped = {};
    _.each(titleGrouped, function (dataList, key) {
        var store = findOrCreate(rowGroped, key, {});
        _.each(dataList, function (d) {
            if (constants_1.default.isIncludedTable(row)) {
                _.each(rowMap, function (_a) {
                    var key = _a.key, name = _a.name;
                    var s = findOrCreate(store, key, []);
                    var year = d.year, gender = d.gender, area = d.area, data = d.data;
                    var content = data[key];
                    s.push({ year: year, gender: gender, area: area, data: data, content: content });
                });
            }
            else {
                var s = findOrCreate(store, d[row].content, []);
                s.push(d);
            }
        });
    });
    var column;
    console.log({ titleGrouped: titleGrouped, rowGroped: rowGroped });
    var grouped = rowGroped;
    var chartDataListStore = {};
    var columnNames = _.map(columnMap, function (_a) {
        var name = _a.name;
        return name;
    });
    _.each(titleMap, function (_a) {
        var key = _a.key, name = _a.name;
        var store = findOrCreate(chartDataListStore, key, { table: new table_1.default(name, columnNames) });
        var titleData = grouped[key];
        //console.log({titleData})
        if (!titleData) {
            return;
        }
        _.each(rowMap, function (_a) {
            var key = _a.key, name = _a.name;
            var raw = titleData[key];
            if (!raw) {
                return;
            }
            var groupedRaw;
            if (!constants_1.default.isIncludedTable(column)) {
                groupedRaw = _.groupBy(raw, function (r) { return r[column].content; });
            }
            var rowData = [];
            _.each(columnMap, function (_a) {
                var key = _a.key, name = _a.name;
                var content;
                if (constants_1.default.isIncludedTable(column)) {
                    content = raw[0].data[key];
                }
                else {
                    if (!groupedRaw[key]) {
                        return;
                    }
                    content = groupedRaw[key][0].content;
                }
                rowData.push(content);
            });
            store.table.addRow(name, rowData);
        });
    });
    chartDataListStore = _.map(chartDataListStore, function (v, k) { return v; });
    _.map(chartDataListStore, function (c) { return console.log(c); });
}
exports.normalize = normalize;
function detectKeyMap(title) {
    return detectTableKeyMap(title) || detectSplitterMap(title);
}
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