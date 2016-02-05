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
var RD3 = require('react-d3-basic');
var data_table_1 = require("./data-table");
var StackBarChartComponent = (function (_super) {
    __extends(StackBarChartComponent, _super);
    function StackBarChartComponent() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(StackBarChartComponent.prototype, "autoScale", {
        get: function () {
            var autoScale = this.props.location.query.autoScale;
            return autoScale && autoScale != 'false';
        },
        enumerable: true,
        configurable: true
    });
    StackBarChartComponent.prototype.domain = function (max) {
        return !max || this.autoScale ? null : [0, max];
    };
    StackBarChartComponent.prototype.arrangeChartProp = function (data) {
        var defaultProps = constants_1.default.barProps;
        var minWidth = data.length * 100;
        defaultProps.width < minWidth && (defaultProps.width = minWidth);
        return defaultProps;
    };
    StackBarChartComponent.prototype.arrangeSeries = function (series, parSeries) {
        return _.map(series, function (_a) {
            var field = _a.field, name = _a.name;
            var color = constants_1.default.normalColor(field - 1);
            return { field: field, name: name, color: color };
        });
    };
    StackBarChartComponent.prototype.writeChart = function (chartSet, max) {
        var series = chartSet.series, parSeries = chartSet.parSeries, data = chartSet.data;
        var usingSeries = this.arrangeSeries(series, parSeries);
        return React.createElement("div", {"className": "chart-list stack-bar-chart"}, React.createElement(RD3.BarStackChart, React.__spread({"data": data, "chartSeries": usingSeries, x: function (d) { return d.sort; }, "xScale": 'ordinal', "yTickFormat": d3.format(".2s"), "yDomain": this.domain(max)}, this.arrangeChartProp(data))));
    };
    StackBarChartComponent.prototype.writeTable = function (table) {
        return React.createElement("div", {"className": "chart-list data-table-container"}, React.createElement(data_table_1.default, React.__spread({}, { table: table })));
    };
    StackBarChartComponent.prototype.detectMax = function (dataList) {
        var max = 0;
        _.map(dataList, function (_a) {
            var table = _a.table;
            table.max > max && (max = table.max);
        });
        return max;
    };
    StackBarChartComponent.prototype.render = function () {
        var _this = this;
        var dataList = this.props.dataList;
        if (!dataList || dataList.length == 0) {
            return React.createElement("div", null, "null");
        }
        var max = this.detectMax(dataList);
        return React.createElement("div", null, React.createElement("article", {"className": "chart-list body"}, this.props.dataList.map(function (d) {
            return React.createElement("section", {"className": "chart-list chart-block"}, React.createElement("h1", {"className": "chart-list chart-title"}, d.table.title), _this.writeChart(d.chartSet, max), _this.writeTable(d.table));
        })));
    };
    return StackBarChartComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StackBarChartComponent;
//# sourceMappingURL=stack-bar-chart.js.map