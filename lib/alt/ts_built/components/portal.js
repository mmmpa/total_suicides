var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../lib/eventer');
var _ = require('lodash');
var PortalComponent = (function (_super) {
    __extends(PortalComponent, _super);
    function PortalComponent() {
        _super.apply(this, arguments);
    }
    PortalComponent.prototype.link = function (uri) {
        this.dispatch('link', uri, null);
    };
    PortalComponent.prototype.componentDidMount = function () {
        var _this = this;
        _.each(document.querySelectorAll('#raw a'), function (a) {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                _this.link(e.target.href);
            });
        });
    };
    PortalComponent.prototype.render = function () {
        return React.createElement("div", {"id": "raw"}, React.createElement("div", {"dangerouslySetInnerHTML": { __html: this.props.indexSrc }}));
    };
    return PortalComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PortalComponent;
//# sourceMappingURL=portal.js.map