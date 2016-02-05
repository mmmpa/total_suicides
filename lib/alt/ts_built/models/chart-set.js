var _ = require('lodash');
var ChartSet = (function () {
    function ChartSet(series, parSeries, data) {
        if (series === void 0) { series = []; }
        if (parSeries === void 0) { parSeries = []; }
        if (data === void 0) { data = []; }
        this.series = series;
        this.parSeries = parSeries;
        this.data = data;
    }
    ChartSet.fromTable = function (table) {
        var series = _.map(table.column, function (v, k) {
            return { field: v.key, name: v.name };
        });
        var parSeries = _.map(table.column, function (v, k) {
            return { field: v.key + 'par', name: v.name };
        });
        var data = _.map(table.rowTitle, function (title, i) {
            var result = { sort: title };
            _.each(table.row[i], function (v, k) {
                result[k] = v.number;
                result[k + 'par'] = v.par;
            });
            return result;
        });
        return new ChartSet(series, parSeries, data);
    };
    Object.defineProperty(ChartSet.prototype, "configuration", {
        get: function () {
            return {};
        },
        enumerable: true,
        configurable: true
    });
    return ChartSet;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartSet;
//# sourceMappingURL=chart-set.js.map