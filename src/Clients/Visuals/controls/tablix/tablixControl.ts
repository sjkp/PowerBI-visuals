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
    export const TablixDefaultTextSize = jsCommon.TextSizeDefaults.TextSizeMin;

    export interface TablixRenderArgs {
        rowScrollOffset?: number;
        columnScrollOffset?: number;
        scrollingDimension?: TablixDimension;
    }

    export interface GridDimensions {
        rowCount?: number;
        columnCount?: number;
        rowHierarchyWidth?: number;
        rowHierarchyHeight?: number;
        rowHierarchyContentHeight?: number;
        columnHierarchyWidth?: number;
        columnHierarchyHeight?: number;
        footerHeight?: number;
    }

    export const enum TablixLayoutKind {
        /**
         * The default layout is based on DOM measurements and used on the canvas.
         */
        Canvas,
        
        /**
         * The DashboardTile layout must not rely on any kind of DOM measurements
         * since the tiles are created when the dashboard is not visible and the
         * visual is not rendered; thus no measurements are available.
         */
        DashboardTile,
    }

    export interface TablixOptions {
        interactive?: boolean;
        enableTouchSupport?: boolean;
        layoutKind?: TablixLayoutKind;
        fontSize?: string;
    }

    export class TablixControl {
        private static UnitOfMeasurement = 'px';
        private static TablixContainerClassName = 'tablixContainer';
        private static TablixTableAreaClassName = "tablixTableArea";
        private static TablixFooterClassName = "tableFooterArea";
        private static DefaultFontSize = jsCommon.PixelConverter.fromPoint(controls.TablixDefaultTextSize);
        /*
        * This is workaround for the infinite loop in rendering
        * BugID: 6518621
        * ToDo: Investigate the underlying cause for rendering to never report completion
        * Rendering typically require 3-5 iterations to complete, so 10 is enough
        */
        private static MaxRenderIterationCount = 10;

        private hierarchyTablixNavigator: ITablixHierarchyNavigator;
        private binder: ITablixBinder;

        private columnDim: TablixColumnDimension;
        private rowDim: TablixRowDimension;
        private controlLayoutManager: internal.TablixLayoutManager;

        private containerElement: HTMLDivElement;
        private mainDiv: HTMLDivElement;
        private footerDiv: HTMLDivElement;

        private scrollBarElementWidth = 9;

        private touchManager: TouchUtils.TouchManager;
        private columnTouchDelegate: ColumnTouchDelegate;
        private rowTouchDelegate: RowTouchDelegate;
        private bodyTouchDelegate: BodyTouchDelegate;
        private footerTouchDelegate: ColumnTouchDelegate;
        private touchInterpreter: TouchUtils.TouchEventInterpreter;
        private footerTouchInterpreter: TouchUtils.TouchEventInterpreter;

        private gridDimensions: GridDimensions;
        private lastRenderingArgs: TablixRenderArgs;

        /* tslint:disable:no-underscore-prefix-for-variables*/
        private _autoSizeWidth: boolean;
        private _autoSizeHeight: boolean;
        /* tslint:enable:no-underscore-prefix-for-variables*/
        private viewPort: IViewport;
        private maximumWidth: number;
        private maximumHeight: number;
        private minimumWidth: number;
        private minimumHeight: number;
        private textFontSize: string;
        private textFontFamily: string;
        private textFontColor: string;

        private options: TablixOptions;
        private isTouchEnabled: boolean;

        private renderIterationCount: number;

        constructor(
            hierarchyNavigator: ITablixHierarchyNavigator,
            layoutManager: internal.TablixLayoutManager,
            binder: ITablixBinder,
            parentDomElement: HTMLElement,
            options: TablixOptions) {

            // Options (fontSize set after container initialized)
            this.options = options;
            let isInteractive = options.interactive;
            this.isTouchEnabled = isInteractive && options.enableTouchSupport;

            // Main Div
            this.mainDiv = internal.TablixUtils.createDiv();
            this.mainDiv.classList.add(TablixControl.TablixTableAreaClassName);

            // Footer Div
            this.footerDiv = internal.TablixUtils.createDiv();
            this.footerDiv.classList.add(TablixControl.TablixFooterClassName);

            if (this.isTouchEnabled)
                this.InitializeTouchSupport();

            this.gridDimensions = {};

            this.containerElement = internal.TablixUtils.createDiv();
            this.className = layoutManager.getTablixClassName();
            this.autoSizeWidth = false;
            this.autoSizeHeight = false;
            this.fontFamily = internal.TablixUtils.FontFamilyCell;
            this.fontColor = internal.TablixUtils.FontColorCells;
            this.fontSize = options.fontSize;

            parentDomElement.className = TablixControl.TablixContainerClassName;
            parentDomElement.appendChild(this.containerElement);

            this.containerElement.addEventListener("mousewheel", (e) => { this.onMouseWheel(<MouseWheelEvent>e); });
            this.containerElement.addEventListener("DOMMouseScroll", (e) => { this.onFireFoxMouseWheel(<MouseWheelEvent>e); });
            this.containerElement.appendChild(this.mainDiv);
            this.containerElement.appendChild(this.footerDiv);

            if (this.isTouchEnabled) {
                this.touchInterpreter.initTouch(this.mainDiv, null, false);
                this.footerTouchInterpreter.initTouch(this.footerDiv, this.mainDiv, false);
            }

            this.controlLayoutManager = layoutManager;
            this.controlLayoutManager.initialize(this);

            this.hierarchyTablixNavigator = hierarchyNavigator;
            this.binder = binder;

            this.columnDim = new TablixColumnDimension(this);
            this.rowDim = new TablixRowDimension(this);
            this.columnDim._otherDimension = this.rowDimension;
            this.rowDim._otherDimension = this.columnDimension;

            this.InitializeScrollbars();
            if (!isInteractive) {
                this.scrollbarWidth = 0;
            }

            this.updateHorizontalPosition();
            this.updateVerticalPosition();

            this.updateFooterVisibility();

            this.lastRenderingArgs = {};
        }

        private InitializeTouchSupport(): void {
            this.touchManager = new TouchUtils.TouchManager();
            this.touchInterpreter = new TouchUtils.TouchEventInterpreter(this.touchManager);
            this.footerTouchInterpreter = new TouchUtils.TouchEventInterpreter(this.touchManager);
            this.columnTouchDelegate = new ColumnTouchDelegate(new TouchUtils.Rectangle());
            this.rowTouchDelegate = new RowTouchDelegate(new TouchUtils.Rectangle());
            this.bodyTouchDelegate = new BodyTouchDelegate(new TouchUtils.Rectangle());
            this.footerTouchDelegate = new ColumnTouchDelegate(new TouchUtils.Rectangle());

            this.columnTouchDelegate.setHandler(this, this.onTouchEvent);
            this.rowTouchDelegate.setHandler(this, this.onTouchEvent);
            this.bodyTouchDelegate.setHandler(this, this.onTouchEvent);
            this.footerTouchDelegate.setHandler(this, this.onTouchEvent);

            this.touchManager.addTouchRegion(this.columnTouchDelegate.dimension, this.columnTouchDelegate, this.columnTouchDelegate);
            this.touchManager.addTouchRegion(this.rowTouchDelegate.dimension, this.rowTouchDelegate, this.rowTouchDelegate);
            this.touchManager.addTouchRegion(this.bodyTouchDelegate.dimension, this.bodyTouchDelegate, this.bodyTouchDelegate);
            this.touchManager.addTouchRegion(this.footerTouchDelegate.dimension, this.footerTouchDelegate, this.footerTouchDelegate);
        }

        private InitializeScrollbars(): void {
            // Row Dimension
            this.rowDim._initializeScrollbar(this.containerElement, null, this.options.layoutKind);

            let rowDimensionScrollbarStyle = this.rowDim.scrollbar.element.style;
            rowDimensionScrollbarStyle.position = "absolute";
            rowDimensionScrollbarStyle.top = "0" + TablixControl.UnitOfMeasurement;
            rowDimensionScrollbarStyle.right = "0" + TablixControl.UnitOfMeasurement;
            this.rowDim.scrollbar.width = this.scrollBarElementWidth + TablixControl.UnitOfMeasurement;

            // Default to true which is the more common case to avoid an extra rendering iteration
            // when first rendering the visual
            this.rowDim.scrollbar.show(true);

            // Column Dimension
            this.columnDim._initializeScrollbar(this.containerElement, null, this.options.layoutKind);

            let columnDimensionScrollbarStyle = this.columnDim.scrollbar.element.style;
            columnDimensionScrollbarStyle.position = "absolute";
            columnDimensionScrollbarStyle.left = "0" + TablixControl.UnitOfMeasurement;
            columnDimensionScrollbarStyle.bottom = "0" + TablixControl.UnitOfMeasurement;
            this.columnDim.scrollbar.height = this.scrollBarElementWidth + TablixControl.UnitOfMeasurement;

            this.columnDim.scrollbar.show(false);
        }

        public get container(): HTMLElement {
            return this.containerElement;
        }

        public get contentHost(): HTMLElement {
            return this.mainDiv;
        }

        public get footerHost(): HTMLElement {
            return this.footerDiv;
        }

        public set className(value: string) {
            this.containerElement.className = value;
        }

        public get hierarchyNavigator(): ITablixHierarchyNavigator {
            return this.hierarchyTablixNavigator;
        }

        public getBinder(): ITablixBinder {
            return this.binder;
        }

        public get autoSizeWidth(): boolean {
            return this._autoSizeWidth;
        }

        public set autoSizeWidth(value: boolean) {
            this._autoSizeWidth = value;

            if (!value) {
                this.containerElement.style.minWidth = this.containerElement.style.maxWidth = "none";
            }
        }

        public get autoSizeHeight(): boolean {
            return this._autoSizeHeight;
        }

        public set autoSizeHeight(value: boolean) {
            if (!value) {
                this.containerElement.style.minHeight = this.containerElement.style.maxHeight = "none";
            }
        }

        public get maxWidth(): number {
            return this.maximumWidth;
        }

        public set maxWidth(value: number) {
            this.maximumWidth = value;
            this.containerElement.style.maxWidth = this.maximumWidth + TablixControl.UnitOfMeasurement;
        }

        public get viewport(): IViewport {
            return this.viewPort;
        }

        public set viewport(value: IViewport) {
            this.viewPort = value;
            this.containerElement.style.width = this.viewPort.width + TablixControl.UnitOfMeasurement;
            this.containerElement.style.height = this.viewPort.height + TablixControl.UnitOfMeasurement;

            this.rowDim.scrollbar.invalidateArrange();
            this.columnDim.scrollbar.invalidateArrange();

            this.controlLayoutManager.updateViewport(this.viewPort);
        }

        public get maxHeight(): number {
            return this.maximumHeight;
        }

        public set maxHeight(value: number) {
            this.maximumHeight = value;
            this.containerElement.style.maxHeight = this.maximumHeight + TablixControl.UnitOfMeasurement;
        }

        public get minWidth(): number {
            return this.minimumWidth;
        }

        public set minWidth(value: number) {
            this.minimumWidth = value;
            this.containerElement.style.minWidth = this.minimumWidth + TablixControl.UnitOfMeasurement;
        }

        public get minHeight(): number {
            return this.minimumHeight;
        }

        public set minHeight(value: number) {
            this.minimumHeight = value;
            this.containerElement.style.minHeight = this.minimumHeight + TablixControl.UnitOfMeasurement;
        }

        public get fontSize(): string {
            return this.textFontSize;
        }

        public set fontSize(value: string) {
            this.textFontSize = !value ? TablixControl.DefaultFontSize : value;
            this.containerElement.style.fontSize = this.textFontSize;
        }

        public get fontFamily(): string {
            return this.textFontFamily;
        }

        public set fontFamily(value: string) {
            this.textFontFamily = value;
            this.containerElement.style.fontFamily = value;
        }

        public get fontColor(): string {
            return this.textFontColor;
        }

        public set fontColor(value: string) {
            this.textFontColor = value;
            this.containerElement.style.color = value;
        }

        public set scrollbarWidth(value: number) {
            this.scrollBarElementWidth = value;
            this.rowDim.scrollbar.width = this.scrollBarElementWidth + TablixControl.UnitOfMeasurement;
            this.columnDim.scrollbar.height = this.scrollBarElementWidth + TablixControl.UnitOfMeasurement;
        }

        public updateModels(resetScrollOffsets: boolean, rowModel: any, columnModel: any): void {
            this.rowDim.model = rowModel;
            this.rowDim.modelDepth = this.hierarchyNavigator.getRowHierarchyDepth();
            this.columnDim.model = columnModel;
            this.columnDim.modelDepth = this.hierarchyNavigator.getColumnHierarchyDepth();

            if (resetScrollOffsets) {
                this.rowDim.scrollOffset = 0;
                this.columnDim.scrollOffset = 0;
            }

            this.layoutManager.updateColumnCount(this.rowDim, this.columnDim);
        }

        public updateColumnDimensions(rowHierarchyWidth: number, columnHierarchyWidth: number, count: number) {
            let gridDimensions = this.gridDimensions;

            gridDimensions.columnCount = count;
            gridDimensions.rowHierarchyWidth = rowHierarchyWidth;
            gridDimensions.columnHierarchyWidth = columnHierarchyWidth;
        }

        public updateRowDimensions(columnHierarchyHeight: number, rowHierarchyHeight: number, rowHierarchyContentHeight: number, count: number, footerHeight) {
            let gridDimensions = this.gridDimensions;

            gridDimensions.rowCount = count;
            gridDimensions.rowHierarchyHeight = rowHierarchyHeight;
            gridDimensions.rowHierarchyContentHeight = rowHierarchyContentHeight;
            gridDimensions.columnHierarchyHeight = columnHierarchyHeight;
            gridDimensions.footerHeight = footerHeight;
        }

        private updateTouchDimensions(): void {
            let gridDimensions = this.gridDimensions;

            this.columnTouchDelegate.resize(gridDimensions.rowHierarchyWidth, 0, gridDimensions.columnHierarchyWidth, gridDimensions.columnHierarchyHeight);
            this.columnTouchDelegate.setScrollDensity(gridDimensions.columnCount / gridDimensions.columnHierarchyWidth);

            this.rowTouchDelegate.resize(0, gridDimensions.columnHierarchyHeight, gridDimensions.rowHierarchyWidth, gridDimensions.rowHierarchyHeight);
            this.rowTouchDelegate.setScrollDensity(gridDimensions.rowCount / gridDimensions.rowHierarchyHeight);

            this.bodyTouchDelegate.resize(gridDimensions.rowHierarchyWidth, gridDimensions.columnHierarchyHeight,
                gridDimensions.columnHierarchyWidth, gridDimensions.rowHierarchyHeight);
            this.bodyTouchDelegate.setScrollDensity(gridDimensions.columnCount / gridDimensions.columnHierarchyWidth,
                gridDimensions.rowCount / gridDimensions.rowHierarchyHeight);

            this.footerTouchDelegate.resize(gridDimensions.rowHierarchyWidth, gridDimensions.columnHierarchyHeight + gridDimensions.rowHierarchyHeight, gridDimensions.columnHierarchyWidth, gridDimensions.footerHeight);
            this.footerTouchDelegate.setScrollDensity(gridDimensions.columnCount / gridDimensions.columnHierarchyWidth);
        }

        private onMouseWheel(e: MouseWheelEvent): void {
            this.determineDimensionToScroll(e,
                (dimension, delta) => { dimension.scrollbar.onMouseWheel(delta); });

            if (this.options.layoutKind === TablixLayoutKind.Canvas)
                e.preventDefault();
        }

        private onFireFoxMouseWheel(e: MouseWheelEvent): void {
            this.determineDimensionToScrollFirefox(e,
                (dimension, delta) => { dimension.scrollbar.onMouseWheel(delta); });

            if (this.options.layoutKind === TablixLayoutKind.Canvas)
                e.preventDefault();
        }

        private determineDimensionToScroll(e: MouseWheelEvent, scrollCallback: (dimension: TablixDimension, delta: number) => void): void {
            // If vertical scrollbar is shown, apply normal scrolling in X, Y
            if (this.rowDim.scrollbar.visible) {
                if (e.wheelDeltaY)
                    scrollCallback(this.rowDim, e.wheelDeltaY);

                if (e.wheelDeltaX && this.columnDim.scrollbar.visible)
                    scrollCallback(this.columnDim, e.wheelDeltaX);
            }

            // If vertical scrollbar is hidden, and horizontal scrollbar is shown
            // Apply whatever X or Y to it
            else if (this.columnDim.scrollbar.visible) {
                if (e.wheelDeltaX)
                    scrollCallback(this.columnDim, e.wheelDeltaX);
                else if (e.wheelDeltaY)
                    scrollCallback(this.columnDim, e.wheelDeltaY);
            }
        }

        private determineDimensionToScrollFirefox(e: MouseWheelEvent, scrollCallback: (dimension: TablixDimension, delta: number) => void): void {
            // Firefox
            if (e.detail) {
                if (this.rowDim.scrollbar.visible) {
                    scrollCallback(this.rowDim, -e.detail);
                    return;
                }

                // In the absence of the vertical scrollbar, we scroll the
                // horizontal scrollbar.
                if (this.columnDim.scrollbar.visible) {
                    scrollCallback(this.columnDim, -e.detail);
                    return;
                }
            }
        }

        public get layoutManager(): internal.TablixLayoutManager {
            return this.controlLayoutManager;
        }

        public get columnDimension(): TablixColumnDimension {
            return this.columnDim;
        }

        public get rowDimension(): TablixRowDimension {
            return this.rowDim;
        }

        public refresh(clear: boolean): void {
            this.render(clear, null);
        }

        public _onScrollAsync(dimension: TablixDimension): void { // The intent is to be internal
            requestAnimationFrame(() => { this.performPendingScroll(dimension); });
        }

        private performPendingScroll(dimension: TablixDimension): void {
            this.render(false, dimension);
        }

        private updateHorizontalPosition(): void {
            if (this.rowDim.scrollbar.visible) {
                this.columnDim.scrollbar.element.style.right = this.scrollBarElementWidth + TablixControl.UnitOfMeasurement;
                this.footerDiv.style.right = this.scrollBarElementWidth + TablixControl.UnitOfMeasurement;
                this.mainDiv.style.right = this.scrollBarElementWidth + TablixControl.UnitOfMeasurement;
            } else {
                this.columnDim.scrollbar.element.style.right = "0" + TablixControl.UnitOfMeasurement;
                this.mainDiv.style.right = "0" + TablixControl.UnitOfMeasurement;
                this.footerDiv.style.right = "0" + TablixControl.UnitOfMeasurement;
            }
        }

        public updateFooterVisibility() {
            if (this.rowDim.hasFooter() ? (this.footerDiv.style.display !== "block") : (this.footerDiv.style.display !== "none")) {
                if (this.rowDim.hasFooter()) {
                    this.footerDiv.style.display = "block";
                } else {
                    this.footerDiv.style.display = "none";
                }
            }
        }

        private updateVerticalPosition(): void {

            let hasVerticalScrollbar = this.rowDim.scrollbar.visible;
            // TODO: ideally the tablix control would not know about where it is rendered but the layout manager
            //       would provider that information; we should refactor the layout manager so that getLayoutKind is not needed anymore.
            let isDashboardTile = this.controlLayoutManager.getLayoutKind() === TablixLayoutKind.DashboardTile;
            let showFooter = hasVerticalScrollbar || isDashboardTile;
            if (showFooter) {
                let mainBottom = this.footerDiv.offsetHeight;
                let footerBottom = 0;
                let verticalScrollbarBottom = 0;

                // If we have a horizontal scrollbar, we need to adjust the bottom
                // value by the scrollbar width
                let hasHorizontalScrollbar = this.columnDim.scrollbar.visible;
                if (hasHorizontalScrollbar) {
                    mainBottom += this.scrollBarElementWidth;
                    footerBottom += this.scrollBarElementWidth;
                    verticalScrollbarBottom = this.scrollBarElementWidth;
                }

                this.mainDiv.style.bottom = mainBottom + TablixControl.UnitOfMeasurement;
                this.rowDim.scrollbar.element.style.bottom = verticalScrollbarBottom + TablixControl.UnitOfMeasurement;
                this.footerDiv.style.bottom = footerBottom + TablixControl.UnitOfMeasurement;

                // With a vertical scrollbar, the footer is always rendered at the bottom
                this.footerDiv.style.removeProperty("top");
            }
            else {
                // Without a vertical scrollbar, the footer is rendered below the last row;
                // this is controlled by the top value only
                this.footerDiv.style.top = this.gridDimensions.rowHierarchyContentHeight + TablixControl.UnitOfMeasurement;
                this.footerDiv.style.removeProperty("bottom");
                this.mainDiv.style.removeProperty("bottom");
            }
        }

        private alreadyRendered(scrollingDimension: TablixDimension): boolean {
            if (scrollingDimension !== this.lastRenderingArgs.scrollingDimension ||
                this.rowDimension.scrollOffset !== this.lastRenderingArgs.rowScrollOffset ||
                this.columnDimension.scrollOffset !== this.lastRenderingArgs.columnScrollOffset) {
                return false;
            }

            return true;
        }

        private render(clear: boolean, scrollingDimension: TablixDimension): void {
            // at time of rendering always ensure the scroll offset is valid
            this.columnDim.makeScrollOffsetValid();
            this.rowDim.makeScrollOffsetValid();

            if (clear || scrollingDimension === null) {
                this.lastRenderingArgs = {};
            } else if (this.alreadyRendered(scrollingDimension)) {
                return;
            }

            let done = false;
            this.renderIterationCount = 0;

            this.controlLayoutManager.onStartRenderingSession(scrollingDimension, this.mainDiv, clear);
            let binder: ITablixBinder = this.binder;
            binder.onStartRenderingSession();

            let priorFooterHeight: number = this.gridDimensions.footerHeight;
            let priorRowHierarchyHeight: number = this.gridDimensions.rowHierarchyHeight;
            let priorRowHierarchyContentHeight: number = this.gridDimensions.rowHierarchyContentHeight;

            while (!done && this.renderIterationCount < TablixControl.MaxRenderIterationCount) {
                let hScrollbarVisibility = this.columnDim.scrollbar.visible;
                let vScrollbarVisibility = this.rowDim.scrollbar.visible;

                this.columnDim._onStartRenderingIteration();
                this.rowDim._onStartRenderingIteration();
                this.controlLayoutManager.onStartRenderingIteration(clear);

                // These calls add cells to the table.
                // Column needs to be rendered before rows as the row call will pair up with columns to produce the body cells.
                this.renderCorner();
                this.columnDim._render();
                this.rowDim._render();

                done = this.controlLayoutManager.onEndRenderingIteration();
                this.columnDim._onEndRenderingIteration();
                this.rowDim._onEndRenderingIteration();

                if ((hScrollbarVisibility !== this.columnDim.scrollbar.visible)) {
                    this.updateVerticalPosition();
                }
                if (vScrollbarVisibility !== this.rowDim.scrollbar.visible) {
                    this.updateHorizontalPosition();
                }

                this.renderIterationCount++;
            }

            this.controlLayoutManager.onEndRenderingSession();
            binder.onEndRenderingSession();

            if (this.isTouchEnabled)
                this.updateTouchDimensions();

            this.lastRenderingArgs.rowScrollOffset = this.rowDimension.scrollOffset;
            this.lastRenderingArgs.columnScrollOffset = this.columnDimension.scrollOffset;

            this.updateContainerDimensions();

            let lastRenderingArgs = this.lastRenderingArgs;
            lastRenderingArgs.rowScrollOffset = this.rowDimension.scrollOffset;
            lastRenderingArgs.columnScrollOffset = this.columnDimension.scrollOffset;
            lastRenderingArgs.scrollingDimension = scrollingDimension;

            if (priorFooterHeight !== this.gridDimensions.footerHeight ||
                priorRowHierarchyHeight !== this.gridDimensions.rowHierarchyHeight ||
                priorRowHierarchyContentHeight !== this.gridDimensions.rowHierarchyContentHeight) {
                this.updateVerticalPosition();
            }

            // NOTE: it is critical that we refresh the scrollbars only after the vertical
            //       position was updated above; otherwise the measurements can be incorrect.
            if (this.options.interactive) {
                this.columnDim.scrollbar.refresh();
                this.rowDim.scrollbar.refresh();
            }
        }

        private updateContainerDimensions(): void {
            let gridDimensions = this.gridDimensions;

            if (this._autoSizeWidth) {
                let vScrollBarWidth: number = this.rowDim.scrollbar.visible ? this.scrollBarElementWidth : 0;
                this.containerElement.style.width =
                    gridDimensions.rowHierarchyWidth +
                    gridDimensions.columnHierarchyWidth +
                    vScrollBarWidth +
                    TablixControl.UnitOfMeasurement;
            }

            if (this._autoSizeHeight) {
                let hScrollBarHeight: number = this.columnDim.scrollbar.visible ? this.scrollBarElementWidth : 0;
                this.containerElement.style.height =
                    gridDimensions.columnHierarchyHeight +
                    gridDimensions.rowHierarchyHeight +
                    gridDimensions.footerHeight +
                    hScrollBarHeight +
                    TablixControl.UnitOfMeasurement;
            }
        }

        private cornerCellMatch(item: any, cell: ITablixCell): boolean {
            let previousItem: any = cell.item;
            return cell.type === TablixCellType.CornerCell && previousItem && this.hierarchyTablixNavigator.cornerCellItemEquals(item, previousItem);
        }

        private renderCorner(): void {
            let columnDepth: number = this.columnDim.getDepth();
            let rowDepth: number = this.rowDim.getDepth();

            for (let i = 0; i < columnDepth; i++) {
                for (let j = 0; j < rowDepth; j++) {
                    let item = this.hierarchyTablixNavigator.getCorner(j, i);
                    let cell: ITablixCell = this.controlLayoutManager.getOrCreateCornerCell(item, j, i);
                    let match = this.cornerCellMatch(item, cell);
                    if (!match) {
                        this._unbindCell(cell);
                        cell.type = TablixCellType.CornerCell;
                        cell.item = item;

                        this.binder.bindCornerCell(item, cell);
                    }
                    this.controlLayoutManager.onCornerCellRealized(item, cell);
                }
            }
        }

        public _unbindCell(cell: ITablixCell): void { // The intent is to be internal
            switch (cell.type) {
                case TablixCellType.BodyCell:
                    this.binder.unbindBodyCell(cell.item, cell);
                    break;
                case TablixCellType.ColumnHeader:
                    this.binder.unbindColumnHeader(cell.item, cell);
                    break;
                case TablixCellType.RowHeader:
                    this.binder.unbindRowHeader(cell.item, cell);
                    break;
                case TablixCellType.CornerCell:
                    this.binder.unbindCornerCell(cell.item, cell);
            }

            cell.item = null;
            cell.type = null;
        }

        private onTouchEvent(args: any[]): void {
            let colShift: number;
            let rowShift: number;
            let that: TablixControl;

            if ((args) && (args.length > 0)) {
                if (("columnDim" in args[0]) && ("rowDim" in args[0])) {
                    that = <TablixControl>args[0];
                    colShift = that.columnDim.scrollbar.visible ? <number>args[1] : 0;
                    rowShift = that.rowDim.scrollbar.visible ? <number>args[2] : 0;

                    that.columnDim.scrollbar.viewMin = Math.max(0, that.columnDim.scrollbar.viewMin + colShift);
                    that.columnDim.scrollOffset = Math.max(0, that.columnDim.scrollOffset + colShift);
                    that.rowDim.scrollbar.viewMin = Math.max(0, that.rowDim.scrollbar.viewMin + rowShift);
                    that.rowDim.scrollOffset = Math.max(0, that.rowDim.scrollOffset + rowShift);

                    if (colShift === 0) {
                        that._onScrollAsync(that.rowDim);
                    } else if (rowShift === 0) {
                        that._onScrollAsync(that.columnDim);
                    } else {
                        that._onScrollAsync(null);
                    }
                }
            }
        }
    }
}