import Constants from "../initializers/constants";
import * as _ from 'lodash';

export function normalizePieData(props) {
  let {data, split, table} = props;

  switch (split) {
    case undefined:
      return normalizePieDataYear(props);
    case 'area':
      return normalizePieDataNormal(data, split, table);
    case 'gender':
      return normalizePieDataNormal(data, split, table);
    default:
      return normalizePieDataReverse(data, table, split);
  }
}

export function normalizeBarData(props) {
  let {data, split, table} = props;

  switch (split) {
    case undefined:
      return normalizePieDataYear(props);
    case 'area':
      return normalizeBarDataNormal(data, split, table);
    case 'gender':
      return normalizeBarDataNormal(data, split, table);
    default:
      return normalizeBarDataReverse(data, table, split);
  }
}

export function normalizeStackBarData(props) {
  let {data, split, table, rotation, sort} = props;
  let arranged = arrangeData(data, table);
  console.log(arranged)
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
  console.log(arranged)
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
    eachYear: {},
    eachSplit: {},
    max: 0
  };

  if (sort == 'year') {

  } else {
    _.each(arranged.year, (yearDataList, year:string)=> {
      let eachYearStore = findOrCreate(chartData.eachYear, year, {});
      let remap = {};
      _.each(yearDataList, (d)=>{
        let store = findOrCreate(remap, d[sort].content, {})
        store[d[split].content] = d;
      });

      _.each(sortMaps, (sortMap)=> {
        let sortElement = remap[sortMap.key];
        if(!sortElement){
          return;
        }
        _.each(sortElement, (splitValue, splitKey)=>{
          _.each(keyMaps, (keyMap)=> {
            var dataList = findOrCreate(eachYearStore, keyMap.key, {});
            var data = findOrCreate(dataList, sortMap.key, {sort: sortMap});
            data[splitKey] = splitValue[keyMap.key].content;
          });
        });
      });
    });
    console.log('normalized', chartData.eachYear);

    /*
     _.each(splitterMaps, (splitterMap)=> {
     let {name, key} = splitterMap;
     _.each(arranged[split], (yearResult, year:string)=>{
     let rawList = yearResult[key];
     let eachYearStore = findOrCreate(chartData.eachYear, year, yearResult);
     _.each(rawList, (raw)=> {


     _.each(keyMaps, (keyMap)=> {
     let eachYearData = findOrCreate(eachYearStore, keyMap.key, {title: raw[keyMap.key].name, data: {}});
     let eachYearDataDetail = findOrCreate(eachYearData.data, raw[sort].content, {sort: raw[sort]});
     eachYearDataDetail[raw[split].content] = raw[keyMap.key].content;
     });
     })
     });
     });      */

  }

/*
  _.each(chartData.eachYear, (yearData)=> {
    _.each(yearData, (chart)=> {
      _.each(chart.data, (child)=> {
        let maxStore = 0;
        _.each(splitterMaps, (sp)=> {
          maxStore += child[sp.key];
        });
        maxStore > chartData.max && (chartData.max = maxStore);
      })
    });
  }); */
  console.log('normalized', chartData);
  return chartData;
}

function sortData(dataList, split) {
  if (!dataList) {
    return [];
  }

  switch (split) {
    case 'year':
      return _.sortBy(dataList, (el)=> -el.year.content);
    case 'gender':
      return _.sortBy(dataList, (el)=> el.gender.content);
    case 'area':
      return _.sortBy(dataList, (el)=> el.area.content);
    default:
      return dataList;
  }
}


function detectChartProps(table) {
  return Constants[`${table}Props`] || {};
}


function splitYear(dataList:any[]) {
  let result = {};

  _.map(dataList, (data)=> {
    let year = data.year.content;
    if (!result[year]) {
      result[year] = {
        year: data.year,
        dataList: []
      }
    }
    result[year].dataList.push(data);
  });

  return result;
}

function posit(dataList:any[], split:string, keys:string[]) {
  let result = {};

  dataList.map((data)=> {
    keys.map((key)=> {
      if (!result[key]) {
        result[key] = {}
      }
      let sortKey = data[split].content;
      result[key][sortKey] = data[key];
    });
  });

  return result;
}

function positReverse(dataList:any[], split:string, keys:string[]) {
  let result = {};

  dataList.map((data)=> {
    keys.map((key)=> {
      let sortKey = data[split].content;
      if (!result[sortKey]) {
        result[sortKey] = {}
      }
      result[sortKey][key] = data[key];
    });
  });
  return result;
}

function normalizePieDataReverse(data:any[], split:string, table:string) {
  console.log('reverse');
  let sorted = sortData(data, split);
  let {keys, texts} = detectChartProps(table);

  if (!keys || !texts) {
    return [];
  }

  let years = splitYear(sorted);
  let elements = Constants[`${split}s`];

  let normalizedList = {};

  _.forEach(years, (value, key)=> {
    let result = positReverse(value.dataList, split, keys);
    result.year = value.year;
    normalizedList[key] = result;
  });

  let results = [];

  _.forEach(normalizedList, (normalized, key)=> {
    let result = {
      year: normalized.year,
      dataList: []
    };

    _.forEach(elements, (el)=> {
      let data = normalized[el.key]

      let total = _.reduce(keys, (a, ek)=> {
        return a + data[ek]
      }, 0);

      result.dataList.push({
        name: `${el.text} (${total})`,
        data: _.sortBy(_.compact(_.zip(keys, texts).map((kt)=> {
          let key = kt[0];
          let title = kt[1];
          let label = `${title} (${data[key]})`;
          return {label, value: par(data[key], total)}
        })), (d)=> 0)
      })
    });
    results.push(result);
  });

  return _.sortBy(results, (result)=> -result.year.content);
}

