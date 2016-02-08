var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../../lib/eventer');
var _ = require('lodash');
var area_selector_1 = require('./area-selector');
var year_selector_1 = require('./year-selector');
var gender_selector_1 = require('./gender-selector');
var chart_configuration_1 = require('./chart-configuration');
var ChartControllerComponent = (function (_super) {
    __extends(ChartControllerComponent, _super);
    function ChartControllerComponent() {
        _super.apply(this, arguments);
    }
    ChartControllerComponent.prototype.writeSelector = function (props) {
        var split = props.split, table = props.table, sort = props.sort;
        var used = [split, table, sort];
        if (_.includes(used, 'area')) {
            return React.createElement(area_selector_1.default, React.__spread({}, props));
        }
        return null;
    };
    ChartControllerComponent.prototype.render = function () {
        return React.createElement("div", null, React.createElement("section", {"className": "chart-controller"}, React.createElement("h1", {"className": "chart-controller title"}, "表示内容の絞りこみ", React.createElement("em", null, "（チェックがない場合は、すべて選択されているあつかいになります）")), React.createElement(year_selector_1.default, React.__spread({}, this.props)), React.createElement(gender_selector_1.default, React.__spread({}, this.props)), React.createElement(area_selector_1.default, React.__spread({}, this.props))), React.createElement(chart_configuration_1.default, React.__spread({}, this.props)), React.createElement("article", {"className": "chart-content"}, React.cloneElement(this.props.children || React.createElement("div", null, "blank"), this.props || {})));
    };
    return ChartControllerComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartControllerComponent;
//# sourceMappingURL=chart-controller.js.map