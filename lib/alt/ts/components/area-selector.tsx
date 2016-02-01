import * as React from 'react'
import {Node} from '../lib/eventer'
import * as d3 from 'd3'
import Constants from "../initializers/constants";
import * as _ from 'lodash';
import {normalizeBarData} from '../services/normalizer'
import * as RD3 from 'react-d3-basic'

export default class AreaSelectorComponent extends Node<{},{}> {
  toggle(e){
    let selected = (this.props.location.query.area || '').split(',').map((n)=> +n);
    let key = +e.target.value;
    if(_.includes(selected, key)){
      this.dispatch('area:select', _.without(selected, key));
    }else{
      this.dispatch('area:select', selected.concat([key]))
    }
  }

  writeSelector(props) {
    let selected = (props.location.query.area || '').split(',').map((n)=> +n);
    let {areas} = Constants;
    return areas.map((area)=> {
      let {key, text} = area;
      return <li className="area-selector selector" key={key}>
        <label>
          <span className="input-input">
            <input type="checkbox" value={key} checked={_.includes(selected, key)}
                   onChange={this.toggle.bind(this)}/>
          </span>
          <span className="input-label">
            {text}
          </span>
        </label>
      </li>
    });
  }

  render() {
    return <div>
      <section className="area-selector body">
        <h1 className="area-selector title">地域で絞り込み</h1>
        <ul className="area-selector area-list">
          {this.writeSelector(this.props)}
        </ul>
      </section>
    </div>
  }
}