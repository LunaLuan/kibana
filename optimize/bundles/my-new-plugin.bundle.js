webpackJsonp([5],{

/***/ 1247:
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
__webpack_require__(2208);
__webpack_require__(216);
__webpack_require__(217);
__webpack_require__(218);
__webpack_require__(219);
__webpack_require__(143);
__webpack_require__(220);
__webpack_require__(21).bootstrap();

/***/ }),

/***/ 2208:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _moment = __webpack_require__(17);

var _moment2 = _interopRequireDefault(_moment);

var _modules = __webpack_require__(2);

var _routes = __webpack_require__(34);

var _routes2 = _interopRequireDefault(_routes);

__webpack_require__(263);

__webpack_require__(2235);

var _index = __webpack_require__(2236);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_routes2.default.enable();
_routes2.default.when('/', {
  template: _index2.default,
  resolve: {
    currentTime: function currentTime($http) {
      return $http.get('../api/my-new-plugin/example').then(function (resp) {
        return resp.data.time;
      });
    }
  }
});

_modules.uiModules.get('app/my-new-plugin', []).controller('myNewPluginHelloWorld', function ($scope, $route, $interval) {
  $scope.title = 'My New Plugin';
  $scope.description = 'An awesome Kibana plugin';

  var currentTime = (0, _moment2.default)($route.current.locals.currentTime);
  $scope.currentTime = currentTime.format('HH:mm:ss');
  var unsubscribe = $interval(function () {
    $scope.currentTime = currentTime.add(1, 'second').format('HH:mm:ss');
  }, 1000);
  $scope.$watch('$destroy', unsubscribe);
});

/***/ }),

/***/ 2235:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 2236:
/***/ (function(module, exports) {

module.exports = "<div class=\"container\" ng-controller=\"myNewPluginHelloWorld\">\n  <div class=\"row\">\n    <div class=\"col-12-sm\">\n      <div class=\"well\">\n        <h2>Congratulations</h2>\n        <p class=\"lead\">You've successfully created your first Kibana Plugin!</p>\n      </div>\n      <h1>{{ title }}</h1>\n      <p class=\"lead\">{{ description }}</p>\n      <p>The current time is {{ currentTime }}</p>\n    </div>\n  </div>\n</div>\n"

/***/ })

},[1247]);
//# sourceMappingURL=my-new-plugin.bundle.js.map