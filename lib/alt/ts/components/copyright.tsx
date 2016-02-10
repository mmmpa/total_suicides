import * as React from 'react'
import {Node} from '../lib/eventer'
import * as d3 from 'd3'
import Constants from "../initializers/constants";
import * as _ from 'lodash';
import {normalizeBarData} from '../services/normalizer'
import * as RD3 from 'react-d3-basic'
import AreaSelector from './area-selector'
import Fa from "../lib/fa";

export default class CopyrightComponent extends Node<{},{}> {
  render() {

    return <div>
      <section className="copyright body">
        <address>
          ご質問、ご要望などは
          <a href="http://twitter.com/o296sm">
            <Fa icon="twitter"/>
            o296sm
          </a>
          もしくは
          <a href="http://github.com/mmmpa">
            <Fa icon="github"/>
            mmmpa
          </a>
          まで
        </address>
      </section>
    </div>
  }
}
