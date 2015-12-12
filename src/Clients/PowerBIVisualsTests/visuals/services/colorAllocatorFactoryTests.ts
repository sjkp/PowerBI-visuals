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

/// <reference path="../../_references.ts"/>

module powerbitests {
    import visuals = powerbi.visuals;

    describe("ColorAllocatorFactory - linear gradient two colors", () => {
        let colorer: powerbi.IColorAllocator;

        beforeEach(() => {
            colorer = visuals.createColorAllocatorFactory().linearGradient2({
                min: { value: 100, color: "#ff0000" },
                max: { value: 200, color: "#0000ff" }
            });
        });

        it("LinearGradient2: min value", () => {
            helpers.assertColorsMatch(colorer.color(100), "#ff0000");
        });

        it("LinearGradient2: max value", () => {
            helpers.assertColorsMatch(colorer.color(200), "#0000ff");
        });

        it("LinearGradient2: mid value", () => {
            helpers.assertColorsMatch(colorer.color(150), "#800080");
        });

        it("LinearGradient2: intermediate value", () => {
            helpers.assertColorsMatch(colorer.color(120), "#cc0033");
        });

        it("LinearGradient2 clamping - test values outside the range", () => {
            helpers.assertColorsMatch(colorer.color(90), "#ff0000");
            helpers.assertColorsMatch(colorer.color(220), "#0000ff");
        });

    });

    describe("ColorAllocatorFactory - linear gradient three colors", () => {
        let defaultColorer: powerbi.IColorAllocator;
        let options: powerbi.LinearGradient3;

        beforeEach(() => {
            options = {
                min: { value: 100, color: "#ff0000" },
                mid: { value: 150, color: "#ffffff" },
                max: { value: 200, color: "#0000ff" }
            };

            defaultColorer = visuals.createColorAllocatorFactory().linearGradient3(options, false);
        });

        it("LinearGradient3: min value", () => {
            helpers.assertColorsMatch(defaultColorer.color(100), "#ff0000");
        });

        it("LinearGradient3: max value", () => {
            helpers.assertColorsMatch(defaultColorer.color(200), "#0000ff");
        });

        it("LinearGradient3: mid value", () => {
            options.mid.value = 170;
            let colorer = visuals.createColorAllocatorFactory().linearGradient3(options, false);

            helpers.assertColorsMatch(colorer.color(170), "#ffffff");
        });

        it("LinearGradient3: intermediate value", () => {
            options.mid.value = 176;
            let colorer = visuals.createColorAllocatorFactory().linearGradient3(options, false);

            helpers.assertColorsMatch(colorer.color(178), "#eaeaff");
        });

        it("LinearGradient3: between min & mid", () => {
            options.mid.value = 176;
            let colorer = visuals.createColorAllocatorFactory().linearGradient3(options, false);

            helpers.assertColorsMatch(colorer.color(170), "#ffebeb");
        });

        it("LinearGradient3 clamping - test values outside the range", () => {
            helpers.assertColorsMatch(defaultColorer.color(0), "#ff0000");
            helpers.assertColorsMatch(defaultColorer.color(300), "#0000ff");
        });

        it("LinearGradient3: splitted scales", () => {
            let colorer = visuals.createColorAllocatorFactory().linearGradient3({
                min: { value: -50, color: "#ffff00" },
                mid: { value: 0, color: "#ffffff" },
                max: { value: 2000, color: "#0000ff" }
            }, true);

            helpers.assertColorsMatch(colorer.color(-50), "#ffff00");
            helpers.assertColorsMatch(colorer.color(-25), "#ffff80");
            helpers.assertColorsMatch(colorer.color(0), "#ffffff");
            helpers.assertColorsMatch(colorer.color(1000), "#8080ff");
            helpers.assertColorsMatch(colorer.color(2000), "#0000ff");
        });
    });
}