var request = require('superagent');
var Fetcher = (function () {
    function Fetcher() {
        this.store = {};
    }
    Fetcher.prototype.fetch = function (params, callback) {
        var _this = this;
        var gender = params.gender, area = params.area, year = params.year, table = params.table;
        var uri = ['/api', gender, year, area, table].join('/');
        if (this.pre == uri || this.store[uri]) {
            console.log(this.pre == uri ? 'double request ${uri}' : "retrieve from store " + uri);
            var data = this.store[uri] || [];
            callback({ gender: gender, area: area, year: year, table: table, data: data });
            return;
        }
        this.pre = uri;
        request
            .get(uri)
            .end(function (err, res) {
            if (!!err) {
            }
            else {
                console.log("fetched from " + uri);
                var data = res.body;
                _this.store[uri] = data;
                callback({ gender: gender, area: area, year: year, table: table, data: data });
            }
        });
    };
    return Fetcher;
})();
var f = new Fetcher();
function fetch(params, callback) {
    f.fetch(params, callback);
}
exports.fetch = fetch;
//# sourceMappingURL=fetcher.js.map