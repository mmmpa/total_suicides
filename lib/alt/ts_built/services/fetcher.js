var constants_1 = require("../initializers/constants");
var request = require('superagent');
function fetchPreset(presetName, callback) {
    var _a = detectPreset(presetName), uri = _a.uri, state = _a.state;
    request
        .get(uri)
        .end(function (err, res) {
        return !!err ? null : callback(state(res.body));
    });
}
exports.fetchPreset = fetchPreset;
function detectPreset(presetName) {
    if (presetName.match(/([a-z]+)-each-year/)) {
        var table = RegExp.$1;
        return {
            uri: "/api/0/-/0/" + table,
            state: function (data) { return ({ table: table, split: 'year', data: data }); }
        };
    }
    return {};
}
function fetchWithParams(props, callback) {
    var _a = props.params, table = _a.table, split = _a.split, sort = _a.sort, rotation = _a.rotation;
    var _b = props.location.query, area = _b.area, gender = _b.gender, year = _b.year;
    var yearParam = '-';
    var genderParam = split == 'gender' ? '1,2' : '0';
    var areaParam = split == 'area' ? '-' : '0';
    switch (sort) {
        case 'gender':
            genderParam = '0,1,2';
        case 'area':
            areaParam = constants_1.default.areas.map(function (a) { return a.key; }).join(',');
        case 'year':
            yearParam = '-';
        default:
            yearParam = '-';
    }
    if (!!area) {
        areaParam = area;
    }
    if (!!gender) {
        genderParam = gender;
    }
    if (!!year) {
        yearParam = year;
    }
    var uri = ['/api', genderParam, yearParam, areaParam, table].join('/');
    request
        .get(uri)
        .end(function (err, res) {
        if (!!err) {
        }
        else {
            var data = res.body;
            console.log("fetched from " + uri, { table: table, split: split, rotation: rotation, data: data });
            callback(data);
        }
    });
}
exports.fetchWithParams = fetchWithParams;
//# sourceMappingURL=fetcher.js.map