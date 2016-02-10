import Constants from "../initializers/constants";
import * as _ from 'lodash';
import Table from "../models/table";
import ChartSet from "../models/chart-set";

let preData = null;
let preResult = null;

export function normalize(data) {
  if(data == preData && preResult){
    console.log('same data');
    return preResult;
  }
  preData = data;

  let result = [];
  _.each(data, (container)=> {
    _.each(container, (value, key)=> {
      let titleHeader = key != '結果' ? key + '::' : '';
      _.each(value, (value)=> {
        let title = titleHeader + value.key;
        result.push({
          title,
          tables: _.map(value.value, (value)=> {
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

export function tableToChart(table):ChartSet{
  return ChartSet.fromTable(table);
}