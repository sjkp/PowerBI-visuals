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
                description: data.createDisplayNameGetter('Role_ComboChart_CategoryDescription')
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
            }, {
                name: 'Y2',
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_ComboChart_Y2'),
                description: data.createDisplayNameGetter('Role_ComboChart_Y2Description'),
                requiredTypes: [{ numeric: true }, { integer: true }],
            },
        ],
        objects: {
            general: {
                properties: {
                    formatString: {
                        type: { formatting: { formatString: true } },
                    },
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
                    show: {
                        displayName: data.createDisplayNameGetter('Visual_Show'),
                        type: { bool: true }
                    },
                    position: {
                        displayName: data.createDisplayNameGetter('Visual_LegendPosition'),
                        description: data.createDisplayNameGetter('Visual_LegendPositionDescription'),
                        type: { enumeration: legendPosition.type }
                    },
                    showTitle: {
                        displayName: data.createDisplayNameGetter('Visual_LegendShowTitle'),
                        description: data.createDisplayNameGetter('Visual_LegendShowTitleDescription'),
                        type: { bool: true }
                    },
                    titleText: {
                        displayName: data.createDisplayNameGetter('Visual_LegendName'),
                        description: data.createDisplayNameGetter('Visual_LegendNameDescription'),
                        type: { text: true }
                    },
                    labelColor: {
                        displayName: data.createDisplayNameGetter('Visual_LegendTitleColor'),
                        type: { fill: { solid: { color: true } } }
                    },
                    fontSize: {
                        displayName: data.createDisplayNameGetter('Visual_TextSize'),
                        type: { formatting: { fontSize: true } }
                    }
                }
            },
            categoryAxis: {
                displayName: data.createDisplayNameGetter('Visual_XAxis'),
                properties: {
                    show: {
                        displayName: data.createDisplayNameGetter('Visual_Show'),
                        type: { bool: true }
                    },
                    axisScale: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Scale'),
                        type: { enumeration: axisScale.type }
                    },
                    start: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Start'),
                        description: data.createDisplayNameGetter('Visual_Axis_StartDescription'),
                        type: { numeric: true }
                    },
                    end: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_End'),
                        description: data.createDisplayNameGetter('Visual_Axis_EndDescription'),
                        type: { numeric: true }
                    },
                    axisType: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Type'),
                        type: { enumeration: axisType.type }
                    },
                    showAxisTitle: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Title'),
                        description: data.createDisplayNameGetter('Visual_Axis_XTitleDescription'),
                        type: { bool: true }
                    },
                    axisStyle: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Style'),
                        type: { enumeration: axisStyle.type }
                    },
                    labelDisplayUnits: {
                        displayName: data.createDisplayNameGetter('Visual_DisplayUnits'),
                        type: { formatting: { labelDisplayUnits: true } }
                    },
                    labelPrecision: {
                        displayName: data.createDisplayNameGetter('Visual_Precision'),
                        placeHolderText: data.createDisplayNameGetter('Visual_Precision_Auto'),
                        type: { numeric: true }
                    }
                }
            },
            valueAxis: {
                displayName: data.createDisplayNameGetter('Visual_YAxis'),
                properties: {
                    show: {
                        displayName: data.createDisplayNameGetter('Visual_Show'),
                        type: { bool: true }
                    },
                    axisLabel: {
                        displayName: data.createDisplayNameGetter('Visual_YAxis_ColumnTitle'),
                        type: { none: true }
                    },
                    position: {
                        displayName: data.createDisplayNameGetter('Visual_YAxis_Position'),
                        type: { enumeration: yAxisPosition.type }
                    },
                    axisScale: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Scale'),
                        type: { enumeration: axisScale.type }
                    },
                    start: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Start'),
                        description: data.createDisplayNameGetter('Visual_Axis_StartDescription'),
                        type: { numeric: true }
                    },
                    end: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_End'),
                        description: data.createDisplayNameGetter('Visual_Axis_EndDescription'),
                        type: { numeric: true }
                    },
                    showAxisTitle: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Title'),
                        description: data.createDisplayNameGetter('Visual_Axis_YTitleDescription'),
                        type: { bool: true }
                    },
                    axisStyle: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Style'),
                        type: { enumeration: axisStyle.type }
                    },
                    labelDisplayUnits: {
                        displayName: data.createDisplayNameGetter('Visual_DisplayUnits'),
                        type: { formatting: { labelDisplayUnits: true } }
                    },
                    labelPrecision: {
                        displayName: data.createDisplayNameGetter('Visual_Precision'),
                        placeHolderText: data.createDisplayNameGetter('Visual_Precision_Auto'),
                        type: { numeric: true }
                    },
                    secShow: {
                        displayName: data.createDisplayNameGetter('Visual_YAxis_ShowSecondary'),
                        type: { bool: true }
                    },
                    secAxisLabel: {
                        displayName: data.createDisplayNameGetter('Visual_YAxis_LineTitle'),
                        type: { none: true }
                    },
                    secPosition: {
                        displayName: data.createDisplayNameGetter('Visual_YAxis_Position'),
                        type: { enumeration: yAxisPosition.type }
                    },
                    secAxisScale: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Scale'),
                        type: { enumeration: axisScale.type }
                    },
                    secStart: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Start'),
                        description: data.createDisplayNameGetter('Visual_Axis_StartDescription'),
                        type: { numeric: true }
                    },
                    secEnd: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_End'),
                        description: data.createDisplayNameGetter('Visual_Axis_EndDescription'),
                        type: { numeric: true }
                    },
                    secShowAxisTitle: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Title'),
                        description: data.createDisplayNameGetter('Visual_Axis_YTitleDescription'),
                        type: { bool: true }
                    },
                    secAxisStyle: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Style'),
                        type: { enumeration: axisStyle.type }
                    },
                    secLabelDisplayUnits: {
                        displayName: data.createDisplayNameGetter('Visual_DisplayUnits'),
                        type: { formatting: { labelDisplayUnits: true } }
                    },
                    secLabelPrecision: {
                        displayName: data.createDisplayNameGetter('Visual_Precision'),
                        placeHolderText: data.createDisplayNameGetter('Visual_Precision_Auto'),
                        type: { numeric: true }
                    }
                }
            },
            dataPoint: {
                displayName: data.createDisplayNameGetter('Visual_DataPoint'),
                description: data.createDisplayNameGetter('Visual_DataPointDescription'),
                properties: {
                    defaultColor: {
                        displayName: data.createDisplayNameGetter('Visual_DefaultColor'),
                        type: { fill: { solid: { color: true } } }
                    },
                    showAllDataPoints: {
                        displayName: data.createDisplayNameGetter('Visual_DataPoint_Show_All'),
                        type: { bool: true }
                    },
                    fill: {
                        displayName: data.createDisplayNameGetter('Visual_Fill'),
                        type: { fill: { solid: { color: true } } }
                    },
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
                    show: {
                        displayName: data.createDisplayNameGetter('Visual_Show'),
                        type: { bool: true }
                    },
                    color: {
                        displayName: data.createDisplayNameGetter('Visual_LabelsFill'),
                        description: data.createDisplayNameGetter('Visual_LabelsFillDescription'),
                        type: { fill: { solid: { color: true } } }
                    },
                    labelDisplayUnits: {
                        displayName: data.createDisplayNameGetter('Visual_DisplayUnits'),
                        description: data.createDisplayNameGetter('Visual_DisplayUnitsDescription'),
                        type: { formatting: { labelDisplayUnits: true } }
                    },
                    labelPrecision: {
                        displayName: data.createDisplayNameGetter('Visual_Precision'),
                        description: data.createDisplayNameGetter('Visual_PrecisionDescription'),
                        placeHolderText: data.createDisplayNameGetter('Visual_Precision_Auto'),
                        type: { numeric: true }
                    },
                    fontSize: {
                        displayName: data.createDisplayNameGetter('Visual_TextSize'),
                        type: { formatting: { fontSize: true } }
                    },
                },
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
                        dataReductionAlgorithm: { top: {} }
                    },
                    values: {
                        group: {
                            by: 'Series',
                            select: [
                                { for: { in: 'Y' } }
                            ],
                            dataReductionAlgorithm: { top: {} }
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
                        dataReductionAlgorithm: { top: {} }
                    },
                    values: {
                        select: [
                            { for: { in: 'Y2' } }
                        ],
                        dataReductionAlgorithm: { top: {} }
                    },
                    rowCount: { preferred: { min: 2 }, supported: { min: 0 } }
                },
            }
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
    };
}