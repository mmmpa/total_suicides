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
                return { label: label, value: Math.round(one[key] / total * 1000) / 10 };
            })
        };
    });
}
exports.normalizePieData = normalizePieData;
//# sourceMappingURL=normalizer.js.map