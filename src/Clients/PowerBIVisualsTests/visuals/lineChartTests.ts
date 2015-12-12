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
    import DataViewObjects = powerbi.DataViewObjects;
    import DataViewPivotCategorical = powerbi.data.DataViewPivotCategorical;
    import DataViewTransform = powerbi.data.DataViewTransform;
    import LineChart = powerbi.visuals.LineChart;
    import SVGUtil = powerbi.visuals.SVGUtil;
    import SelectionId = powerbi.visuals.SelectionId;
    import ValueType = powerbi.ValueType;
    import PrimitiveType = powerbi.PrimitiveType;
    import Helpers = powerbitests.helpers;
    import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
    import PixelConverter = jsCommon.PixelConverter;

    let labelColor = powerbi.visuals.dataLabelUtils.defaultLabelColor;

    powerbitests.mocks.setLocale();

    describe("LineChart Dataview Validation", () => {
        let blankCategoryValue = '(Blank)';
        let dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    queryName: 'col1',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                },
                {
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                },
                {
                    displayName: 'col3',
                    queryName: 'col3',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                },
                {
                    displayName: 'col4',
                    queryName: 'col4',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                },
                {
                    // for secondary grouping (legend/series)
                    displayName: 'col5',
                    queryName: 'col5',
                    isMeasure: false,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                },
            ]
        };
        let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });

        let hostServices = powerbitests.mocks.createVisualHostServices();
        let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

        it('LineChart registered capabilities', () => {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('lineChart').capabilities).toBe(powerbi.visuals.lineChartCapabilities);
        });

        it('LineChart registered customizeQuery', () => {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('lineChart').customizeQuery).toBe(LineChart.customizeQuery);
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

        it('CustomizeQuery picks sample based on data type', () => {
            let objects: DataViewObjects = {
                categoryAxis: {}
            };
            let dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime), objects);

            LineChart.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            expect(dataViewMapping.categorical.categories.dataReductionAlgorithm).toEqual({ sample: {} });
        });

        it('CustomizeQuery picks top based on data type', () => {
            let objects: DataViewObjects = {
                categoryAxis: {}
            };
            let dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text), objects);

            LineChart.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            expect(dataViewMapping.categorical.categories.dataReductionAlgorithm).toEqual({ top: {} });
        });

        it('CustomizeQuery no category', () => {
            let objects: DataViewObjects = {
                categoryAxis: {}
            };
            let dataViewMapping = createCompiledDataViewMapping(null, objects);

            LineChart.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            expect(dataViewMapping.categorical.categories.dataReductionAlgorithm).toEqual({ top: {} });
        });

        it('CustomizeQuery explicit scalar axis on non-scalar type', () => {
            let objects: DataViewObjects = {
                categoryAxis: {
                    axisType: 'Scalar'
                }
            };
            let dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text), objects);

            LineChart.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            expect(dataViewMapping.categorical.categories.dataReductionAlgorithm).toEqual({ top: {} });
        });

        it('CustomizeQuery explicit categorical axis on scalar type', () => {
            let objects: DataViewObjects = {
                categoryAxis: {
                    axisType: 'Scalar'
                }
            };
            let dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text), objects);

            LineChart.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            expect(dataViewMapping.categorical.categories.dataReductionAlgorithm).toEqual({ top: {} });
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
            })).toEqual(['Category']);
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
                        dataReductionAlgorithm: { top: {} }
                    },
                    values: {
                        group: {
                            by: { role: 'Series', items: [{ queryName: 's1', type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) }] },
                            select: [
                                { for: { in: { role: 'Y', items: [{ queryName: 'y1', type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer) }] } } }
                            ],
                            dataReductionAlgorithm: { top: {} }
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

        it('Check convert categorical + fill color', () => {
            let seriesColor = '#41BEE0';
            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    dataViewMetadata.columns[0],
                    powerbi.Prototype.inherit(dataViewMetadata.columns[1], c => c.objects = { dataPoint: { fill: { solid: { color: seriesColor } } } }),
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
            let selectionId = SelectionId.createWithMeasure('col2');
            let key = selectionId.getKey();
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultPointLabelSettings();

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
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 0 }),
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
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 1 }),
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
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 2 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings: defaultLabelSettings,
                        },
                    ],
                    identity: SelectionId.createWithMeasure('col2'),
                    selected: false,
                }];

            expect(actualData).toEqual(expectedData);
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
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultPointLabelSettings();
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
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey1, catIdx: 0 }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings:defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 200,
                                categoryIndex: 1,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }],
                                identity: seriesId1,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey1, catIdx: 1 }),
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
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey1, catIdx: 2 }),
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
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey2, catIdx: 0 }),
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
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey2, catIdx: 1 }),
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
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey2, catIdx: 2 }),
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
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey3, catIdx: 0 }),
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
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey3, catIdx: 1 }),
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
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey3, catIdx: 2 }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings: defaultLabelSettings,
                            },
                        ],
                        identity: seriesId3,
                        selected: false,
                    },
                ];

            expect(actualData).toEqual(expectedData);
        });

        it('Check convert categorical multi-series', () => {
            let seriesId1 = SelectionId.createWithMeasure('col2');
            let seriesKey1 = seriesId1.getKey();
            let seriesId2 = SelectionId.createWithMeasure('col3');
            let seriesKey2 = seriesId2.getKey();
            let seriesId3 = SelectionId.createWithMeasure('col4');
            let seriesKey3 = seriesId3.getKey();
            dataViewMetadata.objects = undefined;
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
                        }]),
                },
            };

            let seriesColors = [
                colors.getColorByIndex(0).value,
                colors.getColorByIndex(1).value,
                colors.getColorByIndex(2).value,
            ];
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultPointLabelSettings();

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
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey1, catIdx: 0 }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings:defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 200,
                                categoryIndex: 1,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }],
                                identity: seriesId1,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey1, catIdx: 1 }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings:defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 700,
                                categoryIndex: 2,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                                identity: seriesId1,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey1, catIdx: 2 }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings:defaultLabelSettings,
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
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey2, catIdx: 0 }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings:defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 100,
                                categoryIndex: 1,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col3", value: "100" }],
                                identity: seriesId2,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey2, catIdx: 1 }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings:defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 200,
                                categoryIndex: 2,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col3", value: "200" }],
                                identity: seriesId2,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey2, catIdx: 2 }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings:defaultLabelSettings,
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
                        labelSettings:actualData[2].labelSettings,
                        data: [
                            {
                                categoryValue: 'John Domo',
                                value: 200,
                                categoryIndex: 0,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col4", value: "200" }],
                                identity: seriesId3,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey3, catIdx: 0 }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings:defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 700,
                                categoryIndex: 1,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col4", value: "700" }],
                                identity: seriesId3,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey3, catIdx: 1 }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings:defaultLabelSettings,
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 100,
                                categoryIndex: 2,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col4", value: "100" }],
                                identity: seriesId3,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey3, catIdx: 2 }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings:defaultLabelSettings,
                            },
                        ],
                        identity: seriesId3,
                        selected: false,
                    },
                ];

            expect(actualData).toEqual(expectedData);
        });

        it('Check convert categorical dynamic series with undefined grouped',() => {
            dataViewMetadata.objects = undefined;
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
                        }],
                        undefined,
                        dataViewMetadata.columns[4]),
                },
            };

            // set grouped() to return an empty array
            dataView.categorical.values.grouped = () => [];

            let actualData = LineChart.converter(dataView, blankCategoryValue, colors, false);

            expect(actualData.series.length).toBe(3);
        });

        it('Check convert non-category multi-measure + fill colors', () => {
            let seriesColors = [
                '#41BEE0',
                '#41BEE1',
            ];

            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    powerbi.Prototype.inherit(dataViewMetadata.columns[0], c => c.objects = { dataPoint: { fill: { solid: { color: seriesColors[0] } } } }),
                    powerbi.Prototype.inherit(dataViewMetadata.columns[1], c => c.objects = { dataPoint: { fill: { solid: { color: seriesColors[1] } } } }),
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
            let ids = [SelectionId.createWithMeasure('col1'), SelectionId.createWithMeasure('col2')];
            let keys = [ids[0].getKey(), ids[1].getKey()];
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultPointLabelSettings();
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
                        labelSettings:actualData[0].labelSettings,
                        data: [
                            {
                                categoryValue: blankCategoryValue,
                                value: 100,
                                categoryIndex: 0,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "100" }],
                                identity: ids[0],
                                selected: false,
                                key: JSON.stringify({ ser: keys[0], catIdx: 0 }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings:defaultLabelSettings,
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
                                tooltipInfo: [{ displayName: "col2", value: "200" }],
                                identity: ids[1],
                                selected: false,
                                key: JSON.stringify({ ser: keys[1], catIdx: 0 }),
                                labelFill: labelColor,
                                labelFormatString: undefined,
                                labelSettings:defaultLabelSettings,
                            }
                        ],
                        identity: ids[1],
                        selected: false
                    }
                ];

            expect(actualData).toEqual(expectSlices);
        });

        it('Check convert date time', () => {
            let dateTimeColumnsMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'Date', queryName: 'Date', type: ValueType.fromDescriptor({ dateTime: true }) },
                    { displayName: 'PowerBI Customers', queryName: 'PowerBI Customers', isMeasure: true }]
            };

            let dataView: powerbi.DataView = {
                metadata: dateTimeColumnsMetadata,
                categorical: {
                    categories: [{
                        source: dateTimeColumnsMetadata.columns[0],
                        values: [new Date('2014/9/25'), new Date('2014/12/12'), new Date('2015/9/25')],
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dateTimeColumnsMetadata.columns[1],
                        values: [8000, 20000, 1000000],
                    }])
                }
            };
            let selectionId = SelectionId.createWithMeasure('PowerBI Customers');
            let key = selectionId.getKey();
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultPointLabelSettings();
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
                    labelSettings:actualData[0].labelSettings,
                    data: [
                        {
                            categoryValue: new Date('2014/9/25').getTime(),
                            value: 8000,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "9/25/2014 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "8000" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 0 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings:defaultLabelSettings,
                        },
                        {
                            categoryValue: new Date('2014/12/12').getTime(),
                            value: 20000,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "12/12/2014 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "20000" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 1 }),
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
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 2 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings:defaultLabelSettings,
                        },
                    ],
                    identity: selectionId,
                    selected: false
                }];

            expect(actualData).toEqual(expectedData);
        });

        it('Check convert datetime category with null category value', () => {
            let dateTimeColumnsMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'Date', queryName: 'Date', type: ValueType.fromDescriptor({ dateTime: true }) },
                    { displayName: 'PowerBI Customers', queryName: 'PowerBI Customers', isMeasure: true }]
            };

            let dataView: powerbi.DataView = {
                metadata: dateTimeColumnsMetadata,
                categorical: {
                    categories: [{
                        source: dateTimeColumnsMetadata.columns[0],
                        values: [null, new Date('2014/9/25'), new Date('2014/12/12'), new Date('2015/9/25')]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dateTimeColumnsMetadata.columns[1],
                        values: [30000, 8000, 20000, 1000000],
                    }])
                }
            };
            let selectionId = SelectionId.createWithMeasure('PowerBI Customers');
            let key = selectionId.getKey();
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultPointLabelSettings();
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
                    labelSettings:actualData[0].labelSettings,
                    data: [
                        {
                            categoryValue: new Date('2014/9/25').getTime(),
                            value: 8000,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "9/25/2014 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "8000" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 1 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings:defaultLabelSettings,
                        },
                        {
                            categoryValue: new Date('2014/12/12').getTime(),
                            value: 20000,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "12/12/2014 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "20000" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 2 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings:defaultLabelSettings,
                        },
                        {
                            categoryValue: new Date('2015/9/25').getTime(),
                            value: 1000000,
                            categoryIndex: 3,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "9/25/2015 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "1000000" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 3 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings:defaultLabelSettings,
                        },
                    ],
                    identity: selectionId,
                    selected: false,
                }];

            expect(actualData).toEqual(expectedData);
        });

        it('Check convert categorical with null category value', () => {
            let dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', null, 'Delta Force', 'Jean Tablau']
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
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultPointLabelSettings();
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
                    labelSettings:actualData[0].labelSettings,
                    data: [
                        {
                            categoryValue: 'John Domo',
                            value: 100,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 0 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings:defaultLabelSettings,
                        },
                        {
                            categoryValue: null,
                            value: 300,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "(Blank)" }, { displayName: "col2", value: "300" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 1 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings:defaultLabelSettings,
                        },
                        {
                            categoryValue: 'Delta Force',
                            value: 200,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 2 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings:defaultLabelSettings,
                        },
                        {
                            categoryValue: 'Jean Tablau',
                            value: 700,
                            categoryIndex: 3,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 3 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings:defaultLabelSettings,
                        },
                    ],
                    identity: selectionId,
                    selected: false,
                }];

            expect(actualData).toEqual(expectedData);
        });

        it('Check convert categorical with positive infinity value', () => {
            let dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau']
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
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultPointLabelSettings();
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
                    labelSettings:actualData[0].labelSettings,
                    data: [
                        {
                            categoryValue: 'John Domo',
                            value: 100,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 0 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings:defaultLabelSettings,
                        },
                        {
                            categoryValue: 'Delta Force',
                            value: Number.MAX_VALUE,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "1.7976931348623157E+308" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 1 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings:defaultLabelSettings,
                        },
                        {
                            categoryValue: 'Jean Tablau',
                            value: 700,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 2 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings:defaultLabelSettings,
                        },
                    ],
                    identity: selectionId,
                    selected: false,
                }];

            expect(actualData).toEqual(expectedData);
        });

        it('Check convert categorical with negative infinity value', () => {
            let dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau']
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
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultPointLabelSettings();
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
                    labelSettings:actualData[0].labelSettings,
                    data: [
                        {
                            categoryValue: 'John Domo',
                            value: 100,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 0 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings:defaultLabelSettings,
                        },
                        {
                            categoryValue: 'Delta Force',
                            value: -Number.MAX_VALUE,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "-1.7976931348623157E+308" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 1 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings:defaultLabelSettings,
                        },
                        {
                            categoryValue: 'Jean Tablau',
                            value: 700,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 2 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings:defaultLabelSettings,
                        },
                    ],
                    identity: selectionId,
                    selected: false,
                }];

            expect(actualData).toEqual(expectedData);
        });

        it('Check convert categorical with NaN value', () => {
            let dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau']
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
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultPointLabelSettings();
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
                    labelSettings:actualData[0].labelSettings,
                    data: [
                        {
                            categoryValue: 'John Domo',
                            value: 100,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 0 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings:defaultLabelSettings,
                        },
                        {
                            categoryValue: 'Delta Force',
                            value: null,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Delta Force" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 1 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings:defaultLabelSettings,
                        },
                        {
                            categoryValue: 'Jean Tablau',
                            value: 700,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 2 }),
                            labelFill: labelColor,
                            labelFormatString: undefined,
                            labelSettings:defaultLabelSettings,
                        },
                    ],
                    identity: selectionId,
                    selected: false,
                }];

            expect(actualData).toEqual(expectedData);
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

        function lineChartDomValidation(interactiveChart: boolean) {
            let v: powerbi.IVisual, element: JQuery;
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        queryName: 'col1',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                    },
                    {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        objects: { general: { formatString: '0.000' } },
                    },
                    {
                        displayName: 'col3',
                        queryName: 'col3',
                        isMeasure: false,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime),
                        objects: { general: { formatString: 'd' } },
                    },
                    {
                        displayName: 'col4',
                        queryName: 'col4',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer),
                        objects: { general: { formatString: '0' } },
                    }],
            };
            let dataViewMetadataWithScalarObject = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithScalarObject.objects = { categoryAxis: { scalar: true } };

            beforeEach(() => {
                element = powerbitests.helpers.testDom('500', '500');
                v = powerbi.visuals.visualPluginFactory.create().getPlugin('lineChart').create();
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
                    expect($('.lineChart .axisGraphicsContext .x.axis .tick').length).toBeGreaterThan(0);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(0);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').first().text()).toBe('480K');
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
                    expect($('.interactivity-line').length).toEqual(0);
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
                        expect(graphicsBox.height).toBeCloseTo(405, 0);
                        expect(Helpers.isInRange(graphicsBox.width, 384, 391)).toBe(true);
                        done();
                    }, DefaultWaitForRender);
                }
                else {
                    setTimeout(() => {
                        expect(graphicsBox.height).toBeCloseTo(470, 0);
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
                        { displayName: 'Date', queryName: 'col1', type: ValueType.fromDescriptor({ dateTime: true }) },
                        { displayName: 'PowerBI Customers', queryName: 'col2', isMeasure: true }]
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
                    let ticks = $('.lineChart .axisGraphicsContext .x.axis .tick text');
                    expect(ticks.length).toBe(4);
                    let expectedValues = [
                        'Sep 2014',
                        'Jan 2015',
                        'May 2015',
                        'Sep 2015'];

                    for (let i = 0, ilen = ticks.length; i < ilen; i++) {
                        let tick = $(ticks[i]).text();
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
                        { displayName: 'Date', queryName: 'Date', type: ValueType.fromDescriptor({ dateTime: true }) },
                        { displayName: 'PowerBI Fans', queryName: 'PowerBI Fans', isMeasure: true, type: ValueType.fromDescriptor({ numeric: true }) }]
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
                    expect($('.lineChart .axisGraphicsContext .x.axis .tick').length).toBe(0);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').length).toBe(0);
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
                    expect($('.lineChart .axisGraphicsContext .x.axis .tick').length).toBeGreaterThan(0);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(0);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').first().text()).toBe('0.984');
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
                    
                    let yTranslate = SVGUtil.parseTranslateTransform($('.lineChart .axisGraphicsContext .x.axis').attr('transform')).y;
                    let xTranslate = parseFloat($('.lineChart .axisGraphicsContext').attr('transform').split(',')[0].split('(')[1]);
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
                        let newYTranslate = parseFloat($('.lineChart .axisGraphicsContext .x.axis').attr('transform').split(',')[1].replace('(', ''));
                        let newXTranslate = parseFloat($('.lineChart .axisGraphicsContext').attr('transform').split(',')[0].split('(')[1]);
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
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                        },
                        {
                            displayName: 'col2',
                            queryName: 'col2',
                            isMeasure: true,
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                        },
                        {
                            displayName: 'col3',
                            queryName: 'col3',
                            isMeasure: true,
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
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
                    if (!interactiveChart)
                        expect($('.legendTitle').text()).toBe('sales');
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
                            objects: [{ dataPoint: { fill: { solid: { color: highlightColor } } } },,],
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
                let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultPointLabelSettings();
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
                            labelSettings:actualData[0].labelSettings,
                            data: [
                                {
                                    categoryValue: 'John Domo', value: 100,
                                    categoryIndex: 0,
                                    seriesIndex: 0,
                                    tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                                    identity: seriesId1,
                                    selected: false,
                                    key: JSON.stringify({ ser: seriesKey1, catIdx: 0 }),
                                    labelFill: labelColor,
                                    labelFormatString: undefined,
                                    labelSettings:defaultLabelSettings,
                                },
                                {
                                    categoryValue: 'Delta Force',
                                    value: 200,
                                    categoryIndex: 1,
                                    seriesIndex: 0,
                                    tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }],
                                    identity: seriesId1,
                                    selected: false,
                                    key: JSON.stringify({ ser: seriesKey1, catIdx: 1 }),
                                    labelFill: labelColor,
                                    labelFormatString: undefined,
                                    labelSettings:defaultLabelSettings,
                                },
                                {
                                    categoryValue: 'Jean Tablau',
                                    value: 700,
                                    categoryIndex: 2,
                                    seriesIndex: 0,
                                    tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                                    identity: seriesId1,
                                    selected: false,
                                    key: JSON.stringify({ ser: seriesKey1, catIdx: 2 }),
                                    labelFill: labelColor,
                                    labelFormatString: undefined,
                                    labelSettings:defaultLabelSettings,
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
                            labelSettings:actualData[1].labelSettings,
                            data: [
                                {
                                    categoryValue: 'John Domo',
                                    value: 700,
                                    categoryIndex: 0,
                                    seriesIndex: 1,
                                    tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col3", value: "700" }],
                                    identity: seriesId2,
                                    selected: false,
                                    key: JSON.stringify({ ser: seriesKey2, catIdx: 0 }),
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
                                    selected: false,
                                    key: JSON.stringify({ ser: seriesKey2, catIdx: 1 }),
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
                                    selected: false,
                                    key: JSON.stringify({ ser: seriesKey2, catIdx: 2 }),
                                    labelFill: labelColor,
                                    labelFormatString: undefined,
                                    labelSettings:defaultLabelSettings,
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
                            labelSettings:actualData[2].labelSettings,
                            data: [
                                {
                                    categoryValue: 'John Domo',
                                    value: 200,
                                    categoryIndex: 0,
                                    seriesIndex: 2,
                                    tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col4", value: "200" }],
                                    identity: seriesId3,
                                    selected: false,
                                    key: JSON.stringify({ ser: seriesKey3, catIdx: 0 }),
                                    labelFill: labelColor,
                                    labelFormatString: undefined,
                                    labelSettings:defaultLabelSettings,
                                },
                                {
                                    categoryValue: 'Delta Force',
                                    value: 700,
                                    categoryIndex: 1,
                                    seriesIndex: 2,
                                    tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col4", value: "700" }],
                                    identity: seriesId3,
                                    selected: false,
                                    key: JSON.stringify({ ser: seriesKey3, catIdx: 1 }),
                                    labelFill: labelColor,
                                    labelFormatString: undefined,
                                    labelSettings:defaultLabelSettings,
                                },
                                {
                                    categoryValue: 'Jean Tablau',
                                    value: 100,
                                    categoryIndex: 2,
                                    seriesIndex: 2,
                                    tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col4", value: "100" }],
                                    identity: seriesId3,
                                    selected: false,
                                    key: JSON.stringify({ ser: seriesKey3, catIdx: 2 }),
                                    labelFill: labelColor,
                                    labelFormatString: undefined,
                                    labelSettings:defaultLabelSettings,
                                },
                            ],
                            identity: seriesId3,
                            selected: false,
                        },
                    ];

                expect(actualData).toEqual(expectedData);
            });

            it('line chart non-category multi-measure dom validation', (done) => {
                let metadata: powerbi.DataViewMetadata = {
                    columns: [
                        { displayName: 'col1', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                        { displayName: 'col2', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) }
                    ]
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: metadata,
                        categorical: {
                            values: DataViewTransform.createValueColumns([
                                {
                                    source: dataViewMetadata.columns[0],
                                    values: [100]
                                }, {
                                    source: dataViewMetadata.columns[1],
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
                            properties: { Series: true },
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                        },
                        {
                            displayName: 'col2',
                            queryName: 'col2',
                            properties: { Y: true },
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
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
                    expect($('.lineChart .axisGraphicsContext .x.axis .tick').length).toBe(0);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').length).toBe(0);
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

                    expect($('.lineChart .axisGraphicsContext .x.axis .tick').length).toBe(1);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(0);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('5');
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
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(1);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('30');
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart shows less ticks dom validation', (done) => {
                let dataViewMetadata: powerbi.DataViewMetadata = {
                    columns: [
                        {
                            displayName: 'col1',
                            queryName: 'col1',
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                        },
                        {
                            displayName: 'col2',
                            queryName: 'col2',
                            isMeasure: true,
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
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
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').length).toBe(3);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('6');
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart on small tile shows at least two tick lines dom validation', (done) => {
                v.onResizing({
                    height: 101,
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
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(1);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').first().text()).toBe('0.150');
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('0.160');
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart zero axis line is darkened', (done) => {
                let metadata: powerbi.DataViewMetadata = {
                    columns: [
                        {
                            displayName: 'col1',
                            isMeasure: false,
                            properties: { Series: true },
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                        },
                        {
                            displayName: 'col2',
                            isMeasure: false,
                            properties: { Y: true },
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
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
                v.update({
                    viewport: { height: 320, width: 640 },
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
                
                setTimeout(() => {
                    let tickLabels = $('.lineChart .axisGraphicsContext .x.axis .tick text');
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
                    let tickLabels = $('.lineChart .axisGraphicsContext .x.axis .tick text');
                    let tspans = tickLabels.find('tspan');
                    expect(tspans.length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            });
        }

        describe("lineChart DOM validation", () => lineChartDomValidation(false));

        describe("interactive lineChart DOM validation", () => lineChartDomValidation(true));

        function areaChartDomValidation(interactiveChart: boolean, areaChartType:string) {
            let v: powerbi.IVisual, element: JQuery;
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        queryName: 'col1',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                    },
                    {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                    }]
            };

            beforeEach(() => {
                element = powerbitests.helpers.testDom('500', '500');
                v = powerbi.visuals.visualPluginFactory.create().getPlugin(areaChartType).create();
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
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').first().text()).toBe('480K');
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
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').first().text()).toBe('0.98');
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
                    expect($('.lineChart .axisGraphicsContext .x.axis .tick').length).toBe(0);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').length).toBe(0);
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
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').first().text()).toBe('1');
                    expect(lineChart.getTooltipInfoByPointX(lineChart.data.series[0], 5)[0].value).toBe('1');
                    done();
                }, DefaultWaitForRender);
            });
        }

        describe("areaChart DOM validation", () => areaChartDomValidation(false, 'areaChart'));

        describe("interactive areaChart DOM validation", () => areaChartDomValidation(true, 'areaChart'));
                
        function stackedAreaChartDomValidation(interactiveChart: boolean) {
            let v: powerbi.IVisual, element: JQuery;
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        queryName: 'col1',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                    }, {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                    },
                    {
                        displayName: 'col3',
                        queryName: 'col3',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        isMeasure: true
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
                element = powerbitests.helpers.testDom('500', '500');
                v = powerbi.visuals.visualPluginFactory.create().getPlugin('stackedAreaChart').create();
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
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').first().text()).toBe('0');
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('140');//90 + 50
                    done();
                }, DefaultWaitForRender);
               
            });

            it('Check negative domain on stacked area', (done) => {   
                let valueColumns = DataViewTransform.createValueColumns([
                    {
                        source: dataViewMetadata.columns[1],
                        values: [20, 40, 50, 0, 40],
                        identity: seriesIdentities[0],
                    }, {
                        source: dataViewMetadata.columns[2],
                        values: [90, 34, 56, 0, -100],
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
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').first().text()).toBe('-60');
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('120');
                    done();
                }, DefaultWaitForRender);

            });

            it("Check that data labels are series value and not stack value", () => {  
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

                let labelDataPoints = callCreateLabelDataPoints(v);
                expect(labelDataPoints[0].text).toEqual("20");
                expect(labelDataPoints[1].text).toEqual("40");
                expect(labelDataPoints[2].text).toEqual("50");
                expect(labelDataPoints[3].text).toEqual("0");
                expect(labelDataPoints[4].text).toEqual("90");
                expect(labelDataPoints[5].text).toEqual("90");
                expect(labelDataPoints[6].text).toEqual("34");
                expect(labelDataPoints[7].text).toEqual("56");
                expect(labelDataPoints[8].text).toEqual("0");
                expect(labelDataPoints[9].text).toEqual("50");
            });
        }

        describe("stackedAreaChart DOM validation", () => areaChartDomValidation(false,'stackedAreaChart'));

        describe("interactive stackedAreaChart DOM validation", () => areaChartDomValidation(true, 'stackedAreaChart'));

        describe("stackedAreaChart specific DOM validation", () => stackedAreaChartDomValidation(false));

        describe("stackedAreaChart specific DOM validation", () => stackedAreaChartDomValidation(true));        
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
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Date)
                }, {
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                }],
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('lineChart').create();
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
            expect(title.text().trim()).toBe('12/18/2014');
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
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                },
                {
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                },
                {
                    displayName: 'col3',
                    queryName: 'col3',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
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
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('lineChart').create();

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
    });

    describe("Line Chart Interactivity", () => {
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let v: powerbi.IVisual, element: JQuery;
        let dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    queryName: 'col1',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                }, {
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer)
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
            v = powerbi.visuals.visualPluginFactory.createMobile().getPlugin('lineChart').create();
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
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                }, {
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                }],
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('lineChart').create();
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

            expect(lineChart.selectColumn).toHaveBeenCalledWith(0, true);
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
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                }, {
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                },
                {
                    displayName: 'col3',
                    queryName: 'col3',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                },
                {
                    displayName: 'col4',
                    queryName: 'col4',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                }],
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('lineChart').create();

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
                            values: ['a', 'b', 'c'],
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
            let featureSwitches: powerbi.visuals.MinervaVisualFeatureSwitches = {
                seriesLabelFormattingEnabled: true,
            };
            let metadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
            metadataWithLabels.objects = {
                labels: {
                    show: true,
                    showAll: true,
                }};
            v = powerbi.visuals.visualPluginFactory.createMinerva(featureSwitches).getPlugin('columnChart').create();
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
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                }, {
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                }],
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('150', '75');
            v = powerbi.visuals.visualPluginFactory.createMinerva({
                scrollableVisuals: true,
            }).getPlugin('lineChart').create();

            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { },
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
                let transform = SVGUtil.parseTranslateTransform($('.lineChart .axisGraphicsContext .x.axis .tick').last().attr('transform'));
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
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                    }, {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                    },
                    {
                        displayName: 'col3',
                        queryName: 'col3',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                    }],
            };
            let nonNumericDataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        queryName: 'col1',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                    }, {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                    },
                    {
                        displayName: 'col3',
                        queryName: 'col3',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                    }],
            };

            beforeEach(() => {
                element = powerbitests.helpers.testDom('500', '500');
                v = powerbi.visuals.visualPluginFactory.create().getPlugin('lineChart').create();

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

                let labels = $('.x.axis').children('.tick');
                helpers.assertColorsMatch(labels.find('text').css('fill'), '#ff0000'); 
            });

            it('enumerateObjectInstances: Verify instances on ordinal category axis', () => {

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
                let points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'categoryAxis' });

                expect(points.instances[0].properties['start']).toBeUndefined();
                expect(points.instances[0].properties['end']).toBeUndefined();
                expect(points.instances[0].properties['axisType']).toBeUndefined();

                expect(points.instances[0].properties['show']).toBeDefined;
                expect(points.instances[0].properties['showAxisTitle']).toBeDefined;
                expect(points.instances[0].properties['axisStyle']).toBeDefined;
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
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                }, {
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                }],
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('150', '75');
            v = powerbi.visuals.visualPluginFactory.createMinerva({
                scrollableVisuals: true,
            }).getPlugin('areaChart').create();

            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { },
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
                let transform = SVGUtil.parseTranslateTransform($('.lineChart .axisGraphicsContext .x.axis .tick').last().attr('transform'));
                expect(transform.x).toBeLessThan(element.width());
                expect(SVGUtil.parseTranslateTransform($('.brush').first().attr('transform')).x).toBe('29');
                expect(SVGUtil.parseTranslateTransform($('.brush').first().attr('transform')).y).toBe('140');
                expect(parseInt($('.brush .extent')[0].attributes.getNamedItem('width').value, 10)).toBeGreaterThan(1);
                expect($('.brush .extent')[0].attributes.getNamedItem('x').value).toBe('0');
                done();
            }, DefaultWaitForRender);
        });
    });

    describe("Line Chart Tooltips", () => {
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let v: powerbi.IVisual, element: JQuery;

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('lineChart').create();
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
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                    }, {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
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
            let dataPoint = lineChart.data.series[0];
            let tooltipInfo: powerbi.visuals.TooltipDataItem[] = lineChart.getTooltipInfoByPointX(dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2001' }, { displayName: 'col2', value: '500000' }]);

            pointX = 120;
            tooltipInfo = lineChart.getTooltipInfoByPointX(dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2002' }, { displayName: 'col2', value: '495000' }]);

            pointX = 303;
            tooltipInfo = lineChart.getTooltipInfoByPointX(dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2004' }, { displayName: 'col2', value: '480000' }]);

            pointX = 450;
            tooltipInfo = lineChart.getTooltipInfoByPointX(dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2005' }, { displayName: 'col2', value: '500000' }]);
        });

        it('Scalar xAxis, multi series - closest data point', () => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        queryName: 'col1',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                    }, {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                    },
                    {
                        displayName: 'col3',
                        queryName: 'col3',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        isMeasure: true
                    }],
            };

            let seriesIdentities = [
                mocks.dataViewScopeIdentity('col2'),
                mocks.dataViewScopeIdentity('col3'),
            ];

            let measureColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col2' });

            let valueColumns = DataViewTransform.createValueColumns([
                {
                    source: dataViewMetadata.columns[1],
                    values: [500000, 495000, 490000, 480000, 500000],
                    identity: seriesIdentities[0],
                }, {
                    source: dataViewMetadata.columns[2],
                    values: [null, null, 490000, 480000, 500000],
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

            let lineChart = (<any>v).layers[0];

            spyOn(lineChart, 'selectColumn').and.callThrough();

            v.onDataChanged({
                dataViews: [dataView]
            });

            let pointX: number = 10;
            let dataPoint = lineChart.data.series[0];
            let tooltipInfo: powerbi.visuals.TooltipDataItem[] = lineChart.getTooltipInfoByPointX(dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2001' }, { displayName: 'col3', value: '(Blank)' }, { displayName: 'col2', value: '500000' }]);

            pointX = 120;
            tooltipInfo = lineChart.getTooltipInfoByPointX(dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2002' }, { displayName: 'col3', value: '(Blank)' }, { displayName: 'col2', value: '495000' }]);

            pointX = 303;
            tooltipInfo = lineChart.getTooltipInfoByPointX(dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2004' }, { displayName: 'col3', value: '(Blank)' }, { displayName: 'col2', value: '480000' }]);

            pointX = 450;
            tooltipInfo = lineChart.getTooltipInfoByPointX(dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2005' }, { displayName: 'col3', value: '(Blank)' }, { displayName: 'col2', value: '500000' }]);
        });

        it('Line Chart X and Y-axis show/hide Title ', () => {

            let element = powerbitests.helpers.testDom('500', '500');
            let hostServices = powerbitests.mocks.createVisualHostServices();
            let categoryIdentities = [mocks.dataViewScopeIdentity("John Domo")];
            let v = powerbi.visuals.visualPluginFactory.create().getPlugin('lineChart').create();
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
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
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
            expect($('.xAxisLabel').first().text()).toBe('AxesTitleTest');
            expect($('.yAxisLabel').first().text()).toBe('AxesTitleTest');

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

        it('Non scalar xAxis - closest data point', () => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        queryName: 'col1',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                    }, {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
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
            let dataPoint = lineChart.data.series[0];
            let tooltipInfo: powerbi.visuals.TooltipDataItem[] = lineChart.getTooltipInfoByPointX(dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: 'a' }, { displayName: 'col2', value: '500000' }]);

            pointX = 120;
            tooltipInfo = lineChart.getTooltipInfoByPointX(dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: 'b' }, { displayName: 'col2', value: '495000' }]);

            pointX = 303;
            tooltipInfo = lineChart.getTooltipInfoByPointX(dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: 'd' }, { displayName: 'col2', value: '480000' }]);

            pointX = 450;
            tooltipInfo = lineChart.getTooltipInfoByPointX(dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: 'e' }, { displayName: 'col2', value: '500000' }]);
        });
    });

    describe("label data point creation", () => {
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let v: powerbi.IVisual, element: JQuery;

        beforeEach(() => {
            element = powerbitests.helpers.testDom('150', '75');
            v = powerbi.visuals.visualPluginFactory.createMinerva({
                scrollableVisuals: true,
            }).getPlugin('lineChart').create();

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
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                    }, {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        format: '0.##;-0.##;0',
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
            expect(labelDataPoints[0].text).toEqual("500.00");
            expect(labelDataPoints[1].text).toEqual("300.00");
            expect(labelDataPoints[2].text).toEqual("700.00");
            expect(labelDataPoints[3].text).toEqual("400.00");
            expect(labelDataPoints[4].text).toEqual("100.00");
        });

        it("Label data points have correct default fill", () => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        queryName: 'col1',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                    }, {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
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
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                    }, {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                    }],
                objects: {
                    labels: {
                        show: true,
                        color: { solid: { color: labelColor } },
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: undefined,
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
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                    }, {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                    }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: 1000,
                        labelPosition: undefined,
                        labelPrecision: undefined,
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
            expect(labelDataPoints[0].text).toEqual("5K");
            expect(labelDataPoints[1].text).toEqual("3K");
            expect(labelDataPoints[2].text).toEqual("7K");
            expect(labelDataPoints[3].text).toEqual("4K");
            expect(labelDataPoints[4].text).toEqual("1K");
        });

        it("Label data points have correct precision", () => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        queryName: 'col1',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                    }, {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                    }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: 0,
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
            expect(labelDataPoints[0].text).toEqual("500");
            expect(labelDataPoints[1].text).toEqual("300");
            expect(labelDataPoints[2].text).toEqual("700");
            expect(labelDataPoints[3].text).toEqual("400");
            expect(labelDataPoints[4].text).toEqual("100");
        });

        it("Label data points have correct font size", () => {
            let fontSize = 13;
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        queryName: 'col1',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                    }, {
                        displayName: 'col2',
                        queryName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                    }],
                objects: {
                    labels: {
                        show: true,
                        color: undefined,
                        labelDisplayUnits: undefined,
                        labelPosition: undefined,
                        labelPrecision: 0,
                        fontSize: fontSize,
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
    });

    function callCreateLabelDataPoints(v: powerbi.IVisual): powerbi.LabelDataPoint[] {
        return (<any>v).layers[0].createLabelDataPoints();
    }
}