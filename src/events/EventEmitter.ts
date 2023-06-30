/* eslint-disable */

export class EventEmitter {
  _listeners: {
    [index: string]: Array<Function>;
  } = {};
  maxListener = 10;

  public constructor(maxListener?: number) {
    if (maxListener) this.maxListener = maxListener;
  }

  public on(event: string, cb: Function) : this {
    const listeners = this._listeners;
    if (listeners[event] && listeners[event].length >= this.maxListener) {
      throw console.error("Max Listener ", this.maxListener);
    }
    if (listeners[event] instanceof Array) {
      if (listeners[event].indexOf(cb) === -1) {
        listeners[event].push(cb);
      }
    } else {
      listeners[event] = new Array<Function>().concat(cb);
    }
    return this;
  }
  public emit(event: string, ...a: any[]) : this {
    const listeners = this._listeners;
    const args = Array.prototype.slice.call(arguments);
    args.shift();
    if (listeners[event] instanceof Array) {
      this._listeners[event].forEach(cb => {
        cb.apply(null, args);
      });
    }
    return this;
  }
  public off(event: string, listener: Function) {
    const _listeners = this._listeners;
    const arr = _listeners[event] || [];
    const i = arr.indexOf(listener);
    if (i >= 0) {
      _listeners[event].splice(i, 1);
    }
  }
  public once(event: string, listener: Function) : this {
    var self = this;
    function fn() {
      var args = Array.prototype.slice.call(arguments);
      listener.apply(null, args);
      self.once(event, fn);
    }
    this.on(event, fn);
    return this;
  }
  public clear(event: string) {
    this._listeners[event] = [];
  }
  public listeners(event: string) {
    return this._listeners[event];
  }
}
