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
    import AxisScale = powerbi.visuals.axisScale;
    import CompiledDataViewMapping = powerbi.data.CompiledDataViewMapping;
    import CartesianChartType = powerbi.visuals.CartesianChartType;
    import DataViewObjects = powerbi.DataViewObjects;
    import DataViewPivotCategorical = powerbi.data.DataViewPivotCategorical;
    import ScalarKeys = powerbi.visuals.ScalarKeys;
    import DataViewTransform = powerbi.data.DataViewTransform;
    import LineChart = powerbi.visuals.LineChart;
    import lineChartProps = powerbi.visuals.lineChartProps;
    import lineStyle = powerbi.visuals.lineStyle;
    import SVGUtil = powerbi.visuals.SVGUtil;
    import SelectionId = powerbi.visuals.SelectionId;
    import ValueType = powerbi.ValueType;
    import PrimitiveType = powerbi.PrimitiveType;
    import Helpers = powerbitests.helpers;
    import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
    import PixelConverter = jsCommon.PixelConverter;
    import LabelParentRect = powerbi.LabelParentRect;
    import TrendLineHelper = powerbi.visuals.TrendLineHelper;
    import buildSelectorForColumn = powerbitests.helpers.buildSelectorForColumn;

    let labelColor = powerbi.visuals.dataLabelUtils.defaultLabelColor;

    powerbitests.mocks.setLocale();

    describe("LineChart Dataview Validation", () => {
        let blankCategoryValue = '(Blank)';
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
        let dataViewMetadata: powerbi.DataViewMetadata = {
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
                    roles: { Y: true },
                },
                {
                    displayName: 'col3',
                    queryName: 'col3',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true },
                },
                {
                    displayName: 'col4',
                    queryName: 'col4',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true },
                },
                {
                    // for secondary grouping (legend/series)
                    displayName: 'col5',
                    queryName: 'col5',
                    isMeasure: false,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                    roles: { Series: true },
                },
            ]
        };

        let tooltipColumn: powerbi.DataViewMetadataColumn = {
            displayName: 'tooltipDisplayName',
            queryName: 'tooltipQueryName',
            isMeasure: true,
            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
            roles: { Tooltips: true },
        };

        it('LineChart registered capabilities', () => {
            expect(powerbi.visuals.plugins.lineChart.capabilities).toBe(powerbi.visuals.lineChartCapabilities);
        });

        it('LineChart registered customizeQuery', () => {
            expect(powerbi.visuals.plugins.lineChart.customizeQuery).toBe(LineChart.customizeQuery);
        });

        it('Capabilities should include dataViewMappings', () => {
            expect(powerbi.visuals.lineChartCapabilities.dataViewMappings).toBeDefined();
        });

        it('Capabilities should include dataRoles', () => {
            expect(powerbi.visuals.lineChartCapabilities.dataRoles).toBeDefined();
        });

        it('Capabilities should not suppressDefaultTitle', () => {
            expect(powerbi.visuals.lineChartCapabilities.suppressDefaultTitle).toBeUndefined();
        });

        it('FormatString property should match calculated', () => {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(powerbi.visuals.lineChartCapabilities.objects)).toEqual(powerbi.visuals.lineChartProps.general.formatString);
        });

        describe('CustomizeQuery', () => {
            const WindowCountWithoutSeries: number = 1000;
            const WindowCountWithSeries: number = 100;
            const SeriesTopCount: number = 60;

            let objects: DataViewObjects;
            let dataViewMapping: CompiledDataViewMapping;

            beforeEach(() => {
                objects = {
                    categoryAxis: {}
                };
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
                        dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime), objects);
                    });

                    it('with series sets the correct dataReductionAlgorithms', () => {
                        customizeQuery();
                        expect(getCategoriesDataReductionAlgorithm()).toEqual({ sample: {} });
                        expect(getValuesDataReductionAlgorithm()).toEqual({ top: {} });
                    });

                    it('without series sets the correct dataReductionAlgorithms', () => {
                        removeSeries();
                        customizeQuery();
                        expect(getCategoriesDataReductionAlgorithm()).toEqual({ sample: {} });
                        expect(getValuesDataReductionAlgorithm()).toEqual({ top: {} });
                    });
                });

                describe('with non-scalar type', () => {
                    beforeEach(() => {
                        dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text), objects);
                    });

                    it('with series sets the correct dataReductionAlgorithms', () => {
                        customizeQuery();
                        expect(getCategoriesDataReductionAlgorithm()).toEqual({ window: { count: WindowCountWithSeries } });
                        expect(getValuesDataReductionAlgorithm()).toEqual({ top: { count: SeriesTopCount } });
                    });

                    it('without series sets the correct dataReductionAlgorithms', () => {
                        removeSeries();
                        customizeQuery();
                        expect(getCategoriesDataReductionAlgorithm()).toEqual({ window: { count: WindowCountWithoutSeries } });
                        expect(getValuesDataReductionAlgorithm()).toEqual({ top: { count: SeriesTopCount } });
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
                        dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime), objects);
                    });

                    it('with series sets the correct dataReductionAlgorithms', () => {
                        customizeQuery();
                        expect(getCategoriesDataReductionAlgorithm()).toEqual({ sample: {} });
                        expect(getValuesDataReductionAlgorithm()).toEqual({ top: {} });
                    });

                    it('without series sets the correct dataReductionAlgorithms', () => {
                        removeSeries();
                        customizeQuery();
                        expect(getCategoriesDataReductionAlgorithm()).toEqual({ sample: {} });
                        expect(getValuesDataReductionAlgorithm()).toEqual({ top: {} });
                    });
                });

                describe('with non-scalar type', () => {
                    beforeEach(() => {
                        dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text), objects);
                    });

                    it('with series sets the correct dataReductionAlgorithms', () => {
                        customizeQuery();
                        expect(getCategoriesDataReductionAlgorithm()).toEqual({ window: { count: WindowCountWithSeries } });
                        expect(getValuesDataReductionAlgorithm()).toEqual({ top: { count: SeriesTopCount } });
                    });

                    it('without series sets the correct dataReductionAlgorithms', () => {
                        removeSeries();
                        customizeQuery();
                        expect(getCategoriesDataReductionAlgorithm()).toEqual({ window: { count: WindowCountWithoutSeries } });
                        expect(getValuesDataReductionAlgorithm()).toEqual({ top: { count: SeriesTopCount } });
                    });
                });
            });

            it('uses scalar key if axis type is undefined', () => {
                let scalarKeyUsed = runCustomizeQueryWithForcedScalarKey(undefined);
                expect(scalarKeyUsed).toBe(true);
            });

            it('uses scalar key if axis type is scalar', () => {
                let scalarKeyUsed = runCustomizeQueryWithForcedScalarKey(AxisType.scalar);
                expect(scalarKeyUsed).toBe(true);
            });

            it('does not use scalar key if axis type is categorical', () => {
                let scalarKeyUsed = runCustomizeQueryWithForcedScalarKey(AxisType.categorical);
                expect(scalarKeyUsed).toBe(false);
            });

            // Runs the line chart by forcing the scalar key property to true and returns whether customizeQuery decided to use it
            function runCustomizeQueryWithForcedScalarKey(axisType: string): boolean {
                let objects: DataViewObjects = {
                    categoryAxis: {
                        axisType: axisType
                    }
                };

                let dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime), objects);

                // Force scalar key support
                let dataViewCategories = <powerbi.data.CompiledDataViewRoleForMappingWithReduction>dataViewMapping.categorical.categories;
                let compiledRoleItem = dataViewCategories.for.in.items[0];
                compiledRoleItem.hasScalarKey = true;

                LineChart.customizeQuery({
                    dataViewMappings: [dataViewMapping]
                });

                return compiledRoleItem.scalarKeyMinProperty === powerbi.visuals.lineChartProps.scalarKey.scalarKeyMin;
            }

            function customizeQuery(): void {
                LineChart.customizeQuery({
                    dataViewMappings: [dataViewMapping]
                });
            }

            function removeSeries(): CompiledDataViewMapping {
                let values = <powerbi.data.CompiledDataViewGroupedRoleMapping>dataViewMapping.categorical.values;
                values.group.by.items = undefined;
                return dataViewMapping;
            }

            function getCategoriesDataReductionAlgorithm(): powerbi.ReductionAlgorithm {
                return dataViewMapping.categorical.categories.dataReductionAlgorithm;
            }

            function getValuesDataReductionAlgorithm(): powerbi.ReductionAlgorithm {
                let values = <powerbi.data.CompiledDataViewGroupedRoleMapping>dataViewMapping.categorical.values;
                return values.group.dataReductionAlgorithm;
            }
        });

        it('Sortable roles with scalar axis', () => {
            let objects: DataViewObjects = {
                categoryAxis: {
                    axisType: 'Scalar',
                }
            };
            let dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime), objects);

            expect(LineChart.getSortableRoles({
                dataViewMappings: [dataViewMapping]
            })).toBeNull();
        });

        it('Sortable roles with categorical axis', () => {
            let objects: DataViewObjects = {
                categoryAxis: {
                    axisType: 'Categorical',
                }
            };
            let dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime), objects);

            expect(LineChart.getSortableRoles({
                dataViewMappings: [dataViewMapping]
            })).toEqual(['Category', 'Y']);
        });

        function createCompiledDataViewMapping(categoryType: ValueType, objects?: DataViewObjects): CompiledDataViewMapping {
            let categoryItems: powerbi.data.CompiledDataViewRoleItem[] = [];
            if (categoryType)
                categoryItems.push({ queryName: 'c1', type: categoryType });

            return {
                metadata: {
                    objects: objects
                },
                categorical: {
                    categories: {
                        for: {
                            in: { role: 'Category', items: categoryItems }
                        },
                        dataReductionAlgorithm: { window: { count: 100 } }
                    },
                    values: {
                        group: {
                            by: { role: 'Series', items: [{ queryName: 's1', type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) }] },
                            select: [
                                { for: { in: { role: 'Y', items: [{ queryName: 'y1', type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer) }] } } }
                            ],
                            dataReductionAlgorithm: { top: { count: 60 } }
                        }
                    }
                }
            };
        }

        it('Check convert empty + fill color', () => {
            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    dataViewMetadata.columns[0],
                    powerbi.Prototype.inherit(dataViewMetadata.columns[1], c => c.objects = { dataPoint: { fill: { solid: { color: '#41BEE0' } } } }),
                ]
            };
            let dataView: powerbi.DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: [],
                        objects: [{ dataPoint: { fill: { solid: { color: '#41BEE0' } } } }]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: metadata.columns[1],
                        values: [],
                        subtotal: 0
                    }])
                }
            };
            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, false);
            expect(actualData.series).toEqual([]);
        });

        it('validate tooltip info not being created when tooltips are disabled', () => {
            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    dataViewMetadata.columns[0],
                    powerbi.Prototype.inherit(dataViewMetadata.columns[1], c => c.objects = { dataPoint: { fill: { solid: { color: '#41BEE0' } } } }),
                ]
            };
            let dataView: powerbi.DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: metadata.columns[1],
                        values: [100, 200, 700],
                        subtotal: 1000
                    }])
                }
            };
            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, false, undefined, undefined, undefined, false);
            expect(actualData.series[0].data[0].tooltipInfo).toBeUndefined();
        });

        it('validate tooltip info not being created when tooltips are disabled and tooltipBuckets are enabled', () => {
            let dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau']
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[1],
                            values: [100, 200, 700],
                        }, {
                            source: dataViewMetadata.columns[2],
                            values: [700, 100, 200],
                        }, {
                            source: dataViewMetadata.columns[3],
                            values: [200, 700, 100],
                        },
                        {
                            source: tooltipColumn,
                            values: [200, 700, 100],
                        }]),
                },
            };

            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, /*isScalar*/false, /*interactivityService*/undefined, /*shouldCalculateStacked*/undefined, /*isComboChart*/undefined, /*tooltipsEnabled*/false, /*tooltipBucketEnabled*/true);
            expect(actualData.series[0].data[0].tooltipInfo).toBeUndefined();
            expect(actualData.series[0].data[0].extraTooltipInfo).toBeUndefined();
        });

        it('Check convert categorical + fill color', () => {
            let seriesColor = '#41BEE0';
            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    dataViewMetadata.columns[0],
                    powerbi.Prototype.inherit(dataViewMetadata.columns[1], c => c.objects = { dataPoint: { fill: { solid: { color: seriesColor } } } }),
                ]
            };
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('John Domo'),
                mocks.dataViewScopeIdentity('Delta Force'),
                mocks.dataViewScopeIdentity('Jean Tablau'),
            ];
            let specificIds = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'col2', 'col1'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'col2', 'col1'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'col2', 'col1'),
            ];
            let dataView: powerbi.DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: metadata.columns[1],
                        values: [100, 200, 700],
                        subtotal: 1000
                    }])
                }
            };
            let selectionId = SelectionId.createWithMeasure('col2');
            let key = selectionId.getKey();
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLineChartLabelSettings();

            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, false).series;

            let expectedData: powerbi.visuals.LineChartSeries[] =
                [{
                    displayName: dataView.metadata.columns[1].displayName,
                    key: key,
                    lineIndex: 0,
                    color: seriesColor,
                    xCol: dataView.metadata.columns[0],
                    yCol: dataView.metadata.columns[1],
                    labelSettings: actualData[0].labelSettings,
                    data: [
                        {
                            categoryValue: 'John Domo',
                            value: 100,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                            identity: selectionId,
                            specificIdentity: specificIds[0],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[0].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: 'Delta Force',
                            value: 200,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }],
                            identity: selectionId,
                            specificIdentity: specificIds[1],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[1].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: 'Jean Tablau',
                            value: 700,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                            identity: selectionId,
                            specificIdentity: specificIds[2],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[2].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                    ],
                    identity: SelectionId.createWithMeasure('col2'),
                    selected: false,
                }];

            expect(actualData).toEqualDeep(expectedData);
        });

        it('selection state set on converter result', () => {
            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    dataViewMetadata.columns[0],
                    powerbi.Prototype.inherit(dataViewMetadata.columns[1], c => c.objects = { dataPoint: { fill: { solid: { color: '#41BEE0' } } } }),
                ]
            };
            let dataView: powerbi.DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: metadata.columns[1],
                        values: [100, 200, 700],
                        subtotal: 1000
                    }])
                }
            };

            // Create mock interactivity service
            let interactivityService = <powerbi.visuals.InteractivityService>powerbi.visuals.createInteractivityService(hostServices);
            let seriesSelectionId = SelectionId.createWithMeasure(metadata.columns[1].queryName);
            interactivityService['selectedIds'] = [seriesSelectionId];

            // We should see the selection state applied to resulting data
            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, false, interactivityService);

            expect(actualData.series[0].selected).toBe(true);
            expect(actualData.series[0].data[0].selected).toBe(true);
            expect(actualData.series[0].data[1].selected).toBe(true);
            expect(actualData.series[0].data[2].selected).toBe(true);
        });

        it('Check convert categorical multi-series + fill colors', () => {
            let seriesId1 = SelectionId.createWithMeasure('col2');
            let seriesKey1 = seriesId1.getKey();
            let seriesId2 = SelectionId.createWithMeasure('col3');
            let seriesKey2 = seriesId2.getKey();
            let seriesId3 = SelectionId.createWithMeasure('col4');
            let seriesKey3 = seriesId3.getKey();

            let seriesColors = [
                '#41BEE0',
                '#41BEE1',
                '#41BEE2',
            ];
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('John Domo'),
                mocks.dataViewScopeIdentity('Delta Force'),
                mocks.dataViewScopeIdentity('Jean Tablau'),
            ];
            let specificIds = [
                [
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'col2', 'col1'),
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'col2', 'col1'),
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'col2', 'col1'),
                ],
                [
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'col3', 'col1'),
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'col3', 'col1'),
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'col3', 'col1'),
                ],
                [
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'col4', 'col1'),
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'col4', 'col1'),
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'col4', 'col1'),
                ],
            ];

            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    dataViewMetadata.columns[0],
                    powerbi.Prototype.inherit(dataViewMetadata.columns[1], c => c.objects = { dataPoint: { fill: { solid: { color: seriesColors[0] } } } }),
                    powerbi.Prototype.inherit(dataViewMetadata.columns[2], c => c.objects = { dataPoint: { fill: { solid: { color: seriesColors[1] } } } }),
                    powerbi.Prototype.inherit(dataViewMetadata.columns[3], c => c.objects = { dataPoint: { fill: { solid: { color: seriesColors[2] } } } }),
                ]
            };
            let dataView: powerbi.DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[1],
                            values: [100, 200, 700],
                        }, {
                            source: metadata.columns[2],
                            values: [700, 100, 200],
                        }, {
                            source: metadata.columns[3],
                            values: [200, 700, 100],
                        }],
                        undefined,
                        metadata.columns[4])
                },
            };
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLineChartLabelSettings();
            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, false).series;
            let expectedData: powerbi.visuals.LineChartSeries[] =
                [
                    {
                        displayName: dataView.metadata.columns[1].displayName,
                        key: seriesKey1,
                        lineIndex: 0,
                        color: seriesColors[0],
                        xCol: dataView.metadata.columns[0],
                        yCol: dataView.metadata.columns[1],
                        labelSettings: actualData[0].labelSettings,
                        data: [
                            {
                                categoryValue: 'John Domo', value: 100,
                                categoryIndex: 0,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                                identity: seriesId1,
                                specificIdentity: specificIds[0][0],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey1, category: categoryIdentities[0].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 200,
                                categoryIndex: 1,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }],
                                identity: seriesId1,
                                specificIdentity: specificIds[0][1],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey1, category: categoryIdentities[1].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 700,
                                categoryIndex: 2,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                                identity: seriesId1,
                                specificIdentity: specificIds[0][2],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey1, category: categoryIdentities[2].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                        ],
                        identity: seriesId1,
                        selected: false
                    },
                    {
                        displayName: dataView.metadata.columns[2].displayName,
                        key: seriesKey2,
                        lineIndex: 1,
                        color: seriesColors[1],
                        xCol: dataView.metadata.columns[0],
                        yCol: dataView.metadata.columns[2],
                        labelSettings: actualData[1].labelSettings,
                        data: [
                            {
                                categoryValue: 'John Domo',
                                value: 700,
                                categoryIndex: 0,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col3", value: "700" }],
                                identity: seriesId2,
                                specificIdentity: specificIds[1][0],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey2, category: categoryIdentities[0].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 100,
                                categoryIndex: 1,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col3", value: "100" }],
                                identity: seriesId2,
                                specificIdentity: specificIds[1][1],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey2, category: categoryIdentities[1].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 200,
                                categoryIndex: 2,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col3", value: "200" }],
                                identity: seriesId2,
                                specificIdentity: specificIds[1][2],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey2, category: categoryIdentities[2].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                        ],
                        identity: seriesId2,
                        selected: false
                    },
                    {
                        displayName: dataView.metadata.columns[3].displayName,
                        key: seriesKey3,
                        lineIndex: 2,
                        color: seriesColors[2],
                        xCol: dataView.metadata.columns[0],
                        yCol: dataView.metadata.columns[3],
                        labelSettings: actualData[2].labelSettings,
                        data: [
                            {
                                categoryValue: 'John Domo',
                                value: 200,
                                categoryIndex: 0,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col4", value: "200" }],
                                identity: seriesId3,
                                specificIdentity: specificIds[2][0],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey3, category: categoryIdentities[0].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 700,
                                categoryIndex: 1,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col4", value: "700" }],
                                identity: seriesId3,
                                specificIdentity: specificIds[2][1],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey3, category: categoryIdentities[1].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 100,
                                categoryIndex: 2,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col4", value: "100" }],
                                identity: seriesId3,
                                specificIdentity: specificIds[2][2],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey3, category: categoryIdentities[2].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                        ],
                        identity: seriesId3,
                        selected: false,
                    },
                ];

            expect(actualData).toEqualDeep(expectedData);
        });

        it('Check convert categorical multi-series', () => {
            let seriesId1 = SelectionId.createWithMeasure('col2');
            let seriesKey1 = seriesId1.getKey();
            let seriesId2 = SelectionId.createWithMeasure('col3');
            let seriesKey2 = seriesId2.getKey();
            let seriesId3 = SelectionId.createWithMeasure('col4');
            let seriesKey3 = seriesId3.getKey();
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('John Domo'),
                mocks.dataViewScopeIdentity('Delta Force'),
                mocks.dataViewScopeIdentity('Jean Tablau'),
            ];
            let specificIds = [
                [
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'col2', 'col1'),
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'col2', 'col1'),
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'col2', 'col1'),
                ],
                [
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'col3', 'col1'),
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'col3', 'col1'),
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'col3', 'col1'),
                ],
                [
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'col4', 'col1'),
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'col4', 'col1'),
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'col4', 'col1'),
                ],
            ];
            dataViewMetadata.objects = undefined;
            let dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[1],
                            values: [100, 200, 700],
                        }, {
                            source: dataViewMetadata.columns[2],
                            values: [700, 100, 200],
                        }, {
                            source: dataViewMetadata.columns[3],
                            values: [200, 700, 100],
                        }]),
                },
            };

            let seriesColors = [
                colors.getColorByIndex(0).value,
                colors.getColorByIndex(1).value,
                colors.getColorByIndex(2).value,
            ];
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLineChartLabelSettings();

            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, false).series;
            let expectedData: powerbi.visuals.LineChartSeries[] =
                [
                    {
                        displayName: dataView.metadata.columns[1].displayName,
                        key: seriesKey1,
                        lineIndex: 0,
                        color: seriesColors[0],
                        xCol: dataView.metadata.columns[0],
                        yCol: dataView.metadata.columns[1],
                        labelSettings: actualData[0].labelSettings,
                        data: [
                            {
                                categoryValue: 'John Domo', value: 100,
                                categoryIndex: 0,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                                identity: seriesId1,
                                specificIdentity: specificIds[0][0],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey1, category: categoryIdentities[0].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 200,
                                categoryIndex: 1,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }],
                                identity: seriesId1,
                                specificIdentity: specificIds[0][1],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey1, category: categoryIdentities[1].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 700,
                                categoryIndex: 2,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                                identity: seriesId1,
                                specificIdentity: specificIds[0][2],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey1, category: categoryIdentities[2].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                        ],
                        identity: seriesId1,
                        selected: false
                    },
                    {
                        displayName: dataView.metadata.columns[2].displayName,
                        key: seriesKey2,
                        lineIndex: 1,
                        color: seriesColors[1],
                        xCol: dataView.metadata.columns[0],
                        yCol: dataView.metadata.columns[2],
                        labelSettings: actualData[1].labelSettings,
                        data: [
                            {
                                categoryValue: 'John Domo',
                                value: 700,
                                categoryIndex: 0,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col3", value: "700" }],
                                identity: seriesId2,
                                specificIdentity: specificIds[1][0],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey2, category: categoryIdentities[0].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 100,
                                categoryIndex: 1,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col3", value: "100" }],
                                identity: seriesId2,
                                specificIdentity: specificIds[1][1],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey2, category: categoryIdentities[1].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 200,
                                categoryIndex: 2,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col3", value: "200" }],
                                identity: seriesId2,
                                specificIdentity: specificIds[1][2],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey2, category: categoryIdentities[2].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                        ],
                        identity: seriesId2,
                        selected: false
                    },
                    {
                        displayName: dataView.metadata.columns[3].displayName,
                        key: seriesKey3,
                        lineIndex: 2,
                        color: seriesColors[2],
                        xCol: dataView.metadata.columns[0],
                        yCol: dataView.metadata.columns[3],
                        labelSettings: actualData[2].labelSettings,
                        data: [
                            {
                                categoryValue: 'John Domo',
                                value: 200,
                                categoryIndex: 0,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col4", value: "200" }],
                                identity: seriesId3,
                                specificIdentity: specificIds[2][0],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey3, category: categoryIdentities[0].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 700,
                                categoryIndex: 1,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col4", value: "700" }],
                                identity: seriesId3,
                                specificIdentity: specificIds[2][1],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey3, category: categoryIdentities[1].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 100,
                                categoryIndex: 2,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col4", value: "100" }],
                                identity: seriesId3,
                                specificIdentity: specificIds[2][2],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey3, category: categoryIdentities[2].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                        ],
                        identity: seriesId3,
                        selected: false,
                    },
                ];

            expect(actualData).toEqualDeep(expectedData);
        });

        it('Check convert categorical multi-series with tooltip bucket', () => {
            let seriesId1 = SelectionId.createWithMeasure('col2');
            let seriesKey1 = seriesId1.getKey();
            let seriesId2 = SelectionId.createWithMeasure('col3');
            let seriesKey2 = seriesId2.getKey();
            let seriesId3 = SelectionId.createWithMeasure('col4');
            let seriesKey3 = seriesId3.getKey();
            dataViewMetadata.objects = undefined;
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('John Domo'),
                mocks.dataViewScopeIdentity('Delta Force'),
                mocks.dataViewScopeIdentity('Jean Tablau'),
            ];
            let specificIds = [
                [
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'col2', 'col1'),
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'col2', 'col1'),
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'col2', 'col1'),
                ],
                [
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'col3', 'col1'),
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'col3', 'col1'),
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'col3', 'col1'),
                ],
                [
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'col4', 'col1'),
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'col4', 'col1'),
                    SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'col4', 'col1'),
                ],
            ];
            let dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[1],
                            values: [100, 200, 700],
                        }, {
                            source: dataViewMetadata.columns[2],
                            values: [700, 100, 200],
                        }, {
                            source: dataViewMetadata.columns[3],
                            values: [200, 700, 100],
                        },
                        {
                            source: tooltipColumn,
                            values: [200, 700, 100],
                        }]),
                },
            };

            let seriesColors = [
                colors.getColorByIndex(0).value,
                colors.getColorByIndex(1).value,
                colors.getColorByIndex(2).value,
            ];
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLineChartLabelSettings();

            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, false, undefined, undefined, undefined, undefined, true).series;
            let expectedData: powerbi.visuals.LineChartSeries[] =
                [
                    {
                        displayName: dataView.metadata.columns[1].displayName,
                        key: seriesKey1,
                        lineIndex: 0,
                        color: seriesColors[0],
                        xCol: dataView.metadata.columns[0],
                        yCol: dataView.metadata.columns[1],
                        labelSettings: actualData[0].labelSettings,
                        data: [
                            {
                                categoryValue: 'John Domo', value: 100,
                                categoryIndex: 0,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                                identity: seriesId1,
                                specificIdentity: specificIds[0][0],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey1, category: categoryIdentities[0].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                                extraTooltipInfo: [{ displayName: "tooltipDisplayName", value: "200" }],
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 200,
                                categoryIndex: 1,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }],
                                identity: seriesId1,
                                specificIdentity: specificIds[0][1],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey1, category: categoryIdentities[1].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                                extraTooltipInfo: [{ displayName: "tooltipDisplayName", value: "700" }],
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 700,
                                categoryIndex: 2,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                                identity: seriesId1,
                                specificIdentity: specificIds[0][2],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey1, category: categoryIdentities[2].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                                extraTooltipInfo: [{ displayName: "tooltipDisplayName", value: "100" }],
                            },
                        ],
                        identity: seriesId1,
                        selected: false
                    },
                    {
                        displayName: dataView.metadata.columns[2].displayName,
                        key: seriesKey2,
                        lineIndex: 1,
                        color: seriesColors[1],
                        xCol: dataView.metadata.columns[0],
                        yCol: dataView.metadata.columns[2],
                        labelSettings: actualData[1].labelSettings,
                        data: [
                            {
                                categoryValue: 'John Domo',
                                value: 700,
                                categoryIndex: 0,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col3", value: "700" }],
                                identity: seriesId2,
                                specificIdentity: specificIds[1][0],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey2, category: categoryIdentities[0].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                                extraTooltipInfo: [{ displayName: "tooltipDisplayName", value: "200" }],
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 100,
                                categoryIndex: 1,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col3", value: "100" }],
                                identity: seriesId2,
                                specificIdentity: specificIds[1][1],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey2, category: categoryIdentities[1].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                                extraTooltipInfo: [{ displayName: "tooltipDisplayName", value: "700" }],
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 200,
                                categoryIndex: 2,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col3", value: "200" }],
                                identity: seriesId2,
                                specificIdentity: specificIds[1][2],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey2, category: categoryIdentities[2].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                                extraTooltipInfo: [{ displayName: "tooltipDisplayName", value: "100" }],
                            },
                        ],
                        identity: seriesId2,
                        selected: false
                    },
                    {
                        displayName: dataView.metadata.columns[3].displayName,
                        key: seriesKey3,
                        lineIndex: 2,
                        color: seriesColors[2],
                        xCol: dataView.metadata.columns[0],
                        yCol: dataView.metadata.columns[3],
                        labelSettings: actualData[2].labelSettings,
                        data: [
                            {
                                categoryValue: 'John Domo',
                                value: 200,
                                categoryIndex: 0,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col4", value: "200" }],
                                identity: seriesId3,
                                specificIdentity: specificIds[2][0],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey3, category: categoryIdentities[0].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                                extraTooltipInfo: [{ displayName: "tooltipDisplayName", value: "200" }],
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 700,
                                categoryIndex: 1,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col4", value: "700" }],
                                identity: seriesId3,
                                specificIdentity: specificIds[2][1],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey3, category: categoryIdentities[1].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                                extraTooltipInfo: [{ displayName: "tooltipDisplayName", value: "700" }],
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 100,
                                categoryIndex: 2,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col4", value: "100" }],
                                identity: seriesId3,
                                specificIdentity: specificIds[2][2],
                                selected: false,
                                key: JSON.stringify({ series: seriesKey3, category: categoryIdentities[2].key }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                                extraTooltipInfo: [{ displayName: "tooltipDisplayName", value: "100" }],
                            },
                        ],
                        identity: seriesId3,
                        selected: false,
                    },
                ];

            expect(actualData).toEqualDeep(expectedData);
        });

        it('Check convert non-category multi-measure + fill colors', () => {
            let seriesColors = [
                '#41BEE0',
                '#41BEE1',
            ];

            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    powerbi.Prototype.inherit(dataViewMetadata.columns[1], c => c.objects = { dataPoint: { fill: { solid: { color: seriesColors[0] } } } }),
                    powerbi.Prototype.inherit(dataViewMetadata.columns[2], c => c.objects = { dataPoint: { fill: { solid: { color: seriesColors[1] } } } }),
                ]
            };
            let dataView: powerbi.DataView = {
                metadata: metadata,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[0],
                            values: [100],
                        }, {
                            source: metadata.columns[1],
                            values: [200],
                        }])
                }
            };
            let ids = [SelectionId.createWithMeasure('col2'), SelectionId.createWithMeasure('col3')];
            let keys = [ids[0].getKey(), ids[1].getKey()];
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLineChartLabelSettings();
            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, false).series;
            let expectSlices: powerbi.visuals.LineChartSeries[] =
                [
                    {
                        displayName: dataView.metadata.columns[0].displayName,
                        key: keys[0],
                        lineIndex: 0,
                        color: seriesColors[0],
                        xCol: undefined,
                        yCol: dataView.metadata.columns[0],
                        labelSettings: actualData[0].labelSettings,
                        data: [
                            {
                                categoryValue: blankCategoryValue,
                                value: 100,
                                categoryIndex: 0,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col2", value: "100" }],
                                identity: ids[0],
                                specificIdentity: ids[0],
                                selected: false,
                                key: JSON.stringify({ series: keys[0], category: 0 }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            }
                        ],
                        identity: ids[0],
                        selected: false,
                    },
                    {
                        displayName: dataView.metadata.columns[1].displayName,
                        key: keys[1],
                        lineIndex: 1,
                        color: seriesColors[1],
                        xCol: undefined,
                        yCol: dataView.metadata.columns[1],
                        labelSettings: actualData[1].labelSettings,
                        data: [
                            {
                                categoryValue: blankCategoryValue,
                                value: 200,
                                categoryIndex: 0,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col3", value: "200" }],
                                identity: ids[1],
                                specificIdentity: ids[1],
                                selected: false,
                                key: JSON.stringify({ series: keys[1], category: 0 }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            }
                        ],
                        identity: ids[1],
                        selected: false
                    }
                ];

            expect(actualData).toEqualDeep(expectSlices);
        });

        let dateTimeColumnsMetadata: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'Date', queryName: 'Date', type: ValueType.fromDescriptor({ dateTime: true }), roles: { Category: true } },
                { displayName: 'PowerBI Customers', queryName: 'PowerBI Customers', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y: true } }]
        };

        it('Check convert date time', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('2014/9/25'),
                mocks.dataViewScopeIdentity('2014/12/12'),
                mocks.dataViewScopeIdentity('2015/9/25'),
            ];
            let specificIds = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'PowerBI Customers', 'Date'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'PowerBI Customers', 'Date'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'PowerBI Customers', 'Date'),
            ];
            let dataView: powerbi.DataView = {
                metadata: dateTimeColumnsMetadata,
                categorical: {
                    categories: [{
                        source: dateTimeColumnsMetadata.columns[0],
                        values: [new Date('2014/9/25'), new Date('2014/12/12'), new Date('2015/9/25')],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dateTimeColumnsMetadata.columns[1],
                        values: [8000, 20000, 1000000],
                    }])
                }
            };
            let selectionId = SelectionId.createWithMeasure('PowerBI Customers');
            let key = selectionId.getKey();
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLineChartLabelSettings();
            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, true).series;
            let seriesColor = colors.getColorByIndex(0).value;

            let expectedData: powerbi.visuals.LineChartSeries[] =
                [{
                    displayName: dataView.metadata.columns[1].displayName,
                    key: key,
                    lineIndex: 0,
                    color: seriesColor,
                    xCol: dataView.metadata.columns[0],
                    yCol: dataView.metadata.columns[1],
                    labelSettings: actualData[0].labelSettings,
                    data: [
                        {
                            categoryValue: new Date('2014/9/25').getTime(),
                            value: 8000,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "9/25/2014 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "8000" }],
                            identity: selectionId,
                            specificIdentity: specificIds[0],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[0].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: new Date('2014/12/12').getTime(),
                            value: 20000,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "12/12/2014 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "20000" }],
                            identity: selectionId,
                            specificIdentity: specificIds[1],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[1].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: new Date('2015/9/25').getTime(),
                            value: 1000000,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "9/25/2015 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "1000000" }],
                            identity: selectionId,
                            specificIdentity: specificIds[2],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[2].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                    ],
                    identity: selectionId,
                    selected: false
                }];

            expect(actualData).toEqualDeep(expectedData);
        });

        it('Check convert datetime category with null category value', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity(null),
                mocks.dataViewScopeIdentity('2014/9/25'),
                mocks.dataViewScopeIdentity('2014/12/12'),
                mocks.dataViewScopeIdentity('2015/9/25'),
            ];
            let specificIds = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'PowerBI Customers', 'Date'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'PowerBI Customers', 'Date'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'PowerBI Customers', 'Date'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[3], 'PowerBI Customers', 'Date'),
            ];
            let dataView: powerbi.DataView = {
                metadata: dateTimeColumnsMetadata,
                categorical: {
                    categories: [{
                        source: dateTimeColumnsMetadata.columns[0],
                        values: [null, new Date('2014/9/25'), new Date('2014/12/12'), new Date('2015/9/25')],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dateTimeColumnsMetadata.columns[1],
                        values: [30000, 8000, 20000, 1000000],
                    }])
                }
            };
            let selectionId = SelectionId.createWithMeasure('PowerBI Customers');
            let key = selectionId.getKey();
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLineChartLabelSettings();
            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, true).series;
            let seriesColor = colors.getColorByIndex(0).value;

            let expectedData: powerbi.visuals.LineChartSeries[] =
                [{
                    displayName: dataView.metadata.columns[1].displayName,
                    key: key,
                    lineIndex: 0,
                    color: seriesColor,
                    xCol: dataView.metadata.columns[0],
                    yCol: dataView.metadata.columns[1],
                    labelSettings: actualData[0].labelSettings,
                    data: [
                        {
                            categoryValue: new Date('2014/9/25').getTime(),
                            value: 8000,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "9/25/2014 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "8000" }],
                            identity: selectionId,
                            specificIdentity: specificIds[1],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[1].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: new Date('2014/12/12').getTime(),
                            value: 20000,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "12/12/2014 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "20000" }],
                            identity: selectionId,
                            specificIdentity: specificIds[2],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[2].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: new Date('2015/9/25').getTime(),
                            value: 1000000,
                            categoryIndex: 3,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "9/25/2015 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "1000000" }],
                            identity: selectionId,
                            specificIdentity: specificIds[3],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[3].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                    ],
                    identity: selectionId,
                    selected: false,
                }];

            expect(actualData).toEqualDeep(expectedData);
        });

        it('Check convert date time with scalar keys', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('2014/9/25'),
                mocks.dataViewScopeIdentity('2014/12/12'),
                mocks.dataViewScopeIdentity('2015/9/25'),
            ];
            let dataView: powerbi.DataView = {
                metadata: dateTimeColumnsMetadata,
                categorical: {
                    categories: [{
                        source: dateTimeColumnsMetadata.columns[0],
                        values: [new Date('2014/9/25'), new Date('2014/12/12'), new Date('2015/9/25')],
                        identity: categoryIdentities,
                        objects: []
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dateTimeColumnsMetadata.columns[1],
                        values: [8000, 20000, 1000000],
                    }])
                }
            };

            let scalarKeys: ScalarKeys = {
                values: [{
                    min: new Date('2014/7/1')
                }, {
                        min: new Date('2014/10/1')
                    }, {
                        min: new Date('2015/7/1')
                    }]
            };

            InjectScalarKeys(dataView.categorical.categories[0].objects, scalarKeys);

            let selectionId = SelectionId.createWithMeasure('PowerBI Customers');
            let specificIds = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'PowerBI Customers', 'Date'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'PowerBI Customers', 'Date'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'PowerBI Customers', 'Date'),
            ];
            let key = selectionId.getKey();
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLineChartLabelSettings();
            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, true /*isScalar*/, null /*interactivity*/, false /*isStacked*/, false /*isComboChart*/, true /* toolTipEnabled*/, false /*tooltipBucketEnabled*/);
            let seriesColor = colors.getColorByIndex(0).value;

            expect(actualData.isScalar).toBe(true);
            expect(actualData.scalarMetadata).toBeDefined();
            expect(actualData.scalarKeyCount).toBe(3);
            let expectedScalarMetadata: powerbi.DataViewMetadataColumn = {
                displayName: null,
                type: {
                    dateTime: true
                },
            };
            expect(actualData.scalarMetadata).toEqualDeep(expectedScalarMetadata);
            expect(actualData.scalarKeyCount).toBe(3);

            expect(new Date(actualData.categoryData[0].categoryValue)).toEqual(new Date('2014/7/1'));
            expect(new Date(actualData.categoryData[1].categoryValue)).toEqual(new Date('2014/10/1'));
            expect(new Date(actualData.categoryData[2].categoryValue)).toEqual(new Date('2015/7/1'));

            let expectedSeriesData: powerbi.visuals.LineChartSeries[] =
                [{
                    displayName: dataView.metadata.columns[1].displayName,
                    key: key,
                    lineIndex: 0,
                    color: seriesColor,
                    xCol: expectedScalarMetadata,
                    yCol: dataView.metadata.columns[1],
                    labelSettings: actualData.series[0].labelSettings,
                    data: [
                        {
                            categoryValue: new Date('2014/7/1').getTime(),
                            value: 8000,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "9/25/2014 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "8000" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[0].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                            specificIdentity: specificIds[0],
                        },
                        {
                            categoryValue: new Date('2014/10/1').getTime(),
                            value: 20000,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "12/12/2014 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "20000" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[1].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                            specificIdentity: specificIds[1],
                        },
                        {
                            categoryValue: new Date('2015/7/1').getTime(),
                            value: 1000000,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "9/25/2015 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "1000000" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[2].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                            specificIdentity: specificIds[2],
                        },
                    ],
                    identity: selectionId,
                    selected: false
                }];

            expect(actualData.series).toEqualDeep(expectedSeriesData);
        });

        it('variant measure - datetime column with a text category', () => {
            let dataView: powerbi.DataView = {
                metadata: dateTimeColumnsMetadata,
                categorical: {
                    categories: [{
                        source: dateTimeColumnsMetadata.columns[0],
                        values: [new Date(2011), new Date(2012), new Date(2013), 'TheFuture']
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dateTimeColumnsMetadata.columns[1],
                        values: [100, 200, 300, 1000]
                    }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = LineChart.converter(dataView, blankCategoryValue, colors, true);
            // the text value is ignored
            expect(data.series[0].data.length).toBe(3);
        });

        it('Check convert categorical with null category value', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('John Domo'),
                mocks.dataViewScopeIdentity('null'),
                mocks.dataViewScopeIdentity('Delta Force'),
                mocks.dataViewScopeIdentity('Jean Tablau'),
            ];
            let specificIds = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'col2', 'col1'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'col2', 'col1'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'col2', 'col1'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[3], 'col2', 'col1'),
            ];
            let dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', null, 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 300, 200, 700],
                        subtotal: 1300
                    }])
                }
            };
            let selectionId = SelectionId.createWithMeasure('col2');
            let key = selectionId.getKey();
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLineChartLabelSettings();
            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, false).series;
            let seriesColor = colors.getColorByIndex(0).value;

            let expectedData: powerbi.visuals.LineChartSeries[] =
                [{
                    displayName: dataView.metadata.columns[1].displayName,
                    key: key,
                    lineIndex: 0,
                    color: seriesColor,
                    xCol: dataView.metadata.columns[0],
                    yCol: dataView.metadata.columns[1],
                    labelSettings: actualData[0].labelSettings,
                    data: [
                        {
                            categoryValue: 'John Domo',
                            value: 100,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                            identity: selectionId,
                            specificIdentity: specificIds[0],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[0].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: null,
                            value: 300,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "(Blank)" }, { displayName: "col2", value: "300" }],
                            identity: selectionId,
                            specificIdentity: specificIds[1],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[1].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: 'Delta Force',
                            value: 200,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }],
                            identity: selectionId,
                            specificIdentity: specificIds[2],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[2].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: 'Jean Tablau',
                            value: 700,
                            categoryIndex: 3,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                            identity: selectionId,
                            specificIdentity: specificIds[3],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[3].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                    ],
                    identity: selectionId,
                    selected: false,
                }];

            expect(actualData).toEqualDeep(expectedData);
        });

        it('Check convert categorical with positive infinity value', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('John Domo'),
                mocks.dataViewScopeIdentity('Delta Force'),
                mocks.dataViewScopeIdentity('Jean Tablau'),
            ];
            let specificIds = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'col2', 'col1'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'col2', 'col1'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'col2', 'col1'),
            ];
            let dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, Number.POSITIVE_INFINITY, 700],
                        subtotal: 800
                    }])
                }
            };
            let selectionId = SelectionId.createWithMeasure('col2');
            let key = selectionId.getKey();
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLineChartLabelSettings();
            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, false).series;
            let seriesColor = colors.getColorByIndex(0).value;

            let expectedData: powerbi.visuals.LineChartSeries[] =
                [{
                    displayName: dataView.metadata.columns[1].displayName,
                    key: key,
                    lineIndex: 0,
                    color: seriesColor,
                    xCol: dataView.metadata.columns[0],
                    yCol: dataView.metadata.columns[1],
                    labelSettings: actualData[0].labelSettings,
                    data: [
                        {
                            categoryValue: 'John Domo',
                            value: 100,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                            identity: selectionId,
                            specificIdentity: specificIds[0],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[0].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: 'Delta Force',
                            value: Number.MAX_VALUE,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "1.7976931348623157E+308" }],
                            identity: selectionId,
                            specificIdentity: specificIds[1],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[1].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: 'Jean Tablau',
                            value: 700,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                            identity: selectionId,
                            specificIdentity: specificIds[2],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[2].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                    ],
                    identity: selectionId,
                    selected: false,
                }];

            expect(actualData).toEqualDeep(expectedData);
        });

        it('Check convert categorical with negative infinity value', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('John Domo'),
                mocks.dataViewScopeIdentity('Delta Force'),
                mocks.dataViewScopeIdentity('Jean Tablau'),
            ];
            let specificIds = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'col2', 'col1'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'col2', 'col1'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'col2', 'col1'),
            ];
            let dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, Number.NEGATIVE_INFINITY, 700],
                        subtotal: 800
                    }])
                }
            };
            let selectionId = SelectionId.createWithMeasure('col2');
            let key = selectionId.getKey();
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLineChartLabelSettings();
            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, false).series;
            let seriesColor = colors.getColorByIndex(0).value;

            let expectedData: powerbi.visuals.LineChartSeries[] =
                [{
                    displayName: dataView.metadata.columns[1].displayName,
                    key: key,
                    lineIndex: 0,
                    color: seriesColor,
                    xCol: dataView.metadata.columns[0],
                    yCol: dataView.metadata.columns[1],
                    labelSettings: actualData[0].labelSettings,
                    data: [
                        {
                            categoryValue: 'John Domo',
                            value: 100,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                            identity: selectionId,
                            specificIdentity: specificIds[0],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[0].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: 'Delta Force',
                            value: -Number.MAX_VALUE,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "-1.7976931348623157E+308" }],
                            identity: selectionId,
                            specificIdentity: specificIds[1],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[1].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: 'Jean Tablau',
                            value: 700,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                            identity: selectionId,
                            specificIdentity: specificIds[2],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[2].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                    ],
                    identity: selectionId,
                    selected: false,
                }];

            expect(actualData).toEqualDeep(expectedData);
        });

        it('Check convert categorical with NaN value', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('John Domo'),
                mocks.dataViewScopeIdentity('Delta Force'),
                mocks.dataViewScopeIdentity('Jean Tablau'),
            ];
            let specificIds = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'col2', 'col1'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'col2', 'col1'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'col2', 'col1'),
            ];
            let dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, Number.NaN, 700],
                        subtotal: 800
                    }])
                }
            };
            let selectionId = SelectionId.createWithMeasure('col2');
            let key = selectionId.getKey();
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLineChartLabelSettings();
            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, false).series;
            let seriesColor = colors.getColorByIndex(0).value;

            let expectedData: powerbi.visuals.LineChartSeries[] =
                [{
                    displayName: dataView.metadata.columns[1].displayName,
                    key: key,
                    lineIndex: 0,
                    color: seriesColor,
                    xCol: dataView.metadata.columns[0],
                    yCol: dataView.metadata.columns[1],
                    labelSettings: actualData[0].labelSettings,
                    data: [
                        {
                            categoryValue: 'John Domo',
                            value: 100,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                            identity: selectionId,
                            specificIdentity: specificIds[0],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[0].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: 'Delta Force',
                            value: null,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Delta Force" }],
                            identity: selectionId,
                            specificIdentity: specificIds[1],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[1].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: 'Jean Tablau',
                            value: 700,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                            identity: selectionId,
                            specificIdentity: specificIds[2],
                            selected: false,
                            key: JSON.stringify({ series: key, category: categoryIdentities[2].key }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                    ],
                    identity: selectionId,
                    selected: false,
                }];

            expect(actualData).toEqualDeep(expectedData);
        });

        it('Check convert scalar with all null values returns empty series array', () => {
            let dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[2],
                        values: [3, 6, 15]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [null, null, null],
                    }])
                }
            };
            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, true /*isScalar*/).series;
            let expectedData: powerbi.visuals.LineChartSeries[] = [];
            expect(actualData).toEqual(expectedData);
        });

        it('Check convert for stacked area chart', () => {
            let seriesIdentities = [
                mocks.dataViewScopeIdentity('col2'),
                mocks.dataViewScopeIdentity('col3'),
            ];

            let measureColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col2' });

            let valueColumns = DataViewTransform.createValueColumns([
                {
                    source: dataViewMetadata.columns[1],
                    values: [20, 40, 50, 0, 90],
                    identity: seriesIdentities[0],
                }, {
                    source: dataViewMetadata.columns[2],
                    values: [90, 34, 56, 0, 50],
                    identity: seriesIdentities[1],
                }],
                [measureColumnRef]);
            valueColumns.source = dataViewMetadata.columns[2];

            let dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: [2001, 2002, 2003, 2004, 2005]
                    }],
                    values: valueColumns
                }
            };

            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, true /*isScalar*/, null /*interactivity*/, true /*isStacked*/);

            //check the first series stacked value
            for (let i = 0, len = actualData.series[0].data.length; i < len; i++) {
                let dataPoint = actualData.series[0].data[i];
                let expectedValue = valueColumns[0].values[i];
                expect(dataPoint.stackedValue).toEqual(expectedValue);
            }

            //check that the second series stacked value
            for (let i = 0, len = actualData.series[1].data.length; i < len; i++) {
                let dataPoint = actualData.series[1].data[i];
                let expectedValue = valueColumns[1].values[i] + valueColumns[0].values[i];
                expect(dataPoint.stackedValue).toEqual(expectedValue);
            }
        });
    });

    describe("Converter", () => {
        describe("Dynamic series and tooltips", () => {
            let dataView: powerbi.DataView;
            let metadata: powerbi.DataViewMetadata;
            let seriesValues = ['A', 'B'];
            let categoryValues = ['c', 'd', 'e'];
            let seriesIdentities = [
                mocks.dataViewScopeIdentity(seriesValues[0]),
                mocks.dataViewScopeIdentity(seriesValues[1]),
            ];
            let categoryIdentities = [
                mocks.dataViewScopeIdentity(categoryValues[0]),
                mocks.dataViewScopeIdentity(categoryValues[1]),
                mocks.dataViewScopeIdentity(categoryValues[2]),
            ];
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let categorySelectionIds: SelectionId[];
            let seriesSelectionIds: SelectionId[];
            let specificSelectionIds: SelectionId[];
            let viewModel: powerbi.visuals.LineChartData;

            beforeEach(() => {
                let valueIdentifier = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'value' });
                let tooltipIdentifier = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'tooltip' });
                metadata = {
                    columns: [
                        {
                            displayName: 'category',
                            queryName: 'category',
                            type: ValueType.fromDescriptor({ text: true }),
                            roles: { Category: true }
                        },
                        {
                            displayName: 'series',
                            queryName: 'series',
                            type: ValueType.fromDescriptor({ text: true }),
                            roles: { Series: true }
                        }, {
                            displayName: 'value',
                            queryName: 'value',
                            isMeasure: true,
                            type: ValueType.fromDescriptor({ numeric: true }),
                            roles: { Y: true },
                            groupName: seriesValues[0],
                        }, {
                            displayName: 'tooltip',
                            queryName: 'tooltip',
                            isMeasure: true,
                            type: ValueType.fromDescriptor({ numeric: true }),
                            roles: { Tooltip: true },
                            groupName: seriesValues[0],
                        }, {
                            displayName: 'value',
                            queryName: 'value',
                            isMeasure: true,
                            type: ValueType.fromDescriptor({ numeric: true }),
                            roles: { Y: true },
                            groupName: seriesValues[1],
                        }, {
                            displayName: 'tooltip',
                            queryName: 'tooltip',
                            isMeasure: true,
                            type: ValueType.fromDescriptor({ numeric: true }),
                            roles: { Tooltip: true },
                            groupName: seriesValues[1],
                        }]
                };
                dataView = {
                    metadata: metadata,
                    categorical: {
                        categories: [{
                            source: metadata.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: metadata.columns[2],
                                values: [100, 200, 300],
                                identity: seriesIdentities[0],
                            }, {
                                source: metadata.columns[4],
                                values: [5, 10, 15],
                                identity: seriesIdentities[0],
                            }, {
                                source: metadata.columns[3],
                                values: [400, 500, 600],
                                identity: seriesIdentities[1],
                            }, {
                                source: metadata.columns[5],
                                values: [20, 25, 30],
                                identity: seriesIdentities[1],
                            }],
                            [valueIdentifier, tooltipIdentifier],
                            metadata.columns[1])
                    }
                };
                categorySelectionIds = _.map(categoryIdentities, (value: powerbi.DataViewScopeIdentity) => SelectionId.createWithIdAndMeasureAndCategory(value, 'value', 'category'));
                seriesSelectionIds = _.map(seriesIdentities, (value: powerbi.DataViewScopeIdentity) => SelectionId.createWithIdAndMeasureAndCategory(value, 'value', 'series'));
                specificSelectionIds = [];
                for (let categoryIndex = 0, categoryCount = categoryIdentities.length; categoryIndex < categoryCount; categoryIndex++) {
                    for (let seriesIndex = 0, seriesCount = seriesIdentities.length; seriesIndex < seriesCount; seriesIndex++) {
                        specificSelectionIds.push(SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn('series', seriesIdentities[seriesIndex], buildSelectorForColumn('category', categoryIdentities[categoryIndex])), 'value'));
                    }
                }
                viewModel = LineChart.converter(dataView, '(Blank)', colors, false /* isScalar */, null /* interactivityService */, false /* stacked */, false /* isCombo */, true /* tooltipsEnabled */, true /* tooltipBucketEnabled */);
            });

            it('Category count', () => {
                expect(viewModel.categories.length).toBe(3);
            });

            it('Series count', () => {
                expect(viewModel.series.length).toBe(2);
            });
        });

        describe("Combo chart with a value shared with column", () => {
            let dataView: powerbi.DataView;
            let metadata: powerbi.DataViewMetadata;
            let categoryValues = ['c', 'd', 'e'];
            let categoryIdentities = [
                mocks.dataViewScopeIdentity(categoryValues[0]),
                mocks.dataViewScopeIdentity(categoryValues[1]),
                mocks.dataViewScopeIdentity(categoryValues[2]),
            ];
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let categorySelectionIds: SelectionId[];
            let specificSelectionIds: SelectionId[];
            let viewModel: powerbi.visuals.LineChartData;

            beforeEach(() => {
                let valueIdentifier = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'value' });
                metadata = {
                    columns: [
                        {
                            displayName: 'category',
                            queryName: 'category',
                            type: ValueType.fromDescriptor({ text: true }),
                            roles: { Category: true }
                        }, {
                            displayName: 'value1',
                            queryName: 'value1',
                            isMeasure: true,
                            type: ValueType.fromDescriptor({ numeric: true }),
                            roles: { Y: true, Y2: true }, // value 1 exists in column and line, so it has role Y and Y2.
                        }, {
                            displayName: 'value2',
                            queryName: 'value2',
                            isMeasure: true,
                            type: ValueType.fromDescriptor({ numeric: true }),
                            roles: { Y2: true },
                        }]
                };
                dataView = {
                    metadata: metadata,
                    categorical: {
                        categories: [{
                            source: metadata.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: metadata.columns[1],
                                values: [100, 200, 300],
                            }, {
                                source: metadata.columns[2],
                                values: [400, 500, 600],
                            }],
                            [valueIdentifier])
                    }
                };
                categorySelectionIds = _.map(categoryIdentities, (value: powerbi.DataViewScopeIdentity) => SelectionId.createWithIdAndMeasureAndCategory(value, 'value1', 'category'));
                specificSelectionIds = [];
                for (let categoryIndex = 0, categoryCount = categoryIdentities.length; categoryIndex < categoryCount; categoryIndex++) {
                    for (let seriesIndex = 0, seriesCount = 2; seriesIndex < seriesCount; seriesIndex++) {
                        specificSelectionIds.push(SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn('category', categoryIdentities[categoryIndex]), 'value' + (seriesIndex + 1).toString()));
                    }
                }
                viewModel = LineChart.converter(dataView, '(Blank)', colors, false /* isScalar */, null /* interactivityService */, false /* stacked */, true /* isCombo */, true /* tooltipsEnabled */, true /* tooltipBucketEnabled */);
            });

            it('Category count', () => {
                expect(viewModel.categories.length).toBe(3);
            });

            it('Series count', () => {
                expect(viewModel.series.length).toBe(2);
            });
        });
    });

    describe("LineChart DOM Validation", () => {
        let blankCategoryValue = '(Blank)';
        let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

        let dataViewMetadata: powerbi.DataViewMetadata = {
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
                    roles: { Y: true },
                },
                {
                    displayName: 'col3',
                    queryName: 'col3',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true },
                },
                {
                    displayName: 'col4',
                    queryName: 'col4',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true },
                },
                {

                    // for secondary grouping (legend/series)
                    displayName: 'col5',
                    queryName: 'col5',
                    isMeasure: false,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                    roles: { Series: true },
                },
            ]
        };

        it('Check convert highlight values - comboChart mode', () => {
            // highlights only come when using comboChart.capabilities,
            // and line charts can't render partial-highlights. lineChart should render the highlight values only.
            let dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['Cabernet', 'Merlot', 'Malbec']
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [2, 4, 6],
                        highlights: [3, 2, 1],
                    }])
                }
            };
            let seriesData = LineChart.converter(dataView, blankCategoryValue, colors, false /*isScalar*/).series[0].data;
            let actualData = _.pluck(seriesData, 'value');
            let expectedData = [3, 2, 1];
            expect(actualData).toEqual(expectedData);
        });

        function lineChartDomValidation(interactiveChart: boolean) {
            let v: powerbi.IVisual, element: JQuery;
            let dataViewMetadata: powerbi.DataViewMetadata = {
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
                        objects: { general: { formatString: '0.###' } },
                        roles: { Y: true },
                    },
                    {
                        displayName: 'col3',
                        queryName: 'col3',
                        isMeasure: false,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime),
                        objects: { general: { formatString: 'd' } },
                        roles: { Y: true },
                    },
                    {
                        displayName: 'col4',
                        queryName: 'col4',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer),
                        objects: { general: { formatString: '0' } },
                        roles: { Y: true },
                    }],
            };
            let dataViewMetadataWithScalarObject = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithScalarObject.objects = { categoryAxis: { scalar: true } };

            beforeEach(() => {
                element = powerbitests.helpers.testDom('500', '500');
                v = new LineChartVisualBuilder().build();
                v.init({
                    element: element,
                    host: hostServices,
                    style: powerbi.visuals.visualStyles.create(),
                    viewport: {
                        height: element.height(),
                        width: element.width()
                    },
                    animation: { transitionImmediate: true },
                    interactivity: { isInteractiveLegend: interactiveChart },
                });
            });

            function getOptionsForValuesWarning(values: number[]) {
                let options = {
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: values,
                                subtotal: 246500
                            }])
                        }
                    }]
                };
                return options;
            }

            it('NaN in values shows a warning', (done) => {
                let warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                let options = getOptionsForValuesWarning([NaN, 495000, 490000, 480000, 500000]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).toHaveBeenCalled();
                    expect(warningSpy.calls.count()).toBe(1);
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('NaNNotSupported');
                    done();
                }, DefaultWaitForRender);
            });

            it('Negative Infinity in values shows a warning', (done) => {
                let warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                let options = getOptionsForValuesWarning([Number.NEGATIVE_INFINITY, 495000, 490000, 480000, 500000]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).toHaveBeenCalled();
                    expect(warningSpy.calls.count()).toBe(1);
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('InfinityValuesNotSupported');
                    done();
                }, DefaultWaitForRender);
            });

            it('Positive Infinity in values shows a warning', (done) => {
                let warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                let options = getOptionsForValuesWarning([Number.POSITIVE_INFINITY, 495000, 490000, 480000, 500000]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).toHaveBeenCalled();
                    expect(warningSpy.calls.count()).toBe(1);
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('InfinityValuesNotSupported');
                    done();
                }, DefaultWaitForRender);
            });

            it('Out of range value in values shows a warning', (done) => {
                let warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                let options = getOptionsForValuesWarning([-1e301, 495000, 490000, 480000, 500000]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).toHaveBeenCalled();
                    expect(warningSpy.calls.count()).toBe(1);
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('ValuesOutOfRange');
                    done();
                }, DefaultWaitForRender);
            });

            it("Log scale doesn't show warning for positive not zero values.", (done)=> {
                let options = getOptionsForValuesWarning([5000, 495000, 490000, 480000, 500000]);
                let logMetadata = _.cloneDeep(dataViewMetadata);
                logMetadata.objects = {};
                logMetadata.objects["valueAxis"] = {
                    show: true,
                    start: 1,
                    showAxisTitle: true,
                    axisStyle: true,
                    axisScale: AxisScale.log
                };
                options.dataViews[0].metadata = logMetadata;

                let warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).not.toHaveBeenCalled();
                    done();
                }, DefaultWaitForRender);
            });

            it("Log scale shows warning for zero values.", (done) => {
                let options = getOptionsForValuesWarning([0, 495000, 490000, 480000, 500000]);
                let logMetadata = _.cloneDeep(dataViewMetadata);
                logMetadata.objects = {};
                logMetadata.objects["valueAxis"] = {
                    show: true,
                    start: 1,
                    showAxisTitle: true,
                    axisStyle: true,
                    axisScale: AxisScale.log
                };
                options.dataViews[0].metadata = logMetadata;

                let warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).toHaveBeenCalled();
                    expect(warningSpy.calls.count()).toBe(1);
                    done();
                }, DefaultWaitForRender);
            });

            it('All okay in values does not show a warning', (done) => {
                let warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                let options = getOptionsForValuesWarning([480000, 495000, 490000, 480000, 500000]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).not.toHaveBeenCalled();
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart dom validation', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
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
                    expect(helpers.getAxisTicks('x').length).toBeGreaterThan(0);
                    expect(helpers.getAxisTicks('y').length).toBeGreaterThan(0);
                    expect(helpers.findElementText(helpers.getAxisTicks('y').find('text').first())).toBe('480K');
                    expect(helpers.findElementTitle(helpers.getAxisTicks('y').find('text').first())).toBe('480K');

                    if (interactiveChart) {
                        expect(LineChart.getInteractiveLineChartDomElement(element)).toBeDefined();
                    }
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart renders no interactivity lines when not in interactive mode', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
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
                    expect($('.interactivity-line').length).toEqual(interactiveChart ? 0 : 1);
                    done();
                }, DefaultWaitForRender);
            });

            it('verify viewport when filtering data', (done) => {
                // Clone in order to keep the original as it is
                let dataViewMeta = _.clone(dataViewMetadata);
                dataViewMeta.objects = {
                    categoryAxis: {
                        show: true,
                        start: 490001,
                        end: 495001,
                        axisType: AxisType.scalar,
                        showAxisTitle: true,
                        axisStyle: true
                    }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
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

                let graphicsBox = $('.mainGraphicsContext')[0].getBoundingClientRect();
                if (interactiveChart) {
                    setTimeout(() => {
                        expect(Helpers.isInRange(graphicsBox.height, 398, 402)).toBe(true);
                        expect(Helpers.isInRange(graphicsBox.width, 384, 391)).toBe(true);
                        done();
                    }, DefaultWaitForRender);
                }
                else {
                    setTimeout(() => {
                        expect(Helpers.isInRange(graphicsBox.height, 468, 472)).toBe(true);
                        expect(Helpers.isInRange(graphicsBox.width, 384, 391)).toBe(true);
                        done();
                    }, DefaultWaitForRender);
                }
            });

            it('ensure line chart is cleared when an empty dataview is applied', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
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
                    let catCount = $('.lineChart').find('.line').length;
                    expect(catCount).toBe(1);
                    v.onDataChanged({
                        dataViews: [{
                            metadata: dataViewMetadata,
                            categorical: {
                                categories: [{
                                    source: dataViewMetadata.columns[0],
                                    values: []
                                }],
                                values: DataViewTransform.createValueColumns([])
                            }
                        }]
                    });
                    setTimeout(() => {
                        let catCountNew = $('.lineChart').find('.line').length;
                        expect(catCountNew).toBe(0);
                        done();
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });

            it('line chart check if date time axis has margin allocated in DOM', (done) => {
                let dateTimeColumnsMetadata: powerbi.DataViewMetadata = {
                    columns: [
                        { displayName: 'Date', queryName: 'col1', type: ValueType.fromDescriptor({ dateTime: true }), roles: { Category: true } },
                        { displayName: 'PowerBI Customers', queryName: 'col2', isMeasure: true, roles: { Y: true } }]
                };

                let dataView: powerbi.DataView = {
                    metadata: dateTimeColumnsMetadata,
                    categorical: {
                        categories: [{
                            source: dateTimeColumnsMetadata.columns[0],
                            values: [new Date('2014/9/25'), new Date('2014/12/12'), new Date('2015/9/25')]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dateTimeColumnsMetadata.columns[1],
                            values: [8000, 20000, 1000000],
                        }])
                    }
                };

                v.onDataChanged({ dataViews: [dataView] });

                setTimeout(() => {
                    let ticks = helpers.getAxisTicks('x').find('text');
                    expect(ticks.length).toBe(4);
                    let expectedValues = [
                        'Sep 2014',
                        'Jan 2015',
                        'May 2015',
                        'Sep 2015'];

                    for (let i = 0, ilen = ticks.length; i < ilen; i++) {
                        let tick = helpers.findElementText(ticks.eq(i));
                        let tickDate = new Date(tick).toUTCString();
                        let expectedDate = new Date(expectedValues[i]).toUTCString();
                        expect(tickDate).toEqual(expectedDate);
                    }
                    done();
                }, DefaultWaitForRender);
            });

            it('Line chart with an undefined domain', (done) => {
                let dateTimeColumnsMetadata: powerbi.DataViewMetadata = {
                    columns: [
                        { displayName: 'Date', queryName: 'Date', type: ValueType.fromDescriptor({ dateTime: true }), roles: { Category: true } },
                        { displayName: 'PowerBI Fans', queryName: 'PowerBI Fans', isMeasure: true, type: ValueType.fromDescriptor({ numeric: true }), roles: { Y: true } }]
                };

                let dataView: powerbi.DataView = {
                    metadata: dateTimeColumnsMetadata,
                    categorical: {
                        categories: [{
                            source: dateTimeColumnsMetadata.columns[0],
                            values: []
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dateTimeColumnsMetadata.columns[1],
                            values: [],
                        }])
                    }
                };

                v.onDataChanged({ dataViews: [dataView] });

                setTimeout(() => {
                    expect(helpers.getAxisTicks('x').length).toBe(0);
                    expect(helpers.getAxisTicks('y').length).toBe(0);
                    done();
                }, DefaultWaitForRender);

            });

            it('line chart with small interval dom validation', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [1.000, 0.995, 0.990, 0.985, 0.995],
                                subtotal: 4.965
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    expect(helpers.getAxisTicks('x').length).toBeGreaterThan(0);
                    expect(helpers.getAxisTicks('y').length).toBeGreaterThan(0);
                    expect(helpers.findElementText(helpers.getAxisTicks('y').find('text').first())).toBe('0.984');
                    expect(helpers.findElementTitle(helpers.getAxisTicks('y').find('text').first())).toBe('0.984');
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart validate auto margin', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['ReallyLongValuesSoYouRotate1', 'ReallyLongValuesSoYouRotate2', 'ReallyLongValuesSoYouRotate3', 'ReallyLongValuesSoYouRotate4', 'ReallyLongValuesSoYouRotate5']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[3],
                                values: [50000, 45000, 49000, 48000, 52000],
                            }])
                        }
                    }]
                });
                setTimeout(() => {

                    let yTranslate = SVGUtil.parseTranslateTransform($('.lineChart.axisGraphicsContext .x.axis').attr('transform')).y;
                    let xTranslate = parseFloat($('.lineChart.axisGraphicsContext').attr('transform').split(',')[0].split('(')[1]);
                    v.onDataChanged({
                        dataViews: [{
                            metadata: dataViewMetadata,
                            categorical: {
                                categories: [{
                                    source: dataViewMetadata.columns[0],
                                    values: ['a', 'b', 'c', 'd', 'e']
                                }],
                                values: DataViewTransform.createValueColumns([{
                                    source: dataViewMetadata.columns[3],
                                    values: [0, 1, 2, 3, 4],
                                }])
                            }
                        }]
                    });
                    setTimeout(() => {
                        let newYTranslate = parseFloat($('.lineChart.axisGraphicsContext .x.axis').attr('transform').split(',')[1].replace('(', ''));
                        let newXTranslate = parseFloat($('.lineChart.axisGraphicsContext').attr('transform').split(',')[0].split('(')[1]);
                        expect(yTranslate).toBeLessThan(newYTranslate);
                        expect(xTranslate).toBeGreaterThan(newXTranslate);
                        done();
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });

            it('line chart multi-series dom validation', (done) => {
                let metadata: powerbi.DataViewMetadata = {
                    columns: [
                        {
                            displayName: 'col1',
                            queryName: 'col1',
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                            roles: { Category: true }
                        },
                        {
                            displayName: 'col2',
                            queryName: 'col2',
                            isMeasure: true,
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                            roles: { Y: true }
                        },
                        {
                            displayName: 'col3',
                            queryName: 'col3',
                            isMeasure: true,
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                            roles: { Y: true }
                        }]
                };

                let seriesIdentities = [
                    mocks.dataViewScopeIdentity('col2'),
                    mocks.dataViewScopeIdentity('col3'),
                ];

                let measureColumn: powerbi.DataViewMetadataColumn = { displayName: 'sales', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) };
                let col3Ref = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'sales' });

                let valueColumns = DataViewTransform.createValueColumns([
                    {
                        source: metadata.columns[1],
                        values: [110, 120, 130, 140, 150],
                        identity: seriesIdentities[0],
                    }, {
                        source: metadata.columns[2],
                        values: [210, 220, 230, 240, 250],
                        identity: seriesIdentities[1],
                    }],
                    [col3Ref]);
                valueColumns.source = measureColumn;

                v.onDataChanged({
                    dataViews: [{
                        metadata: metadata,
                        categorical: {
                            categories: [{
                                source: metadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e'],
                                identityFields: [categoryColumnRef],
                            }],
                            values: valueColumns
                        }
                    }]
                });

                setTimeout(() => {
                    let lines = $('.lineChart .mainGraphicsContext .line');
                    expect(lines.length).toEqual(2);
                    let lineOne = $(lines.get(0)).attr('style');
                    expect(lineOne).toBeDefined();
                    let lineTwo = $(lines.get(1)).attr('style');
                    expect(lineTwo).toBeDefined();
                    if (!interactiveChart) {
                        expect(helpers.findElementText($('.legendTitle'))).toBe('sales');
                        expect(helpers.findElementTitle($('.legendTitle'))).toBe('sales');
                    }
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart with nulls dom validation', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [0, 10, null, 15, 5],
                                subtotal: 20
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.lineChart .mainGraphicsContext .line')[0].getAttribute('d')).toBeDefined();
                    done();
                }, DefaultWaitForRender);
            });

            it('Regression Test: Ensure chart does not miraculously shrink with data updates', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [1, 2, 3, 4, 5],
                                subtotal: 15
                            },
                                {
                                    source: dataViewMetadata.columns[1],
                                    values: [1, 2, 3, 4, 5],
                                    subtotal: 15
                                }])
                        }
                    }]
                });

                setTimeout(() => {
                    let svg = $('.lineChart svg');
                    let height = svg.height();

                    //expect(svg.length).toBe(3);

                    for (let i = 0; i < 5; i++) {
                        v.onDataChanged({
                            dataViews: [{
                                metadata: dataViewMetadata,
                                categorical: {
                                    categories: [{
                                        source: dataViewMetadata.columns[0],
                                        values: ['a', 'b', 'c', 'd', 'e']
                                    }],
                                    values: DataViewTransform.createValueColumns([{
                                        source: dataViewMetadata.columns[1],
                                        values: [1, 2, 3, 4, 5],
                                        subtotal: 15
                                    },
                                        {
                                            source: dataViewMetadata.columns[1],
                                            values: [1, 2, 3, 4, 6],
                                            subtotal: 16
                                        }])
                                }
                            }]
                        });
                    }

                    setTimeout(function () {
                        let newHeight = $('.lineChart svg').height();
                        expect(newHeight).toBe(height);
                        done();
                    }, DefaultWaitForRender);

                }, DefaultWaitForRender);
            });

            it('line chart with null points dom validation (in the middle)', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [null, 10, null, 15, null],
                                subtotal: 15
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    let dots = $('.dot');
                    expect(dots.length).toBe(!interactiveChart ? 2 : 5);
                    let visibleDots = dots.filter('[r^="4"]');
                    expect(visibleDots.length).toBe(2);
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart with null points dom validation (first and last)', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [10, null, 5, null, 15],
                                subtotal: 15
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    let dots = $('.dot');
                    expect(dots.length).toBe(!interactiveChart ? 3 : 5);
                    let visibleDots = dots.filter('[r^="4"]');
                    expect(visibleDots.length).toBe(3);
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart with null points dom validation (first and last) - scalar does not draw dots', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithScalarObject,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[2],
                                values: [new Date("2014/1/1"), new Date("2014/2/1"), new Date("2014/3/1"), new Date("2014/4/1"), new Date("2014/5/1")]
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [10, null, 5, null, 15],
                                subtotal: 15
                            }])
                        },
                    }]
                });
                setTimeout(() => {
                    let dots = $('.dot').filter('[r^="4"]');
                    expect(dots.length).toBe(0);
                    let lines = $('.lineChart .mainGraphicsContext .line');
                    expect(lines.length).toBe(1);
                    done();
                }, DefaultWaitForRender);
            });

            it('ensure selection circle is removed from dom when series is dropped', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [null, 10, null, 15, null],
                                subtotal: 15
                            },
                                {
                                    source: dataViewMetadata.columns[1],
                                    values: [null, 10, null, 15, null],
                                    subtotal: 15
                                }])
                        }
                    }]
                });
                setTimeout(() => {
                    let dots = $('.selection-circle');
                    expect(dots.length).toBe(!interactiveChart ? 0 : 2);
                    v.onDataChanged({
                        dataViews: [{
                            metadata: dataViewMetadata,
                            categorical: {
                                categories: [{
                                    source: dataViewMetadata.columns[0],
                                    values: ['a', 'b', 'c', 'd', 'e']
                                }],
                                values: DataViewTransform.createValueColumns([{
                                    source: dataViewMetadata.columns[1],
                                    values: [null, 10, null, 15, null],
                                    subtotal: 15
                                }])
                            }
                        }]
                    });
                    setTimeout(() => {
                        let dots = $('.selection-circle');
                        expect(dots.length).toBe(!interactiveChart ? 0 : 1);
                        done();
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });

            it('show highlights on line series', (done) => {
                let highlightColor = '#666666';
                let defaultColor = '#333333';
                let metadata: powerbi.DataViewMetadata = {
                    columns: [
                        dataViewMetadata.columns[0],
                        dataViewMetadata.columns[1],
                    ],
                    objects: { dataPoint: { defaultColor: { solid: { color: defaultColor } } } },
                };

                let dataView: powerbi.DataView = {
                    metadata: metadata,
                    categorical: {
                        categories: [{
                            source: metadata.columns[0],
                            values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                            objects: [{ dataPoint: { fill: { solid: { color: highlightColor } } } }, , ],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: metadata.columns[1],
                                values: [100, 200, 700],
                            }],
                            undefined,
                            metadata.columns[2])
                    },
                };

                v.onDataChanged({
                    dataViews: [dataView]
                });
                setTimeout(() => {
                    let highlights = $('.point');
                    expect(highlights.length).toBe(interactiveChart ? 0 : 1);
                    done();
                }, DefaultWaitForRender);
            });

            it('default color applied to all series without fill specified.', () => {
                let seriesId1 = SelectionId.createWithMeasure('col2');
                let seriesKey1 = seriesId1.getKey();
                let seriesId2 = SelectionId.createWithMeasure('col3');
                let seriesKey2 = seriesId2.getKey();
                let seriesId3 = SelectionId.createWithMeasure('col4');
                let seriesKey3 = seriesId3.getKey();
                let categoryIdentities = [
                    mocks.dataViewScopeIdentity('John Domo'),
                    mocks.dataViewScopeIdentity('Delta Force'),
                    mocks.dataViewScopeIdentity('Jean Tablau'),
                ];
                let specificIds = [
                    [
                        SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'col2', 'col1'),
                        SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'col2', 'col1'),
                        SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'col2', 'col1'),
                    ],
                    [
                        SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'col3', 'col1'),
                        SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'col3', 'col1'),
                        SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'col3', 'col1'),
                    ],
                    [
                        SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'col4', 'col1'),
                        SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'col4', 'col1'),
                        SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], 'col4', 'col1'),
                    ],
                ];

                let seriesColor = '#41BEE0';
                let defaultColor = '#333333';

                let metadata: powerbi.DataViewMetadata = {
                    columns: [
                        dataViewMetadata.columns[0],
                        powerbi.Prototype.inherit(dataViewMetadata.columns[1], c => c.objects = { dataPoint: { fill: { solid: { color: seriesColor } } } }),
                        dataViewMetadata.columns[2],
                        dataViewMetadata.columns[3],
                    ],
                    objects: { dataPoint: { defaultColor: { solid: { color: defaultColor } } } },
                };
                let dataView: powerbi.DataView = {
                    metadata: metadata,
                    categorical: {
                        categories: [{
                            source: metadata.columns[0],
                            values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: metadata.columns[1],
                                values: [100, 200, 700],
                            }, {
                                source: metadata.columns[2],
                                values: [700, 100, 200],
                            }, {
                                source: metadata.columns[3],
                                values: [200, 700, 100],
                            }],
                            undefined,
                            metadata.columns[4]),
                    },
                };
                let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLineChartLabelSettings();
                let actualData = LineChart.converter(dataView, blankCategoryValue, colors, false).series;
                let expectedData: powerbi.visuals.LineChartSeries[] =
                    [
                        {
                            displayName: dataView.metadata.columns[1].displayName,
                            key: seriesKey1,
                            lineIndex: 0,
                            color: seriesColor,
                            xCol: dataView.metadata.columns[0],
                            yCol: dataView.metadata.columns[1],
                            labelSettings: actualData[0].labelSettings,
                            data: [
                                {
                                    categoryValue: 'John Domo', value: 100,
                                    categoryIndex: 0,
                                    seriesIndex: 0,
                                    tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                                    identity: seriesId1,
                                    specificIdentity: specificIds[0][0],
                                    selected: false,
                                    key: JSON.stringify({ series: seriesKey1, category: categoryIdentities[0].key }),
                                    labelFill: labelColor,
                                    labelFormatString: undefined,
                                    labelSettings: defaultLabelSettings,
                                },
                                {
                                    categoryValue: 'Delta Force',
                                    value: 200,
                                    categoryIndex: 1,
                                    seriesIndex: 0,
                                    tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }],
                                    identity: seriesId1,
                                    specificIdentity: specificIds[0][1],
                                    selected: false,
                                    key: JSON.stringify({ series: seriesKey1, category: categoryIdentities[1].key }),
                                    labelFill: labelColor,
                                    labelFormatString: undefined,
                                    labelSettings: defaultLabelSettings,
                                },
                                {
                                    categoryValue: 'Jean Tablau',
                                    value: 700,
                                    categoryIndex: 2,
                                    seriesIndex: 0,
                                    tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                                    identity: seriesId1,
                                    specificIdentity: specificIds[0][2],
                                    selected: false,
                                    key: JSON.stringify({ series: seriesKey1, category: categoryIdentities[2].key }),
                                    labelFill: labelColor,
                                    labelFormatString: undefined,
                                    labelSettings: defaultLabelSettings,
                                },
                            ],
                            identity: seriesId1,
                            selected: false
                        },
                        {
                            displayName: dataView.metadata.columns[2].displayName,
                            key: seriesKey2,
                            lineIndex: 1,
                            color: defaultColor,
                            xCol: dataView.metadata.columns[0],
                            yCol: dataView.metadata.columns[2],
                            labelSettings: actualData[1].labelSettings,
                            data: [
                                {
                                    categoryValue: 'John Domo',
                                    value: 700,
                                    categoryIndex: 0,
                                    seriesIndex: 1,
                                    tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col3", value: "700" }],
                                    identity: seriesId2,
                                    specificIdentity: specificIds[1][0],
                                    selected: false,
                                    key: JSON.stringify({ series: seriesKey2, category: categoryIdentities[0].key }),
                                    labelFill: labelColor,
                                    labelFormatString: undefined,
                                    labelSettings: defaultLabelSettings,
                                },
                                {
                                    categoryValue: 'Delta Force',
                                    value: 100,
                                    categoryIndex: 1,
                                    seriesIndex: 1,
                                    tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col3", value: "100" }],
                                    identity: seriesId2,
                                    specificIdentity: specificIds[1][1],
                                    selected: false,
                                    key: JSON.stringify({ series: seriesKey2, category: categoryIdentities[1].key }),
                                    labelFill: labelColor,
                                    labelFormatString: undefined,
                                    labelSettings: defaultLabelSettings,
                                },
                                {
                                    categoryValue: 'Jean Tablau',
                                    value: 200,
                                    categoryIndex: 2,
                                    seriesIndex: 1,
                                    tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col3", value: "200" }],
                                    identity: seriesId2,
                                    specificIdentity: specificIds[1][2],
                                    selected: false,
                                    key: JSON.stringify({ series: seriesKey2, category: categoryIdentities[2].key }),
                                    labelFill: labelColor,
                                    labelFormatString: undefined,
                                    labelSettings: defaultLabelSettings,
                                },
                            ],
                            identity: seriesId2,
                            selected: false
                        },
                        {
                            displayName: dataView.metadata.columns[3].displayName,
                            key: seriesKey3,
                            lineIndex: 2,
                            color: defaultColor,
                            xCol: dataView.metadata.columns[0],
                            yCol: dataView.metadata.columns[3],
                            labelSettings: actualData[2].labelSettings,
                            data: [
                                {
                                    categoryValue: 'John Domo',
                                    value: 200,
                                    categoryIndex: 0,
                                    seriesIndex: 2,
                                    tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col4", value: "200" }],
                                    identity: seriesId3,
                                    specificIdentity: specificIds[2][0],
                                    selected: false,
                                    key: JSON.stringify({ series: seriesKey3, category: categoryIdentities[0].key }),
                                    labelFill: labelColor,
                                    labelFormatString: undefined,
                                    labelSettings: defaultLabelSettings,
                                },
                                {
                                    categoryValue: 'Delta Force',
                                    value: 700,
                                    categoryIndex: 1,
                                    seriesIndex: 2,
                                    tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col4", value: "700" }],
                                    identity: seriesId3,
                                    specificIdentity: specificIds[2][1],
                                    selected: false,
                                    key: JSON.stringify({ series: seriesKey3, category: categoryIdentities[1].key }),
                                    labelFill: labelColor,
                                    labelFormatString: undefined,
                                    labelSettings: defaultLabelSettings,
                                },
                                {
                                    categoryValue: 'Jean Tablau',
                                    value: 100,
                                    categoryIndex: 2,
                                    seriesIndex: 2,
                                    tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col4", value: "100" }],
                                    identity: seriesId3,
                                    specificIdentity: specificIds[2][2],
                                    selected: false,
                                    key: JSON.stringify({ series: seriesKey3, category: categoryIdentities[2].key }),
                                    labelFill: labelColor,
                                    labelFormatString: undefined,
                                    labelSettings: defaultLabelSettings,
                                },
                            ],
                            identity: seriesId3,
                            selected: false,
                        },
                    ];

                expect(actualData).toEqualDeep(expectedData);
            });

            it('line chart non-category multi-measure dom validation', (done) => {
                let metadata: powerbi.DataViewMetadata = {
                    columns: [
                        { displayName: 'col1', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y: true } },
                        { displayName: 'col2', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y: true } }
                    ]
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: metadata,
                        categorical: {
                            values: DataViewTransform.createValueColumns([
                                {
                                    source: dataViewMetadata.columns[1],
                                    values: [100]
                                }, {
                                    source: dataViewMetadata.columns[2],
                                    values: [200]
                                }])
                        }
                    }]
                });
                setTimeout(() => {
                    if (interactiveChart) {
                        expect($('.lineChart .hover-line .selection-circle').length).toEqual(2);
                        expect($('.lineChart .hover-line .selection-circle:eq(0)').attr('r')).toEqual('4');
                        expect($('.lineChart .hover-line .selection-circle:eq(1)').attr('r')).toEqual('4');
                    } else {
                        expect($('.lineChart')).toBeInDOM();
                    }

                    done();
                }, DefaultWaitForRender);
            });

            it('line chart series only dom validation', (done) => {
                let metadata: powerbi.DataViewMetadata = {
                    columns: [
                        {
                            displayName: 'col1',
                            queryName: 'col1',
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                            roles: { Category: true }
                        },
                        {
                            displayName: 'col2',
                            queryName: 'col2',
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                            roles: { Y: true }
                        }
                    ]
                };
                v.onDataChanged({
                    dataViews: [DataViewPivotCategorical.apply({
                        metadata: metadata,
                        categorical: {
                            categories: [{
                                source: metadata.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [
                                    mocks.dataViewScopeIdentity('a'),
                                    mocks.dataViewScopeIdentity('b'),
                                    mocks.dataViewScopeIdentity('c'),
                                ],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([
                                {
                                    source: dataViewMetadata.columns[1],
                                    values: [1, 2, 3]
                                }])
                        }
                    })]
                });
                setTimeout(() => {
                    if (interactiveChart) {
                        expect($('.lineChart .hover-line .selection-circle').length).toEqual(3);
                        expect($('.lineChart .hover-line .selection-circle:eq(0)').attr('r')).toEqual('4');
                        expect($('.lineChart .hover-line .selection-circle:eq(1)').attr('r')).toEqual('4');
                        expect($('.lineChart .hover-line .selection-circle:eq(2)').attr('r')).toEqual('4');
                    } else {
                        expect($('.lineChart')).toBeInDOM();
                    }

                    done();
                }, DefaultWaitForRender);
            });

            it('empty line chart dom validation', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: []
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    expect(helpers.getAxisTicks('x').length).toBe(0);
                    expect(helpers.getAxisTicks('y').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart with single point dom validation', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [4]
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    let dots = $('.dot');
                    expect(dots.length).toBe(1);

                    let visibleDots = dots.filter('[r^="4"]');
                    expect(visibleDots.length).toBe(1);

                    if (interactiveChart) {
                        expect($('.lineChart .hover-line .selection-circle').length).toEqual(1);
                        expect($('.lineChart .hover-line .selection-circle:eq(0)').attr('r')).toEqual('4');
                    }

                    expect(helpers.getAxisTicks('x').length).toBe(1);
                    expect(helpers.getAxisTicks('y').length).toBeGreaterThan(0);
                    //asset text and title values
                    expect(helpers.findElementText(helpers.getAxisTicks('y').find('text').last())).toBe('5');
                    expect(helpers.findElementTitle(helpers.getAxisTicks('y').find('text').last())).toBe('5');

                    done();
                }, DefaultWaitForRender);
            });

            it('line chart does not show less ticks dom validation', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [26.125, 26.125]
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    expect(helpers.getAxisTicks('x').length).toBeGreaterThan(1);
                    //asset text and title values
                    expect(helpers.findElementText(helpers.getAxisTicks('y').find('text').last())).toBe('30');
                    expect(helpers.findElementTitle(helpers.getAxisTicks('y').find('text').last())).toBe('30');
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart shows less ticks dom validation', (done) => {
                let dataViewMetadata: powerbi.DataViewMetadata = {
                    columns: [
                        {
                            displayName: 'col1',
                            queryName: 'col1',
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                            roles: { Category: true }
                        },
                        {
                            displayName: 'col2',
                            queryName: 'col2',
                            isMeasure: true,
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                            roles: { Y: true }
                        }],
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [5, 5]
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    expect(helpers.getAxisTicks('x').length).toBe(2);
                    expect(helpers.findElementText(helpers.getAxisTicks('y').find('text').last())).toBe('6');
                    expect(helpers.findElementTitle(helpers.getAxisTicks('y').find('text').last())).toBe('6');
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart shows less ticks with scalar keys dom validation', (done) => {
                let dataViewMetadata: powerbi.DataViewMetadata = {
                    columns: [
                        {
                            displayName: 'col1',
                            queryName: 'col1',
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime),
                            roles: { Category: true }
                        },
                        {
                            displayName: 'col2',
                            queryName: 'col2',
                            isMeasure: true,
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                            roles: { Y: true }
                        }],
                };

                let dataView = {
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: [new Date(2014, 2, 27), new Date(2015, 6, 5)],
                            objects: []
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [5, 5]
                        }])
                    }
                };

                let scalarKeys: ScalarKeys = {
                    values: [{
                        min: new Date(2014, 0, 1)
                            }, {
                        min: new Date(2015, 0, 1)
                    }]
                };

                InjectScalarKeys(dataView.categorical.categories[0].objects, scalarKeys);

                v.onDataChanged({
                    dataViews: [dataView]
                });

                // number of ticks on the scalar axis should be no greater than number of scalar keys
                setTimeout(() => {
                    expect(helpers.getAxisTicks('x').length).toBeLessThan(scalarKeys.values.length + 1);
                    expect(helpers.findElementText(helpers.getAxisTicks('y').find('text').last())).toBe('6');
                    expect(helpers.findElementTitle(helpers.getAxisTicks('y').find('text').last())).toBe('6');
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart on small tile shows at least two tick lines dom validation', (done) => {
                v.onResizing({
                    height: 115,
                    width: 226
                });
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b', 'c']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [0.1495, 0.15, 0.1633]
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    expect(helpers.getAxisTicks('y').length).toBeGreaterThan(1);
                    expect(helpers.findElementText(helpers.getAxisTicks('y').find('text').first())).toBe('0.15');
                    expect(helpers.findElementText(helpers.getAxisTicks('y').find('text').last())).toBe('0.16');
                    //validate titles
                    expect(helpers.findElementTitle(helpers.getAxisTicks('y').find('text').first())).toBe('0.15');
                    expect(helpers.findElementTitle(helpers.getAxisTicks('y').find('text').last())).toBe('0.16');
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart zero axis line is darkened', (done) => {
                let metadata: powerbi.DataViewMetadata = {
                    columns: [
                        {
                            displayName: 'col1',
                            isMeasure: false,
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                            roles: { Category: true },
                        },
                        {
                            displayName: 'col2',
                            isMeasure: false,
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                            roles: { Y: true },
                        }
                    ]
                };
                v.onDataChanged({
                    dataViews: [DataViewPivotCategorical.apply({
                        metadata: metadata,
                        categorical: {
                            categories: [{
                                source: metadata.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [
                                    mocks.dataViewScopeIdentity('a'),
                                    mocks.dataViewScopeIdentity('b'),
                                    mocks.dataViewScopeIdentity('c'),
                                ],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([
                                {
                                    source: dataViewMetadata.columns[1],
                                    values: [-1, 2, -3]
                                }])
                        }
                    })]
                });
                setTimeout(() => {
                    let zeroTicks = $('g.tick:has(line.zero-line)');

                    expect(zeroTicks.length).toBe(1);
                    zeroTicks.each(function (i, item) {
                        expect(d3.select(item).datum() === 0).toBe(true);
                    });

                    done();
                }, DefaultWaitForRender);
            });

            it('line chart validate word breaking axis labels', (done) => {
                // Word break will only tend to trigger when graphs are wider than they are high
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['Some ReallyLongValuesSoYouTruncate1 Words', 'ReallyLongValuesSoYouTruncate2 Some Words', 'Some Words ReallyLongValuesSoYouTruncate3']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[3],
                                values: [50000, 45000, 49000],
                            }])
                        }
                    }],
                });
                v.onResizing({ height: 320, width: 640 });

                setTimeout(() => {
                    let tickLabels = helpers.getAxisTicks('x').find('text');
                    let tspans = tickLabels.find('tspan');
                    expect(tspans.length).toBeGreaterThan(6);
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart word breaking does not occur if any value requires rotation (does not have word break character, e.g. space)', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['Some ReallyLongValuesSoYouTruncate1 Words', 'ReallyLongValuesSoYouTruncate2 Some Words', 'Some Words ReallyLongValuesSoYouTruncate3', 'ReallyLongValuesSoYouTruncate4']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[3],
                                values: [50000, 45000, 49000, 48000],
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    let tickLabels = helpers.getAxisTicks('x').find('text');
                    let tspans = tickLabels.find('tspan');
                    expect(tspans.length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart reference line extends y scale validation', (done) => {
                let refLineColor1 = '#ff0000';
                let maxValue: number = 1000;

                let metadata: powerbi.DataViewMetadata = {
                    columns: [
                        dataViewMetadata.columns[0],
                        dataViewMetadata.columns[1],
                    ],
                    objects: {
                        y1AxisReferenceLine: [{
                            id: '0',
                            object: {
                                show: true,
                                value: 450,
                                lineColor: { solid: { color: refLineColor1 } },
                                transparency: 60,
                                style: lineStyle.dashed,
                                position: powerbi.visuals.referenceLinePosition.back,
                                dataLabelShow: true,
                                dataLabelColor: { solid: { color: refLineColor1 } },
                                dataLabelDecimalPoints: 0,
                                dataLabelHorizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                                dataLabelVerticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                            },
                        },
                    ]},
                };

                let dataView: powerbi.DataView = {
                    metadata: metadata,
                    categorical: {
                        categories: [{
                            source: metadata.columns[0],
                            values: ['John Domo', 'Delta Force', 'Jean Tablau']
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: metadata.columns[1],
                                values: [100, 200, maxValue],
                            }])
                    },
                };

                v.onDataChanged({
                    dataViews: [dataView]
                });

                setTimeout(() => {
                    let labels = helpers.getAxisTicks('y');
                    let yAxisMaxValueBefore: number = parseInt(labels[labels.length - 1].textContent, 10);

                    metadata.objects = {
                        y1AxisReferenceLine: [{
                            id: '0',
                            object: {
                                show: true,
                                value: maxValue + 500,
                                lineColor: { solid: { color: refLineColor1 } },
                                transparency: 0,
                                style: lineStyle.dotted,
                                position: powerbi.visuals.referenceLinePosition.front,
                                dataLabelShow: true,
                                dataLabelColor: { solid: { color: refLineColor1 } },
                                dataLabelDecimalPoints: 0,
                                dataLabelHorizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                                dataLabelVerticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                            },
                        }],
                    };

                    v.onDataChanged({
                        dataViews: [dataView]
                    });
                    setTimeout(() => {
                        labels = helpers.getAxisTicks('y');
                        let yAxisMaxValueAfter: number = parseInt(labels[labels.length - 1].textContent, 10);
                        expect(yAxisMaxValueAfter > yAxisMaxValueBefore).toEqual(true);

                        done();
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });

            it('line chart reference line dom validation', (done) => {
                let refLineColor1 = '#ff0000';
                let refLineColor2 = '#ff00ff';
                let metadata: powerbi.DataViewMetadata = {
                    columns: [
                        dataViewMetadata.columns[0],
                        dataViewMetadata.columns[1],
                    ],
                };

                let dataView: powerbi.DataView = {
                    metadata: metadata,
                    categorical: {
                        categories: [{
                            source: metadata.columns[0],
                            values: ['John Domo', 'Delta Force', 'Jean Tablau']
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: metadata.columns[1],
                                values: [100, 200, 700],
                            }],
                            undefined,
                            metadata.columns[2])
                    },
                };

                let yAxisReferenceLine: powerbi.DataViewObject = {
                    show: true,
                    value: 450,
                    lineColor: { solid: { color: refLineColor1 } },
                    transparency: 60,
                    style: lineStyle.dashed,
                    position: powerbi.visuals.referenceLinePosition.back,
                    dataLabelShow: true,
                    dataLabelColor: { solid: { color: refLineColor1 } },
                    dataLabelDecimalPoints: 0,
                    dataLabelHorizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                    dataLabelVerticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                    dataLabelDisplayUnits: 0,
                };

                dataView.metadata.objects = {
                    y1AxisReferenceLine: [
                        {
                            id: '0',
                            object: yAxisReferenceLine,
                        }
                    ]
                };

                v.onDataChanged({
                    dataViews: [dataView]
                });

                setTimeout(() => {
                    let graphicsContext = $('.lineChart .lineChartSVG');

                    let yLine = $('.y1-ref-line');
                    let yLabel = $('.labelGraphicsContext .label').eq(0);
                    helpers.verifyReferenceLine(
                        yLine,
                        yLabel,
                        graphicsContext,
                        {
                            inFront: false,
                            isHorizontal: true,
                            color: refLineColor1,
                            style: lineStyle.dashed,
                            opacity: 0.4,
                            label: {
                                color: refLineColor1,
                                horizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                                text: '450',
                                verticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                                displayUnits: 0,
                            },
                        });

                    yAxisReferenceLine['lineColor'] = { solid: { color: refLineColor2 } };
                    yAxisReferenceLine['transparency'] = 0;
                    yAxisReferenceLine['style'] = lineStyle.dotted;
                    yAxisReferenceLine['position'] = powerbi.visuals.referenceLinePosition.front;
                    yAxisReferenceLine['dataLabelColor'] = { solid: { color: refLineColor2 } };
                    yAxisReferenceLine['dataLabelDisplayUnits'] = 1000000;

                    v.onDataChanged({
                        dataViews: [dataView]
                    });

                    setTimeout(() => {
                        yLine = $('.y1-ref-line');
                        yLabel = $('.labelGraphicsContext .label').eq(0);
                        helpers.verifyReferenceLine(
                            yLine,
                            yLabel,
                            graphicsContext,
                            {
                                inFront: true,
                                isHorizontal: true,
                                color: refLineColor2,
                                style: lineStyle.dotted,
                                opacity: 1.0,
                                label: {
                                    color: refLineColor2,
                                    horizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                                    text: '0M',
                                    verticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                                    displayUnits: 1000000,
                                },
                            });

                        yAxisReferenceLine['show'] = false;
                        yAxisReferenceLine['dataLabelShow'] = false;

                        v.onDataChanged({
                            dataViews: [dataView]
                        });

                        setTimeout(() => {
                            expect($('.y1-ref-line').length).toBe(0);
                            expect($('.columnChart .labelGraphicsContext .label').length).toBe(0);

                            done();
                        }, DefaultWaitForRender);
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });

            it('line chart reference line dom validation with values', (done) => {
                let refLineColor1 = '#ff0000';
                let refLineColor2 = '#ff00ff';
                let metadata: powerbi.DataViewMetadata = {
                    columns: [
                        dataViewMetadata.columns[0],
                        dataViewMetadata.columns[1],
                    ],
                };

                let dataView: powerbi.DataView = {
                    metadata: metadata,
                    categorical: {
                        categories: [{
                            source: metadata.columns[0],
                            values: ['John Domo', 'Delta Force', 'Jean Tablau']
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: metadata.columns[1],
                                values: [12000, 20000, 37000],
                            }],
                            undefined,
                            metadata.columns[2])
                    },
                };

                let yAxisReferenceLine: powerbi.DataViewObject = {
                    show: true,
                    value: 16000,
                    lineColor: { solid: { color: refLineColor1 } },
                    transparency: 60,
                    style: lineStyle.dashed,
                    position: powerbi.visuals.referenceLinePosition.back,
                    dataLabelShow: true,
                    dataLabelColor: { solid: { color: refLineColor1 } },
                    dataLabelDecimalPoints: 0,
                    dataLabelHorizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                    dataLabelVerticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                    dataLabelDisplayUnits: 0,
                };

                dataView.metadata.objects = {
                    y1AxisReferenceLine: [
                        {
                            id: '0',
                            object: yAxisReferenceLine,
                        }
                    ]
                };

                v.onDataChanged({
                    dataViews: [dataView]
                });

                setTimeout(() => {
                    let graphicsContext = $('.lineChart .lineChartSVG');

                    let yLine = $('.y1-ref-line');
                    let yLabel = $('.labelGraphicsContext .label').eq(0);
                    helpers.verifyReferenceLine(
                        yLine,
                        yLabel,
                        graphicsContext,
                        {
                            inFront: false,
                            isHorizontal: true,
                            color: refLineColor1,
                            style: lineStyle.dashed,
                            opacity: 0.4,
                            label: {
                                color: refLineColor1,
                                horizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                                text: '16000',
                                verticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                                displayUnits: 0,
                            },
                        });

                    yAxisReferenceLine['lineColor'] = { solid: { color: refLineColor2 } };
                    yAxisReferenceLine['transparency'] = 0;
                    yAxisReferenceLine['style'] = lineStyle.dotted;
                    yAxisReferenceLine['position'] = powerbi.visuals.referenceLinePosition.front;
                    yAxisReferenceLine['dataLabelColor'] = { solid: { color: refLineColor2 } };
                    yAxisReferenceLine['dataLabelDisplayUnits'] = 1000;

                    v.onDataChanged({
                        dataViews: [dataView]
                    });

                    setTimeout(() => {
                        yLine = $('.y1-ref-line');
                        yLabel = $('.labelGraphicsContext .label').eq(0);
                        helpers.verifyReferenceLine(
                            yLine,
                            yLabel,
                            graphicsContext,
                            {
                                inFront: true,
                                isHorizontal: true,
                                color: refLineColor2,
                                style: lineStyle.dotted,
                                opacity: 1.0,
                                label: {
                                    color: refLineColor2,
                                    horizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                                    text: '16K',
                                    verticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                                    displayUnits: 1000,
                                },
                            });

                        yAxisReferenceLine['show'] = false;
                        yAxisReferenceLine['dataLabelShow'] = false;

                        v.onDataChanged({
                            dataViews: [dataView]
                        });

                        setTimeout(() => {
                            expect($('.y1-ref-line').length).toBe(0);
                            expect($('.columnChart .labelGraphicsContext .label').length).toBe(0);

                            done();
                        }, DefaultWaitForRender);
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });

            it('line chart reference line dom validation label precision', (done) => {
                let refLineColor1 = '#ff0000';
                let refLineColor2 = '#ff00ff';
                let metadata: powerbi.DataViewMetadata = {
                    columns: [
                        dataViewMetadata.columns[0],
                        dataViewMetadata.columns[1],
                    ],
                };

                let dataView: powerbi.DataView = {
                    metadata: metadata,
                    categorical: {
                        categories: [{
                            source: metadata.columns[0],
                            values: ['John Domo', 'Delta Force', 'Jean Tablau']
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: metadata.columns[1],
                                values: [100, 200, 700],
                            }],
                            undefined,
                            metadata.columns[2])
                    },
                };

                let yAxisReferenceLine: powerbi.DataViewObject = {
                    show: true,
                    value: 450,
                    lineColor: { solid: { color: refLineColor1 } },
                    transparency: 60,
                    style: lineStyle.dashed,
                    position: powerbi.visuals.referenceLinePosition.back,
                    dataLabelShow: true,
                    dataLabelColor: { solid: { color: refLineColor1 } },
                    dataLabelDecimalPoints: 2,
                    dataLabelHorizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                    dataLabelVerticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                    dataLabelDisplayUnits: 0,
                };

                dataView.metadata.objects = {
                    y1AxisReferenceLine: [
                        {
                            id: '0',
                            object: yAxisReferenceLine,
                        }
                    ]
                };

                v.onDataChanged({
                    dataViews: [dataView]
                });

                setTimeout(() => {
                    let graphicsContext = $('.lineChart .lineChartSVG');

                    let yLine = $('.y1-ref-line');
                    let yLabel = $('.labelGraphicsContext .label').eq(0);
                    helpers.verifyReferenceLine(
                        yLine,
                        yLabel,
                        graphicsContext,
                        {
                            inFront: false,
                            isHorizontal: true,
                            color: refLineColor1,
                            style: lineStyle.dashed,
                            opacity: 0.4,
                            label: {
                                color: refLineColor1,
                                horizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                                text: '450.00',
                                verticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                                displayUnits: 0,
                            },
                        });

                    yAxisReferenceLine['lineColor'] = { solid: { color: refLineColor2 } };
                    yAxisReferenceLine['transparency'] = 0;
                    yAxisReferenceLine['style'] = lineStyle.dotted;
                    yAxisReferenceLine['position'] = powerbi.visuals.referenceLinePosition.front;
                    yAxisReferenceLine['dataLabelColor'] = { solid: { color: refLineColor2 } };
                    yAxisReferenceLine['dataLabelDisplayUnits'] = 1000000;

                    v.onDataChanged({
                        dataViews: [dataView]
                    });

                    setTimeout(() => {
                        yLine = $('.y1-ref-line');
                        yLabel = $('.labelGraphicsContext .label').eq(0);
                        helpers.verifyReferenceLine(
                            yLine,
                            yLabel,
                            graphicsContext,
                            {
                                inFront: true,
                                isHorizontal: true,
                                color: refLineColor2,
                                style: lineStyle.dotted,
                                opacity: 1.0,
                                label: {
                                    color: refLineColor2,
                                    horizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                                    text: '0.00M',
                                    verticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                                    displayUnits: 1000000,
                                },
                            });

                        yAxisReferenceLine['show'] = false;
                        yAxisReferenceLine['dataLabelShow'] = false;

                        v.onDataChanged({
                            dataViews: [dataView]
                        });

                        setTimeout(() => {
                            expect($('.y1-ref-line').length).toBe(0);
                            expect($('.columnChart .labelGraphicsContext .label').length).toBe(0);

                            done();
                        }, DefaultWaitForRender);
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });

            describe('trend lines', () => {
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

                    v.onDataChanged({
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

                    v.onDataChanged({
                        dataViews: dataViews,
                    });
                    setTimeout(() => {
                        let trendLines = $('.trend-line');
                        let lines = $('.line');

                        helpers.verifyTrendLines(trendLines, [
                            {
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

                it('not supported with ordinal axis', (done) => {
                    let objects: DataViewObjects = {
                        trend: {
                            show: true,
                            transparency: 20,
                            style: lineStyle.dotted,
                            combineSeries: false,
                        },
                        categoryAxis: {
                            show: true,
                            axisType: AxisType.categorical,
                        },
                    };

                    let dataViews = new helpers.TrendLineBuilder({}).withObjects(objects).buildDataViews();

                    v.onDataChanged({
                        dataViews: dataViews,
                    });

                    setTimeout(() => {
                        let trendLines = $('.trend-line');
                        helpers.verifyTrendLines(trendLines, []);
                        done();
                    }, DefaultWaitForRender);
                });
            });

            it('background image', (done) => {
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
                    expect(backgroundImage.css('left')).toBeDefined();
                    expect(backgroundImage.css('bottom')).toBeDefined();
                    done();
                }, DefaultWaitForRender);
            });

            it('null category value for categorical Datetime axis type', (done) => {
                let dataViewMetadata: powerbi.DataViewMetadata = {
                    columns: [
                        {
                            displayName: 'col1',
                            queryName: 'col1',
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime),
                            roles: { Category: true }
                        },
                        {
                            displayName: 'col2',
                            queryName: 'col2',
                            isMeasure: true,
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                            roles: { Y: true }
                        }],
                };

                dataViewMetadata.objects = {
                    categoryAxis: {
                        show: true,
                        axisType: AxisType.categorical,
                        showAxisTitle: true,
                        axisStyle: true
                    }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: [null, new Date(1325404800000)],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [5, 5]
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    let axisLabels = helpers.getAxisTicks('x').find('text');
                    expect(axisLabels.length).toBe(2);
                    expect(helpers.findElementText(axisLabels.eq(0))).toBe('(Blank)');
                    expect(helpers.findElementText(axisLabels.eq(1))).toBe('1/1/2012');

                    expect(helpers.findElementTitle(axisLabels.eq(0))).toBe('(Blank)');
                    expect(helpers.findElementTitle(axisLabels.eq(1))).toBe('1/1/2012');
                    done();
                }, DefaultWaitForRender);
            });
        }

        describe("lineChart DOM validation", () => lineChartDomValidation(false));

        describe("interactive lineChart DOM validation", () => lineChartDomValidation(true));

        function areaChartDomValidation(interactiveChart: boolean, isStacked: boolean) {
            let v: powerbi.IVisual, element: JQuery;
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        queryName: 'col1',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                        roles: { Category: true }
                    }, {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: { Y: true }
                    }, {
                        displayName: 'col3',
                        queryName: 'col3',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: { Y: true }
                    }, {
                        displayName: 'col4',
                        queryName: 'col4',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: { Y: true }
                    }]
            };

            beforeEach(() => {
                element = powerbitests.helpers.testDom('500', '500');
                v = new LineChartVisualBuilder().areaChart(isStacked).build();
                v.init({
                    element: element,
                    host: hostServices,
                    style: powerbi.visuals.visualStyles.create(),
                    viewport: {
                        height: element.height(),
                        width: element.width()
                    },
                    animation: { transitionImmediate: true },
                    interactivity: { isInteractiveLegend: interactiveChart },
                });
            });

            it('check area rendered', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [50000, 49500, 49000, 48000, 50000],
                                subtotal: 246500
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    expect($('.cat')).toBeDefined();
                    expect($('.catArea')).toBeDefined();
                    done();
                }, DefaultWaitForRender);
            });

            it('background image', (done) => {
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
                    expect(backgroundImage.css('left')).toBeDefined();
                    expect(backgroundImage.css('bottom')).toBeDefined();
                    done();
                }, DefaultWaitForRender);
            });

            if (!interactiveChart) {
                it('Check negative domain for area chart', (done) => {
                    let valueColumns = DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[1],
                            values: [20, -40, 50, 0, 40],
                        }, {
                            source: dataViewMetadata.columns[2],
                            values: [90, -35, 66, 0, -100],
                        }, {
                            source: dataViewMetadata.columns[3],
                            values: [-8, -15, -10, -16, -12], // all negative with small variation, so should have small SVG BBox when connected to zero
                        }]);

                    let dataView = {
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: [2001, 2002, 2003, 2004, 2005]
                            }],
                            values: valueColumns
                        }
                    };

                    v.onDataChanged({
                        dataViews: [dataView]
                    });

                    setTimeout(() => {
                        let areaBounds = (<any>$('.catArea')[2]).getBBox(); //the all negative one
                        if (!isStacked)
                            expect(areaBounds.height).toBeLessThan(50); // check to make sure we shade towards zero (is has small height)
                        else
                            expect(areaBounds.height).toBeGreaterThan(400); //when stacked, this puppy takes up most of the viewport

                        done();
                    }, DefaultWaitForRender);
                });
            }

            it('check linear scale with big interval renders', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
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
                    expect($('.cat')).toBeDefined();
                    expect($('.catArea')).toBeDefined();
                    expect(helpers.findElementText(helpers.getAxisTicks('y').find('text').first())).toBe('480K');
                    expect(helpers.findElementTitle(helpers.getAxisTicks('y').find('text').first())).toBe('480K');
                    done();
                }, DefaultWaitForRender);
            });

            it('check linear scale with small interval renders', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [1.000, 0.995, 0.990, 0.985, 0.995],
                                subtotal: 4.965
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    expect($('.cat')).toBeDefined();
                    expect($('.catArea')).toBeDefined();
                    expect(helpers.findElementText(helpers.getAxisTicks('y').find('text'))).toBe('0.98');
                    expect(helpers.findElementText(helpers.getAxisTicks('y').find('text'))).toBe('0.98');
                    done();
                }, DefaultWaitForRender);
            });

            it('empty areaChart dom validation', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: []
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    expect(helpers.getAxisTicks('x').length).toBe(0);
                    expect(helpers.getAxisTicks('y').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            });

            it('check log scale with zero value in domain', (done) => {
                dataViewMetadata.objects = {
                    valueAxis: {
                        show: true,
                        start: 1,
                        showAxisTitle: true,
                        axisStyle: true,
                        axisScale: AxisScale.log
                    }
                };
                let dataChangedOptions = {
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: [1, 2, 5, 10, 20],
                            }],
                            values: DataViewTransform.createValueColumns([
                                {
                                    source: dataViewMetadata.columns[1],
                                    values: [100, 200, 0, 400, 500]
                                }])
                        }
                    }]
                };

                v.onDataChanged(dataChangedOptions);

                let lineChart = (<any>v).layers[0];
                setTimeout(() => {
                    let tooltipInfo = getTooltip(lineChart, lineChart.data.series[0], 5);
                    expect(helpers.findElementText(helpers.getAxisTicks('y').find('text').first())).toBe('1');
                    expect(helpers.findElementTitle(helpers.getAxisTicks('y').find('text').first())).toBe('1');
                    expect(tooltipInfo[0].value).toBe('100.00');
                    done();
                }, DefaultWaitForRender);
            });
        }

        describe("areaChart DOM validation", () => areaChartDomValidation(/* interactive */ false, /* isStacked */ false));

        describe("interactive areaChart DOM validation", () => areaChartDomValidation(/* interactive */ true, /* isStacked */ false));

        function stackedAreaChartDomValidation(interactiveChart: boolean) {
            let v: powerbi.IVisual, element: JQuery;
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        queryName: 'col1',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: { Category: true }
                    },{
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: { Y: true }
                    },{
                        displayName: 'col3',
                        queryName: 'col3',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        isMeasure: true,
                        roles: { Y: true }
                    },{
                        displayName: 'col4',
                        queryName: 'col4',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        isMeasure: true,
                        roles: { Y: true }
                    }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                    }
                }
            };

            let seriesIdentities = [
                mocks.dataViewScopeIdentity('col2'),
                mocks.dataViewScopeIdentity('col3'),
            ];

            let measureColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col2' });

            beforeEach(() => {
                element = powerbitests.helpers.testDom('1000', '1000');
                v = new LineChartVisualBuilder().areaChart(/* isStacked */ true).build();
                v.init({
                    element: element,
                    host: hostServices,
                    style: powerbi.visuals.visualStyles.create(),
                    viewport: {
                        height: element.height(),
                        width: element.width()
                    },
                    animation: { transitionImmediate: true },
                    interactivity: { isInteractiveLegend: interactiveChart },
                });
            });

            it('Stacked Area Chart circle positions', (done) => {
                let valueColumns = DataViewTransform.createValueColumns([
                    {
                        source: dataViewMetadata.columns[2],
                        values: [null, 66, null],
                    },
                    {
                        source: dataViewMetadata.columns[3],
                        values: [null, 10, null],
                    },
                    {
                        source: dataViewMetadata.columns[1],
                        values: [20, 50, 0],
                    }]);

                let dataView = {
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: [2001, 2002, 2003, 2004, 2005]
                        }],
                        values: valueColumns
                    }
                };

                v.onDataChanged({
                    dataViews: [dataView]
                });

                setTimeout(() => {
                    if (!interactiveChart) {
                        let dots = $('.dot');
                        expect(dots.length).toBe(2);

                        let visibleDots = dots.filter('[r^="4"]');
                        expect(visibleDots.length).toBe(2);
                        expect(Math.round(+$(visibleDots[0]).attr('cy'))).toEqual(498);//scale(66+10) - done have access to scale function
                    }
                    done();
                }, DefaultWaitForRender);
            });

            it('stacked area chart reference line dom validation', (done) => {
                let refLineColor1 = '#ff0000';
                let refLineColor2 = '#ff00ff';
                let metadata: powerbi.DataViewMetadata = {
                    columns: [
                        dataViewMetadata.columns[0],
                        dataViewMetadata.columns[1],
                    ],
                };

                let dataView: powerbi.DataView = {
                    metadata: metadata,
                    categorical: {
                        categories: [{
                            source: metadata.columns[0],
                            values: ['John Domo', 'Delta Force', 'Jean Tablau']
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: metadata.columns[1],
                                values: [100, 200, 700],
                            }],
                            undefined,
                            metadata.columns[2])
                    },
                };

                let yAxisReferenceLine: powerbi.DataViewObject = {
                    show: true,
                    value: 450,
                    lineColor: { solid: { color: refLineColor1 } },
                    transparency: 60,
                    style: lineStyle.dashed,
                    position: powerbi.visuals.referenceLinePosition.back,
                    dataLabelShow: true,
                    dataLabelColor: { solid: { color: refLineColor1 } },
                    dataLabelDecimalPoints: 0,
                    dataLabelHorizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                    dataLabelVerticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                    dataLabelDisplayUnits: 0,
                };

                dataView.metadata.objects = {
                    y1AxisReferenceLine: [
                        {
                            id: '0',
                            object: yAxisReferenceLine,
                        }
                    ]
                };

                v.onDataChanged({
                    dataViews: [dataView]
                });

                setTimeout(() => {
                    let graphicsContext = $('.lineChart .lineChartSVG');

                    let yLine = $('.y1-ref-line');
                    let yLabel = $('.labelGraphicsContext .label').eq(0);
                    helpers.verifyReferenceLine(
                        yLine,
                        yLabel,
                        graphicsContext,
                        {
                            inFront: false,
                            isHorizontal: true,
                            color: refLineColor1,
                            style: lineStyle.dashed,
                            opacity: 0.4,
                            label: {
                                color: refLineColor1,
                                horizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                                text: '450',
                                verticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                                displayUnits: 0,
                            },
                        });

                    yAxisReferenceLine['lineColor'] = { solid: { color: refLineColor2 } };
                    yAxisReferenceLine['transparency'] = 0;
                    yAxisReferenceLine['style'] = lineStyle.dotted;
                    yAxisReferenceLine['position'] = powerbi.visuals.referenceLinePosition.front;
                    yAxisReferenceLine['dataLabelColor'] = { solid: { color: refLineColor2 } };
                    yAxisReferenceLine['dataLabelDisplayUnits'] = 1000000;

                    v.onDataChanged({
                        dataViews: [dataView]
                    });

                    setTimeout(() => {
                        yLine = $('.y1-ref-line');
                        yLabel = $('.labelGraphicsContext .label').eq(0);
                        helpers.verifyReferenceLine(
                            yLine,
                            yLabel,
                            graphicsContext,
                            {
                                inFront: true,
                                isHorizontal: true,
                                color: refLineColor2,
                                style: lineStyle.dotted,
                                opacity: 1.0,
                                label: {
                                    color: refLineColor2,
                                    horizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                                    text: '0M',
                                    verticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                                    displayUnits: 1000000,
                                },
                            });

                        yAxisReferenceLine['show'] = false;
                        yAxisReferenceLine['dataLabelShow'] = false;

                        v.onDataChanged({
                            dataViews: [dataView]
                        });

                        setTimeout(() => {
                            expect($('.y1-ref-line').length).toBe(0);
                            expect($('.columnChart .labelGraphicsContext .label').length).toBe(0);

                            done();
                        }, DefaultWaitForRender);
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });

            it('Check positive domain on stacked area', (done) => {
                let valueColumns = DataViewTransform.createValueColumns([
                    {
                        source: dataViewMetadata.columns[1],
                        values: [20, 40, 50, 0, 90],
                        identity: seriesIdentities[0],
                    }, {
                        source: dataViewMetadata.columns[2],
                        values: [90, 34, 56, 0, 50],
                        identity: seriesIdentities[1],
                    }],
                    [measureColumnRef]);
                valueColumns.source = dataViewMetadata.columns[2];

                let dataView = {
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: [2001, 2002, 2003, 2004, 2005]
                        }],
                        values: valueColumns
                    }
                };

                v.onDataChanged({
                    dataViews: [dataView]
                });

                setTimeout(() => {
                    expect(helpers.findElementText(helpers.getAxisTicks('y').find('text').first())).toBe('0');
                    expect(helpers.findElementText(helpers.getAxisTicks('y').find('text').last())).toBe('140');//90 + 50

                    //assert title
                    expect(helpers.findElementTitle(helpers.getAxisTicks('y').find('text').first())).toBe('0');
                    expect(helpers.findElementTitle(helpers.getAxisTicks('y').find('text').last())).toBe('140');//90 + 50
                    done();
                }, DefaultWaitForRender);

            });

            it('Check negative domain on stacked area', (done) => {
                let valueColumns = DataViewTransform.createValueColumns([
                    {
                        source: dataViewMetadata.columns[1],
                        values: [20, -40, 50, 0, 40],
                        identity: seriesIdentities[0],
                    }, {
                        source: dataViewMetadata.columns[2],
                        values: [90, -35, 66, 0, -100],
                        identity: seriesIdentities[1],
                    }],
                    [measureColumnRef]);
                valueColumns.source = dataViewMetadata.columns[2];

                let dataView = {
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: [2001, 2002, 2003, 2004, 2005]
                        }],
                        values: valueColumns
                    }
                };

                v.onDataChanged({
                    dataViews: [dataView]
                });

                setTimeout(() => {
                    expect(helpers.findElementTitle(helpers.getAxisTicks('y').find('text').first())).toBe('-80');
                    expect(helpers.findElementTitle(helpers.getAxisTicks('y').find('text').last())).toBe('120');
                    done();
                }, DefaultWaitForRender);
            });

            it("Check that data labels for stacked area has enough space in parent shape", () => {
                let metadataWithDensity = powerbi.Prototype.inherit(dataViewMetadata);
                metadataWithDensity.objects = {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                        labelDensity: undefined,
                    },
                    categoryAxis: {
                        show: true,
                        start: 0,
                        end: 25,
                        axisType: AxisType.categorical,
                        showAxisTitle: true,
                        axisStyle: true
                    }

                };
                let valueColumns = DataViewTransform.createValueColumns([
                    {
                        source: metadataWithDensity.columns[1],
                        values: [20, 40, 50, 0, 90],
                        identity: seriesIdentities[0],
                    }, {
                        source: metadataWithDensity.columns[2],
                        values: [90, 34, 56, 0, 50],
                        identity: seriesIdentities[1],
                    }],
                    [measureColumnRef]);
                valueColumns.source = metadataWithDensity.columns[2];

                let dataView = {
                    metadata: metadataWithDensity,
                    categorical: {
                        categories: [{
                            source: metadataWithDensity.columns[0],
                            values: [2001, 2002, 2003, 2004, 2005]
                        }],
                        values: valueColumns
                    }
                };

                v.onDataChanged({
                    dataViews: [dataView]
                });

                let labelDataPoints = callCreateLabelDataPoints(v);
                
                let parentShape = <powerbi.LabelParentRect>labelDataPoints[0].parentShape;
                let actualWidth = parentShape.rect.width;
                expect(actualWidth).toBeGreaterThan(118);
                
            });

            it("Check that data labels are series value and not stack value", () => {
                let metadataWithDensity = powerbi.Prototype.inherit(dataViewMetadata);
                metadataWithDensity.objects = {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                        labelDensity: undefined,
                    }
                };
                let valueColumns = DataViewTransform.createValueColumns([
                    {
                        source: metadataWithDensity.columns[1],
                        values: [20, 40, 50, 0, 90],
                        identity: seriesIdentities[0],
                    }, {
                        source: metadataWithDensity.columns[2],
                        values: [90, 34, 56, 0, 50],
                        identity: seriesIdentities[1],
                    }],
                    [measureColumnRef]);
                valueColumns.source = metadataWithDensity.columns[2];

                let dataView = {
                    metadata: metadataWithDensity,
                    categorical: {
                        categories: [{
                            source: metadataWithDensity.columns[0],
                            values: [2001, 2002, 2003, 2004, 2005]
                        }],
                        values: valueColumns
                    }
                };

                v.onDataChanged({
                    dataViews: [dataView]
                });

                let labelDataPoints = callCreateLabelDataPoints(v);
                
                expect(labelDataPoints[0].text).toEqual("20");
                expect(labelDataPoints[1].text).toEqual("40");
                expect(labelDataPoints[2].text).toEqual("50");
                expect(labelDataPoints[3].text).toEqual("0");
                expect(labelDataPoints[4].text).toEqual("90");
            });

            it('trend lines not enabled', (done) => {
                let objects: DataViewObjects = {
                    trend: {
                        show: true,
                    }
                };

                let dataViews = new helpers.TrendLineBuilder({}).withObjects(objects).buildDataViews();

                v.onDataChanged({
                    dataViews: dataViews,
                });

                setTimeout(() => {
                    let trendLines = $('.trend-line');
                    helpers.verifyTrendLines(trendLines, []);
                    done();
                }, DefaultWaitForRender);
            });
        }

        describe("stackedAreaChart DOM validation", () => areaChartDomValidation(/* interactive */ false, /* isStacked*/ true));

        describe("interactive stackedAreaChart DOM validation", () => areaChartDomValidation(/* interactive */ true, /* isStacked */ true));

        describe("stackedAreaChart specific DOM validation", () => stackedAreaChartDomValidation(/* interactive */ false));

        describe("stackedAreaChart specific DOM validation", () => stackedAreaChartDomValidation(/* interactive */ true));
    });

    describe("Line Chart Legend Formatting", () => {
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let v: powerbi.IVisual, element: JQuery;
        let dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    queryName: 'col1',
                    format: 'd',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Date),
                    roles: { Category: true }
                }, {
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true }
                }],
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = new LineChartVisualBuilder().build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { isInteractiveLegend: true },
            });

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: [new Date("Thu Dec 18 2014 00:08:00"),
                                new Date("Thu Dec 19 2014 00:20:00"),
                                new Date("Thu Dec 20 2014 00:11:00")]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000],
                            subtotal: 246500
                        }])
                    }
                }]
            });
        });

        it('verify legend formatted as date', () => {
            // verify legend was changed to correct values
            let legend = $('.interactive-legend');
            let title = legend.find('.title');

            expect(legend.length).toBe(1);
            expect(title.text().trim()).toBe('12/20/2014');
        });
    });

    describe("Line Chart Legend Formatting", () => {
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let v: powerbi.IVisual, element: JQuery;
        let dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    queryName: 'col1',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                    roles: { Category: true }
                },
                {
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true }
                },
                {
                    displayName: 'col3',
                    queryName: 'col3',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true }
                }],
            objects: {
                legend: {
                    titleText: 'my title text',
                    show: true,
                    showTitle: true,
                    labelColor: { solid: { color: labelColor } },
                    fontSize: 13
                }
            }
        };

        let seriesIdentities = [
            mocks.dataViewScopeIdentity('col2'),
            mocks.dataViewScopeIdentity('col3'),
        ];

        let measureColumn: powerbi.DataViewMetadataColumn = { displayName: 'sales', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) };
        let col3Ref = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'sales' });
        let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });

        let valueColumns = DataViewTransform.createValueColumns([
            {
                source: dataViewMetadata.columns[1],
                values: [110, 120, 130, 140, 150],
                identity: seriesIdentities[0],
            }, {
                source: dataViewMetadata.columns[2],
                values: [210, 220, 230, 240, 250],
                identity: seriesIdentities[1],
            }],
            [col3Ref]);
        valueColumns.source = measureColumn;

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = new LineChartVisualBuilder().build();

            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
            });
        });

        it('check color for legend title and legend items line chart', (done) => {

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identityFields: [categoryColumnRef],
                        }],
                        values: valueColumns
                    }
                }]
            });

            setTimeout(() => {
                let legend = element.find('.legend');
                let legendTitle = legend.find('.legendTitle');
                let legendText = legend.find('.legendItem').find('.legendText');
                helpers.assertColorsMatch(legendTitle.css('fill'), labelColor);
                helpers.assertColorsMatch(legendText.first().css('fill'), labelColor);
                done();
            }, DefaultWaitForRender);

        });

        it('check for size for legend title and legend items line chart', (done) => {
            let labelFontSize = 13;
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identityFields: [categoryColumnRef],
                        }],
                        values: valueColumns
                    }
                }]
            });

            setTimeout(() => {
                let legend = element.find('.legend');
                let legendTitle = legend.find('.legendTitle');
                let legendText = legend.find('.legendItem').find('.legendText');
                expect(Math.round(parseInt(legendTitle.css('font-size'), 10))).toBe(Math.round(parseInt(PixelConverter.fromPoint(labelFontSize), 10)));
                expect(Math.round(parseInt(legendText.css('font-size'), 10))).toBe(Math.round(parseInt(PixelConverter.fromPoint(labelFontSize), 10)));
                done();
            }, DefaultWaitForRender);

        });

        it('line chart no category single series legend validation', (done) => {
            let seriesSourceMain: powerbi.DataViewMetadataColumn = { displayName: 'series', queryName: 'select0', roles: { "Series": true } };
            let seriesSourceY: powerbi.DataViewMetadataColumn = { displayName: 'value', queryName: 'select1', groupName: 'series0', roles: { "Y": true } };

            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    seriesSourceY,
                ]
            };

            let colRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 't', column: 'p1' });

            v.onDataChanged({
                dataViews: [{
                    metadata: metadata,
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: seriesSourceY,
                                values: [100],
                                identity: mocks.dataViewScopeIdentity('series'),
                            }
                        ], [colRef], seriesSourceMain)
                    }
                }]
            });

            setTimeout(() => {
                expect($('.legendItem').length).toBe(1);
                done();
            }, DefaultWaitForRender);
        });
    });

    describe("Line Chart Interactivity", () => {
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let v: powerbi.IVisual, element: JQuery;
        let dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    queryName: 'col1',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                    roles: { Category: true }
                }, {
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer),
                    roles: { Y: true }
                }],
            objects: {
                labels: {
                    show: true,
                    labelPrecision: 0,
                }
            }
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = new LineChartVisualBuilder().forMobile().build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { isInteractiveLegend: true },
            });

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
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
        });

        it('line chart drag and click interaction validation', () => {
            let lineChart = (<any>v).layers[0];

            let mainGraphicsContext: any = $('.mainGraphicsContext');
            expect(mainGraphicsContext.length).toBe(1);

            // instead of clicking on the graph, which can be unstable due to different user's configurations
            // we will validate that the code knows how to deal with such a click
            let calculatedIndex = lineChart.findIndex(250);
            expect(calculatedIndex).toBe(2);
        });

        it('select column validation', () => {
            let lineChart = (<any>v).layers[0];

            spyOn(lineChart, 'setHoverLine').and.callThrough();;

            // trigger select column
            lineChart.selectColumn(2);

            // verify legend was changed to correct values
            let legend = $('.interactive-legend');
            let title = legend.find('.title');
            let item = legend.find('.item');
            let hoverLine = $('.hover-line');

            expect(legend.length).toBe(1);
            expect(title.text().trim()).toBe('c');

            expect(item.find('.itemName').text()).toBe('col2');
            expect(item.find('.itemMeasure').text().trim()).toBe('490000');
            expect(lineChart.setHoverLine).toHaveBeenCalled();
            let arg = lineChart.setHoverLine.calls ? lineChart.setHoverLine.calls.allArgs()[0][0] : 193;
            expect(Helpers.isInRange(arg, 191, 195)).toBe(true);
            expect(hoverLine.length).toBe(1);
        });
    });

    describe("Line Chart Interactivity - Creation", () => {
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let v: powerbi.IVisual, element: JQuery;
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
                }],
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = new LineChartVisualBuilder().build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { isInteractiveLegend: true },
            });

            // Invoke onDataChange to force creation of chart layers.
            v.onDataChanged({ dataViews: [] });
        });

        it('select column validation', () => {
            let lineChart = (<any>v).layers[0];

            spyOn(lineChart, 'selectColumn').and.callThrough();

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
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

            let hoverLine = $('.hover-line');

            expect(lineChart.selectColumn).toHaveBeenCalledWith(4, true);
            expect(hoverLine.length).toBe(1);
        });
    });

    describe("Enumerate Objects", () => {
        let v: powerbi.IVisual, element: JQuery;
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
                },
                {
                    displayName: 'col3',
                    queryName: 'col3',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true },
                },
                {
                    displayName: 'col4',
                    queryName: 'col4',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true },
                }],
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = new LineChartVisualBuilder().build();

            v.init({
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
        });

        it('Check enumeration without dataChanged triggered', (done) => {
            v.enumerateObjectInstances({ objectName: 'categoryAxis' });
            v.enumerateObjectInstances({ objectName: 'valueAxis' });

            //no expects, just need this code coverage to see if exception is thrown
            done();
        });

        it('Check basic enumeration', (done) => {
            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata.columns[1],
                                values: [100, 200, 300, 400, 500]
                            }, {
                                source: dataViewMetadata.columns[2],
                                values: [200, 400, 600, 800, 1000]
                            }, {
                                source: dataViewMetadata.columns[3],
                                values: [1, 2, 3, 4, 5]
                            }])
                    }
                }]
            };

            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                let points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'dataPoint' });
                expect(points.instances.length).toBe(3);
                expect(points.instances[0].displayName).toEqual('col2');
                expect(points.instances[0].properties['fill']).toBeDefined();
                expect(points.instances[1].displayName).toEqual('col3');
                expect(points.instances[1].properties['fill']).toBeDefined();
                done();
            }, DefaultWaitForRender);
        });

        it('Data label per series when container visible and collapsed', (done) => {
            let metadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
            metadataWithLabels.objects = {
                labels: {
                    show: true,
                    showAll: true,
                }
            };
            v = new LineChartVisualBuilder().build();
            v.init({
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
            let dataChangedOptions = {
                dataViews: [{
                    metadata: metadataWithLabels,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c'],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata.columns[1],
                                values: [100, 200, 300]
                            }, {
                                source: dataViewMetadata.columns[2],
                                values: [200, 400, 600]
                            }, {
                                source: dataViewMetadata.columns[3],
                                values: [1, 2, 3]
                            }])
                    }
                }]
            };

            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                let points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'labels' });
                expect(points.instances.length).toBe(4);
                done();
            }, DefaultWaitForRender);
        });
    });

    describe("Line Chart Scrollbar Validation", () => {
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let v: powerbi.IVisual, element: JQuery;
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
                }],
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('150', '75');
            v = new LineChartVisualBuilder().build();

            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: {},
            });

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000, 480000, 500000, 500000, 500000, 500000, 500000],
                            subtotal: 246500
                        }])
                    }
                }]
            });
        });

        it('Line Chart Scrollbar DOM Validation', (done) => {
            setTimeout(() => {
                expect($('.lineChart')).toBeInDOM();
                expect($('rect.extent').length).toBe(1);
                let transform = SVGUtil.parseTranslateTransform(helpers.getAxisTicks('x').last().attr('transform'));
                expect(transform.x).toBeLessThan(element.width());
                expect(SVGUtil.parseTranslateTransform($('.brush').first().attr('transform')).x).toBe('29');
                expect(SVGUtil.parseTranslateTransform($('.brush').first().attr('transform')).y).toBe('140');
                expect(parseInt($('.brush .extent')[0].attributes.getNamedItem('width').value, 10)).toBeGreaterThan(1);
                expect($('.brush .extent')[0].attributes.getNamedItem('x').value).toBe('0');

                v.onResizing({ height: 500, width: 500 });
                expect($('.brush')).not.toBeInDOM();
                done();
            }, DefaultWaitForRender);
        });

        describe("xAxis Validations", () => {
            let path;
            let points: powerbitests.helpers.Point[];
            let gap;
            let lastIndex;
            let v: powerbi.IVisual, element: JQuery;
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        queryName: 'col1',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: { Category: true },
                    }, {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: { Y: true },
                    },
                    {
                        displayName: 'col3',
                        queryName: 'col3',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: { Y: true },
                    }],
            };
            let nonNumericDataViewMetadata: powerbi.DataViewMetadata = {
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
                    },
                    {
                        displayName: 'col3',
                        queryName: 'col3',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: { Y: true },
                    }],
            };

            beforeEach(() => {
                element = powerbitests.helpers.testDom('500', '500');
                v = new LineChartVisualBuilder().build();

                v.init({
                    element: element,
                    host: powerbitests.mocks.createVisualHostServices(),
                    style: powerbi.visuals.visualStyles.create(),
                    viewport: {
                        height: element.height(),
                        width: element.width()
                    },
                    animation: { transitionImmediate: true }
                });
            });

            function setAxis(xType: any) { //TODO: Change it, to only set Axis values
                points = [];
                let labelColor = '#ff0000';
                dataViewMetadata.objects = {
                    categoryAxis: {
                        show: true,
                        start: 0,
                        end: 25,
                        axisType: xType,
                        showAxisTitle: true,
                        axisStyle: true,
                        labelColor: { solid: { color: labelColor } }
                    }
                };
                let dataChangedOptions = {
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: [1, 2, 5, 10, 20],
                            }],
                            values: DataViewTransform.createValueColumns([
                                {
                                    source: dataViewMetadata.columns[1],
                                    values: [100, 200, 300, 400, 500]
                                }, {
                                    source: dataViewMetadata.columns[2],
                                    values: [200, 400, 600, 800, 1000]
                                }])
                        }
                    }]
                };

                v.onDataChanged(dataChangedOptions);

                path = $('.line').first().attr('d');
                let dots = path.split('L');
                dots[0] = dots[0].substr(1);

                for (let i = 0; i < dots.length; i++) {
                    let strPoint = dots[i].split(',');
                    let point: powerbitests.helpers.Point = { x: strPoint[0], y: strPoint[1] };
                    points.push(point);
                }

                gap = +points[1].x - +points[0].x;
                lastIndex = points.length - 1;
            }

            it('Category vs Scalar Check', () => {

                setAxis(AxisType.scalar);

                expect(+points[lastIndex].x - +points[lastIndex - 1].x).toBeGreaterThan(gap);

                setAxis(AxisType.categorical);

                expect(+points[lastIndex].x - +points[lastIndex - 1].x).toBeCloseTo(gap, 2);

                let labels = helpers.getAxisTicks('x');
                helpers.assertColorsMatch(labels.find('text').css('fill'), '#ff0000');
            });

            it('enumerateObjectInstances: legend color', () => {

                dataViewMetadata.objects = {
                    categoryAxis: {
                        show: true,
                        start: 0,
                        end: 25,
                        axisType: AxisType.scalar,
                        showAxisTitle: true,
                        axisStyle: true
                    }
                };
                let measureColumn: powerbi.DataViewMetadataColumn = { displayName: 'sales', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) };
                let col3Ref = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'sales' });
                let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });
                let seriesIdentities = [
                    mocks.dataViewScopeIdentity('col2'),
                    mocks.dataViewScopeIdentity('col3'),
                ];

                let valueColumns = DataViewTransform.createValueColumns([
                    {
                        source: dataViewMetadata.columns[1],
                        values: [110, 120, 130, 140, 150],
                        identity: seriesIdentities[0],
                    }, {
                        source: dataViewMetadata.columns[2],
                        values: [210, 220, 230, 240, 250],
                        identity: seriesIdentities[1],
                    }],
                    [col3Ref]);
                valueColumns.source = measureColumn;

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e'],
                                identityFields: [categoryColumnRef],
                            }],
                            values: valueColumns
                        }
                    }]
                });
                let legend = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'legend' });

                expect(legend.instances[0].properties['labelColor']).toBe(powerbi.visuals.LegendData.DefaultLegendLabelFillColor);
            });

            it('enumerateObjectInstances: Verify instances on ordinal value axis', () => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: nonNumericDataViewMetadata,
                        categorical: {
                            categories: [{
                                source: nonNumericDataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: nonNumericDataViewMetadata.columns[1],
                                values: [1, 2, 3, 4, 5],
                                subtotal: 15
                            },
                                {
                                    source: nonNumericDataViewMetadata.columns[1],
                                    values: [1, 2, 3, 4, 5],
                                    subtotal: 15
                                }])
                        }
                    }]
                });
                let points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'valueAxis' });

                expect(points.instances[0].properties['start']).toBeUndefined();
                expect(points.instances[0].properties['end']).toBeUndefined();
                expect(points.instances[0].properties['axisType']).toBeUndefined();

                expect(points.instances[0].properties['show']).toBeDefined;
                expect(points.instances[0].properties['showAxisTitle']).toBeDefined;
                expect(points.instances[0].properties['axisStyle']).toBeDefined;
                expect(points.instances[0].properties['labelColor']).toBe(powerbi.visuals.DEFAULT_AXIS_COLOR);
            });

            it('enumerateObjectInstances: Verify instances on ordinal value axis', () => {

                dataViewMetadata.objects = {
                    categoryAxis: {
                        show: true,
                        start: 0,
                        end: 25,
                        axisType: AxisType.scalar,
                        showAxisTitle: true,
                        axisStyle: true
                    }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: nonNumericDataViewMetadata,
                        categorical: {
                            categories: [{
                                source: nonNumericDataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: nonNumericDataViewMetadata.columns[1],
                                values: [1, 2, 3, 4, 5],
                                subtotal: 15
                            },
                                {
                                    source: nonNumericDataViewMetadata.columns[1],
                                    values: [1, 2, 3, 4, 5],
                                    subtotal: 15
                                }])
                        }
                    }]
                });
                let points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'valueAxis' });

                expect(points.instances[0].properties['start']).toBeUndefined();
                expect(points.instances[0].properties['end']).toBeUndefined();
                expect(points.instances[0].properties['axisType']).toBeUndefined();

                expect(points.instances[0].properties['show']).toBeDefined;
                expect(points.instances[0].properties['showAxisTitle']).toBeDefined;
                expect(points.instances[0].properties['axisStyle']).toBeDefined;
                expect(points.instances[0].properties['labelColor']).toBe('#777');
            });

            it('enumerateObjectInstances: Verify instances on numerical category axis', () => {

                dataViewMetadata.objects = {
                    categoryAxis: {
                        show: true,
                        start: 0,
                        end: 25,
                        axisType: AxisType.scalar,
                        showAxisTitle: true,
                        axisStyle: true
                    }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: [1, 2, 3, 4, 5]
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [1, 2, 3, 4, 5],
                                subtotal: 15
                            },
                                {
                                    source: dataViewMetadata.columns[1],
                                    values: [1, 2, 3, 4, 5],
                                    subtotal: 15
                                }])
                        }
                    }]
                });
                let points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'categoryAxis' });

                expect(points.instances[0].properties['start']).toBeDefined();
                expect(points.instances[0].properties['end']).toBeDefined();
                expect(points.instances[0].properties['axisType']).toBeDefined();

                expect(points.instances[0].properties['show']).toBeDefined;
                expect(points.instances[0].properties['showAxisTitle']).toBeDefined;
                expect(points.instances[0].properties['axisStyle']).toBeDefined;
                expect(points.instances[0].properties['labelColor']).toBe('#777');
            });

            it('Verify title style of category axis-unitOnly', () => {

                dataViewMetadata.objects = {
                    valueAxis: {
                        showAxisTitle: true,
                        axisStyle: "showUnitOnly"
                    }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: [1, 2, 3, 4, 5],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [10000, 20000, 30000, 40000, 50000],
                            }])
                        }
                    }]
                });
                let title = $('.yAxisLabel').find('title').text();
                expect(title).toBe('Thousands');
            });

            it('Verify title style of category axis-titleOnly', () => {

                dataViewMetadata.objects = {
                    valueAxis: {
                        showAxisTitle: true,
                        axisStyle: "showTitleOnly"
                    }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: [1, 2, 3, 4, 5],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [10000, 20000, 30000, 40000, 50000],
                            }])
                        }
                    }]
                });
                let title = $('.yAxisLabel').find('title').text();
                expect(title).toBe('col2');
            });

            it('Verify title style of category axis-both', () => {

                dataViewMetadata.objects = {
                    valueAxis: {
                        showAxisTitle: true,
                        axisStyle: "showBoth"
                    }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: [1, 2, 3, 4, 5],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [1000000, 2000000, 3000000, 4000000, 5000000],
                            }])
                        }
                    }]
                });
                let title = $('.yAxisLabel').find('title').text();
                expect(title).toBe('col2 (Millions)');
            });

            it('enumerateObjectInstances: Verify instances on numerical category axis with empty values array', () => {

                dataViewMetadata.objects = {
                    categoryAxis: {
                        show: true,
                        start: 0,
                        end: 25,
                        axisType: AxisType.scalar,
                        showAxisTitle: true,
                        axisStyle: true
                    }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [1, 2, 3, 4, 5],
                                subtotal: 15
                            },
                                {
                                    source: dataViewMetadata.columns[1],
                                    values: [1, 2, 3, 4, 5],
                                    subtotal: 15
                                }])
                        }
                    }]
                });
                let points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'categoryAxis' });

                expect(points.instances[0].properties['start']).toBeDefined();
                expect(points.instances[0].properties['end']).toBeDefined();
                expect(points.instances[0].properties['axisType']).toBeDefined();

                expect(points.instances[0].properties['show']).toBeDefined;
                expect(points.instances[0].properties['showAxisTitle']).toBeDefined;
                expect(points.instances[0].properties['axisStyle']).toBeDefined;
            });

            it('Line Chart X and Y-axis show/hide Title ', () => {

                let categoryIdentities = [mocks.dataViewScopeIdentity("John Domo")];
                let dataViewMetadataOneColumn: powerbi.DataViewMetadata = {
                    columns: [
                        {
                            displayName: 'AxesTitleTest',
                            queryName: 'AxesTitleTest',
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                            roles: { Y: true },
                        }],
                    objects: {
                        categoryAxis: {
                            showAxisTitle: true
                        },
                        valueAxis: {
                            showAxisTitle: true
                        }
                    }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataOneColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataOneColumn.columns[0],
                                values: [500, 2000, 5000, 10000],
                                identity: categoryIdentities
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataOneColumn.columns[0],
                                values: [20, 1000],
                                subtotal: 1020
                            }])
                        }
                    }]
                });
                expect(helpers.findElementText($('.xAxisLabel').first())).toBe('AxesTitleTest');
                expect(helpers.findElementText($('.yAxisLabel').first())).toBe('AxesTitleTest');

                expect(helpers.findElementTitle($('.xAxisLabel').first())).toBe('AxesTitleTest');
                expect(helpers.findElementTitle($('.yAxisLabel').first())).toBe('AxesTitleTest');

                dataViewMetadataOneColumn.objects = {
                    categoryAxis: {
                        showAxisTitle: false
                    },
                    valueAxis: {
                        showAxisTitle: false
                    }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataOneColumn,
                    }]
                });
                expect($('.xAxisLabel').length).toBe(0);
                expect($('.yAxisLabel').length).toBe(0);
            });
        });
    });

    describe("Area Chart Scrollbar Validation", () => {
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let v: powerbi.IVisual, element: JQuery;
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
                }],
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('150', '75');
            v = new LineChartVisualBuilder().areaChart(false).build();

            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: {},
            });

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000, 480000, 500000, 500000, 500000, 500000, 500000],
                            subtotal: 246500
                        }])
                    }
                }]
            });
        });

        it('Area Chart Scrollbar DOM Validation', (done) => {
            setTimeout(() => {
                expect($('.catArea')).toBeInDOM();
                expect($('rect.extent').length).toBe(1);
                let transform = SVGUtil.parseTranslateTransform(helpers.getAxisTicks('x').last().attr('transform'));
                expect(transform.x).toBeLessThan(element.width());
                expect(SVGUtil.parseTranslateTransform($('.brush').first().attr('transform')).x).toBe('29');
                expect(SVGUtil.parseTranslateTransform($('.brush').first().attr('transform')).y).toBe('140');
                expect(parseInt($('.brush .extent')[0].attributes.getNamedItem('width').value, 10)).toBeGreaterThan(1);
                expect($('.brush .extent')[0].attributes.getNamedItem('x').value).toBe('0');
                done();
            }, DefaultWaitForRender);
        });
    });

    describe("Line Chart Tooltips - Minerva", () => {
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let v: powerbi.IVisual, element: JQuery;

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
                    isMeasure: false,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime),
                    format: 'MM/dd/yyyy',
                    roles: { Y: true },
                }],
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = new LineChartVisualBuilder().build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
            });

            // Invoke onDataChange to force creation of chart layers.
            v.onDataChanged({ dataViews: [] });
        });

        it('Simulate mouse event - mouseover, with zero', (done) => {
            let categoryFieldDef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });
            let lineChart = (<any>v).layers[0];

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['Ford', 'Chevrolet', 'VW', 'Cadillac', 'GM'],
                            identityFields: [categoryFieldDef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [0, 495000, 490000, 480000, 500000],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                let pointX = 250;
                let index: number = lineChart.findIndex(pointX);
                expect(index).toEqual(2);
                let categoryData = lineChart.selectColumnForTooltip(index);
                expect(categoryData[0].measureDisplayName).toBe('col2');
                expect(categoryData[0].category).toBe('VW');
                expect(categoryData[0].value).toBe(490000);
                let tooltipInfo = lineChart.getSeriesTooltipInfo(categoryData);
                expect(tooltipInfo[0].header).toBe('VW');
                expect(tooltipInfo[0].displayName).toBe('col2');
                expect(tooltipInfo[0].value).toBe('490,000.00');

                pointX = 0;
                index = lineChart.findIndex(pointX);
                expect(index).toEqual(0);
                categoryData = lineChart.selectColumnForTooltip(index);
                expect(categoryData[0].measureDisplayName).toBe('col2');
                expect(categoryData[0].category).toBe('Ford');
                expect(categoryData[0].value).toBe(0);
                tooltipInfo = lineChart.getSeriesTooltipInfo(categoryData);
                expect(tooltipInfo[0].header).toBe('Ford');
                expect(tooltipInfo[0].displayName).toBe('col2');
                expect(tooltipInfo[0].value).toBe('0.00');

                done();
            }, DefaultWaitForRender);
        });

        it('Simulate mouse event - no values', (done) => {
            let categoryFieldDef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });
            let lineChart = (<any>v).layers[0];

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: [],
                            identityFields: [categoryFieldDef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [],
                            subtotal: 0
                        }])
                    }
                }]
            });

            setTimeout(() => {
                let pointX = 250;
                let index: number = lineChart.findIndex(pointX);
                expect(index).toEqual(0);
                let categoryData = lineChart.selectColumnForTooltip(index);
                expect(categoryData.length).toBe(0);
                let tooltipInfo = lineChart.getSeriesTooltipInfo(categoryData);
                expect(tooltipInfo).toBeNull();
                done();
            }, DefaultWaitForRender);
        });

        it('Simulate mouse event - index out of range', (done) => {
            let categoryFieldDef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });
            let lineChart = (<any>v).layers[0];

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['Ford', 'Chevrolet', 'VW', 'Cadillac', 'GM'],
                            identityFields: [categoryFieldDef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [0, 495000, 490000, 480000, 500000],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                // bypass the debug assert so we touch all the code
                let originalDebugAssert = debug.assert;
                debug.assert = () => { };

                try {
                    let index = 99;
                    let categoryData = lineChart.selectColumnForTooltip(index);
                    expect(categoryData.length).toBe(0);
                    let tooltipInfo = lineChart.getSeriesTooltipInfo(categoryData);
                    expect(tooltipInfo).toBeNull();
                }
                finally {
                    debug.assert = originalDebugAssert;
                }

                done();
            }, DefaultWaitForRender);
        });

        it('Simulate mouse event - combo chart line - with offset SVGPath', (done) => {
            let categoryFieldDef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });
            let lineChart = (<any>v).layers[0];

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['Ford', 'Chevrolet', 'VW', 'Cadillac', 'GM'],
                            identityFields: [categoryFieldDef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            // two nulls so the path element starts far from the left edge of the plot area
                            values: [null, null, 490000, 480000, 500000],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                let pointX = 25;
                let seriesData = lineChart.data.series[0];
                let svgPath = $('.interactivity-line')[0];
                let tooltipInfo = getComboOrMobileTooltip(lineChart, seriesData, pointX, svgPath);
                expect(tooltipInfo[0].displayName).toBe('col1');
                expect(tooltipInfo[0].value).toBe('VW');
                expect(tooltipInfo[1].displayName).toBe('col2');
                expect(tooltipInfo[1].value).toBe('490000');
                done();
            }, DefaultWaitForRender);
        });

        it('Simulate mouse event - combo chart line - with offset SVGPath - Scalar', (done) => {
            let categoryFieldDef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });
            let lineChart = (<any>v).layers[0];

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[2],
                            values: [new Date(2015,2,15), new Date(2015,3,15), new Date(2015,4,15), new Date(2015,5,15), new Date(2015,6,15)],
                            identityFields: [categoryFieldDef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            // two nulls so the path element starts far from the left edge of the plot area
                            values: [490000, 440000, null, 480000, 500000],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                let pointX = 480; // test the last point to make sure we know how to skip that null value, defect 6546054
                let seriesData = lineChart.data.series[0];
                let svgPath = $('.interactivity-line')[0];
                let tooltipInfo = getComboOrMobileTooltip(lineChart, seriesData, pointX, svgPath);
                expect(tooltipInfo[0].displayName).toBe('col3');
                expect(tooltipInfo[0].value).toBe('07/15/2015');
                expect(tooltipInfo[1].displayName).toBe('col2');
                expect(tooltipInfo[1].value).toBe('500000');
                done();
            }, DefaultWaitForRender);
        });

        it('getCategoryIndexFromTooltipEvent for dots', () => {
            let categoryFieldDef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });
            let lineChart: LineChart = (<any>v).layers[0];

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['Ford', 'Chevrolet', 'VW', 'Cadillac', 'GM'],
                            identityFields: [categoryFieldDef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [0, 495000, 490000, 480000, 500000],
                        }])
                    }
                }]
            });

            let tooltipEvent0 = createTooltipEvent({ categoryIndex: 0 });
            let tooltipEvent1 = createTooltipEvent({ categoryIndex: 1 });
            let tooltipEvent2 = createTooltipEvent({ categoryIndex: 2 });
            let tooltipEvent3 = createTooltipEvent({ categoryIndex: 3 });
            let tooltipEvent4 = createTooltipEvent({ categoryIndex: 4 });
            expect(lineChart.getCategoryIndexFromTooltipEvent(tooltipEvent0, 400)).toBe(0);
            expect(lineChart.getCategoryIndexFromTooltipEvent(tooltipEvent1, 200)).toBe(1);
            expect(lineChart.getCategoryIndexFromTooltipEvent(tooltipEvent2, 350)).toBe(2);
            expect(lineChart.getCategoryIndexFromTooltipEvent(tooltipEvent3, 10)).toBe(3);
            expect(lineChart.getCategoryIndexFromTooltipEvent(tooltipEvent4, 180)).toBe(4);
        });

        it('getCategoryIndexFromTooltipEvent for lines', () => {
            let categoryFieldDef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });
            let lineChart: LineChart = (<any>v).layers[0];
            let values = [0, 495000, 490000, 480000, 500000];
            let categoryValues = ['Ford', 'Chevrolet', 'VW', 'Cadillac', 'GM'];

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: categoryValues,
                            identityFields: [categoryFieldDef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: values,
                        }])
                    }
                }]
            });

            let tooltipEvent = createTooltipEvent({
                data: _.map(values, (value, index) => {
                    return { value: value, categoryValue: categoryValues[index], categoryIndex: index };
                }),
            });
            expect(lineChart.getCategoryIndexFromTooltipEvent(tooltipEvent, 0)).toBe(0);
            expect(lineChart.getCategoryIndexFromTooltipEvent(tooltipEvent, 35)).toBe(0);
            expect(lineChart.getCategoryIndexFromTooltipEvent(tooltipEvent, 180)).toBe(2);
            expect(lineChart.getCategoryIndexFromTooltipEvent(tooltipEvent, 300)).toBe(3);
            expect(lineChart.getCategoryIndexFromTooltipEvent(tooltipEvent, 490)).toBe(4);
        });

        it('getCategoryIndexFromTooltipEvent for lines with nulls', () => {
            let categoryFieldDef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });
            let lineChart: LineChart = (<any>v).layers[0];
            let values = [null, 495000, null, 480000, 500000];
            let categoryValues = ['Ford', 'Chevrolet', 'VW', 'Cadillac', 'GM'];

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: categoryValues,
                            identityFields: [categoryFieldDef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: values,
                        }])
                    }
                }]
            });

            let tooltipEvent = createTooltipEvent({
                data: _.map(values, (value, index) => {
                    return { value: value, categoryValue: categoryValues[index], categoryIndex: index };
                }),
            });
            expect(lineChart.getCategoryIndexFromTooltipEvent(tooltipEvent, 0)).toBe(3);
            expect(lineChart.getCategoryIndexFromTooltipEvent(tooltipEvent, 150)).toBe(4);
            expect(lineChart.getCategoryIndexFromTooltipEvent(tooltipEvent, 230)).toBe(4);
        });

        it('getCategoryIndexFromTooltipEvent for background', () => {
            let categoryFieldDef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });
            let lineChart: LineChart = (<any>v).layers[0];

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['Ford', 'Chevrolet', 'VW', 'Cadillac', 'GM'],
                            identityFields: [categoryFieldDef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [0, 495000, 490000, 480000, 500000],
                        }])
                    }
                }]
            });

            let tooltipEvent = createTooltipEvent(undefined);
            expect(lineChart.getCategoryIndexFromTooltipEvent(tooltipEvent, 0)).toBe(0);
            expect(lineChart.getCategoryIndexFromTooltipEvent(tooltipEvent, 140)).toBe(1);
            expect(lineChart.getCategoryIndexFromTooltipEvent(tooltipEvent, 270)).toBe(2);
            expect(lineChart.getCategoryIndexFromTooltipEvent(tooltipEvent, 335)).toBe(3);
            expect(lineChart.getCategoryIndexFromTooltipEvent(tooltipEvent, 490)).toBe(4);
        });
    });

    describe("Line Chart Tooltips - Mobile interactive legend", () => {
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let v: powerbi.IVisual, element: JQuery;

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = new LineChartVisualBuilder().build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { isInteractiveLegend: true },
            });

            // Invoke onDataChange to force creation of chart layers.
            v.onDataChanged({ dataViews: [] });
        });

        it('Scalar xAxis - closest data point', () => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        queryName: 'col1',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: { Category: true },
                    }, {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: { Y: true },
                    }],
            };
            let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });
            let lineChart = (<any>v).layers[0];

            spyOn(lineChart, 'selectColumn').and.callThrough();

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: [2001, 2002, 2003, 2004, 2005],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000, 480000, 500000],
                            subtotal: 246500
                        }])
                    }
                }]
            });

            lineChart = (<any>v).layers[0];
            let pointX: number = 10;
            let seriesData = lineChart.data.series[0];
            let tooltipInfo = getComboOrMobileTooltip(lineChart, seriesData, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2001' }, { displayName: 'col2', value: '500000' }]);

            pointX = 120;
            tooltipInfo = getComboOrMobileTooltip(lineChart, seriesData, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2002' }, { displayName: 'col2', value: '495000' }]);

            pointX = 303;
            tooltipInfo = getComboOrMobileTooltip(lineChart, seriesData, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2004' }, { displayName: 'col2', value: '480000' }]);

            pointX = 450;
            tooltipInfo = getComboOrMobileTooltip(lineChart, seriesData, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2005' }, { displayName: 'col2', value: '500000' }]);
        });

        it('Scalar xAxis - outer padding cacthing first and last data point for tooltip', () => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        queryName: 'col1',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: { Category: true },
                    }, {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: { Y: true },
                    }],
            };
            let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });
            let lineChart = (<any>v).layers[0];

            spyOn(lineChart, 'selectColumn').and.callThrough();

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: [2001, 2002, 2003, 2004, 2005],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000, 480000, 500000],
                            subtotal: 246500
                        }])
                    }
                }]
            });

            lineChart = (<any>v).layers[0];
            let pointX: number = 0;
            let seriesData = lineChart.data.series[0];
            let tooltipInfo = getComboOrMobileTooltip(lineChart, seriesData, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2001' }, { displayName: 'col2', value: '500000' }]);

            pointX = 500;
            tooltipInfo = getComboOrMobileTooltip(lineChart, seriesData, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2005' }, { displayName: 'col2', value: '500000' }]);
        });

        it('Scalar xAxis, multi series - closest data point', () => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        queryName: 'col1',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: {
                            Category: true
                        }
                    },
                    {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: {
                            Series: true
                        }
                    },
                    {
                        displayName: 'col3',
                        queryName: 'col3',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        groupName: 'series1',
                        roles: {
                            Y: true
                        }
                    },
                    {
                        displayName: 'col3',
                        queryName: 'col3',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        isMeasure: true,
                        groupName: 'series2',
                        roles: {
                            Y: true
                        }
                    }],
            };

            let seriesIdentities = [
                mocks.dataViewScopeIdentity('series1'),
                mocks.dataViewScopeIdentity('series2'),
            ];

            let seriesColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col2' });

            let valueColumns = DataViewTransform.createValueColumns([
                {
                    source: dataViewMetadata.columns[2],
                    values: [null, null, 470000, 460000, 510000],
                    identity: seriesIdentities[0],
                }, {
                    source: dataViewMetadata.columns[3],
                    values: [500000, 495000, 490000, 480000, 500000],
                    identity: seriesIdentities[1],
                }],
                [seriesColumnRef],
                dataViewMetadata.columns[1]
            );

            let dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: [2001, 2002, 2003, 2004, 2005]
                    }],
                    values: valueColumns
                }
            };

            let lineChart = (<any>v).layers[0];

            spyOn(lineChart, 'selectColumn').and.callThrough();

            v.onDataChanged({
                dataViews: [dataView]
            });

            let pointX: number = 10;
            let seriesData = lineChart.data.series[0];
            let tooltipInfo = getComboOrMobileTooltip(lineChart, seriesData, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2003' }, { displayName: 'col2', value: 'series1' }, { displayName: 'col3', value: '470000' }]);

            pointX = 120;
            tooltipInfo = getComboOrMobileTooltip(lineChart, seriesData, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2004' }, { displayName: 'col2', value: 'series1' }, { displayName: 'col3', value: '460000' }]);

            pointX = 303;
            tooltipInfo = getComboOrMobileTooltip(lineChart, seriesData, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2005' }, { displayName: 'col2', value: 'series1' }, { displayName: 'col3', value: '510000' }]);

            pointX = 450;
            tooltipInfo = getComboOrMobileTooltip(lineChart, seriesData, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2005' }, { displayName: 'col2', value: 'series1' }, { displayName: 'col3', value: '510000' }]);
        });

        it('Non scalar xAxis - closest data point', () => {
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
                    }],
            };
            let lineChart = (<any>v).layers[0];

            spyOn(lineChart, 'selectColumn').and.callThrough();

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
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

            lineChart = (<any>v).layers[0];
            let pointX: number = 10;
            let seriesData = lineChart.data.series[0];
            let tooltipInfo = getComboOrMobileTooltip(lineChart, seriesData, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: 'a' }, { displayName: 'col2', value: '500000' }]);

            pointX = 120;
            tooltipInfo = getComboOrMobileTooltip(lineChart, seriesData, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: 'b' }, { displayName: 'col2', value: '495000' }]);

            pointX = 303;
            tooltipInfo = getComboOrMobileTooltip(lineChart, seriesData, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: 'd' }, { displayName: 'col2', value: '480000' }]);

            pointX = 450;
            tooltipInfo = getComboOrMobileTooltip(lineChart, seriesData, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: 'e' }, { displayName: 'col2', value: '500000' }]);
        });
    });

    describe("label data point creation", () => {
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let v: powerbi.IVisual, element: JQuery;

        beforeEach(() => {
            element = powerbitests.helpers.testDom('1000', '1000');
            v = new LineChartVisualBuilder().withLabelDensity().build();

            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: {},
            });
        });

        it("Label data points have correct text", () => {
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
                        format: '0.##;-0.##;0',
                        roles: { Y: true },
                    }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                        labelDensity: undefined,
                    }
                }
            };
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e']
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500, 300, 700, 400, 100],
                            subtotal: 2000
                        }])
                    }
                }]
            });

            let labelDataPoints = callCreateLabelDataPoints(v);

            // Important labels (last, first) should be first
            expect(labelDataPoints[0].text).toEqual("500.00");
            expect(labelDataPoints[1].text).toEqual("100.00");
            expect(labelDataPoints[2].text).toEqual("700.00");
            expect(labelDataPoints[3].text).toEqual("300.00");
            expect(labelDataPoints[4].text).toEqual("400.00");
        });

        it("Label data points respect show at the series level", () => {
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
                        format: '0.##;-0.##;0',
                        roles: { Y: true },
                    }, {
                        displayName: 'col3',
                        queryName: 'col3',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        format: '0.##;-0.##;0',
                        roles: { Y: true },
                        objects: {
                            labels: {
                                show: false,
                            }
                        },
                    }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                        labelDensity: undefined,
                    }
                }
            };
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e']
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500, 300, 700, 400, 100],
                            subtotal: 2000
                        }, {
                            source: dataViewMetadata.columns[1],
                            values: [200, 300, 200, 300, 100],
                            subtotal: 1100
                        }])
                    }
                }]
            });

            let labelDataPoints = callCreateLabelDataPoints(v);

            // Important labels (last, first) should be first
            expect(labelDataPoints[0].text).toEqual("500.00");
            expect(labelDataPoints[1].text).toEqual("100.00");
            expect(labelDataPoints[2].text).toEqual("700.00");
            expect(labelDataPoints[3].text).toEqual("300.00");
            expect(labelDataPoints[4].text).toEqual("400.00");
        });

        it("Label data points have correct default fill", () => {
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
                    }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                        labelDensity: undefined,
                    }
                }
            };
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e']
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500, 300, 700, 400, 100],
                            subtotal: 2000
                        }])
                    }
                }]
            });

            let labelDataPoints = callCreateLabelDataPoints(v);
            helpers.assertColorsMatch(labelDataPoints[0].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[1].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[2].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[3].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[4].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[0].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[1].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[2].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[3].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[4].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
        });

        it("Label data points have correct fill", () => {
            let labelColor = "#007700";
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
                    }],
                objects: {
                    labels: {
                        show: true,
                        color: { solid: { color: labelColor } },
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                        labelDensity: undefined,
                    }
                }
            };
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e']
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500, 300, 700, 400, 100],
                            subtotal: 2000
                        }])
                    }
                }]
            });

            let labelDataPoints = callCreateLabelDataPoints(v);
            helpers.assertColorsMatch(labelDataPoints[0].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[1].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[2].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[3].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[4].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[0].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[1].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[2].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[3].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[4].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
        });

        it("Label data points have correct display units", () => {
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
                    }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: 1000,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                        labelDensity: undefined,
                    }
                }
            };
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e']
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [5000, 3000, 7000, 4000, 1000],
                            subtotal: 20000,
                        }])
                    }
                }]
            });

            let labelDataPoints = callCreateLabelDataPoints(v);

            // When we don't have labelPrecision the format comes from the model but the trailing zeros are not being forced
            // Important labels (last, first) should be first
            expect(labelDataPoints[0].text).toEqual("5K");
            expect(labelDataPoints[1].text).toEqual("1K");
            expect(labelDataPoints[2].text).toEqual("7K");
            expect(labelDataPoints[3].text).toEqual("3K");
            expect(labelDataPoints[4].text).toEqual("4K");
        });

        it("Label data points have correct precision", () => {
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
                    }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: 0,
                        labelDensity: undefined,
                    }
                }
            };
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e']
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500, 300, 700, 400, 100],
                            subtotal: 2000
                        }])
                    }
                }]
            });

            let labelDataPoints = callCreateLabelDataPoints(v);

            // Important labels (last, first) should be first
            expect(labelDataPoints[0].text).toEqual("500");
            expect(labelDataPoints[1].text).toEqual("100");
            expect(labelDataPoints[2].text).toEqual("700");
            expect(labelDataPoints[3].text).toEqual("300");
            expect(labelDataPoints[4].text).toEqual("400");
        });

        it("Label data points have correct font size", () => {
            let fontSize = 13;
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
                    }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: 0,
                        fontSize: fontSize,
                        labelDensity: undefined,
                    }
                }
            };
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e']
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500, 300, 700, 400, 100],
                            subtotal: 2000
                        }])
                    }
                }]
            });

            let labelDataPoints = callCreateLabelDataPoints(v);
            expect(labelDataPoints[0].fontSize).toEqual(fontSize);
            expect(labelDataPoints[1].fontSize).toEqual(fontSize);
            expect(labelDataPoints[2].fontSize).toEqual(fontSize);
            expect(labelDataPoints[3].fontSize).toEqual(fontSize);
            expect(labelDataPoints[4].fontSize).toEqual(fontSize);
        });

        it("Label data points have correct text", () => {
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
                        format: '0.##;-0.##;0',
                        roles: { Y: true },
                    }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                        labelDensity: undefined,
                    }
                }
            };
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
                mocks.dataViewScopeIdentity('c'),
                mocks.dataViewScopeIdentity('d'),
                mocks.dataViewScopeIdentity('e'),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500, 300, 700, 400, 100],
                            subtotal: 2000
                        }])
                    }
                }]
            });

            let labelDataPoints = callCreateLabelDataPoints(v);

            // Important labels (last, first) should be first
            expect(labelDataPoints[0].key).toEqual(JSON.stringify({ series: JSON.stringify({ selector: '{"metadata":"col2"}', highlight: false }), category: categoryIdentities[0].key }));
            expect(labelDataPoints[1].key).toEqual(JSON.stringify({ series: JSON.stringify({ selector: '{"metadata":"col2"}', highlight: false }), category: categoryIdentities[4].key }));
            expect(labelDataPoints[2].key).toEqual(JSON.stringify({ series: JSON.stringify({ selector: '{"metadata":"col2"}', highlight: false }), category: categoryIdentities[2].key }));
            expect(labelDataPoints[3].key).toEqual(JSON.stringify({ series: JSON.stringify({ selector: '{"metadata":"col2"}', highlight: false }), category: categoryIdentities[1].key }));
            expect(labelDataPoints[4].key).toEqual(JSON.stringify({ series: JSON.stringify({ selector: '{"metadata":"col2"}', highlight: false }), category: categoryIdentities[3].key }));
        });

        it("Label data points do not have zero width parent for stacked area with scalar axis", () => {
            let areaChart = new powerbi.visuals.CartesianChart({
                chartType: powerbi.visuals.CartesianChartType.StackedArea,
                isScrollable: true,
                tooltipsEnabled: true,
                animator: new powerbi.visuals.BaseAnimator(),
                behavior: new powerbi.visuals.CartesianChartBehavior([new powerbi.visuals.LineChartWebBehavior()])
            });

            areaChart.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: {},
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
                        format: '0.##;-0.##;0',
                        roles: { Y: true },
                    }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                        labelDensity: undefined,
                    },
                    categoryAxis: {
                        scalar: true,
                    },
                }
            };
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
                mocks.dataViewScopeIdentity('c'),
                mocks.dataViewScopeIdentity('d'),
                mocks.dataViewScopeIdentity('e'),
            ];
            areaChart.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500, 300, 700, 400, 100],
                            subtotal: 2000
                        }])
                    }
                }]
            });

            let labelDataPoints = callCreateLabelDataPoints(areaChart);

            // Important labels (last, first) should be first
            expect((<LabelParentRect>labelDataPoints[0].parentShape).rect.width).toBeGreaterThan(0);
            expect((<LabelParentRect>labelDataPoints[1].parentShape).rect.width).toBeGreaterThan(0);
            expect((<LabelParentRect>labelDataPoints[2].parentShape).rect.width).toBeGreaterThan(0);
            expect((<LabelParentRect>labelDataPoints[3].parentShape).rect.width).toBeGreaterThan(0);
            expect((<LabelParentRect>labelDataPoints[4].parentShape).rect.width).toBeGreaterThan(0);
        });
    });
    
    function callCreateLabelDataPoints(v: powerbi.IVisual): powerbi.LabelDataPoint[] {
        let labelDataPointsGroups = (<any>v).layers[0].createLabelDataPoints();
        return labelDataPointsGroups[0].labelDataPoints;
    }

    function createTooltipEvent(data: any, context?: HTMLElement): powerbi.visuals.TooltipEvent {
        return {
            data: data,
            coordinates: [],
            elementCoordinates: [],
            context: context,
            isTouchEvent: false,
        };
    }

    /**
     * Obtains a tooltip using the appropriate set of functions from lineChart
     */
    function getTooltip(lineChart: LineChart, seriesData: any, pointX: number, context?: HTMLElement): powerbi.visuals.TooltipDataItem[] {
        let index = lineChart.getCategoryIndexFromTooltipEvent(createTooltipEvent(seriesData, context), pointX);
        let categoryData = lineChart.selectColumnForTooltip(index);
        return lineChart.getSeriesTooltipInfo(categoryData);
    }

    /**
     * Obtains a tooltip using the appropriate set of functions from lineChart
     */
    function getComboOrMobileTooltip(lineChart: LineChart, seriesData: any, pointX: number, context?: HTMLElement): powerbi.visuals.TooltipDataItem[] {
        return lineChart.getTooltipInfoForCombo(createTooltipEvent(seriesData, context), pointX);
    }

    function InjectScalarKeys(objects: DataViewObjects[], scalarKeys: ScalarKeys) {
        debug.assert(!!objects, "objects must be defined");
        debug.assert(!!scalarKeys, "scalarKeys must be defined");
        debug.assert(!_.isEmpty(scalarKeys.values), "scalarKeys must have values");

        for (let i = 0; i < scalarKeys.values.length; i++) {
            let objectsForScalarKeys: DataViewObjects = {};
            let scalarKeyObject: powerbi.DataViewObject = {};
            scalarKeyObject[lineChartProps.scalarKey.scalarKeyMin.propertyName] = scalarKeys.values[i].min;
            objectsForScalarKeys[lineChartProps.scalarKey.scalarKeyMin.objectName] = scalarKeyObject;
            objects[i] = objectsForScalarKeys;
        }
    }

    class LineChartVisualBuilder {
        private isMobile: boolean;
        private isAreaChart: boolean;
        private isStacked: boolean;

        public areaChart(isStacked: boolean): this {
            this.isAreaChart = true;
            this.isStacked = isStacked;
            return this;
        }

        public forMobile(): this {
            this.isMobile = true;
            return this;
        }

        public withLabelDensity(): this {
            return this;
        }

        public build(): powerbi.visuals.CartesianChart {
            let chartType = CartesianChartType.Line;
            if (this.isAreaChart) {
                chartType = this.isStacked
                    ? CartesianChartType.StackedArea
                    : CartesianChartType.Area;
            }

            return new powerbi.visuals.CartesianChart({
                chartType: chartType,
                trimOrdinalDataOnOverflow: this.isMobile ? false : true,
                isScrollable: this.isMobile ? false : true,
                advancedLineLabelsEnabled: true,
            });
        }
    }
}
