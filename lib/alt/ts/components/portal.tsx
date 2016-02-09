import * as React from 'react'
import {Node} from '../lib/eventer'
import Constants from "../initializers/constants";
import * as _ from 'lodash';
import Fa from '../lib/fa'

export default class PortalComponent extends Node<{},{}> {
  link(uri){
    this.dispatch('link', uri, null);
  }

  componentDidMount() {
    _.each(document.querySelectorAll('#raw a'), (a)=> {
      a.addEventListener('click', (e)=> {
        e.preventDefault();
        this.link(e.target.href);
      });
    });
  }

  render() {
    return <div id="raw">
      <div dangerouslySetInnerHTML={{__html: this.props.indexSrc}}></div>
    </div>
  }
}