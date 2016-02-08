import * as React from 'react'
import {Node} from '../lib/eventer'
import * as d3 from 'd3'
import Constants from "../initializers/constants";
import * as _ from 'lodash';
import {normalizeBarData} from '../services/normalizer'
import * as RD3 from 'react-d3-basic'
import AreaSelector from './area-selector'
import Fa from '../lib/fa'

export default class ChartFinderComponent extends Node<{},{}> {
  constructor(props) {
    console.log(props)
    let {base, table, x, y} = props.params;
    this.state = {base, table, x, y};
  }

  link(e:any) {
    e.preventDefault();
    this.dispatch('link', e.currentTarget.getAttribute('href'));
  }

  detectIcon(split) {
    return split == 'gender' ? <Fa icon="venus-mars"/> : <Fa icon="globe"/>
  }

  writeAllSelector(target:string, placeholder:string, used:string[] = []) {
    let all = [].concat(Constants.metas, Constants.tables);
    return <select className="chart-finder selector" key={`${target}list`} defaultValue={this.state[target]}>
      <option name={target} value={null} key={`${target}-default`} className="placeholder">{placeholder}</option>
      {
        _.map(all, ({key, name})=>{
          return <option name={target} value={key} key={`${target}-${key}`}>{name}</option>
          })
        }
    </select>
  }


  writeYSelector() {
    return this.writeAllSelector('table', '（表の縦軸）');
  }

  writeXSelector() {
    return this.writeAllSelector('x', '（表の横軸）');
  }

  writeYSplitter() {
    return this.writeAllSelector('y', '（縦軸の分割 - オプション）');
  }

  render() {
    let link = this.link.bind(this);
    return <div>
      <article className="chart-finder body">
        <section className="chart-finder section">
          <Fa icon="arrows-v"/>
          <div className="chart-finder section-input">
            {this.writeYSelector()}
          </div>
          <div className="chart-finder section-suffix">の自殺者数を</div>
        </section>
        <section className="chart-finder section">
          <Fa icon="arrows-h"/>
          <div className="chart-finder section-input">
            {this.writeXSelector()}
          </div>
          <div className="chart-finder section-suffix">で並べて</div>
        </section>
        <section className="chart-finder section">
          <div className="chart-finder section-input">
            <button className="chart-finder submit">
              <Fa icon="bar-chart"/>
              表示する
            </button>
          </div>
        </section>
        <section className="chart-finder section">
          <Fa icon="ellipsis-v"/>
          <div className="chart-finder section-input">
            {this.writeYSplitter()}
          </div>
        </section>
      </article>
    </div>
  }
}