webpackJsonp([6],{

/***/ 2260:
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
__webpack_require__(2261);
__webpack_require__(216);
__webpack_require__(217);
__webpack_require__(218);
__webpack_require__(219);
__webpack_require__(143);
__webpack_require__(220);
__webpack_require__(21).bootstrap();

/***/ }),

/***/ 2261:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(263);

var _chrome = __webpack_require__(21);

var _chrome2 = _interopRequireDefault(_chrome);

var _state_hashing = __webpack_require__(495);

var _routes = __webpack_require__(34);

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_routes2.default.enable();
_routes2.default.when('/', {
  resolve: {
    url: function url(AppState, globalState, $window) {
      var redirectUrl = _chrome2.default.getInjected('redirectUrl');

      var hashedUrl = (0, _state_hashing.hashUrl)([new AppState(), globalState], redirectUrl);
      var url = _chrome2.default.addBasePath(hashedUrl);

      $window.location = url;
    }
  }
});

/***/ })

},[2260]);
//# sourceMappingURL=stateSessionStorageRedirect.bundle.js.map