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

export function normalize(params:NormalizingParams) {
  let {title, column, row, table, data} = params;

  let titleMap = detectKeyMap(title);
  let columnMap = detectKeyMap(column);
  let rowMap = detectKeyMap(row);

  console.log({data})

  let titleGrouped = {};
  _.each(data, (d)=> {
    _.each(titleMap, ({key, name})=> {
      let content = d.number;
      if(Constants.isIncludedTable(title)){
        content = d[key]
      }else{
        if(d[title].content != key){
          return;
        }
      }
      let store = findOrCreate(titleGrouped, key, [])
      let {year, gender, area} = d;
      store.push({year, gender, area, data: d, content});
    });
  });

  let rowGroped = {};
  _.each(titleGrouped, (dataList, key)=> {
    let store = findOrCreate(rowGroped, key, {})
    _.each(dataList, (d)=> {
      if(Constants.isIncludedTable(row)){
        _.each(rowMap, ({key, name})=>{
          let s = findOrCreate(store, key, [])
          let {year, gender, area, data} = d;
          let content = data[key];
          s.push({year, gender, area, data, content});
        });
      }else{
        let s = findOrCreate(store, d[row].content, [])
        s.push(d);
      }
    });
  });

  let column
  console.log({titleGrouped, rowGroped});

  let grouped = rowGroped;

  let chartDataListStore = {};

  let columnNames = _.map(columnMap, ({name})=> name);

  _.each(titleMap, ({key, name})=> {
    let store = findOrCreate(chartDataListStore, key, {table: new Table(name, columnNames)});
    let titleData = grouped[key];
    //console.log({titleData})
    if(!titleData){
      return;
    }
    _.each(rowMap, ({key, name})=> {
      let raw = titleData[key];
      if (!raw) {
        return;
      }
      let groupedRaw;
      if(!Constants.isIncludedTable(column)){
        groupedRaw = _.groupBy(raw, (r)=> r[column].content)
      }

      let rowData = []
      _.each(columnMap, ({key, name})=> {
        let content;
        if(Constants.isIncludedTable(column)){
          content = raw[0].data[key]
        }else{
          if(!groupedRaw[key]){
            return;
          }
          content = groupedRaw[key][0].content;
        }
        rowData.push(content)
      });
      store.table.addRow(name, rowData);
    });

  });
  chartDataListStore = _.map(chartDataListStore, (v, k)=> v);
  _.map(chartDataListStore, (c)=> console.log(c));
}
function detectKeyMap(title) {
  return detectTableKeyMap(title) || detectSplitterMap(title)
}

export function normalizeStackBarData(props) {
  let {data, split, table, rotation, sort} = props;
  let arranged = arrangeData(data, table);

  if (rotation == 'true') {
    return normalizeRotatedStackBarData(arranged, table, split, sort);
  } else {
    return normalizeRegularStackBarData(arranged, table, split, sort);
  }
}

function detectTableKeyMap(table:string) {
  return Constants[`${table}Props`];
}

function detectSplitterMap(split:string) {
  return Constants.splitters[split];
}

function findOrCreate(hash:any, key:string, initial:any):any {
  if (!hash[key]) {
    hash[key.toString()] = initial;
  }
  return hash[key];
}

function arrangeData(data:any[], table:string):any {
  if (!_.isArray(data)) {
    return null;
  }

  let keyMaps = detectTableKeyMap(table);
  let {splitters} = Constants;

  let arranged = {};

  data.map((part)=> {
    part.total = part.gender;

    // 各splitのkeyでアクセスできるようにする
    _.each(splitters, (keys, name:string)=> {
      if (!part[name]) {
        return;
      }
      //項目のstore
      let splitStore = findOrCreate(arranged, name, {});
      let dataArray = findOrCreate(splitStore, part[name].content, []);

      dataArray.push(part);
    });

    // tableの各要素からsplitにアクセスできるようにする
    let total = _.reduce(keyMaps, (a, keyMap)=> a + part[keyMap.key], 0);
    _.each(keyMaps, (keyMap)=> {
      part[keyMap.key] = {
        name: keyMap.name,
        content: part[keyMap.key],
        par: par(part[keyMap.key], total),
        src: part,
        key: keyMap.key
      };
    });

    // 各項目の属性ごとに値を割り当て
    _.each(keyMaps, (keyMap)=> {
      let partStore = findOrCreate(arranged, keyMap.key, {});
      _.each(splitters, (keys, name:string)=> {
        partStore[name] = arranged[name]
      });
    });
  });

  return arranged;
}

function par(n, total) {
  return Math.round(n / total * 1000) / 10
}

