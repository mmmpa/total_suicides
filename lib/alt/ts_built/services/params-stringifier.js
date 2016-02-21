function retrieveBaseParams(stringified) {
    var _a = stringified.split('__'), x = _a[0], xSpecifiedSrc = _a[1];
    var xSpecified = xSpecifiedSrc.split(',').map(function (v) {
        var num = +v;
        return isNaN(num) ? v : num;
    });
    return new ChartBase(x, xSpecified, stringified);
}
exports.retrieveBaseParams = retrieveBaseParams;
function retrieveParams(stringified, base) {
    var _a = stringified.split('__'), y = _a[0], ySpecified = _a[1], zSpecified = _a[2], chartType = _a[3];
    return new FetchingParams(base, { y: y, zSpecified: zSpecified, ySpecified: ySpecified, chartType: chartType, src: stringified });
}
exports.retrieveParams = retrieveParams;
var ChartBase = (function () {
    function ChartBase(x, xSpecified, src) {
        this.x = x;
        this.xSpecified = xSpecified;
        this.src = src;
    }
    ChartBase.prototype.stringify = function () {
        return [this.x, this.xSpecified].join('__');
    };
    return ChartBase;
})();
exports.ChartBase = ChartBase;
var FetchingParams = (function () {
    function FetchingParams(base, _a) {
        var _this = this;
        var y = _a.y, zSpecified = _a.zSpecified, ySpecified = _a.ySpecified, src = _a.src, chartType = _a.chartType;
        this.x = base.x;
        this.y = y;
        this.zSpecified = zSpecified;
        this.xSpecified = base.xSpecified;
        this.ySpecified = ySpecified;
        this.src = src;
        this.chartType = chartType;
        if (base) {
            _.zip([base.x, y], [base.xSpecified, ySpecified]).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                switch (key) {
                    case 'area':
                        _this.area = value;
                        break;
                    case 'year':
                        _this.year = value;
                        break;
                    case 'gender':
                        _this.gender = value;
                        break;
                    default:
                        _this.detailName = key;
                        _this.detail = value;
                }
            });
        }
        if (!this.area) {
            this.area = '0';
        }
        if (!this.gender) {
            this.gender = '0';
        }
        if (!this.year) {
            this.year = zSpecified;
        }
        if (!this.detailName) {
            this.detailName = 'total';
            this.detail = 'number';
        }
    }
    FetchingParams.prototype.stringify = function () {
        return [this.y, this.ySpecified, this.zSpecified, this.chartType].join('__');
    };
    FetchingParams.prototype.stringifyAll = function () {
        return [this.x, this.xSpecified, this.y, this.ySpecified, this.zSpecified, this.chartType].join('__');
    };
    return FetchingParams;
})();
exports.FetchingParams = FetchingParams;
//# sourceMappingURL=params-stringifier.js.map