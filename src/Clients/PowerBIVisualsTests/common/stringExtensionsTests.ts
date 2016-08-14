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
    import StringExtensions = jsCommon.StringExtensions;

    describe('stringExtensionsTests', () => {
        let resourceProvider: jsCommon.IStringResourceProvider;
        
        beforeEach(() => {
            resourceProvider = {
                get: (id: string) => '{0}, {1}',
                getOptional: (id: string) => '',
            };
        });

        it('constructCommaSeparatedList - one element, no limit', () => {
            let result = StringExtensions.constructCommaSeparatedList(['one'], resourceProvider);

            expect(result).toBe('one');
        });

        it('constructCommaSeparatedList - one element with limit', () => {
            let result = StringExtensions.constructCommaSeparatedList(['one'], resourceProvider, 9);

            expect(result).toBe('one');
        });

        it('constructCommaSeparatedList - one element with limit of one', () => {
            let result = StringExtensions.constructCommaSeparatedList(['one'], resourceProvider, 1);

            expect(result).toBe('one');
        });

        it('constructCommaSeparatedList - two elements, no limit', () => {
            let result = StringExtensions.constructCommaSeparatedList(['one', 'two'], resourceProvider);

            expect(result).toBe('one, two');
        });

        it('constructCommaSeparatedList - two elements with limit higher than two', () => {
            let result = StringExtensions.constructCommaSeparatedList(['one', 'two'], resourceProvider, 3);

            expect(result).toBe('one, two');
        });

        it('constructCommaSeparatedList - two elements with limit of one truncates', () => {
            let result = StringExtensions.constructCommaSeparatedList(['one', 'two'], resourceProvider, 1);

            expect(result).toBe('one');
        });

        it('constructCommaSeparatedList - two elements, format 0 in first element', () => {
            let result = StringExtensions.constructCommaSeparatedList(['one{0}', 'two'], resourceProvider);

            expect(result).toBe('one{0}, two');
        });

        it('constructCommaSeparatedList - two elements, format 0 in second element', () => {
            let result = StringExtensions.constructCommaSeparatedList(['one', 'two{0}'], resourceProvider);

            expect(result).toBe('one, two{0}');
        });

        it('constructCommaSeparatedList - two elements, format 1 in first element', () => {
            let result = StringExtensions.constructCommaSeparatedList(['one{1}', 'two'], resourceProvider);

            expect(result).toBe('one{1}, two');
        });

        it('constructCommaSeparatedList - two elements, format 1 in second element', () => {
            let result = StringExtensions.constructCommaSeparatedList(['one', 'two{1}'], resourceProvider);

            expect(result).toBe('one, two{1}');
        });

        it('constructCommaSeparatedList - two elements, both with format 0', () => {
            let result = StringExtensions.constructCommaSeparatedList(['one{0}', 'two{0}'], resourceProvider);

            expect(result).toBe('one{0}, two{0}');
        });

        it('constructCommaSeparatedList - two elements, both with format 1', () => {
            let result = StringExtensions.constructCommaSeparatedList(['one{1}', 'two{1}'], resourceProvider);

            expect(result).toBe('one{1}, two{1}');
        });

        it('startsWith - positive test', () => {
            let result = StringExtensions.startsWith("abcdefg", "abcd");
            expect(result).toBe(true);
        });

        it('startsWith - negative test', () => {
            let result = StringExtensions.startsWith("abcdefg", "gfe");
            expect(result).toBe(false);
        });

        it('startsWith - case sensitivity test', () => {
            let result = StringExtensions.startsWith("abcdefg", "abC");
            expect(result).toBe(false);
        });

        it('ensureUniqueNames - basic', () => {
            let result = StringExtensions.ensureUniqueNames(['a', 'b']);
            expect(result[0]).toBe('a');
            expect(result[1]).toBe('b');
        });

        it('ensureUniqueNames - simple repeat', () => {
            let result = StringExtensions.ensureUniqueNames(['a', 'a', 'f', 'a']);
            expect(result[0]).toBe('a');
            expect(result[1]).toBe('a.1');
            expect(result[2]).toBe('f');
            expect(result[3]).toBe('a.2');
        });

        it('ensureUniqueNames - original name kept regardless of order', () => {
            let result = StringExtensions.ensureUniqueNames(['a', 'a', 'a', 'a.2', 'a.2']);
            expect(result[0]).toBe('a');
            expect(result[1]).toBe('a.1');
            expect(result[2]).toBe('a.3');
            expect(result[3]).toBe('a.2');
            expect(result[4]).toBe('a.2.1');
        });

        it('normalizeFileName - string with quote', () => {
            expect(StringExtensions.normalizeFileName('Hello"World')).toEqual('HelloWorld');
        });

        it('normalizeFileName - string with all reserved characters', () => {
            expect(StringExtensions.normalizeFileName('<>:"/\\|?*')).toEqual('');
        });

        it('stringyAsPrettyJSON', () => {
            let testObj = {
                name: 'foo',
                subs: [
                    { name: 'bar' },
                    { name: 'baz' }]
            };

            expect(StringExtensions.stringifyAsPrettyJSON(testObj)).toEqual('{"name":"foo","subs":[{"name":"bar"},{"name":"baz"}]}');
        });

        it('deriveClsCompliantName - valid input unchanged', () => {
            var input = "valid";

            expect(StringExtensions.deriveClsCompliantName(input, "fallback")).toBe(input);
        });

        it('deriveClsCompliantName - fallback returned if input string is invalid', () => {
            var input = "!!!";
            var fallback = "fallback";

            expect(StringExtensions.deriveClsCompliantName(input, fallback)).toBe(fallback);
        });

        it('deriveClsCompliantName - leading nonalpha characters removed', () => {
            var input = "123!@#$%^&*()-_abc123";

            expect(StringExtensions.deriveClsCompliantName(input, "fallback")).toBe("abc123");
        });

        it('deriveClsCompliantName - non-leading non-CLS non-unicode separators transformed to underscore', () => {
            var input = "abc./\\- :123";

            expect(StringExtensions.deriveClsCompliantName(input, "fallback")).toBe("abc______123");
        });

        it('deriveClsCompliantName - non-leading non-CLS unicode separators transformed to underscore', () => {
            var unicodeInput = "abc\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000123";

            expect(StringExtensions.deriveClsCompliantName(unicodeInput, "fallback")).toBe("abc___________________123");
        });

        it('deriveClsCompliantName - non-CLS non-separator characters removed', () => {
            var unicodeInput = "abc!@#$%^&*()123";

            expect(StringExtensions.deriveClsCompliantName(unicodeInput, "fallback")).toBe("abc123");
        });
        
        it('contains', () => {
            expect(StringExtensions.contains('work it harder', 'work')).toBe(true, 'start');
            expect(StringExtensions.contains('work it harder', 'it')).toBe(true, 'middle');
            expect(StringExtensions.contains('work it harder', 'harder')).toBe(true, 'end');
            expect(StringExtensions.contains('work it harder', 'work it')).toBe(true, 'with space');
            
            expect(StringExtensions.contains('harder', 'work it harder')).toBe(false);
            
            expect(StringExtensions.contains('work it harder', 'HARDER')).toBe(false, 'lower-case vs. upper-case');
            expect(StringExtensions.contains('WORK IT HARDER', 'harder')).toBe(false, 'upper-case vs. lower-case');
            
            expect(StringExtensions.contains(null, 'null')).toBe(false, "null source");
            expect(StringExtensions.contains(undefined, 'undefined')).toBe(false, "null source");
            expect(StringExtensions.contains('', 'empty')).toBe(false, "empty source");
            expect(StringExtensions.contains('non-empty', '')).toBe(true, "empty substring");
        });
        
        it('containsIgnoreCase', () => {
            expect(StringExtensions.containsIgnoreCase('make it better', 'make')).toBe(true, 'start');
            expect(StringExtensions.containsIgnoreCase('make it better', 'it')).toBe(true, 'middle');
            expect(StringExtensions.containsIgnoreCase('make it better', 'better')).toBe(true, 'start');
            expect(StringExtensions.containsIgnoreCase('make it better', 'make it')).toBe(true, 'with space');
            
            expect(StringExtensions.containsIgnoreCase('better', 'make it better')).toBe(false);
            
            expect(StringExtensions.containsIgnoreCase('make it better', 'MAKE')).toBe(true, 'start, lower-case vs. upper-case');
            expect(StringExtensions.containsIgnoreCase('make it better', 'IT')).toBe(true, 'middle, lower-case vs. upper-case');
            expect(StringExtensions.containsIgnoreCase('make it better', 'BETTER')).toBe(true, 'end, lower-case vs. upper-case');
            expect(StringExtensions.containsIgnoreCase('MAKE IT BETTER', 'make it')).toBe(true, 'with space, upper-case vs. lower-case');
            
            expect(StringExtensions.containsIgnoreCase(null, 'null')).toBe(false, "null source");
            expect(StringExtensions.containsIgnoreCase(undefined, 'undefined')).toBe(false, "null source");
            expect(StringExtensions.containsIgnoreCase('', 'empty')).toBe(false, "empty string source");
            expect(StringExtensions.containsIgnoreCase('non-empty', '')).toBe(true, "empty substring");
        });
    });
}