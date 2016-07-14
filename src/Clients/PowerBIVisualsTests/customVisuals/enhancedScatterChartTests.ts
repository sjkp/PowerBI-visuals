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

module powerbitests.customVisuals {
    import VisualClass = powerbi.visuals.samples.EnhancedScatterChart;
    import EnhancedScatterChartData = customVisuals.sampleDataViews.EnhancedScatterChartData;
    import IEnhancedScatterChartData = powerbi.visuals.samples.EnhancedScatterChartData;
    import EnhancedScatterChartDataPoint = powerbi.visuals.samples.EnhancedScatterChartDataPoint;
    import PixelConverter = jsCommon.PixelConverter;
    import Helpers = powerbitests.helpers;
    import ElementProperties = powerbi.visuals.samples.ElementProperties;
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import IDataColorPalette = powerbi.IDataColorPalette;
    import DataColorPalette = powerbi.visuals.DataColorPalette;
    import IInteractivityService = powerbi.visuals.IInteractivityService;
    import DataViewObject = powerbi.DataViewObject;
    import DataView = powerbi.DataView;
    import EnhancedScatterChartProperties = powerbi.visuals.samples.EnhancedScatterChartProperties;
    import DataViewObjectPropertyIdentifier = powerbi.DataViewObjectPropertyIdentifier;
    import VisualCapabilities = powerbi.VisualCapabilities;

    type CheckerCallback = (dataPoint: EnhancedScatterChartDataPoint, index?: number) => any;

    powerbitests.mocks.setLocale();

