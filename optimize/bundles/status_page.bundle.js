webpackJsonp([4],{

/***/ 2265:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Test entry file
 *
 * This is programatically created and updated, do not modify
 *
 * context: {
  "env": "development",
  "sourceMaps": "#cheap-source-map",
  "kbnVersion": "7.0.0-alpha1",
  "buildNum": 8467,
  "plugins": [
    "console",
    "dev_mode",
    "elasticsearch",
    "input_control_vis",
    "kbn_doc_views",
    "kbn_vislib_vis_types",
    "kibana",
    "markdown_vis",
    "metric_vis",
    "metrics",
    "my-new-plugin",
    "region_map",
    "spy_modes",
    "state_session_storage_redirect",
    "status_page",
    "table_vis",
    "tagcloud",
    "testbed",
    "tests_bundle",
    "tile_map",
    "timelion",
    "vega"
  ]
}
 */

__webpack_require__(21);
__webpack_require__(2266);
__webpack_require__(216);
__webpack_require__(217);
__webpack_require__(218);
__webpack_require__(219);
__webpack_require__(145);
__webpack_require__(220);
__webpack_require__(21).bootstrap();

/***/ }),

/***/ 2266:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _notify = __webpack_require__(22);

__webpack_require__(263);

__webpack_require__(2267);

__webpack_require__(2270);

var _modules = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chrome = __webpack_require__(21).setRootTemplate(__webpack_require__(2271)).setRootController('ui', function ($http, buildNum, buildSha) {
  var ui = this;
  ui.loading = false;

  ui.buildInfo = {
    num: buildNum,
    sha: buildSha.substr(0, 8)
  };

  ui.refresh = function () {
    ui.loading = true;

    // go ahead and get the info you want
    return $http.get(chrome.addBasePath('/api/status')).then(function (resp) {

      if (ui.fetchError) {
        ui.fetchError.clear();
        ui.fetchError = null;
      }

      var data = resp.data;
      var metrics = data.metrics;
      if (metrics) {
        ui.metrics = [{
          name: 'Heap Total',
          value: _lodash2.default.get(metrics, 'process.mem.heap_max_in_bytes'),
          type: 'byte'
        }, {
          name: 'Heap Used',
          value: _lodash2.default.get(metrics, 'process.mem.heap_used_in_bytes'),
          type: 'byte'
        }, {
          name: 'Load',
          value: [_lodash2.default.get(metrics, 'os.cpu.load_average.1m'), _lodash2.default.get(metrics, 'os.cpu.load_average.5m'), _lodash2.default.get(metrics, 'os.cpu.load_average.15m')],
          type: 'float'
        }, {
          name: 'Response Time Avg',
          value: _lodash2.default.get(metrics, 'response_times.avg_in_millis'),
          type: 'ms'
        }, {
          name: 'Response Time Max',
          value: _lodash2.default.get(metrics, 'response_times.max_in_millis'),
          type: 'ms'
        }, {
          name: 'Requests Per Second',
          value: _lodash2.default.get(metrics, 'requests.total') * 1000 / _lodash2.default.get(metrics, 'collection_interval_in_millis')
        }];
      }

      ui.name = data.name;
      ui.statuses = data.status.statuses;

      var overall = data.status.overall;
      if (!ui.serverState || ui.serverState !== overall.state) {
        ui.serverState = overall.state;
        ui.serverStateMessage = overall.title;
      }
    }).catch(function () {
      if (ui.fetchError) return;
      ui.fetchError = _notify.notify.error('Failed to request server ui. Perhaps your server is down?');
      ui.metrics = ui.statuses = ui.overall = null;
    }).then(function () {
      ui.loading = false;
    });
  };

  ui.refresh();
});

_modules.uiModules.get('kibana').config(function (appSwitcherEnsureNavigationProvider) {
  appSwitcherEnsureNavigationProvider.forceNavigation(true);
});

/***/ }),

/***/ 2267:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _format_number = __webpack_require__(2268);

var _format_number2 = _interopRequireDefault(_format_number);

var _modules = __webpack_require__(2);

