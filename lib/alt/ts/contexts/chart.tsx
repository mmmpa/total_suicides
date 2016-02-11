import {Root} from '../lib/eventer'
import {fetch} from '../services/fetcher'
import {normalize, ITableList} from "../services/normalizer"
import ChartSet from "../models/chart-set";

interface P{
  location:any,
  history:History
}

export default class ChartContext extends Root<P,{}> {
  initialState(props) {
    return {}
  }

  componentDidMount() {
    this.fetchData(this.props);
    this.setTitle(this.props);
    this.pickState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps, this.props);
    this.setTitle(nextProps);
    this.pickState(nextProps);
  }

  pickState(props){
    let area = this.pickSelectedFromQuery(props, 'area');
    let year = this.pickSelectedFromQuery(props, 'year');
    let gender = this.pickSelectedFromQuery(props, 'gender');
    let autoScale = this.pickEnabledFromQuery(props, 'autoScale');
    let par = this.pickEnabledFromQuery(props, 'par');
    console.log({area, year, gender, autoScale, par})
    this.setState({area, year, gender, autoScale, par});
  }

  pickSelectedFromQuery(props:P, name:string) {
    let target = props.location.query[name];
    if (!target) {
      return [];
    }
    return target.toString().split(',').map((n)=> +n)
  }

  pickEnabledFromQuery(props:P, name:string):boolean{
    let target = props.location.query[name];
    return target && target != 'false'
  }

  setTitle(props) {
    console.log({props})
    let {table, x} = props.params;
    this.dispatch('title', `${this.detect_text(table)}別の自殺者数を${this.detect_text(x)}で並べて表示`)
  }

  detect_text(name) {
    switch (name) {
      case 'area':
        return '地域';
      case 'year':
        return '年度';
      case 'gender':
        return '性別';
      case 'age':
        return '年齢層';
      case 'housemate':
        return '同居人の有無';
      case 'job':
        return '職業';
      case 'location':
        return '場所';
      case 'way':
        return '手段';
      case 'hour':
        return '時間帯';
      case 'day':
        return '曜日';
      case 'reason':
        return '動機・要因';
      case 'attempted':
        return '未遂歴';
      case 'total':
        return '総数';
    }
  }

  fetchData(props, preProps?) {
    fetch(props, (result)=> {
      let {base, table, x, y} = props.params;
      let {data} = result;
      let tableListList:ITableList[] = normalize(data);
      setTimeout(()=>this.setState({tableListList, base, table, x, y}), 1)
    })
  }

  listen(to) {
    to('chart:area', (areas:number[])=> {
      let query = this.setToQuery('area', areas);
      this.changeQuery(query);
    });

    to('chart:autoScale', (autoScale)=> {
      let {query} = this.props.location;
      query.autoScale = autoScale;
      this.changeQuery(query);
    });

    to('chart:par', (par)=> {
      let {query} = this.props.location;
      query.par = par;
      this.changeQuery(query);
    });

    to('chart:year', (years)=> {
      let query = this.setToQuery('year', years);
      this.changeQuery(query);
    });

    to('chart:gender', (genders)=> {
      let query = this.setToQuery('gender', genders);
      this.changeQuery(query);
    });
  }

  setToQuery(key:string, value:any[]) {
    let {query} = this.props.location;
    if (value && value.length) {
      query[key] = value.join(',');
    } else {
      delete query[key];
    }
    return query;
  }

  changeQuery(query) {
    this.props.history.pushState(null,
      this.props.location.pathname,
      query
    )
  }
}

