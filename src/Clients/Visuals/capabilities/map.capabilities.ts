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
    export const mapCapabilities: VisualCapabilities = {
        dataRoles: [
            {
                name: 'Category',
                kind: VisualDataRoleKind.Grouping,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Location'),
                description: data.createDisplayNameGetter('Role_DisplayName_LocationMapDescription'),
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
                name: 'Y',
                kind: VisualDataRoleKind.GroupingOrMeasure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Latitude'),
                description: data.createDisplayNameGetter('Role_DisplayName_LatitudeMapDescription'),
                preferredTypes: [
                    { geography: { latitude: true } }
                ],
            }, {
                name: 'X',
                kind: VisualDataRoleKind.GroupingOrMeasure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Longitude'),
                description: data.createDisplayNameGetter('Role_DisplayName_LongitudeMapDescription'),
                preferredTypes: [
                    { geography: { longitude: true } }
                ],
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
                    titleText: StandardObjectProperties.legendTitle,
                    fontSize: StandardObjectProperties.fontSize,
                }
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
                                selector: ['Category', 'X', 'Y'],
                            },
                        },
                    }
                }
            },
            categoryLabels: {
                displayName: data.createDisplayNameGetter('Visual_CategoryLabels'),
                description: data.createDisplayNameGetter('Visual_CategoryLabelsDescription'),
                properties: {
                    show: StandardObjectProperties.show,
                    color: StandardObjectProperties.dataColor,
                    fontSize: StandardObjectProperties.fontSize,
                },
            },
        },
        dataViewMappings: [{
            conditions: [
                { 'Category': { min: 1, max: 1 }, 'Series': { max: 1 }, 'X': { max: 1, kind: VisualDataRoleKind.Measure }, 'Y': { max: 1, kind: VisualDataRoleKind.Measure }, 'Size': { max: 1 }, 'Gradient': { max: 0 } },
                { 'Category': { min: 1, max: 1 }, 'Series': { max: 0 }, 'X': { max: 1, kind: VisualDataRoleKind.Measure }, 'Y': { max: 1, kind: VisualDataRoleKind.Measure }, 'Size': { max: 1 }, 'Gradient': { max: 1 } },
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
                            { bind: { to: 'Gradient' } },
                        ],
                        dataReductionAlgorithm: { top: {} }
                    }
                },
                rowCount: { preferred: { min: 2 } },
                dataVolume: 4,
            }
        }, {
                conditions: [
                    { 'Category': { max: 0 }, 'Series': { max: 1 }, 'X': { max: 1, kind: VisualDataRoleKind.Grouping }, 'Y': { max: 1, kind: VisualDataRoleKind.Grouping }, 'Size': { max: 1 }, 'Gradient': { max: 0 } },
                    { 'Category': { max: 0 }, 'Series': { max: 0 }, 'X': { max: 1, kind: VisualDataRoleKind.Grouping }, 'Y': { max: 1, kind: VisualDataRoleKind.Grouping }, 'Size': { max: 1 }, 'Gradient': { max: 1 } }
                ],
                categorical: {
                    categories: {
                        select: [
                            { bind: { to: 'X' } },
                            { bind: { to: 'Y' } },
                        ],
                        dataReductionAlgorithm: { top: {} }
                    },
                    values: {
                        group: {
                            by: 'Series',
                            select: [
                                { bind: { to: 'Size' } },
                                { bind: { to: 'Gradient' } },
                            ],
                            dataReductionAlgorithm: { top: {} }
                        }
                    },
                    rowCount: { preferred: { min: 2 } },
                    dataVolume: 4,
                },
            }],
        sorting: {
            custom: {},
            implicit: {
                clauses: [{ role: 'Size', direction: SortDirection.Descending }]
            },
        },
        drilldown: {
            roles: ['Category']
        },
    };

    export const mapProps = {
        general: {
            formatString: <DataViewObjectPropertyIdentifier>{ objectName: 'general', propertyName: 'formatString' },
        },
        dataPoint: {
            defaultColor: <DataViewObjectPropertyIdentifier>{ objectName: 'dataPoint', propertyName: 'defaultColor' },
            fill: <DataViewObjectPropertyIdentifier>{ objectName: 'dataPoint', propertyName: 'fill' },
            showAllDataPoints: <DataViewObjectPropertyIdentifier>{ objectName: 'dataPoint', propertyName: 'showAllDataPoints' },
        },
        legend: {
            show: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'show' },
            position: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'position' },
            showTitle: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'showTitle' },
            titleText: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'titleText' },
        },
    };
}