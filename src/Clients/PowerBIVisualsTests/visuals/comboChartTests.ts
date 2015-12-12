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
    import DataViewTransform = powerbi.data.DataViewTransform;
    import ValueType = powerbi.ValueType;
    import PrimitiveType = powerbi.PrimitiveType;
    import ComboChart = powerbi.visuals.ComboChart;
    import ComboChartDataViewObjects = powerbi.visuals.ComboChartDataViewObjects;
    import AxisType = powerbi.visuals.axisType;
    import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
    import PixelConverter = jsCommon.PixelConverter;

    powerbitests.mocks.setLocale();

    describe("ComboChart", () => {
        it("registered capabilities", () => {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin("comboChart").capabilities)
                .toBe(ComboChart.capabilities);

            expect(powerbi.visuals.visualPluginFactory.create().getPlugin("lineClusteredColumnComboChart").capabilities)
                .toBe(ComboChart.capabilities);

            expect(powerbi.visuals.visualPluginFactory.create().getPlugin("lineStackedColumnComboChart").capabilities)
                .toBe(ComboChart.capabilities);
        });

        it("capabilities should include dataViewMappings", () => {
            expect(ComboChart.capabilities.dataViewMappings).toBeDefined();
        });

        it("capabilities should include dataRoles", () => {
            expect(ComboChart.capabilities.dataRoles).toBeDefined();
        });

        it("Capabilities should not suppressDefaultTitle", () => {
            expect(ComboChart.capabilities.suppressDefaultTitle).toBeUndefined();
        });

        it("FormatString property should match calculated", () => {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(powerbi.visuals.ComboChart.capabilities.objects))
                .toEqual(powerbi.visuals.comboChartProps.general.formatString);
        });

        it("Capabilities should include implicitSort", () => {
            expect(ComboChart.capabilities.sorting.default).toBeDefined();
        });
    });

    describe("ComboChart DOM validation", () => {
        let visualBuilder: VisualBuilder;
        let element: JQuery;

        beforeEach((done) => {
            element = powerbitests.helpers.testDom('500', '500');
            visualBuilder = new VisualBuilder("comboChart");

            done();
        });

        it("Ensure both charts and axis created with two data views - default", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewDefault(),
                    dataViewFactory.buildDataViewInAnotherDomainOneValue()
                ]
            });

            setTimeout(() => {
                let lineCharts = $(".lineChart").length;
                let columnCharts = $(".columnChart").length;
                let yAxis = $(".y.axis").length;
                let legend = $(".legend").length;

                expect(lineCharts).toBe(1);
                expect(columnCharts).toBe(1);
                expect(yAxis).toBe(2);
                expect(legend).toBe(1);
                expect($(".legend").children.length).toBe(2);

                done();
            }, DefaultWaitForRender);
        });

        it("Ensure empty 1st dataview and populated 2nd has correct axes and lines", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewEmpty(),
                    dataViewFactory.buildDataViewDefault()
                ]
            });

            setTimeout(() => {
                let lineCharts = $(".lineChart").length;
                let columnCharts = $(".columnChart").length;
                let yAxisCount = $(".y.axis").length;
                let legend = $(".legend").length;

                expect(lineCharts).toBe(1);
                expect(columnCharts).toBe(1);
                expect(yAxisCount).toBe(2); //one is empty
                expect(legend).toBe(1);

                let yAxisPos = $(".y.axis").position();
                let rectCount = $(".columnChart .column").length;
                let lineCount = $(".lineChart .line").length;
                expect(yAxisPos.left).toBeLessThan(50);
                expect(rectCount).toBe(0);
                expect(lineCount).toBe(3);

                let y1 = $($(".y.axis")[0]).find(".tick").length;
                let y2 = $($(".y.axis")[1]).find(".tick").length;
                expect(y1).toEqual(8);
                expect(y2).toEqual(0);

                done();
            }, DefaultWaitForRender);
        });

        it("Ensure comboCharts clear - with metadata", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewInAnotherDomain(),
                    dataViewFactory.buildDataViewDefault()
                ]
            });

            setTimeout(() => {
                let lineCharts = $(".lineChart").length;
                let columnCharts = $(".columnChart").length;
                let yAxisCount = $(".y.axis").length;
                let legend = $(".legend").length;
                let rectCount = $(".columnChart .column").length;
                let y2tickCount = $($(".y.axis")[1]).find(".tick").length;
                
                expect(lineCharts).toBe(1);
                expect(columnCharts).toBe(1);
                expect(yAxisCount).toBe(2);
                expect(legend).toBe(1);
                expect(rectCount).toBe(3);
                expect($(".legend").children.length).toBe(2);
                expect(y2tickCount).toBeGreaterThan(0);

                // clear line
                visualBuilder.onDataChanged({
                    dataViews: [
                        dataViewFactory.buildDataViewInAnotherDomain(),
                        dataViewFactory.buildDataViewEmpty()
                    ]
                });

                setTimeout(() => {
                    let rectCountNew = $(".columnChart .column").length;
                    expect(rectCountNew).toBe(3);
                    let catCountNew = $(".lineChart").find(".cat").length;
                    expect(catCountNew).toBe(0);
                    let y2tickCountNew = $($(".y.axis")[1]).find(".tick").length;
                    expect(y2tickCountNew).toEqual(0);

                    // clear columns, add back line
                    visualBuilder.onDataChanged({
                        dataViews: [
                            dataViewFactory.buildDataViewEmpty(),
                            dataViewFactory.buildDataViewDefault()
                        ]
                    });

                    setTimeout(() => {
                        let rectCountFinal = $(".columnChart .column").length;
                        expect(rectCountFinal).toBe(0);
                        let catCountFinal = $(".lineChart").find(".cat").length;
                        expect(catCountFinal).toBe(3);
                        let y2tickCountFinal = $($(".y.axis")[1]).find(".tick").length;
                        // y2 axis (line value axis) should be shifted to y1 in this case
                        expect(y2tickCountFinal).toEqual(0);

                        done();
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it("Ensure comboCharts clear - no line measure metadata", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewInAnotherDomain(),
                    dataViewFactory.buildDataViewDefault()
                ]
            });

            setTimeout(() => {
                let lineCharts = $(".lineChart").length;
                let columnCharts = $(".columnChart").length;
                let yAxisCount = $(".y.axis").length;
                let legend = $(".legend").length;
                let rectCount = $(".columnChart .column").length;
                let y2tickCount = $($(".y.axis")[1]).find(".tick").length;

                expect(lineCharts).toBe(1);
                expect(columnCharts).toBe(1);
                expect(yAxisCount).toBe(2);
                expect(legend).toBe(1);
                expect(rectCount).toBe(3);
                expect($(".legend").children.length).toBe(2);
                expect(y2tickCount).toBeGreaterThan(0);

                // clear line - only one dataView sent in
                visualBuilder.onDataChanged({
                    dataViews: [dataViewFactory.buildDataViewInAnotherDomain()]
                });

                setTimeout(() => {
                    let rectCountNew = $(".columnChart .column").length;
                    expect(rectCountNew).toBe(3);
                    let catCountNew = $(".lineChart").find(".cat").length;
                    expect(catCountNew).toBe(0);
                    let y2tickCountNew = $($(".y.axis")[1]).find(".tick").length;
                    expect(y2tickCountNew).toEqual(0);

                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it("Ensure both charts and only one axis created with two data views - default", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewDefault(),
                    dataViewFactory.buildDataViewDefault()
                ]
            });

            setTimeout(() => {
                let lineCharts = $(".lineChart").length;
                let columnCharts = $(".columnChart").length;
                let yAxis = $(".y.axis").length;
                let legend = $(".legend").length;

                expect(lineCharts).toBe(1);
                expect(columnCharts).toBe(1);
                expect(yAxis).toBe(2);
                expect(legend).toBe(1);
                expect($(".legend").children.length).toBe(2);

                let y1 = $($(".y.axis")[0]).find(".tick").length;
                let y2 = $($(".y.axis")[1]).find(".tick").length;
                expect(y2).toEqual(0);
                expect(y1).not.toEqual(y2);

                done();
            }, DefaultWaitForRender);
        });

        it("Ensure both charts and axis created with two data views - stacked", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewDefault(true),
                    dataViewFactory.buildDataViewInAnotherDomain(true)
                ]
            });

            setTimeout(() => {
                let lineCharts = $(".lineChart").length;
                let columnCharts = $(".columnChart").length;
                let yAxis = $(".y.axis").length;
                let legend = $(".legend").length;

                expect(lineCharts).toBe(1);
                expect(columnCharts).toBe(1);
                expect(yAxis).toBe(2);
                expect(legend).toBe(1);

                done();
            }, DefaultWaitForRender);
        });

        it("Ensure both charts and One axis created with two data views - stacked", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewDefault(true),
                    dataViewFactory.buildDataViewDefault(true)
                ]
            });

            setTimeout(() => {
                let lineCharts = $(".lineChart").length;
                let columnCharts = $(".columnChart").length;
                let yAxis = $(".y.axis").length;
                let legend = $(".legend").length;

                expect(lineCharts).toBe(1);
                expect(columnCharts).toBe(1);
                expect(yAxis).toBe(2);
                expect(legend).toBe(1);

                let y1 = $($(".y.axis")[0]).find(".tick").length;
                let y2 = $($(".y.axis")[1]).find(".tick").length;
                expect(y2).toEqual(0);
                expect(y1).not.toEqual(y2);

                done();
            }, DefaultWaitForRender);
        });

        it("Ensure both charts and axis created with two data views - clustered", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewDefault(true),
                    dataViewFactory.buildDataViewInAnotherDomain(true)
                ]
            });

            setTimeout(() => {
                let lineCharts = $(".lineChart").length;
                let columnCharts = $(".columnChart").length;
                let yAxis = $(".y.axis").length;
                let legend = $(".legend").length;

                expect(lineCharts).toBe(1);
                expect(columnCharts).toBe(1);
                expect(yAxis).toBe(2);
                expect(legend).toBe(1);

                done();
            }, DefaultWaitForRender);
        });

        it("Ensure both charts and only one axis created with two data views - clustered", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewDefault(true),
                    dataViewFactory.buildDataViewDefault(true)
                ]
            });

            setTimeout(() => {
                let lineCharts = $(".lineChart").length;
                let columnCharts = $(".columnChart").length;
                let yAxis = $(".y.axis").length;
                let legend = $(".legend").length;

                expect(lineCharts).toBe(1);
                expect(columnCharts).toBe(1);
                expect(yAxis).toBe(2);
                expect(legend).toBe(1);

                let y1 = $($(".y.axis")[0]).find(".tick").length;
                let y2 = $($(".y.axis")[1]).find(".tick").length;
                expect(y2).toEqual(0);
                expect(y1).not.toEqual(y2);

                done();
            }, DefaultWaitForRender);
        });

        it("combo chart validate auto margin", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewDefault(true),
                    dataViewFactory.buildDataViewDefault(true)
                ]
            });

            setTimeout(() => {
                let yTranslate = parseFloat($(".axisGraphicsContext .x.axis").attr("transform").split(",")[1].replace("(", ""));
                let xTranslate = parseFloat($(".axisGraphicsContext").attr("transform").split(",")[0].split("(")[1]);

                visualBuilder.onDataChanged({
                    dataViews: [
                        dataViewFactory.buildDataViewSuperLongLabels(true),
                        dataViewFactory.buildDataViewSuperLongLabels(true)
                    ]
                });

                setTimeout(() => {
                    let newYTranslate = parseFloat($(".axisGraphicsContext .x.axis").attr("transform").split(",")[1].replace("(", ""));
                    let newXTranslate = parseFloat($(".axisGraphicsContext").attr("transform").split(",")[0].split("(")[1]);
                    expect(yTranslate).toBeGreaterThan(newYTranslate);
                    expect(newXTranslate).toBeGreaterThan(xTranslate);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it("Ensure scrollbar is shown at smaller viewport dimensions", (done) => {
            visualBuilder.setSize("100", "100");

            visualBuilder.buildVisualMinerva("lineClusteredColumnComboChart");

            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewManyCategories(true),
                    dataViewFactory.buildDataViewManyCategories(true)
                ]
            });

            setTimeout(() => {
                let yAxis = $(".y.axis").length;               
                expect(yAxis).toBe(2);

                let y1 = $(".svgScrollable").attr("width");
                expect(y1).toBeLessThan(visualBuilder.element.width());

                expect($("rect.extent").length).toBe(1);
                expect(parseInt($(".brush .extent")[0].attributes.getNamedItem("width").value, 0)).toBeGreaterThan(8);

                visualBuilder.setSize("500", "500");
                expect($('.brush')).not.toBeInDOM();

                done();
            }, DefaultWaitForRender);
        });

        it("Ensure all data points has the default color", (done) => {
            let dataView1 = dataViewFactory.buildDataViewDefault(true);
            let dataView2 = dataViewFactory.buildDataViewInAnotherDomain(true);

            dataView1.metadata.objects = {
                dataPoint: {
                    defaultColor: { solid: { color: "#FF0000" } }                    
                }
            };  

            dataView2.metadata.objects = {
                dataPoint: {
                    defaultColor: { solid: { color: "#FF0000" } }
                }
            };  

            visualBuilder.onDataChanged({ dataViews: [dataView1, dataView2] });

            setTimeout(() => {
                let lineCharts = $(".lineChart").length;
                let columnCharts = $(".columnChart").length;
                let yAxis = $(".y.axis").length;
                let legend = $(".legend").length;

                expect(lineCharts).toBe(1);
                expect(columnCharts).toBe(1);
                expect(yAxis).toBe(2);
                expect(legend).toBe(1);
                
                helpers.assertColorsMatch($(".legendIcon").eq(0).css("fill"), "#ff0000");
                helpers.assertColorsMatch($(".legendIcon").eq(2).css("fill"), "#ff0000");

                done();
            }, DefaultWaitForRender);
        });

        it("Ensure zero axis line is darkened", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewNegative(true),
                    dataViewFactory.buildDataViewNegative(true)
                ]
            });

            setTimeout(() => {
                let zeroTicks = $("g.tick:has(line.zero-line)");

                expect(zeroTicks.length).toBe(2);
                zeroTicks.each((i, item) => {
                    expect(d3.select(item).datum() === 0).toBe(true);
                });

                done();
            }, DefaultWaitForRender);
        });
        
        it("Values that have NaN show a warning.", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewInvalid(NaN)
                ]
            });

            setTimeout(() => {
                expect(visualBuilder.warningSpy).toHaveBeenCalled();
                expect(visualBuilder.warningSpy.calls.count()).toBe(1);
                expect(visualBuilder.warningSpy.calls.argsFor(0)[0][0].code).toBe("NaNNotSupported");
                done();
            }, DefaultWaitForRender);
        });

        it("Values that have Negative Infinity show a warning.", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewInvalid(Number.NEGATIVE_INFINITY)
                ]
            });

            setTimeout(() => {
                expect(visualBuilder.warningSpy).toHaveBeenCalled();
                expect(visualBuilder.warningSpy.calls.count()).toBe(1);
                expect(visualBuilder.warningSpy.calls.argsFor(0)[0][0].code).toBe("InfinityValuesNotSupported");
                done();
            }, DefaultWaitForRender);
        });

        it("Values that have Positive Infinity show a warning.", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewInvalid(Number.POSITIVE_INFINITY)
                ]
            });

            setTimeout(() => {
                expect(visualBuilder.warningSpy).toHaveBeenCalled();
                expect(visualBuilder.warningSpy.calls.count()).toBe(1);
                expect(visualBuilder.warningSpy.calls.argsFor(0)[0][0].code).toBe("InfinityValuesNotSupported");
                done();
            }, DefaultWaitForRender);
        });

        it("Values that are out of range show a warning.", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewInvalid(1e301)
                ]
            });

            setTimeout(() => {
                expect(visualBuilder.warningSpy).toHaveBeenCalled();
                expect(visualBuilder.warningSpy.calls.count()).toBe(1);
                expect(visualBuilder.warningSpy.calls.argsFor(0)[0][0].code).toBe("ValuesOutOfRange");
                done();
            }, DefaultWaitForRender);
        });

        it("All values good do not show a warning.", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewInvalid(3)
                ]
            });

            setTimeout(() => {
                expect(visualBuilder.warningSpy).not.toHaveBeenCalled();
                done();
            }, DefaultWaitForRender);
        });
        
        it("Validate enumerate labels", (done) => {
            let dataView1 = dataViewFactory.buildDataForLabelsFirstType();

            dataView1.metadata.objects = null;

            visualBuilder.onDataChanged({ dataViews: [dataView1, null] });
            let points = <VisualObjectInstanceEnumerationObject>visualBuilder.visual.enumerateObjectInstances({ objectName: "labels" });

            setTimeout(() => {
                expect(points.instances.length).toBeGreaterThan(0);
                done();
            }, DefaultWaitForRender);
        });        

        it('validate shoulShowLegendCard with single value on column and no line values', (done) => {
            let dataView1 = dataViewFactory.buildDataViewSingleMeasure();

            let lineDataView = null;
           
            visualBuilder.onDataChanged({ dataViews: [dataView1, lineDataView] });

            let points = <VisualObjectInstanceEnumerationObject>visualBuilder.visual.enumerateObjectInstances({ objectName: 'legend' });

            setTimeout(() => {
                expect(points).toBeUndefined();
                done();
            }, DefaultWaitForRender);
        });

        it('validate shoulShowLegendCard with dynamic series on column and no line values', (done) => {
            let dynamicSeriesDataView = dataViewFactory.buildDataViewDynamicSeries();

            let lineDataView = null;
            
            visualBuilder.onDataChanged({ dataViews: [dynamicSeriesDataView, lineDataView] });

            let points = <VisualObjectInstanceEnumerationObject>visualBuilder.visual.enumerateObjectInstances({ objectName: 'legend' });

            setTimeout(() => {
                expect(points.instances.length).toBeGreaterThan(0);
                done();
            }, DefaultWaitForRender);
            });

        it('validate shoulShowLegendCard with static series for column and line', (done) => {
            let dynamicSeriesDataView = dataViewFactory.buildDataViewDefault();
            let staticSeriesDataView = dataViewFactory.buildDataViewDefault();
            
            visualBuilder.onDataChanged({ dataViews: [dynamicSeriesDataView, staticSeriesDataView] });

            let points = <VisualObjectInstanceEnumerationObject>visualBuilder.visual.enumerateObjectInstances({ objectName: 'legend' });

            setTimeout(() => {
                expect(points.instances.length).toBeGreaterThan(0);
                done();
            }, DefaultWaitForRender);
        });

        it('xAxis customization- begin and end check', (done) => {
            let objects: ComboChartDataViewObjects = {
                general: dataViewFactory.general,
                categoryAxis: {
                    displayName: "scalar",
                    show: true,
                    start: 0,
                    end: 1000,
                    axisType: AxisType.scalar,
                    showAxisTitle: true,
                    axisStyle: true
                }
            };
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewNumber(objects),
                    dataViewFactory.buildDataViewNumber(objects)]
            });

            setTimeout(() => {
                let labels = $(".x.axis").children(".tick");

                //Verify begin&end labels
                expect(labels[0].textContent).toBe("0");
                expect(labels[labels.length - 1].textContent).toBe("1,000");

                done();
            }, DefaultWaitForRender);
        });

        it('Axis customization- display units', (done) => {
            var objects: ComboChartDataViewObjects = {
                general: dataViewFactory.general,
                categoryAxis: {
                    displayName: "scalar",
                    show: true,
                    start: 0,
                    end: 100000,
                    axisType: AxisType.scalar,
                    showAxisTitle: true,                    
                    labelDisplayUnits: 1000,
                    labelPrecision: 5
                },
                valueAxis: {
                    secShow: true,
                    labelDisplayUnits: 1000,
                    labelPrecision: 5,
                    start: 0,
                    end: 1000000,
                    secStart: 0,
                    secEnd: 1000000,
                    secLabelDisplayUnits: 1000,
                    secLabelPrecision: 5,
                }
            };
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewNumber(objects),
                    dataViewFactory.buildDataViewNumber(objects)]
            });

            setTimeout(() => {
                var ylabels = $(".axisGraphicsContext .y.axis").first().find(".tick");

                //Verify begin&end labels
                expect(ylabels[0].textContent).toBe("0.00000K");
                expect(ylabels[ylabels.length - 1].textContent).toBe("1,000.00000K");

                var y1labels = $(".axisGraphicsContext .y.axis").last().find(".tick");

                //Verify begin&end labels
                expect(y1labels[0].textContent).toBe("0.00000K");
                expect(y1labels[y1labels.length - 1].textContent).toBe("1,000.00000K");

                var xlabels = $(".x.axis").children(".tick");

                //Verify begin&end labels
                expect(xlabels[0].textContent).toBe("0.00000K");
                expect(xlabels[xlabels.length - 1].textContent).toBe("100.00000K");

                done();
            }, DefaultWaitForRender);
        });

        it("Merge axes when user turns off the secondary axis.", (done) => {
            let objects: ComboChartDataViewObjects = {
                general: dataViewFactory.general,
                valueAxis: {
                    secShow: false
                }
            };

            let dataView = dataViewFactory.buildDataViewCustomSingleColumn(objects, [[4000, 6000, 10000]]);
            
            let dataViewAnotherDomain = dataViewFactory.buildDataViewCustom(objects, [[1], [10], [20]]);
            
            visualBuilder.onDataChanged({ dataViews: [dataViewAnotherDomain, dataView] });
            setTimeout(() => {
                let axisLabels = $(".axisGraphicsContext .y.axis").first().find(".tick");
                
                expect(axisLabels[0].textContent).toBe("0K");
                expect(axisLabels[axisLabels.length - 1].textContent).toBe("10K");

                done();
            }, DefaultWaitForRender);
        });

        it("Unmerge axis when user turns on the secondary axis.", (done) => {
            let objects: ComboChartDataViewObjects = {
                general: dataViewFactory.general,
                valueAxis: {
                    secShow: true
                }
            };

            let dataView = dataViewFactory.buildDataViewCustomSingleColumn(objects, [[5, 15, 25]]);

            let dataViewAnotherDomain = dataViewFactory.buildDataViewCustom(objects, [[1], [10], [30]]);

            visualBuilder.onDataChanged({ dataViews: [dataViewAnotherDomain, dataView] });
            setTimeout(() => {
                let axisLabels = $(".axisGraphicsContext .y.axis").first().find(".tick");
                
                expect(axisLabels[0].textContent).toBe("0");
                expect(axisLabels[axisLabels.length - 1].textContent).toBe("30");

                axisLabels = $(".axisGraphicsContext .y.axis").last().find(".tick");
                
                expect(axisLabels[0].textContent).toBe("5");
                expect(axisLabels[axisLabels.length - 1].textContent).toBe("25");

                done();
            }, DefaultWaitForRender);
        });

        it("Verify force to zero works for a positive domain range", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewInAnotherDomain(),
                    dataViewFactory.buildDataViewCustom(undefined, [[4000, 6000, 7000]])]
            });

            setTimeout(() => {
                let axisLabels = $(".axisGraphicsContext .y.axis").last().find(".tick");
                //Verify begin&end labels
                expect(axisLabels[0].textContent).toBe("0K");
                expect(axisLabels[axisLabels.length - 1].textContent).toBe("7K");

                done();
            }, DefaultWaitForRender);
        });

        it("Verify force to zero is not set for a negative domain range", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewInAnotherDomain(),
                    dataViewFactory.buildDataViewCustom(undefined, [[-2000, -6000, -7000]])]
            });

            setTimeout(() => {
                let axisLabels = $(".axisGraphicsContext .y.axis").last().find(".tick");
                //Verify begin&end axis labels
                expect(axisLabels[0].textContent).toBe("-7K");
                expect(axisLabels[axisLabels.length - 1].textContent).toBe("-2K");

                done();
            }, DefaultWaitForRender);
        });

        it("Ensure both titles created in Line and Stacked column chart", (done) => {
            let objects: ComboChartDataViewObjects = {
                general: dataViewFactory.general,
                valueAxis: {
                    show: true,
                    showAxisTitle: true,
                    secShowAxisTitle: true
                }
            };

            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewNumber(objects),
                    dataViewFactory.buildDataViewInAnotherDomainOneValue(objects)]
            });

            setTimeout(() => {
                let lineAxisLabel = $(".yAxisLabel").length;
                expect(lineAxisLabel).toBe(2);
                expect($(".yAxisLabel").first().text()).toBe("col2, col3 and col4");
                expect($(".yAxisLabel").last().text()).toBe("col2");

                done();
            }, DefaultWaitForRender);
        });

        it("Check font size default in the combo chart", (done) => {
            visualBuilder.initVisual();

            let dataView1 = dataViewFactory.buildDataForLabelsFirstType();
            let dataView2 = dataViewFactory.buildDataForLabelsSecondType();

            visualBuilder.onDataChanged({ dataViews: [dataView1, dataView2] });
            setTimeout(() => {
                expect($(".labelGraphicsContext")).toBeInDOM();
                expect($(".labelGraphicsContext .label").length).toBe(6);
                $('.labelGraphicsContext .label').each(function (idx, ele) {
                    expect($(ele).css('font-size')).toBe('12px');
                });
                done();
            }, DefaultWaitForRender);
        });

        it("Check font size change in the combo chart", (done) => {
            visualBuilder.initVisual();

            let dataView1 = dataViewFactory.buildDataForLabelsFirstType(undefined, undefined, undefined, 12);
            let dataView2 = dataViewFactory.buildDataForLabelsSecondType(undefined, undefined, undefined, 12);

            visualBuilder.onDataChanged({ dataViews: [dataView1, dataView2] });
            setTimeout(() => {
                expect($(".labelGraphicsContext")).toBeInDOM();
                expect($(".labelGraphicsContext .label").length).toBe(6);
                $('.labelGraphicsContext .label').each(function (idx, ele) {
                    expect($(ele).css('font-size')).toBe('16px');
                });
                done();
            }, DefaultWaitForRender);
        });

        it("Ensure only secondary title created in Line and Stacked column chart", (done) => {
            let objects: ComboChartDataViewObjects = {
                general: dataViewFactory.general,
                valueAxis: {
                    show: true,
                    showAxisTitle: false,
                    secShowAxisTitle: true
                }
            };

            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewNumber(objects),
                    dataViewFactory.buildDataViewInAnotherDomainOneValue(objects)]
            });

            setTimeout(() => {
                let lineAxisLabel = $(".yAxisLabel").length;
                expect(lineAxisLabel).toBe(1);
                expect($(".yAxisLabel").first().text()).toBe("col2");

                done();
            }, DefaultWaitForRender);
        });

        it("Combo chart with dynamic series and static series has correct colors", (done) => {
            let colors = [
                { value: "#000000" },
                { value: "#000001" },
                { value: "#000002" },
                { value: "#000003" },
                { value: "#000004" }
            ];

            visualBuilder.style.colorPalette.dataColors = new powerbi.visuals.DataColorPalette(colors);

            visualBuilder.initVisual();

            let dynamicSeriesDataView = dataViewFactory.buildDataViewDynamicSeries();
            let staticSeriesDataView = dataViewFactory.buildDataViewDefault();

            // Column chart has a dynamic series, line chart has a static series.
            visualBuilder.onDataChanged({ dataViews: [dynamicSeriesDataView, staticSeriesDataView] });

            setTimeout(() => {
                let lines = $(".lineChart .line");

                let columnSeries = $(".columnChart .series");
                expect(columnSeries.length).toBe(2);

                let series1Columns = columnSeries.eq(0).children(".column");
                let series2Columns = columnSeries.eq(1).children(".column");

                // Dynamic series columns
                helpers.assertColorsMatch(series1Columns.eq(0).css("fill"), colors[0].value);
                helpers.assertColorsMatch(series1Columns.eq(1).css("fill"), colors[0].value);
                helpers.assertColorsMatch(series1Columns.eq(2).css("fill"), colors[0].value);

                helpers.assertColorsMatch(series2Columns.eq(0).css("fill"), colors[1].value);
                helpers.assertColorsMatch(series2Columns.eq(1).css("fill"), colors[1].value);
                helpers.assertColorsMatch(series2Columns.eq(2).css("fill"), colors[1].value);

                // Static series lines
                helpers.assertColorsMatch(lines.eq(0).css("stroke"), colors[2].value);
                helpers.assertColorsMatch(lines.eq(1).css("stroke"), colors[3].value);
                helpers.assertColorsMatch(lines.eq(2).css("stroke"), colors[4].value);

                done();
            }, DefaultWaitForRender);
        });

        it("Combo chart with two static series has correct colors", (done) => {
            let colors = [
                { value: "#000000" },
                { value: "#000001" },
                { value: "#000002" },
                { value: "#000003" },
                { value: "#000004" }
            ];

            visualBuilder.style.colorPalette.dataColors = new powerbi.visuals.DataColorPalette(colors);

            visualBuilder.initVisual();

            let dataView1 = dataViewFactory.buildDataViewCustom(undefined, [[100, 200, 700], [1000, 2000, 7000]], ["a", "b"]);

            let dataView2 = dataViewFactory.buildDataViewCustomWithIdentities([[100, 200, 700], [10000, 20000, 70000]]);

            // Both layers have static series
            visualBuilder.onDataChanged({ dataViews: [dataView1, dataView2] });

            setTimeout(() => {
                let lines = $(".lineChart .line");

                let columnSeries = $(".columnChart .series");
                expect(columnSeries.length).toBe(2);

                let series1Columns = columnSeries.eq(0).children(".column");
                let series2Columns = columnSeries.eq(1).children(".column");

                // Static series columns
                helpers.assertColorsMatch(series1Columns.eq(0).css("fill"), colors[0].value);
                helpers.assertColorsMatch(series1Columns.eq(1).css("fill"), colors[0].value);

                helpers.assertColorsMatch(series2Columns.eq(0).css("fill"), colors[1].value);
                helpers.assertColorsMatch(series2Columns.eq(1).css("fill"), colors[1].value);

                // Static series lines
                helpers.assertColorsMatch(lines.eq(0).css("stroke"), colors[2].value);
                helpers.assertColorsMatch(lines.eq(1).css("stroke"), colors[3].value);

                done();
            }, DefaultWaitForRender);
        });
        
        it("should draw data labels when enabled", (done) => {
            visualBuilder.initVisual();

            let dataView1 = dataViewFactory.buildDataForLabelsFirstType();

            let dataView2 = dataViewFactory.buildDataForLabelsSecondType();

            visualBuilder.onDataChanged({ dataViews: [dataView1, dataView2] });

            setTimeout(() => {
                expect($(".labelGraphicsContext")).toBeInDOM();
                expect($(".labelGraphicsContext .label").length).toBe(6);

                done();
            }, DefaultWaitForRender);
        });
    });

    describe("SharedColorPalette", () => {
        let dataColors: powerbi.visuals.DataColorPalette;
        let sharedPalette: powerbi.visuals.SharedColorPalette;
        var v: powerbi.IVisual, element: JQuery;
        let colors = [
            { value: "#000000" },
            { value: "#000001" },
            { value: "#000002" },
            { value: "#000003" }
        ];
        var dataViewMetadataTwoColumnWithGroup: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    queryName: 'col1',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                },
                {
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    groupName: 'group',
                },
            ],
        };
        beforeEach(() => {
            dataColors = new powerbi.visuals.DataColorPalette(colors);
            sharedPalette = new powerbi.visuals.SharedColorPalette(dataColors);
            element = powerbitests.helpers.testDom('400', '300');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('comboChart').create();
        });

        it('check color for legend title and legend items combo chart', (done) => {
            let labelFontSize = 13;
            let labelColor = "#002121";
            var hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width(),
                },
                animation: { transitionImmediate: true },
                interactivity: { dragDataPoint: true },
            });

            v.onDataChanged(getDataViewForLegend(dataViewMetadataTwoColumnWithGroup, labelColor, labelFontSize));

            let legend = element.find('.legend');
            let legendTitle = legend.find('.legendTitle');
            let legendText = legend.find('.legendItem').find('.legendText');

            setTimeout(() => {
                helpers.assertColorsMatch(legendTitle.css('fill'), labelColor);
                helpers.assertColorsMatch(legendText.first().css('fill'), labelColor);
                done();
            }, DefaultWaitForRender);
        });

        it('check font size for legend title and legend items combo chart', (done) => {
            let labelFontSize = 13;
            let labelColor = "#002121";
            var hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width(),
                },
                animation: { transitionImmediate: true },
                interactivity: { dragDataPoint: true },
            });

            v.onDataChanged(getDataViewForLegend(dataViewMetadataTwoColumnWithGroup, labelColor, labelFontSize));

            let legend = element.find('.legend');
            let legendTitle = legend.find('.legendTitle');
            let legendText = legend.find('.legendItem').find('.legendText');

            setTimeout(() => {
                expect(Math.round(parseInt(legendTitle.css('font-size'), 10))).toBe(Math.round(parseInt(PixelConverter.fromPoint(labelFontSize), 10)));
                expect(Math.round(parseInt(legendText.css('font-size'), 10))).toBe(Math.round(parseInt(PixelConverter.fromPoint(labelFontSize), 10)));
                done();
            }, DefaultWaitForRender);
        });

        it("should get colors for series values from shared series scale", () => {
            let scale1 = dataColors.getColorScaleByKey("series");
            let colorA = scale1.getColor("a");
            let colorB = scale1.getColor("b");

            let scale2 = sharedPalette.getColorScaleByKey("series");

            helpers.assertColorsMatch(scale2.getColor("b").value, colorB.value);
            helpers.assertColorsMatch(scale2.getColor("a").value, colorA.value);
        });

        it("should get colors for measures from default scale", () => {
            let scale = sharedPalette.getNewColorScale();

            helpers.assertColorsMatch(scale.getColor(0).value, colors[0].value);
            helpers.assertColorsMatch(scale.getColor(1).value, colors[1].value);
        });

        it("measure colors should come after series colors", () => {
            let seriesScale = sharedPalette.getColorScaleByKey("series");
            let seriesColor1 = seriesScale.getColor("key1");
            let seriesColor2 = seriesScale.getColor("key2");

            sharedPalette.rotateScale();

            let measureScale = sharedPalette.getNewColorScale();
            let measureColor1 = measureScale.getColor(0);
            let measureColor2 = measureScale.getColor(1);

            helpers.assertColorsMatch(seriesColor1.value, colors[0].value);
            helpers.assertColorsMatch(seriesColor2.value, colors[1].value);
            helpers.assertColorsMatch(measureColor1.value, colors[2].value);
            helpers.assertColorsMatch(measureColor2.value, colors[3].value);
        });

        it("measure colors should come after measure colors", () => {
            let measureScale1 = sharedPalette.getNewColorScale();
            let measureColor1 = measureScale1.getColor(0);
            let measureColor2 = measureScale1.getColor(1);

            sharedPalette.rotateScale();

            let measureScale2 = sharedPalette.getNewColorScale();
            let measureColor3 = measureScale2.getColor(1);
            let measureColor4 = measureScale2.getColor(2);

            helpers.assertColorsMatch(measureColor1.value, colors[0].value);
            helpers.assertColorsMatch(measureColor2.value, colors[1].value);
            helpers.assertColorsMatch(measureColor3.value, colors[2].value);
            helpers.assertColorsMatch(measureColor4.value, colors[3].value);
        });

        it("getSentimentColors should call parent", () => {
            let spy = spyOn(dataColors, "getSentimentColors").and.callThrough();

            sharedPalette.getSentimentColors();

            expect(spy).toHaveBeenCalled();
        });

        it("getBasePickerColors should call parent", () => {
            let spy = spyOn(dataColors, "getBasePickerColors").and.callThrough();

            sharedPalette.getBasePickerColors();

            expect(spy).toHaveBeenCalled();
        });
    });

    function getDataViewForLegend(baseMetadata: powerbi.DataViewMetadata, labelColor: string, labelFontSize: number): powerbi.VisualDataChangedOptions {

        let identities = [mocks.dataViewScopeIdentity('identity'),
        ];

        let dataViewMetadata = powerbi.Prototype.inherit(baseMetadata);
        dataViewMetadata.objects = {
            legend:
            {
                titleText: 'my title text',
                show: true,
                showTitle: true,
                labelColor: { solid: { color: labelColor } },
                fontSize: labelFontSize,
            }
        };

        return {
            dataViews: [{
                metadata: dataViewMetadata,
                categorical: {
                    categories: [
                        {
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: identities,

                        }],

                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[1],
                            values: [0.5, 2, 1, 1.5, 9],
                            identity: identities[0],
                        },
                    ]),
                },
            }]
        };
    }

    class VisualBuilder {
        public element: JQuery;
        
        private _warningSpy: jasmine.Spy;

        public get warningSpy(): jasmine.Spy {
            return this._warningSpy;
        }

        private _visual: powerbi.IVisual;

        public get visual(): powerbi.IVisual {
            return this._visual;
        }

        public set visual(value: powerbi.IVisual) {
            this._visual = value;
        }

        private _hostService: powerbi.IVisualHostServices;

        public get hostService(): powerbi.IVisualHostServices {
            return this._hostService;
        }

        private _style: powerbi.IVisualStyle;

        public get style(): powerbi.IVisualStyle {
            return this._style;
        }

        private _height: string;

        public get height(): string {
            return this._height;
        }
        
        private _width: string;

        public get width(): string {
            return this._width;
        }

        public setSize(width: string, height: string) {
            this._width = width;
            this._height = height;

            this.init();
        }

        constructor(pluginName: string, width: string = "400", height: string = "400") {
            this._visual = powerbi.visuals.visualPluginFactory.create().getPlugin(pluginName).create();

            this.setSize(width, height);
        }

        private init() {
            this.element = helpers.testDom(this.height, this.width);
            this._hostService = mocks.createVisualHostServices();
            this._style = powerbi.visuals.visualStyles.create();
            this._warningSpy = jasmine.createSpy("warning");
            this._hostService.setWarnings = this.warningSpy;

            this.initVisual();
        }

        public buildVisualMinerva(pluginName: string) {
            this._visual =
                powerbi.visuals.visualPluginFactory.createMinerva({}).getPlugin(pluginName).create();

            this.init();
        }

        public initVisual() {
            this.visual.init({
                element: this.element,
                host: this.hostService,
                style: this.style,
                viewport: {
                    height: this.element.height(),
                    width: this.element.width()
                }
            });
        }

        public onDataChanged(options: powerbi.VisualDataChangedOptions) {
            this.visual.onDataChanged(options);
        }
    }

    class DataViewBuilder {
        public general: any = null;

        private _categoriesValues: any[] = [];

        public get categoriesValues(): any[] {
            return this._categoriesValues;
        }

        public set categoriesValues(value: any[]) {
            this._categoriesValues = value;
        }

        public columns: any[];

        public values: any[] = [];

        public categoricalValues: any[] = [];

        private buildCategoricalValues() {
            this.categoricalValues = [];

            for (let i = 0; i < this.values.length; i++) {
                let categoricalValue: any = {
                    source: this.getSource(i + 1),
                    subtotal: this.getSubtotal(this.values[i]),
                    values: this.values[i],
                    identity: this.valuesIdentities[i]
                };

                this.categoricalValues.push(categoricalValue);
            }
        }

        private getSource(index) {
            if (!this.categoriesColumns) {
                return undefined;
            }

            if (this.categoriesColumns[index]) {
                return this.categoriesColumns[index];
            }

            return this.categoriesColumns[this.categoriesColumns.length - 1];
        }

        private getSubtotal(values: any[]) {
            return values.reduce((x, y) => x + y);
        }

        public objects: any = null;

        public metadata;

        public properties;

        private buildMetadata() {
            this.metadata = {
                columns: this.columns,
                properties: this.properties,
                objects: this.objects
            };
        }

        public categories: any[];

        public categoriesColumns: any[] = undefined;

        private buildCategories() {
            this.categories = [{
                source: this.getSource(0),
                values: this.categoriesValues,
                identity: this.categoryIdentities
            }];
        }

        private buildCategoriesColumns() {
            if (!this.categoriesColumns) {
                this.categoriesColumns = this.columns;
            }
        }

        public update() {
            this.buildCategoriesColumns();

            this.buildCategoryIdentities();
            this.buildValuesIdentities();

            this.buildCategoricalValues();
            this.buildMetadata();
            this.buildCategories();
        }

        public isBuildCategoryIdentities: boolean = false;

        private categoryIdentities: any[] = null;

        private buildCategoryIdentities() {
            if (this.isBuildCategoryIdentities) {
                this.categoryIdentities =
                    this.categoriesValues.map((value) => mocks.dataViewScopeIdentity(value));
            }
        }

        public identities: any[] = [];

        private valuesIdentities: any[] = null;

        private buildValuesIdentities() {
            this.valuesIdentities = this.identities.map(
                (value) => mocks.dataViewScopeIdentity(value));
        }

        public columnIdentityRef: any = undefined;

        public sourceValueColumn: any = undefined;

        private buildValueColumns() {
            if (this.columnIdentityRef !== undefined &&
                this.sourceValueColumn !== undefined) {
                return DataViewTransform.createValueColumns(
                    this.categoricalValues,
                    [this.columnIdentityRef],
                    this.sourceValueColumn);
            }

            return DataViewTransform.createValueColumns(this.categoricalValues);
        }

        public build(): powerbi.DataView {
            return {
                metadata: this.metadata,
                categorical: {
                    categories: this.categories,
                    values: this.buildValueColumns()
                }
            };
        }
    }

    module dataViewFactory {
        export let general: powerbi.visuals.ComboChartDataViewObject = {
            visualType1: "Column",
            visualType2: "Line"
        };

        let columns = [
            {displayName: "col1", queryName: "col1", index: 0, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)},
            {displayName: "col2", queryName: "col2", isMeasure: true, index: 1, groupName: "a", type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)},
            {displayName: "col3", queryName: "col3", isMeasure: true, index: 2, groupName: "b", type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)},
            {displayName: "col4", queryName: "col4", isMeasure: true, index: 3, groupName: "c", type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)}
        ];

        let columnsNumber = [
            {displayName: "col1", queryName: "col1", type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)},
            {displayName: "col2", queryName: "col2", isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)},
            {displayName: "col3", queryName: "col3", isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)},
            {displayName: "col4", queryName: "col4", isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)}
        ];
       
        let categoriesValues = ["John Domo", "Delta Force", "Jean Tablau"];

        function setGeneral(dataViewBuilder: DataViewBuilder, isGeneral: boolean = false) {
            if (isGeneral) {
                dataViewBuilder.general = general;
            }
        }

        function build(dataViewBuilder: DataViewBuilder): powerbi.DataView {
            dataViewBuilder.update();
            return dataViewBuilder.build();
        }

        export function buildDataViewDefault(isGeneral = false): powerbi.DataView {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            setGeneral(dataViewBuilder, isGeneral);

            dataViewBuilder.columns = columns;

            dataViewBuilder.values = [
                [100, 200, 700],
                [1000, 2000, 7000],
                [10000, 20000, 70000]
            ];

            dataViewBuilder.categoriesValues = categoriesValues;

            dataViewBuilder.isBuildCategoryIdentities = true;
            dataViewBuilder.identities = ["a", "b", "c"];

            return build(dataViewBuilder);
        }
        
        export function buildDataViewCustom(objects, values: any[], identities: any[] = undefined): powerbi.DataView {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            dataViewBuilder.objects = objects;

            dataViewBuilder.columns = columns;

            if (identities !== undefined) {
                dataViewBuilder.isBuildCategoryIdentities = true;
                dataViewBuilder.identities = identities;
            }

            dataViewBuilder.values = values;

            dataViewBuilder.categoriesValues = categoriesValues;

            return build(dataViewBuilder);
        }

        export function buildDataViewCustomSingleColumn(objects, values: any[]): powerbi.DataView {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            dataViewBuilder.objects = objects;
            dataViewBuilder.columns = columns;
            dataViewBuilder.categoriesColumns = [columns[1]];

            dataViewBuilder.values = values;

            dataViewBuilder.categoriesValues = categoriesValues;

            return build(dataViewBuilder);
        }

        export function buildDataViewCustomWithIdentities(values: any[]): powerbi.DataView {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            dataViewBuilder.columns = columns;
            dataViewBuilder.categoriesColumns = [columns[0], columns[1], columns[3]];

            dataViewBuilder.values = values;

            dataViewBuilder.categoriesValues = categoriesValues;

            dataViewBuilder.isBuildCategoryIdentities = true;
            dataViewBuilder.identities = ["a", "b"];

            return build(dataViewBuilder);
        }

        export function buildDataViewInAnotherDomainOneValue(objects: any = undefined): powerbi.DataView {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            dataViewBuilder.objects = objects;

            dataViewBuilder.columns = columns;

            dataViewBuilder.values = [
                [1]
            ];

            dataViewBuilder.categoriesValues = categoriesValues;

            return build(dataViewBuilder);
        }

        export function buildDataViewEmpty(): powerbi.DataView {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            dataViewBuilder.columns = columns;
            dataViewBuilder.values = [];
            dataViewBuilder.categoriesValues = [];

            return build(dataViewBuilder);
        }

        export function buildDataViewInAnotherDomain(isGeneral = false, objects: any = undefined): powerbi.DataView {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            dataViewBuilder.objects = objects;

            setGeneral(dataViewBuilder, isGeneral);

            dataViewBuilder.columns = columns;
            dataViewBuilder.values = [[1], [10], [20]];
            dataViewBuilder.categoriesValues = categoriesValues;

            return build(dataViewBuilder);
        }

        export function buildDataViewSuperLongLabels(isGeneral = false): powerbi.DataView {
            // must share the same values as the general dataView, only category labels should change.
            let dataView: powerbi.DataView = buildDataViewDefault(isGeneral);

            dataView.categorical.categories[0].values = [
                "This is a pretty long label I think",
                "This is a pretty long label I thought",
                "This is a pretty long label I should think"
            ];

            return dataView;
        }

        export function buildDataViewManyCategories(isGeneral = false): powerbi.DataView {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            setGeneral(dataViewBuilder, isGeneral);

            dataViewBuilder.columns = columns;
            dataViewBuilder.categoriesValues = ["John Domo", "Delta Force", "Jean Tablau", "Cat1", "Cat2", "Cat3"];
            dataViewBuilder.values = [
                [100, 200, 700, 1100, 800, 300],
                [1000, 2000, 7000, 11000, 8000, 2000],
                [10000, 200, 700, 300, 200, 500],
                [10000, 20000, 70000, 15000, 25000, 33000],
                [10000, 200, 700, 900, 500, 200],
                [10000, 20000, 70000, 15000, 29000, 39000]
            ];

            return build(dataViewBuilder);
        }
        
        export function buildDataViewNegative(isGeneral = false) {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            setGeneral(dataViewBuilder, isGeneral);

            dataViewBuilder.columns = columns;
            dataViewBuilder.categoriesValues = categoriesValues;
            dataViewBuilder.values = [
                [-100, -200, 700],
                [1000, -2000, 7000],
                [10000, 20000, -70000]
            ];

            return build(dataViewBuilder);
        }

        function setLabels(dataViewBuilder: DataViewBuilder, color:any, labelDisplayUnits?: number, labelPrecision?: number, labelFontSize?: number) {
            let ojects: any = {};

            ojects.labels = {
                show: true
            };

            if (color !== undefined) {
                ojects.labels.color = color;
            }

            if (labelDisplayUnits !== undefined) {
                ojects.labels.labelDisplayUnits = labelDisplayUnits;
            }

            if (labelPrecision !== undefined) {
                ojects.labels.labelPrecision = labelPrecision;
            }

            if (labelFontSize !== undefined) {
                ojects.labels.fontSize = labelFontSize;
            }

            dataViewBuilder.objects = ojects;
        }

        export function buildDataForLabelsFirstType(color?:any, labelDisplayUnits?: number, labelPrecision?: number, fontSize?: number) {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            setLabels(dataViewBuilder, color, labelDisplayUnits, labelPrecision, fontSize);

            dataViewBuilder.columns = columns;
            dataViewBuilder.categoriesValues = ["a", "b", "c", "d", "e"];
            dataViewBuilder.values = [[50, 40, 150, 200, 500]];
            
            return build(dataViewBuilder);
        }

        export function buildDataForLabelsSecondType(color?:any, labelDisplayUnits?: number, labelPrecision?: number, fontSize?: number) {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            setLabels(dataViewBuilder, color, labelDisplayUnits, labelPrecision, fontSize);

            dataViewBuilder.columns = columns;
            dataViewBuilder.categoriesValues = ["a", "b", "c", "d", "e"];
            dataViewBuilder.values = [[200, 100, 300, 250, 400]];

            return build(dataViewBuilder);
        }

        export function buildDataViewInvalid(invalidValue) {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();
           
            dataViewBuilder.columns = columns;
            dataViewBuilder.categoriesValues = [["John Domo"]];
            dataViewBuilder.values = [[invalidValue]];

            return build(dataViewBuilder);
        }

        export function buildDataViewNumber(objects: any = null) {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            dataViewBuilder.objects = objects;

            dataViewBuilder.columns = columnsNumber;
            dataViewBuilder.categoriesValues = [0, 500, 1000];
            dataViewBuilder.values = [
                [100, 200, 700],
                [1000, 2000, 7000],
                [10000, 20000, 70000]];

            dataViewBuilder.update();

            return dataViewBuilder.build();
        }

        export function buildDataViewDynamicSeries() {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            dataViewBuilder.columnIdentityRef = powerbi.data.SQExprBuilder.fieldDef({
                schema: "s",
                entity: "e",
                column: "series"
    });

            dataViewBuilder.columns = columns;
            dataViewBuilder.categoriesColumns = [columns[0], columns[2], columns[3]];

            dataViewBuilder.categoriesValues = categoriesValues;

            dataViewBuilder.isBuildCategoryIdentities = true;
            dataViewBuilder.identities = ["a", "b"];

            dataViewBuilder.values = [
                [1000, 2000, 7000],
                [10000, 20000, 70000]
            ];

            return build(dataViewBuilder);
        }

        export function buildDataViewSingleMeasure() {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            let measureColumn: powerbi.DataViewMetadataColumn = {
                displayName: 'sales',
                queryName: 'selectSales',
                isMeasure: true,
                type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer),
                objects: { general: { formatString: '$0' } }
            };

            dataViewBuilder.update();

            dataViewBuilder.categories = undefined;
            dataViewBuilder.categoricalValues = DataViewTransform.createValueColumns([
                {
                    source: measureColumn,
                    values: [100]
                }
            ]);

            return dataViewBuilder.build();
        }
    }
}