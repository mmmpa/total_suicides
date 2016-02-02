var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../lib/eventer');
var CopyrightComponent = (function (_super) {
    __extends(CopyrightComponent, _super);
    function CopyrightComponent() {
        _super.apply(this, arguments);
    }
    CopyrightComponent.prototype.render = function () {
        return React.createElement("div", null, React.createElement("section", {"className": "copyright body"}, React.createElement("address", null, React.createElement("a", {"href": "http://twitter.com/o296sm"}, "@o296sm"))));
    };
    return CopyrightComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CopyrightComponent;
//# sourceMappingURL=copyright.js.map