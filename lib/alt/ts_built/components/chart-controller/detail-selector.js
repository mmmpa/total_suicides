var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../../lib/eventer');
var constants_1 = require("../../initializers/constants");
var _ = require('lodash');
var fa_1 = require("../../lib/fa");
var AreaSelectorComponent = (function (_super) {
    __extends(AreaSelectorComponent, _super);
    function AreaSelectorComponent() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(AreaSelectorComponent.prototype, "selected", {
        get: function () {
            return this.props.selected;
        },
        enumerable: true,
        configurable: true
    });
    AreaSelectorComponent.prototype.toggle = function (e) {
        this.dispatch('chart:detail', e.target.value);
    };
    AreaSelectorComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null, React.createElement("section", {"className": "selector-area area-selector body"}, React.createElement("h1", {"className": "selector-area title"}, React.createElement(fa_1.default, {"icon": "globe"}), "詳細"), _.map(constants_1.tables, function (table) {
            return React.createElement("li", {"className": "detail-selector selector", "key": "detail-selector-" + table.key}, React.createElement("label", null, React.createElement("span", {"className": "input-input"}, React.createElement("input", {"type": "radio", "value": table.key, "checked": _this.selected == table.key, "onChange": _this.toggle.bind(_this)})), React.createElement("span", {"className": "input-label"}, table.name)));
        })));
    };
    return AreaSelectorComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AreaSelectorComponent;
//# sourceMappingURL=detail-selector.js.map