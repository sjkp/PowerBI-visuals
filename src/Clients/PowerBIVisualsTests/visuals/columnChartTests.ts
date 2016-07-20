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
    import AxisHelper = powerbi.visuals.AxisHelper;
    import axisScale = powerbi.visuals.axisScale;
    import AxisType = powerbi.visuals.axisType;
    import buildSelectorForColumn = powerbitests.helpers.buildSelectorForColumn;
    import CartesianChart = powerbi.visuals.CartesianChart;
    import CartesianChartBehavior = powerbi.visuals.CartesianChartBehavior;
    import CartesianChartType = powerbi.visuals.CartesianChartType;
    import ColumnChart = powerbi.visuals.ColumnChart;
    import ColumnChartType = powerbi.visuals.ColumnChartType;
    import ColumnChartWebBehavior = powerbi.visuals.ColumnChartWebBehavior;
    import ColumnUtil = powerbi.visuals.ColumnUtil;
    import CompiledDataViewMapping = powerbi.data.CompiledDataViewMapping;
    import DataViewObjects = powerbi.DataViewObjects;
    import DataViewSelfCrossJoin = powerbi.data.DataViewSelfCrossJoin;
    import DataViewTransform = powerbi.data.DataViewTransform;
    import LegendIcon = powerbi.visuals.LegendIcon;
    import LegendPosition = powerbi.visuals.LegendPosition;
    import lineStyle = powerbi.visuals.lineStyle;
    import PixelConverter = jsCommon.PixelConverter;
    import Prototype = powerbi.Prototype;
    import PrimitiveType = powerbi.PrimitiveType;
    import SelectionId = powerbi.visuals.SelectionId;
    import SQExprShortSerializer = powerbi.data.SQExprShortSerializer;
    import StackedUtil = powerbi.visuals.StackedUtil;
    import SVGUtil = powerbi.visuals.SVGUtil;
    import TrendLineHelper = powerbi.visuals.TrendLineHelper;
    import ValueType = powerbi.ValueType;
    import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
    import WebColumnChartAnimator = powerbi.visuals.WebColumnChartAnimator;

    powerbitests.mocks.setLocale();

    describe("ColumnChart", () => {
        let categoryColumn: powerbi.DataViewMetadataColumn = { displayName: 'year', queryName: 'selectYear', type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text), roles: { Category: true } };
        let categoryColumnDate: powerbi.DataViewMetadataColumn = { displayName: 'date', queryName: 'selectDate', type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Date), roles: { Category: true } };
        let measureColumn: powerbi.DataViewMetadataColumn = { displayName: 'sales', queryName: 'selectSales', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer), objects: { general: { formatString: '$0' } }, roles: { Y: true } };
        let measure2Column: powerbi.DataViewMetadataColumn = { displayName: 'tax', queryName: 'selectTax', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y: true } };
        let measure3Column: powerbi.DataViewMetadataColumn = { displayName: 'profit', queryName: 'selectProfit', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y: true } };
        let nullMeasureColumn: powerbi.DataViewMetadataColumn = { displayName: null, queryName: 'selectNull', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y: true } };
        let measureWithFormatString: powerbi.DataViewMetadataColumn = { displayName: 'tax', queryName: 'selectTax', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), format: '$0', roles: { Y: true } };

        let tooltipsWithFormatString: powerbi.DataViewMetadataColumn = { displayName: 'tooltips', queryName: 'tooltips', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), format: '$0', roles: { Tooltips: true } };

        let measureColumnDynamic1: powerbi.DataViewMetadataColumn = { displayName: 'sales', queryName: 'selectSales', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), objects: { general: { formatString: '$0' } }, groupName: 'A', roles: { Y: true }  };
        let measureColumnDynamic2: powerbi.DataViewMetadataColumn = { displayName: 'sales', queryName: 'selectSales', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), objects: { general: { formatString: '$0' } }, groupName: 'B', roles: { Y: true }  };
        let measureColumnDynamic1RefExpr = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'sales' });

        it('ColumnChart registered capabilities', () => {
            expect(JSON.stringify(powerbi.visuals.plugins.columnChart.capabilities)).toBe(JSON.stringify(powerbi.visuals.getColumnChartCapabilities()));
        });

        it('ColumnChart registered customizeQuery', () => {
            expect(powerbi.visuals.plugins.columnChart.customizeQuery).toBe(ColumnChart.customizeQuery);
        });

        it('Capabilities should include dataViewMappings', () => {
            expect(powerbi.visuals.getColumnChartCapabilities().dataViewMappings).toBeDefined();
        });

        it('Capabilities should include dataRoles', () => {
            expect(powerbi.visuals.getColumnChartCapabilities().dataRoles).toBeDefined();
        });

        it('Capabilities should not suppressDefaultTitle', () => {
            expect(powerbi.visuals.getColumnChartCapabilities().suppressDefaultTitle).toBeUndefined();
        });

        it('FormatString property should match calculated', () => {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(powerbi.visuals.getColumnChartCapabilities().objects)).toEqual(powerbi.visuals.columnChartProps.general.formatString);
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

            it('sets the correct DataVolume', () => {
                dataViewMapping = createCompiledDataViewMapping(null);
                customizeQuery();
                
                expect(dataViewMapping.categorical.dataVolume).toEqual(4);
            });

            function customizeQuery(): void {
                ColumnChart.customizeQuery({
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
            let dataViewMapping = createCompiledDataViewMapping(null, objects);

            expect(ColumnChart.getSortableRoles({
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

            expect(ColumnChart.getSortableRoles({
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
                                { for: { in: { role: 'Y', items: [{ queryName: 'y1', type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer) }] } } },
                                { bind: { to: { role: 'Gradient', items: [{ queryName: 'g1', type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer) }] } } },
                            ],
                            dataReductionAlgorithm: { top: { count: 60 } }
                        }
                    }
                }
            };
        }

        it('selection state set on converter result', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: [100, 200]
                    }])
                }
            };
            let selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], measureColumn.queryName, categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], measureColumn.queryName, categoryColumn.queryName)
            ];
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            // Create mock interactivity service
            let interactivityService = <powerbi.visuals.InteractivityService>powerbi.visuals.createInteractivityService(powerbitests.mocks.createVisualHostServices());
            interactivityService['selectedIds'] = [selectionIds[0]];

            // We should see the selection state applied to resulting data
            let data = ColumnChart.converter(dataView, colors, undefined, undefined, undefined, undefined, interactivityService);

            expect(data.series[0].data[0].selected).toBe(true);
            expect(data.series[0].data[1].selected).toBe(false);
            expect(data.legendData.dataPoints[0].selected).toBe(false);

            let seriesSelectionId = SelectionId.createWithMeasure(measureColumn.queryName);
            interactivityService['selectedIds'] = [seriesSelectionId];
            data = ColumnChart.converter(dataView, colors, undefined, undefined, undefined, undefined, interactivityService);

            expect(data.series[0].data[0].selected).toBe(true);
            expect(data.series[0].data[1].selected).toBe(true);
            expect(data.legendData.dataPoints[0].selected).toBe(true);
        });

        it('has positive measure', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: [100, 200]
                    }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            // We should not summarize the X-axis values with DisplayUnits per-PowerView behavior, so ensure that we are using the 'Verbose' mode for the formatter.
            spyOn(powerbi.visuals.valueFormatter, 'create').and.callThrough();
            let data = ColumnChart.converter(dataView, colors);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], measureColumn.queryName, categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], measureColumn.queryName, categoryColumn.queryName)];

            expect(powerbi.visuals.valueFormatter.create).toHaveBeenCalledWith({ format: undefined, value: 2011, value2: 2012, displayUnitSystemType: powerbi.DisplayUnitSystemType.Verbose });
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);
            expect(legendItems.length).toBe(1);
            let expectedSeries = [{
                key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                    {
                        categoryValue: 2011,
                        value: 100,
                        position: 100,
                        valueAbsolute: 100,
                        valueOriginal: 100,
                        seriesIndex: 0,
                        labelFill: undefined,
                        labelFormatString: undefined,
                        categoryIndex: 0,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 100,
                        originalPosition: 100,
                        originalValueAbsolute: 100,
                        identity: selectionIds[0],
                        key: selectionIds[0].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100" }],
                        lastSeries: undefined,
                        chartType: undefined,
                        labelSettings: defaultLabelSettings,
                    }, {
                        categoryValue: 2012,
                        value: 200,
                        position: 200,
                        valueAbsolute: 200,
                        valueOriginal: 200,
                        seriesIndex: 0,
                        labelFill: undefined,
                        labelFormatString: undefined,
                        categoryIndex: 1,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 200,
                        originalPosition: 200,
                        originalValueAbsolute: 200,
                        identity: selectionIds[1],
                        key: selectionIds[1].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "$200" }],
                        lastSeries: undefined,
                        chartType: undefined,
                        labelSettings: defaultLabelSettings,
                    }
                ]
            }];
            expect(data.series).toEqual(expectedSeries);
            expect(AxisHelper.createValueDomain(data.series, true)).toEqual([0, 200]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: 0,
                max: 200
            });
        });

        it('has positive measure (100%)', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: [100, 200]
                    }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = ColumnChart.converter(dataView, colors, true);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], measureColumn.queryName, categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], measureColumn.queryName, categoryColumn.queryName)];

            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(true);
            expect(legendItems.length).toBe(1);
            expect(data.series).toEqual([{
                key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                    {
                        categoryValue: 2011,
                        value: 1,
                        position: 1,
                        valueAbsolute: 1,
                        valueOriginal: 100,
                        seriesIndex: 0,
                        labelFill: data.labelSettings.labelColor,
                        labelFormatString: undefined,
                        categoryIndex: 0,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 1,
                        originalPosition: 1,
                        originalValueAbsolute: 1,
                        identity: selectionIds[0],
                        key: selectionIds[0].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100 (100%)" }],
                        lastSeries: undefined,
                        chartType: undefined,
                        labelSettings: defaultLabelSettings,
                    },
                    {
                        categoryValue: 2012,
                        value: 1,
                        position: 1,
                        valueAbsolute: 1,
                        valueOriginal: 200,
                        seriesIndex: 0,
                        labelFill: data.labelSettings.labelColor,
                        labelFormatString: undefined,
                        categoryIndex: 1,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 1,
                        originalPosition: 1,
                        originalValueAbsolute: 1,
                        identity: selectionIds[1],
                        key: selectionIds[1].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "$200 (100%)" }],
                        lastSeries: undefined,
                        chartType: undefined,
                        labelSettings: defaultLabelSettings,
                    }
                ]
            }]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ true)).toEqual({
                min: 0,
                max: 1
            });
        });

        it('has positive measure - two series (100%)', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: [100, 200],
                    },
                        {
                            source: measure2Column,
                            values: [60, 50],
                        }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = ColumnChart.converter(dataView, colors, true);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], "selectSales", categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], "selectSales", categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], "selectTax", categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], "selectTax", categoryColumn.queryName)];

            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(true);
            expect(legendItems.length).toBe(2);
            expect(data.series).toEqual([{
                key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                    {
                        categoryValue: 2011,
                        value: 0.625,
                        position: 0.625,
                        valueAbsolute: 0.625,
                        valueOriginal: 100,
                        seriesIndex: 0,
                        labelFill: data.labelSettings.labelColor,
                        labelFormatString: undefined,
                        categoryIndex: 0,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 0.625,
                        originalPosition: 0.625,
                        originalValueAbsolute: 0.625,
                        identity: selectionIds[0],
                        key: selectionIds[0].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100 (62.5%)" }],
                        lastSeries: undefined,
                        chartType: undefined,
                        labelSettings: defaultLabelSettings,
                    }, {
                        categoryValue: 2012,
                        value: 0.8,
                        position: 0.8,
                        valueAbsolute: 0.8,
                        valueOriginal: 200,
                        seriesIndex: 0,
                        labelFill: data.labelSettings.labelColor,
                        labelFormatString: undefined,
                        categoryIndex: 1,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 0.8,
                        originalPosition: 0.8,
                        originalValueAbsolute: 0.8,
                        identity: selectionIds[1],
                        key: selectionIds[1].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "$200 (80%)" }],
                        lastSeries: undefined,
                        chartType: undefined,
                        labelSettings: defaultLabelSettings,
                    }
                ]
            },
                {
                    key: 'series1', index: 1, displayName: 'tax', identity: SelectionId.createWithMeasure("selectTax"), color: legendItems[1].color, labelSettings: data.series[1].labelSettings, data: [
                        {
                            categoryValue: 2011,
                            value: 0.375,
                            position: 1,
                            valueAbsolute: 0.375,
                            valueOriginal: 60,
                            seriesIndex: 1,
                            labelFill: data.labelSettings.labelColor,
                            labelFormatString: undefined,
                            categoryIndex: 0,
                            color: legendItems[1].color,
                            selected: false,
                            originalValue: 0.375,
                            originalPosition: 1,
                            originalValueAbsolute: 0.375,
                            identity: selectionIds[2],
                            key: selectionIds[2].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "tax", value: "60 (37.5%)" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }, {
                            categoryValue: 2012,
                            value: 0.2,
                            position: 1,
                            valueAbsolute: 0.2,
                            valueOriginal: 50,
                            seriesIndex: 1,
                            labelFill: data.labelSettings.labelColor,
                            labelFormatString: undefined,
                            categoryIndex: 1,
                            color: legendItems[1].color,
                            selected: false,
                            originalValue: 0.2,
                            originalPosition: 1,
                            originalValueAbsolute: 0.2,
                            identity: selectionIds[3],
                            key: selectionIds[3].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "tax", value: "50 (20%)" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }
                    ]
                }]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ true)).toEqual({
                min: 0,
                max: 1
            });
        });

        it('has negative measure', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: [100, -200]
                    }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = ColumnChart.converter(dataView, colors);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], measureColumn.queryName, categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], measureColumn.queryName, categoryColumn.queryName)];
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);

            expect(data.series).toEqual([{
                key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                    {
                        categoryValue: 2011,
                        value: 100,
                        position: 100,
                        valueAbsolute: 100,
                        valueOriginal: 100,
                        seriesIndex: 0,
                        labelFill: undefined,
                        labelFormatString: undefined,
                        categoryIndex: 0,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 100,
                        originalPosition: 100,
                        originalValueAbsolute: 100,
                        identity: selectionIds[0],
                        key: selectionIds[0].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100" }],
                        lastSeries: undefined,
                        chartType: undefined,
                        labelSettings: defaultLabelSettings,
                    },
                    {
                        categoryValue: 2012,
                        value: -200,
                        position: 0,
                        valueAbsolute: 200,
                        valueOriginal: -200,
                        seriesIndex: 0,
                        labelFill: undefined,
                        labelFormatString: undefined,
                        categoryIndex: 1,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: -200,
                        originalPosition: 0,
                        originalValueAbsolute: 200,
                        identity: selectionIds[1],
                        key: selectionIds[1].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "-$200" }],
                        lastSeries: undefined,
                        chartType: undefined,
                        labelSettings: defaultLabelSettings,
                    }]
            }]);
            expect(AxisHelper.createValueDomain(data.series, true)).toEqual([-200, 100]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: -200,
                max: 100
            });
        });

        it('has positive and negative measure - two series', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: [2, -2],
                    },
                        {
                            source: measure2Column,
                            values: [-3, 4],
                        },
                        {
                            source: measure3Column,
                            values: [4, -3],
                        }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = ColumnChart.converter(dataView, colors);
            expect(data.series[2].data[0].position).toEqual(6);
            expect(data.series[2].data[1].position).toEqual(-2);
            expect(AxisHelper.createValueDomain(data.series, true)).toEqual([-3, 4]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: -5,
                max: 6
            });
        });

        it('has negative measure (100%)', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: [100, -200]
                    }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = ColumnChart.converter(dataView, colors, true);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], measureColumn.queryName, categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], measureColumn.queryName, categoryColumn.queryName)];
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(true);

            expect(data.series).toEqual([{
                key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                    {
                        categoryValue: 2011,
                        value: 1,
                        position: 1,
                        valueAbsolute: 1,
                        valueOriginal: 100,
                        seriesIndex: 0,
                        labelFill: data.labelSettings.labelColor,
                        labelFormatString: undefined,
                        categoryIndex: 0,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 1,
                        originalPosition: 1,
                        originalValueAbsolute: 1,
                        identity: selectionIds[0],
                        key: selectionIds[0].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100 (100%)" }],
                        lastSeries: undefined,
                        chartType: undefined,
                        labelSettings: defaultLabelSettings,
                    }, {
                        categoryValue: 2012,
                        value: -1,
                        position: 0,
                        valueAbsolute: 1,
                        valueOriginal: -200,
                        seriesIndex: 0,
                        labelFill: data.labelSettings.labelColor,
                        labelFormatString: undefined,
                        categoryIndex: 1,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: -1,
                        originalPosition: 0,
                        originalValueAbsolute: 1,
                        identity: selectionIds[1],
                        key: selectionIds[1].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "-$200 (100%)" }],
                        lastSeries: undefined,
                        chartType: undefined,
                        labelSettings: defaultLabelSettings,
                    }
                ]
            }]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ true)).toEqual({
                min: -1,
                max: 1
            });
        });

        it('is missing a measure', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: [100, null]
                    }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = ColumnChart.converter(dataView, colors);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], measureColumn.queryName, categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], measureColumn.queryName, categoryColumn.queryName)];
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);

            expect(data.series).toEqual([{
                key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                    {
                        categoryValue: 2011,
                        value: 100,
                        position: 100,
                        valueAbsolute: 100,
                        valueOriginal: 100,
                        seriesIndex: 0,
                        labelFill: undefined,
                        labelFormatString: undefined,
                        categoryIndex: 0,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 100,
                        originalPosition: 100,
                        originalValueAbsolute: 100,
                        identity: selectionIds[0],
                        key: selectionIds[0].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100" }],
                        lastSeries: undefined,
                        chartType: undefined,
                        labelSettings: defaultLabelSettings,
                    }, {
                        categoryValue: 2012,
                        value: null,
                        position: 0,
                        valueAbsolute: 0,
                        valueOriginal: null,
                        seriesIndex: 0,
                        labelFill: undefined,
                        labelFormatString: undefined,
                        categoryIndex: 1,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: null,
                        originalPosition: 0,
                        originalValueAbsolute: 0,
                        identity: selectionIds[1],
                        key: selectionIds[1].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2012" }],
                        lastSeries: undefined,
                        chartType: undefined,
                        labelSettings: defaultLabelSettings,
                    }
                ]
            }]);
            expect(AxisHelper.createValueDomain(data.series, true)).toEqual([0, 100]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: 0,
                max: 100
            });
        });

        it('is missing a category', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity(null),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, null],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: [100, 175]
                    }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = ColumnChart.converter(dataView, colors);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], measureColumn.queryName, categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], measureColumn.queryName, categoryColumn.queryName)];
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);

            expect(data.series).toEqual([{
                key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                    {
                        categoryValue: 2011,
                        value: 100,
                        position: 100,
                        valueAbsolute: 100,
                        valueOriginal: 100,
                        seriesIndex: 0,
                        labelFill: undefined,
                        labelFormatString: undefined,
                        categoryIndex: 0,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 100,
                        originalPosition: 100,
                        originalValueAbsolute: 100,
                        identity: selectionIds[0],
                        key: selectionIds[0].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100" }],
                        lastSeries: undefined,
                        chartType: undefined,
                        labelSettings: defaultLabelSettings,
                    },
                    {
                        categoryValue: null,
                        value: 175,
                        position: 175,
                        valueAbsolute: 175,
                        valueOriginal: 175,
                        seriesIndex: 0,
                        labelFill: undefined,
                        labelFormatString: undefined,
                        categoryIndex: 1,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 175,
                        originalPosition: 175,
                        originalValueAbsolute: 175,
                        identity: selectionIds[1],
                        key: selectionIds[1].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "(Blank)" }, { displayName: "sales", value: "$175" }],
                        lastSeries: undefined,
                        chartType: undefined,
                        labelSettings: defaultLabelSettings,
                    }
                ]
            }]);
            expect(AxisHelper.createValueDomain(data.series, true)).toEqual([0, 175]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: 0,
                max: 175
            });
        });

        it('multiple measures', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: measureColumn,
                            values: [100, 200]
                        }, {
                            source: measure2Column,
                            values: [62, 55]
                        }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let series1Color = colors.getColorByIndex(0).value;
            let series2Color = colors.getColorByIndex(1).value;

            let data = ColumnChart.converter(dataView, colors);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], "selectSales", categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], "selectSales", categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], "selectTax", categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], "selectTax", categoryColumn.queryName),
            ];
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);

            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                        {
                            categoryValue: 2011,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 0,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: 2012,
                            value: 200,
                            position: 200,
                            valueAbsolute: 200,
                            valueOriginal: 200,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 1,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 200,
                            originalPosition: 200,
                            originalValueAbsolute: 200,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "$200" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }
                    ]
                },
                    {
                        key: 'series1', index: 1, displayName: 'tax', identity: SelectionId.createWithMeasure("selectTax"), color: legendItems[1].color, labelSettings: data.series[1].labelSettings, data: [
                            {
                                categoryValue: 2011,
                                value: 62,
                                position: 162,
                                valueAbsolute: 62,
                                valueOriginal: 62,
                                seriesIndex: 1,
                                labelFill: undefined,
                                labelFormatString: undefined,
                                categoryIndex: 0,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 62,
                                originalPosition: 162,
                                originalValueAbsolute: 62,
                                identity: selectionIds[2],
                                key: selectionIds[2].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "tax", value: "62" }],
                                lastSeries: undefined,
                                chartType: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                            {
                                categoryValue: 2012,
                                value: 55,
                                position: 255,
                                valueAbsolute: 55,
                                valueOriginal: 55,
                                seriesIndex: 1,
                                labelFill: undefined,
                                labelFormatString: undefined,
                                categoryIndex: 1,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 55,
                                originalPosition: 255,
                                originalValueAbsolute: 55,
                                identity: selectionIds[3],
                                key: selectionIds[3].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "tax", value: "55" }],
                                lastSeries: undefined,
                                chartType: undefined,
                                labelSettings: defaultLabelSettings,
                            }
                        ]
                    }]
            );
            expect(AxisHelper.createValueDomain(data.series, true)).toEqual([0, 200]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: 0,
                max: 255
            });
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: series1Color, label: measureColumn.displayName, identity: SelectionId.createWithMeasure("selectSales"), selected: false },
                { icon: LegendIcon.Box, color: series2Color, label: measure2Column.displayName, identity: SelectionId.createWithMeasure("selectTax"), selected: false }
            ]);
        });

        it('converter: dynamic series', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let seriesIdentities = [
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, "A"),
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, "B"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: measureColumnDynamic1,
                            values: [100, 200],
                            identity: seriesIdentities[0],
                        }, {
                            source: measureColumnDynamic2,
                            values: [62, 55],
                            identity: seriesIdentities[1],
                        }],
                        [measureColumnDynamic1RefExpr],
                        measureColumn)
                }
            };

            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let seriesColumnId = SQExprShortSerializer.serializeArray([measureColumnDynamic1RefExpr]);
            let series1Color = colors.getColorScaleByKey(seriesColumnId).getColor('A').value;
            let series2Color = colors.getColorScaleByKey(seriesColumnId).getColor('B').value;

            let data = ColumnChart.converter(dataView, colors);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic1.queryName, seriesIdentities[0], buildSelectorForColumn(categoryColumn.queryName, categoryIdentities[0])), measureColumnDynamic1.queryName),
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic2.queryName, seriesIdentities[0], buildSelectorForColumn(categoryColumn.queryName, categoryIdentities[1])), measureColumnDynamic2.queryName),
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic1.queryName, seriesIdentities[1], buildSelectorForColumn(categoryColumn.queryName, categoryIdentities[0])), measureColumnDynamic1.queryName),
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic2.queryName, seriesIdentities[1], buildSelectorForColumn(categoryColumn.queryName, categoryIdentities[1])), measureColumnDynamic2.queryName),
            ];
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);

            expect(data.series).toEqualDeep(
                [{
                    key: 'series0', index: 0, displayName: 'A', identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic1.queryName, seriesIdentities[0]), measureColumnDynamic1.queryName), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                        {
                            categoryValue: 2011,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 0,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "A" }, { displayName: "sales", value: "$100" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: 2012,
                            value: 200,
                            position: 200,
                            valueAbsolute: 200,
                            valueOriginal: 200,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 1,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 200,
                            originalPosition: 200,
                            originalValueAbsolute: 200,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "A" }, { displayName: "sales", value: "$200" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }
                    ]
                }, {
                        key: 'series1', index: 1, displayName: 'B', identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic2.queryName, seriesIdentities[1]), measureColumnDynamic2.queryName), color: legendItems[1].color, labelSettings: data.series[0].labelSettings, data: [
                            {
                                categoryValue: 2011,
                                value: 62,
                                position: 162,
                                valueAbsolute: 62,
                                valueOriginal: 62,
                                seriesIndex: 1,
                                labelFill: undefined,
                                labelFormatString: undefined,
                                categoryIndex: 0,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 62,
                                originalPosition: 162,
                                originalValueAbsolute: 62,
                                identity: selectionIds[2],
                                key: selectionIds[2].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "B" }, { displayName: "sales", value: "$62" }],
                                lastSeries: undefined,
                                chartType: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                            {
                                categoryValue: 2012,
                                value: 55,
                                position: 255,
                                valueAbsolute: 55,
                                valueOriginal: 55,
                                seriesIndex: 1,
                                labelFill: undefined,
                                labelFormatString: undefined,
                                categoryIndex: 1,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 55,
                                originalPosition: 255,
                                originalValueAbsolute: 55,
                                identity: selectionIds[3],
                                key: selectionIds[3].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "B" }, { displayName: "sales", value: "$55" }],
                                lastSeries: undefined,
                                chartType: undefined,
                                labelSettings: defaultLabelSettings,
                            }
                        ]
                    }]
            );

            expect(data.legendData.title).toEqual("sales");
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: series1Color, label: measureColumnDynamic1.groupName, identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic1.queryName, seriesIdentities[0]), measureColumnDynamic1.queryName), selected: false },
                { icon: LegendIcon.Box, color: series2Color, label: measureColumnDynamic2.groupName, identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic2.queryName, seriesIdentities[1]), measureColumnDynamic2.queryName), selected: false }
            ]);
        });

        it('converter: dynamic series falsy group instances', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let seriesIdentities = [
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, null),
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, false),
            ];
            let measureColumnSources: powerbi.DataViewMetadataColumn[] = [
                Prototype.inherit(measureColumnDynamic1, c => c.groupName = null),
                Prototype.inherit(measureColumnDynamic2, c => c.groupName = <any>false),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: measureColumnSources[0],
                            values: [100, 200],
                            identity: seriesIdentities[0],
                        }, {
                            source: measureColumnSources[1],
                            values: [62, 55],
                            identity: seriesIdentities[1],
                        }],
                        [measureColumnDynamic1RefExpr],
                        measureColumn)
                }
            };

            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let data = ColumnChart.converter(dataView, colors);
            let legendItems = data.legendData.dataPoints;
            expect(data.legendData.title).toEqual("sales");
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: legendItems[0].color, label: '(Blank)', identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic1.queryName, seriesIdentities[0]), measureColumnDynamic1.queryName), selected: false },
                { icon: LegendIcon.Box, color: legendItems[1].color, label: 'False', identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic2.queryName, seriesIdentities[1]), measureColumnDynamic2.queryName), selected: false }
            ]);
        });

        it('converter: dynamic series + fill color', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let seriesIdentities = [
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, "A"),
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, "B"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: measureColumnDynamic1,
                            values: [100, 200],
                            identity: seriesIdentities[0],
                        }, {
                            source: measureColumnDynamic2,
                            values: [62, 55],
                            identity: seriesIdentities[1],
                        }],
                        [measureColumnDynamic1RefExpr],
                        measureColumn)
                }
            };

            let groupedValues = dataView.categorical.values.grouped();
            groupedValues[1].objects = { dataPoint: { fill: { solid: { color: 'red' } } } };
            dataView.categorical.values.grouped = () => groupedValues;

            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let data = ColumnChart.converter(dataView, colors);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic1.queryName, seriesIdentities[0], buildSelectorForColumn(categoryColumn.queryName, categoryIdentities[0])), measureColumnDynamic1.queryName),
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic2.queryName, seriesIdentities[0], buildSelectorForColumn(categoryColumn.queryName, categoryIdentities[1])), measureColumnDynamic2.queryName),
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic1.queryName, seriesIdentities[1], buildSelectorForColumn(categoryColumn.queryName, categoryIdentities[0])), measureColumnDynamic1.queryName),
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic2.queryName, seriesIdentities[1], buildSelectorForColumn(categoryColumn.queryName, categoryIdentities[1])), measureColumnDynamic2.queryName),
            ];
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);

            expect(data.series).toEqualDeep(
                [{
                    key: 'series0', index: 0, displayName: 'A', identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic1.queryName, seriesIdentities[0]), measureColumnDynamic1.queryName), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                        {
                            categoryValue: 2011,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 0,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "A" }, { displayName: "sales", value: "$100" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: 2012,
                            value: 200,
                            position: 200,
                            valueAbsolute: 200,
                            valueOriginal: 200,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 1,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 200,
                            originalPosition: 200,
                            originalValueAbsolute: 200,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "A" }, { displayName: "sales", value: "$200" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }
                    ]
                }, {
                        key: 'series1', index: 1, displayName: 'B', identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic2.queryName, seriesIdentities[1]), measureColumnDynamic2.queryName), color: legendItems[1].color, labelSettings: data.series[1].labelSettings, data: [
                            {
                                categoryValue: 2011,
                                value: 62,
                                position: 162,
                                valueAbsolute: 62,
                                valueOriginal: 62,
                                seriesIndex: 1,
                                labelFill: undefined,
                                labelFormatString: undefined,
                                categoryIndex: 0,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 62,
                                originalPosition: 162,
                                originalValueAbsolute: 62,
                                identity: selectionIds[2],
                                key: selectionIds[2].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "B" }, { displayName: "sales", value: "$62" }],
                                lastSeries: undefined,
                                chartType: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                            {
                                categoryValue: 2012,
                                value: 55,
                                position: 255,
                                valueAbsolute: 55,
                                valueOriginal: 55,
                                seriesIndex: 1,
                                labelFill: undefined,
                                labelFormatString: undefined,
                                categoryIndex: 1,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 55,
                                originalPosition: 255,
                                originalValueAbsolute: 55,
                                identity: selectionIds[3],
                                key: selectionIds[3].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "B" }, { displayName: "sales", value: "$55" }],
                                lastSeries: undefined,
                                chartType: undefined,
                                labelSettings: defaultLabelSettings,
                            }
                        ]
                    }]
            );

            expect(data.legendData.title).toEqual("sales");
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: '#01B8AA', label: measureColumnDynamic1.groupName, identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic1.queryName, seriesIdentities[0]), measureColumnDynamic1.queryName), selected: false },
                { icon: LegendIcon.Box, color: 'red', label: measureColumnDynamic2.groupName, identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic2.queryName, seriesIdentities[1]), measureColumnDynamic2.queryName), selected: false }
            ]);
        });

        it('converter: dynamic series, default color', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let seriesIdentities = [
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, "A"),
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, "B"),
            ];
            let hexDefaultColorRed = "#FF0000";
            let metadata: powerbi.DataViewMetadata = {
                columns: null,
                objects: { dataPoint: { defaultColor: { solid: { color: hexDefaultColorRed } } } }
            };
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: measureColumnDynamic1,
                            values: [100, 200],
                            identity: seriesIdentities[0],
                        }, {
                            source: measureColumnDynamic2,
                            values: [62, 55],
                            identity: seriesIdentities[1],
                        }],
                        [measureColumnDynamic1RefExpr],
                        measureColumn)
                }
            };

            let groupedValues = dataView.categorical.values.grouped();
            dataView.categorical.values.grouped = () => groupedValues;

            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = ColumnChart.converter(dataView, colors, null, null, metadata);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic1.queryName, seriesIdentities[0], buildSelectorForColumn(categoryColumn.queryName, categoryIdentities[0])), measureColumnDynamic1.queryName),
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic2.queryName, seriesIdentities[0], buildSelectorForColumn(categoryColumn.queryName, categoryIdentities[1])), measureColumnDynamic2.queryName),
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic1.queryName, seriesIdentities[1], buildSelectorForColumn(categoryColumn.queryName, categoryIdentities[0])), measureColumnDynamic1.queryName),
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic2.queryName, seriesIdentities[1], buildSelectorForColumn(categoryColumn.queryName, categoryIdentities[1])), measureColumnDynamic2.queryName),
            ];
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);

            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'A', identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic1.queryName, seriesIdentities[0]), measureColumnDynamic1.queryName), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                        {
                            categoryValue: 2011,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 0,
                            color: hexDefaultColorRed,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "A" }, { displayName: "sales", value: "$100" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: 2012,
                            value: 200,
                            position: 200,
                            valueAbsolute: 200,
                            valueOriginal: 200,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 1,
                            color: hexDefaultColorRed,
                            selected: false,
                            originalValue: 200,
                            originalPosition: 200,
                            originalValueAbsolute: 200,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "A" }, { displayName: "sales", value: "$200" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }
                    ]
                }, {
                        key: 'series1', index: 1, displayName: 'B', identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic2.queryName, seriesIdentities[1]), measureColumnDynamic2.queryName), color: legendItems[1].color, labelSettings: data.series[1].labelSettings, data: [
                            {
                                categoryValue: 2011,
                                value: 62,
                                position: 162,
                                valueAbsolute: 62,
                                valueOriginal: 62,
                                seriesIndex: 1,
                                labelFill: undefined,
                                labelFormatString: undefined,
                                categoryIndex: 0,
                                color: hexDefaultColorRed,
                                selected: false,
                                originalValue: 62,
                                originalPosition: 162,
                                originalValueAbsolute: 62,
                                identity: selectionIds[2],
                                key: selectionIds[2].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "B" }, { displayName: "sales", value: "$62" }],
                                lastSeries: undefined,
                                chartType: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                            {
                                categoryValue: 2012,
                                value: 55,
                                position: 255,
                                valueAbsolute: 55,
                                valueOriginal: 55,
                                seriesIndex: 1,
                                labelFill: undefined,
                                labelFormatString: undefined,
                                categoryIndex: 1,
                                color: hexDefaultColorRed,
                                selected: false,
                                originalValue: 55,
                                originalPosition: 255,
                                originalValueAbsolute: 55,
                                identity: selectionIds[3],
                                key: selectionIds[3].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "B" }, { displayName: "sales", value: "$55" }],
                                lastSeries: undefined,
                                chartType: undefined,
                                labelSettings: defaultLabelSettings,
                            }
                        ]
                    }]
            );

            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: hexDefaultColorRed, label: measureColumnDynamic1.groupName, identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic1.queryName, seriesIdentities[0]), measureColumnDynamic1.queryName), selected: false },
                { icon: LegendIcon.Box, color: hexDefaultColorRed, label: measureColumnDynamic2.groupName, identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic2.queryName, seriesIdentities[1]), measureColumnDynamic2.queryName), selected: false }
            ]);
        });

        it('converter: dynamic series, formatted color + default color', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let seriesIdentities = [
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, "A"),
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, "B"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: measureColumnDynamic1,
                            values: [100, 200],
                            identity: seriesIdentities[0],
                        }, {
                            source: measureColumnDynamic2,
                            values: [62, 55],
                            identity: seriesIdentities[1],
                        }],
                        [measureColumnDynamic1RefExpr],
                        measureColumn)
                }
            };

            let groupedValues = dataView.categorical.values.grouped();
            let hexGreen = "#00FF00";
            groupedValues[1].objects = { dataPoint: { fill: { solid: { color: hexGreen } } } };
            dataView.categorical.values.grouped = () => groupedValues;

            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let hexDefaultColorRed = "#FF0000";
            let metadata: powerbi.DataViewMetadata = {
                columns: null,
                objects: { dataPoint: { defaultColor: { solid: { color: hexDefaultColorRed } } } }
            };
            let data = ColumnChart.converter(dataView, colors, undefined, undefined, metadata);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic1.queryName, seriesIdentities[0], buildSelectorForColumn(categoryColumn.queryName, categoryIdentities[0])), measureColumnDynamic1.queryName),
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic2.queryName, seriesIdentities[0], buildSelectorForColumn(categoryColumn.queryName, categoryIdentities[1])), measureColumnDynamic2.queryName),
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic1.queryName, seriesIdentities[1], buildSelectorForColumn(categoryColumn.queryName, categoryIdentities[0])), measureColumnDynamic1.queryName),
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic2.queryName, seriesIdentities[1], buildSelectorForColumn(categoryColumn.queryName, categoryIdentities[1])), measureColumnDynamic2.queryName),
            ];
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);

            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'A', identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic1.queryName, seriesIdentities[0]), measureColumnDynamic1.queryName), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                        {
                            categoryValue: 2011,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 0,
                            color: hexDefaultColorRed,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "A" }, { displayName: "sales", value: "$100" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: 2012,
                            value: 200,
                            position: 200,
                            valueAbsolute: 200,
                            valueOriginal: 200,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 1,
                            color: hexDefaultColorRed,
                            selected: false,
                            originalValue: 200,
                            originalPosition: 200,
                            originalValueAbsolute: 200,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "A" }, { displayName: "sales", value: "$200" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }
                    ]
                }, {
                        key: 'series1', index: 1, displayName: 'B', identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic2.queryName, seriesIdentities[1]), measureColumnDynamic2.queryName), color: legendItems[1].color, labelSettings: data.series[1].labelSettings, data: [
                            {
                                categoryValue: 2011,
                                value: 62,
                                position: 162,
                                valueAbsolute: 62,
                                valueOriginal: 62,
                                seriesIndex: 1,
                                labelFill: undefined,
                                labelFormatString: undefined,
                                categoryIndex: 0,
                                color: hexGreen,
                                selected: false,
                                originalValue: 62,
                                originalPosition: 162,
                                originalValueAbsolute: 62,
                                identity: selectionIds[2],
                                key: selectionIds[2].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "B" }, { displayName: "sales", value: "$62" }],
                                lastSeries: undefined,
                                chartType: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                            {
                                categoryValue: 2012,
                                value: 55,
                                position: 255,
                                valueAbsolute: 55,
                                valueOriginal: 55,
                                seriesIndex: 1,
                                labelFill: undefined,
                                labelFormatString: undefined,
                                categoryIndex: 1,
                                color: hexGreen,
                                selected: false,
                                originalValue: 55,
                                originalPosition: 255,
                                originalValueAbsolute: 55,
                                identity: selectionIds[3],
                                key: selectionIds[3].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "B" }, { displayName: "sales", value: "$55" }],
                                lastSeries: undefined,
                                chartType: undefined,
                                labelSettings: defaultLabelSettings,
                            }
                        ]
                    }]
            );

            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: hexDefaultColorRed, label: measureColumnDynamic1.groupName, identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic1.queryName, seriesIdentities[0]), measureColumnDynamic1.queryName), selected: false },
                { icon: LegendIcon.Box, color: hexGreen, label: measureColumnDynamic2.groupName, identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(measureColumnDynamic2.queryName, seriesIdentities[1]), measureColumnDynamic2.queryName), selected: false }
            ]);
        });

        it('validate highlighted tooltip', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
                mocks.dataViewScopeIdentity("2013"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012, 2013],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: [100, 200, 300],
                        highlights: [null, 50, 0],
                    }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            // We should not summarize the X-axis values with DisplayUnits per-PowerView behavior, so ensure that we are using the 'Verbose' mode for the formatter.
            spyOn(powerbi.visuals.valueFormatter, 'create').and.callThrough();
            let data = ColumnChart.converter(dataView, colors);
            
            //first tooltip is regular because highlighted value is null
            expect(data.series[0].data[0].tooltipInfo).toEqual([{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100" }]);
            expect(data.series[0].data[1].tooltipInfo).toEqual([{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100" }]);

            //tooltips with highlighted value
            expect(data.series[0].data[2].tooltipInfo).toEqual([{ displayName: "year", value: "2012" }, { displayName: "sales", value: "$200" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "$50" }]);
            expect(data.series[0].data[3].tooltipInfo).toEqual([{ displayName: "year", value: "2012" }, { displayName: "sales", value: "$200" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "$50" }]);
            
            //tooltips with highlighted value 0
            expect(data.series[0].data[4].tooltipInfo).toEqual([{ displayName: "year", value: "2013" }, { displayName: "sales", value: "$300" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "$0" }]);
            expect(data.series[0].data[5].tooltipInfo).toEqual([{ displayName: "year", value: "2013" }, { displayName: "sales", value: "$300" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "$0" }]);
        });

        it('validate tooltip info not being created when tooltips are disabled', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
                mocks.dataViewScopeIdentity("2013"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012, 2013],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: [100, 200, 300],
                        highlights: [null, 50, 0],
                    }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            // We should not summarize the X-axis values with DisplayUnits per-PowerView behavior, so ensure that we are using the 'Verbose' mode for the formatter.
            spyOn(powerbi.visuals.valueFormatter, 'create').and.callThrough();
            let data = ColumnChart.converter(dataView, colors, /*is100PercentStacked*/null, /*isScalar*/null, /*dataViewMetadata*/null, /*chartType*/null, /*interactivityService*/null, /*tooltipsEnabled*/false);
            
            //first tooltip is regular because highlighted value is null
            expect(data.series[0].data[0].tooltipInfo).toBeUndefined();
            expect(data.series[0].data[1].tooltipInfo).toBeUndefined();

            //tooltips with highlighted value
            expect(data.series[0].data[2].tooltipInfo).toBeUndefined();
            expect(data.series[0].data[3].tooltipInfo).toBeUndefined();
            
            //tooltips with highlighted value 0
            expect(data.series[0].data[4].tooltipInfo).toBeUndefined();
            expect(data.series[0].data[5].tooltipInfo).toBeUndefined();
        });

        it('validate tooltip info not being created when tooltips are disabled and tooltipBuckets are enabled', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
                mocks.dataViewScopeIdentity("2013"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012, 2013],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: [100, 200, 300],
                        highlights: [null, 50, 0],
                    }, {
                        source: tooltipsWithFormatString,
                        values: [10, -20, 30],
                    }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            // We should not summarize the X-axis values with DisplayUnits per-PowerView behavior, so ensure that we are using the 'Verbose' mode for the formatter.
            spyOn(powerbi.visuals.valueFormatter, 'create').and.callThrough();
            let data = ColumnChart.converter(dataView, colors, /*is100PercentStacked*/null, /*isScalar*/null, /*dataViewMetadata*/null, /*chartType*/null, /*interactivityService*/null, /*tooltipsEnabled*/false, /*tooltipBucketEnabled*/true);
            
            //first tooltip is regular because highlighted value is null
            expect(data.series[0].data[0].tooltipInfo).toBeUndefined();
            expect(data.series[0].data[1].tooltipInfo).toBeUndefined();

            //tooltips with highlighted value
            expect(data.series[0].data[2].tooltipInfo).toBeUndefined();
            expect(data.series[0].data[3].tooltipInfo).toBeUndefined();
            
            //tooltips with highlighted value 0
            expect(data.series[0].data[4].tooltipInfo).toBeUndefined();
            expect(data.series[0].data[5].tooltipInfo).toBeUndefined();
        });

        it('null measures legend', () => {
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012]
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: nullMeasureColumn,
                            values: [100, 200]
                        }, {
                            source: measure2Column,
                            values: [62, 55]
                        }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = ColumnChart.converter(dataView, colors);
            let legendItems = data.legendData.dataPoints;
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: legendItems[0].color, label: powerbi.visuals.valueFormatter.format(null), identity: SelectionId.createWithMeasure(nullMeasureColumn.queryName), selected: false },
                { icon: LegendIcon.Box, color: legendItems[1].color, label: dataView.categorical.values[1].source.displayName, identity: SelectionId.createWithMeasure(measure2Column.queryName), selected: false },
            ]);
        });

        it('variant measure - datetime column with a text category', () => {
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumnDate,
                        values: [new Date(2011), new Date(2012), new Date(2013), 'TheFuture']
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: nullMeasureColumn,
                            values: [100, 200, 300, 1000]
                        }
                    ])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = ColumnChart.converter(dataView, colors);
            // the text value is ignored
            expect(data.series[0].data.length).toBe(3);
        });

        it('multiple measures (100%)', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2010"),
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
                mocks.dataViewScopeIdentity("2013"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2010, 2011, 2012, 2013],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: measureColumn,
                            values: [30, -20, 100, -300]
                        }, {
                            source: measure2Column,
                            values: [90, 50, -100, -100]
                        }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = ColumnChart.converter(dataView, colors, true);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], "selectSales", categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], "selectSales", categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], "selectSales", categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[3], "selectSales", categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], "selectTax", categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], "selectTax", categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[2], "selectTax", categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[3], "selectTax", categoryColumn.queryName),
            ];
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(true);

            expect(legendItems.length).toBe(2);
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                        {
                            categoryValue: 2010,
                            value: 0.25,
                            position: 0.25,
                            valueAbsolute: 0.25,
                            valueOriginal: 30,
                            seriesIndex: 0,
                            labelFill: data.labelSettings.labelColor,
                            labelFormatString: undefined,
                            categoryIndex: 0,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 0.25,
                            originalPosition: 0.25,
                            originalValueAbsolute: 0.25,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2010" }, { displayName: "sales", value: "$30 (25%)" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }, {
                            categoryValue: 2011,
                            value: -0.2857142857142857,
                            position: 0,
                            valueAbsolute: 0.2857142857142857,
                            valueOriginal: -20,
                            seriesIndex: 0,
                            labelFill: data.labelSettings.labelColor,
                            labelFormatString: undefined,
                            categoryIndex: 1,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: -0.2857142857142857,
                            originalPosition: 0,
                            originalValueAbsolute: 0.2857142857142857,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "-$20 (28.57%)" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }, {
                            categoryValue: 2012,
                            value: 0.5,
                            position: 0.5,
                            valueAbsolute: 0.5,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            labelFill: data.labelSettings.labelColor,
                            labelFormatString: undefined,
                            categoryIndex: 2,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 0.5,
                            originalPosition: 0.5,
                            originalValueAbsolute: 0.5,
                            identity: selectionIds[2],
                            key: selectionIds[2].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "$100 (50%)" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }, {
                            categoryValue: 2013,
                            value: -0.75,
                            position: 0,
                            valueAbsolute: 0.75,
                            valueOriginal: -300,
                            seriesIndex: 0,
                            labelFill: data.labelSettings.labelColor,
                            labelFormatString: undefined,
                            categoryIndex: 3,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: -0.75,
                            originalPosition: 0,
                            originalValueAbsolute: 0.75,
                            identity: selectionIds[3],
                            key: selectionIds[3].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2013" }, { displayName: "sales", value: "-$300 (75%)" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }
                    ]
                }, {
                        key: 'series1', index: 1, displayName: 'tax', identity: SelectionId.createWithMeasure("selectTax"), color: legendItems[1].color, labelSettings: data.series[1].labelSettings, data: [
                            {
                                categoryValue: 2010,
                                value: 0.75,
                                position: 1,
                                valueAbsolute: 0.75,
                                valueOriginal: 90,
                                seriesIndex: 1,
                                labelFill: data.labelSettings.labelColor,
                                labelFormatString: undefined,
                                categoryIndex: 0,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 0.75,
                                originalPosition: 1,
                                originalValueAbsolute: 0.75,
                                identity: selectionIds[4],
                                key: selectionIds[4].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2010" }, { displayName: "tax", value: "90 (75%)" }],
                                lastSeries: undefined,
                                chartType: undefined,
                                labelSettings: defaultLabelSettings,
                            }, {
                                categoryValue: 2011,
                                value: 0.7142857142857143,
                                position: 0.7142857142857143,
                                valueAbsolute: 0.7142857142857143,
                                valueOriginal: 50,
                                seriesIndex: 1,
                                labelFill: data.labelSettings.labelColor,
                                labelFormatString: undefined,
                                categoryIndex: 1,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 0.7142857142857143,
                                originalPosition: 0.7142857142857143,
                                originalValueAbsolute: 0.7142857142857143,
                                identity: selectionIds[5],
                                key: selectionIds[5].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "tax", value: "50 (71.43%)" }],
                                lastSeries: undefined,
                                chartType: undefined,
                                labelSettings: defaultLabelSettings,
                            }, {
                                categoryValue: 2012,
                                value: -0.5,
                                position: 0,
                                valueAbsolute: 0.5,
                                valueOriginal: -100,
                                seriesIndex: 1,
                                labelFill: data.labelSettings.labelColor,
                                labelFormatString: undefined,
                                categoryIndex: 2,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: -0.5,
                                originalPosition: 0,
                                originalValueAbsolute: 0.5,
                                identity: selectionIds[6],
                                key: selectionIds[6].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "tax", value: "-100 (50%)" }],
                                lastSeries: undefined,
                                chartType: undefined,
                                labelSettings: defaultLabelSettings,
                            }, {
                                categoryValue: 2013,
                                value: -0.25,
                                position: -0.75,
                                valueAbsolute: 0.25,
                                valueOriginal: -100,
                                seriesIndex: 1,
                                labelFill: data.labelSettings.labelColor,
                                labelFormatString: undefined,
                                categoryIndex: 3,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: -0.25,
                                originalPosition: -0.75,
                                originalValueAbsolute: 0.25,
                                identity: selectionIds[7],
                                key: selectionIds[7].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2013" }, { displayName: "tax", value: "-100 (25%)" }],
                                lastSeries: undefined,
                                chartType: undefined,
                                labelSettings: defaultLabelSettings,
                            }
                        ]
                    }]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ true)).toEqual({
                min: -1,
                max: 1
            });
        });

        it('no category single measure', () => {
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: [100]
                    }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = ColumnChart.converter(dataView, colors);
            let selectionId = SelectionId.createWithMeasure(measureColumn.queryName);
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);

            expect(legendItems.length).toBe(1);
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: measureColumn.displayName, identity: SelectionId.createWithMeasure("selectSales"), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                        {
                            categoryValue: null,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 0,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionId,
                            key: selectionId.getKey(),
                            tooltipInfo: [{ displayName: "sales", value: "$100" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }
                    ]
                }]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: 0,
                max: 100
            });
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: legendItems[0].color, label: measureColumn.displayName, identity: SelectionId.createWithMeasure("selectSales"), selected: false }
            ]);
        });

        it('no category multiple measure', () => {
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: measureColumn,
                            values: [100]
                        }, {
                            source: measure2Column,
                            values: [200]
                        }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = ColumnChart.converter(dataView, colors);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithMeasure("selectSales"),
                SelectionId.createWithMeasure("selectTax"),
            ];
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);

            expect(legendItems.length).toBe(2);
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                        {
                            categoryValue: null,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 0,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "sales", value: "$100" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }
                    ]
                }, {
                        key: 'series1', index: 1, displayName: 'tax', identity: SelectionId.createWithMeasure("selectTax"), color: legendItems[1].color, labelSettings: data.series[1].labelSettings, data: [
                            {
                                categoryValue: null,
                                value: 200,
                                position: 300,
                                valueAbsolute: 200,
                                valueOriginal: 200,
                                seriesIndex: 1,
                                labelFill: undefined,
                                labelFormatString: undefined,
                                categoryIndex: 0,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 200,
                                originalPosition: 300,
                                originalValueAbsolute: 200,
                                identity: selectionIds[1],
                                key: selectionIds[1].getKey(),
                                tooltipInfo: [{ displayName: "tax", value: "200" }],
                                lastSeries: undefined,
                                chartType: undefined,
                                labelSettings: defaultLabelSettings,
                            }
                        ]
                    }]);

            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: 0,
                max: 300
            });
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: legendItems[0].color, label: measureColumn.displayName, identity: SelectionId.createWithMeasure("selectSales"), selected: false },
                { icon: LegendIcon.Box, color: legendItems[1].color, label: measure2Column.displayName, identity: SelectionId.createWithMeasure("selectTax"), selected: false }
            ]);
        });

        it('no category multiple measure with format string', () => {

            let measureColum1WithFormat = powerbi.Prototype.inherit(measureColumn);
            let measureColum2WithFormat = powerbi.Prototype.inherit(measure2Column);

            measureColum1WithFormat.format = '$0';
            measureColum2WithFormat.format = '#,0';

            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: measureColum1WithFormat,
                            values: [100]
                        }, {
                            source: measureColum2WithFormat,
                            values: [200]
                        }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = ColumnChart.converter(dataView, colors);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithMeasure("selectSales"),
                SelectionId.createWithMeasure("selectTax"),
            ];
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);

            expect(legendItems.length).toBe(2);
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                        {
                            categoryValue: null,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: '$0',
                            categoryIndex: 0,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "sales", value: "$100" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }
                    ]
                }, {
                        key: 'series1', index: 1, displayName: 'tax', identity: SelectionId.createWithMeasure("selectTax"), color: legendItems[1].color, labelSettings: data.series[1].labelSettings, data: [
                            {
                                categoryValue: null,
                                value: 200,
                                position: 300,
                                valueAbsolute: 200,
                                valueOriginal: 200,
                                seriesIndex: 1,
                                labelFill: undefined,
                                labelFormatString: '#,0',
                                categoryIndex: 0,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 200,
                                originalPosition: 300,
                                originalValueAbsolute: 200,
                                identity: selectionIds[1],
                                key: selectionIds[1].getKey(),
                                tooltipInfo: [{ displayName: "tax", value: "200" }],
                                lastSeries: undefined,
                                chartType: undefined,
                                labelSettings: defaultLabelSettings,
                            }
                        ]
                    }]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: 0,
                max: 300
            });
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: legendItems[0].color, label: measureColumn.displayName, identity: SelectionId.createWithMeasure("selectSales"), selected: false },
                { icon: LegendIcon.Box, color: legendItems[1].color, label: measure2Column.displayName, identity: SelectionId.createWithMeasure("selectTax"), selected: false }
            ]);
        });

        it('no category multiple measure + fill color', () => {
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: {
                                displayName: 'sales',
                                queryName: 'selectSales',
                                isMeasure: true,
                                type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer),
                                objects: {
                                    general: { formatString: '$0' },
                                    dataPoint: { fill: { solid: { color: 'red' } } }
                                },
                                roles: { Y: true },
                            },
                            values: [100],
                        }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = ColumnChart.converter(dataView, colors);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithMeasure("selectSales"),
            ];
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);

            expect(legendItems.length).toBe(1);
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), color: 'red', labelSettings: data.series[0].labelSettings, data: [
                        {
                            categoryValue: null,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 0,
                            color: 'red',
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "sales", value: "$100" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }
                    ]
                }]);
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: 'red', label: measureColumn.displayName, identity: SelectionId.createWithMeasure("selectSales"), selected: false },
            ]);
        });

        it('category and measure + fill color', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: {
                            displayName: 'prod',
                            queryName: 'selectProd',
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer),
                            roles: { Category: true },
                        },
                        values: ['a', 'b'],
                        objects: [undefined, { dataPoint: { fill: { solid: { color: 'red' } } } }],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: {
                            displayName: 'sales',
                            queryName: 'selectSales',
                            isMeasure: true,
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer),
                            roles: { Y: true },
                        },
                        values: [100, 150],
                    }])
                }
            };

            let data = ColumnChart.converter(dataView, powerbi.visuals.visualStyles.create().colorPalette.dataColors);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], "selectSales", 'selectProd'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], "selectSales", 'selectProd'),
            ];
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);

            expect(legendItems.length).toBe(1);
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                        {
                            categoryValue: 'a',
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 0,
                            color: '#01B8AA',
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "prod", value: "a" }, { displayName: "sales", value: "100" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }, {
                            categoryValue: 'b',
                            value: 150,
                            position: 150,
                            valueAbsolute: 150,
                            valueOriginal: 150,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 1,
                            color: 'red',
                            selected: false,
                            originalValue: 150,
                            originalPosition: 150,
                            originalValueAbsolute: 150,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                            tooltipInfo: [{ displayName: "prod", value: "b" }, { displayName: "sales", value: "150" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }
                    ]
                }]);
            expect(legendItems).toEqual([
                { icon: 0, color: '#01B8AA', label: 'sales', identity: SelectionId.createWithMeasure("selectSales"), selected: false }
            ]);
        });

        it('Gradient measure: should not become a series', () => {
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: [
                            mocks.dataViewScopeIdentity("2011"),
                            mocks.dataViewScopeIdentity("2012"),
                        ],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: Prototype.inherit(measureColumn, c => c.roles = { 'Y': true }),
                            values: [100, 200],
                        }, {
                            source: Prototype.inherit(measure2Column, c => c.roles = { 'Gradient': true }),
                            values: [75, 50],
                        }])
                }
            };

            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let data = ColumnChart.converter(dataView, colors);

            expect(data.legendData.dataPoints.length).toBe(1);
            expect(data.series.length).toBe(1);
            expect(data.series[0].data.length).toBe(2);
            expect(data.series[0].data.map(pruneColunnChartDataPoint)).toEqual([
                {
                    categoryValue: 2011,
                    value: 100,
                }, {
                    categoryValue: 2012,
                    value: 200,
                }
            ]);
        });

        it('Gradient color - validate tool tip', () => {
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: [
                            mocks.dataViewScopeIdentity("2011"),
                            mocks.dataViewScopeIdentity("2012"),
                        ],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: Prototype.inherit(measureColumn, c => c.roles = { 'Y': true }),
                            values: [100, 200],
                        }, {
                            source: Prototype.inherit(measure2Column, c => c.roles = { 'Gradient': true }),
                            values: [75, 50],
                        }, {
                            source: Prototype.inherit(tooltipsWithFormatString, c => c.roles = { 'Tooltips': true }),
                            values: [10, -20],
                        }])
                }
            };

            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let data = ColumnChart.converter(dataView, colors, false, false, null, null, null, /* tooltipsEnabled */true, /* tooltipBucketEnabled */true);

            expect(data.series[0].data[0].tooltipInfo).toEqual([{ displayName: 'year', value: '2011' }, { displayName: 'sales', value: '$100' }, { displayName: 'tax', value: '75' }, { displayName: 'tooltips', value: '$10' }]);
            expect(data.series[0].data[1].tooltipInfo).toEqual([{ displayName: 'year', value: '2012' }, { displayName: 'sales', value: '$200' }, { displayName: 'tax', value: '50' }, { displayName: 'tooltips', value: '-$20' }]);
        });

        it('Gradient and Y have the index - validate tool tip', () => {
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: [
                            mocks.dataViewScopeIdentity("2011"),
                            mocks.dataViewScopeIdentity("2012"),
                        ],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: Prototype.inherit(measureColumn, c => c.roles = { 'Y': true, 'Gradient': true}),
                            values: [100, 200],
                        }, {
                            source: Prototype.inherit(tooltipsWithFormatString, c => c.roles = { 'Tooltips': true }),
                            values: [null, Infinity],
                        }])
                }
            };

            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let data = ColumnChart.converter(dataView, colors, /*is100PercentStacked*/ false, /*isScalar*/ false, /*dataViewMetadata*/null, /*chartType*/null, /*interactivityService*/null, /* tooltipsEnabled */true, /* tooltipBucketEnabled */true);

            expect(data.series[0].data[0].tooltipInfo).toEqual([{ displayName: 'year', value: '2011' }, { displayName: 'sales', value: '$100' }]);
            expect(data.series[0].data[1].tooltipInfo).toEqual([{ displayName: 'year', value: '2012' }, { displayName: 'sales', value: '$200' }, { displayName: 'tooltips', value: '+Infinity' }]);
        });

        it('single measure with infinite value', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: [100, Number.POSITIVE_INFINITY]
                    }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = ColumnChart.converter(dataView, colors);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], measureColumn.queryName, categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], measureColumn.queryName, categoryColumn.queryName)
            ];
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);

            expect(legendItems.length).toBe(1);
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: measureColumn.displayName, identity: SelectionId.createWithMeasure("selectSales"), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                        {
                            categoryValue: 2011,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 0,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: 2012,
                            value: Number.MAX_VALUE,
                            position: Number.MAX_VALUE,
                            valueAbsolute: Number.MAX_VALUE,
                            valueOriginal: Number.MAX_VALUE,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 1,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: Number.MAX_VALUE,
                            originalPosition: Number.MAX_VALUE,
                            originalValueAbsolute: Number.MAX_VALUE,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "$Infinity" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }
                    ]
                }]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: 0,
                max: Number.MAX_VALUE
            });
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: legendItems[0].color, label: measureColumn.displayName, identity: SelectionId.createWithMeasure("selectSales"), selected: false }
            ]);
        });

        it('single measure with negative infinite value', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: [100, Number.NEGATIVE_INFINITY]
                    }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = ColumnChart.converter(dataView, colors);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], measureColumn.queryName, categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], measureColumn.queryName, categoryColumn.queryName)
            ];
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);
            let legendItems = data.legendData.dataPoints;

            expect(legendItems.length).toBe(1);
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: measureColumn.displayName, identity: SelectionId.createWithMeasure("selectSales"), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                        {
                            categoryValue: 2011,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 0,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: 2012,
                            value: -Number.MAX_VALUE,
                            position: 0,
                            valueAbsolute: Number.MAX_VALUE,
                            valueOriginal: -Number.MAX_VALUE,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 1,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: -Number.MAX_VALUE,
                            originalPosition: 0,
                            originalValueAbsolute: Number.MAX_VALUE,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "-$Infinity" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }
                    ]
                }]);

            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: -Number.MAX_VALUE,
                max: 100
            });
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: legendItems[0].color, label: measureColumn.displayName, identity: SelectionId.createWithMeasure("selectSales"), selected: false }
            ]);
        });

        it('single measure with NaN value', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: [0, Number.NaN]
                    }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let data = ColumnChart.converter(dataView, colors);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], measureColumn.queryName, categoryColumn.queryName),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], measureColumn.queryName, categoryColumn.queryName)
            ];
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);

            expect(legendItems.length).toBe(1);
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: measureColumn.displayName, identity: SelectionId.createWithMeasure("selectSales"), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                        {
                            categoryValue: 2011,
                            value: 0,
                            position: 0,
                            valueAbsolute: 0,
                            valueOriginal: 0,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 0,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 0,
                            originalPosition: 0,
                            originalValueAbsolute: 0,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$0" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                        {
                            categoryValue: 2012,
                            value: null,
                            position: 0,
                            valueAbsolute: 0,
                            valueOriginal: null,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 1,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: null,
                            originalPosition: 0,
                            originalValueAbsolute: 0,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2012" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }
                    ]
                }]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: 0,
                max: 0
            });
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: legendItems[0].color, label: measureColumn.displayName, identity: SelectionId.createWithMeasure("selectSales"), selected: false }
            ]);
        });

        it('Tooltip info formatString with measure that has no object', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let dataView: powerbi.DataView = {
                metadata: null,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2011, 2012],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureWithFormatString,
                        values: [100, 200]
                    }])
                }
            };
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            // We should not summarize the X-axis values with DisplayUnits per-PowerView behavior, so ensure that we are using the 'Verbose' mode for the formatter.
            spyOn(powerbi.visuals.valueFormatter, 'create').and.callThrough();
            let data = ColumnChart.converter(dataView, colors);

            expect(data.series[0].data[0].tooltipInfo).toEqual([{ displayName: "year", value: "2011" }, { displayName: "tax", value: "$100" }]);
            expect(data.series[0].data[1].tooltipInfo).toEqual([{ displayName: "year", value: "2012" }, { displayName: "tax", value: "$200" }]);
        });

        it('dataView that should pivot categories', () => {
            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: '', index: 0 },
                    { displayName: '', isMeasure: true, index: 1 },
                ]
            };
            let seriesIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
            ];
            let categoryColRefExpr = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'category' });
            let dataView: powerbi.DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['a', 'b'],
                        identity: seriesIdentities,
                        identityFields: [categoryColRefExpr],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[1],
                            values: [100, 200]
                        }])
                }
            };
            dataView = DataViewTransform.apply({
                prototype: dataView,
                objectDescriptors: powerbi.visuals.plugins.columnChart.capabilities.objects,
                dataViewMappings: powerbi.visuals.plugins.columnChart.capabilities.dataViewMappings,
                transforms: {
                    selects: [
                        { displayName: 'col1', queryName: 'select1', roles: { 'Series': true } },
                        { displayName: 'col2', queryName: 'select2', roles: { 'Y': true } },
                    ]
                },
                colorAllocatorFactory: powerbi.visuals.createColorAllocatorFactory(),
                dataRoles: powerbi.visuals.plugins.columnChart.capabilities.dataRoles,
            })[0];

            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let data = ColumnChart.converter(dataView, colors);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn('select1', seriesIdentities[0]), 'select2'),
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn('select1', seriesIdentities[1]), 'select2'),
            ];
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);

            expect(legendItems.length).toBe(2);
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'a', identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn('select1', seriesIdentities[0]), 'select2'), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                        {
                            categoryValue: null,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 0,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "100" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }
                    ]
                }, {
                        key: 'series1', index: 1, displayName: 'b', identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn('select1', seriesIdentities[1]), 'select2'), color: legendItems[1].color, labelSettings: data.series[1].labelSettings, data: [
                            {
                                categoryValue: null,
                                value: 200,
                                position: 300,
                                valueAbsolute: 200,
                                valueOriginal: 200,
                                seriesIndex: 1,
                                labelFill: undefined,
                                labelFormatString: undefined,
                                categoryIndex: 0,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 200,
                                originalPosition: 300,
                                originalValueAbsolute: 200,
                                identity: selectionIds[1],
                                key: selectionIds[1].getKey(),
                                tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "200" }],
                                lastSeries: undefined,
                                chartType: undefined,
                                labelSettings: defaultLabelSettings,
                            }
                        ]
                    }]);
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: legendItems[0].color, label: 'a', identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn('select1', seriesIdentities[0]), 'select2'), selected: false },
                { icon: LegendIcon.Box, color: legendItems[1].color, label: 'b', identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn('select1', seriesIdentities[1]), 'select2'), selected: false }
            ]);
        });

        it('dataView with Series & Category role that should pivot categories', () => {
            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1', queryName: 'selectCol1', roles: { "Series": true, "Category": true } },
                    { displayName: 'col2', queryName: 'selectCol2', roles: { "Y": true } },
                ]
            };

            let categoryIdentities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
            ];
            let categoryColRefExpr = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });
            let dataView: powerbi.DataView = DataViewSelfCrossJoin.apply({
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['a', 'b'],
                        identity: categoryIdentities,
                        identityFields: [categoryColRefExpr],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[1],
                            values: [100, 200],
                        }])
                }
            });

            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let series1Color = colors.getColorScaleByKey(SQExprShortSerializer.serialize(categoryColRefExpr)).getColor('a').value;
            let series2Color = colors.getColorScaleByKey(SQExprShortSerializer.serialize(categoryColRefExpr)).getColor('b').value;

            let data = ColumnChart.converter(dataView, colors, undefined, undefined, metadata);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'selectCol2', 'selectCol1'),
                SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'selectCol2', 'selectCol1'),
            ];
            let legendItems = data.legendData.dataPoints;
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);

            expect(legendItems.length).toBe(2);
            expect(legendItems.map(l => l.label)).toEqual(['a', 'b']);

            // Should get a result shaped like a diagonal matrix
            let item =
                [{
                    key: 'series0', index: 0, displayName: 'a', identity: SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], 'selectCol2', 'selectCol1'), color: legendItems[0].color, labelSettings: data.series[0].labelSettings, data: [
                        {
                            categoryValue: 'a',
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 0,
                            color: series1Color,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "100" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }, {
                            categoryValue: 'b',
                            value: null,
                            position: 0,
                            valueAbsolute: 0,
                            valueOriginal: null,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            categoryIndex: 1,
                            color: '#01B8AA',
                            selected: false,
                            originalValue: null,
                            originalPosition: 0,
                            originalValueAbsolute: 0,
                            identity: jasmine.any(Object),
                            key: jasmine.any(String),
                            tooltipInfo: [{ displayName: "col1", value: "b" }],
                            lastSeries: undefined,
                            chartType: undefined,
                            labelSettings: defaultLabelSettings,
                        }
                    ]
                }, {
                        key: 'series1', index: 1, displayName: 'b', identity: SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], 'selectCol2', 'selectCol1'), color: legendItems[1].color, labelSettings: data.series[1].labelSettings, data: [
                            {
                                categoryValue: 'b',
                                value: 200,
                                position: 200,
                                valueAbsolute: 200,
                                valueOriginal: 200,
                                seriesIndex: 1,
                                labelFill: undefined,
                                labelFormatString: undefined,
                                categoryIndex: 1,
                                color: series2Color,
                                selected: false,
                                originalValue: 200,
                                originalPosition: 200,
                                originalValueAbsolute: 200,
                                identity: selectionIds[1],
                                key: selectionIds[1].getKey(),
                                tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: 'col2', value: '200' }],
                                lastSeries: undefined,
                                chartType: undefined,
                                labelSettings: defaultLabelSettings,
                            }
                        ]
                    }];
            expect(data.series).toEqual(item);
        });

        it('100% stacked -- rounding (-1)', () => {
            let selectionIds: SelectionId[] = [
                SelectionId.createWithMeasure("measure0"),
                SelectionId.createWithMeasure("measure1"),
            ];
            let data: powerbi.visuals.ColumnChartSeries[] =
                [{
                    key: '1', index: 0, displayName: 'measure0', identity: SelectionId.createNull(), color: 'red', labelSettings: null, data: [
                        {
                            categoryValue: 0,
                            value: -0.75,
                            position: 0,
                            valueAbsolute: 0.75,
                            valueOriginal: -0.75,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            color: 'red',
                            selected: false,
                            originalValue: -0.75,
                            originalPosition: 0,
                            originalValueAbsolute: 0.75,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            chartType: powerbi.visuals.ColumnChartType.hundredPercentStackedColumn,
                            labelSettings: null,
                        }
                    ]
                },
                    {
                        key: '2', index: 1, displayName: 'measure1', identity: SelectionId.createNull(), color: 'blue', labelSettings: null, data: [
                            {
                                categoryValue: 0,
                                value: -0.25000001,
                                position: -0.75,
                                valueAbsolute: 0.25000001,
                                valueOriginal: -0.25000001,
                                categoryIndex: 0,
                                seriesIndex: 1,
                                labelFill: undefined,
                                labelFormatString: undefined,
                                color: 'blue',
                                selected: false,
                                originalValue: -0.25000001,
                                originalPosition: -0.75,
                                originalValueAbsolute: 0.25000001,
                                identity: selectionIds[1],
                                key: selectionIds[1].getKey(),
                                chartType: powerbi.visuals.ColumnChartType.hundredPercentStackedColumn,
                                labelSettings: null,
                            }
                        ]
                    }];
            expect(StackedUtil.calcValueDomain(data, /*is100Pct*/ true)).toEqual({
                min: -1,
                max: 0
            });
        });

        it('100% stacked -- rounding (+1)', () => {
            let selectionIds: SelectionId[] = [
                SelectionId.createWithMeasure("measure0"),
                SelectionId.createWithMeasure("measure1"),
            ];
            let data: powerbi.visuals.ColumnChartSeries[] =
                [{
                    key: '1', index: 0, displayName: 'measure0', identity: SelectionId.createNull(), color: 'red', labelSettings: null, data: [
                        {
                            categoryValue: 0,
                            value: 0.25,
                            position: 0.25,
                            valueAbsolute: 0.25,
                            valueOriginal: 0.25,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            labelFill: undefined,
                            labelFormatString: undefined,
                            color: 'red',
                            selected: false,
                            originalValue: 0.25,
                            originalPosition: 0.25,
                            originalValueAbsolute: 0.25,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            chartType: powerbi.visuals.ColumnChartType.hundredPercentStackedBar,
                            labelSettings: null,
                        }
                    ]
                },
                    {
                        key: '2', index: 1, displayName: 'measure1', identity: SelectionId.createNull(), color: 'blue', labelSettings: null, data: [
                            {
                                categoryValue: 0,
                                value: 0.7500001,
                                position: 1.000001,
                                valueAbsolute: 0.75000001,
                                valueOriginal: 0.7500001,
                                categoryIndex: 0,
                                seriesIndex: 1,
                                labelFill: undefined,
                                labelFormatString: undefined,
                                color: 'blue',
                                selected: false,
                                originalValue: 0.7500001,
                                originalPosition: 1.000001,
                                originalValueAbsolute: 0.75000001,
                                identity: selectionIds[1],
                                key: selectionIds[1].getKey(),
                                chartType: powerbi.visuals.ColumnChartType.hundredPercentStackedBar,
                                labelSettings: null,
                            }
                        ]
                    }];
            expect(StackedUtil.calcValueDomain(data, /*is100Pct*/ true)).toEqual({
                min: 0,
                max: 1
            });
        });

        it('100% stacked -- rounding (+1 and -1)', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            let selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], "measure0"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], "measure1"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[1], "measure0"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[1], "measure1"),
            ];
            let data: powerbi.visuals.ColumnChartSeries[] =
                [{
                    key: '1', index: 0, displayName: 'measure0', identity: SelectionId.createNull(), color: 'red', labelSettings: null, data: [
                        {
                            categoryValue: 0,
                            value: -0.75,
                            position: 0,
                            valueAbsolute: 0.75,
                            valueOriginal: -0.75,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            color: 'red',
                            selected: false,
                            originalValue: -0.75,
                            originalPosition: 0,
                            originalValueAbsolute: 0.75,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            chartType: powerbi.visuals.ColumnChartType.hundredPercentStackedBar,
                            labelSettings: null,
                        },
                        {
                            categoryValue: 1,
                            value: 0.25,
                            position: 0.25,
                            valueAbsolute: 0.25,
                            valueOriginal: 0.25,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            color: 'red',
                            selected: false,
                            originalValue: 0.25,
                            originalPosition: 0.25,
                            originalValueAbsolute: 0.25,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                            chartType: powerbi.visuals.ColumnChartType.hundredPercentStackedBar,
                            labelSettings: null,
                        }
                    ]
                },
                    {
                        key: '2', index: 1, displayName: 'measure1', identity: SelectionId.createNull(), color: 'blue', labelSettings: null, data: [
                            {
                                categoryValue: 0,
                                value: -0.25000001,
                                position: -0.75,
                                valueAbsolute: 0.25000001,
                                valueOriginal: -0.25000001,
                                categoryIndex: 0,
                                seriesIndex: 1,
                                labelFill: undefined,
                                labelFormatString: undefined,
                                color: 'blue',
                                selected: false,
                                originalValue: -0.25000001,
                                originalPosition: -0.75,
                                originalValueAbsolute: 0.25000001,
                                identity: selectionIds[2],
                                key: selectionIds[2].getKey(),
                                chartType: powerbi.visuals.ColumnChartType.hundredPercentStackedBar,
                                labelSettings: null,
                            },
                            {
                                categoryValue: 1,
                                value: 0.7500001,
                                position: 1.000001,
                                valueAbsolute: 0.75000001,
                                valueOriginal: 0.7500001,
                                categoryIndex: 1,
                                seriesIndex: 1,
                                labelFill: undefined,
                                labelFormatString: undefined,
                                color: 'blue',
                                selected: false,
                                originalValue: 0.7500001,
                                originalPosition: 1.000001,
                                originalValueAbsolute: 0.75000001,
                                identity: selectionIds[3],
                                key: selectionIds[3].getKey(),
                                chartType: powerbi.visuals.ColumnChartType.hundredPercentStackedBar,
                                labelSettings: null,
                            }
                        ]
                    }];
            expect(StackedUtil.calcValueDomain(data, /*is100Pct*/ true)).toEqual({
                min: -1,
                max: 1
            });
        });

        let categoricalData: powerbi.visuals.ColumnChartData = {
            categories: [],
            categoryFormatter: null,
            series: [],
            valuesMetadata: [],
            legendData: { dataPoints: [] },
            hasHighlights: false,
            categoryMetadata: null,
            scalarCategoryAxis: false,
            labelSettings: null,
            axesLabels: { x: null, y: null },
            hasDynamicSeries: false,
            isMultiMeasure: false,
        };

        let metadataColumnText: powerbi.DataViewMetadataColumn = {
            displayName: 'NumberCol',
            type: ValueType.fromDescriptor({ text: true })
        };

        let scalarData: powerbi.visuals.ColumnChartData = {
            categories: [1, 2, 3], //just needs to be more than 1 entry to get past a guard in getCategoryThickness
            categoryFormatter: null,
            series: [{ key: '1', index: 0, displayName: '1', identity: SelectionId.createNull(), data: [], labelSettings: null, color: '#01B8AA' }],
            valuesMetadata: [],
            legendData: { dataPoints: [] },
            hasHighlights: false,
            categoryMetadata: null,
            scalarCategoryAxis: true,
            labelSettings: null,
            axesLabels: { x: null, y: null },
            hasDynamicSeries: false,
            isMultiMeasure: false,
        };

        let metadataColumnNumber: powerbi.DataViewMetadataColumn = {
            displayName: 'NumberCol',
            type: ValueType.fromDescriptor({ numeric: true })
        };

        let metadataColumnTime: powerbi.DataViewMetadataColumn = {
            displayName: 'DateCol',
            type: ValueType.fromDescriptor({ dateTime: true })
        };

        it('getLayout: no category metadata', () => {
            expect(CartesianChart.getLayout(
                categoricalData,
                {
                    trimOrdinalDataOnOverflow: true,
                    availableWidth: 114,
                    categoryCount: 1,
                    domain: []
                })).toEqual({
                    categoryCount: 1,
                    categoryThickness: 30,
                    outerPaddingRatio: 1.4,
                    isScalar: false
                });
        });

        it('getLayout: text (one)', () => {
            categoricalData.categories = ['A'];
            categoricalData.categoryMetadata = metadataColumnText;
            expect(CartesianChart.getLayout(
                categoricalData,
                {
                    trimOrdinalDataOnOverflow: true,
                    availableWidth: 114,
                    categoryCount: 1,
                    domain: []
                })).toEqual({
                    categoryCount: 1,
                    categoryThickness: 30,
                    outerPaddingRatio: 1.4,
                    isScalar: false
                });
        });

        it('getLayout: text (few)', () => {
            categoricalData.categories = ['A', 'B', 'C', 'D', 'E', 'F'];
            categoricalData.categoryMetadata = metadataColumnText;
            expect(CartesianChart.getLayout(
                categoricalData,
                {
                    trimOrdinalDataOnOverflow: true,
                    availableWidth: 204,
                    categoryCount: 6,
                    domain: []
                })).toEqual({
                    categoryCount: 6,
                    categoryThickness: 30,
                    outerPaddingRatio: 0.4,
                    isScalar: false
                });
        });

        it('getLayout: text (too many)', () => {
            let cats = [];
            for (let i = 0, len = 200; i < len; i++) {
                cats.push(Math.round(Math.random()).toString());
            }
            categoricalData.categories = cats;
            categoricalData.categoryMetadata = metadataColumnText;
            expect(CartesianChart.getLayout(
                categoricalData,
                {
                    trimOrdinalDataOnOverflow: true,
                    availableWidth: 220,
                    categoryCount: 200,
                    domain: []
                })).toEqual({
                    categoryCount: 10,
                    categoryThickness: 20,
                    outerPaddingRatio: 0.5,
                    isScalar: false
                });
        });

        it('getLayout: text (too many - not trimmed)', () => {
            let cats = [];
            for (let i = 0, len = 200; i < len; i++) {
                cats.push(Math.round(Math.random()).toString());
            }
            categoricalData.categories = cats;
            categoricalData.categoryMetadata = metadataColumnText;
            let layout = CartesianChart.getLayout(
                categoricalData,
                {
                    trimOrdinalDataOnOverflow: false,
                    availableWidth: 220,
                    categoryCount: 200,
                    domain: []
                });
            expect(layout.categoryCount).toEqual(200);
        });

        it('getLayout: number (few)', () => {
            let series: powerbi.visuals.ColumnChartDataPoint[] = [];
            for (let i = 0, len = 10; i < len; i++) {
                let identity: powerbi.visuals.SelectionId = SelectionId.createWithId(mocks.dataViewScopeIdentity("" + i));
                let dataPoint: powerbi.visuals.ColumnChartDataPoint = {
                    
                    // use pow to create x values that get farther apart (testing minInterval)
                    categoryValue: i * 10 + Math.pow(i * 10, 1.8),
                    value: i % 5,
                    position: 0,
                    valueAbsolute: i % 5,
                    valueOriginal: i % 5,
                    seriesIndex: 0,
                    labelFill: undefined,
                    categoryIndex: i,
                    color: '#01B8AA',
                    selected: false,
                    originalValue: i % 5,
                    originalPosition: 0,
                    originalValueAbsolute: i % 5,
                    identity: identity,
                    key: identity.getKey(),
                    chartType: powerbi.visuals.ColumnChartType.stackedColumn,
                    labelSettings: null,
                };
                series.push(dataPoint);
            }
            scalarData.series[0].data = series;
            scalarData.categoryMetadata = metadataColumnNumber;
            expect(CartesianChart.getLayout(
                scalarData,
                {
                    trimOrdinalDataOnOverflow: true,
                    availableWidth: 100,
                    categoryCount: 10,
                    domain: [0, 6400],
                    isScalar: true
                })).toEqual({
                    categoryCount: 10,
                    categoryThickness: 2,
                    outerPaddingRatio: 0.4,
                    isScalar: true
                });
        });

        it('getLayout: number (many)', () => {
            let series: powerbi.visuals.ColumnChartDataPoint[] = [];
            for (let i = 0, len = 100; i < len; i++) {
                let identity: powerbi.visuals.SelectionId = SelectionId.createWithId(mocks.dataViewScopeIdentity("" + i));
                let dataPoint: powerbi.visuals.ColumnChartDataPoint = {
                    categoryValue: i + Math.pow(i, 1.8),
                    value: i % 5,
                    position: 0,
                    valueAbsolute: i % 5,
                    valueOriginal: i % 5,
                    seriesIndex: 0,
                    labelFill: undefined,
                    categoryIndex: i,
                    color: '#01B8AA',
                    selected: false,
                    originalValue: i % 5,
                    originalPosition: 0,
                    originalValueAbsolute: i % 5,
                    identity: identity,
                    key: identity.getKey(),
                    chartType: powerbi.visuals.ColumnChartType.stackedColumn,
                    labelSettings: null,
                };
                series.push(dataPoint);
            }
            scalarData.series[0].data = series;
            scalarData.categoryMetadata = metadataColumnNumber;
            expect(CartesianChart.getLayout(
                scalarData,
                {
                    trimOrdinalDataOnOverflow: true,
                    availableWidth: 100,
                    categoryCount: 100,
                    domain: [0, 4000],
                    isScalar: true
                })).toEqual({
                    categoryCount: 49,
                    categoryThickness: 2,
                    outerPaddingRatio: 0.4,
                    isScalar: true
                });
        });

        it('getLayout: datetime', () => {
            let series: powerbi.visuals.ColumnChartDataPoint[] = [];
            for (let i = 0, len = 25; i < len; i++) {
                let identity: powerbi.visuals.SelectionId = SelectionId.createWithId(mocks.dataViewScopeIdentity("" + i));
                let dataPoint: powerbi.visuals.ColumnChartDataPoint = {
                    // use fractional pow to create x values that get closer together (testing minInterval)
                    categoryValue: new Date(2000, 1, 1).getTime() + Math.pow(i, 0.66) * 86000000,
                    value: i % 5,
                    position: 0,
                    valueAbsolute: i % 5,
                    valueOriginal: i % 5,
                    seriesIndex: 0,
                    labelFill: undefined,
                    categoryIndex: i,
                    color: '#01B8AA',
                    selected: false,
                    originalValue: i % 5,
                    originalPosition: 0,
                    originalValueAbsolute: i % 5,
                    identity: identity,
                    key: identity.getKey(),
                    chartType: powerbi.visuals.ColumnChartType.stackedColumn,
                    labelSettings: null,
                };
                series.push(dataPoint);
            }
            scalarData.series[0].data = series;
            scalarData.categoryMetadata = metadataColumnTime;
            let layout = CartesianChart.getLayout(
                scalarData,
                {
                    trimOrdinalDataOnOverflow: true,
                    availableWidth: 100,
                    categoryCount: 25,
                    domain: [series[0].categoryValue, series[series.length - 1].categoryValue],
                    isScalar: true
                });
            expect(layout.categoryCount).toEqual(25);
            expect(layout.categoryThickness).toBeCloseTo(2.7, 1);
            expect(layout.isScalar).toBeTruthy();
        });

        it('getLayout: datetime with highlights', () => {
            let series: powerbi.visuals.ColumnChartDataPoint[] = [];
            let idx = 0;
            for (let i = 0, len = 10; i < len; i++) {
                let identity: powerbi.visuals.SelectionId = SelectionId.createWithId(mocks.dataViewScopeIdentity("" + i));
                idx = Math.floor(i / 2);
                let dataPoint: powerbi.visuals.ColumnChartDataPoint = {
                    // use fractional pow to create x values that get closer together (testing minInterval)
                    categoryValue: new Date(2000, 1, 1).getTime() + Math.pow(idx, 0.66) * 86000000,
                    value: i % 5,
                    position: 0,
                    valueAbsolute: i % 5,
                    valueOriginal: i % 5,
                    seriesIndex: 0,
                    labelFill: undefined,
                    categoryIndex: idx,
                    color: '#01B8AA',
                    selected: false,
                    originalValue: i % 5,
                    originalPosition: 0,
                    originalValueAbsolute: i % 5,
                    identity: identity,
                    key: identity.getKey(),
                    chartType: powerbi.visuals.ColumnChartType.stackedColumn,
                    labelSettings: null,
                };
                if (i % 2 !== 0) {
                    dataPoint.highlight = true;
                }
                series.push(dataPoint);
            }
            scalarData.series[0].data = series;
            scalarData.categoryMetadata = metadataColumnTime;
            let layout = CartesianChart.getLayout(
                scalarData,
                {
                    trimOrdinalDataOnOverflow: true,
                    availableWidth: 400,
                    categoryCount: idx + 1,
                    domain: [series[0].categoryValue, series[series.length - 1].categoryValue],
                    isScalar: true
                });
            expect(layout.categoryCount).toEqual(idx + 1);
            expect(layout.categoryThickness).toBeCloseTo(61, 0);
            expect(layout.isScalar).toBeTruthy();
        });
    });

    function clusterColumnChartDomValidation(interactiveChart: boolean, scalarSetting: boolean) {
        let v: powerbi.IVisual, element: JQuery;

        let dataViewMetadataTwoColumn: powerbi.DataViewMetadataColumn[] = [
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
            }
        ];
        let dataViewMetadataThreeColumn: powerbi.DataViewMetadataColumn[] = [
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
            }
        ];
        let dataViewMetadataScalarDateTime: powerbi.DataViewMetadataColumn[] = [
            {
                displayName: 'col1',
                queryName: 'col1',
                type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime),
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
            }
        ];

        function metadata(columns): powerbi.DataViewMetadata {
            let categoryAxisObject: powerbi.DataViewObject = scalarSetting
                ? { axisType: 'Scalar' }
                : { axisType: 'Categorical' };

            let metadata: powerbi.DataViewMetadata = {
                columns: columns,
                objects: { categoryAxis: categoryAxisObject }
            };

            return metadata;
        }

        let hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {

            element = powerbitests.helpers.testDom('500', '500');
            v = new ColumnChartVisualBuilder(ColumnChartType.clusteredColumn).build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: interactiveChart },
                animation: { transitionImmediate: true },
            });
        });

        it('clustered column chart dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [0, 234]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, null]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(2);
                expect($('.label').length).toBe(0);
                if (interactiveChart) {
                    expect(ColumnChart.getInteractiveColumnChartDomElement(element)).toBeDefined();
                }
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart dom validation - datetime', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("1999/3/1"),
                mocks.dataViewScopeIdentity("1999/6/20"),
                mocks.dataViewScopeIdentity("2003/6/1"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataScalarDateTime),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataScalarDateTime[0],
                            values: [new Date(1999, 3, 1), new Date(1999, 6, 20), new Date(2003, 6, 1)],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataScalarDateTime[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234, 32]
                            }, {
                                source: dataViewMetadataScalarDateTime[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88, 44]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(6);
                let x = +$('.column')[1].attributes.getNamedItem('x').value;
                let width = +$('.column')[1].attributes.getNamedItem('width').value;
                if (scalarSetting) {
                    expect(powerbitests.helpers.isInRange(x, 31, 33)).toBe(true);
                    expect(powerbitests.helpers.isInRange(width, 11, 15)).toBe(true);
                }
                else {
                    // 179.(6) in Mac OS and 178.8 in Windows
                    expect(powerbitests.helpers.isInRange(x, 180, 185)).toBe(true);
                    
                    // 48.6 in Mac OS and 48 in Windows
                    expect(powerbitests.helpers.isInRange(width, 48, 51)).toBe(true);
                }
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart dom validation - null datetime', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("1999/3/1"),
                mocks.dataViewScopeIdentity(null),
                mocks.dataViewScopeIdentity("2003/6/1"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataScalarDateTime),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataScalarDateTime[0],
                            values: [new Date(1999, 3, 1), null, new Date(2003, 6, 1)],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataScalarDateTime[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234, 32]
                            }, {
                                source: dataViewMetadataScalarDateTime[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88, 44]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                let x = +$('.column')[1].attributes.getNamedItem('x').value;
                let width = +$('.column')[1].attributes.getNamedItem('width').value;
                if (scalarSetting) {
                    expect($('.column').length).toBe(4);
                    expect(powerbitests.helpers.isInRange(x, 371, 375)).toBe(true);
                    expect(powerbitests.helpers.isInRange(width, 48, 51)).toBe(true);
                }
                else {
                    expect($('.column').length).toBe(6);
                    
                    // 179.(6) in Mac OS and 178.8 in Windows
                    expect(powerbitests.helpers.isInRange(x, 180, 185)).toBe(true);
                    
                    // 48.6 in Mac OS and 48 in Windows
                    expect(powerbitests.helpers.isInRange(width, 48, 51)).toBe(true);
                }
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart partial highlight dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [54, 204]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [6, 66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('height').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('y').value)
                    .toBeGreaterThan(+$('.column')[0].attributes.getNamedItem('y').value);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart negative partial highlight dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [-123, -234],
                                highlights: [-54, -204]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [-12, -88],
                                highlights: [-6, -66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('height').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('y').value)
                    .toEqual(+$('.column')[0].attributes.getNamedItem('y').value);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart partial highlights with overflow dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [157, 260]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [18, 102]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeGreaterThan(+$('.column')[0].attributes.getNamedItem('height').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('y').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('y').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('width').value);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart partial highlights with positive/negative mix dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [-54, -204]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [-6, -66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('height').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('y').value)
                    .toBeGreaterThan(+$('.column')[0].attributes.getNamedItem('y').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('width').value);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart missing measure in first series to not be dropped in dom', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [null, 123]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 23]
                            }])
                    }
                }]
            });

            let ticksText: JQuery = helpers.getAxisTicks('x').find('text');

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(3);
                expect(helpers.findElementText($(ticksText).last())).toBe('def');
                expect(helpers.findElementTitle($(ticksText).last())).toBe('def');
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart missing measure dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, null]
                            }])
                    }
                }]
            });

            let ticksText: JQuery = helpers.getAxisTicks('x').find('text');

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(3);
                expect(helpers.findElementText(ticksText.last())).toBe('def');
                expect(helpers.findElementTitle(ticksText.last())).toBe('def');
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart with near zero measures dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                values: [0.0001, 234]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                values: [12, -0.0001]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(4);
                let smallPositiveRectYValue = $('.column')[0].attributes.getNamedItem('y').value;
                let smallNegativeRectYValue = $('.column')[3].attributes.getNamedItem('y').value;
                expect(smallPositiveRectYValue).not.toEqual(smallNegativeRectYValue);
                done();
            }, DefaultWaitForRender);
        });

        it('empty clustered column chart dom validation', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataTwoColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn[0],
                            values: []
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn[1],
                            values: []
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect(helpers.getAxisTicks('x').length).toBe(0);
                expect(helpers.getAxisTicks('y').length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart with small interval dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataTwoColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            let ticksText: JQuery = helpers.getAxisTicks('y').find('text');

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect(helpers.getAxisTicks('x').length).toBeGreaterThan(0);
                expect(helpers.getAxisTicks('y').length).toBeGreaterThan(0);
                expect(helpers.findElementText(ticksText.last())).toBe('2.5');
                expect(helpers.findElementTitle(ticksText.last())).toBe('2.5');
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart should be cleared when empty dataview is applied', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataTwoColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.column').length).toBeGreaterThan(0);

                v.onDataChanged({
                    dataViews: [{
                        metadata: metadata(dataViewMetadataTwoColumn),
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.column').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('clustered column chart with no animator should filter 0/null columns', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: categoryValues,
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                values: [10, 0, 30, null, 0]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                values: [0, 20, null, 88, 10]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(5);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart zero line axis is darkened', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: categoryValues,
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                values: [10, 0, -30, null, 0]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                values: [0, -20, null, 88, 10]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                let zeroTicks = $('g.tick:has(line.zero-line)');

                expect(zeroTicks.length).toBe(2);
                zeroTicks.each(function (i, item) {
                    expect(d3.select(item).datum() === 0).toBe(true);
                });

                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart reference line dom validation', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));

            let refLineColor1 = '#ff0000';
            let refLineColor2 = '#ff00ff';

            let dataView: powerbi.DataView = {
                metadata: metadata(dataViewMetadataThreeColumn),
                categorical: {
                    categories: [{
                        source: dataViewMetadataThreeColumn[0],
                        values: categoryValues,
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataThreeColumn[1],
                            values: [10, 0, -30, null, 0]
                        }, {
                            source: dataViewMetadataThreeColumn[2],
                            values: [0, -20, null, 88, 10]
                        }])
                }
            };

            let yAxisReferenceLine: powerbi.DataViewObject = {
                show: true,
                value: 20,
                lineColor: { solid: { color: refLineColor1 } },
                transparency: 60,
                style: powerbi.visuals.lineStyle.dashed,
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
                let graphicsContext = $('.columnChart .mainGraphicsContext');

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
                        style: powerbi.visuals.lineStyle.dashed,
                        opacity: 0.4,
                        label: {
                            color: refLineColor1,
                            horizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                            text: '20',
                            verticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                            displayUnits: 0,
                        },
                    });

                yAxisReferenceLine['lineColor'] = { solid: { color: refLineColor2 } };
                yAxisReferenceLine['transparency'] = 0;
                yAxisReferenceLine['style'] = powerbi.visuals.lineStyle.dotted;
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
                            style: powerbi.visuals.lineStyle.dotted,
                            opacity: 1.0,
                            label: {
                                color: refLineColor2,
                                horizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                                text: '0K',
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

        it('clustered column chart reference line dom validation with M Values', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));

            let refLineColor1 = '#ff0000';
            let refLineColor2 = '#ff00ff';

            let dataView: powerbi.DataView = {
                metadata: metadata(dataViewMetadataThreeColumn),
                categorical: {
                    categories: [{
                        source: dataViewMetadataThreeColumn[0],
                        values: categoryValues,
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataThreeColumn[1],
                            values: [1000000, 0, 3000000, null, 2000000]
                        }, {
                            source: dataViewMetadataThreeColumn[2],
                            values: [0, 2000000, null, 880000, 1000000]
                        }])
                }
            };

            let yAxisReferenceLine: powerbi.DataViewObject = {
                show: true,
                value: 1600000,
                lineColor: { solid: { color: refLineColor1 } },
                transparency: 60,
                style: powerbi.visuals.lineStyle.dashed,
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
                let graphicsContext = $('.columnChart .mainGraphicsContext');

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
                        style: powerbi.visuals.lineStyle.dashed,
                        opacity: 0.4,
                        label: {
                            color: refLineColor1,
                            horizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                            text: '1,600,000',
                            verticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                            displayUnits: 0,
                        },
                    });

                yAxisReferenceLine['lineColor'] = { solid: { color: refLineColor2 } };
                yAxisReferenceLine['transparency'] = 0;
                yAxisReferenceLine['style'] = powerbi.visuals.lineStyle.dotted;
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
                            style: powerbi.visuals.lineStyle.dotted,
                            opacity: 1.0,
                            label: {
                                color: refLineColor2,
                                horizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                                text: '2M',
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
        
        it('clustered column chart reference line dom validation label precision', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));

            let refLineColor1 = '#ff0000';
            let refLineColor2 = '#ff00ff';

            let dataView: powerbi.DataView = {
                metadata: metadata(dataViewMetadataThreeColumn),
                categorical: {
                    categories: [{
                        source: dataViewMetadataThreeColumn[0],
                        values: categoryValues,
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataThreeColumn[1],
                            values: [10, 0, -30, null, 0]
                        }, {
                            source: dataViewMetadataThreeColumn[2],
                            values: [0, -20, null, 88, 10]
                        }])
                }
            };

            let yAxisReferenceLine: powerbi.DataViewObject = {
                show: true,
                value: 20,
                lineColor: { solid: { color: refLineColor1 } },
                transparency: 60,
                style: powerbi.visuals.lineStyle.dashed,
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
                let graphicsContext = $('.columnChart .mainGraphicsContext');

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
                        style: powerbi.visuals.lineStyle.dashed,
                        opacity: 0.4,
                        label: {
                            color: refLineColor1,
                            horizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                            text: '20.00',
                            verticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                            displayUnits: 0,
                        },
                    });

                yAxisReferenceLine['lineColor'] = { solid: { color: refLineColor2 } };
                yAxisReferenceLine['transparency'] = 0;
                yAxisReferenceLine['style'] = powerbi.visuals.lineStyle.dotted;
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
                            style: powerbi.visuals.lineStyle.dotted,
                            opacity: 1.0,
                            label: {
                                color: refLineColor2,
                                horizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                                text: '0.02K',
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

        it('clustered column explicit category color', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));

            let dataView: powerbi.DataView = {
                metadata: metadata(dataViewMetadataThreeColumn),
                categorical: {
                    categories: [{
                        source: dataViewMetadataThreeColumn[0],
                        values: categoryValues,
                        identity: categoryIdentities,
                        objects: <DataViewObjects[]>[],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataThreeColumn[1],
                            values: [10, 1, -30, 2, 0]
                        }])
                }
            };

            dataView.categorical.categories[0].objects[2] = <DataViewObjects> {
                dataPoint: { fill: { solid: { color: '#ff0000' } } },
            };

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                let columns = $('.columnChart .column');

                helpers.assertColorsMatch(columns.eq(2).css('fill'), '#ff0000');

                done();
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
                    let columnSeries = $('.series');

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

                let dataViews = new helpers.TrendLineBuilder({ combineSeries: false }).withObjects(objects).buildDataViews();

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

        if (!interactiveChart) {
            it('legend formatting', (done) => {
                let categoryIdentities = [
                    mocks.dataViewScopeIdentity("abc"),
                    mocks.dataViewScopeIdentity("def"),
                ];

                let dataView = {
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88]
                            }])
                    }
                };

                dataView.metadata.objects = { legend: { show: true, position: 'Top' } };

                v.onDataChanged({
                    dataViews: [dataView],
                    suppressAnimations: false,
                });

                setTimeout(() => {
                    expect($('.legend').attr('orientation')).toBe(LegendPosition.Top.toString());
                    
                    //change legend position
                    dataView.metadata.objects = { legend: { show: true, position: 'Right' } };
                    spyOn(v, 'renderPlotArea').and.callThrough();
                    v.onDataChanged({
                        dataViews: [dataView]
                    });
                    setTimeout(() => {
                        expect($('.legend').attr('orientation')).toBe(LegendPosition.Right.toString());
                        expect(v['renderPlotArea'].calls.mostRecent().args[2]/*suppressAnimation*/).toBe(true);

                        dataView.metadata.objects = { legend: { show: true, position: 'TopCenter', showTitle: true } };
                        v.onDataChanged({
                            dataViews: [dataView]
                        });
                        setTimeout(() => {
                            expect($('#legendGroup').attr('transform')).toBeDefined();                           

                            //set title
                            let testTitle = 'Test Title';
                            dataView.metadata.objects = { legend: { show: true, position: 'Right', showTitle: true, titleText: testTitle } };
                            v.onDataChanged({
                                dataViews: [dataView]
                            });
                            setTimeout(() => {
                                expect($('.legend').attr('orientation')).toBe(LegendPosition.Right.toString());
                                expect(helpers.findElementText($('.legendTitle'))).toBe(testTitle);
                                expect(helpers.findElementTitle($('.legendTitle'))).toBe(testTitle);
                                expect($('#legendGroup').attr('transform')).not.toBeDefined();
                                
                                //hide legend
                                dataView.metadata.objects = { legend: { show: false, position: 'Right' } };
                                v.onDataChanged({
                                    dataViews: [dataView]
                                });
                                setTimeout(() => {
                                    expect($('.legend').attr('orientation')).toBe(LegendPosition.None.toString());
                                    done();
                                }, DefaultWaitForRender);
                            }, DefaultWaitForRender);
                        }, DefaultWaitForRender);
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });
        }
    }

    describe("Clustered ColumnChart DOM validation", () => clusterColumnChartDomValidation(false, false));
    describe("Clustered ColumnChart DOM validation - Scalar", () => clusterColumnChartDomValidation(false, true));

    describe("Interactive Clustered ColumnChart DOM validation", () => clusterColumnChartDomValidation(true, false));
    describe("Interactive Clustered ColumnChart DOM validation - Scalar", () => clusterColumnChartDomValidation(true, true));

    function stackedColumnChartDomValidation(interactiveChart: boolean) {
        let v: powerbi.IVisual, element: JQuery;
        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
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
                }
            ],
        };
        let dataViewMetadataFiveColumn: powerbi.DataViewMetadata = {
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
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer),
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
                }, {
                    displayName: 'col5',
                    queryName: 'col5',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true },
                }],
            objects: {}
        };
        let hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {

            element = powerbitests.helpers.testDom('300', '300');
            v = new ColumnChartVisualBuilder(ColumnChartType.stackedColumn).build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: interactiveChart },
                animation: { transitionImmediate: true },
            });
        });

        it('single measure column chart dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000]
                        }])
                    }
                }]
            });

            let ticksText: JQuery = helpers.getAxisTicks('y').find('text');

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(2);
                expect($('.label').length).toBe(0);
                expect(helpers.findElementText(ticksText.last())).toBe('200K');
                expect(helpers.findElementTitle(ticksText.last())).toBe('200K');
                if (interactiveChart) expect($('.interactive-legend').length).toBe(1);
                else expect($('.legend').attr('orientation')).toBe(LegendPosition.None.toString());
                done();
            }, DefaultWaitForRender);
        });

        it('single measure column chart with too many values for view dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
                mocks.dataViewScopeIdentity("f"),
                mocks.dataViewScopeIdentity("g"),
                mocks.dataViewScopeIdentity("h"),
                mocks.dataViewScopeIdentity("i"),
                mocks.dataViewScopeIdentity("j"),
                mocks.dataViewScopeIdentity("k"),
                mocks.dataViewScopeIdentity("l"),
                mocks.dataViewScopeIdentity("m"),
                mocks.dataViewScopeIdentity("n"),
                mocks.dataViewScopeIdentity("o"),
                mocks.dataViewScopeIdentity("p"),
                mocks.dataViewScopeIdentity("q"),
                mocks.dataViewScopeIdentity("r"),
                mocks.dataViewScopeIdentity("s"),
                mocks.dataViewScopeIdentity("y"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 10,
                            max: 30,
                            subtotal: 420,
                            values: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
                        }])
                    }
                }]
            });

            let ticksText: JQuery = helpers.getAxisTicks('y').find('text');

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();

                // Data should be spliced down to a smaller set that will fit inside the view
                expect($('.column').length).toBeLessThan(15);

                // The max value in the view is ...
                expect(helpers.findElementText(ticksText.last())).toBe('30');
                expect(helpers.findElementTitle(ticksText.last())).toBe('30');

                if (interactiveChart) expect($('.interactive-legend').length).toBe(1);
                else expect($('.legend').attr('orientation')).toBe(LegendPosition.None.toString());

                // now update with empty series values to test corner case where we slice the category data but have no series data
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataTwoColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'],
                                identity: categoryIdentities,
                            }],
                            values: DataViewTransform.createValueColumns([])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.column').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('stacked column chart dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(4);
                let legendSelector: string = interactiveChart ? '.interactive-legend' : '.legend';
                expect($(legendSelector).length).toBe(1);
                expect($(legendSelector + (interactiveChart ? ' .item' : 'Item')).length).toBe(2);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart dom validation - start/end axis extents - pos', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
            ];
            let metadata = _.cloneDeep(dataViewMetadataFiveColumn);
            metadata.objects = {
                valueAxis: {
                    show: true,
                    start: 1,
                    end: 6,
                }
            };
            let dataViews: powerbi.DataView[] = [{
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadataFiveColumn.columns[0],
                        values: ['a', 'b'],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataFiveColumn.columns[1],
                            values: [2, -2]
                        }, {
                            source: dataViewMetadataFiveColumn.columns[2],
                            values: [-3, 4]
                        }, {
                            source: dataViewMetadataFiveColumn.columns[3],
                            values: [2.5, 2.5]
                        }, {
                            source: dataViewMetadataFiveColumn.columns[4],
                            values: [-3, -4]
                        }])
                }
            }];

            v.onDataChanged({
                dataViews: dataViews
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                let rects = $('.columnChart .column');
                let factor = interactiveChart ? 0.84 : 1;
                expect(rects.length).toBe(8);
                expect(rects.eq(0).attr('height')).toBeCloseTo(50 * factor, -1); //clipped so only takes up 1/5th of the 1-6 range
                expect(rects.eq(0).attr('y')).toBeCloseTo(195 * factor, -1);
                expect(+rects.eq(1).attr('height')).toBe(0); //negative value, not in view
                expect(rects.eq(4).attr('height')).toBeCloseTo(120 * factor, -1); //stacked, in full view
                expect(rects.eq(4).attr('y')).toBeCloseTo(75 * factor, -1);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart dom validation - start/end axis extents - neg', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
            ];
            let metadata = _.cloneDeep(dataViewMetadataFiveColumn);
            metadata.objects = {
                valueAxis: {
                    show: true,
                    start: -7,
                    end: -1,
                }
            };
            let dataViews: powerbi.DataView[] = [{
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadataFiveColumn.columns[0],
                        values: ['a', 'b'],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataFiveColumn.columns[1],
                            values: [2, -2]
                        }, {
                            source: dataViewMetadataFiveColumn.columns[2],
                            values: [-3, 4]
                        }, {
                            source: dataViewMetadataFiveColumn.columns[3],
                            values: [2.5, 2.5]
                        }, {
                            source: dataViewMetadataFiveColumn.columns[4],
                            values: [-3, -4]
                        }])
                }
            }];

            v.onDataChanged({
                dataViews: dataViews
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                let rects = $('.columnChart .column');
                let factor = interactiveChart ? 0.84 : 1;
                expect(rects.length).toBe(8);
                expect(rects.eq(1).attr('height')).toBeCloseTo(40 * factor, -1); //clipped so only takes up 1/5th of the 1-6 range
                expect(rects.eq(1).attr('y')).toBeCloseTo(0, -1);
                expect(+rects.eq(3).attr('height')).toBe(0); //positive value, not in view
                expect(rects.eq(6).attr('height')).toBeCloseTo(120 * factor, -1); //stacked, in full view
                expect(rects.eq(6).attr('y')).toBeCloseTo(80 * factor, -1);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart with partial highlight dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [54, 204]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [6, 66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('height').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('y').value)
                    .toBeGreaterThan(+$('.column')[0].attributes.getNamedItem('y').value);
                let legendSelector: string = interactiveChart ? '.interactive-legend' : '.legend';
                expect($(legendSelector).length).toBe(1);
                expect($(legendSelector + (interactiveChart ? ' .item' : 'Item')).length).toBe(2);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart with negative partial highlight dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: -234,
                                max: -123,
                                subtotal: -357,
                                values: [-123, -234],
                                highlights: [-54, -204]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: -88,
                                max: -12,
                                subtotal: -100,
                                values: [-12, -88],
                                highlights: [-6, -66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('height').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('y').value)
                    .toBe(+$('.column')[0].attributes.getNamedItem('y').value);
                let legendSelector: string = interactiveChart ? '.interactive-legend' : '.legend';
                expect($(legendSelector).length).toBe(1);
                expect($(legendSelector + (interactiveChart ? ' .item' : 'Item')).length).toBe(2);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart with partial highlight with overflow dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [154, 274]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [26, 166]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(4);
                expect($('.highlight').length).toBe(0);
                let legendSelector: string = interactiveChart ? '.interactive-legend' : '.legend';
                expect($(legendSelector).length).toBe(1);
                expect($(legendSelector + (interactiveChart ? ' .item' : 'Item')).length).toBe(2);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart with partial highlight with postitive/negative mix dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [-54, -204]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [-6, -66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(4);
                expect($('.highlight').length).toBe(0);
                let legendSelector: string = interactiveChart ? '.interactive-legend' : '.legend';
                expect($(legendSelector).length).toBe(1);
                expect($(legendSelector + (interactiveChart ? ' .item' : 'Item')).length).toBe(2);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart with partial highlight with overflow with single series', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [154, null],
                            },
                        ])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(3);
                expect($('.highlight').length).toBe(1);

                // Thinner bar
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeGreaterThan(+$('.column')[0].attributes.getNamedItem('height').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('y').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('y').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('width').value);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart with partial highlight with overflow with more than one series is back to stacked', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];

            // Now add another series and make sure we get a stacked as expected...
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [154, null],
                            },
                            {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [6, null]
                            },
                        ])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.column').length).toBe(2);
                expect($('.highlight').length).toBe(0);
                let legendSelector: string = interactiveChart ? '.interactive-legend' : '.legend';
                expect($(legendSelector).length).toBe(1);
                expect($(legendSelector + (interactiveChart ? ' .item' : 'Item')).length).toBe(2);

                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart missing measure dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, null]
                            }])
                    }
                }]
            });
            v.onResizing({ height: 500, width: 500 });

            let ticksText: JQuery = helpers.getAxisTicks('x').find('text');

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(3);
                expect(helpers.findElementText(ticksText.last())).toBe('def');
                expect(helpers.findElementTitle(ticksText.last())).toBe('def');
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart with near zero measures dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                values: [0.0001, 234]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                values: [12, -0.0001]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(4);
                let smallPositiveRectYValue = $('.column')[0].attributes.getNamedItem('y').value;
                let smallNegativeRectYValue = $('.column')[3].attributes.getNamedItem('y').value;
                expect(smallPositiveRectYValue).not.toEqual(smallNegativeRectYValue);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart optimal ticks dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                values: [1, 3]
                            }])
                    }
                }]
            });

            let ticksText: JQuery = helpers.getAxisTicks('y').find('text');

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(2);
                expect(helpers.getAxisTicks('y').length).toBe(4);
                expect(helpers.findElementText(ticksText.last())).toBe('3');
                expect(helpers.findElementTitle(ticksText.last())).toBe('3');
                done();
            }, DefaultWaitForRender);
        });

        it('empty stacked column chart dom validation', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: []
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: []
                        }])
                    }
                }]
            });

            let ticksText: JQuery = helpers.getAxisTicks('y').find('text');

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect(helpers.getAxisTicks('x').length).toBe(0);
                expect(helpers.getAxisTicks('y').length).toBeGreaterThan(0);
                expect(helpers.findElementText(ticksText.last())).toBe('10');
                expect(helpers.findElementTitle(ticksText.last())).toBe('10');
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart with small interval dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            let ticksText: JQuery = helpers.getAxisTicks('y').find('text');

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect(helpers.getAxisTicks('x').length).toBeGreaterThan(0);
                expect(helpers.getAxisTicks('y').length).toBeGreaterThan(0);
                expect(helpers.findElementText(ticksText.last())).toBe('2.5');
                expect(helpers.findElementTitle(ticksText.last())).toBe('2.5');
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart should be cleared when empty dataview is applied', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.column').length).toBeGreaterThan(0);

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataTwoColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn.columns[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.column').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('stacked column chart with no animator should filter 0/null columns', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                values: [10, 0, 30, null, 0]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                values: [0, 20, null, 88, 10]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(5);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart zero line axis is darkened', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                values: [10, 0, -30, null, 0]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                values: [0, -20, null, 88, 10]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                let zeroTicks = $('g.tick:has(line.zero-line)');

                expect(zeroTicks.length).toBe(2);
                zeroTicks.each(function (i, item) {
                    expect(d3.select(item).datum() === 0).toBe(true);
                });

                done();
            }, DefaultWaitForRender);
        });

        it('stacked column explicit category color', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));

            let dataView: powerbi.DataView = {
                metadata: dataViewMetadataTwoColumn,
                categorical: {
                    categories: [{
                        source: dataViewMetadataTwoColumn.columns[0],
                        values: categoryValues,
                        identity: categoryIdentities,
                        objects: <DataViewObjects[]>[],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [10, 1, -30, 2, 0]
                        }])
                }
            };

            dataView.categorical.categories[0].objects[2] = <DataViewObjects>{
                dataPoint: { fill: { solid: { color: '#ff0000' } } },
            };

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                let columns = $('.columnChart .column');

                helpers.assertColorsMatch(columns.eq(2).css('fill'), '#ff0000');

                done();
            }, DefaultWaitForRender);
        });

        // TODO: should be moved to cartesian tests
        it('background image', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            let metadata = _.cloneDeep(dataViewMetadataTwoColumn);
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
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000]
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

    describe("Stacked ColumnChart DOM validation", () => stackedColumnChartDomValidation(false));

    describe("Interactive Stacked ColumnChart DOM validation", () => stackedColumnChartDomValidation(true));

    function hundredPercentStackedColumnChartDomValidation(interactiveChart: boolean) {
        let v: powerbi.IVisual, element: JQuery;
        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
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
                }
            ],
        };
        let dataViewMetadataFiveColumn: powerbi.DataViewMetadata = {
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
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true },
                }],
        };
        let hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {

            element = powerbitests.helpers.testDom('300', '300');
            v = new ColumnChartVisualBuilder(ColumnChartType.hundredPercentStackedColumn).build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: interactiveChart },
                animation: { transitionImmediate: true },
            });
        });

        it('single measure hundred percent column chart dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataFiveColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000]
                        }])
                    }
                }]
            });

            let ticksText: JQuery = helpers.getAxisTicks('y').find('text');

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(2);
                expect(helpers.findElementText(ticksText.last())).toBe('100%');
                expect(helpers.findElementTitle(ticksText.last())).toBe('100%');
                done();
            }, DefaultWaitForRender);
        });

        it('single measure partial highlight hundred percent column chart dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataFiveColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000],
                            highlights: [50000, 10000]
                        }])
                    }
                }]
            });

            let ticksText: JQuery = helpers.getAxisTicks('y').find('text');

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(4);
                expect($('.highlight').length).toBe(2);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('height').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('y').value)
                    .toBeGreaterThan(+$('.column')[0].attributes.getNamedItem('y').value);
                expect(helpers.findElementText(ticksText.last())).toBe('100%');
                expect(helpers.findElementTitle(ticksText.last())).toBe('100%');
                expect($('.label').length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });

        it('multi measure hundred percent column chart dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 100000,
                                max: 200000,
                                subtotal: 300000,
                                values: [100000, 200000]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: 100000,
                                max: 200000,
                                subtotal: 300000,
                                values: [100000, 200000]
                            }])
                    }
                }]
            });

            let ticksText: JQuery = helpers.getAxisTicks('y').find('text');

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(4);
                expect(helpers.findElementText(ticksText.last())).toBe('100%');
                expect(helpers.findElementTitle(ticksText.last())).toBe('100%');
                done();
            }, DefaultWaitForRender);
        });

        it('empty hundred percent column chart dom validation', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: []
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: []
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect(helpers.getAxisTicks('x').length).toBe(0);
                expect(helpers.getAxisTicks('y').length).toBeGreaterThan(0);
                done();
            }, DefaultWaitForRender);
        });

        it('hundred percent column chart should be cleared when empty dataview is applied', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.column').length).toBeGreaterThan(0);

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataTwoColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn.columns[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.column').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('hundred percent column chart with no animator should filter 0/null columns', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                values: [10, 0, 30, null, 0]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                values: [0, 20, null, 88, 10]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(5);
                done();
            }, DefaultWaitForRender);
        });

        it('hundred percent column chart zero line axis is darkened', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                values: [10, 0, -30, null, 0]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                values: [0, -20, null, 88, 10]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                let zeroTicks = $('g.tick:has(line.zero-line)');

                expect(zeroTicks.length).toBe(2);
                zeroTicks.each(function (i, item) {
                    expect(d3.select(item).datum() === 0).toBe(true);
                });

                done();
            }, DefaultWaitForRender);
        });

        it('hundred percent column explicit category color', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));

            let dataView: powerbi.DataView = {
                metadata: dataViewMetadataTwoColumn,
                categorical: {
                    categories: [{
                        source: dataViewMetadataTwoColumn.columns[0],
                        values: categoryValues,
                        identity: categoryIdentities,
                        objects: <DataViewObjects[]>[],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [10, 1, -30, 2, 0]
                        }])
                }
            };

            dataView.categorical.categories[0].objects[2] = <DataViewObjects>{
                dataPoint: { fill: { solid: { color: '#ff0000' } } },
            };

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                let columns = $('.columnChart .column');

                helpers.assertColorsMatch(columns.eq(2).css('fill'), '#ff0000');

                done();
            }, DefaultWaitForRender);
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

    describe("Hundred Percent Stacked ColumnChart DOM validation", () => hundredPercentStackedColumnChartDomValidation(false));

    describe("Interactive Hundred Percent Stacked ColumnChart DOM validation", () => hundredPercentStackedColumnChartDomValidation(true));

    function stackedBarChartDomValidation(interactiveChart: boolean) {
        let v: powerbi.IVisual, element: JQuery;
        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
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
                }]
        };
        let dataViewMetadataFiveColumn: powerbi.DataViewMetadata = {
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
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer),
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
                }, {
                    displayName: 'col5',
                    queryName: 'col5',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true },
                }]
        };
        let hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {

            element = powerbitests.helpers.testDom('500', '500');
            v = new ColumnChartVisualBuilder(ColumnChartType.stackedBar).build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: interactiveChart },
                animation: { transitionImmediate: true },
            });
        });

        it('single measure bar chart long labels dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("this is the label that never ends, it just goes on and on my friends. Some axis started rendering it not knowing what it was, and now it keeps on rendering forever just because this the label that never ends..."),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['this is the label that never ends, it just goes on and on my friends. Some axis started rendering it not knowing what it was, and now it keeps on rendering forever just because this the label that never ends...', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(2);
                expect($('.label').length).toBe(0);

                // Y-axis margin should be limited to a % of the chart area, and excess text should be replaced with an ellipsis.
                expect($('.columnChart.axisGraphicsContext').attr('transform')).toBe('translate(135,8)');

                // Note: the exact text will be different depending on the environment in which the test is run, so we can't do an exact match.
                // Just check that the text is truncated with ellipses.
                let labelText = helpers.findElementText(helpers.getAxisTicks('y').find('text').first());
                expect(labelText.length).toBeLessThan(30);
                expect(labelText.substr(labelText.length - 1)).toBe('…');
                done();
            }, DefaultWaitForRender);
        });

        it('single measure bar chart dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000]
                        }])
                    }
                }]
            });

            let xTicksText: JQuery = helpers.getAxisTicks('x').find('text');
            let yTicksText: JQuery = helpers.getAxisTicks('y').find('text');

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(2);
                expect(helpers.findElementText(xTicksText.last())).toBe('200K');
                expect(helpers.findElementTitle(xTicksText.last())).toBe('200K');
                expect(helpers.findElementText(yTicksText.last())).toBe('def');
                expect(helpers.findElementTitle(yTicksText.last())).toBe('def');
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(4);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart dom validation - start/end axis extents - pos', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
            ];
            let metadata = _.cloneDeep(dataViewMetadataFiveColumn);
            metadata.objects = {
                valueAxis: {
                    show: true,
                    start: 1,
                    end: 6,
                }
            };
            let dataViews: powerbi.DataView[] = [{
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadataFiveColumn.columns[0],
                        values: ['a', 'b'],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataFiveColumn.columns[1],
                            values: [2, -2]
                        }, {
                            source: dataViewMetadataFiveColumn.columns[2],
                            values: [-3, 4]
                        }, {
                            source: dataViewMetadataFiveColumn.columns[3],
                            values: [2.5, 2.5]
                        }, {
                            source: dataViewMetadataFiveColumn.columns[4],
                            values: [-3, -4]
                        }])
                }
            }];

            v.onDataChanged({
                dataViews: dataViews
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                let rects = $('.columnChart .bar');
                expect(rects.length).toBe(8);
                expect(rects.eq(0).attr('width')).toBeCloseTo(95, -1); //clipped so only takes up 1/5th of the 1-6 range
                expect(+rects.eq(0).attr('x')).toBeCloseTo(0, -1);
                expect(+rects.eq(1).attr('width')).toBe(0); //negative value, not in view
                expect(rects.eq(4).attr('width')).toBeCloseTo(240, -1); //stacked, in full view
                expect(rects.eq(4).attr('x')).toBeCloseTo(95, -1);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart dom validation - start/end axis extents - neg', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
            ];
            let metadata = _.cloneDeep(dataViewMetadataFiveColumn);
            metadata.objects = {
                valueAxis: {
                    show: true,
                    start: -7,
                    end: -1,
                }
            };
            let dataViews: powerbi.DataView[] = [{
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadataFiveColumn.columns[0],
                        values: ['a', 'b'],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataFiveColumn.columns[1],
                            values: [2, -2]
                        }, {
                            source: dataViewMetadataFiveColumn.columns[2],
                            values: [-3, 4]
                        }, {
                            source: dataViewMetadataFiveColumn.columns[3],
                            values: [2.5, 2.5]
                        }, {
                            source: dataViewMetadataFiveColumn.columns[4],
                            values: [-3, -4]
                        }])
                }
            }];

            v.onDataChanged({
                dataViews: dataViews
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                let rects = $('.columnChart .bar');
                expect(rects.length).toBe(8);
                expect(rects.eq(1).attr('width')).toBeCloseTo(80, -1); //clipped so only takes up 1/5th of the 1-6 range
                expect(rects.eq(1).attr('x')).toBeCloseTo(400, -1);
                expect(+rects.eq(3).attr('width')).toBe(0); //positive value, not in view
                expect(rects.eq(6).attr('width')).toBeCloseTo(240, -1); //stacked, in full view
                expect(rects.eq(6).attr('x')).toBeCloseTo(80, -1);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart partial highlight dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [54, 204]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [6, 66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeLessThan(+$('.bar')[0].attributes.getNamedItem('width').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('x').value)
                    .toBe(+$('.bar')[0].attributes.getNamedItem('x').value);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart negative partial highlight dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: -234,
                                max: -123,
                                subtotal: -357,
                                values: [-123, -234],
                                highlights: [-54, -204]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: -88,
                                max: -12,
                                subtotal: -100,
                                values: [-12, -88],
                                highlights: [-6, -66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeLessThan(+$('.bar')[0].attributes.getNamedItem('width').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('x').value)
                    .toBeGreaterThan(+$('.bar')[0].attributes.getNamedItem('x').value);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart partial highlight with overflow dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [154, 264]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [16, 166]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(4);
                expect($('.highlight').length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart partial highlight with positive/negative mix dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [-54, -204]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [-6, -66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(4);
                expect($('.highlight').length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });

        it('incremental render bar chart one to multiple series bar chart dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(2);

                let labels = helpers.getAxisTicks('x').find('text');

                expect(helpers.findElementText($(labels).last())).toBe('200K');
                expect(helpers.findElementTitle($(labels).last())).toBe('200K');

                labels = helpers.getAxisTicks('y').find('text');

                expect(helpers.findElementText($(labels).last())).toBe('def');
                expect(helpers.findElementTitle($(labels).last())).toBe('def');

                // Legend should be empty, axis should be further up to take the extra space.
                if (!interactiveChart) expect($('.legendItem')).not.toBeInDOM();
                
                // Note: depending on where the tests is run there can be a 1 pixel difference in the location of the axis
                //expect($('.columnChart .axisGraphicsContext').attr('transform')).toBe('translate(25,8)');
                //expect(helpers.isTranslateCloseTo($('.columnChart .axisGraphicsContext').attr('transform'), 25, 8)).toBe(true);

                // Update the data set so that the chart is redrawn with multiple series and a legend
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataFiveColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataFiveColumn.columns[0],
                                values: ['abc', 'def'],
                                identity: categoryIdentities,
                            }],
                            values: DataViewTransform.createValueColumns([
                                {
                                    source: dataViewMetadataFiveColumn.columns[1],
                                    min: 123,
                                    max: 234,
                                    subtotal: 357,
                                    values: [123, 234]
                                }, {
                                    source: dataViewMetadataFiveColumn.columns[2],
                                    min: 12,
                                    max: 88,
                                    subtotal: 100,
                                    values: [12, 88]
                                }])
                        }
                    }]
                });

                setTimeout(() => {
                    expect($('.columnChart')).toBeInDOM();
                    expect($('.bar').length).toBe(4);

                    // Legend should be visible, axis shouldn't need to move, since we use relative layout
                    let legendSelector: string = interactiveChart ? '.interactive-legend' : '.legend';
                    expect($(legendSelector)).toBeInDOM();
                    expect($(legendSelector).children.length).toBe(2);

                    //expect(helpers.isTranslateCloseTo($('.columnChart .axisGraphicsContext').attr('transform'), 28, 8)).toBe(true);

                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('stacked bar chart missing measure dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, null]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(3);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart with near zero measures dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                values: [0.0001, 234]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                values: [12, -0.0001]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(4);
                let smallPositiveRectXValue = $('.bar')[0].attributes.getNamedItem('x').value;
                let smallNegativeRectXValue = $('.bar')[3].attributes.getNamedItem('x').value;
                expect(smallPositiveRectXValue).not.toEqual(smallNegativeRectXValue);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart optimal ticks dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                values: [1, 3]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(2);
                expect(helpers.getAxisTicks('x').length).toBe(4);
                expect(helpers.findElementText(helpers.getAxisTicks('x').find('text').last())).toBe('3');
                expect(helpers.findElementTitle(helpers.getAxisTicks('x').find('text').last())).toBe('3');
                done();
            }, DefaultWaitForRender);
        });

        it('empty stacked bar chart dom validation', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: []
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: []
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect(helpers.getAxisTicks('y').length).toBe(0);
                expect(helpers.getAxisTicks('x').length).toBeGreaterThan(0);
                expect(helpers.findElementText(helpers.getAxisTicks('x').find('text').last())).toBe('10');
                expect(helpers.findElementTitle(helpers.getAxisTicks('x').find('text').last())).toBe('10');
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart with small interval dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect(helpers.getAxisTicks('x').length).toBeGreaterThan(0);
                expect(helpers.getAxisTicks('y').length).toBeGreaterThan(0);
                expect(helpers.findElementText(helpers.getAxisTicks('x').find('text').last())).toBe('2.5');
                expect(helpers.findElementTitle(helpers.getAxisTicks('x').find('text').last())).toBe('2.5');
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart should be cleared when empty dataview is applied', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.bar').length).toBeGreaterThan(0);

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataTwoColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn.columns[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.bar').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('stacked bar chart with no animator should filter 0/null columns', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                values: [10, 0, 30, null, 0]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                values: [0, 20, null, 88, 10]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(5);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart zero line axis is darkened', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                values: [10, 0, -30, null, 0]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                values: [0, -20, null, 88, 10]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                let zeroTicks = $('g.tick:has(line.zero-line)');

                expect(zeroTicks.length).toBe(2);
                zeroTicks.each(function (i, item) {
                    expect(d3.select(item).datum() === 0).toBe(true);
                });

                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart explicit category color', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));

            let dataView: powerbi.DataView = {
                metadata: dataViewMetadataTwoColumn,
                categorical: {
                    categories: [{
                        source: dataViewMetadataTwoColumn.columns[0],
                        values: categoryValues,
                        identity: categoryIdentities,
                        objects: <DataViewObjects[]>[],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [10, 1, -30, 2, 0]
                        }])
                }
            };

            dataView.categorical.categories[0].objects[2] = <DataViewObjects>{
                dataPoint: { fill: { solid: { color: '#ff0000' } } },
            };

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                let columns = $('.columnChart .bar');

                helpers.assertColorsMatch(columns.eq(2).css('fill'), '#ff0000');

                done();
            }, DefaultWaitForRender);
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

    describe("Stacked BarChart DOM validation", () => stackedBarChartDomValidation(false));

    describe("Interactive Stacked BarChart DOM validation", () => stackedBarChartDomValidation(true));

    function hundredPercentStackedBarChartDomValidation(interactiveChart: boolean) {
        let v: powerbi.IVisual, element: JQuery;
        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
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
                }
            ],
        };
        let dataViewMetadataFiveColumn: powerbi.DataViewMetadata = {
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
                }]
        };
        let hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {

            element = powerbitests.helpers.testDom('500', '500');
            v = new ColumnChartVisualBuilder(ColumnChartType.hundredPercentStackedBar).build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: interactiveChart },
                animation: { transitionImmediate: true },
            });
        });

        it('single measure hundred percent bar chart dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataFiveColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(2);
                expect(helpers.findElementText(helpers.getAxisTicks('x').find('text').last())).toBe('100%');
                expect(helpers.findElementTitle(helpers.getAxisTicks('x').find('text').last())).toBe('100%');
                done();
            }, DefaultWaitForRender);
        });

        it('single measure partial highlight hundred percent bar chart dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataFiveColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000],
                            highlights: [50000, 10000]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(4);
                expect($('.highlight').length).toBe(2);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeLessThan(+$('.bar')[0].attributes.getNamedItem('width').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('x').value)
                    .toBe(+$('.bar')[0].attributes.getNamedItem('x').value);
                expect(helpers.findElementText(helpers.getAxisTicks('x').find('text').last())).toBe('100%');
                expect(helpers.findElementTitle(helpers.getAxisTicks('x').find('text').last())).toBe('100%');
                done();
            }, DefaultWaitForRender);
        });

        it('multi measure hundred percent bar chart dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 100000,
                                max: 200000,
                                subtotal: 300000,
                                values: [100000, 200000]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: 100000,
                                max: 200000,
                                subtotal: 300000,
                                values: [100000, 200000]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(4);
                expect(helpers.findElementText(helpers.getAxisTicks('x').find('text').last())).toBe('100%');
                expect(helpers.findElementTitle(helpers.getAxisTicks('x').find('text').last())).toBe('100%');
                done();
            }, DefaultWaitForRender);
        });

        it('empty hundred percent bar chart dom validation', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: []
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: []
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect(helpers.getAxisTicks('y').length).toBe(0);
                expect(helpers.getAxisTicks('x').length).toBeGreaterThan(0);
                done();
            }, DefaultWaitForRender);
        });

        it('hundred percent bar chart should be cleared when empty dataview is applied', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.bar').length).toBeGreaterThan(0);

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataTwoColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn.columns[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.bar').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('hundred percent bar chart with no animator should filter 0/null columns', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                values: [10, 0, 30, null, 0]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                values: [0, 20, null, 88, 10]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(5);
                done();
            }, DefaultWaitForRender);
        });

        it('hundred percent bar chart zero line axis is darkened', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                values: [10, 0, -30, null, 0]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                values: [0, -20, null, 88, 10]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                let zeroTicks = $('g.tick:has(line.zero-line)');

                expect(zeroTicks.length).toBe(2);
                zeroTicks.each(function (i, item) {
                    expect(d3.select(item).datum() === 0).toBe(true);
                });

                done();
            }, DefaultWaitForRender);
        });

        it('hundred percent bar chart explicit category color', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));

            let dataView: powerbi.DataView = {
                metadata: dataViewMetadataTwoColumn,
                categorical: {
                    categories: [{
                        source: dataViewMetadataTwoColumn.columns[0],
                        values: categoryValues,
                        identity: categoryIdentities,
                        objects: <DataViewObjects[]>[],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [10, 1, -30, 2, 0]
                        }])
                }
            };

            dataView.categorical.categories[0].objects[2] = <DataViewObjects>{
                dataPoint: { fill: { solid: { color: '#ff0000' } } },
            };

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                let columns = $('.columnChart .bar');

                helpers.assertColorsMatch(columns.eq(2).css('fill'), '#ff0000');

                done();
            }, DefaultWaitForRender);
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

    describe("Hundred Percent Stacked BarChart DOM validation", () => hundredPercentStackedBarChartDomValidation(false));

    describe("Interactive Hundred Percent Stacked BarChart DOM validation", () => hundredPercentStackedBarChartDomValidation(true));

    function clusterdBarChartDomValidation(interactiveChart: boolean) {
        let v: powerbi.IVisual, element: JQuery;
        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
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
                }
            ],
        };
        let dataViewMetadataFiveColumn: powerbi.DataViewMetadata = {
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
                }],
        };
        let hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {

            element = powerbitests.helpers.testDom('300', '300');
            v = new ColumnChartVisualBuilder(ColumnChartType.clusteredBar).build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: interactiveChart },
                animation: { transitionImmediate: true },
            });
        });

        it('clustered bar chart dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[3],
                                min: 27,
                                max: 113,
                                subtotal: 140,
                                values: [27, 113]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(6);
                let rects = $('.bar');
                expect(rects.length).toBe(6);
                expect($('.label').length).toBe(0);
                expect(+rects.eq(0).attr('y')).toBeLessThan(+rects.eq(1).attr('y'));
                expect(+rects.eq(0).attr('y')).toBeLessThan(+rects.eq(2).attr('y'));
                expect(+rects.eq(0).attr('y')).toBeLessThan(+rects.eq(4).attr('y'));
                expect(+rects.eq(2).attr('y')).toBeLessThan(+rects.eq(4).attr('y'));
                done();
            }, DefaultWaitForRender);
        });

        it('clustered bar chart partial highlight dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [54, 204]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [6, 66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeLessThan(+$('.bar')[0].attributes.getNamedItem('width').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('x').value)
                    .toBe(+$('.bar')[0].attributes.getNamedItem('x').value);
                expect($('.label').length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered bar chart negative partial highlight dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: -234,
                                max: -54,
                                subtotal: -357,
                                values: [-123, -234],
                                highlights: [-54, -204]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: -88,
                                max: -12,
                                subtotal: -100,
                                values: [-12, -88],
                                highlights: [-6, -66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeLessThan(+$('.bar')[0].attributes.getNamedItem('width').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('x').value)
                    .toBeGreaterThan(+$('.bar')[0].attributes.getNamedItem('x').value);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered bar chart partial highlight with overflow dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [150, 264]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [18, 104]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeGreaterThan(+$('.bar')[0].attributes.getNamedItem('width').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('x').value)
                    .toBe(+$('.bar')[0].attributes.getNamedItem('x').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeLessThan(+$('.bar')[0].attributes.getNamedItem('height').value);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered bar chart partial highlight with postiive/negative mix dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [-54, -204]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [-6, -66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeLessThan(+$('.bar')[0].attributes.getNamedItem('width').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('x').value)
                    .toBeLessThan(+$('.bar')[0].attributes.getNamedItem('x').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeLessThan(+$('.bar')[0].attributes.getNamedItem('height').value);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered bar chart missing measure dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, null]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(3);
                expect(helpers.findElementText(helpers.getAxisTicks('y').find('text').last())).toBe('def');
                expect(helpers.findElementTitle(helpers.getAxisTicks('y').find('text').last())).toBe('def');
                done();
            }, DefaultWaitForRender);
        });

        it('clustered bar chart with near zero measures dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                values: [0.0001, 234]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                values: [12, -0.0001]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(4);
                let smallPositiveRectXValue = $('.bar')[0].attributes.getNamedItem('x').value;
                let smallNegativeRectXValue = $('.bar')[3].attributes.getNamedItem('x').value;
                expect(smallPositiveRectXValue).not.toEqual(smallNegativeRectXValue);
                done();
            }, DefaultWaitForRender);
        });

        it('empty clustered bar chart dom validation', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: []
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: []
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect(helpers.getAxisTicks('y').length).toBe(0);
                expect(helpers.getAxisTicks('x').length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered bar chart with small interval dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect(helpers.getAxisTicks('x').length).toBeGreaterThan(0);
                expect(helpers.getAxisTicks('y').length).toBeGreaterThan(0);
                expect(helpers.findElementText(helpers.getAxisTicks('x').find('text').last())).toBe('2');
                expect(helpers.findElementTitle(helpers.getAxisTicks('x').find('text').last())).toBe('2');
                done();
            }, DefaultWaitForRender);
        });

        it('clustered bar chart should be cleared when empty dataview is applied', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.bar').length).toBeGreaterThan(0);

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataTwoColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn.columns[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.bar').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('clustered bar chart with no animator should filter 0/null columns', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                values: [10, 0, 30, null, 0]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                values: [0, 20, null, 88, 10]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(5);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered bar chart zero line axis is darkened', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFiveColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFiveColumn.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFiveColumn.columns[1],
                                values: [10, 0, -30, null, 0]
                            }, {
                                source: dataViewMetadataFiveColumn.columns[2],
                                values: [0, -20, null, 88, 10]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                let zeroTicks = $('g.tick:has(line.zero-line)');

                expect(zeroTicks.length).toBe(2);
                zeroTicks.each(function (i, item) {
                    expect(d3.select(item).datum() === 0).toBe(true);
                });

                done();
            }, DefaultWaitForRender);
        });

        it('clustered bar chart reference line dom validation', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));

            let refLineColor1 = '#ff0000';
            let refLineColor2 = '#ff00ff';

            let dataView: powerbi.DataView = {
                metadata: dataViewMetadataFiveColumn,
                categorical: {
                    categories: [{
                        source: dataViewMetadataFiveColumn.columns[0],
                        values: categoryValues,
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataFiveColumn.columns[1],
                            values: [10, 0, -30, null, 0]
                        }, {
                            source: dataViewMetadataFiveColumn.columns[2],
                            values: [0, -20, null, 88, 10]
                        }])
                }
            };

            let yAxisReferenceLine: powerbi.DataViewObject = {
                show: true,
                value: 20,
                lineColor: { solid: { color: refLineColor1 } },
                transparency: 60,
                style: powerbi.visuals.lineStyle.dashed,
                position: powerbi.visuals.referenceLinePosition.back,
                dataLabelShow: true,
                dataLabelColor: { solid: { color: refLineColor1 } },
                dataLabelDecimalPoints: 0,
                dataLabelHorizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                dataLabelVerticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                dataLabelDisplayUnits: 0
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
                let graphicsContext = $('.columnChart .mainGraphicsContext');

                let yLine = $('.y1-ref-line');
                let yLabel = $('.labelGraphicsContext .label').eq(0);
                helpers.verifyReferenceLine(
                    yLine,
                    yLabel,
                    graphicsContext,
                    {
                        inFront: false,
                        isHorizontal: false,
                        color: refLineColor1,
                        style: powerbi.visuals.lineStyle.dashed,
                        opacity: 0.4,
                        label: {
                            color: refLineColor1,
                            horizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                            text: '20',
                            verticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                            displayUnits: 0,
                        },
                    });

                yAxisReferenceLine['lineColor'] = { solid: { color: refLineColor2 } };
                yAxisReferenceLine['transparency'] = 0;
                yAxisReferenceLine['style'] = powerbi.visuals.lineStyle.dotted;
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
                            isHorizontal: false,
                            color: refLineColor2,
                            style: powerbi.visuals.lineStyle.dotted,
                            opacity: 1.0,
                            label: {
                                color: refLineColor2,
                                horizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                                text: '0K',
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

        it('clustered bar chart reference line dom validation label precision', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));

            let refLineColor1 = '#ff0000';
            let refLineColor2 = '#ff00ff';

            let dataView: powerbi.DataView = {
                metadata: dataViewMetadataFiveColumn,
                categorical: {
                    categories: [{
                        source: dataViewMetadataFiveColumn.columns[0],
                        values: categoryValues,
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataFiveColumn.columns[1],
                            values: [10, 0, -30, null, 0]
                        }, {
                            source: dataViewMetadataFiveColumn.columns[2],
                            values: [0, -20, null, 88, 10]
                        }])
                }
            };

            let yAxisReferenceLine: powerbi.DataViewObject = {
                show: true,
                value: 20,
                lineColor: { solid: { color: refLineColor1 } },
                transparency: 60,
                style: powerbi.visuals.lineStyle.dashed,
                position: powerbi.visuals.referenceLinePosition.back,
                dataLabelShow: true,
                dataLabelColor: { solid: { color: refLineColor1 } },
                dataLabelDecimalPoints: 2,
                dataLabelHorizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                dataLabelVerticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                dataLabelDisplayUnits: 0
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
                let graphicsContext = $('.columnChart .mainGraphicsContext');

                let yLine = $('.y1-ref-line');
                let yLabel = $('.labelGraphicsContext .label').eq(0);
                helpers.verifyReferenceLine(
                    yLine,
                    yLabel,
                    graphicsContext,
                    {
                        inFront: false,
                        isHorizontal: false,
                        color: refLineColor1,
                        style: powerbi.visuals.lineStyle.dashed,
                        opacity: 0.4,
                        label: {
                            color: refLineColor1,
                            horizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                            text: '20.00',
                            verticalPosition: powerbi.visuals.referenceLineDataLabelVerticalPosition.above,
                            displayUnits: 0,
                        },
                    });

                yAxisReferenceLine['lineColor'] = { solid: { color: refLineColor2 } };
                yAxisReferenceLine['transparency'] = 0;
                yAxisReferenceLine['style'] = powerbi.visuals.lineStyle.dotted;
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
                            isHorizontal: false,
                            color: refLineColor2,
                            style: powerbi.visuals.lineStyle.dotted,
                            opacity: 1.0,
                            label: {
                                color: refLineColor2,
                                horizontalPosition: powerbi.visuals.referenceLineDataLabelHorizontalPosition.left,
                                text: '0.02K',
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

        it('clustered bar chart explicit category color', (done) => {
            let categoryValues = ['a', 'b', 'c', 'd', 'e'];
            let categoryIdentities = categoryValues.map(d => mocks.dataViewScopeIdentity(d));

            let dataView: powerbi.DataView = {
                metadata: dataViewMetadataTwoColumn,
                categorical: {
                    categories: [{
                        source: dataViewMetadataTwoColumn.columns[0],
                        values: categoryValues,
                        identity: categoryIdentities,
                        objects: <DataViewObjects[]>[],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [10, 1, -30, 2, 0]
                        }])
                }
            };

            dataView.categorical.categories[0].objects[2] = <DataViewObjects>{
                dataPoint: { fill: { solid: { color: '#ff0000' } } },
            };

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                let columns = $('.columnChart .bar');

                helpers.assertColorsMatch(columns.eq(2).css('fill'), '#ff0000');

                done();
            }, DefaultWaitForRender);
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

    describe("Clustered BarChart DOM validation", () => clusterdBarChartDomValidation(false));
    describe("Interactive Clustered BarChart DOM validation", () => clusterdBarChartDomValidation(true));

    describe("Enumerate Objects", () => {
        let v: powerbi.IVisual, element: JQuery;
        let categoryColumn: powerbi.DataViewMetadataColumn = { displayName: 'year', queryName: 'selectYear', type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text), roles: { Category: true } };
        let measureColumn: powerbi.DataViewMetadataColumn = { displayName: 'sales', queryName: 'selectSales', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer), objects: { general: { formatString: '$0' } }, roles: { Y: true } };
        let measure2Column: powerbi.DataViewMetadataColumn = { displayName: 'tax', queryName: 'selectTax', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y: true } };
        let hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {
            element = powerbitests.helpers.testDom('800', '800');
            v = new ColumnChartVisualBuilder(ColumnChartType.stackedColumn).build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
        });

        it('enumerateObjectInstances: category+measure', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("red"),
                mocks.dataViewScopeIdentity("def"),
            ];

            let dataView: powerbi.DataView = {
                metadata: { columns: [categoryColumn, measureColumn] },
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: ['red', 'def'],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        min: 100000,
                        max: 200000,
                        values: [100000, 200000]
                    }])
                },

            };

            let builder = new ColumnChartBuilder(dataView);
            let builtDataView = builder.withShowAll().build();

            v.onDataChanged({ dataViews: [builtDataView] });

            setTimeout(() => {
                var points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'dataPoint' });
                expect(points.instances.length).toBe(3);
                expect(points.instances[0]['properties']['defaultColor']).toBeDefined();
                expect(points.instances[0]['properties']['showAllDataPoints']).toBeDefined();

                let defaultColor = (<powerbi.Fill>(points.instances[0]['properties']['defaultColor'])).solid.color;
                let color1 = (<powerbi.Fill>(points.instances[2]['properties']['fill'])).solid.color;

                expect(points.instances[1].displayName).toBe('red');
                expect(points.instances[1].selector.data).toEqual([categoryIdentities[0]]);
                expect(points.instances[1].selector.metadata).toBeUndefined();
                expect(points.instances[2].displayName).toBe('def');
                expect(color1).toEqual(defaultColor);

                var points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'categoryAxis' });
                expect(points.instances.length).toBe(1);
                expect(points.instances[0].displayName).toBeUndefined();

                var points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'legend' });
                expect(points).toBeUndefined();

                done();
            }, DefaultWaitForRender);
        });

        it('enumerateObjectInstances: Verify instances on ordinal category axis', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("red"),
                mocks.dataViewScopeIdentity("def"),
            ];
            
            let dataView: powerbi.DataView = {
                metadata: { columns: [categoryColumn, measureColumn] },
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: ['red', 'def'],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        min: 100000,
                        max: 200000,
                        values: [100000, 200000]
                    }])
                }
            };
            
            let builder = new ColumnChartBuilder(dataView);
            let builtDataView = builder.withShowAll().build();

            v.onDataChanged({ dataViews: [builtDataView] });

            setTimeout(() => {
                var points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'dataPoint' });
                expect(points.instances.length).toBe(3);
                expect(points.instances[1].displayName).toBe('red');
                expect(points.instances[1].selector.data).toEqual([categoryIdentities[0]]);
                expect(points.instances[1].selector.metadata).toBeUndefined();
                expect(points.instances[2].displayName).toBe('def');

                var points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'categoryAxis' });
                expect(points.instances.length).toBe(1);
                expect(points.instances[0].displayName).toBeUndefined();

                expect(points.instances[0].properties['start']).toBeUndefined();
                expect(points.instances[0].properties['end']).toBeUndefined();
                expect(points.instances[0].properties['axisType']).toBeUndefined();

                expect(points.instances[0].properties['show']).toBeDefined;
                expect(points.instances[0].properties['showAxisTitle']).toBeDefined;
                expect(points.instances[0].properties['axisStyle']).toBeDefined;

                done();
            }, DefaultWaitForRender);
        });
        
        it('enumerateObjectInstances: Verify category colors hidden', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("red"),
                mocks.dataViewScopeIdentity("def"),
            ];
            
            let dataView: powerbi.DataView = {
                metadata: { columns: [categoryColumn, measureColumn] },
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: ['red', 'def'],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        min: 100000,
                        max: 200000,
                        values: [100000, 200000]
                    }])
                }
            };
            
            let builder = new ColumnChartBuilder(dataView);
            let builtDataView = builder.withoutShowAll().build();

            v.onDataChanged({ dataViews: [builtDataView] });

            setTimeout(() => {
                var points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances(powerbi.visuals.columnChartProps.dataPoint.showAllDataPoints);
                expect(points.instances.length).toBe(1);
                done();
            }, DefaultWaitForRender);
        });

        it('enumerateObjectInstances: Verify instances on numerical category axis', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];
            
            let dataView: powerbi.DataView = {
                metadata: { columns: [measureColumn, measureColumn] },
                categorical: {
                    categories: [{
                        source: measureColumn,
                        values: [5000, 10000],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        min: 100000,
                        max: 200000,
                        values: [100000, 200000]
                    }])
                }
            };
            let builder = new ColumnChartBuilder(dataView);
            let builtDataView = builder.withShowAll().build();

            v.onDataChanged({ dataViews: [builtDataView] });

            setTimeout(() => {
                var points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'dataPoint' });
                expect(points.instances.length).toBe(3);
                expect(points.instances[1].displayName).toBe('$5000');
                expect(points.instances[1].selector.data).toEqual([categoryIdentities[0]]);
                expect(points.instances[1].selector.metadata).toBeUndefined();
                expect(points.instances[2].displayName).toBe('$10000');

                var points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'categoryAxis' });
                expect(points.instances.length).toBe(1);
                expect(points.instances[0].displayName).toBeUndefined();

                expect('start' in points.instances[0].properties).toBeTruthy();//better to check if the index key is found
                expect('end' in points.instances[0].properties).toBeTruthy();
                expect('axisType' in points.instances[0].properties).toBeTruthy();
                expect('show' in points.instances[0].properties).toBeTruthy();
                expect('showAxisTitle' in points.instances[0].properties).toBeTruthy();
                expect('axisStyle' in points.instances[0].properties).toBeTruthy();

                done();
            }, DefaultWaitForRender);
        });

        it('Verify axis scale type valid values is "Linear" when Start value is equal to zero', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [measureColumn, measureColumn],
                        objects: {
                            categoryAxis: {
                                start: 0,
                                end: 1
                            }
                        }
                    },
                    categorical: {
                        categories: [{
                            source: measureColumn,
                            values: [5000, 10000],
                            identity: categoryIdentities,
                        }]
                    }
                }]
            });

            setTimeout(() => {
                var points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'categoryAxis' });
                expect(points.instances[0].validValues["axisScale"][0]).toBe("linear");
                expect(points.instances[0].validValues["axisScale"][1]).toBeUndefined();
                done();
            }, DefaultWaitForRender);
        });

        it('Verify axis scale type valid values is "Linear" when Ends value is equal to zero', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [measureColumn, measureColumn],
                        objects: {
                            categoryAxis: {
                                start: 1,
                                end: 0
                            }
                        }
                    },
                    categorical: {
                        categories: [{
                            source: measureColumn,
                            values: [5000, 10000],
                            identity: categoryIdentities,
                        }]
                    }
                }]
            });

            setTimeout(() => {
                var points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'categoryAxis' });
                expect(points.instances[0].validValues["axisScale"][0]).toBe("linear");
                expect(points.instances[0].validValues["axisScale"][1]).toBeUndefined();
                done();
            }, DefaultWaitForRender);
        });

        it('Verify axis scale type valid values are "Linear" and "Log" when start and end are above zero', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [measureColumn, measureColumn],
                        objects: {
                            categoryAxis: {
                                start: 1,
                                end: 2
                            }
                        }
                    },
                    categorical: {
                        categories: [{
                            source: measureColumn,
                            values: [5000, 10000],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: measureColumn,
                            min: 100000,
                            max: 200000,
                            values: [100000, 200000]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                var points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'categoryAxis' });
                expect(points.instances[0].validValues["axisScale"][0]).toBe("linear");
                expect(points.instances[0].validValues["axisScale"][1]).toBe("log");
                done();
            }, DefaultWaitForRender);
        });

        it('enumerateObjectInstances: category+multi-measure', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("red"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [categoryColumn, measureColumn] },
                    categorical: {
                        categories: [{
                            source: categoryColumn,
                            values: ['red', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: measureColumn,
                                min: 100000,
                                max: 200000,
                                values: [100000, 200000]
                            }, {
                                source: measure2Column,
                                min: 150,
                                max: 250,
                                values: [150, 250]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                var points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'dataPoint' });
                expect(points.instances.length).toBe(2);
                expect(points.instances[0].displayName).toBe(measureColumn.displayName);
                expect(points.instances[0].selector).toEqual({ metadata: measureColumn.queryName });
                expect(points.instances[1].displayName).toBe(measure2Column.displayName);
                expect(points.instances[1].selector).toEqual({ metadata: measure2Column.queryName });

                done();
            }, DefaultWaitForRender);
        });

        it('enumerateObjectInstances: single-measure (no category)', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [categoryColumn, measureColumn] },
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: measureColumn,
                                values: [100000]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                var points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'dataPoint' });
                expect(points.instances.length).toBe(1);
                expect(points.instances[0].displayName).toBe(measureColumn.displayName);
                expect(points.instances[0].selector).toEqual({ metadata: measureColumn.queryName });

                done();
            }, DefaultWaitForRender);
        });

        it('enumerateObjectInstances: label settings per series where container visible and collapsed', (done) => {
            v = new ColumnChartVisualBuilder(ColumnChartType.stackedColumn).build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [categoryColumn, measureColumn, measure2Column],
                        objects: {
                            labels: {
                                show: true,
                                showAll: true,
                            }
                        }
                    },
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: measureColumn,
                                values: [100000]
                            }, {
                                source: measure2Column,
                                values: [200000]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                var points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'labels' });
                
                //expect 3 instances - 1 label settings + 2 containers
                expect(points.instances.length).toBe(3);
                expect(points.containers.length).toBe(2);
                expect(points.instances[0].containerIdx).toBeUndefined();
                expect(points.instances[1].containerIdx).toBe(0);
                expect(points.instances[2].containerIdx).toBe(1);
                done();
            }, DefaultWaitForRender);
        });

        it('enumerateObjectInstances: label settings per series where container not visible', (done) => {
            v = new ColumnChartVisualBuilder(ColumnChartType.stackedColumn).build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [categoryColumn, measureColumn, measure2Column],
                        objects: {
                            labels: {
                                show: true,
                                showAll: false,
                            }
                        }
                    },
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: measureColumn,
                                values: [100000]
                            }, {
                                source: measure2Column,
                                values: [200000]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                var points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'labels' });
                expect(points.instances.length).toBe(1);
                expect(points.containers).not.toBeDefined();
                done();
            }, DefaultWaitForRender);
        });

        it('enumerateObjectInstances: label settings per series where container visible and expanded', (done) => {
            let expandedSeries = Prototype.inherit(measureColumn);
            expandedSeries.objects = { labels: { expander: true } };

            v = new ColumnChartVisualBuilder(ColumnChartType.stackedColumn).build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [categoryColumn, expandedSeries, measure2Column],
                        objects: {
                            labels: {
                                show: true,
                                showAll: true,
                            }
                        }
                    },
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: expandedSeries,
                                values: [100000]
                            }, {
                                source: measure2Column,
                                values: [200000]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                let points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'labels' });
                expect(points.instances.length).toBe(3);
                expect(points.containers.length).toBe(2);
                done();
            }, DefaultWaitForRender);
        });

        it('enumerateObjectInstances: label settings per series where settings modified', (done) => {
            var expandedSeries = Prototype.inherit(measureColumn);
            expandedSeries.objects = { labels: { expander: true, show: false } };

            v = new ColumnChartVisualBuilder(ColumnChartType.stackedColumn).build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [categoryColumn, expandedSeries, measure2Column],
                        objects: {
                            labels: {
                                show: true,
                                showAll: true,
                            }
                        }
                    },
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: expandedSeries,
                                values: [100000]
                            }, {
                                source: measure2Column,
                                values: [200000]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                var points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'labels' });
                expect(points.instances.length).toBe(3);
                expect(points.containers.length).toBe(2);
                done();
            }, DefaultWaitForRender);
        });

        it('enumerateObjectInstances: before onDataChanged is called)', (done) => {
            var expandedSeries = Prototype.inherit(measureColumn);
            expandedSeries.objects = { labels: { expander: true, show: false } };

            v = new powerbi.visuals.CartesianChart({
                chartType: powerbi.visuals.CartesianChartType.StackedColumn,
                isScrollable: true,
                tooltipsEnabled: true,
                animator: new powerbi.visuals.WebColumnChartAnimator(),
                behavior: new powerbi.visuals.CartesianChartBehavior([new powerbi.visuals.ColumnChartWebBehavior()]),
            });
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });

            setTimeout(() => {
                <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'labels' });
                // Just need to validate there is no exception
                done();
            }, DefaultWaitForRender);
        });
    });

    describe("Column chart labels", () => {
        let v: powerbi.IVisual, element: JQuery;
        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
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
                }
            ],
        };
        let hostServices = powerbitests.mocks.createVisualHostServices();
        beforeEach(() => {
            element = powerbitests.helpers.testDom('800', '800');
            v = new ColumnChartVisualBuilder(ColumnChartType.stackedColumn).build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
        });

        it('Check margins for long labels, when you have a few columns that do not take up the whole width, and get centered', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("this is the label that never ends, it just goes on and on my friends. Some axis started rendering it not knowing what it was, and now it keeps on rendering forever just because this the label that never ends..."),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['this is the label that never ends, it just goes on and on my friends. Some axis started rendering it not knowing what it was, and now it keeps on rendering forever just because this the label that never ends...',
                                'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                
                //expect($('.columnChart .axisGraphicsContext').attr('transform')).toBe('translate(36,8)');
                done();
            }, DefaultWaitForRender);
        });
    });

    describe("BarChart Interactivity", () => {
        let v: powerbi.IVisual, element: JQuery;
        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
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
                }
            ],
        };
        let DefaultOpacity: string = "" + ColumnUtil.DefaultOpacity;
        let DimmedOpacity: string = "" + ColumnUtil.DimmedOpacity;

        beforeEach(() => {

            element = powerbitests.helpers.testDom('200', '300');
            v = new ColumnChartVisualBuilder(ColumnChartType.stackedBar).build();
        });

        it('Bar chart with dragDataPoint enabled', () => {
            let hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { dragDataPoint: true },
            });

            let dataViewScopeIdentity2 = mocks.dataViewScopeIdentity('b');
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                                dataViewScopeIdentity2,
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0]
                        }])
                    }
                }]
            });

            let bars = element.find('.bar');
            expect(bars.length).toBe(2);

            spyOn(hostServices, 'onDragStart').and.callThrough();

            let trigger = powerbitests.helpers.getDragStartTriggerFunctionForD3(bars[1]);

            let mockEvent = {
                abc: 'def',
                stopPropagation: () => { },
            };
            trigger(mockEvent);

            expect(hostServices.onDragStart).toHaveBeenCalledWith({
                event: mockEvent,
                data: {
                    data: {
                        metadata: 'col2',
                        data: [dataViewScopeIdentity2]
                    }
                }
            });
        });

        it('Bar chart without dragDataPoint enabled', () => {
            let hostServices = mocks.createVisualHostServices();
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

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                                mocks.dataViewScopeIdentity('b'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0]
                        }])
                    }
                }]
            });

            let bars = element.find('.bar');
            expect(bars.length).toBe(2);

            let trigger = powerbitests.helpers.getDragStartTriggerFunctionForD3(bars[1]);
            expect(trigger).not.toBeDefined();
        });

        it('Bar chart without selection enabled', () => {
            let hostServices = mocks.createVisualHostServices();
            v = new ColumnChartVisualBuilder(ColumnChartType.stackedBar).forMobile().build();
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

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                                mocks.dataViewScopeIdentity('b'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0]
                        }])
                    }
                }]
            });

            let bars = element.find('.bar');
            expect(bars.length).toBe(2);

            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);

            helpers.clickElement(bars.eq(0));

            // No change in styling
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
        });

        it('Bar chart multi-selection', () => {
            let hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { selection: true },
            });

            let identities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
                mocks.dataViewScopeIdentity('c'),
                mocks.dataViewScopeIdentity('d'),
                mocks.dataViewScopeIdentity('e'),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: identities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            let bars = element.find('.bar');
            expect(bars.length).toBe(5);

            spyOn(hostServices, 'onSelect').and.callThrough();

            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);

            helpers.clickElement(bars.eq(0));
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    visualObjects: [
                        {
                            objectName: 'dataPoint',
                            selectorsByColumn:
                            {
                                dataMap: buildSelectorForColumn('col1', identities[0]),
                                metadata: 'col2',
                            },
                        }
                    ]
                });

            helpers.clickElement(bars.eq(3));
            //expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    visualObjects: [
                        {
                            objectName: 'dataPoint',
                            selectorsByColumn:
                            {
                                dataMap: buildSelectorForColumn('col1', identities[0]),
                                metadata: 'col2',
                            }
                        }
                    ]
                });
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    visualObjects: [
                        {
                            objectName: 'dataPoint',
                            selectorsByColumn:
                            {
                                dataMap: buildSelectorForColumn('col1', identities[3]),
                                metadata: 'col2',
                            }
                        }
                    ]
                });
        });

        it('Bar chart repeated single selection', () => {
            let hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { selection: true },
            });

            let identities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
                mocks.dataViewScopeIdentity('c'),
                mocks.dataViewScopeIdentity('d'),
                mocks.dataViewScopeIdentity('e'),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: identities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            let bars = element.find('.bar');
            expect(bars.length).toBe(5);

            spyOn(hostServices, 'onSelect').and.callThrough();

            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);

            helpers.clickElement(bars.eq(0));
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    visualObjects: [
                        {
                            objectName: 'dataPoint',
                            selectorsByColumn:
                            {
                                dataMap: buildSelectorForColumn('col1', identities[0]),
                                metadata: 'col2',
                            }
                        }
                    ]
                });

            helpers.clickElement(bars.eq(3));
            expect(bars[0].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    visualObjects: [
                        {
                            objectName: 'dataPoint',
                            selectorsByColumn:
                            {
                                dataMap: buildSelectorForColumn('col1', identities[3]),
                                metadata: 'col2',
                            }
                        }
                    ]
                });

            helpers.clickElement(bars.eq(3));
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    visualObjects: []
                });
        });

        it('Bar chart context menu', () => {
            let hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { selection: true },
            });

            let identities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
                mocks.dataViewScopeIdentity('c'),
                mocks.dataViewScopeIdentity('d'),
                mocks.dataViewScopeIdentity('e'),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: identities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            let bars = element.find('.bar');
            expect(bars.length).toBe(5);
            
            spyOn(hostServices, 'onContextMenu').and.callThrough();

            bars.eq(0).d3ContextMenu(5, 15);
            expect(hostServices.onContextMenu).toHaveBeenCalledWith(
                {
                    data: [
                        {
                            dataMap: buildSelectorForColumn('col1', identities[0]),
                            metadata: 'col2',
                        }
                    ],
                    position: { x: 5, y: 15 }
                });
        });

        it('Bar chart single and multi selection', () => {
            let hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { selection: true },
            });

            let identities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
                mocks.dataViewScopeIdentity('c'),
                mocks.dataViewScopeIdentity('d'),
                mocks.dataViewScopeIdentity('e'),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: identities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            let bars = element.find('.bar');
            expect(bars.length).toBe(5);

            spyOn(hostServices, 'onSelect').and.callThrough();

            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);

            helpers.clickElement(bars.eq(0), false);
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    visualObjects: [
                        {
                            objectName: 'dataPoint',
                            selectorsByColumn:
                            {
                                dataMap: buildSelectorForColumn('col1', identities[0]),
                                metadata: 'col2',
                            }
                        }
                    ]
                });

            helpers.clickElement(bars.eq(3), true);
            expect(bars[0].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    visualObjects: [
                        {
                            objectName: 'dataPoint',
                            selectorsByColumn:
                            {
                                dataMap: buildSelectorForColumn('col1', identities[0]),
                                metadata: 'col2',
                            }
                        }
                    ]
                });
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    visualObjects: [
                        {
                            objectName: 'dataPoint',
                            selectorsByColumn:
                            {
                                dataMap: buildSelectorForColumn('col1', identities[3]),
                                metadata: 'col2',
                            }
                        }
                    ]
                });

            helpers.clickElement(bars.eq(3), false);
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    visualObjects: [
                        {
                            objectName: 'dataPoint',
                            selectorsByColumn:
                            {
                                dataMap: buildSelectorForColumn('col1', identities[3]),
                                metadata: 'col2',
                            }
                        }
                    ]
                });

            helpers.clickElement(bars.eq(1), true);
            expect(bars[0].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    visualObjects: [
                        {
                            objectName: 'dataPoint',
                            selectorsByColumn:
                            {
                                dataMap: buildSelectorForColumn('col1', identities[3]),
                                metadata: 'col2',
                            }
                        }
                    ]
                });
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    visualObjects: [
                        {
                            objectName: 'dataPoint',
                            selectorsByColumn:
                            {
                                dataMap: buildSelectorForColumn('col1', identities[1]),
                                metadata: 'col2',
                            }
                        }
                    ]
                });

            helpers.clickElement(bars.eq(4), false);
            expect(bars[0].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    visualObjects: [
                        {
                            objectName: 'dataPoint',
                            selectorsByColumn:
                            {
                                dataMap: buildSelectorForColumn('col1', identities[4]),
                                metadata: 'col2',
                            }
                        }
                    ]
                });
        });

        it('Bar chart external clear selection', () => {
            let hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { selection: true },
            });

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                                mocks.dataViewScopeIdentity('b'),
                                mocks.dataViewScopeIdentity('c'),
                                mocks.dataViewScopeIdentity('d'),
                                mocks.dataViewScopeIdentity('e'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            let bars = element.find('.bar');
            expect(bars.length).toBe(5);

            spyOn(hostServices, 'onSelect').and.callThrough();

            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);

            helpers.clickElement(bars.eq(0));
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);

            v.onClearSelection();
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);
        });

        it('Bar clear selection on clearCatcher click', () => {
            let hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { selection: true },
            });

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                                mocks.dataViewScopeIdentity('b'),
                                mocks.dataViewScopeIdentity('c'),
                                mocks.dataViewScopeIdentity('d'),
                                mocks.dataViewScopeIdentity('e'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            let bars = element.find('.bar');
            expect(bars.length).toBe(5);

            spyOn(hostServices, 'onSelect').and.callThrough();

            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);

            helpers.clickElement(bars.eq(0));
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);

            helpers.clickElement($('.clearCatcher'));
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);

            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    visualObjects: []
                });
        });
    });

    function columnChartInteractivity(
        chartType: ColumnChartType,
        columnSelector: string,
        thirdColumnXCoordinateToClick: number,
        thirdColumnYCoordinateToClick: number) {

        let categoryColumnDate: powerbi.DataViewMetadataColumn = { displayName: 'date', queryName: 'selectDate', type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Date), roles: { Category: true } };
        let measure2Column: powerbi.DataViewMetadataColumn = { displayName: 'tax', queryName: 'selectTax', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y: true } };
        let measure3Column: powerbi.DataViewMetadataColumn = { displayName: 'profit', queryName: 'selectProfit', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), roles: { Y: true } };

        let hostServices = powerbitests.mocks.createVisualHostServices();
        let v: powerbi.IVisual, element: JQuery;
        let hexDefaultColorRed = "#ff0000";
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
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer),
                    roles: { Y: true }
                }],

            objects: { dataPoint: { defaultColor: { solid: { color: hexDefaultColorRed } } } }
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = new ColumnChartVisualBuilder(chartType).forMobile().build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: true },
                animation: { transitionImmediate: true },
            });

            let categories = ['a', 'b', 'c', 'd', 'e'];
            let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: categories,
                            identity: _.map(categories, (c) => mocks.dataViewScopeIdentityWithEquality(categoryColumnRef, c)),
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
        });

        it('Drag and click interaction validation', () => {

            // drag and click on chart (not on bar) are implemented the same
            let barChart = (<any>v).layers[0];

            spyOn(barChart, 'selectColumn').and.callThrough();

            // click on the graph, expect selectColumn to have been called
            $('.mainGraphicsContext').d3Click(thirdColumnXCoordinateToClick, thirdColumnYCoordinateToClick);
            expect(barChart.selectColumn).toHaveBeenCalled();

            // now, instead of clicking on the graph, which can be unstable due to different user's configurations
            // we will validate that the code knows how to deal with such a click
            let selectedIndex = barChart.columnChart.getClosestColumnIndex(thirdColumnXCoordinateToClick, thirdColumnYCoordinateToClick);

            let expectedSelectedIndex = 2;
            expect(selectedIndex).toBe(expectedSelectedIndex);
        });

        it('Columns Opacity validation', (done) => {
            let barChart = (<any>v).layers[0];
            let selectedIndex = 2;
            barChart.selectColumn(selectedIndex);
            SVGUtil.flushAllD3TransitionsIfNeeded({ transitionImmediate: true });
            setTimeout(() => {
                let allRects = d3.selectAll('.bar' + columnSelector);
                expect(allRects).not.toBeEmpty();
                allRects.each((data, index) => {
                    if (data.categoryIndex === selectedIndex) {
                        expect(parseFloat(($(allRects[0]).eq(index)).css('fill-opacity'))).toBeCloseTo(ColumnUtil.DefaultOpacity, 0);
                    }
                    else {
                        expect(parseFloat(($(allRects[0]).eq(index)).css('fill-opacity'))).toBeCloseTo(ColumnUtil.DimmedOpacity, 1);
                    }
                });
                done();
            }, DefaultWaitForRender);
        });

        it('Update legend is not called twice on same column', () => {
            let barChart = (<any>v).layers[0];
            let cartesianVisualHost = barChart.cartesianVisualHost;
            spyOn(cartesianVisualHost, 'updateLegend').and.callThrough();

            // last column is selected. try to select it again
            barChart.selectColumn(4);
            
            // update legend should not be called again
            expect(cartesianVisualHost.updateLegend).not.toHaveBeenCalled();
        });

        it('Legend validation', () => {
            let barChart = (<any>v).layers[0];

            // trigger select column
            barChart.selectColumn(2);

            // verify legend was changed to correct values
            let legend = $('.interactive-legend');
            let title = legend.find('.title');
            let item = legend.find('.item');
            let hoverLine = $('.interactive-hover-line');

            expect(legend.length).toBe(1);
            expect(title.text().trim()).toBe('c');

            expect(item.find('.itemName').text()).toBe('col2');
            expect(item.find('.itemMeasure').text().trim()).toBe('490000');
            helpers.assertColorsMatch(item.find('.icon').css('color'), hexDefaultColorRed);
            expect(hoverLine.length).toBe(1);
        });

        it('Hover line start point is at last data point', () => {      
            let barChart = (<any>v).layers[0];
            spyOn(barChart, 'selectColumn').and.callThrough();
            
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

            expect(barChart.selectColumn).toHaveBeenCalledWith(4,true);
        });

        it('Hover line start point is at last data point - multiple series with jagged categories', () => {
            let metadata: powerbi.DataViewMetadata = {
                columns: [categoryColumnDate, measure2Column, measure3Column]
            };

            let objects: DataViewObjects = {
                categoryAxis: {
                    axisType: 'Scalar',
                }
            };
            metadata.objects = objects;

            let valueColumns = DataViewTransform.createValueColumns([
                {
                    source: metadata.columns[1],
                    values: [1, null, 3, null, 7],
                },
                {
                    source: metadata.columns[2],
                    values: [null, 2, null, 4, null],
                }]);

            let barChart = (<any>v).layers[0];
            spyOn(barChart, 'selectColumn').and.callThrough();

            v.onDataChanged({
                dataViews: [{
                    metadata: metadata,
                    categorical: {
                        categories: [{
                            source: metadata.columns[0],
                            values: [new Date(2011), new Date(2012), new Date(2013), new Date(2014), new Date(2015)]
                        }],
                        values: valueColumns
                    }
                }]
            });

            expect(barChart.selectColumn).toHaveBeenCalledWith(4, true);
        });
    }

    let x = 250, y = 200;
    describe("Stacked Bar Chart Interactivity", () => columnChartInteractivity(ColumnChartType.stackedBar, '.bar', x, y));
    describe("Clustered Bar Chart Interactivity", () => columnChartInteractivity(ColumnChartType.clusteredBar, '.bar', x, y));
    describe("Hundred Percent Stacked Bar Chart Interactivity", () => columnChartInteractivity(ColumnChartType.hundredPercentStackedBar, '.bar', x, y));
    describe("Stacked Column Chart Interactivity", () => columnChartInteractivity(ColumnChartType.stackedColumn, '.column', x, y));
    describe("Clustered Column Chart Interactivity", () => columnChartInteractivity(ColumnChartType.clusteredColumn, '.column', x, y));
    describe("Hundred Percent Stacked Column Chart Interactivity", () => columnChartInteractivity(ColumnChartType.hundredPercentStackedColumn, '.column', x, y));

    function columnChartWebAnimations(chartType: ColumnChartType) {
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let v: powerbi.IVisual, element: JQuery;
        let dataViewMetadataThreeColumn: powerbi.DataViewMetadataColumn[] = [
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
            }
        ];
        function metadata(columns): powerbi.DataViewMetadata {
            let metadata: powerbi.DataViewMetadata = {
                columns: columns
            };

            return metadata;
        }

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = new ColumnChartVisualBuilder(chartType).withAnimator().build();
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

        it('highlight Animation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            let dataViewNoHighlights = {
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                            }])
                    }
                }]
            };
            let dataViewHighlightsA = {
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [54, 204],
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [6, 66],
                            }])
                    }
                }]
            };
            let dataViewHighlightsB = {
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [120, 10],
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [8, 20],
                            }])
                    }
                }]
            };

            let animator = <powerbi.visuals.WebColumnChartAnimator>(<CartesianChart>v).animator;
            spyOn(animator, 'animate').and.callThrough();

            v.onDataChanged(dataViewNoHighlights);
            v.onDataChanged(dataViewHighlightsA);
            v.onDataChanged(dataViewHighlightsB);
            v.onDataChanged(dataViewNoHighlights);

            expect(animator).toBeTruthy();
            expect(animator.animate).toHaveBeenCalled();

            done();
        });

        it('highlight Animation - suppressAnimations', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            let dataViewNoHighlights = {
                suppressAnimations: true,
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                            }])
                    }
                }]
            };
            let dataViewHighlightsA = {
                suppressAnimations: true,
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [54, 204],
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [6, 66],
                            }])
                    }
                }]
            };
            let dataViewHighlightsB = {
                suppressAnimations: true,
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [120, 10],
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [8, 20],
                            }])
                    }
                }]
            };

            let animator = <powerbi.visuals.WebColumnChartAnimator>(<CartesianChart>v).animator;
            spyOn(animator, 'animate').and.callThrough();

            v.onDataChanged(dataViewNoHighlights);
            v.onDataChanged(dataViewHighlightsA);
            v.onDataChanged(dataViewHighlightsB);
            v.onDataChanged(dataViewNoHighlights);

            expect(animator).toBeTruthy();
            expect(animator.animate).not.toHaveBeenCalled();

            done();
        });
        
        it('Animation - categorical with many data points', () => {
            let values = _.range(0, 1001);
            let highlights = _.map(values, (v) => v / 2);
            let categories = _.map(values, (v) => 'category' + v);
            let categoryIdentities = _.map(categories, (c) => mocks.dataViewScopeIdentity(c));

            let metadataColumns: powerbi.DataViewMetadataColumn[] = [
                {
                    displayName: 'category',
                    queryName: 'category',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                    roles: { ['Category']: true },
                }, {
                    displayName: 'values',
                    queryName: 'values',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { ['Y']: true },
                }
            ];

            let dataViewNoHighlights = {
                dataViews: [{
                    metadata: metadata(metadataColumns),
                    categorical: {
                        categories: [{
                            source: metadataColumns[0],
                            values: categories,
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: metadataColumns[1],
                                values: values,
                            }])
                    }
                }]
            };
            
            let dataViewWithHighlights = {
                dataViews: [{
                    metadata: metadata(metadataColumns),
                    categorical: {
                        categories: [{
                            source: metadataColumns[0],
                            values: categories,
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: metadataColumns[1],
                                values: values,
                                highlights: highlights,
                            }])
                    }
                }]
            };

            // Render something to animate from
            v.onDataChanged(dataViewNoHighlights);
            v.onDataChanged(dataViewNoHighlights);
            
            let animator = <powerbi.visuals.WebColumnChartAnimator>(<CartesianChart>v).animator;
            let animateSpy = jasmine.createSpy('animate');
            let originalAnimate = animator.animate;
            animator.animate = animateSpy;

            animateSpy.and.callFake((options: powerbi.visuals.ColumnChartAnimationOptions) => {
                expect(options.viewModel.categories.length).toBeLessThan(100);

                let returnValue = originalAnimate.call(animator, options);
                expect(returnValue.failed).toBe(false);

                return returnValue;
            });
            v.onDataChanged(dataViewWithHighlights);
        });

        it('Animation - scalar with many data points', () => {
            let values = _.range(0, 1001);
            let highlights = _.map(values, (v) => v / 2);
            let categories = _.map(values, (v) => v);
            let categoryIdentities = _.map(categories, (c) => mocks.dataViewScopeIdentity(c));

            let metadataColumns: powerbi.DataViewMetadataColumn[] = [
                {
                    displayName: 'category',
                    queryName: 'category',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { ['Category']: true },
                }, {
                    displayName: 'values',
                    queryName: 'values',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { ['Y']: true },
                }
            ];

            let dataViewNoHighlights = {
                dataViews: [{
                    metadata: metadata(metadataColumns),
                    categorical: {
                        categories: [{
                            source: metadataColumns[0],
                            values: categories,
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: metadataColumns[1],
                                values: values,
                            }])
                    }
                }]
            };

            let dataViewWithHighlights = {
                dataViews: [{
                    metadata: metadata(metadataColumns),
                    categorical: {
                        categories: [{
                            source: metadataColumns[0],
                            values: categories,
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: metadataColumns[1],
                                values: values,
                                highlights: highlights,
                            }])
                    }
                }]
            };

            // Render something to animate from
            v.onDataChanged(dataViewNoHighlights);
            v.onDataChanged(dataViewNoHighlights);

            let animator = <powerbi.visuals.WebColumnChartAnimator>(<CartesianChart>v).animator;
            let animateSpy = jasmine.createSpy('animate');
            let originalAnimate = animator.animate;
            animator.animate = animateSpy;

            animateSpy.and.callFake((options: powerbi.visuals.ColumnChartAnimationOptions) => {
                expect(options.viewModel.categories.length).toBe(1001);

                let returnValue = originalAnimate.call(animator, options);
                expect(returnValue.failed).toBe(true);

                return returnValue;
            });
            v.onDataChanged(dataViewWithHighlights);
        });
    }

    describe("Stacked Bar Chart Web Animations", () => columnChartWebAnimations(ColumnChartType.stackedBar));
    describe("Clustered Bar Chart Web Animations", () => columnChartWebAnimations(ColumnChartType.clusteredBar));
    describe("Hundred Percent Stacked Bar Chart Web Animations", () => columnChartWebAnimations(ColumnChartType.hundredPercentStackedBar));
    describe("Stacked Column Chart Web Animations", () => columnChartWebAnimations(ColumnChartType.stackedColumn));
    describe("Clustered Column Chart Web Animations", () => columnChartWebAnimations(ColumnChartType.clusteredColumn));
    describe("Hundred Percent Stacked Column Chart Web Animations", () => columnChartWebAnimations(ColumnChartType.hundredPercentStackedColumn));

    it('tooltip has category formatted date values', () => {
        let categoryColumn: powerbi.DataViewMetadataColumn = { displayName: 'year', queryName: 'selectYear', type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Date), objects: { general: { formatString: "d" } }, roles: { Category: true } };
        let measureColumn: powerbi.DataViewMetadataColumn = { displayName: 'sales', queryName: 'selectSales', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer), roles: { Y: true } };

        let categoryIdentities = [
            mocks.dataViewScopeIdentity("2011"),
            mocks.dataViewScopeIdentity("2012"),
        ];

        let dataView: powerbi.DataView = {
            metadata: null,
            categorical: {
                categories: [{
                    source: categoryColumn,
                    values: [new Date(2011, 4, 31), new Date(2012, 6, 30)],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([{
                    source: measureColumn,
                    values: [100, -200]
                }])
            }
        };
        let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

        let data = ColumnChart.converter(dataView, colors);
        let selectionIds: SelectionId[] = [
            SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[0], measureColumn.queryName, categoryColumn.queryName),
            SelectionId.createWithIdAndMeasureAndCategory(categoryIdentities[1], measureColumn.queryName, categoryColumn.queryName)];
        let legendItems = data.legendData.dataPoints;
        let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultColumnLabelSettings(false);

        let item = [{
            displayName: 'sales', key: 'series0', index: 0, labelSettings: data.series[0].labelSettings, data: [
                {
                    categoryValue: new Date(2011, 4, 31).getTime(),
                    value: 100,
                    position: 100,
                    valueAbsolute: 100,
                    valueOriginal: 100,
                    seriesIndex: 0,
                    categoryIndex: 0,
                    color: legendItems[0].color,
                    selected: false,
                    originalValue: 100,
                    originalPosition: 100,
                    originalValueAbsolute: 100,
                    identity: selectionIds[0],
                    key: selectionIds[0].getKey(),
                    tooltipInfo: [{ displayName: "year", value: "5/31/2011" }, { displayName: "sales", value: "100" }],
                    labelFill: undefined,
                    labelFormatString: undefined,
                    lastSeries: undefined, chartType: undefined,
                    labelSettings: defaultLabelSettings,
                },
                {
                    categoryValue: new Date(2012, 6, 30).getTime(),
                    value: -200,
                    position: 0,
                    valueAbsolute: 200,
                    valueOriginal: -200,
                    seriesIndex: 0,
                    categoryIndex: 1,
                    color: legendItems[0].color,
                    selected: false,
                    originalValue: -200,
                    originalPosition: 0,
                    originalValueAbsolute: 200,
                    identity: selectionIds[1],
                    key: selectionIds[1].getKey(),
                    tooltipInfo: [{ displayName: "year", value: "7/30/2012" }, { displayName: "sales", value: "-200" }],
                    labelFill: undefined,
                    labelFormatString: undefined,
                    lastSeries: undefined,
                    chartType: undefined,
                    labelSettings: defaultLabelSettings,
                }], identity: SelectionId.createWithMeasure("selectSales"), color: legendItems[0].color
        }];

        expect(data.series).toEqual(item);
        expect(AxisHelper.createValueDomain(data.series, true)).toEqual([-200, 100]);
        expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
            min: -200,
            max: 100
        });
    });

    it('tooltip has legend formatted date values', () => {
        let categoryColumn: powerbi.DataViewMetadataColumn = { displayName: 'year', queryName: 'selectYear', type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Date), objects: { general: { formatString: "d" } }, groupName: 'group', roles: { Category: true } };
        let measureColumn: powerbi.DataViewMetadataColumn = { displayName: 'sales', queryName: 'selectSales', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer), objects: { general: { formatString: "\$#,0.###############;(\$#,0.###############);\$#,0.###############" } }, roles: { Y: true } };

        let categoryIdentities = [
            mocks.dataViewScopeIdentity("2011"),
            mocks.dataViewScopeIdentity("2012"),
        ];

        let dataView: powerbi.DataView = {
            metadata: null,
            categorical: {
                categories: [{
                    source: categoryColumn,
                    values: [new Date(2011, 4, 31), new Date(2012, 6, 30)],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([{
                    source: measureColumn,
                    values: [100, -200]
                }])
            }
        };
        let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

        let data = ColumnChart.converter(dataView, colors);

        expect(data.series[0].data[0].tooltipInfo).toEqual([{ displayName: "year", value: "5/31/2011" }, { displayName: "sales", value: "$100" }]);
        expect(data.series[0].data[1].tooltipInfo).toEqual([{ displayName: "year", value: "7/30/2012" }, { displayName: "sales", value: "($200)" }]);
    });

    function getChartWithTooManyValues(chartType: ColumnChartType, element: JQuery): powerbi.IVisual {
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let v: powerbi.IVisual;
        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
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
                }
            ],
        };

        v = new ColumnChartVisualBuilder(chartType).build();

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
        let categoryIdentities = [
            mocks.dataViewScopeIdentity("a"),
            mocks.dataViewScopeIdentity("b"),
            mocks.dataViewScopeIdentity("c"),
            mocks.dataViewScopeIdentity("d"),
            mocks.dataViewScopeIdentity("e"),
            mocks.dataViewScopeIdentity("f"),
            mocks.dataViewScopeIdentity("g"),
            mocks.dataViewScopeIdentity("h"),
            mocks.dataViewScopeIdentity("i"),
            mocks.dataViewScopeIdentity("j"),
            mocks.dataViewScopeIdentity("k"),
            mocks.dataViewScopeIdentity("l"),
            mocks.dataViewScopeIdentity("m"),
            mocks.dataViewScopeIdentity("n"),
            mocks.dataViewScopeIdentity("o"),
            mocks.dataViewScopeIdentity("p"),
            mocks.dataViewScopeIdentity("q"),
            mocks.dataViewScopeIdentity("r"),
            mocks.dataViewScopeIdentity("s"),
            mocks.dataViewScopeIdentity("t"),
        ];
        v.onDataChanged({
            dataViews: [{
                metadata: dataViewMetadataTwoColumn,
                categorical: {
                    categories: [{
                        source: dataViewMetadataTwoColumn.columns[0],
                        values: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataTwoColumn.columns[1],
                        min: 10,
                        max: 29,
                        subtotal: 390,
                        values: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
                    }])
                }
            }]
        });

        return v;
    }

    function barChartScrollbarValidation(chartType: ColumnChartType, columnSelector: string) {
        let element: JQuery;
        let v: powerbi.IVisual;

        beforeEach(() => {
            element = powerbitests.helpers.testDom('140', '140');
            v = getChartWithTooManyValues(chartType, element);
        });

        it('DOM Validation', (done) => {
            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('rect' + columnSelector).length).toBe(4);
                expect($('rect.extent').length).toBe(1);
                expect($('rect' + columnSelector)[3].attributes.getNamedItem('y').value).toBeLessThan(element.height());
                let transform = SVGUtil.parseTranslateTransform(helpers.getAxisTicks('y').last().attr('transform'));
                expect(transform.y).toBeLessThan(element.height());
                expect(transform.x).toBe('0');
                expect($('.brush').attr('transform')).toBe('translate(130,8)');
                expect(parseInt($('.brush .extent')[0].attributes.getNamedItem('height').value, 0)).toBeGreaterThan(8);
                expect($('.brush .extent')[0].attributes.getNamedItem('y').value).toBe('0');

                v.onResizing({ height: 500, width: 500 });
                expect($('.brush')).not.toBeInDOM();
                done();
            }, DefaultWaitForRender);
        });

        it('should have correct tick labels after scrolling', (done) => {
            setTimeout(() => {
                let ticks = helpers.getAxisTicks('y');
                let tickCount = ticks.length;

                let startIndex = 10;
                let expectedValues = _.range(0, tickCount).map(i => String.fromCharCode('a'.charCodeAt(0) + startIndex + i));

                powerbitests.helpers.runWithImmediateAnimationFrames(() => {
                    (<powerbi.visuals.CartesianChart>v).scrollTo(startIndex);

                    setTimeout(() => {
                        ticks = helpers.getAxisTicks('y');
                        let tickValues = _.map(ticks.get(), (v) => $(v).clone().find('title').remove().end().text());

                        expect(tickValues).toEqual(expectedValues);

                        done();
                    }, DefaultWaitForRender);
                });
            }, DefaultWaitForRender);
        });
    }

    describe("Bar chart scrollbar", () => barChartScrollbarValidation(ColumnChartType.stackedBar, '.bar'));
    describe("ClusteredBarChart scrollbar", () => barChartScrollbarValidation(ColumnChartType.clusteredBar, '.bar'));

    function columnChartScrollbarValidation(chartType: ColumnChartType, columnSelector: string) {
        let element: JQuery;
        let v: powerbi.IVisual;

        beforeEach(() => {
            element = powerbitests.helpers.testDom('140', '140');
            v = getChartWithTooManyValues(chartType, element);
        });

        it('DOM Validation', (done) => {
            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('rect' + columnSelector).length).toBe(5);
                expect($('rect.extent').length).toBe(1);
                expect($('rect' + columnSelector)[3].attributes.getNamedItem('x').value).toBeLessThan(element.width());
                let transform = SVGUtil.parseTranslateTransform(helpers.getAxisTicks('x').last().attr('transform'));
                expect(transform.y).toBe('0');
                expect(transform.x).toBeLessThan(element.width());

                // Windows and Mac OS differ
                expect(powerbitests.helpers.isTranslateCloseTo($('.brush').attr('transform'), 22, 130)).toBe(true);
                let width = parseInt($('.brush .extent')[0].attributes.getNamedItem('width').value, 10);
                
                // Windows and Mac OS differ
                expect(powerbitests.helpers.isInRange(width, 23, 25)).toBe(true);
                expect($('.brush .extent')[0].attributes.getNamedItem('x').value).toBe('0');
                v.onResizing({ height: 500, width: 500 });
                expect($('.brush')).not.toBeInDOM();
                done();
            }, DefaultWaitForRender);
        });

        it('should have correct tick labels after scrolling', (done) => {
            setTimeout(() => {
                let ticks = helpers.getAxisTicks('x');
                let tickCount = ticks.length;

                let startIndex = 10;
                let expectedValues = _.range(0, tickCount).map(i => String.fromCharCode('a'.charCodeAt(0) + startIndex + i));

                powerbitests.helpers.runWithImmediateAnimationFrames(() => {
                    (<powerbi.visuals.CartesianChart>v).scrollTo(startIndex);

                    setTimeout(() => {
                        ticks = helpers.getAxisTicks('x');
                        let tickValues = _.map(ticks.get(), (v) => $(v).clone().find('title').remove().end().text());

                        expect(tickValues).toEqual(expectedValues);

                        done();
                    }, DefaultWaitForRender);
                });
            }, DefaultWaitForRender);
        });
    }

    describe("ColumnChart scrollbar", () => columnChartScrollbarValidation(ColumnChartType.stackedColumn, '.column'));
    describe("ClusteredcolumnChart Scrollbar", () => columnChartScrollbarValidation(ColumnChartType.clusteredColumn, '.column'));

    describe("Column chart X axis label rotation/cutoff", () => {
        let v: powerbi.IVisual, element: JQuery;
        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
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
                }
            ],
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('400', '300');
            v = new ColumnChartVisualBuilder(ColumnChartType.stackedColumn).build();
        });

        it('long label cutoff at the left edge', () => {
            let hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { dragDataPoint: true },
            });

            let longLabelValue = 'Veryveryveryveryverylonglabel';
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [longLabelValue, 'b', 'c', 'd'],
                            identity: [
                                mocks.dataViewScopeIdentity(longLabelValue),
                                mocks.dataViewScopeIdentity('b'),
                                mocks.dataViewScopeIdentity('c'),
                                mocks.dataViewScopeIdentity('d'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.0, 1.5]
                        }])
                    }
                }]
            });

            let lastTick = helpers.getAxisTicks('x').find('text').first();
            expect(helpers.findElementText(lastTick)).toContain('…');
            expect(helpers.findElementTitle(lastTick)).not.toContain('…');
        });
    });

    describe("X Axis Customization: Column Chart", () => {
        let v: powerbi.IVisual, element: JQuery;
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let unitLength: number;
        let bars;
        let labels;
        let columnWidth: number;
        let dataChangedOptions;
        let lastIndex;

        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata;

        beforeEach(() => {
            element = powerbitests.helpers.testDom('600', '900');
            v = new ColumnChartVisualBuilder(ColumnChartType.stackedColumn).build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: false },
                animation: { transitionImmediate: true },
            });

            dataViewMetadataTwoColumn = {
                columns: [
                    {
                        displayName: 'col1',
                        queryName: 'col1',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
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
                    },
                    {
                        displayName: 'col4',
                        queryName: 'col4',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: { Y: true }
                    }],
            };
        });

        function setAxisType(xType: any) {
            dataViewMetadataTwoColumn.objects['categoryAxis']['axisType'] = xType;
        };

        it('Display Unit customization check', () => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];

            let dataViewMetadata = Prototype.inherit(dataViewMetadataTwoColumn);

            dataViewMetadata.objects = {
                categoryAxis: {
                    show: true,
                    start: 0,
                    end: 100000,
                    axisType: AxisType.scalar,
                    showAxisTitle: true,
                    axisStyle: true,
                    labelDisplayUnits: 1000000,
                    labelPrecision: 5
                },
                valueAxis: {
                    show: true,
                    position: 'Right',
                    start: 0,
                    end: 200000,
                    showAxisTitle: true,
                    axisStyle: true,
                    labelDisplayUnits: 1000000,
                    labelPrecision: 5
                }
            };
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [500, 2000, 5000, 10000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });

            labels = helpers.getAxisTicks('x').find('text');

            //Verify begin&end labels
            expect(helpers.findElementText(labels.first())).toBe('0.00000M');
            expect(helpers.findElementText(labels.last())).toBe('0.10000M');

            labels = helpers.getAxisTicks('y').find('text');

            //Verify begin&end labels
            expect(helpers.findElementText(labels.first())).toBe('0.00000M');
            expect(helpers.findElementText(labels.last())).toBe('0.20000M');
        });

        it('X Axis Customization: Verify Scalar and Categorical axis type', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("20000"),
                mocks.dataViewScopeIdentity("10000"),
                mocks.dataViewScopeIdentity("50000"),
            ];
            dataViewMetadataTwoColumn.objects = {
                categoryAxis: {
                    show: true,
                    start: 0,
                    end: 200000,
                    axisType: AxisType.scalar,
                    showAxisTitle: true,
                    axisStyle: true
                }
            };
            dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [50, 20000, 10000, 50000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            bars = $('.column');
            let firstItemGap = (+bars[1].getAttribute('x') - (+bars[0].getAttribute('x') + +bars[0].getAttribute('width')));
            lastIndex = bars.length - 1;
            let lastItemGap = +bars[lastIndex].getAttribute('x') - (+bars[lastIndex - 1].getAttribute('x') + +bars[lastIndex - 1].getAttribute('width'));
            expect(firstItemGap).toBeGreaterThan(0);
            expect(lastItemGap).toBeGreaterThan(firstItemGap);

            setAxisType(AxisType.categorical);
            v.onDataChanged(dataChangedOptions);
            firstItemGap = (+bars[1].getAttribute('x') - (+bars[0].getAttribute('x') + +bars[0].getAttribute('width')));
            lastItemGap = +bars[lastIndex].getAttribute('x') - (+bars[lastIndex - 1].getAttribute('x') + +bars[lastIndex - 1].getAttribute('width'));
            expect(firstItemGap).toBeGreaterThan(0);
            expect(lastItemGap).toBeCloseTo(firstItemGap, 2);
        });

        it('Basic scale check', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];
            dataViewMetadataTwoColumn.objects = {
                categoryAxis: {
                    show: true,
                    start: 0,
                    end: 100000,
                    axisType: AxisType.scalar,
                    showAxisTitle: true,
                    axisStyle: true
                }
            };
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [500, 2000, 5000, 10000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });
            bars = $('.column');
            labels = helpers.getAxisTicks('x').find('text');
            unitLength = (bars[1].getAttribute('x') - bars[0].getAttribute('x')) / 1500;
            columnWidth = bars[0].getAttribute('width');

            expect(bars[0].getAttribute('x')).toBeCloseTo(unitLength * 500, 2);
            expect(bars[1].getAttribute('x')).toBeCloseTo(unitLength * 2000, 2);
            expect(bars[2].getAttribute('x')).toBeCloseTo(unitLength * 5000, 2);
            expect(bars[3].getAttribute('x')).toBeCloseTo(unitLength * 10000, 2);

            //Verify no column overlapping
            expect(+bars[0].getAttribute('x') + +columnWidth).toBeLessThan(+bars[1].getAttribute('x'));
            expect(+bars[1].getAttribute('x') + +columnWidth).toBeLessThan(+bars[2].getAttribute('x'));
            expect(+bars[2].getAttribute('x') + +columnWidth).toBeLessThan(+bars[3].getAttribute('x'));

            //Verify begin&end labels text
            expect(helpers.findElementText(labels.first())).toBe('0K');
            expect(helpers.findElementTitle(labels.first())).toBe('0K');

            //Verify begin&end labels tooltip
            expect(helpers.findElementText(labels.last())).toBe('100K');
            expect(helpers.findElementTitle(labels.last())).toBe('100K');
        });

        it('Big Range scale check', () => {

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("50"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("100000"),
            ];
            dataViewMetadataTwoColumn.objects = {
                categoryAxis: {
                    show: true,
                    start: 0,
                    end: 50000,
                    axisType: AxisType.scalar,
                    showAxisTitle: true,
                    axisStyle: true
                }
            };

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [50, 20000, 10000, 50000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });
            bars = $('.column');
            labels = helpers.getAxisTicks('x').find('text');
            unitLength = (bars[1].getAttribute('x') - bars[0].getAttribute('x')) / 19950;
            columnWidth = bars[0].getAttribute('width');

            expect(bars[0].getAttribute('x')).toBeCloseTo(unitLength * 50, 2);
            expect(bars[2].getAttribute('x')).toBeCloseTo(unitLength * 10000, 2);
            expect(bars[1].getAttribute('x')).toBeCloseTo(unitLength * 20000, 2);
            expect(bars[3].getAttribute('x')).toBeCloseTo(unitLength * 50000, 2);

            //Verify no column overlapping
            expect(+bars[0].getAttribute('x') + +columnWidth).toBeLessThan(+bars[2].getAttribute('x'));
            expect(+bars[2].getAttribute('x') + +columnWidth).toBeLessThan(+bars[1].getAttribute('x'));
            expect(+bars[1].getAttribute('x') + +columnWidth).toBeLessThan(+bars[3].getAttribute('x'));

            //Verify begin&end labels
            expect(helpers.findElementText(labels.first())).toBe('0K');
            expect(helpers.findElementText(labels.last())).toBe('50K');

            //Verify begin&end label tooltip
            expect(helpers.findElementTitle(labels.first())).toBe('0K');
            expect(helpers.findElementTitle(labels.last())).toBe('50K');
        });

        it('Negative And Positive scale values check', () => {

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("-50"),
                mocks.dataViewScopeIdentity("-70"),
                mocks.dataViewScopeIdentity("-40"),
                mocks.dataViewScopeIdentity("-100"),
            ];

            dataViewMetadataTwoColumn.objects = {
                categoryAxis: {
                    show: true,
                    start: -100,
                    end: 100,
                    axisType: AxisType.scalar,
                    showAxisTitle: true,
                    axisStyle: true
                }
            };

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [-50, 0, 40, -100],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });
            bars = $('.column');
            labels = helpers.getAxisTicks('x').find('text');
            unitLength = (+bars[1].getAttribute('x') - +bars[0].getAttribute('x')) / 50;
            columnWidth = bars[0].getAttribute('width');

            expect(bars[0].getAttribute('x')).toBeCloseTo(unitLength * 50, 2);
            expect(bars[1].getAttribute('x')).toBeCloseTo(unitLength * 100, 2);
            expect(bars[2].getAttribute('x')).toBeCloseTo(unitLength * 140, 2);
            expect(bars[3].getAttribute('x')).toBeCloseTo(0, 2);

            //Verify no column overlapping
            expect(+bars[3].getAttribute('x') + +columnWidth).toBeLessThan(+bars[0].getAttribute('x'));
            expect(+bars[0].getAttribute('x') + +columnWidth).toBeLessThan(+bars[1].getAttribute('x'));
            expect(+bars[1].getAttribute('x') + +columnWidth).toBeLessThan(+bars[2].getAttribute('x'));

            //Verify begin&end labels
            expect(helpers.findElementText(labels.first())).toBe('-100');
            expect(helpers.findElementTitle(labels.first())).toBe('-100');

            expect(helpers.findElementText(labels.last())).toBe('100');
            expect(helpers.findElementTitle(labels.last())).toBe('100');
        });

        it('X Axis Customization: Set axis color', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("20000"),
                mocks.dataViewScopeIdentity("10000"),
                mocks.dataViewScopeIdentity("50000"),
            ];

            let labelColor = '#ff0000';

            dataViewMetadataTwoColumn.objects = {
                categoryAxis: {
                    show: true,
                    start: 0,
                    end: 200000,
                    axisType: AxisType.scalar,
                    showAxisTitle: true,
                    axisStyle: true,
                    labelColor: { solid: { color: labelColor } }
                }
            };
            dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [50, 20000, 10000, 50000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);
            let fill = helpers.getAxisTicks('x').find('text').css('fill');
            helpers.assertColorsMatch(fill, labelColor);
        });

        it('Null category value for categorical Datetime axis type', () => {
            let dataViewMetadataDatetimeColumn: powerbi.DataViewMetadata = {
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

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
                mocks.dataViewScopeIdentity("2013"),
                mocks.dataViewScopeIdentity("2014"),
            ];
            dataViewMetadataDatetimeColumn.objects = {
                categoryAxis: {
                    show: true,
                    axisType: AxisType.categorical,
                    showAxisTitle: true,
                    axisStyle: true
                }
            };
            dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataDatetimeColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataDatetimeColumn.columns[0],
                            values: [null, new Date(1325404800000), new Date(1357027200000), new Date(1388563200000)],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataDatetimeColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            };

            v.onDataChanged(dataChangedOptions);

            let axisLabels = helpers.getAxisTicks('x').find('text');
            expect(axisLabels.length).toBe(4);

            //check text
            expect(helpers.findElementText(axisLabels.eq(0))).toBe('(Blank)');
            expect(helpers.findElementText(axisLabels.eq(1))).toBe('1/1/2012');
            expect(helpers.findElementText(axisLabels.eq(2))).toBe('1/1/2013');
            expect(helpers.findElementText(axisLabels.eq(3))).toBe('1/1/2014');

            //check tooltip
            expect(helpers.findElementTitle(axisLabels.eq(0))).toBe('(Blank)');
            expect(helpers.findElementTitle(axisLabels.eq(1))).toBe('1/1/2012');
            expect(helpers.findElementTitle(axisLabels.eq(2))).toBe('1/1/2013');
            expect(helpers.findElementTitle(axisLabels.eq(3))).toBe('1/1/2014');
        });

        it('Tooltips are correct after axis change', () => {
            dataViewMetadataTwoColumn.objects = {
                categoryAxis: {
                    show: true,
                    axisType: AxisType.categorical,
                }
            };

            let categoryValues = [
                500,
                2000,
                5000,
                10000,
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: categoryValues,
                            identity: _.map(categoryValues, (v) => mocks.dataViewScopeIdentity(v)),
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });
            bars = $('.column');
            labels = helpers.getAxisTicks('x').find('text');

            expect(helpers.findElementText(labels.first())).toBe('500.00');
            expect(helpers.findElementTitle(labels.first())).toBe('500.00');

            expect(helpers.findElementText(labels.last())).toBe('10,000.00');
            expect(helpers.findElementTitle(labels.last())).toBe('10,000.00');

            // -- Animate to different tick labels ---
            categoryValues = [
                1000,
                5000,
                10000,
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: categoryValues,
                            identity: _.map(categoryValues, (v) => mocks.dataViewScopeIdentity(v)),
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });
            bars = $('.column');
            labels = helpers.getAxisTicks('x').find('text');

            expect(helpers.findElementText(labels.first())).toBe('1,000.00');
            expect(helpers.findElementTitle(labels.first())).toBe('1,000.00');

            expect(helpers.findElementText(labels.last())).toBe('10,000.00');
            expect(helpers.findElementTitle(labels.last())).toBe('10,000.00');
        });
    });

    describe("Y Axis Customization: Column Chart", () => {
        let v: powerbi.IVisual, element: JQuery;
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let bars;
        let labels;

        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    queryName: 'col1',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
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
                },
                {
                    displayName: 'col4',
                    queryName: 'col4',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true }
                }],
            objects: {
                valueAxis: {
                    show: true,
                    position: 'Right',
                    start: 0,
                    end: 200000,
                    showAxisTitle: true,
                    axisStyle: true
                }
            }
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '900');
            v = new ColumnChartVisualBuilder(ColumnChartType.stackedColumn).build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: false },
                animation: { transitionImmediate: true },
            });
        });

        it('verify begin & end', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [500, 2000, 5000, 10000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });
            bars = $('.column');
            labels = helpers.getAxisTicks('y').find('text');

            expect(helpers.findElementText(labels.first())).toBe('0K');
            expect(helpers.findElementTitle(labels.first())).toBe('0K');

            expect(helpers.findElementText(labels.last())).toBe('200K');
            expect(helpers.findElementTitle(labels.last())).toBe('200K');
        });

        it('verify begin & end - Big Scale', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [500, 2000, 50, 1000000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 1000000, 150000, 50]
                        }])
                    }
                }]
            });
            bars = $('.column');
            labels = helpers.getAxisTicks('y').find('text');

            expect(helpers.findElementText(labels.first())).toBe('0K');
            expect(helpers.findElementTitle(labels.first())).toBe('0K');

            expect(helpers.findElementText(labels.last())).toBe('200K');
            expect(helpers.findElementTitle(labels.last())).toBe('200K');
        });

        it('verify Y axis set color', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];

            let labelColor = '#ff0000';
            dataViewMetadataTwoColumn.objects['valueAxis']['labelColor'] = { solid: { color: labelColor } };

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [500, 2000, 5000, 10000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });
            bars = $('.column');
            labels = helpers.getAxisTicks('y').find('text');

            expect(helpers.findElementText(labels.first())).toBe('0K');
            expect(helpers.findElementTitle(labels.first())).toBe('0K');

            expect(helpers.findElementText(labels.last())).toBe('200K');
            expect(helpers.findElementTitle(labels.last())).toBe('200K');

            helpers.assertColorsMatch(labels.css('fill'), labelColor);
        });

        it('verify Y position change: the axis text should be further right than the axis line', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];

            let dataView = {
                metadata: dataViewMetadataTwoColumn,
                categorical: {
                    categories: [{
                        source: dataViewMetadataTwoColumn.columns[0],
                        values: [500, 2000, 50, 1000000],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataTwoColumn.columns[1],
                        min: 50000,
                        max: 200000,
                        subtotal: 500000,
                        values: [100000, 1000000, 150000, 50]
                    }])
                }
            };

            v.onDataChanged({
                dataViews: [dataView]
            });

            let yaxis = $('.y.axis');
            let yaxisLine = yaxis.find('line')[0];
            let yaxisText = yaxis.find('text')[0];

            expect(yaxisText['x']['baseVal'].getItem(0).value).toBeGreaterThan(yaxisLine['x2'].baseVal.value);

            setTimeout(() => {
                dataView.metadata.objects['valueAxis']['position'] = 'Left';
                v.onDataChanged({
                    dataViews: [dataView]
                });
                expect(yaxisText['x']['baseVal'].getItem(0).value).toBeLessThan(yaxisLine['x2'].baseVal.value);
            }, DefaultWaitForRender);
        });
    });

    describe("X Axis Customization: Bar Chart", () => {
        let v: powerbi.IVisual, element: JQuery;
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let bars;
        let labels;

        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    queryName: 'col1',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
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
                },
                {
                    displayName: 'col4',
                    queryName: 'col4',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true }
                }],
            objects: {
                valueAxis: {
                    show: true,
                    position: true,
                    start: 0,
                    end: 200000,
                    showAxisTitle: true,
                    axisStyle: true
                }
            }
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '900');
            v = new ColumnChartVisualBuilder(ColumnChartType.stackedBar).build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: false },
                animation: { transitionImmediate: true },
            });
        });

        it('Display Unit customization check', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];

            let dataViewMetadata = Prototype.inherit(dataViewMetadataTwoColumn);

            dataViewMetadata.objects = {
                categoryAxis: {
                    show: true,
                    start: 0,
                    end: 100000,
                    axisType: AxisType.scalar,
                    showAxisTitle: true,
                    axisStyle: true,
                    labelDisplayUnits: 1000000,
                    labelPrecision: 5
                },
                valueAxis: {
                    show: true,
                    position: 'Right',
                    start: 0,
                    end: 200000,
                    showAxisTitle: true,
                    axisStyle: true,
                    labelDisplayUnits: 1000000,
                    labelPrecision: 5
                }
            };
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [500, 2000, 5000, 10000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });

            labels = helpers.getAxisTicks('y').find('text');            

            //Verify begin&end labels
            expect(helpers.findElementText(labels.first())).toBe('0.00000M');
            expect(helpers.findElementText(labels.last())).toBe('0.10000M');

            expect(helpers.findElementTitle(labels.first())).toBe('0.00000M');
            expect(helpers.findElementTitle(labels.last())).toBe('0.10000M');

            labels = helpers.getAxisTicks('x').find('text');            

            //Verify begin&end labels
            expect(helpers.findElementText(labels.first())).toBe('0.00000M');
            expect(helpers.findElementText(labels.last())).toBe('0.20000M');

            expect(helpers.findElementTitle(labels.first())).toBe('0.00000M');
            expect(helpers.findElementTitle(labels.last())).toBe('0.20000M');
        });

        it('verify begin & end', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [500, 2000, 5000, 10000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });
            bars = $('.column');
            labels = helpers.getAxisTicks('x').find('text');

            expect(helpers.findElementText(labels.first())).toBe('0K');
            expect(helpers.findElementTitle(labels.first())).toBe('0K');

            expect(helpers.findElementText(labels.last())).toBe('200K');
            expect(helpers.findElementTitle(labels.last())).toBe('200K');
        });

        it('verify begin & end - Big Range', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [5, 2000, 5000, 1000000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 2000000, 150000, 50]
                        }])
                    }
                }]
            });
            bars = $('.column');
            labels = helpers.getAxisTicks('x').find('text');

            expect(helpers.findElementText(labels.first())).toBe('0K');
            expect(helpers.findElementTitle(labels.first())).toBe('0K');

            expect(helpers.findElementText(labels.last())).toBe('200K');
            expect(helpers.findElementTitle(labels.last())).toBe('200K');
        });
    });

    describe("Y Axis Customization: Bar Chart", () => {
        let v: powerbi.IVisual, element: JQuery;
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let unitLength: number;
        let bars;
        let labels;
        let barHeight: number;
        let barHeightArray = [];
        let barArrayLength;

        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    queryName: 'col1',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
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
                },
                {
                    displayName: 'col4',
                    queryName: 'col4',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true }
                }],
            objects: {
                categoryAxis: {
                    show: true,
                    start: 0,
                    end: 100000,
                    axisType: AxisType.scalar,
                    showAxisTitle: true,
                    axisStyle: true
                }
            }
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('750', '500');
            v = new ColumnChartVisualBuilder(ColumnChartType.stackedBar).build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: false },
                animation: { transitionImmediate: true },
            });
        });

        it('Basic scale check', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [500, 2000, 5000, 10000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });
            bars = $('.bar');
            labels = helpers.getAxisTicks('y').find('text');
            barHeight = bars[0].getAttribute('height');
            barHeightArray = [];
            barArrayLength = bars.length;
            for (let i = 0; i < barArrayLength; i++) {
                barHeightArray.push(bars[i].getAttribute('y'));
            }
            barHeightArray.sort();
            unitLength = (+barHeightArray[1] - +barHeightArray[0]) / 5000;            

            //Verify begin&end labels
            expect(helpers.findElementText(labels.first())).toBe('0K');
            expect(helpers.findElementTitle(labels.first())).toBe('0K');

            expect(helpers.findElementText(labels.last())).toBe('100K');
            expect(helpers.findElementTitle(labels.last())).toBe('100K');
        });
    });

    describe("Bar chart legend", () => {
        let v: powerbi.IVisual, element: JQuery;
        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
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
                }
            ],
        };
        let dataViewMetadataTwoColumnWithGroup: powerbi.DataViewMetadata = {
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
                    groupName: 'group', 
                    roles: { Y: true }
                },
            ],
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('400', '300');
            v = new ColumnChartVisualBuilder(ColumnChartType.stackedBar).build();
        });

        it('hide legend when there is only one legend and no group', () => {
            let hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { dragDataPoint: true },
            });

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                                mocks.dataViewScopeIdentity('b'),
                                mocks.dataViewScopeIdentity('c'),
                                mocks.dataViewScopeIdentity('d'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.0, 1.5]
                        }])
                    }
                }]
            });

            let legend = element.find('.legend');
            let title = legend.find('.title');
            expect(title.length).toBe(0);
        });

        it('show legend when there is one legend and the legend is in a group', () => {
            let hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { dragDataPoint: true },
            });

            let identities = [
                mocks.dataViewScopeIdentity('identity'),

            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumnWithGroup,
                    categorical: {
                        categories: [
                            {
                                source: dataViewMetadataTwoColumnWithGroup.columns[0],
                                values: ['a', 'b', 'c', 'd'],
                                identity: identities,
                            }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataTwoColumnWithGroup.columns[1],
                                values: [0.5, 2, 1, 1.5],
                                identity: identities[0],
                            },
                        ])
                    }
                }]
            });
            ;
            let title = $('.legendText');
            expect(title.length).toBe(1);
            expect(title.text()).toBe('group');
        });

        it('check color for legend title and legend items', (done) => {
            let labelFontSize = 11;
            let labelColor = "#002121";
            let hostServices = mocks.createVisualHostServices();
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
            v.onDataChanged(getMetadataForLegendTest(dataViewMetadataTwoColumnWithGroup, labelColor, labelFontSize));

            let legend = element.find('.legend');
            let legendTitle = legend.find('.legendTitle');
            let legendText = legend.find('.legendItem').find('.legendText');

            setTimeout(() => {
                helpers.assertColorsMatch(legendTitle.css('fill'), labelColor);
                helpers.assertColorsMatch(legendText.first().css('fill'), labelColor);
                done();
            }, DefaultWaitForRender);
        });

        it('check font size for legend title and legend items', (done) => {
            let labelColor = "#002121";
            let labelFontSize = 13;
            let hostServices = mocks.createVisualHostServices();
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

            v.onDataChanged(getMetadataForLegendTest(dataViewMetadataTwoColumnWithGroup, labelColor, labelFontSize));

            let legend = element.find('.legend');
            let legendTitle = legend.find('.legendTitle');
            let legendText = legend.find('.legendItem').find('.legendText');

            setTimeout(() => {
                expect(Math.round(parseInt(legendTitle.css('font-size'), 10))).toBe(Math.round(parseInt(PixelConverter.fromPoint(labelFontSize), 10)));
                expect(Math.round(parseInt(legendText.css('font-size'), 10))).toBe(Math.round(parseInt(PixelConverter.fromPoint(labelFontSize), 10)));
                done();
            }, DefaultWaitForRender);
        });
    });

    function getMetadataForLegendTest(baseMetadata: powerbi.DataViewMetadata, labelColor: string, labelFontSize: number): powerbi.VisualDataChangedOptions {

        let identities = [mocks.dataViewScopeIdentity('identity'),
        ];

        let dataViewMetadata = Prototype.inherit(baseMetadata);
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

    function pruneColunnChartDataPoint(dataPoint: powerbi.visuals.ColumnChartDataPoint) {
        return {
            categoryValue: dataPoint.categoryValue,
            value: dataPoint.value,
        };
    }
    it('Column Chart X and Y-axis show/hide Title ', () => {

        let element = powerbitests.helpers.testDom('500', '500');
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let categoryIdentities = [mocks.dataViewScopeIdentity("John Domo")];
        let v = new ColumnChartVisualBuilder(ColumnChartType.stackedColumn).build();
        v.init({
            element: element,
            host: hostServices,
            style: powerbi.visuals.visualStyles.create(),
            viewport: {
                height: element.height(),
                width: element.width()
            },
            interactivity: { isInteractiveLegend: false },
            animation: { transitionImmediate: true },
        });
        let dataViewMetadataOneColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'AxesTitleTest',
                    queryName: 'AxesTitleTest',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true }
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
        expect(helpers.findElementText($('.xAxisLabel'))).toBe('AxesTitleTest');
        expect(helpers.findElementTitle($('.xAxisLabel'))).toBe('AxesTitleTest');

        expect(helpers.findElementText($('.yAxisLabel'))).toBe('AxesTitleTest');
        expect(helpers.findElementTitle($('.yAxisLabel'))).toBe('AxesTitleTest');

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

    it('Bar Chart: Hide X and Y axis title', () => {
        let element = powerbitests.helpers.testDom('500', '500');
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let categoryIdentities = [mocks.dataViewScopeIdentity("John Domo")];
        let v = new ColumnChartVisualBuilder(ColumnChartType.stackedBar).build();
        v.init({
            element: element,
            host: hostServices,
            style: powerbi.visuals.visualStyles.create(),
            viewport: {
                height: element.height(),
                width: element.width()
            },
            interactivity: { isInteractiveLegend: false },
            animation: { transitionImmediate: true },
        });
        let dataViewMetadataOneColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'AxesTitleTest',
                    queryName: 'AxesTitleTest',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true }
                }],
            objects: {
                categoryAxis: {
                    showAxisTitle: true
                },
                valueAxis: {
                    showAxisTitle: false
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
        expect($('.xAxisLabel').length).toBe(0);
        expect(helpers.findElementText($('.yAxisLabel'))).toBe('AxesTitleTest');
        expect(helpers.findElementTitle($('.yAxisLabel'))).toBe('AxesTitleTest');

        dataViewMetadataOneColumn.objects = {
            categoryAxis: {
                showAxisTitle: false
            },
            valueAxis: {
                showAxisTitle: true
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
        expect(helpers.findElementTitle($('.xAxisLabel').first())).toBe('AxesTitleTest');
        expect($('.yAxisLabel').length).toBe(0);
    });

    function columnChartDataLabelsFormatValidation(chartType: ColumnChartType) {
        let v: powerbi.IVisual, element: JQuery;

        let dataViewMetadataThreeColumn: powerbi.DataViewMetadataColumn[] = [
            {
                displayName: 'col1',
                type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                queryName: 'col1',
                roles: { Category: true }
            },
            {
                displayName: 'col2',
                isMeasure: true,
                type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                queryName: 'col2',
                roles: { Y: true }
            },
            {
                displayName: 'col3',
                isMeasure: true,
                type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                queryName: 'col3',
                roles: { Y: true }
            }
        ];

        function metadata(columns, displayUnits: number = 0, precision: number = 0, fontSize?: number): powerbi.DataViewMetadata {
            let metadata: powerbi.DataViewMetadata = {
                columns: columns,
            };

            metadata.objects = {
                labels: { show: true, labelDisplayUnits: displayUnits, labelPrecision: precision, fontSize: fontSize }
            };

            return metadata;
        }

        let hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {
            element = powerbitests.helpers.testDom('1000', '1000');
            v = new ColumnChartVisualBuilder(chartType).build();
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

        it('labels should support display units with no precision', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
            ];
            let dataView: powerbi.DataView = {
                metadata: metadata(dataViewMetadataThreeColumn, 1000, 0),
                categorical: {
                    categories: [{
                        source: dataViewMetadataThreeColumn[0],
                        values: ['John Domo'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataThreeColumn[1],
                        values: [500123],
                        subtotal: 3020
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect($('.label').first().text()).toEqual('500K');
                done();
            }, DefaultWaitForRender);
        });

        it('labels should support display units with precision', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
            ];
            let dataView: powerbi.DataView = {
                metadata: metadata(dataViewMetadataThreeColumn, 1000, 1),
                categorical: {
                    categories: [{
                        source: dataViewMetadataThreeColumn[0],
                        values: ['John Domo'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataThreeColumn[1],
                        values: [500123],
                        subtotal: 3020
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect($('.label').first().text()).toEqual('500.1K');
                done();
            }, DefaultWaitForRender);
        });

        it('labels should support different font size', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
            ];
            let dataView: powerbi.DataView = {
                metadata: metadata(dataViewMetadataThreeColumn, 1000, 1, 15),
                categorical: {
                    categories: [{
                        source: dataViewMetadataThreeColumn[0],
                        values: ['John Domo'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataThreeColumn[1],
                        values: [500123],
                        subtotal: 3020
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect($('.label').first().css('font-size')).toEqual(15 * 4 / 3 + 'px');
                done();
            }, DefaultWaitForRender);
        });

        it('with NaN value shows warning', (done) => {
            let warningSpy = jasmine.createSpy('setWarnings');

            hostServices.setWarnings = warningSpy;

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
            ];
            let dataView: powerbi.DataView = {
                metadata: metadata(dataViewMetadataThreeColumn, 0, 2),
                categorical: {
                    categories: [{
                        source: dataViewMetadataThreeColumn[0],
                        values: ['John Domo'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataThreeColumn[1],
                        values: [NaN],
                        subtotal: 3020
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('NaNNotSupported');
                done();
            }, DefaultWaitForRender);
        });

        it('with Negative Infinity value shows warning', (done) => {
            let warningSpy = jasmine.createSpy('setWarnings');

            hostServices.setWarnings = warningSpy;

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
            ];
            let dataView: powerbi.DataView = {
                metadata: metadata(dataViewMetadataThreeColumn, 0, 2),
                categorical: {
                    categories: [{
                        source: dataViewMetadataThreeColumn[0],
                        values: ['John Domo'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataThreeColumn[1],
                        values: [Number.NEGATIVE_INFINITY],
                        subtotal: 3020
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('InfinityValuesNotSupported');
                done();
            }, DefaultWaitForRender);
        });

        it('with Infinity value shows warning', (done) => {
            let warningSpy = jasmine.createSpy('setWarnings');

            hostServices.setWarnings = warningSpy;

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
            ];
            let dataView: powerbi.DataView = {
                metadata: metadata(dataViewMetadataThreeColumn, 0, 2),
                categorical: {
                    categories: [{
                        source: dataViewMetadataThreeColumn[0],
                        values: ['John Domo'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataThreeColumn[1],
                        values: [Number.POSITIVE_INFINITY],
                        subtotal: 3020
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('InfinityValuesNotSupported');
                done();
            }, DefaultWaitForRender);
        });

        it('with out of range value shows warning', (done) => {
            let warningSpy = jasmine.createSpy('setWarnings');

            hostServices.setWarnings = warningSpy;

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
            ];
            let dataView: powerbi.DataView = {
                metadata: metadata(dataViewMetadataThreeColumn, 0, 2),
                categorical: {
                    categories: [{
                        source: dataViewMetadataThreeColumn[0],
                        values: ['John Domo'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataThreeColumn[1],
                        values: [1e301],
                        subtotal: 3020
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('ValuesOutOfRange');
                done();
            }, DefaultWaitForRender);
        });

        it('labels should support multiple formats', (done) => {
            let columnsWithMultipleFormats: powerbi.DataViewMetadataColumn[] = [
                {
                    displayName: 'col1',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    queryName: 'col1',
                    format: "#,0",
                    roles: { Y: true }
                },
                {
                    displayName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    queryName: 'col2',
                    format: "$#,0",
                    roles: { Y: true }
                },
                {
                    displayName: 'col3',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                    queryName: 'col3',
                    roles: { Category: true }
                },
            ];

            let categoryIdentities = [
                mocks.dataViewScopeIdentity(5400123),
            ];

            let dataView: powerbi.DataView = {
                //setting display units to 1, in order to avoid auto scaling
                metadata: metadata(columnsWithMultipleFormats, 1, 0),
                categorical: {
                    categories: [{
                        source: columnsWithMultipleFormats[2],
                        values: ['John'],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: columnsWithMultipleFormats[0],
                        values: [1555],
                        subtotal: 3020
                    }, {
                            source: columnsWithMultipleFormats[1],
                            values: [1666],
                            subtotal: 3020
                        }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect($('.label').first().text()).toEqual('1,555');
                expect($($('.label')[1]).text()).toEqual('$1,666');
                done();
            }, DefaultWaitForRender);
        });
    }

    describe("Column chart format validation", () => columnChartDataLabelsFormatValidation(ColumnChartType.stackedColumn));
    describe("Stacked Bar format validation", () => columnChartDataLabelsFormatValidation(ColumnChartType.stackedBar));
    describe("Clustered Bar Chart Labels Color", () => columnChartDataLabelsFormatValidation(ColumnChartType.clusteredBar));
    describe("Clustered Column Chart Labels Color", () => columnChartDataLabelsFormatValidation(ColumnChartType.clusteredColumn));

    function logScaleTests(chartType: ColumnChartType) {
        let v: powerbi.IVisual, element: JQuery;
        let hostServices = powerbitests.mocks.createVisualHostServices();

        let dataViewMetadataThreeColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    queryName: 'col1',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true }
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
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                    roles: { Category: true }
                }],
            objects: {
                valueAxis: {
                    show: true,
                    position: 'Right',
                    start: 0,
                    end: 200000,
                    showAxisTitle: true,
                    axisStyle: true
                }
            }
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '900');
            v = new ColumnChartVisualBuilder(chartType).build();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: false },
                animation: { transitionImmediate: true },
            });
        });

        it('Log scale ticks', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];
            dataViewMetadataThreeColumn.objects = {
                valueAxis: {
                    show: true,
                    start: 10,
                    end: 100000,
                    axisType: AxisType.scalar,
                    showAxisTitle: true,
                    axisStyle: true,
                    axisScale: axisScale.log
                }
            };
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataThreeColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn.columns[0],
                            values: [500, 2000, 5000, 10000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataThreeColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });
            let isBar = ColumnChart.isBar(chartType);
            let axis = isBar ? 'x' : 'y';
            let logLabels: any = helpers.getAxisTicks(axis).find('text');
            expect(logLabels.length).toBeGreaterThan(0);

            for (let i = 0, ilen = logLabels.length; i < ilen; i++) {
                let labelValue = +expect(helpers.findElementText(logLabels.eq(i))).actual.replace(',', '');
                expect(AxisHelper.powerOfTen(labelValue)).toBeTruthy();
            }
        });

        it('Log scale - DOM size checks', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("Jan"),
                mocks.dataViewScopeIdentity("Feb"),
                mocks.dataViewScopeIdentity("Mar"),
                mocks.dataViewScopeIdentity("Apr"),
            ];
            dataViewMetadataThreeColumn.objects = {
                valueAxis: {
                    show: true,
                    start: 100,
                    end: undefined, //auto
                    axisType: AxisType.categorical,
                    showAxisTitle: true,
                    axisStyle: true,
                    axisScale: axisScale.log,
                }
            };
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataThreeColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn.columns[2],
                            values: ['Jan','Feb','Mar','Apr'],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataThreeColumn.columns[1],
                            values: [2600, 2000, 5600, 1500]
                        }, {
                            source: dataViewMetadataThreeColumn.columns[0],
                            values: [1700, 1400, 1500, 855]
                        }])
                    }
                }]
            });
            let isBar = ColumnChart.isBar(chartType);
            let axis = isBar ? 'x' : 'y';
            let logLabels: any = helpers.getAxisTicks(axis).find('text');
            expect(logLabels.length).toBeGreaterThan(0);

            for (let i = 0, ilen = logLabels.length; i < ilen; i++) {
                let labelValue = +expect(helpers.findElementText(logLabels.eq(i))).actual.replace(',', '');
                expect(AxisHelper.powerOfTen(labelValue)).toBeTruthy();
            }

            let allSeries = $('.series');
            expect(allSeries.length).toBe(2);
            let stackedLengths = [];          
            let lengthAttribute = isBar ? 'width' : 'height';
            for (let i = 0, ilen = allSeries.length; i < ilen; i++) {
                let series = allSeries[i];
                let seriesRects = $('rect', series);
                if (i === 0) {
                    for (let j = 0; j < seriesRects.length; j++) {
                        stackedLengths[j] = seriesRects.eq(j).attr(lengthAttribute);
                    }
                }
                else {
                    for (let j = 0; j < seriesRects.length; j++) {
                        let len = seriesRects.eq(j).attr(lengthAttribute);
                        expect(len).toBeLessThan(stackedLengths[j] * 0.5);
                    }
                }
            }
        });

        it('Log scale starts from zero', () => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];
            dataViewMetadataThreeColumn.objects = {
                valueAxis: {
                    show: true,
                    start: 0,
                    end: 100000,
                    axisType: AxisType.scalar,
                    showAxisTitle: true,
                    axisStyle: true,
                    axisScale: axisScale.log
                }
            };
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataThreeColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn.columns[0],
                            values: [500, 2000, 5000, 10000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataThreeColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });
            let logLabels: any = helpers.getAxisTicks('y');
            expect(logLabels.length).toBe(6);
        });
    };

    describe("Log scale checks - columnChartStacked", () => {
        logScaleTests(ColumnChartType.stackedColumn);
    });
    describe("Log scale checks - barChartStacked", () => {
        logScaleTests(ColumnChartType.stackedBar);
    });

    function columnChartDataLabelsPerSeriesFormatValidation(chartType: ColumnChartType) {
        let v: powerbi.IVisual, element: JQuery;

        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
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
                }
            ],
        };

        let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });

        function metadata(columns): powerbi.DataViewMetadata {
            let metadata: powerbi.DataViewMetadata = {
                columns: columns,
            };

            metadata.objects = {
                labels: { show: true, }
            };

            return metadata;
        }

        let hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {
            element = powerbitests.helpers.testDom('600', '600');
            v = new ColumnChartVisualBuilder(chartType).build();
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

        it('labels should support precision per series', (done) => {
            let dataViewMetadata1Category2Measure: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1', queryName: 'col1', roles: { Category: true } },
                    { displayName: 'col2', queryName: 'col2', format: '#,0.0', isMeasure: true, objects: { labels: { labelPrecision: 1 } }, roles: { Y: true } },
                    { displayName: 'col3', queryName: 'col3', format: '#,0.0', isMeasure: true, objects: { labels: { labelPrecision: 2 } }, roles: { Y: true } }]
            };

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
                mocks.dataViewScopeIdentity("Delta Force"),
                mocks.dataViewScopeIdentity("Mr Bing"),
            ];

            let dataChangedOptions = {
                dataViews: [{
                    metadata: metadata(dataViewMetadataTwoColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['John Domo', 'Delta Force', 'Mr Bing'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata1Category2Measure.columns[1],
                            values: [-200, 100, 150],
                            subtotal: 450
                        }, {
                                source: dataViewMetadata1Category2Measure.columns[2],
                                values: [-300, 300, 90],
                                subtotal: 630
                            }])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                expect($('.label').first().text()).toEqual('-200.0');
                expect($('.label').last().text()).toEqual('90.00');
                done();
            }, DefaultWaitForRender);
        });

        it('labels should support precision per series only when defined', (done) => {
            let dataViewMetadata1Category2Measure: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1', queryName: 'col1', roles: { Category: true } },
                    { displayName: 'col2', queryName: 'col2', format: '#,0.0', isMeasure: true, objects: { labels: { labelPrecision: 1 } }, roles: { Y: true } },
                    { displayName: 'col3', queryName: 'col3', format: '#,0.0', isMeasure: true, roles: { Y: true } }]
            };

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
                mocks.dataViewScopeIdentity("Delta Force"),
                mocks.dataViewScopeIdentity("Mr Bing"),
            ];

            let metadataWithPrecision3 = metadata(dataViewMetadataTwoColumn);
            (<any>metadataWithPrecision3.objects).labels.labelPrecision = 3;

            let dataChangedOptions = {
                dataViews: [{
                    metadata: metadataWithPrecision3,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['John Domo', 'Delta Force', 'Mr Bing'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata1Category2Measure.columns[1],
                            values: [-200, 100, 150],
                            subtotal: 450
                        }, {
                                source: dataViewMetadata1Category2Measure.columns[2],
                                values: [-300, 300, 90],
                                subtotal: 630
                            }])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                expect($('.label').first().text()).toEqual('-200.0');
                expect($('.label').last().text()).toEqual('90.000');
                done();
            }, DefaultWaitForRender);
        });
    }

    describe("Column chart format per series validation", () => columnChartDataLabelsPerSeriesFormatValidation(ColumnChartType.stackedColumn));
    describe("Bar chart format per series validation", () => columnChartDataLabelsPerSeriesFormatValidation(ColumnChartType.stackedBar));
    describe("Clustered Bar chart format per series validation", () => columnChartDataLabelsPerSeriesFormatValidation(ColumnChartType.clusteredBar));
    describe("Clustered Column chart format per series validation", () => columnChartDataLabelsPerSeriesFormatValidation(ColumnChartType.clusteredColumn));

    function columnChartLabelDataPointCreation(chartType: ColumnChartType, stacked: boolean) {
        let v: powerbi.IVisual, element: JQuery;

        let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });

        let hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {
            element = powerbitests.helpers.testDom('600', '600');
            v = new ColumnChartVisualBuilder(chartType).build();
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

        it("Label data points have correct text", () => {
            let dataViewMetadata1Category2Measure: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1', queryName: 'col1', roles: { Category: true } },
                    { displayName: 'col2', queryName: 'col2', format: '#,0', isMeasure: true, roles: { Y: true } },
                    { displayName: 'col3', queryName: 'col3', format: '#,0', isMeasure: true, roles: { Y: true } }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                    }
                },
            };

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
                mocks.dataViewScopeIdentity("Delta Force"),
                mocks.dataViewScopeIdentity("Mr Bing"),
            ];

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadata1Category2Measure,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['John Domo', 'Delta Force', 'Mr Bing'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata1Category2Measure.columns[1],
                            values: [-200, 100, 150],
                            subtotal: 450
                        }, {
                                source: dataViewMetadata1Category2Measure.columns[2],
                                values: [-300, 300, 90],
                                subtotal: 630
                            }])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            let labelDataPoints = callCreateLabelDataPoints(v);
            expect(labelDataPoints[0].text).toEqual("-200");
            expect(labelDataPoints[1].text).toEqual("100");
            expect(labelDataPoints[2].text).toEqual("150");
            expect(labelDataPoints[3].text).toEqual("-300");
            expect(labelDataPoints[4].text).toEqual("300");
            expect(labelDataPoints[5].text).toEqual("90");
        });

        it("Label data points have correct default fill", () => {
            let dataViewMetadata1Category2Measure: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1', queryName: 'col1', roles: { Category: true } },
                    { displayName: 'col2', queryName: 'col2', format: '#,0.0', isMeasure: true, roles: { Y: true } },
                    { displayName: 'col3', queryName: 'col3', format: '#,0.0', isMeasure: true, roles: { Y: true } }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                    }
                },
            };

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
                mocks.dataViewScopeIdentity("Delta Force"),
                mocks.dataViewScopeIdentity("Mr Bing"),
            ];

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadata1Category2Measure,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['John Domo', 'Delta Force', 'Mr Bing'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata1Category2Measure.columns[1],
                            values: [-200, 100, 150],
                            subtotal: 450
                        }, {
                                source: dataViewMetadata1Category2Measure.columns[2],
                                values: [-300, 300, 90],
                                subtotal: 630
                            }])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            let labelDataPoints = callCreateLabelDataPoints(v);
            helpers.assertColorsMatch(labelDataPoints[0].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[1].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[2].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[3].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[4].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[5].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[0].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[1].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[2].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[3].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[4].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[5].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
        });

        it("Label data points have correct default fill for combo", () => {
            let dataViewMetadata1Category2Measure: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1', queryName: 'col1', roles: { Category: true } },
                    { displayName: 'col2', queryName: 'col2', format: '#,0.0', isMeasure: true, roles: { Y: true } },
                    { displayName: 'col3', queryName: 'col3', format: '#,0.0', isMeasure: true, roles: { Y: true } }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                    }
                },
            };

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
                mocks.dataViewScopeIdentity("Delta Force"),
                mocks.dataViewScopeIdentity("Mr Bing"),
            ];

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadata1Category2Measure,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['John Domo', 'Delta Force', 'Mr Bing'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata1Category2Measure.columns[1],
                            values: [-200, 100, 150],
                            subtotal: 450
                        }, {
                                source: dataViewMetadata1Category2Measure.columns[2],
                                values: [-300, 300, 90],
                                subtotal: 630
                            }])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            (<any>v).layers[0].columnChart.isComboChart = true;
            let labelDataPoints = callCreateLabelDataPoints(v);
            helpers.assertColorsMatch(labelDataPoints[0].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[1].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[2].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[3].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[4].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[5].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[0].insideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[1].insideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[2].insideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[3].insideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[4].insideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            helpers.assertColorsMatch(labelDataPoints[5].insideFill, powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
        });

        it("Label data points have correct fill", () => {
            let labelColor = "#007700";
            let dataViewMetadata1Category2Measure: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1', queryName: 'col1', roles: { Category: true } },
                    { displayName: 'col2', queryName: 'col2', format: '#,0.0', isMeasure: true, roles: { Y: true } },
                    { displayName: 'col3', queryName: 'col3', format: '#,0.0', isMeasure: true, roles: { Y: true }}],
                objects: {
                    labels: {
                        show: true,
                        color: { solid: { color: labelColor } },
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                    }
                },
            };

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
                mocks.dataViewScopeIdentity("Delta Force"),
                mocks.dataViewScopeIdentity("Mr Bing"),
            ];

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadata1Category2Measure,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['John Domo', 'Delta Force', 'Mr Bing'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata1Category2Measure.columns[1],
                            values: [-200, 100, 150],
                            subtotal: 450
                        }, {
                                source: dataViewMetadata1Category2Measure.columns[2],
                                values: [-300, 300, 90],
                                subtotal: 630
                            }])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            let labelDataPoints = callCreateLabelDataPoints(v);
            helpers.assertColorsMatch(labelDataPoints[0].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[1].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[2].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[3].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[4].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[5].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[0].insideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[1].insideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[2].insideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[3].insideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[4].insideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[5].insideFill, labelColor);
        });

        it("Label data points have correct fill for combo", () => {
            let labelColor = "#007700";
            let dataViewMetadata1Category2Measure: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1', queryName: 'col1', roles: { Category: true } },
                    { displayName: 'col2', queryName: 'col2', format: '#,0.0', isMeasure: true, roles: { Y: true } },
                    { displayName: 'col3', queryName: 'col3', format: '#,0.0', isMeasure: true, roles: { Y: true } }],
                objects: {
                    labels: {
                        show: true,
                        color: { solid: { color: labelColor } },
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                    }
                },
            };

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
                mocks.dataViewScopeIdentity("Delta Force"),
                mocks.dataViewScopeIdentity("Mr Bing"),
            ];

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadata1Category2Measure,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['John Domo', 'Delta Force', 'Mr Bing'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata1Category2Measure.columns[1],
                            values: [-200, 100, 150],
                            subtotal: 450
                        }, {
                                source: dataViewMetadata1Category2Measure.columns[2],
                                values: [-300, 300, 90],
                                subtotal: 630
                            }])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            (<any>v).layers[0].columnChart.isComboChart = true;
            let labelDataPoints = callCreateLabelDataPoints(v);
            helpers.assertColorsMatch(labelDataPoints[0].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[1].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[2].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[3].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[4].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[5].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[0].insideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[1].insideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[2].insideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[3].insideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[4].insideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[5].insideFill, labelColor);
        });

        it("Label data points have correct display units", () => {
            let dataViewMetadata1Category2Measure: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1', queryName: 'col1', roles: { Category: true } },
                    { displayName: 'col2', queryName: 'col2', format: '#,0', isMeasure: true, roles: { Y: true } },
                    { displayName: 'col3', queryName: 'col3', format: '#,0', isMeasure: true, roles: { Y: true } }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: 1000,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                    }
                },
            };

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
                mocks.dataViewScopeIdentity("Delta Force"),
                mocks.dataViewScopeIdentity("Mr Bing"),
            ];

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadata1Category2Measure,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['John Domo', 'Delta Force', 'Mr Bing'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata1Category2Measure.columns[1],
                            values: [-2000, 1000, 1500],
                            subtotal: 4500
                        }, {
                                source: dataViewMetadata1Category2Measure.columns[2],
                                values: [-3000, 3000, 900],
                                subtotal: 6300
                            }])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            let labelDataPoints = callCreateLabelDataPoints(v);
            expect(labelDataPoints[0].text).toEqual("-2K");
            expect(labelDataPoints[1].text).toEqual("1K");
            expect(labelDataPoints[2].text).toEqual("2K");
            expect(labelDataPoints[3].text).toEqual("-3K");
            expect(labelDataPoints[4].text).toEqual("3K");
            expect(labelDataPoints[5].text).toEqual("1K");
        });

        it("Label data points have correct precision", () => {
            let dataViewMetadata1Category2Measure: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1', queryName: 'col1', roles: { Category: true } },
                    { displayName: 'col2', queryName: 'col2', format: '#,0.0', isMeasure: true, roles: { Y: true } },
                    { displayName: 'col3', queryName: 'col3', format: '#,0.0', isMeasure: true, roles: { Y: true } }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: 0,
                    }
                },
            };

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
                mocks.dataViewScopeIdentity("Delta Force"),
                mocks.dataViewScopeIdentity("Mr Bing"),
            ];

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadata1Category2Measure,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['John Domo', 'Delta Force', 'Mr Bing'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata1Category2Measure.columns[1],
                            values: [-200, 100, 150],
                            subtotal: 450
                        }, {
                                source: dataViewMetadata1Category2Measure.columns[2],
                                values: [-300, 300, 90],
                                subtotal: 630
                            }])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            let labelDataPoints = callCreateLabelDataPoints(v);
            expect(labelDataPoints[0].text).toEqual("-200");
            expect(labelDataPoints[1].text).toEqual("100");
            expect(labelDataPoints[2].text).toEqual("150");
            expect(labelDataPoints[3].text).toEqual("-300");
            expect(labelDataPoints[4].text).toEqual("300");
            expect(labelDataPoints[5].text).toEqual("90");
        });

        it("Label data points have correct position", () => {
            let dataViewMetadata1Category2Measure: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1', queryName: 'col1', roles: { Category: true } },
                    { displayName: 'col2', queryName: 'col2', format: '#,0.0', isMeasure: true, roles: { Y: true } },
                    { displayName: 'col3', queryName: 'col3', format: '#,0.0', isMeasure: true, roles: { Y: true } }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                    }
                },
            };

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
                mocks.dataViewScopeIdentity("Delta Force"),
                mocks.dataViewScopeIdentity("Mr Bing"),
            ];

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadata1Category2Measure,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['John Domo', 'Delta Force', 'Mr Bing'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata1Category2Measure.columns[1],
                            values: [-200, 100, 150],
                            subtotal: 450
                        }, {
                                source: dataViewMetadata1Category2Measure.columns[2],
                                values: [-300, 300, 90],
                                subtotal: 630
                            }])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            let labelDataPoints = callCreateLabelDataPoints(v);
            expect(labelDataPoints[0].parentShape.validPositions).toEqual(stacked ? ColumnChart.stackedValidLabelPositions : ColumnChart.clusteredValidLabelPositions);
            expect(labelDataPoints[1].parentShape.validPositions).toEqual(stacked ? ColumnChart.stackedValidLabelPositions : ColumnChart.clusteredValidLabelPositions);
            expect(labelDataPoints[2].parentShape.validPositions).toEqual(stacked ? ColumnChart.stackedValidLabelPositions : ColumnChart.clusteredValidLabelPositions);
            expect(labelDataPoints[3].parentShape.validPositions).toEqual(stacked ? ColumnChart.stackedValidLabelPositions : ColumnChart.clusteredValidLabelPositions);
            expect(labelDataPoints[4].parentShape.validPositions).toEqual(stacked ? ColumnChart.stackedValidLabelPositions : ColumnChart.clusteredValidLabelPositions);
            expect(labelDataPoints[5].parentShape.validPositions).toEqual(stacked ? ColumnChart.stackedValidLabelPositions : ColumnChart.clusteredValidLabelPositions);
        });

        it("Label data points have correct position for single series", () => {
            let dataViewMetadata1CategoryDynamicMeasure: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1', queryName: 'col1', roles: { Category: true } },
                    { displayName: 'col2', queryName: 'col2', format: '#,0.0', isMeasure: true, roles: { Y: true } }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                    }
                },
            };

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
                mocks.dataViewScopeIdentity("Delta Force"),
                mocks.dataViewScopeIdentity("Mr Bing"),
            ];

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadata1CategoryDynamicMeasure,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1CategoryDynamicMeasure.columns[0],
                            values: ['John Domo', 'Delta Force', 'Mr Bing'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata1CategoryDynamicMeasure.columns[1],
                            values: [-200, 100, 150],
                            subtotal: 450
                        }]),
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            let labelDataPoints = callCreateLabelDataPoints(v);
            expect(labelDataPoints[0].parentShape.validPositions).toEqual(ColumnChart.clusteredValidLabelPositions);
            expect(labelDataPoints[1].parentShape.validPositions).toEqual(ColumnChart.clusteredValidLabelPositions);
            expect(labelDataPoints[2].parentShape.validPositions).toEqual(ColumnChart.clusteredValidLabelPositions);
        });

        it("Label data points for null values are not returned", () => {
            let dataViewMetadata1Category2Measure: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1', queryName: 'col1', roles: { Category: true } },
                    { displayName: 'col2', queryName: 'col2', format: '#,0', isMeasure: true, roles: { Y: true } },
                    { displayName: 'col3', queryName: 'col3', format: '#,0', isMeasure: true, roles: { Y: true } }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: undefined,
                    }
                },
            };

            let categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
                mocks.dataViewScopeIdentity("Delta Force"),
                mocks.dataViewScopeIdentity("Mr Bing"),
            ];

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadata1Category2Measure,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['John Domo', 'Delta Force', 'Mr Bing'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata1Category2Measure.columns[1],
                            values: [-200, null, 150],
                            subtotal: 450
                        }, {
                                source: dataViewMetadata1Category2Measure.columns[2],
                                values: [null, 300, 90],
                                subtotal: 630
                            }])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            let labelDataPoints = callCreateLabelDataPoints(v);
            expect(labelDataPoints.length).toEqual(4);
            expect(labelDataPoints[0].text).toEqual("-200");
            expect(labelDataPoints[1].text).toEqual("150");
            expect(labelDataPoints[2].text).toEqual("300");
            expect(labelDataPoints[3].text).toEqual("90");
        });

        function callCreateLabelDataPoints(v: powerbi.IVisual): powerbi.LabelDataPoint[] {
            return (<any>v).layers[0].columnChart.createLabelDataPoints();
        }
    }

    describe("Stacked Column chart label data point creation", () => columnChartLabelDataPointCreation(ColumnChartType.stackedColumn, true));
    describe("Stacked Bar chart label data point creation", () => columnChartLabelDataPointCreation(ColumnChartType.stackedBar, true));
    describe("Clustered Bar chart label data point creation", () => columnChartLabelDataPointCreation(ColumnChartType.clusteredBar, false));
    describe("Clustered Column chart label data point creation", () => columnChartLabelDataPointCreation(ColumnChartType.clusteredColumn, false));

    describe("ColumnChart capabilities which should not support format painter style copy", () => {
        let capabilitiesObjects: powerbi.VisualCapabilities;
        beforeEach(() => {
            capabilitiesObjects = powerbi.visuals.getColumnChartCapabilities().objects;
        });

        it("should not support format painter copy", () => {
            expect(capabilitiesObjects["legend"].properties["titleText"].suppressFormatPainterCopy).toBe(true);
        });

        it("should not support format painter copy", () => {
            expect(capabilitiesObjects["categoryAxis"].properties["start"].suppressFormatPainterCopy).toBe(true);
        });

        it("should not support format painter copy", () => {
            expect(capabilitiesObjects["categoryAxis"].properties["end"].suppressFormatPainterCopy).toBe(true);
        });

        it("should not support format painter copy", () => {
            expect(capabilitiesObjects["valueAxis"].properties["start"].suppressFormatPainterCopy).toBe(true);
        });

        it("should not support format painter copy", () => {
            expect(capabilitiesObjects["valueAxis"].properties["end"].suppressFormatPainterCopy).toBe(true);
        });

        it("should not support format painter copy", () => {
            expect(capabilitiesObjects["labels"].properties["labelDisplayUnits"].suppressFormatPainterCopy).toBe(true);
        });

        it("should not support format painter copy", () => {
            expect(capabilitiesObjects["labels"].properties["labelPrecision"].suppressFormatPainterCopy).toBe(true);
        });
    });
    
    /**
     * Basic builder to help build the data views. Essentially a skeleton at this point. More functionality will be added at a later point.
     */
    class ColumnChartBuilder {

        private metadata: powerbi.DataViewMetadata;
        private objects: powerbi.DataViewObjects;
        private dataView: powerbi.DataView;
        
        /**
         * TODO: 2016-03-28 - ersommer - Remove the DataView from the constructor parameters when the builder is full-featured.
         * It's only passed in so we can use the builder with the existing data views in the tests. 
         */
        public constructor(dataView?: powerbi.DataView) {
            this.dataView = dataView;
            this.metadata = dataView.metadata = dataView.metadata || { columns: [] };
            this.objects = this.metadata.objects = this.metadata.objects || {};
        }

        public withoutShowAll(): ColumnChartBuilder {
            return this.withProperties(false);
        }

        public withShowAll(): ColumnChartBuilder {
            return this.withProperties(true);
        }

        public withProperties(showAll?: boolean): ColumnChartBuilder {

            if (showAll != null) {
                this.setProperty(powerbi.visuals.columnChartProps.dataPoint.showAllDataPoints, showAll);
            }

            return this;
        }

        public build(): powerbi.DataView {

            return this.dataView;
        }

        private setProperty(propertyIdentifier: powerbi.DataViewObjectPropertyIdentifier, value: any) {
            
            let objectName = propertyIdentifier.objectName;
            let object = this.objects[objectName] = this.objects[objectName] || {};

            object[propertyIdentifier.propertyName] = value;
        }
    }

    class ColumnChartVisualBuilder {
        private columnType: ColumnChartType;
        private isMobile: boolean;
        private hasAnimator: boolean;

        constructor(columnType: ColumnChartType) {
            this.columnType = columnType;
        }

        public forMobile(): this {
            this.isMobile = true;
            return this;
        }

        public withAnimator(): this {
            this.hasAnimator = true;
            return this;
        }

        public build(): powerbi.visuals.CartesianChart {
            let chartType: CartesianChartType;
            switch (this.columnType) {
                case ColumnChartType.clusteredBar:
                    chartType = CartesianChartType.ClusteredBar;
                    break;
                case ColumnChartType.clusteredColumn:
                    chartType = CartesianChartType.ClusteredColumn;
                    break;
                case ColumnChartType.hundredPercentStackedBar:
                    chartType = CartesianChartType.HundredPercentStackedBar;
                    break;
                case ColumnChartType.hundredPercentStackedColumn:
                    chartType = CartesianChartType.HundredPercentStackedColumn;
                    break;
                case ColumnChartType.stackedBar:
                    chartType = CartesianChartType.StackedBar;
                    break;
                case ColumnChartType.stackedColumn:
                    chartType = CartesianChartType.StackedColumn;
                    break;
                default:
                    debug.assertFail('unexpected column chart type');
            }

            return new powerbi.visuals.CartesianChart({
                chartType: chartType,
                trimOrdinalDataOnOverflow: this.isMobile ? false : true,
                isScrollable: this.isMobile ? false : true,
                animator: this.hasAnimator ? new WebColumnChartAnimator() : undefined,
                behavior: !this.isMobile ? new CartesianChartBehavior([new ColumnChartWebBehavior()]) : undefined,
            });
        }
    }
}
