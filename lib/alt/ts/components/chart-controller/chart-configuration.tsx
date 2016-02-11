import * as React from 'react'
import {Node} from '../../lib/eventer'
import * as _ from 'lodash';

interface P{
  autoScale:boolean,
  par:boolean
}

export default class ChartConfigurationComponent extends Node<P,{}> {
  get autoScale():boolean{
    return this.props.autoScale;
  }

  get par():boolean{
    return this.props.par;
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
              <input type="radio" name="auto-scale" checked={!this.autoScale} onChange={()=> this.toggleScale(false)}/>
            </span>
            <span className="input-label">Y軸最大値を統一する</span>
          </label>
          <label>
            <span className="input-input">
              <input type="radio" name="auto-scale" checked={this.autoScale} onChange={()=> this.toggleScale(true)}/>
            </span>
            <span className="input-label">Y軸を自動調整する</span>
          </label>
        </section>
        <section className="chart-config auto-scale">
          <label>
            <span className="input-input">
              <input type="radio" name="par" checked={!this.par} onChange={()=> this.togglePar(false)}/>
            </span>
            <span className="input-label">人数で表示する</span>
          </label>
          <label>
            <span className="input-input">
              <input type="radio" name="par" checked={this.par} onChange={()=> this.togglePar(true)}/>
            </span>
            <span className="input-label">率で表示する</span>
          </label>
        </section>
      </section>
    </div>
  }
}