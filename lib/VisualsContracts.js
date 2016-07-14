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

	module.exports = __webpack_require__(303);


/***/ },

/***/ 303:
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
	__webpack_require__(304);
	__webpack_require__(307);
	__webpack_require__(308);
	__webpack_require__(309);
	__webpack_require__(310);
	__webpack_require__(311);
	__webpack_require__(312);
	__webpack_require__(313);
	__webpack_require__(314);
	__webpack_require__(315);
	__webpack_require__(316);
	__webpack_require__(317);
	__webpack_require__(318);
	__webpack_require__(319);
	__webpack_require__(320);
	__webpack_require__(321);
	__webpack_require__(322);
	__webpack_require__(323);
	__webpack_require__(324);
	__webpack_require__(325);
	__webpack_require__(326);
	__webpack_require__(327);
	__webpack_require__(328);
	__webpack_require__(329);
	__webpack_require__(330);
	__webpack_require__(331);
	__webpack_require__(332);
	__webpack_require__(333);
	__webpack_require__(334);
	__webpack_require__(335);
	__webpack_require__(336);
	__webpack_require__(337);
	__webpack_require__(338);
	__webpack_require__(339);
	__webpack_require__(340);
	__webpack_require__(341);
	__webpack_require__(342);
	__webpack_require__(343);
	__webpack_require__(344);
	__webpack_require__(345);
	__webpack_require__(346);
	__webpack_require__(347);
	__webpack_require__(348);
	__webpack_require__(349);
	__webpack_require__(350);
	__webpack_require__(351);

	

/***/ },

/***/ 304:
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
	__webpack_require__(305);
	__webpack_require__(306);
	/// <reference path="./common/DragDrop.d.ts"/>
	/// <reference path="./common/IStringResourceProvider.d.ts"/>
	/// <reference path="./common/promise.d.ts"/>
	/// <reference path="./common/rect.d.ts"/>
	/// <reference path="./common/selectionId.d.ts"/>
	/// <reference path="./common/point.d.ts"/>
	/// <reference path="./telemetry/iTelemetryService.d.ts"/>
	/// <reference path="./telemetry/events.d.ts"/>
	/// <reference path="./data/compiledDataViewMapping.d.ts"/>
	/// <reference path="./data/sortDirection.d.ts"/>
	/// <reference path="./data/dataView.d.ts"/>
	/// <reference path="./data/dataViewMapping.d.ts"/>
	/// <reference path="./data/dataViewObject.d.ts"/>
	/// <reference path="./data/dataViewObjectDescriptor.d.ts"/>
	/// <reference path="./data/dataViewRoleWildcard.d.ts"/>
	/// <reference path="./data/dataViewScopeIdentity.d.ts"/>
	/// <reference path="./data/dataViewScopeWildcard.d.ts"/>
	/// <reference path="./data/displayNameGetter.d.ts"/>
	/// <reference path="./data/scriptQuery.d.ts"/>
	/// <reference path="./data/selector.d.ts"/>
	/// <reference path="./data/semanticQuery.d.ts"/>
	/// <reference path="./data/visualData.d.ts"/>
	/// <reference path="./data/visualDataRole.d.ts"/>
	/// <reference path="./location/geolocation.d.ts"/>
	/// <reference path="./types/defaultValue.d.ts"/>
	/// <reference path="./types/enumType.d.ts"/>
	/// <reference path="./types/fill.d.ts"/>
	/// <reference path="./types/fillRule.d.ts"/>
	/// <reference path="./types/filter.d.ts"/>
	/// <reference path="./types/image.d.ts"/>
	/// <reference path="./types/paragraphs.d.ts"/>
	/// <reference path="./types/structuralType.d.ts"/>
	/// <reference path="./types/valueType.d.ts"/>
	/// <reference path="./visual/iVisualStyle.d.ts"/>
	/// <reference path="./visual/iVisual.d.ts"/>
	/// <reference path="./visual/VisualObjectInstance.d.ts"/>
	/// <reference path="./visual/VisualObjectRepetition.d.ts"/>
	/// <reference path="./visual/iVisualPlugin.d.ts"/>
	/// <reference path="./extensibility/VisualCapabilities.d.ts"/>
	/// <reference path="./extensibility/iVisual.d.ts"/>
	/// <reference path="./extensibility/Versioning.d.ts"/>
	/// <reference path="./extensibility/versions/v1.0.0.d.ts"/>
	/// <reference path="./extensibility/versions/v1.1.0.d.ts"/>
	/// <reference path="./extensibility/components/iSelectionManager.d.ts"/>
	/// <reference path="./extensibility/components/iSelectionIdBuilder.d.ts"/>



