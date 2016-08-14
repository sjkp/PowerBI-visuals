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

	module.exports = __webpack_require__(291);


/***/ },

/***/ 66:
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
	/**
	 * Defines a Debug object. Calls to any functions in this object removed by the minifier.
	 * The functions within this class are not minified away, so we use the preprocessor-style
	 * comments to have the minifier remove those as well.
	 */
	///#DEBUG
	/// <reference path="./_references.ts"/>
	var debug;
	(function (debug) {
	    /**
	     * Asserts that the condition is true, fails otherwise.
	     */
	    function assert(condition, message) {
	        if (condition !== true) {
	            assertFail(message || ('condition: ' + condition));
	        }
	    }
	    debug.assert = assert;
	    /**
	     * Asserts that the value is neither null nor undefined, fails otherwise.
	     */
	    function assertValue(value, message) {
	        if (value === null || value === undefined) {
	            assertFail(message || ('condition: ' + value));
	        }
	    }
	    debug.assertValue = assertValue;
	    /**
	     * Asserts that the value is neither null nor undefined, and has a length property that returns greater than zero, fails otherwise.
	     */
	    function assertNonEmpty(value, message) {
	        if (!(value != null && value.length > 0)) {
	            assertFail(message || ('condition: ' + value));
	        }
	    }
	    debug.assertNonEmpty = assertNonEmpty;
	    /**
	     * Makes no assertion on the given value.
	     * This is documentation/placeholder that a value is possibly null or undefined (unlike assertValue).
	     */
	    function assertAnyValue(value, message) {
	    }
	    debug.assertAnyValue = assertAnyValue;
	    function assertFail(message) {
	        (debug.assertFailFunction || alert)('Debug Assert failed: ' + message);
	    }
	    debug.assertFail = assertFail;
	})(debug || (debug = {}));
	///#ENDDEBUG 

	

/***/ },

/***/ 67:
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
	/// <reference path="./_references.ts"/>
	var jsCommon;
	(function (jsCommon) {
	    var Errors;
	    (function (Errors) {
	        function infoNavAppAlreadyPresent() {
	            return {
	                name: 'infoNavAppAlreadyPresent',
	                message: 'Cannot initialize embedded scenario when the InfoNav App is already present in this context',
	                stack: getExceptionStackTrace()
	            };
	        }
	        Errors.infoNavAppAlreadyPresent = infoNavAppAlreadyPresent;
	        function invalidOperation(message) {
	            return {
	                name: 'invalidOperation',
	                message: message,
	                stack: getExceptionStackTrace()
	            };
	        }
	        Errors.invalidOperation = invalidOperation;
	        function argument(argumentName, message) {
	            return {
	                name: 'invalidArgumentError',
	                argument: argumentName,
	                message: message,
	                stack: getExceptionStackTrace()
	            };
	        }
	        Errors.argument = argument;
	        function argumentNull(argumentName) {
	            return {
	                name: 'argumentNull',
	                argument: argumentName,
	                message: 'Argument was null',
	                stack: getExceptionStackTrace()
	            };
	        }
	        Errors.argumentNull = argumentNull;
	        function argumentUndefined(argumentName) {
	            return {
	                name: 'argumentUndefined',
	                argument: argumentName,
	                message: 'Argument was undefined',
	                stack: getExceptionStackTrace()
	            };
	        }
	        Errors.argumentUndefined = argumentUndefined;
	        function argumentOutOfRange(argumentName) {
	            return {
	                name: 'argumentOutOfRange',
	                argument: argumentName,
	                message: 'Argument was out of range',
	                stack: getExceptionStackTrace()
	            };
	        }
	        Errors.argumentOutOfRange = argumentOutOfRange;
	        function pureVirtualMethodException(className, methodName) {
	            return {
	                name: 'pureVirtualMethodException',
	                message: 'This method must be overriden by the derived class:' + className + '.' + methodName,
	                stack: getExceptionStackTrace()
	            };
	        }
	        Errors.pureVirtualMethodException = pureVirtualMethodException;
	        function notImplementedException(message) {
	            return {
	                name: 'notImplementedException',
	                message: message,
	                stack: getExceptionStackTrace()
	            };
	        }
	        Errors.notImplementedException = notImplementedException;
	        function getExceptionStackTrace() {
	            return getStackTrace(/*leadingFramesToRemove*/ 2);
	        }
	    })(Errors = jsCommon.Errors || (jsCommon.Errors = {}));
	    /**
	     * Captures the stack trace, if available.
	     * It optionally takes the number of frames to remove from the stack trace.
	     * By default, it removes the last frame to consider the calling type's
	     * constructor and the temporary error used to capture the stack trace (below).
	     * More levels can be requested as needed e..g. when an error is created
	     * from a helper method. <Min requirement: IE10, Chrome, Firefox, Opera>.
	     */
	    function getStackTrace(leadingFramesToRemove) {
	        if (leadingFramesToRemove === void 0) { leadingFramesToRemove = 1; }
	        var stackTrace, stackSegments;
	        try {
	            // needs to throw for stack trace to work in IE
	            throw new Error();
	        }
	        catch (error) {
	            stackTrace = error.stack;
	            if (stackTrace != null) {
	                stackSegments = stackTrace.split('\n');
	                stackSegments.splice(1, leadingFramesToRemove);
	                // Finally
	                stackTrace = stackSegments.join('\n');
	            }
	        }
	        return stackTrace;
	    }
	    jsCommon.getStackTrace = getStackTrace;
	})(jsCommon || (jsCommon = {}));

	

/***/ },

/***/ 68:
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
	/// <reference path="./_references.ts"/>
	var jsCommon;
	(function (jsCommon) {
	    /**
	     * Represents a lazily instantiated value.
	     */
	    var Lazy = (function () {
	        function Lazy(factoryMethod) {
	            jsCommon.Utility.throwIfNullOrUndefined(factoryMethod, this, 'constructor', 'factoryMethod');
	            this.factoryMethod = factoryMethod;
	        }
	        Lazy.prototype.getValue = function () {
	            if (this.factoryMethod !== null) {
	                this.value = this.factoryMethod();
	                // Optimization: Release the factoryMethod, as it could be holding a large object graph.
	                this.factoryMethod = null;
	            }
	            return this.value;
	        };
	        return Lazy;
	    }());
	    jsCommon.Lazy = Lazy;
	})(jsCommon || (jsCommon = {}));

	

/***/ },

