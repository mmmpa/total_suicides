var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../lib/eventer');
var RotatedDataTable = (function (_super) {
    __extends(RotatedDataTable, _super);
    function RotatedDataTable() {
        _super.apply(this, arguments);
    }
    RotatedDataTable.prototype.render = function () {
        var _a = this.props, table = _a.table, par = _a.par;
        var sortedKeys = table.column;
        return React.createElement("section", null, React.createElement("table", {"className": "data-table rotated-data-table"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "-"), _.map(table.rowTitle, function (title, i) {
            return React.createElement("th", {"className": "rotated-data-table row-title", "key": i}, title);
        }))), React.createElement("tbody", null, _.map(sortedKeys.reverse(), function (key, i) {
            return React.createElement("tr", {"key": table.column[i]}, React.createElement("td", {"className": "rotated-data-table column-title", "key": -1}, table.column[i]), _.map(table.row, function (row, i) {
                return React.createElement("td", {"className": "rotated-data-table row-content", "key": i}, par ? row[key].par + '%' : row[key].number);
            }));
        }))));
    };
    return RotatedDataTable;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RotatedDataTable;
//# sourceMappingURL=data-table.js.map