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
var fa_1 = require('../lib/fa');
var StackBarChartComponent = (function (_super) {
    __extends(StackBarChartComponent, _super);
    function StackBarChartComponent() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(StackBarChartComponent.prototype, "autoScale", {
        get: function () {
            return this.props.autoScale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StackBarChartComponent.prototype, "par", {
        get: function () {
            return this.props.par;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StackBarChartComponent.prototype, "keyBase", {
        get: function () {
            var _a = this.props, base = _a.base, table = _a.table, x = _a.x, y = _a.y;
            return [base, table, x, y].join('-');
        },
        enumerable: true,
        configurable: true
    });
    StackBarChartComponent.prototype.domain = function (max) {
        if (this.par) {
            return this.autoScale ? null : [0, 100];
        }
        return !max || this.autoScale ? null : [0, max];
    };
    StackBarChartComponent.prototype.arrangeChartProp = function (data) {
        var defaultProps = constants_1.default.barProps;
        var minWidth = data.length * 90;
        defaultProps.width < minWidth && (defaultProps.width = minWidth);
        return defaultProps;
    };
    StackBarChartComponent.prototype.arrangeSeries = function (series, parSeries) {
        var using = this.par ? parSeries : series;
        return using;
    };
    StackBarChartComponent.prototype.writeChart = function (chartSet, max) {
        var series = chartSet.series, parSeries = chartSet.parSeries, data = chartSet.data;
        var usingSeries = this.arrangeSeries(series, parSeries);
        return React.createElement("div", {"className": "chart-list stack-bar-chart"}, React.createElement(RD3.BarStackChart, React.__spread({"data": data, "chartSeries": usingSeries, x: function (d) { return d.sort; }, "xScale": 'ordinal', "yTickFormat": d3.format(".2s"), "yDomain": this.domain(max)}, this.arrangeChartProp(data))));
    };
    StackBarChartComponent.prototype.writeTable = function (table) {
        var par = this.props.par;
        return React.createElement("div", {"className": "chart-list data-table-container"}, React.createElement(data_table_1.default, React.__spread({}, { table: table, par: par })));
    };
    StackBarChartComponent.prototype.detectMax = function (tableListList) {
        var max = 0;
        _.each(tableListList, function (_a) {
            var tables = _a.tables;
            _.each(tables, function (_a) {
                var table = _a.table;
                table.max > max && (max = table.max);
            });
        });
        return max;
    };
    StackBarChartComponent.prototype.writeTables = function (tableList, max) {
        var _this = this;
        return _.map(tableList, function (_a) {
            var table = _a.table, chart = _a.chart;
            return React.createElement("section", {"className": "chart-list chart-block", "key": "block-" + table.title}, React.createElement("h1", null, table.title), _this.writeChart(chart, max), _this.writeTable(table));
        });
    };
    StackBarChartComponent.prototype.render = function () {
        var _this = this;
        var tableListList = this.props.tableListList;
        if (!tableListList || !tableListList.length || _.isString(tableListList)) {
            return React.createElement("article", {"className": "chart-list body"}, React.createElement("div", {"className": "loading"}, React.createElement(fa_1.default, {"icon": "spinner", "animation": 'pulse'}), "loading..."));
        }
        var max = this.detectMax(tableListList);
        return React.createElement("div", null, React.createElement("article", {"className": "chart-list body", "key": this.keyBase}, tableListList.map(function (_a) {
            var title = _a.title, tables = _a.tables;
            return React.createElement("section", {"className": "chart-list chart-line", "key": "line-" + title}, React.createElement("h1", {"className": "chart-list chart-title"}, title), _this.writeTables(tables, max));
        })));
    };
    return StackBarChartComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StackBarChartComponent;
//# sourceMappingURL=stack-bar-chart.js.map