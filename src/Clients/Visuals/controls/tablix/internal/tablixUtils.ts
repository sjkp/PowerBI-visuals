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

/// <reference path="../../../_references.ts"/>

module powerbi.visuals.controls {
    export module HTMLElementUtils {
        export function clearChildren(element: HTMLElement): void {
            if (!element) {
                return;
            }

            while (element.hasChildNodes()) {
                element.removeChild(element.firstChild);
            }
        }

        export function setElementTop(element: HTMLElement, top: number): void {
            element.style.top = top + "px";
        }

        export function setElementLeft(element: HTMLElement, left: number): void {
            element.style.left = left + "px";
        }

        export function setElementHeight(element: HTMLElement, height: number): void {
            if (HTMLElementUtils.isAutoSize(height))
                element.style.height = "";
            else
                element.style.height = height + "px";
        }

        export function setElementWidth(element: HTMLElement, width: number): void {
            if (HTMLElementUtils.isAutoSize(width))
                element.style.width = "";
            else
                element.style.width = width + "px";
        }

        export function getElementWidth(element: HTMLElement): number {
            return element.offsetWidth;
        }

        export function getElementHeight(element: HTMLElement): number {
            return element.offsetHeight;
        }

        export function isAutoSize(size: number): boolean {
            return size === -1;
        }

        export function getAccumulatedScale(element: HTMLElement): number {
            let scale: number = 1;
            while (element) {
                scale *= HTMLElementUtils.getScale(element);
                element = element.parentElement;
            }

            return scale;
        }

        /**
         * Get scale of element, return 1 when not scaled.
         */
        export function getScale(element: any): number {
            element = $(element);

            let str = element.css('-webkit-transform') ||
                element.css('-moz-transform') ||
                element.css('-ms-transform') ||
                element.css('-o-transform') ||
                element.css('transform');

            return (str && (
                str.match(/\d*\.\d*/) && Number(str.match(/\d*\.\d*/)[0]) ||
                str.match(/\d+/) && Number(str.match(/\d+/)[0]))
            ) || 1;
        }
    }
}

module powerbi.visuals.controls.internal {
    import DomFactory = InJs.DomFactory;
    import DataViewObjectDefinitions = powerbi.data.DataViewObjectDefinitions;
    import DataViewRoleWildCard = data.DataViewRoleWildcard;

    export module TablixObjects {
        export const ObjectGeneral: string = "general";
        export const ObjectGrid: string = "grid";
        export const ObjectColumnHeaders: string = "columnHeaders";
        export const ObjectRowHeaders: string = "rowHeaders";
        export const ObjectValues: string = "values";
        export const ObjectTotal: string = "total";
        export const ObjectSubTotals: string = "subTotals";

        export interface ObjectValueGetterFunction {
            <T>(objects: DataViewObjects, propertyId: DataViewObjectPropertyIdentifier, defaultValue?: T): T;
        }

        /**
         * Represents a DataViewObjects property related to the Tablix
         */
        export class TablixProperty {
            public objectName: string;
            public propertyName: string;
            public defaultValue: any;
            private getterFuntion: ObjectValueGetterFunction;

            /**
             * Creates a new TablixProperty
             * @param {string} objectName Object Name
             * @param {string} propertyName Property Name
             * @param {any} defaultValue Default value of the Property
             * @param {ObjectValueGetterFunction} getterFuntion Function used to get the Property value from the Objects
             */
            constructor(objectName: string, propertyName: string, defaultValue: any, getterFuntion: ObjectValueGetterFunction) {
                this.objectName = objectName;
                this.propertyName = propertyName;
                this.defaultValue = defaultValue;
                this.getterFuntion = getterFuntion;
            }

            /**
             * Gets the PropertyIdentifier for the Property
             * @returns PropertyIdentifier for the Property
             */
            public getPropertyID(): DataViewObjectPropertyIdentifier {
                return { objectName: this.objectName, propertyName: this.propertyName };
            }

            /**
             * Gets the value of the Property from the Objects
             * @param {DataViewObjects} objects DataView Objects to get the value from
             * @param {boolean} useDefault True to fall back to the Default value if the Property is missing from the objects. False to return undefined
             * @returns Value of the property
             */
            public getValue<T>(objects: DataViewObjects): T {
                // We use this when we intend to have undefined for missing properties. Useful in letting styles fallback to CSS if not defined
                return this.getterFuntion<T>(objects, this.getPropertyID(), this.defaultValue);
            }
        }

        // Per Column
        export const PropColumnFormatString = new TablixProperty(ObjectGeneral, 'formatString', undefined, DataViewObjects.getValue);

        // General
        export const PropGeneralAutoSizeColumns = new TablixProperty(ObjectGeneral, 'autoSizeColumnWidth', true, DataViewObjects.getValue);
        export const PropGeneralTextSize = new TablixProperty(ObjectGeneral, 'textSize', 8, DataViewObjects.getValue);
        export const PropGeneralTableTotals = new TablixProperty(ObjectGeneral, 'totals', true, DataViewObjects.getValue);
        export const PropGeneralMatrixRowSubtotals = new TablixProperty(ObjectGeneral, 'rowSubtotals', true, DataViewObjects.getValue);
        export const PropGeneralMatrixColumnSubtotals = new TablixProperty(ObjectGeneral, 'columnSubtotals', true, DataViewObjects.getValue);

