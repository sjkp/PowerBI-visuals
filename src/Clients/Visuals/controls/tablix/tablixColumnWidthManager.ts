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

/// <reference path="../../_references.ts"/>

module powerbi.visuals.controls {
    import PropAutoSizeWidth = internal.TablixObjects.PropGeneralAutoSizeColumns;
    import getMetadataObjects = internal.TablixObjects.getMetadadataObjects;

    /**
     * Column Width Object identifying a certain column and its width
     */
    export interface ColumnWidthObject {
        /**
        * QueryName of the Column
        */
        queryName: string;

        /**
        * Flag indicating whether the Column should have a fixed size or fit its size to the contents
        */
        isFixed: boolean;

        /**
        * Width of the column in px.
        * If isFixed=False, undefined always
        * If isFixed=True, undefined if unknown
        */
        width?: number;
    }

    /**
     * Collection of Column Widths indexed by Column's queryName
    */
    export interface ColumnWidthCollection {
        [queryName: string]: ColumnWidthObject;
    }

     /**
     * Handler for Column Width Changed event
     */
    export interface ColumnWidthChangedCallback {
        (columnWidthChangedEventArgs: ColumnWidthObject): void;
    }

    /**
     * Handler for requesting host to persist Column Width Objects
     */
    export interface HostPersistCallBack {
        (visualObjectInstances: VisualObjectInstancesToPersist): void;
    }

    export class TablixColumnWidthManager {
        /**
        * PropertyID for Column Widths (General > columnWidth)
        */
        private static columnWidthProp: DataViewObjectPropertyIdentifier = { objectName: 'general', propertyName: 'columnWidth' };

        /**
        * Array holding widths for all columns. Index is the queryName of the column
        */
        private columnWidthObjects: ColumnWidthCollection;

        /**
        * Visual Object Instances to be persisted. Containing autoSizeProperty and any width to remove/merge
        */
        private visualObjectInstancesToPersist: VisualObjectInstancesToPersist;

        /**
         * True if the Tablix is a Matrix
         */
        private isMatrix: boolean;
        /**
        * Array of all leaf nodes (Row Groupings + Columns/Values instances)
        */
        private matrixLeafNodes: MatrixVisualNode[];
        /**
        * Current DataView
        */
        private currentDataView: DataView;
        /**
        * Current value of AutoSizeColumns after last DataView Update
        */
        private currentAutoColumnSizePropertyValue: boolean;

        /**
        * Previous DataView
        */
        private previousDataView: DataView;
        /**
        * Previous value of AutoSizeColumns before last DataView Update
        */
        private previousAutoColumnSizePropertyValue: boolean;

        /**
        * Handler for requesting host to persist Column Width Objects
        */
        private hostPersistCallBack: HostPersistCallBack;

        constructor(dataView: DataView, isMatrix: boolean, hostPersistCallBack: HostPersistCallBack, matrixLeafNodes?: MatrixVisualNode[]) {
            this.columnWidthObjects = {};
            this.isMatrix = isMatrix;
            this.updateDataView(dataView, matrixLeafNodes);
            this.hostPersistCallBack = hostPersistCallBack;
            this.visualObjectInstancesToPersist = { merge: [], remove: [] };
        }

        // #region Update DataView
        /**
         * Update the current DataView
         * @param {dataView} DataView new DataView
         * @param {MatrixVisualNode[]} matrixLeafNodes? (Optional)Matrix Leaf Nodes
         */
        public updateDataView(dataView: DataView, matrixLeafNodes?: MatrixVisualNode[]): void {
            this.previousDataView = this.currentDataView;
            if (this.previousDataView)
                this.previousAutoColumnSizePropertyValue = PropAutoSizeWidth.getValue<boolean>(getMetadataObjects(this.previousDataView));
            else
                this.previousAutoColumnSizePropertyValue = undefined;

            this.currentDataView = dataView;
            if (this.currentDataView)
                this.currentAutoColumnSizePropertyValue = PropAutoSizeWidth.getValue<boolean>(getMetadataObjects(this.currentDataView));
            else
                this.currentAutoColumnSizePropertyValue = undefined;

            this.matrixLeafNodes = matrixLeafNodes;
            
            this.updateColumnsMetadata();

            this.updateTablixColumnWidths();
        }

        /**
        * Destroy columnWidthObjects and construct it again from the currently displayed Columns with initial width undefined
        */
        private updateColumnsMetadata(): void {
            this.columnWidthObjects = {};

            if (this.isMatrix)
                this.updateMatrixColumnsMetadata();
            else
                this.updateTableColumnsMetadata();
        }

