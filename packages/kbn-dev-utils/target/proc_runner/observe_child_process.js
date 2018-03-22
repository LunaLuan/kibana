'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.observeChildProcess = observeChildProcess;

var _Rx = require('rxjs/Rx');

var _Rx2 = _interopRequireDefault(_Rx);

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  Creates an Observable from a childProcess that:
 *    - provides the exit code as it's only value (which may be null)
 *      as soon as the process exits
 *    - completes once all stdio streams for the child process have closed
 *    - fails if the childProcess emits an error event
 *
 *  @param  {ChildProcess} childProcess
 *  @return {Rx.Observable}
 */
function observeChildProcess(name, childProcess) {
  // observe first exit event
  const exit$ = _Rx2.default.Observable.fromEvent(childProcess, 'exit').first().map(code => {
    // JVM exits with 143 on SIGTERM and 130 on SIGINT, dont' treat then as errors
    if (code > 0 && !(code === 143 || code === 130)) {
      throw (0, _errors.createCliError)(`[${name}] exitted with code ${code}`);
    }

    return code;
  });

  // observe first close event
  const close$ = _Rx2.default.Observable.fromEvent(childProcess, 'close').first();

  // observe first error event until there is a close event
  const error$ = _Rx2.default.Observable.fromEvent(childProcess, 'error').first().mergeMap(err => _Rx2.default.Observable.throw(err)).takeUntil(close$);

  return _Rx2.default.Observable.merge(exit$, close$.ignoreElements(), error$);
}