        //Grid
        export const PropGridVertical = new TablixProperty(ObjectGrid, 'gridVertical', false, DataViewObjects.getValue);
        export const PropGridVerticalColor = new TablixProperty(ObjectGrid, 'gridVerticalColor', "#E8E8E8", DataViewObjects.getFillColor);
        export const PropGridVerticalWeight = new TablixProperty(ObjectGrid, 'gridVerticalWeight', 1, DataViewObjects.getValue);
        export const PropGridHorizontalTable = new TablixProperty(ObjectGrid, 'gridHorizontal', true, DataViewObjects.getValue);
        export const PropGridHorizontalMatrix = new TablixProperty(ObjectGrid, 'gridHorizontal', false, DataViewObjects.getValue);
        export const PropGridHorizontalColor = new TablixProperty(ObjectGrid, 'gridHorizontalColor', "#E8E8E8", DataViewObjects.getFillColor);
        export const PropGridHorizontalWeight = new TablixProperty(ObjectGrid, 'gridHorizontalWeight', 1, DataViewObjects.getValue);
        export const PropGridRowPadding = new TablixProperty(ObjectGrid, 'rowPadding', 0, DataViewObjects.getValue);
        export const PropGridOutlineColor = new TablixProperty(ObjectGrid, 'outlineColor', "#CCC", DataViewObjects.getFillColor);
        export const PropGridOutlineWeight = new TablixProperty(ObjectGrid, 'outlineWeight', 1, DataViewObjects.getValue);
        export const PropGridImageHeight = new TablixProperty(ObjectGrid, 'imageHeight', 75, DataViewObjects.getValue);

        // Column Headers
        export const PropColumnsFontColor = new TablixProperty(ObjectColumnHeaders, 'fontColor', "#666", DataViewObjects.getFillColor);
        export const PropColumnsBackColor = new TablixProperty(ObjectColumnHeaders, 'backColor', undefined, DataViewObjects.getFillColor);
        export const PropColumnsOutline = new TablixProperty(ObjectColumnHeaders, 'outline', "BottomOnly", DataViewObjects.getValue);

        // Row Headers
        export const PropRowsFontColor = new TablixProperty(ObjectRowHeaders, 'fontColor', "#666", DataViewObjects.getFillColor);
        export const PropRowsBackColor = new TablixProperty(ObjectRowHeaders, 'backColor', undefined, DataViewObjects.getFillColor);
        export const PropRowsOutline = new TablixProperty(ObjectRowHeaders, 'outline', "RightOnly", DataViewObjects.getValue);

        // Values
        export const PropValuesBackColor = new TablixProperty(ObjectValues, 'backColor', undefined, DataViewObjects.getFillColor);
        export const PropValuesFontColorPrimary = new TablixProperty(ObjectValues, 'fontColorPrimary', "#333", DataViewObjects.getFillColor);
        export const PropValuesBackColorPrimary = new TablixProperty(ObjectValues, 'backColorPrimary', undefined, DataViewObjects.getFillColor);
        export const PropValuesFontColorSecondary = new TablixProperty(ObjectValues, 'fontColorSecondary', "#333", DataViewObjects.getFillColor);
        export const PropValuesBackColorSecondary = new TablixProperty(ObjectValues, 'backColorSecondary', undefined, DataViewObjects.getFillColor);
        export const PropValuesOutline = new TablixProperty(ObjectValues, 'outline', "None", DataViewObjects.getValue);
        export const PropValuesUrlIconProp = new TablixProperty(ObjectValues, 'urlIcon', false, DataViewObjects.getValue);

        // Total
        export const PropTotalFontColor = new TablixProperty(ObjectTotal, 'fontColor', "#333", DataViewObjects.getFillColor);
        export const PropTotalBackColor = new TablixProperty(ObjectTotal, 'backColor', undefined, DataViewObjects.getFillColor);
        export const PropTotalOutline = new TablixProperty(ObjectTotal, 'outline', "TopOnly", DataViewObjects.getValue);

        // SubTotals
        export const PropSubTotalsFontColor = new TablixProperty(ObjectSubTotals, 'fontColor', "#333", DataViewObjects.getFillColor);
        export const PropSubTotalsBackColor = new TablixProperty(ObjectSubTotals, 'backColor', undefined, DataViewObjects.getFillColor);
        export const PropSubTotalsOutline = new TablixProperty(ObjectSubTotals, 'outline', "TopOnly", DataViewObjects.getValue);

        /**
         * Get the DataViewObject from the DataView
         * @param {DataView} dataview The DataView
         * @returns DataViewObjects (dataView.metadata.objects)
         */
        export function getMetadadataObjects(dataview: DataView): DataViewObjects {
            if (dataview && dataview.metadata)
                return dataview.metadata.objects;

            return null;
        }

        export function enumerateObjectRepetition(enumeration: VisualObjectRepetition[], dataView: DataView, tablixType: TablixType): void {
            debug.assertValue(enumeration, 'enumeration should be defined');
            debug.assertValue(dataView, "dataView can't be undefined");

            // We currently only support Table
            if (tablixType !== TablixType.Table)
                return;

            let columns = getTableColumnMetadata(dataView);
            for (let column of columns) {
                let repetition: VisualObjectRepetition = {
                    selector: {
                        data: [DataViewRoleWildCard.fromRoles(['Values'])],
                        metadata: column.queryName,
                    },
                    objects: {
                        [TablixObjects.ObjectValues]: {
                            formattingProperties: [TablixObjects.PropValuesBackColor.propertyName]
                        },
                    }
                };

                enumeration.push(repetition);
            }
        }

