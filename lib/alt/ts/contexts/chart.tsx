import {Root} from '../lib/eventer'
import {fetch} from '../services/fetcher'
import Constants from "../initializers/constants";
import {normalize} from "../services/normalizer"
import ChartSet from "../models/chart-set";

export default class ChartContext extends Root<{},{}> {
  constructor(props) {
    super(props)
    console.log('chart', this)
  }

  initialState(props) {
    return {}
  }

  componentDidMount() {
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps, this.props);
  }

  fetchData(props, preProps?) {
    fetch(props, (result)=> {
      let {base, table, x, y} = props.params;
      let {data} = result;
      let tableListList = normalize(data);
      this.setState({tableListList, base, table, x, y})
    })
  }

  listen(to) {

    to('area:select', (areas:number[])=> {
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

  setToQuery(key:string, value:any[]){
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

  queryToArray(key){
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