        private updateTableColumnsMetadata(): void {
            if (this.currentDataView && this.currentDataView.table) {
                let columnMetaData = this.currentDataView.table.columns;
                for (let i = 0, len = columnMetaData.length; i < len; i++) {
                    let queryName = columnMetaData[i].queryName;
                    if (queryName)
                        this.columnWidthObjects[queryName] = {
                            queryName: queryName,
                            width: undefined,
                            isFixed: false
                        };
                }
            }
        }

        private updateMatrixColumnsMetadata(): void {
            // Matrix visual columns are row headers and column hierarchy leaves

            if (this.currentDataView && this.currentDataView.matrix && this.currentDataView.matrix.rows) {
                // Get query names of row groups (row headers)
                // queryName is undefined for composite-group
                for (let i = 0, len = this.currentDataView.matrix.rows.levels.length; i < len; i++) {
                    let rowGroup = this.currentDataView.matrix.rows.levels[i];
                    if (rowGroup.sources.length === 1) { // Only handle non-composite groups
                        let queryName = rowGroup.sources[0].queryName;
                        if (queryName)
                            this.columnWidthObjects[queryName] = {
                                queryName: queryName,
                                width: undefined,
                                isFixed: false
                            };
                    }
                }
            }

            // Get query names of columns leaves or values
            // queryName is undefined for composite-group
            if (this.matrixLeafNodes) {
                for (let i = 0, len = this.matrixLeafNodes.length; i < len; i++) {
                    let queryName = this.matrixLeafNodes[i].queryName;
                    if (queryName)
                        this.columnWidthObjects[queryName] = {
                            queryName: queryName,
                            width: undefined,
                            isFixed: false
                        };
                }
            }
        }

        /**
         * Update the column widths after a dataViewChange
         */
        public updateTablixColumnWidths(): void {
            let columnMetaData = this.currentDataView && this.currentDataView.metadata && this.currentDataView.metadata.columns;
            if (columnMetaData) {
                // Auto-Size false to true.
                // Blow away any saved widths and revert back to default of calculating column sizes
                if (this.shouldClearAllColumnWidths()) {
                    this.autoSizeAllColumns();
                    return;
                }

                // Normal new data -> Get new column widths
                else {
                    this.deserializeColumnsWidth(columnMetaData);
                }
            }
        }

        /**
         * Remove all persisted columns widths and Update visualObjectInstancesToPersist
         */
        private autoSizeAllColumns(): void {
            for (let queryName in this.columnWidthObjects) {
                this.visualObjectInstancesToPersist.remove.push(this.generateColumnWidthObjectToPersist(queryName, undefined));
            }

            this.callHostToPersist();
        }

        /**
         * Read the Column Widths from the Columns metadata
         * @param {DataViewMetadataColumn[]} columnMetadata Columns metadata
         */
        private deserializeColumnsWidth(columnsMetadata: DataViewMetadataColumn[]): void {
            // Clear existing widths
            for (let colObj in this.columnWidthObjects) {
                this.columnWidthObjects[colObj].isFixed = !this.currentAutoColumnSizePropertyValue;
                this.columnWidthObjects[colObj].width = undefined;
            }

            for (let i = 0, len = columnsMetadata.length; i < len; i++) {
                let column = columnsMetadata[i];
                let queryName = column.queryName;
                let width = DataViewObjects.getValue<number>(column.objects, TablixColumnWidthManager.columnWidthProp);

                if (this.columnWidthObjects.hasOwnProperty(queryName) && width != null) {
                    this.columnWidthObjects[queryName].width = width;
                    this.columnWidthObjects[queryName].isFixed = true;
                }
            }
        }
        // #endregion

        // #region AutoSize toggle
        /**
         * Returns a value indicating that autoSizeColumns was flipped from true to false
         */
        public shouldPersistAllColumnWidths(): boolean {
            // We don't have a previous DataView -> Don't persist
            if (!this.previousDataView)
                return false;

            // We had a DataView before -> return true if Autosize switched from true to false
            else
                return !this.currentAutoColumnSizePropertyValue && this.previousAutoColumnSizePropertyValue;
        }

        /**
         * Returns a value indicating that autoSizeColumns was flipped from false to true
         */
        public shouldClearAllColumnWidths(): boolean {
            return this.previousDataView != null && this.previousAutoColumnSizePropertyValue === false
                && this.currentDataView != null && this.currentAutoColumnSizePropertyValue === true;
        }
        // #endregion

         /**
         * Gets the QueryName associated with a Column (Column Header or Corner Item)
         * @param {internal.TablixColumn} column TablixColumn
         * @returns queryName
         */
        public static getColumnQueryName(column: internal.TablixColumn): string {
            let headerCell = column.getTablixCell();

            switch (headerCell.type) {
                case TablixCellType.CornerCell:
                    if (headerCell.item == null                 // Corner item for Table hidden column
                        || headerCell.item.metadata == null)    // Corner item for Matrix with no row groups
                        return undefined;

                    return headerCell.item.metadata.queryName;

                case TablixCellType.ColumnHeader:
                    debug.assert(headerCell.item != null, "Tablix Column without a ColumnMetadata");
                    return headerCell.item.queryName;

                default:
                    debug.assertFail("getColumnQueryName called with cellType: " + headerCell.type);
                    return undefined;
            }
        }

