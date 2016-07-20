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
    export const comboChartCapabilities: VisualCapabilities = {
        dataRoles: [
            {
                name: 'Category',
                kind: VisualDataRoleKind.Grouping,
                displayName: data.createDisplayNameGetter('Role_ComboChart_Category'),
                description: data.createDisplayNameGetter('Role_ComboChart_CategoryDescription'),
                cartesianKind: CartesianRoleKind.X,
            }, {
                name: 'Series',
                kind: VisualDataRoleKind.Grouping,
                displayName: data.createDisplayNameGetter('Role_ComboChart_Series'),
            }, {
                name: 'Y',
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_ComboChart_Y'),
                description: data.createDisplayNameGetter('Role_ComboChart_YDescription'),
                requiredTypes: [{ numeric: true }, { integer: true }],
                cartesianKind: CartesianRoleKind.Y,
            }, {
                name: 'Y2',
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_ComboChart_Y2'),
                description: data.createDisplayNameGetter('Role_ComboChart_Y2Description'),
                requiredTypes: [{ numeric: true }, { integer: true }],
                cartesianKind: CartesianRoleKind.Y,
            },
        ],
        objects: {
            general: {
                properties: {
                    formatString: StandardObjectProperties.formatString,
                    visualType1: {
                        type: { text: true }
                    },
                    visualType2: {
                        type: { text: true }
                    },
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
            categoryAxis: {
                displayName: data.createDisplayNameGetter('Visual_XAxis'),
                properties: {
                    show: StandardObjectProperties.show,
                    axisScale: StandardObjectProperties.axisScale,
                    start: StandardObjectProperties.axisStart,
                    end: StandardObjectProperties.axisEnd,
                    axisType: StandardObjectProperties.axisType,
                    showAxisTitle: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Title'),
                        description: data.createDisplayNameGetter('Visual_Axis_XTitleDescription'),
                        type: { bool: true }
                    },
                    axisStyle: StandardObjectProperties.axisStyle,
                    labelDisplayUnits: StandardObjectProperties.labelDisplayUnits,
                    labelPrecision: StandardObjectProperties.labelPrecision,
                }
            },
            valueAxis: {
                displayName: data.createDisplayNameGetter('Visual_YAxis'),
                properties: {
                    show: StandardObjectProperties.show,
                    axisLabel: {
                        displayName: data.createDisplayNameGetter('Visual_YAxis_ColumnTitle'),
                        type: { none: true },
                    },
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
                    labelDisplayUnits: StandardObjectProperties.labelDisplayUnits,
                    labelPrecision: StandardObjectProperties.labelPrecision,
                    secShow: {
                        displayName: data.createDisplayNameGetter('Visual_YAxis_ShowSecondary'),
                        type: { bool: true },
                    },
                    secAxisLabel: {
                        displayName: data.createDisplayNameGetter('Visual_YAxis_LineTitle'),
                        type: { none: true },
                    },
                    secPosition: {
                        displayName: data.createDisplayNameGetter('Visual_YAxis_Position'),
                        type: { enumeration: yAxisPosition.type },
                    },
                    secAxisScale: StandardObjectProperties.axisScale,
                    secStart: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Start'),
                        description: data.createDisplayNameGetter('Visual_Axis_StartDescription'),
                        type: { numeric: true },
                    },
                    secEnd: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_End'),
                        description: data.createDisplayNameGetter('Visual_Axis_EndDescription'),
                        type: { numeric: true },
                    },
                    secShowAxisTitle: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Title'),
                        description: data.createDisplayNameGetter('Visual_Axis_YTitleDescription'),
                        type: { bool: true },
                    },
                    secAxisStyle: StandardObjectProperties.axisStyle,
                    secLabelDisplayUnits: StandardObjectProperties.labelDisplayUnits,
                    secLabelPrecision: StandardObjectProperties.labelPrecision,
                }
            },
            dataPoint: {
                displayName: data.createDisplayNameGetter('Visual_DataPoint'),
                description: data.createDisplayNameGetter('Visual_DataPointDescription'),
                properties: {
                    defaultColor: $.extend({}, StandardObjectProperties.defaultColor, {
                        displayName: data.createDisplayNameGetter('Visual_DefaultColumnColor'),
                    }),
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
            labels: {
                displayName: data.createDisplayNameGetter('Visual_DataPointsLabels'),
                description: data.createDisplayNameGetter('Visual_DataPointsLabelsDescription'),
                properties: {
                    show: StandardObjectProperties.show,
                    color: StandardObjectProperties.dataColor,
                    labelDisplayUnits: StandardObjectProperties.dataLabelDisplayUnits,
                    labelPrecision: $.extend({}, StandardObjectProperties.labelPrecision, {
                        suppressFormatPainterCopy: true,
                    }),
                    fontSize: StandardObjectProperties.fontSize,
                    labelDensity: {
                        displayName: data.createDisplayNameGetter('Visual_LabelDensity'),
                        type: { formatting: { labelDensity: true } },
                    },
                },
            },
            plotArea: {
                displayName: data.createDisplayNameGetter('Visual_Plot'),
                properties: {
                    transparency: StandardObjectProperties.transparency,
                    image: StandardObjectProperties.image,
                },
            },
            trend: {
                displayName: data.createDisplayNameGetter('Visual_Trend_Line'),
                properties: {
                    show: {
                        type: { bool: true }
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
                    useHighlightValues: {
                        displayName: data.createDisplayNameGetter('Visual_Trend_Line_UseHighlightValues'),
                        description: data.createDisplayNameGetter('Visual_Trend_Line_UseHighlightValues_Description'),
                        type: { bool: true }
                    },
                }
            },
        },
        dataViewMappings: [
            {
                conditions: [
                    { 'Category': { max: 1 }, 'Series': { max: 0 } },
                    { 'Category': { max: 1 }, 'Series': { min: 1, max: 1 }, 'Y': { max: 1 } },
                ],
                categorical: {
                    categories: {
                        for: { in: 'Category' },
                        dataReductionAlgorithm: { window: { count: 100 } }
                    },
                    values: {
                        group: {
                            by: 'Series',
                            select: [
                                { for: { in: 'Y' } }
                            ],
                            dataReductionAlgorithm: { top: { count: 60 } }
                        }
                    },
                    rowCount: { preferred: { min: 2 }, supported: { min: 0 } }
                }
            }, {
                conditions: [
                    { 'Category': { max: 1 }, 'Series': { max: 0 }, 'Y2': { min: 1 } },
                    { 'Category': { max: 1 }, 'Series': { min: 1, max: 1 }, 'Y': { max: 1 }, 'Y2': { min: 1 } },
                ],
                categorical: {
                    categories: {
                        for: { in: 'Category' },
                        dataReductionAlgorithm: { window: { count: 100 } }
                    },
                    values: {
                        select: [
                            { for: { in: 'Y2' } }
                        ],
                    },
                    rowCount: { preferred: { min: 2 }, supported: { min: 0 } }
                },
            }, {
                conditions: [
                    { 'Category': { max: 1 }, 'Series': { max: 0 } },
                    { 'Category': { max: 1 }, 'Series': { min: 1, max: 1 }, 'Y': { max: 1 } },
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
                }
            },
        ],
        supportsHighlight: true,
        sorting: {
            default: {},
        },
        drilldown: {
            roles: ['Category']
        },
    };

    export const comboChartProps = {
        general: {
            formatString: <DataViewObjectPropertyIdentifier>{ objectName: 'general', propertyName: 'formatString' },
        },
        valueAxis: {
            secShow: <DataViewObjectPropertyIdentifier>{ objectName: 'valueAxis', propertyName: 'secShow' },
        },
        legend: {
            labelColor: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'labelColor' },
        },
        dataPoint: {
            showAllDataPoints: <DataViewObjectPropertyIdentifier>{ objectName: 'dataPoint', propertyName: 'showAllDataPoints' },
        },
    };
}