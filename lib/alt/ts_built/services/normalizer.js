var constants_1 = require("../initializers/constants");
var _ = require('lodash');
function normalizePieData(props) {
    var data = props.data, split = props.split, table = props.table;
    switch (split) {
        case undefined:
            return normalizePieDataYear(props);
        case 'area':
            return normalizePieDataNormal(data, split, table);
        case 'gender':
            return normalizePieDataNormal(data, split, table);
        default:
            return normalizePieDataReverse(data, table, split);
    }
}
exports.normalizePieData = normalizePieData;
function normalizeBarData(props) {
    var data = props.data, split = props.split, table = props.table;
    switch (split) {
        case undefined:
            return normalizePieDataYear(props);
        case 'area':
            return normalizeBarDataNormal(data, split, table);
        case 'gender':
            return normalizeBarDataNormal(data, split, table);
        default:
            return normalizeBarDataReverse(data, table, split);
    }
}
exports.normalizeBarData = normalizeBarData;
function normalizeStackBarData(props) {
    var data = props.data, split = props.split, table = props.table, rotation = props.rotation, sort = props.sort;
    var arranged = arrangeData(data, table);
    console.log(arranged);
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
        hash[key] = initial;
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
        /*
        // 総数
        if(part.gender.content == 0){
          //項目のstore
          let totalStore = findOrCreate(arranged, 'total', {});
          //項目の年度別store
          let totalYearStore = findOrCreate(totalStore, part.year.content, {});
          //項目の年度内種別配列
          let dataArray = findOrCreate(totalYearStore, 0, []);
          dataArray.push(part);
        };
    */
        // 各splitへ値を割り当て
        _.each(splitters, function (keys, name) {
            if (!part[name]) {
                return;
            }
            //項目のstore
            var splitStore = findOrCreate(arranged, name, {});
            //項目の年度別store
            var yearStore = findOrCreate(splitStore, part.year.content, {});
            //項目の年度内種別配列
            var dataArray = findOrCreate(yearStore, part[name].content, []);
            dataArray.push(part);
        });
        // valueのnumberを {name, content, splitters} 形式に変更
        _.each(keyMaps, function (keyMap) {
            part[keyMap.key] = {
                name: keyMap.name,
                content: part[keyMap.key]
            };
            _.each(splitters, function (keys, name) {
                part[keyMap.key][name] = arranged[name];
            });
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
    console.log(arranged);
}
function normalizeRegularStackBarData(arranged, table, split, sort) {
    if (!_.isObject(arranged)) {
        return [];
    }
    var keyMaps = detectTableKeyMap(table);
    var splitterMaps = detectSplitterMap(split);
    var chartSeries = splitterMaps.map(function (keyMap) { return ({ field: keyMap.key, name: keyMap.name }); });
    var chartData = {
        chartSeries: chartSeries,
        eachYear: {},
        eachSplit: {},
        max: 0
    };
    _.each(splitterMaps, function (splitterMap) {
        var name = splitterMap.name, key = splitterMap.key;
        _.each(arranged[split], function (yearResult, year) {
            var rawList = yearResult[key];
            var eachYearStore = findOrCreate(chartData.eachYear, year, {});
            _.each(rawList, function (raw) {
                _.each(keyMaps, function (keyMap) {
                    var eachYearData = findOrCreate(eachYearStore, keyMap.key, { title: raw[keyMap.key].name, data: {} });
                    var eachYearDataDetail = findOrCreate(eachYearData.data, raw[sort].content, { sort: raw[sort] });
                    eachYearDataDetail[raw[split].content] = raw[keyMap.key].content;
                });
            });
        });
    });
    _.each(chartData.eachYear, function (yearData) {
        _.each(yearData, function (chart) {
            _.each(chart.data, function (child) {
                var maxStore = 0;
                _.each(splitterMaps, function (sp) {
                    maxStore += child[sp.key];
                });
                maxStore > chartData.max && (chartData.max = maxStore);
            });
        });
    });
    console.log('normalized', chartData);
    return chartData;
}
function sortData(dataList, split) {
    if (!dataList) {
        return [];
    }
    switch (split) {
        case 'year':
            return _.sortBy(dataList, function (el) { return -el.year.content; });
        case 'gender':
            return _.sortBy(dataList, function (el) { return el.gender.content; });
        case 'area':
            return _.sortBy(dataList, function (el) { return el.area.content; });
        default:
            return dataList;
    }
}
function detectChartProps(table) {
    return constants_1.default[(table + "Props")] || {};
}
function splitYear(dataList) {
    var result = {};
    _.map(dataList, function (data) {
        var year = data.year.content;
        if (!result[year]) {
            result[year] = {
                year: data.year,
                dataList: []
            };
        }
        result[year].dataList.push(data);
    });
    return result;
}
function posit(dataList, split, keys) {
    var result = {};
    dataList.map(function (data) {
        keys.map(function (key) {
            if (!result[key]) {
                result[key] = {};
            }
            var sortKey = data[split].content;
            result[key][sortKey] = data[key];
        });
    });
    return result;
}
function positReverse(dataList, split, keys) {
    var result = {};
    dataList.map(function (data) {
        keys.map(function (key) {
            var sortKey = data[split].content;
            if (!result[sortKey]) {
                result[sortKey] = {};
            }
            result[sortKey][key] = data[key];
        });
    });
    return result;
}
function normalizePieDataReverse(data, split, table) {
    console.log('reverse');
    var sorted = sortData(data, split);
    var _a = detectChartProps(table), keys = _a.keys, texts = _a.texts;
    if (!keys || !texts) {
        return [];
    }
    var years = splitYear(sorted);
    var elements = constants_1.default[(split + "s")];
    var normalizedList = {};
    _.forEach(years, function (value, key) {
        var result = positReverse(value.dataList, split, keys);
        result.year = value.year;
        normalizedList[key] = result;
    });
    var results = [];
    _.forEach(normalizedList, function (normalized, key) {
        var result = {
            year: normalized.year,
            dataList: []
        };
        _.forEach(elements, function (el) {
            var data = normalized[el.key];
            var total = _.reduce(keys, function (a, ek) {
                return a + data[ek];
            }, 0);
            result.dataList.push({
                name: el.text + " (" + total + ")",
                data: _.sortBy(_.compact(_.zip(keys, texts).map(function (kt) {
                    var key = kt[0];
                    var title = kt[1];
                    var label = title + " (" + data[key] + ")";
                    return { label: label, value: par(data[key], total) };
                })), function (d) { return 0; })
            });
        });
        results.push(result);
    });
    return _.sortBy(results, function (result) { return -result.year.content; });
}
function normalizePieDataNormal(data, split, table) {
    var sorted = sortData(data, split);
    var _a = detectChartProps(table), keys = _a.keys, texts = _a.texts;
    if (!keys || !texts) {
        return [];
    }
    var years = splitYear(sorted);
    var elements = constants_1.default[(split + "s")];
    var normalizedList = {};
    _.forEach(years, function (value, key) {
        var result = posit(value.dataList, split, keys);
        result.year = value.year;
        normalizedList[key] = result;
    });
    var results = [];
    _.forEach(normalizedList, function (normalized, key) {
        var result = {
            year: normalized.year,
            dataList: []
        };
        _.forEach(_.zip(keys, texts), function (kt) {
            var key = kt[0];
            var title = kt[1];
            var data = normalized[key];
            var elementKeys = elements.map(function (e) { return e.key; });
            var total = _.reduce(elementKeys, function (a, ek) {
                return a + data[ek];
            }, 0);
            result.dataList.push({
                name: title + " (" + total + ")",
                data: _.compact(elements.map(function (el) {
                    if (data[el.key] == 0) {
                        return null;
                    }
                    var label = el.text + " (" + data[el.key] + ")";
                    return { label: label, value: par(data[el.key], total) };
                }))
            });
        });
        results.push(result);
    });
    return _.sortBy(results, function (result) { return -result.year.content; });
}
function normalizeBarDataNormal(data, split, table) {
    console.log('regular');
    var sorted = sortData(data, split);
    var _a = detectChartProps(table), keys = _a.keys, texts = _a.texts;
    if (!keys || !texts) {
        return [];
    }
    var years = splitYear(sorted);
    var elements = constants_1.default[(split + "s")];
    console.log('years', years);
    var normalizedList = {};
    _.forEach(years, function (value, key) {
        var result = posit(value.dataList, split, keys);
        result.year = value.year;
        normalizedList[key] = result;
    });
    var chartSeries = elements.map(function (e) { return ({ field: e.key, name: e.text }); });
    var max = 0;
    var result = {};
    _.forEach(normalizedList, function (normalized, key) {
        _.forEach(_.zip(keys, texts), function (kt) {
            var key = kt[0];
            var title = kt[1];
            var data = normalized[key];
            var now = {
                year: normalized.year.content
            };
            var myNum = 0;
            elements.map(function (e) {
                var num = data[e.key];
                if (num != 0 && !num) {
                    _.remove(chartSeries, function (c) { return c.field == e.key; });
                    return;
                }
                myNum += num;
                now[e.key] = num;
            });
            myNum > max && (max = myNum);
            if (!result[key]) {
                result[key] = [];
            }
            result[key].push(now);
        });
    });
    console.log('now', result);
    var results = [];
    _.forEach(_.zip(keys, texts), function (kt) {
        var key = kt[0];
        var title = kt[1];
        results.push({
            chartSeries: chartSeries,
            key: key,
            title: title,
            dataList: result[key]
        });
    });
    return { max: max, results: results };
}
function normalizeBarDataReverse(data, split, table) {
    console.log('rotated');
    var sorted = sortData(data, split);
    var _a = detectChartProps(table), keys = _a.keys, texts = _a.texts;
    if (!keys || !texts) {
        return [];
    }
    var years = splitYear(sorted);
    var elements = constants_1.default[(split + "s")];
    var normalizedList = {};
    _.forEach(years, function (value, key) {
        var result = posit(value.dataList, split, keys);
        result.year = value.year;
        normalizedList[key] = result;
    });
    var chartSeries = _.zip(keys, texts).map(function (kt) { return ({ field: kt[0], name: kt[1] }); });
    console.log('chartSeries', chartSeries);
    var result = {};
    _.forEach(normalizedList, function (normalized, key) {
        var store = {};
        _.forEach(_.zip(keys, texts), function (kt) {
            var key = kt[0];
            var title = kt[1];
            elements.map(function (e) {
                if (!store[e.key]) {
                    store[e.key] = { year: normalized.year.content };
                }
                var num = normalized[key][e.key];
                store[e.key][key] = num;
            });
        });
        elements.map(function (e) {
            if (!result[e.key]) {
                result[e.key] = [];
            }
            result[e.key].push(store[e.key]);
        });
    });
    console.log('now', result);
    var max = 0;
    var results = [];
    _.forEach(elements, function (e) {
        if (!result[e.key][0][keys[0]]) {
            return;
        }
        results.push({
            chartSeries: chartSeries,
            key: e.key,
            title: e.text,
            dataList: result[e.key]
        });
        result[e.key].map(function (d) {
            var myNum = 0;
            keys.map(function (k) {
                myNum += d[k];
            });
            myNum > max && (max = myNum);
        });
    });
    console.log('results', results);
    return { max: max, results: results };
}
function detectYearTable(table) {
    return table == 'gender' || table == 'area' ? 'total' : table;
}
function normalizePieDataYear(props) {
    var data = props.data, table = props.table;
    var sorted = sortData(data, 'year');
    var _a = detectChartProps(detectYearTable(table)), keys = _a.keys, texts = _a.texts;
    console.log(keys, texts, sorted);
    if (!keys || !texts) {
        return [];
    }
    return sorted.map(function (one) {
        var total = _.reduce(keys, function (a, key) { return a + one[key]; }, 0);
        return {
            year: one.year,
            dataList: [{
                    name: "(" + total + ")",
                    data: _.map(_.zip(keys, texts), function (kt) {
                        var key = kt[0];
                        var label = kt[1] + " (" + one[key] + ")";
                        return { label: label, value: par(one[key], total) };
                    })
                }]
        };
    });
}
function par(n, total) {
    return Math.round(n / total * 1000) / 10;
}
//# sourceMappingURL=normalizer.js.map