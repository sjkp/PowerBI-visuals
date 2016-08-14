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
    import VisualClass = powerbi.visuals.samples.PulseChart;
    import PulseChartData = powerbitests.customVisuals.sampleDataViews.PulseChartData;

    describe("PulseChart", () => {
        let visualBuilder: PulseChartBuilder;
        let defaultDataViewBuilder: PulseChartData;
        let dataView: powerbi.DataView;

        beforeEach(() => {
            visualBuilder = new PulseChartBuilder(1000,500);
            defaultDataViewBuilder = new PulseChartData();
            dataView = defaultDataViewBuilder.getDataView();
        });

        afterEach(() => helpers.d3TimerEnabled = true);

        describe('capabilities', () => {
            it("registered capabilities", () => expect(VisualClass.capabilities).toBeDefined());
        });

        describe("DOM tests", () => {
            it("svg element created", () =>expect(visualBuilder.mainElement[0]).toBeInDOM());

            it("update", (done) => {
                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.mainElement.children("g.y.axis").children("g.tick")).toBeInDOM();
                    expect(visualBuilder.gaps).toBeInDOM();
                    expect(visualBuilder.animationDot).toBeInDOM();
                    expect(visualBuilder.lineContainer.children("path.line")).toBeInDOM();
                    expect(visualBuilder.xAxisNode.children("path.domain")).toBeInDOM();
                    expect(visualBuilder.xAxisNode.children("g.tick")).toBeInDOM();
                    expect(visualBuilder.tooltipContainer).toBeInDOM();
                    done();
                });
            });

            describe("popup", () => {
                it("always on top - chart height", (done) => {
                    visualBuilder.updateRenderTimeout(dataView, () => {
                        let charHeight = visualBuilder.chart[0].getBoundingClientRect().height;
                        dataView.metadata.objects = { popup: { alwaysOnTop: true } };

                        visualBuilder.updateRenderTimeout(dataView, () => {
                            expect(visualBuilder.chart[0].getBoundingClientRect().height).toBeGreaterThan(charHeight);
                            done();
                        });
                    });
                });

                it("hidden - chart height and top", (done) => {
                    visualBuilder.updateRenderTimeout(dataView, () => {
                        let position = helpers.getRelativePosition(visualBuilder.element, visualBuilder.chart);
                        let charHeight = visualBuilder.chart[0].getBoundingClientRect().height;
                        dataView.metadata.objects = { popup: { show: false } };

                        visualBuilder.updateRenderTimeout(dataView, () => {
                            expect(visualBuilder.chart[0].getBoundingClientRect().height).toBeGreaterThan(charHeight);
                            expect(helpers.getRelativePosition(visualBuilder.element, visualBuilder.chart).y).toBeLessThan(position.y);
                            done();
                        });
                    });
                });

                describe("interaction", () => {
                    it("click", (done) => {
                        visualBuilder.updateRenderTimeout(dataView, () => {
                            let firstDot = visualBuilder.dotsContainerDot.first();
                            powerbitests.helpers.clickElement(firstDot);

                            helpers.renderTimeout(() => {
                                let firstPopup = visualBuilder.tooltipContainerTooltip.first();
                                expect(firstPopup).toBeInDOM();
                                powerbitests.helpers.clickElement(firstDot);

                                helpers.renderTimeout(() => {
                                    expect(firstPopup).not.toBeInDOM();
                                    done();
                                });
                            });
                        });
                    });
                });
            });

            describe("dots", () => {
                it("default dot size", (done) => {
                    let dotSize = 25;
                    dataView.metadata.objects = { dots: { 
                        size: dotSize,
                        minSize: dotSize - 1,
                        maxSize: dotSize + 1
                    } };

                    visualBuilder.updateRenderTimeout(dataView, () => {
                        expect(_.parseInt(visualBuilder.dotsContainerDot.attr('r'))).toEqual(dotSize);
                        done();
                    });
                });
            });

            describe("xAxis", () => {
                it("backgroundColor set", (done) => {
                    let color = "#FF0000";
                    dataView.metadata.objects = { xAxis: { backgroundColor: { solid: { color: color } } } };

                    visualBuilder.updateRenderTimeout(dataView, () => {
                        powerbitests.helpers.assertColorsMatch(
                            visualBuilder.xAxisNodeTick.children("rect.axisBox").css("fill"), color);
                        done();
                    });
                });

                it("duplicate values", (done) => {
                    visualBuilder.viewport.width = 2000;
                    visualBuilder.updateRenderTimeout(dataView, () => {
                        let tickTextValues = visualBuilder.xAxisNodeTick.children("text").toArray().map($).map(x=>x.text());
                        for(let i = 0; i < tickTextValues.length - 1; i++) {
                            expect(tickTextValues[i]).not.toEqual(tickTextValues[i+1]);
                        }

                        done();
                    });
                });
            });

            describe("playback", () => {
                beforeEach(() => helpers.d3TimerEnabled = false);

                it("autoplay position set", (done) => {
                    dataView.metadata.objects = {
                        playback: {
                            autoplay: true,
                            position: JSON.stringify(<powerbi.visuals.samples.PulseChartAnimationPosition>{ 
                                    series: 0,
                                    index: dataView.categorical.categories[0].values.length/2
                                })
                        }
                    };

                    visualBuilder.updateRenderTimeout(dataView, () => {
                        let pathElem = visualBuilder.lineContainer.children("path.line");
                        let chartWidth = visualBuilder.chart[0].getBoundingClientRect().width;
                        let pathWidth = pathElem[0].getBoundingClientRect().width;

                        expect(pathWidth).toBeGreaterThan(chartWidth/5);

                        done();
                    }, 300);
                });

                it("popup is hidden when pressing play during pause", (done) => {
                    let eventIndex = dataView.categorical.categories[1].values
                        .map((x, i) => <any>{ value: x, index: i }).filter(x => x.value)[0].index;

                    dataView.metadata.objects = {
                        playback: {
                            autoplay: true,
                            position: JSON.stringify(<powerbi.visuals.samples.PulseChartAnimationPosition>{ 
                                    series: 0,
                                    index: eventIndex - 1
                                })
                            }
                         };

                    visualBuilder.updateRenderTimeout(dataView, () => {
                        let popup = visualBuilder.tooltipContainerTooltip.first();
                        expect(popup).toBeInDOM();
                        powerbitests.helpers.clickElement(visualBuilder.animationPlay);

                        helpers.renderTimeout(() => {
                            expect(popup).not.toBeInDOM();
                            done();
                        });
                    }, 300);
                });
            });
        });

        describe('enumerateObjectInstances', () => {
            let visualBuilder: PulseChartBuilder;
            let dataView: powerbi.DataView;

            beforeEach(() => {
                visualBuilder = new PulseChartBuilder(500, 800);
                dataView = new powerbitests.customVisuals.sampleDataViews.PulseChartData().getDataView();
            });
      
            it('enumerateObjectInstances no model', (done) => {
                let enumeration = visualBuilder.enumerateObjectInstances({ objectName: 'label' });
                helpers.renderTimeout(() => {
                    expect(enumeration).toBeUndefined();
                    done();
                });
            });

            it('enumerateObjectInstances series', (done) => {
                visualBuilder.updateEnumerateObjectInstancesRenderTimeout(dataView, { objectName: 'series' }, enumeration => {
                    let instance = enumeration["instances"][0];
                    expect(instance).toBeDefined();
                    expect(instance.objectName).toBe('series');
                    expect(instance.properties['fill']).toBe('#3779B7');
                    expect(instance.properties['width']).toBe(2);
                    done();
                });
            });

            it('enumerateObjectInstances gaps', (done) => {
                visualBuilder.updateEnumerateObjectInstancesRenderTimeout(dataView, { objectName: 'gaps' }, enumeration => {
                    let instance = enumeration["instances"][0];
                    expect(instance).toBeDefined();
                    expect(instance.objectName).toBe('gaps');
                    expect(instance.properties['show']).toBe(false);
                    expect(instance.properties['transparency']).toBe(1);
                    done();
                });
            });

            it('enumerateObjectInstances popup', (done) => {
                visualBuilder.updateEnumerateObjectInstancesRenderTimeout(dataView, { objectName: 'popup' }, enumeration => {
                    let instance = enumeration["instances"][0];
                    expect(instance).toBeDefined();
                    expect(instance.objectName).toBe('popup');
                    expect(instance.properties['show']).toBe(true);
                    expect(instance.properties['alwaysOnTop']).toBe(false);
                    expect(instance.properties['width']).toBe(100);
                    expect(instance.properties['height']).toBe(80);
                    expect(instance.properties['color']).toBe("#808181");
                    expect(instance.properties['fontColor']).toBe("white");
                    expect(instance.properties['fontSize']).toBe(10);
                    expect(instance.properties['showTime']).toBe(true);
                    expect(instance.properties['showTitle']).toBe(true);
                    expect(instance.properties['timeColor']).toBe("white");
                    expect(instance.properties['timeFill']).toBe("#010101");
                    done();
                });
            });
        });
    });

    class PulseChartBuilder extends VisualBuilderBase<VisualClass> {
        constructor(width: number, height: number, isMinervaVisualPlugin: boolean = false) {
            super(width, height, isMinervaVisualPlugin);
        }

        protected build() {
            return new VisualClass();
        }

        public get mainElement(): JQuery {
            return this.element.children('svg.pulseChart');
        }

        public get gaps(): JQuery {
            return this.mainElement.children('g.gaps');
        }

        public get animationDot(): JQuery {
            return this.mainElement.children('g.dots').children("circle.animationDot");
        }

        public get chart(): JQuery {
            return this.mainElement.children('g.chart');
        }

        public get lineNode(): JQuery {
            return this.chart.children('g.lineNode');
        }

        public get lineContainer(): JQuery {
            return this.lineNode.children('g.lineContainer');
        }

        public get dotsContainer(): JQuery {
            return this.lineNode.children('g.dotsContainer');
        }

        public get dotsContainerDot(): JQuery {
            return this.dotsContainer.children("circle.dot");
        }

        public get xAxisNode(): JQuery {
            return this.lineNode.children('g.xAxisNode');
        }

        public get xAxisNodeTick(): JQuery {
            return this.xAxisNode.children("g.tick");
        }

        public get tooltipContainer(): JQuery {
            return this.lineNode.children('g.tooltipContainer');
        }

        public get tooltipContainerTooltip(): JQuery {
            return this.tooltipContainer.children('g.Tooltip');
        }

        public get animationPlay(): JQuery {
            return this.mainElement.children("g").children("g.animationPlay");
        }
    }
}