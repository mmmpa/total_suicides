import * as React from 'react'
import {Node} from '../lib/eventer'
import Table from "../models/table";


interface P {
  table:Table
}

export default class RotatedDataTable extends Node<P,{}> {
  render() {
    let {table, par} = this.props;
    let sortedKeys = _.map(table.column, (_, key)=> key);
    return <section>
      <table className="data-table rotated-data-table">
        <thead>
          <tr>
            <th>-</th>
            {
              _.map(table.rowTitle, (title, i)=>{
                return <th className="rotated-data-table row-title" key={i}>{title}</th>
                })
              }
          </tr>
        </thead>
        <tbody>
          {
            _.map(sortedKeys.reverse(), (key, i)=>{
              return <tr key={table.column[key].key}>
                <td className="rotated-data-table column-title" key={-1}>{table.column[key].name}</td>
                {
                  _.map(table.row, (row, i)=>{
                    return <td className="rotated-data-table row-content" key={i}>{par ? row[key].par + '%' : row[key].number}</td>
                    })
                  }
              </tr>
              })
            }
        </tbody>
      </table>
    </section>
  }
}
