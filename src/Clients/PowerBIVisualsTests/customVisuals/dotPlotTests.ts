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
    import VisualClass = powerbi.visuals.samples.DotPlot;
    import ValueByNameData = powerbitests.customVisuals.sampleDataViews.ValueByNameData;
    import colorAssert = powerbitests.helpers.assertColorsMatch;

    describe("DotPlot", () => {
        let visualBuilder: DotPlotBuilder;
        let defaultDataViewBuilder: ValueByNameData;
        let dataView: powerbi.DataView;

        beforeEach(() => {
            visualBuilder = new DotPlotBuilder(1000,500);
            defaultDataViewBuilder = new ValueByNameData();
            dataView = defaultDataViewBuilder.getDataView();
        });

        describe('capabilities', () => {
            it("registered capabilities", () => expect(VisualClass.capabilities).toBeDefined());
        });

        describe("DOM tests", () => {
            it("svg element created", () => expect(visualBuilder.mainElement[0]).toBeInDOM());

            it("update", done => {
                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.mainElement.children(".dotplotSelector").children(".dotplotGroup").length)
                        .toBeGreaterThan(0);
                    expect(visualBuilder.mainElement.children('.axisGraphicsContext').children(".x.axis").children(".tick").length)
                        .toBe(dataView.categorical.categories[0].values.length);
                    done();
                });
            });

            it("xAxis tick labels have tooltip", done => {
                defaultDataViewBuilder.valuesCategory = ValueByNameData.ValuesCategoryLongNames;
                dataView = defaultDataViewBuilder.getDataView();
                visualBuilder.updateRenderTimeout(dataView, () => {
                    visualBuilder.xAxisTicks.each((i,e) =>
                        expect(powerbitests.helpers.findElementTitle($(e).children("text")))
                            .toEqual(dataView.categorical.categories[0].values[i] || "(Blank)"));
                    done();
                });
            });
        });

        describe("xAxis tests", () => {
            beforeEach(() => {
                dataView.metadata.objects = {
                    categoryAxis: {
                        show: true,
                        showAxisTitle: true
                    }
                };
            });

            it("check show xAxis", done => {
                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.xAxisTicks.length).toEqual(dataView.categorical.categories[0].values.length);
                    done();
                });
            });

            it("check hide xAxis", done => {
                dataView.metadata.objects["categoryAxis"]["show"] = false;
                visualBuilder.updateRenderTimeout(dataView, () => {
                    visualBuilder.xAxisTicks.children("line").each((x,e) => expect((<any>e).style.opacity).toEqual('0'));
                    done();
                });
            });

            it("check hide xAxis label", (done) => {
                dataView.metadata.objects["categoryAxis"]["show"] = false;
                dataView.metadata.objects["categoryAxis"]["showAxisTitle"] = false;
                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.xAxisLabel.length).toEqual(0);
                    done();
                });
            });

            it("check show xAxis label", done => {
                dataView.metadata.objects["categoryAxis"]["showAxisTitle"] = true;
                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.xAxisLabel.length).toEqual(1);
                    done();
                });
            });

            it("check label color", (done) => {
                let customColor = '#ff0000';
                dataView.metadata.objects["categoryAxis"]["labelColor"] = { solid: { color: customColor } };
                dataView.metadata.objects["categoryAxis"]["show"] = true;
                visualBuilder.updateRenderTimeout(dataView, () => {
                    colorAssert(visualBuilder.xAxisLabel.css('fill'), customColor);
                    visualBuilder.xAxisTicks.children("text").each((i,e) =>  colorAssert((<any>e).style.fill,customColor));
                    done();
                });
            });
        });
    });

    class DotPlotBuilder extends VisualBuilderBase<VisualClass> {
        constructor(width: number, height: number, isMinervaVisualPlugin: boolean = false) {
            super(width, height, isMinervaVisualPlugin);
        }

        protected build() {
            return new VisualClass();
        }

        public get mainElement() {
            return this.element.find(".dotplot");
        }

        public get dataLabels() {
            return this.mainElement.children("g.labels").children("text.data-labels");
        }

        public get axisGraphicsContext() {
            return this.mainElement.children("g.axisGraphicsContext");
        }

        public get xAxis() {
            return this.axisGraphicsContext.children("g.x.axis");
        }

        public get xAxisLabel() {
            return this.xAxis.children("text.xAxisLabel");
        }

        public get xAxisTicks() {
            return this.xAxis.children("g.tick");
        }
    }
}
