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

module powerbi {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;

    export interface ILocalizableError {
        getDetails(resourceProvider: IStringResourceProvider): ErrorDetails;
    }

    export interface IClientError extends ILocalizableError {
        code: string;
        debugInfo?: string;
        ignorable?: boolean;
        requestId?: string;
    }

    export interface IClientWarning extends ILocalizableError {
        code: string;
        columnNameFromIndex: (index: number) => string;
    }

    /**
     * Unlocalized strings to be used for error reporting.
     */
    export module ClientErrorStrings {
        export const ClientErrorCode = 'Client Error Code';
        export const ErrorCode = 'Error Code';
        export const ErrorDetails = 'Error Details';
        export const HttpRequestId = 'HTTP Request Id';
        export const JobId = 'Job Id';
        export const ODataErrorMessage = 'OData Error Message';
        export const StackTrace = 'Stack Trace';
    }

    /**
     this base class should be derived to give a generic error message but with a unique error code.
     */
    export abstract class UnknownClientError implements IClientError {
        private errorCode: string;

        public get code(): string {
            return this.errorCode;
        }
        public get ignorable(): boolean {
            return false;
        }

        constructor(code: string) {
            debug.assertValue(code, 'code');

            this.errorCode = code;
        }

        public getDetails(resourceProvider: IStringResourceProvider): ErrorDetails {
            let details: ErrorDetails = {
                message: resourceProvider.get('ClientError_UnknownClientErrorValue'),
                displayableErrorInfo: [{ errorInfoKey: resourceProvider.get('ClientError_UnknownClientErrorKey'), errorInfoValue: resourceProvider.get('ClientError_UnknownClientErrorValue'), }],
                debugErrorInfo: [{ errorInfoKey: ClientErrorStrings.ClientErrorCode, errorInfoValue: this.code, }],
            };

            return details;
        }
    }

    export class HttpClientError implements IClientError {
        private httpRequestId: string;
        private httpStatusCode: number;
        
        constructor(httpStatusCode: number, requestId: string) {
            debug.assertValue(httpStatusCode, 'httpStatusCode');
            debug.assertValue(requestId, 'requestId');
            this.httpStatusCode = httpStatusCode;
            this.httpRequestId = requestId;
        }

        public get code(): string {
            return 'HttpClientError';
        }

        public get ignorable(): boolean {
            return false;
        }

        public get requestId(): string {
            return this.httpRequestId;
        }

        public getDetails(resourceProvider: IStringResourceProvider): ErrorDetails {
            // Use a general error message for a HTTP request failure, since we currently do not know of any specifc error cases at this point in time.
            let details: ErrorDetails = {
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
        }
    }

    export class IgnorableClientError implements IClientError {
        public get code(): string {
            return 'IgnorableClientError';
        }
        public get ignorable(): boolean {
            return true;
        }

        public getDetails(resourceProvider: IStringResourceProvider): ErrorDetails {
            let details: ErrorDetails = {
                message: '',
                displayableErrorInfo: [],
            };

            return details;
        }
    }
}  