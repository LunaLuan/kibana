webpackJsonp([3],{

/***/ 1012:
/***/ (function(module, exports) {

//
// Copyright Kamil Pękala http://github.com/kamilkp
// angular-sortable-view v0.0.15 2015/01/18
//

;(function(window, angular){
	'use strict';
	/* jshint eqnull:true */
	/* jshint -W041 */
	/* jshint -W030 */

	var module = angular.module('angular-sortable-view', []);
	module.directive('svRoot', [function(){
		function shouldBeAfter(elem, pointer, isGrid){
			return isGrid ? elem.x - pointer.x < 0 : elem.y - pointer.y < 0;
		}
		function getSortableElements(key){
			return ROOTS_MAP[key];
		}
		function removeSortableElements(key){
			delete ROOTS_MAP[key];
		}

		var sortingInProgress;
		var ROOTS_MAP = Object.create(null);
		// window.ROOTS_MAP = ROOTS_MAP; // for debug purposes

		return {
			restrict: 'A',
			controller: ['$scope', '$attrs', '$interpolate', '$parse', function($scope, $attrs, $interpolate, $parse){
				var mapKey = $interpolate($attrs.svRoot)($scope) || $scope.$id;
				if(!ROOTS_MAP[mapKey]) ROOTS_MAP[mapKey] = [];

				var that         = this;
				var candidates;  // set of possible destinations
				var $placeholder;// placeholder element
				var options;     // sortable options
				var $helper;     // helper element - the one thats being dragged around with the mouse pointer
				var $original;   // original element
				var $target;     // last best candidate
				var isGrid       = false;
				var onSort       = $parse($attrs.svOnSort);

				// ----- hack due to https://github.com/angular/angular.js/issues/8044
				$attrs.svOnStart = $attrs.$$element[0].attributes['sv-on-start'];
				$attrs.svOnStart = $attrs.svOnStart && $attrs.svOnStart.value;

				$attrs.svOnStop = $attrs.$$element[0].attributes['sv-on-stop'];
				$attrs.svOnStop = $attrs.svOnStop && $attrs.svOnStop.value;
				// -------------------------------------------------------------------

				var onStart = $parse($attrs.svOnStart);
				var onStop = $parse($attrs.svOnStop);

				this.sortingInProgress = function(){
					return sortingInProgress;
				};

				if($attrs.svGrid){ // sv-grid determined explicite
					isGrid = $attrs.svGrid === "true" ? true : $attrs.svGrid === "false" ? false : null;
					if(isGrid === null)
						throw 'Invalid value of sv-grid attribute';
				}
				else{
					// check if at least one of the lists have a grid like layout
					$scope.$watchCollection(function(){
						return getSortableElements(mapKey);
					}, function(collection){
						isGrid = false;
						var array = collection.filter(function(item){
							return !item.container;
						}).map(function(item){
							return {
								part: item.getPart().id,
								y: item.element[0].getBoundingClientRect().top
							};
						});
						var dict = Object.create(null);
						array.forEach(function(item){
							if(dict[item.part])
								dict[item.part].push(item.y);
							else
								dict[item.part] = [item.y];
						});
						Object.keys(dict).forEach(function(key){
							dict[key].sort();
							dict[key].forEach(function(item, index){
								if(index < dict[key].length - 1){
									if(item > 0 && item === dict[key][index + 1]){
										isGrid = true;
									}
								}
							});
						});
					});
				}

				this.$moveUpdate = function(opts, mouse, svElement, svOriginal, svPlaceholder, originatingPart, originatingIndex){
					var svRect = svElement[0].getBoundingClientRect();
					if(opts.tolerance === 'element')
						mouse = {
							x: ~~(svRect.left + svRect.width/2),
							y: ~~(svRect.top + svRect.height/2)
						};

					sortingInProgress = true;
					candidates = [];
					if(!$placeholder){
						if(svPlaceholder){ // custom placeholder
							$placeholder = svPlaceholder.clone();
							$placeholder.removeClass('ng-hide');
						}
						else{ // default placeholder
							$placeholder = svOriginal.clone();
							$placeholder.addClass('sv-visibility-hidden');
							$placeholder.addClass('sv-placeholder');
							$placeholder.css({
								'height': svRect.height + 'px',
								'width': svRect.width + 'px'
							});
						}

						svOriginal.after($placeholder);
						svOriginal.addClass('ng-hide');

						// cache options, helper and original element reference
						$original = svOriginal;
						options = opts;
						$helper = svElement;

						onStart($scope, {
							$helper: {element: $helper},
							$part: originatingPart.model(originatingPart.scope),
							$index: originatingIndex,
							$item: originatingPart.model(originatingPart.scope)[originatingIndex]
						});
						$scope.$root && $scope.$root.$$phase || $scope.$apply();
					}

					// ----- move the element
					$helper[0].reposition({
						x: mouse.x + document.body.scrollLeft - mouse.offset.x*svRect.width,
						y: mouse.y + document.body.scrollTop - mouse.offset.y*svRect.height
					});

					// ----- manage candidates
					getSortableElements(mapKey).forEach(function(se, index){
						if(opts.containment != null){
							// TODO: optimize this since it could be calculated only once when the moving begins
							if(
								!elementMatchesSelector(se.element, opts.containment) &&
								!elementMatchesSelector(se.element, opts.containment + ' *')
							) return; // element is not within allowed containment
						}
						var rect = se.element[0].getBoundingClientRect();
						var center = {
							x: ~~(rect.left + rect.width/2),
							y: ~~(rect.top + rect.height/2)
						};
						if(!se.container && // not the container element
							(se.element[0].scrollHeight || se.element[0].scrollWidth)){ // element is visible
							candidates.push({
								element: se.element,
								q: (center.x - mouse.x)*(center.x - mouse.x) + (center.y - mouse.y)*(center.y - mouse.y),
								view: se.getPart(),
								targetIndex: se.getIndex(),
								after: shouldBeAfter(center, mouse, isGrid)
							});
						}
						if(se.container && !se.element[0].querySelector('[sv-element]:not(.sv-placeholder):not(.sv-source)')){ // empty container
							candidates.push({
								element: se.element,
								q: (center.x - mouse.x)*(center.x - mouse.x) + (center.y - mouse.y)*(center.y - mouse.y),
								view: se.getPart(),
								targetIndex: 0,
								container: true
							});
						}
					});
					var pRect = $placeholder[0].getBoundingClientRect();
					var pCenter = {
						x: ~~(pRect.left + pRect.width/2),
						y: ~~(pRect.top + pRect.height/2)
					};
					candidates.push({
						q: (pCenter.x - mouse.x)*(pCenter.x - mouse.x) + (pCenter.y - mouse.y)*(pCenter.y - mouse.y),
						element: $placeholder,
						placeholder: true
					});
					candidates.sort(function(a, b){
						return a.q - b.q;
					});

					candidates.forEach(function(cand, index){
						if(index === 0 && !cand.placeholder && !cand.container){
							$target = cand;
							cand.element.addClass('sv-candidate');
							if(cand.after)
								cand.element.after($placeholder);
							else
								insertElementBefore(cand.element, $placeholder);
						}
						else if(index === 0 && cand.container){
							$target = cand;
							cand.element.append($placeholder);
						}
						else
							cand.element.removeClass('sv-candidate');
					});
				};

				this.$drop = function(originatingPart, index, options){
					if(!$placeholder) return;

					if(options.revert){
						var placeholderRect = $placeholder[0].getBoundingClientRect();
						var helperRect = $helper[0].getBoundingClientRect();
						var distance = Math.sqrt(
							Math.pow(helperRect.top - placeholderRect.top, 2) +
							Math.pow(helperRect.left - placeholderRect.left, 2)
						);

						var duration = +options.revert*distance/200; // constant speed: duration depends on distance
						duration = Math.min(duration, +options.revert); // however it's not longer that options.revert

						['-webkit-', '-moz-', '-ms-', '-o-', ''].forEach(function(prefix){
							if(typeof $helper[0].style[prefix + 'transition'] !== "undefined")
								$helper[0].style[prefix + 'transition'] = 'all ' + duration + 'ms ease';
						});
						setTimeout(afterRevert, duration);
						$helper.css({
							'top': placeholderRect.top + document.body.scrollTop + 'px',
							'left': placeholderRect.left + document.body.scrollLeft + 'px'
						});
					}
					else
						afterRevert();

					function afterRevert(){
						sortingInProgress = false;
						$placeholder.remove();
						$helper.remove();
						$original.removeClass('ng-hide');

						candidates = void 0;
						$placeholder = void 0;
						options = void 0;
						$helper = void 0;
						$original = void 0;

						// sv-on-stop callback
						onStop($scope, {
							$part: originatingPart.model(originatingPart.scope),
							$index: index,
							$item: originatingPart.model(originatingPart.scope)[index]
						});

						if($target){
							$target.element.removeClass('sv-candidate');
							var spliced = originatingPart.model(originatingPart.scope).splice(index, 1);
							var targetIndex = $target.targetIndex;
							if($target.view === originatingPart && $target.targetIndex > index)
								targetIndex--;
							if($target.after)
								targetIndex++;
							$target.view.model($target.view.scope).splice(targetIndex, 0, spliced[0]);

							// sv-on-sort callback
							if($target.view !== originatingPart || index !== targetIndex)
								onSort($scope, {
									$partTo: $target.view.model($target.view.scope),
									$partFrom: originatingPart.model(originatingPart.scope),
									$item: spliced[0],
									$indexTo: targetIndex,
									$indexFrom: index
								});

						}
						$target = void 0;

						$scope.$root && $scope.$root.$$phase || $scope.$apply();
					}
				};

				this.addToSortableElements = function(se){
					getSortableElements(mapKey).push(se);
				};
				this.removeFromSortableElements = function(se){
					var elems = getSortableElements(mapKey);
					var index = elems.indexOf(se);
					if(index > -1){
						elems.splice(index, 1);
						if(elems.length === 0)
							removeSortableElements(mapKey);
					}
				};
			}]
		};
	}]);

	module.directive('svPart', ['$parse', function($parse){
		return {
			restrict: 'A',
			require: '^svRoot',
			controller: ['$scope', function($scope){
				$scope.$ctrl = this;
				this.getPart = function(){
					return $scope.part;
				};
				this.$drop = function(index, options){
					$scope.$sortableRoot.$drop($scope.part, index, options);
				};
			}],
			scope: true,
			link: function($scope, $element, $attrs, $sortable){
				if(!$attrs.svPart) throw new Error('no model provided');
				var model = $parse($attrs.svPart);
				if(!model.assign) throw new Error('model not assignable');

				$scope.part = {
					id: $scope.$id,
					element: $element,
					model: model,
					scope: $scope
				};
				$scope.$sortableRoot = $sortable;

				var sortablePart = {
					element: $element,
					getPart: $scope.$ctrl.getPart,
					container: true
				};
				$sortable.addToSortableElements(sortablePart);
				$scope.$on('$destroy', function(){
					$sortable.removeFromSortableElements(sortablePart);
				});
			}
		};
	}]);

	module.directive('svElement', ['$parse', function($parse){
		return {
			restrict: 'A',
			require: ['^svPart', '^svRoot'],
			controller: ['$scope', function($scope){
				$scope.$ctrl = this;
			}],
			link: function($scope, $element, $attrs, $controllers){
				var sortableElement = {
					element: $element,
					getPart: $controllers[0].getPart,
					getIndex: function(){
						return $scope.$index;
					}
				};
				$controllers[1].addToSortableElements(sortableElement);
				$scope.$on('$destroy', function(){
					$controllers[1].removeFromSortableElements(sortableElement);
				});

				var handle = $element;
				handle.on('mousedown touchstart', onMousedown);
				$scope.$watch('$ctrl.handle', function(customHandle){
					if(customHandle){
						handle.off('mousedown touchstart', onMousedown);
						handle = customHandle;
						handle.on('mousedown touchstart', onMousedown);
					}
				});

				var helper;
				$scope.$watch('$ctrl.helper', function(customHelper){
					if(customHelper){
						helper = customHelper;
					}
				});

				var placeholder;
				$scope.$watch('$ctrl.placeholder', function(customPlaceholder){
					if(customPlaceholder){
						placeholder = customPlaceholder;
					}
				});

				var body = angular.element(document.body);
				var html = angular.element(document.documentElement);

				var moveExecuted;

				function onMousedown(e){
					touchFix(e);

					if($controllers[1].sortingInProgress()) return;
					if(e.button != 0 && e.type === 'mousedown') return;

					moveExecuted = false;
					var opts = $parse($attrs.svElement)($scope);
					opts = angular.extend({}, {
						tolerance: 'pointer',
						revert: 200,
						containment: 'html'
					}, opts);
					if(opts.containment){
						var containmentRect = closestElement.call($element, opts.containment)[0].getBoundingClientRect();
					}

					var target = $element;
					var clientRect = $element[0].getBoundingClientRect();
					var clone;

					if(!helper) helper = $controllers[0].helper;
					if(!placeholder) placeholder = $controllers[0].placeholder;
					if(helper){
						clone = helper.clone();
						clone.removeClass('ng-hide');
						clone.css({
							'left': clientRect.left + document.body.scrollLeft + 'px',
							'top': clientRect.top + document.body.scrollTop + 'px'
						});
						target.addClass('sv-visibility-hidden');
					}
					else{
						clone = target.clone();
						clone.addClass('sv-helper').css({
							'left': clientRect.left + document.body.scrollLeft + 'px',
							'top': clientRect.top + document.body.scrollTop + 'px',
							'width': clientRect.width + 'px'
						});
					}

					clone[0].reposition = function(coords){
						var targetLeft = coords.x;
						var targetTop = coords.y;
						var helperRect = clone[0].getBoundingClientRect();

						var body = document.body;

						if(containmentRect){
							if(targetTop < containmentRect.top + body.scrollTop) // top boundary
								targetTop = containmentRect.top + body.scrollTop;
							if(targetTop + helperRect.height > containmentRect.top + body.scrollTop + containmentRect.height) // bottom boundary
								targetTop = containmentRect.top + body.scrollTop + containmentRect.height - helperRect.height;
							if(targetLeft < containmentRect.left + body.scrollLeft) // left boundary
								targetLeft = containmentRect.left + body.scrollLeft;
							if(targetLeft + helperRect.width > containmentRect.left + body.scrollLeft + containmentRect.width) // right boundary
								targetLeft = containmentRect.left + body.scrollLeft + containmentRect.width - helperRect.width;
						}
						this.style.left = targetLeft - body.scrollLeft + 'px';
						this.style.top = targetTop - body.scrollTop + 'px';
					};

					var pointerOffset = {
						x: (e.clientX - clientRect.left)/clientRect.width,
						y: (e.clientY - clientRect.top)/clientRect.height
					};
					html.addClass('sv-sorting-in-progress');
					html.on('mousemove touchmove', onMousemove).on('mouseup touchend touchcancel', function mouseup(e){
						html.off('mousemove touchmove', onMousemove);
						html.off('mouseup touchend', mouseup);
						html.removeClass('sv-sorting-in-progress');
						if(moveExecuted){
							$controllers[0].$drop($scope.$index, opts);
						}
						$element.removeClass('sv-visibility-hidden');
					});

					// onMousemove(e);
					function onMousemove(e){
						touchFix(e);
						if(!moveExecuted){
							$element.parent().prepend(clone);
							moveExecuted = true;
						}
						$controllers[1].$moveUpdate(opts, {
							x: e.clientX,
							y: e.clientY,
							offset: pointerOffset
						}, clone, $element, placeholder, $controllers[0].getPart(), $scope.$index);
					}
				}
			}
		};
	}]);

	module.directive('svHandle', function(){
		return {
			require: '?^svElement',
			link: function($scope, $element, $attrs, $ctrl){
				if($ctrl)
					$ctrl.handle = $element.add($ctrl.handle); // support multiple handles
			}
		};
	});

	module.directive('svHelper', function(){
		return {
			require: ['?^svPart', '?^svElement'],
			link: function($scope, $element, $attrs, $ctrl){
				$element.addClass('sv-helper').addClass('ng-hide');
				if($ctrl[1])
					$ctrl[1].helper = $element;
				else if($ctrl[0])
					$ctrl[0].helper = $element;
			}
		};
	});

	module.directive('svPlaceholder', function(){
		return {
			require: ['?^svPart', '?^svElement'],
			link: function($scope, $element, $attrs, $ctrl){
				$element.addClass('sv-placeholder').addClass('ng-hide');
				if($ctrl[1])
					$ctrl[1].placeholder = $element;
				else if($ctrl[0])
					$ctrl[0].placeholder = $element;
			}
		};
	});

	angular.element(document.head).append([
		'<style>' +
		'.sv-helper{' +
			'position: fixed !important;' +
			'z-index: 99999;' +
			'margin: 0 !important;' +
		'}' +
		'.sv-candidate{' +
		'}' +
		'.sv-placeholder{' +
			// 'opacity: 0;' +
		'}' +
		'.sv-sorting-in-progress{' +
			'-webkit-user-select: none;' +
			'-moz-user-select: none;' +
			'-ms-user-select: none;' +
			'user-select: none;' +
		'}' +
		'.sv-visibility-hidden{' +
			'visibility: hidden !important;' +
			'opacity: 0 !important;' +
		'}' +
		'</style>'
	].join(''));

	function touchFix(e){
		if(!('clientX' in e) && !('clientY' in e)) {
			var touches = e.touches || e.originalEvent.touches;
			if(touches && touches.length) {
				e.clientX = touches[0].clientX;
				e.clientY = touches[0].clientY;
			}
			e.preventDefault();
		}
	}

	function getPreviousSibling(element){
		element = element[0];
		if(element.previousElementSibling)
			return angular.element(element.previousElementSibling);
		else{
			var sib = element.previousSibling;
			while(sib != null && sib.nodeType != 1)
				sib = sib.previousSibling;
			return angular.element(sib);
		}
	}

	function insertElementBefore(element, newElement){
		var prevSibl = getPreviousSibling(element);
		if(prevSibl.length > 0){
			prevSibl.after(newElement);
		}
		else{
			element.parent().prepend(newElement);
		}
	}

	var dde = document.documentElement,
	matchingFunction = dde.matches ? 'matches' :
						dde.matchesSelector ? 'matchesSelector' :
						dde.webkitMatches ? 'webkitMatches' :
						dde.webkitMatchesSelector ? 'webkitMatchesSelector' :
						dde.msMatches ? 'msMatches' :
						dde.msMatchesSelector ? 'msMatchesSelector' :
						dde.mozMatches ? 'mozMatches' :
						dde.mozMatchesSelector ? 'mozMatchesSelector' : null;
	if(matchingFunction == null)
		throw 'This browser doesn\'t support the HTMLElement.matches method';

	function elementMatchesSelector(element, selector){
		if(element instanceof angular.element) element = element[0];
		if(matchingFunction !== null)
			return element[matchingFunction](selector);
	}

	var closestElement = angular.element.prototype.closest || function (selector){
		var el = this[0].parentNode;
		while(el !== document.documentElement && !el[matchingFunction](selector))
			el = el.parentNode;

		if(el[matchingFunction](selector))
			return angular.element(el);
		else
			return angular.element();
	};

	/*
		Simple implementation of jQuery's .add method
	 */
	if(typeof angular.element.prototype.add !== 'function'){
		angular.element.prototype.add = function(elem){
			var i, res = angular.element();
			elem = angular.element(elem);
			for(i=0;i<this.length;i++){
				res.push(this[i]);
			}
			for(i=0;i<elem.length;i++){
				res.push(elem[i]);
			}
			return res;
		};
	}

})(window, window.angular);

/***/ }),

/***/ 1013:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(12);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = __webpack_require__(2).get('apps/timelion', []);
app.directive('timelionGrid', function () {
  return {
    restrict: 'A',
    scope: {
      timelionGridRows: '=',
      timelionGridColumns: '='
    },
    link: function link($scope, $elem) {

      function init() {
        setDimensions();
      }

      $scope.$on('$destroy', function () {
        (0, _jquery2.default)(window).off('resize'); //remove the handler added earlier
      });

      (0, _jquery2.default)(window).resize(function () {
        setDimensions();
      });

      $scope.$watchMulti(['timelionGridColumns', 'timelionGridRows'], function () {
        setDimensions();
      });

      function setDimensions() {
        var borderSize = 2;
        var headerSize = 45 + 35 + 28 + 20 * 2; // chrome + subnav + buttons + (container padding)
        var verticalPadding = 10;

        if ($scope.timelionGridColumns != null) {
          $elem.width($elem.parent().width() / $scope.timelionGridColumns - borderSize * 2);
        }

        if ($scope.timelionGridRows != null) {
          $elem.height(((0, _jquery2.default)(window).height() - headerSize) / $scope.timelionGridRows - (verticalPadding + borderSize * 2));
        }
      }

      init();
    }
  };
});

/***/ }),

