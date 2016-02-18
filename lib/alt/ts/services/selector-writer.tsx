import * as React from 'react'
import {Node} from '../lib/eventer'
import Fa from '../lib/fa';
import * as _ from 'lodash'
import {years, areas, genders, tables, tableMaps, tableKeys, allMaps} from "../initializers/constants";

export function writeBaseSelector(onChange:(key)=>void, selected:any[], ...exclusion) {
  return detectSelectable(...exclusion).map(({key, name})=> {
    return <label>
      <span className="input-input">
        <input type="radio" checked={_.includes(selected, key)} onChange={()=> onChange(key)}/>
      </span>
      <span className="input-label">{name}</span>
    </label>
  });
}

export function writeSelectorSpecifier(selectorKey:string, onChange:(key)=>void, selected:any[], type:string = 'radio') {
  let keyMap = _.find(allMaps, ({key})=> key == selectorKey).value;

  return keyMap.map(({key, name})=> {
    return <label>
      <span className="input-input">
        <input type={type} checked={_.includes(selected, key)} onChange={()=> onChange(key)}/>
      </span>
      <span className="input-label">{name}</span>
    </label>
  });
}

function detectSelectable(...exclusion) {
  let base = [
    {key: 'year', name: '年度'},
    {key: 'gender', name: '性別'},
    {key: 'area', name: '地域'}
  ];

  let addingTable = true;
  exclusion.forEach((ex)=> {
    if (_.includes(tableKeys, ex)) {
      addingTable = false;
    } else {
      _.remove(base, ({key})=> key == ex);
    }
  });

  return addingTable ? base.concat(tables) : base;
}

export class ChartDataSelector extends Node<{}, {}> {
  constructor(props) {
    super(props);
    this.state = {
      base: '',
      specified: ''
    }
  }

  writeBase() {
    if (!this.props.x || this.props.x === '') {
      return null;
    }

    return <section className="v2-chart sub-controller-container data-selector y">
      <h1 className="v2-chart sub-controller-title">カテゴリー</h1>
      {writeBaseSelector((base)=> {
        this.setState({base})
        }, [this.state.base], this.props.x)}
    </section>
  }

  writeSpecifier() {
    let {base, specified} = this.state;
    if (!base) {
      return null;
    }

    return <section className="v2-chart sub-controller-container data-selector y-specifier">
      <h1 className="v2-chart sub-controller-title">詳細</h1>
      {writeSelectorSpecifier(base, (specified)=> {
        this.setState({specified})
        }, [specified])}
    </section>
  }

  writeRangeSpecifier() {
    let {base, specifiedRange} = this.state;
    if (!base || base === '' || base === 'year' || this.props.x === 'year') {
      return null;
    }

    return <section className="v2-chart sub-controller-container data-selector y-specifier">
      <h1 className="v2-chart sub-controller-title">時期の指定が必要です</h1>
      {writeSelectorSpecifier('year', (specifiedRange)=> {
        this.setState({specifiedRange})
        }, [specifiedRange])}
    </section>
  }

  add() {
    let {base, specified, specifiedRange} = this.state;
    this.dispatch('chart:add', base, specified, specifiedRange);
  }

  render() {
    return <section className="v2-chart data-selector">
      <section className="v2-chart data-selector">
        {this.writeBase()}
        {this.writeSpecifier()}
        {this.writeRangeSpecifier()}
        <section className="v2-chart data-selector submit">
          <button className="submit" onClick={()=> this.add()}>
            <Fa icon="plus-circle"/>
            チャートにデータを追加
          </button>
        </section>
      </section>
    </section>
  }
}