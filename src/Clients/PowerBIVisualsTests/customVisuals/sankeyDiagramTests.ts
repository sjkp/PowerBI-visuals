﻿/*
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
    import VisualClass = powerbi.visuals.samples.SankeyDiagram;
    import colorAssert = powerbitests.helpers.assertColorsMatch;
    import SankeyDiagramData = powerbitests.customVisuals.sampleDataViews.SankeyDiagramData;
    import DataView = powerbi.DataView;
    import SankeyDiagramNode = powerbi.visuals.samples.SankeyDiagramNode;
    import SankeyDiagramColumn = powerbi.visuals.samples.SankeyDiagramColumn;

    interface SankeyDiagramTestsNode {
        x: number;
        inputWeight: number;
        outputWeight: number;
    }

    describe("SankeyDiagram", () => {
        let visualBuilder: SankeyDiagramBuilder,
            visualInstance: VisualClass,
            defaultDataViewBuilder: SankeyDiagramData,
            dataView: DataView;

        beforeEach(() => {
            visualBuilder = new SankeyDiagramBuilder(1000, 500);

            defaultDataViewBuilder = new SankeyDiagramData();
            dataView = defaultDataViewBuilder.getDataView();

            visualInstance = visualBuilder.instance;
        });

        describe('capabilities', () => {
            it("registered capabilities", () => expect(VisualClass.capabilities).toBeDefined());
        });

        describe("getPositiveNumber", () => {
            it("positive value should be positive value", () => {
                let positiveValue: number = 42;

                expect(visualInstance.getPositiveNumber(positiveValue)).toBe(positiveValue);
            });

            it("negative value should be 0", () => {
                expect(visualInstance.getPositiveNumber(-42)).toBe(0);
            });

            it("Infinity value should be 0", () => {
                expect(visualInstance.getPositiveNumber(Infinity)).toBe(0);
            });

            it("-Infinity should be 0", () => {
                expect(visualInstance.getPositiveNumber(-Infinity)).toBe(0);
            });

            it("NaN should be 0", () => {
                expect(visualInstance.getPositiveNumber(NaN)).toBe(0);
            });

            it("undefined should be 0", () => {
                expect(visualInstance.getPositiveNumber(undefined)).toBe(0);
            });

            it("null should be 0", () => {
                expect(visualInstance.getPositiveNumber(null)).toBe(0);
            });
        });

        describe("sortNodesByX", () => {
            it("nodes should be sorted correctly", () => {
                let xValues: number[],
                    nodes: SankeyDiagramNode[];

                xValues = [42, 13, 52, 182, 1e25, 1, 6, 3, 4];

                nodes = createNodes(xValues);

                xValues.sort((x: number, y: number) => {
                    return x - y;
                });

                visualInstance.sortNodesByX(nodes).forEach((node: SankeyDiagramNode, index: number) => {
                    expect(node.x).toBe(xValues[index]);
                });
            });

            function createNodes(xValues: number[]): SankeyDiagramNode[] {
                return xValues.map((xValue: number) => {
                    return {
                        label: {
                            name: "",
                            formattedName: "",
                            width: 0,
                            height: 0,
                            colour: ""
                        },
                        inputWeight: 0,
                        outputWeight: 0,
                        links: [],
                        x: xValue,
                        y: 0,
                        width: 0,
                        height: 0,
                        colour: "",
                        selectionIds: [],
                        tooltipData: []
                    };
                });
            }
        });

        describe("getColumns", () => {
            it("getColumns", () => {
                let testNodes: SankeyDiagramTestsNode[];

                testNodes = [
                    { x: 0, inputWeight: 15, outputWeight: 14 },
                    { x: 1, inputWeight: 10, outputWeight: 5 },
                    { x: 2, inputWeight: 15, outputWeight: 13 },
                    { x: 3, inputWeight: 42, outputWeight: 28 }
                ];

                visualInstance.getColumns(createNodes(testNodes)).forEach((column: SankeyDiagramColumn, index: number) => {
                    expect(column.countOfNodes).toBe(1);

                    expect(column.sumValueOfNodes).toBe(testNodes[index].inputWeight);
                });
            });

            function createNodes(testNodes: SankeyDiagramTestsNode[]): SankeyDiagramNode[] {
                return testNodes.map((testNode: SankeyDiagramTestsNode) => {
                    return {
                        label: {
                            name: "",
                            formattedName: "",
                            width: 0,
                            height: 0,
                            colour: ""
                        },
                        inputWeight: testNode.inputWeight,
                        outputWeight: testNode.outputWeight,
                        links: [],
                        x: testNode.x,
                        y: 0,
                        width: 0,
                        height: 0,
                        colour: "",
                        selectionIds: [],
                        tooltipData: []
                    };
                });
            }
        });

        describe("getMaxColumn", () => {
            it("getMaxColumn should return { sumValueOfNodes: 0, countOfNodes: 0 }", () => {
                let maxColumn: SankeyDiagramColumn;

                maxColumn = visualInstance.getMaxColumn([]);

                expect(maxColumn.countOfNodes).toBe(0);
                expect(maxColumn.sumValueOfNodes).toBe(0);
            });

            it("getMaxColumn should return { sumValueOfNodes: 0, countOfNodes: 0 } when columns are null", () => {
                let maxColumn: SankeyDiagramColumn;

                maxColumn = visualInstance.getMaxColumn([
                    undefined,
                    null
                ]);

                expect(maxColumn.countOfNodes).toBe(0);
                expect(maxColumn.sumValueOfNodes).toBe(0);
            });

            it("getMaxColumn should return max column", () => {
                let maxColumn: SankeyDiagramColumn,
                    columns: SankeyDiagramColumn[];

                maxColumn = { countOfNodes: 35, sumValueOfNodes: 21321 };

                columns = [
                    { countOfNodes: 15, sumValueOfNodes: 500 },
                    { countOfNodes: 25, sumValueOfNodes: 42 },
                    maxColumn
                ];

                expect(visualInstance.getMaxColumn(columns)).toBe(maxColumn);
            });
        });

        describe("DOM tests", () => {
            it("main element created", () => expect(visualBuilder.mainElement[0]).toBeInDOM());

            it("update", (done) => {
                 visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.linksElement).toBeInDOM();
                    expect(visualBuilder.linksElements.length)
                        .toBe(dataView.categorical.categories[0].values.length);

                    let allCountries = <string[]>dataView.categorical.categories[0].values.concat(dataView.categorical.categories[1].values);
                    let uniqueCountries = allCountries.sort().filter((value, index, array) => !index || value !== array[index - 1]);

                    expect(visualBuilder.nodesElement).toBeInDOM();
                    expect(visualBuilder.nodesElements.length)
                        .toEqual(uniqueCountries.length);

                    done();
                });
            });

            it("nodes labels on", done => {
                dataView.metadata.objects = {
                    labels: {
                        show: true
                    }
                };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.nodesElement.find('text').first().css('display')).toBe('block');
                    done();
                });
            });

            it("nodes labels off", done => {
                dataView.metadata.objects = {
                    labels: {
                        show: false
                    }
                };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.nodesElement.find('text').first().css('display')).toBe('none');
                    done();
                });
            });

            it("nodes labels change color", done => {
                dataView.metadata.objects = {
                    labels: {
                        fill: { solid: { color: "#123123" } }
                    }
                };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    colorAssert(visualBuilder.nodesElement.find('text').first().css('fill'), "#123123");
                    done();
                });
            });

            it("link change color", done => {
                let objects = dataView.categorical.categories[0].objects = [];
                objects.push({
                    links: {
                        fill: { solid: { color: "#E0F600" } }
                    }
                });

                visualBuilder.updateRenderTimeout(dataView, () => {
                    colorAssert(visualBuilder.linksElement.find('.link').first().css('stroke'), "#E0F600");
                    done();
                });
            });

            describe("selection and deselection", () => {
                const selectionSelector = ".selected";

                it("nodes", done => {
                    visualBuilder.updateRenderTimeout(dataView, () => {
                        expect(visualBuilder.nodesElements.filter(selectionSelector)).not.toBeInDOM();
                        let node = visualBuilder.nodesElements.first();
                        powerbitests.helpers.clickElement(node);

                        helpers.renderTimeout(() => {
                            expect(node.filter(selectionSelector)).not.toBeInDOM();
                            expect(visualBuilder.nodesElements.filter(selectionSelector)).toBeInDOM();

                            powerbitests.helpers.clickElement(node);
                            helpers.renderTimeout(() => {
                                expect(visualBuilder.nodesElements.filter(selectionSelector)).not.toBeInDOM();
                                done();
                            });
                        });
                    });
                });

                it("links", done => {
                    visualBuilder.updateRenderTimeout(dataView, () => {
                        expect(visualBuilder.linksElements.filter(selectionSelector)).not.toBeInDOM();
                        let link = visualBuilder.linksElements.first();
                        powerbitests.helpers.clickElement(link);

                        helpers.renderTimeout(() => {
                            expect(link.filter(selectionSelector)).toBeInDOM();
                            expect(visualBuilder.linksElements.not(link).filter(selectionSelector)).not.toBeInDOM();

                            powerbitests.helpers.clickElement(link);
                            helpers.renderTimeout(() => {
                                expect(visualBuilder.linksElements.filter(selectionSelector)).not.toBeInDOM();
                                done();
                            });
                        });
                    });
                });
            });

            describe("data rendering", () => {
                it("negative and zero values", done => {
                    let dataLength: number = defaultDataViewBuilder.valuesSourceDestination.length;
                    let groupLength = Math.floor(dataLength / 3) - 2;
                    let negativeValues = helpers.getRandomNumbers(groupLength, -100, 0);
                    let zeroValues = _.range(0, groupLength, 0);
                    let positiveValues = helpers.getRandomNumbers(dataLength - negativeValues.length - zeroValues.length, 1, 100);

                    defaultDataViewBuilder.valuesValue = negativeValues.concat(zeroValues).concat(positiveValues);

                    visualBuilder.updateRenderTimeout([defaultDataViewBuilder.getDataView()], () => {
                        expect(visualBuilder.linksElements.length).toBe(positiveValues.length);

                        done();
                    });
                });
            });
        });
    });

    class SankeyDiagramBuilder extends VisualBuilderBase<VisualClass> {
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
            return this.element.children("svg.sankeyDiagram");
        }

        public get nodesElement(): JQuery  {
            return this.mainElement.children("g").children("g.nodes");
        }

        public get nodesElements(): JQuery  {
            return this.nodesElement.children("g.node");
        }

        public get linksElement(): JQuery  {
            return this.mainElement.children("g").children("g.links");
        }

        public get linksElements(): JQuery  {
            return this.linksElement.children("path.link");
        }
    }
}
