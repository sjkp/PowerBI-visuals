
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
