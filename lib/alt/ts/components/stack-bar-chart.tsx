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
    this.normalizeState(nextProps, this.props)
  }

  normalizeState(props, preProps?) {
    if(preProps && props.data == preProps.data){
      return;
    }
    let normalized = normalizeStackBarData(props);
    this.setState({normalized});
  }

  detectChartProp(dataList) {
    let defaultProps = Constants.barProps;
    let minWidth = dataList.length * 100;
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
    chartSeries.map((c, i)=> c.color = Constants.normalColor(c.field - 1))
  }

  detectSeries(chartSeries, props) {
    return chartSeries.map((c)=> {
      let series = {}
      _.each(c, (v, k)=>{
        series[k] = k == 'field' ? v + 'par' : v;
      })
      return series;
    });
  }

  writeChartSection(normalized) {
    let {chartSeries, dataList, max} = normalized;
    if (!dataList) {
      return null;
    }
    this.detectColor(chartSeries, this.props);
    //console.log(chartSeries = this.detectSeries(chartSeries, this.props));
    return _.map(dataList, (chartData)=> {
      return <section key={chartData.title} className="chart-list chart-section">
        <h1>{chartData.title}</h1>
        {this.writeCharts(chartSeries, chartData.chartList, max)}
      </section>
    });
  }

  writeCharts(chartSeries, chartList, max) {
    return _.map(chartList, (chartData)=> {
      return <section key={chartData.title} className="chart-list chart-block">
        <h1>{chartData.name}</h1>
        {this.writeChart(chartSeries, chartData.data, max)}
      </section>
    });
  }

  writeChart(chartSeries, chartData, max = 10000) {
    return <RD3.BarStackChart
      data={chartData}
      chartSeries={chartSeries}
      x={(d)=>d.sort.name}
      xScale='ordinal'
      yTickFormat={d3.format(".2s")}
      yLabel={'人数'}
      xLabel={'平成年'}
      yDomain={this.domain(max)}
      yLabelPosition={"right"}
      {...this.detectChartProp(chartData)}
    />;
  }

  render() {
    return <div>
      <article className="chart-list body">
        {this.writeChartSection(this.state.normalized)}
      </article>
    </div>
  }
}

