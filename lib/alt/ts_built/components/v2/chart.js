var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../../lib/eventer');
var c3 = require('c3');
var _ = require('lodash');
var fa_1 = require('../../lib/fa');
var constants_1 = require("../../initializers/constants");
var selector_writer_1 = require('../../services/selector-writer');
var ChartComponent = (function (_super) {
    __extends(ChartComponent, _super);
    function ChartComponent(props) {
        this.state = {
            baseChartKey: '',
            x: '',
            xSpecified: []
        };
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
    ChartComponent.prototype.detectLabel = function (y, yKey, z) {
        var keyMap = constants_1.detectMap(y);
        var map = _.find(keyMap, function (_a) {
            var key = _a.key;
            return key + '' === yKey + '';
        });
        var base = map ? map.name : null;
        return z ? z + ":" + base : base;
    };
    ChartComponent.prototype.getBaseChart = function (props) {
        if (!this.props.charts || props.charts.length === 0) {
            return null;
        }
        return props.charts[0];
    };
    ChartComponent.prototype.getAdditionalChart = function (props) {
        if (!props.charts || props.charts.length < 2) {
            return null;
        }
        var c = props.charts.concat();
        c.shift();
        return c;
    };
    ChartComponent.prototype.setBaseChart = function (props) {
        var chart = this.getBaseChart(props);
        if (!chart) {
            return;
        }
        var baseChartKey = chart.key;
        var _a = chart.value, x = _a.x, y = _a.y, xSpecified = _a.xSpecified, ySpecified = _a.ySpecified, z = _a.z;
        var data = chart.data;
        if (this.state.baseChartKey == baseChartKey) {
            console.log('base chart not change');
            return;
        }
        this.setState({ baseChartKey: baseChartKey, x: x, xSpecified: xSpecified });
        console.log({ x: x, y: y, xSpecified: xSpecified, ySpecified: ySpecified });
        var filteredX = [];
        _.sortBy(data, function (d) { return d[x].content; }).forEach(function (d) {
            if (d[y].content == ySpecified && _.includes(xSpecified, d[x].content.toString())) {
                filteredX.push(d);
            }
        });
        var xNameList = filteredX.map(function (d) {
            return d[x].name;
        });
        xNameList.unshift('x');
        var xContentList = filteredX.map(function (d) {
            return d.value;
        });
        xContentList.unshift(this.detectLabel(y, ySpecified, z));
        console.log({ xNameList: xNameList, xContentList: xContentList });
        this.chart = c3.generate({
            bindto: '#chart',
            size: {
                height: 600
            },
            data: {
                x: 'x',
                columns: [
                    xNameList,
                    xContentList
                ],
                type: 'bar',
                types: {
                    age: 'bar'
                }
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        rotate: 75,
                        multiline: false
                    },
                    height: 130
                }
            }
        });
    };
    ChartComponent.prototype.setAdditionalChart = function (props) {
        var _this = this;
        var charts = this.getAdditionalChart(props);
        if (!charts) {
            return;
        }
        var dataList = this.chart.data();
        charts.forEach(function (_a) {
            var value = _a.value, data = _a.data;
            var filteredX = [];
            var x = value.x, y = value.y, xSpecified = value.xSpecified, ySpecified = value.ySpecified, z = value.z;
            console.log({ x: x, y: y, xSpecified: xSpecified, ySpecified: ySpecified });
            _.sortBy(data, function (d) { return d[x].content; }).forEach(function (d) {
                if (d[y].content == ySpecified && _.includes(xSpecified, d[x].content.toString())) {
                    filteredX.push(d);
                }
            });
            var label = _this.detectLabel(y, ySpecified, z);
            var xContentList = filteredX.map(function (d) {
                return d.value;
            });
            _.remove(dataList, function (_a) {
                var id = _a.id;
                return id == label;
            });
            dataList.push({ id: label, values: xContentList });
        });
        var columns = dataList.map(function (_a) {
            var id = _a.id, values = _a.values;
            return [id].concat(values.map(function (set) { return set.value || set; }));
        });
        console.log({ columns: columns });
        this.chart.load({ columns: columns });
    };
    ChartComponent.prototype.componentDidMount = function () {
        this.setBaseChart(this.props);
        this.setAdditionalChart(this.props);
    };
    ChartComponent.prototype.componentWillReceiveProps = function (nextProps) {
        this.setBaseChart(nextProps);
        this.setAdditionalChart(nextProps);
    };
    ChartComponent.prototype.writeXSpecifier = function (props) {
        var _this = this;
        var chart = this.getBaseChart(props);
        if (!chart) {
            return null;
        }
        var _a = this.state, x = _a.x, xSpecified = _a.xSpecified;
        return constants_1.detectMap(x).map(function (_a) {
            var key = _a.key, name = _a.name;
            return React.createElement("label", null, React.createElement("input", {"type": "checkbox", "checked": _.includes(xSpecified, key.toString()), "onChange": function () { return _this.changeXSpecified(key); }, "value": key, "id": ""}), name);
        });
    };
    ChartComponent.prototype.changeXSpecified = function (keySrc) {
        var key = keySrc.toString();
        var xSpecified = this.state.xSpecified.concat();
        if (_.includes(xSpecified, key)) {
            xSpecified = _.without(xSpecified, key);
        }
        else {
            xSpecified.push(key);
        }
        this.setState({ xSpecified: xSpecified });
    };
    ChartComponent.prototype.reloadX = function () {
        this.dispatch('chart:changeX', this.state.xSpecified.sort());
    };
    ChartComponent.prototype.writeAdditionalChartSetting = function (props) {
        var charts = this.getAdditionalChart(props);
        if (!charts) {
            return null;
        }
        return charts.map(function (_a, i) {
            var value = _a.value, key = _a.key;
            var src = value.src, gender = value.gender, area = value.area, year = value.year, detailName = value.detailName, x = value.x, xSpecified = value.xSpecified, y = value.y, ySpecified = value.ySpecified, z = value.z;
            return React.createElement("section", {"key": "additional-" + i + "-" + key}, React.createElement("div", {"className": "controller"}, React.createElement("button", null, React.createElement(fa_1.default, {"icon": "trash"}))), React.createElement("section", {"className": "setting"}, y + "-" + ySpecified));
        });
    };
    Object.defineProperty(ChartComponent.prototype, "selectedX", {
        get: function () {
            var chart = this.getBaseChart(this.props);
            if (!chart) {
                return null;
            }
            return chart.value.x;
        },
        enumerable: true,
        configurable: true
    });
    ChartComponent.prototype.writeAddingController = function () {
        var _this = this;
        var chart = this.getBaseChart(this.props);
        if (!chart) {
            return null;
        }
        return selector_writer_1.writeBaseSelector(function (selectedSelector) {
            _this.setState({ selectedSelector: selectedSelector });
        }, [this.state.selectedSelector], chart.value.x);
    };
    ChartComponent.prototype.writeAddingSpecifier = function () {
        var _this = this;
        var selectedSelector = this.state.selectedSelector;
        if (!selectedSelector) {
            return null;
        }
        return selector_writer_1.writeSelectorSpecifier(selectedSelector, function (selectedSpecifier) {
            _this.setState({ selectedSpecifier: selectedSpecifier });
        }, [this.state.selectedSpecifier]);
    };
    ChartComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("article", {"className": "v2-chart body"}, React.createElement("div", {"id": "chart", "className": "v2-chart chart-container"}), React.createElement("section", {"className": "v2-chart x-specifier"}, React.createElement("button", {"onClick": function () { return _this.reloadX(); }}, React.createElement(fa_1.default, {"icon": "refresh"}), "変更を反映"), this.writeXSpecifier(this.props)), React.createElement("section", {"className": "v2-chart base-chart configuration"}), React.createElement("section", {"className": "v2-chart additional-chart configuration"}, this.writeAdditionalChartSetting(this.props)), React.createElement("section", {"className": "v2-chart adding-controller"}, React.createElement(selector_writer_1.ChartDataSelector, {x: this.selectedX})));
    };
    return ChartComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartComponent;
//# sourceMappingURL=chart.js.map