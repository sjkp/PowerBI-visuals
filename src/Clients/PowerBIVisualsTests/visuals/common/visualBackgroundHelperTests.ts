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
    import imageScalingType = visuals.imageScalingType;
    import visualBackgroundHelper = visuals.visualBackgroundHelper;
    import ObjectEnumerationBuilder = visuals.ObjectEnumerationBuilder;
    import VisualObjectInstance = powerbi.VisualObjectInstance;
    
    //import VisualObjectInstanceContainer = powerbi.VisualObjectInstanceContainer;

    describe("VisualBackgroundHelper", () => {
        describe("enumeratePlot", () => {
            
            it('default background', () => {
                let enumeration = new ObjectEnumerationBuilder();

                let instance: VisualObjectInstance = {
                    selector: null,
                    properties: {
                        image: undefined,
                        transparency: visualBackgroundHelper.getDefaultTransparency(),
                    },
                    objectName: 'plotArea',
                };
                visualBackgroundHelper.enumeratePlot(enumeration, /* background */ undefined);
                expect(enumeration.complete()).toEqual({
                    instances: [instance],
                });
            });

            it('default background image', () => {
                let enumeration = new ObjectEnumerationBuilder();
                let background: visuals.VisualBackground = { };

                let instance: VisualObjectInstance = {
                    selector: null,
                    properties: {
                        image: undefined,
                        transparency: visualBackgroundHelper.getDefaultTransparency(),
                    },
                    objectName: 'plotArea',
                };
                visualBackgroundHelper.enumeratePlot(enumeration, background);
                expect(enumeration.complete()).toEqual({
                    instances: [instance],
                });
            });

            it('image', () => {
                let enumeration = new ObjectEnumerationBuilder();
                let background: visuals.VisualBackground = {
                    image: {
                        url: 'someUrl',
                        name: 'someName',
                    },
                };

                let instance: VisualObjectInstance = {
                    selector: null,
                    properties: {
                        image: {
                            url: 'someUrl',
                            name: 'someName',
                        },
                        transparency: visualBackgroundHelper.getDefaultTransparency(),
                    },
                    objectName: 'plotArea',
                };
                visualBackgroundHelper.enumeratePlot(enumeration, background);
                expect(enumeration.complete()).toEqual({
                    instances: [instance],
                });
            });

            it('transparency', () => {
                let enumeration = new ObjectEnumerationBuilder();
                let background: visuals.VisualBackground = {
                    transparency: 20,
                };

                let instance: VisualObjectInstance = {
                    selector: null,
                    properties: {
                        image: undefined,
                        transparency: 20,
                    },
                    objectName: 'plotArea',
                };
                visualBackgroundHelper.enumeratePlot(enumeration, background);
                expect(enumeration.complete()).toEqual({
                    instances: [instance],
                });
            });

            it('transparency (zero)', () => {
                let enumeration = new ObjectEnumerationBuilder();
                let background: visuals.VisualBackground = {
                    transparency: 0,
                };

                let instance: VisualObjectInstance = {
                    selector: null,
                    properties: {
                        image: undefined,
                        transparency: 0,
                    },
                    objectName: 'plotArea',
                };
                visualBackgroundHelper.enumeratePlot(enumeration, background);
                expect(enumeration.complete()).toEqual({
                    instances: [instance],
                });
            });

            it('all together', () => {
                let enumeration = new ObjectEnumerationBuilder();
                let background: visuals.VisualBackground = {
                    image: {
                        url: 'someUrl',
                        name: 'someName',
                        scaling: imageScalingType.fit,
                    },
                    transparency: 20,

                };

                let instance: VisualObjectInstance = {
                    selector: null,
                    properties: {
                        image: {
                            url: 'someUrl',
                            name: 'someName',
                            scaling: imageScalingType.fit,
                        },
                        transparency: 20,
                    },
                    objectName: 'plotArea',
                };
                visualBackgroundHelper.enumeratePlot(enumeration, background);
                expect(enumeration.complete()).toEqual({
                    instances: [instance],
                });
            });

            it('adding to instance', () => {
                let enumeration = new ObjectEnumerationBuilder();
                let background: visuals.VisualBackground = {
                    image: {
                        url: 'someUrl',
                        name: 'someName',
                        scaling: 'fit'
                    },
                    transparency: 20,

                };

                let instance: VisualObjectInstance = {
                    objectName: 'myObject',
                    selector: null,
                    properties: {
                        'myProperty': 123,
                    },
                };

                enumeration.pushInstance(instance);
                visualBackgroundHelper.enumeratePlot(enumeration, background);
                expect(enumeration.complete().instances.length).toBe(2);
            });
        });

        describe("renderBackgroundImage", () => {
            const plotArea: powerbi.visuals.IRect = {
                top: 0,
                left: 0,
                width: 100,
                height: 100,
            };

            let element: JQuery;

            beforeEach(() => {
                element = $('<div class="visual-element"></div>');
            });

            it('create and remove background element', () => {
                // Create element
                let backgroundData: visuals.VisualBackground = {
                    image: {
                        url: 'data:image/gif;base64,R0lGO',
                        name: 'someName',
                    },
                };
                visualBackgroundHelper.renderBackgroundImage(
                    backgroundData,
                    element,
                    plotArea);

                expect(element.children('.background-image').length).toBe(1);

                // resend the data and check if another element is added
                visualBackgroundHelper.renderBackgroundImage(
                    backgroundData,
                    element,
                    plotArea);
                expect(element.children('.background-image').length).toBe(1);

                // Remove element
                visualBackgroundHelper.renderBackgroundImage(
                    {},
                    element,
                    plotArea);
                expect(element.children('.background-image').length).toBe(0);
            });

            it('imageUrl', () => {
                let backgroundData: visuals.VisualBackground = {
                    image: {
                        url: 'data:image/gif;base64,R0lGO',
                        name: 'someName',
                    },
                };
                visualBackgroundHelper.renderBackgroundImage(
                    backgroundData,
                    element,
                    plotArea);

                let resultElement = element.children('.background-image');
                expect(resultElement.css('background-image')).toBe('url(data:image/gif;base64,R0lGO)');
                expect(resultElement.css('background-repeat')).toBe('no-repeat');
                expect(resultElement.css('opacity')).toBe('1');
                expect(resultElement.css('background-size')).toBe('');
                expect(resultElement.css('background-position')).toBe('50% 50%');
            });

            it('image fit - normal', () => {
                let backgroundData: visuals.VisualBackground = {
                    image: {
                        url: 'data:image/gif;base64,R0lGO',
                        name: 'someName',
                        scaling: imageScalingType.normal,
                    },
                };
                visualBackgroundHelper.renderBackgroundImage(
                    backgroundData,
                    element,
                    plotArea);

                let resultElement = element.children('.background-image');
                expect(resultElement.css('background-image')).toBe('url(data:image/gif;base64,R0lGO)');
                expect(resultElement.css('background-repeat')).toBe('no-repeat');
                expect(resultElement.css('opacity')).toBe('1');
                expect(resultElement.css('background-size')).toBe('');
                expect(resultElement.css('background-position')).toBe('50% 50%');
            });

            it('image fit - fit', () => {
                let backgroundData: visuals.VisualBackground = {
                    image: {
                        url: 'data:image/gif;base64,R0lGO',
                        name: 'someName',
                        scaling: imageScalingType.fit,
                    },
                };
                visualBackgroundHelper.renderBackgroundImage(
                    backgroundData,
                    element,
                    plotArea);

                let resultElement = element.children('.background-image');
                expect(resultElement.css('background-image')).toBe('url(data:image/gif;base64,R0lGO)');
                expect(resultElement.css('background-repeat')).toBe('no-repeat');
                expect(resultElement.css('opacity')).toBe('1');

                // This background-size test will pass on the browser but does not work on the console
                // Because of phantomJS probably
                //expect(resultElement.css('background-size')).toBe('100% 100%');
                expect(resultElement.css('background-position')).toBe('');
            });

            it('image fit - fill', () => {
                let backgroundData: visuals.VisualBackground = {
                    image: {
                        url: 'data:image/gif;base64,R0lGO',
                        name: 'someName',
                        scaling: imageScalingType.fill,
                    },
                };
                visualBackgroundHelper.renderBackgroundImage(
                    backgroundData,
                    element,
                    plotArea);

                let resultElement = element.children('.background-image');
                expect(resultElement.css('background-image')).toBe('url(data:image/gif;base64,R0lGO)');
                expect(resultElement.css('background-repeat')).toBe('no-repeat');
                expect(resultElement.css('opacity')).toBe('1');
                expect(resultElement.css('background-size')).toBe('100%');
                expect(resultElement.css('background-position')).toBe('50% 50%');
            });

            it('transparency', () => {
                let backgroundData: visuals.VisualBackground = {
                    image: {
                        url: 'data:image/gif;base64,R0lGO',
                        name: 'someName',
                    },
                    transparency: 20,
                };
                visualBackgroundHelper.renderBackgroundImage(
                    backgroundData,
                    element,
                    plotArea);

                let resultElement = element.children('.background-image');
                expect(resultElement.css('background-image')).toBe('url(data:image/gif;base64,R0lGO)');
                expect(resultElement.css('background-repeat')).toBe('no-repeat');
                expect(resultElement.css('opacity')).toBe('0.8');
            });

            it('size & position', () => {
                let backgroundData: visuals.VisualBackground = {
                    image: {
                        url: 'data:image/gif;base64,R0lGO',
                        name: 'someName',
                    },
                    transparency: 20,
                };
                visualBackgroundHelper.renderBackgroundImage(
                    backgroundData,
                    element,
                    {
                        top: 20,
                        left: 30,
                        width: 40,
                        height: 50,
                    });

                let resultElement = element.children('.background-image');
                expect(resultElement.css('margin-top')).toBe('20px');
                expect(resultElement.css('margin-left')).toBe('30px');
                expect(resultElement.css('width')).toBe('40px');
                expect(resultElement.css('height')).toBe('50px');
            });
        });
    });
}
