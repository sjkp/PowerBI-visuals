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
                displayName: data.createDisplayNameGetter('Role_DisplayName_Category'),
                description: data.createDisplayNameGetter('Role_DisplayName_CategoryWaterfallDescription')
            }, {
                name: 'Y',
                kind: VisualDataRoleKind.Measure,
                requiredTypes: [{ numeric: true }, { integer: true }],
                displayName: data.createDisplayNameGetter('Role_DisplayName_Y'),
            }
        ],
        objects: {
            general: {
                displayName: data.createDisplayNameGetter('Visual_General'),
                properties: {
                    formatString: StandardObjectProperties.formatString,
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
                        suppressFormatPainterCopy: true,
                    }),
                    labelColor: StandardObjectProperties.labelColor,
                    fontSize: StandardObjectProperties.fontSize,
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
                    show: StandardObjectProperties.show,
                    showAxisTitle: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Title'),
                        description: data.createDisplayNameGetter('Visual_Axis_XTitleDescription'),
                        type: { bool: true }
                    },
                    axisStyle: StandardObjectProperties.axisStyle,
                    labelColor: StandardObjectProperties.labelColor,
                }
            },
            valueAxis: {
                displayName: data.createDisplayNameGetter('Visual_YAxis'),
                properties: {
                    show: StandardObjectProperties.show,
                    position: StandardObjectProperties.yAxisPosition,
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
            y1AxisReferenceLine: {
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
            plotArea: {
                displayName: data.createDisplayNameGetter('Visual_Plot'),
                properties: {
                    transparency: StandardObjectProperties.transparency,
                    image: StandardObjectProperties.image,
                },
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
        sorting: {
            default: {},
        },
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