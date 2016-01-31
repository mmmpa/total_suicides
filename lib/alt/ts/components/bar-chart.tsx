import * as React from 'react'
import {Node} from '../lib/eventer'
import * as d3 from 'd3'
import Constants from "../initializers/constants";
import * as _ from 'lodash';
import {normalizeBarData} from '../services/normalizer'
import * as RD3 from 'react-d3-basic'

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

  detectChartProp(props) {
    let {split, table} = props;
    if (split == 'area') {
      return Constants.areaBarProps;
    } else if (split == 'gender') {
      return Constants.genderBarProps
    }

    return Constants.barProps;
  }

  get sectionClass() {
    return 'bar-chart section'
  }

  detectColor(chartSeries, props) {
    chartSeries.map((c, i)=> c.color = Constants.normalColor(i))
  }

  writeChart(normalized, max = 0) {
    let {dataList, chartSeries} = normalized;
    this.detectColor(chartSeries, this.props);
    return <RD3.BarStackChart
      data={dataList}
      chartSeries={chartSeries}
      x={(d)=>d.year}
      xScale='ordinal'
      yTickFormat={d3.format(".2s")}
      yLabel={'人数'}
      xLabel={'平成年'}
      yDomain= {[0, max]}
      yLabelPosition={"right"}
      {...this.detectChartProp(this.props)}
    />;
  }


  writeCharts(normalizedList) {
    let {max, results} = normalizedList;
    console.log(max)
    return _.map(results, (normalized)=> {
      return <section key={normalized.title} className={this.sectionClass}>
        <h1>{normalized.title}</h1>
        {this.writeChart(normalized, max)}
      </section>
    });
  }

  render() {
    return <section className="bar-chart">
      {this.writeCharts(this.state.normalized)}
    </section>
  }
}
