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
    export const filledMapCapabilities: VisualCapabilities = {
        dataRoles: [
            {
                name: 'Category',
                kind: VisualDataRoleKind.Grouping,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Location'),
                description: data.createDisplayNameGetter('Role_DisplayName_LocationFilledMapDescription'),
                preferredTypes: [
                    { geography: { address: true } },
                    { geography: { city: true } },
                    { geography: { continent: true } },
                    { geography: { country: true } },
                    { geography: { county: true } },
                    { geography: { place: true } },
                    { geography: { postalCode: true } },
                    { geography: { region: true } },
                    { geography: { stateOrProvince: true } },
                ],
            }, {
                name: 'Series',
                kind: VisualDataRoleKind.Grouping,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Legend'),
                description: data.createDisplayNameGetter('Role_DisplayName_LegendDescription')
            }, {
                name: 'X',
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Longitude'),
                description: data.createDisplayNameGetter('Role_DisplayName_LongitudeFilledMapDescription'),
                preferredTypes: [
                    { geography: { longitude: true } }
                ],
            }, {
                name: 'Y',
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Latitude'),
                description: data.createDisplayNameGetter('Role_DisplayName_LatitudeFilledMapDescription'),
                preferredTypes: [
                    { geography: { latitude: true } }
                ],
            }, {
                name: 'Size',
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Values'),
                description: data.createDisplayNameGetter('Role_DisplayName_ValuesDescription'),
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
                        type: { formatting: { legendPosition: true } }
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
                    fontSize: {
                        displayName: data.createDisplayNameGetter('Visual_TextSize'),
                        type: { formatting: { fontSize: true } }
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
                        displayName: data.createDisplayNameGetter('Role_DisplayName_Values'),
                        description: data.createDisplayNameGetter('Role_DisplayName_ValuesDescription'),
                        type: { fillRule: {} },
                        rule: {
                            inputRole: 'Size',
                            output: {
                                property: 'fill',
                                selector: ['Category'],
                            },
                        },
                    }
                }
            },
        },
        dataViewMappings: [{
            conditions: [
                { 'Category': { max: 1 }, 'Series': { max: 1 }, 'X': { max: 1 }, 'Y': { max: 1 }, 'Size': { max: 1 } },
                { 'Category': { max: 1 }, 'Series': { max: 0 }, 'X': { max: 1 }, 'Y': { max: 1 }, 'Size': { max: 1 } }
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
                            { bind: { to: 'X' } },
                            { bind: { to: 'Y' } },
                            { bind: { to: 'Size' } },
                        ],
                        dataReductionAlgorithm: { top: {} }
                    }
                },
                rowCount: { preferred: { min: 2 } }
            },
        }],
        sorting: {
            custom: {},
        },
        drilldown: {
            roles: ['Category']
        },
    };
}