import {FetchingParams} from "../services/params-stringifier";

export default class FetchingChart{
  constructor(public key:string, public name:string, public value:FetchingParams, public data:any[] = []){

  }
}