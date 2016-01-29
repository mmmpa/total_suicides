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
    var _a = props.params, table = _a.table, split = _a.split, year = _a.year;
    if (split != 'year' && !year) {
        throw 'year required';
    }
    var yearParam = year || '-';
    var genderParam = split == 'gender' ? '1,2' : '0';
    var areaParam = split == 'area' ? '-' : '0';
    var uri = ['/api', genderParam, yearParam, areaParam, table].join('/');
    request
        .get(uri)
        .end(function (err, res) {
        return !!err ? null : callback({ table: table, split: split, data: res.body });
    });
}
exports.fetchWithParams = fetchWithParams;
//# sourceMappingURL=fetcher.js.map