var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var react_dom_1 = require('react-dom');
var react_router_1 = require('react-router');
var CreateHistory = require('history/lib/createBrowserHistory');
var eventer_1 = require('./lib/eventer');
var chart_1 = require("./contexts/chart");
var stack_bar_chart_1 = require("./components/stack-bar-chart");
var common_1 = require("./components/common");
var chart_controller_1 = require("./components/chart-controller/chart-controller");
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.initialState = function (props) {
        return {
            from: 'app',
            data: {}
        };
    };
    App.prototype.normalizeQuery = function (uri, props) {
        var query = props.location.query;
        if (uri.indexOf('/area/') == -1) {
            delete query.area;
        }
        return query;
    };
    App.prototype.listen = function (to) {
        var _this = this;
        to('link', function (uri) {
            window.scrollTo(0, 0);
            _this.props.history.pushState(null, uri, _this.normalizeQuery(uri, _this.props));
        });
        to('link:navigator', function () {
            window.scrollTo(0, window.innerHeight);
        });
    };
    return App;
})(eventer_1.Root);
react_dom_1.render((React.createElement(react_router_1.Router, {"history": new CreateHistory()}, React.createElement(react_router_1.Route, {"path": "/", "component": App}, React.createElement(react_router_1.Route, {"path": "", "component": common_1.default}, React.createElement(react_router_1.Route, {"path": "chart", "component": chart_1.default}, React.createElement(react_router_1.Route, {"path": "", "component": chart_controller_1.default}, React.createElement(react_router_1.Route, {"path": ":base/:table/:x/:y", "component": stack_bar_chart_1.default}))))))), document.querySelector('#app'));
//# sourceMappingURL=index.js.map