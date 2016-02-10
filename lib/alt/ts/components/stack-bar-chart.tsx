import * as React from 'react'
import {Node} from '../lib/eventer'
import * as d3 from 'd3'
import Constants from "../initializers/constants";
import * as _ from 'lodash';
import * as RD3 from 'react-d3-basic'
import RotatedDataTable from "./data-table";
import ChartSet from "../models/chart-set";
import Fa from '../lib/fa'

export default class StackBarChartComponent extends Node<{},{}> {
  get autoScale():boolean {
    let {autoScale} = this.props.location.query;
    return autoScale && autoScale != 'false'
  }

  get par():boolean {
    let {par} = this.props.location.query;
    return par && par != 'false'
  }

  domain(max?:number) {
    if (this.par) {
      return this.autoScale ? null : [0, 100];
    }

    return !max || this.autoScale ? null : [0, max];
  }

  arrangeChartProp(data) {
    let defaultProps = Constants.barProps;
    let minWidth = data.length * 90;
    defaultProps.width < minWidth && (defaultProps.width = minWidth)
    return defaultProps;
  }

  arrangeSeries(series, parSeries) {
    let using = this.par ? parSeries : series;
    return using;
  }

  writeChart(chartSet:ChartSet, max?:number) {
    let {series, parSeries, data} = chartSet;
    let usingSeries = this.arrangeSeries(series, parSeries);
    return <div className="chart-list stack-bar-chart">
      <RD3.BarStackChart
        data={data}
        chartSeries={usingSeries}
        x={(d)=> d.sort}
        xScale='ordinal'
        yTickFormat={d3.format(".2s")}
        yDomain={this.domain(max)}
        {...this.arrangeChartProp(data)}
      />
    </div>;
  }

  writeTable(table) {
    return <div className="chart-list data-table-container">
      <RotatedDataTable {...{table}} />
    </div>
  }

  detectMax(tableListList) {
    let max = 0;
    _.each(tableListList, ({tables})=> {
      _.each(tables, ({table})=> {
        table.max > max && (max = table.max);
      });
    });
    return max;
  }

  writeTables(tableList, max) {
    return _.map(tableList, ({table, chart})=> {
      return <section className="chart-list chart-block" key={`block-${table.title}`}>
        <h1>{table.title}</h1>
        {this.writeChart(chart, max)}
        {this.writeTable(table)}
      </section>
    });
  }

  render() {
    let {tableListList} = this.props;
    if (!tableListList || !tableListList.length || _.isString(tableListList)) {
      return <article className="chart-list body">
        <div className="loading">
          <Fa icon="spinner" animation='pulse'/>
          loading...
        </div>
      </article>
    }
    let max = this.detectMax(tableListList);
    return <div>
      <article className="chart-list body">
        {tableListList.map(({title, tables})=> {
          return <section className="chart-list chart-line" key={`line-${title}`}>
            <h1 className="chart-list chart-title">{title}</h1>
            {this.writeTables(tables, max)}
          </section>
          })
          }
      </article>
    </div>
  }
}
