var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var eventer_1 = require('../lib/eventer');
var fetcher_1 = require('../services/fetcher');
var normalizer_1 = require("../services/normalizer");
var params_stringifier_1 = require("../services/params-stringifier");
var fetched_chart_1 = require("../models/fetched-chart");
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
        this.fetchData(this.props);
    };
    ChartContext.prototype.componentWillReceiveProps = function (nextProps) {
        this.fetchData(nextProps);
    };
    ChartContext.prototype.fetchData = function (props) {
        var _this = this;
        var query = props.location.query;
        if (!query.base) {
            return;
        }
        var chartSettings = [];
        var base = params_stringifier_1.retrieveBaseParams(query.base);
        for (var i = 1, set = void 0; set = query[("chart" + i)]; i++) {
            chartSettings.push(new fetched_chart_1.default(set, "chart" + i, params_stringifier_1.retrieveParams(set, base)));
        }
        this.setState({ base: base });
        var loaded = this.state.loaded.concat();
        var loading = chartSettings.length;
        var charts = [];
        var olds = this.state.charts.concat();
        var onLoaded = function () {
            loading--;
            if (loading === 0) {
                _this.setState({ charts: charts, loaded: loaded });
            }
        };
        chartSettings.forEach(function (chart, i) {
            var key = chart.key, name = chart.name, value = chart.value;
            var preKey = loaded[i];
            if (preKey === key && olds[i]) {
                chart.data = olds[i].data;
                charts[i] = chart;
                onLoaded();
                return;
            }
            var gender = value.gender, year = value.year, area = value.area, detailName = value.detailName;
            fetcher_1.fetchRaw(gender, year, area, detailName, function (data) {
                loaded[i] = key;
                chart.data = data ? normalizer_1.sliceRecordList(data, detailName) : null;
                charts[i] = chart;
                onLoaded();
            });
        });
    };
    ChartContext.prototype.find = function (params) {
        var base = new params_stringifier_1.ChartBase(params.x, params.xSpecified);
        var chart1 = new params_stringifier_1.FetchingParams(base, params);
        this.dispatch('link', '/v2/chart', { base: base.stringify(), chart1: chart1.stringify() });
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
            nextQuery[key] = value.stringify();
        });
        this.dispatch('link', '/v2/chart', nextQuery);
    };
    ChartContext.prototype.add = function (y, ySpecified, z) {
        var query = this.props.location.query;
        var base = params_stringifier_1.retrieveBaseParams(query.base);
        var nextNumber = 1;
        while (query[("chart" + nextNumber)]) {
            nextNumber++;
        }
        query[("chart" + nextNumber)] = new params_stringifier_1.FetchingParams(base, { y: y, ySpecified: ySpecified, z: z }).stringify();
        this.dispatch('link', '/v2/chart', query);
    };
    ChartContext.prototype.remove = function (chartName) {
        var query = this.props.location.query;
        var loaded = this.state.loaded.concat();
        var base = params_stringifier_1.retrieveBaseParams(query.base);
        var nextNumber = 1;
        var nextQuery = { base: base.stringify() };
        var nextLoaded = [loaded[0]];
        for (var i = 1, set = void 0; set = query[("chart" + i)]; i++) {
            if ("chart" + i === chartName) {
                continue;
            }
            nextQuery[("chart" + nextNumber)] = params_stringifier_1.retrieveParams(set, base).stringify();
            nextLoaded[nextNumber] = loaded[i];
            nextNumber++;
        }
        console.log({ nextLoaded: nextLoaded, nextQuery: nextQuery });
        this.setState({ loaded: nextLoaded });
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
        to('chart:add', function (y, ySpecified, z) {
            _this.add(y, ySpecified, z);
        });
        to('chart:remove', function (chartName) {
            console.log('remove');
            _this.remove(chartName);
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