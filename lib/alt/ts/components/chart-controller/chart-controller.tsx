import * as React from 'react'
import {Node} from '../../lib/eventer'
import Constants from "../../initializers/constants";
import * as _ from 'lodash';
import AreaSelector from './area-selector'
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
      <ChartConfiguration {...this.props}/>
      {this.writeSelector(this.props)}
      <article className="chart-content">
        {React.cloneElement(this.props.children || <div>blank</div>, this.props || {})}
      </article>
    </div>
  }
}