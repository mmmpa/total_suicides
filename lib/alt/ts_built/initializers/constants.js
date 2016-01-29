var d3_1 = require('d3');
var Constants = (function () {
    function Constants() {
    }
    Object.defineProperty(Constants, "pieColors", {
        get: function () {
            return d3_1.scale.ordinal().range(this.colors);
        },
        enumerable: true,
        configurable: true
    });
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
    Constants.pieSize = 800;
    Constants.pieWidth = 1000;
    Constants.pieHeight = 800;
    Constants.pieInnerSize = 50;
    Constants.colors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#e74c3c', '#e67e22', '#f1c40f', '#95a5a6', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#c0392b', '#d35400', '#f39c12', '#7f8c8d'];
    Constants.ageProps = {
        keys: ['o0', 'o20', 'o30', 'o40', 'o50', 'o60', 'o70', 'o80', 'unknown'],
        texts: ['20歳未満', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80歳以上']
    };
    Constants.housemateProps = {
        keys: ['yes', 'no', 'unknown'],
        texts: ['あり', 'なし', '不詳']
    };
    Constants.jobProps = {
        keys: ['self_employed', 'employed', 'student', 'stay_at_home', 'lost_job', 'pensioner', 'unknown'],
        texts: ['自営業・家族従業者', '被雇用・勤め人', '学生・生徒等', '主婦', '失業者', '年金・雇用保険等生活者', 'その他の無職者']
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
        keys: ['number', 'rate'],
        texts: ['自殺者数', '自殺死亡率']
    };
    Constants.genders = [
        { key: 1, text: '女性' },
        { key: 2, text: '男性' }
    ];
    Constants.areas = [
        { key: 1, text: '北海道' },
        { key: 2, text: '青森県' },
        { key: 3, text: '岩手県' },
        { key: 4, text: '宮城県' },
        { key: 5, text: '秋田県' },
        { key: 6, text: '山形県' },
        { key: 7, text: '福島県' },
        { key: 8, text: '茨城県' },
        { key: 9, text: '栃木県' },
        { key: 10, text: '群馬県' },
        { key: 11, text: '埼玉県' },
        { key: 12, text: '千葉県' },
        { key: 13, text: '東京都' },
        { key: 14, text: '神奈川県' },
        { key: 15, text: '新潟県' },
        { key: 16, text: '富山県' },
        { key: 17, text: '石川県' },
        { key: 18, text: '福井県' },
        { key: 19, text: '山梨県' },
        { key: 20, text: '長野県' },
        { key: 21, text: '岐阜県' },
        { key: 22, text: '静岡県' },
        { key: 23, text: '愛知県' },
        { key: 24, text: '三重県' },
        { key: 25, text: '滋賀県' },
        { key: 26, text: '京都府' },
        { key: 27, text: '大阪府' },
        { key: 28, text: '兵庫県' },
        { key: 29, text: '奈良県' },
        { key: 30, text: '和歌山県' },
        { key: 31, text: '鳥取県' },
        { key: 32, text: '島根県' },
        { key: 33, text: '岡山県' },
        { key: 34, text: '広島県' },
        { key: 35, text: '山口県' },
        { key: 36, text: '徳島県' },
        { key: 37, text: '香川県' },
        { key: 38, text: '愛媛県' },
        { key: 39, text: '高知県' },
        { key: 40, text: '福岡県' },
        { key: 41, text: '佐賀県' },
        { key: 42, text: '長崎県' },
        { key: 43, text: '熊本県' },
        { key: 44, text: '大分県' },
        { key: 45, text: '宮崎県' },
        { key: 46, text: '鹿児島県' },
        { key: 47, text: '沖縄県' },
        { key: 48, text: '不明' }
    ];
    return Constants;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Constants;
//# sourceMappingURL=constants.js.map