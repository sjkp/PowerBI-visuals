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

module powerbitests.tablixHelper {
    import CssConstants = jsCommon.CssConstants;
    import DataView = powerbi.DataView;
    import ValueFormatter = powerbi.visuals.valueFormatter;
    //import TablixUtils = powerbi.visuals.controls.internal.TablixUtils;
    import TablixObjects = powerbi.visuals.controls.internal.TablixObjects;
    import TextUtil = powerbi.visuals.TextUtil;

    export interface TableCellCoordinate {
        row: number;
        col: number;
        expectedText?: string;
    }

    export interface TableCellInfo {
        cellCoordinate: TableCellCoordinate;
        clickTarget: HTMLElement;
        text: string;
    };

    export interface RenderTableOptions {
        visualType: string;
        data: powerbi.DataView;
        formatCallback?: (...args) => void;
        viewport?: powerbi.IViewport;
        redraw?: boolean;
        isFixedSize?: boolean;
        onCustomSortCallback?: (args: powerbi.CustomSortEventArgs) => void;
    };

    /** Gets the specified cell of a 'new table' visual using 0-based indices. */
    export function getTableCell(tableBody: JQuery, coordinate: TableCellCoordinate): TableCellInfo {
        var clickTargetSelector: string = '> tr:nth-child(' + (coordinate.row + 1) + ') > td:nth-child(' + (coordinate.col + 1) + ') > div';
        var textDivSelector: string = '> div';
        var clickTarget = $(clickTargetSelector, tableBody).get(0);
        expect(clickTarget).toBeInDOM();
        var textDiv = $(textDivSelector, clickTarget);
        expect(textDiv).toBeInDOM();

        return { cellCoordinate: coordinate, clickTarget: clickTarget, text: textDiv.text() };
    }

    /** Renders the table based on the options passed in. */
    export function renderNewTablix(element: JQuery, options: RenderTableOptions): JQueryPromise<powerbi.IVisual> {
        var viewport = options.viewport ? options.viewport : { height: element.height() + 200, width: element.width() + 200 };
        var data = options.data;
        var redraw = options.redraw ? options.redraw : false;
        var style = powerbi.visuals.visualStyles.create();

        element.width(viewport.width);
        element.css(CssConstants.minWidthProperty, viewport.width);
        element.css(CssConstants.maxWidthProperty, viewport.width);
        element.css(CssConstants.positionProperty, CssConstants.absoluteValue);

        var sortCallback = options.onCustomSortCallback ? options.onCustomSortCallback : (args: powerbi.CustomSortEventArgs) => { };
        var hostService: powerbi.IVisualHostServices = <any>{
            getLocalizedString: (stringId: string) => stringId,
            onCustomSort: sortCallback,
            loadMoreData: () => { },
            getViewMode: () => powerbi.ViewMode.View
        };

        if (options.formatCallback)
            spyOn(powerbi.visuals.valueFormatter, 'formatVariantMeasureValue').and.callFake(options.formatCallback);

        var v: powerbi.IVisual;
        switch (options.visualType) {
            case powerbi.visuals.plugins.matrix.name: v = new powerbi.visuals.Matrix(); break;
            case powerbi.visuals.plugins.table.name: v = new powerbi.visuals.Table(); break;
        }
        v.init({
            element: element,
            host: hostService,
            style: style,
            viewport: viewport,
            interactivity: {
                selection: true,
                overflow: options.isFixedSize ? 'hidden' : 'visible'
            }
        });

        v.onDataChanged({ dataViews: [data] });

        var promise = jsCommon.TimerPromiseFactory.instance.create(DefaultWaitForRender)
            .then(() => {
                if (redraw)
                    v.onResizing({ height: viewport.height, width: viewport.width });

                return v;
            });

        return promise;
    }

