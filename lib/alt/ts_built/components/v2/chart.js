var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../../lib/eventer');
var c3 = require('c3');
var _ = require('lodash');
var data_table_1 = require("../data-table");
var constants_1 = require("../../initializers/constants");
var ChartComponent = (function (_super) {
    __extends(ChartComponent, _super);
    function ChartComponent() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(ChartComponent.prototype, "autoScale", {
        get: function () {
            return this.props.autoScale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartComponent.prototype, "par", {
        get: function () {
            return this.props.par;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartComponent.prototype, "keyBase", {
        get: function () {
            var _a = this.props, base = _a.base, table = _a.table, x = _a.x, y = _a.y;
            return [base, table, x, y].join('-');
        },
        enumerable: true,
        configurable: true
    });
    ChartComponent.prototype.domain = function (max) {
        if (this.par) {
            return this.autoScale ? null : [0, 100];
        }
        return !max || this.autoScale ? null : [0, max];
    };
    ChartComponent.prototype.arrangeChartProp = function (data) {
        var defaultProps = constants_1.generateBarProps();
        var minWidth = data.length * 90;
        defaultProps.width < minWidth && (defaultProps.width = minWidth);
        return defaultProps;
    };
    ChartComponent.prototype.arrangeSeries = function (series, parSeries) {
        var using = this.par ? parSeries : series;
        return using;
    };
    ChartComponent.prototype.writeChart = function (chartSet, max) {
        var series = chartSet.series, parSeries = chartSet.parSeries, data = chartSet.data;
        var usingSeries = this.arrangeSeries(series, parSeries);
        var chart = c3.generate({
            bindto: '#chart',
            data: {
                columns: [
                    ['data1', 30, 200, 100, 400, 150, 250],
                    ['data2', 50, 20, 10, 40, 15, 25]
                ]
            }
        });
        return React.createElement("div", {"id": "chart", "className": "chart-list stack-bar-chart"});
    };
    ChartComponent.prototype.writeTable = function (table) {
        var par = this.props.par;
        return React.createElement("div", {"className": "chart-list data-table-container"}, React.createElement(data_table_1.default, React.__spread({}, { table: table, par: par })));
    };
    ChartComponent.prototype.detectMax = function (tableListList) {
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
    ChartComponent.prototype.writeTables = function (tableList, max) {
        var _this = this;
        return _.map(tableList, function (_a) {
            var table = _a.table, chart = _a.chart;
            return React.createElement("section", {"className": "chart-list chart-block", "key": "block-" + table.title}, React.createElement("h1", null, table.title), _this.writeChart(chart, max), _this.writeTable(table));
        });
    };
    ChartComponent.prototype.componentDidMount = function () {
        var chart = c3.generate({
            bindto: '#chart',
            data: {
                columns: [
                    ['data1', 30, 200, 100, 400, 150, 250],
                    ['data2', 50, 20, 10, 40, 15, 25]
                ]
            }
        });
    };
    ChartComponent.prototype.render = function () {
        return React.createElement("div", {"id": "chart", "className": "chart-list stack-bar-chart"});
    };
    return ChartComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartComponent;
//# sourceMappingURL=chart.js.map