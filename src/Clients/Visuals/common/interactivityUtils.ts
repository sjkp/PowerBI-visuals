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
    export module InteractivityUtils {
        export function getPositionOfLastInputEvent(): IPoint {
            return {
                x: d3.event.clientX,
                y: d3.event.clientY
            };
        }

        export function registerStandardInteractivityHandlers(selection: D3.Selection, selectionHandler: ISelectionHandler): void {
            registerStandardSelectionHandler(selection, selectionHandler);
            registerStandardContextMenuHandler(selection, selectionHandler);
        }

        export function registerStandardSelectionHandler(selection: D3.Selection, selectionHandler: ISelectionHandler): void {
            selection.on('click', (d: SelectableDataPoint) => handleSelection(d, selectionHandler));
        }

        export function registerStandardContextMenuHandler(selection: D3.Selection, selectionHandler: ISelectionHandler): void {
            selection.on('contextmenu', (d: SelectableDataPoint) => handleContextMenu(d, selectionHandler));
        }

        export function registerGroupInteractivityHandlers(group: D3.Selection, selectionHandler: ISelectionHandler): void {
            registerGroupSelectionHandler(group, selectionHandler);
            registerGroupContextMenuHandler(group, selectionHandler);
        }

        export function registerGroupSelectionHandler(group: D3.Selection, selectionHandler: ISelectionHandler): void {
            group.on('click', () => {
                let target = d3.event.target;
                let d = <SelectableDataPoint>d3.select(target).datum();
                handleSelection(d, selectionHandler);
            });
        }

        export function registerGroupContextMenuHandler(group: D3.Selection, selectionHandler: ISelectionHandler): void {
            group.on('contextmenu', () => {
                let target = d3.event.target;
                let d = <SelectableDataPoint>d3.select(target).datum();
                handleContextMenu(d, selectionHandler);
            });
        }

        function handleContextMenu(d: SelectableDataPoint, selectionHandler: ISelectionHandler): void {
            if (d3.event.ctrlKey)
                return;

            d3.event.preventDefault();
            let position = InteractivityUtils.getPositionOfLastInputEvent();
            selectionHandler.handleContextMenu(d, position);
        }

        function handleSelection(d: SelectableDataPoint, selectionHandler: ISelectionHandler): void {
            selectionHandler.handleSelection(d, d3.event.ctrlKey);
        }
    }
} 