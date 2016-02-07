var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../../lib/eventer');
var constants_1 = require("../../initializers/constants");
var _ = require('lodash');
var AreaSelectorComponent = (function (_super) {
    __extends(AreaSelectorComponent, _super);
    function AreaSelectorComponent() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(AreaSelectorComponent.prototype, "selected", {
        get: function () {
            var area = this.props.location.query.area;
            if (!area) {
                return [];
            }
            return area.split(',').map(function (n) { return +n; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AreaSelectorComponent.prototype, "separated", {
        get: function () {
        },
        enumerable: true,
        configurable: true
    });
    AreaSelectorComponent.prototype.toggle = function (e) {
        var key = +e.target.value;
        if (_.includes(this.selected, key)) {
            this.dispatch('area:select', _.without(this.selected, key));
        }
        else {
            this.dispatch('area:select', this.selected.concat([key]));
        }
    };
    AreaSelectorComponent.prototype.writeWideArea = function (separatedAreas, props) {
        var _this = this;
        return separatedAreas.map(function (wideArea) {
            return React.createElement("secsion", {"className": "area-selector wide-area-section"}, React.createElement("h1", {"className": "area-selector wide-area-title"}, wideArea.name), _this.writeSmallArea(wideArea.areas, props));
        });
    };
    AreaSelectorComponent.prototype.writeSmallArea = function (areas, props) {
        var _this = this;
        return React.createElement("ul", {"className": "area-selector area-list"}, _.map(areas, function (area) {
            return React.createElement("li", {"className": "area-selector selector", "key": area.key}, React.createElement("label", null, React.createElement("span", {"className": "input-input"}, React.createElement("input", {"type": "checkbox", "value": area.key, "checked": _.includes(_this.selected, area.key), "onChange": _this.toggle.bind(_this)})), React.createElement("span", {"className": "input-label"}, area.name)));
        }));
    };
    AreaSelectorComponent.prototype.render = function () {
        var separatedAreas = constants_1.default.separatedAreas;
        return React.createElement("div", null, React.createElement("section", {"className": "selector-area area-selector body"}, this.writeWideArea(separatedAreas, this.props)));
    };
    return AreaSelectorComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AreaSelectorComponent;
//# sourceMappingURL=area-selector.js.map