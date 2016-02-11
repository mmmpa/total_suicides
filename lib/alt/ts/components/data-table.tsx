import * as React from 'react'
import {Node} from '../lib/eventer'
import Table from "../models/table";

interface P {
  table:Table,
  par:boolean
}

export default class RotatedDataTable extends Node<P,{}> {
  render() {
    let {table, par} = this.props;
    let sortedKeys = table.column;
    return <section key={table.title}>
      <table className="data-table rotated-data-table">
        <thead>
          <tr>
            <th key={-1}>-</th>
            {
              _.map(table.rowTitle, (title, i)=>{
                return <th className="rotated-data-table row-title" key={i}>{title}</th>
                })
              }
          </tr>
        </thead>
        <tbody>
          {
            _.map(sortedKeys, (key, i)=>{
              return <tr key={table.column[i]}>
                <td className="rotated-data-table column-title" key={-1}>{table.column[i]}</td>
                {
                  _.map(table.row, (row, ii)=>{
                    let value = row[i].value
                    return <td className="rotated-data-table row-content" key={ii}>{par ? value.par + '%' : value.number}</td>
                    })
                  }
              </tr>
              }).reverse()
            }
        </tbody>
      </table>
    </section>
  }
}
