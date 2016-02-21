import * as React from 'react'
import {Node} from '../lib/eventer'
import * as _ from 'lodash';

import Header from '../components/header'
import Copyright from '../components/copyright'

interface P{
  children:any,
  location:any
}

export default class CommonComponent extends Node<P,{}> {
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
      <article className="main-content">
        {this.children}
      </article>
      <Copyright />
    </div>
  }
}
