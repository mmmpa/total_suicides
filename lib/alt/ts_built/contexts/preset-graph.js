var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var eventer_1 = require('../lib/eventer');
var PresetGraph = (function (_super) {
    __extends(PresetGraph, _super);
    function PresetGraph() {
        _super.apply(this, arguments);
    }
    PresetGraph.prototype.initialState = function (props) {
        var data = props.data, table = props.table, split = props.split;
        return { data: data, table: table, split: split };
    };
    PresetGraph.prototype.relay = function (props) {
        var data = props.data, table = props.table, split = props.split;
        this.setState({ data: data, table: table, split: split });
    };
    PresetGraph.prototype.componentDidMount = function () {
        this.relay(this.props);
    };
    PresetGraph.prototype.componentWillReceiveProps = function (nextProps) {
        this.relay(nextProps);
    };
    PresetGraph.prototype.listen = function (to) {
        var _this = this;
        to('increment', function () {
            console.log('context increment');
            _this.dispatch('increment');
        });
    };
    return PresetGraph;
})(eventer_1.Root);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PresetGraph;
//# sourceMappingURL=preset-graph.js.map