import * as React from 'react'
import {Node} from '../../lib/eventer'
import Constants from "../../initializers/constants";
import * as _ from 'lodash';
import AreaSelector from './area-selector'
import YearSelector from './year-selector'
import GenderSelector from './gender-selector'
import ChartConfiguration from './chart-configuration'

export default class ChartControllerComponent extends Node<{},{}> {
  writeSelector(props) {
    let {split, table, sort} = props;
    let used:string[] = [split, table, sort]
    if (_.includes(used, 'area')) {
      return <AreaSelector {...props}/>
    }
    return null;
  }

  render() {
    return <div>
      <section className="chart-controller">
        <h1 className="chart-controller title">
          表示内容の絞りこみ
          <em>（チェックがない場合は、すべて選択されているあつかいになります）</em>
        </h1>
        <YearSelector {...this.props}/>
        <GenderSelector {...this.props}/>
        <AreaSelector {...this.props}/>
      </section>
      <ChartConfiguration {...this.props}/>
      <article className="chart-content">
        {React.cloneElement(this.props.children || <div>blank</div>, this.props || {})}
      </article>
    </div>
  }
}
