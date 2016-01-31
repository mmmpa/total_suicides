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
    var _a = props.params, table = _a.table, split = _a.split, year = _a.year, filter = _a.filter;
    if (split != 'year' && !year && !filter) {
        throw 'year required';
    }
    if (!!split && split != 'gender' && split != 'area') {
        var store = split;
        split = table;
        table = store;
    }
    var yearParam = year || '-';
    var genderParam = split == 'gender' ? '1,2' : '0';
    var areaParam = split == 'area' ? '-' : '0';
    if (table == 'area') {
        table = 'total';
        areaParam = '-';
    }
    if (table == 'gender') {
        table = 'total';
        genderParam = '-';
    }
    var uri = ['/api', genderParam, yearParam, areaParam, table].join('/');
    request
        .get(uri)
        .end(function (err, res) {
        return !!err ? null : callback({ table: props.params.table, split: props.params.split, data: res.body });
    });
}
exports.fetchWithParams = fetchWithParams;
//# sourceMappingURL=fetcher.js.map