function normalizePieDataNormal(data:any[], split:string, table:string) {
  let sorted = sortData(data, split);
  let {keys, texts} = detectChartProps(table);

  if (!keys || !texts) {
    return [];
  }

  let years = splitYear(sorted);
  let elements = Constants[`${split}s`];

  let normalizedList = {};

  _.forEach(years, (value, key)=> {
    let result = posit(value.dataList, split, keys);
    result.year = value.year;
    normalizedList[key] = result;
  });

  let results = [];

  _.forEach(normalizedList, (normalized, key)=> {
    let result = {
      year: normalized.year,
      dataList: []
    };
    _.forEach(_.zip(keys, texts), (kt)=> {
      let key = kt[0];
      let title = kt[1];

      let data = normalized[key];
      let elementKeys = elements.map((e)=> e.key);

      let total = _.reduce(elementKeys, (a, ek)=> {
        return a + data[ek]
      }, 0);

      result.dataList.push({
        name: `${title} (${total})`,
        data: _.compact(elements.map((el)=> {
          if (data[el.key] == 0) {
            return null;
          }
          let label = `${el.text} (${data[el.key]})`
          return {label, value: par(data[el.key], total)}
        }))
      })
    });
    results.push(result);
  });

  return _.sortBy(results, (result)=> -result.year.content);
}


function normalizeBarDataNormal(data:any[], split:string, table:string) {
  console.log('regular')
  let sorted = sortData(data, split);
  let {keys, texts} = detectChartProps(table);

  if (!keys || !texts) {
    return [];
  }

  let years = splitYear(sorted);
  let elements = Constants[`${split}s`];

  console.log('years', years)

  let normalizedList = {};

  _.forEach(years, (value, key)=> {
    let result = posit(value.dataList, split, keys);
    result.year = value.year;
    normalizedList[key] = result;
  });

  let chartSeries = elements.map((e)=> ({field: e.key, name: e.text}));

  let max = 0;

  let result = {};
  _.forEach(normalizedList, (normalized, key)=> {
    _.forEach(_.zip(keys, texts), (kt)=> {

      let key = kt[0];
      let title = kt[1];

      let data = normalized[key];

      let now = {
        year: normalized.year.content
      };
      let myNum = 0;
      elements.map((e)=> {
        let num = data[e.key];
        if (num != 0 && !num) {
          _.remove(chartSeries, (c)=> c.field == e.key)
          return;
        }
        myNum += num;

        now[e.key] = num
      });
      myNum > max && (max = myNum);

      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(now);
    });
  });
  console.log('now', result)

  let results = []
  _.forEach(_.zip(keys, texts), (kt)=> {

    let key = kt[0];
    let title = kt[1];

    results.push({
      chartSeries,
      key: key,
      title: title,
      dataList: result[key]
    });
  });

  return {max, results};
}

function normalizeBarDataReverse(data:any[], split:string, table:string) {
  console.log('rotated');
  let sorted = sortData(data, split);
  let {keys, texts} = detectChartProps(table);

  if (!keys || !texts) {
    return [];
  }

  let years = splitYear(sorted);
  let elements = Constants[`${split}s`];


  let normalizedList = {};

  _.forEach(years, (value, key)=> {
    let result = posit(value.dataList, split, keys);
    result.year = value.year;
    normalizedList[key] = result;
  });

  let chartSeries = _.zip(keys, texts).map((kt)=> ({field: kt[0], name: kt[1]}));
  console.log('chartSeries', chartSeries)

  let result = {};
  _.forEach(normalizedList, (normalized, key)=> {
    let store = {};
    _.forEach(_.zip(keys, texts), (kt)=> {
      let key = kt[0];
      let title = kt[1];

      elements.map((e)=> {
        if (!store[e.key]) {
          store[e.key] = {year: normalized.year.content}
        }
        let num = normalized[key][e.key];
        store[e.key][key] = num;
      });
    });
    elements.map((e)=> {
      if (!result[e.key]) {
        result[e.key] = [];
      }
      result[e.key].push(store[e.key]);
    });
  });

  console.log('now', result)
  let max = 0;

  let results = []
  _.forEach(elements, (e)=> {
    if (!result[e.key][0][keys[0]]) {
      return;
    }
    results.push({
      chartSeries,
      key: e.key,
      title: e.text,
      dataList: result[e.key]
    });

    result[e.key].map((d)=> {
      var myNum = 0;
      keys.map((k)=> {
        myNum += d[k];
      });
      myNum > max && (max = myNum);
    });
  });
  console.log('results', results)

  return {max, results};
}

function detectYearTable(table) {
  return table == 'gender' || table == 'area' ? 'total' : table;
}

function normalizePieDataYear(props) {
  let {data, table} = props;
  let sorted = sortData(data, 'year');
  let {keys, texts} = detectChartProps(detectYearTable(table));

  console.log(keys, texts, sorted)

  if (!keys || !texts) {
    return [];
  }

  return sorted.map((one)=> {
    let total = _.reduce(keys, (a, key)=>  a + one[key], 0);

    return {
      year: one.year,
      dataList: [{
        name: `(${total})`,
        data: _.map(_.zip(keys, texts), (kt)=> {
          let key = kt[0];
          let label = `${kt[1]} (${one[key]})`;
          return {label, value: par(one[key], total)}
        })
      }]
    }
  });
}

function par(n, total) {
  return Math.round(n / total * 1000) / 10
}