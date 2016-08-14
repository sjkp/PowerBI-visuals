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

module powerbi.visuals {
    export const scatterChartCapabilities: VisualCapabilities = {
        dataRoles: [
            {
                name: 'Category',
                kind: VisualDataRoleKind.Grouping,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Details'),
                description: data.createDisplayNameGetter('Role_DisplayName_DetailsScatterChartDescription'),
            }, {
                name: 'Series',
                kind: VisualDataRoleKind.Grouping,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Legend'),
                description: data.createDisplayNameGetter('Role_DisplayName_LegendDescription')
            }, {
                name: 'X',
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_X'),
                description: data.createDisplayNameGetter('Role_DisplayName_XScatterChartDescription'),
                requiredTypes: [{ numeric: true }, { integer: true }],
                cartesianKind: CartesianRoleKind.X,
            }, {
                name: 'Y',
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Y'),
                description: data.createDisplayNameGetter('Role_DisplayName_YScatterChartDescription'),
                requiredTypes: [{ numeric: true }, { integer: true }],
                cartesianKind: CartesianRoleKind.Y,
            }, {
                name: 'Size',
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Size'),
                description: data.createDisplayNameGetter('Role_DisplayName_SizeDescription'),
                requiredTypes: [{ numeric: true }, { integer: true }],
            }, {
                name: 'Gradient',
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Gradient'),
                description: data.createDisplayNameGetter('Role_DisplayName_GradientDescription'),
                requiredTypes: [{ numeric: true }, { integer: true }],
                joinPredicate: JoinPredicateBehavior.None,
            }, {
                name: 'Play',
                kind: VisualDataRoleKind.Grouping,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Play'),
            }
        ],
        objects: {
            dataPoint: {
                displayName: data.createDisplayNameGetter('Visual_DataPoint'),
                description: data.createDisplayNameGetter('Visual_DataPointDescription'),
                properties: {
                    defaultColor: StandardObjectProperties.defaultColor,
                    showAllDataPoints: StandardObjectProperties.showAllDataPoints,
                    fill: StandardObjectProperties.fill,
                    fillRule: {
                        displayName: data.createDisplayNameGetter('Visual_Gradient'),
                        type: { fillRule: {} },
                        rule: {
                            inputRole: 'Gradient',
                            output: {
                                property: 'fill',
                                selector: ['Category'],
                            },
                        },
                    }
                }
            },
            general: {
                displayName: data.createDisplayNameGetter('Visual_General'),
                properties: {
                    formatString: StandardObjectProperties.formatString,
                },
            },
            trend: {
                displayName: data.createDisplayNameGetter('Visual_Trend_Line'),
                properties: {
                    show: StandardObjectProperties.show,
                    displayName: {
                        displayName: data.createDisplayNameGetter('Visual_Trend_Line_DisplayName'),
                        description: data.createDisplayNameGetter('Visual_Trend_Line_DisplayName_Description'),
                        type: { text: true } 
                    },
                    lineColor: {
                        displayName: data.createDisplayNameGetter('Visual_Trend_Line_Color'),
                        description: data.createDisplayNameGetter('Visual_Trend_Line_Color_Description'),
                        type: { fill: { solid: { color: true } } }
                    },
                    transparency: {
                        displayName: data.createDisplayNameGetter('Visual_Trend_Line_Transparency'),
                        description: data.createDisplayNameGetter('Visual_Trend_Line_Transparency_Description'),
                        type: { numeric: true }
                    },
                    style: {
                        displayName: data.createDisplayNameGetter('Visual_Trend_Line_Style'),
                        description: data.createDisplayNameGetter('Visual_Trend_Line_Style_Description'),
                        type: { enumeration: lineStyle.type }
                    },
                    combineSeries: {
                        displayName: data.createDisplayNameGetter('Visual_Trend_Line_Combine_Series'),
                        description: data.createDisplayNameGetter('Visual_Trend_Line_Combine_Series_Description'),
                        type: { bool: true }
                    },
                }
            },
            categoryAxis: {
                displayName: data.createDisplayNameGetter('Visual_XAxis'),
                properties: {
                    show: StandardObjectProperties.show,
                    axisScale: StandardObjectProperties.axisScale,
                    start: StandardObjectProperties.axisStart,
                    end: StandardObjectProperties.axisEnd,
                    showAxisTitle: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Title'),
                        description: data.createDisplayNameGetter('Visual_Axis_XTitleDescription'),
                        type: { bool: true }
                    },
                    axisStyle: StandardObjectProperties.axisStyle,
                    labelColor: StandardObjectProperties.labelColor,
                    labelDisplayUnits: StandardObjectProperties.labelDisplayUnits,
                    labelPrecision: StandardObjectProperties.labelPrecision,
                }
            },
            valueAxis: {
                displayName: data.createDisplayNameGetter('Visual_YAxis'),
                properties: {
                    show: StandardObjectProperties.show,
                    position: StandardObjectProperties.yAxisPosition,
                    axisScale: StandardObjectProperties.axisScale,
                    start: StandardObjectProperties.axisStart,
                    end: StandardObjectProperties.axisEnd,
                    showAxisTitle: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Title'),
                        description: data.createDisplayNameGetter('Visual_Axis_YTitleDescription'),
                        type: { bool: true }
                    },
                    axisStyle: StandardObjectProperties.axisStyle,
                    labelColor: StandardObjectProperties.labelColor,
                    labelDisplayUnits: StandardObjectProperties.labelDisplayUnits,
                    labelPrecision: StandardObjectProperties.labelPrecision,
                }
            },
            xAxisReferenceLine: {
                displayName: data.createDisplayNameGetter('Visual_Reference_Line_X'),
                description: data.createDisplayNameGetter('Visual_Reference_Line_Description'),
                properties: {
                    show: StandardObjectProperties.show,
                    displayName: {
                        displayName: data.createDisplayNameGetter('Visual_Reference_Line_DisplayName'),
                        description: data.createDisplayNameGetter('Visual_Reference_Line_DisplayName_Description'),
                        type: { text: true } 
                    },
                    value: {
                        displayName: data.createDisplayNameGetter('Visual_Reference_Line_Value'),
                        description: data.createDisplayNameGetter('Visual_Reference_Line_Value_Description'),
                        type: { numeric: true }
                    },
                    lineColor: StandardObjectProperties.lineColor,
                    transparency: {
                        displayName: data.createDisplayNameGetter('Visual_Reference_Line_Transparency'),
                        description: data.createDisplayNameGetter('Visual_Reference_Line_Transparency_Description'),
                        type: { numeric: true }
                    },
                    style: StandardObjectProperties.referenceLineStyle,
                    position: StandardObjectProperties.referenceLinePosition,
                    dataLabelShow: StandardObjectProperties.dataLabelShow,
                    dataLabelColor: StandardObjectProperties.dataLabelColor,
                    dataLabelDecimalPoints: StandardObjectProperties.dataLabelDecimalPoints,
                    dataLabelHorizontalPosition: StandardObjectProperties.dataLabelHorizontalPosition,
                    dataLabelVerticalPosition: StandardObjectProperties.dataLabelVerticalPosition,
                    dataLabelDisplayUnits: StandardObjectProperties.dataLabelDisplayUnits,
                },
            },
            y1AxisReferenceLine: {
                displayName: data.createDisplayNameGetter('Visual_Reference_Line_Y'),
                description: data.createDisplayNameGetter('Visual_Reference_Line_Description'),
                properties: {
                    show: StandardObjectProperties.show,
                    displayName: {
                        displayName: data.createDisplayNameGetter('Visual_Reference_Line_DisplayName'),
                        description: data.createDisplayNameGetter('Visual_Reference_Line_DisplayName_Description'),
                        type: { text: true } 
                    },
                    value: {
                        displayName: data.createDisplayNameGetter('Visual_Reference_Line_Value'),
                        description: data.createDisplayNameGetter('Visual_Reference_Line_Value_Description'),
                        type: { numeric: true }
                    },
                    lineColor: StandardObjectProperties.lineColor,
                    transparency: {
                        displayName: data.createDisplayNameGetter('Visual_Reference_Line_Transparency'),
                        description: data.createDisplayNameGetter('Visual_Reference_Line_Transparency_Description'),
                        type: { numeric: true }
                    },
                    style: StandardObjectProperties.referenceLineStyle,
                    position: StandardObjectProperties.referenceLinePosition,
                    dataLabelShow: StandardObjectProperties.dataLabelShow,
                    dataLabelColor: StandardObjectProperties.dataLabelColor,
                    dataLabelDecimalPoints: StandardObjectProperties.dataLabelDecimalPoints,
                    dataLabelHorizontalPosition: StandardObjectProperties.dataLabelHorizontalPosition,
                    dataLabelVerticalPosition: StandardObjectProperties.dataLabelVerticalPosition,
                    dataLabelDisplayUnits: StandardObjectProperties.dataLabelDisplayUnits,
                },
            },
            referenceLine: {
                displayName: data.createDisplayNameGetter('Visual_Reference_Line'),
                description: data.createDisplayNameGetter('Visual_Reference_Line_Description'),
                properties: {
                    show: StandardObjectProperties.show,
                    displayName: {
                        displayName: data.createDisplayNameGetter('Visual_Reference_Line_DisplayName'),
                        description: data.createDisplayNameGetter('Visual_Reference_Line_DisplayName_Description'),
                        type: { text: true } 
                    },
                    value: {
                        displayName: data.createDisplayNameGetter('Visual_Reference_Line_Value'),
                        description: data.createDisplayNameGetter('Visual_Reference_Line_Value_Description'),
                        type: { numeric: true }
                    },
                    lineColor: StandardObjectProperties.lineColor,
                    transparency: {
                        displayName: data.createDisplayNameGetter('Visual_Reference_Line_Transparency'),
                        description: data.createDisplayNameGetter('Visual_Reference_Line_Transparency_Description'),
                        type: { numeric: true }
                    },
                    style: StandardObjectProperties.referenceLineStyle,
                    position: StandardObjectProperties.referenceLinePosition,
                    dataLabelShow: StandardObjectProperties.dataLabelShow,
                    dataLabelColor: StandardObjectProperties.dataLabelColor,
                    dataLabelDecimalPoints: StandardObjectProperties.dataLabelDecimalPoints,
                    dataLabelHorizontalPosition: StandardObjectProperties.dataLabelHorizontalPosition,
                    dataLabelVerticalPosition: StandardObjectProperties.dataLabelVerticalPosition,
                    dataLabelDisplayUnits: StandardObjectProperties.dataLabelDisplayUnits,
                },
            },
            legend: {
                displayName: data.createDisplayNameGetter('Visual_Legend'),
                description: data.createDisplayNameGetter('Visual_LegendDescription'),
                properties: {
                    show: StandardObjectProperties.show,
                    position: StandardObjectProperties.legendPosition,
                    showTitle: StandardObjectProperties.showLegendTitle,
                    titleText: $.extend({}, StandardObjectProperties.legendTitle, {
                        suppressFormatPainterCopy: true
                    }),
                    labelColor: StandardObjectProperties.labelColor,
                    fontSize: StandardObjectProperties.fontSize,
                }
            },
            categoryLabels: {
                displayName: data.createDisplayNameGetter('Visual_CategoryLabels'),
                description: data.createDisplayNameGetter('Visual_CategoryLabelsDescription'),
                properties: {
                    show: StandardObjectProperties.show,
                    color: StandardObjectProperties.dataColor,
                    fontSize: StandardObjectProperties.fontSize,
                },
            },
            colorBorder: {
                displayName: data.createDisplayNameGetter('Visual_ColorBorder'),
                properties: {
                    show: StandardObjectProperties.show,
                },
            },
            fillPoint: {
                displayName: data.createDisplayNameGetter('Visual_FillPoint'),
                properties: {
                    show: StandardObjectProperties.show,
                },
            },
            colorByCategory: {
                displayName: data.createDisplayNameGetter('Visual_ColorByCategory'),
                properties: {
                    show: StandardObjectProperties.show,
                }
            },
            currentFrameIndex: {
                properties: {
                    index: {
                        type: { numeric: true },
                    }
                }
            },
            plotArea: {
                displayName: data.createDisplayNameGetter('Visual_Plot'),
                //description: data.createDisplayNameGetter('Visual_PlotDescription'),
                properties: {
                    transparency: StandardObjectProperties.transparency,
                    image: StandardObjectProperties.image,
                },
            },
        },
        dataViewMappings: [{
            conditions: [
                { 'Category': { max: 1 }, 'Series': { max: 1 }, 'X': { max: 1 }, 'Y': { max: 1 }, 'Size': { max: 1 }, 'Gradient': { max: 0 }, 'Play': { max: 0 } },
                { 'Category': { max: 1 }, 'Series': { max: 0 }, 'X': { max: 1 }, 'Y': { max: 1 }, 'Size': { max: 1 }, 'Gradient': { max: 1 }, 'Play': { max: 0 } },
            ],
            categorical: {
                categories: {
                    for: { in: 'Category' },
                },
                values: {
                    group: {
                        by: 'Series',
                        select: [
                            { bind: { to: 'X' } },
                            { bind: { to: 'Y' } },
                            { bind: { to: 'Size' } },
                            { bind: { to: 'Gradient' } },
                        ],
                    }
                },
                rowCount: { preferred: { min: 2 } },
                dataReductionAlgorithm: { sample: {} },
                dataVolume: 4,
            }
        }, {
            conditions: [
                { 'Category': { max: 1 }, 'Series': { max: 1 }, 'X': { max: 1 }, 'Y': { max: 1 }, 'Size': { max: 1 }, 'Gradient': { max: 0 }, 'Play': { min: 1, max: 1 } },
            ],
            // Long term: consider adding the 'name' concept and have this be a reference to the other dataViewMapping above.
            // Then we'd also move the splitting logic of Matrix->Categorical[] into DataViewTransform, and other visuals would benefit.
             matrix: {
                 rows: {
                    select: [
                       { bind: { to: 'Play' } },
                       { bind: { to: 'Category' } },
                    ],
                    /* Explicitly override the server data reduction to make it appropriate for matrix/play. */
                    dataReductionAlgorithm: { bottom: { count: 5000 } }
                },
                columns: {
                    for: { in: 'Series' },
                    /* Explicitly override the server data reduction to make it appropriate for matrix/play. */
                    dataReductionAlgorithm: { top: { count: 60 } }
                },
                values: {
                    select: [
                        { bind: { to: 'X' } },
                        { bind: { to: 'Y' } },
                        { bind: { to: 'Size' } },
                    ]
                }
            }
        }, {
            conditions: [
                { 'Category': { max: 1 }, 'Series': { max: 1 }, 'X': { max: 1 }, 'Y': { max: 1 }, 'Size': { max: 0 }, 'Gradient': { max: 0 }, 'Play': { max: 0 } },
                { 'Category': { max: 1 }, 'Series': { max: 0 }, 'X': { max: 1 }, 'Y': { max: 1 }, 'Size': { max: 0 }, 'Gradient': { max: 1 }, 'Play': { max: 0 } },
            ],
            requiredProperties: [{ objectName: 'trend', propertyName: 'show' }],
            usage: {
               regression: {
                    combineSeries: { objectName: 'trend', propertyName: 'combineSeries' }
                },
            },
            categorical: {
                categories: {
                    for: { in: 'regression.X' }
                },
                values: {
                    group: {
                        by: 'regression.Series',
                        select: [{ for: { in: 'regression.Y' } }],
                    },
                },
                dataReductionAlgorithm: { sample: {} },
                dataVolume: 4,
            }
        }],
        sorting: {
            custom: {},
            implicit: {
                clauses: [{ role: 'Play', direction: SortDirection.Ascending }] //typically a datetime field, sort asc
            },
        },
        drilldown: {
            roles: ['Category']
        },
    };

    export const scatterChartProps = {
        general: {
            formatString: <DataViewObjectPropertyIdentifier>{ objectName: 'general', propertyName: 'formatString' },
        },
        dataPoint: {
            defaultColor: <DataViewObjectPropertyIdentifier>{ objectName: 'dataPoint', propertyName: 'defaultColor' },
            fill: <DataViewObjectPropertyIdentifier>{ objectName: 'dataPoint', propertyName: 'fill' },
        },
        trend: {
            show: <DataViewObjectPropertyIdentifier>{ objectName: 'trend', propertyName: 'show' },
        },
        colorBorder: {
            show: <DataViewObjectPropertyIdentifier>{ objectName: 'colorBorder', propertyName: 'show' },
        },
        fillPoint: {
            show: <DataViewObjectPropertyIdentifier>{ objectName: 'fillPoint', propertyName: 'show' },
        },
        colorByCategory: {
            show: <DataViewObjectPropertyIdentifier>{ objectName: 'colorByCategory', propertyName: 'show' },
        },
        currentFrameIndex: {
            index: <DataViewObjectPropertyIdentifier>{ objectName: 'currentFrameIndex', propertyName: 'index' },
        },
        legend: {
            labelColor: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'labelColor' },
        },
        plotArea: {
            image: <DataViewObjectPropertyIdentifier>{ objectName: 'plotArea', propertyName: 'image' },
            transparency: <DataViewObjectPropertyIdentifier>{ objectName: 'plotArea', propertyName: 'transparency' },
        },
    };
}