webpackJsonp([2],{

/***/ 3427:
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
__webpack_require__(3428);
__webpack_require__(216);
__webpack_require__(217);
__webpack_require__(218);
__webpack_require__(219);
__webpack_require__(143);
__webpack_require__(220);
__webpack_require__(21).bootstrap();

/***/ }),

/***/ 3428:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(3429);

/***/ }),

/***/ 3429:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(60);

var _module = __webpack_require__(2).get('app/sense');

// mock the resize checker
_module.run(function () {
    _module.setupResizeCheckerForRootEditors = function () {};
});

__webpack_require__(21).setRootTemplate(__webpack_require__(3431)).setRootController(function () {
    window.QUnit = __webpack_require__(3432);

    __webpack_require__(3433);
    __webpack_require__(60);
    /* global QUnit */
    QUnit.config.autostart = false;
    QUnit.init();

    __webpack_require__(3434);
    __webpack_require__(3435);
    __webpack_require__(3438);
    __webpack_require__(3439);
    __webpack_require__(3440);
    __webpack_require__(3442);
    __webpack_require__(3454);
    __webpack_require__(3455);
    __webpack_require__(3457);
    __webpack_require__(3458);
    __webpack_require__(3459);

    console.log('all tests loaded');
    QUnit.start();
});

/***/ }),

/***/ 3431:
/***/ (function(module, exports) {

module.exports = "  <style type=\"text/css\">\r\n    #editor_container {\r\n      display: none;\r\n      position: absolute;\r\n      top: 20px;\r\n      bottom: 20px;\r\n      left: 20px;\r\n      right: 20px;\r\n      z-index: 200;\r\n      border: 1px solid #333;\r\n    }\r\n\r\n    #output_container {\r\n      display: none;\r\n      position: absolute;\r\n      height: 250px;\r\n      width: 350px;\r\n      bottom: 20px;\r\n      right: 20px;\r\n      z-index: 201;\r\n      border: 1px solid #333;\r\n    }\r\n\r\n    #editor, #output {\r\n      height: 100%;\r\n      width: 100%;\r\n      position: relative;\r\n    }\r\n  </style>\r\n<div id=\"qunit\"></div>\r\n<div id=\"editor_container\">\r\n  <div id=\"editor\"></div>\r\n</div>\r\n<div id=\"output_container\">\r\n  <div id=\"output\"></div>\r\n</div>\r\n"

/***/ }),

