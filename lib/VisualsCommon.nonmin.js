!function(modules) {
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            exports: {},
            id: moduleId,
            loaded: !1
        };
        return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
        module.loaded = !0, module.exports;
    }
    var installedModules = {};
    return __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
    __webpack_require__.p = "", __webpack_require__(0);
}({
    0: function(module, exports, __webpack_require__) {
        module.exports = __webpack_require__(291);
    },
    66: function(module, exports) {
        var debug, debug = (window.jsCommon, window.powerbi, window.powerbitests, window.InJs, 
        window.debug);
        window.jasmine, window.Microsoft;
        !function(debug) {
            function assert(condition, message) {
                condition !== !0 && assertFail(message || "condition: " + condition);
            }
            function assertValue(value, message) {
                null !== value && void 0 !== value || assertFail(message || "condition: " + value);
            }
            function assertNonEmpty(value, message) {
                null != value && value.length > 0 || assertFail(message || "condition: " + value);
            }
            function assertAnyValue(value, message) {}
            function assertFail(message) {
                (debug.assertFailFunction || alert)("Debug Assert failed: " + message);
            }
            debug.assert = assert, debug.assertValue = assertValue, debug.assertNonEmpty = assertNonEmpty, 
            debug.assertAnyValue = assertAnyValue, debug.assertFail = assertFail;
        }(debug || (debug = {}));
    },
    67: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        !function(jsCommon) {
            function getStackTrace(leadingFramesToRemove) {
                void 0 === leadingFramesToRemove && (leadingFramesToRemove = 1);
                var stackTrace, stackSegments;
                try {
                    throw new Error();
                } catch (error) {
                    stackTrace = error.stack, null != stackTrace && (stackSegments = stackTrace.split("\n"), 
                    stackSegments.splice(1, leadingFramesToRemove), stackTrace = stackSegments.join("\n"));
                }
                return stackTrace;
            }
            var Errors;
            !function(Errors) {
                function infoNavAppAlreadyPresent() {
                    return {
                        name: "infoNavAppAlreadyPresent",
                        message: "Cannot initialize embedded scenario when the InfoNav App is already present in this context",
                        stack: getExceptionStackTrace()
                    };
                }
                function invalidOperation(message) {
                    return {
                        name: "invalidOperation",
                        message: message,
                        stack: getExceptionStackTrace()
                    };
                }
                function argument(argumentName, message) {
                    return {
                        name: "invalidArgumentError",
                        argument: argumentName,
                        message: message,
                        stack: getExceptionStackTrace()
                    };
                }
                function argumentNull(argumentName) {
                    return {
                        name: "argumentNull",
                        argument: argumentName,
                        message: "Argument was null",
                        stack: getExceptionStackTrace()
                    };
                }
                function argumentUndefined(argumentName) {
                    return {
                        name: "argumentUndefined",
                        argument: argumentName,
                        message: "Argument was undefined",
                        stack: getExceptionStackTrace()
                    };
                }
                function argumentOutOfRange(argumentName) {
                    return {
                        name: "argumentOutOfRange",
                        argument: argumentName,
                        message: "Argument was out of range",
                        stack: getExceptionStackTrace()
                    };
                }
                function pureVirtualMethodException(className, methodName) {
                    return {
                        name: "pureVirtualMethodException",
                        message: "This method must be overriden by the derived class:" + className + "." + methodName,
                        stack: getExceptionStackTrace()
                    };
                }
                function notImplementedException(message) {
                    return {
                        name: "notImplementedException",
                        message: message,
                        stack: getExceptionStackTrace()
                    };
                }
                function getExceptionStackTrace() {
                    return getStackTrace(2);
                }
                Errors.infoNavAppAlreadyPresent = infoNavAppAlreadyPresent, Errors.invalidOperation = invalidOperation, 
                Errors.argument = argument, Errors.argumentNull = argumentNull, Errors.argumentUndefined = argumentUndefined, 
                Errors.argumentOutOfRange = argumentOutOfRange, Errors.pureVirtualMethodException = pureVirtualMethodException, 
                Errors.notImplementedException = notImplementedException;
            }(Errors = jsCommon.Errors || (jsCommon.Errors = {})), jsCommon.getStackTrace = getStackTrace;
        }(jsCommon || (jsCommon = {}));
    },
    68: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        !function(jsCommon) {
            var Lazy = function() {
                function Lazy(factoryMethod) {
                    jsCommon.Utility.throwIfNullOrUndefined(factoryMethod, this, "constructor", "factoryMethod"), 
                    this.factoryMethod = factoryMethod;
                }
                return Lazy.prototype.getValue = function() {
                    return null !== this.factoryMethod && (this.value = this.factoryMethod(), this.factoryMethod = null), 
                    this.value;
                }, Lazy;
            }();
            jsCommon.Lazy = Lazy;
        }(jsCommon || (jsCommon = {}));
    },
    69: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            var Prototype;
            !function(Prototype) {
                function inherit(obj, extension) {
                    function wrapCtor() {}
                    wrapCtor.prototype = obj;
                    var inherited = new wrapCtor();
                    return extension && extension(inherited), inherited;
                }
                function inheritSingle(obj) {
                    var proto = Object.getPrototypeOf(obj);
                    return proto !== Object.prototype && proto !== Array.prototype || (obj = inherit(obj)), 
                    obj;
                }
                function overrideArray(prototype, override) {
                    if (prototype) {
                        for (var overwritten, i = 0, len = prototype.length; len > i; i++) {
                            var value = override(prototype[i]);
                            value && (overwritten || (overwritten = inherit(prototype)), overwritten[i] = value);
                        }
                        return overwritten;
                    }
                }
                Prototype.inherit = inherit, Prototype.inheritSingle = inheritSingle, Prototype.overrideArray = overrideArray;
            }(Prototype = powerbi.Prototype || (powerbi.Prototype = {}));
        }(powerbi || (powerbi = {}));
    },
    70: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        !function(jsCommon) {
            !function(HttpStatusCode) {
                HttpStatusCode[HttpStatusCode.OK = 200] = "OK", HttpStatusCode[HttpStatusCode.BadRequest = 400] = "BadRequest", 
                HttpStatusCode[HttpStatusCode.Unauthorized = 401] = "Unauthorized", HttpStatusCode[HttpStatusCode.Forbidden = 403] = "Forbidden", 
                HttpStatusCode[HttpStatusCode.RequestEntityTooLarge = 413] = "RequestEntityTooLarge";
            }(jsCommon.HttpStatusCode || (jsCommon.HttpStatusCode = {}));
            var HttpConstants;
            jsCommon.HttpStatusCode;
            !function(HttpConstants) {
                HttpConstants.ApplicationOctetStream = "application/octet-stream", HttpConstants.MultiPartFormData = "multipart/form-data";
            }(HttpConstants = jsCommon.HttpConstants || (jsCommon.HttpConstants = {}));
            var StringExtensions;
            !function(StringExtensions) {
                function format() {
                    for (var args = [], _i = 0; _i < arguments.length; _i++) args[_i - 0] = arguments[_i];
                    var s = args[0];
                    if (isNullOrUndefinedOrWhiteSpaceString(s)) return s;
                    for (var i = 0; i < args.length - 1; i++) {
                        var reg = new RegExp("\\{" + i + "\\}", "gm");
                        s = s.replace(reg, args[i + 1]);
                    }
                    return s;
                }
                function equalIgnoreCase(a, b) {
                    return StringExtensions.normalizeCase(a) === StringExtensions.normalizeCase(b);
                }
                function startsWithIgnoreCase(a, b) {
                    var normalizedSearchString = StringExtensions.normalizeCase(b);
                    return 0 === StringExtensions.normalizeCase(a).indexOf(normalizedSearchString);
                }
                function startsWith(a, b) {
                    return 0 === a.indexOf(b);
                }
                function contains(source, substring) {
                    return null == source ? !1 : -1 !== source.indexOf(substring);
                }
                function containsIgnoreCase(source, substring) {
                    return null == source ? !1 : contains(normalizeCase(source), normalizeCase(substring));
                }
                function normalizeCase(value) {
                    return Utility.throwIfNullOrUndefined(value, StringExtensions, "normalizeCase", "value"), 
                    value.toUpperCase();
                }
                function isNullOrEmpty(value) {
                    return null == value || 0 === value.length;
                }
                function isNullOrUndefinedOrWhiteSpaceString(str) {
                    return StringExtensions.isNullOrEmpty(str) || StringExtensions.isNullOrEmpty(str.trim());
                }
                function containsWhitespace(str) {
                    Utility.throwIfNullOrUndefined(str, this, "containsWhitespace", "str");
                    var expr = /\s/;
                    return expr.test(str);
                }
                function isWhitespace(str) {
                    return Utility.throwIfNullOrUndefined(str, this, "isWhitespace", "str"), "" === str.trim();
                }
                function trimTrailingWhitespace(str) {
                    return Utility.throwIfNullOrUndefined(str, this, "trimTrailingWhitespace", "str"), 
                    str.replace(/\s+$/, "");
                }
                function trimWhitespace(str) {
                    return Utility.throwIfNullOrUndefined(str, this, "trimWhitespace", "str"), str.replace(/^\s+/, "").replace(/\s+$/, "");
                }
                function getLengthDifference(left, right) {
                    return Utility.throwIfNullOrUndefined(left, this, "getLengthDifference", "left"), 
                    Utility.throwIfNullOrUndefined(right, this, "getLengthDifference", "right"), Math.abs(left.length - right.length);
                }
                function repeat(char, count) {
                    for (var result = "", i = 0; count > i; i++) result += char;
                    return result;
                }
                function replaceAll(text, textToFind, textToReplace) {
                    if (!textToFind) return text;
                    var pattern = escapeStringForRegex(textToFind);
                    return text.replace(new RegExp(pattern, "gi"), textToReplace);
                }
                function ensureUniqueNames(names) {
                    for (var usedNames = {}, _i = 0, names_1 = names; _i < names_1.length; _i++) {
                        var name_1 = names_1[_i];
                        usedNames[name_1] = !1;
                    }
                    for (var uniqueNames = [], _a = 0, names_2 = names; _a < names_2.length; _a++) {
                        var name_2 = names_2[_a], uniqueName = name_2;
                        if (usedNames[uniqueName]) for (var counter = 0; void 0 !== usedNames[uniqueName]; ) uniqueName = name_2 + "." + ++counter;
                        uniqueNames.push(uniqueName), usedNames[uniqueName] = !0;
                    }
                    return uniqueNames;
                }
                function findUniqueName(usedNames, baseName) {
                    for (var i = 0, uniqueName = baseName; usedNames[uniqueName]; ) uniqueName = baseName + ++i;
                    return uniqueName;
                }
                function constructCommaSeparatedList(list, resourceProvider, maxValue) {
                    if (!list || 0 === list.length) return "";
                    null !== maxValue && void 0 !== maxValue || (maxValue = Number.MAX_VALUE);
                    for (var length = Math.min(maxValue, list.length), replacedList = [], j = 0; 2 > j; j++) for (var targetValue = "{" + j + "}", replaceValue = "_|_<" + j + ">_|_", i = 0; length > i; i++) list[i].indexOf(targetValue) > -1 && (list[i] = list[i].replace(targetValue, replaceValue), 
                    replacedList.push({
                        targetValue: targetValue,
                        replaceValue: replaceValue
                    }));
                    for (var commaSeparatedList = "", i = 0; length > i; i++) commaSeparatedList = 0 === i ? list[i] : StringExtensions.format(resourceProvider.get("FilterRestatement_Comma"), commaSeparatedList, list[i]);
                    for (var i = 0; i < replacedList.length; i++) commaSeparatedList = commaSeparatedList.replace(replacedList[i].replaceValue, replacedList[i].targetValue);
                    return commaSeparatedList;
                }
                function escapeStringForRegex(s) {
                    return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1");
                }
                function normalizeFileName(fileName) {
                    return fileName.replace(/[\<\>\:"\/\\\|\?*]/g, "");
                }
                function stringifyAsPrettyJSON(object) {
                    return JSON.stringify(object);
                }
                function deriveClsCompliantName(input, fallback) {
                    var result = input.replace(/^[^A-Za-z]*/g, "").replace(/[ :\.\/\\\-\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]/g, "_").replace(/[\W]/g, "");
                    return result.length > 0 ? result : fallback;
                }
                function stripTagDelimiters(s) {
                    return s.replace(HtmlTagRegex, "");
                }
                var HtmlTagRegex = new RegExp("[<>]", "g");
                StringExtensions.format = format, StringExtensions.equalIgnoreCase = equalIgnoreCase, 
                StringExtensions.startsWithIgnoreCase = startsWithIgnoreCase, StringExtensions.startsWith = startsWith, 
                StringExtensions.contains = contains, StringExtensions.containsIgnoreCase = containsIgnoreCase, 
                StringExtensions.normalizeCase = normalizeCase, StringExtensions.isNullOrEmpty = isNullOrEmpty, 
                StringExtensions.isNullOrUndefinedOrWhiteSpaceString = isNullOrUndefinedOrWhiteSpaceString, 
                StringExtensions.containsWhitespace = containsWhitespace, StringExtensions.isWhitespace = isWhitespace, 
                StringExtensions.trimTrailingWhitespace = trimTrailingWhitespace, StringExtensions.trimWhitespace = trimWhitespace, 
                StringExtensions.getLengthDifference = getLengthDifference, StringExtensions.repeat = repeat, 
                StringExtensions.replaceAll = replaceAll, StringExtensions.ensureUniqueNames = ensureUniqueNames, 
                StringExtensions.findUniqueName = findUniqueName, StringExtensions.constructCommaSeparatedList = constructCommaSeparatedList, 
                StringExtensions.escapeStringForRegex = escapeStringForRegex, StringExtensions.normalizeFileName = normalizeFileName, 
                StringExtensions.stringifyAsPrettyJSON = stringifyAsPrettyJSON, StringExtensions.deriveClsCompliantName = deriveClsCompliantName, 
                StringExtensions.stripTagDelimiters = stripTagDelimiters;
            }(StringExtensions = jsCommon.StringExtensions || (jsCommon.StringExtensions = {}));
            var Utility = function() {
                function Utility() {}
                return Utility.throwIfNullOrUndefined = function(value, context, methodName, parameterName) {
                    null === value ? Utility.throwException(jsCommon.Errors.argumentNull(Utility.getComponentName(context) + methodName + "." + parameterName)) : typeof value === Utility.Undefined && Utility.throwException(jsCommon.Errors.argumentUndefined(Utility.getComponentName(context) + methodName + "." + parameterName));
                }, Utility.throwIfNullOrEmpty = function(value, context, methodName, parameterName) {
                    Utility.throwIfNullOrUndefined(value, context, methodName, parameterName), value.length || Utility.throwException(jsCommon.Errors.argumentOutOfRange(Utility.getComponentName(context) + methodName + "." + parameterName));
                }, Utility.throwIfNullOrEmptyString = function(value, context, methodName, parameterName) {
                    Utility.throwIfNullOrUndefined(value, context, methodName, parameterName), value.length < 1 && Utility.throwException(jsCommon.Errors.argumentOutOfRange(Utility.getComponentName(context) + methodName + "." + parameterName));
                }, Utility.throwIfNullEmptyOrWhitespaceString = function(value, context, methodName, parameterName) {
                    Utility.throwIfNullOrUndefined(value, context, methodName, parameterName), StringExtensions.isNullOrUndefinedOrWhiteSpaceString(value) && Utility.throwException(jsCommon.Errors.argumentOutOfRange(Utility.getComponentName(context) + methodName + "." + parameterName));
                }, Utility.throwIfNotTrue = function(condition, context, methodName, parameterName) {
                    condition || Utility.throwException(jsCommon.Errors.argument(parameterName, Utility.getComponentName(context) + methodName + "." + parameterName));
                }, Utility.isString = function(value) {
                    return "string" == typeof value;
                }, Utility.isBoolean = function(value) {
                    return "boolean" == typeof value;
                }, Utility.isNumber = function(value) {
                    return "number" == typeof value;
                }, Utility.isDate = function(value) {
                    return Utility.isObject(value) && value instanceof Date;
                }, Utility.isObject = function(value) {
                    return null != value && "object" == typeof value;
                }, Utility.isNullOrUndefined = function(value) {
                    return null === value || typeof value === Utility.Undefined;
                }, Utility.valueOrDefault = function(value, defaultValue) {
                    return null != value ? value : defaultValue;
                }, Utility.urlCombine = function(baseUrl, path) {
                    if (Utility.throwIfNullOrUndefined(baseUrl, null, "urlCombine", "baseUrl"), Utility.throwIfNullOrUndefined(path, null, "urlCombine", "path"), 
                    StringExtensions.isNullOrUndefinedOrWhiteSpaceString(path)) return baseUrl;
                    if (StringExtensions.isNullOrUndefinedOrWhiteSpaceString(baseUrl)) return path;
                    var finalUrl = baseUrl;
                    return "/" === finalUrl.charAt(finalUrl.length - 1) ? "/" === path.charAt(0) && (path = path.slice(1)) : "/" !== path.charAt(0) && (path = "/" + path), 
                    finalUrl + path;
                }, Utility.getAbsoluteUri = function(path) {
                    Utility.throwIfNullOrUndefined(path, null, "getAbsoluteUri", "path");
                    var url = path;
                    return url && -1 === url.indexOf("http") && (url = Utility.urlCombine(clusterUri, url)), 
                    url;
                }, Utility.getStaticResourceUri = function(path) {
                    Utility.throwIfNullOrUndefined(path, null, "getStaticResourceUri", "path");
                    var url = path;
                    return url && -1 === url.indexOf("http") && (url = jsCommon.Utility.urlCombine(Utility.staticContentLocation, url)), 
                    url;
                }, Utility.getComponentName = function(context) {
                    return context ? (typeof context).toString() + "." : "";
                }, Utility.throwException = function(e) {
                    throw jsCommon.Trace.error(StringExtensions.format("Throwing exception: {0}", JSON.stringify(e)), null == e.stack), 
                    e;
                }, Utility.createClassSelector = function(className) {
                    return Utility.throwIfNullOrEmptyString(className, null, "CreateClassSelector", "className"), 
                    "." + className;
                }, Utility.createIdSelector = function(id) {
                    return Utility.throwIfNullOrEmptyString(id, null, "CreateIdSelector", "id"), "#" + id;
                }, Utility.generateGuid = function() {
                    var guid = "", idx = 0;
                    for (idx = 0; 32 > idx; idx += 1) {
                        var guidDigitsItem = 16 * Math.random() | 0;
                        switch (idx) {
                          case 8:
                          case 12:
                          case 16:
                          case 20:
                            guid += "-";
                        }
                        guid += guidDigitsItem.toString(16);
                    }
                    return guid;
                }, Utility.getCookieValue = function(key) {
                    for (var keyValuePairs = document.cookie.split(";"), i = 0; i < keyValuePairs.length; i++) {
                        var keyValue = keyValuePairs[i], split = keyValue.split("=");
                        if (split.length > 0 && split[0].trim() === key) return keyValue.substr(keyValue.indexOf("=") + 1);
                    }
                    return null;
                }, Utility.getDomainForUrl = function(url) {
                    var hrefObject = Utility.getHrefObjectFromUrl(url);
                    return hrefObject.prop("protocol") + "//" + hrefObject.prop("hostname");
                }, Utility.getHostNameForUrl = function(url) {
                    var hrefObject = Utility.getHrefObjectFromUrl(url);
                    return Utility.urlCombine(hrefObject.prop("hostname"), hrefObject.prop("pathname"));
                }, Utility.getUrlWithoutQueryString = function(url) {
                    var hrefObject = Utility.getHrefObjectFromUrl(url);
                    return hrefObject.prop("protocol") + "//" + Utility.urlCombine(hrefObject.prop("host"), hrefObject.prop("pathname"));
                }, Utility.getProtocolFromUrl = function(url) {
                    return Utility.getHrefObjectFromUrl(url).prop("protocol").replace(":", "");
                }, Utility.getHrefObjectFromUrl = function(url) {
                    var aObject = $("<a>");
                    return aObject = aObject.prop("href", url);
                }, Utility.convertWcfToJsDictionary = function(wcfDictionary) {
                    for (var result = {}, i = 0; i < wcfDictionary.length; i++) {
                        var keyValuePair = wcfDictionary[i];
                        result[keyValuePair.Key] = keyValuePair.Value;
                    }
                    return result;
                }, Utility.getDateFromWcfJsonString = function(jsonDate, fromUtcMilliseconds) {
                    if (StringExtensions.isNullOrEmpty(jsonDate)) return null;
                    var begIndex = jsonDate.indexOf("("), endIndex = jsonDate.indexOf(")");
                    if (-1 !== begIndex && -1 !== endIndex) {
                        var milliseconds = parseInt(jsonDate.substring(begIndex + 1, endIndex), 10);
                        if (fromUtcMilliseconds) return new Date(milliseconds);
                        var retValue = new Date(0);
                        return retValue.setUTCMilliseconds(milliseconds), retValue;
                    }
                    return null;
                }, Utility.getOuterHtml = function(content) {
                    return $("<div>").append(content).html();
                }, Utility.compareInt = function(a, b) {
                    return a - b;
                }, Utility.getIndexOfMinValue = function(a) {
                    for (var retValue = 0, currentMinValue = a[0], i = 0; i < a.length; i++) a[i] < currentMinValue && (currentMinValue = a[i], 
                    retValue = i);
                    return retValue;
                }, Utility.extractUrlFromCssBackgroundImage = function(input) {
                    return input.replace(/"/g, "").replace(/url\(|\)$/gi, "");
                }, Utility.isValidImageDataUrl = function(url) {
                    var regex = new RegExp("data:(image/(png|jpg|jpeg|gif|svg))");
                    return regex.test(url);
                }, Utility.isLocalUrl = function(url) {
                    return _.startsWith(url, "data:") || _.startsWith(url, "blob:");
                }, Utility.saveAsFile = function(content, fileName) {
                    var contentBlob = new Blob([ content ], {
                        type: HttpConstants.ApplicationOctetStream
                    }), url = window.webkitURL || URL, urlLink = url.createObjectURL(contentBlob), fileNameLink = fileName || urlLink;
                    if (window.navigator.msSaveOrOpenBlob) return void window.navigator.msSaveOrOpenBlob(contentBlob, fileNameLink);
                    var hyperlink = document.createElement("a");
                    hyperlink.href = urlLink, hyperlink.target = "_blank", hyperlink.download = fileNameLink, 
                    document.body.appendChild(hyperlink), hyperlink.click(), document.body.removeChild(hyperlink);
                }, Utility.getType = function(obj) {
                    Utility.throwIfNullEmptyOrWhitespaceString(obj.__type, this, "getType", "obj");
                    var parts = obj.__type.split(":");
                    return 2 !== parts.length && jsCommon.Errors.argument("obj.__type", "Type String not in expected format [Type]#[Namespace]: " + obj.__type), 
                    parts[1] !== Utility.TypeNamespace && jsCommon.Errors.argument("obj.__type", "Type Namespace not expected: " + parts[1]), 
                    parts[0];
                }, Utility.isEventSupported = function(eventName, element) {
                    eventName = "on" + eventName;
                    var isSupported = eventName in element;
                    return isSupported || (element.setAttribute || (element = document.createElement("div")), 
                    element.setAttribute && element.removeAttribute && (element.setAttribute(eventName, ""), 
                    isSupported = "function" == typeof element[eventName], "undefined" != typeof element[eventName] && (element[eventName] = null), 
                    element.removeAttribute(eventName))), element = null, isSupported;
                }, Utility.toPixel = function(pixelAmount) {
                    return Utility.throwIfNullOrUndefined(pixelAmount, this, "toPixel", "pixelAmount"), 
                    pixelAmount.toString() + jsCommon.CssConstants.pixelUnits;
                }, Utility.getPropertyCount = function(object) {
                    return Utility.throwIfNullOrUndefined(object, this, "getPropertyCount", "object"), 
                    Object.getOwnPropertyNames(object).length;
                }, Utility.getFileExtension = function(filePath) {
                    if (filePath) {
                        var index = filePath.lastIndexOf(".");
                        if (index >= 0) return filePath.substr(index + 1);
                    }
                    return "";
                }, Utility.extractFileNameFromPath = function(filePath) {
                    return filePath.replace(/^.*[\\\/]/, "");
                }, Utility.canUseClipboard = function() {
                    return "undefined" == typeof MSApp;
                }, Utility.is64BitOperatingSystem = function() {
                    return -1 !== navigator.userAgent.indexOf("WOW64") || -1 !== navigator.userAgent.indexOf("Win64");
                }, Utility.parseNumber = function(value, defaultValue) {
                    if (null === value) return null;
                    if (void 0 === value) return defaultValue;
                    var result = Number(value);
                    return isFinite(result) ? result : isNaN(result) && "number" != typeof value && "NaN" !== value ? defaultValue : result;
                }, Utility.getURLParamValue = function(name) {
                    var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(window.location.href);
                    return null == results ? null : results[1] || 0;
                }, Utility.getLocalTimeZoneString = function() {
                    var localTimeZoneString, timeSummer = new Date(Date.UTC(2005, 6, 30, 0, 0, 0, 0)), summerOffset = -1 * timeSummer.getTimezoneOffset(), timeWinter = new Date(Date.UTC(2005, 12, 30, 0, 0, 0, 0)), winterOffset = -1 * timeWinter.getTimezoneOffset();
                    return localTimeZoneString = -720 === summerOffset && -720 === winterOffset ? "Dateline Standard Time" : -660 === summerOffset && -660 === winterOffset ? "UTC-11" : -660 === summerOffset && -660 === winterOffset ? "Samoa Standard Time" : -600 === summerOffset && -600 === winterOffset ? "Hawaiian Standard Time" : -480 === summerOffset && -540 === winterOffset ? "Alaskan Standard Time" : -420 === summerOffset && -480 === winterOffset ? "Pacific Standard Time" : -420 === summerOffset && -420 === winterOffset ? "US Mountain Standard Time" : -360 === summerOffset && -420 === winterOffset ? "Mountain Standard Time" : -360 === summerOffset && -360 === winterOffset ? "Central America Standard Time" : -300 === summerOffset && -360 === winterOffset ? "Central Standard Time" : -300 === summerOffset && -300 === winterOffset ? "SA Pacific Standard Time" : -240 === summerOffset && -300 === winterOffset ? "Eastern Standard Time" : -270 === summerOffset && -270 === winterOffset ? "Venezuela Standard Time" : -240 === summerOffset && -240 === winterOffset ? "SA Western Standard Time" : -240 === summerOffset && -180 === winterOffset ? "Central Brazilian Standard Time" : -180 === summerOffset && -240 === winterOffset ? "Atlantic Standard Time" : -180 === summerOffset && -180 === winterOffset ? "Montevideo Standard Time" : -180 === summerOffset && -120 === winterOffset ? "E. South America Standard Time" : -150 === summerOffset && -210 === winterOffset ? "Mid-Atlantic Standard Time" : -120 === summerOffset && -120 === winterOffset ? "SA Eastern Standard Time" : 0 === summerOffset && 0 === winterOffset ? "UTC" : 60 === summerOffset && 0 === winterOffset ? "GMT Standard Time" : 60 === summerOffset && 120 === winterOffset ? "Namibia Standard Time" : 120 === summerOffset && 60 === winterOffset ? "Romance Standard Time" : 120 === summerOffset && 120 === winterOffset ? "South Africa Standard Time" : 180 === summerOffset && 120 === winterOffset ? "GTB Standard Time" : 180 === summerOffset && 180 === winterOffset ? "E. Africa Standard Time" : 240 === summerOffset && 180 === winterOffset ? "Russian Standard Time" : 240 === summerOffset && 240 === winterOffset ? "Arabian Standard Time" : 270 === summerOffset && 210 === winterOffset ? "Iran Standard Time" : 270 === summerOffset && 270 === winterOffset ? "Afghanistan Standard Time" : 300 === summerOffset && 240 === winterOffset ? "Pakistan Standard Time" : 300 === summerOffset && 300 === winterOffset ? "West Asia Standard Time" : 330 === summerOffset && 330 === winterOffset ? "India Standard Time" : 345 === summerOffset && 345 === winterOffset ? "Nepal Standard Time" : 360 === summerOffset && 300 === winterOffset ? "N. Central Asia Standard Time" : 360 === summerOffset && 360 === winterOffset ? "Central Asia Standard Time" : 390 === summerOffset && 390 === winterOffset ? "Myanmar Standard Time" : 420 === summerOffset && 360 === winterOffset ? "North Asia Standard Time" : 420 === summerOffset && 420 === winterOffset ? "SE Asia Standard Time" : 480 === summerOffset && 420 === winterOffset ? "North Asia East Standard Time" : 480 === summerOffset && 480 === winterOffset ? "China Standard Time" : 540 === summerOffset && 480 === winterOffset ? "Yakutsk Standard Time" : 540 === summerOffset && 540 === winterOffset ? "Tokyo Standard Time" : 570 === summerOffset && 570 === winterOffset ? "Cen. Australia Standard Time" : 600 === summerOffset && 600 === winterOffset ? "E. Australia Standard Time" : 600 === summerOffset && 660 === winterOffset ? "AUS Eastern Standard Time" : 660 === summerOffset && 600 === winterOffset ? "Tasmania Standard Time" : 660 === summerOffset && 660 === winterOffset ? "West Pacific Standard Time" : 690 === summerOffset && 690 === winterOffset ? "Central Pacific Standard Time" : 720 === summerOffset && 660 === winterOffset ? "Magadan Standard Time" : 720 === summerOffset && 720 === winterOffset ? "Fiji Standard Time" : 720 === summerOffset && 780 === winterOffset ? "New Zealand Standard Time" : 780 === summerOffset && 780 === winterOffset ? "Tonga Standard Time" : "UTC";
                }, Utility.TypeNamespace = "http://schemas.microsoft.com/sqlbi/2013/01/NLRuntimeService", 
                Utility.JsonContentType = "application/json", Utility.JpegContentType = "image/jpeg", 
                Utility.XJavascriptContentType = "application/x-javascript", Utility.JsonDataType = "json", 
                Utility.BlobDataType = "blob", Utility.HttpGetMethod = "GET", Utility.HttpPostMethod = "POST", 
                Utility.HttpPutMethod = "PUT", Utility.HttpDeleteMethod = "DELETE", Utility.HttpContentTypeHeader = "Content-Type", 
                Utility.HttpAcceptHeader = "Accept", Utility.Undefined = "undefined", Utility.staticContentLocation = window.location.protocol + "//" + window.location.host, 
                Utility;
            }();
            jsCommon.Utility = Utility;
            var VersionUtility = function() {
                function VersionUtility() {}
                return VersionUtility.compareVersions = function(versionA, versionB) {
                    for (var a = versionA.split(".").map(parseFloat), b = versionB.split(".").map(parseFloat), versionParts = Math.max(a.length, b.length), i = 0; versionParts > i; i++) {
                        var partA = a[i] || 0, partB = b[i] || 0;
                        if (partA > partB) return 1;
                        if (partB > partA) return -1;
                    }
                    return 0;
                }, VersionUtility;
            }();
            jsCommon.VersionUtility = VersionUtility;
            var PerformanceUtil;
            !function(PerformanceUtil) {
                function create(name) {
                    return new PerfMarker(name);
                }
                var PerfMarker = function() {
                    function PerfMarker(name) {
                        this._name = name, this._start = PerfMarker.begin(name);
                    }
                    return PerfMarker.begin = function(name) {
                        return void 0 !== window.performance && void 0 !== performance.mark ? (console.time, 
                        name = "Begin " + name, performance.mark(name), name) : void 0;
                    }, PerfMarker.prototype.end = function() {
                        if (void 0 !== window.performance && void 0 !== performance.mark && void 0 !== performance.measure) {
                            var name = this._name, end = "End " + name;
                            performance.mark(end), performance.measure(name, this._start, end), console.timeEnd;
                        }
                    }, PerfMarker;
                }();
                PerformanceUtil.PerfMarker = PerfMarker, PerformanceUtil.create = create;
            }(PerformanceUtil = jsCommon.PerformanceUtil || (jsCommon.PerformanceUtil = {}));
            var DeferUtility;
            !function(DeferUtility) {
                function deferUntilNextFrame(callback) {
                    var isWaiting, args, context;
                    return window.requestAnimationFrame || (window.requestAnimationFrame = function(func) {
                        return setTimeout(func, 20);
                    }), function() {
                        isWaiting || (isWaiting = !0, args = arguments, context = this, window.requestAnimationFrame(function() {
                            isWaiting = !1, callback.apply(context, args);
                        }));
                    };
                }
                DeferUtility.deferUntilNextFrame = deferUntilNextFrame;
            }(DeferUtility = jsCommon.DeferUtility || (jsCommon.DeferUtility = {}));
        }(jsCommon || (jsCommon = {}));
    },
    71: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        !function(jsCommon) {
            var TraceItem = function() {
                function TraceItem(text, type, sessionId, requestId) {
                    this.text = text, this.type = type, this.sessionId = sessionId, this.requestId = requestId, 
                    this.timeStamp = new Date();
                }
                return TraceItem.prototype.toString = function() {
                    var resultString = "";
                    return resultString += jsCommon.StringExtensions.format("{0} ({1}): {2}", TraceItem.traceTypeStrings[this.type], this.timeStamp.toUTCString(), this.text), 
                    this.requestId && (resultString += "\n(Request id: " + this.requestId + ")"), resultString;
                }, TraceItem.traceTypeStrings = [ "INFORMATION", "VERBOSE", "WARNING", "ERROR", "EXPECTEDERROR", "UNEXPECTEDERROR", "FATAL" ], 
                TraceItem;
            }();
            jsCommon.TraceItem = TraceItem;
        }(jsCommon || (jsCommon = {}));
    },
    72: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        !function(jsCommon) {
            var EnumExtensions;
            !function(EnumExtensions) {
                function hasFlag(value, flag) {
                    return (value & flag) === flag;
                }
                function setFlag(value, flag) {
                    return value |= flag;
                }
                function resetFlag(value, flag) {
                    return value &= ~flag;
                }
                function toString(enumType, value) {
                    return enumType[value];
                }
                EnumExtensions.hasFlag = hasFlag, EnumExtensions.setFlag = setFlag, EnumExtensions.resetFlag = resetFlag, 
                EnumExtensions.toString = toString;
            }(EnumExtensions = jsCommon.EnumExtensions || (jsCommon.EnumExtensions = {}));
            var StringExtensions;
            !function(StringExtensions) {
                function endsWith(str, suffix) {
                    return -1 !== str.indexOf(suffix, str.length - suffix.length);
                }
                StringExtensions.endsWith = endsWith;
            }(StringExtensions = jsCommon.StringExtensions || (jsCommon.StringExtensions = {}));
            var LogicExtensions;
            !function(LogicExtensions) {
                function XOR(a, b) {
                    return (a || b) && !(a && b);
                }
                LogicExtensions.XOR = XOR;
            }(LogicExtensions = jsCommon.LogicExtensions || (jsCommon.LogicExtensions = {}));
            var JsonComparer;
            !function(JsonComparer) {
                function equals(x, y) {
                    return x === y ? !0 : JSON.stringify(x) === JSON.stringify(y);
                }
                JsonComparer.equals = equals;
            }(JsonComparer = jsCommon.JsonComparer || (jsCommon.JsonComparer = {}));
            var TextSizeDefaults;
            !function(TextSizeDefaults) {
                function getScale(textSize) {
                    return (textSize - TextSizeDefaults.TextSizeMin) / TextSizeRange;
                }
                TextSizeDefaults.TextSizeMin = 8, TextSizeDefaults.TextSizeMax = 40;
                var TextSizeRange = TextSizeDefaults.TextSizeMax - TextSizeDefaults.TextSizeMin;
                TextSizeDefaults.getScale = getScale;
            }(TextSizeDefaults = jsCommon.TextSizeDefaults || (jsCommon.TextSizeDefaults = {}));
            var PixelConverter;
            !function(PixelConverter) {
                function toString(px) {
                    return px + PixelString;
                }
                function fromPoint(pt) {
                    return toString(fromPointToPixel(pt));
                }
                function fromPointToPixel(pt) {
                    return PxPtRatio * pt;
                }
                function toPoint(px) {
                    return px / PxPtRatio;
                }
                var PxPtRatio = 4 / 3, PixelString = "px";
                PixelConverter.toString = toString, PixelConverter.fromPoint = fromPoint, PixelConverter.fromPointToPixel = fromPointToPixel, 
                PixelConverter.toPoint = toPoint;
            }(PixelConverter = jsCommon.PixelConverter || (jsCommon.PixelConverter = {}));
            var RegExpExtensions;
            !function(RegExpExtensions) {
                function run(regex, value, start) {
                    return regex.lastIndex = start || 0, regex.exec(value);
                }
                RegExpExtensions.run = run;
            }(RegExpExtensions = jsCommon.RegExpExtensions || (jsCommon.RegExpExtensions = {}));
        }(jsCommon || (jsCommon = {}));
    },
    291: function(module, exports, __webpack_require__) {
        window.jsCommon, window.powerbi, window.powerbitests, window.InJs, window.debug, 
        window.jasmine, window.Microsoft;
        window.jsCommon = window.jsCommon || {}, window.powerbi = window.powerbi || {}, 
        window.debug = window.debug || {}, window.InJs = window.InJs || {}, __webpack_require__(292);
    },
    292: function(module, exports, __webpack_require__) {
        window.jsCommon, window.powerbi, window.powerbitests, window.InJs, window.debug, 
        window.jasmine, window.Microsoft;
        __webpack_require__(293), __webpack_require__(294), __webpack_require__(295), __webpack_require__(296), 
        __webpack_require__(297), __webpack_require__(298), __webpack_require__(299), __webpack_require__(300), 
        __webpack_require__(301), __webpack_require__(302), __webpack_require__(303), __webpack_require__(304), 
        __webpack_require__(66), __webpack_require__(67), __webpack_require__(305), __webpack_require__(68), 
        __webpack_require__(69), __webpack_require__(306), __webpack_require__(307), __webpack_require__(308), 
        __webpack_require__(309), __webpack_require__(310), __webpack_require__(311), __webpack_require__(312), 
        __webpack_require__(313), __webpack_require__(314), __webpack_require__(315), __webpack_require__(316), 
        __webpack_require__(70), __webpack_require__(71), __webpack_require__(317), __webpack_require__(318), 
        __webpack_require__(72), __webpack_require__(319), __webpack_require__(312), __webpack_require__(320), 
        __webpack_require__(321), __webpack_require__(322), __webpack_require__(323);
    },
    293: function(module, exports) {
        window.jsCommon, window.powerbi, window.powerbitests, window.InJs, window.debug, 
        window.jasmine, window.Microsoft;
    },
    294: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        !function(jsCommon) {
            var DOMConstants;
            !function(DOMConstants) {
                DOMConstants.escKeyCode = 27, DOMConstants.enterKeyCode = 13, DOMConstants.tabKeyCode = 9, 
                DOMConstants.upArrowKeyCode = 38, DOMConstants.downArrowKeyCode = 40, DOMConstants.leftArrowKeyCode = 37, 
                DOMConstants.rightArrowKeyCode = 39, DOMConstants.homeKeyCode = 36, DOMConstants.endKeyCode = 35, 
                DOMConstants.backSpaceKeyCode = 8, DOMConstants.deleteKeyCode = 46, DOMConstants.spaceKeyCode = 32, 
                DOMConstants.shiftKeyCode = 16, DOMConstants.ctrlKeyCode = 17, DOMConstants.altKeyCode = 18, 
                DOMConstants.aKeyCode = 65, DOMConstants.cKeyCode = 67, DOMConstants.sKeyCode = 83, 
                DOMConstants.vKeyCode = 86, DOMConstants.wKeyCode = 87, DOMConstants.xKeyCode = 88, 
                DOMConstants.yKeyCode = 89, DOMConstants.zKeyCode = 90, DOMConstants.DocumentBody = "body", 
                DOMConstants.Anchor = "a", DOMConstants.EditableTextElements = ":text, textarea", 
                DOMConstants.EditableNumericElements = '[type="number"]', DOMConstants.disabledAttributeOrValue = "disabled", 
                DOMConstants.readonlyAttributeOrValue = "readonly", DOMConstants.idAttribute = "id", 
                DOMConstants.styleAttribute = "style", DOMConstants.hrefAttribute = "href", DOMConstants.targetAttribute = "target", 
                DOMConstants.blankValue = "_blank", DOMConstants.selfValue = "_self", DOMConstants.classAttribute = "class", 
                DOMConstants.titleAttribute = "title", DOMConstants.srcAttribute = "src", DOMConstants.contextmenuEventName = "contextmenu", 
                DOMConstants.blurEventName = "blur", DOMConstants.keyUpEventName = "keyup", DOMConstants.inputEventName = "input", 
                DOMConstants.changeEventName = "change", DOMConstants.cutEventName = "cut", DOMConstants.keyDownEventName = "keydown", 
                DOMConstants.mouseMoveEventName = "mousemove", DOMConstants.mouseDownEventName = "mousedown", 
                DOMConstants.mouseEnterEventName = "mouseenter", DOMConstants.mouseLeaveEventName = "mouseleave", 
                DOMConstants.mouseOverEventName = "mouseover", DOMConstants.mouseOutEventName = "mouseout", 
                DOMConstants.mouseClickEventName = "click", DOMConstants.pasteEventName = "paste", 
                DOMConstants.scrollEventName = "scroll", DOMConstants.dropEventName = "drop", DOMConstants.focusEventName = "focus", 
                DOMConstants.focusInEventName = "focusin", DOMConstants.focusOutEventName = "focusout", 
                DOMConstants.selectEventName = "select", DOMConstants.messageEventName = "message", 
                DOMConstants.loadEventName = "load", DOMConstants.beforeUnload = "beforeunload", 
                DOMConstants.inputAndSelectEventNames = "input, select";
            }(DOMConstants = jsCommon.DOMConstants || (jsCommon.DOMConstants = {}));
        }(jsCommon || (jsCommon = {}));
    },
    295: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            powerbi.RS_AccessDeniedDueToRLSGroup = "rsAccessDeniedDueToRLSGroup", powerbi.RS_CannotRetrieveModel = "rsCannotRetrieveModel", 
            powerbi.DMTS_NoGatewayWithAllDatasourcesToBindError = "DMTS_NoGatewayWithAllDatasourcesToBindError", 
            powerbi.DM_GWPipeline_UnknownError = "DM_GWPipeline_UnknownError", function(PowerBIErrorResourceType) {
                PowerBIErrorResourceType[PowerBIErrorResourceType.ResourceCodeReference = 0] = "ResourceCodeReference", 
                PowerBIErrorResourceType[PowerBIErrorResourceType.EmbeddedString = 1] = "EmbeddedString";
            }(powerbi.PowerBIErrorResourceType || (powerbi.PowerBIErrorResourceType = {}));
            var PowerBIErrorResourceType = powerbi.PowerBIErrorResourceType, ServiceErrorToClientError = function() {
                function ServiceErrorToClientError(serviceError) {
                    this.m_serviceError = serviceError;
                }
                return Object.defineProperty(ServiceErrorToClientError.prototype, "code", {
                    get: function() {
                        return ServiceErrorToClientError.codeName;
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(ServiceErrorToClientError.prototype, "ignorable", {
                    get: function() {
                        return !1;
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(ServiceErrorToClientError.prototype, "requestId", {
                    get: function() {
                        return this.httpRequestId;
                    },
                    set: function(value) {
                        this.httpRequestId = value;
                    },
                    enumerable: !0,
                    configurable: !0
                }), ServiceErrorToClientError.prototype.getDetails = function(resourceProvider) {
                    var errorDetails;
                    return errorDetails = 6 === this.m_serviceError.statusCode ? PowerBIErrorDetailHelper.GetDetailsFromTransformError(resourceProvider, this.m_serviceError) : PowerBIErrorDetailHelper.GetDetailsFromServerError(resourceProvider, this.m_serviceError), 
                    PowerBIErrorDetailHelper.addAdditionalInfo(errorDetails, this.m_serviceError.errorDetails, resourceProvider), 
                    PowerBIErrorDetailHelper.addDebugErrorInfo(errorDetails, this.code, this.m_serviceError.message || null, this.m_serviceError.stackTrace || null), 
                    errorDetails;
                }, ServiceErrorToClientError.codeName = "ServiceErrorToClientError", ServiceErrorToClientError;
            }();
            powerbi.ServiceErrorToClientError = ServiceErrorToClientError;
            var PowerBIErrorDetailHelper = function() {
                function PowerBIErrorDetailHelper() {}
                return PowerBIErrorDetailHelper.addAdditionalInfo = function(errorDetails, pbiErrorDetails, localize) {
                    if (pbiErrorDetails) for (var i = 0; i < pbiErrorDetails.length; i++) {
                        var element = pbiErrorDetails[i], localizedCode = localize.getOptional(PowerBIErrorDetailHelper.serverErrorPrefix + element.code), additionErrorInfoKeyValuePair = {
                            errorInfoKey: localizedCode ? localizedCode : element.code,
                            errorInfoValue: element.detail.type === PowerBIErrorResourceType.ResourceCodeReference ? localize.get(PowerBIErrorDetailHelper.serverErrorPrefix + element.detail.value) : element.detail.value
                        };
                        errorDetails.displayableErrorInfo.push(additionErrorInfoKeyValuePair);
                    }
                    return errorDetails;
                }, PowerBIErrorDetailHelper.addDebugErrorInfo = function(errorDetails, errorCode, message, stackTrace) {
                    return errorDetails.debugErrorInfo = errorDetails.debugErrorInfo || [], errorCode && errorDetails.debugErrorInfo.push({
                        errorInfoKey: powerbi.ClientErrorStrings.ClientErrorCode,
                        errorInfoValue: errorCode
                    }), message && errorDetails.debugErrorInfo.push({
                        errorInfoKey: powerbi.ClientErrorStrings.ErrorDetails,
                        errorInfoValue: message
                    }), stackTrace && errorDetails.debugErrorInfo.push({
                        errorInfoKey: powerbi.ClientErrorStrings.StackTrace,
                        errorInfoValue: stackTrace
                    }), errorDetails;
                }, PowerBIErrorDetailHelper.GetDetailsFromTransformError = function(localize, serviceError) {
                    var message = localize.get("ServiceError_CannotLoadVisual"), key = localize.get("ServiceError_CannotLoadVisual"), val = serviceError.message, additionalInfo = [];
                    additionalInfo.push({
                        errorInfoKey: key,
                        errorInfoValue: val
                    });
                    var errorDetails = {
                        message: message,
                        displayableErrorInfo: additionalInfo
                    };
                    return errorDetails;
                }, PowerBIErrorDetailHelper.GetDetailsFromServerError = function(localize, serviceError) {
                    var message = "", key = "", val = "", errorCodeHandled = !1;
                    switch (serviceError.errorCode) {
                      case powerbi.RS_AccessDeniedDueToRLSGroup:
                        message = localize.get("ServiceError_ModelCannotLoad"), key = localize.get("ServiceError_ModelFetchingFailureKey"), 
                        val = localize.get("DsrError_NoPermissionDueToRLSGroupMessage"), errorCodeHandled = !0;
                        break;

                      case powerbi.RS_CannotRetrieveModel:
                        message = localize.get("ServiceError_ModelCannotLoad"), key = localize.get("ServiceError_ModelFetchingFailureKey"), 
                        val = localize.get("DsrError_CanNotRetrieveModelMessage"), errorCodeHandled = !0;
                        break;

                      case powerbi.DMTS_NoGatewayWithAllDatasourcesToBindError:
                        message = localize.get("ServiceError_ModelCannotLoad"), key = localize.get("ServiceError_ModelFetchingFailureKey"), 
                        val = localize.get("ServerError_DM_GWPipeline_Gateway_DataSourceConnectionError"), 
                        errorCodeHandled = !0;
                        break;

                      case powerbi.DM_GWPipeline_UnknownError:
                        message = localize.get("ServiceError_ModelCannotLoad"), key = localize.get("ServiceError_ModelFetchingFailureKey"), 
                        val = localize.get("ServerError_DM_GWPipeline_Client_GatewayUnreachable"), errorCodeHandled = !0;
                    }
                    if (!errorCodeHandled) switch (serviceError.statusCode) {
                      case 2:
                        message = localize.get("ServiceError_ModelCannotLoad"), key = localize.get("ServiceError_ModelConvertFailureKey"), 
                        val = localize.get("ServiceError_ModelConvertFailureValue");
                        break;

                      case 3:
                        message = localize.get("ServiceError_ModelCannotLoad"), key = localize.get("ServiceError_ModelCreationFailureKey"), 
                        val = localize.get("ServiceError_ModelCreationFailureValue");
                        break;

                      case 1:
                        message = localize.get("ServiceError_ModelCannotLoad"), key = localize.get("ServiceError_ModelFetchingFailureKey"), 
                        val = localize.get("ServiceError_ModelFetchingFailureValue");
                        break;

                      case 4:
                        message = localize.get("ServiceError_CannotLoadVisual"), key = localize.get("ServiceError_ExecuteSemanticQueryErrorKey"), 
                        val = localize.get("ServiceError_ExecuteSemanticQueryErrorValue");
                        break;

                      case 5:
                        message = localize.get("ServiceError_CannotLoadVisual"), key = localize.get("ServiceError_ExecuteSemanticQueryInvalidStreamFormatKey"), 
                        val = localize.get("ServiceError_ExecuteSemanticQueryInvalidStreamFormatValue");
                        break;

                      case 0:
                      default:
                        message = localize.get("ServiceError_GeneralError"), key = localize.get("ServiceError_GeneralErrorKey"), 
                        val = localize.get("ServiceError_GeneralErrorValue");
                    }
                    var additionalInfo = [];
                    additionalInfo.push({
                        errorInfoKey: key,
                        errorInfoValue: val
                    });
                    var errorDetails = {
                        message: message,
                        displayableErrorInfo: additionalInfo
                    };
                    return errorDetails;
                }, PowerBIErrorDetailHelper.serverErrorPrefix = "ServerError_", PowerBIErrorDetailHelper;
            }();
            powerbi.PowerBIErrorDetailHelper = PowerBIErrorDetailHelper;
        }(powerbi || (powerbi = {}));
    },
    296: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {}(powerbi || (powerbi = {}));
    },
    297: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            function createGeoTaggingAnalyzerService(getLocalized) {
                return new GeoTaggingAnalyzerService(getLocalized);
            }
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
            }, powerbi.createGeoTaggingAnalyzerService = createGeoTaggingAnalyzerService;
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
                GeotaggingString_VRMBackCompat_StateOrProvince: "StateOrProvince"
            }, GeoTaggingAnalyzerService = function() {
                function GeoTaggingAnalyzerService(getLocalized) {
                    this.GeotaggingString_VRMBackCompat_CountryRegion = "CountryRegion", this.GeotaggingString_VRMBackCompat_StateOrProvince = "StateOrProvince", 
                    this.GeotaggingString_Continent = getLocalized("GeotaggingString_Continent").toLowerCase(), 
                    this.GeotaggingString_Continents = getLocalized("GeotaggingString_Continents").toLowerCase(), 
                    this.GeotaggingString_Country = getLocalized("GeotaggingString_Country").toLowerCase(), 
                    this.GeotaggingString_Countries = getLocalized("GeotaggingString_Countries").toLowerCase(), 
                    this.GeotaggingString_State = getLocalized("GeotaggingString_State").toLowerCase(), 
                    this.GeotaggingString_States = getLocalized("GeotaggingString_States").toLowerCase(), 
                    this.GeotaggingString_City = getLocalized("GeotaggingString_City").toLowerCase(), 
                    this.GeotaggingString_Cities = getLocalized("GeotaggingString_Cities").toLowerCase(), 
                    this.GeotaggingString_Town = getLocalized("GeotaggingString_Town").toLowerCase(), 
                    this.GeotaggingString_Towns = getLocalized("GeotaggingString_Towns").toLowerCase(), 
                    this.GeotaggingString_Province = getLocalized("GeotaggingString_Province").toLowerCase(), 
                    this.GeotaggingString_Provinces = getLocalized("GeotaggingString_Provinces").toLowerCase(), 
                    this.GeotaggingString_County = getLocalized("GeotaggingString_County").toLowerCase(), 
                    this.GeotaggingString_Counties = getLocalized("GeotaggingString_Counties").toLowerCase(), 
                    this.GeotaggingString_Village = getLocalized("GeotaggingString_Village").toLowerCase(), 
                    this.GeotaggingString_Villages = getLocalized("GeotaggingString_Villages").toLowerCase(), 
                    this.GeotaggingString_Post = getLocalized("GeotaggingString_Post").toLowerCase(), 
                    this.GeotaggingString_Zip = getLocalized("GeotaggingString_Zip").toLowerCase(), 
                    this.GeotaggingString_Code = getLocalized("GeotaggingString_Code").toLowerCase(), 
                    this.GeotaggingString_Place = getLocalized("GeotaggingString_Place").toLowerCase(), 
                    this.GeotaggingString_Places = getLocalized("GeotaggingString_Places").toLowerCase(), 
                    this.GeotaggingString_Address = getLocalized("GeotaggingString_Address").toLowerCase(), 
                    this.GeotaggingString_Addresses = getLocalized("GeotaggingString_Addresses").toLowerCase(), 
                    this.GeotaggingString_Street = getLocalized("GeotaggingString_Street").toLowerCase(), 
                    this.GeotaggingString_Streets = getLocalized("GeotaggingString_Streets").toLowerCase(), 
                    this.GeotaggingString_Longitude = getLocalized("GeotaggingString_Longitude").toLowerCase(), 
                    this.GeotaggingString_Longitude_Short = getLocalized("GeotaggingString_Longitude_Short").toLowerCase(), 
                    this.GeotaggingString_Longitude_Short2 = getLocalized("GeotaggingString_Longitude_Short2").toLowerCase(), 
                    this.GeotaggingString_Latitude = getLocalized("GeotaggingString_Latitude").toLowerCase(), 
                    this.GeotaggingString_Latitude_Short = getLocalized("GeotaggingString_Latitude_Short").toLowerCase(), 
                    this.GeotaggingString_PostalCode = getLocalized("GeotaggingString_PostalCode").toLowerCase(), 
                    this.GeotaggingString_PostalCodes = getLocalized("GeotaggingString_PostalCodes").toLowerCase(), 
                    this.GeotaggingString_ZipCode = getLocalized("GeotaggingString_ZipCode").toLowerCase(), 
                    this.GeotaggingString_ZipCodes = getLocalized("GeotaggingString_ZipCodes").toLowerCase(), 
                    this.GeotaggingString_Territory = getLocalized("GeotaggingString_Territory").toLowerCase(), 
                    this.GeotaggingString_Territories = getLocalized("GeotaggingString_Territories").toLowerCase();
                }
                return GeoTaggingAnalyzerService.prototype.isLongitudeOrLatitude = function(fieldRefName) {
                    return this.isLongitude(fieldRefName) || this.isLatitude(fieldRefName);
                }, GeoTaggingAnalyzerService.prototype.isGeographic = function(fieldRefName) {
                    return this.isLongitudeOrLatitude(fieldRefName) || this.isGeocodable(fieldRefName);
                }, GeoTaggingAnalyzerService.prototype.isGeocodable = function(fieldRefName) {
                    return this.isAddress(fieldRefName) || this.isCity(fieldRefName) || this.isContinent(fieldRefName) || this.isCountry(fieldRefName) || this.isCounty(fieldRefName) || this.isStateOrProvince(fieldRefName) || this.isPlace(fieldRefName) || this.isPostalCode(fieldRefName) || this.isTerritory(fieldRefName);
                }, GeoTaggingAnalyzerService.prototype.isGeoshapable = function(fieldRefName) {
                    return this.isCity(fieldRefName) || this.isCountry(fieldRefName) || this.isCounty(fieldRefName) || this.isStateOrProvince(fieldRefName) || this.isPostalCode(fieldRefName) || this.isTerritory(fieldRefName) || this.isGeoshapableEnglish(fieldRefName);
                }, GeoTaggingAnalyzerService.prototype.isGeoshapableEnglish = function(fieldRefName) {
                    return this.isEnglishCity(fieldRefName) || this.isEnglishCountry(fieldRefName) || this.isEnglishCounty(fieldRefName) || this.isEnglishStateOrProvince(fieldRefName) || this.isEnglishPostalCode(fieldRefName) || this.isEnglishTerritory(fieldRefName);
                }, GeoTaggingAnalyzerService.prototype.isAddress = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ this.GeotaggingString_Address, this.GeotaggingString_Addresses, this.GeotaggingString_Street, this.GeotaggingString_Streets ]);
                }, GeoTaggingAnalyzerService.prototype.isPlace = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ this.GeotaggingString_Place, this.GeotaggingString_Places ]);
                }, GeoTaggingAnalyzerService.prototype.isCity = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ this.GeotaggingString_City, this.GeotaggingString_Cities, this.GeotaggingString_Town, this.GeotaggingString_Towns, this.GeotaggingString_Village, this.GeotaggingString_Villages ]);
                }, GeoTaggingAnalyzerService.prototype.isStateOrProvince = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ this.GeotaggingString_State, this.GeotaggingString_States, this.GeotaggingString_Province, this.GeotaggingString_Provinces, this.GeotaggingString_VRMBackCompat_StateOrProvince ]);
                }, GeoTaggingAnalyzerService.prototype.isCountry = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ this.GeotaggingString_Country, this.GeotaggingString_Countries, this.GeotaggingString_VRMBackCompat_CountryRegion ]);
                }, GeoTaggingAnalyzerService.prototype.isCounty = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ this.GeotaggingString_County, this.GeotaggingString_Counties ]);
                }, GeoTaggingAnalyzerService.prototype.isContinent = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ this.GeotaggingString_Continent, this.GeotaggingString_Continents ]);
                }, GeoTaggingAnalyzerService.prototype.isPostalCode = function(fieldRefName) {
                    var result = GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ this.GeotaggingString_Post, this.GeotaggingString_Zip ]) && GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ this.GeotaggingString_Code ]) || GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ this.GeotaggingString_PostalCode, this.GeotaggingString_PostalCodes, this.GeotaggingString_ZipCode, this.GeotaggingString_ZipCodes ]);
                    if (!result) {
                        var whiteSpaceRegex = /\s+/, fieldNameWithoutWhitespace = fieldRefName.replace(whiteSpaceRegex, "");
                        result = GeoTaggingAnalyzerService.hasMatches(fieldNameWithoutWhitespace, [ this.GeotaggingString_PostalCode.replace(whiteSpaceRegex, ""), this.GeotaggingString_PostalCodes.replace(whiteSpaceRegex, ""), this.GeotaggingString_ZipCode.replace(whiteSpaceRegex, ""), this.GeotaggingString_ZipCodes.replace(whiteSpaceRegex, "") ]);
                    }
                    return result;
                }, GeoTaggingAnalyzerService.prototype.isLongitude = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ this.GeotaggingString_Longitude ]) || GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ this.GeotaggingString_Longitude_Short ], !0) || GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ this.GeotaggingString_Longitude_Short2 ], !0);
                }, GeoTaggingAnalyzerService.prototype.isLatitude = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ this.GeotaggingString_Latitude ]) || GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ this.GeotaggingString_Latitude_Short ], !0);
                }, GeoTaggingAnalyzerService.prototype.isTerritory = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ this.GeotaggingString_Territory, this.GeotaggingString_Territories ]);
                }, GeoTaggingAnalyzerService.hasMatches = function(fieldName, possibleMatches, useStrict) {
                    for (var nonWordRegex = /\W/, value = fieldName.toLowerCase(), i = 0, len = possibleMatches.length; len > i; i++) {
                        var possibleMatch = possibleMatches[i].toLowerCase();
                        if (useStrict) {
                            var indexofpossibleMatch = value.indexOf(possibleMatch);
                            if (indexofpossibleMatch > -1) {
                                var wordEndFlag = void 0, wordBeginFlag = void 0;
                                if (wordEndFlag = wordBeginFlag = !0, indexofpossibleMatch - 1 > 0 && (wordBeginFlag = nonWordRegex.test(value[indexofpossibleMatch - 1])), 
                                indexofpossibleMatch + possibleMatch.length < value.length && (wordEndFlag = nonWordRegex.test(value[indexofpossibleMatch + possibleMatch.length])), 
                                wordBeginFlag && wordEndFlag) return !0;
                            }
                        } else if (value.indexOf(possibleMatch) > -1) return !0;
                    }
                    return !1;
                }, GeoTaggingAnalyzerService.prototype.getFieldType = function(fieldName) {
                    return null != fieldName ? this.isLatitude(fieldName) ? powerbi.CategoryTypes.Latitude : this.isLongitude(fieldName) ? powerbi.CategoryTypes.Longitude : this.isPostalCode(fieldName) ? powerbi.CategoryTypes.PostalCode : this.isAddress(fieldName) ? powerbi.CategoryTypes.Address : this.isPlace(fieldName) ? powerbi.CategoryTypes.Place : this.isCity(fieldName) ? powerbi.CategoryTypes.City : this.isCountry(fieldName) ? powerbi.CategoryTypes.CountryRegion : this.isCounty(fieldName) ? powerbi.CategoryTypes.County : this.isStateOrProvince(fieldName) ? powerbi.CategoryTypes.StateOrProvince : this.isContinent(fieldName) ? powerbi.CategoryTypes.Continent : this.getEnglishFieldType(fieldName) : void 0;
                }, GeoTaggingAnalyzerService.prototype.isEnglishAddress = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ EnglishBackup.GeotaggingString_Address, EnglishBackup.GeotaggingString_Addresses, EnglishBackup.GeotaggingString_Street, EnglishBackup.GeotaggingString_Streets ]);
                }, GeoTaggingAnalyzerService.prototype.isEnglishPlace = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ EnglishBackup.GeotaggingString_Place, EnglishBackup.GeotaggingString_Places ]);
                }, GeoTaggingAnalyzerService.prototype.isEnglishCity = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ EnglishBackup.GeotaggingString_City, EnglishBackup.GeotaggingString_Cities, EnglishBackup.GeotaggingString_Town, EnglishBackup.GeotaggingString_Towns, EnglishBackup.GeotaggingString_Village, EnglishBackup.GeotaggingString_Villages ]);
                }, GeoTaggingAnalyzerService.prototype.isEnglishStateOrProvince = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ EnglishBackup.GeotaggingString_State, EnglishBackup.GeotaggingString_States, EnglishBackup.GeotaggingString_Province, EnglishBackup.GeotaggingString_Provinces, EnglishBackup.GeotaggingString_VRMBackCompat_StateOrProvince ]);
                }, GeoTaggingAnalyzerService.prototype.isEnglishCountry = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ EnglishBackup.GeotaggingString_Country, EnglishBackup.GeotaggingString_Countries, EnglishBackup.GeotaggingString_VRMBackCompat_CountryRegion ]);
                }, GeoTaggingAnalyzerService.prototype.isEnglishCounty = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ EnglishBackup.GeotaggingString_County, EnglishBackup.GeotaggingString_Counties ]);
                }, GeoTaggingAnalyzerService.prototype.isEnglishContinent = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ EnglishBackup.GeotaggingString_Continent, EnglishBackup.GeotaggingString_Continents ]);
                }, GeoTaggingAnalyzerService.prototype.isEnglishPostalCode = function(fieldRefName) {
                    var result = GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ EnglishBackup.GeotaggingString_Post, EnglishBackup.GeotaggingString_Zip ]) && GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ this.GeotaggingString_Code ]) || GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ EnglishBackup.GeotaggingString_PostalCode, EnglishBackup.GeotaggingString_PostalCodes, EnglishBackup.GeotaggingString_ZipCode, EnglishBackup.GeotaggingString_ZipCodes ]);
                    if (!result) {
                        var whiteSpaceRegexPattern = new RegExp("s");
                        result = GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ EnglishBackup.GeotaggingString_PostalCode.replace(whiteSpaceRegexPattern, ""), EnglishBackup.GeotaggingString_PostalCodes.replace(whiteSpaceRegexPattern, ""), EnglishBackup.GeotaggingString_ZipCode.replace(whiteSpaceRegexPattern, ""), EnglishBackup.GeotaggingString_ZipCodes.replace(whiteSpaceRegexPattern, "") ]);
                    }
                    return result;
                }, GeoTaggingAnalyzerService.prototype.isEnglishLongitude = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ EnglishBackup.GeotaggingString_Longitude ]) || GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ EnglishBackup.GeotaggingString_Longitude_Short ], !0) || GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ EnglishBackup.GeotaggingString_Longitude_Short2 ], !0);
                }, GeoTaggingAnalyzerService.prototype.isEnglishLatitude = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ EnglishBackup.GeotaggingString_Latitude ]) || GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ EnglishBackup.GeotaggingString_Latitude_Short ], !0);
                }, GeoTaggingAnalyzerService.prototype.isEnglishTerritory = function(fieldRefName) {
                    return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [ EnglishBackup.GeotaggingString_Territory, EnglishBackup.GeotaggingString_Territories ]);
                }, GeoTaggingAnalyzerService.prototype.getEnglishFieldType = function(fieldName) {
                    return null != fieldName ? this.isEnglishLatitude(fieldName) ? powerbi.CategoryTypes.Latitude : this.isEnglishLongitude(fieldName) ? powerbi.CategoryTypes.Longitude : this.isEnglishPostalCode(fieldName) ? powerbi.CategoryTypes.PostalCode : this.isEnglishAddress(fieldName) ? powerbi.CategoryTypes.Address : this.isEnglishPlace(fieldName) ? powerbi.CategoryTypes.Place : this.isEnglishCity(fieldName) ? powerbi.CategoryTypes.City : this.isEnglishCountry(fieldName) ? powerbi.CategoryTypes.CountryRegion : this.isEnglishCounty(fieldName) ? powerbi.CategoryTypes.County : this.isEnglishStateOrProvince(fieldName) ? powerbi.CategoryTypes.StateOrProvince : this.isEnglishContinent(fieldName) ? powerbi.CategoryTypes.Continent : void 0 : void 0;
                }, GeoTaggingAnalyzerService;
            }();
            powerbi.GeoTaggingAnalyzerService = GeoTaggingAnalyzerService;
        }(powerbi || (powerbi = {}));
    },
    298: function(module, exports, __webpack_require__) {
        window.jsCommon, window.powerbi, window.powerbitests, window.InJs, window.debug, 
        window.jasmine, window.Microsoft;
    },
    299: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            var ClientErrorStrings;
            !function(ClientErrorStrings) {
                ClientErrorStrings.ClientErrorCode = "Client Error Code", ClientErrorStrings.ErrorCode = "Error Code", 
                ClientErrorStrings.ErrorDetails = "Error Details", ClientErrorStrings.HttpRequestId = "HTTP Request Id", 
                ClientErrorStrings.JobId = "Job Id", ClientErrorStrings.ODataErrorMessage = "OData Error Message", 
                ClientErrorStrings.StackTrace = "Stack Trace";
            }(ClientErrorStrings = powerbi.ClientErrorStrings || (powerbi.ClientErrorStrings = {}));
            var UnknownClientError = function() {
                function UnknownClientError(code) {
                    this.errorCode = code;
                }
                return Object.defineProperty(UnknownClientError.prototype, "code", {
                    get: function() {
                        return this.errorCode;
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(UnknownClientError.prototype, "ignorable", {
                    get: function() {
                        return !1;
                    },
                    enumerable: !0,
                    configurable: !0
                }), UnknownClientError.prototype.getDetails = function(resourceProvider) {
                    var details = {
                        message: resourceProvider.get("ClientError_UnknownClientErrorValue"),
                        displayableErrorInfo: [ {
                            errorInfoKey: resourceProvider.get("ClientError_UnknownClientErrorKey"),
                            errorInfoValue: resourceProvider.get("ClientError_UnknownClientErrorValue")
                        } ],
                        debugErrorInfo: [ {
                            errorInfoKey: ClientErrorStrings.ClientErrorCode,
                            errorInfoValue: this.code
                        } ]
                    };
                    return details;
                }, UnknownClientError;
            }();
            powerbi.UnknownClientError = UnknownClientError;
            var HttpClientError = function() {
                function HttpClientError(httpStatusCode, requestId) {
                    this.httpStatusCode = httpStatusCode, this.httpRequestId = requestId;
                }
                return Object.defineProperty(HttpClientError.prototype, "code", {
                    get: function() {
                        return "HttpClientError";
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(HttpClientError.prototype, "ignorable", {
                    get: function() {
                        return !1;
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(HttpClientError.prototype, "requestId", {
                    get: function() {
                        return this.httpRequestId;
                    },
                    enumerable: !0,
                    configurable: !0
                }), HttpClientError.prototype.getDetails = function(resourceProvider) {
                    var details = {
                        message: null,
                        displayableErrorInfo: [ {
                            errorInfoKey: resourceProvider.get("DsrError_Key"),
                            errorInfoValue: resourceProvider.get("DsrError_UnknownErrorValue")
                        }, {
                            errorInfoKey: resourceProvider.get("ClientError_HttpResponseStatusCodeKey"),
                            errorInfoValue: this.httpStatusCode.toString()
                        } ],
                        debugErrorInfo: [ {
                            errorInfoKey: ClientErrorStrings.HttpRequestId,
                            errorInfoValue: this.httpRequestId
                        }, {
                            errorInfoKey: ClientErrorStrings.ClientErrorCode,
                            errorInfoValue: this.code
                        } ]
                    };
                    return details;
                }, HttpClientError;
            }();
            powerbi.HttpClientError = HttpClientError;
            var IgnorableClientError = function() {
                function IgnorableClientError() {}
                return Object.defineProperty(IgnorableClientError.prototype, "code", {
                    get: function() {
                        return "IgnorableClientError";
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(IgnorableClientError.prototype, "ignorable", {
                    get: function() {
                        return !0;
                    },
                    enumerable: !0,
                    configurable: !0
                }), IgnorableClientError.prototype.getDetails = function(resourceProvider) {
                    var details = {
                        message: "",
                        displayableErrorInfo: []
                    };
                    return details;
                }, IgnorableClientError;
            }();
            powerbi.IgnorableClientError = IgnorableClientError;
        }(powerbi || (powerbi = {}));
    },
    300: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        !function(jsCommon) {
            var ArrayExtensions;
            !function(ArrayExtensions) {
                function intersect(target, other) {
                    for (var result = [], i = target.length - 1; i >= 0; --i) -1 !== other.indexOf(target[i]) && result.push(target[i]);
                    return result;
                }
                function diff(target, other) {
                    for (var result = [], i = target.length - 1; i >= 0; --i) {
                        var value = target[i];
                        -1 === other.indexOf(value) && result.push(value);
                    }
                    return result;
                }
                function distinct(source) {
                    for (var result = [], i = 0, len = source.length; len > i; i++) {
                        var value = source[i];
                        -1 === result.indexOf(value) && result.push(value);
                    }
                    return result;
                }
                function union(target, source) {
                    for (var i = 0, len = source.length; len > i; ++i) unionSingle(target, source[i]);
                }
                function unionSingle(target, value) {
                    target.indexOf(value) < 0 && target.push(value);
                }
                function range(source, startIndex, endIndex) {
                    for (var result = [], i = startIndex; endIndex >= i; ++i) result.push(source[i]);
                    return result;
                }
                function take(source, count) {
                    for (var result = [], i = 0; count > i; ++i) result.push(source[i]);
                    return result;
                }
                function copy(source) {
                    return take(source, source.length);
                }
                function sequenceEqual(left, right, comparison) {
                    if (left || (left = null), right || (right = null), left === right) return !0;
                    if (!!left != !!right) return !1;
                    var len = left.length;
                    if (len !== right.length) return !1;
                    for (var i = 0; len > i && comparison(left[i], right[i]); ) ++i;
                    return i === len;
                }
                function emptyToNull(array) {
                    return array && 0 === array.length ? null : array;
                }
                function indexOf(array, predicate) {
                    for (var i = 0, len = array.length; len > i; ++i) if (predicate(array[i])) return i;
                    return -1;
                }
                function rotate(array, offset) {
                    if (0 === offset) return array.slice();
                    var rotated = array.slice(offset);
                    return Array.prototype.push.apply(rotated, array.slice(0, offset)), rotated;
                }
                function createWithId() {
                    return extendWithId([]);
                }
                function extendWithId(array) {
                    var extended = array;
                    return extended.withId = withId, extended;
                }
                function findWithId(array, id) {
                    for (var i = 0, len = array.length; len > i; i++) {
                        var item = array[i];
                        if (item.id === id) return item;
                    }
                }
                function withId(id) {
                    return ArrayExtensions.findWithId(this, id);
                }
                function createWithName() {
                    return extendWithName([]);
                }
                function extendWithName(array) {
                    var extended = array;
                    return extended.withName = withName, extended;
                }
                function findItemWithName(array, name) {
                    var index = indexWithName(array, name);
                    return index >= 0 ? array[index] : void 0;
                }
                function indexWithName(array, name) {
                    for (var i = 0, len = array.length; len > i; i++) {
                        var item = array[i];
                        if (item.name === name) return i;
                    }
                    return -1;
                }
                function insertSorted(list, value) {
                    for (var len = list.length, i = len - 1; i >= 0; i--) {
                        var diff_1 = list[i] - value;
                        if (0 === diff_1) return !1;
                        if (!(diff_1 > 0)) return list.splice(i + 1, 0, value), !0;
                    }
                    return list.unshift(value), !0;
                }
                function removeFirst(list, value) {
                    var index = list.indexOf(value);
                    return 0 > index ? !1 : (list.splice(index, 1), !0);
                }
                function withName(name) {
                    var array = this;
                    return findItemWithName(array, name);
                }
                function clear(array) {
                    if (array) for (;array.length > 0; ) array.pop();
                }
                function isUndefinedOrEmpty(array) {
                    return !array || 0 === array.length;
                }
                function swap(array, firstIndex, secondIndex) {
                    var temp = array[firstIndex];
                    array[firstIndex] = array[secondIndex], array[secondIndex] = temp;
                }
                function isInArray(array, lookupItem, compareCallback) {
                    return _.any(array, function(item) {
                        return compareCallback(item, lookupItem);
                    });
                }
                function isArrayOrInheritedArray(obj) {
                    for (var nextPrototype = obj; null != nextPrototype; ) {
                        if (_.isArray(nextPrototype)) return !0;
                        nextPrototype = Object.getPrototypeOf(nextPrototype);
                    }
                    return !1;
                }
                function isSorted(values, compareFunction) {
                    var ilen = values.length;
                    if (ilen >= 2) for (var i = 1; ilen > i; i++) if (compareFunction(values[i - 1], values[i]) > 0) return !1;
                    return !0;
                }
                function isSortedNumeric(values, descendingOrder) {
                    var compareFunction = descendingOrder ? function(a, b) {
                        return b - a;
                    } : function(a, b) {
                        return a - b;
                    };
                    return isSorted(values, compareFunction);
                }
                ArrayExtensions.intersect = intersect, ArrayExtensions.diff = diff, ArrayExtensions.distinct = distinct, 
                ArrayExtensions.union = union, ArrayExtensions.unionSingle = unionSingle, ArrayExtensions.range = range, 
                ArrayExtensions.take = take, ArrayExtensions.copy = copy, ArrayExtensions.sequenceEqual = sequenceEqual, 
                ArrayExtensions.emptyToNull = emptyToNull, ArrayExtensions.indexOf = indexOf, ArrayExtensions.rotate = rotate, 
                ArrayExtensions.createWithId = createWithId, ArrayExtensions.extendWithId = extendWithId, 
                ArrayExtensions.findWithId = findWithId, ArrayExtensions.createWithName = createWithName, 
                ArrayExtensions.extendWithName = extendWithName, ArrayExtensions.findItemWithName = findItemWithName, 
                ArrayExtensions.indexWithName = indexWithName, ArrayExtensions.insertSorted = insertSorted, 
                ArrayExtensions.removeFirst = removeFirst, ArrayExtensions.clear = clear, ArrayExtensions.isUndefinedOrEmpty = isUndefinedOrEmpty, 
                ArrayExtensions.swap = swap, ArrayExtensions.isInArray = isInArray, ArrayExtensions.isArrayOrInheritedArray = isArrayOrInheritedArray, 
                ArrayExtensions.isSorted = isSorted, ArrayExtensions.isSortedNumeric = isSortedNumeric;
            }(ArrayExtensions = jsCommon.ArrayExtensions || (jsCommon.ArrayExtensions = {}));
        }(jsCommon || (jsCommon = {}));
    },
    301: function(module, exports) {
        var InJs, InJs = (window.jsCommon, window.powerbi, window.powerbitests, window.InJs);
        window.debug, window.jasmine, window.Microsoft;
        !function(InJs) {
            var DomFactory;
            !function(DomFactory) {
                function div() {
                    return $("<div/>");
                }
                function span() {
                    return $("<span/>");
                }
                function checkbox() {
                    return $('<input type="checkbox"/>');
                }
                function ul() {
                    return $("<ul/>");
                }
                function li() {
                    return $("<li/>");
                }
                function button() {
                    return $('<input type="button"/>');
                }
                function select() {
                    return $("<select/>");
                }
                function textBox() {
                    return $('<input type="text"/>');
                }
                function img() {
                    return $("<img/>");
                }
                function iframe() {
                    return $("<iframe/>");
                }
                DomFactory.div = div, DomFactory.span = span, DomFactory.checkbox = checkbox, DomFactory.ul = ul, 
                DomFactory.li = li, DomFactory.button = button, DomFactory.select = select, DomFactory.textBox = textBox, 
                DomFactory.img = img, DomFactory.iframe = iframe;
            }(DomFactory = InJs.DomFactory || (InJs.DomFactory = {}));
        }(InJs || (InJs = {}));
    },
    302: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            function applyDefault(value, defaultValue) {
                return void 0 !== value ? value : defaultValue;
            }
            var Double;
            !function(Double) {
                function pow10(exp) {
                    return exp >= 0 ? exp < Double.POSITIVE_POWERS.length ? Double.POSITIVE_POWERS[exp] : 1 / 0 : (exp = -exp, 
                    exp > 0 && exp < Double.NEGATIVE_POWERS.length ? Double.NEGATIVE_POWERS[exp] : 0);
                }
                function log10(val) {
                    if (val > 1 && 1e16 > val) return 1e8 > val ? 1e4 > val ? 100 > val ? 10 > val ? 0 : 1 : 1e3 > val ? 2 : 3 : 1e6 > val ? 1e5 > val ? 4 : 5 : 1e7 > val ? 6 : 7 : 1e12 > val ? 1e10 > val ? 1e9 > val ? 8 : 9 : 1e11 > val ? 10 : 11 : 1e14 > val ? 1e13 > val ? 12 : 13 : 1e15 > val ? 14 : 15;
                    if (val > 1e-16 && 1 > val) return 1e-8 > val ? 1e-12 > val ? 1e-14 > val ? 1e-15 > val ? -16 : -15 : 1e-13 > val ? -14 : -13 : 1e-10 > val ? 1e-11 > val ? -12 : -11 : 1e-9 > val ? -10 : -9 : 1e-4 > val ? 1e-6 > val ? 1e-7 > val ? -8 : -7 : 1e-5 > val ? -6 : -5 : .01 > val ? .001 > val ? -4 : -3 : .1 > val ? -2 : -1;
                    var log10 = Math.log(val) / Double.LOG_E_10;
                    return Double.floorWithPrecision(log10);
                }
                function getPrecision(x, decimalDigits) {
                    if (void 0 === decimalDigits && (decimalDigits = Double.DEFAULT_PRECISION_IN_DECIMAL_DIGITS), 
                    x) {
                        var exp = Double.log10(Math.abs(x));
                        if (exp < Double.MIN_EXP) return 0;
                        var precisionExp = Math.max(exp - decimalDigits, -Double.NEGATIVE_POWERS.length + 1);
                        return Double.pow10(precisionExp);
                    }
                }
                function equalWithPrecision(x, y, precision) {
                    return precision = applyDefault(precision, Double.DEFAULT_PRECISION), x === y || Math.abs(x - y) < precision;
                }
                function lessWithPrecision(x, y, precision) {
                    return precision = applyDefault(precision, Double.DEFAULT_PRECISION), y > x && Math.abs(x - y) > precision;
                }
                function lessOrEqualWithPrecision(x, y, precision) {
                    return precision = applyDefault(precision, Double.DEFAULT_PRECISION), y > x || Math.abs(x - y) < precision;
                }
                function greaterWithPrecision(x, y, precision) {
                    return precision = applyDefault(precision, Double.DEFAULT_PRECISION), x > y && Math.abs(x - y) > precision;
                }
                function greaterOrEqualWithPrecision(x, y, precision) {
                    return precision = applyDefault(precision, Double.DEFAULT_PRECISION), x > y || Math.abs(x - y) < precision;
                }
                function floorWithPrecision(x, precision) {
                    precision = applyDefault(precision, Double.DEFAULT_PRECISION);
                    var roundX = Math.round(x);
                    return Math.abs(x - roundX) < precision ? roundX : Math.floor(x);
                }
                function ceilWithPrecision(x, precision) {
                    precision = applyDefault(precision, Double.DEFAULT_PRECISION);
                    var roundX = Math.round(x);
                    return Math.abs(x - roundX) < precision ? roundX : Math.ceil(x);
                }
                function floorToPrecision(x, precision) {
                    return precision = applyDefault(precision, Double.DEFAULT_PRECISION), 0 === precision || 0 === x ? x : Math.floor(x / precision) * precision;
                }
                function ceilToPrecision(x, precision) {
                    return precision = applyDefault(precision, Double.DEFAULT_PRECISION), 0 === precision || 0 === x ? x : Math.ceil(x / precision) * precision;
                }
                function roundToPrecision(x, precision) {
                    if (precision = applyDefault(precision, Double.DEFAULT_PRECISION), 0 === precision || 0 === x) return x;
                    var result = Math.round(x / precision) * precision, decimalDigits = Math.round(Double.log10(Math.abs(x)) - Double.log10(precision)) + 1;
                    return decimalDigits > 0 && 16 > decimalDigits && (result = parseFloat(result.toPrecision(decimalDigits))), 
                    result;
                }
                function ensureInRange(x, min, max) {
                    return void 0 === x || null === x ? x : min > x ? min : x > max ? max : x;
                }
                function round(x) {
                    return .5 + x << 0;
                }
                function project(value, fromMin, fromSize, toMin, toSize) {
                    if (0 === fromSize || 0 === toSize) return value >= fromMin && fromMin + fromSize >= value ? toMin : NaN;
                    var relativeX = (value - fromMin) / fromSize, projectedX = toMin + relativeX * toSize;
                    return projectedX;
                }
                function removeDecimalNoise(value) {
                    return roundToPrecision(value, getPrecision(value));
                }
                function isInteger(value) {
                    return null !== value && value % 1 === 0;
                }
                function toIncrement(value, increment) {
                    return Math.round(value / increment) * increment;
                }
                Double.MIN_VALUE = -Number.MAX_VALUE, Double.MAX_VALUE = Number.MAX_VALUE, Double.MIN_EXP = -308, 
                Double.MAX_EXP = 308, Double.EPSILON = 1e-323, Double.DEFAULT_PRECISION = 1e-4, 
                Double.DEFAULT_PRECISION_IN_DECIMAL_DIGITS = 12, Double.LOG_E_10 = Math.log(10), 
                Double.POSITIVE_POWERS = [ 1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16, 1e17, 1e18, 1e19, 1e20, 1e21, 1e22, 1e23, 1e24, 1e25, 1e26, 1e27, 1e28, 1e29, 1e30, 1e31, 1e32, 1e33, 1e34, 1e35, 1e36, 1e37, 1e38, 1e39, 1e40, 1e41, 1e42, 1e43, 1e44, 1e45, 1e46, 1e47, 1e48, 1e49, 1e50, 1e51, 1e52, 1e53, 1e54, 1e55, 1e56, 1e57, 1e58, 1e59, 1e60, 1e61, 1e62, 1e63, 1e64, 1e65, 1e66, 1e67, 1e68, 1e69, 1e70, 1e71, 1e72, 1e73, 1e74, 1e75, 1e76, 1e77, 1e78, 1e79, 1e80, 1e81, 1e82, 1e83, 1e84, 1e85, 1e86, 1e87, 1e88, 1e89, 1e90, 1e91, 1e92, 1e93, 1e94, 1e95, 1e96, 1e97, 1e98, 1e99, 1e100, 1e101, 1e102, 1e103, 1e104, 1e105, 1e106, 1e107, 1e108, 1e109, 1e110, 1e111, 1e112, 1e113, 1e114, 1e115, 1e116, 1e117, 1e118, 1e119, 1e120, 1e121, 1e122, 1e123, 1e124, 1e125, 1e126, 1e127, 1e128, 1e129, 1e130, 1e131, 1e132, 1e133, 1e134, 1e135, 1e136, 1e137, 1e138, 1e139, 1e140, 1e141, 1e142, 1e143, 1e144, 1e145, 1e146, 1e147, 1e148, 1e149, 1e150, 1e151, 1e152, 1e153, 1e154, 1e155, 1e156, 1e157, 1e158, 1e159, 1e160, 1e161, 1e162, 1e163, 1e164, 1e165, 1e166, 1e167, 1e168, 1e169, 1e170, 1e171, 1e172, 1e173, 1e174, 1e175, 1e176, 1e177, 1e178, 1e179, 1e180, 1e181, 1e182, 1e183, 1e184, 1e185, 1e186, 1e187, 1e188, 1e189, 1e190, 1e191, 1e192, 1e193, 1e194, 1e195, 1e196, 1e197, 1e198, 1e199, 1e200, 1e201, 1e202, 1e203, 1e204, 1e205, 1e206, 1e207, 1e208, 1e209, 1e210, 1e211, 1e212, 1e213, 1e214, 1e215, 1e216, 1e217, 1e218, 1e219, 1e220, 1e221, 1e222, 1e223, 1e224, 1e225, 1e226, 1e227, 1e228, 1e229, 1e230, 1e231, 1e232, 1e233, 1e234, 1e235, 1e236, 1e237, 1e238, 1e239, 1e240, 1e241, 1e242, 1e243, 1e244, 1e245, 1e246, 1e247, 1e248, 1e249, 1e250, 1e251, 1e252, 1e253, 1e254, 1e255, 1e256, 1e257, 1e258, 1e259, 1e260, 1e261, 1e262, 1e263, 1e264, 1e265, 1e266, 1e267, 1e268, 1e269, 1e270, 1e271, 1e272, 1e273, 1e274, 1e275, 1e276, 1e277, 1e278, 1e279, 1e280, 1e281, 1e282, 1e283, 1e284, 1e285, 1e286, 1e287, 1e288, 1e289, 1e290, 1e291, 1e292, 1e293, 1e294, 1e295, 1e296, 1e297, 1e298, 1e299, 1e300, 1e301, 1e302, 1e303, 1e304, 1e305, 1e306, 1e307, 1e308 ], 
                Double.NEGATIVE_POWERS = [ 1, .1, .01, .001, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12, 1e-13, 1e-14, 1e-15, 1e-16, 1e-17, 1e-18, 1e-19, 1e-20, 1e-21, 1e-22, 1e-23, 1e-24, 1e-25, 1e-26, 1e-27, 1e-28, 1e-29, 1e-30, 1e-31, 1e-32, 1e-33, 1e-34, 1e-35, 1e-36, 1e-37, 1e-38, 1e-39, 1e-40, 1e-41, 1e-42, 1e-43, 1e-44, 1e-45, 1e-46, 1e-47, 1e-48, 1e-49, 1e-50, 1e-51, 1e-52, 1e-53, 1e-54, 1e-55, 1e-56, 1e-57, 1e-58, 1e-59, 1e-60, 1e-61, 1e-62, 1e-63, 1e-64, 1e-65, 1e-66, 1e-67, 1e-68, 1e-69, 1e-70, 1e-71, 1e-72, 1e-73, 1e-74, 1e-75, 1e-76, 1e-77, 1e-78, 1e-79, 1e-80, 1e-81, 1e-82, 1e-83, 1e-84, 1e-85, 1e-86, 1e-87, 1e-88, 1e-89, 1e-90, 1e-91, 1e-92, 1e-93, 1e-94, 1e-95, 1e-96, 1e-97, 1e-98, 1e-99, 1e-100, 1e-101, 1e-102, 1e-103, 1e-104, 1e-105, 1e-106, 1e-107, 1e-108, 1e-109, 1e-110, 1e-111, 1e-112, 1e-113, 1e-114, 1e-115, 1e-116, 1e-117, 1e-118, 1e-119, 1e-120, 1e-121, 1e-122, 1e-123, 1e-124, 1e-125, 1e-126, 1e-127, 1e-128, 1e-129, 1e-130, 1e-131, 1e-132, 1e-133, 1e-134, 1e-135, 1e-136, 1e-137, 1e-138, 1e-139, 1e-140, 1e-141, 1e-142, 1e-143, 1e-144, 1e-145, 1e-146, 1e-147, 1e-148, 1e-149, 1e-150, 1e-151, 1e-152, 1e-153, 1e-154, 1e-155, 1e-156, 1e-157, 1e-158, 1e-159, 1e-160, 1e-161, 1e-162, 1e-163, 1e-164, 1e-165, 1e-166, 1e-167, 1e-168, 1e-169, 1e-170, 1e-171, 1e-172, 1e-173, 1e-174, 1e-175, 1e-176, 1e-177, 1e-178, 1e-179, 1e-180, 1e-181, 1e-182, 1e-183, 1e-184, 1e-185, 1e-186, 1e-187, 1e-188, 1e-189, 1e-190, 1e-191, 1e-192, 1e-193, 1e-194, 1e-195, 1e-196, 1e-197, 1e-198, 1e-199, 1e-200, 1e-201, 1e-202, 1e-203, 1e-204, 1e-205, 1e-206, 1e-207, 1e-208, 1e-209, 1e-210, 1e-211, 1e-212, 1e-213, 1e-214, 1e-215, 1e-216, 1e-217, 1e-218, 1e-219, 1e-220, 1e-221, 1e-222, 1e-223, 1e-224, 1e-225, 1e-226, 1e-227, 1e-228, 1e-229, 1e-230, 1e-231, 1e-232, 1e-233, 1e-234, 1e-235, 1e-236, 1e-237, 1e-238, 1e-239, 1e-240, 1e-241, 1e-242, 1e-243, 1e-244, 1e-245, 1e-246, 1e-247, 1e-248, 1e-249, 1e-250, 1e-251, 1e-252, 1e-253, 1e-254, 1e-255, 1e-256, 1e-257, 1e-258, 1e-259, 1e-260, 1e-261, 1e-262, 1e-263, 1e-264, 1e-265, 1e-266, 1e-267, 1e-268, 1e-269, 1e-270, 1e-271, 1e-272, 1e-273, 1e-274, 1e-275, 1e-276, 1e-277, 1e-278, 1e-279, 1e-280, 1e-281, 1e-282, 1e-283, 1e-284, 1e-285, 1e-286, 1e-287, 1e-288, 1e-289, 1e-290, 1e-291, 1e-292, 1e-293, 1e-294, 1e-295, 1e-296, 1e-297, 1e-298, 1e-299, 1e-300, 1e-301, 1e-302, 1e-303, 1e-304, 1e-305, 1e-306, 1e-307, 1e-308, 1e-309, 1e-310, 1e-311, 1e-312, 1e-313, 1e-314, 1e-315, 1e-316, 1e-317, 1e-318, 1e-319, 1e-320, 1e-321, 1e-322, 1e-323, 0 ], 
                Double.pow10 = pow10, Double.log10 = log10, Double.getPrecision = getPrecision, 
                Double.equalWithPrecision = equalWithPrecision, Double.lessWithPrecision = lessWithPrecision, 
                Double.lessOrEqualWithPrecision = lessOrEqualWithPrecision, Double.greaterWithPrecision = greaterWithPrecision, 
                Double.greaterOrEqualWithPrecision = greaterOrEqualWithPrecision, Double.floorWithPrecision = floorWithPrecision, 
                Double.ceilWithPrecision = ceilWithPrecision, Double.floorToPrecision = floorToPrecision, 
                Double.ceilToPrecision = ceilToPrecision, Double.roundToPrecision = roundToPrecision, 
                Double.ensureInRange = ensureInRange, Double.round = round, Double.project = project, 
                Double.removeDecimalNoise = removeDecimalNoise, Double.isInteger = isInteger, Double.toIncrement = toIncrement;
            }(Double = powerbi.Double || (powerbi.Double = {}));
        }(powerbi || (powerbi = {}));
    },
    303: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon, powerbi = window.powerbi;
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(jsCommon) {
            var Color, Double = powerbi.Double;
            !function(Color) {
                function rotate(rgbString, rotateFactor) {
                    if (0 === rotateFactor) return rgbString;
                    var originalRgb = parseColorString(rgbString), originalHsv = rgbToHsv(originalRgb), rotatedHsv = rotateHsv(originalHsv, rotateFactor), rotatedRgb = hsvToRgb(rotatedHsv);
                    return hexString(rotatedRgb);
                }
                function normalizeToHexString(color) {
                    var rgb = parseColorString(color);
                    return hexString(rgb);
                }
                function parseColorString(color) {
                    if (color.indexOf("#") >= 0) {
                        if (7 === color.length) {
                            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
                            if (null == result || result.length < 4) return;
                            return {
                                R: parseInt(result[1], 16),
                                G: parseInt(result[2], 16),
                                B: parseInt(result[3], 16)
                            };
                        }
                        if (4 === color.length) {
                            var result = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(color);
                            if (null == result || result.length < 4) return;
                            return {
                                R: parseInt(result[1] + result[1], 16),
                                G: parseInt(result[2] + result[2], 16),
                                B: parseInt(result[3] + result[3], 16)
                            };
                        }
                    } else {
                        if (color.indexOf("rgb(") >= 0) {
                            var result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(color);
                            if (null == result || result.length < 4) return;
                            return {
                                R: parseInt(result[1], 10),
                                G: parseInt(result[2], 10),
                                B: parseInt(result[3], 10)
                            };
                        }
                        if (color.indexOf("rgba(") >= 0) {
                            var result = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)$/.exec(color);
                            if (null == result || result.length < 5) return;
                            return {
                                R: parseInt(result[1], 10),
                                G: parseInt(result[2], 10),
                                B: parseInt(result[3], 10),
                                A: parseFloat(result[4])
                            };
                        }
                    }
                }
                function rgbToHsv(rgbColor) {
                    var s, h, r = rgbColor.R / 255, g = rgbColor.G / 255, b = rgbColor.B / 255, min = Math.min(r, Math.min(g, b)), max = Math.max(r, Math.max(g, b)), v = max, delta = max - min;
                    return 0 === max || 0 === delta ? (s = 0, h = 0) : (s = delta / max, h = r === max ? (g - b) / delta : g === max ? 2 + (b - r) / delta : 4 + (r - g) / delta), 
                    h /= 6, 0 > h && (h += 1), {
                        H: h,
                        S: s,
                        V: v
                    };
                }
                function hsvToRgb(hsvColor) {
                    var r, g, b, h = hsvColor.H, s = hsvColor.S, v = hsvColor.V;
                    if (0 === s) r = v, g = v, b = v; else {
                        var p = void 0, q = void 0, t = void 0, fractionalSector = void 0, sectorNumber = void 0, sectorPos = void 0;
                        switch (sectorPos = 6 * h, sectorNumber = Math.floor(sectorPos), fractionalSector = sectorPos - sectorNumber, 
                        p = v * (1 - s), q = v * (1 - s * fractionalSector), t = v * (1 - s * (1 - fractionalSector)), 
                        sectorNumber) {
                          case 0:
                            r = v, g = t, b = p;
                            break;

                          case 1:
                            r = q, g = v, b = p;
                            break;

                          case 2:
                            r = p, g = v, b = t;
                            break;

                          case 3:
                            r = p, g = q, b = v;
                            break;

                          case 4:
                            r = t, g = p, b = v;
                            break;

                          case 5:
                            r = v, g = p, b = q;
                        }
                    }
                    return {
                        R: Math.floor(255 * r),
                        G: Math.floor(255 * g),
                        B: Math.floor(255 * b)
                    };
                }
                function rotateHsv(hsvColor, rotateFactor) {
                    var newH = hsvColor.H + rotateFactor;
                    return {
                        H: newH > 1 ? newH - 1 : newH,
                        S: hsvColor.S,
                        V: hsvColor.V
                    };
                }
                function darken(color, diff) {
                    var flooredNumber = Math.floor(diff);
                    return {
                        R: Math.max(0, color.R - flooredNumber),
                        G: Math.max(0, color.G - flooredNumber),
                        B: Math.max(0, color.B - flooredNumber)
                    };
                }
                function rgbString(color) {
                    return null == color.A ? "rgb(" + color.R + "," + color.G + "," + color.B + ")" : "rgba(" + color.R + "," + color.G + "," + color.B + "," + color.A + ")";
                }
                function hexString(color) {
                    return "#" + componentToHex(color.R) + componentToHex(color.G) + componentToHex(color.B);
                }
                function hexBlend(foreColor, opacity, backColor) {
                    return hexString(rgbBlend(parseColorString(foreColor), opacity, parseColorString(backColor)));
                }
                function rgbBlend(foreColor, opacity, backColor) {
                    return opacity = Double.ensureInRange(opacity, 0, 1), {
                        R: channelBlend(foreColor.R, opacity, backColor.R),
                        G: channelBlend(foreColor.G, opacity, backColor.G),
                        B: channelBlend(foreColor.B, opacity, backColor.B)
                    };
                }
                function channelBlend(foreChannel, opacity, backChannel) {
                    return opacity = Double.ensureInRange(opacity, 0, 1), foreChannel = Double.ensureInRange(foreChannel, 0, 255), 
                    backChannel = Double.ensureInRange(backChannel, 0, 255), Math.round(opacity * foreChannel + (1 - opacity) * backChannel);
                }
                function calculateHighlightColor(rgbColor, lumianceThreshold, delta) {
                    var hsvColor = rgbToHsv(rgbColor);
                    return (lumianceThreshold + delta > 1 || 0 >= lumianceThreshold || 0 >= delta) && (lumianceThreshold = .8, 
                    delta = .2), hsvColor.V < lumianceThreshold ? hsvColor.V = hsvColor.V + delta : hsvColor.V = hsvColor.V - delta, 
                    hexString(hsvToRgb(hsvColor));
                }
                function componentToHex(hexComponent) {
                    var clamped = Double.ensureInRange(hexComponent, 0, 255), hex = clamped.toString(16).toUpperCase();
                    return 1 === hex.length ? "0" + hex : hex;
                }
                Color.rotate = rotate, Color.normalizeToHexString = normalizeToHexString, Color.parseColorString = parseColorString, 
                Color.darken = darken, Color.rgbString = rgbString, Color.hexString = hexString, 
                Color.hexBlend = hexBlend, Color.rgbBlend = rgbBlend, Color.channelBlend = channelBlend, 
                Color.calculateHighlightColor = calculateHighlightColor;
            }(Color = jsCommon.Color || (jsCommon.Color = {}));
        }(jsCommon || (jsCommon = {}));
    },
    304: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        !function(jsCommon) {
            var CssConstants;
            !function(CssConstants) {
                function createClassAndSelector(className) {
                    return {
                        "class": className,
                        selector: "." + className
                    };
                }
                CssConstants.createClassAndSelector = createClassAndSelector, CssConstants.styleAttribute = "style", 
                CssConstants.pixelUnits = "px", CssConstants.heightProperty = "height", CssConstants.widthProperty = "width", 
                CssConstants.topProperty = "top", CssConstants.bottomProperty = "bottom", CssConstants.leftProperty = "left", 
                CssConstants.rightProperty = "right", CssConstants.marginTopProperty = "margin-top", 
                CssConstants.marginLeftProperty = "margin-left", CssConstants.displayProperty = "display", 
                CssConstants.backgroundProperty = "background", CssConstants.backgroundColorProperty = "background-color", 
                CssConstants.backgroundRepeatProperty = "background-repeat", CssConstants.backgroundSizeProperty = "background-size", 
                CssConstants.backgroundImageProperty = "background-image", CssConstants.textShadowProperty = "text-shadow", 
                CssConstants.textAlignProperty = "text-align", CssConstants.borderTopWidthProperty = "border-top-width", 
                CssConstants.borderBottomWidthProperty = "border-bottom-width", CssConstants.borderLeftWidthProperty = "border-left-width", 
                CssConstants.borderRightWidthProperty = "border-right-width", CssConstants.fontSizeProperty = "font-size", 
                CssConstants.fontWeightProperty = "font-weight", CssConstants.colorProperty = "color", 
                CssConstants.opacityProperty = "opacity", CssConstants.paddingLeftProperty = "padding-left", 
                CssConstants.paddingRightProperty = "padding-right", CssConstants.positionProperty = "position", 
                CssConstants.maxWidthProperty = "max-width", CssConstants.minWidthProperty = "min-width", 
                CssConstants.overflowProperty = "overflow", CssConstants.overflowXProperty = "overflow-x", 
                CssConstants.overflowYProperty = "overflow-y", CssConstants.transformProperty = "transform", 
                CssConstants.webkitTransformProperty = "-webkit-transform", CssConstants.cursorProperty = "cursor", 
                CssConstants.visibilityProperty = "visibility", CssConstants.absoluteValue = "absolute", 
                CssConstants.zeroPixelValue = "0px", CssConstants.autoValue = "auto", CssConstants.hiddenValue = "hidden", 
                CssConstants.noneValue = "none", CssConstants.blockValue = "block", CssConstants.inlineBlockValue = "inline-block", 
                CssConstants.transparentValue = "transparent", CssConstants.boldValue = "bold", 
                CssConstants.visibleValue = "visible", CssConstants.tableRowValue = "table-row", 
                CssConstants.coverValue = "cover", CssConstants.pointerValue = "pointer", CssConstants.scrollValue = "scroll";
            }(CssConstants = jsCommon.CssConstants || (jsCommon.CssConstants = {}));
        }(jsCommon || (jsCommon = {}));
    },
    305: function(module, exports) {
        var jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        $.fn.multiline = function(text) {
            return this.text(text), this.html(this.html().replace(/\n/g, "<br/>")), this;
        }, $.fn.togglePanelControl = function() {
            return this.each(function() {
                $(this).addClass("ui-accordion ui-accordion-icons ui-widget ui-helper-reset").find(".accordionHeader").addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-top ui-corner-bottom").hover(function() {
                    $(this).toggleClass("ui-state-hover");
                }).prepend('<span class="ui-icon ui-icon-triangle-1-e"></span>').click(function() {
                    return $(this).toggleClass("ui-accordion-header-active ui-state-active ui-state-default ui-corner-bottom").find("> .ui-icon").toggleClass("ui-icon-triangle-1-e ui-icon-triangle-1-s").end().next().slideToggle(), 
                    !1;
                }).next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").hide();
            });
        };
        var jsCommon;
        !function(jsCommon) {
            var JQueryConstants;
            !function(JQueryConstants) {
                JQueryConstants.VisibleSelector = ":visible";
            }(JQueryConstants = jsCommon.JQueryConstants || (jsCommon.JQueryConstants = {}));
        }(jsCommon || (jsCommon = {}));
    },
    306: function(module, exports) {
        window.jsCommon, window.powerbi, window.powerbitests, window.InJs, window.debug, 
        window.jasmine, window.Microsoft;
    },
    307: function(module, exports) {
        window.jsCommon, window.powerbi, window.powerbitests, window.InJs, window.debug, 
        window.jasmine, window.Microsoft;
    },
    308: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        !function(jsCommon) {
            var Formatting;
            !function(Formatting) {
                function findDateFormat(value, format, cultureName) {
                    switch (format) {
                      case "m":
                        format = "M";
                        break;

                      case "O":
                      case "o":
                        format = "yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'0000'";
                        break;

                      case "R":
                      case "r":
                        value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds()), 
                        format = "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'";
                        break;

                      case "s":
                        format = "S";
                        break;

                      case "u":
                        value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds()), 
                        format = "yyyy'-'MM'-'dd HH':'mm':'ss'Z'";
                        break;

                      case "U":
                        value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds()), 
                        format = "F";
                        break;

                      case "y":
                      case "Y":
                        switch (cultureName) {
                          case "default":
                          case "en":
                          case "en-US":
                            format = "MMMM, yyyy";
                            break;

                          default:
                            format = "Y";
                        }
                    }
                    return {
                        value: value,
                        format: format
                    };
                }
                function fixDateTimeFormat(format) {
                    if (format = format.replace(/%K/g, "zzz"), format = format.replace(/K/g, "zzz"), 
                    format = format.replace(/fffffff/g, "fff0000"), format = format.replace(/ffffff/g, "fff000"), 
                    format = format.replace(/fffff/g, "fff00"), format = format.replace(/ffff/g, "fff0"), 
                    format = format.replace(/yyyyy/g, "0yyyy"), format = format.replace(/(^y|^)yyy(^y|$)/g, "yyyy"), 
                    regexCache || (regexCache = [ "d", "f", "F", "g", "h", "H", "K", "m", "M", "s", "t", "y", "z", ":", "/" ].map(function(s) {
                        return {
                            r: new RegExp("%" + s + "(?!" + s + ")", "g"),
                            s: s
                        };
                    })), -1 !== format.indexOf("%") && format.length > 2) for (var i = 0; i < regexCache.length; i++) format = format.replace(regexCache[i].r, regexCache[i].s);
                    return format;
                }
                var regexCache;
                Formatting.findDateFormat = findDateFormat, Formatting.fixDateTimeFormat = fixDateTimeFormat;
            }(Formatting = jsCommon.Formatting || (jsCommon.Formatting = {}));
        }(jsCommon || (jsCommon = {}));
    },
    309: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        !function(jsCommon) {
            function requires(dependency, to) {
                void 0 === to && (to = $.noop), loadStyleSheets(dependency.cssFiles || []);
                var scriptsToRun = dependency.javaScriptFilesWithCallback || [];
                if (dependency.javaScriptFiles) for (var i = 0, len = dependency.javaScriptFiles.length; len > i; ++i) scriptsToRun.push({
                    javascriptFile: dependency.javaScriptFiles[i]
                });
                loadJavaScriptFiles(scriptsToRun, to);
            }
            function loadStyleSheets(hrefList) {
                hrefList.forEach(function(href) {
                    -1 === styleSheetLoaded.indexOf(href) && (styleSheetLoaded.push(href), loadStyleSheet(href));
                });
            }
            function loadJavaScriptFiles(scripts, callback) {
                function parseIfLoadingComplete() {
                    --loadingCount || parseJavaScriptSourceCodes(scripts, sourceCodeList);
                }
                function makeCallbackIfParsingComplete() {
                    --parsingCount || callback();
                }
                var loadingCount = scripts.length, parsingCount = loadingCount, sourceCodeList = [];
                scripts.forEach(function(script, index) {
                    var file = script.javascriptFile;
                    -1 === javaScriptFilesLoaded.indexOf(file) ? file in javaScriptFilesLoading ? javaScriptFilesLoading[file].push(function() {
                        parseIfLoadingComplete(), makeCallbackIfParsingComplete();
                    }) : (javaScriptFilesLoading[file] = [ function() {
                        makeCallbackIfParsingComplete();
                    } ], isExternalUrl(file) ? (sourceCodeList[index] = script, parseIfLoadingComplete()) : loadJavaScriptSourceCode(file, function(sourceCode) {
                        sourceCodeList[index] = {
                            javascriptFile: sourceCode
                        }, parseIfLoadingComplete();
                    })) : (parseIfLoadingComplete(), makeCallbackIfParsingComplete());
                });
            }
            function loadStyleSheet(href) {
                var link = linkElement.cloneNode();
                link.href = href, firstScriptInHeadElement ? headElement.insertBefore(link, firstScriptInHeadElement) : headElement.appendChild(link);
            }
            function loadJavaScriptSourceCode(src, onload) {
                webGet(src, function() {
                    onload(this.responseText);
                });
            }
            function parseJavaScript(script, onComplete) {
                if (void 0 === onComplete && (onComplete = $.noop), !script) return void onComplete();
                var sourceCodeOrFileName = script.javascriptFile, targetCallback = onComplete;
                if (script.onLoadCallback) {
                    var promiseAsCallback = function() {
                        script.onLoadCallback().then(onComplete);
                    };
                    targetCallback = promiseAsCallback;
                }
                isExternalUrl(sourceCodeOrFileName) ? loadExternalJavaScriptFile(sourceCodeOrFileName, targetCallback) : parseInternalJavaScriptCode(sourceCodeOrFileName, targetCallback);
            }
            function parseInternalJavaScriptCode(sourceCode, onComplete) {
                void 0 === onComplete && (onComplete = $.noop);
                var script;
                sourceCode && (script = scriptElement.cloneNode(), script.setAttribute("type", "text/javascript"), 
                script.innerHTML = sourceCode, headElement.appendChild(script)), setTimeout(onComplete, 0);
            }
            function loadExternalJavaScriptFile(src, onload) {
                var script;
                src && (script = scriptElement.cloneNode(), script.setAttribute("src", src), script.setAttribute("charset", "utf-8"), 
                script.onload = onload, headElement.appendChild(script));
            }
            function parseJavaScriptSourceCodes(scripts, sourceCodeList) {
                asyncLoop(sourceCodeList, parseJavaScript, function() {
                    scripts.forEach(function(script) {
                        var file = script.javascriptFile, listeners = javaScriptFilesLoading[file];
                        listeners && listeners.forEach(function(listener) {
                            listener();
                        }), delete javaScriptFilesLoading[file], -1 === javaScriptFilesLoaded.indexOf(file) && javaScriptFilesLoaded.push(file);
                    });
                });
            }
            function webGet(src, onload, onerror) {
                var xhr = new XMLHttpRequest();
                try {
                    xhr.open("GET", src, !0), xhr.onload = onload, xhr.onerror = onerror, xhr.send(null);
                } catch (e) {}
            }
            function isExternalUrl(url) {
                var origin = location.protocol + "//" + location.host + "/";
                return /^http[s]?:\/\/.+/i.test(url) && 0 !== url.indexOf(origin);
            }
            function _() {
                for (var args = [], _i = 0; _i < arguments.length; _i++) args[_i - 0] = arguments[_i];
            }
            function asyncSteps() {
                for (var args = [], _i = 0; _i < arguments.length; _i++) args[_i - 0] = arguments[_i];
                if (0 !== args.length) {
                    for (var steps = [], i = args.length; i--; ) !function(j) {
                        steps[j] = function() {
                            args[j](steps[j + 1] || _);
                        };
                    }(i);
                    steps[0]();
                }
            }
            function asyncLoop(enumerable, func, callback) {
                for (var steps = [], i = 0, len = enumerable.length; len - 1 > i; i++) !function(i) {
                    steps[i] = function(next) {
                        func(enumerable[i], next);
                    };
                }(i);
                steps[len - 1] = function(next) {
                    func(enumerable[len - 1], callback);
                }, asyncSteps.apply(null, steps);
            }
            var doc = document, headElement = doc.head, firstScriptInHeadElement = headElement.getElementsByTagName("script")[0], linkElement = doc.createElement("link"), scriptElement = doc.createElement("script"), styleSheetLoaded = [], javaScriptFilesLoaded = [], javaScriptFilesLoading = [];
            linkElement.setAttribute("rel", "stylesheet"), jsCommon.requires = requires;
        }(jsCommon || (jsCommon = {}));
    },
    310: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            function createJQueryPromiseFactory() {
                return new JQueryPromiseFactory();
            }
            powerbi.createJQueryPromiseFactory = createJQueryPromiseFactory;
            var JQueryPromiseFactory = function() {
                function JQueryPromiseFactory() {}
                return JQueryPromiseFactory.prototype.defer = function() {
                    return new JQueryDeferredWrapper($.Deferred());
                }, JQueryPromiseFactory.prototype.reject = function(reason) {
                    var deferred = this.defer();
                    return deferred.reject(reason), deferred.promise;
                }, JQueryPromiseFactory.prototype.resolve = function(value) {
                    var deferred = this.defer();
                    return deferred.resolve(value), deferred.promise;
                }, JQueryPromiseFactory.prototype.all = function(promises) {
                    var unwrappedPromises = jQuery.map(promises, function(value) {
                        return value && value.promise ? value.promise : value;
                    });
                    return new JQueryPromiseWrapper($.when.apply($, unwrappedPromises));
                }, JQueryPromiseFactory.prototype.allSettled = function(promises) {
                    var deferred = this.defer(), promiseCount = promises.length;
                    if (promiseCount > 0) for (var resolvedCount_1 = 0, results_1 = [], _loop_1 = function(i) {
                        promises[i].then(function(result) {
                            results_1[i] = {
                                value: result,
                                type: 0
                            };
                        })["catch"](function(result) {
                            results_1[i] = {
                                value: result,
                                type: 1
                            };
                        })["finally"](function() {
                            resolvedCount_1++, resolvedCount_1 === promiseCount && deferred.resolve(results_1);
                        });
                    }, i = 0; promiseCount > i; i++) _loop_1(i); else deferred.resolve([]);
                    return deferred.promise;
                }, JQueryPromiseFactory.prototype.when = function(value) {
                    var unwrappedPromise = value && value.promise ? value.promise : value;
                    return new JQueryPromiseWrapper($.when(unwrappedPromise));
                }, JQueryPromiseFactory;
            }(), JQueryDeferredWrapper = function() {
                function JQueryDeferredWrapper(deferred) {
                    this.deferred = deferred, this.promise = new JQueryPromiseWrapper(deferred.promise());
                }
                return JQueryDeferredWrapper.prototype.resolve = function(value) {
                    this.deferred.resolve(value);
                }, JQueryDeferredWrapper.prototype.reject = function(reason) {
                    this.deferred.reject(reason);
                }, JQueryDeferredWrapper;
            }(), JQueryPromiseWrapper = function() {
                function JQueryPromiseWrapper(promise) {
                    this.promise = promise;
                }
                return JQueryPromiseWrapper.prototype.then = function(a, b) {
                    return new JQueryPromiseWrapper(this.promise.then(JQueryPromiseWrapper.wrapCallback(a), JQueryPromiseWrapper.wrapCallback(b)));
                }, JQueryPromiseWrapper.prototype["catch"] = function(callback) {
                    return this.then(null, callback);
                }, JQueryPromiseWrapper.prototype["finally"] = function(callback) {
                    return this.promise.always(JQueryPromiseWrapper.wrapCallback(callback)), this;
                }, JQueryPromiseWrapper.wrapCallback = function(callback) {
                    return callback ? function(arg) {
                        var value = callback(arg);
                        return value instanceof JQueryPromiseWrapper ? value.promise : value;
                    } : callback;
                }, JQueryPromiseWrapper;
            }();
        }(powerbi || (powerbi = {}));
    },
    311: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            var LocalStorageService = function() {
                function LocalStorageService() {}
                return LocalStorageService.prototype.getData = function(key) {
                    try {
                        if (localStorage) {
                            var value = localStorage[key];
                            if (value) return JSON.parse(value);
                        }
                    } catch (exception) {}
                    return null;
                }, LocalStorageService.prototype.setData = function(key, data) {
                    try {
                        localStorage && (localStorage[key] = JSON.stringify(data));
                    } catch (e) {}
                }, LocalStorageService;
            }(), EphemeralStorageService = function() {
                function EphemeralStorageService(clearCacheInterval) {
                    this.cache = {}, this.clearCacheInterval = null != clearCacheInterval ? clearCacheInterval : EphemeralStorageService.defaultClearCacheInterval, 
                    this.clearCache();
                }
                return EphemeralStorageService.prototype.getData = function(key) {
                    return this.cache[key];
                }, EphemeralStorageService.prototype.setData = function(key, data) {
                    var _this = this;
                    this.cache[key] = data, null == this.clearCacheTimerId && (this.clearCacheTimerId = setTimeout(function() {
                        return _this.clearCache();
                    }, this.clearCacheInterval));
                }, EphemeralStorageService.prototype.clearCache = function() {
                    this.cache = {}, this.clearCacheTimerId = void 0;
                }, EphemeralStorageService.defaultClearCacheInterval = 864e5, EphemeralStorageService;
            }();
            powerbi.EphemeralStorageService = EphemeralStorageService, powerbi.localStorageService = new LocalStorageService(), 
            powerbi.ephemeralStorageService = new EphemeralStorageService();
        }(powerbi || (powerbi = {}));
    },
    312: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        !function(jsCommon) {
            var WordBreaker;
            !function(WordBreaker) {
                function search(index, content, backward) {
                    if (backward) {
                        for (var i = index - 1; i > -1; i--) if (hasBreakers(content[i])) return i + 1;
                    } else for (var i = index, ilen = content.length; ilen > i; i++) if (hasBreakers(content[i])) return i;
                    return backward ? 0 : content.length;
                }
                function find(index, content) {
                    var result = {
                        start: 0,
                        end: 0
                    };
                    return 0 === content.length ? result : (result.start = search(index, content, !0), 
                    result.end = search(index, content, !1), result);
                }
                function hasBreakers(content) {
                    return BREAKERS_REGEX.lastIndex = 0, BREAKERS_REGEX.test(content);
                }
                function wordCount(content) {
                    var count = 1;
                    for (BREAKERS_REGEX.lastIndex = 0, BREAKERS_REGEX.exec(content); 0 !== BREAKERS_REGEX.lastIndex; ) count++, 
                    BREAKERS_REGEX.exec(content);
                    return count;
                }
                function getMaxWordWidth(content, textWidthMeasurer, properties) {
                    for (var words = split(content), maxWidth = 0, _i = 0, words_1 = words; _i < words_1.length; _i++) {
                        var w = words_1[_i];
                        properties.text = w, maxWidth = Math.max(maxWidth, textWidthMeasurer(properties));
                    }
                    return maxWidth;
                }
                function split(content) {
                    return content.split(BREAKERS_REGEX);
                }
                function getWidth(content, properties, textWidthMeasurer) {
                    return properties.text = content, textWidthMeasurer(properties);
                }
                function truncate(content, properties, truncator, maxWidth) {
                    return properties.text = content, truncator(properties, maxWidth);
                }
                function splitByWidth(content, properties, textWidthMeasurer, maxWidth, maxNumLines, truncator) {
                    truncator = truncator ? truncator : function(properties, maxWidth) {
                        return properties.text;
                    };
                    for (var result = [], words = split(content), usedWidth = 0, wordsInLine = [], _i = 0, words_2 = words; _i < words_2.length; _i++) {
                        var word = words_2[_i];
                        if (maxNumLines > 0 && result.length >= maxNumLines - 1) wordsInLine.push(word); else {
                            var wordWidth = 0 === wordsInLine.length ? getWidth(word, properties, textWidthMeasurer) : getWidth(SPACE + word, properties, textWidthMeasurer);
                            if (usedWidth + wordWidth > maxWidth) {
                                if (0 === wordsInLine.length) {
                                    result.push(truncate(word, properties, truncator, maxWidth)), usedWidth = 0, wordsInLine = [];
                                    continue;
                                }
                                result.push(truncate(wordsInLine.join(SPACE), properties, truncator, maxWidth)), 
                                usedWidth = 0, wordsInLine = [];
                            }
                            wordsInLine.push(word), usedWidth += wordWidth;
                        }
                    }
                    return _.isEmpty(wordsInLine) || result.push(truncate(wordsInLine.join(SPACE), properties, truncator, maxWidth)), 
                    result;
                }
                var SPACE = " ", BREAKERS_REGEX = /[\s\n]+/g;
                WordBreaker.find = find, WordBreaker.hasBreakers = hasBreakers, WordBreaker.wordCount = wordCount, 
                WordBreaker.getMaxWordWidth = getMaxWordWidth, WordBreaker.splitByWidth = splitByWidth;
            }(WordBreaker = jsCommon.WordBreaker || (jsCommon.WordBreaker = {}));
        }(jsCommon || (jsCommon = {}));
    },
    313: function(module, exports) {
        var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            var TextMeasurementService;
            !function(TextMeasurementService) {
                function ensureDOM() {
                    spanElement || (spanElement = $("<span/>"), $("body").append(spanElement), svgTextElement = d3.select($("body").get(0)).append("svg").style({
                        height: "0px",
                        width: "0px",
                        position: "absolute"
                    }).append("text"), canvasCtx = $("<canvas/>").get(0).getContext("2d"), fallbackFontFamily = window.getComputedStyle(svgTextElement.node()).fontFamily);
                }
                function removeSpanElement() {
                    spanElement && spanElement.remove && spanElement.remove(), spanElement = null;
                }
                function measureSvgTextWidth(textProperties, text) {
                    return ensureDOM(), canvasCtx.font = (textProperties.fontStyle || "") + " " + (textProperties.fontVariant || "") + " " + (textProperties.fontWeight || "") + " " + textProperties.fontSize + " " + (textProperties.fontFamily || fallbackFontFamily), 
                    canvasCtx.measureText(text || textProperties.text).width;
                }
                function measureSvgTextRect(textProperties, text) {
                    return ensureDOM(), svgTextElement.style(null), svgTextElement.text(text || textProperties.text).attr({
                        visibility: "hidden",
                        "font-family": textProperties.fontFamily || fallbackFontFamily,
                        "font-variant": textProperties.fontVariant,
                        "font-size": textProperties.fontSize,
                        "font-weight": textProperties.fontWeight,
                        "font-style": textProperties.fontStyle,
                        "white-space": textProperties.whiteSpace || "nowrap"
                    }), svgTextElement.node().getBBox();
                }
                function measureSvgTextHeight(textProperties, text) {
                    return measureSvgTextRect(textProperties, text).height;
                }
                function estimateSvgTextRect(textProperties) {
                    var propertiesKey = textProperties.fontFamily + textProperties.fontSize, rect = powerbi.ephemeralStorageService.getData(propertiesKey);
                    if (null == rect) {
                        var estimatedTextProperties = {
                            fontFamily: textProperties.fontFamily,
                            fontSize: textProperties.fontSize,
                            text: "M"
                        };
                        rect = TextMeasurementService.measureSvgTextRect(estimatedTextProperties), rect.height > 0 && powerbi.ephemeralStorageService.setData(propertiesKey, rect);
                    }
                    return rect;
                }
                function estimateSvgTextBaselineDelta(textProperties) {
                    var rect = estimateSvgTextRect(textProperties);
                    return rect.y + rect.height;
                }
                function estimateSvgTextHeight(textProperties, tightFightForNumeric) {
                    void 0 === tightFightForNumeric && (tightFightForNumeric = !1);
                    var height = estimateSvgTextRect(textProperties).height;
                    return tightFightForNumeric && (height *= .7), height;
                }
                function measureSvgTextElementWidth(svgElement) {
                    return measureSvgTextWidth(getSvgMeasurementProperties(svgElement));
                }
                function getMeasurementProperties(element) {
                    return {
                        text: element.val() || element.text(),
                        fontFamily: element.css("font-family"),
                        fontSize: element.css("font-size"),
                        fontWeight: element.css("font-weight"),
                        fontStyle: element.css("font-style"),
                        fontVariant: element.css("font-variant"),
                        whiteSpace: element.css("white-space")
                    };
                }
                function getSvgMeasurementProperties(svgElement) {
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
                function getDivElementWidth(element) {
                    return getComputedStyle(element[0]).width;
                }
                function getTailoredTextOrDefault(textProperties, maxWidth) {
                    ensureDOM();
                    var strLength = textProperties.text.length;
                    if (0 === strLength) return textProperties.text;
                    var width = measureSvgTextWidth(textProperties);
                    if (maxWidth > width) return textProperties.text;
                    for (var copiedTextProperties = powerbi.Prototype.inherit(textProperties), text = copiedTextProperties.text = ellipsis + copiedTextProperties.text, min = 1, max = text.length, i = ellipsis.length; max >= min; ) if (i = (min + max) / 2 | 0, 
                    copiedTextProperties.text = text.substr(0, i), width = measureSvgTextWidth(copiedTextProperties), 
                    maxWidth > width) min = i + 1; else {
                        if (!(width > maxWidth)) break;
                        max = i - 1;
                    }
                    return copiedTextProperties.text = text.substr(0, i), width = measureSvgTextWidth(copiedTextProperties), 
                    width > maxWidth && i--, text.substr(ellipsis.length, i - ellipsis.length) + ellipsis;
                }
                function svgEllipsis(textElement, maxWidth) {
                    var properties = getSvgMeasurementProperties(textElement), originalText = properties.text, tailoredText = getTailoredTextOrDefault(properties, maxWidth);
                    originalText !== tailoredText && (textElement.textContent = tailoredText);
                }
                function wordBreak(textElement, maxWidth, maxHeight, linePadding) {
                    void 0 === linePadding && (linePadding = 0);
                    var properties = getSvgMeasurementProperties(textElement), height = estimateSvgTextHeight(properties) + linePadding, maxNumLines = Math.max(1, Math.floor(maxHeight / height)), node = d3.select(textElement), firstDY = node.attr("y"), labelText = textElement.textContent;
                    textElement.textContent = null;
                    for (var words = jsCommon.WordBreaker.splitByWidth(labelText, properties, measureSvgTextWidth, maxWidth, maxNumLines), i = 0, ilen = words.length; ilen > i; i++) properties.text = words[i], 
                    node.append("tspan").attr({
                        x: 0,
                        dy: 0 === i ? firstDY : height
                    }).text(getTailoredTextOrDefault(properties, maxWidth));
                }
                function wordBreakOverflowingText(textElement, maxWidth, maxHeight, linePadding) {
                    void 0 === linePadding && (linePadding = 0);
                    var properties = getSvgMeasurementProperties(textElement), height = estimateSvgTextHeight(properties) + linePadding, maxNumLines = Math.max(1, Math.floor(maxHeight / height)), labelText = textElement.textContent;
                    textElement.textContent = null;
                    var words = jsCommon.WordBreaker.splitByWidth(labelText, properties, measureSvgTextWidth, maxWidth, maxNumLines), spanItem = d3.select(textElement).selectAll(OverflowingText.selector).data(words, function(d) {
                        return $.inArray(d, words);
                    });
                    spanItem.enter().append("span").classed(OverflowingText["class"], !0).text(function(d) {
                        return d;
                    }).style("width", jsCommon.PixelConverter.toString(maxWidth));
                }
                var spanElement, svgTextElement, canvasCtx, fallbackFontFamily, ellipsis = "…", OverflowingText = jsCommon.CssConstants.createClassAndSelector("overflowingText");
                TextMeasurementService.removeSpanElement = removeSpanElement, TextMeasurementService.measureSvgTextWidth = measureSvgTextWidth, 
                TextMeasurementService.measureSvgTextRect = measureSvgTextRect, TextMeasurementService.measureSvgTextHeight = measureSvgTextHeight, 
                TextMeasurementService.estimateSvgTextBaselineDelta = estimateSvgTextBaselineDelta, 
                TextMeasurementService.estimateSvgTextHeight = estimateSvgTextHeight, TextMeasurementService.measureSvgTextElementWidth = measureSvgTextElementWidth, 
                TextMeasurementService.getMeasurementProperties = getMeasurementProperties, TextMeasurementService.getSvgMeasurementProperties = getSvgMeasurementProperties, 
                TextMeasurementService.getDivElementWidth = getDivElementWidth, TextMeasurementService.getTailoredTextOrDefault = getTailoredTextOrDefault, 
                TextMeasurementService.svgEllipsis = svgEllipsis, TextMeasurementService.wordBreak = wordBreak, 
                TextMeasurementService.wordBreakOverflowingText = wordBreakOverflowingText;
            }(TextMeasurementService = powerbi.TextMeasurementService || (powerbi.TextMeasurementService = {}));
        }(powerbi || (powerbi = {}));
    },
    314: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        !function(jsCommon) {
            var KeyUtils, DOMConstants = jsCommon.DOMConstants;
            !function(KeyUtils) {
                function isArrowKey(keyCode) {
                    return keyCode === DOMConstants.downArrowKeyCode || keyCode === DOMConstants.upArrowKeyCode || keyCode === DOMConstants.leftArrowKeyCode || keyCode === DOMConstants.rightArrowKeyCode;
                }
                function isCtrlDefaultKey(keyCode) {
                    return keyCode === DOMConstants.aKeyCode || keyCode === DOMConstants.cKeyCode || keyCode === DOMConstants.xKeyCode || keyCode === DOMConstants.vKeyCode;
                }
                function isNudgeModifierKey(keyCode) {
                    return keyCode === DOMConstants.shiftKeyCode;
                }
                KeyUtils.isArrowKey = isArrowKey, KeyUtils.isCtrlDefaultKey = isCtrlDefaultKey, 
                KeyUtils.isNudgeModifierKey = isNudgeModifierKey;
            }(KeyUtils = jsCommon.KeyUtils || (jsCommon.KeyUtils = {}));
        }(jsCommon || (jsCommon = {}));
    },
    315: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        !function(jsCommon) {
            var ThrottleUtility = function() {
                function ThrottleUtility(delay) {
                    this.timerFactory = jsCommon.TimerPromiseFactory.instance, this.delay = 0, delay && (this.delay = delay);
                }
                return ThrottleUtility.prototype.run = function(fn) {
                    var _this = this;
                    this.fn ? this.fn = fn : (this.fn = fn, this.timerFactory.create(this.delay).done(function() {
                        return _this.timerComplete(_this.fn);
                    }));
                }, ThrottleUtility.prototype.timerComplete = function(fn) {
                    fn(), this.fn = null;
                }, ThrottleUtility;
            }();
            jsCommon.ThrottleUtility = ThrottleUtility;
        }(jsCommon || (jsCommon = {}));
    },
    316: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        !function(jsCommon) {
            var TimerPromiseFactory = function() {
                function TimerPromiseFactory() {}
                return TimerPromiseFactory.prototype.create = function(delayInMs) {
                    var deferred = $.Deferred();
                    return window.setTimeout(function() {
                        return deferred.resolve();
                    }, delayInMs), deferred;
                }, TimerPromiseFactory.instance = new TimerPromiseFactory(), TimerPromiseFactory;
            }();
            jsCommon.TimerPromiseFactory = TimerPromiseFactory;
        }(jsCommon || (jsCommon = {}));
    },
    317: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        !function(jsCommon) {
            var UrlUtils;
            !function(UrlUtils) {
                function isValidUrl(value) {
                    if (jsCommon.StringExtensions.isNullOrEmpty(value)) return !1;
                    var match = jsCommon.RegExpExtensions.run(urlRegex, value);
                    return !(!match || 0 !== match.index);
                }
                function isValidImageUrl(url) {
                    return isValidUrl(url);
                }
                function findAllValidUrls(text) {
                    if (jsCommon.StringExtensions.isNullOrEmpty(text)) return [];
                    for (var matches, urlRanges = [], start = 0; null !== (matches = jsCommon.RegExpExtensions.run(urlRegex, text, start)); ) {
                        var url = matches[0], end = matches.index + url.length;
                        urlRanges.push({
                            start: matches.index,
                            end: end,
                            text: url
                        }), start = end;
                    }
                    return urlRanges;
                }
                function getBase64ContentFromDataUri(uri) {
                    if (0 !== uri.indexOf("data:")) throw new Error("Expected data uri");
                    var base64Token = ";base64,", indexBase64TokenStart = uri.indexOf(base64Token);
                    if (0 > indexBase64TokenStart) throw new Error("Expected base 64 content in data url");
                    var indexBase64Start = indexBase64TokenStart + base64Token.length;
                    return uri.substr(indexBase64Start, uri.length - indexBase64Start);
                }
                var urlRegex = /http[s]?:\/\/(\S)+/gi;
                UrlUtils.isValidUrl = isValidUrl, UrlUtils.isValidImageUrl = isValidImageUrl, UrlUtils.findAllValidUrls = findAllValidUrls, 
                UrlUtils.getBase64ContentFromDataUri = getBase64ContentFromDataUri;
            }(UrlUtils = jsCommon.UrlUtils || (jsCommon.UrlUtils = {}));
        }(jsCommon || (jsCommon = {}));
    },
    318: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        !function(jsCommon) {
            var BrowserUtils;
            !function(BrowserUtils) {
                function isChrome() {
                    var vendorName = window.navigator.vendor || "", userAgent = window.navigator.userAgent.toLowerCase();
                    return vendorName.toLowerCase().indexOf("google") > -1 && userAgent.indexOf("chrome") > -1 && -1 === userAgent.indexOf("edge") && -1 === userAgent.indexOf("opr");
                }
                function isInternetExplorerOrEdge() {
                    var userAgent = window.navigator.userAgent.toLowerCase();
                    return userAgent.indexOf("msie") > -1 || userAgent.indexOf("trident") > -1 || userAgent.indexOf("edge") > -1;
                }
                function getInternetExplorerVersion() {
                    var retValue = 0;
                    if ("Microsoft Internet Explorer" === navigator.appName || window.navigator.userAgent.indexOf("MSIE") >= 0) {
                        var re = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})"), result = re.exec(window.navigator.userAgent);
                        result && (retValue = parseFloat(result[1]));
                    }
                    return retValue;
                }
                function isFirefox() {
                    return navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
                }
                BrowserUtils.isChrome = isChrome, BrowserUtils.isInternetExplorerOrEdge = isInternetExplorerOrEdge, 
                BrowserUtils.getInternetExplorerVersion = getInternetExplorerVersion, BrowserUtils.isFirefox = isFirefox;
            }(BrowserUtils = jsCommon.BrowserUtils || (jsCommon.BrowserUtils = {}));
        }(jsCommon || (jsCommon = {}));
    },
    319: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            var visuals;
            !function(visuals) {
                var utility;
                !function(utility) {
                    var StyleUtils;
                    !function(StyleUtils) {
                        function getRotateAngleFromElement(element) {
                            var rawElemStyle = element.get(0).style, transformString = rawElemStyle.transform || rawElemStyle.webkitTransform;
                            if (transformString) {
                                var transform = transformString.match(/rotate\((-?\d+(?:\.\d*)?)deg\)/);
                                if (transform) return parseFloat(transform[1]);
                            }
                            return 0;
                        }
                        function getTranslateTransformFromElement(element) {
                            var rawElemStyle = element.get(0).style, transformString = rawElemStyle.transform || rawElemStyle.webkitTransform, retValue = {
                                x: 0,
                                y: 0
                            };
                            if (transformString && transformString.length > 0) {
                                var transform = transformString.match(/translate\((-?\d+(?:\.\d*)?)px, (-?\d+(?:\.\d*)?)px\)/);
                                transform && (retValue.x = parseFloat(transform[1]), retValue.y = parseFloat(transform[2]));
                            }
                            return retValue;
                        }
                        function getPadding(element) {
                            return element ? {
                                left: parseFloat(element.css("padding-left")) || 0,
                                right: parseFloat(element.css("padding-right")) || 0,
                                top: parseFloat(element.css("padding-top")) || 0,
                                bottom: parseFloat(element.css("padding-bottom")) || 0
                            } : void 0;
                        }
                        StyleUtils.getRotateAngleFromElement = getRotateAngleFromElement, StyleUtils.getTranslateTransformFromElement = getTranslateTransformFromElement, 
                        StyleUtils.getPadding = getPadding;
                    }(StyleUtils = utility.StyleUtils || (utility.StyleUtils = {}));
                }(utility = visuals.utility || (visuals.utility = {}));
            }(visuals = powerbi.visuals || (powerbi.visuals = {}));
        }(powerbi || (powerbi = {}));
    },
    320: function(module, exports, __webpack_require__) {
        var jsCommon, jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        !function(jsCommon) {
            var ConsoleTracer = function() {
                function ConsoleTracer() {}
                return ConsoleTracer.prototype.logTrace = function(trace) {
                    switch (trace.type) {
                      case jsCommon.TraceType.Information:
                        break;

                      case jsCommon.TraceType.UnexpectedError:
                      case jsCommon.TraceType.Error:
                      case jsCommon.TraceType.Fatal:
                        break;

                      case jsCommon.TraceType.ExpectedError:
                      case jsCommon.TraceType.Warning:
                        break;

                      case jsCommon.TraceType.Verbose:                    }
                }, ConsoleTracer;
            }();
            jsCommon.ConsoleTracer = ConsoleTracer;
            var Trace;
            !function(Trace) {
                function warning(text, requestId) {
                    logTraceInternal(new jsCommon.TraceItem(text, jsCommon.TraceType.Warning, requestId));
                }
                function error(text, includeStackTrace, requestId) {
                    includeStackTrace && (text = jsCommon.StringExtensions.format("{0}.\nStack:\n{1}", text, jsCommon.getStackTrace())), 
                    logTraceInternal(new jsCommon.TraceItem(text, jsCommon.TraceType.Error, requestId));
                }
                function verbose(text, requestId) {
                    logTraceInternal(new jsCommon.TraceItem(text, jsCommon.TraceType.Verbose, requestId));
                }
                function addListener(listener) {
                    listeners.push(listener);
                }
                function removeListener(listener) {
                    var index = listeners.indexOf(listener);
                    index >= 0 && listeners.splice(index, 1);
                }
                function resetListeners() {
                    listeners = new Array(defaultListener);
                }
                function reset() {
                    lastTraceIndex = -1;
                }
                function getTraces() {
                    if (!(0 > lastTraceIndex)) {
                        for (var result = new Array(lastTraceIndex + 1), i = 0; lastTraceIndex >= i; i++) result[i] = traces[i];
                        return result;
                    }
                }
                function disableDefaultListener() {
                    removeListener(defaultListener);
                }
                function enableDefaultListener() {
                    addListener(defaultListener);
                }
                function logTraceInternal(trace) {
                    lastTraceIndex + 1 >= traceMaxCount && reset(), traces[++lastTraceIndex] = trace;
                    for (var i = 0, len = listeners.length; len > i; i++) listeners[i].logTrace(trace);
                }
                var traceMaxCount = 1e3, traces = new Array(traceMaxCount), lastTraceIndex = -1, defaultListener = new ConsoleTracer(), listeners = new Array(defaultListener);
                Trace.warning = warning, Trace.error = error, Trace.verbose = verbose, Trace.addListener = addListener, 
                Trace.removeListener = removeListener, Trace.resetListeners = resetListeners, Trace.reset = reset, 
                Trace.getTraces = getTraces, Trace.disableDefaultListener = disableDefaultListener, 
                Trace.enableDefaultListener = enableDefaultListener;
            }(Trace = jsCommon.Trace || (jsCommon.Trace = {}));
        }(jsCommon || (jsCommon = {}));
    },
    321: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon;
        window.powerbi, window.powerbitests, window.InJs, window.debug, window.jasmine, 
        window.Microsoft;
        !function(jsCommon) {
            !function(TraceType) {
                TraceType[TraceType.Information = 0] = "Information", TraceType[TraceType.Verbose = 1] = "Verbose", 
                TraceType[TraceType.Warning = 2] = "Warning", TraceType[TraceType.Error = 3] = "Error", 
                TraceType[TraceType.ExpectedError = 4] = "ExpectedError", TraceType[TraceType.UnexpectedError = 5] = "UnexpectedError", 
                TraceType[TraceType.Fatal = 6] = "Fatal";
            }(jsCommon.TraceType || (jsCommon.TraceType = {}));
            jsCommon.TraceType;
        }(jsCommon || (jsCommon = {}));
    },
    322: function(module, exports) {
        var jsCommon, jsCommon = window.jsCommon, powerbi = window.powerbi;
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(jsCommon) {
            function ensurePowerView(action) {
                void 0 === action && (action = _.noop), jsCommon.requires(PowerViewPackage, action);
            }
            function ensureMap(locale, action) {
                var mapPackageWithLocale = powerbi.Prototype.inherit(MapPackage);
                if (!_.isEmpty(locale)) {
                    var localeSplit = locale.split("-", 2);
                    mapPackageWithLocale.javaScriptFilesWithCallback[0].javascriptFile = MSMapcontrol.concat("&mkt=" + locale + "&ur=" + (localeSplit.length > 1 ? localeSplit[1] : locale));
                }
                jsCommon.requires(mapPackageWithLocale, action);
            }
            function mapControlLoaded() {
                MSMapcontrolLoaded = !0, WaitForMSMapLoad && (WaitForMSMapLoad.resolve(), WaitForMSMapLoad = void 0);
            }
            function waitForMapControlLoaded() {
                var task;
                return MSMapcontrolLoaded ? (task = $.Deferred(), task.resolve()) : task = WaitForMSMapLoad = $.Deferred(), 
                task.promise();
            }
            var MSMapcontrol = "https://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&s=1&onscriptload=globalMapControlLoaded", MSMapcontrolLoaded = !1, WaitForMSMapLoad = null, PowerViewPackage = {
                javaScriptFiles: [ powerbi.build + "/externals/pv/webclient.js" ],
                cssFiles: [ powerbi.build + "/externals/pv/Styles/_all.css" ],
                javaScriptFilesWithCallback: [ {
                    javascriptFile: MSMapcontrol,
                    onLoadCallback: waitForMapControlLoaded
                } ]
            };
            jsCommon.ensurePowerView = ensurePowerView;
            var MapPackage = {
                javaScriptFilesWithCallback: [ {
                    javascriptFile: MSMapcontrol,
                    onLoadCallback: waitForMapControlLoaded
                } ]
            };
            jsCommon.ensureMap = ensureMap, jsCommon.mapControlLoaded = mapControlLoaded, jsCommon.waitForMapControlLoaded = waitForMapControlLoaded;
        }(jsCommon || (jsCommon = {})), globalMapControlLoaded = function() {
            jsCommon.mapControlLoaded();
        };
    },
    323: function(module, exports) {
        var InJs, InJs = (window.jsCommon, window.powerbi, window.powerbitests, window.InJs);
        window.debug, window.jasmine, window.Microsoft;
        !function(InJs) {
            !function(TraceType) {
                TraceType[TraceType.information = 0] = "information", TraceType[TraceType.verbose = 1] = "verbose", 
                TraceType[TraceType.warning = 2] = "warning", TraceType[TraceType.error = 3] = "error", 
                TraceType[TraceType.expectedError = 4] = "expectedError", TraceType[TraceType.unexpectedError = 5] = "unexpectedError", 
                TraceType[TraceType.fatal = 6] = "fatal";
            }(InJs.TraceType || (InJs.TraceType = {}));
            InJs.TraceType;
        }(InJs || (InJs = {}));
    }
});