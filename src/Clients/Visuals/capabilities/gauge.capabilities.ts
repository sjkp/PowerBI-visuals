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
    export const gaugeRoleNames = {
        y: 'Y',
        minValue: 'MinValue',
        maxValue: 'MaxValue',
        targetValue: 'TargetValue'
    };

    export const gaugeCapabilities: VisualCapabilities = {
        dataRoles: [
            {
                name: gaugeRoleNames.y,
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Value'),
                description: data.createDisplayNameGetter('Role_DisplayName_ValueDescription'),
                requiredTypes: [{ numeric: true }, { integer: true }],
            }, {
                name: gaugeRoleNames.minValue,
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_MinValue'),
                description: data.createDisplayNameGetter('Role_DisplayName_MinValueDescription'),
                requiredTypes: [{ numeric: true }, { integer: true }],
            }, {
                name: gaugeRoleNames.maxValue,
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_MaxValue'),
                description: data.createDisplayNameGetter('Role_DisplayName_MaxValueDescription'),
                requiredTypes: [{ numeric: true }, { integer: true }],
            }, {
                name: gaugeRoleNames.targetValue,
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_TargetValue'),
                description: data.createDisplayNameGetter('Role_DisplayName_TargetValueDescription'),
                requiredTypes: [{ numeric: true }, { integer: true }],
            }
        ],
        objects: {
            general: {
                properties: {
                    formatString: {
                        type: { formatting: { formatString: true } },
                    },
                },
            },
            axis: {
                displayName: data.createDisplayNameGetter('Visual_Gauge_Axis'),
                properties: {
                    min: {
                        displayName: data.createDisplayNameGetter('Visual_Gauge_Axis_Min'),
                        type: { numeric: true }
                    },
                    max: {
                        displayName: data.createDisplayNameGetter('Visual_Gauge_Axis_Max'),
                        type: { numeric: true }
                    },
                    target: {
                        displayName: data.createDisplayNameGetter('Visual_Gauge_Axis_Target'),
                        type: { numeric: true }
                    },
                },
            },
            labels: {
                displayName: data.createDisplayNameGetter('Visual_DataPointsLabels'),
                properties: {
                    show: {
                        type: { bool: true }
                    },
                    color: {
                        displayName: data.createDisplayNameGetter('Visual_LabelsFill'),
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
                    },
                    fontSize: {
                        displayName: data.createDisplayNameGetter('Visual_TextSize'),
                        type: { formatting: { fontSize: true } }
                    },
                },
            },
            calloutValue: {
                displayName: data.createDisplayNameGetter('Visual_Gauge_CalloutValue'),
                properties: {
                    show: {
                        type: { bool: true }
                    },
                    color: {
                        displayName: data.createDisplayNameGetter('Visual_LabelsFill'),
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
                    },
                },
            },
        },
        dataViewMappings: [{
            conditions: [
                { 'Y': { max: 1 }, 'MinValue': { max: 1 }, 'MaxValue': { max: 1 }, 'TargetValue': { max: 1 } },
            ],
            categorical: {
                values: {
                    select: [
                        { bind: { to: 'Y' } },
                        { bind: { to: 'MinValue' } },
                        { bind: { to: 'MaxValue' } },
                        { bind: { to: 'TargetValue' } },
                    ]
                },
            },
        }],
        supportsSelection: false,
    };

}