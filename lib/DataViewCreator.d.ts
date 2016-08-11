






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

declare module powerbitests.customVisuals.sampleDataViews {
    import SQExpr = powerbi.data.SQExpr;
    import DataViewBuilderValuesColumnOptions = powerbi.data.DataViewBuilderValuesColumnOptions;
    import DataViewBuilderColumnIdentitySource = powerbi.data.DataViewBuilderColumnIdentitySource;
    interface DataViewBuilderColumnOptions extends powerbi.data.DataViewBuilderColumnOptions {
        values: any[];
    }
    interface DataViewBuilderCategoryColumnOptions extends DataViewBuilderColumnOptions {
        objects?: powerbi.DataViewObjects[];
        isGroup?: boolean;
    }
    interface DataViewBuilderAllColumnOptions {
        categories: DataViewBuilderCategoryColumnOptions[];
        grouped: DataViewBuilderCategoryColumnOptions[];
        values: DataViewBuilderValuesColumnOptions[];
    }
    abstract class DataViewBuilder {
        static DataViewName: string;
        private aggregateFunction;
        static setDefaultQueryName(source: powerbi.DataViewMetadataColumn): powerbi.DataViewMetadataColumn;
        static constExpr(fakeValue: string | number | boolean | Date): SQExpr;
        static getDataViewBuilderColumnIdentitySources(options: DataViewBuilderColumnOptions[] | DataViewBuilderColumnOptions): DataViewBuilderColumnIdentitySource[];
        static getValuesTable(categories?: powerbi.DataViewCategoryColumn[], values?: powerbi.DataViewValueColumn[]): any[][];
        static createDataViewBuilderColumnOptions(categoriesColumns: (DataViewBuilderCategoryColumnOptions | DataViewBuilderCategoryColumnOptions[])[], valuesColumns: (DataViewBuilderValuesColumnOptions | DataViewBuilderValuesColumnOptions[])[], filter?: (options: DataViewBuilderColumnOptions) => boolean): DataViewBuilderAllColumnOptions;
        static setUpDataViewBuilderColumnOptions(options: DataViewBuilderAllColumnOptions, aggregateFunction: (array: number[]) => number): DataViewBuilderAllColumnOptions;
        static setUpDataView(dataView: powerbi.DataView, options: DataViewBuilderAllColumnOptions): powerbi.DataView;
        protected createCategoricalDataViewBuilder(categoriesColumns: (DataViewBuilderCategoryColumnOptions | DataViewBuilderCategoryColumnOptions[])[], valuesColumns: (DataViewBuilderValuesColumnOptions | DataViewBuilderValuesColumnOptions[])[], columnNames: string[]): powerbi.data.IDataViewBuilderCategorical;
        abstract getDataView(columnNames?: string[]): powerbi.DataView;
    }
}

declare module powerbitests.customVisuals.sampleDataViews {
    class CustomVisualsData extends DataViewBuilder {
        getDataView(columnNames?: string[]): powerbi.DataView;
    }
}
