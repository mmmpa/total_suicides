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

export default class CommonComponent extends Node<{},{}> {
  render(){
    return <div className="global-wrapper">
      <header className="global-header">
        <Header />
      </header>
      <article className="main-content">
        {React.cloneElement(this.props.children || <div>blank</div>, this.props || {})}
      </article>
      <footer className="global-footer">
        <SiteMap />
        <Copyright />
      </footer>
    </div>
  }
}