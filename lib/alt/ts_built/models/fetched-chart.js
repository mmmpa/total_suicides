var _ = require('lodash');
var FetchingChart = (function () {
    function FetchingChart(key, name, value, data) {
        if (data === void 0) { data = []; }
        this.key = key;
        this.name = name;
        this.value = value;
        this.data = data;
        this.data = data;
    }
    Object.defineProperty(FetchingChart.prototype, "data", {
        get: function () {
            return this.data_;
        },
        set: function (value) {
            var _a = this.value, x = _a.x, y = _a.y, xSpecified = _a.xSpecified, ySpecified = _a.ySpecified, z = _a.z;
            this.data_ = _.filter(value, function (d) {
                return _.includes(ySpecified, d[y].content);
            });
            if (x == 'area' || x == 'year' || x == 'gender') {
                this.data_ = _.sortBy(this.data_, function (d) {
                    return d[x].content;
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    return FetchingChart;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FetchingChart;
//# sourceMappingURL=fetched-chart.js.map