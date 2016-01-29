import * as React from 'react'
import {Node} from '../lib/eventer'
import * as D3 from 'react-d3'
import Constants from "../initializers/constants";
import * as _ from 'lodash';
import {scale} from 'd3';


export default class CircleGraphComponent extends Node<{},{}> {
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

  sortedData(props) {
    let {split, data} = props;

    if(!data){
      return [];
    }

    switch (split) {
      case 'year':
        return _.sortBy(data, (el)=> el.year.content);
      default:
        return props.data;
    }
  }

  normalizeData(props){

    let sorted = this.sortedData(props);

    switch (props.table) {
      case 'day':
        let {dayKeys, dayTexts} = Constants;

        return sorted.map((one)=> {
          let total = _.reduce(dayKeys, (a, key)=>  a + one[key], 0);

          return {
            name: `${one.year.name} (${total})`,
            data: _.map(_.zip(dayKeys, dayTexts), (kt)=> {
              let key = kt[0];
              let label = `${kt[1]} (${one[key]})`;
              return {label, value: Math.round(one[key] / total* 1000) / 10}
            })
          }
        });
      default:
        return sorted;
    }
  }

  normalizeState(props) {
    let normalized = this.normalizeData(props);
    this.setState({normalized});
  }

  writeChart(data) {
    return <D3.PieChart
      colors={scale.category20()}
      data={data.data}
      width={Constants.pieWidth}
      height={Constants.pieHeight}
      radius={Constants.pieSize / 3}
      innerRadius={Constants.pieInnerSize / 2}
      sectorBorderColor="white"
      title={data.name}
    />
  }

  writeCharts(normalized) {
    if(!_.isArray(normalized)){
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
