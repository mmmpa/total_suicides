var constants_1 = require("../initializers/constants");
function sortData(props) {
    var split = props.split, data = props.data;
    if (!data) {
        return [];
    }
    switch (split) {
        case 'year':
            return _.sortBy(data, function (el) { return el.year.content; });
        default:
            return props.data;
    }
}
function normalizePieData(props) {
    var sorted = sortData(props);
    switch (props.table) {
        case 'day':
            var dayKeys = constants_1.default.dayKeys, dayTexts = constants_1.default.dayTexts;
            return sorted.map(function (one) {
                var total = _.reduce(dayKeys, function (a, key) { return a + one[key]; }, 0);
                return {
                    name: one.year.name + " (" + total + ")",
                    data: _.map(_.zip(dayKeys, dayTexts), function (kt) {
                        var key = kt[0];
                        var label = kt[1] + " (" + one[key] + ")";
                        return { label: label, value: Math.round(one[key] / total * 1000) / 10 };
                    })
                };
            });
        default:
            return sorted;
    }
}
exports.normalizePieData = normalizePieData;
//# sourceMappingURL=normalizer.js.map