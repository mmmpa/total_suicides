import Constants from "../initializers/constants";

function sortData(dataList, split) {
  if (!dataList) {
    return [];
  }

  switch (split) {
    case 'year':
      return _.sortBy(dataList, (el)=> el.year.content);
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

export function normalizePieData(props) {
  switch (props.params.split) {
    case 'area':
      return normalizePieDataNormal(props);
    case 'gender':
      return normalizePieDataNormal(props);
    default:
      return normalizePieDataReverse(props);
  }
}

function splitYear(dataList:any[]){
  let result = {};

  _.map(dataList, (data)=>{
    let year = data.year.content;
    if(!result[year]){
      result[year] = {
        year: data.year,
        dataList: []
      }
    }
    result[year].dataList.push(data);
  });

  return result;
}

function posit(dataList:any[], split:string, keys:string[]){
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

function positReverse(dataList:any[], split:string, keys:string[]){
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

function normalizePieDataReverse(props) {

  let {data, split, table} = props;
  let sorted = sortData(data, table);
  let {keys, texts} = detectChartProps(split);

  if (!keys || !texts) {
    return [];
  }

  let years = splitYear(sorted);


  let elements = Constants[`${table}s`];

  let normalizedList = {};

  _.forEach(years, (value, key)=>{
    let result = positReverse(value.dataList, table, keys);
    result.year = value.year;
    normalizedList[key] = result;
  });

  console.log(split, elements, normalizedList)

  let results = [];

  _.forEach(normalizedList, (normalized, key)=>{
    let result = {
      year: normalized.year,
      dataList: []
    };
    console.log(normalized);

    _.forEach(elements, (el)=>{
      let data = normalized[el.key]

      let total = _.reduce(keys, (a, ek)=> {
        return a + data[ek]
      }, 0);

      result.dataList.push({
        name: `${el.text} (${total})`,
        data: _.sortBy(_.compact(_.zip(keys, texts).map((kt)=> {
          let key = kt[0];
          let title = kt[1];
          let label = `${title} (${data[key]})`
          return {label, value: par(data[key], total)}
        })), (d)=> 0)
      })
    });
    results.push(result);
  });

  console.log(results)
  return _.sortBy(results, (result)=> -result.year.content);
}
function normalizePieDataNormal(props) {
  let {data, split, table} = props;
  let sorted = sortData(data, split);
  let {keys, texts} = detectChartProps(table);

  if (!keys || !texts) {
    return [];
  }

  let years = splitYear(sorted);


  let elements = Constants[`${split}s`];

  let normalizedList = {};

  _.forEach(years, (value, key)=>{
    let result = posit(value.dataList, split, keys);
    result.year = value.year;
    normalizedList[key] = result;
  });

  let results = [];

  _.forEach(normalizedList, (normalized, key)=>{
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
        data: _.sortBy(_.compact(elements.map((el)=> {
          if(data[el.key] == 0){
            return null;
          }
          let label = `${el.text} (${data[el.key]})`
          return {label, value: par(data[el.key], total)}
        })), (d)=> split == 'gender' ?0 : -d.value)
      })
    });
    results.push(result);
  });

  console.log(results)
  return _.sortBy(results, (result)=> -result.year.content);
}

function normalizePieDataYear(props) {
  let sorted = sortData(props);
  let {keys, texts} = detectChartProps(props);

  if (!keys || !texts) {
    return [];
  }

  return sorted.map((one)=> {
    let total = _.reduce(keys, (a, key)=>  a + one[key], 0);

    return {
      name: `${one.year.name} (${total})`,
      data: _.map(_.zip(keys, texts), (kt)=> {
        let key = kt[0];
        let label = `${kt[1]} (${one[key]})`;
        return {label, value: par(one[key], total)}
      })
    }
  });
}

function par(n, total) {
  return Math.round(n / total * 1000) / 10
}