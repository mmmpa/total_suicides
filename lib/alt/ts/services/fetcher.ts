import Constants from "../initializers/constants";
const request = require('superagent');

class Fetcher {
  store = {};
  pre:string;

  constructor() {

  }

  fetch(props, callback:Function) {
    let params = this.detectApiParam(props);
    let {base, table, x, y} = props.params;
    let uri = ['/api/table', base, table, x, y].join('/');

    if (this.pre == uri || this.store[uri]) {
      console.log(this.pre == uri ? 'double request ${uri}' : `retrieve from store ${uri}`);
      let data = this.store[uri] || [];
      callback({base, table, x, y, data})
      return;
    }
    this.pre = uri;

    request
      .get(uri)
      .end((err, res)=> {
        if (!!err) {
          //
        } else {
          console.log(`fetched from ${uri}`, res.body);
          let data = res.body;
          this.store[uri] = data;
          callback({base, table, x, y, data})
        }
      });
  }

  detectApiParam(props) {
    let {title, column, row} = props.params;
    let {yearFilter, areaFilter, genderFilter, itemFilter} = props.location.query;

    let requires = [title, column, row];
    let table = this.pickTable(requires);

    let year =  yearFilter || Constants.years[0].key;
    if (_.includes(requires, 'year')) {
      year = '-';
    }

    let area = '0';
    if (_.includes(requires, 'area')) {
      area = areaFilter || '-';
    }

    let gender = '0';
    if (_.includes(requires, 'gender')) {
      gender = genderFilter || '1,2';
    }

    return {gender, area, year, table};
  }

  pickTable(names:string[]) {
    let table;
    _.each(names, (name:string)=> {
      if (_.includes(Constants.tableKeys, name)) {
        if (table && name == 'total') {
          //throw 'Double table error';
        }else{
          table = name;
        }
      }
    });
    return table || 'total';
  }
}

const f = new Fetcher();

export function fetch(params, callback:Function) {
  f.fetch(params, callback)
}