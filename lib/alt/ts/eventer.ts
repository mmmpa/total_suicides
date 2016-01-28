import {EventEmitter} from 'events';
import * as React from 'react';
import * as ReactDom from 'react-dom';

interface IEventingShared {
  emitter: EventEmitter
}

export const EventingShared = {emitter: React.PropTypes.object};

export abstract class Root<P, S> extends React.Component<P, S> {
  emitter:EventEmitter;

  abstract listen(to:(eventname:string, callback:Function)=>void):void;

  static get childContextTypes() {
    return EventingShared;
  }

  constructor(props) {
    super(props)
    this.emitter = new EventEmitter();
    this.listen((eventname:string, callback:Function) => {
      this.emitter.on(eventname, callback);
    });
  }

  getChildContext():IEventingShared {
    return {emitter: this.emitter};
  }
}

export abstract class Node<P, S> extends React.Component<P, S> {
  context:IEventingShared;

  static get contextTypes() {
    return EventingShared;
  }

  dispatch(event:string, ...args:any[]):boolean {
    return this.context.emitter.emit(event, ...args);
  }
}