var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var eventer_1 = require('../lib/eventer');
var fa_1 = require('../lib/fa');
var SiteMapComponent = (function (_super) {
    __extends(SiteMapComponent, _super);
    function SiteMapComponent() {
        _super.apply(this, arguments);
    }
    SiteMapComponent.prototype.link = function (e) {
        e.preventDefault();
        this.dispatch('link', e.currentTarget.getAttribute('href'));
    };
    SiteMapComponent.prototype.detectIcon = function (split) {
        return split == 'gender' ? React.createElement(fa_1.default, {"icon": "venus-mars"}) : React.createElement(fa_1.default, {"icon": "globe"});
    };
    SiteMapComponent.prototype.writeLinks = function () {
        var _this = this;
        var splits = [
            { key: 'gender', text: '性別' },
            { key: 'area', text: '地域' }
        ];
        var tables = [
            { key: 'age', text: '年齢層' },
            { key: 'housemate', text: '同居人の有無' },
            { key: 'job', text: '職業' },
            { key: 'location', text: '場所' },
            { key: 'way', text: '手段' },
            { key: 'hour', text: '時間帯' },
            { key: 'day', text: '曜日' },
            { key: 'reason', text: '原因・動機' },
            { key: 'attempted', text: '未遂歴' },
            { key: 'total', text: '総数' },
        ];
        var link = this.link.bind(this);
        return tables.map(function (table) {
            return React.createElement("section", {"className": "site-map sub-section", "key": table.key}, splits.map(function (split) {
                return React.createElement("section", {"className": "site-map link-set", "key": split.key}, _this.detectIcon(split.key), React.createElement("span", {"className": "site-map main-link"}, React.createElement("a", {"href": "/bar/" + table.key + "/" + split.key + "/-", "onClick": link}, React.createElement("span", {"className": "site-map split"}, ""), "" + table.text)), React.createElement("span", {"className": "site-map sub-link"}, React.createElement("a", {"href": "/bar/" + split.key + "/" + table.key + "/-", "onClick": link}, "(" + split.text + "\u5225\u8868)")));
            }));
        });
    };
    SiteMapComponent.prototype.render = function () {
        var link = this.link.bind(this);
        return React.createElement("div", null);
    };
    return SiteMapComponent;
})(eventer_1.Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SiteMapComponent;
//# sourceMappingURL=site-map.js.map