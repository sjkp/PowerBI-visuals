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
    export const waterfallChartCapabilities: VisualCapabilities = {
        dataRoles: [
            {
                name: 'Category',
                kind: VisualDataRoleKind.Grouping,
                description: data.createDisplayNameGetter('Role_DisplayName_CategoryWaterfallDescription')
            }, {
                name: 'Y',
                kind: VisualDataRoleKind.Measure,
                requiredTypes: [{ numeric: true }, { integer: true }],
            }
        ],
        objects: {
            general: {
                displayName: data.createDisplayNameGetter('Visual_General'),
                properties: {
                    formatString: {
                        type: { formatting: { formatString: true } },
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
                    },
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
                }
            },
            sentimentColors: {
                displayName: data.createDisplayNameGetter('Waterfall_SentimentColors'),
                properties: {
                    increaseFill: {
                        displayName: data.createDisplayNameGetter('Waterfall_IncreaseLabel'),
                        type: { fill: { solid: { color: true } } }
                    },
                    decreaseFill: {
                        displayName: data.createDisplayNameGetter('Waterfall_DecreaseLabel'),
                        type: { fill: { solid: { color: true } } }
                    },
                    totalFill: {
                        displayName: data.createDisplayNameGetter('Waterfall_TotalLabel'),
                        type: { fill: { solid: { color: true } } }
                    }
                },
            },
            categoryAxis: {
                displayName: data.createDisplayNameGetter('Visual_XAxis'),
                properties: {
                    show: {
                        displayName: data.createDisplayNameGetter('Visual_Show'),
                        type: { bool: true }
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
                   labelColor: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_LabelColor'),
                        type: { fill: { solid: { color: true } } }
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
                    position: {
                        displayName: data.createDisplayNameGetter('Visual_YAxis_Position'),
                        description: data.createDisplayNameGetter('Visual_YAxis_PositionDescription'),
                        type: { enumeration: yAxisPosition.type }
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
                    labelColor: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_LabelColor'),
                        type: { fill: { solid: { color: true } } }
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
        },
        dataViewMappings: [{
            conditions: [
                { 'Category': { max: 1 }, 'Y': { max: 1 } },
            ],
            categorical: {
                categories: {
                    for: { in: 'Category' },
                    dataReductionAlgorithm: { top: {} }
                },
                values: {
                    select: [{ bind: { to: 'Y' } }]
                },
            },
        }],
        drilldown: {
            roles: ['Category']
        },
    };

    export const waterfallChartProps = {
        general: {
            formatString: <DataViewObjectPropertyIdentifier>{ objectName: 'general', propertyName: 'formatString' },
        },
        sentimentColors: {
            increaseFill: <DataViewObjectPropertyIdentifier>{ objectName: 'sentimentColors', propertyName: 'increaseFill' },
            decreaseFill: <DataViewObjectPropertyIdentifier>{ objectName: 'sentimentColors', propertyName: 'decreaseFill' },
            totalFill: <DataViewObjectPropertyIdentifier>{ objectName: 'sentimentColors', propertyName: 'totalFill' },
        },
        legend: {
            labelColor: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'labelColor' },
        },
    };
}