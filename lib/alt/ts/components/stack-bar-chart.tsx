import * as React from 'react'
import {Node} from '../lib/eventer'
import * as d3 from 'd3'
import Constants from "../initializers/constants";
import * as _ from 'lodash';
import {normalizeStackBarData} from '../services/normalizer'
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
    let normalized = normalizeStackBarData(props);
    this.setState({normalized});
  }

  detectChartProp(dataList) {
    let defaultProps = Constants.barProps;
    let minWidth = dataList.length * 70;
    defaultProps.width < minWidth && (defaultProps.width = minWidth)
    return defaultProps;
  }

  get sectionClass() {
    return 'bar-chart section'
  }

  get autoScale():boolean {
    let {autoScale} = this.props.location.query;
    return autoScale && autoScale != 'false'
  }

  domain(max) {
    return this.autoScale ? null : [0, max];
  }

  detectColor(chartSeries, props) {
    chartSeries.map((c, i)=> c.color = Constants.normalColor(i))
  }

  writeChart(chartSeries, chartData, max = 10000) {
    let {data} = chartData;
    let dataList = _.map(data, (value)=> value);
    return <RD3.BarStackChart
      data={dataList}
      chartSeries={chartSeries}
      x={(d)=>d.sort.name}
      xScale='ordinal'
      yTickFormat={d3.format(".2s")}
      yLabel={'人数'}
      xLabel={'平成年'}
      yDomain={this.domain(max)}
      yLabelPosition={"right"}
      {...this.detectChartProp(dataList)}
    />;
  }


  writeCharts(normalized) {
    let {chartSeries, chart, max} = normalized;
    if (!chart) {
      return null;
    }
    this.detectColor(chartSeries, this.props);
    return _.map(chart, (chartData)=> {
      return <section key={chartData.title} className={this.sectionClass}>
        <h1>{chartData.title}</h1>
        {this.writeChart(chartSeries, chartData, max)}
      </section>
    });
  }

  render() {
    return <div>
      <article className="bar-chart body">
        <section className="bar-chart">
          {this.writeCharts(this.state.normalized)}
        </section>
      </article>
    </div>
  }
}

