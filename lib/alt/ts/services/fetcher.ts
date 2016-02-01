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
  let {table, split, year, filter} = props.params;
  if(split != 'year' && !year && !filter){
    throw 'year required'
  }

  if(!!split && split != 'gender' && split != 'area'){
    let store = split;
    split = table;
    table = store;
  }

  let yearParam = year || '-';
  let genderParam = split == 'gender' ? '1,2' : '0';
  let areaParam = split == 'area' ? '-' : '0';

  if(table == 'area'){
    table = 'total';
    areaParam = '-';
  }

  if(table == 'gender'){
    table = 'total';
    genderParam = '-';
  }

  if(!!props.location.query.area){
    console.log('strict area')
    areaParam = props.location.query.area;
  }

  if(!!props.location.query.gender){
    console.log('strict gender')
    genderParam = props.location.query.gender;
  }


  let uri = ['/api', genderParam, yearParam, areaParam, table].join('/')
  request
    .get(uri)
    .end((err, res)=>
      !!err ? null : callback({table: props.params.table, split: props.params.split, data: res.body})
    )
}