/***/ 1018:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _saved_object_loader = __webpack_require__(375);

var _saved_object_registry = __webpack_require__(227);

var _modules = __webpack_require__(2);

__webpack_require__(1019);

var _module = _modules.uiModules.get('app/sheet');

// Register this service with the saved object registry so it can be
// edited by the object editor.
_saved_object_registry.savedObjectManagementRegistry.register({
  service: 'savedSheets',
  title: 'sheets'
});

// This is the only thing that gets injected into controllers
_module.service('savedSheets', function (Promise, SavedSheet, kbnIndex, kbnUrl, $http, chrome) {
  var savedSheetLoader = new _saved_object_loader.SavedObjectLoader(SavedSheet, kbnIndex, kbnUrl, $http, chrome);
  savedSheetLoader.urlFor = function (id) {
    return kbnUrl.eval('#/{{id}}', { id: id });
  };

  // Customize loader properties since adding an 's' on type doesn't work for type 'timelion-sheet'.
  savedSheetLoader.loaderProperties = {
    name: 'timelion-sheet',
    noun: 'Saved Sheets',
    nouns: 'saved sheets'
  };
  return savedSheetLoader;
});

/***/ }),

/***/ 1019:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _modules = __webpack_require__(2);

var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _module = _modules.uiModules.get('app/timelion');