/***/ 3432:
/***/ (function(module, exports, __webpack_require__) {

/**
 * QUnit v1.10.0 - A JavaScript Unit Testing Framework
 *
 * http://qunitjs.com
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

(function () {

  var QUnit,
      config,
      onErrorFnPrev,
      testId = 0,
      fileName = (sourceFromStacktrace(0) || "" ).replace(/(:\d+)+\)?/, "").replace(/.+\//, ""),
      toString = Object.prototype.toString,
      hasOwn = Object.prototype.hasOwnProperty,
  // Keep a local reference to Date (GH-283)
      Date = window.Date,
      defined = {
        setTimeout: typeof window.setTimeout !== "undefined",
        sessionStorage: (function () {
          var x = "qunit-test-string";
          try {
            sessionStorage.setItem(x, x);
            sessionStorage.removeItem(x);
            return true;
          } catch (e) {
            return false;
          }
        }())
      };

  function Test(settings) {
    extend(this, settings);
    this.assertions = [];
    this.testNumber = ++Test.count;
  }

  Test.count = 0;

  Test.prototype = {
    init: function () {
      var a, b, li,
          tests = id("qunit-tests");

      if (tests) {
        b = document.createElement("strong");
        b.innerHTML = this.name;

        // `a` initialized at top of scope
        a = document.createElement("a");
        a.innerHTML = "Rerun";
        a.href = QUnit.url({ testNumber: this.testNumber });

        li = document.createElement("li");
        li.appendChild(b);
        li.appendChild(a);
        li.className = "running";
        li.id = this.id = "qunit-test-output" + testId++;

        tests.appendChild(li);
      }
    },
    setup: function () {
      if (this.module !== config.previousModule) {
        if (config.previousModule) {
          runLoggingCallbacks("moduleDone", QUnit, {
            name: config.previousModule,
            failed: config.moduleStats.bad,
            passed: config.moduleStats.all - config.moduleStats.bad,
            total: config.moduleStats.all
          });
        }
        config.previousModule = this.module;
        config.moduleStats = { all: 0, bad: 0 };
        runLoggingCallbacks("moduleStart", QUnit, {
          name: this.module
        });
      } else if (config.autorun) {
        runLoggingCallbacks("moduleStart", QUnit, {
          name: this.module
        });
      }

      config.current = this;

      this.testEnvironment = extend({
        setup: function () {
        },
        teardown: function () {
        }
      }, this.moduleTestEnvironment);

      runLoggingCallbacks("testStart", QUnit, {
        name: this.testName,
        module: this.module
      });

      // allow utility functions to access the current test environment
      // TODO why??
      QUnit.current_testEnvironment = this.testEnvironment;

      if (!config.pollution) {
        saveGlobal();
      }
      if (config.notrycatch) {
        this.testEnvironment.setup.call(this.testEnvironment);
        return;
      }
      try {
        this.testEnvironment.setup.call(this.testEnvironment);
      } catch (e) {
        QUnit.pushFailure("Setup failed on " + this.testName + ": " + e.message, extractStacktrace(e, 1));
      }
    },
    run: function () {
      config.current = this;

      var running = id("qunit-testresult");

      if (running) {
        running.innerHTML = "Running: <br/>" + this.name;
      }

      if (this.async) {
        QUnit.stop();
      }

      if (config.notrycatch) {
        this.callback.call(this.testEnvironment, QUnit.assert);
        return;
      }

      try {
        this.callback.call(this.testEnvironment, QUnit.assert);
      } catch (e) {
        QUnit.pushFailure("Died on test #" + (this.assertions.length + 1) + " " + this.stack + ": " + e.message, extractStacktrace(e, 0));
        // else next test will carry the responsibility
        saveGlobal();

        // Restart the tests if they're blocking
        if (config.blocking) {
          QUnit.start();
        }
      }
    },
    teardown: function () {
      config.current = this;
      if (config.notrycatch) {
        this.testEnvironment.teardown.call(this.testEnvironment);
        return;
      } else {
        try {
          this.testEnvironment.teardown.call(this.testEnvironment);
        } catch (e) {
          QUnit.pushFailure("Teardown failed on " + this.testName + ": " + e.message, extractStacktrace(e, 1));
        }
      }
      checkPollution();
    },
    finish: function () {
      config.current = this;
      if (config.requireExpects && this.expected == null) {
        QUnit.pushFailure("Expected number of assertions to be defined, but expect() was not called.", this.stack);
      } else if (this.expected != null && this.expected != this.assertions.length) {
        QUnit.pushFailure("Expected " + this.expected + " assertions, but " + this.assertions.length + " were run", this.stack);
      } else if (this.expected == null && !this.assertions.length) {
        QUnit.pushFailure("Expected at least one assertion, but none were run - call expect(0) to accept zero assertions.", this.stack);
      }

      var assertion, a, b, i, li, ol,
          test = this,
          good = 0,
          bad = 0,
          tests = id("qunit-tests");

      config.stats.all += this.assertions.length;
      config.moduleStats.all += this.assertions.length;

      if (tests) {
        ol = document.createElement("ol");

        for (i = 0; i < this.assertions.length; i++) {
          assertion = this.assertions[i];

          li = document.createElement("li");
          li.className = assertion.result ? "pass" : "fail";
          li.innerHTML = assertion.message || ( assertion.result ? "okay" : "failed" );
          ol.appendChild(li);

          if (assertion.result) {
            good++;
          } else {
            bad++;
            config.stats.bad++;
            config.moduleStats.bad++;
          }
        }

        // store result when possible
        if (QUnit.config.reorder && defined.sessionStorage) {
          if (bad) {
            sessionStorage.setItem("qunit-test-" + this.module + "-" + this.testName, bad);
          } else {
            sessionStorage.removeItem("qunit-test-" + this.module + "-" + this.testName);
          }
        }

        if (bad === 0) {
          ol.style.display = "none";
        }

        // `b` initialized at top of scope
        b = document.createElement("strong");
        b.innerHTML = this.name + " <b class='counts'>(<b class='failed'>" + bad + "</b>, <b class='passed'>" + good + "</b>, " + this.assertions.length + ")</b>";

        addEvent(b, "click", function () {
          var next = b.nextSibling.nextSibling,
              display = next.style.display;
          next.style.display = display === "none" ? "block" : "none";
        });

        addEvent(b, "dblclick", function (e) {
          var target = e && e.target ? e.target : window.event.srcElement;
          if (target.nodeName.toLowerCase() == "span" || target.nodeName.toLowerCase() == "b") {
            target = target.parentNode;
          }
          if (window.location && target.nodeName.toLowerCase() === "strong") {
            window.location = QUnit.url({ testNumber: test.testNumber });
          }
        });

        // `li` initialized at top of scope
        li = id(this.id);
        li.className = bad ? "fail" : "pass";
        li.removeChild(li.firstChild);
        a = li.firstChild;
        li.appendChild(b);
        li.appendChild(a);
        li.appendChild(ol);

      } else {
        for (i = 0; i < this.assertions.length; i++) {
          if (!this.assertions[i].result) {
            bad++;
            config.stats.bad++;
            config.moduleStats.bad++;
          }
        }
      }

      runLoggingCallbacks("testDone", QUnit, {
        name: this.testName,
        module: this.module,
        failed: bad,
        passed: this.assertions.length - bad,
        total: this.assertions.length
      });

      QUnit.reset();

      config.current = undefined;
    },

    queue: function () {
      var bad,
          test = this;

      synchronize(function () {
        test.init();
      });
      function run() {
        // each of these can by async
        synchronize(function () {
          test.setup();
        });
        synchronize(function () {
          test.run();
        });
        synchronize(function () {
          test.teardown();
        });
        synchronize(function () {
          test.finish();
        });
      }

      // `bad` initialized at top of scope
      // defer when previous test run passed, if storage is available
      bad = QUnit.config.reorder && defined.sessionStorage && +sessionStorage.getItem("qunit-test-" + this.module + "-" + this.testName);

      if (bad) {
        run();
      } else {
        synchronize(run, true);
      }
    }
  };

// Root QUnit object.
// `QUnit` initialized at top of scope
  QUnit = {

    // call on start of module test to prepend name to all tests
    module: function (name, testEnvironment) {
      config.currentModule = name;
      config.currentModuleTestEnvironment = testEnvironment;
      config.modules[name] = true;
    },

    asyncTest: function (testName, expected, callback) {
      if (arguments.length === 2) {
        callback = expected;
        expected = null;
      }

      QUnit.test(testName, expected, callback, true);
    },

    test: function (testName, expected, callback, async) {
      var test,
          name = "<span class='test-name'>" + escapeInnerText(testName) + "</span>";

      if (arguments.length === 2) {
        callback = expected;
        expected = null;
      }

      if (config.currentModule) {
        name = "<span class='module-name'>" + config.currentModule + "</span>: " + name;
      }

      test = new Test({
        name: name,
        testName: testName,
        expected: expected,
        async: async,
        callback: callback,
        module: config.currentModule,
        moduleTestEnvironment: config.currentModuleTestEnvironment,
        stack: sourceFromStacktrace(2)
      });

      if (!validTest(test)) {
        return;
      }

      test.queue();
    },

    // Specify the number of expected assertions to gurantee that failed test (no assertions are run at all) don't slip through.
    expect: function (asserts) {
      if (arguments.length === 1) {
        config.current.expected = asserts;
      } else {
        return config.current.expected;
      }
    },

    start: function (count) {
      config.semaphore -= count || 1;
      // don't start until equal number of stop-calls
      if (config.semaphore > 0) {
        return;
      }
      // ignore if start is called more often then stop
      if (config.semaphore < 0) {
        config.semaphore = 0;
      }
      // A slight delay, to avoid any current callbacks
      if (defined.setTimeout) {
        window.setTimeout(function () {
          if (config.semaphore > 0) {
            return;
          }
          if (config.timeout) {
            clearTimeout(config.timeout);
          }

          config.blocking = false;
          process(true);
        }, 13);
      } else {
        config.blocking = false;
        process(true);
      }
    },

    stop: function (count) {
      config.semaphore += count || 1;
      config.blocking = true;

      if (config.testTimeout && defined.setTimeout) {
        clearTimeout(config.timeout);
        config.timeout = window.setTimeout(function () {
          QUnit.ok(false, "Test timed out");
          config.semaphore = 1;
          QUnit.start();
        }, config.testTimeout);
      }
    }
  };

// Asssert helpers
// All of these must call either QUnit.push() or manually do:
// - runLoggingCallbacks( "log", .. );
// - config.current.assertions.push({ .. });
  QUnit.assert = {
    /**
     * Asserts rough true-ish result.
     * @name ok
     * @function
     * @example ok( "asdfasdf".length > 5, "There must be at least 5 chars" );
     */
    ok: function (result, msg) {
      if (!config.current) {
        throw new Error("ok() assertion outside test context, was " + sourceFromStacktrace(2));
      }
      result = !!result;

      var source,
          details = {
            module: config.current.module,
            name: config.current.testName,
            result: result,
            message: msg
          };

      msg = escapeInnerText(msg || (result ? "okay" : "failed" ));
      msg = "<span class='test-message'>" + msg + "</span>";

      if (!result) {
        source = sourceFromStacktrace(2);
        if (source) {
          details.source = source;
          msg += "<table><tr class='test-source'><th>Source: </th><td><pre>" + escapeInnerText(source) + "</pre></td></tr></table>";
        }
      }
      runLoggingCallbacks("log", QUnit, details);
      config.current.assertions.push({
        result: result,
        message: msg
      });
    },

    /**
     * Assert that the first two arguments are equal, with an optional message.
     * Prints out both actual and expected values.
     * @name equal
     * @function
     * @example equal( format( "Received {0} bytes.", 2), "Received 2 bytes.", "format() replaces {0} with next argument" );
     */
    equal: function (actual, expected, message) {
      QUnit.push(expected == actual, actual, expected, message);
    },

    /**
     * @name notEqual
     * @function
     */
    notEqual: function (actual, expected, message) {
      QUnit.push(expected != actual, actual, expected, message);
    },

    /**
     * @name deepEqual
     * @function
     */
    deepEqual: function (actual, expected, message) {
      QUnit.push(QUnit.equiv(actual, expected), actual, expected, message);
    },

    /**
     * @name notDeepEqual
     * @function
     */
    notDeepEqual: function (actual, expected, message) {
      QUnit.push(!QUnit.equiv(actual, expected), actual, expected, message);
    },

    /**
     * @name strictEqual
     * @function
     */
    strictEqual: function (actual, expected, message) {
      QUnit.push(expected === actual, actual, expected, message);
    },

    /**
     * @name notStrictEqual
     * @function
     */
    notStrictEqual: function (actual, expected, message) {
      QUnit.push(expected !== actual, actual, expected, message);
    },

    throws: function (block, expected, message) {
      var actual,
          ok = false;

      // 'expected' is optional
      if (typeof expected === "string") {
        message = expected;
        expected = null;
      }

      config.current.ignoreGlobalErrors = true;
      try {
        block.call(config.current.testEnvironment);
      } catch (e) {
        actual = e;
      }
      config.current.ignoreGlobalErrors = false;

      if (actual) {
        // we don't want to validate thrown error
        if (!expected) {
          ok = true;
          // expected is a regexp
        } else if (QUnit.objectType(expected) === "regexp") {
          ok = expected.test(actual);
          // expected is a constructor
        } else if (actual instanceof expected) {
          ok = true;
          // expected is a validation function which returns true is validation passed
        } else if (expected.call({}, actual) === true) {
          ok = true;
        }

        QUnit.push(ok, actual, null, message);
      } else {
        QUnit.pushFailure(message, null, 'No exception was thrown.');
      }
    }
  };

  /**
   * @deprecate since 1.8.0
   * Kept assertion helpers in root for backwards compatibility
   */
  extend(QUnit, QUnit.assert);

  /**
   * @deprecated since 1.9.0
   * Kept global "raises()" for backwards compatibility
   */
  QUnit.raises = QUnit.assert.throws;

  /**
   * @deprecated since 1.0.0, replaced with error pushes since 1.3.0
   * Kept to avoid TypeErrors for undefined methods.
   */
  QUnit.equals = function () {
    QUnit.push(false, false, false, "QUnit.equals has been deprecated since 2009 (e88049a0), use QUnit.equal instead");
  };
  QUnit.same = function () {
    QUnit.push(false, false, false, "QUnit.same has been deprecated since 2009 (e88049a0), use QUnit.deepEqual instead");
  };

// We want access to the constructor's prototype
  (function () {
    function F() {
    }

    F.prototype = QUnit;
    QUnit = new F();
    // Make F QUnit's constructor so that we can add to the prototype later
    QUnit.constructor = F;
  }());

  /**
   * Config object: Maintain internal state
   * Later exposed as QUnit.config
   * `config` initialized at top of scope
   */
  config = {
    // The queue of tests to run
    queue: [],

    // block until document ready
    blocking: true,

    // when enabled, show only failing tests
    // gets persisted through sessionStorage and can be changed in UI via checkbox
    hidepassed: false,

    // by default, run previously failed tests first
    // very useful in combination with "Hide passed tests" checked
    reorder: true,

    // by default, modify document.title when suite is done
    altertitle: true,

    // when enabled, all tests must call expect()
    requireExpects: false,

    // add checkboxes that are persisted in the query-string
    // when enabled, the id is set to `true` as a `QUnit.config` property
    urlConfig: [
      {
        id: "noglobals",
        label: "Check for Globals",
        tooltip: "Enabling this will test if any test introduces new properties on the `window` object. Stored as query-strings."
      },
      {
        id: "notrycatch",
        label: "No try-catch",
        tooltip: "Enabling this will run tests outside of a try-catch block. Makes debugging exceptions in IE reasonable. Stored as query-strings."
      }
    ],

    // Set of all modules.
    modules: {},

    // logging callback queues
    begin: [],
    done: [],
    log: [],
    testStart: [],
    testDone: [],
    moduleStart: [],
    moduleDone: []
  };

// Initialize more QUnit.config and QUnit.urlParams
  (function () {
    var i,
        location = window.location || { search: "", protocol: "file:" },
        params = location.search.slice(1).split("&"),
        length = params.length,
        urlParams = {},
        current;

    if (params[ 0 ]) {
      for (i = 0; i < length; i++) {
        current = params[ i ].split("=");
        current[ 0 ] = decodeURIComponent(current[ 0 ]);
        // allow just a key to turn on a flag, e.g., test.html?noglobals
        current[ 1 ] = current[ 1 ] ? decodeURIComponent(current[ 1 ]) : true;
        urlParams[ current[ 0 ] ] = current[ 1 ];
      }
    }

    QUnit.urlParams = urlParams;

    // String search anywhere in moduleName+testName
    config.filter = urlParams.filter;

    // Exact match of the module name
    config.module = urlParams.module;

    config.testNumber = parseInt(urlParams.testNumber, 10) || null;

    // Figure out if we're running the tests from a server or not
    QUnit.isLocal = location.protocol === "file:";
  }());

// Export global variables, unless an 'exports' object exists,
// in that case we assume we're in CommonJS (dealt with on the bottom of the script)
  if (false) {
    extend(window, QUnit);

    // Expose QUnit object
    window.QUnit = QUnit;
  }

// Extend QUnit object,
// these after set here because they should not be exposed as global functions
  extend(QUnit, {
    config: config,

    // Initialize the configuration options
    init: function () {
      extend(config, {
        stats: { all: 0, bad: 0 },
        moduleStats: { all: 0, bad: 0 },
        started: +new Date(),
        updateRate: 1000,
        blocking: false,
        autostart: true,
        autorun: false,
        filter: "",
        queue: [],
        semaphore: 0
      });

      var tests, banner, result,
          qunit = id("qunit");

      if (qunit) {
        qunit.innerHTML =
            "<h1 id='qunit-header'>" + escapeInnerText(document.title) + "</h1>" +
                "<h2 id='qunit-banner'></h2>" +
                "<div id='qunit-testrunner-toolbar'></div>" +
                "<h2 id='qunit-userAgent'></h2>" +
                "<ol id='qunit-tests'></ol>";
      }

      tests = id("qunit-tests");
      banner = id("qunit-banner");
      result = id("qunit-testresult");

      if (tests) {
        tests.innerHTML = "";
      }

      if (banner) {
        banner.className = "";
      }

      if (result) {
        result.parentNode.removeChild(result);
      }

      if (tests) {
        result = document.createElement("p");
        result.id = "qunit-testresult";
        result.className = "result";
        tests.parentNode.insertBefore(result, tests);
        result.innerHTML = "Running...<br/>&nbsp;";
      }
    },

    // Resets the test setup. Useful for tests that modify the DOM.
    reset: function () {
      var fixture = id("qunit-fixture");
      if (fixture) {
        fixture.innerHTML = config.fixture;
      }
    },

    // Trigger an event on an element.
    // @example triggerEvent( document.body, "click" );
    triggerEvent: function (elem, type, event) {
      if (document.createEvent) {
        event = document.createEvent("MouseEvents");
        event.initMouseEvent(type, true, true, elem.ownerDocument.defaultView,
            0, 0, 0, 0, 0, false, false, false, false, 0, null);

        elem.dispatchEvent(event);
      } else if (elem.fireEvent) {
        elem.fireEvent("on" + type);
      }
    },

    // Safe object type checking
    is: function (type, obj) {
      return QUnit.objectType(obj) == type;
    },

    objectType: function (obj) {
      if (typeof obj === "undefined") {
        return "undefined";
        // consider: typeof null === object
      }
      if (obj === null) {
        return "null";
      }

      var type = toString.call(obj).match(/^\[object\s(.*)\]$/)[1] || "";

      switch (type) {
        case "Number":
          if (isNaN(obj)) {
            return "nan";
          }
          return "number";
        case "String":
        case "Boolean":
        case "Array":
        case "Date":
        case "RegExp":
        case "Function":
          return type.toLowerCase();
      }
      if (typeof obj === "object") {
        return "object";
      }
      return undefined;
    },

    push: function (result, actual, expected, message) {
      if (!config.current) {
        throw new Error("assertion outside test context, was " + sourceFromStacktrace());
      }

      var output, source,
          details = {
            module: config.current.module,
            name: config.current.testName,
            result: result,
            message: message,
            actual: actual,
            expected: expected
          };

      message = escapeInnerText(message) || ( result ? "okay" : "failed" );
      message = "<span class='test-message'>" + message + "</span>";
      output = message;

      if (!result) {
        expected = escapeInnerText(QUnit.jsDump.parse(expected));
        actual = escapeInnerText(QUnit.jsDump.parse(actual));
        output += "<table><tr class='test-expected'><th>Expected: </th><td><pre>" + expected + "</pre></td></tr>";

        if (actual != expected) {
          output += "<tr class='test-actual'><th>Result: </th><td><pre>" + actual + "</pre></td></tr>";
          output += "<tr class='test-diff'><th>Diff: </th><td><pre>" + QUnit.diff(expected, actual) + "</pre></td></tr>";
        }

        source = sourceFromStacktrace();

        if (source) {
          details.source = source;
          output += "<tr class='test-source'><th>Source: </th><td><pre>" + escapeInnerText(source) + "</pre></td></tr>";
        }

        output += "</table>";
      }

      runLoggingCallbacks("log", QUnit, details);

      config.current.assertions.push({
        result: !!result,
        message: output
      });
    },

    pushFailure: function (message, source, actual) {
      if (!config.current) {
        throw new Error("pushFailure() assertion outside test context, was " + sourceFromStacktrace(2));
      }

      var output,
          details = {
            module: config.current.module,
            name: config.current.testName,
            result: false,
            message: message
          };

      message = escapeInnerText(message) || "error";
      message = "<span class='test-message'>" + message + "</span>";
      output = message;

      output += "<table>";

      if (actual) {
        output += "<tr class='test-actual'><th>Result: </th><td><pre>" + escapeInnerText(actual) + "</pre></td></tr>";
      }

      if (source) {
        details.source = source;
        output += "<tr class='test-source'><th>Source: </th><td><pre>" + escapeInnerText(source) + "</pre></td></tr>";
      }

      output += "</table>";

      runLoggingCallbacks("log", QUnit, details);

      config.current.assertions.push({
        result: false,
        message: output
      });
    },

    url: function (params) {
      params = extend(extend({}, QUnit.urlParams), params);
      var key,
          querystring = "?";

      for (key in params) {
        if (!hasOwn.call(params, key)) {
          continue;
        }
        querystring += encodeURIComponent(key) + "=" +
            encodeURIComponent(params[ key ]) + "&";
      }
      return window.location.pathname + querystring.slice(0, -1);
    },

    extend: extend,
    id: id,
    addEvent: addEvent
    // load, equiv, jsDump, diff: Attached later
  });

  /**
   * @deprecated: Created for backwards compatibility with test runner that set the hook function
   * into QUnit.{hook}, instead of invoking it and passing the hook function.
   * QUnit.constructor is set to the empty F() above so that we can add to it's prototype here.
   * Doing this allows us to tell if the following methods have been overwritten on the actual
   * QUnit object.
   */
  extend(QUnit.constructor.prototype, {

    // Logging callbacks; all receive a single argument with the listed properties
    // run test/logs.html for any related changes
    begin: registerLoggingCallback("begin"),

    // done: { failed, passed, total, runtime }
    done: registerLoggingCallback("done"),

    // log: { result, actual, expected, message }
    log: registerLoggingCallback("log"),

    // testStart: { name }
    testStart: registerLoggingCallback("testStart"),

    // testDone: { name, failed, passed, total }
    testDone: registerLoggingCallback("testDone"),

    // moduleStart: { name }
    moduleStart: registerLoggingCallback("moduleStart"),

    // moduleDone: { name, failed, passed, total }
    moduleDone: registerLoggingCallback("moduleDone")
  });

  if (typeof document === "undefined" || document.readyState === "complete") {
    config.autorun = true;
  }

  QUnit.load = function () {
    runLoggingCallbacks("begin", QUnit, {});

    // Initialize the config, saving the execution queue
    var banner, filter, i, label, len, main, ol, toolbar, userAgent, val, urlConfigCheckboxes, moduleFilter,
        numModules = 0,
        moduleFilterHtml = "",
        urlConfigHtml = "",
        oldconfig = extend({}, config);

    QUnit.init();
    extend(config, oldconfig);

    config.blocking = false;

    len = config.urlConfig.length;

    for (i = 0; i < len; i++) {
      val = config.urlConfig[i];
      if (typeof val === "string") {
        val = {
          id: val,
          label: val,
          tooltip: "[no tooltip available]"
        };
      }
      config[ val.id ] = QUnit.urlParams[ val.id ];
      urlConfigHtml += "<input id='qunit-urlconfig-" + val.id + "' name='" + val.id + "' type='checkbox'" + ( config[ val.id ] ? " checked='checked'" : "" ) + " title='" + val.tooltip + "'><label for='qunit-urlconfig-" + val.id + "' title='" + val.tooltip + "'>" + val.label + "</label>";
    }

    moduleFilterHtml += "<label for='qunit-modulefilter'>Module: </label><select id='qunit-modulefilter' name='modulefilter'><option value='' " + ( config.module === undefined ? "selected" : "" ) + ">< All Modules ></option>";
    for (i in config.modules) {
      if (config.modules.hasOwnProperty(i)) {
        numModules += 1;
        moduleFilterHtml += "<option value='" + encodeURIComponent(i) + "' " + ( config.module === i ? "selected" : "" ) + ">" + i + "</option>";
      }
    }
    moduleFilterHtml += "</select>";

    // `userAgent` initialized at top of scope
    userAgent = id("qunit-userAgent");
    if (userAgent) {
      userAgent.innerHTML = navigator.userAgent;
    }

    // `banner` initialized at top of scope
    banner = id("qunit-header");
    if (banner) {
      banner.innerHTML = "<a href='" + QUnit.url({ filter: undefined, module: undefined, testNumber: undefined }) + "'>" + banner.innerHTML + "</a> ";
    }

    // `toolbar` initialized at top of scope
    toolbar = id("qunit-testrunner-toolbar");
    if (toolbar) {
      // `filter` initialized at top of scope
      filter = document.createElement("input");
      filter.type = "checkbox";
      filter.id = "qunit-filter-pass";

      addEvent(filter, "click", function () {
        var tmp,
            ol = document.getElementById("qunit-tests");

        if (filter.checked) {
          ol.className = ol.className + " hidepass";
        } else {
          tmp = " " + ol.className.replace(/[\n\t\r]/g, " ") + " ";
          ol.className = tmp.replace(/ hidepass /, " ");
        }
        if (defined.sessionStorage) {
          if (filter.checked) {
            sessionStorage.setItem("qunit-filter-passed-tests", "true");
          } else {
            sessionStorage.removeItem("qunit-filter-passed-tests");
          }
        }
      });

      if (config.hidepassed || defined.sessionStorage && sessionStorage.getItem("qunit-filter-passed-tests")) {
        filter.checked = true;
        // `ol` initialized at top of scope
        ol = document.getElementById("qunit-tests");
        ol.className = ol.className + " hidepass";
      }
      toolbar.appendChild(filter);

      // `label` initialized at top of scope
      label = document.createElement("label");
      label.setAttribute("for", "qunit-filter-pass");
      label.setAttribute("title", "Only show tests and assertons that fail. Stored in sessionStorage.");
      label.innerHTML = "Hide passed tests";
      toolbar.appendChild(label);

      urlConfigCheckboxes = document.createElement('span');
      urlConfigCheckboxes.innerHTML = urlConfigHtml;
      addEvent(urlConfigCheckboxes, "change", function (event) {
        var params = {};
        params[ event.target.name ] = event.target.checked ? true : undefined;
        window.location = QUnit.url(params);
      });
      toolbar.appendChild(urlConfigCheckboxes);

      if (numModules > 1) {
        moduleFilter = document.createElement('span');
        moduleFilter.setAttribute('id', 'qunit-modulefilter-container');
        moduleFilter.innerHTML = moduleFilterHtml;
        addEvent(moduleFilter, "change", function () {
          var selectBox = moduleFilter.getElementsByTagName("select")[0],
              selectedModule = decodeURIComponent(selectBox.options[selectBox.selectedIndex].value);

          window.location = QUnit.url({ module: ( selectedModule === "" ) ? undefined : selectedModule });
        });
        toolbar.appendChild(moduleFilter);
      }
    }

    // `main` initialized at top of scope
    main = id("qunit-fixture");
    if (main) {
      config.fixture = main.innerHTML;
    }

    if (config.autostart) {
      QUnit.start();
    }
  };

  addEvent(window, "load", QUnit.load);

// `onErrorFnPrev` initialized at top of scope
// Preserve other handlers
  onErrorFnPrev = window.onerror;

// Cover uncaught exceptions
// Returning true will surpress the default browser handler,
// returning false will let it run.
  window.onerror = function (error, filePath, linerNr) {
    var ret = false;
    if (onErrorFnPrev) {
      ret = onErrorFnPrev(error, filePath, linerNr);
    }

    // Treat return value as window.onerror itself does,
    // Only do our handling if not surpressed.
    if (ret !== true) {
      if (QUnit.config.current) {
        if (QUnit.config.current.ignoreGlobalErrors) {
          return true;
        }
        QUnit.pushFailure(error, filePath + ":" + linerNr);
      } else {
        QUnit.test("global failure", extend(function () {
          QUnit.pushFailure(error, filePath + ":" + linerNr);
        }, { validTest: validTest }));
      }
      return false;
    }

    return ret;
  };

  function done() {
    config.autorun = true;

    // Log the last module results
    if (config.currentModule) {
      runLoggingCallbacks("moduleDone", QUnit, {
        name: config.currentModule,
        failed: config.moduleStats.bad,
        passed: config.moduleStats.all - config.moduleStats.bad,
        total: config.moduleStats.all
      });
    }

    var i, key,
        banner = id("qunit-banner"),
        tests = id("qunit-tests"),
        runtime = +new Date() - config.started,
        passed = config.stats.all - config.stats.bad,
        html = [
          "Tests completed in ",
          runtime,
          " milliseconds.<br/>",
          "<span class='passed'>",
          passed,
          "</span> tests of <span class='total'>",
          config.stats.all,
          "</span> passed, <span class='failed'>",
          config.stats.bad,
          "</span> failed."
        ].join("");

    if (banner) {
      banner.className = ( config.stats.bad ? "qunit-fail" : "qunit-pass" );
    }

    if (tests) {
      id("qunit-testresult").innerHTML = html;
    }

    if (config.altertitle && typeof document !== "undefined" && document.title) {
      // show ✖ for good, ✔ for bad suite result in title
      // use escape sequences in case file gets loaded with non-utf-8-charset
      document.title = [
        ( config.stats.bad ? "\u2716" : "\u2714" ),
        document.title.replace(/^[\u2714\u2716] /i, "")
      ].join(" ");
    }

    // clear own sessionStorage items if all tests passed
    if (config.reorder && defined.sessionStorage && config.stats.bad === 0) {
      // `key` & `i` initialized at top of scope
      for (i = 0; i < sessionStorage.length; i++) {
        key = sessionStorage.key(i++);
        if (key.indexOf("qunit-test-") === 0) {
          sessionStorage.removeItem(key);
        }
      }
    }

    // scroll back to top to show results
    if (window.scrollTo) {
      window.scrollTo(0, 0);
    }

    runLoggingCallbacks("done", QUnit, {
      failed: config.stats.bad,
      passed: passed,
      total: config.stats.all,
      runtime: runtime
    });
  }

  /** @return Boolean: true if this test should be ran */
  function validTest(test) {
    var include,
        filter = config.filter && config.filter.toLowerCase(),
        module = config.module && config.module.toLowerCase(),
        fullName = (test.module + ": " + test.testName).toLowerCase();

    // Internally-generated tests are always valid
    if (test.callback && test.callback.validTest === validTest) {
      delete test.callback.validTest;
      return true;
    }

    if (config.testNumber) {
      return test.testNumber === config.testNumber;
    }

    if (module && ( !test.module || test.module.toLowerCase() !== module )) {
      return false;
    }

    if (!filter) {
      return true;
    }

    include = filter.charAt(0) !== "!";
    if (!include) {
      filter = filter.slice(1);
    }

    // If the filter matches, we need to honour include
    if (fullName.indexOf(filter) !== -1) {
      return include;
    }

    // Otherwise, do the opposite
    return !include;
  }

// so far supports only Firefox, Chrome and Opera (buggy), Safari (for real exceptions)
// Later Safari and IE10 are supposed to support error.stack as well
// See also https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error/Stack
  function extractStacktrace(e, offset) {
    offset = offset === undefined ? 3 : offset;

    var stack, include, i, regex;

    if (e.stacktrace) {
      // Opera
      return e.stacktrace.split("\n")[ offset + 3 ];
    } else if (e.stack) {
      // Firefox, Chrome
      stack = e.stack.split("\n");
      if (/^error$/i.test(stack[0])) {
        stack.shift();
      }
      if (fileName) {
        include = [];
        for (i = offset; i < stack.length; i++) {
          if (stack[ i ].indexOf(fileName) != -1) {
            break;
          }
          include.push(stack[ i ]);
        }
        if (include.length) {
          return include.join("\n");
        }
      }
      return stack[ offset ];
    } else if (e.sourceURL) {
      // Safari, PhantomJS
      // hopefully one day Safari provides actual stacktraces
      // exclude useless self-reference for generated Error objects
      if (/qunit.js$/.test(e.sourceURL)) {
        return;
      }
      // for actual exceptions, this is useful
      return e.sourceURL + ":" + e.line;
    }
  }

  function sourceFromStacktrace(offset) {
    try {
      throw new Error();
    } catch (e) {
      return extractStacktrace(e, offset);
    }
  }

  function escapeInnerText(s) {
    if (!s) {
      return "";
    }
    s = s + "";
    return s.replace(/[\&<>]/g, function (s) {
      switch (s) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        default:
          return s;
      }
    });
  }

  function synchronize(callback, last) {
    config.queue.push(callback);

    if (config.autorun && !config.blocking) {
      process(last);
    }
  }

  function process(last) {
    function next() {
      process(last);
    }

    var start = new Date().getTime();
    config.depth = config.depth ? config.depth + 1 : 1;

    while (config.queue.length && !config.blocking) {
      if (!defined.setTimeout || config.updateRate <= 0 || ( ( new Date().getTime() - start ) < config.updateRate )) {
        config.queue.shift()();
      } else {
        window.setTimeout(next, 13);
        break;
      }
    }
    config.depth--;
    if (last && !config.blocking && !config.queue.length && config.depth === 0) {
      done();
    }
  }

  function saveGlobal() {
    config.pollution = [];

    if (config.noglobals) {
      for (var key in window) {
        // in Opera sometimes DOM element ids show up here, ignore them
        if (!hasOwn.call(window, key) || /^qunit-test-output/.test(key)) {
          continue;
        }
        config.pollution.push(key);
      }
    }
  }

  function checkPollution(name) {
    var newGlobals,
        deletedGlobals,
        old = config.pollution;

    saveGlobal();

    newGlobals = diff(config.pollution, old);
    if (newGlobals.length > 0) {
      QUnit.pushFailure("Introduced global variable(s): " + newGlobals.join(", "));
    }

    deletedGlobals = diff(old, config.pollution);
    if (deletedGlobals.length > 0) {
      QUnit.pushFailure("Deleted global variable(s): " + deletedGlobals.join(", "));
    }
  }

