'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.observeReadable = observeReadable;

var _Rx = require('rxjs/Rx');

var _Rx2 = _interopRequireDefault(_Rx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  Produces an Observable from a ReadableSteam that:
 *   - completes on the first "end" event
 *   - fails on the first "error" event
 *
 *  @param  {ReadableStream} readable
 *  @return {Rx.Observable}
 */
function observeReadable(readable) {
  return _Rx2.default.Observable.race(_Rx2.default.Observable.fromEvent(readable, 'end').first().ignoreElements(), _Rx2.default.Observable.fromEvent(readable, 'error').first().map(err => _Rx2.default.Observable.throw(err)));
}