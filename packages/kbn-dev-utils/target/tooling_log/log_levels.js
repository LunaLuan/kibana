'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pickLevelFromFlags = pickLevelFromFlags;
exports.parseLogLevel = parseLogLevel;
const LEVELS = ['silent', 'error', 'warning', 'info', 'debug', 'verbose'];

function pickLevelFromFlags(flags) {
  if (flags.verbose) return 'verbose';
  if (flags.debug) return 'debug';
  if (flags.quiet) return 'error';
  if (flags.silent) return 'silent';
  return 'info';
}

function parseLogLevel(name) {
  const i = LEVELS.indexOf(name);

  if (i === -1) {
    const msg = `Invalid log level "${name}" ` + `(expected one of ${LEVELS.join(',')})`;
    throw new Error(msg);
  }

  const flags = {};
  LEVELS.forEach((level, levelI) => {
    flags[level] = levelI <= i;
  });

  return { name, flags };
}