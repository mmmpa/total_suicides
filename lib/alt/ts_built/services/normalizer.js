var _ = require('lodash');
var table_1 = require("../models/table");
var chart_set_1 = require("../models/chart-set");
var constants_1 = require('../initializers/constants');
var preData = null;
var preResult = null;
function sliceRecord(data) {
}
exports.sliceRecord = sliceRecord;
function sliceRecordList(data, detailName) {
    console.log(data);
    var tableMap = _.find(constants_1.tableMaps, function (_a) {
        var key = _a.key;
        return key == detailName;
    }).value;
    var result = [];
    data.forEach(function (d) {
        var year = d.year, gender = d.gender, area = d.area;
        tableMap.forEach(function (_a) {
            var key = _a.key, name = _a.name;
            var tip = { year: year, gender: gender, area: area };
            tip[detailName] = {
                content: key,
                name: name
            };
            tip.value = d[key] ? d[key].number : 0;
            tip.per = d[key] ? d[key].per : 0;
            result.push(tip);
        });
    });
    return result;
}
exports.sliceRecordList = sliceRecordList;
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