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
    PortalComponent.prototype.link = function (uri, query) {
        this.dispatch('link', uri, query);
    };
    PortalComponent.prototype.componentDidMount = function () {
        var _this = this;
        this.dispatch('title');
        _.each(document.querySelectorAll('#raw .inner-link a'), function (a) {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                var anchor = e.target;
                _this.link(anchor.href.replace(/.+?:\/\/.+?\//, '/'), {});
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