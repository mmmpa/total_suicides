import Constants from "../initializers/constants";
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
  let {table, split, sort, rotation} = props.params;
  let {area, gender, year} = props.location.query;

  let yearParam = '-';
  let genderParam = split == 'gender' ? '1,2' : '0';
  let areaParam = split == 'area' ? '-' : '0';

  switch (sort) {
    case 'gender':
      genderParam = '0,1,2';
    case 'area':
      areaParam = Constants.areas.map((a)=> a.key).join(',');
    case 'year':
      yearParam = '-';
    default:
      yearParam = '-';
  }

  if (!!area) {
    areaParam = area;
  }

  if (!!gender) {
    genderParam = gender;
  }

  if (!!year) {
    yearParam = year;
  }

  let uri = ['/api', genderParam, yearParam, areaParam, table].join('/')
  request
    .get(uri)
    .end((err, res)=> {
      if (!!err) {
        //
      } else {
        let data = res.body;
        console.log(`fetched from ${uri}`, {table, split, rotation, data});
        callback(data)
      }
    });
}
