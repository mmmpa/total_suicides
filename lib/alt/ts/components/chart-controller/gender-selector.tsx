import * as React from 'react'
import {Node} from '../../lib/eventer'
import Constants from "../../initializers/constants";
import * as d3 from 'd3'
import * as _ from 'lodash';
import {normalizeBarData} from '../services/normalizer'
import * as RD3 from 'react-d3-basic'

export default class YearSelectorComponent extends Node<{},{}> {
  get selected(){
    let {area} = this.props.location.query;
    if(!area){
      return [];
    }
    return area.split(',').map((n)=> +n)
  }

  get separated(){

  }

  toggle(e){
    let key = +e.target.value;
    if(_.includes(this.selected, key)){
      this.dispatch('area:select', _.without(this.selected, key));
    }else{
      this.dispatch('area:select', this.selected.concat([key]))
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