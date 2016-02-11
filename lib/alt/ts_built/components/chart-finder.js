var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../lib/eventer');
var constants_1 = require("../initializers/constants");
var _ = require('lodash');
var fa_1 = require('../lib/fa');
var ChartFinderComponent = (function (_super) {
    __extends(ChartFinderComponent, _super);
    function ChartFinderComponent(props) {
        _super.call(this, props);
        var _a = props.params, base = _a.base, table = _a.table, x = _a.x, y = _a.y;
        this.state = { base: base, table: table, x: x, y: y };
    }
    ChartFinderComponent.prototype.detectIcon = function (split) {
        return split == 'gender' ? React.createElement(fa_1.default, {"icon": "venus-mars"}) : React.createElement(fa_1.default, {"icon": "globe"});
    };
    ChartFinderComponent.prototype.isTable = function (target) {
        return _.includes(constants_1.tableKeys, target);
    };
    ChartFinderComponent.prototype.selectableKeys = function (target) {
        var _a = this.state, table = _a.table, x = _a.x, y = _a.y;
        var all = [constants_1.metas, constants_1.tables];
        switch (target) {
            case 'table':
                return all;
            case 'x':
                if (this.isTable(table)) {
                    return [constants_1.metas, []];
                }
                else {
                    return [_.filter(constants_1.metas, function (_a) {
                            var key = _a.key;
                            return key != table;
                        }), constants_1.tables];
                }
            case "y":
                if (this.isTable(table) || this.isTable(x)) {
                    return [constants_1.metas, []];
                }
                else {
                    return [_.filter(constants_1.metas, function (_a) {
                            var key = _a.key;
                            return key != table && key != x;
                        }), constants_1.tables];
                }
            default:
                return all;
        }
    };
    ChartFinderComponent.prototype.change = function (target, key) {
        var state = this.state;
        state[target] = key;
        this.setState(state);
    };
    ChartFinderComponent.prototype.find = function () {
        var _this = this;
        var _a = _.map(['table', 'x', 'y'], function (target) {
            return _this.refs[target].value;
        }), table = _a[0], x = _a[1], y = _a[2];
        var meta = _.without(constants_1.metaKeys, table, x, y);
        var base = !meta.length ? 'total' : _.includes(meta, 'year') ? 'year' : meta[0];
        var query = this.props.location.query;
        var loading = [table, x, y];
        if (_.includes(loading, 'year')) {
            query.year = query.year || constants_1.yearKeys.join(',');
        }
        if (_.includes(loading, 'gender')) {
            if (query.gender) {
                query.gender == '0' && (query.gender = '1,2');
            }
            else {
                query.gender = '1,2';
            }
        }
        if (_.includes(loading, 'area')) {
            var areas = _.without(constants_1.areaKeys, 0).join(',');
            if (query.area) {
                query.area == '0' && (query.area = areas);
            }
            else {
                query.area = areas;
            }
        }
        switch (base) {
            case 'year':
                query.year = 26;
                break;
            case 'area':
                query.area = 0;
                break;
            case 'gender':
                query.gender = 0;
                break;
        }
        var uri = ['/chart', base, table, x, y || 'none'].join('/');
        this.dispatch('link', uri, query);
    };
    ChartFinderComponent.prototype.writeAllSelector = function (target, placeholder, suffix) {
        var _this = this;
        if (suffix === void 0) { suffix = ''; }
        var selectable = this.selectableKeys(target);
        var labels = ['大分類', '詳細'];
        return React.createElement("select", {"className": "chart-finder selector", "ref": target, "key": target + "list", "defaultValue": this.state[target], "onChange": function (e) { return _this.change(target, e.target.value); }}, React.createElement("option", {"className": "placeholder", "name": target, "value": 'none', "key": target + "-default"}, placeholder), _.map(selectable, function (group, i) {
            return React.createElement("optgroup", {"key": "finder-group-" + i, "label": labels[i]}, _.map(group, function (_a) {
                var key = _a.key, name = _a.name;
                return React.createElement("option", {"name": target, "value": key, "key": target + "-" + key}, name, suffix);
            }));
        }));
    };
    ChartFinderComponent.prototype.writeYSelector = function () {
        return this.writeAllSelector('table', '（表の縦軸）');
    };
    ChartFinderComponent.prototype.writeXSelector = function () {
        return this.writeAllSelector('x', '（表の横軸）');
    };
    ChartFinderComponent.prototype.writeYSplitter = function () {
        return this.writeAllSelector('y', '分割しない', 'で分割');
    };
    ChartFinderComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null, React.createElement("article", {"className": "chart-finder body"}, React.createElement("section", {"className": "chart-finder section"}, React.createElement(fa_1.default, {"icon": "arrows-v"}), React.createElement("div", {"className": "chart-finder section-input"}, this.writeYSelector()), React.createElement("div", {"className": "chart-finder section-suffix"}, "の自殺者数を")), React.createElement("section", {"className": "chart-finder section"}, React.createElement(fa_1.default, {"icon": "arrows-h"}), React.createElement("div", {"className": "chart-finder section-input"}, this.writeXSelector()), React.createElement("div", {"className": "chart-finder section-suffix"}, "で並べて")), React.createElement("section", {"className": "chart-finder section"}, React.createElement("div", {"className": "chart-finder section-input"}, React.createElement("button", {"className": "chart-finder submit", "onClick": function () { return _this.find(); }}, React.createElement(fa_1.default, {"icon": "bar-chart"}), "表示する"))), React.createElement("section", {"className": "chart-finder section"}, React.createElement(fa_1.default, {"icon": "ellipsis-v"}), React.createElement("div", {"className": "chart-finder section-input"}, this.writeYSplitter()))));
    };
    return ChartFinderComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartFinderComponent;
//# sourceMappingURL=chart-finder.js.map