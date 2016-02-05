import * as _ from 'lodash'

export default class Table{
  row:number[][] = [];
  rowTitle:string[] = [];

  constructor(public title:string, public column:{string: string}[] = []){

  }

  addColumn(name:string){
    this.column.push(name);
  }

  addRow(title:string, row:number[]){
    this.rowTitle.push(title);
    this.row.push(row);
  }

  get max():number{
    let m = 0;
    _.each(this.row, (r)=>{
      let total = _.reduce(r, (a, {number})=>{
        return a + number
      }, 0);
      total > m && (m = total);
    });
    return m;
  }
}