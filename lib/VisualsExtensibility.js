/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(440);


/***/ },

/***/ 440:
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var jsCommon = window.jsCommon;
	var powerbi = window.powerbi;
	var powerbitests = window.powerbitests;
	var InJs = window.InJs;
	var debug = window.debug;
	var jasmine = window.jasmine;
	var Microsoft = window.Microsoft;

	/// <reference path="./_references.ts"/>
	window.jsCommon = window.jsCommon || {};
	window.powerbi = window.powerbi || {};
	window.debug = window.debug || {};
	window.InJs = window.InJs || {};
	// Require all files from the `_references.ts`
	__webpack_require__(441);

	

/***/ },

/***/ 441:
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var jsCommon = window.jsCommon;
	var powerbi = window.powerbi;
	var powerbitests = window.powerbitests;
	var InJs = window.InJs;
	var debug = window.debug;
	var jasmine = window.jasmine;
	var Microsoft = window.Microsoft;

	/// <reference path="../../../src/Clients/Typedefs/webpack/webpack-env.d.ts"/>
	/// <reference path="../../../src/Clients/Typedefs/common/window.d.ts"/>
	__webpack_require__(442);
	/// <reference path="../VisualsContracts/_references.ts"/>
	/// <reference path="../VisualsCommon/_references.ts"/>
	/// <reference path="../VisualsData/_references.ts"/>
	__webpack_require__(443);
	__webpack_require__(444);
	__webpack_require__(445);
	__webpack_require__(446);
	__webpack_require__(447);
	__webpack_require__(448);
	__webpack_require__(449);
	__webpack_require__(450);
	__webpack_require__(451);
	__webpack_require__(452);
	__webpack_require__(453);



/***/ },

/***/ 442:
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var jsCommon = window.jsCommon;
	var powerbi = window.powerbi;
	var powerbitests = window.powerbitests;
	var InJs = window.InJs;
	var debug = window.debug;
	var jasmine = window.jasmine;
	var Microsoft = window.Microsoft;

	/*
	 *  Power BI Visualizations
	 *
	 *  Copyright (c) Microsoft Corporation
	 *  All rights reserved.
	 *  MIT License
	 *
	 *  Permission is hereby granted, free of charge, to any person obtaining a copy
	 *  of this software and associated documentation files (the ""Software""), to deal
	 *  in the Software without restriction, including without limitation the rights
	 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 *  copies of the Software, and to permit persons to whom the Software is
	 *  furnished to do so, subject to the following conditions:
	 *
	 *  The above copyright notice and this permission notice shall be included in
	 *  all copies or substantial portions of the Software.
	 *
	 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 *  THE SOFTWARE.
	 */
	///<reference path="../../Typedefs/jquery/jquery.d.ts"/>
	///<reference path="../../Typedefs/globalize/globalize.d.ts"/>
	///<reference path="../../Typedefs/lodash/lodash.d.ts"/>

	

/***/ },

