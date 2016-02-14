import {Root} from '../lib/eventer'
import {fetchRaw} from '../services/fetcher'
import {normalize, ITableList, sliceRecordList} from "../services/normalizer"
import ChartSet from "../models/chart-set";
import {stringifyParams, retrieveParams} from "../services/params-stringifier";

interface P {
  location:any,
  history:History
}

export default class ChartContext extends Root<P,{}> {
  initialState(props) {
    return {
      charts: []
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
    let chartSettings = [];
    for (let i = 1, set; set = query[`chart${i}`]; i++) {
      chartSettings.push({
        key: query,
        value: retrieveParams(set)
      });
    }
    chartSettings.forEach(({key, value}, i)=> {
      console.log(i)
      let {gender,  year,area, detailName} = value;
      fetchRaw(gender, year, area, detailName, (data:any[])=> {
        let sliced = sliceRecordList(data, detailName);
        console.log({sliced});
      })
    })
  }


  find(params) {
    let gender, area, year, detail, detailName;

    let {x, y, z, xSpecified, ySpecified} = params;
    if (!_.includes([x, y], 'year')) {
      year = z;
    }

    _.zip([x, y], [xSpecified, ySpecified]).forEach(([key, value])=> {
      switch (key) {
        case 'area':
          area = value;
          break;
        case 'year':
          year = value;
          break;
        case 'gender':
          gender = value;
          break;
        default:
          detailName = key;
          detail = value;
      }
    });

    if (!area) {
      area = '0'
    }

    if (!gender) {
      gender = '0'
    }

    if (!detailName) {
      detailName = 'total';
      detail = 'number';
    }
    let chart1 = stringifyParams(gender, area, year, detailName, x, xSpecified, y, ySpecified, z);
    this.dispatch('link', '/v2/chart', {chart1});
  }


  listen(to) {
    to('chart:find', (params)=> {
      this.find(params);
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

