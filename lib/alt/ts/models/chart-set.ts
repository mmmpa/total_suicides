import Table from "./table";
import * as _ from 'lodash'

export default class ChartSet {
  constructor(public series:any[] = [],public parSeries:any[] = [], public data:any[] = []) {

  }

  static fromTable(table:Table){
    let series = _.map(table.column, (v, k)=> {
      return {field: v.key, name: v.name}
    });

    let parSeries = _.map(table.column, (v, k)=> {
      return {field: v.key + 'par', name: v.name}
    });

    let data = _.map(table.rowTitle, (title, i)=>{
      let result = {sort: title};
      _.each(table.row[i], (v, k)=>{
        result[k] = v.number;
        result[k + 'par'] = v.par;
      });
      return result;
    });

    return new ChartSet(series, parSeries, data)
  }


  get configuration() {
    return {}
  }
}