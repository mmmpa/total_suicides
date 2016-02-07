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
import StackBarChart from "./components/stack-bar-chart";
import Common from "./components/common";
import ChartController from "./components/chart-controller/chart-controller";

class App extends Root<{},{}> {
  initialState(props) {
    return {
      from: 'app',
      data: {}
    }
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
      window.scrollTo(0, window.innerHeight)
    });
  }
}

render((
  <Router history={new CreateHistory()}>
    <Route path="/" component={App}>
      <Route path="" component={Common}>
        <Route path="chart" component={ChartContext}>
          <Route path="" component={ChartController}>
            <Route path=":base/:table/:x/:y" component={StackBarChart}/>
          </Route>
        </Route>
      </Route>
    </Route>
  </Router>
), document.querySelector('#app'));

