import * as React from 'react'
import {Node} from '../../lib/eventer'
import {years, areas, genders, tables, tableMaps} from "../../initializers/constants";

import * as _ from 'lodash';
import Fa from '../../lib/fa'
import YearSelector from '../chart-controller/year-selector'
import GenderSelector from '../chart-controller/gender-selector'
import AreaSelector from '../chart-controller/area-selector'
import DetailSelector from '../chart-controller/detail-selector'
import {ChartSelector} from '../../services/selector-writer'

interface S {
  x:string,
  y:string,
}

interface P {
  x:string,
  y:string,
  errors:any
}

export default class ChartFinderComponent extends Node<P,S> {
  constructor(props) {
    this.state = {
      x: '',
      xSpecified: [],
      ySpecified: '',
      y: '',
      z: ''
    }
  }

  find() {
    this.dispatch('chart:find', this.state);
  }

  writeErrorMessage(message:string) {
    if (!message) {
      return null
    }

    return <p className="error-message">{message}</p>
  }

  get selectable() {
    return [
      {key: 'year', name: '年度'},
      {key: 'gender', name: '性別'},
      {key: 'area', name: '地域'},
    ].concat(tables)
  }

  get ySelectable() {
    return this.selectable.map(({key, name})=> {
      return {key, name}
    });
  }

  get xSelectable() {
    return this.selectable.map(({key, name})=> {
      return {key, name}
    });
  }

  specfiers(spec:string) {
    switch (spec) {
      case 'year':
        return years;
      case 'gender':
        return genders;
      case 'area':
        return areas;
      default:
        let detail = _.find(tableMaps, ({key})=> key == spec);
        return detail ? detail.value : [];
    }
  }

  selectX(x) {
    let xSpecified = this.specfiers(x).map(({key})=> key);
    this.setState({x, xSpecified});
  }

  selectXSpecified(xKey) {
    let {xSpecified} = this.state;
    if (_.includes(xSpecified, xKey)) {
      xSpecified = _.without(xSpecified, xKey);
    } else {
      xSpecified.push(xKey);
    }
    this.setState({xSpecified});
  }

  selectYSpecified(ySpecified) {
    this.setState({ySpecified});
  }

  selectY(y) {
    let ySpecified = this.specfiers(y)[0].key;
    this.setState({y, ySpecified});
  }

  selectZ(z) {
    this.setState({z});
  }

  writeYSpecifier() {
    let {y, ySpecified} = this.state;

    return <section>
      {this.specfiers(y).map(({key, name})=>{
        return <label>
          <input type="radio" value="key" checked={ySpecified == key} onChange={()=> this.selectYSpecified(key)}/>
          {name}
        </label>
        })}
    </section>
  }

  writeXSpecifier() {
    let {x, xSpecified} = this.state;

    return <section>
      {this.specfiers(x).map(({key, name})=>{
        return <label>
          <input type="checkbox" value="key" checked={_.includes(xSpecified, key)} onChange={()=> this.selectXSpecified(key)}/>
          {name}
        </label>
        })}
    </section>
  }

  render() {
    let {selectedYears, selectedGenders, selectedAreas, selectedDetail, errors} = this.props;
    let {x, y, z} = this.state;
    return <div>
      <article className="v2-finder body">
        <h1>基本となるチャートを決定します</h1>
        <h1>チャートの縦軸</h1>
        特定の
        {this.ySelectable.map(({key, name})=>{
          return <label>
            <input type="radio" value={key} checked={key === y} onChange={()=> this.selectY(key)}/>
              {name}
          </label>
          })}
        の自殺者数を
        <ChartSelector x={x}/>
      </article>
    </div>
  }
}