// Used only by the savedSheets service, usually no reason to change this
_module.factory('SavedSheet', function (courier, config) {

  // SavedSheet constructor. Usually you'd interact with an instance of this.
  // ID is option, without it one will be generated on save.
  _lodash2.default.class(SavedSheet).inherits(courier.SavedObject);
  function SavedSheet(id) {
    // Gives our SavedSheet the properties of a SavedObject
    courier.SavedObject.call(this, {
      type: SavedSheet.type,
      mapping: SavedSheet.mapping,

      // if this is null/undefined then the SavedObject will be assigned the defaults
      id: id,

      // default values that will get assigned if the doc is new
      defaults: {
        title: 'New TimeLion Sheet',
        hits: 0,
        description: '',
        timelion_sheet: ['.es(*)'],
        timelion_interval: 'auto',
        timelion_chart_height: 275,
        timelion_columns: config.get('timelion:default_columns') || 2,
        timelion_rows: config.get('timelion:default_rows') || 2,
        version: 1
      }
    });

    this.showInRecenltyAccessed = true;
  }

  // save these objects with the 'sheet' type
  SavedSheet.type = 'timelion-sheet';

  // if type:sheet has no mapping, we push this mapping into ES
  SavedSheet.mapping = {
    title: 'text',
    hits: 'integer',
    description: 'text',
    timelion_sheet: 'text',
    timelion_interval: 'keyword',
    timelion_other_interval: 'keyword',
    timelion_chart_height: 'integer',
    timelion_columns: 'integer',
    timelion_rows: 'integer',
    version: 'integer'
  };

  // Order these fields to the top, the rest are alphabetical
  SavedSheet.fieldOrder = ['title', 'description'];

  SavedSheet.prototype.getFullPath = function () {
    return '/app/timelion#/' + this.id;
  };

  return SavedSheet;
});

/***/ }),

/***/ 2272:
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
__webpack_require__(2273);
__webpack_require__(216);
__webpack_require__(1038);
__webpack_require__(217);
__webpack_require__(1040);
__webpack_require__(1041);
__webpack_require__(1045);
__webpack_require__(218);
__webpack_require__(219);
__webpack_require__(145);
__webpack_require__(220);
__webpack_require__(21).bootstrap();

/***/ }),

/***/ 2273:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _momentTimezone = __webpack_require__(499);

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

var _doc_title = __webpack_require__(221);

var _saved_object_registry = __webpack_require__(146);

var _notify = __webpack_require__(22);

var _timezone = __webpack_require__(500);

var _persisted_log = __webpack_require__(126);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(845);
__webpack_require__(3205);
__webpack_require__(3207);
__webpack_require__(3208);
__webpack_require__(1014);
__webpack_require__(3226);
__webpack_require__(1017);

__webpack_require__(3230);

document.title = 'Timelion - Kibana';

var app = __webpack_require__(2).get('apps/timelion', []);

__webpack_require__(1018);
__webpack_require__(1019);

__webpack_require__(1020);

_saved_object_registry.SavedObjectRegistryProvider.register(__webpack_require__(3333));

