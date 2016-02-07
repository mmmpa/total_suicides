import * as React from 'react'
import {Node} from '../../lib/eventer'
import Constants from "../../initializers/constants";
import * as _ from 'lodash';

export default class AreaSelectorComponent extends Node<{},{}> {
  get selected() {
    let {area} = this.props.location.query;
    if (!area) {
      return [];
    }
    return area.split(',').map((n)=> +n)
  }

  get separated() {

  }

  toggle(e) {
    let key = +e.target.value;
    if (_.includes(this.selected, key)) {
      this.dispatch('area:select', _.without(this.selected, key));
    } else {
      this.dispatch('area:select', this.selected.concat([key]))
    }
  }

  writeWideArea(separatedAreas, props) {
    return separatedAreas.map((wideArea)=> {
      return <secsion className="area-selector wide-area-section">
        <h1 className="area-selector wide-area-title">{wideArea.name}</h1>
        {this.writeSmallArea(wideArea.areas, props)}
      </secsion>
    });
  }

  writeSmallArea(areas, props) {
    return <ul className="area-selector area-list">
      {_.map(areas, (area)=>{
        return <li className="area-selector selector" key={area.key}>
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
  }

  render() {
    let {separatedAreas} = Constants;
    return <div>
      <section className="selector-area area-selector body">
        {this.writeWideArea(separatedAreas, this.props)}
      </section>
    </div>
  }
}