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

module jasmine {
    type ObjectOrArray = {} | any[];
    type ObjectKey = string | number;

    export interface Matchers {
        /** Performs a deep comparison of all enumerable properties, including those defined by object prototypes. */
        toEqualDeep(expected: {}, failureMessage?: string): void;
        toEqualDeep(expected: any[], failureMessage?: string): void;
    }

    beforeEach(() => {
        addMatchers({
            toEqualDeep: (util: MatchersUtil, customEqualityTesters: CustomEqualityTester[]): CustomMatcher => {
                return {
                    compare: (actual, expected, failureMessage) => toEqualDeep(util, actual, expected, failureMessage, []),
                };
            }
        });
    });

    function toEqualDeep(util: MatchersUtil, actual: any, expected: any, failureMessage: string, path: ObjectKey[]): CustomMatcherResult {
        debug.assertValue(util, 'util');
        debug.assertAnyValue(actual, 'actual');
        debug.assertAnyValue(expected, 'expected');
        debug.assertAnyValue(failureMessage, 'failureMessage');
        debug.assertValue(path, 'path');

        if (path.length > 1000) {
            throw "toEqualDeep: exceeded max depth -- likely a cycle in object graph.";
        }

        let matcherResult: CustomMatcherResult;
        if (actual === expected) {
            matcherResult = { pass: true };
        }
        else {
            let type = typeof expected;
            if (type !== typeof actual) {
                matcherResult = {
                    pass: false,
                    message: buildFailureMessage('to be same type as', util, actual, expected, failureMessage, path),
                };
            }
            else if (type === 'function') {
                matcherResult = { pass: true };
            }
            else if (type === 'object' && actual != null && expected != null) {
                matcherResult = deepCompareObj(util, actual, expected, failureMessage, path);
            }
            else {
                matcherResult = {
                    pass: false,
                    message: buildFailureMessage('to equal', util, actual, expected, failureMessage, path),
                };
            }

            if (!matcherResult.pass) {
                // Finally, if all previous checks indicates that expected != actual, we will check for the case
                // where either 'actual' and/or 'expected' is created by jasmine.any(...)...
                // See comments inside compareJasmineAny(...) for unfortunate details.
                let jasmineAnyResult = fallbackCompareForJasmineAny(util, actual, expected, failureMessage, path);
                if (jasmineAnyResult)
                    matcherResult = jasmineAnyResult;
            }
        }

        return matcherResult;
    }

    function deepCompareObj(util: MatchersUtil, actual: ObjectOrArray, expected: ObjectOrArray, failureMessage: string, path: ObjectKey[]): CustomMatcherResult {
        debug.assertValue(util, 'util');
        debug.assert(_.isObject(actual), '_.isObject(actual)');
        debug.assert(_.isObject(expected), '_.isObject(expected)');
        debug.assertAnyValue(failureMessage, 'failureMessage');
        debug.assertValue(path, 'path');

        let actualKeys: ObjectKey[];
        let expectedKeys: ObjectKey[];

        if (isArray(actual)) {
            if (isArray(expected)) {
                if (actual.length === expected.length) {
                    actualKeys = expectedKeys = _.range(actual.length);
                }
                else {
                    path.push('length');
                }
            }
        }
        else if (!isArray(expected)) {
            actualKeys = getKeys(actual);
            expectedKeys = getKeys(expected);
        }

        if (actualKeys && expectedKeys) {
            if (_.isEqual(actualKeys, expectedKeys)) {
                for (let key of actualKeys) {
                    path.push(key);
                    let itemResult = toEqualDeep(util, actual[key], expected[key], failureMessage, path);

                    if (!itemResult.pass) {
                        itemResult.message = buildFailureMessage('to equal deep', util, actual, expected, failureMessage, path);
                        return itemResult;
                    }

                    path.pop();
                }

                return { pass: true };
            }
            else {
                let failingKeys = _.filter(actualKeys, key => !_.contains(expectedKeys, key));
                if (_.isEmpty(failingKeys))
                    failingKeys = _.filter(expectedKeys, key => !_.contains(actualKeys, key));

                path.push('{' + failingKeys.join('|') + '}');
            }
        }

        return {
            pass: false,
            message: buildFailureMessage('to equal deep', util, actual, expected, failureMessage, path),
        };
    }