        export function enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions, enumeration: ObjectEnumerationBuilder, dataView: DataView, tablixType: TablixType): void {
            debug.assertValue(dataView, "dataView can't be undefined");

            let objects = getMetadadataObjects(dataView);

            let totalsShown: boolean = true;

            if (tablixType === TablixType.Table) {
                totalsShown = shouldShowTableTotalsOption(dataView) && shouldShowTableTotals(objects);
            }
            else {
                totalsShown =
                    (shouldShowColumnSubtotalsOption(dataView) && shouldShowColumnSubtotals(objects)) ||
                    (shouldShowRowSubtotalsOption(dataView) && shouldShowRowSubtotals(objects));
            }

            switch (options.objectName) {
                case TablixObjects.ObjectGeneral:
                    enumerateGeneralOptions(enumeration, objects, tablixType, dataView);
                    break;
                case TablixObjects.ObjectGrid:
                    enumerateGridOptions(enumeration, objects, tablixType);
                    break;
                case TablixObjects.ObjectColumnHeaders:
                    enumerateColumnHeadersOptions(enumeration, objects);
                    break;
                case TablixObjects.ObjectRowHeaders:
                    enumerateRowHeadersOptions(enumeration, objects);
                    break;
                case TablixObjects.ObjectValues:
                    enumerateValuesOptions(enumeration, objects, tablixType);
                    break;
                case TablixObjects.ObjectTotal:
                    if (totalsShown)
                        enumerateTotalOptions(enumeration, objects);
                    break;
                case TablixObjects.ObjectSubTotals:
                    if (totalsShown)
                        enumerateSubTotalsOptions(enumeration, objects);
                    break;
                default:
                    break;
            }
        }

        export function enumerateGeneralOptions(enumeration: ObjectEnumerationBuilder, objects: DataViewObjects, tablixType: TablixType, dataView: DataView): void {
            let visualObjectinstance: VisualObjectInstance = {
                selector: null,
                objectName: TablixObjects.ObjectGeneral,
                properties: {
                    autoSizeColumnWidth: TablixObjects.PropGeneralAutoSizeColumns.getValue(objects),
                    textSize: TablixObjects.PropGeneralTextSize.getValue<number>(objects),
                }
            };

            let properties = visualObjectinstance.properties;

            // Total and SubTotals
            switch (tablixType) {
                case TablixType.Table:
                    if (shouldShowTableTotalsOption(dataView))
                        properties[TablixObjects.PropGeneralTableTotals.propertyName] = shouldShowTableTotals(objects);
                    break;

                case TablixType.Matrix:
                    if (shouldShowRowSubtotalsOption(dataView))
                        properties[TablixObjects.PropGeneralMatrixRowSubtotals.propertyName] = shouldShowRowSubtotals(objects);
                    if (shouldShowColumnSubtotalsOption(dataView))
                        properties[TablixObjects.PropGeneralMatrixColumnSubtotals.propertyName] = shouldShowColumnSubtotals(objects);
                    break;
            }

            enumeration.pushInstance(visualObjectinstance);
        }

        export function enumerateGridOptions(enumeration: ObjectEnumerationBuilder, objects: DataViewObjects, tablixType: TablixType): void {
            let visualObjectinstance: VisualObjectInstance = {
                selector: null,
                objectName: TablixObjects.ObjectGeneral,
                properties: {}
            };
            let properties = visualObjectinstance.properties;

            // Vertical Grid
            let verticalGridEnabled = TablixObjects.PropGridVertical.getValue<boolean>(objects);
            properties[TablixObjects.PropGridVertical.propertyName] = verticalGridEnabled;
            if (verticalGridEnabled) {
                properties[TablixObjects.PropGridVerticalColor.propertyName] = TablixObjects.PropGridVerticalColor.getValue<string>(objects);
                properties[TablixObjects.PropGridVerticalWeight.propertyName] = TablixObjects.PropGridVerticalWeight.getValue<number>(objects);
            }

            // Horizontal Grid
            let horizontalGridEnabled = (tablixType === TablixType.Table ? TablixObjects.PropGridHorizontalTable : TablixObjects.PropGridHorizontalMatrix).getValue<boolean>(objects);
            properties[(tablixType === TablixType.Table ? TablixObjects.PropGridHorizontalTable : TablixObjects.PropGridHorizontalMatrix).propertyName] = horizontalGridEnabled;
            if (horizontalGridEnabled) {
                properties[TablixObjects.PropGridHorizontalColor.propertyName] = TablixObjects.PropGridHorizontalColor.getValue<string>(objects);
                properties[TablixObjects.PropGridHorizontalWeight.propertyName] = TablixObjects.PropGridHorizontalWeight.getValue<number>(objects);
            }

            // Row Padding
            properties[TablixObjects.PropGridRowPadding.propertyName] = TablixObjects.PropGridRowPadding.getValue<number>(objects);

            // Outline
            properties[TablixObjects.PropGridOutlineColor.propertyName] = TablixObjects.PropGridOutlineColor.getValue<string>(objects);
            properties[TablixObjects.PropGridOutlineWeight.propertyName] = TablixObjects.PropGridOutlineWeight.getValue<number>(objects);

            // Image Height
            properties[TablixObjects.PropGridImageHeight.propertyName] = TablixObjects.PropGridImageHeight.getValue<number>(objects);

            enumeration.pushInstance(visualObjectinstance);
        }

        export function enumerateColumnHeadersOptions(enumeration: ObjectEnumerationBuilder, objects: DataViewObjects): void {
            enumeration.pushInstance({
                selector: null,
                objectName: TablixObjects.ObjectColumnHeaders,
                properties: {
                    fontColor: TablixObjects.PropColumnsFontColor.getValue<string>(objects),
                    backColor: TablixObjects.PropColumnsBackColor.getValue<string>(objects),
                    outline: TablixObjects.PropColumnsOutline.getValue<string>(objects),
                }
            });
        }

