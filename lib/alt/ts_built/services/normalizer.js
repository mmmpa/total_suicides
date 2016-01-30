var constants_1 = require("../initializers/constants");
function sortData(dataList, split) {
    if (!dataList) {
        return [];
    }
    switch (split) {
        case 'year':
            return _.sortBy(dataList, function (el) { return el.year.content; });
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
function normalizePieData(props) {
    switch (props.params.split) {
        case 'area':
            return normalizePieDataNormal(props);
        case 'gender':
            return normalizePieDataNormal(props);
        default:
            return normalizePieDataReverse(props);
    }
}
exports.normalizePieData = normalizePieData;
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
function normalizePieDataReverse(props) {
    var data = props.data, split = props.split, table = props.table;
    var sorted = sortData(data, table);
    var _a = detectChartProps(split), keys = _a.keys, texts = _a.texts;
    if (!keys || !texts) {
        return [];
    }
    var years = splitYear(sorted);
    var elements = constants_1.default[(table + "s")];
    var normalizedList = {};
    _.forEach(years, function (value, key) {
        var result = positReverse(value.dataList, table, keys);
        result.year = value.year;
        normalizedList[key] = result;
    });
    console.log(split, elements, normalizedList);
    var results = [];
    _.forEach(normalizedList, function (normalized, key) {
        var result = {
            year: normalized.year,
            dataList: []
        };
        console.log(normalized);
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
    console.log(results);
    return _.sortBy(results, function (result) { return -result.year.content; });
}
function normalizePieDataNormal(props) {
    var data = props.data, split = props.split, table = props.table;
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
                data: _.sortBy(_.compact(elements.map(function (el) {
                    if (data[el.key] == 0) {
                        return null;
                    }
                    var label = el.text + " (" + data[el.key] + ")";
                    return { label: label, value: par(data[el.key], total) };
                })), function (d) { return split == 'gender' ? 0 : -d.value; })
            });
        });
        results.push(result);
    });
    console.log(results);
    return _.sortBy(results, function (result) { return -result.year.content; });
}
function normalizePieDataYear(props) {
    var sorted = sortData(props);
    var _a = detectChartProps(props), keys = _a.keys, texts = _a.texts;
    if (!keys || !texts) {
        return [];
    }
    return sorted.map(function (one) {
        var total = _.reduce(keys, function (a, key) { return a + one[key]; }, 0);
        return {
            name: one.year.name + " (" + total + ")",
            data: _.map(_.zip(keys, texts), function (kt) {
                var key = kt[0];
                var label = kt[1] + " (" + one[key] + ")";
                return { label: label, value: par(one[key], total) };
            })
        };
    });
}
function par(n, total) {
    return Math.round(n / total * 1000) / 10;
}
//# sourceMappingURL=normalizer.js.map