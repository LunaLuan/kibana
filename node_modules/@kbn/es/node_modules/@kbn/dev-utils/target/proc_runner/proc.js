'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProc = createProc;

var _child_process = require('child_process');

var _fs = require('fs');

var _Rx = require('rxjs/Rx');

var _Rx2 = _interopRequireDefault(_Rx);

var _chalk = require('chalk');

var _treeKill = require('tree-kill');

var _treeKill2 = _interopRequireDefault(_treeKill);

var _util = require('util');

var _log = require('./log');

var _observe_lines = require('./observe_lines');

var _observe_child_process = require('./observe_child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const treeKillAsync = (0, _util.promisify)(_treeKill2.default);

const SECOND = 1000;
const STOP_TIMEOUT = 30 * SECOND;

async function withTimeout(attempt, ms, onTimeout) {
  const TIMEOUT = Symbol('timeout');
  try {
    await Promise.race([attempt(), new Promise((resolve, reject) => setTimeout(() => reject(TIMEOUT), STOP_TIMEOUT))]);
  } catch (error) {
    if (error === TIMEOUT) {
      await onTimeout();
    } else {
      throw error;
    }
  }
}

function createProc(name, { cmd, args, cwd, env, stdin }) {
  _log.log.info('[%s] > %s', name, cmd, args.join(' '));

  // spawn fails with ENOENT when either the
  // cmd or cwd don't exist, so we check for the cwd
  // ahead of time so that the error is less ambiguous
  try {
    if (!(0, _fs.statSync)(cwd).isDirectory()) {
      throw new Error(`cwd "${cwd}" exists but is not a directory`);
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`cwd "${cwd}" does not exist`);
    }
  }

  const childProcess = (0, _child_process.spawn)(cmd, args, {
    cwd,
    env,
    stdio: [stdin ? 'pipe' : 'ignore', 'pipe', 'pipe']
  });

  if (stdin) {
    childProcess.stdin.end(stdin, 'utf8');
  }

  return new class Proc {
    constructor() {
      this.name = name;
      this.lines$ = _Rx2.default.Observable.merge((0, _observe_lines.observeLines)(childProcess.stdout), (0, _observe_lines.observeLines)(childProcess.stderr)).do(line => _log.log.write(` ${(0, _chalk.gray)('proc')}  [${(0, _chalk.gray)(name)}] ${line}`)).share();
      this.outcome$ = (0, _observe_child_process.observeChildProcess)(name, childProcess).share();
      this.outcomePromise = _Rx2.default.Observable.merge(this.lines$.ignoreElements(), this.outcome$).toPromise();
      this.closedPromise = this.outcomePromise.then(() => {}, () => {});
    }

    async stop(signal) {
      await withTimeout(async () => {
        await treeKillAsync(childProcess.pid, signal);
      }, STOP_TIMEOUT, async () => {
        _log.log.warning(`Proc "${name}" was sent "${signal}" and didn't exit after ${STOP_TIMEOUT} ms, sending SIGKILL`);
        await treeKillAsync(childProcess.pid, 'SIGKILL');
      });

      await withTimeout(async () => {
        await this.closedPromise;
      }, STOP_TIMEOUT, async () => {
        throw new Error(`Proc "${name}" was stopped but never emiited either the "close" or "exit" events after ${STOP_TIMEOUT} ms`);
      });
    }
  }();
}