    /** Runs a table sort test by first creating the table based on the specified data, then
        validating the generated headers before executing a set of clicks and validating
        the recorded sort events. */
    export function runTablixSortTest(
        element: JQuery,
        done: any,
        visualType: string,
        data: DataView,
        expectedColumnHeaders?: tablixHelper.TableCellCoordinate[],
        clicks?: tablixHelper.TableCellCoordinate[],
        expectedSorts?: powerbi.SortableFieldDescriptor[][]): void {
        var actualSorts: powerbi.SortableFieldDescriptor[][] = [];
        var sortCallback = (args: powerbi.CustomSortEventArgs) => {
            actualSorts.push(args.sortDescriptors);
        };

        var renderTablixPromise = renderNewTablix(
            element,
            {
                visualType: visualType,
                data: data,
                onCustomSortCallback: sortCallback,
            });

        renderTablixPromise.then(
            () => {
                var tableBody = $('.tablixContainer > div.tablixCanvas > div:nth-child(1) > table.unselectable > tbody');
                expect(tableBody).toBeInDOM();

                // Validate column headers
                if (expectedColumnHeaders) {
                    for (var i = 0, len = expectedColumnHeaders.length; i < len; i++) {
                        var coordinate = expectedColumnHeaders[i];
                        coordinate.expectedText = TextUtil.replaceSpaceWithNBSP(coordinate.expectedText);
                        var headerCell = getTableCell(tableBody, coordinate);
                        if (coordinate.expectedText)
                            expect(headerCell.text).toBe(coordinate.expectedText);
                    }
                }

                // Execute the clicks
                if (clicks) {
                    for (var i = 0, len = clicks.length; i < len; i++) {
                        var clickCoordinate = clicks[i];
                        var clickCell = getTableCell(tableBody, clickCoordinate);
                        if (clickCoordinate.expectedText)
                            expect(clickCell.text).toBe(clickCoordinate.expectedText);

                        // Instead of normal 'click', need to pass coordinates
                        let ev = document.createEvent("MouseEvent");
                        let x = clickCell.clickTarget.getBoundingClientRect().left;

                        ev.initMouseEvent(
                            "click",
                            true /* bubble */, true /* cancelable */,
                            window, null,
                            x, 0, x, 0, /* coordinates */
                            false, false, false, false, /* modifier keys */
                            0 /*left*/, null
                        );
                        clickCell.clickTarget.dispatchEvent(ev);
                    }
                }

                // Validate the expected sorts
                if (expectedSorts) {
                    expect(expectedSorts.length).toBe(actualSorts.length);

                    for (var i = 0, len = expectedSorts.length; i < len; i++) {
                        var expectedSort = expectedSorts[i];
                        var actualSort = actualSorts[i];
                        expect(expectedSort.length).toBe(actualSort.length);

                        for (var j = 0, jlen = expectedSort.length; j < jlen; j++) {
                            var expectedField = expectedSort[j];
                            var actualField = actualSort[j];

                            expect(expectedField.queryName).toBe(actualField.queryName);
                            expect(expectedField.sortDirection).toBe(actualField.sortDirection);
                        }
                    }
                }

                done();
            });
    }

    export function validateMatrix(expectedValues: string[][], selector: string): void {
        var rows = $(selector);

        var result: string[][] = [];
        var errorString: string = null;

        var ilen = rows.length;
        if (ilen !== expectedValues.length)
            addError(errorString, "Actual row count " + ilen + " does not match expected number of rows " + expectedValues.length + ".");

        for (var i = 0; i < ilen; i++) {
            result[i] = [];
            var cells = rows.eq(i).find('td');
            expect(cells.height()).not.toBe(0);

            var jlen = cells.length;
            if (jlen !== expectedValues[i].length)
                addError(errorString, "Actual column count " + jlen + " in row " + i + " does not match expected number of columns " + expectedValues[i].length + ".");

            for (var j = 0; j < jlen; j++) {
                result[i][j] = cells.eq(j).text();
                expectedValues[i][j] = TextUtil.replaceSpaceWithNBSP(expectedValues[i][j]);
                if (result[i][j] !== expectedValues[i][j])
                    addError(errorString, "Actual value " + result[i][j] + " in row " + i + " and column " + j + " does not match expected value " + expectedValues[i][j] + ".");
            }
        }

        expect(errorString).toBeNull();
        expect(result).toEqual(expectedValues);
    }