    describe("EnhancedScatterChart", () => {
        let visualBuilder: EnhancedScatterChartBuilder,
            defaultDataViewBuilder: EnhancedScatterChartData,
            dataView: powerbi.DataView;

        beforeEach(() => {
            visualBuilder = new EnhancedScatterChartBuilder(1000, 500);
            defaultDataViewBuilder = new EnhancedScatterChartData();

            dataView = defaultDataViewBuilder.getDataView();
        });

        describe("capabilities", () => {
            it("Should be registered", () => expect(VisualClass.capabilities).toBeDefined());

            it("Should include dataViewMappings", () => {
                expect(VisualClass.capabilities.dataViewMappings).toBeDefined();
            });

            it("Should include dataRoles", () => {
                expect(VisualClass.capabilities.dataRoles).toBeDefined();
            });

            it("Should not suppressDefaultTitle", () => {
                expect(VisualClass.capabilities.suppressDefaultTitle).toBeUndefined();
            });
        });

        describe("Properties", () => {
            it("should be defined", () => {
                let properties: EnhancedScatterChartProperties = VisualClass.Properties;

                expect(properties).toBeDefined();
                expect(properties).not.toBeNull();
            });

            it("general.formatString should be defined", () => {
                let formatString: DataViewObjectPropertyIdentifier = VisualClass.Properties["general"]["formatString"];

                expect(formatString).toBeDefined();
                expect(formatString).not.toBeNull();
            });
        });

        describe("getPropertiesByCapabilities", () => {
            it("capabilities are null", () => {
                expect(() => {
                    VisualClass.getPropertiesByCapabilities(null);
                }).not.toThrow();
            });

            it("capabilities are undefined", () => {
                expect(() => {
                    VisualClass.getPropertiesByCapabilities(undefined);
                }).not.toThrow();
            });

            it("properties shouldn't contain any properties when capabilities are null", () => {
                let properties: EnhancedScatterChartProperties =
                    VisualClass.getPropertiesByCapabilities<EnhancedScatterChartProperties>(null);

                expect(Object.keys(properties).length).toBe(0);
            });

            it("properties shouldn't contain any properties when capabilities are undefined", () => {
                let properties: EnhancedScatterChartProperties =
                    VisualClass.getPropertiesByCapabilities<EnhancedScatterChartProperties>(undefined);

                expect(Object.keys(properties).length).toBe(0);
            });

            it("properties should contain a property", () => {
                let objectName: string = "general",
                    propertyName: string = "customProperty",
                    capabilities: VisualCapabilities,
                    properties: EnhancedScatterChartProperties;

                capabilities = {
                    objects: {
                        [objectName]: {
                            properties: {
                                [propertyName]: {
                                    displayName: propertyName,
                                    type: {}
                                }
                            }
                        }
                    }
                };

                properties = 
                    VisualClass.getPropertiesByCapabilities<EnhancedScatterChartProperties>(capabilities);

                expect(properties[objectName]).toBeDefined();
                expect(properties[objectName][propertyName]).toBeDefined();
            });

            it("properties should contain two properties with the same root", () => {
                let objectName: string = "general",
                    propertyNames: string[] = ["customProperty0", "customProperty1"],
                    capabilities: VisualCapabilities,
                    properties: EnhancedScatterChartProperties;

                capabilities = {
                    objects: {
                        [objectName]: {
                            properties: {
                                [propertyNames[0]]: {
                                    displayName: propertyNames[0],
                                    type: {}
                                },
                                [propertyNames[1]]: {
                                    displayName: propertyNames[1],
                                    type: {}
                                }
                            }
                        }
                    }
                };

                properties = 
                    VisualClass.getPropertiesByCapabilities<EnhancedScatterChartProperties>(capabilities);

                expect(properties[objectName]).toBeDefined();
                expect(properties[objectName][propertyNames[0]]).toBeDefined();
                expect(properties[objectName][propertyNames[1]]).toBeDefined();
            });

            it("properties should contain two properties", () => {
                let objectNames: string[] = ["general0", "general1"],
                    propertyNames: string[] = ["customProperty0", "customProperty1"],
                    capabilities: VisualCapabilities,
                    properties: EnhancedScatterChartProperties;

                capabilities = {
                    objects: {
                        [objectNames[0]]: {
                            properties: {
                                [propertyNames[0]]: {
                                    displayName: propertyNames[0],
                                    type: {}
                                }
                            }
                        },
                        [objectNames[1]]: {
                            properties: {
                                [propertyNames[1]]: {
                                    displayName: propertyNames[1],
                                    type: {}
                                }
                            }
                        }
                    }
                };

                properties = 
                    VisualClass.getPropertiesByCapabilities<EnhancedScatterChartProperties>(capabilities);

                expect(properties[objectNames[0]]).toBeDefined();
                expect(properties[objectNames[0]][propertyNames[0]]).toBeDefined();

                expect(properties[objectNames[1]]).toBeDefined();
                expect(properties[objectNames[1]][propertyNames[1]]).toBeDefined();
            });
        });

        describe("DOM tests", () => {
            it("Should create svg element", () => expect(visualBuilder.mainElement[0]).toBeInDOM());

            it("Should draw right amount of dots", done => {
                visualBuilder.updateRenderTimeout(dataView, () => {
                    let countOfDot: number = visualBuilder.mainElement
                        .children("svg.svgScrollable")
                        .children("g.axisGraphicsContext")
                        .children("g.mainGraphicsContext")
                        .children("svg")
                        .find("path.dot").length;

                    expect(countOfDot).toBe(dataView.categorical.categories[0].values.length);
                    done();
                });
            });

            it("Should contain axis tick", done => {
                visualBuilder.updateRenderTimeout(dataView, () => {
                    let selector: string = ".enhancedScatterChart .axisGraphicsContext .x.axis .tick";
                    expect($(selector).length).toBeGreaterThan(0);
                    expect(Helpers.findElementText($(selector).find("text").first())).toBeDefined();
                    done();
                });
            });

            it("Should use selected font size for data labels", done => {
                defaultDataViewBuilder.valuesX = [100, 450, 800];
                defaultDataViewBuilder.valuesY = [100, 450, 800];
                dataView = defaultDataViewBuilder.getDataView();

                let labelFontSizeInPoints = 9;  // 9 (in points) ==> 12 (in pixels)
                let labelFonSizeInPixels: string = Math.round(PixelConverter.fromPointToPixel(labelFontSizeInPoints)) + "px";
                dataView.metadata.objects = {
                    categoryLabels: {
                        fontSize: labelFontSizeInPoints,
                        show: true,
                    }
                };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    let labels = visualBuilder.dataLabelsText;
                    expect(labels.length).toBeGreaterThan(0);
                    let firstDataLabelFontSize: string = labels.first().css("font-size");
                    expect(firstDataLabelFontSize).toBe(labelFonSizeInPixels);
                    done();
                });
            });

            it("Should color dots with selected color", done => {
                let hexCustomColor = "#00ff00"; // intentionally different from default red
                dataView.metadata.objects = {
                    dataPoint: { defaultColor: { solid: { color: hexCustomColor } } }
                };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    let selector: string = ".enhancedScatterChart .mainGraphicsContext .ScatterMarkers .dot";
                    expect($(selector).length).toBeGreaterThan(0);
                    let itemColor: string = $(selector).first().css("fill");
                    Helpers.assertColorsMatch(itemColor, hexCustomColor);
                    done();
                });
            });

