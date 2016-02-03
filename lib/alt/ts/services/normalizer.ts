import Constants from "../initializers/constants";
import * as _ from 'lodash';

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
    _.each(keyMaps, (keyMap)=> {
      part[keyMap.key] = {
        name: keyMap.name,
        content: part[keyMap.key],
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

  console.log('arranged', arranged);
  return arranged;
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
      let eachYearStore = findOrCreate(chartData.dataList, year, {});
      eachYearStore.title = yearDataList[0].year.name;
      let remap = {};
      _.each(yearDataList, (d)=> {
        let store = findOrCreate(remap, d[sort].content, {})
        store[d[split].content] = d;
      });

      console.log('1', chartData)

      _.each(sortMaps, (sortMap)=> {
        let sortElement = remap[sortMap.key];
        if (!sortElement) {
          return;
        }
        _.each(sortElement, (splitValue, splitKey:string)=> {
          // splitごとのchart全体のデータの入れ物
          let dataList = findOrCreate(eachYearStore, splitKey, {});
          //sortの順番にしたがって、チャートシリーズが全て入ったobjectを挿入する
          _.each(keyMaps, (keyMap)=> {
            let data = findOrCreate(dataList, sortMap.key, {sort: sortMap});
            data[keyMap.key] = splitValue[keyMap.key].content;
          });
        });
      });
      console.log('eachYearStore', eachYearStore)


      _.each(splitterMaps, (spMap)=> {
        let store = eachYearStore[spMap.key];
        var chartList = findOrCreate(eachYearStore, 'chartList', []);
        let array = [];
        _.each(sortMaps, (sortMap)=> {
          array.push(store[sortMap.key]);
        });
        chartList.push({
          key: spMap.key,
          name: spMap.name,
          data: array
        });
        //delete eachYearStore[keyMap.key];
      });
    });

    // max処理
    _.each(chartData.dataList, (dataSet)=> {
      _.each(keyMaps, (keyMap)=> {
        let tableData = dataSet[keyMap.key];
        _.each(tableData, (data)=> {
          let maxStore = 0;
          _.each(splitterMaps, (sp)=> {
            maxStore += data[sp.key] || 0;
          });
          maxStore > chartData.max && (chartData.max = maxStore);
        })
      });
    });

  }

  console.log('normalized', chartData);
  return chartData;
}

function normalizeRegularStackBarData(arranged, table, split, sort) {
  if (!_.isObject(arranged)) {
    return [];
  }

  let keyMaps = detectTableKeyMap(table);
  let splitterMaps = detectSplitterMap(split);
  let sortMaps = detectSplitterMap(sort);

  let chartSeries = splitterMaps.map((keyMap)=> ({field: keyMap.key, name: keyMap.name}));

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
      let eachYearStore = findOrCreate(chartData.dataList, year, {});
      eachYearStore.title = yearDataList[0].year.name;
      let remap = {};
      _.each(yearDataList, (d)=> {
        let store = findOrCreate(remap, d[sort].content, {})
        store[d[split].content] = d;
      });

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
          });
        });
      });


      _.each(keyMaps, (keyMap)=> {
        let store = eachYearStore[keyMap.key];
        var chartList = findOrCreate(eachYearStore, 'chartList', []);
        let array = [];
        _.each(sortMaps, (sortMap)=> {
          array.push(store[sortMap.key]);
        });
        chartList.push({
          key: keyMap.key,
          name: keyMap.name,
          data: array
        });
        //delete eachYearStore[keyMap.key];
      });
    });

    _.each(chartData.dataList, (dataSet)=> {
      _.each(keyMaps, (keyMap)=> {
        let tableData = dataSet[keyMap.key];
        _.each(tableData, (data)=> {
          let maxStore = 0;
          _.each(splitterMaps, (sp)=> {
            maxStore += data[sp.key] || 0;
          });
          maxStore > chartData.max && (chartData.max = maxStore);
        })
      });
    });
  }

  console.log('normalized', chartData);
  return chartData;
}
