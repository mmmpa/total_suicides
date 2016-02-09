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
    let {base, table, x, y} = props.params;
    let tableKeys = _.map(Constants.tables, ({key})=> key);
    let metaKeys = _.map(Constants.metas, ({key})=> key);
    this.state = {base, table, x, y, tableKeys, metaKeys};
  }

  detectIcon(split) {
    return split == 'gender' ? <Fa icon="venus-mars"/> : <Fa icon="globe"/>
  }

  isTable(target) {
    return _.includes(this.state.tableKeys, target);
  }

  selectableKeys(target) {
    let {table, x, y} = this.state;
    let all = [].concat(Constants.metas, Constants.tables);
    switch (target) {
      case 'table':
        return all;
      case 'x':
        let selectable = this.isTable(table) ? Constants.metas : all;
        return _.filter(selectable, ({key})=> key != table)
      case `y`:
        let selectable = this.isTable(table) || this.isTable(x) ? Constants.metas : all;
        return _.filter(selectable, ({key})=> key != table && key != x)
      default:
        return all;
    }
  }

  change(target, key) {
    let {state} = this;
    state[target] = key;
    this.setState(state);
  }

  find() {
    let {table, x, y, metaKeys} = this.state;
    let meta = _.without(metaKeys, table, x, y);
    let base = !meta.length ? 'total' : meta[0];
    let query = {};

    switch (base) {
      case 'year':
        query.year = 26;
        break;
      case 'area':
        query.area = 0;
        break;
      case 'gender':
        query.gender = 0;
        break;
    }

    switch (table) {
      case 'year':
        query.year = 26;
        break;
      case 'gender':
        query.gender = '1,2';
        break;
    }

    let uri = ['/chart', base, table, x, y].join('/');
    this.dispatch('link', uri, query);
  }

  writeAllSelector(target:string, placeholder:string, suffix = '') {
    let selectable = this.selectableKeys(target);
    return <select className="chart-finder selector" key={`${target}list`} defaultValue={this.state[target]} onChange={(e)=> this.change(target, e.target.value)}>
      <option name={target} value={'none'} key={`${target}-default`} className="placeholder">{placeholder}</option>
      {
        _.map(selectable, ({key, name})=>{
          return <option name={target} value={key} key={`${target}-${key}`}>{name}{suffix}</option>
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
    return this.writeAllSelector('y', '分割しない', 'で分割');
  }

  render() {
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
            <button className="chart-finder submit" onClick={()=>this.find()}>
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