// returns a new Array with the elements that are in a but not in b
  function diff(a, b) {
    var i, j,
        result = a.slice();

    for (i = 0; i < result.length; i++) {
      for (j = 0; j < b.length; j++) {
        if (result[i] === b[j]) {
          result.splice(i, 1);
          i--;
          break;
        }
      }
    }
    return result;
  }

  function extend(a, b) {
    for (var prop in b) {
      if (b[ prop ] === undefined) {
        delete a[ prop ];

        // Avoid "Member not found" error in IE8 caused by setting window.constructor
      } else if (prop !== "constructor" || a !== window) {
        a[ prop ] = b[ prop ];
      }
    }

    return a;
  }

  function addEvent(elem, type, fn) {
    if (elem.addEventListener) {
      elem.addEventListener(type, fn, false);
    } else if (elem.attachEvent) {
      elem.attachEvent("on" + type, fn);
    } else {
      fn();
    }
  }

  function id(name) {
    return !!( typeof document !== "undefined" && document && document.getElementById ) &&
        document.getElementById(name);
  }

  function registerLoggingCallback(key) {
    return function (callback) {
      config[key].push(callback);
    };
  }

// Supports deprecated method of completely overwriting logging callbacks
  function runLoggingCallbacks(key, scope, args) {
    //debugger;
    var i, callbacks;
    if (QUnit.hasOwnProperty(key)) {
      QUnit[ key ].call(scope, args);
    } else {
      callbacks = config[ key ];
      for (i = 0; i < callbacks.length; i++) {
        callbacks[ i ].call(scope, args);
      }
    }
  }

// Test for equality any JavaScript type.
// Author: Philippe Rathé <prathe@gmail.com>
  QUnit.equiv = (function () {

    // Call the o related callback with the given arguments.
    function bindCallbacks(o, callbacks, args) {
      var prop = QUnit.objectType(o);
      if (prop) {
        if (QUnit.objectType(callbacks[ prop ]) === "function") {
          return callbacks[ prop ].apply(callbacks, args);
        } else {
          return callbacks[ prop ]; // or undefined
        }
      }
    }

    // the real equiv function
    var innerEquiv,
    // stack to decide between skip/abort functions
        callers = [],
    // stack to avoiding loops from circular referencing
        parents = [],

        getProto = Object.getPrototypeOf || function (obj) {
          return obj.__proto__;
        },
        callbacks = (function () {

          // for string, boolean, number and null
          function useStrictEquality(b, a) {
            if (b instanceof a.constructor || a instanceof b.constructor) {
              // to catch short annotaion VS 'new' annotation of a
              // declaration
              // e.g. var i = 1;
              // var j = new Number(1);
              return a == b;
            } else {
              return a === b;
            }
          }

          return {
            "string": useStrictEquality,
            "boolean": useStrictEquality,
            "number": useStrictEquality,
            "null": useStrictEquality,
            "undefined": useStrictEquality,

            "nan": function (b) {
              return isNaN(b);
            },

            "date": function (b, a) {
              return QUnit.objectType(b) === "date" && a.valueOf() === b.valueOf();
            },

            "regexp": function (b, a) {
              return QUnit.objectType(b) === "regexp" &&
                // the regex itself
                  a.source === b.source &&
                // and its modifers
                  a.global === b.global &&
                // (gmi) ...
                  a.ignoreCase === b.ignoreCase &&
                  a.multiline === b.multiline &&
                  a.sticky === b.sticky;
            },

            // - skip when the property is a method of an instance (OOP)
            // - abort otherwise,
            // initial === would have catch identical references anyway
            "function": function () {
              var caller = callers[callers.length - 1];
              return caller !== Object && typeof caller !== "undefined";
            },

            "array": function (b, a) {
              var i, j, len, loop;

              // b could be an object literal here
              if (QUnit.objectType(b) !== "array") {
                return false;
              }

              len = a.length;
              if (len !== b.length) {
                // safe and faster
                return false;
              }

              // track reference to avoid circular references
              parents.push(a);
              for (i = 0; i < len; i++) {
                loop = false;
                for (j = 0; j < parents.length; j++) {
                  if (parents[j] === a[i]) {
                    loop = true;// dont rewalk array
                  }
                }
                if (!loop && !innerEquiv(a[i], b[i])) {
                  parents.pop();
                  return false;
                }
              }
              parents.pop();
              return true;
            },

            "object": function (b, a) {
              var i, j, loop,
              // Default to true
                  eq = true,
                  aProperties = [],
                  bProperties = [];

              // comparing constructors is more strict than using
              // instanceof
              if (a.constructor !== b.constructor) {
                // Allow objects with no prototype to be equivalent to
                // objects with Object as their constructor.
                if (!(( getProto(a) === null && getProto(b) === Object.prototype ) ||
                    ( getProto(b) === null && getProto(a) === Object.prototype ) )) {
                  return false;
                }
              }

              // stack constructor before traversing properties
              callers.push(a.constructor);
              // track reference to avoid circular references
              parents.push(a);

              for (i in a) { // be strict: don't ensures hasOwnProperty
                // and go deep
                loop = false;
                for (j = 0; j < parents.length; j++) {
                  if (parents[j] === a[i]) {
                    // don't go down the same path twice
                    loop = true;
                  }
                }
                aProperties.push(i); // collect a's properties

                if (!loop && !innerEquiv(a[i], b[i])) {
                  eq = false;
                  break;
                }
              }

              callers.pop(); // unstack, we are done
              parents.pop();

              for (i in b) {
                bProperties.push(i); // collect b's properties
              }

              // Ensures identical properties name
              return eq && innerEquiv(aProperties.sort(), bProperties.sort());
            }
          };
        }());

    innerEquiv = function () { // can take multiple arguments
      var args = [].slice.apply(arguments);
      if (args.length < 2) {
        return true; // end transition
      }

      return (function (a, b) {
        if (a === b) {
          return true; // catch the most you can
        } else if (a === null || b === null || typeof a === "undefined" ||
            typeof b === "undefined" ||
            QUnit.objectType(a) !== QUnit.objectType(b)) {
          return false; // don't lose time with error prone cases
        } else {
          return bindCallbacks(a, callbacks, [ b, a ]);
        }

        // apply transition with (1..n) arguments
      }(args[0], args[1]) && arguments.callee.apply(this, args.splice(1, args.length - 1)) );
    };

    return innerEquiv;
  }());

  /**
   * jsDump Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com |
   * http://flesler.blogspot.com Licensed under BSD
   * (http://www.opensource.org/licenses/bsd-license.php) Date: 5/15/2008
   *
   * @projectDescription Advanced and extensible data dumping for Javascript.
   * @version 1.0.0
   * @author Ariel Flesler
   * @link {http://flesler.blogspot.com/2008/05/jsdump-pretty-dump-of-any-javascript.html}
   */
  QUnit.jsDump = (function () {
    function quote(str) {
      return '"' + str.toString().replace(/"/g, '\\"') + '"';
    }

    function literal(o) {
      return o + "";
    }

    function join(pre, arr, post) {
      var s = jsDump.separator(),
          base = jsDump.indent(),
          inner = jsDump.indent(1);
      if (arr.join) {
        arr = arr.join("," + s + inner);
      }
      if (!arr) {
        return pre + post;
      }
      return [ pre, inner + arr, base + post ].join(s);
    }

    function array(arr, stack) {
      var i = arr.length, ret = new Array(i);
      this.up();
      while (i--) {
        ret[i] = this.parse(arr[i], undefined, stack);
      }
      this.down();
      return join("[", ret, "]");
    }

    var reName = /^function (\w+)/,
        jsDump = {
          parse: function (obj, type, stack) { //type is used mostly internally, you can fix a (custom)type in advance
            stack = stack || [ ];
            var inStack, res,
                parser = this.parsers[ type || this.typeOf(obj) ];

            type = typeof parser;
            inStack = inArray(obj, stack);

            if (inStack != -1) {
              return "recursion(" + (inStack - stack.length) + ")";
            }
            //else
            if (type == "function") {
              stack.push(obj);
              res = parser.call(this, obj, stack);
              stack.pop();
              return res;
            }
            // else
            return ( type == "string" ) ? parser : this.parsers.error;
          },
          typeOf: function (obj) {
            var type;
            if (obj === null) {
              type = "null";
            } else if (typeof obj === "undefined") {
              type = "undefined";
            } else if (QUnit.is("regexp", obj)) {
              type = "regexp";
            } else if (QUnit.is("date", obj)) {
              type = "date";
            } else if (QUnit.is("function", obj)) {
              type = "function";
            } else if (typeof obj.setInterval !== undefined && typeof obj.document !== "undefined" && typeof obj.nodeType === "undefined") {
              type = "window";
            } else if (obj.nodeType === 9) {
              type = "document";
            } else if (obj.nodeType) {
              type = "node";
            } else if (
            // native arrays
                toString.call(obj) === "[object Array]" ||
                  // NodeList objects
                    ( typeof obj.length === "number" && typeof obj.item !== "undefined" && ( obj.length ? obj.item(0) === obj[0] : ( obj.item(0) === null && typeof obj[0] === "undefined" ) ) )
                ) {
              type = "array";
            } else {
              type = typeof obj;
            }
            return type;
          },
          separator: function () {
            return this.multiline ? this.HTML ? "<br />" : "\n" : this.HTML ? "&nbsp;" : " ";
          },
          indent: function (extra) {// extra can be a number, shortcut for increasing-calling-decreasing
            if (!this.multiline) {
              return "";
            }
            var chr = this.indentChar;
            if (this.HTML) {
              chr = chr.replace(/\t/g, "   ").replace(/ /g, "&nbsp;");
            }
            return new Array(this._depth_ + (extra || 0)).join(chr);
          },
          up: function (a) {
            this._depth_ += a || 1;
          },
          down: function (a) {
            this._depth_ -= a || 1;
          },
          setParser: function (name, parser) {
            this.parsers[name] = parser;
          },
          // The next 3 are exposed so you can use them
          quote: quote,
          literal: literal,
          join: join,
          //
          _depth_: 1,
          // This is the list of parsers, to modify them, use jsDump.setParser
          parsers: {
            window: "[Window]",
            document: "[Document]",
            error: "[ERROR]", //when no parser is found, shouldn"t happen
            unknown: "[Unknown]",
            "null": "null",
            "undefined": "undefined",
            "function": function (fn) {
              var ret = "function",
                  name = "name" in fn ? fn.name : (reName.exec(fn) || [])[1];//functions never have name in IE

              if (name) {
                ret += " " + name;
              }
              ret += "( ";

              ret = [ ret, QUnit.jsDump.parse(fn, "functionArgs"), "){" ].join("");
              return join(ret, QUnit.jsDump.parse(fn, "functionCode"), "}");
            },
            array: array,
            nodelist: array,
            "arguments": array,
            object: function (map, stack) {
              var ret = [ ], keys, key, val, i;
              QUnit.jsDump.up();
              if (Object.keys) {
                keys = Object.keys(map);
              } else {
                keys = [];
                for (key in map) {
                  keys.push(key);
                }
              }
              keys.sort();
              for (i = 0; i < keys.length; i++) {
                key = keys[ i ];
                val = map[ key ];
                ret.push(QUnit.jsDump.parse(key, "key") + ": " + QUnit.jsDump.parse(val, undefined, stack));
              }
              QUnit.jsDump.down();
              return join("{", ret, "}");
            },
            node: function (node) {
              var a, val,
                  open = QUnit.jsDump.HTML ? "&lt;" : "<",
                  close = QUnit.jsDump.HTML ? "&gt;" : ">",
                  tag = node.nodeName.toLowerCase(),
                  ret = open + tag;

              for (a in QUnit.jsDump.DOMAttrs) {
                val = node[ QUnit.jsDump.DOMAttrs[a] ];
                if (val) {
                  ret += " " + a + "=" + QUnit.jsDump.parse(val, "attribute");
                }
              }
              return ret + close + open + "/" + tag + close;
            },
            functionArgs: function (fn) {//function calls it internally, it's the arguments part of the function
              var args,
                  l = fn.length;

              if (!l) {
                return "";
              }

              args = new Array(l);
              while (l--) {
                args[l] = String.fromCharCode(97 + l);//97 is 'a'
              }
              return " " + args.join(", ") + " ";
            },
            key: quote, //object calls it internally, the key part of an item in a map
            functionCode: "[code]", //function calls it internally, it's the content of the function
            attribute: quote, //node calls it internally, it's an html attribute value
            string: quote,
            date: quote,
            regexp: literal, //regex
            number: literal,
            "boolean": literal
          },
          DOMAttrs: {
            //attributes to dump from nodes, name=>realName
            id: "id",
            name: "name",
            "class": "className"
          },
          HTML: false,//if true, entities are escaped ( <, >, \t, space and \n )
          indentChar: "  ",//indentation unit
          multiline: true //if true, items in a collection, are separated by a \n, else just a space.
        };

    return jsDump;
  }());

// from Sizzle.js
  function getText(elems) {
    var i, elem,
        ret = "";

    for (i = 0; elems[i]; i++) {
      elem = elems[i];

      // Get the text from text nodes and CDATA nodes
      if (elem.nodeType === 3 || elem.nodeType === 4) {
        ret += elem.nodeValue;

        // Traverse everything else, except comment nodes
      } else if (elem.nodeType !== 8) {
        ret += getText(elem.childNodes);
      }
    }

    return ret;
  }

// from jquery.js
  function inArray(elem, array) {
    if (array.indexOf) {
      return array.indexOf(elem);
    }

    for (var i = 0, length = array.length; i < length; i++) {
      if (array[ i ] === elem) {
        return i;
      }
    }

    return -1;
  }

  /*
   * Javascript Diff Algorithm
   *  By John Resig (http://ejohn.org/)
   *  Modified by Chu Alan "sprite"
   *
   * Released under the MIT license.
   *
   * More Info:
   *  http://ejohn.org/projects/javascript-diff-algorithm/
   *
   * Usage: QUnit.diff(expected, actual)
   *
   * QUnit.diff( "the quick brown fox jumped over", "the quick fox jumps over" ) == "the  quick <del>brown </del> fox <del>jumped </del><ins>jumps </ins> over"
   */
  QUnit.diff = (function () {
    function diff(o, n) {
      var i,
          ns = {},
          os = {};

      for (i = 0; i < n.length; i++) {
        if (ns[ n[i] ] == null) {
          ns[ n[i] ] = {
            rows: [],
            o: null
          };
        }
        ns[ n[i] ].rows.push(i);
      }

      for (i = 0; i < o.length; i++) {
        if (os[ o[i] ] == null) {
          os[ o[i] ] = {
            rows: [],
            n: null
          };
        }
        os[ o[i] ].rows.push(i);
      }

      for (i in ns) {
        if (!hasOwn.call(ns, i)) {
          continue;
        }
        if (ns[i].rows.length == 1 && typeof os[i] != "undefined" && os[i].rows.length == 1) {
          n[ ns[i].rows[0] ] = {
            text: n[ ns[i].rows[0] ],
            row: os[i].rows[0]
          };
          o[ os[i].rows[0] ] = {
            text: o[ os[i].rows[0] ],
            row: ns[i].rows[0]
          };
        }
      }

      for (i = 0; i < n.length - 1; i++) {
        if (n[i].text != null && n[ i + 1 ].text == null && n[i].row + 1 < o.length && o[ n[i].row + 1 ].text == null &&
            n[ i + 1 ] == o[ n[i].row + 1 ]) {

          n[ i + 1 ] = {
            text: n[ i + 1 ],
            row: n[i].row + 1
          };
          o[ n[i].row + 1 ] = {
            text: o[ n[i].row + 1 ],
            row: i + 1
          };
        }
      }

      for (i = n.length - 1; i > 0; i--) {
        if (n[i].text != null && n[ i - 1 ].text == null && n[i].row > 0 && o[ n[i].row - 1 ].text == null &&
            n[ i - 1 ] == o[ n[i].row - 1 ]) {

          n[ i - 1 ] = {
            text: n[ i - 1 ],
            row: n[i].row - 1
          };
          o[ n[i].row - 1 ] = {
            text: o[ n[i].row - 1 ],
            row: i - 1
          };
        }
      }

      return {
        o: o,
        n: n
      };
    }

    return function (o, n) {
      o = o.replace(/\s+$/, "");
      n = n.replace(/\s+$/, "");

      var i, pre,
          str = "",
          out = diff(o === "" ? [] : o.split(/\s+/), n === "" ? [] : n.split(/\s+/)),
          oSpace = o.match(/\s+/g),
          nSpace = n.match(/\s+/g);

      if (oSpace == null) {
        oSpace = [ " " ];
      }
      else {
        oSpace.push(" ");
      }

      if (nSpace == null) {
        nSpace = [ " " ];
      }
      else {
        nSpace.push(" ");
      }

      if (out.n.length === 0) {
        for (i = 0; i < out.o.length; i++) {
          str += "<del>" + out.o[i] + oSpace[i] + "</del>";
        }
      }
      else {
        if (out.n[0].text == null) {
          for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
            str += "<del>" + out.o[n] + oSpace[n] + "</del>";
          }
        }

        for (i = 0; i < out.n.length; i++) {
          if (out.n[i].text == null) {
            str += "<ins>" + out.n[i] + nSpace[i] + "</ins>";
          }
          else {
            // `pre` initialized at top of scope
            pre = "";

            for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++) {
              pre += "<del>" + out.o[n] + oSpace[n] + "</del>";
            }
            str += " " + out.n[i].text + nSpace[i] + pre;
          }
        }
      }

      return str;
    };
  }());

