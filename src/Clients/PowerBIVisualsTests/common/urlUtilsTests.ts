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

module powerbitests {
    import UrlUtils = jsCommon.UrlUtils;

    describe("UrlUtils isValidUrl", () => {
        it("isValidUrl null", () => {
            expect(UrlUtils.isValidUrl(null)).toBe(false);
        });

        it("isValidUrl http", () => {
            expect(UrlUtils.isValidUrl("http://www.microsoft.com")).toBe(true);
        });

        it("isValidUrl https", () => {
            expect(UrlUtils.isValidUrl("https://www.microsoft.com")).toBe(true);
        });

        it("isValidUrl HTTPS", () => {
            expect(UrlUtils.isValidUrl("HTTPS://WWW.MICROSOFT.COM")).toBe(true);
        });

        it("isValidUrl dataUri", () => {
            expect(UrlUtils.isValidUrl("data://www.microsoft.com")).toBe(false);
        });

        it("empty string", () => {
            expect(UrlUtils.isValidUrl('')).toBe(false);
        });

        it("valid http url", () => {
            expect(UrlUtils.isValidUrl('http://www.bing.com')).toBe(true);
        });

        it("valid https url", () => {
            expect(UrlUtils.isValidUrl('https://www.bing.com')).toBe(true);
        });

        it("url after text", () => {
            expect(UrlUtils.isValidUrl('foo https://www.bing.com')).toBe(false);
        });

        it("url without protocol", () => {
            expect(UrlUtils.isValidUrl('www.bing.com')).toBe(false);
        });

        it("ftp url", () => {
            expect(UrlUtils.isValidUrl('ftp://www.bing.com')).toBe(false);
        });

        it("javascript void", () => {
            expect(UrlUtils.isValidUrl('javascript:void(0)')).toBe(false);
        });

        it("javascript alert", () => {
            expect(UrlUtils.isValidUrl('javascript:alert("Hello")')).toBe(false);
        });
    });

    describe("UrlUtils isValidImageUrl", () => {
        it("isValidImageUrl null", () => {
            expect(UrlUtils.isValidImageUrl(null)).toBe(false);
        });

        it("isValidImageUrl empty string", () => {
            expect(UrlUtils.isValidImageUrl("")).toBe(false);
        });

        it("isValidImageUrl http direct link", () => {
            expect(UrlUtils.isValidImageUrl("http://www.microsoft.com/img.jpg")).toBe(true);
        });

        it("isValidImageUrl https direct link", () => {
            expect(UrlUtils.isValidImageUrl("https://www.microsoft.com/img.jpg")).toBe(true);
        });

        it("isValidImageUrl http non-direct link", () => {
            expect(UrlUtils.isValidImageUrl("http://www.microsoft.com/image")).toBe(true);
        });

        it("isValidImageUrl https direct link", () => {
            expect(UrlUtils.isValidImageUrl("https://www.microsoft.com/image")).toBe(true);
        });

        it("isValidImageUrl dataUri", () => {
            expect(UrlUtils.isValidImageUrl("data://www.microsoft.com")).toBe(false);
        });

        it("isValidImageUrl url after text", () => {
            expect(UrlUtils.isValidImageUrl('foo https://www.bing.com')).toBe(false);
        });

        it("isValidImageUrl url without protocol", () => {
            expect(UrlUtils.isValidImageUrl('www.bing.com')).toBe(false);
        });

        it("isValidImageUrl ftp url", () => {
            expect(UrlUtils.isValidImageUrl('ftp://www.bing.com')).toBe(false);
        });

        it("isValidImageUrl invalid url", (done) => {
            expect(UrlUtils.isValidImageUrl("ABC123")).toBe(false);
            done();
        });
    });

    describe("UrlUtils.findAllValidUrls tests", () => {
        it("null string", () => {
            expect(UrlUtils.findAllValidUrls(null)).toEqual([]);
        });

        it("empty string", () => {
            expect(UrlUtils.findAllValidUrls('')).toEqual([]);
        });

        it("http url", () => {
            expect(UrlUtils.findAllValidUrls('foo http://www.bing.com bar')).toEqual([
                {
                    start: 4,
                    end: 23,
                    text: 'http://www.bing.com',
                }
            ]);
        });

        it("https url", () => {
            expect(UrlUtils.findAllValidUrls('foo https://www.bing.com bar')).toEqual([
                {
                    start: 4,
                    end: 24,
                    text: 'https://www.bing.com',
                }
            ]);
        });

        it("many urls", () => {
            expect(UrlUtils.findAllValidUrls('this text http://www.bing1.com has many https://www.bing2.com urls throughout http://www.bing3.com')).toEqual([
                {
                    start: 10,
                    end: 30,
                    text: 'http://www.bing1.com',
                },
                {
                    start: 40,
                    end: 61,
                    text: 'https://www.bing2.com',
                },
                {
                    start: 78,
                    end: 98,
                    text: 'http://www.bing3.com',
                }
            ]);
        });
    });

    describe("UrlUtils.getBase64ContentFromDataUri tests", () => {
        it("Valid URI", () => {
            expect(UrlUtils.getBase64ContentFromDataUri('data:image/jpeg;base64,12345=')).toEqual('12345=');
        });

        it("Non data URI", () => {
            expect(() => UrlUtils.getBase64ContentFromDataUri('not a data uri')).toThrowError();
        });

        it("No base 64 content", () => {
            expect(() => UrlUtils.getBase64ContentFromDataUri('data:image/png')).toThrowError();
        });
    });
}