/***/ 69:
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
	/// <reference path="./_references.ts"/>
	var powerbi;
	(function (powerbi) {
	    var Prototype;
	    (function (Prototype) {
	        /**
	         * Returns a new object with the provided obj as its prototype.
	         */
	        function inherit(obj, extension) {
	            debug.assertValue(obj, 'obj');
	            function wrapCtor() { }
	            ;
	            wrapCtor.prototype = obj;
	            var inherited = new wrapCtor();
	            if (extension)
	                extension(inherited);
	            return inherited;
	        }
	        Prototype.inherit = inherit;
	        /**
	         * Returns a new object with the provided obj as its prototype
	         * if, and only if, the prototype has not been previously set
	         */
	        function inheritSingle(obj) {
	            debug.assertValue(obj, 'obj');
	            var proto = Object.getPrototypeOf(obj);
	            if (proto === Object.prototype || proto === Array.prototype)
	                obj = inherit(obj);
	            return obj;
	        }
	        Prototype.inheritSingle = inheritSingle;
	        /**
	         * Uses the provided callback function to selectively replace contents in the provided array.
	         * @return A new array with those values overriden
	         * or undefined if no overrides are necessary.
	         */
	        function overrideArray(prototype, override) {
	            if (!prototype)
	                return;
	            var overwritten;
	            for (var i = 0, len = prototype.length; i < len; i++) {
	                var value = override(prototype[i]);
	                if (value) {
	                    if (!overwritten)
	                        overwritten = inherit(prototype);
	                    overwritten[i] = value;
	                }
	            }
	            return overwritten;
	        }
	        Prototype.overrideArray = overrideArray;
	    })(Prototype = powerbi.Prototype || (powerbi.Prototype = {}));
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 70:
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
	var jsCommon;
	(function (jsCommon) {
	    /**
	     * Http Status code we are interested.
	     */
	    (function (HttpStatusCode) {
	        HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
	        HttpStatusCode[HttpStatusCode["BadRequest"] = 400] = "BadRequest";
	        HttpStatusCode[HttpStatusCode["Unauthorized"] = 401] = "Unauthorized";
	        HttpStatusCode[HttpStatusCode["Forbidden"] = 403] = "Forbidden";
	        HttpStatusCode[HttpStatusCode["RequestEntityTooLarge"] = 413] = "RequestEntityTooLarge";
	    })(jsCommon.HttpStatusCode || (jsCommon.HttpStatusCode = {}));
	    var HttpStatusCode = jsCommon.HttpStatusCode;
	    /**
	     * Other HTTP Constants.
	     */
	    var HttpConstants;
	    (function (HttpConstants) {
	        HttpConstants.ApplicationOctetStream = 'application/octet-stream';
	        HttpConstants.MultiPartFormData = 'multipart/form-data';
	    })(HttpConstants = jsCommon.HttpConstants || (jsCommon.HttpConstants = {}));
	    /**
	     * Extensions to String class.
	     */
	    var StringExtensions;
	    (function (StringExtensions) {
	        var HtmlTagRegex = new RegExp('[<>]', 'g');
	        function format() {
	            var args = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                args[_i - 0] = arguments[_i];
	            }
	            var s = args[0];
	            if (isNullOrUndefinedOrWhiteSpaceString(s))
	                return s;
	            for (var i = 0; i < args.length - 1; i++) {
	                var reg = new RegExp("\\{" + i + "\\}", "gm");
	                s = s.replace(reg, args[i + 1]);
	            }
	            return s;
	        }
	        StringExtensions.format = format;
	        /**
	         * Compares two strings for equality, ignoring case.
	         */
	        function equalIgnoreCase(a, b) {
	            return StringExtensions.normalizeCase(a) === StringExtensions.normalizeCase(b);
	        }
	        StringExtensions.equalIgnoreCase = equalIgnoreCase;
	        function startsWithIgnoreCase(a, b) {
	            var normalizedSearchString = StringExtensions.normalizeCase(b);
	            return StringExtensions.normalizeCase(a).indexOf(normalizedSearchString) === 0;
	        }
	        StringExtensions.startsWithIgnoreCase = startsWithIgnoreCase;
	        function startsWith(a, b) {
	            return a.indexOf(b) === 0;
	        }
	        StringExtensions.startsWith = startsWith;
	        /** Determines whether a string contains a specified substring (by case-sensitive comparison). */
	        function contains(source, substring) {
	            if (source == null)
	                return false;
	            return source.indexOf(substring) !== -1;
	        }
	        StringExtensions.contains = contains;
	        /** Determines whether a string contains a specified substring (while ignoring case). */
	        function containsIgnoreCase(source, substring) {
	            if (source == null)
	                return false;
	            return contains(normalizeCase(source), normalizeCase(substring));
	        }
	        StringExtensions.containsIgnoreCase = containsIgnoreCase;
	        /**
	         * Normalizes case for a string.
	         * Used by equalIgnoreCase method.
	         */
	        function normalizeCase(value) {
	            Utility.throwIfNullOrUndefined(value, StringExtensions, 'normalizeCase', 'value');
	            return value.toUpperCase();
	        }
	        StringExtensions.normalizeCase = normalizeCase;
	        /**
	         * Is string null or empty or undefined?
	         * @return True if the value is null or undefined or empty string,
	         * otherwise false.
	         */
	        function isNullOrEmpty(value) {
	            return (value == null) || (value.length === 0);
	        }
	        StringExtensions.isNullOrEmpty = isNullOrEmpty;
	        /**
	         * Returns true if the string is null, undefined, empty, or only includes white spaces.
	         * @return True if the str is null, undefined, empty, or only includes white spaces,
	         * otherwise false.
	         */
	        function isNullOrUndefinedOrWhiteSpaceString(str) {
	            return StringExtensions.isNullOrEmpty(str) || StringExtensions.isNullOrEmpty(str.trim());
	        }
	        StringExtensions.isNullOrUndefinedOrWhiteSpaceString = isNullOrUndefinedOrWhiteSpaceString;
	        /**
	         * Returns a value indicating whether the str contains any whitespace.
	         */
	        function containsWhitespace(str) {
	            Utility.throwIfNullOrUndefined(str, this, 'containsWhitespace', 'str');
	            var expr = /\s/;
	            return expr.test(str);
	        }
	        StringExtensions.containsWhitespace = containsWhitespace;
	        /**
	         * Returns a value indicating whether the str is a whitespace string.
	         */
	        function isWhitespace(str) {
	            Utility.throwIfNullOrUndefined(str, this, 'isWhitespace', 'str');
	            return str.trim() === '';
	        }
	        StringExtensions.isWhitespace = isWhitespace;
	        /**
	         * Returns the string with any trailing whitespace from str removed.
	         */
	        function trimTrailingWhitespace(str) {
	            Utility.throwIfNullOrUndefined(str, this, 'trimTrailingWhitespace', 'str');
	            return str.replace(/\s+$/, '');
	        }
	        StringExtensions.trimTrailingWhitespace = trimTrailingWhitespace;
	        /**
	         * Returns the string with any leading and trailing whitespace from str removed.
	         */
	        function trimWhitespace(str) {
	            Utility.throwIfNullOrUndefined(str, this, 'trimWhitespace', 'str');
	            return str.replace(/^\s+/, '').replace(/\s+$/, '');
	        }
	        StringExtensions.trimWhitespace = trimWhitespace;
	        /**
	         * Returns length difference between the two provided strings.
	         */
	        function getLengthDifference(left, right) {
	            Utility.throwIfNullOrUndefined(left, this, 'getLengthDifference', 'left');
	            Utility.throwIfNullOrUndefined(right, this, 'getLengthDifference', 'right');
	            return Math.abs(left.length - right.length);
	        }
	        StringExtensions.getLengthDifference = getLengthDifference;
	        /**
	         * Repeat char or string several times.
	         * @param char The string to repeat.
	         * @param count How many times to repeat the string.
	         */
	        function repeat(char, count) {
	            var result = "";
	            for (var i = 0; i < count; i++) {
	                result += char;
	            }
	            return result;
	        }
	        StringExtensions.repeat = repeat;
	        /**
	         * Replace all the occurrences of the textToFind in the text with the textToReplace.
	         * @param text The original string.
	         * @param textToFind Text to find in the original string.
	         * @param textToReplace New text replacing the textToFind.
	         */
	        function replaceAll(text, textToFind, textToReplace) {
	            if (!textToFind)
	                return text;
	            var pattern = escapeStringForRegex(textToFind);
	            return text.replace(new RegExp(pattern, 'gi'), textToReplace);
	        }
	        StringExtensions.replaceAll = replaceAll;
	        function ensureUniqueNames(names) {
	            debug.assertValue(names, 'names');
	            var usedNames = {};
	            // Make sure we are giving fair chance for all columns to stay with their original name
	            // First we fill the used names map to contain all the original unique names from the list.
	            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
	                var name_1 = names_1[_i];
	                usedNames[name_1] = false;
	            }
	            var uniqueNames = [];
	            // Now we go over all names and find a unique name for each
	            for (var _a = 0, names_2 = names; _a < names_2.length; _a++) {
	                var name_2 = names_2[_a];
	                var uniqueName = name_2;
	                // If the (original) column name is already taken lets try to find another name
	                if (usedNames[uniqueName]) {
	                    var counter = 0;
	                    // Find a name that is not already in the map
	                    while (usedNames[uniqueName] !== undefined) {
	                        uniqueName = name_2 + "." + (++counter);
	                    }
	                }
	                uniqueNames.push(uniqueName);
	                usedNames[uniqueName] = true;
	            }
	            return uniqueNames;
	        }
	        StringExtensions.ensureUniqueNames = ensureUniqueNames;
	        /**
	         * Returns a name that is not specified in the values.
	         */
	        function findUniqueName(usedNames, baseName) {
	            debug.assertValue(usedNames, 'usedNames');
	            debug.assertValue(baseName, 'baseName');
	            // Find a unique name
	            var i = 0, uniqueName = baseName;
	            while (usedNames[uniqueName]) {
	                uniqueName = baseName + (++i);
	            }
	            return uniqueName;
	        }
	        StringExtensions.findUniqueName = findUniqueName;
	        function constructCommaSeparatedList(list, resourceProvider, maxValue) {
	            if (!list || list.length === 0)
	                return '';
	            if (maxValue === null || maxValue === undefined)
	                maxValue = Number.MAX_VALUE;
	            var length = Math.min(maxValue, list.length);
	            var replacedList = [];
	            // Only need to replace user entries of {0} and {1} since we build the list in pairs.
	            for (var j = 0; j < 2; j++) {
	                var targetValue = '{' + j + '}';
	                var replaceValue = '_|_<' + j + '>_|_';
	                for (var i = 0; i < length; i++) {
	                    if (list[i].indexOf(targetValue) > -1) {
	                        list[i] = list[i].replace(targetValue, replaceValue);
	                        replacedList.push({ targetValue: targetValue, replaceValue: replaceValue });
	                    }
	                }
	            }
	            var commaSeparatedList = '';
	            for (var i = 0; i < length; i++) {
	                if (i === 0)
	                    commaSeparatedList = list[i];
	                else
	                    commaSeparatedList = StringExtensions.format(resourceProvider.get('FilterRestatement_Comma'), commaSeparatedList, list[i]);
	            }
	            for (var i = 0; i < replacedList.length; i++) {
	                commaSeparatedList = commaSeparatedList.replace(replacedList[i].replaceValue, replacedList[i].targetValue);
	            }
	            return commaSeparatedList;
	        }
	        StringExtensions.constructCommaSeparatedList = constructCommaSeparatedList;
	        function escapeStringForRegex(s) {
	            return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1');
	        }
	        StringExtensions.escapeStringForRegex = escapeStringForRegex;
	        /**
	         * Remove file name reserved characters <>:"/\|?* from input string.
	         */
	        function normalizeFileName(fileName) {
	            debug.assertValue(fileName, 'fileName');
	            return fileName.replace(/[\<\>\:"\/\\\|\?*]/g, '');
	        }
	        StringExtensions.normalizeFileName = normalizeFileName;
	        /**
	         * Similar to JSON.stringify, but strips away escape sequences so that the resulting
	         * string is human-readable (and parsable by JSON formatting/validating tools).
	         */
	        function stringifyAsPrettyJSON(object) {
	            //let specialCharacterRemover = (key: string, value: string) => value.replace(/[^\w\s]/gi, '');
	            return JSON.stringify(object /*, specialCharacterRemover*/);
	        }
	        StringExtensions.stringifyAsPrettyJSON = stringifyAsPrettyJSON;
	        /**
	         * Derive a CLS-compliant name from a specified string.  If no allowed characters are present, return a fallback string instead.
	         * TODO (6708134): this should have a fully Unicode-aware implementation
	         */
	        function deriveClsCompliantName(input, fallback) {
	            debug.assertValue(input, 'input');
	            var result = input.replace(/^[^A-Za-z]*/g, '').replace(/[ :\.\/\\\-\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]/g, '_').replace(/[\W]/g, '');
	            return result.length > 0 ? result : fallback;
	        }
	        StringExtensions.deriveClsCompliantName = deriveClsCompliantName;
	        /** Performs cheap sanitization by stripping away HTML tag (<>) characters. */
	        function stripTagDelimiters(s) {
	            return s.replace(HtmlTagRegex, '');
	        }
	        StringExtensions.stripTagDelimiters = stripTagDelimiters;
	    })(StringExtensions = jsCommon.StringExtensions || (jsCommon.StringExtensions = {}));
	    /**
	     * The general utility class.
	     */
	    var Utility = (function () {
	        function Utility() {
	        }
	        /**
	         * Ensures the specified value is not null or undefined. Throws a relevent exception if it is.
	         * @param value The value to check.
	         * @param context The context from which the check originated.
	         * @param methodName The name of the method that initiated the check.
	         * @param parameterName The parameter name of the value to check.
	         */
	        Utility.throwIfNullOrUndefined = function (value, context, methodName, parameterName) {
	            if (value === null) {
	                Utility.throwException(jsCommon.Errors.argumentNull(Utility.getComponentName(context) + methodName + '.' + parameterName));
	            }
	            else if (typeof (value) === Utility.Undefined) {
	                Utility.throwException(jsCommon.Errors.argumentUndefined(Utility.getComponentName(context) + methodName + '.' + parameterName));
	            }
	        };
	        /**
	         * Ensures the specified value is not null, undefined or empty. Throws a relevent exception if it is.
	         * @param value The value to check.
	         * @param context The context from which the check originated.
	         * @param methodName The name of the method that initiated the check.
	         * @param parameterName The parameter name of the value to check.
	         */
	        Utility.throwIfNullOrEmpty = function (value, context, methodName, parameterName) {
	            Utility.throwIfNullOrUndefined(value, context, methodName, parameterName);
	            if (!value.length) {
	                Utility.throwException(jsCommon.Errors.argumentOutOfRange(Utility.getComponentName(context) + methodName + '.' + parameterName));
	            }
	        };
	        /**
	         * Ensures the specified string is not null, undefined or empty. Throws a relevent exception if it is.
	         * @param value The value to check.
	         * @param context The context from which the check originated.
	         * @param methodName The name of the method that initiated the check.
	         * @param parameterName The parameter name of the value to check.
	         */
	        Utility.throwIfNullOrEmptyString = function (value, context, methodName, parameterName) {
	            Utility.throwIfNullOrUndefined(value, context, methodName, parameterName);
	            if (value.length < 1) {
	                Utility.throwException(jsCommon.Errors.argumentOutOfRange(Utility.getComponentName(context) + methodName + '.' + parameterName));
	            }
	        };
	        /**
	         * Ensures the specified value is not null, undefined, whitespace or empty. Throws a relevent exception if it is.
	         * @param value The value to check.
	         * @param context The context from which the check originated.
	         * @param methodName The name of the method that initiated the check.
	         * @param parameterName The parameter name of the value to check.
	         */
	        Utility.throwIfNullEmptyOrWhitespaceString = function (value, context, methodName, parameterName) {
	            Utility.throwIfNullOrUndefined(value, context, methodName, parameterName);
	            if (StringExtensions.isNullOrUndefinedOrWhiteSpaceString(value)) {
	                Utility.throwException(jsCommon.Errors.argumentOutOfRange(Utility.getComponentName(context) + methodName + '.' + parameterName));
	            }
	        };
	        /**
	         * Ensures the specified condition is true. Throws relevant exception if it isn't.
	         * @param condition The condition to check.
	         * @param context The context from which the check originated.
	         * @param methodName The name of the method that initiated the check.
	         * @param parameterName The parameter name against which the condition is checked.
	         */
	        Utility.throwIfNotTrue = function (condition, context, methodName, parameterName) {
	            if (!condition) {
	                Utility.throwException(jsCommon.Errors.argument(parameterName, Utility.getComponentName(context) + methodName + '.' + parameterName));
	            }
	        };
	        /**
	         * Checks whether the provided value is a 'string'.
	         * @param value The value to test.
	         */
	        Utility.isString = function (value) {
	            return ((typeof value) === 'string');
	        };
	        /**
	         * Checks whether the provided value is a 'boolean'.
	         * @param value The value to test.
	         */
	        Utility.isBoolean = function (value) {
	            return ((typeof value) === 'boolean');
	        };
	        /**
	         * Checks whether the provided value is a 'number'.
	         * @param value The value to test.
	         */
	        Utility.isNumber = function (value) {
	            return ((typeof value) === 'number');
	        };
	        /**
	         * Checks whether the provided value is a Date instance.
	         * @param value The value to test.
	         */
	        Utility.isDate = function (value) {
	            return Utility.isObject(value) && (value instanceof Date);
	        };
	        /**
	         * Checks whether the provided value is an 'object'.
	         * @param value The value to test.
	         */
	        Utility.isObject = function (value) {
	            return (value != null) && ((typeof value) === 'object');
	        };
	        /**
	         * Checks whether the provided value is null or undefined.
	         * @param value The value to test.
	         */
	        Utility.isNullOrUndefined = function (value) {
	            return (value === null) || (typeof (value) === Utility.Undefined);
	        };
	        /**
	         * Checks if the value is defined and returns it, else, returns undefined
	         * @param {T} value Value to check
	         * @param {T} defaultValue Default value to return if value is undefined
	         * @returns value if defined, else defaultValue
	         */
	        Utility.valueOrDefault = function (value, defaultValue) {
	            if (value != null)
	                return value;
	            return defaultValue;
	        };
	        /**
	         * Combine a base url and a path.
	         * @param baseUrl The base url.
	         * @param path The path to add on to the base url.
	         * @returns The combined url.
	         */
	        Utility.urlCombine = function (baseUrl, path) {
	            Utility.throwIfNullOrUndefined(baseUrl, null, "urlCombine", "baseUrl");
	            Utility.throwIfNullOrUndefined(path, null, "urlCombine", "path");
	            // should any of the components be empty, fail gracefuly - this is important when using the test page
	            if (StringExtensions.isNullOrUndefinedOrWhiteSpaceString(path)) {
	                return baseUrl;
	            }
	            if (StringExtensions.isNullOrUndefinedOrWhiteSpaceString(baseUrl)) {
	                return path;
	            }
	            var finalUrl = baseUrl;
	            if (finalUrl.charAt(finalUrl.length - 1) === '/') {
	                if (path.charAt(0) === '/')
	                    path = path.slice(1);
	            }
	            else {
	                if (path.charAt(0) !== '/')
	                    path = '/' + path;
	            }
	            return finalUrl + path;
	        };
	        Utility.getAbsoluteUri = function (path) {
	            Utility.throwIfNullOrUndefined(path, null, "getAbsoluteUri", "path");
	            var url = path;
	            // Make absolute
	            if (url && url.indexOf('http') === -1) {
	                url = Utility.urlCombine(clusterUri, url);
	            }
	            return url;
	        };
	        Utility.getStaticResourceUri = function (path) {
	            Utility.throwIfNullOrUndefined(path, null, "getStaticResourceUri", "path");
	            var url = path;
	            // Make absolute
	            if (url && url.indexOf('http') === -1) {
	                url = jsCommon.Utility.urlCombine(Utility.staticContentLocation, url);
	            }
	            return url;
	        };
	        Utility.getComponentName = function (context) {
	            return !context ? '' : (typeof context).toString() + '.';
	        };
	        Utility.throwException = function (e) {
	            jsCommon.Trace.error(StringExtensions.format("Throwing exception: {0}", JSON.stringify(e)), 
	            /*includeStackTrace*/ e.stack != null ? false : true);
	            throw e;
	        };
	        Utility.createClassSelector = function (className) {
	            Utility.throwIfNullOrEmptyString(className, null, 'CreateClassSelector', 'className');
	            return '.' + className;
	        };
	        Utility.createIdSelector = function (id) {
	            Utility.throwIfNullOrEmptyString(id, null, 'CreateIdSelector', 'id');
	            return '#' + id;
	        };
	        /**
	         * Creates a client-side Guid string.
	         * @returns A string representation of a Guid.
	         */
	        Utility.generateGuid = function () {
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
	        };
	        /**
	         * Try extract a cookie from {@link document.cookie} identified by key.
	         */
	        Utility.getCookieValue = function (key) {
	            // the cookie is of the format <key1=value1>; <key2=value2>. Split by ';', then by '=' 
	            // to search for the key
	            var keyValuePairs = document.cookie.split(';');
	            for (var i = 0; i < keyValuePairs.length; i++) {
	                var keyValue = keyValuePairs[i];
	                var split = keyValue.split('=');
	                if (split.length > 0 && split[0].trim() === key) {
	                    return keyValue.substr(keyValue.indexOf('=') + 1);
	                }
	            }
	            return null;
	        };
	        /**
	         * Extracts the protocol://hostname section of a url.
	         * @param url The URL from which to extract the section.
	         * @returns The protocol://hostname portion of the given URL.
	         */
	        Utility.getDomainForUrl = function (url) {
	            var hrefObject = Utility.getHrefObjectFromUrl(url);
	            return hrefObject.prop('protocol') + '//' + hrefObject.prop('hostname');
	        };
	        /**
	         * Extracts the hostname and absolute path sections of a url.
	         * @param url The URL from which to extract the section.
	         * @returns The hostname and absolute path portion of the given URL.
	         */
	        Utility.getHostNameForUrl = function (url) {
	            var hrefObject = Utility.getHrefObjectFromUrl(url);
	            return Utility.urlCombine(hrefObject.prop('hostname'), hrefObject.prop('pathname'));
	        };
	        /**
	         * Return the original url with query string stripped.
	         * @param url The URL from which to extract the section.
	         * @returns the original url with query string stripped.
	         */
	        Utility.getUrlWithoutQueryString = function (url) {
	            var hrefObject = Utility.getHrefObjectFromUrl(url);
	            return hrefObject.prop('protocol') + '//' + Utility.urlCombine(hrefObject.prop('host'), hrefObject.prop('pathname'));
	        };
	        /**
	         * Extracts the protocol section of a url.
	         * @param url The URL from which to extract the section.
	         * @returns The protocol for the current URL.
	         */
	        Utility.getProtocolFromUrl = function (url) {
	            return Utility.getHrefObjectFromUrl(url).prop('protocol').replace(':', '');
	        };
	        /**
	         * Returns a formatted href object from a URL.
	         * @param url The URL used to generate the object.
	         * @returns A jQuery object with the url.
	         */
	        Utility.getHrefObjectFromUrl = function (url) {
	            var aObject = $('<a>');
	            aObject = aObject.prop('href', url);
	            return aObject;
	        };
	        /**
	         * Converts a WCF representation of a dictionary to a JavaScript dictionary.
	         * @param wcfDictionary The WCF dictionary to convert.
	         * @returns The native JavaScript representation of this dictionary.
	         */
	        Utility.convertWcfToJsDictionary = function (wcfDictionary) {
	            // convert the WCF JSON representation of a dictionary
	            // to JS dictionary.
	            // WCF representation: [{"Key": Key, "Value": Value}..]
	            // JS representation: [Key: Value ..]
	            var result = {};
	            for (var i = 0; i < wcfDictionary.length; i++) {
	                var keyValuePair = wcfDictionary[i];
	                result[keyValuePair['Key']] = keyValuePair['Value'];
	            }
	            return result;
	        };
	        Utility.getDateFromWcfJsonString = function (jsonDate, fromUtcMilliseconds) {
	            if (StringExtensions.isNullOrEmpty(jsonDate)) {
	                return null;
	            }
	            var begIndex = jsonDate.indexOf('(');
	            var endIndex = jsonDate.indexOf(')');
	            if (begIndex !== -1 && endIndex !== -1) {
	                var milliseconds = parseInt(jsonDate.substring(begIndex + 1, endIndex), 10);
	                if (fromUtcMilliseconds) {
	                    return new Date(milliseconds);
	                }
	                else {
	                    var retValue = new Date(0);
	                    retValue.setUTCMilliseconds(milliseconds);
	                    return retValue;
	                }
	            }
	            return null;
	        };
	        /**
	         * Get the outer html of the given jquery object.
	         * @param content The jquery object.
	         * @returns The entire html representation of the object.
	         */
	        Utility.getOuterHtml = function (content) {
	            return $('<div>').append(content).html();
	        };
	        /**
	         * Comparison Method: Compares two integer numbers.
	         * @param a An integer value.
	         * @param b An integer value.
	         * @returns The comparison result.
	         */
	        Utility.compareInt = function (a, b) {
	            return a - b;
	        };
	        /**
	         * Return the index of the smallest value in a numerical array.
	         * @param a A numeric array.
	         * @returns The index of the smallest value in the array.
	         */
	        Utility.getIndexOfMinValue = function (a) {
	            var retValue = 0;
	            var currentMinValue = a[0];
	            for (var i = 0; i < a.length; i++) {
	                if (a[i] < currentMinValue) {
	                    currentMinValue = a[i];
	                    retValue = i;
	                }
	            }
	            return retValue;
	        };
	        /**
	         * Extracts a url from a background image attribute in the format of: url('www.foobar.com/image.png').
	         * @param input The value of the background-image attribute.
	         * @returns The extracted url.
	         */
	        Utility.extractUrlFromCssBackgroundImage = function (input) {
	            return input.replace(/"/g, "").replace(/url\(|\)$/ig, "");
	        };
	        /**
	         * Verifies image data url of images.
	         */
	        Utility.isValidImageDataUrl = function (url) {
	            var regex = new RegExp('data:(image\/(png|jpg|jpeg|gif|svg))');
	            return regex.test(url);
	        };
	        Utility.isLocalUrl = function (url) {
	            return _.startsWith(url, "data:") || _.startsWith(url, "blob:");
	        };
	        /**
	         * Downloads a content string as a file.
	         * @param content Content stream.
	         * @param fileName File name to use.
	         */
	        Utility.saveAsFile = function (content, fileName) {
	            var contentBlob = new Blob([content], { type: HttpConstants.ApplicationOctetStream });
	            var url = window['webkitURL'] || URL;
	            var urlLink = url.createObjectURL(contentBlob);
	            var fileNameLink = fileName || urlLink;
	            // IE support, use msSaveOrOpenBlob API
	            if (window.navigator.msSaveOrOpenBlob) {
	                window.navigator.msSaveOrOpenBlob(contentBlob, fileNameLink);
	                return;
	            }
	            // WebKit-based browser support requires generating an anchor tag with
	            // download attribute set to blob store and triggering a click event to invoke 
	            // a download to file action
	            var hyperlink = document.createElement('a');
	            hyperlink.href = urlLink;
	            hyperlink.target = '_blank';
	            hyperlink['download'] = fileNameLink;
	            document.body.appendChild(hyperlink);
	            hyperlink.click();
	            document.body.removeChild(hyperlink);
	        };
	        /**
	         * Helper method to get the simple type name from a typed object.
	         * @param obj The typed object.
	         * @returns The simple type name for the object.
	         */
	        Utility.getType = function (obj) {
	            Utility.throwIfNullEmptyOrWhitespaceString(obj.__type, this, 'getType', 'obj');
	            var parts = obj.__type.split(":");
	            if (parts.length !== 2) {
	                jsCommon.Errors.argument("obj.__type", "Type String not in expected format [Type]#[Namespace]: " + obj.__type);
	            }
	            if (parts[1] !== Utility.TypeNamespace) {
	                jsCommon.Errors.argument("obj.__type", "Type Namespace not expected: " + parts[1]);
	            }
	            return parts[0];
	        };
	        /**
	         * Check if an element supports a specific event type.
	         * @param eventName The name of the event.
	         * @param element The element to test for event support.
	         * @returns Whether the even is supported on the provided element.
	         */
	        Utility.isEventSupported = function (eventName, element) {
	            eventName = 'on' + eventName;
	            var isSupported = (eventName in element);
	            if (!isSupported) {
	                // if we can't use setAttribute try a generic element
	                if (!element.setAttribute) {
	                    element = document.createElement('div');
	                }
	                if (element.setAttribute && element.removeAttribute) {
	                    element.setAttribute(eventName, '');
	                    isSupported = typeof element[eventName] === 'function';
	                    // if the property was created - remove it
	                    if (typeof element[eventName] !== 'undefined') {
	                        element[eventName] = null;
	                    }
	                    element.removeAttribute(eventName);
	                }
	            }
	            element = null;
	            return isSupported;
	        };
	        Utility.toPixel = function (pixelAmount) {
	            Utility.throwIfNullOrUndefined(pixelAmount, this, "toPixel", "pixelAmount");
	            return pixelAmount.toString() + jsCommon.CssConstants.pixelUnits;
	        };
	        Utility.getPropertyCount = function (object) {
	            Utility.throwIfNullOrUndefined(object, this, "getPropertyCount", "object");
	            return Object.getOwnPropertyNames(object).length;
	        };
	        /**
	         * Check if an element supports a specific event type.
	         * @param filePath File path.
	         * @returns File extension.
	         */
	        Utility.getFileExtension = function (filePath) {
	            if (filePath) {
	                var index = filePath.lastIndexOf('.');
	                if (index >= 0)
	                    return filePath.substr(index + 1);
	            }
	            return '';
	        };
	        /**
	         * Extract the filename out of a full path delimited by '\' or '/'.
	         * @param filePath File path.
	         * @returns filename File name.
	         */
	        Utility.extractFileNameFromPath = function (filePath) {
	            return filePath.replace(/^.*[\\\/]/, '');
	        };
	        /**
	         * This method indicates whether window.clipboardData is supported.
	         * For example, clipboard support for Windows Store apps is currently disabled
	         * since window.clipboardData is unsupported (it raises access denied error)
	         * since clipboard in Windows Store is being
	         * achieved through Windows.ApplicationModel.DataTransfer.Clipboard class.
	         */
	        Utility.canUseClipboard = function () {
	            return (typeof MSApp === "undefined");
	        };
	        Utility.is64BitOperatingSystem = function () {
	            return navigator.userAgent.indexOf("WOW64") !== -1 ||
	                navigator.userAgent.indexOf("Win64") !== -1;
	        };
	        Utility.parseNumber = function (value, defaultValue) {
	            if (value === null)
	                return null;
	            if (value === undefined)
	                return defaultValue;
	            var result = Number(value);
	            if (isFinite(result))
	                return result;
	            if (isNaN(result) && !(typeof value === "number" || value === "NaN"))
	                return defaultValue;
	            return result;
	        };
	        Utility.getURLParamValue = function (name) {
	            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	            if (results == null) {
	                return null;
	            }
	            else {
	                return results[1] || 0;
	            }
	        };
	        /**
	         * Return local timezone.
	         * This function uses summer and winter offset to determine local time zone.
	         * The result localTimeZoneString must be a subset of the strings used by server,
	         * as documented here: https://msdn.microsoft.com/en-us/library/gg154758.aspx (Dynamic Daylight Savings Time (Compact 2013)).
	         * @return Local timezone string or UTC if timezone cannot be found.
	         */
	        Utility.getLocalTimeZoneString = function () {
	            var timeSummer = new Date(Date.UTC(2005, 6, 30, 0, 0, 0, 0));
	            var summerOffset = -1 * timeSummer.getTimezoneOffset();
	            var timeWinter = new Date(Date.UTC(2005, 12, 30, 0, 0, 0, 0));
	            var winterOffset = -1 * timeWinter.getTimezoneOffset();
	            var localTimeZoneString;
	            if (-720 === summerOffset && -720 === winterOffset) {
	                localTimeZoneString = 'Dateline Standard Time';
	            }
	            else if (-660 === summerOffset && -660 === winterOffset) {
	                localTimeZoneString = 'UTC-11';
	            }
	            else if (-660 === summerOffset && -660 === winterOffset) {
	                localTimeZoneString = 'Samoa Standard Time';
	            }
	            else if (-600 === summerOffset && -600 === winterOffset) {
	                localTimeZoneString = 'Hawaiian Standard Time';
	            }
	            else if (-480 === summerOffset && -540 === winterOffset) {
	                localTimeZoneString = 'Alaskan Standard Time';
	            }
	            else if (-420 === summerOffset && -480 === winterOffset) {
	                localTimeZoneString = 'Pacific Standard Time';
	            }
	            else if (-420 === summerOffset && -420 === winterOffset) {
	                localTimeZoneString = 'US Mountain Standard Time';
	            }
	            else if (-360 === summerOffset && -420 === winterOffset) {
	                localTimeZoneString = 'Mountain Standard Time';
	            }
	            else if (-360 === summerOffset && -360 === winterOffset) {
	                localTimeZoneString = 'Central America Standard Time';
	            }
	            else if (-300 === summerOffset && -360 === winterOffset) {
	                localTimeZoneString = 'Central Standard Time';
	            }
	            else if (-300 === summerOffset && -300 === winterOffset) {
	                localTimeZoneString = 'SA Pacific Standard Time';
	            }
	            else if (-240 === summerOffset && -300 === winterOffset) {
	                localTimeZoneString = 'Eastern Standard Time';
	            }
	            else if (-270 === summerOffset && -270 === winterOffset) {
	                localTimeZoneString = 'Venezuela Standard Time';
	            }
	            else if (-240 === summerOffset && -240 === winterOffset) {
	                localTimeZoneString = 'SA Western Standard Time';
	            }
	            else if (-240 === summerOffset && -180 === winterOffset) {
	                localTimeZoneString = 'Central Brazilian Standard Time';
	            }
	            else if (-180 === summerOffset && -240 === winterOffset) {
	                localTimeZoneString = 'Atlantic Standard Time';
	            }
	            else if (-180 === summerOffset && -180 === winterOffset) {
	                localTimeZoneString = 'Montevideo Standard Time';
	            }
	            else if (-180 === summerOffset && -120 === winterOffset) {
	                localTimeZoneString = 'E. South America Standard Time';
	            }
	            else if (-150 === summerOffset && -210 === winterOffset) {
	                localTimeZoneString = 'Mid-Atlantic Standard Time';
	            }
	            else if (-120 === summerOffset && -120 === winterOffset) {
	                localTimeZoneString = 'SA Eastern Standard Time';
	            }
	            else if (0 === summerOffset && 0 === winterOffset) {
	                localTimeZoneString = 'UTC';
	            }
	            else if (60 === summerOffset && 0 === winterOffset) {
	                localTimeZoneString = 'GMT Standard Time';
	            }
	            else if (60 === summerOffset && 120 === winterOffset) {
	                localTimeZoneString = 'Namibia Standard Time';
	            }
	            else if (120 === summerOffset && 60 === winterOffset) {
	                localTimeZoneString = 'Romance Standard Time';
	            }
	            else if (120 === summerOffset && 120 === winterOffset) {
	                localTimeZoneString = 'South Africa Standard Time';
	            }
	            else if (180 === summerOffset && 120 === winterOffset) {
	                localTimeZoneString = 'GTB Standard Time';
	            }
	            else if (180 === summerOffset && 180 === winterOffset) {
	                localTimeZoneString = 'E. Africa Standard Time';
	            }
	            else if (240 === summerOffset && 180 === winterOffset) {
	                localTimeZoneString = 'Russian Standard Time';
	            }
	            else if (240 === summerOffset && 240 === winterOffset) {
	                localTimeZoneString = 'Arabian Standard Time';
	            }
	            else if (270 === summerOffset && 210 === winterOffset) {
	                localTimeZoneString = 'Iran Standard Time';
	            }
	            else if (270 === summerOffset && 270 === winterOffset) {
	                localTimeZoneString = 'Afghanistan Standard Time';
	            }
	            else if (300 === summerOffset && 240 === winterOffset) {
	                localTimeZoneString = 'Pakistan Standard Time';
	            }
	            else if (300 === summerOffset && 300 === winterOffset) {
	                localTimeZoneString = 'West Asia Standard Time';
	            }
	            else if (330 === summerOffset && 330 === winterOffset) {
	                localTimeZoneString = 'India Standard Time';
	            }
	            else if (345 === summerOffset && 345 === winterOffset) {
	                localTimeZoneString = 'Nepal Standard Time';
	            }
	            else if (360 === summerOffset && 300 === winterOffset) {
	                localTimeZoneString = 'N. Central Asia Standard Time';
	            }
	            else if (360 === summerOffset && 360 === winterOffset) {
	                localTimeZoneString = 'Central Asia Standard Time';
	            }
	            else if (390 === summerOffset && 390 === winterOffset) {
	                localTimeZoneString = 'Myanmar Standard Time';
	            }
	            else if (420 === summerOffset && 360 === winterOffset) {
	                localTimeZoneString = 'North Asia Standard Time';
	            }
	            else if (420 === summerOffset && 420 === winterOffset) {
	                localTimeZoneString = 'SE Asia Standard Time';
	            }
	            else if (480 === summerOffset && 420 === winterOffset) {
	                localTimeZoneString = 'North Asia East Standard Time';
	            }
	            else if (480 === summerOffset && 480 === winterOffset) {
	                localTimeZoneString = 'China Standard Time';
	            }
	            else if (540 === summerOffset && 480 === winterOffset) {
	                localTimeZoneString = 'Yakutsk Standard Time';
	            }
	            else if (540 === summerOffset && 540 === winterOffset) {
	                localTimeZoneString = 'Tokyo Standard Time';
	            }
	            else if (570 === summerOffset && 570 === winterOffset) {
	                localTimeZoneString = 'Cen. Australia Standard Time';
	            }
	            else if (600 === summerOffset && 600 === winterOffset) {
	                localTimeZoneString = 'E. Australia Standard Time';
	            }
	            else if (600 === summerOffset && 660 === winterOffset) {
	                localTimeZoneString = 'AUS Eastern Standard Time';
	            }
	            else if (660 === summerOffset && 600 === winterOffset) {
	                localTimeZoneString = 'Tasmania Standard Time';
	            }
	            else if (660 === summerOffset && 660 === winterOffset) {
	                localTimeZoneString = 'West Pacific Standard Time';
	            }
	            else if (690 === summerOffset && 690 === winterOffset) {
	                localTimeZoneString = 'Central Pacific Standard Time';
	            }
	            else if (720 === summerOffset && 660 === winterOffset) {
	                localTimeZoneString = 'Magadan Standard Time';
	            }
	            else if (720 === summerOffset && 720 === winterOffset) {
	                localTimeZoneString = 'Fiji Standard Time';
	            }
	            else if (720 === summerOffset && 780 === winterOffset) {
	                localTimeZoneString = 'New Zealand Standard Time';
	            }
	            else if (780 === summerOffset && 780 === winterOffset) {
	                localTimeZoneString = 'Tonga Standard Time';
	            }
	            else {
	                localTimeZoneString = 'UTC';
	            }
	            return localTimeZoneString;
	        };
	        Utility.TypeNamespace = 'http://schemas.microsoft.com/sqlbi/2013/01/NLRuntimeService';
	        Utility.JsonContentType = 'application/json';
	        Utility.JpegContentType = 'image/jpeg';
	        Utility.XJavascriptContentType = 'application/x-javascript';
	        Utility.JsonDataType = 'json';
	        Utility.BlobDataType = 'blob';
	        Utility.HttpGetMethod = 'GET';
	        Utility.HttpPostMethod = 'POST';
	        Utility.HttpPutMethod = 'PUT';
	        Utility.HttpDeleteMethod = 'DELETE';
	        Utility.HttpContentTypeHeader = 'Content-Type';
	        Utility.HttpAcceptHeader = 'Accept';
	        Utility.Undefined = 'undefined';
	        Utility.staticContentLocation = window.location.protocol + '//' + window.location.host;
	        return Utility;
	    }());
	    jsCommon.Utility = Utility;
	    var VersionUtility = (function () {
	        function VersionUtility() {
	        }
	        /**
	         * Compares 2 version strings.
	         * @param versionA The first version string.
	         * @param versionB The second version string.
	         * @returns A result for the comparison.
	         */
	        VersionUtility.compareVersions = function (versionA, versionB) {
	            var a = versionA.split('.').map(parseFloat);
	            var b = versionB.split('.').map(parseFloat);
	            var versionParts = Math.max(a.length, b.length);
	            for (var i = 0; i < versionParts; i++) {
	                var partA = a[i] || 0;
	                var partB = b[i] || 0;
	                if (partA > partB)
	                    return 1;
	                if (partA < partB)
	                    return -1;
	            }
	            return 0;
	        };
	        return VersionUtility;
	    }());
	    jsCommon.VersionUtility = VersionUtility;
	    var PerformanceUtil;
	    (function (PerformanceUtil) {
	        var PerfMarker = (function () {
	            function PerfMarker(name) {
	                this._name = name;
	                this._start = PerfMarker.begin(name);
	            }
	            PerfMarker.begin = function (name) {
	                if (window.performance === undefined || performance.mark === undefined)
	                    return;
	                if (console.time) {
	                    console.time(name);
	                }
	                name = 'Begin ' + name;
	                performance.mark(name);
	                return name;
	            };
	            PerfMarker.prototype.end = function () {
	                if (window.performance === undefined || performance.mark === undefined || performance.measure === undefined)
	                    return;
	                var name = this._name;
	                var end = 'End ' + name;
	                performance.mark(end);
	                performance.measure(name, this._start, end);
	                if (console.timeEnd) {
	                    console.timeEnd(name);
	                }
	            };
	            return PerfMarker;
	        }());
	        PerformanceUtil.PerfMarker = PerfMarker;
	        function create(name) {
	            return new PerfMarker(name);
	        }
	        PerformanceUtil.create = create;
	    })(PerformanceUtil = jsCommon.PerformanceUtil || (jsCommon.PerformanceUtil = {}));
	    var DeferUtility;
	    (function (DeferUtility) {
	        /**
	         * Wraps a callback and returns a new function.
	         * The function can be called many times but the callback
	         * will only be executed once on the next frame.
	         * Use this to throttle big UI updates and access to DOM.
	         */
	        function deferUntilNextFrame(callback) {
	            var isWaiting, args, context;
	            if (!window.requestAnimationFrame) {
	                window.requestAnimationFrame = function (func) { return setTimeout(func, 1000 / 50); };
	            }
	            return function () {
	                if (!isWaiting) {
	                    isWaiting = true;
	                    args = arguments;
	                    context = this;
	                    window.requestAnimationFrame(function () {
	                        isWaiting = false;
	                        callback.apply(context, args);
	                    });
	                }
	            };
	        }
	        DeferUtility.deferUntilNextFrame = deferUntilNextFrame;
	    })(DeferUtility = jsCommon.DeferUtility || (jsCommon.DeferUtility = {}));
	})(jsCommon || (jsCommon = {}));

	

/***/ },

/***/ 71:
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
	var jsCommon;
	(function (jsCommon) {
	    var TraceItem = (function () {
	        function TraceItem(text, type, sessionId, requestId) {
	            this.text = text;
	            this.type = type;
	            this.sessionId = sessionId;
	            this.requestId = requestId;
	            this.timeStamp = new Date();
	        }
	        TraceItem.prototype.toString = function () {
	            var resultString = '';
	            resultString += (jsCommon.StringExtensions.format('{0} ({1}): {2}', TraceItem.traceTypeStrings[this.type], this.timeStamp.toUTCString(), this.text));
	            if (this.requestId)
	                resultString += ('\n(Request id: ' + this.requestId + ')');
	            return resultString;
	        };
	        TraceItem.traceTypeStrings = [
	            'INFORMATION',
	            'VERBOSE',
	            'WARNING',
	            'ERROR',
	            'EXPECTEDERROR',
	            'UNEXPECTEDERROR',
	            'FATAL',
	        ];
	        return TraceItem;
	    }());
	    jsCommon.TraceItem = TraceItem;
	})(jsCommon || (jsCommon = {}));

	

/***/ },

/***/ 72:
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
	var jsCommon;
	(function (jsCommon) {
	    /**
	     * Extensions for Enumerations.
	     */
	    var EnumExtensions;
	    (function (EnumExtensions) {
	        /**
	         * Gets a value indicating whether the value has the bit flags set.
	         */
	        function hasFlag(value, flag) {
	            debug.assert(!!flag, 'flag must be specified and nonzero.');
	            return (value & flag) === flag;
	        }
	        EnumExtensions.hasFlag = hasFlag;
	        /**
	         * Sets a value of a flag without modifying any other flags.
	         */
	        function setFlag(value, flag) {
	            debug.assert(!!flag, "flag must be specified and nonzero.");
	            return value |= flag;
	        }
	        EnumExtensions.setFlag = setFlag;
	        /**
	         * Resets a value of a flag without modifying any other flags.
	         */
	        function resetFlag(value, flag) {
	            debug.assert(!!flag, "flag must be specified and nonzero.");
	            return value &= ~flag;
	        }
	        EnumExtensions.resetFlag = resetFlag;
	        /**
	         * According to the TypeScript Handbook, this is safe to do.
	         */
	        function toString(enumType, value) {
	            return enumType[value];
	        }
	        EnumExtensions.toString = toString;
	    })(EnumExtensions = jsCommon.EnumExtensions || (jsCommon.EnumExtensions = {}));
	    /**
	     * Extensions to String class.
	     */
	    var StringExtensions;
	    (function (StringExtensions) {
	        /**
	         * Checks if a string ends with a sub-string.
	         */
	        function endsWith(str, suffix) {
	            debug.assertValue(str, 'str');
	            debug.assertValue(suffix, 'suffix');
	            return str.indexOf(suffix, str.length - suffix.length) !== -1;
	        }
	        StringExtensions.endsWith = endsWith;
	    })(StringExtensions = jsCommon.StringExtensions || (jsCommon.StringExtensions = {}));
	    var LogicExtensions;
	    (function (LogicExtensions) {
	        function XOR(a, b) {
	            return (a || b) && !(a && b);
	        }
	        LogicExtensions.XOR = XOR;
	    })(LogicExtensions = jsCommon.LogicExtensions || (jsCommon.LogicExtensions = {}));
	    var JsonComparer;
	    (function (JsonComparer) {
	        /**
	         * Performs JSON-style comparison of two objects.
	         */
	        function equals(x, y) {
	            if (x === y)
	                return true;
	            return JSON.stringify(x) === JSON.stringify(y);
	        }
	        JsonComparer.equals = equals;
	    })(JsonComparer = jsCommon.JsonComparer || (jsCommon.JsonComparer = {}));
	    /**
	     * Values are in terms of 'pt'
	     * Convert to pixels using PixelConverter.fromPoint
	     */
	    var TextSizeDefaults;
	    (function (TextSizeDefaults) {
	        /**
	         * Stored in terms of 'pt'
	         * Convert to pixels using PixelConverter.fromPoint
	         */
	        TextSizeDefaults.TextSizeMin = 8;
	        /**
	         * Stored in terms of 'pt'
	         * Convert to pixels using PixelConverter.fromPoint
	         */
	        TextSizeDefaults.TextSizeMax = 40;
	        var TextSizeRange = TextSizeDefaults.TextSizeMax - TextSizeDefaults.TextSizeMin;
	        /**
	         * Returns the percentage of this value relative to the TextSizeMax
	         * @param textSize - should be given in terms of 'pt'
	         */
	        function getScale(textSize) {
	            return (textSize - TextSizeDefaults.TextSizeMin) / TextSizeRange;
	        }
	        TextSizeDefaults.getScale = getScale;
	    })(TextSizeDefaults = jsCommon.TextSizeDefaults || (jsCommon.TextSizeDefaults = {}));
	    var PixelConverter;
	    (function (PixelConverter) {
	        var PxPtRatio = 4 / 3;
	        var PixelString = 'px';
	        /**
	         * Appends 'px' to the end of number value for use as pixel string in styles
	         */
	        function toString(px) {
	            return px + PixelString;
	        }
	        PixelConverter.toString = toString;
	        /**
	         * Converts point value (pt) to pixels
	         * Returns a string for font-size property
	         * e.g. fromPoint(8) => '24px'
	         */
	        function fromPoint(pt) {
	            return toString(fromPointToPixel(pt));
	        }
	        PixelConverter.fromPoint = fromPoint;
	        /**
	         * Converts point value (pt) to pixels
	         * Returns a number for font-size property
	         * e.g. fromPoint(8) => 24px
	         */
	        function fromPointToPixel(pt) {
	            return (PxPtRatio * pt);
	        }
	        PixelConverter.fromPointToPixel = fromPointToPixel;
	        /**
	         * Converts pixel value (px) to pt
	         * e.g. toPoint(24) => 8
	         */
	        function toPoint(px) {
	            return px / PxPtRatio;
	        }
	        PixelConverter.toPoint = toPoint;
	    })(PixelConverter = jsCommon.PixelConverter || (jsCommon.PixelConverter = {}));
	    var RegExpExtensions;
	    (function (RegExpExtensions) {
	        /**
	         * Runs exec on regex starting from 0 index
	         * This is the expected behavior but RegExp actually remember
	         * the last index they stopped at (found match at) and will
	         * return unexpected results when run in sequence.
	         * @param regex - regular expression object
	         * @param value - string to search wiht regex
	         * @param start - index within value to start regex
	         */
	        function run(regex, value, start) {
	            debug.assertValue(regex, 'regex');
	            regex.lastIndex = start || 0;
	            return regex.exec(value);
	        }
	        RegExpExtensions.run = run;
	    })(RegExpExtensions = jsCommon.RegExpExtensions || (jsCommon.RegExpExtensions = {}));
	})(jsCommon || (jsCommon = {}));

	

/***/ },

