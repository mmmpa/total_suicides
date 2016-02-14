var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../lib/eventer');
var _ = require('lodash');
var header_1 = require('../components/header');
var copyright_1 = require('../components/copyright');
var chart_finder_1 = require('../components/chart-finder');
var V2Component = (function (_super) {
    __extends(V2Component, _super);
    function V2Component() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(V2Component.prototype, "children", {
        get: function () {
            var props = _.merge(_.clone(this.props), this.state);
            delete props.children;
            return React.cloneElement(this.props.children || React.createElement("div", null, "blank"), props || {});
        },
        enumerable: true,
        configurable: true
    });
    V2Component.prototype.render = function () {
        return React.createElement("div", {"className": "global-wrapper"}, React.createElement("header", {"className": "global-header"}, React.createElement(header_1.default, null)), React.createElement(chart_finder_1.default, React.__spread({}, this.props)), React.createElement("article", {"className": "main-content"}, this.children), React.createElement(chart_finder_1.default, React.__spread({}, this.props)), React.createElement(copyright_1.default, null));
    };
    return V2Component;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = V2Component;
//# sourceMappingURL=v2.js.map