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

