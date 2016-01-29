var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../lib/eventer');
var D3 = require('react-d3');
var constants_1 = require("../initializers/constants");
var _ = require('lodash');
var normalizer_1 = require('../services/normalizer');
var CircleGraphComponent = (function (_super) {
    __extends(CircleGraphComponent, _super);
    function CircleGraphComponent(props) {
        _super.call(this, props);
        this.state = {
            normalized: []
        };
    }
    CircleGraphComponent.prototype.componentDidMount = function () {
        this.normalizeState(this.props);
    };
    CircleGraphComponent.prototype.componentWillReceiveProps = function (nextProps) {
        this.normalizeState(nextProps);
    };
    CircleGraphComponent.prototype.normalizeState = function (props) {
        var normalized = normalizer_1.normalizePieData(props);
        this.setState({ normalized: normalized });
    };
    CircleGraphComponent.prototype.writeChart = function (data) {
        return React.createElement(D3.PieChart, React.__spread({"data": data.data, "title": data.name}, constants_1.default.pieProps));
    };
    CircleGraphComponent.prototype.writeCharts = function (normalized) {
        var _this = this;
        if (!_.isArray(normalized)) {
            return null;
        }
        return React.createElement("ul", {"className": "chart-list pies"}, normalized.map(function (data, index) {
            return React.createElement("li", {"className": "chart-list pie", "key": index}, _this.writeChart(data));
        }));
    };
    CircleGraphComponent.prototype.render = function () {
        return React.createElement("section", {"className": "pie-chart"}, this.writeCharts(this.state.normalized));
    };
    return CircleGraphComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CircleGraphComponent;
//# sourceMappingURL=circle-graph.js.map