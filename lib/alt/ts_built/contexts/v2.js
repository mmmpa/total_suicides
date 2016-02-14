var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var eventer_1 = require('../lib/eventer');
var fetcher_1 = require('../services/fetcher');
var ChartContext = (function (_super) {
    __extends(ChartContext, _super);
    function ChartContext() {
        _super.apply(this, arguments);
    }
    ChartContext.prototype.initialState = function (props) {
        return {
            selectedYears: [],
            selectedGenders: [],
            selectedAreas: [],
            selectedDetail: null,
            errors: {}
        };
    };
    ChartContext.prototype.find = function () {
        var _a = this.state, selectedAreas = _a.selectedAreas, selectedYears = _a.selectedYears, selectedGenders = _a.selectedGenders, selectedDetail = _a.selectedDetail;
        var errors = _.reduce({ selectedAreas: selectedAreas, selectedYears: selectedYears, selectedGenders: selectedGenders, selectedDetail: selectedDetail }, function (a, value, key) {
            if (!value || value.length === 0) {
                a[key.replace('selected', 'errorOn')] = 'すくなくとも一つ選択してください';
            }
            return a;
        }, {});
        if (_.keys(errors).length === 0) {
            fetcher_1.fetchRaw({
                years: selectedYears,
                genders: selectedGenders,
                areas: selectedAreas,
                detail: selectedDetail
            }, function (data) {
            });
        }
        else {
            this.setState({ errors: errors });
        }
    };
    ChartContext.prototype.componentDidMount = function () {
        //this.fetchData(this.props);
        this.setTitle(this.props);
        this.pickState(this.props);
    };
    ChartContext.prototype.componentWillReceiveProps = function (nextProps) {
        //this.fetchData(nextProps, this.props);
        this.setTitle(nextProps);
        this.pickState(nextProps);
    };
    ChartContext.prototype.pickState = function (props) {
        var selectedAreas = this.pickSelectedFromQuery(props, 'area');
        var selectedYears = this.pickSelectedFromQuery(props, 'year');
        var selectedGenders = this.pickSelectedFromQuery(props, 'gender');
        var selectedDetail = this.pickSelectedFromQuery(props, 'detail', false)[0];
        var autoScale = this.pickEnabledFromQuery(props, 'autoScale');
        var par = this.pickEnabledFromQuery(props, 'par');
        console.log({ selectedAreas: selectedAreas, selectedYears: selectedYears, selectedGenders: selectedGenders, selectedDetail: selectedDetail, autoScale: autoScale, par: par });
        this.setState({ selectedAreas: selectedAreas, selectedYears: selectedYears, selectedGenders: selectedGenders, selectedDetail: selectedDetail, autoScale: autoScale, par: par });
    };
    ChartContext.prototype.pickSelectedFromQuery = function (props, name, num) {
        if (num === void 0) { num = true; }
        var target = props.location.query[name];
        if (!target) {
            return [];
        }
        if (num) {
            return target.toString().split(',').map(function (n) { return +n; });
        }
        else {
            return target.toString().split(',');
        }
    };
    ChartContext.prototype.pickEnabledFromQuery = function (props, name) {
        var target = props.location.query[name];
        return target && target != 'false';
    };
    ChartContext.prototype.setTitle = function (props) {
        var _a = props.params, table = _a.table, x = _a.x;
        //this.dispatch('title', `${this.detect_text(table)}別の自殺者数を${this.detect_text(x)}で並べて表示`)
    };
    ChartContext.prototype.listen = function (to) {
        var _this = this;
        to('chart:find', function () {
            _this.find();
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