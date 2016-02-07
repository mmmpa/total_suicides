var _ = require('lodash');
var table_1 = require("../models/table");
function normalize(data) {
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
                        return table;
                    })
                });
            });
        });
    });
    return result;
}
exports.normalize = normalize;
//# sourceMappingURL=normalizer.js.map