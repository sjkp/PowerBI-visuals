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
    import Color = jsCommon.Color;

    describe('Color', () => {
        describe('parseColorString', () => {
            it('invalid hex', () => {
                let invalidStrings = [
                    '#',
                    '#12',
                    '#1234',
                    '#12345',
                    '#12345',
                    '#1234567',
                    '#xxx',
                    '#xxxxxx',
                ];

                _.all(invalidStrings, (s) => expect(Color.parseColorString(s)).toBeUndefined());
            });

            it('valid hex', () => {
                expect(Color.parseColorString('#09f')).toEqual({
                    R: 0,
                    G: parseInt('99', 16),
                    B: parseInt('ff', 16),
                });

                expect(Color.parseColorString('#09afAa')).toEqual({
                    R: parseInt('09', 16),
                    G: parseInt('af', 16),
                    B: parseInt('aa', 16),
                });
            });

            it('invalid rgb()', () => {
                let invalidStrings = [
                    'rgb()',
                    'rgb(1)',
                    'rgb(1, 2)',
                    'rgb(1, 2, 3, 4)',
                    'rgb(1.0, 2, 3)',
                    'rgb(aa, 2, 3)',
                ];

                _.all(invalidStrings, (s) => expect(Color.parseColorString(s)).toBeUndefined());
            });

            it('valid rgb()', () => {
                expect(Color.parseColorString('rgb(1, 2, 3)')).toEqual({
                    R: 1,
                    G: 2,
                    B: 3,
                });
            });

            it('invalid rgba()', () => {
                let invalidStrings = [
                    'rgba()',
                    'rgba(1)',
                    'rgba(1, 2)',
                    'rgba(1, 2, 3)',
                    'rgba(1.0, 2, 3)',
                    'rgba(aa, 2, 3)',
                ];

                _.all(invalidStrings, (s) => expect(Color.parseColorString(s)).toBeUndefined());
            });

            it('valid rgba()', () => {
                expect(Color.parseColorString('rgba(1, 2, 3, 1.0)')).toEqual({
                    R: 1,
                    G: 2,
                    B: 3,
                    A: 1.0,
                });

                expect(Color.parseColorString('rgba(1, 2, 3, 0.19)')).toEqual({
                    R: 1,
                    G: 2,
                    B: 3,
                    A: 0.19,
                });

                expect(Color.parseColorString('rgba(1, 2, 3, .19)')).toEqual({
                    R: 1,
                    G: 2,
                    B: 3,
                    A: 0.19,
                });

                expect(Color.parseColorString('rgba(1, 2, 3, 1)')).toEqual({
                    R: 1,
                    G: 2,
                    B: 3,
                    A: 1.0,
                });
            });
        });

        describe('normalizeToHexString', () => {
            it('hex -> hex', () => {
                expect(Color.normalizeToHexString('#123456')).toEqual('#123456');
                expect(Color.normalizeToHexString('#123')).toEqual('#112233');
            });

            it('rgb -> hex', () => {
                expect(Color.normalizeToHexString('rgb(1, 26, 3)')).toEqual('#011A03');
                expect(Color.normalizeToHexString('rgb(1, 500, 3)')).toEqual('#01FF03');
            });

            it('rgba -> hex', () => {
                expect(Color.normalizeToHexString('rgba(1, 26, 3, 1.0)')).toEqual('#011A03');
                expect(Color.normalizeToHexString('rgba(1, 26, 3, 0.0)')).toEqual('#011A03');
                expect(Color.normalizeToHexString('rgba(1, 500, 3, 1.0)')).toEqual('#01FF03');
            });
        });

        describe('rotate', () => {
            it("zero", () => {
                var originalColor = "#45D0E8";
                expect(Color.rotate(originalColor, 0)).toBe(originalColor);
            });

            it("360 return original", () => {
                var originalColor = "#45D0E8";
                expect(Color.rotate(originalColor, 1)).toBe(originalColor);
            });

            it("multiple times", () => {
                var originalColor = "#45D0E8";
                var color90degrees = Color.rotate(originalColor, 0.25);
                expect(color90degrees).toBe("#AE45E8");
                var color180degrees = Color.rotate(color90degrees, 0.25);
                expect(color180degrees).toBe("#E85C45");
                var color270degrees = Color.rotate(color180degrees, 0.25);
                expect(color270degrees).toBe("#7FE845");
                var color360degrees = Color.rotate(color270degrees, 0.25);
                expect(color360degrees).toBe(originalColor);
            });
        });

        describe('darken', () => {
            it("basic", () => {
                var originalColorString = "#FFFFFF";
                var originalColor = Color.parseColorString(originalColorString);
                var darkenValue = Color.darken(originalColor, 255 * 0.25);
                var darkenValueString = Color.hexString(darkenValue);
                expect(darkenValueString).toBe("#C0C0C0");
            });

            it("edge case", () => {
                var originalColorString = "#000000";
                var originalColor = Color.parseColorString(originalColorString);
                var darkenValue = Color.darken(originalColor, 255 * 0.25);
                var darkenValueString = Color.hexString(darkenValue);
                expect(darkenValueString).toBe(originalColorString);
            });
        });
    });
}