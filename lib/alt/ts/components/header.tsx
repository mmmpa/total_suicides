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
  render() {
    return <div>
      <section className="header body">
        <h1 className="header title">
          <a onClick={()=> this.dispatch('link:navigator')}>
            <Fa icon="heart"/>
            自殺を知る、自殺を考える
          </a>
        </h1>
      </section>
    </div>
  }
}

