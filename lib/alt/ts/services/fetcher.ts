const request = require('superagent');

export function fetchPreset(presetName:string, callback:Function) {
  let {uri, state} = detectPreset(presetName);
  request
    .get(uri)
    .end((err, res)=>
      !!err ? null : callback(state(res.body))
    )
}

function detectPreset(presetName:string) {
  if (presetName.match(/([a-z]+)-each-year/)) {
    let table = RegExp.$1;
    return {
      uri: `/api/0/-/0/${table}`,
      state: (data)=>({table: table, split: 'year', data: data})
    };
  }

  return {};
}

export function fetchWithParams(props, callback:Function) {
  let {table, split, year} = props.params;
  if(split != 'year' && !year){
    throw 'year required'
  }

  if(split != 'gender' && split != 'area'){
    let store = split;
    split = table;
    table = store;
  }

  let yearParam = year || '-';
  let genderParam = split == 'gender' ? '1,2' : '0';
  let areaParam = split == 'area' ? '-' : '0';

  let uri = ['/api', genderParam, yearParam, areaParam, table].join('/')
  request
    .get(uri)
    .end((err, res)=>
      !!err ? null : callback({table: props.params.table, split: props.params.split, data: res.body})
    )
}
