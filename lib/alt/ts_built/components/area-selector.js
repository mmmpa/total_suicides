var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../lib/eventer');
var constants_1 = require("../initializers/constants");
var _ = require('lodash');
var AreaSelectorComponent = (function (_super) {
    __extends(AreaSelectorComponent, _super);
    function AreaSelectorComponent() {
        _super.apply(this, arguments);
    }
    AreaSelectorComponent.prototype.toggle = function (e) {
        var selected = (this.props.location.query.area || '').split(',').map(function (n) { return +n; });
        var key = +e.target.value;
        if (_.includes(selected, key)) {
            this.dispatch('area:select', _.without(selected, key));
        }
        else {
            this.dispatch('area:select', selected.concat([key]));
        }
    };
    AreaSelectorComponent.prototype.writeSelector = function (props) {
        var _this = this;
        console.log();
        var selected = (props.location.query.area || '').split(',').map(function (n) { return +n; });
        var areas = constants_1.default.areas;
        return areas.map(function (area) {
            var key = area.key, text = area.text;
            return React.createElement("li", {"className": "area-selector selector", "key": key}, React.createElement("label", null, React.createElement("span", {"className": "input-input"}, React.createElement("input", {"type": "checkbox", "value": key, "checked": _.includes(selected, key), "onChange": _this.toggle.bind(_this)})), React.createElement("span", {"className": "input-label"}, text)));
        });
    };
    AreaSelectorComponent.prototype.render = function () {
        return React.createElement("div", null, React.createElement("section", {"className": "area-selector body"}, React.createElement("ul", {"className": "area-selector area-list"}, this.writeSelector(this.props))));
    };
    return AreaSelectorComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AreaSelectorComponent;
//# sourceMappingURL=area-selector.js.map