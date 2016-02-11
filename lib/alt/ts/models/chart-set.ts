import Table from "./table";
import * as _ from 'lodash'
import Constants from '../initializers/constants'

export default class ChartSet {
  constructor(public series:any[] = [], public parSeries:any[] = [], public data:any[] = []) {

  }

  static fromTable(table:Table) {
    let series = _.compact(_.map(table.column, (k)=> {
      if (table.column.length >= 2) {
        if (_.includes(['総計', '総数', '全国'], k)) {
          return null
        }
      }
      return {field: k, name: k, color: Constants.detectColor(k)}
    }));

    let parSeries = _.compact(_.map(table.column, (k)=> {
      return {field: k + 'par', name: k}
    }));

    let data = _.compact(_.map(table.rowTitle, (title, i)=> {
      let result = {sort: title};
      _.each(table.row[i], (row)=> {
        result[row.key] = row.value.number;
        result[row.key + 'par'] = row.value.par;
      });
      return result;
    }));

    return new ChartSet(series, parSeries, data)
  }
}