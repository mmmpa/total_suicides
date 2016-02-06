var _ = require('lodash');
var table_1 = require("../models/table");
function normalize(data) {
    var result = [];
    _.each(data, function (container) {
        _.each(container, function (value, key) {
            var titleHeader = key != '結果' ? key + '::' : '';
            _.each(value, function (value, key) {
                var title = titleHeader + key;
                result.push({
                    title: title,
                    tables: _.map(value, function (value, key) {
                        var table = new table_1.default(key);
                        _.each(value, function (value, key) {
                            table.addRow(key, value);
                        });
                        table.finish();
                        return table;
                    })
                });
            });
        });
    });
    return _.sortBy(result, function (r) { return r.title; }).reverse();
}
exports.normalize = normalize;
//# sourceMappingURL=normalizer.js.map