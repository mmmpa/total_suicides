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
var BarChartComponent = (function (_super) {
    __extends(BarChartComponent, _super);
    function BarChartComponent(props) {
        _super.call(this, props);
        this.state = {
            normalized: []
        };
    }
    BarChartComponent.prototype.componentDidMount = function () {
        this.normalizeState(this.props);
    };
    BarChartComponent.prototype.componentWillReceiveProps = function (nextProps) {
        this.normalizeState(nextProps);
    };
    BarChartComponent.prototype.normalizeState = function (props) {
        var normalized = normalizer_1.normalizeBarData(props);
        this.setState({ normalized: normalized });
    };
    BarChartComponent.prototype.detectChartProp = function (props) {
        var split = props.split, table = props.table;
        if (split == 'area') {
            return constants_1.default.areaBarProps;
        }
        else if (split == 'gender') {
            return constants_1.default.genderBarProps;
        }
        return constants_1.default.barProps;
    };
    Object.defineProperty(BarChartComponent.prototype, "sectionClass", {
        get: function () {
            return 'bar-chart section';
        },
        enumerable: true,
        configurable: true
    });
    BarChartComponent.prototype.writeChart = function (dataList) {
        return React.createElement(D3.BarChart, React.__spread({"data": dataList, "fill": '#ffffff', "yAxisLabel": '人数', "xAxisLabel": '平成年'}, this.detectChartProp(this.props)));
    };
    BarChartComponent.prototype.writeCharts = function (normalizedList) {
        var _this = this;
        return _.map(normalizedList, function (normalized) {
            return React.createElement("section", {"key": normalized.title, "className": _this.sectionClass}, React.createElement("h1", null, normalized.title), _this.writeChart(normalized.dataList));
        });
    };
    BarChartComponent.prototype.writeChartList = function (normalized) {
        var _this = this;
        if (!_.isArray(normalized)) {
            return null;
        }
        return React.createElement("ul", {"className": "chart-list pies"}, normalized.map(function (data, index) {
            return React.createElement("li", {"className": "chart-list pie", "key": index}, _this.writeChart(data));
        }));
    };
    BarChartComponent.prototype.render = function () {
        return React.createElement("section", {"className": "bar-chart"}, this.writeCharts(this.state.normalized));
    };
    return BarChartComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BarChartComponent;
//# sourceMappingURL=bar-chart.js.map