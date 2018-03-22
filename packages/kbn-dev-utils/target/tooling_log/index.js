'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tooling_log = require('./tooling_log');

Object.defineProperty(exports, 'createToolingLog', {
  enumerable: true,
  get: function () {
    return _tooling_log.createToolingLog;
  }
});

var _log_levels = require('./log_levels');

Object.defineProperty(exports, 'pickLevelFromFlags', {
  enumerable: true,
  get: function () {
    return _log_levels.pickLevelFromFlags;
  }
});