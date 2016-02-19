var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../lib/eventer');
var fa_1 = require('../lib/fa');
var HeaderComponent = (function (_super) {
    __extends(HeaderComponent, _super);
    function HeaderComponent() {
        _super.apply(this, arguments);
    }
    HeaderComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null, React.createElement("section", {"className": "header body"}, React.createElement("h1", {"className": "header title"}, React.createElement("a", {"onClick": function () { return _this.dispatch('link', '/'); }}, React.createElement(fa_1.default, {"icon": "heart"}), "自殺を知る、自殺を考える :: 自殺者数チャート"))));
    };
    return HeaderComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HeaderComponent;
//# sourceMappingURL=header.js.map