    function buildFailureMessage(
        message: string,
        util: MatchersUtil,
        actual: ObjectOrArray,
        expected: ObjectOrArray,
        failureMessage: string,
        path: ObjectKey[]): string {
        debug.assertValue(message, 'message');
        debug.assertValue(util, 'util');
        debug.assertAnyValue(actual, 'actual');
        debug.assertAnyValue(expected, 'expected');
        debug.assertAnyValue(failureMessage, 'failureMessage');
        debug.assertValue(path, 'path');

        return 'at: [' + path.join('].[') + ']: ' + util.buildFailureMessage(message, false, actual, expected, failureMessage);
    }

    function getKeys(obj: {}): string[] {
        debug.assertValue(obj, 'obj');

        let keys: string[] = [];

        let nextPrototype = obj;
        while (nextPrototype != null) {
            keys.push(...Object.keys(nextPrototype));

            nextPrototype = Object.getPrototypeOf(nextPrototype);
        }

        // If obj[key] is undefined, then it is as good as not having that property.  
        // This matters if the inherited obj overrides a property with undefined 
        // (using the delete keyword on inherited.prop1 deletes the 'prop1' property on inherited 
        // but does NOT delete any 'prop1' property on the parent, hence setting
        // inherted.prop1 = undefined is the only way to remove of the property on inherited).
        return _.chain(keys)
            .sort()
            .uniq()
            .filter(key => !_.isObject(obj) || (obj[key] !== undefined))
            .value();
    }

    /** Checks if the given object is an Array, and looking all the way up the prototype chain. */
    function isArray(obj: {}): obj is Array<any> {
        debug.assertValue(obj, 'obj');

        while (obj != null) {
            if (_.isArray(obj))
                return true;

            obj = Object.getPrototypeOf(obj);
        }

        return false;
    }

    function fallbackCompareForJasmineAny(util: MatchersUtil, actual: any, expected: any, failureMessage: string, path: ObjectKey[]): CustomMatcherResult {
        if (isJasmine24()) {
            // For handling jasmine.any(aClass: any): if 'actual' and/or 'expected' are created by jasmine.any()...
            let asymmetricResult = asymmetricMatch(actual, expected);
            if (asymmetricResult !== undefined) {
                let matchResult: CustomMatcherResult = {
                    pass: asymmetricResult
                };
                if (!matchResult.pass) {
                    matchResult.message = buildFailureMessage('to be an object that is compatible with the type specified in jasmine.any(...)', util, actual, expected, failureMessage, path);
                }

                return matchResult;
            }
        }
        else {
            // NOTE: this is fallback code that should be removed when we have phased out Jasmine 2.1.

            if (isJasmineAny(actual)) {
                return {
                    pass: actual.jasmineMatches(expected),
                };
            }

            if (isJasmineAny(expected)) {
                return {
                    pass: expected.jasmineMatches(actual),
                };
            }
        }
    }

    // The logic of this check is based on the logic in the framework code, jasmine.js, itself.
    function isAsymmetric(obj: any): boolean {
        return obj && (typeof obj.asymmetricMatch === 'function');
    }

    // The logic of this check is based on the logic in the framework code, jasmine.js, itself.
    // It is unfortunate that we cannot directly invoke this function in jasmine.js from our code because it is hidden behind a module.
    // Returns undefined if both a and b support asymmetric match, or if neither a nor b supports asymmetric match.
    function asymmetricMatch(a: any, b: any): boolean {
        let asymmetricA: boolean = isAsymmetric(a),
            asymmetricB: boolean = isAsymmetric(b);

        if (asymmetricA === asymmetricB) {
            return undefined;
        }

        if (asymmetricA) {
            return a.asymmetricMatch(b);
        }

        if (asymmetricB) {
            return b.asymmetricMatch(a);
        }
    }

    function isJasmine24(): boolean {
        return !!jasmine.arrayContaining;
    }

    function isJasmineAny(obj): obj is jasmine.Any {
        return obj && !!(<jasmine.Any>obj).jasmineMatches;
    }
}