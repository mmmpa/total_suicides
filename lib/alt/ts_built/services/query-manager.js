function pickEnabledFromQuery(query, name) {
    var target = query[name];
    return target && target != 'false';
}
exports.pickEnabledFromQuery = pickEnabledFromQuery;
function pickSelectedFromQuery(query, name) {
    var target = query[name];
    if (!target) {
        return [];
    }
    return target.toString().split(',').map(function (n) { return +n; });
}
exports.pickSelectedFromQuery = pickSelectedFromQuery;
//# sourceMappingURL=query-manager.js.map