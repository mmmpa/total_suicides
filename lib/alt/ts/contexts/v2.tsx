import {Root} from '../lib/eventer'
import {fetchRaw} from '../services/fetcher'
import {normalize, ITableList} from "../services/normalizer"
import ChartSet from "../models/chart-set";

interface P {
  location:any,
  history:History
}

export default class ChartContext extends Root<P,{}> {
  initialState(props) {
    return {
      selectedYears: [],
      selectedGenders: [],
      selectedAreas: [],
      selectedDetail: null,
      errors: {}
    }
  }

  find(){
    let {selectedAreas, selectedYears, selectedGenders, selectedDetail} = this.state;
    let errors = _.reduce({selectedAreas, selectedYears, selectedGenders, selectedDetail}, (a, value, key)=>{
      if(!value || value.length === 0){
        a[key.replace('selected', 'errorOn')] = 'すくなくとも一つ選択してください'
      }
      return a
    }, {});

    if(_.keys(errors).length === 0){
      fetchRaw({
        years: selectedYears,
        genders: selectedGenders,
        areas: selectedAreas,
        detail: selectedDetail
      }, (data:any[])=>{

      });
    }else{
      this.setState({errors});
    }
  }

  componentDidMount() {
    //this.fetchData(this.props);
    this.setTitle(this.props);
    this.pickState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    //this.fetchData(nextProps, this.props);
    this.setTitle(nextProps);
    this.pickState(nextProps);
  }

  pickState(props) {
    let selectedAreas = this.pickSelectedFromQuery(props, 'area');
    let selectedYears = this.pickSelectedFromQuery(props, 'year');
    let selectedGenders = this.pickSelectedFromQuery(props, 'gender');
    let selectedDetail = this.pickSelectedFromQuery(props, 'detail', false)[0];
    let autoScale = this.pickEnabledFromQuery(props, 'autoScale');
    let par = this.pickEnabledFromQuery(props, 'par');
    console.log({selectedAreas, selectedYears, selectedGenders, selectedDetail, autoScale, par})
    this.setState({selectedAreas, selectedYears, selectedGenders, selectedDetail, autoScale, par});
  }

  pickSelectedFromQuery(props:P, name:string, num:boolean = true) {
    let target = props.location.query[name];
    if (!target) {
      return [];
    }
    if(num){
      return target.toString().split(',').map((n)=> +n);
    }else{
      return target.toString().split(',');
    }
  }

  pickEnabledFromQuery(props:P, name:string):boolean {
    let target = props.location.query[name];
    return target && target != 'false'
  }

  setTitle(props) {
    let {table, x} = props.params;
    //this.dispatch('title', `${this.detect_text(table)}別の自殺者数を${this.detect_text(x)}で並べて表示`)
  }

  listen(to) {
    to('chart:find', ()=> {
      this.find();
    });

    to('chart:area', (selectedAreas:number[])=> {
      this.setState({selectedAreas});
    });

    to('chart:year', (selectedYears)=> {
      this.setState({selectedYears});
    });

    to('chart:gender', (selectedGenders)=> {
      this.setState({selectedGenders});
    });

    to('chart:detail', (selectedDetail)=> {
      this.setState({selectedDetail});
    });
  }
}

