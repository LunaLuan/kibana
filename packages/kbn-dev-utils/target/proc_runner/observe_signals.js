'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.observeSignals = observeSignals;

var _Rx = require('rxjs/Rx');

var _Rx2 = _interopRequireDefault(_Rx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  Creates an Observable from a Process object that:
 *   - emits "exit", "SIGINT", or "SIGTERM" events that occur
 *
 *  @param  {ReadableStream} readable
 *  @return {Rx.Observable}
 */
function observeSignals(process) {
  return _Rx2.default.Observable.merge(_Rx2.default.Observable.fromEvent(process, 'exit').mapTo('exit'), _Rx2.default.Observable.fromEvent(process, 'SIGINT').mapTo('SIGINT'), _Rx2.default.Observable.fromEvent(process, 'SIGTERM').mapTo('SIGTERM'));
}