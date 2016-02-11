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
var GenderSelectorComponent = (function (_super) {
    __extends(GenderSelectorComponent, _super);
    function GenderSelectorComponent() {
        _super.apply(this, arguments);
    }
    GenderSelectorComponent.prototype.isChecked = function (key) {
        return _.includes(this.selected, key);
    };
    Object.defineProperty(GenderSelectorComponent.prototype, "selected", {
        get: function () {
            return this.props.selected;
        },
        enumerable: true,
        configurable: true
    });
    GenderSelectorComponent.prototype.toggle = function (key) {
        var now = this.selected;
        if (this.isChecked(key)) {
            now = _.without(now, key);
        }
        else {
            now.push(key);
        }
        this.dispatch('chart:gender', now);
    };
    GenderSelectorComponent.prototype.selectAll = function () {
        this.dispatch('chart:gender', [1, 2]);
    };
    GenderSelectorComponent.prototype.deselectAll = function () {
        this.dispatch('chart:gender', []);
    };
    GenderSelectorComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null, React.createElement("section", {"className": "selector-area gender-selector body"}, React.createElement("h1", {"className": "selector-area title"}, React.createElement(fa_1.default, {"icon": "venus-mars"}), "性別"), React.createElement("div", {"className": "selector-area select-all"}, React.createElement("p", null, React.createElement(fa_1.default, {"icon": "check"}), React.createElement("a", {"onClick": function () { return _this.selectAll(); }}, "選択")), React.createElement("p", null, React.createElement(fa_1.default, {"icon": "trash"}), React.createElement("a", {"onClick": function () { return _this.deselectAll(); }}, "解除"))), React.createElement("section", {"className": "selector-area selector-list"}, _.map(constants_1.default.genders, function (_a) {
            var key = _a.key, name = _a.name;
            return React.createElement("div", {"key": "gender-selector-" + key}, React.createElement("label", null, React.createElement("span", {"className": "input-input"}, React.createElement("input", {"type": "checkbox", "name": "year", "checked": _this.isChecked(key), "onChange": function () { return _this.toggle(key); }})), React.createElement("span", {"className": "input-label"}, name)));
        }))));
    };
    return GenderSelectorComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GenderSelectorComponent;
//# sourceMappingURL=gender-selector.js.map