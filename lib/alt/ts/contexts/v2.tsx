import {Root} from '../lib/eventer'
import {fetchRaw} from '../services/fetcher'
import {normalize, ITableList, sliceRecordList} from "../services/normalizer"
import ChartSet from "../models/chart-set";
import {retrieveParams, retrieveBaseParams, FetchingParams, ChartBase} from "../services/params-stringifier";
import * as _ from 'lodash'
import FetchingChart from "../models/fetched-chart";
import {pickEnabledFromQuery} from '../services/query-manager'

interface P {
  location:any,
  history:History
}

interface S {
  charts?:FetchingChart[],
  base?:ChartBase,
  per?:boolean
}

export default class ChartContext extends Root<P,S> {
  loaded:any[] = [];
  loadedData:FetchingChart[] = [];

  initialState(props) {
    return {
      charts: [],
      base: null,
      per: false
    }
  }

  componentDidMount() {
    this.setConfiguration(this.props);
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setConfiguration(nextProps);
    this.fetchData(nextProps);
  }

  setConfiguration(props) {
    let {query} = props.location;
    let per = pickEnabledFromQuery(query, 'per')
    this.setState({per});
  }

  togglePer() {
    let per = !this.state.per;
    this.setState({per});

    let {query} = this.props.location;
    query.per = per;
    this.dispatch('link', '/v2/chart', query, true);
  }

  fetchData(props) {
    let {query} = props.location;
    if (!query.base) {
      return;
    }

    let chartSettings:FetchingChart[] = [];
    let base:ChartBase = retrieveBaseParams(query.base);

    for (let i = 1, set; set = query[`chart${i}`]; i++) {
      chartSettings.push(new FetchingChart(set, `chart${i}`, retrieveParams(set, base)));
    }

    let loaded = this.loaded.concat();
    let loading = chartSettings.length;
    let charts:FetchingChart[] = [];
    let olds:FetchingChart[] = this.loadedData.concat();

    let onLoaded = ()=> {
      loading--;
      if (loading === 0) {
        this.loaded = loaded;
        this.loadedData = charts;
        this.setState({base, charts});
        console.log({charts})
      }
    };

    chartSettings.forEach((chart:FetchingChart, i)=> {
      let {key, name, value, fullKey} = chart;

      let preKey = loaded[i];
      if (preKey === fullKey && olds[i]) {
        chart.data = olds[i].data;
        charts[i] = chart;
        onLoaded();
        return;
      }

      let {gender, year, area, detailName} = value;
      fetchRaw(gender, year, area, detailName, (data:any[])=> {
        loaded[i] = fullKey;
        chart.data = data ? sliceRecordList(data, detailName) : null;
        charts[i] = chart;
        onLoaded();
      })
    });
  }

  find(params) {
    this.setState({charts: []});
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

    this.loaded = [];

    this.dispatch('link', '/v2/chart', nextQuery, true);
  }

  add(y, ySpecified, zSpecified) {
    let {query} = this.props.location;
    let base:ChartBase = retrieveBaseParams(query.base);
    let nextNumber = 1;
    while (query[`chart${nextNumber}`]) {
      nextNumber++;
    }
    query[`chart${nextNumber}`] = new FetchingParams(base, {y, ySpecified, zSpecified}).stringify();
    this.dispatch('link', '/v2/chart', query);
  }

  remove(chartName) {
    let {query} = this.props.location;
    let loaded = this.loaded.concat();
    let loadedData = this.loadedData.concat();

    let base:ChartBase = retrieveBaseParams(query.base);
    let nextNumber = 0;

    let nextQuery = {base: base.stringify(), per: query.per};
    let nextLoaded = []
    let nextLoadedData = []

    for (let i = 1, set; set = query[`chart${i}`]; i++) {
      if (`chart${i}` === chartName) {
        continue;
      }
      nextQuery[`chart${nextNumber + 1}`] = retrieveParams(set, base).stringify();
      nextLoaded[nextNumber] = loaded[i - 1];
      nextLoadedData[nextNumber] = loadedData[i - 1];
      nextNumber++;
    }
    this.loaded = nextLoaded;
    this.loadedData = nextLoadedData;

    this.dispatch('link', '/v2/chart', nextQuery, true);
  }

  changeType(chartName, type) {
    console.log('change type')
    let {query} = this.props.location;
    let base:ChartBase = retrieveBaseParams(query.base);
    let params = retrieveParams(query[chartName], base)
    params.chartType = type;
    query[chartName] = params.stringify();
    this.dispatch('link', '/v2/chart', query, true);
  }

  goFinder() {
    this.dispatch('link', '/');
  }

  listen(to) {
    to('chart:finder', (params)=> {
      this.goFinder();
    });

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
      this.remove(chartName);
    });

    to('chart:per', ()=> {
      this.togglePer();
    });

    to('chart:type', (chartName, type)=> {
      this.changeType(chartName, type);
    });
  }
}

