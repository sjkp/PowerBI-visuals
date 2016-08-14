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

    export interface IListView {
        data(data: any[], dataIdFunction: (d) => {}, dataAppended: boolean): IListView;
        rowHeight(rowHeight: number): IListView;
        viewport(viewport: IViewport): IListView;
        render(): void;
        empty(): void;
    }

    export module ListViewFactory {
        export function createListView(options): IListView {
            return new ListView(options);
        }
    }

    export interface ListViewOptions {
        enter: (selection: D3.Selection) => void;
        exit: (selection: D3.Selection) => void;
        update: (selection: D3.Selection) => void;
        loadMoreData: () => void;
        baseContainer: D3.Selection;
        rowHeight: number;
        viewport: IViewport;
        scrollEnabled: boolean;
        isReadMode: () => boolean;
    }

    /**
     * A UI Virtualized List, that uses the D3 Enter, Update & Exit pattern to update rows.
     * It can create lists containing either HTML or SVG elements.
     */
    class ListView implements IListView {
        private getDatumIndex: (d: any) => {};
        private _data: any[];
        private _totalRows: number;

        private options: ListViewOptions;
        private visibleGroupContainer: D3.Selection;
        private scrollContainer: D3.Selection;
        private scrollbarInner: D3.Selection;
        private cancelMeasurePass: () => void;
        private renderTimeoutId: number;
        
        /**
         * The value indicates the percentage of data already shown
         * in the list view that triggers a loadMoreData call.
         */
        private static loadMoreDataThreshold = 0.8;
        private static defaultRowHeight = 1;

        public constructor(options: ListViewOptions) {
            // make a copy of options so that it is not modified later by caller
            this.options = $.extend(true, {}, options);

            this.scrollbarInner = options.baseContainer
                .append('div')
                .classed('scrollbar-inner', true)
                .on('scroll', () => this.renderImpl(this.options.rowHeight));

            this.scrollContainer = this.scrollbarInner
                .append('div')
                .classed('scrollRegion', true)
                .on('touchstart', () => this.stopTouchPropagation())
                .on('touchmove', () => this.stopTouchPropagation());

            this.visibleGroupContainer = this.scrollContainer
                .append('div')
                .classed('visibleGroup', true);

            $(options.baseContainer.node()).find('.scroll-element').attr('drag-resize-disabled', 'true');

            ListView.SetDefaultOptions(options);
        }

        private static SetDefaultOptions(options: ListViewOptions) {
            options.rowHeight = options.rowHeight || ListView.defaultRowHeight;
        }

        public rowHeight(rowHeight: number): ListView {
            this.options.rowHeight = Math.ceil(rowHeight);
            return this;
        }

        public data(data: any[], getDatumIndex: (d) => {}, dataReset: boolean = false): IListView {
            this._data = data;
            this.getDatumIndex = getDatumIndex;
            this.setTotalRows();
            if (dataReset)
                $(this.scrollbarInner.node()).scrollTop(0);

            this.render();
            return this;
        }

        public viewport(viewport: IViewport): IListView {
            this.options.viewport = viewport;
            this.render();
            return this;
        }

        public empty(): void {
            this._data = [];
            this.render();
        }

        public render(): void {
            if (this.renderTimeoutId)
                window.clearTimeout(this.renderTimeoutId);

            this.renderTimeoutId = window.setTimeout(() => {
                this.getRowHeight().then((rowHeight: number) => {
                    this.renderImpl(rowHeight);
                });
                this.renderTimeoutId = undefined;
            },0);
        }

        private renderImpl(rowHeight: number): void {
            let totalHeight = this.options.scrollEnabled ? Math.max(0, (this._totalRows * rowHeight)) : this.options.viewport.height;
            this.scrollContainer
                .style('height', totalHeight + "px")
                .attr('height', totalHeight);

            this.scrollToFrame(true /*loadMoreData*/);
        }

        /*
         *  This method is called in order to prevent a bug found in the Interact.js.
         *  The bug is caused when finishing a scroll outside the scroll area.
         *  In that case the Interact doesn't process a touchcancel event and thinks a touch point still exists.
         *  since the Interact listens on the visualContainer, by stoping the propagation we prevent the bug from taking place.
         */
        private stopTouchPropagation(): void {
            //Stop the propagation only in read mode so the drag won't be affected.
            if (this.options.isReadMode()) {
                if (d3.event.type === "touchstart") {
                    let event: TouchEvent = <any>d3.event;
                    //If there is another touch point outside this visual than the event should be propagated.
                    //This way the pinch to zoom will not be affected.
                    if (event.touches && event.touches.length === 1) {
                        d3.event.stopPropagation();
                    }
                }
                if (d3.event.type === "touchmove") {
                    d3.event.stopPropagation();
                }
            }
        }

        private scrollToFrame(loadMoreData: boolean): void {
            let options = this.options;
            let visibleGroupContainer = this.visibleGroupContainer;
            let totalRows = this._totalRows;
            let rowHeight = options.rowHeight || ListView.defaultRowHeight;
            let visibleRows = this.getVisibleRows();
            let scrollTop: number = this.scrollbarInner.node().scrollTop;
            let scrollPosition = (scrollTop === 0) ? 0 : Math.floor(scrollTop / rowHeight);
            let transformAttr = SVGUtil.translateWithPixels(0, scrollPosition * rowHeight);

            visibleGroupContainer.style({
                //order matters for proper overriding
                'transform': d => transformAttr,
                '-webkit-transform': transformAttr
            });

            let position0 = Math.max(0, Math.min(scrollPosition, totalRows - visibleRows + 1)),
                position1 = position0 + visibleRows;
            
            let rowSelection = visibleGroupContainer.selectAll(".row")
                .data(this._data.slice(position0, Math.min(position1, totalRows)), this.getDatumIndex);

            rowSelection
                .enter()
                .append('div')
                .classed('row', true)
                .call(d => options.enter(d));
            rowSelection.order();

            let rowUpdateSelection = visibleGroupContainer.selectAll('.row:not(.transitioning)');

            rowUpdateSelection.call(d => options.update(d));

            rowSelection
                .exit()
                .call(d => options.exit(d))
                .remove();

            if (loadMoreData && visibleRows !== totalRows && position1 >= totalRows * ListView.loadMoreDataThreshold)
                options.loadMoreData();
        }

        private setTotalRows(): void {
            let data = this._data;
            this._totalRows = data ? data.length : 0;
        }

        private getVisibleRows(): number {
            const minimumVisibleRows = 1;
            let options = this.options;
            let rowHeight = options.rowHeight;
            let viewportHeight = options.viewport.height;

            if (!rowHeight || rowHeight < 1)
                return minimumVisibleRows;

            // How many rows of space the viewport can hold (not the number of rows it can display).
            let viewportRowCount = viewportHeight / rowHeight;
            
            if (this.options.scrollEnabled) {
                // Ceiling the count since we can have items be partially displayed when scrolling.
                // Add 1 to make sure we always render enough rows to cover the entire viewport (handles when rows are partially visible when scrolling).
                // Ex. If you have a viewport that can show 280 (viewport height) / 100 (row height) = 2.8 rows, you need to have up to Math.ceil(2.8) + 1 = 4 rows of data to cover the viewport.
                // If you only had Math.ceil(2.8) = 3 rows of data, and the top rows was 50% visible (scrolled up), you'd only be able to cover .5 + 1 + 1 = 2.5 rows of the viewport.
                // This makes a gap at the bottom of the listview.
                // Add an extra row of data and we can cover .5 + 1 + 1 + 1 = 3.5 rows of the viewport. 3.5 is enough to cover the entire viewport as only 2.8 is needed.
                // 1 is always added, even if not needed, to keep logic simple. Advanced logic would figure out what % of the top row is visible and use that to add 1 if needed.
                return Math.min(Math.ceil(viewportRowCount) + 1, this._totalRows) || minimumVisibleRows;
            }

            // Floor the count since that's the maximum number of entire rows we can display without scrolling.
            return Math.min(Math.floor(viewportRowCount), this._totalRows) || minimumVisibleRows;
        }

        private getRowHeight(): JQueryPromise<number> {
            let deferred = $.Deferred<number>();
            let listView = this;
            let options = listView.options;
            if (this.cancelMeasurePass)
                this.cancelMeasurePass();

            // if there is no data, resolve and return
            if (!(this._data && this._data.length && options)) {
                listView.rowHeight(ListView.defaultRowHeight);
                return deferred.resolve(options.rowHeight).promise();
            }

            //render the first item to calculate the row height
            this.scrollToFrame(false /*loadMoreData*/);
            let requestAnimationFrameId = window.requestAnimationFrame(() => {
                //measure row height
                let rows = listView.visibleGroupContainer.select(".row");
                if (!rows.empty()) {
                    let firstRow = rows.node();
                    // If the container (child) has margins amd the row (parent) doesn't, the child's margins will collapse into the parent.
                    // outerHeight doesn't report the correct height for the parent in this case, but it does measure the child properly.
                    // Fix for #7497261 Measures both and take the max to work around this issue.
                    let rowHeight: number = Math.max($(firstRow).outerHeight(true), $(firstRow).children().first().outerHeight(true));
                    listView.rowHeight(rowHeight);
                    deferred.resolve(rowHeight);
                }

                listView.cancelMeasurePass = undefined;
                window.cancelAnimationFrame(requestAnimationFrameId);
            });

            this.cancelMeasurePass = () => {
                window.cancelAnimationFrame(requestAnimationFrameId);
                deferred.reject();
            };

            return deferred.promise();
        }
    }
}