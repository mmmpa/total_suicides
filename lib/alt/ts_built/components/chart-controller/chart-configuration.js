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
            return this.props.autoScale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartConfigurationComponent.prototype, "par", {
        get: function () {
            return this.props.par;
        },
        enumerable: true,
        configurable: true
    });
    ChartConfigurationComponent.prototype.toggleScale = function (autoScale) {
        this.dispatch('chart:autoScale', autoScale);
    };
    ChartConfigurationComponent.prototype.togglePar = function (par) {
        this.dispatch('chart:par', par);
    };
    ChartConfigurationComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null, React.createElement("section", {"className": "chart-config body"}, React.createElement("section", {"className": "chart-config auto-scale"}, React.createElement("label", null, React.createElement("span", {"className": "input-input"}, React.createElement("input", {"type": "radio", "name": "auto-scale", "defaultChecked": !this.autoScale, "onClick": function () { return _this.toggleScale(false); }})), React.createElement("span", {"className": "input-label"}, "Y軸最大値を統一する")), React.createElement("label", null, React.createElement("span", {"className": "input-input"}, React.createElement("input", {"type": "radio", "name": "auto-scale", "defaultChecked": this.autoScale, "onClick": function () { return _this.toggleScale(true); }})), React.createElement("span", {"className": "input-label"}, "Y軸を自動調整する"))), React.createElement("section", {"className": "chart-config auto-scale"}, React.createElement("label", null, React.createElement("span", {"className": "input-input"}, React.createElement("input", {"type": "radio", "name": "par", "defaultChecked": !this.par, "onClick": function () { return _this.togglePar(false); }})), React.createElement("span", {"className": "input-label"}, "人数で表示する")), React.createElement("label", null, React.createElement("span", {"className": "input-input"}, React.createElement("input", {"type": "radio", "name": "par", "defaultChecked": this.par, "onClick": function () { return _this.togglePar(true); }})), React.createElement("span", {"className": "input-label"}, "率で表示する")))));
    };
    return ChartConfigurationComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartConfigurationComponent;
//# sourceMappingURL=chart-configuration.js.map