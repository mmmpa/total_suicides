var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../../lib/eventer');
var ChartConfigurationComponent = (function (_super) {
    __extends(ChartConfigurationComponent, _super);
    function ChartConfigurationComponent() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(ChartConfigurationComponent.prototype, "autoScale", {
        get: function () {
            var autoScale = this.props.location.query.autoScale;
            return autoScale && autoScale != 'false';
        },
        enumerable: true,
        configurable: true
    });
    ChartConfigurationComponent.prototype.toggle = function (autoScale) {
        this.dispatch('chart:autoScale', autoScale);
    };
    ChartConfigurationComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null, React.createElement("section", {"className": "chart-config body"}, React.createElement("h1", {"className": "chart-config title"}, "チャート表示設定"), React.createElement("section", {"className": "chart-config auto-scale"}, React.createElement("label", null, React.createElement("span", {"className": "input-input"}, React.createElement("input", {"type": "radio", "name": "auto-scale", "checked": !this.autoScale, "onClick": function () { return _this.toggle(false); }})), React.createElement("span", {"className": "input-label"}, "Y軸最大値を統一する")), React.createElement("label", null, React.createElement("span", {"className": "input-input"}, React.createElement("input", {"type": "radio", "name": "auto-scale", "checked": this.autoScale, "onClick": function () { return _this.toggle(true); }})), React.createElement("span", {"className": "input-label"}, "Y軸を自動調整する")))));
    };
    return ChartConfigurationComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartConfigurationComponent;
//# sourceMappingURL=chart-configuration.js.map