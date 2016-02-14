import * as React from 'react'
import {Node} from '../../lib/eventer'
import {tables} from "../../initializers/constants";
import * as _ from 'lodash';
import Fa from "../../lib/fa";

interface P{
  selected:string
}

export default class AreaSelectorComponent extends Node<P,{}> {
  get selected() {
    return this.props.selected;
  }

  toggle(e) {
    this.dispatch('chart:detail', e.target.value)
  }

  render() {
    return <div>
      <section className="selector-area area-selector body">
        <h1 className="selector-area title">
          <Fa icon="globe"/>
          詳細
        </h1>
        {_.map(tables, (table)=>{
          return <li className="detail-selector selector" key={`detail-selector-${table.key}`}>
            <label>
              <span className="input-input">
                <input type="radio" value={table.key}
                       checked={this.selected == table.key}
                       onChange={this.toggle.bind(this)}/>
              </span>
              <span className="input-label">
                {table.name}
              </span>
            </label>
          </li>
          })}
      </section>
    </div>
  }
}