// for CommonJS enviroments, export everything
  if (true) {
    extend(exports, QUnit);
  }

// get at whatever the global object is, like window in browsers
}());


/***/ }),

/***/ 3433:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 3434:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _es = __webpack_require__(381);

var _window$QUnit = window.QUnit,
    test = _window$QUnit.test,
    _module = _window$QUnit.module,
    equal = _window$QUnit.equal;


var APPLICATION_JSON = 'application/json';

_module('Content type');

test('body', function () {
  var contentType = (0, _es.getContentType)([JSON.stringify({
    foo: 'baz'
  }), JSON.stringify({
    foo: 'bar'
  })].join('\n'));

  equal(contentType, APPLICATION_JSON);
});

test('no body', function () {
  var contentType = (0, _es.getContentType)('');

  equal(contentType, undefined);
});

/***/ }),

/***/ 3435:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(0);
var utils = __webpack_require__(283);
var collapsingTests = __webpack_require__(3436);
var expandingTests = __webpack_require__(3437);

var _window$QUnit = window.QUnit,
    test = _window$QUnit.test,
    _module = _window$QUnit.module,
    deepEqual = _window$QUnit.deepEqual;


_module("Utils class");

_.each(collapsingTests.split(/^=+$/m), function (fixture) {
  if (fixture.trim() == "") {
    return;
  }
  fixture = fixture.split(/^-+$/m);
  var name = fixture[0].trim(),
      expanded = fixture[1].trim(),
      collapsed = fixture[2].trim();

  test("Literal collapse - " + name, function () {
    deepEqual(utils.collapseLiteralStrings(expanded), collapsed);
  });
});

_.each(expandingTests.split(/^=+$/m), function (fixture) {
  if (fixture.trim() == "") {
    return;
  }
  fixture = fixture.split(/^-+$/m);
  var name = fixture[0].trim(),
      collapsed = fixture[1].trim(),
      expanded = fixture[2].trim();

  test("Literal expand - " + name, function () {
    deepEqual(utils.expandLiteralStrings(collapsed), expanded);
  });

  test("extract deprecation messages", function () {
    deepEqual(utils.extractDeprecationMessages('299 Elasticsearch-6.0.0-alpha1-SNAPSHOT-abcdef1 "this is a warning" "Mon, 27 Feb 2017 14:52:14 GMT"'), ['#! Deprecation: this is a warning']);
    deepEqual(utils.extractDeprecationMessages('299 Elasticsearch-6.0.0-alpha1-SNAPSHOT-abcdef1 "this is a warning" "Mon, 27 Feb 2017 14:52:14 GMT", 299 Elasticsearch-6.0.0-alpha1-SNAPSHOT-abcdef1 "this is a second warning" "Mon, 27 Feb 2017 14:52:14 GMT"'), ['#! Deprecation: this is a warning', '#! Deprecation: this is a second warning']);
    deepEqual(utils.extractDeprecationMessages('299 Elasticsearch-6.0.0-alpha1-SNAPSHOT-abcdef1 "this is a warning, and it includes a comma" "Mon, 27 Feb 2017 14:52:14 GMT"'), ['#! Deprecation: this is a warning, and it includes a comma']);
    deepEqual(utils.extractDeprecationMessages('299 Elasticsearch-6.0.0-alpha1-SNAPSHOT-abcdef1 "this is a warning, and it includes an escaped backslash \\\\ and a pair of \\\"escaped quotes\\\"" "Mon, 27 Feb 2017 14:52:14 GMT"'), ['#! Deprecation: this is a warning, and it includes an escaped backslash \\ and a pair of "escaped quotes"']);
  });

  test("unescape", function () {
    deepEqual(utils.unescape('escaped backslash \\\\'), 'escaped backslash \\');
    deepEqual(utils.unescape('a pair of \\\"escaped quotes\\\"'), 'a pair of "escaped quotes"');
    deepEqual(utils.unescape('escaped quotes do not have to come in pairs: \\\"'), 'escaped quotes do not have to come in pairs: "');
  });

  test("split on unquoted comma followed by space", function () {
    deepEqual(utils.splitOnUnquotedCommaSpace('a, b'), ['a', 'b']);
    deepEqual(utils.splitOnUnquotedCommaSpace('a,b, c'), ['a,b', 'c']);
    deepEqual(utils.splitOnUnquotedCommaSpace('"a, b"'), ['"a, b"']);
    deepEqual(utils.splitOnUnquotedCommaSpace('"a, b", c'), ['"a, b"', 'c']);
    deepEqual(utils.splitOnUnquotedCommaSpace('"a, b\\", c"'), ['"a, b\\", c"']);
    deepEqual(utils.splitOnUnquotedCommaSpace(', a, b'), ['', 'a', 'b']);
    deepEqual(utils.splitOnUnquotedCommaSpace('a, b, '), ['a', 'b', '']);
    deepEqual(utils.splitOnUnquotedCommaSpace('\\"a, b", "c, d\\", e", f"'), ['\\"a', 'b", "c', 'd\\"', 'e", f"']);
  });
});

/***/ }),

/***/ 3436:
/***/ (function(module, exports) {

module.exports = "==========\r\nString only 1\r\n-------------------------------------\r\n\"\"\" hello\r\nto you \"\"\"\r\n-------------------------------------\r\n\" hello\\nto you \"\r\n==========\r\nString only 2\r\n-------------------------------------\r\n\"\"\" \r\nstartning with new lines and ending as well\r\n \"\"\"\r\n-------------------------------------\r\n\"startning with new lines and ending as well\"\r\n==========\r\nStrings in requests\r\n-------------------------------------\r\n{\r\n  \"f\": { \"somefield\" : \"\"\"\r\ntest\r\ntest2\r\n\"\"\" },\r\n  \"g\": { \"script\" : \"\"\"second + \"\\\";\"\"\" },\r\n  \"h\": 1,\r\n  \"script\": \"a + 2\"\r\n}\r\n-------------------------------------\r\n{\r\n  \"f\": { \"somefield\" : \"test\\ntest2\" },\r\n  \"g\": { \"script\" : \"second + \\\"\\\\\\\";\" },\r\n  \"h\": 1,\r\n  \"script\": \"a + 2\"\r\n}"

/***/ }),

/***/ 3437:
/***/ (function(module, exports) {

module.exports = "==========\r\nScripts in requests\r\n-------------------------------------\r\n{\r\n  \"f\": { \"script\" : { \"inline\": \"test\\ntest\\\\2\" } },\r\n  \"g\": { \"script\" : \"second + \\\"\\\\\\\";\" },\r\n  \"f\": \"short with \\\\\",\r\n  \"h\": 1,\r\n  \"script\": \"a + 2\"\r\n}\r\n-------------------------------------\r\n{\r\n  \"f\": { \"script\" : { \"inline\": \"\"\"\r\ntest\r\ntest\\2\r\n\"\"\" } },\r\n  \"g\": { \"script\" : \"\"\"second + \"\\\";\"\"\" },\r\n  \"f\": \"short with \\\\\",\r\n  \"h\": 1,\r\n  \"script\": \"a + 2\"\r\n}\r\n"

/***/ }),

/***/ 3438:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(0);
var url_pattern_matcher = __webpack_require__(574);
var autocomplete_engine = __webpack_require__(151);

var _window$QUnit = window.QUnit,
    test = _window$QUnit.test,
    _module = _window$QUnit.module,
    deepEqual = _window$QUnit.deepEqual;


_module("Url autocomplete");

function patterns_test(name, endpoints, tokenPath, expectedContext, globalUrlComponentFactories) {

  test(name, function () {
    var patternMatcher = new url_pattern_matcher.UrlPatternMatcher(globalUrlComponentFactories);
    _.each(endpoints, function (e, id) {
      e.id = id;
      _.each(e.patterns, function (p) {
        patternMatcher.addEndpoint(p, e);
      });
    });
    if (typeof tokenPath === "string") {
      if (tokenPath[tokenPath.length - 1] == "$") {
        tokenPath = tokenPath.substr(0, tokenPath.length - 1) + "/" + url_pattern_matcher.URL_PATH_END_MARKER;
      }
      tokenPath = _.map(tokenPath.split("/"), function (p) {
        p = p.split(",");
        if (p.length === 1) {
          return p[0];
        }
        return p;
      });
    }

    if (expectedContext.autoCompleteSet) {
      expectedContext.autoCompleteSet = _.map(expectedContext.autoCompleteSet, function (t) {
        if (_.isString(t)) {
          t = { name: t };
        }
        return t;
      });
      expectedContext.autoCompleteSet = _.sortBy(expectedContext.autoCompleteSet, 'name');
    }

    var context = {};
    if (expectedContext.method) {
      context.method = expectedContext.method;
    }
    autocomplete_engine.populateContext(tokenPath, context, null, expectedContext.autoCompleteSet, patternMatcher.getTopLevelComponents());

    // override context to just check on id
    if (context.endpoint) {
      context.endpoint = context.endpoint.id;
    }

    if (context.autoCompleteSet) {
      context.autoCompleteSet = _.sortBy(context.autoCompleteSet, 'name');
    }

    deepEqual(context, expectedContext);
  });
}

function t(name, meta) {
  if (meta) {
    return { name: name, meta: meta };
  }
  return name;
}

(function () {
  var endpoints = {
    "1": {
      patterns: ["a/b"]
    }
  };
  patterns_test("simple single path - completion", endpoints, "a/b$", { endpoint: "1" });

  patterns_test("simple single path - completion, with auto complete", endpoints, "a/b", { autoCompleteSet: [] });

  patterns_test("simple single path - partial, without auto complete", endpoints, "a", {});

  patterns_test("simple single path - partial, with auto complete", endpoints, "a", { autoCompleteSet: ["b"] });

  patterns_test("simple single path - partial, with auto complete", endpoints, [], { autoCompleteSet: ["a/b"] });

  patterns_test("simple single path - different path", endpoints, "a/c", {});
})();

(function () {
  var endpoints = {
    "1": {
      patterns: ["a/b", "a/b/{p}"]
    },
    "2": {
      patterns: ["a/c"]
    }
  };
  patterns_test("shared path  - completion 1", endpoints, "a/b$", { endpoint: "1" });

  patterns_test("shared path  - completion 2", endpoints, "a/c$", { endpoint: "2" });

  patterns_test("shared path  - completion 1 with param", endpoints, "a/b/v$", { endpoint: "1", p: "v" });

  patterns_test("shared path - partial, with auto complete", endpoints, "a", { autoCompleteSet: ["b", "c"] });

  patterns_test("shared path - partial, with auto complete of param, no options", endpoints, "a/b", { autoCompleteSet: [] });

  patterns_test("shared path - partial, without auto complete", endpoints, "a", {});

  patterns_test("shared path - different path - with auto complete", endpoints, "a/e", { autoCompleteSet: [] });

  patterns_test("shared path - different path - without auto complete", endpoints, "a/e", {});
})();

(function () {
  var endpoints = {
    "1": {
      patterns: ["a/{p}"],
      url_components: {
        p: ["a", "b"]
      }
    },
    "2": {
      patterns: ["a/c"]
    }
  };
  patterns_test("option testing - completion 1", endpoints, "a/a$", { endpoint: "1", p: ["a"] });

  patterns_test("option testing - completion 2", endpoints, "a/b$", { endpoint: "1", p: ["b"] });

  patterns_test("option testing - completion 3", endpoints, "a/b,a$", { endpoint: "1", p: ["b", "a"] });

  patterns_test("option testing - completion 4", endpoints, "a/c$", { endpoint: "2" });

  patterns_test("option testing  - completion 5", endpoints, "a/d$", {});

  patterns_test("option testing - partial, with auto complete", endpoints, "a", { autoCompleteSet: [t("a", "p"), t("b", "p"), "c"] });

  patterns_test("option testing - partial, without auto complete", endpoints, "a", {});

  patterns_test("option testing - different path - with auto complete", endpoints, "a/e", { autoCompleteSet: [] });
})();

(function () {
  var endpoints = {
    "1": {
      patterns: ["a/{p}"],
      url_components: {
        p: ["a", "b"]
      }
    },
    "2": {
      patterns: ["b/{p}"]
    },
    "3": {
      patterns: ["b/{l}/c"],
      url_components: {
        l: {
          type: "list",
          list: ["la", "lb"],
          allow_non_valid: true
        }
      }
    }
  };
  var globalFactories = {
    "p": function p(name, parent) {
      return new autocomplete_engine.ListComponent(name, ["g1", "g2"], parent);
    }
  };

  patterns_test("global parameters testing - completion 1", endpoints, "a/a$", { endpoint: "1", p: ["a"] }, globalFactories);

  patterns_test("global parameters testing - completion 2", endpoints, "b/g1$", { endpoint: "2", p: ["g1"] }, globalFactories);

  patterns_test("global parameters testing - partial, with auto complete", endpoints, "a", { autoCompleteSet: [t("a", "p"), t("b", "p")] }, globalFactories);

  patterns_test("global parameters testing - partial, with auto complete 2", endpoints, "b", { autoCompleteSet: [t("g1", "p"), t("g2", "p"), t("la", "l"), t("lb", "l")] }, globalFactories);

  patterns_test("Non valid token acceptance - partial, with auto complete 1", endpoints, "b/la", { autoCompleteSet: ["c"], "l": ["la"] }, globalFactories);
  patterns_test("Non valid token acceptance - partial, with auto complete 2", endpoints, "b/non_valid", { autoCompleteSet: ["c"], "l": ["non_valid"] }, globalFactories);
})();

(function () {
  var endpoints = {
    "1": {
      patterns: ["a/b/{p}/c/e"]
    }
  };
  patterns_test("look ahead - autocomplete before param 1", endpoints, "a", { autoCompleteSet: ["b"] });

  patterns_test("look ahead - autocomplete before param 2", endpoints, [], { autoCompleteSet: ["a/b"] });

  patterns_test("look ahead - autocomplete after param 1", endpoints, "a/b/v", { autoCompleteSet: ["c/e"], "p": "v" });

  patterns_test("look ahead - autocomplete after param 2", endpoints, "a/b/v/c", { autoCompleteSet: ["e"], "p": "v" });
})();

(function () {
  var endpoints = {
    "1_param": {
      patterns: ["a/{p}"],
      methods: ["GET"]
    },
    "2_explicit": {
      patterns: ["a/b"],
      methods: ["GET"]
    }
  };

  var e = _.cloneDeep(endpoints);
  e["1_param"].priority = 1;
  patterns_test("Competing endpoints - priority 1", e, "a/b$", { method: "GET", endpoint: "1_param", "p": "b" });
  e = _.cloneDeep(endpoints);
  e["1_param"].priority = 1;
  e["2_explicit"].priority = 0;
  patterns_test("Competing endpoints - priority 2", e, "a/b$", { method: "GET", endpoint: "2_explicit" });

  e = _.cloneDeep(endpoints);
  e["2_explicit"].priority = 0;
  patterns_test("Competing endpoints - priority 3", e, "a/b$", { method: "GET", endpoint: "2_explicit" });
})();

