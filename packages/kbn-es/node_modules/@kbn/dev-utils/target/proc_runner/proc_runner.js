'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProcRunner = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _log = require('./log');

var _errors = require('./errors');

var _proc = require('./proc');

var _observe_signals = require('./observe_signals');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const noop = () => {};

/**
 *  Helper for starting and managing processes. In many ways it resembles the
 *  API from `grunt_run`, processes are named and can be started, waited for,
 *  backgrounded once they log something matching a RegExp...
 *
 *  @class ProcRunner
 */
class ProcRunner {
  constructor() {
    this._closing = false;
    this._procs = [];
    this._signalSubscription = (0, _observe_signals.observeSignals)(process).subscribe({
      next: async signal => {
        await this.teardown(signal);
        if (signal !== 'exit') {
          // resend the signal
          process.kill(process.pid, signal);
        }
      }
    });
  }

  /**
   *  Start a process, tracking it by `name`
   *  @param  {String}  name
   *  @param  {Object}  options
   *  @property {String} options.cmd executable to run
   *  @property {Array<String>?} options.args arguments to provide the executable
   *  @property {String?} options.cwd current working directory for the process
   *  @property {RegExp|Boolean} options.wait Should start() wait for some time? Use
   *                                          `true` will wait until the proc exits,
   *                                          a `RegExp` will wait until that log line
   *                                          is found
   *  @return {Promise<undefined>}
   */
  async run(name, options) {
    const {
      cmd,
      args = [],
      cwd = process.cwd(),
      stdin = null,
      wait = false,
      env = process.env
    } = options;

    if (this._closing) {
      throw new Error('ProcRunner is closing');
    }

    if (wait && !(wait instanceof RegExp) && wait !== true) {
      throw new TypeError('wait param should either be a RegExp or `true`');
    }

    if (!!this._getProc(name)) {
      throw new Error(`Process with name "${name}" already running`);
    }

    const proc = this._createProc(name, { cmd, args, cwd, env, stdin });

    try {
      // wait for process to log matching line
      if (wait instanceof RegExp) {
        await proc.lines$.filter(line => wait.test(line)).first().catch(err => {
          if (err.name !== 'EmptyError') {
            throw (0, _errors.createCliError)(`[${name}] exitted without matching pattern: ${wait}`);
          } else {
            throw err;
          }
        }).toPromise();
      }

      // wait for process to complete
      if (wait === true) {
        await proc.outcomePromise;
      }
    } finally {
      // while the procRunner closes promises will resolve/reject because
      // processes and stopping, but consumers of run() shouldn't have to
      // prepare for that, so just return a never-resolving promise
      if (this._closing) {
        await new Promise(noop);
      }
    }
  }

  /**
   *  Stop a named proc
   *  @param  {String}  name
   *  @param  {String}  [signal='SIGTERM']
   *  @return {Promise<undefined>}
   */
  async stop(name, signal = 'SIGTERM') {
    const proc = this._getProc(name);
    if (proc) {
      await proc.stop(signal);
    } else {
      _log.log.warning('[%s] already stopped', name);
    }
  }

  /**
   *  Wait for all running processes to stop naturally
   *  @return {Promise<undefined>}
   */
  async waitForAllToStop() {
    await Promise.all(this._procs.map(proc => proc.closedPromise));
  }

  /**
   *  Close the ProcRunner and stop all running
   *  processes with `signal`
   *
   *  @param  {String} [signal=undefined]
   *  @return {Promise}
   */
  async teardown(signal) {
    if (this._closing) return;

    this._closing = true;
    this._signalSubscription.unsubscribe();
    this._signalSubscription = null;

    if (!signal && this._procs.length > 0) {
      _log.log.warning('%d processes left running, stop them with procs.stop(name):', this._procs.length, this._procs.map(proc => proc.name));
    }

    const stopWith = signal === 'exit' ? 'SIGKILL' : signal;
    await Promise.all(this._procs.map(proc => proc.stop(stopWith)));
  }

  _getProc(name) {
    return this._procs.find(proc => proc.name === name);
  }

  _createProc(name, options) {
    const startMs = Date.now();
    const proc = (0, _proc.createProc)(name, options);

    this._procs.push(proc);
    const remove = () => {
      this._procs.splice(this._procs.indexOf(proc), 1);
    };

    // tie into proc outcome$, remove from _procs on compete
    proc.outcome$.subscribe({
      next: code => {
        const duration = _moment2.default.duration(Date.now() - startMs);
        _log.log.info('[%s] exitted with %s after %s', name, code, duration.humanize());
      },
      complete: () => {
        remove();
      },
      error: error => {
        if (this._closing) {
          _log.log.error(error);
        }
        remove();
      }
    });

    return proc;
  }
}
exports.ProcRunner = ProcRunner;