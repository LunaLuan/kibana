'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _streams = require('../../streams');

var _tooling_log = require('../tooling_log');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const chance = new _chance2.default();
const capture = (level, block) => {
  const log = (0, _tooling_log.createToolingLog)(level);
  block(log);
  log.end();
  return (0, _streams.createPromiseFromStreams)([log, (0, _streams.createConcatStream)('')]);
};

const nothingTest = (logLevel, method) => {
  describe(`#${method}(...any)`, () => {
    it('logs nothing', async () => {
      const output = await capture(logLevel, log => log[method]('foo'));
      (0, _expect2.default)(output).to.be('');
    });
  });
};

const somethingTest = (logLevel, method) => {
  describe(`#${method}(...any)`, () => {
    it('logs to output stream', async () => {
      const output = await capture(logLevel, log => log[method]('foo'));
      (0, _expect2.default)(output).to.contain('foo');
    });
  });
};

describe('utils: createToolingLog(logLevel, output)', () => {
  it('is a readable stream', async () => {
    const log = (0, _tooling_log.createToolingLog)('debug');
    log.info('Foo');
    log.info('Bar');
    log.info('Baz');
    log.end();

    const output = await (0, _streams.createPromiseFromStreams)([log, (0, _streams.createConcatStream)('')]);

    (0, _expect2.default)(output).to.contain('Foo');
    (0, _expect2.default)(output).to.contain('Bar');
    (0, _expect2.default)(output).to.contain('Baz');
  });

  describe('log level', () => {
    describe('logLevel=silent', () => {
      nothingTest('silent', 'debug');
      nothingTest('silent', 'info');
      nothingTest('silent', 'error');
    });
    describe('logLevel=error', () => {
      nothingTest('error', 'debug');
      nothingTest('error', 'info');
      somethingTest('error', 'error');
    });
    describe('logLevel=info', () => {
      nothingTest('info', 'debug');
      somethingTest('info', 'info');
      somethingTest('info', 'error');
    });
    describe('logLevel=debug', () => {
      somethingTest('debug', 'debug');
      somethingTest('debug', 'info');
      somethingTest('debug', 'error');
    });
    describe('invalid logLevel', () => {
      it('throw error', () => {
        // avoid the impossiblity that a valid level is generated
        // by specifying a long length
        const level = chance.word({ length: 10 });

        (0, _expect2.default)(() => (0, _tooling_log.createToolingLog)(level)).to.throwError(level);
      });
    });
  });
});