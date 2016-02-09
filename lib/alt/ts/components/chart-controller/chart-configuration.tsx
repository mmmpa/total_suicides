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

  get par():boolean{
    let {par} = this.props.location.query;
    return par && par != 'false'
  }

  toggleScale(autoScale:boolean){
    this.dispatch('chart:autoScale', autoScale)
  }

  togglePar(par:boolean){
    this.dispatch('chart:par', par)
  }

  render() {
    return <div>
      <section className="chart-config body">
        <section className="chart-config auto-scale">
          <label>
            <span className="input-input">
              <input type="radio" name="auto-scale" defaultChecked={!this.autoScale} onClick={()=> this.toggleScale(false)}/>
            </span>
            <span className="input-label">Y軸最大値を統一する</span>
          </label>
          <label>
            <span className="input-input">
              <input type="radio" name="auto-scale" defaultChecked={this.autoScale} onClick={()=> this.toggleScale(true)}/>
            </span>
            <span className="input-label">Y軸を自動調整する</span>
          </label>
        </section>
        <section className="chart-config auto-scale">
          <label>
            <span className="input-input">
              <input type="radio" name="par" defaultChecked={!this.par} onClick={()=> this.togglePar(false)}/>
            </span>
            <span className="input-label">人数で表示する</span>
          </label>
          <label>
            <span className="input-input">
              <input type="radio" name="par" defaultChecked={this.par} onClick={()=> this.togglePar(true)}/>
            </span>
            <span className="input-label">率で表示する</span>
          </label>
        </section>
      </section>
    </div>
  }
}