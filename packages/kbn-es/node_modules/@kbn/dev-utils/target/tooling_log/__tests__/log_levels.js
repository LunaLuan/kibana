'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _log_levels = require('../log_levels');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const chance = new _chance2.default();

describe('parseLogLevel(logLevel).flags', () => {
  describe('logLevel=silent', () => {
    it('produces correct map', () => {
      (0, _expect2.default)((0, _log_levels.parseLogLevel)('silent').flags).to.eql({
        silent: true,
        error: false,
        warning: false,
        info: false,
        debug: false,
        verbose: false
      });
    });
  });

  describe('logLevel=error', () => {
    it('produces correct map', () => {
      (0, _expect2.default)((0, _log_levels.parseLogLevel)('error').flags).to.eql({
        silent: true,
        error: true,
        warning: false,
        info: false,
        debug: false,
        verbose: false
      });
    });
  });

  describe('logLevel=warning', () => {
    it('produces correct map', () => {
      (0, _expect2.default)((0, _log_levels.parseLogLevel)('warning').flags).to.eql({
        silent: true,
        error: true,
        warning: true,
        info: false,
        debug: false,
        verbose: false
      });
    });
  });

  describe('logLevel=info', () => {
    it('produces correct map', () => {
      (0, _expect2.default)((0, _log_levels.parseLogLevel)('info').flags).to.eql({
        silent: true,
        error: true,
        warning: true,
        info: true,
        debug: false,
        verbose: false
      });
    });
  });

  describe('logLevel=debug', () => {
    it('produces correct map', () => {
      (0, _expect2.default)((0, _log_levels.parseLogLevel)('debug').flags).to.eql({
        silent: true,
        error: true,
        warning: true,
        info: true,
        debug: true,
        verbose: false
      });
    });
  });

  describe('logLevel=verbose', () => {
    it('produces correct map', () => {
      (0, _expect2.default)((0, _log_levels.parseLogLevel)('verbose').flags).to.eql({
        silent: true,
        error: true,
        warning: true,
        info: true,
        debug: true,
        verbose: true
      });
    });
  });

  describe('invalid logLevel', () => {
    it('throws error', () => {
      // avoid the impossiblity that a valid level is generated
      // by specifying a long length
      const level = chance.word({ length: 10 });

      (0, _expect2.default)(() => (0, _log_levels.parseLogLevel)(level)).to.throwError(level);
    });
  });
});