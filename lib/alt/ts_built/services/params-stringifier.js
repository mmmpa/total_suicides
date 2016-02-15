function stringifyParams(x, xSpecified, y, ySpecified, z) {
    return [x, xSpecified, y, ySpecified, z].join('_');
}
exports.stringifyParams = stringifyParams;
function retrieveBaseParams(stringified) {
    var _a = stringified.split('_'), x = _a[0], xSpecifiedSrc = _a[1], y = _a[2], ySpecified = _a[3], z = _a[4];
    var xSpecified = xSpecifiedSrc.split(',');
    return new FetchingParams({ x: x, y: y, z: z, xSpecified: xSpecified, ySpecified: ySpecified, src: stringified });
}
exports.retrieveBaseParams = retrieveBaseParams;
function retrieveParams(stringified, base) {
    var _a = stringified.split('_'), y = _a[0], ySpecified = _a[1], z = _a[2];
    var x = base.x, xSpecified = base.xSpecified;
    return new FetchingParams({ x: x, y: y, z: z, xSpecified: xSpecified, ySpecified: ySpecified, src: stringified });
}
exports.retrieveParams = retrieveParams;
var FetchingParams = (function () {
    function FetchingParams(_a) {
        var _this = this;
        var x = _a.x, y = _a.y, z = _a.z, xSpecified = _a.xSpecified, ySpecified = _a.ySpecified, src = _a.src;
        this.x = x;
        this.y = y;
        this.z = z;
        this.xSpecified = xSpecified;
        this.ySpecified = ySpecified;
        this.src = src;
        _.zip([x, y], [xSpecified, ySpecified]).forEach(function (_a) {
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
        if (!this.area) {
            this.area = '0';
        }
        if (!this.gender) {
            this.gender = '0';
        }
        if (!this.year) {
            this.year = z;
        }
        if (!this.detailName) {
            this.detailName = 'total';
            this.detail = 'number';
        }
    }
    FetchingParams.prototype.stringify = function () {
        return [this.x, this.xSpecified, this.y, this.ySpecified, this.z].join('_');
    };
    FetchingParams.prototype.additionalStringify = function () {
        return [this.y, this.ySpecified, this.z].join('_');
    };
    return FetchingParams;
})();
exports.FetchingParams = FetchingParams;
//# sourceMappingURL=params-stringifier.js.map