var unsafeNotifications = _notify.notify._notifs;

__webpack_require__(35).enable();

__webpack_require__(35).when('/:id?', {
  template: __webpack_require__(3334),
  reloadOnSearch: false,
  resolve: {
    savedSheet: function savedSheet(courier, savedSheets, $route) {
      return savedSheets.get($route.current.params.id).then(function (savedSheet) {
        if ($route.current.params.id) {
          _persisted_log.recentlyAccessed.add(savedSheet.getFullPath(), savedSheet.title, savedSheet.id);
        }
        return savedSheet;
      }).catch(courier.redirectWhenMissing({
        'search': '/'
      }));
    }
  }
});

var location = 'Timelion';

app.controller('timelion', function ($http, $route, $routeParams, $scope, $timeout, AppState, config, confirmModal, courier, kbnUrl, Notifier, Private, timefilter) {

  // Keeping this at app scope allows us to keep the current page when the user
  // switches to say, the timepicker.
  $scope.page = config.get('timelion:showTutorial', true) ? 1 : 0;
  $scope.setPage = function (page) {
    return $scope.page = page;
  };

  // TODO: For some reason the Kibana core doesn't correctly do this for all apps.
  _momentTimezone2.default.tz.setDefault(config.get('dateFormat:tz'));

  timefilter.enableAutoRefreshSelector();
  timefilter.enableTimeRangeSelector();

  var notify = new Notifier({
    location: location
  });

  var savedVisualizations = Private(_saved_object_registry.SavedObjectRegistryProvider).byLoaderPropertiesName.visualizations;
  var timezone = Private(_timezone.timezoneProvider)();
  var docTitle = Private(_doc_title.DocTitleProvider);

  var defaultExpression = '.es(*)';
  var savedSheet = $route.current.locals.savedSheet;

  $scope.topNavMenu = [{
    key: 'new',
    description: 'New Sheet',
    run: function run() {
      kbnUrl.change('/');
    },
    testId: 'timelionNewButton'
  }, {
    key: 'add',
    description: 'Add a chart',
    run: function run() {
      $scope.newCell();
    },
    testId: 'timelionAddChartButton'
  }, {
    key: 'save',
    description: 'Save Sheet',
    template: __webpack_require__(3335),
    testId: 'timelionSaveButton'
  }, {
    key: 'delete',
    description: 'Delete current sheet',
    disableButton: function disableButton() {
      return !savedSheet.id;
    },
    run: function run() {
      var title = savedSheet.title;
      function doDelete() {
        savedSheet.delete().then(function () {
          _notify.toastNotifications.addSuccess('Deleted \'' + title + '\'');
          kbnUrl.change('/');
        }).catch(function (error) {
          return (0, _notify.fatalError)(error, location);
        });
      }

      var confirmModalOptions = {
        onConfirm: doDelete,
        confirmButtonText: 'Delete',
        title: 'Delete Timelion sheet \'' + title + '\'?'
      };
      confirmModal('You can\'t recover deleted sheets.', confirmModalOptions);
    },
    testId: 'timelionDeleteButton'
  }, {
    key: 'open',
    description: 'Open Sheet',
    template: __webpack_require__(3336),
    testId: 'timelionOpenButton'
  }, {
    key: 'options',
    description: 'Options',
    template: __webpack_require__(3337),
    testId: 'timelionOptionsButton'
  }, {
    key: 'help',
    description: 'Help',
    template: '<timelion-help></timelion-help>',
    testId: 'timelionDocsButton'
  }];

  $timeout(function () {
    if (config.get('timelion:showTutorial', true)) {
      $scope.kbnTopNav.open('help');
    }
  }, 0);

  $scope.transient = {};
  $scope.state = new AppState(getStateDefaults());
  function getStateDefaults() {
    return {
      sheet: savedSheet.timelion_sheet,
      selected: 0,
      columns: savedSheet.timelion_columns,
      rows: savedSheet.timelion_rows,
      interval: savedSheet.timelion_interval
    };
  }

  var init = function init() {
    $scope.running = false;
    $scope.search();

    $scope.$listen($scope.state, 'fetch_with_changes', $scope.search);
    $scope.$listen(timefilter, 'fetch', $scope.search);

    $scope.opts = {
      saveExpression: saveExpression,
      saveSheet: saveSheet,
      savedSheet: savedSheet,
      state: $scope.state,
      search: $scope.search,
      dontShowHelp: function dontShowHelp() {
        config.set('timelion:showTutorial', false);
        $scope.setPage(0);
        $scope.kbnTopNav.close('help');
      }
    };
  };

  var refresher = void 0;
  $scope.$watchCollection('timefilter.refreshInterval', function (interval) {
    if (refresher) $timeout.cancel(refresher);
    if (interval.value > 0 && !interval.pause) {
      var startRefresh = function startRefresh() {
        refresher = $timeout(function () {
          if (!$scope.running) $scope.search();
          startRefresh();
        }, interval.value);
      };

      startRefresh();
    }
  });

  $scope.$watch(function () {
    return savedSheet.lastSavedTitle;
  }, function (newTitle) {
    docTitle.change(savedSheet.id ? newTitle : undefined);
  });

  $scope.toggle = function (property) {
    $scope[property] = !$scope[property];
  };

  $scope.newSheet = function () {
    kbnUrl.change('/', {});
  };

  $scope.newCell = function () {
    $scope.state.sheet.push(defaultExpression);
    $scope.state.selected = $scope.state.sheet.length - 1;
    $scope.safeSearch();
  };

  $scope.setActiveCell = function (cell) {
    $scope.state.selected = cell;
  };

  $scope.search = function () {
    $scope.state.save();
    $scope.running = true;

    var httpResult = $http.post('../api/timelion/run', {
      sheet: $scope.state.sheet,
      time: _lodash2.default.extend(timefilter.time, {
        interval: $scope.state.interval,
        timezone: timezone
      })
    }).then(function (resp) {
      return resp.data;
    }).catch(function (resp) {
      throw resp.data;
    });

    httpResult.then(function (resp) {
      dismissNotifications();
      $scope.stats = resp.stats;
      $scope.sheet = resp.sheet;
      _lodash2.default.each(resp.sheet, function (cell) {
        if (cell.exception) {
          $scope.state.selected = cell.plot;
        }
      });
      $scope.running = false;
    }).catch(function (resp) {
      $scope.sheet = [];
      $scope.running = false;

      var err = new Error(resp.message);
      err.stack = resp.stack;
      notify.error(err);
    });
  };

  $scope.safeSearch = _lodash2.default.debounce($scope.search, 500);

  function saveSheet() {
    savedSheet.timelion_sheet = $scope.state.sheet;
    savedSheet.timelion_interval = $scope.state.interval;
    savedSheet.timelion_columns = $scope.state.columns;
    savedSheet.timelion_rows = $scope.state.rows;
    savedSheet.save().then(function (id) {
      if (id) {
        _notify.toastNotifications.addSuccess('Saved sheet \'' + savedSheet.title + '\'');
        if (savedSheet.id !== $routeParams.id) {
          kbnUrl.change('/{{id}}', { id: savedSheet.id });
        }
      }
    });
  }

  function saveExpression(title) {
    savedVisualizations.get({ type: 'timelion' }).then(function (savedExpression) {
      savedExpression.visState.params = {
        expression: $scope.state.sheet[$scope.state.selected],
        interval: $scope.state.interval
      };
      savedExpression.title = title;
      savedExpression.visState.title = title;
      savedExpression.save().then(function (id) {
        if (id) {
          _notify.toastNotifications.addSuccess('Saved expression \'' + savedExpression.title + '\'');
        }
      });
    });
  }

  function dismissNotifications() {
    unsafeNotifications.splice(0, unsafeNotifications.length);
  }

  init();
});

/***/ }),

/***/ 3205:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _cells = __webpack_require__(3206);

var _cells2 = _interopRequireDefault(_cells);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(1012);
__webpack_require__(561);
__webpack_require__(1013);

var app = __webpack_require__(2).get('apps/timelion', ['angular-sortable-view']);


app.directive('timelionCells', function () {
  return {
    restrict: 'E',
    scope: {
      sheet: '=',
      state: '=',
      transient: '=',
      onSearch: '=',
      onSelect: '='
    },
    template: _cells2.default,
    link: function link($scope) {

      $scope.removeCell = function (index) {
        _lodash2.default.pullAt($scope.state.sheet, index);
        $scope.onSearch();
      };

      $scope.dropCell = function (item, partFrom, partTo, indexFrom, indexTo) {
        $scope.onSelect(indexTo);
        _lodash2.default.move($scope.sheet, indexFrom, indexTo);
      };
    }
  };
});