(function () {
  var endpoints = {
    "1_GET": {
      patterns: ["a"],
      methods: ["GET"]
    },
    "1_PUT": {
      patterns: ["a"],
      methods: ["PUT"]
    },
    "2_GET": {
      patterns: ["a/b"],
      methods: ["GET"]
    },
    "2_DELETE": {
      patterns: ["a/b"],
      methods: ["DELETE"]
    }
  };
  patterns_test("Competing endpoint - sub url of another - auto complete", endpoints, "a", { method: "GET", autoCompleteSet: ["b"] });
  patterns_test("Competing endpoint - sub url of another, complete 1", endpoints, "a$", { method: "GET", endpoint: "1_GET" });
  patterns_test("Competing endpoint - sub url of another, complete 2", endpoints, "a$", { method: "PUT", endpoint: "1_PUT" });
  patterns_test("Competing endpoint - sub url of another, complete 3", endpoints, "a$", { method: "DELETE" });

  patterns_test("Competing endpoint - extension of another, complete 1, auto complete", endpoints, "a/b$", { method: "PUT", autoCompleteSet: [] });

  patterns_test("Competing endpoint - extension of another, complete 1", endpoints, "a/b$", { method: "GET", endpoint: "2_GET" });

  patterns_test("Competing endpoint - extension of another, complete 1", endpoints, "a/b$", { method: "DELETE", endpoint: "2_DELETE" });
  patterns_test("Competing endpoint - extension of another, complete 1", endpoints, "a/b$", { method: "PUT" });
})();

/***/ }),

/***/ 3439:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(0);
var url_params = __webpack_require__(1057);
var autocomplete_engine = __webpack_require__(151);

var _window$QUnit = window.QUnit,
    test = _window$QUnit.test,
    _module = _window$QUnit.module,
    deepEqual = _window$QUnit.deepEqual;


_module("Url params");

function param_test(name, description, tokenPath, expectedContext, globalParams) {

  test(name, function () {
    var urlParams = new url_params.UrlParams(description, globalParams || {});
    if (typeof tokenPath === "string") {
      tokenPath = _.map(tokenPath.split("/"), function (p) {
        p = p.split(",");
        if (p.length === 1) {
          return p[0];
        }
        return p;
      });
    }

    if (expectedContext.autoCompleteSet) {
      expectedContext.autoCompleteSet = _.map(expectedContext.autoCompleteSet, function (t) {
        if (_.isString(t)) {
          t = { name: t };
        }
        return t;
      });
      expectedContext.autoCompleteSet = _.sortBy(expectedContext.autoCompleteSet, 'name');
    }

    var context = {};

    autocomplete_engine.populateContext(tokenPath, context, null, expectedContext.autoCompleteSet, urlParams.getTopLevelComponents());

    if (context.autoCompleteSet) {
      context.autoCompleteSet = _.sortBy(context.autoCompleteSet, 'name');
    }

    deepEqual(context, expectedContext);
  });
}

function t(name, meta, insert_value) {
  var r = name;
  if (meta) {
    r = { name: name, meta: meta };
    if (meta === "param" && !insert_value) {
      insert_value = name + "=";
    }
  }
  if (insert_value) {
    if (_.isString(r)) {
      r = { name: name };
    }
    r.insert_value = insert_value;
  }
  return r;
}

(function () {
  var params = {
    "a": ["1", "2"],
    "b": "__flag__"
  };
  param_test("settings params", params, "a/1", { "a": ["1"] });

  param_test("autocomplete top level", params, [], { autoCompleteSet: [t("a", "param"), t("b", "flag")] });

  param_test("autocomplete top level, with defaults", params, [], { autoCompleteSet: [t("a", "param"), t("b", "flag"), t("c", "param")] }, {
    "c": [2]
  });

  param_test("autocomplete values", params, "a", { autoCompleteSet: [t("1", "a"), t("2", "a")] });

  param_test("autocomplete values flag", params, "b", { autoCompleteSet: [t("true", "b"), t("false", "b")] });
})();

/***/ }),

/***/ 3440:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(0);
var curl = __webpack_require__(1058);
var curlTests = __webpack_require__(3441);

var _window$QUnit = window.QUnit,
    test = _window$QUnit.test,
    _module = _window$QUnit.module,
    ok = _window$QUnit.ok,
    equal = _window$QUnit.equal;


_module("CURL");

var notCURLS = ['sldhfsljfhs', 's;kdjfsldkfj curl -XDELETE ""', '{ "hello": 1 }'];

_.each(notCURLS, function (notCURL, i) {
  test("cURL Detection - broken strings " + i, function () {
    ok(!curl.detectCURL(notCURL), "marked as curl while it wasn't:" + notCURL);
  });
});

_.each(curlTests.split(/^=+$/m), function (fixture) {
  if (fixture.trim() == "") {
    return;
  }
  fixture = fixture.split(/^-+$/m);
  var name = fixture[0].trim(),
      curlText = fixture[1],
      response = fixture[2].trim();

  test("cURL Detection - " + name, function () {
    ok(curl.detectCURL(curlText), "marked as not curl while it was:" + curlText);
    var r = curl.parseCURL(curlText);
    equal(r, response);
  });
});

/***/ }),

/***/ 3441:
/***/ (function(module, exports) {

module.exports = "==========\r\nCurl 1\r\n-------------------------------------\r\ncurl -XPUT 'http://localhost:9200/twitter/tweet/1' -d '{\r\n  \"user\" : \"kimchy\",\r\n  \"post_date\" : \"2009-11-15T14:12:12\",\r\n  \"message\" : \"trying out Elastic Search\"\r\n}'\r\n-------------------------------------\r\nPUT /twitter/tweet/1\r\n{\r\n  \"user\" : \"kimchy\",\r\n  \"post_date\" : \"2009-11-15T14:12:12\",\r\n  \"message\" : \"trying out Elastic Search\"\r\n}\r\n==========\r\nCurl 2\r\n-------------------------------------\r\ncurl -XGET \"localhost/twitter/tweet/1?version=2\" -d '{\r\n   \"message\" : \"elasticsearch now has versioning support, double cool!\"\r\n}'\r\n-------------------------------------\r\nGET /twitter/tweet/1?version=2\r\n{\r\n   \"message\" : \"elasticsearch now has versioning support, double cool!\"\r\n}\r\n===========\r\nCurl 3\r\n-------------------------------------\r\ncurl -XPOST https://localhost/twitter/tweet/1?version=2 -d '{\r\n   \"message\" : \"elasticsearch now has versioning support, double cool!\"\r\n}'\r\n-------------------------------------\r\nPOST /twitter/tweet/1?version=2\r\n{\r\n   \"message\" : \"elasticsearch now has versioning support, double cool!\"\r\n}\r\n=========\r\nCurl 4\r\n-------------------------------------\r\ncurl -XPOST https://localhost/twitter\r\n-------------------------------------\r\nPOST /twitter\r\n==========\r\nCurl 5\r\n-------------------------------------\r\ncurl -X POST https://localhost/twitter/\r\n-------------------------------------\r\nPOST /twitter/\r\n=============\r\nCurl 6\r\n-------------------------------------\r\ncurl -s -XPOST localhost:9200/missing-test -d'\r\n{\r\n  \"mappings\": {\r\n  }\r\n}'\r\n-------------------------------------\r\nPOST /missing-test\r\n{\r\n  \"mappings\": {\r\n  }\r\n}\r\n=========================\r\nCurl 7\r\n-------------------------------------\r\ncurl 'localhost:9200/missing-test/doc/_search?pretty' -d'\r\n{\r\n  \"query\": {\r\n  },\r\n}'\r\n-------------------------------------\r\nGET /missing-test/doc/_search?pretty\r\n{\r\n  \"query\": {\r\n  },\r\n}\r\n===========================\r\nCurl 8\r\n-------------------------------------\r\ncurl localhost:9200/ -d'\r\n{\r\n  \"query\": {\r\n  }\r\n}'\r\n-------------------------------------\r\nGET /\r\n{\r\n  \"query\": {\r\n  }\r\n}\r\n====================================\r\nCurl Script\r\n-------------------------------------\r\n#!bin/sh\r\n\r\n// test something\r\ncurl 'localhost:9200/missing-test/doc/_search?pretty' -d'\r\n{\r\n  \"query\": {\r\n  },\r\n}'\r\n\r\n\r\ncurl -XPOST https://localhost/twitter\r\n\r\n#someother comments\r\ncurl localhost:9200/ -d'\r\n{\r\n  \"query\": {\r\n  }\r\n}'\r\n\r\n\r\n-------------------\r\n# test something\r\nGET /missing-test/doc/_search?pretty\r\n{\r\n  \"query\": {\r\n  },\r\n}\r\n\r\nPOST /twitter\r\n\r\n#someother comments\r\nGET /\r\n{\r\n  \"query\": {\r\n  }\r\n}\r\n====================================\r\nCurl with some text\r\n-------------------------------------\r\nThis is what I meant:\r\n\r\ncurl 'localhost:9200/missing-test/doc/_search?'\r\n\r\nThis, however, does work:\r\ncurl 'localhost:9200/missing/doc/_search?'\r\n-------------------\r\n### This is what I meant:\r\n\r\nGET /missing-test/doc/_search?\r\n\r\n### This, however, does work:\r\nGET /missing/doc/_search?\r\n"

/***/ }),

/***/ 3442:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var kb = __webpack_require__(575);
var mappings = __webpack_require__(284);
var autocomplete_engine = __webpack_require__(151);

var _window$QUnit = window.QUnit,
    test = _window$QUnit.test,
    _module = _window$QUnit.module,
    deepEqual = _window$QUnit.deepEqual;


_module("Knowledge base", {
  setup: function setup() {
    mappings.clear();
    kb.setActiveApi(kb._test.loadApisFromJson({}));
  },
  teardown: function teardown() {
    mappings.clear();
    kb.setActiveApi(kb._test.loadApisFromJson({}));
  }
});

var MAPPING = {
  "index1": {
    "type1.1": {
      "properties": {
        "field1.1.1": { "type": "string" },
        "field1.1.2": { "type": "long" }
      }
    },
    "type1.2": {
      "properties": {}
    }
  },
  "index2": {
    "type2.1": {
      "properties": {
        "field2.1.1": { "type": "string" },
        "field2.1.2": { "type": "string" }
      }
    }
  }
};

function testUrlContext(tokenPath, otherTokenValues, expectedContext) {

  if (expectedContext.autoCompleteSet) {
    expectedContext.autoCompleteSet = _lodash2.default.map(expectedContext.autoCompleteSet, function (t) {
      if (_lodash2.default.isString(t)) {
        t = { name: t };
      }
      return t;
    });
  }

  var context = { otherTokenValues: otherTokenValues };
  autocomplete_engine.populateContext(tokenPath, context, null, expectedContext.autoCompleteSet, kb.getTopLevelUrlCompleteComponents());

  // override context to just check on id
  if (context.endpoint) {
    context.endpoint = context.endpoint.id;
  }

  delete context.otherTokenValues;

  function norm(t) {
    if (_lodash2.default.isString(t)) {
      return { name: t };
    }
    return t;
  }

  if (context.autoCompleteSet) {
    context.autoCompleteSet = _lodash2.default.sortBy(_lodash2.default.map(context.autoCompleteSet, norm), 'name');
  }
  if (expectedContext.autoCompleteSet) {
    expectedContext.autoCompleteSet = _lodash2.default.sortBy(_lodash2.default.map(expectedContext.autoCompleteSet, norm), 'name');
  }

  deepEqual(context, expectedContext);
}

function t(term) {
  return { name: term, meta: "type" };
}

function i(term) {
  return { name: term, meta: "index" };
}

function index_test(name, tokenPath, otherTokenValues, expectedContext) {
  test(name, function () {
    var test_api = new kb._test.loadApisFromJson({
      index_test: {
        endpoints: {
          _multi_indices: {
            patterns: ["{indices}/_multi_indices"]
          },
          _single_index: { patterns: ["{index}/_single_index"] },
          _no_index: {
            // testing default patters
            //  patterns: ["_no_index"]
          }
        }
      }
    }, kb._test.globalUrlComponentFactories);

    kb.setActiveApi(test_api);

    mappings.loadMappings(MAPPING);
    testUrlContext(tokenPath, otherTokenValues, expectedContext);
  });
}

index_test("Index integration 1", [], [], { autoCompleteSet: ["_no_index", i("index1"), i("index2")] });

index_test("Index integration 2", [], ["index1"],
// still return _no_index as index1 is not committed to yet.
{ autoCompleteSet: ["_no_index", i("index2")] });

index_test("Index integration 2", ["index1"], [], { indices: ["index1"], autoCompleteSet: ["_multi_indices", "_single_index"] });

index_test("Index integration 2", [["index1", "index2"]], [], { indices: ["index1", "index2"], autoCompleteSet: ["_multi_indices"] });

function type_test(name, tokenPath, otherTokenValues, expectedContext) {
  test(name, function () {
    var test_api = kb._test.loadApisFromJson({
      "type_test": {
        endpoints: {
          _multi_types: { patterns: ["{indices}/{types}/_multi_types"] },
          _single_type: { patterns: ["{indices}/{type}/_single_type"] },
          _no_types: { patterns: ["{indices}/_no_types"] }
        }
      }
    }, kb._test.globalUrlComponentFactories);
    kb.setActiveApi(test_api);

    mappings.loadMappings(MAPPING);

    testUrlContext(tokenPath, otherTokenValues, expectedContext);
  });
}

type_test("Type integration 1", ["index1"], [], { indices: ["index1"], autoCompleteSet: ["_no_types", t("type1.1"), t("type1.2")] });
type_test("Type integration 2", ["index1"], ["type1.2"],
// we are not yet comitted to type1.2, so _no_types is returned
{ indices: ["index1"], autoCompleteSet: ["_no_types", t("type1.1")] });

type_test("Type integration 3", ["index2"], [], { indices: ["index2"], autoCompleteSet: ["_no_types", t("type2.1")] });

type_test("Type integration 4", ["index1", "type1.2"], [], { indices: ["index1"], types: ["type1.2"], autoCompleteSet: ["_multi_types", "_single_type"] });

type_test("Type integration 5", [["index1", "index2"], ["type1.2", "type1.1"]], [], { indices: ["index1", "index2"], types: ["type1.2", "type1.1"], autoCompleteSet: ["_multi_types"] });

/***/ }),

/***/ 3454:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mappings = __webpack_require__(284);

var _window$QUnit = window.QUnit,
    test = _window$QUnit.test,
    _module = _window$QUnit.module,
    deepEqual = _window$QUnit.deepEqual;


_module("Mappings", {
  setup: function setup() {
    mappings.clear();
  },
  teardown: function teardown() {
    mappings.clear();
  }
});

function fc(f1, f2) {
  if (f1.name < f2.name) {
    return -1;
  }
  if (f1.name > f2.name) {
    return 1;
  }
  return 0;
}

function f(name, type) {
  return { name: name, type: type || "string" };
}

test("Multi fields", function () {
  mappings.loadMappings({
    "index": {
      "tweet": {
        "properties": {
          "first_name": {
            "type": "multi_field",
            "path": "just_name",
            "fields": {
              "first_name": { "type": "string", "index": "analyzed" },
              "any_name": { "type": "string", "index": "analyzed" }
            }
          },
          "last_name": {
            "type": "multi_field",
            "path": "just_name",
            "fields": {
              "last_name": { "type": "string", "index": "analyzed" },
              "any_name": { "type": "string", "index": "analyzed" }
            }
          }
        }
      }
    }
  });

  deepEqual(mappings.getFields("index").sort(fc), [f("any_name", "string"), f("first_name", "string"), f("last_name", "string")]);
});

test("Multi fields 1.0 style", function () {
  mappings.loadMappings({
    "index": {
      "tweet": {
        "properties": {
          "first_name": {
            "type": "string", "index": "analyzed",
            "path": "just_name",
            "fields": {
              "any_name": { "type": "string", "index": "analyzed" }
            }
          },
          "last_name": {
            "type": "string", "index": "no",
            "fields": {
              "raw": { "type": "string", "index": "analyzed" }
            }
          }
        }
      }
    }
  });

  deepEqual(mappings.getFields("index").sort(fc), [f("any_name", "string"), f("first_name", "string"), f("last_name", "string"), f("last_name.raw", "string")]);
});

test("Simple fields", function () {
  mappings.loadMappings({
    "index": {
      "tweet": {
        "properties": {
          "str": {
            "type": "string"
          },
          "number": {
            "type": "int"
          }
        }
      }
    }
  });

  deepEqual(mappings.getFields("index").sort(fc), [f("number", "int"), f("str", "string")]);
});

test("Simple fields - 1.0 style", function () {
  mappings.loadMappings({
    "index": {
      "mappings": {
        "tweet": {
          "properties": {
            "str": {
              "type": "string"
            },
            "number": {
              "type": "int"
            }
          }
        }
      }
    }
  });

  deepEqual(mappings.getFields("index").sort(fc), [f("number", "int"), f("str", "string")]);
});

test("Nested fields", function () {
  mappings.loadMappings({
    "index": {
      "tweet": {
        "properties": {
          "person": {
            "type": "object",
            "properties": {
              "name": {
                "properties": {
                  "first_name": { "type": "string" },
                  "last_name": { "type": "string" }
                }
              },
              "sid": { "type": "string", "index": "not_analyzed" }
            }
          },
          "message": { "type": "string" }
        }
      }
    }
  });

  deepEqual(mappings.getFields("index", ["tweet"]).sort(fc), [f("message"), f("person.name.first_name"), f("person.name.last_name"), f("person.sid")]);
});

test("Enabled fields", function () {
  mappings.loadMappings({
    "index": {
      "tweet": {
        "properties": {
          "person": {
            "type": "object",
            "properties": {
              "name": {
                "type": "object",
                "enabled": false
              },
              "sid": { "type": "string", "index": "not_analyzed" }
            }
          },
          "message": { "type": "string" }
        }
      }
    }
  });

  deepEqual(mappings.getFields("index", ["tweet"]).sort(fc), [f("message"), f("person.sid")]);
});