        export function enumerateRowHeadersOptions(enumeration: ObjectEnumerationBuilder, objects: DataViewObjects): void {
            enumeration.pushInstance({
                selector: null,
                objectName: TablixObjects.ObjectRowHeaders,
                properties: {
                    fontColor: TablixObjects.PropRowsFontColor.getValue<string>(objects),
                    backColor: TablixObjects.PropRowsBackColor.getValue<string>(objects),
                    outline: TablixObjects.PropRowsOutline.getValue<string>(objects),
                }
            });
        }

        export function enumerateValuesOptions(enumeration: ObjectEnumerationBuilder, objects: DataViewObjects, tablixType: TablixType): void {
            let instance: VisualObjectInstance = {
                selector: null,
                objectName: TablixObjects.ObjectValues,
                properties: {
                    fontColorPrimary: TablixObjects.PropValuesFontColorPrimary.getValue<string>(objects),
                    backColorPrimary: TablixObjects.PropValuesBackColorPrimary.getValue<string>(objects),
                    fontColorSecondary: TablixObjects.PropValuesFontColorSecondary.getValue<string>(objects),
                    backColorSecondary: TablixObjects.PropValuesBackColorSecondary.getValue<string>(objects),
                    outline: TablixObjects.PropValuesOutline.getValue<string>(objects),
                }
            };

            if (tablixType === TablixType.Table)
                instance.properties[TablixObjects.PropValuesUrlIconProp.propertyName] = TablixObjects.PropValuesUrlIconProp.getValue<boolean>(objects);

            enumeration.pushInstance(instance);
        }

        export function enumerateTotalOptions(enumeration: ObjectEnumerationBuilder, objects: DataViewObjects): void {
            enumeration.pushInstance({
                selector: null,
                objectName: TablixObjects.ObjectTotal,
                properties: {
                    fontColor: TablixObjects.PropTotalFontColor.getValue<string>(objects),
                    backColor: TablixObjects.PropTotalBackColor.getValue<string>(objects),
                    outline: TablixObjects.PropTotalOutline.getValue<string>(objects),
                }
            });
        }

        export function enumerateSubTotalsOptions(enumeration: ObjectEnumerationBuilder, objects: DataViewObjects): void {
            enumeration.pushInstance({
                selector: null,
                objectName: TablixObjects.ObjectSubTotals,
                properties: {
                    fontColor: TablixObjects.PropSubTotalsFontColor.getValue<string>(objects),
                    backColor: TablixObjects.PropSubTotalsBackColor.getValue<string>(objects),
                }
            });
        }

        export function getTableObjects(dataView: DataView): TablixFormattingPropertiesTable {
            let objects = getMetadadataObjects(dataView);

            let formattingProperties: TablixFormattingPropertiesTable = {

                general: {
                    autoSizeColumnWidth: TablixObjects.PropGeneralAutoSizeColumns.getValue<boolean>(objects),
                    textSize: TablixObjects.PropGeneralTextSize.getValue<number>(objects),
                    totals: shouldShowTableTotals(objects),
                },
            };

            formattingProperties.grid = {
                gridVertical: TablixObjects.PropGridVertical.getValue<boolean>(objects),
                gridVerticalColor: TablixObjects.PropGridVerticalColor.getValue<string>(objects),
                gridVerticalWeight: TablixObjects.PropGridVerticalWeight.getValue<number>(objects),
                gridHorizontal: TablixObjects.PropGridHorizontalTable.getValue<boolean>(objects),
                gridHorizontalColor: TablixObjects.PropGridHorizontalColor.getValue<string>(objects),
                gridHorizontalWeight: TablixObjects.PropGridHorizontalWeight.getValue<number>(objects),
                outlineColor: TablixObjects.PropGridOutlineColor.getValue<string>(objects),
                outlineWeight: TablixObjects.PropGridOutlineWeight.getValue<number>(objects),
                rowPadding: TablixObjects.PropGridRowPadding.getValue<number>(objects),
                imageHeight: TablixObjects.PropGridImageHeight.getValue<number>(objects),
            };

            formattingProperties.columnHeaders = {
                fontColor: TablixObjects.PropColumnsFontColor.getValue<string>(objects),
                backColor: TablixObjects.PropColumnsBackColor.getValue<string>(objects),
                outline: TablixObjects.PropColumnsOutline.getValue<string>(objects),
            };

            formattingProperties.values = {
                fontColorPrimary: TablixObjects.PropValuesFontColorPrimary.getValue<string>(objects),
                backColorPrimary: TablixObjects.PropValuesBackColorPrimary.getValue<string>(objects),
                fontColorSecondary: TablixObjects.PropValuesFontColorSecondary.getValue<string>(objects),
                backColorSecondary: TablixObjects.PropValuesBackColorSecondary.getValue<string>(objects),
                outline: TablixObjects.PropValuesOutline.getValue<string>(objects),
                urlIcon: TablixObjects.PropValuesUrlIconProp.getValue<boolean>(objects),
            };

            formattingProperties.total = {
                fontColor: TablixObjects.PropTotalFontColor.getValue<string>(objects),
                backColor: TablixObjects.PropTotalBackColor.getValue<string>(objects),
                outline: TablixObjects.PropTotalOutline.getValue<string>(objects),
            };

            return formattingProperties;
        }

