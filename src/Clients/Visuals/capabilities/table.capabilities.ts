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
    export const tableCapabilities: VisualCapabilities = {
        dataRoles: [{
            name: 'Values',
            kind: VisualDataRoleKind.GroupingOrMeasure,
            displayName: data.createDisplayNameGetter('Role_DisplayName_Values'),
        }],
        objects: {
            general: {
                displayName: data.createDisplayNameGetter('Visual_General'),
                properties: {
                    formatString: StandardObjectProperties.formatString,
                    columnWidth: {
                        type: { numeric: true }
                    },
                    totals: {
                        type: { bool: true },
                        displayName: data.createDisplayNameGetter('Visual_Totals'),
                        suppressFormatPainterCopy: true,
                    },
                    autoSizeColumnWidth: {
                        type: { bool: true },
                        displayName: data.createDisplayNameGetter('Visual_Adjust_Column_Width'),
                        suppressFormatPainterCopy: true,
                    },
                    textSize: {
                        displayName: data.createDisplayNameGetter('Visual_TextSize'),
                        type: { numeric: true }
                    },
                },
            },

            grid: {
                displayName: data.createDisplayNameGetter('Visual_Grid'),
                properties: {
                    outlineColor: StandardObjectProperties.outlineColor,
                    outlineWeight: StandardObjectProperties.outlineWeight,
                    gridVertical: {
                        displayName: data.createDisplayNameGetter('Visual_GridVertical'),
                        description: data.createDisplayNameGetter('Visual_GridVertical_Desc'),
                        type: { bool: true }
                    },
                    gridVerticalColor: {
                        displayName: data.createDisplayNameGetter('Visual_GridVertical_Color'),
                        description: data.createDisplayNameGetter('Visual_GridVertical_Color_Desc'),
                        type: { fill: { solid: { color: true } } }
                    },
                    gridVerticalWeight: {
                        displayName: data.createDisplayNameGetter('Visual_GridVertical_Weight'),
                        description: data.createDisplayNameGetter('Visual_GridVertical_Weight_Desc'),
                        type: { numeric: true }
                    },
                    gridHorizontal: {
                        displayName: data.createDisplayNameGetter('Visual_GridHorizontal'),
                        description: data.createDisplayNameGetter('Visual_GridHorizontal_Desc'),
                        type: { bool: true }
                    },
                    gridHorizontalColor: {
                        displayName: data.createDisplayNameGetter('Visual_GridHorizontal_Color'),
                        description: data.createDisplayNameGetter('Visual_GridHorizontal_Color_Desc'),
                        type: { fill: { solid: { color: true } } }
                    },
                    gridHorizontalWeight: {
                        displayName: data.createDisplayNameGetter('Visual_GridHorizontal_Weight'),
                        description: data.createDisplayNameGetter('Visual_GridHorizontal_Weight_Desc'),
                        type: { numeric: true }
                    },
                    rowPadding: {
                        displayName: data.createDisplayNameGetter('Visual_RowPadding'),
                        description: data.createDisplayNameGetter('Visual_RowPadding_Desc'),
                        type: { numeric: true }
                    },
                    imageHeight: {
                        displayName: data.createDisplayNameGetter('Visual_Tablix_ImageHeight'),
                        description: data.createDisplayNameGetter('Visual_Tablix_ImageHeight_Desc'),
                        type: { numeric: true }
                    },
                }
            },

            columnHeaders: {
                displayName: data.createDisplayNameGetter('Visual_Tablix_ColumnHeaders'),
                properties: {
                    outline: StandardObjectProperties.outline,
                    fontColor: StandardObjectProperties.fontColor,
                    backColor: StandardObjectProperties.backColor,
                }
            },

            values: {
                displayName: data.createDisplayNameGetter('Visual_Tablix_Values'),
                properties: {
                    outline: StandardObjectProperties.outline,
                    // backColor overrides backColorPrimary and Secondary (e.g., in the case of conditional formatting)
                    backColor: {
                        type: { fill: { solid: { color: true } } }
                    },
                    fontColorPrimary: {
                        displayName: data.createDisplayNameGetter('Visual_Tablix_FontColorPrimary'),
                        description: data.createDisplayNameGetter('Visual_Tablix_FontColorPrimary_Desc'),
                        type: { fill: { solid: { color: true } } }
                    },
                    backColorPrimary: {
                        displayName: data.createDisplayNameGetter('Visual_Tablix_BackColorPrimary'),
                        description: data.createDisplayNameGetter('Visual_Tablix_BackColorPrimary_Desc'),
                        type: { fill: { solid: { color: true } } }
                    },
                    fontColorSecondary: {
                        displayName: data.createDisplayNameGetter('Visual_Tablix_FontColorSecondary'),
                        description: data.createDisplayNameGetter('Visual_Tablix_FontColorSecondary_Desc'),
                        type: { fill: { solid: { color: true } } }
                    },
                    backColorSecondary: {
                        displayName: data.createDisplayNameGetter('Visual_Tablix_BackColorSecondary'),
                        description: data.createDisplayNameGetter('Visual_Tablix_BackColorSecondary_Desc'),
                        type: { fill: { solid: { color: true } } }
                    },
                    urlIcon: {
                        displayName: data.createDisplayNameGetter('Visual_Tablix_UrlIcon'),
                        description: data.createDisplayNameGetter('Visual_Tablix_UrlIcon_Desc'),
                        type: { bool: true }
                    },
                }
            },

            total: {
                displayName: data.createDisplayNameGetter('Visual_Tablix_TotalGrand'),
                properties: {
                    outline: StandardObjectProperties.outline,
                    fontColor: StandardObjectProperties.fontColor,
                    backColor: StandardObjectProperties.backColor,
                }
            },
        },
        dataViewMappings: [{
            table: {
                rows: {
                    for: { in: 'Values' },
                    dataReductionAlgorithm: { window: { count: 500 } }
                },
                rowCount: { preferred: { min: 1 } }
            },
        }],
        sorting: {
            custom: {},
        },
        suppressDefaultTitle: true,
        supportsSelection: false,
        disableVisualDetails: true,
    };
}