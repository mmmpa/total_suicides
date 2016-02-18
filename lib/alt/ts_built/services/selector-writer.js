var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../lib/eventer');
var fa_1 = require('../lib/fa');
var _ = require('lodash');
var constants_1 = require("../initializers/constants");
function writeBaseSelector(onChange, selected) {
    var exclusion = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        exclusion[_i - 2] = arguments[_i];
    }
    return detectSelectable.apply(void 0, exclusion).map(function (_a) {
        var key = _a.key, name = _a.name;
        return React.createElement("label", null, React.createElement("span", {"className": "input-input"}, React.createElement("input", {"type": "radio", "checked": _.includes(selected, key), "onChange": function () { return onChange(key); }})), React.createElement("span", {"className": "input-label"}, name));
    });
}
exports.writeBaseSelector = writeBaseSelector;
function writeSelectorSpecifier(selectorKey, onChange, selected, type) {
    if (type === void 0) { type = 'radio'; }
    var keyMap = _.find(constants_1.allMaps, function (_a) {
        var key = _a.key;
        return key == selectorKey;
    }).value;
    return keyMap.map(function (_a) {
        var key = _a.key, name = _a.name;
        return React.createElement("label", null, React.createElement("span", {"className": "input-input"}, React.createElement("input", {"type": type, "checked": _.includes(selected, key), "onChange": function () { return onChange(key); }})), React.createElement("span", {"className": "input-label"}, name));
    });
}
exports.writeSelectorSpecifier = writeSelectorSpecifier;
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
var ChartDataSelector = (function (_super) {
    __extends(ChartDataSelector, _super);
    function ChartDataSelector(props) {
        _super.call(this, props);
        this.state = {
            base: '',
            specified: ''
        };
    }
    ChartDataSelector.prototype.writeBase = function () {
        var _this = this;
        if (!this.props.x || this.props.x === '') {
            return null;
        }
        return React.createElement("section", {"className": "v2-chart sub-controller-container data-selector y"}, React.createElement("h1", {"className": "v2-chart sub-controller-title"}, "カテゴリー"), writeBaseSelector(function (base) {
            _this.setState({ base: base });
        }, [this.state.base], this.props.x));
    };
    ChartDataSelector.prototype.writeSpecifier = function () {
        var _this = this;
        var _a = this.state, base = _a.base, specified = _a.specified;
        if (!base) {
            return null;
        }
        return React.createElement("section", {"className": "v2-chart sub-controller-container data-selector y-specifier"}, React.createElement("h1", {"className": "v2-chart sub-controller-title"}, "詳細"), writeSelectorSpecifier(base, function (specified) {
            _this.setState({ specified: specified });
        }, [specified]));
    };
    ChartDataSelector.prototype.writeRangeSpecifier = function () {
        var _this = this;
        var _a = this.state, base = _a.base, specifiedRange = _a.specifiedRange;
        if (!base || base === '' || base === 'year' || this.props.x === 'year') {
            return null;
        }
        return React.createElement("section", {"className": "v2-chart sub-controller-container data-selector y-specifier"}, React.createElement("h1", {"className": "v2-chart sub-controller-title"}, "時期の指定が必要です"), writeSelectorSpecifier('year', function (specifiedRange) {
            _this.setState({ specifiedRange: specifiedRange });
        }, [specifiedRange]));
    };
    ChartDataSelector.prototype.add = function () {
        var _a = this.state, base = _a.base, specified = _a.specified, specifiedRange = _a.specifiedRange;
        this.dispatch('chart:add', base, specified, specifiedRange);
    };
    ChartDataSelector.prototype.render = function () {
        var _this = this;
        return React.createElement("section", {"className": "v2-chart data-selector"}, React.createElement("section", {"className": "v2-chart data-selector"}, this.writeBase(), this.writeSpecifier(), this.writeRangeSpecifier(), React.createElement("section", {"className": "v2-chart data-selector submit"}, React.createElement("button", {"className": "submit", "onClick": function () { return _this.add(); }}, React.createElement(fa_1.default, {"icon": "plus-circle"}), "チャートにデータを追加"))));
    };
    return ChartDataSelector;
})(eventer_1.Node);
exports.ChartDataSelector = ChartDataSelector;
//# sourceMappingURL=selector-writer.js.map