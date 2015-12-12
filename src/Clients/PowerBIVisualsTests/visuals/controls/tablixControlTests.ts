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

module powerbitests {
    import Controls = powerbi.visuals.controls;
    import InternalControls = powerbi.visuals.controls.internal;
    import TablixLayoutManager = powerbi.visuals.controls.internal.TablixLayoutManager;

    let colWidthChangedCallback = false;
    let colWidthCallback = [50];
    let parentElement;

    describe("TablixGrid", () => {
        it("onStartRenderingSession clear", () => {
            let control = createTablixControl();
            let grid = control.layoutManager.grid;
            let gridPresenter = grid._presenter;
            gridPresenter["_owner"] = grid;
            grid["_owner"] = control;

            grid.onStartRenderingIteration();

            grid.getOrCreateColumn(0);
            grid.getOrCreateColumn(1);
            grid.getOrCreateRow(0);
            grid.getOrCreateRow(1);
            grid.getOrCreateFootersRow();

            grid.onStartRenderingSession(true);

            expect(grid["_rows"]).toBe(null);
            expect(grid["_columns"]).toBe(null);
            expect(grid["_footerRow"]).toBe(null);
        });

        it("tablixGrid column resize", function () {
            let control = createTablixControl();
            let grid = control.layoutManager.grid;
            grid.onStartRenderingIteration();
            let col0 = grid.getOrCreateColumn(0);
            expect(col0.getContextualWidth()).toBe(50);
            col0.resize(35);
            expect(colWidthCallback[0]).toBe(35);
        });

        it("CalculateWidth AutoSize property off ", function () {
            let control = createTablixControl();
            let grid = control.layoutManager.grid;
            let gridPresenter = grid._presenter;
            gridPresenter["_owner"] = grid;
            grid["_owner"] = control;
            let layoutManager = control.layoutManager;
            // Mock setting of property to false
            let columnLayoutManager = layoutManager.columnLayoutManager;
            layoutManager.onStartRenderingIteration(false);
            let col0 = grid.getOrCreateColumn(0);
            spyOn(col0, "calculateSize").and.returnValue(35);
            let col1 = grid.getOrCreateColumn(1);
            spyOn(col1, "calculateSize").and.returnValue(50);
            columnLayoutManager.calculateContextualWidths();
            expect(layoutManager.columnWidthsToPersist.length).toBe(2);
            expect(layoutManager.columnWidthsToPersist[0]).toBe(35);
            expect(layoutManager.columnWidthsToPersist[1]).toBe(50);
        });
    });

    describe("TablixLayoutManager", () => {

        it("onStartRenderingSession clear", () => {
            let layoutManager = InternalControls.CanvasTablixLayoutManager.createLayoutManager(createMockBinder(), createMockColumnWidthManager());

            let grid = layoutManager.grid;
            let gridSpy = spyOn(grid, "onStartRenderingSession");
            layoutManager.rowLayoutManager["onStartRenderingSession"] = () => { };
            layoutManager.columnLayoutManager["onStartRenderingSession"] = () => { };
            layoutManager.onStartRenderingSession(null, null, true);
            expect(gridSpy).toHaveBeenCalledWith(true);
        });

        it('RowLayoutManager getRealizedItemsCount noItems',() => {
            let tableBinder = createMockBinder();
            let layoutManager = InternalControls.CanvasTablixLayoutManager.createLayoutManager(tableBinder, createMockColumnWidthManager());
            let rowLayoutManager = layoutManager.rowLayoutManager;
            rowLayoutManager["_realizedRows"] = null;
            let count = rowLayoutManager.getRealizedItemsCount();
            expect(count).toBe(0);
        });

        it('ColumnLayoutManager getRealizedItemsCount noItems',() => {
            let tableBinder = createMockBinder();
            let layoutManager = InternalControls.CanvasTablixLayoutManager.createLayoutManager(tableBinder, createMockColumnWidthManager());
            let columnLayoutManager = layoutManager.columnLayoutManager;
            columnLayoutManager["_realizedColumns"] = null;
            let count = columnLayoutManager.getRealizedItemsCount();
            expect(count).toBe(0);
        });

        it('DimensionLayoutManager getRealizedItemsCount',() => {
            let tableBinder = createMockBinder();
            let layoutManager = InternalControls.CanvasTablixLayoutManager.createLayoutManager(tableBinder, createMockColumnWidthManager());
            let rowLayoutManager = layoutManager.rowLayoutManager;
            spyOn(rowLayoutManager, "_getRealizedItems").and.returnValue([1, 2, 3]);
            let count = rowLayoutManager.getRealizedItemsCount();
            expect(count).toBe(3);
        });
    });

