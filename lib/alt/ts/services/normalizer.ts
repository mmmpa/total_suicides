import * as _ from 'lodash';
import Table from "../models/table";
import ChartSet from "../models/chart-set";
import {tableMaps} from '../initializers/constants'

let preData = null;
let preResult = null;

export function sliceRecord(data) {

}

export function sliceRecordList(data:any[], detailName:string) {
  console.log(data)

  let tableMap = _.find(tableMaps, ({key})=> {
    return key == detailName
  }).value;

  let result = [];
  data.forEach((d)=> {
    let {year, gender, area} = d;
    tableMap.forEach(({key, name})=> {
      let value = d[key] ? d[key].number : 0;
      let per = d[key] ? d[key].per : 0;

      let tip = {year, gender, area, value, per};

      tip[detailName] = {
        content: key,
        name
      };

      result.push(tip);
    });
  });

  return result;
}

export function normalize(data:any):ITableList[] {
  if (data == preData && preResult) {
    console.log('same data');
    return preResult;
  }
  preData = data;

  let result:ITableList[] = [];
  _.each(data, (container)=> {
    _.each(container, (value:any, key)=> {
      let titleHeader = key != '結果' ? key + '::' : '';
      _.each(value, (value:any)=> {
        let title = titleHeader + value.key;
        result.push({
          title,
          tables: _.map(value.value, (value:any):ITableSet=> {
            let table = new Table(value.key);
            _.each(value.value, (value)=> {
              table.addRow(value.key, value.value);
            });
            table.finish();
            let chart = tableToChart(table);
            return {table, chart};
          })
        })
      });
    })
  });
  return preResult = result;
}

export function tableToChart(table):ChartSet {
  return ChartSet.fromTable(table);
}

export interface ITableList {
  title:string,
  tables:ITableSet[]
}

export interface ITableSet {
  table:Table,
  chart:ChartSet
}