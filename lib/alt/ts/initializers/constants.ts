import * as _ from 'lodash'

interface IKeyNameMap {
  key:any,
  name:string
}

class Constants {
  static get barProps() {
    return {
      width: 500,
      height: 500,
      sectorBorderColor: 'white',
      fontSize: "12px"
    };
  }

  static normalColor(index) {
    return this.wheelColors[(index * 31) % this.wheelColors.length]
  }

  static wheelColors:string[] = ['#0086AB', '#0098A6', '#00A199', '#009C7F', '#009767', '#009250', '#059C30', '#0BA60B', '#3BB111', '#6FBB18', '#A4C520', '#B6D11B', '#CBDC15', '#E4E80F', '#F3EB08', '#FFE600', '#FBDA02', '#F8CF05', '#F4C107', '#F1B709', '#EDAD0B', '#E58611', '#DE6316', '#D6431B', '#CF2620', '#C7243A', '#C42245', '#C01F52', '#BD1D5D', '#B91B67', '#B61972', '#AF1C74', '#A81F76', '#A12275', '#9A2475', '#932674', '#953095', '#7F3B97', '#6C469A', '#5F519C', '#5D639E', '#4D5FA3', '#3B60A8', '#2962AD', '#156BB2', '#007AB7', '#007CB5', '#0080B2', '#0081B0', '#0085AD'];

  static _colorKeys;
  static get colorKeys() {
    if (this._colorKeys) {
      return this._colorKeys;
    }
    this._colorKeys = {};

    _.each(_.union(this.tablePropList, this.metaPropsList), (props)=> {
      _.each(props, ({name}, i)=> {
        this._colorKeys[name] = i;
      });
    });

    return this._colorKeys;
  }

  static detectColor(name:string):string {
    return this.normalColor(this.colorKeys[name]);
  }

  static get tablePropList() {
    return [
      this.ageProps,
      this.housemateProps,
      this.jobProps,
      this.locationProps,
      this.wayProps,
      this.hourProps,
      this.dayProps,
      this.reasonProps,
      this.attemptedProps,
      this.totalProps
    ]
  }

  static get tableMaps() {
    return [
      {key: 'age', value: this.ageProps},
      {key: 'housemate', value: this.housemateProps},
      {key: 'job', value: this.jobProps},
      {key: 'location', value: this.locationProps},
      {key: 'way', value: this.wayProps},
      {key: 'hour', value: this.hourProps},
      {key: 'day', value: this.dayProps},
      {key: 'reason', value: this.reasonProps},
      {key: 'attempted', value: this.attemptedProps},
      {key: 'total', value: this.totalProps},
    ]
  }

  static get metaMaps() {
    return [
      {key: 'year', value: this.years},
      {key: 'area', value: this.areas},
      {key: 'gender', value: this.genders}
    ]
  }

  static get metaPropsList() {
    return [
      this.areas,
      this.genders,
      this.years
    ]
  }

  static tables:IKeyNameMap[] = [
    {key: 'age', name: '年齢層'},
    {key: 'housemate', name: '同居人の有無'},
    {key: 'job', name: '職業'},
    {key: 'location', name: '場所'},
    {key: 'way', name: '手段'},
    {key: 'hour', name: '時間帯'},
    {key: 'day', name: '曜日'},
    {key: 'reason', name: '原因・動機'},
    {key: 'attempted', name: '未遂歴'},
    {key: 'total', name: '総数'}
  ];

  static metas:IKeyNameMap[] = [
    {key: 'area', name: '都道府県'},
    {key: 'gender', name: '性別'},
    {key: 'year', name: '年度'},
  ]

  static _tableKeys;
  static get tableKeys() {
    return this._tableKeys = this.tables.map((o)=> o.key);
  }

  static ageProps:IKeyNameMap[] = [
    {key: 'o0', name: '20歳未満'},
    {key: 'o20', name: '20-29歳'},
    {key: 'o30', name: '30-39歳'},
    {key: 'o40', name: '40-49歳'},
    {key: 'o50', name: '50-59歳'},
    {key: 'o60', name: '60-69歳'},
    {key: 'o70', name: '70-79歳'},
    {key: 'o80', name: '80歳以上'},
    {key: 'unknown', name: '不詳'},
  ];