/***/ }),

/***/ 3206:
/***/ (function(module, exports) {

module.exports = "<div sv-root\r\n  sv-part=\"state.sheet\"\r\n  sv-on-sort=\"dropCell($item, $partFrom, $partTo, $indexFrom, $indexTo)\"\r\n  >\r\n\r\n  <div sv-element\r\n    ng-repeat=\"cell in state.sheet track by $index\"\r\n    class=\"chart-container col-md-{{12 / state.columns}} col-sm-12 col-xs-12\"\r\n    timelion-grid timelion-grid-rows=\"state.rows\"\r\n    ng-click=\"onSelect($index)\"\r\n    ng-class=\"{active: $index === state.selected}\"\r\n    kbn-accessible-click\r\n    aria-label=\"Timelion chart {{$index + 1}}\"\r\n    aria-current=\"{{$index === state.selected}}\"\r\n    >\r\n\r\n    <div chart=\"sheet[$index]\" search=\"onSearch\" interval=\"state.interval\"></div>\r\n    <div class=\"cell-actions\">\r\n      <div class=\"cell-id\"><span>{{$index + 1}}</span></div>\r\n\r\n      <button\r\n        class=\"cell-action\"\r\n        ng-click=\"removeCell($index)\"\r\n        tooltip=\"Remove\"\r\n        tooltip-append-to-body=\"1\"\r\n        aria-label=\"Remove chart\"\r\n      >\r\n        <span class=\"fa fa-remove\"></span>\r\n      </button>\r\n      <button\r\n        class=\"cell-action\"\r\n        tooltip=\"Drag to reorder\"\r\n        tooltip-append-to-body=\"1\"\r\n        sv-handle\r\n        aria-label=\"Drag to reorder\"\r\n        tabindex=\"-1\"\r\n      >\r\n        <span class=\"fa fa-arrows\"></span>\r\n      </button>\r\n      <button\r\n        class=\"cell-action\"\r\n        ng-click=\"transient.fullscreen = true\"\r\n        tooltip=\"Full screen\"\r\n        tooltip-append-to-body=\"1\"\r\n        aria-label=\"Full screen chart\"\r\n      >\r\n        <span class=\"fa fa-expand\"></span>\r\n      </button>\r\n    </div>\r\n  </div>\r\n\r\n</div>\r\n"

/***/ }),

/***/ 3207:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(12);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = __webpack_require__(2).get('apps/timelion', []);
app.directive('fixedElementRoot', function () {
  return {
    restrict: 'A',
    link: function link($scope, $elem) {
      var fixedAt = void 0;
      (0, _jquery2.default)(window).bind('scroll', function () {
        var fixed = (0, _jquery2.default)('[fixed-element]', $elem);
        var body = (0, _jquery2.default)('[fixed-element-body]', $elem);
        var top = fixed.offset().top;

        if ((0, _jquery2.default)(window).scrollTop() > top) {
          // This is a gross hack, but its better than it was. I guess
          fixedAt = (0, _jquery2.default)(window).scrollTop();
          fixed.addClass(fixed.attr('fixed-element'));
          body.addClass(fixed.attr('fixed-element-body'));
          body.css({ top: fixed.height() });
        }

        if ((0, _jquery2.default)(window).scrollTop() < fixedAt) {
          fixed.removeClass(fixed.attr('fixed-element'));
          body.removeClass(fixed.attr('fixed-element-body'));
          body.removeAttr('style');
        }
      });
    }
  };
});

/***/ }),

/***/ 3208:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _fullscreen = __webpack_require__(3209);

var _fullscreen2 = _interopRequireDefault(_fullscreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(1012);
__webpack_require__(561);
__webpack_require__(1013);

var app = __webpack_require__(2).get('apps/timelion', ['angular-sortable-view']);


app.directive('timelionFullscreen', function () {
  return {
    restrict: 'E',
    scope: {
      expression: '=',
      series: '=',
      state: '=',
      transient: '=',
      onSearch: '='
    },
    template: _fullscreen2.default
  };
});

/***/ }),

/***/ 3209:
/***/ (function(module, exports) {

module.exports = "<div class=\"chart-container col-md-12 col-sm-12 col-xs-12\" timelion-grid timelion-grid-rows=\"1\">\r\n  <div  chart=\"series\" search=\"onSearch\" interval=\"state.interval\"></div>\r\n  <div class=\"cell-actions\">\r\n    <button\r\n      class=\"cell-fullscreen cell-action\"\r\n      ng-click=\"transient.fullscreen = false\"\r\n      tooltip=\"Exit full screen\"\r\n      tooltip-append-to-body=\"1\"\r\n      aria-label=\"Exit full screen\"\r\n    >\r\n      <span class=\"fa fa-compress\"></span>\r\n    </button>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ 3226:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _timelion_help = __webpack_require__(3227);

var _timelion_help2 = _interopRequireDefault(_timelion_help);

var _modules = __webpack_require__(2);

var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = __webpack_require__(17);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = _modules.uiModules.get('apps/timelion', []);

app.directive('timelionHelp', function ($http) {
  return {
    restrict: 'E',
    template: _timelion_help2.default,
    controller: function controller($scope) {
      $scope.functions = {
        list: [],
        details: null
      };

      function init() {
        $scope.es = {
          invalidCount: 0
        };
        getFunctions();
        checkElasticsearch();
      }

      function getFunctions() {
        return $http.get('../api/timelion/functions').then(function (resp) {
          $scope.functions.list = resp.data;
        });
      }
      $scope.recheckElasticsearch = function () {
        $scope.es.valid = null;
        checkElasticsearch().then(function (valid) {
          if (!valid) $scope.es.invalidCount++;
        });
      };

      function checkElasticsearch() {
        return $http.get('../api/timelion/validate/es').then(function (resp) {
          if (resp.data.ok) {

            $scope.es.valid = true;
            $scope.es.stats = {
              min: (0, _moment2.default)(resp.data.min).format('LLL'),
              max: (0, _moment2.default)(resp.data.max).format('LLL'),
              field: resp.data.field
            };
          } else {
            $scope.es.valid = false;
            $scope.es.invalidReason = function () {
              try {
                var esResp = JSON.parse(resp.data.resp.response);
                return _lodash2.default.get(esResp, 'error.root_cause[0].reason');
              } catch (e) {
                if (_lodash2.default.get(resp, 'data.resp.message')) return _lodash2.default.get(resp, 'data.resp.message');
                if (_lodash2.default.get(resp, 'data.resp.output.payload.message')) return _lodash2.default.get(resp, 'data.resp.output.payload.message');
                return 'Unknown error';
              }
            }();
          }
          return $scope.es.valid;
        });
      }
      init();
    }
  };
});

/***/ }),

