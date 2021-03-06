var _ = require('lodash');
var constants_1 = require('../initializers/constants');
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
        var series = _.compact(_.map(table.column, function (k) {
            if (table.column.length >= 2) {
                if (_.includes(['総計', '総数', '全国'], k)) {
                    return null;
                }
            }
            return { field: k, name: k, color: constants_1.detectColor(k) };
        }));
        var parSeries = _.compact(_.map(table.column, function (k) {
            if (table.column.length >= 2) {
                if (_.includes(['総計', '総数', '全国'], k)) {
                    return null;
                }
            }
            return { field: k + 'par', name: k, color: constants_1.detectColor(k) };
        }));
        var data = _.compact(_.map(table.rowTitle, function (title, i) {
            var result = { sort: title };
            _.each(table.row[i], function (row) {
                result[row.key] = row.value.number;
                result[row.key + 'par'] = row.value.par;
            });
            return result;
        }));
        return new ChartSet(series, parSeries, data);
    };
    return ChartSet;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartSet;
//# sourceMappingURL=chart-set.js.map