import * as React from 'react'
import {render} from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'
import * as CreateHistory from 'history/lib/createBrowserHistory'
import {Root, Node} from './lib/eventer'
import PresetGraph from "./contexts/preset-graph";
import SimpleGraph from "./components/simple-graph";
import CircleGraphComponent from "./components/circle-graph";
import {fetchPreset, fetchWithParams} from './services/fetcher'

class Child extends Node<{},{}> {
  render() {
    console.log(this.props);
    return <div onClick={()=> this.dispatch("increment")}>app</div>
  }
}

class App extends Root<{},{}> {
  initialState(props) {
    return {
      from: 'app',
      data: {}
    }
  }

  componentDidMount() {
    this.normalizeRouteParams(this.props)
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.normalizeRouteParams(nextProps)
    this.fetchData(nextProps);
  }

  fetchData(props) {
    let {presetName} = props.params;
    if (!!presetName) {
      return fetchPreset(presetName, (state)=>{
        this.setState(state);
      });
    }

    if (this.needFetch(props)) {
      fetchWithParams(props, (state)=>{
        this.setState(state);
      })
    }
  }

  needFetch(props) {
    let {table, horizontal, vertical} = props.params;
    return !!table && !!horizontal && !!vertical;
  }

  normalizeRouteParams(props) {
    console.log(props)
  }


  listen(to) {
    to('increment', ()=> {
      console.log('app increment')
    });
    to('get:way', (gender:number[], year:number[], area:number[])=> {

    });
  }
}

render((
  <Router history={new CreateHistory()}>
    <Route path="/" component={App}>
      <Route path="preset" component={PresetGraph}>
        <Route path="child" component={Child}/>
        <Route path="way/:gender/:year/:area" component={SimpleGraph} myprops={"a"}/>
      </Route>
      <Route path="circle" component={PresetGraph}>
        <Route path=":presetName" component={CircleGraphComponent} myprops={"a"}/>
        <Route path=":table/:split/:horizontal/:vertical/:rotation" component={CircleGraphComponent} myprops={"a"}/>
      </Route>
    </Route>
  </Router>
), document.querySelector('#app'));
