import * as _ from 'lodash'

interface IRow {
  key:string,
  value:{
    number:number,
    par:number
  }
}

export default class Table {
  row:IRow[][] = [];
  rowTitle:string[] = [];
  max:number = 0;

  constructor(public title:string, public column:string[] = []) {

  }

  addColumn(name:string) {
    this.column.push(name);
  }

  addRow(title:string, row:IRow[]) {
    this.rowTitle.push(title);
    this.row.push(row);
  }

  finish() {
    this.column = this.getColumn();
    this.max = this.getMax();
  }

  getColumn() {
    return _.map(this.row[0], (value)=> value.key);
  }

  getMax():number {
    let m = 0;
    _.each(this.row, (row, i)=> {
      let total;
      if (row.length === 1) {
        total = row[0].value.number;
      } else {
        total = _.reduce(row, (a, {key, value})=> {
          if (_.includes(['総計', '総数', '全国'], key)) {
            return a;
          }
          return a + value.number
        }, 0);
      }
      total > m && (m = total);
    });
    return m;
  }
}