import * as React from 'react'
import {Node} from '../lib/eventer'
import * as D3 from 'react-d3'
import Constants from "../initializers/constants";
import * as _ from 'lodash';
import {normalizeBarData} from '../services/normalizer'

export default class BarChartComponent extends Node<{},{}> {
  constructor(props) {
    super(props);
    this.state = {
      normalized: []
    }
  }

  componentDidMount() {
    this.normalizeState(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.normalizeState(nextProps)
  }

  normalizeState(props) {
    let normalized = normalizeBarData(props);
    this.setState({normalized});
  }

  detectChartProp(props){
    let {split, table} = props;
    if(split == 'area'){
      return Constants.areaBarProps;
    }else if(split == 'gender'){
      return Constants.genderBarProps
    }

    return Constants.barProps;
  }

  get sectionClass(){
    return 'bar-chart section'
  }

  writeChart(dataList) {
    return <D3.BarChart
      data={dataList}
      fill={'#ffffff'}
      yAxisLabel='人数'
      xAxisLabel='平成年'
      {...this.detectChartProp(this.props)}
    />;
  }

  writeCharts(normalizedList) {
    return _.map(normalizedList, (normalized)=>{
      return <section key={normalized.title} className={this.sectionClass}>
        <h1>{normalized.title}</h1>
        {this.writeChart(normalized.dataList)}
      </section>
    });
  }

  writeChartList(normalized) {
    if (!_.isArray(normalized)) {
      return null;
    }

    return <ul className="chart-list pies">
      {normalized.map((data, index)=>{
        return <li className="chart-list pie" key={index}>
          {this.writeChart(data)}
        </li>
        })}
    </ul>
  }

  render() {
    return <section className="bar-chart">
      {this.writeCharts(this.state.normalized)}
    </section>
  }
}
