import {Root} from '../lib/eventer'
import {fetchRaw} from '../services/fetcher'
import {normalize, ITableList, sliceRecordList} from "../services/normalizer"
import ChartSet from "../models/chart-set";
import {stringifyParams, retrieveParams, retrieveBaseParams, FetchingParams, ChartBase} from "../services/params-stringifier";
import * as _ from 'lodash'
import FetchingChart from "../models/fetched-chart";

interface P {
  location:any,
  history:History
}

interface S {
  charts:FetchingChart[],
  base:ChartBase,
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
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps);
  }

  fetchData(props) {
    let {query} = props.location;
    if(!query.base){
      return;
    }

    let chartSettings:FetchingChart[] = [];
    let base:ChartBase = retrieveBaseParams(query.base);

    for (let i = 1, set; set = query[`chart${i}`]; i++) {
      chartSettings.push(new FetchingChart(set, `chart${i}`, retrieveParams(set, base)));
    }
    this.setState({base});

    let loaded = this.state.loaded.concat();
    let loading = chartSettings.length;
    let charts:FetchingChart[] = [];
    let olds:FetchingChart[] = this.state.charts.concat();

    let onLoaded = ()=>{
      loading--;
      if (loading === 0) {
        this.setState({charts, loaded});
      }
    };

    chartSettings.forEach((chart:FetchingChart, i)=> {
       let {key, name, value} = chart;

      let preKey = loaded[i];
      if (preKey === key && olds[i]) {
        chart.data = olds[i].data;
        charts[i] = chart;
        onLoaded();
        return;
      }

      let {gender, year, area, detailName} = value;
      fetchRaw(gender, year, area, detailName, (data:any[])=> {
        loaded[i] = key;
        chart.data = data ? sliceRecordList(data, detailName) : null;
        charts[i] = chart;
        onLoaded();
      })
    });
  }

  find(params) {
    let base = new ChartBase(params.x, params.xSpecified);
    let chart1 = new FetchingParams(base, params);
    this.dispatch('link', '/v2/chart', {base: base.stringify(), chart1: chart1.stringify()});
  }

  replaceSpecified(xSpecified) {
    let {query} = this.props.location;
    let base:ChartBase = retrieveBaseParams(query.base);
    base.xSpecified = xSpecified;

    let nextQuery = {base: base.stringify()};

    let chartSettings:{key:string, value:FetchingParams}[] = [];
    for (let i = 1, set; set = query[`chart${i}`]; i++) {
      chartSettings.push({
        key: `chart${i}`,
        value: retrieveParams(set, base)
      });
    }

    chartSettings.forEach(({key, value})=> {
      nextQuery[key] = value.stringify();
    });

    this.dispatch('link', '/v2/chart', nextQuery);
  }

  add(y, ySpecified, z) {
    let {query} = this.props.location;
    let base:ChartBase = retrieveBaseParams(query.base);
    let nextNumber = 1;
    while (query[`chart${nextNumber}`]) {
      nextNumber++;
    }
    query[`chart${nextNumber}`] = new FetchingParams(base, {y, ySpecified, z}).stringify();
    this.dispatch('link', '/v2/chart', query);
  }

  remove(chartName) {
    let {query} = this.props.location;
    let loaded = this.state.loaded.concat();

    let base:ChartBase = retrieveBaseParams(query.base);
    let nextNumber = 1;


    let nextQuery = {base: base.stringify()};
    let nextLoaded = [loaded[0]]

    for (let i = 1, set; set = query[`chart${i}`]; i++) {
      if (`chart${i}` === chartName) {
        continue;
      }
      nextQuery[`chart${nextNumber}`] = retrieveParams(set, base).stringify();
      nextLoaded[nextNumber] = loaded[i];
      nextNumber++;
    }
    console.log({nextLoaded, nextQuery})
    this.setState({loaded: nextLoaded});
    this.dispatch('link', '/v2/chart', nextQuery);
  }

  listen(to) {
    to('chart:find', (params)=> {
      this.find(params);
    });

    to('chart:changeX', (xSpecified)=> {
      this.replaceSpecified(xSpecified);
    });

    to('chart:add', (y, ySpecified, z)=> {
      this.add(y, ySpecified, z);
    });

    to('chart:remove', (chartName)=> {
      console.log('remove')
      this.remove(chartName);
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