/***/ 443:
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var jsCommon = window.jsCommon;
	var powerbi = window.powerbi;
	var powerbitests = window.powerbitests;
	var InJs = window.InJs;
	var debug = window.debug;
	var jasmine = window.jasmine;
	var Microsoft = window.Microsoft;

	/*
	 *  Power BI Visualizations
	 *
	 *  Copyright (c) Microsoft Corporation
	 *  All rights reserved.
	 *  MIT License
	 *
	 *  Permission is hereby granted, free of charge, to any person obtaining a copy
	 *  of this software and associated documentation files (the ""Software""), to deal
	 *  in the Software without restriction, including without limitation the rights
	 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 *  copies of the Software, and to permit persons to whom the Software is
	 *  furnished to do so, subject to the following conditions:
	 *
	 *  The above copyright notice and this permission notice shall be included in
	 *  all copies or substantial portions of the Software.
	 *
	 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 *  THE SOFTWARE.
	 */
	/// <reference path="../_references.ts"/>
	var powerbi;
	(function (powerbi) {
	    var visuals;
	    (function (visuals) {
	        var telemetry;
	        (function (telemetry) {
	            /**
	             * Creates a client-side Guid string.
	             * @returns A string representation of a Guid.
	             */
	            function generateGuid() {
	                var guid = "", idx = 0;
	                for (idx = 0; idx < 32; idx += 1) {
	                    var guidDigitsItem = Math.random() * 16 | 0;
	                    switch (idx) {
	                        case 8:
	                        case 12:
	                        case 16:
	                        case 20:
	                            guid += "-";
	                            break;
	                    }
	                    guid += guidDigitsItem.toString(16);
	                }
	                return guid;
	            }
	            telemetry.generateGuid = generateGuid;
	        })(telemetry = visuals.telemetry || (visuals.telemetry = {}));
	    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 444:
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var jsCommon = window.jsCommon;
	var powerbi = window.powerbi;
	var powerbitests = window.powerbitests;
	var InJs = window.InJs;
	var debug = window.debug;
	var jasmine = window.jasmine;
	var Microsoft = window.Microsoft;

	/*
	 *  Power BI Visualizations
	 *
	 *  Copyright (c) Microsoft Corporation
	 *  All rights reserved.
	 *  MIT License
	 *
	 *  Permission is hereby granted, free of charge, to any person obtaining a copy
	 *  of this software and associated documentation files (the ""Software""), to deal
	 *  in the Software without restriction, including without limitation the rights
	 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 *  copies of the Software, and to permit persons to whom the Software is
	 *  furnished to do so, subject to the following conditions:
	 *
	 *  The above copyright notice and this permission notice shall be included in
	 *  all copies or substantial portions of the Software.
	 *
	 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 *  THE SOFTWARE.
	 */
	/// <reference path="../_references.ts"/>
	var powerbi;
	(function (powerbi) {
	    var visuals;
	    (function (visuals) {
	        var telemetry;
	        (function (telemetry) {
	            var g = jsCommon.Utility.generateGuid;
	            telemetry.VisualApiUsage = function (name, apiVersion, custom, parentId, isError, errorSource, errorCode) {
	                if (isError === void 0) { isError = false; }
	                if (errorSource === void 0) { errorSource = undefined; }
	                if (errorCode === void 0) { errorCode = undefined; }
	                var info = {
	                    name: name,
	                    apiVersion: apiVersion,
	                    custom: custom,
	                    parentId: parentId,
	                    isError: isError,
	                    errorSource: errorSource,
	                    errorCode: errorCode,
	                };
	                var event = {
	                    name: 'PBI.Visual.ApiUsage',
	                    category: 1 /* CustomerAction */,
	                    time: Date.now(),
	                    id: g(),
	                    getFormattedInfoObject: function () {
	                        var formattedObject = {
	                            name: info.name,
	                            apiVersion: info.apiVersion,
	                            custom: info.custom,
	                            parentId: info.parentId,
	                            isError: info.isError,
	                        };
	                        if (typeof info.errorSource !== 'undefined') {
	                            formattedObject['errorSource'] = powerbi.visuals.telemetry.ErrorSource[info.errorSource];
	                        }
	                        if (typeof info.errorCode !== 'undefined') {
	                            formattedObject['errorCode'] = info.errorCode;
	                        }
	                        return formattedObject;
	                    },
	                    info: info,
	                    privateFields: [],
	                    orgInfoFields: []
	                };
	                if (typeof powerbi.visuals.telemetry.VisualApiUsageLoggers !== 'undefined') {
	                    event.loggers = powerbi.visuals.telemetry.VisualApiUsageLoggers;
	                }
	                return event;
	            };
	            telemetry.VisualException = function (visualType, isCustom, apiVersion, source, lineNumber, columnNumber, stack, message) {
	                var info = {
	                    visualType: visualType,
	                    isCustom: isCustom,
	                    apiVersion: apiVersion,
	                    source: source,
	                    lineNumber: lineNumber,
	                    columnNumber: columnNumber,
	                    stack: stack,
	                    message: message,
	                };
	                var event = {
	                    name: 'PBI.Visual.Exception',
	                    category: 2 /* CriticalError */,
	                    time: Date.now(),
	                    id: telemetry.generateGuid(),
	                    getFormattedInfoObject: function () {
	                        var formattedObject = {
	                            visualType: info.visualType,
	                            isCustom: info.isCustom,
	                            apiVersion: info.apiVersion,
	                            source: info.source,
	                            lineNumber: info.lineNumber,
	                            columnNumber: info.columnNumber,
	                            stack: info.stack,
	                            message: info.message,
	                        };
	                        return formattedObject;
	                    },
	                    info: info,
	                    privateFields: [],
	                    orgInfoFields: []
	                };
	                if (typeof telemetry.VisualExceptionLoggers !== 'undefined') {
	                    event.loggers = telemetry.VisualExceptionLoggers;
	                }
	                return event;
	            };
	        })(telemetry = visuals.telemetry || (visuals.telemetry = {}));
	    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 445:
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var jsCommon = window.jsCommon;
	var powerbi = window.powerbi;
	var powerbitests = window.powerbitests;
	var InJs = window.InJs;
	var debug = window.debug;
	var jasmine = window.jasmine;
	var Microsoft = window.Microsoft;

	/*
	 *  Power BI Visualizations
	 *
	 *  Copyright (c) Microsoft Corporation
	 *  All rights reserved.
	 *  MIT License
	 *
	 *  Permission is hereby granted, free of charge, to any person obtaining a copy
	 *  of this software and associated documentation files (the ""Software""), to deal
	 *  in the Software without restriction, including without limitation the rights
	 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 *  copies of the Software, and to permit persons to whom the Software is
	 *  furnished to do so, subject to the following conditions:
	 *
	 *  The above copyright notice and this permission notice shall be included in
	 *  all copies or substantial portions of the Software.
	 *
	 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 *  THE SOFTWARE.
	 */
	/// <reference path="../_references.ts"/>
	var powerbi;
	(function (powerbi) {
	    var extensibility;
	    (function (extensibility) {
	        function VisualPlugin(options) {
	            return function (constructor) {
	                constructor.__transform__ = options.transform;
	            };
	        }
	        extensibility.VisualPlugin = VisualPlugin;
	    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 446:
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var jsCommon = window.jsCommon;
	var powerbi = window.powerbi;
	var powerbitests = window.powerbitests;
	var InJs = window.InJs;
	var debug = window.debug;
	var jasmine = window.jasmine;
	var Microsoft = window.Microsoft;

	/*
	*  Power BI Visualizations
	*
	*  Copyright (c) Microsoft Corporation
	*  All rights reserved.
	*  MIT License
	*
	*  Permission is hereby granted, free of charge, to any person obtaining a copy
	*  of this software and associated documentation files (the ""Software""), to deal
	*  in the Software without restriction, including without limitation the rights
	*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	*  copies of the Software, and to permit persons to whom the Software is
	*  furnished to do so, subject to the following conditions:
	*
	*  The above copyright notice and this permission notice shall be included in
	*  all copies or substantial portions of the Software.
	*
	*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	*  THE SOFTWARE.
	*/
	/// <reference path="../_references.ts"/>
	var powerbi;
	(function (powerbi) {
	    var extensibility;
	    (function (extensibility) {
	        ;
	        var SelectionManager = (function () {
	            function SelectionManager(options) {
	                this.dataPointObjectName = 'dataPoint';
	                this.hostServices = options.hostServices;
	                this.selectedIds = [];
	                this.promiseFactory = this.hostServices.promiseFactory();
	            }
	            SelectionManager.prototype.select = function (selectionId, multiSelect) {
	                if (multiSelect === void 0) { multiSelect = false; }
	                var deferred = this.promiseFactory.defer();
	                if (this.hostServices.shouldRetainSelection()) {
	                    this.sendSelectionToHost([selectionId]);
	                }
	                else {
	                    this.selectInternal(selectionId, multiSelect);
	                    this.sendSelectionToHost(this.selectedIds);
	                }
	                deferred.resolve(this.selectedIds);
	                return deferred.promise;
	            };
	            SelectionManager.prototype.showContextMenu = function (selectionId, position) {
	                var deferred = this.promiseFactory.defer();
	                this.sendContextMenuToHost(selectionId, position);
	                deferred.resolve(null);
	                return deferred.promise;
	            };
	            SelectionManager.prototype.hasSelection = function () {
	                return this.selectedIds.length > 0;
	            };
	            SelectionManager.prototype.clear = function () {
	                var deferred = this.promiseFactory.defer();
	                this.selectedIds = [];
	                this.sendSelectionToHost([]);
	                deferred.resolve(null);
	                return deferred.promise;
	            };
	            SelectionManager.prototype.getSelectionIds = function () {
	                return this.selectedIds;
	            };
	            SelectionManager.prototype.sendSelectionToHost = function (ids) {
	                var dataPointObjectName = this.dataPointObjectName;
	                var selectArgs = {
	                    visualObjects: _.chain(ids)
	                        .filter(function (value) { return value.hasIdentity(); })
	                        .map(function (value) {
	                        return { objectName: dataPointObjectName, selectorsByColumn: value.getSelectorsByColumn() };
	                    })
	                        .value(),
	                    selectors: undefined,
	                };
	                var shouldInsertSelectors = false;
	                if (!_.isEmpty(ids)) {
	                    shouldInsertSelectors = ids[0].getSelector() && !ids[0].getSelectorsByColumn();
	                }
	                if (shouldInsertSelectors) {
	                    selectArgs.selectors = _.chain(ids)
	                        .filter(function (value) { return value.hasIdentity(); })
	                        .map(function (value) { return value.getSelector(); })
	                        .value();
	                }
	                this.hostServices.onSelect(selectArgs);
	            };
	            SelectionManager.prototype.sendContextMenuToHost = function (selectionId, position) {
	                var selectors = this.getSelectorsByColumn([selectionId]);
	                if (_.isEmpty(selectors))
	                    return;
	                var args = {
	                    data: selectors,
	                    position: position
	                };
	                this.hostServices.onContextMenu(args);
	            };
	            SelectionManager.prototype.getSelectorsByColumn = function (selectionIds) {
	                return _(selectionIds)
	                    .filter(function (value) { return value.hasIdentity; })
	                    .map(function (value) { return value.getSelectorsByColumn(); })
	                    .compact()
	                    .value();
	            };
	            SelectionManager.prototype.selectInternal = function (selectionId, multiSelect) {
	                if (SelectionManager.containsSelection(this.selectedIds, selectionId)) {
	                    this.selectedIds = multiSelect
	                        ? this.selectedIds.filter(function (d) { return !selectionId.equals(d); })
	                        : this.selectedIds.length > 1
	                            ? [selectionId] : [];
	                }
	                else {
	                    if (multiSelect)
	                        this.selectedIds.push(selectionId);
	                    else
	                        this.selectedIds = [selectionId];
	                }
	            };
	            SelectionManager.containsSelection = function (list, id) {
	                return list.some(function (d) { return id.equals(d); });
	            };
	            return SelectionManager;
	        }());
	        extensibility.SelectionManager = SelectionManager;
	    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 447:
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var jsCommon = window.jsCommon;
	var powerbi = window.powerbi;
	var powerbitests = window.powerbitests;
	var InJs = window.InJs;
	var debug = window.debug;
	var jasmine = window.jasmine;
	var Microsoft = window.Microsoft;

	/*
	 *  Power BI Visualizations
	 *
	 *  Copyright (c) Microsoft Corporation
	 *  All rights reserved.
	 *  MIT License
	 *
	 *  Permission is hereby granted, free of charge, to any person obtaining a copy
	 *  of this software and associated documentation files (the ""Software""), to deal
	 *  in the Software without restriction, including without limitation the rights
	 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 *  copies of the Software, and to permit persons to whom the Software is
	 *  furnished to do so, subject to the following conditions:
	 *
	 *  The above copyright notice and this permission notice shall be included in
	 *  all copies or substantial portions of the Software.
	 *
	 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 *  THE SOFTWARE.
	 */
	/// <reference path="../_references.ts"/>
	var powerbi;
	(function (powerbi) {
	    var extensibility;
	    (function (extensibility) {
	        /**
	         * This class is designed to simplify the creation of SelectionId objects
	         * It allows chaining to build up an object before calling 'create' to build a SelectionId
	         */
	        var SelectionIdBuilder = (function () {
	            function SelectionIdBuilder() {
	            }
	            SelectionIdBuilder.prototype.withCategory = function (categoryColumn, index) {
	                if (categoryColumn && categoryColumn.source && categoryColumn.source.queryName && categoryColumn.identity)
	                    this.ensureDataMap()[categoryColumn.source.queryName] = categoryColumn.identity[index];
	                return this;
	            };
	            SelectionIdBuilder.prototype.withSeries = function (seriesColumn, valueColumn) {
	                if (seriesColumn && seriesColumn.source && seriesColumn.source.queryName && valueColumn)
	                    this.ensureDataMap()[seriesColumn.source.queryName] = valueColumn.identity;
	                return this;
	            };
	            SelectionIdBuilder.prototype.withMeasure = function (measureId) {
	                this.measure = measureId;
	                return this;
	            };
	            SelectionIdBuilder.prototype.createSelectionId = function () {
	                return powerbi.visuals.SelectionId.createWithSelectorForColumnAndMeasure(this.ensureDataMap(), this.measure);
	            };
	            SelectionIdBuilder.prototype.ensureDataMap = function () {
	                if (!this.dataMap)
	                    this.dataMap = {};
	                return this.dataMap;
	            };
	            return SelectionIdBuilder;
	        }());
	        extensibility.SelectionIdBuilder = SelectionIdBuilder;
	    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 448:
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var jsCommon = window.jsCommon;
	var powerbi = window.powerbi;
	var powerbitests = window.powerbitests;
	var InJs = window.InJs;
	var debug = window.debug;
	var jasmine = window.jasmine;
	var Microsoft = window.Microsoft;

	/*
	 *  Power BI Visualizations
	 *
	 *  Copyright (c) Microsoft Corporation
	 *  All rights reserved.
	 *  MIT License
	 *
	 *  Permission is hereby granted, free of charge, to any person obtaining a copy
	 *  of this software and associated documentation files (the ""Software""), to deal
	 *  in the Software without restriction, including without limitation the rights
	 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 *  copies of the Software, and to permit persons to whom the Software is
	 *  furnished to do so, subject to the following conditions:
	 *
	 *  The above copyright notice and this permission notice shall be included in
	 *  all copies or substantial portions of the Software.
	 *
	 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 *  THE SOFTWARE.
	 */
	/// <reference path="../_references.ts"/>
	var powerbi;
	(function (powerbi) {
	    var extensibility;
	    (function (extensibility) {
	        // TODO: refactor this into a service
	        extensibility.visualApiVersions = [];
	        function createVisualAdapter(visualPlugin, telemetryService) {
	            var visualAdapter = new VisualAdapter(visualPlugin, telemetryService);
	            return new extensibility.VisualSafeExecutionWrapper(visualAdapter, visualPlugin, telemetryService, visualAdapter.isPluginInError);
	        }
	        extensibility.createVisualAdapter = createVisualAdapter;
	        var VisualAdapter = (function () {
	            function VisualAdapter(visualPlugin, telemetryService) {
	                this.isPluginInError = false;
	                this.telemetryService = telemetryService;
	                this.plugin = visualPlugin;
	                var version = visualPlugin.apiVersion;
	                var versionIndex = this.getVersionIndex(version);
	                if (!version) {
	                    this.legacy = true;
	                }
	                else if (versionIndex > -1) {
	                    this.apiVersionIndex = versionIndex;
	                    this.legacy = false;
	                }
	                else {
	                    debug.assertFail("The API version '" + version + "' is invalid.");
	                    this.isPluginInError = true;
	                }
	            }
	            VisualAdapter.prototype.init = function (options) {
	                debug.assertValue(options.element, "options.element");
	                debug.assertValue(options.host, "options.host");
	                options.element.empty();
	                if (this.legacy) {
	                    this.visual = this.plugin.create();
	                    this.visualLegacy.init(options);
	                }
	                else {
	                    var host = extensibility.visualApiVersions[this.apiVersionIndex].hostAdapter(options.host);
	                    this.visual = this.plugin.create({
	                        element: options.element.get(0),
	                        host: host
	                    });
	                    this.overloadMethods();
	                }
	            };
	            VisualAdapter.prototype.update = function (options) {
	                if ((options.type & powerbi.VisualUpdateType.Resize) === powerbi.VisualUpdateType.Resize && this.visualHasMethod('onResizing')) {
	                    //a couple custom visuals depend on both onResizing and Update being called
	                    //TODO: remove this once enough custom visuals are ported to new api
	                    if (this.plugin.custom && this.visualHasMethod('update')) {
	                        this.visualLegacy.update(options);
	                    }
	                    this.onResizing(options.viewport, options.resizeMode);
	                }
	                else if (this.visualHasMethod('update')) {
	                    this.visualLegacy.update(options);
	                }
	                else {
	                    if (!options.type || options.type & powerbi.VisualUpdateType.Data) {
	                        this.onDataChanged(_.pick(options, ['dataViews', 'operationKind']));
	                    }
	                    if (options.type & powerbi.VisualUpdateType.ViewMode) {
	                        this.onViewModeChanged(options.viewMode);
	                    }
	                }
	            };
	            VisualAdapter.prototype.destroy = function () {
	                if (this.visualHasMethod('destroy')) {
	                    this.visualLegacy.destroy();
	                }
	            };
	            VisualAdapter.prototype.enumerateObjectInstances = function (options) {
	                if (!this.visualHasMethod('enumerateObjectInstances')) {
	                    return;
	                }
	                return this.visualLegacy.enumerateObjectInstances(options);
	            };
	            VisualAdapter.prototype.enumerateObjectRepetition = function () {
	                if (!this.visualHasMethod('enumerateObjectRepetition')) {
	                    return;
	                }
	                return this.visualLegacy.enumerateObjectRepetition();
	            };
	            VisualAdapter.prototype.onResizing = function (finalViewport, resizeMode) {
	                if (this.visualHasMethod('onResizing')) {
	                    this.visualLegacy.onResizing(finalViewport, resizeMode);
	                }
	            };
	            VisualAdapter.prototype.onDataChanged = function (options) {
	                if (this.visualHasMethod('onDataChanged')) {
	                    this.visualLegacy.onDataChanged(options);
	                }
	            };
	            VisualAdapter.prototype.onViewModeChanged = function (viewMode) {
	                if (this.visualHasMethod('onViewModeChanged')) {
	                    this.visualLegacy.onViewModeChanged(viewMode);
	                }
	            };
	            VisualAdapter.prototype.onClearSelection = function () {
	                if (this.visualHasMethod('onClearSelection')) {
	                    this.visualLegacy.onClearSelection();
	                }
	            };
	            VisualAdapter.prototype.canResizeTo = function (viewport) {
	                if (this.visualHasMethod('canResizeTo')) {
	                    return this.visualLegacy.canResizeTo(viewport);
	                }
	            };
	            VisualAdapter.prototype.unwrap = function () {
	                return this.visual;
	            };
	            Object.defineProperty(VisualAdapter.prototype, "visualNew", {
	                get: function () {
	                    if (this.legacy)
	                        return;
	                    return this.visual;
	                },
	                enumerable: true,
	                configurable: true
	            });
	            Object.defineProperty(VisualAdapter.prototype, "visualLegacy", {
	                get: function () {
	                    if (!this.legacy)
	                        return;
	                    return this.visual;
	                },
	                enumerable: true,
	                configurable: true
	            });
	            VisualAdapter.prototype.visualHasMethod = function (methodName) {
	                var visual = this.legacy ? this.visualLegacy : this.visualNew;
	                return visual && _.isFunction(visual[methodName]);
	            };
	            VisualAdapter.prototype.getVersionIndex = function (version) {
	                if (version) {
	                    var versionCount = extensibility.visualApiVersions.length;
	                    for (var i = 0; i < versionCount; i++) {
	                        if (extensibility.visualApiVersions[i].version === version) {
	                            return i;
	                        }
	                    }
	                }
	                return -1;
	            };
	            VisualAdapter.prototype.overloadMethods = function () {
	                var overloads = this.getCompiledOverloads();
	                for (var key in overloads) {
	                    this[key] = overloads[key];
	                }
	            };
	            VisualAdapter.prototype.getCompiledOverloads = function () {
	                var overloads = {};
	                var versionIndex = this.apiVersionIndex;
	                var visualNew = this.visualNew;
	                for (var i = 0; i <= versionIndex; i++) {
	                    var overloadFactory = extensibility.visualApiVersions[i].overloads;
	                    if (_.isFunction(overloadFactory)) {
	                        _.assign(overloads, overloadFactory(visualNew));
	                    }
	                }
	                return overloads;
	            };
	            return VisualAdapter;
	        }());
	        extensibility.VisualAdapter = VisualAdapter;
	    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 449:
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var jsCommon = window.jsCommon;
	var powerbi = window.powerbi;
	var powerbitests = window.powerbitests;
	var InJs = window.InJs;
	var debug = window.debug;
	var jasmine = window.jasmine;
	var Microsoft = window.Microsoft;

	/*
	 *  Power BI Visualizations
	 *
	 *  Copyright (c) Microsoft Corporation
	 *  All rights reserved.
	 *  MIT License
	 *
	 *  Permission is hereby granted, free of charge, to any person obtaining a copy
	 *  of this software and associated documentation files (the ""Software""), to deal
	 *  in the Software without restriction, including without limitation the rights
	 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 *  copies of the Software, and to permit persons to whom the Software is
	 *  furnished to do so, subject to the following conditions:
	 *
	 *  The above copyright notice and this permission notice shall be included in
	 *  all copies or substantial portions of the Software.
	 *
	 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 *  THE SOFTWARE.
	 */
	/// <reference path="../_references.ts"/>
	var powerbi;
	(function (powerbi) {
	    var extensibility;
	    (function (extensibility) {
	        /**
	         * Translates visual plugin produced by pbiviz cli tools
	         * The function mutates the plugin
	         *
	         * TODO: add separate capabilities interfaces and versioning support
	         */
	        function translateVisualPlugin(plugin) {
	            translateCapabilities(plugin.capabilities);
	        }
	        extensibility.translateVisualPlugin = translateVisualPlugin;
	        function translateCapabilities(capabilities) {
	            if (!capabilities)
	                return;
	            translateObjects(capabilities.objects);
	            translateDataRoles(capabilities.dataRoles);
	        }
	        /**
	         * Translates objects
	         * - allows passing EnumMembers in json (converted to EnumType)
	         */
	        function translateObjects(objects) {
	            for (var key in objects) {
	                var object = objects[key];
	                if (!object)
	                    continue;
	                var properties = object.properties;
	                if (properties) {
	                    for (var pKey in properties) {
	                        var property = properties[pKey];
	                        if (!property)
	                            continue;
	                        var propertyType = property.type;
	                        if (propertyType && propertyType.enumeration) {
	                            propertyType.enumeration = powerbi.createEnumType(propertyType.enumeration);
	                        }
	                    }
	                }
	            }
	        }
	        /**
	         * Translates data roles
	         * - allows using strings for kind in json
	         */
	        function translateDataRoles(dataRoles) {
	            for (var key in dataRoles) {
	                var dataRole = dataRoles[key];
	                if (dataRole && dataRole.kind) {
	                    switch (dataRole.kind.toString().toLowerCase()) {
	                        case 'grouping':
	                            dataRole.kind = powerbi.VisualDataRoleKind.Grouping;
	                            break;
	                        case 'measure':
	                            dataRole.kind = powerbi.VisualDataRoleKind.Measure;
	                            break;
	                        case 'groupingormeasure':
	                            dataRole.kind = powerbi.VisualDataRoleKind.GroupingOrMeasure;
	                            break;
	                    }
	                }
	            }
	        }
	    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 450:
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var jsCommon = window.jsCommon;
	var powerbi = window.powerbi;
	var powerbitests = window.powerbitests;
	var InJs = window.InJs;
	var debug = window.debug;
	var jasmine = window.jasmine;
	var Microsoft = window.Microsoft;

	/*
	 *  Power BI Visualizations
	 *
	 *  Copyright (c) Microsoft Corporation
	 *  All rights reserved.
	 *  MIT License
	 *
	 *  Permission is hereby granted, free of charge, to any person obtaining a copy
	 *  of this software and associated documentation files (the ""Software""), to deal
	 *  in the Software without restriction, including without limitation the rights
	 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 *  copies of the Software, and to permit persons to whom the Software is
	 *  furnished to do so, subject to the following conditions:
	 *
	 *  The above copyright notice and this permission notice shall be included in
	 *  all copies or substantial portions of the Software.
	 *
	 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 *  THE SOFTWARE.
	 */
	/// <reference path="../_references.ts"/>
	var powerbi;
	(function (powerbi) {
	    var extensibility;
	    (function (extensibility) {
	        var VisualException = powerbi.visuals.telemetry.VisualException;
	        var VisualSafeExecutionWrapper = (function () {
	            function VisualSafeExecutionWrapper(wrappedVisual, visualPlugin, telemetryService, isPluginInError, silent) {
	                this.wrappedVisual = wrappedVisual;
	                this.visualPlugin = visualPlugin;
	                this.telemetryService = telemetryService;
	                this.isPluginInError = isPluginInError;
	                this.silent = silent;
	                if (this.telemetryService) {
	                    this.perfLoadEvent = this.telemetryService.startEvent(powerbi.visuals.telemetry.VisualApiUsage, visualPlugin.name, // name
	                    visualPlugin.apiVersion, // apiVersion
	                    !!visualPlugin.custom, // is this a custom visual?
	                    undefined, // parentId
	                    isPluginInError, // isError
	                    powerbi.visuals.telemetry.ErrorSource.User, // errorSource
	                    undefined // errorCode
	                    );
	                }
	            }
	            VisualSafeExecutionWrapper.prototype.init = function (options) {
	                var _this = this;
	                if (this.wrappedVisual.init) {
	                    this.executeSafely(function () { return _this.wrappedVisual.init(options); });
	                }
	            };
	            VisualSafeExecutionWrapper.prototype.destroy = function () {
	                var _this = this;
	                if (this.wrappedVisual.destroy) {
	                    this.executeSafely(function () { return _this.wrappedVisual.destroy(); });
	                }
	                // We don't want to .resolve() any perf event here.  Instead, we simply cancel it.
	                if (this.perfLoadEvent) {
	                    this.perfLoadEvent = null;
	                }
	            };
	            VisualSafeExecutionWrapper.prototype.update = function (options) {
	                var _this = this;
	                if (this.wrappedVisual.update) {
	                    this.executeSafely(function () {
	                        _this.wrappedVisual.update(options);
	                        if (_this.perfLoadEvent) {
	                            _this.perfLoadEvent.resolve();
	                            _this.perfLoadEvent = null;
	                        }
	                    });
	                }
	            };
	            VisualSafeExecutionWrapper.prototype.onResizing = function (finalViewport, resizeMode) {
	                var _this = this;
	                if (this.wrappedVisual.onResizing)
	                    this.executeSafely(function () { return _this.wrappedVisual.onResizing(finalViewport, resizeMode); });
	            };
	            VisualSafeExecutionWrapper.prototype.onDataChanged = function (options) {
	                var _this = this;
	                if (this.wrappedVisual.onDataChanged)
	                    this.executeSafely(function () { return _this.wrappedVisual.onDataChanged(options); });
	            };
	            VisualSafeExecutionWrapper.prototype.onViewModeChanged = function (viewMode) {
	                var _this = this;
	                if (this.wrappedVisual.onViewModeChanged)
	                    this.executeSafely(function () { return _this.wrappedVisual.onViewModeChanged(viewMode); });
	            };
	            VisualSafeExecutionWrapper.prototype.onClearSelection = function () {
	                var _this = this;
	                if (this.wrappedVisual.onClearSelection)
	                    this.executeSafely(function () { return _this.wrappedVisual.onClearSelection(); });
	            };
	            VisualSafeExecutionWrapper.prototype.canResizeTo = function (viewport) {
	                var _this = this;
	                if (this.wrappedVisual.canResizeTo)
	                    return this.executeSafely(function () { return _this.wrappedVisual.canResizeTo(viewport); });
	            };
	            VisualSafeExecutionWrapper.prototype.enumerateObjectInstances = function (options) {
	                var _this = this;
	                if (this.wrappedVisual.enumerateObjectInstances)
	                    return this.executeSafely(function () { return _this.wrappedVisual.enumerateObjectInstances(options); });
	            };
	            VisualSafeExecutionWrapper.prototype.enumerateObjectRepetition = function () {
	                var _this = this;
	                if (this.wrappedVisual.enumerateObjectRepetition)
	                    return this.executeSafely(function () { return _this.wrappedVisual.enumerateObjectRepetition(); });
	            };
	            VisualSafeExecutionWrapper.prototype.unwrap = function () {
	                var visual = this.wrappedVisual;
	                return visual.unwrap ? visual.unwrap() : visual;
	            };
	            VisualSafeExecutionWrapper.prototype.isCustomVisual = function () {
	                return this.visualPlugin.custom;
	            };
	            VisualSafeExecutionWrapper.prototype.executeSafely = function (callback) {
	                try {
	                    return callback();
	                }
	                catch (exception) {
	                    if (!this.silent) {
	                        console.error("Visual exception", exception.stack || exception);
	                    }
	                    if (this.telemetryService) {
	                        this.telemetryService.logEvent(VisualException, this.visualPlugin.name, !!this.visualPlugin.custom, this.visualPlugin.apiVersion, exception.fileName, exception.lineNumber, exception.columnNumber, exception.stack, exception.message);
	                        if (this.perfLoadEvent) {
	                            this.perfLoadEvent.reject();
	                            this.perfLoadEvent = null;
	                        }
	                    }
	                }
	            };
	            return VisualSafeExecutionWrapper;
	        }());
	        extensibility.VisualSafeExecutionWrapper = VisualSafeExecutionWrapper;
	    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 451:
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var jsCommon = window.jsCommon;
	var powerbi = window.powerbi;
	var powerbitests = window.powerbitests;
	var InJs = window.InJs;
	var debug = window.debug;
	var jasmine = window.jasmine;
	var Microsoft = window.Microsoft;

	/*
	 *  Power BI Visualizations
	 *
	 *  Copyright (c) Microsoft Corporation
	 *  All rights reserved.
	 *  MIT License
	 *
	 *  Permission is hereby granted, free of charge, to any person obtaining a copy
	 *  of this software and associated documentation files (the ""Software""), to deal
	 *  in the Software without restriction, including without limitation the rights
	 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 *  copies of the Software, and to permit persons to whom the Software is
	 *  furnished to do so, subject to the following conditions:
	 *
	 *  The above copyright notice and this permission notice shall be included in
	 *  all copies or substantial portions of the Software.
	 *
	 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 *  THE SOFTWARE.
	 */
	var powerbi;
	(function (powerbi) {
	    var extensibility;
	    (function (extensibility) {
	        var legacy;
	        (function (legacy) {
	            function isOldSelectEventArgs(args) {
	                var castArgs = args;
	                return castArgs.data != null || castArgs.selectors != null;
	            }
	            legacy.isOldSelectEventArgs = isOldSelectEventArgs;
	            function getSelectorsByColumn(args) {
	                return args.data2;
	            }
	            legacy.getSelectorsByColumn = getSelectorsByColumn;
	            function getSelectors(args) {
	                if (!_.isEmpty(args.selectors)) {
	                    return args.selectors;
	                }
	                return args.data;
	            }
	            legacy.getSelectors = getSelectors;
	        })(legacy = extensibility.legacy || (extensibility.legacy = {}));
	    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 452:
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var jsCommon = window.jsCommon;
	var powerbi = window.powerbi;
	var powerbitests = window.powerbitests;
	var InJs = window.InJs;
	var debug = window.debug;
	var jasmine = window.jasmine;
	var Microsoft = window.Microsoft;

	/*
	 *  Power BI Visualizations
	 *
	 *  Copyright (c) Microsoft Corporation
	 *  All rights reserved.
	 *  MIT License
	 *
	 *  Permission is hereby granted, free of charge, to any person obtaining a copy
	 *  of this software and associated documentation files (the ""Software""), to deal
	 *  in the Software without restriction, including without limitation the rights
	 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 *  copies of the Software, and to permit persons to whom the Software is
	 *  furnished to do so, subject to the following conditions:
	 *
	 *  The above copyright notice and this permission notice shall be included in
	 *  all copies or substantial portions of the Software.
	 *
	 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 *  THE SOFTWARE.
	 */
	/// <reference path="../../_references.ts"/>
	var powerbi;
	(function (powerbi) {
	    var extensibility;
	    (function (extensibility) {
	        var v100;
	        (function (v100) {
	            function convertLegacyUpdateType(options) {
	                var type = options.type || powerbi.VisualUpdateType.Data;
	                if (type & powerbi.VisualUpdateType.Resize && options.resizeMode === 2 /* Resized */) {
	                    type |= powerbi.VisualUpdateType.ResizeEnd;
	                }
	                return type;
	            }
	            v100.convertLegacyUpdateType = convertLegacyUpdateType;
	            var overloadFactory = function (visual) {
	                return {
	                    update: function (options) {
	                        if (visual.update) {
	                            visual.update({
	                                viewport: options.viewport,
	                                dataViews: options.dataViews,
	                                type: convertLegacyUpdateType(options)
	                            });
	                        }
	                    },
	                    destroy: function () {
	                        if (visual.destroy) {
	                            visual.destroy();
	                        }
	                    },
	                    enumerateObjectInstances: function (options) {
	                        if (visual.enumerateObjectInstances) {
	                            return visual.enumerateObjectInstances(options);
	                        }
	                    }
	                };
	            };
	            var hostAdapter = function (host) {
	                return {};
	            };
	            extensibility.visualApiVersions.push({
	                version: '1.0.0',
	                overloads: overloadFactory,
	                hostAdapter: hostAdapter
	            });
	        })(v100 = extensibility.v100 || (extensibility.v100 = {}));
	    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 453:
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var jsCommon = window.jsCommon;
	var powerbi = window.powerbi;
	var powerbitests = window.powerbitests;
	var InJs = window.InJs;
	var debug = window.debug;
	var jasmine = window.jasmine;
	var Microsoft = window.Microsoft;

	/*
	 *  Power BI Visualizations
	 *
	 *  Copyright (c) Microsoft Corporation
	 *  All rights reserved.
	 *  MIT License
	 *
	 *  Permission is hereby granted, free of charge, to any person obtaining a copy
	 *  of this software and associated documentation files (the ""Software""), to deal
	 *  in the Software without restriction, including without limitation the rights
	 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 *  copies of the Software, and to permit persons to whom the Software is
	 *  furnished to do so, subject to the following conditions:
	 *
	 *  The above copyright notice and this permission notice shall be included in
	 *  all copies or substantial portions of the Software.
	 *
	 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 *  THE SOFTWARE.
	 */
	/// <reference path="../../_references.ts"/>
	var powerbi;
	(function (powerbi) {
	    var extensibility;
	    (function (extensibility) {
	        var v110;
	        (function (v110) {
	            var overloadFactory = function (visual) {
	                return {
	                    update: function (options) {
	                        if (visual.update) {
	                            var updateOptions = {
	                                viewport: options.viewport,
	                                dataViews: options.dataViews,
	                                type: extensibility.v100.convertLegacyUpdateType(options)
	                            };
	                            var transform = visual.constructor.__transform__;
	                            if (_.isFunction(transform)) {
	                                visual.update(updateOptions, transform(updateOptions.dataViews));
	                            }
	                            else {
	                                visual.update(updateOptions);
	                            }
	                        }
	                    }
	                };
	            };
	            var hostAdapter = function (host) {
	                return {
	                    createSelectionIdBuilder: function () { return new powerbi.visuals.SelectionIdBuilder(); },
	                    createSelectionManager: function () { return new extensibility.SelectionManager({ hostServices: host }); },
	                    colors: powerbi.visuals.ThemeManager.getDefaultTheme(),
	                };
	            };
	            extensibility.visualApiVersions.push({
	                version: '1.1.0',
	                overloads: overloadFactory,
	                hostAdapter: hostAdapter
	            });
	        })(v110 = extensibility.v110 || (extensibility.v110 = {}));
	    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
	})(powerbi || (powerbi = {}));

	

/***/ }

/******/ });
//# sourceMappingURL=VisualsExtensibility.js.map