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
var portal_1 = require("./components/portal");
var common_1 = require("./components/common");
var chart_controller_1 = require("./components/chart-controller/chart-controller");
var v2_1 = require('./contexts/v2');
var chart_2 = require('./components/v2/chart');
var chart_finder_1 = require('./components/v2/chart-finder');
var index = document.querySelector('#index');
index.style.display = 'none';
var indexSrc = index.innerHTML;
var data = document.querySelector('#data');
data && (data.style.display = 'none');
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.initialState = function (props) {
        return { indexSrc: indexSrc };
    };
    App.prototype.listen = function (to) {
        var _this = this;
        to('link', function (uri, query, calm) {
            calm || window.scrollTo(0, 0);
            ga('send', 'pageview', 'uri');
            _this.props.history.pushState(null, uri, query);
        });
        to('title', function (sub) {
            var base = '自殺を知る、自殺を考える :: 自殺者数チャート';
            sub && (base += '::' + sub);
            document.title = base;
        });
    };
    return App;
})(eventer_1.Root);
react_dom_1.render((React.createElement(react_router_1.Router, {"history": new CreateHistory()}, React.createElement(react_router_1.Route, {"path": "", "component": App}, React.createElement(react_router_1.Route, {"path": "", "component": common_1.default}, React.createElement(react_router_1.Route, {"path": "v2", "component": v2_1.default}, React.createElement(react_router_1.Route, {"path": "finder", "component": chart_finder_1.default}), React.createElement(react_router_1.Route, {"path": "chart", "component": chart_2.default})), React.createElement(react_router_1.Route, {"path": "chart", "component": chart_1.default}, React.createElement(react_router_1.Route, {"path": "", "component": chart_controller_1.default})), React.createElement(react_router_1.Route, {"path": "", "component": v2_1.default}, React.createElement(react_router_1.Route, {"path": "*", "component": portal_1.default})))))), document.querySelector('#app'));
//# sourceMappingURL=index.js.map