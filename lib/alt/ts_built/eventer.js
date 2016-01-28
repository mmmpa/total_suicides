var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require('events');
var React = require('react');
exports.EventingShared = { emitter: React.PropTypes.object };
var Root = (function (_super) {
    __extends(Root, _super);
    function Root(props) {
        var _this = this;
        _super.call(this, props);
        this.emitter = new events_1.EventEmitter();
        this.listen(function (eventname, callback) {
            _this.emitter.on(eventname, callback);
        });
    }
    Object.defineProperty(Root, "childContextTypes", {
        get: function () {
            return exports.EventingShared;
        },
        enumerable: true,
        configurable: true
    });
    Root.prototype.getChildContext = function () {
        return { emitter: this.emitter };
    };
    return Root;
})(React.Component);
exports.Root = Root;
var Node = (function (_super) {
    __extends(Node, _super);
    function Node() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Node, "contextTypes", {
        get: function () {
            return exports.EventingShared;
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.dispatch = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (_a = this.context.emitter).emit.apply(_a, [event].concat(args));
        var _a;
    };
    return Node;
})(React.Component);
exports.Node = Node;
//# sourceMappingURL=eventer.js.map