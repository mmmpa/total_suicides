import Constants from "../initializers/constants";

function sortData(props) {
  let {split, data} = props;

  if (!data) {
    return [];
  }

  switch (split) {
    case 'year':
      return _.sortBy(data, (el)=> el.year.content);
    case 'gender':
      return _.sortBy(data, (el)=> el.gender.content);
    case 'area':
      return _.sortBy(data, (el)=> el.area.content);
    default:
      return props.data;
  }
}


function detectChartProps(props) {
  return Constants[`${props.table}Props`] || {};
}

export function normalizePieData(props) {
  switch (props.params.split) {
    case 'area':
      return normalizePieData(props);
    case 'gender':
      return normalizePieData(props);
    default:
      return normalizePieDataYear(props);
  }
}

function normalizePieData(props) {
  let sorted = sortData(props);
  let {keys, texts} = detectChartProps(props);

  if (!keys || !texts) {
    return [];
  }

  let elements = Constants[`${props.split}s`];

  let normalized = {}

  sorted.map((data)=> {
    keys.map((key)=> {
      if (!normalized[key]) {
        normalized[key] = {}
      }
      let sortKey = data[props.split].content;
      normalized[key][sortKey] = data[key];
    });
  });

  console.log(normalized)

  return _.map(_.zip(keys, texts), (kt)=> {
    let key = kt[0];
    let title = kt[1];

    let data = normalized[key];
    let elementKeys = elements.map((e)=> e.key);

console.log(key)
    let total = _.reduce(elementKeys, (a, ek)=> {
      return a + data[ek]
    }, 0);

    return {
      name: `${title} (${total})`,
      data: _.sortBy(_.compact(elements.map((el)=> {
        if(data[el.key] == 0){
          return null;
        }
        let label = `${el.text} (${data[el.key]})`
        return {label, value: par(data[el.key], total)}
      })), (d)=> props.split == 'gender' ?0 : -d.value)
    }
  })
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