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
    import VisualClass = powerbi.visuals.samples.BulletChart;
    import BulletChartData = powerbitests.customVisuals.sampleDataViews.BulletChartData;
    powerbitests.mocks.setLocale();

    describe("BulletChart", () => {
        let visualBuilder: BulletChartBuilder;
        let defaultDataViewBuilder: powerbitests.customVisuals.sampleDataViews.BulletChartData;
        let dataView: powerbi.DataView;

        beforeEach(() => {
            visualBuilder = new BulletChartBuilder(1000,500);
            defaultDataViewBuilder = new BulletChartData();
            dataView = defaultDataViewBuilder.getDataView();
        });

        describe('capabilities', () => {
            it("registered capabilities", () => expect(VisualClass.capabilities).toBeDefined());
        });

        describe("DOM tests", () => {
            let defaultCategoryWidth: number = 60;

            it("svg element created", () => expect(visualBuilder.mainElement[0]).toBeInDOM());
            it("update", (done) => {
                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.mainElement.children("g").first().children("text").length)
                        .toBe(dataView.categorical.categories[0].values.length);
                    expect(visualBuilder.element.find('.bulletChart').css('height')).toBe(visualBuilder.viewport.height + 'px');
                    expect(visualBuilder.element.find('.bulletChart').css('width')).toBe(visualBuilder.viewport.width + 'px');
                    done();
                });
            });

            it("update vertical", (done) => {
                dataView.metadata.objects = { orientation: { vertical: true } };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.element.find('.bullet-scroll-region').css('height'))
                        .toBe(dataView.categorical.categories[0].values.length * defaultCategoryWidth + 'px');
                    expect(visualBuilder.element.find('.bullet-scroll-region').css('width'))
                        .toBe((visualBuilder.viewport.width - 22) + 'px');
                    done();
                });
            });

            it("update with illegal values", (done) => {
                defaultDataViewBuilder.valuesValue = [20000, 420837, -3235, -3134, null, 0, 4, 5];
                dataView = defaultDataViewBuilder.getDataView();
                dataView.metadata.objects = { orientation: { vertical: false } };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.element.find('.rect').length).toBe(0);
                    done();
                });
            });

            it("update non vertical", (done) => {
                dataView.metadata.objects = { orientation: { vertical: false } };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.element.find('.bullet-scroll-region').css('height'))
                        .toBe(dataView.categorical.categories[0].values.length * defaultCategoryWidth + 'px');
                    expect(visualBuilder.element.find('.bullet-scroll-region').css('width'))
                        .toBe((visualBuilder.viewport.width - 22) + 'px');
                    done();
                });
            });

            it("update axis", (done) => {
                dataView.metadata.objects = { axis: { axis: true, axisColor: { solid: { color: '#222222' } } } };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.element.find('.axis')).toBeDefined();
                    powerbitests.helpers.assertColorsMatch(visualBuilder.element.find('.axis').css('fill'), "#222222");
                    powerbitests.helpers.assertColorsMatch(visualBuilder.element.find('.axis').find('line').css('stroke'), "#222222");
                    done();
                });
            });

            it("update without axis", (done) => {
                dataView.metadata.objects = { axis: { axis: false } };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.element.find('.axis').length).toBe(0);
                    done();
                });
            });
        });

        describe('enumerateObjectInstances', () => {
            it('enumerateObjectInstances no model', (done) => {
                let enumeratuion = visualBuilder.enumerateObjectInstances({ objectName: 'labels' });
                helpers.renderTimeout(() => {
                    expect(enumeratuion).toBeUndefined();
                    done();
                });
            });

            it('enumerateObjectInstances labels', (done) => {
                visualBuilder.updateEnumerateObjectInstancesRenderTimeout(dataView, { objectName: 'labels' }, enumeratuion => {
                    expect(enumeratuion[0]).toBeDefined();
                    expect(enumeratuion[0].objectName).toBe('labels');
                    expect(enumeratuion[0].properties['labelColor']).toBe('Black');
                    expect(enumeratuion[0].properties['fontSize']).toBe(11);
                    done();
                });
            });

            it('enumerateObjectInstances values', (done) => {
                visualBuilder.updateEnumerateObjectInstancesRenderTimeout(dataView, { objectName: 'values' }, enumeratuion => {
                    expect(enumeratuion[0]).toBeDefined();
                    expect(enumeratuion[0].objectName).toBe('values');
                    expect(enumeratuion[0].properties['targetValue']).toBe(0);
                    expect(enumeratuion[0].properties['targetValue2']).toBe(0);
                    expect(enumeratuion[0].properties['minimumPercent']).toBe(0);
                    expect(enumeratuion[0].properties['needsImprovementPercent']).toBe(25);
                    expect(enumeratuion[0].properties['satisfactoryPercent']).toBe(50);
                    expect(enumeratuion[0].properties['goodPercent']).toBe(100);
                    expect(enumeratuion[0].properties['veryGoodPercent']).toBe(125);
                    expect(enumeratuion[0].properties['maximumPercent']).toBe(200);
                    done();
                });
            });

            it('enumerateObjectInstances orientation', (done) => {
                visualBuilder.updateEnumerateObjectInstancesRenderTimeout(dataView, { objectName: 'orientation' }, enumeratuion => {
                    expect(enumeratuion[0]).toBeDefined();
                    expect(enumeratuion[0].objectName).toBe('orientation');
                    expect(enumeratuion[0].properties['orientation']).toBe('Horizontal Left');
                    done();
                });
            });

            it('enumerateObjectInstances axis', (done) => {
                visualBuilder.updateEnumerateObjectInstancesRenderTimeout(dataView, { objectName: 'axis' }, enumeratuion => {
                    expect(enumeratuion[0]).toBeDefined();
                    expect(enumeratuion[0].objectName).toBe('axis');
                    expect(enumeratuion[0].properties['axisColor']).toBe('Grey');
                    expect(enumeratuion[0].properties['measureUnits']).toBe('');
                    expect(enumeratuion[0].properties['unitsColor']).toBe('Grey');
                    done();
                });
            });
        });
    });

    class BulletChartBuilder extends VisualBuilderBase<VisualClass> {
        constructor(width: number, height: number, isMinervaVisualPlugin: boolean = false) {
            super(width, height, isMinervaVisualPlugin);
        }

        public get mainElement() {
            return this.element.children("div").children("svg");
        }

        protected build() {
            return new VisualClass();
        }
    }
}
