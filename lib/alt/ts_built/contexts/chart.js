var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var eventer_1 = require('../lib/eventer');
var ChartContext = (function (_super) {
    __extends(ChartContext, _super);
    function ChartContext() {
        _super.apply(this, arguments);
    }
    ChartContext.prototype.initialState = function (props) {
        var data = props.data, table = props.table, split = props.split;
        return { data: data, table: table, split: split };
    };
    ChartContext.prototype.relay = function (props) {
        var data = props.data, table = props.table, split = props.split;
        this.setState({ data: data, table: table, split: split });
    };
    ChartContext.prototype.componentDidMount = function () {
        this.relay(this.props);
    };
    ChartContext.prototype.componentWillReceiveProps = function (nextProps) {
        this.relay(nextProps);
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