            it("Fill color should be false when category labels = on && fill point = off", done => {
                dataView = defaultDataViewBuilder.getDataView([
                    EnhancedScatterChartData.ColumnCategoryDisplayName, 
                    EnhancedScatterChartData.ColumnSeriesDisplayName,
                    EnhancedScatterChartData.ColumnX,
                    EnhancedScatterChartData.ColumnY]);

                dataView.metadata.objects = {
                    fillPoint: { show: false },
                    categoryLabels: { show: true }
                };

                visualBuilder.updateRenderTimeout(dataView, () => { 
                    let selector: string = ".enhancedScatterChart .mainGraphicsContext .ScatterMarkers .dot";
                    $(selector).each((index, elem) => {
                        let opacity = $(elem).css("fill-opacity");
                        expect(opacity).toBe("0");
                    });
                    done();
                });
            });

            it("data labels position validation", done => {
                defaultDataViewBuilder.valuesCategory = [
                    "2015-12-31T21:00:00.000Z",
                    "2016-12-31T21:00:00.000Z",
                    "2017-12-31T21:00:00.000Z"
                ].map((x: string) => new Date(x));

                defaultDataViewBuilder.valuesSeries = ["Canada", "United States", "Russia"];
                defaultDataViewBuilder.valuesX = [850, 145, 114.25];
                defaultDataViewBuilder.valuesY = [681, 993, 845];
                defaultDataViewBuilder.valuesSize = [12, 14, 13];

                dataView = defaultDataViewBuilder.getDataView();

                dataView.metadata.objects = {
                    categoryLabels: {
                        show: true
                    }
                };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    let labels: Element[] = visualBuilder.dataLabelsText.get();

                    labels.forEach((label: Element) => {
                        let jqueryLabel: JQuery = $(label),
                            x: number,
                            y: number;

                        x = Number(jqueryLabel.attr("x"));
                        y = Number(jqueryLabel.attr("y"));

                        expect(x).toBeGreaterThan(0);
                        expect(y).toBeGreaterThan(0);

                        expect(x).toBeLessThan(visualBuilder.viewport.width);
                        expect(y).toBeLessThan(visualBuilder.viewport.height);

                        done();
                    });
                });
            });

            describe("Legend", () => {
                let labelColor: string = powerbi.visuals.dataLabelUtils.defaultLabelColor;
                let labelFontSizeInPoints = 10;  // 10 (in points) ==> 13.333333 (in pixels)
                let labelFonSizeInPixels: number = Math.round(PixelConverter.fromPointToPixel(labelFontSizeInPoints));

                beforeEach(done => {
                    dataView.metadata.objects = {
                        legend: {
                            titleText: "my title text",
                            show: true,
                            showTitle: true,
                            labelColor: { solid: { color: labelColor } },
                            fontSize: labelFontSizeInPoints,
                        }
                    };

                    visualBuilder.updateRenderTimeout(dataView, done);
                });

                it("Should add legend", done => {
                    visualBuilder.updateRenderTimeout(dataView, () => {
                        expect(visualBuilder.legend).toBeInDOM();
                        done();
                    });
                });

                it("Should add right amount of legend items", () => {
                    let legendItems: JQuery = visualBuilder.legendGroupElement.children(".legendItem");
                    expect(legendItems.length).toEqual(dataView.categorical.values.grouped().length);
                });

                it("Should add correct legend title & tooltip", () => {
                    let legendTitle: JQuery = visualBuilder.legendGroupElement.children(".legendTitle");
                    expect(legendTitle.length).toEqual(1);

                    let legendTitleText: string = Helpers.findElementText(legendTitle);
                    let legendTitleTitle: string = Helpers.findElementTitle(legendTitle);
                    expect(legendTitleText).toEqual("my title text");
                    expect(legendTitleTitle).toEqual("my title text");
                });

                it("Should color legend title & items with selected color", () => {
                    let legendGroup: JQuery = visualBuilder.legendGroupElement;
                    let legendTitle: JQuery = legendGroup.children(".legendTitle");
                    let firstLegendItemText: JQuery = getLegendTextOfFirstLegendItem(legendGroup);
                    Helpers.assertColorsMatch(legendTitle.css("fill"), labelColor);
                    Helpers.assertColorsMatch(firstLegendItemText.css("fill"), labelColor);
                });

                it("Should use selected font size for legend title and legend items", done => {
                    let legendTitleFontSize: number =
                        Math.round(parseFloat(visualBuilder.legendGroupElement.find(".legendTitle").css("font-size")));
                    let firstLegendItemTextFontSize: number =
                        Math.round(parseFloat(getLegendTextOfFirstLegendItem(visualBuilder.legendGroupElement).css("font-size")));

                    expect(legendTitleFontSize).toBe(labelFonSizeInPixels);
                    expect(firstLegendItemTextFontSize).toBe(labelFonSizeInPixels);
                    done();
                });
            });

            describe("addElementToDOM", () => {
                let rootElement: D3.Selection;

                beforeEach(() => {
                    rootElement = d3.select(visualBuilder.element.get(0));
                });

                it("arguments are null", () => {
                    callAddElementToDOMAndResultShouldBeNull(null, null);
                });

                it("arguments are undefined", () => {
                    callAddElementToDOMAndResultShouldBeNull(undefined, undefined);
                });

                it("the first argument is null, the second argument is empty object", () => {
                    callAddElementToDOMAndResultShouldBeNull(null, <any>{});
                });

                it("the first argument is <Element>, the second argument is null", () => {
                    callAddElementToDOMAndResultShouldBeNull(rootElement, null);
                });

                it("element should be in DOM", () => {
                    let element: D3.Selection;

                    element = callAddElementToDOMAndExpectExceptions(rootElement, {
                        selector: ".anySelector",
                        name: "g"
                    });

                    expect(element.node()).toBeInDOM();
                });

                function callAddElementToDOMAndResultShouldBeNull(
                    rootElement: D3.Selection, 
                    properties: ElementProperties): void {

                    expect(callAddElementToDOMAndExpectExceptions(undefined, undefined)).toBe(null);
                }

                function callAddElementToDOMAndExpectExceptions(
                    rootElement: D3.Selection, 
                    properties: ElementProperties): D3.Selection {

                    let element: D3.Selection;

                    expect(() => {
                        element = visualBuilder.instance.addElementToDOM(rootElement, properties);
                    }).not.toThrow();

                    return element;
                }
            });

            describe("Crosshair", () => {
                let rootElement: D3.Selection,
                    enhancedScatterInstance: VisualClass,
                    crosshairCanvasSelector: ClassAndSelector = VisualClass.CrosshairCanvasSelector,
                    crosshairVerticalLineSelector: ClassAndSelector = VisualClass.CrosshairVerticalLineSelector,
                    crosshairHorizontalLineSelector: ClassAndSelector = VisualClass.CrosshairHorizontalLineSelector,
                    crosshairLineSelector: ClassAndSelector = VisualClass.CrosshairLineSelector,
                    crosshairTextSelector: ClassAndSelector = VisualClass.CrosshairTextSelector;

                beforeEach(() => {
                    enhancedScatterInstance = visualBuilder.instance;
                    rootElement = d3.select(visualBuilder.element.get(0));

                    dataView.metadata.objects = { crosshair: { show: true }};
                });

                it("addCrosshairCanvasToDOM - element should be in DOM", () => {
                    let element: D3.Selection;

                    element = enhancedScatterInstance.addCrosshairCanvasToDOM(rootElement);

                    expect(element.node()).toBeInDOM();
                    expect(element.attr("class")).toBe(crosshairCanvasSelector.class);
                });

                it("addCrosshairLineToDOM - element should be in DOM", () => {
                    let element: D3.Selection;

                    element = enhancedScatterInstance.addCrosshairLineToDOM(
                        rootElement,
                        crosshairVerticalLineSelector);

                    expect(element.node()).toBeInDOM();

                    expect(element.attr("class"))
                        .toBe(`${crosshairLineSelector.class} ${crosshairVerticalLineSelector.class}`);

                    expect(element.attr("x1")).toBe("0");
                    expect(element.attr("y1")).toBe("0");
                    expect(element.attr("x2")).toBe("0");
                    expect(element.attr("y2")).toBe("0");
                });

                it("addCrosshairTextToDOM - element should be in DOM", () => {
                    let element: D3.Selection;

                    element = enhancedScatterInstance.addCrosshairTextToDOM(rootElement);

                    expect(element.node()).toBeInDOM();
                    expect(element.attr("class")).toBe(crosshairTextSelector.class);
                });

                it("renderCrosshair - elements should be in DOM", () => {
                    let element: D3.Selection;

                    enhancedScatterInstance.setData([dataView]);
                    element = enhancedScatterInstance.renderCrosshair();

                    expect(element.node()).toBeInDOM();

                    expectElementsShouldBeInDOM(element, [
                        crosshairVerticalLineSelector.selector,
                        crosshairHorizontalLineSelector.selector,
                        crosshairTextSelector.selector
                    ]);
                });

                it("bindCrosshairEvents - should be called", () => {
                    spyOn(enhancedScatterInstance, "bindCrosshairEvents");

                    enhancedScatterInstance.setData([dataView]);
                    enhancedScatterInstance.renderCrosshair();

                    expect(enhancedScatterInstance.bindCrosshairEvents).toHaveBeenCalled();
                });

                function expectElementsShouldBeInDOM(element: D3.Selection, selectors: string[]): void {
                    selectors.forEach((selector: string) => {
                        expect(element.select(selector).node()).toBeInDOM();
                    });
                }
            });
        });

        describe("optimizeTranslateValues", () => {
            let enhancedScatterInstance: VisualClass;

            beforeEach(() => {
                enhancedScatterInstance = visualBuilder.instance;
            });

            it("result should be null", () => {
                let result: number[];

                result = enhancedScatterInstance.optimizeTranslateValues(null);

                expect(result).toBeNull();
            });

            it("result should be undefined", () => {
                let result: number[];

                result = enhancedScatterInstance.optimizeTranslateValues(undefined);

                expect(result).not.toBeDefined();
            });

            it("result should be defined", () => {
                let result: number[];

                result = enhancedScatterInstance.optimizeTranslateValues([]);

                expect(result).toBeDefined();
            });

            it("result should be correct", () => {
                let result: number[];

                result = enhancedScatterInstance.optimizeTranslateValues([
                    Number.MAX_VALUE,
                    Number.MIN_VALUE
                ]);

                expect(result[0]).toBe(VisualClass.MaxTranslateValue);
                expect(result[1]).toBe(VisualClass.MinTranslateValue);
            });
        });

        describe("optimizeTranslateValue", () => {
            let enhancedScatterInstance: VisualClass;

            beforeEach(() => {
                enhancedScatterInstance = visualBuilder.instance;
            });

            it("result should be null", () => {
                let result: number;

                result = enhancedScatterInstance.optimizeTranslateValue(null);

                expect(result).toBeNull();
            });

            it("result should be null", () => {
                let result: number;

                result = enhancedScatterInstance.optimizeTranslateValue(undefined);

                expect(result).not.toBeDefined();
            });

            it("result should be MaxTranslateValue", () => {
                let result: number;

                result = enhancedScatterInstance.optimizeTranslateValue(Number.MAX_VALUE);

                expect(result).toBe(VisualClass.MaxTranslateValue);
            });

            it("result should be -MaxTranslateValue", () => {
                let result: number;

                result = enhancedScatterInstance.optimizeTranslateValue(-Number.MAX_VALUE);

                expect(result).toBe(-VisualClass.MaxTranslateValue);
            });

            it("result should be MinTranslateValue", () => {
                let result: number;

                result = enhancedScatterInstance.optimizeTranslateValue(Number.MIN_VALUE);

                expect(result).toBe(VisualClass.MinTranslateValue);
            });

            it("result should be -MinTranslateValue", () => {
                let result: number;

                result = enhancedScatterInstance.optimizeTranslateValue(-Number.MIN_VALUE);

                expect(result).toBe(-VisualClass.MinTranslateValue);
            });

            it("input value and result should be the same", () => {
                let inputValue: number = 255,
                    result: number;

                result = enhancedScatterInstance.optimizeTranslateValue(inputValue);

                expect(result).toBe(inputValue);
            });
        });

        describe("converter", () => {
            let colorPalette: IDataColorPalette;

            beforeEach(() => {
                colorPalette = new DataColorPalette();
            });

            it("arguments are null", () => {
                callConverterAndExpectExceptions(null, null, null, null, null);
            });

            it("arguments are undefined", () => {
                callConverterAndExpectExceptions(undefined, undefined, undefined, undefined, undefined);
            });

            it("arguments are correct", () => {
                callConverterAndExpectExceptions(dataView, colorPalette);
            });

            it("backdrop", () => {
                let enhancedScatterChartData: IEnhancedScatterChartData =
                    callConverterWithAdditionalcolumns(colorPalette, [EnhancedScatterChartData.ColumnBackdrop]);

                expect(enhancedScatterChartData.backdrop).toBeDefined();
                expect(enhancedScatterChartData.backdrop).not.toBeNull();

                expect(enhancedScatterChartData.backdrop.url).toBe(defaultDataViewBuilder.imageValues[0]);
                expect(enhancedScatterChartData.backdrop.show).toBeTruthy();
            });

            describe("dataPoints", () => {
                it("x should be defined", () => {
                    checkDataPointProperty((dataPoint: EnhancedScatterChartDataPoint) => {
                        valueToBeDefinedAndNumber(dataPoint.x);
                    }, defaultDataViewBuilder, colorPalette);
                });

                it("y should be defined", () => {
                    checkDataPointProperty((dataPoint: EnhancedScatterChartDataPoint) => {
                        valueToBeDefinedAndNumber(dataPoint.y);
                    }, defaultDataViewBuilder, colorPalette);
                });

                it("color fill", () => {
                    checkDataPointProperty((dataPoint: EnhancedScatterChartDataPoint, index: number) => {
                        expect(dataPoint.colorFill).toBe(defaultDataViewBuilder.colorValues[index]);
                    }, defaultDataViewBuilder, colorPalette, [EnhancedScatterChartData.ColumnColorFill]);
                });

                it("images", () => {
                    checkDataPointProperty((dataPoint: EnhancedScatterChartDataPoint, index: number) => {
                        expect(dataPoint.svgurl).toBe(defaultDataViewBuilder.imageValues[index]);
                    }, defaultDataViewBuilder, colorPalette, [EnhancedScatterChartData.ColumnImage]);
                });

                it("rotate should be defined", () => {
                    checkDataPointProperty((dataPoint: EnhancedScatterChartDataPoint, index) => {
                        valueToBeDefinedAndNumber(dataPoint.rotation);
                    }, defaultDataViewBuilder, colorPalette, [EnhancedScatterChartData.ColumnRotation]);
                });

                it("rotate should be 0 when source values are null", () => {
                    defaultDataViewBuilder.rotationValues = defaultDataViewBuilder.rotationValues.map((rotation) => {
                        return null;
                    });

                    checkDataPointProperty((dataPoint: EnhancedScatterChartDataPoint) => {
                        let rotation: number = dataPoint.rotation;

                        valueToBeDefinedAndNumber(rotation);

                        expect(rotation).toBe(0);
                    }, defaultDataViewBuilder, colorPalette, [EnhancedScatterChartData.ColumnRotation]);
                });
            });

            function callConverterWithAdditionalcolumns(
                colorPalette: IDataColorPalette, columns: string[]): IEnhancedScatterChartData {

                let dataView: DataView = defaultDataViewBuilder.getDataView(
                    EnhancedScatterChartData.DefaultSetOfColumns.concat(columns));

                return callConverterAndExpectExceptions(dataView, colorPalette); 
            }

            function callConverterAndExpectExceptions(
                dataView: DataView,
                colorPalette: IDataColorPalette,
                interactivityService?: IInteractivityService,
                categoryAxisProperties?: DataViewObject,
                valueAxisProperties?: DataViewObject): IEnhancedScatterChartData {

                let enhancedScatterChartData: IEnhancedScatterChartData;

                expect(() => {
                    enhancedScatterChartData = VisualClass.converter(
                        dataView,
                        colorPalette,
                        interactivityService,
                        categoryAxisProperties,
                        valueAxisProperties);
                }).not.toThrow();

                return enhancedScatterChartData;
            }

            function checkDataPointProperty(
                checkerCallback: CheckerCallback,
                dataViewBuilder: EnhancedScatterChartData,
                colorPalette: IDataColorPalette,
                columnNames: string[] = []): void {

                let dataView: DataView,
                    enhancedScatterChartData: IEnhancedScatterChartData;

                dataView = dataViewBuilder.getDataView(
                    EnhancedScatterChartData.DefaultSetOfColumns.concat(columnNames));

                enhancedScatterChartData = VisualClass.converter(dataView, colorPalette);

                enhancedScatterChartData.dataPoints.forEach(checkerCallback);
            };

            function valueToBeDefinedAndNumber(value: number): void {
                expect(value).toBeDefined();
                expect(value).not.toBeNull();
                expect(value).not.toBeNaN();
            }
        });
    });

    function getLegendTextOfFirstLegendItem(legendGroup: JQuery) {
        return legendGroup
            .children(".legendItem")
            .first()
            .children(".legendText");
    }

    class EnhancedScatterChartBuilder extends VisualBuilderBase<VisualClass> {
        constructor(width: number, height: number, isMinervaVisualPlugin: boolean = false) {
            super(width, height, isMinervaVisualPlugin);
        }

        protected build() {
            return new VisualClass();
        }

        public get instance(): VisualClass {
            return this.visual;
        }

        public get mainElement(): JQuery {
            return this.element
                .children("svg")
                .children("g.axisGraphicsContext")
                .parent();
        }

        public get svgScrollableAxisGraphicsContext(): JQuery {
            return this.mainElement
                .children("svg.svgScrollable")
                .children("g.axisGraphicsContext");
        }

        public get mainGraphicsContext(): JQuery {
            return this.svgScrollableAxisGraphicsContext
                .children("g.mainGraphicsContext");
        }

        public get dataLabels(): JQuery {
            return this.mainGraphicsContext
                .children("g.labels");
        }

        public get dataLabelsText(): JQuery {
            return this.dataLabels
                .children("text.data-labels");
        }

        public get legend(): JQuery {
            return this.element
                .children(".legend");
        }

        public get legendGroupElement(): JQuery {
            return this.legend
                .children("#legendGroup");
        }

        public getMarkers(): JQuery {
            return $(".scatterChart .mainGraphicsContext circle.dot");
        }
    }
}
