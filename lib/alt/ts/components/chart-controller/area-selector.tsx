import * as React from 'react'
import {Node} from '../../lib/eventer'
import Constants from "../../initializers/constants";
import * as _ from 'lodash';
import Fa from "../../lib/fa";

interface P{
  selected:number[]
}

export default class AreaSelectorComponent extends Node<P,{}> {
  get selected() {
    return this.props.selected;
  }

  toggle(e) {
    let key = +e.target.value;
    if (_.includes(this.selected, key)) {
      this.dispatch('chart:area', _.without(this.selected, key));
    } else {
      this.dispatch('chart:area', this.selected.concat([key]))
    }
  }

  selectAll(selectKeys) {
    this.dispatch('chart:area', _.union(this.selected, selectKeys));
  }

  deselectAll(deselectKeys) {
    this.dispatch('chart:area', _.without(this.selected, ...deselectKeys));
  }

  writeWideArea(separatedAreas, props:P) {
    return separatedAreas.map((wideArea)=> {
      return <section className="area-selector wide-area-section" key={`wide-area-selector-${wideArea.name}`}>
        {this.writeSmallArea(wideArea.areas, props)}
      </section>
    });
  }

  writeSmallArea(areas:any[], props:P) {
    let wideKeys = _.map(areas, ({key})=> key)
    return <section className="area-selector small-area-section">
      <div className="area-selector select-all">
        <p>
          <Fa icon="check"/>
          <a onClick={()=> this.selectAll(wideKeys)}>選択</a>
        </p>
        <p>
          <Fa icon="trash"/>
          <a onClick={()=> this.deselectAll(wideKeys)}>解除</a>
        </p>
      </div>
      <ul className="area-selector area-list">
        {_.map(areas, (area)=>{
          return <li className="area-selector selector" key={`small-area-selector-${area.key}`}>
            <label>
              <span className="input-input">
                <input type="checkbox" value={area.key} checked={_.includes(this.selected, area.key)}
                       onChange={this.toggle.bind(this)}/>
              </span>
              <span className="input-label">
                {area.name}
              </span>
            </label>
          </li>
          })}
      </ul>
    </section>
  }

  render() {
    let {separatedAreas} = Constants;
    return <div>
      <section className="selector-area area-selector body">
        <h1 className="selector-area title">
          <Fa icon="globe"/>
          地域
        </h1>
        {this.writeWideArea(separatedAreas, this.props)}
      </section>
    </div>
  }
}