import * as React from 'react'
import {Node} from '../lib/eventer'
import Fa from '../lib/fa';
import * as _ from 'lodash'
import {years, areas, genders, tables, tableMaps, tableKeys, allMaps, detectMap} from "../initializers/constants";

export function writeBaseSelector(onChange:(key)=>void, selected:any[], ...exclusion) {
  return detectSelectable(...exclusion).map(({key, name})=> {
    return <label key={key}>
      <span className="input-input">
        <input type="radio" value={key} checked={_.includes(selected, key)} onChange={()=> onChange(key)}/>
      </span>
      <span className="input-label">{name}</span>
    </label>
  });
}

export function writeSelectorSpecifier(selectorKey:string, onChange:(key)=>void, selected:any[], type:string = 'radio') {
  let keyMap = _.find(allMaps, ({key})=> key == selectorKey).value;

  return keyMap.map(({key, name})=> {
    return <label key={key}>
      <span className="input-input">
        <input type={type} value={key} checked={_.includes(selected, key)} onChange={()=> onChange(key)}/>
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

abstract class ChartDataSelectorBase extends Node<{}, {}> {
  constructor(props) {
    super(props);
    this.state = {
      x: '',
      base: '',
      specified: '',
      specifiedRange: ''
    }
  }

  get isAddable():boolean {
    let {base, specified, specifiedRange} = this.state;
    if (this.isRequiredRange) {
      return base !== '' && specified !== '' && specifiedRange !== ''
    } else {
      return base !== '' && specified !== ''
    }
  }

  get isRequiredRange():boolean {
    let x = this.props.x || this.state.x;
    let {base} = this.state;
    if (base === '' || base === 'year' || x === 'year') {
      return false;
    }
    return true;
  }

  writeBase() {
    let x = this.props.x || this.state.x;
    if (x === '') {
      return null;
    }

    return <section className="v2-chart sub-controller-container data-selector y">
      <h1 className="v2-chart sub-controller-title">縦軸のカテゴリー</h1>
      {writeBaseSelector((base)=> {
        this.setState({base})
        }, [this.state.base], this.props.x, this.state.x)}
    </section>
  }

  writeXSelector() {
    return <section className="v2-chart sub-controller-container data-selector x">
      <h1 className="v2-chart sub-controller-title">チャートの横軸に並ぶ項目</h1>
      {writeBaseSelector((x)=> {
        this.setState({x})
        }, [this.state.x])}
    </section>
  }

  writeSpecifier() {
    let {base, specified} = this.state;
    if (!base) {
      return null;
    }

    return <section className="v2-chart sub-controller-container data-selector y-specifier">
      <h1 className="v2-chart sub-controller-title">縦軸の値</h1>
      {writeSelectorSpecifier(base, (specified)=> {
        this.setState({specified})
        }, [specified])}
    </section>
  }

  writeRangeSpecifier() {
    let {base, specifiedRange} = this.state;
    if (!this.isRequiredRange) {
      return null;
    }

    return <section className="v2-chart sub-controller-container data-selector z-specifier">
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
}

export class ChartSelector extends ChartDataSelectorBase {
  find() {
    let {x, base, specified, specifiedRange} = this.state;
    this.dispatch('chart:find', {
      x: x,
      xSpecified: detectMap(x).map((d)=> d.key),
      ySpecified: specified,
      y: base,
      z: specifiedRange
    });
  }

  render() {
    return <section className="v2-chart data-selector">
      <section className="v2-chart data-selector">
        {this.writeXSelector()}
        {this.writeBase()}
        {this.writeSpecifier()}
        {this.writeRangeSpecifier()}
        <section className="v2-chart data-selector submit">
          <button className="submit" disabled={!this.isAddable} onClick={()=> this.find()}>
            <Fa icon="plus-circle"/>
            チャートを表示
          </button>
        </section>
      </section>
    </section>
  }
}

export class ChartDataSelector extends ChartDataSelectorBase {
  render() {
    return <section className="v2-chart data-selector">
      <section className="v2-chart data-selector">
        {this.writeBase()}
        {this.writeSpecifier()}
        {this.writeRangeSpecifier()}
        <section className="v2-chart data-selector submit">
          <button className="submit" disabled={!this.isAddable} onClick={()=> this.add()}>
            <Fa icon="plus-circle"/>
            チャートにデータを追加
          </button>
        </section>
      </section>
    </section>
  }
}