import * as React from 'react'
import {Node} from '../lib/eventer'
import * as D3 from 'react-d3'
import Constants from "../initializers/constants";
import * as _ from 'lodash';
import {normalizePieData} from '../services/normalizer'

export default class PieChartComponent extends Node<{},{}> {
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
    let normalized = normalizePieData(props);
    this.setState({normalized});
  }

  detectPieProp(props){
    let {split, table} = props;
    if(split == 'area'){
      return Constants.pieProps;
    }else if(split == 'job'){
      return Constants.widePieProps
    }

    return Constants.smallPieProps;
  }


  writeChart(data) {
    let pieProps = this.detectPieProp(this.props);

    return <D3.PieChart
      data={data.data}
      title={data.name}
      {...pieProps}
    />
  }

  writeCharts(normalizedList) {
    return _.map(normalizedList, (normalized)=>{
      return <section key={normalized.year.name}>
        <h1>{normalized.year.name}</h1>
        {this.writeChartList(normalized.dataList)}
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
    return <section className="pie-chart">
      {this.writeCharts(this.state.normalized)}
    </section>
  }
}
