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
  if(presetName.match(/([a-z]+)-each-year/)){
    let table = RegExp.$1;
    return {
      uri: `/api/0/-/0/${table}`,
      state: (data)=>({table: table, split: 'year', data: data})
    };
  }

  return {};
}

export function fetchWithParams(props, callback:Function) {
  console.log('fetchWithParams')
}
