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
    export const multiRowCardCapabilities: VisualCapabilities = {
        dataRoles: [
            {
                name: 'Values',
                kind: VisualDataRoleKind.GroupingOrMeasure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Fields'),
                description: data.createDisplayNameGetter('Role_DisplayName_FieldsDescription')
            }
        ],
        objects: {
            general: {
                properties: {
                    formatString: StandardObjectProperties.formatString,
                },
            },
            cardTitle: {
                displayName: data.createDisplayNameGetter('Visual_CardTitle'),
                description: data.createDisplayNameGetter('Visual_CardTitleDescription'),
                properties: {
                    color: StandardObjectProperties.dataColor,
                    fontSize: StandardObjectProperties.fontSize,
                }
            },
            dataLabels: {
                displayName: data.createDisplayNameGetter('Visual_DataPointsLabels'),
                description: data.createDisplayNameGetter('Visual_DataPointsLabelsDescription'),
                properties: {
                    color: StandardObjectProperties.dataColor,
                    fontSize: StandardObjectProperties.fontSize,
                }
            },
            categoryLabels: {
                displayName: data.createDisplayNameGetter('Visual_CategoryLabels'),
                description: data.createDisplayNameGetter('Visual_CategoryLabelsDescription'),
                properties: {
                    show: StandardObjectProperties.show,
                    color: StandardObjectProperties.dataColor,
                    fontSize: StandardObjectProperties.fontSize,
                }
            },
            card: {
                displayName: data.createDisplayNameGetter('Card_ToolTip'),
                properties: {
                    outline: {
                        displayName: data.createDisplayNameGetter('Visual_Outline'),
                        type: { enumeration: outline.type }
                    },
                    outlineColor: {
                        displayName: data.createDisplayNameGetter('Visual_OutlineColor'),
                        description: data.createDisplayNameGetter('Visual_OutlineColor_Desc'),
                        type: { fill: { solid: { color: true } } }
                    },
                    outlineWeight: {
                        displayName: data.createDisplayNameGetter('Visual_OutlineWeight'),
                        description: data.createDisplayNameGetter('Visual_OutlineWeight_Desc'),
                        type: { numeric: true }
                    },
                    barShow: {
                        displayName: data.createDisplayNameGetter('Visual_MultiRowCard_BarShow'),
                        description: data.createDisplayNameGetter('Visual_MultiRowCard_BarShow_Desc'),
                        type: { bool: true }
                    },
                    barColor: {
                        displayName: data.createDisplayNameGetter('Visual_MultiRowCard_BarColor'),
                        type: { fill: { solid: { color: true } } }
                    },
                    barWeight: {
                        displayName: data.createDisplayNameGetter('Visual_MultiRowCard_BarWeight'),
                        description: data.createDisplayNameGetter('Visual_MultiRowCard_BarWeight_Desc'),
                        type: { numeric: true }
                    },
                    cardPadding: {
                        displayName: data.createDisplayNameGetter('Visual_MultiRowCard_CardPadding'),
                        description: data.createDisplayNameGetter('Visual_MultiRowCard_CardBackground'),
                        type: { numeric: true }
                    },
                    cardBackground: {
                        displayName: data.createDisplayNameGetter('Visual_Background'),
                        type: { fill: { solid: { color: true } } }
                    }
                }
            }
        },
        dataViewMappings: [{
            table: {
                rows: {
                    for: { in: 'Values' },
                    dataReductionAlgorithm: { window: {} }
                },
                rowCount: { preferred: { min: 1 } }
            },
        }],
        sorting: {
            default: {},
        },
        suppressDefaultTitle: true,
        supportsSelection: false,
        disableVisualDetails: true,
    };
    
    export const multiRowCardProps = {
        card: {
            outline: <DataViewObjectPropertyIdentifier>{ objectName: 'card', propertyName: 'outline' },
            outlineColor: <DataViewObjectPropertyIdentifier>{ objectName: 'card', propertyName: 'outlineColor' },
            outlineWeight: <DataViewObjectPropertyIdentifier>{ objectName: 'card', propertyName: 'outlineWeight' },
            barShow: <DataViewObjectPropertyIdentifier>{ objectName: 'card', propertyName: 'barShow' },
            barColor: <DataViewObjectPropertyIdentifier>{ objectName: 'card', propertyName: 'barColor' },
            barWeight: <DataViewObjectPropertyIdentifier>{ objectName: 'card', propertyName: 'barWeight' },
            cardPadding: <DataViewObjectPropertyIdentifier>{ objectName: 'card', propertyName: 'cardPadding' },
            cardBackground: <DataViewObjectPropertyIdentifier>{ objectName: 'card', propertyName: 'cardBackground' },

        }
    };
}