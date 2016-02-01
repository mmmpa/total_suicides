var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../lib/eventer');
var area_selector_1 = require('./area-selector');
var chart_configuration_1 = require('./chart-configuration');
var ChartControllerComponent = (function (_super) {
    __extends(ChartControllerComponent, _super);
    function ChartControllerComponent() {
        _super.apply(this, arguments);
    }
    ChartControllerComponent.prototype.writeSelector = function (props) {
        var split = props.split, table = props.table;
        if (split == 'area' || table == 'area') {
            return React.createElement(area_selector_1.default, React.__spread({}, props));
        }
        return null;
    };
    ChartControllerComponent.prototype.render = function () {
        return React.createElement("div", null, React.createElement(chart_configuration_1.default, React.__spread({}, this.props)), this.writeSelector(this.props), React.createElement("article", {"className": "chart-content"}, React.cloneElement(this.props.children || React.createElement("div", null, "blank"), this.props || {})));
    };
    return ChartControllerComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartControllerComponent;
//# sourceMappingURL=chart-controller.js.map