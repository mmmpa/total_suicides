var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../lib/eventer');
var site_map_1 = require('../components/site-map');
var header_1 = require('../components/header');
var CommonComponent = (function (_super) {
    __extends(CommonComponent, _super);
    function CommonComponent() {
        _super.apply(this, arguments);
    }
    CommonComponent.prototype.render = function () {
        return React.createElement("div", {"className": "global-wrapper"}, React.createElement("header", {"className": "global-header"}, React.createElement(header_1.default, null)), React.createElement("article", {"className": "main-content"}, React.cloneElement(this.props.children || React.createElement("div", null, "blank"), this.props || {})), React.createElement("footer", {"className": "global-footer"}, React.createElement(site_map_1.default, null)));
    };
    return CommonComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CommonComponent;
//# sourceMappingURL=common.js.map