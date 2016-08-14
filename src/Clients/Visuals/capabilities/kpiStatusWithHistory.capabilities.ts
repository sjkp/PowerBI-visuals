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
    export const KPIStatusWithHistoryCapabilities: VisualCapabilities = {
        dataRoles: [
            {
                name: 'Indicator',
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_KPI_Indicator'),
                description: data.createDisplayNameGetter('Role_DisplayName_KPI_IndicatorDescription')
            }, {
                name: 'TrendLine',
                kind: VisualDataRoleKind.Grouping,
                displayName: data.createDisplayNameGetter('Role_DisplayName_KPI_TrendLine'),
                description: data.createDisplayNameGetter('Role_DisplayName_KPI_Trendline_Description')
            }, {
                name: 'Goal',
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_KPI_Goal'),
                description: data.createDisplayNameGetter('Role_DisplayName_KPI_GoalDescription')
            }],
        dataViewMappings: [{
            conditions: [
                { 'Indicator': { max: 1 }, 'TrendLine': { max: 1 }, 'Goal': { max: 2 } },
            ],
            categorical: {
                categories: {
                    for: { in: 'TrendLine' },
                    dataReductionAlgorithm: { top: {} }
                },
                values: {
                    select: [
                        { bind: { to: 'Indicator' } },
                        { bind: { to: 'Goal' } }
                    ]
                }
            },
        }],
        objects: {
            general: {
                properties: {
                    formatString: StandardObjectProperties.formatString,
                },
            },
            indicator: {
                displayName: data.createDisplayNameGetter('Role_DisplayName_KPI_Indicator'),
                description: data.createDisplayNameGetter('Role_DisplayName_KPI_IndicatorDescription'),
                properties: {
                    indicatorDisplayUnits: {
                        displayName: data.createDisplayNameGetter('Visual_DisplayUnits'),
                        description: data.createDisplayNameGetter('Visual_DisplayUnitsDescription'),
                        type: { formatting: { labelDisplayUnits: true } }
                    },
                    indicatorPrecision: {
                        displayName: data.createDisplayNameGetter('Visual_Precision'),
                        description: data.createDisplayNameGetter('Visual_PrecisionDescription'),
                        placeHolderText: data.createDisplayNameGetter('Visual_Precision_Auto'),
                        type: { numeric: true }
                    },
                    kpiFormat: {
                        displayName: data.createDisplayNameGetter('TaskPane_Format'),
                        type: { text: true },
                    }
                }
            },
            trendline: {
                displayName: data.createDisplayNameGetter('Role_DisplayName_KPI_TrendLine'),
                description: data.createDisplayNameGetter('Role_DisplayName_KPI_Trendline_Description'),
                properties: {
                    show: StandardObjectProperties.show,
                }
            },
            goals: {
                displayName: data.createDisplayNameGetter('Role_DisplayName_KPI_Goals'),
                description: data.createDisplayNameGetter('Role_DisplayName_KPI_Goals'),
                properties: {
                    showGoal: {
                        displayName: data.createDisplayNameGetter('Role_DisplayName_KPI_Show_Goal'),
                        type: { bool: true }
                    },
                    showDistance: {
                        displayName: data.createDisplayNameGetter('Role_DisplayName_KPI_Show_Distance'),
                        type: { bool: true }
                    },
                }
            },
            status: {
                displayName: data.createDisplayNameGetter('Role_DisplayName_KPI_Status'),
                description: data.createDisplayNameGetter('Role_DisplayName_KPI_Status'),
                properties: {
                    direction: {
                        displayName: data.createDisplayNameGetter('Visual_KPI_Direction'),
                        type: { enumeration: kpiDirection.type }
                    }
                }
            }
        },
    };
}