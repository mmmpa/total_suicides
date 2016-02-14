import * as React from 'react'
import {render} from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'
import * as CreateHistory from 'history/lib/createBrowserHistory'
import * as _ from 'lodash'
import {Root, Node} from './lib/eventer'
import PresetGraph from "./contexts/preset-graph";
import ChartContext from "./contexts/chart";
import Portal from "./components/portal";
import StackBarChart from "./components/stack-bar-chart";
import Common from "./components/common";
import ChartController from "./components/chart-controller/chart-controller";
import V2 from './contexts/v2'
import V2Chart from './components/v2/chart'
import V2Finder from './components/v2/chart-finder'
import ChartFinderContext from "./contexts/chart-finder-context";

declare var ga:Function;

let index = document.querySelector('#index') as HTMLElement;
index.style.display = 'none';
let indexSrc = index.innerHTML;
let data = document.querySelector('#data') as HTMLElement;
data && (data.style.display = 'none');

interface P {
  history:History
}

class App extends Root<P,{}> {
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
      <Route path="v2" component={V2}>
        <Route path="finder" component={V2Finder}/>
        <Route path=":year/:gender/:area" component={V2Chart}/>
        <Route path="*" component={Portal}/>
      </Route>
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