    export function validateTable(expectedValues: string[][], selector: string): void {
        var rows = $(selector);

        var textResult: string[][] = [];
        var titleResult: string[][] = [];
        var errorString: string = null;

        var ilen = rows.length;
        if (ilen !== expectedValues.length)
            addError(errorString, "Actual row count " + ilen + " does not match expected number of rows " + expectedValues.length + ".");

        for (var i = 0; i < ilen; i++) {
            textResult[i] = [];
            titleResult[i] = [];
            var cells = rows.eq(i).find('.tablixCellContentHost');

            var jlen = cells.length;
            if (jlen !== expectedValues[i].length)
                addError(errorString, "Actual column count " + jlen + " in row " + i + " does not match expected number of columns " + expectedValues[i].length + ".");

            for (var j = 0; j < jlen; j++) {
                textResult[i][j] = cells.eq(j).text();
                titleResult[i][j] = getTitleOfTablixItem(cells.eq(j));

                expectedValues[i][j] = TextUtil.replaceSpaceWithNBSP(expectedValues[i][j]);

                //this check only empty header cells
                if (titleResult[i][j] === '' && expectedValues[i][j] === "\xa0")
                    titleResult[i][j] = expectedValues[i][j];

                if (textResult[i][j] !== expectedValues[i][j])
                    addError(errorString, "Actual value " + textResult[i][j] + " in row " + i + " and column " + j + " does not match expected value " + expectedValues[i][j] + ".");
                if (titleResult[i][j] !== expectedValues[i][j])
                    addError(errorString, "Actual tooltip " + textResult[i][j] + " in row " + i + " and column " + j + " does not match expected value " + expectedValues[i][j] + ".");

                if (cells.eq(j).height() <= 1)
                    addError(errorString, "Actual height " + cells.eq(j).height() + " in row " + i + " and column " + j + " is expected to be > 1.");
            }
        }

        expect(errorString).toBeNull();
        expect(textResult).toEqual(expectedValues);
        expect(titleResult).toEqual(expectedValues);
    }

    function getTitleOfTablixItem(cells: JQuery): string {
        let titleText = cells.attr('title');
        if (titleText) 
            return titleText;
        
        //The item is url type
        titleText = cells.find('a').attr('title');
        if (titleText) 
            return titleText;

        //The item is table header
        titleText = cells.attr('title');
        if (titleText) 
            return titleText;
 
        return "";
    }

    export function validateSortIconClassNames(expectedValues: string[], selector: string): void {
        let rows = $(selector);
        let pictures = rows.eq(0).find('i');

        let result: string[] = [];
        let errorString: string = null;

        let ilen = pictures.length;
        if (ilen !== expectedValues.length)
            addError(errorString, "Actual column count " + ilen + " does not match expected number of columns " + expectedValues.length + ".");

        for (let i = 0; i < ilen; i++) {
            result[i] = pictures.eq(i).attr('class');
            if (result[i] !== expectedValues[i])
                addError(errorString, "Actual class name " + result[i] + " in column does not match expected value " + expectedValues[i] + ".");
        }

        expect(errorString).toBeNull();
        expect(result).toEqual(expectedValues);
    }

    export function validateClassNames(expectedValues: string[][], selector: string): void {
        var rows = $(selector);

        var result: string[][] = [];
        var errorString: string = null;

        var ilen = rows.length;
        if (ilen !== expectedValues.length)
            addError(errorString, "Actual row count " + ilen + " does not match expected number of rows " + expectedValues.length + ".");

        for (var i = 0; i < ilen; i++) {
            result[i] = [];
            var cells = rows.eq(i).find('.tablixCellContentHost');

            var jlen = cells.length;
            if (jlen !== expectedValues[i].length)
                addError(errorString, "Actual column count " + jlen + " in row " + i + " does not match expected number of columns " + expectedValues[i].length + ".");

            for (var j = 0; j < jlen; j++) {
                result[i][j] = cells.eq(j).attr('class');
                if (result[i][j] !== expectedValues[i][j])
                    addError(errorString, "Actual class name " + result[i][j] + " in row " + i + " and column " + j + " does not match expected value " + expectedValues[i][j] + ".");
            }
        }

        expect(errorString).toBeNull();
        expect(result).toEqual(expectedValues);
    }

