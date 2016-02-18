import {Root} from '../lib/eventer'
import {fetchRaw} from '../services/fetcher'
import {normalize, ITableList, sliceRecordList} from "../services/normalizer"
import ChartSet from "../models/chart-set";
import {retrieveParams, retrieveBaseParams, FetchingParams, ChartBase} from "../services/params-stringifier";
import * as _ from 'lodash'
import FetchingChart from "../models/fetched-chart";

interface P {
  location:any,
  history:History
}

interface S {
  charts:FetchingChart[],
  base:ChartBase
}

export default class ChartContext extends Root<P,S> {
  loaded:any[] = [];
  loadedData:FetchingChart[] = [];

  initialState(props) {
    return {
      charts: [],
      base: null
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
    let loaded = this.loaded.concat();
    let loadedData = this.loadedData.concat();

    let base:ChartBase = retrieveBaseParams(query.base);
    let nextNumber = 0;


    let nextQuery = {base: base.stringify()};
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
    console.log({nextLoaded, nextQuery})
    this.loaded = nextLoaded;
    this.loadedData = nextLoadedData;

    this.dispatch('link', '/v2/chart', nextQuery);
  }

  changeType(chartName, type){
    let {query} = this.props.location;
    let base:ChartBase = retrieveBaseParams(query.base);
    let params = retrieveParams(query[chartName], base)
    params.chartType = type;
    query[chartName] = params.stringify();
    this.dispatch('link', '/v2/chart', query);
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
      this.remove(chartName);
    });

    to('chart:type', (chartName, type)=> {
      this.changeType(chartName, type);
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

