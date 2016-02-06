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
        return _.map(this.row[0], function (value, key) { return key; });
    };
    Table.prototype.getMax = function () {
        var m = 0;
        _.each(this.row, function (r) {
            var total = _.reduce(r, function (a, _a) {
                var number = _a.number;
                return a + number;
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