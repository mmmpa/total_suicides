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
var Promise = require('bluebird');
var ChartComponent = (function (_super) {
    __extends(ChartComponent, _super);
    function ChartComponent(props) {
        _super.call(this, props);
        this.promice = Promise.resolve();
        this.state = {
            baseChartKey: '',
            chartsKey: '',
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
    Object.defineProperty(ChartComponent.prototype, "per", {
        get: function () {
            return this.props.per;
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
        return props.charts;
        /*
         let {charts} = props;
         if (!charts || charts.length <= 1) {
         return null;
         }
    
         return _.drop(charts.concat(), 1);
         */
    };
    ChartComponent.prototype.setBaseChart = function (props) {
        var base = this.getBaseChart(props);
        var first = this.getFirstChart(props);
        var per = props.per;
        if (!base || !first) {
            this.chart && this.chart.flush();
            return;
        }
        var baseChartKey = base.stringify();
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
                    this.arrangeData(first, per)
                ],
                type: 'spline'
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
    ChartComponent.prototype.arrangeData = function (chartData, per) {
        var data = chartData.data, value = chartData.value;
        if (!data) {
            return;
        }
        var y = value.y, ySpecified = value.ySpecified, zSpecified = value.zSpecified, xSpecified = value.xSpecified, x = value.x;
        var label = this.detectLabel(y, ySpecified, zSpecified);
        var xContentList = _.filter(data, function (d) { return _.includes(xSpecified, d[x].content); }).map(function (d) {
            return per ? d.per : d.value;
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
        var chartsKey = charts.map(function (c) { return c.fullKey; }).join('--') + (props.per ? 'per' : 'number');
        if (this.state.chartsKey == chartsKey) {
            console.log('Charts not change');
            return;
        }
        this.setState({ chartsKey: chartsKey });
        var per = props.per;
        var dataList = this.chart.data().concat();
        //let firstData = dataList.shift();
        var length = dataList.length;
        var columns = [];
        var types = {};
        // 基本チャート以外のチャートがなければ全削除。
        if (!charts) {
            var removables = dataList.map(function (d) { return d.id; });
            this.chart.unload({ ids: removables });
            return;
        }
        var addedNames = [];
        charts.forEach(function (chartData) {
            var arranged = _this.arrangeData(chartData, per);
            addedNames.push(arranged[0]);
            columns.push(arranged);
            types[arranged[0]] = chartData.type;
        });
        var unload = [];
        dataList.forEach(function (_a) {
            var id = _a.id;
            if (!_.includes(addedNames, id)) {
                unload.push(id);
            }
        });
        this.promice = this.promice.then(function (v) {
            return new Promise(function (resolve, _) {
                _this.chart.load({ columns: columns, types: types, unload: unload });
                setTimeout(function () { return resolve(); }, 500);
            });
        });
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
    ChartComponent.prototype.changeType = function (chartName, type) {
        this.dispatch('chart:type', chartName, type);
    };
    ChartComponent.prototype.changePer = function () {
        this.dispatch('chart:per');
    };
    ChartComponent.prototype.writeAdditionalChartSetting = function () {
        var _this = this;
        var charts = this.props.charts;
        if (!charts) {
            return null;
        }
        return charts.map(function (chart, i) {
            var _a = chart.value, src = _a.src, gender = _a.gender, area = _a.area, year = _a.year, detailName = _a.detailName, x = _a.x, xSpecified = _a.xSpecified, y = _a.y, ySpecified = _a.ySpecified, zSpecified = _a.zSpecified, chartType = _a.chartType;
            var _b = chartType == 'line' ? ['unactivated', 'activated'] : ['activated', 'unactivated'], barChartActivation = _b[0], lineChartActivation = _b[1];
            var label = _this.detectLabel(y, ySpecified, zSpecified);
            return React.createElement("section", {"className": "v2-chart added-chart chart", "key": "additional-" + i + "-" + chart.key}, React.createElement("div", {"className": "buttons"}, React.createElement("button", {"className": "delete", "disabled": charts.length === 1, "onClick": function () { return _this.remove(chart.name); }}, React.createElement(fa_1.default, {"icon": "trash"}))), React.createElement("div", {"className": "chart-types"}, React.createElement("button", {"className": "bar-chart " + barChartActivation, "onClick": function () { return _this.changeType(chart.name, 'bar'); }}, React.createElement(fa_1.default, {"icon": "bar-chart"})), React.createElement("button", {"className": "line-chart " + lineChartActivation, "onClick": function () { return _this.changeType(chart.name, 'line'); }}, React.createElement(fa_1.default, {"icon": "line-chart"}))), React.createElement("section", {"className": "setting"}, chart.name + "::" + label));
        });
    };
    ChartComponent.prototype.writePerSelector = function (props) {
        var _this = this;
        return React.createElement("section", {"className": "per"}, React.createElement("label", null, React.createElement("span", {"className": "input-input"}, React.createElement("input", {"type": "checkbox", "checked": props.per, "onChange": function () { return _this.changePer(); }})), React.createElement("span", {"className": "input-label"}, "全体の割合（%）で表示する")), React.createElement("p", {"className": "notice"}, "割合とは年齢層、同居人の有無、職業、場所、手段、時間帯、曜日、原因、動機、未遂歴カテゴリー内部の各項目の合計に対する、各項目の値の割合です。表示している項目における割合とは限らないことに注意してください。"));
    };
    ChartComponent.prototype.back = function () {
        this.dispatch('chart:finder');
    };
    ChartComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("article", {"className": "v2-chart body"}, React.createElement("section", {"className": "v2-chart chart-container"}, React.createElement("div", {"id": "chart"})), React.createElement("section", {"className": "v2-chart chart-controller"}, React.createElement("section", {"className": "v2-chart controller-container other-controll"}, React.createElement("button", {"className": "back-to-finder", "onClick": function () { return _this.back(); }}, React.createElement(fa_1.default, {"icon": "undo"}), "最初からやりなおす"), this.writePerSelector(this.props)), React.createElement("section", {"className": "v2-chart controller-container x-specifier"}, React.createElement("h1", {"className": "v2-chart controller-title"}, React.createElement(fa_1.default, {"icon": "arrows-h"}), "横軸の表示内容の変更"), this.writeXSpecifier(this.props)), React.createElement("section", {"className": "v2-chart controller-container adding-controller"}, React.createElement("h1", {"className": "v2-chart controller-title"}, React.createElement(fa_1.default, {"icon": "arrows-v"}), "縦軸の表示内容を追加"), React.createElement(selector_writer_1.ChartDataSelector, {x: this.selectedX})), React.createElement("section", {"className": "v2-chart controller-container added-chart chart-list"}, React.createElement("h1", {"className": "v2-chart controller-title"}, React.createElement(fa_1.default, {"icon": "ellipsis-v"}), "表示中の内容"), this.writeAdditionalChartSetting())));
    };
    return ChartComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartComponent;
//# sourceMappingURL=chart.js.map