var _ = require('lodash');
var Table = (function () {
    function Table(title, column) {
        if (column === void 0) { column = []; }
        this.title = title;
        this.column = column;
        this.row = [];
        this.rowTitle = [];
    }
    Table.prototype.addColumn = function (name) {
        this.column.push(name);
    };
    Table.prototype.addRow = function (title, row) {
        this.rowTitle.push(title);
        this.row.push(row);
    };
    Object.defineProperty(Table.prototype, "max", {
        get: function () {
            var m = 0;
            _.each(this.row, function (r) {
                var total = _.reduce(r, function (a, _a) {
                    var number = _a.number;
                    return a + number;
                }, 0);
                total > m && (m = total);
            });
            return m;
        },
        enumerable: true,
        configurable: true
    });
    return Table;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Table;
//# sourceMappingURL=table.js.map