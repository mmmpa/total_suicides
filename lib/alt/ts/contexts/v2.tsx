import {Root} from '../lib/eventer'
import {fetchRaw} from '../services/fetcher'
import {normalize, ITableList, sliceRecordList} from "../services/normalizer"
import ChartSet from "../models/chart-set";
import {stringifyParams, retrieveParams, retrieveBaseParams, FetchingParams} from "../services/params-stringifier";
import * as _ from 'lodash'

interface P {
  location:any,
  history:History
}

interface S{
  charts:any,
  base:any,
  loaded:any
}

export default class ChartContext extends Root<P,S> {
  initialState(props) {
    return {
      charts: [],
      base: null,
      loaded: []
    }
  }

  componentDidMount() {
    console.log('mount')
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps);
  }

  fetchData(props) {
    let {query} = props.location;
    let chartSettings:{key:string, value:FetchingParams}[] = [];
    let base:FetchingParams = retrieveBaseParams(query.base);

    chartSettings.push({
      key: base.src,
      value: base
    });

    for (let i = 1, set; set = query[`chart${i}`]; i++) {
      console.log({set})
      chartSettings.push({
        key: set,
        value: retrieveParams(set, base)
      });
    }

    chartSettings.forEach(({key, value}, i)=> {
      let preKey = this.state.loaded[i];
      if (preKey === key) {
        return;
      }
      let loaded = this.state.loaded.concat();
      loaded[i] = key;
      this.setState({loaded});

      let {gender,  year,area, detailName} = value;
      fetchRaw(gender, year, area, detailName, (data:any[])=> {
        let charts = this.state.charts.concat();
        let sliced = sliceRecordList(data, detailName);
        charts[i] = {
          key, value, data: sliced
        }
        this.setState({charts});
      })
    })
  }


  find(params) {
    let base = new FetchingParams(params);
    this.setState({base});
    console.log(base.stringify())
    this.dispatch('link', '/v2/chart', {base: base.stringify()});
  }

  replaceSpecified(xSpecified){
    let {query} = this.props.location;
    let base:FetchingParams = retrieveBaseParams(query.base);
    base.xSpecified = xSpecified;

    let nextQuery = {base: base.stringify()};

    let chartSettings:{key:string, value:FetchingParams}[] = [];
    for (let i = 1, set; set = query[`chart${i}`]; i++) {
      chartSettings.push({
        key: `chart${i}`,
        value: retrieveParams(set, base)
      });
    }

    chartSettings.forEach(({key, value})=>{
      nextQuery[key] = value.additionalStringify();
    });

    this.dispatch('link', '/v2/chart', nextQuery);
  }

  listen(to) {
    to('chart:find', (params)=> {
      this.find(params);
    });

    to('chart:changeX', (xSpecified)=> {
      this.replaceSpecified(xSpecified);
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

