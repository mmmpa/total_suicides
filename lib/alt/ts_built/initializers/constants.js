var d3_1 = require('d3');
var Constants = (function () {
    function Constants() {
    }
    Object.defineProperty(Constants, "pieProps", {
        get: function () {
            return {
                colors: this.pieColors,
                width: this.pieWidth,
                height: this.pieHeight,
                radius: this.pieSize / 3,
                innerRadius: this.pieInnerSize / 2,
                sectorBorderColor: 'white'
            };
        },
        enumerable: true,
        configurable: true
    });
    Constants.tables = ['age', 'housemate', 'job', 'location', 'way', 'hour', 'day', 'reason', 'attempted', 'total'];
    Constants.horizontals = ['year', 'gender', 'area'];
    Constants.pieSize = 500;
    Constants.pieWidth = 600;
    Constants.pieHeight = 500;
    Constants.pieInnerSize = 50;
    Constants.pieColors = d3_1.scale.category20();
    Constants.ageProps = {
        keys: ['o0', 'o20', 'o30', 'o40', 'o50', 'o60', 'o70', 'o80', 'unknown'],
        texts: ['20歳未満', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80歳以上']
    };
    Constants.housemateProps = {
        keys: ['yes', 'no', 'unknown'],
        texts: ['あり', 'なし', '不詳']
    };
    Constants.jobProps = {
        keys: ['self_employed', 'employed', 'total_unemployed', 'student', 'not_student', 'unemployed', 'stay_at_home', 'pensioner', 'unknown'],
        texts: ['自営業・家族従業者', '被雇用・勤め人', '無職', '学生・生徒等', '無職者', '主婦', '失業者', '年金・雇用保険等生活者', '', 'その他の無職者']
    };
    Constants.locationProps = {
        keys: ['home', 'building', 'vehicle', 'sea', 'mountain', 'other', 'unknown'],
        texts: ['自宅等', '高層ビル', '乗物', '海（湖）・河川等', '山', 'その他', '不詳']
    };
    Constants.wayProps = {
        keys: ['hanging', 'poison', 'briquet', 'jumping', 'diving', 'other', 'unknown'],
        texts: ['首つり', '服毒', '練炭等', '飛降り', '飛込み', 'その他', '不詳']
    };
    Constants.hourProps = {
        keys: ['a0', 'a2', 'a4', 'a6', 'a8', 'a10', 'a12', 'a14', 'a16', 'a18', 'a20', 'a22', 'unknown'],
        texts: ['0-2時', '2-4時', '4-6時', '6-8時', '8-10時', '10-12時', '12-14時', '14-16時', '16-18時', '18-20時', '20-22時', '22-24時', '不詳']
    };
    Constants.dayProps = {
        keys: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'unknown'],
        texts: ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜', '不詳']
    };
    Constants.reasonProps = {
        keys: ['family', 'health', 'life', 'work', 'partner', 'school', 'other', 'unknown'],
        texts: ['家庭問題', '健康問題', '経済・生活問題', '勤務問題', '男女問題', '学校問題', 'その他', '不詳']
    };
    Constants.attemptedProps = {
        keys: ['yes', 'no', 'unknown'],
        texts: ['あり', 'なし', '不詳']
    };
    Constants.totalProps = {
        keys: ['hanging', 'poison', 'briquet', 'jumping', 'diving', 'other', 'unknown'],
        texts: ['自殺者数', '自殺死亡率']
    };
    return Constants;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Constants;
//# sourceMappingURL=constants.js.map