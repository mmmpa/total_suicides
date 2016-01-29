var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var eventer_1 = require('../lib/eventer');
var SimpleGraph = (function (_super) {
    __extends(SimpleGraph, _super);
    function SimpleGraph() {
        _super.apply(this, arguments);
    }
    SimpleGraph.prototype.componentDidMount = function () {
    };
    SimpleGraph.prototype.render = function () {
        var _this = this;
        console.log(this.props);
        return React.createElement("div", {"onClick": function () { return _this.dispatch("increment"); }}, "app");
    };
    return SimpleGraph;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SimpleGraph;
//# sourceMappingURL=simple-grapth.js.map