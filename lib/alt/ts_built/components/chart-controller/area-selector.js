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
        var key = +e.target.value;
        if (_.includes(this.selected, key)) {
            this.dispatch('chart:area', _.without(this.selected, key));
        }
        else {
            this.dispatch('chart:area', this.selected.concat([key]));
        }
    };
    AreaSelectorComponent.prototype.selectAll = function (selectKeys) {
        this.dispatch('chart:area', _.union(this.selected, selectKeys));
    };
    AreaSelectorComponent.prototype.deselectAll = function (deselectKeys) {
        this.dispatch('chart:area', _.without.apply(_, [this.selected].concat(deselectKeys)));
    };
    AreaSelectorComponent.prototype.writeWideArea = function (separatedAreas, props) {
        var _this = this;
        return separatedAreas.map(function (wideArea) {
            return React.createElement("section", {"className": "area-selector wide-area-section", "key": "wide-area-selector-" + wideArea.name}, _this.writeSmallArea(wideArea.areas, props));
        });
    };
    AreaSelectorComponent.prototype.writeSmallArea = function (areas, props) {
        var _this = this;
        var wideKeys = _.map(areas, function (_a) {
            var key = _a.key;
            return key;
        });
        return React.createElement("section", {"className": "area-selector small-area-section"}, React.createElement("div", {"className": "area-selector select-all"}, React.createElement("p", null, React.createElement(fa_1.default, {"icon": "check"}), React.createElement("a", {"onClick": function () { return _this.selectAll(wideKeys); }}, "選択")), React.createElement("p", null, React.createElement(fa_1.default, {"icon": "trash"}), React.createElement("a", {"onClick": function () { return _this.deselectAll(wideKeys); }}, "解除"))), React.createElement("ul", {"className": "area-selector area-list"}, _.map(areas, function (area) {
            return React.createElement("li", {"className": "area-selector selector", "key": "small-area-selector-" + area.key}, React.createElement("label", null, React.createElement("span", {"className": "input-input"}, React.createElement("input", {"type": "checkbox", "value": area.key, "checked": _.includes(_this.selected, area.key), "onChange": _this.toggle.bind(_this)})), React.createElement("span", {"className": "input-label"}, area.name)));
        })));
    };
    AreaSelectorComponent.prototype.render = function () {
        var separatedAreas = constants_1.default.separatedAreas;
        return React.createElement("div", null, React.createElement("section", {"className": "selector-area area-selector body"}, React.createElement("h1", {"className": "selector-area title"}, React.createElement(fa_1.default, {"icon": "globe"}), "地域"), this.writeWideArea(separatedAreas, this.props)));
    };
    return AreaSelectorComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AreaSelectorComponent;
//# sourceMappingURL=area-selector.js.map