function normalizeRotatedStackBarData(arranged, table, split, sort) {
  console.log('rotated');
  console.log(arranged);

  let keyMaps = detectTableKeyMap(table);
  let splitterMaps = detectSplitterMap(split);
  let sortMaps = detectSplitterMap(sort);

  let chartSeries = keyMaps.map((keyMap)=> ({field: keyMap.key, name: keyMap.name}));

  let chartData = {
    chartSeries,
    dataList: {},
    max: 0
  };

  if (sort == 'year') {
  } else {
    _.each(arranged.year, (yearDataList, year:string)=> {
      let eachYearStore = findOrCreate(chartData.dataList, year, {title: yearDataList[0].year.name});
      let remap = remapArray(yearDataList, split, sort);

      _.each(sortMaps, (sortMap)=> {
        let sortElement = remap[sortMap.key];
        if (!sortElement) {
          return;
        }
        _.each(sortElement, (splitValue, splitKey:string)=> {
          _.each(keyMaps, (keyMap)=> {
            let dataList = findOrCreate(eachYearStore, splitKey, {});
            let data = findOrCreate(dataList, sortMap.key, {sort: sortMap});
            data[keyMap.key] = splitValue[keyMap.key].content;
            data[keyMap.key + 'par'] = splitValue[keyMap.key].par;
          });
        });
      });

      eachYearStore.chartList = convert(eachYearStore, splitterMaps, sortMaps);
    });

    // max処理
    chartData.max = getMax(chartData.dataList, splitterMaps, keyMaps);
  }

  console.log('normalized', chartData);
  return chartData;
}

function remapArray(dataList, series:string, sort:string) {
  let result = {};
  _.each(dataList, (d)=> {
    let store = findOrCreate(result, d[sort].content, {})
    store[d[series].content] = d;
  });

  return result;
}

function convert(eachYearStore, themeMap, sortMap) {
  let result = [];

  _.each(themeMap, (theme)=> {
    let store = eachYearStore[theme.key];
    let array = [];
    _.each(sortMap, (sort)=> {
      array.push(store[sort.key]);
    });

    result.push({
      key: theme.key,
      name: theme.name,
      data: _.compact(array)
    });
  });

  return result;
}

function getMax(dataList, themeMap, seriesMap) {
  let max = 0;
  _.each(dataList, (dataSet)=> {
    _.each(themeMap, (theme)=> {
      let tableData = dataSet[theme.key];
      _.each(tableData, (data)=> {
        let total = 0;
        _.each(seriesMap, (series)=> {
          total += data[series.key] || 0;
        });
        total > max && (max = total);
      })
    });
  });
  return max;
}

function normalizeRegularStackBarData(arranged, table, split, sort) {
  if (!_.isObject(arranged)) {
    return [];
  }

  let keyMaps = detectTableKeyMap(table);
  let splitterMaps = detectSplitterMap(split);
  let sortMaps = detectSplitterMap(sort);

  let chartSeries = _.compact(splitterMaps.map((keyMap)=> {
    if (arranged[split][keyMap.key]) {
      return {field: keyMap.key, name: keyMap.name}
    }
  }));

  let chartData = {
    chartSeries,
    dataList: {},
    max: 0
  };

  if (sort == 'year') {
    chartData.dataList = {
      _: {
        title: '年ごとの遷移',
        chartList: {}
      }
    };
    let store = chartData.dataList._.chartList;
    _.each(arranged[split], (splitData, key)=> {
      _.each(splitData, (spData)=> {
        _.each(keyMaps, (keyMap)=> {
          let columnStore = findOrCreate(store, keyMap.key, {name: keyMap.name, data: {}});
          let yearStore = findOrCreate(columnStore.data, spData.year.content, {sort: spData.year});
          yearStore[key] = spData[keyMap.key].content
          yearStore[key + 'par'] = spData[keyMap.key].par
        })
      })
    });
    _.each(keyMaps, (keyMap)=> {
      let target = store[keyMap.key];
      target.data = _.map(target.data, (value)=> {
        let maxStore = 0;
        _.each(splitterMaps, (sp)=> {
          maxStore += value[sp.key] || 0;
        });
        maxStore > chartData.max && (chartData.max = maxStore);
        return value;
      });
    })
  } else {
    _.each(arranged.year, (yearDataList, year:string)=> {
      let eachYearStore = findOrCreate(chartData.dataList, year, {title: yearDataList[0].year.name});
      let remap = remapArray(yearDataList, split, sort);

      _.each(sortMaps, (sortMap)=> {
        let sortElement = remap[sortMap.key];
        if (!sortElement) {
          return;
        }
        _.each(sortElement, (splitValue, splitKey)=> {
          _.each(keyMaps, (keyMap)=> {
            var dataList = findOrCreate(eachYearStore, keyMap.key, {});
            var data = findOrCreate(dataList, sortMap.key, {sort: sortMap});
            data[splitKey] = splitValue[keyMap.key].content;
            data[splitKey + 'par'] = splitValue[keyMap.key].par;
          });
        });
      });


      eachYearStore.chartList = convert(eachYearStore, keyMaps, sortMaps);
    });

    chartData.max = getMax(chartData.dataList, keyMaps, splitterMaps);
  }

  console.log('normalized', chartData);
  return chartData;
}
