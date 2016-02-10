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
import Portal from "./components/portal";
import StackBarChart from "./components/stack-bar-chart";
import Common from "./components/common";
import ChartController from "./components/chart-controller/chart-controller";
declare var ga:Function;

let index = document.querySelector('#index');
index.style.display = 'none';
let indexSrc = index.innerHTML;
let data = document.querySelector('#data');
data && (data.style.display = 'none');

class App extends Root<{},{}> {
  initialState(props) {
    return {indexSrc}
  }

  listen(to) {
    to('link', (uri, query?)=> {
      window.scrollTo(0, 0);
      ga('send', 'pageview', 'uri');
      this.props.history.pushState(null, uri, query)
    });

    to('title', (sub?)=> {
      let base = '自殺を知る、自殺を考える';
      sub && (base += '::' + sub);
      document.title = base;
    });

  }
}

render((
  <Router history={new CreateHistory()}>
    <Route path="" component={App}>
      <Route path="" component={Common}>
        <Route path="chart" component={ChartContext}>
          <Route path="" component={ChartController}>
            <Route path=":base/:table/:x/:y" component={StackBarChart}/>
          </Route>
        </Route>
        <Route path="*" component={Portal}/>
      </Route>
    </Route>
  </Router>
), document.querySelector('#app'));

