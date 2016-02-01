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
    BarChartComponent.prototype.writeChart = function (normalized, max) {
        if (max === void 0) { max = 0; }
        var dataList = normalized.dataList, chartSeries = normalized.chartSeries;
        this.detectColor(chartSeries, this.props);
        return React.createElement(RD3.BarStackChart, React.__spread({"data": dataList, "chartSeries": chartSeries, x: function (d) { return d.year; }, "xScale": 'ordinal', "yTickFormat": d3.format(".2s"), "yLabel": '人数', "xLabel": '平成年', "yDomain": this.domain(max), "yLabelPosition": "right"}, this.detectChartProp(this.props)));
    };
    BarChartComponent.prototype.writeCharts = function (normalizedList) {
        var _this = this;
        var max = normalizedList.max, results = normalizedList.results;
        console.log(max);
        return _.map(results, function (normalized) {
            return React.createElement("section", {"key": normalized.title, "className": _this.sectionClass}, React.createElement("h1", null, normalized.title), _this.writeChart(normalized, max));
        });
    };
    BarChartComponent.prototype.render = function () {
        return React.createElement("div", null, React.createElement("article", {"className": "bar-chart body"}, React.createElement("section", {"className": "bar-chart"}, this.writeCharts(this.state.normalized))));
    };
    return BarChartComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BarChartComponent;
//# sourceMappingURL=bar-chart.js.map