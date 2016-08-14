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
    import DataView = powerbi.DataView;
    import VisualClass = powerbi.visuals.samples.StreamGraph;
    import StreamData = powerbi.visuals.samples.StreamData;
    import colorAssert = powerbitests.helpers.assertColorsMatch;
    import createInteractivityService = powerbi.visuals.createInteractivityService;
    import IInteractivityService = powerbi.visuals.IInteractivityService;
    import ProductSalesByDateData = powerbitests.customVisuals.sampleDataViews.ProductSalesByDateData;
    import ValueByNameData = powerbitests.customVisuals.sampleDataViews.ValueByNameData;
    import StreamGraphSeries = powerbi.visuals.samples.StreamGraphSeries;
    import IDataColorPalette = powerbi.IDataColorPalette;
    import DataColorPalette = powerbi.visuals.DataColorPalette;
    import StreamDataPoint = powerbi.visuals.samples.StreamDataPoint;
    import SelectionId = powerbi.visuals.SelectionId;

    powerbitests.mocks.setLocale();

    describe("StreamGraph", () => {
        let visualBuilder: StreamGraphBuilder,
            defaultDataViewBuilder: ProductSalesByDateData,
            dataView: powerbi.DataView;

        beforeEach(() => {
            visualBuilder = new StreamGraphBuilder(1000, 500);
            defaultDataViewBuilder = new ProductSalesByDateData();
            dataView = defaultDataViewBuilder.getDataView();
        });

        describe("capabilities", () => {
            let streamGraphCapabilities = VisualClass.capabilities;

            it("registered capabilities", () => expect(streamGraphCapabilities).toBeDefined());

            it("Capabilities should include dataRoles", () => expect(streamGraphCapabilities.dataRoles).toBeDefined());

            it("Capabilities should include dataViewMappings", () => expect(streamGraphCapabilities.dataViewMappings).toBeDefined());

            it("Capabilities should include objects", () => expect(streamGraphCapabilities.objects).toBeDefined());
        });

        describe("DOM tests", () => {
            it("path is not throwing exceptions (NaN values)", () => {
                dataView.categorical.values[0].values = [NaN];
                dataView.categorical.values[1].values = [NaN];
                dataView.categorical.values[2].values = [NaN];
                dataView.categorical.values[3].values = [NaN];

                visualBuilder.updateflushAllD3Transitions(dataView);

                let containsNaN: boolean = false;
                $(".streamGraph .dataPointsContainer").children("path").each(function (index, value) {
                    let nanLocation: number = ($(value).attr("d")).indexOf("NaN");
                    containsNaN = nanLocation !== -1;
                    expect(containsNaN).toBeFalsy();
                });
            });

            it("should display text in x-axis and not values", () => {
                dataView.categorical.categories[0].values = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                visualBuilder.updateflushAllD3Transitions(dataView);

                let isNumber: boolean = false;
                let regExp = /\d/;
                $(".streamGraph .axisGraphicsContext .x.axis g").children("text").each(function (index, value) {
                    isNumber = regExp.test($(value).text());
                    expect(isNumber).toBeFalsy();
                });
            });

            it("should ellipsis text if its too long", () => {
                dataView = new powerbitests.customVisuals.sampleDataViews.CarLogosData().getDataView();

                let dataPointsArray: number[] = [];
                for (let i = 0; i < dataView.categorical.values.length; i++) {
                    dataPointsArray = dataPointsArray.concat(<number[]>dataView.categorical.values[i].values);
                }

                dataView.categorical.values[0].values[0] = 1e+14;

                visualBuilder.updateflushAllD3Transitions(dataView);

                let tick = $(".streamGraph .axisGraphicsContext .y.axis g").children("text").last().text();/*.each(function (index, value) { ticks.push($(value).text()); });*/
                expect(tick.indexOf("…")).toBeGreaterThan(-1);
            });

            it("x axis on", () => {
                dataView.metadata.objects = {
                    categoryAxis: {
                        show: true
                    }
                };
                let xAxis = $(".streamGraph .axisGraphicsContext .x.axis");

                visualBuilder.updateflushAllD3Transitions(dataView);

                expect(xAxis).toBeInDOM();
                expect(xAxis.children("g.tick")).toBeInDOM();
                expect(xAxis.children("g").length).toBeGreaterThan(0);
            });

            it("x axis off", () => {
                dataView.metadata.objects = {
                    categoryAxis: {
                        show: false
                    }
                };
                let xAxis = $(".streamGraph .axisGraphicsContext .x.axis").children("g");

                visualBuilder.updateflushAllD3Transitions(dataView);

                expect(xAxis.length).toBe(0);
            });

            it("y axis on", () => {
                dataView.metadata.objects = {
                    valueAxis: {
                        show: true
                    }
                };
                let yAxis = $(".streamGraph .axisGraphicsContext .y.axis");

                visualBuilder.updateflushAllD3Transitions(dataView);

                expect(yAxis).toBeInDOM();
                expect(yAxis.children("g.tick")).toBeInDOM();
                expect(yAxis.children("g").length).toBeGreaterThan(0);
            });

            it("y axis off", () => {
                dataView.metadata.objects = {
                    valueAxis: {
                        show: false
                    }
                };
                let yAxis = $(".streamGraph .axisGraphicsContext .y.axis").children("g");

                visualBuilder.updateflushAllD3Transitions(dataView);

                expect(yAxis.length).toBe(0);
            });

            it("x axis title on", () => {
                dataView.metadata.objects = {
                    categoryAxis: {
                        show: true,
                        showAxisTitle: true
                    }
                };
                let xAxis = $(".streamGraph .axisGraphicsContext");

                visualBuilder.updateflushAllD3Transitions(dataView);

                expect(xAxis.children("text")).toBeInDOM();
            });

            it("x axis title off", () => {
                dataView.metadata.objects = {
                    categoryAxis: {
                        show: true,
                        showAxisTitle: false
                    }
                };
                let xAxis = $(".streamGraph .axisGraphicsContext");

                visualBuilder.updateflushAllD3Transitions(dataView);

                expect(xAxis.children("text").length).toBe(0);
            });

            it("y axis title on", () => {
                dataView.metadata.objects = {
                    valueAxis: {
                        show: true,
                        showAxisTitle: true
                    }
                };
                let yAxis = $(".streamGraph .axisGraphicsContext");

                visualBuilder.updateflushAllD3Transitions(dataView);

                expect(yAxis.children("text")).toBeInDOM();
            });

            it("y axis title off", () => {
                dataView.metadata.objects = {
                    valueAxis: {
                        show: true,
                        showAxisTitle: false
                    }
                };
                let yAxis = $(".streamGraph .axisGraphicsContext");

                visualBuilder.updateflushAllD3Transitions(dataView);

                expect(yAxis.children("text").length).toBe(0);
            });

            it("x axis change color", () => {
                let blackColor = "#111111";
                let greyColor = "#999999";
                dataView.metadata.objects = {
                    categoryAxis: {
                        show: true,
                        labelColor: { solid: { color: blackColor } }
                    }
                };

                visualBuilder.updateflushAllD3Transitions(dataView);

                let xAxis = $(".streamGraph .axisGraphicsContext .x.axis .tick");
                colorAssert(xAxis.children("text").css("fill"), blackColor);

                dataView.metadata.objects = {
                    categoryAxis: {
                        show: true,
                        labelColor: { solid: { color: greyColor } }
                    }
                };

                visualBuilder.updateflushAllD3Transitions(dataView);

                colorAssert(xAxis.children("text").css("fill"), greyColor);
            });

            it("y axis change color", () => {
                let blackColor = "#111111";
                let greyColor = "#999999";
                dataView.metadata.objects = {
                    valueAxis: {
                        show: true,
                        labelColor: { solid: { color: blackColor } }
                    }
                };

                visualBuilder.updateflushAllD3Transitions(dataView);

                let yAxis = $(".streamGraph .axisGraphicsContext .y.axis .tick");
                colorAssert(yAxis.children("text").css("fill"), blackColor);

                dataView.metadata.objects = {
                    valueAxis: {
                        show: true,
                        labelColor: { solid: { color: greyColor } }
                    }
                };

                visualBuilder.updateflushAllD3Transitions(dataView);

                colorAssert(yAxis.children("text").css("fill"), greyColor);
            });

            it("data labels on", () => {
                dataView.metadata.objects = {
                    labels: {
                        show: true
                    }
                };

                visualBuilder.updateflushAllD3Transitions(dataView);

                let labels = $(".streamGraph .labels");
                expect(labels).toBeInDOM();
                expect(labels.children("text").length).toBeGreaterThan(0);
            });

            it("data labels off", () => {
                dataView.metadata.objects = {
                    labels: {
                        show: false
                    }
                };

                visualBuilder.updateflushAllD3Transitions(dataView);

                let labels = $(".streamGraph .labels");
                expect(labels.length).toBe(0);
            });

            it("data labels change color", () => {
                let blackColor = "#111111";
                let greyColor = "#999999";
                dataView.metadata.objects = {
                    labels: {
                        show: true,
                        color: { solid: { color: blackColor } }
                    }
                };

                visualBuilder.updateflushAllD3Transitions(dataView);

                let labels = $(".streamGraph .labels");
                colorAssert(labels.first().find("text").css("fill"), blackColor);

                dataView.metadata.objects = {
                    labels: {
                        show: true,
                        color: { solid: { color: greyColor } }
                    }
                };

                visualBuilder.updateflushAllD3Transitions(dataView);

                colorAssert(labels.first().find("text").css("fill"), greyColor);
            });

            it("data labels change font size", () => {
                dataView.metadata.objects = {
                    labels: {
                        show: true,
                        fontSize: 15,
                    }
                };

                visualBuilder.updateflushAllD3Transitions(dataView);

                let labels = $(".streamGraph .labels");
                expect(labels.first().find("text").css("font-size")).toBe("20px");
            });

            it("data labels position validation", () => {
                let dataViewBuilder = new ValueByNameData();
                dataViewBuilder.valuesValue = d3.range(dataViewBuilder.valuesCategory.length);
                dataView = dataViewBuilder.getDataView();
                let dataLength = dataView.categorical.categories[0].values.length;
                dataView.metadata.objects = {
                    labels: {
                        show: true
                    }
                };

                visualBuilder.viewport.width = 300;
                visualBuilder.updateflushAllD3Transitions(dataView);

                let labels = $(".streamGraph .labels").children("text");

                expect(labels.length).toBe(dataLength - 1);
            });

            it("svg element created", () => expect(visualBuilder.mainElement[0]).toBeInDOM());

            it("update", () => {
                visualBuilder.updateflushAllD3Transitions(dataView);
                expect($(".streamGraph .layer").length).toBe(dataView.categorical.values.length);
            });

            it("legend should be in DOM", () => {
                dataView.metadata.objects = {
                    legend: {
                        show: true
                    }
                };
                visualBuilder.updateflushAllD3Transitions(dataView);

                let legend = $(".legend");
                expect(legend).toBeInDOM();
            });

            it("Should add right amount of legend items", () => {
                dataView = new powerbitests.customVisuals.sampleDataViews.SalesByDayOfWeekData().getDataView();

                dataView.metadata.objects = {
                    legend: {
                        show: true
                    },
                };

                visualBuilder.updateflushAllD3Transitions(dataView);

                let legendGroup = $(".legend #legendGroup"),
                    legendItemsCount = legendGroup.children.length;

                expect(legendItemsCount).toBe(dataView.categorical.values.length);
            });
        });

        describe("converter", () => {
            let colors: IDataColorPalette;

            beforeEach(() => {
                colors = new DataColorPalette();
            });

            it("arguments are null", () => {
                callConverterAndExpectExceptions(null, null, null);
            });

            it("arguments are undefined", () => {
                callConverterAndExpectExceptions(undefined, undefined, undefined);
            });

            it("dataView is correct", () => {
                callConverterAndExpectExceptions(dataView, colors);
            });

            describe("streamData", () => {
                let streamData: StreamData;

                beforeEach(() => {
                    streamData = callConverterAndExpectExceptions(dataView, colors);
                });

                it("streamData is defined", () => {
                    expect(streamData).toBeDefined();
                    expect(streamData).not.toBeNull();
                });

                it("series are defined", () => {
                    expect(streamData.series).toBeDefined();
                    expect(streamData.series).not.toBeNull();
                });

                it("every series is defined", () => {
                    streamData.series.forEach((series: StreamGraphSeries) => {
                        expect(series).toBeDefined();
                        expect(series).not.toBeNull();
                    });
                });

                it("every identity is defined", () => {
                    streamData.series.forEach((series: StreamGraphSeries) => {
                        let identity: SelectionId = series.identity;

                        expect(identity).toBeDefined();
                        expect(identity).not.toBeNull();
                    });
                });

                it("dataPoints are defined", () => {
                    streamData.series.forEach((series: StreamGraphSeries) => {
                        expect(series.dataPoints).toBeDefined();
                        expect(series.dataPoints).not.toBeNull();
                        expect(series.dataPoints.length).toBeGreaterThan(0);
                    });
                });

                it("every dataPoint is defined", () => {
                    streamData.series.forEach((series: StreamGraphSeries) => {
                        series.dataPoints.forEach((dataPoint: StreamDataPoint) => {
                            expect(dataPoint).toBeDefined();
                            expect(dataPoint).not.toBeNull();
                        });
                    });
                });

                describe("interactivityService", () => {
                    let interactivityService: IInteractivityService;

                    beforeEach(() => {
                        interactivityService = createInteractivityService(visualBuilder.host);
                    });

                    it("Selection state set on converter result including clear", () => {
                        let series: StreamGraphSeries[],
                            queryName: string = dataView.metadata.columns[1].queryName,
                            seriesSelectionId: SelectionId = SelectionId.createWithMeasure(queryName);

                        interactivityService["selectedIds"] = [seriesSelectionId];

                        series = visualBuilder.converter(dataView, colors, interactivityService).series;

                        // We should see the selection state applied to resulting data
                        expect(series[0].selected).toBe(true);
                        expect(series[1].selected).toBe(false);
                        expect(series[2].selected).toBe(false);
                        expect(series[3].selected).toBe(false);

                        interactivityService.clearSelection();

                        series = visualBuilder.converter(dataView, colors, interactivityService).series;

                        // Verify the selection has been cleared
                        expect(series[0].selected).toBe(false);
                        expect(series[1].selected).toBe(false);
                        expect(series[2].selected).toBe(false);
                        expect(series[3].selected).toBe(false);
                    });
                });
            });

            function callConverterAndExpectExceptions(
                dataView: DataView,
                colors: powerbi.IDataColorPalette,
                interactivityService?: IInteractivityService): StreamData {

                let streamData: StreamData;

                expect(() => {
                    streamData = visualBuilder.converter(dataView, colors, interactivityService);
                }).not.toThrow();

                return streamData;
            }
        });
    });

    class StreamGraphBuilder extends VisualBuilderBase<VisualClass> {
        constructor(width: number, height: number, isMinervaVisualPlugin: boolean = false) {
            super(width, height, isMinervaVisualPlugin);
        }

        protected build() {
            return new VisualClass();
        }

        public get mainElement() {
            return this.element.children("svg.streamGraph");
        }

        public get legendElement() {
            return this.element.children("svg.legend");
        }

        public converter(
            dataView: DataView,
            colors: powerbi.IDataColorPalette,
            interactivityService?: IInteractivityService): StreamData {

            return this.visual.converter(dataView, colors, interactivityService);
        }
    }
}
