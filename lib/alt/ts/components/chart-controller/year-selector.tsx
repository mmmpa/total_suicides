import * as React from 'react'
import {Node} from '../../lib/eventer'
import {years} from "../../initializers/constants";
import * as _ from 'lodash';
import Fa from "../../lib/fa";

interface P{
  selected:number[]
}

export default class YearSelectorComponent extends Node<P,{}> {
  isChecked(key:number):boolean {
    return _.includes(this.selected, key);
  }

  get selected() {
    return this.props.selected;
  }

  toggle(key:number) {
    let now = this.selected;
    if (this.isChecked(key)) {
      now = _.without(now, key);
    } else {
      now.push(key)
    }
    this.dispatch('chart:year', now);
  }

  selectAll() {
    this.dispatch('chart:year', _.map(years, ({key})=> key));
  }

  deselectAll() {
    this.dispatch('chart:year', []);
  }

  render() {
    return <div>
      <section className="selector-area year-selector body">
        <h1 className="selector-area title">
          <Fa icon="calendar"/>
          年度
        </h1>
        <div className="selector-area select-all">
          <p>
            <Fa icon="check"/>
            <a onClick={()=> this.selectAll()}>選択</a>
          </p>
          <p>
            <Fa icon="trash"/>
            <a onClick={()=> this.deselectAll()}>解除</a>
          </p>
        </div>
        <section className="selector-area selector-list">
          {_.map(years, ({key, name})=>{
            return <div key={`year-selector-${key}`}>
              <label>
                <span className="input-input">
                  <input type="checkbox" name="year" checked={this.isChecked(key)} onChange={()=> this.toggle(key)}/>
                </span>
                <span className="input-label">{name}</span>
              </label>
            </div>
            })}
        </section>
      </section>
    </div>
  }
}
