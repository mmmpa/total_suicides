import * as React from 'react';
import {Node} from '../../lib/eventer';
import * as d3 from 'd3';
import * as c3 from 'c3';
import * as _ from 'lodash';
import RotatedDataTable from "../data-table";
import ChartSet from "../../models/chart-set";
import Fa from '../../lib/fa';
import {ITableList, ITableSet} from "../../services/normalizer";
import {generateBarProps, tableKeys, tableMaps, areas, years, genders, detectMap, detectCategoryName} from "../../initializers/constants";
import {writeBaseSelector, writeSelectorSpecifier, ChartDataSelector} from '../../services/selector-writer'
import FetchingChart from "../../models/fetched-chart";
import FetchingChart from "../../models/fetched-chart";
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

  detectLabel(y, yKey, z?) {
    let header = detectCategoryName(y);
    let keyMap = detectMap(y);
    let map = _.find(keyMap, ({key})=> key + '' === yKey + '');
    let base = map ? `${header}:${map.name}` : null;
    return z ? `${z}:${base}` : base;
  }

  getBaseChart(props) {
    return this.props.base;
  }

  getAdditionalChart(props):FetchingChart[] {
    if (!props.charts || props.charts.length === 0) {
      return null;
    }
    return props.charts.concat();
  }

  setBaseChart(props) {
    let base = this.getBaseChart(props);

    if (!base) {
      return;
    }
    let baseChartKey = base.stringify();
    let {x, xSpecified} = base;

    if (this.state.baseChartKey == baseChartKey) {
      console.log('Base chart not change')
      return;
    }
    this.setState({baseChartKey, x, xSpecified});
    console.log({baseChartKey, x, xSpecified})
    let xNameList = [];
    let dummy = [];
    detectMap(x).forEach((map)=> {
      if (_.includes(xSpecified, map.key.toString())) {
        xNameList.push(map.name);
        dummy.push(0);
      }
    });
    xNameList.unshift('x');
    dummy.unshift('place holder');

    this.chart = c3.generate({
      bindto: '#chart',
      size: {
        height: 600
      },
      data: {
        x: 'x',
        columns: [
          xNameList,
          dummy
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

  setAdditionalChart(props) {
    if (!this.chart) {
      return;
    }
    let charts = this.getAdditionalChart(props);

    let dataList = this.chart.data().concat();
    let columns = [];

    if (!charts) {
      let removables = dataList.map((d)=> d.id);
      this.chart.unload({ids: removables});
      return;
    }

    let addedNames = [];

    charts.forEach(({value, data})=> {
      if (!data) {
        return;
      }
      let filteredX = [];
      let {x, y, xSpecified, ySpecified, z} = value;

      _.sortBy(data, (d)=> d[x].content).forEach((d)=> {
        if (d[y].content == ySpecified && _.includes(xSpecified, d[x].content.toString())) {
          filteredX.push(d);
        }
      });

      let label = this.detectLabel(y, ySpecified, z);
      let xContentList = filteredX.map((d)=> {
        return d.value;
      });
      addedNames.push(label);
      columns.push([label].concat(xContentList));
    });

    let removables = [];
    dataList.forEach(({id})=> {
      if (!_.includes(addedNames, id)) {
        removables.push(id);
      }
    });


    this.chart.load({columns});

    if (removables.length) {
      this.chart.unload({ids: removables});
    }
    this.chart.unload('dummy');

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
    let charts = this.getAdditionalChart(this.props);

    if (!charts) {
      return null;
    }

    return charts.map((chart:FetchingChart, i)=> {
      let {src, gender, area, year, detailName, x, xSpecified, y, ySpecified, z} = chart.value;
      return <section key={`additional-${i}-${chart.key}`}>
        <div className="controller">
          <button onClick={()=> this.remove(chart.name)}>
            <Fa icon="trash"/>
          </button>
        </div>
        <section className="setting">
          {`${chart.name}::${y}-${ySpecified}`}
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
      <section className="v2-chart base-chart configuration">

      </section>
      <section className="v2-chart additional-chart configuration">
        {this.writeAdditionalChartSetting()}
      </section>
      <section className="v2-chart adding-controller">
        <ChartDataSelector x={this.selectedX}/>
      </section>
    </article>;
  }
}