/***/ },

/***/ 305:
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

	

/***/ },

/***/ 306:
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
	    (function (VisualDataRoleKind) {
	        /** Indicates that the role should be bound to something that evaluates to a grouping of values. */
	        VisualDataRoleKind[VisualDataRoleKind["Grouping"] = 0] = "Grouping";
	        /** Indicates that the role should be bound to something that evaluates to a single value in a scope. */
	        VisualDataRoleKind[VisualDataRoleKind["Measure"] = 1] = "Measure";
	        /** Indicates that the role can be bound to either Grouping or Measure. */
	        VisualDataRoleKind[VisualDataRoleKind["GroupingOrMeasure"] = 2] = "GroupingOrMeasure";
	    })(powerbi.VisualDataRoleKind || (powerbi.VisualDataRoleKind = {}));
	    var VisualDataRoleKind = powerbi.VisualDataRoleKind;
	    (function (VisualDataChangeOperationKind) {
	        VisualDataChangeOperationKind[VisualDataChangeOperationKind["Create"] = 0] = "Create";
	        VisualDataChangeOperationKind[VisualDataChangeOperationKind["Append"] = 1] = "Append";
	    })(powerbi.VisualDataChangeOperationKind || (powerbi.VisualDataChangeOperationKind = {}));
	    var VisualDataChangeOperationKind = powerbi.VisualDataChangeOperationKind;
	    (function (VisualUpdateType) {
	        VisualUpdateType[VisualUpdateType["Data"] = 2] = "Data";
	        VisualUpdateType[VisualUpdateType["Resize"] = 4] = "Resize";
	        VisualUpdateType[VisualUpdateType["ViewMode"] = 8] = "ViewMode";
	        VisualUpdateType[VisualUpdateType["Style"] = 16] = "Style";
	        VisualUpdateType[VisualUpdateType["ResizeEnd"] = 32] = "ResizeEnd";
	        VisualUpdateType[VisualUpdateType["All"] = 62] = "All";
	    })(powerbi.VisualUpdateType || (powerbi.VisualUpdateType = {}));
	    var VisualUpdateType = powerbi.VisualUpdateType;
	    (function (VisualPermissions) {
	    })(powerbi.VisualPermissions || (powerbi.VisualPermissions = {}));
	    var VisualPermissions = powerbi.VisualPermissions;
	    var visuals;
	    (function (visuals) {
	        var telemetry;
	        (function (telemetry) {
	            (function (ErrorSource) {
	                ErrorSource[ErrorSource["PowerBI"] = 0] = "PowerBI";
	                ErrorSource[ErrorSource["External"] = 1] = "External";
	                ErrorSource[ErrorSource["User"] = 2] = "User";
	            })(telemetry.ErrorSource || (telemetry.ErrorSource = {}));
	            var ErrorSource = telemetry.ErrorSource;
	        })(telemetry = visuals.telemetry || (visuals.telemetry = {}));
	    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 307:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 308:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 309:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 310:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 311:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 312:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 313:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 314:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 315:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 316:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 317:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 318:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 319:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 320:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 321:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 322:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 323:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 324:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 325:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 326:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 327:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 328:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 329:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 330:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 331:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 332:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 333:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 334:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 335:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 336:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 337:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 338:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 339:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 340:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 341:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 342:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 343:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 344:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 345:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 346:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 347:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 348:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 349:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 350:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ },

/***/ 351:
/***/ function(module, exports) {

	/* Removed by FileToAssetLoader */

/***/ }

/******/ });
//# sourceMappingURL=VisualsContracts.js.map