    /**
     * Verify the font-size style property matches expected value
     * @param actual: string - font-size property value
     * @param expected: number - text size in terms of 'pt'
     */
    export function validateFontSize(actual: string, expected: number) {
        let converter = jsCommon.PixelConverter.fromPoint;
        let actualParsed = Math.round(parseFloat(actual));
        let expectedParsed = Math.round(parseFloat(converter(expected)));

        expect(actualParsed).toBe(expectedParsed);
    }

    /**
     * Verify the heights of cells match expected value
     * @param cells: JQuery - elements corresponding to individual tabel cells
     * @param expected: number - height in terms of 'px'
     */
    export function validateCellHeights(cells: JQuery, expected: number) {
        cells.each((index: number, elem: Element) => {
            let height = parseInt($(elem).css('height').replace('px', ''), 10);

            // To prevent tests from being fragile, compare the height within an acceptable range (+-5px)
            expect(helpers.isCloseTo(height, expected, /*tolerance*/ 5)).toBeTruthy();
        });
    }

    export function validateCellLeftSeparator(cells: JQuery, expectedWidth: number, expectedColor: string) {
        let expectedPx = jsCommon.PixelConverter.toString(expectedWidth);
        cells.each((index: number, elem: Element) => {
            let borderLeftColor = $(elem).css('border-left-color');
            let borderLeftStyle = $(elem).css('border-left-style');
            let borderLeftWidth = $(elem).css('border-left-width');

            //check if only border exists
            if (borderLeftStyle !== "none") {
                helpers.assertColorsMatch(borderLeftColor, expectedColor);
                expect(borderLeftWidth).toBe(expectedPx);
            }
        });
    }

    export function validateCellBottomSeparator(cells: JQuery, expectedWidth: number, expectedColor: string) {
        let expectedPx = jsCommon.PixelConverter.toString(expectedWidth);
        cells.each((index: number, elem: Element) => {
            let borderBottomColor = $(elem).css('border-bottom-color');
            let borderBottomStyle = $(elem).css('border-bottom-style');
            let borderBottomWidth = $(elem).css('border-bottom-width');

            //check if only border exists
            if (borderBottomStyle !== "none") {
                helpers.assertColorsMatch(borderBottomColor, expectedColor);
                expect(borderBottomWidth).toBe(expectedPx);
            }

        });
    }

    function addError(errorString: string, message: string): string {
        if (!errorString)
            return message;

        return errorString + "\r\n" + message;
    }

    export function validateTableColumnHeaderTooltip(selector: string, dataView: powerbi.DataView): void {
        let tableItems = $("tr").eq(0).find(selector);
        let values = dataView.table.columns;

        for (let i = 0; i < values.length; i++) {
            expect(tableItems[i].textContent).toBe(values[i].displayName);
            expect(tableItems[i].title).toBe(values[i].displayName);
        }
    }

    export function validateTableRowFooterTooltip(selector: string, dataView: powerbi.DataView, index: number): void {
        let tableItems = $("tr").eq(index + 1).find(selector);
        let values = dataView.table.totals;
        let numOfValue = values.length - 1;

        for (let i = 1; i < numOfValue; i++) {
            if (values[i]) {
                let columnFormat: powerbi.DataViewMetadataColumn = dataView.table.columns[i - 1];
                let formattedValue: string = values[i] ? values[i].toString() : '';

                if (columnFormat) {
                    formattedValue = ValueFormatter.formatVariantMeasureValue(values[i], columnFormat, TablixObjects.PropColumnFormatString, false);
                }

                expect(tableItems[i - 1].textContent).toBe(formattedValue);
                expect(tableItems[i - 1].title).toBe(formattedValue);
            }
        }
    }

    export function validateTableRowTooltip(selector: string, dataView: powerbi.DataView, index: number): void {
        let tableItems = $("tr").eq(index + 1).find(selector);
        let values = dataView.table.rows[index];

        for (let i = 0; i < values.length; i++) {
            if (values[i]) {
                let columnFormat: powerbi.DataViewMetadataColumn = dataView.table.columns[i];
                let formattedValue: string = values[i].toString();

                if (columnFormat) {
                    formattedValue = ValueFormatter.formatVariantMeasureValue(values[i], columnFormat, TablixObjects.PropColumnFormatString, false);
                }

                expect(tableItems[i].textContent).toBe(formattedValue);
                expect(tableItems[i].title).toBe(formattedValue);
            }
        }
    }
}