var _status_page_metric = __webpack_require__(2269);

var _status_page_metric2 = _interopRequireDefault(_status_page_metric);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_modules.uiModules.get('kibana', []).filter('statusMetric', function () {
  return function (input, type) {
    var metrics = [].concat(input);
    return metrics.map(function (metric) {
      return (0, _format_number2.default)(metric, type);
    }).join(', ');
  };
}).directive('statusPageMetric', function () {
  return {
    restrict: 'E',
    template: _status_page_metric2.default,
    scope: {
      metric: '='
    },
    controllerAs: 'metric'
  };
});

/***/ }),

/***/ 2268:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatNumber;

var _moment = __webpack_require__(17);

var _moment2 = _interopRequireDefault(_moment);

var _numeral = __webpack_require__(316);

var _numeral2 = _interopRequireDefault(_numeral);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function formatNumber(num, which) {
  var format = '0.00';
  var postfix = '';
  switch (which) {
    case 'time':
      return (0, _moment2.default)(num).format('HH:mm:ss');
    case 'byte':
      format += ' b';
      break;
    case 'ms':
      postfix = ' ms';
      break;
    case 'integer':
      format = '0';
      break;
  }
  return (0, _numeral2.default)(num).format(format) + postfix;
}
module.exports = exports['default'];

/***/ }),

/***/ 2269:
/***/ (function(module, exports) {

module.exports = "<div class=\"status_metric_wrapper col-md-4\">\r\n  <div class=\"content\">\r\n    <h3 class=\"title\">{{ metric.name }}</h3>\r\n    <h4 class=\"average\">{{ metric.value | statusMetric: metric.type}}</h4>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ 2270:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 2271:
/***/ (function(module, exports) {

module.exports = "<div data-test-subj=\"statusPageContainer\" class=\"container overall_state_default overall_state_{{ui.serverState}}\">\r\n  <header>\r\n    <h1>\r\n      Status: <span class=\"overall_state_color\">{{ ui.serverStateMessage }}</span>\r\n      <i class=\"fa overall_state_color state_icon\" />\r\n      <span class=\"pull-right\">\r\n        {{ ui.name }}\r\n      </span>\r\n    </h1>\r\n  </header>\r\n\r\n  <div class=\"row metrics_wrapper\">\r\n    <div ng-repeat=\"metric in ui.metrics\">\r\n      <status-page-metric metric=\"metric\"></status-page-metric>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"row statuses_wrapper\">\r\n    <h3>Status Breakdown</h3>\r\n\r\n    <div ng-if=\"!ui.statuses && ui.loading\" class=\"statuses_loading\">\r\n      <span class=\"spinner\"></span>\r\n    </div>\r\n\r\n    <h4 ng-if=\"!ui.statuses && !ui.loading\" class=\"statuses_missing\">\r\n      No status information available\r\n    </h4>\r\n\r\n    <table class=\"statuses\" data-test-subj=\"statusBreakdown\" ng-if=\"ui.statuses\">\r\n      <tr class=\"row\">\r\n        <th class=\"col-xs-4\" scope=\"col\">ID</th>\r\n        <th class=\"col-xs-8\" scope=\"col\">Status</th>\r\n      </tr>\r\n      <tr\r\n        ng-repeat=\"status in ui.statuses\"\r\n        class=\"status status_state_default status_state_{{status.state}} row\">\r\n\r\n        <td class=\"col-xs-4 status_id\">{{status.id}}</td>\r\n        <td class=\"col-xs-8 status_message\">\r\n          <i class=\"fa status_state_color status_state_icon\" />\r\n          {{status.message}}\r\n        </td>\r\n      </tr>\r\n    </table>\r\n  </div>\r\n\r\n  <footer class=\"row\">\r\n    <div class=\"col-xs-12 text-right build-info\">\r\n      Build {{::ui.buildInfo.num}}, Commit SHA {{::ui.buildInfo.sha}}\r\n    </div>\r\n  </footer>\r\n</div>\r\n"

/***/ })

},[2265]);
//# sourceMappingURL=status_page.bundle.js.map