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
        var data = props.data;
        var _a = props.params, table = _a.table, split = _a.split, sort = _a.sort;
        return { data: data, table: table, split: split, sort: sort };
    };
    ChartContext.prototype.relay = function (props) {
        //let {data} = props;
        var _a = props.params, table = _a.table, split = _a.split, sort = _a.sort;
        this.setState({ table: table, split: split, sort: sort });
        console.log('relay', this.state);
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
        if (this.needFetch(props, preProps)) {
            fetcher_1.fetchWithParams(props, function (data) {
                var _a = props.params, table = _a.table, split = _a.split, rotation = _a.rotation;
                _this.setState({ table: table, split: split, rotation: rotation, data: data });
            });
        }
    };
    ChartContext.prototype.needFetch = function (props, preProps) {
        if (!preProps)
            return true;
        if (props.location.pathname != preProps.location.pathname)
            return true;
        var different = false;
        _.each(props.location.query, function (value, key) {
            if (key == 'autoScale') {
                return;
            }
            var now = preProps.location.query[key];
            if (!now || now != value) {
                return different = true;
            }
        });
        console.log(props.location.query);
        return different;
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