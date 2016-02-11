import * as React from 'react'
import {Node} from '../../lib/eventer'
import * as _ from 'lodash';
import AreaSelector from './area-selector'
import YearSelector from './year-selector'
import GenderSelector from './gender-selector'
import ChartConfiguration from './chart-configuration'

interface P{
  year:number[],
  area:number[],
  gender:number[],
  par:boolean,
  autoScale:boolean,
  tableListList:any[],
  base:string,
  table:string,
  x:string,
  y:string,
  children:any
}

export default class ChartControllerComponent extends Node<P,{}> {
  render() {
    let {year, area, gender, par, autoScale, tableListList, base, table, x, y} = this.props;
    return <div>
      <section className="chart-controller">
        <h1 className="chart-controller title">
          表示内容の絞りこみ
          <em>（チェックがない場合は、すべて選択されているあつかいになります）</em>
        </h1>
        <YearSelector selected={year}/>
        <GenderSelector selected={gender}/>
        <AreaSelector selected={area}/>
      </section>
      <ChartConfiguration {...{par, autoScale}}/>
      <article className="chart-content">
        {React.cloneElement(this.props.children || <div>blank</div>, {par, autoScale, tableListList, base, table, x, y})}
      </article>
    </div>
  }
}