/***/ 3227:
/***/ (function(module, exports) {

module.exports = "<div>\r\n  <div ng-show=\"page === 1\">\r\n    <div class=\"doc-container-content\">\r\n      <h1>Welcome to <strong>Timelion</strong>!</h1>\r\n      <p>\r\n        Timelion is the clawing, gnashing, zebra killing, pluggable time\r\n        series interface for <em>everything</em>. If your datastore can\r\n        produce a time series, then you have all of the awesome power of\r\n        Timelion at your disposal. Timelion lets you compare, combine, and\r\n        combobulate datasets across multiple datasources with one\r\n        easy-to-master expression syntax. This tutorial focuses on\r\n        Elasticsearch, but you'll quickly discover that what you learn here\r\n        applies to any datasource Timelion supports.\r\n      </p>\r\n      <p>\r\n        Ready to get started? Click <strong>Next</strong>. Want to skip the\r\n        tutorial and view the docs? <a ng-click=\"setPage(0)\">\r\n        Jump to the function reference</a>.\r\n      </p>\r\n    </div>\r\n    <div class=\"doc-container-buttons\">\r\n      <div class=\"btn-doc-prev\">\r\n        <button\r\n          ng-click=\"opts.dontShowHelp()\"\r\n          class=\"kuiButton kuiButton--hollow\"\r\n        >\r\n          Don't show this again\r\n        </button>\r\n      </div>\r\n      <div class=\"btn-doc-next\">\r\n        <button\r\n          ng-click=\"setPage(page+1)\"\r\n          class=\"kuiButton kuiButton--primary\"\r\n        >\r\n          Next\r\n        </button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div ng-show=\"page === 2\">\r\n    <div ng-show=\"!es.valid\">\r\n      <div class=\"doc-container-content\">\r\n        <h2>First time configuration</h2>\r\n        <p>\r\n          If you're using Logstash, you don't need to configure anything to\r\n          start exploring your log data with Timelion. To search other\r\n          indices, go to <strong>Management / Kibana / Advanced Settings\r\n          </strong> and configure the <code>timelion:es.default_index</code>\r\n          and <code>timelion:es.timefield</code> settings to match your\r\n          indices.\r\n        </p>\r\n        <p>\r\n          You'll also see some other Timelion settings. For now, you don't need\r\n          to worry about them. Later, you'll see that you can set most of\r\n          them on the fly if you need to.\r\n        </p>\r\n      </div>\r\n      <div class=\"doc-container-buttons\">\r\n        <div class=\"btn-doc-prev\">\r\n          <button\r\n            ng-click=\"setPage(page-1)\"\r\n            class=\"kuiButton kuiButton--primary\"\r\n          >\r\n            Previous\r\n          </button>\r\n        </div>\r\n        <span ng-show=\"es.invalidCount > 0 && !es.valid\">\r\n          Could not validate Elasticsearch settings:\r\n          <strong>{{es.invalidReason}}.</strong> Check your Advanced Settings\r\n          and try again. ({{es.invalidCount}})\r\n        </span>\r\n        <div class=\"btn-doc-next\">\r\n          <button\r\n            ng-click=\"recheckElasticsearch()\"\r\n            class=\"kuiButton kuiButton--primary\"\r\n          >\r\n            Validate Config\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div ng-show=\"es.valid\">\r\n      <div class=\"doc-container-content\">\r\n        <h2>Good news, Elasticsearch is configured correctly!</h2>\r\n        <p>\r\n          We validated your default index and your timefield and everything\r\n          looks ok. We found data from <strong>{{es.stats.min}}</strong> to\r\n          <strong>{{es.stats.max}}</strong>. You're probably all set. If this\r\n          doesn't look right, see <a ng-click=\"es.valid = false\">First time\r\n          configuration</a> for information about configuring the Elasticsearch\r\n          datasource.\r\n        </p>\r\n        <p>\r\n          You should already see one chart, but you might need to make a\r\n          couple adjustments before you see any interesting data:\r\n        </p>\r\n        <ul>\r\n          <li>\r\n            <strong>Intervals</strong>\r\n            <p>\r\n              The interval selector at the right of the input bar lets you\r\n              control the sampling frequency. It's currently set to\r\n              <code>{{state.interval}}</code>.\r\n              <span ng-show=\"state.interval == 'auto'\">\r\n                <strong>You're all set!</strong>\r\n              </span>\r\n              <span ng-show=\"state.interval != 'auto'\">\r\n                Set it to <code>auto </code> to let Timelion choose an\r\n                appropriate interval.\r\n              </span>\r\n              If Timelion thinks your combination of time range and interval\r\n              will produce too many data points, it throws an error. You can\r\n              adjust that limit by configuring <code>timelion:max_buckets</code>\r\n              in <strong>Management/Kibana/Advanced Settings</strong>.\r\n            </p>\r\n          </li>\r\n          <li>\r\n            <strong>Time range</strong>\r\n            <p>\r\n              Use the timepicker <i class=\"fa fa-clock-o\"></i> in the\r\n              Kibana toolbar to select the time period that contains the\r\n              data you want to visualize. Make sure you select a time\r\n              period that includes all or part of the time range shown\r\n              above.\r\n            </p>\r\n          </li>\r\n        </ul>\r\n        <p>\r\n          Now, you should see a line chart that displays a count of your\r\n          data points over time.\r\n        </p>\r\n      </div>\r\n      <div class=\"doc-container-buttons\">\r\n        <div class=\"btn-doc-prev\">\r\n          <button\r\n            ng-click=\"setPage(page-1)\"\r\n            class=\"kuiButton kuiButton--primary\"\r\n          >\r\n            Previous\r\n          </button>\r\n        </div>\r\n        <div class=\"btn-doc-next\">\r\n          <button\r\n            ng-click=\"setPage(page+1)\"\r\n            class=\"kuiButton kuiButton--primary\"\r\n          >\r\n            Next\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div ng-show=\"page === 3\">\r\n    <div class=\"doc-container-content\">\r\n      <h2>Querying the Elasticsearch datasource</h2>\r\n      <p>\r\n        Now that we've validated that you have a working Elasticsearch\r\n        datasource, you can start submitting queries. For starters,\r\n        enter <code>.es(*)</code> in the input bar and hit enter.\r\n      </p>\r\n      <p>\r\n        This says <em>hey Elasticsearch, find everything in my default\r\n        index</em>. If you want to find a subset, you could enter something\r\n        like <code>.es(html)</code> to count events that match <em>html</em>,\r\n        or <code>.es('user:bob AND bytes:>100')</code> to find events\r\n        that contain <em>bob</em> in the <code>user</code> field and have a\r\n        <code>bytes</code> field that is greater than 100. Note that this query\r\n        is enclosed in single quotes&mdash;that's because it contains\r\n        spaces. You can enter any\r\n        <a\r\n           href=\"https://www.elastic.co/guide/en/elasticsearch/reference/5.1/query-dsl-query-string-query.html#query-string-syntax\"\r\n           target=\"_blank\"\r\n           rel=\"noopener noreferrer\"\r\n        >\r\n          Lucene query string\r\n        </a>\r\n        as the first argument to the <code>.es()</code> function.\r\n      </p>\r\n      <h4>Passing arguments</h4>\r\n      <p>\r\n        Timelion has a number of shortcuts that make it easy to do common\r\n        things. One is that for simple arguments that don't contain spaces or\r\n        special characters, you don't need to use quotes. Many functions also\r\n        have defaults. For example, <code>.es()</code> and <code>.es(*)</code>\r\n        do the same thing. Arguments also have names, so you don't have to\r\n        specify them in a specific order. For example, you can enter\r\n        <code>.es(index='logstash-*', q='*')</code> to tell the\r\n        Elasticsearch datasource <em>use * as the q (query) for the\r\n        logstash-* index</em>.\r\n      </p>\r\n      <h4>Beyond count</h4>\r\n      <p>\r\n        Counting events is all well and good, but the Elasticsearch datasource\r\n        also supports any\r\n        <a\r\n           href=\"https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics.html\"\r\n           target=\"_blank\"\r\n           rel=\"noopener noreferrer\"\r\n        >\r\n          Elasticsearch metric aggregation\r\n        </a>\r\n        that returns a single value. Some of the most useful are\r\n        <code>min</code>, <code>max</code>, <code>avg</code>, <code>sum</code>,\r\n        and <code>cardinality</code>. Let's say you want a unique count of the\r\n        <code>src_ip</code> field. Simply use the <code>cardinality</code>\r\n        metric: <code>.es(*, metric='cardinality:src_ip')</code>. To get the\r\n        average of the <code>bytes</code> field, you can use the\r\n        <code>avg</code> metric: <code>.es(metric='avg:bytes')</code>.\r\n      </p>\r\n    </div>\r\n    <div class=\"doc-container-buttons\">\r\n      <div class=\"btn-doc-prev\">\r\n        <button\r\n          ng-click=\"setPage(page-1)\"\r\n          class=\"kuiButton kuiButton--primary\"\r\n        >\r\n          Previous\r\n        </button>\r\n      </div>\r\n      <div class=\"btn-doc-next\">\r\n        <button\r\n          ng-click=\"setPage(page+1)\"\r\n          class=\"kuiButton kuiButton--primary\"\r\n        >\r\n          Next\r\n        </button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div ng-show=\"page === 4\">\r\n    <div class=\"doc-container-content\">\r\n      <h2>Expressing yourself with expressions</h2>\r\n      <p>\r\n        Every  expression starts with a datasource function. From there, you\r\n        can append new functions to the datasource to transform and augment\r\n        it.\r\n      </p>\r\n      <p>\r\n        By the way, from here on out you probably know more about your data\r\n        than we do. Feel free to replace the sample queries with something\r\n        more meaningful!\r\n      </p>\r\n      <p>\r\n        We're going to experiment, so click <strong>Add</strong> in the Kibana\r\n        toolbar to add another chart or three. Then, select a chart, copy\r\n        one of the following expressions, paste it into the input bar,\r\n        and hit enter. Rinse, repeat to try out the other expressions.\r\n      </p>\r\n      <table class=\"table table-condensed table-striped\">\r\n        <tr>\r\n          <td><code>.es(*), .es(US)</code></td>\r\n          <td><strong>Double the fun.</strong> Two expressions on the same\r\n            chart.</td>\r\n        </tr>\r\n        <tr>\r\n          <td><code>.es(*).color(#f66), .es(US).bars(1)</code></td>\r\n          <td>\r\n            <strong>Custom styling.</strong> Colorizes the first series red\r\n            and uses 1 pixel wide bars for the second series.\r\n          </td>\r\n        </tr>\r\n        <tr>\r\n          <td>\r\n            <code>.es(*).color(#f66).lines(fill=3),\r\n            .es(US).bars(1).points(radius=3, weight=1)</code>\r\n          </td>\r\n          <td>\r\n            <strong>Named arguments.</strong> Forget trying to remember what\r\n            order you need to specify arguments in, use named arguments to make\r\n            the expressions easier to read and write.\r\n          </td>\r\n        </tr>\r\n        <tr>\r\n          <td><code>(.es(*), .es(GB)).points()</code></td>\r\n          <td>\r\n            <strong>Grouped expressions.</strong> You can also chain groups\r\n            of expressions to functions. Here, both series are shown as\r\n            points instead of lines.\r\n          </td>\r\n        </tr>\r\n      </table>\r\n      <p>\r\n        Timelion provides additional view transformation functions you can use\r\n        to customize the appearance of your charts. For the complete list, see\r\n        the <a ng-click=\"setPage(0)\">Function reference</a>.\r\n      </p>\r\n    </div>\r\n    <div class=\"doc-container-buttons\">\r\n      <div class=\"btn-doc-prev\">\r\n        <button\r\n          ng-click=\"setPage(page-1)\"\r\n          class=\"kuiButton kuiButton--primary\"\r\n        >\r\n          Previous\r\n        </button>\r\n      </div>\r\n      <div class=\"btn-doc-next\">\r\n        <button\r\n          ng-click=\"setPage(page+1)\"\r\n          class=\"kuiButton kuiButton--primary\"\r\n        >\r\n          Next\r\n        </button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div ng-show=\"page === 5\">\r\n    <div class=\"doc-container-content\">\r\n      <h2>Transforming your data: the real fun begins!</h2>\r\n      <p>\r\n        Now that you've mastered the basics, it's time to unleash the power of\r\n        Timelion. Let's figure out what percentage some subset of our data\r\n        represents of the whole, over time. For example, what percentage of\r\n        our web traffic comes from the US?\r\n      </p>\r\n      <p>\r\n        First, we need to find all events that contain US:\r\n        <code>.es('US')</code>.\r\n      </p>\r\n      <p>\r\n        Next, we want to calculate the ratio of US events to the whole. To\r\n        divide <code>'US'</code> by everything, we can use the\r\n        <code>divide</code> function: <code>.es('US').divide(.es())</code>.\r\n      </p>\r\n      <p>\r\n        Not bad, but this gives us a number between 0 and 1. To convert it\r\n        to a percentage, simply multiply by 100:\r\n        <code>.es('US').divide(.es()).multiply(100)</code>.\r\n      </p>\r\n      <p>\r\n        Now we know what percentage of our traffic comes from the US, and\r\n        can see how it has changed over time!\r\n        Timelion has a number of built-in arithmetic functions, such as\r\n        <code>sum</code>, <code>subtract</code>, <code>multiply</code>, and\r\n        <code>divide</code>. Many of these can take a series or a number.\r\n        There are also other useful data transformation functions, such as\r\n        <code>movingaverage</code>, <code>abs</code>, and\r\n        <code>derivative</code>.\r\n      </p>\r\n      <p>Now that you're familiar with the syntax, refer to the\r\n        <a ng-click=\"setPage(0)\">Function reference</a> to see\r\n        how to use all of the available Timelion functions. You can view\r\n        the reference at any time by clicking <strong>Docs</strong>\r\n        in the Kibana toolbar. To get back to this tutorial, click the\r\n        <strong>Tutorial</strong> link at the top of the reference.\r\n      </p>\r\n    </div>\r\n    <div class=\"doc-container-buttons\">\r\n      <div class=\"btn-doc-prev\">\r\n        <button\r\n          ng-click=\"setPage(page-1)\"\r\n          class=\"kuiButton kuiButton--primary\"\r\n        >\r\n          Previous\r\n        </button>\r\n      </div>\r\n\r\n      <div class=\"btn-doc-next\">\r\n        <button\r\n          ng-click=\"opts.dontShowHelp()\"\r\n          class=\"kuiButton kuiButton--hollow\"\r\n        >\r\n          Don't show this again\r\n        </button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n<div ng-show=\"page === 0\">\r\n  <h2 class=\"kuiLocalDropdownTitle\">\r\n    Help\r\n  </h2>\r\n\r\n  <tabset>\r\n    <tab heading=\"Function reference\">\r\n      <div class=\"list-group-item list-group-item--noBorder\">\r\n        <div class=\"kuiLocalDropdownHelpText\">\r\n          Click any function for more information. Just getting started?\r\n          <a\r\n            class=\"kuiLink\"\r\n            ng-click=\"setPage(1)\"\r\n            kbn-accessible-click\r\n          >\r\n            Check out the tutorial\r\n          </a>.\r\n        </div>\r\n\r\n        <div class=\"timelionFunctionsDropdownContent\">\r\n          <table class=\"table table-condensed table-bordered timelionFunctionsTable\">\r\n            <tr\r\n              class=\"timelionFunctionsTableRow\"\r\n              ng-repeat-start=\"function in functions.list\"\r\n              ng-class=\"{active: functions.details === function.name}\"\r\n              ng-click=\"functions.details =\r\n                        (functions.details === function.name ?\r\n                          null : function.name)\"\r\n              kbn-accessible-click\r\n            >\r\n              <td><strong>.{{function.name}}()</strong></td>\r\n              <td>{{function.help}}</td>\r\n            </tr>\r\n            <tr ng-if=\"functions.details === function.name\" ng-repeat-end>\r\n              <td colspan=2>\r\n                <div class=\"suggestion-details\" >\r\n                  <table\r\n                    class=\"table table-condensed table-bordered\r\n                           timelionFunctionDetailsTable\"\r\n                    ng-show=\"function.args.length > (function.chainable ? 1: 0)\"\r\n                  >\r\n                    <thead>\r\n                      <th scope=\"col\">Argument Name</th>\r\n                      <th scope=\"col\">Accepted Types</th>\r\n                      <th scope=\"col\">Information</th>\r\n                    </thead>\r\n                    <tr\r\n                      ng-repeat=\"arg in function.args\"\r\n                      ng-hide=\"$index < 1 && function.chainable\"\r\n                    >\r\n                      <td>{{arg.name}}</td>\r\n                      <td><em>{{arg.types.join(', ')}}</em></td>\r\n                      <td>{{arg.help}}</td>\r\n                    </tr>\r\n                  </table>\r\n                  <div ng-hide=\"function.args.length > (function.chainable ? 1: 0)\">\r\n                    <em>\r\n                      This function does not accept any arguments.\r\n                      Well that's simple, isn't it?\r\n                    </em>\r\n                  </div>\r\n                </div>\r\n              </td>\r\n            </tr>\r\n          </table>\r\n        </div>\r\n      </div>\r\n    </tab>\r\n\r\n    <tab heading=\"Keyboard tips\">\r\n      <div class=\"list-group-item list-group-item--noBorder\">\r\n        <!-- General editing tips -->\r\n        <dl class=\"dl-horizontal timelionHelpKeyboardTipsSection\">\r\n          <dt></dt>\r\n          <dd><strong>General editing</strong></dd>\r\n          <dt>Ctrl/Cmd + Enter</dt>\r\n          <dd>Submit request</dd>\r\n        </dl>\r\n\r\n        <!-- Auto complete tips -->\r\n        <dl class=\"dl-horizontal timelionHelpKeyboardTipsSection\">\r\n          <dt></dt>\r\n          <dd><strong>When auto-complete is visible</strong></dd>\r\n          <dt>Down arrow</dt>\r\n          <dd>Switch focus to auto-complete menu. Use arrows to further select a term</dd>\r\n          <dt>Enter/Tab</dt>\r\n          <dd>Select the currently selected or the top most term in auto-complete menu</dd>\r\n          <dt>Esc</dt>\r\n          <dd>Close auto-complete menu</dd>\r\n        </dl>\r\n      </div>\r\n    </tab>\r\n  </tabset>\r\n</div>\r\n"

/***/ }),

