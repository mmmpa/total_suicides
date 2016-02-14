function stringifyParams(gender, area, year, detailName, x, xSpecified, y, ySpecified, z) {
    var uri = [gender, area, year, detailName].join('_');
    var filter = [x, xSpecified, y, ySpecified, z].join('_');
    return [uri, filter].join('__');
}
exports.stringifyParams = stringifyParams;
function retrieveParams(stringified) {
    var src = stringified.split('__');
    var _a = src[0].split('_'), gender = _a[0], area = _a[1], year = _a[2], detailName = _a[3];
    var _b = src[1].split('_'), x = _b[0], xSpecifiedSrc = _b[1], y = _b[2], ySpecified = _b[3], z = _b[4];
    var xSpecified = xSpecifiedSrc.split(',');
    return { gender: gender, area: area, year: year, detailName: detailName, x: x, xSpecified: xSpecified, y: y, ySpecified: ySpecified, z: z };
}
exports.retrieveParams = retrieveParams;
//# sourceMappingURL=params-stringifier.js.map