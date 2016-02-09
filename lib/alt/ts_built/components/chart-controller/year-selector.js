var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../../lib/eventer');
var constants_1 = require("../../initializers/constants");
var _ = require('lodash');
var YearSelectorComponent = (function (_super) {
    __extends(YearSelectorComponent, _super);
    function YearSelectorComponent() {
        _super.apply(this, arguments);
    }
    YearSelectorComponent.prototype.isChecked = function (key) {
        return _.includes(this.selected, key);
    };
    Object.defineProperty(YearSelectorComponent.prototype, "selected", {
        get: function () {
            var year = this.props.location.query.year;
            if (!year) {
                return [];
            }
            return year.split(',').map(function (n) { return +n; });
        },
        enumerable: true,
        configurable: true
    });
    YearSelectorComponent.prototype.toggle = function (key) {
        var now = this.selected;
        if (this.isChecked(key)) {
            now = _.without(now, key);
        }
        else {
            now.push(key);
        }
        this.dispatch('chart:year', now);
    };
    YearSelectorComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null, React.createElement("section", {"className": "selector-area year-selector body"}, React.createElement("section", {"className": "year-selector year-list"}, _.map(constants_1.default.years, function (_a) {
            var key = _a.key, name = _a.name;
            return React.createElement("div", {"key": "year-selector-" + key}, React.createElement("label", null, React.createElement("span", {"className": "input-input"}, React.createElement("input", {"type": "checkbox", "name": "year", "checked": _this.isChecked(key), "onChange": function () { return _this.toggle(key); }})), React.createElement("span", {"className": "input-label"}, name)));
        }))));
    };
    return YearSelectorComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = YearSelectorComponent;
//# sourceMappingURL=year-selector.js.map