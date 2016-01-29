var constants_1 = require("../initializers/constants");
function sortData(props) {
    var split = props.split, data = props.data;
    if (!data) {
        return [];
    }
    switch (split) {
        case 'year':
            return _.sortBy(data, function (el) { return el.year.content; });
        case 'gender':
            return _.sortBy(data, function (el) { return el.gender.content; });
        case 'area':
            return _.sortBy(data, function (el) { return el.area.content; });
        default:
            return props.data;
    }
}
function detectChartProps(props) {
    return constants_1.default[(props.table + "Props")] || {};
}
function normalizePieData(props) {
    switch (props.params.split) {
        case 'area':
            return normalizePieData(props);
        case 'gender':
            return normalizePieData(props);
        default:
            return normalizePieDataYear(props);
    }
}
exports.normalizePieData = normalizePieData;
function normalizePieData(props) {
    var sorted = sortData(props);
    var _a = detectChartProps(props), keys = _a.keys, texts = _a.texts;
    if (!keys || !texts) {
        return [];
    }
    var elements = constants_1.default[(props.split + "s")];
    var normalized = {};
    sorted.map(function (data) {
        keys.map(function (key) {
            if (!normalized[key]) {
                normalized[key] = {};
            }
            var sortKey = data[props.split].content;
            normalized[key][sortKey] = data[key];
        });
    });
    console.log(normalized);
    return _.map(_.zip(keys, texts), function (kt) {
        var key = kt[0];
        var title = kt[1];
        var data = normalized[key];
        var elementKeys = elements.map(function (e) { return e.key; });
        console.log(key);
        var total = _.reduce(elementKeys, function (a, ek) {
            return a + data[ek];
        }, 0);
        return {
            name: title + " (" + total + ")",
            data: _.sortBy(_.compact(elements.map(function (el) {
                if (data[el.key] == 0) {
                    return null;
                }
                var label = el.text + " (" + data[el.key] + ")";
                return { label: label, value: par(data[el.key], total) };
            })), function (d) { return props.split == 'gender' ? 0 : -d.value; })
        };
    });
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