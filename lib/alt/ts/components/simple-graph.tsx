import * as React from 'react'
import {Node} from '../lib/eventer'
import * as D3 from 'react-d3'

export default class SimpleGraph extends Node<{},{}> {
  componentDidMount() {

  }

  render() {
    let chartData = [
      {
        name: "series1",
        values: [{x: 0, y: 20}, {x: 24, y: 10}],
        strokeWidth: 3,
        strokeDashArray: "5,5",
      },
      {
        name: "series2",
        values: [{x: 70, y: 82}, {x: 76, y: 82}]
      }
    ];

    let width = 700,
      height = 300,
      margins = {left: 100, right: 100, top: 50, bottom: 50},
      title = "User sample",
    // chart series,
    // field: is what field your data want to be selected
    // name: the name of the field that display in legend
    // color: what color is the line
      chartSeries = [
        {
          field: 'BMI',
          name: 'BMI',
          color: '#ff7f0e'
        }
      ],
    // your x accessor
      x = function (d) {
        return d.index;
      }
    return <D3.LineChart
      legend={true}
      data={chartData}
      width={1000}
      height={400}
      viewBoxObject={{
    x: 0,
    y: 0,
    width: 500,
    height: 400
  }}
      title="Line Chart"
      yAxisLabel="Altitude"
      xAxisLabel="Elapsed Time (sec)"
      gridHorizontal={true}
    />
  }
}
