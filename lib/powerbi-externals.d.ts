// Type definitions for jQuery 1.10.x / 2.0.x
// Project: http://jquery.com/
// Definitions by: Boris Yankov <https://github.com/borisyankov/>, Christian Hoffmeister <https://github.com/choffmeister>, Steve Fenton <https://github.com/Steve-Fenton>, Diullei Gomes <https://github.com/Diullei>, Tass Iliopoulos <https://github.com/tasoili>, Jason Swearingen <https://github.com/jasons-novaleaf>, Sean Hill <https://github.com/seanski>, Guus Goossens <https://github.com/Guuz>, Kelly Summerlin <https://github.com/ksummerlin>, Basarat Ali Syed <https://github.com/basarat>, Nicholas Wolverson <https://github.com/nwolverson>, Derek Cicerone <https://github.com/derekcicerone>, Andrew Gaspar <https://github.com/AndrewGaspar>, James Harrison Fisher <https://github.com/jameshfisher>, Seikichi Kondo <https://github.com/seikichi>, Benjamin Jackman <https://github.com/benjaminjackman>, Poul Sorensen <https://github.com/s093294>, Josh Strobl <https://github.com/JoshStrobl>, John Reilly <https://github.com/johnnyreilly/>, Dick van den Brink <https://github.com/DickvdBrink>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/* *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */


/**
 * Interface for the AJAX setting that will configure the AJAX request
 */
interface JQueryAjaxSettings {
    /**
     * The content type sent in the request header that tells the server what kind of response it will accept in return. If the accepts setting needs modification, it is recommended to do so once in the $.ajaxSetup() method.
     */
    accepts?: any;
    /**
     * By default, all requests are sent asynchronously (i.e. this is set to true by default). If you need synchronous requests, set this option to false. Cross-domain requests and dataType: "jsonp" requests do not support synchronous operation. Note that synchronous requests may temporarily lock the browser, disabling any actions while the request is active. As of jQuery 1.8, the use of async: false with jqXHR ($.Deferred) is deprecated; you must use the success/error/complete callback options instead of the corresponding methods of the jqXHR object such as jqXHR.done() or the deprecated jqXHR.success().
     */
    async?: boolean;
    /**
     * A pre-request callback function that can be used to modify the jqXHR (in jQuery 1.4.x, XMLHTTPRequest) object before it is sent. Use this to set custom headers, etc. The jqXHR and settings objects are passed as arguments. This is an Ajax Event. Returning false in the beforeSend function will cancel the request. As of jQuery 1.5, the beforeSend option will be called regardless of the type of request.
     */
    beforeSend? (jqXHR: JQueryXHR, settings: JQueryAjaxSettings): any;
    /**
     * If set to false, it will force requested pages not to be cached by the browser. Note: Setting cache to false will only work correctly with HEAD and GET requests. It works by appending "_={timestamp}" to the GET parameters. The parameter is not needed for other types of requests, except in IE8 when a POST is made to a URL that has already been requested by a GET.
     */
    cache?: boolean;
    /**
     * A function to be called when the request finishes (after success and error callbacks are executed). The function gets passed two arguments: The jqXHR (in jQuery 1.4.x, XMLHTTPRequest) object and a string categorizing the status of the request ("success", "notmodified", "error", "timeout", "abort", or "parsererror"). As of jQuery 1.5, the complete setting can accept an array of functions. Each function will be called in turn. This is an Ajax Event.
     */
    complete? (jqXHR: JQueryXHR, textStatus: string): any;
    /**
     * An object of string/regular-expression pairs that determine how jQuery will parse the response, given its content type. (version added: 1.5)
     */
    contents?: { [key: string]: any; };
    //According to jQuery.ajax source code, ajax's option actually allows contentType to set to "false"
    // https://github.com/borisyankov/DefinitelyTyped/issues/742
    /**
     * When sending data to the server, use this content type. Default is "application/x-www-form-urlencoded; charset=UTF-8", which is fine for most cases. If you explicitly pass in a content-type to $.ajax(), then it is always sent to the server (even if no data is sent). The W3C XMLHttpRequest specification dictates that the charset is always UTF-8; specifying another charset will not force the browser to change the encoding.
     */
    contentType?: any;
    /**
     * This object will be made the context of all Ajax-related callbacks. By default, the context is an object that represents the ajax settings used in the call ($.ajaxSettings merged with the settings passed to $.ajax).
     */
    context?: any;
    /**
     * An object containing dataType-to-dataType converters. Each converter's value is a function that returns the transformed value of the response. (version added: 1.5)
     */
    converters?: { [key: string]: any; };
    /**
     * If you wish to force a crossDomain request (such as JSONP) on the same domain, set the value of crossDomain to true. This allows, for example, server-side redirection to another domain. (version added: 1.5)
     */
    crossDomain?: boolean;
    /**
     * Data to be sent to the server. It is converted to a query string, if not already a string. It's appended to the url for GET-requests. See processData option to prevent this automatic processing. Object must be Key/Value pairs. If value is an Array, jQuery serializes multiple values with same key based on the value of the traditional setting (described below).
     */
    data?: any;
    /**
     * A function to be used to handle the raw response data of XMLHttpRequest.This is a pre-filtering function to sanitize the response. You should return the sanitized data. The function accepts two arguments: The raw data returned from the server and the 'dataType' parameter.
     */
    dataFilter? (data: any, ty: any): any;
    /**
     * The type of data that you're expecting back from the server. If none is specified, jQuery will try to infer it based on the MIME type of the response (an XML MIME type will yield XML, in 1.4 JSON will yield a JavaScript object, in 1.4 script will execute the script, and anything else will be returned as a string). 
     */
    dataType?: string;
    /**
     * A function to be called if the request fails. The function receives three arguments: The jqXHR (in jQuery 1.4.x, XMLHttpRequest) object, a string describing the type of error that occurred and an optional exception object, if one occurred. Possible values for the second argument (besides null) are "timeout", "error", "abort", and "parsererror". When an HTTP error occurs, errorThrown receives the textual portion of the HTTP status, such as "Not Found" or "Internal Server Error." As of jQuery 1.5, the error setting can accept an array of functions. Each function will be called in turn. Note: This handler is not called for cross-domain script and cross-domain JSONP requests. This is an Ajax Event.
     */
    error? (jqXHR: JQueryXHR, textStatus: string, errorThrown: string): any;
    /**
     * Whether to trigger global Ajax event handlers for this request. The default is true. Set to false to prevent the global handlers like ajaxStart or ajaxStop from being triggered. This can be used to control various Ajax Events.
     */
    global?: boolean;
    /**
     * An object of additional header key/value pairs to send along with requests using the XMLHttpRequest transport. The header X-Requested-With: XMLHttpRequest is always added, but its default XMLHttpRequest value can be changed here. Values in the headers setting can also be overwritten from within the beforeSend function. (version added: 1.5)
     */
    headers?: { [key: string]: any; };
    /**
     * Allow the request to be successful only if the response has changed since the last request. This is done by checking the Last-Modified header. Default value is false, ignoring the header. In jQuery 1.4 this technique also checks the 'etag' specified by the server to catch unmodified data.
     */
    ifModified?: boolean;
    /**
     * Allow the current environment to be recognized as "local," (e.g. the filesystem), even if jQuery does not recognize it as such by default. The following protocols are currently recognized as local: file, *-extension, and widget. If the isLocal setting needs modification, it is recommended to do so once in the $.ajaxSetup() method. (version added: 1.5.1)
     */
    isLocal?: boolean;
    /**
     * Override the callback function name in a jsonp request. This value will be used instead of 'callback' in the 'callback=?' part of the query string in the url. So {jsonp:'onJSONPLoad'} would result in 'onJSONPLoad=?' passed to the server. As of jQuery 1.5, setting the jsonp option to false prevents jQuery from adding the "?callback" string to the URL or attempting to use "=?" for transformation. In this case, you should also explicitly set the jsonpCallback setting. For example, { jsonp: false, jsonpCallback: "callbackName" }
     */
    jsonp?: any;
    /**
     * Specify the callback function name for a JSONP request. This value will be used instead of the random name automatically generated by jQuery. It is preferable to let jQuery generate a unique name as it'll make it easier to manage the requests and provide callbacks and error handling. You may want to specify the callback when you want to enable better browser caching of GET requests. As of jQuery 1.5, you can also use a function for this setting, in which case the value of jsonpCallback is set to the return value of that function.
     */
    jsonpCallback?: any;
    /**
     * A mime type to override the XHR mime type. (version added: 1.5.1)
     */
    mimeType?: string;
    /**
     * A password to be used with XMLHttpRequest in response to an HTTP access authentication request.
     */
    password?: string;
    /**
     * By default, data passed in to the data option as an object (technically, anything other than a string) will be processed and transformed into a query string, fitting to the default content-type "application/x-www-form-urlencoded". If you want to send a DOMDocument, or other non-processed data, set this option to false.
     */
    processData?: boolean;
    /**
     * Only applies when the "script" transport is used (e.g., cross-domain requests with "jsonp" or "script" dataType and "GET" type). Sets the charset attribute on the script tag used in the request. Used when the character set on the local page is not the same as the one on the remote script.
     */
    scriptCharset?: string;
    /**
     * An object of numeric HTTP codes and functions to be called when the response has the corresponding code. f the request is successful, the status code functions take the same parameters as the success callback; if it results in an error (including 3xx redirect), they take the same parameters as the error callback. (version added: 1.5)
     */
    statusCode?: { [key: string]: any; };
    /**
     * A function to be called if the request succeeds. The function gets passed three arguments: The data returned from the server, formatted according to the dataType parameter; a string describing the status; and the jqXHR (in jQuery 1.4.x, XMLHttpRequest) object. As of jQuery 1.5, the success setting can accept an array of functions. Each function will be called in turn. This is an Ajax Event.
     */
    success? (data: any, textStatus: string, jqXHR: JQueryXHR): any;
    /**
     * Set a timeout (in milliseconds) for the request. This will override any global timeout set with $.ajaxSetup(). The timeout period starts at the point the $.ajax call is made; if several other requests are in progress and the browser has no connections available, it is possible for a request to time out before it can be sent. In jQuery 1.4.x and below, the XMLHttpRequest object will be in an invalid state if the request times out; accessing any object members may throw an exception. In Firefox 3.0+ only, script and JSONP requests cannot be cancelled by a timeout; the script will run even if it arrives after the timeout period.
     */
    timeout?: number;
    /**
     * Set this to true if you wish to use the traditional style of param serialization.
     */
    traditional?: boolean;
    /**
     * The type of request to make ("POST" or "GET"), default is "GET". Note: Other HTTP request methods, such as PUT and DELETE, can also be used here, but they are not supported by all browsers.
     */
    type?: string;
    /**
     * A string containing the URL to which the request is sent.
     */
    url?: string;
    /**
     * A username to be used with XMLHttpRequest in response to an HTTP access authentication request.
     */
    username?: string;
    /**
     * Callback for creating the XMLHttpRequest object. Defaults to the ActiveXObject when available (IE), the XMLHttpRequest otherwise. Override to provide your own implementation for XMLHttpRequest or enhancements to the factory.
     */
    xhr?: any;
    /**
     * An object of fieldName-fieldValue pairs to set on the native XHR object. For example, you can use it to set withCredentials to true for cross-domain requests if needed. In jQuery 1.5, the withCredentials property was not propagated to the native XHR and thus CORS requests requiring it would ignore this flag. For this reason, we recommend using jQuery 1.5.1+ should you require the use of it. (version added: 1.5.1)
     */
    xhrFields?: { [key: string]: any; };
}

/**
 * Interface for the jqXHR object
 */
interface JQueryXHR extends XMLHttpRequest, JQueryPromise<any> {
    /**
     * The .overrideMimeType() method may be used in the beforeSend() callback function, for example, to modify the response content-type header. As of jQuery 1.5.1, the jqXHR object also contains the overrideMimeType() method (it was available in jQuery 1.4.x, as well, but was temporarily removed in jQuery 1.5). 
     */
    overrideMimeType(mimeType: string): any;
    /**
     * Cancel the request. 
     *
     * @param statusText A string passed as the textStatus parameter for the done callback. Default value: "canceled"
     */
    abort(statusText?: string): void;
    /**
     * Incorporates the functionality of the .done() and .fail() methods, allowing (as of jQuery 1.8) the underlying Promise to be manipulated. Refer to deferred.then() for implementation details.
     */
    then(doneCallback: (data: any, textStatus: string, jqXHR: JQueryXHR) => void, failCallback?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => void): JQueryPromise<any>;
    /**
     * Property containing the parsed response if the response Content-Type is json
     */
    responseJSON?: any;
}

/**
 * Interface for the JQuery callback
 */
interface JQueryCallback {
    /**
     * Add a callback or a collection of callbacks to a callback list.
     * 
     * @param callbacks A function, or array of functions, that are to be added to the callback list.
     */
    add(callbacks: Function): JQueryCallback;
    /**
     * Add a callback or a collection of callbacks to a callback list.
     * 
     * @param callbacks A function, or array of functions, that are to be added to the callback list.
     */
    add(callbacks: Function[]): JQueryCallback;

    /**
     * Disable a callback list from doing anything more.
     */
    disable(): JQueryCallback;

    /**
     * Determine if the callbacks list has been disabled.
     */
    disabled(): boolean;

    /**
     * Remove all of the callbacks from a list.
     */
    empty(): JQueryCallback;

    /**
     * Call all of the callbacks with the given arguments
     * 
     * @param arguments The argument or list of arguments to pass back to the callback list.
     */
    fire(...arguments: any[]): JQueryCallback;

    /**
     * Determine if the callbacks have already been called at least once.
     */
    fired(): boolean;

    /**
     * Call all callbacks in a list with the given context and arguments.
     * 
     * @param context A reference to the context in which the callbacks in the list should be fired.
     * @param arguments An argument, or array of arguments, to pass to the callbacks in the list.
     */
    fireWith(context?: any, ...args: any[]): JQueryCallback;

    /**
     * Determine whether a supplied callback is in a list
     * 
     * @param callback The callback to search for.
     */
    has(callback: Function): boolean;

    /**
     * Lock a callback list in its current state.
     */
    lock(): JQueryCallback;

    /**
     * Determine if the callbacks list has been locked.
     */
    locked(): boolean;

    /**
     * Remove a callback or a collection of callbacks from a callback list.
     * 
     * @param callbacks A function, or array of functions, that are to be removed from the callback list.
     */
    remove(callbacks: Function): JQueryCallback;
    /**
     * Remove a callback or a collection of callbacks from a callback list.
     * 
     * @param callbacks A function, or array of functions, that are to be removed from the callback list.
     */
    remove(callbacks: Function[]): JQueryCallback;
}

/**
 * Allows jQuery Promises to interop with non-jQuery promises
 */
interface JQueryGenericPromise<T> {
    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     */
    then<U>(doneFilter: (value: T) => U, failFilter?: (reason: any) => U): JQueryGenericPromise<U>;
    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     */
    then<U>(doneFilter: (value: T) => JQueryGenericPromise<U>, failFilter?: (reason: any) => U): JQueryGenericPromise<U>;
    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     */
    then<U>(doneFilter: (value: T) => U, failFilter?: (reason: any) => JQueryGenericPromise<U>): JQueryGenericPromise<U>;
    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     */
    then<U>(doneFilter: (value: T) => JQueryGenericPromise<U>, failFilter?: (reason: any) => JQueryGenericPromise<U>): JQueryGenericPromise<U>;
}

/**
 * Interface for the JQuery promise/deferred callbacks
 */
interface JQueryPromiseCallback<T> {
    (value?: T, ...args: any[]): void;
}

interface JQueryPromiseOperator<T, R> {
    (callback: JQueryPromiseCallback<T>, ...callbacks: JQueryPromiseCallback<T>[]): JQueryPromise<R>;
    (callback: JQueryPromiseCallback<T>[], ...callbacks: JQueryPromiseCallback<T>[]): JQueryPromise<R>;
}

/**
 * Interface for the JQuery promise, part of callbacks
 */
interface JQueryPromise<T> {
    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     */
    always: JQueryPromiseOperator<any, T>;
    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     */
    done: JQueryPromiseOperator<T, T>;
    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     */
    fail: JQueryPromiseOperator<any, T>;
    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     */
    progress(progressCallback: JQueryPromiseCallback<T>): JQueryPromise<T>;
    progress(progressCallbacks: JQueryPromiseCallback<T>[]): JQueryPromise<T>;

    /**
     * Determine the current state of a Deferred object.
     */
    state(): string;

    // Deprecated - given no typings
    pipe(doneFilter?: (x: any) => any, failFilter?: (x: any) => any, progressFilter?: (x: any) => any): JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     * @param progressFilter An optional function that is called when progress notifications are sent to the Deferred.
     */
    then<U>(doneFilter: (value: T) => U, failFilter?: (...reasons: any[]) => U, progressFilter?: (...progression: any[]) => any): JQueryPromise<U>;
    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     * @param progressFilter An optional function that is called when progress notifications are sent to the Deferred.
     */
    then<U>(doneFilter: (value: T) => JQueryGenericPromise<U>, failFilter?: (...reasons: any[]) => U, progressFilter?: (...progression: any[]) => any): JQueryPromise<U>;
    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     * @param progressFilter An optional function that is called when progress notifications are sent to the Deferred.
     */
    then<U>(doneFilter: (value: T) => U, failFilter?: (...reasons: any[]) => JQueryGenericPromise<U>, progressFilter?: (...progression: any[]) => any): JQueryPromise<U>;
    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     * @param progressFilter An optional function that is called when progress notifications are sent to the Deferred.
     */
    then<U>(doneFilter: (value: T) => JQueryGenericPromise<U>, failFilter?: (...reasons: any[]) => JQueryGenericPromise<U>, progressFilter?: (...progression: any[]) => any): JQueryPromise<U>;

    // Because JQuery Promises Suck
    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     * @param progressFilter An optional function that is called when progress notifications are sent to the Deferred.
     */
    then<U>(doneFilter: (...values: any[]) => U, failFilter?: (...reasons: any[]) => U, progressFilter?: (...progression: any[]) => any): JQueryPromise<U>;
    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     * @param progressFilter An optional function that is called when progress notifications are sent to the Deferred.
     */
    then<U>(doneFilter: (...values: any[]) => JQueryGenericPromise<U>, failFilter?: (...reasons: any[]) => U, progressFilter?: (...progression: any[]) => any): JQueryPromise<U>;
    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     * @param progressFilter An optional function that is called when progress notifications are sent to the Deferred.
     */
    then<U>(doneFilter: (...values: any[]) => U, failFilter?: (...reasons: any[]) => JQueryGenericPromise<U>, progressFilter?: (...progression: any[]) => any): JQueryPromise<U>;
    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     * @param progressFilter An optional function that is called when progress notifications are sent to the Deferred.
     */
    then<U>(doneFilter: (...values: any[]) => JQueryGenericPromise<U>, failFilter?: (...reasons: any[]) => JQueryGenericPromise<U>, progressFilter?: (...progression: any[]) => any): JQueryPromise<U>;
}

/**
 * Interface for the JQuery deferred, part of callbacks
 */
interface JQueryDeferred<T> extends JQueryPromise<T> {
    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     */
    always(alwaysCallbacks1?: JQueryPromiseCallback<T>, ...alwaysCallbacks2: JQueryPromiseCallback<T>[]): JQueryDeferred<T>;
    always(alwaysCallbacks1?: JQueryPromiseCallback<T>[], ...alwaysCallbacks2: JQueryPromiseCallback<T>[]): JQueryDeferred<T>;
    always(alwaysCallbacks1?: JQueryPromiseCallback<T>, ...alwaysCallbacks2: any[]): JQueryDeferred<T>;
    always(alwaysCallbacks1?: JQueryPromiseCallback<T>[], ...alwaysCallbacks2: any[]): JQueryDeferred<T>;
    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     */
    done(doneCallbacks1?: JQueryPromiseCallback<T>, ...doneCallbacks2: JQueryPromiseCallback<T>[]): JQueryDeferred<T>;
    done(doneCallbacks1?: JQueryPromiseCallback<T>[], ...doneCallbacks2: JQueryPromiseCallback<T>[]): JQueryDeferred<T>;
    done(doneCallbacks1?: JQueryPromiseCallback<T>, ...doneCallbacks2: any[]): JQueryDeferred<T>;
    done(doneCallbacks1?: JQueryPromiseCallback<T>[], ...doneCallbacks2: any[]): JQueryDeferred<T>;
    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     */
    fail(failCallbacks1?: JQueryPromiseCallback<T>, ...failCallbacks2: JQueryPromiseCallback<T>[]): JQueryDeferred<T>;
    fail(failCallbacks1?: JQueryPromiseCallback<T>[], ...failCallbacks2: JQueryPromiseCallback<T>[]): JQueryDeferred<T>;
    fail(failCallbacks1?: JQueryPromiseCallback<T>, ...failCallbacks2: any[]): JQueryDeferred<T>;
    fail(failCallbacks1?: JQueryPromiseCallback<T>[], ...failCallbacks2: any[]): JQueryDeferred<T>;
    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     */
    progress(progressCallback: JQueryPromiseCallback<T>): JQueryDeferred<T>;
    progress(progressCallbacks: JQueryPromiseCallback<T>[]): JQueryDeferred<T>;

    /**
     * Call the progressCallbacks on a Deferred object with the given args.
     * 
     * @param args Optional arguments that are passed to the progressCallbacks.
     */
    notify(...args: any[]): JQueryDeferred<T>;

    /**
     * Call the progressCallbacks on a Deferred object with the given context and args.
     * 
     * @param context Context passed to the progressCallbacks as the this object.
     * @param args Optional arguments that are passed to the progressCallbacks.
     */
    notifyWith(context: any, ...args: any[]): JQueryDeferred<T>;

    /**
     * Reject a Deferred object and call any failCallbacks with the given args.
     * 
     * @param args Optional arguments that are passed to the failCallbacks.
     */
    reject(...args: any[]): JQueryDeferred<T>;
    /**
     * Reject a Deferred object and call any failCallbacks with the given context and args.
     * 
     * @param context Context passed to the failCallbacks as the this object.
     * @param args An optional array of arguments that are passed to the failCallbacks.
     */
    rejectWith(context: any, ...args: any[]): JQueryDeferred<T>;

    /**
     * Resolve a Deferred object and call any doneCallbacks with the given args.
     * 
     * @param value First argument passed to doneCallbacks.
     * @param args Optional subsequent arguments that are passed to the doneCallbacks.
     */
    resolve(value?: T, ...args: any[]): JQueryDeferred<T>;

    /**
     * Resolve a Deferred object and call any doneCallbacks with the given context and args.
     * 
     * @param context Context passed to the doneCallbacks as the this object.
     * @param args An optional array of arguments that are passed to the doneCallbacks.
     */
    resolveWith(context: any, ...args: any[]): JQueryDeferred<T>;

    /**
     * Return a Deferred's Promise object.
     * 
     * @param target Object onto which the promise methods have to be attached
     */
    promise(target?: any): JQueryPromise<T>;
}

/**
 * Interface of the JQuery extension of the W3C event object
 */
interface BaseJQueryEventObject extends Event {
    data: any;
    delegateTarget: Element;
    isDefaultPrevented(): boolean;
    isImmediatePropagationStopped(): boolean;
    isPropagationStopped(): boolean;
    namespace: string;
    originalEvent: Event;
    preventDefault(): any;
    relatedTarget: Element;
    result: any;
    stopImmediatePropagation(): void;
    stopPropagation(): void;
    pageX: number;
    pageY: number;
    which: number;
    metaKey: boolean;
}

interface JQueryInputEventObject extends BaseJQueryEventObject {
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
}

interface JQueryMouseEventObject extends JQueryInputEventObject {
    button: number;
    clientX: number;
    clientY: number;
    offsetX: number;
    offsetY: number;
    pageX: number;
    pageY: number;
    screenX: number;
    screenY: number;
}

interface JQueryKeyEventObject extends JQueryInputEventObject {
    char: any;
    charCode: number;
    key: any;
    keyCode: number;
}

interface JQueryEventObject extends BaseJQueryEventObject, JQueryInputEventObject, JQueryMouseEventObject, JQueryKeyEventObject {
}

interface JQueryPostMessageEvent extends JQueryEventObject {
    originalEvent: PostMessageEvent;
}

interface PostMessageEvent extends BaseJQueryEventObject {
    data: string;
    source: Window;
}

/*
    Collection of properties of the current browser
*/

interface JQuerySupport {
    ajax?: boolean;
    boxModel?: boolean;
    changeBubbles?: boolean;
    checkClone?: boolean;
    checkOn?: boolean;
    cors?: boolean;
    cssFloat?: boolean;
    hrefNormalized?: boolean;
    htmlSerialize?: boolean;
    leadingWhitespace?: boolean;
    noCloneChecked?: boolean;
    noCloneEvent?: boolean;
    opacity?: boolean;
    optDisabled?: boolean;
    optSelected?: boolean;
    scriptEval? (): boolean;
    style?: boolean;
    submitBubbles?: boolean;
    tbody?: boolean;
}

interface JQueryParam {
    /**
     * Create a serialized representation of an array or object, suitable for use in a URL query string or Ajax request.
     * 
     * @param obj An array or object to serialize.
     */
    (obj: any): string;

    /**
     * Create a serialized representation of an array or object, suitable for use in a URL query string or Ajax request.
     * 
     * @param obj An array or object to serialize.
     * @param traditional A Boolean indicating whether to perform a traditional "shallow" serialization.
     */
    (obj: any, traditional: boolean): string;
}

/**
 * The interface used to construct jQuery events (with $.Event). It is
 * defined separately instead of inline in JQueryStatic to allow
 * overriding the construction function with specific strings
 * returning specific event objects.
 */
interface JQueryEventConstructor {
    (name: string, eventProperties?: any): JQueryEventObject;
    new (name: string, eventProperties?: any): JQueryEventObject;
}

/**
 * The interface used to specify coordinates.
 */
interface JQueryCoordinates {
    left: number;
    top: number;
}

interface JQueryAnimationOptions {
    /**
     * A string or number determining how long the animation will run.
     */
    duration?: any;
    /**
     * A string indicating which easing function to use for the transition.
     */
    easing?: string;
    /**
     * A function to call once the animation is complete.
     */
    complete?: Function;
    /**
     * A function to be called for each animated property of each animated element. This function provides an opportunity to modify the Tween object to change the value of the property before it is set.
     */
    step?: (now: number, tween: any) => any;
    /**
     * A function to be called after each step of the animation, only once per animated element regardless of the number of animated properties. (version added: 1.8)
     */
    progress?: (animation: JQueryPromise<any>, progress: number, remainingMs: number) => any;
    /**
     * A function to call when the animation begins. (version added: 1.8)
     */
    start?: (animation: JQueryPromise<any>) => any;
    /**
     * A function to be called when the animation completes (its Promise object is resolved). (version added: 1.8)
     */
    done?: (animation: JQueryPromise<any>, jumpedToEnd: boolean) => any;
    /**
     * A function to be called when the animation fails to complete (its Promise object is rejected). (version added: 1.8)
     */
    fail?: (animation: JQueryPromise<any>, jumpedToEnd: boolean) => any;
    /**
     * A function to be called when the animation completes or stops without completing (its Promise object is either resolved or rejected). (version added: 1.8)
     */
    always?: (animation: JQueryPromise<any>, jumpedToEnd: boolean) => any;
    /**
     * A Boolean indicating whether to place the animation in the effects queue. If false, the animation will begin immediately. As of jQuery 1.7, the queue option can also accept a string, in which case the animation is added to the queue represented by that string. When a custom queue name is used the animation does not automatically start; you must call .dequeue("queuename") to start it.
     */
    queue?: any;
    /**
     * A map of one or more of the CSS properties defined by the properties argument and their corresponding easing functions. (version added: 1.4)
     */
    specialEasing?: Object;
}

/**
 * Static members of jQuery (those on $ and jQuery themselves)
 */
interface JQueryStatic {

    /**
     * Perform an asynchronous HTTP (Ajax) request.
     *
     * @param settings A set of key/value pairs that configure the Ajax request. All settings are optional. A default can be set for any option with $.ajaxSetup().
     */
    ajax(settings: JQueryAjaxSettings): JQueryXHR;
    /**
     * Perform an asynchronous HTTP (Ajax) request.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param settings A set of key/value pairs that configure the Ajax request. All settings are optional. A default can be set for any option with $.ajaxSetup().
     */
    ajax(url: string, settings?: JQueryAjaxSettings): JQueryXHR;

    /**
     * Handle custom Ajax options or modify existing options before each request is sent and before they are processed by $.ajax().
     *
     * @param dataTypes An optional string containing one or more space-separated dataTypes
     * @param handler A handler to set default values for future Ajax requests.
     */
    ajaxPrefilter(dataTypes: string, handler: (opts: any, originalOpts: JQueryAjaxSettings, jqXHR: JQueryXHR) => any): void;
    /**
     * Handle custom Ajax options or modify existing options before each request is sent and before they are processed by $.ajax().
     *
     * @param handler A handler to set default values for future Ajax requests.
     */
    ajaxPrefilter(handler: (opts: any, originalOpts: JQueryAjaxSettings, jqXHR: JQueryXHR) => any): void;

    ajaxSettings: JQueryAjaxSettings;

    /**
     * Set default values for future Ajax requests. Its use is not recommended.
     *
     * @param options A set of key/value pairs that configure the default Ajax request. All options are optional.
     */
    ajaxSetup(options: JQueryAjaxSettings): void;

    /**
     * Load data from the server using a HTTP GET request.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param success A callback function that is executed if the request succeeds.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, or html).
     */
    get(url: string, success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => any, dataType?: string): JQueryXHR;
    /**
     * Load data from the server using a HTTP GET request.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, or html).
     */
    get(url: string, data?: Object, success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => any, dataType?: string): JQueryXHR;
    /**
     * Load data from the server using a HTTP GET request.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, or html).
     */
    get(url: string, data?: string, success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => any, dataType?: string): JQueryXHR;
    /**
     * Load JSON-encoded data from the server using a GET HTTP request.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param success A callback function that is executed if the request succeeds.
     */
    getJSON(url: string, success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => any): JQueryXHR;
    /**
     * Load JSON-encoded data from the server using a GET HTTP request.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds.
     */
    getJSON(url: string, data?: Object, success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => any): JQueryXHR;
    /**
     * Load JSON-encoded data from the server using a GET HTTP request.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds.
     */
    getJSON(url: string, data?: string, success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => any): JQueryXHR;
    /**
     * Load a JavaScript file from the server using a GET HTTP request, then execute it.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param success A callback function that is executed if the request succeeds.
     */
    getScript(url: string, success?: (script: string, textStatus: string, jqXHR: JQueryXHR) => any): JQueryXHR;

    /**
     * Create a serialized representation of an array or object, suitable for use in a URL query string or Ajax request.
     */
    param: JQueryParam;

    /**
     * Load data from the server using a HTTP POST request.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param success A callback function that is executed if the request succeeds. Required if dataType is provided, but can be null in that case.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, text, html).
     */
    post(url: string, success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => any, dataType?: string): JQueryXHR;
    /**
     * Load data from the server using a HTTP POST request.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds. Required if dataType is provided, but can be null in that case.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, text, html).
     */
    post(url: string, data?: Object, success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => any, dataType?: string): JQueryXHR;
    /**
     * Load data from the server using a HTTP POST request.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds. Required if dataType is provided, but can be null in that case.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, text, html).
     */
    post(url: string, data?: string, success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => any, dataType?: string): JQueryXHR;

    /**
     * A multi-purpose callbacks list object that provides a powerful way to manage callback lists.
     *
     * @param flags An optional list of space-separated flags that change how the callback list behaves.
     */
    Callbacks(flags?: string): JQueryCallback;

    /**
     * Holds or releases the execution of jQuery's ready event.
     *
     * @param hold Indicates whether the ready hold is being requested or released
     */
    holdReady(hold: boolean): void;

    /**
     * Accepts a string containing a CSS selector which is then used to match a set of elements.
     *
     * @param selector A string containing a selector expression
     * @param context A DOM Element, Document, or jQuery to use as context
     */
    (selector: string, context?: Element): JQuery;
    /**
     * Accepts a string containing a CSS selector which is then used to match a set of elements.
     *
     * @param selector A string containing a selector expression
     * @param context A DOM Element, Document, or jQuery to use as context
     */
    (selector: string, context?: JQuery): JQuery;
    /**
     * Accepts a string containing a CSS selector which is then used to match a set of elements.
     *
     * @param element A DOM element to wrap in a jQuery object.
     */
    (element: Element): JQuery;
    /**
     * Accepts a string containing a CSS selector which is then used to match a set of elements.
     *
     * @param elementArray An array containing a set of DOM elements to wrap in a jQuery object.
     */
    (elementArray: Element[]): JQuery;
    /**
     * Accepts a string containing a CSS selector which is then used to match a set of elements.
     *
     * @param object A plain object to wrap in a jQuery object.
     */
    (object: {}): JQuery;
    /**
     * Accepts a string containing a CSS selector which is then used to match a set of elements.
     *
     * @param object An existing jQuery object to clone.
     */
    (object: JQuery): JQuery;
    /**
     * Specify a function to execute when the DOM is fully loaded.
     */
    (): JQuery;

    /**
     * Creates DOM elements on the fly from the provided string of raw HTML.
     *
     * @param html A string of HTML to create on the fly. Note that this parses HTML, not XML.
     * @param ownerDocument A document in which the new elements will be created.
     */
    (html: string, ownerDocument?: Document): JQuery;
    /**
     * Creates DOM elements on the fly from the provided string of raw HTML.
     *
     * @param html A string defining a single, standalone, HTML element (e.g. <div/> or <div></div>).
     * @param attributes An object of attributes, events, and methods to call on the newly-created element.
     */
    (html: string, attributes: Object): JQuery;

    /**
     * Binds a function to be executed when the DOM has finished loading.
     *
     * @param callback A function to execute after the DOM is ready.
     */
    (callback: Function): JQuery;

    /**
     * Relinquish jQuery's control of the $ variable.
     *
     * @param removeAll A Boolean indicating whether to remove all jQuery variables from the global scope (including jQuery itself).
     */
    noConflict(removeAll?: boolean): Object;

    /**
     * Provides a way to execute callback functions based on one or more objects, usually Deferred objects that represent asynchronous events.
     *
     * @param deferreds One or more Deferred objects, or plain JavaScript objects.
     */
    when<T>(...deferreds: JQueryGenericPromise<T>[]): JQueryPromise<T>;
    /**
     * Provides a way to execute callback functions based on one or more objects, usually Deferred objects that represent asynchronous events.
     *
     * @param deferreds One or more Deferred objects, or plain JavaScript objects.
     */
    when<T>(...deferreds: T[]): JQueryPromise<T>;
    /**
     * Provides a way to execute callback functions based on one or more objects, usually Deferred objects that represent asynchronous events.
     *
     * @param deferreds One or more Deferred objects, or plain JavaScript objects.
     */
    when<T>(...deferreds: any[]): JQueryPromise<T>;

    /**
     * Hook directly into jQuery to override how particular CSS properties are retrieved or set, normalize CSS property naming, or create custom properties.
     */
    cssHooks: { [key: string]: any; };
    cssNumber: any;

    /**
     * Store arbitrary data associated with the specified element. Returns the value that was set.
     *
     * @param element The DOM element to associate with the data.
     * @param key A string naming the piece of data to set.
     * @param value The new data value.
     */
    data<T>(element: Element, key: string, value: T): T;
    /**
     * Returns value at named data store for the element, as set by jQuery.data(element, name, value), or the full data store for the element.
     *
     * @param element The DOM element to associate with the data.
     * @param key A string naming the piece of data to set.
     */
    data(element: Element, key: string): any;
    /**
     * Returns value at named data store for the element, as set by jQuery.data(element, name, value), or the full data store for the element.
     *
     * @param element The DOM element to associate with the data.
     */
    data(element: Element): any;

    /**
     * Execute the next function on the queue for the matched element.
     *
     * @param element A DOM element from which to remove and execute a queued function.
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     */
    dequeue(element: Element, queueName?: string): void;

    /**
     * Determine whether an element has any jQuery data associated with it.
     *
     * @param element A DOM element to be checked for data.
     */
    hasData(element: Element): boolean;

    /**
     * Show the queue of functions to be executed on the matched element.
     *
     * @param element A DOM element to inspect for an attached queue.
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     */
    queue(element: Element, queueName?: string): any[];
    /**
     * Manipulate the queue of functions to be executed on the matched element.
     *
     * @param element A DOM element where the array of queued functions is attached.
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @param newQueue An array of functions to replace the current queue contents.
     */
    queue(element: Element, queueName: string, newQueue: Function[]): JQuery;
    /**
     * Manipulate the queue of functions to be executed on the matched element.
     *
     * @param element A DOM element on which to add a queued function.
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @param callback The new function to add to the queue.
     */
    queue(element: Element, queueName: string, callback: Function): JQuery;

    /**
     * Remove a previously-stored piece of data.
     *
     * @param element A DOM element from which to remove data.
     * @param name A string naming the piece of data to remove.
     */
    removeData(element: Element, name?: string): JQuery;

    /**
     * A constructor function that returns a chainable utility object with methods to register multiple callbacks into callback queues, invoke callback queues, and relay the success or failure state of any synchronous or asynchronous function.
     *
     * @param beforeStart A function that is called just before the constructor returns.
     */
    Deferred<T>(beforeStart?: (deferred: JQueryDeferred<T>) => any): JQueryDeferred<T>;

    /**
     * Effects
     */
    fx: {
        tick: () => void;
        /**
         * The rate (in milliseconds) at which animations fire.
         */
        interval: number;
        stop: () => void;
        speeds: { slow: number; fast: number; };
        /**
         * Globally disable all animations.
         */
        off: boolean;
        step: any;
    };

    /**
     * Takes a function and returns a new one that will always have a particular context.
     *
     * @param fnction The function whose context will be changed.
     * @param context The object to which the context (this) of the function should be set.
     * @param additionalArguments Any number of arguments to be passed to the function referenced in the function argument.
     */
    proxy(fnction: (...args: any[]) => any, context: Object, ...additionalArguments: any[]): any;
    /**
     * Takes a function and returns a new one that will always have a particular context.
     *
     * @param context The object to which the context (this) of the function should be set.
     * @param name The name of the function whose context will be changed (should be a property of the context object).
     * @param additionalArguments Any number of arguments to be passed to the function named in the name argument.
     */
    proxy(context: Object, name: string, ...additionalArguments: any[]): any;

    Event: JQueryEventConstructor;

    /**
     * Takes a string and throws an exception containing it.
     *
     * @param message The message to send out.
     */
    error(message: any): JQuery;

    expr: any;
    fn: any;  //TODO: Decide how we want to type this

    isReady: boolean;

    // Properties
    support: JQuerySupport;

    /**
     * Check to see if a DOM element is a descendant of another DOM element.
     * 
     * @param container The DOM element that may contain the other element.
     * @param contained The DOM element that may be contained by (a descendant of) the other element.
     */
    contains(container: Element, contained: Element): boolean;

    /**
     * A generic iterator function, which can be used to seamlessly iterate over both objects and arrays. Arrays and array-like objects with a length property (such as a function's arguments object) are iterated by numeric index, from 0 to length-1. Other objects are iterated via their named properties.
     * 
     * @param collection The object or array to iterate over.
     * @param callback The function that will be executed on every object.
     */
    each<T>(
        collection: T[],
        callback: (indexInArray: number, valueOfElement: T) => any
        ): any;

    /**
     * A generic iterator function, which can be used to seamlessly iterate over both objects and arrays. Arrays and array-like objects with a length property (such as a function's arguments object) are iterated by numeric index, from 0 to length-1. Other objects are iterated via their named properties.
     * 
     * @param collection The object or array to iterate over.
     * @param callback The function that will be executed on every object.
     */
    each(
        collection: any,
        callback: (indexInArray: any, valueOfElement: any) => any
        ): any;

    /**
     * Merge the contents of two or more objects together into the first object.
     *
     * @param target An object that will receive the new properties if additional objects are passed in or that will extend the jQuery namespace if it is the sole argument.
     * @param object1 An object containing additional properties to merge in.
     * @param objectN Additional objects containing properties to merge in.
     */
    extend(target: any, object1?: any, ...objectN: any[]): any;
    /**
     * Merge the contents of two or more objects together into the first object.
     *
     * @param deep If true, the merge becomes recursive (aka. deep copy).
     * @param target The object to extend. It will receive the new properties.
     * @param object1 An object containing additional properties to merge in.
     * @param objectN Additional objects containing properties to merge in.
     */
    extend(deep: boolean, target: any, object1?: any, ...objectN: any[]): any;

    /**
     * Execute some JavaScript code globally.
     *
     * @param code The JavaScript code to execute.
     */
    globalEval(code: string): any;

    /**
     * Finds the elements of an array which satisfy a filter function. The original array is not affected.
     *
     * @param array The array to search through.
     * @param func The function to process each item against. The first argument to the function is the item, and the second argument is the index. The function should return a Boolean value.  this will be the global window object.
     * @param invert If "invert" is false, or not provided, then the function returns an array consisting of all elements for which "callback" returns true. If "invert" is true, then the function returns an array consisting of all elements for which "callback" returns false.
     */
    grep<T>(array: T[], func: (elementOfArray: T, indexInArray: number) => boolean, invert?: boolean): T[];

    /**
     * Search for a specified value within an array and return its index (or -1 if not found).
     *
     * @param value The value to search for.
     * @param array An array through which to search.
     * @param fromIndex he index of the array at which to begin the search. The default is 0, which will search the whole array.
     */
    inArray<T>(value: T, array: T[], fromIndex?: number): number;

    /**
     * Determine whether the argument is an array.
     *
     * @param obj Object to test whether or not it is an array.
     */
    isArray(obj: any): boolean;
    /**
     * Check to see if an object is empty (contains no enumerable properties).
     *
     * @param obj The object that will be checked to see if it's empty.
     */
    isEmptyObject(obj: any): boolean;
    /**
     * Determine if the argument passed is a Javascript function object.
     *
     * @param obj Object to test whether or not it is a function.
     */
    isFunction(obj: any): boolean;
    /**
     * Determines whether its argument is a number.
     *
     * @param obj The value to be tested.
     */
    isNumeric(value: any): boolean;
    /**
     * Check to see if an object is a plain object (created using "{}" or "new Object").
     *
     * @param obj The object that will be checked to see if it's a plain object.
     */
    isPlainObject(obj: any): boolean;
    /**
     * Determine whether the argument is a window.
     *
     * @param obj Object to test whether or not it is a window.
     */
    isWindow(obj: any): boolean;
    /**
     * Check to see if a DOM node is within an XML document (or is an XML document).
     *
     * @param node he DOM node that will be checked to see if it's in an XML document.
     */
    isXMLDoc(node: Node): boolean;

    /**
     * Convert an array-like object into a true JavaScript array.
     * 
     * @param obj Any object to turn into a native Array.
     */
    makeArray(obj: any): any[];

    /**
     * Translate all items in an array or object to new array of items.
     * 
     * @param array The Array to translate.
     * @param callback The function to process each item against. The first argument to the function is the array item, the second argument is the index in array The function can return any value. Within the function, this refers to the global (window) object.
     */
    map<T, U>(array: T[], callback: (elementOfArray: T, indexInArray: number) => U): U[];
    /**
     * Translate all items in an array or object to new array of items.
     * 
     * @param arrayOrObject The Array or Object to translate.
     * @param callback The function to process each item against. The first argument to the function is the value; the second argument is the index or key of the array or object property. The function can return any value to add to the array. A returned array will be flattened into the resulting array. Within the function, this refers to the global (window) object.
     */
    map(arrayOrObject: any, callback: (value: any, indexOrKey: any) => any): any;

    /**
     * Merge the contents of two arrays together into the first array.
     * 
     * @param first The first array to merge, the elements of second added.
     * @param second The second array to merge into the first, unaltered.
     */
    merge<T>(first: T[], second: T[]): T[];

    /**
     * An empty function.
     */
    noop(): any;

    /**
     * Return a number representing the current time.
     */
    now(): number;

    /**
     * Takes a well-formed JSON string and returns the resulting JavaScript object.
     * 
     * @param json The JSON string to parse.
     */
    parseJSON(json: string): any;

    /**
     * Parses a string into an XML document.
     *
     * @param data a well-formed XML string to be parsed
     */
    parseXML(data: string): XMLDocument;

    /**
     * Remove the whitespace from the beginning and end of a string.
     * 
     * @param str Remove the whitespace from the beginning and end of a string.
     */
    trim(str: string): string;

    /**
     * Determine the internal JavaScript [[Class]] of an object.
     * 
     * @param obj Object to get the internal JavaScript [[Class]] of.
     */
    type(obj: any): string;

    /**
     * Sorts an array of DOM elements, in place, with the duplicates removed. Note that this only works on arrays of DOM elements, not strings or numbers.
     * 
     * @param array The Array of DOM elements.
     */
    unique(array: Element[]): Element[];

    /**
     * Parses a string into an array of DOM nodes.
     *
     * @param data HTML string to be parsed
     * @param context DOM element to serve as the context in which the HTML fragment will be created
     * @param keepScripts A Boolean indicating whether to include scripts passed in the HTML string
     */
    parseHTML(data: string, context?: HTMLElement, keepScripts?: boolean): any[];

    /**
     * Parses a string into an array of DOM nodes.
     *
     * @param data HTML string to be parsed
     * @param context DOM element to serve as the context in which the HTML fragment will be created
     * @param keepScripts A Boolean indicating whether to include scripts passed in the HTML string
     */
    parseHTML(data: string, context?: Document, keepScripts?: boolean): any[];
}

/**
 * The jQuery instance members
 */
interface JQuery {
    /**
     * Register a handler to be called when Ajax requests complete. This is an AjaxEvent.
     *
     * @param handler The function to be invoked.
     */
    ajaxComplete(handler: (event: JQueryEventObject, XMLHttpRequest: XMLHttpRequest, ajaxOptions: any) => any): JQuery;
    /**
     * Register a handler to be called when Ajax requests complete with an error. This is an Ajax Event.
     *
     * @param handler The function to be invoked.
     */
    ajaxError(handler: (event: JQueryEventObject, jqXHR: JQueryXHR, ajaxSettings: JQueryAjaxSettings, thrownError: any) => any): JQuery;
    /**
     * Attach a function to be executed before an Ajax request is sent. This is an Ajax Event.
     *
     * @param handler The function to be invoked.
     */
    ajaxSend(handler: (event: JQueryEventObject, jqXHR: JQueryXHR, ajaxOptions: JQueryAjaxSettings) => any): JQuery;
    /**
     * Register a handler to be called when the first Ajax request begins. This is an Ajax Event.
     *
     * @param handler The function to be invoked.
     */
    ajaxStart(handler: () => any): JQuery;
    /**
     * Register a handler to be called when all Ajax requests have completed. This is an Ajax Event.
     *
     * @param handler The function to be invoked.
     */
    ajaxStop(handler: () => any): JQuery;
    /**
     * Attach a function to be executed whenever an Ajax request completes successfully. This is an Ajax Event.
     *
     * @param handler The function to be invoked.
     */
    ajaxSuccess(handler: (event: JQueryEventObject, XMLHttpRequest: XMLHttpRequest, ajaxOptions: JQueryAjaxSettings) => any): JQuery;

    /**
     * Load data from the server and place the returned HTML into the matched element.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param data A plain object or string that is sent to the server with the request.
     * @param complete A callback function that is executed when the request completes.
     */
    load(url: string, data?: string, complete?: (responseText: string, textStatus: string, XMLHttpRequest: XMLHttpRequest) => any): JQuery;
    /**
     * Load data from the server and place the returned HTML into the matched element.
     *
     * @param url A string containing the URL to which the request is sent.
     * @param data A plain object or string that is sent to the server with the request.
     * @param complete A callback function that is executed when the request completes.
     */
    load(url: string, data?: Object, complete?: (responseText: string, textStatus: string, XMLHttpRequest: XMLHttpRequest) => any): JQuery;

    /**
     * Encode a set of form elements as a string for submission.
     */
    serialize(): string;
    /**
     * Encode a set of form elements as an array of names and values.
     */
    serializeArray(): Object[];

    /**
     * Adds the specified class(es) to each of the set of matched elements.
     *
     * @param className One or more space-separated classes to be added to the class attribute of each matched element.
     */
    addClass(className: string): JQuery;
    /**
     * Adds the specified class(es) to each of the set of matched elements.
     *
     * @param function A function returning one or more space-separated class names to be added to the existing class name(s). Receives the index position of the element in the set and the existing class name(s) as arguments. Within the function, this refers to the current element in the set.
     */
    addClass(func: (index: number, className: string) => string): JQuery;

    /**
     * Add the previous set of elements on the stack to the current set, optionally filtered by a selector.
     */
    addBack(selector?: string): JQuery;

    /**
     * Get the value of an attribute for the first element in the set of matched elements.
     *
     * @param attributeName The name of the attribute to get.
     */
    attr(attributeName: string): string;
    /**
     * Set one or more attributes for the set of matched elements.
     *
     * @param attributeName The name of the attribute to set.
     * @param value A value to set for the attribute.
     */
    attr(attributeName: string, value: string): JQuery;
    /**
     * Set one or more attributes for the set of matched elements.
     *
     * @param attributeName The name of the attribute to set.
     * @param value A value to set for the attribute.
     */
    attr(attributeName: string, value: number): JQuery;
    /**
     * Set one or more attributes for the set of matched elements.
     *
     * @param attributeName The name of the attribute to set.
     * @param func A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old attribute value as arguments.
     */
    attr(attributeName: string, func: (index: number, attr: any) => any): JQuery;
    /**
     * Set one or more attributes for the set of matched elements.
     *
     * @param attributes An object of attribute-value pairs to set.
     */
    attr(attributes: Object): JQuery;

    /**
     * Determine whether any of the matched elements are assigned the given class.
     *
     * @param className The class name to search for.
     */
    hasClass(className: string): boolean;

    /**
     * Get the HTML contents of the first element in the set of matched elements.
     */
    html(): string;
    /**
     * Set the HTML contents of each element in the set of matched elements.
     *
     * @param htmlString A string of HTML to set as the content of each matched element.
     */
    html(htmlString: string): JQuery;
    /**
     * Set the HTML contents of each element in the set of matched elements.
     *
     * @param func A function returning the HTML content to set. Receives the index position of the element in the set and the old HTML value as arguments. jQuery empties the element before calling the function; use the oldhtml argument to reference the previous content. Within the function, this refers to the current element in the set.
     */
    html(func: (index: number, oldhtml: string) => string): JQuery;
    /**
     * Set the HTML contents of each element in the set of matched elements.
     *
     * @param func A function returning the HTML content to set. Receives the index position of the element in the set and the old HTML value as arguments. jQuery empties the element before calling the function; use the oldhtml argument to reference the previous content. Within the function, this refers to the current element in the set.
     */

    /**
     * Get the value of a property for the first element in the set of matched elements.
     *
     * @param propertyName The name of the property to get.
     */
    prop(propertyName: string): any;
    /**
     * Set one or more properties for the set of matched elements.
     *
     * @param propertyName The name of the property to set.
     * @param value A value to set for the property.
     */
    prop(propertyName: string, value: string): JQuery;
    /**
     * Set one or more properties for the set of matched elements.
     *
     * @param propertyName The name of the property to set.
     * @param value A value to set for the property.
     */
    prop(propertyName: string, value: number): JQuery;
    /**
     * Set one or more properties for the set of matched elements.
     *
     * @param propertyName The name of the property to set.
     * @param value A value to set for the property.
     */
    prop(propertyName: string, value: boolean): JQuery;
    /**
     * Set one or more properties for the set of matched elements.
     *
     * @param properties An object of property-value pairs to set.
     */
    prop(properties: Object): JQuery;
    /**
     * Set one or more properties for the set of matched elements.
     *
     * @param propertyName The name of the property to set.
     * @param func A function returning the value to set. Receives the index position of the element in the set and the old property value as arguments. Within the function, the keyword this refers to the current element.
     */
    prop(propertyName: string, func: (index: number, oldPropertyValue: any) => any): JQuery;

    /**
     * Remove an attribute from each element in the set of matched elements.
     *
     * @param attributeName An attribute to remove; as of version 1.7, it can be a space-separated list of attributes.
     */
    removeAttr(attributeName: string): JQuery;

    /**
     * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
     *
     * @param className One or more space-separated classes to be removed from the class attribute of each matched element.
     */
    removeClass(className?: string): JQuery;
    /**
     * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
     *
     * @param function A function returning one or more space-separated class names to be removed. Receives the index position of the element in the set and the old class value as arguments.
     */
    removeClass(func: (index: number, className: string) => string): JQuery;

    /**
     * Remove a property for the set of matched elements.
     *
     * @param propertyName The name of the property to remove.
     */
    removeProp(propertyName: string): JQuery;

    /**
     * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the switch argument.
     *
     * @param className One or more class names (separated by spaces) to be toggled for each element in the matched set.
     * @param swtch A Boolean (not just truthy/falsy) value to determine whether the class should be added or removed.
     */
    toggleClass(className: string, swtch?: boolean): JQuery;
    /**
     * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the switch argument.
     *
     * @param swtch A boolean value to determine whether the class should be added or removed.
     */
    toggleClass(swtch?: boolean): JQuery;
    /**
     * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the switch argument.
     *
     * @param func A function that returns class names to be toggled in the class attribute of each element in the matched set. Receives the index position of the element in the set, the old class value, and the switch as arguments.
     * @param swtch A boolean value to determine whether the class should be added or removed.
     */
    toggleClass(func: (index: number, className: string, swtch: boolean) => string, swtch?: boolean): JQuery;

    /**
     * Get the current value of the first element in the set of matched elements.
     */
    val(): any;
    /**
     * Set the value of each element in the set of matched elements.
     *
     * @param value A string of text or an array of strings corresponding to the value of each matched element to set as selected/checked.
     */
    val(value: string): JQuery;
    /**
     * Set the value of each element in the set of matched elements.
     *
     * @param value A string of text or an array of strings corresponding to the value of each matched element to set as selected/checked.
     */
    val(value: string[]): JQuery;
    /**
     * Set the value of each element in the set of matched elements.
     *
     * @param func A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old value as arguments.
     */
    val(func: (index: number, value: string) => string): JQuery;
    /**
     * Set the value of each element in the set of matched elements.
     *
     * @param func A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old value as arguments.
     */
    val(func: (index: number, value: string[]) => string): JQuery;
    /**
     * Set the value of each element in the set of matched elements.
     *
     * @param func A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old value as arguments.
     */
    val(func: (index: number, value: number) => string): JQuery;
    /**
     * Set the value of each element in the set of matched elements.
     *
     * @param func A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old value as arguments.
     */
    val(func: (index: number, value: string) => string[]): JQuery;
    /**
     * Set the value of each element in the set of matched elements.
     *
     * @param func A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old value as arguments.
     */
    val(func: (index: number, value: string[]) => string[]): JQuery;
    /**
     * Set the value of each element in the set of matched elements.
     *
     * @param func A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old value as arguments.
     */
    val(func: (index: number, value: number) => string[]): JQuery;

    /**
     * Get the value of style properties for the first element in the set of matched elements.
     *
     * @param propertyName A CSS property.
     */
    css(propertyName: string): string;
    /**
     * Set one or more CSS properties for the set of matched elements.
     *
     * @param propertyName A CSS property name.
     * @param value A value to set for the property.
     */
    css(propertyName: string, value: string): JQuery;
    /**
     * Set one or more CSS properties for the set of matched elements.
     *
     * @param propertyName A CSS property name.
     * @param value A value to set for the property.
     */
    css(propertyName: string, value: number): JQuery;
    /**
     * Set one or more CSS properties for the set of matched elements.
     *
     * @param propertyName A CSS property name.
     * @param value A value to set for the property.
     */
    css(propertyName: string, value: string[]): JQuery;
    /**
     * Set one or more CSS properties for the set of matched elements.
     *
     * @param propertyName A CSS property name.
     * @param value A value to set for the property.
     */
    css(propertyName: string, value: number[]): JQuery;
    /**
     * Set one or more CSS properties for the set of matched elements.
     *
     * @param propertyName A CSS property name.
     * @param value A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old value as arguments.
     */
    css(propertyName: string, value: (index: number, value: string) => string): JQuery;
    /**
     * Set one or more CSS properties for the set of matched elements.
     *
     * @param propertyName A CSS property name.
     * @param value A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old value as arguments.
     */
    css(propertyName: string, value: (index: number, value: number) => number): JQuery;
    /**
     * Set one or more CSS properties for the set of matched elements.
     *
     * @param properties An object of property-value pairs to set.
     */
    css(properties: Object): JQuery;

    /**
     * Get the current computed height for the first element in the set of matched elements.
     */
    height(): number;
    /**
     * Set the CSS height of every matched element.
     *
     * @param value An integer representing the number of pixels, or an integer with an optional unit of measure appended (as a string).
     */
    height(value: number): JQuery;
    /**
     * Set the CSS height of every matched element.
     *
     * @param value An integer representing the number of pixels, or an integer with an optional unit of measure appended (as a string).
     */
    height(value: string): JQuery;
    /**
     * Set the CSS height of every matched element.
     *
     * @param func A function returning the height to set. Receives the index position of the element in the set and the old height as arguments. Within the function, this refers to the current element in the set.
     */
    height(func: (index: number, height: number) => number): JQuery;
    /**
     * Set the CSS height of every matched element.
     *
     * @param func A function returning the height to set. Receives the index position of the element in the set and the old height as arguments. Within the function, this refers to the current element in the set.
     */
    height(func: (index: number, height: string) => string): JQuery;
    /**
     * Set the CSS height of every matched element.
     *
     * @param func A function returning the height to set. Receives the index position of the element in the set and the old height as arguments. Within the function, this refers to the current element in the set.
     */
    height(func: (index: number, height: string) => number): JQuery;
    /**
     * Set the CSS height of every matched element.
     *
     * @param func A function returning the height to set. Receives the index position of the element in the set and the old height as arguments. Within the function, this refers to the current element in the set.
     */
    height(func: (index: number, height: number) => string): JQuery;

    /**
     * Get the current computed height for the first element in the set of matched elements, including padding but not border.
     */
    innerHeight(): number;

    /**
     * Sets the inner height on elements in the set of matched elements, including padding but not border.
     *
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     */
    innerHeight(height: number): JQuery;

    /**
     * Sets the inner height on elements in the set of matched elements, including padding but not border.
     *
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     */
    innerHeight(height: string): JQuery;

    /**
     * Get the current computed width for the first element in the set of matched elements, including padding but not border.
     */
    innerWidth(): number;

    /**
     * Sets the inner width on elements in the set of matched elements, including padding but not border.
     *
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     */
    innerWidth(width: number): JQuery;

    /**
     * Sets the inner width on elements in the set of matched elements, including padding but not border.
     *
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     */
    innerWidth(width: string): JQuery;

    /**
     * Get the current coordinates of the first element in the set of matched elements, relative to the document.
     */
    offset(): JQueryCoordinates;
    /**
     * An object containing the properties top and left, which are integers indicating the new top and left coordinates for the elements.
     *
     * @param coordinates An object containing the properties top and left, which are integers indicating the new top and left coordinates for the elements.
     */
    offset(coordinates: JQueryCoordinates): JQuery;
    /**
     * An object containing the properties top and left, which are integers indicating the new top and left coordinates for the elements.
     *
     * @param func A function to return the coordinates to set. Receives the index of the element in the collection as the first argument and the current coordinates as the second argument. The function should return an object with the new top and left properties.
     */
    offset(func: (index: number, coords: JQueryCoordinates) => JQueryCoordinates): JQuery;

    /**
     * Get the current computed height for the first element in the set of matched elements, including padding, border, and optionally margin. Returns an integer (without "px") representation of the value or null if called on an empty set of elements.
     *
     * @param includeMargin A Boolean indicating whether to include the element's margin in the calculation.
     */
    outerHeight(includeMargin?: boolean): number;

    /**
     * Sets the outer height on elements in the set of matched elements, including padding and border.
     *
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     */
    outerHeight(height: number): JQuery;

    /**
     * Sets the outer height on elements in the set of matched elements, including padding and border.
     *
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     */
    outerHeight(height: string): JQuery;

    /**
     * Get the current computed width for the first element in the set of matched elements, including padding and border.
     *
     * @param includeMargin A Boolean indicating whether to include the element's margin in the calculation.
     */
    outerWidth(includeMargin?: boolean): number;

    /**
     * Sets the outer width on elements in the set of matched elements, including padding and border.
     *
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     */
    outerWidth(width: number): JQuery;

    /**
     * Sets the outer width on elements in the set of matched elements, including padding and border.
     *
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     */
    outerWidth(width: string): JQuery;

    /**
     * Get the current coordinates of the first element in the set of matched elements, relative to the offset parent.
     */
    position(): JQueryCoordinates;

    /**
     * Get the current horizontal position of the scroll bar for the first element in the set of matched elements or set the horizontal position of the scroll bar for every matched element.
     */
    scrollLeft(): number;
    /**
     * Set the current horizontal position of the scroll bar for each of the set of matched elements.
     *
     * @param value An integer indicating the new position to set the scroll bar to.
     */
    scrollLeft(value: number): JQuery;

    /**
     * Get the current vertical position of the scroll bar for the first element in the set of matched elements or set the vertical position of the scroll bar for every matched element.
     */
    scrollTop(): number;
    /**
     * Set the current vertical position of the scroll bar for each of the set of matched elements.
     *
     * @param value An integer indicating the new position to set the scroll bar to.
     */
    scrollTop(value: number): JQuery;

    /**
     * Get the current computed width for the first element in the set of matched elements.
     */
    width(): number;
    /**
     * Set the CSS width of each element in the set of matched elements.
     *
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     */
    width(value: number): JQuery;
    /**
     * Set the CSS width of each element in the set of matched elements.
     *
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     */
    width(value: string): JQuery;
    /**
     * Set the CSS width of each element in the set of matched elements.
     *
     * @param func A function returning the width to set. Receives the index position of the element in the set and the old width as arguments. Within the function, this refers to the current element in the set.
     */
    width(func: (index: number, width: number) => number): JQuery;
    /**
     * Set the CSS width of each element in the set of matched elements.
     *
     * @param func A function returning the width to set. Receives the index position of the element in the set and the old width as arguments. Within the function, this refers to the current element in the set.
     */
    width(func: (index: number, width: string) => string): JQuery;
    /**
     * Set the CSS width of each element in the set of matched elements.
     *
     * @param func A function returning the width to set. Receives the index position of the element in the set and the old width as arguments. Within the function, this refers to the current element in the set.
     */
    width(func: (index: number, width: string) => number): JQuery;
    /**
     * Set the CSS width of each element in the set of matched elements.
     *
     * @param func A function returning the width to set. Receives the index position of the element in the set and the old width as arguments. Within the function, this refers to the current element in the set.
     */
    width(func: (index: number, width: number) => string): JQuery;

    /**
     * Remove from the queue all items that have not yet been run.
     *
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     */
    clearQueue(queueName?: string): JQuery;

    /**
     * Store arbitrary data associated with the matched elements.
     *
     * @param key A string naming the piece of data to set.
     * @param value The new data value; it can be any Javascript type including Array or Object.
     */
    data(key: string, value: any): JQuery;
    /**
     * Store arbitrary data associated with the matched elements.
     *
     * @param obj An object of key-value pairs of data to update.
     */
    data(obj: { [key: string]: any; }): JQuery;
    /**
     * Return the value at the named data store for the first element in the jQuery collection, as set by data(name, value) or by an HTML5 data-* attribute.
     *
     * @param key Name of the data stored.
     */
    data(key: string): any;
    /**
     * Return the value at the named data store for the first element in the jQuery collection, as set by data(name, value) or by an HTML5 data-* attribute.
     */
    data(): any;

    /**
     * Execute the next function on the queue for the matched elements.
     *
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     */
    dequeue(queueName?: string): JQuery;

    /**
     * Remove a previously-stored piece of data.
     *
     * @param name A string naming the piece of data to delete or space-separated string naming the pieces of data to delete.
     */
    removeData(name: string): JQuery;
    /**
     * Remove a previously-stored piece of data.
     *
     * @param list An array of strings naming the pieces of data to delete.
     */
    removeData(list: string[]): JQuery;

    /**
     * Return a Promise object to observe when all actions of a certain type bound to the collection, queued or not, have finished.
     *
     * @param type The type of queue that needs to be observed. (default: fx)
     * @param target Object onto which the promise methods have to be attached
     */
    promise(type?: string, target?: Object): JQueryPromise<any>;

    /**
     * Perform a custom animation of a set of CSS properties.
     *
     * @param properties An object of CSS properties and values that the animation will move toward.
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    animate(properties: Object, duration?: string, complete?: Function): JQuery;
    /**
     * Perform a custom animation of a set of CSS properties.
     *
     * @param properties An object of CSS properties and values that the animation will move toward.
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    animate(properties: Object, duration?: number, complete?: Function): JQuery;
    /**
     * Perform a custom animation of a set of CSS properties.
     *
     * @param properties An object of CSS properties and values that the animation will move toward.
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition. (default: swing)
     * @param complete A function to call once the animation is complete.
     */
    animate(properties: Object, duration?: string, easing?: string, complete?: Function): JQuery;
    /**
     * Perform a custom animation of a set of CSS properties.
     *
     * @param properties An object of CSS properties and values that the animation will move toward.
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition. (default: swing)
     * @param complete A function to call once the animation is complete.
     */
    animate(properties: Object, duration?: number, easing?: string, complete?: Function): JQuery;
    /**
     * Perform a custom animation of a set of CSS properties.
     *
     * @param properties An object of CSS properties and values that the animation will move toward.
     * @param options A map of additional options to pass to the method.
     */
    animate(properties: Object, options: JQueryAnimationOptions): JQuery;

    /**
     * Set a timer to delay execution of subsequent items in the queue.
     *
     * @param duration An integer indicating the number of milliseconds to delay execution of the next item in the queue.
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     */
    delay(duration: number, queueName?: string): JQuery;

    /**
     * Display the matched elements by fading them to opaque.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    fadeIn(duration?: number, complete?: Function): JQuery;
    /**
     * Display the matched elements by fading them to opaque.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    fadeIn(duration?: string, complete?: Function): JQuery;
    /**
     * Display the matched elements by fading them to opaque.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    fadeIn(duration?: number, easing?: string, complete?: Function): JQuery;
    /**
     * Display the matched elements by fading them to opaque.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    fadeIn(duration?: string, easing?: string, complete?: Function): JQuery;
    /**
     * Display the matched elements by fading them to opaque.
     *
     * @param options A map of additional options to pass to the method.
     */
    fadeIn(options: JQueryAnimationOptions): JQuery;

    /**
     * Hide the matched elements by fading them to transparent.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    fadeOut(duration?: number, complete?: Function): JQuery;
    /**
     * Hide the matched elements by fading them to transparent.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    fadeOut(duration?: string, complete?: Function): JQuery;
    /**
     * Hide the matched elements by fading them to transparent.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    fadeOut(duration?: number, easing?: string, complete?: Function): JQuery;
    /**
     * Hide the matched elements by fading them to transparent.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    fadeOut(duration?: string, easing?: string, complete?: Function): JQuery;
    /**
     * Hide the matched elements by fading them to transparent.
     *
     * @param options A map of additional options to pass to the method.
     */
    fadeOut(options: JQueryAnimationOptions): JQuery;

    /**
     * Adjust the opacity of the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param opacity A number between 0 and 1 denoting the target opacity.
     * @param complete A function to call once the animation is complete.
     */
    fadeTo(duration: string, opacity: number, complete?: Function): JQuery;
    /**
     * Adjust the opacity of the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param opacity A number between 0 and 1 denoting the target opacity.
     * @param complete A function to call once the animation is complete.
     */
    fadeTo(duration: number, opacity: number, complete?: Function): JQuery;
    /**
     * Adjust the opacity of the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param opacity A number between 0 and 1 denoting the target opacity.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    fadeTo(duration: string, opacity: number, easing?: string, complete?: Function): JQuery;
    /**
     * Adjust the opacity of the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param opacity A number between 0 and 1 denoting the target opacity.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    fadeTo(duration: number, opacity: number, easing?: string, complete?: Function): JQuery;

    /**
     * Display or hide the matched elements by animating their opacity.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    fadeToggle(duration?: number, complete?: Function): JQuery;
    /**
     * Display or hide the matched elements by animating their opacity.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    fadeToggle(duration?: string, complete?: Function): JQuery;
    /**
     * Display or hide the matched elements by animating their opacity.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    fadeToggle(duration?: number, easing?: string, complete?: Function): JQuery;
    /**
     * Display or hide the matched elements by animating their opacity.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    fadeToggle(duration?: string, easing?: string, complete?: Function): JQuery;
    /**
     * Display or hide the matched elements by animating their opacity.
     *
     * @param options A map of additional options to pass to the method.
     */
    fadeToggle(options: JQueryAnimationOptions): JQuery;

    /**
     * Stop the currently-running animation, remove all queued animations, and complete all animations for the matched elements.
     *
     * @param queue The name of the queue in which to stop animations.
     */
    finish(queue?: string): JQuery;

    /**
     * Hide the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    hide(duration?: number, complete?: Function): JQuery;
    /**
     * Hide the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    hide(duration?: string, complete?: Function): JQuery;
    /**
     * Hide the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    hide(duration?: number, easing?: string, complete?: Function): JQuery;
    /**
     * Hide the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    hide(duration?: string, easing?: string, complete?: Function): JQuery;
    /**
     * Hide the matched elements.
     *
     * @param options A map of additional options to pass to the method.
     */
    hide(options: JQueryAnimationOptions): JQuery;

    /**
     * Display the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    show(duration?: number, complete?: Function): JQuery;
    /**
     * Display the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    show(duration?: string, complete?: Function): JQuery;
    /**
     * Display the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    show(duration?: number, easing?: string, complete?: Function): JQuery;
    /**
     * Display the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    show(duration?: string, easing?: string, complete?: Function): JQuery;
    /**
     * Display the matched elements.
     *
     * @param options A map of additional options to pass to the method.
     */
    show(options: JQueryAnimationOptions): JQuery;

    /**
     * Display the matched elements with a sliding motion.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    slideDown(duration?: number, complete?: Function): JQuery;
    /**
     * Display the matched elements with a sliding motion.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    slideDown(duration?: string, complete?: Function): JQuery;
    /**
     * Display the matched elements with a sliding motion.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    slideDown(duration?: number, easing?: string, complete?: Function): JQuery;
    /**
     * Display the matched elements with a sliding motion.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    slideDown(duration?: string, easing?: string, complete?: Function): JQuery;
    /**
     * Display the matched elements with a sliding motion.
     *
     * @param options A map of additional options to pass to the method.
     */
    slideDown(options: JQueryAnimationOptions): JQuery;

    /**
     * Display or hide the matched elements with a sliding motion.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    slideToggle(duration?: number, complete?: Function): JQuery;
    /**
     * Display or hide the matched elements with a sliding motion.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    slideToggle(duration?: string, complete?: Function): JQuery;
    /**
     * Display or hide the matched elements with a sliding motion.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    slideToggle(duration?: number, easing?: string, complete?: Function): JQuery;
    /**
     * Display or hide the matched elements with a sliding motion.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    slideToggle(duration?: string, easing?: string, complete?: Function): JQuery;
    /**
     * Display or hide the matched elements with a sliding motion.
     *
     * @param options A map of additional options to pass to the method.
     */
    slideToggle(options: JQueryAnimationOptions): JQuery;

    /**
     * Hide the matched elements with a sliding motion.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    slideUp(duration?: number, complete?: Function): JQuery;
    /**
     * Hide the matched elements with a sliding motion.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    slideUp(duration?: string, complete?: Function): JQuery;
    /**
     * Hide the matched elements with a sliding motion.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    slideUp(duration?: number, easing?: string, complete?: Function): JQuery;
    /**
     * Hide the matched elements with a sliding motion.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    slideUp(duration?: string, easing?: string, complete?: Function): JQuery;
    /**
     * Hide the matched elements with a sliding motion.
     *
     * @param options A map of additional options to pass to the method.
     */
    slideUp(options: JQueryAnimationOptions): JQuery;

    /**
     * Stop the currently-running animation on the matched elements.
     *
     * @param clearQueue A Boolean indicating whether to remove queued animation as well. Defaults to false.
     * @param jumpToEnd A Boolean indicating whether to complete the current animation immediately. Defaults to false.
     */
    stop(clearQueue?: boolean, jumpToEnd?: boolean): JQuery;
    /**
     * Stop the currently-running animation on the matched elements.
     *
     * @param queue The name of the queue in which to stop animations.
     * @param clearQueue A Boolean indicating whether to remove queued animation as well. Defaults to false.
     * @param jumpToEnd A Boolean indicating whether to complete the current animation immediately. Defaults to false.
     */
    stop(queue?: string, clearQueue?: boolean, jumpToEnd?: boolean): JQuery;

    /**
     * Display or hide the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    toggle(duration?: number, complete?: Function): JQuery;
    /**
     * Display or hide the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     */
    toggle(duration?: string, complete?: Function): JQuery;
    /**
     * Display or hide the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    toggle(duration?: number, easing?: string, complete?: Function): JQuery;
    /**
     * Display or hide the matched elements.
     *
     * @param duration A string or number determining how long the animation will run.
     * @param easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     */
    toggle(duration?: string, easing?: string, complete?: Function): JQuery;
    /**
     * Display or hide the matched elements.
     *
     * @param options A map of additional options to pass to the method.
     */
    toggle(options: JQueryAnimationOptions): JQuery;
    /**
     * Display or hide the matched elements.
     *
     * @param showOrHide A Boolean indicating whether to show or hide the elements.
     */
    toggle(showOrHide: boolean): JQuery;

    /**
     * Attach a handler to an event for the elements.
     * 
     * @param eventType A string containing one or more DOM event types, such as "click" or "submit," or custom event names.
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    bind(eventType: string, eventData: any, handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Attach a handler to an event for the elements.
     * 
     * @param eventType A string containing one or more DOM event types, such as "click" or "submit," or custom event names.
     * @param handler A function to execute each time the event is triggered.
     */
    bind(eventType: string, handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Attach a handler to an event for the elements.
     * 
     * @param eventType A string containing one or more DOM event types, such as "click" or "submit," or custom event names.
     * @param eventData An object containing data that will be passed to the event handler.
     * @param preventBubble Setting the third argument to false will attach a function that prevents the default action from occurring and stops the event from bubbling. The default is true.
     */
    bind(eventType: string, eventData: any, preventBubble: boolean): JQuery;
    /**
     * Attach a handler to an event for the elements.
     * 
     * @param eventType A string containing one or more DOM event types, such as "click" or "submit," or custom event names.
     * @param preventBubble Setting the third argument to false will attach a function that prevents the default action from occurring and stops the event from bubbling. The default is true.
     */
    bind(eventType: string, preventBubble: boolean): JQuery;
    /**
     * Attach a handler to an event for the elements.
     * 
     * @param events An object containing one or more DOM event types and functions to execute for them.
     */
    bind(events: any): JQuery;

    /**
     * Trigger the "blur" event on an element
     */
    blur(): JQuery;
    /**
     * Bind an event handler to the "blur" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    blur(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "blur" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    blur(eventData?: any, handler?: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Trigger the "change" event on an element.
     */
    change(): JQuery;
    /**
     * Bind an event handler to the "change" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    change(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "change" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    change(eventData?: any, handler?: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Trigger the "click" event on an element.
     */
    click(): JQuery;
    /**
     * Bind an event handler to the "click" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     */
    click(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "click" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    click(eventData?: any, handler?: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Trigger the "dblclick" event on an element.
     */
    dblclick(): JQuery;
    /**
     * Bind an event handler to the "dblclick" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    dblclick(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "dblclick" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    dblclick(eventData?: any, handler?: (eventObject: JQueryEventObject) => any): JQuery;

    delegate(selector: any, eventType: string, handler: (eventObject: JQueryEventObject) => any): JQuery;
    delegate(selector: any, eventType: string, eventData: any, handler: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Trigger the "focus" event on an element.
     */
    focus(): JQuery;
    /**
     * Bind an event handler to the "focus" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    focus(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "focus" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    focus(eventData?: any, handler?: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Bind an event handler to the "focusin" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    focusin(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "focusin" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    focusin(eventData: Object, handler: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Bind an event handler to the "focusout" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    focusout(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "focusout" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    focusout(eventData: Object, handler: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Bind two handlers to the matched elements, to be executed when the mouse pointer enters and leaves the elements.
     *
     * @param handlerIn A function to execute when the mouse pointer enters the element.
     * @param handlerOut A function to execute when the mouse pointer leaves the element.
     */
    hover(handlerIn: (eventObject: JQueryEventObject) => any, handlerOut: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind a single handler to the matched elements, to be executed when the mouse pointer enters or leaves the elements.
     *
     * @param handlerInOut A function to execute when the mouse pointer enters or leaves the element.
     */
    hover(handlerInOut: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Trigger the "keydown" event on an element.
     */
    keydown(): JQuery;
    /**
     * Bind an event handler to the "keydown" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    keydown(handler: (eventObject: JQueryKeyEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "keydown" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    keydown(eventData?: any, handler?: (eventObject: JQueryKeyEventObject) => any): JQuery;

    /**
     * Trigger the "keypress" event on an element.
     */
    keypress(): JQuery;
    /**
     * Bind an event handler to the "keypress" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    keypress(handler: (eventObject: JQueryKeyEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "keypress" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    keypress(eventData?: any, handler?: (eventObject: JQueryKeyEventObject) => any): JQuery;

    /**
     * Trigger the "keyup" event on an element.
     */
    keyup(): JQuery;
    /**
     * Bind an event handler to the "keyup" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    keyup(handler: (eventObject: JQueryKeyEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "keyup" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    keyup(eventData?: any, handler?: (eventObject: JQueryKeyEventObject) => any): JQuery;

    /**
     * Bind an event handler to the "load" JavaScript event.
     *
     * @param handler A function to execute when the event is triggered.
     */
    load(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "load" JavaScript event.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    load(eventData?: any, handler?: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Trigger the "mousedown" event on an element.
     */
    mousedown(): JQuery;
    /**
     * Bind an event handler to the "mousedown" JavaScript event.
     *
     * @param handler A function to execute when the event is triggered.
     */
    mousedown(handler: (eventObject: JQueryMouseEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "mousedown" JavaScript event.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    mousedown(eventData: Object, handler: (eventObject: JQueryMouseEventObject) => any): JQuery;

    /**
     * Trigger the "mouseenter" event on an element.
     */
    mouseenter(): JQuery;
    /**
     * Bind an event handler to be fired when the mouse enters an element.
     *
     * @param handler A function to execute when the event is triggered.
     */
    mouseenter(handler: (eventObject: JQueryMouseEventObject) => any): JQuery;
    /**
     * Bind an event handler to be fired when the mouse enters an element.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    mouseenter(eventData: Object, handler: (eventObject: JQueryMouseEventObject) => any): JQuery;

    /**
     * Trigger the "mouseleave" event on an element.
     */
    mouseleave(): JQuery;
    /**
     * Bind an event handler to be fired when the mouse leaves an element.
     *
     * @param handler A function to execute when the event is triggered.
     */
    mouseleave(handler: (eventObject: JQueryMouseEventObject) => any): JQuery;
    /**
     * Bind an event handler to be fired when the mouse leaves an element.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    mouseleave(eventData: Object, handler: (eventObject: JQueryMouseEventObject) => any): JQuery;

    /**
     * Trigger the "mousemove" event on an element.
     */
    mousemove(): JQuery;
    /**
     * Bind an event handler to the "mousemove" JavaScript event.
     *
     * @param handler A function to execute when the event is triggered.
     */
    mousemove(handler: (eventObject: JQueryMouseEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "mousemove" JavaScript event.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    mousemove(eventData: Object, handler: (eventObject: JQueryMouseEventObject) => any): JQuery;

    /**
     * Trigger the "mouseout" event on an element.
     */
    mouseout(): JQuery;
    /**
     * Bind an event handler to the "mouseout" JavaScript event.
     *
     * @param handler A function to execute when the event is triggered.
     */
    mouseout(handler: (eventObject: JQueryMouseEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "mouseout" JavaScript event.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    mouseout(eventData: Object, handler: (eventObject: JQueryMouseEventObject) => any): JQuery;

    /**
     * Trigger the "mouseover" event on an element.
     */
    mouseover(): JQuery;
    /**
     * Bind an event handler to the "mouseover" JavaScript event.
     *
     * @param handler A function to execute when the event is triggered.
     */
    mouseover(handler: (eventObject: JQueryMouseEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "mouseover" JavaScript event.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    mouseover(eventData: Object, handler: (eventObject: JQueryMouseEventObject) => any): JQuery;

    /**
     * Trigger the "mouseup" event on an element.
     */
    mouseup(): JQuery;
    /**
     * Bind an event handler to the "mouseup" JavaScript event.
     *
     * @param handler A function to execute when the event is triggered.
     */
    mouseup(handler: (eventObject: JQueryMouseEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "mouseup" JavaScript event.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    mouseup(eventData: Object, handler: (eventObject: JQueryMouseEventObject) => any): JQuery;

    /**
     * Remove an event handler.
     */
    off(): JQuery;
    /**
     * Remove an event handler.
     *
     * @param events One or more space-separated event types and optional namespaces, or just namespaces, such as "click", "keydown.myPlugin", or ".myPlugin".
     * @param selector A selector which should match the one originally passed to .on() when attaching event handlers.
     * @param handler A handler function previously attached for the event(s), or the special value false.
     */
    off(events: string, selector?: string, handler?: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Remove an event handler.
     *
     * @param events One or more space-separated event types and optional namespaces, or just namespaces, such as "click", "keydown.myPlugin", or ".myPlugin".
     * @param handler A handler function previously attached for the event(s), or the special value false.
     */
    off(events: string, handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Remove an event handler.
     *
     * @param events An object where the string keys represent one or more space-separated event types and optional namespaces, and the values represent handler functions previously attached for the event(s).
     * @param selector A selector which should match the one originally passed to .on() when attaching event handlers.
     */
    off(events: { [key: string]: any; }, selector?: string): JQuery;

    /**
     * Attach an event handler function for one or more events to the selected elements.
     *
     * @param events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
     * @param handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false. Rest parameter args is for optional parameters passed to jQuery.trigger(). Note that the actual parameters on the event handler function must be marked as optional (? syntax).
     */
    on(events: string, handler: (eventObject: JQueryEventObject, ...args: any[]) => any): JQuery;
    /**
     * Attach an event handler function for one or more events to the selected elements.
     *
     * @param events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
     * @param data Data to be passed to the handler in event.data when an event is triggered.
     * @param handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
    */
    on(events: string, data: any, handler: (eventObject: JQueryEventObject, ...args: any[]) => any): JQuery;
    /**
     * Attach an event handler function for one or more events to the selected elements.
     *
     * @param events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
     * @param selector A selector string to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element.
     * @param handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
     */
    on(events: string, selector: string, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any): JQuery;
    /**
     * Attach an event handler function for one or more events to the selected elements.
     *
     * @param events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
     * @param selector A selector string to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element.
     * @param data Data to be passed to the handler in event.data when an event is triggered.
     * @param handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
     */
    on(events: string, selector: string, data: any, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any): JQuery;
    /**
     * Attach an event handler function for one or more events to the selected elements.
     *
     * @param events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
     * @param selector A selector string to filter the descendants of the selected elements that will call the handler. If the selector is null or omitted, the handler is always called when it reaches the selected element.
     * @param data Data to be passed to the handler in event.data when an event occurs.
     */
    on(events: { [key: string]: any; }, selector?: string, data?: any): JQuery;
    /**
     * Attach an event handler function for one or more events to the selected elements.
     *
     * @param events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
     * @param data Data to be passed to the handler in event.data when an event occurs.
     */
    on(events: { [key: string]: any; }, data?: any): JQuery;

    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     *
     * @param events A string containing one or more JavaScript event types, such as "click" or "submit," or custom event names.
     * @param handler A function to execute at the time the event is triggered.
     */
    one(events: string, handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     *
     * @param events A string containing one or more JavaScript event types, such as "click" or "submit," or custom event names.
     * @param data An object containing data that will be passed to the event handler.
     * @param handler A function to execute at the time the event is triggered.
     */
    one(events: string, data: Object, handler: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     *
     * @param events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
     * @param selector A selector string to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element.
     * @param handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
     */
    one(events: string, selector: string, handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     *
     * @param events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
     * @param selector A selector string to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element.
     * @param data Data to be passed to the handler in event.data when an event is triggered.
     * @param handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
     */
    one(events: string, selector: string, data: any, handler: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     *
     * @param events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
     * @param selector A selector string to filter the descendants of the selected elements that will call the handler. If the selector is null or omitted, the handler is always called when it reaches the selected element.
     * @param data Data to be passed to the handler in event.data when an event occurs.
     */
    one(events: { [key: string]: any; }, selector?: string, data?: any): JQuery;

    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     *
     * @param events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
     * @param data Data to be passed to the handler in event.data when an event occurs.
     */
    one(events: { [key: string]: any; }, data?: any): JQuery;


    /**
     * Specify a function to execute when the DOM is fully loaded.
     *
     * @param handler A function to execute after the DOM is ready.
     */
    ready(handler: Function): JQuery;

    /**
     * Trigger the "resize" event on an element.
     */
    resize(): JQuery;
    /**
     * Bind an event handler to the "resize" JavaScript event.
     *
     * @param handler A function to execute each time the event is triggered.
     */
    resize(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "resize" JavaScript event.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    resize(eventData: Object, handler: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Trigger the "scroll" event on an element.
     */
    scroll(): JQuery;
    /**
     * Bind an event handler to the "scroll" JavaScript event.
     *
     * @param handler A function to execute each time the event is triggered.
     */
    scroll(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "scroll" JavaScript event.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    scroll(eventData: Object, handler: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Trigger the "select" event on an element.
     */
    select(): JQuery;
    /**
     * Bind an event handler to the "select" JavaScript event.
     *
     * @param handler A function to execute each time the event is triggered.
     */
    select(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "select" JavaScript event.
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    select(eventData: Object, handler: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Trigger the "submit" event on an element.
     */
    submit(): JQuery;
    /**
     * Bind an event handler to the "submit" JavaScript event
     *
     * @param handler A function to execute each time the event is triggered.
     */
    submit(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "submit" JavaScript event
     *
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     */
    submit(eventData?: any, handler?: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Execute all handlers and behaviors attached to the matched elements for the given event type.
     * 
     * @param eventType A string containing a JavaScript event type, such as click or submit.
     * @param extraParameters Additional parameters to pass along to the event handler.
     */
    trigger(eventType: string, extraParameters?: any[]): JQuery;
    /**
     * Execute all handlers and behaviors attached to the matched elements for the given event type.
     * 
     * @param eventType A string containing a JavaScript event type, such as click or submit.
     * @param extraParameters Additional parameters to pass along to the event handler.
     */
    trigger(eventType: string, extraParameters?: Object): JQuery;
    /**
     * Execute all handlers and behaviors attached to the matched elements for the given event type.
     * 
     * @param event A jQuery.Event object.
     * @param extraParameters Additional parameters to pass along to the event handler.
     */
    trigger(event: JQueryEventObject, extraParameters?: any[]): JQuery;
    /**
     * Execute all handlers and behaviors attached to the matched elements for the given event type.
     * 
     * @param event A jQuery.Event object.
     * @param extraParameters Additional parameters to pass along to the event handler.
     */
    trigger(event: JQueryEventObject, extraParameters?: Object): JQuery;

    /**
     * Execute all handlers attached to an element for an event.
     * 
     * @param eventType A string containing a JavaScript event type, such as click or submit.
     * @param extraParameters An array of additional parameters to pass along to the event handler.
     */
    triggerHandler(eventType: string, ...extraParameters: any[]): Object;

    /**
     * Remove a previously-attached event handler from the elements.
     * 
     * @param eventType A string containing a JavaScript event type, such as click or submit.
     * @param handler The function that is to be no longer executed.
     */
    unbind(eventType?: string, handler?: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Remove a previously-attached event handler from the elements.
     * 
     * @param eventType A string containing a JavaScript event type, such as click or submit.
     * @param fls Unbinds the corresponding 'return false' function that was bound using .bind( eventType, false ).
     */
    unbind(eventType: string, fls: boolean): JQuery;
    /**
     * Remove a previously-attached event handler from the elements.
     * 
     * @param evt A JavaScript event object as passed to an event handler.
     */
    unbind(evt: any): JQuery;

    /**
     * Remove a handler from the event for all elements which match the current selector, based upon a specific set of root elements.
     */
    undelegate(): JQuery;
    /**
     * Remove a handler from the event for all elements which match the current selector, based upon a specific set of root elements.
     * 
     * @param selector A selector which will be used to filter the event results.
     * @param eventType A string containing a JavaScript event type, such as "click" or "keydown"
     * @param handler A function to execute at the time the event is triggered.
     */
    undelegate(selector: string, eventType: string, handler?: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Remove a handler from the event for all elements which match the current selector, based upon a specific set of root elements.
     * 
     * @param selector A selector which will be used to filter the event results.
     * @param events An object of one or more event types and previously bound functions to unbind from them.
     */
    undelegate(selector: string, events: Object): JQuery;
    /**
     * Remove a handler from the event for all elements which match the current selector, based upon a specific set of root elements.
     * 
     * @param namespace A string containing a namespace to unbind all events from.
     */
    undelegate(namespace: string): JQuery;

    /**
     * Bind an event handler to the "unload" JavaScript event. (DEPRECATED from v1.8)
     * 
     * @param handler A function to execute when the event is triggered.
     */
    unload(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "unload" JavaScript event. (DEPRECATED from v1.8)
     * 
     * @param eventData A plain object of data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    unload(eventData?: any, handler?: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * The DOM node context originally passed to jQuery(); if none was passed then context will likely be the document. (DEPRECATED from v1.10)
     */
    context: Element;

    jquery: string;

    /**
     * Bind an event handler to the "error" JavaScript event. (DEPRECATED from v1.8)
     * 
     * @param handler A function to execute when the event is triggered.
     */
    error(handler: (eventObject: JQueryEventObject) => any): JQuery;
    /**
     * Bind an event handler to the "error" JavaScript event. (DEPRECATED from v1.8)
     * 
     * @param eventData A plain object of data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     */
    error(eventData: any, handler: (eventObject: JQueryEventObject) => any): JQuery;

    /**
     * Add a collection of DOM elements onto the jQuery stack.
     * 
     * @param elements An array of elements to push onto the stack and make into a new jQuery object.
     */
    pushStack(elements: any[]): JQuery;
    /**
     * Add a collection of DOM elements onto the jQuery stack.
     * 
     * @param elements An array of elements to push onto the stack and make into a new jQuery object.
     * @param name The name of a jQuery method that generated the array of elements.
     * @param arguments The arguments that were passed in to the jQuery method (for serialization).
     */
    pushStack(elements: any[], name: string, arguments: any[]): JQuery;

    /**
     * Insert content, specified by the parameter, after each element in the set of matched elements.
     * 
     * param content1 HTML string, DOM element, array of elements, or jQuery object to insert after each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert after each element in the set of matched elements.
     */
    after(content1: JQuery, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, after each element in the set of matched elements.
     * 
     * param content1 HTML string, DOM element, array of elements, or jQuery object to insert after each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert after each element in the set of matched elements.
     */
    after(content1: any[], ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, after each element in the set of matched elements.
     * 
     * param content1 HTML string, DOM element, array of elements, or jQuery object to insert after each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert after each element in the set of matched elements.
     */
    after(content1: Element, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, after each element in the set of matched elements.
     * 
     * param content1 HTML string, DOM element, array of elements, or jQuery object to insert after each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert after each element in the set of matched elements.
     */
    after(content1: Text, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, after each element in the set of matched elements.
     * 
     * param content1 HTML string, DOM element, array of elements, or jQuery object to insert after each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert after each element in the set of matched elements.
     */
    after(content1: string, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, after each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert after each element in the set of matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
     */
    after(func: (index: number) => any): JQuery;

    /**
     * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
     * 
     * param content1 DOM element, array of elements, HTML string, or jQuery object to insert at the end of each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert at the end of each element in the set of matched elements.
     */
    append(content1: JQuery, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
     * 
     * param content1 DOM element, array of elements, HTML string, or jQuery object to insert at the end of each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert at the end of each element in the set of matched elements.
     */
    append(content1: any[], ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
     * 
     * param content1 DOM element, array of elements, HTML string, or jQuery object to insert at the end of each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert at the end of each element in the set of matched elements.
     */
    append(content1: Element, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
     * 
     * param content1 DOM element, array of elements, HTML string, or jQuery object to insert at the end of each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert at the end of each element in the set of matched elements.
     */
    append(content1: Text, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
     * 
     * param content1 DOM element, array of elements, HTML string, or jQuery object to insert at the end of each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert at the end of each element in the set of matched elements.
     */
    append(content1: string, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert at the end of each element in the set of matched elements. Receives the index position of the element in the set and the old HTML value of the element as arguments. Within the function, this refers to the current element in the set.
     */
    append(func: (index: number, html: string) => any): JQuery;

    /**
     * Insert every element in the set of matched elements to the end of the target.
     * 
     * @param target A selector, element, HTML string, array of elements, or jQuery object; the matched set of elements will be inserted at the end of the element(s) specified by this parameter.
     */
    appendTo(target: JQuery): JQuery;
    /**
     * Insert every element in the set of matched elements to the end of the target.
     * 
     * @param target A selector, element, HTML string, array of elements, or jQuery object; the matched set of elements will be inserted at the end of the element(s) specified by this parameter.
     */
    appendTo(target: any[]): JQuery;
    /**
     * Insert every element in the set of matched elements to the end of the target.
     * 
     * @param target A selector, element, HTML string, array of elements, or jQuery object; the matched set of elements will be inserted at the end of the element(s) specified by this parameter.
     */
    appendTo(target: Element): JQuery;
    /**
     * Insert every element in the set of matched elements to the end of the target.
     * 
     * @param target A selector, element, HTML string, array of elements, or jQuery object; the matched set of elements will be inserted at the end of the element(s) specified by this parameter.
     */
    appendTo(target: string): JQuery;

    /**
     * Insert content, specified by the parameter, before each element in the set of matched elements.
     * 
     * param content1 HTML string, DOM element, array of elements, or jQuery object to insert before each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert before each element in the set of matched elements.
     */
    before(content1: JQuery, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, before each element in the set of matched elements.
     * 
     * param content1 HTML string, DOM element, array of elements, or jQuery object to insert before each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert before each element in the set of matched elements.
     */
    before(content1: any[], ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, before each element in the set of matched elements.
     * 
     * param content1 HTML string, DOM element, array of elements, or jQuery object to insert before each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert before each element in the set of matched elements.
     */
    before(content1: Element, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, before each element in the set of matched elements.
     * 
     * param content1 HTML string, DOM element, array of elements, or jQuery object to insert before each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert before each element in the set of matched elements.
     */
    before(content1: Text, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, before each element in the set of matched elements.
     * 
     * param content1 HTML string, DOM element, array of elements, or jQuery object to insert before each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert before each element in the set of matched elements.
     */
    before(content1: string, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, before each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert before each element in the set of matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
     */
    before(func: (index: number) => any): JQuery;

    /**
     * Create a deep copy of the set of matched elements.
     * 
     * param withDataAndEvents A Boolean indicating whether event handlers and data should be copied along with the elements. The default value is false.
     * param deepWithDataAndEvents A Boolean indicating whether event handlers and data for all children of the cloned element should be copied. By default its value matches the first argument's value (which defaults to false).
     */
    clone(withDataAndEvents?: boolean, deepWithDataAndEvents?: boolean): JQuery;

    /**
     * Remove the set of matched elements from the DOM.
     * 
     * param selector A selector expression that filters the set of matched elements to be removed.
     */
    detach(selector?: string): JQuery;

    /**
     * Remove all child nodes of the set of matched elements from the DOM.
     */
    empty(): JQuery;

    /**
     * Insert every element in the set of matched elements after the target.
     * 
     * param target A selector, element, array of elements, HTML string, or jQuery object; the matched set of elements will be inserted after the element(s) specified by this parameter.
     */
    insertAfter(target: JQuery): JQuery;
    /**
     * Insert every element in the set of matched elements after the target.
     * 
     * param target A selector, element, array of elements, HTML string, or jQuery object; the matched set of elements will be inserted after the element(s) specified by this parameter.
     */
    insertAfter(target: any[]): JQuery;
    /**
     * Insert every element in the set of matched elements after the target.
     * 
     * param target A selector, element, array of elements, HTML string, or jQuery object; the matched set of elements will be inserted after the element(s) specified by this parameter.
     */
    insertAfter(target: Element): JQuery;
    /**
     * Insert every element in the set of matched elements after the target.
     * 
     * param target A selector, element, array of elements, HTML string, or jQuery object; the matched set of elements will be inserted after the element(s) specified by this parameter.
     */
    insertAfter(target: Text): JQuery;
    /**
     * Insert every element in the set of matched elements after the target.
     * 
     * param target A selector, element, array of elements, HTML string, or jQuery object; the matched set of elements will be inserted after the element(s) specified by this parameter.
     */
    insertAfter(target: string): JQuery;

    /**
     * Insert every element in the set of matched elements before the target.
     * 
     * param target A selector, element, array of elements, HTML string, or jQuery object; the matched set of elements will be inserted before the element(s) specified by this parameter.
     */
    insertBefore(target: JQuery): JQuery;
    /**
     * Insert every element in the set of matched elements before the target.
     * 
     * param target A selector, element, array of elements, HTML string, or jQuery object; the matched set of elements will be inserted before the element(s) specified by this parameter.
     */
    insertBefore(target: any[]): JQuery;
    /**
     * Insert every element in the set of matched elements before the target.
     * 
     * param target A selector, element, array of elements, HTML string, or jQuery object; the matched set of elements will be inserted before the element(s) specified by this parameter.
     */
    insertBefore(target: Element): JQuery;
    /**
     * Insert every element in the set of matched elements before the target.
     * 
     * param target A selector, element, array of elements, HTML string, or jQuery object; the matched set of elements will be inserted before the element(s) specified by this parameter.
     */
    insertBefore(target: Text): JQuery;
    /**
     * Insert every element in the set of matched elements before the target.
     * 
     * param target A selector, element, array of elements, HTML string, or jQuery object; the matched set of elements will be inserted before the element(s) specified by this parameter.
     */
    insertBefore(target: string): JQuery;

    /**
     * Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
     * 
     * param content1 DOM element, array of elements, HTML string, or jQuery object to insert at the beginning of each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert at the beginning of each element in the set of matched elements.
     */
    prepend(content1: JQuery, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
     * 
     * param content1 DOM element, array of elements, HTML string, or jQuery object to insert at the beginning of each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert at the beginning of each element in the set of matched elements.
     */
    prepend(content1: any[], ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
     * 
     * param content1 DOM element, array of elements, HTML string, or jQuery object to insert at the beginning of each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert at the beginning of each element in the set of matched elements.
     */
    prepend(content1: Element, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
     * 
     * param content1 DOM element, array of elements, HTML string, or jQuery object to insert at the beginning of each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert at the beginning of each element in the set of matched elements.
     */
    prepend(content1: Text, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
     * 
     * param content1 DOM element, array of elements, HTML string, or jQuery object to insert at the beginning of each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert at the beginning of each element in the set of matched elements.
     */
    prepend(content1: string, ...content2: any[]): JQuery;
    /**
     * Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert at the beginning of each element in the set of matched elements. Receives the index position of the element in the set and the old HTML value of the element as arguments. Within the function, this refers to the current element in the set.
     */
    prepend(func: (index: number, html: string) => any): JQuery;

    /**
     * Insert every element in the set of matched elements to the beginning of the target.
     * 
     * @param target A selector, element, HTML string, array of elements, or jQuery object; the matched set of elements will be inserted at the beginning of the element(s) specified by this parameter.
     */
    prependTo(target: JQuery): JQuery;
    /**
     * Insert every element in the set of matched elements to the beginning of the target.
     * 
     * @param target A selector, element, HTML string, array of elements, or jQuery object; the matched set of elements will be inserted at the beginning of the element(s) specified by this parameter.
     */
    prependTo(target: any[]): JQuery;
    /**
     * Insert every element in the set of matched elements to the beginning of the target.
     * 
     * @param target A selector, element, HTML string, array of elements, or jQuery object; the matched set of elements will be inserted at the beginning of the element(s) specified by this parameter.
     */
    prependTo(target: Element): JQuery;
    /**
     * Insert every element in the set of matched elements to the beginning of the target.
     * 
     * @param target A selector, element, HTML string, array of elements, or jQuery object; the matched set of elements will be inserted at the beginning of the element(s) specified by this parameter.
     */
    prependTo(target: string): JQuery;

    /**
     * Remove the set of matched elements from the DOM.
     * 
     * @param selector A selector expression that filters the set of matched elements to be removed.
     */
    remove(selector?: string): JQuery;

    /**
     * Replace each target element with the set of matched elements.
     * 
     * @param target A selector string, jQuery object, DOM element, or array of elements indicating which element(s) to replace.
     */
    replaceAll(target: JQuery): JQuery;
    /**
     * Replace each target element with the set of matched elements.
     * 
     * @param target A selector string, jQuery object, DOM element, or array of elements indicating which element(s) to replace.
     */
    replaceAll(target: any[]): JQuery;
    /**
     * Replace each target element with the set of matched elements.
     * 
     * @param target A selector string, jQuery object, DOM element, or array of elements indicating which element(s) to replace.
     */
    replaceAll(target: Element): JQuery;
    /**
     * Replace each target element with the set of matched elements.
     * 
     * @param target A selector string, jQuery object, DOM element, or array of elements indicating which element(s) to replace.
     */
    replaceAll(target: string): JQuery;

    /**
     * Replace each element in the set of matched elements with the provided new content and return the set of elements that was removed.
     * 
     * param newContent The content to insert. May be an HTML string, DOM element, array of DOM elements, or jQuery object.
     */
    replaceWith(newContent: JQuery): JQuery;
    /**
     * Replace each element in the set of matched elements with the provided new content and return the set of elements that was removed.
     * 
     * param newContent The content to insert. May be an HTML string, DOM element, array of DOM elements, or jQuery object.
     */
    replaceWith(newContent: any[]): JQuery;
    /**
     * Replace each element in the set of matched elements with the provided new content and return the set of elements that was removed.
     * 
     * param newContent The content to insert. May be an HTML string, DOM element, array of DOM elements, or jQuery object.
     */
    replaceWith(newContent: Element): JQuery;
    /**
     * Replace each element in the set of matched elements with the provided new content and return the set of elements that was removed.
     * 
     * param newContent The content to insert. May be an HTML string, DOM element, array of DOM elements, or jQuery object.
     */
    replaceWith(newContent: Text): JQuery;
    /**
     * Replace each element in the set of matched elements with the provided new content and return the set of elements that was removed.
     * 
     * param newContent The content to insert. May be an HTML string, DOM element, array of DOM elements, or jQuery object.
     */
    replaceWith(newContent: string): JQuery;
    /**
     * Replace each element in the set of matched elements with the provided new content and return the set of elements that was removed.
     * 
     * param func A function that returns content with which to replace the set of matched elements.
     */
    replaceWith(func: () => any): JQuery;

    /**
     * Get the combined text contents of each element in the set of matched elements, including their descendants.
     */
    text(): string;
    /**
     * Set the content of each element in the set of matched elements to the specified text.
     * 
     * @param text The text to set as the content of each matched element.
     */
    text(text: string): JQuery;
    /**
     * Set the content of each element in the set of matched elements to the specified text.
     * 
     * @param text The text to set as the content of each matched element.
     */
    text(text: number): JQuery;
    /**
     * Set the content of each element in the set of matched elements to the specified text.
     * 
     * @param text The text to set as the content of each matched element.
     */
    text(text: boolean): JQuery;
    /**
     * Set the content of each element in the set of matched elements to the specified text.
     * 
     * @param func A function returning the text content to set. Receives the index position of the element in the set and the old text value as arguments.
     */
    text(func: (index: number, text: string) => string): JQuery;

    /**
     * Retrieve all the elements contained in the jQuery set, as an array.
     */
    toArray(): any[];

    /**
     * Remove the parents of the set of matched elements from the DOM, leaving the matched elements in their place.
     */
    unwrap(): JQuery;

    /**
     * Wrap an HTML structure around each element in the set of matched elements.
     * 
     * @param wrappingElement A selector, element, HTML string, or jQuery object specifying the structure to wrap around the matched elements.
     */
    wrap(wrappingElement: JQuery): JQuery;
    /**
     * Wrap an HTML structure around each element in the set of matched elements.
     * 
     * @param wrappingElement A selector, element, HTML string, or jQuery object specifying the structure to wrap around the matched elements.
     */
    wrap(wrappingElement: Element): JQuery;
    /**
     * Wrap an HTML structure around each element in the set of matched elements.
     * 
     * @param wrappingElement A selector, element, HTML string, or jQuery object specifying the structure to wrap around the matched elements.
     */
    wrap(wrappingElement: string): JQuery;
    /**
     * Wrap an HTML structure around each element in the set of matched elements.
     * 
     * @param func A callback function returning the HTML content or jQuery object to wrap around the matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
     */
    wrap(func: (index: number) => any): JQuery;

    /**
     * Wrap an HTML structure around all elements in the set of matched elements.
     * 
     * @param wrappingElement A selector, element, HTML string, or jQuery object specifying the structure to wrap around the matched elements.
     */
    wrapAll(wrappingElement: JQuery): JQuery;
    /**
     * Wrap an HTML structure around all elements in the set of matched elements.
     * 
     * @param wrappingElement A selector, element, HTML string, or jQuery object specifying the structure to wrap around the matched elements.
     */
    wrapAll(wrappingElement: Element): JQuery;
    /**
     * Wrap an HTML structure around all elements in the set of matched elements.
     * 
     * @param wrappingElement A selector, element, HTML string, or jQuery object specifying the structure to wrap around the matched elements.
     */
    wrapAll(wrappingElement: string): JQuery;

    /**
     * Wrap an HTML structure around the content of each element in the set of matched elements.
     * 
     * @param wrappingElement An HTML snippet, selector expression, jQuery object, or DOM element specifying the structure to wrap around the content of the matched elements.
     */
    wrapInner(wrappingElement: JQuery): JQuery;
    /**
     * Wrap an HTML structure around the content of each element in the set of matched elements.
     * 
     * @param wrappingElement An HTML snippet, selector expression, jQuery object, or DOM element specifying the structure to wrap around the content of the matched elements.
     */
    wrapInner(wrappingElement: Element): JQuery;
    /**
     * Wrap an HTML structure around the content of each element in the set of matched elements.
     * 
     * @param wrappingElement An HTML snippet, selector expression, jQuery object, or DOM element specifying the structure to wrap around the content of the matched elements.
     */
    wrapInner(wrappingElement: string): JQuery;
    /**
     * Wrap an HTML structure around the content of each element in the set of matched elements.
     * 
     * @param func A callback function which generates a structure to wrap around the content of the matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
     */
    wrapInner(func: (index: number) => any): JQuery;

    /**
     * Iterate over a jQuery object, executing a function for each matched element.
     * 
     * @param func A function to execute for each matched element.
     */
    each(func: (index: number, elem: Element) => any): JQuery;

    /**
     * Retrieve one of the elements matched by the jQuery object.
     * 
     * @param index A zero-based integer indicating which element to retrieve.
     */
    get(index: number): HTMLElement;
    /**
     * Retrieve the elements matched by the jQuery object.
     */
    get(): any[];

    /**
     * Search for a given element from among the matched elements.
     */
    index(): number;
    /**
     * Search for a given element from among the matched elements.
     * 
     * @param selector A selector representing a jQuery collection in which to look for an element.
     */
    index(selector: string): number;
    /**
     * Search for a given element from among the matched elements.
     * 
     * @param element The DOM element or first element within the jQuery object to look for.
     */
    index(element: JQuery): number;
    /**
     * Search for a given element from among the matched elements.
     * 
     * @param element The DOM element or first element within the jQuery object to look for.
     */
    index(element: Element): number;
    index(element: any): number;

    /**
     * The number of elements in the jQuery object.
     */
    length: number;
    /**
     * A selector representing selector passed to jQuery(), if any, when creating the original set.
     * version deprecated: 1.7, removed: 1.9
     */
    selector: string;
    [index: string]: any;
    [index: number]: HTMLElement;

    /**
     * Add elements to the set of matched elements.
     * 
     * @param selector A string representing a selector expression to find additional elements to add to the set of matched elements.
     * @param context The point in the document at which the selector should begin matching; similar to the context argument of the $(selector, context) method.
     */
    add(selector: string, context?: Element): JQuery;
    /**
     * Add elements to the set of matched elements.
     * 
     * @param elements One or more elements to add to the set of matched elements.
     */
    add(...elements: Element[]): JQuery;
    /**
     * Add elements to the set of matched elements.
     * 
     * @param html An HTML fragment to add to the set of matched elements.
     */
    add(html: string): JQuery;
    /**
     * Add elements to the set of matched elements.
     * 
     * @param obj An existing jQuery object to add to the set of matched elements.
     */
    add(obj: JQuery): JQuery;

    /**
     * Get the children of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    children(selector?: string): JQuery;
    children(selector?: any): JQuery;

    /**
     * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    closest(selector: string): JQuery;
    /**
     * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * 
     * @param selector A string containing a selector expression to match elements against.
     * @param context A DOM element within which a matching element may be found. If no context is passed in then the context of the jQuery set will be used instead.
     */
    closest(selector: string, context?: Element): JQuery;
    /**
     * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * 
     * @param obj A jQuery object to match elements against.
     */
    closest(obj: JQuery): JQuery;
    /**
     * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * 
     * @param element An element to match elements against.
     */
    closest(element: Element): JQuery;

    /**
     * Get an array of all the elements and selectors matched against the current element up through the DOM tree.
     * 
     * @param selectors An array or string containing a selector expression to match elements against (can also be a jQuery object).
     * @param context A DOM element within which a matching element may be found. If no context is passed in then the context of the jQuery set will be used instead.
     */
    closest(selectors: any, context?: Element): any[];

    /**
     * Get the children of each element in the set of matched elements, including text and comment nodes.
     */
    contents(): JQuery;

    /**
     * End the most recent filtering operation in the current chain and return the set of matched elements to its previous state.
     */
    end(): JQuery;

    /**
     * Reduce the set of matched elements to the one at the specified index.
     * 
     * @param index An integer indicating the 0-based position of the element. OR An integer indicating the position of the element, counting backwards from the last element in the set.
     *  
     */
    eq(index: number): JQuery;

    /**
     * Reduce the set of matched elements to those that match the selector or pass the function's test.
     * 
     * @param selector A string containing a selector expression to match the current set of elements against.
     */
    filter(selector: string): JQuery;
    /**
     * Reduce the set of matched elements to those that match the selector or pass the function's test.
     * 
     * @param func A function used as a test for each element in the set. this is the current DOM element.
     */
    filter(func: (index: number, element: Element) => any): JQuery;
    /**
     * Reduce the set of matched elements to those that match the selector or pass the function's test.
     * 
     * @param element An element to match the current set of elements against.
     */
    filter(element: Element): JQuery;
    /**
     * Reduce the set of matched elements to those that match the selector or pass the function's test.
     * 
     * @param obj An existing jQuery object to match the current set of elements against.
     */
    filter(obj: JQuery): JQuery;

    /**
     * Get the descendants of each element in the current set of matched elements, filtered by a selector, jQuery object, or element.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    find(selector: string): JQuery;
    /**
     * Get the descendants of each element in the current set of matched elements, filtered by a selector, jQuery object, or element.
     * 
     * @param element An element to match elements against.
     */
    find(element: Element): JQuery;
    /**
     * Get the descendants of each element in the current set of matched elements, filtered by a selector, jQuery object, or element.
     * 
     * @param obj A jQuery object to match elements against.
     */
    find(obj: JQuery): JQuery;

    /**
     * Reduce the set of matched elements to the first in the set.
     */
    first(): JQuery;

    /**
     * Reduce the set of matched elements to those that have a descendant that matches the selector or DOM element.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    has(selector: string): JQuery;
    /**
     * Reduce the set of matched elements to those that have a descendant that matches the selector or DOM element.
     * 
     * @param contained A DOM element to match elements against.
     */
    has(contained: Element): JQuery;

    /**
     * Check the current matched set of elements against a selector, element, or jQuery object and return true if at least one of these elements matches the given arguments.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    is(selector: string): boolean;
    /**
     * Check the current matched set of elements against a selector, element, or jQuery object and return true if at least one of these elements matches the given arguments.
     * 
     * @param func A function used as a test for the set of elements. It accepts one argument, index, which is the element's index in the jQuery collection.Within the function, this refers to the current DOM element.
     */
    is(func: (index: number) => any): boolean;
    /**
     * Check the current matched set of elements against a selector, element, or jQuery object and return true if at least one of these elements matches the given arguments.
     * 
     * @param obj An existing jQuery object to match the current set of elements against.
     */
    is(obj: JQuery): boolean;
    /**
     * Check the current matched set of elements against a selector, element, or jQuery object and return true if at least one of these elements matches the given arguments.
     * 
     * @param elements One or more elements to match the current set of elements against.
     */
    is(elements: any): boolean;

    /**
     * Reduce the set of matched elements to the final one in the set.
     */
    last(): JQuery;

    /**
     * Pass each element in the current matched set through a function, producing a new jQuery object containing the return values.
     * 
     * @param callback A function object that will be invoked for each element in the current set.
     */
    map(callback: (index: number, domElement: Element) => any): JQuery;

    /**
     * Get the immediately following sibling of each element in the set of matched elements. If a selector is provided, it retrieves the next sibling only if it matches that selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    next(selector?: string): JQuery;

    /**
     * Get all following siblings of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    nextAll(selector?: string): JQuery;

    /**
     * Get all following siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object passed.
     * 
     * @param selector A string containing a selector expression to indicate where to stop matching following sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     */
    nextUntil(selector?: string, filter?: string): JQuery;
    /**
     * Get all following siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object passed.
     * 
     * @param element A DOM node or jQuery object indicating where to stop matching following sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     */
    nextUntil(element?: Element, filter?: string): JQuery;
    /**
     * Get all following siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object passed.
     * 
     * @param obj A DOM node or jQuery object indicating where to stop matching following sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     */
    nextUntil(obj?: JQuery, filter?: string): JQuery;

    /**
     * Remove elements from the set of matched elements.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    not(selector: string): JQuery;
    /**
     * Remove elements from the set of matched elements.
     * 
     * @param func A function used as a test for each element in the set. this is the current DOM element.
     */
    not(func: (index: number) => any): JQuery;
    /**
     * Remove elements from the set of matched elements.
     * 
     * @param elements One or more DOM elements to remove from the matched set.
     */
    not(...elements: Element[]): JQuery;
    /**
     * Remove elements from the set of matched elements.
     * 
     * @param obj An existing jQuery object to match the current set of elements against.
     */
    not(obj: JQuery): JQuery;

    /**
     * Get the closest ancestor element that is positioned.
     */
    offsetParent(): JQuery;

    /**
     * Get the parent of each element in the current set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    parent(selector?: string): JQuery;

    /**
     * Get the ancestors of each element in the current set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    parents(selector?: string): JQuery;

    /**
     * Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param selector A string containing a selector expression to indicate where to stop matching ancestor elements.
     * @param filter A string containing a selector expression to match elements against.
     */
    parentsUntil(selector?: string, filter?: string): JQuery;
    /**
     * Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param element A DOM node or jQuery object indicating where to stop matching ancestor elements.
     * @param filter A string containing a selector expression to match elements against.
     */
    parentsUntil(element?: Element, filter?: string): JQuery;
    /**
     * Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param obj A DOM node or jQuery object indicating where to stop matching ancestor elements.
     * @param filter A string containing a selector expression to match elements against.
     */
    parentsUntil(obj?: JQuery, filter?: string): JQuery;

    /**
     * Get the immediately preceding sibling of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    prev(selector?: string): JQuery;

    /**
     * Get all preceding siblings of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    prevAll(selector?: string): JQuery;

    /**
     * Get all preceding siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param selector A string containing a selector expression to indicate where to stop matching preceding sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     */
    prevUntil(selector?: string, filter?: string): JQuery;
    /**
     * Get all preceding siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param element A DOM node or jQuery object indicating where to stop matching preceding sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     */
    prevUntil(element?: Element, filter?: string): JQuery;
    /**
     * Get all preceding siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param obj A DOM node or jQuery object indicating where to stop matching preceding sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     */
    prevUntil(obj?: JQuery, filter?: string): JQuery;

    /**
     * Get the siblings of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     */
    siblings(selector?: string): JQuery;

    /**
     * Reduce the set of matched elements to a subset specified by a range of indices.
     * 
     * @param start An integer indicating the 0-based position at which the elements begin to be selected. If negative, it indicates an offset from the end of the set.
     * @param end An integer indicating the 0-based position at which the elements stop being selected. If negative, it indicates an offset from the end of the set. If omitted, the range continues until the end of the set.
     */
    slice(start: number, end?: number): JQuery;

    /**
     * Show the queue of functions to be executed on the matched elements.
     * 
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     */
    queue(queueName?: string): any[];
    /**
     * Manipulate the queue of functions to be executed, once for each matched element.
     * 
     * @param newQueue An array of functions to replace the current queue contents.
     */
    queue(newQueue: Function[]): JQuery;
    /**
     * Manipulate the queue of functions to be executed, once for each matched element.
     * 
     * @param callback The new function to add to the queue, with a function to call that will dequeue the next item.
     */
    queue(callback: Function): JQuery;
    /**
     * Manipulate the queue of functions to be executed, once for each matched element.
     * 
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @param newQueue An array of functions to replace the current queue contents.
     */
    queue(queueName: string, newQueue: Function[]): JQuery;
    /**
     * Manipulate the queue of functions to be executed, once for each matched element.
     * 
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @param callback The new function to add to the queue, with a function to call that will dequeue the next item.
     */
    queue(queueName: string, callback: Function): JQuery;

    // InfoNav plugins/extensions
    multiline(text: string): JQuery;
    togglePanelControl(): JQuery;
}

interface JQueryEventHandler {
    (eventObject: JQueryEventObject, data?: any): void;
    (eventObject: JQueryEventObject): void;
}

declare module "jquery" {
    export = $;
}
declare var jQuery: JQueryStatic;
declare var $: JQueryStatic;

declare module Microsoft.Maps {

    /*
        Global functions
    */
    export module Globals {
        export var roadUriFormat: any;
    }

    /*
        Loads the specified registered module, making its functionality available. An optional function can be specified that is called when the module is loaded.
        To register a module, use the registerModule method.

        The following Bing Maps modules are available:

        Microsoft.Maps.AdvancedShapes
        Microsoft.Maps.Directions
        Microsoft.Maps.Overlays.Style
        Microsoft.Maps.Search
        Microsoft.Maps.Themes.BingTheme
        Microsoft.Maps.Traffic
        Microsoft.Maps.VenueMaps
    */
    export function loadModule(moduleKey: string, options?: { callback: () => void; }): void;
    /*
        Signals that the specified module has been loaded and if specified, calls the callback function in loadModule. Call this method at the end of your module script.
    */
    export function moduleLoaded(moduleKey: string): void;

    /*
        Registers a module with the map control. The name of the module is specified in moduleKey, the module script is defined in scriptUrl, and the options provides the location of a *.css file to load with the module.
        Tip: To minimize possible conflicts with other custom modules, choose a unique module name (defined in moduleKey). For example, you can use your company name in the name of the module.
        Once you have registered a module, you can make its functionality available by loading it using loadModule.
    */
    export function registerModule(moduleKey: string, scriptUrl: string, options?: string[]): void;

    /*
        Tagging interface for items in an EntityCollection
    */
    export interface Entity {
        //No members
    }

    /*
        Represents the coordinates of the position of the user.
    */
    export class Coordinates {
        /*************
        * PROPERTIES *
        **************/
        /*
            The accuracy, in meters, of the latitude and longitude values.
        */
        accuracy: number;

        /*
            The altitude of the location.
        */
        altitude: number;

        /*
            The accuracy, in meters, of the altitude value.
        */
        altitudeAccuracy: number;

        /*
            The direction of travel of the hosting device.
        */
        heading: number;

        /*
            The latitude of the location.
        */
        latitude: number;

        /*
            The longitude of the location.
        */
        longitude: number;

        /*
            The ground speed of the hosting device, in meters per second.
        */
        speed: number;
    }

    /*
        Contains methods for obtaining and displaying the user’s current location.
        Note: This functionality is only available on browsers that support the W3C GeoLocation API.
    */
    export class GeoLocationProvider {
        constructor (map: Map);

        /*
            Renders a geo location accuracy circle on the map. The accuracy circle is created with the center at the specified location, using the given radiusInMeters, and with the specified number of segments for the accuracy circle polygon. Additional options are also available to adjust the style of the polygon.
        */
        addAccuracyCircle(center: Location, radiusInMeters: number, segments: number, options: PositionCircleOptions): void;

        /*
            Cancels the processing of the current getCurrentPosition request. This method prevents the response from being processed.
        */
        cancelCurrentRequest(): void;

        /*
            Obtains the user’s current location and displays it on the map.
            Important:
                The accuracy of the user location obtained using this method varies widely depending on the desktop browser or mobile device of the requesting client. Desktop users may experience low user location accuracy (accuracy circles with large radiuses), while mobile user location accuracy may be much greater (a few meters).
        */
        getCurrentPosition(options: PositionOptions): void;

        /*
            Removes the current geo location accuracy circle.
        */
        removeAccuracyCircle(): void;
    }

    export class MouseEventArgs {
        eventName: string;
        handled: boolean;
        isPrmary: boolean;
        isSecondary: boolean;
        isTouchEvent: boolean;
        originalEvent: any;
        pageX: number;
        pageY: number;
        target: any;
        targetType: string;
        wheelDelta: number;

        getX(): number;
        getY(): number;
    }

    export class KeyEventArgs {
        altKey: boolean;
        ctrlKey: boolean;
        eventName: string;
        //A boolean indicating whether the event is handled. If this property is set to true, the default map control behavior for the event is cancelled.
        handled: boolean;
        //The ASCII character code that identifies the keyboard key that was pressed.
        keyCode: string;
        originalEvent: any;
        shiftKey: boolean;
    }

    export class LocationRect {
        constructor (center: Location, width: number, height: number);

        center: Location;
        height: number;
        width: number;

        static fromCorners(northwest: Location, southeast: Location): LocationRect;
        static fromEdges(north: number, west: number, south: number, east: number, altitude: number, altitudeReference: AltitudeReference): LocationRect;

        static fromLocations(...locations: Location[]): LocationRect;
        static fromString(str: string): LocationRect;

        clone(): LocationRect;
        contains(location: Location): boolean;
        getEast(): number;
        getNorth(): number;
        getNorthwest(): Location;
        getSouth(): number;
        getSoutheast(): Location;
        getWest(): number;
        insersects(rect: LocationRect): boolean;
        toString(): string;
    }

    export class Location {
        constructor (latitude: number, longitude: number, altitude?: number, altitudeReference?: AltitudeReference);

        altitude: number;
        altitudeReference: AltitudeReference;
        latitude: number;
        longitude: number;

        static areEqual(location1: Location, location2: Location): boolean;
        static normalizeLongitude(longitude: number): number;

        clone(): Location;
        toString(): string;
    }

    /*
        Defines the reference point from which the altitude is measured.
    */
    export class AltitudeReference {
        /*
            The altitude is measured from the ground level.
        */
        static ground: string;
        /*
            The altitude is measured from the WGS 84 ellipsoid of the Earth.
        */
        static ellipsoid: string;

        /*
            Determines if the specified reference is a supported AltitudeReference.
        */
        static isValid(reference: AltitudeReference): boolean;
    }

    export class MapMode {
        getDrawShapesInSingleLayer(): boolean;
        setDrawShapesInSingleLayer(drawInSingleLayer: boolean): void;
        setViewChangeEndDelay(delay: number): void;
    }

    export class MapTypeId {
        static aerial: string;
        static auto: string;
        static birdseye: string;
        static collinsBart: string;
        static mercator: string;
        static ordnanceSurvey: string;
        static road: string;
    }

    /*
        Represents a color.
    */
    export class Color {
        /*
            Initializes a new instance of the Color class. The a parameter represents opacity. The range of valid values for all parameters is 0 to 255.
        */
        constructor (a: number, r: number, g: number, b: number);

        /*
            The opacity of the color. The range of valid values is 0 to 255.
        */
        a: number;

        /*
            The red value of the color. The range of valid values is 0 to 255.
        */
        r: number;

        /*
            The green value of the color. The range of valid values is 0 to 255.
        */
        g: number;

        /*
            The blue value of the color. The range of valid values is 0 to 255.
        */
        b: number;

        /*
            Creates a copy of the Color object.
        */
        static clone(color: Color): Color;

        /*
            Converts the specified hex string to a Color.
        */
        static fromHex(hex: string): Color;

        /*
            Returns a copy of the Color object.
        */
        clone(): Color;

        /*
            Returns the opacity of the Color as a value between 0 (a=0) and 1 (a=255).
        */
        getOpacity(): number;

        /*
            Converts the Color into a 6-digit hex string. Opacity is ignored. For example, a Color with values (255,0,0,0) is returned as hex string #000000.
        */
        toHex(): string;

        /*
            Converts the Color object to a string.
        */
        toString(): string;
    }

    export interface MapOptions {
        backgroundColor?: Color;
        credentials?: string;
        customizeOverlays?: boolean;
        disableBirdseye?: boolean;
        disableKeyboardInput?: boolean;
        disableMouseInput?: boolean;
        disablePanning?: boolean;
        disableTouchInput?: boolean;
        disableUserInput?: boolean;
        disableZooming?: boolean;
        enableClickableLogo?: boolean;
        enableSearchLogo?: boolean;
        fixedMapPosition?: boolean;
        height?: number;
        inertiaIntensity?: number;
        showBreadcrumb?: boolean;
        showCopyright?: boolean;
        showDashboard?: boolean;
        showMapTypeSelector?: boolean;
        showScalebar?: boolean;
        theme?: any;
        tileBuffer?: number;
        useInertia?: boolean;
        width?: number;
    }

    export interface ViewOptions {
        //Properties
        animate?: boolean;
        bounds?: LocationRect;
        center?: Location;
        centerOffset?: Point;
        heading?: number;
        labelOverlay?: LabelOverlay;
        mapTypeId?: string;
        padding?: number;
        zoom?: number;
    }

    export class PixelReference {
        //The pixel is defined relative to the map control’s root element, where the top left corner of the map control is (0, 0). Using this option might cause a page reflow which may negatively impact performance.
        static control: string;
        //The pixel is defined relative to the page, where the top left corner of the HTML page is (0, 0). This option is best used when working with mouse or touch events. Using this option might cause a page reflow which may negatively impact performance.
        static page: string;
        //The pixel is defined in viewport coordinates, relative to the center of the map, where the center of the map is (0, 0). This option is best used for positioning geo-aligned entities added to the user layer.
        static viewport: string;

        static isValid(reference: PixelReference): boolean;
    }

    export class Point {
        constructor (x: number, y: number);

        x: number;
        y: number;

        static areEqual(point1: Point, point2: Point): boolean;
        static clone(point: Point): Point;

        clone(): Point;
        toString(): string;
    }

    export class Infobox implements Entity { }

    export class Polygon implements Entity {
        constructor (locations: Location[], options?: PolygonOptions);

        getFillColor(): Color;
        getLocations(): Location[];
        getStrokeColor(): Color;
        getStrokeDashArray(): string;
        getStrokeThickness(): number;
        getVisible(): boolean;
        setLocations(locations: Location[]): void;
        setOptions(options: PolylineOptions): void;
        toString(): string;

        click: (eventArgs: MouseEventArgs) => any;
        dbclick: (eventArgs: MouseEventArgs) => any;
        entitychanged: (entity: Entity) => any;
        mousedown: (eventArgs: MouseEventArgs) => any;
        mouseout: (eventArgs: MouseEventArgs) => any;
        mouseover: (eventArgs: MouseEventArgs) => any;
        mouseup: (eventArgs: MouseEventArgs) => any;
        rightclick: (eventArgs: MouseEventArgs) => any;
    }

    export class Polyline implements Entity {
        constructor (locations: Location[], options?: PolylineOptions);

        getLocations(): Location[];
        getStrokeColor(): Color;
        getStrokeDashArray(): string;
        getStrokeThickness(): number;
        getVisible(): boolean;
        setLocations(locations: Location[]): void;
        setOptions(options: PolylineOptions): void;
        toString(): string;

        click: (eventArgs: MouseEventArgs) => any;
        dbclick: (eventArgs: MouseEventArgs) => any;
        entitychanged: (entity: Entity) => any;
        mousedown: (eventArgs: MouseEventArgs) => any;
        mouseout: (eventArgs: MouseEventArgs) => any;
        mouseover: (eventArgs: MouseEventArgs) => any;
        mouseup: (eventArgs: MouseEventArgs) => any;
        rightclick: (eventArgs: MouseEventArgs) => any;
    }

    export class Pushpin implements Entity {
        constructor (location: Location, options?: PushpinOptions);
        getAnchor(): Point;
        getIcon(): string;
        getHeight(): number;
        getLocation(): Location;
        getText(): string;
        getTextOffset(): Point;
        getTypeName(): string;
        getVisible(): boolean;
        getWidth(): number;
        getZIndex(): number;
        setLocation(location: Location): void;
        setOptions(options: PushpinOptions): void;
        toString(): string;

        click: (eventArgs: MouseEventArgs) => any;
        dblclick: (eventArgs: MouseEventArgs) => any;
        drag: (object: Pushpin) => any;
        dragend: (eventArgs: MouseEventArgs) => any;
        dragstart: (eventArgs: MouseEventArgs) => any;
        entitychanged: (object: { entity: Entity; }) => any;
        mousedown: (eventArgs: MouseEventArgs) => any;
        mouseout: (eventArgs: MouseEventArgs) => any;
        mouseover: (eventArgs: MouseEventArgs) => any;
        mouseup: (eventArgs: MouseEventArgs) => any;
        rightclick: (eventArgs: MouseEventArgs) => any;
    }

    export class TileLayer implements Entity {
        constructor (options: TileLayerOptions);

        getOpacty(): number;
        /*
        Returns the tile source of the tile layer.
        The projection parameter accepts the following values: mercator, enhancedBirdseyeNorthUp, enhancedBirdseyeSouthUp, enhancedBirdseyeEastUp, enhancedBirdseyeWestUp
        */
        getTileSource(projection: string): TileSource;
        getZIndex(): number;
        setOptions(options: TileLayerOptions): void;
        toString(): string;

        tiledownloadcomplete: () => any;
    }

    export class PositionError {
        /*
            The error code.
            Any one of the following error codes may be returned:
            0 - An error occurred that is not covered by other error codes.

            1 - The application does not have permission to use the GeoLocation API.

            2 - The position of the host device could not be determined.

            3 - The specified timeout was exceeded.
        */
        code: number;

        //The error message. This message is for the developer and is not intended to be displayed to the end user.
        message: string;
    }

    export class LabelOverlay {
        //Map labels are not shown on top of imagery.
        static hidden: string;
        //Map labels are shown on top of imagery.
        static visible: string;

        static isValid(labelOverlay: LabelOverlay): boolean;
    }

    export class EntityState {
        //The entity is highlighted on the map.
        static highlighted: string;

        //The entity is not highlighted or selected.
        static none: string;

        //The entity is selected on the map.
        static selected: string;
    }

    /*
        Defines a tile layer’s visibility during animation.
    */
    export class AnimationVisibility {
        //The map control determines whether or not to show a tile layer based on system capability. If a browser can render a tile layer with acceptable performance, it is displayed during animations.
        static auto: string;

        //The tile layer is not displayed during animation.
        static hide: string;

        //The tile layer is displayed during animations. This option may impact performance on older browsers.
        static show: string;
    }

    export class InfoboxType {
        //A smaller info box with space for a title.
        static mini: string;

        //The default info box style. This standard info box makes space for a title, title link, description, and other links if they are specified.
        static standard: string;
    }

    export class Position {
        //The position as a W3C Coordinates object.
        coords: Coordinates;
        //The time when the position was determined, in the form of a DOMTimeStamp.
        timestamp: string;
    }

    export interface TileSourceOptions {
        height?: number;
        //The string that constructs the URLs used to retrieve tiles from the tile source. This property is required. The uriConstructor will replace {subdomain} and {quadkey}.
        uriConstructor: string;
        width?: number;
    }

    export class TileSource {
        constructor (options: TileSourceOptions);

        getHeight(): number;
        getUriConstructor(): string;
        getWidth(): string;
        toString(): string;
    }

    export interface TileLayerOptions {
        animationDisplay?: AnimationVisibility;
        downloadTimeout?: number;
        mercator?: TileSource;
        opacity?: number;
        visible?: boolean;
        zIndex?: number;
    }

    export interface PushpinOptions {
        anchor?: Point;
        draggable?: boolean;
        height?: number;
        htmlContent?: string;
        icon?: string;
        infobox?: Infobox;
        state?: EntityState;
        text?: string;
        textOffset?: Point;
        typeName?: string;
        visible?: boolean;
        width?: number;
        zIndex?: number;
    }

    export interface PositionOptions {
        enableHighAccuracy?: boolean;
        /*
        The function to call when an error occurs during the user location request. The callback function must accept one argument.
        The argument object contains two properties, internalError, a PositionError type, and errorCode, a number.
        
        Any one of the following errorCode values may be returned:
        1 - The application origin does not have permission to use the GeoLocation API.

        2 - The position of the user could not be determined because of a device failure.

        3 - The time specified in timeout has been exceeded.

        4 - A request is already in process.

        5 - The user’s browser does not support geo location.
        */
        errorCallback?: (internalError: PositionError, errorCode: number) => void;
        maximumAge?: number;
        showAccuracyCircle?: boolean;
        successCallback?: (center: Location, position: Position) => void;
        timeout?: number;
        updateMapView?: boolean;
    }

    //TODO: Change options interfaces so a concrete class and an interface exists
    export interface PositionCircleOptions {
        //The polygon options for the geo location accuracy circle.
        polygonOptions?: PolygonOptions;
        //A boolean indicating whether to display the geo location accuracy circle. The default value is true. If this property is set to false, a geo location accuracy circle is not drawn and any existing accuracy circles are removed.
        showOnMap?: boolean;
    }

    export interface PolylineOptions {
        //The color of the outline of the polygon.
        strokeColor?: Color;
        //A string representing the stroke/gap sequence to use to draw the outline of the polygon. The string must be in the format S, G, S*, G*, where S represents the stroke length and G represents gap length. Stroke lengths and gap lengths can be separated by commas or spaces. For example, a stroke dash string of “1 4 2 1” would draw the polygon outline with a dash, four spaces, two dashes, one space, and then repeated.
        strokeDashArray?: string;
        //The thickness of the outline of the polygon.
        strokeThickness?: number;
        //A boolean indicating whether to show or hide the polygon. A value of false indicates that the polygon is hidden, although it is still an entity on the map.
        visible?: boolean;
    }

    export interface PolygonOptions {
        //The color of the inside of the polygon.
        fillColor?: Color;
        //The info box associated with this polygon. If an info box is assigned and the Microsoft.Maps.Themes.BingTheme module is loaded, then the info box appears when the hover or click events of the polygon occur.
        infobox?: Infobox;
        //The color of the outline of the polygon.
        strokeColor?: Color;
        //A string representing the stroke/gap sequence to use to draw the outline of the polygon. The string must be in the format S, G, S*, G*, where S represents the stroke length and G represents gap length. Stroke lengths and gap lengths can be separated by commas or spaces. For example, a stroke dash string of “1 4 2 1” would draw the polygon outline with a dash, four spaces, two dashes, one space, and then repeated.
        strokeDashArray?: string;
        //The thickness of the outline of the polygon.
        strokeThickness?: number;
        //A boolean indicating whether to show or hide the polygon. A value of false indicates that the polygon is hidden, although it is still an entity on the map.
        visible?: boolean;
    }

    export interface InfoboxOptions {
        //A list of the info box actions, where each item is a label (the link text) or icon (the URL of the image to use as the icon link) and eventHandler (name of the function handling a click of the action link).
        actions?: { label?: string; icon?: string; eventHandler: () => void; };
        //The string displayed inside the info box.
        description?: string;
        htmlContent?: string;
        id?: string;
        location?: Location;
        offset?: Point;
        showCloseButton?: boolean;
        showPointer?: boolean;
        pushpin?: Pushpin;
        title?: string;
        titleAction?: { label?: string; eventHandler: () => void; };
        titleClickHandler?: string;
        typeName?: InfoboxType;
        visible?: boolean;
        width?: number;
        height?: number;
    }

    /*
        Contains a collection of entities. An Entity can be any one of the following types: Infobox, Polygon, Polyline, Pushpin, TileLayer, or EntityCollection.
    */
    export interface EntityCollectionOptions {
        bubble?: boolean;
        visible?: boolean;
        zIndex?: number;
    }

    export class EntityCollection implements Entity {
        /*
         * CONSTRUCTOR
         */

        /*
            Initializes a new instance of the EntityCollection class.
        */
        EntityCollection(options?: EntityCollectionOptions);

        /*
         * METHODS
         */

        /*
            Removes all entities from the collection.
        */
        clear(): void;
        get(index: number): Entity;
        getLength(): number;
        getVisible(): boolean;
        getZIndex(): number;
        indexOf(entity: Entity): number;
        insert(entity: Entity, index: number): void;
        pop(): Entity;
        push(entity: Entity): void;
        remove(entity: Entity): Entity;
        removeAt(index: number): Entity;
        setOptions(options: EntityCollectionOptions): void;
        toString(): string;

        //Events
        entityAdded: (object: { collection: EntityCollection; entity: Entity; }) => any;
        entityChanged: (object: { collection: EntityCollection; entity: Entity; }) => any;
        entityRemoved: (object: { collection: EntityCollection; entity: Entity; }) => any;
    }

    export class Map {
        //Constructors
        constructor (mapElement: HTMLElement, options?: MapOptions);
        constructor (mapElement: HTMLElement, options?: ViewOptions);
        width: number;
        height: number;

        //Properties
        entities: EntityCollection;

        //Static Methods
        getVersion(): string;

        //Methods
        blur(): void;
        dispose(): void;
        focus(): void;
        getBounds(): LocationRect;
        getCenter(): Location;
        getCopyrights(callback: (attributions: string[]) => void ): string[];
        getCredentials(callback: (credentials: string) => void ): void;
        getHeading(): number;
        getHeight(): number;
        getImageryId(): string;
        getMapTypeId(): string;
        getMetersPerPixel(): number;
        getMode(): MapMode;
        getModeLayer(): Node;
        getOptions(): MapOptions;
        getPageX(): number;
        getRootElement(): Node;
        getTargetBounds(): LocationRect;
        getTargetCenter(): Location;
        getTargetHeading(): number;
        getTargetMetersPerPixel(): number;
        getTargetZoom(): number;
        getUserLayer(): Node;
        getViewportX(): number;
        getViewportY(): number;
        getWidth(): number;
        getZoom(): number;
        getZoomRange(): { min: number; max: number; };
        isDownloadingTiles(): boolean;
        isMercator(): boolean;
        isRotationEnabled(): boolean;
        setMapType(mapTypeId: string): void;
        setOptions(options: { height: number; width: number; }): void;
        setView(options: ViewOptions): void;
        restrictZoom(min: number, max: number);
        tryLocationToPixel(location: Location, reference?: PixelReference): Point;
        tryLocationToPixel(location: Location[], reference?: PixelReference): Point[];
        tryPixelToLocation(point: Point, reference?: PixelReference): Location;
        tryPixelToLocation(point: Point[], reference?: PixelReference): Location[];

        //Events
        click: (eventArgs: MouseEventArgs) => any;
        copyrightchanged: () => any;
        dblclick: (eventArgs: MouseEventArgs) => any;
        imagerychanged: () => any;
        keydown: (eventArgs: KeyEventArgs) => any;
        keypress: (eventArgs: KeyEventArgs) => any;
        keyup: (eventArgs: KeyEventArgs) => any;
        maptypechanged: () => any;
        mousedown: (eventArgs: MouseEventArgs) => any;
        mousemove: (eventArgs: MouseEventArgs) => any;
        mouseout: (eventArgs: MouseEventArgs) => any;
        mouseover: (eventArgs: MouseEventArgs) => any;
        mouseup: (eventArgs: MouseEventArgs) => any;
        mousewheel: (eventArgs: MouseEventArgs) => any;
        rightlick: (eventArgs: MouseEventArgs) => any;
        targetviewchanged: () => any;
        tiledownloadcomplete: () => any;
        viewchange: () => any;
        viewchangeend: () => any;
        viewchangestart: () => any;
    }

    module Events {
        function addHandler(target: any, eventName: string, handler: any);
        function addThrottledHandler(target: any, eventName: string, handler: any, throttleInterval: any);
    }
}
declare var Quill: quill.QuillStatic;
declare var Delta: quill.DeltaStatic;

declare module quill {
    interface EventEmitter2 {
        on(event: string, listener: Function);
        off(event: string, listener: Function);
        removeAllListeners(event?: string);
        emit(event: string, ...args: any[]);
    }

    interface Range {
        start: number;
        end: number;
    }

    interface QuillEvents {
        FORMAT_INIT: string;
        MODULE_INIT: string;
        POST_EVENT: string;
        PRE_EVENT: string;
        SELECTION_CHANGE: string;
        TEXT_CHANGE: string;
    }

    interface Quill extends EventEmitter2 {
        container: HTMLElement;
        root: HTMLElement;
        getText(start?: number, end?: number): string;
        getLength(): number;
        getContents(start?: number, end?: number): Delta;
        getHTML(): string;
        
        insertText(index: number, text: string)
        insertText(index: number, text: string, name: string, value: string)
        insertText(index: number, text: string, formats: FormatAttributes)
        insertText(index: number, text: string, source: string)
        insertText(index: number, text: string, name: string, value: string, source: string)
        insertText(index: number, text: string, formats: FormatAttributes, source: string)

        deleteText(start, end, source): void;
        formatText(start: number, end: number, name: string, value: any, source: string): void;
        formatText(range: any, name: string, value: any, source: string): void;
        insertEmbed(index, type, url, source): void;
        updateContents(delta, source): void;
        setContents(delta, source): void;
        setHTML(html, source): void;
        setText(text, source): void;
        
        getSelection(): Range;

        setSelection(start: number, end: number, source?: string): void;
        setSelection(range: Range, source?: string): void;

        prepareFormat(name, value, source): any;
        focus(): any;
        
        addModule(name, options): any;
        getModule(name): any;
        onModuleLoad(name, callback): any;
        addFormat(name, config): any;
        addContainer(className, before): any;
    }

    interface FormatAttributes {
        bold?: boolean;
        italic?: boolean;
        strike?: boolean;
        underline?: boolean;
        font?: string;
        size?: string;
        color?: string;
        background?: string;
        image?: string;
        link?: string;
        bullet?: boolean;
        list?: boolean;
        align?: string
    }

    interface QuillStatic {
        new (container: any): Quill;
        new (container: any, configs: any): Quill;
        events: QuillEvents;
    }

    interface Delta {
        ops?: Op[];

        insert(text: string, attributes?: FormatAttributes): Delta;
        insert(embed: number, attributes?: FormatAttributes): Delta;

        delete(length: number): Delta;

        retain(length: number, attributes?: FormatAttributes): Delta;

        length(): number;

        slice(): Delta;
        slice(start: number): Delta;
        slice(start: number, end: number): Delta;

        compose(other: Delta): Delta;

        transform(other: Delta, priority: boolean): Delta;
        transform(index: number): number;

        transformPosition(index: number): number;

        diff(other: Delta): Delta;
    }

    interface DeltaStatic {
        new (): Delta;
    }

    type Op = InsertOp | DeleteOp | RetainOp;

    interface InsertOp {
        insert: string | number;
        attributes?: FormatAttributes;
    }

    interface DeleteOp {
        delete: number;
    }

    interface RetainOp {
        retain: number;
        attributes?: FormatAttributes;
    }
}
// Type definitions for Lo-Dash
// Project: http://lodash.com/
// Definitions by: Brian Zengel <https://github.com/bczengel>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare var _: _.LoDashStatic;

declare module _ {
    interface LoDashStatic {
        /**
        * Creates a lodash object which wraps the given value to enable intuitive method chaining.
        *
        * In addition to Lo-Dash methods, wrappers also have the following Array methods:
        * concat, join, pop, push, reverse, shift, slice, sort, splice, and unshift
        *
        * Chaining is supported in custom builds as long as the value method is implicitly or 
        * explicitly included in the build.
        *
        * The chainable wrapper functions are:
        * after, assign, bind, bindAll, bindKey, chain, compact, compose, concat, countBy, 
        * createCallback, curry, debounce, defaults, defer, delay, difference, filter, flatten, 
        * forEach, forEachRight, forIn, forInRight, forOwn, forOwnRight, functions, groupBy, 
        * indexBy, initial, intersection, invert, invoke, keys, map, max, memoize, merge, min, 
        * object, omit, once, pairs, partial, partialRight, pick, pluck, pull, push, range, reject, 
        * remove, rest, reverse, shuffle, slice, sort, sortBy, splice, tap, throttle, times, 
        * toArray, transform, union, uniq, unshift, unzip, values, where, without, wrap, and zip
        *
        * The non-chainable wrapper functions are:
        * clone, cloneDeep, contains, escape, every, find, findIndex, findKey, findLast, 
        * findLastIndex, findLastKey, has, identity, indexOf, isArguments, isArray, isBoolean, 
        * isDate, isElement, isEmpty, isEqual, isFinite, isFunction, isNaN, isNumber, 
        * isObject, isPlainObject, isRegExp, isString, join, lastIndexOf, mixin, 
        * noConflict, parseInt, pop, random, reduce, reduceRight, result, shift, size, some, 
        * sortedIndex, runInContext, template, unescape, uniqueId, and value
        *
        * The wrapper functions first and last return wrapped values when n is provided, otherwise 
        * they return unwrapped values.
        *
        * Explicit chaining can be enabled by using the _.chain method.
        **/
        (value: number): LoDashWrapper<number>;
        (value: string): LoDashWrapper<string>;
        (value: boolean): LoDashWrapper<boolean>;
        <T>(value: Array<T>): LoDashArrayWrapper<T>;
        <T extends {}>(value: T): LoDashObjectWrapper<T>;
        (value: any): LoDashWrapper<any>;

        /**
        * The semantic version number.
        **/
        VERSION: string;

        /**
        * An object used to flag environments features.
        **/
        support: Support;

        /**
        * By default, the template delimiters used by Lo-Dash are similar to those in embedded Ruby 
        * (ERB). Change the following template settings to use alternative delimiters.
        **/
        templateSettings: TemplateSettings;
    }

    /**
    * By default, the template delimiters used by Lo-Dash are similar to those in embedded Ruby 
    * (ERB). Change the following template settings to use alternative delimiters.
    **/
    interface TemplateSettings {
        /**
        * The "escape" delimiter.
        **/
        escape?: RegExp;

        /**
        * The "evaluate" delimiter.
        **/
        evaluate?: RegExp;

        /**
        * An object to import into the template as local variables.
        **/
        imports?: Dictionary<any>;

        /**
        * The "interpolate" delimiter.
        **/
        interpolate?: RegExp;

        /**
        * Used to reference the data object in the template text.
        **/
        variable?: string;
    }

    /**
    * An object used to flag environments features.
    **/
    interface Support {
        /**
        * Detect if an arguments object’s [[Class]] is resolvable (all but Firefox < 4, IE < 9).
        **/
        argsClass: boolean;

        /**
        * Detect if arguments objects are Object objects (all but Narwhal and Opera < 10.5).
        **/
        argsObject: boolean;

        /**
        * Detect if name or message properties of Error.prototype are enumerable by default. 
        * (IE < 9, Safari < 5.1)
        **/
        enumErrorProps: boolean;

        /**
        * Detect if Function#bind exists and is inferred to be fast (all but V8).
        **/
        fastBind: boolean;

        /**
        * Detect if functions can be decompiled by Function#toString (all but PS3 and older Opera 
        * mobile browsers & avoided in Windows 8 apps).
        **/
        funcDecomp: boolean;

        /**
        * Detect if Function#name is supported (all but IE).
        **/
        funcNames: boolean;

        /**
        * Detect if arguments object indexes are non-enumerable (Firefox < 4, IE < 9, PhantomJS, 
        * Safari < 5.1).
        **/
        nonEnumArgs: boolean;

        /**
        * Detect if properties shadowing those on Object.prototype are non-enumerable.
        *
        * In IE < 9 an objects own properties, shadowing non-enumerable ones, are made 
        * non-enumerable as well (a.k.a the JScript [[DontEnum]] bug).
        **/
        nonEnumShadows: boolean;

        /**
        * Detect if own properties are iterated after inherited properties (all but IE < 9).
        **/
        ownLast: boolean;

        /**
        * Detect if Array#shift and Array#splice augment array-like objects correctly.
        *
        * Firefox < 10, IE compatibility mode, and IE < 9 have buggy Array shift() and splice() 
        * functions that fail to remove the last element, value[0], of array-like objects even 
        * though the length property is set to 0. The shift() method is buggy in IE 8 compatibility 
        * mode, while splice() is buggy regardless of mode in IE < 9 and buggy in compatibility mode
        * in IE 9.
        **/
        spliceObjects: boolean;

        /**
        * Detect lack of support for accessing string characters by index.
        *
        * IE < 8 can't access characters by index and IE 8 can only access characters by index on 
        * string literals.
        **/
        unindexedChars: boolean;
    }

    interface LoDashWrapperBase<T, TWrapper> {
        /**
        * Produces the toString result of the wrapped value.
        * @return Returns the string result.
        **/
        toString(): string;

        /**
        * Extracts the wrapped value.
        * @return The wrapped value.
        **/
        valueOf(): T;

        /**
        * @see valueOf
        **/
        value(): T;
    }

    interface LoDashWrapper<T> extends LoDashWrapperBase<T, LoDashWrapper<T>> { }

    interface LoDashObjectWrapper<T> extends LoDashWrapperBase<T, LoDashObjectWrapper<T>> { }

    interface LoDashArrayWrapper<T> extends LoDashWrapperBase<T[], LoDashArrayWrapper<T>> {
        concat(...items: T[]): LoDashArrayWrapper<T>;
        join(seperator?: string): LoDashWrapper<string>;
        pop(): LoDashWrapper<T>;
        push(...items: T[]): void;
        reverse(): LoDashArrayWrapper<T>;
        shift(): LoDashWrapper<T>;
        slice(start: number, end?: number): LoDashArrayWrapper<T>;
        sort(compareFn?: (a: T, b: T) => number): LoDashArrayWrapper<T>;
        splice(start: number): LoDashArrayWrapper<T>;
        splice(start: number, deleteCount: number, ...items: any[]): LoDashArrayWrapper<T>;
        unshift(...items: any[]): LoDashWrapper<number>;
    }

    //_.chain
    interface LoDashStatic {
        /**
        * Creates a lodash object that wraps the given value with explicit method chaining enabled.
        * @param value The value to wrap.
        * @return The wrapper object.
        **/
        chain(value: number): LoDashWrapper<number>;
        chain(value: string): LoDashWrapper<string>;
        chain(value: boolean): LoDashWrapper<boolean>;
        chain<T>(value: Array<T>): LoDashArrayWrapper<T>;
        chain<T extends {}>(value: T): LoDashObjectWrapper<T>;
        chain(value: any): LoDashWrapper<any>;
    }

    interface LoDashWrapperBase<T, TWrapper> {
        /**
        * Enables explicit method chaining on the wrapper object.
        * @see _.chain
        * @return The wrapper object.
        **/
        chain(): TWrapper;
    }

    //_.tap
    interface LoDashStatic {
        /**
        * Invokes interceptor with the value as the first argument and then returns value. The 
        * purpose of this method is to "tap into" a method chain in order to perform operations on 
        * intermediate results within the chain.
        * @param value The value to provide to interceptor
        * @param interceptor The function to invoke.
        * @return value
        **/
        tap<T>(
            value: T,
            interceptor: (value: T) => void): T;
    }

    interface LoDashWrapperBase<T, TWrapper> {
        /**
        * @see _.tap
        **/
        tap(interceptor: (value: T) => void): TWrapper;
    }

    /*********
    * Arrays *
    **********/

    //_.compact
    interface LoDashStatic {
        /**
        * Returns a copy of the array with all falsy values removed. In JavaScript, false, null, 0, "",
        * undefined and NaN are all falsy.
        * @param array Array to compact.
        * @return (Array) Returns a new array of filtered values.
        **/
        compact<T>(array: Array<T>): T[];

        /**
        * @see _.compact
        **/
        compact<T>(array: List<T>): T[];
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.compact
        **/
        compact(): LoDashArrayWrapper<T>;
    }

    //_.difference
    interface LoDashStatic {
        /**
        * Creates an array excluding all values of the provided arrays using strict equality for comparisons
        * , i.e. ===.
        * @param array The array to process
        * @param others The arrays of values to exclude.
        * @return Returns a new array of filtered values.
        **/
        difference<T>(
            array: Array<T>,
            ...others: Array<T>[]): T[];
        /**
        * @see _.difference
        **/
        difference<T>(
            array: List<T>,
            ...others: List<T>[]): T[];
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.difference
        **/
        difference(
            ...others: Array<T>[]): LoDashArrayWrapper<T>;
        /**
        * @see _.difference
        **/
        difference(
            ...others: List<T>[]): LoDashArrayWrapper<T>;
    }

    //_.findIndex
    interface LoDashStatic {
        /**
        * This method is like _.find except that it returns the index of the first element that passes 
        * the callback check, instead of the element itself.
        * @param array The array to search.
        * @param {(Function|Object|string)} callback The function called per iteration. If a property name or object is provided it will be 
        * used to create a ".pluck" or ".where" style callback, respectively.
        * @param thisArg The this binding of callback.
        * @return Returns the index of the found element, else -1.
        **/
        findIndex<T>(
            array: Array<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): number;

        /**
        * @see _.findIndex
        **/
        findIndex<T>(
            array: List<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): number;

        /**
        * @see _.findIndex
        **/
        findIndex<T>(
            array: Array<T>,
            pluckValue: string): number;

        /**
        * @see _.findIndex
        **/
        findIndex<T>(
            array: List<T>,
            pluckValue: string): number;

        /**
        * @see _.findIndex
        **/
        findIndex<W, T>(
            array: Array<T>,
            whereDictionary: W): number;

        /**
        * @see _.findIndex
        **/
        findIndex<W, T>(
            array: List<T>,
            whereDictionary: W): number;
    }

    //_.findLastIndex
    interface LoDashStatic {
        /**
        * This method is like _.findIndex except that it iterates over elements of a collection from right to left.
        * @param array The array to search.
        * @param {(Function|Object|string)} callback The function called per iteration. If a property name or object is provided it will be 
        * used to create a ".pluck" or ".where" style callback, respectively.
        * @param thisArg The this binding of callback.
        * @return Returns the index of the found element, else -1.
        **/
        findLastIndex<T>(
            array: Array<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): number;

        /**
        * @see _.findLastIndex
        **/
        findLastIndex<T>(
            array: List<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): number;

        /**
        * @see _.findLastIndex
        **/
        findLastIndex<T>(
            array: Array<T>,
            pluckValue: string): number;

        /**
        * @see _.findLastIndex
        **/
        findLastIndex<T>(
            array: List<T>,
            pluckValue: string): number;

        /**
        * @see _.findLastIndex
        **/
        findLastIndex<T>(
            array: Array<T>,
            whereDictionary: Dictionary<any>): number;

        /**
        * @see _.findLastIndex
        **/
        findLastIndex<T>(
            array: List<T>,
            whereDictionary: Dictionary<any>): number;
    }

    //_.first
    interface LoDashStatic {
        /**
        * Gets the first element or first n elements of an array. If a callback is provided 
        * elements at the beginning of the array are returned as long as the callback returns 
        * truey. The callback is bound to thisArg and invoked with three arguments; (value, 
        * index, array).
        *
        * If a property name is provided for callback the created "_.pluck" style callback 
        * will return the property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will return ]
        * true for elements that have the properties of the given object, else false.
        * @param array Retrieves the first element of this array.
        * @return Returns the first element of `array`.
        **/
        first<T>(array: Array<T>): T;

        /**
        * @see _.first
        **/
        first<T>(array: List<T>): T;

        /**
        * @see _.first
        * @param n The number of elements to return.
        **/
        first<T>(
            array: Array<T>,
            n: number): T[];

        /**
        * @see _.first
        * @param n The number of elements to return.
        **/
        first<T>(
            array: List<T>,
            n: number): T[];

        /**
        * @see _.first
        * @param callback The function called per element.
        * @param [thisArg] The this binding of callback.
        **/
        first<T>(
            array: Array<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.first
        * @param callback The function called per element.
        * @param [thisArg] The this binding of callback.
        **/
        first<T>(
            array: List<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.first
        * @param pluckValue "_.pluck" style callback value
        **/
        first<T>(
            array: Array<T>,
            pluckValue: string): T[];

        /**
        * @see _.first
        * @param pluckValue "_.pluck" style callback value
        **/
        first<T>(
            array: List<T>,
            pluckValue: string): T[];

        /**
        * @see _.first
        * @param whereValue "_.where" style callback value
        **/
        first<W, T>(
            array: Array<T>,
            whereValue: W): T[];

        /**
        * @see _.first
        * @param whereValue "_.where" style callback value
        **/
        first<W, T>(
            array: List<T>,
            whereValue: W): T[];

        /**
        * @see _.first
        **/
        head<T>(array: Array<T>): T;

        /**
        * @see _.first
        **/
        head<T>(array: List<T>): T;

        /**
        * @see _.first
        **/
        head<T>(
            array: Array<T>,
            n: number): T[];

        /**
        * @see _.first
        **/
        head<T>(
            array: List<T>,
            n: number): T[];

        /**
        * @see _.first
        **/
        head<T>(
            array: Array<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.first
        **/
        head<T>(
            array: List<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.first
        **/
        head<T>(
            array: Array<T>,
            pluckValue: string): T[];

        /**
        * @see _.first
        **/
        head<T>(
            array: List<T>,
            pluckValue: string): T[];

        /**
        * @see _.first
        **/
        head<W, T>(
            array: Array<T>,
            whereValue: W): T[];

        /**
        * @see _.first
        **/
        head<W, T>(
            array: List<T>,
            whereValue: W): T[];

        /**
        * @see _.first
        **/
        take<T>(array: Array<T>): T;

        /**
        * @see _.first
        **/
        take<T>(array: List<T>): T;

        /**
        * @see _.first
        **/
        take<T>(
            array: Array<T>,
            n: number): T[];

        /**
        * @see _.first
        **/
        take<T>(
            array: List<T>,
            n: number): T[];

        /**
        * @see _.first
        **/
        take<T>(
            array: Array<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.first
        **/
        take<T>(
            array: List<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.first
        **/
        take<T>(
            array: Array<T>,
            pluckValue: string): T[];

        /**
        * @see _.first
        **/
        take<T>(
            array: List<T>,
            pluckValue: string): T[];

        /**
        * @see _.first
        **/
        take<W, T>(
            array: Array<T>,
            whereValue: W): T[];

        /**
        * @see _.first
        **/
        take<W, T>(
            array: List<T>,
            whereValue: W): T[];
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.first
        **/
        first(): T;

        /**
        * @see _.first
        * @param n The number of elements to return.
        **/
        first(n: number): LoDashArrayWrapper<T>;

        /**
        * @see _.first
        * @param callback The function called per element.
        * @param [thisArg] The this binding of callback.
        **/
        first(
            callback: ListIterator<T, boolean>,
            thisArg?: any): LoDashArrayWrapper<T>;

        /**
        * @see _.first
        * @param pluckValue "_.pluck" style callback value
        **/
        first(pluckValue: string): LoDashArrayWrapper<T>;

        /**
        * @see _.first
        * @param whereValue "_.where" style callback value
        **/
        first<W>(whereValue: W): LoDashArrayWrapper<T>;

        /**
        * @see _.first
        **/
        head(): T;

        /**
        * @see _.first
        * @param n The number of elements to return.
        **/
        head(n: number): LoDashArrayWrapper<T>;

        /**
        * @see _.first
        * @param callback The function called per element.
        * @param [thisArg] The this binding of callback.
        **/
        head(
            callback: ListIterator<T, boolean>,
            thisArg?: any): LoDashArrayWrapper<T>;

        /**
        * @see _.first
        * @param pluckValue "_.pluck" style callback value
        **/
        head(pluckValue: string): LoDashArrayWrapper<T>;

        /**
        * @see _.first
        * @param whereValue "_.where" style callback value
        **/
        head<W>(whereValue: W): LoDashArrayWrapper<T>;

        /**
        * @see _.first
        **/
        take(): T;

        /**
        * @see _.first
        * @param n The number of elements to return.
        **/
        take(n: number): LoDashArrayWrapper<T>;

        /**
        * @see _.first
        * @param callback The function called per element.
        * @param [thisArg] The this binding of callback.
        **/
        take(
            callback: ListIterator<T, boolean>,
            thisArg?: any): LoDashArrayWrapper<T>;

        /**
        * @see _.first
        * @param pluckValue "_.pluck" style callback value
        **/
        take(pluckValue: string): LoDashArrayWrapper<T>;

        /**
        * @see _.first
        * @param whereValue "_.where" style callback value
        **/
        take<W>(whereValue: W): LoDashArrayWrapper<T>;
    }

    //_.flatten
    interface LoDashStatic {
        /**
        * Flattens a nested array (the nesting can be to any depth). If isShallow is truey, the 
        * array will only be flattened a single level. If a callback is provided each element of 
        * the array is passed through the callback before flattening. The callback is bound to 
        * thisArg and invoked with three arguments; (value, index, array).
        *
        * If a property name is provided for callback the created "_.pluck" style callback will 
        * return the property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will return 
        * true for elements that have the properties of the given object, else false.
        * @param array The array to flatten.
        * @param shallow If true then only flatten one level, optional, default = false.
        * @return `array` flattened.
        **/
        flatten<T>(array: Array<any>, isShallow?: boolean): T[];

        /**
        * @see _.flatten
        **/
        flatten<T>(array: List<any>, isShallow?: boolean): T[];

        /**
        * @see _.flatten
        **/
        flatten<T>(
            array: Array<any>,
            isShallow: boolean,
            callback: ListIterator<any, T>,
            thisArg?: any): T[];

        /**
        * @see _.flatten
        **/
        flatten<T>(
            array: List<any>,
            isShallow: boolean,
            callback: ListIterator<any, T>,
            thisArg?: any): T[];

        /**
        * @see _.flatten
        **/
        flatten<T>(
            array: Array<any>,
            callback: ListIterator<any, T>,
            thisArg?: any): T[];

        /**
        * @see _.flatten
        **/
        flatten<T>(
            array: List<any>,
            callback: ListIterator<any, T>,
            thisArg?: any): T[];

        /**
        * @see _.flatten
        **/
        flatten<W, T>(
            array: Array<any>,
            isShallow: boolean,
            whereValue: W): T[];

        /**
        * @see _.flatten
        **/
        flatten<W, T>(
            array: List<any>,
            isShallow: boolean,
            whereValue: W): T[];

        /**
        * @see _.flatten
        **/
        flatten<W, T>(
            array: Array<any>,
            whereValue: W): T[];

        /**
        * @see _.flatten
        **/
        flatten<W, T>(
            array: List<any>,
            whereValue: W): T[];

        /**
        * @see _.flatten
        **/
        flatten<T>(
            array: Array<any>,
            isShallow: boolean,
            pluckValue: string): T[];

        /**
        * @see _.flatten
        **/
        flatten<T>(
            array: List<any>,
            isShallow: boolean,
            pluckValue: string): T[];

        /**
        * @see _.flatten
        **/
        flatten<T>(
            array: Array<any>,
            pluckValue: string): T[];

        /**
        * @see _.flatten
        **/
        flatten<T>(
            array: List<any>,
            pluckValue: string): T[];
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.flatten
        **/
        flatten<Flat>(isShallow?: boolean): LoDashArrayWrapper<Flat>;

        /**
        * @see _.flatten
        **/
        flatten<Flat>(
            isShallow: boolean,
            callback: ListIterator<T, Flat>,
            thisArg?: any): LoDashArrayWrapper<Flat>;

        /**
        * @see _.flatten
        **/
        flatten<Flat>(
            callback: ListIterator<T, Flat>,
            thisArg?: any): LoDashArrayWrapper<Flat>;

        /**
        * @see _.flatten
        **/
        flatten<Flat>(
            isShallow: boolean,
            pluckValue: string): LoDashArrayWrapper<Flat>;

        /**
        * @see _.flatten
        **/
        flatten<Flat>(
            pluckValue: string): LoDashArrayWrapper<Flat>;

        /**
        * @see _.flatten
        **/
        flatten<Flat, W>(
            isShallow: boolean,
            whereValue: W): LoDashArrayWrapper<Flat>;

        /**
        * @see _.flatten
        **/
        flatten<Flat, W>(
            whereValue: W): LoDashArrayWrapper<Flat>;
    }

    //_.indexOf
    interface LoDashStatic {
        /**
        * Gets the index at which the first occurrence of value is found using strict equality 
        * for comparisons, i.e. ===. If the array is already sorted providing true for fromIndex 
        * will run a faster binary search.
        * @param array The array to search.
        * @param value The value to search for.
        * @param fromIndex The index to search from.
        * @return The index of `value` within `array`.
        **/
        indexOf<T>(
            array: Array<T>,
            value: T): number;

        /**
        * @see _.indexOf
        **/
        indexOf<T>(
            array: List<T>,
            value: T): number;

        /**
        * @see _.indexOf
        * @param fromIndex The index to search from
        **/
        indexOf<T>(
            array: Array<T>,
            value: T,
            fromIndex: number): number;

        /**
        * @see _.indexOf
        * @param fromIndex The index to search from
        **/
        indexOf<T>(
            array: List<T>,
            value: T,
            fromIndex: number): number;

        /**
        * @see _.indexOf
        * @param isSorted True to perform a binary search on a sorted array.
        **/
        indexOf<T>(
            array: Array<T>,
            value: T,
            isSorted: boolean): number;

        /**
        * @see _.indexOf
        * @param isSorted True to perform a binary search on a sorted array.
        **/
        indexOf<T>(
            array: List<T>,
            value: T,
            isSorted: boolean): number;
    }

    //_.initial
    interface LoDashStatic {
        /**
        * Gets all but the last element or last n elements of an array. If a callback is provided 
        * elements at the end of the array are excluded from the result as long as the callback 
        * returns truey. The callback is bound to thisArg and invoked with three arguments; 
        * (value, index, array).
        *
        * If a property name is provided for callback the created "_.pluck" style callback will 
        * return the property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will return 
        * true for elements that have the properties of the given object, else false.
        * @param array The array to query.
        * @param n Leaves this many elements behind, optional.
        * @return Returns everything but the last `n` elements of `array`.
        **/
        initial<T>(
            array: Array<T>): T[];

        /**
        * @see _.initial
        **/
        initial<T>(
            array: List<T>): T[];

        /**
        * @see _.initial
        * @param n The number of elements to exclude.
        **/
        initial<T>(
            array: Array<T>,
            n: number): T[];

        /**
        * @see _.initial
        * @param n The number of elements to exclude.
        **/
        initial<T>(
            array: List<T>,
            n: number): T[];

        /**
        * @see _.initial
        * @param callback The function called per element
        **/
        initial<T>(
            array: Array<T>,
            callback: ListIterator<T, boolean>): T[];

        /**
        * @see _.initial
        * @param callback The function called per element
        **/
        initial<T>(
            array: List<T>,
            callback: ListIterator<T, boolean>): T[];

        /**
        * @see _.initial
        * @param pluckValue _.pluck style callback
        **/
        initial<T>(
            array: Array<T>,
            pluckValue: string): T[];

        /**
        * @see _.initial
        * @param pluckValue _.pluck style callback
        **/
        initial<T>(
            array: List<T>,
            pluckValue: string): T[];

        /**
        * @see _.initial
        * @param whereValue _.where style callback
        **/
        initial<W, T>(
            array: Array<T>,
            whereValue: W): T[];

        /**
        * @see _.initial
        * @param whereValue _.where style callback
        **/
        initial<W, T>(
            array: List<T>,
            whereValue: W): T[];
    }

    //_.intersection
    interface LoDashStatic {
        /**
        * Creates an array of unique values present in all provided arrays using strict 
        * equality for comparisons, i.e. ===.
        * @param arrays The arrays to inspect.
        * @return Returns an array of composite values.
        **/
        intersection<T>(...arrays: Array<T>[]): T[];

        /**
        * @see _.intersection
        **/
        intersection<T>(...arrays: List<T>[]): T[];
    }

    //_.last
    interface LoDashStatic {
        /**
        * Gets the last element or last n elements of an array. If a callback is provided 
        * elements at the end of the array are returned as long as the callback returns truey. 
        * The callback is bound to thisArg and invoked with three arguments; (value, index, array).
        *
        * If a property name is provided for callback the created "_.pluck" style callback will 
        * return the property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will return 
        * true for elements that have the properties of the given object, else false.
        * @param array The array to query.
        * @return Returns the last element(s) of array.
        **/
        last<T>(array: Array<T>): T;

        /**
        * @see _.last
        **/
        last<T>(array: List<T>): T;

        /**
        * @see _.last
        * @param n The number of elements to return
        **/
        last<T>(
            array: Array<T>,
            n: number): T[];

        /**
        * @see _.last
        * @param n The number of elements to return
        **/
        last<T>(
            array: List<T>,
            n: number): T[];

        /**
        * @see _.last
        * @param callback The function called per element
        **/
        last<T>(
            array: Array<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.last
        * @param callback The function called per element
        **/
        last<T>(
            array: List<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.last
        * @param pluckValue _.pluck style callback
        **/
        last<T>(
            array: Array<T>,
            pluckValue: string): T[];

        /**
        * @see _.last
        * @param pluckValue _.pluck style callback
        **/
        last<T>(
            array: List<T>,
            pluckValue: string): T[];

        /**
        * @see _.last
        * @param whereValue _.where style callback
        **/
        last<W, T>(
            array: Array<T>,
            whereValue: W): T[];

        /**
        * @see _.last
        * @param whereValue _.where style callback
        **/
        last<W, T>(
            array: List<T>,
            whereValue: W): T[];
    }

    //_.lastIndexOf
    interface LoDashStatic {
        /**
        * Gets the index at which the last occurrence of value is found using strict equality 
        * for comparisons, i.e. ===. If fromIndex is negative, it is used as the offset from the 
        * end of the collection.
        * @param array The array to search.
        * @param value The value to search for.
        * @param fromIndex The index to search from.
        * @return The index of the matched value or -1.
        **/
        lastIndexOf<T>(
            array: Array<T>,
            value: T,
            fromIndex?: number): number;

        /**
        * @see _.lastIndexOf
        **/
        lastIndexOf<T>(
            array: List<T>,
            value: T,
            fromIndex?: number): number;
    }

    //_.pull
    interface LoDashStatic {
        /**
        * Removes all provided values from the given array using strict equality for comparisons, 
        * i.e. ===.
        * @param array The array to modify.
        * @param values The values to remove.
        * @return array.
        **/
        pull(
            array: Array<any>,
            ...values: any[]): any[];

        /**
        * @see _.pull
        **/
        pull(
            array: List<any>,
            ...values: any[]): any[];
    }

    //_.range
    interface LoDashStatic {
        /**
        * Creates an array of numbers (positive and/or negative) progressing from start up 
        * to but not including end. If start is less than stop a zero-length range is created 
        * unless a negative step is specified.
        * @param start The start of the range.
        * @param end The end of the range.
        * @param step The value to increment or decrement by.
        * @return Returns a new range array.
        **/
        range(
            start: number,
            stop: number,
            step?: number): number[];

        /**
        * @see _.range
        * @param end The end of the range.
        * @return Returns a new range array.
        * @note If start is not specified the implementation will never pull the step (step = arguments[2] || 0)
        **/
        range(stop: number): number[];
    }

    //_.remove
    interface LoDashStatic {
        /**
        * Removes all elements from an array that the callback returns truey for and returns 
        * an array of removed elements. The callback is bound to thisArg and invoked with three 
        * arguments; (value, index, array).
        *
        * If a property name is provided for callback the created "_.pluck" style callback will 
        * return the property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will return 
        * true for elements that have the properties of the given object, else false.
        * @param array The array to modify.
        * @param callback The function called per iteration.
        * @param thisArg The this binding of callback.
        * @return A new array of removed elements.
        **/
        remove(
            array: Array<any>,
            callback?: ListIterator<any, boolean>,
            thisArg?: any): any[];

        /**
        * @see _.remove
        **/
        remove(
            array: List<any>,
            callback?: ListIterator<any, boolean>,
            thisArg?: any): any[];

        /**
        * @see _.remove
        * @param pluckValue _.pluck style callback
        **/
        remove(
            array: Array<any>,
            pluckValue?: string): any[];

        /**
        * @see _.remove
        * @param pluckValue _.pluck style callback
        **/
        remove(
            array: List<any>,
            pluckValue?: string): any[];

        /**
        * @see _.remove
        * @param whereValue _.where style callback
        **/
        remove(
            array: Array<any>,
            wherealue?: Dictionary<any>): any[];

        /**
        * @see _.remove
        * @param whereValue _.where style callback
        **/
        remove(
            array: List<any>,
            wherealue?: Dictionary<any>): any[];
    }

    //_.rest
    interface LoDashStatic {
        /**
        * The opposite of _.initial this method gets all but the first element or first n elements of 
        * an array. If a callback function is provided elements at the beginning of the array are excluded 
        * from the result as long as the callback returns truey. The callback is bound to thisArg and 
        * invoked with three arguments; (value, index, array).
        *
        * If a property name is provided for callback the created "_.pluck" style callback will return 
        * the property value of the given element.
        * 
        * If an object is provided for callback the created "_.where" style callback will return true 
        * for elements that have the properties of the given object, else false.
        * @param array The array to query.
        * @param {(Function|Object|number|string)} [callback=1] The function called per element or the number 
        * of elements to exclude. If a property name or object is provided it will be used to create a 
        * ".pluck" or ".where" style callback, respectively.
        * @param {*} [thisArg] The this binding of callback.
        * @return Returns a slice of array.
        **/
        rest<T>(array: Array<T>): T[];

        /**
        * @see _.rest
        **/
        rest<T>(array: List<T>): T[];

        /**
        * @see _.rest
        **/
        rest<T>(
            array: Array<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.rest
        **/
        rest<T>(
            array: List<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.rest
        **/
        rest<T>(
            array: Array<T>,
            n: number): T[];

        /**
        * @see _.rest
        **/
        rest<T>(
            array: List<T>,
            n: number): T[];

        /**
        * @see _.rest
        **/
        rest<T>(
            array: Array<T>,
            pluckValue: string): T[];

        /**
        * @see _.rest
        **/
        rest<T>(
            array: List<T>,
            pluckValue: string): T[];

        /**
        * @see _.rest
        **/
        rest<W, T>(
            array: Array<T>,
            whereValue: W): T[];

        /**
        * @see _.rest
        **/
        rest<W, T>(
            array: List<T>,
            whereValue: W): T[];

        /**
        * @see _.rest
        **/
        drop<T>(array: Array<T>): T[];

        /**
        * @see _.rest
        **/
        drop<T>(array: List<T>): T[];

        /**
        * @see _.rest
        **/
        drop<T>(
            array: Array<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.rest
        **/
        drop<T>(
            array: List<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.rest
        **/
        drop<T>(
            array: Array<T>,
            n: number): T[];

        /**
        * @see _.rest
        **/
        drop<T>(
            array: List<T>,
            n: number): T[];

        /**
        * @see _.rest
        **/
        drop<T>(
            array: Array<T>,
            pluckValue: string): T[];

        /**
        * @see _.rest
        **/
        drop<T>(
            array: List<T>,
            pluckValue: string): T[];

        /**
        * @see _.rest
        **/
        drop<W, T>(
            array: Array<T>,
            whereValue: W): T[];

        /**
        * @see _.rest
        **/
        drop<W, T>(
            array: List<T>,
            whereValue: W): T[];

        /**
        * @see _.rest
        **/
        tail<T>(array: Array<T>): T[];

        /**
        * @see _.rest
        **/
        tail<T>(array: List<T>): T[];

        /**
        * @see _.rest
        **/
        tail<T>(
            array: Array<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.rest
        **/
        tail<T>(
            array: List<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.rest
        **/
        tail<T>(
            array: Array<T>,
            n: number): T[];

        /**
        * @see _.rest
        **/
        tail<T>(
            array: List<T>,
            n: number): T[];

        /**
        * @see _.rest
        **/
        tail<T>(
            array: Array<T>,
            pluckValue: string): T[];

        /**
        * @see _.rest
        **/
        tail<T>(
            array: List<T>,
            pluckValue: string): T[];

        /**
        * @see _.rest
        **/
        tail<W, T>(
            array: Array<T>,
            whereValue: W): T[];

        /**
        * @see _.rest
        **/
        tail<W, T>(
            array: List<T>,
            whereValue: W): T[];
    }

    //_.sortedIndex
    interface LoDashStatic {
        /**
        * Uses a binary search to determine the smallest index at which a value should be inserted 
        * into a given sorted array in order to maintain the sort order of the array. If a callback 
        * is provided it will be executed for value and each element of array to compute their sort 
        * ranking. The callback is bound to thisArg and invoked with one argument; (value).
        *
        * If a property name is provided for callback the created "_.pluck" style callback will 
        * return the property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will return 
        * true for elements that have the properties of the given object, else false.
        * @param array The sorted list.
        * @param value The value to determine its index within `list`.
        * @param callback Iterator to compute the sort ranking of each value, optional.
        * @return The index at which value should be inserted into array.
        **/
        sortedIndex<T, TSort>(
            array: Array<T>,
            value: T,
            callback?: (x: T) => TSort,
            thisArg?: any): number;

        /**
        * @see _.sortedIndex
        **/
        sortedIndex<T, TSort>(
            array: List<T>,
            value: T,
            callback?: (x: T) => TSort,
            thisArg?: any): number;

        /**
        * @see _.sortedIndex
        * @param pluckValue the _.pluck style callback
        **/
        sortedIndex<T>(
            array: Array<T>,
            value: T,
            pluckValue: string): number;

        /**
        * @see _.sortedIndex
        * @param pluckValue the _.pluck style callback
        **/
        sortedIndex<T>(
            array: List<T>,
            value: T,
            pluckValue: string): number;

        /**
        * @see _.sortedIndex
        * @param pluckValue the _.where style callback
        **/
        sortedIndex<W, T>(
            array: Array<T>,
            value: T,
            whereValue: W): number;

        /**
        * @see _.sortedIndex
        * @param pluckValue the _.where style callback
        **/
        sortedIndex<W, T>(
            array: List<T>,
            value: T,
            whereValue: W): number;
    }

    //_.union
    interface LoDashStatic {
        /**
        * Creates an array of unique values, in order, of the provided arrays using strict 
        * equality for comparisons, i.e. ===.
        * @param arrays The arrays to inspect.
        * @return Returns an array of composite values.
        **/
        union<T>(...arrays: Array<T>[]): T[];

        /**
        * @see _.union
        **/
        union<T>(...arrays: List<T>[]): T[];
    }

    //_.uniq
    interface LoDashStatic {
        /**
        * Creates a duplicate-value-free version of an array using strict equality for comparisons, 
        * i.e. ===. If the array is sorted, providing true for isSorted will use a faster algorithm. 
        * If a callback is provided each element of array is passed through the callback before 
        * uniqueness is computed. The callback is bound to thisArg and invoked with three arguments; 
        * (value, index, array).
        *
        * If a property name is provided for callback the created "_.pluck" style callback will 
        * return the property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will return 
        * true for elements that have the properties of the given object, else false.
        * @param array Array to remove duplicates from.
        * @param isSorted True if `array` is already sorted, optiona, default = false.
        * @param iterator Transform the elements of `array` before comparisons for uniqueness.
        * @param context 'this' object in `iterator`, optional.
        * @return Copy of `array` where all elements are unique.
        **/
        uniq<T, TSort>(array: Array<T>, isSorted?: boolean): T[];

        /**
        * @see _.uniq
        **/
        uniq<T, TSort>(array: List<T>, isSorted?: boolean): T[];

        /**
        * @see _.uniq
        **/
        uniq<T, TSort>(
            array: Array<T>,
            isSorted: boolean,
            callback: ListIterator<T, TSort>,
            thisArg?: any): T[];

        /**
        * @see _.uniq
        **/
        uniq<T, TSort>(
            array: List<T>,
            isSorted: boolean,
            callback: ListIterator<T, TSort>,
            thisArg?: any): T[];

        /**
        * @see _.uniq
        **/
        uniq<T, TSort>(
            array: Array<T>,
            callback: ListIterator<T, TSort>,
            thisArg?: any): T[];

        /**
        * @see _.uniq
        **/
        uniq<T, TSort>(
            array: List<T>,
            callback: ListIterator<T, TSort>,
            thisArg?: any): T[];

        /**
        * @see _.uniq
        * @param pluckValue _.pluck style callback
        **/
        uniq<T>(
            array: Array<T>,
            isSorted: boolean,
            pluckValue: string): T[];

        /**
        * @see _.uniq
        * @param pluckValue _.pluck style callback
        **/
        uniq<T>(
            array: List<T>,
            isSorted: boolean,
            pluckValue: string): T[];

        /**
        * @see _.uniq
        * @param pluckValue _.pluck style callback
        **/
        uniq<T>(
            array: Array<T>,
            pluckValue: string): T[];

        /**
        * @see _.uniq
        * @param pluckValue _.pluck style callback
        **/
        uniq<T>(
            array: List<T>,
            pluckValue: string): T[];

        /**
        * @see _.uniq
        * @param whereValue _.where style callback
        **/
        uniq<W, T>(
            array: Array<T>,
            isSorted: boolean,
            whereValue: W): T[];

        /**
        * @see _.uniq
        * @param whereValue _.where style callback
        **/
        uniq<W, T>(
            array: List<T>,
            isSorted: boolean,
            whereValue: W): T[];

        /**
        * @see _.uniq
        * @param whereValue _.where style callback
        **/
        uniq<W, T>(
            array: Array<T>,
            whereValue: W): T[];

        /**
        * @see _.uniq
        * @param whereValue _.where style callback
        **/
        uniq<W, T>(
            array: List<T>,
            whereValue: W): T[];

        /**
        * @see _.uniq
        **/
        unique<T>(array: Array<T>, isSorted?: boolean): T[];

        /**
        * @see _.uniq
        **/
        unique<T>(array: List<T>, isSorted?: boolean): T[];

        /**
        * @see _.uniq
        **/
        unique<T, TSort>(
            array: Array<T>,
            callback: ListIterator<T, TSort>,
            thisArg?: any): T[];

        /**
        * @see _.uniq
        **/
        unique<T, TSort>(
            array: List<T>,
            callback: ListIterator<T, TSort>,
            thisArg?: any): T[];

        /**
        * @see _.uniq
        **/
        unique<T, TSort>(
            array: Array<T>,
            isSorted: boolean,
            callback: ListIterator<T, TSort>,
            thisArg?: any): T[];

        /**
        * @see _.uniq
        **/
        unique<T, TSort>(
            array: List<T>,
            isSorted: boolean,
            callback: ListIterator<T, TSort>,
            thisArg?: any): T[];

        /**
        * @see _.uniq
        * @param pluckValue _.pluck style callback
        **/
        unique<T>(
            array: Array<T>,
            isSorted: boolean,
            pluckValue: string): T[];

        /**
        * @see _.uniq
        * @param pluckValue _.pluck style callback
        **/
        unique<T>(
            array: List<T>,
            isSorted: boolean,
            pluckValue: string): T[];

        /**
        * @see _.uniq
        * @param pluckValue _.pluck style callback
        **/
        unique<T>(
            array: Array<T>,
            pluckValue: string): T[];

        /**
        * @see _.uniq
        * @param pluckValue _.pluck style callback
        **/
        unique<T>(
            array: List<T>,
            pluckValue: string): T[];

        /**
        * @see _.uniq
        * @param whereValue _.where style callback
        **/
        unique<W, T>(
            array: Array<T>,
            whereValue?: W): T[];

        /**
        * @see _.uniq
        * @param whereValue _.where style callback
        **/
        unique<W, T>(
            array: List<T>,
            whereValue?: W): T[];

        /**
        * @see _.uniq
        * @param whereValue _.where style callback
        **/
        unique<W, T>(
            array: Array<T>,
            isSorted: boolean,
            whereValue?: W): T[];

        /**
        * @see _.uniq
        * @param whereValue _.where style callback
        **/
        unique<W, T>(
            array: List<T>,
            isSorted: boolean,
            whereValue?: W): T[];
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.uniq
        **/
        uniq<TSort>(isSorted?: boolean): LoDashArrayWrapper<T>;

        /**
        * @see _.uniq
        **/
        uniq<TSort>(
            isSorted: boolean,
            callback: ListIterator<T, TSort>,
            thisArg?: any): LoDashArrayWrapper<T>;

        /**
        * @see _.uniq
        **/
        uniq<TSort>(
            callback: ListIterator<T, TSort>,
            thisArg?: any): LoDashArrayWrapper<T>;

        /**
        * @see _.uniq
        * @param pluckValue _.pluck style callback
        **/
        uniq(
            isSorted: boolean,
            pluckValue: string): LoDashArrayWrapper<T>;

        /**
        * @see _.uniq
        * @param pluckValue _.pluck style callback
        **/
        uniq(pluckValue: string): LoDashArrayWrapper<T>;

        /**
        * @see _.uniq
        * @param whereValue _.where style callback
        **/
        uniq<W>(
            isSorted: boolean,
            whereValue: W): LoDashArrayWrapper<T>;

        /**
        * @see _.uniq
        * @param whereValue _.where style callback
        **/
        uniq<W>(
            whereValue: W): LoDashArrayWrapper<T>;

        /**
        * @see _.uniq
        **/
        unique<TSort>(isSorted?: boolean): LoDashArrayWrapper<T>;

        /**
        * @see _.uniq
        **/
        unique<TSort>(
            isSorted: boolean,
            callback: ListIterator<T, TSort>,
            thisArg?: any): LoDashArrayWrapper<T>;

        /**
        * @see _.uniq
        **/
        unique<TSort>(
            callback: ListIterator<T, TSort>,
            thisArg?: any): LoDashArrayWrapper<T>;

        /**
        * @see _.uniq
        * @param pluckValue _.pluck style callback
        **/
        unique(
            isSorted: boolean,
            pluckValue: string): LoDashArrayWrapper<T>;

        /**
        * @see _.uniq
        * @param pluckValue _.pluck style callback
        **/
        unique(pluckValue: string): LoDashArrayWrapper<T>;

        /**
        * @see _.uniq
        * @param whereValue _.where style callback
        **/
        unique<W>(
            isSorted: boolean,
            whereValue: W): LoDashArrayWrapper<T>;

        /**
        * @see _.uniq
        * @param whereValue _.where style callback
        **/
        unique<W>(
            whereValue: W): LoDashArrayWrapper<T>;        
    }

    //_.without
    interface LoDashStatic {
        /**
        * Creates an array excluding all provided values using strict equality for comparisons, i.e. ===.
        * @param array The array to filter.
        * @param values The value(s) to exclude.
        * @return A new array of filtered values.
        **/
        without<T>(
            array: Array<T>,
            ...values: T[]): T[];

        /**
        * @see _.without
        **/
        without<T>(
            array: List<T>,
            ...values: T[]): T[];
    }

    //_.xor
    interface LoDashStatic {
        /**
        * Creates an array that is the symmetric difference of the provided arrays.
        * @param array The array to process
        * @param others The arrays of values to calculate the symmetric difference.
        * @return Returns a new array of filtered values.
        **/
        xor<T>(
            array: Array<T>,
            ...others: Array<T>[]): T[];
        /**
        * @see _.xor
        **/
        xor<T>(
            array: List<T>,
            ...others: List<T>[]): T[];
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.xor
        **/
        xor(
            ...others: Array<T>[]): LoDashArrayWrapper<T>;
        /**
        * @see _.xor
        **/
        xor(
            ...others: List<T>[]): LoDashArrayWrapper<T>;
    }
    
    //_.zip
    interface LoDashStatic {
        /**
        * Creates an array of grouped elements, the first of which contains the first 
        * elements of the given arrays, the second of which contains the second elements 
        * of the given arrays, and so on.
        * @param arrays Arrays to process.
        * @return A new array of grouped elements.
        **/
        zip(...arrays: any[][]): any[][];

        /**
        * @see _.zip
        **/
        zip(...arrays: any[]): any[];

        /**
        * @see _.zip
        **/
        unzip(...arrays: any[][]): any[][];

        /**
        * @see _.zip
        **/
        unzip(...arrays: any[]): any[];
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.zip
        **/
        zip(...arrays: any[][]): _.LoDashArrayWrapper<any[][]>;

        /**
        * @see _.zip
        **/
        unzip(...arrays: any[]): _.LoDashArrayWrapper<any[][]>;
    }

    //_.zipObject
    interface LoDashStatic {
        /**
        * Creates an object composed from arrays of keys and values. Provide either a single 
        * two dimensional array, i.e. [[key1, value1], [key2, value2]] or two arrays, one of 
        * keys and one of corresponding values.
        * @param keys The array of keys.
        * @param values The array of values.
        * @return An object composed of the given keys and corresponding values.
        **/
        zipObject<TResult extends {}>(
            keys: List<string>,
            values: List<any>): TResult;

        /**
        * @see _.object
        **/
        object<TResult extends {}>(
            keys: List<string>,
            values: List<any>): TResult;
    }

    /* *************
     * Collections *
     ************* */

    //_.at
    interface LoDashStatic {
        /**
        * Creates an array of elements from the specified indexes, or keys, of the collection. 
        * Indexes may be specified as individual arguments or as arrays of indexes.
        * @param collection The collection to iterate over.
        * @param indexes The indexes of collection to retrieve, specified as individual indexes or 
        * arrays of indexes.
        * @return A new array of elements corresponding to the provided indexes.
        **/
        at<T>(
            collection: Array<T>,
            indexes: number[]): T[];

        /**
        * @see _.at
        **/
        at<T>(
            collection: List<T>,
            indexes: number[]): T[];

        /**
        * @see _.at
        **/
        at<T>(
            collection: Dictionary<T>,
            indexes: number[]): T[];

        /**
        * @see _.at
        **/
        at<T>(
            collection: Array<T>,
            ...indexes: number[]): T[];

        /**
        * @see _.at
        **/
        at<T>(
            collection: List<T>,
            ...indexes: number[]): T[];

        /**
        * @see _.at
        **/
        at<T>(
            collection: Dictionary<T>,
            ...indexes: number[]): T[];
    }

    //_.contains
    interface LoDashStatic {
        /**
        * Checks if a given value is present in a collection using strict equality for comparisons, 
        * i.e. ===. If fromIndex is negative, it is used as the offset from the end of the collection.
        * @param collection The collection to iterate over.
        * @param target The value to check for.
        * @param fromIndex The index to search from.
        * @return True if the target element is found, else false.
        **/
        contains<T>(
            collection: Array<T>,
            target: T,
            fromIndex?: number): boolean;

        /**
        * @see _.contains
        **/
        contains<T>(
            collection: List<T>,
            target: T,
            fromIndex?: number): boolean;

        /**
        * @see _.contains
        * @param dictionary The dictionary to iterate over.
        * @param key The key in the dictionary to search for.
        **/
        contains<T>(
            dictionary: Dictionary<T>,
            key: string,
            fromIndex?: number): boolean;

        /**
        * @see _.contains
        * @param searchString the string to search
        * @param targetString the string to search for
        **/
        contains(
            searchString: string,
            targetString: string,
            fromIndex?: number): boolean;

        /**
        * @see _.contains
        **/
        include<T>(
            collection: Array<T>,
            target: T,
            fromIndex?: number): boolean;

        /**
        * @see _.contains
        **/
        include<T>(
            collection: List<T>,
            target: T,
            fromIndex?: number): boolean;

        /**
        * @see _.contains
        **/
        include<T>(
            dictionary: Dictionary<T>,
            key: string,
            fromIndex?: number): boolean;

        /**
        * @see _.contains
        **/
        include(
            searchString: string,
            targetString: string,
            fromIndex?: number): boolean;
    }

    //_.countBy
    interface LoDashStatic {
        /**
        * Creates an object composed of keys generated from the results of running each element 
        * of collection through the callback. The corresponding value of each key is the number 
        * of times the key was returned by the callback. The callback is bound to thisArg and 
        * invoked with three arguments; (value, index|key, collection).
        *
        * If a property name is provided for callback the created "_.pluck" style callback will 
        * return the property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will return 
        * true for elements that have the properties of the given object, else false.
        * @param collection The collection to iterate over.
        * @param callback The function called per iteration.
        * @param thisArg The this binding of callback.
        * @return Returns the composed aggregate object.
        **/
        countBy<T>(
            collection: Array<T>,
            callback?: ListIterator<T, any>,
            thisArg?: any): Dictionary<number>;

        /**
        * @see _.countBy
        * @param callback Function name
        **/
        countBy<T>(
            collection: List<T>,
            callback?: ListIterator<T, any>,
            thisArg?: any): Dictionary<number>;

        /**
        * @see _.countBy
        * @param callback Function name
        **/
        countBy<T>(
            collection: Dictionary<T>,
            callback?: ListIterator<T, any>,
            thisArg?: any): Dictionary<number>;

        /**
        * @see _.countBy
        * @param callback Function name
        **/
        countBy<T>(
            collection: Array<T>,
            callback: string,
            thisArg?: any): Dictionary<number>;

        /**
        * @see _.countBy
        * @param callback Function name
        **/
        countBy<T>(
            collection: List<T>,
            callback: string,
            thisArg?: any): Dictionary<number>;

        /**
        * @see _.countBy
        * @param callback Function name
        **/
        countBy<T>(
            collection: Dictionary<T>,
            callback: string,
            thisArg?: any): Dictionary<number>;
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.countBy
        **/
        countBy(
            callback?: ListIterator<T, any>,
            thisArg?: any): LoDashObjectWrapper<Dictionary<number>>;

        /**
        * @see _.countBy
        * @param callback Function name
        **/
        countBy(
            callback: string,
            thisArg?: any): LoDashObjectWrapper<Dictionary<number>>;
    }

    //_.every
    interface LoDashStatic {
        /**
        * Checks if the given callback returns truey value for all elements of a collection. 
        * The callback is bound to thisArg and invoked with three arguments; (value, index|key, 
        * collection).
        *
        * If a property name is provided for callback the created "_.pluck" style callback will 
        * return the property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will return 
        * true for elements that have the properties of the given object, else false.
        * @param collection The collection to iterate over.
        * @param callback The function called per iteration.
        * @param thisArg The this binding of callback.
        * @return True if all elements passed the callback check, else false.
        **/
        every<T>(
            collection: Array<T>,
            callback?: ListIterator<T, boolean>,
            thisArg?: any): boolean;

        /**
        * @see _.every
        * @param pluckValue _.pluck style callback
        **/
        every<T>(
            collection: List<T>,
            callback?: ListIterator<T, boolean>,
            thisArg?: any): boolean;

        /**
        * @see _.every
        * @param pluckValue _.pluck style callback
        **/
        every<T>(
            collection: Dictionary<T>,
            callback?: ListIterator<T, boolean>,
            thisArg?: any): boolean;

        /**
        * @see _.every
        * @param pluckValue _.pluck style callback
        **/
        every<T>(
            collection: Array<T>,
            pluckValue: string): boolean;

        /**
        * @see _.every
        * @param pluckValue _.pluck style callback
        **/
        every<T>(
            collection: List<T>,
            pluckValue: string): boolean;

        /**
        * @see _.every
        * @param pluckValue _.pluck style callback
        **/
        every<T>(
            collection: Dictionary<T>,
            pluckValue: string): boolean;

        /**
        * @see _.every
        * @param whereValue _.where style callback
        **/
        every<W, T>(
            collection: Array<T>,
            whereValue: W): boolean;

        /**
        * @see _.every
        * @param whereValue _.where style callback
        **/
        every<W, T>(
            collection: List<T>,
            whereValue: W): boolean;

        /**
        * @see _.every
        * @param whereValue _.where style callback
        **/
        every<W, T>(
            collection: Dictionary<T>,
            whereValue: W): boolean;

        /**
        * @see _.every
        **/
        all<T>(
            collection: Array<T>,
            callback?: ListIterator<T, boolean>,
            thisArg?: any): boolean;

        /**
        * @see _.every
        **/
        all<T>(
            collection: List<T>,
            callback?: ListIterator<T, boolean>,
            thisArg?: any): boolean;

        /**
        * @see _.every
        **/
        all<T>(
            collection: Dictionary<T>,
            callback?: ListIterator<T, boolean>,
            thisArg?: any): boolean;

        /**
        * @see _.every
        * @param pluckValue _.pluck style callback
        **/
        all<T>(
            collection: Array<T>,
            pluckValue: string): boolean;

        /**
        * @see _.every
        * @param pluckValue _.pluck style callback
        **/
        all<T>(
            collection: List<T>,
            pluckValue: string): boolean;

        /**
        * @see _.every
        * @param pluckValue _.pluck style callback
        **/
        all<T>(
            collection: Dictionary<T>,
            pluckValue: string): boolean;

        /**
        * @see _.every
        * @param whereValue _.where style callback
        **/
        all<W, T>(
            collection: Array<T>,
            whereValue: W): boolean;

        /**
        * @see _.every
        * @param whereValue _.where style callback
        **/
        all<W, T>(
            collection: List<T>,
            whereValue: W): boolean;

        /**
        * @see _.every
        * @param whereValue _.where style callback
        **/
        all<W, T>(
            collection: Dictionary<T>,
            whereValue: W): boolean;
    }

    //_.filter
    interface LoDashStatic {
        /**
        * Iterates over elements of a collection, returning an array of all elements the 
        * callback returns truey for. The callback is bound to thisArg and invoked with three 
        * arguments; (value, index|key, collection).
        *
        * If a property name is provided for callback the created "_.pluck" style callback will 
        * return the property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will return 
        * true for elements that have the properties of the given object, else false.
        * @param collection The collection to iterate over.
        * @param callback The function called per iteration.
        * @param context The this binding of callback.
        * @return Returns a new array of elements that passed the callback check.
        **/
        filter<T>(
            collection: Array<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.filter
        **/
        filter<T>(
            collection: List<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.filter
        **/
        filter<T>(
            collection: Dictionary<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.filter
        * @param pluckValue _.pluck style callback
        **/
        filter<T>(
            collection: Array<T>,
            pluckValue: string): T[];

        /**
        * @see _.filter
        * @param pluckValue _.pluck style callback
        **/
        filter<T>(
            collection: List<T>,
            pluckValue: string): T[];

        /**
        * @see _.filter
        * @param pluckValue _.pluck style callback
        **/
        filter<T>(
            collection: Dictionary<T>,
            pluckValue: string): T[];

        /**
        * @see _.filter
        * @param pluckValue _.pluck style callback
        **/
        filter<W, T>(
            collection: Array<T>,
            whereValue: W): T[];

        /**
        * @see _.filter
        * @param pluckValue _.pluck style callback
        **/
        filter<W, T>(
            collection: List<T>,
            whereValue: W): T[];

        /**
        * @see _.filter
        * @param pluckValue _.pluck style callback
        **/
        filter<W, T>(
            collection: Dictionary<T>,
            whereValue: W): T[];

        /**
        * @see _.filter
        **/
        select<T>(
            collection: Array<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.filter
        **/
        select<T>(
            collection: List<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.filter
        **/
        select<T>(
            collection: Dictionary<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.filter
        * @param pluckValue _.pluck style callback
        **/
        select<T>(
            collection: Array<T>,
            pluckValue: string): T[];

        /**
        * @see _.filter
        * @param pluckValue _.pluck style callback
        **/
        select<T>(
            collection: List<T>,
            pluckValue: string): T[];

        /**
        * @see _.filter
        * @param pluckValue _.pluck style callback
        **/
        select<T>(
            collection: Dictionary<T>,
            pluckValue: string): T[];

        /**
        * @see _.filter
        * @param pluckValue _.pluck style callback
        **/
        select<W, T>(
            collection: Array<T>,
            whereValue: W): T[];

        /**
        * @see _.filter
        * @param pluckValue _.pluck style callback
        **/
        select<W, T>(
            collection: List<T>,
            whereValue: W): T[];

        /**
        * @see _.filter
        * @param pluckValue _.pluck style callback
        **/
        select<W, T>(
            collection: Dictionary<T>,
            whereValue: W): T[];
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.filter
        **/
        filter(
            callback: ListIterator<T, boolean>,
            thisArg?: any): LoDashArrayWrapper<T>;

        /**
        * @see _.filter
        * @param pluckValue _.pluck style callback
        **/
        filter(
            pluckValue: string): LoDashArrayWrapper<T>;

        /**
        * @see _.filter
        * @param pluckValue _.pluck style callback
        **/
        filter<W>(
            whereValue: W): LoDashArrayWrapper<T>;

        /**
        * @see _.filter
        **/
        select(
            callback: ListIterator<T, boolean>,
            thisArg?: any): LoDashArrayWrapper<T>;

        /**
        * @see _.filter
        * @param pluckValue _.pluck style callback
        **/
        select(
            pluckValue: string): LoDashArrayWrapper<T>;

        /**
        * @see _.filter
        * @param pluckValue _.pluck style callback
        **/
        select<W>(
            whereValue: W): LoDashArrayWrapper<T>;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.filter
        **/
        filter<T extends {}>(
            callback: ObjectIterator<T, boolean>,
            thisArg?: any): LoDashObjectWrapper<T>;
    }

    //_.find
    interface LoDashStatic {
        /**
        * Iterates over elements of a collection, returning the first element that the callback 
        * returns truey for. The callback is bound to thisArg and invoked with three arguments; 
        * (value, index|key, collection).
        *
        * If a property name is provided for callback the created "_.pluck" style callback will 
        * return the property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will return 
        * true for elements that have the properties of the given object, else false.
        * @param collection Searches for a value in this list.
        * @param callback The function called per iteration. 
        * @param thisArg The this binding of callback.
        * @return The found element, else undefined.
        **/
        find<T>(
            collection: Array<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T;

        /**
        * @see _.find
        **/
        find<T>(
            collection: List<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T;

        /**
        * @see _.find
        **/
        find<T>(
            collection: Dictionary<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T;

        /**
        * @see _.find
        * @param _.pluck style callback
        **/
        find<W, T>(
            collection: Array<T>,
            whereValue: W): T;

        /**
        * @see _.find
        * @param _.pluck style callback
        **/
        find<W, T>(
            collection: List<T>,
            whereValue: W): T;

        /**
        * @see _.find
        * @param _.pluck style callback
        **/
        find<W, T>(
            collection: Dictionary<T>,
            whereValue: W): T;

        /**
        * @see _.find
        * @param _.where style callback
        **/
        find<T>(
            collection: Array<T>,
            pluckValue: string): T;

        /**
        * @see _.find
        * @param _.where style callback
        **/
        find<T>(
            collection: List<T>,
            pluckValue: string): T;

        /**
        * @see _.find
        * @param _.where style callback
        **/
        find<T>(
            collection: Dictionary<T>,
            pluckValue: string): T;

        /**
        * @see _.find
        **/
        detect<T>(
            collection: Array<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T;

        /**
        * @see _.find
        **/
        detect<T>(
            collection: List<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T;

        /**
        * @see _.find
        **/
        detect<T>(
            collection: Dictionary<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T;

        /**
        * @see _.find
        * @param _.pluck style callback
        **/
        detect<W, T>(
            collection: Array<T>,
            whereValue: W): T;

        /**
        * @see _.find
        * @param _.pluck style callback
        **/
        detect<W, T>(
            collection: List<T>,
            whereValue: W): T;

        /**
        * @see _.find
        * @param _.pluck style callback
        **/
        detect<W, T>(
            collection: Dictionary<T>,
            whereValue: W): T;

        /**
        * @see _.find
        * @param _.where style callback
        **/
        detect<T>(
            collection: Array<T>,
            pluckValue: string): T;

        /**
        * @see _.find
        * @param _.where style callback
        **/
        detect<T>(
            collection: List<T>,
            pluckValue: string): T;

        /**
        * @see _.find
        * @param _.where style callback
        **/
        detect<T>(
            collection: Dictionary<T>,
            pluckValue: string): T;

        /**
        * @see _.find
        **/
        findWhere<T>(
            collection: Array<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T;

        /**
        * @see _.find
        **/
        findWhere<T>(
            collection: List<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T;

        /**
        * @see _.find
        **/
        findWhere<T>(
            collection: Dictionary<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T;

        /**
        * @see _.find
        * @param _.pluck style callback
        **/
        findWhere<W, T>(
            collection: Array<T>,
            whereValue: W): T;

        /**
        * @see _.find
        * @param _.pluck style callback
        **/
        findWhere<W, T>(
            collection: List<T>,
            whereValue: W): T;

        /**
        * @see _.find
        * @param _.pluck style callback
        **/
        findWhere<W, T>(
            collection: Dictionary<T>,
            whereValue: W): T;

        /**
        * @see _.find
        * @param _.where style callback
        **/
        findWhere<T>(
            collection: Array<T>,
            pluckValue: string): T;

        /**
        * @see _.find
        * @param _.where style callback
        **/
        findWhere<T>(
            collection: List<T>,
            pluckValue: string): T;

        /**
        * @see _.find
        * @param _.where style callback
        **/
        findWhere<T>(
            collection: Dictionary<T>,
            pluckValue: string): T;
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.find
        */
        find(
            callback: ListIterator<T, boolean>,
            thisArg?: any): T;
        /**
        * @see _.find
        * @param _.where style callback
        */
        find<W>(
            whereValue: W): T;

        /**
        * @see _.find
        * @param _.where style callback
        */
        find(
            pluckValue: string): T;
    }

    //_.findLast
    interface LoDashStatic {
        /**
        * This method is like _.find except that it iterates over elements of a collection from 
        * right to left.
        * @param collection Searches for a value in this list.
        * @param callback The function called per iteration. 
        * @param thisArg The this binding of callback.
        * @return The found element, else undefined.
        **/
        findLast<T>(
            collection: Array<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T;

        /**
        * @see _.find
        **/
        findLast<T>(
            collection: List<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T;

        /**
        * @see _.find
        **/
        findLast<T>(
            collection: Dictionary<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T;

        /**
        * @see _.find
        * @param _.pluck style callback
        **/
        findLast<W, T>(
            collection: Array<T>,
            whereValue: W): T;

        /**
        * @see _.find
        * @param _.pluck style callback
        **/
        findLast<W, T>(
            collection: List<T>,
            whereValue: W): T;

        /**
        * @see _.find
        * @param _.pluck style callback
        **/
        findLast<W, T>(
            collection: Dictionary<T>,
            whereValue: W): T;

        /**
        * @see _.find
        * @param _.where style callback
        **/
        findLast<T>(
            collection: Array<T>,
            pluckValue: string): T;

        /**
        * @see _.find
        * @param _.where style callback
        **/
        findLast<T>(
            collection: List<T>,
            pluckValue: string): T;

        /**
        * @see _.find
        * @param _.where style callback
        **/
        findLast<T>(
            collection: Dictionary<T>,
            pluckValue: string): T;
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.findLast
        */
        findLast(
            callback: ListIterator<T, boolean>,
            thisArg?: any): T;
        /**
        * @see _.findLast
        * @param _.where style callback
        */
        findLast<W>(
            whereValue: W): T;

        /**
        * @see _.findLast
        * @param _.where style callback
        */
        findLast(
            pluckValue: string): T;
    }

    //_.groupBy
    interface LoDashStatic {
        /**
        * Creates an object composed of keys generated from the results of running each element 
        * of a collection through the callback. The corresponding value of each key is an array 
        * of the elements responsible for generating the key. The callback is bound to thisArg 
        * and invoked with three arguments; (value, index|key, collection).
        *
        * If a property name is provided for callback the created "_.pluck" style callback will 
        * return the property value of the given element.
        * If an object is provided for callback the created "_.where" style callback will return 
        * true for elements that have the properties of the given object, else false
        * @param collection The collection to iterate over.
        * @param callback The function called per iteration.
        * @param thisArg The this binding of callback.
        * @return Returns the composed aggregate object.
        **/
        groupBy<T>(
            collection: Array<T>,
            callback?: ListIterator<T, any>,
            thisArg?: any): Dictionary<T[]>;

        /**
        * @see _.groupBy
        **/
        groupBy<T>(
            collection: List<T>,
            callback?: ListIterator<T, any>,
            thisArg?: any): Dictionary<T[]>;

        /**
        * @see _.groupBy
        * @param pluckValue _.pluck style callback
        **/
        groupBy<T>(
            collection: Array<T>,
            pluckValue: string): Dictionary<T[]>;

        /**
        * @see _.groupBy
        * @param pluckValue _.pluck style callback
        **/
        groupBy<T>(
            collection: List<T>,
            pluckValue: string): Dictionary<T[]>;

        /**
        * @see _.groupBy
        * @param whereValue _.where style callback
        **/
        groupBy<W, T>(
            collection: Array<T>,
            whereValue: W): Dictionary<T[]>;

        /**
        * @see _.groupBy
        * @param whereValue _.where style callback
        **/
        groupBy<W, T>(
            collection: List<T>,
            whereValue: W): Dictionary<T[]>;

        /**
        * @see _.groupBy
        **/
        groupBy<T>(
            collection: Dictionary<T>,
            callback?: ListIterator<T, any>,
            thisArg?: any): Dictionary<T[]>;

        /**
        * @see _.groupBy
        * @param pluckValue _.pluck style callback
        **/
        groupBy<TValue>(
            collection: Dictionary<TValue>,
            pluckValue: string): Dictionary<TValue[]>;

        /**
        * @see _.groupBy
        * @param whereValue _.where style callback
        **/
        groupBy<W, TValue>(
            collection: Dictionary<TValue>,
            whereValue: W): Dictionary<TValue[]>;
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.groupBy
        **/
        groupBy(
            callback: ListIterator<T, any>,
            thisArg?: any): _.LoDashObjectWrapper<_.Dictionary<T[]>>;

        /**
        * @see _.groupBy
        **/
        groupBy(
            pluckValue: string): _.LoDashObjectWrapper<_.Dictionary<T[]>>;

        /**
        * @see _.groupBy
        **/
        groupBy<W>(
            whereValue: W): _.LoDashObjectWrapper<_.Dictionary<T[]>>;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.groupBy
        **/
        groupBy<TValue>(
            callback: ListIterator<TValue, any>,
            thisArg?: any): _.LoDashObjectWrapper<_.Dictionary<TValue[]>>;

        /**
        * @see _.groupBy
        **/
        groupBy<TValue>(
            pluckValue: string): _.LoDashObjectWrapper<_.Dictionary<TValue[]>>;

        /**
        * @see _.groupBy
        **/
        groupBy<W, TValue>(
            whereValue: W): _.LoDashObjectWrapper<_.Dictionary<TValue[]>>;
    }

    //_.indexBy
    interface LoDashStatic {
        /**
        * Creates an object composed of keys generated from the results of running each element 
        * of the collection through the given callback. The corresponding value of each key is 
        * the last element responsible for generating the key. The callback is bound to thisArg 
        * and invoked with three arguments; (value, index|key, collection).
        *
        * If a property name is provided for callback the created "_.pluck" style callback will 
        * return the property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will return 
        * true for elements that have the properties of the given object, else false.
        * @param collection The collection to iterate over.
        * @param callback The function called per iteration.
        * @param thisArg The this binding of callback.
        * @return Returns the composed aggregate object.
        **/
        indexBy<T>(
            list: Array<T>,
            iterator: ListIterator<T, any>,
            context?: any): Dictionary<T>;

        /**
        * @see _.indexBy
        **/
        indexBy<T>(
            list: List<T>,
            iterator: ListIterator<T, any>,
            context?: any): Dictionary<T>;

        /**
        * @see _.indexBy
        * @param pluckValue _.pluck style callback
        **/
        indexBy<T>(
            collection: Array<T>,
            pluckValue: string): Dictionary<T>;

        /**
        * @see _.indexBy
        * @param pluckValue _.pluck style callback
        **/
        indexBy<T>(
            collection: List<T>,
            pluckValue: string): Dictionary<T>;

        /**
        * @see _.indexBy
        * @param whereValue _.where style callback
        **/
        indexBy<W, T>(
            collection: Array<T>,
            whereValue: W): Dictionary<T>;

        /**
        * @see _.indexBy
        * @param whereValue _.where style callback
        **/
        indexBy<W, T>(
            collection: List<T>,
            whereValue: W): Dictionary<T>;
    }

    //_.invoke
    interface LoDashStatic {
        /**
        * Invokes the method named by methodName on each element in the collection returning 
        * an array of the results of each invoked method. Additional arguments will be provided 
        * to each invoked method. If methodName is a function it will be invoked for, and this 
        * bound to, each element in the collection.
        * @param collection The collection to iterate over.
        * @param methodName The name of the method to invoke.
        * @param args Arguments to invoke the method with.
        **/
        invoke<T extends {}>(
            collection: Array<T>,
            methodName: string,
            ...args: any[]): any;

        /**
        * @see _.invoke
        **/
        invoke<T extends {}>(
            collection: List<T>,
            methodName: string,
            ...args: any[]): any;

        /**
        * @see _.invoke
        **/
        invoke<T extends {}>(
            collection: Dictionary<T>,
            methodName: string,
            ...args: any[]): any;

        /**
        * @see _.invoke
        **/
        invoke<T extends {}>(
            collection: Array<T>,
            method: Function,
            ...args: any[]): any;

        /**
        * @see _.invoke
        **/
        invoke<T extends {}>(
            collection: List<T>,
            method: Function,
            ...args: any[]): any;

        /**
        * @see _.invoke
        **/
        invoke<T extends {}>(
            collection: Dictionary<T>,
            method: Function,
            ...args: any[]): any;
    }

    //_.map
    interface LoDashStatic {
        /**
        * Creates an array of values by running each element in the collection through the callback. 
        * The callback is bound to thisArg and invoked with three arguments; (value, index|key, 
        * collection).
        *
        * If a property name is provided for callback the created "_.pluck" style callback will return 
        * the property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will return true 
        * for elements that have the properties of the given object, else false.
        * @param collection The collection to iterate over.
        * @param callback The function called per iteration.
        * @param theArg The this binding of callback.
        * @return The mapped array result.
        **/
        map<T, TResult>(
            collection: Array<T>,
            callback: ListIterator<T, TResult>,
            thisArg?: any): TResult[];

        /**
        * @see _.map
        **/
        map<T, TResult>(
            collection: List<T>,
            callback: ListIterator<T, TResult>,
            thisArg?: any): TResult[];

        /**
        * @see _.map
        * @param object The object to iterate over.
        * @param callback The function called per iteration.
        * @param thisArg `this` object in `iterator`, optional.
        * @return The mapped object result.
        **/
        map<T extends {}, TResult>(
            object: Dictionary<T>,
            callback: ObjectIterator<T, TResult>,
            thisArg?: any): TResult[];

        /**
        * @see _.map
        * @param pluckValue _.pluck style callback
        **/
        map<T, TResult>(
            collection: Array<T>,
            pluckValue: string): TResult[];

        /**
        * @see _.map
        * @param pluckValue _.pluck style callback
        **/
        map<T, TResult>(
            collection: List<T>,
            pluckValue: string): TResult[];

        /**
        * @see _.map
        **/
        collect<T, TResult>(
            collection: Array<T>,
            callback: ListIterator<T, TResult>,
            thisArg?: any): TResult[];

        /**
        * @see _.map
        **/
        collect<T, TResult>(
            collection: List<T>,
            callback: ListIterator<T, TResult>,
            thisArg?: any): TResult[];

        /**
        * @see _.map
        **/
        collect<T extends {}, TResult>(
            object: Dictionary<T>,
            callback: ObjectIterator<T, TResult>,
            thisArg?: any): TResult[];

        /**
        * @see _.map
        **/
        collect<T, TResult>(
            collection: Array<T>,
            pluckValue: string): TResult[];

        /**
        * @see _.map
        **/
        collect<T, TResult>(
            collection: List<T>,
            pluckValue: string): TResult[];
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.map
        **/
        map<TResult>(
            callback: ListIterator<T, TResult>,
            thisArg?: any): LoDashArrayWrapper<TResult>;

        /**
        * @see _.map
        * @param pluckValue _.pluck style callback
        **/
        map<TResult>(
            pluckValue: string): LoDashArrayWrapper<TResult>;

        /**
        * @see _.map
        **/
        collect<TResult>(
            callback: ListIterator<T, TResult>,
            thisArg?: any): LoDashArrayWrapper<TResult>;

        /**
        * @see _.map
        **/
        collect<TResult>(
            pluckValue: string): LoDashArrayWrapper<TResult>;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.map
        **/
        map<T extends {}, TResult>(
            callback: ObjectIterator<T, TResult>,
            thisArg?: any): LoDashArrayWrapper<TResult>;

        /**
        * @see _.map
        **/
        collect<T extends {}, TResult>(
            callback: ObjectIterator<T, TResult>,
            thisArg?: any): LoDashArrayWrapper<TResult>;
    }

    //_.max
    interface LoDashStatic {
        /**
        * Retrieves the maximum value of a collection. If the collection is empty or falsey -Infinity is 
        * returned. If a callback is provided it will be executed for each value in the collection to 
        * generate the criterion by which the value is ranked. The callback is bound to thisArg and invoked 
        * with three arguments; (value, index, collection).
        * 
        * If a property name is provided for callback the created "_.pluck" style callback will return the 
        * property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will return true for 
        * elements that have the properties of the given object, else false.
        * @param collection The collection to iterate over.
        * @param callback The function called per iteration.
        * @param thisArg The this binding of callback.
        * @return Returns the maximum value.
        **/
        max<T>(
            collection: Array<T>,
            callback?: ListIterator<T, any>,
            thisArg?: any): T;

        /**
        * @see _.max
        **/
        max<T>(
            collection: List<T>,
            callback?: ListIterator<T, any>,
            thisArg?: any): T;

        /**
        * @see _.max
        **/
        max<T>(
            collection: Dictionary<T>,
            callback?: ListIterator<T, any>,
            thisArg?: any): T;

        /**
        * @see _.max
        * @param pluckValue _.pluck style callback
        **/
        max<T>(
            collection: Array<T>,
            pluckValue: string): T;

        /**
        * @see _.max
        * @param pluckValue _.pluck style callback
        **/
        max<T>(
            collection: List<T>,
            pluckValue: string): T;

        /**
        * @see _.max
        * @param pluckValue _.pluck style callback
        **/
        max<T>(
            collection: Dictionary<T>,
            pluckValue: string): T;

        /**
        * @see _.max
        * @param whereValue _.where style callback
        **/
        max<W, T>(
            collection: Array<T>,
            whereValue: W): T;

        /**
        * @see _.max
        * @param whereValue _.where style callback
        **/
        max<W, T>(
            collection: List<T>,
            whereValue: W): T;

        /**
        * @see _.max
        * @param whereValue _.where style callback
        **/
        max<W, T>(
            collection: Dictionary<T>,
            whereValue: W): T;
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.max
        **/
        max(
            callback?: ListIterator<T, any>,
            thisArg?: any): LoDashWrapper<T>;

        /**
        * @see _.max
        * @param pluckValue _.pluck style callback
        **/
        max(
            pluckValue: string): LoDashWrapper<T>;

        /**
        * @see _.max
        * @param whereValue _.where style callback
        **/
        max<W>(
            whereValue: W): LoDashWrapper<T>;
    }

    //_.min
    interface LoDashStatic {
        /**
        * Retrieves the minimum value of a collection. If the collection is empty or falsey 
        * Infinity is returned. If a callback is provided it will be executed for each value 
        * in the collection to generate the criterion by which the value is ranked. The callback 
        * is bound to thisArg and invoked with three arguments; (value, index, collection).
        *
        * If a property name is provided for callback the created "_.pluck" style callback 
        * will return the property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will 
        * return true for elements that have the properties of the given object, else false.
        * @param collection The collection to iterate over.
        * @param callback The function called per iteration.
        * @param thisArg The this binding of callback.
        * @return Returns the maximum value.
        **/
        min<T>(
            collection: Array<T>,
            callback?: ListIterator<T, any>,
            thisArg?: any): T;

        /**
        * @see _.min
        **/
        min<T>(
            collection: List<T>,
            callback?: ListIterator<T, any>,
            thisArg?: any): T;

        /**
        * @see _.min
        **/
        min<T>(
            collection: Dictionary<T>,
            callback?: ListIterator<T, any>,
            thisArg?: any): T;

        /**
        * @see _.min
        * @param pluckValue _.pluck style callback
        **/
        min<T>(
            collection: Array<T>,
            pluckValue: string): T;

        /**
        * @see _.min
        * @param pluckValue _.pluck style callback
        **/
        min<T>(
            collection: List<T>,
            pluckValue: string): T;

        /**
        * @see _.min
        * @param pluckValue _.pluck style callback
        **/
        min<T>(
            collection: Dictionary<T>,
            pluckValue: string): T;

        /**
        * @see _.min
        * @param whereValue _.where style callback
        **/
        min<W, T>(
            collection: Array<T>,
            whereValue: W): T;

        /**
        * @see _.min
        * @param whereValue _.where style callback
        **/
        min<W, T>(
            collection: List<T>,
            whereValue: W): T;

        /**
        * @see _.min
        * @param whereValue _.where style callback
        **/
        min<W, T>(
            collection: Dictionary<T>,
            whereValue: W): T;
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.min
        **/
        min(
            callback?: ListIterator<T, any>,
            thisArg?: any): LoDashWrapper<T>;

        /**
        * @see _.min
        * @param pluckValue _.pluck style callback
        **/
        min(
            pluckValue: string): LoDashWrapper<T>;

        /**
        * @see _.min
        * @param whereValue _.where style callback
        **/
        min<W>(
            whereValue: W): LoDashWrapper<T>;
    }

    //_.sum
    interface LoDashStatic {
        /**
        * Gets the sum of the values in collection.
        *
        * @param collection The collection to iterate over.
        * @param iteratee The function invoked per iteration.
        * @param thisArg The this binding of iteratee.
        * @return Returns the sum.
        **/
        sum(
            collection: Array<number>): number;

        /**
        * @see _.sum
        **/
        sum(
            collection: List<number>): number;

        /**
        * @see _.sum
        **/
        sum(
            collection: Dictionary<number>): number;

        /**
        * @see _.sum
        **/
        sum<T>(
            collection: Array<T>,
            iteratee: ListIterator<T, number>,
            thisArg?: any): number;

        /**
        * @see _.sum
        **/
        sum<T>(
            collection: List<T>,
            iteratee: ListIterator<T, number>,
            thisArg?: any): number;

        /**
        * @see _.sum
        **/
        sum<T>(
            collection: Dictionary<T>,
            iteratee: ObjectIterator<T, number>,
            thisArg?: any): number;

        /**
        * @see _.sum
        * @param property _.property callback shorthand.
        **/
        sum<T>(
            collection: Array<T>,
            property: string): number;

        /**
        * @see _.sum
        * @param property _.property callback shorthand.
        **/
        sum<T>(
            collection: List<T>,
            property: string): number;

        /**
        * @see _.sum
        * @param property _.property callback shorthand.
        **/
        sum<T>(
            collection: Dictionary<T>,
            property: string): number;
    }

    interface LoDashNumberArrayWrapper {
        /**
        * @see _.sum
        **/
        sum(): number;

        /**
        * @see _.sum
        **/
        sum(
            iteratee: ListIterator<number, number>,
            thisArg?: any): number;
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.sum
        **/
        sum(): number;

        /**
        * @see _.sum
        **/
        sum(
            iteratee: ListIterator<T, number>,
            thisArg?: any): number;

        /**
        * @see _.sum
        * @param property _.property callback shorthand.
        **/
        sum(
            property: string): number;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.sum
        **/
        sum(): number;

        /**
        * @see _.sum
        **/
        sum(
            iteratee: ObjectIterator<any, number>,
            thisArg?: any): number;

        /**
        * @see _.sum
        * @param property _.property callback shorthand.
        **/
        sum(
            property: string): number;
    }

    //_.pluck
    interface LoDashStatic {
        /**
        * Retrieves the value of a specified property from all elements in the collection.
        * @param collection The collection to iterate over.
        * @param property The property to pluck.
        * @return A new array of property values.
        **/
        pluck<T extends {}>(
            collection: Array<T>,
            property: string): any[];

        /**
        * @see _.pluck
        **/
        pluck<T extends {}>(
            collection: List<T>,
            property: string): any[];

        /**
        * @see _.pluck
        **/
        pluck<T extends {}>(
            collection: Dictionary<T>,
            property: string): any[];
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.pluck
        **/
        pluck<TResult>(
            property: string): LoDashArrayWrapper<TResult>;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.pluck
        **/
        pluck<TResult>(
            property: string): LoDashArrayWrapper<TResult>;
    }

    //_.reduce
    interface LoDashStatic {
        /**
        * Reduces a collection to a value which is the accumulated result of running each 
        * element in the collection through the callback, where each successive callback execution 
        * consumes the return value of the previous execution. If accumulator is not provided the 
        * first element of the collection will be used as the initial accumulator value. The callback 
        * is bound to thisArg and invoked with four arguments; (accumulator, value, index|key, collection).
        * @param collection The collection to iterate over.
        * @param callback The function called per iteration.
        * @param accumulator Initial value of the accumulator.
        * @param thisArg The this binding of callback.
        * @return Returns the accumulated value.
        **/
        reduce<T, TResult>(
            collection: Array<T>,
            callback: MemoIterator<T, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        reduce<T, TResult>(
            collection: List<T>,
            callback: MemoIterator<T, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        reduce<T, TResult>(
            collection: Dictionary<T>,
            callback: MemoIterator<T, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        reduce<T, TResult>(
            collection: Array<T>,
            callback: MemoIterator<T, TResult>,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        reduce<T, TResult>(
            collection: List<T>,
            callback: MemoIterator<T, TResult>,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        reduce<T, TResult>(
            collection: Dictionary<T>,
            callback: MemoIterator<T, TResult>,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        inject<T, TResult>(
            collection: Array<T>,
            callback: MemoIterator<T, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        inject<T, TResult>(
            collection: List<T>,
            callback: MemoIterator<T, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        inject<T, TResult>(
            collection: Dictionary<T>,
            callback: MemoIterator<T, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        inject<T, TResult>(
            collection: Array<T>,
            callback: MemoIterator<T, TResult>,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        inject<T, TResult>(
            collection: List<T>,
            callback: MemoIterator<T, TResult>,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        inject<T, TResult>(
            collection: Dictionary<T>,
            callback: MemoIterator<T, TResult>,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        foldl<T, TResult>(
            collection: Array<T>,
            callback: MemoIterator<T, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        foldl<T, TResult>(
            collection: List<T>,
            callback: MemoIterator<T, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        foldl<T, TResult>(
            collection: Dictionary<T>,
            callback: MemoIterator<T, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        foldl<T, TResult>(
            collection: Array<T>,
            callback: MemoIterator<T, TResult>,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        foldl<T, TResult>(
            collection: List<T>,
            callback: MemoIterator<T, TResult>,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        foldl<T, TResult>(
            collection: Dictionary<T>,
            callback: MemoIterator<T, TResult>,
            thisArg?: any): TResult;
    }

    interface LoDashArrayWrapper<T> {
         /**
        * @see _.reduce
        **/
        reduce<TResult>(
            callback: MemoIterator<T, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        reduce<TResult>(
            callback: MemoIterator<T, TResult>,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        inject<TResult>(
            callback: MemoIterator<T, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        inject<TResult>(
            callback: MemoIterator<T, TResult>,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        foldl<TResult>(
            callback: MemoIterator<T, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        foldl<TResult>(
            callback: MemoIterator<T, TResult>,
            thisArg?: any): TResult;
    }

    interface LoDashObjectWrapper<T> {
         /**
        * @see _.reduce
        **/
        reduce<TValue, TResult>(
            callback: MemoIterator<TValue, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        reduce<TValue, TResult>(
            callback: MemoIterator<TValue, TResult>,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        inject<TValue, TResult>(
            callback: MemoIterator<TValue, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        inject<TValue, TResult>(
            callback: MemoIterator<TValue, TResult>,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        foldl<TValue, TResult>(
            callback: MemoIterator<TValue, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduce
        **/
        foldl<TValue, TResult>(
            callback: MemoIterator<TValue, TResult>,
            thisArg?: any): TResult;
    }

    //_.reduceRight
    interface LoDashStatic {
        /**
        * This method is like _.reduce except that it iterates over elements of a collection from 
        * right to left.
        * @param collection The collection to iterate over.
        * @param callback The function called per iteration.
        * @param accumulator Initial value of the accumulator.
        * @param thisArg The this binding of callback.
        * @return The accumulated value.
        **/
        reduceRight<T, TResult>(
            collection: Array<T>,
            callback: MemoIterator<T, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduceRight
        **/
        reduceRight<T, TResult>(
            collection: List<T>,
            callback: MemoIterator<T, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduceRight
        **/
        reduceRight<T, TResult>(
            collection: Dictionary<T>,
            callback: MemoIterator<T, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduceRight
        **/
        reduceRight<T, TResult>(
            collection: Array<T>,
            callback: MemoIterator<T, TResult>,
            thisArg?: any): TResult;

        /**
        * @see _.reduceRight
        **/
        reduceRight<T, TResult>(
            collection: List<T>,
            callback: MemoIterator<T, TResult>,
            thisArg?: any): TResult;

        /**
        * @see _.reduceRight
        **/
        reduceRight<T, TResult>(
            collection: Dictionary<T>,
            callback: MemoIterator<T, TResult>,
            thisArg?: any): TResult;

        /**
        * @see _.reduceRight
        **/
        foldr<T, TResult>(
            collection: Array<T>,
            callback: MemoIterator<T, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduceRight
        **/
        foldr<T, TResult>(
            collection: List<T>,
            callback: MemoIterator<T, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduceRight
        **/
        foldr<T, TResult>(
            collection: Dictionary<T>,
            callback: MemoIterator<T, TResult>,
            accumulator: TResult,
            thisArg?: any): TResult;

        /**
        * @see _.reduceRight
        **/
        foldr<T, TResult>(
            collection: Array<T>,
            callback: MemoIterator<T, TResult>,
            thisArg?: any): TResult;

        /**
        * @see _.reduceRight
        **/
        foldr<T, TResult>(
            collection: List<T>,
            callback: MemoIterator<T, TResult>,
            thisArg?: any): TResult;

        /**
        * @see _.reduceRight
        **/
        foldr<T, TResult>(
            collection: Dictionary<T>,
            callback: MemoIterator<T, TResult>,
            thisArg?: any): TResult;
    }

    //_.reject
    interface LoDashStatic {
        /**
        * The opposite of _.filter this method returns the elements of a collection that 
        * the callback does not return truey for.
        *
        * If a property name is provided for callback the created "_.pluck" style callback 
        * will return the property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will 
        * return true for elements that have the properties of the given object, else false.
        * @param collection The collection to iterate over.
        * @param callback The function called per iteration.
        * @param thisArg The this binding of callback.
        * @return A new array of elements that failed the callback check.
        **/
        reject<T>(
            collection: Array<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.reject
        **/
        reject<T>(
            collection: List<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.reject
        **/
        reject<T>(
            collection: Dictionary<T>,
            callback: ListIterator<T, boolean>,
            thisArg?: any): T[];

        /**
        * @see _.reject
        * @param pluckValue _.pluck style callback
        **/
        reject<T>(
            collection: Array<T>,
            pluckValue: string): T[];

        /**
        * @see _.reject
        * @param pluckValue _.pluck style callback
        **/
        reject<T>(
            collection: List<T>,
            pluckValue: string): T[];

        /**
        * @see _.reject
        * @param pluckValue _.pluck style callback
        **/
        reject<T>(
            collection: Dictionary<T>,
            pluckValue: string): T[];

        /**
        * @see _.reject
        * @param whereValue _.where style callback
        **/
        reject<W, T>(
            collection: Array<T>,
            whereValue: W): T[];

        /**
        * @see _.reject
        * @param whereValue _.where style callback
        **/
        reject<W, T>(
            collection: List<T>,
            whereValue: W): T[];

        /**
        * @see _.reject
        * @param whereValue _.where style callback
        **/
        reject<W, T>(
            collection: Dictionary<T>,
            whereValue: W): T[];
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.reject
        **/
        reject(
            callback: ListIterator<T, boolean>,
            thisArg?: any): LoDashArrayWrapper<T>;

        /**
        * @see _.reject
        * @param pluckValue _.pluck style callback
        **/
        reject(pluckValue: string): LoDashArrayWrapper<T>;

        /**
        * @see _.reject
        * @param whereValue _.where style callback
        **/
        reject<W>(whereValue: W): LoDashArrayWrapper<T>;
    }

    //_.sample
    interface LoDashStatic {
        /**
        * Retrieves a random element or n random elements from a collection.
        * @param collection The collection to sample.
        * @return Returns the random sample(s) of collection.
        **/
        sample<T>(collection: Array<T>): T;

        /**
        * @see _.sample
        **/
        sample<T>(collection: List<T>): T;

        /**
        * @see _.sample
        **/
        sample<T>(collection: Dictionary<T>): T;

        /**
        * @see _.sample
        * @param n The number of elements to sample.
        **/
        sample<T>(collection: Array<T>, n: number): T[];

        /**
        * @see _.sample
        * @param n The number of elements to sample.
        **/
        sample<T>(collection: List<T>, n: number): T[];

        /**
        * @see _.sample
        * @param n The number of elements to sample.
        **/
        sample<T>(collection: Dictionary<T>, n: number): T[];
    }

    //_.shuffle
    interface LoDashStatic {
        /**
        * Creates an array of shuffled values, using a version of the Fisher-Yates shuffle. 
        * See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
        * @param collection The collection to shuffle.
        * @return Returns a new shuffled collection.
        **/
        shuffle<T>(collection: Array<T>): T[];

        /**
        * @see _.shuffle
        **/
        shuffle<T>(collection: List<T>): T[];

        /**
        * @see _.shuffle
        **/
        shuffle<T>(collection: Dictionary<T>): T[];
    }

    //_.size
    interface LoDashStatic {
        /**
        * Gets the size of the collection by returning collection.length for arrays and array-like 
        * objects or the number of own enumerable properties for objects.
        * @param collection The collection to inspect.
        * @return collection.length
        **/
        size<T>(collection: Array<T>): number;

        /**
        * @see _.size
        **/
        size<T>(collection: List<T>): number;

        /**
        * @see _.size
        * @param object The object to inspect
        * @return The number of own enumerable properties.
        **/
        size<T extends {}>(object: T): number;

        /**
        * @see _.size
        * @param aString The string to inspect
        * @return The length of aString
        **/
        size(aString: string): number;
    }

    //_.some
    interface LoDashStatic {
        /**
        * Checks if the callback returns a truey value for any element of a collection. The function 
        * returns as soon as it finds a passing value and does not iterate over the entire collection. 
        * The callback is bound to thisArg and invoked with three arguments; (value, index|key, collection).
        *
        * If a property name is provided for callback the created "_.pluck" style callback will return 
        * the property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will return true for 
        * elements that have the properties of the given object, else false.
        * @param collection The collection to iterate over.
        * @param callback The function called per iteration.
        * @param thisArg The this binding of callback.
        * @return True if any element passed the callback check, else false.
        **/
        some<T>(
            collection: Array<T>,
            callback?: ListIterator<T, boolean>,
            thisArg?: any): boolean;

        /**
        * @see _.some
        **/
        some<T>(
            collection: List<T>,
            callback?: ListIterator<T, boolean>,
            thisArg?: any): boolean;

        /**
        * @see _.some
        **/
        some<T>(
            collection: Dictionary<T>,
            callback?: ListIterator<T, boolean>,
            thisArg?: any): boolean;

        /**
         * @see _.some
         **/
        some(
            collection: {},
            callback?: ListIterator<{}, boolean>,
            thisArg?: any): boolean;

        /**
        * @see _.some
        * @param pluckValue _.pluck style callback
        **/
        some<T>(
            collection: Array<T>,
            pluckValue: string): boolean;

        /**
        * @see _.some
        * @param pluckValue _.pluck style callback
        **/
        some<T>(
            collection: List<T>,
            pluckValue: string): boolean;

        /**
        * @see _.some
        * @param pluckValue _.pluck style callback
        **/
        some<T>(
            collection: Dictionary<T>,
            pluckValue: string): boolean;

        /**
        * @see _.some
        * @param whereValue _.where style callback
        **/
        some<W, T>(
            collection: Array<T>,
            whereValue: W): boolean;

        /**
        * @see _.some
        * @param whereValue _.where style callback
        **/
        some<W, T>(
            collection: List<T>,
            whereValue: W): boolean;

        /**
        * @see _.some
        * @param whereValue _.where style callback
        **/
        some<W, T>(
            collection: Dictionary<T>,
            whereValue: W): boolean;

        /**
        * @see _.some
        **/
        any<T>(
            collection: Array<T>,
            callback?: ListIterator<T, boolean>,
            thisArg?: any): boolean;

        /**
        * @see _.some
        **/
        any<T>(
            collection: List<T>,
            callback?: ListIterator<T, boolean>,
            thisArg?: any): boolean;

        /**
        * @see _.some
        **/
        any<T>(
            collection: Dictionary<T>,
            callback?: ListIterator<T, boolean>,
            thisArg?: any): boolean;

        /**
         * @see _.some
         **/
        any(
            collection: {},
            callback?: ListIterator<{}, boolean>,
            thisArg?: any): boolean;

        /**
        * @see _.some
        * @param pluckValue _.pluck style callback
        **/
        any<T>(
            collection: Array<T>,
            pluckValue: string): boolean;

        /**
        * @see _.some
        * @param pluckValue _.pluck style callback
        **/
        any<T>(
            collection: List<T>,
            pluckValue: string): boolean;

        /**
        * @see _.some
        * @param pluckValue _.pluck style callback
        **/
        any<T>(
            collection: Dictionary<T>,
            pluckValue: string): boolean;

        /**
        * @see _.some
        * @param whereValue _.where style callback
        **/
        any<W, T>(
            collection: Array<T>,
            whereValue: W): boolean;

        /**
        * @see _.some
        * @param whereValue _.where style callback
        **/
        any<W, T>(
            collection: List<T>,
            whereValue: W): boolean;

        /**
        * @see _.some
        * @param whereValue _.where style callback
        **/
        any<W, T>(
            collection: Dictionary<T>,
            whereValue: W): boolean;
    }

    //_.sortBy
    interface LoDashStatic {
        /**
        * Creates an array of elements, sorted in ascending order by the results of running each 
        * element in a collection through the callback. This method performs a stable sort, that 
        * is, it will preserve the original sort order of equal elements. The callback is bound 
        * to thisArg and invoked with three arguments; (value, index|key, collection).
        *
        * If a property name is provided for callback the created "_.pluck" style callback will 
        * return the property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will return 
        * true for elements that have the properties of the given object, else false.
        * @param collection The collection to iterate over.
        * @param callback The function called per iteration.
        * @param thisArg The this binding of callback.
        * @return A new array of sorted elements.
        **/
        sortBy<T, TSort>(
            collection: Array<T>,
            callback?: ListIterator<T, TSort>,
            thisArg?: any): T[];

        /**
        * @see _.sortBy
        **/
        sortBy<T, TSort>(
            collection: List<T>,
            callback?: ListIterator<T, TSort>,
            thisArg?: any): T[];

        /**
        * @see _.sortBy
        * @param pluckValue _.pluck style callback
        **/
        sortBy<T>(
            collection: Array<T>,
            pluckValue: string): T[];

        /**
        * @see _.sortBy
        * @param pluckValue _.pluck style callback
        **/
        sortBy<T>(
            collection: List<T>,
            pluckValue: string): T[];

        /**
        * @see _.sortBy
        * @param whereValue _.where style callback
        **/
        sortBy<W, T>(
            collection: Array<T>,
            whereValue: W): T[];

        /**
        * @see _.sortBy
        * @param whereValue _.where style callback
        **/
        sortBy<W, T>(
            collection: List<T>,
            whereValue: W): T[];
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.sortBy
        **/
        sortBy<TSort>(
            callback?: ListIterator<T, TSort>,
            thisArg?: any): LoDashArrayWrapper<T>;

        /**
        * @see _.sortBy
        * @param pluckValue _.pluck style callback
        **/
        sortBy(pluckValue: string): LoDashArrayWrapper<T>;

        /**
        * @see _.sortBy
        * @param whereValue _.where style callback
        **/
        sortBy<W>(whereValue: W): LoDashArrayWrapper<T>;
    }

    //_.toArray
    interface LoDashStatic {
        /**
        * Converts the collection to an array.
        * @param collection The collection to convert.
        * @return The new converted array.
        **/
        toArray<T>(collection: Array<T>): T[];

        /**
        * @see _.toArray
        **/
        toArray<T>(collection: List<T>): T[];

        /**
        * @see _.toArray
        **/
        toArray<T>(collection: Dictionary<T>): T[];
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.toArray
        **/
        toArray(): LoDashArrayWrapper<T>;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.toArray
        **/
        toArray<TValue>(): LoDashArrayWrapper<TValue>;
    }

    //_.toPlainObject
    interface LoDashStatic {
        /**
         * Converts value to a plain object flattening inherited enumerable properties of value to own properties
         * of the plain object.
         *
         * @param value The value to convert.
         * @return Returns the converted plain object.
         */
        toPlainObject<TResult extends {}>(value?: any): TResult;
    }

    //_.where
    interface LoDashStatic {
        /**
        * Performs a deep comparison of each element in a collection to the given properties 
        * object, returning an array of all elements that have equivalent property values.
        * @param collection The collection to iterate over.
        * @param properties The object of property values to filter by.
        * @return A new array of elements that have the given properties.
        **/
        where<T, U extends {}>(
            list: Array<T>,
            properties: U): T[];

        /**
        * @see _.where
        **/
        where<T, U extends {}>(
            list: List<T>,
            properties: U): T[];

        /**
        * @see _.where
        **/
        where<T, U extends {}>(
            list: Dictionary<T>,
            properties: U): T[];
    }

    interface LoDashArrayWrapper<T> {
        /**
        * @see _.where
        **/
        where<T, U extends {}>(properties: U): LoDashArrayWrapper<T>;
    }

    /*************
     * Functions *
     *************/

    //_.after
    interface LoDashStatic {
        /**
        * Creates a function that executes func, with the this binding and arguments of the 
        * created function, only after being called n times.
        * @param n The number of times the function must be called before func is executed.
        * @param func The function to restrict.
        * @return The new restricted function.
        **/
        after(
            n: number,
            func: Function): Function;
    }

    interface LoDashWrapper<T> {
        /**
        * @see _.after
        **/
        after(func: Function): LoDashObjectWrapper<Function>;
    }

    //_.bind
    interface LoDashStatic {
        /**
        * Creates a function that, when called, invokes func with the this binding of thisArg 
        * and prepends any additional bind arguments to those provided to the bound function.
        * @param func The function to bind.
        * @param thisArg The this binding of func.
        * @param args Arguments to be partially applied.
        * @return The new bound function.
        **/
        bind(
            func: Function,
            thisArg: any,
            ...args: any[]): () => any;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.bind
        **/
        bind(
            thisArg: any,
            ...args: any[]): LoDashObjectWrapper<() => any>;
    }

    //_.bindAll
    interface LoDashStatic {
        /**
        * Binds methods of an object to the object itself, overwriting the existing method. Method 
        * names may be specified as individual arguments or as arrays of method names. If no method 
        * names are provided all the function properties of object will be bound.
        * @param object The object to bind and assign the bound methods to.
        * @param methodNames The object method names to bind, specified as individual method names 
        * or arrays of method names.
        * @return object
        **/
        bindAll<T>(
            object: T,
            ...methodNames: string[]): T;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.bindAll
        **/
        bindAll(...methodNames: string[]): LoDashWrapper<T>;
    }

    //_.bindKey
    interface LoDashStatic {
        /**
        * Creates a function that, when called, invokes the method at object[key] and prepends any 
        * additional bindKey arguments to those provided to the bound function. This method differs 
        * from _.bind by allowing bound functions to reference methods that will be redefined or don't 
        * yet exist. See http://michaux.ca/articles/lazy-function-definition-pattern.
        * @param object The object the method belongs to.
        * @param key The key of the method.
        * @param args Arguments to be partially applied.
        * @return The new bound function.
        **/
        bindKey<T>(
            object: T,
            key: string,
            ...args: any[]): Function;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.bindKey
        **/
        bindKey(
            key: string,
            ...args: any[]): LoDashObjectWrapper<Function>;
    }

    //_.compose
    interface LoDashStatic {
        /**
        * Creates a function that is the composition of the provided functions, where each function 
        * consumes the return value of the function that follows. For example, composing the functions 
        * f(), g(), and h() produces f(g(h())). Each function is executed with the this binding of the 
        * composed function.
        * @param funcs Functions to compose.
        * @return The new composed function.
        **/
        compose(...funcs: Function[]): Function;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.compose
        **/
        compose(...funcs: Function[]): LoDashObjectWrapper<Function>;
    }

    //_.createCallback
    interface LoDashStatic {
        /**
        * Produces a callback bound to an optional thisArg. If func is a property name the created 
        * callback will return the property value for a given element. If func is an object the created 
        * callback will return true for elements that contain the equivalent object properties, 
        * otherwise it will return false.
        * @param func The value to convert to a callback.
        * @param thisArg The this binding of the created callback.
        * @param argCount The number of arguments the callback accepts.
        * @return A callback function.
        **/
        createCallback(
            func: string,
            thisArg?: any,
            argCount?: number): () => any;

        /**
        * @see _.createCallback
        **/
        createCallback(
            func: Dictionary<any>,
            thisArg?: any,
            argCount?: number): () => boolean;
    }

    interface LoDashWrapper<T> {
        /**
        * @see _.createCallback
        **/
        createCallback(
            thisArg?: any,
            argCount?: number): LoDashObjectWrapper<() => any>;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.createCallback
        **/
        createCallback(
            thisArg?: any,
            argCount?: number): LoDashObjectWrapper<() => any>;
    }

    //_.curry
    interface LoDashStatic {
        /**
        * Creates a function which accepts one or more arguments of func that when invoked either 
        * executes func returning its result, if all func arguments have been provided, or returns 
        * a function that accepts one or more of the remaining func arguments, and so on. The arity 
        * of func can be specified if func.length is not sufficient.
        * @param func The function to curry.
        * @param arity The arity of func.
        * @return The new curried function.
        **/
        curry(
            func: Function,
            arity?: number): Function;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.curry
        **/
        curry(arity?: number): LoDashObjectWrapper<Function>;
    }

    //_.debounce
    interface LoDashStatic {
        /**
        * Creates a function that will delay the execution of func until after wait milliseconds have 
        * elapsed since the last time it was invoked. Provide an options object to indicate that func 
        * should be invoked on the leading and/or trailing edge of the wait timeout. Subsequent calls 
        * to the debounced function will return the result of the last func call.
        *
        * Note: If leading and trailing options are true func will be called on the trailing edge of 
        * the timeout only if the the debounced function is invoked more than once during the wait 
        * timeout.
        * @param func The function to debounce.
        * @param wait The number of milliseconds to delay.
        * @param options The options object.
        * @param options.leading Specify execution on the leading edge of the timeout.
        * @param options.maxWait The maximum time func is allowed to be delayed before it’s called.
        * @param options.trailing Specify execution on the trailing edge of the timeout.
        * @return The new debounced function.
        **/
        debounce<T extends Function>(
            func: T,
            wait: number,
            options?: DebounceSettings): T;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.debounce
        **/
        debounce(
            wait: number,
            options?: DebounceSettings): LoDashObjectWrapper<Function>;
    }

    interface DebounceSettings {
        /**
        * Specify execution on the leading edge of the timeout.
        **/
        leading?: boolean;

        /**
        * The maximum time func is allowed to be delayed before it’s called.
        **/
        maxWait?: number;

        /**
        * Specify execution on the trailing edge of the timeout.
        **/
        trailing?: boolean;
    }

    //_.defer
    interface LoDashStatic {
        /**
        * Defers executing the func function until the current call stack has cleared. Additional 
        * arguments will be provided to func when it is invoked.
        * @param func The function to defer.
        * @param args Arguments to invoke the function with.
        * @return The timer id.
        **/
        defer(
            func: Function,
            ...args: any[]): number;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.defer
        **/
        defer(...args: any[]): LoDashWrapper<number>;
    }

    //_.delay
    interface LoDashStatic {
        /**
        * Executes the func function after wait milliseconds. Additional arguments will be provided 
        * to func when it is invoked.
        * @param func The function to delay.
        * @param wait The number of milliseconds to delay execution.
        * @param args Arguments to invoke the function with.
        * @return The timer id.
        **/
        delay(
            func: Function,
            wait: number,
            ...args: any[]): number;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.delay
        **/
        delay(
            wait: number,
            ...args: any[]): LoDashWrapper<number>;
    }

    //_.memoize
    interface LoDashStatic {
        /**
        * Creates a function that memoizes the result of func. If resolver is provided it will be 
        * used to determine the cache key for storing the result based on the arguments provided to 
        * the memoized function. By default, the first argument provided to the memoized function is 
        * used as the cache key. The func is executed with the this binding of the memoized function. 
        * The result cache is exposed as the cache property on the memoized function.
        * @param func Computationally expensive function that will now memoized results.
        * @param resolver Hash function for storing the result of `fn`.
        * @return Returns the new memoizing function.
        **/
        memoize<T extends Function>(
            func: T,
            resolver?: Function): T;
    }

    //_.once
    interface LoDashStatic {
        /**
        * Creates a function that is restricted to execute func once. Repeat calls to the function 
        * will return the value of the first call. The func is executed with the this binding of the 
        * created function.
        * @param func Function to only execute once.
        * @return The new restricted function.
        **/
        once<T extends Function>(func: T): T;
    }

    //_.partial
    interface LoDashStatic {
        /**
        * Creates a function that, when called, invokes func with any additional partial arguments 
        * prepended to those provided to the new function. This method is similar to _.bind except 
        * it does not alter the this binding.
        * @param func The function to partially apply arguments to.
        * @param args Arguments to be partially applied.
        * @return The new partially applied function.
        **/
        partial(
            func: Function,
            ...args: any[]): Function;
    }

    //_.partialRight
    interface LoDashStatic {
        /**
        * This method is like _.partial except that partial arguments are appended to those provided 
        * to the new function.
        * @param func The function to partially apply arguments to.
        * @param args Arguments to be partially applied.
        * @return The new partially applied function.
        **/
        partialRight(
            func: Function,
            ...args: any[]): Function;
    }

    //_.throttle
    interface LoDashStatic {
        /**
        * Creates a function that, when executed, will only call the func function at most once per 
        * every wait milliseconds. Provide an options object to indicate that func should be invoked 
        * on the leading and/or trailing edge of the wait timeout. Subsequent calls to the throttled 
        * function will return the result of the last func call.
        *
        * Note: If leading and trailing options are true func will be called on the trailing edge of 
        * the timeout only if the the throttled function is invoked more than once during the wait timeout.
        * @param func The function to throttle.
        * @param wait The number of milliseconds to throttle executions to.
        * @param options The options object.
        * @param options.leading Specify execution on the leading edge of the timeout.
        * @param options.trailing Specify execution on the trailing edge of the timeout.
        * @return The new throttled function.
        **/
        throttle<T extends Function>(
            func: T,
            wait: number,
            options?: ThrottleSettings): T;
    }

    interface ThrottleSettings {

        /**
        * If you'd like to disable the leading-edge call, pass this as false.
        **/
        leading?: boolean;

        /**
        * If you'd like to disable the execution on the trailing-edge, pass false.
        **/
        trailing?: boolean;
    }

    //_.wrap
    interface LoDashStatic {
        /**
        * Creates a function that provides value to the wrapper function as its first argument. 
        * Additional arguments provided to the function are appended to those provided to the 
        * wrapper function. The wrapper is executed with the this binding of the created function.
        * @param value The value to wrap.
        * @param wrapper The wrapper function.
        * @return The new function.
        **/
        wrap(
            value: any,
            wrapper: (func: Function, ...args: any[]) => any): Function;
    }

    /*************
     * Objects   *
     *************/

    //_.assign
    interface LoDashStatic {
        /**
        * Assigns own enumerable properties of source object(s) to the destination object. Subsequent 
        * sources will overwrite property assignments of previous sources. If a callback is provided 
        * it will be executed to produce the assigned values. The callback is bound to thisArg and 
        * invoked with two arguments; (objectValue, sourceValue).
        * @param object The destination object.
        * @param s1-8 The source object(s)
        * @param callback The function to customize merging properties.
        * @param thisArg The this binding of callback.
        * @return The destination object.
        **/
        assign<P, T, S1, Value, Result>(
            object: T,
            s1: S1,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): Result;

        /**
        * @see _.assign
        **/
        assign<P, T, S1, S2, Value, Result>(
            object: T,
            s1: S1,
            s2: S2,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): Result;

        /**
        * @see _.assign
        **/
        assign<P, T, S1, S2, S3, Value, Result>(
            object: T,
            s1: S1,
            s2: S2,
            s3: S3,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): Result;

        /**
        * @see _.assign
        **/
        assign<P, T, S1, S2, S3, S4, Value, Result>(
            object: T,
            s1: S1,
            s2: S2,
            s3: S3,
            s4: S4,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): Result;

        /**
        * @see _.assign
        **/
        extend<P, T, S1, Value, Result>(
            object: T,
            s1: S1,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): Result;

        /**
        * @see _.assign
        **/
        extend<P, T, S1, S2, Value, Result>(
            object: T,
            s1: S1,
            s2: S2,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): Result;

        /**
        * @see _.assign
        **/
        extend<P, T, S1, S2, S3, Value, Result>(
            object: T,
            s1: S1,
            s2: S2,
            s3: S3,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): Result;

        /**
        * @see _.assign
        **/
        extend<P, T, S1, S2, S3, S4, Value, Result>(
            object: T,
            s1: S1,
            s2: S2,
            s3: S3,
            s4: S4,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): Result;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.assign
        **/
        assign<S1, Value, TResult>(
            s1: S1,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): TResult;

        /**
        * @see _.assign
        **/
        assign<S1, S2, Value, TResult>(
            s1: S1,
            s2: S2,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): TResult;
        /**
        * @see _.assign
        **/
        assign<S1, S2, S3, Value, TResult>(
            s1: S1,
            s2: S2,
            s3: S3,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): TResult;
        /**
        * @see _.assign
        **/
        assign<S1, S2, S3, S4, Value, TResult>(
            s1: S1,
            s2: S2,
            s3: S3,
            s4: S4,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): TResult;
        /**
        * @see _.assign
        **/
        assign<S1, S2, S3, S4, S5, Value, TResult>(
            s1: S1,
            s2: S2,
            s3: S3,
            s4: S4,
            s5: S5,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): TResult;

        /**
        * @see _.assign
        **/
        extend<S1, Value, TResult>(
            s1: S1,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): TResult;

        /**
        * @see _.assign
        **/
        extend<S1, S2, Value, TResult>(
            s1: S1,
            s2: S2,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): TResult;
        /**
        * @see _.assign
        **/
        extend<S1, S2, S3, Value, TResult>(
            s1: S1,
            s2: S2,
            s3: S3,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): TResult;
        /**
        * @see _.assign
        **/
        extend<S1, S2, S3, S4, Value, TResult>(
            s1: S1,
            s2: S2,
            s3: S3,
            s4: S4,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): TResult;
        /**
        * @see _.assign
        **/
        extend<S1, S2, S3, S4, S5, Value, TResult>(
            s1: S1,
            s2: S2,
            s3: S3,
            s4: S4,
            s5: S5,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): TResult;

    }

    //_.clone
    interface LoDashStatic {
        /**
        * Creates a clone of value. If deep is true nested objects will also be cloned, otherwise 
        * they will be assigned by reference. If a callback is provided it will be executed to produce 
        * the cloned values. If the callback returns undefined cloning will be handled by the method 
        * instead. The callback is bound to thisArg and invoked with one argument; (value).
        * @param value The value to clone.
        * @param deep Specify a deep clone.
        * @param callback The function to customize cloning values.
        * @param thisArg The this binding of callback.
        * @return The cloned value.
        **/
        clone<T>(
            value: T,
            deep?: boolean,
            callback?: (value: any) => any,
            thisArg?: any): T;
    }

    //_.cloneDeep
    interface LoDashStatic {
        /**
        * Creates a deep clone of value. If a callback is provided it will be executed to produce the 
        * cloned values. If the callback returns undefined cloning will be handled by the method instead. 
        * The callback is bound to thisArg and invoked with one argument; (value).
        *
        * Note: This method is loosely based on the structured clone algorithm. Functions and DOM nodes 
        * are not cloned. The enumerable properties of arguments objects and objects created by constructors 
        * other than Object are cloned to plain Object objects. 
        * See http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm.
        * @param value The value to clone.
        * @param callback The function to customize cloning values.
        * @param thisArg The this binding of callback.
        * @return The cloned value.
        **/
        cloneDeep<T>(
            value: T,
            callback?: (value: any) => any,
            thisArg?: any): T;
    }

    //_.defaults
    interface LoDashStatic {
        /**
        * Assigns own enumerable properties of source object(s) to the destination object for all 
        * destination properties that resolve to undefined. Once a property is set, additional defaults 
        * of the same property will be ignored.
        * @param object The destination object.
        * @param sources The source objects.
        * @return The destination object.
        **/
        defaults<T, TResult>(
            object: T,
            ...sources: any[]): TResult;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.defaults
        **/
        defaults<T, TResult>(...sources: any[]): LoDashObjectWrapper<TResult>
    }

    //_.findKey
    interface LoDashStatic {
        /**
        * This method is like _.findIndex except that it returns the key of the first element that 
        * passes the callback check, instead of the element itself.
        * @param object The object to search.
        * @param callback The function called per iteration.
        * @param thisArg The this binding of callback.
        * @return The key of the found element, else undefined.
        **/
        findKey(
            object: any,
            callback: (value: any) => boolean,
            thisArg?: any): string;

        /**
        * @see _.findKey
        * @param pluckValue _.pluck style callback
        **/
        findKey(
            object: any,
            pluckValue: string): string;

        /**
        * @see _.findKey
        * @param whereValue _.where style callback
        **/
        findKey<W extends Dictionary<any>, T>(
            object: T,
            whereValue: W): string;
    }

    //_.findLastKey
    interface LoDashStatic {
        /**
        * This method is like _.findKey except that it iterates over elements of a collection in the opposite order.
        * @param object The object to search.
        * @param callback The function called per iteration.
        * @param thisArg The this binding of callback.
        * @return The key of the found element, else undefined.
        **/
        findLastKey(
            object: any,
            callback: (value: any) => boolean,
            thisArg?: any): string;

        /**
        * @see _.findLastKey
        * @param pluckValue _.pluck style callback
        **/
        findLastKey(
            object: any,
            pluckValue: string): string;

        /**
        * @see _.findLastKey
        * @param whereValue _.where style callback
        **/
        findLastKey<W extends Dictionary<any>, T>(
            object: T,
            whereValue: W): string;
    }

    //_.forOwn
    interface LoDashStatic {
        /**
        * Iterates over own enumerable properties of an object, executing the callback for each 
        * property. The callback is bound to thisArg and invoked with three arguments; (value, key, 
        * object). Callbacks may exit iteration early by explicitly returning false.
        * @param object The object to iterate over.
        * @param callback The function called per iteration.
        * @param thisArg The this binding of callback.
        * @return object
        **/
        forOwn<T extends {}>(
            object: Dictionary<T>,
            callback?: ObjectIterator<T, void>,
            thisArg?: any): Dictionary<T>;

        /**
        * @see _.forOwn
        **/
        forOwn<T extends {}>(
            object: T,
            callback?: ObjectIterator<any, void>,
            thisArg?: any): T;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.forOwn
        **/
        forOwn<T extends {}>(
            callback: ObjectIterator<T, void>,
            thisArg?: any): _.LoDashObjectWrapper<T>;
    }

    //_.forOwnRight
    interface LoDashStatic {
        /**
        * This method is like _.forOwn except that it iterates over elements of a collection in the 
        * opposite order.
        * @param object The object to iterate over.
        * @param callback The function called per iteration.
        * @param thisArg The this binding of callback.
        * @return object
        **/
        forOwnRight<T extends {}>(
            object: Dictionary<T>,
            callback?: ObjectIterator<T, void>,
            thisArg?: any): Dictionary<T>;
        /**
        * @see _.forOwnRight
        **/
        forOwnRight<T extends {}>(
            object: T,
            callback?: ObjectIterator<any, void>,
            thisArg?: any): T;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.forOwnRight
        **/
        forOwnRight<T extends {}>(
            callback: ObjectIterator<T, void>,
            thisArg?: any): _.LoDashObjectWrapper<T>;
    }

    //_.functions
    interface LoDashStatic {
        /**
        * Creates a sorted array of property names of all enumerable properties, own and inherited, of 
        * object that have function values.
        * @param object The object to inspect.
        * @return An array of property names that have function values.
        **/
        functions(object: any): string[];

        /**
        * @see _functions
        **/
        methods(object: any): string[];
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.functions
        **/
        functions(): _.LoDashArrayWrapper<string>;

        /**
        * @see _.functions
        **/
        methods(): _.LoDashArrayWrapper<string>;
    }

    //_.has
    interface LoDashStatic {
        /**
        * Checks if the specified object property exists and is a direct property, instead of an 
        * inherited property.
        * @param object The object to check.
        * @param property The property to check for.
        * @return True if key is a direct property, else false.
        **/
        has(object: any, property: string): boolean;
    }

    //_.invert
    interface LoDashStatic {
        /**
        * Creates an object composed of the inverted keys and values of the given object.
        * @param object The object to invert.
        * @return The created inverted object.
        **/
        invert(object: any): any;
    }

    //_.isArguments
    interface LoDashStatic {
        /**
        * Checks if value is an arguments object.
        * @param value The value to check.
        * @return True if the value is an arguments object, else false.
        **/
        isArguments(value: any): boolean;
    }

    //_.isArray
    interface LoDashStatic {
        /**
        * Checks if value is an array.
        * @param value The value to check.
        * @return True if the value is an array, else false.
        **/
        isArray(value: any): boolean;
    }

    //_.isBoolean
    interface LoDashStatic {
        /**
        * Checks if value is a boolean value.
        * @param value The value to check.
        * @return True if the value is a boolean value, else false.
        **/
        isBoolean(value: any): value is boolean;
    }

    //_.isDate
    interface LoDashStatic {
        /**
        * Checks if value is a date.
        * @param value The value to check.
        * @return True if the value is a date, else false.
        **/
        isDate(value: any): value is Date;
    }

    //_.isElement
    interface LoDashStatic {
        /**
        * Checks if value is a DOM element.
        * @param value The value to check.
        * @return True if the value is a DOM element, else false.
        **/
        isElement(value: any): value is HTMLElement;
    }

    //_.isEmpty
    interface LoDashStatic {
        /**
        * Checks if value is empty. Arrays, strings, or arguments objects with a length of 0 and objects 
        * with no own enumerable properties are considered "empty".
        * @param value The value to inspect.
        * @return True if the value is empty, else false.
        **/
        isEmpty(value: any[]): boolean;

        /**
        * @see _.isEmpty
        **/
        isEmpty(value: Dictionary<any>): boolean;

        /**
        * @see _.isEmpty
        **/
        isEmpty(value: string): boolean;

        /**
        * @see _.isEmpty
        **/
        isEmpty(value: any): boolean;
    }

    //_.isEqual
    interface LoDashStatic {
        /**
        * Performs a deep comparison between two values to determine if they are equivalent to each 
        * other. If a callback is provided it will be executed to compare values. If the callback 
        * returns undefined comparisons will be handled by the method instead. The callback is bound to 
        * thisArg and invoked with two arguments; (a, b).
        * @param a The value to compare.
        * @param b The other value to compare.
        * @param callback The function to customize comparing values.
        * @param thisArg The this binding of callback.
        * @return True if the values are equivalent, else false.
        **/
        isEqual(
            a: any,
            b: any,
            callback?: (a: any, b: any) => boolean,
            thisArg?: any): boolean;
    }

    //_.isFinite
    interface LoDashStatic {
        /**
        * Checks if value is, or can be coerced to, a finite number.
        *
        * Note: This is not the same as native isFinite which will return true for booleans and empty 
        * strings. See http://es5.github.io/#x15.1.2.5.
        * @param value The value to check.
        * @return True if the value is finite, else false.
        **/
        isFinite(value: any): boolean;
    }

    //_.isFunction
    interface LoDashStatic {
        /**
        * Checks if value is a function.
        * @param value The value to check.
        * @return True if the value is a function, else false.
        **/
        isFunction(value: any): value is Function;
    }

    //_.isNaN
    interface LoDashStatic {
        /**
        * Checks if value is NaN.
        *
        * Note: This is not the same as native isNaN which will return true for undefined and other 
        * non-numeric values. See http://es5.github.io/#x15.1.2.4.
        * @param value The value to check.
        * @return True if the value is NaN, else false.
        **/
        isNaN(value: any): boolean;
    }

    //_.isNumber
    interface LoDashStatic {
        /**
        * Checks if value is a number.
        *
        * Note: NaN is considered a number. See http://es5.github.io/#x8.5.
        * @param value The value to check.
        * @return True if the value is a number, else false.
        **/
        isNumber(value: any): value is Number;
    }

    //_.isObject
    interface LoDashStatic {
        /**
        * Checks if value is the language type of Object. (e.g. arrays, functions, objects, regexes, 
        * new Number(0), and new String(''))
        * @param value The value to check.
        * @return True if the value is an object, else false.
        **/
        isObject(value: any): value is Object;
    }

    //_.isPlainObject
    interface LoDashStatic {
        /**
        * Checks if value is an object created by the Object constructor.
        * @param value The value to check.
        * @return True if value is a plain object, else false.
        **/
        isPlainObject(value: any): value is Object;
    }

    //_.isRegExp
    interface LoDashStatic {
        /**
        * Checks if value is a regular expression.
        * @param value The value to check.
        * @return True if the value is a regular expression, else false.
        **/
        isRegExp(value: any): value is RegExp;
    }

    //_.isString
    interface LoDashStatic {
        /**
        * Checks if value is a string.
        * @param value The value to check.
        * @return True if the value is a string, else false.
        **/
        isString(value: any): value is string;
    }

    //_.keys
    interface LoDashStatic {
        /**
        * Creates an array composed of the own enumerable property names of an object.
        * @param object The object to inspect.
        * @return An array of property names.
        **/
        keys(object: any): string[];
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.keys
        **/
        keys(): LoDashArrayWrapper<string>
    }

    //_.mapValues
    interface LoDashStatic {
        /**
        * Creates an object with the same keys as object and values generated by running each own
        * enumerable property of object through the callback. The callback is bound to thisArg and
        * invoked with three arguments; (value, key, object).
        *
        * If a property name is provided for callback the created "_.pluck" style callback will return
        * the property value of the given element.
        *
        * If an object is provided for callback the created "_.where" style callback will return true
        * for elements that have the properties of the given object, else false.
        *
        * @param object The object to iterate over.
        * @param callback The function called per iteration.
        * @param thisArg `this` object in `iterator`, optional.
        * @return Returns a new object with values of the results of each callback execution.
        */
        mapValues<T, TResult>(obj: Dictionary<T>, callback: ObjectIterator<T, TResult>, thisArg?: any): Dictionary<TResult>;
        mapValues<T>(obj: Dictionary<T>, where: Dictionary<T>): Dictionary<boolean>;
        mapValues<T, TMapped>(obj: T, pluck: string): TMapped;
        mapValues<T>(obj: T, callback: ObjectIterator<any, any>, thisArg?: any): T;
    }

    //_.merge
    interface LoDashStatic {
        /**
        * Recursively merges own enumerable properties of the source object(s), that don't resolve 
        * to undefined into the destination object. Subsequent sources will overwrite property 
        * assignments of previous sources. If a callback is provided it will be executed to produce 
        * the merged values of the destination and source properties. If the callback returns undefined 
        * merging will be handled by the method instead. The callback is bound to thisArg and invoked 
        * with two arguments; (objectValue, sourceValue).
        * @param object The destination object.
        * @param s1-8 The source object(s)
        * @param callback The function to customize merging properties.
        * @param thisArg The this binding of callback.
        * @return The destination object.
        **/
        merge<P, T, S1, Value, Result>(
            object: T,
            s1: S1,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): Result;

        /**
        * @see _.merge
        **/
        merge<P, T, S1, S2, Value, Result>(
            object: T,
            s1: S1,
            s2: S2,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): Result;

        /**
        * @see _.merge
        **/
        merge<P, T, S1, S2, S3, Value, Result>(
            object: T,
            s1: S1,
            s2: S2,
            s3: S3,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): Result;

        /**
        * @see _.merge
        **/
        merge<P, T, S1, S2, S3, S4, Value, Result>(
            object: T,
            s1: S1,
            s2: S2,
            s3: S3,
            s4: S4,
            callback?: (objectValue: Value, sourceValue: Value) => Value,
            thisArg?: any): Result;
    }

    //_.omit
    interface LoDashStatic {
        /**
        * Creates a shallow clone of object excluding the specified properties. Property names may be 
        * specified as individual arguments or as arrays of property names. If a callback is provided 
        * it will be executed for each property of object omitting the properties the callback returns 
        * truey for. The callback is bound to thisArg and invoked with three arguments; (value, key, 
        * object).
        * @param object The source object.
        * @param keys The properties to omit.
        * @return An object without the omitted properties.
        **/
        omit<Omitted, T>(
            object: T,
            ...keys: string[]): Omitted;

        /**
        * @see _.omit
        **/
        omit<Omitted, T>(
            object: T,
            keys: string[]): Omitted;

        /**
        * @see _.omit
        **/
        omit<Omitted, T>(
            object: T,
            callback: ObjectIterator<any, boolean>,
            thisArg?: any): Omitted;
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.omit
        **/
        omit<Omitted>(
            ...keys: string[]): LoDashObjectWrapper<Omitted>;

        /**
        * @see _.omit
        **/
        omit<Omitted>(
            keys: string[]): LoDashObjectWrapper<Omitted>;

        /**
        * @see _.omit
        **/
        omit<Omitted>(
            callback: ObjectIterator<any, boolean>,
            thisArg?: any): LoDashObjectWrapper<Omitted>;
    }

    //_.pairs
    interface LoDashStatic {
        /**
        * Creates a two dimensional array of an object’s key-value pairs, 
        * i.e. [[key1, value1], [key2, value2]].
        * @param object The object to inspect.
        * @return Aew array of key-value pairs.
        **/
        pairs(object: any): any[][];
    }

    interface LoDashObjectWrapper<T> {
        /**
        * @see _.pairs
        **/
        pairs(): LoDashArrayWrapper<any[]>;
    }

    //_.picks
    interface LoDashStatic {
        /**
        * Creates a shallow clone of object composed of the specified properties. Property names may be 
        * specified as individual arguments or as arrays of property names. If a callback is provided 
        * it will be executed for each property of object picking the properties the callback returns 
        * truey for. The callback is bound to thisArg and invoked with three arguments; (value, key, 
        * object).
        * @param object Object to strip unwanted key/value pairs.
        * @param keys Property names to pick
        * @return An object composed of the picked properties.
        **/
        pick<Picked, T>(
            object: T,
            ...keys: string[]): Picked;

        /**
        * @see _.pick
        **/
        pick<Picked, T>(
            object: T,
            keys: string[]): Picked;

        /**
        * @see _.pick
        **/
        pick<Picked, T>(
            object: T,
            callback: ObjectIterator<any, boolean>,
            thisArg?: any): Picked;
    }

    //_.transform
    interface LoDashStatic {
        /**
        * An alternative to _.reduce this method transforms object to a new accumulator object which is 
        * the result of running each of its elements through a callback, with each callback execution 
        * potentially mutating the accumulator object. The callback is bound to thisArg and invoked with 
        * four arguments; (accumulator, value, key, object). Callbacks may exit iteration early by 
        * explicitly returning false.
        * @param collection The collection to iterate over.
        * @param callback The function called per iteration.
        * @param accumulator The custom accumulator value.
        * @param thisArg The this binding of callback.
        * @return The accumulated value.
        **/
        transform<T, Acc>(
            collection: Array<T>,
            callback: MemoVoidIterator<T, Acc>,
            accumulator: Acc,
            thisArg?: any): Acc;

        /**
        * @see _.transform
        **/
        transform<T, Acc>(
            collection: List<T>,
            callback: MemoVoidIterator<T, Acc>,
            accumulator: Acc,
            thisArg?: any): Acc;

        /**
        * @see _.transform
        **/
        transform<T, Acc>(
            collection: Dictionary<T>,
            callback: MemoVoidIterator<T, Acc>,
            accumulator: Acc,
            thisArg?: any): Acc;

        /**
        * @see _.transform
        **/
        transform<T, Acc>(
            collection: Array<T>,
            callback?: MemoVoidIterator<T, Acc>,
            thisArg?: any): Acc;

        /**
        * @see _.transform
        **/
        transform<T, Acc>(
            collection: List<T>,
            callback?: MemoVoidIterator<T, Acc>,
            thisArg?: any): Acc;

        /**
        * @see _.transform
        **/
        transform<T, Acc>(
            collection: Dictionary<T>,
            callback?: MemoVoidIterator<T, Acc>,
            thisArg?: any): Acc;
    }

    //_.values
    interface LoDashStatic {
        /**
        * Creates an array composed of the own enumerable property values of object.
        * @param object The object to inspect.
        * @return Returns an array of property values.
        **/
        values(object: any): any[];
    }

    /**********
     * String *
     **********/

    interface LoDashStatic {
        camelCase(str?: string): string;
        capitalize(str?: string): string;
        deburr(str?: string): string;
        endsWith(str?: string, target?: string, position?: number): boolean;
        escape(str?: string): string;
        escapeRegExp(str?: string): string;
        kebabCase(str?: string): string;
        pad(str?: string, length?: number, chars?: string): string;
        padLeft(str?: string, length?: number, chars?: string): string;
        padRight(str?: string, length?: number, chars?: string): string;
        repeat(str?: string, n?: number): string;
        snakeCase(str?: string): string;
        startCase(str?: string): string;
        startsWith(str?: string, target?: string, position?: number): boolean;
        trim(str?: string, chars?: string): string;
        trimLeft(str?: string, chars?: string): string;
        trimRight(str?: string, chars?: string): string;
        trunc(str?: string, len?: number): string;
        trunc(str?: string, options?: { length?: number; omission?: string; separator?: string }): string;
        trunc(str?: string, options?: { length?: number; omission?: string; separator?: RegExp }): string;
        words(str?: string, pattern?: string): string[];
        words(str?: string, pattern?: RegExp): string[];
    }

    //_.parseInt
    interface LoDashStatic {
        /**
        * Converts the given value into an integer of the specified radix. If radix is undefined or 0 a 
        * radix of 10 is used unless the value is a hexadecimal, in which case a radix of 16 is used.
        *
        * Note: This method avoids differences in native ES3 and ES5 parseInt implementations. See 
        * http://es5.github.io/#E.
        * @param value The value to parse.
        * @param radix The radix used to interpret the value to parse.
        * @return The new integer value.
        **/
        parseInt(value: string, radix?: number): number;
    }

    /*************
     * Utilities *
     *************/
    //_.escape
    interface LoDashStatic {
        /**
        * Converts the characters &, <, >, ", and ' in string to their corresponding HTML entities.
        * @param string The string to escape.
        * @return The escaped string.
        **/
        escape(str: string): string;
    }

    //_.identity
    interface LoDashStatic {
        /**
        * This method returns the first argument provided to it.
        * @param value Any value.
        * @return value.
        **/
        identity<T>(value: T): T;
    }

    //_.mixin
    interface LoDashStatic {
        /**
        * Adds function properties of a source object to the lodash function and chainable wrapper.
        * @param object The object of function properties to add to lodash.
        **/
        mixin(object: Dictionary<(value: any) => any>): void;
    }

    //_.noConflict
    interface LoDashStatic {
        /**
        * Reverts the '_' variable to its previous value and returns a reference to the lodash function.
        * @return The lodash function.
        **/
        noConflict(): typeof _;
    }

    //_.property
    interface LoDashStatic {
        /**
         * # Ⓢ
         * Creates a "_.pluck" style function, which returns the key value of a given object.
         * @param key (string)
         * @return the value of that key on the object
         **/
        property<T,RT>(key: string): (obj: T) => RT;
    }

    //_.random
    interface LoDashStatic {
        /**
        * Produces a random number between min and max (inclusive). If only one argument is provided a 
        * number between 0 and the given number will be returned. If floating is truey or either min or 
        * max are floats a floating-point number will be returned instead of an integer.
        * @param max The maximum possible value.
        * @param floating Specify returning a floating-point number.
        * @return A random number.
        **/
        random(max: number, floating?: boolean): number;

        /**
        * @see _.random
        * @param min The minimum possible value.
        * @return A random number between `min` and `max`.
        **/
        random(min: number, max: number, floating?: boolean): number;
    }

    //_.result
    interface LoDashStatic {
        /**
        * Resolves the value of property on object. If property is a function it will be invoked with 
        * the this binding of object and its result returned, else the property value is returned. If 
        * object is falsey then undefined is returned.
        * @param object The object to inspect.
        * @param property The property to get the value of.
        * @return The resolved value.
        **/
        result(object: any, property: string): any;
    }

    //_.runInContext
    interface LoDashStatic {
        /**
        * Create a new lodash function using the given context object.
        * @param context The context object
        * @returns The lodash function.
        **/
        runInContext(context: any): typeof _;
    }

    //_.template
    interface LoDashStatic {
        /**
        * A micro-templating method that handles arbitrary delimiters, preserves whitespace, and 
        * correctly escapes quotes within interpolated code.
        *
        * Note: In the development build, _.template utilizes sourceURLs for easier debugging. See 
        * http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
        *
        * For more information on precompiling templates see:
        * http://lodash.com/#custom-builds
        *
        * For more information on Chrome extension sandboxes see:
        * http://developer.chrome.com/stable/extensions/sandboxingEval.html
        * @param text The template text.
        * @param data The data object used to populate the text.
        * @param options The options object.
        * @param options.escape The "escape" delimiter.
        * @param options.evaluate The "evaluate" delimiter.
        * @param options.import An object to import into the template as local variables.
        * @param options.interpolate The "interpolate" delimiter.
        * @param sourceURL The sourceURL of the template’s compiled source.
        * @param variable The data object variable name.
        * @return Returns the compiled Lo-Dash HTML template or a TemplateExecutor if no data is passed.
        **/
        template(
            text: string): TemplateExecutor;

        /**
        * @see _.template
        **/
        template(
            text: string,
            data: any,
            options?: TemplateSettings,
            sourceURL?: string,
            variable?: string): any /* string or TemplateExecutor*/;
    }

    interface TemplateExecutor {
        (...data: any[]): string;
        source: string;
    }

    //_.times
    interface LoDashStatic {
        /**
        * Executes the callback n times, returning an array of the results of each callback execution. 
        * The callback is bound to thisArg and invoked with one argument; (index).
        * @param n The number of times to execute the callback.
        * @param callback The function called per iteration.
        * @param thisArg The this binding of callback.
        **/
        times<TResult>(
            n: number,
            callback: (num: number) => TResult,
            context?: any): TResult[];
    }

    //_.unescape
    interface LoDashStatic {
        /**
        * The inverse of _.escape this method converts the HTML entities &amp;, <, &gt;, &quot;, and 
        * &#39; in string to their corresponding characters.
        * @param string The string to unescape.
        * @return The unescaped string.
        **/
        unescape(
            string: string): string;
    }

    //_.uniqueId
    interface LoDashStatic {
        /**
        * Generates a unique ID. If prefix is provided the ID will be appended to it.
        * @param prefix The value to prefix the ID with.
        * @return Returns the unique ID.
        **/
        uniqueId(prefix?: string): string;
    }
    
    //_.noop
    interface LoDashStatic {
        /**
         * A no-operation function.
         **/
        noop(): void;
    }

    //_.constant
    interface LoDashStatic {
        /**
         * Creates a function that returns value..
         **/
        constant<T>(value: T): () => T;
    }

    //_.create
    interface LoDashStatic {
        /**
         * Creates an object that inherits from the given prototype object. If a properties object is provided its own enumerable properties are assigned to the created object.
         * @param prototype The object to inherit from.
         * @param properties The properties to assign to the object.
         */
        create<T>(prototype: Object, properties?: Object): Object;
    }
    
    interface ListIterator<T, TResult> {
        (value: T, index: number, list: T[]): TResult;
    }

    interface ObjectIterator<T, TResult> {
        (element: T, key: string, list: any): TResult;
    }

    interface MemoVoidIterator<T, TResult> {
        (prev: TResult, curr: T, indexOrKey: any, list?: T[]): void;
    }
    interface MemoIterator<T, TResult> {
        (prev: TResult, curr: T, indexOrKey: any, list?: T[]): TResult;
    }
    /*
    interface MemoListIterator<T, TResult> {
        (prev: TResult, curr: T, index: number, list?: T[]): TResult;
    }
    interface MemoObjectIterator<T, TResult> {
        (prev: TResult, curr: T, index: string, object?: Dictionary<T>): TResult;
    }
    */

    //interface Collection<T> {}

    // Common interface between Arrays and jQuery objects
    interface List<T> {
        [index: number]: T;
        length: number;
    }

    interface Dictionary<T> {
        [index: string]: T;
    }
}

declare module "lodash" {
    export = _;
}

// Type definitions for d3JS
// Project: http://d3js.org/
// Definitions by: Boris Yankov <https://github.com/borisyankov>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module D3 {
    export interface Selectors {
        /**
        * Select an element from the current document
        */
        select: {
            /**
            * Selects the first element that matches the specified selector string
            *
            * @param selector Selection String to match
            */
            (selector: string): Selection;
            /**
            * Selects the specified node
            *
            * @param element Node element to select
            */
            (element: EventTarget): Selection;
        };

        /**
        * Select multiple elements from the current document
        */
        selectAll: {
            /**
            * Selects all elements that match the specified selector
            *
            * @param selector Selection String to match
            */
            (selector: string): Selection;
            /**
            * Selects the specified array of elements
            *
            * @param elements Array of node elements to select
            */
            (elements: EventTarget[]): Selection;
        };
    }

    export interface D3Event extends Event{
        dx: number;
        dy: number;
        clientX: number;
        clientY: number;
        translate: number[];
        scale: number;
        sourceEvent: D3Event;
        x: number;
        y: number;
        keyCode: number;
        altKey: any;
        ctrlKey: any;
        shiftKey: any;
        type: string;
    }

    export interface Base extends Selectors {
        /**
        * Create a behavior
        */
        behavior: Behavior.Behavior;
        /**
        * Access the current user event for interaction
        */
        event: D3Event;

        /**
        * Compare two values for sorting.
        * Returns -1 if a is less than b, or 1 if a is greater than b, or 0
        *
        * @param a First value
        * @param b Second value
        */
        ascending<T>(a: T, b: T): number;
        /**
        * Compare two values for sorting.
        * Returns -1 if a is greater than b, or 1 if a is less than b, or 0
        *
        * @param a First value
        * @param b Second value
        */
        descending<T>(a: T, b: T): number;
        /**
        * Find the minimum value in an array
        *
        * @param arr Array to search
        * @param map Accsessor function
        */
        min<T, U>(arr: T[], map: (v?: T, i?: number) => U): U;
        /**
        * Find the minimum value in an array
        *
        * @param arr Array to search
        */
        min<T>(arr: T[]): T;
        /**
        * Find the maximum value in an array
        *
        * @param arr Array to search
        * @param map Accsessor function
        */
        max<T, U>(arr: T[], map: (v?: T, i?: number) => U): U;
        /**
        * Find the maximum value in an array
        *
        * @param arr Array to search
        */
        max<T>(arr: T[]): T;
        /**
        * Find the minimum and maximum value in an array
        *
        * @param arr Array to search
        * @param map Accsessor function
        */
        extent<T, U>(arr: T[], map: (v: T) => U): U[];
        /**
        * Find the minimum and maximum value in an array
        *
        * @param arr Array to search
        */
        extent<T>(arr: T[]): T[];
        /**
        * Compute the sum of an array of numbers
        *
        * @param arr Array to search
        * @param map Accsessor function
        */
        sum<T>(arr: T[], map: (v: T) => number): number;
        /**
        * Compute the sum of an array of numbers
        *
        * @param arr Array to search
        */
        sum(arr: number[]): number;
        /**
        * Compute the arithmetic mean of an array of numbers
        *
        * @param arr Array to search
        * @param map Accsessor function
        */
        mean<T>(arr: T[], map: (v: T) => number): number;
        /**
        * Compute the arithmetic mean of an array of numbers
        *
        * @param arr Array to search
        */
        mean(arr: number[]): number;
        /**
        * Compute the median of an array of numbers (the 0.5-quantile).
        *
        * @param arr Array to search
        * @param map Accsessor function
        */
        median<T>(arr: T[], map: (v: T) => number): number;
        /**
        * Compute the median of an array of numbers (the 0.5-quantile).
        *
        * @param arr Array to search
        */
        median(arr: number[]): number;
        /**
        * Compute a quantile for a sorted array of numbers.
        *
        * @param arr Array to search
        * @param p The quantile to return
        */
        quantile: (arr: number[], p: number) => number;
        /**
        * Locate the insertion point for x in array to maintain sorted order
        *
        * @param arr Array to search
        * @param x Value to search for insertion point
        * @param low Minimum value of array subset
        * @param hihg Maximum value of array subset
        */
        bisect<T>(arr: T[], x: T, low?: number, high?: number): number;
        /**
        * Locate the insertion point for x in array to maintain sorted order
        *
        * @param arr Array to search
        * @param x Value to serch for insertion point
        * @param low Minimum value of array subset
        * @param high Maximum value of array subset
        */
        bisectLeft<T>(arr: T[], x: T, low?: number, high?: number): number;
        /**
        * Locate the insertion point for x in array to maintain sorted order
        *
        * @param arr Array to search
        * @param x Value to serch for insertion point
        * @param low Minimum value of array subset
        * @param high Maximum value of array subset
        */
        bisectRight<T>(arr: T[], x: T, low?: number, high?: number): number;
        /**
        * Bisect using an accessor.
        *
        * @param accessor Accessor function
        */
        bisector(accessor: (data: any, index: number) => any): any;
        /**
        * Randomize the order of an array.
        *
        * @param arr Array to randomize
        */
        shuffle<T>(arr: T[]): T[];
        /**
        * Reorder an array of elements according to an array of indexes
        *
        * @param arr Array to reorder
        * @param indexes Array containing the order the elements should be returned in
        */
        permute(arr: any[], indexes: any[]): any[];
        /**
        * Transpose a variable number of arrays.
        *
        * @param arrs Arrays to transpose
        */
        zip(...arrs: any[]): any[];
        /**
        * Parse the given 2D affine transform string, as defined by SVG's transform attribute.
        *
        * @param definition 2D affine transform string
        */
        transform(definition: string): any;
        /**
        * Transpose an array of arrays.
        *
        * @param matrix Two dimensional array to transpose
        */
        transpose(matrix: any[]): any[];
        /**
        * Creates an array containing tuples of adjacent pairs
        *
        * @param arr An array containing entries to pair
        * @returns any[][] An array of 2-element tuples for each pair
        */
        pairs(arr: any[]): any[][];
        /**
        * List the keys of an associative array.
        *
        * @param map Array of objects to get the key values from
        */
        keys(map: any): string[];
        /**
        * List the values of an associative array.
        *
        * @param map Array of objects to get the values from
        */
        values(map: any): any[];
        /**
        * List the key-value entries of an associative array.
        *
        * @param map Array of objects to get the key-value pairs from
        */
        entries(map: any): any[];
        /**
        * merge multiple arrays into one array
        *
        * @param map Arrays to merge
        */
        merge(...map: any[]): any[];
        /**
        * Generate a range of numeric values.
        */
        range: {
            /**
            * Generate a range of numeric values from 0.
            *
            * @param stop Value to generate the range to
            * @param step Step between each value
            */
            (stop: number, step?: number): number[];
            /**
            * Generate a range of numeric values.
            *
            * @param start Value to start
            * @param stop Value to generate the range to
            * @param step Step between each value
            */
            (start: number, stop?: number, step?: number): number[];
        };
        /**
        * Create new nest operator
        */
        nest(): Nest;
        /**
        * Request a resource using XMLHttpRequest.
        */
        xhr: {
            /**
            * Creates an asynchronous request for specified url
            *
            * @param url Url to request
            * @param callback Function to invoke when resource is loaded or the request fails
            */
            (url: string, callback?: (xhr: XMLHttpRequest) => void ): Xhr;
            /**
            * Creates an asynchronous request for specified url
            *
            * @param url Url to request
            * @param mime MIME type to request
            * @param callback Function to invoke when resource is loaded or the request fails
            */
            (url: string, mime: string, callback?: (xhr: XMLHttpRequest) => void ): Xhr;
        };
        /**
        * Request a text file
        */
        text: {
            /**
            * Request a text file
            *
            * @param url Url to request
            * @param callback Function to invoke when resource is loaded or the request fails
            */
            (url: string, callback?: (response: string) => void ): Xhr;
            /**
            * Request a text file
            *
            * @param url Url to request
            * @param mime MIME type to request
            * @param callback Function to invoke when resource is loaded or the request fails
            */
            (url: string, mime: string, callback?: (response: string) => void ): Xhr;
        };
        /**
        * Request a JSON blob
        *
        * @param url Url to request
        * @param callback Function to invoke when resource is loaded or the request fails
        */
        json: (url: string, callback?: (error: any, data: any) => void ) => Xhr;
        /**
        * Request an HTML document fragment.
        */
        xml: {
            /**
            * Request an HTML document fragment.
            *
            * @param url Url to request
            * @param callback Function to invoke when resource is loaded or the request fails
            */
            (url: string, callback?: (response: Document) => void ): Xhr;
            /**
            * Request an HTML document fragment.
            *
            * @param url Url to request
            * @param mime MIME type to request
            * @param callback Function to invoke when resource is loaded or the request fails
            */
            (url: string, mime: string, callback?: (response: Document) => void ): Xhr;
        };
        /**
        * Request an XML document fragment.
        *
        * @param url Url to request
        * @param callback Function to invoke when resource is loaded or the request fails
        */
        html: (url: string, callback?: (response: DocumentFragment) => void ) => Xhr;
        /**
        * Request a comma-separated values (CSV) file.
        */
        csv: Dsv;
        /**
        * Request a tab-separated values (TSV) file
        */
        tsv: Dsv;
        /**
        * Time Functions
        */
        time: Time.Time;
        /**
        * Scales
        */
        scale: Scale.ScaleBase;
        /*
        * Interpolate two values
        */
        interpolate: Transition.BaseInterpolate;
        /*
        * Interpolate two numbers
        */
        interpolateNumber: Transition.BaseInterpolate;
        /*
        * Interpolate two integers
        */
        interpolateRound: Transition.BaseInterpolate;
        /*
        * Interpolate two strings
        */
        interpolateString: Transition.BaseInterpolate;
        /*
        * Interpolate two RGB colors
        */
        interpolateRgb: Transition.BaseInterpolate;
        /*
        * Interpolate two HSL colors
        */
        interpolateHsl: Transition.BaseInterpolate;
        /*
        * Interpolate two HCL colors
        */
        interpolateHcl: Transition.BaseInterpolate;
        /*
        * Interpolate two L*a*b* colors
        */
        interpolateLab: Transition.BaseInterpolate;
        /*
        * Interpolate two arrays of values
        */
        interpolateArray: Transition.BaseInterpolate;
        /*
        * Interpolate two arbitary objects
        */
        interpolateObject: Transition.BaseInterpolate;
        /*
        * Interpolate two 2D matrix transforms
        */
        interpolateTransform: Transition.BaseInterpolate;
        /*
        * The array of built-in interpolator factories
        */
        interpolators: Transition.InterpolateFactory[];
        /**
        * Layouts
        */
        layout: Layout.Layout;
        /**
        * Svg's
        */
        svg: Svg.Svg;
        /**
        * Random number generators
        */
        random: Random;
        /**
        * Create a function to format a number as a string
        *
        * @param specifier The format specifier to use
        */
        format(specifier: string): (value: number) => string;
        /**
        * Returns the SI prefix for the specified value at the specified precision
        */
        formatPrefix(value: number, precision?: number): MetricPrefix;
        /**
        * The version of the d3 library
        */
        version: string;
        /**
        * Returns the root selection
        */
        selection(): Selection;
        ns: {
            /**
            * The map of registered namespace prefixes
            */
            prefix: {
                svg: string;
                xhtml: string;
                xlink: string;
                xml: string;
                xmlns: string;
            };
            /**
            * Qualifies the specified name
            */
            qualify(name: string): { space: string; local: string; };
        };
        /**
        * Returns a built-in easing function of the specified type
        */
        ease: (type: string, ...arrs: any[]) => D3.Transition.Transition;
        /**
        * Constructs a new RGB color.
        */
        rgb: {
            /**
            * Constructs a new RGB color with the specified r, g and b channel values
            */
            (r: number, g: number, b: number): D3.Color.RGBColor;
            /**
            * Constructs a new RGB color by parsing the specified color string
            */
            (color: string): D3.Color.RGBColor;
        };
        /**
        * Constructs a new HCL color.
        */
        hcl: {
            /**
            * Constructs a new HCL color.
            */
            (h: number, c: number, l: number): Color.HCLColor;
            /**
            * Constructs a new HCL color by parsing the specified color string
            */
            (color: string): Color.HCLColor;
        };
        /**
        * Constructs a new HSL color.
        */
        hsl: {
            /**
            * Constructs a new HSL color with the specified hue h, saturation s and lightness l
            */
            (h: number, s: number, l: number): Color.HSLColor;
            /**
            * Constructs a new HSL color by parsing the specified color string
            */
            (color: string): Color.HSLColor;
        };
        /**
        * Constructs a new RGB color.
        */
        lab: {
            /**
            * Constructs a new LAB color.
            */
            (l: number, a: number, b: number): Color.LABColor;
            /**
            * Constructs a new LAB color by parsing the specified color string
            */
            (color: string): Color.LABColor;
        };
        geo: Geo.Geo;
        geom: Geom.Geom;
        /**
        * gets the mouse position relative to a specified container.
        */
        mouse(container: any): number[];
        /**
        * gets the touch positions relative to a specified container.
        */
        touches(container: any): number[][];

        /**
        * If the specified value is a function, returns the specified value.
        * Otherwise, returns a function that returns the specified value.
        */
        functor<R,T>(value: (p : R) => T): (p : R) => T;
        functor<T>(value: T): (p : any) => T;

        map(): Map<any>;
        set(): Set<any>;
        map<T>(object: {[key: string]: T; }): Map<T>;
        set<T>(array: T[]): Set<T>;
        dispatch(...types: string[]): Dispatch;
        rebind(target: any, source: any, ...names: any[]): any;
        requote(str: string): string;
        timer: {
            (funct: () => boolean, delay?: number, mark?: number): void;
            flush(): void;
        }
        transition(): Transition.Transition;

        round(x: number, n: number): number;
    }

    export interface Dispatch {
        [event: string]: any;
        on: {
            (type: string): any;
            (type: string, listener: any): any;
        }
    }

    export interface MetricPrefix {
        /**
        * the scale function, for converting numbers to the appropriate prefixed scale.
        */
        scale: (d: number) => number;
        /**
        * the prefix symbol
        */
        symbol: string;
    }

    export interface Xhr {
        /**
        * Get or set request header
        */
        header: {
            /**
            * Get the value of specified request header
            *
            * @param name Name of header to get the value for
            */
            (name: string): string;
            /**
            * Set the value of specified request header
            *
            * @param name Name of header to set the value for
            * @param value Value to set the header to
            */
            (name: string, value: string): Xhr;
        };
        /**
        * Get or set MIME Type
        */
        mimeType: {
            /**
            * Get the current MIME Type
            */
            (): string;
            /**
            * Set the MIME Type for the request
            *
            * @param type The MIME type for the request
            */
            (type: string): Xhr;
        };
        /*
        * Get or Set the function used to map the response to the associated data value
        */
        response: {
            /**
            * Get function used to map the response to the associated data value
            */
            (): (xhr: XMLHttpRequest) => any;
            /**
            * Set function used to map the response to the associated data value
            *
            * @param value The function used to map the response to a data value
            */
            (value: (xhr: XMLHttpRequest) => any): Xhr;
        };
        /**
        * Issue the request using the GET method
        *
        * @param callback Function to invoke on completion of request
        */
        get(callback?: (xhr: XMLHttpRequest) => void ): Xhr;
        /**
        * Issue the request using the POST method
        */
        post: {
            /**
            * Issue the request using the POST method
            *
            * @param callback Function to invoke on completion of request
            */
            (callback?: (xhr: XMLHttpRequest) => void ): Xhr;
            /**
            * Issue the request using the POST method
            *
            * @param data Data to post back in the request
            * @param callback Function to invoke on completion of request
            */
            (data: any, callback?: (xhr: XMLHttpRequest) => void ): Xhr;
        };
        /**
        * Issues this request using the specified method
        */
        send: {
            /**
            * Issues this request using the specified method
            *
            * @param method Method to use to make the request
            * @param callback Function to invoke on completion of request
            */
            (method: string, callback?: (xhr: XMLHttpRequest) => void ): Xhr;
            /**
            * Issues this request using the specified method
            *
            * @param method Method to use to make the request
            * @param data Data to post back in the request
            * @param callback Function to invoke on completion of request
            */
            (method: string, data: any, callback?: (xhr: XMLHttpRequest) => void ): Xhr;
        };
        /**
        * Aborts this request, if it is currently in-flight
        */
        abort(): Xhr;
        /**
        * Registers a listener to receive events
        *
        * @param type Enent name to attach the listener to
        * @param listener Function to attach to event
        */
        on: (type: string, listener: (data: any, index?: number) => any) => Xhr;
    }

    export interface Dsv {
        /**
        * Request a delimited values file
        *
        * @param url Url to request
        * @param callback Function to invoke when resource is loaded or the request fails
        */
        (url: string, callback?: (error: any, response: any[]) => void ): Xhr;
        /**
        * Parse a delimited string into objects using the header row.
        *
        * @param string delimited formatted string to parse
        */
        parse(string: string): any[];
        /**
        * Parse a delimited string into tuples, ignoring the header row.
        *
        * @param string delimited formatted string to parse
        */
        parseRows(string: string, accessor: (row: any[], index: number) => any): any;
        /**
        * Format an array of tuples into a delimited string.
        *
        * @param rows Array to convert to a delimited string
        */
        format(rows: any[]): string;
    }

    export interface Selection extends Selectors, Array<any> {
        attr: {
            (name: string): string;
            (name: string, value: any): Selection;
            (name: string, valueFunction: (data: any, index: number) => any): Selection;
            (attrValueMap : Object): Selection;
        };

        classed: {
            (name: string): string;
            (name: string, value: any): Selection;
            (name: string, valueFunction: (data: any, index: number) => any): Selection;
            (classValueMap: Object): Selection;
        };

        style: {
            (name: string): string;
            (name: string, value: any, priority?: string): Selection;
            (name: string, valueFunction: (data: any, index: number) => any, priority?: string): Selection;
            (styleValueMap : Object): Selection;
        };

        property: {
            (name: string): void;
            (name: string, value: any): Selection;
            (name: string, valueFunction: (data: any, index: number) => any): Selection;
            (propertyValueMap : Object): Selection;
        };

        text: {
            (): string;
            (value: any): Selection;
            (valueFunction: (data: any, index: number) => any): Selection;
        };

        html: {
            (): string;
            (value: any): Selection;
            (valueFunction: (data: any, index: number) => any): Selection;
        };

        append: (name: string) => Selection;
        insert: (name: string, before: string) => Selection;
        remove: () => Selection;
        empty: () => boolean;

        data: {
            (values: (data: any, index?: number) => any[], key?: (data: any, index?: number) => any): UpdateSelection;
            (values: any[], key?: (data: any, index?: number) => any): UpdateSelection;
            (): any[];
        };

        datum: {
            (values: (data: any, index: number) => any): UpdateSelection;
            (values: any): UpdateSelection;
            () : any;
        };

        filter: {
            (filter: (data: any, index: number) => boolean, thisArg?: any): UpdateSelection;
            (filter: string): UpdateSelection;
        };

        call(callback: (selection: Selection, ...args: any[]) => void, ...args: any[]): Selection;
        each(eachFunction: (data: any, index: number) => any): Selection;
        on: {
            (type: string): (data: any, index: number) => any;
            (type: string, listener: (data: any, index: number) => any, capture?: boolean): Selection;
        };

        /**
        * Returns the total number of elements in the current selection.
        */
        size(): number;

        /**
        * Starts a transition for the current selection. Transitions behave much like selections,
        * except operators animate smoothly over time rather than applying instantaneously.
        */
        transition(): Transition.Transition;

        /**
         * Interrupts the active transition of the provided name. Does not cancel scheduled transitions.
         * @param name the transition name (defaults to "")
         */
        interrupt(name?: string): Selection;

        /**
        * Sorts the elements in the current selection according to the specified comparator
        * function.
        *
        * @param comparator a comparison function, which will be passed two data elements a and b
        * to compare, and should return either a negative, positive, or zero value to indicate
        * their relative order.
        */
        sort<T>(comparator?: (a: T, b: T) => number): Selection;

        /**
        * Re-inserts elements into the document such that the document order matches the selection
        * order. This is equivalent to calling sort() if the data is already sorted, but much
        * faster.
        */
        order: () => Selection;

        /**
        * Returns the first non-null element in the current selection. If the selection is empty,
        * returns null.
        */
        node: <T extends Element>() => T;
    }

    export interface EnterSelection {
        append: (name: string) => Selection;
        insert: (name: string, before?: string) => Selection;
        select: (selector: string) => Selection;
        empty: () => boolean;
        node: () => Element;
        call: (callback: (selection: EnterSelection) => void) => EnterSelection;
        size: () => number;
    }

    export interface UpdateSelection extends Selection {
        enter: () => EnterSelection;
        update: () => Selection;
        exit: () => Selection;
    }

    export interface NestKeyValue {
        key: string;
        values: any;
    }

    export interface Nest {
        key(keyFunction: (data: any, index: number) => string): Nest;
        sortKeys(comparator: (d1: any, d2: any) => number): Nest;
        sortValues(comparator: (d1: any, d2: any) => number): Nest;
        rollup(rollupFunction: (data: any, index: number) => any): Nest;
        map(values: any[]): any;
        entries(values: any[]): NestKeyValue[];
    }

    export interface MapKeyValue<T> {
        key: string;
        value: T;
    }

    export interface Map<T> {
        has(key: string): boolean;
        get(key: string): T;
        set(key: string, value: T): T;
        remove(key: string): boolean;
        keys(): string[];
        values(): T[];
        entries(): MapKeyValue<T>[];
        forEach(func: (key: string, value: T) => void ): void;
        empty(): boolean;
        size(): number;
    }

    export interface Set<T> {
        has(value: T): boolean;
        add(value: T): T;
        remove(value: T): boolean;
        values(): string[];
        forEach(func: (value: string) => void ): void;
        empty(): boolean;
        size(): number;
    }

    export interface Random {
        /**
        * Returns a function for generating random numbers with a normal distribution
        *
        * @param mean The expected value of the generated pseudorandom numbers
        * @param deviation The given standard deviation
        */
        normal(mean?: number, deviation?: number): () => number;
        /**
        * Returns a function for generating random numbers with a log-normal distribution
        *
        * @param mean The expected value of the generated pseudorandom numbers
        * @param deviation The given standard deviation
        */
        logNormal(mean?: number, deviation?: number): () => number;
        /**
        * Returns a function for generating random numbers with an Irwin-Hall distribution
        *
        * @param count The number of independent variables
        */
        irwinHall(count: number): () => number;
    }

    // Transitions
    export module Transition {
        export interface Transition {
            duration: {
                (duration: number): Transition;
                (duration: (data: any, index: number) => any): Transition;
            };
            delay: {
                (delay: number): Transition;
                (delay: (data: any, index: number) => any): Transition;
            };
            attr: {
                (name: string): string;
                (name: string, value: any): Transition;
                (name: string, valueFunction: (data: any, index: number) => any): Transition;
                (attrValueMap : any): Transition;
            };
            style: {
                (name: string): string;
                (name: string, value: any, priority?: string): Transition;
                (name: string, valueFunction: (data: any, index: number) => any, priority?: string): Transition;
                (styleValueMap : Object): Transition;
            };
            call(callback: (selection: Selection) => void): Transition;
            call(callback: (selection: any, anything: any) => void, ...arguments: any[]): Transition;
            /**
            * Select an element from the current document
            */
            select: {
                /**
                * Selects the first element that matches the specified selector string
                *
                * @param selector Selection String to match
                */
                (selector: string): Transition;
                /**
                * Selects the specified node
                *
                * @param element Node element to select
                */
                (element: EventTarget): Transition;
            };

            /**
            * Select multiple elements from the current document
            */
            selectAll: {
                /**
                * Selects all elements that match the specified selector
                *
                * @param selector Selection String to match
                */
                (selector: string): Transition;
                /**
                * Selects the specified array of elements
                *
                * @param elements Array of node elements to select
                */
                (elements: EventTarget[]): Transition;
            }
            each: (type?: string, eachFunction?: (data: any, index: number) => any) => Transition;
            transition: () => Transition;
            ease: (value: string, ...arrs: any[]) => Transition;
            attrTween(name: string, tween: (d: any, i: number, a: any) => BaseInterpolate): Transition;
            styleTween(name: string, tween: (d: any, i: number, a: any) => BaseInterpolate, priority?: string): Transition;
            text: {
                (text: string): Transition;
                (text: (d: any, i: number) => string): Transition;
            }
            tween(name: string, factory: InterpolateFactory): Transition;
            filter: {
                (selector: string): Transition;
                (selector: (data: any, index: number) => boolean): Transition;
            };
            remove(): Transition;
        }

        export interface InterpolateFactory {
            (a?: any, b?: any): BaseInterpolate;
        }

        export interface BaseInterpolate {
            (a: any, b?: any): any;
        }

        export interface Interpolate {
            (t: any): any;
        }
    }

    //Time
    export module Time {
        export interface Time {
            second: Interval;
            minute: Interval;
            hour: Interval;
            day: Interval;
            week: Interval;
            sunday: Interval;
            monday: Interval;
            tuesday: Interval;
            wednesday: Interval;
            thursday: Interval;
            friday: Interval;
            saturday: Interval;
            month: Interval;
            year: Interval;

            seconds: Range;
            minutes: Range;
            hours: Range;
            days: Range;
            weeks: Range;
            months: Range;
            years: Range;

            sundays: Range;
            mondays: Range;
            tuesdays: Range;
            wednesdays: Range;
            thursdays: Range;
            fridays: Range;
            saturdays: Range;
            format: {
                /**
                 * Constructs a new local time formatter using the given specifier.
                 */
                (specifier: string): TimeFormat;
                /**
                 * Returns a new multi-resolution time format given the specified array of predicated formats.
                 */
                multi: (formats: any[][]) => TimeFormat;

                utc: {
                    /**
                     * Constructs a new local time formatter using the given specifier.
                     */
                    (specifier: string): TimeFormat;
                    /**
                     * Returns a new multi-resolution UTC time format given the specified array of predicated formats.
                     */
                    multi: (formats: any[][]) => TimeFormat;
                };

                /**
                 * The full ISO 8601 UTC time format: "%Y-%m-%dT%H:%M:%S.%LZ".
                 */
                iso: TimeFormat;
            };

            scale: {
                /**
                * Constructs a new time scale with the default domain and range;
                * the ticks and tick format are configured for local time.
                */
                (): Scale.TimeScale;
                /**
                * Constructs a new time scale with the default domain and range;
                * the ticks and tick format are configured for UTC time.
                */
                utc(): Scale.TimeScale;
            };
        }

        export interface Range {
            (start: Date, end: Date, step?: number): Date[];
        }

        export interface Interval {
            (date: Date): Date;
            floor: (date: Date) => Date;
            round: (date: Date) => Date;
            ceil: (date: Date) => Date;
            range: Range;
            offset: (date: Date, step: number) => Date;
            utc?: Interval;
        }

        export interface TimeFormat {
            (date: Date): string;
            parse: (string: string) => Date;
        }
    }

    // Layout
    export module Layout {
        export interface Layout {
            /**
            * Creates a new Stack layout
            */
            stack(): StackLayout;
            /**
            * Creates a new pie layout
            */
            pie(): PieLayout;
            /**
            * Creates a new force layout
            */
            force(): ForceLayout;
            /**
            * Creates a new tree layout
            */
            tree(): TreeLayout;
            bundle(): BundleLayout;
            chord(): ChordLayout;
            cluster(): ClusterLayout;
            hierarchy(): HierarchyLayout;
            histogram(): HistogramLayout;
            pack(): PackLayout;
            partition(): PartitionLayout;
            treemap(): TreeMapLayout;
        }

        export interface StackLayout {
            <T>(layers: T[], index?: number): T[];
            values(accessor?: (d: any) => any): StackLayout;
            offset(offset: string): StackLayout;
            x(accessor: (d: any, i: number) => any): StackLayout;
            y(accessor: (d: any, i: number) => any): StackLayout;
            out(setter: (d: any, y0: number, y: number) => void): StackLayout;
        }

        export interface TreeLayout {
            /**
            * Gets or sets the sort order of sibling nodes for the layout using the specified comparator function
            */
            sort: {
                /**
                * Gets the sort order function of sibling nodes for the layout
                */
                (): (d1: any, d2: any) => number;
                /**
                * Sets the sort order of sibling nodes for the layout using the specified comparator function
                */
                (comparator: (d1: any, d2: any) => number): TreeLayout;
            };
            /**
            * Gets or sets the specified children accessor function
            */
            children: {
                /**
                * Gets the children accessor function
                */
                (): (d: any) => any;
                /**
                * Sets the specified children accessor function
                */
                (children: (d: any) => any): TreeLayout;
            };
            /**
            * Runs the tree layout
            */
            nodes(root: GraphNode): GraphNode[];
            /**
            * Given the specified array of nodes, such as those returned by nodes, returns an array of objects representing the links from parent to child for each node
            */
            links(nodes: GraphNode[]): GraphLink[];
            /**
            * If separation is specified, uses the specified function to compute separation between neighboring nodes. If separation is not specified, returns the current separation function
            */
            seperation: {
                /**
                * Gets the current separation function
                */
                (): (a: GraphNode, b: GraphNode) => number;
                /**
                * Sets the specified function to compute separation between neighboring nodes
                */
                (seperation: (a: GraphNode, b: GraphNode) => number): TreeLayout;
            };
            /**
            * Gets or sets the available layout size
            */
            size: {
                /**
                * Gets the available layout size
                */
                (): number[];
                /**
                * Sets the available layout size
                */
                (size: number[]): TreeLayout;
            };
            /**
            * Gets or sets the available node size
            */
            nodeSize: {
                /**
                * Gets the available node size
                */
                (): number[];
                /**
                * Sets the available node size
                */
                (size: number[]): TreeLayout;
            };
        }

        export interface PieLayout {
            (values: any[], index?: number): ArcDescriptor[];
            value: {
                (): (d: any, index: number) => number;
                (accessor: (d: any, index: number) => number): PieLayout;
            };
            sort: {
                (): (d1: any, d2: any) => number;
                (comparator: (d1: any, d2: any) => number): PieLayout;
            };
            startAngle: {
                (): number;
                (angle: number): PieLayout;
                (angle: () => number): PieLayout;
                (angle: (d : any) => number): PieLayout;
                (angle: (d : any, i: number) => number): PieLayout;
            };
            endAngle: {
                (): number;
                (angle: number): PieLayout;
                (angle: () => number): PieLayout;
                (angle: (d : any) => number): PieLayout
                (angle: (d : any, i: number) => number): PieLayout;
            };
        }

        export interface ArcDescriptor {
            value: any;
            data: any;
            startAngle: number;
            endAngle: number;
            index: number;
        }

        export interface GraphNode {
            id?: number;
            index?: number;
            name: string;
            dx?: number;
            dy?: number;
            px?: number;
            py?: number;
            size?: number;
            weight?: number;
            x?: number;
            y?: number;
            subindex?: number;
            startAngle?: number;
            endAngle?: number;
            value?: number;
            fixed?: boolean;
            children?: GraphNode[];
            _children?: GraphNode[];
            parent?: GraphNode;
            depth?: number;
        }

        export interface GraphLink {
            source: GraphNode;
            target: GraphNode;
        }

        export interface GraphNodeForce {
            index?: number;
            x?: number;
            y?: number;
            px?: number;
            py?: number;
            fixed?: boolean;
            weight?: number;
        }

        export interface GraphLinkForce {
            source: GraphNodeForce;
            target: GraphNodeForce;
        }

        export interface ForceLayout {
            (): ForceLayout;
            size: {
                (): number;
                (mysize: number[]): ForceLayout;
                (accessor: (d: any, index: number) => {}): ForceLayout;

            };
            linkDistance: {
                (): number;
                (number:number): ForceLayout;
                (accessor: (d: any, index: number) => number): ForceLayout;
            };
            linkStrength:
            {
                (): number;
                (number:number): ForceLayout;
                (accessor: (d: any, index: number) => number): ForceLayout;
            };
            friction:
            {
                (): number;
                (number:number): ForceLayout;
                (accessor: (d: any, index: number) => number): ForceLayout;
            };
            alpha: {
                (): number;
                (number:number): ForceLayout;
                (accessor: (d: any, index: number) => number): ForceLayout;
            };
            charge: {
                (): number;
                (number:number): ForceLayout;
                (accessor: (d: any, index: number) => number): ForceLayout;
            };

            theta: {
                (): number;
                (number:number): ForceLayout;
                (accessor: (d: any, index: number) => number): ForceLayout;
            };

            gravity: {
                (): number;
                (number:number): ForceLayout;
                (accessor: (d: any, index: number) => number): ForceLayout;
            };

            links: {
                (): GraphLinkForce[];
                (arLinks: GraphLinkForce[]): ForceLayout;

            };
            nodes:
            {
                (): GraphNodeForce[];
                (arNodes: GraphNodeForce[]): ForceLayout;

            };
            start(): ForceLayout;
            resume(): ForceLayout;
            stop(): ForceLayout;
            tick(): ForceLayout;
            on(type: string, listener: () => void ): ForceLayout;
            drag(): ForceLayout;
        }

        export interface BundleLayout{
            (links: GraphLink[]): GraphNode[][];
        }

        export interface ChordLayout {
            matrix: {
                (): number[][];
                (matrix: number[][]): ChordLayout;
            }
            padding: {
                (): number;
                (padding: number): ChordLayout;
            }
            sortGroups: {
                (): (a: number, b: number) => number;
                (comparator: (a: number, b: number) => number): ChordLayout;
            }
            sortSubgroups: {
                (): (a: number, b: number) => number;
                (comparator: (a: number, b: number) => number): ChordLayout;
            }
            sortChords: {
                (): (a: number, b: number) => number;
                (comparator: (a: number, b: number) => number): ChordLayout;
            }
            chords(): GraphLink[];
            groups(): ArcDescriptor[];
        }

        export interface ClusterLayout{
            sort: {
                (): (a: GraphNode, b: GraphNode) => number;
                (comparator: (a: GraphNode, b: GraphNode) => number): ClusterLayout;
            }
            children: {
                (): (d: any, i?: number) => GraphNode[];
                (children: (d: any, i?: number) => GraphNode[]): ClusterLayout;
            }
            nodes(root: GraphNode): GraphNode[];
            links(nodes: GraphNode[]): GraphLink[];
            seperation: {
                (): (a: GraphNode, b: GraphNode) => number;
                (seperation: (a: GraphNode, b: GraphNode) => number): ClusterLayout;
            }
            size: {
                (): number[];
                (size: number[]): ClusterLayout;
            }
            value: {
                (): (node: GraphNode) => number;
                (value: (node: GraphNode) => number): ClusterLayout;
            }
        }

        export interface HierarchyLayout {
            sort: {
                (): (a: GraphNode, b: GraphNode) => number;
                (comparator: (a: GraphNode, b: GraphNode) => number): HierarchyLayout;
            }
            children: {
                (): (d: any, i?: number) => GraphNode[];
                (children: (d: any, i?: number) => GraphNode[]): HierarchyLayout;
            }
            nodes(root: GraphNode): GraphNode[];
            links(nodes: GraphNode[]): GraphLink[];
            value: {
                (): (node: GraphNode) => number;
                (value: (node: GraphNode) => number): HierarchyLayout;
            }
            reValue(root: GraphNode): HierarchyLayout;
        }

        export interface Bin extends Array<any> {
            x: number;
            dx: number;
            y: number;
        }

        export interface HistogramLayout {
            (values: any[], index?: number): Bin[];
            value: {
                (): (value: any) => any;
                (accessor: (value: any) => any): HistogramLayout
            }
            range: {
                (): (value: any, index: number) => number[];
                (range: (value: any, index: number) => number[]): HistogramLayout;
                (range: number[]): HistogramLayout;
            }
            bins: {
                (): (range: any[], index: number) => number[];
                (bins: (range: any[], index: number) => number[]): HistogramLayout;
                (bins: number): HistogramLayout;
                (bins: number[]): HistogramLayout;
            }
            frequency: {
                (): boolean;
                (frequency: boolean): HistogramLayout;
            }
        }

        export interface PackLayout {
            sort: {
                (): (a: GraphNode, b: GraphNode) => number;
                (comparator: (a: GraphNode, b: GraphNode) => number): PackLayout;
            }
            children: {
                (): (d: any, i?: number) => GraphNode[];
                (children: (d: any, i?: number) => GraphNode[]): PackLayout;
            }
            nodes(root: GraphNode): GraphNode[];
            links(nodes: GraphNode[]): GraphLink[];
            value: {
                (): (node: GraphNode) => number;
                (value: (node: GraphNode) => number): PackLayout;
            }
            size: {
                (): number[];
                (size: number[]): PackLayout;
            }
            padding: {
                (): number;
                (padding: number): PackLayout;
            }
        }

        export interface PartitionLayout {
            sort: {
                (): (a: GraphNode, b: GraphNode) => number;
                (comparator: (a: GraphNode, b: GraphNode) => number): PackLayout;
            }
            children: {
                (): (d: any, i?: number) => GraphNode[];
                (children: (d: any, i?: number) => GraphNode[]): PackLayout;
            }
            nodes(root: GraphNode): GraphNode[];
            links(nodes: GraphNode[]): GraphLink[];
            value: {
                (): (node: GraphNode) => number;
                (value: (node: GraphNode) => number): PackLayout;
            }
            size: {
                (): number[];
                (size: number[]): PackLayout;
            }
        }

        export interface TreeMapLayout {
            sort: {
                (): (a: GraphNode, b: GraphNode) => number;
                (comparator: (a: GraphNode, b: GraphNode) => number): TreeMapLayout;
            }
            children: {
                (): (d: any, i?: number) => GraphNode[];
                (children: (d: any, i?: number) => GraphNode[]): TreeMapLayout;
            }
            nodes(root: GraphNode): GraphNode[];
            links(nodes: GraphNode[]): GraphLink[];
            value: {
                (): (node: GraphNode) => number;
                (value: (node: GraphNode) => number): TreeMapLayout;
            }
            size: {
                (): number[];
                (size: number[]): TreeMapLayout;
            }
            padding: {
                (): number;
                (padding: number): TreeMapLayout;
            }
            round: {
                (): boolean;
                (round: boolean): TreeMapLayout;
            }
            sticky: {
                (): boolean;
                (sticky: boolean): TreeMapLayout;
            }
            mode: {
                (): string;
                (mode: string): TreeMapLayout;
            }
        }
    }

    // Color
    export module Color {
        export interface Color {
            /**
            * increase lightness by some exponential factor (gamma)
            */
            brighter(k?: number): Color;
            /**
            * decrease lightness by some exponential factor (gamma)
            */
            darker(k?: number): Color;
            /**
            * convert the color to a string.
            */
            toString(): string;
        }

        export interface RGBColor extends Color{
            /**
            * the red color channel.
            */
            r: number;
            /**
            * the green color channel.
            */
            g: number;
            /**
            * the blue color channel.
            */
            b: number;
            /**
            * convert from RGB to HSL.
            */
            hsl(): HSLColor;
        }

        export interface HSLColor extends Color{
            /**
            * hue
            */
            h: number;
            /**
            * saturation
            */
            s: number;
            /**
            * lightness
            */
            l: number;
            /**
            * convert from HSL to RGB.
            */
            rgb(): RGBColor;
        }

        export interface LABColor extends Color{
            /**
            * lightness
            */
            l: number;
            /**
            * a-dimension
            */
            a: number;
            /**
            * b-dimension
            */
            b: number;
            /**
            * convert from LAB to RGB.
            */
            rgb(): RGBColor;
        }

        export interface HCLColor extends Color{
            /**
            * hue
            */
            h: number;
            /**
            * chroma
            */
            c: number;
            /**
            * luminance
            */
            l: number;
            /**
            * convert from HCL to RGB.
            */
            rgb(): RGBColor;
        }
    }

    // SVG
    export module Svg {
        export interface Svg {
            /**
            * Create a new symbol generator
            */
            symbol(): Symbol;
            /**
            * Create a new axis generator
            */
            axis(): Axis;
            /**
            * Create a new arc generator
            */
            arc(): Arc;
            /**
            * Create a new line generator
            */
            line: {
                (): Line;
                radial(): LineRadial;
            }
            /**
            * Create a new area generator
            */
            area: {
                (): Area;
                radial(): AreaRadial;
            }
            /**
            * Create a new brush generator
            */
            brush(): Brush;
            /**
            * Create a new chord generator
            */
            chord(): Chord;
            /**
            * Create a new diagonal generator
            */
            diagonal: {
                (): Diagonal;
                radial(): Diagonal;
            }
            /**
            * The array of supported symbol types.
            */
            symbolTypes: string[];
        }

        export interface Symbol {
            type: (string:string) => Symbol;
            size: (number:number) => Symbol;
            (datum:any, index:number): string;
        }

        export interface Brush {
            /**
            * Draws or redraws this brush into the specified selection of elements
            */
            (selection: Selection): void;
            /**
            * Gets or sets the x-scale associated with the brush
            */
            x: {
                /**
                * Gets  the x-scale associated with the brush
                */
                (): D3.Scale.Scale;
                /**
                * Sets the x-scale associated with the brush
                *
                * @param accessor The new Scale
                */
                (scale: D3.Scale.Scale): Brush;
            };
            /**
            * Gets or sets the x-scale associated with the brush
            */
            y: {
                /**
                * Gets  the x-scale associated with the brush
                */
                (): D3.Scale.Scale;
                /**
                * Sets the x-scale associated with the brush
                *
                * @param accessor The new Scale
                */
                (scale: D3.Scale.Scale): Brush;
            };
            /**
            * Gets or sets the current brush extent
            */
            extent: {
                /**
                * Gets the current brush extent
                */
                (): any[];
                /**
                * Sets the current brush extent
                */
                (values: any[]): Brush;
            };
            /**
            * Clears the extent, making the brush extent empty.
            */
            clear(): Brush;
            /**
            * Returns true if and only if the brush extent is empty
            */
            empty(): boolean;
            /**
            * Gets or sets the listener for the specified event type
            */
            on: {
                /**
                * Gets the listener for the specified event type
                */
                (type: string): (data: any, index: number) => any;
                /**
                * Sets the listener for the specified event type
                */
                (type: string, listener: (data: any, index: number) => any, capture?: boolean): Brush;
            };
        }

        export interface Axis {
            (selection: Selection): void;
            scale: {
                (): any;
                (scale: any): Axis;
            };

            orient: {
                (): string;
                (orientation: string): Axis;
            };

            ticks: {
                (): any[];
                (...arguments: any[]): Axis;
            };

            tickPadding: {
                (): number;
                (padding: number): Axis;
            };

            tickValues: {
                (): any[];
                (values: any[]): Axis;
            };
            tickSubdivide(count: number): Axis;
            tickSize: {
                (): number;
                (inner: number, outer?: number): Axis;
            }
            innerTickSize: {
                (): number;
                (value: number): Axis;
            }
            outerTickSize: {
                (): number;
                (value: number): Axis;
            }
            tickFormat(): (any) => string;
            tickFormat(formatter: (value: any) => string): Axis;
            nice(count?: number): Axis;
        }

        export interface Arc {
           /**
           * Returns the path data string
           *
           * @param data Array of data elements
           * @param index Optional index
           */
           (data: any, index?: number): string;
           innerRadius: {
                (): (data: any, index?: number) => number;
                (radius: number): Arc;
                (radius: () => number): Arc;
                (radius: (data: any) => number): Arc;
                (radius: (data: any, index: number) => number): Arc;
            };
            outerRadius: {
                (): (data: any, index?: number) => number;
                (radius: number): Arc;
                (radius: () => number): Arc;
                (radius: (data: any) => number): Arc;
                (radius: (data: any, index: number) => number): Arc;
            };
            startAngle: {
                (): (data: any, index?: number) => number;
                (angle: number): Arc;
                (angle: () => number): Arc;
                (angle: (data: any) => number): Arc;
                (angle: (data: any, index: number) => number): Arc;
            };
            endAngle: {
                (): (data: any, index?: number) => number;
                (angle: number): Arc;
                (angle: () => number): Arc;
                (angle: (data: any) => number): Arc;
                (angle: (data: any, index: number) => number): Arc;
            };
            centroid(data: any, index?: number): number[];
        }

        export interface Line {
            /**
            * Returns the path data string
            *
            * @param data Array of data elements
            * @param index Optional index
            */
            (data: any[], index?: number): string;
            /**
            * Get or set the x-coordinate accessor.
            */
            x: {
                /**
                * Get the x-coordinate accessor.
                */
                (): (data: any, index ?: number) => number;
                /**
                * Set the x-coordinate accessor.
                *
                * @param accessor The new accessor function
                */
                (accessor: (data: any) => number): Line;
                (accessor: (data: any, index: number) => number): Line;
                /**
                * Set the  x-coordinate to a constant.
                *
                * @param cnst The new constant value.
                */
                (cnst: number): Line;
            };
            /**
            * Get or set the y-coordinate accessor.
            */
            y: {
                /**
                * Get the y-coordinate accessor.
                */
                (): (data: any, index ?: number) => number;
                /**
                * Set the y-coordinate accessor.
                *
                * @param accessor The new accessor function
                */
                (accessor: (data: any) => number): Line;
                (accessor: (data: any, index: number) => number): Line;
                /**
                * Set the  y-coordinate to a constant.
                *
                * @param cnst The new constant value.
                */
                (cnst: number): Line;
            };
            /**
            * Get or set the interpolation mode.
            */
            interpolate: {
                /**
                * Get the interpolation accessor.
                */
                (): string;
                /**
                * Set the interpolation accessor.
                *
                * @param interpolate The interpolation mode
                */
                (interpolate: string): Line;
            };
            /**
            * Get or set the cardinal spline tension.
            */
            tension: {
                /**
                * Get the cardinal spline accessor.
                */
                (): number;
                /**
                * Set the cardinal spline accessor.
                *
                * @param tension The Cardinal spline interpolation tension
                */
                (tension: number): Line;
            };
            /**
            * Control whether the line is defined at a given point.
            */
            defined: {
                /**
                * Get the accessor function that controls where the line is defined.
                */
                (): (data: any, index?: number) => boolean;
                /**
                * Set the accessor function that controls where the area is defined.
                *
                * @param defined The new accessor function
                */
                (defined: (data: any, index?: number) => boolean): Line;
            };
        }

        export interface LineRadial {
            /**
            * Returns the path data string
            *
            * @param data Array of data elements
            * @param index Optional index
            */
            (data: any[], index?: number): string;
            /**
            * Get or set the x-coordinate accessor.
            */
            x: {
                /**
                * Get the x-coordinate accessor.
                */
                (): (data: any, index ?: number) => number;
                /**
                * Set the x-coordinate accessor.
                *
                * @param accessor The new accessor function
                */
                (accessor: (data: any) => number): LineRadial;
                (accessor: (data: any, index: number) => number): LineRadial;

                /**
                * Set the  x-coordinate to a constant.
                *
                * @param cnst The new constant value.
                */
                (cnst: number): LineRadial;
            };
            /**
            * Get or set the y-coordinate accessor.
            */
            y: {
                /**
                * Get the y-coordinate accessor.
                */
                (): (data: any, index ?: number) => number;
                /**
                * Set the y-coordinate accessor.
                *
                * @param accessor The new accessor function
                */
                (accessor: (data: any) => number): LineRadial;
                (accessor: (data: any, index: number) => number): LineRadial;
                /**
                * Set the  y-coordinate to a constant.
                *
                * @param cnst The new constant value.
                */
                (cnst: number): LineRadial;
            };
            /**
            * Get or set the interpolation mode.
            */
            interpolate: {
                /**
                * Get the interpolation accessor.
                */
                (): string;
                /**
                * Set the interpolation accessor.
                *
                * @param interpolate The interpolation mode
                */
                (interpolate: string): LineRadial;
            };
            /**
            * Get or set the cardinal spline tension.
            */
            tension: {
                /**
                * Get the cardinal spline accessor.
                */
                (): number;
                /**
                * Set the cardinal spline accessor.
                *
                * @param tension The Cardinal spline interpolation tension
                */
                (tension: number): LineRadial;
            };
            /**
            * Control whether the line is defined at a given point.
            */
            defined: {
                /**
                * Get the accessor function that controls where the line is defined.
                */
                (): (data: any) => any;
                /**
                * Set the accessor function that controls where the area is defined.
                *
                * @param defined The new accessor function
                */
                (defined: (data: any) => any): LineRadial;
            };
            radius: {
                (): (d: any, i?: number) => number;
                (radius: number): LineRadial;
                (radius: (d: any) => number): LineRadial;
                (radius: (d: any, i: number) => number): LineRadial;
            }
            angle: {
                (): (d: any, i?: any) => number;
                (angle: number): LineRadial;
                (angle: (d: any) => number): LineRadial;
                (angle: (d: any, i: any) => number): LineRadial;
            }
        }

        export interface Area {
            /**
            * Generate a piecewise linear area, as in an area chart.
            */
            (data: any[], index?: number): string;
            /**
            * Get or set the x-coordinate accessor.
            */
            x: {
                /**
                * Get the x-coordinate accessor.
                */
                (): (data: any, index ?: number) => number;
                /**
                * Set the x-coordinate accessor.
                *
                * @param accessor The new accessor function
                */
                (accessor: (data: any) => number): Area;
                (accessor: (data: any, index: number) => number): Area;
                /**
                * Set the  x-coordinate to a constant.
                *
                * @param cnst The new constant value.
                */
                (cnst: number): Area;
            };
            /**
            * Get or set the x0-coordinate (baseline) accessor.
            */
            x0: {
                /**
                * Get the  x0-coordinate (baseline) accessor.
                */
                (): (data: any, index ?: number) => number;
                /**
                * Set the  x0-coordinate (baseline) accessor.
                *
                * @param accessor The new accessor function
                */
                (accessor: (data: any) => number): Area;
                (accessor: (data: any, index: number) => number): Area;
                /**
                * Set the  x0-coordinate (baseline) to a constant.
                *
                * @param cnst The new constant value.
                */
                (cnst: number): Area;
            };
            /**
            * Get or set the x1-coordinate (topline) accessor.
            */
            x1: {
                /**
                * Get the  x1-coordinate (topline) accessor.
                */
                (): (data: any, index ?: number) => number;
                /**
                * Set the  x1-coordinate (topline) accessor.
                *
                * @param accessor The new accessor function
                */
                (accessor: (data: any) => number): Area;
                (accessor: (data: any, index: number) => number): Area;
                /**
                * Set the  x1-coordinate (topline) to a constant.
                *
                * @param cnst The new constant value.
                */
                (cnst: number): Area;
            };
            /**
            * Get or set the y-coordinate accessor.
            */
            y: {
                /**
                * Get the y-coordinate accessor.
                */
                (): (data: any, index ?: number) => number;
                /**
                * Set the y-coordinate accessor.
                *
                * @param accessor The new accessor function
                */
                (accessor: (data: any) => number): Area;
                (accessor: (data: any, index: number) => number): Area;
                /**
                * Set the y-coordinate to a constant.
                *
                * @param cnst The constant value
                */
                (cnst: number): Area;
            };
            /**
            * Get or set the y0-coordinate (baseline) accessor.
            */
            y0: {
                /**
                * Get the y0-coordinate (baseline) accessor.
                */
                (): (data: any, index ?: number) => number;
                /**
                * Set the y0-coordinate (baseline) accessor.
                *
                * @param accessor The new accessor function
                */
                (accessor: (data: any) => number): Area;
                (accessor: (data: any, index: number) => number): Area;
                /**
                * Set the y0-coordinate (baseline) to a constant.
                *
                * @param cnst The constant value
                */
                (cnst: number): Area;
            };
            /**
            * Get or set the y1-coordinate (topline) accessor.
            */
            y1: {
                /**
                * Get the y1-coordinate (topline) accessor.
                */
                (): (data: any, index ?: number) => number;
                /**
                * Set the y1-coordinate (topline) accessor.
                *
                * @param accessor The new accessor function
                */
                (accessor: (data: any) => number): Area;
                (accessor: (data: any, index: number) => number): Area;
                /**
                * Set the y1-coordinate (baseline) to a constant.
                *
                * @param cnst The constant value
                */
                (cnst: number): Area;
            };
            /**
            * Get or set the interpolation mode.
            */
            interpolate: {
                /**
                * Get the interpolation accessor.
                */
                (): string;
                /**
                * Set the interpolation accessor.
                *
                * @param interpolate The interpolation mode
                */
                (interpolate: string): Area;
            };
            /**
            * Get or set the cardinal spline tension.
            */
            tension: {
                /**
                * Get the cardinal spline accessor.
                */
                (): number;
                /**
                * Set the cardinal spline accessor.
                *
                * @param tension The Cardinal spline interpolation tension
                */
                (tension: number): Area;
            };
            /**
            * Control whether the area is defined at a given point.
            */
            defined: {
                /**
                * Get the accessor function that controls where the area is defined.
                */
                (): (data: any, index?: number) => any;
                /**
                * Set the accessor function that controls where the area is defined.
                *
                * @param defined The new accessor function
                */
                (defined: (data: any, index?: number) => any): Area;
            };
        }

        export interface AreaRadial {
            /**
            * Generate a piecewise linear area, as in an area chart.
            */
            (data: any[], index?: number): string;
            /**
            * Get or set the x-coordinate accessor.
            */
            x: {
                /**
                * Get the x-coordinate accessor.
                */
                (): (data: any, index ?: number) => number;
                /**
                * Set the x-coordinate accessor.
                *
                * @param accessor The new accessor function
                */
                (accessor: (data: any) => number): AreaRadial;
                (accessor: (data: any, index: number) => number): AreaRadial;
                /**
                * Set the  x-coordinate to a constant.
                *
                * @param cnst The new constant value.
                */
                (cnst: number): AreaRadial;
            };
            /**
            * Get or set the x0-coordinate (baseline) accessor.
            */
            x0: {
                /**
                * Get the  x0-coordinate (baseline) accessor.
                */
                (): (data: any, index ?: number) => number;
                /**
                * Set the  x0-coordinate (baseline) accessor.
                *
                * @param accessor The new accessor function
                */
                (accessor: (data: any) => number): AreaRadial;
                (accessor: (data: any, index: number) => number): AreaRadial;
                /**
                * Set the  x0-coordinate to a constant.
                *
                * @param cnst The new constant value.
                */
                (cnst: number): AreaRadial;
            };
            /**
            * Get or set the x1-coordinate (topline) accessor.
            */
            x1: {
                /**
                * Get the  x1-coordinate (topline) accessor.
                */
                (): (data: any, index ?: number) => number;
                /**
                * Set the  x1-coordinate (topline) accessor.
                *
                * @param accessor The new accessor function
                */
                (accessor: (data: any) => number): AreaRadial;
                (accessor: (data: any, index: number) => number): AreaRadial;
                /**
                * Set the  x1-coordinate to a constant.
                *
                * @param cnst The new constant value.
                */
                (cnst: number): AreaRadial;
            };
            /**
            * Get or set the y-coordinate accessor.
            */
            y: {
                /**
                * Get the y-coordinate accessor.
                */
                (): (data: any, index ?: number) => number;
                /**
                * Set the y-coordinate accessor.
                *
                * @param accessor The new accessor function
                */
                (accessor: (data: any) => number): AreaRadial;
                (accessor: (data: any, index: number) => number): AreaRadial;
                /**
                * Set the y-coordinate to a constant.
                *
                * @param cnst The new constant value.
                */
                (cnst: number): AreaRadial;
            };
            /**
            * Get or set the y0-coordinate (baseline) accessor.
            */
            y0: {
                /**
                * Get the y0-coordinate (baseline) accessor.
                */
                (): (data: any, index ?: number) => number;
                /**
                * Set the y0-coordinate (baseline) accessor.
                *
                * @param accessor The new accessor function
                */
                (accessor: (data: any) => number): AreaRadial;
                (accessor: (data: any, index: number) => number): AreaRadial;
                /**
                * Set the  y0-coordinate to a constant.
                *
                * @param cnst The new constant value.
                */
                (cnst: number): AreaRadial;
            };
            /**
            * Get or set the y1-coordinate (topline) accessor.
            */
            y1: {
                /**
                * Get the y1-coordinate (topline) accessor.
                */
                (): (data: any, index ?: number) => number;
                /**
                * Set the y1-coordinate (topline) accessor.
                *
                * @param accessor The new accessor function
                */
                (accessor: (data: any) => number): AreaRadial;
                (accessor: (data: any, index: number) => number): AreaRadial;
                /**
                * Set the  y1-coordinate to a constant.
                *
                * @param cnst The new constant value.
                */
                (cnst: number): AreaRadial;
            };
            /**
            * Get or set the interpolation mode.
            */
            interpolate: {
                /**
                * Get the interpolation accessor.
                */
                (): string;
                /**
                * Set the interpolation accessor.
                *
                * @param interpolate The interpolation mode
                */
                (interpolate: string): AreaRadial;
            };
            /**
            * Get or set the cardinal spline tension.
            */
            tension: {
                /**
                * Get the cardinal spline accessor.
                */
                (): number;
                /**
                * Set the cardinal spline accessor.
                *
                * @param tension The Cardinal spline interpolation tension
                */
                (tension: number): AreaRadial;
            };
            /**
            * Control whether the area is defined at a given point.
            */
            defined: {
                /**
                * Get the accessor function that controls where the area is defined.
                */
                (): (data: any) => any;
                /**
                * Set the accessor function that controls where the area is defined.
                *
                * @param defined The new accessor function
                */
                (defined: (data: any) => any): AreaRadial;
            };
            radius: {
                (): number;
                (radius: number): AreaRadial;
                (radius: () => number): AreaRadial;
                (radius: (data: any) => number): AreaRadial;
                (radius: (data: any, index: number) => number): AreaRadial;
            };
            innerRadius: {
                (): number;
                (radius: number): AreaRadial;
                (radius: () => number): AreaRadial;
                (radius: (data: any) => number): AreaRadial;
                (radius: (data: any, index: number) => number): AreaRadial;
            };
            outerRadius: {
                (): number;
                (radius: number): AreaRadial;
                (radius: () => number): AreaRadial;
                (radius: (data: any) => number): AreaRadial;
                (radius: (data: any, index: number) => number): AreaRadial;
            };
            angle: {
                (): number;
                (angle: number): AreaRadial;
                (angle: () => number): AreaRadial;
                (angle: (data: any) => number): AreaRadial;
                (angle: (data: any, index: number) => number): AreaRadial;
            };
            startAngle: {
                (): number;
                (angle: number): AreaRadial;
                (angle: () => number): AreaRadial;
                (angle: (data: any) => number): AreaRadial;
                (angle: (data: any, index: number) => number): AreaRadial;
            };
            endAngle: {
                (): number;
                (angle: number): AreaRadial;
                (angle: () => number): AreaRadial;
                (angle: (data: any) => number): AreaRadial;
                (angle: (data: any, index: number) => number): AreaRadial;
            };
        }

        export interface Chord {
            (datum: any, index?: number): string;
            radius: {
                (): number;
                (radius: number): Chord;
                (radius: () => number): Chord;
            };
            startAngle: {
                (): number;
                (angle: number): Chord;
                (angle: () => number): Chord;
            };
            endAngle: {
                (): number;
                (angle: number): Chord;
                (angle: () => number): Chord;
            };
            source: {
                (): any;
                (angle: any): Chord;
                (angle: (d: any, i?: number) => any): Chord;
            };
            target: {
                (): any;
                (angle: any): Chord;
                (angle: (d: any, i?: number) => any): Chord;
            };
        }

        export interface Diagonal {
            (datum: any, index?: number): string;
            projection: {
                (): (datum: any, index?: number) => number[];
                (proj: (datum: any) => number[]): Diagonal;
                (proj: (datum: any, index: number) => number[]): Diagonal;
            };
            source: {
                (): (datum: any, index?: number) => any;
                (src: (datum: any) => any): Diagonal;
                (src: (datum: any, index: number) => any): Diagonal;
                (src: any): Diagonal;
            };
            target: {
                (): (datum: any, index?: number) => any;
                (target: (d: any) => any): Diagonal;
                (target: (d: any, i: number) => any): Diagonal;
                (target: any): Diagonal;
            };
        }
    }

    // Scales
    export module Scale {
        export interface ScaleBase {
            /**
            * Construct a linear quantitative scale.
            */
            linear(): LinearScale;
            /*
            * Construct an ordinal scale.
            */
            ordinal(): OrdinalScale;
            /**
            * Construct a linear quantitative scale with a discrete output range.
            */
            quantize(): QuantizeScale;
            /*
            * Construct an ordinal scale with ten categorical colors.
            */
            category10(): OrdinalScale;
            /*
            * Construct an ordinal scale with twenty categorical colors
            */
            category20(): OrdinalScale;
            /*
            * Construct an ordinal scale with twenty categorical colors
            */
            category20b(): OrdinalScale;
            /*
            * Construct an ordinal scale with twenty categorical colors
            */
            category20c(): OrdinalScale;
            /*
            * Construct a linear identity scale.
            */
            identity(): IdentityScale;
            /*
            * Construct a quantitative scale with an logarithmic transform.
            */
            log(): LogScale;
            /*
            * Construct a quantitative scale with an exponential transform.
            */
            pow(): PowScale;
            /*
            * Construct a quantitative scale mapping to quantiles.
            */
            quantile(): QuantileScale;
            /*
            * Construct a quantitative scale with a square root transform.
            */
            sqrt(): SqrtScale;
            /*
            * Construct a threshold scale with a discrete output range.
            */
            threshold(): ThresholdScale;
        }

        export interface GenericScale<S> {
            (value: any): any;
            domain: {
                (values: any[]): S;
                (): any[];
            };
            range: {
                (values: any[]): S;
                (): any[];
            };
            invertExtent?(y: any): any[];
            copy(): S;
        }

        export interface Scale extends GenericScale<Scale> { }

        export interface GenericQuantitativeScale<S> extends GenericScale<S> {
            /**
            * Get the range value corresponding to a given domain value.
            *
            * @param value Domain Value
            */
            (value: number): number;
            /**
            * Get the domain value corresponding to a given range value.
            *
            * @param value Range Value
            */
            invert(value: number): number;
            /**
            * Set the scale's output range, and enable rounding.
            *
            * @param value The output range.
            */
            rangeRound: (values: any[]) => S;
            /**
            * get or set the scale's output interpolator.
            */
            interpolate: {
                (): D3.Transition.Interpolate;
                (factory: D3.Transition.Interpolate): S;
            };
            /**
            * enable or disable clamping of the output range.
            *
            * @param clamp Enable or disable
            */
            clamp: {
                (): boolean;
                (clamp: boolean): S;
            }
            /**
            * extend the scale domain to nice round numbers.
            *
            * @param count Optional number of ticks to exactly fit the domain
            */
            nice(count?: number): S;
            /**
            * get representative values from the input domain.
            *
            * @param count Aproximate representative values to return.
            */
            ticks(count: number): any[];
            /**
            * get a formatter for displaying tick values
            *
            * @param count Aproximate representative values to return
            */
            tickFormat(count: number, format?: string): (n: number) => string;
        }

        export interface QuantitativeScale extends GenericQuantitativeScale<QuantitativeScale> { }

        export interface LinearScale extends GenericQuantitativeScale<LinearScale> { }

        export interface IdentityScale extends GenericScale<IdentityScale> {
            /**
            * Get the range value corresponding to a given domain value.
            *
            * @param value Domain Value
            */
            (value: number): number;
            /**
            * Get the domain value corresponding to a given range value.
            *
            * @param value Range Value
            */
            invert(value: number): number;
            /**
            * get representative values from the input domain.
            *
            * @param count Aproximate representative values to return.
            */
            ticks(count: number): any[];
            /**
            * get a formatter for displaying tick values
            *
            * @param count Aproximate representative values to return
            */
            tickFormat(count: number): (n: number) => string;
        }

        export interface SqrtScale extends GenericQuantitativeScale<SqrtScale> { }

        export interface PowScale extends GenericQuantitativeScale<PowScale> { }

        export interface LogScale extends GenericQuantitativeScale<LogScale> { }

        export interface OrdinalScale extends GenericScale<OrdinalScale> {
            rangePoints(interval: any[], padding?: number): OrdinalScale;
            rangeBands(interval: any[], padding?: number, outerPadding?: number): OrdinalScale;
            rangeRoundBands(interval: any[], padding?: number, outerPadding?: number): OrdinalScale;
            rangeBand(): number;
            rangeExtent(): any[];
        }

        export interface QuantizeScale extends GenericScale<QuantizeScale> { }

        export interface ThresholdScale extends GenericScale<ThresholdScale> { }

        export interface QuantileScale extends GenericScale<QuantileScale> {
            quantiles(): any[];
        }

        export interface TimeScale extends GenericScale<TimeScale> {
            (value: Date): number;
            invert(value: number): Date;
            rangeRound: (values: any[]) => TimeScale;
            interpolate: {
                (): D3.Transition.Interpolate;
                (factory: D3.Transition.InterpolateFactory): TimeScale;
            };
            clamp(clamp: boolean): TimeScale;
            ticks: {
                (count: number): any[];
                (range: D3.Time.Range, count: number): any[];
            };
            tickFormat(count: number): (n: number) => string;
            nice(count?: number): TimeScale;
        }
    }

    // Behaviour
    export module Behavior {
        export interface Behavior{
            /**
            * Constructs a new drag behaviour
            */
            drag(): Drag;
            /**
            * Constructs a new zoom behaviour
            */
            zoom(): Zoom;
        }

        export interface Zoom {
            /**
            * Applies the zoom behavior to the specified selection,
            * registering the necessary event listeners to support
            * panning and zooming.
            */
            (selection: Selection): void;

            /**
            * Registers a listener to receive events
            *
            * @param type Enent name to attach the listener to
            * @param listener Function to attach to event
            */
            on: (type: string, listener: (data: any, index?: number) => any) => Zoom;

            /**
            * Gets or set the current zoom scale
            */
            scale: {
                /**
                * Get the current current zoom scale
                */
                (): number;
                /**
                * Set the current current zoom scale
                *
                * @param origin Zoom scale
                */
                (scale: number): Zoom;
            };

            /**
            * Gets or set the current zoom translation vector
            */
            translate: {
                /**
                * Get the current zoom translation vector
                */
                (): number[];
                /**
                * Set the current zoom translation vector
                *
                * @param translate Tranlation vector
                */
                (translate: number[]): Zoom;
            };

            /**
            * Gets or set the allowed scale range
            */
            scaleExtent: {
                /**
                * Get the current allowed zoom range
                */
                (): number[];
                /**
                * Set the allowable zoom range
                *
                * @param extent Allowed zoom range
                */
                (extent: number[]): Zoom;
            };

            /**
            * Gets or set the X-Scale that should be adjusted when zooming
            */
            x: {
                /**
                * Get the X-Scale
                */
                (): D3.Scale.Scale;
                /**
                * Set the X-Scale to be adjusted
                *
                * @param x The X Scale
                */
                (x: D3.Scale.Scale): Zoom;

            };

            /**
            * Gets or set the Y-Scale that should be adjusted when zooming
            */
            y: {
                /**
                * Get the Y-Scale
                */
                (): D3.Scale.Scale;
                /**
                * Set the Y-Scale to be adjusted
                *
                * @param y The Y Scale
                */
                (y: D3.Scale.Scale): Zoom;
            };
        }

        export interface Drag {
            /**
            * Execute drag method
            */
            (): any;

            /**
            * Registers a listener to receive events
            *
            * @param type Enent name to attach the listener to
            * @param listener Function to attach to event
            */
            on: (type: string, listener: (data: any, index?: number) => any) => Drag;

            /**
            * Gets or set the current origin accessor function
            */
            origin: {
                /**
                * Get the current origin accessor function
                */
                (): any;
                /**
                * Set the origin accessor function
                *
                * @param origin Accessor function
                */
                (origin?: any): Drag;
            };
        }
    }

    // Geography
    export module Geo {
        export interface Geo {
            /**
            * create a new geographic path generator
            */
            path(): Path;
            /**
            * create a circle generator.
            */
            circle(): Circle;
            /**
            * compute the spherical area of a given feature.
            */
            area(feature: any): number;
            /**
            * compute the latitude-longitude bounding box for a given feature.
            */
            bounds(feature: any): number[][];
            /**
            * compute the spherical centroid of a given feature.
            */
            centroid(feature: any): number[];
            /**
            * compute the great-arc distance between two points.
            */
            distance(a: number[], b: number[]): number;
            /**
            * interpolate between two points along a great arc.
            */
            interpolate(a: number[], b: number[]): (t: number) => number[];
            /**
            * compute the length of a line string or the circumference of a polygon.
            */
            length(feature: any): number;
            /**
            * create a standard projection from a raw projection.
            */
            projection(raw: RawProjection): Projection;
            /**
            * create a standard projection from a mutable raw projection.
            */
            projectionMutator(rawFactory: RawProjection): ProjectionMutator;
            /**
            * the Albers equal-area conic projection.
            */
            albers(): Projection;
            /**
            * a composite Albers projection for the United States.
            */
            albersUsa(): Projection;
            /**
            * the azimuthal equal-area projection.
            */
            azimuthalEqualArea: {
                (): Projection;
                raw: RawProjection;
            }
            /**
            * the azimuthal equidistant projection.
            */
            azimuthalEquidistant: {
                (): Projection;
                raw: RawProjection;
            }
            /**
            * the conic conformal projection.
            */
            conicConformal: {
                (): Projection;
                raw(phi1:number, phi2:number): RawProjection;
            }
            /**
            * the conic equidistant projection.
            */
            conicEquidistant: {
                (): Projection;
                raw(phi1:number, phi2:number): RawProjection;
            }
            /**
            * the conic equal-area (a.k.a. Albers) projection.
            */
            conicEqualArea: {
                (): Projection;
                raw(phi1:number, phi2:number): RawProjection;
            }
            /**
            * the equirectangular (plate carreé) projection.
            */
            equirectangular: {
                (): Projection;
                raw: RawProjection;
            }
            /**
            * the gnomonic projection.
            */
            gnomonic: {
                (): Projection;
                raw: RawProjection;
            }
            /**
            * the spherical Mercator projection.
            */
            mercator: {
                (): Projection;
                raw: RawProjection;
            }
            /**
            * the azimuthal orthographic projection.
            */
            orthographic: {
                (): Projection;
                raw: RawProjection;
            }
            /**
            * the azimuthal stereographic projection.
            */
            stereographic: {
                (): Projection;
                raw: RawProjection;
            }
            /**
            * the transverse Mercator projection.
            */
            transverseMercator: {
                (): Projection;
                raw: RawProjection;
            }
            /**
            * convert a GeoJSON object to a geometry stream.
            */
            stream(object: GeoJSON, listener: Stream): void;
            /**
            *
            */
            graticule(): Graticule;
            /**
            *
            */
            greatArc(): GreatArc;
            /**
            *
            */
            rotation(rotation: number[]): Rotation;
        }

        export interface Path {
            /**
            * Returns the path data string for the given feature
            */
            (feature: any, index?: any): string;
            /**
            * get or set the geographic projection.
            */
            projection: {
                /**
                * get the geographic projection.
                */
                (): Projection;
                /**
                * set the geographic projection.
                */
                (projection: Projection): Path;
            }
            /**
            * get or set the render context.
            */
            context: {
                /**
                * return an SVG path string invoked on the given feature.
                */
                (): string;
                /**
                * sets the render context and returns the path generator
                */
                (context: Context): Path;
            }
            /**
            * Computes the projected area
            */
            area(feature: any): any;
            /**
            * Computes the projected centroid
            */
            centroid(feature: any): any;
            /**
            * Computes the projected bounding box
            */
            bounds(feature: any): any;
            /**
            * get or set the radius to display point features.
            */
            pointRadius: {
                /**
                * returns the current radius
                */
                (): number;
                /**
                * sets the radius used to display Point and MultiPoint features to the specified number
                */
                (radius: number): Path;
                /**
                * sets the radius used to display Point and MultiPoint features to the specified number
                */
                (radius: (feature: any, index: number) => number): Path;
            }
        }

        export interface Context {
            beginPath(): any;
            moveTo(x: number, y: number): any;
            lineTo(x: number, y: number): any;
            arc(x: number, y: number, radius: number, startAngle: number, endAngle: number): any;
            closePath(): any;
        }

        export interface Circle {
            (...args: any[]): GeoJSON;
            origin: {
                (): number[];
                (origin: number[]): Circle;
                (origin: (...args: any[]) => number[]): Circle;
            }
            angle: {
                (): number;
                (angle: number): Circle;
            }
            precision: {
                (): number;
                (precision: number): Circle;
            }
        }

        export interface Graticule{
            (): GeoJSON;
            lines(): GeoJSON[];
            outline(): GeoJSON;
            extent: {
                (): number[][];
                (extent: number[][]): Graticule;
            }
            minorExtent: {
                (): number[][];
                (extent: number[][]): Graticule;
            }
            majorExtent: {
                (): number[][];
                (extent: number[][]): Graticule;
            }
            step: {
                (): number[][];
                (extent: number[][]): Graticule;
            }
            minorStep: {
                (): number[][];
                (extent: number[][]): Graticule;
            }
            majorStep: {
                (): number[][];
                (extent: number[][]): Graticule;
            }
            precision: {
                (): number;
                (precision: number): Graticule;
            }
        }

        export interface GreatArc {
            (): GeoJSON;
            distance(): number;
            source: {
                (): any;
                (source: any): GreatArc;
            }
            target: {
                (): any;
                (target: any): GreatArc;
            }
            precision: {
                (): number;
                (precision: number): GreatArc;
            }
        }

        export interface GeoJSON {
            coordinates: number[][];
            type: string;
        }

        export interface RawProjection {
            (lambda: number, phi: number): number[];
            invert?(x: number, y: number): number[];
        }

        export interface Projection {
            (coordinates: number[]): number[];
            invert?(point: number[]): number[];
            rotate: {
                (): number[];
                (rotation: number[]): Projection;
            };
            center: {
                (): number[];
                (location: number[]): Projection;
            };
            parallels: {
                (): number[];
                (location: number[]): Projection;
            };
            translate: {
                (): number[];
                (point: number[]): Projection;
            };
            scale: {
                (): number;
                (scale: number): Projection;
            };
            clipAngle: {
                (): number;
                (angle: number): Projection;
            };
            clipExtent: {
                (): number[][];
                (extent: number[][]): Projection;
            };
            precision: {
                (): number;
                (precision: number): Projection;
            };
            stream(listener?: Stream): Stream;
        }

        export interface Stream {
            point(x: number, y: number, z?: number): void;
            lineStart(): void;
            lineEnd(): void;
            polygonStart(): void;
            polygonEnd(): void;
            sphere(): void;
        }

        export interface Rotation extends Array<any> {
            (location: number[]): Rotation;
            invert(location: number[]): Rotation;
        }

        export interface ProjectionMutator {
            (lambda: number, phi: number): Projection;
        }
    }

    // Geometry
    export module Geom {
        export interface Geom {
            voronoi<T>(): Voronoi<T>;
            /**
            * compute the Voronoi diagram for the specified points.
            */
            voronoi(vertices: Vertice[]): Polygon[];
            /**
            * compute the Delaunay triangulation for the specified points.
            */
            delaunay(vertices?: Vertice[]): Polygon[];
            /**
            * constructs a quadtree for an array of points.
            */
            quadtree(): QuadtreeFactory;
            /**
            * Constructs a new quadtree for the specified array of points.
            */
            quadtree(points: Point[], x1: number, y1: number, x2: number, y2: number): Quadtree;
            /**
            * Constructs a new quadtree for the specified array of points.
            */
            quadtree(points: Point[], width: number, height: number): Quadtree;
            /**
            * Returns the input array of vertices with additional methods attached
            */
            polygon(vertices:Vertice[]): Polygon;
            /**
            * creates a new hull layout with the default settings.
            */
            hull(): Hull;

            hull(vertices:Vertice[]): Vertice[];
        }

        export interface Vertice extends Array<number> {
            /**
            * Returns the angle of the vertice
            */
            angle?: number;
        }

        export interface Polygon extends Array<Vertice> {
            /**
            * Returns the signed area of this polygon
            */
            area(): number;
            /**
            * Returns a two-element array representing the centroid of this polygon.
            */
            centroid(): number[];
            /**
            * Clips the subject polygon against this polygon
            */
            clip(subject: Polygon): Polygon;
        }

        export interface QuadtreeFactory {
            /**
            * Constructs a new quadtree for the specified array of points.
            */
            (): Quadtree;
            /**
            * Constructs a new quadtree for the specified array of points.
            */
            (points: Point[], x1: number, y1: number, x2: number, y2: number): Quadtree;
            /**
            * Constructs a new quadtree for the specified array of points.
            */
            (points: Point[], width: number, height: number): Quadtree;

            x: {
                (): (d: any) => any;
                (accesor: (d: any) => any): QuadtreeFactory;

            }
            y: {
                (): (d: any) => any;
                (accesor: (d: any) => any): QuadtreeFactory;

            }
            size(): number[];
            size(size: number[]): QuadtreeFactory;
            extent(): number[][];
            extent(points: number[][]): QuadtreeFactory;
        }

        export interface Quadtree {
            /**
            * Adds a new point to the quadtree.
            */
            add(point: Point): void;
            visit(callback: any): void;
        }

        export interface Point {
            x: number;
            y: number;
        }

        export interface Voronoi<T> {
            /**
            * Compute the Voronoi diagram for the specified data.
            */
            (data: T[]): Polygon[];
            /**
            * Compute the graph links for the Voronoi diagram for the specified data.
            */
            links(data: T[]): Layout.GraphLink[];
            /**
            * Compute the triangles for the Voronoi diagram for the specified data.
            */
            triangles(data: T[]): number[][];
            x: {
                /**
                * Get the x-coordinate accessor.
                */
                (): (data: T, index ?: number) => number;

                /**
                * Set the x-coordinate accessor.
                *
                * @param accessor The new accessor function
                */
                (accessor: (data: T, index: number) => number): Voronoi<T>;

                /**
                * Set the x-coordinate to a constant.
                *
                * @param constant The new constant value.
                */
                (constant: number): Voronoi<T>;
            }
            y: {
                /**
                * Get the y-coordinate accessor.
                */
                (): (data: T, index ?: number) => number;

                /**
                * Set the y-coordinate accessor.
                *
                * @param accessor The new accessor function
                */
                (accessor: (data: T, index: number) => number): Voronoi<T>;

                /**
                * Set the y-coordinate to a constant.
                *
                * @param constant The new constant value.
                */
                (constant: number): Voronoi<T>;
            }
            clipExtent: {
                /**
                * Get the clip extent.
                */
                (): number[][];
                /**
                * Set the clip extent.
                *
                * @param extent The new clip extent.
                */
                (extent: number[][]): Voronoi<T>;
            }
            size: {
                /**
                * Get the size.
                */
                (): number[];
                /**
                * Set the size, equivalent to a clip extent starting from (0,0).
                *
                * @param size The new size.
                */
                (size: number[]): Voronoi<T>;
            }
        }

        export interface Hull {
            (vertices: Vertice[]): Vertice[];
            x: {
                (): (d: any) => any;
                (accesor: (d: any) => any): any;
            }
            y: {
                (): (d: any) => any;
                (accesor: (d: any) => any): any;
            }
        }
    }

    export interface D3Element extends Element {
        getComputedTextLength: () => number;
        getTotalLength: () => number;
        getPointAtLength: (l: number) => SVGPoint;
    }
}

declare var d3: D3.Base;

declare module "d3" {
    export = d3;
}
