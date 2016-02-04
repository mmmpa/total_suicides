import Constants from "../initializers/constants";
const request = require('superagent');

class Fetcher {
  store = {};
  pre:string;

  constructor() {

  }

  fetch(params, callback:Function) {
    let {gender, area, year, table} = params;
    let uri = ['/api', gender, year, area, table].join('/');

    if (this.pre == uri || this.store[uri]) {
      console.log(this.pre == uri ? 'double request ${uri}' : `retrieve from store ${uri}`);
      let data = this.store[uri] || [];
      callback({gender, area, year, table, data})
      return;
    }
    this.pre = uri;

    request
      .get(uri)
      .end((err, res)=> {
        if (!!err) {
          //
        } else {
          console.log(`fetched from ${uri}`);
          let data = res.body;
          this.store[uri] = data;
          callback({gender, area, year, table, data})
        }
      });
  }
}

const f = new Fetcher();

export function fetch(params, callback:Function) {
  f.fetch(params, callback)
}