test("Path tests", function () {
  mappings.loadMappings({
    "index": {
      "person": {
        "properties": {
          "name1": {
            "type": "object",
            "path": "just_name",
            "properties": {
              "first1": { "type": "string" },
              "last1": { "type": "string", "index_name": "i_last_1" }
            }
          },
          "name2": {
            "type": "object",
            "path": "full",
            "properties": {
              "first2": { "type": "string" },
              "last2": { "type": "string", "index_name": "i_last_2" }
            }
          }
        }
      }
    }
  });

  deepEqual(mappings.getFields().sort(fc), [f("first1"), f("i_last_1"), f("name2.first2"), f("name2.i_last_2")]);
});

test("Use index_name tests", function () {
  mappings.loadMappings({
    "index": {
      "person": {
        "properties": {
          "last1": { "type": "string", "index_name": "i_last_1" }
        }
      }
    }
  });

  deepEqual(mappings.getFields().sort(fc), [f("i_last_1")]);
});

test("Aliases", function () {
  mappings.loadAliases({
    "test_index1": {
      "aliases": {
        "alias1": {}
      }
    },
    "test_index2": {
      "aliases": {
        "alias2": {
          "filter": {
            "term": {
              "FIELD": "VALUE"
            }
          }
        },
        "alias1": {}
      }
    }
  });
  mappings.loadMappings({
    "test_index1": {
      "type1": {
        "properties": {
          "last1": { "type": "string", "index_name": "i_last_1" }
        }
      }
    },
    "test_index2": {
      "type2": {
        "properties": {
          "last1": { "type": "string", "index_name": "i_last_1" }
        }
      }
    }
  });

  deepEqual(mappings.getIndices().sort(), ["_all", "alias1", "alias2", "test_index1", "test_index2"]);
  deepEqual(mappings.getIndices(false).sort(), ["test_index1", "test_index2"]);
  deepEqual(mappings.expandAliases(["alias1", "test_index2"]).sort(), ["test_index1", "test_index2"]);
  deepEqual(mappings.expandAliases("alias2"), "test_index2");
});

/***/ }),

/***/ 3455:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(13);

var _jquery2 = _interopRequireDefault(_jquery);

var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _input = __webpack_require__(286);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ace = __webpack_require__(60);

var editor_input1 = __webpack_require__(3456);
var utils = __webpack_require__(283);

var aceRange = ace.require("ace/range");
var _window$QUnit = window.QUnit,
    _module = _window$QUnit.module,
    asyncTest = _window$QUnit.asyncTest,
    deepEqual = _window$QUnit.deepEqual,
    equal = _window$QUnit.equal,
    start = _window$QUnit.start;


var input = void 0;

_module("Editor", {
  setup: function setup() {
    input = (0, _input.initializeInput)((0, _jquery2.default)('#editor'), (0, _jquery2.default)('#editor_actions'), (0, _jquery2.default)('#copy_as_curl'), null);
    input.$el.show();
    input.autocomplete._test.removeChangeListener();
  },
  teardown: function teardown() {
    input.$el.hide();
    input.autocomplete._test.addChangeListener();
  }
});

var testCount = 0;

function utils_test(name, prefix, data, test) {
  var id = testCount++;
  if (typeof data == "function") {
    test = data;
    data = null;
  }
  if (data && typeof data != "string") {
    data = JSON.stringify(data, null, 3);
  }
  if (data) {
    if (prefix) {
      data = prefix + "\n" + data;
    }
  } else {
    data = prefix;
  }

  asyncTest("Utils test " + id + " : " + name, function () {
    input.update(data, function () {
      test();
    });
  });
}

function compareRequest(requests, expected) {
  if (!Array.isArray(requests)) {
    requests = [requests];
    expected = [expected];
  }

  _lodash2.default.each(requests, function (r) {
    delete r.range;
  });
  deepEqual(requests, expected);
}

var simple_request = {
  prefix: 'POST _search',
  data: ['{', '   "query": { "match_all": {} }', '}'].join('\n')
};

var single_line_request = {
  prefix: 'POST _search',
  data: '{ "query": { "match_all": {} } }'
};

var get_request_no_data = {
  prefix: 'GET _stats'
};

var multi_doc_request = {
  prefix: 'POST _bulk',
  data_as_array: ['{ "index": { "_index": "index", "_type":"type" } }', '{ "field": 1 }']
};
multi_doc_request.data = multi_doc_request.data_as_array.join("\n");

utils_test("simple request range", simple_request.prefix, simple_request.data, function () {
  input.getRequestRange(function (range) {
    var expected = new aceRange.Range(0, 0, 3, 1);
    compareRequest(range, expected);
    start();
  });
});

utils_test("simple request data", simple_request.prefix, simple_request.data, function () {
  input.getRequest(function (request) {
    var expected = {
      method: "POST",
      url: "_search",
      data: [simple_request.data]
    };

    compareRequest(request, expected);
    start();
  });
});

utils_test("simple request range, prefixed with spaces", "   " + simple_request.prefix, simple_request.data, function () {
  input.getRequestRange(function (range) {
    var expected = new aceRange.Range(0, 0, 3, 1);
    deepEqual(range, expected);
    start();
  });
});

utils_test("simple request data, prefixed with spaces", "    " + simple_request.prefix, simple_request.data, function () {
  input.getRequest(function (request) {
    var expected = {
      method: "POST",
      url: "_search",
      data: [simple_request.data]
    };

    compareRequest(request, expected);
    start();
  });
});

utils_test("simple request range, suffixed with spaces", simple_request.prefix + "   ", simple_request.data + "  ", function () {
  input.getRequestRange(function (range) {
    var expected = new aceRange.Range(0, 0, 3, 1);
    compareRequest(range, expected);
    start();
  });
});

utils_test("simple request data, suffixed with spaces", simple_request.prefix + "    ", simple_request.data + " ", function () {
  input.getRequest(function (request) {
    var expected = {
      method: "POST",
      url: "_search",
      data: [simple_request.data]
    };

    compareRequest(request, expected);
    start();
  });
});

utils_test("single line request range", single_line_request.prefix, single_line_request.data, function () {
  input.getRequestRange(function (range) {
    var expected = new aceRange.Range(0, 0, 1, 32);
    compareRequest(range, expected);
    start();
  });
});

utils_test("full url: single line request data", "POST https://somehoset/_search", single_line_request.data, function () {
  input.getRequest(function (request) {
    var expected = {
      method: "POST",
      url: "https://somehoset/_search",
      data: [single_line_request.data]
    };

    compareRequest(request, expected);
    start();
  });
});

utils_test("request with no data followed by a new line", get_request_no_data.prefix, "\n", function () {
  input.getRequestRange(function (range) {
    var expected = new aceRange.Range(0, 0, 0, 10);
    compareRequest(range, expected);
    start();
  });
});

utils_test("request with no data followed by a new line (data)", get_request_no_data.prefix, "\n", function () {
  input.getRequest(function (request) {
    var expected = {
      method: "GET",
      url: "_stats",
      data: []
    };

    compareRequest(request, expected);
    start();
  });
});

utils_test("request with no data", get_request_no_data.prefix, get_request_no_data.data, function () {
  input.getRequestRange(function (range) {
    var expected = new aceRange.Range(0, 0, 0, 10);
    deepEqual(range, expected);
    start();
  });
});

utils_test("request with no data (data)", get_request_no_data.prefix, get_request_no_data.data, function () {
  input.getRequest(function (request) {
    var expected = {
      method: "GET",
      url: "_stats",
      data: []
    };

    compareRequest(request, expected);
    start();
  });
});

utils_test("multi doc request range", multi_doc_request.prefix, multi_doc_request.data, function () {
  input.getRequestRange(function (range) {
    var expected = new aceRange.Range(0, 0, 2, 14);
    deepEqual(range, expected);
    start();
  });
});

utils_test("multi doc request data", multi_doc_request.prefix, multi_doc_request.data, function () {
  input.getRequest(function (request) {
    var expected = {
      method: "POST",
      url: "_bulk",
      data: multi_doc_request.data_as_array
    };

    compareRequest(request, expected);
    start();
  });
});

var script_request = {
  prefix: 'POST _search',
  data: ['{', '   "query": { "script": """', '   some script ', '   """}', '}'].join('\n')
};

utils_test("script request range", script_request.prefix, script_request.data, function () {
  input.getRequestRange(function (range) {
    var expected = new aceRange.Range(0, 0, 5, 1);
    compareRequest(range, expected);
    start();
  });
});

utils_test("simple request data", simple_request.prefix, simple_request.data, function () {
  input.getRequest(function (request) {
    var expected = {
      method: "POST",
      url: "_search",
      data: [utils.collapseLiteralStrings(simple_request.data)]
    };

    compareRequest(request, expected);
    start();
  });
});

function multi_req_test(name, editor_input, range, expected) {
  utils_test("multi request select - " + name, editor_input, function () {
    input.getRequestsInRange(range, function (requests) {
      // convert to format returned by request.
      _lodash2.default.each(expected, function (req) {
        req.data = req.data == null ? [] : [JSON.stringify(req.data, null, 2)];
      });

      compareRequest(requests, expected);
      start();
    });
  });
}

multi_req_test("mid body to mid body", editor_input1, { start: { row: 12 }, end: { row: 17 } }, [{
  method: "PUT",
  url: "index_1/type1/1",
  data: {
    "f": 1
  }
}, {
  method: "PUT",
  url: "index_1/type1/2",
  data: {
    "f": 2
  }
}]);

multi_req_test("single request start to end", editor_input1, { start: { row: 10 }, end: { row: 13 } }, [{
  method: "PUT",
  url: "index_1/type1/1",
  data: {
    "f": 1
  }
}]);

multi_req_test("start to end, with comment", editor_input1, { start: { row: 6 }, end: { row: 13 } }, [{
  method: "GET",
  url: "_stats?level=shards",
  data: null
}, {
  method: "PUT",
  url: "index_1/type1/1",
  data: {
    "f": 1
  }
}]);

multi_req_test("before start to after end, with comments", editor_input1, { start: { row: 4 }, end: { row: 14 } }, [{
  method: "GET",
  url: "_stats?level=shards",
  data: null
}, {
  method: "PUT",
  url: "index_1/type1/1",
  data: {
    "f": 1
  }
}]);

multi_req_test("between requests", editor_input1, { start: { row: 21 }, end: { row: 22 } }, []);

multi_req_test("between requests - with comment", editor_input1, { start: { row: 20 }, end: { row: 22 } }, []);

multi_req_test("between requests - before comment", editor_input1, { start: { row: 19 }, end: { row: 22 } }, []);

function multi_req_copy_as_curl_test(name, editor_input, range, expected) {
  utils_test("multi request copy as curl - " + name, editor_input, function () {
    input.getRequestsAsCURL(range, function (curl) {
      equal(curl, expected);
      start();
    });
  });
}

multi_req_copy_as_curl_test("start to end, with comment", editor_input1, { start: { row: 6 }, end: { row: 13 } }, '\ncurl -XGET "http://localhost:9200/_stats?level=shards"\n\n#in between comment\n\ncurl -XPUT "http://localhost:9200/index_1/type1/1" -H \'Content-Type: application/json\' -d\'\n{\n  "f": 1\n}\''.trim());

/***/ }),

/***/ 3456:
/***/ (function(module, exports) {

module.exports = "GET _search\r\n{\r\n  \"query\": { \"match_all\": {} }\r\n}\r\n\r\n#preceeding comment\r\nGET _stats?level=shards\r\n\r\n#in between comment\r\n\r\nPUT index_1/type1/1\r\n{\r\n  \"f\": 1\r\n}\r\n\r\nPUT index_1/type1/2\r\n{\r\n  \"f\": 2\r\n}\r\n\r\n# comment\r\n\r\n\r\nGET index_1/type1/1/_source?_source_include=f\r\n\r\nDELETE index_2\r\n\r\n"

/***/ }),

/***/ 3457:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _input = __webpack_require__(286);

var ace = __webpack_require__(60);
var $ = __webpack_require__(13);

var input = void 0;

var token_iterator = ace.require("ace/token_iterator");
var _window$QUnit = window.QUnit,
    _module = _window$QUnit.module,
    asyncTest = _window$QUnit.asyncTest,
    deepEqual = _window$QUnit.deepEqual,
    start = _window$QUnit.start;


_module("Input Tokenization", {
  setup: function setup() {
    input = (0, _input.initializeInput)($('#editor'), $('#editor_actions'), $('#copy_as_curl'), null);
    input.$el.show();
    input.autocomplete._test.removeChangeListener();
  },
  teardown: function teardown() {
    input.$el.hide();
    input.autocomplete._test.addChangeListener();
  }
});

function tokensAsList() {
  var iter = new token_iterator.TokenIterator(input.getSession(), 0, 0);
  var ret = [];
  var t = iter.getCurrentToken();
  if (input.parser.isEmptyToken(t)) {
    t = input.parser.nextNonEmptyToken(iter);
  }
  while (t) {
    ret.push({ value: t.value, type: t.type });
    t = input.parser.nextNonEmptyToken(iter);
  }

  return ret;
}

var testCount = 0;

function token_test(token_list, prefix, data) {
  if (data && typeof data != "string") {
    data = JSON.stringify(data, null, 3);
  }
  if (data) {
    if (prefix) {
      data = prefix + "\n" + data;
    }
  } else {
    data = prefix;
  }

  asyncTest("Token test " + testCount++ + " prefix: " + prefix, function () {
    input.update(data, function () {
      var tokens = tokensAsList();
      var normTokenList = [];
      for (var i = 0; i < token_list.length; i++) {
        normTokenList.push({ type: token_list[i++], value: token_list[i] });
      }

      deepEqual(tokens, normTokenList, "Doc:\n" + data);
      start();
    });
  });
}

token_test(["method", "GET", "url.part", "_search"], "GET _search");

token_test(["method", "GET", "url.slash", "/", "url.part", "_search"], "GET /_search");

token_test(["method", "GET", "url.protocol_host", "http://somehost", "url.slash", "/", "url.part", "_search"], "GET http://somehost/_search");

token_test(["method", "GET", "url.protocol_host", "http://somehost"], "GET http://somehost");

token_test(["method", "GET", "url.protocol_host", "http://somehost", "url.slash", "/"], "GET http://somehost/");

token_test(["method", "GET", "url.protocol_host", "http://test:user@somehost", "url.slash", "/"], "GET http://test:user@somehost/");

token_test(["method", "GET", "url.part", "_cluster", "url.slash", "/", "url.part", "nodes"], "GET _cluster/nodes");

token_test(["method", "GET", "url.slash", "/", "url.part", "_cluster", "url.slash", "/", "url.part", "nodes"], "GET /_cluster/nodes");

token_test(["method", "GET", "url.part", "index", "url.slash", "/", "url.part", "_search"], "GET index/_search");

token_test(["method", "GET", "url.part", "index"], "GET index");

token_test(["method", "GET", "url.part", "index", "url.slash", "/", "url.part", "type"], "GET index/type");

token_test(["method", "GET", "url.slash", "/", "url.part", "index", "url.slash", "/", "url.part", "type", "url.slash", "/"], "GET /index/type/");

token_test(["method", "GET", "url.part", "index", "url.slash", "/", "url.part", "type", "url.slash", "/", "url.part", "_search"], "GET index/type/_search");

token_test(["method", "GET", "url.part", "index", "url.slash", "/", "url.part", "type", "url.slash", "/", "url.part", "_search", "url.questionmark", "?", "url.param", "value", "url.equal", "=", "url.value", "1"], "GET index/type/_search?value=1");

token_test(["method", "GET", "url.part", "index", "url.slash", "/", "url.part", "type", "url.slash", "/", "url.part", "1"], "GET index/type/1");

token_test(["method", "GET", "url.slash", "/", "url.part", "index1", "url.comma", ",", "url.part", "index2", "url.slash", "/"], "GET /index1,index2/");

token_test(["method", "GET", "url.slash", "/", "url.part", "index1", "url.comma", ",", "url.part", "index2", "url.slash", "/", "url.part", "_search"], "GET /index1,index2/_search");

token_test(["method", "GET", "url.part", "index1", "url.comma", ",", "url.part", "index2", "url.slash", "/", "url.part", "_search"], "GET index1,index2/_search");

token_test(["method", "GET", "url.slash", "/", "url.part", "index1", "url.comma", ",", "url.part", "index2"], "GET /index1,index2");

token_test(["method", "GET", "url.part", "index1", "url.comma", ",", "url.part", "index2"], "GET index1,index2");

token_test(["method", "GET", "url.slash", "/", "url.part", "index1", "url.comma", ","], "GET /index1,");

token_test(["method", "PUT", "url.slash", "/", "url.part", "index", "url.slash", "/"], "PUT /index/");

token_test(["method", "GET", "url.part", "index", "url.slash", "/", "url.part", "_search"], "GET index/_search ");

token_test(["method", "PUT", "url.slash", "/", "url.part", "index"], "PUT /index");

token_test(["method", "PUT", "url.slash", "/", "url.part", "index1", "url.comma", ",", "url.part", "index2", "url.slash", "/", "url.part", "type1", "url.comma", ",", "url.part", "type2"], "PUT /index1,index2/type1,type2");

token_test(["method", "PUT", "url.slash", "/", "url.part", "index1", "url.slash", "/", "url.part", "type1", "url.comma", ",", "url.part", "type2", "url.comma", ","], "PUT /index1/type1,type2,");

