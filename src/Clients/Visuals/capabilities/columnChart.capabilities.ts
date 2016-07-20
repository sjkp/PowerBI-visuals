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
    export function getColumnChartCapabilities(transposeAxes: boolean = false): VisualCapabilities {
        return {
            dataRoles: [
                {
                    name: 'Category',
                    kind: VisualDataRoleKind.Grouping,
                    displayName: data.createDisplayNameGetter('Role_DisplayName_Axis'),
                    description: data.createDisplayNameGetter('Role_DisplayName_AxisDescription'),
                    cartesianKind: CartesianRoleKind.X,
                }, {
                    name: 'Series',
                    kind: VisualDataRoleKind.Grouping,
                    displayName: data.createDisplayNameGetter('Role_DisplayName_Legend'),
                    description: data.createDisplayNameGetter('Role_DisplayName_LegendDescription')
                }, {
                    name: 'Y',
                    kind: VisualDataRoleKind.Measure,
                    displayName: data.createDisplayNameGetter('Role_DisplayName_Value'),
                    requiredTypes: [{ numeric: true }, { integer: true }],
                    cartesianKind: CartesianRoleKind.Y,
                }, {
                    name: 'Gradient',
                    kind: VisualDataRoleKind.Measure,
                    displayName: data.createDisplayNameGetter('Role_DisplayName_Gradient'),
                    description: data.createDisplayNameGetter('Role_DisplayName_GradientDescription'),
                    requiredTypes: [{ numeric: true }, { integer: true }],
                    joinPredicate: JoinPredicateBehavior.None,
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
                            suppressFormatPainterCopy: true
                        }),
                        labelColor: StandardObjectProperties.labelColor,
                        fontSize: StandardObjectProperties.fontSize,
                    }
                },
                categoryAxis: {
                    displayName: transposeAxes ? data.createDisplayNameGetter('Visual_YAxis') : data.createDisplayNameGetter('Visual_XAxis'),
                    properties: {
                        show: StandardObjectProperties.show,
                        position: StandardObjectProperties.yAxisPosition,
                        axisScale: StandardObjectProperties.axisScale,
                        start: StandardObjectProperties.axisStart,
                        end: StandardObjectProperties.axisEnd,
                        axisType: StandardObjectProperties.axisType,
                        showAxisTitle: {
                            displayName: data.createDisplayNameGetter('Visual_Axis_Title'),
                            description: transposeAxes ? data.createDisplayNameGetter('Visual_Axis_YTitleDescription') : data.createDisplayNameGetter('Visual_Axis_XTitleDescription'),
                            type: { bool: true }
                        },
                        axisStyle: StandardObjectProperties.axisStyle,
                        labelColor: StandardObjectProperties.labelColor,
                        labelDisplayUnits: StandardObjectProperties.labelDisplayUnits,
                        labelPrecision: StandardObjectProperties.labelPrecision,
                    }
                },
                valueAxis: {
                    displayName: transposeAxes ? data.createDisplayNameGetter('Visual_XAxis') : data.createDisplayNameGetter('Visual_YAxis'),
                    properties: {
                        show: StandardObjectProperties.show,
                        position: StandardObjectProperties.yAxisPosition,
                        axisScale: StandardObjectProperties.axisScale,
                        start: StandardObjectProperties.axisStart,
                        end: StandardObjectProperties.axisEnd,
                        intersection: {
                            displayName: data.createDisplayNameGetter('Visual_Axis_Intersection'),
                            type: { numeric: true },
                            placeHolderText: data.createDisplayNameGetter('Visual_Precision_Auto'),
                        },
                        showAxisTitle: {
                            displayName: data.createDisplayNameGetter('Visual_Axis_Title'),
                            description: transposeAxes ? data.createDisplayNameGetter('Visual_Axis_YTitleDescription') : data.createDisplayNameGetter('Visual_Axis_XTitleDescription'),
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
                labels: {
                    displayName: data.createDisplayNameGetter('Visual_DataPointsLabels'),
                    description: data.createDisplayNameGetter('Visual_DataPointsLabelsDescription'),
                    properties: {
                        show: StandardObjectProperties.show,
                        showSeries: {
                            displayName: data.createDisplayNameGetter('Visual_Show'),
                            type: { bool: true }
                        },
                        color: StandardObjectProperties.dataColor,
                        labelDisplayUnits: StandardObjectProperties.dataLabelDisplayUnits,
                        labelPrecision: $.extend({}, StandardObjectProperties.labelPrecision, {
                            suppressFormatPainterCopy: true
                        }),
                        showAll: {
                            displayName: data.createDisplayNameGetter('Visual_LabelSeriesShowAll'),      
                            type: { bool: true }                      
                        },
                        fontSize: StandardObjectProperties.fontSize,
                    },
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
                    { 'Category': { max: 1 }, 'Series': { max: 0 }, 'Gradient': { max: 0 } },
                    { 'Category': { max: 1 }, 'Series': { min: 1, max: 1 }, 'Y': { max: 1 }, 'Gradient': { max: 0 } },
                    { 'Category': { max: 1 }, 'Series': { max: 0 }, 'Y': { min: 0, max: 1 }, 'Gradient': { max: 1 } },
                ],
                categorical: {
                    categories: {
                        for: { in: 'Category' },
                        dataReductionAlgorithm: { window: { count: 100 } }
                    },
                    values: {
                        group: {
                            by: 'Series',
                            select: [{ for: { in: 'Y' } }, { bind: { to: 'Gradient' } }],
                            dataReductionAlgorithm: { top: { count: 60 } }
                        }
                    },
                    rowCount: { preferred: { min: 2 }, supported: { min: 0 } }
                },
            }, {
                conditions: [
                    { 'Category': { max: 1 }, 'Series': { max: 0 }, 'Gradient': { max: 0 } },
                    { 'Category': { max: 1 }, 'Series': { min: 1, max: 1 }, 'Y': { max: 1 }, 'Gradient': { max: 0 } },
                    { 'Category': { max: 1 }, 'Series': { max: 0 }, 'Y': { min: 0, max: 1 }, 'Gradient': { max: 1 } },
                ],
                requiredProperties: [{ objectName: 'trend', propertyName: 'show' }],
                usage: {
                    regression: {
                        combineSeries: { objectName: 'trend', propertyName: 'combineSeries' }
                    },
                },
                categorical: {
                    categories: {
                        for: { in: 'regression.X' },
                    },
                    values: {
                        group: {
                            by: 'regression.Series',
                            select: [{ for: { in: 'regression.Y' } }],
                        },
                    }
                }
            }],
            supportsHighlight: true,
            sorting: {
                default: {},
            },
            drilldown: {
                roles: ['Category']
            },
        };
    }

    export const columnChartProps = {
        dataPoint: {
            defaultColor: <DataViewObjectPropertyIdentifier>{ objectName: 'dataPoint', propertyName: 'defaultColor' },
            fill: <DataViewObjectPropertyIdentifier>{ objectName: 'dataPoint', propertyName: 'fill' },
            showAllDataPoints: <DataViewObjectPropertyIdentifier>{ objectName: 'dataPoint', propertyName: 'showAllDataPoints' },
        },
        general: {
            formatString: <DataViewObjectPropertyIdentifier>{ objectName: 'general', propertyName: 'formatString' },
        },
        categoryAxis: {
            axisType: <DataViewObjectPropertyIdentifier>{ objectName: 'categoryAxis', propertyName: 'axisType' },
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