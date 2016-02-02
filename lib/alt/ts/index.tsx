import * as React from 'react'
import {render} from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'
import * as CreateHistory from 'history/lib/createBrowserHistory'
import * as _ from 'lodash'
import {Root, Node} from './lib/eventer'
import PresetGraph from "./contexts/preset-graph";
import ChartContext from "./contexts/chart";
import SimpleGraph from "./components/simple-graph";
import PieChart from "./components/pie-chart";
import BarChart from "./components/bar-chart";
import Common from "./components/common";
import ChartController from "./components/chart-controller";
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
    this.fetchData(nextProps, this.props);
  }

  fetchData(props, preProps) {
    let {presetName} = props.params;
    if (!!presetName) {
      return fetchPreset(presetName, (state)=> {
        this.setState(state);
      });
    }

    if (this.needFetch(props)) {
      fetchWithParams(props, (state)=> {
        this.setState(state);
      })
    }
  }

  needFetch(props) {
    return !!props.params.table;
  }

  normalizeRouteParams(props) {
    console.log(props)
  }

  normalizeQuery(uri, props){
    let {query} = props.location;
    if(uri.indexOf('/area/') == -1){
      delete query.area;
    }
    return query;
  }

  listen(to) {
    to('link', (uri)=> {
      window.scrollTo(0, 0);
      this.props.history.pushState(null, uri, this.normalizeQuery(uri, this.props))
    });
    to('link:navigator', ()=>{
     console.log('link:nav')
      window.scrollTo(0, window.innerHeight)
    });
  }
}

render((
  <Router history={new CreateHistory()}>
    <Route path="/" component={App}>
      <Route path="" component={Common}>
        <Route path="preset" component={PresetGraph}>
          <Route path="child" component={Child}/>
          <Route path="way/:gender/:year/:area" component={SimpleGraph}/>
        </Route>
        <Route path="pie" component={PresetGraph}>
          <Route path=":presetName" component={PieChart}/>
          <Route path=":table/:year" component={PieChart}/>
          <Route path=":table/:split/:year" component={PieChart}/>
        </Route>
        <Route path="bar" component={ChartContext}>
          <Route path="" component={ChartController}>
            <Route path=":table/:split/:filter" component={BarChart}/>
            <Route path=":table/:split/:filter" component={BarChart}/>
          </Route>
        </Route>
      </Route>
    </Route>
  </Router>
), document.querySelector('#app'));
