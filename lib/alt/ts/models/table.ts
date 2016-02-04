export default class Table{
  row:number[][] = [];
  rowTitle:string[] = [];

  constructor(public title:string, public column:string[] = []){

  }

  addColumn(name:string){
    this.column.push(name);
  }

  addRow(title:string, row:number[]){
    this.rowTitle.push(title);
    this.row.push(row);
  }
}