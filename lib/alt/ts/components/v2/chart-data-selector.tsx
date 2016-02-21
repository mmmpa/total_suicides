import * as React from 'react'
import {Node} from '../../lib/eventer'
import Fa from '../../lib/fa';
import * as _ from 'lodash'
import {years, areas, genders, tables, tableMaps, tableKeys, allMaps, detectMap} from "../../initializers/constants";

function writeBaseSelector(onChange:(key)=>void, selected:any[], ...exclusion) {
  return detectSelectable(...exclusion).map(({key, name})=> {
    return <label key={key}>
      <span className="input-input">
        <input type="radio" value={key} checked={_.includes(selected, key)} onChange={()=> onChange(key)}/>
      </span>
      <span className="input-label">{name}</span>
    </label>
  });
}

function writeSelectorSpecifier(selectorKey:string, onChange:(key)=>void, selected:any[], type:string = 'radio') {
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

interface BP{
  x?:string
}

interface BS{
  x?:string,
  y?:string,
  ySpecified?:string,
  zSpecified?:string
}

abstract class ChartDataSelectorBase extends Node<BP, BS> {
  constructor(props) {
    super(props);
    this.state = {
      x: '',
      y: '',
      ySpecified: '',
      zSpecified: ''
    }
  }

  get isAddable():boolean {
    let {x, y, ySpecified, zSpecified} = this.state;
    if (this.isRequiredRange) {
      return y !== '' && ySpecified !== '' && zSpecified !== '';
    } else {
      return y !== '' && ySpecified !== '';
    }
  }

  get isRequiredRange():boolean {
    let x = this.props.x || this.state.x;
    let {y} = this.state;
    if (y === '' || y === 'year' || x === 'year') {
      return false;
    }
    return true;
  }

  setX(key) {
    this.setState({x: key, y: '', ySpecified: '', zSpecified: ''})
  }

  setY(key) {
    this.setState({y: key, ySpecified: '', zSpecified: ''})
  }

  setYSpecified(ySpecified) {
    this.setState({ySpecified})
  }

  setZSpecified(zSpecified) {
    this.setState({zSpecified})
  }

  writeBase() {
    let x = this.props.x || this.state.x;
    if (x === '') {
      return null;
    }

    return <section className="v2-chart sub-controller-container data-selector y">
      <h1 className="v2-chart sub-controller-title">縦軸のカテゴリー</h1>
      {writeBaseSelector((base)=> {
        this.setY(base)
        }, [this.state.y], this.props.x, this.state.x)}
    </section>
  }

  writeXSelector() {
    return <section className="v2-chart sub-controller-container data-selector x">
      <h1 className="v2-chart sub-controller-title">チャートの横軸に並ぶ項目</h1>
      {writeBaseSelector((x)=> {
        this.setX(x)
        }, [this.state.x])}
    </section>
  }

  writeSpecifier() {
    let {y, ySpecified} = this.state;
    if (!y) {
      return null;
    }

    return <section className="v2-chart sub-controller-container data-selector y-specifier">
      <h1 className="v2-chart sub-controller-title">縦軸の値</h1>
      {writeSelectorSpecifier(y, (specified)=> {
        this.setYSpecified(specified)
        }, [ySpecified])}
    </section>
  }

  writeRangeSpecifier() {
    let {zSpecified} = this.state;
    if (!this.isRequiredRange) {
      return null;
    }

    return <section className="v2-chart sub-controller-container data-selector z-specifier">
      <h1 className="v2-chart sub-controller-title">時期の指定が必要です</h1>
      {writeSelectorSpecifier('year', (zSpecified)=> {
        this.setZSpecified(zSpecified)
        }, [zSpecified])}
    </section>
  }
}

export class ChartSelector extends ChartDataSelectorBase {
  find() {
    let {x, y, ySpecified, zSpecified} = this.state;
    let xSpecified = detectMap(x).map((d)=> d.key);
    this.dispatch('chart:find', {x, xSpecified, y, ySpecified, zSpecified});
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
  add() {
    let {y, ySpecified, zSpecified} = this.state;
    this.dispatch('chart:add', y, ySpecified, zSpecified);
  }

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