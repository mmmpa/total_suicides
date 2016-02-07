import * as React from 'react'
import {Node} from '../lib/eventer'
import * as d3 from 'd3'
import Constants from "../initializers/constants";
import * as _ from 'lodash';
import * as RD3 from 'react-d3-basic'
import RotatedDataTable from "./data-table";
import ChartSet from "../models/chart-set";

export default class StackBarChartComponent extends Node<{},{}> {
  get autoScale():boolean {
    let {autoScale} = this.props.location.query;
    return autoScale && autoScale != 'false'
  }

  domain(max?:number) {
    return !max || this.autoScale ? null : [0, max];
  }

  arrangeChartProp(data) {
    let defaultProps = Constants.barProps;
    let minWidth = data.length * 100;
    defaultProps.width < minWidth && (defaultProps.width = minWidth)
    return defaultProps;
  }

  arrangeSeries(series, parSeries) {
    return _.map(series, ({field, name})=> {
      let color = Constants.normalColor(field - 1);
      return {field, name, color};
    })
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
      _.each(tables, (table)=> {
        table.max > max && (max = table.max);
      });
    });
    return max;
  }

  writeTables(tableList) {
    return _.map(tableList, (table)=>{
      return <section key={table.title}>
        <h1>{table.title}</h1>
        {this.writeTable(table)}
      </section>
    });
      //this.writeChart(d.chartSet, max)
  }

  render() {
    let {tableListList} = this.props;
    if (!tableListList || tableListList.length == 0) {
      return <div>null</div>
    }
    let max = this.detectMax(tableListList);
    return <div>
      <article className="chart-list body">
        {tableListList.map(({title, tables})=> {
          return <section className="chart-list chart-block" key={title}>
            <h1 className="chart-list chart-title">{title}</h1>
            {this.writeTables(tables)}
          </section>
          })
          }
      </article>
    </div>
  }
}
