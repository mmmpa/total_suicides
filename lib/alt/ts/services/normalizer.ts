import Constants from "../initializers/constants";

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

  let max = 0;

  let result = {};
  _.forEach(normalizedList, (normalized, key)=> {
    let store = {};
    var myNum = 0;
    _.forEach(_.zip(keys, texts), (kt)=> {
      let key = kt[0];
      let title = kt[1];

      elements.map((e)=> {
        if (!store[e.key]) {
          store[e.key] = {year: normalized.year.content}
        }
        let num = normalized[key][e.key];
        myNum += num;
        store[e.key][key] = num;
      });
    });
    elements.map((e)=> {
      if (!result[e.key]) {
        result[e.key] = [];
      }
      result[e.key].push(store[e.key]);
    });
    myNum > max && (max = myNum);
    console.log('myNum', myNum);
  });

  console.log('now', result)

  let results = []
  _.forEach(elements, (e)=> {

    results.push({
      chartSeries,
      key: e.key,
      title: e.text,
      dataList: result[e.key]
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