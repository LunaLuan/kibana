'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.observeLines = observeLines;

var _Rx = require('rxjs/Rx');

var _Rx2 = _interopRequireDefault(_Rx);

var _observe_readable = require('./observe_readable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SEP = /\r?\n/;

/**
 *  Creates an Observable from a Readable Stream that:
 *   - splits data from `readable` into lines
 *   - completes when `readable` emits "end"
 *   - fails if `readable` emits "errors"
 *
 *  @param  {ReadableStream} readable
 *  @return {Rx.Observable}
 */
function observeLines(readable) {
  const done$ = (0, _observe_readable.observeReadable)(readable).share();

  const scan$ = _Rx2.default.Observable.fromEvent(readable, 'data').scan(({ buffer }, chunk) => {
    buffer += chunk;

    let match;
    const lines = [];
    while (match = buffer.match(SEP)) {
      lines.push(buffer.slice(0, match.index));
      buffer = buffer.slice(match.index + match[0].length);
    }

    return { buffer, lines };
  }, { buffer: '' })
  // stop if done completes or errors
  .takeUntil(done$.materialize());

  return _Rx2.default.Observable.merge(
  // use done$ to provide completion/errors
  done$,

  // merge in the "lines" from each step
  scan$.mergeMap(({ lines }) => lines),

  // inject the "unsplit" data at the end
  scan$.last().mergeMap(({ buffer }) => buffer ? [buffer] : [])
  // if there were no lines, last() will error, so catch and complete
  .catch(() => _Rx2.default.Observable.empty()));
}