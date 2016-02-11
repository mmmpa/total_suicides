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
        this.setTitle(this.props);
        this.pickState(this.props);
    };
    ChartContext.prototype.componentWillReceiveProps = function (nextProps) {
        this.fetchData(nextProps, this.props);
        this.setTitle(nextProps);
        this.pickState(nextProps);
    };
    ChartContext.prototype.pickState = function (props) {
        var area = this.pickSelectedFromQuery(props, 'area');
        var year = this.pickSelectedFromQuery(props, 'year');
        var gender = this.pickSelectedFromQuery(props, 'gender');
        var autoScale = this.pickEnabledFromQuery(props, 'autoScale');
        var par = this.pickEnabledFromQuery(props, 'par');
        console.log({ area: area, year: year, gender: gender, autoScale: autoScale, par: par });
        this.setState({ area: area, year: year, gender: gender, autoScale: autoScale, par: par });
    };
    ChartContext.prototype.pickSelectedFromQuery = function (props, name) {
        var target = props.location.query[name];
        if (!target) {
            return [];
        }
        return target.toString().split(',').map(function (n) { return +n; });
    };
    ChartContext.prototype.pickEnabledFromQuery = function (props, name) {
        var target = props.location.query[name];
        return target && target != 'false';
    };
    ChartContext.prototype.setTitle = function (props) {
        var _a = props.params, table = _a.table, x = _a.x;
        this.dispatch('title', this.detect_text(table) + "\u5225\u306E\u81EA\u6BBA\u8005\u6570\u3092" + this.detect_text(x) + "\u3067\u4E26\u3079\u3066\u8868\u793A");
    };
    ChartContext.prototype.detect_text = function (name) {
        switch (name) {
            case 'area':
                return '地域';
            case 'year':
                return '年度';
            case 'gender':
                return '性別';
            case 'age':
                return '年齢層';
            case 'housemate':
                return '同居人の有無';
            case 'job':
                return '職業';
            case 'location':
                return '場所';
            case 'way':
                return '手段';
            case 'hour':
                return '時間帯';
            case 'day':
                return '曜日';
            case 'reason':
                return '動機・要因';
            case 'attempted':
                return '未遂歴';
            case 'total':
                return '総数';
        }
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
        to('chart:find', function (base, table, x, y, query) {
            var uri = ['/chart', base, table, x, y || 'none'].join('/');
            _this.dispatch('link', uri, query);
        });
        to('chart:area', function (areas) {
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
    return ChartContext;
})(eventer_1.Root);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartContext;
//# sourceMappingURL=chart.js.map