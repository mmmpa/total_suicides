import {Root} from '../lib/eventer'
import {fetch} from '../services/fetcher'
import Constants from "../initializers/constants";
import {normalize} from "../services/normalizer"

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

  detectApiParam(props) {
    let {title, column, row} = props.params;
    let {yearFilter, areaFilter, genderFilter, itemFilter} = props.location.query;

    let requires = [title, column, row];
    let table = this.pickTable(requires);

    let year = '-';
    if (_.includes(requires, 'year')) {
      year = yearFilter || Constants.years[0].key;
    }

    let area = '0';
    if (_.includes(requires, 'area')) {
      area = areaFilter || '-';
    }

    let gender = '0';
    if (_.includes(requires, 'gender')) {
      gender = genderFilter || '-';
    }

    return {gender, area, year, table};
  }

  pickTable(names:string[]) {
    let table;
    _.each(names, (name:string)=> {
      if (_.includes(Constants.tableKeys, name)) {
        if (table) {
          throw 'Double table error';
        }
        table = name;
      }
    });
    return table || 'total';
  }

  fetchData(props, preProps?) {
    let params = this.detectApiParam(props);
    console.log({params});
    fetch(params, (result)=> {
      let {title, column, row} = props.params;
      let {data, table} = result;
      let chartDataList = normalize({title, column, row, table, data});
      console.log({chartDataList});
      this.setState({chartDataList});
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

