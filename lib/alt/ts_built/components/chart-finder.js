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
var SiteMapComponent = (function (_super) {
    __extends(SiteMapComponent, _super);
    function SiteMapComponent() {
        _super.apply(this, arguments);
    }
    SiteMapComponent.prototype.link = function (e) {
        e.preventDefault();
        this.dispatch('link', e.currentTarget.getAttribute('href'));
    };
    SiteMapComponent.prototype.detectIcon = function (split) {
        return split == 'gender' ? React.createElement(fa_1.default, {"icon": "venus-mars"}) : React.createElement(fa_1.default, {"icon": "globe"});
    };
    SiteMapComponent.prototype.writeAllSelector = function (target, placeholder, used) {
        if (used === void 0) { used = []; }
        var all = [].concat(constants_1.default.metas, constants_1.default.tables);
        return React.createElement("select", {"className": "chart-finder selector", "key": target + "list"}, React.createElement("option", {"name": target, "value": null, "key": target + "-default", "className": "placeholder"}, placeholder), _.map(all, function (_a) {
            var key = _a.key, name = _a.name;
            return React.createElement("option", {"name": target, "value": key, "key": target + "-" + key}, name);
        }));
    };
    SiteMapComponent.prototype.writeYSelector = function (state) {
        return this.writeAllSelector('y', '（表の縦軸）');
    };
    SiteMapComponent.prototype.writeXSelector = function (state) {
        return this.writeAllSelector('x', '（表の横軸）');
    };
    SiteMapComponent.prototype.writeYSplitter = function (state) {
        return this.writeAllSelector('splitter', '（縦軸の分割 - オプション）');
    };
    SiteMapComponent.prototype.render = function () {
        var link = this.link.bind(this);
        return React.createElement("div", null, React.createElement("article", {"className": "chart-finder body"}, React.createElement("section", {"className": "chart-finder section"}, React.createElement(fa_1.default, {"icon": "arrows-v"}), React.createElement("div", {"className": "chart-finder section-input"}, this.writeYSelector(this.state)), React.createElement("div", {"className": "chart-finder section-suffix"}, "の自殺者数を")), React.createElement("section", {"className": "chart-finder section"}, React.createElement(fa_1.default, {"icon": "arrows-h"}), React.createElement("div", {"className": "chart-finder section-input"}, this.writeXSelector(this.state)), React.createElement("div", {"className": "chart-finder section-suffix"}, "で並べて")), React.createElement("section", {"className": "chart-finder section"}, React.createElement("div", {"className": "chart-finder section-input"}, React.createElement("button", {"className": "chart-finder submit"}, React.createElement(fa_1.default, {"icon": "bar-chart"}), "表示する"))), React.createElement("section", {"className": "chart-finder section"}, React.createElement(fa_1.default, {"icon": "ellipsis-v"}), React.createElement("div", {"className": "chart-finder section-input"}, this.writeYSplitter(this.state)))));
    };
    return SiteMapComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SiteMapComponent;
//# sourceMappingURL=chart-finder.js.map