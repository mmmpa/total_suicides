import {Root} from '../lib/eventer'
import {fetchPreset, fetchWithParams} from '../services/fetcher'

export default class ChartContext extends Root<{},{}> {
  initialState(props) {
    let {table, split, sort} = props.params;
    return {table, split, sort}
  }

  relay(props) {
    let {table, split, sort} = props.params;
    this.setState({table, split, sort});
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
    if (this.needFetch(props, preProps)) {
      fetchWithParams(props, (data)=> {
        let {table, split, rotation} = props.params;
        this.setState({table, split, rotation, data});
      })
    }
  }

  needFetch(props, preProps?) {
    if (!preProps) return true;
    if (props.location.pathname != preProps.location.pathname) return true;
    let reg = /autoScale=[a-z]+/;
    if (props.location.search.replace(reg, '') != preProps.location.search.replace(reg, '')) return true;

    return false;
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

