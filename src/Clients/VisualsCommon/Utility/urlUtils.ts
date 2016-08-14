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

    export module UrlUtils {
        const urlRegex = /http[s]?:\/\/(\S)+/gi;

        export function isValidUrl(value: string): boolean {
            if (StringExtensions.isNullOrEmpty(value))
                return false;

            let match = RegExpExtensions.run(urlRegex, value);
            if (!!match && match.index === 0)
                return true;

            return false;
        }

        /* Tests whether a URL is valid.
         * @param url The url to be tested.
         * @returns Whether the provided url is valid.
         **/
        export function isValidImageUrl(url: string): boolean {
            // VSTS: 7252099 / 7112236
            // For now, passes for any valid Url

            return isValidUrl(url);
        }

        export function findAllValidUrls(text: string): TextMatch[] {
            if (StringExtensions.isNullOrEmpty(text))
                return [];

            // Find all urls in the text.
            // TODO: This could potentially be expensive, maybe include a cap here for text with many urls?
            let urlRanges: TextMatch[] = [];
            let matches: RegExpExecArray;
            let start = 0;
            while ((matches = RegExpExtensions.run(urlRegex, text, start)) !== null) {
                let url = matches[0];
                let end = matches.index + url.length;
                urlRanges.push({
                    start: matches.index,
                    end: end,
                    text: url,
                });
                start = end;
            }

            return urlRanges;
        }

        export function getBase64ContentFromDataUri(uri: string): string {
            if (uri.indexOf('data:') !== 0)
                throw new Error("Expected data uri");

            // Locate the base 64 content from the URL (e.g. "data:image/png;base64,xxxxx=")
            const base64Token = ";base64,";
            let indexBase64TokenStart = uri.indexOf(base64Token);
            if (indexBase64TokenStart < 0)
                throw new Error("Expected base 64 content in data url");

            let indexBase64Start = indexBase64TokenStart + base64Token.length;
            return uri.substr(indexBase64Start, uri.length - indexBase64Start);
        }

    }
}