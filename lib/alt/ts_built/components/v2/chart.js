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
        _super.call(this, props);
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
    Object.defineProperty(ChartComponent.prototype, "selectedX", {
        get: function () {
            var base = this.getBaseChart(this.props);
            if (!base) {
                return null;
            }
            return base.x;
        },
        enumerable: true,
        configurable: true
    });
    ChartComponent.prototype.detectLabel = function (y, yKey, zKey) {
        var header = constants_1.detectCategoryName(y);
        var name = constants_1.detectCategoryDetailMap(y, yKey).name;
        var base = name ? header + ":" + name : null;
        if (zKey) {
            var year = constants_1.detectCategoryDetailMap('year', zKey).name;
            return year + ":" + base;
        }
        else {
            return base;
        }
    };
    ChartComponent.prototype.getBaseChart = function (props) {
        return props.base;
    };
    ChartComponent.prototype.getFirstChart = function (props) {
        var charts = props.charts;
        if (!charts || charts.length === 0) {
            return null;
        }
        return charts[0];
    };
    ChartComponent.prototype.getAdditionalChart = function (props) {
        var charts = props.charts;
        if (!charts || charts.length <= 1) {
            return null;
        }
        return _.drop(charts.concat(), 1);
    };
    ChartComponent.prototype.setBaseChart = function (props) {
        var base = this.getBaseChart(props);
        var first = this.getFirstChart(props);
        if (!base || !first) {
            return;
        }
        var baseChartKey = base.stringify() + first.value.stringify();
        var x = base.x, xSpecified = base.xSpecified;
        if (this.state.baseChartKey == baseChartKey) {
            console.log('Base chart not change');
            return;
        }
        this.setState({ baseChartKey: baseChartKey, x: x, xSpecified: xSpecified });
        var xNameList = [];
        constants_1.detectMap(x).forEach(function (map, i) {
            if (_.includes(xSpecified, map.key)) {
                xNameList.push(map.name);
            }
        });
        xNameList.unshift('x');
        this.chart = c3.generate({
            bindto: '#chart',
            size: {
                height: 600
            },
            data: {
                x: 'x',
                columns: [
                    xNameList,
                    this.arrangeData(first)
                ],
                type: 'bar',
                types: {
                    age: 'bar'
                }
            },
            bar: {
                width: {
                    ratio: 0.95
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
    ChartComponent.prototype.arrangeData = function (chartData) {
        var data = chartData.data, value = chartData.value;
        if (!data) {
            return;
        }
        var y = value.y, ySpecified = value.ySpecified, z = value.z, xSpecified = value.xSpecified, x = value.x;
        var label = this.detectLabel(y, ySpecified, z);
        var xContentList = _.filter(data, function (d) { return _.includes(xSpecified, d[x].content); }).map(function (d) {
            return d.value;
        });
        xContentList.unshift(label);
        return xContentList;
    };
    ChartComponent.prototype.setAdditionalChart = function (props) {
        var _this = this;
        if (!this.chart) {
            return;
        }
        var charts = this.getAdditionalChart(props);
        var dataList = this.chart.data().concat();
        var firstData = dataList.shift();
        var length = dataList.length;
        var columns = [];
        // 基本チャート以外のチャートがなければ全削除。
        if (!charts) {
            var removables_1 = dataList.map(function (d) { return d.id; });
            this.chart.unload({ ids: removables_1 });
            return;
        }
        var addedNames = [firstData.id];
        charts.forEach(function (chartData) {
            var arranged = _this.arrangeData(chartData);
            addedNames.push(arranged[0]);
            columns.push(arranged);
        });
        var removables = [];
        dataList.forEach(function (_a) {
            var id = _a.id;
            if (!_.includes(addedNames, id)) {
                removables.push(id);
            }
        });
        if (length < columns.length) {
            this.chart.load({ columns: columns });
        }
        if (removables.length) {
            this.chart.unload({ ids: removables });
        }
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
        var base = this.getBaseChart(props);
        if (!base) {
            return null;
        }
        var x = base.x, xSpecified = base.xSpecified;
        return React.createElement("section", {"className": "v2-chart x-specifier-list"}, constants_1.detectMap(x).map(function (_a) {
            var key = _a.key, name = _a.name;
            return React.createElement("label", null, React.createElement("span", {"className": "input-input"}, React.createElement("input", {"type": "checkbox", "checked": _.includes(_this.state.xSpecified, key), "onChange": function () { return _this.changeXSpecified(key); }, "value": key, "id": ""})), React.createElement("span", {"className": "input-label"}, name));
        }));
    };
    ChartComponent.prototype.changeXSpecified = function (key) {
        var xSpecified = this.state.xSpecified.concat();
        if (_.includes(xSpecified, key)) {
            xSpecified = _.without(xSpecified, key);
        }
        else {
            xSpecified.push(key);
        }
        this.reloadX(xSpecified);
    };
    ChartComponent.prototype.reloadX = function (xSpecified) {
        this.dispatch('chart:changeX', xSpecified);
    };
    ChartComponent.prototype.remove = function (chartName) {
        this.dispatch('chart:remove', chartName);
    };
    ChartComponent.prototype.writeAdditionalChartSetting = function () {
        var _this = this;
        var charts = this.props.charts;
        if (!charts) {
            return null;
        }
        return charts.map(function (chart, i) {
            var _a = chart.value, src = _a.src, gender = _a.gender, area = _a.area, year = _a.year, detailName = _a.detailName, x = _a.x, xSpecified = _a.xSpecified, y = _a.y, ySpecified = _a.ySpecified, z = _a.z;
            var label = _this.detectLabel(y, ySpecified, z);
            return React.createElement("section", {"className": "v2-chart added-chart chart", "key": "additional-" + i + "-" + chart.key}, React.createElement("div", {"className": "buttons"}, React.createElement("button", {"className": "delete", "disabled": charts.length === 1, "onClick": function () { return _this.remove(chart.name); }}, React.createElement(fa_1.default, {"icon": "trash"}))), React.createElement("section", {"className": "setting"}, chart.name + "::" + label));
        });
    };
    ChartComponent.prototype.render = function () {
        return React.createElement("article", {"className": "v2-chart body"}, React.createElement("section", {"className": "v2-chart chart-container"}, React.createElement("div", {"id": "chart"})), React.createElement("section", {"className": "v2-chart chart-controller"}, React.createElement("section", {"className": "v2-chart controller-container x-specifier"}, React.createElement("h1", {"className": "v2-chart controller-title"}, React.createElement(fa_1.default, {"icon": "arrows-h"}), "横軸の表示内容の変更"), this.writeXSpecifier(this.props)), React.createElement("section", {"className": "v2-chart controller-container adding-controller"}, React.createElement("h1", {"className": "v2-chart controller-title"}, React.createElement(fa_1.default, {"icon": "arrows-v"}), "縦軸の表示内容を追加"), React.createElement(selector_writer_1.ChartDataSelector, {x: this.selectedX})), React.createElement("section", {"className": "v2-chart controller-container added-chart chart-list"}, React.createElement("h1", {"className": "v2-chart controller-title"}, React.createElement(fa_1.default, {"icon": "ellipsis-v"}), "表示中の内容"), this.writeAdditionalChartSetting())));
    };
    return ChartComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartComponent;
//# sourceMappingURL=chart.js.map