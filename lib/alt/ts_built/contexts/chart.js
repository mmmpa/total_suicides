var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var eventer_1 = require('../lib/eventer');
var fetcher_1 = require('../services/fetcher');
var normalizer_1 = require("../services/normalizer");
var chart_set_1 = require("../models/chart-set");
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
        var dataList = this.state.dataList;
        this.setState({ table: table, split: split, sort: sort, dataList: dataList });
    };
    ChartContext.prototype.componentDidMount = function () {
        this.fetchData(this.props);
        this.relay(this.props);
    };
    ChartContext.prototype.componentWillReceiveProps = function (nextProps) {
        this.fetchData(nextProps, this.props);
        this.relay(nextProps);
    };
    ChartContext.prototype.fetchData = function (props, preProps) {
        var _this = this;
        fetcher_1.fetch(props, function (result) {
            var _a = props.params, title = _a.title, column = _a.column, row = _a.row;
            var data = result.data, table = result.table;
            var tableList = normalizer_1.normalize({ title: title, column: column, row: row, table: table, data: data });
            var dataList = _.map(tableList, function (table) {
                var chartSet = chart_set_1.default.fromTable(table);
                return { chartSet: chartSet, table: table };
            });
            _this.setState({ dataList: dataList });
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