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
    import TablixFormattingProperties = powerbi.visuals.controls.TablixFormattingPropertiesTable;
    import TablixUtils = controls.internal.TablixUtils;
    import TablixObjects = controls.internal.TablixObjects;
    import EdgeSettings = TablixUtils.EdgeSettings;
    import EdgeType = TablixUtils.EdgeType;

    export interface DataViewVisualTable extends DataViewTable {
        visualRows?: DataViewVisualTableRow[];
        formattingProperties?: TablixFormattingProperties;
    }

    export interface DataViewVisualTableRow {
        index: number;
        values: DataViewTableRow;
    }

    export interface TableDataAdapter {
        update(table: DataViewTable, isDataComplete: boolean): void;
    }

    export interface TableTotal {
        totalCells: any[];
    }

    export class TableHierarchyNavigator implements controls.ITablixHierarchyNavigator, TableDataAdapter {
        private tableDataView: DataViewVisualTable;
        private formatter: ICustomValueColumnFormatter;

        /**
         * True if the model is not expecting more data
        */
        private isDataComplete: boolean;

        constructor(tableDataView: DataViewVisualTable, isDataComplete: boolean, formatter: ICustomValueColumnFormatter) {
            debug.assertValue(tableDataView, 'tableDataView');
            debug.assertValue(formatter, 'formatter');

            this.tableDataView = tableDataView;
            this.isDataComplete = isDataComplete;
            this.formatter = formatter;
        }

        /**
        * Returns the depth of the Columnm hierarchy.
        */
        public getColumnHierarchyDepth(): number {
            return 1;
        }

        /**
        * Returns the depth of the Row hierarchy.
        */
        public getRowHierarchyDepth(): number {
            return 1;
        }

        /**
         * Returns the leaf count of a hierarchy.
         */
        public getLeafCount(hierarchy: any): number {
            return hierarchy.length;
        }

        /**
         * Returns the leaf member of a hierarchy at a specified index.
         */
        public getLeafAt(hierarchy: any, index: number): any {
            return hierarchy[index];
        }

        /**
         * Returns the specified hierarchy member parent.
         */
        public getParent(item: any): any {
            return null;
        }

        /**
         * Returns the index of the hierarchy member relative to its parent.
         */
        public getIndex(item: any): number {
            if (!item)
                return -1;

            if (this.isRow(item))
                return (<DataViewVisualTableRow>item).index;

            return this.getColumnIndex(item);
        }

        private isRow(item: any): boolean {
            if (!item)
                return false;

            let row = <DataViewVisualTableRow>item;
            return row.index !== undefined && row.values !== undefined;
        }

        private getColumnIndex(item: any): number {
            return TableHierarchyNavigator.getIndex(this.tableDataView.columns, item);
        }

        /**
         * Checks whether a hierarchy member is a leaf.
         */
        public isLeaf(item: any): boolean {
            return true;
        }

        public isRowHierarchyLeaf(cornerItem: any): boolean {
            return false;
        }

        public isColumnHierarchyLeaf(cornerItem: any): boolean {
            return true;
        }

        public isFirstItem(item: MatrixVisualNode, items: MatrixVisualNode[]): boolean {
            // checking for item.index is unreliable because reordering the columns would cause a mismatch between index and items order
            return item === items[0];
        }

        public areAllParentsFirst(item: any, items: any): boolean {
            return this.isFirstItem(item, items);
        }

        /**
         * Checks whether a hierarchy member is the last item within its parent.
         */
        public isLastItem(item: any, items: any[]): boolean {
            debug.assertValue(item, 'item');

            // If it's a row, we need to check if data is complete
            return (items === this.tableDataView.columns || this.isDataComplete)
                && (item === _.last(items));
        }

        public areAllParentsLast(item: any, items: any[]): boolean {
            return this.isLastItem(item, items);
        }

        /**
         * Gets the children members of a hierarchy member.
         */
        public getChildren(item: any): any {
            return null;
        }

        public getChildrenLevelDifference(item: any) {
            return Infinity;
        }

        /**
         * Gets the members count in a specified collection.
         */
        public getCount(items: any): number {
            return items.length;
        }

        /**
         * Gets the member at the specified index.
         */
        public getAt(items: any, index: number): any {
            return items[index];
        }

        /**
         * Gets the hierarchy member level.
         */
        public getLevel(item: any): number {
            return 0;
        }

        /**
         * Returns the intersection between a row and a column item.
         */
        public getIntersection(rowItem: any, columnItem: DataViewMetadataColumn): TablixUtils.TablixVisualCell {
            let value: any;
            let isTotal: boolean = false;
            let position = new TablixUtils.CellPosition();

            let columnIndex: number = TableHierarchyNavigator.getIndex(this.tableDataView.columns, columnItem);;
            position.column.index = columnIndex;
            position.column.isFirst = columnIndex === 0 ? true : false;
            position.column.isLast = columnIndex === this.tableDataView.columns.length - 1;

            let totalRow = <TableTotal>rowItem;
            if (totalRow.totalCells != null) {
                isTotal = true;
                value = totalRow.totalCells[columnIndex];
            }
            else {
                let row = <DataViewVisualTableRow>rowItem;
                let rowIndex = row.index;
                position.row.index = rowIndex;
                position.row.isFirst = rowIndex === 0;
                position.row.isLast = this.isDataComplete && (rowIndex === this.tableDataView.rows.length - 1);
                value = row.values[columnIndex];
            }

            let cellItem = new TablixUtils.TablixVisualCell(value, isTotal, columnItem, this.formatter, false);
            cellItem.position = position;

            let tableRow = <DataViewVisualTableRow>rowItem;
            if (tableRow && tableRow.values) {
                let rowObjects = tableRow.values.objects;
                if (rowObjects) {
                    let cellObject = rowObjects[columnIndex];
                    if (cellObject) {
                        cellItem.backColor = TablixObjects.PropValuesBackColor.getValue<string>(cellObject);
                    }
                }
            }
            return cellItem;
        }

        /**
         * Returns the corner cell between a row and a column level.
         */
        public getCorner(rowLevel: number, columnLevel: number): TablixUtils.TablixVisualCell {
            return null;
        }

        public headerItemEquals(item1: any, item2: any): boolean {
            if (item1 === item2)
                return true;

            // Typechecking does not work with interfaces nor at runtime. We need to explicitly check for
            // properties of DataViewMetadataColumn to determine if we can use the column equivalency check.
            // We expect this method to handle either VisualTableRows or DataViewMetadataColumns so checking
            // for displayName should be sufficient.
            if (item1.displayName && item2.displayName) {
                let column1 = <powerbi.DataViewMetadataColumn>item1;
                let column2 = <powerbi.DataViewMetadataColumn>item2;
                return powerbi.DataViewAnalysis.areMetadataColumnsEquivalent(column1, column2);
            }

            if (this.isRow(item1) && this.isRow(item2))
                return item1.index === item2.index;

            return false;
        }

        public bodyCellItemEquals(item1: TablixUtils.TablixVisualCell, item2: TablixUtils.TablixVisualCell): boolean {
            //return (item1.dataPoint === item2.dataPoint);
            return (item1.isMatch(item2));
        }

        public cornerCellItemEquals(item1: any, item2: any): boolean {
            // Should not be called as we don't return any corner items for table
            return true;
        }

        public update(table: DataViewVisualTable, isDataComplete: boolean): void {
            this.tableDataView = table;
            this.isDataComplete = isDataComplete;
        }

        public static getIndex(items: any[], item: any): number {
            for (let index = 0, len = items.length; index < len; index++) {

                // For cases when the item was re-created during the DataTransformation phase,
                // we check for the item's index to verify equality.
                let arrayItem = items[index];
                if (arrayItem.index != null && item.index != null && arrayItem.index === item.index) {
                    return index;
                }
                else {
                    if (item === items[index])
                        return index;
                }
            }

            return -1;
        }
    }

    export interface TableBinderOptions {
        onBindRowHeader?(item: any): void;
        onColumnHeaderClick?(queryName: string, sortDirection: SortDirection): void;
        layoutKind?: controls.TablixLayoutKind;
    }

    /**
     * Note: Public for testability.
     */
    export class TableBinder implements controls.ITablixBinder {
        private options: TableBinderOptions;
        private formattingProperties: TablixFormattingProperties;
        private tableDataView: DataViewVisualTable;

        private fontSizeHeader: number;
        private textPropsHeader: TextProperties;
        private textHeightHeader: number;

        private fontSizeValue: number;
        private textPropsValue: TextProperties;
        private textHeightValue: number;

        private fontSizeTotal: number;
        private textPropsTotal: TextProperties;
        private textHeightTotal: number;

        private rowHeight: number;

        constructor(options: TableBinderOptions, dataView?: DataViewVisualTable) {
            this.options = options;

            // Handling unit tests calling constructor without a dataView
            if (dataView) {
                this.updateDataView(dataView);
            }
        }

        public updateDataView(dataView: DataViewVisualTable): void {
            this.tableDataView = dataView;
            this.formattingProperties = dataView.formattingProperties;

            this.updateTextHeights();

            if (this.hasImage()) {
                this.rowHeight = Math.max(this.textHeightValue, this.formattingProperties.grid.imageHeight);
            }
            else {
                this.rowHeight = this.textHeightValue;
            }
        }

        private updateTextHeights(): void {
            this.fontSizeHeader = jsCommon.PixelConverter.fromPointToPixel(this.formattingProperties.general.textSize);
            this.textPropsHeader = {
                fontFamily: TablixUtils.FontFamilyHeader,
                fontSize: jsCommon.PixelConverter.toString(this.fontSizeHeader),
            };
            this.textHeightHeader = Math.ceil(TextMeasurementService.measureSvgTextHeight(this.textPropsHeader, "a"));

            this.fontSizeValue = jsCommon.PixelConverter.fromPointToPixel(this.formattingProperties.general.textSize);
            this.textPropsValue = {
                fontFamily: TablixUtils.FontFamilyCell,
                fontSize: jsCommon.PixelConverter.toString(this.fontSizeValue),
            };
            this.textHeightValue = Math.ceil(TextMeasurementService.measureSvgTextHeight(this.textPropsValue, "a"));

            this.fontSizeTotal = jsCommon.PixelConverter.fromPointToPixel(this.formattingProperties.general.textSize);
            this.textPropsTotal = {
                fontFamily: TablixUtils.FontFamilyTotal,
                fontSize: jsCommon.PixelConverter.toString(this.fontSizeTotal),
            };
            this.textHeightTotal = Math.ceil(TextMeasurementService.measureSvgTextHeight(this.textPropsTotal, "a"));
        }

        private hasImage(): boolean {
            return _.any(this.tableDataView.columns, (col) => converterHelper.isImageUrlColumn(col));
        }

        public onStartRenderingSession(): void {
        }

        public onEndRenderingSession(): void {
        }

        /**
         * Row Header.
         */
        public bindRowHeader(item: any, cell: controls.ITablixCell): void {
            // Check if it's a total row
            if (item.totalCells) {
                cell.contentHeight = this.textHeightTotal;
            }
            else {
                cell.contentHeight = this.rowHeight;
            }

            // To clear the CSS classes that adds paddings
            TablixUtils.clearCellStyle(cell);

            if (this.options.onBindRowHeader)
                this.options.onBindRowHeader(item);
        }

        public unbindRowHeader(item: any, cell: controls.ITablixCell): void {

        }

        /**
         * Column Header.
         */

        public bindColumnHeader(item: DataViewMetadataColumn, cell: controls.ITablixCell): void {
            cell.extension.disableDragResize();
            TablixUtils.resetCellCssClass(cell);

            TablixUtils.addCellCssClass(cell, TablixUtils.CssClassTablixHeader);
            TablixUtils.addCellCssClass(cell, TablixUtils.CssClassTablixColumnHeaderLeaf);

            let cellStyle = new TablixUtils.CellStyle();
            // Set default style
            cellStyle.fontFamily = TablixUtils.FontFamilyHeader;
            cellStyle.fontColor = TablixUtils.FontColorHeaders;
            cellStyle.borders.bottom = new EdgeSettings(TablixObjects.PropGridOutlineWeight.defaultValue, TablixObjects.PropGridOutlineColor.defaultValue);

            cell.contentHeight = this.textHeightHeader;

            let element = cell.extension.contentHost;
            if (this.sortIconsEnabled()) {
                element = TablixUtils.addSortIconToColumnHeader(item.sort, element);
                if (item.sort) {
                    // Glyph font has all characters width/height same as font size
                    cell.contentWidth = this.fontSizeHeader + TablixUtils.SortIconPadding;
                }
            }

            TablixUtils.setCellTextAndTooltip(item.displayName, element, cell.extension.contentHost);
            cell.contentWidth += TextMeasurementService.measureSvgTextWidth(this.textPropsHeader, item.displayName);
            cell.contentWidth = Math.ceil(cell.contentWidth);

            if (this.options.onColumnHeaderClick) {
                let handler = (e: MouseEvent) => {
                    if (TablixUtils.isValidSortClick(e)) {
                        let sortDirection: SortDirection = TablixUtils.reverseSort(item.sort);
                        this.options.onColumnHeaderClick(item.queryName ? item.queryName : item.displayName, sortDirection);
                    }
                };
                cell.extension.registerClickHandler(handler);
            }
            this.setColumnHeaderStyle(cell, cellStyle);

            cell.applyStyle(cellStyle);
        }

        private setColumnHeaderStyle(cell: controls.ITablixCell, style: TablixUtils.CellStyle): void {
            let propsGrid = this.formattingProperties.grid;
            let props = this.formattingProperties.columnHeaders;
            let propsTotal = this.formattingProperties.total;
            let propsValues = this.formattingProperties.values;

            style.borders.top = new EdgeSettings();
            style.borders.top.applyParams(outline.showTop(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);

            style.borders.bottom = new EdgeSettings();
            style.borders.bottom.applyParams(outline.showBottom(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);

            style.borders.left = new EdgeSettings();
            if (cell.position.column.isFirst) {
                style.borders.left.applyParams(outline.showLeft(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);

                // If we dont have left border, but Footer or Body has, we need to apply extra padding
                if (!outline.showLeft(props.outline) && (outline.showLeft(propsTotal.outline) || outline.showLeft(propsValues.outline)))
                    style.paddings.left += propsGrid.outlineWeight;
            } // else: do nothing

            style.borders.right = new EdgeSettings();
            if (cell.position.column.isLast) {
                style.borders.right.applyParams(outline.showRight(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);

                // If we dont have right border, but Footer or Body has, we need to apply extra padding
                if (!outline.showRight(props.outline) && (outline.showRight(propsTotal.outline) || outline.showRight(propsValues.outline)))
                    style.paddings.right += propsGrid.outlineWeight;
            }
            else {
                style.borders.right.applyParams(propsGrid.gridVertical, propsGrid.gridVerticalWeight, propsGrid.gridVerticalColor, EdgeType.Gridline);
            }

            style.fontColor = props.fontColor;
            style.backColor = props.backColor;
            style.paddings.top = style.paddings.bottom = propsGrid.rowPadding;
        }

        public unbindColumnHeader(item: any, cell: controls.ITablixCell): void {
            TablixUtils.clearCellStyle(cell);
            TablixUtils.clearCellTextAndTooltip(cell);

            if (this.sortIconsEnabled())
                TablixUtils.removeSortIcons(cell);

            if (this.options.onColumnHeaderClick) {
                cell.extension.unregisterClickHandler();
            }
        }

        /**
         * Body Cell.
         */
        public bindBodyCell(item: TablixUtils.TablixVisualCell, cell: controls.ITablixCell): void {
            TablixUtils.resetCellCssClass(cell);

            this.setBodyContent(item, cell);
            cell.contentWidth = Math.ceil(cell.contentWidth);

            let cellStyle = new TablixUtils.CellStyle();

            if (item.isTotal) {
                TablixUtils.addCellCssClass(cell, TablixUtils.CssClassTablixValueTotal);
                TablixUtils.addCellCssClass(cell, TablixUtils.CssClassTableFooter);

                cellStyle.fontFamily = TablixUtils.FontFamilyTotal;
                cellStyle.borders.top = new EdgeSettings(TablixObjects.PropGridOutlineWeight.defaultValue, TablixObjects.PropGridOutlineColor.defaultValue);
            }
            else if (item.position.row.isLast) {
                TablixUtils.addCellCssClass(cell, TablixUtils.CssClassTableBodyCellBottom);
            }
            else {
                TablixUtils.addCellCssClass(cell, TablixUtils.CssClassTableBodyCell);
                cellStyle.borders.bottom = new EdgeSettings(TablixObjects.PropGridHorizontalWeight.defaultValue, TablixObjects.PropGridHorizontalColor.defaultValue);
            }

            if (item.isNumeric)
                TablixUtils.addCellCssClass(cell, TablixUtils.CssClassTablixValueNumeric);

            if (item.isTotal)
                this.setFooterStyle(cell, cellStyle);
            else
                this.setBodyStyle(item, cell, cellStyle);

            cell.applyStyle(cellStyle);
        }

        public setBodyContent(item: TablixUtils.TablixVisualCell, cell: controls.ITablixCell): void {
            let element = cell.extension.contentHost;
            let imgHeight = this.formattingProperties.grid.imageHeight;

            let text = item.textContent;

            // #region Setting Height
            if (item.isTotal) {
                cell.contentHeight = this.textHeightTotal;
            }
            else if (item.isImage) {
                cell.contentHeight = imgHeight;
            }
            else {
                cell.contentHeight = this.textHeightValue;
            }
            // #endregion

            if (item.isUrl && item.isValidUrl) {
                let showUrlIcon = this.formattingProperties.values.urlIcon;
                TablixUtils.appendATagToBodyCell(text, element, showUrlIcon);
                if (showUrlIcon)
                    cell.contentWidth = this.fontSizeValue;
                else
                    cell.contentWidth = TextMeasurementService.measureSvgTextWidth(this.textPropsValue, text);
                return;
            }

            if (item.isImage && item.isValidUrl) {
                TablixUtils.appendImgTagToBodyCell(text, element, imgHeight);
                cell.contentWidth = imgHeight * TablixUtils.ImageDefaultAspectRatio;
                return;
            }

            let kpi = item.kpiContent;
            if (kpi) {
                $(element).append(kpi);

                // Glyph font has all characters width/height same as font size
                cell.contentWidth = this.fontSizeValue;
                return;
            }

            if (text) {
                TablixUtils.setCellTextAndTooltip(text, element);
                if (item.isTotal)
                    cell.contentWidth = TextMeasurementService.measureSvgTextWidth(this.textPropsTotal, text);
                else
                    cell.contentWidth = TextMeasurementService.measureSvgTextWidth(this.textPropsValue, text);
                return;
            }

            TablixUtils.setCellTextAndTooltip(" ", element);
            cell.contentWidth = 0;
        }

        private setBodyStyle(item: TablixUtils.TablixVisualCell, cell: controls.ITablixCell, style: TablixUtils.CellStyle): void {
            let propsGrid = this.formattingProperties.grid;
            let props = this.formattingProperties.values;
            let propsTotal = this.formattingProperties.total;
            let propsColumns = this.formattingProperties.columnHeaders;

            style.borders.top = new EdgeSettings();
            if (cell.position.row.isFirst) { // First Row
                style.borders.top.applyParams(outline.showTop(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);
            } // else: do nothing

            style.borders.bottom = new EdgeSettings();
            if (cell.position.row.isLast) { // Last Row
                style.borders.bottom.applyParams(outline.showBottom(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);
            }
            else {
                style.borders.bottom.applyParams(propsGrid.gridHorizontal, propsGrid.gridHorizontalWeight, propsGrid.gridHorizontalColor, EdgeType.Gridline);
            }

            style.borders.left = new EdgeSettings();
            if (cell.position.column.isFirst) { // First Column
                style.borders.left.applyParams(outline.showLeft(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);

                // If we dont have left border, but Footer or Header has, we need to apply extra padding
                if (!outline.showLeft(props.outline) && (outline.showLeft(propsTotal.outline) || outline.showLeft(propsColumns.outline)))
                    style.paddings.left += propsGrid.outlineWeight;
            } // else: do nothing

            style.borders.right = new EdgeSettings();
            if (cell.position.column.isLast) { // Last Column
                style.borders.right.applyParams(outline.showRight(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);

                // If we dont have right border, but Footer has, we need to apply extra padding
                if (!outline.showRight(props.outline) && (outline.showRight(propsTotal.outline) || outline.showRight(propsColumns.outline)))
                    style.paddings.right += propsGrid.outlineWeight;
            }
            else {
                style.borders.right.applyParams(propsGrid.gridVertical, propsGrid.gridVerticalWeight, propsGrid.gridVerticalColor, EdgeType.Gridline);
            }

            style.fontColor = cell.position.row.index % 2 === 0 ? props.fontColorPrimary : props.fontColorSecondary;

            // Conditional formatting on the cell overrides primary/secondary background colors.
            if (item.backColor)
                style.backColor = item.backColor;
            else
                style.backColor = cell.position.row.index % 2 === 0 ? props.backColorPrimary : props.backColorSecondary;

            style.paddings.top = style.paddings.bottom = propsGrid.rowPadding;
        }

        private setFooterStyle(cell: controls.ITablixCell, style: TablixUtils.CellStyle): void {
            let props = this.formattingProperties.total;
            let propsGrid = this.formattingProperties.grid;
            let propsValues = this.formattingProperties.values;
            let propsColumns = this.formattingProperties.columnHeaders;

            style.borders.top = new EdgeSettings();
            style.borders.top.applyParams(outline.showTop(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);

            style.borders.bottom = new EdgeSettings();
            style.borders.bottom.applyParams(outline.showBottom(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);

            style.borders.left = new EdgeSettings();
            if (cell.position.column.isFirst) { // First Column
                style.borders.left.applyParams(outline.showLeft(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);

                // If we dont have left border, but values or column headers have, we need to apply padding
                if (!outline.showLeft(props.outline) && (outline.showLeft(propsValues.outline) || outline.showLeft(propsColumns.outline)))
                    style.paddings.left += propsGrid.outlineWeight;

            } // else: do nothing

            style.borders.right = new EdgeSettings();
            if (cell.position.column.isLast) { // Last Column
                style.borders.right.applyParams(outline.showRight(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);

                // If we dont have left border, but values or column headers have, we need to apply padding
                if (!outline.showRight(props.outline) && (outline.showRight(propsValues.outline) || outline.showRight(propsColumns.outline)))
                    style.paddings.right += propsGrid.outlineWeight;
            }
            else {
                style.borders.right.applyParams(propsGrid.gridVertical, propsGrid.gridVerticalWeight, propsGrid.gridVerticalColor, EdgeType.Gridline);
            }

            style.fontColor = props.fontColor;
            style.backColor = props.backColor;

            style.paddings.top = style.paddings.bottom = propsGrid.rowPadding;
        }

        public unbindBodyCell(item: TablixUtils.TablixVisualCell, cell: controls.ITablixCell): void {
            TablixUtils.clearCellStyle(cell);
            TablixUtils.clearCellTextAndTooltip(cell);
        }

        /**
         * Corner Cell.
         */
        public bindCornerCell(item: any, cell: controls.ITablixCell): void {
            cell.contentWidth = 0;
        }

        public unbindCornerCell(item: any, cell: controls.ITablixCell): void {
        }

        public bindEmptySpaceHeaderCell(cell: controls.ITablixCell): void {
            // Not needed for Table
        }

        public unbindEmptySpaceHeaderCell(cell: controls.ITablixCell): void {
            // Not needed for Table
        }

        public bindEmptySpaceFooterCell(cell: controls.ITablixCell): void {
            // Not needed for Table
        }

        public unbindEmptySpaceFooterCell(cell: controls.ITablixCell): void {
            // Not needed for Table
        }

        /**
         * Measurement Helper.
         */
        public getHeaderLabel(item: DataViewMetadataColumn): string {
            return item ? item.displayName : "";
        }

        public getCellContent(item: any): string {
            return item;
        }

        public hasRowGroups(): boolean {
            return false;
        }

        private sortIconsEnabled(): boolean {
            return this.options.layoutKind === controls.TablixLayoutKind.Canvas;
        }
    }

    export interface TableConstructorOptions {
        isTouchEnabled?: boolean;
    }

    export class Table implements IVisual {
        private static preferredLoadMoreThreshold: number = 0.8;

        private element: JQuery;
        private currentViewport: IViewport;
        private style: IVisualStyle;
        private formatter: ICustomValueColumnFormatter;
        private isInteractive: boolean;
        private isTouchEnabled: boolean;
        private getLocalizedString: (stringId: string) => string;
        private hostServices: IVisualHostServices;

        private tablixControl: controls.TablixControl;
        private hierarchyNavigator: TableHierarchyNavigator;
        private waitingForData: boolean;
        private lastAllowHeaderResize: boolean;
        private waitingForSort: boolean;
        private columnWidthManager: controls.TablixColumnWidthManager;
        private dataView: DataView;

        /**
        * Flag indicating that we are persisting objects, so that next onDataChanged can be safely ignored.
        */
        public persistingObjects: boolean;

        constructor(options?: TableConstructorOptions) {
            if (options) {
                this.isTouchEnabled = options.isTouchEnabled;
            }
        }

        public static customizeQuery(options: CustomizeQueryOptions): void {
            let dataViewMapping = options.dataViewMappings[0];
            if (!dataViewMapping || !dataViewMapping.table || !dataViewMapping.metadata)
                return;

            let dataViewTableRows: data.CompiledDataViewRoleForMapping = <data.CompiledDataViewRoleForMapping>dataViewMapping.table.rows;
            let objects = dataViewMapping.metadata.objects;
            dataViewTableRows.for.in.subtotalType = TablixObjects.shouldShowTableTotals(objects) ? data.CompiledSubtotalType.Before : data.CompiledSubtotalType.None;
        }

        public static getSortableRoles(): string[] {
            return ['Values'];
        }

        public init(options: VisualInitOptions): void {
            this.element = options.element;
            this.style = options.style;
            this.updateViewport(options.viewport);
            this.formatter = valueFormatter.formatVariantMeasureValue;
            this.isInteractive = options.interactivity && options.interactivity.selection != null;
            this.getLocalizedString = options.host.getLocalizedString;
            this.hostServices = options.host;
            this.persistingObjects = false;

            this.waitingForData = false;
            this.lastAllowHeaderResize = true;
            this.waitingForSort = false;
        }

        /**
         * Note: Public for testability.
         */
        public static converter(dataView: DataView): DataViewVisualTable {
            let table = dataView.table;
            debug.assertValue(table, 'table');
            debug.assertValue(table.rows, 'table.rows');

            let visualTable = Prototype.inherit<DataViewVisualTable>(table);
            visualTable.visualRows = [];

            for (let i: number = 0; i < table.rows.length; i++) {
                let visualRow: DataViewVisualTableRow = {
                    index: i,
                    values: table.rows[i]
                };
                visualTable.visualRows.push(visualRow);
            }
            visualTable.formattingProperties = TablixObjects.getTableObjects(dataView);

            return visualTable;
        }

        public onResizing(finalViewport: IViewport): void {
            this.updateViewport(finalViewport);
        }

        // Public for testability
        public getColumnWidthManager(): controls.TablixColumnWidthManager {
            return this.columnWidthManager;
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            debug.assertValue(options, 'options');

            let dataViews = options.dataViews;

            if (dataViews && dataViews.length > 0) {
                let previousDataView = this.dataView;
                this.dataView = dataViews[0];

                /* To avoid OnDataChanged being called every time we persist Objects. If:
                * AutoSizeColumns options was flipped
                * A Column was resized manually
                * A Column was auto-sized
                */
                if (this.persistingObjects) {
                    this.persistingObjects = false;
                    return;
                }

                let visualTable = Table.converter(this.dataView);

                if (options.operationKind === VisualDataChangeOperationKind.Append) {
                    this.createOrUpdateHierarchyNavigator(visualTable);
                    this.tablixControl.updateModels(/*resetScrollOffsets*/false, visualTable.visualRows, visualTable.columns);
                    this.refreshControl(/*clear*/false);
                } else {
                    this.createOrUpdateHierarchyNavigator(visualTable);
                    this.createColumnWidthManager();
                    this.createTablixControl(visualTable);
                    this.updateInternal(previousDataView, visualTable);
                }
            }

            this.waitingForData = false;
            this.waitingForSort = false;
        }

        private createColumnWidthManager(): void {
            if (!this.columnWidthManager) {
                this.columnWidthManager = new controls.TablixColumnWidthManager(this.dataView,
                    false /* isMatrix */,
                    (objectInstances: VisualObjectInstancesToPersist) => this.persistColumnWidths(objectInstances));
            }
            else {
                this.columnWidthManager.updateDataView(this.dataView);
            }
        }

        private persistColumnWidths(objectInstances: VisualObjectInstancesToPersist): void {
            this.persistingObjects = true;
            this.hostServices.persistProperties(objectInstances);
        }

        private updateViewport(newViewport: IViewport): void {
            this.currentViewport = newViewport;

            if (this.tablixControl) {
                this.tablixControl.viewport = this.currentViewport;
                this.verifyHeaderResize();
                this.refreshControl(false);
            }
        }

        private refreshControl(clear: boolean): void {
            if (visibilityHelper.partiallyVisible(this.element) || this.getLayoutKind() === controls.TablixLayoutKind.DashboardTile) {
                this.tablixControl.refresh(clear);
            }
        }

        private getLayoutKind(): controls.TablixLayoutKind {
            return this.isInteractive ? controls.TablixLayoutKind.Canvas : controls.TablixLayoutKind.DashboardTile;
        }

        private createOrUpdateHierarchyNavigator(visualTable: DataViewVisualTable): void {
            let isDataComplete = !this.dataView.metadata.segment;

            if (!this.tablixControl) {
                let dataNavigator = new TableHierarchyNavigator(visualTable, isDataComplete, this.formatter);
                this.hierarchyNavigator = dataNavigator;
            }
            else {
                this.hierarchyNavigator.update(visualTable, isDataComplete);
            }
        }

        private createTablixControl(visualTable: DataViewVisualTable): void {
            if (!this.tablixControl) {
                // Create the control
                this.tablixControl = this.createControl(this.hierarchyNavigator, visualTable);
            }
            else {
                let binder = <TableBinder>this.tablixControl.getBinder();
                binder.updateDataView(visualTable);
            }
        }

        private createControl(dataNavigator: TableHierarchyNavigator, visualTable: DataViewVisualTable): controls.TablixControl {
            let layoutKind = this.getLayoutKind();
            let textSize = visualTable.formattingProperties.general.textSize;

            let tableBinderOptions: TableBinderOptions = {
                onBindRowHeader: (item: any) => this.onBindRowHeader(item),
                onColumnHeaderClick: (queryName: string, sortDirection: SortDirection) => this.onColumnHeaderClick(queryName, sortDirection),
                layoutKind: layoutKind
            };

            let tableBinder = new TableBinder(tableBinderOptions, visualTable);
            let layoutManager: controls.internal.TablixLayoutManager = layoutKind === controls.TablixLayoutKind.DashboardTile
                ? controls.internal.DashboardTablixLayoutManager.createLayoutManager(tableBinder)
                : controls.internal.CanvasTablixLayoutManager.createLayoutManager(tableBinder, this.columnWidthManager);

            // Create Host element
            let tablixContainer = document.createElement('div');
            this.element.append(tablixContainer);

            let tablixOptions: controls.TablixOptions = {
                interactive: this.isInteractive,
                enableTouchSupport: this.isTouchEnabled,
                layoutKind: layoutKind,
                fontSize: TablixObjects.getTextSizeInPx(textSize),
            };

            return new controls.TablixControl(dataNavigator, layoutManager, tableBinder, tablixContainer, tablixOptions);
        }

        private updateInternal(previousDataView: DataView, visualTable: DataViewVisualTable) {
            let textSize = visualTable.formattingProperties.general.textSize;

            if (this.getLayoutKind() === controls.TablixLayoutKind.DashboardTile) {
                this.tablixControl.layoutManager.adjustContentSize(converterHelper.hasImageUrlColumn(this.dataView));
            }

            this.tablixControl.fontSize = TablixObjects.getTextSizeInPx(textSize);
            this.verifyHeaderResize();

            // Update models before the viewport to make sure column widths are computed correctly
            this.tablixControl.updateModels(/*resetScrollOffsets*/true, visualTable.visualRows, visualTable.columns);

            let totals = this.createTotalsRow(this.dataView);
            this.tablixControl.rowDimension.setFooter(totals);

            this.tablixControl.viewport = this.currentViewport;
            let shouldClearControl = this.shouldClearControl(previousDataView, this.dataView);

            // Render
            // We need the layout for the DIV to be done so that the control can measure items correctly.
            setTimeout(() => {
                // Render
                this.refreshControl(shouldClearControl);

                let widthChanged = this.columnWidthManager.onColumnsRendered(this.tablixControl.layoutManager.columnWidthsToPersist);

                // At this point, all columns are rendered with proper width
                // Resetting the flag unless any unknown columnn width was persisted
                if (this.persistingObjects && !widthChanged) {
                    this.persistingObjects = false;
                }
            }, 0);
        }

        private shouldClearControl(previousDataView: DataView, newDataView: DataView) {
            if (!this.waitingForSort || !previousDataView || !newDataView)
                return true;

            return !DataViewAnalysis.isMetadataEquivalent(previousDataView.metadata, newDataView.metadata);
        }

        private createTotalsRow(dataView: DataView): TableTotal {
            if (!TablixObjects.shouldShowTableTotals(dataView.metadata.objects))
                return null;

            let totals = dataView.table.totals;
            if (!totals || totals.length === 0)
                return null;

            let totalRow: any[] = [];
            let columns = dataView.table.columns;

            // Add totals for measure columns, blank for non-measure columns unless it's the first column
            for (let i = 0, len = columns.length; i < len; ++i) {
                let column = columns[i];

                let totalValue = totals[column.index];
                if (totalValue != null) {
                    totalRow.push(totalValue);
                }
                else {
                    // If the first column is a non-measure column, we put 'Total' as the text similar to PV.
                    // Note that if the first column is a measure column we don't render any Total text at
                    // all, once again similar to PV.
                    totalRow.push((i === 0) ? this.getLocalizedString('TableTotalLabel') : '');
                }
            }

            return <TableTotal>{ totalCells: totalRow };
        }

        private onBindRowHeader(item: any): void {
            if (this.needsMoreData(item)) {
                this.hostServices.loadMoreData();
                this.waitingForData = true;
            }
        }

        private onColumnHeaderClick(queryName: string, sortDirection: SortDirection): void {
            this.waitingForSort = true;
            this.hostServices.onCustomSort(TablixUtils.getCustomSortEventArgs(queryName, sortDirection));
        }

        /**
         * Note: Public for testability.
         */
        public needsMoreData(item: any): boolean {
            if (this.waitingForData || !this.dataView.metadata || !this.dataView.metadata.segment)
                return false;

            let leafCount = this.tablixControl.rowDimension.getItemsCount();
            let loadMoreThreshold = leafCount * Table.preferredLoadMoreThreshold;

            return this.hierarchyNavigator.getIndex(item) >= loadMoreThreshold;
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let enumeration = new ObjectEnumerationBuilder();

            // Visuals are initialized with an empty data view before queries are run, therefore we need to make sure that
            // we are resilient here when we do not have data view.
            if (this.dataView) {
                TablixObjects.enumerateObjectInstances(options, enumeration, this.dataView, controls.TablixType.Table);
            }

            return enumeration.complete();
        }

        public enumerateObjectRepetition(): VisualObjectRepetition[] {
            let enumeration: VisualObjectRepetition[] = [];

            // Visuals are initialized with an empty data view before queries are run, therefore we need to make sure that
            // we are resilient here when we do not have data view.
            if (this.dataView) {
                TablixObjects.enumerateObjectRepetition(enumeration, this.dataView, controls.TablixType.Table);
            }

            return enumeration;
        }

        private shouldAllowHeaderResize(): boolean {
            return this.hostServices.getViewMode() === ViewMode.Edit;
        }

        public onViewModeChanged(viewMode: ViewMode): void {
            /* Refreshes the column headers to enable/disable Column resizing */
            this.updateViewport(this.currentViewport);
        }

        private verifyHeaderResize() {
            let currentAllowHeaderResize = this.shouldAllowHeaderResize();
            if (currentAllowHeaderResize !== this.lastAllowHeaderResize) {
                this.lastAllowHeaderResize = currentAllowHeaderResize;
                this.tablixControl.layoutManager.setAllowHeaderResize(currentAllowHeaderResize);
            }
        }
    }
}