        export function getMatrixObjects(dataView: DataView): TablixFormattingPropertiesMatrix {
            let objects = getMetadadataObjects(dataView);

            let formattingProperties: TablixFormattingPropertiesMatrix = {
                general: {
                    autoSizeColumnWidth: TablixObjects.PropGeneralAutoSizeColumns.getValue<boolean>(objects),
                    textSize: TablixObjects.PropGeneralTextSize.getValue<number>(objects),
                    rowSubtotals: shouldShowRowSubtotals(objects),
                    columnSubtotals: shouldShowColumnSubtotals(objects),
                },
            };

            formattingProperties.grid = {
                gridVertical: TablixObjects.PropGridVertical.getValue<boolean>(objects),
                gridVerticalColor: TablixObjects.PropGridVerticalColor.getValue<string>(objects),
                gridVerticalWeight: TablixObjects.PropGridVerticalWeight.getValue<number>(objects),
                gridHorizontal: TablixObjects.PropGridHorizontalMatrix.getValue<boolean>(objects),
                gridHorizontalColor: TablixObjects.PropGridHorizontalColor.getValue<string>(objects),
                gridHorizontalWeight: TablixObjects.PropGridHorizontalWeight.getValue<number>(objects),
                outlineColor: TablixObjects.PropGridOutlineColor.getValue<string>(objects),
                outlineWeight: TablixObjects.PropGridOutlineWeight.getValue<number>(objects),
                rowPadding: TablixObjects.PropGridRowPadding.getValue<number>(objects),
                imageHeight: TablixObjects.PropGridImageHeight.getValue<number>(objects),
            };

            formattingProperties.columnHeaders = {
                fontColor: TablixObjects.PropColumnsFontColor.getValue<string>(objects),
                backColor: TablixObjects.PropColumnsBackColor.getValue<string>(objects),
                outline: TablixObjects.PropColumnsOutline.getValue<string>(objects),
            };

            formattingProperties.rowHeaders = {
                fontColor: TablixObjects.PropRowsFontColor.getValue<string>(objects),
                backColor: TablixObjects.PropRowsBackColor.getValue<string>(objects),
                outline: TablixObjects.PropRowsOutline.getValue<string>(objects),
            };

            formattingProperties.values = {
                fontColorPrimary: TablixObjects.PropValuesFontColorPrimary.getValue<string>(objects),
                backColorPrimary: TablixObjects.PropValuesBackColorPrimary.getValue<string>(objects),
                fontColorSecondary: TablixObjects.PropValuesFontColorSecondary.getValue<string>(objects),
                backColorSecondary: TablixObjects.PropValuesBackColorSecondary.getValue<string>(objects),
                outline: TablixObjects.PropValuesOutline.getValue<string>(objects),
            };

            formattingProperties.subtotals = {
                fontColor: TablixObjects.PropSubTotalsFontColor.getValue<string>(objects),
                backColor: TablixObjects.PropSubTotalsBackColor.getValue<string>(objects),
                outline: TablixObjects.PropSubTotalsOutline.getValue<string>(objects),
            };

            return formattingProperties;
        }

        /**
         * Generate default objects for the Table/Matrix to set default styling
         * @param {TablixType} tablixType Tablix Type: table | matrix
         * @returns DataViewObjects that can be attached to the DataViewMetadata
         */
        export function generateTablixDefaultObjects(tablixType: TablixType): data.DataViewObjectDefinitions {
            return {
                general: [{
                    selector: null,
                    properties: {
                        textSize: DataViewObjectDefinitions.encodePropertyValue(12, { numeric: true }),
                        totals: DataViewObjectDefinitions.encodePropertyValue(false, { bool: true }),
                    }
                }],
            };
        }

        export function getTextSizeInPx(textSize: number): string {
            return jsCommon.PixelConverter.fromPoint(textSize);
        }

        export function shouldShowTableTotals(objects: DataViewObjects): boolean {
            return TablixObjects.PropGeneralTableTotals.getValue<boolean>(objects);
        }

        function shouldShowTableTotalsOption(dataView: DataView): boolean {
            if (dataView && dataView.table && !_.isEmpty(dataView.table.columns)) {
                let columns = dataView.table.columns;
                if (_.some(columns, (column) => column.discourageAggregationAcrossGroups))
                    return false;
            }

            return true;
        }

        function getTableColumnMetadata(dataView: DataView): DataViewMetadataColumn[] {
            if (!dataView || !dataView.table || _.isEmpty(dataView.table.columns))
                return;

            return dataView.table.columns;
        }

        export function shouldShowRowSubtotals(objects: DataViewObjects): boolean {
            return TablixObjects.PropGeneralMatrixRowSubtotals.getValue<boolean>(objects);
        }

        function shouldShowRowSubtotalsOption(dataView: DataView): boolean {
            return !(dataView &&
                dataView.matrix &&
                dataView.matrix.rows &&
                isDiscourageAggregationAcrossGroups(dataView.matrix.rows.levels));
        }

        export function shouldShowColumnSubtotals(objects: DataViewObjects): boolean {
            return TablixObjects.PropGeneralMatrixColumnSubtotals.getValue<boolean>(objects);
        }

        export function shouldShowColumnSubtotalsOption(dataView: DataView): boolean {
            return !(dataView &&
                dataView.matrix &&
                dataView.matrix.columns &&
                isDiscourageAggregationAcrossGroups(dataView.matrix.columns.levels));
        }

