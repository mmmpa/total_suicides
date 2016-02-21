var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../../lib/eventer');
var fa_1 = require('../../lib/fa');
var _ = require('lodash');
var constants_1 = require("../../initializers/constants");
function writeBaseSelector(onChange, selected) {
    var exclusion = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        exclusion[_i - 2] = arguments[_i];
    }
    return detectSelectable.apply(void 0, exclusion).map(function (_a) {
        var key = _a.key, name = _a.name;
        return React.createElement("label", {"key": key}, React.createElement("span", {"className": "input-input"}, React.createElement("input", {"type": "radio", "value": key, "checked": _.includes(selected, key), "onChange": function () { return onChange(key); }})), React.createElement("span", {"className": "input-label"}, name));
    });
}
function writeSelectorSpecifier(selectorKey, onChange, selected, type) {
    if (type === void 0) { type = 'radio'; }
    var keyMap = _.find(constants_1.allMaps, function (_a) {
        var key = _a.key;
        return key == selectorKey;
    }).value;
    return keyMap.map(function (_a) {
        var key = _a.key, name = _a.name;
        return React.createElement("label", {"key": key}, React.createElement("span", {"className": "input-input"}, React.createElement("input", {"type": type, "value": key, "checked": _.includes(selected, key), "onChange": function () { return onChange(key); }})), React.createElement("span", {"className": "input-label"}, name));
    });
}
function detectSelectable() {
    var exclusion = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        exclusion[_i - 0] = arguments[_i];
    }
    var base = [
        { key: 'year', name: '年度' },
        { key: 'gender', name: '性別' },
        { key: 'area', name: '地域' }
    ];
    var addingTable = true;
    exclusion.forEach(function (ex) {
        if (_.includes(constants_1.tableKeys, ex)) {
            addingTable = false;
        }
        else {
            _.remove(base, function (_a) {
                var key = _a.key;
                return key == ex;
            });
        }
    });
    return addingTable ? base.concat(constants_1.tables) : base;
}
var ChartDataSelectorBase = (function (_super) {
    __extends(ChartDataSelectorBase, _super);
    function ChartDataSelectorBase(props) {
        _super.call(this, props);
        this.state = {
            x: '',
            y: '',
            ySpecified: '',
            zSpecified: ''
        };
    }
    Object.defineProperty(ChartDataSelectorBase.prototype, "isAddable", {
        get: function () {
            var _a = this.state, x = _a.x, y = _a.y, ySpecified = _a.ySpecified, zSpecified = _a.zSpecified;
            if (this.isRequiredRange) {
                return y !== '' && ySpecified !== '' && zSpecified !== '';
            }
            else {
                return y !== '' && ySpecified !== '';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartDataSelectorBase.prototype, "isRequiredRange", {
        get: function () {
            var x = this.props.x || this.state.x;
            var y = this.state.y;
            if (y === '' || y === 'year' || x === 'year') {
                return false;
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    ChartDataSelectorBase.prototype.setX = function (key) {
        this.setState({ x: key, y: '', ySpecified: '', zSpecified: '' });
    };
    ChartDataSelectorBase.prototype.setY = function (key) {
        this.setState({ y: key, ySpecified: '', zSpecified: '' });
    };
    ChartDataSelectorBase.prototype.setYSpecified = function (ySpecified) {
        this.setState({ ySpecified: ySpecified });
    };
    ChartDataSelectorBase.prototype.setZSpecified = function (zSpecified) {
        this.setState({ zSpecified: zSpecified });
    };
    ChartDataSelectorBase.prototype.writeBase = function () {
        var _this = this;
        var x = this.props.x || this.state.x;
        if (x === '') {
            return null;
        }
        return React.createElement("section", {"className": "v2-chart sub-controller-container data-selector y"}, React.createElement("h1", {"className": "v2-chart sub-controller-title"}, "縦軸のカテゴリー"), writeBaseSelector(function (base) {
            _this.setY(base);
        }, [this.state.y], this.props.x, this.state.x));
    };
    ChartDataSelectorBase.prototype.writeXSelector = function () {
        var _this = this;
        return React.createElement("section", {"className": "v2-chart sub-controller-container data-selector x"}, React.createElement("h1", {"className": "v2-chart sub-controller-title"}, "チャートの横軸に並ぶ項目"), writeBaseSelector(function (x) {
            _this.setX(x);
        }, [this.state.x]));
    };
    ChartDataSelectorBase.prototype.writeSpecifier = function () {
        var _this = this;
        var _a = this.state, y = _a.y, ySpecified = _a.ySpecified;
        if (!y) {
            return null;
        }
        return React.createElement("section", {"className": "v2-chart sub-controller-container data-selector y-specifier"}, React.createElement("h1", {"className": "v2-chart sub-controller-title"}, "縦軸の値"), writeSelectorSpecifier(y, function (specified) {
            _this.setYSpecified(specified);
        }, [ySpecified]));
    };
    ChartDataSelectorBase.prototype.writeRangeSpecifier = function () {
        var _this = this;
        var zSpecified = this.state.zSpecified;
        if (!this.isRequiredRange) {
            return null;
        }
        return React.createElement("section", {"className": "v2-chart sub-controller-container data-selector z-specifier"}, React.createElement("h1", {"className": "v2-chart sub-controller-title"}, "時期の指定が必要です"), writeSelectorSpecifier('year', function (zSpecified) {
            _this.setZSpecified(zSpecified);
        }, [zSpecified]));
    };
    return ChartDataSelectorBase;
})(eventer_1.Node);
var ChartSelector = (function (_super) {
    __extends(ChartSelector, _super);
    function ChartSelector() {
        _super.apply(this, arguments);
    }
    ChartSelector.prototype.find = function () {
        var _a = this.state, x = _a.x, y = _a.y, ySpecified = _a.ySpecified, zSpecified = _a.zSpecified;
        var xSpecified = constants_1.detectMap(x).map(function (d) { return d.key; });
        this.dispatch('chart:find', { x: x, xSpecified: xSpecified, y: y, ySpecified: ySpecified, zSpecified: zSpecified });
    };
    ChartSelector.prototype.render = function () {
        var _this = this;
        return React.createElement("section", {"className": "v2-chart data-selector"}, React.createElement("section", {"className": "v2-chart data-selector"}, this.writeXSelector(), this.writeBase(), this.writeSpecifier(), this.writeRangeSpecifier(), React.createElement("section", {"className": "v2-chart data-selector submit"}, React.createElement("button", {"className": "submit", "disabled": !this.isAddable, "onClick": function () { return _this.find(); }}, React.createElement(fa_1.default, {"icon": "plus-circle"}), "チャートを表示"))));
    };
    return ChartSelector;
})(ChartDataSelectorBase);
exports.ChartSelector = ChartSelector;
var ChartDataSelector = (function (_super) {
    __extends(ChartDataSelector, _super);
    function ChartDataSelector() {
        _super.apply(this, arguments);
    }
    ChartDataSelector.prototype.add = function () {
        var _a = this.state, y = _a.y, ySpecified = _a.ySpecified, zSpecified = _a.zSpecified;
        this.dispatch('chart:add', y, ySpecified, zSpecified);
    };
    ChartDataSelector.prototype.render = function () {
        var _this = this;
        return React.createElement("section", {"className": "v2-chart data-selector"}, React.createElement("section", {"className": "v2-chart data-selector"}, this.writeBase(), this.writeSpecifier(), this.writeRangeSpecifier(), React.createElement("section", {"className": "v2-chart data-selector submit"}, React.createElement("button", {"className": "submit", "disabled": !this.isAddable, "onClick": function () { return _this.add(); }}, React.createElement(fa_1.default, {"icon": "plus-circle"}), "チャートにデータを追加"))));
    };
    return ChartDataSelector;
})(ChartDataSelectorBase);
exports.ChartDataSelector = ChartDataSelector;
//# sourceMappingURL=chart-data-selector.js.map