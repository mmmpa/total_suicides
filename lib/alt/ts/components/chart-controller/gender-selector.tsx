import * as React from 'react'
import {Node} from '../../lib/eventer'
import Constants from "../../initializers/constants";
import * as _ from 'lodash';

export default class GenderSelectorComponent extends Node<{},{}> {
  isChecked(key:number):boolean {
    return _.includes(this.selected, key);
  }

  get selected() {
    let {gender} = this.props.location.query;
    if (!gender) {
      return [];
    }
    return gender.split(',').map((n)=> +n)
  }

  toggle(key:number) {
    let now = this.selected;
    if (this.isChecked(key)) {
      now = _.without(now, key);
    } else {
      now.push(key)
    }
    this.dispatch('chart:gender', now);
  }

  render() {
    return <div>
      <section className="selector-area gender-selector body">
        <section className="gender-selector gender-list">
          {_.map(Constants.genders, ({key, name})=>{
            return <div key={`gender-selector-${key}`}>
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