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
    import WaterfallChart = powerbi.visuals.WaterfallChart;
    import ValueType = powerbi.ValueType;
    import DataViewTransform = powerbi.data.DataViewTransform;
    import SVGUtil = powerbi.visuals.SVGUtil;
    import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
    import PixelConverter = jsCommon.PixelConverter;
    powerbitests.mocks.setLocale();

    describe("WaterfallChart", () => {

        describe("capabilities", () => {
            it("should register capabilities", () => {
                let plugin = powerbi.visuals.plugins.waterfallChart;
                expect(plugin).toBeDefined();
                expect(plugin.capabilities).toBe(powerbi.visuals.waterfallChartCapabilities);
            });

            it("should exist", () => {
                expect(powerbi.visuals.waterfallChartCapabilities).toBeDefined();
            });

            it("should include dataViewMappings", () => {
                expect(powerbi.visuals.waterfallChartCapabilities.dataViewMappings).toBeDefined();
            });

            it("Waterfall specifies DataReduction", () => {
                expect(powerbi.visuals.waterfallChartCapabilities.dataViewMappings[0].categorical.categories.dataReductionAlgorithm).toBeDefined();
            });

            it("should include dataRoles", () => {
                expect(powerbi.visuals.waterfallChartCapabilities.dataRoles).toBeDefined();
            });

            it("should not support highlight", () => {
                expect(powerbi.visuals.waterfallChartCapabilities.supportsHighlight).toBeUndefined();
            });

            it("FormatString property should match calculated", () => {
                expect(powerbi.data.DataViewObjectDescriptors.findFormatString(powerbi.visuals.waterfallChartCapabilities.objects)).toEqual(WaterfallChart.formatStringProp);
            });
        });

        describe("warnings", () => {
            let v: powerbi.IVisual;
            let warningSpy: jasmine.Spy;

            beforeEach(() => {
                let builder = new WaterfallVisualBuilder();

                warningSpy = spyOn(builder.host, 'setWarnings');

                v = builder.build();
            });

            it("NaN in values shows a warning", () => {
                let dataView = getDataViewFromValues([200, NaN, 0, 0, 0]);

                v.onDataChanged({ dataViews: [dataView] });

                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(getWarningValue(warningSpy.calls.argsFor(0))).toBe("NaNNotSupported");
            });

            it("negative infinity in values shows a warning", () => {
                let dataView = getDataViewFromValues([200, Number.NEGATIVE_INFINITY, 0, 0, 0]);

                v.onDataChanged({ dataViews: [dataView] });

                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(getWarningValue(warningSpy.calls.argsFor(0))).toBe("InfinityValuesNotSupported");
            });

            it("postive infinity in values shows a warning", () => {
                let dataView = getDataViewFromValues([200, Number.POSITIVE_INFINITY, 0, 0, 0]);

                v.onDataChanged({ dataViews: [dataView] });

                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(getWarningValue(warningSpy.calls.argsFor(0))).toBe("InfinityValuesNotSupported");
            });

            it("value out of range in values shows a warning", () => {
                let dataView = getDataViewFromValues([200, -1e301, 0, 0, 0]);

                v.onDataChanged({ dataViews: [dataView] });

                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(getWarningValue(warningSpy.calls.argsFor(0))).toBe("ValuesOutOfRange");
            });

            it("all okay in values shows no warning", () => {
                let dataView = getDataViewFromValues([200, 300, 0, 0, 0]);

                v.onDataChanged({ dataViews: [dataView] });

                expect(warningSpy).not.toHaveBeenCalled();
            });

            function getDataViewFromValues(values: any[]): powerbi.DataView {
                let builder = new WaterfallDataBuilder();

                // NOTE: min/max/total not used here
                return builder.withMeasureValues(values, 0, 0, 0).build();
            }

            function getWarningValue(args: any[]): string {
                return args[0][0].code;
            }
        });

        describe("axes", () => {
            let v: powerbi.IVisual;

            beforeEach(() => {
                v = new WaterfallVisualBuilder().build();
            });

            it("axis titles should be correct ", () => {
                let dataView = new WaterfallDataBuilder().build();
                dataView.metadata.objects = {
                    categoryAxis: {
                        showAxisTitle: true
                    },
                    valueAxis: {
                        showAxisTitle: true
                    }
                };

                v.onDataChanged({ dataViews: [dataView] });

                expect(helpers.findElementText($(".xAxisLabel").first())).toBe("year");
                expect(helpers.findElementText($(".yAxisLabel").first())).toBe("sales");
                //check title
                expect(helpers.findElementTitle($(".xAxisLabel").first())).toBe("year");
                expect(helpers.findElementTitle($(".yAxisLabel").first())).toBe("sales");
            });

            it("axis titles should show/hide ", () => {
                let dataView = new WaterfallDataBuilder().build();

                dataView.metadata.objects = {
                    categoryAxis: {
                        showAxisTitle: true
                    },
                    valueAxis: {
                        showAxisTitle: true
                    }
                };

                v.onDataChanged({ dataViews: [dataView] });

                expect($(".xAxisLabel").length).toBe(1);
                expect($(".yAxisLabel").length).toBe(1);

                // Hide Axis titles
                dataView.metadata.objects = {
                    categoryAxis: {
                        showAxisTitle: false
                    },
                    valueAxis: {
                        showAxisTitle: false
                    }
                };

                v.onDataChanged({ dataViews: [dataView] });

                expect($(".xAxisLabel").length).toBe(0);
                expect($(".yAxisLabel").length).toBe(0);
            });

            it("zero axis line is darkened", (done) => {
                let dataView = new WaterfallDataBuilder().build();

                v.onDataChanged({ dataViews: [dataView] });

                setTimeout(() => {
                    let zeroTicks = $("g.tick:has(line.zero-line)");

                    expect(zeroTicks.length).toBe(2);
                    zeroTicks.each((i, item) => expect(d3.select(item).datum() === 0).toBe(true));

                    done();
                }, DefaultWaitForRender);
            });
        });

        describe("data converter", () => {
            let visualBuilder: WaterfallVisualBuilder;
            let colors: powerbi.IDataColorPalette;

            let dataBuilder: WaterfallDataBuilder;

            let data: powerbi.visuals.WaterfallChartData;
            let dataPoints: powerbi.visuals.WaterfallChartDataPoint[];

            beforeEach(() => {
                visualBuilder = new WaterfallVisualBuilder();
                colors = visualBuilder.style.colorPalette.dataColors;

                dataBuilder = new WaterfallDataBuilder();
                let dataView = dataBuilder.build();

                data = WaterfallChart.converter(dataView, colors, visualBuilder.host, dataBuilder.dataLabelSettings, dataBuilder.sentimentColors, /* interactivityService */ null, /* tooltipsEnabled */true, /* tooltipBucketEnabled */true);
                dataPoints = data.series[0].data;
            });

            it("legend should have 3 items", () => {
                expect(data.legend.dataPoints.length).toBe(3);  // Gain, Loss, Total
            });

            it("has correct positions", () => {
                // values: [100, -200, 0, 300, null, NaN]
                let positions = [0, 100, -100, -100, 200, 200, 0];  // The last position represents the total and is always 0.

                expect(dataPoints.map(d => d.position)).toEqual(positions);
                expect(data.positionMin).toBe(dataBuilder.positionMin);
                expect(data.positionMax).toBe(dataBuilder.positionMax);
            });

            it("has correct values", () => {
                // values: [100, -200, 0, 300, null, NaN]
                let valuesWithTotal = [100, -200, 0, 300, 0, 0, 200];
                expect(dataPoints.map(d => d.value)).toEqual(valuesWithTotal);
                expect(data.positionMin).toBe(dataBuilder.positionMin);
                expect(data.positionMax).toBe(dataBuilder.positionMax);
            });

            it("gain/loss colors match legend", () => {
                let gainLegend = data.legend.dataPoints[0];
                let lossLegend = data.legend.dataPoints[1];
                expect(dataPoints[0].color).toBe(gainLegend.color);  // first value is a gain
                expect(dataPoints[1].color).toBe(lossLegend.color);  // second value is a loss
            });

            it("should have no highlights", () => {
                expect(dataPoints.some(d => d.highlight)).toBe(false);
                expect(data.hasHighlights).toBe(false);
            });

            it("should have no selected data points", () => {
                expect(dataPoints.some(d => d.selected)).toBe(false);
            });

            it("should have tooltip data", () => {
                // categoryValues: [2015, 2016, 2017, 2018, 2019, 2020]
                // measureValues: [100, -200, 0, 300, null, NaN];
                expect(dataPoints[0].tooltipInfo).toEqual([{ displayName: "year", value: "2015" }, { displayName: "sales", value: "$100" }, { displayName: 'tooltips', value: '$10' }]);
                expect(dataPoints[1].tooltipInfo).toEqual([{ displayName: "year", value: "2016" }, { displayName: "sales", value: "-$200" }, { displayName: 'tooltips', value: '-$20' }]);
                expect(dataPoints[2].tooltipInfo).toEqual([{ displayName: "year", value: "2017" }, { displayName: "sales", value: "$0" }, { displayName: 'tooltips', value: '$30' }]);
                expect(dataPoints[3].tooltipInfo).toEqual([{ displayName: "year", value: "2018" }, { displayName: "sales", value: "$300" }, { displayName: 'tooltips', value: '$40' }]);
                expect(dataPoints[4].tooltipInfo).toEqual([{ displayName: "year", value: "2019" }, { displayName: "sales", value: "$0" }]);
                expect(dataPoints[5].tooltipInfo).toEqual([{ displayName: "year", value: "2020" }, { displayName: "sales", value: "$0" }, { displayName: 'tooltips', value: '$0' }]);
                expect(dataPoints[6].tooltipInfo).toEqual([{ displayName: "year", value: "Total" }, { displayName: "sales", value: "$200" }, { displayName: 'tooltips', value: '$60' }]);

            });

            it("validate tooltip info not being created when tooltips are disabled", () => {
                dataBuilder = new WaterfallDataBuilder();
                let dataView = dataBuilder.build();
                data = WaterfallChart.converter(dataView, colors, visualBuilder.host, dataBuilder.dataLabelSettings, dataBuilder.sentimentColors, /* interactivityService */ null, false);
                dataPoints = data.series[0].data;

                // categoryValues: [2015, 2016, 2017, 2018, 2019, 2020]
                // measureValues: [100, -200, 0, 300, null, NaN];
                for (let dataPoint of dataPoints) {
                    expect(dataPoint.tooltipInfo).toBeUndefined();
                }
            });

            it("validate tooltip info not being created when tooltips are disabled and tooltipBuckets are enabled", () => {
                dataBuilder = new WaterfallDataBuilder();
                let dataView = dataBuilder.build();
                data = WaterfallChart.converter(dataView, colors, visualBuilder.host, dataBuilder.dataLabelSettings, dataBuilder.sentimentColors, /* interactivityService */ null, /*tooltipsEnabled*/false, /*tooltipBucketEnabled*/true);
                dataPoints = data.series[0].data;
                
                for (let dataPoint of dataPoints) {
                    expect(dataPoint.tooltipInfo).toBeUndefined();
                }
            });

        });

        describe("setData", () => {
            let chart: WaterfallChart;

            beforeEach(() => {
                let visualBuilder = new WaterfallVisualBuilder();
                chart = new WaterfallChart({ isScrollable: false, interactivityService: undefined });
                chart.init(visualBuilder.buildInitOptions());
            });

            it("sentiment colors should be set from data object", () => {
                let increaseFill = "#000001";
                let decreaseFill = "#000002";

                let dataView = new WaterfallDataBuilder().build();
                dataView.metadata.objects = {
                    sentimentColors: {
                        increaseFill: { solid: { color: increaseFill } },
                        decreaseFill: { solid: { color: decreaseFill } }
                    }
                };

                chart.setData([dataView]);

                let legendData = chart.calculateLegend();
                helpers.assertColorsMatch(legendData.dataPoints[0].color, increaseFill);  // first point is an increase.
                helpers.assertColorsMatch(legendData.dataPoints[1].color, decreaseFill);  // second point is a decrease.
            });

            it("should clear data if passed empty array", () => {
                let dataView = new WaterfallDataBuilder().build();

                chart.setData([dataView]);
                expect(chart.calculateLegend().dataPoints.length).not.toBe(0);

                chart.setData([]);
                expect(chart.calculateLegend().dataPoints.length).toBe(0);
            });
        });

        describe("scrollbars", () => {
            let v: powerbi.IVisual;
            let element: JQuery;
            let dataBuilder: WaterfallDataBuilder;

            beforeEach(() => {
                // More data than usual to force scrolling.
                dataBuilder = new WaterfallDataBuilder();
                let dataView = dataBuilder
                    .withMeasureValues([1, 2, 3, 4, -5, 6, 7, -8, -9], 0, 18, 1)
                    .withCategories(["a", "b", "c", "d", "e", "f", "g", "h", "i"])
                    .build();

                let visualBuilder = new WaterfallVisualBuilder();

                // Extra small container to force scrolling.
                v = visualBuilder
                    .withSize(150, 100) // default for waterfall is legend on, top - leave enough vertical room
                    .build(/* use Minerva to get scrolling behavior */ true);

                element = visualBuilder.element;

                v.onDataChanged({ dataViews: [dataView] });
            });

            it("DOM validation", (done) => {
                setTimeout(() => {
                    let brushExtent = getBrushExtent();

                    expect(brushExtent.length).toBe(1);

                    let tick = helpers.getAxisTicks('x').last();
                    let tickTransform = SVGUtil.parseTranslateTransform(tick.attr('transform'));

                    expect(parseFloat(tickTransform.x)).toBeLessThan(element.width());

                    expect(parseFloat(brushExtent.attr("width"))).toBeGreaterThan(1);
                    expect(brushExtent.attr("x")).toBe("0");

                    v.onResizing({ height: 500, width: 500 });
                    expect($('.brush')).not.toBeInDOM();

                    done();
                }, DefaultWaitForRender);
            });

            it('should have correct tick labels after scrolling', (done) => {
                setTimeout(() => {
                    let tickCount = helpers.getAxisTicks('x').length;
                    let categoryCount = dataBuilder.categoryValues.length + 1;  // +1 for total

                    // Scroll so the last ticks are in view.
                    let startIndex = categoryCount - tickCount;
                    let expectedValues = dataBuilder.categoryValues.slice(startIndex);

                    powerbitests.helpers.runWithImmediateAnimationFrames(() => {
                        (<powerbi.visuals.CartesianChart>v).scrollTo(startIndex);

                        setTimeout(() => {
                            let tickValues = _.map(helpers.getAxisTicks('x').get(), (v) => helpers.findElementText($(v).find('text').first()));

                            expect(tickValues.slice(0, tickValues.length - 1)).toEqual(expectedValues);
                            expect(_.startsWith(_.last(tickValues), 'T')).toBe(true);  // "Total" may be truncated

                            done();
                        }, DefaultWaitForRender);
                    });
                }, DefaultWaitForRender);
            });

            function getBrushExtent(): JQuery {
                return $('.brush .extent');
            }
        });

        describe("enumerateObjectInstances", () => {
            let v: powerbi.IVisual;
            let builder: WaterfallVisualBuilder;

            beforeEach(() => {
                builder = new WaterfallVisualBuilder();
                v = builder.build();
            });

            it("should include labels with empty data", () => {
                v.onDataChanged({ dataViews: [] });

                verifyLabels();
            });

            it("should include labels", () => {
                let dataView = new WaterfallDataBuilder().build();

                v.onDataChanged({ dataViews: [dataView] });
                verifyLabels();
            });

            it("should include sentiment colors with empty data", () => {
                v.onDataChanged({ dataViews: [] });

                verifyColors();
            });

            it("should include sentiment colors", () => {
                let dataView = new WaterfallDataBuilder().build();

                v.onDataChanged({ dataViews: [dataView] });

                verifyColors();
            });

            describe('legend', () => {
                const labelColor: string = "#002121";

                beforeEach(() => {
                    let dataViewGradientMetadata: powerbi.DataViewMetadata = {
                        columns: [
                            { displayName: 'col1' },
                            { displayName: 'col2', isMeasure: true },
                            { displayName: 'col3', isMeasure: true, roles: { 'Gradient': true } }
                        ],
                        objects: {
                            legend:
                            {
                                titleText: 'my title text',
                                show: true,
                                showTitle: true,
                                labelColor: { solid: { color: labelColor } },
                            }
                        }
                    };

                    v.onDataChanged({
                        dataViews: [{
                            metadata: dataViewGradientMetadata,
                            categorical: {
                                categories: [{
                                    source: dataViewGradientMetadata.columns[0],
                                    values: ['a', 'b', 'c'],
                                    identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                }],
                                values: DataViewTransform.createValueColumns([{
                                    source: dataViewGradientMetadata.columns[1],
                                    values: [5, 990, 5],
                                }])
                            }
                        }],
                    });
                });

                it("legend title", () => {
                    let legend = builder.element.find('.legend');
                    let legendGroup = legend.find('#legendGroup');
                    let legendTitle = legendGroup.find('.legendTitle');

                    helpers.assertColorsMatch(legendTitle.css('fill'), labelColor);
                });

                it("legend items", () => {
                    let legend = builder.element.find('.legend');
                    let legendGroup = legend.find('#legendGroup');
                    let legendItems = legendGroup.find('.legendItem');

                    expect(legendItems.length).toBe(3);

                    let expectedLegendText = ['Increase', 'Decrease', 'Total'];
                    let expectedLegendIconFill = ['rgb(121, 199, 91)', 'rgb(192, 67, 58)', 'rgb(0, 184, 170)'];

                    for (let i of [0, 1, 2]) {
                        let legendItem = legendItems.eq(i);
                        expect(legendItem.find('.legendText').text()).toBe(expectedLegendText[i]);
                        helpers.assertColorsMatch(legendItem.find('.legendIcon').css('fill'), expectedLegendIconFill[i]);
                    }
                });
            });

            it("check font size for legend title and legend items waterfall chart", (done) => {
                let labelFontSize = 13;

                let dataViewGradientMetadata: powerbi.DataViewMetadata = {
                    columns: [
                        { displayName: 'col1' },
                        { displayName: 'col2', isMeasure: true },
                        { displayName: 'col3', isMeasure: true, roles: { 'Gradient': true } }
                    ],
                    objects: {
                        legend:
                        {
                            titleText: 'my title text',
                            show: true,
                            showTitle: true,
                            fontSize: labelFontSize,
                        }
                    }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewGradientMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewGradientMetadata.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewGradientMetadata.columns[1],
                                values: [5, 990, 5],
                            }])
                        }
                    }],
                });

                let legend = builder.element.find('.legend');
                let legendGroup = legend.find('#legendGroup');
                let legendTitle = legendGroup.find('.legendTitle');
                let legendText = legendGroup.find('.legendItem').find('.legendText');

                setTimeout(() => {
                    expect(Math.round(parseInt(legendTitle.css('font-size'), 10))).toBe(Math.round(parseInt(PixelConverter.fromPoint(labelFontSize), 10)));
                    expect(Math.round(parseInt(legendText.css('font-size'), 10))).toBe(Math.round(parseInt(PixelConverter.fromPoint(labelFontSize), 10)));

                    done();
                }, DefaultWaitForRender);
            });

            function verifyColors() {
                let objects = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: "sentimentColors" });

                expect(objects.instances.length).toBe(1);
                expect(objects.instances[0].properties["increaseFill"]).toBeDefined();
                expect(objects.instances[0].properties["decreaseFill"]).toBeDefined();
                expect(objects.instances[0].properties["totalFill"]).toBeDefined();
            };

            function verifyLabels() {
                let objects = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: "labels" });
                let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings(undefined, undefined);

                expect(objects.instances.length).toBe(1);
                expect(objects.instances[0].properties).toBeDefined();

                let properties = objects.instances[0].properties;
                
                // The default value for precision is undefined but in enumerateObject it is null
                let precision = defaultLabelSettings.precision !== powerbi.visuals.dataLabelUtils.defaultLabelPrecision
                    ? defaultLabelSettings.precision
                    : null;

                expect(properties["color"]).toBe(defaultLabelSettings.labelColor);
                expect(properties["show"]).toBe(false);
                expect(properties["labelPrecision"]).toBe(precision);
                expect(properties["labelDisplayUnits"]).toBe(defaultLabelSettings.displayUnits);
                expect(properties["fontSize"]).toBe(defaultLabelSettings.fontSize);
            }
        });

        it('background image', (done) => {
            let v = new WaterfallVisualBuilder().build();
            let dataView = new WaterfallDataBuilder().build();
            dataView.metadata.objects = {
                plotArea: {
                    image: {
                        url: 'data:image/gif;base64,R0lGO',
                        name: 'someName',
                    },
                },
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                let backgroundImage = $('.background-image');
                expect(backgroundImage.length).toBeGreaterThan(0);
                expect(backgroundImage.css('height')).toBeDefined();
                expect(backgroundImage.css('width')).toBeDefined();
                expect(backgroundImage.css('margin-left')).toBeDefined();
                expect(backgroundImage.css('margin-top')).toBeDefined();
                done();
            }, DefaultWaitForRender);
        });

        describe("selection", () => {
            let visualBuilder: WaterfallVisualBuilder;
            let dataBuilder: WaterfallDataBuilder;
            let v: powerbi.IVisual;

            beforeEach(() => {
                visualBuilder = new WaterfallVisualBuilder();
                dataBuilder = new WaterfallDataBuilder();
                v = visualBuilder.build(true);
            });

            it('should select right data', (done) => {
                let dataView = dataBuilder.build();

                v.onDataChanged({ dataViews: [dataView] });

                let dataMap = {};
                let data = dataBuilder.categoryIdentities[0];
                dataMap[dataBuilder.categoryColumn.queryName] = data;

                setTimeout(() => {
                    let rects = getRects();
                    spyOn(visualBuilder.host, 'onSelect').and.callThrough();
                    rects.first().d3Click(0, 0);

                    expect(visualBuilder.host.onSelect).toHaveBeenCalledWith(
                        {
                            visualObjects: [
                                {
                                    objectName: 'dataPoint',
                                    selectorsByColumn:
                                    {
                                        dataMap: dataMap,
                                        metadata: dataBuilder.measureColumn.queryName,
                                    }
                                }
                            ]
                        });
                    done();
                }, DefaultWaitForRender);
            });

            it('context menu', (done) => {
                let dataView = dataBuilder.build();

                v.onDataChanged({ dataViews: [dataView] });

                let dataMap = {};
                let data = dataBuilder.categoryIdentities[0];
                dataMap[dataBuilder.categoryColumn.queryName] = data;

                setTimeout(() => {
                    spyOn(visualBuilder.host, 'onContextMenu').and.callThrough();
                    let rects = getRects();
                    rects.first().d3ContextMenu(5, 15);

                    expect(visualBuilder.host.onContextMenu).toHaveBeenCalledWith(
                        {
                            data: [
                                {
                                    dataMap: dataMap,
                                    metadata: dataBuilder.measureColumn.queryName,
                                }
                            ],
                            position: {
                                x: 5,
                                y: 15
                            }
                        });
                    done();
                }, DefaultWaitForRender);
            });

            it('should clear chart on clearCatcher click', (done) => {
                let dataView = dataBuilder.build();

                v.onDataChanged({ dataViews: [dataView] });

                setTimeout(() => {
                    let rects = getRects();
                    spyOn(visualBuilder.host, 'onSelect').and.callThrough();
                    rects.first().d3Click(0, 0);

                    let clearCatcher = $('.clearCatcher');
                    clearCatcher.eq(0).d3Click(0, 0);

                    expect(visualBuilder.host.onSelect).toHaveBeenCalledWith(
                        {
                            visualObjects: []
                        });

                    done();
                });
            });
        });

        describe("basic DOM", () => {
            let v: powerbi.IVisual;

            beforeEach(() => {
                v = new WaterfallVisualBuilder().build();
            });

            it("should create waterfall chart element", (done) => {
                let dataView = new WaterfallDataBuilder().build();

                v.onDataChanged({ dataViews: [dataView] });

                setTimeout(() => {
                    expect($(".waterfallChart")).toBeInDOM();

                    done();
                }, DefaultWaitForRender);
            });

            it("should have a rect for each category and one for total", (done) => {
                let dataBuilder = new WaterfallDataBuilder();
                let dataView = dataBuilder.build();

                v.onDataChanged({ dataViews: [dataView] });

                setTimeout(() => {
                    expect(getRects().length).toBe(dataBuilder.categoryValues.length + 1);

                    done();
                }, DefaultWaitForRender);
            });

            it("rect colors should match sentiment colors", (done) => {
                let increaseFill = "#000001";
                let decreaseFill = "#000002";
                let totalFill = "#000002";

                let dataView = new WaterfallDataBuilder().build();
                dataView.metadata.objects = {
                    sentimentColors: {
                        increaseFill: { solid: { color: increaseFill } },
                        decreaseFill: { solid: { color: decreaseFill } },
                        totalFill: { solid: { color: totalFill } }
                    }
                };

                v.onDataChanged({ dataViews: [dataView] });

                setTimeout(() => {
                    let rects = getRects();

                    // values: [100, -200, 0, 300, null, NaN]

                    helpers.assertColorsMatch(getFillColor(rects.eq(0)), increaseFill);
                    helpers.assertColorsMatch(getFillColor(rects.eq(1)), decreaseFill);
                    helpers.assertColorsMatch(getFillColor(rects.last()), totalFill);

                    done();
                }, DefaultWaitForRender);
            });

            it("should have connecting lines between rects", (done) => {
                let dataBuilder = new WaterfallDataBuilder();
                let dataView = dataBuilder.build();

                v.onDataChanged({ dataViews: [dataView] });

                setTimeout(() => {
                    expect(getConnectors().length).toBe(dataBuilder.categoryValues.length);

                    done();
                }, DefaultWaitForRender);
            });

            it("should draw data labels when enabled", (done) => {
                let dataView = new WaterfallDataBuilder().withDataLabels().build();

                v.onDataChanged({ dataViews: [dataView] });

                setTimeout(() => {
                    expect($(".labelGraphicsContext")).toBeInDOM();
                    expect($(".labelGraphicsContext .label").length).toBe(7);

                    done();
                }, DefaultWaitForRender);
            });
        });

        describe("label data point creation", () => {
            let v: powerbi.IVisual;

            beforeEach(() => {
                v = new WaterfallVisualBuilder().build();
            });

            it("Label data points have correct text", () => {
                let dataView = new WaterfallDataBuilder().withDataLabels().build();
                v.onDataChanged({ dataViews: [dataView] });

                let labelDataPoints = callCreateLabelDataPoints(v);
                expect(labelDataPoints[0].text).toEqual("100");
                expect(labelDataPoints[1].text).toEqual("-200");
                expect(labelDataPoints[2].text).toEqual("0");
                expect(labelDataPoints[3].text).toEqual("300");
                expect(labelDataPoints[4].text).toEqual("0");
                expect(labelDataPoints[5].text).toEqual("0");
                expect(labelDataPoints[6].text).toEqual("200");
            });

            it("Label data points have correct default fill", () => {
                let dataView = new WaterfallDataBuilder().withDataLabels().build();
                v.onDataChanged({ dataViews: [dataView] });

                let labelDataPoints = callCreateLabelDataPoints(v);
                helpers.assertColorsMatch(labelDataPoints[0].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
                helpers.assertColorsMatch(labelDataPoints[1].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
                helpers.assertColorsMatch(labelDataPoints[2].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
                helpers.assertColorsMatch(labelDataPoints[3].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
                helpers.assertColorsMatch(labelDataPoints[4].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
                helpers.assertColorsMatch(labelDataPoints[5].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
                helpers.assertColorsMatch(labelDataPoints[6].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
                helpers.assertColorsMatch(labelDataPoints[0].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
                helpers.assertColorsMatch(labelDataPoints[1].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
                helpers.assertColorsMatch(labelDataPoints[2].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
                helpers.assertColorsMatch(labelDataPoints[3].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
                helpers.assertColorsMatch(labelDataPoints[4].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
                helpers.assertColorsMatch(labelDataPoints[5].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
                helpers.assertColorsMatch(labelDataPoints[6].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            });

            it("Label data points have correct fill", () => {
                let labelColor = "#007700";
                let dataView = new WaterfallDataBuilder().withDataLabels(labelColor).build();
                v.onDataChanged({ dataViews: [dataView] });

                let labelDataPoints = callCreateLabelDataPoints(v);
                helpers.assertColorsMatch(labelDataPoints[0].outsideFill, labelColor);
                helpers.assertColorsMatch(labelDataPoints[1].outsideFill, labelColor);
                helpers.assertColorsMatch(labelDataPoints[2].outsideFill, labelColor);
                helpers.assertColorsMatch(labelDataPoints[3].outsideFill, labelColor);
                helpers.assertColorsMatch(labelDataPoints[4].outsideFill, labelColor);
                helpers.assertColorsMatch(labelDataPoints[5].outsideFill, labelColor);
                helpers.assertColorsMatch(labelDataPoints[6].outsideFill, labelColor);
                helpers.assertColorsMatch(labelDataPoints[0].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
                helpers.assertColorsMatch(labelDataPoints[1].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
                helpers.assertColorsMatch(labelDataPoints[2].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
                helpers.assertColorsMatch(labelDataPoints[3].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
                helpers.assertColorsMatch(labelDataPoints[4].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
                helpers.assertColorsMatch(labelDataPoints[5].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
                helpers.assertColorsMatch(labelDataPoints[6].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            });

            it("Label data points have correct display units", () => {
                let dataView = new WaterfallDataBuilder().withDataLabels(undefined, 1000, 1).build();
                v.onDataChanged({ dataViews: [dataView] });

                let labelDataPoints = callCreateLabelDataPoints(v);
                expect(labelDataPoints[0].text).toEqual("0.1K");
                expect(labelDataPoints[1].text).toEqual("-0.2K");
                expect(labelDataPoints[2].text).toEqual("0.0K");
                expect(labelDataPoints[3].text).toEqual("0.3K");
                expect(labelDataPoints[4].text).toEqual("0.0K");
                expect(labelDataPoints[5].text).toEqual("0.0K");
                expect(labelDataPoints[6].text).toEqual("0.2K");
            });

            it("Label data points have correct precision", () => {
                let dataView = new WaterfallDataBuilder().withDataLabels(undefined, undefined, 2).build();
                v.onDataChanged({ dataViews: [dataView] });

                let labelDataPoints = callCreateLabelDataPoints(v);
                expect(labelDataPoints[0].text).toEqual("100.00");
                expect(labelDataPoints[1].text).toEqual("-200.00");
                expect(labelDataPoints[2].text).toEqual("0.00");
                expect(labelDataPoints[3].text).toEqual("300.00");
                expect(labelDataPoints[4].text).toEqual("0.00");
                expect(labelDataPoints[5].text).toEqual("0.00");
                expect(labelDataPoints[6].text).toEqual("200.00");
            });

            it("Label data points have correct text size", () => {
                let textSize = 20;
                let dataView = new WaterfallDataBuilder().withDataLabels(undefined, undefined, 2, textSize).build();
                v.onDataChanged({ dataViews: [dataView] });

                let labelDataPoints = callCreateLabelDataPoints(v);
                expect(labelDataPoints[0].fontSize).toEqual(textSize);
                expect(labelDataPoints[1].fontSize).toEqual(textSize);
                expect(labelDataPoints[2].fontSize).toEqual(textSize);
                expect(labelDataPoints[3].fontSize).toEqual(textSize);
                expect(labelDataPoints[4].fontSize).toEqual(textSize);
                expect(labelDataPoints[5].fontSize).toEqual(textSize);
                expect(labelDataPoints[6].fontSize).toEqual(textSize);
            });

            it("Label data points draw with default text size", () => {
                let textSize = 9;
                let dataView = new WaterfallDataBuilder().withDataLabels(undefined, undefined, 2).build();
                v.onDataChanged({ dataViews: [dataView] });

                let labelDataPoints = callCreateLabelDataPoints(v);
                expect(labelDataPoints[0].fontSize).toEqual(textSize);
                expect(labelDataPoints[1].fontSize).toEqual(textSize);
                expect(labelDataPoints[2].fontSize).toEqual(textSize);
                expect(labelDataPoints[3].fontSize).toEqual(textSize);
                expect(labelDataPoints[4].fontSize).toEqual(textSize);
                expect(labelDataPoints[5].fontSize).toEqual(textSize);
                expect(labelDataPoints[6].fontSize).toEqual(textSize);
            });
        });

        function getFillColor(element: JQuery): string {
            return element.css("fill");
        }

        function getRects(): JQuery {
            return $(".mainGraphicsContext rect.column");
        }

        function getConnectors(): JQuery {
            return $(".mainGraphicsContext line.waterfall-connector");
        }

        function callCreateLabelDataPoints(v: powerbi.IVisual): powerbi.LabelDataPoint[] {
            return (<any>v).layers[0].createLabelDataPoints();
        }
    });

    class WaterfallDataBuilder {
        private _categoryColumn: powerbi.DataViewMetadataColumn = { displayName: "year", type: ValueType.fromDescriptor({ text: true }), queryName: "Year.Year", roles: { Category: true } };
        public get categoryColumn(): powerbi.DataViewMetadataColumn { return this._categoryColumn; }

        private _categoryValues: any[] = [2015, 2016, 2017, 2018, 2019, 2020];
        public get categoryValues(): any[] { return this._categoryValues; }

        private _categoryIdentities: powerbi.DataViewScopeIdentity[] = this.categoryValues.map((v) => mocks.dataViewScopeIdentity(v));
        public get categoryIdentities(): powerbi.DataViewScopeIdentity[] { return this._categoryIdentities; }

        private _measureColumn: powerbi.DataViewMetadataColumn = { displayName: "sales", isMeasure: true, type: ValueType.fromDescriptor({ integer: true }), queryName: 'Sales.Sales', objects: { general: { formatString: "$0" } }, roles: { Y: true } };
        public get measureColumn(): powerbi.DataViewMetadataColumn { return this._measureColumn; }

        private _measureValues: any[] = [100, -200, 0, 300, null, NaN];
        public get measureValues(): any[] { return this._measureValues; }

        private _tooltipColumn: powerbi.DataViewMetadataColumn = { displayName: "tooltips", isMeasure: true, type: ValueType.fromDescriptor({ integer: true }), queryName: 'Tooltips.Tooltips', objects: { general: { formatString: "$0" } }, roles: { Tooltips: true } };
        public get tooltipColumn(): powerbi.DataViewMetadataColumn { return this._tooltipColumn; }

        private _tooltipValues: any[] = [10, -20, 30, 40, null, 0];
        public get tooltipValues(): any[] { return this._tooltipValues; }

        private _posMax = 200;
        public get positionMax(): number { return this._posMax; }

        private _posMin = -100;
        public get positionMin(): number { return this._posMin; }

        private _total = 200;
        public get total(): number { return this._total; }

        private _dataLabelSettings: powerbi.visuals.VisualDataLabelsSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
        public get dataLabelSettings(): powerbi.visuals.VisualDataLabelsSettings { return this._dataLabelSettings; }

        private _objects: powerbi.DataViewObjects;
        public get objects(): powerbi.DataViewObjects { return this._objects; }

        private _sentimentColors: powerbi.visuals.WaterfallChartSentimentColors = {
            increaseFill: <powerbi.Fill>{
                solid: { color: "#FF0000" }
            },
            decreaseFill: <powerbi.Fill>{
                solid: { color: "#00FF00" }
            },
            totalFill: <powerbi.Fill>{
                solid: { color: "#0000FF" }
            }
        };
        public get sentimentColors(): powerbi.visuals.WaterfallChartSentimentColors { return this._sentimentColors; }

        public build(): powerbi.DataView {
            return <powerbi.DataView>{
                metadata: {
                    columns: [this._categoryColumn, this._measureColumn],
                    objects: this._objects,
                },
                categorical: {
                    categories: [{
                        source: this._categoryColumn,
                        values: this._categoryValues,
                        identity: this._categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([
                    {
                        source: this._measureColumn,
                        values: this._measureValues
                    },{
                        source: this._tooltipColumn,
                        values: this._tooltipValues
                    }])
                }
            };
        }

        public withMeasureValues(values: any[], posMin: number, posMax: number, total: number): WaterfallDataBuilder {
            this._measureValues = values;
            this._posMin = posMin;
            this._posMax = posMax;
            this._total = total;

            return this;
        }

        public withCategories(categories: any[]): WaterfallDataBuilder {
            this._categoryValues = categories;
            this._categoryIdentities = this._categoryValues.map((v) => mocks.dataViewScopeIdentity(v));

            return this;
        }

        public withDataLabels(color?: string, labelDisplayUnits?: number, labelPrecision?: number, fontSize?: number): WaterfallDataBuilder {
            if (!this._objects) {
                this._objects = {};
            }
            this._objects["labels"] = <powerbi.visuals.DataLabelObject>{
                show: true,
                color: { solid: { color: color } },
                labelDisplayUnits: labelDisplayUnits,
                labelPosition: undefined,
                labelPrecision: labelPrecision,
                fontSize: fontSize,
            };
            return this;
        };

        public withLegend(fontSize?: number): WaterfallDataBuilder {
            if (!this._objects) {
                this._objects = {};
            }
            this._objects["legend"] = {
                show: true,
                fontSize: fontSize,
            };
            return this;
        };
    }

    class WaterfallVisualBuilder {
        private _style: powerbi.IVisualStyle = powerbi.visuals.visualStyles.create();
        public get style(): powerbi.IVisualStyle { return this._style; }

        private _host: powerbi.IVisualHostServices = mocks.createVisualHostServices();
        public get host(): powerbi.IVisualHostServices { return this._host; }

        private _svg: D3.Selection = d3.select($("<svg/>").get(0));
        private _viewport: powerbi.IViewport = {
            height: 500,
            width: 500
        };

        private _element: JQuery = powerbitests.helpers.testDom("500", "500");
        public get element(): JQuery { return this._element; }

        private _cartesianHost: powerbi.visuals.ICartesianVisualHost = {
            updateLegend: data => { },
            getSharedColors: () => null,
            triggerRender: (suppressAnimations: boolean) => { },
        };

        private _visual: powerbi.IVisual;

        public build(minerva: boolean = false): powerbi.IVisual {
            if (minerva) {
                this._visual = new powerbi.visuals.CartesianChart({
                    chartType: powerbi.visuals.CartesianChartType.Waterfall,
                    isScrollable: true,
                    tooltipsEnabled: true,
                    behavior: new powerbi.visuals.CartesianChartBehavior([new powerbi.visuals.WaterfallChartWebBehavior()])
                });
            }
            else {
                this._visual = powerbi.visuals.plugins.waterfallChart.create();
            }

            this._visual.init(this.buildInitOptions());

            return this._visual;
        }

        public buildInitOptions(): powerbi.visuals.CartesianVisualInitOptions {
            return <powerbi.visuals.CartesianVisualInitOptions>{
                element: this._element,
                host: this._host,
                style: this._style,
                viewport: this._viewport,
                interactivity: { isInteractiveLegend: false, selection: true },
                animation: { transitionImmediate: true },
                svg: this._svg,
                cartesianHost: this._cartesianHost
            };
        }

        public withSize(width: number, height: number): WaterfallVisualBuilder {
            this._element = powerbitests.helpers.testDom(height.toString(), width.toString());
            this._viewport = {
                width: width,
                height: height
            };

            return this;
        }
    }
}
