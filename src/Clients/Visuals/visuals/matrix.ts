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

    import TablixFormattingPropertiesMatrix = powerbi.visuals.controls.TablixFormattingPropertiesMatrix;
    import TablixUtils = controls.internal.TablixUtils;
    import TablixObjects = controls.internal.TablixObjects;
    import UrlUtils = jsCommon.UrlUtils;
    import EdgeSettings = TablixUtils.EdgeSettings;
    import EdgeType = TablixUtils.EdgeType;

    /**
     * Extension of the Matrix node for Matrix visual.
     */

    export interface MatrixVisualNode extends DataViewMatrixNode {
        /**
         * Index of the node in its parent's children collection.
         * 
         * Note: For size optimization, we could also look this item up in the parent's 
         * children collection, but we may need to pay the perf penalty.
         */
        index?: number;

        /**
         * Global index of the node as a leaf node.
         * If the node is not a leaf, the value is undefined.
         */
        leafIndex?: number;

        /**
         * Parent of the node.
         * Undefined for outermost nodes (children of the one root node).
         */
        parent?: MatrixVisualNode;

        /**
         * Children of the same parent
         */
        siblings?: MatrixVisualNode[];

        /**
         * queryName of the node.
         * If the node is not a leaf, the value is undefined.
         */
        queryName?: string;

        /**
         * Formatted text to show for the Node
         */
        valueFormatted?: string;
    }

    export interface MatrixCornerItem {
        metadata: DataViewMetadataColumn;
        displayName: string;
        isColumnHeaderLeaf: boolean;
        isRowHeaderLeaf: boolean;
    }

    export class MatrixVisualBodyItem extends TablixUtils.TablixVisualCell {
        public get isMeasure(): boolean {
            return true;
        };

        public get isValidUrl(): boolean {
            return false;
        };

        public get isValidImage(): boolean {
            return false;
        };
    }

    /**
    * Interface for refreshing Matrix Data View.
    */
    export interface MatrixDataAdapter {
        update(dataViewMatrix?: DataViewMatrix, isDataComplete?: boolean, updateColumns?: boolean): void;
    }

    export interface IMatrixHierarchyNavigator extends controls.ITablixHierarchyNavigator, MatrixDataAdapter {
        getDataViewMatrix(): DataViewMatrix;
        getLeafCount(hierarchy: MatrixVisualNode[]): number;
        getLeafAt(hierarchy: MatrixVisualNode[], index: number): any;
        getLeafIndex(item: MatrixVisualNode): number;
        getParent(item: MatrixVisualNode): MatrixVisualNode;
        getIndex(item: MatrixVisualNode): number;
        isLeaf(item: MatrixVisualNode): boolean;
        isRowHierarchyLeaf(item: any): boolean;
        isColumnHierarchyLeaf(item: any): boolean;
        isLastItem(item: MatrixVisualNode, items: MatrixVisualNode[]): boolean;
        getChildren(item: MatrixVisualNode): MatrixVisualNode[];
        getCount(items: MatrixVisualNode[]): number;
        getAt(items: MatrixVisualNode[], index: number): MatrixVisualNode;
        getLevel(item: MatrixVisualNode): number;
        getIntersection(rowItem: MatrixVisualNode, columnItem: MatrixVisualNode): MatrixVisualBodyItem;
        getCorner(rowLevel: number, columnLevel: number): MatrixCornerItem;
        headerItemEquals(item1: MatrixVisualNode, item2: MatrixVisualNode): boolean;
    }

    interface MatrixHierarchy extends DataViewHierarchy {
        leafNodes?: MatrixVisualNode[];
    }
    
    /**
     * Factory method used by unit tests.
     */
    export function createMatrixHierarchyNavigator(matrix: DataViewMatrix,
        isDataComplete: boolean,
        formatter: ICustomValueColumnFormatter,
        compositeGroupSeparator: string): IMatrixHierarchyNavigator {

        return new MatrixHierarchyNavigator(matrix, isDataComplete, formatter, compositeGroupSeparator);
    }

    class MatrixHierarchyNavigator implements IMatrixHierarchyNavigator {
        private matrix: DataViewMatrix;
        private rowHierarchy: MatrixHierarchy;
        private columnHierarchy: MatrixHierarchy;
        private formatter: ICustomValueColumnFormatter;
        private compositeGroupSeparator: string;

        /**
         * True if the model is not expecting more data
        */
        private isDataComplete: boolean;

        constructor(matrix: DataViewMatrix,
            isDataComplete: boolean,
            formatter: ICustomValueColumnFormatter,
            compositeGroupSeparator: string) {

            this.matrix = matrix;
            this.rowHierarchy = MatrixHierarchyNavigator.wrapMatrixHierarchy(matrix.rows);
            this.columnHierarchy = MatrixHierarchyNavigator.wrapMatrixHierarchy(matrix.columns);
            this.formatter = formatter;
            this.compositeGroupSeparator = compositeGroupSeparator;
            this.isDataComplete = isDataComplete;

            this.update();
        }
        
        /**
         * Returns the data view matrix.
         */
        public getDataViewMatrix(): DataViewMatrix {
            return this.matrix;
        }
        /**
        * Returns the depth of the column hierarchy.
         */
        public getColumnHierarchyDepth(): number {
            return Math.max(this.columnHierarchy.levels.length, 1);
        }

        /**
        * Returns the depth of the Row hierarchy.
        */
        public getRowHierarchyDepth(): number {
            return Math.max(this.rowHierarchy.levels.length, 1);
        }
        
        /**
         * Returns the leaf count of a hierarchy.
         */
        public getLeafCount(hierarchy: MatrixVisualNode[]): number {
            let matrixHierarchy = this.getMatrixHierarchy(hierarchy);
            if (matrixHierarchy)
                return matrixHierarchy.leafNodes.length;

            return 0;
        }
        
        /**
         * Returns the leaf member of a hierarchy at a specified index.
         */
        public getLeafAt(hierarchy: MatrixVisualNode[], index: number): MatrixVisualNode {
            let matrixHierarchy = this.getMatrixHierarchy(hierarchy);
            if (matrixHierarchy)
                return matrixHierarchy.leafNodes[index];

            return null;
        }
        
        /**
         * Returns the leaf index of the visual node.
         */
        public getLeafIndex(item: MatrixVisualNode): number {
            debug.assertValue(item, 'item');

            return item.leafIndex;
        }
        
        /**
         * Returns the specified hierarchy member parent.
         */
        public getParent(item: MatrixVisualNode): MatrixVisualNode {
            debug.assertValue(item, 'item');

            // Return null for outermost nodes
            if (item.level === 0)
                return null;

            return item.parent;
        }
        
        /**
         * Returns the index of the hierarchy member relative to its parent.
         */
        public getIndex(item: MatrixVisualNode): number {
            debug.assertValue(item, 'item');
            return item ? item.index : -1;
        }
        
        /**
         * Checks whether a hierarchy member is a leaf.
         */
        public isLeaf(item: MatrixVisualNode): boolean {
            debug.assertValue(item, 'item');

            return !item.children || item.children.length === 0;
        }

        public isRowHierarchyLeaf(item: MatrixCornerItem): boolean {
            return true;
        }

        public isColumnHierarchyLeaf(item: MatrixCornerItem): boolean {
            return false;
        }

        public isFirstItem(item: MatrixVisualNode, items: MatrixVisualNode[]): boolean {
            return item === _.first(items);
        }

        public areAllParentsFirst(item: MatrixVisualNode, items: MatrixVisualNode[]): boolean {
            if (!item)
                return false;

            let parent = this.getParent(item);
            if (!parent) {
                return this.isFirstItem(item, item.siblings);
            }
            else {
                return this.isFirstItem(item, item.siblings) && this.areAllParentsFirst(parent, parent.siblings);
            }
        }

        /**
         * Checks whether a hierarchy member is the last item within its parent. 
         */
        public isLastItem(item: MatrixVisualNode, items: MatrixVisualNode[]): boolean {
            debug.assertValue(item, 'item');

            if(item !== _.last(items))
                return false;

            // if item is a row, we need to check that data is complete
            return !this.isItemRow(item) || this.isDataComplete;
        }

        private isItemRow(item: MatrixVisualNode): boolean {
            if (!item)
                return false;

            let firstLevelParent = item;
            while (firstLevelParent.parent)
                firstLevelParent = firstLevelParent.parent;

            return firstLevelParent.siblings === this.rowHierarchy.root.children;
        }

        public areAllParentsLast(item: MatrixVisualNode, items: MatrixVisualNode[]): boolean {
            if (!item)
                return false;

            let parent = this.getParent(item);
            if (!parent) {
                return this.isLastItem(item, item.siblings);
            }
            else {
                return this.isLastItem(item, item.siblings) && this.areAllParentsLast(parent, parent.siblings);
            }
        }
        
        /**
         * Gets the children members of a hierarchy member.
         */
        public getChildren(item: MatrixVisualNode): MatrixVisualNode[] {
            debug.assertValue(item, 'item');

            return item.children;
        }
        
        /**
         * Gets the difference between current level and highest child's level. Can be > 1 if there are multiple values
         * @param {MatrixVisualNode} item
         * @returns
         */
        public getChildrenLevelDifference(item: MatrixVisualNode): number {
            let diff = Infinity;
            let children = this.getChildren(item);
            for (let i = 0, ilen = children.length; i < ilen; i++) {
                diff = Math.min(diff, children[i].level - item.level);
            }

            return diff;
        }
        
        /**
         * Gets the members count in a specified collection.
         */
        public getCount(items: MatrixVisualNode[]): number {
            debug.assertValue(items, 'items');

            return items.length;
        }
        
        /**
         * Gets the member at the specified index.
         */
        public getAt(items: MatrixVisualNode[], index: number): MatrixVisualNode {
            debug.assertValue(items, 'items');

            return items[index];
        }
        
        /**
         * Gets the hierarchy member level.
         */
        public getLevel(item: MatrixVisualNode): number {
            debug.assertValue(item, 'item');

            return item.level;
        }
        
        /**
         * Returns the intersection between a row and a column item.
         */
        public getIntersection(rowItem: MatrixVisualNode, columnItem: MatrixVisualNode): MatrixVisualBodyItem {
            debug.assertValue(rowItem, 'rowItem');
            debug.assertValue(columnItem, 'columnItem');
            let isSubtotalItem = rowItem.isSubtotal === true || columnItem.isSubtotal === true;

            let node: DataViewMatrixNodeValue;
            let valueSource: DataViewMetadataColumn;
            let rowIndex: number = rowItem.leafIndex;
            let colIndex: number = columnItem.leafIndex;
            let bodyCell: MatrixVisualBodyItem;

            if (!rowItem.values) {
                node = undefined;
            }
            else {
                node = rowItem.values[columnItem.leafIndex];
            }

            if (node) {
                valueSource = this.matrix.valueSources[node.valueSourceIndex || 0];
                bodyCell = new MatrixVisualBodyItem(node.value, isSubtotalItem, valueSource, this.formatter, false);
            }
            else {
                bodyCell = new MatrixVisualBodyItem(undefined, isSubtotalItem, undefined, this.formatter, false);
            }

            bodyCell.position.row.index = rowIndex;
            bodyCell.position.row.indexInSiblings = rowItem.siblings.indexOf(rowItem);
            bodyCell.position.row.isFirst = rowIndex === 0;
            bodyCell.position.row.isLast = this.isDataComplete && (rowIndex === this.rowHierarchy.leafNodes.length - 1);
            bodyCell.position.column.index = colIndex;
            bodyCell.position.column.indexInSiblings = columnItem.siblings.indexOf(columnItem);
            bodyCell.position.column.isFirst = colIndex === 0;
            bodyCell.position.column.isLast = colIndex === this.columnHierarchy.leafNodes.length - 1;

            return bodyCell;
        }
        
        /**
         * Returns the corner cell between a row and a column level.
         */
        public getCorner(rowLevel: number, columnLevel: number): MatrixCornerItem {
            debug.assert(rowLevel >= 0, 'rowLevel');
            debug.assert(columnLevel >= 0, 'columnLevel');

            let columnLevels = this.columnHierarchy.levels;
            let rowLevels = this.rowHierarchy.levels;

            if (columnLevel === columnLevels.length - 1 || columnLevels.length === 0) {
                let levelSource = rowLevels[rowLevel];
                if (levelSource)
                    return {
                        metadata: levelSource.sources.length === 1 ? levelSource.sources[0] : null,
                        displayName: _.map(levelSource.sources, (source) => { return source.displayName; }).join(this.compositeGroupSeparator),
                        isColumnHeaderLeaf: true,
                        isRowHeaderLeaf: rowLevel === rowLevels.length - 1,
                    };
            }

            if (rowLevel === rowLevels.length - 1) {
                let levelSource = columnLevels[columnLevel];
                if (levelSource)
                    return {
                        metadata: levelSource.sources.length === 1 ? levelSource.sources[0] : null,
                        displayName: _.map(levelSource.sources, (source) => { return source.displayName; }).join(this.compositeGroupSeparator),
                        isColumnHeaderLeaf: false,
                        isRowHeaderLeaf: true,
                    };
            }

            return {
                metadata: null,
                displayName: '',
                isColumnHeaderLeaf: false,
                isRowHeaderLeaf: false,
            };
        }

        public headerItemEquals(item1: MatrixVisualNode, item2: MatrixVisualNode): boolean {
            if (item1 && item2)
                return (item1 === item2);
            else
                return false;
        }

        public bodyCellItemEquals(item1: MatrixVisualBodyItem, item2: MatrixVisualBodyItem): boolean {
            return (item1.position.isMatch(item2.position));
        }

        public cornerCellItemEquals(item1: any, item2: any): boolean {
            let corner1 = <MatrixCornerItem>item1;
            let corner2 = <MatrixCornerItem>item2;

            if (!corner1 || !corner2)
                return false;

            return corner1.displayName === corner2.displayName &&
                corner1.isColumnHeaderLeaf === corner2.isColumnHeaderLeaf &&
                corner1.isRowHeaderLeaf === corner2.isRowHeaderLeaf &&
                corner1.metadata === corner2.metadata;
        }

        public getMatrixColumnHierarchy(): MatrixHierarchy {
            return this.columnHierarchy;
        }

        public getMatrixRowHierarchy(): MatrixHierarchy {
            return this.rowHierarchy;
        }
        
        /**
         * Implementation for MatrixDataAdapter interface.
         */
        public update(dataViewMatrix?: DataViewMatrix, isDataComplete?: boolean, updateColumns: boolean = true): void {
            if (dataViewMatrix) {
                this.matrix = dataViewMatrix;
                if (isDataComplete != null)
                    this.isDataComplete = isDataComplete;
                this.rowHierarchy = MatrixHierarchyNavigator.wrapMatrixHierarchy(dataViewMatrix.rows);
                if (updateColumns)
                    this.columnHierarchy = MatrixHierarchyNavigator.wrapMatrixHierarchy(dataViewMatrix.columns);
            }
            this.updateHierarchy(this.rowHierarchy);
            if (updateColumns) {
                this.updateHierarchy(this.columnHierarchy);
                MatrixHierarchyNavigator.updateStaticColumnHeaders(this.columnHierarchy);
            }
        }

        private static wrapMatrixHierarchy(hierarchy: DataViewHierarchy): MatrixHierarchy {
            let matrixHierarchy = Prototype.inherit<MatrixHierarchy>(hierarchy);
            matrixHierarchy.leafNodes = [];

            return matrixHierarchy;
        }

        private updateHierarchy(hierarchy: MatrixHierarchy): void {
            if (hierarchy.leafNodes.length > 0)
                hierarchy.leafNodes.length = 0;

            if (hierarchy.root.children)
                this.updateRecursive(hierarchy, hierarchy.root.children, null, hierarchy.leafNodes);
        }

        private updateRecursive(hierarchy: MatrixHierarchy, nodes: MatrixVisualNode[], parent: MatrixVisualNode, cache: MatrixVisualNode[]): void {
            let level: DataViewHierarchyLevel;
            let formatStringPropID = TablixObjects.PropColumnFormatString.getPropertyID();
            for (let i = 0, ilen = nodes.length; i < ilen; i++) {
                let node = nodes[i];
                node.siblings = nodes;

                if (parent)
                    node.parent = parent;

                if (!level)
                    level = hierarchy.levels[node.level];

                if (level) {
                    /**
                     * Handling Composite-groups
                     * Setting the name as the comma separated joining of the formatted strings
                     * Setting QueryName only for non-composite groups
                     */
                    if (node.levelValues) {
                        let displayNames = _.map(node.levelValues, component => {
                            let source = level.sources[component.levelSourceIndex || 0];
                            return this.formatter(component.value, source, formatStringPropID, false);
                        });

                        node.valueFormatted = displayNames.join(this.compositeGroupSeparator);
                        // Explicitly set queryName to undefined for composite groups to suppress sorting and resizing
                        node.queryName = level.sources.length !== 1 ? undefined : level.sources[0].queryName;
                    }
                    else { // Level is a Value
                        let source = level.sources[node.levelSourceIndex || 0];
                        node.valueFormatted = source.displayName;
                        node.queryName = source.queryName;
                    }
                }

                node.index = i;
                if (node.children && node.children.length > 0) {
                    this.updateRecursive(hierarchy, node.children, node, cache);
                }
                else {
                    node.leafIndex = cache.length;
                    cache.push(node);
                }
            }
        }

        private static updateStaticColumnHeaders(columnHierarchy: MatrixHierarchy): void {
            let columnLeafNodes = columnHierarchy.leafNodes;
            if (columnLeafNodes && columnLeafNodes.length > 0) {
                let columnLeafSources = columnHierarchy.levels[columnLeafNodes[0].level].sources;

                for (let i = 0, ilen = columnLeafNodes.length; i < ilen; i++) {
                    let columnLeafNode = columnLeafNodes[i];

                    // Static leaf may need to get label from it's definition for the measures level
                    if (!columnLeafNode.identity && _.isEmpty(columnLeafNode.levelValues)) {
                        // We make distincion between null and undefined. Null can be considered as legit value, undefined means we need to fall back to metadata
                        let source = columnLeafSources[columnLeafNode.levelSourceIndex ? columnLeafNode.levelSourceIndex : 0];
                        if (source)
                            columnLeafNode.valueFormatted = source.displayName;
                    }
                }
            }
        }

        private getMatrixHierarchy(rootNodes: MatrixVisualNode[]): MatrixHierarchy {
            let rowHierarchyRootNodes = this.rowHierarchy.root.children;
            if (rowHierarchyRootNodes && rootNodes === rowHierarchyRootNodes)
                return this.rowHierarchy;

            let columnHierarchyRootNodes = this.columnHierarchy.root.children;
            if (columnHierarchyRootNodes && rootNodes === columnHierarchyRootNodes)
                return this.columnHierarchy;

            return null;
        }
    }

    export interface MatrixBinderOptions {
        onBindRowHeader?(item: MatrixVisualNode): void;
        totalLabel?: string;
        onColumnHeaderClick?(queryName: string, sortDirection: SortDirection): void;
        showSortIcons?: boolean;
    }

    export class MatrixBinder implements controls.ITablixBinder {
        private formattingProperties: TablixFormattingPropertiesMatrix;
        private hierarchyNavigator: IMatrixHierarchyNavigator;
        private options: MatrixBinderOptions;

        private fontSizeHeader: number;
        private textPropsHeader: TextProperties;
        private textHeightHeader: number;

        private fontSizeValue: number;
        private textPropsValue: TextProperties;
        private textHeightValue: number;

        private fontSizeTotal: number;
        private textPropsTotal: TextProperties;
        private textHeightTotal: number;

        constructor(hierarchyNavigator: IMatrixHierarchyNavigator, options: MatrixBinderOptions) {

            // We pass the hierarchy navigator in here because it is the object that will
            // survive data changes and gets updated with the latest data view.
            this.hierarchyNavigator = hierarchyNavigator;
            this.options = options;
        }

        public onDataViewChanged(formattingProperties: TablixFormattingPropertiesMatrix): void {
            this.formattingProperties = formattingProperties;
            this.updateTextHeights();
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

        public onStartRenderingSession(): void {
        }

        public onEndRenderingSession(): void {
        }
        
        /**
         * Row Header.
         */
        public bindRowHeader(item: MatrixVisualNode, cell: controls.ITablixCell): void {
            TablixUtils.resetCellCssClass(cell);

            let cellStyle = new TablixUtils.CellStyle();

            let isLeaf = this.hierarchyNavigator && this.hierarchyNavigator.isLeaf(item);
            if (isLeaf) {
                TablixUtils.addCellCssClass(cell, TablixUtils.CssClassMatrixRowHeaderLeaf);
                cellStyle.borders.right = new EdgeSettings(TablixObjects.PropGridOutlineWeight.defaultValue, TablixObjects.PropGridOutlineColor.defaultValue);
            }

            if (item.isSubtotal) {
                cellStyle.paddings.left = TablixUtils.CellPaddingLeftMatrixTotal;
            }

            cell.contentWidth = 0;
            this.bindHeader(item, cell, cell.extension.contentHost, this.getRowHeaderMetadata(item), cellStyle);
            cell.contentWidth = Math.ceil(cell.contentWidth);

            if (this.options.onBindRowHeader)
                this.options.onBindRowHeader(item);

            this.setRowHeaderStyle(cell, cellStyle);

            cell.applyStyle(cellStyle);
        }

        private setRowHeaderStyle(cell: controls.ITablixCell, style: TablixUtils.CellStyle): void {
            let propsGrid = this.formattingProperties.grid;
            let props = this.formattingProperties.rowHeaders;
            let propsValues = this.formattingProperties.values;
            let propsCols = this.formattingProperties.columnHeaders;

            style.borders.top = new EdgeSettings();
            if (cell.position.row.isFirst) {
                style.borders.top.applyParams(outline.showTop(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);

                // If we dont have top border, but Values have, we need to apply extra padding
                if (!outline.showTop(props.outline) && outline.showTop(propsValues.outline))
                    style.paddings.top += propsGrid.outlineWeight;
            } // else: do nothing

            style.borders.bottom = new EdgeSettings();
            if (cell.position.row.isLast) {
                style.borders.bottom.applyParams(outline.showBottom(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);

                // If we dont have bottom border, but Values have, we need to apply extra padding
                if (!outline.showBottom(props.outline) && outline.showBottom(propsValues.outline))
                    style.paddings.bottom += propsGrid.outlineWeight;
            }
            else {
                style.borders.bottom.applyParams(propsGrid.gridHorizontal, propsGrid.gridHorizontalWeight, propsGrid.gridHorizontalColor, EdgeType.Gridline);
            }

            style.borders.left = new EdgeSettings();
            if (cell.position.column.isFirst) {
                style.borders.left.applyParams(outline.showLeft(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);

                // If we dont have left border, but Column Headers have, we need to apply extra padding
                if (!outline.showLeft(props.outline) && outline.showLeft(propsCols.outline))
                    style.paddings.left += propsGrid.outlineWeight;
            } // else: do nothing

            style.borders.right = new EdgeSettings();
            if (cell.position.column.isLast) {
                style.borders.right.applyParams(outline.showRight(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);
            }
            else {
                style.borders.right.applyParams(propsGrid.gridVertical, propsGrid.gridVerticalWeight, propsGrid.gridVerticalColor, EdgeType.Gridline);
            }

            style.fontColor = props.fontColor;
            style.backColor = props.backColor;
            style.paddings.top = style.paddings.bottom = propsGrid.rowPadding;
        }

        public unbindRowHeader(item: any, cell: controls.ITablixCell): void {
            TablixUtils.clearCellStyle(cell);
            TablixUtils.clearCellTextAndTooltip(cell);
        }
        
        /**
         * Column Header.
         */
        public bindColumnHeader(item: MatrixVisualNode, cell: controls.ITablixCell): void {
            TablixUtils.resetCellCssClass(cell);

            // Set default style
            let cellStyle = new TablixUtils.CellStyle();

            let overwriteTotalLabel = false;

            let cellElement = cell.extension.contentHost;

            cell.contentWidth = 0;
            let isLeaf = this.hierarchyNavigator && this.hierarchyNavigator.isLeaf(item);
            if (isLeaf) {
                cellStyle.borders.bottom = new EdgeSettings(TablixObjects.PropGridOutlineWeight.defaultValue, TablixObjects.PropGridOutlineColor.defaultValue);

                TablixUtils.addCellCssClass(cell, TablixUtils.CssClassTablixColumnHeaderLeaf);
                TablixUtils.addCellCssClass(cell, TablixUtils.CssClassTablixValueNumeric);

                if (this.options.showSortIcons) {
                    let sortableHeaderColumnMetadata = this.getSortableHeaderColumnMetadata(item);
                    if (sortableHeaderColumnMetadata) {
                        this.registerColumnHeaderClickHandler(sortableHeaderColumnMetadata, cell);
                        cellElement = TablixUtils.addSortIconToColumnHeader(sortableHeaderColumnMetadata.sort, cellElement);

                        if (sortableHeaderColumnMetadata.sort) {
                            // Glyph font has all characters width/height same as font size
                            cell.contentWidth = this.fontSizeHeader + TablixUtils.SortIconPadding;
                        }
                    }
                }

                // Overwrite only if the there are subtotal siblings (like in the multimeasure case), which means ALL siblings are subtotals.
                if (item.isSubtotal && item.parent && item.parent.children.length > 1 && (<MatrixVisualNode>item.parent.children[0]).isSubtotal)
                    overwriteTotalLabel = true;
            }

            cell.extension.disableDragResize();
            this.bindHeader(item, cell, cellElement, this.getColumnHeaderMetadata(item), cellStyle, overwriteTotalLabel);
            cell.contentWidth = Math.ceil(cell.contentWidth);

            this.setColumnHeaderStyle(cell, cellStyle);

            cell.applyStyle(cellStyle);
        }

        private setColumnHeaderStyle(cell: controls.ITablixCell, style: TablixUtils.CellStyle): void {
            let propsGrid = this.formattingProperties.grid;
            let props = this.formattingProperties.columnHeaders;
            let propsValues = this.formattingProperties.values;

            style.fontColor = props.fontColor;
            style.backColor = props.backColor;
            style.paddings.top = style.paddings.bottom = propsGrid.rowPadding;

            style.borders.top = new EdgeSettings();
            if (cell.position.row.isFirst) {
                style.borders.top.applyParams(outline.showTop(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);
            } // else: do nothing

            style.borders.bottom = new EdgeSettings();
            if (cell.position.row.isLast) {
                style.borders.bottom.applyParams(outline.showBottom(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);
            }
            else {
                style.borders.bottom.applyParams(propsGrid.gridHorizontal, propsGrid.gridHorizontalWeight, propsGrid.gridHorizontalColor, EdgeType.Gridline);
            }

            style.borders.left = new EdgeSettings();
            if (cell.position.column.isFirst) {
                // If we dont have left border, but Values have, we need to apply extra padding
                if (!outline.showLeft(props.outline) && outline.showLeft(propsValues.outline))
                    style.paddings.left += propsGrid.outlineWeight;
            }

            style.borders.right = new EdgeSettings();
            if (cell.position.column.isLast) {
                style.borders.right.applyParams(outline.showRight(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);

                // If we dont have right border, but Values have, we need to apply extra padding
                if (!outline.showRight(props.outline) && outline.showRight(propsValues.outline))
                    style.paddings.right += propsGrid.outlineWeight;
            }
            else {
                style.borders.right.applyParams(propsGrid.gridVertical, propsGrid.gridVerticalWeight, propsGrid.gridVerticalColor, EdgeType.Gridline);
            }
        }

        public unbindColumnHeader(item: MatrixVisualNode, cell: controls.ITablixCell): void {
            TablixUtils.clearCellStyle(cell);
            TablixUtils.clearCellTextAndTooltip(cell);

            let sortableHeaderColumnMetadata = this.getSortableHeaderColumnMetadata(item);
            if (sortableHeaderColumnMetadata) {
                this.unregisterColumnHeaderClickHandler(cell);
            }

            if (this.options.showSortIcons)
                TablixUtils.removeSortIcons(cell);
        }

        private bindHeader(item: MatrixVisualNode,
            cell: controls.ITablixCell,
            cellElement: HTMLElement,
            metadata: DataViewMetadataColumn,
            style: TablixUtils.CellStyle,
            overwriteSubtotalLabel?: boolean): void {
            TablixUtils.addCellCssClass(cell, TablixUtils.CssClassTablixHeader);

            style.fontFamily = TablixUtils.FontFamilyHeader;
            style.fontColor = TablixUtils.FontColorHeaders;

            let imgHeight = this.formattingProperties.grid.imageHeight;

            if (converterHelper.isImageUrlColumn(metadata))
                cell.contentHeight = imgHeight;
            else if (item.isSubtotal)
                cell.contentHeight = this.textHeightTotal;
            else
                cell.contentHeight = this.textHeightValue;

            if (item.isSubtotal) {
                TablixUtils.addCellCssClass(cell, TablixUtils.CssClassTablixValueTotal);
                style.fontFamily = TablixUtils.FontFamilyTotal;

                if (!overwriteSubtotalLabel) {
                    TablixUtils.setCellTextAndTooltip(this.options.totalLabel, cellElement, cell.extension.contentHost);
                    cell.contentWidth = TextMeasurementService.measureSvgTextWidth(this.textPropsTotal, this.options.totalLabel);
                    return;
                }
            }

            let value = this.getHeaderLabel(item);
            // If item is empty text, set text to a space to maintain height
            if (!value) {
                cellElement.innerHTML = TablixUtils.StringNonBreakingSpace;
                // Keep cell.width assigned as 0
                return;
            }

            // if item is a Valid URL, set an Anchor tag
            if (converterHelper.isWebUrlColumn(metadata) && UrlUtils.isValidUrl(value)) {
                TablixUtils.appendATagToBodyCell(value, cellElement);
                cell.contentWidth += TextMeasurementService.measureSvgTextWidth(this.textPropsHeader, value);
                return;
            }

            // if item is an Image, if it's valid create an Img tag, if not insert text
            if (converterHelper.isImageUrlColumn(metadata) && UrlUtils.isValidImageUrl(value)) {
                TablixUtils.appendImgTagToBodyCell(item.valueFormatted, cellElement, imgHeight);
                cell.contentWidth += imgHeight * TablixUtils.ImageDefaultAspectRatio;
                return;
            }

            // if item is text, insert it
            TablixUtils.setCellTextAndTooltip(value, cellElement, cell.extension.contentHost);
            cell.contentWidth += TextMeasurementService.measureSvgTextWidth(
                item.isSubtotal ? this.textPropsTotal : this.textPropsHeader,
                value);
        }

        private registerColumnHeaderClickHandler(columnMetadata: DataViewMetadataColumn, cell: controls.ITablixCell): void {
            if (this.options.onColumnHeaderClick) {
                let handler = (e: MouseEvent) => {
                    if (TablixUtils.isValidSortClick(e)) {
                        let sortDirection: SortDirection = TablixUtils.reverseSort(columnMetadata.sort);
                        this.options.onColumnHeaderClick(columnMetadata.queryName ? columnMetadata.queryName : columnMetadata.displayName, sortDirection);
                    }
                };
                cell.extension.registerClickHandler(handler);
            }
        }

        private unregisterColumnHeaderClickHandler(cell: controls.ITablixCell) {
            if (this.options.onColumnHeaderClick) {
                cell.extension.unregisterClickHandler();
            }
        }

        /**
         * Body Cell.
         */
        public bindBodyCell(item: MatrixVisualBodyItem, cell: controls.ITablixCell): void {
            TablixUtils.resetCellCssClass(cell);

            let cellStyle = new TablixUtils.CellStyle();

            cell.contentHeight = this.textHeightValue;

            let kpi = item.kpiContent;
            if (kpi) {
                $(cell.extension.contentHost).append(kpi);

                // Glyph font has all characters width/height same as font size
                cell.contentWidth = this.fontSizeValue;
            }
            else
            {
                let textProps = this.textPropsValue;

                TablixUtils.addCellCssClass(cell, TablixUtils.CssClassTablixValueNumeric);
                if (item.isTotal) {
                    TablixUtils.addCellCssClass(cell, TablixUtils.CssClassTablixValueTotal);
                    cellStyle.fontFamily = TablixUtils.FontFamilyTotal;
                    cell.contentHeight = this.textHeightTotal;
                    textProps = this.textPropsTotal;
                }

                let textContent = item.textContent;

                if (textContent) {
                    TablixUtils.setCellTextAndTooltip(textContent, cell.extension.contentHost);
                    cell.contentWidth = TextMeasurementService.measureSvgTextWidth(textProps, textContent);
                }
            }

            cell.contentWidth = Math.ceil(cell.contentWidth);

            this.setBodyCellStyle(cell, item, cellStyle);
            cell.applyStyle(cellStyle);
        }

        private setBodyCellStyle(cell: controls.ITablixCell, item: MatrixVisualBodyItem, style: TablixUtils.CellStyle): void {
            let propsGrid = this.formattingProperties.grid;
            let props = this.formattingProperties.values;
            let propsTotal = this.formattingProperties.subtotals;
            let propsRows = this.formattingProperties.rowHeaders;
            let propsColumns = this.formattingProperties.columnHeaders;

            style.paddings.top = style.paddings.bottom = propsGrid.rowPadding;

            style.borders.top = new EdgeSettings();
            if (cell.position.row.isFirst) { // First Row
                style.borders.top.applyParams(outline.showTop(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);

                // If we dont have top border, but Row Headers have, we need to apply extra padding
                if (!outline.showTop(props.outline) && outline.showTop(propsRows.outline))
                    style.paddings.top += propsGrid.outlineWeight;

            } // else: do nothing

            style.borders.bottom = new EdgeSettings();
            if (cell.position.row.isLast) { // Last Row
                style.borders.bottom.applyParams(outline.showBottom(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);

                // If we dont have bottom border, but Row Headers have, we need to apply extra padding
                if (!outline.showBottom(props.outline) && outline.showBottom(propsRows.outline))
                    style.paddings.bottom += propsGrid.outlineWeight;
            }
            else {
                style.borders.bottom.applyParams(propsGrid.gridHorizontal, propsGrid.gridHorizontalWeight, propsGrid.gridHorizontalColor);
            }

            style.borders.left = new EdgeSettings();
            if (cell.position.column.isFirst) { // First Column 
                style.borders.left.applyParams(outline.showLeft(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);
            } // else: do nothing

            style.borders.right = new EdgeSettings();
            if (cell.position.column.isLast) { // Last Column
                style.borders.right.applyParams(outline.showRight(props.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);

                // If we dont have right border, but Column Headers have, we need to apply extra padding
                if (!outline.showRight(props.outline) && outline.showRight(propsColumns.outline))
                    style.paddings.right += propsGrid.outlineWeight;
            }
            else {
                style.borders.right.applyParams(propsGrid.gridVertical, propsGrid.gridVerticalWeight, propsGrid.gridVerticalColor, EdgeType.Gridline);
            }

            let rowBandingIndex: number;
            if (this.formattingProperties.general.rowSubtotals && propsTotal.backColor) // Totals breaking banding sequence
                rowBandingIndex = item.position.row.indexInSiblings;
            else
                rowBandingIndex = item.position.row.index;

            if (item.isTotal && propsTotal.fontColor) {
                style.fontColor = propsTotal.fontColor;
            }
            else {
                style.fontColor = rowBandingIndex % 2 === 0 ? props.fontColorPrimary : props.fontColorSecondary;
            }

            if (item.isTotal && propsTotal.backColor) {
                style.backColor = propsTotal.backColor;
            }
            else {
                style.backColor = rowBandingIndex % 2 === 0 ? props.backColorPrimary : props.backColorSecondary;
            }
        }

        public unbindBodyCell(item: MatrixVisualBodyItem, cell: controls.ITablixCell): void {
            TablixUtils.clearCellStyle(cell);
            TablixUtils.clearCellTextAndTooltip(cell);
        }
        
        /**
         * Corner Cell.
         */
        public bindCornerCell(item: MatrixCornerItem, cell: controls.ITablixCell): void {
            TablixUtils.resetCellCssClass(cell);

            let cellStyle = new TablixUtils.CellStyle();

            cellStyle.fontFamily = TablixUtils.FontFamilyHeader;
            cellStyle.fontColor = TablixUtils.FontColorHeaders;

            cell.contentHeight = this.textHeightHeader;
            cell.contentWidth = 0;

            let cellElement = cell.extension.contentHost;
            if (item.isColumnHeaderLeaf) {
                TablixUtils.addCellCssClass(cell, TablixUtils.CssClassTablixColumnHeaderLeaf);

                cellStyle.borders.bottom = new EdgeSettings(TablixObjects.PropGridOutlineWeight.defaultValue, TablixObjects.PropGridOutlineColor.defaultValue);

                if (this.options.showSortIcons) {
                    let cornerHeaderMetadata = this.getSortableCornerColumnMetadata(item);
                    if (cornerHeaderMetadata) {
                        this.registerColumnHeaderClickHandler(cornerHeaderMetadata, cell);
                        cellElement = TablixUtils.addSortIconToColumnHeader((cornerHeaderMetadata ? cornerHeaderMetadata.sort : undefined), cellElement);

                        if (cornerHeaderMetadata.sort) {
                            // Glyph font has all characters width/height same as font size
                            cell.contentWidth = this.fontSizeHeader + TablixUtils.SortIconPadding;
                        }
                    }
                }
            }

            TablixUtils.setCellTextAndTooltip(item.displayName, cellElement, cell.extension.contentHost);
            cell.contentWidth += TextMeasurementService.measureSvgTextWidth(this.textPropsHeader, item.displayName);
            cell.contentWidth = Math.ceil(cell.contentWidth);

            if (item.isRowHeaderLeaf) {
                TablixUtils.addCellCssClass(cell, TablixUtils.CssClassMatrixRowHeaderLeaf);
            }

            TablixUtils.addCellCssClass(cell, TablixUtils.CssClassTablixHeader);

            this.setCornerCellsStyle(cell, cellStyle);

            cell.applyStyle(cellStyle);
            cell.extension.disableDragResize();
        }

        private setCornerCellsStyle(cell: controls.ITablixCell, style: TablixUtils.CellStyle): void {
            let propsGrid = this.formattingProperties.grid;
            let propsCol = this.formattingProperties.columnHeaders;
            let propsRow = this.formattingProperties.rowHeaders;

            style.fontColor = propsCol.fontColor || propsRow.fontColor;
            style.backColor = propsCol.backColor || propsRow.backColor;

            style.paddings.top = style.paddings.bottom = propsGrid.rowPadding;

            style.borders.top = new EdgeSettings();
            if (cell.position.row.isFirst) {
                style.borders.top.applyParams(outline.showTop(propsCol.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);
            } // else: do nothing

            style.borders.bottom = new EdgeSettings();
            if (cell.position.row.isLast) {
                style.borders.bottom.applyParams(outline.showBottom(propsCol.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);
            }
            else {
                style.borders.bottom.applyParams(propsGrid.gridHorizontal, propsGrid.gridHorizontalWeight, propsGrid.gridHorizontalColor, EdgeType.Gridline);
            }

            style.borders.left = new EdgeSettings();
            if (cell.position.column.isFirst) {
                style.borders.left.applyParams(outline.showLeft(propsCol.outline), propsGrid.outlineWeight, propsGrid.outlineColor, EdgeType.Outline);

                // If we dont have left border, but Row Headers have, we need to apply extra padding
                if (!outline.showLeft(propsCol.outline) && outline.showLeft(propsRow.outline))
                    style.paddings.left += propsGrid.outlineWeight;
            } // else: do nothing

            style.borders.right = new EdgeSettings();
            style.borders.right.applyParams(propsGrid.gridVertical, propsGrid.gridVerticalWeight, propsGrid.gridVerticalColor, EdgeType.Gridline);
        }

        public unbindCornerCell(item: MatrixCornerItem, cell: controls.ITablixCell): void {
            TablixUtils.clearCellStyle(cell);
            TablixUtils.clearCellTextAndTooltip(cell);

            if (this.options.showSortIcons)
                TablixUtils.removeSortIcons(cell);

            if (item.isColumnHeaderLeaf) {
                this.unregisterColumnHeaderClickHandler(cell);
            }
        }

        public bindEmptySpaceHeaderCell(cell: controls.ITablixCell): void {
        }

        public unbindEmptySpaceHeaderCell(cell: controls.ITablixCell): void {
        }

        public bindEmptySpaceFooterCell(cell: controls.ITablixCell): void {
        }

        public unbindEmptySpaceFooterCell(cell: controls.ITablixCell): void {
        }
        
        /**
         * Measurement Helper.
         */
        public getHeaderLabel(item: MatrixVisualNode): string {
            return item.valueFormatted;
        }

        public getCellContent(item: MatrixVisualBodyItem): string {
            return item.textContent || '';
        }

        public hasRowGroups(): boolean {
            // Figure out whether we have a static row header, i.e., not row groups
            let dataView = this.hierarchyNavigator.getDataViewMatrix();

            if (!dataView || !dataView.rows || !dataView.rows.levels || dataView.rows.levels.length === 0)
                return false;

            return true;
        }

        /**
         * Returns the column metadata of the column that needs to be sorted for the specified matrix corner node.
         * 
         * @return Column metadata or null if the specified corner node does not represent a sortable header.
         */
        private getSortableCornerColumnMetadata(item: MatrixCornerItem): DataViewMetadataColumn {
            if (item.isColumnHeaderLeaf)
                return item.metadata;
        }

        private getRowHeaderMetadata(item: MatrixVisualNode): DataViewMetadataColumn {
            if (!this.hierarchyNavigator || !item)
                return;

            let dataView = this.hierarchyNavigator.getDataViewMatrix();

            if (!dataView || !dataView.rows)
                return;

            return this.getHierarchyMetadata(dataView.rows, item.level);
        }

        private getColumnHeaderMetadata(item: MatrixVisualNode): DataViewMetadataColumn {
            if (!this.hierarchyNavigator || !item)
                return;

            let dataView = this.hierarchyNavigator.getDataViewMatrix();
            if (!dataView || !dataView.columns)
                return;

            return this.getHierarchyMetadata(dataView.columns, item.level);
        }

        private getHierarchyMetadata(hierarchy: DataViewHierarchy, level: number): DataViewMetadataColumn {
            if (!hierarchy || !hierarchy.levels || hierarchy.levels.length < level)
                return;

            let levelInfo = hierarchy.levels[level];
            if (!levelInfo || !levelInfo.sources || levelInfo.sources.length === 0)
                return;

            // This assumes the source will always be the first item in the array of sources.
            return levelInfo.sources[0];
        }
        
        /**
         * Returns the column metadata of the column that needs to be sorted for the specified header node.
         * 
         * @return Column metadata or null if the specified header node does not represent a sortable header.
         */
        private getSortableHeaderColumnMetadata(item: MatrixVisualNode): DataViewMetadataColumn {
            let dataView = this.hierarchyNavigator.getDataViewMatrix();

            // If there are no row groups, sorting is not supported (as it does not make sense).
            if (!dataView.rows || !dataView.rows.levels || dataView.rows.levels.length === 0)
                return null;

            let isMultiMeasure: boolean = dataView.valueSources && dataView.valueSources.length > 1;

            let columnGroupCount = dataView.columns ? dataView.columns.levels.length : 0;

            // If we have multiple values, they establish an extra level, so need to subtract 1
            if (isMultiMeasure) {
                columnGroupCount--;
            }
            // Check if it has only 1 measure with no column groups
            else if (columnGroupCount === 1 &&
                dataView.columns.levels[0] &&
                dataView.columns.levels[0].sources && dataView.columns.levels[0].sources[0] &&
                dataView.columns.levels[0].sources[0].roles && dataView.columns.levels[0].sources[0].roles["Values"]) {
                columnGroupCount = 0;
            }

            let valueIndex: number = -1;
            if (columnGroupCount === 0) {
                // Matrices without column groups, support sorting on all columns (which are then measure columns).
                valueIndex = item.levelSourceIndex;
            }
            else if (item.isSubtotal) {
                // Matrices with column groups support sorting only on the column grand total.
                if (isMultiMeasure) {
                    // In the multi-measure case we need to check if the parent's level is 0 in order
                    // to determine whether this is the column grand total.  The cells are layed out such
                    // that the clickable cells are at the innermost level, but the parent for the column
                    // grand total will have level 0.
                    if (item.parent && item.parent.level === 0)
                        valueIndex = item.levelSourceIndex;
                }
                else {
                    // In the single-measure case we can directly check the level of the subtotal to
                    // detect the column grand total (at level 0).
                    if (item.level === 0)
                        valueIndex = item.levelSourceIndex;
                }
            }

            if (valueIndex !== -1) {
                // NOTE: if the valueIndex is undefined it implicitly means that it is 0 based on the 
                //       visual node contract
                valueIndex = valueIndex ? valueIndex : 0;
                return dataView.valueSources[valueIndex];
            }

            return null;
        }
    }

    export interface MatrixConstructorOptions {
        isTouchEnabled?: boolean;
    }

    export class Matrix implements IVisual {
        private static preferredLoadMoreThreshold: number = 0.8;
        
        /**
         * Note: Public only for testing.
         */
        public static TotalLabel = 'TableTotalLabel';

        private element: JQuery;
        private currentViewport: IViewport;
        private style: IVisualStyle;
        private dataView: DataView;
        private formatter: ICustomValueColumnFormatter;
        private isInteractive: boolean;
        private isTouchEnabled: boolean;
        private hostServices: IVisualHostServices;
        private hierarchyNavigator: IMatrixHierarchyNavigator;
        private waitingForData: boolean;
        private tablixControl: controls.TablixControl;
        private lastAllowHeaderResize: boolean;
        private waitingForSort: boolean;
        private columnWidthManager: controls.TablixColumnWidthManager;

        /**
        * Flag indicating that we are persisting objects, so that next onDataChanged can be safely ignored.
        */
        public persistingObjects: boolean;

        constructor(options?: MatrixConstructorOptions) {
            if (options) {
                this.isTouchEnabled = options.isTouchEnabled;
            }
        }

        public static customizeQuery(options: CustomizeQueryOptions): void {
            let dataViewMapping = options.dataViewMappings[0];
            if (!dataViewMapping || !dataViewMapping.matrix || !dataViewMapping.metadata)
                return;

            let dataViewMatrix: data.CompiledDataViewMatrixMapping = <data.CompiledDataViewMatrixMapping>dataViewMapping.matrix;

            // If Columns Hierarchy is not empty, set Window DataReduction Count to 100
            if (!_.isEmpty(dataViewMatrix.columns.for.in.items)) {
                dataViewMatrix.rows.dataReductionAlgorithm.window.count = 100;
            }
            let objects: DataViewObjects = dataViewMapping.metadata.objects;
            (<data.CompiledDataViewRoleForMappingWithReduction>dataViewMatrix.rows).for.in.subtotalType = TablixObjects.shouldShowRowSubtotals(objects) ? data.CompiledSubtotalType.After : data.CompiledSubtotalType.None;
            dataViewMatrix.columns.for.in.subtotalType = TablixObjects.shouldShowColumnSubtotals(objects) ? data.CompiledSubtotalType.After : data.CompiledSubtotalType.None;
        }

        public static getSortableRoles(): string[] {
            return ['Rows', 'Values'];
        }

        public init(options: VisualInitOptions): void {
            this.element = options.element;
            this.style = options.style;
            this.updateViewport(options.viewport);
            this.formatter = valueFormatter.formatVariantMeasureValue;
            this.isInteractive = options.interactivity && options.interactivity.selection != null;
            this.hostServices = options.host;
            this.persistingObjects = false;

            this.waitingForData = false;
            this.lastAllowHeaderResize = true;
            this.waitingForSort = false;
        }

        public static converter(dataView: DataView): TablixFormattingPropertiesMatrix {
            debug.assertValue(dataView, 'dataView');

            return TablixObjects.getMatrixObjects(dataView);
        }

        public onResizing(finalViewport: IViewport): void {
            this.updateViewport(finalViewport);
        }

        /*
        Public for testing
        */
        public getColumnWidthManager(): controls.TablixColumnWidthManager {
            return this.columnWidthManager;
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            debug.assertValue(options, 'options');

            let dataViews = options.dataViews;

            if (dataViews && dataViews.length > 0) {
                let previousDataView = this.dataView;
                this.dataView = dataViews[0];

                // We don't check for persisting flag
                // Any change to the Column Widths need to go through to update all column group instances
                // ToDo: Consider not resetting scrollbar everytime

                let formattingProperties = Matrix.converter(this.dataView);
                let textSize = formattingProperties.general.textSize;

                if (options.operationKind === VisualDataChangeOperationKind.Append) {
                    // If Root for Rows or Columns has changed by the DataViewTransform (e.g. when having reorders in values)
                    let rootChanged = previousDataView.matrix.rows.root !== this.dataView.matrix.rows.root;
                    this.createOrUpdateHierarchyNavigator(rootChanged);
                    
                    if (rootChanged)
                        this.tablixControl.updateModels(/*resetScrollOffsets*/false, this.dataView.matrix.rows.root.children, this.dataView.matrix.columns.root.children);

                    this.refreshControl(/*clear*/false);
                } else {
                    this.createOrUpdateHierarchyNavigator(true);
                    this.createColumnWidthManager();
                    this.createTablixControl(textSize);
                    let binder = <MatrixBinder>this.tablixControl.getBinder();
                    binder.onDataViewChanged(formattingProperties);

                    this.updateInternal(textSize, previousDataView);
                }
            }

            this.waitingForData = false;
            this.waitingForSort = false;
        }

        private createColumnWidthManager(): void {
            let columnHierarchy: MatrixHierarchy = (<MatrixHierarchyNavigator>this.hierarchyNavigator).getMatrixColumnHierarchy();
            if (!this.columnWidthManager) {
                this.columnWidthManager = new controls.TablixColumnWidthManager(this.dataView, true /* isMatrix */, (objectInstances: VisualObjectInstancesToPersist) => this.persistColumnWidths(objectInstances), columnHierarchy.leafNodes);
            }
            // Dont update if dataView is coming from persisting
            else if (!this.persistingObjects) {
                this.columnWidthManager.updateDataView(this.dataView, columnHierarchy.leafNodes);
            }
        }

        private persistColumnWidths(objectInstances: VisualObjectInstancesToPersist): void {
            this.persistingObjects = true;
            this.hostServices.persistProperties(objectInstances);
        }

        private updateViewport(newViewport: IViewport) {
            this.currentViewport = newViewport;

            if (this.tablixControl) {
                this.tablixControl.viewport = this.currentViewport;
                this.verifyHeaderResize();

                this.refreshControl(/*clear*/false);
            }
        }

        private refreshControl(clear: boolean) {
            if (visibilityHelper.partiallyVisible(this.element) || this.getLayoutKind() === controls.TablixLayoutKind.DashboardTile) {
                this.tablixControl.refresh(clear);
            }
        }

        private getLayoutKind() {
            return this.isInteractive ? controls.TablixLayoutKind.Canvas : controls.TablixLayoutKind.DashboardTile;
        }

        private createOrUpdateHierarchyNavigator(rootChanged: boolean): void {
            let isDataComplete = !this.dataView.metadata.segment;

            if (!this.tablixControl) {
                let matrixNavigator = createMatrixHierarchyNavigator(this.dataView.matrix, isDataComplete, this.formatter, this.hostServices.getLocalizedString('ListJoin_Separator'));
                this.hierarchyNavigator = matrixNavigator;
            }
            else {
                this.hierarchyNavigator.update(this.dataView.matrix, isDataComplete, rootChanged);
            }
        }

        private createTablixControl(textSize: number): void {
            if (!this.tablixControl) {
                // Create the control
                this.tablixControl = this.createControl(this.hierarchyNavigator, textSize);
            }
        }

        private createControl(matrixNavigator: IMatrixHierarchyNavigator, textSize: number): controls.TablixControl {
            let layoutKind = this.getLayoutKind();

            let matrixBinderOptions: MatrixBinderOptions = {
                onBindRowHeader: (item: MatrixVisualNode) => { this.onBindRowHeader(item); },
                totalLabel: this.hostServices.getLocalizedString(Matrix.TotalLabel),
                onColumnHeaderClick: (queryName: string, sortDirection: SortDirection) => this.onColumnHeaderClick(queryName, sortDirection),
                showSortIcons: layoutKind === controls.TablixLayoutKind.Canvas,
            };
            let matrixBinder = new MatrixBinder(this.hierarchyNavigator, matrixBinderOptions);

            let layoutManager: controls.internal.TablixLayoutManager = layoutKind === controls.TablixLayoutKind.DashboardTile
                ? controls.internal.DashboardTablixLayoutManager.createLayoutManager(matrixBinder)
                : controls.internal.CanvasTablixLayoutManager.createLayoutManager(matrixBinder, this.columnWidthManager);

            let tablixContainer = document.createElement('div');
            this.element.append(tablixContainer);

            let tablixOptions: controls.TablixOptions = {
                interactive: this.isInteractive,
                enableTouchSupport: this.isTouchEnabled,
                layoutKind: layoutKind,
                fontSize: TablixObjects.getTextSizeInPx(textSize),
            };

            return new controls.TablixControl(matrixNavigator, layoutManager, matrixBinder, tablixContainer, tablixOptions);
        }

        private updateInternal(textSize: number, previousDataView: DataView) {
            if (this.getLayoutKind() === controls.TablixLayoutKind.DashboardTile) {
                this.tablixControl.layoutManager.adjustContentSize(converterHelper.hasImageUrlColumn(this.dataView));
            }

            this.tablixControl.fontSize = TablixObjects.getTextSizeInPx(textSize);
            this.verifyHeaderResize();

            /* To avoid resetting scrollbar every time we persist Objects. If:
            * AutoSizeColumns options was flipped
            * A Column was resized manually
            * A Column was auto-sized
            */

            // Update models before the viewport to make sure column widths are computed correctly
            // if a persisting operation is going, don't reset the scrollbar (column resize)
            this.tablixControl.updateModels(/*resetScrollOffsets*/!this.persistingObjects, this.dataView.matrix.rows.root.children, this.dataView.matrix.columns.root.children);
            this.tablixControl.viewport = this.currentViewport;
            let shouldClearControl = this.shouldClearControl(previousDataView, this.dataView);

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

            // ToDo: Get better criteria
            return !DataViewAnalysis.isMetadataEquivalent(previousDataView.metadata, newDataView.metadata);
        }

        private onBindRowHeader(item: MatrixVisualNode): void {
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
        public needsMoreData(item: MatrixVisualNode): boolean {
            if (this.waitingForData || !this.hierarchyNavigator.isLeaf(item) || !this.dataView.metadata || !this.dataView.metadata.segment)
                return false;

            let leafCount = this.tablixControl.rowDimension.getItemsCount();
            let loadMoreThreshold = leafCount * Matrix.preferredLoadMoreThreshold;

            return this.hierarchyNavigator.getLeafIndex(item) >= loadMoreThreshold;
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let enumeration = new ObjectEnumerationBuilder();

            // Visuals are initialized with an empty data view before queries are run, therefore we need to make sure that
            // we are resilient here when we do not have data view.
            if (this.dataView) {
                TablixObjects.enumerateObjectInstances(options, enumeration, this.dataView, controls.TablixType.Matrix);
            }

            return enumeration.complete();
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