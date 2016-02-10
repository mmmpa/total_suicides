import {Root} from '../lib/eventer'
import {fetch} from '../services/fetcher'
import Constants from "../initializers/constants";
import {normalize} from "../services/normalizer"
import ChartSet from "../models/chart-set";

export default class ChartContext extends Root<{},{}> {
  initialState(props) {
    return {}
  }

  componentDidMount() {
    this.fetchData(this.props);
    this.setTitle(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps, this.props);
    this.setTitle(nextProps);
  }

  setTitle(props) {
    let {table, x} = props.params;
    this.dispatch('title', `${this.detect_text(table)}別の自殺者数を${this.detect_text(x)}で並べて表示`)
  }

  detect_text(name) {
    switch (name) {
      case 'area':
        return '地域'
      case 'year':
        return '年度'
      case 'age':
        return '性別'
      case 'age':
        return '年齢層'
      case 'housemate':
        return '同居人の有無'
      case 'job':
        return '職業'
      case 'location':
        return '場所'
      case 'way':
        return '手段'
      case 'hour':
        return '時間帯'
      case 'day':
        return '曜日'
      case 'reason':
        return '動機・要因'
      case 'attempted':
        return '未遂歴'
      case 'total':
        return '総数'
    }
  }

  fetchData(props, preProps?) {
    fetch(props, (result)=> {
      let {base, table, x, y} = props.params;
      let {data} = result;
      let tableListList = normalize(data);
      setTimeout(()=>this.setState({tableListList, base, table, x, y}), 1)
    })
  }

  listen(to) {
    to('chart:area', (areas:number[])=> {
      console.log('aea')
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

  queryToArray(key) {
    let target = this.props.location.query[key];
    if (!target) {
      return [];
    }
    return target.split(',');
  }

  get years() {
    return this.queryToArray('year');
  }

  get genders() {
    return this.queryToArray('year');
  }

}

