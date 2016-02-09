var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var eventer_1 = require('../lib/eventer');
var fetcher_1 = require('../services/fetcher');
var normalizer_1 = require("../services/normalizer");
var ChartContext = (function (_super) {
    __extends(ChartContext, _super);
    function ChartContext() {
        _super.apply(this, arguments);
    }
    ChartContext.prototype.initialState = function (props) {
        return {};
    };
    ChartContext.prototype.componentDidMount = function () {
        this.fetchData(this.props);
    };
    ChartContext.prototype.componentWillReceiveProps = function (nextProps) {
        this.fetchData(nextProps, this.props);
    };
    ChartContext.prototype.fetchData = function (props, preProps) {
        var _this = this;
        fetcher_1.fetch(props, function (result) {
            var _a = props.params, base = _a.base, table = _a.table, x = _a.x, y = _a.y;
            var data = result.data;
            var tableListList = normalizer_1.normalize(data);
            setTimeout(function () { return _this.setState({ tableListList: tableListList, base: base, table: table, x: x, y: y }); }, 1);
        });
    };
    ChartContext.prototype.listen = function (to) {
        var _this = this;
        to('area:select', function (areas) {
            var query = _this.setToQuery('area', areas);
            _this.changeQuery(query);
        });
        to('chart:autoScale', function (autoScale) {
            var query = _this.props.location.query;
            query.autoScale = autoScale;
            _this.changeQuery(query);
        });
        to('chart:par', function (par) {
            var query = _this.props.location.query;
            query.par = par;
            _this.changeQuery(query);
        });
        to('chart:year', function (years) {
            var query = _this.setToQuery('year', years);
            _this.changeQuery(query);
        });
        to('chart:gender', function (genders) {
            var query = _this.setToQuery('gender', genders);
            _this.changeQuery(query);
        });
    };
    ChartContext.prototype.setToQuery = function (key, value) {
        var query = this.props.location.query;
        if (value && value.length) {
            query[key] = value.join(',');
        }
        else {
            delete query[key];
        }
        return query;
    };
    ChartContext.prototype.changeQuery = function (query) {
        this.props.history.pushState(null, this.props.location.pathname, query);
    };
    ChartContext.prototype.queryToArray = function (key) {
        var target = this.props.location.query[key];
        if (!target) {
            return [];
        }
        return target.split(',');
    };
    Object.defineProperty(ChartContext.prototype, "years", {
        get: function () {
            return this.queryToArray('year');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartContext.prototype, "genders", {
        get: function () {
            return this.queryToArray('year');
        },
        enumerable: true,
        configurable: true
    });
    return ChartContext;
})(eventer_1.Root);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartContext;
//# sourceMappingURL=chart.js.map