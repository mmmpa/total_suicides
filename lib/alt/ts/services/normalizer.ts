import Constants from "../initializers/constants";
import * as _ from 'lodash';
import Table from "../models/table";

export function normalize(data) {
  let result = [];
  _.each(data, (container)=> {
    _.each(container, (value, key)=> {
      let titleHeader = key != '結果' ? key + '::' : '';
      _.each(value, (value, key)=> {
        let title = titleHeader + key;
        result.push({
          title,
          tables: _.map(value, (value, key)=> {
            let table = new Table(key);
            _.each(value, (value, key)=> {
              table.addRow(key, value);
            });
            table.finish();
            return table;
          })
        })
      });
    })
  });
  return _.sortBy(result, (r)=> r.title).reverse();
}