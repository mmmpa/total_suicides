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
        return React.createElement("section", {"key": table.title}, React.createElement("table", {"className": "data-table rotated-data-table"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {"key": -1}, "-"), _.map(table.rowTitle, function (title, i) {
            return React.createElement("th", {"className": "rotated-data-table row-title", "key": i}, title);
        }))), React.createElement("tbody", null, _.map(sortedKeys, function (key, i) {
            return React.createElement("tr", {"key": table.column[i]}, React.createElement("td", {"className": "rotated-data-table column-title", "key": -1}, table.column[i]), _.map(table.row, function (row, ii) {
                var value = row[i].value;
                return React.createElement("td", {"className": "rotated-data-table row-content", "key": ii}, par ? value.par + '%' : value.number);
            }));
        }).reverse())));
    };
    return RotatedDataTable;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RotatedDataTable;
//# sourceMappingURL=data-table.js.map