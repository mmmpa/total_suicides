export default class Constants {
  static tables:string[] = ['age', 'housemate', 'job', 'location', 'way', 'hour', 'day', 'reason', 'attempted', 'total'];
  static horizontals:string[] = ['year', 'gender', 'area'];

  static pieSize:number = 500;
  static pieWidth:number = 600;
  static pieHeight:number = 500;
  static pieInnerSize:number = 50;

  static dayKeys:string[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'unknown'];
  static dayTexts:string[] = ['日', '月', '火', '水', '木', '金', '土', '不明'];
}