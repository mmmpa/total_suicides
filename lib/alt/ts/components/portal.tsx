import * as React from 'react'
import {Node} from '../lib/eventer'
import * as _ from 'lodash';
import Fa from '../lib/fa'
import ChartFinder from "./v2/chart-finder";
import {ChartSelector} from '../services/selector-writer'

interface P {
  indexSrc:string
}

export default class PortalComponent extends Node<P,{}> {
  link(uri, query) {
    this.dispatch('link', uri, query);
  }

  componentDidMount() {
    this.dispatch('title');
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
      <section className="v2-chart chart-starter">
        <h1 className="v2-chart starter-title">
          <Fa icon="bar-chart"/>
          チャートを表示する
        </h1>
        <ChartSelector/>
      </section>
      <div dangerouslySetInnerHTML={{__html: this.props.indexSrc}}></div>
    </div>
  }
}