/***/ 3230:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 3333:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = savedSearchObjectFn;

__webpack_require__(1018);

function savedSearchObjectFn(savedSheets) {
  return savedSheets;
}
module.exports = exports['default'];

/***/ }),

/***/ 3334:
/***/ (function(module, exports) {

module.exports = "<div class=\"timelion app-container\" ng-controller=\"timelion\">\r\n  <!-- Local nav. -->\r\n  <kbn-top-nav name=\"timelion\" config=\"topNavMenu\">\r\n    <!-- Transcluded elements. -->\r\n    <div data-transclude-slots>\r\n      <div data-transclude-slot=\"topLeftCorner\">\r\n        <span class=\"kuiLocalTitle\" ng-show=\"opts.savedSheet.id\">\r\n          {{opts.savedSheet.lastSavedTitle}}\r\n          &nbsp;\r\n          <span class=\"fa fa-bolt\" ng-click=\"showStats = !showStats\"></span>\r\n          &nbsp;\r\n          <span class=\"timelion-stats\" ng-show=\"showStats\">\r\n            Query Time {{stats.queryTime - stats.invokeTime}}ms /\r\n            Processing Time {{stats.sheetTime - stats.queryTime}}ms\r\n          </span>\r\n        </span>\r\n      </div>\r\n    </div>\r\n  </kbn-top-nav>\r\n\r\n  <div class=\"timelion-container\">\r\n    <div class=\"timelion-container-sheet\">\r\n      <!-- Search. -->\r\n      <form\r\n        role=\"form\"\r\n        ng-submit=\"search()\"\r\n        class=\"kuiFieldGroup kuiFieldGroup--alignTop kuiVerticalRhythm\"\r\n      >\r\n        <div class=\"kuiFieldGroupSection kuiFieldGroupSection--wide\">\r\n          <timelion-expression-input\r\n            sheet=\"state.sheet[state.selected]\"\r\n            rows=\"1\"\r\n            update-chart=\"search()\"\r\n            should-popover-suggestions=\"true\"\r\n          ></timelion-expression-input>\r\n        </div>\r\n\r\n        <div class=\"kuiFieldGroupSection\">\r\n          <timelion-interval\r\n            class=\"kuiVerticalRhythmSmall\"\r\n            model=\"state.interval\"\r\n          ></timelion-interval>\r\n\r\n          <button\r\n            type=\"submit\"\r\n            aria-label=\"Search\"\r\n            class=\"kuiButton kuiButton--primary fullWidth kuiVerticalRhythmSmall\"\r\n          >\r\n            <span aria-hidden=\"true\" class=\"kuiButton__icon kuiIcon fa-play\"></span>\r\n          </button>\r\n        </div>\r\n      </form>\r\n\r\n      <div class=\"timelion-container-sheet-margin kuiVerticalRhythm\">\r\n        <timelion-fullscreen\r\n          ng-show=\"transient.fullscreen\"\r\n          transient=\"transient\"\r\n          state=\"state\"\r\n          series=\"sheet[state.selected]\"\r\n          expression=\"state.sheet[state.selected]\"\r\n          on-search=\"search\"\r\n        ></timelion-fullscreen>\r\n\r\n        <timelion-cells\r\n          ng-show=\"!transient.fullscreen\"\r\n          transient=\"transient\"\r\n          state=\"state\"\r\n          sheet=\"sheet\"\r\n          on-search=\"search\"\r\n          on-select=\"setActiveCell\"\r\n        ></timelion-cells>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ 3335:
/***/ (function(module, exports) {

module.exports = "<div class=\"list-group\">\r\n  <button class=\"list-group-item\" ng-click=\"section = 'sheet'\" type=\"button\">\r\n    <h4 class=\"list-group-item-heading\">Save entire Timelion sheet</h4>\r\n    <p  class=\"list-group-item-text\">\r\n      You want this option if you mostly use Timelion expressions from within the Timelion app and don't need to\r\n      add Timelion charts to Kibana dashboards. You may also want this if you make use of references to other\r\n      panels.\r\n    </p>\r\n  </button>\r\n\r\n  <div class=\"list-group-item\" ng-show=\"section == 'sheet'\">\r\n    <form role=\"form\" class=\"container-fluid\" ng-submit=\"opts.saveSheet()\">\r\n      <label\r\n        for=\"savedSheet\"\r\n        class=\"kuiLabel kuiVerticalRhythmSmall\"\r\n      >\r\n        Save sheet as\r\n      </label>\r\n\r\n      <input\r\n        id=\"savedSheet\"\r\n        ng-model=\"opts.savedSheet.title\"\r\n        input-focus=\"select\"\r\n        class=\"form-control kuiVerticalRhythmSmall\"\r\n        placeholder=\"Name this sheet...\"\r\n        aria-label=\"Name\"\r\n      >\r\n\r\n      <saved-object-save-as-check-box\r\n        class=\"kuiVerticalRhythmSmall\"\r\n        saved-object=\"opts.savedSheet\"\r\n      ></saved-object-save-as-check-box>\r\n\r\n      <button\r\n        ng-disabled=\"!opts.savedSheet.title\"\r\n        type=\"submit\"\r\n        class=\"kuiButton kuiButton--primary kuiVerticalRhythmSmall\"\r\n      >\r\n        Save\r\n      </button>\r\n    </form>\r\n  </div>\r\n\r\n  <button class=\"list-group-item\" ng-click=\"section = 'expression'\" type=\"button\">\r\n    <h4 class=\"list-group-item-heading\">Save current expression as Kibana dashboard panel</h4>\r\n    <p class=\"list-group-item-text\">\r\n      Need to add a chart to a Kibana dashboard? We can do that! This option will save your currently selected\r\n      expression as a panel that can be added to Kibana dashboards as you would add anything else. Note, if you\r\n      use references to other panels you will need to remove the refences by copying the referenced expression\r\n      directly into the expression you are saving. Click a chart to select a different expression to save.\r\n    </p>\r\n  </button>\r\n\r\n  <div class=\"list-group-item\" ng-show=\"section == 'expression'\">\r\n    <form role=\"form\" class=\"container-fluid\" ng-submit=\"opts.saveExpression(panelTitle)\">\r\n      <div class=\"form-group\">\r\n        <label class=\"control-label\">Currently selected expression</label>\r\n        <code>{{opts.state.sheet[opts.state.selected]}}</code>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <label for=\"savedExpression\" class=\"control-label\">Save expression as</label>\r\n        <input id=\"savedExpression\" ng-model=\"panelTitle\" input-focus=\"select\" class=\"form-control\" placeholder=\"Name this panel\">\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <button ng-disabled=\"!panelTitle\" type=\"submit\" class=\"kuiButton kuiButton--primary\">Save</button>\r\n      </div>\r\n    </form>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ 3336:
/***/ (function(module, exports) {

module.exports = "<form role=\"form\" ng-submit=\"fetch()\">\r\n  <h2 class=\"kuiLocalDropdownTitle\">\r\n    Open Sheet\r\n  </h2>\r\n\r\n  <saved-object-finder\r\n    type=\"timelion-sheet\"\r\n    use-local-management=\"true\"\r\n  ></saved-object-finder>\r\n</form>\r\n"

/***/ }),

/***/ 3337:
/***/ (function(module, exports) {

module.exports = "<form role=\"form\">\r\n  <h2 class=\"kuiLocalDropdownTitle\">\r\n    Sheet options\r\n  </h2>\r\n\r\n  <div>\r\n    <div class=\"form-group col-md-6\">\r\n      <label for=\"timelionColCount\">Columns <small>Column count must divide evenly into 12</small></label>\r\n      <select class=\"form-control\"\r\n        id=\"timelionColCount\"\r\n        ng-change=\"opts.search()\"\r\n        ng-options=\"column for column in [1, 2, 3, 4, 6, 12]\"\r\n        ng-model=\"opts.state.columns\">\r\n      </select>\r\n    </div>\r\n    <div class=\"form-group col-md-6\">\r\n      <label for=\"timelionRowCount\">Rows <small>This is a target based on the current window height</small></label>\r\n      <select class=\"form-control\"\r\n        id=\"timelionRowCount\"\r\n        ng-change=\"opts.search()\"\r\n        ng-options=\"row for row in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]\"\r\n        ng-model=\"opts.state.rows\">\r\n      </select>\r\n    </div>\r\n  </div>\r\n</form>\r\n"

/***/ })

},[2272]);
//# sourceMappingURL=timelion.bundle.js.map