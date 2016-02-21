var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../../lib/eventer');
var constants_1 = require("../../initializers/constants");
var _ = require('lodash');
var chart_data_selector_1 = require('./chart-data-selector');
var ChartFinderComponent = (function (_super) {
    __extends(ChartFinderComponent, _super);
    function ChartFinderComponent(props) {
        _super.call(this, props);
        this.state = {
            x: '',
            xSpecified: [],
            ySpecified: '',
            y: '',
            z: ''
        };
    }
    ChartFinderComponent.prototype.find = function () {
        this.dispatch('chart:find', this.state);
    };
    ChartFinderComponent.prototype.writeErrorMessage = function (message) {
        if (!message) {
            return null;
        }
        return React.createElement("p", {"className": "error-message"}, message);
    };
    Object.defineProperty(ChartFinderComponent.prototype, "selectable", {
        get: function () {
            return [
                { key: 'year', name: '年度' },
                { key: 'gender', name: '性別' },
                { key: 'area', name: '地域' },
            ].concat(constants_1.tables);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartFinderComponent.prototype, "ySelectable", {
        get: function () {
            return this.selectable.map(function (_a) {
                var key = _a.key, name = _a.name;
                return { key: key, name: name };
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartFinderComponent.prototype, "xSelectable", {
        get: function () {
            return this.selectable.map(function (_a) {
                var key = _a.key, name = _a.name;
                return { key: key, name: name };
            });
        },
        enumerable: true,
        configurable: true
    });
    ChartFinderComponent.prototype.specfiers = function (spec) {
        switch (spec) {
            case 'year':
                return constants_1.years;
            case 'gender':
                return constants_1.genders;
            case 'area':
                return constants_1.areas;
            default:
                var detail = _.find(constants_1.tableMaps, function (_a) {
                    var key = _a.key;
                    return key == spec;
                });
                return detail ? detail.value : [];
        }
    };
    ChartFinderComponent.prototype.selectX = function (x) {
        var xSpecified = this.specfiers(x).map(function (_a) {
            var key = _a.key;
            return key;
        });
        this.setState({ x: x, xSpecified: xSpecified });
    };
    ChartFinderComponent.prototype.selectXSpecified = function (xKey) {
        var xSpecified = this.state.xSpecified;
        if (_.includes(xSpecified, xKey)) {
            xSpecified = _.without(xSpecified, xKey);
        }
        else {
            xSpecified.push(xKey);
        }
        this.setState({ xSpecified: xSpecified });
    };
    ChartFinderComponent.prototype.selectYSpecified = function (ySpecified) {
        this.setState({ ySpecified: ySpecified });
    };
    ChartFinderComponent.prototype.selectY = function (y) {
        var ySpecified = this.specfiers(y)[0].key;
        this.setState({ y: y, ySpecified: ySpecified });
    };
    ChartFinderComponent.prototype.selectZ = function (z) {
        this.setState({ z: z });
    };
    ChartFinderComponent.prototype.writeYSpecifier = function () {
        var _this = this;
        var _a = this.state, y = _a.y, ySpecified = _a.ySpecified;
        return React.createElement("section", null, this.specfiers(y).map(function (_a) {
            var key = _a.key, name = _a.name;
            return React.createElement("label", null, React.createElement("input", {"type": "radio", "value": "key", "checked": ySpecified == key, "onChange": function () { return _this.selectYSpecified(key); }}), name);
        }));
    };
    ChartFinderComponent.prototype.writeXSpecifier = function () {
        var _this = this;
        var _a = this.state, x = _a.x, xSpecified = _a.xSpecified;
        return React.createElement("section", null, this.specfiers(x).map(function (_a) {
            var key = _a.key, name = _a.name;
            return React.createElement("label", null, React.createElement("input", {"type": "checkbox", "value": "key", "checked": _.includes(xSpecified, key), "onChange": function () { return _this.selectXSpecified(key); }}), name);
        }));
    };
    ChartFinderComponent.prototype.render = function () {
        var _this = this;
        var _a = this.props, selectedYears = _a.selectedYears, selectedGenders = _a.selectedGenders, selectedAreas = _a.selectedAreas, selectedDetail = _a.selectedDetail, errors = _a.errors;
        var _b = this.state, x = _b.x, y = _b.y, z = _b.z;
        return React.createElement("div", null, React.createElement("article", {"className": "v2-finder body"}, React.createElement("h1", null, "基本となるチャートを決定します"), React.createElement("h1", null, "チャートの縦軸"), "特定の", this.ySelectable.map(function (_a) {
            var key = _a.key, name = _a.name;
            return React.createElement("label", null, React.createElement("input", {"type": "radio", "value": key, "checked": key === y, "onChange": function () { return _this.selectY(key); }}), name);
        }), "の自殺者数を", React.createElement(chart_data_selector_1.ChartSelector, {x: x})));
    };
    return ChartFinderComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartFinderComponent;
//# sourceMappingURL=chart-finder.js.map