  static housemateProps:IKeyNameMap[] = [
    {key: 'yes', name: 'あり'},
    {key: 'no', name: 'なし'},
    {key: 'unknown', name: '不詳'},
  ];

  static jobProps:IKeyNameMap[] = [
    {key: 'self_employed', name: '自営業・家族従業者'},
    {key: 'employed', name: '被雇用・勤め人'},
    {key: 'student', name: '学生・生徒等'},
    {key: 'stay_at_home', name: '主婦'},
    {key: 'lost_job', name: '失業者'},
    {key: 'pensioner', name: '年金・雇用保険等生活者'},
    {key: 'unemployed', name: 'その他の無職者'},
    {key: 'unknown', name: '不詳'},
  ];

  static locationProps:IKeyNameMap[] = [
    {key: 'home', name: '自宅等'},
    {key: 'building', name: '高層ビル'},
    {key: 'vehicle', name: '乗物'},
    {key: 'sea', name: '海（湖）・河川等'},
    {key: 'mountain', name: '山'},
    {key: 'other', name: 'その他'},
    {key: 'unknown', name: '不詳'},
  ];

  static wayProps:IKeyNameMap[] = [
    {key: 'hanging', name: '首つり'},
    {key: 'poison', name: '服毒'},
    {key: 'briquet', name: '練炭等'},
    {key: 'jumping', name: '飛降り'},
    {key: 'diving', name: '飛込み'},
    {key: 'other', name: 'その他'},
    {key: 'unknown', name: '不詳'},
  ];

  static hourProps:IKeyNameMap[] = [
    {key: 'a0', name: '0-2時'},
    {key: 'a2', name: '2-4時'},
    {key: 'a4', name: '4-6時'},
    {key: 'a6', name: '6-8時'},
    {key: 'a8', name: '8-10時'},
    {key: 'a10', name: '10-12時'},
    {key: 'a12', name: '12-14時'},
    {key: 'a14', name: '14-16時'},
    {key: 'a16', name: '16-18時'},
    {key: 'a18', name: '18-20時'},
    {key: 'a20', name: '20-22時'},
    {key: 'a22', name: '22-24時'},
    {key: 'unknown', name: '不詳'},
  ];

  static dayProps:IKeyNameMap[] = [
    {key: 'sunday', name: '日曜'},
    {key: 'monday', name: '月曜'},
    {key: 'tuesday', name: '火曜'},
    {key: 'wednesday', name: '水曜'},
    {key: 'thursday', name: '木曜'},
    {key: 'friday', name: '金曜'},
    {key: 'saturday', name: '土曜'},
    {key: 'unknown', name: '不詳'},
  ];

  static reasonProps:IKeyNameMap[] = [
    {key: 'family', name: '家庭問題'},
    {key: 'health', name: '健康問題'},
    {key: 'life', name: '経済・生活問題'},
    {key: 'work', name: '勤務問題'},
    {key: 'partner', name: '男女問題'},
    {key: 'school', name: '学校問題'},
    {key: 'other', name: 'その他'},
    {key: 'unknown', name: '不詳'},
  ];

  static attemptedProps:IKeyNameMap[] = [
    {key: 'yes', name: 'あり'},
    {key: 'no', name: 'なし'},
    {key: 'unknown', name: '不詳'},
  ];

  static totalProps:IKeyNameMap[] = [
    {key: 'number', name: '自殺者数'},
  ];

  static isIncludedTable(name) {
    return _.includes(this.tableKeys, name)
  }

  static get years():IKeyNameMap[] {
    return _.map([21, 22, 23, 24, 25, 26].reverse(), (n):IKeyNameMap=> {
      return {key: n, name: `平成${n}年`}
    }).reverse();
  }

  static total:IKeyNameMap[] = [
    {key: 0, name: '総数'}
  ];

  static genders:IKeyNameMap[] = [
    {key: 0, name: '総数'},
    {key: 1, name: '女性'},
    {key: 2, name: '男性'}
  ];

