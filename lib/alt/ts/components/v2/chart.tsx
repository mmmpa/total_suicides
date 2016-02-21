import * as React from 'react';
import {Node} from '../../lib/eventer';
import * as d3 from 'd3';
import * as c3 from 'c3';
import * as _ from 'lodash';
import RotatedDataTable from "../data-table";
import ChartSet from "../../models/chart-set";
import Fa from '../../lib/fa';
import {ITableList, ITableSet} from "../../services/normalizer";
import {generateBarProps, tableKeys, tableMaps, areas, years, genders, detectMap, detectCategoryName, detectCategoryDetailMap} from "../../initializers/constants";
import {ChartDataSelector} from './chart-data-selector'
import FetchingChart from "../../models/fetched-chart";
import {ChartBase} from "../../services/params-stringifier";
import * as Promise from 'bluebird'

interface P {
  base:ChartBase,
  charts:FetchingChart[],
  per:boolean
}

interface S {
  baseChartKey?:string,
  chartsKey?:string,
  x?:string,
  xSpecified?: number[]
}

export default class ChartComponent extends Node<P,S> {
  private chart;
  private promice = Promise.resolve();

  constructor(props) {
    super(props);
    this.state = {
      baseChartKey: '',
      chartsKey: '',
      x: '',
      xSpecified: []
    }
  }

  get per():boolean {
    return this.props.per;
  }

  get selectedX() {
    let base = this.getBaseChart(this.props);
    if (!base) {
      return null;
    }

    return base.x;
  }

  detectLabel(y, yKey, zKey?) {
    let header = detectCategoryName(y);
    let name = detectCategoryDetailMap(y, yKey).name;
    let base = name ? `${header}:${name}` : null;

    if (zKey) {
      let year = detectCategoryDetailMap('year', zKey).name;
      return `${year}:${base}`;
    } else {
      return base;
    }
  }

  getBaseChart(props):ChartBase {
    return props.base;
  }

  getFirstChart(props):FetchingChart {
    let {charts} = props;
    if (!charts || charts.length === 0) {
      return null;
    }
    return charts[0];
  }

  getAdditionalChart(props):FetchingChart[] {
    return props.charts;
    /*
     let {charts} = props;
     if (!charts || charts.length <= 1) {
     return null;
     }

     return _.drop(charts.concat(), 1);
     */
  }

  setBaseChart(props) {
    let base = this.getBaseChart(props);
    let first = this.getFirstChart(props);
    let {per} = props;

    if (!base || !first) {
      this.chart && this.chart.flush()
      return;
    }
    let baseChartKey = base.stringify();
    let {x, xSpecified} = base;

    if (this.state.baseChartKey == baseChartKey) {
      console.log('Base chart not change')
      return;
    }

    this.setState({baseChartKey, x, xSpecified});
    let xNameList = [];
    detectMap(x).forEach((map, i)=> {
      if (_.includes(xSpecified, map.key)) {
        xNameList.push(map.name);
      }
    });
    xNameList.unshift('x');

    this.chart = c3.generate({
      bindto: '#chart',
      size: {
        height: 600
      },
      data: {
        x: 'x',
        columns: [
          xNameList,
          this.arrangeData(first, per)
        ],
        type: 'spline'
      },
      bar: {
        width: {
          ratio: 0.95
        }
      },
      axis: {
        x: {
          type: 'category',
          tick: {
            rotate: 75,
            multiline: false
          },
          height: 130
        }
      }
    });
  }

  arrangeData(chartData:FetchingChart, per?:boolean) {
    let {data, value} = chartData;
    if (!data) {
      return;
    }
    let {y, ySpecified, zSpecified, xSpecified, x} = value;

    let label = this.detectLabel(y, ySpecified, zSpecified);
    let xContentList = _.filter(data, (d)=> _.includes(xSpecified, d[x].content)).map((d)=> {
      return per ? d.per : d.value;
    });
    xContentList.unshift(label);
    return xContentList;
  }

  setAdditionalChart(props) {
    if (!this.chart) {
      return;
    }

    let charts:FetchingChart[] = this.getAdditionalChart(props);
    let chartsKey = charts.map((c)=> c.fullKey).join('--') + (props.per ? 'per' : 'number');

    if (this.state.chartsKey == chartsKey) {
      console.log('Charts not change')
      return;
    }

    this.setState({chartsKey});

    let {per} = props;
    let dataList = this.chart.data().concat();
    //let firstData = dataList.shift();
    let {length} = dataList;
    let columns = [];
    let types = {};

    // 基本チャート以外のチャートがなければ全削除。
    if (!charts) {
      let removables = dataList.map((d)=> d.id);
      this.chart.unload({ids: removables});
      return;
    }

    let addedNames = [];

    charts.forEach((chartData)=> {
      let arranged = this.arrangeData(chartData, per);
      addedNames.push(arranged[0]);
      columns.push(arranged);
      types[arranged[0]] = chartData.type
    });

    let unload = [];
    dataList.forEach(({id})=> {
      if (!_.includes(addedNames, id)) {
        unload.push(id);
      }
    });
 
    this.promice = this.promice.then(()=> {
      return new Promise((resolve, _)=> {
        this.chart.load({columns, types, unload});
        setTimeout(()=> resolve(), 500);
      });
    });
  }

