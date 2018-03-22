'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withProcRunner = withProcRunner;

var _proc_runner = require('./proc_runner');

/**
 *  Create a ProcRunner and pass it to an async function. When
 *  the async function finishes the ProcRunner is torn-down
 *  automatically
 *
 *  @param  {async Function} fn
 *  @return {Promise<undefined>}
 */
async function withProcRunner(fn) {
  const procs = new _proc_runner.ProcRunner();
  try {
    await fn(procs);
  } finally {
    await procs.teardown();
  }
}