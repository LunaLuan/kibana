'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = undefined;

var _tooling_log = require('../tooling_log');

const log = exports.log = (0, _tooling_log.createToolingLog)('debug');
log.pipe(process.stdout);