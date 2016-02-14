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
            charts: []
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
        var query = props.location.query;
        var chartSettings = [];
        for (var i = 1, set = void 0; set = query[("chart" + i)]; i++) {
            chartSettings.push({
                key: query,
                value: params_stringifier_1.retrieveParams(set)
            });
        }
        chartSettings.forEach(function (_a, i) {
            var key = _a.key, value = _a.value;
            console.log(i);
            var gender = value.gender, year = value.year, area = value.area, detailName = value.detailName;
            fetcher_1.fetchRaw(gender, year, area, detailName, function (data) {
                var sliced = normalizer_1.sliceRecordList(data, detailName);
                console.log({ sliced: sliced });
            });
        });
    };
    ChartContext.prototype.find = function (params) {
        var gender, area, year, detail, detailName;
        var x = params.x, y = params.y, z = params.z, xSpecified = params.xSpecified, ySpecified = params.ySpecified;
        if (!_.includes([x, y], 'year')) {
            year = z;
        }
        _.zip([x, y], [xSpecified, ySpecified]).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            switch (key) {
                case 'area':
                    area = value;
                    break;
                case 'year':
                    year = value;
                    break;
                case 'gender':
                    gender = value;
                    break;
                default:
                    detailName = key;
                    detail = value;
            }
        });
        if (!area) {
            area = '0';
        }
        if (!gender) {
            gender = '0';
        }
        if (!detailName) {
            detailName = 'total';
            detail = 'number';
        }
        var chart1 = params_stringifier_1.stringifyParams(gender, area, year, detailName, x, xSpecified, y, ySpecified, z);
        this.dispatch('link', '/v2/chart', { chart1: chart1 });
    };
    ChartContext.prototype.listen = function (to) {
        var _this = this;
        to('chart:find', function (params) {
            _this.find(params);
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