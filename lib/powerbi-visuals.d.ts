
/**
 * Defines a Debug object. Calls to any functions in this object removed by the minifier.
 * The functions within this class are not minified away, so we use the preprocessor-style
 * comments to have the minifier remove those as well.
 */
declare module debug {
    let assertFailFunction: {
        (message: string): void;
    };
    /**
     * Asserts that the condition is true, fails otherwise.
     */
    function assert(condition: boolean, message: string): void;
    /**
     * Asserts that the value is neither null nor undefined, fails otherwise.
     */
    function assertValue<T>(value: T, message: string): void;
    /**
     * Asserts that the value is neither null nor undefined, and has a length property that returns greater than zero, fails otherwise.
     */
    function assertNonEmpty<T>(value: T[], message: string): void;
    /**
     * Makes no assertion on the given value.
     * This is documentation/placeholder that a value is possibly null or undefined (unlike assertValue).
     */
    function assertAnyValue<T>(value: T, message: string): void;
    function assertFail(message: string): void;
}

declare module jsCommon {
    interface IError extends Error {
        stack?: string;
        argument?: string;
    }
    module Errors {
        function infoNavAppAlreadyPresent(): IError;
        function invalidOperation(message: string): IError;
        function argument(argumentName: string, message: string): IError;
        function argumentNull(argumentName: string): IError;
        function argumentUndefined(argumentName: string): IError;
        function argumentOutOfRange(argumentName: string): IError;
        function pureVirtualMethodException(className: string, methodName: string): IError;
        function notImplementedException(message: string): IError;
    }
    /**
     * Captures the stack trace, if available.
     * It optionally takes the number of frames to remove from the stack trace.
     * By default, it removes the last frame to consider the calling type's
     * constructor and the temporary error used to capture the stack trace (below).
     * More levels can be requested as needed e..g. when an error is created
     * from a helper method. <Min requirement: IE10, Chrome, Firefox, Opera>.
     */
    function getStackTrace(leadingFramesToRemove?: number): string;
}

declare module jsCommon {
    /**
     * Represents a lazily instantiated value.
     */
    class Lazy<T> {
        private value;
        private factoryMethod;
        constructor(factoryMethod: () => T);
        getValue(): T;
    }
}

declare module powerbi {
    module Prototype {
        /**
         * Returns a new object with the provided obj as its prototype.
         */
        function inherit<T>(obj: T, extension?: (inherited: T) => void): T;
        /**
         * Returns a new object with the provided obj as its prototype
         * if, and only if, the prototype has not been previously set
         */
        function inheritSingle<T>(obj: T): T;
        /**
         * Uses the provided callback function to selectively replace contents in the provided array.
         * @return A new array with those values overriden
         * or undefined if no overrides are necessary.
         */
        function overrideArray<T, TArray>(prototype: TArray, override: (T) => T): TArray;
    }
}
/**
 * Defined in host.
 */
declare var clusterUri: string;
declare module jsCommon {
    /**
     * Http Status code we are interested.
     */
    enum HttpStatusCode {
        OK = 200,
        BadRequest = 400,
        Unauthorized = 401,
        Forbidden = 403,
        RequestEntityTooLarge = 413,
    }
    /**
     * Other HTTP Constants.
     */
    module HttpConstants {
        const ApplicationOctetStream: string;
        const MultiPartFormData: string;
    }
    /**
     * Extensions to String class.
     */
    module StringExtensions {
        function format(...args: string[]): string;
        /**
         * Compares two strings for equality, ignoring case.
         */
        function equalIgnoreCase(a: string, b: string): boolean;
        function startsWithIgnoreCase(a: string, b: string): boolean;
        function startsWith(a: string, b: string): boolean;
        /** Determines whether a string contains a specified substring (by case-sensitive comparison). */
        function contains(source: string, substring: string): boolean;
        /** Determines whether a string contains a specified substring (while ignoring case). */
        function containsIgnoreCase(source: string, substring: string): boolean;
        /**
         * Normalizes case for a string.
         * Used by equalIgnoreCase method.
         */
        function normalizeCase(value: string): string;
        /**
         * Is string null or empty or undefined?
         * @return True if the value is null or undefined or empty string,
         * otherwise false.
         */
        function isNullOrEmpty(value: string): boolean;
        /**
         * Returns true if the string is null, undefined, empty, or only includes white spaces.
         * @return True if the str is null, undefined, empty, or only includes white spaces,
         * otherwise false.
         */
        function isNullOrUndefinedOrWhiteSpaceString(str: string): boolean;
        /**
         * Returns a value indicating whether the str contains any whitespace.
         */
        function containsWhitespace(str: string): boolean;
        /**
         * Returns a value indicating whether the str is a whitespace string.
         */
        function isWhitespace(str: string): boolean;
        /**
         * Returns the string with any trailing whitespace from str removed.
         */
        function trimTrailingWhitespace(str: string): string;
        /**
         * Returns the string with any leading and trailing whitespace from str removed.
         */
        function trimWhitespace(str: string): string;
        /**
         * Returns length difference between the two provided strings.
         */
        function getLengthDifference(left: string, right: string): number;
        /**
         * Repeat char or string several times.
         * @param char The string to repeat.
         * @param count How many times to repeat the string.
         */
        function repeat(char: string, count: number): string;
        /**
         * Replace all the occurrences of the textToFind in the text with the textToReplace.
         * @param text The original string.
         * @param textToFind Text to find in the original string.
         * @param textToReplace New text replacing the textToFind.
         */
        function replaceAll(text: string, textToFind: string, textToReplace: string): string;
        function ensureUniqueNames(names: string[]): string[];
        /**
         * Returns a name that is not specified in the values.
         */
        function findUniqueName(usedNames: {
            [name: string]: boolean;
        }, baseName: string): string;
        function constructCommaSeparatedList(list: string[], resourceProvider: IStringResourceProvider, maxValue?: number): string;
        function escapeStringForRegex(s: string): string;
        /**
         * Remove file name reserved characters <>:"/\|?* from input string.
         */
        function normalizeFileName(fileName: string): string;
        /**
         * Similar to JSON.stringify, but strips away escape sequences so that the resulting
         * string is human-readable (and parsable by JSON formatting/validating tools).
         */
        function stringifyAsPrettyJSON(object: any): string;
        /**
         * Derive a CLS-compliant name from a specified string.  If no allowed characters are present, return a fallback string instead.
         * TODO (6708134): this should have a fully Unicode-aware implementation
         */
        function deriveClsCompliantName(input: string, fallback: string): string;
        /** Performs cheap sanitization by stripping away HTML tag (<>) characters. */
        function stripTagDelimiters(s: string): string;
    }
    /**
     * Interface used for interacting with WCF typed objects.
     */
    interface TypedObject {
        __type: string;
    }
    interface TextMatch {
        start: number;
        end: number;
        text: string;
    }
    /**
     * The general utility class.
     */
    class Utility {
        private static TypeNamespace;
        static JsonContentType: string;
        static JpegContentType: string;
        static XJavascriptContentType: string;
        static JsonDataType: string;
        static BlobDataType: string;
        static HttpGetMethod: string;
        static HttpPostMethod: string;
        static HttpPutMethod: string;
        static HttpDeleteMethod: string;
        static HttpContentTypeHeader: string;
        static HttpAcceptHeader: string;
        static Undefined: string;
        private static staticContentLocation;
        /**
         * Ensures the specified value is not null or undefined. Throws a relevent exception if it is.
         * @param value The value to check.
         * @param context The context from which the check originated.
         * @param methodName The name of the method that initiated the check.
         * @param parameterName The parameter name of the value to check.
         */
        static throwIfNullOrUndefined(value: any, context: any, methodName: any, parameterName: any): void;
        /**
         * Ensures the specified value is not null, undefined or empty. Throws a relevent exception if it is.
         * @param value The value to check.
         * @param context The context from which the check originated.
         * @param methodName The name of the method that initiated the check.
         * @param parameterName The parameter name of the value to check.
         */
        static throwIfNullOrEmpty(value: any, context: any, methodName: string, parameterName: string): void;
        /**
         * Ensures the specified string is not null, undefined or empty. Throws a relevent exception if it is.
         * @param value The value to check.
         * @param context The context from which the check originated.
         * @param methodName The name of the method that initiated the check.
         * @param parameterName The parameter name of the value to check.
         */
        static throwIfNullOrEmptyString(value: string, context: any, methodName: string, parameterName: string): void;
        /**
         * Ensures the specified value is not null, undefined, whitespace or empty. Throws a relevent exception if it is.
         * @param value The value to check.
         * @param context The context from which the check originated.
         * @param methodName The name of the method that initiated the check.
         * @param parameterName The parameter name of the value to check.
         */
        static throwIfNullEmptyOrWhitespaceString(value: string, context: any, methodName: string, parameterName: string): void;
        /**
         * Ensures the specified condition is true. Throws relevant exception if it isn't.
         * @param condition The condition to check.
         * @param context The context from which the check originated.
         * @param methodName The name of the method that initiated the check.
         * @param parameterName The parameter name against which the condition is checked.
         */
        static throwIfNotTrue(condition: boolean, context: any, methodName: string, parameterName: string): void;
        /**
         * Checks whether the provided value is a 'string'.
         * @param value The value to test.
         */
        static isString(value: any): boolean;
        /**
         * Checks whether the provided value is a 'boolean'.
         * @param value The value to test.
         */
        static isBoolean(value: any): boolean;
        /**
         * Checks whether the provided value is a 'number'.
         * @param value The value to test.
         */
        static isNumber(value: any): boolean;
        /**
         * Checks whether the provided value is a Date instance.
         * @param value The value to test.
         */
        static isDate(value: any): boolean;
        /**
         * Checks whether the provided value is an 'object'.
         * @param value The value to test.
         */
        static isObject(value: any): boolean;
        /**
         * Checks whether the provided value is null or undefined.
         * @param value The value to test.
         */
        static isNullOrUndefined(value: any): boolean;
        /**
         * Checks if the value is defined and returns it, else, returns undefined
         * @param {T} value Value to check
         * @param {T} defaultValue Default value to return if value is undefined
         * @returns value if defined, else defaultValue
         */
        static valueOrDefault<T>(value: T, defaultValue: T): T;
        /**
         * Combine a base url and a path.
         * @param baseUrl The base url.
         * @param path The path to add on to the base url.
         * @returns The combined url.
         */
        static urlCombine(baseUrl: string, path: string): string;
        static getAbsoluteUri(path: string): string;
        static getStaticResourceUri(path: string): string;
        static getComponentName(context: any): string;
        static throwException(e: any): void;
        static createClassSelector(className: string): string;
        static createIdSelector(id: string): string;
        /**
         * Creates a client-side Guid string.
         * @returns A string representation of a Guid.
         */
        static generateGuid(): string;
        /**
         * Try extract a cookie from {@link document.cookie} identified by key.
         */
        static getCookieValue(key: string): string;
        /**
         * Extracts the protocol://hostname section of a url.
         * @param url The URL from which to extract the section.
         * @returns The protocol://hostname portion of the given URL.
         */
        static getDomainForUrl(url: string): string;
        /**
         * Extracts the hostname and absolute path sections of a url.
         * @param url The URL from which to extract the section.
         * @returns The hostname and absolute path portion of the given URL.
         */
        static getHostNameForUrl(url: string): string;
        /**
         * Return the original url with query string stripped.
         * @param url The URL from which to extract the section.
         * @returns the original url with query string stripped.
         */
        static getUrlWithoutQueryString(url: string): string;
        /**
         * Extracts the protocol section of a url.
         * @param url The URL from which to extract the section.
         * @returns The protocol for the current URL.
         */
        static getProtocolFromUrl(url: string): string;
        /**
         * Returns a formatted href object from a URL.
         * @param url The URL used to generate the object.
         * @returns A jQuery object with the url.
         */
        static getHrefObjectFromUrl(url: string): JQuery;
        /**
         * Converts a WCF representation of a dictionary to a JavaScript dictionary.
         * @param wcfDictionary The WCF dictionary to convert.
         * @returns The native JavaScript representation of this dictionary.
         */
        static convertWcfToJsDictionary(wcfDictionary: any[]): {
            [index: string]: any;
        };
        static getDateFromWcfJsonString(jsonDate: string, fromUtcMilliseconds: boolean): Date;
        /**
         * Get the outer html of the given jquery object.
         * @param content The jquery object.
         * @returns The entire html representation of the object.
         */
        static getOuterHtml(content: JQuery): string;
        /**
         * Comparison Method: Compares two integer numbers.
         * @param a An integer value.
         * @param b An integer value.
         * @returns The comparison result.
         */
        static compareInt(a: number, b: number): number;
        /**
         * Return the index of the smallest value in a numerical array.
         * @param a A numeric array.
         * @returns The index of the smallest value in the array.
         */
        static getIndexOfMinValue(a: number[]): number;
        /**
         * Extracts a url from a background image attribute in the format of: url('www.foobar.com/image.png').
         * @param input The value of the background-image attribute.
         * @returns The extracted url.
         */
        static extractUrlFromCssBackgroundImage(input: string): string;
        /**
         * Verifies image data url of images.
         */
        static isValidImageDataUrl(url: string): boolean;
        static isLocalUrl(url: string): boolean;
        /**
         * Downloads a content string as a file.
         * @param content Content stream.
         * @param fileName File name to use.
         */
        static saveAsFile(content: any, fileName: string): void;
        /**
         * Helper method to get the simple type name from a typed object.
         * @param obj The typed object.
         * @returns The simple type name for the object.
         */
        static getType(obj: TypedObject): string;
        /**
         * Check if an element supports a specific event type.
         * @param eventName The name of the event.
         * @param element The element to test for event support.
         * @returns Whether the even is supported on the provided element.
         */
        static isEventSupported(eventName: string, element: Element): boolean;
        static toPixel(pixelAmount: number): string;
        static getPropertyCount(object: any): number;
        /**
         * Check if an element supports a specific event type.
         * @param filePath File path.
         * @returns File extension.
         */
        static getFileExtension(filePath: string): string;
        /**
         * Extract the filename out of a full path delimited by '\' or '/'.
         * @param filePath File path.
         * @returns filename File name.
         */
        static extractFileNameFromPath(filePath: string): string;
        /**
         * This method indicates whether window.clipboardData is supported.
         * For example, clipboard support for Windows Store apps is currently disabled
         * since window.clipboardData is unsupported (it raises access denied error)
         * since clipboard in Windows Store is being
         * achieved through Windows.ApplicationModel.DataTransfer.Clipboard class.
         */
        static canUseClipboard(): boolean;
        static is64BitOperatingSystem(): boolean;
        static parseNumber(value: any, defaultValue?: number): number;
        static getURLParamValue(name: string): string | number;
        /**
         * Return local timezone.
         * This function uses summer and winter offset to determine local time zone.
         * The result localTimeZoneString must be a subset of the strings used by server,
         * as documented here: https://msdn.microsoft.com/en-us/library/gg154758.aspx (Dynamic Daylight Savings Time (Compact 2013)).
         * @return Local timezone string or UTC if timezone cannot be found.
         */
        static getLocalTimeZoneString(): string;
    }
    class VersionUtility {
        /**
         * Compares 2 version strings.
         * @param versionA The first version string.
         * @param versionB The second version string.
         * @returns A result for the comparison.
         */
        static compareVersions(versionA: string, versionB: string): number;
    }
    module PerformanceUtil {
        class PerfMarker {
            private _name;
            private _start;
            constructor(name: string);
            private static begin(name);
            end(): void;
        }
        function create(name: string): PerfMarker;
    }
    module DeferUtility {
        /**
         * Wraps a callback and returns a new function.
         * The function can be called many times but the callback
         * will only be executed once on the next frame.
         * Use this to throttle big UI updates and access to DOM.
         */
        function deferUntilNextFrame(callback: Function): Function;
    }
}

declare module jsCommon {
    class TraceItem {
        type: TraceType;
        sessionId: string;
        requestId: string;
        text: string;
        timeStamp: Date;
        /**
         * Note: DO NOT USE for backward compability only.
         */
        _activityId: string;
        private static traceTypeStrings;
        constructor(text: string, type: TraceType, sessionId: string, requestId?: string);
        toString(): string;
    }
}

declare module jsCommon {
    /**
     * Interface to help define objects indexed by number to a particular type.
     */
    interface INumberDictionary<T> {
        [key: number]: T;
    }
    /**
     * Interface to help define objects indexed by name to a particular type.
     */
    interface IStringDictionary<T> {
        [key: string]: T;
    }
    /**
     * Extensions for Enumerations.
     */
    module EnumExtensions {
        /**
         * Gets a value indicating whether the value has the bit flags set.
         */
        function hasFlag(value: number, flag: number): boolean;
        /**
         * Sets a value of a flag without modifying any other flags.
         */
        function setFlag(value: number, flag: number): number;
        /**
         * Resets a value of a flag without modifying any other flags.
         */
        function resetFlag(value: number, flag: number): number;
        /**
         * According to the TypeScript Handbook, this is safe to do.
         */
        function toString(enumType: any, value: number): string;
    }
    /**
     * Extensions to String class.
     */
    module StringExtensions {
        /**
         * Checks if a string ends with a sub-string.
         */
        function endsWith(str: string, suffix: string): boolean;
    }
    module LogicExtensions {
        function XOR(a: boolean, b: boolean): boolean;
    }
    module JsonComparer {
        /**
         * Performs JSON-style comparison of two objects.
         */
        function equals<T>(x: T, y: T): boolean;
    }
    /**
     * Values are in terms of 'pt'
     * Convert to pixels using PixelConverter.fromPoint
     */
    module TextSizeDefaults {
        /**
         * Stored in terms of 'pt'
         * Convert to pixels using PixelConverter.fromPoint
         */
        const TextSizeMin: number;
        /**
         * Stored in terms of 'pt'
         * Convert to pixels using PixelConverter.fromPoint
         */
        const TextSizeMax: number;
        /**
         * Returns the percentage of this value relative to the TextSizeMax
         * @param textSize - should be given in terms of 'pt'
         */
        function getScale(textSize: number): number;
    }
    module PixelConverter {
        /**
         * Appends 'px' to the end of number value for use as pixel string in styles
         */
        function toString(px: number): string;
        /**
         * Converts point value (pt) to pixels
         * Returns a string for font-size property
         * e.g. fromPoint(8) => '24px'
         */
        function fromPoint(pt: number): string;
        /**
         * Converts point value (pt) to pixels
         * Returns a number for font-size property
         * e.g. fromPoint(8) => 24px
         */
        function fromPointToPixel(pt: number): number;
        /**
         * Converts pixel value (px) to pt
         * e.g. toPoint(24) => 8
         */
        function toPoint(px: number): number;
    }
    module RegExpExtensions {
        /**
         * Runs exec on regex starting from 0 index
         * This is the expected behavior but RegExp actually remember
         * the last index they stopped at (found match at) and will
         * return unexpected results when run in sequence.
         * @param regex - regular expression object
         * @param value - string to search wiht regex
         * @param start - index within value to start regex
         */
        function run(regex: RegExp, value: string, start?: number): RegExpExecArray;
    }
}

declare module powerbi.data {
    /** Allows generic traversal and type discovery for a SQExpr tree. */
    interface ISQExprVisitorWithArg<T, TArg> {
        visitEntity(expr: SQEntityExpr, arg: TArg): T;
        visitColumnRef(expr: SQColumnRefExpr, arg: TArg): T;
        visitMeasureRef(expr: SQMeasureRefExpr, arg: TArg): T;
        visitAggr(expr: SQAggregationExpr, arg: TArg): T;
        visitPercentile(expr: SQPercentileExpr, arg: TArg): T;
        visitHierarchy(expr: SQHierarchyExpr, arg: TArg): T;
        visitHierarchyLevel(expr: SQHierarchyLevelExpr, arg: TArg): T;
        visitPropertyVariationSource(expr: SQPropertyVariationSourceExpr, arg: TArg): T;
        visitSelectRef(expr: SQSelectRefExpr, arg: TArg): T;
        visitAnd(expr: SQAndExpr, arg: TArg): T;
        visitBetween(expr: SQBetweenExpr, arg: TArg): T;
        visitIn(expr: SQInExpr, arg: TArg): T;
        visitOr(expr: SQOrExpr, arg: TArg): T;
        visitCompare(expr: SQCompareExpr, arg: TArg): T;
        visitContains(expr: SQContainsExpr, arg: TArg): T;
        visitExists(expr: SQExistsExpr, arg: TArg): T;
        visitNot(expr: SQNotExpr, arg: TArg): T;
        visitStartsWith(expr: SQStartsWithExpr, arg: TArg): T;
        visitConstant(expr: SQConstantExpr, arg: TArg): T;
        visitDateSpan(expr: SQDateSpanExpr, arg: TArg): T;
        visitDateAdd(expr: SQDateAddExpr, arg: TArg): T;
        visitNow(expr: SQNowExpr, arg: TArg): T;
        visitDefaultValue(expr: SQDefaultValueExpr, arg: TArg): T;
        visitAnyValue(expr: SQAnyValueExpr, arg: TArg): T;
        visitArithmetic(expr: SQArithmeticExpr, arg: TArg): T;
        visitFillRule(expr: SQFillRuleExpr, arg: TArg): T;
        visitResourcePackageItem(expr: SQResourcePackageItemExpr, arg: TArg): T;
        visitScopedEval(expr: SQScopedEvalExpr, arg: TArg): T;
        visitWithRef(expr: SQWithRefExpr, arg: TArg): T;
        visitTransformTableRef(expr: SQTransformTableRefExpr, arg: TArg): T;
        visitTransformOutputRoleRef(expr: SQTransformOutputRoleRefExpr, arg: TArg): T;
    }
    interface ISQExprVisitor<T> extends ISQExprVisitorWithArg<T, void> {
    }
    /** Default IQueryExprVisitorWithArg implementation that others may derive from. */
    class DefaultSQExprVisitorWithArg<T, TArg> implements ISQExprVisitorWithArg<T, TArg> {
        visitEntity(expr: SQEntityExpr, arg: TArg): T;
        visitColumnRef(expr: SQColumnRefExpr, arg: TArg): T;
        visitMeasureRef(expr: SQMeasureRefExpr, arg: TArg): T;
        visitAggr(expr: SQAggregationExpr, arg: TArg): T;
        visitPercentile(expr: SQPercentileExpr, arg: TArg): T;
        visitHierarchy(expr: SQHierarchyExpr, arg: TArg): T;
        visitHierarchyLevel(expr: SQHierarchyLevelExpr, arg: TArg): T;
        visitPropertyVariationSource(expr: SQPropertyVariationSourceExpr, arg: TArg): T;
        visitSelectRef(expr: SQSelectRefExpr, arg: TArg): T;
        visitBetween(expr: SQBetweenExpr, arg: TArg): T;
        visitIn(expr: SQInExpr, arg: TArg): T;
        visitAnd(expr: SQAndExpr, arg: TArg): T;
        visitOr(expr: SQOrExpr, arg: TArg): T;
        visitCompare(expr: SQCompareExpr, arg: TArg): T;
        visitContains(expr: SQContainsExpr, arg: TArg): T;
        visitExists(expr: SQExistsExpr, arg: TArg): T;
        visitNot(expr: SQNotExpr, arg: TArg): T;
        visitStartsWith(expr: SQStartsWithExpr, arg: TArg): T;
        visitConstant(expr: SQConstantExpr, arg: TArg): T;
        visitDateSpan(expr: SQDateSpanExpr, arg: TArg): T;
        visitDateAdd(expr: SQDateAddExpr, arg: TArg): T;
        visitNow(expr: SQNowExpr, arg: TArg): T;
        visitDefaultValue(expr: SQDefaultValueExpr, arg: TArg): T;
        visitAnyValue(expr: SQAnyValueExpr, arg: TArg): T;
        visitArithmetic(expr: SQArithmeticExpr, arg: TArg): T;
        visitFillRule(expr: SQFillRuleExpr, arg: TArg): T;
        visitResourcePackageItem(expr: SQResourcePackageItemExpr, arg: TArg): T;
        visitScopedEval(expr: SQScopedEvalExpr, arg: TArg): T;
        visitWithRef(expr: SQWithRefExpr, arg: TArg): T;
        visitTransformTableRef(expr: SQTransformTableRefExpr, arg: TArg): T;
        visitTransformOutputRoleRef(expr: SQTransformOutputRoleRefExpr, arg: TArg): T;
        visitDefault(expr: SQExpr, arg: TArg): T;
    }
    /** Default ISQExprVisitor implementation that others may derive from. */
    class DefaultSQExprVisitor<T> extends DefaultSQExprVisitorWithArg<T, void> implements ISQExprVisitor<T> {
    }
    /** Default ISQExprVisitor implementation that implements default traversal and that others may derive from. */
    class DefaultSQExprVisitorWithTraversal implements ISQExprVisitor<void>, IFillRuleDefinitionVisitor<void, void> {
        visitEntity(expr: SQEntityExpr): void;
        visitColumnRef(expr: SQColumnRefExpr): void;
        visitMeasureRef(expr: SQMeasureRefExpr): void;
        visitAggr(expr: SQAggregationExpr): void;
        visitPercentile(expr: SQPercentileExpr): void;
        visitHierarchy(expr: SQHierarchyExpr): void;
        visitHierarchyLevel(expr: SQHierarchyLevelExpr): void;
        visitPropertyVariationSource(expr: SQPropertyVariationSourceExpr): void;
        visitSelectRef(expr: SQSelectRefExpr): void;
        visitBetween(expr: SQBetweenExpr): void;
        visitIn(expr: SQInExpr): void;
        visitAnd(expr: SQAndExpr): void;
        visitOr(expr: SQOrExpr): void;
        visitCompare(expr: SQCompareExpr): void;
        visitContains(expr: SQContainsExpr): void;
        visitExists(expr: SQExistsExpr): void;
        visitNot(expr: SQNotExpr): void;
        visitStartsWith(expr: SQStartsWithExpr): void;
        visitConstant(expr: SQConstantExpr): void;
        visitDateSpan(expr: SQDateSpanExpr): void;
        visitDateAdd(expr: SQDateAddExpr): void;
        visitNow(expr: SQNowExpr): void;
        visitDefaultValue(expr: SQDefaultValueExpr): void;
        visitAnyValue(expr: SQAnyValueExpr): void;
        visitArithmetic(expr: SQArithmeticExpr): void;
        visitFillRule(expr: SQFillRuleExpr): void;
        visitLinearGradient2(gradient2: LinearGradient2Definition): void;
        visitLinearGradient3(gradient3: LinearGradient3Definition): void;
        visitResourcePackageItem(expr: SQResourcePackageItemExpr): void;
        visitScopedEval(expr: SQScopedEvalExpr): void;
        visitWithRef(expr: SQWithRefExpr): void;
        visitTransformTableRef(expr: SQTransformTableRefExpr): void;
        visitTransformOutputRoleRef(expr: SQTransformOutputRoleRefExpr): void;
        visitDefault(expr: SQExpr): void;
        private visitFillRuleStop(stop);
    }
}

declare module powerbi {
    interface ValueTypeDescriptor {
        extendedType?: ExtendedType;
    }
    /** Describes a data value type, including a primitive type and extended type if any (derived from data category). */
    class ValueType implements ValueTypeDescriptor {
        private static typeCache;
        private underlyingType;
        private category;
        private temporalType;
        private geographyType;
        private miscType;
        private formattingType;
        private enumType;
        private scriptingType;
        /** Do not call the ValueType constructor directly. Use the ValueType.fromXXX methods. */
        constructor(type: ExtendedType, category?: string, enumType?: IEnumType);
        /** Creates or retrieves a ValueType object based on the specified ValueTypeDescriptor. */
        static fromDescriptor(descriptor: ValueTypeDescriptor): ValueType;
        /** Advanced: Generally use fromDescriptor instead. Creates or retrieves a ValueType object for the specified ExtendedType. */
        static fromExtendedType(extendedType: ExtendedType): ValueType;
        /** Creates or retrieves a ValueType object for the specified PrimitiveType and data category. */
        static fromPrimitiveTypeAndCategory(primitiveType: PrimitiveType, category?: string): ValueType;
        /** Creates a ValueType to describe the given IEnumType. */
        static fromEnum(enumType: IEnumType): ValueType;
        /** Determines if the specified type is compatible from at least one of the otherTypes. */
        static isCompatibleTo(type: ValueTypeDescriptor, otherTypes: ValueTypeDescriptor[]): boolean;
        /** Determines if the instance ValueType is convertable from the 'other' ValueType. */
        isCompatibleFrom(other: ValueType): boolean;
        /**
         * Determines if the instance ValueType is equal to the 'other' ValueType
         * @param {ValueType} other the other ValueType to check equality against
         * @returns True if the instance ValueType is equal to the 'other' ValueType
         */
        equals(other: ValueType): boolean;
        /** Gets the exact primitive type of this ValueType. */
        primitiveType: PrimitiveType;
        /** Gets the exact extended type of this ValueType. */
        extendedType: ExtendedType;
        /** Gets the data category string (if any) for this ValueType. */
        categoryString: string;
        /** Indicates whether the type represents text values. */
        text: boolean;
        /** Indicates whether the type represents any numeric value. */
        numeric: boolean;
        /** Indicates whether the type represents integer numeric values. */
        integer: boolean;
        /** Indicates whether the type represents Boolean values. */
        bool: boolean;
        /** Indicates whether the type represents any date/time values. */
        dateTime: boolean;
        /** Indicates whether the type represents duration values. */
        duration: boolean;
        /** Indicates whether the type represents binary values. */
        binary: boolean;
        /** Indicates whether the type represents none values. */
        none: boolean;
        /** Returns an object describing temporal values represented by the type, if it represents a temporal type. */
        temporal: TemporalType;
        /** Returns an object describing geographic values represented by the type, if it represents a geographic type. */
        geography: GeographyType;
        /** Returns an object describing the specific values represented by the type, if it represents a miscellaneous extended type. */
        misc: MiscellaneousType;
        /** Returns an object describing the formatting values represented by the type, if it represents a formatting type. */
        formatting: FormattingType;
        /** Returns an object describing the enum values represented by the type, if it represents an enumeration type. */
        enum: IEnumType;
        scripting: ScriptType;
    }
    class ScriptType implements ScriptTypeDescriptor {
        private underlyingType;
        constructor(type: ExtendedType);
        source: boolean;
    }
    class TemporalType implements TemporalTypeDescriptor {
        private underlyingType;
        constructor(type: ExtendedType);
        year: boolean;
        month: boolean;
        paddedDateTableDate: boolean;
    }
    class GeographyType implements GeographyTypeDescriptor {
        private underlyingType;
        constructor(type: ExtendedType);
        address: boolean;
        city: boolean;
        continent: boolean;
        country: boolean;
        county: boolean;
        region: boolean;
        postalCode: boolean;
        stateOrProvince: boolean;
        place: boolean;
        latitude: boolean;
        longitude: boolean;
    }
    class MiscellaneousType implements MiscellaneousTypeDescriptor {
        private underlyingType;
        constructor(type: ExtendedType);
        image: boolean;
        imageUrl: boolean;
        webUrl: boolean;
        barcode: boolean;
    }
    class FormattingType implements FormattingTypeDescriptor {
        private underlyingType;
        constructor(type: ExtendedType);
        color: boolean;
        formatString: boolean;
        alignment: boolean;
        labelDisplayUnits: boolean;
        fontSize: boolean;
        labelDensity: boolean;
    }
    /** Defines primitive value types. Must be consistent with types defined by server conceptual schema. */
    enum PrimitiveType {
        Null = 0,
        Text = 1,
        Decimal = 2,
        Double = 3,
        Integer = 4,
        Boolean = 5,
        Date = 6,
        DateTime = 7,
        DateTimeZone = 8,
        Time = 9,
        Duration = 10,
        Binary = 11,
        None = 12,
    }
    /** Defines extended value types, which include primitive types and known data categories constrained to expected primitive types. */
    enum ExtendedType {
        Numeric = 256,
        Temporal = 512,
        Geography = 1024,
        Miscellaneous = 2048,
        Formatting = 4096,
        Scripting = 8192,
        Null = 0,
        Text = 1,
        Decimal = 258,
        Double = 259,
        Integer = 260,
        Boolean = 5,
        Date = 518,
        DateTime = 519,
        DateTimeZone = 520,
        Time = 521,
        Duration = 10,
        Binary = 11,
        None = 12,
        Years = 66048,
        Years_Text = 66049,
        Years_Integer = 66308,
        Years_Date = 66054,
        Years_DateTime = 66055,
        Months = 131584,
        Months_Text = 131585,
        Months_Integer = 131844,
        Months_Date = 131590,
        Months_DateTime = 131591,
        PaddedDateTableDates = 197127,
        Address = 6554625,
        City = 6620161,
        Continent = 6685697,
        Country = 6751233,
        County = 6816769,
        Region = 6882305,
        PostalCode = 6947840,
        PostalCode_Text = 6947841,
        PostalCode_Integer = 6948100,
        StateOrProvince = 7013377,
        Place = 7078913,
        Latitude = 7144448,
        Latitude_Decimal = 7144706,
        Latitude_Double = 7144707,
        Longitude = 7209984,
        Longitude_Decimal = 7210242,
        Longitude_Double = 7210243,
        Image = 13109259,
        ImageUrl = 13174785,
        WebUrl = 13240321,
        Barcode = 13305856,
        Barcode_Text = 13305857,
        Barcode_Integer = 13306116,
        Color = 19664897,
        FormatString = 19730433,
        Alignment = 20058113,
        LabelDisplayUnits = 20123649,
        FontSize = 20189443,
        LabelDensity = 20254979,
        Enumeration = 26214401,
        ScriptSource = 32776193,
        SearchEnabled = 65541,
    }
}

declare module powerbi.data {
    interface QueryDefinition {
        Version?: number;
        From: EntitySource[];
        Where?: QueryFilter[];
        OrderBy?: QuerySortClause[];
        Select: QueryExpressionContainer[];
        GroupBy?: QueryExpressionContainer[];
        Transform?: QueryTransform[];
    }
    interface FilterDefinition {
        Version?: number;
        From: EntitySource[];
        Where: QueryFilter[];
    }
    enum EntitySourceType {
        Table = 0,
        Pod = 1,
        Expression = 2,
    }
    interface EntitySource {
        Name: string;
        EntitySet?: string;
        Entity?: string;
        Schema?: string;
        Expression?: QueryExpressionContainer;
        Type?: EntitySourceType;
    }
    interface QueryFilter {
        Target?: QueryExpressionContainer[];
        Condition: QueryExpressionContainer;
    }
    interface QuerySortClause {
        Expression: QueryExpressionContainer;
        Direction: SortDirection;
    }
    interface QueryExpressionContainer {
        Name?: string;
        SourceRef?: QuerySourceRefExpression;
        Column?: QueryColumnExpression;
        Measure?: QueryMeasureExpression;
        Aggregation?: QueryAggregationExpression;
        Percentile?: QueryPercentileExpression;
        Hierarchy?: QueryHierarchyExpression;
        HierarchyLevel?: QueryHierarchyLevelExpression;
        PropertyVariationSource?: QueryPropertyVariationSourceExpression;
        Subquery?: QuerySubqueryExpression;
        And?: QueryBinaryExpression;
        Between?: QueryBetweenExpression;
        In?: QueryInExpression;
        Or?: QueryBinaryExpression;
        Comparison?: QueryComparisonExpression;
        Not?: QueryNotExpression;
        Contains?: QueryContainsExpression;
        StartsWith?: QueryStartsWithExpression;
        Exists?: QueryExistsExpression;
        Boolean?: QueryBooleanExpression;
        DateTime?: QueryDateTimeExpression;
        DateTimeSecond?: QueryDateTimeSecondExpression;
        Date?: QueryDateTimeExpression;
        Decimal?: QueryDecimalExpression;
        Integer?: QueryIntegerExpression;
        Null?: QueryNullExpression;
        Number?: QueryNumberExpression;
        String?: QueryStringExpression;
        Literal?: QueryLiteralExpression;
        DateSpan?: QueryDateSpanExpression;
        DateAdd?: QueryDateAddExpression;
        Now?: QueryNowExpression;
        DefaultValue?: QueryDefaultValueExpression;
        AnyValue?: QueryAnyValueExpression;
        Arithmetic?: QueryArithmeticExpression;
        ScopedEval?: QueryScopedEvalExpression;
        WithRef?: QueryWithRefExpression;
        TransformTableRef?: QueryTransformTableRefExpression;
        TransformOutputRoleRef?: QueryTransformOutputRoleRefExpression;
        FillRule?: QueryFillRuleExpression;
        ResourcePackageItem?: QueryResourcePackageItem;
        SelectRef?: QuerySelectRefExpression;
    }
    interface QueryPropertyExpression {
        Expression: QueryExpressionContainer;
        Property: string;
    }
    interface QueryColumnExpression extends QueryPropertyExpression {
    }
    interface QueryMeasureExpression extends QueryPropertyExpression {
    }
    interface QuerySourceRefExpression {
        Source: string;
    }
    interface QuerySelectRefExpression {
        ExpressionName: string;
    }
    interface QueryAggregationExpression {
        Function: QueryAggregateFunction;
        Expression: QueryExpressionContainer;
    }
    interface QueryPercentileExpression {
        Expression: QueryExpressionContainer;
        K: number;
        Exclusive?: boolean;
    }
    interface QueryHierarchyExpression {
        Expression: QueryExpressionContainer;
        Hierarchy: string;
    }
    interface QueryHierarchyLevelExpression {
        Expression: QueryExpressionContainer;
        Level: string;
    }
    interface QueryPropertyVariationSourceExpression {
        Expression: QueryExpressionContainer;
        Name: string;
        Property: string;
    }
    interface QuerySubqueryExpression {
        Query: QueryDefinition;
    }
    interface QueryBinaryExpression {
        Left: QueryExpressionContainer;
        Right: QueryExpressionContainer;
    }
    interface QueryBetweenExpression {
        Expression: QueryExpressionContainer;
        LowerBound: QueryExpressionContainer;
        UpperBound: QueryExpressionContainer;
    }
    interface QueryInExpression {
        Expressions: QueryExpressionContainer[];
        Values: QueryExpressionContainer[][];
    }
    interface QueryComparisonExpression extends QueryBinaryExpression {
        ComparisonKind: QueryComparisonKind;
    }
    interface QueryContainsExpression extends QueryBinaryExpression {
    }
    interface QueryNotExpression {
        Expression: QueryExpressionContainer;
    }
    interface QueryStartsWithExpression extends QueryBinaryExpression {
    }
    interface QueryExistsExpression {
        Expression: QueryExpressionContainer;
    }
    interface QueryConstantExpression<T> {
        Value: T;
    }
    interface QueryLiteralExpression {
        Value: string;
    }
    interface QueryBooleanExpression extends QueryConstantExpression<boolean> {
    }
    interface QueryDateTimeExpression extends QueryConstantExpression<string> {
    }
    interface QueryDateTimeSecondExpression extends QueryConstantExpression<string> {
    }
    interface QueryDecimalExpression extends QueryConstantExpression<number> {
    }
    interface QueryIntegerExpression extends QueryConstantExpression<number> {
    }
    interface QueryNumberExpression extends QueryConstantExpression<string> {
    }
    interface QueryNullExpression {
    }
    interface QueryStringExpression extends QueryConstantExpression<string> {
    }
    interface QueryDateSpanExpression {
        TimeUnit: TimeUnit;
        Expression: QueryExpressionContainer;
    }
    interface QueryDateAddExpression {
        Amount: number;
        TimeUnit: TimeUnit;
        Expression: QueryExpressionContainer;
    }
    interface QueryNowExpression {
    }
    interface QueryDefaultValueExpression {
    }
    interface QueryAnyValueExpression {
    }
    interface QueryArithmeticExpression {
        Left: QueryExpressionContainer;
        Right: QueryExpressionContainer;
        Operator: ArithmeticOperatorKind;
    }
    const enum ArithmeticOperatorKind {
        Add = 0,
        Subtract = 1,
        Multiply = 2,
        Divide = 3,
    }
    function getArithmeticOperatorName(arithmeticOperatorKind: ArithmeticOperatorKind): string;
    interface QueryFillRuleExpression {
        Input: QueryExpressionContainer;
        FillRule: FillRuleGeneric<QueryExpressionContainer, QueryExpressionContainer>;
    }
    interface QueryResourcePackageItem {
        PackageName: string;
        PackageType: number;
        ItemName: string;
    }
    interface QueryScopedEvalExpression {
        Expression: QueryExpressionContainer;
        Scope: QueryExpressionContainer[];
    }
    interface QueryWithRefExpression {
        ExpressionName: string;
    }
    interface QueryTransformTableRefExpression {
        Source: string;
    }
    interface QueryTransformOutputRoleRefExpression {
        Role: string;
        Transform?: string;
    }
    enum TimeUnit {
        Day = 0,
        Week = 1,
        Month = 2,
        Year = 3,
        Decade = 4,
        Second = 5,
        Minute = 6,
        Hour = 7,
    }
    enum QueryAggregateFunction {
        Sum = 0,
        Avg = 1,
        Count = 2,
        Min = 3,
        Max = 4,
        CountNonNull = 5,
        Median = 6,
        StandardDeviation = 7,
        Variance = 8,
    }
    enum QueryComparisonKind {
        Equal = 0,
        GreaterThan = 1,
        GreaterThanOrEqual = 2,
        LessThan = 3,
        LessThanOrEqual = 4,
    }
    /** Defines semantic data types. */
    enum SemanticType {
        None = 0,
        Number = 1,
        Integer = 3,
        DateTime = 4,
        Time = 8,
        Date = 20,
        Month = 35,
        Year = 67,
        YearAndMonth = 128,
        MonthAndDay = 256,
        Decade = 515,
        YearAndWeek = 1024,
        String = 2048,
        Boolean = 4096,
        Table = 8192,
        Range = 16384,
    }
    interface QueryMetadata {
        Select?: SelectMetadata[];
        Filters?: FilterMetadata[];
    }
    interface SelectMetadata {
        Restatement: string;
        Type?: number;
        Format?: string;
        DataCategory?: ConceptualDataCategory;
        /** The select projection name. */
        Name?: string;
        kpiStatusGraphic?: string;
        kpi?: DataViewKpiColumnMetadata;
    }
    interface FilterMetadata {
        Restatement: string;
        Kind?: FilterKind;
        /** The expression being filtered.  This is reflected in the filter card UI. */
        expression?: QueryExpressionContainer;
    }
    enum FilterKind {
        Default = 0,
        Period = 1,
    }
    interface QueryTransform {
        Name: string;
        Algorithm: string;
        Input: QueryTransformInput;
        Output: QueryTransformOutput;
    }
    interface QueryTransformInput {
        Parameters: QueryExpressionContainer[];
        Table?: QueryTransformTable;
    }
    interface QueryTransformOutput {
        Table?: QueryTransformTable;
    }
    interface QueryTransformTable {
        Name: string;
        Columns: QueryTransformTableColumn[];
    }
    interface QueryTransformTableColumn {
        Role?: string;
        Expression: QueryExpressionContainer;
    }
}
declare module powerbi.data {
    import INumberDictionary = jsCommon.INumberDictionary;
    interface DataViewTransformApplyOptions {
        prototype: DataView;
        objectDescriptors: DataViewObjectDescriptors;
        dataViewMappings?: DataViewMapping[];
        transforms: DataViewTransformActions;
        colorAllocatorFactory: IColorAllocatorFactory;
        dataRoles: VisualDataRole[];
    }
    /** Describes the Transform actions to be done to a prototype DataView. */
    interface DataViewTransformActions {
        /** Describes transform metadata for each semantic query select item, as the arrays align, by index. */
        selects?: DataViewSelectTransform[];
        /** Describes the DataViewObject definitions. */
        objects?: DataViewObjectDefinitions;
        /** Describes the splitting of a single input DataView into multiple DataViews. */
        splits?: DataViewSplitTransform[];
        /** Describes the projection metadata which includes projection ordering and active items. */
        roles?: DataViewRoleTransformMetadata;
    }
    interface DataViewSplitTransform {
        selects: INumberDictionary<boolean>;
    }
    interface DataViewProjectionOrdering {
        [roleName: string]: number[];
    }
    interface DataViewProjectionActiveItemInfo {
        queryRef: string;
        /** Describes if the active item should be ignored in concatenation.
            If the active item has a drill filter, it will not be used in concatenation.
            If the value of suppressConcat is true, the activeItem will be ommitted from concatenation. */
        suppressConcat?: boolean;
    }
    interface DataViewProjectionActiveItems {
        [roleName: string]: DataViewProjectionActiveItemInfo[];
    }
    interface DataViewRoleTransformMetadata {
        /** Describes the order of selects (referenced by query index) in each role. */
        ordering?: DataViewProjectionOrdering;
        /** Describes the active items in each role. */
        activeItems?: DataViewProjectionActiveItems;
    }
    interface MatrixTransformationContext {
        rowHierarchyRewritten: boolean;
        columnHierarchyRewritten: boolean;
        hierarchyTreesRewritten: boolean;
    }
    const enum StandardDataViewKinds {
        None = 0,
        Categorical = 1,
        Matrix = 2,
        Single = 4,
        Table = 8,
        Tree = 16,
    }
    module DataViewTransform {
        function apply(options: DataViewTransformApplyOptions): DataView[];
        function transformObjects(dataView: DataView, targetDataViewKinds: StandardDataViewKinds, objectDescriptors: DataViewObjectDescriptors, objectDefinitions: DataViewObjectDefinitions, selectTransforms: DataViewSelectTransform[], colorAllocatorFactory: IColorAllocatorFactory): void;
        function createValueColumns(values?: DataViewValueColumn[], valueIdentityFields?: SQExpr[], source?: DataViewMetadataColumn): DataViewValueColumns;
        function setGrouped(values: DataViewValueColumns, groupedResult?: DataViewValueColumnGroup[]): void;
    }
}

declare module powerbi {
    module DataViewScopeIdentity {
        /** Compares the two DataViewScopeIdentity values for equality. */
        function equals(x: DataViewScopeIdentity, y: DataViewScopeIdentity, ignoreCase?: boolean): boolean;
        function filterFromIdentity(identities: DataViewScopeIdentity[], isNot?: boolean): data.SemanticFilter;
        function filterFromExprs(orExprs: data.SQExpr[], isNot?: boolean): data.SemanticFilter;
    }
    module data {
        function createDataViewScopeIdentity(expr: SQExpr): DataViewScopeIdentity;
    }
}

declare module powerbi.data {
    module PrimitiveValueEncoding {
        function decimal(value: number): string;
        function double(value: number): string;
        function integer(value: number): string;
        function dateTime(value: Date): string;
        function text(value: string): string;
        function nullEncoding(): string;
        function boolean(value: boolean): string;
    }
}

declare module powerbi.data {
    /** Rewrites an expression tree, including all descendant nodes. */
    class SQExprRewriter implements ISQExprVisitor<SQExpr>, IFillRuleDefinitionVisitor<LinearGradient2Definition, LinearGradient3Definition> {
        visitColumnRef(expr: SQColumnRefExpr): SQExpr;
        visitMeasureRef(expr: SQMeasureRefExpr): SQExpr;
        visitAggr(expr: SQAggregationExpr): SQExpr;
        visitSelectRef(expr: SQSelectRefExpr): SQExpr;
        visitPercentile(expr: SQPercentileExpr): SQExpr;
        visitHierarchy(expr: SQHierarchyExpr): SQExpr;
        visitHierarchyLevel(expr: SQHierarchyLevelExpr): SQExpr;
        visitPropertyVariationSource(expr: SQPropertyVariationSourceExpr): SQExpr;
        visitEntity(expr: SQEntityExpr): SQExpr;
        visitAnd(orig: SQAndExpr): SQExpr;
        visitBetween(orig: SQBetweenExpr): SQExpr;
        visitIn(orig: SQInExpr): SQExpr;
        private rewriteAll(origExprs);
        visitOr(orig: SQOrExpr): SQExpr;
        visitCompare(orig: SQCompareExpr): SQExpr;
        visitContains(orig: SQContainsExpr): SQExpr;
        visitExists(orig: SQExistsExpr): SQExpr;
        visitNot(orig: SQNotExpr): SQExpr;
        visitStartsWith(orig: SQStartsWithExpr): SQExpr;
        visitConstant(expr: SQConstantExpr): SQExpr;
        visitDateSpan(orig: SQDateSpanExpr): SQExpr;
        visitDateAdd(orig: SQDateAddExpr): SQExpr;
        visitNow(orig: SQNowExpr): SQExpr;
        visitDefaultValue(orig: SQDefaultValueExpr): SQExpr;
        visitAnyValue(orig: SQAnyValueExpr): SQExpr;
        visitArithmetic(orig: SQArithmeticExpr): SQExpr;
        visitScopedEval(orig: SQScopedEvalExpr): SQExpr;
        visitWithRef(orig: SQWithRefExpr): SQExpr;
        visitTransformTableRef(orig: SQTransformTableRefExpr): SQExpr;
        visitTransformOutputRoleRef(orig: SQTransformOutputRoleRefExpr): SQExpr;
        visitFillRule(orig: SQFillRuleExpr): SQExpr;
        visitLinearGradient2(origGradient2: LinearGradient2Definition): LinearGradient2Definition;
        visitLinearGradient3(origGradient3: LinearGradient3Definition): LinearGradient3Definition;
        private visitFillRuleStop(stop);
        visitResourcePackageItem(orig: SQResourcePackageItemExpr): SQExpr;
    }
}

declare module powerbi.data {
    /** Represents an immutable expression within a SemanticQuery. */
    abstract class SQExpr implements ISQExpr {
        private _kind;
        constructor(kind: SQExprKind);
        static equals(x: SQExpr, y: SQExpr, ignoreCase?: boolean): boolean;
        validate(schema: FederatedConceptualSchema, aggrUtils: ISQAggregationOperations, errors?: SQExprValidationError[]): SQExprValidationError[];
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
        kind: SQExprKind;
        static isArithmetic(expr: SQExpr): expr is SQArithmeticExpr;
        static isColumn(expr: SQExpr): expr is SQColumnRefExpr;
        static isConstant(expr: SQExpr): expr is SQConstantExpr;
        static isEntity(expr: SQExpr): expr is SQEntityExpr;
        static isHierarchy(expr: SQExpr): expr is SQHierarchyExpr;
        static isHierarchyLevel(expr: SQExpr): expr is SQHierarchyLevelExpr;
        static isAggregation(expr: SQExpr): expr is SQAggregationExpr;
        static isMinAggregation(expr: SQExpr): expr is SQAggregationExpr;
        static isMaxAggregation(expr: SQExpr): expr is SQAggregationExpr;
        static isAvgAggregation(expr: SQExpr): expr is SQAggregationExpr;
        static isMedianAggregation(expr: SQExpr): expr is SQAggregationExpr;
        static isMeasure(expr: SQExpr): expr is SQMeasureRefExpr;
        static isPercentile(expr: SQExpr): expr is SQPercentileExpr;
        static isSelectRef(expr: SQExpr): expr is SQSelectRefExpr;
        static isScopedEval(expr: SQExpr): expr is SQScopedEvalExpr;
        static isWithRef(expr: SQExpr): expr is SQWithRefExpr;
        static isTransformTableRef(expr: SQExpr): expr is SQTransformTableRefExpr;
        static isTransformOutputRoleRef(expr: SQExpr): expr is SQTransformOutputRoleRefExpr;
        static isResourcePackageItem(expr: SQExpr): expr is SQResourcePackageItemExpr;
        getMetadata(federatedSchema: FederatedConceptualSchema): SQExprMetadata;
        getDefaultAggregate(federatedSchema: FederatedConceptualSchema, forceAggregation?: boolean): QueryAggregateFunction;
        /** Return the SQExpr[] of group on columns if it has group on keys otherwise return the SQExpr of the column.*/
        getKeyColumns(schema: FederatedConceptualSchema): SQExpr[];
        /** Returns a value indicating whether the expression would group on keys other than itself.*/
        hasGroupOnKeys(schema: FederatedConceptualSchema): boolean;
        private getPropertyKeys(schema);
        getConceptualProperty(federatedSchema: FederatedConceptualSchema): ConceptualProperty;
        getTargetEntityForVariation(federatedSchema: FederatedConceptualSchema, variationName: string): string;
        getTargetEntity(federatedSchema: FederatedConceptualSchema): SQEntityExpr;
        private getHierarchyLevelConceptualProperty(federatedSchema);
        private getMetadataForVariation(field, federatedSchema);
        private getMetadataForHierarchyLevel(field, federatedSchema);
        private getMetadataForPercentOfGrandTotal();
        private getPropertyMetadata(field, property);
        private getMetadataForProperty(field, federatedSchema);
        private static getMetadataForEntity(field, federatedSchema);
    }
    const enum SQExprKind {
        Entity = 0,
        ColumnRef = 1,
        MeasureRef = 2,
        Aggregation = 3,
        PropertyVariationSource = 4,
        Hierarchy = 5,
        HierarchyLevel = 6,
        And = 7,
        Between = 8,
        In = 9,
        Or = 10,
        Contains = 11,
        Compare = 12,
        StartsWith = 13,
        Exists = 14,
        Not = 15,
        Constant = 16,
        DateSpan = 17,
        DateAdd = 18,
        Now = 19,
        AnyValue = 20,
        DefaultValue = 21,
        Arithmetic = 22,
        FillRule = 23,
        ResourcePackageItem = 24,
        ScopedEval = 25,
        WithRef = 26,
        Percentile = 27,
        SelectRef = 28,
        TransformTableRef = 29,
        TransformOutputRoleRef = 30,
    }
    interface SQExprMetadata {
        kind: FieldKind;
        type: ValueType;
        format?: string;
        idOnEntityKey?: boolean;
        aggregate?: QueryAggregateFunction;
        defaultAggregate?: ConceptualDefaultAggregate;
    }
    const enum FieldKind {
        /** Indicates the field references a column, which evaluates to a distinct set of values (e.g., Year, Name, SalesQuantity, etc.). */
        Column = 0,
        /** Indicates the field references a measure, which evaluates to a single value (e.g., SalesYTD, Sum(Sales), etc.). */
        Measure = 1,
    }
    /** Note: Exported for testability */
    function defaultAggregateForDataType(type: ValueType): QueryAggregateFunction;
    /** Note: Exported for testability */
    function defaultAggregateToQueryAggregateFunction(aggregate: ConceptualDefaultAggregate): QueryAggregateFunction;
    class SQEntityExpr extends SQExpr {
        schema: string;
        entity: string;
        variable: string;
        constructor(schema: string, entity: string, variable?: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQArithmeticExpr extends SQExpr {
        left: SQExpr;
        right: SQExpr;
        operator: ArithmeticOperatorKind;
        constructor(left: SQExpr, right: SQExpr, operator: ArithmeticOperatorKind);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQScopedEvalExpr extends SQExpr {
        expression: SQExpr;
        scope: SQExpr[];
        constructor(expression: SQExpr, scope: SQExpr[]);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
        getMetadata(federatedSchema: FederatedConceptualSchema): SQExprMetadata;
    }
    class SQWithRefExpr extends SQExpr {
        expressionName: string;
        constructor(expressionName: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    abstract class SQPropRefExpr extends SQExpr {
        ref: string;
        source: SQExpr;
        constructor(kind: SQExprKind, source: SQExpr, ref: string);
    }
    class SQColumnRefExpr extends SQPropRefExpr {
        constructor(source: SQExpr, ref: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQMeasureRefExpr extends SQPropRefExpr {
        constructor(source: SQExpr, ref: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQAggregationExpr extends SQExpr {
        arg: SQExpr;
        func: QueryAggregateFunction;
        constructor(arg: SQExpr, func: QueryAggregateFunction);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQPercentileExpr extends SQExpr {
        arg: SQExpr;
        k: number;
        exclusive: boolean;
        constructor(arg: SQExpr, k: number, exclusive: boolean);
        getMetadata(federatedSchema: FederatedConceptualSchema): SQExprMetadata;
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQPropertyVariationSourceExpr extends SQExpr {
        arg: SQExpr;
        name: string;
        property: string;
        constructor(arg: SQExpr, name: string, property: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQHierarchyExpr extends SQExpr {
        arg: SQExpr;
        hierarchy: string;
        constructor(arg: SQExpr, hierarchy: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQHierarchyLevelExpr extends SQExpr {
        arg: SQExpr;
        level: string;
        constructor(arg: SQExpr, level: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQSelectRefExpr extends SQExpr {
        expressionName: string;
        constructor(expressionName: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQAndExpr extends SQExpr {
        left: SQExpr;
        right: SQExpr;
        constructor(left: SQExpr, right: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQBetweenExpr extends SQExpr {
        arg: SQExpr;
        lower: SQExpr;
        upper: SQExpr;
        constructor(arg: SQExpr, lower: SQExpr, upper: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQInExpr extends SQExpr {
        args: SQExpr[];
        values: SQExpr[][];
        constructor(args: SQExpr[], values: SQExpr[][]);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQOrExpr extends SQExpr {
        left: SQExpr;
        right: SQExpr;
        constructor(left: SQExpr, right: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQCompareExpr extends SQExpr {
        comparison: QueryComparisonKind;
        left: SQExpr;
        right: SQExpr;
        constructor(comparison: QueryComparisonKind, left: SQExpr, right: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQContainsExpr extends SQExpr {
        left: SQExpr;
        right: SQExpr;
        constructor(left: SQExpr, right: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQStartsWithExpr extends SQExpr {
        left: SQExpr;
        right: SQExpr;
        constructor(left: SQExpr, right: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQExistsExpr extends SQExpr {
        arg: SQExpr;
        constructor(arg: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQNotExpr extends SQExpr {
        arg: SQExpr;
        constructor(arg: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQConstantExpr extends SQExpr implements ISQConstantExpr {
        type: ValueType;
        /** The native JavaScript representation of the value. */
        value: any;
        /** The string encoded, lossless representation of the value. */
        valueEncoded: string;
        constructor(type: ValueType, value: any, valueEncoded: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
        getMetadata(federatedSchema: FederatedConceptualSchema): SQExprMetadata;
    }
    class SQDateSpanExpr extends SQExpr {
        unit: TimeUnit;
        arg: SQExpr;
        constructor(unit: TimeUnit, arg: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQDateAddExpr extends SQExpr {
        unit: TimeUnit;
        amount: number;
        arg: SQExpr;
        constructor(unit: TimeUnit, amount: number, arg: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQNowExpr extends SQExpr {
        constructor();
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQDefaultValueExpr extends SQExpr {
        constructor();
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQAnyValueExpr extends SQExpr {
        constructor();
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQFillRuleExpr extends SQExpr {
        input: SQExpr;
        rule: FillRuleDefinition;
        constructor(input: SQExpr, fillRule: FillRuleDefinition);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQResourcePackageItemExpr extends SQExpr {
        packageName: string;
        packageType: number;
        itemName: string;
        constructor(packageName: string, packageType: number, itemName: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQTransformTableRefExpr extends SQExpr {
        source: string;
        constructor(source: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQTransformOutputRoleRefExpr extends SQExpr {
        role: string;
        transform: string;
        constructor(role: string, transform?: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    /** Provides utilities for creating & manipulating expressions. */
    module SQExprBuilder {
        function entity(schema: string, entity: string, variable?: string): SQEntityExpr;
        function columnRef(source: SQExpr, prop: string): SQColumnRefExpr;
        function measureRef(source: SQExpr, prop: string): SQMeasureRefExpr;
        function aggregate(source: SQExpr, aggregate: QueryAggregateFunction): SQAggregationExpr;
        function selectRef(expressionName: string): SQSelectRefExpr;
        function percentile(source: SQExpr, k: number, exclusive: boolean): SQPercentileExpr;
        function arithmetic(left: SQExpr, right: SQExpr, operator: ArithmeticOperatorKind): SQArithmeticExpr;
        function scopedEval(expression: SQExpr, scope: SQExpr[]): SQScopedEvalExpr;
        function withRef(expressionName: string): SQWithRefExpr;
        function hierarchy(source: SQExpr, hierarchy: string): SQHierarchyExpr;
        function propertyVariationSource(source: SQExpr, name: string, property: string): SQPropertyVariationSourceExpr;
        function hierarchyLevel(source: SQExpr, level: string): SQHierarchyLevelExpr;
        function transformTableRef(source: string): SQTransformTableRefExpr;
        function transformOutputRoleRef(role: string, transform?: string): SQTransformOutputRoleRefExpr;
        function and(left: SQExpr, right: SQExpr): SQExpr;
        function between(arg: SQExpr, lower: SQExpr, upper: SQExpr): SQBetweenExpr;
        function inExpr(args: SQExpr[], values: SQExpr[][]): SQInExpr;
        function or(left: SQExpr, right: SQExpr): SQExpr;
        function compare(kind: QueryComparisonKind, left: SQExpr, right: SQExpr): SQCompareExpr;
        function contains(left: SQExpr, right: SQExpr): SQContainsExpr;
        function exists(arg: SQExpr): SQExistsExpr;
        function equal(left: SQExpr, right: SQExpr): SQCompareExpr;
        function not(arg: SQExpr): SQNotExpr;
        function startsWith(left: SQExpr, right: SQExpr): SQStartsWithExpr;
        function nullConstant(): SQConstantExpr;
        function now(): SQNowExpr;
        function defaultValue(): SQDefaultValueExpr;
        function anyValue(): SQAnyValueExpr;
        function boolean(value: boolean): SQConstantExpr;
        function dateAdd(unit: TimeUnit, amount: number, arg: SQExpr): SQDateAddExpr;
        function dateTime(value: Date, valueEncoded?: string): SQConstantExpr;
        function dateSpan(unit: TimeUnit, arg: SQExpr): SQDateSpanExpr;
        function decimal(value: number, valueEncoded?: string): SQConstantExpr;
        function double(value: number, valueEncoded?: string): SQConstantExpr;
        function integer(value: number, valueEncoded?: string): SQConstantExpr;
        function text(value: string, valueEncoded?: string): SQConstantExpr;
        /** Returns an SQExpr that evaluates to the constant value. */
        function typedConstant(value: PrimitiveValue, type: ValueTypeDescriptor): SQConstantExpr;
        function setAggregate(expr: SQExpr, aggregate: QueryAggregateFunction): SQExpr;
        function removeAggregate(expr: SQExpr): SQExpr;
        function setPercentOfGrandTotal(expr: SQExpr): SQExpr;
        function removePercentOfGrandTotal(expr: SQExpr): SQExpr;
        function removeEntityVariables(expr: SQExpr): SQExpr;
        function fillRule(expr: SQExpr, rule: FillRuleDefinition): SQFillRuleExpr;
        function resourcePackageItem(packageName: string, packageType: number, itemName: string): SQResourcePackageItemExpr;
    }
    /** Provides utilities for obtaining information about expressions. */
    module SQExprInfo {
        function getAggregate(expr: SQExpr): QueryAggregateFunction;
    }
    const enum SQExprValidationError {
        invalidAggregateFunction = 0,
        invalidSchemaReference = 1,
        invalidEntityReference = 2,
        invalidColumnReference = 3,
        invalidMeasureReference = 4,
        invalidHierarchyReference = 5,
        invalidHierarchyLevelReference = 6,
        invalidLeftOperandType = 7,
        invalidRightOperandType = 8,
        invalidValueType = 9,
        invalidPercentileArgument = 10,
        invalidScopeArgument = 11,
    }
    class SQExprValidationVisitor extends SQExprRewriter {
        errors: SQExprValidationError[];
        private schema;
        private aggrUtils;
        constructor(schema: FederatedConceptualSchema, aggrUtils: ISQAggregationOperations, errors?: SQExprValidationError[]);
        visitIn(expr: SQInExpr): SQExpr;
        visitCompare(expr: SQCompareExpr): SQExpr;
        visitColumnRef(expr: SQColumnRefExpr): SQExpr;
        visitMeasureRef(expr: SQMeasureRefExpr): SQExpr;
        visitAggr(expr: SQAggregationExpr): SQExpr;
        visitHierarchy(expr: SQHierarchyExpr): SQExpr;
        visitHierarchyLevel(expr: SQHierarchyLevelExpr): SQExpr;
        visitPercentile(expr: SQPercentileExpr): SQExpr;
        visitEntity(expr: SQEntityExpr): SQExpr;
        visitContains(expr: SQContainsExpr): SQExpr;
        visitStartsWith(expr: SQContainsExpr): SQExpr;
        visitArithmetic(expr: SQArithmeticExpr): SQExpr;
        visitScopedEval(expr: SQScopedEvalExpr): SQExpr;
        visitWithRef(expr: SQWithRefExpr): SQExpr;
        visitTransformTableRef(expr: SQTransformTableRefExpr): SQExpr;
        visitTransformOutputRoleRef(expr: SQTransformOutputRoleRefExpr): SQExpr;
        private validateOperandsAndTypeForStartOrContains(left, right);
        private validateArithmeticTypes(left, right);
        private validateCompatibleType(left, right);
        private validateEntity(schemaName, entityName);
        private validateHierarchy(schemaName, entityName, hierarchyName);
        private validateHierarchyLevel(schemaName, entityName, hierarchyName, levelName);
        private register(error);
        private isQueryable(fieldExpr);
    }
}

declare module powerbi.data {
    /** Utility for creating a DataView from columns of data. */
    interface IDataViewBuilderCategorical {
        withCategory(options: DataViewBuilderCategoryColumnOptions): IDataViewBuilderCategorical;
        withCategories(categories: DataViewCategoryColumn[]): IDataViewBuilderCategorical;
        withValues(options: DataViewBuilderValuesOptions): IDataViewBuilderCategorical;
        withGroupedValues(options: DataViewBuilderGroupedValuesOptions): IDataViewBuilderCategorical;
        build(): DataView;
    }
    interface DataViewBuilderColumnOptions {
        source: DataViewMetadataColumn;
    }
    interface DataViewBuilderCategoryColumnOptions extends DataViewBuilderColumnOptions {
        values: PrimitiveValue[];
        identityFrom: DataViewBuilderColumnIdentitySource;
    }
    interface DataViewBuilderValuesOptions {
        columns: DataViewBuilderValuesColumnOptions[];
    }
    interface DataViewBuilderGroupedValuesOptions {
        groupColumn: DataViewBuilderCategoryColumnOptions;
        valueColumns: DataViewBuilderColumnOptions[];
        data: DataViewBuilderSeriesData[][];
    }
    /** Indicates the source set of identities. */
    interface DataViewBuilderColumnIdentitySource {
        fields: SQExpr[];
        identities?: DataViewScopeIdentity[];
    }
    interface DataViewBuilderValuesColumnOptions extends DataViewBuilderColumnOptions, DataViewBuilderSeriesData {
    }
    interface DataViewBuilderSeriesData {
        values: PrimitiveValue[];
        highlights?: PrimitiveValue[];
        /** Client-computed maximum value for a column. */
        maxLocal?: any;
        /** Client-computed maximum value for a column. */
        minLocal?: any;
    }
    function createCategoricalDataViewBuilder(): IDataViewBuilderCategorical;
}

declare module powerbi.data {
    /** Serializes SQExpr in a form optimized in-memory comparison, but not intended for storage on disk. */
    module SQExprShortSerializer {
        function serialize(expr: SQExpr): string;
        function serializeArray(exprs: SQExpr[]): string;
    }
}





























































































































































































declare module powerbi.visuals {
    class Point implements IPoint {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
    }
}

declare module powerbi.visuals {
    class Rect implements IRect {
        left: number;
        top: number;
        width: number;
        height: number;
        constructor(left?: number, top?: number, width?: number, height?: number);
    }
}

declare module powerbi.visuals {
    module Font {
        class FamilyInfo {
            families: string[];
            constructor(families: string[]);
            /**
             * Gets the first font "wf_" font family since it will always be loaded.
             */
            family: string;
            /**
            * Gets the first font family that matches regex (if provided).
            * Default regex looks for "wf_" fonts which are always loaded.
            */
            getFamily(regex?: RegExp): string;
            /**
             * Gets the CSS string for the "font-family" CSS attribute.
             */
            css: string;
            /**
             * Gets the CSS string for the "font-family" CSS attribute.
             */
            getCSS(): string;
        }
        var Family: {
            light: FamilyInfo;
            semilight: FamilyInfo;
            regular: FamilyInfo;
            semibold: FamilyInfo;
            bold: FamilyInfo;
            lightSecondary: FamilyInfo;
            regularSecondary: FamilyInfo;
            boldSecondary: FamilyInfo;
        };
    }
}

declare module powerbi.visuals {
    enum LegendIcon {
        Box = 0,
        Circle = 1,
        Line = 2,
    }
    enum LegendPosition {
        Top = 0,
        Bottom = 1,
        Right = 2,
        Left = 3,
        None = 4,
        TopCenter = 5,
        BottomCenter = 6,
        RightCenter = 7,
        LeftCenter = 8,
    }
    interface LegendPosition2D {
        textPosition?: Point;
        glyphPosition?: Point;
    }
    interface LegendDataPoint extends SelectableDataPoint, LegendPosition2D {
        label: string;
        color: string;
        icon: LegendIcon;
        category?: string;
        measure?: any;
        iconOnlyOnLabel?: boolean;
        tooltip?: string;
        layerNumber?: number;
    }
    interface LegendData {
        title?: string;
        dataPoints: LegendDataPoint[];
        grouped?: boolean;
        labelColor?: string;
        fontSize?: number;
    }
    const legendProps: {
        show: string;
        position: string;
        titleText: string;
        showTitle: string;
        labelColor: string;
        fontSize: string;
    };
    function createLegend(legendParentElement: JQuery, interactive: boolean, interactivityService: IInteractivityService, isScrollable?: boolean, legendPosition?: LegendPosition): ILegend;
    interface ILegend {
        getMargins(): IViewport;
        isVisible(): boolean;
        changeOrientation(orientation: LegendPosition): void;
        getOrientation(): LegendPosition;
        drawLegend(data: LegendData, viewport: IViewport): any;
        /**
         * Reset the legend by clearing it
         */
        reset(): void;
    }
    module Legend {
        function isLeft(orientation: LegendPosition): boolean;
        function isTop(orientation: LegendPosition): boolean;
        function positionChartArea(chartArea: D3.Selection, legend: ILegend): void;
    }
    class SVGLegend implements ILegend {
        private orientation;
        private viewport;
        private parentViewport;
        private svg;
        private group;
        private clearCatcher;
        private element;
        private interactivityService;
        private legendDataStartIndex;
        private arrowPosWindow;
        private data;
        private isScrollable;
        private lastCalculatedWidth;
        private visibleLegendWidth;
        private visibleLegendHeight;
        private legendFontSizeMarginDifference;
        private legendFontSizeMarginValue;
        static DefaultFontSizeInPt: number;
        private static LegendIconRadius;
        private static LegendIconRadiusFactor;
        private static MaxTextLength;
        private static MaxTitleLength;
        private static TextAndIconPadding;
        private static TitlePadding;
        private static LegendEdgeMariginWidth;
        private static LegendMaxWidthFactor;
        private static TopLegendHeight;
        private static DefaultTextMargin;
        private static DefaultMaxLegendFactor;
        private static LegendIconYRatio;
        private static LegendArrowOffset;
        private static LegendArrowHeight;
        private static LegendArrowWidth;
        private static DefaultFontFamily;
        private static DefaultTitleFontFamily;
        private static LegendItem;
        private static LegendText;
        private static LegendIcon;
        private static LegendTitle;
        private static NavigationArrow;
        constructor(element: JQuery, legendPosition: LegendPosition, interactivityService: IInteractivityService, isScrollable: boolean);
        private updateLayout();
        private calculateViewport();
        getMargins(): IViewport;
        isVisible(): boolean;
        changeOrientation(orientation: LegendPosition): void;
        getOrientation(): LegendPosition;
        drawLegend(data: LegendData, viewport: IViewport): void;
        drawLegendInternal(data: LegendData, viewport: IViewport, autoWidth: boolean): void;
        private normalizePosition(points);
        private calculateTitleLayout(title);
        /** Performs layout offline for optimal perfomance */
        private calculateLayout(data, autoWidth);
        private updateNavigationArrowLayout(navigationArrows, remainingDataLength, visibleDataLength);
        private calculateHorizontalNavigationArrowsLayout(title);
        private calculateVerticalNavigationArrowsLayout(title);
        /**
         * Calculates the widths for each horizontal legend item.
         */
        private static calculateHorizontalLegendItemsWidths(dataPoints, availableWidth, iconPadding, fontSize);
        private calculateHorizontalLayout(dataPoints, title, navigationArrows);
        private calculateVerticalLayout(dataPoints, title, navigationArrows, autoWidth);
        private drawNavigationArrows(layout);
        private isTopOrBottom(orientation);
        private isCentered(orientation);
        reset(): void;
        private static getTextProperties(isTitle, text?, fontSize?);
        private setTooltipToLegendItems(data);
    }
    module LegendData {
        var DefaultLegendLabelFillColor: string;
        function update(legendData: LegendData, legendObject: DataViewObject): void;
    }
}

declare module powerbi.visuals {
    module axisScale {
        const linear: string;
        const log: string;
        const type: IEnumType;
    }
}

declare module powerbi.visuals {
    module axisStyle {
        const showBoth: string;
        const showTitleOnly: string;
        const showUnitOnly: string;
        const type: IEnumType;
    }
}

declare module powerbi.visuals {
    module axisType {
        const scalar: string;
        const categorical: string;
        const both: string;
        const type: IEnumType;
    }
}

declare module powerbi.visuals {
    module basicShapeType {
        const rectangle: string;
        const oval: string;
        const line: string;
        const arrow: string;
        const triangle: string;
        const type: IEnumType;
    }
}

declare module powerbi.visuals {
    module confidenceBandStyle {
        const fill: string;
        const line: string;
        const none: string;
        const type: IEnumType;
    }
}

declare module powerbi.visuals {
    module imageScalingType {
        const normal: string;
        const fit: string;
        const fill: string;
        const type: IEnumType;
    }
}

declare module powerbi.visuals {
    module labelPosition {
        const insideEnd: string;
        const insideCenter: string;
        const outsideEnd: string;
        const insideBase: string;
        const type: IEnumType;
    }
}

declare module powerbi.visuals {
    module labelStyle {
        const category: string;
        const data: string;
        const both: string;
        const type: IEnumType;
    }
}

declare module powerbi.visuals {
    module legendPosition {
        const top: string;
        const bottom: string;
        const left: string;
        const right: string;
        const topCenter: string;
        const bottomCenter: string;
        const leftCenter: string;
        const rightCenter: string;
        const type: IEnumType;
    }
}

declare module powerbi.visuals {
    module kpiDirection {
        const positive: string;
        const negative: string;
        const type: IEnumType;
    }
}

declare module powerbi.visuals {
    module lineStyle {
        const dashed: string;
        const solid: string;
        const dotted: string;
        const type: IEnumType;
    }
}

declare module powerbi.visuals {
    module outline {
        const none: string;
        const bottomOnly: string;
        const topOnly: string;
        const leftOnly: string;
        const rightOnly: string;
        const topBottom: string;
        const leftRight: string;
        const frame: string;
        function showTop(outline: string): boolean;
        function showRight(outline: string): boolean;
        function showBottom(outline: string): boolean;
        function showLeft(outline: string): boolean;
        const type: IEnumType;
    }
}

declare module powerbi.visuals {
    module referenceLinePosition {
        const back: string;
        const front: string;
        const type: IEnumType;
    }
    module referenceLineDataLabelHorizontalPosition {
        const left: string;
        const right: string;
        const type: IEnumType;
    }
    module referenceLineDataLabelVerticalPosition {
        const above: string;
        const under: string;
        const type: IEnumType;
    }
}

declare module powerbi.visuals {
    module slicerOrientation {
        const enum Orientation {
            Vertical = 0,
            Horizontal = 1,
        }
        const type: IEnumType;
    }
}

declare module powerbi.visuals {
    module yAxisPosition {
        const left: string;
        const right: string;
        const type: IEnumType;
    }
}

declare module powerbi.visuals {
    module sliderMode {
        const before: string;
        const after: string;
        const between: string;
        const type: IEnumType;
    }
}

declare module powerbi.visuals {
    module AnimatorCommon {
        const MinervaAnimationDuration: number;
        const MaxDataPointsToAnimate: number;
        function GetAnimationDuration(animator: IGenericAnimator, suppressAnimations: boolean): number;
    }
    interface IAnimatorOptions {
        duration?: number;
    }
    interface IAnimationOptions {
        interactivityService: IInteractivityService;
    }
    interface IAnimationResult {
        failed: boolean;
    }
    interface IAnimator<T extends IAnimatorOptions, U extends IAnimationOptions, V extends IAnimationResult> {
        getDuration(): number;
        getEasing(): string;
        animate(options: U): V;
    }
    type IGenericAnimator = IAnimator<IAnimatorOptions, IAnimationOptions, IAnimationResult>;
    /**
     * We just need to have a non-null animator to allow axis animations in cartesianChart.
     * Note: Use this temporarily for Line/Scatter until we add more animations (MinervaPlugins only).
     */
    class BaseAnimator<T extends IAnimatorOptions, U extends IAnimationOptions, V extends IAnimationResult> implements IAnimator<T, U, V> {
        protected animationDuration: number;
        constructor(options?: T);
        getDuration(): number;
        animate(options: U): V;
        getEasing(): string;
    }
}

declare module powerbi.visuals {
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    interface ColumnChartAnimationOptions extends IAnimationOptions {
        viewModel: ColumnChartData;
        series: D3.UpdateSelection;
        layout: IColumnLayout;
        itemCS: ClassAndSelector;
        mainGraphicsContext: D3.Selection;
        viewPort: IViewport;
    }
    interface ColumnChartAnimationResult extends IAnimationResult {
        shapes: D3.UpdateSelection;
    }
    type IColumnChartAnimator = IAnimator<IAnimatorOptions, ColumnChartAnimationOptions, ColumnChartAnimationResult>;
    class WebColumnChartAnimator extends BaseAnimator<IAnimatorOptions, ColumnChartAnimationOptions, ColumnChartAnimationResult> implements IColumnChartAnimator {
        private previousViewModel;
        constructor(options?: IAnimatorOptions);
        animate(options: ColumnChartAnimationOptions): ColumnChartAnimationResult;
        private animateNormalToHighlighted(options);
        private animateHighlightedToHighlighted(options);
        private animateHighlightedToNormal(options);
        private animateDefaultShapes(data, series, layout, itemCS);
    }
}

declare module powerbi.visuals {
    interface DonutChartAnimationOptions extends IAnimationOptions {
        viewModel: DonutData;
        graphicsContext: D3.Selection;
        labelGraphicsContext: D3.Selection;
        colors: IDataColorPalette;
        layout: DonutLayout;
        sliceWidthRatio: number;
        radius: number;
        viewport: IViewport;
        innerArcRadiusRatio: number;
        labels: Label[];
    }
    interface DonutChartAnimationResult extends IAnimationResult {
        shapes: D3.UpdateSelection;
        highlightShapes: D3.UpdateSelection;
    }
    type IDonutChartAnimator = IAnimator<IAnimatorOptions, DonutChartAnimationOptions, DonutChartAnimationResult>;
    class WebDonutChartAnimator extends BaseAnimator<IAnimatorOptions, DonutChartAnimationOptions, DonutChartAnimationResult> implements IDonutChartAnimator {
        private previousViewModel;
        constructor(options?: IAnimatorOptions);
        animate(options: DonutChartAnimationOptions): DonutChartAnimationResult;
        private animateNormalToHighlighted(options);
        private animateHighlightedToHighlighted(options);
        private animateHighlightedToNormal(options);
        private animateDefaultShapes(options);
        private animateDefaultHighlightShapes(options);
    }
}

declare module powerbi.visuals {
    interface FunnelAnimationOptions extends IAnimationOptions {
        viewModel: FunnelData;
        layout: IFunnelLayout;
        axisGraphicsContext: D3.Selection;
        shapeGraphicsContext: D3.Selection;
        percentGraphicsContext: D3.Selection;
        labelGraphicsContext: D3.Selection;
        axisOptions: FunnelAxisOptions;
        dataPointsWithoutHighlights: FunnelDataPoint[];
        labelLayout: Label[];
        isHidingPercentBars: boolean;
        visualInitOptions: VisualInitOptions;
    }
    interface FunnelAnimationResult extends IAnimationResult {
        shapes: D3.UpdateSelection;
        dataLabels: D3.UpdateSelection;
    }
    type IFunnelAnimator = IAnimator<IAnimatorOptions, FunnelAnimationOptions, FunnelAnimationResult>;
    class WebFunnelAnimator extends BaseAnimator<IAnimatorOptions, FunnelAnimationOptions, FunnelAnimationResult> implements IFunnelAnimator {
        private previousViewModel;
        constructor(options?: IAnimatorOptions);
        animate(options: FunnelAnimationOptions): FunnelAnimationResult;
        private animateNormalToHighlighted(options);
        private animateHighlightedToHighlighted(options);
        private animateHighlightedToNormal(options);
        private animateDefaultAxis(graphicsContext, axisOptions, isHidingPercentBars);
        private animateDefaultShapes(data, dataPoints, graphicsContext, layout);
        private animatePercentBars(options);
        private animateToFunnelPercent(context, targetData, layout);
        private animatePercentBarComponents(data, options);
    }
}

declare module powerbi.visuals {
    interface TreemapAnimationOptions extends IAnimationOptions {
        viewModel: TreemapData;
        nodes: D3.Layout.GraphNode[];
        highlightNodes: D3.Layout.GraphNode[];
        majorLabeledNodes: D3.Layout.GraphNode[];
        minorLabeledNodes: D3.Layout.GraphNode[];
        shapeGraphicsContext: D3.Selection;
        labelGraphicsContext: D3.Selection;
        layout: ITreemapLayout;
        labelSettings: VisualDataLabelsSettings;
    }
    interface TreemapAnimationResult extends IAnimationResult {
        shapes: D3.UpdateSelection;
        highlightShapes: D3.UpdateSelection;
        majorLabels: D3.UpdateSelection;
        minorLabels: D3.UpdateSelection;
    }
    type ITreemapAnimator = IAnimator<IAnimatorOptions, TreemapAnimationOptions, TreemapAnimationResult>;
    class WebTreemapAnimator extends BaseAnimator<IAnimatorOptions, TreemapAnimationOptions, TreemapAnimationResult> implements ITreemapAnimator {
        previousViewModel: TreemapData;
        constructor(options?: IAnimatorOptions);
        animate(options: TreemapAnimationOptions): TreemapAnimationResult;
        private animateNormalToHighlighted(options);
        private animateHighlightedToHighlighted(options);
        private animateHighlightedToNormal(options);
        private animateDefaultShapes(context, nodes, hasSelection, hasHighlights, layout);
        private animateDefaultHighlightShapes(context, nodes, hasSelection, hasHighlights, layout);
        private animateDefaultMajorLabels(context, nodes, labelSettings, layout);
        private animateDefaultMinorLabels(context, nodes, labelSettings, layout);
    }
}

declare module powerbi.visuals {
    /**
     * This is the baseline for some most common used object properties across visuals.
     * When adding new properties, please try to reuse the existing ones.
     */
    const StandardObjectProperties: {
        axisEnd: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            placeHolderText: (IStringResourceProvider: any) => string;
            type: {
                numeric: boolean;
            };
            suppressFormatPainterCopy: boolean;
        };
        axisScale: {
            displayName: (IStringResourceProvider: any) => string;
            type: {
                enumeration: IEnumType;
            };
        };
        axisStart: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            placeHolderText: (IStringResourceProvider: any) => string;
            type: {
                numeric: boolean;
            };
            suppressFormatPainterCopy: boolean;
        };
        axisStyle: {
            displayName: (IStringResourceProvider: any) => string;
            type: {
                enumeration: IEnumType;
            };
        };
        axisType: {
            displayName: (IStringResourceProvider: any) => string;
            type: {
                enumeration: IEnumType;
            };
        };
        backColor: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                fill: {
                    solid: {
                        color: boolean;
                    };
                };
            };
        };
        dataColor: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                fill: {
                    solid: {
                        color: boolean;
                    };
                };
            };
        };
        dataLabelColor: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                fill: {
                    solid: {
                        color: boolean;
                    };
                };
            };
        };
        dataLabelDecimalPoints: {
            displayName: (IStringResourceProvider: any) => string;
            placeHolderText: (IStringResourceProvider: any) => string;
            type: {
                numeric: boolean;
            };
        };
        dataLabelDisplayUnits: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                formatting: {
                    labelDisplayUnits: boolean;
                };
            };
            suppressFormatPainterCopy: boolean;
        };
        dataLabelHorizontalPosition: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                enumeration: IEnumType;
            };
        };
        dataLabelShow: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                bool: boolean;
            };
        };
        dataLabelVerticalPosition: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                enumeration: IEnumType;
            };
        };
        defaultColor: {
            displayName: (IStringResourceProvider: any) => string;
            type: {
                fill: {
                    solid: {
                        color: boolean;
                    };
                };
            };
        };
        fill: {
            displayName: (IStringResourceProvider: any) => string;
            type: {
                fill: {
                    solid: {
                        color: boolean;
                    };
                };
            };
        };
        fontColor: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                fill: {
                    solid: {
                        color: boolean;
                    };
                };
            };
        };
        fontSize: {
            displayName: (IStringResourceProvider: any) => string;
            type: {
                formatting: {
                    fontSize: boolean;
                };
            };
        };
        formatString: {
            type: {
                formatting: {
                    formatString: boolean;
                };
            };
        };
        image: {
            type: {
                image: {};
            };
        };
        labelColor: {
            displayName: (IStringResourceProvider: any) => string;
            type: {
                fill: {
                    solid: {
                        color: boolean;
                    };
                };
            };
        };
        labelDisplayUnits: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                formatting: {
                    labelDisplayUnits: boolean;
                };
            };
        };
        labelPrecision: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            placeHolderText: (IStringResourceProvider: any) => string;
            type: {
                numeric: boolean;
            };
        };
        legendPosition: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                enumeration: IEnumType;
            };
        };
        legendTitle: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                text: boolean;
            };
        };
        lineColor: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                fill: {
                    solid: {
                        color: boolean;
                    };
                };
            };
        };
        outline: {
            displayName: (IStringResourceProvider: any) => string;
            type: {
                enumeration: IEnumType;
            };
        };
        outlineColor: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                fill: {
                    solid: {
                        color: boolean;
                    };
                };
            };
        };
        outlineWeight: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                numeric: boolean;
            };
        };
        show: {
            displayName: (IStringResourceProvider: any) => string;
            type: {
                bool: boolean;
            };
        };
        showAllDataPoints: {
            displayName: (IStringResourceProvider: any) => string;
            type: {
                bool: boolean;
            };
        };
        showLegendTitle: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                bool: boolean;
            };
        };
        referenceLinePosition: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                enumeration: IEnumType;
            };
        };
        referenceLineStyle: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                enumeration: IEnumType;
            };
        };
        transparency: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                numeric: boolean;
            };
        };
        yAxisPosition: {
            displayName: (IStringResourceProvider: any) => string;
            description: (IStringResourceProvider: any) => string;
            type: {
                enumeration: IEnumType;
            };
        };
    };
}

declare module powerbi.visuals {
    const animatedTextObjectDescs: data.DataViewObjectDescriptors;
    const animatedNumberCapabilities: VisualCapabilities;
}

declare module powerbi.visuals {
    const basicShapeCapabilities: VisualCapabilities;
    const basicShapeProps: {
        general: {
            shapeType: DataViewObjectPropertyIdentifier;
        };
        line: {
            transparency: DataViewObjectPropertyIdentifier;
            weight: DataViewObjectPropertyIdentifier;
            roundEdge: DataViewObjectPropertyIdentifier;
            lineColor: DataViewObjectPropertyIdentifier;
        };
        fill: {
            transparency: DataViewObjectPropertyIdentifier;
            fillColor: DataViewObjectPropertyIdentifier;
            show: DataViewObjectPropertyIdentifier;
        };
        rotation: {
            angle: DataViewObjectPropertyIdentifier;
        };
    };
}

declare module powerbi.visuals {
    function getColumnChartCapabilities(transposeAxes?: boolean): VisualCapabilities;
    const columnChartProps: {
        dataPoint: {
            defaultColor: DataViewObjectPropertyIdentifier;
            fill: DataViewObjectPropertyIdentifier;
            showAllDataPoints: DataViewObjectPropertyIdentifier;
        };
        general: {
            formatString: DataViewObjectPropertyIdentifier;
        };
        categoryAxis: {
            axisType: DataViewObjectPropertyIdentifier;
        };
        legend: {
            labelColor: DataViewObjectPropertyIdentifier;
        };
        plotArea: {
            image: DataViewObjectPropertyIdentifier;
            transparency: DataViewObjectPropertyIdentifier;
        };
    };
}

declare module powerbi.visuals {
    const comboChartCapabilities: VisualCapabilities;
    const comboChartProps: {
        general: {
            formatString: DataViewObjectPropertyIdentifier;
        };
        valueAxis: {
            secShow: DataViewObjectPropertyIdentifier;
        };
        legend: {
            labelColor: DataViewObjectPropertyIdentifier;
        };
        dataPoint: {
            showAllDataPoints: DataViewObjectPropertyIdentifier;
        };
    };
}

declare module powerbi.visuals {
    const donutChartCapabilities: VisualCapabilities;
    const donutChartProps: {
        general: {
            formatString: DataViewObjectPropertyIdentifier;
        };
        dataPoint: {
            defaultColor: DataViewObjectPropertyIdentifier;
            fill: DataViewObjectPropertyIdentifier;
        };
        legend: {
            show: DataViewObjectPropertyIdentifier;
            position: DataViewObjectPropertyIdentifier;
            showTitle: DataViewObjectPropertyIdentifier;
            titleText: DataViewObjectPropertyIdentifier;
            labelColor: DataViewObjectPropertyIdentifier;
        };
    };
}

declare module powerbi.visuals {
    const dataDotChartCapabilities: VisualCapabilities;
}

declare module powerbi.visuals {
    const filledMapCapabilities: VisualCapabilities;
    const filledMapProps: {
        general: {
            formatString: DataViewObjectPropertyIdentifier;
        };
        dataPoint: {
            defaultColor: DataViewObjectPropertyIdentifier;
            fill: DataViewObjectPropertyIdentifier;
            showAllDataPoints: DataViewObjectPropertyIdentifier;
        };
        legend: {
            show: DataViewObjectPropertyIdentifier;
            position: DataViewObjectPropertyIdentifier;
            showTitle: DataViewObjectPropertyIdentifier;
            titleText: DataViewObjectPropertyIdentifier;
        };
        labels: {
            show: DataViewObjectPropertyIdentifier;
            color: DataViewObjectPropertyIdentifier;
            labelDisplayUnits: DataViewObjectPropertyIdentifier;
            labelPrecision: DataViewObjectPropertyIdentifier;
        };
        categoryLabels: {
            show: DataViewObjectPropertyIdentifier;
        };
    };
}

declare module powerbi.visuals {
    const funnelChartCapabilities: VisualCapabilities;
    const funnelChartProps: {
        general: {
            formatString: DataViewObjectPropertyIdentifier;
        };
        dataPoint: {
            defaultColor: DataViewObjectPropertyIdentifier;
            fill: DataViewObjectPropertyIdentifier;
        };
    };
}

declare module powerbi.visuals {
    const gaugeRoleNames: {
        y: string;
        minValue: string;
        maxValue: string;
        targetValue: string;
    };
    const gaugeCapabilities: VisualCapabilities;
    const gaugeProps: {
        dataPoint: {
            fill: DataViewObjectPropertyIdentifier;
            target: DataViewObjectPropertyIdentifier;
        };
    };
}

declare module powerbi.visuals {
    const imageVisualCapabilities: VisualCapabilities;
}

declare module powerbi.visuals {
    var scriptVisualCapabilities: VisualCapabilities;
}

declare module powerbi.visuals.samples {
    var consoleWriterCapabilities: VisualCapabilities;
}

declare module powerbi.visuals.samples {
    class ConsoleWriter implements IVisual {
        static converter(dataView: DataView): any;
        init(options: VisualInitOptions): void;
        onResizing(viewport: IViewport): void;
        update(options: VisualUpdateOptions): void;
    }
}

declare module powerbi.visuals {
    const lineChartCapabilities: VisualCapabilities;
    const lineChartProps: {
        general: {
            formatString: DataViewObjectPropertyIdentifier;
        };
        dataPoint: {
            defaultColor: DataViewObjectPropertyIdentifier;
            fill: DataViewObjectPropertyIdentifier;
        };
        trend: {
            show: DataViewObjectPropertyIdentifier;
        };
        scalarKey: {
            scalarKeyMin: DataViewObjectPropertyIdentifier;
        };
        forecast: {
            show: DataViewObjectPropertyIdentifier;
        };
        categoryAxis: {
            axisType: DataViewObjectPropertyIdentifier;
        };
        legend: {
            labelColor: DataViewObjectPropertyIdentifier;
        };
        labels: {
            labelDensity: DataViewObjectPropertyIdentifier;
        };
        plotArea: {
            image: DataViewObjectPropertyIdentifier;
            transparency: DataViewObjectPropertyIdentifier;
        };
    };
}

declare module powerbi.visuals {
    const mapCapabilities: VisualCapabilities;
    const mapProps: {
        general: {
            formatString: DataViewObjectPropertyIdentifier;
        };
        dataPoint: {
            defaultColor: DataViewObjectPropertyIdentifier;
            fill: DataViewObjectPropertyIdentifier;
            showAllDataPoints: DataViewObjectPropertyIdentifier;
        };
        legend: {
            show: DataViewObjectPropertyIdentifier;
            position: DataViewObjectPropertyIdentifier;
            showTitle: DataViewObjectPropertyIdentifier;
            titleText: DataViewObjectPropertyIdentifier;
        };
    };
}

declare module powerbi.visuals {
    const multiRowCardCapabilities: VisualCapabilities;
    const multiRowCardProps: {
        card: {
            outline: DataViewObjectPropertyIdentifier;
            outlineColor: DataViewObjectPropertyIdentifier;
            outlineWeight: DataViewObjectPropertyIdentifier;
            barShow: DataViewObjectPropertyIdentifier;
            barColor: DataViewObjectPropertyIdentifier;
            barWeight: DataViewObjectPropertyIdentifier;
            cardPadding: DataViewObjectPropertyIdentifier;
            cardBackground: DataViewObjectPropertyIdentifier;
        };
    };
}

declare module powerbi.visuals {
    const textboxCapabilities: VisualCapabilities;
}

declare module powerbi.visuals {
    const cheerMeterCapabilities: VisualCapabilities;
}

declare module powerbi.visuals {
    const scatterChartCapabilities: VisualCapabilities;
    const scatterChartProps: {
        general: {
            formatString: DataViewObjectPropertyIdentifier;
        };
        dataPoint: {
            defaultColor: DataViewObjectPropertyIdentifier;
            fill: DataViewObjectPropertyIdentifier;
        };
        trend: {
            show: DataViewObjectPropertyIdentifier;
        };
        colorBorder: {
            show: DataViewObjectPropertyIdentifier;
        };
        fillPoint: {
            show: DataViewObjectPropertyIdentifier;
        };
        colorByCategory: {
            show: DataViewObjectPropertyIdentifier;
        };
        currentFrameIndex: {
            index: DataViewObjectPropertyIdentifier;
        };
        legend: {
            labelColor: DataViewObjectPropertyIdentifier;
        };
        plotArea: {
            image: DataViewObjectPropertyIdentifier;
            transparency: DataViewObjectPropertyIdentifier;
        };
    };
}

declare module powerbi.visuals {
    const slicerCapabilities: VisualCapabilities;
    const slicerProps: {
        general: {
            outlineColor: DataViewObjectPropertyIdentifier;
            outlineWeight: DataViewObjectPropertyIdentifier;
            orientation: DataViewObjectPropertyIdentifier;
            count: DataViewObjectPropertyIdentifier;
            selfFilterEnabled: DataViewObjectPropertyIdentifier;
        };
        selection: {
            selectAllCheckboxEnabled: DataViewObjectPropertyIdentifier;
            singleSelect: DataViewObjectPropertyIdentifier;
        };
        header: {
            show: DataViewObjectPropertyIdentifier;
            fontColor: DataViewObjectPropertyIdentifier;
            background: DataViewObjectPropertyIdentifier;
            outline: DataViewObjectPropertyIdentifier;
            textSize: DataViewObjectPropertyIdentifier;
        };
        items: {
            fontColor: DataViewObjectPropertyIdentifier;
            background: DataViewObjectPropertyIdentifier;
            outline: DataViewObjectPropertyIdentifier;
            textSize: DataViewObjectPropertyIdentifier;
        };
        filterPropertyIdentifier: DataViewObjectPropertyIdentifier;
        selfFilterPropertyIdentifier: DataViewObjectPropertyIdentifier;
        formatString: DataViewObjectPropertyIdentifier;
        defaultValue: DataViewObjectPropertyIdentifier;
    };
}

declare module powerbi.visuals {
    const tableCapabilities: VisualCapabilities;
}

declare module powerbi.visuals {
    const matrixRoleNames: {
        rows: string;
        columns: string;
        values: string;
    };
    const matrixCapabilities: VisualCapabilities;
}

declare module powerbi.visuals {
    const treemapRoles: {
        group: string;
        details: string;
        values: string;
        gradient: string;
    };
    const treemapCapabilities: VisualCapabilities;
    const treemapProps: {
        general: {
            formatString: DataViewObjectPropertyIdentifier;
        };
        dataPoint: {
            fill: DataViewObjectPropertyIdentifier;
        };
        legend: {
            show: DataViewObjectPropertyIdentifier;
            position: DataViewObjectPropertyIdentifier;
            showTitle: DataViewObjectPropertyIdentifier;
            titleText: DataViewObjectPropertyIdentifier;
            labelColor: DataViewObjectPropertyIdentifier;
        };
        labels: {
            show: DataViewObjectPropertyIdentifier;
            color: DataViewObjectPropertyIdentifier;
            labelDisplayUnits: DataViewObjectPropertyIdentifier;
            labelPrecision: DataViewObjectPropertyIdentifier;
        };
        categoryLabels: {
            show: DataViewObjectPropertyIdentifier;
        };
    };
}

declare module powerbi.visuals {
    const cardCapabilities: VisualCapabilities;
    var cardProps: {
        categoryLabels: {
            show: DataViewObjectPropertyIdentifier;
            color: DataViewObjectPropertyIdentifier;
            fontSize: DataViewObjectPropertyIdentifier;
        };
        labels: {
            color: DataViewObjectPropertyIdentifier;
            labelPrecision: DataViewObjectPropertyIdentifier;
            labelDisplayUnits: DataViewObjectPropertyIdentifier;
            fontSize: DataViewObjectPropertyIdentifier;
        };
        wordWrap: {
            show: DataViewObjectPropertyIdentifier;
        };
    };
}

declare module powerbi.visuals {
    const waterfallChartCapabilities: VisualCapabilities;
    const waterfallChartProps: {
        general: {
            formatString: DataViewObjectPropertyIdentifier;
        };
        sentimentColors: {
            increaseFill: DataViewObjectPropertyIdentifier;
            decreaseFill: DataViewObjectPropertyIdentifier;
            totalFill: DataViewObjectPropertyIdentifier;
        };
        legend: {
            labelColor: DataViewObjectPropertyIdentifier;
        };
    };
}

declare module powerbi.visuals {
    const KPIStatusWithHistoryCapabilities: VisualCapabilities;
}

declare module powerbi.visuals.capabilities {
    let animatedNumber: VisualCapabilities;
    let areaChart: VisualCapabilities;
    let barChart: VisualCapabilities;
    let card: VisualCapabilities;
    let multiRowCard: VisualCapabilities;
    let clusteredBarChart: VisualCapabilities;
    let clusteredColumnChart: VisualCapabilities;
    let columnChart: VisualCapabilities;
    let comboChart: VisualCapabilities;
    let dataDotChart: VisualCapabilities;
    let dataDotClusteredColumnComboChart: VisualCapabilities;
    let dataDotStackedColumnComboChart: VisualCapabilities;
    let donutChart: VisualCapabilities;
    let funnel: VisualCapabilities;
    let gauge: VisualCapabilities;
    let hundredPercentStackedBarChart: VisualCapabilities;
    let hundredPercentStackedColumnChart: VisualCapabilities;
    let image: VisualCapabilities;
    let lineChart: VisualCapabilities;
    let lineStackedColumnComboChart: VisualCapabilities;
    let lineClusteredColumnComboChart: VisualCapabilities;
    let map: VisualCapabilities;
    let filledMap: VisualCapabilities;
    let treemap: VisualCapabilities;
    let pieChart: VisualCapabilities;
    let scatterChart: VisualCapabilities;
    let table: VisualCapabilities;
    let matrix: VisualCapabilities;
    let slicer: VisualCapabilities;
    let textbox: VisualCapabilities;
    let waterfallChart: VisualCapabilities;
    let cheerMeter: VisualCapabilities;
    let scriptVisual: VisualCapabilities;
    let kpi: VisualCapabilities;
}

declare module powerbi.visuals {
    interface ColumnBehaviorOptions {
        datapoints: SelectableDataPoint[];
        bars: D3.Selection;
        eventGroup: D3.Selection;
        mainGraphicsContext: D3.Selection;
        hasHighlights: boolean;
        viewport: IViewport;
        axisOptions: ColumnAxisOptions;
        showLabel: boolean;
    }
    class ColumnChartWebBehavior implements IInteractiveBehavior {
        private options;
        bindEvents(options: ColumnBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
        private static getDatumForLastInputEvent();
    }
}

declare module powerbi.visuals {
    interface DataDotChartBehaviorOptions {
        dots: D3.Selection;
        dotLabels: D3.Selection;
        isPartOfCombo?: boolean;
        datapoints?: DataDotChartDataPoint[];
    }
    class DataDotChartWebBehavior implements IInteractiveBehavior {
        private dots;
        bindEvents(options: DataDotChartBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
    }
}

declare module powerbi.visuals {
    interface DonutBehaviorOptions {
        slices: D3.Selection;
        highlightSlices: D3.Selection;
        clearCatcher: D3.Selection;
        hasHighlights: boolean;
        allowDrilldown: boolean;
        visual: IVisual;
    }
    class DonutChartWebBehavior implements IInteractiveBehavior {
        private slices;
        private highlightSlices;
        private hasHighlights;
        bindEvents(options: DonutBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
    }
}

declare module powerbi.visuals {
    interface FunnelBehaviorOptions {
        bars: D3.Selection;
        interactors: D3.Selection;
        clearCatcher: D3.Selection;
        hasHighlights: boolean;
    }
    class FunnelWebBehavior implements IInteractiveBehavior {
        private bars;
        private interactors;
        private hasHighlights;
        bindEvents(options: FunnelBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
    }
}

declare module powerbi.visuals {
    interface PlayBehaviorOptions {
        traceLineRenderer?: ITraceLineRenderer;
    }
}

declare module powerbi.visuals {
    interface LineChartBehaviorOptions {
        lines: D3.Selection;
        interactivityLines: D3.Selection;
        dots: D3.Selection;
        areas: D3.Selection;
        isPartOfCombo?: boolean;
        tooltipOverlay: D3.Selection;
        getCategoryIndex(seriesData: LineChartSeries, pointX: number): number;
        categoryIdentities?: SelectionId[];
    }
    class LineChartWebBehavior implements IInteractiveBehavior {
        private lines;
        private dots;
        private areas;
        private tooltipOverlay;
        bindEvents(options: LineChartBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
        private getPointX(rootNode);
    }
}

declare module powerbi.visuals {
    interface MapBehaviorOptions {
        dataPoints: SelectableDataPoint[];
        bubbles?: D3.Selection;
        slices?: D3.Selection;
        shapes?: D3.Selection;
        clearCatcher: D3.Selection;
        bubbleEventGroup?: D3.Selection;
        sliceEventGroup?: D3.Selection;
        shapeEventGroup?: D3.Selection;
    }
    class MapBehavior implements IInteractiveBehavior {
        private bubbles;
        private slices;
        private shapes;
        private mapPointerEventsDisabled;
        private mapPointerTimeoutSet;
        private viewChangedSinceLastClearMouseDown;
        private receivedZoomOrPanEvent;
        bindEvents(options: MapBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
        viewChanged(): void;
        resetZoomPan(): void;
        hasReceivedZoomOrPanEvent(): boolean;
    }
}

declare module powerbi.visuals {
    interface ScatterBehaviorChartData {
        xCol: DataViewMetadataColumn;
        yCol: DataViewMetadataColumn;
        dataPoints: ScatterChartDataPoint[];
        legendData: LegendData;
        axesLabels: ChartAxesLabels;
        size?: DataViewMetadataColumn;
        sizeRange: NumberRange;
        fillPoint?: boolean;
        colorBorder?: boolean;
    }
    interface ScatterBehaviorOptions {
        dataPointsSelection: D3.Selection;
        eventGroup?: D3.Selection;
        data: ScatterBehaviorChartData;
        plotContext: D3.Selection;
        playOptions?: PlayBehaviorOptions;
    }
    interface ScatterMobileBehaviorOptions extends ScatterBehaviorOptions {
        host: ICartesianVisualHost;
        root: D3.Selection;
        background: D3.Selection;
        visualInitOptions: VisualInitOptions;
        xAxisProperties: IAxisProperties;
        yAxisProperties: IAxisProperties;
    }
    class ScatterChartWebBehavior implements IInteractiveBehavior {
        private bubbles;
        private shouldEnableFill;
        private colorBorder;
        private playOptions;
        bindEvents(options: ScatterBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
    }
    const enum DragType {
        Drag = 0,
        DragEnd = 1,
    }
    class ScatterChartMobileBehavior implements IInteractiveBehavior {
        private static CrosshairClassName;
        private static ScatterChartCircleTagName;
        private static DotClassName;
        private static DotClassSelector;
        private static Horizontal;
        private static Vertical;
        private host;
        private mainGraphicsContext;
        private data;
        private crosshair;
        private crosshairHorizontal;
        private crosshairVertical;
        private lastDotIndex;
        private xAxisProperties;
        private yAxisProperties;
        bindEvents(options: ScatterMobileBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(HasSelection: boolean): void;
        setSelectionHandler(selectionHandler: ISelectionHandler): void;
        private makeDataPointsSelectable(...selection);
        private makeRootSelectable(selection);
        private makeDragable(...selection);
        private disableDefaultTouchInteractions(selection);
        setOptions(options: ScatterMobileBehaviorOptions): void;
        private select(index);
        selectRoot(): void;
        drag(t: DragType): void;
        private onDrag();
        private onClick();
        private getMouseCoordinates();
        private selectDotByIndex(index);
        private selectDot(dotIndex);
        private moveCrosshairToIndexDot(index);
        private moveCrosshairToXY(x, y);
        private drawCrosshair(addTo, x, y, width, height);
        private findClosestDotIndex(x, y);
        private updateLegend(dotIndex);
        private createLegendDataPoints(dotIndex);
    }
}

declare module powerbi.visuals {
    interface HorizontalSlicerBehaviorOptions extends SlicerBehaviorOptions {
        itemsContainer: D3.Selection;
    }
    class HorizontalSlicerWebBehavior implements IInteractiveBehavior {
        private itemLabels;
        private dataPoints;
        private interactivityService;
        private slicerSettings;
        bindEvents(options: HorizontalSlicerBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
    }
}

declare module powerbi.visuals {
    interface VerticalSlicerBehaviorOptions extends SlicerBehaviorOptions {
        itemContainers: D3.Selection;
        itemInputs: D3.Selection;
    }
    class VerticalSlicerWebBehavior implements IInteractiveBehavior {
        private itemLabels;
        private itemInputs;
        private dataPoints;
        private interactivityService;
        private settings;
        bindEvents(options: VerticalSlicerBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
    }
}

declare module powerbi.visuals {
    interface SlicerOrientationBehaviorOptions {
        behaviorOptions: SlicerBehaviorOptions;
        orientation: slicerOrientation.Orientation;
    }
    interface SlicerBehaviorOptions {
        slicerContainer: D3.Selection;
        itemLabels: D3.Selection;
        clear: D3.Selection;
        dataPoints: SlicerDataPoint[];
        interactivityService: IInteractivityService;
        settings: SlicerSettings;
        slicerValueHandler: SlicerValueHandler;
        searchInput: D3.Selection;
    }
    class SlicerWebBehavior implements IInteractiveBehavior {
        private behavior;
        private static searchInputTimeoutDuration;
        bindEvents(options: SlicerOrientationBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
        static bindSlicerEvents(behaviorOptions: SlicerBehaviorOptions, slicers: D3.Selection, selectionHandler: ISelectionHandler, slicerSettings: SlicerSettings, interactivityService: IInteractivityService): void;
        static setSelectionOnSlicerItems(selectableItems: D3.Selection, itemLabel: D3.Selection, hasSelection: boolean, interactivityService: IInteractivityService, slicerSettings: SlicerSettings): void;
        static styleSlicerItems(slicerItems: D3.Selection, hasSelection: boolean, isSelectionInverted: boolean): void;
        private static bindSlicerItemSelectionEvent(slicers, selectionHandler, slicerSettings, interactivityService);
        private static bindSlicerClearEvent(slicerClear, selectionHandler);
        private static bindSlicerSearchEvent(slicerSearch, selectionHandler, slicerValueHandler);
        private static startSearch(slicerSearch, selectionHandler, slicerValueHandler);
        private static styleSlicerContainer(slicerContainer, interactivityService);
        private static isMultiSelect(event, settings, interactivityService);
        private createWebBehavior(options);
    }
}

declare module powerbi.visuals {
    interface LegendBehaviorOptions {
        legendItems: D3.Selection;
        legendIcons: D3.Selection;
        clearCatcher: D3.Selection;
    }
    class LegendBehavior implements IInteractiveBehavior {
        static dimmedLegendColor: string;
        private legendIcons;
        bindEvents(options: LegendBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
    }
}

declare module powerbi.visuals {
    interface TreemapBehaviorOptions {
        shapes: D3.Selection;
        highlightShapes: D3.Selection;
        majorLabels: D3.Selection;
        minorLabels: D3.Selection;
        nodes: TreemapNode[];
        hasHighlights: boolean;
    }
    class TreemapWebBehavior implements IInteractiveBehavior {
        private shapes;
        private highlightShapes;
        private hasHighlights;
        bindEvents(options: TreemapBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
    }
}

declare module powerbi.visuals {
    interface WaterfallChartBehaviorOptions {
        bars: D3.Selection;
    }
    class WaterfallChartWebBehavior {
        private bars;
        bindEvents(options: WaterfallChartBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
    }
}

declare module powerbi.visuals {
    interface LabelsBehaviorOptions {
        labelItems: D3.Selection;
    }
    class LabelsBehavior implements IInteractiveBehavior {
        static DefaultLabelOpacity: number;
        static DimmedLabelOpacity: number;
        private labelItems;
        bindEvents(options: LabelsBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
    }
}

declare module powerbi.visuals {
    interface CartesianBehaviorOptions {
        layerOptions: any[];
        clearCatcher: D3.Selection;
    }
    class CartesianChartBehavior implements IInteractiveBehavior {
        private behaviors;
        constructor(behaviors: IInteractiveBehavior[]);
        bindEvents(options: CartesianBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
    }
}

declare module powerbi.visuals {
    interface VisualConfig {
        visualType: string;
        projections: data.QueryProjectionsByRole[];
        /**
         * This is the one that has info like Total, Combochart viz types, legend settings, etc...
         * Each IVisual implementation, should simply cast this to whatever object they expect.
         */
        config?: any;
    }
}

declare module powerbi.visuals {
    import ITextAsSVGMeasurer = powerbi.ITextAsSVGMeasurer;
    /**
     * Default ranges are for when we have a field chosen for the axis,
     * but no values are returned by the query.
     */
    const emptyDomain: number[];
    interface IAxisProperties {
        /**
         * The D3 Scale object.
         */
        scale: D3.Scale.GenericScale<any>;
        /**
         * The D3 Axis object.
         */
        axis: D3.Svg.Axis;
        /**
         * An array of the tick values to display for this axis.
         */
        values: any[];
        /**
         * The ValueType of the column used for this axis.
         */
        axisType: ValueType;
        /**
         * A formatter with appropriate properties configured for this field.
         */
        formatter: IValueFormatter;
        /**
         * The axis title label.
         */
        axisLabel: string;
        /**
         * Cartesian axes are either a category or value axis.
         */
        isCategoryAxis: boolean;
        /**
         * (optional) The max width for category tick label values. used for ellipsis truncation / label rotation.
         */
        xLabelMaxWidth?: number;
        /**
         * (optional) The thickness of each category on the axis.
         */
        categoryThickness?: number;
        /**
         * (optional) The outer padding in pixels applied to the D3 scale.
         */
        outerPadding?: number;
        /**
         * (optional) Whether we are using a default domain.
         */
        usingDefaultDomain?: boolean;
        /**
         * (optional) do default d3 axis labels fit?
         */
        willLabelsFit?: boolean;
        /**
         * (optional) word break axis labels
         */
        willLabelsWordBreak?: boolean;
        /**
         * (optional) Whether log scale is possible on the current domain.
         */
        isLogScaleAllowed?: boolean;
        /**
         * (optional) Whether domain contains zero value and log scale is enabled.
         */
        hasDisallowedZeroInDomain?: boolean;
        /**
         *(optional) The original data domain. Linear scales use .nice() to round to cleaner edge values. Keep the original data domain for later.
         */
        dataDomain?: number[];
        /**
         * (optional) The D3 graphics context for this axis
         */
        graphicsContext?: D3.Selection;
    }
    interface IMargin {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }
    interface CreateAxisOptions {
        /**
         * The dimension length for the axis, in pixels.
         */
        pixelSpan: number;
        /**
         * The data domain. [min, max] for a scalar axis, or [1...n] index array for ordinal.
         */
        dataDomain: number[];
        /**
         * The DataViewMetadataColumn will be used for dataType and tick value formatting.
         */
        metaDataColumn: DataViewMetadataColumn;
        /**
         * The format string.
         */
        formatString: string;
        /**
         * outerPadding to be applied to the axis.
         */
        outerPadding: number;
        /**
         * Indicates if this is the category axis.
         */
        isCategoryAxis?: boolean;
        /**
         * If true and the dataType is numeric or dateTime,
         * create a linear axis, else create an ordinal axis.
         */
        isScalar?: boolean;
        /**
         * (optional) The scale is inverted for a vertical axis,
         * and different optimizations are made for tick labels.
         */
        isVertical?: boolean;
        /**
         * (optional) For visuals that do not need zero (e.g. column/bar) use tickInterval.
         */
        useTickIntervalForDisplayUnits?: boolean;
        /**
         * (optional) Combo charts can override the tick count to
         * align y1 and y2 grid lines.
         */
        forcedTickCount?: number;
        /**
         * (optional) For scalar axis with scalar keys, the number of ticks should never exceed the number of scalar keys,
         * or labeling will look wierd (i.e. level of detail is Year, but month labels are shown between years)
         */
        maxTickCount?: number;
        /**
         * (optional) Callback for looking up actual values from indices,
         * used when formatting tick labels.
         */
        getValueFn?: (index: number, type: ValueType) => any;
        /**
         * (optional) The width/height of each category on the axis.
         */
        categoryThickness?: number;
        /** (optional) the scale type of the axis. e.g. log, linear */
        scaleType?: string;
        /** (optional) user selected display units */
        axisDisplayUnits?: number;
        /** (optional) user selected precision */
        axisPrecision?: number;
        /** (optional) for 100 percent stacked charts, causes formatString override and minTickInterval adjustments */
        is100Pct?: boolean;
        /** (optional) sets clamping on the D3 scale, useful for drawing column chart rectangles as it simplifies the math during layout */
        shouldClamp?: boolean;
    }
    interface CreateScaleResult {
        scale: D3.Scale.GenericScale<any>;
        bestTickCount: number;
        usingDefaultDomain?: boolean;
    }
    interface TickLabelMargins {
        xMax: number;
        yLeft: number;
        yRight: number;
    }
    module AxisHelper {
        function getRecommendedNumberOfTicksForXAxis(availableWidth: number): number;
        function getRecommendedNumberOfTicksForYAxis(availableWidth: number): number;
        /**
         * Get the best number of ticks based on minimum value, maximum value,
         * measure metadata and max tick count.
         *
         * @param min The minimum of the data domain.
         * @param max The maximum of the data domain.
         * @param valuesMetadata The measure metadata array.
         * @param maxTickCount The max count of intervals.
         * @param isDateTime - flag to show single tick when min is equal to max.
         */
        function getBestNumberOfTicks(min: number, max: number, valuesMetadata: DataViewMetadataColumn[], maxTickCount: number, isDateTime?: boolean): number;
        function hasNonIntegerData(valuesMetadata: DataViewMetadataColumn[]): boolean;
        function getRecommendedTickValues(maxTicks: number, scale: D3.Scale.GenericScale<any>, axisType: ValueType, isScalar: boolean, minTickInterval?: number): any[];
        function getRecommendedTickValuesForAnOrdinalRange(maxTicks: number, labels: string[]): string[];
        function getRecommendedTickValuesForAQuantitativeRange(maxTicks: number, scale: D3.Scale.GenericScale<any>, minInterval?: number): number[];
        function getMargin(availableWidth: number, availableHeight: number, xMargin: number, yMargin: number): IMargin;
        function getTickLabelMargins(viewport: IViewport, yMarginLimit: number, textWidthMeasurer: ITextAsSVGMeasurer, textHeightMeasurer: ITextAsSVGMeasurer, axes: CartesianAxisProperties, bottomMarginLimit: number, properties: TextProperties, scrollbarVisible?: boolean, showOnRight?: boolean, renderXAxis?: boolean, renderY1Axis?: boolean, renderY2Axis?: boolean): TickLabelMargins;
        function columnDataTypeHasValue(dataType: ValueTypeDescriptor): boolean;
        function createOrdinalType(): ValueType;
        function isOrdinal(type: ValueTypeDescriptor): boolean;
        function isOrdinalScale(scale: any): boolean;
        function isDateTime(type: ValueTypeDescriptor): boolean;
        function invertScale(scale: any, x: any): any;
        function extent(scale: any): number[];
        function invertOrdinalScale(scale: D3.Scale.OrdinalScale, x: number): any;
        function findClosestXAxisIndex(categoryValue: number, categoryAxisValues: CartesianDataPoint[]): number;
        function lookupOrdinalIndex(scale: D3.Scale.OrdinalScale, pixelValue: number): number;
        /** scale(value1) - scale(value2) with zero checking and min(+/-1, result) */
        function diffScaled(scale: D3.Scale.GenericScale<any>, value1: any, value2: any): number;
        function createDomain(data: CartesianSeries[], axisType: ValueTypeDescriptor, isScalar: boolean, forcedScalarDomain: any[], ensureDomain?: NumberRange): number[];
        function ensureValuesInRange(values: number[], min: number, max: number): number[];
        /**
         * Gets the ValueType of a category column, defaults to Text if the type is not present.
         */
        function getCategoryValueType(metadataColumn: DataViewMetadataColumn, isScalar?: boolean): ValueType;
        /**
         * Create a D3 axis including scale. Can be vertical or horizontal, and either datetime, numeric, or text.
         * @param options The properties used to create the axis.
         */
        function createAxis(options: CreateAxisOptions): IAxisProperties;
        function createScale(options: CreateAxisOptions): CreateScaleResult;
        function createFormatter(scaleDomain: any[], dataDomain: any[], dataType: any, isScalar: boolean, formatString: string, bestTickCount: number, tickValues: any[], getValueFn: any, useTickIntervalForDisplayUnits?: boolean, axisDisplayUnits?: number, axisPrecision?: number): IValueFormatter;
        function getMinTickValueInterval(formatString: string, columnType: ValueType, is100Pct?: boolean): number;
        /**
         * Creates a [min,max] from your Cartiesian data values.
         *
         * @param data The series array of CartesianDataPoints.
         * @param includeZero Columns and bars includeZero, line and scatter do not.
         */
        function createValueDomain(data: CartesianSeries[], includeZero: boolean): number[];
        module LabelLayoutStrategy {
            function willLabelsFit(axisProperties: IAxisProperties, availableWidth: number, textMeasurer: ITextAsSVGMeasurer, properties: TextProperties): boolean;
            function willLabelsWordBreak(axisProperties: IAxisProperties, margin: IMargin, availableWidth: number, textWidthMeasurer: ITextAsSVGMeasurer, textHeightMeasurer: ITextAsSVGMeasurer, textTruncator: (properties: TextProperties, maxWidth: number) => string, properties: TextProperties): boolean;
            const DefaultRotation: {
                sine: number;
                cosine: number;
                tangent: number;
                transform: string;
                dy: string;
            };
            const DefaultRotationWithScrollbar: {
                sine: number;
                cosine: number;
                tangent: number;
                transform: string;
                dy: string;
            };
            function rotate(labelSelection: D3.Selection, maxBottomMargin: number, textTruncator: (properties: TextProperties, maxWidth: number) => string, textProperties: TextProperties, needRotate: boolean, needEllipsis: boolean, axisProperties: IAxisProperties, margin: IMargin, scrollbarVisible: boolean): void;
            function wordBreak(text: D3.Selection, axisProperties: IAxisProperties, maxHeight: number): void;
            function clip(text: D3.Selection, availableWidth: number, svgEllipsis: (textElement: SVGTextElement, maxWidth: number) => void): void;
        }
        function createOrdinalScale(pixelSpan: number, dataDomain: any[], outerPaddingRatio?: number): D3.Scale.OrdinalScale;
        function isLogScalePossible(domain: any[], axisType?: ValueType): boolean;
        function createNumericalScale(axisScaleType: string, pixelSpan: number, dataDomain: any[], dataType: ValueType, outerPadding?: number, niceCount?: number, shouldClamp?: boolean): D3.Scale.GenericScale<any>;
        function createLinearScale(pixelSpan: number, dataDomain: any[], outerPadding?: number, niceCount?: number, shouldClamp?: boolean): D3.Scale.LinearScale;
        function getRangeForColumn(sizeColumn: DataViewValueColumn): NumberRange;
        /**
         * Set customized domain, but don't change when nothing is set
         */
        function applyCustomizedDomain(customizedDomain: any, forcedDomain: any[]): any[];
        /**
         * Combine the forced domain with the actual domain if one of the values was set.
         * The forcedDomain is in 1st priority. Extends the domain if the any reference point requires it.
         */
        function combineDomain(forcedDomain: any[], domain: any[], ensureDomain?: NumberRange): any[];
        function createAxisLabel(properties: DataViewObject, label: string, unitType: string, y2?: boolean): string;
        function scaleShouldClamp(combinedDomain: any[], domain: any[]): boolean;
        function normalizeNonFiniteNumber(value: PrimitiveValue): number;
        /**
         * Indicates whether the number is power of 10.
         */
        function powerOfTen(d: any): boolean;
    }
}

declare module powerbi.visuals {
    module ShapeFactory {
        module ShapeFactoryConsts {
            const PaddingConstRatio: number;
            const TrianglePaddingConstRatio: number;
            const TriangleEndPaddingConstRatio: number;
            const ShapeConstRatio: number;
            const SmallPaddingConstValue: number;
            const OvalRadiusConst: number;
            const OvalRadiusConstPadding: number;
            const ArrowLeftHeadPoint: Point;
            const ArrowMiddleHeadPoint: Point;
            const ArrowRightHeadPoint: Point;
            const ArrowRightMiddleHeadPoint: Point;
            const ArrowBottomRightPoint: Point;
            const ArrowBottomLeftPoint: Point;
            const ArrowLeftMiddleHeadPoint: Point;
        }
        /** this function creates a rectangle svg   */
        function createRectangle(data: BasicShapeData, viewportHeight: number, viewportWidth: number, selectedElement: D3.Selection, degrees: number): void;
        /** this function creates a oval svg   */
        function createOval(data: BasicShapeData, viewportHeight: number, viewportWidth: number, selectedElement: D3.Selection, degrees: number): void;
        /** this function creates a line svg   */
        function createLine(data: BasicShapeData, viewportHeight: number, viewportWidth: number, selectedElement: D3.Selection, degrees: number): void;
        /** this function creates a arrow svg   */
        function createUpArrow(data: BasicShapeData, viewportHeight: number, viewportWidth: number, selectedElement: D3.Selection, degrees: number): void;
        /** this function creates a triangle svg   */
        function createTriangle(data: BasicShapeData, viewportHeight: number, viewportWidth: number, selectedElement: D3.Selection, degrees: number): void;
    }
}

declare module powerbi.visuals {
    module CartesianHelper {
        function getCategoryAxisProperties(dataViewMetadata: DataViewMetadata, axisTitleOnByDefault?: boolean): DataViewObject;
        function getValueAxisProperties(dataViewMetadata: DataViewMetadata, axisTitleOnByDefault?: boolean): DataViewObject;
        function isScalar(isScalar: boolean, xAxisCardProperties: DataViewObject): boolean;
        function getPrecision(precision: DataViewPropertyValue): number;
        function lookupXValue(data: CartesianData, index: number, type: ValueType, isScalar: boolean): any;
        function findMaxCategoryIndex(series: CartesianSeries[]): number;
    }
}

declare module powerbi.visuals {
    class ColorHelper {
        private fillProp;
        private defaultDataPointColor;
        private colors;
        private defaultColorScale;
        constructor(colors: IDataColorPalette, fillProp?: DataViewObjectPropertyIdentifier, defaultDataPointColor?: string);
        /**
         * Gets the color for the given series value.
         * If no explicit color or default color has been set then the color is
         * allocated from the color scale for this series.
         */
        getColorForSeriesValue(objects: DataViewObjects, fieldIds: powerbi.data.ISQExpr[], value: PrimitiveValue): string;
        /**
         * Gets the color scale for the given series.
         */
        getColorScaleForSeries(fieldIds: powerbi.data.ISQExpr[]): IColorScale;
        /**
         * Gets the color for the given measure.
         */
        getColorForMeasure(objects: DataViewObjects, measureKey: any): string;
        static normalizeSelector(selector: data.Selector, isSingleSeries?: boolean): data.Selector;
    }
}

declare module powerbi.visuals {
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    module ColumnUtil {
        const DimmedOpacity: number;
        const DefaultOpacity: number;
        function applyUserMinMax(isScalar: boolean, dataView: DataViewCategorical, xAxisCardProperties: DataViewObject): DataViewCategorical;
        function transformDomain(dataView: DataViewCategorical, min: DataViewPropertyValue, max: DataViewPropertyValue): DataViewCategorical;
        function getCategoryAxis(data: ColumnChartData, size: number, layout: CategoryLayout, isVertical: boolean, forcedXMin?: DataViewPropertyValue, forcedXMax?: DataViewPropertyValue, axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureXDomain?: NumberRange): IAxisProperties;
        function applyInteractivity(columns: D3.Selection, onDragStart: any): void;
        function getFillOpacity(selected: boolean, highlight: boolean, hasSelection: boolean, hasPartialHighlights: boolean): number;
        function getClosestColumnIndex(coordinate: number, columnsCenters: number[]): number;
        function setChosenColumnOpacity(mainGraphicsContext: D3.Selection, columnGroupSelector: string, selectedColumnIndex: number, lastColumnIndex: number): void;
        function drawSeries(data: ColumnChartData, graphicsContext: D3.Selection, axisOptions: ColumnAxisOptions): D3.UpdateSelection;
        function drawDefaultShapes(data: ColumnChartData, series: D3.UpdateSelection, layout: IColumnLayout, itemCS: ClassAndSelector, filterZeros: boolean, hasSelection: boolean): D3.UpdateSelection;
        function drawDefaultLabels(series: D3.UpdateSelection, context: D3.Selection, layout: ILabelLayout, viewPort: IViewport, isAnimator?: boolean, animationDuration?: number): D3.UpdateSelection;
        function normalizeInfinityInScale(scale: D3.Scale.GenericScale<any>): void;
        function calculatePosition(d: ColumnChartDataPoint, axisOptions: ColumnAxisOptions): number;
    }
    module ClusteredUtil {
        function clearColumns(mainGraphicsContext: D3.Selection, itemCS: ClassAndSelector): void;
    }
    interface ValueMultiplers {
        pos: number;
        neg: number;
    }
    module StackedUtil {
        function getSize(scale: D3.Scale.GenericScale<any>, size: number, zeroVal?: number): number;
        function calcValueDomain(data: ColumnChartSeries[], is100pct: boolean): NumberRange;
        function getStackedMultiplier(dataView: DataViewCategorical, rowIdx: number, seriesCount: number, categoryCount: number, converterStrategy: IColumnChartConverterStrategy): ValueMultiplers;
        function clearColumns(mainGraphicsContext: D3.Selection, itemCS: ClassAndSelector): void;
    }
}

declare module powerbi.visuals {
    interface PivotedCategoryInfo {
        categories?: any[];
        categoryFormatter?: IValueFormatter;
        categoryIdentities?: DataViewScopeIdentity[];
        categoryObjects?: DataViewObjects[];
    }
    module converterHelper {
        function categoryIsAlsoSeriesRole(dataView: DataViewCategorical, seriesRoleName: string, categoryRoleName: string): boolean;
        function getPivotedCategories(dataView: DataViewCategorical, formatStringProp: DataViewObjectPropertyIdentifier): PivotedCategoryInfo;
        function getSeriesName(source: DataViewMetadataColumn): PrimitiveValue;
        function getFormattedLegendLabel(source: DataViewMetadataColumn, values: DataViewValueColumns, formatStringProp: DataViewObjectPropertyIdentifier): string;
        function createAxesLabels(categoryAxisProperties: DataViewObject, valueAxisProperties: DataViewObject, category: DataViewMetadataColumn, values: DataViewMetadataColumn[]): {
            xAxisLabel: any;
            yAxisLabel: any;
        };
        function isImageUrlColumn(column: DataViewMetadataColumn): boolean;
        function isWebUrlColumn(column: DataViewMetadataColumn): boolean;
        function hasImageUrlColumn(dataView: DataView): boolean;
        function formatFromMetadataColumn(value: any, column: DataViewMetadataColumn, formatStringProp: DataViewObjectPropertyIdentifier): string;
    }
}

declare module powerbi.visuals {
    const enum PointLabelPosition {
        Above = 0,
        Below = 1,
    }
    interface PointDataLabelsSettings extends VisualDataLabelsSettings {
        position: PointLabelPosition;
    }
    interface LabelFormattedTextOptions {
        label: any;
        maxWidth?: number;
        format?: string;
        formatter?: IValueFormatter;
        fontSize?: number;
    }
    interface VisualDataLabelsSettings {
        show: boolean;
        showLabelPerSeries?: boolean;
        isSeriesExpanded?: boolean;
        displayUnits?: number;
        showCategory?: boolean;
        position?: any;
        precision?: number;
        labelColor: string;
        categoryLabelColor?: string;
        fontSize?: number;
        labelStyle?: any;
    }
    interface VisualDataLabelsSettingsOptions {
        show: boolean;
        enumeration: ObjectEnumerationBuilder;
        dataLabelsSettings: VisualDataLabelsSettings;
        displayUnits?: boolean;
        precision?: boolean;
        position?: boolean;
        positionObject?: string[];
        selector?: powerbi.data.Selector;
        fontSize?: boolean;
        showAll?: boolean;
        labelDensity?: boolean;
        labelStyle?: boolean;
    }
    interface LabelEnabledDataPoint {
        labelX?: number;
        labelY?: number;
        labelFill?: string;
        labeltext?: string;
        labelFormatString?: string;
        isLabelInside?: boolean;
        labelFontSize?: number;
    }
    interface IColumnFormatterCache {
        [column: string]: IValueFormatter;
        defaultFormatter?: IValueFormatter;
    }
    interface IColumnFormatterCacheManager {
        cache: IColumnFormatterCache;
        getOrCreate: (formatString: string, labelSetting: VisualDataLabelsSettings, value2?: number) => IValueFormatter;
    }
    interface LabelPosition {
        y: (d: any, i: number) => number;
        x: (d: any, i: number) => number;
    }
    interface ILabelLayout {
        labelText: (d: any) => string;
        labelLayout: LabelPosition;
        filter: (d: any) => boolean;
        style: {};
    }
    interface DataLabelObject extends DataViewObject {
        show: boolean;
        color: Fill;
        labelDisplayUnits: number;
        labelPrecision?: number;
        labelPosition: any;
        fontSize?: number;
        showAll?: boolean;
        showSeries?: boolean;
        labelDensity?: string;
        labelStyle?: any;
    }
    module dataLabelUtils {
        const minLabelFontSize: number;
        const labelMargin: number;
        const maxLabelWidth: number;
        const defaultColumnLabelMargin: number;
        const defaultColumnHalfLabelHeight: number;
        const defaultLabelDensity: string;
        const DefaultDy: string;
        const DefaultFontSizeInPt: number;
        const StandardFontFamily: string;
        const LabelTextProperties: TextProperties;
        const defaultLabelColor: string;
        const defaultInsideLabelColor: string;
        const hundredPercentFormat: string;
        const defaultLabelPrecision: number;
        function updateLabelSettingsFromLabelsObject(labelsObj: DataLabelObject, labelSettings: VisualDataLabelsSettings): void;
        function updateLineChartLabelSettingsFromLabelsObject(labelsObj: DataLabelObject, labelSettings: LineChartDataLabelsSettings): void;
        function getDefaultLabelSettings(show?: boolean, labelColor?: string, fontSize?: number): VisualDataLabelsSettings;
        function getDefaultCardLabelSettings(labelColor: string, categoryLabelColor: string, fontSize?: number): VisualDataLabelsSettings;
        function getDefaultTreemapLabelSettings(): VisualDataLabelsSettings;
        function getDefaultSunburstLabelSettings(): VisualDataLabelsSettings;
        function getDefaultColumnLabelSettings(isLabelPositionInside: boolean): VisualDataLabelsSettings;
        function getDefaultPointLabelSettings(): PointDataLabelsSettings;
        function getDefaultLineChartLabelSettings(isComboChart?: boolean): LineChartDataLabelsSettings;
        function getDefaultMapLabelSettings(): PointDataLabelsSettings;
        function getDefaultDonutLabelSettings(): VisualDataLabelsSettings;
        function getDefaultGaugeLabelSettings(): VisualDataLabelsSettings;
        function getDefaultKpiLabelSettings(): VisualDataLabelsSettings;
        function getLabelPrecision(precision: number, format: string): number;
        function drawDefaultLabelsForDataPointChart(data: any[], context: D3.Selection, layout: ILabelLayout, viewport: IViewport, isAnimator?: boolean, animationDuration?: number, hasSelection?: boolean): D3.UpdateSelection;
        function cleanDataLabels(context: D3.Selection, removeLines?: boolean): void;
        function setHighlightedLabelsOpacity(context: D3.Selection, hasSelection: boolean, hasHighlights: boolean): void;
        function getLabelFormattedText(options: LabelFormattedTextOptions): string;
        function getLabelLayoutXYForWaterfall(xAxisProperties: IAxisProperties, categoryWidth: number, yAxisProperties: IAxisProperties, dataDomain: number[]): LabelPosition;
        function doesDataLabelFitInShape(d: WaterfallChartDataPoint, yAxisProperties: IAxisProperties, layout: WaterfallLayout): boolean;
        function getMapLabelLayout(labelSettings: PointDataLabelsSettings): ILabelLayout;
        function getColumnChartLabelLayout(data: ColumnChartData, labelLayoutXY: any, isColumn: boolean, isHundredPercent: boolean, axisFormatter: IValueFormatter, axisOptions: ColumnAxisOptions, interactivityService: IInteractivityService, visualWidth?: number): ILabelLayout;
        function getColumnChartLabelFilter(d: ColumnChartDataPoint, hasSelection: boolean, hasHighlights: boolean, axisOptions: ColumnAxisOptions, visualWidth?: number): any;
        function getScatterChartLabelLayout(xScale: D3.Scale.GenericScale<any>, yScale: D3.Scale.GenericScale<any>, labelSettings: PointDataLabelsSettings, viewport: IViewport, sizeRange: NumberRange): ILabelLayout;
        function getLineChartLabelLayout(xScale: D3.Scale.GenericScale<any>, yScale: D3.Scale.GenericScale<any>, labelSettings: PointDataLabelsSettings, isScalar: boolean, axisFormatter: IValueFormatter): ILabelLayout;
        function enumerateDataLabels(options: VisualDataLabelsSettingsOptions): ObjectEnumerationBuilder;
        function enumerateCategoryLabels(enumeration: ObjectEnumerationBuilder, dataLabelsSettings: VisualDataLabelsSettings, withFill: boolean, isShowCategory?: boolean, fontSize?: number): void;
        function createColumnFormatterCacheManager(): IColumnFormatterCacheManager;
        function getOptionsForLabelFormatter(labelSetting: VisualDataLabelsSettings, formatString: string, value2?: number, precision?: number): ValueFormatterOptions;
        function isTextWidthOverflows(textWidth: any, maxTextWidth: any): boolean;
        function isTextHeightOverflows(textHeight: any, innerChordLength: any): boolean;
    }
}

declare module powerbi.visuals {
    import ISize = shapes.ISize;
    module DonutLabelUtils {
        const LineStrokeWidth: number;
        const DiagonalLineIndex: number;
        const HorizontalLineIndex: number;
        function getLabelLeaderLineForDonutChart(donutArcDescriptor: DonutArcDescriptor, donutProperties: DonutChartProperties, parentPoint: IPoint, sliceArc?: number): number[][];
        /** We calculate the rectangles of the leader lines for collision detection
          *width: x2 - x1; height: y2 - y1 */
        function getLabelLeaderLinesSizeForDonutChart(leaderLinePoints: number[][]): ISize[];
        function getXPositionForDonutLabel(textPointX: number): number;
        function getSpaceAvailableForDonutLabels(labelXPos: number, viewport: IViewport): number;
    }
}

declare module powerbi.visuals {
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import ISize = shapes.ISize;
    module NewDataLabelUtils {
        const DefaultLabelFontSizeInPt: number;
        const MapPolylineOpacity: number;
        const LabelDensityBufferFactor: number;
        const LabelDensityPadding: number;
        let startingLabelOffset: number;
        let maxLabelOffset: number;
        let maxLabelWidth: number;
        let hundredPercentFormat: string;
        let LabelTextProperties: TextProperties;
        let defaultLabelColor: string;
        let defaultInsideLabelColor: string;
        const horizontalLabelBackgroundPadding: number;
        const verticalLabelBackgroundPadding: number;
        let labelGraphicsContextClass: ClassAndSelector;
        let labelBackgroundGraphicsContextClass: ClassAndSelector;
        function drawDefaultLabels(context: D3.Selection, dataLabels: Label[], numeric?: boolean, twoRows?: boolean, hasTooltip?: boolean): D3.UpdateSelection;
        function animateDefaultLabels(context: D3.Selection, dataLabels: Label[], duration: number, numeric?: boolean, easeType?: string): D3.UpdateSelection;
        /** Draws black rectangles based on the bounding bx of labels, to be used in debugging */
        function drawLabelBackground(context: D3.Selection, dataLabels: Label[], fill?: string, fillOpacity?: number): D3.UpdateSelection;
        function drawLabelLeaderLines(context: D3.Selection, filteredDataLabels: Label[], key?: (data: any, index?: number) => any, leaderLineColor?: string): void;
        function getLabelFormattedText(label: string | number, format?: string, formatter?: IValueFormatter): string;
        function getDisplayUnitValueFromAxisFormatter(axisFormatter: IValueFormatter, labelSettings: VisualDataLabelsSettings): number;
        function createColumnFormatterCacheManager(): IColumnFormatterCacheManager;
        function removeDuplicates(labelDataPoints: LabelDataPoint[]): LabelDataPoint[];
        function getDataLabelLayoutOptions(type: CartesianChartType): DataLabelLayoutOptions;
        function getTextSize(text: string, fontSize: number): ISize;
    }
}

declare module powerbi.visuals {
    module KpiUtil {
        const enum KpiImageSize {
            Small = 0,
            Big = 1,
        }
        interface KpiImageMetadata {
            statusGraphic: string;
            caption: string;
            class: string;
        }
        interface KPIGraphicClass {
            kpiIconClass: string;
            statusValues: string[];
        }
        function getClassForKpi(kpi: DataViewKpiColumnMetadata, value: PrimitiveValue, kpiImageSize?: KpiImageSize): string;
        function getKpiImageMetadata(metaDataColumn: DataViewMetadataColumn, value: PrimitiveValue, kpiImageSize?: KpiImageSize): KpiImageMetadata;
    }
}

declare module powerbi.visuals {
    module DateUtil {
        function isEqual(date1: Date, date2: Date): boolean;
    }
}

declare module powerbi.visuals {
    interface MinMaxLabelDataPointSorterOptions {
        unsortedLabelDataPointGroups: LabelDataPointGroup[];
        series: CartesianSeries[];
        yAxisProperties: IAxisProperties;
        viewport: IViewport;
    }
    class MinMaxLabelDataPointSorter {
        private unsortedLabelDataPointGroups;
        private series;
        private yScale;
        private viewport;
        /** A rough estimate for how wide labels are for purposes of calculating density, window size, etc. */
        static estimatedLabelWidth: number;
        private static minimumWeightToConsiderMinMax;
        private static maxNumberToSortFactor;
        constructor(options: MinMaxLabelDataPointSorterOptions);
        getSortedDataLabels(): LabelDataPointGroup[];
        /**
         * The weight for each min/max is made up of four values, which are averaged into
         * a single weight.  You have a weight based on the value difference for both the
         * left and right side and a weight for the index difference for both left and
         * right.  These values are normalized as such:
         *
         * valueWeight = abs(scaledValueDifference / totalScaledValueDifference)
         * indexWeight = abs(indexDifference / categoryCount)
         *
         * Since we don't care about the direction of these change, we take the absolute
         * value for both.  We use scaled coordinates for the valueWeight because this
         * will more accurately represent what the user sees (consider a log scale; small
         * visual changes at the top would otherwise trump large visual changes at the
         * bottom of the axis)
         *
         * In code, the averaging is done by averaging together the "current" value and
         * index weights and then assigning it to the current dataPoint.  Then, when the
         * "next" data point's weight is calculated, that weight (with respect to "current")
         * is then averaged with the weight originally assigned.  Data points next to nulls
         * or on the edge of the visual only have a weight associated with the one side that
         * is non-null.
         *
         * Also note that weights are only calculated for minimums and maximums.
         *
         * @param labelDataPoints The labelDataPoints to apply the weighting to
         */
        private calculateWeights(labelDataPoints, data, numberOfLabelsToSort, globalMinMax);
        private findMinMaxesBasedOnSmoothedValues(labelDataPoints, data);
        private static getMinMaxInRange(startIndex, endIndex, data);
        private getWindowSize(data);
        private calculateSmoothedValues(data, windowSize);
        private static getGaussianDistribution(windowSize);
        private getSmoothedValue(data, categoryIndex, windowSize, gaussianValues);
        private addFirstLastMaxMin(unsorted, sorted, maxIndex, minIndex);
        private addLocalMinMaxes(unsorted, sorted, maxIndex, minIndex, maxNumberOfLabels);
        private addNonMinMaxes(unsorted, sorted, maxNumberOfLabels);
        private getMinMaxType(index, scaledDataPoints);
    }
}

declare module powerbi.visuals {
    module ReferenceLineHelper {
        const referenceLineProps: {
            show: string;
            displayName: string;
            lineColor: string;
            transparency: string;
            value: string;
            style: string;
            position: string;
            dataLabelShow: string;
            dataLabelColor: string;
            dataLabelDecimalPoints: string;
            dataLabelHorizontalPosition: string;
            dataLabelVerticalPosition: string;
            dataLabelDisplayUnits: string;
        };
        function enumerateObjectInstances(enumeration: ObjectEnumerationBuilder, referenceLines: DataViewObjectMap, defaultColor: string, objectName: string): void;
        function render(options: ReferenceLineOptions): void;
        function createLabelDataPoint(options: ReferenceLineDataLabelOptions): LabelDataPoint;
        function extractReferenceLineValue(referenceLineProperties: DataViewObject): number;
    }
}

declare module powerbi.visuals {
    module InteractivityUtils {
        function getPositionOfLastInputEvent(): IPoint;
        function registerStandardInteractivityHandlers(selection: D3.Selection, selectionHandler: ISelectionHandler): void;
        function registerStandardSelectionHandler(selection: D3.Selection, selectionHandler: ISelectionHandler): void;
        function registerStandardContextMenuHandler(selection: D3.Selection, selectionHandler: ISelectionHandler): void;
        function registerGroupInteractivityHandlers(group: D3.Selection, selectionHandler: ISelectionHandler): void;
        function registerGroupSelectionHandler(group: D3.Selection, selectionHandler: ISelectionHandler): void;
        function registerGroupContextMenuHandler(group: D3.Selection, selectionHandler: ISelectionHandler): void;
    }
}

declare module powerbi.visuals {
    import DataView = powerbi.DataView;
    function getInvalidValueWarnings(dataViews: DataView[], supportsNaN: boolean, supportsNegativeInfinity: boolean, supportsPositiveInfinity: boolean): IVisualWarning[];
}

declare module powerbi.visuals {
    interface IListView {
        data(data: any[], dataIdFunction: (d) => {}, dataAppended: boolean): IListView;
        rowHeight(rowHeight: number): IListView;
        viewport(viewport: IViewport): IListView;
        render(): void;
        empty(): void;
    }
    module ListViewFactory {
        function createListView(options: any): IListView;
    }
    interface ListViewOptions {
        enter: (selection: D3.Selection) => void;
        exit: (selection: D3.Selection) => void;
        update: (selection: D3.Selection) => void;
        loadMoreData: () => void;
        baseContainer: D3.Selection;
        rowHeight: number;
        viewport: IViewport;
        scrollEnabled: boolean;
        isReadMode: () => boolean;
    }
}

declare module powerbi.visuals {
    module MapUtil {
        interface IPixelArrayResult {
            array: Float64Array;
            arrayString: string;
        }
        const Settings: {
            MaxBingRequest: number;
            MaxCacheSize: number;
            MaxCacheSizeOverflow: number;
            BingKey: string;
            BingUrl: string;
            BingUrlGeodata: string;
            UseDoubleArrayGeodataResult: boolean;
            UseDoubleArrayDequeueTimeout: number;
        };
        const MinAllowedLatitude: number;
        const MaxAllowedLatitude: number;
        const MinAllowedLongitude: number;
        const MaxAllowedLongitude: number;
        const TileSize: number;
        const MaxLevelOfDetail: number;
        const MinLevelOfDetail: number;
        const MaxAutoZoomLevel: number;
        const DefaultLevelOfDetail: number;
        const WorkerErrorName: string;
        const CategoryTypes: {
            Address: string;
            City: string;
            Continent: string;
            CountryRegion: string;
            County: string;
            Longitude: string;
            Latitude: string;
            Place: string;
            PostalCode: string;
            StateOrProvince: string;
        };
        function clip(n: number, minValue: number, maxValue: number): number;
        function getMapSize(levelOfDetail: number): number;
        /**
         * @param latLongArray - is a Float64Array as [lt0, lon0, lat1, long1, lat2, long2,....]
         * @param buildString - optional, if true returns also a string as "x0 y0 x1 y1 x2 y2 ...."
         * @returns IPixelArrayResult with Float64Array as [x0, y0, x1, y1, x2, y2,....]
         */
        function latLongToPixelXYArray(latLongArray: Float64Array, levelOfDetail: number, buildString?: boolean): IPixelArrayResult;
        function getLocationBoundaries(latLongArray: Float64Array): Microsoft.Maps.LocationRect;
        /**
         * Note: this code is taken from Bing.
         *  see Point Compression Algorithm http://msdn.microsoft.com/en-us/library/jj158958.aspx
         *  see Decompression Algorithm in http://msdn.microsoft.com/en-us/library/dn306801.aspx
         */
        function parseEncodedSpatialValueArray(value: any): Float64Array;
        function calcGeoData(data: IGeocodeBoundaryCoordinate): void;
        function locationToPixelXY(location: Microsoft.Maps.Location, levelOfDetail: number): powerbi.visuals.Point;
        function locationRectToRectXY(locationRect: Microsoft.Maps.LocationRect, levelOfDetail: number): powerbi.visuals.Rect;
        function latLongToPixelXY(latitude: number, longitude: number, levelOfDetail: number): powerbi.visuals.Point;
        function pixelXYToLocation(pixelX: number, pixelY: number, levelOfDetail: number): Microsoft.Maps.Location;
        module CurrentLocation {
            function createPushpin(location: Microsoft.Maps.Location): Microsoft.Maps.Pushpin;
        }
    }
    class MapPolygonInfo {
        private _locationRect;
        private _baseRect;
        private _currentRect;
        constructor();
        reCalc(mapControl: Microsoft.Maps.Map, width: number, height: number): void;
        scale: number;
        transform: Transform;
        outherTransform: Transform;
        setViewBox(svg: SVGSVGElement): void;
        innerTransform: Transform;
        transformToString(transform: Transform): string;
    }
}

declare module powerbi.visuals.utility {
    interface SelectionManagerOptions {
        hostServices: IVisualHostServices;
    }
    class SelectionManager {
        private selectedIds;
        private hostServices;
        private dataPointObjectName;
        constructor(options: SelectionManagerOptions);
        select(selectionId: SelectionId, multiSelect?: boolean): JQueryDeferred<SelectionId[]>;
        showContextMenu(selectionId: SelectionId, position?: Point): JQueryDeferred<{}>;
        hasSelection(): boolean;
        clear(): JQueryDeferred<{}>;
        getSelectionIds(): SelectionId[];
        private sendSelectionToHost(ids);
        private sendContextMenuToHost(selectionId, position);
        private getSelectorsByColumn(selectionIds);
        private selectInternal(selectionId, multiSelect);
        static containsSelection(list: SelectionId[], id: SelectionId): boolean;
    }
}

declare module powerbi.visuals {
    module shapes {
        class Polygon {
            private _absoluteCentroid;
            private _absoluteBoundingRect;
            polygonPoints: IPoint[];
            pixelBoundingRect: Rect;
            constructor(absolutePoints: Float64Array);
            absoluteCentroid(): IPoint;
            absoluteBoundingRect(): Rect;
            /**
             * Check if label text contain in polygon shape.
             *
             * @return true/false is the label fit in polygon.
             * measure if rects points are inside the polygon shape
             * return true if there is at least 3 point inside the polygon
             */
            contains(rect: IRect): boolean;
            /**
            * Check if label text is outside of polygon shape.
            * It checks 8 points in the label. TopLeft, TopCenter, TopRight, MiddleLeft, MiddleRight, BottomLeft, BottomMiddle, BottomRight
            * @return true/false is there is any conflict (at least one point inside the shape).
            */
            conflicts(rect: IRect): boolean;
            /**
            * returns intersection point of a line (depicted by two points) and a polygon.
            *
            * @return the point of intersection or null if there is no intersection.
            */
            lineIntersectionPoint(p0: IPoint, p1: IPoint): IPoint;
            /**
             * calculate Polygon Area.
             *
             * @return the area of the polygon (as number).
             */
            static calculateAbsolutePolygonArea(polygonPoints: IPoint[]): number;
            /**
            * Check if label text is outside of polygon bounding box.
            *
            * @return true/false is there is any conflict (at least one point inside the shape).
            */
            private isConflictWithBoundingBox(rect);
            /**
             * Calculate Polygon Centroid.
             *
             * @return 'center' point of the polygon.
             * calculate the polygon area
             * calculate the average points of the polygon by x & y axis.
             * divided the average point by the area
             */
            private calculatePolygonCentroid();
            private calculateBoundingRect();
            /**
             * Check if point exist inside polygon shape.
             *
             * @return true/false if point exist inside shape.
             * ray-casting algorithm based on:
             * http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
             */
            private inside(point);
            /**
             * Checks if a line (presented as two points) intersects with a another line
             */
            private getLineIntersection(line0p1, line0p2, line1p1, line1p2);
            private convertArrayPathToPoints(path);
        }
        module Point {
            function offset(point: IPoint, offsetX: number, offsetY: number): IPoint;
            function equals(point: IPoint, other: IPoint): boolean;
            function clone(point: IPoint): IPoint;
            function toString(point: IPoint): string;
            function serialize(point: IPoint): string;
            function getDistance(point: IPoint, other: IPoint): number;
            function equalWithPrecision(point1: IPoint, point2: IPoint): boolean;
            function parsePoint(value: any, defaultValue?: IPoint): IPoint;
        }
        module Size {
            function isEmpty(size: ISize): boolean;
            function equals(size: ISize, other: ISize): boolean;
            function clone(size: ISize): ISize;
            function inflate(size: ISize, padding: IThickness): ISize;
            function deflate(size: ISize, padding: IThickness): ISize;
            function combine(size: ISize, other: ISize): ISize;
            function toRect(size: ISize): IRect;
            function toString(size: ISize): string;
            function equal(size1: ISize, size2: ISize): boolean;
            function equalWithPrecision(size1: ISize, size2: ISize): boolean;
            function parseSize(value: any, defaultValue?: ISize): ISize;
        }
        module Rect {
            function getOffset(rect: IRect): IPoint;
            function getSize(rect: IRect): ISize;
            function setSize(rect: IRect, value: ISize): void;
            function right(rect: IRect): number;
            function bottom(rect: IRect): number;
            function topLeft(rect: IRect): IPoint;
            function topRight(rect: IRect): IPoint;
            function bottomLeft(rect: IRect): IPoint;
            function bottomRight(rect: IRect): IPoint;
            function equals(rect: IRect, other: IRect): boolean;
            function clone(rect: IRect): IRect;
            function toString(rect: IRect): string;
            function offset(rect: IRect, offsetX: number, offsetY: number): IRect;
            function inflate(rect: IRect, padding: IThickness): IRect;
            function deflate(rect: IRect, padding: IThickness): IRect;
            function inflateBy(rect: IRect, padding: number): IRect;
            function deflateBy(rect: IRect, padding: number): IRect;
            /**
             * Get closest point.
             *
             * @return the closest point on the rect to the (x,y) point given.
             * In case the (x,y) given is inside the rect, (x,y) will be returned.
             * Otherwise, a point on a border will be returned.
             */
            function getClosestPoint(rect: IRect, x: number, y: number): IPoint;
            function equal(rect1: IRect, rect2: IRect): boolean;
            function equalWithPrecision(rect1: IRect, rect2: IRect): boolean;
            function isEmpty(rect: IRect): boolean;
            function containsPoint(rect: IRect, point: IPoint): boolean;
            function isIntersecting(rect1: IRect, rect2: IRect): boolean;
            function intersect(rect1: IRect, rect2: IRect): IRect;
            function combine(rect1: IRect, rect2: IRect): IRect;
            function parseRect(value: any, defaultValue?: IRect): IRect;
            function getCentroid(rect: IRect): IPoint;
        }
        module Thickness {
            function inflate(thickness: IThickness, other: IThickness): IThickness;
            function getWidth(thickness: IThickness): number;
            function getHeight(thickness: IThickness): number;
            function clone(thickness: IThickness): IThickness;
            function equals(thickness: IThickness, other: IThickness): boolean;
            function flipHorizontal(thickness: IThickness): void;
            function flipVertical(thickness: IThickness): void;
            function toString(thickness: IThickness): string;
            function toCssString(thickness: IThickness): string;
            function isEmpty(thickness: IThickness): boolean;
            function equal(thickness1: IThickness, thickness2: IThickness): boolean;
            function equalWithPrecision(thickness1: IThickness, thickness2: IThickness): boolean;
            function parseThickness(value: any, defaultValue?: IThickness, resetValue?: any): IThickness;
        }
        module Vector {
            function isEmpty(vector: IVector): boolean;
            function equals(vector: IVector, other: IPoint): boolean;
            function clone(vector: IVector): IVector;
            function toString(vector: IVector): string;
            function getLength(vector: IVector): number;
            function getLengthSqr(vector: IVector): number;
            function scale(vector: IVector, scalar: number): IVector;
            function normalize(vector: IVector): IVector;
            function rotate90DegCW(vector: IVector): IVector;
            function rotate90DegCCW(vector: IVector): IVector;
            function rotate(vector: IVector, angle: number): IVector;
            function equal(vector1: IVector, vector2: IVector): boolean;
            function equalWithPrecision(vector1: IVector, vector2: IVector): boolean;
            function add(vect1: IVector, vect2: IVector): IVector;
            function subtract(vect1: IVector, vect2: IVector): IVector;
            function dotProduct(vect1: IVector, vect2: IVector): number;
            function getDeltaVector(p0: IPoint, p1: IPoint): IVector;
        }
    }
}

declare module powerbi.visuals {
    import SQExpr = powerbi.data.SQExpr;
    import SemanticFilter = powerbi.data.SemanticFilter;
    /** Utility class for slicer*/
    module SlicerUtil {
        /** CSS selectors for slicer elements. */
        module Selectors {
            const HeaderContainer: jsCommon.CssConstants.ClassAndSelector;
            const Header: jsCommon.CssConstants.ClassAndSelector;
            const TitleHeader: jsCommon.CssConstants.ClassAndSelector;
            const HeaderText: jsCommon.CssConstants.ClassAndSelector;
            const Body: jsCommon.CssConstants.ClassAndSelector;
            const Label: jsCommon.CssConstants.ClassAndSelector;
            const LabelText: jsCommon.CssConstants.ClassAndSelector;
            const LabelImage: jsCommon.CssConstants.ClassAndSelector;
            const CountText: jsCommon.CssConstants.ClassAndSelector;
            const Clear: jsCommon.CssConstants.ClassAndSelector;
            const SearchHeader: jsCommon.CssConstants.ClassAndSelector;
            const SearchInput: jsCommon.CssConstants.ClassAndSelector;
            const SearchHeaderCollapsed: jsCommon.CssConstants.ClassAndSelector;
            const SearchHeaderShow: jsCommon.CssConstants.ClassAndSelector;
            const MultiSelectEnabled: jsCommon.CssConstants.ClassAndSelector;
        }
        /** Const declarations*/
        module DisplayNameKeys {
            const Clear: string;
            const SelectAll: string;
            const Search: string;
        }
        /** Helper class for slicer settings  */
        module SettingsHelper {
            function areSettingsDefined(data: SlicerData): boolean;
        }
        /** Helper class for handling slicer default value  */
        module DefaultValueHandler {
            function getIdentityFields(dataView: DataView): SQExpr[];
        }
        function getContainsFilter(expr: SQExpr, containsText: string): SemanticFilter;
        function tryRemoveValueFromRetainedList(value: DataViewScopeIdentity, selectedScopeIds: DataViewScopeIdentity[], caseInsensitive?: boolean): boolean;
        function getUpdatedSelfFilter(searchKey: string, metaData: DataViewMetadata): data.SemanticFilter;
        /** Helper class for creating and measuring slicer DOM elements  */
        class DOMHelper {
            private static SearchInputHeight;
            createSlicerHeader(hostServices: IVisualHostServices): HTMLElement;
            getHeaderTextProperties(settings: SlicerSettings): TextProperties;
            getSlicerBodyViewport(currentViewport: IViewport, settings: SlicerSettings, headerTextProperties: TextProperties): IViewport;
            updateSlicerBodyDimensions(currentViewport: IViewport, slicerBody: D3.Selection, settings: SlicerSettings): void;
            getHeaderHeight(settings: SlicerSettings, textProperties: TextProperties): number;
            getRowHeight(settings: SlicerSettings, textProperties: TextProperties): number;
            styleSlicerHeader(slicerHeader: D3.Selection, settings: SlicerSettings, headerText: string): void;
            setSlicerTextStyle(slicerText: D3.Selection, settings: SlicerSettings): void;
            getRowsOutlineWidth(outlineElement: string, outlineWeight: number): number;
            private setSlicerHeaderTextStyle(slicerHeader, headerTextElement, settings, searchEnabled);
            private calculateSlicerTextHighlightColor(color);
            private getTextProperties(textSize, textProperties);
        }
    }
}

declare module powerbi.visuals {
    /**
     * Contains functions/constants to aid in adding tooltips.
     */
    module tooltipUtils {
        function tooltipUpdate(selection: D3.Selection, tooltips: string[]): void;
    }
}

declare module powerbi.visuals {
    /**
     * Contains functions/constants to aid in SVG manupilation.
     */
    module SVGUtil {
        /**
         * Very small values, when stringified, may be converted to scientific notation and cause a temporarily
         * invalid attribute or style property value.
         * For example, the number 0.0000001 is converted to the string "1e-7".
         * This is particularly noticeable when interpolating opacity values.
         * To avoid scientific notation, start or end the transition at 1e-6,
         * which is the smallest value that is not stringified in exponential notation.
         */
        const AlmostZero: number;
        /**
         * Creates a translate string for use with the SVG transform call.
         */
        function translate(x: number, y: number): string;
        /**
         * Creates a translateX string for use with the SVG transform call.
         */
        function translateXWithPixels(x: number): string;
        function translateWithPixels(x: number, y: number): string;
        /**
         * Creates a translate + rotate string for use with the SVG transform call.
         */
        function translateAndRotate(x: number, y: number, px: number, py: number, angle: number): string;
        /**
         * Creates a scale string for use in a CSS transform property.
         */
        function scale(scale: number): string;
        /**
         * Creates a translate + scale string for use with the SVG transform call.
         */
        function translateAndScale(x: number, y: number, ratio: number): string;
        /**
         * Creates a transform origin string for use in a CSS transform-origin property.
         */
        function transformOrigin(xOffset: string, yOffset: string): string;
        /**
         * Forces all D3 transitions to complete.
         * Normally, zero-delay transitions are executed after an instantaneous delay (<10ms).
         * This can cause a brief flicker if the browser renders the page twice: once at the end of the first event loop,
         * then again immediately on the first timer callback. By flushing the timer queue at the end of the first event loop,
         * you can run any zero-delay transitions immediately and avoid the flicker.
         *
         * These flickers are noticable on IE, and with a large number of webviews(not recommend you ever do this) on iOS.
         */
        function flushAllD3Transitions(): void;
        /**
         * Wrapper for flushAllD3Transitions.
         */
        function flushAllD3TransitionsIfNeeded(options: VisualInitOptions | AnimationOptions): void;
        /**
         * There is a known bug in IE10 that causes cryptic crashes for SVG elements with a null 'd' attribute:
         * https://github.com/mbostock/d3/issues/1737
         */
        function ensureDAttribute(pathElement: D3.D3Element): void;
        /**
         * In IE10, it is possible to return SVGPoints with NaN members.
         */
        function ensureValidSVGPoint(point: SVGPoint): void;
        /**
         * Parse the Transform string with value 'translate(x,y)'.
         * In Chrome for the translate(position) string the delimiter
         * is a comma and in IE it is a spaceso checking for both.
         */
        function parseTranslateTransform(input: string): {
            x: string;
            y: string;
        };
        /**
         * Create an arrow.
         */
        function createArrow(width: number, height: number, rotate: number): {
            path: string;
            transform: string;
        };
        /**
         * Use the ratio of the scaled bounding rect and the SVG DOM bounding box to get the x and y transform scale values
         * @deprecated This function is unreliable across browser implementations, prefer to use SVGScaleDetector if needed.
         */
        function getTransformScaleRatios(svgElement: SVGSVGElement): Point;
    }
    class SVGScaleDetector {
        private scaleDetectorElement;
        constructor(svgElement: D3.Selection);
        getScale(): Point;
    }
}

declare module powerbi.visuals {
    /**
     * Contains functions/constants to aid in text manupilation.
     */
    module TextUtil {
        /**
         * Remove breaking spaces from given string and replace by none breaking space (&nbsp).
         */
        function removeBreakingSpaces(str: string): string;
        /**
         * Remove ellipses from a given string
         */
        function removeEllipses(str: string): string;
        /**
        * Replace every whitespace (0x20) with Non-Breaking Space (0xA0)
         * @param {string} txt String to replace White spaces
         * @returns Text after replcing white spaces
         */
        function replaceSpaceWithNBSP(txt: string): string;
    }
}

declare module powerbi.visuals {
    interface GradientSettings {
        diverging: boolean;
        minColor: any;
        midColor?: any;
        maxColor: any;
        minValue?: number;
        midValue?: number;
        maxValue?: number;
    }
    module GradientUtils {
        import DataViewObjectPropertyDefinition = powerbi.data.DataViewObjectPropertyDefinition;
        function getFillRuleRole(objectDescs: powerbi.data.DataViewObjectDescriptors): string;
        function shouldShowGradient(visualConfig: any): boolean;
        function getUpdatedGradientSettings(gradientObject: data.DataViewObjectDefinitions): GradientSettings;
        function getGradientMeasureIndex(dataViewCategorical: DataViewCategorical): number;
        function getGradientValueColumn(dataViewCategorical: DataViewCategorical): DataViewValueColumn;
        function hasGradientRole(dataViewCategorical: DataViewCategorical): boolean;
        function getDefaultGradientSettings(): GradientSettings;
        function getDefaultFillRuleDefinition(): DataViewObjectPropertyDefinition;
        function updateFillRule(propertyName: string, propertyValue: any, definitions: powerbi.data.DataViewObjectDefinitions): void;
        function getGradientSettings(baseFillRule: FillRuleDefinition): GradientSettings;
        function getFillRule(objectDefinitions: data.DataViewObjectDefinitions): FillRuleDefinition;
        function getGradientSettingsFromRule(fillRule: FillRuleDefinition): GradientSettings;
        /** Returns a string representing the gradient to be used for the GradientBar directive. */
        function getGradientBarColors(gradientSettings: GradientSettings): string;
    }
}

declare module powerbi.visuals {
    interface VisualBackground {
        image?: ImageValue;
        transparency?: number;
    }
    module visualBackgroundHelper {
        function getDefaultColor(): string;
        function getDefaultTransparency(): number;
        function getDefaultShow(): boolean;
        function getDefaultValues(): {
            color: string;
            transparency: number;
            show: boolean;
        };
        function enumeratePlot(enumeration: ObjectEnumerationBuilder, background: VisualBackground): void;
        function renderBackgroundImage(background: VisualBackground, visualElement: JQuery, layout: Rect): void;
    }
}

declare module powerbi.visuals {
    /**
     * A helper class for building a VisualObjectInstanceEnumerationObject:
     * - Allows call chaining (e.g., builder.pushInstance({...}).pushInstance({...})
     * - Allows creating of containers (via pushContainer/popContainer)
     */
    class ObjectEnumerationBuilder {
        private instances;
        private containers;
        private containerIdx;
        pushInstance(instance: VisualObjectInstance): ObjectEnumerationBuilder;
        pushContainer(container: VisualObjectInstanceContainer): ObjectEnumerationBuilder;
        popContainer(): ObjectEnumerationBuilder;
        complete(): VisualObjectInstanceEnumerationObject;
        private canMerge(x, y);
        private extend(target, source, propertyName);
        static merge(x: VisualObjectInstanceEnumeration, y: VisualObjectInstanceEnumeration): VisualObjectInstanceEnumerationObject;
        static normalize(x: VisualObjectInstanceEnumeration): VisualObjectInstanceEnumerationObject;
        static getContainerForInstance(enumeration: VisualObjectInstanceEnumerationObject, instance: VisualObjectInstance): VisualObjectInstanceContainer;
    }
}

declare module powerbi.visuals {
    /** Helper class for Visual border styles */
    module VisualBorderUtil {
        /**
         * Gets The Boder Width string (e.g. 0px 1px 2px 3px)
         * @param {OutlineType} string Type of the Outline, one of Visuals.outline.<XX> const strings
         * @param {number} outlineWeight Weight of the outline in pixels
         * @returns String representing the Border Width
         */
        function getBorderWidth(outlineType: string, outlineWeight: number): string;
    }
}

declare module powerbi.visuals {
    interface I2DTransformMatrix {
        m00: number;
        m01: number;
        m02: number;
        m10: number;
        m11: number;
        m12: number;
    }
    /** Transformation matrix math wrapper */
    class Transform {
        private _inverse;
        matrix: I2DTransformMatrix;
        constructor(m?: I2DTransformMatrix);
        applyToPoint(point: IPoint): IPoint;
        applyToRect(rect: Rect): IRect;
        translate(xOffset: number, yOffset: number): void;
        scale(xScale: number, yScale: number): void;
        rotate(angleInRadians: number): void;
        add(other: Transform): void;
        getInverse(): Transform;
    }
    function createTranslateMatrix(xOffset: number, yOffset: number): I2DTransformMatrix;
    function createScaleMatrix(xScale: number, yScale: number): I2DTransformMatrix;
    function createRotationMatrix(angleInRads: number): I2DTransformMatrix;
    function createInverseMatrix(m: I2DTransformMatrix): I2DTransformMatrix;
}

declare module powerbi.visuals {
    interface TrendLine {
        points: IPoint[];
        show: boolean;
        displayName: string;
        lineColor: Fill;
        transparency: number;
        style: string;
        combineSeries: boolean;
        useHighlightValues: boolean;
        y2Axis: boolean;
    }
    module TrendLineHelper {
        const defaults: {
            lineColor: Fill;
            lineStyle: string;
            transparency: number;
            combineSeries: boolean;
            useHighlightValues: boolean;
        };
        function enumerateObjectInstances(enumeration: ObjectEnumerationBuilder, trendLines: TrendLine[]): void;
        function isDataViewForRegression(dataView: DataView): boolean;
        function readDataView(dataView: DataView, sourceDataView: DataView, y2: boolean, colors: IDataColorPalette): TrendLine[];
        function darkenTrendLineColor(color: string): string;
        function render(trendLines: TrendLine[], graphicsContext: D3.Selection, axes: CartesianAxisProperties, viewport: IViewport): void;
    }
}

declare module powerbi.visuals {
    module visibilityHelper {
        /**  Helper method that uses jQuery :visible selector to determine if visual is visible.
            Elements are considered visible if they consume space in the document. Visible elements have a width or height that is greater than zero.
            Elements with visibility: hidden or opacity: 0 are considered visible, since they still consume space in the layout.
        */
        function partiallyVisible(element: JQuery): boolean;
    }
}

declare module powerbi {
    module VisualObjectRepetition {
        /** Determines whether two repetitions are equal. */
        function equals(x: VisualObjectRepetition, y: VisualObjectRepetition): boolean;
    }
}
declare module powerbi.visuals {
    interface PointWithError {
        point: IPoint;
        upperBound: IPoint;
        lowerBound: IPoint;
    }
    interface Forecast {
        id: string;
        points: PointWithError[];
        show: boolean;
        lineColor: Fill;
        confidenceBandStyle: string;
        transparency: number;
        style: string;
    }
    module ForecastHelper {
        const defaults: {
            lineColor: Fill;
            confidenceBandStyle: string;
            transparency: number;
            style: string;
        };
        function enumerateObjectInstances(enumeration: ObjectEnumerationBuilder, forecast: Forecast): void;
        function isDataViewForForecast(dataView: DataView): boolean;
        function readDataView(dataView: DataView, sourceDataView: DataView, colors: IDataColorPalette): Forecast;
        function render(forecastLine: Forecast, graphicsContext: D3.Selection, axes: CartesianAxisProperties, viewport: IViewport, animator: IGenericAnimator, suppressAnimations: boolean): void;
    }
}

declare module powerbi.visuals {
    /** Helper module for converting a DataView into SlicerData. */
    module DataConversion {
        function convert(dataView: DataView, localizedSelectAllText: string, interactivityService: IInteractivityService | ISelectionHandler, hostServices: IVisualHostServices): SlicerData;
    }
}

declare module powerbi {
    import shapes = powerbi.visuals.shapes;
    import IRect = powerbi.visuals.IRect;
    /** Defines possible content positions.  */
    const enum ContentPositions {
        /** Content position is not defined. */
        None = 0,
        /** Content aligned top left. */
        TopLeft = 1,
        /** Content aligned top center. */
        TopCenter = 2,
        /** Content aligned top right. */
        TopRight = 4,
        /** Content aligned middle left. */
        MiddleLeft = 8,
        /** Content aligned middle center. */
        MiddleCenter = 16,
        /** Content aligned middle right. */
        MiddleRight = 32,
        /** Content aligned bottom left. */
        BottomLeft = 64,
        /** Content aligned bottom center. */
        BottomCenter = 128,
        /** Content aligned bottom right. */
        BottomRight = 256,
        /** Content is placed inside the bounding rectangle in the center. */
        InsideCenter = 512,
        /** Content is placed inside the bounding rectangle at the base. */
        InsideBase = 1024,
        /** Content is placed inside the bounding rectangle at the end. */
        InsideEnd = 2048,
        /** Content is placed outside the bounding rectangle at the base. */
        OutsideBase = 4096,
        /** Content is placed outside the bounding rectangle at the end. */
        OutsideEnd = 8192,
        /** Content supports all possible positions. */
        All = 16383,
    }
    /**
    * Rectangle orientation. Rectangle orientation is used to define vertical or horizontal orientation
    * and starting/ending side of the rectangle.
    */
    enum RectOrientation {
        /** Rectangle with no specific orientation. */
        None = 0,
        /** Vertical rectangle with base at the bottom. */
        VerticalBottomTop = 1,
        /** Vertical rectangle with base at the top. */
        VerticalTopBottom = 2,
        /** Horizontal rectangle with base at the left. */
        HorizontalLeftRight = 3,
        /** Horizontal rectangle with base at the right. */
        HorizontalRightLeft = 4,
    }
    /**
    * Defines if panel elements are allowed to be positioned
    * outside of the panel boundaries.
    */
    enum OutsidePlacement {
        /** Elements can be positioned outside of the panel. */
        Allowed = 0,
        /** Elements can not be positioned outside of the panel. */
        Disallowed = 1,
        /** Elements can be partially outside of the panel. */
        Partial = 2,
    }
    /**
    * Defines an interface for information needed for default label positioning. Used in DataLabelsPanel.
    * Note the question marks: none of the elements are mandatory.
    */
    interface IDataLabelSettings {
        /** Distance from the anchor point. */
        anchorMargin?: number;
        /** Orientation of the anchor rectangle. */
        anchorRectOrientation?: RectOrientation;
        /** Preferable position for the label.  */
        contentPosition?: ContentPositions;
        /** Defines the rules if the elements can be positioned outside panel bounds. */
        outsidePlacement?: OutsidePlacement;
        /** Defines the valid positions if repositionOverlapped is true. */
        validContentPositions?: ContentPositions;
        /** Defines maximum moving distance to reposition an element. */
        minimumMovingDistance?: number;
        /** Defines minimum moving distance to reposition an element. */
        maximumMovingDistance?: number;
        /** Opacity effect of the label. Use it for dimming.  */
        opacity?: number;
    }
    /**
    * Defines an interface for information needed for label positioning.
    * None of the elements are mandatory, but at least anchorPoint OR anchorRect is needed.
    */
    interface IDataLabelInfo extends IDataLabelSettings {
        /** The point to which label is anchored.  */
        anchorPoint?: shapes.IPoint;
        /** The rectangle to which label is anchored. */
        anchorRect?: IRect;
        /** Disable label rendering and processing. */
        hideLabel?: boolean;
        /**
        * Defines the visibility rank. This will not be processed by arrange phase,
        * but can be used for preprocessing the hideLabel value.
        */
        visibilityRank?: number;
        /** Defines the starting offset from AnchorRect. */
        offset?: number;
        /** Defines the callout line data. It is calculated and used during processing. */
        callout?: {
            start: shapes.IPoint;
            end: shapes.IPoint;
        };
        /** Source of the label. */
        source?: any;
        size?: shapes.ISize;
    }
    /**  Interface for label rendering. */
    interface IDataLabelRenderer {
        renderLabelArray(labels: IArrangeGridElementInfo[]): void;
    }
    /** Interface used in internal arrange structures. */
    interface IArrangeGridElementInfo {
        element: IDataLabelInfo;
        rect: IRect;
    }
    /**
    * Arranges label elements using the anchor point or rectangle. Collisions
    * between elements can be automatically detected and as a result elements
    * can be repositioned or get hidden.
    */
    class DataLabelManager {
        movingStep: number;
        hideOverlapped: boolean;
        static DefaultAnchorMargin: number;
        static DefaultMaximumMovingDistance: number;
        static DefaultMinimumMovingDistance: number;
        static InflateAmount: number;
        private defaultDataLabelSettings;
        defaultSettings: IDataLabelSettings;
        /** Arranges the lables position and visibility*/
        hideCollidedLabels(viewport: IViewport, data: any[], layout: any, addTransform?: boolean): powerbi.visuals.LabelEnabledDataPoint[];
        /**
         * Merges the label element info with the panel element info and returns correct label info.
         * @param source The label info.
         */
        getLabelInfo(source: IDataLabelInfo): IDataLabelInfo;
        /**
        * (Private) Calculates element position using anchor point..
        */
        private calculateContentPositionFromPoint(anchorPoint, contentPosition, contentSize, offset);
        /** (Private) Calculates element position using anchor rect. */
        private calculateContentPositionFromRect(anchorRect, anchorRectOrientation, contentPosition, contentSize, offset);
        /** (Private) Calculates element inside center position using anchor rect. */
        private handleInsideCenterPosition(anchorRectOrientation, contentSize, anchorRect, offset);
        /** (Private) Calculates element inside end position using anchor rect. */
        private handleInsideEndPosition(anchorRectOrientation, contentSize, anchorRect, offset);
        /** (Private) Calculates element inside base position using anchor rect. */
        private handleInsideBasePosition(anchorRectOrientation, contentSize, anchorRect, offset);
        /** (Private) Calculates element outside end position using anchor rect. */
        private handleOutsideEndPosition(anchorRectOrientation, contentSize, anchorRect, offset);
        /** (Private) Calculates element outside base position using anchor rect. */
        private handleOutsideBasePosition(anchorRectOrientation, contentSize, anchorRect, offset);
        /**  (Private) Calculates element position. */
        private calculateContentPosition(anchoredElementInfo, contentPosition, contentSize, offset);
        /** (Private) Check for collisions. */
        private hasCollisions(arrangeGrid, info, position, size);
        static isValid(rect: IRect): boolean;
    }
    /**
    * Utility class to speed up the conflict detection by collecting the arranged items in the DataLabelsPanel.
    */
    class DataLabelArrangeGrid {
        private grid;
        private cellSize;
        private rowCount;
        private colCount;
        private static ARRANGEGRID_MIN_COUNT;
        private static ARRANGEGRID_MAX_COUNT;
        /**
         * Creates new ArrangeGrid.
         * @param size The available size
         */
        constructor(size: shapes.ISize, elements: any[], layout: powerbi.visuals.ILabelLayout);
        /**
         * Register a new label element.
         * @param element The label element to register.
         * @param rect The label element position rectangle.
         */
        add(element: IDataLabelInfo, rect: IRect): void;
        /**
         * Checks for conflict of given rectangle in registered elements.
         * @param rect The rectengle to check.
         * @return True if conflict is detected.
         */
        hasConflict(rect: IRect): boolean;
        /**
         * Calculates the number of rows or columns in a grid
         * @param step is the largest label size (width or height)
         * @param length is the grid size (width or height)
         * @param minCount is the minimum allowed size
         * @param maxCount is the maximum allowed size
         * @return the number of grid rows or columns
         */
        private getGridRowColCount(step, length, minCount, maxCount);
        /**
         * Returns the grid index of a given recangle
         * @param rect The rectengle to check.
         * @return grid index as a thickness object.
         */
        private getGridIndexRect(rect);
    }
}

declare module powerbi {
    import shapes = powerbi.visuals.shapes;
    import ISize = shapes.ISize;
    import IRect = powerbi.visuals.IRect;
    import IPoint = shapes.IPoint;
    import SelectableDataPoint = powerbi.visuals.SelectableDataPoint;
    /**
     * Defines possible data label positions relative to rectangles
     */
    const enum RectLabelPosition {
        /** Position is not defined. */
        None = 0,
        /** Content is placed inside the parent rectangle in the center. */
        InsideCenter = 1,
        /** Content is placed inside the parent rectangle at the base. */
        InsideBase = 2,
        /** Content is placed inside the parent rectangle at the end. */
        InsideEnd = 4,
        /** Content is placed outside the parent rectangle at the base. */
        OutsideBase = 8,
        /** Content is placed outside the parent rectangle at the end. */
        OutsideEnd = 16,
        /** Content supports all possible positions. */
        All = 31,
        /** Content supports positions inside the rectangle */
        InsideAll = 7,
    }
    /**
     * Defines possible data label positions relative to points or circles
     */
    const enum NewPointLabelPosition {
        /** Position is not defined. */
        None = 0,
        Above = 1,
        Below = 2,
        Left = 4,
        Right = 8,
        BelowRight = 16,
        BelowLeft = 32,
        AboveRight = 64,
        AboveLeft = 128,
        Center = 256,
        All = 511,
    }
    /**
     * Rectangle orientation, defined by vertical vs horizontal and which direction
     * the "base" is at.
     */
    const enum NewRectOrientation {
        /** Rectangle with no specific orientation. */
        None = 0,
        /** Vertical rectangle with base at the bottom. */
        VerticalBottomBased = 1,
        /** Vertical rectangle with base at the top. */
        VerticalTopBased = 2,
        /** Horizontal rectangle with base at the left. */
        HorizontalLeftBased = 3,
        /** Horizontal rectangle with base at the right. */
        HorizontalRightBased = 4,
    }
    const enum LabelDataPointParentType {
        Point = 0,
        Rectangle = 1,
        Polygon = 2,
    }
    interface LabelParentRect {
        /** The rectangle this data label belongs to */
        rect: IRect;
        /** The orientation of the parent rectangle */
        orientation: NewRectOrientation;
        /** Valid positions to place the label ordered by preference */
        validPositions: RectLabelPosition[];
    }
    interface LabelParentPoint {
        /** The point this data label belongs to */
        point: IPoint;
        /** The radius of the point to be added to the offset (for circular geometry) */
        radius: number;
        /** Valid positions to place the label ordered by preference */
        validPositions: NewPointLabelPosition[];
    }
    interface LabelDataPoint {
        /** The measured size of the text */
        textSize: ISize;
        /** Is data label preferred? Preferred labels will be rendered first */
        isPreferred: boolean;
        /** Whether the parent type is a rectangle, point or polygon */
        parentType: LabelDataPointParentType;
        /** The parent geometry for the data label */
        parentShape: LabelParentRect | LabelParentPoint | LabelParentPolygon;
        /** Whether or not the label has a background */
        hasBackground?: boolean;
        /** Text to be displayed in the label */
        text: string;
        /** A text that represent the label tooltip */
        tooltip?: string;
        /** Color to use for the data label if drawn inside */
        insideFill: string;
        /** Color to use for the data label if drawn outside */
        outsideFill: string;
        /** The identity of the data point associated with the data label */
        identity: powerbi.visuals.SelectionId;
        /** The key of the data point associated with the data label (used if identity is not unique to each expected label) */
        key?: string;
        /** The font size of the data point associated with the data label */
        fontSize?: number;
        /** Second row of text to be displayed in the label, for additional information */
        secondRowText?: string;
        /** The calculated weight of the data point associated with the data label */
        weight?: number;
        /** Whether or not the data label has been rendered */
        hasBeenRendered?: boolean;
        /** Size of the label adjusted for the background, if necessary */
        labelSize?: ISize;
    }
    interface LabelDataPointGroup {
        labelDataPoints: LabelDataPoint[];
        maxNumberOfLabels: number;
    }
    interface Label extends SelectableDataPoint {
        /** Text to be displayed in the label */
        text: string;
        /** Second row of text to be displayed in the label */
        secondRowText?: string;
        /** The bounding box for the label */
        boundingBox: IRect;
        /** Whether or not the data label should be rendered */
        isVisible: boolean;
        /** The fill color of the data label */
        fill: string;
        /** A unique key for data points (used if key cannot be obtained from the identity) */
        key?: string;
        /** The text size of the data label */
        fontSize?: number;
        /** A text anchor used to override the default label text-anchor (middle) */
        textAnchor?: string;
        /** points for reference line rendering */
        leaderLinePoints?: number[][];
        /** Whether or not the label has a background (and text position needs to be adjusted to take that into account) */
        hasBackground: boolean;
        /** A text that represent the label tooltip */
        tooltip?: string;
    }
    interface GridSubsection {
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
    }
    class LabelArrangeGrid {
        private grid;
        private viewport;
        private cellSize;
        private columnCount;
        private rowCount;
        /**
         * A multiplier applied to the largest width height to attempt to balance # of
         * labels in each cell and number of cells each label belongs to
         */
        private static cellSizeMultiplier;
        constructor(labelDataPointsGroups: LabelDataPointGroup[], viewport: IViewport);
        /**
         * Add a rectangle to check collision against
         */
        add(rect: IRect): void;
        /**
         * Check whether the rect conflicts with the grid, either bleeding outside the
         * viewport or colliding with another rect added to the grid.
         */
        hasConflict(rect: IRect): boolean;
        /**
         * Attempt to position the given rect within the viewport.  Returns
         * the adjusted rectangle or null if the rectangle couldn't fit,
         * conflicts with the viewport, or is too far outside the viewport
         */
        tryPositionInViewport(rect: IRect): IRect;
        /**
         * Checks for a collision between the given rect and others in the grid.
         * Returns true if there is a collision.
         */
        private hasCollision(rect);
        /**
         * Check to see if the given rect is inside the grid's viewport
         */
        private isWithinGridViewport(rect);
        /**
         * Checks to see if the rect is close enough to the viewport to be moved inside.
         * "Close" here is determined by the distance between the edge of the viewport
         * and the closest edge of the rect; if that distance is less than the appropriate
         * dimension of the rect, we will reposition the rect.
         */
        private isCloseToGridViewport(rect);
        /**
         * Attempt to move the rect inside the grid's viewport.  Returns the resulting
         * rectangle with the same width/height adjusted to be inside the viewport or
         * null if it couldn't fit regardless.
         */
        private tryMoveInsideViewport(rect);
        private getContainingGridSubsection(rect);
        private static getCellCount(step, length, minCount, maxCount);
        private static bound(value, min, max);
    }
    interface DataLabelLayoutOptions {
        /** The amount of offset to start with when the data label is not centered */
        startingOffset: number;
        /** Maximum distance labels will be offset by */
        maximumOffset: number;
        /** The amount to increase the offset each attempt while laying out labels */
        offsetIterationDelta?: number;
        /** Horizontal padding used for checking whether a label is inside a parent shape */
        horizontalPadding?: number;
        /** Vertical padding used for checking whether a label is inside a parent shape */
        verticalPadding?: number;
        /** Should we draw reference lines in case the label offset is greater then the default */
        allowLeaderLines?: boolean;
        /** Should the layout system attempt to move the label inside the viewport when it outside, but close */
        attemptToMoveLabelsIntoViewport?: boolean;
    }
    class LabelLayout {
        /** Maximum distance labels will be offset by */
        private maximumOffset;
        /** The amount to increase the offset each attempt while laying out labels */
        private offsetIterationDelta;
        /** The amount of offset to start with when the data label is not centered */
        private startingOffset;
        /** Padding used for checking whether a label is inside a parent shape */
        private horizontalPadding;
        /** Padding used for checking whether a label is inside a parent shape */
        private verticalPadding;
        /** Should we draw leader lines in case the label offset is greater then the default */
        private allowLeaderLines;
        /** Should the layout system attempt to move the label inside the viewport when it outside, but close */
        private attemptToMoveLabelsIntoViewport;
        private static defaultOffsetIterationDelta;
        private static defaultHorizontalPadding;
        private static defaultVerticalPadding;
        constructor(options: DataLabelLayoutOptions);
        /**
         * Arrange takes a set of data labels and lays them out in order, assuming that
         * the given array has already been sorted with the most preferred labels at the
         * front, taking into considiration a maximum number of labels that are alowed
         * to display.
         *
         * Details:
         * - We iterate over offsets from the target position, increasing from 0 while
         *      verifiying the maximum number of labels to display hasn't been reached
         * - For each offset, we iterate over each data label
         * - For each data label, we iterate over each position that is valid for
         *     both the specific label and this layout
         * - When a valid position is found, we position the label there and no longer
         *     reposition it.
         * - This prioritizes the earlier labels to be positioned closer to their
         *     target points in the position they prefer.
         * - This prioritizes putting data labels close to a valid position over
         *     placing them at their preferred position (it will place it at a less
         *     preferred position if it will be a smaller offset)
         */
        layout(labelDataPointsGroups: LabelDataPointGroup[], viewport: IViewport): Label[];
        private positionDataLabels(labelDataPoints, viewport, grid, maxLabelsToRender);
        private tryPositionForRectPositions(labelPoint, grid, currentLabelOffset, currentCenteredLabelOffset);
        /**
         * Tests a particular position/offset combination for the given data label.
         * If the label can be placed, returns the resulting bounding box for the data
         * label.  If not, returns null.
         */
        private static tryPositionRect(grid, position, labelDataPoint, offset, centerOffset, adjustForViewport);
        private tryPositionForPointPositions(labelPoint, grid, currentLabelOffset, drawLeaderLines);
        private static tryPositionPoint(grid, position, labelDataPoint, offset, adjustForViewport);
    }
    /**
     * (Private) Contains methods for calculating the bounding box of a data label
     */
    module DataLabelRectPositioner {
        function getLabelRect(labelDataPoint: LabelDataPoint, position: RectLabelPosition, offset: number): IRect;
        function canFitWithinParent(labelDataPoint: LabelDataPoint, horizontalPadding: number, verticalPadding: number): boolean;
        function isLabelWithinParent(labelRect: IRect, labelPoint: LabelDataPoint, horizontalPadding: number, verticalPadding: number): boolean;
        function topInside(labelSize: ISize, parentRect: IRect, offset: number): IRect;
        function bottomInside(labelSize: ISize, parentRect: IRect, offset: number): IRect;
        function rightInside(labelSize: ISize, parentRect: IRect, offset: number): IRect;
        function leftInside(labelSize: ISize, parentRect: IRect, offset: number): IRect;
        function topOutside(labelSize: ISize, parentRect: IRect, offset: number): IRect;
        function bottomOutside(labelSize: ISize, parentRect: IRect, offset: number): IRect;
        function rightOutside(labelSize: ISize, parentRect: IRect, offset: number): IRect;
        function leftOutside(labelSize: ISize, parentRect: IRect, offset: number): IRect;
        function middleHorizontal(labelSize: ISize, parentRect: IRect, offset: number): IRect;
        function middleVertical(labelSize: ISize, parentRect: IRect, offset: number): IRect;
    }
    module DataLabelPointPositioner {
        const cos45: number;
        const sin45: number;
        function getLabelRect(labelSize: ISize, parentPoint: LabelParentPoint, position: NewPointLabelPosition, offset: number): IRect;
        function above(labelSize: ISize, parentPoint: IPoint, offset: number): IRect;
        function below(labelSize: ISize, parentPoint: IPoint, offset: number): IRect;
        function left(labelSize: ISize, parentPoint: IPoint, offset: number): IRect;
        function right(labelSize: ISize, parentPoint: IPoint, offset: number): IRect;
        function belowLeft(labelSize: ISize, parentPoint: IPoint, offset: number): IRect;
        function belowRight(labelSize: ISize, parentPoint: IPoint, offset: number): IRect;
        function aboveLeft(labelSize: ISize, parentPoint: IPoint, offset: number): IRect;
        function aboveRight(labelSize: ISize, parentPoint: IPoint, offset: number): IRect;
        function center(labelSize: ISize, parentPoint: IPoint): IRect;
        function getLabelLeaderLineEndingPoint(boundingBox: IRect, position: NewPointLabelPosition, parentShape: LabelParentPoint): number[][];
    }
}

declare module powerbi {
    import ISize = powerbi.visuals.shapes.ISize;
    import IRect = powerbi.visuals.IRect;
    import VisualDataLabelsSettings = powerbi.visuals.VisualDataLabelsSettings;
    import DonutArcDescriptor = powerbi.visuals.DonutArcDescriptor;
    interface DonutChartProperties {
        viewport: IViewport;
        dataLabelsSettings: VisualDataLabelsSettings;
        radius: number;
        arc: D3.Svg.Arc;
        outerArc: D3.Svg.Arc;
        outerArcRadiusRatio: number;
        innerArcRadiusRatio: number;
    }
    interface DonutLabelDataPoint extends LabelDataPoint {
        dataLabel: string;
        dataLabelSize: ISize;
        categoryLabel: string;
        categoryLabelSize: ISize;
        donutArcDescriptor: DonutArcDescriptor;
        alternativeScale: number;
        angle: number;
        linesSize: ISize[];
        leaderLinePoints: number[][];
    }
    interface DonutLabelRect {
        textRect: IRect;
        diagonalLineRect: IRect;
        horizontalLineRect: IRect;
    }
    class DonutLabelLayout {
        /** Maximum distance labels will be offset by */
        private maximumOffset;
        /** The amount to increase the offset each attempt while laying out labels */
        private offsetIterationDelta;
        /** The amount of offset to start with when the data label is not centered */
        private startingOffset;
        private donutChartProperties;
        private center;
        private outerRadius;
        private innerRadius;
        private additionalCharsWidth;
        constructor(options: DataLabelLayoutOptions, donutChartProperties: DonutChartProperties);
        /**
         * Arrange takes a set of data labels and lays them out them in order, assuming that
         * the given array has already been sorted with the most preferred labels at the
         * front.
         *
         * Details:
         * - We iterate over offsets from the target position, increasing from 0
         * - For each offset, we iterate over each data label
         * - For each data label, we iterate over each position that is valid for
         *     both the specific label and this layout
         * - When a valid position is found, we position the label there and no longer
         *     reposition it.
         * - This prioritizes the earlier labels to be positioned closer to their
         *     target points in the position they prefer.
         * - This prioritizes putting data labels close to a valid position over
         *     placing them at their preferred position (it will place it at a less
         *     preferred position if it will be a smaller offset)
         */
        layout(labelDataPoints: DonutLabelDataPoint[]): Label[];
        private positionLabels(labelDataPoints, grid);
        /**
         * We try to move the label 25% up/down if the label is truncated or it collides with other labels.
         * after we moved it once we check that the new position doesn't failed (collides with other labels).
         */
        private tryPositionForDonut(labelPoint, grid, currentLabelOffset);
        private generateCandidate(labelDataPoint, candidatePosition, grid, currentLabelOffset);
        private tryAllPositions(labelDataPoint, grid, defaultPosition, currentLabelOffset);
        private buildLabel(labelLayout, grid);
        private static tryPositionPoint(grid, position, labelDataPoint, offset, center, viewport);
        /**
         * Returns an array of valid positions for hidden and truncated labels.
         * For truncated labels will return positions with more available space.
         * For hidden labels will return all possible positions by the order we draw labels (clockwise)
         */
        private getLabelPointPositions(labelPoint, isTruncated);
        /**
         * Returns a new DonutLabelDataPoint after splitting it into two lines
         */
        private splitDonutDataPoint(labelPoint);
        private generateCandidateAngleForPosition(d, position);
        private getPointPositionForAngle(angle);
        private score(labelPoint, point);
    }
}

declare module powerbi {
    import IPoint = powerbi.visuals.IPoint;
    import IRect = powerbi.visuals.IRect;
    import Polygon = powerbi.visuals.shapes.Polygon;
    import Transform = powerbi.visuals.Transform;
    interface LabelParentPolygon {
        /** The point this data label belongs to */
        polygon: Polygon;
        /** Valid positions to place the label ordered by preference */
        validPositions: NewPointLabelPosition[];
    }
    interface FilledMapLabel extends Label {
        absoluteBoundingBoxCenter: IPoint;
        originalPixelOffset: number;
        originalPosition?: NewPointLabelPosition;
        originalAbsoluteCentroid?: IPoint;
        absoluteStemSource?: IPoint;
        isPlacedInsidePolygon: boolean;
    }
    class FilledMapLabelLayout {
        private labels;
        layout(labelDataPoints: LabelDataPoint[], viewport: IViewport, polygonInfoTransform: Transform, redrawDataLabels: boolean): Label[];
        getLabelPolygon(mapDataPoint: LabelDataPoint, position: NewPointLabelPosition, pointPosition: IPoint, offset: number): IRect;
        private getLabelBoundingBox(dataPointSize, position, pointPosition, offset);
        private getLabelByPolygonPositions(labelPoint, polygonInfoTransform, grid, shapesGrid);
        private setLeaderLinePoints(stemSource, stemDestination);
        private calculateStemSource(polygonInfoTransform, inverseTransorm, polygon, labelBoundingBox, position, pixelCentroid);
        private calculateStemDestination(labelBoundingBox, position);
        private tryPositionForPolygonPosition(position, labelDataPoint, polygonInfoTransform, offset, inverseTransorm);
        /**
        * Tests a particular position/offset combination for the given data label.
        * If the label can be placed, returns the resulting bounding box for the data
        * label.  If not, returns null.
        */
        private tryPlaceLabelOutsidePolygon(grid, position, labelDataPoint, offset, pixelCentroid, shapesGrid, inverseTransform);
        private updateLabelOffsets(polygonInfoTransform);
        private getAbsoluteRectangle(inverseTransorm, rect);
    }
    class LabelPolygonArrangeGrid {
        private grid;
        private viewport;
        private cellSize;
        private columnCount;
        private rowCount;
        /**
         * A multiplier applied to the largest width height to attempt to balance # of
         * polygons in each cell and number of cells each polygon belongs to
         */
        private static cellSizeMultiplier;
        constructor(polygons: Polygon[], viewport: IViewport);
        hasConflict(absolutLabelRect: IRect, pixelLabelRect: IRect): boolean;
        private add(polygon);
        private getContainingGridSubsection(rect);
        private static getCellCount(step, length, minCount, maxCount);
        private static bound(value, min, max);
    }
}

declare module powerbi.visuals {
    function createColorAllocatorFactory(): IColorAllocatorFactory;
}

declare module powerbi.visuals {
    class DefaultVisualHostServices implements IVisualHostServices {
        static initialize(): void;
        /**
         * Create locale options.
         *
         * Note: Public for testability.
         */
        static createLocaleOptions(): visuals.ValueFormatterLocalizationOptions;
        static createTooltipLocaleOptions(): powerbi.visuals.TooltipLocalizationOptions;
        getLocalizedString(stringId: string): string;
        onDragStart(): void;
        canSelect(): boolean;
        onSelecting(args: SelectingEventArgs): void;
        onSelect(): void;
        onContextMenu(): void;
        loadMoreData(): void;
        persistProperties(changes: VisualObjectInstance[] | VisualObjectInstancesToPersist): void;
        onCustomSort(args: CustomSortEventArgs): void;
        getViewMode(): powerbi.ViewMode;
        setWarnings(warnings: IVisualWarning[]): void;
        setToolbar($toolbar: JQuery): void;
        shouldRetainSelection(): boolean;
        geocoder(): IGeocoder;
        geolocation(): IGeolocation;
        promiseFactory(): IPromiseFactory;
        visualCapabilitiesChanged(): void;
        analyzeFilter(options: FilterAnalyzerOptions): AnalyzedFilter;
        getIdentityDisplayNames(dentities: DataViewScopeIdentity[]): DisplayNameIdentityPair[];
        setIdentityDisplayNames(displayNamesIdentityPairs: DisplayNameIdentityPair[]): void;
        private static beautify(format);
        private static describeUnit(exponent);
    }
    const defaultVisualHostServices: IVisualHostServices;
}

declare module powerbi.visuals {
    import SemanticFilter = powerbi.data.SemanticFilter;
    interface SelectableDataPoint {
        selected: boolean;
        /** Identity for identifying the selectable data point for selection purposes */
        identity: SelectionId;
        /**
         * A specific identity for when data points exist at a finer granularity than
         * selection is performed.  For example, if your data points should select based
         * only on series even if they exist as category/series intersections.
         */
        specificIdentity?: SelectionId;
    }
    /**
     * Factory method to create an IInteractivityService instance.
     */
    function createInteractivityService(hostServices: IVisualHostServices): IInteractivityService;
    /**
     * Creates a clear an svg rect to catch clear clicks.
     */
    function appendClearCatcher(selection: D3.Selection): D3.Selection;
    function isCategoryColumnSelected(propertyId: DataViewObjectPropertyIdentifier, categories: DataViewCategoricalColumn, idx: number): boolean;
    function dataHasSelection(data: SelectableDataPoint[]): boolean;
    interface IInteractiveBehavior {
        bindEvents(behaviorOptions: any, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
    }
    /**
     * An optional options bag for binding to the interactivityService
     */
    interface InteractivityServiceOptions {
        isLegend?: boolean;
        isLabels?: boolean;
        overrideSelectionFromData?: boolean;
        hasSelectionOverride?: boolean;
        slicerValueHandler?: SlicerValueHandler;
    }
    /**
     * Responsible for managing interactivity between the hosting visual and its peers
     */
    interface IInteractivityService {
        /** Binds the visual to the interactivityService */
        bind(dataPoints: SelectableDataPoint[], behavior: IInteractiveBehavior, behaviorOptions: any, iteractivityServiceOptions?: InteractivityServiceOptions): any;
        /** Clears the selection */
        clearSelection(): void;
        /** Sets the selected state on the given data points. */
        applySelectionStateToData(dataPoints: SelectableDataPoint[]): boolean;
        /** Checks whether there is at least one item selected */
        hasSelection(): boolean;
        /** Checks whether there is at least one item selected within the legend */
        legendHasSelection(): boolean;
        /** Checks whether the selection mode is inverted or normal */
        isSelectionModeInverted(): boolean;
        /** Sets whether the selection mode is inverted or normal */
        setSelectionModeInverted(inverted: boolean): void;
        setDefaultValueMode(useDefaultValue: boolean): void;
        isDefaultValueEnabled(): boolean;
    }
    interface ISelectionHandler {
        /**
         * Handles a selection event by selecting the given data point.  If the data point's
         * identity is undefined, the selection state is cleared. In this case, if specificIdentity
         * exists, it will still be sent to the host.
         */
        handleSelection(dataPoint: SelectableDataPoint, multiSelect: boolean): void;
        /** Handles a request for a context menu. */
        handleContextMenu(dataPoint: SelectableDataPoint, position: IPoint): void;
        /** Handles a selection clear, clearing all selection state */
        handleClearSelection(): void;
        /** Toggles the selection mode between normal and inverted; returns true if the new mode is inverted */
        toggleSelectionModeInversion(): boolean;
        /** Sends the selection state to the host */
        persistSelectionFilter(filterPropertyIdentifier: DataViewObjectPropertyIdentifier): void;
        /** Sends selfFilter to the host */
        persistSelfFilter(filterPropertyIdentifier: DataViewObjectPropertyIdentifier, selfFilter: SemanticFilter): void;
    }
    class InteractivityService implements IInteractivityService, ISelectionHandler {
        private hostService;
        private renderSelectionInVisual;
        private renderSelectionInLegend;
        private renderSelectionInLabels;
        private selectedIds;
        private isInvertedSelectionMode;
        private hasSelectionOverride;
        private behavior;
        private slicerValueHandler;
        private useDefaultValue;
        selectableDataPoints: SelectableDataPoint[];
        selectableLegendDataPoints: SelectableDataPoint[];
        selectableLabelsDataPoints: SelectableDataPoint[];
        private dataPointObjectName;
        constructor(hostServices: IVisualHostServices);
        /** Binds the vsiual to the interactivityService */
        bind(dataPoints: SelectableDataPoint[], behavior: IInteractiveBehavior, behaviorOptions: any, options?: InteractivityServiceOptions): void;
        /**
         * Sets the selected state of all selectable data points to false and invokes the behavior's select command.
         */
        clearSelection(): void;
        applySelectionStateToData(dataPoints: SelectableDataPoint[]): boolean;
        /**
         * Checks whether there is at least one item selected.
         */
        hasSelection(): boolean;
        legendHasSelection(): boolean;
        labelsHasSelection(): boolean;
        isSelectionModeInverted(): boolean;
        setSelectionModeInverted(inverted: boolean): void;
        handleSelection(dataPoint: SelectableDataPoint, multiSelect: boolean): void;
        handleContextMenu(dataPoint: SelectableDataPoint, point: IPoint): void;
        handleClearSelection(): void;
        toggleSelectionModeInversion(): boolean;
        persistSelectionFilter(filterPropertyIdentifier: DataViewObjectPropertyIdentifier): void;
        persistSelfFilter(filterPropertyIdentifier: DataViewObjectPropertyIdentifier, selfFilter: SemanticFilter): void;
        setDefaultValueMode(useDefaultValue: boolean): void;
        isDefaultValueEnabled(): boolean;
        private renderAll();
        /** Marks a data point as selected and syncs selection with the host. */
        private select(d, multiSelect);
        private selectInverted(d, multiSelect);
        private removeId(toRemove);
        private getFilterFromSelectors();
        private static createChangeForFilterProperty(filterPropertyIdentifier, filter);
        private sendContextMenuToHost(dataPoint, position);
        private sendSelectionToHost();
        private createSelectEventArgs(selectedIds);
        private getSelectorsByColumn(selectionIds);
        private takeSelectionStateFromDataPoints(dataPoints);
        /**
         * Syncs the selection state for all data points that have the same category. Returns
         * true if the selection state was out of sync and corrections were made; false if
         * the data is already in sync with the service.
         *
         * If the data is not compatible with the current service's current selection state,
         * the state is cleared and the cleared selection is sent to the host.
         *
         * Ignores series for now, since we don't support series selection at the moment.
         */
        private syncSelectionState();
        private syncSelectionStateInverted();
        private applyToAllSelectableDataPoints(action);
        private static updateSelectableDataPointsBySelectedIds(selectableDataPoints, selectedIds);
        private static checkDatapointAgainstSelectedIds(datapoint, selectedIds);
        private removeSelectionIdsWithOnlyMeasures();
        private removeSelectionIdsExceptOnlyMeasures();
    }
}

declare module powerbi.visuals.services {
    function createGeocoder(): IGeocoder;
    interface BingAjaxService {
        (url: string, settings: JQueryAjaxSettings): any;
    }
    const safeCharacters: string;
    /** Note: Used for test mockup */
    let BingAjaxCall: BingAjaxService;
    const CategoryTypeArray: string[];
    function isCategoryType(value: string): boolean;
    const BingEntities: {
        Continent: string;
        Sovereign: string;
        CountryRegion: string;
        AdminDivision1: string;
        AdminDivision2: string;
        PopulatedPlace: string;
        Postcode: string;
        Postcode1: string;
        Neighborhood: string;
        Address: string;
    };
    interface ILocation {
        latitude: number;
        longitude: number;
    }
    interface ILocationRect {
        northWest: ILocation;
        southEast: ILocation;
    }
    interface GeocodeCallback {
        (error: Error, coordinate: IGeocodeCoordinate): void;
    }
    interface IGeocodeQuery {
        query: string;
        category: string;
        levelOfDetail?: number;
        longitude?: number;
        latitude?: number;
    }
    class GeocodeQuery implements IGeocodeQuery {
        query: string;
        category: string;
        key: string;
        constructor(query: string, category: string);
        getBingEntity(): string;
        getUrl(): string;
    }
    class GeocodePointQuery extends GeocodeQuery {
        latitude: number;
        longitude: number;
        entities: string[];
        constructor(latitude: number, longitude: number, entities: string[]);
        getUrl(): string;
    }
    class GeocodeBoundaryQuery extends GeocodeQuery {
        latitude: number;
        longitude: number;
        levelOfDetail: number;
        maxGeoData: number;
        constructor(latitude: number, longitude: number, category: any, levelOfDetail: any, maxGeoData?: number);
        getBingEntity(): string;
        getUrl(): string;
    }
    function geocodeCore(geocodeQuery: GeocodeQuery, options?: GeocodeOptions): any;
    function geocode(query: string, category?: string, options?: GeocodeOptions): any;
    function geocodeBoundary(latitude: number, longitude: number, category?: string, levelOfDetail?: number, maxGeoData?: number, options?: GeocodeOptions): any;
    function geocodePoint(latitude: number, longitude: number, entities: string[], options?: GeocodeOptions): any;
    function resetStaticGeocoderState(cache?: IGeocodingCache): void;
}

declare module powerbi.visuals.services {
    interface IGeocodingCache {
        getCoordinates(key: string): IGeocodeCoordinate;
        registerCoordinates(key: string, coordinate: IGeocodeCoordinate): void;
        registerCoordinates(key: string, coordinate: IGeocodeBoundaryCoordinate): void;
    }
    function createGeocodingCache(maxCacheSize: number, maxCacheSizeOverflow: number, localStorageService?: IStorageService): IGeocodingCache;
}

declare module powerbi.visuals.services {
    function createGeolocation(): IGeolocation;
}

declare module powerbi.visuals.controls {
    function fire(eventHandlers: any, eventArgs: any): void;
    class ScrollbarButton {
        static MIN_WIDTH: number;
        static ARROW_COLOR: string;
        private _element;
        private _polygon;
        private _svg;
        private _owner;
        private _direction;
        private _timerHandle;
        private _mouseUpWrapper;
        constructor(owner: Scrollbar, direction: number);
        element: HTMLDivElement;
        private createView();
        private onMouseDown(event);
        private onMouseUp(event);
        arrange(width: number, height: number, angle: number): void;
    }
    /** Scrollbar base class */
    class Scrollbar {
        static DefaultScrollbarWidth: string;
        private static ScrollbarBackgroundFirstTimeMousedownHoldDelay;
        private static ScrollbarBackgroundMousedownHoldDelay;
        private static MouseWheelRange;
        static className: string;
        static barClassName: string;
        static arrowClassName: string;
        MIN_BAR_SIZE: number;
        min: number;
        max: number;
        viewMin: number;
        viewSize: number;
        smallIncrement: number;
        _onscroll: any[];
        private _actualWidth;
        private _actualHeight;
        private _actualButtonWidth;
        private _actualButtonHeight;
        private _width;
        private _height;
        private _visible;
        private _element;
        private _minButton;
        private _maxButton;
        private _middleBar;
        private _timerHandle;
        private _screenToOffsetScale;
        private _screenPrevMousePos;
        private _screenMinMousePos;
        private _screenMaxMousePos;
        private _backgroundMouseUpWrapper;
        private _middleBarMouseMoveWrapper;
        private _middleBarMouseUpWrapper;
        private _touchPanel;
        private _offsetTouchStartPos;
        private _offsetTouchPrevPos;
        private _touchStarted;
        private _allowMouseDrag;
        constructor(parentElement: HTMLElement, layoutKind: TablixLayoutKind);
        scrollBy(delta: number): void;
        scrollUp(): void;
        scrollDown(): void;
        scrollPageUp(): void;
        scrollPageDown(): void;
        width: string;
        height: string;
        refresh(): void;
        element: HTMLDivElement;
        maxButton: ScrollbarButton;
        middleBar: HTMLDivElement;
        _scrollSmallIncrement(direction: any): void;
        visible: boolean;
        isInMouseCapture: boolean;
        show(value: boolean): void;
        _getMouseOffset(event: MouseEvent): {
            x: number;
            y: number;
        };
        _getOffsetXDelta(event: MouseEvent): number;
        _getOffsetYDelta(event: MouseEvent): number;
        _getOffsetXTouchDelta(event: MouseEvent): number;
        _getOffsetYTouchDelta(event: MouseEvent): number;
        initTouch(panel: HTMLElement, allowMouseDrag?: boolean): void;
        onTouchStart(e: any): void;
        onTouchMove(e: any): void;
        onTouchEnd(e: any): void;
        onTouchMouseDown(e: MouseEvent): void;
        _getOffsetTouchDelta(e: MouseEvent): number;
        onTouchMouseMove(e: MouseEvent): void;
        onTouchMouseUp(e: MouseEvent, bubble?: boolean): void;
        private createView(parentElement, layoutKind);
        private scrollTo(pos);
        _scrollByPage(event: MouseEvent): void;
        _getRunningSize(net: boolean): number;
        _getOffsetDelta(event: MouseEvent): number;
        private scroll(event);
        actualWidth: number;
        actualHeight: number;
        actualButtonWidth: number;
        actualButtonHeight: number;
        arrange(): void;
        _calculateButtonWidth(): number;
        _calculateButtonHeight(): number;
        _getMinButtonAngle(): number;
        _getMaxButtonAngle(): number;
        _setMaxButtonPosition(): void;
        invalidateArrange(): void;
        private onHoldBackgroundMouseDown(event);
        private onBackgroundMouseDown(event);
        private onBackgroundMouseUp(event);
        private getPinchZoomY();
        private onMiddleBarMouseDown(event);
        private onMiddleBarMouseMove(event);
        private onMiddleBarMouseUp(event);
        _getScreenContextualLeft(element: HTMLElement): number;
        _getScreenContextualRight(element: HTMLElement): number;
        onMouseWheel(delta: number): void;
        private mouseWheel(delta);
        _getScreenMousePos(event: MouseEvent): any;
        static addDocumentMouseUpEvent(func: any): void;
        static removeDocumentMouseUpEvent(func: any): void;
        static addDocumentMouseMoveEvent(func: any): void;
        static removeDocumentMouseMoveEvent(func: any): void;
    }
    /** Horizontal Scrollbar */
    class HorizontalScrollbar extends Scrollbar {
        constructor(parentElement: HTMLElement, layoutKind: TablixLayoutKind);
        _calculateButtonWidth(): number;
        _calculateButtonHeight(): number;
        _getMinButtonAngle(): number;
        _getMaxButtonAngle(): number;
        _setMaxButtonPosition(): void;
        refresh(): void;
        show(visible: boolean): void;
        _scrollByPage(event: MouseEvent): void;
        _getRunningSize(net: boolean): number;
        _getOffsetDelta(event: MouseEvent): number;
        _getOffsetTouchDelta(e: MouseEvent): number;
        _getScreenContextualLeft(element: HTMLElement): number;
        _getScreenContextualRight(element: HTMLElement): number;
        _getScreenMousePos(event: MouseEvent): number;
    }
    /** Vertical Scrollbar */
    class VerticalScrollbar extends Scrollbar {
        constructor(parentElement: HTMLElement, layoutKind: TablixLayoutKind);
        _calculateButtonWidth(): number;
        _calculateButtonHeight(): number;
        _getMinButtonAngle(): number;
        _getMaxButtonAngle(): number;
        _setMaxButtonPosition(): void;
        refresh(): void;
        show(visible: boolean): void;
        _scrollByPage(event: MouseEvent): void;
        _getRunningSize(net: boolean): number;
        _getOffsetDelta(event: MouseEvent): number;
        _getOffsetTouchDelta(e: MouseEvent): number;
        _getScreenContextualLeft(element: HTMLElement): number;
        _getScreenContextualRight(element: HTMLElement): number;
        _getScreenMousePos(event: MouseEvent): number;
    }
}

declare module powerbi.visuals.controls.internal {
    /** This class is responsible for tablix header resizing */
    class TablixResizer {
        private _element;
        private _handler;
        private _elementMouseDownWrapper;
        private _elementMouseMoveWrapper;
        private _elementMouseOutWrapper;
        private _elementMouseDoubleClickOutWrapper;
        private _documentMouseMoveWrapper;
        private _documentMouseUpWrapper;
        private _startMousePosition;
        private _originalCursor;
        static resizeHandleSize: number;
        static resizeCursor: string;
        constructor(element: HTMLElement, handler: ITablixResizeHandler);
        static addDocumentMouseUpEvent(listener: EventListener): void;
        static removeDocumentMouseUpEvent(listener: EventListener): void;
        static addDocumentMouseMoveEvent(listener: EventListener): void;
        static removeDocumentMouseMoveEvent(listener: EventListener): void;
        static getMouseCoordinates(event: MouseEvent): {
            x: number;
            y: number;
        };
        static getMouseCoordinateDelta(previous: {
            x: number;
            y: number;
        }, current: {
            x: number;
            y: number;
        }): {
            x: number;
            y: number;
        };
        initialize(): void;
        uninitialize(): void;
        cell: TablixCell;
        element: HTMLElement;
        _hotSpot(position: {
            x: number;
            y: number;
        }): boolean;
        private onElementMouseDown(event);
        private onElementMouseMove(event);
        private onElementMouseOut(event);
        private onElementMouseDoubleClick(event);
        private onDocumentMouseMove(event);
        private onDocumentMouseUp(event);
    }
    class TablixDomResizer extends TablixResizer {
        private _cell;
        constructor(cell: TablixCell, element: HTMLElement, handler: ITablixResizeHandler);
        cell: TablixCell;
        _hotSpot(position: {
            x: number;
            y: number;
        }): boolean;
    }
    class TablixCellPresenter {
        static _dragResizeDisabledAttributeName: string;
        private _owner;
        private _tableCell;
        /** Outer DIV */
        private _contentElement;
        /** Inner DIV */
        private _contentHost;
        private _resizer;
        layoutKind: TablixLayoutKind;
        constructor(fitProportionally: boolean, layoutKind: TablixLayoutKind);
        initialize(owner: TablixCell): void;
        owner: TablixCell;
        registerTableCell(tableCell: HTMLTableCellElement): void;
        tableCell: HTMLTableCellElement;
        /**
         * Outer DIV
         */
        contentElement: HTMLElement;
        /**
        * Inner DIV
        */
        contentHost: HTMLElement;
        registerClickHandler(handler: (e: MouseEvent) => any): void;
        unregisterClickHandler(): void;
        onContainerWidthChanged(value: number): void;
        onContinerHeightChanged(height: number): void;
        onColumnSpanChanged(value: number): void;
        onRowSpanChanged(value: number): void;
        onTextAlignChanged(value: string): void;
        onClear(): void;
        onHorizontalScroll(width: number, offset: number): void;
        onVerticalScroll(height: number, offset: number): void;
        onInitializeScrolling(): void;
        enableHorizontalResize(enable: boolean, handler: ITablixResizeHandler): void;
        /**
         * In order to allow dragging of the tableCell we need to
         * disable dragging of the container of the cell in IE.
         */
        disableDragResize(): void;
    }
    class TablixRowPresenter {
        private _row;
        private _tableRow;
        private _fitProportionally;
        constructor(fitProportionally: boolean);
        initialize(row: TablixRow): void;
        createCellPresenter(layoutKind: controls.TablixLayoutKind): TablixCellPresenter;
        registerRow(tableRow: HTMLTableRowElement): void;
        onAppendCell(cell: TablixCell): void;
        onInsertCellBefore(cell: TablixCell, refCell: TablixCell): void;
        onRemoveCell(cell: TablixCell): void;
        getHeight(): number;
        getCellHeight(cell: ITablixCell): number;
        getCellContentHeight(cell: ITablixCell): number;
        tableRow: HTMLTableRowElement;
    }
    class DashboardRowPresenter extends TablixRowPresenter {
        private _gridPresenter;
        constructor(gridPresenter: DashboardTablixGridPresenter, fitProportionally: boolean);
        getCellHeight(cell: ITablixCell): number;
        getCellContentHeight(cell: ITablixCell): number;
    }
    class CanvasRowPresenter extends TablixRowPresenter {
        getCellHeight(cell: ITablixCell): number;
        getCellContentHeight(cell: ITablixCell): number;
    }
    class TablixColumnPresenter {
        protected _column: TablixColumn;
        initialize(column: TablixColumn): void;
        getWidth(): number;
        getPersistedWidth(): number;
        getCellWidth(cell: ITablixCell): number;
    }
    class DashboardColumnPresenter extends TablixColumnPresenter {
        private _gridPresenter;
        constructor(gridPresenter: DashboardTablixGridPresenter);
        getPersistedWidth(): number;
        getCellWidth(cell: ITablixCell): number;
    }
    class CanvasColumnPresenter extends TablixColumnPresenter {
        private _gridPresenter;
        private _columnIndex;
        constructor(gridPresenter: CanvasTablixGridPresenter, index: number);
        getPersistedWidth(): number;
        getCellWidth(cell: ITablixCell): number;
    }
    class TablixGridPresenter {
        protected _table: HTMLTableElement;
        protected _owner: TablixGrid;
        private _footerTable;
        private _columnWidthManager;
        constructor(columnWidthManager?: TablixColumnWidthManager);
        initialize(owner: TablixGrid, gridHost: HTMLElement, footerHost: HTMLElement, control: TablixControl): void;
        getWidth(): number;
        getHeight(): number;
        getScreenToCssRatioX(): number;
        getScreenToCssRatioY(): number;
        createRowPresenter(): TablixRowPresenter;
        createColumnPresenter(index: number): TablixColumnPresenter;
        onAppendRow(row: TablixRow): void;
        onInsertRowBefore(row: TablixRow, refRow: TablixRow): void;
        onRemoveRow(row: TablixRow): void;
        onAddFooterRow(row: TablixRow): void;
        onClear(): void;
        onFillColumnsProportionallyChanged(value: boolean): void;
        invokeColumnResizeEndCallback(column: TablixColumn, width: number): void;
        getPersistedColumnWidth(column: TablixColumn): number;
    }
    class DashboardTablixGridPresenter extends TablixGridPresenter {
        private _sizeComputationManager;
        constructor(sizeComputationManager: SizeComputationManager);
        createRowPresenter(): TablixRowPresenter;
        createColumnPresenter(index: number): TablixColumnPresenter;
        sizeComputationManager: SizeComputationManager;
        getWidth(): number;
        getHeight(): number;
    }
    class CanvasTablixGridPresenter extends TablixGridPresenter {
        constructor(columnWidthManager: TablixColumnWidthManager);
        createRowPresenter(): TablixRowPresenter;
        createColumnPresenter(index: number): TablixColumnPresenter;
        getWidth(): number;
        getHeight(): number;
    }
}

declare module powerbi.visuals.controls.internal {
    /**
     * Base class for Tablix realization manager.
     */
    class TablixDimensionRealizationManager {
        private _realizedLeavesCount;
        private _adjustmentFactor;
        private _itemsToRealizeCount;
        private _itemsEstimatedContextualWidth;
        private _binder;
        constructor(binder: ITablixBinder);
        _getOwner(): DimensionLayoutManager;
        binder: ITablixBinder;
        adjustmentFactor: number;
        itemsToRealizeCount: number;
        itemsEstimatedContextualWidth: number;
        onStartRenderingIteration(): void;
        onEndRenderingIteration(gridContextualWidth: number, filled: boolean): void;
        onEndRenderingSession(): void;
        onCornerCellRealized(item: any, cell: ITablixCell): void;
        onHeaderRealized(item: any, cell: ITablixCell, leaf: boolean): void;
        needsToRealize: boolean;
        _getEstimatedItemsToRealizeCount(): void;
        _getSizeAdjustment(gridContextualWidth: number): number;
    }
    /**
     * DOM implementation for Row Tablix realization manager.
     */
    class RowRealizationManager extends TablixDimensionRealizationManager {
        private _owner;
        owner: RowLayoutManager;
        _getOwner(): DimensionLayoutManager;
        _getEstimatedItemsToRealizeCount(): void;
        private estimateRowsToRealizeCount();
        getEstimatedRowHierarchyWidth(): number;
        private updateRowHiearchyEstimatedWidth(items, firstVisibleIndex, levels);
        _getSizeAdjustment(gridContextualWidth: number): number;
    }
    /**
     * DOM implementation for Column Tablix realization manager.
     */
    class ColumnRealizationManager extends TablixDimensionRealizationManager {
        private _owner;
        owner: ColumnLayoutManager;
        _getOwner(): DimensionLayoutManager;
        _getEstimatedItemsToRealizeCount(): void;
        private rowRealizationManager;
        private getEstimatedRowHierarchyWidth();
        private estimateColumnsToRealizeCount(rowHierarchyWidth);
        _getSizeAdjustment(gridContextualWidth: number): number;
    }
    class RowWidths {
        items: RowWidth[];
        leafCount: any;
        constructor();
    }
    class RowWidth {
        maxLeafWidth: number;
        maxNonLeafWidth: number;
    }
}

declare module powerbi.visuals.controls.internal {
    interface ITablixResizeHandler {
        onStartResize(cell: TablixCell, currentX: number, currentY: number): void;
        onResize(cell: TablixCell, deltaX: number, deltaY: number): void;
        onEndResize(cell: TablixCell): any;
        onReset(cell: TablixCell): any;
    }
    /**
     * Internal interface to abstract the tablix row/column.
     */
    interface ITablixGridItem {
        calculateSize(): number;
        onResize(size: number): void;
        onResizeEnd(size: number): void;
        fixSize(): void;
        /**
         * In case the parent column/row header size is bigger than the sum of the children,
         * the size of the last item is adjusted to compensate the difference.
         */
        setAligningContextualWidth(size: number): void;
        getAligningContextualWidth(): number;
        getContextualWidth(): number;
        getContentContextualWidth(): number;
        getIndex(grid: TablixGrid): number;
        getHeaders(): TablixCell[];
        getOtherDimensionHeaders(): TablixCell[];
        getOtherDimensionOwner(cell: TablixCell): ITablixGridItem;
        getCellIContentContextualWidth(cell: TablixCell): number;
        getCellContextualSpan(cell: TablixCell): number;
    }
    class TablixCell implements ITablixCell {
        private _horizontalOffset;
        private _verticalOffset;
        private _colSpan;
        private _rowSpan;
        private _textAlign;
        private _containerWidth;
        private _containerHeight;
        private _scrollable;
        _column: TablixColumn;
        _row: TablixRow;
        type: TablixCellType;
        item: any;
        _presenter: TablixCellPresenter;
        extension: TablixCellPresenter;
        position: internal.TablixUtils.CellPosition;
        contentHeight: number;
        contentWidth: number;
        constructor(presenter: TablixCellPresenter, extension: TablixCellPresenter, row: TablixRow);
        unfixRowHeight(): void;
        colSpan: number;
        rowSpan: number;
        getCellSpanningHeight(): number;
        textAlign: string;
        horizontalOffset: number;
        verticalOffset: number;
        private isScrollable();
        clear(): void;
        private initializeScrolling();
        prepare(scrollable: boolean): void;
        scrollVertically(height: number, offset: number): void;
        scrollHorizontally(width: number, offset: number): void;
        setContainerWidth(value: number): void;
        containerWidth: number;
        setContainerHeight(value: number): void;
        containerHeight: number;
        applyStyle(style: TablixUtils.CellStyle): void;
        enableHorizontalResize(enable: boolean, handler: ITablixResizeHandler): void;
    }
    class TablixColumn implements ITablixGridItem {
        _realizedColumnHeaders: TablixCell[];
        _realizedCornerCells: TablixCell[];
        _realizedRowHeaders: TablixCell[];
        _realizedBodyCells: TablixCell[];
        private _items;
        private _itemType;
        private _footerCell;
        private _containerWidth;
        private _width;
        private _sizeFixed;
        private _aligningWidth;
        private _fixedToAligningWidth;
        private _presenter;
        private _owner;
        private _columnIndex;
        constructor(presenter: TablixColumnPresenter, columnIndex: number);
        initialize(owner: TablixGrid): void;
        owner: TablixGrid;
        private getType();
        private getColumnHeadersOrCorners();
        private columnHeadersOrCornersEqual(newType, headers, hierarchyNavigator);
        itemType: TablixCellType;
        getLeafItem(): any;
        columnHeaderOrCornerEquals(type1: TablixCellType, item1: any, type2: TablixCellType, item2: any, hierarchyNavigator: ITablixHierarchyNavigator): boolean;
        OnLeafRealized(hierarchyNavigator: ITablixHierarchyNavigator): void;
        private clearSpanningCellsWidth(cells);
        addCornerCell(cell: TablixCell): void;
        addRowHeader(cell: TablixCell): void;
        addColumnHeader(cell: TablixCell, isLeaf: boolean): void;
        addBodyCell(cell: TablixCell): void;
        footer: TablixCell;
        onResize(width: number): void;
        onResizeEnd(width: number): void;
        fixSize(): void;
        clearSize(): void;
        getContentContextualWidth(): number;
        getCellIContentContextualWidth(cell: TablixCell): number;
        getCellSpanningWidthWithScrolling(cell: ITablixCell, tablixGrid: TablixGrid): number;
        getScrollingOffset(): number;
        getContextualWidth(): number;
        calculateSize(): number;
        setAligningContextualWidth(size: number): void;
        getAligningContextualWidth(): number;
        private setContainerWidth(value);
        getTablixCell(): TablixCell;
        getIndex(grid: TablixGrid): number;
        getHeaders(): TablixCell[];
        getOtherDimensionHeaders(): TablixCell[];
        getCellContextualSpan(cell: TablixCell): number;
        getOtherDimensionOwner(cell: TablixCell): ITablixGridItem;
    }
    class TablixRow implements ITablixGridItem {
        private _allocatedCells;
        _realizedRowHeaders: TablixCell[];
        _realizedColumnHeaders: TablixCell[];
        _realizedBodyCells: TablixCell[];
        _realizedCornerCells: TablixCell[];
        private _realizedCellsCount;
        private _heightFixed;
        private _containerHeight;
        private _height;
        private _presenter;
        private _owner;
        constructor(presenter: TablixRowPresenter);
        initialize(owner: TablixGrid): void;
        presenter: TablixRowPresenter;
        owner: TablixGrid;
        releaseUnusedCells(owner: TablixControl): void;
        releaseAllCells(owner: TablixControl): void;
        private releaseCells(owner, startIndex);
        moveScrollableCellsToEnd(count: number): void;
        moveScrollableCellsToStart(count: number): void;
        getOrCreateCornerCell(column: TablixColumn): TablixCell;
        getOrCreateRowHeader(column: TablixColumn, scrollable: boolean, leaf: boolean): TablixCell;
        getOrCreateColumnHeader(column: TablixColumn, scrollable: boolean, leaf: boolean): TablixCell;
        getOrCreateBodyCell(column: TablixColumn, scrollable: boolean): TablixCell;
        getOrCreateFooterRowHeader(column: TablixColumn): TablixCell;
        getOrCreateFooterBodyCell(column: TablixColumn, scrollable: boolean): TablixCell;
        getRowHeaderLeafIndex(): number;
        getAllocatedCellAt(index: number): TablixCell;
        moveCellsBy(delta: number): void;
        getRealizedCellCount(): number;
        getRealizedHeadersCount(): number;
        getRealizedHeaderAt(index: number): TablixCell;
        getTablixCell(): TablixCell;
        getOrCreateEmptySpaceCell(): TablixCell;
        private createCell(row);
        private getOrCreateCell();
        onResize(height: number): void;
        onResizeEnd(height: number): void;
        fixSize(): void;
        unfixSize(): void;
        getContentContextualWidth(): number;
        getCellIContentContextualWidth(cell: TablixCell): number;
        getCellSpanningHeight(cell: ITablixCell): number;
        getContextualWidth(): number;
        sizeFixed(): boolean;
        calculateSize(): number;
        setAligningContextualWidth(size: number): void;
        getAligningContextualWidth(): number;
        private setContentHeight();
        getIndex(grid: TablixGrid): number;
        getHeaders(): TablixCell[];
        getOtherDimensionHeaders(): TablixCell[];
        getCellContextualSpan(cell: TablixCell): number;
        getOtherDimensionOwner(cell: TablixCell): ITablixGridItem;
    }
    class TablixGrid {
        private _owner;
        private _rows;
        private _realizedRows;
        private _columns;
        private _realizedColumns;
        private _footerRow;
        private _emptySpaceHeaderCell;
        private _emptyFooterSpaceCell;
        _presenter: TablixGridPresenter;
        private _fillColumnsProportionally;
        constructor(presenter: TablixGridPresenter);
        initialize(owner: TablixControl, gridHost: HTMLElement, footerHost: HTMLElement): void;
        owner: TablixControl;
        fillColumnsProportionally: boolean;
        realizedColumns: TablixColumn[];
        realizedRows: TablixRow[];
        footerRow: TablixRow;
        emptySpaceHeaderCell: TablixCell;
        emptySpaceFooterCell: TablixCell;
        ShowEmptySpaceCells(rowSpan: number, width: number): void;
        HideEmptySpaceCells(): void;
        onStartRenderingSession(clear: boolean): void;
        onStartRenderingIteration(): void;
        onEndRenderingIteration(): void;
        getOrCreateRow(rowIndex: number): TablixRow;
        getOrCreateFootersRow(): TablixRow;
        moveRowsToEnd(moveFromIndex: number, count: number): void;
        moveRowsToStart(moveToIndex: number, count: number): void;
        moveColumnsToEnd(moveFromIndex: number, count: number): void;
        moveColumnsToStart(moveToIndex: number, count: number): void;
        getOrCreateColumn(columnIndex: number): TablixColumn;
        private initializeColumns();
        private clearColumns();
        private initializeRows();
        private clearRows();
        getWidth(): number;
        getHeight(): number;
    }
}

declare module powerbi.visuals.controls.internal {
    /**
     * This class is used for layouts that don't or cannot
     * rely on DOM measurements.  Instead they compute all required
     * widths and heights and store it in this structure.
     */
    class SizeComputationManager {
        private static TablixMinimumColumnWidth;
        private _viewport;
        private _columnCount;
        private _cellWidth;
        private _cellHeight;
        private _scalingFactor;
        hasImageContent: boolean;
        visibleWidth: number;
        visibleHeight: number;
        gridWidth: number;
        gridHeight: number;
        rowHeight: number;
        cellWidth: number;
        cellHeight: number;
        contentWidth: number;
        contentHeight: number;
        updateColumnCount(columnCount: number): void;
        updateRowHeight(rowHeight: number): void;
        updateScalingFactor(scalingFactor: number): void;
        updateViewport(viewport: IViewport): void;
        private computeColumnWidth(totalColumnCount);
        private computeColumnHeight();
        private fitToColumnCount(maxAllowedColumnCount, totalColumnCount);
    }
    class DimensionLayoutManager implements IDimensionLayoutManager {
        static _pixelPrecision: number;
        static _scrollOffsetPrecision: number;
        _grid: TablixGrid;
        _gridOffset: number;
        protected _contextualWidthToFill: number;
        private _owner;
        private _realizationManager;
        private _alignToEnd;
        private _lastScrollOffset;
        private _isScrolling;
        private _fixedSizeEnabled;
        private _done;
        private _measureEnabled;
        constructor(owner: TablixLayoutManager, grid: TablixGrid, realizationManager: TablixDimensionRealizationManager);
        owner: TablixLayoutManager;
        realizationManager: TablixDimensionRealizationManager;
        fixedSizeEnabled: boolean;
        onCornerCellRealized(item: any, cell: ITablixCell, leaf: boolean): void;
        onHeaderRealized(item: any, cell: ITablixCell, leaf: any): void;
        needsToRealize: boolean;
        getVisibleSizeRatio(): number;
        alignToEnd: boolean;
        done: boolean;
        _requiresMeasure(): boolean;
        startScrollingSession(): void;
        endScrollingSession(): void;
        isScrolling(): boolean;
        isResizing(): boolean;
        getOtherHierarchyContextualHeight(): number;
        _isAutoSized(): boolean;
        onStartRenderingSession(): void;
        onEndRenderingSession(): void;
        /**
         * Implementing classes must override this to send dimentions to TablixControl.
         */
        _sendDimensionsToControl(): void;
        measureEnabled: boolean;
        getFooterContextualWidth(): number;
        onStartRenderingIteration(clear: boolean, contextualWidth: number): void;
        allItemsRealized: boolean;
        onEndRenderingIteration(): void;
        private getScrollDeltaWithinPage();
        private swapElements();
        _getRealizedItems(): ITablixGridItem[];
        getRealizedItemsCount(): number;
        _moveElementsToBottom(moveFromIndex: number, count: any): void;
        _moveElementsToTop(moveToIndex: number, count: any): void;
        isScrollingWithinPage(): boolean;
        getGridContextualWidth(): number;
        private updateScrollbar(gridContextualWidth);
        getViewSize(gridContextualWidth: number): number;
        isScrollableHeader(item: any, items: any, index: number): boolean;
        reachedEnd(): boolean;
        scrollBackwardToFill(gridContextualWidth: number): number;
        private getItemContextualWidth(index);
        private getItemContextualWidthWithScrolling(index);
        getSizeWithScrolling(size: number, index: number): number;
        getGridContextualWidthFromItems(): number;
        private getMeaurementError(gridContextualWidth);
        private scrollForwardToAlignEnd(gridContextualWidth);
        dimension: TablixDimension;
        otherLayoutManager: DimensionLayoutManager;
        contextualWidthToFill: number;
        getGridScale(): number;
        otherScrollbarContextualWidth: number;
        getActualContextualWidth(gridContextualWidth: number): number;
        protected canScroll(gridContextualWidth: number): boolean;
        calculateSizes(): void;
        protected _calculateSize(item: ITablixGridItem): number;
        calculateContextualWidths(): void;
        calculateSpans(): void;
        updateNonScrollableItemsSpans(): void;
        updateScrollableItemsSpans(): void;
        fixSizes(): void;
        private updateSpans(otherRealizedItem, cells, considerScrolling);
        private updateLastChildSize(spanningCell, item, totalSpanSize);
    }
    class ResizeState {
        item: any;
        itemType: TablixCellType;
        column: TablixColumn;
        startColumnWidth: number;
        resizingDelta: number;
        animationFrame: number;
        scale: number;
        constructor(column: TablixColumn, width: number, scale: number);
        getNewSize(): number;
    }
    class ColumnLayoutManager extends DimensionLayoutManager implements ITablixResizeHandler {
        static minColumnWidth: number;
        private _resizeState;
        constructor(owner: TablixLayoutManager, grid: TablixGrid, realizationManager: ColumnRealizationManager);
        dimension: TablixDimension;
        isResizing(): boolean;
        fillProportionally: boolean;
        getGridScale(): number;
        otherScrollbarContextualWidth: number;
        _getRealizedItems(): ITablixGridItem[];
        _moveElementsToBottom(moveFromIndex: number, count: any): void;
        _moveElementsToTop(moveToIndex: number, count: any): void;
        _requiresMeasure(): boolean;
        getGridContextualWidth(): number;
        private getFirstVisibleColumn();
        _isAutoSized(): boolean;
        applyScrolling(): void;
        private scroll(firstVisibleColumn, width, offset);
        private scrollCells(cells, width, offset);
        private scrollBodyCells(rows, width, offset);
        onStartResize(cell: TablixCell, currentX: number, currentY: number): void;
        onResize(cell: TablixCell, deltaX: number, deltaY: number): void;
        onEndResize(cell: TablixCell): void;
        onReset(cell: TablixCell): void;
        updateItemToResizeState(realizedColumns: TablixColumn[]): void;
        private performResizing();
        private endResizing();
        /**
         * Sends column related data (pixel size, column count, etc) to TablixControl.
         */
        _sendDimensionsToControl(): void;
        getEstimatedHeaderWidth(label: string, headerIndex: number): number;
        getEstimatedBodyCellWidth(content: string): number;
    }
    class DashboardColumnLayoutManager extends ColumnLayoutManager {
        getEstimatedHeaderWidth(label: string, headerIndex: number): number;
        getEstimatedBodyCellWidth(content: string): number;
        protected canScroll(gridContextualWidth: number): boolean;
        protected _calculateSize(item: ITablixGridItem): number;
        private ignoreColumn(headerIndex);
    }
    class CanvasColumnLayoutManager extends ColumnLayoutManager {
        getEstimatedHeaderWidth(label: string, headerIndex: number): number;
        getEstimatedBodyCellWidth(content: string): number;
        calculateContextualWidths(): void;
        protected canScroll(gridContextualWidth: number): boolean;
        protected _calculateSize(item: ITablixGridItem): number;
    }
    class RowLayoutManager extends DimensionLayoutManager {
        constructor(owner: TablixLayoutManager, grid: TablixGrid, realizationManager: RowRealizationManager);
        dimension: TablixDimension;
        getGridScale(): number;
        otherScrollbarContextualWidth: number;
        startScrollingSession(): void;
        _getRealizedItems(): ITablixGridItem[];
        _moveElementsToBottom(moveFromIndex: number, count: any): void;
        _moveElementsToTop(moveToIndex: number, count: any): void;
        _requiresMeasure(): boolean;
        getGridContextualWidth(): number;
        private getFirstVisibleRow();
        _isAutoSized(): boolean;
        applyScrolling(): void;
        private scroll(firstVisibleRow, height, offset);
        private scrollCells(cells, height, offset);
        getFooterContextualWidth(): number;
        calculateContextualWidths(): void;
        fixSizes(): void;
        /**
         * Sends row related data (pixel size, column count, etc) to TablixControl.
         */
        _sendDimensionsToControl(): void;
        getEstimatedHeaderWidth(label: string, headerIndex: number): number;
    }
    class DashboardRowLayoutManager extends RowLayoutManager {
        getEstimatedHeaderWidth(label: string, headerIndex: number): number;
        protected canScroll(gridContextualWidth: number): boolean;
        protected _calculateSize(item: ITablixGridItem): number;
        private getHeaderWidth(headerIndex);
    }
    class CanvasRowLayoutManager extends RowLayoutManager {
        getEstimatedHeaderWidth(label: string, headerIndex: number): number;
        protected canScroll(gridContextualWidth: number): boolean;
        protected _calculateSize(item: ITablixGridItem): number;
    }
    class TablixLayoutManager {
        protected _owner: TablixControl;
        protected _container: HTMLElement;
        protected _columnLayoutManager: ColumnLayoutManager;
        protected _rowLayoutManager: RowLayoutManager;
        private _binder;
        private _scrollingDimension;
        private _gridHost;
        private _footersHost;
        private _grid;
        private _allowHeaderResize;
        private _columnWidthsToPersist;
        constructor(binder: ITablixBinder, grid: TablixGrid, columnLayoutManager: ColumnLayoutManager, rowLayoutManager: RowLayoutManager);
        initialize(owner: TablixControl): void;
        owner: TablixControl;
        binder: ITablixBinder;
        columnWidthsToPersist: ColumnWidthObject[];
        getTablixClassName(): string;
        getLayoutKind(): TablixLayoutKind;
        getOrCreateColumnHeader(item: any, items: any, rowIndex: number, columnIndex: number): ITablixCell;
        getOrCreateRowHeader(item: any, items: any, rowIndex: number, columnIndex: number): ITablixCell;
        getOrCreateCornerCell(item: any, rowLevel: number, columnLevel: number): ITablixCell;
        getOrCreateBodyCell(cellItem: any, rowItem: any, rowItems: any, rowIndex: number, columnIndex: number): ITablixCell;
        getOrCreateFooterBodyCell(cellItem: any, columnIndex: number): ITablixCell;
        getOrCreateFooterRowHeader(item: any, items: any): ITablixCell;
        getVisibleWidth(): number;
        getVisibleHeight(): number;
        updateColumnCount(rowDimension: TablixRowDimension, columnDimension: TablixColumnDimension): void;
        updateViewport(viewport: IViewport): void;
        getEstimatedRowHeight(): number;
        getCellWidth(cell: ITablixCell): number;
        getContentWidth(cell: ITablixCell): number;
        adjustContentSize(hasImage: boolean): void;
        /**
         * This call makes room for parent header cells where neccessary.
         * Since HTML cells that span vertically displace other rows,
         * room has to be made for spanning headers that leave an exiting
         * row to enter the new row that it starts from and removed when
         * returning to an entering row.
         */
        private alignRowHeaderCells(item, currentRow);
        grid: TablixGrid;
        rowLayoutManager: DimensionLayoutManager;
        columnLayoutManager: DimensionLayoutManager;
        protected showEmptySpaceHeader(): boolean;
        onStartRenderingSession(scrollingDimension: TablixDimension, parentElement: HTMLElement, clear: boolean): void;
        onEndRenderingSession(): void;
        onStartRenderingIteration(clear: boolean): void;
        onEndRenderingIteration(): boolean;
        onCornerCellRealized(item: any, cell: ITablixCell): void;
        onRowHeaderRealized(item: any, cell: ITablixCell): void;
        onRowHeaderFooterRealized(item: any, cell: ITablixCell): void;
        onColumnHeaderRealized(item: any, cell: ITablixCell): void;
        onBodyCellRealized(item: any, cell: ITablixCell): void;
        onBodyCellFooterRealized(item: any, cell: ITablixCell): void;
        setAllowHeaderResize(value: boolean): void;
        enableCellHorizontalResize(isLeaf: boolean, cell: TablixCell): void;
        getEstimatedTextWidth(label: string): number;
        measureSampleText(parentElement: HTMLElement): void;
    }
    class DashboardTablixLayoutManager extends TablixLayoutManager {
        private _characterHeight;
        private _sizeComputationManager;
        constructor(binder: ITablixBinder, sizeComputationManager: SizeComputationManager, grid: TablixGrid, rowRealizationManager: RowRealizationManager, columnRealizationManager: ColumnRealizationManager);
        static createLayoutManager(binder: ITablixBinder): DashboardTablixLayoutManager;
        getTablixClassName(): string;
        getLayoutKind(): TablixLayoutKind;
        protected showEmptySpaceHeader(): boolean;
        measureSampleText(parentElement: HTMLElement): void;
        getVisibleWidth(): number;
        getVisibleHeight(): number;
        getCellWidth(cell: ITablixCell): number;
        getContentWidth(cell: ITablixCell): number;
        getEstimatedTextWidth(label: string): number;
        adjustContentSize(hasImage: boolean): void;
        updateColumnCount(rowDimension: TablixRowDimension, columnDimension: TablixColumnDimension): void;
        updateViewport(viewport: IViewport): void;
        getEstimatedRowHeight(): number;
    }
    class CanvasTablixLayoutManager extends TablixLayoutManager {
        private characterWidth;
        private characterHeight;
        constructor(binder: ITablixBinder, grid: TablixGrid, rowRealizationManager: RowRealizationManager, columnRealizationManager: ColumnRealizationManager);
        static createLayoutManager(binder: ITablixBinder, columnWidthManager: TablixColumnWidthManager): CanvasTablixLayoutManager;
        getTablixClassName(): string;
        getLayoutKind(): TablixLayoutKind;
        measureSampleText(parentElement: HTMLElement): void;
        protected showEmptySpaceHeader(): boolean;
        getVisibleWidth(): number;
        getVisibleHeight(): number;
        getCellWidth(cell: ITablixCell): number;
        getContentWidth(cell: ITablixCell): number;
        getEstimatedTextWidth(text: string): number;
        updateColumnCount(rowDimension: TablixRowDimension, columnDimension: TablixColumnDimension): void;
        updateViewport(viewport: IViewport): void;
        getEstimatedRowHeight(): number;
    }
}

declare module powerbi.visuals.controls {
    module HTMLElementUtils {
        function clearChildren(element: HTMLElement): void;
        function setElementTop(element: HTMLElement, top: number): void;
        function setElementLeft(element: HTMLElement, left: number): void;
        function setElementHeight(element: HTMLElement, height: number): void;
        function setElementWidth(element: HTMLElement, width: number): void;
        function getElementWidth(element: HTMLElement): number;
        function getElementHeight(element: HTMLElement): number;
        function isAutoSize(size: number): boolean;
        function getAccumulatedScale(element: HTMLElement): number;
        /**
         * Get scale of element, return 1 when not scaled.
         */
        function getScale(element: any): number;
    }
}
declare module powerbi.visuals.controls.internal {
    module TablixObjects {
        const ObjectGeneral: string;
        const ObjectGrid: string;
        const ObjectColumnHeaders: string;
        const ObjectRowHeaders: string;
        const ObjectValues: string;
        const ObjectTotal: string;
        const ObjectSubTotals: string;
        interface ObjectValueGetterFunction {
            <T>(objects: DataViewObjects, propertyId: DataViewObjectPropertyIdentifier, defaultValue?: T): T;
        }
        /**
         * Represents a DataViewObjects property related to the Tablix
         */
        class TablixProperty {
            objectName: string;
            propertyName: string;
            defaultValue: any;
            private getterFuntion;
            /**
             * Creates a new TablixProperty
             * @param {string} objectName Object Name
             * @param {string} propertyName Property Name
             * @param {any} defaultValue Default value of the Property
             * @param {ObjectValueGetterFunction} getterFuntion Function used to get the Property value from the Objects
             */
            constructor(objectName: string, propertyName: string, defaultValue: any, getterFuntion: ObjectValueGetterFunction);
            /**
             * Gets the PropertyIdentifier for the Property
             * @returns PropertyIdentifier for the Property
             */
            getPropertyID(): DataViewObjectPropertyIdentifier;
            /**
             * Gets the value of the Property from the Objects
             * @param {DataViewObjects} objects DataView Objects to get the value from
             * @param {boolean} useDefault True to fall back to the Default value if the Property is missing from the objects. False to return undefined
             * @returns Value of the property
             */
            getValue<T>(objects: DataViewObjects): T;
        }
        const PropColumnFormatString: TablixProperty;
        const PropGeneralAutoSizeColumns: TablixProperty;
        const PropGeneralTextSize: TablixProperty;
        const PropGeneralTableTotals: TablixProperty;
        const PropGeneralMatrixRowSubtotals: TablixProperty;
        const PropGeneralMatrixColumnSubtotals: TablixProperty;
        const PropGridVertical: TablixProperty;
        const PropGridVerticalColor: TablixProperty;
        const PropGridVerticalWeight: TablixProperty;
        const PropGridHorizontalTable: TablixProperty;
        const PropGridHorizontalMatrix: TablixProperty;
        const PropGridHorizontalColor: TablixProperty;
        const PropGridHorizontalWeight: TablixProperty;
        const PropGridRowPadding: TablixProperty;
        const PropGridOutlineColor: TablixProperty;
        const PropGridOutlineWeight: TablixProperty;
        const PropGridImageHeight: TablixProperty;
        const PropColumnsFontColor: TablixProperty;
        const PropColumnsBackColor: TablixProperty;
        const PropColumnsOutline: TablixProperty;
        const PropRowsFontColor: TablixProperty;
        const PropRowsBackColor: TablixProperty;
        const PropRowsOutline: TablixProperty;
        const PropValuesBackColor: TablixProperty;
        const PropValuesFontColorPrimary: TablixProperty;
        const PropValuesBackColorPrimary: TablixProperty;
        const PropValuesFontColorSecondary: TablixProperty;
        const PropValuesBackColorSecondary: TablixProperty;
        const PropValuesOutline: TablixProperty;
        const PropValuesUrlIconProp: TablixProperty;
        const PropTotalFontColor: TablixProperty;
        const PropTotalBackColor: TablixProperty;
        const PropTotalOutline: TablixProperty;
        const PropSubTotalsFontColor: TablixProperty;
        const PropSubTotalsBackColor: TablixProperty;
        const PropSubTotalsOutline: TablixProperty;
        /**
         * Get the DataViewObject from the DataView
         * @param {DataView} dataview The DataView
         * @returns DataViewObjects (dataView.metadata.objects)
         */
        function getMetadadataObjects(dataview: DataView): DataViewObjects;
        function enumerateObjectRepetition(enumeration: VisualObjectRepetition[], dataView: DataView, tablixType: TablixType): void;
        function enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions, enumeration: ObjectEnumerationBuilder, dataView: DataView, tablixType: TablixType): void;
        function enumerateGeneralOptions(enumeration: ObjectEnumerationBuilder, objects: DataViewObjects, tablixType: TablixType, dataView: DataView): void;
        function enumerateGridOptions(enumeration: ObjectEnumerationBuilder, objects: DataViewObjects, tablixType: TablixType): void;
        function enumerateColumnHeadersOptions(enumeration: ObjectEnumerationBuilder, objects: DataViewObjects): void;
        function enumerateRowHeadersOptions(enumeration: ObjectEnumerationBuilder, objects: DataViewObjects): void;
        function enumerateValuesOptions(enumeration: ObjectEnumerationBuilder, objects: DataViewObjects, tablixType: TablixType): void;
        function enumerateTotalOptions(enumeration: ObjectEnumerationBuilder, objects: DataViewObjects): void;
        function enumerateSubTotalsOptions(enumeration: ObjectEnumerationBuilder, objects: DataViewObjects): void;
        function getTableObjects(dataView: DataView): TablixFormattingPropertiesTable;
        function getMatrixObjects(dataView: DataView): TablixFormattingPropertiesMatrix;
        /**
         * Generate default objects for the Table/Matrix to set default styling
         * @param {TablixType} tablixType Tablix Type: table | matrix
         * @returns DataViewObjects that can be attached to the DataViewMetadata
         */
        function generateTablixDefaultObjects(tablixType: TablixType): data.DataViewObjectDefinitions;
        function getTextSizeInPx(textSize: number): string;
        function shouldShowTableTotals(objects: DataViewObjects): boolean;
        function shouldShowRowSubtotals(objects: DataViewObjects): boolean;
        function shouldShowColumnSubtotals(objects: DataViewObjects): boolean;
        function shouldShowColumnSubtotalsOption(dataView: DataView): boolean;
        function isDiscourageAggregationAcrossGroups(levels: DataViewHierarchyLevel[]): boolean;
    }
    module TablixUtils {
        const CssClassTablixDiv: string;
        const CssClassContentElement: string;
        const CssClassContentHost: string;
        const CssClassTablixHeader: string;
        const CssClassTablixColumnHeaderLeaf: string;
        const CssClassTablixValueNumeric: string;
        const CssClassTablixValueTotal: string;
        const CssClassValueURLIcon: string;
        const CssClassValueURLIconContainer: string;
        const CssClassMatrixRowHeaderLeaf: string;
        const CssClassMatrixRowHeaderSubTotal: string;
        const CssClassTableFooter: string;
        const CssClassTableBodyCell: string;
        const CssClassTableBodyCellBottom: string;
        const StringNonBreakingSpace: string;
        const UnitOfMeasurement: string;
        const CellPaddingLeft: number;
        const CellPaddingRight: number;
        const CellPaddingLeftMatrixTotal: number;
        const SortIconPadding: number;
        const ImageDefaultAspectRatio: number;
        const FontFamilyCell: string;
        const FontFamilyHeader: string;
        const FontFamilyTotal: string;
        const FontColorCells: string;
        const FontColorHeaders: string;
        interface Surround<T> {
            top?: T;
            right?: T;
            bottom?: T;
            left?: T;
        }
        enum EdgeType {
            Outline = 0,
            Gridline = 1,
        }
        class EdgeSettings {
            /**
             * Weight in pixels. 0 to remove border. Undefined to fall back to CSS
            */
            weight: number;
            color: string;
            type: EdgeType;
            constructor(weight?: number, color?: string);
            applyParams(shown: boolean, weight: number, color?: string, type?: EdgeType): void;
            getCSS(): string;
            /**
             * Returns the priority of the current edge.
             * H. Grid = 0
             * V. Grid = 1
             * H. Outline = 2
             * V. Outline = 3
             * Uknown = -1
             * @param {Surround<EdgeSettings>} edges Edges. Used to determine the side of the current edge
             */
            getPriority(edges: Surround<EdgeSettings>): number;
            getShadowCss(edges: Surround<EdgeSettings>): string;
        }
        /**
         * Style parameters for each Cell
         */
        class CellStyle {
            /**
             * Font family of the cell. If undefined, it will be cleared to fall back to table font family
            */
            fontFamily: string;
            /**
             * Font color of the cell. If undefined, it will be cleared to fall back to table font color
            */
            fontColor: string;
            /**
             * Background color of the cell. If undefined, it will be cleared to fall back to default (transparent)
            */
            backColor: string;
            /**
            * Settings for Borders
            */
            borders: Surround<EdgeSettings>;
            /**
             * Settings for Padding
            */
            paddings: Surround<number>;
            constructor();
            /**
             * Sets the Inline style for the Cell
             * @param {ITablixCell} cell Cell to set style to
             */
            applyStyle(cell: ITablixCell): void;
            getExtraTop(): number;
            getExtraBottom(): number;
            getExtraRight(): number;
            getExtraLeft(): number;
        }
        /**
         * Index within a dimension (row/column)
         */
        class DimensionPosition {
            /**
            * Global index within all leaf nodes
            */
            index: number;
            /**
            * Index within siblings for same parent
            */
            indexInSiblings: number;
            /**
            * Is last globally
            */
            isLast: boolean;
            /**
            * Is first globally
            */
            isFirst: boolean;
        }
        /**
         * Poistion information about the cell
         */
        class CellPosition {
            row: DimensionPosition;
            column: DimensionPosition;
            constructor();
            isMatch(position: CellPosition): boolean;
        }
        class TablixVisualCell {
            dataPoint: any;
            position: TablixUtils.CellPosition;
            columnMetadata: DataViewMetadataColumn;
            isTotal: boolean;
            backColor: string;
            private formatter;
            private nullsAreBlank;
            constructor(dataPoint: any, isTotal: boolean, columnMetadata: DataViewMetadataColumn, formatter: ICustomValueColumnFormatter, nullsAreBlank: boolean);
            textContent: string;
            kpiContent: JQuery;
            isNumeric: boolean;
            isUrl: boolean;
            isImage: boolean;
            isValidUrl: boolean;
            isMatch(item: TablixVisualCell): boolean;
        }
        function createTable(): HTMLTableElement;
        function createDiv(): HTMLDivElement;
        function resetCellCssClass(cell: controls.ITablixCell): void;
        function addCellCssClass(cell: controls.ITablixCell, style: string): void;
        /**
         * Clears all inline styles (border, fontColor, background) and resets CSS classes
         * Performed with unbind-<Cell>
         */
        function clearCellStyle(cell: controls.ITablixCell): void;
        function clearCellTextAndTooltip(cell: controls.ITablixCell): void;
        /**
         * Sets text and tooltip for cell
         * @param {string} text Text to set
         * @param {HTMLElement} elementText Element to set text to
         * @param {HTMLElement} elementTooltip? Element to set tootltip to, if undefined, elementText will be used
         */
        function setCellTextAndTooltip(text: string, elementText: HTMLElement, elementTooltip?: HTMLElement): void;
        function isValidSortClick(e: MouseEvent): boolean;
        function appendATagToBodyCell(value: string, cellElement: HTMLElement, urlIcon?: boolean): void;
        function appendImgTagToBodyCell(value: string, cellElement: HTMLElement, imageHeight: number): void;
        function createKpiDom(kpi: DataViewKpiColumnMetadata, kpiValue: string): JQuery;
        function isValidStatusGraphic(kpi: DataViewKpiColumnMetadata, kpiValue: string): boolean;
        function getCustomSortEventArgs(queryName: string, sortDirection: SortDirection): CustomSortEventArgs;
        function reverseSort(sortDirection: SortDirection): SortDirection;
        /**
         * Add sort icon to a table cell and return the element that should contain the contents
         * @param {SortDirection} itemSort SortDirection
         * @param {HTMLElement} cellDiv The inner DIV of the cell
         */
        function addSortIconToColumnHeader(itemSort: SortDirection, cellDiv: HTMLElement): HTMLElement;
        function removeSortIcons(cell: controls.ITablixCell): void;
    }
}

declare module powerbi.visuals.controls {
    interface ITablixHierarchyNavigator {
        /**
        * Returns the depth of the column hierarchy.
        */
        getColumnHierarchyDepth(): number;
        /**
        * Returns the depth of the Row hierarchy.
        */
        getRowHierarchyDepth(): number;
        /**
         * Returns the leaf count of a hierarchy.
         *
         * @param hierarchy Object representing the hierarchy.
         */
        getLeafCount(hierarchy: any): number;
        /**
         * Returns the leaf member of a hierarchy at the specified index.
         *
         * @param hierarchy Object representing the hierarchy.
         * @param index Index of leaf member.
         */
        getLeafAt(hierarchy: any, index: number): any;
        /**
         * Returns the specified hierarchy member parent.
         *
         * @param item Hierarchy member.
         */
        getParent(item: any): any;
        /**
         * Returns the index of the hierarchy member relative to its parent.
         *
         * @param item Hierarchy member.
         */
        getIndex(item: any): number;
        /**
         * Checks whether a hierarchy member is a leaf.
         *
         * @param item Hierarchy member.
         */
        isLeaf(item: any): boolean;
        isRowHierarchyLeaf(cornerItem: any): boolean;
        isColumnHierarchyLeaf(cornerItem: any): boolean;
        isFirstItem(item: any, items: any): boolean;
        /**
         * Checks whether a hierarchy member is the last item within its parent.
         *
         * @param item Hierarchy member.
         * @param items A collection of hierarchy members.
         */
        isLastItem(item: any, items: any): boolean;
        /**
         * Checks if the item and all its ancestors are the first items in their parent's children
        */
        areAllParentsFirst(item: any, items: any): boolean;
        /**
         * Checks if the item and all its ancestors are the last items in their parent's children
        */
        areAllParentsLast(item: any, items: any): boolean;
        /**
         * Gets the children members of a hierarchy member.
         *
         * @param item Hierarchy member.
         */
        getChildren(item: any): any;
        /**
         * Gets the difference between current level and min children level. Not necessarily 1
         *
         * @param item Hierarchy member.
         */
        getChildrenLevelDifference(item: any): number;
        /**
         * Gets the members count in a specified collection.
         *
         * @param items Hierarchy member.
         */
        getCount(items: any): number;
        /**
         * Gets the member at the specified index.
         *
         * @param items A collection of hierarchy members.
         * @param index Index of member to return.
         */
        getAt(items: any, index: number): any;
        /**
         * Gets the hierarchy member level.
         *
         * @param item Hierarchy member.
         */
        getLevel(item: any): number;
        /**
         * Returns the intersection between a row and a column item.
         *
         * @param rowItem A row member.
         * @param columnItem A column member.
         */
        getIntersection(rowItem: any, columnItem: any): any;
        /**
         * Returns the corner cell between a row and a column level.
         *
         * @param rowLevel A level in the row hierarchy.
         * @param columnLevel A level in the column hierarchy.
         */
        getCorner(rowLevel: number, columnLevel: number): any;
        headerItemEquals(item1: any, item2: any): boolean;
        bodyCellItemEquals(item1: any, item2: any): boolean;
        cornerCellItemEquals(item1: any, item2: any): boolean;
    }
}

declare module powerbi.visuals.controls {
    interface ITablixBinder {
        onStartRenderingSession(): void;
        onEndRenderingSession(): void;
        /**  Binds the row hierarchy member to the DOM element. */
        bindRowHeader(item: any, cell: ITablixCell): void;
        unbindRowHeader(item: any, cell: ITablixCell): void;
        /**  Binds the column hierarchy member to the DOM element. */
        bindColumnHeader(item: any, cell: ITablixCell): void;
        unbindColumnHeader(item: any, cell: ITablixCell): void;
        /**  Binds the intersection between a row and a column hierarchy member to the DOM element. */
        bindBodyCell(item: any, cell: ITablixCell): void;
        unbindBodyCell(item: any, cell: ITablixCell): void;
        /**  Binds the corner cell to the DOM element. */
        bindCornerCell(item: any, cell: ITablixCell): void;
        unbindCornerCell(item: any, cell: ITablixCell): void;
        bindEmptySpaceHeaderCell(cell: ITablixCell): void;
        unbindEmptySpaceHeaderCell(cell: ITablixCell): void;
        bindEmptySpaceFooterCell(cell: ITablixCell): void;
        unbindEmptySpaceFooterCell(cell: ITablixCell): void;
        /**  Measurement Helper */
        getHeaderLabel(item: any): string;
        getCellContent(item: any): string;
        hasRowGroups(): boolean;
    }
}

declare module powerbi.visuals.controls {
    const enum TablixCellType {
        CornerCell = 0,
        RowHeader = 1,
        ColumnHeader = 2,
        BodyCell = 3,
    }
    interface ITablixCell {
        type: TablixCellType;
        item: any;
        colSpan: number;
        rowSpan: number;
        textAlign: string;
        extension: internal.TablixCellPresenter;
        position: internal.TablixUtils.CellPosition;
        contentHeight: number;
        contentWidth: number;
        containerHeight: number;
        containerWidth: number;
        unfixRowHeight(): any;
        applyStyle(style: internal.TablixUtils.CellStyle): void;
    }
    interface IDimensionLayoutManager {
        measureEnabled: boolean;
        getRealizedItemsCount(): number;
        needsToRealize: boolean;
    }
}

declare module powerbi.visuals.controls {
    const TablixDefaultTextSize: number;
    interface TablixRenderArgs {
        rowScrollOffset?: number;
        columnScrollOffset?: number;
        scrollingDimension?: TablixDimension;
    }
    interface GridDimensions {
        rowCount?: number;
        columnCount?: number;
        rowHierarchyWidth?: number;
        rowHierarchyHeight?: number;
        rowHierarchyContentHeight?: number;
        columnHierarchyWidth?: number;
        columnHierarchyHeight?: number;
        footerHeight?: number;
    }
    const enum TablixLayoutKind {
        /**
         * The default layout is based on DOM measurements and used on the canvas.
         */
        Canvas = 0,
        /**
         * The DashboardTile layout must not rely on any kind of DOM measurements
         * since the tiles are created when the dashboard is not visible and the
         * visual is not rendered; thus no measurements are available.
         */
        DashboardTile = 1,
    }
    interface TablixOptions {
        interactive?: boolean;
        enableTouchSupport?: boolean;
        layoutKind?: TablixLayoutKind;
        fontSize?: string;
    }
    class TablixControl {
        private static UnitOfMeasurement;
        private static TablixContainerClassName;
        private static TablixTableAreaClassName;
        private static TablixFooterClassName;
        private static DefaultFontSize;
        private static MaxRenderIterationCount;
        private hierarchyTablixNavigator;
        private binder;
        private columnDim;
        private rowDim;
        private controlLayoutManager;
        private containerElement;
        private mainDiv;
        private footerDiv;
        private scrollBarElementWidth;
        private touchManager;
        private columnTouchDelegate;
        private rowTouchDelegate;
        private bodyTouchDelegate;
        private footerTouchDelegate;
        private touchInterpreter;
        private footerTouchInterpreter;
        private gridDimensions;
        private lastRenderingArgs;
        private _autoSizeWidth;
        private _autoSizeHeight;
        private viewPort;
        private maximumWidth;
        private maximumHeight;
        private minimumWidth;
        private minimumHeight;
        private textFontSize;
        private textFontFamily;
        private textFontColor;
        private options;
        private isTouchEnabled;
        private renderIterationCount;
        constructor(hierarchyNavigator: ITablixHierarchyNavigator, layoutManager: internal.TablixLayoutManager, binder: ITablixBinder, parentDomElement: HTMLElement, options: TablixOptions);
        private InitializeTouchSupport();
        private InitializeScrollbars();
        container: HTMLElement;
        contentHost: HTMLElement;
        footerHost: HTMLElement;
        className: string;
        hierarchyNavigator: ITablixHierarchyNavigator;
        getBinder(): ITablixBinder;
        autoSizeWidth: boolean;
        autoSizeHeight: boolean;
        maxWidth: number;
        viewport: IViewport;
        maxHeight: number;
        minWidth: number;
        minHeight: number;
        fontSize: string;
        fontFamily: string;
        fontColor: string;
        scrollbarWidth: number;
        updateModels(resetScrollOffsets: boolean, rowModel: any, columnModel: any): void;
        updateColumnDimensions(rowHierarchyWidth: number, columnHierarchyWidth: number, count: number): void;
        updateRowDimensions(columnHierarchyHeight: number, rowHierarchyHeight: number, rowHierarchyContentHeight: number, count: number, footerHeight: any): void;
        private updateTouchDimensions();
        private onMouseWheel(e);
        private onFireFoxMouseWheel(e);
        private determineDimensionToScroll(e, scrollCallback);
        private determineDimensionToScrollFirefox(e, scrollCallback);
        layoutManager: internal.TablixLayoutManager;
        columnDimension: TablixColumnDimension;
        rowDimension: TablixRowDimension;
        refresh(clear: boolean): void;
        _onScrollAsync(dimension: TablixDimension): void;
        private performPendingScroll(dimension);
        private updateHorizontalPosition();
        updateFooterVisibility(): void;
        private updateVerticalPosition();
        private alreadyRendered(scrollingDimension);
        private render(clear, scrollingDimension);
        private updateContainerDimensions();
        private cornerCellMatch(item, cell);
        private renderCorner();
        _unbindCell(cell: ITablixCell): void;
        private onTouchEvent(args);
    }
}

declare module powerbi.visuals.controls {
    class TablixDimension {
        _hierarchyNavigator: ITablixHierarchyNavigator;
        _otherDimension: any;
        _owner: TablixControl;
        _binder: ITablixBinder;
        _tablixLayoutManager: internal.TablixLayoutManager;
        _layoutManager: IDimensionLayoutManager;
        model: any;
        modelDepth: number;
        scrollOffset: number;
        private _scrollStep;
        private _firstVisibleScrollIndex;
        private _scrollbar;
        _scrollItems: any[];
        constructor(tablixControl: TablixControl);
        _onStartRenderingIteration(): void;
        _onEndRenderingIteration(): void;
        getValidScrollOffset(scrollOffset: number): number;
        makeScrollOffsetValid(): void;
        getIntegerScrollOffset(): number;
        getFractionScrollOffset(): number;
        scrollbar: Scrollbar;
        getFirstVisibleItem(level: number): any;
        getFirstVisibleChild(item: any): any;
        getFirstVisibleChildIndex(item: any): number;
        _initializeScrollbar(parentElement: HTMLElement, touchDiv: HTMLDivElement, layoutKind: TablixLayoutKind): void;
        getItemsCount(): number;
        getDepth(): number;
        private onScroll();
        otherDimension: TablixDimension;
        layoutManager: IDimensionLayoutManager;
        _createScrollbar(parentElement: HTMLElement, layoutKind: TablixLayoutKind): Scrollbar;
        private updateScrollPosition();
    }
    class TablixRowDimension extends TablixDimension {
        private _footer;
        constructor(tablixControl: TablixControl);
        setFooter(footerHeader: any): void;
        hasFooter(): boolean;
        /**
         * This method first populates the footer followed by each row and their correlating body cells from top to bottom.
         */
        _render(): void;
        _createScrollbar(parentElement: HTMLElement, layoutKind: TablixLayoutKind): Scrollbar;
        /**
         * This function is a recursive call (with its recursive behavior in addNode()) that will navigate
         * through the row hierarchy in DFS (Depth First Search) order and continue into a single row
         * upto its estimated edge.
         */
        private addNodes(items, rowIndex, depth, firstVisibleIndex);
        getFirstVisibleChildLeaf(item: any): any;
        private bindRowHeader(item, cell);
        /**
         * This method can be thought of as the continuation of addNodes() as it continues the DFS (Depth First Search)
         * started from addNodes(). This function also handles ending the recursion with "_needsToRealize" being set to
         * false.
         *
         * Once the body cells are reached, populating is done linearly with addBodyCells().
         */
        private addNode(item, items, rowIndex, depth);
        private rowHeaderMatch(item, cell);
        private addBodyCells(item, items, rowIndex);
        private bindBodyCell(item, cell);
        private addFooterRowHeader(item);
        private addFooterBodyCells(rowItem);
        private bodyCelMatch(item, cell);
    }
    class TablixColumnDimension extends TablixDimension {
        constructor(tablixControl: TablixControl);
        _render(): void;
        _createScrollbar(parentElement: HTMLElement, layoutKind: TablixLayoutKind): Scrollbar;
        private addNodes(items, columnIndex, depth, firstVisibleIndex);
        private addNode(item, items, columnIndex, depth);
        columnHeaderMatch(item: any, cell: ITablixCell): boolean;
    }
}

declare module powerbi.visuals.controls {
    /**
     * This class represents the touch region of the column headers (this can also apply to footer/total).
     * This class is reponsible for interpreting gestures in terms of pixels to changes in column position.
     *
     * Unlike the table body, this can only scroll in one direction.
     */
    class ColumnTouchDelegate implements TouchUtils.ITouchHandler, TouchUtils.IPixelToItem {
        /**
         * Used to termine if the touch event is within bounds.
         */
        private dim;
        /**
         * Average pixel width of columns in table.
         */
        private averageSize;
        /**
         * Used for 'firing' a scroll event following a received gesture.
         */
        private tablixControl;
        /**
         * Stores the event handler of TablixControl for scroll events.
         */
        private handlers;
        /**
         * @constructor
         * @param region Location and area of the touch region in respect to its HTML element.
         */
        constructor(region: TouchUtils.Rectangle);
        dimension: TouchUtils.Rectangle;
        /**
         * Sets the amount of columns to be shifted per delta in pixels.
         *
         * @param xRatio Column to pixel ratio (# columns / # pixels).
         */
        setScrollDensity(xRatio: number): void;
        /**
         * Resize element.
         *
         * @param x X location from upper left of listened HTML element.
         * @param y Y location from upper left of listened HTML element.
         * @param width Width of area to listen for events.
         * @param height Height of area to listen for events.
         */
        resize(x: number, y: number, width: number, height: number): void;
        /**
         * @see IPixelToItem.
         */
        getPixelToItem(x: number, y: number, dx: number, dy: number, down: boolean): TouchUtils.TouchEvent;
        /**
         * Fires event to Tablix Control to scroll with the event passed from the TouchManager.
         *
         * @param e Event recieved from touch manager.
         */
        touchEvent(e: TouchUtils.TouchEvent): void;
        /**
         * Asigns handler for scrolling when scroll event is fired.
         *
         * @param tablixObj TablixControl that's handling the fired event.
         * @param handlerCall The call to be made (EXAMPLE: handlerCall = object.method;).
         */
        setHandler(tablixObj: TablixControl, handlerCall: (args: any[]) => void): void;
    }
    /**
     * This class represents the touch region of the row headers (left or right side aligned).
     * This class is reponsible for interpreting gestures in terms of pixels to changes in row position.
     *
     * Unlike the table body, this can only scroll in one direction.
     */
    class RowTouchDelegate implements TouchUtils.ITouchHandler, TouchUtils.IPixelToItem {
        /**
         * Used to termine if the touch event is within bounds.
         */
        private dim;
        /**
         * Average pixel height of rows in table.
         */
        private averageSize;
        /**
         * Used for 'firing' a scroll event following a recieved gesture.
         */
        private tablixControl;
        /**
         * Stores the event handler of TablixControl for scroll events.
         */
        private handlers;
        /**
         * @constructor
         * @param region Location and area of the touch region in respect to its HTML element.
         */
        constructor(region: TouchUtils.Rectangle);
        dimension: TouchUtils.Rectangle;
        /**
         * Sets the amount of rows to be shifted per delta in pixels.
         *
         * @param yRatio Row to pixel ratio (# rows / # pixels).
         */
        setScrollDensity(yRatio: number): void;
        /**
         * Resize element.
         * @param x X location from upper left of listened HTML element.
         * @param y Y location from upper left of listened HTML element.
         * @param width Width of area to listen for events.
         * @param height Height of area to listen for events.
         */
        resize(x: number, y: number, width: number, height: number): void;
        /**
         * @see: IPixelToItem
         */
        getPixelToItem(x: number, y: number, dx: number, dy: number, down: boolean): TouchUtils.TouchEvent;
        /**
         * Fires event to Tablix Control to scroll with the event passed from the TouchManager.
         *
         * @param e Event recieved from touch manager.
         */
        touchEvent(e: TouchUtils.TouchEvent): void;
        /**
         * Asigns handler for scrolling when scroll event is fired.
         *
         * @param tablixObj TablixControl that's handling the fired event.
         * @param handlerCall The call to be made (EXAMPLE: handlerCall = object.method;).
         */
        setHandler(tablixObj: TablixControl, handlerCall: (args: any[]) => void): void;
    }
    /**
     * This class represents the touch region covering the body of the table.
     * This class is reponsible for interpreting gestures in terms of pixels to
     * changes in row and column position.
     */
    class BodyTouchDelegate implements TouchUtils.ITouchHandler, TouchUtils.IPixelToItem {
        private static DefaultAverageSizeX;
        private static DefaultAverageSizeY;
        /**
         * Used to termine if the touch event is within bounds.
         */
        private dim;
        /**
         * Average pixel width of columns in table.
         */
        private averageSizeX;
        /**
         * Average pixel height of rows in table.
         */
        private averageSizeY;
        /**
         * Used for 'firing' a scroll event following a recieved gesture.
         */
        private tablixControl;
        /**
         * Stores the event handler of TablixControl for scroll events.
         */
        private handlers;
        /**
         * @constructor
         * @param region Location and area of the touch region in respect to its HTML element.
         */
        constructor(region: TouchUtils.Rectangle);
        /**
         * Returns dimension.
         *
         * @return The dimentions of the region this delegate listens to.
         */
        dimension: TouchUtils.Rectangle;
        /**
         * Sets the amount of rows and columns to be shifted per delta in pixels.
         *
         * @param xRatio Column to pixel ratio (# columns / # pixels)
         * @param yRatio Row to pixel ratio (# rows / # pixels)
         */
        setScrollDensity(xRatio: number, yRatio: number): void;
        /**
         * Resize element.
         *
         * @param x X location from upper left of listened HTML element.
         * @param y Y location from upper left of listened HTML element.
         * @param width Width of area to listen for events.
         * @param height Height of area to listen for events.
         */
        resize(x: number, y: number, width: number, height: number): void;
        /**
         * @see: IPixelToItem.
         */
        getPixelToItem(x: number, y: number, dx: number, dy: number, down: boolean): TouchUtils.TouchEvent;
        /**
         * Fires event to Tablix Control to scroll with the event passed from the TouchManager.
         *
         * @param e Event recieved from touch manager.
         */
        touchEvent(e: TouchUtils.TouchEvent): void;
        /**
         * Asigns handler for scrolling when scroll event is fired.
         *
         * @param tablixObj TablixControl that's handling the fired event.
         * @param handlerCall The call to be made (EXAMPLE: handlerCall = object.method;).
         */
        setHandler(tablixObj: TablixControl, handlerCall: (args: any[]) => void): void;
    }
}

declare module powerbi.visuals.controls.TouchUtils {
    class Point {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        offset(offsetX: number, offsetY: number): void;
    }
    class Rectangle extends Point {
        width: number;
        height: number;
        constructor(x?: number, y?: number, width?: number, height?: number);
        point: Point;
        contains(p: Point): boolean;
        static contains(rect: Rectangle, p: Point): boolean;
        static isEmpty(rect: Rectangle): boolean;
    }
    const enum SwipeDirection {
        /**
         * Swipe gesture moves along the y-axis at an angle within an established threshold.
         */
        Vertical = 0,
        /**
         * Swipe gesture moves along the x-axis at an angle within an established threshold.
         */
        Horizontal = 1,
        /**
         * Swipe gesture does not stay within the thresholds of either x or y-axis.
         */
        FreeForm = 2,
    }
    enum MouseButton {
        NoClick = 0,
        LeftClick = 1,
        RightClick = 2,
        CenterClick = 3,
    }
    /**
     * Interface serves as a way to convert pixel point to any needed unit of
     * positioning over two axises such as row/column positioning.
     */
    interface IPixelToItem {
        getPixelToItem(x: number, y: number, dx: number, dy: number, down: boolean): TouchEvent;
    }
    /**
     * Interface for listening to a simple touch event that's abstracted away
     * from any platform specific traits.
     */
    interface ITouchHandler {
        touchEvent(e: TouchEvent): void;
    }
    /**
     * A simple touch event class that's abstracted away from any platform specific traits.
     */
    class TouchEvent {
        /**
         * X-axis (not neccessarily in pixels (see IPixelToItem)).
         */
        private _x;
        /**
         * Y-axis (not neccessarily in pixels (see IPixelToItem)).
         */
        private _y;
        /**
         * Delta of x-axis (not neccessarily in pixels (see IPixelToItem)).
         */
        private _dx;
        /**
         * Delta of y-axis (not neccessarily in pixels (see IPixelToItem)).
         */
        private _dy;
        /**
         * Determines if the mouse button is pressed.
         */
        private isMouseButtonDown;
        /**
         * @constructor
         * @param x X Location of mouse.
         * @param y Y Location of mouse.
         * @param isMouseDown Indicates if the mouse button is held down or a finger press on screen.
         * @param dx (optional) The change in x of the gesture.
         * @param dy (optional) The change in y of the gesture.
         */
        constructor(x: number, y: number, isMouseDown: boolean, dx?: number, dy?: number);
        x: number;
        y: number;
        dx: number;
        dy: number;
        /**
         * Returns a boolean indicating if the mouse button is held down.
         *
         * @return: True if the the mouse button is held down,
         * otherwise false.
         */
        isMouseDown: boolean;
    }
    /**
     * This interface defines the datamembers stored for each touch region.
     */
    interface ITouchHandlerSet {
        handler: ITouchHandler;
        region: Rectangle;
        lastPoint: TouchEvent;
        converter: IPixelToItem;
    }
    /**
     * This class "listens" to the TouchEventInterpreter  to recieve touch events and sends it to all
     * "Touch Delegates" with  TouchRegions that contain the mouse event. Prior to sending off the
     * event, its position is put in respect to the delegate's TouchRegion and converted to the appropriate
     * unit (see IPixelToItem).
     */
    class TouchManager {
        /**
         * List of touch regions and their correlating data memebers.
         */
        private touchList;
        /**
         * Boolean to enable thresholds for fixing to an axis when scrolling.
         */
        private scrollThreshold;
        /**
         * Boolean to enable locking to an axis when gesture is fixed to an axis.
         */
        private lockThreshold;
        /**
         * The current direction of the swipe.
         */
        private swipeDirection;
        /**
         * The count of consecutive events match the current swipe direction.
         */
        private matchingDirectionCount;
        /**
         * The last recieved mouse event.
         */
        private lastTouchEvent;
        /**
         * Default constructor.
         *
         * The default behavior is to enable thresholds and lock to axis.
         */
        constructor();
        lastEvent: TouchEvent;
        /**
         * @param region Rectangle indicating the locations of the touch region.
         * @param handler Handler for recieved touch events.
         * @param converter Converts from pixels to the wanted item of measure (rows, columns, etc).
         *
         * EXAMPLE: dx -> from # of pixels to the right to # of columns moved to the right.
         */
        addTouchRegion(region: Rectangle, handler: ITouchHandler, converter: IPixelToItem): void;
        /**
         * Sends a mouse up event to all regions with their last event as a mouse down event.
         */
        upAllTouches(): void;
        touchEvent(e: TouchEvent): void;
        /**
         * @param e Position of event used to find touched regions
         * @return Array of regions that contain the event point.
         */
        private _findRegions(e);
        /**
         * @return Array of regions that contain a mouse down event. (see ITouchHandlerSet.lastPoint).
         */
        private _getActive();
    }
    /**
     * This class is responsible for establishing connections to handle touch events
     * and to interpret those events so they're compatible with the touch abstractions.
     *
     * Touch events with platform specific handles should be done here.
     */
    class TouchEventInterpreter {
        /**
         * HTML element that touch events are drawn from.
         */
        private touchPanel;
        /**
         * Boolean enabling mouse drag.
         */
        private allowMouseDrag;
        /**
         * Touch events are interpreted and passed on this manager.
         */
        private manager;
        /**
         * @see TablixLayoutManager.
         */
        private scale;
        /**
         * Used for mouse location when a secondary div is used along side the primary with this one being the primary.
         */
        private touchReferencePoint;
        /**
         * Rectangle containing the targeted Div.
         */
        private rect;
        private documentMouseMoveWrapper;
        private documentMouseUpWrapper;
        /**
         * Those setting related to swipe detection
         * touchStartTime - the time that the user touched down the screen.
         */
        private touchStartTime;
        /**
         * The page y value of the touch event when the user touched down.
         */
        private touchStartPageY;
        /**
         * The last page y value befoer the user raised up his finger.
         */
        private touchLastPageY;
        /**
         * The last page x value befoer the user raised up his finger.
         */
        private touchLastPageX;
        /**
         * An indicator whether we are now running the slide affect.
         */
        private sliding;
        constructor(manager: TouchManager);
        initTouch(panel: HTMLElement, touchReferencePoint?: HTMLElement, allowMouseDrag?: boolean): void;
        private getXYByClient(pageX, pageY, rect);
        onTouchStart(e: any): void;
        onTouchMove(e: any): void;
        onTouchEnd(e: any): void;
        onTouchMouseDown(e: MouseEvent): void;
        onTouchMouseMove(e: MouseEvent): void;
        onTouchMouseUp(e: MouseEvent, bubble?: boolean): void;
        private getSwipeInfo();
        private didUserSwipe(swipeInfo);
        /**
         * In case of swipe - auto advance to the swipe direction in 2 steps.
         */
        private startSlideAffect(swipeInfo);
        private didUserChangeDirection(swipeInfo);
        private slide(point, slideDist, swipeInfo);
        private clearSlide();
        private upAllTouches();
        private clearTouchEvents();
    }
}

declare module powerbi.visuals.controls {
    enum TablixType {
        Matrix = 0,
        Table = 1,
    }
    /**
     * General section of Formatting Properties for Tablix
    */
    interface TablixFormattingPropertiesGeneral {
        /** Property that drives whether columns should use automatically calculated (based on content) sizes for width or use persisted sizes.
        Default is true i.e. automatically calculate width based on column content */
        autoSizeColumnWidth: boolean;
        /**
         * Font size for the whole tablix
         * Default is 8
        */
        textSize: number;
    }
    /**
     * General section of Formatting Properties for Table
    */
    interface TablixFormattingPropertiesGeneralTable extends TablixFormattingPropertiesGeneral {
        totals?: boolean;
    }
    /**
     * General section of Formatting Properties for Matrix
    */
    interface TablixFormattingPropertiesGeneralMatrix extends TablixFormattingPropertiesGeneral {
        /**
        * Show/Hide Subtotal Rows
        */
        rowSubtotals?: boolean;
        /**
        * Show/Hide Subtotal Columns
        */
        columnSubtotals?: boolean;
    }
    /**
    * Grid section of Formatting Properties for Tablix
    */
    interface TablixFormattingPropertiesGrid {
        /**
        * Show/Hide vertical gridlines
       */
        gridVertical?: boolean;
        /**
         * vertical gridlines color
        */
        gridVerticalColor?: string;
        /**
         * vertical gridlines Weight
        */
        gridVerticalWeight?: number;
        /**
         * Show/Hide horizontal gridlines
        */
        gridHorizontal?: boolean;
        /**
         * horizontal gridlines color
        */
        gridHorizontalColor?: string;
        /**
         * horizontal gridlines Weight
        */
        gridHorizontalWeight?: number;
        /**
         * Color of the outline. Shared across all regions
        */
        outlineColor?: string;
        /**
         * Weight outline. Shared across all regions
        */
        outlineWeight?: number;
        /**
         * Weight outline. Shared across all regions
        */
        rowPadding?: number;
        /**
         * Maximum height of images in pixels
        */
        imageHeight?: number;
    }
    /**
     * Common Formatting Properties for Tablix regions (Column Headers, Row Headers, Total, SubTotals)
    */
    interface TablixFormattingPropertiesRegion {
        fontColor?: string;
        backColor?: string;
        outline: string;
    }
    interface TablixFormattingPropertiesValues {
        fontColorPrimary?: string;
        backColorPrimary?: string;
        fontColorSecondary?: string;
        backColorSecondary?: string;
        outline: string;
    }
    /**
     * Formatting Properties for Table Values region
    */
    interface TablixFormattingPropertiesValuesTable extends TablixFormattingPropertiesValues {
        urlIcon?: boolean;
    }
    /**
     * Formatting Properties for Table Visual
    */
    interface TablixFormattingPropertiesTable {
        general?: TablixFormattingPropertiesGeneralTable;
        grid?: TablixFormattingPropertiesGrid;
        columnHeaders?: TablixFormattingPropertiesRegion;
        values?: TablixFormattingPropertiesValuesTable;
        total?: TablixFormattingPropertiesRegion;
    }
    /**
     * Formatting Properties for Matrix Visual
    */
    interface TablixFormattingPropertiesMatrix {
        general?: TablixFormattingPropertiesGeneralMatrix;
        grid?: TablixFormattingPropertiesGrid;
        columnHeaders?: TablixFormattingPropertiesRegion;
        rowHeaders?: TablixFormattingPropertiesRegion;
        values?: TablixFormattingPropertiesValues;
        subtotals?: TablixFormattingPropertiesRegion;
    }
}

declare module powerbi.visuals.controls {
    /**
     * Column Width Object identifying a certain column and its width
     */
    interface ColumnWidthObject {
        /**
        * QueryName of the Column
        */
        queryName: string;
        /**
        * Flag indicating whether the Column should have a fixed size or fit its size to the contents
        */
        isFixed: boolean;
        /**
        * Width of the column in px.
        * If isFixed=False, undefined always
        * If isFixed=True, undefined if unknown
        */
        width?: number;
    }
    /**
     * Collection of Column Widths indexed by Column's queryName
    */
    interface ColumnWidthCollection {
        [queryName: string]: ColumnWidthObject;
    }
    /**
    * Handler for Column Width Changed event
    */
    interface ColumnWidthChangedCallback {
        (columnWidthChangedEventArgs: ColumnWidthObject): void;
    }
    /**
     * Handler for requesting host to persist Column Width Objects
     */
    interface HostPersistCallBack {
        (visualObjectInstances: VisualObjectInstancesToPersist): void;
    }
    class TablixColumnWidthManager {
        /**
        * PropertyID for Column Widths (General > columnWidth)
        */
        private static columnWidthProp;
        /**
        * Array holding widths for all columns. Index is the queryName of the column
        */
        private columnWidthObjects;
        /**
        * Visual Object Instances to be persisted. Containing autoSizeProperty and any width to remove/merge
        */
        private visualObjectInstancesToPersist;
        /**
         * True if the Tablix is a Matrix
         */
        private isMatrix;
        /**
        * Array of all leaf nodes (Row Groupings + Columns/Values instances)
        */
        private matrixLeafNodes;
        /**
        * Current DataView
        */
        private currentDataView;
        /**
        * Current value of AutoSizeColumns after last DataView Update
        */
        private currentAutoColumnSizePropertyValue;
        /**
        * Previous DataView
        */
        private previousDataView;
        /**
        * Previous value of AutoSizeColumns before last DataView Update
        */
        private previousAutoColumnSizePropertyValue;
        /**
        * Handler for requesting host to persist Column Width Objects
        */
        private hostPersistCallBack;
        constructor(dataView: DataView, isMatrix: boolean, hostPersistCallBack: HostPersistCallBack, matrixLeafNodes?: MatrixVisualNode[]);
        /**
         * Update the current DataView
         * @param {dataView} DataView new DataView
         * @param {MatrixVisualNode[]} matrixLeafNodes? (Optional)Matrix Leaf Nodes
         */
        updateDataView(dataView: DataView, matrixLeafNodes?: MatrixVisualNode[]): void;
        /**
        * Destroy columnWidthObjects and construct it again from the currently displayed Columns with initial width undefined
        */
        private updateColumnsMetadata();
        private updateTableColumnsMetadata();
        private updateMatrixColumnsMetadata();
        /**
         * Update the column widths after a dataViewChange
         */
        updateTablixColumnWidths(): void;
        /**
         * Remove all persisted columns widths and Update visualObjectInstancesToPersist
         */
        private autoSizeAllColumns();
        /**
         * Read the Column Widths from the Columns metadata
         * @param {DataViewMetadataColumn[]} columnMetadata Columns metadata
         */
        private deserializeColumnsWidth(columnsMetadata);
        /**
         * Returns a value indicating that autoSizeColumns was flipped from true to false
         */
        shouldPersistAllColumnWidths(): boolean;
        /**
         * Returns a value indicating that autoSizeColumns was flipped from false to true
         */
        shouldClearAllColumnWidths(): boolean;
        /**
        * Gets the QueryName associated with a Column (Column Header or Corner Item)
        * @param {internal.TablixColumn} column TablixColumn
        * @returns queryName
        */
        static getColumnQueryName(column: internal.TablixColumn): string;
        /**
         * Returns the current columnWidthObjects
         * @returns current columnWidthObjects including undefined widths for autosized or unknown columns
         */
        getColumnWidthObjects(): ColumnWidthCollection;
        /**
         * Returns the current columnWidthObjects for only the fixed-size columns
         * @returns Returns the current columnWidthObjects excluding auto-sized columns
         */
        getFixedColumnWidthObjects(): ColumnWidthCollection;
        /**
         * Get the persisted width of a certain column in px, or undefined if the columns is set to autosize or queryName is not found
         * @param {string} queryName queryName of the Column
         * @returns Column persisted width in pixel
         */
        getPersistedColumnWidth(queryName: string): number;
        /**
         * Call the host to persist the data
         * @param {boolean} generateInstances
         */
        private callHostToPersist();
        /**
         * Handler for a column width change by the user
         * @param {string} queryName queryName of the Column
         * @param {number} width new width
         */
        onColumnWidthChanged(queryName: string, width: number): void;
        /**
         * Event handler after rendering all columns. Setting any unknown column width.
         * Returns True if it calls persist
         * @param renderedColumns Rendered Columns
         */
        onColumnsRendered(renderedColumns: ColumnWidthObject[]): boolean;
        private generateColumnWidthObjectToPersist(queryName, width);
    }
}

declare module powerbi.visuals {
    interface AnimatedTextConfigurationSettings {
        align?: string;
        maxFontSize?: number;
    }
    /**
     * Base class for values that are animated when resized.
     */
    class AnimatedText {
        /** Note: Public for testability */
        static formatStringProp: DataViewObjectPropertyIdentifier;
        protected animator: IGenericAnimator;
        private name;
        /** Note: Public for testability */
        svg: D3.Selection;
        currentViewport: IViewport;
        value: any;
        hostServices: IVisualHostServices;
        style: IVisualStyle;
        visualConfiguration: AnimatedTextConfigurationSettings;
        metaDataColumn: DataViewMetadataColumn;
        private mainText;
        constructor(name: string);
        getMetaDataColumn(dataView: DataView): void;
        getAdjustedFontHeight(availableWidth: number, textToMeasure: string, seedFontHeight: number): number;
        private getAdjustedFontHeightCore(textProperties, availableWidth, seedFontHeight, iteration);
        clear(): void;
        doValueTransition(startValue: any, endValue: any, displayUnitSystemType: DisplayUnitSystemType, animationOptions: AnimationOptions, duration: number, forceUpdate: boolean, formatter?: IValueFormatter): void;
        setTextColor(color: string): void;
        getSeedFontHeight(boundingWidth: number, boundingHeight: number): number;
        getTranslateX(width: number): number;
        getTranslateY(height: number): number;
        getTextAnchor(): string;
        protected getFormatString(column: DataViewMetadataColumn): string;
    }
}

declare module powerbi.visuals {
    /**
     * Renders a number that can be animate change in value.
     */
    class AnimatedNumber extends AnimatedText implements IVisual {
        private options;
        private dataViews;
        private formatter;
        constructor(svg?: D3.Selection, animator?: IGenericAnimator);
        init(options: VisualInitOptions): void;
        updateViewportDependantProperties(): void;
        update(options: VisualUpdateOptions): void;
        setFormatter(formatter?: IValueFormatter): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport): void;
        canResizeTo(viewport: IViewport): boolean;
        private updateInternal(target, suppressAnimations, forceUpdate?, formatter?);
    }
}

declare module powerbi.visuals {
    interface BasicShapeDataViewObjects extends DataViewObjects {
        general: BasicShapeDataViewObject;
        line: LineObject;
        fill: FillObject;
        rotation: RotationObject;
    }
    interface LineObject extends DataViewObject {
        lineColor: Fill;
        roundEdge: number;
        weight: number;
        transparency: number;
    }
    interface FillObject extends DataViewObject {
        transparency: number;
        fillColor: Fill;
        show: boolean;
    }
    interface RotationObject extends DataViewObject {
        angle: number;
    }
    interface BasicShapeDataViewObject extends DataViewObject {
        shapeType: string;
        shapeSvg: string;
    }
    interface BasicShapeData {
        shapeType: string;
        lineColor: string;
        lineTransparency: number;
        lineWeight: number;
        showFill: boolean;
        fillColor: string;
        shapeTransparency: number;
        roundEdge: number;
        angle: number;
    }
    class BasicShapeVisual implements IVisual {
        private currentViewport;
        private element;
        private data;
        private selection;
        static DefaultShape: string;
        static DefaultStrokeColor: string;
        static DefaultFillColor: string;
        static DefaultFillShowValue: boolean;
        static DefaultFillTransValue: number;
        static DefaultWeightValue: number;
        static DefaultLineTransValue: number;
        static DefaultRoundEdgeValue: number;
        static DefaultAngle: number;
        /**property for the shape line color */
        shapeType: string;
        /**property for the shape line color */
        lineColor: string;
        /**property for the shape line transparency */
        lineTransparency: number;
        /**property for the shape line weight */
        lineWeight: number;
        /**property for the shape round edge */
        roundEdge: number;
        /**property for showing the fill properties */
        showFill: boolean;
        /**property for the shape line color */
        fillColor: string;
        /**property for the shape fill transparency */
        shapeTransparency: number;
        /**property for the shape angle */
        angle: number;
        init(options: VisualInitOptions): void;
        constructor(options?: VisualInitOptions);
        update(options: VisualUpdateOptions): void;
        private getDataFromDataView(dataViewObject);
        private scaleTo360Deg(angle);
        private getValueFromColor(color);
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        render(): void;
    }
}

declare module powerbi.visuals {
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    const DEFAULT_AXIS_COLOR: string;
    const enum CartesianChartType {
        Line = 0,
        Area = 1,
        StackedArea = 2,
        ClusteredColumn = 3,
        StackedColumn = 4,
        ClusteredBar = 5,
        StackedBar = 6,
        HundredPercentStackedBar = 7,
        HundredPercentStackedColumn = 8,
        Scatter = 9,
        ComboChart = 10,
        DataDot = 11,
        Waterfall = 12,
        LineClusteredColumnCombo = 13,
        LineStackedColumnCombo = 14,
        DataDotClusteredColumnCombo = 15,
        DataDotStackedColumnCombo = 16,
    }
    interface CalculateScaleAndDomainOptions {
        viewport: IViewport;
        margin: IMargin;
        showCategoryAxisLabel: boolean;
        showValueAxisLabel: boolean;
        forceMerge: boolean;
        categoryAxisScaleType: string;
        valueAxisScaleType: string;
        trimOrdinalDataOnOverflow: boolean;
        playAxisControlLayout?: IRect;
        forcedTickCount?: number;
        forcedYDomain?: any[];
        forcedXDomain?: any[];
        ensureXDomain?: NumberRange;
        ensureYDomain?: NumberRange;
        categoryAxisDisplayUnits?: number;
        categoryAxisPrecision?: number;
        valueAxisDisplayUnits?: number;
        valueAxisPrecision?: number;
    }
    interface MergedValueAxisResult {
        domain: number[];
        merged: boolean;
        tickCount: number;
    }
    interface CartesianSmallViewPortProperties {
        hideLegendOnSmallViewPort: boolean;
        hideAxesOnSmallViewPort: boolean;
        MinHeightLegendVisible: number;
        MinHeightAxesVisible: number;
    }
    interface AxisRenderingOptions {
        axisLabels: ChartAxesLabels;
        viewport: IViewport;
        margin: IMargin;
        hideXAxisTitle: boolean;
        hideYAxisTitle: boolean;
        hideY2AxisTitle?: boolean;
        xLabelColor?: Fill;
        yLabelColor?: Fill;
        y2LabelColor?: Fill;
        fontSize: number;
    }
    interface CartesianConstructorOptions {
        chartType: CartesianChartType;
        isScrollable?: boolean;
        animator?: IGenericAnimator;
        cartesianSmallViewPortProperties?: CartesianSmallViewPortProperties;
        behavior?: IInteractiveBehavior;
        isLabelInteractivityEnabled?: boolean;
        tooltipsEnabled?: boolean;
        tooltipBucketEnabled?: boolean;
        trimOrdinalDataOnOverflow?: boolean;
        advancedLineLabelsEnabled?: boolean;
        forecastEnabled?: boolean;
    }
    interface ICartesianVisual {
        init(options: CartesianVisualInitOptions): void;
        setData(dataViews: DataView[]): void;
        calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[];
        overrideXScale(xProperties: IAxisProperties): void;
        render(suppressAnimations: boolean, resizeMode?: ResizeMode): CartesianVisualRenderResult;
        calculateLegend(): LegendData;
        hasLegend(): boolean;
        onClearSelection(): void;
        enumerateObjectInstances?(enumeration: ObjectEnumerationBuilder, options: EnumerateVisualObjectInstancesOptions): void;
        getVisualCategoryAxisIsScalar?(): boolean;
        getSupportedCategoryAxisType?(): string;
        getPreferredPlotArea?(isScalar: boolean, categoryCount: number, categoryThickness: number): IViewport;
        setFilteredData?(startIndex: number, endIndex: number): CartesianData;
        supportsTrendLine?(): boolean;
        isStacked?(): boolean;
        shouldSuppressAnimation?(): boolean;
        supportsForecast?(): boolean;
    }
    interface CartesianVisualConstructorOptions {
        isScrollable: boolean;
        interactivityService?: IInteractivityService;
        animator?: IGenericAnimator;
        isLabelInteractivityEnabled?: boolean;
        tooltipsEnabled?: boolean;
        tooltipBucketEnabled?: boolean;
        advancedLineLabelsEnabled?: boolean;
        forecastEnabled?: boolean;
    }
    interface CartesianVisualRenderResult {
        dataPoints: SelectableDataPoint[];
        behaviorOptions: any;
        labelDataPoints: LabelDataPoint[];
        labelsAreNumeric: boolean;
        labelDataPointGroups?: LabelDataPointGroup[];
    }
    interface CartesianDataPoint {
        categoryValue: any;
        value: number;
        categoryIndex: number;
        seriesIndex: number;
        highlight?: boolean;
    }
    interface CartesianSeries {
        data: CartesianDataPoint[];
    }
    interface CartesianData {
        series: CartesianSeries[];
        categoryMetadata: DataViewMetadataColumn;
        categories: any[];
        hasHighlights?: boolean;
    }
    interface CartesianVisualInitOptions extends VisualInitOptions {
        svg: D3.Selection;
        cartesianHost: ICartesianVisualHost;
        chartType?: CartesianChartType;
        labelsContext?: D3.Selection;
    }
    interface ICartesianVisualHost {
        updateLegend(data: LegendData): void;
        getSharedColors(): IDataColorPalette;
        triggerRender(suppressAnimations: boolean): void;
    }
    interface ChartAxesLabels {
        x: string;
        y: string;
        y2?: string;
    }
    const enum AxisLinesVisibility {
        ShowLinesOnXAxis = 1,
        ShowLinesOnYAxis = 2,
        ShowLinesOnBothAxis = 3,
    }
    interface CategoryLayout {
        categoryCount: number;
        categoryThickness: number;
        outerPaddingRatio: number;
        isScalar?: boolean;
    }
    interface CategoryLayoutOptions {
        availableWidth: number;
        categoryCount: number;
        domain: any;
        trimOrdinalDataOnOverflow: boolean;
        isScalar?: boolean;
        isScrollable?: boolean;
    }
    interface CartesianAxisProperties {
        x: IAxisProperties;
        y1: IAxisProperties;
        y2?: IAxisProperties;
    }
    interface ReferenceLineOptions {
        graphicContext: D3.Selection;
        referenceLineProperties: DataViewObject;
        axes: CartesianAxisProperties;
        viewport: IViewport;
        classAndSelector: ClassAndSelector;
        defaultColor: string;
        isHorizontal: boolean;
    }
    interface ReferenceLineDataLabelOptions {
        referenceLineProperties: DataViewObject;
        axes: CartesianAxisProperties;
        viewport: IViewport;
        defaultColor: string;
        isHorizontal: boolean;
        key: string;
    }
    interface ViewportDataRange {
        startIndex: number;
        endIndex: number;
    }
    interface ScalarKeys {
        values: PrimitiveValueRange[];
    }
    /**
     * Renders a data series as a cartestian visual.
     */
    class CartesianChart implements IVisual {
        static MinOrdinalRectThickness: number;
        static MinScalarRectThickness: number;
        static OuterPaddingRatio: number;
        static InnerPaddingRatio: number;
        static TickLabelPadding: number;
        static LoadMoreThreshold: number;
        private static ClassName;
        private static PlayAxisBottomMargin;
        private static FontSize;
        private static FontSizeString;
        static AxisTextProperties: TextProperties;
        private element;
        private chartAreaSvg;
        private clearCatcher;
        private type;
        private hostServices;
        private layers;
        private legend;
        private legendMargins;
        private layerLegendData;
        private hasSetData;
        private visualInitOptions;
        private legendObjectProperties;
        private categoryAxisProperties;
        private valueAxisProperties;
        private xAxisReferenceLines;
        private y1AxisReferenceLines;
        private referenceLines;
        private cartesianSmallViewPortProperties;
        private interactivityService;
        private behavior;
        private sharedColorPalette;
        private isLabelInteractivityEnabled;
        private tooltipsEnabled;
        private tooltipBucketEnabled;
        private trimOrdinalDataOnOverflow;
        private isMobileChart;
        private advancedLineLabelsEnabled;
        private forecastEnabled;
        private trendLines;
        private forecastLine;
        private xRefLine;
        private y1RefLine;
        animator: IGenericAnimator;
        private axes;
        private scrollableAxes;
        private svgAxes;
        private svgBrush;
        private renderedPlotArea;
        private dataViews;
        private currentViewport;
        private background;
        private loadMoreDataHandler;
        private static getAxisVisibility(type);
        constructor(options: CartesianConstructorOptions);
        init(options: VisualInitOptions): void;
        private isPlayAxis();
        static getIsScalar(objects: DataViewObjects, propertyId: DataViewObjectPropertyIdentifier, type: ValueTypeDescriptor, scalarKeys?: ScalarKeys): boolean;
        private static supportsScalar(type, scalarKeys?);
        static getAdditionalTelemetry(dataView: DataView): any;
        static detectScalarMapping(dataViewMapping: data.CompiledDataViewMapping): boolean;
        private populateObjectProperties(dataViews);
        private updateInternal(options, operationKind?);
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport, resizeMode?: ResizeMode): void;
        scrollTo(position: number): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        private supportsTrendLines(layerIndex?);
        private supportsForecast(layerIndex?);
        private supportsDataBoundReferenceLines(layerIndex?);
        private allLayerSupports(predicate, layerIndex?);
        private shouldShowLegendCard();
        private getAxisScaleOptions(axisType);
        private getCategoryAxisValues(enumeration);
        private getValueAxisValues(enumeration);
        onClearSelection(): void;
        private extractMetadataObjects(dataViews);
        private createAndInitLayers(objects);
        private renderLegend();
        private hideLegends();
        private render(suppressAnimations, resizeMode?, operationKind?);
        /**
         * Gets any minimum domain extents.
         * Reference lines and forecast lines may enforce minimum extents on X and/or Y domains.
         */
        private getMinimumDomainExtents();
        private getPlotAreaRect(axesLayout, legendMargins);
        private renderBackgroundImage(layout);
        private hideAxisLabels(legendMargins);
        private calculateInteractivityRightMargin();
        private renderPlotArea(layers, axesLayout, suppressAnimations, legendMargins, resizeMode?);
        private renderTrendLines(axesLayout);
        private renderForecast(axesLayout, suppressAnimations);
        private renderReferenceLines(axesLayout);
        private getReferenceLineLabels(axes, plotArea);
        private renderDataLabels(labelDataPointGroups, labelsAreNumeric, plotArea, suppressAnimations, isCombo);
        private renderLayers(layers, plotArea, axes, suppressAnimations, resizeMode?);
        /**
         * Returns the actual viewportWidth if visual is not scrollable.
         * @return If visual is scrollable, returns the plot area needed to draw all the datapoints.
         */
        static getPreferredPlotArea(categoryCount: number, categoryThickness: number, viewport: IViewport, isScrollable: boolean, isScalar: boolean, margin?: IMargin, noOuterPadding?: boolean): IViewport;
        /**
         * Returns preferred Category span if the visual is scrollable.
         */
        static getPreferredCategorySpan(categoryCount: number, categoryThickness: number, noOuterPadding?: boolean): number;
        /**
         * Note: Public for testing access.
         */
        static getLayout(data: ColumnChartData, options: CategoryLayoutOptions): CategoryLayout;
        /**
         * Returns the thickness for each category.
         * For clustered charts, you still need to divide by
         * the number of series to get column width after calling this method.
         * For linear or time scales, category thickness accomodates for
         * the minimum interval between consequtive points.
         * For all types, return value has accounted for outer padding,
         * but not inner padding.
         */
        static getCategoryThickness(seriesList: CartesianSeries[], numCategories: number, plotLength: number, domain: number[], isScalar: boolean, trimOrdinalDataOnOverflow: boolean): number;
        private static getMinInterval(seriesList);
        /**
         * Expands the category data reduction algorithm window if there are no series in any of the data view mappings.
         */
        static expandCategoryWindow(mappings: powerbi.data.CompiledDataViewMapping[]): void;
    }
    const enum AxisLocation {
        X = 0,
        Y1 = 1,
        Y2 = 2,
    }
    interface CartesianAxesLayout {
        axes: CartesianAxisProperties;
        margin: IMargin;
        marginLimits: IMargin;
        axisLabels: ChartAxesLabels;
        viewport: IViewport;
        plotArea: IViewport;
        preferredPlotArea: IViewport;
        tickLabelMargins: any;
        tickPadding: IMargin;
        rotateXTickLabels90?: boolean;
    }
    class SvgCartesianAxes {
        private axes;
        static AxisPadding: IMargin;
        private axisGraphicsContext;
        private xAxisGraphicsContext;
        private y1AxisGraphicsContext;
        private y2AxisGraphicsContext;
        private svgScrollable;
        private axisGraphicsContextScrollable;
        private labelRegion;
        private labelBackgroundRegion;
        private categoryAxisProperties;
        private valueAxisProperties;
        private static AxisGraphicsContext;
        private static TickPaddingRotatedX;
        private static AxisLabelFontSize;
        private static Y2TickSize;
        constructor(axes: CartesianAxes);
        getScrollableRegion(): D3.Selection;
        getLabelsRegion(): D3.Selection;
        getLabelBackground(): D3.Selection;
        getXAxis(): D3.Selection;
        getY1Axis(): D3.Selection;
        getY2Axis(): D3.Selection;
        update(categoryAxisProperties: DataViewObject, valueAxisProperties: DataViewObject): void;
        init(svg: D3.Selection): void;
        private static updateAnimatedTickTooltips(axisSelection, values);
        private static updateTickTooltips(axisSelection, values);
        renderAxes(axesLayout: CartesianAxesLayout, duration: number, easing?: string): void;
        private renderAxesLabels(options);
        private translateAxes(viewport, margin);
        /**
         * Within the context of the given selection (g), find the offset of
         * the zero tick using the d3 attached datum of g.tick elements.
         * 'Classed' is undefined for transition selections
         */
        private static darkenZeroLine(g);
        private static setAxisLabelColor(g, fill);
    }
    class CartesianAxes {
        private static YAxisLabelPadding;
        private static XAxisLabelPadding;
        private static MaxMarginFactor;
        private static MinimumMargin;
        private categoryAxisProperties;
        private valueAxisProperties;
        private maxMarginFactor;
        private yAxisOrientation;
        private scrollbarWidth;
        private trimOrdinalDataOnOverflow;
        showLinesOnX: boolean;
        showLinesOnY: boolean;
        isScrollable: boolean;
        isXScrollBarVisible: boolean;
        isYScrollBarVisible: boolean;
        categoryAxisHasUnitType: boolean;
        valueAxisHasUnitType: boolean;
        secondaryValueAxisHasUnitType: boolean;
        private layout;
        constructor(isScrollable: boolean, scrollbarWidth: number, trimOrdinalDataOnOverflow: boolean);
        shouldShowY1OnRight(): boolean;
        isYAxisCategorical(): boolean;
        hasCategoryAxis(): boolean;
        hasY2Axis(): boolean;
        getYAxisOrientation(): string;
        setAxisLinesVisibility(axisLinesVisibility: AxisLinesVisibility): void;
        setMaxMarginFactor(factor: number): void;
        update(dataViews: DataView[]): void;
        addWarnings(warnings: IVisualWarning[]): void;
        /**
         * Computes the Cartesian Chart axes from the set of layers.
         */
        private calculateAxes(layers, viewport, margin, playAxisControlLayout, textProperties, scrollbarVisible, existingAxisProperties, hideAxisTitles, ensureXDomain?, ensureYDomain?);
        /**
         * Negotiate the axes regions, the plot area, and determine if we need a scrollbar for ordinal categories.
         * @param layers an array of Cartesian layout layers (column, line, etc.)
         * @param parentViewport the full viewport for the visual
         * @param padding the D3 axis padding values
         * @param playAxisControlLayout if this is a playable Cartesian chart, includes the layout for the play controls (start/stop, time slider)
         * @param hideAxisLabels forces axis titles to be hidden
         * @param textProperties text properties to be used by text measurement
         * @param interactivityRightMargin extra right margin for the interactivity
         * @param ensureXDomain if non null, includes values that must be part of the axis domain
         * @param ensureYDomain if non null, includes values that must be part of the axis domain
         */
        negotiateAxes(layers: ICartesianVisual[], parentViewport: IViewport, padding: IMargin, playAxisControlLayout: IRect, hideAxisLabels: boolean, textProperties: TextProperties, interactivityRightMargin: number, ensureXDomain?: NumberRange, ensureYDomain?: NumberRange): CartesianAxesLayout;
        private getPreferredPlotArea(axes, layers, isScalar);
        private willAllCategoriesFitInPlotArea(plotArea, preferredPlotArea);
        private updateAxisMargins(axes, tickLabelMargins, padding, showY1OnRight, renderY1Axis, renderY2Axis, interactivityRightMargin);
        isLogScaleAllowed(axisType: AxisLocation): boolean;
        axesHaveTicks(viewport: IViewport): boolean;
        shouldRenderAxisTitle(axisProperties: IAxisProperties, defaultValue: boolean, secondary: boolean): boolean;
        shouldRenderAxis(axisProperties: IAxisProperties, secondary?: boolean): boolean;
        private getAxisProperty(axisProperties, propertyName, defaultValue);
        private addUnitTypeToAxisLabels(axes);
        private static getUnitType(formatter);
    }
    class SharedColorPalette implements IDataColorPalette {
        private palette;
        private preferredScale;
        private rotated;
        constructor(palette: IDataColorPalette);
        getColorScaleByKey(scaleKey: string): IColorScale;
        getNewColorScale(): IColorScale;
        getColorByIndex(index: number): IColorInfo;
        getSentimentColors(): IColorInfo[];
        getBasePickerColors(): IColorInfo[];
        clearPreferredScale(): void;
        rotateScale(): void;
        private setPreferredScale(scaleKey);
    }
    class CartesianLoadMoreDataHandler {
        viewportDataRange: ViewportDataRange;
        private loadMoreThresholdIndex;
        private loadingMoreData;
        private loadMoreThreshold;
        private loadMoreCallback;
        /**
         * Constructs the handler.
         * @param scale - The scale for the loaded data.
         * @param loadMoreCallback - The callback to execute to load more data.
         * @param loadMoreThreshold - How many indexes before the last index loading more data will be triggered.
         * Ex: loadMoreThreshold = 2, dataLength = 10 (last index = 9) will trigger a load when item with index 9 - 2 = 7 or greater is displayed.
         */
        constructor(scale: D3.Scale.GenericScale<any>, loadMoreCallback: () => void, loadMoreThreshold?: number);
        setScale(scale: D3.Scale.GenericScale<any>): void;
        isLoadingMoreData(): boolean;
        onLoadMoreDataCompleted(): void;
        shouldLoadMoreData(): boolean;
        loadMoreData(): void;
    }
}

declare module powerbi.visuals {
    interface ColumnChartConstructorOptions extends CartesianVisualConstructorOptions {
        chartType: ColumnChartType;
        animator: IColumnChartAnimator;
    }
    interface ColumnChartData extends CartesianData {
        categoryFormatter: IValueFormatter;
        series: ColumnChartSeries[];
        valuesMetadata: DataViewMetadataColumn[];
        legendData: LegendData;
        hasHighlights: boolean;
        categoryMetadata: DataViewMetadataColumn;
        scalarCategoryAxis: boolean;
        labelSettings: VisualDataLabelsSettings;
        axesLabels: ChartAxesLabels;
        hasDynamicSeries: boolean;
        isMultiMeasure: boolean;
        defaultDataPointColor?: string;
        showAllDataPoints?: boolean;
    }
    interface ColumnChartSeries extends CartesianSeries {
        displayName: string;
        key: string;
        index: number;
        data: ColumnChartDataPoint[];
        identity: SelectionId;
        color: string;
        labelSettings: VisualDataLabelsSettings;
    }
    interface ColumnChartDataPoint extends CartesianDataPoint, SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        categoryValue: number;
        /** Adjusted for 100% stacked if applicable */
        value: number;
        /** The top (column) or right (bar) of the rectangle, used for positioning stacked rectangles */
        position: number;
        valueAbsolute: number;
        /** Not adjusted for 100% stacked */
        valueOriginal: number;
        seriesIndex: number;
        labelSettings: VisualDataLabelsSettings;
        categoryIndex: number;
        color: string;
        /** The original values from the highlighted rect, used in animations */
        originalValue: number;
        originalPosition: number;
        originalValueAbsolute: number;
        /**
         * True if this data point is a highlighted portion and overflows (whether due to the highlight
         * being greater than original or of a different sign), so it needs to be thinner to accomodate.
         */
        drawThinner?: boolean;
        key: string;
        lastSeries?: boolean;
        chartType: ColumnChartType;
    }
    enum ColumnChartType {
        clusteredBar,
        clusteredColumn,
        hundredPercentStackedBar,
        hundredPercentStackedColumn,
        stackedBar,
        stackedColumn,
    }
    interface ColumnAxisOptions {
        xScale: D3.Scale.Scale;
        yScale: D3.Scale.Scale;
        seriesOffsetScale?: D3.Scale.Scale;
        columnWidth: number;
        /** Used by clustered only since categoryWidth !== columnWidth */
        categoryWidth?: number;
        isScalar: boolean;
        margin: IMargin;
    }
    interface IColumnLayout {
        shapeLayout: {
            width: (d: ColumnChartDataPoint) => number;
            x: (d: ColumnChartDataPoint) => number;
            y: (d: ColumnChartDataPoint) => number;
            height: (d: ColumnChartDataPoint) => number;
        };
        shapeLayoutWithoutHighlights: {
            width: (d: ColumnChartDataPoint) => number;
            x: (d: ColumnChartDataPoint) => number;
            y: (d: ColumnChartDataPoint) => number;
            height: (d: ColumnChartDataPoint) => number;
        };
        zeroShapeLayout: {
            width: (d: ColumnChartDataPoint) => number;
            x: (d: ColumnChartDataPoint) => number;
            y: (d: ColumnChartDataPoint) => number;
            height: (d: ColumnChartDataPoint) => number;
        };
    }
    interface ColumnChartContext {
        height: number;
        width: number;
        duration: number;
        hostService: IVisualHostServices;
        margin: IMargin;
        /** A group for graphics can be placed that won't be clipped to the data area of the chart. */
        unclippedGraphicsContext: D3.Selection;
        /** A SVG for graphics that should be clipped to the data area, e.g. data bars, columns, lines */
        mainGraphicsContext: D3.Selection;
        layout: CategoryLayout;
        animator: IColumnChartAnimator;
        onDragStart?: (datum: ColumnChartDataPoint) => void;
        interactivityService: IInteractivityService;
        viewportHeight: number;
        viewportWidth: number;
        is100Pct: boolean;
        isComboChart: boolean;
    }
    interface IColumnChartStrategy {
        setData(data: ColumnChartData): void;
        setupVisualProps(columnChartProps: ColumnChartContext): void;
        setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureXDomain?: NumberRange): IAxisProperties;
        setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureYDomain?: NumberRange): IAxisProperties;
        drawColumns(useAnimation: boolean): ColumnChartDrawInfo;
        selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void;
        getClosestColumnIndex(x: number, y: number): number;
    }
    interface IColumnChartConverterStrategy {
        getLegend(colors: IDataColorPalette, defaultLegendLabelColor: string, defaultColor?: string): LegendSeriesInfo;
        getValueBySeriesAndCategory(series: number, category: number): number;
        getMeasureNameByIndex(series: number, category: number): string;
        hasHighlightValues(series: number): boolean;
        getHighlightBySeriesAndCategory(series: number, category: number): PrimitiveValue;
    }
    interface LegendSeriesInfo {
        legend: LegendData;
        seriesSources: DataViewMetadataColumn[];
        seriesObjects: DataViewObjects[][];
    }
    interface ColumnChartDrawInfo {
        eventGroup: D3.Selection;
        shapesSelection: D3.Selection;
        viewport: IViewport;
        axisOptions: ColumnAxisOptions;
        labelDataPoints: LabelDataPoint[];
    }
    /**
     * Renders a stacked and clustered column chart.
     */
    class ColumnChart implements ICartesianVisual {
        private static ColumnChartClassName;
        static clusteredValidLabelPositions: RectLabelPosition[];
        static stackedValidLabelPositions: RectLabelPosition[];
        static SeriesClasses: jsCommon.CssConstants.ClassAndSelector;
        private svg;
        private unclippedGraphicsContext;
        private mainGraphicsContext;
        private xAxisProperties;
        private yAxisProperties;
        private currentViewport;
        private data;
        private style;
        private colors;
        private chartType;
        private columnChart;
        private hostService;
        private cartesianVisualHost;
        private interactivity;
        private margin;
        private options;
        private lastInteractiveSelectedColumnIndex;
        private interactivityService;
        private dataView;
        private categoryAxisType;
        private animator;
        private isScrollable;
        private tooltipsEnabled;
        private tooltipBucketEnabled;
        private element;
        private isComboChart;
        constructor(options: ColumnChartConstructorOptions);
        static customizeQuery(options: CustomizeQueryOptions): void;
        static getSortableRoles(options: VisualSortableOptions): string[];
        updateVisualMetadata(x: IAxisProperties, y: IAxisProperties, margin: any): void;
        init(options: CartesianVisualInitOptions): void;
        private getCategoryLayout(numCategoryValues, options);
        static converter(dataView: DataView, colors: IDataColorPalette, is100PercentStacked?: boolean, isScalar?: boolean, dataViewMetadata?: DataViewMetadata, chartType?: ColumnChartType, interactivityService?: IInteractivityService, tooltipsEnabled?: boolean, tooltipBucketEnabled?: boolean): ColumnChartData;
        private static canSupportOverflow(chartType, seriesCount);
        private static createDataPoints(dataView, categories, categoryIdentities, legend, seriesObjectsList, converterStrategy, defaultLabelSettings, is100PercentStacked?, isScalar?, isCategoryAlsoSeries?, categoryObjectsList?, defaultDataPointColor?, chartType?, categoryMetadata?, tooltipsEnabled?, tooltipBucketEnabled?);
        private static getDataPointColor(legendItem, categoryIndex, dataPointObjects?);
        private static getStackedLabelColor(isNegative, seriesIndex, seriesCount, categoryIndex, rawValues);
        static sliceSeries(series: ColumnChartSeries[], endIndex: number, startIndex?: number): ColumnChartSeries[];
        static getInteractiveColumnChartDomElement(element: JQuery): HTMLElement;
        setData(dataViews: DataView[]): void;
        private setChartStrategy();
        calculateLegend(): LegendData;
        hasLegend(): boolean;
        enumerateObjectInstances(enumeration: ObjectEnumerationBuilder, options: EnumerateVisualObjectInstancesOptions): void;
        private enumerateDataLabels(enumeration);
        private getLabelSettingsOptions(enumeration, labelSettings, series?, showAll?);
        private enumerateDataPoints(enumeration);
        calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[];
        getPreferredPlotArea(isScalar: boolean, categoryCount: number, categoryThickness: number): IViewport;
        private ApplyInteractivity(chartContext);
        private selectColumn(indexOfColumnSelected, force?);
        private createInteractiveLegendDataPoints(columnIndex);
        overrideXScale(xProperties: IAxisProperties): void;
        render(suppressAnimations: boolean): CartesianVisualRenderResult;
        onClearSelection(): void;
        getVisualCategoryAxisIsScalar(): boolean;
        getSupportedCategoryAxisType(): string;
        setFilteredData(startIndex: number, endIndex: number): CartesianData;
        static getLabelFill(labelColor: string, isInside: boolean, isCombo: boolean): string;
        supportsTrendLine(): boolean;
        isStacked(): boolean;
        static isBar(chartType: ColumnChartType): boolean;
        static isColumn(chartType: ColumnChartType): boolean;
        static isClustered(chartType: ColumnChartType): boolean;
        static isStacked(chartType: ColumnChartType): boolean;
        static isStacked100(chartType: ColumnChartType): boolean;
    }
}

declare module powerbi.visuals {
    class ClusteredColumnChartStrategy implements IColumnChartStrategy {
        private static classes;
        private data;
        private graphicsContext;
        private seriesOffsetScale;
        private width;
        private height;
        private margin;
        private xProps;
        private yProps;
        private categoryLayout;
        private viewportHeight;
        private viewportWidth;
        private columnsCenters;
        private columnSelectionLineHandle;
        private animator;
        private interactivityService;
        private layout;
        private isComboChart;
        setupVisualProps(columnChartProps: ColumnChartContext): void;
        setData(data: ColumnChartData): void;
        setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureXDomain?: NumberRange): IAxisProperties;
        setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureYDomain?: NumberRange): IAxisProperties;
        drawColumns(useAnimation: boolean): ColumnChartDrawInfo;
        selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void;
        getClosestColumnIndex(x: number, y: number): number;
        /**
         * Get the chart's columns centers (x value).
         */
        private getColumnsCenters();
        private moveHandle(selectedColumnIndex);
        static getLayout(data: ColumnChartData, axisOptions: ColumnAxisOptions): IColumnLayout;
        private createLabelDataPoints();
    }
    class ClusteredBarChartStrategy implements IColumnChartStrategy {
        private static classes;
        private data;
        private graphicsContext;
        private seriesOffsetScale;
        private width;
        private height;
        private margin;
        private xProps;
        private yProps;
        private categoryLayout;
        private viewportHeight;
        private viewportWidth;
        private barsCenters;
        private columnSelectionLineHandle;
        private animator;
        private interactivityService;
        private layout;
        private isComboChart;
        setupVisualProps(barChartProps: ColumnChartContext): void;
        setData(data: ColumnChartData): void;
        setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureYDomain?: NumberRange): IAxisProperties;
        setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureXDomain?: NumberRange): IAxisProperties;
        drawColumns(useAnimation: boolean): ColumnChartDrawInfo;
        selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void;
        getClosestColumnIndex(x: number, y: number): number;
        /**
         * Get the chart's columns centers (y value).
         */
        private getBarsCenters();
        private moveHandle(selectedColumnIndex);
        static getLayout(data: ColumnChartData, axisOptions: ColumnAxisOptions): IColumnLayout;
        private createLabelDataPoints();
    }
}

declare module powerbi.visuals {
    class StackedColumnChartStrategy implements IColumnChartStrategy {
        private static classes;
        private data;
        private graphicsContext;
        private width;
        private height;
        private margin;
        private xProps;
        private yProps;
        private categoryLayout;
        private columnsCenters;
        private columnSelectionLineHandle;
        private animator;
        private interactivityService;
        private viewportHeight;
        private viewportWidth;
        private layout;
        private isComboChart;
        setupVisualProps(columnChartProps: ColumnChartContext): void;
        setData(data: ColumnChartData): void;
        setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, xReferenceLineValue?: number): IAxisProperties;
        setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, y1ReferenceLineValue?: number): IAxisProperties;
        drawColumns(useAnimation: boolean): ColumnChartDrawInfo;
        selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void;
        getClosestColumnIndex(x: number, y: number): number;
        /**
         * Get the chart's columns centers (x value).
         */
        private getColumnsCenters();
        private moveHandle(selectedColumnIndex);
        static getLayout(data: ColumnChartData, axisOptions: ColumnAxisOptions): IColumnLayout;
        private createLabelDataPoints();
    }
    class StackedBarChartStrategy implements IColumnChartStrategy {
        private static classes;
        private data;
        private graphicsContext;
        private width;
        height: number;
        private margin;
        private xProps;
        private yProps;
        private categoryLayout;
        private barsCenters;
        private columnSelectionLineHandle;
        private animator;
        private interactivityService;
        private viewportHeight;
        private viewportWidth;
        private layout;
        private isComboChart;
        setupVisualProps(barChartProps: ColumnChartContext): void;
        setData(data: ColumnChartData): void;
        setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureYDomain?: NumberRange): IAxisProperties;
        setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureXDomain?: NumberRange): IAxisProperties;
        drawColumns(useAnimation: boolean): ColumnChartDrawInfo;
        selectColumn(selectedColumnIndex: number, lastInteractiveSelectedColumnIndex: number): void;
        getClosestColumnIndex(x: number, y: number): number;
        /**
         * Get the chart's columns centers (y value).
         */
        private getBarsCenters();
        private moveHandle(selectedColumnIndex);
        static getLayout(data: ColumnChartData, axisOptions: ColumnAxisOptions): IColumnLayout;
        private createLabelDataPoints();
    }
}

declare module powerbi.visuals.samples {
    interface HelloViewModel {
        text: string;
        color: string;
        size: number;
        selector: SelectionId;
        toolTipInfo: TooltipDataItem[];
    }
    class HelloIVisual implements IVisual {
        static capabilities: VisualCapabilities;
        private static DefaultText;
        private root;
        private svgText;
        private dataView;
        private selectiionManager;
        static converter(dataView: DataView): HelloViewModel;
        init(options: VisualInitOptions): void;
        update(options: VisualUpdateOptions): void;
        private static getFill(dataView);
        private static getSize(dataView);
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        destroy(): void;
    }
}

declare module powerbi.visuals {
    interface ComboChartDataViewObjects extends DataViewObjects {
        general: ComboChartDataViewObject;
    }
    interface ComboChartDataViewObject extends DataViewObject {
        visualType1: string;
        visualType2: string;
    }
    /**
     * This module only supplies the capabilities for comboCharts.
     * Implementation is in cartesianChart and the various ICartesianVisual implementations.
     */
    module ComboChart {
        const capabilities: VisualCapabilities;
        /**
         * Handles the case of a column layer in a combo chart. In this case, the column layer is enumearated last.
         */
        function enumerateDataPoints(enumeration: ObjectEnumerationBuilder, options: EnumerateVisualObjectInstancesOptions, layers: ICartesianVisual[]): void;
        function customizeQuery(options: CustomizeQueryOptions): void;
        function getSortableRoles(options: VisualSortableOptions): string[];
        function isComboChart(chartType: CartesianChartType): boolean;
    }
}

declare module powerbi.visuals {
    class DataColorPalette implements IDataColorPalette {
        private scales;
        private colors;
        private sentimentColors;
        private basePickerColors;
        /**
         * Creates a DataColorPalette using the given theme, or the default theme.
         */
        constructor(colors?: IColorInfo[], sentimentcolors?: IColorInfo[]);
        getColorScaleByKey(key: string): IColorScale;
        getNewColorScale(): IColorScale;
        getColorByIndex(index: number): IColorInfo;
        getSentimentColors(): IColorInfo[];
        getBasePickerColors(): IColorInfo[];
        getAllColors(): IColorInfo[];
        private createScale();
    }
    class D3ColorScale implements IColorScale {
        private scale;
        constructor(scale: D3.Scale.OrdinalScale);
        getColor(key: any): IColorInfo;
        clearAndRotateScale(): void;
        clone(): IColorScale;
        getDomain(): any[];
        static createFromColors(colors: IColorInfo[]): D3ColorScale;
    }
    class ThemeManager {
        private static colorSectorCount;
        private static defaultBaseColors;
        private static defaultTheme;
        static defaultSentimentColors: IColorInfo[];
        static getDefaultTheme(): IColorInfo[];
    }
}

/**
 * IMPORTANT: This chart is not currently enabled in the PBI system and is under development.
 */
declare module powerbi.visuals {
    interface IDataDotChartConfiguration {
        xAxisProperties: IAxisProperties;
        yAxisProperties: IAxisProperties;
        margin: any;
    }
    interface DataDotChartData {
        series: DataDotChartSeries;
        hasHighlights: boolean;
        hasDynamicSeries: boolean;
    }
    interface DataDotChartSeries extends CartesianSeries {
        xCol: DataViewMetadataColumn;
        yCol: DataViewMetadataColumn;
        data: DataDotChartDataPoint[];
    }
    interface DataDotChartDataPoint extends CartesianDataPoint, SelectableDataPoint {
        highlight: boolean;
    }
    interface DataDotChartConstructorOptions extends CartesianVisualConstructorOptions {
    }
    /**
     * The data dot chart shows a set of circles with the data value inside them.
     * The circles are regularly spaced similar to column charts.
     * The radius of all dots is the same across the chart.
     * This is most often combined with a column chart to create the 'chicken pox' chart.
     * If any of the data values do not fit within the circles, then the data values are hidden
     * and the y axis for the dots is displayed instead.
     * This chart only supports a single series of data.
     * This chart does not display a legend.
     */
    class DataDotChart implements ICartesianVisual {
        static formatStringProp: DataViewObjectPropertyIdentifier;
        private static ClassName;
        private static DotClassName;
        private static DotClassSelector;
        private static DotColorKey;
        private static DotLabelClassName;
        private static DotLabelClassSelector;
        private static DotLabelVerticalOffset;
        private static DotLabelTextAnchor;
        private options;
        private svg;
        private element;
        private mainGraphicsG;
        private mainGraphicsContext;
        private currentViewport;
        private hostService;
        private cartesianVisualHost;
        private style;
        private colors;
        private isScrollable;
        private xAxisProperties;
        private yAxisProperties;
        private margin;
        private data;
        private dataViewCategorical;
        private clippedData;
        private interactivityService;
        private interactivity;
        constructor(options: DataDotChartConstructorOptions);
        init(options: CartesianVisualInitOptions): void;
        setData(dataViews: DataView[]): void;
        setFilteredData(startIndex: number, endIndex: number): any;
        calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[];
        private static createClippedDataIfOverflowed(data, categoryCount);
        private static hasDataPoint(series);
        private lookupXValue(index, type);
        overrideXScale(xProperties: IAxisProperties): void;
        render(suppressAnimations: boolean): CartesianVisualRenderResult;
        calculateLegend(): LegendData;
        hasLegend(): boolean;
        private createLegendDataPoints(columnIndex);
        onClearSelection(): void;
        static converter(dataView: DataView, blankCategoryValue: string, interactivityService: IInteractivityService): DataDotChartData;
    }
}

declare module powerbi.visuals {
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    interface FunnelChartConstructorOptions {
        animator?: IFunnelAnimator;
        funnelSmallViewPortProperties?: FunnelSmallViewPortProperties;
        behavior?: FunnelWebBehavior;
        tooltipsEnabled?: boolean;
        tooltipBucketEnabled?: boolean;
    }
    interface FunnelPercent {
        value: number;
        percent: number;
        isTop: boolean;
    }
    /**
     * value and highlightValue may be modified in the converter to
     * allow rendering non-standard values, such as negatives.
     * Store the original values for non-rendering, user-facing elements
     * e.g. data labels
     */
    interface FunnelDataPoint extends SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        value: number;
        originalValue: number;
        label: string;
        key: string;
        categoryOrMeasureIndex: number;
        highlight?: boolean;
        highlightValue?: number;
        originalHighlightValue?: number;
        color: string;
    }
    interface FunnelData {
        dataPoints: FunnelDataPoint[];
        categoryLabels: string[];
        valuesMetadata: DataViewMetadataColumn[];
        hasHighlights: boolean;
        highlightsOverflow: boolean;
        dataLabelsSettings: VisualDataLabelsSettings;
        percentBarLabelSettings: VisualDataLabelsSettings;
        canShowDataLabels: boolean;
        hasNegativeValues: boolean;
        allValuesAreNegative: boolean;
    }
    interface FunnelAxisOptions {
        maxScore: number;
        valueScale: D3.Scale.LinearScale;
        categoryScale: D3.Scale.OrdinalScale;
        maxWidth: number;
        margin: IMargin;
        rangeStart: number;
        rangeEnd: number;
        barToSpaceRatio: number;
        categoryLabels: string[];
    }
    interface IFunnelRect {
        width: (d: FunnelDataPoint) => number;
        x: (d: FunnelDataPoint) => number;
        y: (d: FunnelDataPoint) => number;
        height: (d: FunnelDataPoint) => number;
    }
    interface IFunnelLayout {
        percentBarLayout: {
            mainLine: {
                x2: (d: FunnelPercent) => number;
                transform: (d: FunnelPercent) => string;
            };
            leftTick: {
                y2: (d: FunnelPercent) => number;
                transform: (d: FunnelPercent) => string;
            };
            rightTick: {
                y2: (d: FunnelPercent) => number;
                transform: (d: FunnelPercent) => string;
            };
            text: {
                x: (d: FunnelPercent) => number;
                y: (d: FunnelPercent) => number;
                style: () => string;
                transform: (d: FunnelPercent) => string;
                fill: string;
                maxWidth: number;
            };
        };
        shapeLayout: IFunnelRect;
        shapeLayoutWithoutHighlights: IFunnelRect;
        zeroShapeLayout: IFunnelRect;
        interactorLayout: IFunnelRect;
    }
    interface IFunnelChartSelectors {
        funnel: {
            bars: ClassAndSelector;
            highlights: ClassAndSelector;
            interactors: ClassAndSelector;
        };
        percentBar: {
            root: ClassAndSelector;
            mainLine: ClassAndSelector;
            leftTick: ClassAndSelector;
            rightTick: ClassAndSelector;
            text: ClassAndSelector;
        };
    }
    interface FunnelSmallViewPortProperties {
        hideFunnelCategoryLabelsOnSmallViewPort: boolean;
        minHeightFunnelCategoryLabelsVisible: number;
    }
    /**
     * Renders a funnel chart.
     */
    class FunnelChart implements IVisual {
        private static LabelInsidePosition;
        private static LabelOutsidePosition;
        private static LabelOrientation;
        static DefaultBarOpacity: number;
        static DimmedBarOpacity: number;
        static PercentBarToBarRatio: number;
        static TickPadding: number;
        static InnerTickSize: number;
        static MinimumInteractorSize: number;
        static InnerTextClassName: string;
        static Selectors: IFunnelChartSelectors;
        static FunnelBarHighlightClass: string;
        static YAxisPadding: number;
        private static VisualClassName;
        private static DefaultFontFamily;
        private static BarToSpaceRatio;
        private static MaxBarHeight;
        private static MinBarThickness;
        private static LabelFunnelPadding;
        private static OverflowingHighlightWidthRatio;
        private static MaxMarginFactor;
        private svg;
        private funnelGraphicsContext;
        private percentGraphicsContext;
        private clearCatcher;
        private axisGraphicsContext;
        private labelGraphicsContext;
        private currentViewport;
        private colors;
        private data;
        private hostServices;
        private margin;
        private options;
        private interactivityService;
        private behavior;
        private defaultDataPointColor;
        private labelPositionObjects;
        private dataViews;
        private funnelSmallViewPortProperties;
        private tooltipsEnabled;
        private tooltipBucketEnabled;
        /**
         * Note: Public for testing.
         */
        animator: IFunnelAnimator;
        constructor(options?: FunnelChartConstructorOptions);
        static converter(dataView: DataView, colors: IDataColorPalette, hostServices: IVisualHostServices, defaultDataPointColor?: string, tooltipsEnabled?: boolean, tooltipBucketEnabled?: boolean): FunnelData;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        private static getLabelSettingsOptions(enumeration, labelSettings, isDataLabels, positionObject?);
        private enumerateDataPoints(enumeration);
        init(options: VisualInitOptions): void;
        private updateViewportProperties();
        update(options: VisualUpdateOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport): void;
        private getMaxLabelLength(labels, properties);
        private updateInternal(suppressAnimations);
        private getUsableVerticalSpace();
        private isHidingPercentBars();
        private isSparklines();
        private setUpAxis();
        private getPercentBarTextHeight();
        onClearSelection(): void;
        static getLayout(data: FunnelData, axisOptions: FunnelAxisOptions): IFunnelLayout;
        static drawDefaultAxis(graphicsContext: D3.Selection, axisOptions: FunnelAxisOptions, isHidingPercentBars: boolean): void;
        static drawDefaultShapes(data: FunnelData, dataPoints: FunnelDataPoint[], graphicsContext: D3.Selection, layout: IFunnelLayout, hasSelection: boolean): D3.UpdateSelection;
        static getValueFromDataPoint(dataPoint: FunnelDataPoint, asOriginal?: boolean): number;
        static drawInteractorShapes(dataPoints: FunnelDataPoint[], graphicsContext: D3.Selection, layout: IFunnelLayout): D3.UpdateSelection;
        private static drawPercentBarComponents(graphicsContext, data, layout, percentLabelSettings);
        static drawPercentBars(data: FunnelData, graphicsContext: D3.Selection, layout: IFunnelLayout, isHidingPercentBars: boolean): void;
        private showCategoryLabels();
        private static addFunnelPercentsToTooltip(pctFormatString, tooltipInfo, hostServices, percentOfFirst?, percentOfPrevious?, highlight?);
        private static getTextProperties(fontSize?);
        private static getDefaultLabelSettings();
        private static getDefaultPercentLabelSettings();
        /**
         * Creates labels layout.
         */
        private getLabels(layout);
        /**
         * Creates labelDataPoints for rendering labels
         */
        private createLabelDataPoints(shapeLayout, visualSettings);
    }
}

declare module powerbi.visuals {
    interface GaugeData extends TooltipEnabledDataPoint {
        total: number;
        metadataColumn: DataViewMetadataColumn;
        minColumnMetadata: DataViewMetadataColumn;
        maxColumnMetadata: DataViewMetadataColumn;
        targetColumnMetadata: DataViewMetadataColumn;
        targetSettings: GaugeTargetSettings;
        dataLabelsSettings: VisualDataLabelsSettings;
        calloutValueLabelsSettings: VisualDataLabelsSettings;
        dataPointSettings: GaugeDataPointSettings;
    }
    interface GaugeTargetSettings {
        min: number;
        max: number;
        target: number;
    }
    interface GaugeTargetData extends GaugeTargetSettings {
        value: number;
        tooltipItems: TooltipDataItem[];
    }
    interface GaugeDataPointSettings {
        fillColor: string;
        targetColor: string;
    }
    interface GaugeSmallViewPortProperties {
        hideGaugeSideNumbersOnSmallViewPort: boolean;
        smallGaugeMarginsOnSmallViewPort: boolean;
        MinHeightGaugeSideNumbersVisible: number;
        GaugeMarginsOnSmallViewPort: number;
    }
    interface GaugeVisualProperties {
        radius: number;
        innerRadiusOfArc: number;
        innerRadiusFactor: number;
        left: number;
        top: number;
        height: number;
        width: number;
        margin: IMargin;
        transformString: string;
    }
    interface AnimatedNumberProperties {
        transformString: string;
        viewport: IViewport;
    }
    interface GaugeConstructorOptions {
        gaugeSmallViewPortProperties?: GaugeSmallViewPortProperties;
        animator?: IGenericAnimator;
        tooltipsEnabled?: boolean;
        tooltipBucketEnabled?: boolean;
    }
    interface GaugeDataViewObjects extends DataViewObjects {
        axis: GaugeDataViewObject;
    }
    interface GaugeDataViewObject extends DataViewObject {
        min?: number;
        max?: number;
        target?: number;
    }
    /**
     * Renders a number that can be animate change in value.
     */
    class Gauge implements IVisual {
        private static MinDistanceFromBottom;
        private static MinWidthForTargetLabel;
        private static DefaultTopBottomMargin;
        private static ReducedLeftRightMargin;
        private static DEFAULT_MAX;
        private static DEFAULT_MIN;
        private static VisualClassName;
        private static DefaultStyleProperties;
        private static DefaultTargetSettings;
        private static DefaultDataPointSettings;
        private static InnerRadiusFactor;
        private static KpiBandDistanceFromMainArc;
        private static MainGaugeGroupClassName;
        private static LabelText;
        private static TargetConnector;
        private static TargetText;
        /** Note: Public for testability */
        static formatStringProp: DataViewObjectPropertyIdentifier;
        private svg;
        private mainGraphicsContext;
        private currentViewport;
        private element;
        private style;
        private data;
        private color;
        private backgroundArc;
        private foregroundArc;
        private kpiArcs;
        private kpiArcPaths;
        private foregroundArcPath;
        private backgroundArcPath;
        private targetLine;
        private targetConnector;
        private targetText;
        private options;
        private lastAngle;
        private margin;
        private animatedNumberGrapicsContext;
        private animatedNumber;
        private settings;
        private targetSettings;
        private gaugeVisualProperties;
        private gaugeSmallViewPortProperties;
        private showTargetLabel;
        private tooltipsEnabled;
        private tooltipBucketEnabled;
        private hostService;
        private labels;
        private dataView;
        animator: IGenericAnimator;
        constructor(options?: GaugeConstructorOptions);
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        private getDataLabelSettingsOptions(enumeration, labelSettings);
        private enumerateAxis(enumeration);
        private enumerateDataPoint(enumeration);
        private static getGaugeObjectsProperties(dataView);
        init(options: VisualInitOptions): void;
        update(options: VisualUpdateOptions): void;
        private updateCalloutValue(suppressAnimations);
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport): void;
        /**
         * Populates Gauge data based on roles or axis settings.
         */
        private static parseGaugeData(reader, tooltipBucketEnabled?);
        /** Note: Made public for testability */
        static converter(reader: data.IDataViewCategoricalReader, tooltipBucketEnabled?: boolean): GaugeData;
        private static convertDataLabelSettings(objects, objectName);
        private static convertDataPointSettings(objects, targetSettings);
        private initKpiBands();
        /**
         * Indicates whether gauge arc is valid.
         */
        private isValid();
        private updateKpiBands(radius, innerRadiusFactor, tString, kpiAngleAttr);
        private removeTargetElements();
        private getTargetRatio();
        private updateTargetLine(radius, innerRadius, left, top);
        /** Note: public for testability */
        getAnimatedNumberProperties(radius: number, innerRadiusFactor: number, top: number, left: number): AnimatedNumberProperties;
        /** Note: public for testability */
        getGaugeVisualProperties(): GaugeVisualProperties;
        /** Note: public for testability */
        drawViewPort(drawOptions: GaugeVisualProperties): void;
        getValueAngle(): number;
        private createLabels();
        private updateInternal(suppressAnimations);
        private updateVisualStyles();
        private updateVisualConfigurations();
        private renderMinMaxLabels(ticks, radius, height, width, margin);
        private truncateTextIfNeeded(text, positionX, onRight);
        private getFormatter(dataLabelSettings, metadataColumn, maxValue?);
        private renderTarget(radius, height, width, margin);
        private arcTween(transition, arr);
        private getLabelsPosition();
        private setMargins();
        private showSideNumbersLabelText();
    }
}

declare module powerbi.visuals {
    interface ImageDataViewObjects extends DataViewObjects {
        general: ImageDataViewObject;
        imageScaling: ImageScalingDataViewObject;
    }
    interface ImageDataViewObject extends DataViewObject {
        imageUrl: string;
    }
    interface ImageScalingDataViewObject extends DataViewObject {
        imageScalingType: string;
    }
    class ImageVisual implements IVisual {
        private element;
        private imageBackgroundElement;
        private scalingType;
        init(options: VisualInitOptions): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        private enumerateImageScaling();
        update(options: VisualUpdateOptions): void;
    }
}

declare module powerbi.visuals {
    interface KPIStatusWithHistoryData {
        dataPoints: KPIStatusWithHistoryDataPoint[];
        directionType: string;
        goals: number[];
        formattedGoalString: string;
        actual: number;
        targetExists: boolean;
        historyExists: boolean;
        indicatorExists: boolean;
        trendExists: boolean;
        formattedValue: string;
        showGoal: boolean;
        showDistanceFromGoal: boolean;
        showTrendLine: boolean;
    }
    interface KPIStatusWithHistoryDataPoint {
        x: number;
        y: number;
        actual: number;
        goals: number[];
    }
    class KPIStatusWithHistory implements IVisual {
        static directionTypeStringProp: DataViewObjectPropertyIdentifier;
        static showKPIGoal: DataViewObjectPropertyIdentifier;
        static showKPIDistance: DataViewObjectPropertyIdentifier;
        static showKPITrendLine: DataViewObjectPropertyIdentifier;
        static indicatorDisplayUnitsProp: DataViewObjectPropertyIdentifier;
        static indicatorPrecisionProp: DataViewObjectPropertyIdentifier;
        static status: {
            INCREASE: string;
            DROP: string;
            IN_BETWEEN: string;
            NOGOAL: string;
        };
        static statusBandingType: {
            Below: string;
            Above: string;
        };
        static actualTextConsts: {
            VERTICAL_OFFSET_FROM_HALF_HEIGHT: number;
            FONT_WIDTH_FACTOR: number;
            RIGHT_MARGIN: number;
        };
        static kpiRedClass: string;
        static kpiYellowClass: string;
        static kpiGreenClass: string;
        static kpiTextGreyClass: string;
        static kpiGraphGreyClass: string;
        static allColorClasses: string;
        static trendAreaFilePercentage: number;
        static estimatedIconHeightInPx: number;
        static indicatorTextSizeInPx: number;
        private svg;
        private dataView;
        private mainGroupElement;
        private kpiActualText;
        private absoluteGoalDistanceText;
        private areaFill;
        private host;
        private exclamationMarkIcon;
        private successMarkIcon;
        private betweenIcon;
        private rootElement;
        private indicatorTextContainer;
        private textContainer;
        private static getLocalizedString;
        private static defaultCardFormatSetting;
        private static defaultLabelSettings;
        init(options: VisualInitOptions): void;
        update(options: VisualUpdateOptions): void;
        private initIcons();
        private render(kpiViewModel, viewport);
        private setShowDataMissingWarning(show);
        private static getDefaultFormatSettings();
        private static getFormatString(column);
        private static getProp_Show_KPIGoal(dataView);
        private static getProp_Show_KPITrendLine(dataView);
        private static getProp_Show_KPIDistance(dataView);
        private static getProp_KPIDirection(dataView);
        private static getProp_Indicator_DisplayUnits(dataView);
        private static getProp_Indicator_Precision(dataView);
        private static initDefaultLabelSettings();
        private static getFormattedValue(metaDataColumn, theValue, precision, displayUnits, displayUnitSystemType?);
        private static getFormattedGoalString(metaDataColumn, goals, precision, displayUnits);
        static converter(dataView: DataView, viewPort: powerbi.IViewport, directionType: string): KPIStatusWithHistoryData;
        static getColumnsByRole(values: DataViewValueColumns, roleString: string): DataViewValueColumn[];
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        destroy(): void;
    }
}

declare module powerbi.visuals {
    interface LineChartConstructorOptions extends CartesianVisualConstructorOptions {
        chartType?: LineChartType;
        tooltipBucketEnabled?: boolean;
        advancedLineLabelsEnabled?: boolean;
    }
    interface LineChartDataLabelsSettings extends PointDataLabelsSettings {
        labelDensity: string;
    }
    interface ILineChartConfiguration {
        xAxisProperties: IAxisProperties;
        yAxisProperties: IAxisProperties;
        margin: any;
    }
    interface LineChartCategoriesData extends LineChartDataPoint {
    }
    interface LineChartData extends CartesianData {
        series: LineChartSeries[];
        isScalar?: boolean;
        scalarMetadata?: DataViewMetadataColumn;
        scalarKeyCount?: number;
        dataLabelsSettings: LineChartDataLabelsSettings;
        axesLabels: ChartAxesLabels;
        hasDynamicSeries?: boolean;
        defaultSeriesColor?: string;
        categoryData?: LineChartCategoriesData[];
        seriesDisplayName?: string;
        hasValues?: boolean;
        categoryIdentities?: SelectionId[];
    }
    interface LineChartSeries extends CartesianSeries, SelectableDataPoint {
        displayName: string;
        dynamicDisplayName?: string;
        key: string;
        lineIndex: number;
        color: string;
        xCol: DataViewMetadataColumn;
        yCol: DataViewMetadataColumn;
        data: LineChartDataPoint[];
        labelSettings: LineChartDataLabelsSettings;
    }
    interface LineChartDataPoint extends CartesianDataPoint, TooltipEnabledDataPoint, SelectableDataPoint, LabelEnabledDataPoint {
        value: number;
        categoryIndex: number;
        seriesIndex: number;
        key: string;
        labelSettings: LineChartDataLabelsSettings;
        pointColor?: string;
        stackedValue?: number;
        extraTooltipInfo?: TooltipDataItem[];
        specificIdentity: SelectionId;
    }
    interface HoverLineDataPoint {
        color: string;
        seriesDisplayName?: string;
        seriesName?: string;
        category: string;
        measureDisplayName: string;
        measure: any;
        value: number;
        stackedValue: number;
        extraTooltipInfo: TooltipDataItem[];
    }
    const enum LineChartType {
        default = 1,
        area = 2,
        smooth = 4,
        lineShadow = 8,
        stackedArea = 16,
    }
    /**
     * Renders a data series as a line visual.
     */
    class LineChart implements ICartesianVisual {
        private static ClassName;
        private static MainGraphicsContextClassName;
        private static CategorySelector;
        private static CategoryValuePoint;
        private static CategoryPointSelector;
        private static CategoryAreaSelector;
        private static HoverLineCircleDot;
        private static LineClassSelector;
        private static PointRadius;
        private static CircleRadius;
        private static PathElementName;
        private static CircleElementName;
        private static CircleClassName;
        private static LineElementName;
        private static RectOverlayName;
        private static ScalarOuterPadding;
        private static interactivityStrokeWidth;
        private static minimumLabelsToRender;
        static AreaFillOpacity: number;
        static DimmedAreaFillOpacity: number;
        private isInteractiveChart;
        private isScrollable;
        private tooltipsEnabled;
        private lineClassAndSelector;
        private element;
        private cartesainSVG;
        private mainGraphicsContext;
        private mainGraphicsSVG;
        private hoverLineContext;
        private options;
        private dataViewCat;
        private colors;
        private host;
        private data;
        private clippedData;
        private lineType;
        private cartesianVisualHost;
        private xAxisProperties;
        private yAxisProperties;
        private margin;
        private currentViewport;
        private selectionCircles;
        private dragHandle;
        private hoverLine;
        private lastInteractiveSelectedColumnIndex;
        private scaleDetector;
        private interactivityService;
        private animator;
        private previousCategoryCount;
        private pathXAdjustment;
        private tooltipBucketEnabled;
        private advancedLineLabelsEnabled;
        private static validStackedLabelPositions;
        private overlayRect;
        private isComboChart;
        private previousCategoryIds;
        private suppressAnimation;
        private lastDragMoveXPosition;
        private deferDragMoveOperation;
        static customizeQuery(options: CustomizeQueryOptions): void;
        private static shouldUseScalarKey(dataViewMapping, categoryRoleItems);
        static getSortableRoles(options: VisualSortableOptions): string[];
        static converter(dataView: DataView, blankCategoryValue: string, colors: IDataColorPalette, isScalar: boolean, interactivityService?: IInteractivityService, shouldCalculateStacked?: boolean, isComboChart?: boolean, tooltipsEnabled?: boolean, tooltipBucketEnabled?: boolean): LineChartData;
        static getInteractiveLineChartDomElement(element: JQuery): HTMLElement;
        private static getColor(colorHelper, hasDynamicSeries, values, grouped, seriesIndex, groupedIdentity);
        private static createStackedValueDomain(data);
        constructor(options: LineChartConstructorOptions);
        init(options: CartesianVisualInitOptions): void;
        setData(dataViews: DataView[]): void;
        calculateLegend(): LegendData;
        hasLegend(): boolean;
        setFilteredData(startIndex: number, endIndex: number): CartesianData;
        calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[];
        enumerateObjectInstances(enumeration: ObjectEnumerationBuilder, options: EnumerateVisualObjectInstancesOptions): void;
        private enumerateDataPoints(enumeration);
        private enumerateDataLabels(enumeration);
        supportsTrendLine(): boolean;
        supportsForecast(): boolean;
        isStacked(): boolean;
        shouldSuppressAnimation(): boolean;
        private showLabelPerSeries();
        private getLabelSettingsOptions(enumeration, labelSettings, series?, showAll?);
        overrideXScale(xProperties: IAxisProperties): void;
        onClearSelection(): void;
        render(suppressAnimations: boolean): CartesianVisualRenderResult;
        private renderNew(duration);
        private renderOld(duration);
        /**
         * Note: Public for tests.
         */
        getSeriesTooltipInfo(pointData: HoverLineDataPoint[]): TooltipDataItem[];
        /**
         * Note: Public for tests.
         */
        getTooltipInfoForCombo(tooltipEvent: TooltipEvent, pointX: number): TooltipDataItem[];
        /**
         * Note: Public for tests.
         */
        getCategoryIndexFromTooltipEvent(tooltipEvent: TooltipEvent, pointX: number): number;
        getCategoryIndexFromSeriesAndPointX(seriesData: LineChartSeries, pointX: number): number;
        getVisualCategoryAxisIsScalar(): boolean;
        getSupportedCategoryAxisType(): string;
        getPreferredPlotArea(isScalar: boolean, categoryCount: number, categoryThickness: number): IViewport;
        private getCategoryCount(origCatgSize);
        private getAvailableWidth();
        private getAvailableHeight();
        private static sliceSeries(series, newLength, startIndex?);
        private static getScalarKeys(dataViewCategoryColumn);
        private getXOfFirstCategory();
        private hasDataPoint(series);
        private getXValue(d);
        /**
          * This checks to see if a data point is isolated, which means
          * the previous and next data point are both null.
          */
        private shouldDrawCircle(d, i);
        selectColumnForTooltip(columnIndex: number, force?: boolean): HoverLineDataPoint[];
        private setHoverLineForTooltip(chartX);
        private setDotsForTooltip(chartX, dataPoints);
        /**
         * Updates the hover line and the legend with the selected colums (given by columnIndex).
         * This is for the Mobile renderer with InteractiveLegend
         */
        selectColumn(columnIndex: number, force?: boolean): void;
        private setHoverLine(chartX, columnIndex);
        private getChartX(columnIndex);
        /**
         * Finds the index of the category of the given x coordinate given.
         * pointX is in non-scaled screen-space, and offsetX is in render-space.
         * offsetX does not need any scaling adjustment.
         * @param {number} pointX The mouse coordinate in screen-space, without scaling applied
         * @param {number} offsetX Any left offset in d3.scale render-space
         * @return {number}
         */
        private findIndex(pointX, offsetX?);
        private getPosition(x, pathElement);
        private createTooltipDataPoints(columnIndex);
        private createLegendDataPoints(columnIndex);
        private createLabelDataPoints();
        private static getNumberOfLabelsToRender(viewPortWidth, labelDensity);
        /**
         * Adjust a mouse coordinate originating from a path; used to fix
         * an inconsistency between Internet Explorer and other browsers.
         *
         * Internet explorer places the origin for the coordinate system of
         * mouse events based on the stroke, so that the very edge of the stroke
         * is zero.  Chrome places the 0 on the edge of the path so that the
         * edge of the stroke is -(strokeWidth / 2).  We adjust coordinates
         * to match Chrome.
         *
         * @param value The x coordinate to be adjusted
         */
        private adjustPathXCoordinate(x);
        /**
         * Obtains the pointLabelPosition for the category index within the given series
         *
         * Rules for line chart data labels:
         * 1. Top and bottom > left and right
         * 2. Top > bottom unless we're at a local minimum
         * 3. Right > left unless:
         *    a. There is no data point to the left and there is one to the right
         *    b. There is an equal data point to the right, but not to the left
         */
        private getValidLabelPositions(series, categoryIndex);
    }
}

declare module powerbi.visuals {
    interface MapConstructionOptions {
        filledMap?: boolean;
        geocoder?: IGeocoder;
        mapControlFactory?: IMapControlFactory;
        behavior?: MapBehavior;
        tooltipsEnabled?: boolean;
        tooltipBucketEnabled?: boolean;
        filledMapDataLabelsEnabled?: boolean;
        disableZooming?: boolean;
        disablePanning?: boolean;
        isLegendScrollable?: boolean;
        viewChangeThrottleInterval?: number;
        enableCurrentLocation?: boolean;
    }
    interface IMapControlFactory {
        createMapControl(element: HTMLElement, options?: Microsoft.Maps.MapOptions): Microsoft.Maps.Map;
        ensureMap(locale: string, action: () => void): void;
    }
    interface MapData {
        dataPoints: MapDataPoint[];
        geocodingCategory: string;
        hasDynamicSeries: boolean;
        hasSize: boolean;
    }
    /**
     * The main map data point, which exists for each category
     */
    interface MapDataPoint {
        geocodingQuery: string;
        value: number;
        categoryValue: string;
        subDataPoints: MapSubDataPoint[];
        location?: IGeocodeCoordinate;
        paths?: IGeocodeBoundaryPolygon[];
        radius?: number;
    }
    /**
     * SubDataPoint that carries series-based data.  For category only maps
     * there will only be one of these on each MapDataPoint; for dynamic series,
     * there will be one per series for each MapDataPoint.
     */
    interface MapSubDataPoint {
        value: number;
        fill: string;
        stroke: string;
        identity: SelectionId;
        tooltipInfo: TooltipDataItem[];
    }
    interface MapRendererData {
        bubbleData?: MapBubble[];
        sliceData?: MapSlice[][];
        shapeData?: MapShape[];
    }
    interface MapVisualDataPoint extends TooltipEnabledDataPoint, SelectableDataPoint {
        x: number;
        y: number;
        radius: number;
        fill: string;
        stroke: string;
        strokeWidth: number;
        labeltext: string;
        labelFill: string;
    }
    interface MapBubble extends MapVisualDataPoint {
    }
    interface MapSlice extends MapVisualDataPoint {
        value: number;
        startAngle?: number;
        endAngle?: number;
    }
    interface MapShape extends TooltipEnabledDataPoint, SelectableDataPoint {
        absolutePointArray: Float64Array;
        path: string;
        fill: string;
        stroke: string;
        strokeWidth: number;
        key: string;
        labeltext: string;
        displayLabel: boolean;
        catagoryLabeltext?: string;
        labelFormatString: string;
    }
    /**
     * Used because data points used in D3 pie layouts are placed within a container with pie information.
     */
    interface MapSliceContainer {
        data: MapSlice;
    }
    /** Note: public for UnitTest */
    interface IMapDataPointRenderer {
        init(mapControl: Microsoft.Maps.Map, mapDiv: JQuery, addClearCatcher: boolean): void;
        setData(data: MapData): void;
        getDataPointCount(): number;
        converter(viewPort: IViewport, dataView: DataView, labelSettings: PointDataLabelsSettings, interactivityService: IInteractivityService, tooltipsEnabled: boolean): MapRendererData;
        updateInternal(data: MapRendererData, viewport: IViewport, dataChanged: boolean, interactivityService: IInteractivityService, redrawDataLabels: boolean): MapBehaviorOptions;
        updateInternalDataLabels(viewport: IViewport, redrawDataLabels: boolean): void;
        getDataPointPadding(): number;
        clearDataPoints(): void;
    }
    interface DataViewMetadataAutoGeneratedColumn extends DataViewMetadataColumn {
        /**
         * Indicates that the column was added manually.
         */
        isAutoGeneratedColumn?: boolean;
    }
    const MaxLevelOfDetail: number;
    const MinLevelOfDetail: number;
    const DefaultFillOpacity: number;
    const DefaultBackgroundColor: string;
    const LeaderLineColor: string;
    class MapBubbleDataPointRenderer implements IMapDataPointRenderer {
        private mapControl;
        private mapData;
        private maxDataPointRadius;
        private svg;
        private clearSvg;
        private clearCatcher;
        private bubbleGraphicsContext;
        private sliceGraphicsContext;
        private labelGraphicsContext;
        private labelBackgroundGraphicsContext;
        private sliceLayout;
        private arc;
        private dataLabelsSettings;
        private tooltipsEnabled;
        private static validLabelPositions;
        private mapRendererData;
        private root;
        constructor(tooltipsEnabled: boolean);
        init(mapControl: Microsoft.Maps.Map, mapDiv: JQuery, addClearCatcher: boolean): void;
        setData(data: MapData): void;
        clearDataPoints(): void;
        getDataPointCount(): number;
        getDataPointPadding(): number;
        private clearMaxDataPointRadius();
        private setMaxDataPointRadius(dataPointRadius);
        getDefaultMap(geocodingCategory: string, dataPointCount: number): void;
        converter(viewport: IViewport, dataView: DataView, labelSettings: PointDataLabelsSettings, interactivityService: IInteractivityService, tooltipsEnabled?: boolean): MapRendererData;
        updateInternal(data: MapRendererData, viewport: IViewport, dataChanged: boolean, interactivityService: IInteractivityService, redrawDataLabels: boolean): MapBehaviorOptions;
        updateInternalDataLabels(viewport: IViewport, redrawDataLabels: boolean): void;
        private createLabelDataPoints();
    }
    interface FilledMapParams {
        level: number;
        maxPolygons: number;
        strokeWidth: number;
    }
    class MapShapeDataPointRenderer implements IMapDataPointRenderer {
        private mapControl;
        private svg;
        private clearSvg;
        private clearCatcher;
        private polygonInfo;
        private mapData;
        private shapeGraphicsContext;
        private labelGraphicsContext;
        private labelBackgroundGraphicsContext;
        private maxShapeDimension;
        private mapRendererData;
        private dataLabelsSettings;
        private filledMapDataLabelsEnabled;
        private tooltipsEnabled;
        private labelLayout;
        private static validLabelPolygonPositions;
        private root;
        static getFilledMapParams(category: string, dataCount: number): FilledMapParams;
        static buildPaths(locations: IGeocodeBoundaryPolygon[]): IGeocodeBoundaryPolygon[];
        constructor(fillMapDataLabelsEnabled: boolean, tooltipsEnabled: boolean);
        init(mapControl: Microsoft.Maps.Map, mapDiv: JQuery, addClearCatcher: boolean): void;
        setData(data: MapData): void;
        clearDataPoints(): void;
        getDataPointCount(): number;
        converter(viewport: IViewport, dataView: DataView, labelSettings: PointDataLabelsSettings, interactivityService?: IInteractivityService): MapRendererData;
        updateInternal(data: MapRendererData, viewport: IViewport, dataChanged: boolean, interactivityService: IInteractivityService, redrawDataLabels: boolean): MapBehaviorOptions;
        getDataPointPadding(): number;
        static getIndexOfLargestShape(paths: IGeocodeBoundaryPolygon[]): number;
        updateInternalDataLabels(viewport: IViewport, redrawDataLabels: boolean): void;
        private clearMaxShapeDimension();
        private setMaxShapeDimension(width, height);
        private createLabelDataPoints();
        private drawLabelStems(labelsContext, dataLabels, showText, showCategory);
    }
    /** Note: public for UnitTest */
    interface SimpleRange {
        min: number;
        max: number;
    }
    class Map implements IVisual {
        currentViewport: IViewport;
        private pendingGeocodingRender;
        private mapControl;
        private minLongitude;
        private maxLongitude;
        private minLatitude;
        private maxLatitude;
        private style;
        private colors;
        private dataPointRenderer;
        private geocodingCategory;
        private legend;
        private legendHeight;
        private legendData;
        private element;
        private dataView;
        private dataLabelsSettings;
        private static MapContainer;
        static StrokeDarkenColorValue: number;
        static ScheduleRedrawInterval: number;
        private interactivityService;
        private behavior;
        private defaultDataPointColor;
        private showAllDataPoints;
        private dataPointsToEnumerate;
        private hasDynamicSeries;
        private geoTaggingAnalyzerService;
        private isFilledMap;
        private host;
        private geocoder;
        private promiseFactory;
        private mapControlFactory;
        private tooltipsEnabled;
        private tooltipBucketEnabled;
        private filledMapDataLabelsEnabled;
        private disableZooming;
        private disablePanning;
        private locale;
        private isLegendScrollable;
        private viewChangeThrottleInterval;
        private root;
        private enableCurrentLocation;
        private isCurrentLocation;
        private boundsHaveBeenUpdated;
        private geocodingContext;
        private isDestroyed;
        constructor(options: MapConstructionOptions);
        init(options: VisualInitOptions): void;
        destroy(): void;
        private createCurrentLocation(element);
        private addDataPoint(dataPoint);
        private scheduleRedraw();
        private enqueueGeoCode(dataPoint);
        private completeGeoCode(dataPoint, location);
        private enqueueGeoCodeAndGeoShape(dataPoint, params);
        private completeGeoCodeAndGeoShape(dataPoint, params, location);
        private enqueueGeoShape(dataPoint, params);
        private completeGeoShape(dataPoint, params, result);
        private getOptimumLevelOfDetail(width, height);
        private getViewCenter(levelOfDetail);
        private resetBounds();
        private updateBounds(latitude, longitude);
        static legendObject(dataView: DataView): DataViewObject;
        static isLegendHidden(dataView: DataView): boolean;
        static legendPosition(dataView: DataView): LegendPosition;
        static getLegendFontSize(dataView: DataView): number;
        static isShowLegendTitle(dataView: DataView): boolean;
        private legendTitle();
        private renderLegend(legendData);
        /** Note: public for UnitTest */
        static calculateGroupSizes(categorical: DataViewCategorical, grouped: DataViewValueColumnGroup[], groupSizeTotals: number[], sizeMeasureIndex: number, currentValueScale: SimpleRange): SimpleRange;
        /** Note: public for UnitTest */
        static calculateRadius(range: SimpleRange, value?: number): number;
        /** Note: public for UnitTest */
        static getGeocodingCategory(categorical: DataViewCategorical, geoTaggingAnalyzerService: IGeoTaggingAnalyzerService): string;
        /** Note: public for UnitTest */
        static hasSizeField(values: DataViewValueColumns, defaultIndexIfNoRole?: number): boolean;
        static shouldEnumerateDataPoints(dataView: DataView, usesSizeForGradient: boolean): boolean;
        static shouldEnumerateCategoryLabels(isFilledMap: boolean, filledMapDataLabelsEnabled: boolean): boolean;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        static enumerateDataPoints(enumeration: ObjectEnumerationBuilder, dataPoints: LegendDataPoint[], colors: IDataColorPalette, hasDynamicSeries: boolean, defaultDataPointColor: string, showAllDataPoints: boolean, bubbleData: MapBubble[]): void;
        static enumerateLegend(enumeration: ObjectEnumerationBuilder, dataView: DataView, legend: ILegend, legendTitle: string): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        static converter(dataView: DataView, colorHelper: ColorHelper, geoTaggingAnalyzerService: IGeoTaggingAnalyzerService, isFilledMap: boolean, tooltipBucketEnabled?: boolean): MapData;
        static createLegendData(dataView: DataView, colorHelper: ColorHelper): LegendData;
        private swapLogoContainerChildElement();
        onResizing(viewport: IViewport): void;
        private initialize(container);
        private onViewChanged();
        private onViewChangeEnded();
        private getMapViewPort();
        static removeTransform3d(mapRoot: JQuery): void;
        private updateInternal(dataChanged, redrawDataLabels);
        private updateMapView(center, levelOfDetail);
        private updateOffsets(dataChanged, redrawDataLabels);
        onClearSelection(): void;
        private clearDataPoints();
        private getDefaultMapControlFactory();
        private static removeHillShading();
    }
}

declare module powerbi.visuals {
    interface CardItemData {
        caption: string;
        details: string;
        showURL: boolean;
        showImage: boolean;
        showKPI: boolean;
        columnIndex: number;
    }
    interface CardSettings {
        outlineSettings: OutlineSettings;
        barSettings: OutlineSettings;
        cardPadding: number;
        cardBackground: string;
    }
    interface OutlineSettings {
        outline: string;
        color: string;
        weight: number;
    }
    interface MultiRowCardData {
        dataModel: CardData[];
        dataColumnCount: number;
        cardTitleSettings: VisualDataLabelsSettings;
        dataLabelsSettings: VisualDataLabelsSettings;
        categoryLabelsSettings: VisualDataLabelsSettings;
        cardSettings: CardSettings;
    }
    interface CardData {
        title?: string;
        showTitleAsURL?: boolean;
        showTitleAsImage?: boolean;
        showTitleAsKPI?: boolean;
        cardItemsData: CardItemData[];
    }
    class MultiRowCard implements IVisual {
        private currentViewport;
        private options;
        private dataView;
        private style;
        private element;
        private listView;
        /**
         * This includes card height with margin that will be passed to list view.
         */
        private interactivity;
        private isInteractivityOverflowHidden;
        private waitingForData;
        private cardHasTitle;
        private isSingleRowCard;
        private maxColPerRow;
        private data;
        /**
         * Note: Public for testability.
         */
        static formatStringProp: DataViewObjectPropertyIdentifier;
        private static MultiRowCardRoot;
        private static Card;
        private static Title;
        private static CardItemContainer;
        private static Caption;
        private static Details;
        private static TitleUrlSelector;
        private static CaptionUrlSelector;
        private static TitleImageSelector;
        private static CaptionImageSelector;
        private static KPITitle;
        private static ValuesRole;
        /**
         * Cards have specific styling so defined inline styles and also to support theming and improve performance.
         */
        private static DefaultStyle;
        private static tileMediaQueries;
        init(options: VisualInitOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        private static getCardSettings(dataView);
        onResizing(viewport: IViewport): void;
        static converter(dataView: DataView, columnCount: number, maxCards: number, isDashboardVisual?: boolean): MultiRowCardData;
        static getSortableRoles(options: VisualSortableOptions): string[];
        private initializeCardRowSelection();
        private getBorderStyles(border, padding?);
        private getMaxColPerRow();
        private getRowIndex(fieldIndex);
        private getStyle();
        private getSurroundSettings(outlineSettings);
        private getCustomStyles();
        private static getTextProperties(isTitle, fontSizeInPt);
        private getColumnWidth(fieldIndex, columnCount);
        private isLastRowItem(fieldIndex, columnCount);
        private isInFirstRow(fieldIndex);
        /**
         * This contains the card column wrapping logic.
         * Determines how many columns can be shown per each row inside a Card.
         * To place the fields evenly along the card,
         * the width of each card item is calculated based on the available viewport width.
         */
        private setCardDimensions();
        private onLoadMoreData();
        private static getDataLabelSettingsOptions(enumeration, labelSettings, show?);
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        private enumerateCard(enumeration);
    }
}

declare module powerbi.visuals {
    interface TextboxDataViewObjects extends DataViewObjects {
        general: TextboxDataViewObject;
    }
    interface TextboxDataViewObject extends DataViewObject {
        paragraphs: Paragraphs;
    }
    /** Represents a rich text box that supports view & edit mode. */
    class Textbox implements IVisual {
        private static ClassName;
        private editor;
        private element;
        private host;
        private viewport;
        private readOnly;
        private paragraphs;
        init(options: VisualInitOptions): void;
        onResizing(viewport: IViewport): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        destroy(): void;
        focus(): boolean;
        onViewModeChanged(viewMode: ViewMode): void;
        setSelection(start: number, end: number): void;
        private refreshView();
        private saveContents();
        private updateSize();
    }
    module RichText {
        let defaultFont: string;
        const defaultFontSize: string;
        /**
         * Given a font family returns the value we should use for the font-family css property.
         */
        function getCssFontFamily(font: string): string;
        /**
         * Convert built-in font families back into their proper font families (e.g. wf_segoe-ui_normal -> Segoe UI)
         */
        function getFontFamilyForBuiltInFont(font: string): string;
        class QuillWrapper {
            private editor;
            private $editorDiv;
            private $toolbarDiv;
            private $container;
            private dependenciesLoaded;
            private localizationProvider;
            private host;
            private static textChangeThrottle;
            static loadQuillResources: boolean;
            private static quillJsFiles;
            private static quillCssFiles;
            private QuillPackage;
            initialized: boolean;
            readOnly: boolean;
            textChanged: (delta, source) => void;
            /**
             * JavaScript and CSS resources are typically resolved asynchronously.
             * This means we potentially defer certain events which typically occur
             * synchronously until resources are loaded.
             * Setting the global loadQuillResources flag to true will override
             * this behavior and cause the wrapper to assume these resources are already loaded
             * and not try to load them asynchronously (e.g. for use in unit tests).
             */
            constructor(readOnly: boolean, host: IVisualHostServices);
            addModule(name: any, options: any): any;
            getElement(): JQuery;
            getContents(): quill.Delta;
            setContents(contents: quill.Delta | quill.Op[]): void;
            resize(viewport: IViewport): void;
            setReadOnly(readOnly: boolean): void;
            setSelection(start: number, end: number): void;
            getSelection(): quill.Range;
            focus(): void;
            destroy(): void;
            getSelectionAtCursor(): quill.Range;
            getWord(): string;
            insertLinkAtCursor(link: string, index: number): number;
            getEditorContainer(): JQuery;
            private getTextWithoutTrailingBreak();
            private rebuildQuillEditor();
            private onTextChanged(delta, source);
        }
    }
}

declare module powerbi.visuals {
    const cheerMeterProps: {
        dataPoint: {
            defaultColor: DataViewObjectPropertyIdentifier;
            fill: DataViewObjectPropertyIdentifier;
        };
    };
    interface TeamData {
        name: string;
        value: number;
        color: string;
        identity: SelectionId;
    }
    interface CheerData {
        teamA: TeamData;
        teamB: TeamData;
        background: string;
    }
    class CheerMeter implements IVisual {
        static capabilities: VisualCapabilities;
        private static DefaultFontFamily;
        private static DefaultFontColor;
        private static DefaultBackgroundColor;
        private static PaddingBetweenText;
        private textOne;
        private textTwo;
        private svg;
        private isFirstTime;
        private data;
        private selectionManager;
        static converter(dataView: DataView): CheerData;
        init(options: VisualInitOptions): void;
        update(options: VisualUpdateOptions): void;
        private getRecomendedFontProperties(text1, text2, parentViewport);
        private calculateLayout(data, viewport);
        private ensureStartState(layout, viewport);
        private clearSelection();
        private clearSelectionUI();
        private updateSelectionUI(ids);
        private draw(data, duration, viewport);
        destroy(): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
    }
}

declare module powerbi.visuals {
    interface ScatterChartConstructorOptions extends CartesianVisualConstructorOptions {
    }
    interface ScatterChartDataPoint extends SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        x: any;
        y: any;
        size: any;
        radius: RadiusData;
        fill: string;
        formattedCategory: jsCommon.Lazy<string>;
        fontSize?: number;
    }
    interface ScatterChartDataPointSeries {
        identityKey: string;
        dataPoints?: ScatterChartDataPoint[];
        hasSize?: boolean;
        fill?: string;
    }
    interface RadiusData {
        sizeMeasure: DataViewValueColumn;
        index: number;
    }
    interface DataRange {
        minRange: number;
        maxRange: number;
        delta: number;
    }
    interface ScatterChartData extends PlayableChartData, ScatterBehaviorChartData {
        xCol: DataViewMetadataColumn;
        yCol: DataViewMetadataColumn;
        dataPoints: ScatterChartDataPoint[];
        dataPointSeries: ScatterChartDataPointSeries[];
        legendData: LegendData;
        axesLabels: ChartAxesLabels;
        size?: DataViewMetadataColumn;
        sizeRange: NumberRange;
        dataLabelsSettings: PointDataLabelsSettings;
        defaultDataPointColor?: string;
        showAllDataPoints?: boolean;
        hasDynamicSeries?: boolean;
        fillPoint?: boolean;
        colorBorder?: boolean;
        colorByCategory?: boolean;
    }
    interface ScatterChartViewModel {
        xAxisProperties: IAxisProperties;
        yAxisProperties: IAxisProperties;
        viewport: IViewport;
        data: ScatterChartData;
        drawBubbles: boolean;
        isPlay: boolean;
        fillMarkers: boolean;
        hasSelection: boolean;
        animationDuration: number;
        animationOptions: AnimationOptions;
        easeType: string;
        suppressDataPointRendering: boolean;
    }
    interface ScatterConverterOptions {
        viewport: IViewport;
        colors: any;
        interactivityService?: any;
        categoryAxisProperties?: any;
        valueAxisProperties?: any;
    }
    /** Styles to apply to scatter chart data point marker */
    interface ScatterMarkerStyle {
        'stroke-opacity': number;
        stroke: string;
        fill: string;
        'fill-opacity': number;
    }
    interface CartesianExtents {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
    }
    class ScatterChart implements ICartesianVisual {
        private static BubbleRadius;
        static DefaultBubbleOpacity: number;
        static DimmedBubbleOpacity: number;
        static StrokeDarkenColorValue: number;
        static dataLabelLayoutStartingOffset: number;
        static dataLabelLayoutOffsetIterationDelta: number;
        static dataLabelLayoutMaximumOffset: number;
        private static AreaOf300By300Chart;
        private static MinSizeRange;
        private static MaxSizeRange;
        private static ClassName;
        static NoAnimationThreshold: number;
        static NoRenderResizeThreshold: number;
        private svg;
        private element;
        private currentViewport;
        private style;
        private data;
        private dataView;
        private host;
        private margin;
        private colors;
        private options;
        private interactivity;
        private cartesianVisualHost;
        private isMobileChart;
        private interactivityService;
        private categoryAxisProperties;
        private valueAxisProperties;
        private animator;
        private tooltipsEnabled;
        private tooltipBucketEnabled;
        private xAxisProperties;
        private yAxisProperties;
        private renderer;
        private playAxis;
        constructor(options: ScatterChartConstructorOptions);
        init(options: CartesianVisualInitOptions): void;
        static getAdditionalTelemetry(dataView: DataView): any;
        private static getObjectProperties(dataView, dataLabelsSettings?);
        static converter(dataView: DataView, options: ScatterConverterOptions, playFrameInfo?: PlayFrameInfo, tooltipsEnabled?: boolean, tooltipBucketEnabled?: boolean): ScatterChartData;
        private static getSizeRangeForGroups(dataViewValueGroups, sizeColumnIndex);
        private static createDataPointSeries(reader, dataValues, metadata, categories, categoryValues, categoryFormatter, categoryIdentities, categoryObjects, colorPalette, viewport, hasDynamicSeries, labelSettings, gradientValueColumn, defaultDataPointColor, categoryQueryName, colorByCategory, playFrameInfo, tooltipsEnabled, tooltipBucketEnabled?);
        static createLazyFormattedCategory(formatter: IValueFormatter, value: string): jsCommon.Lazy<string>;
        private static createSeriesLegend(dataValues, colorPalette, categorical, formatString, defaultDataPointColor);
        static getBubbleRadius(radiusData: RadiusData, sizeRange: NumberRange, viewport: IViewport): number;
        static getMeasureValue(measureIndex: number, seriesValues: DataViewValueColumn[]): DataViewValueColumn;
        private static getMetadata(grouped, source);
        /** Create a new viewmodel with default data. */
        static getDefaultData(): ScatterChartData;
        private renderAtFrame(data);
        setData(dataViews: DataView[]): void;
        private mergeSizeRanges(playData);
        calculateLegend(): LegendData;
        hasLegend(): boolean;
        enumerateObjectInstances(enumeration: ObjectEnumerationBuilder, options: EnumerateVisualObjectInstancesOptions): void;
        private hasSizeMeasure();
        private enumerateDataPoints(enumeration);
        supportsTrendLine(): boolean;
        private static getExtents(data);
        calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[];
        overrideXScale(xProperties: IAxisProperties): void;
        shouldSuppressAnimation(): boolean;
        render(suppressAnimations: boolean, resizeMode?: ResizeMode): CartesianVisualRenderResult;
        static getStrokeFill(d: ScatterChartDataPoint, colorBorder: boolean): string;
        static getBubblePixelAreaSizeRange(viewPort: IViewport, minSizeRange: number, maxSizeRange: number): DataRange;
        static project(value: number, actualSizeDataRange: DataRange, bubblePixelAreaSizeRange: DataRange): number;
        static projectSizeToPixels(size: number, actualSizeDataRange: DataRange, bubblePixelAreaSizeRange: DataRange): number;
        static rangeContains(range: DataRange, value: number): boolean;
        static getMarkerFillOpacity(hasSize: boolean, shouldEnableFill: boolean, hasSelection: boolean, isSelected: boolean): number;
        static getMarkerStrokeOpacity(hasSize: boolean, colorBorder: boolean, hasSelection: boolean, isSelected: boolean): number;
        static getMarkerStrokeFill(hasSize: boolean, colorBorder: boolean, fill: string): string;
        static getMarkerStyle(d: ScatterChartDataPoint, colorBorder: boolean, hasSelection: boolean, fillMarkers: boolean): ScatterMarkerStyle;
        static getSeriesStyle(hasSize: boolean, colorBorder: boolean, hasSelection: boolean, fillMarkers: boolean, fill: string): ScatterMarkerStyle;
        static getBubbleOpacity(d: ScatterChartDataPoint, hasSelection: boolean): number;
        onClearSelection(): void;
        getSupportedCategoryAxisType(): string;
        static sortBubbles(a: ScatterChartDataPoint, b: ScatterChartDataPoint): number;
    }
}

declare module powerbi.visuals {
    interface PlayConstructorOptions extends CartesianVisualConstructorOptions {
    }
    interface PlayInitOptions extends CartesianVisualInitOptions {
    }
    interface PlayChartDataPoint {
        frameIndex?: number;
    }
    interface PlayChartData<T extends PlayableChartData> {
        frameData: PlayChartFrameData[];
        allViewModels: T[];
        currentViewModel: T;
        currentFrameIndex: number;
        labelData: PlayAxisTickLabelData;
    }
    interface PlayChartFrameData {
        escapedText: string;
        text: string;
    }
    interface PlayChartViewModel<TData extends PlayableChartData, TViewModel> {
        data: PlayChartData<TData>;
        viewModel: TViewModel;
        viewport: IViewport;
    }
    interface PlayableChartData {
        dataPoints: any[];
    }
    interface PlayAxisTickLabelInfo {
        label: string;
        labelWidth: number;
    }
    interface PlayAxisTickLabelData {
        labelInfo: PlayAxisTickLabelInfo[];
        anyWordBreaks: boolean;
        labelFieldName?: string;
    }
    interface PlayChartRenderResult<TData extends PlayableChartData, TViewModel> {
        allDataPoints: SelectableDataPoint[];
        viewModel: PlayChartViewModel<TData, TViewModel>;
    }
    interface PlayChartRenderFrameDelegate<T> {
        (data: T): void;
    }
    interface PlayFrameInfo {
        label: string;
        column: DataViewMetadataColumn;
    }
    interface VisualDataConverterDelegate<T> {
        (dataView: DataView, playFrameInfo?: PlayFrameInfo): T;
    }
    interface ITraceLineRenderer {
        render(selectedPoints: SelectableDataPoint[], shouldAnimate: boolean): void;
        remove(): void;
    }
    class PlayAxis<T extends PlayableChartData> {
        private element;
        private svg;
        private playData;
        private renderDelegate;
        private isPlaying;
        private lastViewport;
        private ridiculousFlagForPersistProperties;
        private playControl;
        private host;
        private interactivityService;
        private isMobileChart;
        private static PlayCallout;
        private static calloutOffsetMultiplier;
        constructor(options: PlayConstructorOptions);
        init(options: PlayInitOptions): void;
        setData(dataView: DataView, visualConverter: VisualDataConverterDelegate<T>): PlayChartData<T>;
        render<TViewModel>(suppressAnimations: boolean, viewModel: TViewModel, viewport: IViewport, margin: IMargin): PlayChartRenderResult<T, TViewModel>;
        private updateCallout(viewport, margin);
        play(): void;
        private playNextFrame(playData, startFrame?, endFrame?);
        stop(): void;
        remove(): void;
        setRenderFunction(fn: PlayChartRenderFrameDelegate<T>): void;
        getCartesianExtents(existingExtents: CartesianExtents, getExtents: (T) => CartesianExtents): CartesianExtents;
        setPlayControlPosition(playControlLayout: IRect): void;
        private moveToFrameAndRender(frameIndex);
        isCurrentlyPlaying(): boolean;
    }
    module PlayChart {
        const FrameStepDuration: number;
        const FrameAnimationDuration: number;
        const ClassName: string;
        function convertMatrixToCategorical(sourceDataView: DataView, frame: number): DataView;
        function converter<T extends PlayableChartData>(dataView: DataView, visualConverter: VisualDataConverterDelegate<T>): PlayChartData<T>;
        function getDefaultPlayData<T extends PlayableChartData>(): PlayChartData<T>;
        function getMinMaxForAllFrames<T extends PlayableChartData>(playData: PlayChartData<T>, getExtents: (T) => CartesianExtents): CartesianExtents;
        function isDataViewPlayable(dataView: DataView, playRole?: string): boolean;
        /** Render trace-lines for selected data points. */
        function renderTraceLines(allDataPoints: SelectableDataPoint[], traceLineRenderer: ITraceLineRenderer, shouldAnimate: boolean): void;
    }
}

declare module powerbi.visuals {
    import SemanticFilter = powerbi.data.SemanticFilter;
    import SQExpr = powerbi.data.SQExpr;
    interface CheckboxStyle {
        transform: string;
        'transform-origin': string;
        'font-size': string;
    }
    class VerticalSlicerRenderer implements ISlicerRenderer, SlicerValueHandler {
        private element;
        private currentViewport;
        private dataView;
        private header;
        private body;
        private container;
        private listView;
        private data;
        private settings;
        private behavior;
        private hostServices;
        private textProperties;
        private domHelper;
        constructor(options?: SlicerConstructorOptions);
        getDefaultValue(): data.SQConstantExpr;
        getIdentityFields(): SQExpr[];
        getUpdatedSelfFilter(searchKey: string): SemanticFilter;
        init(slicerInitOptions: SlicerInitOptions): IInteractivityService;
        render(options: SlicerRenderOptions): void;
        private updateSelectionStyle();
        private onEnterSelection(rowSelection);
        private onUpdateSelection(rowSelection, interactivityService);
    }
}

declare module powerbi.visuals {
    import SQExpr = powerbi.data.SQExpr;
    class HorizontalSlicerRenderer implements ISlicerRenderer, SlicerValueHandler {
        private element;
        private currentViewport;
        private data;
        private interactivityService;
        private behavior;
        private hostServices;
        private dataView;
        private container;
        private header;
        private body;
        private bodyViewport;
        private itemsContainer;
        private rightNavigationArrow;
        private leftNavigationArrow;
        private dataStartIndex;
        private itemsToDisplay;
        private textProperties;
        private maxItemWidth;
        private totalItemWidth;
        private loadMoreData;
        private domHelper;
        constructor(options?: SlicerConstructorOptions);
        getDefaultValue(): data.SQConstantExpr;
        getIdentityFields(): SQExpr[];
        getUpdatedSelfFilter(searchKey: string): data.SemanticFilter;
        init(slicerInitOptions: SlicerInitOptions): IInteractivityService;
        render(options: SlicerRenderOptions): void;
        private renderCore();
        private updateStyle();
        private renderItems(defaultSettings);
        private bindInteractivityService();
        private normalizePosition(points);
        private bindNavigationEvents();
        private registerMouseClickEvents();
        private registerMouseWheelScrollEvents();
        private onMouseWheel(wheelDelta);
        private scrollRight();
        private scrollLeft();
        private isLastRowItem(fieldIndex, columnsToDisplay);
        private getScaledTextWidth(textSize);
        private isMaxWidthCalculated();
        private calculateAndSetMaxItemWidth();
        private calculateAndSetTotalItemWidth();
        private getNumberOfItemsToDisplay(widthAvailable);
        private getDataPointsCount();
    }
}

declare module powerbi.visuals {
    import DOMHelper = SlicerUtil.DOMHelper;
    import SlicerOrientation = slicerOrientation.Orientation;
    interface SlicerValueHandler {
        getDefaultValue(): data.SQConstantExpr;
        getIdentityFields(): data.SQExpr[];
        /** gets updated self filter based on the searchKey.
         *  If the searchKey didn't change, then the updated filter will be undefined. */
        getUpdatedSelfFilter(searchKey: string): data.SemanticFilter;
    }
    interface SlicerConstructorOptions {
        domHelper?: DOMHelper;
        behavior?: IInteractiveBehavior;
    }
    interface ISlicerRenderer {
        init(options: SlicerInitOptions): IInteractivityService;
        render(options: SlicerRenderOptions): void;
    }
    interface SlicerRenderOptions {
        dataView: DataView;
        data: SlicerData;
        viewport: IViewport;
        resetScrollbarPosition?: boolean;
    }
    interface SlicerData {
        categorySourceName: string;
        slicerDataPoints: SlicerDataPoint[];
        slicerSettings: SlicerSettings;
        hasSelectionOverride?: boolean;
        defaultValue?: DefaultValueDefinition;
        searchKey?: string;
    }
    interface SlicerDataPoint extends SelectableDataPoint {
        value: string;
        tooltip: string;
        isSelectAllDataPoint?: boolean;
        count: number;
        isImage?: boolean;
    }
    interface SlicerSettings {
        general: {
            outlineColor: string;
            outlineWeight: number;
            orientation: SlicerOrientation;
        };
        header: {
            borderBottomWidth: number;
            show: boolean;
            outline: string;
            fontColor: string;
            background?: string;
            textSize: number;
        };
        slicerText: {
            color: string;
            outline: string;
            background?: string;
            textSize: number;
        };
        selection: {
            selectAllCheckboxEnabled: boolean;
            singleSelect: boolean;
        };
        search: {
            enabled: boolean;
        };
    }
    interface SlicerInitOptions {
        visualInitOptions: VisualInitOptions;
        loadMoreData: () => void;
    }
    class Slicer implements IVisual {
        private element;
        private currentViewport;
        private dataView;
        private slicerData;
        private settings;
        private interactivityService;
        private behavior;
        private hostServices;
        private slicerRenderer;
        private slicerOrientation;
        private waitingForData;
        private domHelper;
        private initOptions;
        static DefaultStyleProperties(): SlicerSettings;
        constructor(options?: SlicerConstructorOptions);
        init(options: VisualInitOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(finalViewport: IViewport): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        loadMoreData(): void;
        onClearSelection(): void;
        private render(resetScrollbarPosition, stopWaitingForData?);
        private orientationHasChanged(slicerOrientation);
        private initializeSlicerRenderer(slicerOrientation);
        private initializeVerticalSlicer();
        private initializeHorizontalSlicer();
        private createInitOptions();
    }
}

declare module powerbi.visuals {
    import TablixFormattingProperties = powerbi.visuals.controls.TablixFormattingPropertiesTable;
    import TablixUtils = controls.internal.TablixUtils;
    interface DataViewVisualTable extends DataViewTable {
        visualRows?: DataViewVisualTableRow[];
        formattingProperties?: TablixFormattingProperties;
    }
    interface DataViewVisualTableRow {
        index: number;
        values: DataViewTableRow;
    }
    interface TableDataAdapter {
        update(table: DataViewTable, isDataComplete: boolean): void;
    }
    interface TableTotal {
        totalCells: any[];
    }
    class TableHierarchyNavigator implements controls.ITablixHierarchyNavigator, TableDataAdapter {
        private tableDataView;
        private formatter;
        /**
         * True if the model is not expecting more data
        */
        private isDataComplete;
        constructor(tableDataView: DataViewVisualTable, isDataComplete: boolean, formatter: ICustomValueColumnFormatter);
        /**
        * Returns the depth of the Columnm hierarchy.
        */
        getColumnHierarchyDepth(): number;
        /**
        * Returns the depth of the Row hierarchy.
        */
        getRowHierarchyDepth(): number;
        /**
         * Returns the leaf count of a hierarchy.
         */
        getLeafCount(hierarchy: any): number;
        /**
         * Returns the leaf member of a hierarchy at a specified index.
         */
        getLeafAt(hierarchy: any, index: number): any;
        /**
         * Returns the specified hierarchy member parent.
         */
        getParent(item: any): any;
        /**
         * Returns the index of the hierarchy member relative to its parent.
         */
        getIndex(item: any): number;
        private isRow(item);
        private getColumnIndex(item);
        /**
         * Checks whether a hierarchy member is a leaf.
         */
        isLeaf(item: any): boolean;
        isRowHierarchyLeaf(cornerItem: any): boolean;
        isColumnHierarchyLeaf(cornerItem: any): boolean;
        isFirstItem(item: MatrixVisualNode, items: MatrixVisualNode[]): boolean;
        areAllParentsFirst(item: any, items: any): boolean;
        /**
         * Checks whether a hierarchy member is the last item within its parent.
         */
        isLastItem(item: any, items: any[]): boolean;
        areAllParentsLast(item: any, items: any[]): boolean;
        /**
         * Gets the children members of a hierarchy member.
         */
        getChildren(item: any): any;
        getChildrenLevelDifference(item: any): number;
        /**
         * Gets the members count in a specified collection.
         */
        getCount(items: any): number;
        /**
         * Gets the member at the specified index.
         */
        getAt(items: any, index: number): any;
        /**
         * Gets the hierarchy member level.
         */
        getLevel(item: any): number;
        /**
         * Returns the intersection between a row and a column item.
         */
        getIntersection(rowItem: any, columnItem: DataViewMetadataColumn): TablixUtils.TablixVisualCell;
        /**
         * Returns the corner cell between a row and a column level.
         */
        getCorner(rowLevel: number, columnLevel: number): TablixUtils.TablixVisualCell;
        headerItemEquals(item1: any, item2: any): boolean;
        bodyCellItemEquals(item1: TablixUtils.TablixVisualCell, item2: TablixUtils.TablixVisualCell): boolean;
        cornerCellItemEquals(item1: any, item2: any): boolean;
        update(table: DataViewVisualTable, isDataComplete: boolean): void;
        static getIndex(items: any[], item: any): number;
    }
    interface TableBinderOptions {
        onBindRowHeader?(item: any): void;
        onColumnHeaderClick?(queryName: string, sortDirection: SortDirection): void;
        layoutKind?: controls.TablixLayoutKind;
    }
    /**
     * Note: Public for testability.
     */
    class TableBinder implements controls.ITablixBinder {
        private options;
        private formattingProperties;
        private tableDataView;
        private fontSizeHeader;
        private textPropsHeader;
        private textHeightHeader;
        private fontSizeValue;
        private textPropsValue;
        private textHeightValue;
        private fontSizeTotal;
        private textPropsTotal;
        private textHeightTotal;
        private rowHeight;
        constructor(options: TableBinderOptions, dataView?: DataViewVisualTable);
        updateDataView(dataView: DataViewVisualTable): void;
        private updateTextHeights();
        private hasImage();
        onStartRenderingSession(): void;
        onEndRenderingSession(): void;
        /**
         * Row Header.
         */
        bindRowHeader(item: any, cell: controls.ITablixCell): void;
        unbindRowHeader(item: any, cell: controls.ITablixCell): void;
        /**
         * Column Header.
         */
        bindColumnHeader(item: DataViewMetadataColumn, cell: controls.ITablixCell): void;
        private setColumnHeaderStyle(cell, style);
        unbindColumnHeader(item: any, cell: controls.ITablixCell): void;
        /**
         * Body Cell.
         */
        bindBodyCell(item: TablixUtils.TablixVisualCell, cell: controls.ITablixCell): void;
        setBodyContent(item: TablixUtils.TablixVisualCell, cell: controls.ITablixCell): void;
        private setBodyStyle(item, cell, style);
        private setFooterStyle(cell, style);
        unbindBodyCell(item: TablixUtils.TablixVisualCell, cell: controls.ITablixCell): void;
        /**
         * Corner Cell.
         */
        bindCornerCell(item: any, cell: controls.ITablixCell): void;
        unbindCornerCell(item: any, cell: controls.ITablixCell): void;
        bindEmptySpaceHeaderCell(cell: controls.ITablixCell): void;
        unbindEmptySpaceHeaderCell(cell: controls.ITablixCell): void;
        bindEmptySpaceFooterCell(cell: controls.ITablixCell): void;
        unbindEmptySpaceFooterCell(cell: controls.ITablixCell): void;
        /**
         * Measurement Helper.
         */
        getHeaderLabel(item: DataViewMetadataColumn): string;
        getCellContent(item: any): string;
        hasRowGroups(): boolean;
        private sortIconsEnabled();
    }
    interface TableConstructorOptions {
        isTouchEnabled?: boolean;
    }
    class Table implements IVisual {
        private static preferredLoadMoreThreshold;
        private element;
        private currentViewport;
        private style;
        private formatter;
        private isInteractive;
        private isTouchEnabled;
        private getLocalizedString;
        private hostServices;
        private tablixControl;
        private hierarchyNavigator;
        private waitingForData;
        private lastAllowHeaderResize;
        private waitingForSort;
        private columnWidthManager;
        private dataView;
        /**
        * Flag indicating that we are persisting objects, so that next onDataChanged can be safely ignored.
        */
        persistingObjects: boolean;
        constructor(options?: TableConstructorOptions);
        static customizeQuery(options: CustomizeQueryOptions): void;
        static getSortableRoles(): string[];
        init(options: VisualInitOptions): void;
        /**
         * Note: Public for testability.
         */
        static converter(dataView: DataView): DataViewVisualTable;
        onResizing(finalViewport: IViewport): void;
        getColumnWidthManager(): controls.TablixColumnWidthManager;
        onDataChanged(options: VisualDataChangedOptions): void;
        private createColumnWidthManager();
        private persistColumnWidths(objectInstances);
        private updateViewport(newViewport);
        private refreshControl(clear);
        private getLayoutKind();
        private createOrUpdateHierarchyNavigator(visualTable);
        private createTablixControl(visualTable);
        private createControl(dataNavigator, visualTable);
        private updateInternal(previousDataView, visualTable);
        private shouldClearControl(previousDataView, newDataView);
        private createTotalsRow(dataView);
        private onBindRowHeader(item);
        private onColumnHeaderClick(queryName, sortDirection);
        /**
         * Note: Public for testability.
         */
        needsMoreData(item: any): boolean;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        enumerateObjectRepetition(): VisualObjectRepetition[];
        private shouldAllowHeaderResize();
        onViewModeChanged(viewMode: ViewMode): void;
        private verifyHeaderResize();
    }
}

declare module powerbi.visuals {
    import TablixFormattingPropertiesMatrix = powerbi.visuals.controls.TablixFormattingPropertiesMatrix;
    import TablixUtils = controls.internal.TablixUtils;
    /**
     * Extension of the Matrix node for Matrix visual.
     */
    interface MatrixVisualNode extends DataViewMatrixNode {
        /**
         * Index of the node in its parent's children collection.
         *
         * Note: For size optimization, we could also look this item up in the parent's
         * children collection, but we may need to pay the perf penalty.
         */
        index?: number;
        /**
         * Global index of the node as a leaf node.
         * If the node is not a leaf, the value is undefined.
         */
        leafIndex?: number;
        /**
         * Parent of the node.
         * Undefined for outermost nodes (children of the one root node).
         */
        parent?: MatrixVisualNode;
        /**
         * Children of the same parent
         */
        siblings?: MatrixVisualNode[];
        /**
         * queryName of the node.
         * If the node is not a leaf, the value is undefined.
         */
        queryName?: string;
        /**
         * Formatted text to show for the Node
         */
        valueFormatted?: string;
    }
    interface MatrixCornerItem {
        metadata: DataViewMetadataColumn;
        displayName: string;
        isColumnHeaderLeaf: boolean;
        isRowHeaderLeaf: boolean;
    }
    class MatrixVisualBodyItem extends TablixUtils.TablixVisualCell {
        isMeasure: boolean;
        isValidUrl: boolean;
        isValidImage: boolean;
    }
    /**
    * Interface for refreshing Matrix Data View.
    */
    interface MatrixDataAdapter {
        update(dataViewMatrix?: DataViewMatrix, isDataComplete?: boolean, updateColumns?: boolean): void;
    }
    interface IMatrixHierarchyNavigator extends controls.ITablixHierarchyNavigator, MatrixDataAdapter {
        getDataViewMatrix(): DataViewMatrix;
        getLeafCount(hierarchy: MatrixVisualNode[]): number;
        getLeafAt(hierarchy: MatrixVisualNode[], index: number): any;
        getLeafIndex(item: MatrixVisualNode): number;
        getParent(item: MatrixVisualNode): MatrixVisualNode;
        getIndex(item: MatrixVisualNode): number;
        isLeaf(item: MatrixVisualNode): boolean;
        isRowHierarchyLeaf(item: any): boolean;
        isColumnHierarchyLeaf(item: any): boolean;
        isLastItem(item: MatrixVisualNode, items: MatrixVisualNode[]): boolean;
        getChildren(item: MatrixVisualNode): MatrixVisualNode[];
        getCount(items: MatrixVisualNode[]): number;
        getAt(items: MatrixVisualNode[], index: number): MatrixVisualNode;
        getLevel(item: MatrixVisualNode): number;
        getIntersection(rowItem: MatrixVisualNode, columnItem: MatrixVisualNode): MatrixVisualBodyItem;
        getCorner(rowLevel: number, columnLevel: number): MatrixCornerItem;
        headerItemEquals(item1: MatrixVisualNode, item2: MatrixVisualNode): boolean;
    }
    /**
     * Factory method used by unit tests.
     */
    function createMatrixHierarchyNavigator(matrix: DataViewMatrix, isDataComplete: boolean, formatter: ICustomValueColumnFormatter, compositeGroupSeparator: string): IMatrixHierarchyNavigator;
    interface MatrixBinderOptions {
        onBindRowHeader?(item: MatrixVisualNode): void;
        totalLabel?: string;
        onColumnHeaderClick?(queryName: string, sortDirection: SortDirection): void;
        showSortIcons?: boolean;
    }
    class MatrixBinder implements controls.ITablixBinder {
        private formattingProperties;
        private hierarchyNavigator;
        private options;
        private fontSizeHeader;
        private textPropsHeader;
        private textHeightHeader;
        private fontSizeValue;
        private textPropsValue;
        private textHeightValue;
        private fontSizeTotal;
        private textPropsTotal;
        private textHeightTotal;
        constructor(hierarchyNavigator: IMatrixHierarchyNavigator, options: MatrixBinderOptions);
        onDataViewChanged(formattingProperties: TablixFormattingPropertiesMatrix): void;
        private updateTextHeights();
        onStartRenderingSession(): void;
        onEndRenderingSession(): void;
        /**
         * Row Header.
         */
        bindRowHeader(item: MatrixVisualNode, cell: controls.ITablixCell): void;
        private setRowHeaderStyle(cell, style);
        unbindRowHeader(item: any, cell: controls.ITablixCell): void;
        /**
         * Column Header.
         */
        bindColumnHeader(item: MatrixVisualNode, cell: controls.ITablixCell): void;
        private setColumnHeaderStyle(cell, style);
        unbindColumnHeader(item: MatrixVisualNode, cell: controls.ITablixCell): void;
        private bindHeader(item, cell, cellElement, metadata, style, overwriteSubtotalLabel?);
        private registerColumnHeaderClickHandler(columnMetadata, cell);
        private unregisterColumnHeaderClickHandler(cell);
        /**
         * Body Cell.
         */
        bindBodyCell(item: MatrixVisualBodyItem, cell: controls.ITablixCell): void;
        private setBodyCellStyle(cell, item, style);
        unbindBodyCell(item: MatrixVisualBodyItem, cell: controls.ITablixCell): void;
        /**
         * Corner Cell.
         */
        bindCornerCell(item: MatrixCornerItem, cell: controls.ITablixCell): void;
        private setCornerCellsStyle(cell, style);
        unbindCornerCell(item: MatrixCornerItem, cell: controls.ITablixCell): void;
        bindEmptySpaceHeaderCell(cell: controls.ITablixCell): void;
        unbindEmptySpaceHeaderCell(cell: controls.ITablixCell): void;
        bindEmptySpaceFooterCell(cell: controls.ITablixCell): void;
        unbindEmptySpaceFooterCell(cell: controls.ITablixCell): void;
        /**
         * Measurement Helper.
         */
        getHeaderLabel(item: MatrixVisualNode): string;
        getCellContent(item: MatrixVisualBodyItem): string;
        hasRowGroups(): boolean;
        /**
         * Returns the column metadata of the column that needs to be sorted for the specified matrix corner node.
         *
         * @return Column metadata or null if the specified corner node does not represent a sortable header.
         */
        private getSortableCornerColumnMetadata(item);
        private getRowHeaderMetadata(item);
        private getColumnHeaderMetadata(item);
        private getHierarchyMetadata(hierarchy, level);
        /**
         * Returns the column metadata of the column that needs to be sorted for the specified header node.
         *
         * @return Column metadata or null if the specified header node does not represent a sortable header.
         */
        private getSortableHeaderColumnMetadata(item);
    }
    interface MatrixConstructorOptions {
        isTouchEnabled?: boolean;
    }
    class Matrix implements IVisual {
        private static preferredLoadMoreThreshold;
        /**
         * Note: Public only for testing.
         */
        static TotalLabel: string;
        private element;
        private currentViewport;
        private style;
        private dataView;
        private formatter;
        private isInteractive;
        private isTouchEnabled;
        private hostServices;
        private hierarchyNavigator;
        private waitingForData;
        private tablixControl;
        private lastAllowHeaderResize;
        private waitingForSort;
        private columnWidthManager;
        /**
        * Flag indicating that we are persisting objects, so that next onDataChanged can be safely ignored.
        */
        persistingObjects: boolean;
        constructor(options?: MatrixConstructorOptions);
        static customizeQuery(options: CustomizeQueryOptions): void;
        static getSortableRoles(): string[];
        init(options: VisualInitOptions): void;
        static converter(dataView: DataView): TablixFormattingPropertiesMatrix;
        onResizing(finalViewport: IViewport): void;
        getColumnWidthManager(): controls.TablixColumnWidthManager;
        onDataChanged(options: VisualDataChangedOptions): void;
        private createColumnWidthManager();
        private persistColumnWidths(objectInstances);
        private updateViewport(newViewport);
        private refreshControl(clear);
        private getLayoutKind();
        private createOrUpdateHierarchyNavigator(rootChanged);
        private createTablixControl(textSize);
        private createControl(matrixNavigator, textSize);
        private updateInternal(textSize, previousDataView);
        private shouldClearControl(previousDataView, newDataView);
        private onBindRowHeader(item);
        private onColumnHeaderClick(queryName, sortDirection);
        /**
         * Note: Public for testability.
         */
        needsMoreData(item: MatrixVisualNode): boolean;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        private shouldAllowHeaderResize();
        onViewModeChanged(viewMode: ViewMode): void;
        private verifyHeaderResize();
    }
}

declare module powerbi.visuals {
    interface TreemapConstructorOptions {
        animator?: ITreemapAnimator;
        isScrollable: boolean;
        behavior?: TreemapWebBehavior;
        tooltipsEnabled?: boolean;
        tooltipBucketEnabled?: boolean;
    }
    interface TreemapData {
        root: TreemapNode;
        hasHighlights: boolean;
        legendData: LegendData;
        dataLabelsSettings: VisualDataLabelsSettings;
        legendObjectProperties?: DataViewObject;
        dataWasCulled: boolean;
        hasNegativeValues?: boolean;
        allValuesAreNegative?: boolean;
    }
    /**
     * Treemap node (we extend D3 node (GraphNode) because treemap layout methods rely on the type).
     */
    interface TreemapNode extends D3.Layout.GraphNode, SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        key: any;
        originalValue: number;
        highlightMultiplier?: number;
        highlightValue?: number;
        originalHighlightValue?: number;
        color: string;
        highlightedTooltipInfo?: TooltipDataItem[];
    }
    interface ITreemapLayout {
        shapeClass: (d: TreemapNode) => string;
        shapeLayout: {
            x: (d: TreemapNode) => number;
            y: (d: TreemapNode) => number;
            width: (d: TreemapNode) => number;
            height: (d: TreemapNode) => number;
        };
        highlightShapeClass: (d: TreemapNode) => string;
        highlightShapeLayout: {
            x: (d: TreemapNode) => number;
            y: (d: TreemapNode) => number;
            width: (d: TreemapNode) => number;
            height: (d: TreemapNode) => number;
        };
        zeroShapeLayout: {
            x: (d: TreemapNode) => number;
            y: (d: TreemapNode) => number;
            width: (d: TreemapNode) => number;
            height: (d: TreemapNode) => number;
        };
        majorLabelClass: (d: TreemapNode) => string;
        majorLabelLayout: {
            x: (d: TreemapNode) => number;
            y: (d: TreemapNode) => number;
        };
        majorLabelText: (d: TreemapNode) => string;
        minorLabelClass: (d: TreemapNode) => string;
        minorLabelLayout: {
            x: (d: TreemapNode) => number;
            y: (d: TreemapNode) => number;
        };
        minorLabelText: (d: TreemapNode) => string;
        areMajorLabelsEnabled: () => boolean;
        areMinorLabelsEnabled: () => boolean;
    }
    interface ValueShape {
        validShape: boolean;
        dataWasCulled: boolean;
    }
    /**
     * Renders an interactive treemap visual from categorical data.
     */
    class Treemap implements IVisual {
        static DimmedShapeOpacity: number;
        private static ClassName;
        static LabelsGroupClassName: string;
        static MajorLabelClassName: string;
        static MinorLabelClassName: string;
        static ShapesClassName: string;
        static TreemapNodeClassName: string;
        static RootNodeClassName: string;
        static ParentGroupClassName: string;
        static NodeGroupClassName: string;
        static HighlightNodeClassName: string;
        private static TextMargin;
        private static MinorLabelTextSize;
        private static MinTextWidthForMinorLabel;
        private static MajorLabelTextSize;
        private static MinTextWidthForMajorLabel;
        private static MajorLabelTextProperties;
        /**
         * A rect with an area of 9 is a treemap rectangle of only
         * a single pixel in the middle with a 1 pixel stroke on each edge.
         */
        private static CullableArea;
        private svg;
        private treemap;
        private shapeGraphicsContext;
        private labelGraphicsContext;
        private currentViewport;
        private legend;
        private data;
        private style;
        private colors;
        private element;
        private options;
        private isScrollable;
        private hostService;
        private tooltipsEnabled;
        private tooltipBucketEnabled;
        /**
         * Note: Public for testing.
         */
        animator: ITreemapAnimator;
        private interactivityService;
        private behavior;
        private dataViews;
        static getLayout(labelsSettings: VisualDataLabelsSettings, alternativeScale: number): ITreemapLayout;
        constructor(options?: TreemapConstructorOptions);
        init(options: VisualInitOptions): void;
        /**
         * Note: Public for testing purposes.
         */
        static converter(dataView: DataView, colors: IDataColorPalette, labelSettings: VisualDataLabelsSettings, interactivityService: IInteractivityService, viewport: IViewport, legendObjectProperties?: DataViewObject, tooltipsEnabled?: boolean, tooltipBucketEnabled?: boolean): TreemapData;
        private static normalizedValue(value, allValuesAreNegative);
        private static getValuesFromCategoricalDataView(dataView, hasHighlights, valueColumnRoleName);
        private static getCullableValue(totalValue, viewport);
        update(options: VisualUpdateOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport): void;
        onClearSelection(): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        private enumerateDataPoints(enumeration, data);
        private enumerateLegend(data);
        static checkValueForShape(value: any, cullableValue: number, allValuesAreNegative: boolean, dataWasCulled: boolean): ValueShape;
        private calculateTreemapSize();
        private initViewportDependantProperties(duration?);
        private static hasChildrenWithIdentity(node);
        private static canDisplayMajorLabel(node);
        private static canDisplayMinorLabel(node, labelSettings);
        private static createMajorLabelText(node, labelsSettings, alternativeScale, formattersCache);
        private static createMinorLabelText(node, labelsSettings, alternativeScale, formattersCache);
        static getFill(d: TreemapNode, isHighlightRect: boolean): string;
        static getFillOpacity(d: TreemapNode, hasSelection: boolean, hasHighlights: boolean, isHighlightRect: boolean): string;
        private updateInternal(suppressAnimations);
        private renderLegend();
        private static getNodeClass(d, highlight?);
        private static createTreemapShapeLayout(isHighlightRect?);
        private static createTreemapZeroShapeLayout();
        static drawDefaultShapes(context: D3.Selection, nodes: D3.Layout.GraphNode[], hasSelection: boolean, hasHighlights: boolean, layout: ITreemapLayout): D3.UpdateSelection;
        static drawDefaultHighlightShapes(context: D3.Selection, nodes: D3.Layout.GraphNode[], hasSelection: boolean, hasHighlights: boolean, layout: ITreemapLayout): D3.UpdateSelection;
        static drawDefaultMajorLabels(context: D3.Selection, nodes: D3.Layout.GraphNode[], labelSettings: VisualDataLabelsSettings, layout: ITreemapLayout): D3.UpdateSelection;
        static drawDefaultMinorLabels(context: D3.Selection, nodes: D3.Layout.GraphNode[], labelSettings: VisualDataLabelsSettings, layout: ITreemapLayout): D3.UpdateSelection;
        static cleanMinorLabels(context: D3.Selection): void;
    }
}

declare module powerbi.visuals {
    interface CardStyleText {
        textSize: number;
        color: string;
        paddingTop?: number;
    }
    interface CardStyleValue extends CardStyleText {
        fontFamily: string;
    }
    interface CardStyle {
        card: {
            maxFontSize: number;
        };
        label: CardStyleText;
        value: CardStyleValue;
    }
    interface CardSmallViewportProperties {
        cardSmallViewportWidth: number;
    }
    interface CardConstructorOptions {
        isScrollable?: boolean;
        displayUnitSystemType?: DisplayUnitSystemType;
        animator?: IGenericAnimator;
        cardSmallViewportProperties?: CardSmallViewportProperties;
    }
    interface CardFormatSetting {
        textSize: number;
        labelSettings: VisualDataLabelsSettings;
        wordWrap: boolean;
    }
    class Card extends AnimatedText implements IVisual {
        private static cardClassName;
        private static Label;
        private static Value;
        private static KPIImage;
        private static cardTextProperties;
        static DefaultStyle: CardStyle;
        private animationOptions;
        private displayUnitSystemType;
        private isScrollable;
        private graphicsContext;
        private labelContext;
        private cardFormatSetting;
        private kpiImage;
        private cardSmallViewportProperties;
        constructor(options?: CardConstructorOptions);
        init(options: VisualInitOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport): void;
        private updateViewportProperties();
        private setTextProperties(text, fontSize);
        private getCardFormatTextSize();
        private isSmallViewport();
        private getCardPrecision(isSmallViewport?);
        private getCardDisplayUnits(isSmallViewport?);
        getAdjustedFontHeight(availableWidth: number, textToMeasure: string, seedFontHeight: number): number;
        clear(valueOnly?: boolean): void;
        private updateInternal(target, suppressAnimations, forceUpdate?);
        private displayStatusGraphic(statusGraphicInfo, translateX, translateY, labelTextSizeInPx);
        private getDefaultFormatSettings();
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
    }
}

declare module powerbi.visuals {
    class OwlGauge implements IVisual {
        private static owlBodySvg;
        private static owlTailSvg;
        private static visualBgSvg;
        private static owlBodyHeightMultiplier;
        private static owlTailHeightMultiplier;
        private static visualBgHeightMultiplier;
        private static OwlDemoMode;
        static capabilities: VisualCapabilities;
        static converter(dataView: DataView): any;
        private static getGaugeData(dataView);
        private rootElem;
        private svgBgElem;
        private svgBodyElem;
        private svgTailElem;
        init(options: VisualInitOptions): void;
        update(options: VisualUpdateOptions): void;
        private updateGauge(percentage);
        private happinessLevel;
        private updateViewportSize(width, height);
    }
}

declare module powerbi.visuals {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    class NoMapLocationWarning implements IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
    class FilledMapWithoutValidGeotagCategoryWarning implements IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
    class GeometryCulledWarning implements IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
    class NegativeValuesNotSupportedWarning implements IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
    class AllNegativeValuesWarning implements IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
    class NaNNotSupportedWarning implements IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
    class InfinityValuesNotSupportedWarning implements IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
    class ValuesOutOfRangeWarning implements IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
    class ZeroValueWarning implements IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
    class VisualKPIDataMissingWarning implements IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
    class ScriptVisualRefreshWarning implements IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
}

declare module powerbi.visuals {
    interface WaterfallChartData extends CartesianData {
        series: WaterfallChartSeries[];
        categories: any[];
        valuesMetadata: DataViewMetadataColumn;
        legend: LegendData;
        hasHighlights: boolean;
        categoryMetadata: DataViewMetadataColumn;
        positionMax: number;
        positionMin: number;
        sentimentColors: WaterfallChartSentimentColors;
        dataLabelsSettings: VisualDataLabelsSettings;
        axesLabels: ChartAxesLabels;
    }
    interface WaterfallChartSeries extends CartesianSeries {
        data: WaterfallChartDataPoint[];
    }
    interface WaterfallChartDataPoint extends CartesianDataPoint, SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        position: number;
        color: string;
        highlight: boolean;
        key: string;
        isTotal?: boolean;
    }
    interface WaterfallChartConstructorOptions extends CartesianVisualConstructorOptions {
    }
    interface WaterfallChartSentimentColors {
        increaseFill: Fill;
        decreaseFill: Fill;
        totalFill: Fill;
    }
    interface WaterfallLayout extends CategoryLayout, ILabelLayout {
        categoryWidth: number;
    }
    class WaterfallChart implements ICartesianVisual {
        static formatStringProp: DataViewObjectPropertyIdentifier;
        private static WaterfallClassName;
        private static MainGraphicsContextClassName;
        private static IncreaseLabel;
        private static DecreaseLabel;
        private static TotalLabel;
        private static CategoryValueClasses;
        private static WaterfallConnectorClasses;
        private static defaultTotalColor;
        private static validLabelPositions;
        private static validZeroLabelPosition;
        private svg;
        private mainGraphicsContext;
        private labelGraphicsContext;
        private mainGraphicsSVG;
        private xAxisProperties;
        private yAxisProperties;
        private currentViewport;
        private margin;
        private data;
        private element;
        private isScrollable;
        private tooltipsEnabled;
        private tooltipBucketEnabled;
        /**
         * Note: If we overflowed horizontally then this holds the subset of data we should render.
         */
        private clippedData;
        private style;
        private colors;
        private hostServices;
        private cartesianVisualHost;
        private interactivity;
        private options;
        private interactivityService;
        private layout;
        constructor(options: WaterfallChartConstructorOptions);
        init(options: CartesianVisualInitOptions): void;
        static converter(dataView: DataView, palette: IDataColorPalette, hostServices: IVisualHostServices, dataLabelSettings: VisualDataLabelsSettings, sentimentColors: WaterfallChartSentimentColors, interactivityService: IInteractivityService, tooltipsEnabled?: boolean, tooltipBucketEnabled?: boolean): WaterfallChartData;
        setData(dataViews: DataView[]): void;
        enumerateObjectInstances(enumeration: ObjectEnumerationBuilder, options: EnumerateVisualObjectInstancesOptions): void;
        private enumerateSentimentColors(enumeration);
        calculateLegend(): LegendData;
        hasLegend(): boolean;
        private static createClippedDataIfOverflowed(data, renderableDataCount);
        calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[];
        private static getDisplayUnitValueFromAxisFormatter(yAxisProperties, labelSettings);
        private static lookupXValue(data, index, type);
        static getXAxisCreationOptions(data: WaterfallChartData, width: number, layout: CategoryLayout, options: CalculateScaleAndDomainOptions): CreateAxisOptions;
        static getYAxisCreationOptions(data: WaterfallChartData, height: number, options: CalculateScaleAndDomainOptions): CreateAxisOptions;
        getPreferredPlotArea(isScalar: boolean, categoryCount: number, categoryThickness: number): IViewport;
        getVisualCategoryAxisIsScalar(): boolean;
        overrideXScale(xProperties: IAxisProperties): void;
        setFilteredData(startIndex: number, endIndex: number): any;
        private createRects(data);
        private createConnectors(data);
        render(suppressAnimations: boolean): CartesianVisualRenderResult;
        onClearSelection(): void;
        getSupportedCategoryAxisType(): string;
        static getRectTop(scale: D3.Scale.GenericScale<any>, pos: number, value: number): number;
        private getAvailableWidth();
        private getAvailableHeight();
        private getSentimentColorsFromObjects(objects);
        createLabelDataPoints(): LabelDataPoint[];
    }
}

declare module powerbi.visuals {
    import TouchUtils = powerbi.visuals.controls.TouchUtils;
    interface TooltipDataItem {
        displayName: string;
        value: string;
        color?: string;
        header?: string;
        opacity?: string;
    }
    interface TooltipOptions {
        opacity: number;
        animationDuration: number;
        offsetX: number;
        offsetY: number;
    }
    interface TooltipEnabledDataPoint {
        tooltipInfo?: TooltipDataItem[];
    }
    interface TooltipCategoryDataItem {
        value?: any;
        metadata: DataViewMetadataColumn[];
    }
    interface TooltipSeriesDataItem {
        value?: any;
        highlightedValue?: any;
        metadata: DataViewValueColumn;
    }
    interface TooltipLocalizationOptions {
        highlightedValueDisplayName: string;
    }
    interface TooltipEvent {
        data: any;
        coordinates: number[];
        elementCoordinates: number[];
        context: HTMLElement;
        isTouchEvent: boolean;
    }
    class ToolTipComponent {
        tooltipOptions: TooltipOptions;
        private static DefaultTooltipOptions;
        private tooltipContainer;
        private isTooltipVisible;
        private currentTooltipData;
        private customScreenWidth;
        private customScreenHeight;
        static parentContainerSelector: string;
        static highlightedValueDisplayNameResorceKey: string;
        static localizationOptions: TooltipLocalizationOptions;
        constructor(tooltipOptions?: TooltipOptions);
        isTooltipComponentVisible(): boolean;
        /** Note: For tests only */
        setTestScreenSize(width: number, height: number): void;
        show(tooltipData: TooltipDataItem[], clickedArea: TouchUtils.Rectangle): void;
        move(tooltipData: TooltipDataItem[], clickedArea: TouchUtils.Rectangle): void;
        hide(): void;
        private createTooltipContainer();
        private setTooltipContent(tooltipData);
        private getTooltipPosition(clickedArea, clickedScreenArea);
        private setPosition(clickedArea);
        private setTooltipContainerClass(clickedScreenArea);
        private setArrowPosition(clickedScreenArea);
        private getArrowElement();
        private getClickedScreenArea(clickedArea);
    }
    module TooltipManager {
        let ShowTooltips: boolean;
        let ToolTipInstance: ToolTipComponent;
        function addTooltip(selection: D3.Selection, getTooltipInfoDelegate: (tooltipEvent: TooltipEvent) => TooltipDataItem[], reloadTooltipDataOnMouseMove?: boolean, onMouseOutDelegate?: () => void): void;
        function showDelayedTooltip(tooltipEvent: TooltipEvent, getTooltipInfoDelegate: (tooltipEvent: TooltipEvent) => TooltipDataItem[], delayInMs: number): number;
        function hideDelayedTooltip(): number;
        function setLocalizedStrings(localizationOptions: TooltipLocalizationOptions): void;
    }
    module TooltipBuilder {
        function createTooltipInfo(formatStringProp: DataViewObjectPropertyIdentifier, dataViewCat: DataViewCategorical, categoryValue: any, value?: any, categories?: DataViewCategoryColumn[], seriesData?: TooltipSeriesDataItem[], seriesIndex?: number, categoryIndex?: number, highlightedValue?: any, gradientValueColumn?: DataViewValueColumn): TooltipDataItem[];
        function createGradientToolTipData(gradientValueColumn: DataViewValueColumn, categoryIndex: number): TooltipSeriesDataItem;
        function addTooltipBucketItem(reader: data.IDataViewCategoricalReader, tooltipInfo: TooltipDataItem[], categoryIndex: number, seriesIndex?: number): void;
    }
}

declare module powerbi.visuals {
    module visualStyles {
        function create(dataColors?: IDataColorPalette): IVisualStyle;
    }
}

declare module powerbi.visuals {
    interface DonutSmallViewPortProperties {
        maxHeightToScaleDonutLegend: number;
    }
    interface DonutConstructorOptions {
        sliceWidthRatio?: number;
        animator?: IDonutChartAnimator;
        isScrollable?: boolean;
        disableGeometricCulling?: boolean;
        behavior?: IInteractiveBehavior;
        tooltipsEnabled?: boolean;
        tooltipBucketEnabled?: boolean;
        smallViewPortProperties?: DonutSmallViewPortProperties;
    }
    /**
     * Used because data points used in D3 pie layouts are placed within a container with pie information.
     */
    interface DonutArcDescriptor extends D3.Layout.ArcDescriptor {
        data: DonutDataPoint;
    }
    interface DonutDataPoint extends SelectableDataPoint, TooltipEnabledDataPoint {
        measure: number;
        originalMeasure: number;
        measureFormat?: string;
        percentage: number;
        highlightRatio?: number;
        highlightValue?: number;
        originalHighlightValue?: number;
        label: string;
        index: number;
        /** Data points that may be drilled into */
        internalDataPoints?: DonutDataPoint[];
        color: string;
        strokeWidth: number;
        labelFormatString: string;
        /** This is set to true only when it's the last slice and all slices have the same color*/
        isLastInDonut?: boolean;
    }
    interface DonutData {
        dataPointsToDeprecate: DonutDataPoint[];
        dataPoints: DonutArcDescriptor[];
        unCulledDataPoints: DonutDataPoint[];
        dataPointsToEnumerate?: LegendDataPoint[];
        legendData: LegendData;
        hasHighlights: boolean;
        highlightsOverflow: boolean;
        dataLabelsSettings: VisualDataLabelsSettings;
        legendObjectProperties?: DataViewObject;
        maxValue?: number;
        visibleGeometryCulled?: boolean;
        defaultDataPointColor?: string;
        hasNegativeValues?: boolean;
        allValuesAreNegative?: boolean;
    }
    interface DonutLayout {
        shapeLayout: {
            d: (d: DonutArcDescriptor) => string;
        };
        highlightShapeLayout: {
            d: (d: DonutArcDescriptor) => string;
        };
        zeroShapeLayout: {
            d: (d: DonutArcDescriptor) => string;
        };
    }
    /**
     * Renders a donut chart.
     */
    class DonutChart implements IVisual {
        private static ClassName;
        private static InteractiveLegendClassName;
        private static InteractiveLegendArrowClassName;
        private static OuterArcRadiusRatio;
        private static InnerArcRadiusRatio;
        private static OpaqueOpacity;
        private static SemiTransparentOpacity;
        private static defaultSliceWidthRatio;
        private static invisibleArcLengthInPixels;
        private static sliceClass;
        private static sliceHighlightClass;
        private static twoPi;
        static InteractiveLegendContainerHeight: number;
        static EffectiveZeroValue: number;
        static PolylineOpacity: number;
        private dataViews;
        private sliceWidthRatio;
        private svg;
        private mainGraphicsContext;
        private labelGraphicsContext;
        private clearCatcher;
        private legendContainer;
        private interactiveLegendArrow;
        private parentViewport;
        private currentViewport;
        private formatter;
        private data;
        private pie;
        private arc;
        private outerArc;
        private radius;
        private previousRadius;
        private key;
        private colors;
        private style;
        private drilled;
        private allowDrilldown;
        private options;
        private isInteractive;
        private interactivityState;
        private chartRotationAnimationDuration;
        private interactivityService;
        private behavior;
        private legend;
        private hasSetData;
        private isScrollable;
        private disableGeometricCulling;
        private hostService;
        private settings;
        private tooltipsEnabled;
        private tooltipBucketEnabled;
        private donutProperties;
        private maxHeightToScaleDonutLegend;
        /**
         * Note: Public for testing.
         */
        animator: IDonutChartAnimator;
        constructor(options?: DonutConstructorOptions);
        static converter(dataView: DataView, colors: IDataColorPalette, defaultDataPointColor?: string, viewport?: IViewport, disableGeometricCulling?: boolean, interactivityService?: IInteractivityService, tooltipsEnabled?: boolean, tooltipBucketEnabled?: boolean): DonutData;
        init(options: VisualInitOptions): void;
        update(options: VisualUpdateOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        private enumerateDataPoints(enumeration);
        private enumerateLegend(enumeration);
        setInteractiveChosenSlice(sliceIndex: number): void;
        private calculateRadius();
        private getScaleForLegendArrow();
        private initViewportDependantProperties(duration?);
        private initDonutProperties();
        private mergeDatasets(first, second);
        private updateInternal(data, suppressAnimations, duration?);
        private createLabels();
        private createLabelDataPoints();
        private createLabelDataPoint(d, alternativeScale, measureFormatterCache);
        private renderLegend();
        private addInteractiveLegendArrow();
        private calculateSliceAngles();
        private assignInteractions(slices, highlightSlices, data);
        private assignInteractiveChartInteractions(slice);
        /**
         * Get the angle (in degrees) of the drag event coordinates.
         * The angle is calculated against the plane of the center of the donut
         * (meaning, when the center of the donut is at (0,0) coordinates).
         */
        private getAngleFromDragEvent();
        private interactiveDragStart();
        private interactiveDragMove();
        private interactiveDragEnd();
        private updateInternalToMove(data, duration?);
        static drawDefaultShapes(graphicsContext: D3.Selection, donutData: DonutData, layout: DonutLayout, colors: IDataColorPalette, radius: number, hasSelection: boolean, sliceWidthRatio: number, defaultColor?: string): D3.UpdateSelection;
        static drawDefaultHighlightShapes(graphicsContext: D3.Selection, donutData: DonutData, layout: DonutLayout, colors: IDataColorPalette, radius: number, sliceWidthRatio: number): D3.UpdateSelection;
        /**
            Set true to the last data point when all slices have the same color
        */
        static isSingleColor(dataPoints: DonutArcDescriptor[]): void;
        static drawStrokeForDonutChart(radius: number, innerArcRadiusRatio: number, d: DonutArcDescriptor, sliceWidthRatio: number, highlightRatio?: number): string;
        onClearSelection(): void;
        static getLayout(radius: number, sliceWidthRatio: number, viewport: IViewport): DonutLayout;
        private static getHighlightRadius(radius, sliceWidthRatio, highlightRatio);
        static cullDataByViewport(dataPoints: DonutDataPoint[], maxValue: number, viewport: IViewport): DonutDataPoint[];
    }
}

declare module powerbi.visuals {
    interface ScriptVisualDataViewObjects extends DataViewObjects {
        script: ScriptObject;
    }
    interface ScriptObject extends DataViewObject {
        provider: string;
        source: string;
    }
    interface ScriptVisualOptions {
        canRefresh: boolean;
    }
    class ScriptVisual implements IVisual {
        private element;
        private imageBackgroundElement;
        private imageElement;
        private hostServices;
        private canRefresh;
        constructor(options: ScriptVisualOptions);
        init(options: VisualInitOptions): void;
        update(options: VisualUpdateOptions): void;
        onResizing(finalViewport: IViewport, resizeMode?: ResizeMode): void;
        private ensureHtmlElement();
        private ensureImageElement();
    }
}

declare module powerbi.visuals.system {
    class DebugVisual implements IVisual {
        static defaultCapabilities: VisualCapabilities;
        static capabilities: VisualCapabilities;
        private static autoReloadPollTime;
        private static errorMessageTemplate;
        private adapter;
        private container;
        private visualContainer;
        private optionsForVisual;
        private host;
        private autoRefreshBtn;
        private refreshBtn;
        private dataBtn;
        private lastUpdateOptions;
        private lastUpdateStatus;
        private visualGuid;
        private autoReloadInterval;
        private statusLoading;
        private dataViewShowing;
        private reloadAdapter(auto?);
        private loadVisual(guid);
        /**
         * Toggles auto reload
         * if value is set it sets it to true = on / false = off
         */
        private toggleAutoReload(value?);
        /**
         * Toggles dataViewer
         * if value is set it sets it to true = on / false = off
         */
        private toggleDataview(value?);
        private createRefreshBtn();
        private createAutoRefreshBtn();
        private createDataBtn();
        private createHelpBtn();
        private createSmilyBtn();
        private buildControls();
        private buildErrorMessage(options);
        private setCapabilities(capabilities?);
        init(options: VisualInitOptions): void;
        update(options: VisualUpdateOptions): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        destroy(): void;
    }
}

declare module powerbi.visuals.plugins {
    const animatedNumber: IVisualPlugin;
    let areaChart: IVisualPlugin;
    let barChart: IVisualPlugin;
    let basicShape: IVisualPlugin;
    let card: IVisualPlugin;
    let multiRowCard: IVisualPlugin;
    let clusteredBarChart: IVisualPlugin;
    let clusteredColumnChart: IVisualPlugin;
    let columnChart: IVisualPlugin;
    let comboChart: IVisualPlugin;
    let dataDotChart: IVisualPlugin;
    let dataDotClusteredColumnComboChart: IVisualPlugin;
    let dataDotStackedColumnComboChart: IVisualPlugin;
    let donutChart: IVisualPlugin;
    let funnel: IVisualPlugin;
    let gauge: IVisualPlugin;
    let hundredPercentStackedBarChart: IVisualPlugin;
    let hundredPercentStackedColumnChart: IVisualPlugin;
    let image: IVisualPlugin;
    let lineChart: IVisualPlugin;
    let lineStackedColumnComboChart: IVisualPlugin;
    let lineClusteredColumnComboChart: IVisualPlugin;
    let map: IVisualPlugin;
    let filledMap: IVisualPlugin;
    let treemap: IVisualPlugin;
    let pieChart: IVisualPlugin;
    let scatterChart: IVisualPlugin;
    let stackedAreaChart: IVisualPlugin;
    let table: IVisualPlugin;
    let matrix: IVisualPlugin;
    let slicer: IVisualPlugin;
    let textbox: IVisualPlugin;
    let waterfallChart: IVisualPlugin;
    let cheerMeter: IVisualPlugin;
    let consoleWriter: IVisualPlugin;
    let helloIVisual: IVisualPlugin;
    let owlGauge: IVisualPlugin;
    let scriptVisual: IVisualPlugin;
    let kpi: IVisualPlugin;
    let debugVisual: IVisualPlugin;
}

declare module powerbi.visuals {
    module CanvasBackgroundHelper {
        function getDefaultColor(): string;
        function getDefaultValues(): {
            color: string;
        };
    }
}

declare module powerbi.visuals {
    interface IScaledRange<T> {
        getValue(): ValueRange<T>;
        setValue(value: ValueRange<T>): any;
        setScaledValue(value: ValueRange<number>): any;
        getScaledValue(): ValueRange<number>;
    }
    /**
     * Implements IRange interface for the Date type.
     */
    class DateRange implements IScaledRange<Date> {
        private value;
        private scaledValue;
        private scale;
        constructor(min: Date, max: Date, start?: Date, end?: Date);
        getScaledValue(): ValueRange<number>;
        setValue(original: ValueRange<Date>): void;
        getValue(): ValueRange<Date>;
        /**
         * Updates scaled value.
         * Value should in range [0 .. 100].
         */
        setScaledValue(value: ValueRange<number>): void;
    }
}

declare module powerbi.visuals {
    function tableStylePresets(): VisualStylePresets;
}














































declare module jsCommon {
    /**
     * DOM constants.
     */
    module DOMConstants {
        /**
         * Integer codes corresponding to individual keys on the keyboard.
         */
        const escKeyCode: number;
        const enterKeyCode: number;
        const tabKeyCode: number;
        const upArrowKeyCode: number;
        const downArrowKeyCode: number;
        const leftArrowKeyCode: number;
        const rightArrowKeyCode: number;
        const homeKeyCode: number;
        const endKeyCode: number;
        const backSpaceKeyCode: number;
        const deleteKeyCode: number;
        const spaceKeyCode: number;
        const shiftKeyCode: number;
        const ctrlKeyCode: number;
        const altKeyCode: number;
        const aKeyCode: number;
        const cKeyCode: number;
        const sKeyCode: number;
        const vKeyCode: number;
        const wKeyCode: number;
        const xKeyCode: number;
        const yKeyCode: number;
        const zKeyCode: number;
        /**
         * DOM Elements.
         */
        const DocumentBody: string;
        const Anchor: string;
        const EditableTextElements: string;
        const EditableNumericElements: string;
        /**
         * DOM Attributes and values.
         */
        const disabledAttributeOrValue: string;
        const readonlyAttributeOrValue: string;
        const idAttribute: string;
        const styleAttribute: string;
        const hrefAttribute: string;
        const targetAttribute: string;
        const blankValue: string;
        const selfValue: string;
        const classAttribute: string;
        const titleAttribute: string;
        const srcAttribute: string;
        /**
         * DOM event names.
         */
        const contextmenuEventName: string;
        const blurEventName: string;
        const keyUpEventName: string;
        const inputEventName: string;
        const changeEventName: string;
        const cutEventName: string;
        const keyDownEventName: string;
        const mouseMoveEventName: string;
        const mouseDownEventName: string;
        const mouseEnterEventName: string;
        const mouseLeaveEventName: string;
        const mouseOverEventName: string;
        const mouseOutEventName: string;
        const mouseClickEventName: string;
        const pasteEventName: string;
        const scrollEventName: string;
        const dropEventName: string;
        const focusEventName: string;
        const focusInEventName: string;
        const focusOutEventName: string;
        const selectEventName: string;
        const messageEventName: string;
        const loadEventName: string;
        const beforeUnload: string;
        /**
         * Common DOM event combination names.
         */
        const inputAndSelectEventNames: string;
    }
}

declare module powerbi {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    const RS_AccessDeniedDueToRLSGroup: string;
    const RS_CannotRetrieveModel: string;
    const DMTS_NoGatewayWithAllDatasourcesToBindError: string;
    const DM_GWPipeline_UnknownError: string;
    interface ServiceError {
        statusCode: number;
        /**
         * This error code corresponds with a PowerBIServiceException that happened on the server.
         */
        errorCode?: string;
        /**
         * Message and stack trace should only be sent in non-production environments.
         */
        message?: string;
        stackTrace?: string;
        errorDetails?: PowerBIErrorDetail[];
        parameters?: ErrorParameter[];
    }
    interface PowerBIErrorDetail {
        code: string;
        detail: PowerBIErrorDetailValue;
    }
    interface ErrorParameter {
        Key: string;
        Value: string;
    }
    interface PowerBIErrorDetailValue {
        type: PowerBIErrorResourceType;
        value: string;
    }
    enum PowerBIErrorResourceType {
        ResourceCodeReference = 0,
        EmbeddedString = 1,
    }
    const enum ServiceErrorStatusCode {
        GeneralError = 0,
        CsdlFetching = 1,
        CsdlConvertXmlToConceptualSchema = 2,
        CsdlCreateClientSchema = 3,
        ExecuteSemanticQueryError = 4,
        ExecuteSemanticQueryInvalidStreamFormat = 5,
        ExecuteSemanticQueryTransformError = 6,
    }
    class ServiceErrorToClientError implements IClientError {
        private m_serviceError;
        private httpRequestId;
        private static codeName;
        code: string;
        ignorable: boolean;
        requestId: string;
        constructor(serviceError: ServiceError);
        getDetails(resourceProvider: IStringResourceProvider): ErrorDetails;
    }
    class PowerBIErrorDetailHelper {
        private static serverErrorPrefix;
        static addAdditionalInfo(errorDetails: ErrorDetails, pbiErrorDetails: PowerBIErrorDetail[], localize: IStringResourceProvider): ErrorDetails;
        static addDebugErrorInfo(errorDetails: ErrorDetails, errorCode: string, message: string, stackTrace: string): ErrorDetails;
        static GetDetailsFromTransformError(localize: IStringResourceProvider, serviceError: ServiceError): ErrorDetails;
        static GetDetailsFromServerError(localize: IStringResourceProvider, serviceError: ServiceError): ErrorDetails;
    }
}

declare module powerbi {
    let build: any;
    let buildDetails: any;
    let customVisualsUrl: any;
}

declare module powerbi {
    const CategoryTypes: {
        Address: string;
        City: string;
        Continent: string;
        CountryRegion: string;
        County: string;
        Longitude: string;
        Latitude: string;
        Place: string;
        PostalCode: string;
        StateOrProvince: string;
    };
    interface IGeoTaggingAnalyzerService {
        isLongitudeOrLatitude(fieldRefName: string): boolean;
        isGeographic(fieldRefName: string): boolean;
        isGeocodable(fieldRefName: string): boolean;
        getFieldType(fieldName: string): string;
        isGeoshapable(fieldRefName: string): boolean;
    }
    function createGeoTaggingAnalyzerService(getLocalized: (string) => string): IGeoTaggingAnalyzerService;
    class GeoTaggingAnalyzerService implements IGeoTaggingAnalyzerService {
        private GeotaggingString_Continent;
        private GeotaggingString_Continents;
        private GeotaggingString_Country;
        private GeotaggingString_Countries;
        private GeotaggingString_State;
        private GeotaggingString_States;
        private GeotaggingString_City;
        private GeotaggingString_Cities;
        private GeotaggingString_Town;
        private GeotaggingString_Towns;
        private GeotaggingString_Province;
        private GeotaggingString_Provinces;
        private GeotaggingString_County;
        private GeotaggingString_Counties;
        private GeotaggingString_Village;
        private GeotaggingString_Villages;
        private GeotaggingString_Post;
        private GeotaggingString_Zip;
        private GeotaggingString_Code;
        private GeotaggingString_Place;
        private GeotaggingString_Places;
        private GeotaggingString_Address;
        private GeotaggingString_Addresses;
        private GeotaggingString_Street;
        private GeotaggingString_Streets;
        private GeotaggingString_Longitude;
        private GeotaggingString_Longitude_Short;
        private GeotaggingString_Longitude_Short2;
        private GeotaggingString_Latitude;
        private GeotaggingString_Latitude_Short;
        private GeotaggingString_PostalCode;
        private GeotaggingString_PostalCodes;
        private GeotaggingString_ZipCode;
        private GeotaggingString_ZipCodes;
        private GeotaggingString_Territory;
        private GeotaggingString_Territories;
        private GeotaggingString_VRMBackCompat_CountryRegion;
        private GeotaggingString_VRMBackCompat_StateOrProvince;
        constructor(getLocalized: (string) => string);
        isLongitudeOrLatitude(fieldRefName: string): boolean;
        isGeographic(fieldRefName: string): boolean;
        isGeocodable(fieldRefName: string): boolean;
        isGeoshapable(fieldRefName: string): boolean;
        private isGeoshapableEnglish(fieldRefName);
        private isAddress(fieldRefName);
        private isPlace(fieldRefName);
        private isCity(fieldRefName);
        private isStateOrProvince(fieldRefName);
        private isCountry(fieldRefName);
        private isCounty(fieldRefName);
        private isContinent(fieldRefName);
        private isPostalCode(fieldRefName);
        private isLongitude(fieldRefName);
        private isLatitude(fieldRefName);
        private isTerritory(fieldRefName);
        private static hasMatches(fieldName, possibleMatches, useStrict?);
        getFieldType(fieldName: string): string;
        private isEnglishAddress(fieldRefName);
        private isEnglishPlace(fieldRefName);
        private isEnglishCity(fieldRefName);
        private isEnglishStateOrProvince(fieldRefName);
        private isEnglishCountry(fieldRefName);
        private isEnglishCounty(fieldRefName);
        private isEnglishContinent(fieldRefName);
        private isEnglishPostalCode(fieldRefName);
        private isEnglishLongitude(fieldRefName);
        private isEnglishLatitude(fieldRefName);
        protected isEnglishTerritory(fieldRefName: string): boolean;
        private getEnglishFieldType(fieldName);
    }
}
declare var DEBUG: boolean;

declare module powerbi {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    interface ILocalizableError {
        getDetails(resourceProvider: IStringResourceProvider): ErrorDetails;
    }
    interface IClientError extends ILocalizableError {
        code: string;
        debugInfo?: string;
        ignorable?: boolean;
        requestId?: string;
    }
    interface IClientWarning extends ILocalizableError {
        code: string;
        columnNameFromIndex: (index: number) => string;
    }
    /**
     * Unlocalized strings to be used for error reporting.
     */
    module ClientErrorStrings {
        const ClientErrorCode: string;
        const ErrorCode: string;
        const ErrorDetails: string;
        const HttpRequestId: string;
        const JobId: string;
        const ODataErrorMessage: string;
        const StackTrace: string;
    }
    /**
     this base class should be derived to give a generic error message but with a unique error code.
     */
    abstract class UnknownClientError implements IClientError {
        private errorCode;
        code: string;
        ignorable: boolean;
        constructor(code: string);
        getDetails(resourceProvider: IStringResourceProvider): ErrorDetails;
    }
    class HttpClientError implements IClientError {
        private httpRequestId;
        private httpStatusCode;
        constructor(httpStatusCode: number, requestId: string);
        code: string;
        ignorable: boolean;
        requestId: string;
        getDetails(resourceProvider: IStringResourceProvider): ErrorDetails;
    }
    class IgnorableClientError implements IClientError {
        code: string;
        ignorable: boolean;
        getDetails(resourceProvider: IStringResourceProvider): ErrorDetails;
    }
}

declare module jsCommon {
    interface ArrayIdItems<T> extends Array<T> {
        withId(id: number): T;
    }
    interface ArrayNamedItems<T> extends Array<T> {
        withName(name: string): T;
    }
    /**
     * Compares two objects and returns a value indicating whether one is less than, equal to, or greater than the other.
     */
    interface IComparer<T> {
        /**
         * Returns a signed number that indicates the relative values of x and y, as shown in the following table.
         *
         *         Value     |       Meaning
         * ------------------|--------------------
         * Less than zero    | a is less than b
         * Zero              | a equals b
         * Greater than zero | a is greater than b
         */
        (a: T, b: T): number;
    }
    module ArrayExtensions {
        /**
         * Returns items that exist in target and other.
         */
        function intersect<T>(target: T[], other: T[]): T[];
        /**
         * Return elements exists in target but not exists in other.
         */
        function diff<T>(target: T[], other: T[]): T[];
        /**
         * Return an array with only the distinct items in the source.
         */
        function distinct<T>(source: T[]): T[];
        /**
         * Pushes content of source onto target,
         * for parts of course that do not already exist in target.
         */
        function union<T>(target: T[], source: T[]): void;
        /**
         * Pushes value onto target, if value does not already exist in target.
         */
        function unionSingle<T>(target: T[], value: T): void;
        /**
         * Returns an array with a range of items from source,
         * including the startIndex & endIndex.
         */
        function range<T>(source: T[], startIndex: number, endIndex: number): T[];
        /**
         * Returns an array that includes items from source, up to the specified count.
         */
        function take<T>(source: T[], count: number): T[];
        function copy<T>(source: T[]): T[];
        /**
         * Returns a value indicating whether the arrays have the same values in the same sequence.
         */
        function sequenceEqual<T>(left: T[], right: T[], comparison: (x: T, y: T) => boolean): boolean;
        /**
         * Returns null if the specified array is empty.
         * Otherwise returns the specified array.
         */
        function emptyToNull<T>(array: T[]): T[];
        function indexOf<T>(array: T[], predicate: (T) => boolean): number;
        /**
         * Returns a copy of the array rotated by the specified offset.
         */
        function rotate<T>(array: T[], offset: number): T[];
        function createWithId<T>(): ArrayIdItems<T>;
        function extendWithId<T>(array: {
            id: number;
        }[]): ArrayIdItems<T>;
        /**
         * Finds and returns the first item with a matching ID.
         */
        function findWithId<T>(array: T[], id: number): T;
        function createWithName<T>(): ArrayNamedItems<T>;
        function extendWithName<T>(array: {
            name: string;
        }[]): ArrayNamedItems<T>;
        function findItemWithName<T>(array: T[], name: string): T;
        function indexWithName<T>(array: T[], name: string): number;
        /**
         * Inserts a number in sorted order into a list of numbers already in sorted order.
         * @returns True if the item was added, false if it already existed.
         */
        function insertSorted(list: number[], value: number): boolean;
        /**
         * Removes the first occurrence of a value from a list if it exists.
         * @returns True if the value was removed, false if it did not exist in the list.
         */
        function removeFirst<T>(list: T[], value: T): boolean;
        /**
         * Deletes all items from the array.
         */
        function clear(array: any[]): void;
        function isUndefinedOrEmpty(array: any[]): boolean;
        function swap<T>(array: T[], firstIndex: number, secondIndex: number): void;
        function isInArray<T>(array: T[], lookupItem: T, compareCallback: (item1: T, item2: T) => boolean): boolean;
        /** Checks if the given object is an Array, and looking all the way up the prototype chain. */
        function isArrayOrInheritedArray(obj: {}): obj is Array<any>;
        /**
         * Returns true if the specified values array is sorted in an order as determined by the specified compareFunction.
         */
        function isSorted<T>(values: T[], compareFunction: IComparer<T>): boolean;
        /**
         * Returns true if the specified number values array is sorted in ascending order
         * (or descending order if the specified descendingOrder is truthy).
         */
        function isSortedNumeric(values: number[], descendingOrder?: boolean): boolean;
    }
}

declare module InJs {
    module DomFactory {
        function div(): JQuery;
        function span(): JQuery;
        function checkbox(): JQuery;
        function ul(): JQuery;
        function li(): JQuery;
        function button(): JQuery;
        function select(): JQuery;
        function textBox(): JQuery;
        function img(): JQuery;
        function iframe(): JQuery;
    }
}

declare module powerbi {
    /**
     * Module Double contains a set of constants and precision based utility methods
     * for dealing with doubles and their decimal garbage in the javascript.
     */
    module Double {
        const MIN_VALUE: number;
        const MAX_VALUE: number;
        const MIN_EXP: number;
        const MAX_EXP: number;
        const EPSILON: number;
        const DEFAULT_PRECISION: number;
        const DEFAULT_PRECISION_IN_DECIMAL_DIGITS: number;
        const LOG_E_10: number;
        const POSITIVE_POWERS: number[];
        const NEGATIVE_POWERS: number[];
        /**
         * Returns powers of 10.
         * Unlike the Math.pow this function produces no decimal garbage.
         * @param exp Exponent.
         */
        function pow10(exp: number): number;
        /**
         * Returns the 10 base logarithm of the number.
         * Unlike Math.log function this produces integer results with no decimal garbage.
         * @param val Positive value or zero.
         */
        function log10(val: number): number;
        /**
         * Returns a power of 10 representing precision of the number based on the number of meaningful decimal digits.
         * For example the precision of 56,263.3767 with the 6 meaningful decimal digit is 0.1.
         * @param x Value.
         * @param decimalDigits How many decimal digits are meaningfull.
         */
        function getPrecision(x: number, decimalDigits?: number): number;
        /**
         * Checks if a delta between 2 numbers is less than provided precision.
         * @param x One value.
         * @param y Another value.
         * @param precision Precision value.
         */
        function equalWithPrecision(x: number, y: number, precision?: number): boolean;
        /**
         * Checks if a first value is less than another taking
         * into account the loose precision based equality.
         * @param x One value.
         * @param y Another value.
         * @param precision Precision value.
         */
        function lessWithPrecision(x: number, y: number, precision?: number): boolean;
        /**
         * Checks if a first value is less or equal than another taking
         * into account the loose precision based equality.
         * @param x One value.
         * @param y Another value.
         * @param precision Precision value.
         */
        function lessOrEqualWithPrecision(x: number, y: number, precision?: number): boolean;
        /**
         * Checks if a first value is greater than another taking
         * into account the loose precision based equality.
         * @param x One value.
         * @param y Another value.
         * @param precision Precision value.
         */
        function greaterWithPrecision(x: number, y: number, precision?: number): boolean;
        /**
         * Checks if a first value is greater or equal to another taking
         * into account the loose precision based equality.
         * @param x One value.
         * @param y Another value.
         * @param precision Precision value.
         */
        function greaterOrEqualWithPrecision(x: number, y: number, precision?: number): boolean;
        /**
         * Floors the number unless it's withing the precision distance from the higher int.
         * @param x One value.
         * @param precision Precision value.
         */
        function floorWithPrecision(x: number, precision?: number): number;
        /**
         * Ceils the number unless it's withing the precision distance from the lower int.
         * @param x One value.
         * @param precision Precision value.
         */
        function ceilWithPrecision(x: number, precision?: number): number;
        /**
         * Floors the number to the provided precision.
         * For example 234,578 floored to 1,000 precision is 234,000.
         * @param x One value.
         * @param precision Precision value.
         */
        function floorToPrecision(x: number, precision?: number): number;
        /**
         * Ceils the number to the provided precision.
         * For example 234,578 floored to 1,000 precision is 235,000.
         * @param x One value.
         * @param precision Precision value.
         */
        function ceilToPrecision(x: number, precision?: number): number;
        /**
         * Rounds the number to the provided precision.
         * For example 234,578 floored to 1,000 precision is 235,000.
         * @param x One value.
         * @param precision Precision value.
         */
        function roundToPrecision(x: number, precision?: number): number;
        /**
         * Returns the value making sure that it's restricted to the provided range.
         * @param x One value.
         * @param min Range min boundary.
         * @param max Range max boundary.
         */
        function ensureInRange(x: number, min: number, max: number): number;
        /**
         * Rounds the value - this method is actually faster than Math.round - used in the graphics utils.
         * @param x Value to round.
         */
        function round(x: number): number;
        /**
         * Projects the value from the source range into the target range.
         * @param value Value to project.
         * @param fromMin Minimum of the source range.
         * @param toMin Minimum of the target range.
         * @param toMax Maximum of the target range.
         */
        function project(value: number, fromMin: number, fromSize: number, toMin: number, toSize: number): number;
        /**
         * Removes decimal noise.
         * @param value Value to be processed.
         */
        function removeDecimalNoise(value: number): number;
        /**
         * Checks whether the number is integer.
         * @param value Value to be checked.
         */
        function isInteger(value: number): boolean;
        /**
         * Dividing by increment will give us count of increments
         * Round out the rough edges into even integer
         * Multiply back by increment to get rounded value
         * e.g. Rounder.toIncrement(0.647291, 0.05) => 0.65
         * @param value - value to round to nearest increment
         * @param increment - smallest increment to round toward
         */
        function toIncrement(value: number, increment: number): number;
    }
}

declare module jsCommon {
    module Color {
        function rotate(rgbString: string, rotateFactor: number): string;
        function normalizeToHexString(color: string): string;
        function parseColorString(color: string): RgbColor;
        function darken(color: RgbColor, diff: number): RgbColor;
        function rgbString(color: RgbColor): string;
        function hexString(color: RgbColor): string;
        /**
         * Overlays a color with opacity over a background color
         * @param {string} foreColor Color to overlay
         * @param {number} opacity number between 0 (transparent) to 1 (opaque)
         * @param {string} backColor Background color
         * @returns Result color
         */
        function hexBlend(foreColor: string, opacity: number, backColor: string): string;
        /**
         * Overlays a color with opacity over a background color. Any alpha-channel is ignored.
         * @param {RgbColor} foreColor Color to overlay
         * @param {number} opacity number between 0 (transparent) to 1 (opaque). Any value out of range will be corrected.
         * @param {RgbColor} backColor Background color
         * @returns
         */
        function rgbBlend(foreColor: RgbColor, opacity: number, backColor: RgbColor): RgbColor;
        /**
         * Blend a single channel for two colors
         * @param {number} foreChannel Channel of foreground color. Will be enforced to be between 0 and 255.
         * @param {number} opacity opacity of the foreground color. Will be enforced to be between 0 and 1.
         * @param {number} backChannel channel of the background color. Will be enforced to be between 0 and 255.
         * @returns result channel value
         */
        function channelBlend(foreChannel: number, opacity: number, backChannel: number): number;
        /**
         * Calculate the highlight color from the rgbColor based on the lumianceThreshold and delta.
         * @param {RgbColor} rgbColor The original color.
         * @param {number} lumianceThreshold The lumiance threshold used, the highlight color will be brighter when the lumiance is smaller the threshold, otherwise the highlight color will be darker. Will be enforced to be between 0 and 1.
         * @param {number} delta the highlight color will be calculated based on the delta. Will be enforced to be between 0 and 1. lumianceThreshold + delta cannot greater than 1.
         * @returns result highlight color value
         */
        function calculateHighlightColor(rgbColor: RgbColor, lumianceThreshold: number, delta: number): string;
        interface RgbColor {
            R: number;
            G: number;
            B: number;
            A?: number;
        }
    }
}

declare module jsCommon {
    /**
     * CSS constants.
     */
    module CssConstants {
        interface ClassAndSelector {
            class: string;
            selector: string;
        }
        function createClassAndSelector(className: string): ClassAndSelector;
        const styleAttribute: string;
        const pixelUnits: string;
        const heightProperty: string;
        const widthProperty: string;
        const topProperty: string;
        const bottomProperty: string;
        const leftProperty: string;
        const rightProperty: string;
        const marginTopProperty: string;
        const marginLeftProperty: string;
        const displayProperty: string;
        const backgroundProperty: string;
        const backgroundColorProperty: string;
        const backgroundRepeatProperty: string;
        const backgroundSizeProperty: string;
        const backgroundImageProperty: string;
        const textShadowProperty: string;
        const textAlignProperty: string;
        const borderTopWidthProperty: string;
        const borderBottomWidthProperty: string;
        const borderLeftWidthProperty: string;
        const borderRightWidthProperty: string;
        const fontSizeProperty: string;
        const fontWeightProperty: string;
        const colorProperty: string;
        const opacityProperty: string;
        const paddingLeftProperty: string;
        const paddingRightProperty: string;
        const positionProperty: string;
        const maxWidthProperty: string;
        const minWidthProperty: string;
        const overflowProperty: string;
        const overflowXProperty: string;
        const overflowYProperty: string;
        const transformProperty: string;
        const webkitTransformProperty: string;
        const cursorProperty: string;
        const visibilityProperty: string;
        const absoluteValue: string;
        const zeroPixelValue: string;
        const autoValue: string;
        const hiddenValue: string;
        const noneValue: string;
        const blockValue: string;
        const inlineBlockValue: string;
        const transparentValue: string;
        const boldValue: string;
        const visibleValue: string;
        const tableRowValue: string;
        const coverValue: string;
        const pointerValue: string;
        const scrollValue: string;
    }
    interface ExtendedCSSProperties extends CSSStyleDeclaration {
        scrollbarShadowColor: string;
        scrollbarHighlightColor: string;
        layoutGridChar: string;
        layoutGridType: string;
        textAutospace: string;
        textKashidaSpace: string;
        writingMode: string;
        scrollbarFaceColor: string;
        backgroundPositionY: string;
        lineBreak: string;
        imeMode: string;
        msBlockProgression: string;
        layoutGridLine: string;
        scrollbarBaseColor: string;
        layoutGrid: string;
        layoutFlow: string;
        textKashida: string;
        filter: string;
        zoom: string;
        scrollbarArrowColor: string;
        behavior: string;
        backgroundPositionX: string;
        accelerator: string;
        layoutGridMode: string;
        textJustifyTrim: string;
        scrollbar3dLightColor: string;
        msInterpolationMode: string;
        scrollbarTrackColor: string;
        scrollbarDarkShadowColor: string;
        styleFloat: string;
        getAttribute(attributeName: string, flags?: number): any;
        setAttribute(attributeName: string, AttributeValue: any, flags?: number): void;
        removeAttribute(attributeName: string, flags?: number): boolean;
        pixelWidth: number;
        posHeight: number;
        posLeft: number;
        pixelTop: number;
        pixelBottom: number;
        textDecorationNone: boolean;
        pixelLeft: number;
        posTop: number;
        posBottom: number;
        textDecorationOverline: boolean;
        posWidth: number;
        textDecorationLineThrough: boolean;
        pixelHeight: number;
        textDecorationBlink: boolean;
        posRight: number;
        pixelRight: number;
        textDecorationUnderline: boolean;
        webkitTransform: string;
    }
}
declare module jsCommon {
    /**
     * Represents a promise that may be rejected by its consumer.
     */
    interface IRejectablePromise extends JQueryPromise<void> {
        reject(...args: any[]): void;
    }
    module JQueryConstants {
        const VisibleSelector: string;
    }
}

declare module powerbi {
    interface ScriptErrorInfo {
        message: string;
        sourceUrl: string;
        lineNumber: number;
        columnNumber: number;
        stack: string;
    }
    interface ErrorInfoKeyValuePair {
        errorInfoKey: string;
        errorInfoValue: string;
    }
    const enum ErrorType {
        VisualNotSupported = 1,
    }
    interface ErrorDetails {
        message: string;
        displayableErrorInfo: ErrorInfoKeyValuePair[];
        /**
         * This is a collection of unlocalized properties that could be used for error reporting.
         * These should not be displayed to the user.
         */
        debugErrorInfo?: ErrorInfoKeyValuePair[];
        helpLink?: string;
        errorType?: ErrorType;
    }
}

declare module powerbi.visuals {
    module shapes {
        interface IPolygon {
            absoluteCentroid: IPoint;
            polygonPoints: IPoint[];
        }
        interface IPoint {
            x: number;
            y: number;
        }
        interface ISize {
            width: number;
            height: number;
        }
        interface IVector {
            x: number;
            y: number;
        }
        interface IThickness {
            top: number;
            left: number;
            right: number;
            bottom: number;
        }
    }
}

declare module jsCommon {
    module Formatting {
        /**
         * Translate .NET format into something supported by jQuery.Globalize.
         */
        function findDateFormat(value: Date, format: string, cultureName: string): {
            value: Date;
            format: string;
        };
        /**
         * Translates unsupported .NET custom format expressions to the custom expressions supported by JQuery.Globalize.
         */
        function fixDateTimeFormat(format: string): string;
    }
}

declare module jsCommon {
    /**
     * Public API.
     */
    interface IJavaScriptDependency {
        javascriptFile: string;
        onLoadCallback?: () => JQueryPromise<void>;
    }
    interface IDependency {
        javaScriptFiles?: string[];
        cssFiles?: string[];
        javaScriptFilesWithCallback?: IJavaScriptDependency[];
    }
    function requires(dependency: IDependency, to?: () => void): void;
}

declare module powerbi {
    function createJQueryPromiseFactory(): IPromiseFactory;
}

declare module powerbi {
    interface IStorageService {
        getData(key: string): any;
        setData(key: string, data: any): void;
    }
    class EphemeralStorageService implements IStorageService {
        private cache;
        private clearCacheTimerId;
        private clearCacheInterval;
        static defaultClearCacheInterval: number;
        constructor(clearCacheInterval?: number);
        getData(key: string): any;
        setData(key: string, data: any): void;
        private clearCache();
    }
    var localStorageService: IStorageService;
    const ephemeralStorageService: IStorageService;
}

declare module jsCommon {
    module WordBreaker {
        import TextProperties = powerbi.TextProperties;
        import ITextAsSVGMeasurer = powerbi.ITextAsSVGMeasurer;
        import ITextTruncator = powerbi.ITextTruncator;
        interface WordBreakerResult {
            start: number;
            end: number;
        }
        /**
         * Find the word nearest the cursor specified within content
         * @param index - point within content to search forward/backward from
         * @param content - string to search
        */
        function find(index: number, content: string): WordBreakerResult;
        /**
         * Test for presence of breakers within content
         * @param content - string to test
        */
        function hasBreakers(content: string): boolean;
        /**
         * Count the number of pieces when broken by BREAKERS_REGEX
         * ~2.7x faster than WordBreaker.split(content).length
         * @param content - string to break and count
        */
        function wordCount(content: string): number;
        function getMaxWordWidth(content: string, textWidthMeasurer: ITextAsSVGMeasurer, properties: TextProperties): number;
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
        function splitByWidth(content: string, properties: TextProperties, textWidthMeasurer: ITextAsSVGMeasurer, maxWidth: number, maxNumLines: number, truncator?: ITextTruncator): string[];
    }
}

declare module powerbi {
    interface ITextMeasurer {
        (textElement: SVGTextElement): number;
    }
    interface ITextAsSVGMeasurer {
        (textProperties: TextProperties): number;
    }
    interface ITextTruncator {
        (properties: TextProperties, maxWidth: number): string;
    }
    interface TextProperties {
        text?: string;
        fontFamily: string;
        fontSize: string;
        fontWeight?: string;
        fontStyle?: string;
        fontVariant?: string;
        whiteSpace?: string;
    }
    module TextMeasurementService {
        /**
         * Removes spanElement from DOM.
         */
        function removeSpanElement(): void;
        /**
         * This method measures the width of the text with the given SVG text properties.
         * @param textProperties The text properties to use for text measurement.
         * @param text The text to measure.
         */
        function measureSvgTextWidth(textProperties: TextProperties, text?: string): number;
        /**
         * This method return the rect with the given SVG text properties.
         * @param textProperties The text properties to use for text measurement.
         * @param text The text to measure.
         */
        function measureSvgTextRect(textProperties: TextProperties, text?: string): SVGRect;
        /**
         * This method measures the height of the text with the given SVG text properties.
         * @param textProperties The text properties to use for text measurement.
         * @param text The text to measure.
         */
        function measureSvgTextHeight(textProperties: TextProperties, text?: string): number;
        /**
         * This method returns the text Rect with the given SVG text properties.
         * @param {TextProperties} textProperties - The text properties to use for text measurement
         */
        function estimateSvgTextBaselineDelta(textProperties: TextProperties): number;
        /**
         * This method estimates the height of the text with the given SVG text properties.
         * @param {TextProperties} textProperties - The text properties to use for text measurement
         */
        function estimateSvgTextHeight(textProperties: TextProperties, tightFightForNumeric?: boolean): number;
        /**
         * This method measures the width of the svgElement.
         * @param svgElement The SVGTextElement to be measured.
         */
        function measureSvgTextElementWidth(svgElement: SVGTextElement): number;
        /**
         * This method fetches the text measurement properties of the given DOM element.
         * @param element The selector for the DOM Element.
         */
        function getMeasurementProperties(element: JQuery): TextProperties;
        /**
         * This method fetches the text measurement properties of the given SVG text element.
         * @param svgElement The SVGTextElement to be measured.
         */
        function getSvgMeasurementProperties(svgElement: SVGTextElement): TextProperties;
        /**
         * This method returns the width of a div element.
         * @param element The div element.
         */
        function getDivElementWidth(element: JQuery): string;
        /**
         * Compares labels text size to the available size and renders ellipses when the available size is smaller.
         * @param textProperties The text properties (including text content) to use for text measurement.
         * @param maxWidth The maximum width available for rendering the text.
         */
        function getTailoredTextOrDefault(textProperties: TextProperties, maxWidth: number): string;
        /**
         * Compares labels text size to the available size and renders ellipses when the available size is smaller.
         * @param textElement The SVGTextElement containing the text to render.
         * @param maxWidth The maximum width available for rendering the text.
         */
        function svgEllipsis(textElement: SVGTextElement, maxWidth: number): void;
        /**
         * Word break textContent of <text> SVG element into <tspan>s
         * Each tspan will be the height of a single line of text
         * @param textElement - the SVGTextElement containing the text to wrap
         * @param maxWidth - the maximum width available
         * @param maxHeight - the maximum height available (defaults to single line)
         * @param linePadding - (optional) padding to add to line height
         */
        function wordBreak(textElement: SVGTextElement, maxWidth: number, maxHeight: number, linePadding?: number): void;
        /**
         * Word break textContent of span element into <span>s
         * Each span will be the height of a single line of text
         * @param textElement - the element containing the text to wrap
         * @param maxWidth - the maximum width available
         * @param maxHeight - the maximum height available (defaults to single line)
         * @param linePadding - (optional) padding to add to line height
         */
        function wordBreakOverflowingText(textElement: any, maxWidth: number, maxHeight: number, linePadding?: number): void;
    }
}

declare module jsCommon {
    module KeyUtils {
        function isArrowKey(keyCode: number): boolean;
        function isCtrlDefaultKey(keyCode: number): boolean;
        function isNudgeModifierKey(keyCode: number): boolean;
    }
}

declare module jsCommon {
    /**
     * Responsible for throttling input function.
     */
    class ThrottleUtility {
        private fn;
        private timerFactory;
        private delay;
        constructor(delay?: number);
        run(fn: () => void): void;
        /**
         * Note: Public for testing purpose.
         */
        timerComplete(fn: () => void): void;
    }
}

declare module jsCommon {
    interface ITimerPromiseFactory {
        /**
         * Creates a promise that will be resolved after the specified delayInMs.
         * @return Promise.
         */
        create(delayInMs: number): IRejectablePromise;
    }
    /**
     * Responsible for creating timer promises.
     */
    class TimerPromiseFactory implements ITimerPromiseFactory {
        static instance: TimerPromiseFactory;
        /**
         * {@inheritDoc}
         */
        create(delayInMs: number): IRejectablePromise;
    }
}

declare module jsCommon {
    module UrlUtils {
        function isValidUrl(value: string): boolean;
        function isValidImageUrl(url: string): boolean;
        function findAllValidUrls(text: string): TextMatch[];
        function getBase64ContentFromDataUri(uri: string): string;
    }
}

declare module jsCommon {
    module BrowserUtils {
        function isChrome(): boolean;
        function isInternetExplorerOrEdge(): boolean;
        /**
         * Get the current version of IE
         * @returns The version of Internet Explorer or a 0 (indicating the use of another browser).
         */
        function getInternetExplorerVersion(): number;
        function isFirefox(): boolean;
    }
}

declare module powerbi.visuals.utility {
    import IThickness = powerbi.visuals.shapes.IThickness;
    module StyleUtils {
        function getRotateAngleFromElement(element: JQuery): number;
        function getTranslateTransformFromElement(element: JQuery): IPoint;
        function getPadding(element: JQuery): IThickness;
    }
}

declare module jsCommon {
    interface ITraceListener {
        logTrace(trace: TraceItem): void;
    }
    class ConsoleTracer implements ITraceListener {
        logTrace(trace: TraceItem): void;
    }
    module Trace {
        /**
         * Trace a warning. Please ensure that no PII is being logged.
         */
        function warning(text: string, requestId?: string): void;
        /**
         * Trace an error. Please ensure that no PII is being logged.
         */
        function error(text: string, includeStackTrace?: boolean, requestId?: string): void;
        /**
         * Trace an information. Please ensure that no PII is being logged.
         */
        function verbose(text: string, requestId?: string): void;
        function addListener(listener: ITraceListener): void;
        function removeListener(listener: ITraceListener): void;
        function resetListeners(): void;
        function reset(): void;
        function getTraces(): Array<TraceItem>;
        /**
         * Note: Used for unit-test only.
         */
        function disableDefaultListener(): void;
        function enableDefaultListener(): void;
    }
}

declare module jsCommon {
    /**
     * The types of possible traces within the system, this aligns to the traces available in Cloud Platform.
     */
    enum TraceType {
        Information = 0,
        Verbose = 1,
        Warning = 2,
        Error = 3,
        ExpectedError = 4,
        UnexpectedError = 5,
        Fatal = 6,
    }
}

declare module jsCommon {
    function ensurePowerView(action?: () => void): void;
    function ensureMap(locale: string, action: () => void): void;
    function mapControlLoaded(): void;
    function waitForMapControlLoaded(): JQueryPromise<void>;
}
declare let globalMapControlLoaded: Function;

declare module InJs {
    /**
     * The types of possible traces within the system, this aligns to the traces available in Cloud Platform.
     */
    enum TraceType {
        information = 0,
        verbose = 1,
        warning = 2,
        error = 3,
        expectedError = 4,
        unexpectedError = 5,
        fatal = 6,
    }
}




















































declare module powerbi {
    enum VisualDataRoleKind {
        /** Indicates that the role should be bound to something that evaluates to a grouping of values. */
        Grouping = 0,
        /** Indicates that the role should be bound to something that evaluates to a single value in a scope. */
        Measure = 1,
        /** Indicates that the role can be bound to either Grouping or Measure. */
        GroupingOrMeasure = 2,
    }
    enum VisualDataChangeOperationKind {
        Create = 0,
        Append = 1,
    }
    enum VisualUpdateType {
        Data = 2,
        Resize = 4,
        ViewMode = 8,
        Style = 16,
        ResizeEnd = 32,
        All = 62,
    }
    enum VisualPermissions {
    }
    const enum CartesianRoleKind {
        X = 0,
        Y = 1,
    }
    const enum ViewMode {
        View = 0,
        Edit = 1,
    }
    const enum ResizeMode {
        Resizing = 1,
        Resized = 2,
    }
    module visuals.telemetry {
        const enum TelemetryCategory {
            Verbose = 0,
            CustomerAction = 1,
            CriticalError = 2,
            Trace = 3,
        }
        enum ErrorSource {
            PowerBI = 0,
            External = 1,
            User = 2,
        }
    }
    const enum JoinPredicateBehavior {
        /** Prevent items in this role from acting as join predicates. */
        None = 0,
    }
    const enum PromiseResultType {
        Success = 0,
        Failure = 1,
    }
    /**
     * Defines actions to be taken by the visual in response to a selection.
     *
     * An undefined/null VisualInteractivityAction should be treated as Selection,
     * as that is the default action.
     */
    const enum VisualInteractivityAction {
        /** Normal selection behavior which should call onSelect */
        Selection = 0,
        /** No additional action or feedback from the visual is needed */
        None = 1,
    }
}
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



declare module powerbi {
    export interface DragPayload {
    }
}﻿/*
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



declare module jsCommon {
    export interface IStringResourceProvider {
        get(id: string): string;
        getOptional(id: string): string;
    }
}﻿/*
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



declare module powerbi {
    /** 
     * An interface to promise/deferred, 
     * which abstracts away the underlying mechanism (e.g., Angular, jQuery, etc.). 
     */
    export interface IPromiseFactory {
        /** 
         * Creates a Deferred object which represents a task which will finish in the future.
         */
        defer<T>(): IDeferred<T>;

        /** 
         * Creates a Deferred object which represents a task which will finish in the future.
         */
        defer<TSuccess, TError>(): IDeferred2<TSuccess, TError>;

        /**
         * Creates a promise that is resolved as rejected with the specified reason.
         * This api should be used to forward rejection in a chain of promises.
         * If you are dealing with the last promise in a promise chain, you don't need to worry about it.
         * When comparing deferreds/promises to the familiar behavior of try/catch/throw,
         * think of reject as the throw keyword in JavaScript.
         * This also means that if you "catch" an error via a promise error callback and you want 
         * to forward the error to the promise derived from the current promise, 
         * you have to "rethrow" the error by returning a rejection constructed via reject.
         * 
         * @param reason Constant, message, exception or an object representing the rejection reason.
         */
        reject<TError>(reason?: TError): IPromise2<any, TError>;

        /**
         * Creates a promise that is resolved with the specified value.
         * This api should be used to forward rejection in a chain of promises. 
         * If you are dealing with the last promise in a promise chain, you don't need to worry about it.
         *
         * @param value Object representing the promise result.
         */
        resolve<TSuccess>(value?: TSuccess): IPromise2<TSuccess, any>;

        /**
         * Combines multiple promises into a single promise that is resolved when all of the input promises are resolved.
         * Rejects immediately if any of the promises fail
         */
        all(promises: IPromise2<any, any>[]): IPromise<any[]>;
        
        /**
         * Combines multiple promises into a single promise that is resolved when all of the input promises are resolved.
         * Does not resolve until all promises finish (success or failure).
         */
        allSettled<T>(promises: IPromise2<any, any>[]): IPromise<IPromiseResult<T>[]>;        

        /**
         * Wraps an object that might be a value or a then-able promise into a promise. 
         * This is useful when you are dealing with an object that might or might not be a promise
         */
        when<T>(value: T | IPromise<T>): IPromise<T>;
    }

    /** 
     * Represents an operation, to be completed (resolve/rejected) in the future.
     */
    export interface IPromise<T> extends IPromise2<T, T> {
    }

    /**
     * Represents an operation, to be completed (resolve/rejected) in the future.
     * Success and failure types can be set independently.
     */
    export interface IPromise2<TSuccess, TError> {
        /**
         * Regardless of when the promise was or will be resolved or rejected, 
         * then calls one of the success or error callbacks asynchronously as soon as the result is available.
         * The callbacks are called with a single argument: the result or rejection reason.
         * Additionally, the notify callback may be called zero or more times to provide a progress indication, 
         * before the promise is resolved or rejected.
         * This method returns a new promise which is resolved or rejected via 
         * the return value of the successCallback, errorCallback.
         */
        then<TSuccessResult, TErrorResult>(successCallback: (promiseValue: TSuccess) => IPromise2<TSuccessResult, TErrorResult>, errorCallback?: (reason: TError) => TErrorResult): IPromise2<TSuccessResult, TErrorResult>;

        /**
         * Regardless of when the promise was or will be resolved or rejected,
         * then calls one of the success or error callbacks asynchronously as soon as the result is available.
         * The callbacks are called with a single argument: the result or rejection reason.
         * Additionally, the notify callback may be called zero or more times to provide a progress indication,
         * before the promise is resolved or rejected.
         * This method returns a new promise which is resolved or rejected via 
         * the return value of the successCallback, errorCallback.
         */
        then<TSuccessResult, TErrorResult>(successCallback: (promiseValue: TSuccess) => TSuccessResult, errorCallback?: (reason: TError) => TErrorResult): IPromise2<TSuccessResult, TErrorResult>;

        /**
         * Shorthand for promise.then(null, errorCallback).
         */
        catch<TErrorResult>(onRejected: (reason: any) => IPromise2<TSuccess, TErrorResult>): IPromise2<TSuccess, TErrorResult>;

        /**
         * Shorthand for promise.then(null, errorCallback).
         */
        catch<TErrorResult>(onRejected: (reason: any) => TErrorResult): IPromise2<TSuccess, TErrorResult>;

        /**
         * Allows you to observe either the fulfillment or rejection of a promise, 
         * but to do so without modifying the final value.
         * This is useful to release resources or do some clean-up that needs to be done 
         * whether the promise was rejected or resolved.
         * See the full specification for more information.
         * Because finally is a reserved word in JavaScript and reserved keywords 
         * are not supported as property names by ES3, you'll need to invoke 
         * the method like promise['finally'](callback) to make your code IE8 and Android 2.x compatible.
         */
        finally<T, U>(finallyCallback: () => any): IPromise2<T, U>;
    }

    export interface IDeferred<T> extends IDeferred2<T, T> {
    }

    export interface IDeferred2<TSuccess, TError> {
        resolve(value: TSuccess): void;
        reject(reason?: TError): void;
        promise: IPromise2<TSuccess, TError>;
    }

    export interface RejectablePromise2<T, E> extends IPromise2<T, E> {
        reject(reason?: E): void;
        resolved(): boolean;
        rejected(): boolean;
        pending(): boolean;
    }

    export interface RejectablePromise<T> extends RejectablePromise2<T, T> {
    }

    export interface IResultCallback<T> {
        (result: T, done: boolean): void;
    }
    
    export interface IPromiseResult<T> {
        type: PromiseResultType;
        value: T;
    }
}﻿/*
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



declare module powerbi.visuals {
    export interface IRect {
        left: number;
        top: number;
        width: number;
        height: number;
    }
}/*
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



declare module powerbi.visuals {
    import Selector = data.Selector;

    export interface ISelectionIdBuilder {
        withCategory(categoryColumn: DataViewCategoryColumn, index: number): this;
        withSeries(seriesColumn: DataViewValueColumns, valueColumn: DataViewValueColumn | DataViewValueColumnGroup): this;
        withMeasure(measureId: string): this;
        createSelectionId(): ISelectionId;
    }
    
    export interface ISelectionId {
        equals(other: ISelectionId): boolean;
        includes(other: ISelectionId, ignoreHighlight?: boolean): boolean;
        getKey(): string;
        getSelector(): Selector;
        getSelectorsByColumn(): Selector;
        hasIdentity(): boolean;
    }
}/*
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



declare module powerbi.visuals {
    export interface IPoint {
        x: number;
        y: number;
    }
}/*
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

// TODO(aafische, 2016.05.16) all methods here are copy-pasted from .\src\Clients\JsCommon\obj\utility.d.ts
// Eventually, the powerbi.visuals namespace will be merged back into the powerbi namespace, at which point 
// this here file will be obsolete and deleted.



declare module powerbi.visuals.telemetry {
    
    interface ITelemetryService {
        /** Log Telemetry event */
        logEvent(eventFactory: ITelemetryEventFactory): ITelemetryEvent;
        logEvent<T>(eventFactory: ITelemetryEventFactory1<T>, arg: T): ITelemetryEvent;
        logEvent<T1, T2>(eventFactory: ITelemetryEventFactory2<T1, T2>, arg1: T1, arg2: T2): ITelemetryEvent;
        logEvent<T1, T2, T3>(eventFactory: ITelemetryEventFactory3<T1, T2, T3>, arg1: T1, arg2: T2, arg3: T3): ITelemetryEvent;
        logEvent<T1, T2, T3, T4>(eventFactory: ITelemetryEventFactory4<T1, T2, T3, T4>, arg1: T1, arg2: T2, arg3: T3, arg4: T4): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5>(eventFactory: ITelemetryEventFactory5<T1, T2, T3, T4, T5>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5, T6>(eventFactory: ITelemetryEventFactory6<T1, T2, T3, T4, T5, T6>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5, T6, T7>(eventFactory: ITelemetryEventFactory7<T1, T2, T3, T4, T5, T6, T7>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5, T6, T7, T8>(eventFactory: ITelemetryEventFactory8<T1, T2, T3, T4, T5, T6, T7, T8>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5, T6, T7, T8, T9>(eventFactory: ITelemetryEventFactory9<T1, T2, T3, T4, T5, T6, T7, T8, T9>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(eventFactory: ITelemetryEventFactory10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9, arg10: T10): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(eventFactory: ITelemetryEventFactory11<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9, arg10: T10, arg11: T11): ITelemetryEvent;        

        /** Starts recording a timed event **/
        startEvent(eventFactory: ITelemetryEventFactory): IDeferredTelemetryEvent;
        startEvent<T>(eventFactory: ITelemetryEventFactory1<T>, arg: T): IDeferredTelemetryEvent;
        startEvent<T1, T2>(eventFactory: ITelemetryEventFactory2<T1, T2>, arg1: T1, arg2, T2): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3>(eventFactory: ITelemetryEventFactory3<T1, T2, T3>, arg1: T1, arg2: T2, arg3: T3): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4>(eventFactory: ITelemetryEventFactory4<T1, T2, T3, T4>, arg1: T1, arg2: T2, arg3: T3, arg4: T4): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4, T5>(eventFactory: ITelemetryEventFactory5<T1, T2, T3, T4, T5>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4, T5, T6>(eventFactory: ITelemetryEventFactory6<T1, T2, T3, T4, T5, T6>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4, T5, T6, T7>(eventFactory: ITelemetryEventFactory7<T1, T2, T3, T4, T5, T6, T7>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4, T5, T6, T7, T8>(eventFactory: ITelemetryEventFactory8<T1, T2, T3, T4, T5, T6, T7, T8>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4, T5, T6, T7, T8, T9>(eventFactory: ITelemetryEventFactory9<T1, T2, T3, T4, T5, T6, T7, T8, T9>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9): IDeferredTelemetryEvent;
     }
    
    interface ITelemetryEvent {
        name: string;
        category?: TelemetryCategory;
        id: string;
        loggers?: number;
        time: number;
        getFormattedInfoObject(): any;
        info: any;
        privateFields: string[];
        orgInfoFields: string[];
    }

    interface ITelemetryEventFactory {
        (parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory1<T> {
        (arg: T, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory2<T1, T2> {
        (arg1: T1, arg2: T2, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory3<T1, T2, T3> {
        (arg1: T1, arg2: T2, arg3: T3, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory4<T1, T2, T3, T4> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory5<T1, T2, T3, T4, T5> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory6<T1, T2, T3, T4, T5, T6> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory7<T1, T2, T3, T4, T5, T6, T7> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory8<T1, T2, T3, T4, T5, T6, T7, T8> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory9<T1, T2, T3, T4, T5, T6, T7, T8, T9> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9, arg10: T10, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory11<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9, arg10: T10, arg11: T11, parentId: string): ITelemetryEvent;
    }
    
    interface IBaseEvent {
        parentId: string;
        isError: boolean;
        errorSource: ErrorSource;
        errorCode: string;
    }
    
    interface ICustomerAction extends IBaseEvent {
    }
    
    /** Identifies a long-running telemetry event. */
    interface IDeferredTelemetryEvent {
        /** The event being recorded. */
        event: ITelemetryEvent;
        /** Marks the telemetry event as complete. */
        resolve(): any;
        /** Marks the telemetry event as failed. Can specify additional error details if we know the source of the error and/or the error code. */
        reject(errorDetails?: TelemetryErrorDetails): any;
    }
    interface IDeferredTelemetryEventArgs {
        /** Parent event started by the invoker and passed to the event handler */
        parentEvent: IDeferredTelemetryEvent;
    }
    interface TelemetryErrorDetails {
        errorSource?: telemetry.ErrorSource;
        errorCode: string;
    }    
}

declare module powerbi {
    interface ITelemetryService { }
}

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



declare module powerbi.visuals.telemetry {
    
    export interface ITelemetryEventI<T> extends ITelemetryEvent {
        info: T;
    }
    
    interface IErrorWithStackTraceAndSourceDetails extends IErrorWithStackTrace {
        source: string;
        lineNumber: number;
        columnNumber: number;
    }
        
    export interface IErrorWithStackTrace extends IError {
    	stack: string;
    }
    
    export interface IError {
    	message: string;
    }    
    
    export interface IPBIVisualException extends IErrorWithStackTraceAndSourceDetails {
    	visualType: string;
    	isCustom: boolean;
    	apiVersion: string;
    }

    export interface IPBIExtensibilityVisualApiUsage extends ICustomerAction {
    	name: string;
    	apiVersion: string;
    	custom: boolean;
    }    
}﻿/*
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



declare module powerbi.data {
    export interface CompiledDataViewMapping {
        metadata: CompiledDataViewMappingMetadata;
        categorical?: CompiledDataViewCategoricalMapping;
        table?: CompiledDataViewTableMapping;
        single?: CompiledDataViewSingleMapping;
        tree?: CompiledDataViewTreeMapping;
        matrix?: CompiledDataViewMatrixMapping;
        scriptResult?: CompiledDataViewScriptResultMapping;
        usage?: DataViewMappingUsage;
    }

    export interface CompiledDataViewMappingScriptDefinition {
        source: DataViewObjectPropertyIdentifier;
        provider: DataViewObjectPropertyIdentifier;
        imageFormat?: string;
        scriptInput?: ScriptInput;
    }

    export interface CompiledDataViewScriptResultMapping {
        dataInput: CompiledDataViewMapping;
        script: CompiledDataViewMappingScriptDefinition;
    }

    export interface CompiledDataViewMappingMetadata {
        columns: DataViewMetadataColumn[];

        /** The metadata repetition objects. */
        objects?: DataViewObjects;
    }

    export interface CompiledDataViewCategoricalMapping extends HasDataVolume, HasReductionAlgorithm {
        categories?: CompiledDataViewRoleMappingWithReduction | CompiledDataViewListRoleMappingWithReduction;
        values?: CompiledDataViewRoleMapping | CompiledDataViewGroupedRoleMapping | CompiledDataViewListRoleMapping;
        includeEmptyGroups?: boolean;
    }

    export interface CompiledDataViewGroupingRoleMapping {
        role: CompiledDataViewRole;
    }

    export interface CompiledDataViewSingleMapping {
        role: CompiledDataViewRole;
    }

    export interface CompiledDataViewTableMapping extends HasDataVolume {
        rows: CompiledDataViewRoleMappingWithReduction | CompiledDataViewListRoleMappingWithReduction;
    }

    export interface CompiledDataViewTreeMapping extends HasDataVolume {
        nodes?: CompiledDataViewRoleForMappingWithReduction;
        values?: CompiledDataViewRoleForMapping;
    }

    export interface CompiledDataViewMatrixMapping extends HasDataVolume {
        rows?: CompiledDataViewRoleForMappingWithReduction | CompiledDataViewListRoleMappingWithReduction;
        columns?: CompiledDataViewRoleForMappingWithReduction;
        values?: CompiledDataViewRoleForMapping | CompiledDataViewListRoleMapping;
    }

    export type CompiledDataViewRoleMapping = CompiledDataViewRoleBindMapping | CompiledDataViewRoleForMapping;

    export interface CompiledDataViewRoleBindMapping {
        bind: {
            to: CompiledDataViewRole;
        };
    }

    export interface CompiledDataViewRoleForMapping {
        for: {
            in: CompiledDataViewRole;
        };
    }

    export type CompiledDataViewRoleMappingWithReduction = CompiledDataViewRoleBindMappingWithReduction | CompiledDataViewRoleForMappingWithReduction;

    export interface CompiledDataViewRoleBindMappingWithReduction extends CompiledDataViewRoleBindMapping, HasReductionAlgorithm {
    }

    export interface CompiledDataViewRoleForMappingWithReduction extends CompiledDataViewRoleForMapping, HasReductionAlgorithm {
    }

    export interface CompiledDataViewGroupedRoleMapping {
        group: CompiledDataViewGroupedRoleGroupItemMapping;
    }

    export interface CompiledDataViewGroupedRoleGroupItemMapping extends HasReductionAlgorithm {
        by: CompiledDataViewRole;
        select: CompiledDataViewRoleMapping[];
    }

    export interface CompiledDataViewListRoleMapping {
        select: CompiledDataViewRoleMapping[];
    }

    export interface CompiledDataViewListRoleMappingWithReduction extends CompiledDataViewListRoleMapping, HasReductionAlgorithm {
    }

    export const enum CompiledSubtotalType {
        None = 0,
        Before = 1,
        After = 2
    }

    export interface CompiledDataViewRole {
        role: string;
        items: CompiledDataViewRoleItem[];
        subtotalType?: CompiledSubtotalType;
        showAll?: boolean;
        activeItems?: string[];
        aggregates?: DataViewMappingRoleProjectionAggregates;
    }

    export interface CompiledDataViewRoleItem {
        queryName: string;
        //changed to descriptor to not need to depend on ValueType class
        type?: ValueTypeDescriptor;
        joinPredicate?: JoinPredicateBehavior;

        // Indication from the compiler to the visual that the role item has a scalar key available
        hasScalarKey?: boolean;

        // Indication from the visual to the query generator that a scalar key should be added to the query
        // for this role item.  The property indicates where the key should be attached to the objects
        // collection in the resulting data view.
        scalarKeyMinProperty?: DataViewObjectPropertyIdentifier;
    }
}﻿/*
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



declare module powerbi {
    export const enum SortDirection {
        Ascending = 1,
        Descending = 2,
    }
}﻿/*
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



declare module powerbi {
    /** Represents views of a data set. */
    export interface DataView {
        metadata: DataViewMetadata;
        categorical?: DataViewCategorical;
        single?: DataViewSingle;
        tree?: DataViewTree;
        table?: DataViewTable;
        matrix?: DataViewMatrix;
        scriptResult?: DataViewScriptResultData;
    }

    export interface DataViewMetadata {
        columns: DataViewMetadataColumn[];

        /** The metadata repetition objects. */
        objects?: DataViewObjects;

        /** When defined, describes whether the DataView contains just a segment of the complete data set. */
        segment?: DataViewSegmentMetadata;
    }

    export interface DataViewMetadataColumn {
        /** The user-facing display name of the column. */
        displayName: string;

        /** The query name the source column in the query. */
        queryName?: string;

        /** The format string of the column. */
        format?: string; // TODO: Deprecate this, and populate format string through objects instead.

        /** Data type information for the column. */
        type?: ValueTypeDescriptor;

        /** Indicates that this column is a measure (aggregate) value. */
        isMeasure?: boolean;

        /** The position of the column in the select statement. */
        index?: number;

        /** The properties that this column provides to the visualization. */
        roles?: { [name: string]: boolean };

        /** The metadata repetition objects. */
        objects?: DataViewObjects;

        /** The name of the containing group. */
        groupName?: PrimitiveValue;

        /** The sort direction of this column. */
        sort?: SortDirection;

        /** The KPI metadata to use to convert a numeric status value into its visual representation. */
        kpi?: DataViewKpiColumnMetadata;

        /** Indicates that aggregates should not be computed across groups with different values of this column. */
        discourageAggregationAcrossGroups?: boolean;

        /** The aggregates computed for this column, if any. */
        aggregates?: DataViewColumnAggregates;

        /** The SQExpr this column represents. */
        expr?: data.ISQExpr;
    }

    export interface DataViewSegmentMetadata {
    }

    export interface DataViewColumnAggregates {
        subtotal?: PrimitiveValue;
        max?: PrimitiveValue;
        min?: PrimitiveValue;
        average?: PrimitiveValue;
        median?: PrimitiveValue;
        count?: number;
        percentiles?: DataViewColumnPercentileAggregate[];

        /** Client-computed maximum value for a column. */
        maxLocal?: PrimitiveValue;

        /** Client-computed maximum value for a column. */
        minLocal?: PrimitiveValue;
    }

    export interface DataViewColumnPercentileAggregate {
        exclusive?: boolean;
        k: number;
        value: PrimitiveValue;
    }

    export interface DataViewCategorical {
        categories?: DataViewCategoryColumn[];
        values?: DataViewValueColumns;
    }

    export interface DataViewCategoricalColumn {
        source: DataViewMetadataColumn;
        values: PrimitiveValue[];

        /** The data repetition objects. */
        objects?: DataViewObjects[];
    }

    export interface DataViewValueColumns extends Array<DataViewValueColumn> {
        /** Returns an array that groups the columns in this group together. */
        grouped(): DataViewValueColumnGroup[];

        /** The set of expressions that define the identity for instances of the value group.  This must match items in the DataViewScopeIdentity in the grouped items result. */
        identityFields?: data.ISQExpr[];

        source?: DataViewMetadataColumn;
    }

    export interface DataViewValueColumnGroup {
        values: DataViewValueColumn[];
        identity?: DataViewScopeIdentity;

        /** The data repetition objects. */
        objects?: DataViewObjects;

        name?: PrimitiveValue;
    }

    export interface DataViewValueColumn extends DataViewCategoricalColumn {
        highlights?: PrimitiveValue[];
        identity?: DataViewScopeIdentity;
    }

    // NOTE: The following is needed for backwards compatibility and should be deprecated.  Callers should use
    // DataViewMetadataColumn.aggregates instead.
    export interface DataViewValueColumn extends DataViewColumnAggregates {
    }

    export interface DataViewCategoryColumn extends DataViewCategoricalColumn {
        identity?: DataViewScopeIdentity[];

        /** The set of expressions that define the identity for instances of the category.  This must match items in the DataViewScopeIdentity in the identity. */
        identityFields?: data.ISQExpr[];
    }

    export interface DataViewSingle {
        value: PrimitiveValue;
    }

    export interface DataViewTree {
        root: DataViewTreeNode;
    }

    export interface DataViewTreeNode {
        name?: PrimitiveValue;

        /**
         * When used under the context of DataView.tree, this value is one of the elements in the values property.
         *
         * When used under the context of DataView.matrix, this property is the value of the particular 
         * group instance represented by this node (e.g. In a grouping on Year, a node can have value == 2016).
         *
         * DEPRECATED for usage under the context of DataView.matrix: This property is deprecated for objects 
         * that conform to the DataViewMatrixNode interface (which extends DataViewTreeNode).
         * New visuals code should consume the new property levelValues on DataViewMatrixNode instead.
         * If this node represents a composite group node in matrix, this property will be undefined.
         */
        value?: PrimitiveValue;
      
        /** 
         * This property contains all the values in this node. 
         * The key of each of the key-value-pair in this dictionary is the position of the column in the 
         * select statement to which the value belongs.
         */
        values?: { [id: number]: DataViewTreeNodeValue };

        children?: DataViewTreeNode[];
        identity?: DataViewScopeIdentity;

        /** The data repetition objects. */
        objects?: DataViewObjects;

        /** The set of expressions that define the identity for the child nodes.  This must match items in the DataViewScopeIdentity of those nodes. */
        childIdentityFields?: data.ISQExpr[];
    }

    export interface DataViewTreeNodeValue {
        value?: PrimitiveValue;
    }

    export interface DataViewTreeNodeMeasureValue extends DataViewTreeNodeValue, DataViewColumnAggregates {
        highlight?: PrimitiveValue;
    }

    export interface DataViewTreeNodeGroupValue extends DataViewTreeNodeValue {
        count?: PrimitiveValue;
    }

    export interface DataViewTable {
        columns: DataViewMetadataColumn[];

        identity?: DataViewScopeIdentity[];

        /** The set of expressions that define the identity for rows of the table.  This must match items in the DataViewScopeIdentity in the identity. */
        identityFields?: data.ISQExpr[];

        rows?: DataViewTableRow[];

        totals?: PrimitiveValue[];
    }

    export interface DataViewTableRow extends Array<PrimitiveValue> {
        /** The metadata repetition objects. */
        objects?: DataViewObjects[];
    }

    export interface DataViewMatrix {
        rows: DataViewHierarchy;
        columns: DataViewHierarchy;
        valueSources: DataViewMetadataColumn[];
    }

    export interface DataViewMatrixNode extends DataViewTreeNode {
        /** Indicates the level this node is on. Zero indicates the outermost children (root node level is undefined). */
        level?: number;

        children?: DataViewMatrixNode[];

         /* If this DataViewMatrixNode represents the  inner-most dimension of row groups (i.e. a leaf node), then this property will contain the values at the 
         * matrix intersection under the group. The valueSourceIndex property will contain the position of the column in the select statement to which the 
         * value belongs.
         *
         * When this DataViewMatrixNode is used under the context of DataView.matrix.columns, this property is not used.
         */
        values?: { [id: number]: DataViewMatrixNodeValue };         

        /**
         * Indicates the source metadata index on the node's level. Its value is 0 if omitted.
         *
         * DEPRECATED: This property is deprecated and exists for backward-compatibility only.
         * New visuals code should consume the new property levelSourceIndex on DataViewMatrixGroupValue instead.
         */
        levelSourceIndex?: number;

        /**
         * The values of the particular group instance represented by this node.
         * This array property would contain more than one element in a composite group
         * (e.g. Year == 2016 and Month == 'January').
         */
        levelValues?: DataViewMatrixGroupValue[];

        /** Indicates whether or not the node is a subtotal node. Its value is false if omitted. */
        isSubtotal?: boolean;
    }

    /**
     * Represents a value at a particular level of a matrix's rows or columns hierarchy.
     * In the hierarchy level node is an instance of a composite group, this object will
     * be one of multiple values
     */
    export interface DataViewMatrixGroupValue extends DataViewTreeNodeValue {
        /**
         * Indicates the index of the corresponding column for this group level value 
         * (held by DataViewHierarchyLevel.sources).
         *
         * @example
         * // For example, to get the source column metadata of each level value at a particular row hierarchy node:
         * let matrixRowsHierarchy: DataViewHierarchy = dataView.matrix.rows;
         * let targetRowsHierarchyNode = <DataViewMatrixNode>matrixRowsHierarchy.root.children[0];
         * // Use the DataViewMatrixNode.level property to get the corresponding DataViewHierarchyLevel...
         * let targetRowsHierarchyLevel: DataViewHierarchyLevel = matrixRows.levels[targetRowsHierarchyNode.level];
         * for (let levelValue in rowsRootNode.levelValues) {
         *   // columnMetadata is the source column for the particular levelValue.value in this loop iteration
         *   let columnMetadata: DataViewMetadataColumn = 
         *     targetRowsHierarchyLevel.sources[levelValue.levelSourceIndex];
         * }
         */
        levelSourceIndex: number;
    }

    /** Represents a value at the matrix intersection, used in the values property on DataViewMatrixNode (inherited from DataViewTreeNode). */
    export interface DataViewMatrixNodeValue extends DataViewTreeNodeValue {
        highlight?: PrimitiveValue;

        /** Indicates the index of the corresponding measure (held by DataViewMatrix.valueSources). Its value is 0 if omitted. */
        valueSourceIndex?: number;
    }

    export interface DataViewHierarchy {
        root: DataViewMatrixNode;
        levels: DataViewHierarchyLevel[];
    }

    export interface DataViewHierarchyLevel {
        sources: DataViewMetadataColumn[];
    }

    export interface DataViewKpiColumnMetadata {
        graphic: string;

        // When false, five state KPIs are in: { -2, -1, 0, 1, 2 }. 
        // When true, five state KPIs are in: { -1, -0.5, 0, 0.5, 1 }.
        normalizedFiveStateKpiRange?: boolean;
    }

    export interface DataViewScriptResultData {
        imageBase64: string;
    }
}﻿/*
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



declare module powerbi {
    export interface DataViewMapping {
        /**
         * Defines set of conditions, at least one of which must be satisfied for this mapping to be used.
         * Any roles not specified in the condition accept any number of items.
         */
        conditions?: DataViewMappingCondition[];
        requiredProperties?: DataViewObjectPropertyIdentifier[];

        categorical?: DataViewCategoricalMapping;
        table?: DataViewTableMapping;
        single?: DataViewSingleMapping;
        tree?: DataViewTreeMapping;
        matrix?: DataViewMatrixMapping;
        scriptResult?: DataViewScriptResultMapping;
        usage?: DataViewMappingUsage;
    }

    /** Describes whether a particular mapping is fits the set of projections. */
    export interface DataViewMappingCondition {
        [dataRole: string]: RoleCondition;
    }

    /** Describes a mapping which supports a data volume level. */
    export interface HasDataVolume {
        dataVolume?: number;
    }

    export interface DataViewCategoricalMapping extends HasDataVolume, HasReductionAlgorithm {
        categories?: DataViewRoleMappingWithReduction | DataViewListRoleMappingWithReduction;
        values?: DataViewRoleMapping | DataViewGroupedRoleMapping | DataViewListRoleMapping;

        /** Specifies a constraint on the number of data rows supported by the visual. */
        rowCount?: AcceptabilityNumberRange;

        /** Indicates whether the data rows include empty groups  */
        includeEmptyGroups?: boolean;
    }

    export interface DataViewSingleMapping {
        /** Indicates the role which is bound to this structure. */
        role: string;
    }

    export interface DataViewTableMapping extends HasDataVolume {
        rows: DataViewRoleMappingWithReduction | DataViewListRoleMappingWithReduction;

        /** Specifies a constraint on the number of data rows supported by the visual. */
        rowCount?: AcceptabilityNumberRange;
    }

    export interface DataViewTreeMapping extends HasDataVolume {
        nodes?: DataViewRoleForMappingWithReduction;
        values?: DataViewRoleForMapping;

        /** Specifies a constraint on the depth of the tree supported by the visual. */
	    depth?: AcceptabilityNumberRange;
    }

    export interface DataViewMatrixMapping extends HasDataVolume {
        rows?: DataViewRoleForMappingWithReduction | DataViewListRoleMappingWithReduction;
        columns?: DataViewRoleForMappingWithReduction;
        values?: DataViewRoleForMapping | DataViewListRoleMapping;
    }

    /* tslint:disable:no-unused-expression */
    export type DataViewRoleMapping = DataViewRoleBindMapping | DataViewRoleForMapping;

    /* tslint: enable */

    export interface DataViewRoleBindMapping {
        /**
         * Indicates evaluation of a single-valued data role.
         * Equivalent to for, without support for multiple items.
         */
        bind: {
            to: string;
            
            /** Requests aggregates for the visual.  When specified, only the aggregates are requested. */
            aggregates?: DataViewMappingRoleProjectionAggregates;
        };
    }

    export interface DataViewRoleForMapping {
        /** Indicates iteration of the in data role, as an array. */
        for: {
            in: string;
        };
    }

    export type DataViewRoleMappingWithReduction = DataViewRoleBindMappingWithReduction | DataViewRoleForMappingWithReduction;

    export interface DataViewRoleBindMappingWithReduction extends DataViewRoleBindMapping, HasReductionAlgorithm {
    }

    export interface DataViewRoleForMappingWithReduction extends DataViewRoleForMapping, HasReductionAlgorithm {
    }

    export interface DataViewGroupedRoleMapping {
        group: {
            by: string;
            select: DataViewRoleMapping[];
            dataReductionAlgorithm?: ReductionAlgorithm;
        };
    }

    export interface DataViewListRoleMapping {
        select: DataViewRoleMapping[];
    }

    export interface DataViewListRoleMappingWithReduction extends DataViewListRoleMapping, HasReductionAlgorithm {
    }

    export interface HasReductionAlgorithm {
        dataReductionAlgorithm?: ReductionAlgorithm;
    }

    /** Describes how to reduce the amount of data exposed to the visual. */
    export interface ReductionAlgorithm {
        top?: DataReductionTop;
        bottom?: DataReductionBottom;
        sample?: DataReductionSample;
        window?: DataReductionWindow;
    }

    /** Reduce the data to the Top(count) items. */
    export interface DataReductionTop {
        count?: number;
    }

    /** Reduce the data to the Bottom count items. */
    export interface DataReductionBottom {
        count?: number;
    }

    /** Reduce the data using a simple Sample of count items. */
    export interface DataReductionSample {
        count?: number;
    }

    /** Allow the data to be loaded one window, containing count items, at a time. */
    export interface DataReductionWindow {
        count?: number;
    }

    export interface AcceptabilityNumberRange {
        /** Specifies a preferred range of values for the constraint. */
        preferred?: NumberRange;

        /** Specifies a supported range of values for the constraint. Defaults to preferred if not specified. */
        supported?: NumberRange;
    }

    export interface ValueRange<T> {
        min?: T;
        max?: T;
    }

    /** Defines the acceptable values of a number. */
    export type NumberRange = ValueRange<number>;

    /** Defines the PrimitiveValue range. */
    export type PrimitiveValueRange = ValueRange<PrimitiveValue>;

    export interface DataViewMappingScriptDefinition {
        source: DataViewObjectPropertyIdentifier;
        provider: DataViewObjectPropertyIdentifier;
        imageFormat?: string;
    }

    export interface DataViewScriptResultMapping {
        dataInput: DataViewMapping;
        script: DataViewMappingScriptDefinition;
    }

    /** Defines how the mapping will be used. The set of objects in this interface can modify the usage. */
    export interface DataViewMappingUsage {
        regression?: {
            [propertyName: string]: DataViewObjectPropertyIdentifier;
        };
        forecast?: {};
    }

    export interface DataViewMappingRoleProjectionAggregates {
        min?: boolean;
        max?: boolean;
    }
}﻿/*
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



declare module powerbi {
    /** Represents evaluated, named, custom objects in a DataView. */
    export interface DataViewObjects {
        [name: string]: DataViewObject | DataViewObjectMap;
    }

    /** Represents an object (name-value pairs) in a DataView. */
    export interface DataViewObject {
        [propertyName: string]: DataViewPropertyValue;
    }

    export interface DataViewObjectWithId {
        id: string;
        object: DataViewObject;
    }

    export interface DataViewObjectPropertyIdentifier {
        objectName: string;
        propertyName: string;
    }

    export type DataViewObjectMap = DataViewObjectWithId[];

    export type DataViewPropertyValue = PrimitiveValue | StructuralObjectValue;
}﻿/*
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



declare module powerbi.data {
    export interface DataViewObjectDescriptors {
        /** Defines general properties for a visualization. */
        general?: DataViewObjectDescriptor;

        [objectName: string]: DataViewObjectDescriptor;
    }

    /** Defines a logical object in a visualization. */
    export interface DataViewObjectDescriptor {
        displayName?: DisplayNameGetter;
        description?: DisplayNameGetter;
        properties: DataViewObjectPropertyDescriptors;
    }

    export interface DataViewObjectPropertyDescriptors {
        [propertyName: string]: DataViewObjectPropertyDescriptor;
    }

    /** Defines a property of a DataViewObjectDefinition. */
    export interface DataViewObjectPropertyDescriptor {
        displayName?: DisplayNameGetter;
        description?: DisplayNameGetter;
        placeHolderText?: DisplayNameGetter;
        type: DataViewObjectPropertyTypeDescriptor;
        rule?: DataViewObjectPropertyRuleDescriptor;        

        /** Indicates whether the Format Painter should ignore this property. */
        suppressFormatPainterCopy?: boolean;   
    }

    export type DataViewObjectPropertyTypeDescriptor = ValueTypeDescriptor | StructuralTypeDescriptor;

    export interface DataViewObjectPropertyRuleDescriptor {
        /** For rule typed properties, defines the input visual role name. */
        inputRole?: string;

        /** Defines the output for rule-typed properties. */
        output?: DataViewObjectPropertyRuleOutputDescriptor;
    }

    export interface DataViewObjectPropertyRuleOutputDescriptor {
        /** Name of the target property for rule output. */
        property: string;

        /** Names roles that define the selector for the output properties. */
        selector: string[];
    }
    
}﻿/*
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



declare module powerbi.data {
    /** Defines a match against all instances of given roles. */
    export interface DataViewRoleWildcard {
        roles: string[];
        key: string;
    }
}﻿/*
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



declare module powerbi {
    /** Encapsulates the identity of a data scope in a DataView. */
    export interface DataViewScopeIdentity {
        /** Predicate expression that identifies the scope. */
        expr: data.ISQExpr;

        /** Key string that identifies the DataViewScopeIdentity to a string, which can be used for equality comparison. */
        key: string;
    }
}﻿/*
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



declare module powerbi.data {
    /** Defines a match against all instances of a given DataView scope. */
    export interface DataViewScopeWildcard {
        exprs: ISQExpr[];
        key: string;
    }
}﻿/*
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



declare module powerbi.data {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;

    export type DisplayNameGetter = ((resourceProvider: IStringResourceProvider) => string) | string;
}﻿/*
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



declare module powerbi.data {
    export interface ScriptInputColumn {
        /** The queryName of the corresponding Select from the associated SemanticQuery providing the data for this column. */ 
        QueryName: string; 

        /** The name of this column expected by the script. */
        Name: string;
    }

    export interface ScriptInput {
        VariableName?: string;
        Columns?: ScriptInputColumn[];
    }
}﻿/*
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



declare module powerbi.data {
    /** Defines a selector for content, including data-, metadata, and user-defined repetition. */
    export interface Selector {
        /** Data-bound repetition selection. */
        data?: DataRepetitionSelector[];
	
        /** Metadata-bound repetition selection.  Refers to a DataViewMetadataColumn queryName. */
        metadata?: string;

        /** User-defined repetition selection. */
        id?: string;
    }

    export type DataRepetitionSelector = DataViewScopeIdentity | DataViewScopeWildcard | DataViewRoleWildcard; 
}﻿/*
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



declare module powerbi.data {
    //intentionally blank interfaces since this is not part of the public API

    export interface ISemanticFilter { }

    export interface ISQExpr { }

    export interface ISQConstantExpr extends ISQExpr { }

}﻿/*
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



declare module powerbi {
    export interface IViewport {
        height: number;
        width: number;
    }
}﻿/*
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



declare module powerbi {
    import DisplayNameGetter = powerbi.data.DisplayNameGetter;

    /** Defines the data roles understood by the IVisual. */
    export interface VisualDataRole {
        /** Unique name for the VisualDataRole. */
        name: string;

        /** Indicates the kind of role.  This value is used to build user interfaces, such as a field well. */
        kind: VisualDataRoleKind;

        displayName?: DisplayNameGetter;

        /** The tooltip text */
        description?: DisplayNameGetter;

        /** Indicates the preferred ValueTypes to be used in this data role.  This is used by authoring tools when adding fields into the visual. */
        preferredTypes?: ValueTypeDescriptor[];

        /** Indicates the required ValueTypes for this data role. Any values which do not match one of the ValueTypes specified will be null'd out */
        requiredTypes?: ValueTypeDescriptor[];

        /** Indicates the cartesian role for the visual role */
        cartesianKind?: CartesianRoleKind;

        /** Indicates the join predicate behavior of items in this role. */
        joinPredicate?: JoinPredicateBehavior;
    }

    export interface RoleCondition extends NumberRange {
        kind?: VisualDataRoleKind;
    }
}﻿/*
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



declare module powerbi {   
    
    /**
     * Interface that provides scripted access to geographical location information associated with the hosting device
     * The Interface is similar to W3 Geolocation API Specification {@link https://dev.w3.org/geo/api/spec-source.html}
     */
    export interface IGeolocation {
        /**
         * Request repeated updates
         * 
         * @param successCallback invoked when current location successfully obtained
         * @param errorCallback invoked when attempt to obtain the current location fails
         * 
         * @return a number value that uniquely identifies a watch operation
         */
        watchPosition(successCallback: IPositionCallback, errorCallback?: IPositionErrorCallback): number;
        /**
         * Cancel the updates
         * 
         * @param watchId  a number returned from {@link IGeolocation#watchPosition}
         */
        clearWatch(watchId: number): void;
        /**
         * One-shot position request.
         * 
         * @param successCallback invoked when current location successfully obtained
         * @param errorCallback invoked when attempt to obtain the current location fails
         */
        getCurrentPosition(successCallback: IPositionCallback, errorCallback?: IPositionErrorCallback): void;
    }

    export interface IPositionCallback {
        (position: Position): void;
    }
    
    export interface IPositionErrorCallback {
        (error: PositionError): void;
    }
}﻿/*
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



declare module powerbi {
    export interface DefaultValueDefinition {
        value: data.ISQConstantExpr;
        identityFieldsValues?: data.ISQConstantExpr[];
    }

    export interface DefaultValueTypeDescriptor {
        defaultValue: boolean;
    }
}/*
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



declare module powerbi {
    import DisplayNameGetter = powerbi.data.DisplayNameGetter;

    export type EnumMemberValue = string | number;

    export interface IEnumMember {
        value: EnumMemberValue;
        displayName: DisplayNameGetter;
    }

    /** Defines a custom enumeration data type, and its values. */
    export interface IEnumType {
        /** Gets the members of the enumeration, limited to the validMembers, if appropriate. */
        members(validMembers?: EnumMemberValue[]): IEnumMember[];
    }
    
}﻿/*
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



declare module powerbi {
    export interface Fill {
        solid?: {
            color?: string;
        };
        gradient?: {
            startColor?: string;
            endColor?: string;
        };
        pattern?: {
            patternKind?: string;
            color?: string;
        };
    }

    export interface FillTypeDescriptor {
        solid?: {
            color?: FillSolidColorTypeDescriptor;
        };
        gradient?: {
            startColor?: boolean;
            endColor?: boolean;
        };
        pattern?: {
            patternKind?: boolean;
            color?: boolean;
        };
    }

    export type FillSolidColorTypeDescriptor = boolean | FillSolidColorAdvancedTypeDescriptor;

    export interface FillSolidColorAdvancedTypeDescriptor {
        /** Indicates whether the color value may be nullable, and a 'no fill' option is appropriate. */
        nullable: boolean;
    }  
}﻿/*
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



declare module powerbi {
    export interface FillRule extends FillRuleGeneric<string, number> {
    }

    export interface FillRuleTypeDescriptor {
    }

    export interface FillRuleGeneric<TColor, TValue> {
        linearGradient2?: LinearGradient2Generic<TColor, TValue>;
        linearGradient3?: LinearGradient3Generic<TColor, TValue>;

        // stepped2?
        // ...
    }

    export interface LinearGradient2Generic<TColor, TValue> {
        max: RuleColorStopGeneric<TColor, TValue>;
        min: RuleColorStopGeneric<TColor, TValue>;
    }

    export interface LinearGradient3Generic<TColor, TValue> {
        max: RuleColorStopGeneric<TColor, TValue>;
        mid: RuleColorStopGeneric<TColor, TValue>;
        min: RuleColorStopGeneric<TColor, TValue>;
    }

    export interface RuleColorStopGeneric<TColor, TValue> {
        color: TColor;
        value?: TValue;
    }
}﻿/*
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



declare module powerbi {
    export interface FilterTypeDescriptor {
        selfFilter?: boolean;
    }
}﻿/*
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



declare module powerbi {
    export type ImageValue = ImageDefinitionGeneric<string>;

    export interface ImageDefinitionGeneric<T> {
        name: T;
        url: T;
        scaling?: T;
    }

    export interface ImageTypeDescriptor { }

}﻿/*
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



declare module powerbi {
    export type Paragraphs = Paragraph[];
    export interface Paragraph {
        horizontalTextAlignment?: string;
        textRuns: TextRun[];
    }

    export interface ParagraphsTypeDescriptor {
    }

    export interface TextRunStyle {
        fontFamily?: string;
        fontSize?: string;
        fontStyle?: string;
        fontWeight?: string;
        textDecoration?: string;
    }

    export interface TextRun {
        textStyle?: TextRunStyle;
        url?: string;
        value: string;
    }
}﻿/*
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



declare module powerbi {
    import SemanticFilter = data.ISemanticFilter;

    /** Defines instances of structural types. */
    export type StructuralObjectValue =
        Fill |
        FillRule |
        SemanticFilter |
        DefaultValueDefinition |
        ImageValue |
        Paragraphs;
    
    /** Describes a structural type in the client type system. Leaf properties should use ValueType. */
    export interface StructuralTypeDescriptor {
        fill?: FillTypeDescriptor;
        fillRule?: FillRuleTypeDescriptor;
        filter?: FilterTypeDescriptor;
        expression?: DefaultValueTypeDescriptor;
        image?: ImageTypeDescriptor;
        paragraphs?: ParagraphsTypeDescriptor;

        //border?: BorderTypeDescriptor;
        //etc.
    }
}﻿/*
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



declare module powerbi {
    /** Describes a data value type in the client type system. Can be used to get a concrete ValueType instance. */
    export interface ValueTypeDescriptor {
        // Simplified primitive types
        text?: boolean;
        numeric?: boolean;
        integer?: boolean;
        bool?: boolean;
        dateTime?: boolean;
        duration?: boolean;
        binary?: boolean;
        none?: boolean; //TODO: 5005022 remove none type when we introduce property categories.

        // Extended types
        temporal?: TemporalTypeDescriptor;
        geography?: GeographyTypeDescriptor;
        misc?: MiscellaneousTypeDescriptor;
        formatting?: FormattingTypeDescriptor;
        enumeration?: IEnumType;
        scripting?: ScriptTypeDescriptor;
        operations?: OperationalTypeDescriptor;
    }

    export interface ScriptTypeDescriptor {
        source?: boolean;
    }

    export interface TemporalTypeDescriptor {
        year?: boolean;
        month?: boolean;
        paddedDateTableDate?: boolean;
    }

    export interface GeographyTypeDescriptor {
        address?: boolean;
        city?: boolean;
        continent?: boolean;
        country?: boolean;
        county?: boolean;
        region?: boolean;
        postalCode?: boolean;
        stateOrProvince?: boolean;
        place?: boolean;
        latitude?: boolean;
        longitude?: boolean;
    }

    export interface MiscellaneousTypeDescriptor {
        image?: boolean;
        imageUrl?: boolean;
        webUrl?: boolean;
        barcode?: boolean;
    }

    export interface FormattingTypeDescriptor {
        color?: boolean;
        formatString?: boolean;
        alignment?: boolean;
        labelDisplayUnits?: boolean;
        fontSize?: boolean;
        labelDensity?: boolean;
    }

    export interface OperationalTypeDescriptor {
        searchEnabled?: boolean;
    }

    /** Describes instances of value type objects. */
    export type PrimitiveValue = string | number | boolean | Date;
}﻿/*
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



declare module powerbi {
    export interface IVisualStyle{
        colorPalette: IColorPalette;
        isHighContrast: boolean;
        titleText: ITextStyle;
        subTitleText: ITextStyle;
        labelText: ITextStyle;
        // TODO 4486317: This is a host-specific property that should be exposed through DataViewObjects.
        maxMarginFactor?: number;
    }

    export interface ITextStyle extends IStyleInfo {
        fontFace?: string;
        fontSize?: string;
        fontWeight?: string;
        color: IColorInfo;
    }

    export interface IColorPalette {
        background?: IColorInfo;
        foreground?: IColorInfo;

        positive?: IColorInfo;
        neutral?: IColorInfo;
        negative?: IColorInfo;
        separator?: IColorInfo;
        selection?: IColorInfo;

        /** Color of outlines for Table/Matrix that surround Headers, Values, or Totals */
        tableAccent?: IColorInfo;

        dataColors: IDataColorPalette;
    }

    export interface IDataColorPalette {
        /** Gets the color scale associated with the given key. */
        getColorScaleByKey(scaleKey: string): IColorScale;

        /** Gets a fresh color scale with no colors allocated. */
        getNewColorScale(): IColorScale;

        /** Gets the nth color in the palette. */
        getColorByIndex(index: number): IColorInfo;

        /**
         * Gets the set of sentiment colors used for visuals such as KPIs
         * Note: This is only a temporary API so that we can have reasonable color schemes for KPIs
         * and gauges until the conditional formatting feature is implemented.
         */
        getSentimentColors(): IColorInfo[];

        getBasePickerColors(): IColorInfo[];

        /** Gets all the colors for the color palette **/
        getAllColors?(): IColorInfo[];
    }

    export interface IColorScale {
        /** Gets the color associated with the given key. */
        getColor(key: any): IColorInfo;

        /**
         * Clears the current scale, but rotates the colors such that the first color allocated will
         * the be first color that would have been allocated before clearing the scale. 
         */
        clearAndRotateScale(): void;

        /** Returns a copy of the current scale. */
        clone(): IColorScale;

        getDomain(): any[];
    }

    export interface IColorInfo extends IStyleInfo {
        value: string;
    }

    export interface IStyleInfo {
        className?: string;
    }
}﻿/*
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



declare module powerbi {
    import DataViewObjectDescriptor = powerbi.data.DataViewObjectDescriptor;
    import DataViewObjectDescriptors = powerbi.data.DataViewObjectDescriptors;
    import Selector = powerbi.data.Selector;
    import IPoint = powerbi.visuals.IPoint;
    import ISemanticFilter = powerbi.data.ISemanticFilter;
    import ISQExpr = powerbi.data.ISQExpr;
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    import IRect = powerbi.visuals.IRect;

    /**
     * Represents a visualization displayed within an application (PowerBI dashboards, ad-hoc reporting, etc.).
     * This interface does not make assumptions about the underlying JS/HTML constructs the visual uses to render itself.
     */
    export interface IVisual {
        /**
         * Initializes an instance of the IVisual.
         *
         * @param options Initialization options for the visual.
         */
        init(options: VisualInitOptions): void;

        /** Notifies the visual that it is being destroyed, and to do any cleanup necessary (such as unsubscribing event handlers). */
        destroy?(): void;

        /**
         * Notifies the IVisual of an update (data, viewmode, size change).
         */
        update?(options: VisualUpdateOptions): void;

        /**
         * Notifies the IVisual to resize.
         *
         * @param finalViewport This is the viewport that the visual will eventually be resized to.
         * @param resized true on on final call when resizing is complete.
         */
        onResizing?(finalViewport: IViewport, resizeMode?: ResizeMode): void;

        /**
         * Notifies the IVisual of new data being provided.
         * This is an optional method that can be omitted if the visual is in charge of providing its own data.
         */
        onDataChanged?(options: VisualDataChangedOptions): void;

        /** Notifies the IVisual to change view mode if applicable. */
        onViewModeChanged?(viewMode: ViewMode): void;

        /** Notifies the IVisual to clear any selection. */
        onClearSelection?(): void;

        /** Gets a value indicating whether the IVisual can be resized to the given viewport. */
        canResizeTo?(viewport: IViewport): boolean;

        /** Gets the set of objects that the visual is currently displaying. */
        enumerateObjectInstances?(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;

        /** Gets the set of object repetitions that the visual can display. */
        enumerateObjectRepetition?(): VisualObjectRepetition[];
    }

    /** Parameters available to a CustomizeQueryMethod */
    export interface CustomizeQueryOptions {
        /**
         * The data view mapping for this visual with some additional information. CustomizeQueryMethod implementations
         * are expected to edit this in-place.
         */
        dataViewMappings: data.CompiledDataViewMapping[];

        /**
         * Visual should prefer to request a higher volume of data.
         */
        preferHigherDataVolume?: boolean;
    }

    /** Parameters available to a sortable visual candidate */
    export interface VisualSortableOptions {
        /* The data view mapping for this visual with some additional information.*/
        dataViewMappings: data.CompiledDataViewMapping[];
    }

    /** An imperative way for a visual to influence query generation beyond just its declared capabilities. */
    export interface CustomizeQueryMethod {
        (options: CustomizeQueryOptions): void;
    }

    /** Defines the visual filtering capability for a particular filter kind. */
    export interface VisualFilterMapping {
        /** Specifies what data roles are used to control the filter semantics for this filter kind. */
        targetRoles: string[];
    }

    /**
     * Defines the visual filtering capabilities for various filter kinds.
     * By default all visuals support attribute filters and measure filters in their innermost scope.
     */
    export interface VisualFilterMappings {
        measureFilter?: VisualFilterMapping;
    }

    /** Defines the capabilities of an IVisual. */
    export interface VisualCapabilities {
        /** Defines what roles the visual expects, and how those roles should be populated.  This is useful for visual generation/editing. */
        dataRoles?: VisualDataRole[];

        /** Defines the set of objects supported by this IVisual. */
        objects?: DataViewObjectDescriptors;

        /** Defines how roles that the visual understands map to the DataView.  This is useful for query generation. */
        dataViewMappings?: DataViewMapping[];

        /** Defines how filters are understood by the visual. This is used by query generation */
        filterMappings?: VisualFilterMappings;

        /** Indicates whether cross-highlight is supported by the visual. This is useful for query generation. */
        supportsHighlight?: boolean;

        /** Indicates whether the visual uses onSelected function for data selections.  Default is true. */
        supportsSelection?: boolean;

        /** Indicates whether sorting is supported by the visual. This is useful for query generation */
        sorting?: VisualSortingCapabilities;

        /** Indicates whether a default title should be displayed.  Visuals with self-describing layout can omit this. */
        suppressDefaultTitle?: boolean;

        /** Indicates whether a default padding should be applied. */
        suppressDefaultPadding?: boolean;

        /** Indicates whether drilling is supported by the visual. */
        drilldown?: VisualDrillCapabilities;

        /** Indicates whether rotating is supported by the visual. */
        canRotate?: boolean;

        /** Indicates whether showing the data underlying this visual would be helpful.  Visuals that already show raw data can specify this. */
        disableVisualDetails?: boolean;

        /** Indicates whether focus mode is supported for the visual. Visuals that would not benefit from focus mode (such as non-data-bound ones) can set it to true.  */
        disableFocusMode?: boolean;
    }

    /** Defines the visual sorting capability. */
    export interface VisualSortingCapabilities {
        /** When specified, indicates that the IVisual wants default sorting behavior. */
        default?: {};

        /** When specified, indicates that the IVisual wants to control sort interactivity. */
        custom?: {};

        /** When specified, indicates sorting that is inherently implied by the IVisual.  This is useful to automatically sort. */
        implicit?: VisualImplicitSorting;
    }

    /** Defines the visual's drill capability. */
    export interface VisualDrillCapabilities {
        /** Returns the drillable role names for this visual **/
        roles?: string[];
    }

    /** Defines implied sorting behaviour for an IVisual. */
    export interface VisualImplicitSorting {
        clauses: VisualImplicitSortingClause[];
    }

    export interface VisualImplicitSortingClause {
        role: string;
        direction: SortDirection;
    }

    /** Defines the capabilities of an IVisual. */
    export interface VisualInitOptions {
        /** The DOM element the visual owns. */
        element: JQuery;

        /** The set of services provided by the visual hosting layer. */
        host: IVisualHostServices;

        /** Style information. */
        style: IVisualStyle;

        /** The initial viewport size. */
        viewport: IViewport;

        /** Animation options. */
        animation?: AnimationOptions;

        /** Interactivity options. */
        interactivity?: InteractivityOptions;
    }

    export interface VisualUpdateOptions {
        viewport: IViewport;
        dataViews: DataView[];
        suppressAnimations?: boolean;
        viewMode?: ViewMode;
        resizeMode?: ResizeMode;
        type?: VisualUpdateType;
        /** Indicates what type of update has been performed on the data.
        The default operation kind is Create.*/
        operationKind?: VisualDataChangeOperationKind;
    }

    export interface VisualDataChangedOptions {
        dataViews: DataView[];

        /** Optionally prevent animation transitions */
        suppressAnimations?: boolean;

        /** Indicates what type of update has been performed on the data.
        The default operation kind is Create.*/
        operationKind?: VisualDataChangeOperationKind;
    }

    export interface CustomSortEventArgs {
        sortDescriptors: SortableFieldDescriptor[];
    }

    export interface SortableFieldDescriptor {
        queryName: string;
        sortDirection?: SortDirection;
    }

    export interface IVisualErrorMessage {
        message: string;
        title: string;
        detail: string;
    }

    export interface IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }

    /** Animation options for visuals. */
    export interface AnimationOptions {
        /** Indicates whether all transition frames should be flushed immediately, effectively "disabling" any visual transitions. */
        transitionImmediate: boolean;
    }

    /** Interactivity options for visuals. */
    export interface InteractivityOptions {
        /** Indicates that dragging of data points should be permitted. */
        dragDataPoint?: boolean;

        /** Indicates that data points should be selectable. */
        selection?: boolean;

        /** Indicates that the chart and the legend are interactive */
        isInteractiveLegend?: boolean;

        /** Indicates overflow behavior. Values are CSS oveflow strings */
        overflow?: string;
    }

    export interface VisualDragPayload extends DragPayload {
        data?: Selector;
        field?: {};
    }

    export interface DragEventArgs {
        event: DragEvent;
        data: VisualDragPayload;
    }

    /** Defines geocoding services. */
    export interface GeocodeOptions {
        /** promise that should abort the request when resolved */
        timeout?: IPromise<any>;
    }

    export interface IGeocoder {
        geocode(query: string, category?: string, options?: GeocodeOptions): IPromise<IGeocodeCoordinate>;
        geocodeBoundary(latitude: number, longitude: number, category: string, levelOfDetail?: number, maxGeoData?: number, options?: GeocodeOptions): IPromise<IGeocodeBoundaryCoordinate>;
        geocodePoint(latitude: number, longitude: number, options?: GeocodeOptions): IPromise<IGeocodeResource>;

        /** returns data immediately if it is locally available (e.g. in cache), null if not in cache */
        tryGeocodeImmediate(query: string, category?: string): IGeocodeCoordinate;
        tryGeocodeBoundaryImmediate(latitude: number, longitude: number, category: string, levelOfDetail?: number, maxGeoData?: number): IGeocodeBoundaryCoordinate;
    }

    export interface IGeocodeCoordinate {
        latitude: number;
        longitude: number;
    }

    export interface IGeocodeBoundaryCoordinate {
        latitude?: number;
        longitude?: number;
        locations?: IGeocodeBoundaryPolygon[]; // one location can have multiple boundary polygons
    }

    export interface IGeocodeResource extends IGeocodeCoordinate {
        addressLine: string;
        locality: string;
        neighborhood: string;
        adminDistrict: string;
        adminDistrict2: string;
        formattedAddress: string;
        postalCode: string;
        countryRegionIso2: string;
        countryRegion: string;
        landmark: string;
        name: string;
    }

    export interface IGeocodeBoundaryPolygon {
        nativeBing: string;

        /** array of lat/long pairs as [lat1, long1, lat2, long2,...] */
        geographic?: Float64Array;

        /** array of absolute pixel position pairs [x1,y1,x2,y2,...]. It can be used by the client for cache the data. */
        absolute?: Float64Array;
        absoluteBounds?: IRect;

        /** string of absolute pixel position pairs "x1 y1 x2 y2...". It can be used by the client for cache the data. */
        absoluteString?: string;
    }

    export interface SelectorForColumn {
        [queryName: string]: data.DataRepetitionSelector;
    }

    export interface SelectorsByColumn {
        /** Data-bound repetition selection. */
        dataMap?: SelectorForColumn;

        /** Metadata-bound repetition selection.  Refers to a DataViewMetadataColumn queryName. */
        metadata?: string;

        /** User-defined repetition selection. */
        id?: string;
    }
    
    export interface SelectingEventArgs {
        visualObjects: VisualObject[];
        action?: VisualInteractivityAction;
    }
    
    export interface SelectEventArgs {
        visualObjects: VisualObject[];
        selectors?: Selector[]; // An array of selectors used in place of visualObjects for certain backwards compatibility cases
    }

    export interface VisualObject {
        /** The name of the object (as defined in object descriptors). */
        objectName: string;

        /** Data-bound repitition selection */
        selectorsByColumn: SelectorsByColumn;
    }

    export interface ContextMenuArgs {
        data: SelectorsByColumn[];

        /** Absolute coordinates for the top-left anchor of the context menu. */
        position: IPoint;
    }

    export interface SelectObjectEventArgs {
        object: DataViewObjectDescriptor;
    }

    export interface FilterAnalyzerOptions {
        dataView: DataView;

        /** The DataViewObjectPropertyIdentifier for default value */
        defaultValuePropertyId: DataViewObjectPropertyIdentifier;

        /** The filter that will be analyzed */
        filter: ISemanticFilter;

        /** The field SQExprs used in the filter */
        fieldSQExprs: ISQExpr[];
    }

    export interface AnalyzedFilter {
        /** The default value of the slicer selected item and it can be undefined if there is no default value */
        defaultValue?: DefaultValueDefinition;

        /** Indicates the filter has Not condition. */
        isNotFilter: boolean;

        /** The selected filter values. */
        selectedIdentities: DataViewScopeIdentity[];

        /** The filter after analyzed. It will be the default filter if it has defaultValue and the pre-analyzed filter is undefined. */
        filter: ISemanticFilter;
    }

    /** Defines behavior for IVisual interaction with the host environment. */
    export interface IVisualHostServices {
        /** Returns the localized form of a string. */
        getLocalizedString(stringId: string): string;

        /** Notifies of a DragStart event. */
        onDragStart(args: DragEventArgs): void;

        ///** Indicates whether the drag payload is compatible with the IVisual's data role.  This is useful when dropping to a particular drop area within the visual (e.g., dropping on a legend). */
        //canDropAs(payload: DragPayload, dataRole?: string): boolean;

        ///** Notifies of a Drop event. */
        //onDrop(args: DragEventArgs, dataRole?: string);

        /** Gets a value indicating whether the given selection is valid. */
        canSelect(args: SelectEventArgs): boolean;

        /** Notifies of the execution of a select event. */
        onSelecting(args: SelectingEventArgs): void;

        /** Notifies of the selection state changing. */
        onSelect(args: SelectEventArgs): void;

        /** Notifies of a request for a context menu. */
        onContextMenu(args: ContextMenuArgs): void;

        /** Check if selection is sticky or otherwise. */
        shouldRetainSelection(): boolean;

        /** Notifies that properties of the IVisual have changed. */
        persistProperties(changes: VisualObjectInstance[]): void;
        persistProperties(changes: VisualObjectInstancesToPersist): void;

        ///** This information will be part of the query. */
        //onDataRangeChanged(range: {
        //    categorical: { // TODO: this structure is affected by the reduction algorithm as well as the data view type
        //        categories?: {
        //            /** Index of the category. */
        //            index: number;
        //            lower?: DataViewScopeIdentity;
        //            upper?: DataViewScopeIdentity;
        //        }[]
        //    }
        // });

        ///** Notifies of a drill down on the specified data point. */
        //onDrillDown(data: DataViewScopeIdentity): void;

        /** Requests more data to be loaded. */
        loadMoreData(): void;

        /** Notification to sort on the specified column */
        onCustomSort(args: CustomSortEventArgs): void;

        /** Indicates which view mode the host is in. */
        getViewMode(): ViewMode;

        /** Notify any warning that happened during update of the visual. */
        setWarnings(clientWarnings: IVisualWarning[]): void;

        /** Sets a toolbar on the host. */
        setToolbar($selector: JQuery): void;

        /** Gets Geocoding Service. */
        geocoder(): IGeocoder;

        /** Gets IGeolocation Service */
        geolocation(): IGeolocation;

        /** Gets the locale string */
        locale?(): string;

        /** Gets the promise factory. */
        promiseFactory(): IPromiseFactory;

        /** Gets filter analyzer */
        analyzeFilter(options: FilterAnalyzerOptions): AnalyzedFilter;

        /** Gets display name for the identities */
        getIdentityDisplayNames(identities: DataViewScopeIdentity[]): DisplayNameIdentityPair[];

        /** Set the display names for their corresponding DataViewScopeIdentity */
        setIdentityDisplayNames(displayNamesIdentityPairs: DisplayNameIdentityPair[]): void;
        
        visualCapabilitiesChanged?(): void;
    }

    export interface DisplayNameIdentityPair {
        displayName: string;
        identity: DataViewScopeIdentity;
    }
}
﻿/*
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



declare module powerbi {
    import Selector = powerbi.data.Selector;
    
    export interface VisualObjectInstance {
        /** The name of the object (as defined in VisualCapabilities). */
        objectName: string;

        /** A display name for the object instance. */
        displayName?: string;

        /** The set of property values for this object.  Some of these properties may be defaults provided by the IVisual. */
        properties: {
            [propertyName: string]: DataViewPropertyValue;
        };

        /** The selector that identifies this object. */
        selector: Selector;

        /** Defines the constrained set of valid values for a property. */
        validValues?: {
            [propertyName: string]: string[];
        };

        /** (Optional) VisualObjectInstanceEnumeration category index. */
        containerIdx?: number;
    }

    export type VisualObjectInstanceEnumeration = VisualObjectInstance[] | VisualObjectInstanceEnumerationObject;

    export interface VisualObjectInstanceEnumerationObject {
        /** The visual object instances. */
        instances: VisualObjectInstance[];

        /** Defines a set of containers for related object instances. */
        containers?: VisualObjectInstanceContainer[];
    }

    export interface VisualObjectInstanceContainer {
        displayName: data.DisplayNameGetter;
    }

    export interface VisualObjectInstancesToPersist {
        /** Instances which should be merged with existing instances. */
        merge?: VisualObjectInstance[];

        /** Instances which should replace existing instances. */
        replace?: VisualObjectInstance[];

        /** Instances which should be deleted from the existing instances. */
        remove?: VisualObjectInstance[];

        /** Instances which should be deleted from the existing objects. */
        removeObject?: VisualObjectInstance[];
    }
    
    export interface EnumerateVisualObjectInstancesOptions {
        objectName: string;
    }
}
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



declare module powerbi {
    import Selector = powerbi.data.Selector;

    export interface VisualObjectRepetition {
        /** The selector that identifies the objects. */
        selector: Selector;

        /** The set of repetition descriptors for this object. */
        objects: {
            [objectName: string]: DataViewRepetitionObjectDescriptor;
        };
    }

    export interface DataViewRepetitionObjectDescriptor {
        /** Properties used for formatting (e.g., Conditional Formatting). */
        formattingProperties?: string[];
    }
}
﻿/*
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



declare module powerbi {

    export interface IVisualPluginContent {
        js: string;
        css: string;
        iconBase64: string;
    }        

    export interface IVisualPlugin {
        /** The name of the plugin.  Must match the property name in powerbi.visuals. */
        name: string;

        /** The key for the watermark style of this visual. Must match the id name in ExploreUI/views/svg/visualsWatermarks.svg */
        watermarkKey?: string;

        /** Declares the capabilities for this IVisualPlugin type. */
        capabilities?: VisualCapabilities;

        /** Function to call to create the visual. */
        create: (options?: extensibility.VisualConstructorOptions) => IVisual;

        /** 
         * Function to allow the visual to influence query generation. Called each time a query is generated
        * so the visual can translate its state into options understood by the query generator. 
        */
        customizeQuery?: CustomizeQueryMethod;

        /** Funation to allow the visual to provide additional information for telemetry. */
        getAdditionalTelemetry?: GetAdditionalTelemetryMethod;

        /** The class of the plugin.  At the moment it is only used to have a way to indicate the class name that a custom visual has. */
        class?: string;

        /** The url to the icon to display within the visualization pane. */
        iconUrl?: string;

        /** Check if a visual is custom */
        custom?: boolean;

        /** Function to get the list of sortable roles */
        getSortableRoles?: (visualSortableOptions?: VisualSortableOptions) => string[];
        
        /** The version of the api that this plugin should be run against */
        apiVersion?: string;
        
        /** Human readable plugin name displayed to users */
        displayName?: string;

        /** The version of the visual */
        version?: string;

        /** Stores visual implementation */
        content?: IVisualPluginContent;
    }

    /** Method for gathering addition information from the visual for telemetry. */
    export interface GetAdditionalTelemetryMethod {
        (dataView: DataView): any;
    }

    /** Factory method for an IVisual.  This factory method should be registered on the powerbi.visuals object. */
    export interface IVisualFactoryMethod {
        (): powerbi.IVisual;
    }
}/*
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



declare module powerbi.extensibility {
    import DataViewObjectDescriptors = powerbi.data.DataViewObjectDescriptors;

    /** Defines the capabilities of an IVisual. */
    export interface VisualCapabilities {
        /** Defines what roles the visual expects, and how those roles should be populated.  This is useful for visual generation/editing. */
        dataRoles?: VisualDataRole[];

        /** Defines the set of objects supported by this IVisual. */
        objects?: DataViewObjectDescriptors;

        /** Defines how roles that the visual understands map to the DataView.  This is useful for query generation. */
        dataViewMappings?: DataViewMapping[];

        /** Indicates whether cross-highlight is supported by the visual. This is useful for query generation. */
        supportsHighlight?: boolean;
        
        /** Indicates whether sorting is supported by the visual. This is useful for query generation */
        sorting?: VisualSortingCapabilities;        
    }
}﻿/*
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



declare module powerbi.extensibility {

    export interface IVisualPluginOptions {
        transform?: IVisualDataViewTransform;
    }

    export interface IVisualConstructor {
        __transform__?: IVisualDataViewTransform;
    }   
    
    export interface IVisualDataViewTransform {
        <T>(dataview: DataView[]): T;
    } 

    // These are the base interfaces. These should remain empty
    // All visual versions should extend these for type compatability

    export interface IVisual { }

    export interface IVisualHost { }

    export interface VisualUpdateOptions { }

    export interface VisualConstructorOptions { }
}
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



declare module powerbi.extensibility {

    export interface VisualVersionOverloads {
        [name: string]: Function;
    }

    export interface VisualVersionOverloadFactory {
        (visual: powerbi.extensibility.IVisual): VisualVersionOverloads;
    }

    export interface VisualHostAdapter {
        (host: powerbi.IVisualHostServices): IVisualHost;
    }

    export interface VisualVersion {
        version: string;
        overloads?: VisualVersionOverloadFactory;
        hostAdapter: VisualHostAdapter;
    }

    /**
     * Extends the interface of a visual wrapper (IVisual) to include
     * the unwrap method which returns a direct reference to the wrapped visual. 
     * Used in SafeExecutionWrapper and VisualAdapter
     */
    export interface WrappedVisual {
        /** Returns this visual inside of this wrapper */
        unwrap: () => powerbi.IVisual;
    }
}/*
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
 * Change Log Version 1.0.0
 * - Add type to update options (data, resize, viewmode)
 * - Remove deprecated methods (onDataChange, onResizing, onViewModeChange) 
 * - Add hostAdapter for host services versioning
 */



declare module powerbi.extensibility.v100 {
    /**
     * Represents a visualization displayed within an application (PowerBI dashboards, ad-hoc reporting, etc.).
     * This interface does not make assumptions about the underlying JS/HTML constructs the visual uses to render itself.
     */
    export interface IVisual extends extensibility.IVisual {
        /** Notifies the IVisual of an update (data, viewmode, size change). */
        update(options: VisualUpdateOptions): void;

        /** Notifies the visual that it is being destroyed, and to do any cleanup necessary (such as unsubscribing event handlers). */
        destroy?(): void;

        /** Gets the set of objects that the visual is currently displaying. */
        enumerateObjectInstances?(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
    }

    export interface IVisualHost extends extensibility.IVisualHost { }

    export interface VisualUpdateOptions extends extensibility.VisualUpdateOptions {
        viewport: IViewport;
        dataViews: DataView[];
        type: VisualUpdateType;
        viewMode?: ViewMode;
    }

    export interface VisualConstructorOptions extends extensibility.VisualConstructorOptions {
        element: HTMLElement;
        host: IVisualHost;
    }

}
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
 * Change Log Version 1.1.0
 */



declare module powerbi.extensibility.v110 {
    /**
     * Represents a visualization displayed within an application (PowerBI dashboards, ad-hoc reporting, etc.).
     * This interface does not make assumptions about the underlying JS/HTML constructs the visual uses to render itself.
     */
    export interface IVisual extends extensibility.IVisual {
        /** Notifies the IVisual of an update (data, viewmode, size change). */
        update<T>(options: VisualUpdateOptions, viewModel?: T): void;

        /** Notifies the visual that it is being destroyed, and to do any cleanup necessary (such as unsubscribing event handlers). */
        destroy?(): void;

        /** Gets the set of objects that the visual is currently displaying. */
        enumerateObjectInstances?(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
    }

    export interface IVisualHost extends extensibility.IVisualHost {
        createSelectionIdBuilder: () => visuals.ISelectionIdBuilder;
        createSelectionManager: () => ISelectionManager;
        /** An array of default colors to be used by the visual */
        colors: IColorInfo[];
    }

    export interface VisualUpdateOptions extends extensibility.VisualUpdateOptions {
        viewport: IViewport;
        dataViews: DataView[];
        type: VisualUpdateType;
        viewMode?: ViewMode;
    }

    export interface VisualConstructorOptions extends extensibility.VisualConstructorOptions {
        element: HTMLElement;
        host: IVisualHost;
    }
}
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



declare module powerbi.extensibility {
    interface ISelectionManager {
        select(selectionId: ISelectionId, multiSelect?: boolean): IPromise<ISelectionId[]>;
        hasSelection(): boolean;
        clear(): IPromise<{}>;
        getSelectionIds(): ISelectionId[];
    }
}/*
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



declare module powerbi.extensibility {
    export interface ISelectionId { }

    export interface ISelectionIdBuilder {
        withCategory(categoryColumn: DataViewCategoryColumn, index: number): this;
        withSeries(seriesColumn: DataViewValueColumns, valueColumn: DataViewValueColumn | DataViewValueColumnGroup): this;
        withMeasure(measureId: string): this;
        createSelectionId(): ISelectionId;
    }
}































































































declare module powerbi {
    /** Defines a custom enumeration data type, and its values. */
    interface IEnumType {
        /** Gets the members of the enumeration, limited to the validMembers, if appropriate. */
        members(validMembers?: EnumMemberValue[]): IEnumMember[];
    }
    function createEnumType(members: IEnumMember[]): IEnumType;
}

declare module powerbi {
    import SQExpr = powerbi.data.SQExpr;
    interface FillDefinition {
        solid?: {
            color?: SQExpr;
        };
        gradient?: {
            startColor?: SQExpr;
            endColor?: SQExpr;
        };
        pattern?: {
            patternKind?: SQExpr;
            color?: SQExpr;
        };
    }
    module FillDefinitionHelpers {
        function createSolidFillDefinition(color: string): FillDefinition;
        function createSolidFillSQExpr(color: string): SQExpr | StructuralObjectDefinition;
    }
    module FillSolidColorTypeDescriptor {
        /** Gets a value indicating whether the descriptor is nullable or not. */
        function nullable(descriptor: FillSolidColorTypeDescriptor): boolean;
    }
}

declare module powerbi {
    import SQExpr = powerbi.data.SQExpr;
    interface FillRuleTypeDescriptor {
    }
    interface FillRuleDefinition extends FillRuleGeneric<SQExpr, SQExpr> {
    }
    interface FillRule extends FillRuleGeneric<string, number> {
    }
    type LinearGradient2 = LinearGradient2Generic<string, number>;
    type LinearGradient3 = LinearGradient3Generic<string, number>;
    type LinearGradient2Definition = LinearGradient2Generic<SQExpr, SQExpr>;
    type LinearGradient3Definition = LinearGradient3Generic<SQExpr, SQExpr>;
    type RuleColorStopDefinition = RuleColorStopGeneric<SQExpr, SQExpr>;
    type RuleColorStop = RuleColorStopGeneric<string, number>;
    interface IFillRuleDefinitionVisitor<T2, T3> {
        visitLinearGradient2(linearGradient2: LinearGradient2Definition, arg?: any): T2;
        visitLinearGradient3(linearGradient3: LinearGradient3Definition, arg?: any): T3;
    }
}

declare module powerbi {
    import SQExpr = powerbi.data.SQExpr;
    interface ImageTypeDescriptor {
    }
    type ImageDefinition = ImageDefinitionGeneric<SQExpr>;
    module ImageDefinition {
        const urlType: ValueTypeDescriptor;
    }
}

declare module powerbi {
    import SQExpr = powerbi.data.SQExpr;
    interface ParagraphsTypeDescriptor {
    }
    type ParagraphsDefinition = ParagraphDefinition[];
    type ParagraphDefinition = ParagraphDefinitionGeneric<SQExpr>;
    type TextRunDefinition = TextRunDefinitionGeneric<SQExpr>;
    interface ParagraphDefinitionGeneric<TExpr> {
        horizontalTextAlignment?: string;
        textRuns: TextRunDefinitionGeneric<TExpr>[];
    }
    interface TextRunDefinitionGeneric<TExpr> {
        textStyle?: TextRunStyle;
        url?: string;
        value: string | TExpr;
    }
}

declare module powerbi {
    import SemanticFilter = powerbi.data.SemanticFilter;
    type StructuralObjectDefinition = FillDefinition | FillRuleDefinition | SemanticFilter | DefaultValueDefinition | ImageDefinition | ParagraphsDefinition;
    module StructuralTypeDescriptor {
        function isValid(type: StructuralTypeDescriptor): boolean;
    }
}

declare module powerbi.data {
    /**
     * Represents the versions of the data shape binding structure.
     * NOTE Keep this file in sync with the Sql\InfoNav\src\Data\Contracts\DsqGeneration\DataShapeBindingVersions.cs
     * file in the TFS Dev branch.
     */
    const enum DataShapeBindingVersions {
        /** The initial version of data shape binding */
        Version0 = 0,
        /** Explicit subtotal support for axis groupings. */
        Version1 = 1,
    }
    interface DataShapeBindingLimitTarget {
        Primary?: number;
    }
    const enum DataShapeBindingLimitType {
        Top = 0,
        First = 1,
        Last = 2,
        Sample = 3,
        Bottom = 4,
    }
    interface DataShapeBindingLimit {
        Count?: number;
        Target: DataShapeBindingLimitTarget;
        Type: DataShapeBindingLimitType;
    }
    interface DataShapeBinding {
        Version?: number;
        Primary: DataShapeBindingAxis;
        Secondary?: DataShapeBindingAxis;
        Aggregates?: DataShapeBindingAggregate[];
        Projections?: number[];
        Limits?: DataShapeBindingLimit[];
        Highlights?: FilterDefinition[];
        DataReduction?: DataShapeBindingDataReduction;
        IncludeEmptyGroups?: boolean;
        SuppressedJoinPredicates?: number[];
    }
    interface DataShapeBindingDataReduction {
        Primary?: DataShapeBindingDataReductionAlgorithm;
        Secondary?: DataShapeBindingDataReductionAlgorithm;
        DataVolume?: number;
    }
    interface DataShapeBindingDataReductionAlgorithm {
        Top?: DataShapeBindingDataReductionTopLimit;
        Sample?: DataShapeBindingDataReductionSampleLimit;
        Bottom?: DataShapeBindingDataReductionBottomLimit;
        Window?: DataShapeBindingDataReductionDataWindow;
    }
    interface DataShapeBindingDataReductionTopLimit {
        Count?: number;
    }
    interface DataShapeBindingDataReductionSampleLimit {
        Count?: number;
    }
    interface DataShapeBindingDataReductionBottomLimit {
        Count?: number;
    }
    interface DataShapeBindingDataReductionDataWindow {
        Count?: number;
        RestartTokens?: RestartToken;
    }
    interface DataShapeBindingAxis {
        Groupings: DataShapeBindingAxisGrouping[];
    }
    const enum SubtotalType {
        None = 0,
        Before = 1,
        After = 2,
    }
    interface DataShapeBindingAxisGrouping {
        Projections: number[];
        GroupBy?: number[];
        SuppressedProjections?: number[];
        Subtotal?: SubtotalType;
        ShowItemsWithNoData?: number[];
    }
    interface DataShapeBindingAggregate {
        Select: number;
        Aggregations: DataShapeBindingSelectAggregateContainer[];
    }
    interface DataShapeBindingSelectAggregateContainer {
        Percentile?: DataShapeBindingSelectPercentileAggregate;
        Min?: DataShapeBindingSelectMinAggregate;
        Max?: DataShapeBindingSelectMaxAggregate;
        Median?: DataShapeBindingSelectMedianAggregate;
        Average?: DataShapeBindingSelectAverageAggregate;
    }
    interface DataShapeBindingSelectPercentileAggregate {
        Exclusive?: boolean;
        K: number;
    }
    interface DataShapeBindingSelectMaxAggregate {
    }
    interface DataShapeBindingSelectMinAggregate {
    }
    interface DataShapeBindingSelectMedianAggregate {
    }
    interface DataShapeBindingSelectAverageAggregate {
    }
}

declare module powerbi.data {
    module DataShapeBindingDataReduction {
        function createFrom(reduction: ReductionAlgorithm): DataShapeBindingDataReductionAlgorithm;
    }
}

declare module powerbi.data {
    interface FederatedConceptualSchemaInitOptions {
        schemas: {
            [name: string]: ConceptualSchema;
        };
        links?: ConceptualSchemaLink[];
    }
    /** Represents a federated conceptual schema. */
    class FederatedConceptualSchema {
        private schemas;
        private links;
        constructor(options: FederatedConceptualSchemaInitOptions);
        schema(name: string): ConceptualSchema;
    }
    /** Describes a semantic relationship between ConceptualSchemas. */
    interface ConceptualSchemaLink {
    }
}

declare module powerbi.data {
    module Selector {
        function filterFromSelector(selectors: Selector[], isNot?: boolean): SemanticFilter;
        function matchesData(selector: Selector, identities: DataViewScopeIdentity[]): boolean;
        function matchesKeys(selector: Selector, keysList: SQExpr[][]): boolean;
        /** Determines whether two selectors are equal. */
        function equals(x: Selector, y: Selector): boolean;
        function getKey(selector: Selector): string;
        function containsWildcard(selector: Selector): boolean;
        function hasRoleWildcard(selector: Selector): boolean;
        function isRoleWildcard(dataItem: DataRepetitionSelector): dataItem is DataViewRoleWildcard;
        function convertSelectorsByColumnToSelector(selectorsByColumn: SelectorsByColumn): Selector;
    }
}

declare module powerbi.data {
    /** Represents a projection from a query result. */
    interface QueryProjection {
        /** Name of item in the semantic query Select clause. */
        queryRef: string;
        /** Optional format string. */
        format?: string;
    }
    /** A set of QueryProjections, grouped by visualization property, and ordered within that property. */
    interface QueryProjectionsByRole {
        [roleName: string]: QueryProjectionCollection;
    }
    class QueryProjectionCollection {
        private items;
        private _activeProjectionRefs;
        private _showAll;
        constructor(items: QueryProjection[], activeProjectionRefs?: string[], showAll?: boolean);
        /** Returns all projections in a mutable array. */
        all(): QueryProjection[];
        activeProjectionRefs: string[];
        showAll: boolean;
        addActiveQueryReference(queryRef: string): void;
        getLastActiveQueryReference(): string;
        /** Replaces the given oldQueryRef with newQueryRef in this QueryProjectionCollection. */
        replaceQueryRef(oldQueryRef: string, newQueryRef: string): void;
        clone(): QueryProjectionCollection;
    }
    module QueryProjectionsByRole {
        /** Clones the QueryProjectionsByRole. */
        function clone(roles: QueryProjectionsByRole): QueryProjectionsByRole;
        /** Returns the QueryProjectionCollection for that role.  Even returns empty collections so that 'drillable' and 'activeProjection' fields are preserved. */
        function getRole(roles: QueryProjectionsByRole, name: string): QueryProjectionCollection;
    }
}

declare module powerbi {
    interface VisualElement {
        DataRoles?: DataRole[];
        Settings?: VisualElementSettings;
    }
    /** Defines common settings for a visual element. */
    interface VisualElementSettings {
        DisplayUnitSystemType?: DisplayUnitSystemType;
    }
    interface DataRole {
        Name: string;
        Projection: number;
        isActive?: boolean;
    }
    /** The system used to determine display units used during formatting */
    enum DisplayUnitSystemType {
        /** Default display unit system, which saves space by using units such as K, M, bn with PowerView rules for when to pick a unit. Suitable for chart axes. */
        Default = 0,
        /** A verbose display unit system that will only respect the formatting defined in the model. Suitable for explore mode single-value cards. */
        Verbose = 1,
        /**
         * A display unit system that uses units such as K, M, bn if we have at least one of those units (e.g. 0.9M is not valid as it's less than 1 million).
         * Suitable for dashboard tile cards
         */
        WholeUnits = 2,
        /**A display unit system that also contains Auto and None units for data labels*/
        DataLabels = 3,
    }
}
declare module powerbi.data.contracts {
    interface DataViewSource {
        data: any;
        type?: string;
    }
}

declare module powerbi {
    /** Repreasents the sequence of the dates/times */
    class DateTimeSequence {
        private static MIN_COUNT;
        private static MAX_COUNT;
        min: Date;
        max: Date;
        unit: DateTimeUnit;
        sequence: Date[];
        interval: number;
        intervalOffset: number;
        /** Creates new instance of the DateTimeSequence */
        constructor(unit: DateTimeUnit);
        /**
         * Add a new Date to a sequence.
         * @param date - date to add
         */
        add(date: Date): void;
        /**
         * Extends the sequence to cover new date range
         * @param min - new min to be covered by sequence
         * @param max - new max to be covered by sequence
         */
        extendToCover(min: Date, max: Date): void;
        /**
         * Move the sequence to cover new date range
         * @param min - new min to be covered by sequence
         * @param max - new max to be covered by sequence
         */
        moveToCover(min: Date, max: Date): void;
        /**
         * Calculate a new DateTimeSequence
         * @param dataMin - Date representing min of the data range
         * @param dataMax - Date representing max of the data range
         * @param expectedCount - expected number of intervals in the sequence
         * @param unit - of the intervals in the sequence
         */
        static calculate(dataMin: Date, dataMax: Date, expectedCount: number, unit?: DateTimeUnit): DateTimeSequence;
        static calculateYears(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateMonths(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateWeeks(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateDays(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateHours(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateMinutes(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateSeconds(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateMilliseconds(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static addInterval(value: Date, interval: number, unit: DateTimeUnit): Date;
        private static fromNumericSequence(date, sequence, unit);
        private static getDelta(min, max, unit);
        static getIntervalUnit(min: Date, max: Date, maxCount: number): DateTimeUnit;
    }
    /** DateUtils module provides DateTimeSequence with set of additional date manipulation routines */
    module DateUtils {
        /**
         * Adds a specified number of years to the provided date.
         * @param date - date value
         * @param yearDelta - number of years to add
         */
        function addYears(date: Date, yearDelta: number): Date;
        /**
         * Adds a specified number of months to the provided date.
         * @param date - date value
         * @param monthDelta - number of months to add
         */
        function addMonths(date: Date, monthDelta: number): Date;
        /**
         * Adds a specified number of weeks to the provided date.
         * @param date - date value
         * @param weeks - number of weeks to add
         */
        function addWeeks(date: Date, weeks: number): Date;
        /**
         * Adds a specified number of days to the provided date.
         * @param date - date value
         * @param days - number of days to add
         */
        function addDays(date: Date, days: number): Date;
        /**
         * Adds a specified number of hours to the provided date.
         * @param date - date value
         * @param hours - number of hours to add
         */
        function addHours(date: Date, hours: number): Date;
        /**
         * Adds a specified number of minutes to the provided date.
         * @param date - date value
         * @param minutes - number of minutes to add
         */
        function addMinutes(date: Date, minutes: number): Date;
        /**
         * Adds a specified number of seconds to the provided date.
         * @param date - date value
         * @param seconds - number of seconds to add
         */
        function addSeconds(date: Date, seconds: number): Date;
        /**
         * Adds a specified number of milliseconds to the provided date.
         * @param date - date value
         * @param milliseconds - number of milliseconds to add
         */
        function addMilliseconds(date: Date, milliseconds: number): Date;
    }
}

declare module powerbi {
    class DisplayUnit {
        value: number;
        title: string;
        labelFormat: string;
        applicableRangeMin: number;
        applicableRangeMax: number;
        project(value: number): number;
        reverseProject(value: number): number;
        isApplicableTo(value: number): boolean;
        isScaling(): boolean;
    }
    class DisplayUnitSystem {
        units: DisplayUnit[];
        displayUnit: DisplayUnit;
        private unitBaseValue;
        protected static UNSUPPORTED_FORMATS: RegExp;
        constructor(units?: DisplayUnit[]);
        title: string;
        update(value: number): void;
        private findApplicableDisplayUnit(value);
        format(value: number, format: string, decimals?: number, trailingZeros?: boolean): string;
        isFormatSupported(format: string): boolean;
        isPercentageFormat(format: string): boolean;
        shouldRespectScalingUnit(format: string): boolean;
        getNumberOfDecimalsForFormatting(format: string, decimals?: number): number;
        isScalingUnit(): boolean;
        private formatHelper(value, nonScientificFormat, format, decimals?, trailingZeros?);
        /** Formats a single value by choosing an appropriate base for the DisplayUnitSystem before formatting. */
        formatSingleValue(value: number, format: string, decimals?: number, trailingZeros?: boolean): string;
        private shouldUseValuePrecision(value);
        protected isScientific(value: number): boolean;
        protected hasScientitifcFormat(format: string): boolean;
        protected supportsScientificFormat(format: string): boolean;
        protected shouldFallbackToScientific(value: number, format: string): boolean;
        protected getScientificFormat(data: number, format: string, decimals: number, trailingZeros: boolean): string;
    }
    /** Provides a unit system that is defined by formatting in the model, and is suitable for visualizations shown in single number visuals in explore mode. */
    class NoDisplayUnitSystem extends DisplayUnitSystem {
        constructor();
    }
    /** Provides a unit system that creates a more concise format for displaying values. This is suitable for most of the cases where
        we are showing values (chart axes) and as such it is the default unit system. */
    class DefaultDisplayUnitSystem extends DisplayUnitSystem {
        private static units;
        constructor(unitLookup: (exponent: number) => DisplayUnitSystemNames);
        format(data: number, format: string, decimals?: number, trailingZeros?: boolean): string;
        static reset(): void;
        private static getUnits(unitLookup);
    }
    /** Provides a unit system that creates a more concise format for displaying values, but only allows showing a unit if we have at least
        one of those units (e.g. 0.9M is not allowed since it's less than 1 million). This is suitable for cases such as dashboard tiles
        where we have restricted space but do not want to show partial units. */
    class WholeUnitsDisplayUnitSystem extends DisplayUnitSystem {
        private static units;
        constructor(unitLookup: (exponent: number) => DisplayUnitSystemNames);
        static reset(): void;
        private static getUnits(unitLookup);
        format(data: number, format: string, decimals?: number, trailingZeros?: boolean): string;
    }
    class DataLabelsDisplayUnitSystem extends DisplayUnitSystem {
        private static AUTO_DISPLAYUNIT_VALUE;
        private static NONE_DISPLAYUNIT_VALUE;
        protected static UNSUPPORTED_FORMATS: RegExp;
        private static units;
        constructor(unitLookup: (exponent: number) => DisplayUnitSystemNames);
        isFormatSupported(format: string): boolean;
        private static getUnits(unitLookup);
        format(data: number, format: string, decimals?: number, trailingZeros?: boolean): string;
    }
    interface DisplayUnitSystemNames {
        title: string;
        format: string;
    }
}

declare module powerbi {
    class NumericSequence {
        private static MIN_COUNT;
        private static MAX_COUNT;
        private maxAllowedMargin;
        private canExtendMin;
        private canExtendMax;
        interval: number;
        intervalOffset: number;
        min: number;
        max: number;
        precision: number;
        sequence: number[];
        static calculate(range: NumericSequenceRange, expectedCount: number, maxAllowedMargin?: number, minPower?: number, useZeroRefPoint?: boolean, steps?: number[]): NumericSequence;
        /**
         * Calculates the sequence of int numbers which are mapped to the multiples of the units grid.
         * @min - The minimum of the range.
         * @max - The maximum of the range.
         * @maxCount - The max count of intervals.
         * @steps - array of intervals.
         */
        static calculateUnits(min: number, max: number, maxCount: number, steps: number[]): NumericSequence;
        trimMinMax(min: number, max: number): void;
    }
}

declare module powerbi {
    class NumericSequenceRange {
        private static DEFAULT_MAX;
        private static MIN_SUPPORTED_DOUBLE;
        private static MAX_SUPPORTED_DOUBLE;
        min: number;
        max: number;
        includeZero: boolean;
        forcedSingleStop: number;
        hasDataRange: boolean;
        hasFixedMin: boolean;
        hasFixedMax: boolean;
        private _ensureIncludeZero();
        private _ensureNotEmpty();
        private _ensureDirection();
        getSize(): number;
        shrinkByStep(range: NumericSequenceRange, step: number): void;
        static calculate(dataMin: number, dataMax: number, fixedMin?: number, fixedMax?: number, includeZero?: boolean): NumericSequenceRange;
        static calculateDataRange(dataMin: number, dataMax: number, includeZero?: boolean): NumericSequenceRange;
        static calculateFixedRange(fixedMin: number, fixedMax: number, includeZero?: boolean): NumericSequenceRange;
    }
    /** Note: Exported for testability */
    module ValueUtil {
        function hasValue(value: any): boolean;
    }
}

declare module powerbi.visuals {
    /**
     * Formats the value using provided format expression
     * @param value - value to be formatted and converted to string.
     * @param format - format to be applied if the number shouldn't be abbreviated.
     * If the number should be abbreviated this string is checked for special characters like $ or % if any
     */
    interface ICustomValueFormatter {
        (value: any, format?: string): string;
    }
    interface ICustomValueColumnFormatter {
        (value: any, column: DataViewMetadataColumn, formatStringProp: DataViewObjectPropertyIdentifier, nullsAreBlank?: boolean): string;
    }
    interface ValueFormatterOptions {
        /** The format string to use. */
        format?: string;
        /** The data value. */
        value?: any;
        /** The data value. */
        value2?: any;
        /** The number of ticks. */
        tickCount?: any;
        /** The display unit system to use */
        displayUnitSystemType?: DisplayUnitSystemType;
        /** True if we are formatting single values in isolation (e.g. card), as opposed to multiple values with a common base (e.g. chart axes) */
        formatSingleValues?: boolean;
        /** True if we want to trim off unnecessary zeroes after the decimal and remove a space before the % symbol */
        allowFormatBeautification?: boolean;
        /** Specifies the maximum number of decimal places to show*/
        precision?: number;
        /** Detect axis precision based on value */
        detectAxisPrecision?: boolean;
        /** Specifies the column type of the data value */
        columnType?: ValueTypeDescriptor;
    }
    interface IValueFormatter {
        format(value: any): string;
        displayUnit?: DisplayUnit;
        options?: ValueFormatterOptions;
    }
    /** Captures all locale-specific options used by the valueFormatter. */
    interface ValueFormatterLocalizationOptions {
        null: string;
        true: string;
        false: string;
        NaN: string;
        infinity: string;
        negativeInfinity: string;
        /** Returns a beautified form the given format string. */
        beautify(format: string): string;
        /** Returns an object describing the given exponent in the current language. */
        describe(exponent: number): DisplayUnitSystemNames;
        restatementComma: string;
        restatementCompoundAnd: string;
        restatementCompoundOr: string;
    }
    module valueFormatter {
        const DefaultIntegerFormat: string;
        const DefaultNumericFormat: string;
        const DefaultDateFormat: string;
        function getLocalizedString(stringId: string): string;
        function getFormatMetadata(format: string): powerbi.NumberFormat.NumericFormatMetadata;
        function setLocaleOptions(options: ValueFormatterLocalizationOptions): void;
        function createDefaultFormatter(formatString: string, allowFormatBeautification?: boolean): IValueFormatter;
        /** Creates an IValueFormatter to be used for a range of values. */
        function create(options: ValueFormatterOptions): IValueFormatter;
        function format(value: any, format?: string, allowFormatBeautification?: boolean): string;
        /**
         * Value formatting function to handle variant measures.
         * For a Date/Time value within a non-date/time field, it's formatted with the default date/time formatString instead of as a number
         * @param {any} value Value to be formatted
         * @param {DataViewMetadataColumn} column Field which the value belongs to
         * @param {DataViewObjectPropertyIdentifier} formatStringProp formatString Property ID
         * @param {boolean} nullsAreBlank? Whether to show "(Blank)" instead of empty string for null values
         * @returns Formatted value
         */
        function formatVariantMeasureValue(value: any, column: DataViewMetadataColumn, formatStringProp: DataViewObjectPropertyIdentifier, nullsAreBlank?: boolean): string;
        function getFormatString(column: DataViewMetadataColumn, formatStringProperty: DataViewObjectPropertyIdentifier, suppressTypeFallback?: boolean): string;
        /** The returned string will look like 'A, B, ..., and C'  */
        function formatListAnd(strings: string[]): string;
        /** The returned string will look like 'A, B, ..., or C' */
        function formatListOr(strings: string[]): string;
        function getDisplayUnits(displayUnitSystemType: DisplayUnitSystemType): DisplayUnit[];
    }
}

declare module powerbi.data {
    module DataViewCategoricalUtils {
        function getCategoriesDataViewObjects(categories: DataViewCategoryColumn[]): DataViewObjects[];
        /**
         * In DataViewCategorical.categories, all columns have the same identity array, but any applicable DataViewObjects would be added to the first column only.
         *
         * If prototypeCategories is non-empty and is not an inherited object, returns the inherited version of prototypeCategories that has the objects set on its first column.
         * Else, if prototypeCategories is non-empty and is already an inherited object, returns prototypeCategories that has the objects set on its first column.
         * Else, if prototypeCategories is an empty array, returns undefined.
         *
         * Related code: DataViewTransform.findSelectedCategoricalColumn(...)
         */
        function setCategoriesDataViewObjects(prototypeCategories: DataViewCategoryColumn[], objects: DataViewObjects[]): DataViewCategoryColumn[];
    }
}

declare module powerbi.data {
    module DataViewMatrixUtils {
        const enum DepthFirstTraversalCallbackResult {
            stop = 0,
            continueToChildNodes = 1,
            skipDescendantNodes = 2,
        }
        function isLeafNode(node: DataViewMatrixNode): boolean;
        /**
         * Invokes the specified callback once per node in the node tree starting from the specified rootNodes in depth-first order.
         *
         * If rootNodes is null or undefined or empty, the specified callback will not get invoked.
         *
         * The traversalPath parameter in the callback is an ordered set of nodes that form the path from the specified
         * rootNodes down to the callback node argument itself.  If callback node is one of the specified rootNodes,
         * then traversalPath will be an array of length 1 containing that very node.
         *
         * IMPORTANT: The traversalPath array passed to the callback will be modified after the callback function returns!
         * If your callback needs to retain a copy of the traversalPath, please clone the array before returning.
         */
        function forEachNodeDepthFirst(rootNodes: DataViewMatrixNode | DataViewMatrixNode[], callback: (node: DataViewMatrixNode, traversalPath?: DataViewMatrixNode[]) => DepthFirstTraversalCallbackResult): void;
        /**
         * Invokes the specified callback once per leaf node (including root-level leaves and descendent leaves) of the
         * specified rootNodes, with an optional index parameter in the callback that is the 0-based index of the
         * particular leaf node in the context of this forEachLeafNode(...) invocation.
         *
         * If rootNodes is null or undefined or empty, the specified callback will not get invoked.
         *
         * The traversalPath parameter in the callback is an ordered set of nodes that form the path from the specified
         * rootNodes down to the leafNode argument itself.  If callback leafNode is one of the specified rootNodes,
         * then traversalPath will be an array of length 1 containing that very node.
         *
         * IMPORTANT: The traversalPath array passed to the callback will be modified after the callback function returns!
         * If your callback needs to retain a copy of the traversalPath, please clone the array before returning.
         */
        function forEachLeafNode(rootNodes: DataViewMatrixNode | DataViewMatrixNode[], callback: (leafNode: DataViewMatrixNode, index?: number, traversalPath?: DataViewMatrixNode[]) => void): void;
        /**
         * Invokes the specified callback once for each node at the specified targetLevel in the node tree.
         *
         * Note: Be aware that in a matrix with multiple column grouping fields and multiple value fields, the DataViewMatrixNode
         * for the Grand Total column in the column hierarchy can have children nodes where level > (parent.level + 1):
         *  {
         *      "level": 0,
         *      "isSubtotal": true,
         *      "children": [
         *          { "level": 2, "isSubtotal": true },
         *          { "level": 2, "levelSourceIndex": 1, "isSubtotal": true }
         *      ]
         *  }
         */
        function forEachNodeAtLevel(node: DataViewMatrixNode, targetLevel: number, callback: (node: DataViewMatrixNode) => void): void;
        /**
         * Returned an object tree where each node and its children property are inherited from the specified node
         * hierarchy, from the root down to the nodes at the specified deepestLevelToInherit, inclusively.
         *
         * The inherited nodes at level === deepestLevelToInherit will NOT get an inherited version of children array
         * property, i.e. its children property is the same array object referenced in the input node's object tree.
         *
         * @param node The input node with the hierarchy object tree.
         * @param deepestLevelToInherit The highest level for a node to get inherited. See DataViewMatrixNode.level property.
         * @param useInheritSingle If true, then a node will get inherited in the returned object tree only if it is
         * not already an inherited object. Same goes for the node's children property.  This is useful for creating
         * "visual DataView" objects from "query DataView" objects, as object inheritance is the mechanism for
         * "visual DataView" to override properties in "query DataView", and that "query DataView" never contains
         * inherited objects.
         */
        function inheritMatrixNodeHierarchy(node: DataViewMatrixNode, deepestLevelToInherit: number, useInheritSingle: boolean): DataViewMatrixNode;
        /**
         * Returns true if the specified matrixOrHierarchy contains any composite grouping, i.e. a grouping on multiple columns.
         * An example of composite grouping is one on [Year, Quarter, Month], where a particular group instance can have
         * Year === 2016, Quarter === 'Qtr 1', Month === 1.
         *
         * Returns false if the specified matrixOrHierarchy does not contain any composite group,
         * or if matrixOrHierarchy is null or undefined.
         */
        function containsCompositeGroup(matrixOrHierarchy: DataViewMatrix | DataViewHierarchy): boolean;
    }
}

declare module powerbi.data {
    module DataViewMetadataColumnUtils {
        interface MetadataColumnAndProjectionIndex {
            /**
            * A metadata column taken from a source collection, e.g. DataViewHierarchyLevel.sources, DataViewMatrix.valueSources...
            */
            metadataColumn: DataViewMetadataColumn;
            /**
             * The index of this.metadataColumn in its sources collection.
             *
             * E.g.1 This can be the value of the property DataViewMatrixGroupValue.levelSourceIndex which is the index of this.metadataColumn in DataViewHierarchyLevel.sources.
             * E.g.2 This can be the value of the property DataViewMatrixNodeValue.valueSourceIndex which refer to columns in DataViewMatrix.valueSources.
             */
            sourceIndex: number;
            /**
            * The index of this.metadataColumn in the projection ordering of a given role.
            * This property is undefined if the column is not projected.
            */
            projectionOrderIndex?: number;
        }
        /**
         * Returns true iff the specified metadataColumn is assigned to the specified targetRole.
         */
        function isForRole(metadataColumn: DataViewMetadataColumn, targetRole: string): boolean;
        /**
         * Returns true iff the specified metadataColumn is assigned to any one of the specified targetRoles.
         */
        function isForAnyRole(metadataColumn: DataViewMetadataColumn, targetRoles: string[]): boolean;
        /**
         * Left-joins each metadata column of the specified target roles in the specified columnSources
         * with projection ordering index into a wrapper object.
         *
         * If a metadata column is for one of the target roles but its select index is not projected, the projectionOrderIndex property
         * in that MetadataColumnAndProjectionIndex object will be undefined.
         *
         * If a metadata column is for one of the target roles and its select index is projected more than once, that metadata column
         * will be included in multiple MetadataColumnAndProjectionIndex objects, once per occurrence in projection.
         *
         * If the specified projectionOrdering does not contain duplicate values, then the returned objects will be in the same order
         * as their corresponding metadata column object appears in the specified columnSources.
         *
         * Note: In order for this function to reliably calculate the "source index" of a particular column, the
         * specified columnSources must be a non-filtered array of column sources from the DataView, such as
         * the DataViewHierarchyLevel.sources and DataViewMatrix.valueSources array properties.
         *
         * @param columnSources E.g. DataViewHierarchyLevel.sources, DataViewMatrix.valueSources...
         * @param projectionOrdering The select indices in projection ordering.  It should be the ordering for the specified target roles.
         * @param roles The roles for filtering out the irrevalent columns in columnSources.
         */
        function leftJoinMetadataColumnsAndProjectionOrder(columnSources: DataViewMetadataColumn[], projectionOrdering: number[], roles: string[]): MetadataColumnAndProjectionIndex[];
    }
}

declare module powerbi {
    interface IColorAllocator {
        /** Computes the color corresponding to the provided value. */
        color(value: PrimitiveValue): string;
    }
    interface IColorAllocatorFactory {
        /** Creates a gradient that that transitions between two colors. */
        linearGradient2(options: LinearGradient2): IColorAllocator;
        /** Creates a gradient that that transitions between three colors. */
        linearGradient3(options: LinearGradient3, splitScales: boolean): IColorAllocator;
    }
}

declare module powerbi.data {
    interface CompiledDataViewRoleBindMappingWithReduction extends CompiledDataViewRoleBindMapping, HasReductionAlgorithm {
    }
    interface CompiledDataViewRoleForMappingWithReduction extends CompiledDataViewRoleForMapping, HasReductionAlgorithm {
    }
}

declare module powerbi.data {
    module DataRoleHelper {
        function getMeasureIndexOfRole(grouped: DataViewValueColumnGroup[], roleName: string): number;
        function getCategoryIndexOfRole(categories: DataViewCategoryColumn[], roleName: string): number;
        function hasRole(column: DataViewMetadataColumn, name: string): boolean;
        function hasRoleInDataView(dataView: DataView, name: string): boolean;
        function hasRoleInValueColumn(valueColumn: DataViewValueColumn, name: string): boolean;
    }
}

declare module powerbi.data {
    function createIDataViewCategoricalReader(dataView: DataView): IDataViewCategoricalReader;
    interface IDataViewCategoricalReader {
        hasCategories(): boolean;
        getCategoryCount(): number;
        getCategoryValues(roleName: string): any;
        getCategoryValue(roleName: string, categoryIndex: number): any;
        getCategoryColumn(roleName: string): DataViewCategoryColumn;
        getCategoryMetadataColumn(roleName: string): DataViewMetadataColumn;
        getCategoryColumnIdentityFields(roleName: string): powerbi.data.ISQExpr[];
        getCategoryDisplayName(roleName: string): string;
        hasCompositeCategories(): boolean;
        hasCategoryWithRole(roleName: string): boolean;
        getCategoryObjects(roleName: string, categoryIndex: number): DataViewObjects;
        hasValues(roleName: string): boolean;
        hasHighlights(roleName: string): boolean;
        /**
         * Obtains the value for the given role name, category index, and series index.
         *
         * Note: in cases where have multiple values in a role where the multiple values
         * are not being used to create a static series, the first is obtained. (this is
         * a rare case)
         */
        getValue(roleName: string, categoryIndex: number, seriesIndex?: number): any;
        /**
         * Obtains the highlighted value for the given role name, category index, and series index.
         *
         * Note: in cases where have multiple values in a role where the multiple values
         * are not being used to create a static series, the first is obtained. (this is
         * a rare case)
         */
        getHighlight(roleName: string, categoryIndex: number, seriesIndex?: number): any;
        /**
         * Obtains all the values for the given role name, category index, and series index, drawing
         * from each of the value columns at that intersection.  Used when you have multiple
         * values in a role that are not conceptually a static series.
         */
        getAllValuesForRole(roleName: string, categoryIndex: number, seriesIndex?: number): any[];
        /**
        * Obtains all meta data for the given role name, category index, and series index, drawing
        * from each of the value columns at that intersection.  Used when you have multiple
        * values in a role that are not conceptually a static series.
        */
        getAllValueMetadataColumnsForRole(roleName: string, seriesIndex?: number): DataViewMetadataColumn[];
        /**
         * Obtains all the highlight values for the given role name, category index, and series index, drawing
         * from each of the value columns at that intersection.  Used when you have multiple
         * values in a role that are not conceptually a static series.
         */
        getAllHighlightsForRole(roleName: string, categoryIndex: number, seriesIndex?: number): any[];
        /**
         * Obtains the first non-null value for the given role name and category index.
         * It should mainly be used for values that are expected to be the same across
         * series, but avoids false nulls when the data is sparse.
         */
        getFirstNonNullValueForCategory(roleName: string, categoryIndex: number): any;
        getMeasureQueryName(roleName: string): string;
        getValueColumn(roleName: string, seriesIndex?: number): DataViewValueColumn;
        getValueMetadataColumn(roleName: string, seriesIndex?: number): DataViewMetadataColumn;
        getValueDisplayName(roleName: string, seriesIndex?: number): string;
        hasDynamicSeries(): boolean;
        /**
         * Get the series count.  This requires a value role name for cases where you may
         * have a static series, but is not required if the only series you expect are dynamic
         * or single series.
         *
         * @param valueRoleName The role of the value for which a static series may exist
         */
        getSeriesCount(valueRoleName?: string): number;
        getSeriesObjects(seriesIndex: number): DataViewObjects;
        getSeriesValueColumns(): DataViewValueColumns;
        getSeriesValueColumnGroup(seriesIndex: number): DataViewValueColumnGroup;
        getSeriesMetadataColumn(): DataViewMetadataColumn;
        getSeriesColumnIdentityFields(): powerbi.data.ISQExpr[];
        getSeriesName(seriesIndex: number): PrimitiveValue;
        getSeriesDisplayName(): string;
        getStaticObjects(): DataViewObjects;
    }
}

declare module powerbi.data {
    module DataViewConcatenateCategoricalColumns {
        function detectAndApply(dataView: DataView, objectDescriptors: DataViewObjectDescriptors, applicableRoleMappings: DataViewMapping[], projectionOrdering: DataViewProjectionOrdering, projectionActiveItems: DataViewProjectionActiveItems): DataView;
        /** For applying concatenation to the DataViewCategorical that is the data for one of the frames in a play chart. */
        function applyToPlayChartCategorical(metadata: DataViewMetadata, objectDescriptors: DataViewObjectDescriptors, categoryRoleName: string, categorical: DataViewCategorical): DataView;
    }
}

declare module powerbi {
    module DataViewMapping {
        /**
         * Returns dataViewMapping.usage.regression if defined.  Else, returns undefined.
         */
        function getRegressionUsage(dataViewMapping: DataViewMapping): _.Dictionary<DataViewObjectPropertyIdentifier>;
        /**
         * Returns the role names returned by the specified rolesGetter if they are the same for all specified roleMappings.
         * Else, returns undefined.
         *
         * @rolesGetter returns all the roles in one of the grouping hierarchy axes (categories or series) or in the measures.
         */
        function getRolesIfSameInAllCategoricalMappings(categoricalRoleMappings: DataViewCategoricalMapping[], rolesGetter: (DataViewCategoricalMapping) => string[]): string[];
        /**
         * Returns the array of role names that are mapped to categorical categories.
         * Returns an empty array if none exists.
         */
        function getAllRolesInCategories(categoricalRoleMapping: DataViewCategoricalMapping): string[];
    }
}

declare module powerbi {
    const enum RoleItemContext {
        CategoricalValue = 0,
        CategoricalValueGroup = 1,
    }
    interface IDataViewMappingVisitor {
        visitRole(role: string, context?: RoleItemContext): void;
        visitReduction?(reductionAlgorithm?: ReductionAlgorithm): void;
    }
    module DataViewMapping {
        function visitMapping(mapping: DataViewMapping, visitor: IDataViewMappingVisitor): void;
        function visitCategorical(mapping: DataViewCategoricalMapping, visitor: IDataViewMappingVisitor): void;
        function visitCategoricalCategories(mapping: DataViewRoleMappingWithReduction | DataViewListRoleMappingWithReduction, visitor: IDataViewMappingVisitor): void;
        function visitCategoricalValues(mapping: DataViewRoleMapping | DataViewGroupedRoleMapping | DataViewListRoleMapping, visitor: IDataViewMappingVisitor): void;
        function visitTable(mapping: DataViewTableMapping, visitor: IDataViewMappingVisitor): void;
        /**
         * For visiting DataViewMatrixMapping.rows, DataViewMatrixMapping.columns, or DataViewMatrixMapping.values.
         *
         * @param mapping Can be one of DataViewMatrixMapping.rows, DataViewMatrixMapping.columns, or DataViewMatrixMapping.values.
         * @param visitor The visitor.
         */
        function visitMatrixItems(mapping: DataViewRoleForMappingWithReduction | DataViewListRoleMappingWithReduction, visitor: IDataViewMappingVisitor): void;
        function visitTreeNodes(mapping: DataViewRoleForMappingWithReduction, visitor: IDataViewMappingVisitor): void;
        function visitTreeValues(mapping: DataViewRoleForMapping, visitor: IDataViewMappingVisitor): void;
        function visitGrouped(mapping: DataViewGroupedRoleMapping, visitor: IDataViewMappingVisitor): void;
    }
}

declare module powerbi.data {
    interface DataViewNormalizeValuesApplyOptions {
        dataview: DataView;
        dataViewMappings: DataViewMapping[];
        dataRoles: VisualDataRole[];
    }
    /**
     * Interface of a function for deciding whether a column is tied to any role that has required type(s).
     *
     * @param columnIndex the position of the column in the select statement, i.e. the same semantic as the index property on the DataViewMetadataColumn interface.
     * @returns true iff the column in the specified columnIndex is tied to any role that has required type(s), i.e. if the value in that column potentially needs to get normalized.
     */
    interface IMetadataColumnFilter {
        (columnIndex: number): boolean;
    }
    /**
     * Returns true iff the specified value is of matching type as required by the role assigned to the column associated with this filter object.
     */
    interface IColumnValueFilter {
        (value: any): boolean;
    }
    /**
     * Interface of a function for deciding whether a value needs to be normalized due to not having a matching type as required by a role tied to the column associated with the specified columnIndex.
     *
     * @param columnIndex the position of the column in the select statement, i.e. the same semantic as the index property on the DataViewMetadataColumn interface.
     * @returns false iff the specified value needs to be normalized due to not having a matching type as required by a role tied to the column associated with the specified columnIndex.
     */
    interface IValueFilter {
        (columnIndex: number, value: any): boolean;
    }
    module DataViewNormalizeValues {
        function apply(options: DataViewNormalizeValuesApplyOptions): void;
        function filterVariantMeasures(dataview: DataView, dataViewMappings: DataViewMapping[], rolesToNormalize: VisualDataRole[]): void;
        function generateMetadataColumnFilter(columns: DataViewMetadataColumn[], rolesToNormalize: VisualDataRole[]): IMetadataColumnFilter;
        function generateValueFilter(columns: DataViewMetadataColumn[], rolesToNormalize: VisualDataRole[]): IValueFilter;
        function getColumnRequiredTypes(column: DataViewMetadataColumn, rolesToNormalize: VisualDataRole[]): ValueType[];
        function normalizeVariant<T>(object: T, key: string | number, columnIndex: number, valueFilter: IValueFilter): T;
    }
}

declare module powerbi {
    module DataViewObjects {
        /** Gets the value of the given object/property pair. */
        function getValue<T>(objects: DataViewObjects, propertyId: DataViewObjectPropertyIdentifier, defaultValue?: T): T;
        /** Gets an object from objects. */
        function getObject(objects: DataViewObjects, objectName: string, defaultValue?: DataViewObject): DataViewObject;
        /** Gets a map of user-defined objects. */
        function getUserDefinedObjects(objects: DataViewObjects, objectName: string): DataViewObjectMap;
        /** Gets the solid color from a fill property. */
        function getFillColor(objects: DataViewObjects, propertyId: DataViewObjectPropertyIdentifier, defaultColor?: string): string;
        /** Returns true if the given object represents a collection of user-defined objects */
        function isUserDefined(objectOrMap: DataViewObject | DataViewObjectMap): boolean;
    }
    module DataViewObject {
        function getValue<T>(object: DataViewObject, propertyName: string, defaultValue?: T): T;
        /** Gets the solid color from a fill property using only a propertyName */
        function getFillColorByPropertyName(objects: DataViewObjects, propertyName: string, defaultColor?: string): string;
    }
}

declare module powerbi.data {
    /** Defines the values for particular objects. */
    interface DataViewObjectDefinitions {
        [objectName: string]: DataViewObjectDefinition[];
    }
    interface DataViewObjectDefinition {
        selector?: Selector;
        properties: DataViewObjectPropertyDefinitions;
    }
    interface DataViewObjectPropertyDefinitions {
        [name: string]: DataViewObjectPropertyDefinition;
    }
    type DataViewObjectPropertyDefinition = SQExpr | StructuralObjectDefinition;
    module DataViewObjectDefinitions {
        /** Creates or reuses a DataViewObjectDefinition for matching the given objectName and selector within the defns. */
        function ensure(defns: DataViewObjectDefinitions, objectName: string, selector: Selector): DataViewObjectDefinition;
        /**
         * Delete a object definition from Defns if it matches objName + selector
         * @param {DataViewObjectDefinitions} defns
         * @param {string} objectName
         * @param {Selector} selector
         */
        function deleteObjectDefinition(defns: DataViewObjectDefinitions, objectName: string, selector: Selector): boolean;
        /**
         * Removes every property defined in targetDefns from sourceDefns if exists.
         * Properties are matches using ObjectName, Selector, and PropertyName.
         * @param {DataViewObjectDefinition} targetDefns Defenitions to remove properties from
         * @param {DataViewObjectDefinition} sourceDefns Defenitions to match properties against
         */
        function deleteProperties(targetDefns: DataViewObjectDefinitions, sourceDefns: DataViewObjectDefinitions): void;
        /**
         * Fills in missing properties with default ones, mutating the first definitions.
         * Properties are matched agains defaultDefns using ObjectName, Selector, and PropertyName.
         * It just fills missing properties, it doesn't overwrite existing ones.
         * Any property already in targetDefns will not change.
         * Any property in defaultDefns but not in targetDefns will be added by reference.
         * @param {DataViewObjectDefinitions} targetDefns Default definitions. Will be mutated. Expected to be defined
         * @param {DataViewObjectDefinitions} defaultDefns Definitions to fill inside targetDefns
         */
        function extend(targetDefns: DataViewObjectDefinitions, defaultDefns: DataViewObjectDefinitions): void;
        /**
         * Delete the first matching property from the Defns if it matches objName + selector + propertyName
         * @param {DataViewObjectDefinitions} defns
         * @param {string} objectName
         * @param {Selector} selector
         * @param {string} propertyName
         */
        function deleteProperty(defns: DataViewObjectDefinitions, objectName: string, selector: Selector, propertyName: string): void;
        /**
         *
         * @param {DataViewObjectDefinitions} defns
         * @param {DataViewObjectPropertyIdentifier} propertyId
         * @param {Selector} selector
         * @param {DataViewObjectPropertyDefinition} value
         */
        function setValue(defns: DataViewObjectDefinitions, propertyId: DataViewObjectPropertyIdentifier, selector: Selector, value: DataViewObjectPropertyDefinition): void;
        /**
         *
         * @param {DataViewObjectDefinitions} defns
         * @param {DataViewObjectPropertyIdentifier} propertyId
         * @param {Selector} selector
         * @returns
         */
        function getValue(defns: DataViewObjectDefinitions, propertyId: DataViewObjectPropertyIdentifier, selector: Selector): DataViewObjectPropertyDefinition;
        function getPropertyContainer(defns: DataViewObjectDefinitions, propertyId: DataViewObjectPropertyIdentifier, selector: Selector): DataViewObjectPropertyDefinitions;
        /**
         * Get the first DataViewObjectDefinition that match selector and objectName
         * @param {DataViewObjectDefinitions} defns DataViewObjectDefinitions to search
         * @param {string} objectName objectName to match
         * @param {Selector} selector selector to match
         * @returns The first match, if any. If no match, returns undefined
         */
        function getObjectDefinition(defns: DataViewObjectDefinitions, objectName: string, selector: Selector): DataViewObjectDefinition;
        function propertiesAreEqual(a: DataViewObjectPropertyDefinition, b: DataViewObjectPropertyDefinition): boolean;
        function allPropertiesAreEqual(a: DataViewObjectPropertyDefinitions, b: DataViewObjectPropertyDefinitions): boolean;
        function encodePropertyValue(value: DataViewPropertyValue, valueTypeDescriptor: ValueTypeDescriptor): DataViewObjectPropertyDefinition;
        function clone(original: DataViewObjectDefinitions): DataViewObjectDefinitions;
    }
    module DataViewObjectDefinition {
        function deleteSingleProperty(defn: DataViewObjectDefinition, propertyName: string): void;
    }
}

declare module powerbi.data {
    module DataViewObjectDescriptors {
        /** Attempts to find the format string property.  This can be useful for upgrade and conversion. */
        function findFormatString(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier;
        /** Attempts to find the filter property.  This can be useful for propagating filters from one visual to others. */
        function findFilterOutput(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier;
        /** Attempts to find the self filter property. */
        function findSelfFilter(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier;
        function isSelfFilter(descriptor: DataViewObjectPropertyDescriptor): boolean;
        /** Attempts to find the self filter enabled property. */
        function findSelfFilterEnabled(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier;
        /** Attempts to find the default value property.  This can be useful for propagating schema default value. */
        function findDefaultValue(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier;
    }
}

declare module powerbi.data {
    interface DataViewObjectDefinitionsByRepetition {
        metadataOnce?: DataViewObjectDefinitionsForSelector;
        userDefined?: DataViewObjectDefinitionsForSelector[];
        metadata?: DataViewObjectDefinitionsForSelector[];
        data: DataViewObjectDefinitionsForSelectorWithRule[];
    }
    interface DataViewObjectDefinitionsForSelector {
        selector?: Selector;
        objects: DataViewNamedObjectDefinition[];
    }
    interface DataViewObjectDefinitionsForSelectorWithRule extends DataViewObjectDefinitionsForSelector {
        rules?: RuleEvaluation[];
    }
    interface DataViewNamedObjectDefinition {
        name: string;
        properties: DataViewObjectPropertyDefinitions;
    }
    module DataViewObjectEvaluationUtils {
        function evaluateDataViewObjects(evalContext: IEvalContext, objectDescriptors: DataViewObjectDescriptors, objectDefns: DataViewNamedObjectDefinition[]): DataViewObjects;
        function groupObjectsBySelector(objectDefinitions: DataViewObjectDefinitions): DataViewObjectDefinitionsByRepetition;
        function addImplicitObjects(objectsForAllSelectors: DataViewObjectDefinitionsByRepetition, objectDescriptors: DataViewObjectDescriptors, columns: DataViewMetadataColumn[], selectTransforms: DataViewSelectTransform[]): void;
    }
}

declare module powerbi.data {
    /** Responsible for evaluating object property expressions to be applied at various scopes in a DataView. */
    module DataViewObjectEvaluator {
        function run(evalContext: IEvalContext, objectDescriptor: DataViewObjectDescriptor, propertyDefinitions: DataViewObjectPropertyDefinitions): DataViewObject;
        /** Note: Exported for testability */
        function evaluateProperty(evalContext: IEvalContext, propertyDescriptor: DataViewObjectPropertyDescriptor, propertyDefinition: DataViewObjectPropertyDefinition): any;
        function evaluateValue(evalContext: IEvalContext, definition: SQExpr | RuleEvaluation, valueType: ValueType): any;
    }
}
declare module powerbi.data {
    /** Responsible for evaluating and setting DataViewCategorical's values grouped() function. */
    module DataViewCategoricalEvalGrouped {
        function apply(categorical: DataViewCategorical): void;
    }
}
declare module powerbi.data {
    import DataViewMatrix = powerbi.DataViewMatrix;
    module DataViewMatrixProjectionOrder {
        function apply(prototype: DataViewMatrix, matrixMapping: DataViewMatrixMapping, projectionOrdering: DataViewProjectionOrdering, context: MatrixTransformationContext): DataViewMatrix;
    }
}

declare module powerbi.data {
    module DataViewPivotCategorical {
        /**
         * Pivots categories in a categorical DataView into valueGroupings.
         * This is akin to a mathematical matrix transpose.
         */
        function apply(dataView: DataView): DataView;
    }
}

declare module powerbi.data {
    module DataViewPivotMatrix {
        /** Pivots row hierarchy members in a matrix DataView into column hierarchy. */
        function apply(dataViewMatrix: DataViewMatrix, context: MatrixTransformationContext): void;
        function cloneTree(node: DataViewMatrixNode): DataViewMatrixNode;
        function cloneTreeExecuteOnLeaf(node: DataViewMatrixNode, callback?: (node: DataViewMatrixNode) => void): DataViewMatrixNode;
    }
}

declare module powerbi.data {
    module DataViewSelfCrossJoin {
        /**
         * Returns a new DataView based on the original, with a single DataViewCategorical category that is "cross joined"
         * to itself as a value grouping.
         * This is the mathematical equivalent of taking an array and turning it into an identity matrix.
         */
        function apply(dataView: DataView): DataView;
    }
}

declare module powerbi.data {
    module DataViewPivotCategoricalToPrimaryGroups {
        /**
         * If mapping requests cross axis data reduction and the binding has secondary grouping, mutates the binding to
         * pivot the secondary before the primary.
         */
        function pivotBinding(binding: DataShapeBinding, allMappings: CompiledDataViewMapping[], finalMapping: CompiledDataViewMapping, defaultDataVolume: number): void;
        function unpivotResult(oldDataView: DataView, selects: DataViewSelectTransform[], roleKindByQueryRef: DataViewAnalysis.RoleKindByQueryRef, queryProjectionsByRole: QueryProjectionsByRole, applicableRoleMappings: DataViewMapping[]): DataView;
    }
}
declare module powerbi.data {
    import RoleKindByQueryRef = powerbi.DataViewAnalysis.RoleKindByQueryRef;
    /**
     * A property bag containing information about a DataViewTransform session, including input arguments and some values derived from the input arguments.
     *
     * This interface is part of the internal implementation of DataViewTransform and is subject to frequent changes.
     *
     * All properties in this context interface are agnostic to any specific "split" in the transform.
     * E.g. DataViewTransformContext.transforms.splits has the select indices in each split, but an instance of this context is not tied to a particular split.
     *
     * Also, DataViewTransformContext does not include a property for the dataView object(s) in transformation, because almost all of the existing DataViewTransform functions
     * handles one dataView at a time, and DataViewTransformContext should not have a property containing the dataView for a specific split.
     *
     * And to avoid confusion, this DataViewTransformContext does not include a property for the visual dataView, because almost all functions in DataViewTransform
     * are chained together by taking the output DataView from one function and use it as the input of the next.  It never needs to get back to the very original prototype.
     *
     * ////////////////////////////////////////////////////////////////////////////////////////////////////////////
     * 2016/06/29 Notes about visualCapabilitiesRoleMappings/visualCapabilitiesDataViewKinds vs. applicableRoleMappings/applicableDataViewKinds:
     *
     * - Short version -
     * For the time being, use visualCapabilitiesRoleMappings/visualCapabilitiesDataViewKinds for the essential transforms that would otherwise
     * crash the visuals code if not performed (such as DataViewTransform.transformSelects()).
     *
     * Use applicableRoleMappings/applicableDataViewKinds for the more advanced transforms that procude the correct visual dataView (such as categorical concatentation).
     *
     * - Long version -
     * visualCapabilitiesRoleMappings is the full list of role mappings as specified in Visual Capabilities, whereas applicableRoleMappings is the
     * actual applicable one(s) based on the select fields in each of the role buckets.
     *
     * There is a bug (VSTS 7427800) in DataViewTransformActionsSerializer such that some DataViewTransformActions converted from VisualElements will contain incorrect values.
     *
     * With incorrect DataViewTransformActions input, DataViewAnalysis cannot possibly compute the correct applicableRoleMappings, and hence the
     * visual dataView from DataViewTransform will be incorrect.  This is why sometimes when you open a report in PBI Portal, the initial rendering of some visuals
     * are incorrect (most frequently on combo chart).
     *
     * However, no one has fixed or complained about it yet because the visuals will automatically re-render correctly within a couple seconds, thanks to the
     * automatic query re-generation and re-execution that always follow after the initial rendering.  The DataViewTransformActions from this re-generated query
     * will be correct and the visuals will then render with the correctly transformed visual dataView.
     *
     * Because of the above, the existing DataViewTransform code thus far has never relied on applicableRoleMappings for deciding whether to perform the very essential transforms
     * such as DataViewTransform.transformSelects(), because without which the dataView will be missing some important properties and will lead to crashes in visuals code.
     * As long as the relevant dataView kind is in visualCapabilitiesDataViewKinds, those transform operations will get carried out, even if it is not in applicableDataViewKinds.
     *
     * Unfortunately, there are also some transform operations that requires applicableRoleMappings, and hence DataViewTransformContext has both sets of properties for now.
     *
     * When the bug in DataViewTransformActionsSerializer gets fixed and DataViewTransformActions is always correct,
     * then visualCapabilitiesRoleMappings/visualCapabilitiesDataViewKinds can be completely replaced by applicableRoleMappings/applicableDataViewKinds in DataViewTransform.
     */
    interface DataViewTransformContext {
        /**
         * The metadata property of the query DataView.
         */
        queryDataViewMetadata: DataViewMetadata;
        /**
         * From Visual Capabilities.  Can be undefined.
         */
        objectDescriptors?: DataViewObjectDescriptors;
        /**
         * From Visual Capabilities.  Can be undefined.
         */
        dataRoles?: VisualDataRole[];
        transforms: DataViewTransformActions;
        colorAllocatorFactory: IColorAllocatorFactory;
        /**
         * The select transforms for this DataViewTransform session.
         * This property contains the same object as this.transforms.selects.
         *
         * Can be undefined or empty.  Can contain undefined elements.
         */
        selectTransforms?: DataViewSelectTransform[];
        /** This property contains the same object as this.transforms.roles.ordering.  Can be undefined. */
        projectionOrdering?: DataViewProjectionOrdering;
        /** This property contains the same object as this.transforms.roles.activeItems.  Can be undefined. */
        projectionActiveItems?: DataViewProjectionActiveItems;
        /** The mapping from queryRef to VisualDataRoleKind value (Grouping, Measure, etc), computed from query DataView's metadata. */
        roleKindByQueryRef: RoleKindByQueryRef;
        /** The mapping from role name to query projection. */
        queryProjectionsByRole: QueryProjectionsByRole;
        /**
         * The full list of possible target dataView kinds in this DataViewTransform session, as specified in Visual Capabilities role mappings.
         *
         * Can be undefined.
         *
         * Note: When applicableRoleMappings becomes reliable, all usages of this property should use applicableRoleMappings instead.
         */
        visualCapabilitiesRoleMappings?: DataViewMapping[];
        /**
         * All possible target dataView kinds in this DataViewTransform session, which is taken from all possible dataView kinds listed in visual capabilities role mapping.
         *
         * Note: When applicableDataViewKinds becomes reliable, all usages of this property should use applicableDataViewKinds instead.
         */
        visualCapabilitiesDataViewKinds: StandardDataViewKinds;
        /**
         * The applicable DataViewMappings for this transform, as computed by DataViewAnalysis.
         * This property is undefined if there is no supported DataViewMappings for the other specified inputs.
         *
         * Note: There is currently a bug in DataViewTransformActionsSerializer that leads to incorrect DataViewTransformActions.
         * As a result, this property can contain incorrect value until the query is regenerated and this property recomputed.
         */
        applicableRoleMappings?: DataViewMapping[];
        /**
         * The applicable dataView kinds of this DataViewTransform session, as computed from applicableRoleMappings.
         *
         * Note: There is currently a bug in DataViewTransformActionsSerializer that leads to incorrect DataViewTransformActions.
         * As a result, this property can contain incorrect value until the query is regenerated and this property recomputed.
         */
        applicableDataViewKinds: StandardDataViewKinds;
    }
    module DataViewTransformContext {
        /**
         * Creates an object that all properties in the DataViewTransformContext interface.
         *
         * @param queryDataViewMetadata The metadata property of the query DataView.
         * @param objectDescriptors From Visual Capabilities.  Can be undefined.
         * @param dataViewMappings From Visual Capabilities.  Can be undefined.
         * @param dataRoles From Visual Capabilities.  Can be undefined.
         * @param transforms
         * @param colorAllocatorFactory
         */
        function create(queryDataViewMetadata: DataViewMetadata, objectDescriptors: DataViewObjectDescriptors, dataViewMappings: DataViewMapping[], dataRoles: VisualDataRole[], transforms: DataViewTransformActions, colorAllocatorFactory: IColorAllocatorFactory): DataViewTransformContext;
    }
}
declare module powerbi.data {
    import INumberDictionary = jsCommon.INumberDictionary;
    /**
     * Responsible for applying projection order and split selects to DataViewCategorical.
     * If the specified prototype DataView needs to get transformed, the transformed DataView will be returned.
     * Else, the prototype DataView itself will be returned.
     */
    module DataViewCategoricalProjectionOrder {
        function apply(prototype: DataView, applicableRoleMappings: DataViewMapping[], projectionOrdering: DataViewProjectionOrdering, splitSelects: INumberDictionary<boolean>): DataView;
    }
}

declare module powerbi.data {
    function createDisplayNameGetter(displayNameKey: string): (IStringResourceProvider) => string;
    function getDisplayName(displayNameGetter: data.DisplayNameGetter, resourceProvider: jsCommon.IStringResourceProvider): string;
}

declare module powerbi.data {
    /** Represents a data reader. */
    interface IDataReader {
        /** Executes a query, with a promise of completion.  The response object should be compatible with the transform implementation. */
        execute?(options: DataReaderExecutionOptions): RejectablePromise2<DataReaderData, IClientError>;
        /** Transforms the given data into a DataView.  When this function is not specified, the data is put on a property on the DataView. */
        transform?(obj: DataReaderData): DataReaderTransformResult;
        /** Stops all future communication and reject and pending communication  */
        stopCommunication?(): void;
        /** Resumes communication which enables future requests */
        resumeCommunication?(): void;
        /** Clear cache */
        clearCache?(dataSource: DataReaderDataSource): void;
        /** rewriteCacheEntries */
        rewriteCacheEntries?(dataSource: DataReaderDataSource, rewriter: DataReaderCacheRewriter): void;
        /** Sets the result into the local cache */
        setLocalCacheResult?(options: DataReaderExecutionOptions, dataAsObject: DataReaderData): void;
    }
    /** Represents a query generator. */
    interface IQueryGenerator {
        /** Query generation function to convert a (prototype) SemanticQuery to a runnable query command. */
        execute(options: QueryGeneratorOptions): QueryGeneratorResult;
    }
    interface IFederatedConceptualSchemaReader {
        /** Executes a request for conceptual schema with a promise of completion. */
        execute(options: FederatedConceptualSchemaReaderOptions): IPromise<FederatedConceptualSchemaResponse>;
        /** Transforms the given data into a FederatedConceptualSchema. */
        transform(obj: FederatedConceptualSchemaResponse): SchemaReaderTransformResult;
    }
    /** Represents a custom data reader plugin, to be registered in the powerbi.data.plugins object. */
    interface IDataReaderPlugin {
        /** The name of this plugin. */
        name: string;
        /** Factory method for the IDataReader. */
        reader(hostServices: IDataReaderHostServices): IDataReader;
        /** Factory method for the IQueryGenerator. */
        queryGenerator?(): IQueryGenerator;
        /** Factory method for the IFederatedConceptualSchemaReader. */
        schemaReader?(hostServices: IDataReaderHostServices): IFederatedConceptualSchemaReader;
    }
    interface QueryGeneratorOptions {
        query: SemanticQuery;
        mappings: CompiledDataViewMapping[];
        additionalProjections?: AdditionalQueryProjection[];
        highlightFilter?: SemanticFilter;
        restartToken?: RestartToken;
        dataWindow?: QueryGeneratorDataWindow;
    }
    interface AdditionalQueryProjection {
        queryName: string;
        selector: Selector;
        aggregates?: ProjectionAggregates;
        joinPredicate?: JoinPredicateBehavior;
    }
    interface ProjectionAggregates {
        min?: boolean;
        max?: boolean;
        percentiles?: ProjectionPercentileAggregate[];
        median?: boolean;
        average?: boolean;
    }
    interface ProjectionPercentileAggregate {
        exclusive?: boolean;
        k: number;
    }
    interface QueryGeneratorResult {
        command: DataReaderQueryCommand;
        splits?: DataViewSplitTransform[];
        /**
         * If the query generator needs to rewrite the input query, this property will contain information about the important changes.
         *
         * Any rewrite done by query generator should be internal to the particular query generator, but in some rare cases this information
         * is needed in order for other components to correctly consume the query result.
         */
        queryRewrites?: QueryRewriteRecordContainer[];
    }
    /**
     * In each instance of QueryRewriteRecordContainer, exactly one of the optional properties will be populated with change record.
     */
    interface QueryRewriteRecordContainer {
        selectExprAdded?: QueryRewriteSelectExprAddedRecord;
        aggregatesAdded?: QueryRewriteSelectExprAggregatesAddedRecord;
        projectionQueryRefChanged?: QueryRewriteProjectionQueryRefChangedRecord;
    }
    /** Indicates a new SQExpr got added at a particular index. */
    interface QueryRewriteSelectExprAddedRecord {
        selectIndex: number;
        namedSQExpr: NamedSQExpr;
    }
    interface QueryRewriteSelectExprAggregatesAddedRecord {
        originalQueryRef: string;
        aggregates: QueryRewriteAddedAggregates;
    }
    interface QueryRewriteAddedAggregates {
        min?: QueryRewriteAddedAggregateSource;
        max?: QueryRewriteAddedAggregateSource;
    }
    interface QueryRewriteAddedAggregateSource {
        index: number;
        expr: SQExpr;
    }
    /** Indicates a queryRef in the query projection for a particular role got changed. */
    interface QueryRewriteProjectionQueryRefChangedRecord {
        /** The role for which a queryRef in the query projection got changed. */
        role: string;
        /** The original queryRef. */
        oldQueryRef: string;
        /** The new, internal queryRef. */
        newInternalQueryRef: string;
    }
    interface DataReaderTransformResult {
        dataView?: DataView;
        restartToken?: RestartToken;
        error?: IClientError;
        warning?: IClientWarning;
        /** A value of true in this property indicates that the DataReaderData object from which this result is generated should not get persisted as contract cache nor server cache. */
        disallowPersisting?: boolean;
    }
    interface QueryGeneratorDataWindow {
    }
    interface RestartToken {
    }
    interface DataReaderQueryCommand {
    }
    /** Represents a query command defined by an IDataReader. */
    interface DataReaderCommand {
    }
    /** Represents a data source defined by an IDataReader. */
    interface DataReaderDataSource {
    }
    /** Represents arbitrary data defined by an IDataReader. */
    interface DataReaderData {
    }
    /** Represents cacheRewriter that will rewrite the cache of reader as defined by an IDataReader. */
    interface DataReaderCacheRewriter {
    }
    interface DataReaderExecutionOptions {
        dataSource?: DataReaderDataSource;
        command: DataReaderCommand;
        allowCache?: boolean;
        allowClientSideFilters?: boolean;
        cacheResponseOnServer?: boolean;
        ignoreViewportForCache?: boolean;
    }
    interface FederatedConceptualSchemaReaderOptions {
        dataSources: ConceptualSchemaReaderDataSource[];
    }
    interface ConceptualSchemaReaderDataSource {
        id: number;
        /** Specifies the name used in Semantic Queries to reference this DataSource. */
        name: string;
        /** Specifies the type of IDataReaderPlugin. */
        type?: string;
    }
    interface FederatedConceptualSchemaResponse {
        data: FederatedConceptualSchemaData;
    }
    interface FederatedConceptualSchemaData {
    }
    interface SchemaReaderTransformResult {
        schema: FederatedConceptualSchema;
        error?: SchemaReaderError;
    }
    interface SchemaReaderError {
        requestId?: string;
        serviceError?: ServiceError;
        clientError: IClientError;
    }
    interface IDataReaderHostServices {
        promiseFactory(): IPromiseFactory;
    }
}

declare module powerbi {
    /** Enumeration of DateTimeUnits */
    enum DateTimeUnit {
        Year = 0,
        Month = 1,
        Week = 2,
        Day = 3,
        Hour = 4,
        Minute = 5,
        Second = 6,
        Millisecond = 7,
    }
    interface IFormattingService {
        /**
         * Formats the value using provided format expression and culture
         * @param value - value to be formatted and converted to string.
         * @param format - format to be applied. If undefined or empty then generic format is used.
         */
        formatValue(value: any, format?: string): string;
        /**
         * Replaces the indexed format tokens (for example {0:c2}) in the format string with the localized formatted arguments.
         * @param formatWithIndexedTokens - format string with a set of indexed format tokens.
         * @param args - array of values which should replace the tokens in the format string.
         * @param culture - localization culture. If undefined then the current culture is used.
         */
        format(formatWithIndexedTokens: string, args: any[], culture?: string): string;
        /** Gets a value indicating whether the specified format a standard numeric format specifier. */
        isStandardNumberFormat(format: string): boolean;
        /** Performs a custom format with a value override.  Typically used for custom formats showing scaled values. */
        formatNumberWithCustomOverride(value: number, format: string, nonScientificOverrideFormat: string): string;
        /** Gets the format string to use for dates in particular units. */
        dateFormatString(unit: DateTimeUnit): string;
    }
}

declare module powerbi.data {
    /** Represents common expression patterns for 'field' expressions such as columns, column aggregates, measures, etc. */
    interface FieldExprPattern {
        column?: FieldExprColumnPattern;
        columnAggr?: FieldExprColumnAggrPattern;
        columnHierarchyLevelVariation?: FieldExprColumnHierarchyLevelVariationPattern;
        entity?: FieldExprEntityPattern;
        entityAggr?: FieldExprEntityAggrPattern;
        hierarchy?: FieldExprHierarchyPattern;
        hierarchyLevel?: FieldExprHierarchyLevelPattern;
        hierarchyLevelAggr?: FieldExprHierarchyLevelAggrPattern;
        measure?: FieldExprMeasurePattern;
        percentile?: FieldExprPercentilePattern;
        percentOfGrandTotal?: FieldExprPercentOfGrandTotalPattern;
        selectRef?: FieldExprSelectRefPattern;
    }
    /** By design there is no default, no-op visitor. Components concerned with patterns need to be aware of all patterns as they are added. */
    interface IFieldExprPatternVisitor<T> {
        visitColumn(column: FieldExprColumnPattern): T;
        visitColumnAggr(columnAggr: FieldExprColumnAggrPattern): T;
        visitColumnHierarchyLevelVariation(columnHierarchyLevelVariation: FieldExprColumnHierarchyLevelVariationPattern): T;
        visitEntity(entity: FieldExprEntityPattern): T;
        visitEntityAggr(entityAggr: FieldExprEntityAggrPattern): T;
        visitHierarchy(hierarchy: FieldExprHierarchyPattern): T;
        visitHierarchyLevel(hierarchyLevel: FieldExprHierarchyLevelPattern): T;
        visitHierarchyLevelAggr(hierarchyLevelAggr: FieldExprHierarchyLevelAggrPattern): T;
        visitMeasure(measure: FieldExprMeasurePattern): T;
        visitPercentile(percentile: FieldExprPercentilePattern): T;
        visitPercentOfGrandTotal(percentOfGrandTotal: FieldExprPercentOfGrandTotalPattern): T;
        visitSelectRef(selectRef: FieldExprSelectRefPattern): T;
    }
    interface FieldExprEntityPattern {
        schema: string;
        entity: string;
        entityVar?: string;
    }
    interface FieldExprEntityItemPattern extends FieldExprEntityPattern {
    }
    interface FieldExprEntityPropertyPattern extends FieldExprEntityItemPattern {
        name: string;
    }
    type FieldExprColumnPattern = FieldExprEntityPropertyPattern;
    type FieldExprMeasurePattern = FieldExprEntityPropertyPattern;
    type FieldExprHierarchyPattern = FieldExprEntityPropertyPattern;
    type FieldExprPropertyPattern = FieldExprColumnPattern | FieldExprMeasurePattern | FieldExprHierarchyPattern;
    interface FieldExprEntityAggrPattern extends FieldExprEntityPattern {
        aggregate: QueryAggregateFunction;
    }
    interface FieldExprColumnAggrPattern extends FieldExprColumnPattern {
        aggregate: QueryAggregateFunction;
    }
    interface FieldExprHierarchyLevelPattern extends FieldExprEntityItemPattern {
        name: string;
        level: string;
    }
    interface FieldExprHierarchyLevelAggrPattern extends FieldExprHierarchyLevelPattern {
        aggregate: QueryAggregateFunction;
    }
    interface FieldExprColumnHierarchyLevelVariationPattern {
        source: FieldExprColumnPattern;
        level: FieldExprHierarchyLevelPattern;
        variationName: string;
    }
    interface FieldExprPercentilePattern {
        arg: FieldExprPattern;
        k: number;
        exclusive: boolean;
    }
    interface FieldExprPercentOfGrandTotalPattern {
        baseExpr: FieldExprPattern;
    }
    interface FieldExprSelectRefPattern {
        expressionName: string;
    }
    module SQExprBuilder {
        function fieldExpr(fieldExpr: FieldExprPattern): SQExpr;
        function fromColumnAggr(columnAggr: FieldExprColumnAggrPattern): SQAggregationExpr;
        function fromColumn(column: FieldExprColumnPattern): SQColumnRefExpr;
        function fromEntity(entityPattern: FieldExprEntityPattern): SQEntityExpr;
        function fromEntityAggr(entityAggr: FieldExprEntityAggrPattern): SQAggregationExpr;
        function fromHierarchyLevelAggr(hierarchyLevelAggr: FieldExprHierarchyLevelAggrPattern): SQAggregationExpr;
        function fromHierarchyLevel(hierarchyLevelPattern: FieldExprHierarchyLevelPattern): SQHierarchyLevelExpr;
        function fromHierarchy(hierarchyPattern: FieldExprHierarchyPattern): SQHierarchyExpr;
    }
    module SQExprConverter {
        function asFieldPattern(sqExpr: SQExpr, schema?: FederatedConceptualSchema): FieldExprPattern;
    }
    module FieldExprPattern {
        function visit<T>(expr: SQExpr | FieldExprPattern, visitor: IFieldExprPatternVisitor<T>): T;
        function toColumnRefSQExpr(columnPattern: FieldExprColumnPattern): SQColumnRefExpr;
        function getAggregate(fieldExpr: FieldExprPattern): QueryAggregateFunction;
        function isAggregation(fieldExpr: FieldExprPattern): boolean;
        function hasFieldExprName(fieldExpr: FieldExprPattern): boolean;
        function getPropertyName(fieldExpr: FieldExprPattern): string;
        function getHierarchyName(fieldExpr: FieldExprPattern): string;
        function getColumnRef(fieldExpr: FieldExprPattern): FieldExprPropertyPattern;
        function getFieldExprName(fieldExpr: FieldExprPattern): string;
        function getSchema(fieldExpr: FieldExprPattern): string;
        function toFieldExprEntityPattern(fieldExpr: FieldExprPattern): FieldExprEntityPattern;
        function toFieldExprEntityItemPattern(fieldExpr: FieldExprPattern): FieldExprEntityPattern;
    }
}

declare module powerbi {
    module DataViewAnalysis {
        import QueryProjectionsByRole = powerbi.data.QueryProjectionsByRole;
        import DataViewObjectDescriptors = powerbi.data.DataViewObjectDescriptors;
        import DataViewObjectDefinitions = powerbi.data.DataViewObjectDefinitions;
        interface ValidateAndReshapeResult {
            dataView?: DataView;
            isValid: boolean;
        }
        interface RoleKindByQueryRef {
            [queryRef: string]: VisualDataRoleKind;
        }
        interface DataViewMappingResult {
            supportedMappings: DataViewMapping[];
            /** A set of mapping errors if there are no supported mappings */
            mappingErrors: DataViewMappingMatchError[];
        }
        enum DataViewMappingMatchErrorCode {
            conditionRangeTooLarge = 0,
            conditionRangeTooSmall = 1,
            conditionKindExpectedMeasure = 2,
            conditionKindExpectedGrouping = 3,
            conditionKindExpectedGroupingOrMeasure = 4,
        }
        interface DataViewMappingMatchError {
            code: DataViewMappingMatchErrorCode;
            roleName: string;
            mappingIndex?: number;
            conditionIndex?: number;
        }
        /** Reshapes the data view to match the provided schema if possible. If not, returns null */
        function validateAndReshape(dataView: DataView, dataViewMappings: DataViewMapping[]): ValidateAndReshapeResult;
        function countGroups(columns: DataViewMetadataColumn[]): number;
        function countMeasures(columns: DataViewMetadataColumn[]): number;
        /** Indicates whether the dataView conforms to the specified schema. */
        function supports(dataView: DataView, roleMapping: DataViewMapping, usePreferredDataViewSchema?: boolean): boolean;
        /**
         * Determines whether the value conforms to the range in the role condition, returning undefined
         * if so or an appropriate error code if not.
         */
        function validateRange(value: number, roleCondition: RoleCondition, ignoreMin?: boolean): DataViewMappingMatchErrorCode;
        /** Determines the appropriate DataViewMappings for the projections. */
        function chooseDataViewMappings(projections: QueryProjectionsByRole, mappings: DataViewMapping[], roleKindByQueryRef: RoleKindByQueryRef, objectDescriptors?: DataViewObjectDescriptors, objectDefinitions?: DataViewObjectDefinitions): DataViewMappingResult;
        function getPropertyCount(roleName: string, projections: QueryProjectionsByRole, useActiveIfAvailable?: boolean): number;
        function hasSameCategoryIdentity(dataView1: DataView, dataView2: DataView): boolean;
        function areMetadataColumnsEquivalent(column1: DataViewMetadataColumn, column2: DataViewMetadataColumn): boolean;
        function isMetadataEquivalent(metadata1: DataViewMetadata, metadata2: DataViewMetadata): boolean;
    }
}

declare module powerbi.data {
    module DataViewRoleWildcard {
        function fromRoles(roles: string[]): DataViewRoleWildcard;
        function equals(firstRoleWildcard: DataViewRoleWildcard, secondRoleWildcard: DataViewRoleWildcard): boolean;
    }
}

declare module powerbi.data {
    module DataViewScopeWildcard {
        function matches(wildcard: DataViewScopeWildcard, instance: DataViewScopeIdentity): boolean;
        function equals(firstScopeWildcard: DataViewScopeWildcard, secondScopeWildcard: DataViewScopeWildcard): boolean;
        function fromExprs(exprs: SQExpr[]): DataViewScopeWildcard;
    }
}

declare module powerbi.data {
    interface IColorAllocatorCache {
        get(key: SQFillRuleExpr): IColorAllocator;
        register(key: SQFillRuleExpr, colorAllocator: IColorAllocator): this;
    }
    function createColorAllocatorCache(): IColorAllocatorCache;
}

declare module powerbi.data {
    /** Responsible for providing specific values to be used by expression and rule evaluation. */
    interface IEvalContext {
        getColorAllocator(expr: SQFillRuleExpr): IColorAllocator;
        getExprValue(expr: SQExpr): PrimitiveValue;
        getRoleValue(roleName: string): PrimitiveValue;
    }
}

declare module powerbi.data {
    import DataViewMapping = powerbi.DataViewMapping;
    import RoleKindByQueryRef = DataViewAnalysis.RoleKindByQueryRef;
    interface DataViewRegressionRunOptions {
        visualDataViews: DataView[];
        dataRoles: VisualDataRole[];
        objectDescriptors: DataViewObjectDescriptors;
        objectDefinitions: DataViewObjectDefinitions;
        colorAllocatorFactory: IColorAllocatorFactory;
        transformSelects: DataViewSelectTransform[];
        applicableDataViewMappings: DataViewMapping[];
        roleKindByQueryRef: RoleKindByQueryRef;
        queryProjectionsByRole: QueryProjectionsByRole;
    }
    module DataViewRegression {
        const regressionYQueryName: string;
        function run(options: DataViewRegressionRunOptions): DataView[];
        /**
         * This function will compute the linear regression algorithm on the sourceDataView and create a new dataView.
         * It works on scalar axis only.
         * The algorithm is as follows
         *
         * 1. Find the cartesian X and Y roles and the columns that correspond to those roles
         * 2. Get the data points, (X, Y) pairs, for each series, combining if needed.
         * 3. Compute the X and Y points for regression line using Y = Slope * X + Intercept
         * If highlights values are present, repeat steps 2 & 3 using highlight values.
         * 4. Create the new dataView using the points computed above
         */
        function linearRegressionTransform(sourceDataView: DataView, dataRoles: VisualDataRole[], regressionDataViewMapping: DataViewMapping, objectDescriptors: DataViewObjectDescriptors, objectDefinitions: DataViewObjectDefinitions, colorAllocatorFactory: IColorAllocatorFactory): DataView;
    }
}

declare module powerbi.data {
    import RoleKindByQueryRef = DataViewAnalysis.RoleKindByQueryRef;
    interface DataViewSelectTransform {
        displayName?: string;
        queryName?: string;
        format?: string;
        type?: ValueType;
        roles?: {
            [roleName: string]: boolean;
        };
        kpi?: DataViewKpiColumnMetadata;
        sort?: SortDirection;
        expr?: SQExpr;
        discourageAggregationAcrossGroups?: boolean;
        /** Describes the default value applied to a column, if any. */
        defaultValue?: DefaultValueDefinition;
        aggregateSources?: DataViewSelectAggregateSources;
    }
    interface DataViewSelectAggregateSources {
        min?: DataViewSelectAggregateSource;
        max?: DataViewSelectAggregateSource;
    }
    interface DataViewSelectAggregateSource {
        index: number;
    }
    module DataViewSelectTransform {
        /** Convert selection info to projections */
        function projectionsFromSelects(selects: DataViewSelectTransform[], projectionActiveItems: DataViewProjectionActiveItems): QueryProjectionsByRole;
        /** Use selections and metadata to fashion query role kinds */
        function createRoleKindFromMetadata(selects: DataViewSelectTransform[], metadata: DataViewMetadata): RoleKindByQueryRef;
    }
}
declare module powerbi.data {
    interface ICategoricalEvalContext extends IEvalContext {
        setCurrentRowIndex(index: number): void;
    }
    function createCategoricalEvalContext(colorAllocatorProvider: IColorAllocatorCache, dataViewCategorical: DataViewCategorical, selectTransforms: DataViewSelectTransform[]): ICategoricalEvalContext;
}

declare module powerbi.data {
    interface ITableEvalContext extends IEvalContext {
        setCurrentRowIndex(index: number): void;
    }
    function createTableEvalContext(colorAllocatorProvider: IColorAllocatorCache, dataViewTable: DataViewTable, selectTransforms: DataViewSelectTransform[]): ITableEvalContext;
}

declare module powerbi.data {
    class RuleEvaluation {
        evaluate(evalContext: IEvalContext): any;
    }
}

declare module powerbi.data {
    class ColorRuleEvaluation extends RuleEvaluation {
        private inputRole;
        private allocator;
        constructor(inputRole: string, allocator: IColorAllocator);
        evaluate(evalContext: IEvalContext): any;
    }
}

declare module powerbi.data {
    import ArrayNamedItems = jsCommon.ArrayNamedItems;
    class ConceptualSchema {
        entities: ArrayNamedItems<ConceptualEntity>;
        capabilities: ConceptualCapabilities;
        /** Indicates whether the user can edit this ConceptualSchema.  This is used to enable/disable model authoring UX. */
        canEdit: boolean;
        findProperty(entityName: string, propertyName: string): ConceptualProperty;
        findHierarchy(entityName: string, name: string): ConceptualHierarchy;
        findHierarchyByVariation(variationEntityName: string, variationColumnName: string, variationName: string, hierarchyName: string): ConceptualHierarchy;
        findTargetEntityOfVariation(variationEntityName: string, variationColumnName: string, variationName: string): ConceptualEntity;
        /**
        * Returns the first property of the entity whose kpi is tied to kpiProperty
        */
        findPropertyWithKpi(entityName: string, kpiProperty: ConceptualProperty): ConceptualProperty;
    }
    interface ConceptualCapabilities {
        discourageQueryAggregateUsage: boolean;
        normalizedFiveStateKpiRange: boolean;
        supportsMedian: boolean;
        supportsPercentile: boolean;
        supportsScopedEval: boolean;
    }
    interface ConceptualPropertyItemContainer {
        properties: ArrayNamedItems<ConceptualProperty>;
        hierarchies?: ArrayNamedItems<ConceptualHierarchy>;
        displayFolders?: ArrayNamedItems<ConceptualDisplayFolder>;
    }
    interface ConceptualPropertyItem {
        name: string;
        displayName: string;
        hidden?: boolean;
    }
    interface ConceptualEntity extends ConceptualPropertyItemContainer {
        name: string;
        displayName: string;
        visibility?: ConceptualVisibility;
        calculated?: boolean;
        queryable?: ConceptualQueryableState;
        navigationProperties?: ArrayNamedItems<ConceptualNavigationProperty>;
    }
    interface ConceptualDisplayFolder extends ConceptualPropertyItem, ConceptualPropertyItemContainer {
    }
    interface ConceptualProperty extends ConceptualPropertyItem {
        type: ValueType;
        kind: ConceptualPropertyKind;
        format?: string;
        column?: ConceptualColumn;
        queryable?: ConceptualQueryableState;
        measure?: ConceptualMeasure;
        kpiValue?: ConceptualProperty;
    }
    interface ConceptualHierarchy extends ConceptualPropertyItem {
        levels: ArrayNamedItems<ConceptualHierarchyLevel>;
    }
    interface ConceptualHierarchyLevel extends ConceptualPropertyItem {
        column: ConceptualProperty;
    }
    interface ConceptualNavigationProperty {
        name: string;
        isActive: boolean;
        sourceColumn?: ConceptualColumn;
        targetEntity: ConceptualEntity;
        sourceMultiplicity: ConceptualMultiplicity;
        targetMultiplicity: ConceptualMultiplicity;
    }
    interface ConceptualVariationSource {
        name: string;
        isDefault: boolean;
        navigationProperty?: ConceptualNavigationProperty;
        defaultHierarchy?: ConceptualHierarchy;
        defaultProperty?: ConceptualProperty;
    }
    interface ConceptualColumn {
        defaultAggregate?: ConceptualDefaultAggregate;
        keys?: ArrayNamedItems<ConceptualProperty>;
        idOnEntityKey?: boolean;
        calculated?: boolean;
        defaultValue?: SQConstantExpr;
        variations?: ArrayNamedItems<ConceptualVariationSource>;
        aggregateBehavior?: ConceptualAggregateBehavior;
        groupingDefinition?: ConceptualGroupingDefinition;
    }
    interface ConceptualGroupingDefinition {
        binningDefinition?: ConceptualBinningDefinition;
    }
    interface ConceptualBinningDefinition {
        binSize?: ConceptualBinSize;
    }
    interface ConceptualBinSize {
        value: number;
        unit: ConceptualBinUnit;
    }
    interface ConceptualMeasure {
        kpi?: ConceptualPropertyKpi;
    }
    interface ConceptualPropertyKpi {
        statusMetadata: DataViewKpiColumnMetadata;
        trendMetadata?: DataViewKpiColumnMetadata;
        status?: ConceptualProperty;
        goal?: ConceptualProperty;
        trend?: ConceptualProperty;
    }
    const enum ConceptualVisibility {
        Visible = 0,
        Hidden = 1,
        ShowAsVariationsOnly = 2,
        IsPrivate = 4,
    }
    const enum ConceptualQueryableState {
        Queryable = 0,
        Error = 1,
    }
    const enum ConceptualBinUnit {
        Number = 0,
        Percent = 1,
        Log = 2,
        Percentile = 3,
        Year = 4,
        Quarter = 5,
        Month = 6,
        Week = 7,
        Day = 8,
        Hour = 9,
        Minute = 10,
        Second = 11,
    }
    const enum ConceptualMultiplicity {
        ZeroOrOne = 0,
        One = 1,
        Many = 2,
    }
    const enum ConceptualPropertyKind {
        Column = 0,
        Measure = 1,
        Kpi = 2,
    }
    const enum ConceptualDefaultAggregate {
        Default = 0,
        None = 1,
        Sum = 2,
        Count = 3,
        Min = 4,
        Max = 5,
        Average = 6,
        DistinctCount = 7,
    }
    enum ConceptualDataCategory {
        None = 0,
        Address = 1,
        City = 2,
        Company = 3,
        Continent = 4,
        Country = 5,
        County = 6,
        Date = 7,
        Image = 8,
        ImageUrl = 9,
        Latitude = 10,
        Longitude = 11,
        Organization = 12,
        Place = 13,
        PostalCode = 14,
        Product = 15,
        StateOrProvince = 16,
        WebUrl = 17,
    }
    const enum ConceptualAggregateBehavior {
        Default = 0,
        DiscourageAcrossGroups = 1,
    }
}

declare module powerbi {
    import ArrayNamedItems = jsCommon.ArrayNamedItems;
    import FederatedConceptualSchema = powerbi.data.FederatedConceptualSchema;
    import QueryProjectionsByRole = data.QueryProjectionsByRole;
    interface ScriptResult {
        source: string;
        provider: string;
    }
    module ScriptResultUtil {
        function findScriptResult(dataViewMappings: DataViewMapping[] | data.CompiledDataViewMapping[]): DataViewScriptResultMapping | data.CompiledDataViewScriptResultMapping;
        function extractScriptResult(dataViewMappings: data.CompiledDataViewMapping[]): ScriptResult;
        function extractScriptResultFromVisualConfig(dataViewMappings: DataViewMapping[], objects: powerbi.data.DataViewObjectDefinitions): ScriptResult;
        function getScriptInput(projections: QueryProjectionsByRole, selects: ArrayNamedItems<data.NamedSQExpr>, schema: FederatedConceptualSchema): data.ScriptInput;
    }
}

declare module powerbi.data.segmentation {
    interface DataViewTableSegment extends DataViewTable {
        /**
         * Index of the last item that had a merge flag in the underlying data.
         * We assume merge flags are not random but adjacent to each other.
         */
        lastMergeIndex?: number;
    }
    interface DataViewTreeSegmentNode extends DataViewTreeNode {
        /** Indicates whether the node is a duplicate of a node from a previous segment. */
        isMerge?: boolean;
    }
    interface DataViewCategoricalSegment extends DataViewCategorical {
        /**
         * Index of the last item that had a merge flag in the underlying data.
         * We assume merge flags are not random but adjacent to each other.
         */
        lastMergeIndex?: number;
    }
    interface DataViewMatrixSegmentNode extends DataViewMatrixNode {
        /**
         * Index of the last item that had a merge flag in the underlying data.
         * We assume merge flags are not random but adjacent to each other.
         */
        isMerge?: boolean;
    }
    module DataViewMerger {
        function mergeDataViews(source: DataView, segment: DataView): void;
        /** Note: Public for testability */
        function mergeTables(source: DataViewTable, segment: DataViewTableSegment): void;
        /**
         * Merge categories values and identities
         *
         * Note: Public for testability
         */
        function mergeCategorical(source: DataViewCategorical, segment: DataViewCategoricalSegment): void;
        /** Note: Public for testability */
        function mergeTreeNodes(sourceRoot: DataViewTreeNode, segmentRoot: DataViewTreeNode, allowDifferentStructure: boolean): void;
    }
}

declare module powerbi.data {
    /** Responsible for writing equality comparisons against a field to an SQInExpr. */
    module EqualsToInRewriter {
        function run(expr: SQExpr): SQExpr;
    }
}

declare module powerbi.data {
    interface FilterValueScopeIdsContainer {
        isNot: boolean;
        scopeIds: DataViewScopeIdentity[];
    }
    module SQExprConverter {
        function asScopeIdsContainer(filter: SemanticFilter, fieldSQExprs: SQExpr[]): FilterValueScopeIdsContainer;
        /** Gets a comparand value from the given DataViewScopeIdentity. */
        function getFirstComparandValue(identity: DataViewScopeIdentity): any;
    }
}

declare module powerbi.data {
    /** Recognizes DataViewScopeIdentity expression trees to extract comparison keys. */
    module ScopeIdentityExtractor {
        function getKeys(expr: SQExpr): SQExpr[];
        function getValues(expr: SQExpr): SQExpr[];
        function getInExpr(expr: SQExpr): SQInExpr;
    }
}

declare module powerbi.data {
    interface ISQAggregationOperations {
        /** Returns an array of supported aggregates for a given expr and role type. */
        getSupportedAggregates(expr: SQExpr, schema: FederatedConceptualSchema, targetTypes: ValueTypeDescriptor[]): QueryAggregateFunction[];
        isSupportedAggregate(expr: SQExpr, schema: FederatedConceptualSchema, aggregate: QueryAggregateFunction, targetTypes: ValueTypeDescriptor[], forConsumption?: boolean): boolean;
        createExprWithAggregate(expr: SQExpr, schema: FederatedConceptualSchema, aggregateNonNumericFields: boolean, targetTypes: ValueTypeDescriptor[], preferredAggregate?: QueryAggregateFunction): SQExpr;
    }
    function createSQAggregationOperations(datetimeMinMaxSupported: boolean): ISQAggregationOperations;
}

declare module powerbi.data {
    module SQHierarchyExprUtils {
        function getConceptualHierarchyLevelFromExpr(conceptualSchema: FederatedConceptualSchema, fieldExpr: FieldExprPattern): ConceptualHierarchyLevel;
        function getConceptualHierarchyLevel(conceptualSchema: FederatedConceptualSchema, schemaName: string, entity: string, hierarchy: string, hierarchyLevel: string): ConceptualHierarchyLevel;
        function getConceptualHierarchy(sqExpr: SQExpr, federatedSchema: FederatedConceptualSchema): ConceptualHierarchy;
        function expandExpr(schema: FederatedConceptualSchema, expr: SQExpr, suppressHierarchyLevelExpansion?: boolean): SQExpr | SQExpr[];
        function isHierarchyOrVariation(schema: FederatedConceptualSchema, expr: SQExpr): boolean;
        function getSourceVariationExpr(hierarchyLevelExpr: data.SQHierarchyLevelExpr): SQColumnRefExpr;
        function getSourceHierarchy(hierarchyLevelExpr: data.SQHierarchyLevelExpr): SQHierarchyExpr;
        function getHierarchySourceAsVariationSource(hierarchyLevelExpr: SQHierarchyLevelExpr): SQPropertyVariationSourceExpr;
        /**
        * Returns true if firstExpr and secondExpr are levels in the same hierarchy and firstExpr is before secondExpr in allLevels.
        */
        function areHierarchyLevelsOrdered(allLevels: SQHierarchyLevelExpr[], firstExpr: SQExpr, secondExpr: SQExpr): boolean;
        /**
         * Given an ordered set of levels and an ordered subset of those levels, returns the index where
         * expr should be inserted into the subset to maintain the correct order.
         */
        function getInsertionIndex(allLevels: SQHierarchyLevelExpr[], orderedSubsetOfLevels: SQHierarchyLevelExpr[], expr: SQHierarchyLevelExpr): number;
    }
    module SQExprHierarchyToHierarchyLevelConverter {
        function convert(sqExpr: SQExpr, federatedSchema: FederatedConceptualSchema): SQExpr[];
    }
}

declare module powerbi.data {
    interface SQExprGroup {
        expr: SQExpr;
        children: SQHierarchyLevelExpr[];
        /** Index of expression in the query. */
        selectQueryIndex: number;
    }
    module SQExprGroupUtils {
        /** Group all projections. Eacch group can consist of either a single property, or a collection of hierarchy items. */
        function groupExprs(schema: FederatedConceptualSchema, exprs: SQExpr[]): SQExprGroup[];
    }
}

declare module powerbi.data {
    import ConceptualEntity = powerbi.data.ConceptualEntity;
    import SQEntityExpr = powerbi.data.SQEntityExpr;
    module SQExprUtils {
        function supportsArithmetic(expr: SQExpr, schema: FederatedConceptualSchema): boolean;
        function indexOfExpr(items: SQExpr[], searchElement: SQExpr): number;
        function indexOfNamedExpr(items: NamedSQExpr[], searchElement: SQExpr): number;
        function sequenceEqual(x: SQExpr[], y: SQExpr[]): boolean;
        function uniqueName(namedItems: NamedSQExpr[], expr: SQExpr, exprDefaultName?: string): string;
        /** Generates a default expression name  */
        function defaultName(expr: SQExpr, fallback?: string): string;
        /** Gets a value indicating whether the expr is a model measure or an aggregate. */
        function isMeasure(expr: SQExpr): boolean;
        /** Gets a value indicating whether the expr is an AnyValue or equals comparison to AnyValue*/
        function isAnyValue(expr: SQExpr): boolean;
        /** Gets a value indicating whether the expr is a DefaultValue or equals comparison to DefaultValue*/
        function isDefaultValue(expr: SQExpr): boolean;
        function discourageAggregation(expr: SQExpr, schema: FederatedConceptualSchema): boolean;
        function getAggregateBehavior(expr: SQExpr, schema: FederatedConceptualSchema): ConceptualAggregateBehavior;
        function getSchemaCapabilities(expr: SQExpr, schema: FederatedConceptualSchema): ConceptualCapabilities;
        function getKpiMetadata(expr: SQExpr, schema: FederatedConceptualSchema): DataViewKpiColumnMetadata;
        function getConceptualEntity(entityExpr: SQEntityExpr, schema: FederatedConceptualSchema): ConceptualEntity;
        function getDefaultValue(fieldSQExpr: SQExpr, schema: FederatedConceptualSchema): SQConstantExpr;
        function getDefaultValues(fieldSQExprs: SQExpr[], schema: FederatedConceptualSchema): SQConstantExpr[];
        /** Return compare or and expression for key value pairs. */
        function getDataViewScopeIdentityComparisonExpr(fieldsExpr: SQExpr[], values: SQConstantExpr[]): SQExpr;
        function getActiveTablesNames(queryDefn: data.SemanticQuery): string[];
        function isRelatedToMany(schema: FederatedConceptualSchema, sourceExpr: SQEntityExpr, targetExpr: SQEntityExpr): boolean;
        function isRelatedToOne(schema: FederatedConceptualSchema, sourceExpr: SQEntityExpr, targetExpr: SQEntityExpr): boolean;
        function isRelatedOneToOne(schema: FederatedConceptualSchema, sourceExpr: SQEntityExpr, targetExpr: SQEntityExpr): boolean;
        /** Performs a union of the 2 arrays with SQExpr.equals as comparator to skip duplicate items,
            and returns a new array. When available, we should use _.unionWith from lodash. */
        function concatUnique(leftExprs: SQExpr[], rightExprs: SQExpr[]): SQExpr[];
    }
}

declare module powerbi.data {
    class SemanticQueryRewriter {
        private exprRewriter;
        constructor(exprRewriter: ISQExprVisitor<SQExpr>);
        rewriteFrom(fromValue: SQFrom): SQFrom;
        rewriteSelect(selectItems: NamedSQExpr[], from: SQFrom): NamedSQExpr[];
        rewriteGroupBy(groupByitems: NamedSQExpr[], from: SQFrom): NamedSQExpr[];
        private rewriteNamedSQExpressions(expressions, from);
        rewriteOrderBy(orderByItems: SQSortDefinition[], from: SQFrom): SQSortDefinition[];
        rewriteWhere(whereItems: SQFilter[], from: SQFrom): SQFilter[];
        rewriteTransform(transformItems: SQTransform[], from: SQFrom): SQTransform[];
    }
}

declare module powerbi.data {
    type SQFromSource = SQFromEntitySource | SQFromSubquerySource;
    /** Represents an entity reference in SemanticQuery from. */
    class SQFromEntitySource {
        schema: string;
        entity: string;
        constructor(schema: string, entity: string);
        accept<T, TArg>(visitor: ISQFromSourceVisitor<T, TArg>, arg: TArg): T;
        equals(source: SQFromEntitySource): boolean;
    }
    /** Represents a subquery reference in SemanticQuery from.
        for subquery use SQExpr instead of SemanticQuery when we have one for QuerySubqueryExpression
     */
    class SQFromSubquerySource {
        subquery: SemanticQuery;
        constructor(subquery: SemanticQuery);
        accept<T, TArg>(visitor: ISQFromSourceVisitor<T, TArg>, arg: TArg): T;
        equals(source: SQFromSubquerySource): boolean;
    }
    /** Represents a SemanticQuery/SemanticFilter from clause. */
    class SQFrom {
        private items;
        constructor(items?: {
            [name: string]: SQFromSource;
        });
        keys(): string[];
        source(key: string): SQFromSource;
        sources(): {
            [name: string]: SQFromSource;
        };
        ensureSource(source: SQFromSource, desiredVariableName?: string): QueryFromEnsureEntityResult;
        remove(key: string): void;
        private getSourceKeyFromItems(source);
        private addSource(source, desiredVariableName);
        clone(): SQFrom;
        equals(comparand: SQFrom): boolean;
    }
    function equals(left: SQFromSource, right: SQFromSource): boolean;
    function isSQFromEntitySource(source: SQFromSource): source is SQFromEntitySource;
    function isSQFromSubquerySource(source: SQFromSource): source is SQFromSubquerySource;
    interface ISQFromSourceVisitor<T, Targ> {
        visitEntity(source: SQFromEntitySource, arg: Targ): T;
        visitSubquery(source: SQFromSubquerySource, arg: Targ): T;
    }
    class SQFromSourceCandidateNameVisitor implements ISQFromSourceVisitor<string, void> {
        /** Converts the entity name into a short reference name.  Follows the Semantic Query convention of a short name. */
        visitEntity(source: SQFromEntitySource): string;
        visitSubquery(source: SQFromSubquerySource): string;
    }
    class SQFromEntitiesVisitor implements ISQFromSourceVisitor<void, string> {
        entities: SQEntityExpr[];
        constructor();
        visitEntity(source: SQFromEntitySource, key: string): void;
        visitSubquery(source: SQFromSubquerySource, key: string): void;
    }
}

declare module powerbi.data {
    import ArrayNamedItems = jsCommon.ArrayNamedItems;
    interface NamedSQExpr {
        name: string;
        expr: SQExpr;
    }
    interface SQFilter {
        target?: SQExpr[];
        condition: SQExpr;
    }
    /** Represents a sort over an expression. */
    interface SQSortDefinition {
        expr: SQExpr;
        direction: SortDirection;
    }
    interface QueryFromEnsureEntityResult {
        name: string;
        new?: boolean;
    }
    interface SQSourceRenames {
        [from: string]: string;
    }
    interface SQTransform {
        name: string;
        algorithm: string;
        input: SQTransformInput;
        output: SQTransformOutput;
    }
    interface SQTransformInput {
        parameters: NamedSQExpr[];
        table?: SQTransformTable;
    }
    interface SQTransformOutput {
        table?: SQTransformTable;
    }
    interface SQTransformTable {
        name: string;
        columns: SQTransformTableColumn[];
    }
    interface SQTransformTableColumn {
        role?: string;
        expression: NamedSQExpr;
    }
    /**
     * Represents a semantic query that is:
     * 1) Round-trippable with a JSON QueryDefinition.
     * 2) Immutable
     * 3) Long-lived and does not have strong references to a conceptual model (only names).
     */
    class SemanticQuery {
        private static empty;
        private fromValue;
        private whereItems;
        private orderByItems;
        private selectItems;
        private groupByItems;
        private transformItems;
        constructor(from: SQFrom, where: SQFilter[], orderBy: SQSortDefinition[], select: NamedSQExpr[], groupBy: NamedSQExpr[], transformItems: SQTransform[]);
        static create(): SemanticQuery;
        private static createWithTrimmedFrom(from, where, transform, orderBy, select, groupBy);
        from(): SQFrom;
        /** Returns a query equivalent to this, with the specified selected items. */
        select(values: NamedSQExpr[]): SemanticQuery;
        /** Gets the items being selected in this query. */
        select(): ArrayNamedItems<NamedSQExpr>;
        private getSelect();
        private static createNamedExpressionArray(items);
        private setSelect(values);
        private static rewriteExpressionsWithSourceRenames(values, from);
        /** Removes the given expression from the select. */
        removeSelect(expr: SQExpr): SemanticQuery;
        /** Removes the given expression from order by. */
        removeOrderBy(expr: SQExpr): SemanticQuery;
        /** Removes the given expression from transforms. */
        removeTransform(transform: SQTransform): SemanticQuery;
        selectNameOf(expr: SQExpr): string;
        setSelectAt(index: number, expr: SQExpr): SemanticQuery;
        /** Adds a the expression to the select clause. */
        addSelect(expr: SQExpr, exprName?: string): SemanticQuery;
        private createNamedExpr(currentNames, from, expr, exprName?);
        /** Returns a query equivalent to this, with the specified groupBy items. */
        groupBy(values: NamedSQExpr[]): SemanticQuery;
        /** Gets the groupby items in this query. */
        groupBy(): ArrayNamedItems<NamedSQExpr>;
        private getGroupBy();
        private setGroupBy(values);
        addGroupBy(expr: SQExpr): SemanticQuery;
        /** Gets or sets the sorting for this query. */
        orderBy(values: SQSortDefinition[]): SemanticQuery;
        orderBy(): SQSortDefinition[];
        private getOrderBy();
        private setOrderBy(values);
        /** Gets or sets the filters for this query. */
        where(values: SQFilter[]): SemanticQuery;
        where(): SQFilter[];
        private getWhere();
        private setWhere(values);
        addWhere(filter: SemanticFilter): SemanticQuery;
        /** Returns a query equivalent to this, with the specified transform items. */
        transforms(transforms: SQTransform[]): SemanticQuery;
        transforms(): SQTransform[];
        private getTransforms();
        private setTransforms(transforms);
        rewrite(exprRewriter: ISQExprVisitor<SQExpr>): SemanticQuery;
        static equals(x: SemanticQuery, y: SemanticQuery): boolean;
    }
    /** Represents a semantic filter condition.  Round-trippable with a JSON FilterDefinition.  Instances of this class are immutable. */
    class SemanticFilter implements ISemanticFilter {
        private fromValue;
        private whereItems;
        constructor(from: SQFrom, where: SQFilter[]);
        static fromSQExpr(contract: SQExpr): SemanticFilter;
        static getDefaultValueFilter(fieldSQExprs: SQExpr | SQExpr[]): SemanticFilter;
        static getAnyValueFilter(fieldSQExprs: SQExpr | SQExpr[]): SemanticFilter;
        private static getDataViewScopeIdentityComparisonFilters(fieldSQExprs, value);
        from(): SQFrom;
        conditions(): SQExpr[];
        where(): SQFilter[];
        rewrite(exprRewriter: ISQExprVisitor<SQExpr>): SemanticFilter;
        validate(schema: FederatedConceptualSchema, aggrUtils: ISQAggregationOperations, errors?: SQExprValidationError[]): SQExprValidationError[];
        /** Merges a list of SemanticFilters into one. */
        static merge(filters: SemanticFilter[]): SemanticFilter;
        static isDefaultFilter(filter: SemanticFilter): boolean;
        static isAnyFilter(filter: SemanticFilter): boolean;
        static isSameFilter(leftFilter: SemanticFilter, rightFilter: SemanticFilter): boolean;
        private static applyFilter(filter, from, where);
    }
    class SQExprRewriterWithSourceRenames extends SQExprRewriter {
        private renames;
        constructor(renames: SQSourceRenames);
        visitEntity(expr: SQEntityExpr): SQExpr;
        rewriteFilter(filter: SQFilter): SQFilter;
        rewriteArray(exprs: SQExpr[]): SQExpr[];
        static rewrite(expr: SQExpr, from: SQFrom): SQExpr;
    }
}

declare module powerbi.data {
    module SQFilter {
        /**
         * Returns true if leftFilter and rightFilter have the same target and condition.
         */
        function equals(leftFilter: SQFilter, rightFilter: SQFilter): boolean;
        /**
         * Returns true if leftFilter and rightFilter have the same target.
         */
        function targetsEqual(leftFilter: SQFilter, rightFilter: SQFilter): boolean;
        function contains(filters: SQFilter[], searchTarget: SQFilter): boolean;
    }
}

declare module powerbi.data {
    module SQUtils {
        function sqSortDefinitionEquals(left: SQSortDefinition, right: SQSortDefinition): boolean;
        function namedSQExprEquals(left: NamedSQExpr, right: NamedSQExpr): boolean;
        function sqTransformTableColumnsEquals(left: SQTransformTableColumn, right: SQTransformTableColumn): boolean;
        function sqTransformTableEquals(left: SQTransformTable, right: SQTransformTable): boolean;
        function sqTransformInputEquals(left: SQTransformInput, right: SQTransformInput): boolean;
        function sqTransformOutputEquals(left: SQTransformOutput, right: SQTransformOutput): boolean;
        function sqTransformEquals(left: SQTransform, right: SQTransform): boolean;
    }
}

declare module powerbi.data {
    import SQExpr = powerbi.data.SQExpr;
    function createStaticEvalContext(colorAllocatorCache?: IColorAllocatorCache): IEvalContext;
    function createStaticEvalContext(colorAllocatorCache: IColorAllocatorCache, dataView: DataView, selectTransforms: DataViewSelectTransform[]): IEvalContext;
    function getExprValueFromTable(expr: SQExpr, selectTransforms: DataViewSelectTransform[], table: DataViewTable, rowIdx: number): PrimitiveValue;
    function findSelectIndex(expr: SQExpr, selectTransforms: DataViewSelectTransform[]): number;
}

declare module powerbi.data {
    function createMatrixEvalContext(colorAllocatorProvider: IColorAllocatorCache, dataViewMatrix: DataViewMatrix): IEvalContext;
}

declare module powerbi {
    /** Culture interfaces. These match the Globalize library interfaces intentionally. */
    interface Culture {
        name: string;
        calendar: Calendar;
        calendars: CalendarDictionary;
        numberFormat: NumberFormatInfo;
    }
    interface Calendar {
        patterns: any;
        firstDay: number;
    }
    interface CalendarDictionary {
        [key: string]: Calendar;
    }
    interface NumberFormatInfo {
        decimals: number;
        groupSizes: number[];
        negativeInfinity: string;
        positiveInfinity: string;
    }
    /**
     * NumberFormat module contains the static methods for formatting the numbers.
     * It extends the JQuery.Globalize functionality to support complete set of .NET
     * formatting expressions for numeric types including custom formats.
     */
    module NumberFormat {
        const NumberFormatComponentsDelimeter: string;
        interface NumericFormatMetadata {
            format: string;
            hasLiterals: boolean;
            hasE: boolean;
            hasCommas: boolean;
            hasDots: boolean;
            hasPercent: boolean;
            hasPermile: boolean;
            precision: number;
            scale: number;
        }
        interface NumberFormatComponents {
            hasNegative: boolean;
            positive: string;
            negative: string;
            zero: string;
        }
        function getNumericFormat(value: number, baseFormat: string): string;
        function addDecimalsToFormat(baseFormat: string, decimals: number, trailingZeros: boolean): string;
        function hasFormatComponents(format: string): boolean;
        function getComponents(format: string): NumberFormatComponents;
        /** Evaluates if the value can be formatted using the NumberFormat */
        function canFormat(value: any): boolean;
        function isStandardFormat(format: string): boolean;
        /** Formats the number using specified format expression and culture */
        function format(value: number, format: string, culture: Culture): string;
        /** Performs a custom format with a value override.  Typically used for custom formats showing scaled values. */
        function formatWithCustomOverride(value: number, format: string, nonScientificOverrideFormat: string, culture: Culture): string;
        /**
         * Returns the formatMetadata of the format
         * When calculating precision and scale, if format string of
         * positive[;negative;zero] => positive format will be used
         * @param (required) format - format string
         * @param (optional) calculatePrecision - calculate precision of positive format
         * @param (optional) calculateScale - calculate scale of positive format
         */
        function getCustomFormatMetadata(format: string, calculatePrecision?: boolean, calculateScale?: boolean): NumericFormatMetadata;
    }
    var formattingService: IFormattingService;
}

declare module powerbi.visuals {
    import Selector = powerbi.data.Selector;
    import SelectorForColumn = powerbi.SelectorForColumn;
    /**
     * A combination of identifiers used to uniquely identify
     * data points and their bound geometry.
     */
    class SelectionId implements ISelectionId {
        private selector;
        private selectorsByColumn;
        private key;
        private keyWithoutHighlight;
        highlight: boolean;
        constructor(selector: Selector, highlight: boolean);
        equals(other: SelectionId): boolean;
        /**
         * Checks equality against other for all identifiers existing in this.
         */
        includes(other: SelectionId, ignoreHighlight?: boolean): boolean;
        getKey(): string;
        getKeyWithoutHighlight(): string;
        hasIdentity(): boolean;
        getSelector(): Selector;
        getSelectorsByColumn(): Selector;
        static createNull(highlight?: boolean): SelectionId;
        static createWithId(id: DataViewScopeIdentity, highlight?: boolean): SelectionId;
        static createWithMeasure(measureId: string, highlight?: boolean): SelectionId;
        static createWithIdAndMeasure(id: DataViewScopeIdentity, measureId: string, highlight?: boolean): SelectionId;
        static createWithIdAndMeasureAndCategory(id: DataViewScopeIdentity, measureId: string, queryName: string, highlight?: boolean): SelectionId;
        static createWithIds(id1: DataViewScopeIdentity, id2: DataViewScopeIdentity, highlight?: boolean): SelectionId;
        static createWithIdsAndMeasure(id1: DataViewScopeIdentity, id2: DataViewScopeIdentity, measureId: string, highlight?: boolean): SelectionId;
        static createWithSelectorForColumnAndMeasure(dataMap: SelectorForColumn, measureId: string, highlight?: boolean): SelectionId;
        static createWithHighlight(original: SelectionId): SelectionId;
        private static idArray(id1, id2);
    }
    /**
     * This class is designed to simplify the creation of SelectionId objects
     * It allows chaining to build up an object before calling 'create' to build a SelectionId
     */
    class SelectionIdBuilder implements ISelectionIdBuilder {
        private dataMap;
        private measure;
        static builder(): SelectionIdBuilder;
        withCategoryIdentity(categoryColumn: DataViewCategoryColumn, identity: DataViewScopeIdentity): this;
        withCategory(categoryColumn: DataViewCategoryColumn, index: number): this;
        withSeries(seriesColumn: DataViewValueColumns, valueColumn: DataViewValueColumn | DataViewValueColumnGroup): this;
        withMeasure(measureId: string): this;
        createSelectionId(): SelectionId;
        private ensureDataMap();
    }
}

declare module powerbi {
    import DataViewObjectDefinitions = data.DataViewObjectDefinitions;
    import DisplayNameGetter = data.DisplayNameGetter;
    /** Defines a list of style presets for a particular IVisual */
    interface VisualStylePresets {
        /** Title of PropertyPane section for selecting the style */
        sectionTitle: DisplayNameGetter;
        /** Title of PropertyPane slice for selecting the style */
        sliceTitle: DisplayNameGetter;
        /** Default style preset name for the Visual. Usually looked up with when searching by name fails.
         * Must be one of the presets */
        defaultPresetName: string;
        /** List of style presets for the IVisual indexed by preset name */
        presets: _.Dictionary<VisualStylePreset>;
    }
    /** Defines some rules to derive IVisual formatting elements from a Report Theme */
    interface VisualStylePreset {
        /** Serialized name. Changing it would break saved reports */
        name: string;
        /** Display name for the style preset */
        displayName: DisplayNameGetter;
        /** Discription text for the style preset, can be used for a tooltip */
        description?: DisplayNameGetter;
        /**
         * Evaluate the style preset against a report theme and produce DataViewObjectDefinitions for affected objects
         * @param IVisualStyle Report theme
         */
        evaluate: (theme: IVisualStyle) => DataViewObjectDefinitions;
    }
    module VisualStylePresetHelpers {
        /**
         * Get a visual style preset by name.
         * If stylePresets is undefined, returns undefined
         * If the name doesn't match one or name is undefined, the default preset should be returned, can be undefined
         * @param {string} name name of the Style Preset
         */
        function getStylePreset(stylePresets: VisualStylePresets, name: string): VisualStylePreset;
        function getStylePresetsEnum(stylePresets: VisualStylePresets): IEnumType;
    }
}






















declare module powerbi.visuals.telemetry {
    /**
     * Creates a client-side Guid string.
     * @returns A string representation of a Guid.
     */
    function generateGuid(): string;
}

declare module powerbi.visuals.telemetry {
    interface IPBIVisualApiUsage extends ICustomerAction {
        name: string;
        apiVersion: string;
        custom: boolean;
    }
    /**
    * Event fired when a visual is loaded through the VisualSafeExecutionWrapper
    * @param name Name (guid) of the visual.
    * @param apiVersion Api version used by the visual.
    * @param custom Is the visual custom?
    * @param parentId Id of the parent event
    * @param isError True - action failed.
    * @param errorSource Source of the error. PowerBI = PowerBI has a problem, External = External Service (e.g. on-prem AS server is down), User = User error (e.g. uploading too much and hitting resource limitations.
    * @param errorCode PowerBI Error Code
    *
    * Generated by: commonTelemetryEvents.bond
    */
    var VisualApiUsageLoggers: number;
    var VisualApiUsage: (name: string, apiVersion: string, custom: boolean, parentId: string, isError?: boolean, errorSource?: ErrorSource, errorCode?: string) => ITelemetryEventI<IPBIVisualApiUsage>;
    /**
    * Event fired for uncaught exception in IVisual.
    * @param visualType Type of the visual.
    * @param isCustom Is the visual custom?
    * @param apiVersion Api version used by the visual
    * @param source Source URL
    * @param lineNumber Line number
    * @param columnNumber Column number
    * @param stack Stack trace
    * @param message Error exception message.
    *
    * Generated by JsCommon/commonTelemetryEvents.bond
    */
    var VisualExceptionLoggers: number;
    var VisualException: (visualType: string, isCustom: boolean, apiVersion: string, source: string, lineNumber: number, columnNumber: number, stack: string, message: string) => ITelemetryEventI<IPBIVisualException>;
}

declare module powerbi.extensibility {
    function VisualPlugin(options: IVisualPluginOptions): ClassDecorator;
}

declare module powerbi.extensibility {
    import IPoint = visuals.IPoint;
    interface SelectionManagerOptions {
        hostServices: IVisualHostServices;
    }
    class SelectionManager implements ISelectionManager {
        private selectedIds;
        private hostServices;
        private promiseFactory;
        private dataPointObjectName;
        constructor(options: SelectionManagerOptions);
        select(selectionId: ISelectionId, multiSelect?: boolean): IPromise<ISelectionId[]>;
        showContextMenu(selectionId: ISelectionId, position: IPoint): IPromise<{}>;
        hasSelection(): boolean;
        clear(): IPromise<{}>;
        getSelectionIds(): ISelectionId[];
        private sendSelectionToHost(ids);
        private sendContextMenuToHost(selectionId, position);
        private getSelectorsByColumn(selectionIds);
        private selectInternal(selectionId, multiSelect);
        static containsSelection(list: ISelectionId[], id: ISelectionId): boolean;
    }
}

declare module powerbi.extensibility {
    /**
     * This class is designed to simplify the creation of SelectionId objects
     * It allows chaining to build up an object before calling 'create' to build a SelectionId
     */
    class SelectionIdBuilder implements ISelectionIdBuilder {
        private dataMap;
        private measure;
        withCategory(categoryColumn: DataViewCategoryColumn, index: number): this;
        withSeries(seriesColumn: DataViewValueColumns, valueColumn: DataViewValueColumn | DataViewValueColumnGroup): this;
        withMeasure(measureId: string): this;
        createSelectionId(): ISelectionId;
        private ensureDataMap();
    }
}

declare module powerbi.extensibility {
    import ITelemetryService = visuals.telemetry.ITelemetryService;
    let visualApiVersions: VisualVersion[];
    function createVisualAdapter(visualPlugin: IVisualPlugin, telemetryService?: powerbi.ITelemetryService | ITelemetryService): powerbi.IVisual;
    class VisualAdapter implements powerbi.IVisual, WrappedVisual {
        private visual;
        private apiVersionIndex;
        private plugin;
        private telemetryService;
        private legacy;
        isPluginInError: boolean;
        constructor(visualPlugin: IVisualPlugin, telemetryService?: ITelemetryService);
        init(options: powerbi.VisualInitOptions): void;
        update(options: powerbi.VisualUpdateOptions): void;
        destroy(): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        enumerateObjectRepetition(): VisualObjectRepetition[];
        onResizing(finalViewport: IViewport, resizeMode: ResizeMode): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onViewModeChanged(viewMode: ViewMode): void;
        onClearSelection(): void;
        canResizeTo(viewport: IViewport): boolean;
        unwrap(): powerbi.IVisual;
        private visualNew;
        private visualLegacy;
        private visualHasMethod(methodName);
        private getVersionIndex(version);
        private overloadMethods();
        private getCompiledOverloads();
    }
}

declare module powerbi.extensibility {
    /**
     * Translates visual plugin produced by pbiviz cli tools
     * The function mutates the plugin
     *
     * TODO: add separate capabilities interfaces and versioning support
     */
    function translateVisualPlugin(plugin: IVisualPlugin): void;
}

declare module powerbi.extensibility {
    import ITelemetryService = visuals.telemetry.ITelemetryService;
    class VisualSafeExecutionWrapper implements powerbi.IVisual, WrappedVisual {
        private wrappedVisual;
        private visualPlugin;
        private telemetryService;
        private isPluginInError;
        private silent;
        private perfLoadEvent;
        constructor(wrappedVisual: powerbi.IVisual, visualPlugin: IVisualPlugin, telemetryService: ITelemetryService, isPluginInError: boolean, silent?: boolean);
        init(options: VisualInitOptions): void;
        destroy(): void;
        update(options: powerbi.VisualUpdateOptions): void;
        onResizing(finalViewport: IViewport, resizeMode: ResizeMode): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onViewModeChanged(viewMode: ViewMode): void;
        onClearSelection(): void;
        canResizeTo(viewport: IViewport): boolean;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        enumerateObjectRepetition(): VisualObjectRepetition[];
        unwrap(): powerbi.IVisual;
        isCustomVisual(): boolean;
        private executeSafely(callback);
    }
}
declare module powerbi.extensibility.legacy {
    interface DeprecatedSelectEventArgs {
        visualObjects: VisualObject[];
        selectors?: powerbi.data.Selector[];
        data?: powerbi.data.Selector[];
        data2?: SelectorsByColumn[];
    }
    function isOldSelectEventArgs(args: SelectEventArgs): args is DeprecatedSelectEventArgs;
    function getSelectorsByColumn(args: DeprecatedSelectEventArgs): SelectorsByColumn[];
    function getSelectors(args: DeprecatedSelectEventArgs): data.Selector[];
}

declare module powerbi.extensibility.v100 {
    function convertLegacyUpdateType(options: powerbi.VisualUpdateOptions): VisualUpdateType;
}

declare module powerbi.extensibility.v110 {
}
