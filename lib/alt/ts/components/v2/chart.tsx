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
import {writeBaseSelector, writeSelectorSpecifier, ChartDataSelector} from '../../services/selector-writer'
import FetchingChart from "../../models/fetched-chart";
import {ChartBase} from "../../services/params-stringifier";

interface P {
  base:ChartBase,
  charts:FetchingChart[]
}

export default class ChartComponent extends Node<P,{}> {
  private chart;

  constructor(props) {
    super(props);
    this.state = {
      baseChartKey: '',
      x: '',
      xSpecified: []
    }
  }

  get autoScale():boolean {
    return this.props.autoScale;
  }

  get par():boolean {
    return this.props.par;
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
    let {charts} = props;
    if (!charts || charts.length <= 1) {
      return null;
    }

    return _.drop(charts.concat(), 1);
  }

  setBaseChart(props) {
    let base = this.getBaseChart(props);
    let first = this.getFirstChart(props);

    if (!base || !first) {
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
      if (_.includes(xSpecified, map.key.toString())) {
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
          this.arrangeData(first)
        ],
        type: 'bar',
        types: {
          age: 'bar'
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

  arrangeData(chartData){
    let {data, value} = chartData;
    if (!data) {
      return;
    }
    let {y, ySpecified, z} = value;

    let label = this.detectLabel(y, ySpecified, z);
    let xContentList = data.map((d)=> {
      return d.value;
    });
    xContentList.unshift(label);
    return xContentList;
  }

  setAdditionalChart(props) {
    if (!this.chart) {
      return;
    }

    let charts = this.getAdditionalChart(props);

    let dataList = this.chart.data().concat();
    let {length} = dataList;
    let firstData = dataList.shift();
    let columns = [];

    if (!charts) {
      let removables = dataList.map((d)=> d.id);
      this.chart.unload({ids: removables});
      return;
    }

    let addedNames = [firstData.id];

    charts.forEach((chartData)=> {
      let arranged = this.arrangeData(chartData);
      addedNames.push(arranged[0]);
      columns.push(arranged);
    });

    let removables = [];
    dataList.forEach(({id})=> {
      if (!_.includes(addedNames, id)) {
        removables.push(id);
      }
    });


    if(length <= columns.length){
      this.chart.load({columns});
    }

    if (removables.length) {
      this.chart.unload({ids: removables});
    }
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

    return detectMap(x).map(({key, name})=> {
      return <label>
        <input type="checkbox" checked={_.includes(xSpecified, key.toString())} onChange={()=> this.changeXSpecified(key)} value={key} id=""/>
        {name}
      </label>
    });
  }

  changeXSpecified(keySrc) {
    let key = keySrc.toString();
    let xSpecified = this.state.xSpecified.concat();
    if (_.includes(xSpecified, key)) {
      xSpecified = _.without(xSpecified, key);
    } else {
      xSpecified.push(key);
    }
    this.setState({xSpecified});
  }

  reloadX() {
    this.dispatch('chart:changeX', this.state.xSpecified.sort());
  }

  remove(chartName:string) {
    this.dispatch('chart:remove', chartName);
  }

  writeAdditionalChartSetting() {
    let {charts} = this.props;

    if (!charts) {
      return null;
    }

    return charts.map((chart:FetchingChart, i)=> {
      let {src, gender, area, year, detailName, x, xSpecified, y, ySpecified, z} = chart.value;
      let label = this.detectLabel(y, ySpecified, z);
      return <section key={`additional-${i}-${chart.key}`}>
        <div className="controller">
          <button disabled={charts.length === 1} onClick={()=> this.remove(chart.name)}>
            <Fa icon="trash"/>
          </button>
        </div>
        <section className="setting">
          {`${chart.name}::${label}`}
        </section>
      </section>
    })
  }

  render() {
    return <article className="v2-chart body">
      <div id="chart" className="v2-chart chart-container">
      </div>
      <section className="v2-chart x-specifier">
        <button onClick={()=> this.reloadX()}>
          <Fa icon="refresh"/>
          変更を反映
        </button>
        {this.writeXSpecifier(this.props)}
      </section>
      <section className="v2-chart adding-controller">
        <ChartDataSelector x={this.selectedX}/>
      </section>
      <section className="v2-chart additional-chart configuration">
        {this.writeAdditionalChartSetting()}
      </section>
    </article>;
  }
}
