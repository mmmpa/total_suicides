var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../lib/eventer');
var constants_1 = require("../initializers/constants");
var _ = require('lodash');
var fa_1 = require('../lib/fa');
var ChartFinderComponent = (function (_super) {
    __extends(ChartFinderComponent, _super);
    function ChartFinderComponent(props) {
        console.log(props);
        var _a = props.params, base = _a.base, table = _a.table, x = _a.x, y = _a.y;
        this.state = { base: base, table: table, x: x, y: y };
    }
    ChartFinderComponent.prototype.link = function (e) {
        e.preventDefault();
        this.dispatch('link', e.currentTarget.getAttribute('href'));
    };
    ChartFinderComponent.prototype.detectIcon = function (split) {
        return split == 'gender' ? React.createElement(fa_1.default, {"icon": "venus-mars"}) : React.createElement(fa_1.default, {"icon": "globe"});
    };
    ChartFinderComponent.prototype.writeAllSelector = function (target, placeholder, used) {
        if (used === void 0) { used = []; }
        var all = [].concat(constants_1.default.metas, constants_1.default.tables);
        return React.createElement("select", {"className": "chart-finder selector", "key": target + "list", "defaultValue": this.state[target]}, React.createElement("option", {"name": target, "value": null, "key": target + "-default", "className": "placeholder"}, placeholder), _.map(all, function (_a) {
            var key = _a.key, name = _a.name;
            return React.createElement("option", {"name": target, "value": key, "key": target + "-" + key}, name);
        }));
    };
    ChartFinderComponent.prototype.writeYSelector = function () {
        return this.writeAllSelector('table', '（表の縦軸）');
    };
    ChartFinderComponent.prototype.writeXSelector = function () {
        return this.writeAllSelector('x', '（表の横軸）');
    };
    ChartFinderComponent.prototype.writeYSplitter = function () {
        return this.writeAllSelector('y', '（縦軸の分割 - オプション）');
    };
    ChartFinderComponent.prototype.render = function () {
        var link = this.link.bind(this);
        return React.createElement("div", null, React.createElement("article", {"className": "chart-finder body"}, React.createElement("section", {"className": "chart-finder section"}, React.createElement(fa_1.default, {"icon": "arrows-v"}), React.createElement("div", {"className": "chart-finder section-input"}, this.writeYSelector()), React.createElement("div", {"className": "chart-finder section-suffix"}, "の自殺者数を")), React.createElement("section", {"className": "chart-finder section"}, React.createElement(fa_1.default, {"icon": "arrows-h"}), React.createElement("div", {"className": "chart-finder section-input"}, this.writeXSelector()), React.createElement("div", {"className": "chart-finder section-suffix"}, "で並べて")), React.createElement("section", {"className": "chart-finder section"}, React.createElement("div", {"className": "chart-finder section-input"}, React.createElement("button", {"className": "chart-finder submit"}, React.createElement(fa_1.default, {"icon": "bar-chart"}), "表示する"))), React.createElement("section", {"className": "chart-finder section"}, React.createElement(fa_1.default, {"icon": "ellipsis-v"}), React.createElement("div", {"className": "chart-finder section-input"}, this.writeYSplitter()))));
    };
    return ChartFinderComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartFinderComponent;
//# sourceMappingURL=chart-finder.js.map