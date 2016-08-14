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
    import VisualClass = powerbi.visuals.samples.Histogram;
    import ValueByAgeData = powerbitests.customVisuals.sampleDataViews.ValueByAgeData;
    import assertColorsMatch = powerbitests.helpers.assertColorsMatch;

    describe("HistogramChart", () => {
        let visualBuilder: HistogramChartBuilder;
        let defaultDataViewBuilder: ValueByAgeData;
        let dataView: powerbi.DataView;

        beforeEach(() => {
            visualBuilder = new HistogramChartBuilder(1000, 500);
            defaultDataViewBuilder = new ValueByAgeData();
            dataView = defaultDataViewBuilder.getDataView();
        });

        describe("capabilities", () => {
            it("registered capabilities", () => expect(VisualClass.capabilities).toBeDefined());
        });

        describe("DOM tests", () => {
            it("svg element created", () => expect(visualBuilder.mainElement[0]).toBeInDOM());

            it("update", (done) => {
                visualBuilder.updateRenderTimeout(dataView, () => {
                    let binsNumber = d3.layout.histogram().frequency(true)(dataView.categorical.categories[0].values).length;
                    expect(visualBuilder.mainElement.find(".column").length).toBe(binsNumber);
                    done();
                });
            });
        });

        describe("property pane changes", () => {
            it("Validate data point color change", (done) => {
                dataView.metadata.objects = {
                    dataPoint: {
                        fill: {
                            solid: { color: "#ff0000" }
                        }
                    }
                };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    let elements = visualBuilder.mainElement.find(".column");
                    elements.each((index, elem) => {
                        assertColorsMatch($(elem).css("fill"), "#ff0000");
                    });

                    done();
                });
            });

            it("Validate bins count change", (done) => {
                dataView.metadata.objects = { general: { bins: 3 } };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    let binsCount = visualBuilder.mainElement.find(".column").length;
                    dataView.metadata.objects = { general: { bins: 6 } };

                    visualBuilder.updateRenderTimeout(dataView, () => {
                        let binsAfterUpdate = visualBuilder.mainElement.find(".column").length;
                        expect(binsCount).toBe(3);
                        expect(binsAfterUpdate).toBeGreaterThan(binsCount);
                        expect(binsAfterUpdate).toBe(6);
                        done();
                    });
                });
            });

            it("Validate start bigger than end at y axis", (done) => {
                dataView.metadata.objects = {
                    yAxis: {
                        start: 65,
                        end:33
                    }
                };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    let firstY = parseInt(visualBuilder.mainElement.find(".axis:last .tick:first text").text(),10);
                    expect(firstY).toBe(0);

                    done();
                });
            });

            it('Validate position right y axis', (done) => {
                dataView.metadata.objects = {
                    yAxis: {
                        position: "Right"
                    }
                };

                visualBuilder.update(dataView);
                setTimeout(() => {
                    var firstY = parseInt(visualBuilder.mainElement.find('.axis:last').attr("transform").split(',')[0].split('(')[1], 10);
                    var lastX = parseInt(visualBuilder.mainElement.find('.axis:first .tick:last').attr("transform").split(',')[0].split('(')[1], 10);
                    expect(firstY).toBe(lastX);

                    done();
                }, DefaultWaitForRender);
            });

            it('Validate Data Label', (done) => {
                dataView.metadata.objects = {
                    labels: {
                        show: true
                    }
                };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    let columns = (visualBuilder.mainElement.find(".columns rect")).length;
                    let dataLabels = (visualBuilder.mainElement.find(".labels text")).length;
                    expect(columns).toBe(dataLabels);

                    done();
                });
            });

            it('Validate title disabled', (done) => {
                dataView.metadata.objects = {
                    yAxis: {
                        title: false
                    }
                };

                visualBuilder.update(dataView);
                setTimeout(() => {
                    var title = visualBuilder.mainElement.find('.legends text:last').attr("style").indexOf("display: none") > -1;
                    expect(title).toBe(true);

                    done();
                }, DefaultWaitForRender);
            });

            it("Display units - millions", done => {
                dataView.metadata.objects = {
                    labels: {
                        show: true,
                        displayUnits: 1000000,
                    },
                };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.mainElement.find('.labels text').first().text()).toMatch(/[0-9.]*M/);
                    done();
                });

            });

            it("Display units - thousands", done => {
                dataView.metadata.objects = {
                    labels: {
                        show: true,
                        displayUnits: 1000,
                    },
                };
                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.mainElement.find('.labels text').first().text()).toMatch(/[0-9.]*K/);
                    done();
                });

            });

            it("Limit Decimal Places value", done => {
                dataView.metadata.objects = {
                    labels: {
                        show: true,
                        displayUnits: 0,
                        precision: 4,
                    },
                };
                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.mainElement.find('.labels text').first().text()).toMatch(/\d*[.]\d{4}/);
                    done();
                });

            });

            it("Data labels font-size", done => {
                dataView.metadata.objects = {
                    labels: {
                        show: true,
                        fontSize: 15,
                    },
                };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.mainElement.find('.labels text').first().css('font-size')).toBe("20px");
                    done();
                });

            });

            it("X-Axis settings change", (done) => {
                dataView.metadata.objects = {
                    xAxis: {
                        axisColor: {
                            solid: { color: "#ff0011" }
                        }
                    }
                };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    let elements = visualBuilder.mainElement.find(".axis:first .tick text");
                    elements.each((index, elem) => {
                        assertColorsMatch($(elem).first().css("fill"), "#ff0011");
                    });

                    done();
                });
            });

            it("Y-Axis settings change", (done) => {
                dataView.metadata.objects = {
                    yAxis: {
                        axisColor: {
                            solid: { color: "#ff0022" }
                        }
                    }
                };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    let elements = visualBuilder.mainElement.find(".axis:nth-child(2) .tick text");
                    elements.each((index, elem) => {
                        assertColorsMatch($(elem).first().css("fill"), "#ff0022");
                    });

                    done();
                });
            });
        });
    });

    class HistogramChartBuilder extends VisualBuilderBase<VisualClass> {
        constructor(width: number, height: number, isMinervaVisualPlugin: boolean = false) {
            super(width, height, isMinervaVisualPlugin);
        }

        protected build() {
            return new VisualClass();
        }

        public get mainElement() {
            return this.element.children("svg");
        }
    }
}

