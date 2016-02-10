import * as React from 'react'
import {Node} from '../lib/eventer'
import * as d3 from 'd3'
import Constants from "../initializers/constants";
import * as _ from 'lodash';
import {normalizeBarData} from '../services/normalizer'
import * as RD3 from 'react-d3-basic'
import AreaSelector from './area-selector'
import SiteMap from '../components/site-map'
import Header from '../components/header'
import Copyright from '../components/copyright'
import ChartFinder from '../components/chart-finder'

export default class CommonComponent extends Node<{},{}> {
  get children(){
    let props = _.merge(_.clone(this.props), this.state);
    delete props.children;
    return React.cloneElement(this.props.children || <div>blank</div>, props || {})
  }

  render() {
    return <div className="global-wrapper">
      <header className="global-header">
        <Header />
      </header>
      <ChartFinder {...this.props}/>
      <article className="main-content">
        {this.children}
      </article>
      <SiteMap {...this.props} />
      <ChartFinder {...this.props} />
      <Copyright />
    </div>
  }
}