        /**
         * Returns the current columnWidthObjects
         * @returns current columnWidthObjects including undefined widths for autosized or unknown columns
         */
        public getColumnWidthObjects(): ColumnWidthCollection {
            return this.columnWidthObjects;
        }

        /**
         * Returns the current columnWidthObjects for only the fixed-size columns
         * @returns Returns the current columnWidthObjects excluding auto-sized columns
         */
        public getFixedColumnWidthObjects(): ColumnWidthCollection {
            let fixedOnly: ColumnWidthCollection = {};

            for (let queryName in this.columnWidthObjects) {
                let obj = this.columnWidthObjects[queryName];
                if (obj.isFixed) {
                    fixedOnly[queryName] = obj;
                }
            }

            return fixedOnly;
        }

        /**
         * Get the persisted width of a certain column in px, or undefined if the columns is set to autosize or queryName is not found
         * @param {string} queryName queryName of the Column
         * @returns Column persisted width in pixel
         */
        public getPersistedColumnWidth(queryName: string): number {
            let obj = this.columnWidthObjects[queryName];
            return obj && obj.width;
        }

        /**
         * Call the host to persist the data
         * @param {boolean} generateInstances
         */
        private callHostToPersist() {
            if (this.hostPersistCallBack) {
                this.hostPersistCallBack(this.visualObjectInstancesToPersist);
            }

            // Clears persisted objects list
            this.visualObjectInstancesToPersist = {
                merge: [],
                remove: [],
            };
        }

        /**
         * Handler for a column width change by the user
         * @param {string} queryName queryName of the Column
         * @param {number} width new width
         */
        public onColumnWidthChanged(queryName: string, width: number): void {
            // Resizing an invalid column
            if (queryName == null || this.columnWidthObjects[queryName] == null)
                return;

            let resizedColumn = this.columnWidthObjects[queryName];

            if (width === -1) { // Column Autosize
                // If AutoSize option is ON, remove the persisted value
                // Else, set value to unknown and expect to be called again soon
                resizedColumn.width = undefined;
                resizedColumn.isFixed = !this.currentAutoColumnSizePropertyValue;

                // Call persist anyway, if isFixed is true, it will be assined to the rendered width
                this.visualObjectInstancesToPersist.remove.push(this.generateColumnWidthObjectToPersist(resizedColumn.queryName, undefined));
                this.callHostToPersist();
            }
            else { // Column Resize
                resizedColumn.width = width;
                resizedColumn.isFixed = true;

                this.visualObjectInstancesToPersist.merge.push(this.generateColumnWidthObjectToPersist(queryName, width));
                this.callHostToPersist();
            }
        }

        /**
         * Event handler after rendering all columns. Setting any unknown column width.
         * Returns True if it calls persist
         * @param renderedColumns Rendered Columns
         */
        public onColumnsRendered(renderedColumns: ColumnWidthObject[]): boolean {
            // Pick the maximum width for each queryName
            // This will ensure going from autoSize ON to OFF will not show any ellipsis
            let maxWidths: ColumnWidthCollection = {};
            for (let i = 0, len = renderedColumns.length; i < len; i++) {
                let queryName = renderedColumns[i].queryName;
                let newWidth = renderedColumns[i].width;

                if (maxWidths[queryName] == null) {
                    maxWidths[queryName] = {
                        queryName: queryName,
                        width: newWidth,
                        isFixed: false // Unused
                    };
                }
                else if (newWidth > maxWidths[queryName].width) {
                    maxWidths[queryName].width = newWidth;
                }
            }

            let widthChanged = false;
            for (let queryName in this.columnWidthObjects) {
                if (maxWidths[queryName]) { // Needs to check here. renderedColumns only have visualized ones
                    let colWidthObj = this.columnWidthObjects[queryName];

                    if (colWidthObj.isFixed && colWidthObj.width == null) {
                        colWidthObj.width = maxWidths[queryName].width;
                        this.visualObjectInstancesToPersist.merge.push(this.generateColumnWidthObjectToPersist(queryName, colWidthObj.width));
                        widthChanged = true;
                    }
                }
            }

            if (widthChanged)
                this.callHostToPersist();

            return widthChanged;
        }

        private generateColumnWidthObjectToPersist(queryName: string, width: number): VisualObjectInstance {
            return {
                selector: { metadata: queryName },
                objectName: 'general',
                properties: { columnWidth: width }
            };
        }
    }
}