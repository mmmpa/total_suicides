import Constants from "../initializers/constants";
import * as _ from 'lodash';
import Table from "../models/table";

interface NormalizingParams {
  title:string,
  column:string,
  row:string,
  table:string,
  data:any[]
}

//
// 生のデータをtitle, row, columnの指定によって階層化する。
// メタデータyear, area, gender以外の生テーブル名時に、
// 動作がかわる。
// 生テーブルは同時に2つ指定できない（お互いにつながりをもたないため）
//

function group(params:NormalizingParams) {
  let {title, column, row, table, data} = params;

  let titleMap = detectKeyMap(title);
  let columnMap = detectKeyMap(column);
  let rowMap = detectKeyMap(row);
  let tableMap = detectKeyMap(table);

  // 率の計算と、値をオブジェクト化
  _.each(data, (raw)=> {
    let total = _.reduce(tableMap, (a, {key})=> {
      return a + raw[key];
    }, 0);
    _.each(tableMap, ({key})=> {
      raw[key] = {
        src: raw,
        number: raw[key],
        par: par(raw[key], total)
      }
    })
  });

  // タイトルごとにまとめる
  let titleGrouped = {};
  _.each(data, (d)=> {
    _.each(titleMap, ({key, name})=> {
      let content = d.number;
      if (Constants.isIncludedTable(title)) {
        content = d[key]
      } else {
        if (d[title].content != key) {
          return;
        }
      }
      let store = findOrCreate(titleGrouped, key, []);
      let {year, gender, area} = d;
      store.push({year, gender, area, data: d, content});
    });
  });

  // タイトルごとにまとめられたデータを、rowごちのまとめる。
  let rowGroped = {};
  _.each(titleGrouped, (dataList, key)=> {
    let store = findOrCreate(rowGroped, key, {});
    _.each(dataList, (d)=> {
      if (Constants.isIncludedTable(row)) {
        _.each(rowMap, ({key, name})=> {
          let s = findOrCreate(store, key, []);
          let {year, gender, area, data} = d;
          let content = data[key];
          s.push({year, gender, area, data, content});
        });
      } else {
        let s = findOrCreate(store, d[row].content, []);
        s.push(d);
      }
    });
  });

  console.log({rowGroped})
  return rowGroped;
}

//
// 生のデータをTable[]形式に変換
//

export function normalize(params:NormalizingParams) {
  let {title, column, row, table, data} = params;

  if(!data || !data.length){
    return [];
  }

  let grouped = group(params);

  let titleMap = detectKeyMap(title);
  let columnMap = detectKeyMap(column);
  let rowMap = detectKeyMap(row);
  let tableMap = detectKeyMap(table);

  let chartDataListStore = {};

  _.each(titleMap, ({key, name})=> {
    let store = findOrCreate(chartDataListStore, key, {table: new Table(name)});
    let titleData = grouped[key];
    //console.log({titleData})
    if (!titleData) {
      return;
    }

    let existColumn = {};
    _.each(rowMap, ({key, name})=> {
      let raw = titleData[key];
      if (!raw) {
        return;
      }
      let groupedRaw;
      if (!Constants.isIncludedTable(column)) {
        groupedRaw = _.groupBy(raw, (r)=> r[column].content)
      }

      let rowData = {};
      _.each(columnMap, ({key, name})=> {
        let content;
        if (Constants.isIncludedTable(column)) {
          existColumn[key] = true;
          content = raw[0].data[key]
        } else {
          if (!groupedRaw[key]) {
            return;
          }
          existColumn[key] = true;
          content = groupedRaw[key][0].content;
        }
        rowData[key] = content;
      });
      store.table.addRow(name, rowData);
    });
    let columnNames = {}
    _.each(columnMap, ({key, name})=> {
      if(existColumn[key]){
        columnNames[key] = {key, name};
      }
    });
    store.table.column = columnNames;
  });
  //chartDataListStore = _.map(chartDataListStore, (v, k)=> v);
  //_.map(chartDataListStore, (c)=> console.log(c));

  return _.map(chartDataListStore, (v, k)=> v.table);
}

//
// dataのkeyとname対応を取得する
//
function detectKeyMap(title) {
  return detectTableKeyMap(title) || detectSplitterMap(title)
}

function detectTableKeyMap(table:string) {
  return Constants[`${table}Props`];
}

function detectSplitterMap(split:string) {
  return Constants.splitters[split];
}

//
// オブジェクト内にkeyプロパティが存在する場合はそれを、
// 存在しない場合はinitialを挿入してそれを返す。
//
function findOrCreate(hash:any, key:string, initial:any):any {
  if (!hash[key]) {
    hash[key.toString()] = initial;
  }
  return hash[key];
}

//
// 率の計算
//
function par(n, total) {
  return Math.round(n / total * 1000) / 10
}
