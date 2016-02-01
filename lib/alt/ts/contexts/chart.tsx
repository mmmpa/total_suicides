import {Root} from '../lib/eventer'

export default class ChartContext extends Root<{},{}> {
  initialState(props) {
    let {data, table, split} = props;
    return {data, table, split}
  }

  relay(props) {
    let {data, table, split} = props;
    this.setState({data, table, split});
  }

  componentDidMount() {
    this.relay(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.relay(nextProps);
  }

  listen(to) {
    to('area:select', (key)=> {
      let {query} = this.props.location;
      query.area = key.join(',');
      this.props.history.pushState(null,
        this.props.location.pathname,
        query
      )
    })
  }
}

