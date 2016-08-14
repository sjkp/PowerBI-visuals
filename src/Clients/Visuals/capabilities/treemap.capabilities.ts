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
    
    export const treemapRoles = {
        group: 'Group',
        details: 'Details',
        values: 'Values',
        gradient: 'Gradient'
    };
    
    export const treemapCapabilities: VisualCapabilities = {
        dataRoles: [
            {
                name: 'Group',
                kind: VisualDataRoleKind.Grouping,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Group'),
                description: data.createDisplayNameGetter('Role_DisplayName_GroupTreemapDescription')
            }, {
                name: 'Details',
                kind: VisualDataRoleKind.Grouping,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Details'),
            }, {
                name: 'Values',
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
                    labelColor: StandardObjectProperties.labelColor,
                    fontSize: StandardObjectProperties.fontSize,
                }
            },
            dataPoint: {
                displayName: data.createDisplayNameGetter('Visual_DataPoint'),
                description: data.createDisplayNameGetter('Visual_DataPointDescription'),
                properties: {                   
                    fill: {
                        type: { fill: { solid: { color: true } } }
                    },
                    fillRule: {
                        displayName: data.createDisplayNameGetter('Visual_Gradient'),
                        type: { fillRule: {} },
                        rule: {
                            inputRole: 'Gradient',
                            output: {
                                property: 'fill',
                                selector: ['Group'],
                            }
                        }
                    }
                }
            },
            labels: {
                displayName: data.createDisplayNameGetter('Visual_DataPointsLabels'),
                description: data.createDisplayNameGetter('Visual_DataPointsLabelsDescription'),
                properties: {
                    show: StandardObjectProperties.show,
                    color: StandardObjectProperties.dataColor,
                    labelDisplayUnits: StandardObjectProperties.labelDisplayUnits,
                    labelPrecision: StandardObjectProperties.labelPrecision,
                }
            },
            categoryLabels: {
                displayName: data.createDisplayNameGetter('Visual_CategoryLabels'),
                description: data.createDisplayNameGetter('Visual_CategoryLabelsDescription'),
                properties: {
                    show: StandardObjectProperties.show,
                },
            },
        },
        dataViewMappings: [{
            conditions: [
                { 'Group': { max: 1 }, 'Details': { max: 0 }, 'Gradient': { max: 1 } },
                { 'Group': { max: 1 }, 'Details': { min: 1, max: 1 }, 'Values': { max: 1 }, 'Gradient': { max: 0 } }
            ],
            categorical: {
                categories: {
                    for: { in: 'Group' },
                    dataReductionAlgorithm: { top: {} }
                },
                values: {
                    group: {
                        by: 'Details',
                        select: [{ bind: { to: 'Values' } }, { bind: { to: 'Gradient' } }],
                        dataReductionAlgorithm: { top: {} }
                    }
                },
                rowCount: { preferred: { min: 2 } }
            }
        }],
        supportsHighlight: true,
        sorting: {
            custom: {},
            implicit: {
                clauses: [{ role: 'Values', direction: SortDirection.Descending }]
            },
        },
        drilldown: {
            roles: ['Group']
        },
    };
    
    export const treemapProps = {
        general: {
            formatString: <DataViewObjectPropertyIdentifier>{ objectName: 'general', propertyName: 'formatString' },
        },
        dataPoint: {
            fill: <DataViewObjectPropertyIdentifier>{ objectName: 'dataPoint', propertyName: 'fill' },
        },
        legend: {
            show: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'show' },
            position: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'position' },
            showTitle: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'showTitle' },
            titleText: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'titleText' },
            labelColor: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'labelColor' },
        },
        labels: {
            show: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'show' },
            color: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'color' },
            labelDisplayUnits: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'labelDisplayUnits' },
            labelPrecision: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'labelPrecision' },
        },
        categoryLabels: {
            show: <DataViewObjectPropertyIdentifier>{ objectName: 'categoryLabels', propertyName: 'show' },
        },
    };
}