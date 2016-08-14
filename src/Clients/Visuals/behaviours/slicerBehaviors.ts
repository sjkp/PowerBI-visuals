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
    import DOMConstants = jsCommon.DOMConstants;
    import KeyUtils = jsCommon.KeyUtils;
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
        slicerValueHandler: SlicerValueHandler;
        searchInput: D3.Selection;
    }

    export class SlicerWebBehavior implements IInteractiveBehavior {
        private behavior: IInteractiveBehavior;
        private static searchInputTimeoutDuration = 500;

        public bindEvents(options: SlicerOrientationBehaviorOptions, selectionHandler: ISelectionHandler): void {
            this.behavior = this.createWebBehavior(options);
            this.behavior.bindEvents(options.behaviorOptions, selectionHandler);
        }

        public renderSelection(hasSelection: boolean): void {
            this.behavior.renderSelection(hasSelection);
        }

        public static bindSlicerEvents(
            behaviorOptions: SlicerBehaviorOptions,
            slicers: D3.Selection,
            selectionHandler: ISelectionHandler,
            slicerSettings: SlicerSettings,
            interactivityService: IInteractivityService): void {

            SlicerWebBehavior.bindSlicerItemSelectionEvent(slicers, selectionHandler, slicerSettings, interactivityService);
            SlicerWebBehavior.bindSlicerClearEvent(behaviorOptions.clear, selectionHandler);
            if (behaviorOptions.searchInput)
                SlicerWebBehavior.bindSlicerSearchEvent(behaviorOptions.searchInput, selectionHandler, behaviorOptions.slicerValueHandler);

            SlicerWebBehavior.styleSlicerContainer(behaviorOptions.slicerContainer, interactivityService);
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
                SlicerWebBehavior.styleSlicerItems(selectableItems, hasSelection, interactivityService.isSelectionModeInverted());
            }
        }

        public static styleSlicerItems(slicerItems: D3.Selection, hasSelection: boolean, isSelectionInverted: boolean): void {
            slicerItems.each(function (d: SlicerDataPoint) {
                let slicerItem: HTMLElement = this;
                let shouldCheck: boolean = false;
                if (d.isSelectAllDataPoint) {
                    if (hasSelection) {
                        slicerItem.classList.add('partiallySelected');
                        shouldCheck = false;
                    }
                    else {
                        slicerItem.classList.remove('partiallySelected');
                        shouldCheck = isSelectionInverted;
                    }
                }
                else {
                    shouldCheck = jsCommon.LogicExtensions.XOR(d.selected, isSelectionInverted);
                }
                
                if (shouldCheck)
                    slicerItem.classList.add('selected');
                else
                    slicerItem.classList.remove('selected');

                // Set input selected state to match selection
                let input = slicerItem.getElementsByTagName('input')[0];
                if (input)
                    input.checked = shouldCheck;
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
                slicerClear.on("click", () => {
                    selectionHandler.handleClearSelection();
                    selectionHandler.persistSelectionFilter(slicerProps.filterPropertyIdentifier);
                });
            }
        }
        
        private static bindSlicerSearchEvent(slicerSearch: D3.Selection, selectionHandler: ISelectionHandler, slicerValueHandler: SlicerValueHandler): void {
            if (slicerSearch.empty())
                return;

            slicerSearch.on(DOMConstants.keyDownEventName, () => {
                if (d3.event.ctrlKey && KeyUtils.isCtrlDefaultKey(d3.event.keyCode))
                    d3.event.stopPropagation();
                else if (KeyUtils.isArrowKey(d3.event.keyCode) || d3.event.keyCode === DOMConstants.deleteKeyCode)
                    d3.event.stopPropagation();
                else if (d3.event.keyCode === DOMConstants.escKeyCode) {

                    // Clear search when ESC key is pressed
                    selectionHandler.persistSelfFilter(slicerProps.selfFilterPropertyIdentifier, null);
                    d3.event.stopPropagation();
                }
                else if (d3.event.keyCode === DOMConstants.enterKeyCode) {
                    SlicerWebBehavior.startSearch(slicerSearch, selectionHandler, slicerValueHandler);
                    d3.event.stopPropagation();
                }
            }).on(DOMConstants.keyUpEventName, _.debounce(() => {
                SlicerWebBehavior.startSearch(slicerSearch, selectionHandler, slicerValueHandler);
            }, SlicerWebBehavior.searchInputTimeoutDuration));
        }

        private static startSearch(slicerSearch: D3.Selection, selectionHandler: ISelectionHandler, slicerValueHandler: SlicerValueHandler): void {
            let element: HTMLInputElement = <HTMLInputElement>slicerSearch.node();
            let searchKey: string = element && element.value;
            searchKey = _.trim(searchKey);
            // When searchKey is cleared.
            if (_.isEmpty(searchKey)) {
                selectionHandler.persistSelfFilter(slicerProps.selfFilterPropertyIdentifier, null);
                return;
            }

            let updatedFilter = slicerValueHandler.getUpdatedSelfFilter(searchKey);
            if (updatedFilter)
                selectionHandler.persistSelfFilter(slicerProps.selfFilterPropertyIdentifier, updatedFilter);
        }

        private static styleSlicerContainer(slicerContainer: D3.Selection, interactivityService: IInteractivityService) {
            let hasSelection = (interactivityService.hasSelection() && interactivityService.isDefaultValueEnabled() === undefined)
                || interactivityService.isDefaultValueEnabled() === false;
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