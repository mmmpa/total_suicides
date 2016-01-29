import {scale} from 'd3';

export default class Constants {
  static tables:string[] = ['age', 'housemate', 'job', 'location', 'way', 'hour', 'day', 'reason', 'attempted', 'total'];
  static horizontals:string[] = ['year', 'gender', 'area'];

  static pieSize:number = 500;
  static pieWidth:number = 600;
  static pieHeight:number = 500;
  static pieInnerSize:number = 50;
  static pieColors:string[] = scale.category20();

  static get pieProps() {
    return {
      colors: this.pieColors,
      width: this.pieWidth,
      height: this.pieHeight,
      radius: this.pieSize / 3,
      innerRadius: this.pieInnerSize / 2,
      sectorBorderColor: 'white'
    };
  }

  static ageProps = {
    keys: ['o0', 'o20', 'o30', 'o40', 'o50', 'o60', 'o70', 'o80', 'unknown'],
    texts: ['20歳未満', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80歳以上']
  };

  static housemateProps = {
    keys: ['yes', 'no', 'unknown'],
    texts: ['あり', 'なし', '不詳']
  };

  static jobProps = {
    keys: ['self_employed', 'employed', 'total_unemployed', 'student', 'not_student', 'unemployed', 'stay_at_home', 'pensioner', 'unknown'],
    texts: ['自営業・家族従業者', '被雇用・勤め人', '無職', '学生・生徒等', '無職者', '主婦', '失業者', '年金・雇用保険等生活者', '', 'その他の無職者']
  };

  static locationProps = {
    keys: ['home', 'building', 'vehicle', 'sea', 'mountain', 'other', 'unknown'],
    texts: ['自宅等', '高層ビル', '乗物', '海（湖）・河川等', '山', 'その他', '不詳']
  };

  static wayProps = {
    keys: ['hanging', 'poison', 'briquet', 'jumping', 'diving', 'other', 'unknown'],
    texts: ['首つり', '服毒', '練炭等', '飛降り', '飛込み', 'その他', '不詳']
  };

  static hourProps = {
    keys: ['a0', 'a2', 'a4', 'a6', 'a8', 'a10', 'a12', 'a14', 'a16', 'a18', 'a20', 'a22', 'unknown'],
    texts: ['0-2時', '2-4時', '4-6時', '6-8時', '8-10時', '10-12時', '12-14時', '14-16時', '16-18時', '18-20時', '20-22時', '22-24時', '不詳']
  };

  static dayProps = {
    keys: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'unknown'],
    texts: ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜', '不詳']
  };

  static reasonProps = {
    keys: ['family', 'health', 'life', 'work', 'partner', 'school', 'other', 'unknown'],
    texts: ['家庭問題', '健康問題', '経済・生活問題', '勤務問題', '男女問題', '学校問題', 'その他', '不詳']
  };

  static attemptedProps = {
    keys: ['yes', 'no', 'unknown'],
    texts: ['あり', 'なし', '不詳']
  };

  static totalProps = {
    keys: ['hanging', 'poison', 'briquet', 'jumping', 'diving', 'other', 'unknown'],
    texts: ['自殺者数', '自殺死亡率']
  };
}