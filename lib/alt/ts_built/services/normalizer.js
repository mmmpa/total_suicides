var _ = require('lodash');
var table_1 = require("../models/table");
var chart_set_1 = require("../models/chart-set");
var preData = null;
var preResult = null;
function normalize(data) {
    if (data == preData && preResult) {
        console.log('same data');
        return preResult;
    }
    preData = data;
    var result = [];
    _.each(data, function (container) {
        _.each(container, function (value, key) {
            var titleHeader = key != '結果' ? key + '::' : '';
            _.each(value, function (value) {
                var title = titleHeader + value.key;
                result.push({
                    title: title,
                    tables: _.map(value.value, function (value) {
                        var table = new table_1.default(value.key);
                        _.each(value.value, function (value) {
                            table.addRow(value.key, value.value);
                        });
                        table.finish();
                        var chart = tableToChart(table);
                        return { table: table, chart: chart };
                    })
                });
            });
        });
    });
    return preResult = result;
}
exports.normalize = normalize;
function tableToChart(table) {
    return chart_set_1.default.fromTable(table);
}
exports.tableToChart = tableToChart;
//# sourceMappingURL=normalizer.js.map