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
    import VisualClass = powerbi.visuals.samples.ForceGraph;
    import VisualSettings = powerbi.visuals.samples.ForceGraphSettings;
    import colorAssert = powerbitests.helpers.assertColorsMatch;
    import ForceGraphData = powerbitests.customVisuals.sampleDataViews.ForceGraphData;
    import DataView = powerbi.DataView;
    import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
    import ForceGraphMetadataRoleHelper = powerbi.visuals.samples.ForceGraphMetadataRoleHelper;
    import ForceGraphTooltipsFactory = powerbi.visuals.samples.ForceGraphTooltipsFactory;
    import ForceGraphTooltipInputObject = powerbi.visuals.samples.ForceGraphTooltipInputObject;
    import TooltipDataItem = powerbi.visuals.TooltipDataItem;

    describe("ForceGraph", () => {
        let visualBuilder: ForceGraphBuilder,
            defaultDataViewBuilder: ForceGraphData,
            dataView: DataView,
            settings: VisualSettings;

        beforeEach(() => {
            visualBuilder = new ForceGraphBuilder(1000, 500);
            defaultDataViewBuilder = new ForceGraphData();

            dataView = defaultDataViewBuilder.getDataView();

            settings = dataView.metadata.objects = <any>new VisualSettings();
        });

        describe("capabilities", () => {
            it("registered capabilities", () => expect(VisualClass.capabilities).toBeDefined());
        });

        describe("ForceGraphTooltipsFactory", () => {
            it("class is available", () => {
                expect(ForceGraphTooltipsFactory).toBeDefined();
            });

            it("shouldn't throw any unexpected exceptions when arguments are undefined", () => {
                expect(() => {
                    ForceGraphTooltipsFactory.build(undefined, undefined, undefined);
                }).not.toThrow();
            });

            it("shouldn't throw any unexpected exceptions when arguments are null", () => {
                expect(() => {
                    ForceGraphTooltipsFactory.build(null, null, null);
                }).not.toThrow();
            });

            it("should return an empty array when inputObject doesn't have any own properties", () => {
                let dataViewMetadataColumns: DataViewMetadataColumn[] = dataView.metadata.columns,
                    tooltips: TooltipDataItem[];

                    tooltips = ForceGraphTooltipsFactory.build({}, dataViewMetadataColumns);

                    expect(tooltips).toBeDefined();
                    expect(tooltips).not.toBeNull();
                    expect(tooltips.length).toBe(0);
            });

            it("should return array of tootips", () => {
                let dataViewMetadataColumns: DataViewMetadataColumn[] = dataView.metadata.columns,
                    tooltips: TooltipDataItem[],
                    testValues: string[] = ["SourceTestValue", "TargetTestValue"],
                    inputObject: ForceGraphTooltipInputObject;

                inputObject = {
                    "Source": testValues[0],
                    "Target": testValues[1]
                };

                tooltips = ForceGraphTooltipsFactory.build(inputObject, dataViewMetadataColumns);

                expect(tooltips).toBeDefined();
                expect(tooltips).not.toBeNull();

                expect(tooltips.length).toBe(2);

                tooltips.forEach((tooltip: TooltipDataItem, index: number) => {
                    expect(tooltip).toBeDefined();
                    expect(tooltip).not.toBeNull();

                    expect(tooltip.displayName).toBeDefined();
                    expect(tooltip.value).toBe(testValues[index]);
                });
            });
        });

        describe("ForceGraphMetadataRoleHelper", () => {
            it("class is available", () => {
                expect(ForceGraphMetadataRoleHelper).toBeDefined();
            });

            it("shouldn't throw any unexpected exceptions when arguments are undefined", () => {
                expect(() => {
                    ForceGraphMetadataRoleHelper.getColumnByRoleName(undefined, undefined);
                }).not.toThrow();
            });

            it("shouldn't throw any unexpected exceptions when arguments are null", () => {
                expect(() => {
                    ForceGraphMetadataRoleHelper.getColumnByRoleName(null, null);
                }).not.toThrow();
            });

            it("should return null when roleName isn't available", () => {
                let dataViewMetadataColumns: DataViewMetadataColumn[] = dataView.metadata.columns,
                    column: DataViewMetadataColumn;

                column = ForceGraphMetadataRoleHelper.getColumnByRoleName(
                    dataViewMetadataColumns,
                    "ForceGraphMetadataRoleHelper");

                expect(column).toBeNull();
            });

            it("shouldn't return null when roleName is available", () => {
                let dataViewMetadataColumns: DataViewMetadataColumn[] = dataView.metadata.columns,
                    column: DataViewMetadataColumn;

                column = ForceGraphMetadataRoleHelper.getColumnByRoleName(
                    dataViewMetadataColumns,
                    "Source");

                expect(column).toBeDefined();
                expect(column).not.toBeNull();
            });
        });

        describe("DOM tests", () => {
            it("svg element created", () => expect(visualBuilder.element[0]).toBeInDOM());

            it("update", (done) => {
                visualBuilder.updateRenderTimeout(dataView, () => {
                    let categorySourceLength = _.unique(dataView.categorical.categories[0].values).length,
                        categoryTargetLength = _.unique(dataView.categorical.categories[1].values).length;

                    expect(visualBuilder.mainElement.children("path.link").length)
                        .toBe(Math.max(categorySourceLength, categoryTargetLength));

                    expect(visualBuilder.mainElement.children("g.node").length)
                        .toBe(categorySourceLength + categoryTargetLength);

                    done();
                });
            });

            it("nodes labels on", done => {
                dataView.metadata.objects = { labels: { show: true } };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.mainElement.children("g.node").first().find('text').length).toBe(1);
                    done();
                });
            });

            it("nodes labels off", done => {
                dataView.metadata.objects = { labels: { show: false } };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.mainElement.children("g.node").first().find('text').length).toBe(0);
                    done();
                });
            });

            it("nodes labels change color", done => {
                dataView.metadata.objects = { 
                    labels: { 
                        color: { solid: { color: "#123123" } } 
                    } 
                };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    colorAssert(visualBuilder.mainElement.children('g.node').first().find('text').css("fill"), "#123123");

                    dataView.metadata.objects = {
                        labels: {
                            color: { solid: { color: "#324435" } }
                        }
                    };

                    visualBuilder.updateRenderTimeout(dataView, () => {
                        colorAssert(visualBuilder.mainElement.children('g.node').first().find('text').css("fill"), "#324435");
                        done();
                    });

                });
            });

            it("nodes labels change font size", done => {
                dataView.metadata.objects = {
                    labels: {
                        fontSize: 16
                    }
                };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    let nodeTextFontSise = Math.round(parseFloat(
                        visualBuilder.mainElement.children('g.node').first().find('text').css("font-size")));
                    expect(nodeTextFontSise).toBe(21);
                    done();
                });
            });

            it("links labels on", done => {
                settings.links.showLabel = true;

                visualBuilder.updateRenderTimeout(dataView, () => {
                    visualBuilder.linkLabelsTextPath.each((i,e) =>
                        expect($(e).text()).not.toBeEmpty());
                    done();
                });
            });

            it("links labels format", done => {
                settings.links.showLabel = true;
                settings.links.decimalPlaces = 2;
                settings.links.displayUnits = 1000;

                visualBuilder.updateRenderTimeout(dataView, () => {
                    visualBuilder.linkLabelsTextPath.each((i,e) => {
                        var secondPart = $(e).text().split(".")[1].split("");
                        var filtered = secondPart.filter(x => !_.isNaN(_.parseInt(x)));

                        expect(filtered.length).toBeLessThan(secondPart.length);
                        expect(filtered.length).toEqual(settings.links.decimalPlaces);
                    });

                    done();
                });
            });
        });
    });

    class ForceGraphBuilder extends VisualBuilderBase<VisualClass> {
        constructor(width: number, height: number, isMinervaVisualPlugin: boolean = false) {
            super(width, height, isMinervaVisualPlugin);
        }

        protected build() {
            return new VisualClass();
        }

        public get mainElement() {
            return this.element.children("svg.forceGraph");
        }

        public get linkLabels() {
            return this.mainElement.children("g.linklabelholder");
        }

        public get linkLabelsText() {
            return this.linkLabels.children("text.linklabel");
        }

        public get linkLabelsTextPath() {
            return this.linkLabelsText.children("textpath");
        }
    }
}
