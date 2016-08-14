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
    import TextProperties = powerbi.TextProperties;
    import TextMeasurementService = powerbi.TextMeasurementService;

    describe("Text measurement service", () => {
        let Ellipsis = '…';

        describe('measureSvgTextElementWidth', () => {
            it('svg text element', () => {
                let element = $("<text>")
                    .text("PowerBI rocks!")
                    .css({
                        "font-family": "Arial",
                        "font-size": "11px",
                        "font-weight": "bold",
                        "font-style": "italic",
                        "white-space": "nowrap",
                    });
                attachToDom(element);

                let width = TextMeasurementService.measureSvgTextElementWidth(<any>element.get(0));
                expect(width).toBeGreaterThan(50);
            });
        });

        it("measureSvgTextWidth", () => {
            let getTextWidth = (fontSize: number) => {
                let textProperties = getTextProperties(fontSize);
                return TextMeasurementService.measureSvgTextWidth(textProperties);
            };

            expect(getTextWidth(10)).toBeLessThan(getTextWidth(12));
        });

        it("estimateSvgTextHeight", () => {
            let getTextHeight = (fontSize: number) => {
                let textProperties = getTextProperties(fontSize);
                return TextMeasurementService.estimateSvgTextHeight(textProperties);
            };

            expect(getTextHeight(10)).toBeLessThan(getTextHeight(12));
        });

        it("estimateSvgTextBaselineDelta", () => {
            let getTextBaselineDelta = (fontSize: number) => {
                let textProperties = getTextProperties(fontSize);
                return TextMeasurementService.estimateSvgTextBaselineDelta(textProperties);
            };

            expect(getTextBaselineDelta(10)).toBeLessThan(getTextBaselineDelta(20));
        });

        it("estimateSvgTextHeight numeric", () => {
            let getTextHeight = (fontSize: number, numeric) => {
                let textProperties = getTextProperties(fontSize);
                return TextMeasurementService.estimateSvgTextHeight(textProperties, numeric);
            };

            expect(getTextHeight(12, true)).toBeLessThan(getTextHeight(12, false));
        });

        describe('estimate cache', () => {
            let setDataSpy: jasmine.Spy;

            beforeEach(() => {
                powerbi.ephemeralStorageService['clearCache']();
                setDataSpy = spyOn(powerbi.ephemeralStorageService, 'setData');
                setDataSpy.and.callThrough();
            });

            it("estimateSvgTextHeight does cache", () => {
                TextMeasurementService.estimateSvgTextHeight(getTextProperties(10, 'A', 'RandomFont'));
                TextMeasurementService.estimateSvgTextHeight(getTextProperties(10, 'B', 'RandomFont'));
                TextMeasurementService.estimateSvgTextHeight(getTextProperties(14, 'C', 'RandomFont'));
                TextMeasurementService.estimateSvgTextHeight(getTextProperties(14, 'D', 'RandomFont'));
                TextMeasurementService.estimateSvgTextHeight(getTextProperties(10, 'E', 'RandomFont2'));
                TextMeasurementService.estimateSvgTextHeight(getTextProperties(10, 'F', 'RandomFont2'));

                expect(setDataSpy.calls.count()).toBe(3);
            });

            it("estimateSvgTextBaselineDelta does cache", () => {
                TextMeasurementService.estimateSvgTextBaselineDelta(getTextProperties(10, 'A', 'RandomFont'));
                TextMeasurementService.estimateSvgTextBaselineDelta(getTextProperties(10, 'B', 'RandomFont'));
                TextMeasurementService.estimateSvgTextBaselineDelta(getTextProperties(14, 'C', 'RandomFont'));
                TextMeasurementService.estimateSvgTextBaselineDelta(getTextProperties(14, 'D', 'RandomFont'));
                TextMeasurementService.estimateSvgTextBaselineDelta(getTextProperties(10, 'E', 'RandomFont2'));
                TextMeasurementService.estimateSvgTextBaselineDelta(getTextProperties(10, 'F', 'RandomFont2'));

                expect(setDataSpy.calls.count()).toBe(3);
            });

            it('estimateSvgTextHeight does not cache when results are wrong', () => {
                let textProperties = getTextProperties(10, 'A', 'RandomFont');

                // Mock measureSvgTextRect() to mimic the behavior when the iframe is disconnected / hidden.
                let measureSvgTextRectSpy = spyOn(TextMeasurementService, 'measureSvgTextRect');
                measureSvgTextRectSpy.and.returnValue({
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                });

                let wrongHeight = TextMeasurementService.estimateSvgTextHeight(textProperties);
                expect(wrongHeight).toBe(0);

                // Calling again with the same text properties should not retrieve the incorrect height from the cache.
                measureSvgTextRectSpy.and.callThrough();
                let correctHeight = TextMeasurementService.estimateSvgTextHeight(textProperties);
                expect(correctHeight).toBeGreaterThan(0);
            });
        });

        it("measureSvgTextHeight", () => {
            let getTextHeight = (fontSize: number) => {
                let textProperties = getTextProperties(fontSize);
                return TextMeasurementService.measureSvgTextHeight(textProperties);
            };

            expect(getTextHeight(10)).toBeLessThan(getTextHeight(12));
        });

        it("measureSvgTextRect", () => {
            let getTextRect = (fontSize: number) => {
                let textProperties = getTextProperties(fontSize);
                return TextMeasurementService.measureSvgTextRect(textProperties);
            };

            let smallRect = getTextRect(10);
            let largeRect = getTextRect(14);

            expect(smallRect.height).toBeLessThan(largeRect.height);
            //the y point of the rect is at the top of the rect, the y point of the text is (almost) at the bottom of the text.
            //both y will be less than 0, testing the absolute y value.
            expect(Math.abs(smallRect.y)).toBeLessThan(Math.abs(largeRect.y));
        });

        it("getMeasurementProperties", () => {
            let element = $("<text>")
                .text("PowerBI rocks!")
                .css({
                    "font-family": "Arial",
                    "font-size": "11px",
                    "font-weight": "bold",
                    "font-style": "italic",
                    "font-variant": "normal",
                    "white-space": "nowrap",
                });
            attachToDom(element);

            let properties = TextMeasurementService.getMeasurementProperties(element);
            let expectedProperties: TextProperties = {
                fontFamily: "Arial",
                fontSize: "11px",
                fontWeight: "bold",
                fontStyle: "italic",
                whiteSpace: "nowrap",
                fontVariant: "normal",
                text: "PowerBI rocks!",
            };

            expect(properties).toEqual(expectedProperties);
        });

        describe("getSvgMeasurementProperties", () => {
            it("svg text element", () => {
                let svg = $("<svg>");
                let element = $("<text>")
                    .text("PowerBI rocks!")
                    .css({
                        "font-family": "Arial",
                        "font-size": "11px",
                        "font-weight": "bold",
                        "font-style": "italic",
                        "font-variant": "normal",
                        "white-space": "nowrap",
                    });
                svg.append(element);
                attachToDom(svg);

                let properties = TextMeasurementService.getSvgMeasurementProperties(<any>element[0]);
                let expectedProperties: TextProperties = {
                    fontFamily: "Arial",
                    fontSize: "11px",
                    fontWeight: "bold",
                    fontStyle: "italic",
                    whiteSpace: "nowrap",
                    fontVariant: "normal",
                    text: "PowerBI rocks!",
                };

                expect(properties).toEqual(expectedProperties);
            });
        });

        describe('getTailoredTextOrDefault', () => {
            it("without ellipsis", () => {
                let properties: TextProperties = {
                    fontFamily: "Arial",
                    fontSize: "11px",
                    fontWeight: "bold",
                    fontStyle: "italic",
                    whiteSpace: "nowrap",
                    fontVariant: "normal",
                    text: "PowerBI rocks!",
                };

                // Back up the original properties to make sure the service doesn't change them.
                let originalProperties = _.cloneDeep(properties);
                let text = TextMeasurementService.getTailoredTextOrDefault(properties, 100);

                expect(text).toEqual("PowerBI rocks!");
                expect(properties).toEqual(originalProperties);
            });

            it("with ellipsis", () => {
                let properties: TextProperties = {
                    fontFamily: "Arial",
                    fontSize: "11px",
                    fontWeight: "bold",
                    fontStyle: "italic",
                    whiteSpace: "nowrap",
                    fontVariant: "normal",
                    text: "PowerBI rocks!",
                };

                // Back up the original properties to make sure the service doesn't change them.
                let originalProperties = _.cloneDeep(properties);
                let text = TextMeasurementService.getTailoredTextOrDefault(properties, 45);

                expect(jsCommon.StringExtensions.endsWith(text, Ellipsis)).toBeTruthy();
                expect(jsCommon.StringExtensions.startsWithIgnoreCase(text, 'Pow')).toBeTruthy();
                expect(properties).toEqual(originalProperties);
            });
        });

        describe('svgEllipsis', () => {
            it("with ellipsis", () => {
                let element = createSvgTextElement("PowerBI rocks!");
                attachToDom(element);

                TextMeasurementService.svgEllipsis(<any>element[0], 20);

                let text = $(element).text();
                expect(jsCommon.StringExtensions.endsWith(text, Ellipsis)).toBeTruthy();
            });

            it("without ellipsis", () => {
                let element = createSvgTextElement("PowerBI rocks!");
                attachToDom(element);

                TextMeasurementService.svgEllipsis(<any>element[0], 100);

                let text = $(element).text();
                expect(text).toEqual("PowerBI rocks!");
            });
        });

        describe('wordBreak', () => {
            it('with no breaks', () => {
                let originalText = "ContentWithNoBreaks!";
                let element = createSvgTextElement(originalText);
                attachToDom(element);

                TextMeasurementService.wordBreak(<any>element[0], 25 /* maxLength */, 20 * 1 /* maxHeight */);

                let text = $(element).text();
                expect($(element).find('tspan').length).toBe(1);
                expect(jsCommon.StringExtensions.endsWith(text, Ellipsis)).toBeTruthy();
            });

            it('with breaks and ellipses', () => {
                let originalText = "PowerBI rocks!";
                let element = createSvgTextElement(originalText);
                attachToDom(element);

                TextMeasurementService.wordBreak(<any>element[0], 25 /* maxLength */, 20 * 2 /* maxHeight */);

                let text = $(element).text();
                expect($(element).find('tspan').length).toBe(2);
                expect(text.match(RegExp(Ellipsis, 'g')).length).toBe(2);
            });

            it('with breaks but forced to single line', () => {
                let originalText = "PowerBI rocks!";
                let element = createSvgTextElement(originalText);
                attachToDom(element);

                TextMeasurementService.wordBreak(<any>element[0], 25 /* maxLength */, 20 * 1 /* maxHeight */);

                let text = $(element).text();
                expect($(element).find('tspan').length).toBe(1);
                expect(jsCommon.StringExtensions.endsWith(text, Ellipsis)).toBeTruthy();
            });

            it('with breaks but forced to single line due to low max height', () => {
                let originalText = "PowerBI rocks!";
                let element = createSvgTextElement(originalText);
                attachToDom(element);

                TextMeasurementService.wordBreak(<any>element[0], 25 /* maxLength */, 1 /* maxHeight */);

                let text = $(element).text();
                expect($(element).find('tspan').length).toBe(1);
                expect(jsCommon.StringExtensions.endsWith(text, Ellipsis)).toBeTruthy();
            });

            it('with breaks multiple words on each line', () => {
                let originalText = "The Quick Brown Fox Jumped Over The Lazy Dog";
                let element = createSvgTextElement(originalText);
                attachToDom(element);

                TextMeasurementService.wordBreak(<any>element[0], 75 /* maxLength */, 20 * 3 /* maxHeight */);

                let text = $(element).text();
                expect($(element).find('tspan').length).toBe(3);
                expect(jsCommon.StringExtensions.endsWith(text, Ellipsis)).toBeTruthy();
            });
        });

        describe('wordBreakOverflowingText', () => {
            it('with no breaks', () => {
                var originalText = "ContentWithNoBreaks!";
                var element = createSpanElement(originalText);
                attachToDom(element);

                TextMeasurementService.wordBreakOverflowingText(<any>element[0], 25 /* maxLength */, 20 * 1 /* maxHeight */);
                var children = getChildren(element);
                expect(children.length).toBe(1);
                helpers.verifyEllipsisActive(children.first());
            });

            it('with breaks and ellipses', () => {
                var originalText = "PowerBI rocks!";
                var element = createSpanElement(originalText);
                attachToDom(element);

                TextMeasurementService.wordBreakOverflowingText(<any>element[0], 25 /* maxLength */, 20 * 2 /* maxHeight */);

                var children = getChildren(element);
                expect(children.length).toBe(2);
                helpers.verifyEllipsisActive(children.first());
                helpers.verifyEllipsisActive(children.last());
            });

            it('with breaks but forced to single line', () => {
                var originalText = "PowerBI rocks!";
                var element = createSpanElement(originalText);
                attachToDom(element);

                TextMeasurementService.wordBreakOverflowingText(<any>element[0], 25 /* maxLength */, 20 * 1 /* maxHeight */);

                var children = getChildren(element);
                expect(children.length).toBe(1);
                helpers.verifyEllipsisActive(children.first());
            });

            it('with breaks but forced to single line due to low max height', () => {
                var originalText = "PowerBI rocks!";
                var element = createSpanElement(originalText);
                attachToDom(element);

                TextMeasurementService.wordBreakOverflowingText(<any>element[0], 25 /* maxLength */, 1 /* maxHeight */);

                var children = getChildren(element);
                expect(children.length).toBe(1);
                helpers.verifyEllipsisActive(children.first());
            });

            it('with breaks multiple words on each line', () => {
                var originalText = "The Quick Brown Fox Jumped Over The Lazy Dog";
                var element = createSpanElement(originalText);
                attachToDom(element);

                TextMeasurementService.wordBreakOverflowingText(<any>element[0], 75 /* maxLength */, 20 * 3 /* maxHeight */);

                var children = getChildren(element);
                expect(children.length).toBe(3);
                helpers.verifyEllipsisActive(children.last());
            });

            function getChildren(element: JQuery): JQuery {
                return $(element).children();
            }
        });

        function attachToDom(element: JQuery|Element): JQuery {
            let dom = powerbitests.helpers.testDom('100px', '100px');
            dom.append([element]);
            return dom;
        }

        function createSvgTextElement(text: string): SVGTextElement {
            let svg = $("<svg>");
            let element = d3.select($("<text>").get(0)).text(text);
            svg.append(element);

            return element[0];
        }

        function createSpanElement(text: string): JQuery {
            var element = $("<span>");
            element.text(text);
            
            return element;
        }

        function getTextProperties(fontSize: number, text?: string, fontFamily?: string): TextProperties {
            return {
                fontFamily: fontFamily ? fontFamily : "Arial",
                fontSize: fontSize + "px",
                text: text ? text : "PowerBI rocks!",
            };
        }
    });
}
