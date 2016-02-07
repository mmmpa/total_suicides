var constants_1 = require("../initializers/constants");
var request = require('superagent');
var Fetcher = (function () {
    function Fetcher() {
        this.store = {};
    }
    Fetcher.prototype.isSameQuery = function (query) {
        var _this = this;
        if (!this.preQuery) {
            return false;
        }
        var different = true;
        _.each(query, function (v, k) {
            if (_this.preQuery[k] != v) {
                different = false;
            }
        });
        return different;
    };
    Fetcher.prototype.stringifyQuery = function (query) {
        return _.reduce(query, function (a, v, k) {
            return a + k + v;
        }, '');
    };
    Fetcher.prototype.fetch = function (props, callback) {
        var _this = this;
        var params = this.detectApiParam(props);
        var _a = props.params, base = _a.base, table = _a.table, x = _a.x, y = _a.y;
        var _b = props.location.query, year = _b.year, area = _b.area, gender = _b.gender, item = _b.item;
        var uri = ['/api/table', base, table, x, y].join('/');
        var pickedQuery = { year: year, area: area, gender: gender, item: item };
        var uriStore = uri + this.stringifyQuery(pickedQuery);
        if (this.isSameQuery(pickedQuery) && (this.pre == uriStore || this.store[uriStore])) {
            console.log(this.pre == uriStore ? "double request " + uri : "retrieve from store " + uri);
            var data = this.store[uriStore] || [];
            callback({ base: base, table: table, x: x, y: y, data: data });
            return;
        }
        this.preQuery = pickedQuery;
        this.pre = uriStore;
        request
            .get(uri)
            .query(pickedQuery)
            .end(function (err, res) {
            _this.pre = null;
            if (!!err) {
            }
            else {
                console.log("fetched from " + uri, res.body);
                var data = res.body;
                _this.store[uriStore] = data;
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