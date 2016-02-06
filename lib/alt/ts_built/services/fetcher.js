var constants_1 = require("../initializers/constants");
var request = require('superagent');
var Fetcher = (function () {
    function Fetcher() {
        this.store = {};
    }
    Fetcher.prototype.fetch = function (props, callback) {
        var _this = this;
        var params = this.detectApiParam(props);
        var _a = props.params, base = _a.base, table = _a.table, x = _a.x, y = _a.y;
        var uri = ['/api/table', base, table, x, y].join('/');
        if (this.pre == uri || this.store[uri]) {
            console.log(this.pre == uri ? 'double request ${uri}' : "retrieve from store " + uri);
            var data = this.store[uri] || [];
            callback({ base: base, table: table, x: x, y: y, data: data });
            return;
        }
        this.pre = uri;
        request
            .get(uri)
            .end(function (err, res) {
            if (!!err) {
            }
            else {
                console.log("fetched from " + uri, res.body);
                var data = res.body;
                _this.store[uri] = data;
                callback({ base: base, table: table, x: x, y: y, data: data });
            }
        });
    };
    Fetcher.prototype.detectApiParam = function (props) {
        var _a = props.params, title = _a.title, column = _a.column, row = _a.row;
        var _b = props.location.query, yearFilter = _b.yearFilter, areaFilter = _b.areaFilter, genderFilter = _b.genderFilter, itemFilter = _b.itemFilter;
        var requires = [title, column, row];
        var table = this.pickTable(requires);
        var year = yearFilter || constants_1.default.years[0].key;
        if (_.includes(requires, 'year')) {
            year = '-';
        }
        var area = '0';
        if (_.includes(requires, 'area')) {
            area = areaFilter || '-';
        }
        var gender = '0';
        if (_.includes(requires, 'gender')) {
            gender = genderFilter || '1,2';
        }
        return { gender: gender, area: area, year: year, table: table };
    };
    Fetcher.prototype.pickTable = function (names) {
        var table;
        _.each(names, function (name) {
            if (_.includes(constants_1.default.tableKeys, name)) {
                if (table && name == 'total') {
                }
                else {
                    table = name;
                }
            }
        });
        return table || 'total';
    };
    return Fetcher;
})();
var f = new Fetcher();
function fetch(params, callback) {
    f.fetch(params, callback);
}
exports.fetch = fetch;
//# sourceMappingURL=fetcher.js.map