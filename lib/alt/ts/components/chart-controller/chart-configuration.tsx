import * as React from 'react'
import {Node} from '../../lib/eventer'
import Constants from "../../initializers/constants";
import * as d3 from 'd3'
import * as _ from 'lodash';
import * as RD3 from 'react-d3-basic'

export default class ChartConfigurationComponent extends Node<{},{}> {
  get autoScale():boolean{
    let {autoScale} = this.props.location.query;
    return autoScale && autoScale != 'false'
  }

  toggle(autoScale:boolean){
    this.dispatch('chart:autoScale', autoScale)
  }

  render() {
    return <div>
      <section className="chart-config body">
        <h1 className="chart-config title">チャート表示設定</h1>
        <section className="chart-config auto-scale">
          <label>
            <span className="input-input">
              <input type="radio" name="auto-scale" checked={!this.autoScale} onClick={()=> this.toggle(false)}/>
            </span>
            <span className="input-label">Y軸最大値を統一する</span>
          </label>
          <label>
            <span className="input-input">
              <input type="radio" name="auto-scale" checked={this.autoScale} onClick={()=> this.toggle(true)}/>
            </span>
            <span className="input-label">Y軸を自動調整する</span>
          </label>
        </section>
      </section>
    </div>
  }
}