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
    import TablixObjects = visuals.controls.internal.TablixObjects;
    import DataViewObjectDefinitions = data.DataViewObjectDefinitions;
    import TableFormattingProperties = visuals.controls.TablixFormattingPropertiesTable;
    import Color = jsCommon.Color;
    import SQExprBuilder = data.SQExprBuilder;

    let valueOrDefault = jsCommon.Utility.valueOrDefault;

    // Default for values common to most presets to avoid repeating declaring them
    const defaultOutlineWeight = TablixObjects.PropGridOutlineWeight.defaultValue;
    const defaultGridlineHorizontalWeight = TablixObjects.PropGridHorizontalWeight.defaultValue;
    const defaultGridlineVerticalWeight = TablixObjects.PropGridVerticalWeight.defaultValue;
    const defaultColumnsOutline = TablixObjects.PropColumnsOutline.defaultValue;
    const defaultValuesOutline = TablixObjects.PropValuesOutline.defaultValue;
    const defaultTotalOutline = TablixObjects.PropTotalOutline.defaultValue;
    const rowPaddingNormal = 3;

    function wrapFormattingElements(elements: TableFormattingProperties): DataViewObjectDefinitions {
        return {
            grid: [{
                properties: {
                    outlineColor: createSolidFillDefinition(elements.grid.outlineColor),
                    outlineWeight: SQExprBuilder.integer(valueOrDefault(elements.grid.outlineWeight, defaultOutlineWeight)),
                    gridVertical: SQExprBuilder.boolean(elements.grid.gridVertical),
                    gridVerticalColor: createSolidFillDefinition(elements.grid.gridVerticalColor),
                    gridVerticalWeight: SQExprBuilder.integer(valueOrDefault(elements.grid.gridVerticalWeight, defaultGridlineVerticalWeight)),
                    gridHorizontal: SQExprBuilder.boolean(elements.grid.gridHorizontal),
                    gridHorizontalColor: createSolidFillDefinition(elements.grid.gridHorizontalColor),
                    gridHorizontalWeight: SQExprBuilder.integer(valueOrDefault(elements.grid.gridHorizontalWeight, defaultGridlineHorizontalWeight)),
                    rowPadding: SQExprBuilder.integer(elements.grid.rowPadding),
                },
            }],

            columnHeaders: [{
                properties: {
                    outline: SQExprBuilder.text(elements.columnHeaders.outline),
                    fontColor: createSolidFillDefinition(elements.columnHeaders.fontColor),
                    backColor: createSolidFillDefinition(elements.columnHeaders.backColor),
                }
            }],

            values: [{
                properties: {
                    outline: SQExprBuilder.text(elements.values.outline),
                    fontColorPrimary: createSolidFillDefinition(elements.values.fontColorPrimary),
                    backColorPrimary: createSolidFillDefinition(elements.values.backColorPrimary),
                    fontColorSecondary: createSolidFillDefinition(elements.values.fontColorSecondary),
                    backColorSecondary: createSolidFillDefinition(elements.values.backColorSecondary),
                }
            }],

            total: [{
                properties: {
                    outline: SQExprBuilder.text(elements.total.outline),
                    fontColor: createSolidFillDefinition(elements.total.fontColor),
                    backColor: createSolidFillDefinition(elements.total.backColor),
                }
            }],
        };
    }

    export const tableStylePresets: VisualStylePresets = {
        displayName: data.createDisplayNameGetter('Visual_Table_StylePreset_SectionTitle'),
        presets: {
            None: {
                displayName: data.createDisplayNameGetter('Visual_Table_StylePreset_None'),

                evaluate: (theme: IVisualStyle) => {
                    return wrapFormattingElements({
                        grid: {
                            outlineColor: TablixObjects.PropGridOutlineColor.defaultValue,
                            gridVertical: TablixObjects.PropGridVertical.defaultValue,
                            gridVerticalColor: TablixObjects.PropGridVerticalColor.defaultValue,
                            gridHorizontal: TablixObjects.PropGridHorizontalTable.defaultValue,
                            gridHorizontalColor: TablixObjects.PropGridHorizontalColor.defaultValue,
                            rowPadding: TablixObjects.PropGridRowPadding.defaultValue,
                        },

                        columnHeaders: {
                            outline: defaultColumnsOutline,
                            fontColor: TablixObjects.PropColumnsFontColor.defaultValue,
                            backColor: TablixObjects.PropColumnsBackColor.defaultValue,
                        },

                        values: {
                            outline: defaultValuesOutline,
                            fontColorPrimary: TablixObjects.PropValuesOutline.defaultValue,
                            backColorPrimary: TablixObjects.PropValuesOutline.defaultValue,
                            fontColorSecondary: TablixObjects.PropValuesOutline.defaultValue,
                            backColorSecondary: TablixObjects.PropValuesOutline.defaultValue,
                        },

                        total: {
                            outline: defaultTotalOutline,
                            fontColor: TablixObjects.PropTotalFontColor.defaultValue,
                            backColor: TablixObjects.PropTotalBackColor.defaultValue,
                        },
                    });
                },
            },

            Minimal: {
                displayName: data.createDisplayNameGetter('Visual_Table_StylePreset_Minimal'),

                evaluate: (theme: IVisualStyle) => {
                    let backColor = theme.colorPalette.background.value;
                    let foreColor = theme.colorPalette.foreground.value;
                    let outlineColor = theme.colorPalette.tableAccent.value;
                    let gridColor = Color.hexBlend(foreColor, 0.12, backColor);

                    return wrapFormattingElements({
                        grid: {
                            outlineColor: outlineColor,
                            gridVertical: false,
                            gridVerticalColor: gridColor,
                            gridVerticalWeight: defaultGridlineVerticalWeight,
                            gridHorizontal: true,
                            gridHorizontalColor: gridColor,
                            gridHorizontalWeight: defaultGridlineHorizontalWeight,
                            rowPadding: rowPaddingNormal,
                        },

                        columnHeaders: {
                            outline: defaultColumnsOutline,
                            fontColor: foreColor,
                            backColor: backColor,
                        },

                        values: {
                            outline: defaultValuesOutline,
                            fontColorPrimary: foreColor,
                            backColorPrimary: backColor,
                            fontColorSecondary: foreColor,
                            backColorSecondary: backColor,
                        },

                        total: {
                            outline: defaultTotalOutline,
                            fontColor: foreColor,
                            backColor: backColor,
                        },
                    });
                },
            },
        },
    };
}