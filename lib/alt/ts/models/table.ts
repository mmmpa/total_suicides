import * as _ from 'lodash'

export default class Table {
  row:number[][] = [];
  rowTitle:string[] = [];
  max:number = 0;

  constructor(public title:string, public column:{string: string}[] = []) {

  }

  addColumn(name:string) {
    this.column.push(name);
  }

  addRow(title:string, row:number[]) {
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
      if (_.includes(['総計', '総数', '全国'], this.rowTitle[i])) {
        return;
      }

      let total = _.reduce(row, (a, {key, value})=> {
        if (row.length >= 2) {
          if (_.includes(['総計', '総数', '全国'], key)) {
            return null
          }
        }

        return a + value.number
      }, 0);
      total > m && (m = total);
    });
    return m;
  }
}