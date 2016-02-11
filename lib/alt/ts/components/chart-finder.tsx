import * as React from 'react'
import {Node} from '../lib/eventer'
import {tableKeys, metaKeys, areaKeys, yearKeys, metas, tables} from "../initializers/constants";

import * as _ from 'lodash';
import Fa from '../lib/fa'

interface S {
  base:string,
  table:string,
  x:string,
  y:string
}

interface P {
  location:any
}

export default class ChartFinderComponent extends Node<P,S> {
  constructor(props) {
    super(props);
    let {base, table, x, y} = props.params;
    this.state = {base, table, x, y};
  }

  detectIcon(split) {
    return split == 'gender' ? <Fa icon="venus-mars"/> : <Fa icon="globe"/>
  }

  isTable(target) {
    return _.includes(tableKeys, target);
  }

  selectableKeys(target) {
    let {table, x, y} = this.state;
    let all = [metas, tables];
    switch (target) {
      case 'table':
        return all;
      case 'x':
        if (this.isTable(table)) {
          return [metas, []]
        } else {
          return [_.filter(metas, ({key})=> key != table), tables]
        }
      case `y`:
        if (this.isTable(table) || this.isTable(x)) {
          return [_.filter(metas, ({key})=> key != table && key != x), []]
        } else {
          return [_.filter(metas, ({key})=> key != table && key != x), tables]
        }
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
    let [table, x, y] = _.map(['table', 'x', 'y'], (target)=> {
      return (this.refs[target] as HTMLInputElement).value;
    });
    let meta = _.without(metaKeys, table, x, y);
    let base = !meta.length ? 'total' : _.includes(meta, 'year') ? 'year' : meta[0];
    let {query} = this.props.location;

    let loading = [table, x, y];

    if (_.includes(loading, 'year')) {
      query.year = query.year || yearKeys.join(',');
    }

    if (_.includes(loading, 'gender')) {
      if (query.gender) {
        query.gender == '0' && (query.gender = '1,2')
      } else {
        query.gender = '1,2';
      }
    }

    if (_.includes(loading, 'area')) {
      let areas = _.without(areaKeys, 0).join(',');
      if (query.area) {
        query.area == '0' && (query.area = areas)
      } else {
        query.area = areas;
      }
    }

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

    this.dispatch('chart:find', base, table, x, y, query);
  }

  writeAllSelector(target:string, placeholder:string, suffix = '') {
    let selectable = this.selectableKeys(target);
    let labels = ['大分類', '詳細'];
    return <select className="chart-finder selector"
                   ref={target}
                   key={`${target}list`}
                   value={this.state[target]}
                   onChange={(e)=> this.change(target, (e.target as HTMLInputElement).value)}>
      <option className="placeholder"
              name={target}
              value={'none'}
              key={`${target}-default`}>
        {placeholder}
      </option>
      {
        _.map(selectable, (group, i)=>{
          return <optgroup key={`finder-group-${i}`} label={labels[i]}>
            {_.map(group, ({key, name})=>{
              return <option name={target} value={key} key={`${target}-${key}`}>
                {name}{suffix}
              </option>
              })
              }
          </optgroup>
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