/***/ 291:
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
	__webpack_require__(292);

	

/***/ },

/***/ 292:
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var jsCommon = window.jsCommon;
	var powerbi = window.powerbi;
	var powerbitests = window.powerbitests;
	var InJs = window.InJs;
	var debug = window.debug;
	var jasmine = window.jasmine;
	var Microsoft = window.Microsoft;

	__webpack_require__(293);
	/// <reference path="../../../src/Clients/Typedefs/webpack/webpack-env.d.ts"/>
	/// <reference path="../../../src/Clients/Typedefs/common/window.d.ts"/>
	/// <reference path="../VisualsContracts/_references.ts"/>
	__webpack_require__(294);
	__webpack_require__(295);
	__webpack_require__(296);
	__webpack_require__(297);
	__webpack_require__(298);
	__webpack_require__(299);
	__webpack_require__(300);
	__webpack_require__(301);
	__webpack_require__(302);
	__webpack_require__(303);
	__webpack_require__(304);
	__webpack_require__(66);
	__webpack_require__(67);
	__webpack_require__(305);
	__webpack_require__(68);
	__webpack_require__(69);
	__webpack_require__(306);
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
	__webpack_require__(70);
	__webpack_require__(71);
	__webpack_require__(317);
	__webpack_require__(318);
	__webpack_require__(72);
	__webpack_require__(319);
	__webpack_require__(312);
	__webpack_require__(320);
	__webpack_require__(321);
	__webpack_require__(322);
	__webpack_require__(323);



/***/ },

/***/ 293:
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
	///<reference path="../../Typedefs/d3/d3.d.ts"/>
	///<reference path="../../Typedefs/lodash/lodash.d.ts"/> 

	

/***/ },

/***/ 294:
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
	/// <reference path="./_references.ts"/>
	var jsCommon;
	(function (jsCommon) {
	    /**
	     * DOM constants.
	     */
	    var DOMConstants;
	    (function (DOMConstants) {
	        /**
	         * Integer codes corresponding to individual keys on the keyboard.
	         */
	        DOMConstants.escKeyCode = 27;
	        DOMConstants.enterKeyCode = 13;
	        DOMConstants.tabKeyCode = 9;
	        DOMConstants.upArrowKeyCode = 38;
	        DOMConstants.downArrowKeyCode = 40;
	        DOMConstants.leftArrowKeyCode = 37;
	        DOMConstants.rightArrowKeyCode = 39;
	        DOMConstants.homeKeyCode = 36;
	        DOMConstants.endKeyCode = 35;
	        DOMConstants.backSpaceKeyCode = 8;
	        DOMConstants.deleteKeyCode = 46;
	        DOMConstants.spaceKeyCode = 32;
	        DOMConstants.shiftKeyCode = 16;
	        DOMConstants.ctrlKeyCode = 17;
	        DOMConstants.altKeyCode = 18;
	        DOMConstants.aKeyCode = 65;
	        DOMConstants.cKeyCode = 67;
	        DOMConstants.sKeyCode = 83;
	        DOMConstants.vKeyCode = 86;
	        DOMConstants.wKeyCode = 87;
	        DOMConstants.xKeyCode = 88;
	        DOMConstants.yKeyCode = 89;
	        DOMConstants.zKeyCode = 90;
	        /**
	         * DOM Elements.
	         */
	        DOMConstants.DocumentBody = 'body';
	        DOMConstants.Anchor = 'a';
	        DOMConstants.EditableTextElements = ':text, textarea';
	        DOMConstants.EditableNumericElements = '[type="number"]';
	        /**
	         * DOM Attributes and values.
	         */
	        DOMConstants.disabledAttributeOrValue = 'disabled';
	        DOMConstants.readonlyAttributeOrValue = 'readonly';
	        DOMConstants.idAttribute = 'id';
	        DOMConstants.styleAttribute = 'style';
	        DOMConstants.hrefAttribute = 'href';
	        DOMConstants.targetAttribute = 'target';
	        DOMConstants.blankValue = '_blank';
	        DOMConstants.selfValue = '_self';
	        DOMConstants.classAttribute = 'class';
	        DOMConstants.titleAttribute = 'title';
	        DOMConstants.srcAttribute = 'src';
	        /**
	         * DOM event names.
	         */
	        DOMConstants.contextmenuEventName = 'contextmenu';
	        DOMConstants.blurEventName = 'blur';
	        DOMConstants.keyUpEventName = 'keyup';
	        DOMConstants.inputEventName = 'input';
	        DOMConstants.changeEventName = 'change';
	        DOMConstants.cutEventName = 'cut';
	        DOMConstants.keyDownEventName = 'keydown';
	        DOMConstants.mouseMoveEventName = 'mousemove';
	        DOMConstants.mouseDownEventName = 'mousedown';
	        DOMConstants.mouseEnterEventName = 'mouseenter';
	        DOMConstants.mouseLeaveEventName = 'mouseleave';
	        DOMConstants.mouseOverEventName = 'mouseover';
	        DOMConstants.mouseOutEventName = 'mouseout';
	        DOMConstants.mouseClickEventName = 'click';
	        DOMConstants.pasteEventName = 'paste';
	        DOMConstants.scrollEventName = 'scroll';
	        DOMConstants.dropEventName = 'drop';
	        DOMConstants.focusEventName = 'focus';
	        DOMConstants.focusInEventName = 'focusin';
	        DOMConstants.focusOutEventName = 'focusout';
	        DOMConstants.selectEventName = 'select';
	        DOMConstants.messageEventName = 'message';
	        DOMConstants.loadEventName = 'load';
	        DOMConstants.beforeUnload = 'beforeunload';
	        /**
	         * Common DOM event combination names.
	         */
	        DOMConstants.inputAndSelectEventNames = 'input, select';
	    })(DOMConstants = jsCommon.DOMConstants || (jsCommon.DOMConstants = {}));
	})(jsCommon || (jsCommon = {}));

	

/***/ },

