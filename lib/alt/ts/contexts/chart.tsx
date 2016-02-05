import {Root} from '../lib/eventer'
import {fetch} from '../services/fetcher'
import Constants from "../initializers/constants";
import {normalize} from "../services/normalizer"
import {convertTableToChart} from "../services/converter"
import ChartSet from "../models/chart-set";

export default class ChartContext extends Root<{},{}> {
  initialState(props) {
    let {table, split, sort} = props.params;
    return {table, split, sort}
  }

  relay(props) {
    let {table, split, sort} = props.params;
    let {dataList} = this.state;
    this.setState({table, split, sort, dataList});
  }

  componentDidMount() {
    this.fetchData(this.props);
    this.relay(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps, this.props);
    this.relay(nextProps);
  }

  fetchData(props, preProps?) {
    fetch(props, (result)=> {
      let {title, column, row} = props.params;
      let {data, table} = result;
      let tableList = normalize({title, column, row, table, data});
      let dataList = _.map(tableList, (table)=> {
        let chartSet = ChartSet.fromTable(table);
        return {chartSet, table};
      });
      this.setState({dataList});
    })
  }

  listen(to) {
    to('area:select', (key)=> {
      let {query} = this.props.location;
      if (key && key.length) {
        query.area = key.join(',');
      } else {
        delete query.area;
      }
      this.props.history.pushState(null,
        this.props.location.pathname,
        query
      )
    });
    to('chart:autoScale', (autoScale)=> {
      let {query} = this.props.location;
      query.autoScale = autoScale;
      this.props.history.pushState(null,
        this.props.location.pathname,
        query
      )
    });
  }
}

