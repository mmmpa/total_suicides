var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var react_dom_1 = require('react-dom');
var react_router_1 = require('react-router');
var createHistory = require('history/lib/createBrowserHistory');
var eventer_1 = require('./eventer');
var Child = (function (_super) {
    __extends(Child, _super);
    function Child() {
        _super.apply(this, arguments);
    }
    Child.prototype.render = function () {
        var _this = this;
        return React.createElement("div", {"onClick": function () { return _this.dispatch("increment"); }}, "app");
    };
    return Child;
})(eventer_1.Node);
var App = (function (_super) {
    __extends(App, _super);
    function App(props) {
        _super.call(this, props);
    }
    App.prototype.listen = function (to) {
        to('increment', function () { console.log('increment'); });
    };
    App.prototype.render = function () {
        return React.createElement("div", null, this.props.children);
    };
    return App;
})(eventer_1.Root);
react_dom_1.render((React.createElement(react_router_1.Router, {"history": new createHistory()}, React.createElement(react_router_1.Route, {"path": "/", "component": App}, React.createElement(react_router_1.Route, {"path": ":a", "component": Child}), React.createElement(react_router_1.Route, {"path": "/:b", "component": Child})))), document.querySelector('#app'));
//# sourceMappingURL=index.js.map