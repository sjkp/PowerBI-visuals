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
    let createSolidFillDefinition = FillDefinitionHelpers.createSolidFillDefinition;

    // Default for values common to most presets to avoid repeating declaring them
    const defaultOutlineWeight = TablixObjects.PropGridOutlineWeight.defaultValue;
    const defaultGridlineHorizontalWeight = TablixObjects.PropGridHorizontalWeight.defaultValue;
    const defaultGridlineVerticalWeight = TablixObjects.PropGridVerticalWeight.defaultValue;
    const defaultColumnsOutline = TablixObjects.PropColumnsOutline.defaultValue;
    const defaultValuesOutline = TablixObjects.PropValuesOutline.defaultValue;
    const defaultTotalOutline = TablixObjects.PropTotalOutline.defaultValue;
    const rowPaddingCondensed = 0;
    const rowPaddingNormal = 3;
    const rowPaddingSparse = 6;

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

    export function tableStylePresets(): VisualStylePresets {
        return {
            sectionTitle: data.createDisplayNameGetter('Visual_Table_StylePreset_SectionTitle'),
            sliceTitle: data.createDisplayNameGetter('Visual_Table_StylePreset_SliceTitle'),
            defaultPresetName: "None",
            presets: {
                None: {
                    name: "None",
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
                                fontColorPrimary: TablixObjects.PropValuesFontColorPrimary.defaultValue,
                                backColorPrimary: TablixObjects.PropValuesBackColorPrimary.defaultValue,
                                fontColorSecondary: TablixObjects.PropValuesFontColorSecondary.defaultValue,
                                backColorSecondary: TablixObjects.PropValuesBackColorSecondary.defaultValue,
                            },

                            total: {
                                outline: defaultTotalOutline,
                                fontColor: TablixObjects.PropTotalFontColor.defaultValue,
                                backColor: TablixObjects.PropTotalBackColor.defaultValue,
                            },
                        });
                    }
                },

                Minimal: {
                    name: "Minimal",
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

                BoldHeader: {
                    name: "BoldHeader",
                    displayName: data.createDisplayNameGetter('Visual_Table_StylePreset_BoldHeader'),
                    evaluate: (theme: IVisualStyle) => {
                        let backColor = theme.colorPalette.background.value;
                        let foreColor = theme.colorPalette.foreground.value;
                        let accent = theme.colorPalette.tableAccent.value;

                        let gridColor = Color.hexBlend(foreColor, 0.12, backColor);

                        return wrapFormattingElements({
                            grid: {
                                outlineColor: accent,
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
                                fontColor: backColor,
                                backColor: foreColor,
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

                AlternatingRows: {
                    name: "AlternatingRows",
                    displayName: data.createDisplayNameGetter('Visual_Table_StylePreset_AlternatingRows'),
                    evaluate: (theme: IVisualStyle) => {
                        let backColor = theme.colorPalette.background.value;
                        let foreColor = theme.colorPalette.foreground.value;
                        let accent = theme.colorPalette.tableAccent.value;

                        let gridColor = Color.hexBlend(foreColor, 0.12, backColor);

                        return wrapFormattingElements({
                            grid: {
                                outlineColor: accent,
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
                                fontColor: backColor,
                                backColor: foreColor,
                            },

                            values: {
                                outline: defaultValuesOutline,
                                fontColorPrimary: foreColor,
                                backColorPrimary: backColor,
                                fontColorSecondary: foreColor,
                                backColorSecondary: Color.hexBlend(foreColor, 0.08, backColor),
                            },

                            total: {
                                outline: defaultTotalOutline,
                                fontColor: backColor,
                                backColor: foreColor,
                            },
                        });
                    },
                },

                ContrastAlternatingRows: {
                    name: "ContrastAlternatingRows",
                    displayName: data.createDisplayNameGetter('Visual_Table_StylePreset_ContrastAlternatingRows'),
                    evaluate: (theme: IVisualStyle) => {
                        let backColor = theme.colorPalette.background.value;
                        let foreColor = theme.colorPalette.foreground.value;
                        let accent = theme.colorPalette.tableAccent.value;

                        let gridColor = Color.hexBlend(foreColor, 0.12, backColor);

                        return wrapFormattingElements({
                            grid: {
                                outlineColor: accent,
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
                                fontColor: backColor,
                                backColor: foreColor,
                            },

                            values: {
                                outline: defaultValuesOutline,
                                fontColorPrimary: backColor,
                                backColorPrimary: Color.hexBlend(foreColor, 0.75, backColor),
                                fontColorSecondary: foreColor,
                                backColorSecondary: Color.hexBlend(foreColor, 0.25, backColor),
                            },

                            total: {
                                outline: defaultTotalOutline,
                                fontColor: backColor,
                                backColor: foreColor,
                            },
                        });
                    },
                },

                FlashyRows: {
                    name: "FlashyRows",
                    displayName: data.createDisplayNameGetter('Visual_Table_StylePreset_FlashyRows'),
                    evaluate: (theme: IVisualStyle) => {
                        let backColor = theme.colorPalette.background.value;
                        let foreColor = theme.colorPalette.foreground.value;
                        let accent = theme.colorPalette.tableAccent.value;

                        return wrapFormattingElements({
                            grid: {
                                outlineColor: foreColor,
                                gridVertical: false,
                                gridVerticalColor: backColor,
                                gridVerticalWeight: defaultGridlineVerticalWeight,
                                gridHorizontal: false,
                                gridHorizontalColor: backColor,
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
                                backColorPrimary: Color.hexBlend(accent, 0.40, backColor),
                                fontColorSecondary: foreColor,
                                backColorSecondary: Color.hexBlend(accent, 0.80, backColor),
                            },

                            total: {
                                outline: defaultTotalOutline,
                                fontColor: foreColor,
                                backColor: backColor,
                            },
                        });
                    },
                },

                BoldHeaderFlashyRows: {
                    name: "BoldHeaderFlashyRows",
                    displayName: data.createDisplayNameGetter('Visual_Table_StylePreset_BoldHeaderFlashyRows'),
                    evaluate: (theme: IVisualStyle) => {
                        let backColor = theme.colorPalette.background.value;
                        let foreColor = theme.colorPalette.foreground.value;
                        let accent = theme.colorPalette.tableAccent.value;

                        return wrapFormattingElements({
                            grid: {
                                outlineColor: backColor,
                                gridVertical: false,
                                gridVerticalColor: foreColor,
                                gridVerticalWeight: defaultGridlineVerticalWeight,
                                gridHorizontal: false,
                                gridHorizontalColor: foreColor,
                                gridHorizontalWeight: defaultGridlineHorizontalWeight,
                                rowPadding: rowPaddingNormal,
                            },

                            columnHeaders: {
                                outline: defaultColumnsOutline,
                                fontColor: backColor,
                                backColor: foreColor,
                            },

                            values: {
                                outline: defaultValuesOutline,
                                fontColorPrimary: foreColor,
                                backColorPrimary: Color.hexBlend(accent, 0.40, backColor),
                                fontColorSecondary: foreColor,
                                backColorSecondary: Color.hexBlend(accent, 0.80, backColor),
                            },

                            total: {
                                outline: defaultTotalOutline,
                                fontColor: backColor,
                                backColor: foreColor,
                            },
                        });
                    },
                },

                Sparse: {
                    name: "Sparse",
                    displayName: data.createDisplayNameGetter('Visual_Table_StylePreset_Sparse'),
                    evaluate: (theme: IVisualStyle) => {
                        let backColor = theme.colorPalette.background.value;
                        let foreColor = theme.colorPalette.foreground.value;
                        let accent = theme.colorPalette.tableAccent.value;

                        let gridColor = Color.hexBlend(foreColor, 0.20, backColor);

                        return wrapFormattingElements({
                            grid: {
                                outlineColor: accent,
                                gridVertical: false,
                                gridVerticalColor: gridColor,
                                gridVerticalWeight: defaultGridlineVerticalWeight,
                                gridHorizontal: false,
                                gridHorizontalColor: gridColor,
                                gridHorizontalWeight: defaultGridlineHorizontalWeight,
                                rowPadding: rowPaddingSparse,
                            },

                            columnHeaders: {
                                outline: defaultColumnsOutline,
                                fontColor: backColor,
                                backColor: foreColor,
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
                                fontColor: backColor,
                                backColor: foreColor,
                            },
                        });
                    },
                },

                Condensed: {
                    name: "Condensed",
                    displayName: data.createDisplayNameGetter('Visual_Table_StylePreset_Condensed'),
                    evaluate: (theme: IVisualStyle) => {
                        let backColor = theme.colorPalette.background.value;
                        let foreColor = theme.colorPalette.foreground.value;
                        let accent = theme.colorPalette.tableAccent.value;

                        let gridColor = Color.hexBlend(foreColor, 0.20, backColor);

                        return wrapFormattingElements({
                            grid: {
                                outlineColor: accent,
                                gridVertical: true,
                                gridVerticalColor: gridColor,
                                gridVerticalWeight: defaultGridlineVerticalWeight,
                                gridHorizontal: true,
                                gridHorizontalColor: gridColor,
                                gridHorizontalWeight: defaultGridlineHorizontalWeight,
                                rowPadding: rowPaddingCondensed,
                            },

                            columnHeaders: {
                                outline: defaultColumnsOutline,
                                fontColor: backColor,
                                backColor: foreColor,
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
                                fontColor: backColor,
                                backColor: foreColor,
                            },
                        });
                    },
                },
            },
        };
    }
}