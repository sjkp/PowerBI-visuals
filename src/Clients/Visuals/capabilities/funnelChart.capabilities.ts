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
    export const funnelChartCapabilities: VisualCapabilities = {
        dataRoles: [
            {
                name: 'Category',
                kind: VisualDataRoleKind.Grouping,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Group'),
                description: data.createDisplayNameGetter('Role_DisplayName_GroupFunnelDescription')
            }, {
                name: 'Y',
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Values'),
                description: data.createDisplayNameGetter('Role_DisplayName_ValuesDescription'),
                requiredTypes: [{ numeric: true }, { integer: true }],
            }, {
                name: 'Gradient',
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Gradient'),
                description: data.createDisplayNameGetter('Role_DisplayName_GradientDescription'),
                requiredTypes: [{ numeric: true }, { integer: true }],
            }
        ],
        dataViewMappings: [{
            conditions: [
                // NOTE: Ordering of the roles prefers to add measures to Y before Gradient.
                { 'Category': { max: 0 }, 'Gradient': { max: 0 } },
                { 'Category': { max: 1 }, 'Y': { max: 1 }, 'Gradient': { max: 1 } },
            ],
            categorical: {
                categories: {
                    for: { in: 'Category' },
                    dataReductionAlgorithm: { top: {} }
                },
                values: {
                    select: [{ for: { in: 'Y' } }, { bind: { to: 'Gradient' } }],
                    dataReductionAlgorithm: { top: {} }
                },
                rowCount: { preferred: { min: 1 } }
            },
        }],
        objects: {
            general: {
                displayName: data.createDisplayNameGetter('Visual_General'),
                properties: {
                    formatString: {
                        type: { formatting: { formatString: true } },
                    },
                },
            },
            dataPoint: {
                displayName: data.createDisplayNameGetter('Visual_DataPoint'),
                description: data.createDisplayNameGetter('Visual_DataPointDescription'),
                properties: {
                    defaultColor: {
                        displayName: data.createDisplayNameGetter('Visual_DefaultColor'),
                        type: { fill: { solid: { color: true } } }
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
                    labelPosition: {
                        displayName: data.createDisplayNameGetter('Visual_Position'),
                        type: { enumeration: labelPosition.type }
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
        },
        supportsHighlight: true,
        sorting: {
            default: {},
        },
        drilldown: {
            roles: ['Category']
        },
    };

    export const funnelChartProps = {
        general: {
            formatString: <DataViewObjectPropertyIdentifier>{ objectName: 'general', propertyName: 'formatString' },
        },
        dataPoint: {
            defaultColor: <DataViewObjectPropertyIdentifier>{ objectName: 'dataPoint', propertyName: 'defaultColor' },
            fill: <DataViewObjectPropertyIdentifier>{ objectName: 'dataPoint', propertyName: 'fill' },
        },
    };
}