token_test(["method", "PUT", "url.part", "index1", "url.comma", ",", "url.part", "index2", "url.slash", "/", "url.part", "type1", "url.comma", ",", "url.part", "type2", "url.slash", "/", "url.part", "1234"], "PUT index1,index2/type1,type2/1234");

token_test(["method", "POST", "url.part", "_search", "paren.lparen", "{", "variable", '"q"', "punctuation.colon", ":", "paren.lparen", "{", "paren.rparen", "}", "paren.rparen", "}"], 'POST _search\n' + '{\n' + '  "q": {}\n' + '  \n' + '}');

token_test(["method", "POST", "url.part", "_search", "paren.lparen", "{", "variable", '"q"', "punctuation.colon", ":", "paren.lparen", "{", "variable", '"s"', "punctuation.colon", ":", "paren.lparen", "{", "paren.rparen", "}", "paren.rparen", "}", "paren.rparen", "}"], 'POST _search\n' + '{\n' + '  "q": { "s": {}}\n' + '  \n' + '}');

function statesAsList() {
  var ret = [];
  var session = input.getSession();
  var maxLine = session.getLength();
  for (var row = 0; row < maxLine; row++) {
    ret.push(session.getState(row));
  }return ret;
}

function states_test(states_list, prefix, data) {
  if (data && typeof data != "string") {
    data = JSON.stringify(data, null, 3);
  }
  if (data) {
    if (prefix) {
      data = prefix + "\n" + data;
    }
  } else {
    data = prefix;
  }

  asyncTest("States test " + testCount++ + " prefix: " + prefix, function () {
    input.update(data, function () {
      var modes = statesAsList();
      deepEqual(modes, states_list, "Doc:\n" + data);
      start();
    });
  });
}

states_test(["start", "json", "json", "start"], 'POST _search\n' + '{\n' + '  "query": { "match_all": {} }\n' + '}');

states_test(["start", "json", ["json", "json"], ["json", "json"], "json", "start"], 'POST _search\n' + '{\n' + '  "query": { \n' + '  "match_all": {} \n' + '  }\n' + '}');

states_test(["start", "json", "json", "start"], 'POST _search\n' + '{\n' + '  "script": { "inline": "" }\n' + '}');

states_test(["start", "json", "json", "start"], 'POST _search\n' + '{\n' + '  "script": ""\n' + '}');

states_test(["start", "json", ["json", "json"], "json", "start"], 'POST _search\n' + '{\n' + '  "script": {\n' + '   }\n' + '}');

states_test(["start", "json", ["script-start", "json", "json", "json"], ["script-start", "json", "json", "json"], ["json", "json"], "json", "start"], 'POST _search\n' + '{\n' + '  "test": { "script": """\n' + '  test script\n' + ' """\n' + ' }\n' + '}');

states_test(["start", "json", ["script-start", "json"], ["script-start", "json"], "json", "start"], 'POST _search\n' + '{\n' + '  "script": """\n' + '  test script\n' + ' """,\n' + '}');

states_test(["start", "json", "json", "start"], 'POST _search\n' + '{\n' + '  "script": """test script""",\n' + '}');

states_test(["start", "json", ["string_literal", "json"], ["string_literal", "json"], "json", "start"], 'POST _search\n' + '{\n' + '  "somthing": """\n' + '  test script\n' + ' """,\n' + '}');

states_test(["start", "json", ["string_literal", "json", "json", "json"], ["string_literal", "json", "json", "json"], ["json", "json"], ["json", "json"], "json", "start"], 'POST _search\n' + '{\n' + '  "somthing": { "f" : """\n' + '  test script\n' + ' """,\n' + ' "g": 1\n' + ' }\n' + '}');

states_test(["start", "json", "json", "start"], 'POST _search\n' + '{\n' + '  "something": """test script""",\n' + '}');

/***/ }),

/***/ 3458:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _output = __webpack_require__(578);

var ace = __webpack_require__(60);
var $ = __webpack_require__(13);
var RowParser = __webpack_require__(1059);

var output = void 0;

var token_iterator = ace.require("ace/token_iterator");
var _window$QUnit = window.QUnit,
    _module = _window$QUnit.module,
    asyncTest = _window$QUnit.asyncTest,
    deepEqual = _window$QUnit.deepEqual,
    start = _window$QUnit.start;


_module("Output Tokenization", {
  setup: function setup() {
    output = (0, _output.initializeOutput)($('#output'));
    output.$el.show();
  },
  teardown: function teardown() {
    output.$el.hide();
  }
});

function tokensAsList() {
  var iter = new token_iterator.TokenIterator(output.getSession(), 0, 0);
  var ret = [];
  var t = iter.getCurrentToken();
  var parser = new RowParser(output);
  if (parser.isEmptyToken(t)) {
    t = parser.nextNonEmptyToken(iter);
  }
  while (t) {
    ret.push({ value: t.value, type: t.type });
    t = parser.nextNonEmptyToken(iter);
  }

  return ret;
}

var testCount = 0;

function token_test(token_list, data) {
  if (data && typeof data != "string") {
    data = JSON.stringify(data, null, 3);
  }

  asyncTest("Token test " + testCount++, function () {
    output.update(data, function () {
      var tokens = tokensAsList();
      var normTokenList = [];
      for (var i = 0; i < token_list.length; i++) {
        normTokenList.push({ type: token_list[i++], value: token_list[i] });
      }

      deepEqual(tokens, normTokenList, "Doc:\n" + data);
      start();
    });
  });
}

token_test(["warning", "#! warning", "comment", "# GET url", "paren.lparen", "{", "paren.rparen", "}"], "#! warning\n" + "# GET url\n" + "{}");

token_test(["comment", "# GET url", "paren.lparen", "{", "variable", '"f"', "punctuation.colon", ":", "punctuation.start_triple_quote", '"""', "multi_string", "raw", "punctuation.end_triple_quote", '"""', "paren.rparen", "}"], '# GET url\n' + '{ "f": """raw""" }');

/***/ }),

/***/ 3459:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _input = __webpack_require__(286);

var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var input = void 0;
var kb = __webpack_require__(575);
var mappings = __webpack_require__(284);
var $ = __webpack_require__(13);

var _window$QUnit = window.QUnit,
    _module = _window$QUnit.module,
    ok = _window$QUnit.ok,
    asyncTest = _window$QUnit.asyncTest,
    deepEqual = _window$QUnit.deepEqual,
    equal = _window$QUnit.equal,
    start = _window$QUnit.start;


_module("Integration", {
  setup: function setup() {
    input = (0, _input.initializeInput)($('#editor'), $('#editor_actions'), $('#copy_as_curl'), null);
    input.$el.show();
    input.autocomplete._test.removeChangeListener();
  },
  teardown: function teardown() {
    input.$el.hide();
    input.autocomplete._test.addChangeListener();
  }
});

function process_context_test(data, mapping, kb_schemes, request_line, test) {
  asyncTest(test.name, function () {

    console.debug("starting test " + test.name);

    var rowOffset = 0; // add one for the extra method line
    var editorValue = data;
    if (request_line != null) {
      if (data != null) {
        editorValue = request_line + "\n" + data;
        rowOffset = 1;
      } else {
        editorValue = request_line;
      }
    }

    test.cursor.row += rowOffset;

    mappings.clear();
    mappings.loadMappings(mapping);
    var json = {};
    json[test.name] = kb_schemes || {};
    var test_api = kb._test.loadApisFromJson(json);
    //if (kb_schemes) {
    //  if (kb_schemes.globals) {
    //    $.each(kb_schemes.globals, function (parent, rules) {
    //      test_api.addGlobalAutocompleteRules(parent, rules);
    //    });
    //  }
    //  if (kb_schemes.endpoints) {
    //    $.each(kb_schemes.endpoints, function (endpoint, scheme) {
    //      _.defaults(scheme, {methods: null}); // disable method testing unless specified in test
    //      test_api.addEndpointDescription(endpoint, scheme);
    //    });
    //  }
    //}
    kb.setActiveApi(test_api);

    input.update(editorValue, function () {
      input.moveCursorTo(test.cursor.row, test.cursor.column);

      // allow ace rendering to move cursor so it will be seen during test - handy for debugging.
      setTimeout(function () {
        input.completer = {
          base: {},
          changeListener: function changeListener() {}
        }; // mimic auto complete

        input.autocomplete._test.getCompletions(input, input.getSession(), test.cursor, "", function (err, terms) {

          if (test.assertThrows) {
            ok(test.assertThrows.test("" + err), "failed to throw expected exception");
            start();
            return;
          }

          if (err) {
            throw err;
          }

          if (test.no_context) {
            ok(!terms || terms.length === 0, "Expected no context bug got terms.");
          } else {
            ok(terms && terms.length > 0, "failed to extract terms ...");
          }

          if (!terms || terms.length === 0) {
            start();
            return;
          }

          if (test["autoCompleteSet"]) {
            var expected_terms = _lodash2.default.map(test["autoCompleteSet"], function (t) {
              if ((typeof t === 'undefined' ? 'undefined' : _typeof(t)) !== "object") {
                t = { "name": t };
              }
              return t;
            });
            if (terms.length != expected_terms.length) {
              equal(_lodash2.default.pluck(terms, 'name'), _lodash2.default.pluck(expected_terms, 'name'), "list of completion terms is not of equal size");
            } else {
              var filtered_actual_terms = _lodash2.default.map(terms, function (actual_term, i) {
                var expected_term = expected_terms[i];
                var filtered_term = {};
                _lodash2.default.each(expected_term, function (v, p) {
                  filtered_term[p] = actual_term[p];
                });
                return filtered_term;
              });
              deepEqual(filtered_actual_terms, expected_terms);
            }
          }

          var context = terms[0].context;
          input.autocomplete._test.addReplacementInfoToContext(context, test.cursor, terms[0].value);

          function ac(prop, prop_test) {
            if (typeof test[prop] != "undefined") {
              if (prop_test) {
                prop_test(context[prop], test[prop], prop);
              } else {
                deepEqual(context[prop], test[prop], 'context.' + prop + ' should equal ' + JSON.stringify(test[prop]));
              }
            }
          }

          function pos_compare(actual, expected, name) {
            equal(actual.row, expected.row + rowOffset, "row of " + name + " position is not as expected");
            equal(actual.column, expected.column, "column of " + name + " position is not as expected");
          }

          function range_compare(actual, expected, name) {
            pos_compare(actual.start, expected.start, name + ".start");
            pos_compare(actual.end, expected.end, name + ".end");
          }

          ac("prefixToAdd");
          ac("suffixToAdd");
          ac("addTemplate");
          ac("textBoxPosition", pos_compare);
          ac("rangeToReplace", range_compare);

          start();
        });
      });
    });
  });
}

function context_tests(data, mapping, kb_schemes, request_line, tests) {
  if (data != null && typeof data != "string") {
    data = JSON.stringify(data, null, 3);
  }
  for (var t = 0; t < tests.length; t++) {
    process_context_test(data, mapping, kb_schemes, request_line, tests[t]);
  }
}

var SEARCH_KB = {
  endpoints: {
    _search: {
      methods: ["GET", "POST"],
      patterns: ["{indices}/{types}/_search", "{indices}/_search", "_search"],
      data_autocomplete_rules: {
        query: { match_all: {}, term: { "{field}": { __template: { "f": 1 } } } },
        size: {},
        facets: {
          __template: {
            "FIELD": {}
          },
          "*": { terms: { field: "{field}" } }
        }
      }
    }
  }
};

var MAPPING = {
  "index1": {
    "type1.1": {
      "properties": {
        "field1.1.1": { "type": "string" },
        "field1.1.2": { "type": "string" }
      }
    }
  },
  "index2": {
    "type2.1": {
      "properties": {
        "field2.1.1": { "type": "string" },
        "field2.1.2": { "type": "string" }
      }
    }
  }
};

context_tests({}, MAPPING, SEARCH_KB, "POST _search", [{
  name: "Empty doc",
  cursor: { row: 0, column: 1 },
  initialValue: "",
  addTemplate: true,
  prefixToAdd: "",
  suffixToAdd: "",
  rangeToReplace: { start: { row: 0, column: 1 }, end: { row: 0, column: 1 } },
  autoCompleteSet: ["facets", "query", "size"]
}]);

context_tests({}, MAPPING, SEARCH_KB, "POST _no_context", [{
  name: "Missing KB",
  cursor: { row: 0, column: 1 },
  no_context: true
}]);

context_tests({
  "query": {
    "f": 1
  }
}, MAPPING, {
  globals: {
    query: {
      t1: 2
    }
  },
  endpoints: {}
}, "POST _no_context", [{
  name: "Missing KB - global auto complete",
  cursor: { row: 2, column: 5 },
  autoCompleteSet: ["t1"]
}]);

context_tests({
  "query": {
    "field": "something"
  },
  "facets": {},
  "size": 20
}, MAPPING, SEARCH_KB, "POST _search", [{
  name: "existing dictionary key, no template",
  cursor: { row: 1, column: 6 },
  initialValue: "query",
  addTemplate: false,
  prefixToAdd: "",
  suffixToAdd: "",
  rangeToReplace: { start: { row: 1, column: 3 }, end: { row: 1, column: 10 } },
  autoCompleteSet: ["facets", "query", "size"]
}, {
  name: "existing inner dictionary key",
  cursor: { row: 2, column: 7 },
  initialValue: "field",
  addTemplate: false,
  prefixToAdd: "",
  suffixToAdd: "",
  rangeToReplace: { start: { row: 2, column: 6 }, end: { row: 2, column: 13 } },
  autoCompleteSet: ["match_all", "term"]
}, {
  name: "existing dictionary key, yes template",
  cursor: { row: 4, column: 7 },
  initialValue: "facets",
  addTemplate: true,
  prefixToAdd: "",
  suffixToAdd: "",
  rangeToReplace: { start: { row: 4, column: 3 }, end: { row: 4, column: 15 } },
  autoCompleteSet: ["facets", "query", "size"]
}, {
  name: "ignoring meta keys",
  cursor: { row: 4, column: 14 },
  no_context: true
}]);

context_tests('{\n' + '   "query": {\n' + '    "field": "something"\n' + '   },\n' + '   "facets": {},\n' + '   "size": 20 \n' + '}', MAPPING, SEARCH_KB, "POST _search", [{
  name: "trailing comma, end of line",
  cursor: { row: 4, column: 16 },
  initialValue: "",
  addTemplate: true,
  prefixToAdd: "",
  suffixToAdd: ", ",
  rangeToReplace: { start: { row: 4, column: 16 }, end: { row: 4, column: 16 } },
  autoCompleteSet: ["facets", "query", "size"]
}, {
  name: "trailing comma, beginning of line",
  cursor: { row: 5, column: 1 },
  initialValue: "",
  addTemplate: true,
  prefixToAdd: "",
  suffixToAdd: ", ",
  rangeToReplace: { start: { row: 5, column: 1 }, end: { row: 5, column: 1 } },
  autoCompleteSet: ["facets", "query", "size"]
}, {
  name: "prefix comma, beginning of line",
  cursor: { row: 6, column: 0 },
  initialValue: "",
  addTemplate: true,
  prefixToAdd: ", ",
  suffixToAdd: "",
  rangeToReplace: { start: { row: 6, column: 0 }, end: { row: 6, column: 0 } },
  autoCompleteSet: ["facets", "query", "size"]
}, {
  name: "prefix comma, end of line",
  cursor: { row: 5, column: 14 },
  initialValue: "",
  addTemplate: true,
  prefixToAdd: ", ",
  suffixToAdd: "",
  rangeToReplace: { start: { row: 5, column: 14 }, end: { row: 5, column: 14 } },
  autoCompleteSet: ["facets", "query", "size"]
}]);

context_tests({
  "object": 1,
  "array": 1,
  "value_one_of": 1,
  "value": 2,
  "something_else": 5
}, MAPPING, {
  endpoints: {
    _test: {
      patterns: ["_test"],
      data_autocomplete_rules: {
        object: { bla: 1 },
        array: [1],
        value_one_of: { __one_of: [1, 2] },
        value: 3,
        "*": { __one_of: [4, 5] }
      }
    }
  }
}, "GET _test", [{
  name: "not matching object when { is not opened",
  cursor: { row: 1, column: 12 },
  initialValue: "",
  autoCompleteSet: ["{"]
}, {
  name: "not matching array when [ is not opened",
  cursor: { row: 2, column: 12 },
  initialValue: "",
  autoCompleteSet: ["["]
}, {
  name: "matching value with one_of",
  cursor: { row: 3, column: 19 },
  initialValue: "",
  autoCompleteSet: [1, 2]
}, {
  name: "matching value",
  cursor: { row: 4, column: 12 },
  initialValue: "",
  autoCompleteSet: [3]
}, {
  name: "matching any value with one_of",
  cursor: { row: 5, column: 21 },
  initialValue: "",
  autoCompleteSet: [4, 5]
}]);

context_tests({
  "query": {
    "field": "something"
  },
  "facets": {
    "name": {}
  },
  "size": 20
}, MAPPING, SEARCH_KB, "GET _search", [{
  name: "* matching everything",
  cursor: { row: 5, column: 15 },
  initialValue: "",
  addTemplate: true,
  prefixToAdd: "",
  suffixToAdd: "",
  rangeToReplace: { start: { row: 5, column: 15 }, end: { row: 5, column: 15 } },
  autoCompleteSet: [{ name: "terms", meta: "API" }]
}]);

context_tests({
  "index": "123"
}, MAPPING, {
  endpoints: {
    _test: {
      patterns: ["_test"],
      data_autocomplete_rules: {
        index: "{index}"
      }
    }
  }
}, "GET _test", [{
  name: "{index} matching",
  cursor: { row: 1, column: 15 },
  autoCompleteSet: [{ name: "index1", meta: "index" }, { name: "index2", meta: "index" }]
}]);

