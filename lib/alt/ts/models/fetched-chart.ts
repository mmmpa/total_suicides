import * as _ from 'lodash'
import {FetchingParams} from "../services/params-stringifier";

export default class FetchingChart {
  data_:any[];

  constructor(public key:string, public name:string, public value:FetchingParams, public data:any[] = []) {
    this.data = data;
  }

  set data(value:any[]) {
    let {x, y, xSpecified, ySpecified, zSpecified} = this.value;

    this.data_ = _.filter(value, (d)=> {
      return _.includes(ySpecified, d[y].content);
    });

    if(x == 'area' || x == 'year' || x == 'gender'){
      this.data_ = _.sortBy(this.data_, (d)=>{
        return d[x].content;
      });
    }
  }

  get type(){
    if(!this.value.chartType){
      return 'bar'
    }
    return this.value.chartType == '' ? 'bar' : this.value.chartType
  }

  get data() {
    return this.data_
  }

  get fullKey(){
    return this.value.stringifyAll();
  }
}