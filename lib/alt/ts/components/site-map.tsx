import * as React from 'react'
import {Node} from '../lib/eventer'
import * as d3 from 'd3'
import Constants from "../initializers/constants";
import * as _ from 'lodash';
import {normalizeBarData} from '../services/normalizer'
import * as RD3 from 'react-d3-basic'
import AreaSelector from './area-selector'
import Fa from '../lib/fa'

export default class SiteMapComponent extends Node<{},{}> {
  link(e:any) {
    e.preventDefault();
    this.dispatch('link', e.currentTarget.getAttribute('href'));
  }

  writeLinks() {
    let splits = [
      {key: 'gender', text: '性別'},
      {key: 'area', text: '地域'}
    ];
    let tables = [
      {key: 'age', text: '年齢層'},
      {key: 'housemate', text: '同居人の有無'},
      {key: 'job', text: '職業'},
      {key: 'location', text: '場所'},
      {key: 'way', text: '手段'},
      {key: 'hour', text: '時間帯'},
      {key: 'day', text: '曜日'},
      {key: 'reason', text: '原因・動機'},
      {key: 'attempted', text: '未遂歴'},
      {key: 'total', text: '総数'},
    ]

    let link = this.link.bind(this);

    return tables.map((table)=> {
      return <section className="site-map sub-section" key={table.key}>
        {
          splits.map((split)=>{
            return <section className="site-map link-set" key={split.key}>
              <Fa icon="bar-chart"/>
              <span className="site-map main-link">
                <a href={`/bar/${table.key}/${split.key}/-`} onClick={link}>
                  <span className="site-map split">{`${split.text}::`}</span>
                  {`${table.text}`}
                </a>
              </span>
              <span className="site-map sub-link">
                (<a href={`/bar/${split.key}/${table.key}/-`} onClick={link}>{`${split.text}別表`}</a>)
              </span>
            </section>
            })
          }
      </section>
    })
  }

  render() {
    let link = this.link.bind(this);
    return <div>
      <article className="site-map body">
        <section className="site-map section">
          <h1 className="site-map section-title">年ごとの遷移</h1>
          {this.writeLinks()}
        </section>
      </article>
    </div>
  }
}