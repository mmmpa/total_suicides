var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../lib/eventer');
var D3 = require('react-d3');
var SimpleGraph = (function (_super) {
    __extends(SimpleGraph, _super);
    function SimpleGraph() {
        _super.apply(this, arguments);
    }
    SimpleGraph.prototype.componentDidMount = function () {
    };
    SimpleGraph.prototype.render = function () {
        var chartData = [
            {
                name: "series1",
                values: [{ x: 0, y: 20 }, { x: 24, y: 10 }],
                strokeWidth: 3,
                strokeDashArray: "5,5",
            },
            {
                name: "series2",
                values: [{ x: 70, y: 82 }, { x: 76, y: 82 }]
            }
        ];
        var width = 700, height = 300, margins = { left: 100, right: 100, top: 50, bottom: 50 }, title = "User sample", 
        // chart series,
        // field: is what field your data want to be selected
        // name: the name of the field that display in legend
        // color: what color is the line
        chartSeries = [
            {
                field: 'BMI',
                name: 'BMI',
                color: '#ff7f0e'
            }
        ], 
        // your x accessor
        x = function (d) {
            return d.index;
        };
        return React.createElement(D3.LineChart, {"legend": true, "data": chartData, "width": 1000, "height": 400, "viewBoxObject": {
            x: 0,
            y: 0,
            width: 500,
            height: 400
        }, "title": "Line Chart", "yAxisLabel": "Altitude", "xAxisLabel": "Elapsed Time (sec)", "gridHorizontal": true});
    };
    return SimpleGraph;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SimpleGraph;
//# sourceMappingURL=simple-graph.js.map