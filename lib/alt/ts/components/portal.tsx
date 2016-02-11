import * as React from 'react'
import {Node} from '../lib/eventer'
import * as _ from 'lodash';
import Fa from '../lib/fa'

interface P{
  indexSrc:string
}

export default class PortalComponent extends Node<P,{}> {
  link(uri, query){
    this.dispatch('link', uri, query);
  }

  componentDidMount() {
    this.dispatch('title')
    _.each(document.querySelectorAll('#raw .inner-link a'), (a)=> {
      a.addEventListener('click', (e)=> {
        e.preventDefault();
        let anchor = e.target as HTMLAnchorElement;
        this.link(anchor.href.replace(/.+?:\/\/.+?\//, '/'), {});
      });
    });
  }

  render() {
    return <div id="raw">
      <div dangerouslySetInnerHTML={{__html: this.props.indexSrc}}></div>
    </div>
  }
}