    describe("TablixControl", () => {

        let tablixControl: Controls.TablixControl;
        let layoutManager: TablixLayoutManager;

        beforeEach(() => {
            tablixControl = createTablixControl();
            layoutManager = tablixControl.layoutManager;
        });

        it("parentElement class name set to tablixContainer", () => {
            expect(parentElement.className).toBe('tablixContainer');
        });

        describe('with options', () => {
            it("fontSize option sets font-size property on container", () => {
                tablixControl = createTablixControlWithOptions({
                    interactive: true,
                    enableTouchSupport: false,
                    layoutKind: Controls.TablixLayoutKind.Canvas,
                    fontSize: '24px',
                });
                layoutManager = tablixControl.layoutManager;

                let actualFontSize = $(parentElement).find('.bi-tablix').css('font-size');
                expect(actualFontSize).toBe('24px');
            });
        });

        it("Render clear calls clearRows once", () => {

            // Force a few rendering iterations.
            let counter: number = 3;
            layoutManager["onEndRenderingIteration"] = () => { return 0 === counter--; };

            let spy = spyOn(layoutManager.grid, "clearRows");
            tablixControl.refresh(true);

            expect(spy.calls.all().length).toBe(1);
        });

        it("Render clear false no clearRows call", () => {
            let counter: number = 1;
            layoutManager["onEndRenderingIteration"] = () => { return 0 === counter--; };

            let spy = spyOn(layoutManager.grid, "clearRows");
            tablixControl.refresh(false);
            expect(spy).not.toHaveBeenCalled();
        });

        it("DOMMouseScroll dispatches to row scrollbar", () => {
            let spy = spyOn(tablixControl.rowDimension.scrollbar, "onFireFoxMouseWheel");
            spy.and.stub();
            tablixControl.rowDimension.scrollbar["_visible"] = true;
            tablixControl.container.dispatchEvent(helpers.createMouseWheelEvent("DOMMouseScroll", -100));

            expect(spy).toHaveBeenCalled();
        });

        it("mousewheel dispatches to row scrollbar", () => {
            let spy = spyOn(tablixControl.rowDimension.scrollbar, "onMouseWheel");
            spy.and.stub();
            tablixControl.rowDimension.scrollbar["_visible"] = true;
            tablixControl.container.dispatchEvent(helpers.createMouseWheelEvent("mousewheel", -100));

            expect(spy).toHaveBeenCalled();
        });

        it("mousewheel dispatches to dimension scrollbar", () => {
            let spy = spyOn(tablixControl.columnDimension.scrollbar, "onMouseWheel");
            spy.and.stub();
            tablixControl.rowDimension.scrollbar["_visible"] = false;
            tablixControl.columnDimension.scrollbar["_visible"] = true;
            tablixControl.container.dispatchEvent(helpers.createMouseWheelEvent("mousewheel", -100));

            expect(spy).toHaveBeenCalled();
        });
    });

    describe("Scrollbar", () => {

        let scrollbar;

        beforeEach(() => {
            scrollbar = new Controls.Scrollbar(document.createElement("div"));
        });

        it("Uses mouse wheel range", () => {
            let scrollSpy = spyOn(scrollbar, "scrollBy");
            scrollSpy.and.stub();
            scrollbar.onMouseWheel(helpers.createMouseWheelEvent("mousewheel", -10));

            expect(scrollSpy).toHaveBeenCalledWith(1);
        });

        it("Detects end of scroll", () => {
            let callbackCalled = false;
            let callback = () => { callbackCalled = true; };
            scrollbar._onscroll.push(() => callback());
            scrollbar.viewMin = 2;
            scrollbar.viewSize = 8;
            scrollbar.onMouseWheel(helpers.createMouseWheelEvent("mousewheel", -240));

            expect(callbackCalled).toBeFalsy();
        });
    });

