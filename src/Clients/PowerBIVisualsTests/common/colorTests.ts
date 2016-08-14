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
                let originalColor = "#45D0E8";
                expect(Color.rotate(originalColor, 0)).toBe(originalColor);
            });

            it("360 return original", () => {
                let originalColor = "#45D0E8";
                expect(Color.rotate(originalColor, 1)).toBe(originalColor);
            });

            it("multiple times", () => {
                let originalColor = "#45D0E8";
                let color90degrees = Color.rotate(originalColor, 0.25);
                expect(color90degrees).toBe("#AE45E8");
                let color180degrees = Color.rotate(color90degrees, 0.25);
                expect(color180degrees).toBe("#E85C45");
                let color270degrees = Color.rotate(color180degrees, 0.25);
                expect(color270degrees).toBe("#7FE845");
                let color360degrees = Color.rotate(color270degrees, 0.25);
                expect(color360degrees).toBe(originalColor);
            });
        });

        describe('darken', () => {
            it("basic", () => {
                let originalColorString = "#FFFFFF";
                let originalColor = Color.parseColorString(originalColorString);
                let darkenValue = Color.darken(originalColor, 255 * 0.25);
                let darkenValueString = Color.hexString(darkenValue);
                expect(darkenValueString).toBe("#C0C0C0");
            });

            it("edge case", () => {
                let originalColorString = "#000000";
                let originalColor = Color.parseColorString(originalColorString);
                let darkenValue = Color.darken(originalColor, 255 * 0.25);
                let darkenValueString = Color.hexString(darkenValue);
                expect(darkenValueString).toBe(originalColorString);
            });
        });

        describe('overlay', () => {
            describe('channel', () => {
                it('with opacity=1 returns foreColor', () => {
                    expect(Color.channelBlend(0, 1, 255)).toBe(0);
                    expect(Color.channelBlend(128, 1, 255)).toBe(128);
                    expect(Color.channelBlend(255, 1, 0)).toBe(255);
                    expect(Color.channelBlend(88, 1, 88)).toBe(88);
                });

                it('with opacity=0 returns backColor', () => {
                    expect(Color.channelBlend(0, 0, 255)).toBe(255);
                    expect(Color.channelBlend(128, 0, 255)).toBe(255);
                    expect(Color.channelBlend(255, 0, 0)).toBe(0);
                    expect(Color.channelBlend(88, 0, 88)).toBe(88);
                });

                it('with opacity=0.5 returns midpoint', () => {
                    expect(Color.channelBlend(0, 0.5, 255)).toBe(128);
                    expect(Color.channelBlend(255, 0.5, 0)).toBe(128);
                    expect(Color.channelBlend(99, 0.5, 101)).toBe(100);
                    expect(Color.channelBlend(101, 0.5, 99)).toBe(100);
                });

                it('with two similar colors returns the same color', () => {
                    expect(Color.channelBlend(128, 0, 128)).toBe(128);
                    expect(Color.channelBlend(128, 1, 128)).toBe(128);
                    expect(Color.channelBlend(128, 0.4, 128)).toBe(128);
                });

                it('ensures opacity is valid', () => {
                    expect(Color.channelBlend(88, -1, 255)).toBe(255);
                    expect(Color.channelBlend(88, 2, 255)).toBe(88);
                });

                it('ensures foreChannel is valid', () => {
                    expect(Color.channelBlend(-1, 1, 88)).toBe(0);
                    expect(Color.channelBlend(256, 1, 88)).toBe(255);
                });

                it('ensures backChannel is valid', () => {
                    expect(Color.channelBlend(88, 0, -1)).toBe(0);
                    expect(Color.channelBlend(88, 0, 256)).toBe(255);
                });
            });

            describe('hex colors', () => {
                let yellow = "#FFFF00";
                let black = "#000000";
                let white = "#FFFFFF";

                it('with opacity=1 gives foreColor', () => {
                    expect(Color.hexBlend(yellow,1, white)).toEqual(yellow);
                    expect(Color.hexBlend(yellow, 1, black)).toEqual(yellow);
                });

                it('with opacity=0 gives backColor', () => {
                    expect(Color.hexBlend(yellow, 0, white)).toEqual(white);
                    expect(Color.hexBlend(yellow, 0, black)).toEqual(black);
                });

                it('with opacity=0.5 gives midpoint', () => {
                    expect(Color.hexBlend(yellow, 0.5, white)).toEqual("#FFFF80");
                    expect(Color.hexBlend(white, 0.5, yellow)).toEqual("#FFFF80");

                    expect(Color.hexBlend(yellow, 0.5, black)).toEqual("#808000");
                    expect(Color.hexBlend(black, 0.5, yellow)).toEqual("#808000");
                });

                it('works with various opacity values', () => {
                    let color1 = "#FF33FF";
                    let color2 = "#6699FF";

                    let opacity = [1, 0.75, 0.5, 0.25, 0];
                    let colors = [
                        "#FF33FF",
                        "#D94DFF",
                        "#B366FF",
                        "#8C80FF",
                        "#6699FF"];

                    for (let i = 0, len = colors.length; i < len; i++) {
                        expect(Color.hexBlend(color1, opacity[i], color2)).toEqual(colors[i]);
                    }
                });

                it('calculateHighlightColor', () => {
                    let yellowRGB = Color.parseColorString(yellow);
                    expect(Color.calculateHighlightColor(yellowRGB, 0.8, 0.2)).toEqual('#CCCC00');
                    let blackRGB = Color.parseColorString(black);
                    expect(Color.calculateHighlightColor(blackRGB, 0.8, 0.2)).toEqual('#333333');
                });
            });
        });
    });
}
