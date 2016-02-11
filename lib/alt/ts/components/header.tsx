import * as React from 'react'
import {Node} from '../lib/eventer'
import * as _ from 'lodash';

import Fa from '../lib/fa'

export default class HeaderComponent extends Node<{},{}> {
  render() {
    return <div>
      <section className="header body">
        <h1 className="header title">
          <a onClick={()=> this.dispatch('link', '/')}>
            <Fa icon="heart"/>
            自殺を知る、自殺を考える
          </a>
        </h1>
      </section>
    </div>
  }
}