  componentDidMount() {
    this.setBaseChart(this.props);
    this.setAdditionalChart(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setBaseChart(nextProps);
    this.setAdditionalChart(nextProps);
  }

  writeXSpecifier(props) {
    let base = this.getBaseChart(props);
    if (!base) {
      return null;
    }

    let {x, xSpecified} = base;

    return <section className="v2-chart x-specifier-list">{detectMap(x).map(({key, name})=> {
      return <label>
        <span className="input-input">
          <input type="checkbox" checked={_.includes(this.state.xSpecified, key)} onChange={()=> this.changeXSpecified(key)} value={key} id=""/>
        </span>
        <span className="input-label">
          {name}
        </span>
      </label>})}
    </section>
  }

  changeXSpecified(key) {
    let xSpecified = this.state.xSpecified.concat();
    if (_.includes(xSpecified, key)) {
      xSpecified = _.without(xSpecified, key);
    } else {
      xSpecified.push(key);
    }

    this.reloadX(xSpecified);
  }

  reloadX(xSpecified) {
    this.dispatch('chart:changeX', xSpecified);
  }

  remove(chartName:string) {
    this.dispatch('chart:remove', chartName);
  }

  changeType(chartName:string, type:string) {
    this.dispatch('chart:type', chartName, type);
  }

  changePer() {
    this.dispatch('chart:per');
  }

  writeAdditionalChartSetting() {
    let {charts} = this.props;

    if (!charts) {
      return null;
    }

    return charts.map((chart:FetchingChart, i)=> {
      let {src, gender, area, year, detailName, x, xSpecified, y, ySpecified, zSpecified, chartType} = chart.value;
      let [barChartActivation, lineChartActivation] = chartType == 'line' ? ['unactivated', 'activated'] : ['activated', 'unactivated'];
      let label = this.detectLabel(y, ySpecified, zSpecified);
      return <section className="v2-chart added-chart chart" key={`additional-${i}-${chart.key}`}>
        <div className="buttons">
          <button className="delete" disabled={charts.length === 1} onClick={()=> this.remove(chart.name)}>
            <Fa icon="trash"/>
          </button>
        </div>
        <div className="chart-types">
          <button className={`bar-chart ${barChartActivation}`} onClick={()=> this.changeType(chart.name, 'bar')}>
            <Fa icon="bar-chart"/>
          </button>
          <button className={`line-chart ${lineChartActivation}`} onClick={()=> this.changeType(chart.name, 'line')}>
            <Fa icon="line-chart"/>
          </button>
        </div>
        <section className="setting">
          {`${chart.name}::${label}`}
        </section>
      </section>
    })
  }

  writePerSelector(props) {
    return <section className="per">
      <label>
        <span className="input-input">
          <input type="checkbox" checked={props.per} onChange={()=> this.changePer()}/>
        </span>
        <span className="input-label">
          全体の割合（%）で表示する
        </span>
      </label>
      <p className="notice">割合とは年齢層、同居人の有無、職業、場所、手段、時間帯、曜日、原因、動機、未遂歴カテゴリー内部の各項目の合計に対する、各項目の値の割合です。表示している項目における割合とは限らないことに注意してください。</p>
    </section>
  }

  back() {
    this.dispatch('chart:finder');
  }

  render() {
    return <article className="v2-chart body">
      <section className="v2-chart chart-container">
        <div id="chart">
        </div>
      </section>
      <section className="v2-chart chart-controller">
        <section className="v2-chart controller-container other-controll">
          <button className="back-to-finder" onClick={()=> this.back()}>
            <Fa icon="undo"/>
            最初からやりなおす
          </button>
          {this.writePerSelector(this.props)}
        </section>
        <section className="v2-chart controller-container x-specifier">
          <h1 className="v2-chart controller-title">
            <Fa icon="arrows-h"/>
            横軸の表示内容の変更
          </h1>
          {this.writeXSpecifier(this.props)}
        </section>
        <section className="v2-chart controller-container adding-controller">
          <h1 className="v2-chart controller-title">
            <Fa icon="arrows-v"/>
            縦軸の表示内容を追加
          </h1>
          <ChartDataSelector x={this.selectedX}/>
        </section>
        <section className="v2-chart controller-container added-chart chart-list">
          <h1 className="v2-chart controller-title">
            <Fa icon="ellipsis-v"/>
            表示中の内容
          </h1>
          {this.writeAdditionalChartSetting()}
        </section>
      </section>
    </article>;
  }
}
