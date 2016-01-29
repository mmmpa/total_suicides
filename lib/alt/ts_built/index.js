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
var preset_graph_1 = require("./contexts/preset-graph");
var simple_graph_1 = require("./components/simple-graph");
var circle_graph_1 = require("./components/circle-graph");
var fetcher_1 = require('./services/fetcher');
var Child = (function (_super) {
    __extends(Child, _super);
    function Child() {
        _super.apply(this, arguments);
    }
    Child.prototype.render = function () {
        var _this = this;
        console.log(this.props);
        return React.createElement("div", {"onClick": function () { return _this.dispatch("increment"); }}, "app");
    };
    return Child;
})(eventer_1.Node);
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
    App.prototype.componentDidMount = function () {
        this.normalizeRouteParams(this.props);
        this.fetchData(this.props);
    };
    App.prototype.componentWillReceiveProps = function (nextProps) {
        this.normalizeRouteParams(nextProps);
        this.fetchData(nextProps);
    };
    App.prototype.fetchData = function (props) {
        var _this = this;
        var presetName = props.params.presetName;
        if (!!presetName) {
            return fetcher_1.fetchPreset(presetName, function (state) {
                _this.setState(state);
            });
        }
        if (this.needFetch(props)) {
            fetcher_1.fetchWithParams(props, function (state) {
                _this.setState(state);
            });
        }
    };
    App.prototype.needFetch = function (props) {
        var _a = props.params, table = _a.table, horizontal = _a.horizontal, vertical = _a.vertical;
        return !!table && !!horizontal && !!vertical;
    };
    App.prototype.normalizeRouteParams = function (props) {
        console.log(props);
    };
    App.prototype.listen = function (to) {
        to('increment', function () {
            console.log('app increment');
        });
        to('get:way', function (gender, year, area) {
        });
    };
    return App;
})(eventer_1.Root);
react_dom_1.render((React.createElement(react_router_1.Router, {"history": new CreateHistory()}, React.createElement(react_router_1.Route, {"path": "/", "component": App}, React.createElement(react_router_1.Route, {"path": "preset", "component": preset_graph_1.default}, React.createElement(react_router_1.Route, {"path": "child", "component": Child}), React.createElement(react_router_1.Route, {"path": "way/:gender/:year/:area", "component": simple_graph_1.default, "myprops": "a"})), React.createElement(react_router_1.Route, {"path": "circle", "component": preset_graph_1.default}, React.createElement(react_router_1.Route, {"path": ":presetName", "component": circle_graph_1.default, "myprops": "a"}), React.createElement(react_router_1.Route, {"path": ":table/:split/:horizontal/:vertical/:rotation", "component": circle_graph_1.default, "myprops": "a"}))))), document.querySelector('#app'));
//# sourceMappingURL=index.js.map