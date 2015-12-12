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
            }, {
                name: 'Y',
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Y'),
                description: data.createDisplayNameGetter('Role_DisplayName_YScatterChartDescription'),
                requiredTypes: [{ numeric: true }, { integer: true }],
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
            }, {
                name: 'Play',
                kind: VisualDataRoleKind.Grouping,
                displayName: 'Play Axis' //TODO: data.createDisplayNameGetter('Role_DisplayName_Play'),
            }
        ],
        objects: {
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
            general: {
                displayName: data.createDisplayNameGetter('Visual_General'),
                properties: {
                    formatString: {
                        type: { formatting: { formatString: true } },
                    },
                },
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
                    position: {
                        displayName: data.createDisplayNameGetter('Visual_YAxis_Position'),
                        description: data.createDisplayNameGetter('Visual_YAxis_PositionDescription'),
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
            categoryLabels: {
                displayName: data.createDisplayNameGetter('Visual_CategoryLabels'),
                description: data.createDisplayNameGetter('Visual_CategoryLabelsDescription'),
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
                    fontSize: {
                        displayName: data.createDisplayNameGetter('Visual_TextSize'),
                        type: { formatting: { fontSize: true } }
                    },
                },
            },
            colorBorder: {
                displayName: data.createDisplayNameGetter('Visual_ColorBorder'),
                properties: {
                    show: {
                        displayName: data.createDisplayNameGetter('Visual_Show'),
                        type: { bool: true }
                    },
                },
            },
            fillPoint: {
                displayName: data.createDisplayNameGetter('Visual_FillPoint'),
                properties: {
                    show: {
                        displayName: data.createDisplayNameGetter('Visual_Fill'),
                        type: { bool: true }
                    },
                },
            },
            colorByCategory: {
                displayName: data.createDisplayNameGetter('Visual_ColorByCategory'),
                properties: {
                    show: {
                        displayName: data.createDisplayNameGetter('Visual_Show'),
                        type: { bool: true }
                    }
                }
            },
            currentFrameIndex: {
                properties: {
                    index: {
                        type: { numeric: true },
                    }
                }
            },
        },
        dataViewMappings: [{
            conditions: [
                { 'Category': { max: 1 }, 'Series': { max: 1 }, 'X': { max: 1 }, 'Y': { max: 1 }, 'Size': { max: 1 }, 'Gradient': { max: 0 }, 'Play': { max: 0 }},
                { 'Category': { max: 1 }, 'Series': { max: 0 }, 'X': { max: 1 }, 'Y': { max: 1 }, 'Size': { max: 1 }, 'Gradient': { max: 1 }, 'Play': { max: 0 } },
            ],
            categorical: {
                categories: {
                    for: { in: 'Category' },
                    dataReductionAlgorithm: { sample: {} }
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
                        dataReductionAlgorithm: { top: {} }
                    }
                },
                rowCount: { preferred: { min: 2 } }
            }
        }, {
            conditions: [
                { 'Category': { max: 1 }, 'Series': { max: 1 }, 'X': { max: 1 }, 'Y': { max: 1 }, 'Size': { max: 1 }, 'Gradient': { max: 0 }, 'Play': { min: 1, max: 1 } },
                { 'Category': { max: 1 }, 'Series': { max: 0 }, 'X': { max: 1 }, 'Y': { max: 1 }, 'Size': { max: 1 }, 'Gradient': { max: 1 }, 'Play': { min: 1, max: 1 } },
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
        }],
        sorting: {
            custom: {},
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
    };
}