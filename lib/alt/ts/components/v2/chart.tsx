import * as React from 'react';
import {Node} from '../../lib/eventer';
import * as d3 from 'd3';
import * as c3 from 'c3';
import * as _ from 'lodash';
import RotatedDataTable from "../data-table";
import ChartSet from "../../models/chart-set";
import Fa from '../../lib/fa';
import {ITableList, ITableSet} from "../../services/normalizer";
import {generateBarProps, tableKeys, tableMaps, areas, years, genders, detectMap} from "../../initializers/constants";
import {writeBaseSelector, writeSelectorSpecifier, ChartDataSelector} from '../../services/selector-writer'

interface P {
  charts:any[]
}

export default class ChartComponent extends Node<P,{}> {
  private chart;

  constructor(props) {
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

  get keyBase():string {
    let {base, table, x, y} = this.props;
    return [base, table, x, y].join('-')
  }

  domain(max?:number) {
    if (this.par) {
      return this.autoScale ? null : [0, 100];
    }

    return !max || this.autoScale ? null : [0, max];
  }

  detectLabel(y, yKey, z?) {
    let keyMap = detectMap(y);
    let map = _.find(keyMap, ({key})=> key+'' === yKey+'');
    let base =  map ? map.name : null;
    return z ? `${z}:${base}` : base;
  }

  getBaseChart(props) {
    if (!this.props.charts || props.charts.length === 0) {
      return null;
    }

    return props.charts[0]
  }

  getAdditionalChart(props) {
    if (!props.charts || props.charts.length < 2) {
      return null;
    }
    let c = props.charts.concat();
    c.shift();
    return c;
  }

  setBaseChart(props) {
    let chart = this.getBaseChart(props);
    if (!chart) {
      return;
    }
    let baseChartKey = chart.key;
    let {x, y, xSpecified, ySpecified, z} = chart.value;
    let data = chart.data;

    if (this.state.baseChartKey == baseChartKey) {
      console.log('base chart not change')
      return;
    }
    this.setState({baseChartKey, x, xSpecified});

    console.log({x, y, xSpecified, ySpecified});

    let filteredX = [];

    _.sortBy(data, (d)=> d[x].content).forEach((d)=> {
      if (d[y].content == ySpecified && _.includes(xSpecified, d[x].content.toString())) {
        filteredX.push(d);
      }
    });

    let xNameList = filteredX.map((d)=> {
      return d[x].name;
    });
    xNameList.unshift('x');

    let xContentList = filteredX.map((d)=> {
      return d.value;
    });
    xContentList.unshift(this.detectLabel(y, ySpecified, z));

    console.log({xNameList, xContentList});

    this.chart = c3.generate({
      bindto: '#chart',
      size:{
        height: 600
      },
      data: {
        x: 'x',
        columns: [
          xNameList,
          xContentList
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
    let charts = this.getAdditionalChart(props);

    if (!charts) {
      return;
    }

    let dataList = this.chart.data()


    charts.forEach(({value, data})=> {
      let filteredX = [];
      let {x, y, xSpecified, ySpecified, z} = value;

      console.log({x, y, xSpecified, ySpecified})

      _.sortBy(data, (d)=> d[x].content).forEach((d)=> {
        if (d[y].content == ySpecified && _.includes(xSpecified, d[x].content.toString())) {
          filteredX.push(d);
        }
      });

      let label = this.detectLabel(y, ySpecified, z);
      let xContentList = filteredX.map((d)=> {
        return d.value;
      });

      _.remove(dataList, ({id})=> id == label);
      dataList.push({id: label, values: xContentList});
    });

    let columns = dataList.map(({id, values})=> {
      return [id].concat(values.map((set)=> set.value || set))
    });

    console.log({columns});
    this.chart.load({columns});
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
    let chart = this.getBaseChart(props);
    if (!chart) {
      return null;
    }

    let {x, xSpecified} = this.state;

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

  writeAdditionalChartSetting(props) {
    let charts = this.getAdditionalChart(props);

    if (!charts) {
      return null;
    }

    return charts.map(({value, key}, i)=> {
      let {src, gender, area, year, detailName, x, xSpecified, y, ySpecified, z} = value;
      return <section key={`additional-${i}-${key}`}>
        <div className="controller">
          <button>
            <Fa icon="trash"/>
          </button>
        </div>
        <section className="setting">
          {`${y}-${ySpecified}`}
        </section>
      </section>
    })
  }

  get selectedX(){
    let chart = this.getBaseChart(this.props);
    if (!chart) {
      return null;
    }

    return chart.value.x;
  }

  writeAddingController() {
    let chart = this.getBaseChart(this.props);
    if (!chart) {
      return null;
    }

    return writeBaseSelector((selectedSelector)=> {
      this.setState({selectedSelector})
    }, [this.state.selectedSelector], chart.value.x)
  }

  writeAddingSpecifier() {
    let {selectedSelector} = this.state;
    if (!selectedSelector) {
      return null;
    }
    return writeSelectorSpecifier(selectedSelector, (selectedSpecifier)=> {
      this.setState({selectedSpecifier})
    }, [this.state.selectedSpecifier])
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
        {this.writeAdditionalChartSetting(this.props)}
      </section>
      <section className="v2-chart adding-controller">
        <ChartDataSelector x={this.selectedX}/>
      </section>
    </article>;
  }
}
