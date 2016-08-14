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
    import VisualClass = powerbi.visuals.samples.LineDotChart;
    import LineDotChartData = powerbitests.customVisuals.sampleDataViews.LineDotChartData;

    powerbitests.mocks.setLocale();

    describe("LineDotChartTests", () => {
        let visualBuilder: LineDotChartBuilder;
        let defaultDataViewBuilder: LineDotChartData;
        let dataView: powerbi.DataView;

        beforeEach(() => {
            visualBuilder = new LineDotChartBuilder(1000,500);
            defaultDataViewBuilder = new LineDotChartData();
            dataView = defaultDataViewBuilder.getDataView();
        });

        describe('capabilities', () => {
            it("registered capabilities", () => {
                expect(VisualClass.capabilities).toBeDefined();
                expect(VisualClass.capabilities).not.toBeNull();
            });
        });

        describe("DOM tests", () => {
            it("main element was created", () => {
                expect(visualBuilder.mainElement.get(0)).toBeDefined();
            });

            it("update", (done) => {
                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.mainElement.find(".axis").length).not.toBe(0);
                    expect(visualBuilder.mainElement.find(".tick").length).not.toBe(0);
                    expect(visualBuilder.mainElement.find(".lineDotChart__playBtn").get(0)).toBeDefined();
                    expect(visualBuilder.mainElement.find(".legends").get(0)).toBeDefined();

                    done();
                });
            });
        });
    });

    class LineDotChartBuilder extends VisualBuilderBase<VisualClass> {
        constructor(width: number, height: number, isMinervaVisualPlugin: boolean = false) {
            super(width, height, isMinervaVisualPlugin);
        }

        protected build() {
            return new VisualClass();
        }

        public get mainElement(): JQuery {
            return this.element.children(".lineDotChart");
        }
    }
}
