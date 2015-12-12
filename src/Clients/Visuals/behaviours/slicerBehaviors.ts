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
    import SlicerOrientation = slicerOrientation.Orientation;

    export interface SlicerOrientationBehaviorOptions {
        behaviorOptions: SlicerBehaviorOptions;
        orientation: slicerOrientation.Orientation;
    }

    export interface SlicerBehaviorOptions {
        slicerContainer: D3.Selection;
        itemLabels: D3.Selection;
        clear: D3.Selection;
        dataPoints: SlicerDataPoint[];
        interactivityService: IInteractivityService;
        settings: SlicerSettings;
    }

    export class SlicerWebBehavior implements IInteractiveBehavior {
        private behavior: IInteractiveBehavior;

        public bindEvents(options: SlicerOrientationBehaviorOptions, selectionHandler: ISelectionHandler): void {
            this.behavior = this.createWebBehavior(options);
            this.behavior.bindEvents(options.behaviorOptions, selectionHandler);
        }

        public renderSelection(hasSelection: boolean): void {
            this.behavior.renderSelection(hasSelection);
        }

        public static bindSlicerEvents(slicerContainer: D3.Selection, slicers: D3.Selection, slicerClear: D3.Selection, selectionHandler: ISelectionHandler, slicerSettings: SlicerSettings, interactivityService: IInteractivityService): void {
            SlicerWebBehavior.bindSlicerItemSelectionEvent(slicers, selectionHandler, slicerSettings, interactivityService);
            SlicerWebBehavior.bindSlicerClearEvent(slicerClear, selectionHandler);
            SlicerWebBehavior.styleSlicerContainer(slicerContainer, interactivityService);
        }

        public static setSelectionOnSlicerItems(selectableItems: D3.Selection, itemLabel: D3.Selection, hasSelection: boolean, interactivityService: IInteractivityService, slicerSettings: SlicerSettings): void {
            if (!hasSelection && !interactivityService.isSelectionModeInverted()) {
                selectableItems.filter('.selected').classed('selected', false);
                selectableItems.filter('.partiallySelected').classed('partiallySelected', false);
                let input = selectableItems.selectAll('input');
                if (input) {
                    input.property('checked', false);
                }
                itemLabel.style('color', slicerSettings.slicerText.color);
            }
            else {
                SlicerWebBehavior.styleSlicerItems(selectableItems, hasSelection);
            }
        }

        public static styleSlicerItems(slicerItems: D3.Selection, hasSelection: boolean): void {
            slicerItems.each(function (d: SlicerDataPoint) {
                let slicerItem: HTMLElement = this;

                if (d.isSelectAllDataPoint && hasSelection)
                    slicerItem.classList.add('partiallySelected');
                else
                    slicerItem.classList.remove('partiallySelected');

                if (d.selected)
                    slicerItem.classList.add('selected');
                else
                    slicerItem.classList.remove('selected');
                 
                // Set input selected state to match selection
                let input = slicerItem.getElementsByTagName('input')[0];
                if (input)
                    input.checked = d.selected;
            });
        }

        private static bindSlicerItemSelectionEvent(slicers: D3.Selection, selectionHandler: ISelectionHandler, slicerSettings: SlicerSettings, interactivityService: IInteractivityService): void {
            slicers.on("click", (d: SlicerDataPoint) => {
                d3.event.preventDefault();
                if (d.isSelectAllDataPoint) {
                    selectionHandler.toggleSelectionModeInversion();
                }
                else {
                    selectionHandler.handleSelection(d, SlicerWebBehavior.isMultiSelect(d3.event, slicerSettings, interactivityService));
                }
                selectionHandler.persistSelectionFilter(slicerProps.filterPropertyIdentifier);
            });
        }

        private static bindSlicerClearEvent(slicerClear: D3.Selection, selectionHandler: ISelectionHandler): void {
            if (slicerClear) {
                slicerClear.on("click", (d: SelectableDataPoint) => {
                    selectionHandler.handleClearSelection();
                    selectionHandler.persistSelectionFilter(slicerProps.filterPropertyIdentifier);
                });
            }
        }

        private static styleSlicerContainer(slicerContainer: D3.Selection, interactivityService: IInteractivityService) {
            let hasSelection = interactivityService.hasSelection();
            slicerContainer.classed('hasSelection', hasSelection);
        }

        private static isMultiSelect(event: D3.D3Event, settings: SlicerSettings, interactivityService: IInteractivityService): boolean {
            // If selection is inverted, assume we're always in multi-select mode;
            // Also, Ctrl can be used to multi-select even in single-select mode.
            return interactivityService.isSelectionModeInverted()
                || !settings.selection.singleSelect
                || event.ctrlKey;
        }

        private createWebBehavior(options: SlicerOrientationBehaviorOptions): IInteractiveBehavior {
            let behavior: IInteractiveBehavior;
            let orientation = options.orientation;
            switch (orientation) {
                case SlicerOrientation.Horizontal:
                    behavior = new HorizontalSlicerWebBehavior();
                    break;

                case SlicerOrientation.Vertical:
                default:
                    behavior = new VerticalSlicerWebBehavior();
                    break;
            }
            return behavior;
        }
    }
}  