/***/ 295:
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
	/// <reference path="./_references.ts"/>
	var powerbi;
	(function (powerbi) {
	    powerbi.RS_AccessDeniedDueToRLSGroup = 'rsAccessDeniedDueToRLSGroup';
	    powerbi.RS_CannotRetrieveModel = 'rsCannotRetrieveModel';
	    powerbi.DMTS_NoGatewayWithAllDatasourcesToBindError = 'DMTS_NoGatewayWithAllDatasourcesToBindError';
	    powerbi.DM_GWPipeline_UnknownError = 'DM_GWPipeline_UnknownError';
	    (function (PowerBIErrorResourceType) {
	        PowerBIErrorResourceType[PowerBIErrorResourceType["ResourceCodeReference"] = 0] = "ResourceCodeReference";
	        PowerBIErrorResourceType[PowerBIErrorResourceType["EmbeddedString"] = 1] = "EmbeddedString";
	    })(powerbi.PowerBIErrorResourceType || (powerbi.PowerBIErrorResourceType = {}));
	    var PowerBIErrorResourceType = powerbi.PowerBIErrorResourceType;
	    var ServiceErrorToClientError = (function () {
	        function ServiceErrorToClientError(serviceError) {
	            this.m_serviceError = serviceError;
	        }
	        Object.defineProperty(ServiceErrorToClientError.prototype, "code", {
	            get: function () {
	                return ServiceErrorToClientError.codeName;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(ServiceErrorToClientError.prototype, "ignorable", {
	            get: function () {
	                return false;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(ServiceErrorToClientError.prototype, "requestId", {
	            get: function () {
	                return this.httpRequestId;
	            },
	            set: function (value) {
	                this.httpRequestId = value;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        ServiceErrorToClientError.prototype.getDetails = function (resourceProvider) {
	            var errorDetails;
	            if (this.m_serviceError.statusCode === 6 /* ExecuteSemanticQueryTransformError */) {
	                errorDetails = PowerBIErrorDetailHelper.GetDetailsFromTransformError(resourceProvider, this.m_serviceError);
	            }
	            else {
	                errorDetails = PowerBIErrorDetailHelper.GetDetailsFromServerError(resourceProvider, this.m_serviceError);
	            }
	            PowerBIErrorDetailHelper.addAdditionalInfo(errorDetails, this.m_serviceError.errorDetails, resourceProvider);
	            PowerBIErrorDetailHelper.addDebugErrorInfo(errorDetails, this.code, this.m_serviceError.message || null, this.m_serviceError.stackTrace || null);
	            return errorDetails;
	        };
	        ServiceErrorToClientError.codeName = 'ServiceErrorToClientError';
	        return ServiceErrorToClientError;
	    }());
	    powerbi.ServiceErrorToClientError = ServiceErrorToClientError;
	    var PowerBIErrorDetailHelper = (function () {
	        function PowerBIErrorDetailHelper() {
	        }
	        PowerBIErrorDetailHelper.addAdditionalInfo = function (errorDetails, pbiErrorDetails, localize) {
	            if (pbiErrorDetails) {
	                for (var i = 0; i < pbiErrorDetails.length; i++) {
	                    var element = pbiErrorDetails[i];
	                    var localizedCode = localize.getOptional(PowerBIErrorDetailHelper.serverErrorPrefix + element.code);
	                    var additionErrorInfoKeyValuePair = {
	                        errorInfoKey: localizedCode ? localizedCode : element.code,
	                        errorInfoValue: element.detail.type === PowerBIErrorResourceType.ResourceCodeReference ? localize.get(PowerBIErrorDetailHelper.serverErrorPrefix + element.detail.value) : element.detail.value
	                    };
	                    errorDetails.displayableErrorInfo.push(additionErrorInfoKeyValuePair);
	                }
	            }
	            return errorDetails;
	        };
	        PowerBIErrorDetailHelper.addDebugErrorInfo = function (errorDetails, errorCode, message, stackTrace) {
	            errorDetails.debugErrorInfo = errorDetails.debugErrorInfo || [];
	            if (errorCode) {
	                errorDetails.debugErrorInfo.push({ errorInfoKey: powerbi.ClientErrorStrings.ClientErrorCode, errorInfoValue: errorCode, });
	            }
	            if (message) {
	                errorDetails.debugErrorInfo.push({ errorInfoKey: powerbi.ClientErrorStrings.ErrorDetails, errorInfoValue: message, });
	            }
	            if (stackTrace) {
	                errorDetails.debugErrorInfo.push({ errorInfoKey: powerbi.ClientErrorStrings.StackTrace, errorInfoValue: stackTrace, });
	            }
	            return errorDetails;
	        };
	        PowerBIErrorDetailHelper.GetDetailsFromTransformError = function (localize, serviceError) {
	            var message = localize.get('ServiceError_CannotLoadVisual');
	            var key = localize.get('ServiceError_CannotLoadVisual');
	            var val = serviceError.message;
	            var additionalInfo = [];
	            additionalInfo.push({ errorInfoKey: key, errorInfoValue: val, });
	            var errorDetails = {
	                message: message,
	                displayableErrorInfo: additionalInfo,
	            };
	            return errorDetails;
	        };
	        PowerBIErrorDetailHelper.GetDetailsFromServerError = function (localize, serviceError) {
	            // TODO: Localize
	            var message = "";
	            var key = "";
	            var val = "";
	            var errorCodeHandled = false;
	            switch (serviceError.errorCode) {
	                case powerbi.RS_AccessDeniedDueToRLSGroup:
	                    message = localize.get('ServiceError_ModelCannotLoad');
	                    key = localize.get('ServiceError_ModelFetchingFailureKey');
	                    val = localize.get('DsrError_NoPermissionDueToRLSGroupMessage');
	                    errorCodeHandled = true;
	                    break;
	                case powerbi.RS_CannotRetrieveModel:
	                    message = localize.get('ServiceError_ModelCannotLoad');
	                    key = localize.get('ServiceError_ModelFetchingFailureKey');
	                    val = localize.get('DsrError_CanNotRetrieveModelMessage');
	                    errorCodeHandled = true;
	                    break;
	                case powerbi.DMTS_NoGatewayWithAllDatasourcesToBindError:
	                    message = localize.get('ServiceError_ModelCannotLoad');
	                    key = localize.get('ServiceError_ModelFetchingFailureKey');
	                    val = localize.get('ServerError_DM_GWPipeline_Gateway_DataSourceConnectionError');
	                    errorCodeHandled = true;
	                    break;
	                case powerbi.DM_GWPipeline_UnknownError:
	                    message = localize.get('ServiceError_ModelCannotLoad');
	                    key = localize.get('ServiceError_ModelFetchingFailureKey');
	                    val = localize.get('ServerError_DM_GWPipeline_Client_GatewayUnreachable');
	                    errorCodeHandled = true;
	                    break;
	            }
	            if (!errorCodeHandled) {
	                switch (serviceError.statusCode) {
	                    case 2 /* CsdlConvertXmlToConceptualSchema */:
	                        message = localize.get('ServiceError_ModelCannotLoad');
	                        key = localize.get('ServiceError_ModelConvertFailureKey');
	                        val = localize.get('ServiceError_ModelConvertFailureValue');
	                        break;
	                    case 3 /* CsdlCreateClientSchema */:
	                        message = localize.get('ServiceError_ModelCannotLoad');
	                        key = localize.get('ServiceError_ModelCreationFailureKey');
	                        val = localize.get('ServiceError_ModelCreationFailureValue');
	                        break;
	                    case 1 /* CsdlFetching */:
	                        message = localize.get('ServiceError_ModelCannotLoad');
	                        key = localize.get('ServiceError_ModelFetchingFailureKey');
	                        val = localize.get('ServiceError_ModelFetchingFailureValue');
	                        break;
	                    case 4 /* ExecuteSemanticQueryError */:
	                        message = localize.get('ServiceError_CannotLoadVisual');
	                        key = localize.get('ServiceError_ExecuteSemanticQueryErrorKey');
	                        val = localize.get('ServiceError_ExecuteSemanticQueryErrorValue');
	                        break;
	                    case 5 /* ExecuteSemanticQueryInvalidStreamFormat */:
	                        message = localize.get('ServiceError_CannotLoadVisual');
	                        key = localize.get('ServiceError_ExecuteSemanticQueryInvalidStreamFormatKey');
	                        val = localize.get('ServiceError_ExecuteSemanticQueryInvalidStreamFormatValue');
	                        break;
	                    case 0 /* GeneralError */:
	                    default:
	                        message = localize.get('ServiceError_GeneralError');
	                        key = localize.get('ServiceError_GeneralErrorKey');
	                        val = localize.get('ServiceError_GeneralErrorValue');
	                        break;
	                }
	            }
	            var additionalInfo = [];
	            additionalInfo.push({ errorInfoKey: key, errorInfoValue: val, });
	            var errorDetails = {
	                message: message,
	                displayableErrorInfo: additionalInfo,
	            };
	            return errorDetails;
	        };
	        PowerBIErrorDetailHelper.serverErrorPrefix = "ServerError_";
	        return PowerBIErrorDetailHelper;
	    }());
	    powerbi.PowerBIErrorDetailHelper = PowerBIErrorDetailHelper;
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 296:
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
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 297:
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
	    powerbi.CategoryTypes = {
	        Address: "Address",
	        City: "City",
	        Continent: "Continent",
	        CountryRegion: "Country",
	        County: "County",
	        Longitude: "Longitude",
	        Latitude: "Latitude",
	        Place: "Place",
	        PostalCode: "PostalCode",
	        StateOrProvince: "StateOrProvince"
	    };
	    function createGeoTaggingAnalyzerService(getLocalized) {
	        return new GeoTaggingAnalyzerService(getLocalized);
	    }
	    powerbi.createGeoTaggingAnalyzerService = createGeoTaggingAnalyzerService;
	    var EnglishBackup = {
	        GeotaggingString_Continent: "continent",
	        GeotaggingString_Continents: "continents",
	        GeotaggingString_Country: "country",
	        GeotaggingString_Countries: "countries",
	        GeotaggingString_State: "state",
	        GeotaggingString_States: "states",
	        GeotaggingString_City: "city",
	        GeotaggingString_Cities: "cities",
	        GeotaggingString_Town: "town",
	        GeotaggingString_Towns: "towns",
	        GeotaggingString_Province: "province",
	        GeotaggingString_Provinces: "provinces",
	        GeotaggingString_County: "county",
	        GeotaggingString_Counties: "counties",
	        GeotaggingString_Village: "village",
	        GeotaggingString_Villages: "villages",
	        GeotaggingString_Post: "post",
	        GeotaggingString_Zip: "zip",
	        GeotaggingString_Code: "code",
	        GeotaggingString_Place: "place",
	        GeotaggingString_Places: "places",
	        GeotaggingString_Address: "address",
	        GeotaggingString_Addresses: "addresses",
	        GeotaggingString_Street: "street",
	        GeotaggingString_Streets: "streets",
	        GeotaggingString_Longitude: "longitude",
	        GeotaggingString_Longitude_Short: "lon",
	        GeotaggingString_Longitude_Short2: "long",
	        GeotaggingString_Latitude: "latitude",
	        GeotaggingString_Latitude_Short: "lat",
	        GeotaggingString_PostalCode: "postal code",
	        GeotaggingString_PostalCodes: "postal codes",
	        GeotaggingString_ZipCode: "zip code",
	        GeotaggingString_ZipCodes: "zip codes",
	        GeotaggingString_Territory: "territory",
	        GeotaggingString_Territories: "territories",
	        GeotaggingString_VRMBackCompat_CountryRegion: "CountryRegion",
	        GeotaggingString_VRMBackCompat_StateOrProvince: "StateOrProvince",
	    };
	    var GeoTaggingAnalyzerService = (function () {
	        function GeoTaggingAnalyzerService(getLocalized) {
	            this.GeotaggingString_VRMBackCompat_CountryRegion = "CountryRegion";
	            this.GeotaggingString_VRMBackCompat_StateOrProvince = "StateOrProvince";
	            this.GeotaggingString_Continent = getLocalized("GeotaggingString_Continent").toLowerCase();
	            this.GeotaggingString_Continents = getLocalized("GeotaggingString_Continents").toLowerCase();
	            this.GeotaggingString_Country = getLocalized("GeotaggingString_Country").toLowerCase();
	            this.GeotaggingString_Countries = getLocalized("GeotaggingString_Countries").toLowerCase();
	            this.GeotaggingString_State = getLocalized("GeotaggingString_State").toLowerCase();
	            this.GeotaggingString_States = getLocalized("GeotaggingString_States").toLowerCase();
	            this.GeotaggingString_City = getLocalized("GeotaggingString_City").toLowerCase();
	            this.GeotaggingString_Cities = getLocalized("GeotaggingString_Cities").toLowerCase();
	            this.GeotaggingString_Town = getLocalized("GeotaggingString_Town").toLowerCase();
	            this.GeotaggingString_Towns = getLocalized("GeotaggingString_Towns").toLowerCase();
	            this.GeotaggingString_Province = getLocalized("GeotaggingString_Province").toLowerCase();
	            this.GeotaggingString_Provinces = getLocalized("GeotaggingString_Provinces").toLowerCase();
	            this.GeotaggingString_County = getLocalized("GeotaggingString_County").toLowerCase();
	            this.GeotaggingString_Counties = getLocalized("GeotaggingString_Counties").toLowerCase();
	            this.GeotaggingString_Village = getLocalized("GeotaggingString_Village").toLowerCase();
	            this.GeotaggingString_Villages = getLocalized("GeotaggingString_Villages").toLowerCase();
	            this.GeotaggingString_Post = getLocalized("GeotaggingString_Post").toLowerCase();
	            this.GeotaggingString_Zip = getLocalized("GeotaggingString_Zip").toLowerCase();
	            this.GeotaggingString_Code = getLocalized("GeotaggingString_Code").toLowerCase();
	            this.GeotaggingString_Place = getLocalized("GeotaggingString_Place").toLowerCase();
	            this.GeotaggingString_Places = getLocalized("GeotaggingString_Places").toLowerCase();
	            this.GeotaggingString_Address = getLocalized("GeotaggingString_Address").toLowerCase();
	            this.GeotaggingString_Addresses = getLocalized("GeotaggingString_Addresses").toLowerCase();
	            this.GeotaggingString_Street = getLocalized("GeotaggingString_Street").toLowerCase();
	            this.GeotaggingString_Streets = getLocalized("GeotaggingString_Streets").toLowerCase();
	            this.GeotaggingString_Longitude = getLocalized("GeotaggingString_Longitude").toLowerCase();
	            this.GeotaggingString_Longitude_Short = getLocalized("GeotaggingString_Longitude_Short").toLowerCase();
	            this.GeotaggingString_Longitude_Short2 = getLocalized("GeotaggingString_Longitude_Short2").toLowerCase();
	            this.GeotaggingString_Latitude = getLocalized("GeotaggingString_Latitude").toLowerCase();
	            this.GeotaggingString_Latitude_Short = getLocalized("GeotaggingString_Latitude_Short").toLowerCase();
	            this.GeotaggingString_PostalCode = getLocalized("GeotaggingString_PostalCode").toLowerCase();
	            this.GeotaggingString_PostalCodes = getLocalized("GeotaggingString_PostalCodes").toLowerCase();
	            this.GeotaggingString_ZipCode = getLocalized("GeotaggingString_ZipCode").toLowerCase();
	            this.GeotaggingString_ZipCodes = getLocalized("GeotaggingString_ZipCodes").toLowerCase();
	            this.GeotaggingString_Territory = getLocalized("GeotaggingString_Territory").toLowerCase();
	            this.GeotaggingString_Territories = getLocalized("GeotaggingString_Territories").toLowerCase();
	        }
	        GeoTaggingAnalyzerService.prototype.isLongitudeOrLatitude = function (fieldRefName) {
	            return this.isLongitude(fieldRefName) ||
	                this.isLatitude(fieldRefName);
	        };
	        GeoTaggingAnalyzerService.prototype.isGeographic = function (fieldRefName) {
	            return this.isLongitudeOrLatitude(fieldRefName) ||
	                this.isGeocodable(fieldRefName);
	        };
	        GeoTaggingAnalyzerService.prototype.isGeocodable = function (fieldRefName) {
	            return this.isAddress(fieldRefName) ||
	                this.isCity(fieldRefName) ||
	                this.isContinent(fieldRefName) ||
	                this.isCountry(fieldRefName) ||
	                this.isCounty(fieldRefName) ||
	                this.isStateOrProvince(fieldRefName) ||
	                this.isPlace(fieldRefName) ||
	                this.isPostalCode(fieldRefName) ||
	                this.isTerritory(fieldRefName);
	        };
	        GeoTaggingAnalyzerService.prototype.isGeoshapable = function (fieldRefName) {
	            return this.isCity(fieldRefName) ||
	                this.isCountry(fieldRefName) ||
	                this.isCounty(fieldRefName) ||
	                this.isStateOrProvince(fieldRefName) ||
	                this.isPostalCode(fieldRefName) ||
	                this.isTerritory(fieldRefName) ||
	                this.isGeoshapableEnglish(fieldRefName);
	        };
	        GeoTaggingAnalyzerService.prototype.isGeoshapableEnglish = function (fieldRefName) {
	            return this.isEnglishCity(fieldRefName) ||
	                this.isEnglishCountry(fieldRefName) ||
	                this.isEnglishCounty(fieldRefName) ||
	                this.isEnglishStateOrProvince(fieldRefName) ||
	                this.isEnglishPostalCode(fieldRefName) ||
	                this.isEnglishTerritory(fieldRefName);
	        };
	        GeoTaggingAnalyzerService.prototype.isAddress = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                this.GeotaggingString_Address,
	                this.GeotaggingString_Addresses,
	                this.GeotaggingString_Street,
	                this.GeotaggingString_Streets
	            ]);
	        };
	        GeoTaggingAnalyzerService.prototype.isPlace = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                this.GeotaggingString_Place,
	                this.GeotaggingString_Places
	            ]);
	        };
	        GeoTaggingAnalyzerService.prototype.isCity = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                this.GeotaggingString_City,
	                this.GeotaggingString_Cities,
	                this.GeotaggingString_Town,
	                this.GeotaggingString_Towns,
	                this.GeotaggingString_Village,
	                this.GeotaggingString_Villages
	            ]);
	        };
	        GeoTaggingAnalyzerService.prototype.isStateOrProvince = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                this.GeotaggingString_State,
	                this.GeotaggingString_States,
	                this.GeotaggingString_Province,
	                this.GeotaggingString_Provinces,
	                this.GeotaggingString_VRMBackCompat_StateOrProvince,
	            ]);
	        };
	        GeoTaggingAnalyzerService.prototype.isCountry = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                this.GeotaggingString_Country,
	                this.GeotaggingString_Countries,
	                this.GeotaggingString_VRMBackCompat_CountryRegion
	            ]);
	        };
	        GeoTaggingAnalyzerService.prototype.isCounty = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                this.GeotaggingString_County,
	                this.GeotaggingString_Counties
	            ]);
	        };
	        GeoTaggingAnalyzerService.prototype.isContinent = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                this.GeotaggingString_Continent,
	                this.GeotaggingString_Continents
	            ]);
	        };
	        GeoTaggingAnalyzerService.prototype.isPostalCode = function (fieldRefName) {
	            var result = (GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                this.GeotaggingString_Post,
	                this.GeotaggingString_Zip])
	                && GeoTaggingAnalyzerService.hasMatches(fieldRefName, [this.GeotaggingString_Code])) ||
	                GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                    this.GeotaggingString_PostalCode,
	                    this.GeotaggingString_PostalCodes,
	                    this.GeotaggingString_ZipCode,
	                    this.GeotaggingString_ZipCodes
	                ]);
	            //Check again for strings without whitespace
	            if (!result) {
	                var whiteSpaceRegex = /\s+/;
	                var fieldNameWithoutWhitespace = fieldRefName.replace(whiteSpaceRegex, "");
	                result = GeoTaggingAnalyzerService.hasMatches(fieldNameWithoutWhitespace, [
	                    this.GeotaggingString_PostalCode.replace(whiteSpaceRegex, ''),
	                    this.GeotaggingString_PostalCodes.replace(whiteSpaceRegex, ''),
	                    this.GeotaggingString_ZipCode.replace(whiteSpaceRegex, ''),
	                    this.GeotaggingString_ZipCodes.replace(whiteSpaceRegex, '')
	                ]);
	            }
	            return result;
	        };
	        GeoTaggingAnalyzerService.prototype.isLongitude = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [this.GeotaggingString_Longitude])
	                || GeoTaggingAnalyzerService.hasMatches(fieldRefName, [this.GeotaggingString_Longitude_Short], true /* useStrict */)
	                || GeoTaggingAnalyzerService.hasMatches(fieldRefName, [this.GeotaggingString_Longitude_Short2], true /* useStrict */);
	        };
	        GeoTaggingAnalyzerService.prototype.isLatitude = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [this.GeotaggingString_Latitude])
	                || GeoTaggingAnalyzerService.hasMatches(fieldRefName, [this.GeotaggingString_Latitude_Short], true /* useStrict */);
	        };
	        GeoTaggingAnalyzerService.prototype.isTerritory = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                this.GeotaggingString_Territory,
	                this.GeotaggingString_Territories
	            ]);
	        };
	        GeoTaggingAnalyzerService.hasMatches = function (fieldName, possibleMatches, useStrict) {
	            var nonWordRegex = /\W/;
	            var value = fieldName.toLowerCase();
	            for (var i = 0, len = possibleMatches.length; i < len; i++) {
	                var possibleMatch = possibleMatches[i].toLowerCase();
	                if (!useStrict) {
	                    if (value.indexOf(possibleMatch) > -1)
	                        return true;
	                }
	                else {
	                    var indexofpossibleMatch = value.indexOf(possibleMatch);
	                    if (indexofpossibleMatch > -1) {
	                        var wordEndFlag = void 0, wordBeginFlag = void 0;
	                        wordEndFlag = wordBeginFlag = true;
	                        if (indexofpossibleMatch - 1 > 0)
	                            wordBeginFlag = nonWordRegex.test(value[indexofpossibleMatch - 1]);
	                        if (indexofpossibleMatch + possibleMatch.length < value.length)
	                            wordEndFlag = nonWordRegex.test(value[indexofpossibleMatch + possibleMatch.length]);
	                        if (wordBeginFlag && wordEndFlag)
	                            return true;
	                    }
	                }
	            }
	            return false;
	        };
	        GeoTaggingAnalyzerService.prototype.getFieldType = function (fieldName) {
	            if (fieldName == null)
	                return undefined;
	            if (this.isLatitude(fieldName))
	                return powerbi.CategoryTypes.Latitude;
	            if (this.isLongitude(fieldName))
	                return powerbi.CategoryTypes.Longitude;
	            if (this.isPostalCode(fieldName))
	                return powerbi.CategoryTypes.PostalCode;
	            if (this.isAddress(fieldName))
	                return powerbi.CategoryTypes.Address;
	            if (this.isPlace(fieldName))
	                return powerbi.CategoryTypes.Place;
	            if (this.isCity(fieldName))
	                return powerbi.CategoryTypes.City;
	            if (this.isCountry(fieldName))
	                return powerbi.CategoryTypes.CountryRegion;
	            if (this.isCounty(fieldName))
	                return powerbi.CategoryTypes.County;
	            if (this.isStateOrProvince(fieldName))
	                return powerbi.CategoryTypes.StateOrProvince;
	            if (this.isContinent(fieldName))
	                return powerbi.CategoryTypes.Continent;
	            return this.getEnglishFieldType(fieldName);
	        };
	        GeoTaggingAnalyzerService.prototype.isEnglishAddress = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                EnglishBackup.GeotaggingString_Address,
	                EnglishBackup.GeotaggingString_Addresses,
	                EnglishBackup.GeotaggingString_Street,
	                EnglishBackup.GeotaggingString_Streets
	            ]);
	        };
	        GeoTaggingAnalyzerService.prototype.isEnglishPlace = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                EnglishBackup.GeotaggingString_Place,
	                EnglishBackup.GeotaggingString_Places
	            ]);
	        };
	        GeoTaggingAnalyzerService.prototype.isEnglishCity = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                EnglishBackup.GeotaggingString_City,
	                EnglishBackup.GeotaggingString_Cities,
	                EnglishBackup.GeotaggingString_Town,
	                EnglishBackup.GeotaggingString_Towns,
	                EnglishBackup.GeotaggingString_Village,
	                EnglishBackup.GeotaggingString_Villages
	            ]);
	        };
	        GeoTaggingAnalyzerService.prototype.isEnglishStateOrProvince = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                EnglishBackup.GeotaggingString_State,
	                EnglishBackup.GeotaggingString_States,
	                EnglishBackup.GeotaggingString_Province,
	                EnglishBackup.GeotaggingString_Provinces,
	                EnglishBackup.GeotaggingString_VRMBackCompat_StateOrProvince,
	            ]);
	        };
	        GeoTaggingAnalyzerService.prototype.isEnglishCountry = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                EnglishBackup.GeotaggingString_Country,
	                EnglishBackup.GeotaggingString_Countries,
	                EnglishBackup.GeotaggingString_VRMBackCompat_CountryRegion
	            ]);
	        };
	        GeoTaggingAnalyzerService.prototype.isEnglishCounty = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                EnglishBackup.GeotaggingString_County,
	                EnglishBackup.GeotaggingString_Counties
	            ]);
	        };
	        GeoTaggingAnalyzerService.prototype.isEnglishContinent = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                EnglishBackup.GeotaggingString_Continent,
	                EnglishBackup.GeotaggingString_Continents
	            ]);
	        };
	        GeoTaggingAnalyzerService.prototype.isEnglishPostalCode = function (fieldRefName) {
	            var result = (GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                EnglishBackup.GeotaggingString_Post,
	                EnglishBackup.GeotaggingString_Zip])
	                && GeoTaggingAnalyzerService.hasMatches(fieldRefName, [this.GeotaggingString_Code])) ||
	                GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                    EnglishBackup.GeotaggingString_PostalCode,
	                    EnglishBackup.GeotaggingString_PostalCodes,
	                    EnglishBackup.GeotaggingString_ZipCode,
	                    EnglishBackup.GeotaggingString_ZipCodes
	                ]);
	            //Check again for strings without whitespace
	            if (!result) {
	                var whiteSpaceRegexPattern = new RegExp('\s');
	                result = GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                    EnglishBackup.GeotaggingString_PostalCode.replace(whiteSpaceRegexPattern, ''),
	                    EnglishBackup.GeotaggingString_PostalCodes.replace(whiteSpaceRegexPattern, ''),
	                    EnglishBackup.GeotaggingString_ZipCode.replace(whiteSpaceRegexPattern, ''),
	                    EnglishBackup.GeotaggingString_ZipCodes.replace(whiteSpaceRegexPattern, '')
	                ]);
	            }
	            return result;
	        };
	        GeoTaggingAnalyzerService.prototype.isEnglishLongitude = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [EnglishBackup.GeotaggingString_Longitude])
	                || GeoTaggingAnalyzerService.hasMatches(fieldRefName, [EnglishBackup.GeotaggingString_Longitude_Short], true /* useStrict */)
	                || GeoTaggingAnalyzerService.hasMatches(fieldRefName, [EnglishBackup.GeotaggingString_Longitude_Short2], true /* useStrict */);
	        };
	        GeoTaggingAnalyzerService.prototype.isEnglishLatitude = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [EnglishBackup.GeotaggingString_Latitude])
	                || GeoTaggingAnalyzerService.hasMatches(fieldRefName, [EnglishBackup.GeotaggingString_Latitude_Short], true /* useStrict */);
	        };
	        GeoTaggingAnalyzerService.prototype.isEnglishTerritory = function (fieldRefName) {
	            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
	                EnglishBackup.GeotaggingString_Territory,
	                EnglishBackup.GeotaggingString_Territories
	            ]);
	        };
	        GeoTaggingAnalyzerService.prototype.getEnglishFieldType = function (fieldName) {
	            if (fieldName == null)
	                return undefined;
	            if (this.isEnglishLatitude(fieldName))
	                return powerbi.CategoryTypes.Latitude;
	            if (this.isEnglishLongitude(fieldName))
	                return powerbi.CategoryTypes.Longitude;
	            if (this.isEnglishPostalCode(fieldName))
	                return powerbi.CategoryTypes.PostalCode;
	            if (this.isEnglishAddress(fieldName))
	                return powerbi.CategoryTypes.Address;
	            if (this.isEnglishPlace(fieldName))
	                return powerbi.CategoryTypes.Place;
	            if (this.isEnglishCity(fieldName))
	                return powerbi.CategoryTypes.City;
	            if (this.isEnglishCountry(fieldName))
	                return powerbi.CategoryTypes.CountryRegion;
	            if (this.isEnglishCounty(fieldName))
	                return powerbi.CategoryTypes.County;
	            if (this.isEnglishStateOrProvince(fieldName))
	                return powerbi.CategoryTypes.StateOrProvince;
	            if (this.isEnglishContinent(fieldName))
	                return powerbi.CategoryTypes.Continent;
	            return undefined;
	        };
	        return GeoTaggingAnalyzerService;
	    }());
	    powerbi.GeoTaggingAnalyzerService = GeoTaggingAnalyzerService;
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 298:
/***/ function(module, exports, __webpack_require__) {

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
	if (false)
	    var DEBUG = true;

	

/***/ },

