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
    import VisualClass = powerbi.visuals.samples.MekkoChart;
    import VisualBuilderBase = powerbitests.customVisuals.VisualBuilderBase;
    import MekkoChartData = sampleDataViews.MekkoChartData;
    import MekkoColumnChart = powerbi.visuals.samples.MekkoColumnChart;
    import MekkoColumnChartData = powerbi.visuals.samples.MekkoColumnChartData;
    import DataColorPalette = powerbi.visuals.DataColorPalette;
    import MekkoVisualChartType = powerbi.visuals.samples.MekkoVisualChartType;
    import MekkoChartSeries = powerbi.visuals.samples.MekkoChartSeries;
    import colorAssert = powerbitests.helpers.assertColorsMatch;

    powerbitests.mocks.setLocale();

    describe("MekkoChart", () => {
        let visualBuilder: MekkoChartBuilder;
        let defaultDataViewBuilder: MekkoChartData;
        let dataView: powerbi.DataView;

        beforeEach(() => {
            visualBuilder = new MekkoChartBuilder(1000,500);
            defaultDataViewBuilder = new MekkoChartData();
            dataView = defaultDataViewBuilder.getDataView();
        });

        describe("capabilities", () => {
            it("registered capabilities", () => expect(VisualClass.capabilities).toBeDefined());
        });

        describe("DOM tests", () => {
            it("main element created", () => expect(visualBuilder.mainElement[0]).toBeInDOM());

            it("update", (done) => {
                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.categoriesAxis).toBeInDOM();
                    expect(visualBuilder.categoriesAxis.children("g.tick").length)
                        .toBe(dataView.categorical.categories[0].values.length);

                    expect(visualBuilder.columnElement).toBeInDOM();
                    let series: JQuery = visualBuilder.columnElement.children("g.series");
                    let grouped: powerbi.DataViewValueColumnGroup[] = dataView.categorical.values.grouped();

                    expect(series.length)
                        .toBe(grouped.length);

                    for (let i = 0, length = series.length; i < length; i++) {
                        expect($(series[i]).children("rect.column").length)
                            .toBe((i === 0
                                ? grouped[i].values[0].values
                                : grouped[i].values[0].values.filter(_.isNumber)).length);
                    }

                    done();
                });
            });

            it("validate that labels are not cut off", done => {
                dataView.metadata.objects = { 
                    categoryAxis: { fontSize: 40 },
                    valueAxis: { fontSize: 40 }
                };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    let xTicksElements = <Element[]>visualBuilder.categoriesAxisTicks.children("text").toArray();
                    let columnsBottomPosition = visualBuilder.columnElement[0].getBoundingClientRect().bottom;
                    let xTicksElementsTopPosition = xTicksElements.map(
                        x => x.getBoundingClientRect().bottom - parseFloat(window.getComputedStyle(x).fontSize));
                    expect(xTicksElementsTopPosition.every(x => x > columnsBottomPosition)).toBeTruthy();

                    done();
                });
            });

            it("visual is hidden when chart height is less than minimum height", done => {
                visualBuilder.viewport = { height: 49, width: 350 };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.element.children('.legend')).toHaveCss({ display: "none"});
                    expect(visualBuilder.mainElement[0]).toHaveCss({ display: "none"});
                    done();
                });
            });

            it("visual is hidden when chart width is less than minimum width", done => {
                visualBuilder.viewport = { height: 350, width: 49 };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect($(visualBuilder.mainElement[0])).toHaveCss({ display: "none" });
                    expect(visualBuilder.element.children('.legend')).toHaveCss({ display: "none" });
                    done();
                });
            });
        });

        describe("MekkoColumnChartData", () => {
            describe("converter", () => {
                let mekkoColumnChartData: MekkoColumnChartData;
                let dataColorPalette: DataColorPalette;

                beforeEach(() => {
                    dataColorPalette = new DataColorPalette();
                    mekkoColumnChartData = MekkoColumnChart.converter(
                        dataView.categorical,
                        dataColorPalette,
                        true,
                        false,
                        false,
                        dataView.metadata,
                        MekkoVisualChartType.hundredPercentStackedBar);
                });

                it("mekkoColumnChartData is defined", () => {
                    expect(mekkoColumnChartData).toBeDefined();
                    expect(mekkoColumnChartData).not.toBeNull();
                });

                describe("series", () => {
                    let series: MekkoChartSeries[];

                    beforeEach(() => {
                        series = mekkoColumnChartData.series;
                    });

                    it("series are defined", () => {
                        expect(series).toBeDefined();
                        expect(series).not.toBeNull();
                    });

                    it("each element of series is defined", () => {
                        series.map((columnChartSeries: MekkoChartSeries) => {
                            expect(columnChartSeries).toBeDefined();
                            expect(columnChartSeries).not.toBeNull();
                        });
                    });

                    describe("identity", () => {
                        it("identity is defined", () => {
                            series.map((columnChartSeries: MekkoChartSeries) => {
                                expect(columnChartSeries.identity).toBeDefined();
                                expect(columnChartSeries.identity).not.toBeNull();
                            });
                        });

                        it("identity has key", () => {
                            series.map((columnChartSeries: MekkoChartSeries) => {
                                expect(columnChartSeries.identity.getKey()).toBeDefined();
                            });
                        });
                    });
                });

                describe("MekkoColumnChartData", () => {
                    describe("converter", () => {
                        it("mekko columnBorder on", done => {
                            dataView.metadata.objects = {
                                columnBorder: {
                                    show: true
                                }
                            };
                            visualBuilder.updateRenderTimeout(dataView, () => {
                                expect(visualBuilder.mainElement.find('.mekkoborder').first().attr('width')).toBeGreaterThan(0);
                                done();
                            });
                        });

                        it("nodes border change color", done => {
                            dataView.metadata.objects = {
                                columnBorder: {
                                    color: { solid: { color: "#123123" } }
                                }
                            };

                            visualBuilder.updateRenderTimeout(dataView, () => {
                                colorAssert(visualBuilder.mainElement.find('rect.mekkoborder').first().css('fill'), "#123123");
                                done();
                            });

                        });

                        it("category axes label font-size", done => {
                            dataView.metadata.objects = {
                                categoryAxis: {
                                    fontSize: 17
                                },
                                valueAxis: {
                                    fontSize: 15
                                },
                            };

                            visualBuilder.updateRenderTimeout(dataView, () => {
                                expect(visualBuilder.mainElement.find('.x.axis g.tick text').first().attr('font-size')).toBe("17px");
                                expect(visualBuilder.mainElement.find('.y.axis g.tick text').first().attr('font-size')).toBe("15px");

                                done();
                            });

                        });

                        it("Display units - millions", done => {
                            dataView.metadata.objects = {
                                labels: {
                                    show: true,
                                    labelDisplayUnits: 1000000,
                                },
                            };

                            visualBuilder.updateRenderTimeout(dataView, () => {
                                expect(visualBuilder.mainElement.find('.labelGraphicsContext text').first().text()).toMatch(/[0-9.]*M/);
                                done();
                            });

                        });

                        it("Display units - thousands", done => {
                            dataView.metadata.objects = {
                                labels: {
                                    show: true,
                                    labelDisplayUnits: 1000,
                                },
                            };
                            visualBuilder.updateRenderTimeout(dataView, () => {
                                expect(visualBuilder.mainElement.find('.labelGraphicsContext text').first().text()).toMatch(/[0-9.]*K/);
                                done();
                            });

                        });

                        it("Limit Decimal Places value", done => {
                            dataView.metadata.objects = {
                                labels: {
                                    show: true,
                                    labelDisplayUnits: 0,
                                    labelPrecision: 99,
                                },
                            };
                            visualBuilder.updateRenderTimeout(dataView, () => {
                                expect(visualBuilder.mainElement.find('.labelGraphicsContext text').first().text()).toMatch(/\d*[.]\d{4}%/);
                                done();
                            });

                        });
                    });

                });
            });
        });

    });

    class MekkoChartBuilder extends VisualBuilderBase<VisualClass> {
        constructor(width: number, height: number, isMinervaVisualPlugin: boolean = false) {
            super(width, height, isMinervaVisualPlugin);
        }

        protected build() {
            return new VisualClass(null);
        }

        public get mainElement() {
            return this.element
                .children("svg")
                .children("g.axisGraphicsContext")
                .parent();
        }

        public get categoriesAxis() {
            return this.mainElement
                .children("g.axisGraphicsContext")
                .children("g.x.axis.showLinesOnAxis");
        }

        public get categoriesAxisTicks() {
            return this.categoriesAxis.children("g.tick");
        }

        public get columnElement() {
            return this.mainElement.find("svg.svgScrollable g.axisGraphicsContext .columnChartMainGraphicsContext");
        }
    }
}
