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
var d3_1 = require('d3');
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
    CircleGraphComponent.prototype.sortedData = function (props) {
        var split = props.split, data = props.data;
        if (!data) {
            return [];
        }
        switch (split) {
            case 'year':
                return _.sortBy(data, function (el) { return el.year.content; });
            default:
                return props.data;
        }
    };
    CircleGraphComponent.prototype.normalizeData = function (props) {
        var sorted = this.sortedData(props);
        switch (props.table) {
            case 'day':
                var dayKeys = constants_1.default.dayKeys, dayTexts = constants_1.default.dayTexts;
                return sorted.map(function (one) {
                    var total = _.reduce(dayKeys, function (a, key) { return a + one[key]; }, 0);
                    return {
                        name: one.year.name + " (" + total + ")",
                        data: _.map(_.zip(dayKeys, dayTexts), function (kt) {
                            var key = kt[0];
                            var label = kt[1] + " (" + one[key] + ")";
                            return { label: label, value: Math.round(one[key] / total * 1000) / 10 };
                        })
                    };
                });
            default:
                return sorted;
        }
    };
    CircleGraphComponent.prototype.normalizeState = function (props) {
        var normalized = this.normalizeData(props);
        this.setState({ normalized: normalized });
    };
    CircleGraphComponent.prototype.writeChart = function (data) {
        return React.createElement(D3.PieChart, {"colors": d3_1.scale.category20(), "data": data.data, "width": constants_1.default.pieWidth, "height": constants_1.default.pieHeight, "radius": constants_1.default.pieSize / 3, "innerRadius": constants_1.default.pieInnerSize / 2, "sectorBorderColor": "white", "title": data.name});
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