/***/ 299:
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
	/// <reference path="./_references.ts"/>
	var powerbi;
	(function (powerbi) {
	    /**
	     * Unlocalized strings to be used for error reporting.
	     */
	    var ClientErrorStrings;
	    (function (ClientErrorStrings) {
	        ClientErrorStrings.ClientErrorCode = 'Client Error Code';
	        ClientErrorStrings.ErrorCode = 'Error Code';
	        ClientErrorStrings.ErrorDetails = 'Error Details';
	        ClientErrorStrings.HttpRequestId = 'HTTP Request Id';
	        ClientErrorStrings.JobId = 'Job Id';
	        ClientErrorStrings.ODataErrorMessage = 'OData Error Message';
	        ClientErrorStrings.StackTrace = 'Stack Trace';
	    })(ClientErrorStrings = powerbi.ClientErrorStrings || (powerbi.ClientErrorStrings = {}));
	    /**
	     this base class should be derived to give a generic error message but with a unique error code.
	     */
	    var UnknownClientError = (function () {
	        function UnknownClientError(code) {
	            debug.assertValue(code, 'code');
	            this.errorCode = code;
	        }
	        Object.defineProperty(UnknownClientError.prototype, "code", {
	            get: function () {
	                return this.errorCode;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(UnknownClientError.prototype, "ignorable", {
	            get: function () {
	                return false;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        UnknownClientError.prototype.getDetails = function (resourceProvider) {
	            var details = {
	                message: resourceProvider.get('ClientError_UnknownClientErrorValue'),
	                displayableErrorInfo: [{ errorInfoKey: resourceProvider.get('ClientError_UnknownClientErrorKey'), errorInfoValue: resourceProvider.get('ClientError_UnknownClientErrorValue'), }],
	                debugErrorInfo: [{ errorInfoKey: ClientErrorStrings.ClientErrorCode, errorInfoValue: this.code, }],
	            };
	            return details;
	        };
	        return UnknownClientError;
	    }());
	    powerbi.UnknownClientError = UnknownClientError;
	    var HttpClientError = (function () {
	        function HttpClientError(httpStatusCode, requestId) {
	            debug.assertValue(httpStatusCode, 'httpStatusCode');
	            debug.assertValue(requestId, 'requestId');
	            this.httpStatusCode = httpStatusCode;
	            this.httpRequestId = requestId;
	        }
	        Object.defineProperty(HttpClientError.prototype, "code", {
	            get: function () {
	                return 'HttpClientError';
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(HttpClientError.prototype, "ignorable", {
	            get: function () {
	                return false;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(HttpClientError.prototype, "requestId", {
	            get: function () {
	                return this.httpRequestId;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        HttpClientError.prototype.getDetails = function (resourceProvider) {
	            // Use a general error message for a HTTP request failure, since we currently do not know of any specifc error cases at this point in time.
	            var details = {
	                message: null,
	                displayableErrorInfo: [
	                    { errorInfoKey: resourceProvider.get('DsrError_Key'), errorInfoValue: resourceProvider.get('DsrError_UnknownErrorValue') },
	                    { errorInfoKey: resourceProvider.get('ClientError_HttpResponseStatusCodeKey'), errorInfoValue: this.httpStatusCode.toString() }],
	                debugErrorInfo: [
	                    { errorInfoKey: ClientErrorStrings.HttpRequestId, errorInfoValue: this.httpRequestId },
	                    { errorInfoKey: ClientErrorStrings.ClientErrorCode, errorInfoValue: this.code }
	                ],
	            };
	            return details;
	        };
	        return HttpClientError;
	    }());
	    powerbi.HttpClientError = HttpClientError;
	    var IgnorableClientError = (function () {
	        function IgnorableClientError() {
	        }
	        Object.defineProperty(IgnorableClientError.prototype, "code", {
	            get: function () {
	                return 'IgnorableClientError';
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(IgnorableClientError.prototype, "ignorable", {
	            get: function () {
	                return true;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        IgnorableClientError.prototype.getDetails = function (resourceProvider) {
	            var details = {
	                message: '',
	                displayableErrorInfo: [],
	            };
	            return details;
	        };
	        return IgnorableClientError;
	    }());
	    powerbi.IgnorableClientError = IgnorableClientError;
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 300:
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
	/// <reference path="./_references.ts"/>
	var jsCommon;
	(function (jsCommon) {
	    var ArrayExtensions;
	    (function (ArrayExtensions) {
	        /**
	         * Returns items that exist in target and other.
	         */
	        function intersect(target, other) {
	            var result = [];
	            for (var i = target.length - 1; i >= 0; --i) {
	                if (other.indexOf(target[i]) !== -1) {
	                    result.push(target[i]);
	                }
	            }
	            return result;
	        }
	        ArrayExtensions.intersect = intersect;
	        /**
	         * Return elements exists in target but not exists in other.
	         */
	        function diff(target, other) {
	            var result = [];
	            for (var i = target.length - 1; i >= 0; --i) {
	                var value = target[i];
	                if (other.indexOf(value) === -1) {
	                    result.push(value);
	                }
	            }
	            return result;
	        }
	        ArrayExtensions.diff = diff;
	        /**
	         * Return an array with only the distinct items in the source.
	         */
	        function distinct(source) {
	            var result = [];
	            for (var i = 0, len = source.length; i < len; i++) {
	                var value = source[i];
	                if (result.indexOf(value) === -1) {
	                    result.push(value);
	                }
	            }
	            return result;
	        }
	        ArrayExtensions.distinct = distinct;
	        /**
	         * Pushes content of source onto target,
	         * for parts of course that do not already exist in target.
	         */
	        function union(target, source) {
	            for (var i = 0, len = source.length; i < len; ++i) {
	                unionSingle(target, source[i]);
	            }
	        }
	        ArrayExtensions.union = union;
	        /**
	         * Pushes value onto target, if value does not already exist in target.
	         */
	        function unionSingle(target, value) {
	            if (target.indexOf(value) < 0) {
	                target.push(value);
	            }
	        }
	        ArrayExtensions.unionSingle = unionSingle;
	        /**
	         * Returns an array with a range of items from source,
	         * including the startIndex & endIndex.
	         */
	        function range(source, startIndex, endIndex) {
	            debug.assert(startIndex >= 0 && startIndex < source.length, 'startIndex is out of range.');
	            debug.assert(endIndex >= 0 && endIndex < source.length, 'endIndex is out of range.');
	            var result = [];
	            for (var i = startIndex; i <= endIndex; ++i) {
	                result.push(source[i]);
	            }
	            return result;
	        }
	        ArrayExtensions.range = range;
	        /**
	         * Returns an array that includes items from source, up to the specified count.
	         */
	        function take(source, count) {
	            debug.assert(count >= 0, 'Count is negative.');
	            debug.assert(count <= source.length, 'Count is too large.');
	            var result = [];
	            for (var i = 0; i < count; ++i) {
	                result.push(source[i]);
	            }
	            return result;
	        }
	        ArrayExtensions.take = take;
	        function copy(source) {
	            debug.assertValue(source, 'source');
	            return take(source, source.length);
	        }
	        ArrayExtensions.copy = copy;
	        /**
	         * Returns a value indicating whether the arrays have the same values in the same sequence.
	         */
	        function sequenceEqual(left, right, comparison) {
	            debug.assertValue(comparison, 'comparison');
	            // Normalize falsy to null
	            if (!left) {
	                left = null;
	            }
	            if (!right) {
	                right = null;
	            }
	            if (left === right) {
	                return true;
	            }
	            if (!!left !== !!right) {
	                return false;
	            }
	            var len = left.length;
	            if (len !== right.length) {
	                return false;
	            }
	            var i = 0;
	            while (i < len && comparison(left[i], right[i])) {
	                ++i;
	            }
	            return i === len;
	        }
	        ArrayExtensions.sequenceEqual = sequenceEqual;
	        /**
	         * Returns null if the specified array is empty.
	         * Otherwise returns the specified array.
	         */
	        function emptyToNull(array) {
	            if (array && array.length === 0) {
	                return null;
	            }
	            return array;
	        }
	        ArrayExtensions.emptyToNull = emptyToNull;
	        function indexOf(array, predicate) {
	            debug.assertValue(array, 'array');
	            debug.assertValue(predicate, 'predicate');
	            for (var i = 0, len = array.length; i < len; ++i) {
	                if (predicate(array[i])) {
	                    return i;
	                }
	            }
	            return -1;
	        }
	        ArrayExtensions.indexOf = indexOf;
	        /**
	         * Returns a copy of the array rotated by the specified offset.
	         */
	        function rotate(array, offset) {
	            if (offset === 0)
	                return array.slice();
	            var rotated = array.slice(offset);
	            Array.prototype.push.apply(rotated, array.slice(0, offset));
	            return rotated;
	        }
	        ArrayExtensions.rotate = rotate;
	        function createWithId() {
	            return extendWithId([]);
	        }
	        ArrayExtensions.createWithId = createWithId;
	        function extendWithId(array) {
	            debug.assertValue(array, 'array');
	            var extended = array;
	            extended.withId = withId;
	            return extended;
	        }
	        ArrayExtensions.extendWithId = extendWithId;
	        /**
	         * Finds and returns the first item with a matching ID.
	         */
	        function findWithId(array, id) {
	            for (var i = 0, len = array.length; i < len; i++) {
	                var item = array[i];
	                if (item.id === id)
	                    return item;
	            }
	        }
	        ArrayExtensions.findWithId = findWithId;
	        function withId(id) {
	            return ArrayExtensions.findWithId(this, id);
	        }
	        function createWithName() {
	            return extendWithName([]);
	        }
	        ArrayExtensions.createWithName = createWithName;
	        function extendWithName(array) {
	            debug.assertValue(array, 'array');
	            var extended = array;
	            extended.withName = withName;
	            return extended;
	        }
	        ArrayExtensions.extendWithName = extendWithName;
	        function findItemWithName(array, name) {
	            var index = indexWithName(array, name);
	            if (index >= 0)
	                return array[index];
	        }
	        ArrayExtensions.findItemWithName = findItemWithName;
	        function indexWithName(array, name) {
	            for (var i = 0, len = array.length; i < len; i++) {
	                var item = array[i];
	                if (item.name === name)
	                    return i;
	            }
	            return -1;
	        }
	        ArrayExtensions.indexWithName = indexWithName;
	        /**
	         * Inserts a number in sorted order into a list of numbers already in sorted order.
	         * @returns True if the item was added, false if it already existed.
	         */
	        function insertSorted(list, value) {
	            debug.assertValue(list, 'list');
	            debug.assertValue(value, 'value');
	            var len = list.length;
	            // NOTE: iterate backwards because incoming values tend to be sorted already.
	            for (var i = len - 1; i >= 0; i--) {
	                var diff_1 = list[i] - value;
	                if (diff_1 === 0)
	                    return false;
	                if (diff_1 > 0)
	                    continue;
	                // diff < 0
	                list.splice(i + 1, 0, value);
	                return true;
	            }
	            list.unshift(value);
	            return true;
	        }
	        ArrayExtensions.insertSorted = insertSorted;
	        /**
	         * Removes the first occurrence of a value from a list if it exists.
	         * @returns True if the value was removed, false if it did not exist in the list.
	         */
	        function removeFirst(list, value) {
	            var index = list.indexOf(value);
	            if (index < 0)
	                return false;
	            list.splice(index, 1);
	            return true;
	        }
	        ArrayExtensions.removeFirst = removeFirst;
	        /**
	         * Finds and returns the first item with a matching name.
	         */
	        function withName(name) {
	            var array = this;
	            return findItemWithName(array, name);
	        }
	        /**
	         * Deletes all items from the array.
	         */
	        function clear(array) {
	            if (!array)
	                return;
	            while (array.length > 0)
	                array.pop();
	        }
	        ArrayExtensions.clear = clear;
	        function isUndefinedOrEmpty(array) {
	            if (!array || array.length === 0) {
	                return true;
	            }
	            return false;
	        }
	        ArrayExtensions.isUndefinedOrEmpty = isUndefinedOrEmpty;
	        function swap(array, firstIndex, secondIndex) {
	            var temp = array[firstIndex];
	            array[firstIndex] = array[secondIndex];
	            array[secondIndex] = temp;
	        }
	        ArrayExtensions.swap = swap;
	        function isInArray(array, lookupItem, compareCallback) {
	            return _.any(array, function (item) { return compareCallback(item, lookupItem); });
	        }
	        ArrayExtensions.isInArray = isInArray;
	        /** Checks if the given object is an Array, and looking all the way up the prototype chain. */
	        function isArrayOrInheritedArray(obj) {
	            debug.assertValue(obj, 'obj');
	            var nextPrototype = obj;
	            while (nextPrototype != null) {
	                if (_.isArray(nextPrototype))
	                    return true;
	                nextPrototype = Object.getPrototypeOf(nextPrototype);
	            }
	            return false;
	        }
	        ArrayExtensions.isArrayOrInheritedArray = isArrayOrInheritedArray;
	        /**
	         * Returns true if the specified values array is sorted in an order as determined by the specified compareFunction.
	         */
	        function isSorted(values, compareFunction) {
	            debug.assertValue(values, 'values');
	            debug.assertValue(compareFunction, 'compareFunction');
	            var ilen = values.length;
	            if (ilen >= 2) {
	                for (var i = 1; i < ilen; i++) {
	                    if (compareFunction(values[i - 1], values[i]) > 0) {
	                        return false;
	                    }
	                }
	            }
	            return true;
	        }
	        ArrayExtensions.isSorted = isSorted;
	        /**
	         * Returns true if the specified number values array is sorted in ascending order
	         * (or descending order if the specified descendingOrder is truthy).
	         */
	        function isSortedNumeric(values, descendingOrder) {
	            debug.assertValue(values, 'values');
	            debug.assertAnyValue(descendingOrder, 'descendingOrder');
	            var compareFunction = descendingOrder ?
	                function (a, b) { return b - a; } :
	                function (a, b) { return a - b; };
	            return isSorted(values, compareFunction);
	        }
	        ArrayExtensions.isSortedNumeric = isSortedNumeric;
	    })(ArrayExtensions = jsCommon.ArrayExtensions || (jsCommon.ArrayExtensions = {}));
	})(jsCommon || (jsCommon = {}));

	

/***/ },

/***/ 301:
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
	var InJs;
	(function (InJs) {
	    var DomFactory;
	    (function (DomFactory) {
	        function div() {
	            return $('<div/>');
	        }
	        DomFactory.div = div;
	        function span() {
	            return $('<span/>');
	        }
	        DomFactory.span = span;
	        function checkbox() {
	            return $('<input type="checkbox"/>');
	        }
	        DomFactory.checkbox = checkbox;
	        function ul() {
	            return $('<ul/>');
	        }
	        DomFactory.ul = ul;
	        function li() {
	            return $('<li/>');
	        }
	        DomFactory.li = li;
	        function button() {
	            return $('<input type="button"/>');
	        }
	        DomFactory.button = button;
	        function select() {
	            return $('<select/>');
	        }
	        DomFactory.select = select;
	        function textBox() {
	            return $('<input type="text"/>');
	        }
	        DomFactory.textBox = textBox;
	        function img() {
	            return $('<img/>');
	        }
	        DomFactory.img = img;
	        function iframe() {
	            return $('<iframe/>');
	        }
	        DomFactory.iframe = iframe;
	    })(DomFactory = InJs.DomFactory || (InJs.DomFactory = {}));
	})(InJs || (InJs = {}));

	

/***/ },

/***/ 302:
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
	/// <reference path="./_references.ts"/>
	var powerbi;
	(function (powerbi) {
	    /**
	     * Module Double contains a set of constants and precision based utility methods
	     * for dealing with doubles and their decimal garbage in the javascript.
	     */
	    var Double;
	    (function (Double) {
	        // Constants.
	        Double.MIN_VALUE = -Number.MAX_VALUE;
	        Double.MAX_VALUE = Number.MAX_VALUE;
	        Double.MIN_EXP = -308;
	        Double.MAX_EXP = 308;
	        Double.EPSILON = 1E-323;
	        Double.DEFAULT_PRECISION = 0.0001;
	        Double.DEFAULT_PRECISION_IN_DECIMAL_DIGITS = 12;
	        Double.LOG_E_10 = Math.log(10);
	        Double.POSITIVE_POWERS = [
	            1E0, 1E1, 1E2, 1E3, 1E4, 1E5, 1E6, 1E7, 1E8, 1E9, 1E10, 1E11, 1E12, 1E13, 1E14, 1E15, 1E16, 1E17, 1E18, 1E19, 1E20, 1E21, 1E22, 1E23, 1E24, 1E25, 1E26, 1E27, 1E28, 1E29, 1E30, 1E31, 1E32, 1E33, 1E34, 1E35, 1E36, 1E37, 1E38, 1E39, 1E40, 1E41, 1E42, 1E43, 1E44, 1E45, 1E46, 1E47, 1E48, 1E49, 1E50, 1E51, 1E52, 1E53, 1E54, 1E55, 1E56, 1E57, 1E58, 1E59, 1E60, 1E61, 1E62, 1E63, 1E64, 1E65, 1E66, 1E67, 1E68, 1E69, 1E70, 1E71, 1E72, 1E73, 1E74, 1E75, 1E76, 1E77, 1E78, 1E79, 1E80, 1E81, 1E82, 1E83, 1E84, 1E85, 1E86, 1E87, 1E88, 1E89, 1E90, 1E91, 1E92, 1E93, 1E94, 1E95, 1E96, 1E97, 1E98, 1E99,
	            1E100, 1E101, 1E102, 1E103, 1E104, 1E105, 1E106, 1E107, 1E108, 1E109, 1E110, 1E111, 1E112, 1E113, 1E114, 1E115, 1E116, 1E117, 1E118, 1E119, 1E120, 1E121, 1E122, 1E123, 1E124, 1E125, 1E126, 1E127, 1E128, 1E129, 1E130, 1E131, 1E132, 1E133, 1E134, 1E135, 1E136, 1E137, 1E138, 1E139, 1E140, 1E141, 1E142, 1E143, 1E144, 1E145, 1E146, 1E147, 1E148, 1E149, 1E150, 1E151, 1E152, 1E153, 1E154, 1E155, 1E156, 1E157, 1E158, 1E159, 1E160, 1E161, 1E162, 1E163, 1E164, 1E165, 1E166, 1E167, 1E168, 1E169, 1E170, 1E171, 1E172, 1E173, 1E174, 1E175, 1E176, 1E177, 1E178, 1E179, 1E180, 1E181, 1E182, 1E183, 1E184, 1E185, 1E186, 1E187, 1E188, 1E189, 1E190, 1E191, 1E192, 1E193, 1E194, 1E195, 1E196, 1E197, 1E198, 1E199,
	            1E200, 1E201, 1E202, 1E203, 1E204, 1E205, 1E206, 1E207, 1E208, 1E209, 1E210, 1E211, 1E212, 1E213, 1E214, 1E215, 1E216, 1E217, 1E218, 1E219, 1E220, 1E221, 1E222, 1E223, 1E224, 1E225, 1E226, 1E227, 1E228, 1E229, 1E230, 1E231, 1E232, 1E233, 1E234, 1E235, 1E236, 1E237, 1E238, 1E239, 1E240, 1E241, 1E242, 1E243, 1E244, 1E245, 1E246, 1E247, 1E248, 1E249, 1E250, 1E251, 1E252, 1E253, 1E254, 1E255, 1E256, 1E257, 1E258, 1E259, 1E260, 1E261, 1E262, 1E263, 1E264, 1E265, 1E266, 1E267, 1E268, 1E269, 1E270, 1E271, 1E272, 1E273, 1E274, 1E275, 1E276, 1E277, 1E278, 1E279, 1E280, 1E281, 1E282, 1E283, 1E284, 1E285, 1E286, 1E287, 1E288, 1E289, 1E290, 1E291, 1E292, 1E293, 1E294, 1E295, 1E296, 1E297, 1E298, 1E299,
	            1E300, 1E301, 1E302, 1E303, 1E304, 1E305, 1E306, 1E307, 1E308];
	        Double.NEGATIVE_POWERS = [
	            1E0, 1E-1, 1E-2, 1E-3, 1E-4, 1E-5, 1E-6, 1E-7, 1E-8, 1E-9, 1E-10, 1E-11, 1E-12, 1E-13, 1E-14, 1E-15, 1E-16, 1E-17, 1E-18, 1E-19, 1E-20, 1E-21, 1E-22, 1E-23, 1E-24, 1E-25, 1E-26, 1E-27, 1E-28, 1E-29, 1E-30, 1E-31, 1E-32, 1E-33, 1E-34, 1E-35, 1E-36, 1E-37, 1E-38, 1E-39, 1E-40, 1E-41, 1E-42, 1E-43, 1E-44, 1E-45, 1E-46, 1E-47, 1E-48, 1E-49, 1E-50, 1E-51, 1E-52, 1E-53, 1E-54, 1E-55, 1E-56, 1E-57, 1E-58, 1E-59, 1E-60, 1E-61, 1E-62, 1E-63, 1E-64, 1E-65, 1E-66, 1E-67, 1E-68, 1E-69, 1E-70, 1E-71, 1E-72, 1E-73, 1E-74, 1E-75, 1E-76, 1E-77, 1E-78, 1E-79, 1E-80, 1E-81, 1E-82, 1E-83, 1E-84, 1E-85, 1E-86, 1E-87, 1E-88, 1E-89, 1E-90, 1E-91, 1E-92, 1E-93, 1E-94, 1E-95, 1E-96, 1E-97, 1E-98, 1E-99,
	            1E-100, 1E-101, 1E-102, 1E-103, 1E-104, 1E-105, 1E-106, 1E-107, 1E-108, 1E-109, 1E-110, 1E-111, 1E-112, 1E-113, 1E-114, 1E-115, 1E-116, 1E-117, 1E-118, 1E-119, 1E-120, 1E-121, 1E-122, 1E-123, 1E-124, 1E-125, 1E-126, 1E-127, 1E-128, 1E-129, 1E-130, 1E-131, 1E-132, 1E-133, 1E-134, 1E-135, 1E-136, 1E-137, 1E-138, 1E-139, 1E-140, 1E-141, 1E-142, 1E-143, 1E-144, 1E-145, 1E-146, 1E-147, 1E-148, 1E-149, 1E-150, 1E-151, 1E-152, 1E-153, 1E-154, 1E-155, 1E-156, 1E-157, 1E-158, 1E-159, 1E-160, 1E-161, 1E-162, 1E-163, 1E-164, 1E-165, 1E-166, 1E-167, 1E-168, 1E-169, 1E-170, 1E-171, 1E-172, 1E-173, 1E-174, 1E-175, 1E-176, 1E-177, 1E-178, 1E-179, 1E-180, 1E-181, 1E-182, 1E-183, 1E-184, 1E-185, 1E-186, 1E-187, 1E-188, 1E-189, 1E-190, 1E-191, 1E-192, 1E-193, 1E-194, 1E-195, 1E-196, 1E-197, 1E-198, 1E-199,
	            1E-200, 1E-201, 1E-202, 1E-203, 1E-204, 1E-205, 1E-206, 1E-207, 1E-208, 1E-209, 1E-210, 1E-211, 1E-212, 1E-213, 1E-214, 1E-215, 1E-216, 1E-217, 1E-218, 1E-219, 1E-220, 1E-221, 1E-222, 1E-223, 1E-224, 1E-225, 1E-226, 1E-227, 1E-228, 1E-229, 1E-230, 1E-231, 1E-232, 1E-233, 1E-234, 1E-235, 1E-236, 1E-237, 1E-238, 1E-239, 1E-240, 1E-241, 1E-242, 1E-243, 1E-244, 1E-245, 1E-246, 1E-247, 1E-248, 1E-249, 1E-250, 1E-251, 1E-252, 1E-253, 1E-254, 1E-255, 1E-256, 1E-257, 1E-258, 1E-259, 1E-260, 1E-261, 1E-262, 1E-263, 1E-264, 1E-265, 1E-266, 1E-267, 1E-268, 1E-269, 1E-270, 1E-271, 1E-272, 1E-273, 1E-274, 1E-275, 1E-276, 1E-277, 1E-278, 1E-279, 1E-280, 1E-281, 1E-282, 1E-283, 1E-284, 1E-285, 1E-286, 1E-287, 1E-288, 1E-289, 1E-290, 1E-291, 1E-292, 1E-293, 1E-294, 1E-295, 1E-296, 1E-297, 1E-298, 1E-299,
	            1E-300, 1E-301, 1E-302, 1E-303, 1E-304, 1E-305, 1E-306, 1E-307, 1E-308, 1E-309, 1E-310, 1E-311, 1E-312, 1E-313, 1E-314, 1E-315, 1E-316, 1E-317, 1E-318, 1E-319, 1E-320, 1E-321, 1E-322, 1E-323, 1E-324];
	        /**
	         * Returns powers of 10.
	         * Unlike the Math.pow this function produces no decimal garbage.
	         * @param exp Exponent.
	         */
	        function pow10(exp) {
	            debug.assertValue(exp, "exp");
	            // Positive & zero
	            if (exp >= 0) {
	                if (exp < Double.POSITIVE_POWERS.length) {
	                    return Double.POSITIVE_POWERS[exp];
	                }
	                else {
	                    return Infinity;
	                }
	            }
	            // Negative
	            exp = -exp;
	            if (exp > 0 && exp < Double.NEGATIVE_POWERS.length) {
	                return Double.NEGATIVE_POWERS[exp];
	            }
	            else {
	                return 0;
	            }
	        }
	        Double.pow10 = pow10;
	        /**
	         * Returns the 10 base logarithm of the number.
	         * Unlike Math.log function this produces integer results with no decimal garbage.
	         * @param val Positive value or zero.
	         */
	        function log10(val) {
	            debug.assert(val >= 0, "val");
	            // Fast Log10() algorithm 
	            if (val > 1 && val < 1E16) {
	                if (val < 1E8) {
	                    if (val < 1E4) {
	                        if (val < 1E2) {
	                            if (val < 1E1) {
	                                return 0;
	                            }
	                            else {
	                                return 1;
	                            }
	                        }
	                        else {
	                            if (val < 1E3) {
	                                return 2;
	                            }
	                            else {
	                                return 3;
	                            }
	                        }
	                    }
	                    else {
	                        if (val < 1E6) {
	                            if (val < 1E5) {
	                                return 4;
	                            }
	                            else {
	                                return 5;
	                            }
	                        }
	                        else {
	                            if (val < 1E7) {
	                                return 6;
	                            }
	                            else {
	                                return 7;
	                            }
	                        }
	                    }
	                }
	                else {
	                    if (val < 1E12) {
	                        if (val < 1E10) {
	                            if (val < 1E9) {
	                                return 8;
	                            }
	                            else {
	                                return 9;
	                            }
	                        }
	                        else {
	                            if (val < 1E11) {
	                                return 10;
	                            }
	                            else {
	                                return 11;
	                            }
	                        }
	                    }
	                    else {
	                        if (val < 1E14) {
	                            if (val < 1E13) {
	                                return 12;
	                            }
	                            else {
	                                return 13;
	                            }
	                        }
	                        else {
	                            if (val < 1E15) {
	                                return 14;
	                            }
	                            else {
	                                return 15;
	                            }
	                        }
	                    }
	                }
	            }
	            if (val > 1E-16 && val < 1) {
	                if (val < 1E-8) {
	                    if (val < 1E-12) {
	                        if (val < 1E-14) {
	                            if (val < 1E-15) {
	                                return -16;
	                            }
	                            else {
	                                return -15;
	                            }
	                        }
	                        else {
	                            if (val < 1E-13) {
	                                return -14;
	                            }
	                            else {
	                                return -13;
	                            }
	                        }
	                    }
	                    else {
	                        if (val < 1E-10) {
	                            if (val < 1E-11) {
	                                return -12;
	                            }
	                            else {
	                                return -11;
	                            }
	                        }
	                        else {
	                            if (val < 1E-9) {
	                                return -10;
	                            }
	                            else {
	                                return -9;
	                            }
	                        }
	                    }
	                }
	                else {
	                    if (val < 1E-4) {
	                        if (val < 1E-6) {
	                            if (val < 1E-7) {
	                                return -8;
	                            }
	                            else {
	                                return -7;
	                            }
	                        }
	                        else {
	                            if (val < 1E-5) {
	                                return -6;
	                            }
	                            else {
	                                return -5;
	                            }
	                        }
	                    }
	                    else {
	                        if (val < 1E-2) {
	                            if (val < 1E-3) {
	                                return -4;
	                            }
	                            else {
	                                return -3;
	                            }
	                        }
	                        else {
	                            if (val < 1E-1) {
	                                return -2;
	                            }
	                            else {
	                                return -1;
	                            }
	                        }
	                    }
	                }
	            }
	            // JS Math provides only natural log function so we need to calc the 10 base logarithm:
	            // logb(x) = logk(x)/logk(b); 
	            var log10 = Math.log(val) / Double.LOG_E_10;
	            return Double.floorWithPrecision(log10);
	        }
	        Double.log10 = log10;
	        /**
	         * Returns a power of 10 representing precision of the number based on the number of meaningful decimal digits.
	         * For example the precision of 56,263.3767 with the 6 meaningful decimal digit is 0.1.
	         * @param x Value.
	         * @param decimalDigits How many decimal digits are meaningfull.
	         */
	        function getPrecision(x, decimalDigits) {
	            if (decimalDigits === undefined) {
	                decimalDigits = Double.DEFAULT_PRECISION_IN_DECIMAL_DIGITS;
	            }
	            else {
	                debug.assert(decimalDigits >= 0, "decimalDigits");
	            }
	            if (!x) {
	                return undefined;
	            }
	            var exp = Double.log10(Math.abs(x));
	            if (exp < Double.MIN_EXP) {
	                return 0;
	            }
	            var precisionExp = Math.max(exp - decimalDigits, -Double.NEGATIVE_POWERS.length + 1);
	            return Double.pow10(precisionExp);
	        }
	        Double.getPrecision = getPrecision;
	        /**
	         * Checks if a delta between 2 numbers is less than provided precision.
	         * @param x One value.
	         * @param y Another value.
	         * @param precision Precision value.
	         */
	        function equalWithPrecision(x, y, precision) {
	            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
	            debug.assert(precision >= 0, "precision");
	            return x === y || Math.abs(x - y) < precision;
	        }
	        Double.equalWithPrecision = equalWithPrecision;
	        /**
	         * Checks if a first value is less than another taking
	         * into account the loose precision based equality.
	         * @param x One value.
	         * @param y Another value.
	         * @param precision Precision value.
	         */
	        function lessWithPrecision(x, y, precision) {
	            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
	            debug.assert(precision >= 0, "precision");
	            return x < y && Math.abs(x - y) > precision;
	        }
	        Double.lessWithPrecision = lessWithPrecision;
	        /**
	         * Checks if a first value is less or equal than another taking
	         * into account the loose precision based equality.
	         * @param x One value.
	         * @param y Another value.
	         * @param precision Precision value.
	         */
	        function lessOrEqualWithPrecision(x, y, precision) {
	            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
	            debug.assert(precision >= 0, "precision");
	            return x < y || Math.abs(x - y) < precision;
	        }
	        Double.lessOrEqualWithPrecision = lessOrEqualWithPrecision;
	        /**
	         * Checks if a first value is greater than another taking
	         * into account the loose precision based equality.
	         * @param x One value.
	         * @param y Another value.
	         * @param precision Precision value.
	         */
	        function greaterWithPrecision(x, y, precision) {
	            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
	            debug.assert(precision >= 0, "precision");
	            return x > y && Math.abs(x - y) > precision;
	        }
	        Double.greaterWithPrecision = greaterWithPrecision;
	        /**
	         * Checks if a first value is greater or equal to another taking
	         * into account the loose precision based equality.
	         * @param x One value.
	         * @param y Another value.
	         * @param precision Precision value.
	         */
	        function greaterOrEqualWithPrecision(x, y, precision) {
	            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
	            debug.assert(precision >= 0, "precision");
	            return x > y || Math.abs(x - y) < precision;
	        }
	        Double.greaterOrEqualWithPrecision = greaterOrEqualWithPrecision;
	        /**
	         * Floors the number unless it's withing the precision distance from the higher int.
	         * @param x One value.
	         * @param precision Precision value.
	         */
	        function floorWithPrecision(x, precision) {
	            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
	            debug.assert(precision >= 0, "precision");
	            var roundX = Math.round(x);
	            if (Math.abs(x - roundX) < precision) {
	                return roundX;
	            }
	            else {
	                return Math.floor(x);
	            }
	        }
	        Double.floorWithPrecision = floorWithPrecision;
	        /**
	         * Ceils the number unless it's withing the precision distance from the lower int.
	         * @param x One value.
	         * @param precision Precision value.
	         */
	        function ceilWithPrecision(x, precision) {
	            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
	            debug.assert(precision >= 0, "precision");
	            var roundX = Math.round(x);
	            if (Math.abs(x - roundX) < precision) {
	                return roundX;
	            }
	            else {
	                return Math.ceil(x);
	            }
	        }
	        Double.ceilWithPrecision = ceilWithPrecision;
	        /**
	         * Floors the number to the provided precision.
	         * For example 234,578 floored to 1,000 precision is 234,000.
	         * @param x One value.
	         * @param precision Precision value.
	         */
	        function floorToPrecision(x, precision) {
	            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
	            debug.assert(precision >= 0, "precision");
	            if (precision === 0 || x === 0) {
	                return x;
	            }
	            //Precision must be a Power of 10
	            return Math.floor(x / precision) * precision;
	        }
	        Double.floorToPrecision = floorToPrecision;
	        /**
	         * Ceils the number to the provided precision.
	         * For example 234,578 floored to 1,000 precision is 235,000.
	         * @param x One value.
	         * @param precision Precision value.
	         */
	        function ceilToPrecision(x, precision) {
	            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
	            debug.assert(precision >= 0, "precision");
	            if (precision === 0 || x === 0) {
	                return x;
	            }
	            //Precision must be a Power of 10
	            return Math.ceil(x / precision) * precision;
	        }
	        Double.ceilToPrecision = ceilToPrecision;
	        /**
	         * Rounds the number to the provided precision.
	         * For example 234,578 floored to 1,000 precision is 235,000.
	         * @param x One value.
	         * @param precision Precision value.
	         */
	        function roundToPrecision(x, precision) {
	            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
	            debug.assert(precision >= 0, "precision");
	            if (precision === 0 || x === 0) {
	                return x;
	            }
	            //Precision must be a Power of 10
	            var result = Math.round(x / precision) * precision;
	            var decimalDigits = Math.round(Double.log10(Math.abs(x)) - Double.log10(precision)) + 1;
	            if (decimalDigits > 0 && decimalDigits < 16) {
	                result = parseFloat(result.toPrecision(decimalDigits));
	            }
	            return result;
	        }
	        Double.roundToPrecision = roundToPrecision;
	        /**
	         * Returns the value making sure that it's restricted to the provided range.
	         * @param x One value.
	         * @param min Range min boundary.
	         * @param max Range max boundary.
	         */
	        function ensureInRange(x, min, max) {
	            debug.assert(min <= max, "min must be less or equal to max");
	            if (x === undefined || x === null) {
	                return x;
	            }
	            if (x < min) {
	                return min;
	            }
	            if (x > max) {
	                return max;
	            }
	            return x;
	        }
	        Double.ensureInRange = ensureInRange;
	        /**
	         * Rounds the value - this method is actually faster than Math.round - used in the graphics utils.
	         * @param x Value to round.
	         */
	        function round(x) {
	            debug.assert(x >= 0, "x must be greater or equal to 0");
	            return (0.5 + x) << 0;
	        }
	        Double.round = round;
	        /**
	         * Projects the value from the source range into the target range.
	         * @param value Value to project.
	         * @param fromMin Minimum of the source range.
	         * @param toMin Minimum of the target range.
	         * @param toMax Maximum of the target range.
	         */
	        function project(value, fromMin, fromSize, toMin, toSize) {
	            if (fromSize === 0 || toSize === 0) {
	                if (fromMin <= value && value <= fromMin + fromSize) {
	                    return toMin;
	                }
	                else {
	                    return NaN;
	                }
	            }
	            var relativeX = (value - fromMin) / fromSize;
	            var projectedX = toMin + relativeX * toSize;
	            return projectedX;
	        }
	        Double.project = project;
	        /**
	         * Removes decimal noise.
	         * @param value Value to be processed.
	         */
	        function removeDecimalNoise(value) {
	            return roundToPrecision(value, getPrecision(value));
	        }
	        Double.removeDecimalNoise = removeDecimalNoise;
	        /**
	         * Checks whether the number is integer.
	         * @param value Value to be checked.
	         */
	        function isInteger(value) {
	            return value !== null && value % 1 === 0;
	        }
	        Double.isInteger = isInteger;
	        /**
	         * Dividing by increment will give us count of increments
	         * Round out the rough edges into even integer
	         * Multiply back by increment to get rounded value
	         * e.g. Rounder.toIncrement(0.647291, 0.05) => 0.65
	         * @param value - value to round to nearest increment
	         * @param increment - smallest increment to round toward
	         */
	        function toIncrement(value, increment) {
	            return Math.round(value / increment) * increment;
	        }
	        Double.toIncrement = toIncrement;
	    })(Double = powerbi.Double || (powerbi.Double = {}));
	    function applyDefault(value, defaultValue) {
	        return value !== undefined ? value : defaultValue;
	    }
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 303:
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
	/// <reference path="./_references.ts"/>
	var jsCommon;
	(function (jsCommon) {
	    var Double = powerbi.Double;
	    var Color;
	    (function (Color) {
	        function rotate(rgbString, rotateFactor) {
	            if (rotateFactor === 0)
	                return rgbString;
	            var originalRgb = parseColorString(rgbString);
	            var originalHsv = rgbToHsv(originalRgb);
	            var rotatedHsv = rotateHsv(originalHsv, rotateFactor);
	            var rotatedRgb = hsvToRgb(rotatedHsv);
	            return hexString(rotatedRgb);
	        }
	        Color.rotate = rotate;
	        function normalizeToHexString(color) {
	            var rgb = parseColorString(color);
	            return hexString(rgb);
	        }
	        Color.normalizeToHexString = normalizeToHexString;
	        function parseColorString(color) {
	            debug.assertValue(color, 'color');
	            if (color.indexOf('#') >= 0) {
	                if (color.length === 7) {
	                    // #RRGGBB
	                    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
	                    if (result == null || result.length < 4)
	                        return;
	                    return {
	                        R: parseInt(result[1], 16),
	                        G: parseInt(result[2], 16),
	                        B: parseInt(result[3], 16),
	                    };
	                }
	                else if (color.length === 4) {
	                    // #RGB
	                    var result = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(color);
	                    if (result == null || result.length < 4)
	                        return;
	                    return {
	                        R: parseInt(result[1] + result[1], 16),
	                        G: parseInt(result[2] + result[2], 16),
	                        B: parseInt(result[3] + result[3], 16),
	                    };
	                }
	            }
	            else if (color.indexOf('rgb(') >= 0) {
	                // rgb(R, G, B)
	                var result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(color);
	                if (result == null || result.length < 4)
	                    return;
	                return {
	                    R: parseInt(result[1], 10),
	                    G: parseInt(result[2], 10),
	                    B: parseInt(result[3], 10),
	                };
	            }
	            else if (color.indexOf('rgba(') >= 0) {
	                // rgba(R, G, B, A)
	                var result = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)$/.exec(color);
	                if (result == null || result.length < 5)
	                    return;
	                return {
	                    R: parseInt(result[1], 10),
	                    G: parseInt(result[2], 10),
	                    B: parseInt(result[3], 10),
	                    A: parseFloat(result[4]),
	                };
	            }
	        }
	        Color.parseColorString = parseColorString;
	        function rgbToHsv(rgbColor) {
	            var s, h;
	            var r = rgbColor.R / 255, g = rgbColor.G / 255, b = rgbColor.B / 255;
	            var min = Math.min(r, Math.min(g, b));
	            var max = Math.max(r, Math.max(g, b));
	            var v = max;
	            var delta = max - min;
	            if (max === 0 || delta === 0) {
	                // R, G, and B must be 0.0, or all the same.
	                // In this case, S is 0.0, and H is undefined.
	                // Using H = 0.0 is as good as any...
	                s = 0;
	                h = 0;
	            }
	            else {
	                s = delta / max;
	                if (r === max) {
	                    // Between Yellow and Magenta
	                    h = (g - b) / delta;
	                }
	                else if (g === max) {
	                    // Between Cyan and Yellow
	                    h = 2 + (b - r) / delta;
	                }
	                else {
	                    // Between Magenta and Cyan
	                    h = 4 + (r - g) / delta;
	                }
	            }
	            // Scale h to be between 0.0 and 1.
	            // This may require adding 1, if the value
	            // is negative.
	            h /= 6;
	            if (h < 0) {
	                h += 1;
	            }
	            return {
	                H: h,
	                S: s,
	                V: v,
	            };
	        }
	        function hsvToRgb(hsvColor) {
	            var r, g, b;
	            var h = hsvColor.H, s = hsvColor.S, v = hsvColor.V;
	            if (s === 0) {
	                // If s is 0, all colors are the same.
	                // This is some flavor of gray.
	                r = v;
	                g = v;
	                b = v;
	            }
	            else {
	                var p = void 0, q = void 0, t = void 0, fractionalSector = void 0, sectorNumber = void 0, sectorPos = void 0;
	                // The color wheel consists of 6 sectors.
	                // Figure out which sector you//re in.
	                sectorPos = h * 6;
	                sectorNumber = Math.floor(sectorPos);
	                // get the fractional part of the sector.
	                // That is, how many degrees into the sector
	                // are you?
	                fractionalSector = sectorPos - sectorNumber;
	                // Calculate values for the three axes
	                // of the color.
	                p = v * (1.0 - s);
	                q = v * (1.0 - (s * fractionalSector));
	                t = v * (1.0 - (s * (1 - fractionalSector)));
	                // Assign the fractional colors to r, g, and b
	                // based on the sector the angle is in.
	                switch (sectorNumber) {
	                    case 0:
	                        r = v;
	                        g = t;
	                        b = p;
	                        break;
	                    case 1:
	                        r = q;
	                        g = v;
	                        b = p;
	                        break;
	                    case 2:
	                        r = p;
	                        g = v;
	                        b = t;
	                        break;
	                    case 3:
	                        r = p;
	                        g = q;
	                        b = v;
	                        break;
	                    case 4:
	                        r = t;
	                        g = p;
	                        b = v;
	                        break;
	                    case 5:
	                        r = v;
	                        g = p;
	                        b = q;
	                        break;
	                }
	            }
	            return {
	                R: Math.floor(r * 255),
	                G: Math.floor(g * 255),
	                B: Math.floor(b * 255),
	            };
	        }
	        function rotateHsv(hsvColor, rotateFactor) {
	            var newH = hsvColor.H + rotateFactor;
	            return {
	                H: newH > 1 ? newH - 1 : newH,
	                S: hsvColor.S,
	                V: hsvColor.V,
	            };
	        }
	        function darken(color, diff) {
	            var flooredNumber = Math.floor(diff);
	            return {
	                R: Math.max(0, color.R - flooredNumber),
	                G: Math.max(0, color.G - flooredNumber),
	                B: Math.max(0, color.B - flooredNumber),
	            };
	        }
	        Color.darken = darken;
	        function rgbString(color) {
	            if (color.A == null)
	                return "rgb(" + color.R + "," + color.G + "," + color.B + ")";
	            return "rgba(" + color.R + "," + color.G + "," + color.B + "," + color.A + ")";
	        }
	        Color.rgbString = rgbString;
	        function hexString(color) {
	            return "#" + componentToHex(color.R) + componentToHex(color.G) + componentToHex(color.B);
	        }
	        Color.hexString = hexString;
	        /**
	         * Overlays a color with opacity over a background color
	         * @param {string} foreColor Color to overlay
	         * @param {number} opacity number between 0 (transparent) to 1 (opaque)
	         * @param {string} backColor Background color
	         * @returns Result color
	         */
	        function hexBlend(foreColor, opacity, backColor) {
	            return hexString(rgbBlend(parseColorString(foreColor), opacity, parseColorString(backColor)));
	        }
	        Color.hexBlend = hexBlend;
	        /**
	         * Overlays a color with opacity over a background color. Any alpha-channel is ignored.
	         * @param {RgbColor} foreColor Color to overlay
	         * @param {number} opacity number between 0 (transparent) to 1 (opaque). Any value out of range will be corrected.
	         * @param {RgbColor} backColor Background color
	         * @returns
	         */
	        function rgbBlend(foreColor, opacity, backColor) {
	            // correct opacity
	            opacity = Double.ensureInRange(opacity, 0, 1);
	            return {
	                R: channelBlend(foreColor.R, opacity, backColor.R),
	                G: channelBlend(foreColor.G, opacity, backColor.G),
	                B: channelBlend(foreColor.B, opacity, backColor.B)
	            };
	        }
	        Color.rgbBlend = rgbBlend;
	        /**
	         * Blend a single channel for two colors
	         * @param {number} foreChannel Channel of foreground color. Will be enforced to be between 0 and 255.
	         * @param {number} opacity opacity of the foreground color. Will be enforced to be between 0 and 1.
	         * @param {number} backChannel channel of the background color. Will be enforced to be between 0 and 255.
	         * @returns result channel value
	         */
	        function channelBlend(foreChannel, opacity, backChannel) {
	            opacity = Double.ensureInRange(opacity, 0, 1);
	            foreChannel = Double.ensureInRange(foreChannel, 0, 255);
	            backChannel = Double.ensureInRange(backChannel, 0, 255);
	            return Math.round((opacity * foreChannel) +
	                ((1 - opacity) * backChannel));
	        }
	        Color.channelBlend = channelBlend;
	        /**
	         * Calculate the highlight color from the rgbColor based on the lumianceThreshold and delta.
	         * @param {RgbColor} rgbColor The original color.
	         * @param {number} lumianceThreshold The lumiance threshold used, the highlight color will be brighter when the lumiance is smaller the threshold, otherwise the highlight color will be darker. Will be enforced to be between 0 and 1.
	         * @param {number} delta the highlight color will be calculated based on the delta. Will be enforced to be between 0 and 1. lumianceThreshold + delta cannot greater than 1.
	         * @returns result highlight color value
	         */
	        function calculateHighlightColor(rgbColor, lumianceThreshold, delta) {
	            var hsvColor = rgbToHsv(rgbColor);
	            // For invalid lumianceThreshold and delta value, use default.
	            if (lumianceThreshold + delta > 1 || lumianceThreshold <= 0 || delta <= 0) {
	                debug.assert(false, 'Invalid lumianceThreshold and highlightColor adjusting delta.');
	                lumianceThreshold = 0.8;
	                delta = 0.2;
	            }
	            // Make it lighter when the lumianceValue is less than 200, otherwise make it darker.
	            if (hsvColor.V < lumianceThreshold)
	                hsvColor.V = hsvColor.V + delta;
	            else
	                hsvColor.V = hsvColor.V - delta;
	            return hexString(hsvToRgb(hsvColor));
	        }
	        Color.calculateHighlightColor = calculateHighlightColor;
	        function componentToHex(hexComponent) {
	            var clamped = Double.ensureInRange(hexComponent, 0, 255);
	            var hex = clamped.toString(16).toUpperCase();
	            return hex.length === 1 ? "0" + hex : hex;
	        }
	    })(Color = jsCommon.Color || (jsCommon.Color = {}));
	})(jsCommon || (jsCommon = {}));

	

/***/ },

/***/ 304:
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
	/// <reference path="./_references.ts"/>
	var jsCommon;
	(function (jsCommon) {
	    /**
	     * CSS constants.
	     */
	    var CssConstants;
	    (function (CssConstants) {
	        function createClassAndSelector(className) {
	            return {
	                class: className,
	                selector: '.' + className,
	            };
	        }
	        CssConstants.createClassAndSelector = createClassAndSelector;
	        CssConstants.styleAttribute = 'style';
	        CssConstants.pixelUnits = 'px';
	        CssConstants.heightProperty = 'height';
	        CssConstants.widthProperty = 'width';
	        CssConstants.topProperty = 'top';
	        CssConstants.bottomProperty = 'bottom';
	        CssConstants.leftProperty = 'left';
	        CssConstants.rightProperty = 'right';
	        CssConstants.marginTopProperty = 'margin-top';
	        CssConstants.marginLeftProperty = 'margin-left';
	        CssConstants.displayProperty = 'display';
	        CssConstants.backgroundProperty = 'background';
	        CssConstants.backgroundColorProperty = 'background-color';
	        CssConstants.backgroundRepeatProperty = 'background-repeat';
	        CssConstants.backgroundSizeProperty = 'background-size';
	        CssConstants.backgroundImageProperty = 'background-image';
	        CssConstants.textShadowProperty = 'text-shadow';
	        CssConstants.textAlignProperty = 'text-align';
	        CssConstants.borderTopWidthProperty = 'border-top-width';
	        CssConstants.borderBottomWidthProperty = 'border-bottom-width';
	        CssConstants.borderLeftWidthProperty = 'border-left-width';
	        CssConstants.borderRightWidthProperty = 'border-right-width';
	        CssConstants.fontSizeProperty = 'font-size';
	        CssConstants.fontWeightProperty = 'font-weight';
	        CssConstants.colorProperty = 'color';
	        CssConstants.opacityProperty = 'opacity';
	        CssConstants.paddingLeftProperty = 'padding-left';
	        CssConstants.paddingRightProperty = 'padding-right';
	        CssConstants.positionProperty = 'position';
	        CssConstants.maxWidthProperty = 'max-width';
	        CssConstants.minWidthProperty = 'min-width';
	        CssConstants.overflowProperty = 'overflow';
	        CssConstants.overflowXProperty = 'overflow-x';
	        CssConstants.overflowYProperty = 'overflow-y';
	        CssConstants.transformProperty = 'transform';
	        CssConstants.webkitTransformProperty = '-webkit-transform';
	        CssConstants.cursorProperty = 'cursor';
	        CssConstants.visibilityProperty = 'visibility';
	        CssConstants.absoluteValue = 'absolute';
	        CssConstants.zeroPixelValue = '0px';
	        CssConstants.autoValue = 'auto';
	        CssConstants.hiddenValue = 'hidden';
	        CssConstants.noneValue = 'none';
	        CssConstants.blockValue = 'block';
	        CssConstants.inlineBlockValue = 'inline-block';
	        CssConstants.transparentValue = 'transparent';
	        CssConstants.boldValue = 'bold';
	        CssConstants.visibleValue = 'visible';
	        CssConstants.tableRowValue = 'table-row';
	        CssConstants.coverValue = 'cover';
	        CssConstants.pointerValue = 'pointer';
	        CssConstants.scrollValue = 'scroll';
	    })(CssConstants = jsCommon.CssConstants || (jsCommon.CssConstants = {}));
	})(jsCommon || (jsCommon = {}));

	

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
	$.fn.multiline = function (text) {
	    this.text(text);
	    this.html(this.html().replace(/\n/g, '<br/>'));
	    return this;
	};
	$.fn.togglePanelControl = function () {
	    return this.each(function () {
	        $(this).addClass("ui-accordion ui-accordion-icons ui-widget ui-helper-reset")
	            .find(".accordionHeader")
	            .addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-top ui-corner-bottom")
	            .hover(function () {
	            $(this).toggleClass("ui-state-hover");
	        })
	            .prepend('<span class="ui-icon ui-icon-triangle-1-e"></span>')
	            .click(function () {
	            $(this)
	                .toggleClass("ui-accordion-header-active ui-state-active ui-state-default ui-corner-bottom")
	                .find("> .ui-icon").toggleClass("ui-icon-triangle-1-e ui-icon-triangle-1-s").end()
	                .next().slideToggle();
	            return false;
	        })
	            .next()
	            .addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom")
	            .hide();
	    });
	};
	/// <reference path="./_references.ts"/>
	var jsCommon;
	(function (jsCommon) {
	    var JQueryConstants;
	    (function (JQueryConstants) {
	        JQueryConstants.VisibleSelector = ':visible';
	    })(JQueryConstants = jsCommon.JQueryConstants || (jsCommon.JQueryConstants = {}));
	})(jsCommon || (jsCommon = {}));

	

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
	/// <reference path="./_references.ts"/>

	

/***/ },

/***/ 307:
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
	/// <reference path="./_references.ts"/>

	

/***/ },

/***/ 308:
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
	/// <reference path="./_references.ts"/>
	var jsCommon;
	(function (jsCommon) {
	    var Formatting;
	    (function (Formatting) {
	        var regexCache;
	        /**
	         * Translate .NET format into something supported by jQuery.Globalize.
	         */
	        function findDateFormat(value, format, cultureName) {
	            switch (format) {
	                case "m":
	                    // Month + day
	                    format = "M";
	                    break;
	                case "O":
	                case "o":
	                    // Roundtrip
	                    format = "yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'0000'";
	                    break;
	                case "R":
	                case "r":
	                    // RFC1123 pattern - - time must be converted to UTC before formatting 
	                    value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
	                    format = "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'";
	                    break;
	                case "s":
	                    // Sortable - should use invariant culture
	                    format = "S";
	                    break;
	                case "u":
	                    // Universal sortable - should convert to UTC before applying the "yyyy'-'MM'-'dd HH':'mm':'ss'Z' format.
	                    value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
	                    format = "yyyy'-'MM'-'dd HH':'mm':'ss'Z'";
	                    break;
	                case "U":
	                    // Universal full - the pattern is same as F but the time must be converted to UTC before formatting
	                    value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
	                    format = "F";
	                    break;
	                case "y":
	                case "Y":
	                    // Year and month
	                    switch (cultureName) {
	                        case "default":
	                        case "en":
	                        case "en-US":
	                            format = "MMMM, yyyy"; // Fix the default year-month pattern for english
	                            break;
	                        default:
	                            format = "Y"; // For other cultures - use the localized pattern
	                    }
	                    break;
	            }
	            return { value: value, format: format };
	        }
	        Formatting.findDateFormat = findDateFormat;
	        /**
	         * Translates unsupported .NET custom format expressions to the custom expressions supported by JQuery.Globalize.
	         */
	        function fixDateTimeFormat(format) {
	            // Fix for the "K" format (timezone): 
	            //The js dates don't have a kind property so we'll support only local kind which is equavalent to zzz format.
	            format = format.replace(/%K/g, "zzz");
	            format = format.replace(/K/g, "zzz");
	            format = format.replace(/fffffff/g, "fff0000");
	            format = format.replace(/ffffff/g, "fff000");
	            format = format.replace(/fffff/g, "fff00");
	            format = format.replace(/ffff/g, "fff0");
	            // Fix for the 5 digit year: "yyyyy" format. 
	            //The Globalize doesn't support dates greater than 9999 so we replace the "yyyyy" with "0yyyy".
	            format = format.replace(/yyyyy/g, "0yyyy");
	            // Fix for the 3 digit year: "yyy" format. 
	            //The Globalize doesn't support this formatting so we need to replace it with the 4 digit year "yyyy" format.
	            format = format.replace(/(^y|^)yyy(^y|$)/g, "yyyy");
	            if (!regexCache) {
	                // Creating Regexes for cases "Using single format specifier" 
	                //- http://msdn.microsoft.com/en-us/library/8kb3ddd4.aspx#UsingSingleSpecifiers
	                // This is not supported from The Globalize.
	                // The case covers all single "%" lead specifier (like "%d" but not %dd) 
	                // The cases as single "%d" are filtered in if the bellow.
	                // (?!S) where S is the specifier make sure that we only one symbol for specifier.
	                regexCache = ["d", "f", "F", "g", "h", "H", "K", "m", "M", "s", "t", "y", "z", ":", "/"].map(function (s) {
	                    return { r: new RegExp("\%" + s + "(?!" + s + ")", "g"), s: s };
	                });
	            }
	            if (format.indexOf("%") !== -1 && format.length > 2) {
	                for (var i = 0; i < regexCache.length; i++) {
	                    format = format.replace(regexCache[i].r, regexCache[i].s);
	                }
	            }
	            return format;
	        }
	        Formatting.fixDateTimeFormat = fixDateTimeFormat;
	    })(Formatting = jsCommon.Formatting || (jsCommon.Formatting = {}));
	})(jsCommon || (jsCommon = {}));

	

/***/ },

/***/ 309:
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
	var jsCommon;
	(function (jsCommon) {
	    var doc = document, headElement = doc.head, firstScriptInHeadElement = headElement.getElementsByTagName('script')[0], linkElement = doc.createElement('link'), scriptElement = doc.createElement('script'), styleSheetLoaded = [], javaScriptFilesLoaded = [], javaScriptFilesLoading = [];
	    linkElement.setAttribute('rel', 'stylesheet');
	    function requires(dependency, to) {
	        if (to === void 0) { to = $.noop; }
	        loadStyleSheets(dependency.cssFiles || []);
	        var scriptsToRun = dependency.javaScriptFilesWithCallback || [];
	        if (dependency.javaScriptFiles) {
	            for (var i = 0, len = dependency.javaScriptFiles.length; i < len; ++i) {
	                scriptsToRun.push({ javascriptFile: dependency.javaScriptFiles[i] });
	            }
	        }
	        loadJavaScriptFiles(scriptsToRun, to);
	    }
	    jsCommon.requires = requires;
	    /**
	     * Private Helpers.
	     */
	    function loadStyleSheets(hrefList) {
	        hrefList.forEach(function (href) {
	            if (styleSheetLoaded.indexOf(href) === -1) {
	                styleSheetLoaded.push(href);
	                loadStyleSheet(href);
	            }
	        });
	    }
	    function loadJavaScriptFiles(scripts, callback) {
	        var loadingCount = scripts.length, parsingCount = loadingCount, sourceCodeList = [];
	        function parseIfLoadingComplete() {
	            if (!--loadingCount) {
	                parseJavaScriptSourceCodes(scripts, sourceCodeList);
	            }
	        }
	        function makeCallbackIfParsingComplete() {
	            if (!--parsingCount) {
	                callback();
	            }
	        }
	        scripts.forEach(function (script, index) {
	            var file = script.javascriptFile;
	            if (javaScriptFilesLoaded.indexOf(file) === -1) {
	                if (file in javaScriptFilesLoading) {
	                    javaScriptFilesLoading[file].push(function () {
	                        parseIfLoadingComplete();
	                        makeCallbackIfParsingComplete();
	                    });
	                }
	                else {
	                    javaScriptFilesLoading[file] = [function () {
	                            makeCallbackIfParsingComplete();
	                        }];
	                    if (isExternalUrl(file)) {
	                        sourceCodeList[index] = script;
	                        parseIfLoadingComplete();
	                    }
	                    else {
	                        loadJavaScriptSourceCode(file, function (sourceCode) {
	                            sourceCodeList[index] = { javascriptFile: sourceCode };
	                            parseIfLoadingComplete();
	                        });
	                    }
	                }
	            }
	            else {
	                parseIfLoadingComplete();
	                makeCallbackIfParsingComplete();
	            }
	        });
	    }
	    function loadStyleSheet(href) {
	        var link = linkElement.cloneNode();
	        link.href = href;
	        if (firstScriptInHeadElement) {
	            headElement.insertBefore(link, firstScriptInHeadElement);
	        }
	        else {
	            headElement.appendChild(link);
	        }
	    }
	    function loadJavaScriptSourceCode(src, onload) {
	        webGet(src, function () {
	            onload(this.responseText);
	        });
	    }
	    function parseJavaScript(script, onComplete) {
	        if (onComplete === void 0) { onComplete = $.noop; }
	        if (!script) {
	            onComplete();
	            return;
	        }
	        var sourceCodeOrFileName = script.javascriptFile;
	        var targetCallback = onComplete;
	        if (script.onLoadCallback) {
	            var promiseAsCallback = function () {
	                script.onLoadCallback().then(onComplete);
	            };
	            targetCallback = promiseAsCallback;
	        }
	        isExternalUrl(sourceCodeOrFileName)
	            ? loadExternalJavaScriptFile(sourceCodeOrFileName, targetCallback)
	            : parseInternalJavaScriptCode(sourceCodeOrFileName, targetCallback);
	    }
	    function parseInternalJavaScriptCode(sourceCode, onComplete) {
	        if (onComplete === void 0) { onComplete = $.noop; }
	        var script;
	        if (sourceCode) {
	            script = scriptElement.cloneNode();
	            script.setAttribute('type', 'text/javascript');
	            script.innerHTML = sourceCode;
	            headElement.appendChild(script);
	        }
	        setTimeout(onComplete, 0);
	    }
	    function loadExternalJavaScriptFile(src, onload) {
	        var script;
	        if (src) {
	            script = scriptElement.cloneNode();
	            script.setAttribute('src', src);
	            script.setAttribute('charset', 'utf-8');
	            script.onload = onload;
	            headElement.appendChild(script);
	        }
	    }
	    function parseJavaScriptSourceCodes(scripts, sourceCodeList) {
	        asyncLoop(sourceCodeList, parseJavaScript, /*on all files parsed*/ function () {
	            scripts.forEach(function (script) {
	                var file = script.javascriptFile;
	                var listeners = javaScriptFilesLoading[file];
	                if (listeners) {
	                    listeners.forEach(function (listener) {
	                        listener();
	                    });
	                }
	                delete javaScriptFilesLoading[file];
	                if (javaScriptFilesLoaded.indexOf(file) === -1) {
	                    javaScriptFilesLoaded.push(file);
	                }
	            });
	        });
	    }
	    function webGet(src, onload, onerror) {
	        var xhr = new XMLHttpRequest();
	        try {
	            xhr.open('GET', src, true);
	            xhr.onload = onload;
	            xhr.onerror = onerror;
	            xhr.send(null);
	        }
	        catch (e) {
	        }
	    }
	    function isExternalUrl(url) {
	        var origin = location.protocol + '//' + location.host + '/';
	        return /^http[s]?:\/\/.+/i.test(url) && url.indexOf(origin) !== 0;
	    }
	    function _() {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i - 0] = arguments[_i];
	        }
	    }
	    function asyncSteps() {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i - 0] = arguments[_i];
	        }
	        if (args.length === 0) {
	            return;
	        }
	        var steps = [], i = args.length;
	        while (i--) {
	            (function (j) {
	                steps[j] = function () {
	                    args[j](steps[j + 1] || _);
	                };
	            })(i);
	        }
	        steps[0]();
	    }
	    function asyncLoop(enumerable, func, callback) {
	        var steps = [], i = 0, len = enumerable.length;
	        for (; i < len - 1; i++) {
	            (function (i) {
	                steps[i] = function (next) {
	                    func(enumerable[i], next);
	                };
	            }(i));
	        }
	        steps[len - 1] = function (next) {
	            func(enumerable[len - 1], callback);
	        };
	        asyncSteps.apply(null, steps);
	    }
	})(jsCommon || (jsCommon = {}));

	

/***/ },

/***/ 310:
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
	    function createJQueryPromiseFactory() {
	        return new JQueryPromiseFactory();
	    }
	    powerbi.createJQueryPromiseFactory = createJQueryPromiseFactory;
	    /**
	     * jQuery-based implementation of IPromiseFactory.
	     * This is useful for cases when Angular is not present, or when immediate promise resolving (not tied to Angular digest cycle) is desired.
	     */
	    var JQueryPromiseFactory = (function () {
	        function JQueryPromiseFactory() {
	        }
	        JQueryPromiseFactory.prototype.defer = function () {
	            return new JQueryDeferredWrapper($.Deferred());
	        };
	        JQueryPromiseFactory.prototype.reject = function (reason) {
	            var deferred = this.defer();
	            deferred.reject(reason);
	            return deferred.promise;
	        };
	        JQueryPromiseFactory.prototype.resolve = function (value) {
	            var deferred = this.defer();
	            deferred.resolve(value);
	            return deferred.promise;
	        };
	        JQueryPromiseFactory.prototype.all = function (promises) {
	            var unwrappedPromises = jQuery.map(promises, function (value) {
	                return value && value.promise ? value.promise : value;
	            });
	            return new JQueryPromiseWrapper($.when.apply($, unwrappedPromises));
	        };
	        JQueryPromiseFactory.prototype.allSettled = function (promises) {
	            var deferred = this.defer();
	            var promiseCount = promises.length;
	            if (promiseCount > 0) {
	                var resolvedCount_1 = 0;
	                var results_1 = [];
	                var _loop_1 = function(i) {
	                    promises[i].then(function (result) {
	                        results_1[i] = {
	                            value: result,
	                            type: 0 /* Success */
	                        };
	                    }).catch(function (result) {
	                        results_1[i] = {
	                            value: result,
	                            type: 1 /* Failure */
	                        };
	                    }).finally(function () {
	                        resolvedCount_1++;
	                        if (resolvedCount_1 === promiseCount) {
	                            deferred.resolve(results_1);
	                        }
	                    });
	                };
	                for (var i = 0; i < promiseCount; i++) {
	                    _loop_1(i);
	                }
	            }
	            else {
	                deferred.resolve([]);
	            }
	            return deferred.promise;
	        };
	        JQueryPromiseFactory.prototype.when = function (value) {
	            var unwrappedPromise = value && value.promise ? value.promise : value;
	            return new JQueryPromiseWrapper($.when(unwrappedPromise));
	        };
	        return JQueryPromiseFactory;
	    }());
	    /**
	     * Implements IDeferred via a wrapped a jQuery Deferred.
	     */
	    var JQueryDeferredWrapper = (function () {
	        function JQueryDeferredWrapper(deferred) {
	            debug.assertValue(deferred, 'deferred');
	            this.deferred = deferred;
	            this.promise = new JQueryPromiseWrapper(deferred.promise());
	        }
	        JQueryDeferredWrapper.prototype.resolve = function (value) {
	            this.deferred.resolve(value);
	        };
	        JQueryDeferredWrapper.prototype.reject = function (reason) {
	            this.deferred.reject(reason);
	        };
	        return JQueryDeferredWrapper;
	    }());
	    /**
	     * Implements IDeferred via a wrapped a jQuery Promise.
	     */
	    var JQueryPromiseWrapper = (function () {
	        function JQueryPromiseWrapper(promise) {
	            debug.assertValue(promise, 'promise');
	            this.promise = promise;
	        }
	        JQueryPromiseWrapper.prototype.then = function (a, b) {
	            return new JQueryPromiseWrapper(this.promise.then(JQueryPromiseWrapper.wrapCallback(a), JQueryPromiseWrapper.wrapCallback(b)));
	        };
	        JQueryPromiseWrapper.prototype.catch = function (callback) {
	            return this.then(null, callback);
	        };
	        JQueryPromiseWrapper.prototype.finally = function (callback) {
	            this.promise.always(JQueryPromiseWrapper.wrapCallback(callback));
	            return this;
	        };
	        /**
	         * Wraps a callback, which may return a IPromise.
	         */
	        JQueryPromiseWrapper.wrapCallback = function (callback) {
	            if (callback)
	                return function (arg) {
	                    var value = callback(arg);
	                    // If the callback returns a Promise, unwrap that to allow jQuery to chain.
	                    if (value instanceof JQueryPromiseWrapper)
	                        return value.promise;
	                    return value;
	                };
	            return callback;
	        };
	        return JQueryPromiseWrapper;
	    }());
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 311:
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
	    var LocalStorageService = (function () {
	        function LocalStorageService() {
	        }
	        LocalStorageService.prototype.getData = function (key) {
	            try {
	                if (localStorage) {
	                    var value = localStorage[key];
	                    if (value) {
	                        return JSON.parse(value);
	                    }
	                }
	            }
	            catch (exception) { }
	            return null;
	        };
	        LocalStorageService.prototype.setData = function (key, data) {
	            try {
	                if (localStorage) {
	                    localStorage[key] = JSON.stringify(data);
	                }
	            }
	            catch (e) { }
	        };
	        return LocalStorageService;
	    }());
	    var EphemeralStorageService = (function () {
	        function EphemeralStorageService(clearCacheInterval) {
	            this.cache = {};
	            this.clearCacheInterval = (clearCacheInterval != null)
	                ? clearCacheInterval
	                : EphemeralStorageService.defaultClearCacheInterval;
	            this.clearCache();
	        }
	        EphemeralStorageService.prototype.getData = function (key) {
	            return this.cache[key];
	        };
	        EphemeralStorageService.prototype.setData = function (key, data) {
	            var _this = this;
	            this.cache[key] = data;
	            if (this.clearCacheTimerId == null) {
	                this.clearCacheTimerId = setTimeout(function () { return _this.clearCache(); }, this.clearCacheInterval);
	            }
	        };
	        EphemeralStorageService.prototype.clearCache = function () {
	            this.cache = {};
	            this.clearCacheTimerId = undefined;
	        };
	        EphemeralStorageService.defaultClearCacheInterval = (1000 * 60 * 60 * 24); // 1 day
	        return EphemeralStorageService;
	    }());
	    powerbi.EphemeralStorageService = EphemeralStorageService;
	    powerbi.localStorageService = new LocalStorageService();
	    powerbi.ephemeralStorageService = new EphemeralStorageService();
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 312:
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
	var jsCommon;
	(function (jsCommon) {
	    var WordBreaker;
	    (function (WordBreaker) {
	        var SPACE = ' ';
	        var BREAKERS_REGEX = /[\s\n]+/g;
	        function search(index, content, backward) {
	            if (backward) {
	                for (var i = index - 1; i > -1; i--) {
	                    if (hasBreakers(content[i]))
	                        return i + 1;
	                }
	            }
	            else {
	                for (var i = index, ilen = content.length; i < ilen; i++) {
	                    if (hasBreakers(content[i]))
	                        return i;
	                }
	            }
	            return backward ? 0 : content.length;
	        }
	        /**
	         * Find the word nearest the cursor specified within content
	         * @param index - point within content to search forward/backward from
	         * @param content - string to search
	        */
	        function find(index, content) {
	            debug.assert(index >= 0 && index <= content.length, 'index within content string bounds');
	            var result = { start: 0, end: 0 };
	            if (content.length === 0)
	                return result;
	            result.start = search(index, content, true);
	            result.end = search(index, content, false);
	            return result;
	        }
	        WordBreaker.find = find;
	        /**
	         * Test for presence of breakers within content
	         * @param content - string to test
	        */
	        function hasBreakers(content) {
	            BREAKERS_REGEX.lastIndex = 0;
	            return BREAKERS_REGEX.test(content);
	        }
	        WordBreaker.hasBreakers = hasBreakers;
	        /**
	         * Count the number of pieces when broken by BREAKERS_REGEX
	         * ~2.7x faster than WordBreaker.split(content).length
	         * @param content - string to break and count
	        */
	        function wordCount(content) {
	            var count = 1;
	            BREAKERS_REGEX.lastIndex = 0;
	            BREAKERS_REGEX.exec(content);
	            while (BREAKERS_REGEX.lastIndex !== 0) {
	                count++;
	                BREAKERS_REGEX.exec(content);
	            }
	            return count;
	        }
	        WordBreaker.wordCount = wordCount;
	        function getMaxWordWidth(content, textWidthMeasurer, properties) {
	            var words = split(content);
	            var maxWidth = 0;
	            for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
	                var w = words_1[_i];
	                properties.text = w;
	                maxWidth = Math.max(maxWidth, textWidthMeasurer(properties));
	            }
	            return maxWidth;
	        }
	        WordBreaker.getMaxWordWidth = getMaxWordWidth;
	        function split(content) {
	            return content.split(BREAKERS_REGEX);
	        }
	        function getWidth(content, properties, textWidthMeasurer) {
	            properties.text = content;
	            return textWidthMeasurer(properties);
	        }
	        function truncate(content, properties, truncator, maxWidth) {
	            properties.text = content;
	            return truncator(properties, maxWidth);
	        }
	        /**
	         * Split content by breakers (words) and greedy fit as many words
	         * into each index in the result based on max width and number of lines
	         * e.g. Each index in result corresponds to a line of content
	         *      when used by AxisHelper.LabelLayoutStrategy.wordBreak
	         * @param content - string to split
	         * @param properties - text properties to be used by @param:textWidthMeasurer
	         * @param textWidthMeasurer - function to calculate width of given text content
	         * @param maxWidth - maximum allowed width of text content in each result
	         * @param maxNumLines - maximum number of results we will allow, valid values must be greater than 0
	         * @param truncator - (optional) if specified, used as a function to truncate content to a given width
	        */
	        function splitByWidth(content, properties, textWidthMeasurer, maxWidth, maxNumLines, truncator) {
	            // Default truncator returns string as-is
	            truncator = truncator ? truncator : function (properties, maxWidth) { return properties.text; };
	            var result = [];
	            var words = split(content);
	            var usedWidth = 0;
	            var wordsInLine = [];
	            for (var _i = 0, words_2 = words; _i < words_2.length; _i++) {
	                var word = words_2[_i];
	                // Last line? Just add whatever is left
	                if ((maxNumLines > 0) && (result.length >= maxNumLines - 1)) {
	                    wordsInLine.push(word);
	                    continue;
	                }
	                // Determine width if we add this word
	                // Account for SPACE we will add when joining...
	                var wordWidth = wordsInLine.length === 0
	                    ? getWidth(word, properties, textWidthMeasurer)
	                    : getWidth(SPACE + word, properties, textWidthMeasurer);
	                // If width would exceed max width,
	                // then push used words and start new split result
	                if (usedWidth + wordWidth > maxWidth) {
	                    // Word alone exceeds max width, just add it.
	                    if (wordsInLine.length === 0) {
	                        result.push(truncate(word, properties, truncator, maxWidth));
	                        usedWidth = 0;
	                        wordsInLine = [];
	                        continue;
	                    }
	                    result.push(truncate(wordsInLine.join(SPACE), properties, truncator, maxWidth));
	                    usedWidth = 0;
	                    wordsInLine = [];
	                }
	                // ...otherwise, add word and continue
	                wordsInLine.push(word);
	                usedWidth += wordWidth;
	            }
	            // Push remaining words onto result (if any)
	            if (!_.isEmpty(wordsInLine)) {
	                result.push(truncate(wordsInLine.join(SPACE), properties, truncator, maxWidth));
	            }
	            return result;
	        }
	        WordBreaker.splitByWidth = splitByWidth;
	    })(WordBreaker = jsCommon.WordBreaker || (jsCommon.WordBreaker = {}));
	})(jsCommon || (jsCommon = {}));

	

/***/ },

/***/ 313:
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
	    var TextMeasurementService;
	    (function (TextMeasurementService) {
	        var ellipsis = '…';
	        var OverflowingText = jsCommon.CssConstants.createClassAndSelector('overflowingText');
	        var spanElement;
	        var svgTextElement;
	        var canvasCtx;
	        var fallbackFontFamily;
	        /**
	         * Idempotent function for adding the elements to the DOM.
	         */
	        function ensureDOM() {
	            if (spanElement)
	                return;
	            spanElement = $('<span/>');
	            $('body').append(spanElement);
	            //The style hides the svg element from the canvas, preventing canvas from scrolling down to show svg black square.
	            svgTextElement = d3.select($('body').get(0))
	                .append('svg')
	                .style({
	                'height': '0px',
	                'width': '0px',
	                'position': 'absolute'
	            })
	                .append('text');
	            canvasCtx = $('<canvas/>').get(0).getContext("2d");
	            fallbackFontFamily = window.getComputedStyle(svgTextElement.node()).fontFamily;
	        }
	        /**
	         * Removes spanElement from DOM.
	         */
	        function removeSpanElement() {
	            if (spanElement && spanElement.remove) {
	                spanElement.remove();
	            }
	            spanElement = null;
	        }
	        TextMeasurementService.removeSpanElement = removeSpanElement;
	        /**
	         * This method measures the width of the text with the given SVG text properties.
	         * @param textProperties The text properties to use for text measurement.
	         * @param text The text to measure.
	         */
	        function measureSvgTextWidth(textProperties, text) {
	            debug.assertValue(textProperties, 'textProperties');
	            debug.assert(_.isEmpty(textProperties.fontSize) || textProperties.fontSize.indexOf("px") !== -1, "TextProperties' text size should be in px.");
	            ensureDOM();
	            canvasCtx.font =
	                (textProperties.fontStyle || "") + " " +
	                    (textProperties.fontVariant || "") + " " +
	                    (textProperties.fontWeight || "") + " " +
	                    textProperties.fontSize + " " +
	                    (textProperties.fontFamily || fallbackFontFamily);
	            return canvasCtx.measureText(text || textProperties.text).width;
	        }
	        TextMeasurementService.measureSvgTextWidth = measureSvgTextWidth;
	        /**
	         * This method return the rect with the given SVG text properties.
	         * @param textProperties The text properties to use for text measurement.
	         * @param text The text to measure.
	         */
	        function measureSvgTextRect(textProperties, text) {
	            debug.assertValue(textProperties, 'textProperties');
	            debug.assert(_.isEmpty(textProperties.fontSize) || textProperties.fontSize.indexOf("px") !== -1, "TextProperties' text size should be in px.");
	            ensureDOM();
	            svgTextElement.style(null);
	            svgTextElement
	                .text(text || textProperties.text)
	                .attr({
	                'visibility': 'hidden',
	                'font-family': textProperties.fontFamily || fallbackFontFamily,
	                'font-variant': textProperties.fontVariant,
	                'font-size': textProperties.fontSize,
	                'font-weight': textProperties.fontWeight,
	                'font-style': textProperties.fontStyle,
	                'white-space': textProperties.whiteSpace || 'nowrap'
	            });
	            // We're expecting the browser to give a synchronous measurement here
	            // We're using SVGTextElement because it works across all browsers 
	            return svgTextElement.node().getBBox();
	        }
	        TextMeasurementService.measureSvgTextRect = measureSvgTextRect;
	        /**
	         * This method measures the height of the text with the given SVG text properties.
	         * @param textProperties The text properties to use for text measurement.
	         * @param text The text to measure.
	         */
	        function measureSvgTextHeight(textProperties, text) {
	            return measureSvgTextRect(textProperties, text).height;
	        }
	        TextMeasurementService.measureSvgTextHeight = measureSvgTextHeight;
	        /**
	         * This method returns the text Rect with the given SVG text properties.
	         * Does NOT return text width; obliterates text value
	         * @param {TextProperties} textProperties - The text properties to use for text measurement
	         */
	        function estimateSvgTextRect(textProperties) {
	            debug.assertValue(textProperties, 'textProperties');
	            debug.assert(_.isEmpty(textProperties.fontSize) || textProperties.fontSize.indexOf("px") !== -1, "TextProperties' text size should be in px.");
	            var propertiesKey = textProperties.fontFamily + textProperties.fontSize;
	            var rect = powerbi.ephemeralStorageService.getData(propertiesKey);
	            if (rect == null) {
	                // To estimate we check the height of a particular character, once it is cached, subsequent
	                // calls should always get the height from the cache (regardless of the text).
	                var estimatedTextProperties = {
	                    fontFamily: textProperties.fontFamily,
	                    fontSize: textProperties.fontSize,
	                    text: "M",
	                };
	                rect = TextMeasurementService.measureSvgTextRect(estimatedTextProperties);
	                // NOTE: In some cases (disconnected/hidden DOM) we may provide incorrect measurement results (zero sized bounding-box), so
	                // we only store values in the cache if we are confident they are correct.
	                if (rect.height > 0)
	                    powerbi.ephemeralStorageService.setData(propertiesKey, rect);
	            }
	            return rect;
	        }
	        /**
	         * This method returns the text Rect with the given SVG text properties.
	         * @param {TextProperties} textProperties - The text properties to use for text measurement
	         */
	        function estimateSvgTextBaselineDelta(textProperties) {
	            var rect = estimateSvgTextRect(textProperties);
	            return rect.y + rect.height;
	        }
	        TextMeasurementService.estimateSvgTextBaselineDelta = estimateSvgTextBaselineDelta;
	        /**
	         * This method estimates the height of the text with the given SVG text properties.
	         * @param {TextProperties} textProperties - The text properties to use for text measurement
	         */
	        function estimateSvgTextHeight(textProperties, tightFightForNumeric) {
	            if (tightFightForNumeric === void 0) { tightFightForNumeric = false; }
	            var height = estimateSvgTextRect(textProperties).height;
	            //TODO: replace it with new baseline calculation
	            if (tightFightForNumeric)
	                height *= 0.7;
	            return height;
	        }
	        TextMeasurementService.estimateSvgTextHeight = estimateSvgTextHeight;
	        /**
	         * This method measures the width of the svgElement.
	         * @param svgElement The SVGTextElement to be measured.
	         */
	        function measureSvgTextElementWidth(svgElement) {
	            debug.assertValue(svgElement, 'svgElement');
	            return measureSvgTextWidth(getSvgMeasurementProperties(svgElement));
	        }
	        TextMeasurementService.measureSvgTextElementWidth = measureSvgTextElementWidth;
	        /**
	         * This method fetches the text measurement properties of the given DOM element.
	         * @param element The selector for the DOM Element.
	         */
	        function getMeasurementProperties(element) {
	            debug.assertValue(element, 'element');
	            return {
	                text: element.val() || element.text(),
	                fontFamily: element.css('font-family'),
	                fontSize: element.css('font-size'),
	                fontWeight: element.css('font-weight'),
	                fontStyle: element.css('font-style'),
	                fontVariant: element.css('font-variant'),
	                whiteSpace: element.css('white-space')
	            };
	        }
	        TextMeasurementService.getMeasurementProperties = getMeasurementProperties;
	        /**
	         * This method fetches the text measurement properties of the given SVG text element.
	         * @param svgElement The SVGTextElement to be measured.
	         */
	        function getSvgMeasurementProperties(svgElement) {
	            debug.assertValue(svgElement, 'svgElement');
	            var style = window.getComputedStyle(svgElement, null);
	            return {
	                text: svgElement.textContent,
	                fontFamily: style.fontFamily,
	                fontSize: style.fontSize,
	                fontWeight: style.fontWeight,
	                fontStyle: style.fontStyle,
	                fontVariant: style.fontVariant,
	                whiteSpace: style.whiteSpace
	            };
	        }
	        TextMeasurementService.getSvgMeasurementProperties = getSvgMeasurementProperties;
	        /**
	         * This method returns the width of a div element.
	         * @param element The div element.
	         */
	        function getDivElementWidth(element) {
	            debug.assert(element.is('div'), 'Given element is not a div type. Cannot get width');
	            return getComputedStyle(element[0]).width;
	        }
	        TextMeasurementService.getDivElementWidth = getDivElementWidth;
	        /**
	         * Compares labels text size to the available size and renders ellipses when the available size is smaller.
	         * @param textProperties The text properties (including text content) to use for text measurement.
	         * @param maxWidth The maximum width available for rendering the text.
	         */
	        function getTailoredTextOrDefault(textProperties, maxWidth) {
	            debug.assertValue(textProperties, 'properties');
	            debug.assertValue(textProperties.text, 'properties.text');
	            debug.assert(_.isEmpty(textProperties.fontSize) || textProperties.fontSize.indexOf("px") !== -1, "TextProperties' text size should be in px.");
	            ensureDOM();
	            var strLength = textProperties.text.length;
	            if (strLength === 0)
	                return textProperties.text;
	            var width = measureSvgTextWidth(textProperties);
	            if (width < maxWidth)
	                return textProperties.text;
	            // Create a copy of the textProperties so we don't modify the one that's passed in.
	            var copiedTextProperties = powerbi.Prototype.inherit(textProperties);
	            // Take the properties and apply them to svgTextElement
	            // Then, do the binary search to figure out the substring we want
	            // Set the substring on textElement argument
	            var text = copiedTextProperties.text = ellipsis + copiedTextProperties.text;
	            var min = 1;
	            var max = text.length;
	            var i = ellipsis.length;
	            while (min <= max) {
	                // num | 0 prefered to Math.floor(num) for performance benefits
	                i = (min + max) / 2 | 0;
	                copiedTextProperties.text = text.substr(0, i);
	                width = measureSvgTextWidth(copiedTextProperties);
	                if (maxWidth > width)
	                    min = i + 1;
	                else if (maxWidth < width)
	                    max = i - 1;
	                else
	                    break;
	            }
	            // Since the search algorithm almost never finds an exact match,
	            // it will pick one of the closest two, which could result in a
	            // value bigger with than 'maxWidth' thus we need to go back by 
	            // one to guarantee a smaller width than 'maxWidth'.
	            copiedTextProperties.text = text.substr(0, i);
	            width = measureSvgTextWidth(copiedTextProperties);
	            if (width > maxWidth)
	                i--;
	            return text.substr(ellipsis.length, i - ellipsis.length) + ellipsis;
	        }
	        TextMeasurementService.getTailoredTextOrDefault = getTailoredTextOrDefault;
	        /**
	         * Compares labels text size to the available size and renders ellipses when the available size is smaller.
	         * @param textElement The SVGTextElement containing the text to render.
	         * @param maxWidth The maximum width available for rendering the text.
	         */
	        function svgEllipsis(textElement, maxWidth) {
	            debug.assertValue(textElement, 'textElement');
	            var properties = getSvgMeasurementProperties(textElement);
	            var originalText = properties.text;
	            var tailoredText = getTailoredTextOrDefault(properties, maxWidth);
	            if (originalText !== tailoredText) {
	                textElement.textContent = tailoredText;
	            }
	        }
	        TextMeasurementService.svgEllipsis = svgEllipsis;
	        /**
	         * Word break textContent of <text> SVG element into <tspan>s
	         * Each tspan will be the height of a single line of text
	         * @param textElement - the SVGTextElement containing the text to wrap
	         * @param maxWidth - the maximum width available
	         * @param maxHeight - the maximum height available (defaults to single line)
	         * @param linePadding - (optional) padding to add to line height
	         */
	        function wordBreak(textElement, maxWidth, maxHeight, linePadding) {
	            if (linePadding === void 0) { linePadding = 0; }
	            debug.assertValue(textElement, 'textElement');
	            var properties = getSvgMeasurementProperties(textElement);
	            var height = estimateSvgTextHeight(properties) + linePadding;
	            var maxNumLines = Math.max(1, Math.floor(maxHeight / height));
	            var node = d3.select(textElement);
	            // Save y of parent textElement to apply as first tspan dy
	            var firstDY = node.attr('y');
	            // Store and clear text content
	            var labelText = textElement.textContent;
	            textElement.textContent = null;
	            // Append a tspan for each word broken section
	            var words = jsCommon.WordBreaker.splitByWidth(labelText, properties, measureSvgTextWidth, maxWidth, maxNumLines);
	            for (var i = 0, ilen = words.length; i < ilen; i++) {
	                properties.text = words[i];
	                node
	                    .append('tspan')
	                    .attr({
	                    'x': 0,
	                    'dy': i === 0 ? firstDY : height,
	                })
	                    .text(getTailoredTextOrDefault(properties, maxWidth));
	            }
	        }
	        TextMeasurementService.wordBreak = wordBreak;
	        /**
	         * Word break textContent of span element into <span>s
	         * Each span will be the height of a single line of text
	         * @param textElement - the element containing the text to wrap
	         * @param maxWidth - the maximum width available
	         * @param maxHeight - the maximum height available (defaults to single line)
	         * @param linePadding - (optional) padding to add to line height
	         */
	        function wordBreakOverflowingText(textElement, maxWidth, maxHeight, linePadding) {
	            if (linePadding === void 0) { linePadding = 0; }
	            debug.assertValue(textElement, 'textElement');
	            var properties = getSvgMeasurementProperties(textElement);
	            var height = estimateSvgTextHeight(properties) + linePadding;
	            var maxNumLines = Math.max(1, Math.floor(maxHeight / height));
	            // Store and clear text content
	            var labelText = textElement.textContent;
	            textElement.textContent = null;
	            // Append a span for each word broken section
	            var words = jsCommon.WordBreaker.splitByWidth(labelText, properties, measureSvgTextWidth, maxWidth, maxNumLines);
	            var spanItem = d3.select(textElement)
	                .selectAll(OverflowingText.selector)
	                .data(words, function (d) { return $.inArray(d, words); });
	            spanItem
	                .enter()
	                .append("span")
	                .classed(OverflowingText.class, true)
	                .text(function (d) { return d; })
	                .style("width", jsCommon.PixelConverter.toString(maxWidth));
	        }
	        TextMeasurementService.wordBreakOverflowingText = wordBreakOverflowingText;
	    })(TextMeasurementService = powerbi.TextMeasurementService || (powerbi.TextMeasurementService = {}));
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 314:
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
	var jsCommon;
	(function (jsCommon) {
	    var DOMConstants = jsCommon.DOMConstants;
	    var KeyUtils;
	    (function (KeyUtils) {
	        function isArrowKey(keyCode) {
	            return keyCode === DOMConstants.downArrowKeyCode
	                || keyCode === DOMConstants.upArrowKeyCode
	                || keyCode === DOMConstants.leftArrowKeyCode
	                || keyCode === DOMConstants.rightArrowKeyCode;
	        }
	        KeyUtils.isArrowKey = isArrowKey;
	        function isCtrlDefaultKey(keyCode) {
	            return keyCode === DOMConstants.aKeyCode
	                || keyCode === DOMConstants.cKeyCode
	                || keyCode === DOMConstants.xKeyCode
	                || keyCode === DOMConstants.vKeyCode;
	        }
	        KeyUtils.isCtrlDefaultKey = isCtrlDefaultKey;
	        function isNudgeModifierKey(keyCode) {
	            return keyCode === DOMConstants.shiftKeyCode;
	        }
	        KeyUtils.isNudgeModifierKey = isNudgeModifierKey;
	    })(KeyUtils = jsCommon.KeyUtils || (jsCommon.KeyUtils = {}));
	})(jsCommon || (jsCommon = {}));

	

/***/ },

/***/ 315:
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
	var jsCommon;
	(function (jsCommon) {
	    /**
	     * Responsible for throttling input function.
	     */
	    var ThrottleUtility = (function () {
	        function ThrottleUtility(delay) {
	            this.timerFactory = jsCommon.TimerPromiseFactory.instance;
	            this.delay = 0;
	            if (delay) {
	                this.delay = delay;
	            }
	        }
	        ThrottleUtility.prototype.run = function (fn) {
	            var _this = this;
	            if (!this.fn) {
	                this.fn = fn;
	                this.timerFactory.create(this.delay).done(function () { return _this.timerComplete(_this.fn); });
	            }
	            else {
	                this.fn = fn;
	            }
	        };
	        /**
	         * Note: Public for testing purpose.
	         */
	        ThrottleUtility.prototype.timerComplete = function (fn) {
	            // run fn
	            fn();
	            // clear fn
	            this.fn = null;
	        };
	        return ThrottleUtility;
	    }());
	    jsCommon.ThrottleUtility = ThrottleUtility;
	})(jsCommon || (jsCommon = {}));

	

/***/ },

/***/ 316:
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
	var jsCommon;
	(function (jsCommon) {
	    /**
	     * Responsible for creating timer promises.
	     */
	    var TimerPromiseFactory = (function () {
	        function TimerPromiseFactory() {
	        }
	        /**
	         * {@inheritDoc}
	         */
	        TimerPromiseFactory.prototype.create = function (delayInMs) {
	            debug.assertValue(delayInMs, 'delayInMs');
	            debug.assert(delayInMs >= 0, 'delayInMs must be a positive value.');
	            var deferred = $.Deferred();
	            window.setTimeout(function () { return deferred.resolve(); }, delayInMs);
	            return deferred;
	        };
	        TimerPromiseFactory.instance = new TimerPromiseFactory();
	        return TimerPromiseFactory;
	    }());
	    jsCommon.TimerPromiseFactory = TimerPromiseFactory;
	})(jsCommon || (jsCommon = {}));

	

/***/ },

/***/ 317:
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
	var jsCommon;
	(function (jsCommon) {
	    var UrlUtils;
	    (function (UrlUtils) {
	        var urlRegex = /http[s]?:\/\/(\S)+/gi;
	        function isValidUrl(value) {
	            if (jsCommon.StringExtensions.isNullOrEmpty(value))
	                return false;
	            var match = jsCommon.RegExpExtensions.run(urlRegex, value);
	            if (!!match && match.index === 0)
	                return true;
	            return false;
	        }
	        UrlUtils.isValidUrl = isValidUrl;
	        /* Tests whether a URL is valid.
	         * @param url The url to be tested.
	         * @returns Whether the provided url is valid.
	         **/
	        function isValidImageUrl(url) {
	            // VSTS: 7252099 / 7112236
	            // For now, passes for any valid Url
	            return isValidUrl(url);
	        }
	        UrlUtils.isValidImageUrl = isValidImageUrl;
	        function findAllValidUrls(text) {
	            if (jsCommon.StringExtensions.isNullOrEmpty(text))
	                return [];
	            // Find all urls in the text.
	            // TODO: This could potentially be expensive, maybe include a cap here for text with many urls?
	            var urlRanges = [];
	            var matches;
	            var start = 0;
	            while ((matches = jsCommon.RegExpExtensions.run(urlRegex, text, start)) !== null) {
	                var url = matches[0];
	                var end = matches.index + url.length;
	                urlRanges.push({
	                    start: matches.index,
	                    end: end,
	                    text: url,
	                });
	                start = end;
	            }
	            return urlRanges;
	        }
	        UrlUtils.findAllValidUrls = findAllValidUrls;
	        function getBase64ContentFromDataUri(uri) {
	            if (uri.indexOf('data:') !== 0)
	                throw new Error("Expected data uri");
	            // Locate the base 64 content from the URL (e.g. "data:image/png;base64,xxxxx=")
	            var base64Token = ";base64,";
	            var indexBase64TokenStart = uri.indexOf(base64Token);
	            if (indexBase64TokenStart < 0)
	                throw new Error("Expected base 64 content in data url");
	            var indexBase64Start = indexBase64TokenStart + base64Token.length;
	            return uri.substr(indexBase64Start, uri.length - indexBase64Start);
	        }
	        UrlUtils.getBase64ContentFromDataUri = getBase64ContentFromDataUri;
	    })(UrlUtils = jsCommon.UrlUtils || (jsCommon.UrlUtils = {}));
	})(jsCommon || (jsCommon = {}));

	

/***/ },

/***/ 318:
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
	var jsCommon;
	(function (jsCommon) {
	    var BrowserUtils;
	    (function (BrowserUtils) {
	        function isChrome() {
	            var vendorName = window.navigator.vendor || "";
	            var userAgent = window.navigator.userAgent.toLowerCase();
	            return vendorName.toLowerCase().indexOf('google') > -1 &&
	                userAgent.indexOf('chrome') > -1 &&
	                userAgent.indexOf('edge') === -1 &&
	                userAgent.indexOf('opr') === -1;
	        }
	        BrowserUtils.isChrome = isChrome;
	        function isInternetExplorerOrEdge() {
	            var userAgent = window.navigator.userAgent.toLowerCase();
	            return userAgent.indexOf('msie') > -1
	                || userAgent.indexOf('trident') > -1
	                || userAgent.indexOf('edge') > -1;
	        }
	        BrowserUtils.isInternetExplorerOrEdge = isInternetExplorerOrEdge;
	        /**
	         * Get the current version of IE
	         * @returns The version of Internet Explorer or a 0 (indicating the use of another browser).
	         */
	        function getInternetExplorerVersion() {
	            var retValue = 0;
	            if (navigator.appName === 'Microsoft Internet Explorer' || window.navigator.userAgent.indexOf('MSIE') >= 0) {
	                var re = new RegExp('MSIE ([0-9]{1,}[\\.0-9]{0,})');
	                var result = re.exec(window.navigator.userAgent);
	                if (result) {
	                    retValue = parseFloat(result[1]);
	                }
	            }
	            return retValue;
	        }
	        BrowserUtils.getInternetExplorerVersion = getInternetExplorerVersion;
	        function isFirefox() {
	            return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	        }
	        BrowserUtils.isFirefox = isFirefox;
	    })(BrowserUtils = jsCommon.BrowserUtils || (jsCommon.BrowserUtils = {}));
	})(jsCommon || (jsCommon = {}));

	

/***/ },

/***/ 319:
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
	        var utility;
	        (function (utility) {
	            var StyleUtils;
	            (function (StyleUtils) {
	                function getRotateAngleFromElement(element) {
	                    var rawElemStyle = element.get(0).style;
	                    var transformString = rawElemStyle.transform || rawElemStyle.webkitTransform;
	                    if (transformString) {
	                        var transform = transformString.match(/rotate\((-?\d+(?:\.\d*)?)deg\)/);
	                        if (transform) {
	                            return parseFloat(transform[1]);
	                        }
	                    }
	                    return 0;
	                }
	                StyleUtils.getRotateAngleFromElement = getRotateAngleFromElement;
	                function getTranslateTransformFromElement(element) {
	                    var rawElemStyle = element.get(0).style;
	                    // IE will recognize "webkitTransform" as "WebkitTransform" and set that as style property. 
	                    // This means transform property is not read.
	                    // We put the "transform" before the "webkitTransform" to counteract the weirdness of IE. 
	                    var transformString = rawElemStyle.transform || rawElemStyle.webkitTransform;
	                    var retValue = { x: 0, y: 0 };
	                    if (transformString && transformString.length > 0) {
	                        var transform = transformString.match(/translate\((-?\d+(?:\.\d*)?)px, (-?\d+(?:\.\d*)?)px\)/);
	                        if (transform) {
	                            retValue.x = parseFloat(transform[1]);
	                            retValue.y = parseFloat(transform[2]);
	                        }
	                    }
	                    return retValue;
	                }
	                StyleUtils.getTranslateTransformFromElement = getTranslateTransformFromElement;
	                function getPadding(element) {
	                    if (!element)
	                        return;
	                    return {
	                        left: parseFloat(element.css('padding-left')) || 0,
	                        right: parseFloat(element.css('padding-right')) || 0,
	                        top: parseFloat(element.css('padding-top')) || 0,
	                        bottom: parseFloat(element.css('padding-bottom')) || 0,
	                    };
	                }
	                StyleUtils.getPadding = getPadding;
	            })(StyleUtils = utility.StyleUtils || (utility.StyleUtils = {}));
	        })(utility = visuals.utility || (visuals.utility = {}));
	    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
	})(powerbi || (powerbi = {}));

	

/***/ },

/***/ 320:
/***/ function(module, exports, __webpack_require__) {

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
	var jsCommon;
	(function (jsCommon) {
	    var ConsoleTracer = (function () {
	        function ConsoleTracer() {
	        }
	        ConsoleTracer.prototype.logTrace = function (trace) {
	            if (true) {
	                switch (trace.type) {
	                    case jsCommon.TraceType.Information:
	                        console.info(trace.toString());
	                        break;
	                    case jsCommon.TraceType.UnexpectedError:
	                    case jsCommon.TraceType.Error:
	                    case jsCommon.TraceType.Fatal:
	                        console.error(trace.toString());
	                        break;
	                    case jsCommon.TraceType.ExpectedError:
	                    case jsCommon.TraceType.Warning:
	                        console.warn(trace.toString());
	                        break;
	                    case jsCommon.TraceType.Verbose:
	                        console.log(trace.toString());
	                        break;
	                    default:
	                        console.log(trace.toString());
	                        break;
	                }
	            }
	        };
	        return ConsoleTracer;
	    }());
	    jsCommon.ConsoleTracer = ConsoleTracer;
	    var Trace;
	    (function (Trace) {
	        var traceMaxCount = 1000;
	        var traces = new Array(traceMaxCount);
	        var lastTraceIndex = -1;
	        var defaultListener = new ConsoleTracer();
	        var listeners = new Array(defaultListener);
	        /**
	         * Trace a warning. Please ensure that no PII is being logged.
	         */
	        function warning(text, requestId) {
	            debug.assertValue(text, 'text');
	            logTraceInternal(new jsCommon.TraceItem(text, jsCommon.TraceType.Warning, requestId));
	        }
	        Trace.warning = warning;
	        /**
	         * Trace an error. Please ensure that no PII is being logged.
	         */
	        function error(text, includeStackTrace, requestId) {
	            debug.assertValue(text, 'text');
	            if (includeStackTrace)
	                text = jsCommon.StringExtensions.format("{0}.\nStack:\n{1}", text, jsCommon.getStackTrace());
	            logTraceInternal(new jsCommon.TraceItem(text, jsCommon.TraceType.Error, requestId));
	        }
	        Trace.error = error;
	        /**
	         * Trace an information. Please ensure that no PII is being logged.
	         */
	        function verbose(text, requestId) {
	            debug.assertValue(text, 'text');
	            logTraceInternal(new jsCommon.TraceItem(text, jsCommon.TraceType.Verbose, requestId));
	        }
	        Trace.verbose = verbose;
	        function addListener(listener) {
	            debug.assertValue(listener, 'listener');
	            listeners.push(listener);
	        }
	        Trace.addListener = addListener;
	        function removeListener(listener) {
	            debug.assertValue(listener, 'listener');
	            var index = listeners.indexOf(listener);
	            if (index >= 0)
	                listeners.splice(index, 1);
	        }
	        Trace.removeListener = removeListener;
	        function resetListeners() {
	            listeners = new Array(defaultListener);
	        }
	        Trace.resetListeners = resetListeners;
	        function reset() {
	            lastTraceIndex = -1;
	        }
	        Trace.reset = reset;
	        function getTraces() {
	            if (lastTraceIndex < 0)
	                return;
	            var result = new Array(lastTraceIndex + 1);
	            for (var i = 0; i <= lastTraceIndex; i++)
	                result[i] = traces[i];
	            return result;
	        }
	        Trace.getTraces = getTraces;
	        /**
	         * Note: Used for unit-test only.
	         */
	        function disableDefaultListener() {
	            removeListener(defaultListener);
	        }
	        Trace.disableDefaultListener = disableDefaultListener;
	        function enableDefaultListener() {
	            addListener(defaultListener);
	        }
	        Trace.enableDefaultListener = enableDefaultListener;
	        function logTraceInternal(trace) {
	            if ((lastTraceIndex + 1) >= traceMaxCount)
	                reset();
	            traces[++lastTraceIndex] = trace;
	            for (var i = 0, len = listeners.length; i < len; i++)
	                listeners[i].logTrace(trace);
	        }
	    })(Trace = jsCommon.Trace || (jsCommon.Trace = {}));
	})(jsCommon || (jsCommon = {}));

	

/***/ },

/***/ 321:
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
	var jsCommon;
	(function (jsCommon) {
	    /**
	     * The types of possible traces within the system, this aligns to the traces available in Cloud Platform.
	     */
	    (function (TraceType) {
	        TraceType[TraceType["Information"] = 0] = "Information";
	        TraceType[TraceType["Verbose"] = 1] = "Verbose";
	        TraceType[TraceType["Warning"] = 2] = "Warning";
	        TraceType[TraceType["Error"] = 3] = "Error";
	        TraceType[TraceType["ExpectedError"] = 4] = "ExpectedError";
	        TraceType[TraceType["UnexpectedError"] = 5] = "UnexpectedError";
	        TraceType[TraceType["Fatal"] = 6] = "Fatal";
	    })(jsCommon.TraceType || (jsCommon.TraceType = {}));
	    var TraceType = jsCommon.TraceType;
	})(jsCommon || (jsCommon = {}));

	

/***/ },

/***/ 322:
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
	var jsCommon;
	(function (jsCommon) {
	    /**
	     * JavaScript files.
	     */
	    var MSMapcontrol = 'https://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&s=1&onscriptload=globalMapControlLoaded';
	    /**
	     * Map loading logic.
	     */
	    var MSMapcontrolLoaded = false;
	    var WaitForMSMapLoad = null;
	    var PowerViewPackage = {
	        javaScriptFiles: [
	            powerbi.build + '/externals/pv/webclient.js'
	        ],
	        cssFiles: [
	            powerbi.build + '/externals/pv/Styles/_all.css'
	        ],
	        javaScriptFilesWithCallback: [
	            { javascriptFile: MSMapcontrol, onLoadCallback: waitForMapControlLoaded }
	        ]
	    };
	    function ensurePowerView(action) {
	        if (action === void 0) { action = _.noop; }
	        jsCommon.requires(PowerViewPackage, action);
	    }
	    jsCommon.ensurePowerView = ensurePowerView;
	    var MapPackage = {
	        javaScriptFilesWithCallback: [
	            { javascriptFile: MSMapcontrol, onLoadCallback: waitForMapControlLoaded }
	        ]
	    };
	    function ensureMap(locale, action) {
	        var mapPackageWithLocale = powerbi.Prototype.inherit(MapPackage);
	        if (!_.isEmpty(locale)) {
	            var localeSplit = locale.split('-', 2);
	            mapPackageWithLocale.javaScriptFilesWithCallback[0].javascriptFile = MSMapcontrol.concat('&mkt=' + locale + '&ur=' + (localeSplit.length > 1 ? localeSplit[1] : locale));
	        }
	        jsCommon.requires(mapPackageWithLocale, action);
	    }
	    jsCommon.ensureMap = ensureMap;
	    function mapControlLoaded() {
	        MSMapcontrolLoaded = true;
	        if (WaitForMSMapLoad) {
	            WaitForMSMapLoad.resolve();
	            WaitForMSMapLoad = undefined;
	        }
	    }
	    jsCommon.mapControlLoaded = mapControlLoaded;
	    function waitForMapControlLoaded() {
	        var task;
	        if (!MSMapcontrolLoaded) {
	            task = WaitForMSMapLoad = $.Deferred();
	        }
	        else {
	            task = $.Deferred();
	            task.resolve();
	        }
	        return task.promise();
	    }
	    jsCommon.waitForMapControlLoaded = waitForMapControlLoaded;
	})(jsCommon || (jsCommon = {}));
	/* tslint:disable:no-unused-variable */
	globalMapControlLoaded = function () {
	    // Map requires a function in the global namespace to callback once loaded
	    jsCommon.mapControlLoaded();
	};
	/* tslint:enable:no-unused-variable */ 

	

/***/ },

/***/ 323:
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
	/// <reference path="./_references.ts"/>
	var InJs;
	(function (InJs) {
	    /**
	     * The types of possible traces within the system, this aligns to the traces available in Cloud Platform.
	     */
	    (function (TraceType) {
	        TraceType[TraceType["information"] = 0] = "information";
	        TraceType[TraceType["verbose"] = 1] = "verbose";
	        TraceType[TraceType["warning"] = 2] = "warning";
	        TraceType[TraceType["error"] = 3] = "error";
	        TraceType[TraceType["expectedError"] = 4] = "expectedError";
	        TraceType[TraceType["unexpectedError"] = 5] = "unexpectedError";
	        TraceType[TraceType["fatal"] = 6] = "fatal";
	    })(InJs.TraceType || (InJs.TraceType = {}));
	    var TraceType = InJs.TraceType;
	})(InJs || (InJs = {}));

	

/***/ }

/******/ });
//# sourceMappingURL=VisualsCommon.js.map