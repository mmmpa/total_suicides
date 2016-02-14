var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var eventer_1 = require('../lib/eventer');
var ChartFinderContext = (function (_super) {
    __extends(ChartFinderContext, _super);
    function ChartFinderContext() {
        _super.apply(this, arguments);
    }
    ChartFinderContext.prototype.initialState = function (props) {
        return {};
    };
    ChartFinderContext.prototype.listen = function (to) {
    };
    return ChartFinderContext;
})(eventer_1.Root);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartFinderContext;
//# sourceMappingURL=chart-finder-context.js.map