var _ = require('lodash');
var Table = (function () {
    function Table(title, column) {
        if (column === void 0) { column = []; }
        this.title = title;
        this.column = column;
        this.row = [];
        this.rowTitle = [];
        this.max = 0;
    }
    Table.prototype.addColumn = function (name) {
        this.column.push(name);
    };
    Table.prototype.addRow = function (title, row) {
        this.rowTitle.push(title);
        this.row.push(row);
    };
    Table.prototype.finish = function () {
        this.column = this.getColumn();
        this.max = this.getMax();
    };
    Table.prototype.getColumn = function () {
        return _.map(this.row[0], function (value) { return value.key; });
    };
    Table.prototype.getMax = function () {
        var _this = this;
        var m = 0;
        _.each(this.row, function (row, i) {
            if (_.includes(['総計', '総数', '全国'], _this.rowTitle[i])) {
                return;
            }
            var total = _.reduce(row, function (a, _a) {
                var key = _a.key, value = _a.value;
                if (row.length >= 2) {
                    if (_.includes(['総計', '総数', '全国'], key)) {
                        return null;
                    }
                }
                return a + value.number;
            }, 0);
            total > m && (m = total);
        });
        return m;
    };
    return Table;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Table;
//# sourceMappingURL=table.js.map