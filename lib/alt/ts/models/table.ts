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
    _.each(this.row, (r)=> {
      let total = _.reduce(r, (a, {number})=> {
        return a + number
      }, 0);
      total > m && (m = total);
    });
    return m;
  }
}