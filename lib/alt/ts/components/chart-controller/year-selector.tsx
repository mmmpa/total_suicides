import * as React from 'react'
import {Node} from '../../lib/eventer'
import Constants from "../../initializers/constants";
import * as _ from 'lodash';

export default class YearSelectorComponent extends Node<{},{}> {
  isChecked(key:number):boolean {
    return _.includes(this.selected, key);
  }

  get selected() {
    let {year} = this.props.location.query;
    if (!year) {
      return [];
    }
    return year.split(',').map((n)=> +n)
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

  render() {
    return <div>
      <section className="selector-area year-selector body">
        <section className="year-selector year-list">
          {_.map(Constants.years, ({key, name})=>{
            return <div key={`year-selector-${key}`}>
              <label>
                <span className="input-input">
                  <input type="checkbox" name="year" checked={this.isChecked(key)} onClick={()=> this.toggle(key)}/>
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

