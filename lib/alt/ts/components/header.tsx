import * as React from 'react'
import {Node} from '../lib/eventer'
import * as d3 from 'd3'
import Constants from "../initializers/constants";
import * as _ from 'lodash';
import {normalizeBarData} from '../services/normalizer'
import * as RD3 from 'react-d3-basic'
import AreaSelector from './area-selector'
import Fa from '../lib/fa'

export default class HeaderComponent extends Node<{},{}> {
  render(){
    return <div>
      <section className="header body">
        <h1 className="header title">自殺を知る、自殺を考える</h1>
        <h2 className="header navigator">
          <Fa icon="navicon"/>
          <a onClick={()=> this.dispatch('link:navigator')}>チャート一覧</a></h2>
      </section>
    </div>
  }
}