        export function isDiscourageAggregationAcrossGroups(levels: DataViewHierarchyLevel[]): boolean {
            let lastLevel = _.last(levels);
            // If the last item is not Aggregatable, disable totals option since there will be no totals at all to display
            // However, if the non-aggregatable filed is in the middle, there are totals showing up in matrix.
            // Therefore, we still allow users to turn it off
            return lastLevel && _.some(lastLevel.sources, source => source.discourageAggregationAcrossGroups);
        }
    }

    export module TablixUtils {
        export const CssClassTablixDiv = "tablixDiv";                                                   // Any DIV inside the table (outer and inner)
        export const CssClassContentElement = "tablixCellContentElement";                               // Outer DIV
        export const CssClassContentHost = "tablixCellContentHost";                                     // Inner DIV

        export const CssClassTablixHeader = "tablixHeader";                                             // Any Header in the Table/Matrix
        export const CssClassTablixColumnHeaderLeaf = "tablixColumnHeaderLeaf";                         // Leaf Column Headers

        export const CssClassTablixValueNumeric = "tablixValueNumeric";                                 // Numeric cells, will also be applied to all Matrix body cells
        export const CssClassTablixValueTotal = "tablixValueTotal";                                     // Total cells,  will also be applied to subtotal Matrix body cells
        export const CssClassValueURLIcon: string = "powervisuals-glyph url-icon tablixUrlIconGlyph";   // Any <a> Tag
        export const CssClassValueURLIconContainer: string = "tablixValueUrlIcon";                      // Container for the <a> tag

        export const CssClassMatrixRowHeaderLeaf = "matrixRowHeaderLeaf";                               // Matrix Leaf Row Headers
        export const CssClassMatrixRowHeaderSubTotal = "matrixRowHeaderSubTotal";                       // Matrix SubTotal Row Headers

        export const CssClassTableFooter = 'tableFooterCell';                                           // Any cell in the Footer area
        export const CssClassTableBodyCell = 'tableBodyCell';                                           // Any cell in the Table Body
        export const CssClassTableBodyCellBottom = 'tableBodyCellBottom';                               // Bottom-Most Body cell

        export const StringNonBreakingSpace = '&nbsp;';

        export const UnitOfMeasurement: string = 'px';
        const SortIconContainerClassName: string = "tablixSortIconContainer";
        export const CellPaddingLeft: number = 10;
        export const CellPaddingRight: number = 5;
        export const CellPaddingLeftMatrixTotal: number = 5;
        export const SortIconPadding: number = 5;
        export const ImageDefaultAspectRatio: number = 1;
        export const FontFamilyCell: string = Font.Family.regular.css;
        export const FontFamilyHeader: string = Font.Family.regular.css;
        export const FontFamilyTotal: string = Font.Family.bold.css;
        export const FontColorCells: string = "#333";
        export const FontColorHeaders: string = "#666";

        export interface Surround<T> {
            top?: T;
            right?: T;
            bottom?: T;
            left?: T;
        }

        export enum EdgeType { Outline, Gridline };

        export class EdgeSettings {
            /**
             * Weight in pixels. 0 to remove border. Undefined to fall back to CSS
            */
            public weight: number;
            public color: string;
            public type: EdgeType;

            constructor(weight?: number, color?: string) {
                this.applyParams(true, weight, color);
            }

            public applyParams(shown: boolean, weight: number, color?: string, type?: EdgeType) {
                if (shown) {
                    this.weight = weight == null ? 0 : weight;
                    this.color = color == null ? 'black' : color;
                    this.type = type == null ? EdgeType.Gridline : type;
                }
                else {
                    this.weight = 0;
                    this.color = 'black';
                    this.type = EdgeType.Gridline;
                }
            }

            public getCSS(): string {
                let css: string[] = [];

                if (_.isNumber(this.weight)) {
                    css.push(this.weight + UnitOfMeasurement);
                    if (this.color)
                        css.push(this.color);

                    css.push('solid');
                }

                return css.join(' ');
            }

            /**
             * Returns the priority of the current edge.
             * H. Grid = 0
             * V. Grid = 1
             * H. Outline = 2
             * V. Outline = 3
             * Uknown = -1
             * @param {Surround<EdgeSettings>} edges Edges. Used to determine the side of the current edge
             */
            public getPriority(edges: Surround<EdgeSettings>): number {
                if (this === edges.top || this === edges.bottom)
                    if (this.type === EdgeType.Outline) return 2;
                    else return 0;

                if (this === edges.right || this === edges.left)
                    if (this.type === EdgeType.Outline) return 3;
                    else return 1;

                return -1;
            }

            public getShadowCss(edges: Surround<EdgeSettings>): string {
                let output = "inset ";

                if (this === edges.left)
                    output += this.weight + UnitOfMeasurement + " 0";

                else if (this === edges.right)
                    output += "-" + this.weight + UnitOfMeasurement + " 0";

                else if (this === edges.top)
                    output += "0 " + this.weight + UnitOfMeasurement;

                else if (this === edges.bottom)
                    output += "0 -" + this.weight + UnitOfMeasurement;
                else
                    return "";

                return output + " 0 0 " + this.color;
            }
        }

        /**
         * Style parameters for each Cell
         */
        export class CellStyle {
            /**
             * Font family of the cell. If undefined, it will be cleared to fall back to table font family
            */
            public fontFamily: string;
            /**
             * Font color of the cell. If undefined, it will be cleared to fall back to table font color
            */
            public fontColor: string;
            /**
             * Background color of the cell. If undefined, it will be cleared to fall back to default (transparent)
            */
            public backColor: string;
            /**
            * Settings for Borders
            */
            public borders: Surround<EdgeSettings>;

            /**
             * Settings for Padding
            */
            public paddings: Surround<number>;

            constructor() {
                this.borders = {};
                this.paddings = { top: 0, left: TablixUtils.CellPaddingLeft, bottom: 0, right: TablixUtils.CellPaddingRight };

                // Initializing values with empty string would cause CSS attributes to not be set if they are undefined
                this.fontFamily = "";

                this.fontColor = "";
                this.backColor = "";
            }

            /**
             * Sets the Inline style for the Cell
             * @param {ITablixCell} cell Cell to set style to
             */
            public applyStyle(cell: ITablixCell): void {
                let div = cell.extension.contentHost;
                let style = div.style;

                style.fontFamily = this.fontFamily;

                style.color = this.fontColor;
                style.backgroundColor = this.backColor;

                let edges = [this.borders.top, this.borders.right, this.borders.bottom, this.borders.left];

                // Sorting edges by priority Descending
                edges = _.sortBy(edges, (e) => {
                    return e ? e.getPriority(this.borders) : -1;
                }).reverse();

                 /**
                 * We are setting the borders as inset shadow
                 * This way we can control how intersecting borders would look like when they have different colors
                 */
                style.boxShadow = _.map(edges, (e) => {
                    if (e) return e.getShadowCss(this.borders);
                }).join(', ');

                style.border = "none";

                style.paddingTop = ((this.paddings.top == null ? 0 : this.paddings.top) + (this.borders.top == null ? 0 : this.borders.top.weight)) + UnitOfMeasurement;
                style.paddingRight = ((this.paddings.right == null ? CellPaddingRight : this.paddings.right) + (this.borders.right == null ? 0 : this.borders.right.weight)) + UnitOfMeasurement;
                style.paddingBottom = ((this.paddings.bottom == null ? 0 : this.paddings.bottom) + (this.borders.bottom == null ? 0 : this.borders.bottom.weight)) + UnitOfMeasurement;
                style.paddingLeft = ((this.paddings.left == null ? CellPaddingLeft : this.paddings.left) + (this.borders.left == null ? 0 : this.borders.left.weight)) + UnitOfMeasurement;
            }

            public getExtraTop(): number {
                let extra = 0;

                if (this.paddings.top)
                    extra += this.paddings.top;
                if (this.borders.top)
                    extra += this.borders.top.weight;

                return extra;
            }

            public getExtraBottom(): number {
                let extra = 0;

                if (this.paddings.bottom)
                    extra += this.paddings.bottom;
                if (this.borders.bottom)
                    extra += this.borders.bottom.weight;

                return extra;
            }

            public getExtraRight(): number {
                let extra = 0;

                if (this.paddings.right)
                    extra += this.paddings.right;
                if (this.borders.right)
                    extra += this.borders.right.weight;

                return extra;
            }

            public getExtraLeft(): number {
                let extra = 0;

                if (this.paddings.left)
                    extra += this.paddings.left;
                if (this.borders.left)
                    extra += this.borders.left.weight;

                return extra;
            }
        }

        /**
         * Index within a dimension (row/column)
         */
        export class DimensionPosition {
            /**
            * Global index within all leaf nodes
            */
            public index: number;
            /**
            * Index within siblings for same parent
            */
            public indexInSiblings: number;
            /**
            * Is last globally
            */
            public isLast: boolean;
            /**
            * Is first globally
            */
            public isFirst: boolean;
        }
        /**
         * Poistion information about the cell
         */
        export class CellPosition {
            public row: DimensionPosition;
            public column: DimensionPosition;

            constructor() {
                this.row = new DimensionPosition();
                this.column = new DimensionPosition();
            }

            public isMatch(position: CellPosition) {
                return this.column.index === position.column.index &&
                    this.row.index === position.row.index;
            }
        }

        export class TablixVisualCell {
            public dataPoint: any;
            public position: TablixUtils.CellPosition;
            public columnMetadata: DataViewMetadataColumn;
            public isTotal: boolean;
            public backColor: string;
            private formatter: ICustomValueColumnFormatter;
            private nullsAreBlank: boolean;

            constructor(dataPoint: any, isTotal: boolean, columnMetadata: DataViewMetadataColumn, formatter: ICustomValueColumnFormatter, nullsAreBlank: boolean) {
                this.dataPoint = dataPoint;
                this.columnMetadata = columnMetadata;
                this.formatter = formatter;
                this.isTotal = isTotal;
                this.nullsAreBlank = nullsAreBlank;

                this.position = new TablixUtils.CellPosition();
            }

            public get textContent(): string {
                if (this.formatter)
                    return this.formatter(this.dataPoint, this.columnMetadata, TablixObjects.PropColumnFormatString.getPropertyID(), this.nullsAreBlank);
                else if (this.dataPoint != null)
                    return this.dataPoint;
                else
                    return '';
            };

            public get kpiContent(): JQuery {
                if (this.columnMetadata && isValidStatusGraphic(this.columnMetadata.kpi, this.textContent))
                    return createKpiDom(this.columnMetadata.kpi, this.textContent);
            };

            public get isNumeric(): boolean {
                if (this.columnMetadata)
                    return this.columnMetadata.type.numeric && !this.columnMetadata.kpi;
            };

            public get isUrl(): boolean {
                if (this.columnMetadata)
                    return converterHelper.isWebUrlColumn(this.columnMetadata);
            };

            public get isImage(): boolean {
                if (this.columnMetadata)
                    return converterHelper.isImageUrlColumn(this.columnMetadata);
            }

            public get isValidUrl(): boolean {
                return jsCommon.UrlUtils.isValidImageUrl(this.textContent);
            };

            public isMatch(item: TablixVisualCell) {
                return this.position.isMatch(item.position) && this.backColor === item.backColor;
            }
        }

        export function createTable(): HTMLTableElement {
            return <HTMLTableElement>document.createElement("table");
        }

        export function createDiv(): HTMLDivElement {
            let div: HTMLDivElement = <HTMLDivElement>document.createElement("div");
            div.className = "tablixDiv";
            return div;
        }

        export function resetCellCssClass(cell: controls.ITablixCell) {
            cell.extension.contentElement.className = TablixUtils.CssClassTablixDiv + " " + TablixUtils.CssClassContentElement;
            cell.extension.contentHost.className = TablixUtils.CssClassTablixDiv + " " + TablixUtils.CssClassContentHost;
        }

        export function addCellCssClass(cell: controls.ITablixCell, style: string): void {
            cell.extension.contentHost.className += " " + style;
        }

        /**
         * Clears all inline styles (border, fontColor, background) and resets CSS classes
         * Performed with unbind-<Cell>
         */
        export function clearCellStyle(cell: controls.ITablixCell): void {
            cell.extension.contentHost.className = "";
            cell.extension.contentHost.style.cssText = "";
        }

        export function clearCellTextAndTooltip(cell: controls.ITablixCell): void {
            cell.extension.contentHost.textContent = '';
            cell.extension.contentHost.removeAttribute('title');
            cell.contentHeight = cell.contentWidth = 0;
            HTMLElementUtils.clearChildren(cell.extension.contentHost);
        }

        /**
         * Sets text and tooltip for cell
         * @param {string} text Text to set
         * @param {HTMLElement} elementText Element to set text to
         * @param {HTMLElement} elementTooltip? Element to set tootltip to, if undefined, elementText will be used
         */
        export function setCellTextAndTooltip(text: string, elementText: HTMLElement, elementTooltip?: HTMLElement): void {
            let val = TextUtil.replaceSpaceWithNBSP(text);
            elementText.textContent = val;
            (elementTooltip || elementText).title = val;
        }

        export function isValidSortClick(e: MouseEvent) {
            let colHeader = <HTMLElement>e.target;
            let x = e.offsetX;
            return x >= 0 && x < colHeader.offsetWidth - TablixResizer.resizeHandleSize;
        }

        export function appendATagToBodyCell(value: string, cellElement: HTMLElement, urlIcon?: boolean): void {
            let atag: HTMLAnchorElement = null;
            if (cellElement.childElementCount === 0) {
                atag = document.createElement('a');
                cellElement.appendChild(atag);
            }
            else {
                atag = <HTMLAnchorElement>cellElement.children[0];
            }

            atag.href = value;
            atag.target = '_blank';
            atag.title = value;

            if (urlIcon === true) {
                atag.className = CssClassValueURLIcon;
                cellElement.className = CssClassValueURLIconContainer;
            }
            else {
                atag.innerText = value;
            }
        }

        export function appendImgTagToBodyCell(value: string, cellElement: HTMLElement, imageHeight: number): void {
            let imgContainer: HTMLDivElement = TablixUtils.createDiv();
            let imgTag: HTMLImageElement = document.createElement('img');

            imgContainer.style.height = imageHeight + "px";
            imgContainer.style.width = "100%";
            imgContainer.style.textAlign = "center";
            imgTag.src = value;
            imgTag.style.maxHeight = "100%";
            imgTag.style.maxWidth = "100%";
            imgContainer.appendChild(imgTag);
            cellElement.appendChild(imgContainer);
            cellElement.title = value;
        }

        export function createKpiDom(kpi: DataViewKpiColumnMetadata, kpiValue: string): JQuery {
            debug.assertValue(kpi, 'kpi');
            debug.assertValue(kpiValue, 'kpiValue');
            let className: string = KpiUtil.getClassForKpi(kpi, kpiValue) || '';
            return DomFactory.div()
                .addClass(className)
                .css({
                    'display': 'inline-block',
                    'vertical-align': 'bottom',
                    'margin': '0',
                });
        }

        export function isValidStatusGraphic(kpi: DataViewKpiColumnMetadata, kpiValue: string): boolean {
            if (!kpi || kpiValue === undefined) {
                return false;
            }

            return !!KpiUtil.getClassForKpi(kpi, kpiValue);
        }

        export function getCustomSortEventArgs(queryName: string, sortDirection: SortDirection): CustomSortEventArgs {
            let sortDescriptors: SortableFieldDescriptor[] = [{
                queryName: queryName,
                sortDirection: sortDirection
            }];
            return { sortDescriptors: sortDescriptors };
        }

        export function reverseSort(sortDirection: SortDirection): SortDirection {
            return sortDirection === SortDirection.Descending ? SortDirection.Ascending : SortDirection.Descending;
        }

        /**
         * Add sort icon to a table cell and return the element that should contain the contents
         * @param {SortDirection} itemSort SortDirection
         * @param {HTMLElement} cellDiv The inner DIV of the cell
         */
        export function addSortIconToColumnHeader(itemSort: SortDirection, cellDiv: HTMLElement): HTMLElement {
            let colHeaderContainer: HTMLDivElement = TablixUtils.createDiv();

            if (itemSort) {
                colHeaderContainer.appendChild(createSortIcon(itemSort, true));
                colHeaderContainer.appendChild(createSortIcon(reverseSort(itemSort), false));
            }
            else {
                colHeaderContainer.appendChild(createSortIcon(SortDirection.Descending, false));
            }

            let colHeaderTitle: HTMLDivElement = TablixUtils.createDiv();
            colHeaderContainer.appendChild(colHeaderTitle);
            cellDiv.appendChild(colHeaderContainer);

            return colHeaderTitle;
        }

        function createSortIcon(sort: SortDirection, isSorted: boolean): HTMLElement {
            let imgSort: HTMLPhraseElement = <HTMLPhraseElement>document.createElement('i');
            imgSort.className = SortIconContainerClassName +
                " " + (isSorted ? "sorted" : "future") +
                " " + (sort === SortDirection.Ascending ? "powervisuals-glyph caret-up" : "powervisuals-glyph caret-down");
            return imgSort;
        }

        function checkSortIconExists(cell: controls.ITablixCell): boolean {
            for (let i = 0, len = cell.extension.contentElement.childElementCount; i < len; i++) {
                let element = cell.extension.contentElement.children.item(i);
                if (element.classList.contains(SortIconContainerClassName))
                    return true;
            }
            return false;
        }

        export function removeSortIcons(cell: controls.ITablixCell): void {
            if (!checkSortIconExists(cell))
                return;
            $((<HTMLElement>cell.extension.contentElement)).find('.' + SortIconContainerClassName).remove();
        }
    }
}