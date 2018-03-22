'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCliError = createCliError;
exports.isCliError = isCliError;
const $isCliError = Symbol('isCliError');

function createCliError(message) {
  const error = new Error(message);
  error[$isCliError] = true;
  return error;
}

function isCliError(error) {
  return error && !!error[$isCliError];
}