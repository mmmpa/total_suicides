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
    console.log('fetchWithParams');
}
exports.fetchWithParams = fetchWithParams;
//# sourceMappingURL=fetcher.js.map