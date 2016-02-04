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
        this.normalizeState(nextProps, this.props);
    };
    BarChartComponent.prototype.normalizeState = function (props, preProps) {
        if (preProps && props.data == preProps.data) {
            return;
        }
        var normalized = normalizer_1.normalizeStackBarData(props);
        this.setState({ normalized: normalized });
    };
    BarChartComponent.prototype.detectChartProp = function (dataList) {
        var defaultProps = constants_1.default.barProps;
        var minWidth = dataList.length * 100;
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
        chartSeries.map(function (c, i) { return c.color = constants_1.default.normalColor(c.field - 1); });
    };
    BarChartComponent.prototype.detectSeries = function (chartSeries, props) {
        return chartSeries.map(function (c) {
            var series = {};
            _.each(c, function (v, k) {
                series[k] = k == 'field' ? v + 'par' : v;
            });
            return series;
        });
    };
    BarChartComponent.prototype.writeChartSection = function (normalized) {
        var _this = this;
        var chartSeries = normalized.chartSeries, dataList = normalized.dataList, max = normalized.max;
        if (!dataList) {
            return null;
        }
        this.detectColor(chartSeries, this.props);
        //console.log(chartSeries = this.detectSeries(chartSeries, this.props));
        return _.map(dataList, function (chartData) {
            return React.createElement("section", {"key": chartData.title, "className": "chart-list chart-section"}, React.createElement("h1", null, chartData.title), _this.writeCharts(chartSeries, chartData.chartList, max));
        });
    };
    BarChartComponent.prototype.writeCharts = function (chartSeries, chartList, max) {
        var _this = this;
        return _.map(chartList, function (chartData) {
            return React.createElement("section", {"key": chartData.title, "className": "chart-list chart-block"}, React.createElement("h1", null, chartData.name), _this.writeChart(chartSeries, chartData.data, max));
        });
    };
    BarChartComponent.prototype.writeChart = function (chartSeries, chartData, max) {
        if (max === void 0) { max = 10000; }
        return React.createElement(RD3.BarStackChart, React.__spread({"data": chartData, "chartSeries": chartSeries, x: function (d) { return d.sort.name; }, "xScale": 'ordinal', "yTickFormat": d3.format(".2s"), "yLabel": '人数', "xLabel": '平成年', "yDomain": this.domain(max), "yLabelPosition": "right"}, this.detectChartProp(chartData)));
    };
    BarChartComponent.prototype.render = function () {
        return React.createElement("div", null, React.createElement("article", {"className": "chart-list body"}, this.writeChartSection(this.state.normalized)));
    };
    return BarChartComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BarChartComponent;
//# sourceMappingURL=stack-bar-chart.js.map