function tt(term, template, meta) {
  term = { name: term, template: template };
  if (meta) {
    term.meta = meta;
  }
  return term;
}

context_tests({
  "array": ["a"],
  "oneof": "1"
}, MAPPING, {
  endpoints: {
    _endpoint: {
      patterns: ["_endpoint"],
      data_autocomplete_rules: {
        array: ["a", "b"],
        number: 1,
        object: {},
        fixed: { __template: { "a": 1 } },
        oneof: { __one_of: ["o1", "o2"] }
      }
    }
  }
}, "GET _endpoint", [{
  name: "Templates 1",
  cursor: { row: 1, column: 0 },
  autoCompleteSet: [tt("array", []), tt("fixed", { a: 1 }), tt("number", 1), tt("object", {}), tt("oneof", "o1")]
}, {
  name: "Templates - one off",
  cursor: { row: 4, column: 12 },
  autoCompleteSet: [tt("o1"), tt("o2")]
}]);

context_tests({
  "string": "value",
  "context": {}
}, MAPPING, {
  endpoints: {
    _endpoint: {
      patterns: ["_endpoint"],
      data_autocomplete_rules: {
        context: {
          __one_of: [{
            __condition: {
              lines_regex: "value"
            },
            "match": {}
          }, {
            __condition: {
              lines_regex: "other"
            },
            "no_match": {}
          }, { "always": {} }]
        }
      }
    }
  }
}, "GET _endpoint", [{
  name: "Conditionals",
  cursor: { row: 2, column: 15 },
  autoCompleteSet: [tt("always", {}), tt("match", {})]
}]);

context_tests({
  "any_of_numbers": [1],
  "any_of_obj": [{
    "a": 1
  }],
  "any_of_mixed": [{
    "a": 1
  }, 2]
}, MAPPING, {
  endpoints: {
    _endpoint: {
      patterns: ["_endpoint"],
      data_autocomplete_rules: {
        any_of_numbers: { __template: [1, 2], __any_of: [1, 2, 3] },
        any_of_obj: {
          __template: [{ c: 1 }], __any_of: [{ a: 1, b: 2 }, { c: 1 }]
        },
        any_of_mixed: {
          __any_of: [{ a: 1 }, 3]
        }
      }
    }
  }
}, "GET _endpoint", [{
  name: "Any of - templates",
  cursor: { row: 1, column: 0 },
  autoCompleteSet: [tt("any_of_mixed", []), tt("any_of_numbers", [1, 2]), tt("any_of_obj", [{ c: 1 }])]
}, {
  name: "Any of - numbers",
  cursor: { row: 2, column: 2 },
  autoCompleteSet: [1, 2, 3]
}, {
  name: "Any of - object",
  cursor: { row: 6, column: 2 },
  autoCompleteSet: [tt("a", 1), tt("b", 2), tt("c", 1)]
}, {
  name: "Any of - mixed - obj",
  cursor: { row: 11, column: 2 },
  autoCompleteSet: [tt("a", 1)]
}, {
  name: "Any of - mixed - both",
  cursor: { row: 13, column: 2 },
  autoCompleteSet: [tt("{"), tt(3)]
}]);

context_tests({}, MAPPING, {
  endpoints: {
    _endpoint: {
      patterns: ["_endpoint"],
      data_autocomplete_rules: {
        "query": ""
      }
    }
  }
}, "GET _endpoint", [{
  name: "Empty string as default",
  cursor: { row: 0, column: 1 },
  autoCompleteSet: [tt("query", "")]
}]);

context_tests({
  "a": {
    "b": {},
    "c": {},
    "d": {
      t1a: {}
    },
    "e": {},
    "f": [{}],
    "g": {},
    "h": {}
  }
}, MAPPING, {
  globals: {
    gtarget: {
      t1: 2,
      t1a: {
        __scope_link: "."
      }
    }
  },
  endpoints: {
    _current: {
      patterns: ["_current"],
      data_autocomplete_rules: {
        "a": {
          "b": {
            __scope_link: ".a"
          },
          "c": {
            __scope_link: "ext.target"
          },
          "d": {
            __scope_link: "GLOBAL.gtarget"
          },
          "e": {
            __scope_link: "ext"
          },
          "f": [{
            __scope_link: "ext.target"
          }],
          "g": {
            __scope_link: function __scope_link() {
              return {
                "a": 1,
                "b": 2
              };
            }
          },
          "h": {
            __scope_link: "GLOBAL.broken"
          }
        }
      }
    },
    ext: {
      patterns: ["ext"],
      data_autocomplete_rules: {
        target: {
          t2: 1
        }
      }
    }
  }
}, "GET _current", [{
  name: "Relative scope link test",
  cursor: { row: 2, column: 12 },
  autoCompleteSet: [tt("b", {}), tt("c", {}), tt("d", {}), tt("e", {}), tt("f", [{}]), tt("g", {}), tt("h", {})]
}, {
  name: "External scope link test",
  cursor: { row: 3, column: 12 },
  autoCompleteSet: [tt("t2", 1)]
}, {
  name: "Global scope link test",
  cursor: { row: 4, column: 12 },
  autoCompleteSet: [tt("t1", 2), tt("t1a", {})]
}, {
  name: "Global scope link with an internal scope link",
  cursor: { row: 5, column: 17 },
  autoCompleteSet: [tt("t1", 2), tt("t1a", {})]
}, {
  name: "Entire endpoint scope link test",
  cursor: { row: 7, column: 12 },
  autoCompleteSet: [tt("target", {})]
}, {
  name: "A scope link within an array",
  cursor: { row: 9, column: 10 },
  autoCompleteSet: [tt("t2", 1)]
}, {
  name: "A function based scope link",
  cursor: { row: 11, column: 12 },
  autoCompleteSet: [tt("a", 1), tt("b", 2)]
}, {
  name: "A global scope link with wrong link",
  cursor: { row: 12, column: 12 },
  assertThrows: /broken/

}]);

context_tests({}, MAPPING, {
  globals: {
    gtarget: {
      t1: 2
    }
  },
  endpoints: {
    _current: {
      patterns: ["_current"],
      id: "GET _current",
      data_autocomplete_rules: {
        __scope_link: "GLOBAL.gtarget"
      }
    }
  }
}, "GET _current", [{
  name: "Top level scope link",
  cursor: { row: 0, column: 1 },
  autoCompleteSet: [tt("t1", 2)]
}]);

context_tests({
  "a": {}
}, MAPPING, {
  endpoints: {
    _endpoint: {
      patterns: ["_endpoint"],
      data_autocomplete_rules: {
        "a": {},
        "b": {}
      }
    }
  }
}, "GET _endpoint", [{
  name: "Path after empty object",
  cursor: { row: 1, column: 10 },
  autoCompleteSet: ["a", "b"]
}]);

context_tests({
  "": {}
}, MAPPING, SEARCH_KB, "POST _search", [{
  name: "Replace an empty string",
  cursor: { row: 1, column: 4 },
  rangeToReplace: { start: { row: 1, column: 3 }, end: { row: 1, column: 9 } }
}]);

context_tests({
  "a": [{
    "c": {}
  }]
}, MAPPING, {
  endpoints: {
    _endpoint: {
      patterns: ["_endpoint"],
      data_autocomplete_rules: {
        "a": [{ b: 1 }]
      }
    }
  }
}, "GET _endpoint", [{
  name: "List of objects - internal autocomplete",
  cursor: { row: 3, column: 10 },
  autoCompleteSet: ["b"]
}, {
  name: "List of objects - external template",
  cursor: { row: 0, column: 1 },
  autoCompleteSet: [tt("a", [{}])]
}]);

context_tests({
  "query": {
    "term": {
      "field": "something"
    }
  },
  "facets": {
    "test": {
      "terms": {
        "field": "test"
      }
    }
  },
  "size": 20
}, MAPPING, SEARCH_KB, "POST index1/_search", [{
  name: "Field completion as scope",
  cursor: { row: 3, column: 10 },
  autoCompleteSet: [tt("field1.1.1", { "f": 1 }, "string"), tt("field1.1.2", { "f": 1 }, "string")]
}, {
  name: "Field completion as value",
  cursor: { row: 9, column: 23 },
  autoCompleteSet: [{ name: "field1.1.1", meta: "string" }, { name: "field1.1.2", meta: "string" }]
}]);

context_tests("POST _search", MAPPING, SEARCH_KB, null, [{
  name: "initial doc start",
  cursor: { row: 1, column: 0 },
  autoCompleteSet: ["{"],
  prefixToAdd: "",
  suffixToAdd: ""
}]);

context_tests('{\n' + '   "query": {} \n' + '}\n' + '\n' + '\n', MAPPING, SEARCH_KB, "POST _search", [{
  name: "Cursor rows after request end",
  cursor: { row: 4, column: 0 },
  autoCompleteSet: ["GET", "PUT", "POST", "DELETE", "HEAD"],
  prefixToAdd: "",
  suffixToAdd: " "
}, {
  name: "Cursor just after request end",
  cursor: { row: 2, column: 1 },
  no_context: true
}]);

var CLUSTER_KB = {
  endpoints: {
    "_search": {
      patterns: ["_search", "{indices}/{types}/_search", "{indices}/_search"],
      url_params: {
        "search_type": ["count", "query_then_fetch"],
        "scroll": "10m"
      },
      data_autocomplete_rules: {}
    },
    "_cluster/stats": {
      patterns: ["_cluster/stats"],
      indices_mode: "none",
      data_autocomplete_rules: {}
    },
    "_cluster/nodes/stats": {
      patterns: ["_cluster/nodes/stats"],
      data_autocomplete_rules: {}
    }
  }
};

context_tests(null, MAPPING, CLUSTER_KB, "GET _cluster", [{
  name: "Endpoints with slashes - no slash",
  cursor: { row: 0, column: 8 },
  autoCompleteSet: ["_cluster/nodes/stats", "_cluster/stats", "_search", "index1", "index2"],
  prefixToAdd: "",
  suffixToAdd: ""
}]);

context_tests(null, MAPPING, CLUSTER_KB, "GET _cluster/", [{
  name: "Endpoints with slashes - before slash",
  cursor: { row: 0, column: 7 },
  autoCompleteSet: ["_cluster/nodes/stats", "_cluster/stats", "_search", "index1", "index2"],
  prefixToAdd: "",
  suffixToAdd: ""
}, {
  name: "Endpoints with slashes - on slash",
  cursor: { row: 0, column: 12 },
  autoCompleteSet: ["_cluster/nodes/stats", "_cluster/stats", "_search", "index1", "index2"],
  prefixToAdd: "",
  suffixToAdd: ""
}, {
  name: "Endpoints with slashes - after slash",
  cursor: { row: 0, column: 13 },
  autoCompleteSet: ["nodes/stats", "stats"],
  prefixToAdd: "",
  suffixToAdd: ""
}]);

context_tests(null, MAPPING, CLUSTER_KB, "GET _cluster/no", [{
  name: "Endpoints with slashes - after slash",
  cursor: { row: 0, column: 14 },
  autoCompleteSet: [{ name: "nodes/stats", meta: "endpoint" }, { name: "stats", meta: "endpoint" }],
  prefixToAdd: "",
  suffixToAdd: "",
  initialValue: "no"
}]);

context_tests(null, MAPPING, CLUSTER_KB, "GET _cluster/nodes/st", [{
  name: "Endpoints with two slashes",
  cursor: { row: 0, column: 20 },
  autoCompleteSet: ["stats"],
  prefixToAdd: "",
  suffixToAdd: "",
  initialValue: "st"
}]);

context_tests(null, MAPPING, CLUSTER_KB, "GET ", [{
  name: "Immediately after space + method",
  cursor: { row: 0, column: 4 },
  autoCompleteSet: [{ name: "_cluster/nodes/stats", meta: "endpoint" }, { name: "_cluster/stats", meta: "endpoint" }, { name: "_search", meta: "endpoint" }, { name: "index1", meta: "index" }, { name: "index2", meta: "index" }],
  prefixToAdd: "",
  suffixToAdd: "",
  initialValue: ""
}]);

context_tests(null, MAPPING, CLUSTER_KB, "GET cl", [{
  name: "Endpoints by subpart",
  cursor: { row: 0, column: 6 },
  autoCompleteSet: [{ name: "_cluster/nodes/stats", meta: "endpoint" }, { name: "_cluster/stats", meta: "endpoint" }, { name: "_search", meta: "endpoint" }, { name: "index1", meta: "index" }, { name: "index2", meta: "index" }],
  prefixToAdd: "",
  suffixToAdd: "",
  initialValue: "cl"
}]);

context_tests(null, MAPPING, CLUSTER_KB, "POST cl", [{
  name: "Endpoints by subpart",
  cursor: { row: 0, column: 7 },
  autoCompleteSet: [{ name: "_cluster/nodes/stats", meta: "endpoint" }, { name: "_cluster/stats", meta: "endpoint" }, { name: "_search", meta: "endpoint" }, { name: "index1", meta: "index" }, { name: "index2", meta: "index" }],
  prefixToAdd: "",
  suffixToAdd: "",
  initialValue: "cl"
}]);

context_tests(null, MAPPING, CLUSTER_KB, "GET _search?", [{
  name: "Params just after ?",
  cursor: { row: 0, column: 12 },
  autoCompleteSet: [{ name: "filter_path", meta: "param", "insert_value": "filter_path=" }, { name: "format", meta: "param", "insert_value": "format=" }, { name: "pretty", meta: "flag" }, { name: "scroll", meta: "param", "insert_value": "scroll=" }, { name: "search_type", meta: "param", "insert_value": "search_type=" }],
  prefixToAdd: "",
  suffixToAdd: ""
}]);

context_tests(null, MAPPING, CLUSTER_KB, "GET _search?format=", [{
  name: "Params values",
  cursor: { row: 0, column: 19 },
  autoCompleteSet: [{ name: "json", meta: "format" }, { name: "yaml", meta: "format" }],
  prefixToAdd: "",
  suffixToAdd: ""
}]);

context_tests(null, MAPPING, CLUSTER_KB, "GET _search?format=yaml&", [{
  name: "Params after amp",
  cursor: { row: 0, column: 24 },
  autoCompleteSet: [{ name: "filter_path", meta: "param", "insert_value": "filter_path=" }, { name: "format", meta: "param", "insert_value": "format=" }, { name: "pretty", meta: "flag" }, { name: "scroll", meta: "param", "insert_value": "scroll=" }, { name: "search_type", meta: "param", "insert_value": "search_type=" }],
  prefixToAdd: "",
  suffixToAdd: ""
}]);

context_tests(null, MAPPING, CLUSTER_KB, "GET _search?format=yaml&search", [{
  name: "Params on existing param",
  cursor: { row: 0, column: 26 },
  rangeToReplace: {
    start: { row: 0, column: 24 },
    end: { row: 0, column: 30 }
  },
  autoCompleteSet: [{ name: "filter_path", meta: "param", "insert_value": "filter_path=" }, { name: "format", meta: "param", "insert_value": "format=" }, { name: "pretty", meta: "flag" }, { name: "scroll", meta: "param", "insert_value": "scroll=" }, { name: "search_type", meta: "param", "insert_value": "search_type=" }],
  prefixToAdd: "",
  suffixToAdd: ""
}]);

context_tests(null, MAPPING, CLUSTER_KB, "GET _search?format=yaml&search_type=cou", [{
  name: "Params on existing value",
  cursor: { row: 0, column: 37 },
  rangeToReplace: {
    start: { row: 0, column: 36 },
    end: { row: 0, column: 39 }
  },
  autoCompleteSet: [{ name: "count", meta: "search_type" }, { name: "query_then_fetch", meta: "search_type" }],
  prefixToAdd: "",
  suffixToAdd: ""
}]);
context_tests(null, MAPPING, CLUSTER_KB, "GET _search?format=yaml&search_type=cou", [{
  name: "Params on just after = with existing value",
  cursor: { row: 0, column: 36 },
  rangeToReplace: {
    start: { row: 0, column: 36 },
    end: { row: 0, column: 36 }
  },
  autoCompleteSet: [{ name: "count", meta: "search_type" }, { name: "query_then_fetch", meta: "search_type" }],
  prefixToAdd: "",
  suffixToAdd: ""
}]);

context_tests({
  "query": {
    "field": "something"
  },
  "facets": {},
  "size": 20
}, MAPPING, SEARCH_KB, "POST http://somehost/_search", [{
  name: "fullurl - existing dictionary key, no template",
  cursor: { row: 1, column: 6 },
  initialValue: "query",
  addTemplate: false,
  prefixToAdd: "",
  suffixToAdd: "",
  rangeToReplace: { start: { row: 1, column: 3 }, end: { row: 1, column: 10 } },
  autoCompleteSet: ["facets", "query", "size"]
}, {
  name: "fullurl - existing inner dictionary key",
  cursor: { row: 2, column: 7 },
  initialValue: "field",
  addTemplate: false,
  prefixToAdd: "",
  suffixToAdd: "",
  rangeToReplace: { start: { row: 2, column: 6 }, end: { row: 2, column: 13 } },
  autoCompleteSet: ["match_all", "term"]
}, {
  name: "fullurl - existing dictionary key, yes template",
  cursor: { row: 4, column: 7 },
  initialValue: "facets",
  addTemplate: true,
  prefixToAdd: "",
  suffixToAdd: "",
  rangeToReplace: { start: { row: 4, column: 3 }, end: { row: 4, column: 15 } },
  autoCompleteSet: ["facets", "query", "size"]
}]);

/***/ })

},[3427]);
//# sourceMappingURL=sense-tests.bundle.js.map