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

module jsCommon {
    export module BrowserUtils {
        export function isChrome(): boolean {
            let vendorName = window.navigator.vendor || "";
            let userAgent = window.navigator.userAgent.toLowerCase();

            return vendorName.toLowerCase().indexOf('google') > -1 &&
                userAgent.indexOf('chrome') > -1 &&
                userAgent.indexOf('edge') === -1 &&
                userAgent.indexOf('opr') === -1;
        }

        export function isInternetExplorerOrEdge(): boolean {
            let userAgent = window.navigator.userAgent.toLowerCase();
            return userAgent.indexOf('msie') > -1
                || userAgent.indexOf('trident') > -1
                || userAgent.indexOf('edge') > -1;
        }
        
        /**
         * Get the current version of IE
         * @returns The version of Internet Explorer or a 0 (indicating the use of another browser).
         */
        export function getInternetExplorerVersion(): number {
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

        export function isFirefox(): boolean {
            return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        }
    }
}