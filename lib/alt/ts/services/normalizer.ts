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


function detectChartProps(props){
  return Constants[`${props.table}Props`] || {};
}

export function normalizePieData(props) {
  let sorted = sortData(props);
  let {keys, texts} = detectChartProps(props);

  if(!keys || !texts){
    return [];
  }

  return sorted.map((one)=> {
    let total = _.reduce(keys, (a, key)=>  a + one[key], 0);

    return {
      name: `${one.year.name} (${total})`,
      data: _.map(_.zip(keys, texts), (kt)=> {
        let key = kt[0];
        let label = `${kt[1]} (${one[key]})`;
        return {label, value: Math.round(one[key] / total * 1000) / 10}
      })
    }
  });

}
