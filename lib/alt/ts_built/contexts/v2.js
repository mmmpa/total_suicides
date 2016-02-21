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
var query_manager_1 = require('../services/query-manager');
var ChartContext = (function (_super) {
    __extends(ChartContext, _super);
    function ChartContext() {
        _super.apply(this, arguments);
        this.loaded = [];
        this.loadedData = [];
    }
    ChartContext.prototype.initialState = function (props) {
        return {
            charts: [],
            base: null,
            per: false
        };
    };
    ChartContext.prototype.componentDidMount = function () {
        this.setConfiguration(this.props);
        this.fetchData(this.props);
    };
    ChartContext.prototype.componentWillReceiveProps = function (nextProps) {
        this.setConfiguration(nextProps);
        this.fetchData(nextProps);
    };
    ChartContext.prototype.setConfiguration = function (props) {
        var query = props.location.query;
        var per = query_manager_1.pickEnabledFromQuery(query, 'per');
        this.setState({ per: per });
    };
    ChartContext.prototype.togglePer = function () {
        var per = !this.state.per;
        this.setState({ per: per });
        var query = this.props.location.query;
        query.per = per;
        this.dispatch('link', '/v2/chart', query, true);
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
        var loaded = this.loaded.concat();
        var loading = chartSettings.length;
        var charts = [];
        var olds = this.loadedData.concat();
        var onLoaded = function () {
            loading--;
            if (loading === 0) {
                _this.loaded = loaded;
                _this.loadedData = charts;
                _this.setState({ base: base, charts: charts });
                console.log({ charts: charts });
            }
        };
        chartSettings.forEach(function (chart, i) {
            var key = chart.key, name = chart.name, value = chart.value, fullKey = chart.fullKey;
            var preKey = loaded[i];
            if (preKey === fullKey && olds[i]) {
                chart.data = olds[i].data;
                charts[i] = chart;
                onLoaded();
                return;
            }
            var gender = value.gender, year = value.year, area = value.area, detailName = value.detailName;
            fetcher_1.fetchRaw(gender, year, area, detailName, function (data) {
                loaded[i] = fullKey;
                chart.data = data ? normalizer_1.sliceRecordList(data, detailName) : null;
                charts[i] = chart;
                onLoaded();
            });
        });
    };
    ChartContext.prototype.find = function (params) {
        this.setState({ charts: [] });
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
        this.loaded = [];
        this.dispatch('link', '/v2/chart', nextQuery, true);
    };
    ChartContext.prototype.add = function (y, ySpecified, zSpecified) {
        var query = this.props.location.query;
        var base = params_stringifier_1.retrieveBaseParams(query.base);
        var nextNumber = 1;
        while (query[("chart" + nextNumber)]) {
            nextNumber++;
        }
        query[("chart" + nextNumber)] = new params_stringifier_1.FetchingParams(base, { y: y, ySpecified: ySpecified, zSpecified: zSpecified }).stringify();
        this.dispatch('link', '/v2/chart', query);
    };
    ChartContext.prototype.remove = function (chartName) {
        var query = this.props.location.query;
        var loaded = this.loaded.concat();
        var loadedData = this.loadedData.concat();
        var base = params_stringifier_1.retrieveBaseParams(query.base);
        var nextNumber = 0;
        var nextQuery = { base: base.stringify(), per: query.per };
        var nextLoaded = [];
        var nextLoadedData = [];
        for (var i = 1, set = void 0; set = query[("chart" + i)]; i++) {
            if ("chart" + i === chartName) {
                continue;
            }
            nextQuery[("chart" + (nextNumber + 1))] = params_stringifier_1.retrieveParams(set, base).stringify();
            nextLoaded[nextNumber] = loaded[i - 1];
            nextLoadedData[nextNumber] = loadedData[i - 1];
            nextNumber++;
        }
        this.loaded = nextLoaded;
        this.loadedData = nextLoadedData;
        this.dispatch('link', '/v2/chart', nextQuery, true);
    };
    ChartContext.prototype.changeType = function (chartName, type) {
        console.log('change type');
        var query = this.props.location.query;
        var base = params_stringifier_1.retrieveBaseParams(query.base);
        var params = params_stringifier_1.retrieveParams(query[chartName], base);
        params.chartType = type;
        query[chartName] = params.stringify();
        this.dispatch('link', '/v2/chart', query, true);
    };
    ChartContext.prototype.goFinder = function () {
        this.dispatch('link', '/');
    };
    ChartContext.prototype.listen = function (to) {
        var _this = this;
        to('chart:finder', function (params) {
            _this.goFinder();
        });
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
            _this.remove(chartName);
        });
        to('chart:per', function () {
            _this.togglePer();
        });
        to('chart:type', function (chartName, type) {
            _this.changeType(chartName, type);
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