  static _areas:IKeyNameMap[];
  static get areas():IKeyNameMap[] {
    if (this._areas) {
      return this._areas;
    }

    this._areas = [];
    this.separatedAreas.map((area)=> {
      area.areas.map((a)=> this._areas.push(a))
    });
    return this._areas;
  }


  static separatedAreas:{name:string, areas:IKeyNameMap[]}[] = [
    {
      name: '全国',
      areas: [
        {key: 0, name: '全国'}
      ]
    },
    {
      name: '北海道',
      areas: [
        {key: 1, name: '北海道'}
      ]
    },
    {
      name: '東北',
      areas: [
        {key: 2, name: '青森県'},
        {key: 3, name: '岩手県'},
        {key: 4, name: '宮城県'},
        {key: 5, name: '秋田県'},
        {key: 6, name: '山形県'},
        {key: 7, name: '福島県'},
      ]
    },
    {
      name: '関東',
      areas: [
        {key: 8, name: '茨城県'},
        {key: 9, name: '栃木県'},
        {key: 10, name: '群馬県'},
        {key: 11, name: '埼玉県'},
        {key: 12, name: '千葉県'},
        {key: 13, name: '東京都'},
        {key: 14, name: '神奈川県'},
      ]
    },
    {
      name: '中部',
      areas: [
        {key: 15, name: '新潟県'},
        {key: 16, name: '富山県'},
        {key: 17, name: '石川県'},
        {key: 18, name: '福井県'},
        {key: 19, name: '山梨県'},
        {key: 20, name: '長野県'},
        {key: 21, name: '岐阜県'},
        {key: 22, name: '静岡県'},
        {key: 23, name: '愛知県'},
      ]
    },
    {
      name: '近畿',
      areas: [
        {key: 24, name: '三重県'},
        {key: 25, name: '滋賀県'},
        {key: 26, name: '京都府'},
        {key: 27, name: '大阪府'},
        {key: 28, name: '兵庫県'},
        {key: 29, name: '奈良県'},
        {key: 30, name: '和歌山県'},
      ]
    },
    {
      name: '中国',
      areas: [
        {key: 31, name: '鳥取県'},
        {key: 32, name: '島根県'},
        {key: 33, name: '岡山県'},
        {key: 34, name: '広島県'},
        {key: 35, name: '山口県'},
      ]
    },
    {
      name: '四国',
      areas: [
        {key: 36, name: '徳島県'},
        {key: 37, name: '香川県'},
        {key: 38, name: '愛媛県'},
        {key: 39, name: '高知県'},
      ]
    },
    {
      name: '九州・沖縄',
      areas: [
        {key: 40, name: '福岡県'},
        {key: 41, name: '佐賀県'},
        {key: 42, name: '長崎県'},
        {key: 43, name: '熊本県'},
        {key: 44, name: '大分県'},
        {key: 45, name: '宮崎県'},
        {key: 46, name: '鹿児島県'},
        {key: 47, name: '沖縄県'}
      ]
    },
    {
      name: 'その他',
      areas: [
        {key: 48, name: '不明'}
      ]
    }
  ];
}

export let generateBarProps = ()=> Constants.barProps;
export let separatedAreas:{name:string, areas:IKeyNameMap[]}[] = Constants.separatedAreas;
export let years:IKeyNameMap[] = Constants.years;
export let areas:IKeyNameMap[] = Constants.areas;
export let genders:IKeyNameMap[] = Constants.genders;
export let tableKeys:any[] = _.map(Constants.tables, ({key})=> key);
export let metaKeys:any[] = _.map(Constants.metas, ({key})=> key);
export let areaKeys:any[] = _.map(Constants.areas, ({key})=> key);
export let yearKeys:any[] = _.map(Constants.years, ({key})=> key);
export let metas:IKeyNameMap[] = Constants.metas;
export let tables:IKeyNameMap[] = Constants.tables;
export let detectColor:(string)=>string = (name) => Constants.detectColor(name);
export let tableMaps = Constants.tableMaps;
export let allMaps = [].concat(Constants.tableMaps, Constants.metaMaps);
export let detectMap = (key)=> _.find(allMaps, (m)=> m.key == key).value;