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
    return Table;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Table;
//# sourceMappingURL=table.js.map