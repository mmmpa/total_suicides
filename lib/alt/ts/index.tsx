import * as React from 'react'
import {render} from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'
import * as CreateHistory from 'history/lib/createBrowserHistory'
import * as _ from 'lodash'
import {Root, Node} from './lib/eventer'

import Portal from "./components/portal";
import Common from "./components/common";
import V2 from './contexts/v2'
import V2Chart from './components/v2/chart'

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
    to('link', (uri, query?, calm?)=> {
      calm || window.scrollTo(0, 0);
      ga('send', 'pageview', 'uri');
      this.props.history.pushState(null, uri, query)
    });

    to('title', (sub?)=> {
      let base = '自殺を知る、自殺を考える :: 自殺者数チャート';
      sub && (base += '::' + sub);
      document.title = base;
    });

  }
}

render((
  <Router history={new CreateHistory()}>
    <Route path="" component={App}>
      <Route path="" component={Common}>
        <Route path="v2" component={V2}>
          <Route path="chart" component={V2Chart}/>
        </Route>
        <Route path="" component={V2}>
          <Route path="*" component={Portal}/>
        </Route>
      </Route>
    </Route>
  </Router>
), document.querySelector('#app'));

