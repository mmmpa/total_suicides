var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var eventer_1 = require('../lib/eventer');
var fetcher_1 = require('../services/fetcher');
var constants_1 = require("../initializers/constants");
var normalizer_1 = require("../services/normalizer");
var ChartContext = (function (_super) {
    __extends(ChartContext, _super);
    function ChartContext() {
        _super.apply(this, arguments);
    }
    ChartContext.prototype.initialState = function (props) {
        var _a = props.params, table = _a.table, split = _a.split, sort = _a.sort;
        return { table: table, split: split, sort: sort };
    };
    ChartContext.prototype.relay = function (props) {
        var _a = props.params, table = _a.table, split = _a.split, sort = _a.sort;
        this.setState({ table: table, split: split, sort: sort });
    };
    ChartContext.prototype.componentDidMount = function () {
        this.fetchData(this.props);
        this.relay(this.props);
    };
    ChartContext.prototype.componentWillReceiveProps = function (nextProps) {
        this.fetchData(nextProps, this.props);
        this.relay(nextProps);
    };
    ChartContext.prototype.detectApiParam = function (props) {
        var _a = props.params, title = _a.title, column = _a.column, row = _a.row;
        var _b = props.location.query, yearFilter = _b.yearFilter, areaFilter = _b.areaFilter, genderFilter = _b.genderFilter, itemFilter = _b.itemFilter;
        var requires = [title, column, row];
        var table = this.pickTable(requires);
        var year = '-';
        if (_.includes(requires, 'year')) {
            year = yearFilter || constants_1.default.years[0].key;
        }
        var area = '0';
        if (_.includes(requires, 'area')) {
            area = areaFilter || '-';
        }
        var gender = '0';
        if (_.includes(requires, 'gender')) {
            gender = genderFilter || '-';
        }
        return { gender: gender, area: area, year: year, table: table };
    };
    ChartContext.prototype.pickTable = function (names) {
        var table;
        _.each(names, function (name) {
            if (_.includes(constants_1.default.tableKeys, name)) {
                if (table) {
                    throw 'Double table error';
                }
                table = name;
            }
        });
        return table || 'total';
    };
    ChartContext.prototype.fetchData = function (props, preProps) {
        var _this = this;
        var params = this.detectApiParam(props);
        console.log({ params: params });
        fetcher_1.fetch(params, function (result) {
            var _a = props.params, title = _a.title, column = _a.column, row = _a.row;
            var data = result.data, table = result.table;
            var chartDataList = normalizer_1.normalize({ title: title, column: column, row: row, table: table, data: data });
            console.log({ chartDataList: chartDataList });
            _this.setState({ chartDataList: chartDataList });
        });
    };
    ChartContext.prototype.listen = function (to) {
        var _this = this;
        to('area:select', function (key) {
            var query = _this.props.location.query;
            if (key && key.length) {
                query.area = key.join(',');
            }
            else {
                delete query.area;
            }
            _this.props.history.pushState(null, _this.props.location.pathname, query);
        });
        to('chart:autoScale', function (autoScale) {
            var query = _this.props.location.query;
            query.autoScale = autoScale;
            _this.props.history.pushState(null, _this.props.location.pathname, query);
        });
    };
    return ChartContext;
})(eventer_1.Root);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartContext;
//# sourceMappingURL=chart.js.map