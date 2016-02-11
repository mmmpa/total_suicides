import {EventEmitter} from 'events';
import * as React from 'react';
import * as ReactDom from 'react-dom';

interface IEventingShared {
  emitter: EventEmitter
}

export const EventingShared = {
  emitter: React.PropTypes.object
};

export abstract class Node<P, S> extends React.Component<P, S> {
  context:IEventingShared;

  static get contextTypes() {
    return EventingShared;
  }

  dispatch(event:string, ...args:any[]):boolean {
    return this.context.emitter.emit(event, ...args);
  }
}

export abstract class Root<P, S> extends Node<P, S> {
  emitter:EventEmitter;
  addedOnStore = [];

  abstract listen(to:(eventName:string, callback:Function)=>void):void;

  abstract initialState(props):S;

  static get childContextTypes() {
    return EventingShared;
  }

  componentWillUnmount() {
    let disposed = this.addedOnStore.map(({eventName, callback})=> {
      this.emitter.removeListener(eventName, callback);
      return eventName;
    });
    console.log({disposed});
  }

  componentWillMount() {
    if (!this.emitter) {
      this.emitter = this.context.emitter || new EventEmitter();
      this.listen((eventName:string, callback:Function) => {
        this.addedOnStore.push({eventName, callback});
        this.emitter.on(eventName, callback);
      });
    }
  }

  constructor(props) {
    super(props);
    this.state = this.initialState(props);
  }

  getChildContext():IEventingShared {
    return {emitter: this.context.emitter || this.emitter};
  }

  render() {
    let props = _.merge(_.clone(this.props), this.state);
    delete props.children;
    return React.cloneElement(this.props.children || <div>blank</div>, props);
  }
}

