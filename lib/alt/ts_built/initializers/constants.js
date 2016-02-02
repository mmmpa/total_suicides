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
    Object.defineProperty(Constants, "smallPieProps", {
        get: function () {
            return {
                colors: this.pieColors,
                width: this.pieWidth / 2,
                height: this.pieHeight / 2,
                radius: this.pieSize / 6,
                innerRadius: this.pieInnerSize / 4,
                sectorBorderColor: 'white'
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "widePieProps", {
        get: function () {
            return {
                colors: this.pieColors,
                width: this.pieWidth / 1.5,
                height: this.pieHeight / 2,
                radius: this.pieSize / 6,
                innerRadius: this.pieInnerSize / 4,
                sectorBorderColor: 'white'
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "barProps", {
        get: function () {
            return {
                colors: this.pieColors,
                width: 500,
                height: 250,
                sectorBorderColor: 'white',
                fontSize: "14px"
            };
        },
        enumerable: true,
        configurable: true
    });
    Constants.normalColor = function (index) {
        return this.wheelColors[(index * 31) % this.wheelColors.length];
    };
    Object.defineProperty(Constants, "genderBarProps", {
        get: function () {
            return this.barProps;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "areaBarProps", {
        get: function () {
            return this.barProps;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "areas", {
        get: function () {
            var _this = this;
            if (this._areas) {
                return this._areas;
            }
            this._areas = [];
            this.separatedAreas.map(function (area) {
                area.areas.map(function (a) { return _this._areas.push(a); });
            });
            return this._areas;
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
    Constants.monoBlue = ['#103b56', '#13496c', '#175882', '#1a6799', '#1d76af', '#2085c5', '#0d0d0d', '#1a1a1a', '#262626'];
    Constants.wheelColors = ['#0086AB', '#0098A6', '#00A199', '#009C7F', '#009767', '#009250', '#059C30', '#0BA60B', '#3BB111', '#6FBB18', '#A4C520', '#B6D11B', '#CBDC15', '#E4E80F', '#F3EB08', '#FFE600', '#FBDA02', '#F8CF05', '#F4C107', '#F1B709', '#EDAD0B', '#E58611', '#DE6316', '#D6431B', '#CF2620', '#C7243A', '#C42245', '#C01F52', '#BD1D5D', '#B91B67', '#B61972', '#AF1C74', '#A81F76', '#A12275', '#9A2475', '#932674', '#953095', '#7F3B97', '#6C469A', '#5F519C', '#5D639E', '#4D5FA3', '#3B60A8', '#2962AD', '#156BB2', '#007AB7', '#007CB5', '#0080B2', '#0081B0', '#0085AD'];
    Constants.colors = ['#1abc9c', '#3498db', '#f1c40f', '#e74c3c', '#2ecc71', '#9b59b6', '#e67e22', '#34495e', '#95a5a6', '#16a085', '#2980b9', '#f39c12', '#c0392b', '#27ae60', '#8e44ad', '#d35400', '#2c3e50', '#7f8c8d'];
    Constants.ageProps = {
        keys: ['o0', 'o20', 'o30', 'o40', 'o50', 'o60', 'o70', 'o80', 'unknown'],
        texts: ['20歳未満', '20-29歳', '30-39歳', '40-49歳', '50-59歳', '60-69歳', '70-79歳', '80歳以上', '不詳']
    };
    Constants.housemateProps = {
        keys: ['yes', 'no', 'unknown'],
        texts: ['あり', 'なし', '不詳']
    };
    Constants.jobProps = {
        keys: ['self_employed', 'employed', 'student', 'stay_at_home', 'lost_job', 'pensioner', 'unemployed', 'unknown'],
        texts: ['自営業・家族従業者', '被雇用・勤め人', '学生・生徒等', '主婦', '失業者', '年金・雇用保険等生活者', 'その他の無職者', '不詳']
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
        keys: ['number'],
        texts: ['自殺者数']
    };
    Constants.genders = [
        { key: 1, text: '女性' },
        { key: 2, text: '男性' }
    ];
    Constants.separatedAreas = [
        {
            name: '北海道',
            areas: [
                { key: 1, text: '北海道' }
            ]
        },
        {
            name: '東北',
            areas: [
                { key: 2, text: '青森県' },
                { key: 3, text: '岩手県' },
                { key: 4, text: '宮城県' },
                { key: 5, text: '秋田県' },
                { key: 6, text: '山形県' },
                { key: 7, text: '福島県' },
            ]
        },
        {
            name: '関東',
            areas: [
                { key: 8, text: '茨城県' },
                { key: 9, text: '栃木県' },
                { key: 10, text: '群馬県' },
                { key: 11, text: '埼玉県' },
                { key: 12, text: '千葉県' },
                { key: 13, text: '東京都' },
                { key: 14, text: '神奈川県' },
            ]
        },
        {
            name: '中部',
            areas: [
                { key: 15, text: '新潟県' },
                { key: 16, text: '富山県' },
                { key: 17, text: '石川県' },
                { key: 18, text: '福井県' },
                { key: 19, text: '山梨県' },
                { key: 20, text: '長野県' },
                { key: 21, text: '岐阜県' },
                { key: 22, text: '静岡県' },
                { key: 23, text: '愛知県' },
            ]
        },
        {
            name: '近畿',
            areas: [
                { key: 24, text: '三重県' },
                { key: 25, text: '滋賀県' },
                { key: 26, text: '京都府' },
                { key: 27, text: '大阪府' },
                { key: 28, text: '兵庫県' },
                { key: 29, text: '奈良県' },
                { key: 30, text: '和歌山県' },
            ]
        },
        {
            name: '中国',
            areas: [
                { key: 31, text: '鳥取県' },
                { key: 32, text: '島根県' },
                { key: 33, text: '岡山県' },
                { key: 34, text: '広島県' },
                { key: 35, text: '山口県' },
            ]
        },
        {
            name: '四国',
            areas: [
                { key: 36, text: '徳島県' },
                { key: 37, text: '香川県' },
                { key: 38, text: '愛媛県' },
                { key: 39, text: '高知県' },
            ]
        },
        {
            name: '九州・沖縄',
            areas: [
                { key: 40, text: '福岡県' },
                { key: 41, text: '佐賀県' },
                { key: 42, text: '長崎県' },
                { key: 43, text: '熊本県' },
                { key: 44, text: '大分県' },
                { key: 45, text: '宮崎県' },
                { key: 46, text: '鹿児島県' },
                { key: 47, text: '沖縄県' }
            ]
        },
        {
            name: 'その他',
            areas: [
                { key: 48, text: '不明' }
            ]
        }
    ];
    return Constants;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Constants;
//# sourceMappingURL=constants.js.map