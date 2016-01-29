import {Root} from '../lib/eventer'

export default class PresetGraph extends Root<{},{}> {
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
    to('increment', ()=> {
      console.log('context increment');
      this.dispatch('increment')
    })
  }
}

