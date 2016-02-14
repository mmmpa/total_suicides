import * as React from 'react';
import {Node} from '../../lib/eventer';
import * as d3 from 'd3';
import * as c3 from 'c3';
import * as _ from 'lodash';
import * as RD3 from 'react-d3-basic';
import RotatedDataTable from "../data-table";
import ChartSet from "../../models/chart-set";
import Fa from '../../lib/fa';
import {ITableList, ITableSet} from "../../services/normalizer";
import {generateBarProps} from "../../initializers/constants";

interface P{
  par:boolean,
  autoScale:boolean,
  tableListList:ITableList[],
  base:string,
  table:string,
  x:string,
  y:string,
}

export default class ChartComponent extends Node<P,{}> {
  get autoScale():boolean{
    return this.props.autoScale;
  }

  get par():boolean{
    return this.props.par;
  }

  get keyBase():string{
    let {base, table, x, y} = this.props;
    return [base, table, x, y].join('-')
  }

  domain(max?:number) {
    if (this.par) {
      return this.autoScale ? null : [0, 100];
    }

    return !max || this.autoScale ? null : [0, max];
  }

  arrangeChartProp(data) {
    let defaultProps = generateBarProps();
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
    var chart = c3.generate({
      bindto: '#chart',
      data: {
        columns: [
          ['data1', 30, 200, 100, 400, 150, 250],
          ['data2', 50, 20, 10, 40, 15, 25]
        ]
      }
    });
    return <div id="chart" className="chart-list stack-bar-chart">
    </div>;
  }

  writeTable(table) {
    let {par} = this.props;
    return <div className="chart-list data-table-container">
      <RotatedDataTable {...{table, par}} />
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

  writeTables(tableList:ITableSet[], max) {
    return _.map(tableList, ({table, chart})=> {
      return <section className="chart-list chart-block" key={`block-${table.title}`}>
        <h1>{table.title}</h1>
        {this.writeChart(chart, max)}
        {this.writeTable(table)}
      </section>
    });
  }

  componentDidMount(){
    var chart = c3.generate({
      bindto: '#chart',
      data: {
        columns: [
          ['data1', 30, 200, 100, 400, 150, 250],
          ['data2', 50, 20, 10, 40, 15, 25]
        ]
      }
    });
  }

  render() {
    return <div id="chart" className="chart-list stack-bar-chart">
    </div>;
  }
}