    function createTablixControl(): Controls.TablixControl {
        let tableBinder = createMockBinder();
        let layoutManager = InternalControls.CanvasTablixLayoutManager.createLayoutManager(tableBinder, createMockColumnWidthManager());

        parentElement = document.createElement("div");

        let tablixOptions: Controls.TablixOptions = {
            interactive: true,
            enableTouchSupport: false,
            layoutKind: Controls.TablixLayoutKind.Canvas
        };
        return new Controls.TablixControl(createMockNavigator(), layoutManager, tableBinder, parentElement, tablixOptions);
    }

    function createTablixControlWithOptions(options: Controls.TablixOptions): Controls.TablixControl {
        let tableBinder = createMockBinder();
        let layoutManager = InternalControls.CanvasTablixLayoutManager.createLayoutManager(tableBinder, createMockColumnWidthManager());

        parentElement = document.createElement("div");

        let tablixOptions: Controls.TablixOptions = options;
        return new Controls.TablixControl(createMockNavigator(), layoutManager, tableBinder, parentElement, tablixOptions);
    }

    function createMockBinder(): Controls.ITablixBinder {
        return {
            onStartRenderingSession: () => { },
            onEndRenderingSession: () => { },
            bindRowHeader: (item: any, cell: Controls.ITablixCell) => { },
            unbindRowHeader: (item: any, cell: Controls.ITablixCell) => { },
            bindColumnHeader: (item: any, cell: Controls.ITablixCell) => { },
            unbindColumnHeader: (item: any, cell: Controls.ITablixCell) => { },
            bindBodyCell: (item: any, cell: Controls.ITablixCell) => { },
            unbindBodyCell: (item: any, cell: Controls.ITablixCell) => { },
            bindCornerCell: (item: any, cell: Controls.ITablixCell) => { },
            unbindCornerCell: (item: any, cell: Controls.ITablixCell) => { },
            bindEmptySpaceHeaderCell: (cell: Controls.ITablixCell) => { },
            unbindEmptySpaceHeaderCell: (cell: Controls.ITablixCell) => { },
            bindEmptySpaceFooterCell: (cell: Controls.ITablixCell) => { },
            unbindEmptySpaceFooterCell: (cell: Controls.ITablixCell) => { },
            getHeaderLabel: (item: any): string => { return "label"; },
            getCellContent: (item: any): string => { return "label"; },
            hasRowGroups: () => true
        };
    }

    function createMockNavigator(): Controls.ITablixHierarchyNavigator {
        return {
            getDepth: (hierarchy: any): number=> 1,
            getLeafCount: (hierarchy: any): number=> 1,
            getLeafAt: (hierarchy: any, index: number): any=> 1,
            getParent: (item: any): any=> { },
            getIndex: (item: any): number=> 1,
            isLeaf: (item: any): boolean=> true,
            isRowHierarchyLeaf: (cornerItem: any): boolean=> true,
            isColumnHierarchyLeaf: (cornerItem: any): boolean=> true,
            isLastItem: (item: any, items: any): boolean=> true,
            getChildren: (item: any): any=> { },
            getCount: (items: any): number=> 1,
            getAt: (items: any, index: number): any=> 1,
            getLevel: (item: any): number=> 1,
            getIntersection: (rowItem: any, columnItem: any): any=> { },
            getCorner: (rowLevel: number, columnLevel: number): any=> { },
            headerItemEquals: (item1: any, item2: any): boolean=> true,
            bodyCellItemEquals: (item1: any, item2: any): boolean=> true,
            cornerCellItemEquals: (item1: any, item2: any): boolean=> true
        };
    }

    function createMockColumnWidthManager(): Controls.TablixColumnWidthManager {
        let columnWidthManager = new Controls.TablixColumnWidthManager(null /* dataView*/, false);
        columnWidthManager.columnWidthResizeCallback = () => {
            colWidthChangedCallback = true;
            colWidthCallback[0] = 35;
        };

        columnWidthManager.getColumnWidths = () => colWidthCallback;
        return columnWidthManager;
    }
} 