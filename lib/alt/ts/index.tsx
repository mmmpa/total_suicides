import * as React from 'react'
import {render} from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'
import * as createHistory from 'history/lib/createBrowserHistory'
import {Root, Node} from './eventer'

class Child extends Node<{},{}> {
  render() {
    return <div onClick={()=> this.dispatch("increment")}>app</div>
  }
}

class App extends Root<{},{}> {
  constructor(props){
    super(props);
  }

  listen(to){
    to('increment', ()=>{console.log('increment')})
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

render((
  <Router history={new createHistory()}>
    <Route path="/" component={App}>
      <Route path=":a" component={Child}/>
      <Route path="/:b" component={Child}/>
    </Route>
  </Router>
), document.querySelector('#app'));