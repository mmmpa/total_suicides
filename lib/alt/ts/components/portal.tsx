import * as React from 'react'
import {Node} from '../lib/eventer'
import Constants from "../initializers/constants";
import * as _ from 'lodash';
import Fa from '../lib/fa'

interface P{
  indexSrc:string
}

export default class PortalComponent extends Node<P,{}> {
  link(uri){
    this.dispatch('link', uri, null);
  }

  componentDidMount() {
    this.dispatch('title')
    _.each(document.querySelectorAll('#raw .inner-link a'), (a)=> {
      a.addEventListener('click', (e)=> {
        e.preventDefault();
        this.link((e.target as HTMLAnchorElement).href);
      });
    });
  }

  render() {
    return <div id="raw">
      <div dangerouslySetInnerHTML={{__html: this.props.indexSrc}}></div>
    </div>
  }
}