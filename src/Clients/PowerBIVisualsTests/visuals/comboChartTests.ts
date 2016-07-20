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
    import AxisType = powerbi.visuals.axisType;
    import ComboChart = powerbi.visuals.ComboChart;
    import ComboChartDataViewObjects = powerbi.visuals.ComboChartDataViewObjects;
    import CompiledDataViewMapping = powerbi.data.CompiledDataViewMapping;
    import DataViewObjects = powerbi.DataViewObjects;
    import DataViewTransform = powerbi.data.DataViewTransform;
    import lineStyle = powerbi.visuals.lineStyle;
    import PixelConverter = jsCommon.PixelConverter;
    import PrimitiveType = powerbi.PrimitiveType;
    import TrendLineHelper = powerbi.visuals.TrendLineHelper;
    import ValueType = powerbi.ValueType;
    import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

    powerbitests.mocks.setLocale();

    describe("ComboChart", () => {
        it("registered capabilities", () => {
            expect(powerbi.visuals.plugins.comboChart.capabilities).toBe(ComboChart.capabilities);
            expect(powerbi.visuals.plugins.lineClusteredColumnComboChart.capabilities).toBe(ComboChart.capabilities);
            expect(powerbi.visuals.plugins.lineStackedColumnComboChart.capabilities).toBe(ComboChart.capabilities);
        });

        it('ColumnChart registered customizeQuery', () => {
            expect(powerbi.visuals.plugins.comboChart.customizeQuery).toBe(ComboChart.customizeQuery);
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

        describe('CustomizeQuery', () => {
            const WindowCountWithoutSeries: number = 1000;
            const WindowCountWithSeries: number = 100;
            const SeriesTopCount: number = 60;

            let objects: DataViewObjects;
            let dataViewMappings: CompiledDataViewMapping[];

            beforeEach(() => {
                objects = {
                    categoryAxis: {}
                };
            });

            it('removes series when there are no column values', () => {
                dataViewMappings = createCompiledDataViewMappings(false);
                customizeQuery();

                expect((<powerbi.data.CompiledDataViewGroupedRoleMapping>dataViewMappings[0].categorical.values).group.by.items).toBeUndefined();
            });

            it('does not remove series when there are column values', () => {
                dataViewMappings = createCompiledDataViewMappings(true);
                customizeQuery();

                expect((<powerbi.data.CompiledDataViewGroupedRoleMapping>dataViewMappings[0].categorical.values).group.by.items).toBeDefined();
            });

            describe('with no scalar axis flag', () => {
                beforeEach(() => {
                    objects['categoryAxis'] = {
                        categoryAxis: {
                            axisType: null
                        }
                    };
                });

                describe('with scalar type', () => {
                    beforeEach(() => {
                        dataViewMappings = createCompiledDataViewMappings(true, ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime), objects);
                    });

                    it('with series sets the correct dataReductionAlgorithms', () => {
                        customizeQuery();
                        verifyCategoriesDataReductionAlgorithm({ sample: {} });
                        verifyValuesDataReductionAlgorithm({ top: {} });
                    });

                    it('without series sets the correct dataReductionAlgorithms', () => {
                        removeSeries();
                        customizeQuery();
                        verifyCategoriesDataReductionAlgorithm({ sample: {} });
                        verifyValuesDataReductionAlgorithm({ top: {} });
                    });
                });

                describe('with non-scalar type', () => {
                    beforeEach(() => {
                        dataViewMappings = createCompiledDataViewMappings(true, ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text), objects);
                    });

                    it('with series sets the correct dataReductionAlgorithms', () => {
                        customizeQuery();
                        verifyCategoriesDataReductionAlgorithm({ window: { count: WindowCountWithSeries } });
                        verifyValuesDataReductionAlgorithm({ top: { count: SeriesTopCount } });
                    });

                    it('without series sets the correct dataReductionAlgorithms', () => {
                        removeSeries();
                        customizeQuery();
                        verifyCategoriesDataReductionAlgorithm({ window: { count: WindowCountWithoutSeries } });
                        verifyValuesDataReductionAlgorithm({ top: { count: SeriesTopCount } });
                    });
                });
            });

            describe('with scalar axis flag', () => {
                beforeEach(() => {
                    objects['categoryAxis'] = {
                        categoryAxis: {
                            axisType: 'Scalar',
                        }
                    };
                });

                describe('with scalar type', () => {
                    beforeEach(() => {
                        dataViewMappings = createCompiledDataViewMappings(true, ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime), objects);
                    });

                    it('with series sets the correct dataReductionAlgorithms', () => {
                        customizeQuery();
                        verifyCategoriesDataReductionAlgorithm({ sample: {} });
                        verifyValuesDataReductionAlgorithm({ top: {} });
                    });

                    it('without series sets the correct dataReductionAlgorithms', () => {
                        removeSeries();
                        customizeQuery();
                        verifyCategoriesDataReductionAlgorithm({ sample: {} });
                        verifyValuesDataReductionAlgorithm({ top: {} });
                    });
                });

                describe('with non-scalar type', () => {
                    beforeEach(() => {
                        dataViewMappings = createCompiledDataViewMappings(true, ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text), objects);
                    });

                    it('with series sets the correct dataReductionAlgorithms', () => {
                        customizeQuery();
                        verifyCategoriesDataReductionAlgorithm({ window: { count: WindowCountWithSeries } });
                        verifyValuesDataReductionAlgorithm({ top: { count: SeriesTopCount } });
                    });

                    it('without series sets the correct dataReductionAlgorithms', () => {
                        removeSeries();
                        customizeQuery();
                        verifyCategoriesDataReductionAlgorithm({ window: { count: WindowCountWithoutSeries } });
                        verifyValuesDataReductionAlgorithm({ top: { count: SeriesTopCount } });
                    });
                });
            });

            it('sets the correct DataVolume', () => {
                dataViewMappings = createCompiledDataViewMappings(true);
                customizeQuery();
                for (let dataViewMapping of dataViewMappings) {
                    expect(dataViewMapping.categorical.dataVolume).toEqual(4);
                };
            });

            function customizeQuery(): void {
                ComboChart.customizeQuery({
                    dataViewMappings: dataViewMappings
                });
            }

            function removeSeries(): void {
                if (_.isEmpty(dataViewMappings)) {
                    return;
                }

                for (let dataViewMapping of dataViewMappings) {
                    let categorical = dataViewMapping.categorical;

                    if (!categorical) {
                        return;
                    }

                    let values = <powerbi.data.CompiledDataViewGroupedRoleMapping>dataViewMapping.categorical.values;

                    if (values && values.group && values.group.by) {
                        values.group.by.items = undefined;
                    }
                }
            }

            function verifyCategoriesDataReductionAlgorithm(dataReductionAlgorithm: powerbi.ReductionAlgorithm): void {
                expect(dataViewMappings).not.toBeEmpty();
                for (let dataViewMapping of dataViewMappings) {
                    let actualDataReductionAlgorithm = dataViewMapping.categorical.categories.dataReductionAlgorithm;
                    expect(actualDataReductionAlgorithm).toEqual(dataReductionAlgorithm);
                };
            }

            function verifyValuesDataReductionAlgorithm(groupDataReductionAlgorithm: powerbi.ReductionAlgorithm): void {
                expect(dataViewMappings).not.toBeEmpty();
                for (let dataViewMapping of dataViewMappings) {
                    let actualValues = <powerbi.data.CompiledDataViewGroupedRoleMapping>dataViewMapping.categorical.values;

                    if (!actualValues.group) {
                        return;
                    }

                    let actualDataReductionAlgorithm = actualValues.group.dataReductionAlgorithm;
                    expect(actualDataReductionAlgorithm).toEqual(groupDataReductionAlgorithm);
                };
            }
        });

        it('Sortable roles with categorical axis', () => {
            let objects: DataViewObjects = {
                categoryAxis: {
                    axisType: 'Categorical',
                }
            };
            let dataViewMappings = createCompiledDataViewMappings(true);
            expect(dataViewMappings.length).toBe(2);
            dataViewMappings[0].metadata.objects = objects;

            expect(ComboChart.getSortableRoles({
                dataViewMappings: [dataViewMappings[0]]
            })).toEqual(['Category', 'Y', 'Y2']);
        });

        it('Sortable roles with scalar axis', () => {
            let objects: DataViewObjects = {
                categoryAxis: {
                    axisType: 'Scalar',
                }
            };
            let dataViewMappings = createCompiledDataViewMappings(true, ValueType.fromDescriptor({dateTime: true}), objects);
            expect(dataViewMappings.length).toBe(2);

            expect(ComboChart.getSortableRoles({
                dataViewMappings: [dataViewMappings[0]]
            })).toBeNull();
        });

        function createCompiledDataViewMappings(includeColumnValues: boolean, categoryType?: ValueType, objects?: DataViewObjects): CompiledDataViewMapping[] {
            let categoryItems: powerbi.data.CompiledDataViewRoleItem[] = [{ queryName: 'c1', type: ValueType.fromDescriptor({text: true}) }];
            if (categoryType)
                categoryItems[0].type = categoryType;
            
            let result: CompiledDataViewMapping[] = [{
                metadata: {
                },
                categorical: {
                    categories: {
                        for: {
                            in: { role: 'Category', items: categoryItems }
                        },
                        dataReductionAlgorithm: { window: { count: 100 } },
                    },
                    values: {
                        group: {
                            by: { role: 'Series', items: [{ queryName: 's1' }] },
                            select: [
                                { for: { in: { role: 'Y', items: [{ queryName: 'y1' }] } } },
                            ],
                            dataReductionAlgorithm: { top: { count: 60 } }
                        }
                    }
                }
            }, {
                metadata: {
                },
                categorical: {
                    categories: {
                        for: {
                            in: { role: 'Category', items: categoryItems }
                        },
                        dataReductionAlgorithm: { window: { count: 100 } },
                    },
                    values: {
                        select: [
                            { for: { in: { role: 'Y2', items: [{ queryName: 'y2' }] } } },
                        ],
                    }
                }
                }];

            if (!includeColumnValues) {
                (<powerbi.data.CompiledDataViewRoleForMapping>(<powerbi.data.CompiledDataViewGroupedRoleMapping>result[0].categorical.values).group.select[0]).for.in.items = undefined;
            }
            return result;
        }
    });

    describe("ComboChart DOM validation", () => {
        let visualBuilder: VisualBuilder;
        let element: JQuery;
        let labelDensityMax: number = undefined;

        beforeEach((done) => {
            element = powerbitests.helpers.testDom('500', '500');
            visualBuilder = new VisualBuilder(() => new powerbi.visuals.CartesianChart({
                chartType: powerbi.visuals.CartesianChartType.LineClusteredColumnCombo,
                isScrollable: true,
                tooltipsEnabled: true,
                animator: new powerbi.visuals.WebColumnChartAnimator(),
                behavior: new powerbi.visuals.CartesianChartBehavior([new powerbi.visuals.ColumnChartWebBehavior(), new powerbi.visuals.LineChartWebBehavior()]),
            }));

            done();
        });

        it("Ensure both charts and axis created with two data views - default", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewDefault(),
                    dataViewFactory.buildDataViewInAnotherDomainOneValue(undefined, true)
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

        it("Ensure both charts and axis created with two data views - y axis will merge", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewCustomWithIdentities([[100, 200, 700]]),
                    dataViewFactory.buildDataViewCustomWithIdentities([[90, 220, 670]], true)
                ]
            });

            setTimeout(() => {
                let lineCharts = $(".lineChart").length;
                let columnCharts = $(".columnChart").length;
                let yAxis = $(".y.axis").length;
                let axisChildren1 = $(".y.axis").eq(0).find('g.tick').length;
                let axisChildren2 = $(".y.axis").eq(1).find('g.tick').length;
                let legend = $(".legend").length;

                expect(lineCharts).toBe(1);
                expect(columnCharts).toBe(1);
                expect(yAxis).toBe(2);
                expect(axisChildren1).toBeGreaterThan(0);
                expect(axisChildren2).toBe(0);
                expect(legend).toBe(1);
                expect($(".legend").children.length).toBe(2);

                done();
            }, DefaultWaitForRender);
        });

        it("Ensure empty 1st dataview and populated 2nd has correct axes and lines", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewEmpty(),
                    dataViewFactory.buildDataViewDefault(undefined, true)
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

        it('background image', (done) => {
            let v = powerbi.visuals.plugins.comboChart.create();
            let element = powerbitests.helpers.testDom('400', '300');
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

            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        queryName: 'col1',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                        roles: { Category: true },
                    }, {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: { Y: true },
                    }, {
                        displayName: 'col3',
                        queryName: 'col3',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: { Y: true },
                    }, {
                        displayName: 'col4',
                        queryName: 'col4',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: { Y: true },
                    }]
            };

            let metadata = _.cloneDeep(dataViewMetadata);
            metadata.objects = {
                plotArea: {
                    image: {
                        url: 'data:image/gif;base64,R0lGO',
                        name: 'someName',
                    },
                },
            };
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e']
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000, 480000, 500000],
                            subtotal: 246500
                        }])
                    }
                }]
            });
            setTimeout(() => {
                let backgroundImage = $('.background-image');
                expect(backgroundImage.length).toBeGreaterThan(0);
                expect(backgroundImage.css('height')).toBeDefined();
                expect(backgroundImage.css('width')).toBeDefined();
                expect(backgroundImage.css('margin-left')).toBeDefined();
                expect(backgroundImage.css('margin-top')).toBeDefined();
                done();
            }, DefaultWaitForRender);
        });

        it("Ensure comboCharts clear - with metadata", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewInAnotherDomain(),
                    dataViewFactory.buildDataViewDefault(undefined, true)
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
                        dataViewFactory.buildDataViewEmpty(true)
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
                            dataViewFactory.buildDataViewDefault(undefined, true)
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
                    dataViewFactory.buildDataViewDefault(undefined, true)
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
                    dataViewFactory.buildDataViewDefault(undefined, true)
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
                    dataViewFactory.buildDataViewInAnotherDomain(true, true, true)
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
                    dataViewFactory.buildDataViewDefault(true, true)
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
                    dataViewFactory.buildDataViewInAnotherDomain(true, true, true)
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
                    dataViewFactory.buildDataViewDefault(true, true)
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
                    dataViewFactory.buildDataViewDefault(true, true)
                ]
            });

            setTimeout(() => {
                let yTranslate = parseFloat($(".axisGraphicsContext .x.axis").attr("transform").split(",")[1].replace("(", ""));

                visualBuilder.onDataChanged({
                    dataViews: [
                        dataViewFactory.buildDataViewSuperLongLabels(true),
                        dataViewFactory.buildDataViewSuperLongLabels(true, true)
                    ]
                });

                setTimeout(() => {
                    let newYTranslate = parseFloat($(".axisGraphicsContext .x.axis").attr("transform").split(",")[1].replace("(", ""));
                    expect(yTranslate).toBeGreaterThan(newYTranslate);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it("Ensure scrollbar is shown at smaller viewport dimensions", (done) => {
            visualBuilder = new VisualBuilder(() => new powerbi.visuals.CartesianChart({
                chartType: powerbi.visuals.CartesianChartType.LineClusteredColumnCombo,
                isScrollable: true,
                tooltipsEnabled: true,
                animator: new powerbi.visuals.WebColumnChartAnimator(),
                behavior: new powerbi.visuals.CartesianChartBehavior([new powerbi.visuals.ColumnChartWebBehavior(), new powerbi.visuals.LineChartWebBehavior()]),
            }), "100", "100");

            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewManyCategories(true),
                    dataViewFactory.buildDataViewManyCategories(true, true)
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
            let dataView2 = dataViewFactory.buildDataViewInAnotherDomain(true, true, true);

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
                    dataViewFactory.buildDataViewNegative(true, true)
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
            let staticSeriesDataView = dataViewFactory.buildDataViewDefault(undefined, true);

            visualBuilder.onDataChanged({ dataViews: [dynamicSeriesDataView, staticSeriesDataView] });

            let points = <VisualObjectInstanceEnumerationObject>visualBuilder.visual.enumerateObjectInstances({ objectName: 'legend' });

            setTimeout(() => {
                expect(points.instances.length).toBeGreaterThan(0);
                done();
            }, DefaultWaitForRender);
        });

        it('validate dataPoint enumerateObjectInstances for combochart with column and line', (done) => {
            let dataView1 = dataViewFactory.buildDataForLabelsFirstType(undefined, undefined, undefined, undefined, true);
            let dataView2 = dataViewFactory.buildDataForLabelsFirstType(undefined, undefined, undefined, undefined, true, true);

            visualBuilder.onDataChanged({ dataViews: [dataView1, dataView2] });

            let dataPoints = <VisualObjectInstanceEnumerationObject>visualBuilder.visual.enumerateObjectInstances({ objectName: 'dataPoint' });

            setTimeout(() => {
                expect(dataPoints.instances.length).toBe(3);
                expect(dataPoints.instances[0].properties["fill"]).toBeDefined();
                expect(dataPoints.instances[1].properties["defaultColor"]).toBeDefined();
                expect(dataPoints.instances[1].properties["showAllDataPoints"]).toBeDefined();
                expect(dataPoints.instances[2].properties["fill"]).toBeDefined();
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
                    dataViewFactory.buildDataViewNumber(objects, true)]
            });

            setTimeout(() => {
                let labels = $(".x.axis").children(".tick").find("text");

                //Verify begin&end labels
                expect(helpers.findElementText($(labels).first())).toBe("0");
                expect(helpers.findElementTitle($(labels).last())).toBe("1,000");
                //verify title
                expect(helpers.findElementTitle($(labels).first())).toBe("0");
                expect(helpers.findElementTitle($(labels).last())).toBe("1,000");

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
                    dataViewFactory.buildDataViewNumber(objects, true)]
            });

            setTimeout(() => {
                var ylabels = $(".axisGraphicsContext .y.axis").first().find(".tick").find("text");

                //Verify begin&end labels
                expect(helpers.findElementText($(ylabels).first())).toBe("0.00000K");
                expect(helpers.findElementText($(ylabels).last())).toBe("1,000.00000K");
                //Verify begin&end tiles
                expect(helpers.findElementTitle($(ylabels).first())).toBe("0.00000K");
                expect(helpers.findElementTitle($(ylabels).last())).toBe("1,000.00000K");

                var y1labels = $(".axisGraphicsContext .y.axis").last().find(".tick").find("text");

                //Verify begin&end labels
                expect(helpers.findElementText($(y1labels).first())).toBe("0.00000K");
                expect(helpers.findElementText($(y1labels).last())).toBe("1,000.00000K");
                //Verify begin&end tiles
                expect(helpers.findElementTitle($(y1labels).first())).toBe("0.00000K");
                expect(helpers.findElementTitle($(y1labels).last())).toBe("1,000.00000K");

                var xlabels = $(".x.axis").children(".tick").find("text");

                //Verify begin&end labels
                expect(helpers.findElementText($(xlabels).first())).toBe("0.00000K");
                expect(helpers.findElementText($(xlabels).last())).toBe("100.00000K");
                //Verify begin&end tiles
                expect(helpers.findElementTitle($(xlabels).first())).toBe("0.00000K");
                expect(helpers.findElementTitle($(xlabels).last())).toBe("100.00000K");
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

            let dataView = dataViewFactory.buildDataViewCustomSingleColumn(objects, [[4000, 6000, 10000]], true);

            let dataViewAnotherDomain = dataViewFactory.buildDataViewCustom(objects, [[1], [10], [20]]);

            visualBuilder.onDataChanged({ dataViews: [dataViewAnotherDomain, dataView] });
            setTimeout(() => {
                let axisLabels = $(".axisGraphicsContext .y.axis").first().find(".tick").find("text");

                expect(helpers.findElementText($(axisLabels).first())).toBe("0K");
                expect(helpers.findElementText($(axisLabels).last())).toBe("10K");
                //verify title
                expect(helpers.findElementTitle($(axisLabels).first())).toBe("0K");
                expect(helpers.findElementTitle($(axisLabels).last())).toBe("10K");

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

            let dataView = dataViewFactory.buildDataViewCustomSingleColumn(objects, [[5, 15, 25]], true);

            let dataViewAnotherDomain = dataViewFactory.buildDataViewCustom(objects, [[1], [10], [30]]);

            visualBuilder.onDataChanged({ dataViews: [dataViewAnotherDomain, dataView] });
            setTimeout(() => {
                let axisLabels = $(".axisGraphicsContext .y.axis").first().find(".tick").find("text");

                expect(helpers.findElementText($(axisLabels).first())).toBe("0");
                expect(helpers.findElementTitle($(axisLabels).last())).toBe("30");

                //check titles
                expect(helpers.findElementText($(axisLabels).first())).toBe("0");
                expect(helpers.findElementTitle($(axisLabels).last())).toBe("30");

                axisLabels = $(".axisGraphicsContext .y.axis").last().find(".tick").find("text");

                expect(helpers.findElementText($(axisLabels).first())).toBe("5");
                expect(helpers.findElementText($(axisLabels).last())).toBe("25");
                //check titles
                expect(helpers.findElementTitle($(axisLabels).first())).toBe("5");
                expect(helpers.findElementTitle($(axisLabels).last())).toBe("25");

                done();
            }, DefaultWaitForRender);
        });

        it("Verify force to zero is not set for a negative domain range", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewInAnotherDomain(),
                    dataViewFactory.buildDataViewCustom(undefined, [[-2000, -6000, -7000]], undefined, true)]
            });

            setTimeout(() => {
                let axisLabels = $(".axisGraphicsContext .y.axis").last().find(".tick").find("text");

                //Verify begin&end axis labels
                expect(helpers.findElementText($(axisLabels).first())).toBe("-7K");
                expect(helpers.findElementText($(axisLabels).last())).toBe("-2K");

                //Verify begin&end axis titles
                expect(helpers.findElementTitle($(axisLabels).first())).toBe("-7K");
                expect(helpers.findElementTitle($(axisLabels).last())).toBe("-2K");

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
                    dataViewFactory.buildDataViewInAnotherDomainOneValue(objects, true)]
            });

            setTimeout(() => {
                let textSelector: string = ".yAxisLabel";
                let lineAxisLabel: number = $(textSelector).length;

                expect(lineAxisLabel).toBe(2);
                expect(helpers.findElementText($(textSelector).first())).toBe("col2, col3 and col4");
                expect(helpers.findElementText($(textSelector).last())).toBe("col2");

                //check titles
                expect(helpers.findElementTitle($(textSelector).first())).toBe("col2, col3 and col4");
                expect(helpers.findElementTitle($(textSelector).last())).toBe("col2");

                done();
            }, DefaultWaitForRender);
        });

        it("Check font size default in the combo chart", (done) => {
            visualBuilder.initVisual();

            let dataView1 = dataViewFactory.buildDataForLabelsFirstType();
            let dataView2 = dataViewFactory.buildDataForLabelsSecondType(undefined, undefined, undefined, undefined, labelDensityMax, undefined, true);

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
            let dataView2 = dataViewFactory.buildDataForLabelsSecondType(undefined, undefined, undefined, 12, labelDensityMax, undefined, true);

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
                    dataViewFactory.buildDataViewInAnotherDomainOneValue(objects, true)]
            });

            setTimeout(() => {
                let textSelector: string = ".yAxisLabel";
                let lineAxisLabel = $(textSelector).length;

                expect(lineAxisLabel).toBe(1);
                expect(helpers.findElementText($(textSelector).first())).toBe("col2");

                //check titles
                expect(helpers.findElementTitle($(textSelector).first())).toBe("col2");

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
            let staticSeriesDataView = dataViewFactory.buildDataViewDefault(undefined, true);

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

            let dataView2 = dataViewFactory.buildDataViewCustomWithIdentities([[100, 200, 700], [10000, 20000, 70000]], true);

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

            let dataView2 = dataViewFactory.buildDataForLabelsSecondType(undefined, undefined, undefined, undefined, labelDensityMax, undefined, true);

            visualBuilder.onDataChanged({ dataViews: [dataView1, dataView2] });

            setTimeout(() => {
                expect($(".labelGraphicsContext")).toBeInDOM();
                expect($(".labelGraphicsContext .label").length).toBe(6);

                done();
            }, DefaultWaitForRender);
        });

        it("Ensure line layer doesn't inherit colors from bar layer", (done) => {
            let dataViews: powerbi.DataView[] = [
                dataViewFactory.buildDataViewDefault(),
                dataViewFactory.buildDataViewInAnotherDomainOneValue(undefined, true)
            ];

            dataViews[0].metadata.columns[0].objects = {
                dataPoint: {
                    fill: {
                        solid: {
                            color: '#000001'
                        }
                    }
                }
            };

            visualBuilder.onDataChanged({
                dataViews: dataViews
            });

            setTimeout(() => {
                let highlightPoints = $(".cat .point").length;
                expect(highlightPoints).toBe(0);

                done();
            }, DefaultWaitForRender);
        });

        describe('trend lines', () => {
            describe('one layer', () => {
                it('combined series', (done) => {
                    let trendLineColor = '#FF0000';
                    let objects: DataViewObjects = {
                        trend: {
                            show: true,
                            lineColor: {
                                solid: {
                                    color: trendLineColor,
                                }
                            },
                            transparency: 20,
                            style: lineStyle.dotted,
                            combineSeries: true,
                        }
                    };

                    let dataViews = new helpers.TrendLineBuilder({ combineSeries: true }).withObjects(objects).buildDataViews();

                    visualBuilder.onDataChanged({
                        dataViews: dataViews,
                    });

                    setTimeout(() => {
                        let trendLines = $('.trend-line');

                        helpers.verifyTrendLines(trendLines, [{
                            color: trendLineColor,
                            opacity: 0.8,
                            style: lineStyle.dotted,
                        }]);

                        done();
                    }, DefaultWaitForRender);
                });

                it('separate series', (done) => {
                    let objects: DataViewObjects = {
                        trend: {
                            show: true,
                            transparency: 20,
                            style: lineStyle.dotted,
                            combineSeries: false,
                        }
                    };

                    let dataViews = new helpers.TrendLineBuilder({ combineSeries: false }).withObjects(objects).buildDataViews();

                    visualBuilder.onDataChanged({
                        dataViews: dataViews,
                    });

                    setTimeout(() => {
                        let trendLines = $('.trend-line');
                        let columnSeries = $('.columnChart .series');

                        helpers.verifyTrendLines(trendLines, [
                            {
                                color: TrendLineHelper.darkenTrendLineColor(columnSeries.eq(0).css('fill')),
                                opacity: 0.8,
                                style: lineStyle.dotted,
                            }, {
                                color: TrendLineHelper.darkenTrendLineColor(columnSeries.eq(1).css('fill')),
                                opacity: 0.8,
                                style: lineStyle.dotted,
                            }
                        ]);

                        done();
                    }, DefaultWaitForRender);
                });
            });

            describe('two layers', () => {
                it('combined series', (done) => {
                    let trendLineColor = '#FF0000';
                    let objects: DataViewObjects = {
                        trend: {
                            show: true,
                            lineColor: {
                                solid: {
                                    color: trendLineColor,
                                }
                            },
                            transparency: 20,
                            style: lineStyle.dotted,
                            combineSeries: true,
                        }
                    };

                    let [layer1, regression1] = new helpers.TrendLineBuilder({ combineSeries: true, dynamicSeries: true }).withObjects(objects).buildDataViews();
                    let [layer2, regression2] = new helpers.TrendLineBuilder({ combineSeries: true, dynamicSeries: false, yRole: 'Y2' }).withObjects(objects).buildDataViews();

                    visualBuilder.onDataChanged({
                        dataViews: [layer1, layer2, regression1, regression2],
                    });

                    setTimeout(() => {
                        let trendLines = $('.trend-line');

                        helpers.verifyTrendLines(trendLines, [
                            {
                                color: trendLineColor,
                                opacity: 0.8,
                                style: lineStyle.dotted,
                            }, {
                                color: trendLineColor,
                                opacity: 0.8,
                                style: lineStyle.dotted,
                            }
                        ]);

                        done();
                    }, DefaultWaitForRender);
                });

                it('separate series', (done) => {
                    let objects: DataViewObjects = {
                        trend: {
                            show: true,
                            transparency: 20,
                            style: lineStyle.dotted,
                            combineSeries: false,
                        }
                    };

                    let [layer1, regression1] = new helpers.TrendLineBuilder({ combineSeries: false, dynamicSeries: true }).withObjects(objects).buildDataViews();
                    let [layer2, regression2] = new helpers.TrendLineBuilder({ combineSeries: false, dynamicSeries: false, yRole: 'Y2' }).withObjects(objects).buildDataViews();

                    visualBuilder.onDataChanged({
                        dataViews: [layer1, layer2, regression1, regression2],
                    });

                    setTimeout(() => {
                        let trendLines = $('.trend-line');
                        let columnSeries = $('.columnChart .series');
                        let lines = $('.lineChart .line');

                        helpers.verifyTrendLines(trendLines, [
                            {
                                color: TrendLineHelper.darkenTrendLineColor(columnSeries.eq(0).css('fill')),
                                opacity: 0.8,
                                style: lineStyle.dotted,
                            }, {
                                color: TrendLineHelper.darkenTrendLineColor(columnSeries.eq(1).css('fill')),
                                opacity: 0.8,
                                style: lineStyle.dotted,
                            }, {
                                color: TrendLineHelper.darkenTrendLineColor(lines.eq(0).css('stroke')),
                                opacity: 0.8,
                                style: lineStyle.dotted,
                            }, {
                                color: TrendLineHelper.darkenTrendLineColor(lines.eq(1).css('stroke')),
                                opacity: 0.8,
                                style: lineStyle.dotted,
                            }
                        ]);

                        done();
                    }, DefaultWaitForRender);
                });
            });
        });

        describe('Legend', () => {
            it('Items with duplicate identities on different layers each have a legend item', (done) => {
                visualBuilder.initVisual();
                
                let dataView1 = dataViewFactory.buildDataViewCustom(undefined, [[100, 200, 700], [1000, 2000, 7000]], ["a", "b"]);

                let dataView2 = dataViewFactory.buildDataViewCustom(undefined, [[100, 200, 700]], ["a"], true);

                // Both layers have static series
                visualBuilder.onDataChanged({ dataViews: [dataView1, dataView2] });

                setTimeout(() => {
                    let legend = visualBuilder.element.find('.legend');
                    let legendItems = legend.find('.legendItem');

                    expect(legendItems.length).toBe(3);

                    done();
                }, DefaultWaitForRender);
            });
        });
    });

    describe("Dashboard ComboChart DOM validation", () => {
        let visualBuilder: VisualBuilder;
        let element: JQuery;

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            visualBuilder = new VisualBuilder(() => new powerbi.visuals.CartesianChart({
                chartType: powerbi.visuals.CartesianChartType.LineClusteredColumnCombo,
                isScrollable: false,
                tooltipsEnabled: true,
                animator: undefined,
                behavior: undefined,
            }));
        });

        it("Ensure interactive line is exist on Dashboard tiles", (done) => {
            visualBuilder.onDataChanged({
                dataViews: [
                    dataViewFactory.buildDataViewDefault(),
                    dataViewFactory.buildDataViewInAnotherDomainOneValue(undefined, true)
                ]
            });

            setTimeout(() => {
                let interactiveLine = $(".interactivity-line");
                expect(!_.isEmpty(interactiveLine)).toBeTruthy();
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
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                    roles: { Category: true },
                },
                {
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    groupName: 'group',
                    roles: { Y: true },
                },
            ],
        };

        beforeEach(() => {
            dataColors = new powerbi.visuals.DataColorPalette(colors);
            sharedPalette = new powerbi.visuals.SharedColorPalette(dataColors);
            element = powerbitests.helpers.testDom('400', '300');
            v = powerbi.visuals.plugins.comboChart.create();
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

        constructor(visualCreateFn: () => powerbi.IVisual, width: string = "400", height: string = "400") {
            this._visual = visualCreateFn();

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
            this.buildValueIdentityFields();

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

        private valueIdentityFields: any[] = null;

        private buildValueIdentityFields() {
            this.valueIdentityFields = [powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col5' })];
        }

        private buildValueColumns() {
            if (this.columnIdentityRef !== undefined &&
                this.sourceValueColumn !== undefined) {
                return DataViewTransform.createValueColumns(
                    this.categoricalValues,
                    [this.columnIdentityRef],
                    this.sourceValueColumn);
            }

            let valueColumns = DataViewTransform.createValueColumns(this.categoricalValues, this.valueIdentityFields);
            if (valueColumns.grouped().length > 1)
                valueColumns.source = this.columns[4];

            return valueColumns;
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
            { displayName: "col1", queryName: "col1", index: 0, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text), roles: { Category: true } },
            { displayName: "col2", queryName: "col2", isMeasure: true, index: 1, groupName: "a", type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y: true } },
            { displayName: "col3", queryName: "col3", isMeasure: true, index: 2, groupName: "b", type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y: true } },
            { displayName: "col4", queryName: "col4", isMeasure: true, index: 3, groupName: "c", type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y: true } },
            { displayName: "col2", queryName: "col2", isMeasure: true, index: 4, groupName: "d", type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y: true } },
            { displayName: "col3", queryName: "col3", isMeasure: true, index: 5, groupName: "e", type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y: true } },
            { displayName: "col4", queryName: "col4", isMeasure: true, index: 6, groupName: "f", type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y: true } },
            { displayName: "col5", queryName: "col5", index: 4, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text), roles: { Series: true } },
        ];

        let columnsNumber = [
            { displayName: "col1", queryName: "col1", type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
            { displayName: "col2", queryName: "col2", isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y: true } },
            { displayName: "col3", queryName: "col3", isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y: true } },
            { displayName: "col4", queryName: "col4", isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y: true } }
        ];

        let columnsY2 = [
            { displayName: "col1", queryName: "col1", index: 0, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text), roles: { Category: true } },
            { displayName: "col2", queryName: "col2", isMeasure: true, index: 1, groupName: "a", type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y2: true } },
            { displayName: "col3", queryName: "col3", isMeasure: true, index: 2, groupName: "b", type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y2: true } },
            { displayName: "col4", queryName: "col4", isMeasure: true, index: 3, groupName: "c", type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y2: true } },
            { displayName: "col2", queryName: "col2", isMeasure: true, index: 4, groupName: "d", type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y2: true } },
            { displayName: "col3", queryName: "col3", isMeasure: true, index: 5, groupName: "e", type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y2: true } },
            { displayName: "col4", queryName: "col4", isMeasure: true, index: 6, groupName: "f", type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y2: true } },
            { displayName: "col5", queryName: "col5", index: 4, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text), roles: { Series: true } },
        ];

        let columnsNumberY2 = [
            { displayName: "col1", queryName: "col1", type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
            { displayName: "col2", queryName: "col2", isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y2: true } },
            { displayName: "col3", queryName: "col3", isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y2: true } },
            { displayName: "col4", queryName: "col4", isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y2: true } }
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

        export function buildDataViewDefault(isGeneral = false, useY2 = false): powerbi.DataView {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            setGeneral(dataViewBuilder, isGeneral);

            if (useY2) {
                dataViewBuilder.columns = columnsY2;
            }
            else {
                dataViewBuilder.columns = columns;
            }

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

        export function buildDataViewCustom(objects, values: any[], identities: any[] = undefined, useY2: boolean = false): powerbi.DataView {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            dataViewBuilder.objects = objects;

            if (useY2) {
                dataViewBuilder.columns = columnsY2;
            }
            else {
                dataViewBuilder.columns = columns;
            }

            if (identities !== undefined) {
                dataViewBuilder.isBuildCategoryIdentities = true;
                dataViewBuilder.identities = identities;
            }

            dataViewBuilder.values = values;

            dataViewBuilder.categoriesValues = categoriesValues;

            return build(dataViewBuilder);
        }

        export function buildDataViewCustomSingleColumn(objects, values: any[], useY2: boolean = false): powerbi.DataView {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            dataViewBuilder.objects = objects;
            if (useY2) {
                dataViewBuilder.columns = columnsY2;
            }
            else {
                dataViewBuilder.columns = columns;
            }
            dataViewBuilder.categoriesColumns = [useY2 ? columnsY2[1] : columns[1]];

            dataViewBuilder.values = values;

            dataViewBuilder.categoriesValues = categoriesValues;

            return build(dataViewBuilder);
        }

        export function buildDataViewCustomWithIdentities(values: any[], useY2: boolean = false): powerbi.DataView {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            if (useY2) {
                dataViewBuilder.columns = columnsY2;
            }
            else {
                dataViewBuilder.columns = columns;
            }
            let columnsToUse = useY2 ? columnsY2 : columns;
            dataViewBuilder.categoriesColumns = [columnsToUse[0], columnsToUse[1], columnsToUse[3]];

            dataViewBuilder.values = values;

            dataViewBuilder.categoriesValues = categoriesValues;

            dataViewBuilder.isBuildCategoryIdentities = true;
            dataViewBuilder.identities = ["a", "b"];

            return build(dataViewBuilder);
        }

        export function buildDataViewInAnotherDomainOneValue(objects: any = undefined, useY2: boolean = false): powerbi.DataView {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            dataViewBuilder.objects = objects;

            if (useY2) {
                dataViewBuilder.columns = columnsY2;
            }
            else {
                dataViewBuilder.columns = columns;
            }

            dataViewBuilder.values = [
                [1]
            ];

            dataViewBuilder.categoriesValues = categoriesValues;

            return build(dataViewBuilder);
        }

        export function buildDataViewEmpty(useY2: boolean = false): powerbi.DataView {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            if (useY2) {
                dataViewBuilder.columns = columnsY2;
            }
            else {
                dataViewBuilder.columns = columns;
            }
            dataViewBuilder.values = [];
            dataViewBuilder.categoriesValues = [];

            return build(dataViewBuilder);
        }

        export function buildDataViewInAnotherDomain(isGeneral = false, objects: any = undefined, useY2: boolean = false): powerbi.DataView {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            dataViewBuilder.objects = objects;

            setGeneral(dataViewBuilder, isGeneral);

            if (useY2) {
                dataViewBuilder.columns = columnsY2;
            }
            else {
                dataViewBuilder.columns = columns;
            }
            dataViewBuilder.values = [[1], [10], [20]];
            dataViewBuilder.categoriesValues = categoriesValues;

            return build(dataViewBuilder);
        }

        export function buildDataViewSuperLongLabels(isGeneral = false, useY2: boolean = false): powerbi.DataView {    
            // must share the same values as the general dataView, only category labels should change.
            let dataView: powerbi.DataView = buildDataViewDefault(isGeneral, useY2);

            dataView.categorical.categories[0].values = [
                "This is a pretty long label I think",
                "This is a pretty long label I thought",
                "This is a pretty long label I should think"
            ];

            return dataView;
        }

        export function buildDataViewManyCategories(isGeneral = false, useY2: boolean = false): powerbi.DataView {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            setGeneral(dataViewBuilder, isGeneral);

            if (useY2) {
                dataViewBuilder.columns = columnsY2;
            }
            else {
                dataViewBuilder.columns = columns;
            }
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

        export function buildDataViewNegative(isGeneral = false, useY2: boolean = false) {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            setGeneral(dataViewBuilder, isGeneral);

            if (useY2) {
                dataViewBuilder.columns = columnsY2;
            }
            else {
                dataViewBuilder.columns = columns;
            }
            dataViewBuilder.categoriesValues = categoriesValues;
            dataViewBuilder.values = [
                [-100, -200, 700],
                [1000, -2000, 7000],
                [10000, 20000, -70000]
            ];

            return build(dataViewBuilder);
        }

        function setLabels(dataViewBuilder: DataViewBuilder, color: any, labelDisplayUnits?: number, labelPrecision?: number, labelFontSize?: number, labelDensity?: number) {
            let objects: any = {};

            objects.labels = {
                show: true
            };

            if (color !== undefined) {
                objects.labels.color = color;
            }

            if (labelDisplayUnits !== undefined) {
                objects.labels.labelDisplayUnits = labelDisplayUnits;
            }

            if (labelPrecision !== undefined) {
                objects.labels.labelPrecision = labelPrecision;
            }

            if (labelFontSize !== undefined) {
                objects.labels.fontSize = labelFontSize;
            }

            if (labelDensity !== undefined) {
                objects.labels.labelDensity = labelDensity;
            }

            dataViewBuilder.objects = objects;
        }

        export function buildDataForLabelsFirstType(color?: any, labelDisplayUnits?: number, labelPrecision?: number, fontSize?: number, showAll?: boolean, useY2: boolean = false) {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            setLabels(dataViewBuilder, color, labelDisplayUnits, labelPrecision, fontSize);

            if(showAll !== undefined){
                let showAllProp = powerbi.visuals.columnChartProps.dataPoint.showAllDataPoints;
                let objectName = showAllProp.objectName;
                let showAllObjects = dataViewBuilder.objects[objectName] = dataViewBuilder.objects[objectName] || {};
                showAllObjects[showAllProp.propertyName] = showAll;
            }

            if (useY2) {
                dataViewBuilder.columns = columnsY2;
            }
            else {
                dataViewBuilder.columns = columns;
            }
            dataViewBuilder.categoriesValues = ["a", "b", "c", "d", "e"];
            dataViewBuilder.values = [[50, 40, 150, 200, 500]];

            return build(dataViewBuilder);
        }

        export function buildDataForLabelsSecondType(color?: any, labelDisplayUnits?: number, labelPrecision?: number, fontSize?: number, labelDensity?: number, showAll?: boolean, useY2: boolean = false) {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            setLabels(dataViewBuilder, color, labelDisplayUnits, labelPrecision, fontSize, labelDensity);
            
            if(showAll !== undefined){
                let showAllProp = powerbi.visuals.columnChartProps.dataPoint.showAllDataPoints;
                let objectName = showAllProp.objectName;
                let showAllObjects = dataViewBuilder.objects[objectName] = dataViewBuilder.objects[objectName] || {};
                showAllObjects[showAllProp.propertyName] = showAll;
            }

            if (useY2) {
                dataViewBuilder.columns = columnsY2;
            }
            else {
                dataViewBuilder.columns = columns;
            }
            dataViewBuilder.categoriesValues = ["a", "b", "c", "d", "e"];
            dataViewBuilder.values = [[200, 100, 300, 250, 400]];

            return build(dataViewBuilder);
        }

        export function buildDataViewInvalid(invalidValue, useY2: boolean = false) {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            if (useY2) {
                dataViewBuilder.columns = columnsY2;
            }
            else {
                dataViewBuilder.columns = columns;
            }
            dataViewBuilder.categoriesValues = [["John Domo"]];
            dataViewBuilder.values = [[invalidValue]];

            return build(dataViewBuilder);
        }

        export function buildDataViewNumber(objects: any = null, useY2: boolean = false) {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            dataViewBuilder.objects = objects;

            if (useY2) {
                dataViewBuilder.columns = columnsNumberY2;
            }
            else {
                dataViewBuilder.columns = columnsNumber;
            }
            dataViewBuilder.categoriesValues = [0, 500, 1000];
            dataViewBuilder.values = [
                [100, 200, 700],
                [1000, 2000, 7000],
                [10000, 20000, 70000]];

            dataViewBuilder.update();

            return dataViewBuilder.build();
        }

        export function buildDataViewDynamicSeries(useY2: boolean = false) {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            dataViewBuilder.columnIdentityRef = powerbi.data.SQExprBuilder.fieldDef({
                schema: "s",
                entity: "e",
                column: "series"
            });

            if (useY2) {
                dataViewBuilder.columns = columnsY2;
            }
            else {
                dataViewBuilder.columns = columns;
            }
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

        export function buildDataViewSingleMeasure(useY2: boolean = false) {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            let measureColumn: powerbi.DataViewMetadataColumn = {
                displayName: 'sales',
                queryName: 'selectSales',
                isMeasure: true,
                type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer),
                objects: { general: { formatString: '$0' } },
                roles: { Y: true },
            };
            if (useY2) {
                measureColumn.roles = { Y2: true };
            }

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
