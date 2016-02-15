var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var eventer_1 = require('../lib/eventer');
var fetcher_1 = require('../services/fetcher');
var normalizer_1 = require("../services/normalizer");
var params_stringifier_1 = require("../services/params-stringifier");
var ChartContext = (function (_super) {
    __extends(ChartContext, _super);
    function ChartContext() {
        _super.apply(this, arguments);
    }
    ChartContext.prototype.initialState = function (props) {
        return {
            charts: [],
            base: null,
            loaded: []
        };
    };
    ChartContext.prototype.componentDidMount = function () {
        console.log('mount');
        this.fetchData(this.props);
    };
    ChartContext.prototype.componentWillReceiveProps = function (nextProps) {
        this.fetchData(nextProps);
    };
    ChartContext.prototype.fetchData = function (props) {
        var _this = this;
        var query = props.location.query;
        var chartSettings = [];
        var base = params_stringifier_1.retrieveBaseParams(query.base);
        chartSettings.push({
            key: base.src,
            value: base
        });
        for (var i = 1, set = void 0; set = query[("chart" + i)]; i++) {
            console.log({ set: set });
            chartSettings.push({
                key: set,
                value: params_stringifier_1.retrieveParams(set, base)
            });
        }
        chartSettings.forEach(function (_a, i) {
            var key = _a.key, value = _a.value;
            var preKey = _this.state.loaded[i];
            if (preKey === key) {
                return;
            }
            var loaded = _this.state.loaded.concat();
            loaded[i] = key;
            _this.setState({ loaded: loaded });
            var gender = value.gender, year = value.year, area = value.area, detailName = value.detailName;
            fetcher_1.fetchRaw(gender, year, area, detailName, function (data) {
                var charts = _this.state.charts.concat();
                var sliced = normalizer_1.sliceRecordList(data, detailName);
                charts[i] = {
                    key: key, value: value, data: sliced
                };
                _this.setState({ charts: charts });
            });
        });
    };
    ChartContext.prototype.find = function (params) {
        var base = new params_stringifier_1.FetchingParams(params);
        this.setState({ base: base });
        console.log(base.stringify());
        this.dispatch('link', '/v2/chart', { base: base.stringify() });
    };
    ChartContext.prototype.replaceSpecified = function (xSpecified) {
        var query = this.props.location.query;
        var base = params_stringifier_1.retrieveBaseParams(query.base);
        base.xSpecified = xSpecified;
        var nextQuery = { base: base.stringify() };
        var chartSettings = [];
        for (var i = 1, set = void 0; set = query[("chart" + i)]; i++) {
            chartSettings.push({
                key: "chart" + i,
                value: params_stringifier_1.retrieveParams(set, base)
            });
        }
        chartSettings.forEach(function (_a) {
            var key = _a.key, value = _a.value;
            nextQuery[key] = value.additionalStringify();
        });
        this.dispatch('link', '/v2/chart', nextQuery);
    };
    ChartContext.prototype.listen = function (to) {
        var _this = this;
        to('chart:find', function (params) {
            _this.find(params);
        });
        to('chart:changeX', function (xSpecified) {
            _this.replaceSpecified(xSpecified);
        });
        to('chart:area', function (selectedAreas) {
            _this.setState({ selectedAreas: selectedAreas });
        });
        to('chart:year', function (selectedYears) {
            _this.setState({ selectedYears: selectedYears });
        });
        to('chart:gender', function (selectedGenders) {
            _this.setState({ selectedGenders: selectedGenders });
        });
        to('chart:detail', function (selectedDetail) {
            _this.setState({ selectedDetail: selectedDetail });
        });
    };
    return ChartContext;
})(eventer_1.Root);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartContext;
//# sourceMappingURL=v2.js.map