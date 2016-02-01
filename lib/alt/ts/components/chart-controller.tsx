import * as React from 'react'
import {Node} from '../lib/eventer'
import * as d3 from 'd3'
import Constants from "../initializers/constants";
import * as _ from 'lodash';
import {normalizeBarData} from '../services/normalizer'
import * as RD3 from 'react-d3-basic'
import AreaSelector from './area-selector'
import ChartConfiguration from './chart-configuration'

export default class ChartControllerComponent extends Node<{},{}> {
  writeSelector(props) {
    let {split, table} = props;
    if (split == 'area' || table == 'area') {
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

