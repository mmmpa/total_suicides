var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../lib/eventer');
var d3 = require('d3');
var constants_1 = require("../initializers/constants");
var _ = require('lodash');
var normalizer_1 = require('../services/normalizer');
var RD3 = require('react-d3-basic');
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
        var normalized = normalizer_1.normalizeStackBarData(props);
        this.setState({ normalized: normalized });
    };
    BarChartComponent.prototype.detectChartProp = function (dataList) {
        var defaultProps = constants_1.default.barProps;
        var minWidth = dataList.length * 70;
        defaultProps.width < minWidth && (defaultProps.width = minWidth);
        return defaultProps;
    };
    Object.defineProperty(BarChartComponent.prototype, "sectionClass", {
        get: function () {
            return 'bar-chart section';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BarChartComponent.prototype, "autoScale", {
        get: function () {
            var autoScale = this.props.location.query.autoScale;
            return autoScale && autoScale != 'false';
        },
        enumerable: true,
        configurable: true
    });
    BarChartComponent.prototype.domain = function (max) {
        return this.autoScale ? null : [0, max];
    };
    BarChartComponent.prototype.detectColor = function (chartSeries, props) {
        chartSeries.map(function (c, i) { return c.color = constants_1.default.normalColor(i); });
    };
    BarChartComponent.prototype.writeChart = function (chartSeries, chartData, max) {
        if (max === void 0) { max = 10000; }
        var data = chartData.data;
        var dataList = _.map(data, function (value) { return value; });
        return React.createElement(RD3.BarStackChart, React.__spread({"data": dataList, "chartSeries": chartSeries, x: function (d) { return d.sort.name; }, "xScale": 'ordinal', "yTickFormat": d3.format(".2s"), "yLabel": '人数', "xLabel": '平成年', "yDomain": this.domain(max), "yLabelPosition": "right"}, this.detectChartProp(dataList)));
    };
    BarChartComponent.prototype.writeCharts = function (normalized) {
        var _this = this;
        var chartSeries = normalized.chartSeries, chart = normalized.chart, max = normalized.max;
        if (!chart) {
            return null;
        }
        this.detectColor(chartSeries, this.props);
        return _.map(chart, function (chartData) {
            return React.createElement("section", {"key": chartData.title, "className": _this.sectionClass}, React.createElement("h1", null, chartData.title), _this.writeChart(chartSeries, chartData, max));
        });
    };
    BarChartComponent.prototype.render = function () {
        return React.createElement("div", null, React.createElement("article", {"className": "bar-chart body"}, React.createElement("section", {"className": "bar-chart"}, this.writeCharts(this.state.normalized))));
    };
    return BarChartComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BarChartComponent;
//# sourceMappingURL=stack-bar-chart.js.map