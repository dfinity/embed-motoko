// Lightweight observable value implementation
// Derived from: https://stackoverflow.com/a/62002044

type Listener<T> = (next: T, previous: T) => void;

export class Observable<T> {
  _value: T;
  _listeners: Listener<T>[];

  constructor(value: T) {
    this._value = value;
    this._listeners = [];
  }

  get() {
    return this._value;
  }

  set(newValue) {
    if (this._value === newValue) {
      return;
    }
    const previous = this._value;
    this._value = newValue;
    this._listeners.forEach((fn) => fn(this._value, previous));
  }

  callAndSubscribe(listenerFn) {
    listenerFn(this._value);
    this.subscribe(listenerFn);
  }

  subscribe(listenerFn) {
    this._listeners.push(listenerFn);
    return () => this.unsubscribe(listenerFn);
  }

  unsubscribe(listenerFn) {
    this._listeners = this._listeners.filter((fn) => fn !== listenerFn);
  }
}

export default function makeObservable<T>(value: T): Observable<T> {
  return new Observable(value);
}
