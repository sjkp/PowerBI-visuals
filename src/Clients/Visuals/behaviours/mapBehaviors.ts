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
    import MapSliceContainer = powerbi.visuals.MapSliceContainer;

    export interface MapBehaviorOptions {
        dataPoints: SelectableDataPoint[];
        bubbles?: D3.Selection;
        slices?: D3.Selection;
        shapes?: D3.Selection;
        clearCatcher: D3.Selection;
        bubbleEventGroup?: D3.Selection;
        sliceEventGroup?: D3.Selection;
        shapeEventGroup?: D3.Selection;
    }

    export class MapBehavior implements IInteractiveBehavior {
        private bubbles: D3.Selection;
        private slices: D3.Selection;
        private shapes: D3.Selection;
        private mapPointerEventsDisabled = false;
        private mapPointerTimeoutSet = false;
        private viewChangedSinceLastClearMouseDown = false;
        private receivedZoomOrPanEvent = false;

        public bindEvents(options: MapBehaviorOptions, selectionHandler: ISelectionHandler): void {
            let bubbles = this.bubbles = options.bubbles;
            let slices = this.slices = options.slices;
            let shapes = this.shapes = options.shapes;
            let clearCatcher = options.clearCatcher;

            let clickHandler = () => {
                let target = d3.event.target;
                let d = <SelectableDataPoint>d3.select(target).datum();

                if (bubbles)
                    bubbles.style("pointer-events", "all");
                if (shapes)
                    shapes.style("pointer-events", "all");
                selectionHandler.handleSelection(d, d3.event.ctrlKey);
            };

            if (!this.mapPointerEventsDisabled) {
                if (bubbles)
                    bubbles.style("pointer-events", "all");
                if (slices)
                    slices.style("pointer-events", "all");
                if (shapes)
                    shapes.style("pointer-events", "all");
            }

            if (bubbles) {
                options.bubbleEventGroup.on('click', clickHandler);
                options.bubbleEventGroup.on('mousewheel', () => {
                    if (!this.mapPointerEventsDisabled)
                        bubbles.style("pointer-events", "none");
                    this.mapPointerEventsDisabled = true;
                    if (!this.mapPointerTimeoutSet) {
                        this.mapPointerTimeoutSet = true;
                        setTimeout(() => {
                            if (bubbles)
                                bubbles.style("pointer-events", "all");
                            this.mapPointerEventsDisabled = false;
                            this.mapPointerTimeoutSet = false;
                        }, 200);
                    }
                });

                InteractivityUtils.registerGroupContextMenuHandler(options.bubbleEventGroup, selectionHandler);
            }

            if (slices) {
                options.sliceEventGroup.on('click', () => {
                    slices.style("pointer-events", "all");
                    this.mapPointerEventsDisabled = false;

                    let target = d3.event.target;
                    let d = <MapSliceContainer>d3.select(target).datum();
                    selectionHandler.handleSelection(d.data, d3.event.ctrlKey);
                });
                options.sliceEventGroup.on('mousewheel', () => {
                    if (!this.mapPointerEventsDisabled)
                        slices.style("pointer-events", "none");
                    this.mapPointerEventsDisabled = true;
                    if (!this.mapPointerTimeoutSet) {
                        this.mapPointerTimeoutSet = true;
                        setTimeout(() => {
                            if (slices)
                                slices.style("pointer-events", "all");
                            this.mapPointerEventsDisabled = false;
                            this.mapPointerTimeoutSet = false;
                        }, 200);
                    }
                });

                options.sliceEventGroup.on('contextmenu', () => {
                    if (d3.event.ctrlKey)
                        return;

                    d3.event.preventDefault();
                    let position = InteractivityUtils.getPositionOfLastInputEvent();

                    let target = d3.event.target;
                    let d = <MapSliceContainer>d3.select(target).datum();
                    selectionHandler.handleContextMenu(d.data, position);
                });
            }

            if (shapes) {
                options.shapeEventGroup.on('click', clickHandler);
                options.shapeEventGroup.on('mousewheel', () => {
                    if (!this.mapPointerEventsDisabled) {
                        shapes.style("pointer-events", "none");
                    }
                    this.mapPointerEventsDisabled = true;
                    if (!this.mapPointerTimeoutSet) {
                        this.mapPointerTimeoutSet = true;
                        setTimeout(() => {
                            if (shapes)
                                shapes.style("pointer-events", "all");
                            this.mapPointerEventsDisabled = false;
                            this.mapPointerTimeoutSet = false;
                        }, 200);
                    }
                });

                InteractivityUtils.registerGroupContextMenuHandler(options.shapeEventGroup, selectionHandler);
            }

            clearCatcher.on('mouseup', () => {
                if (!this.viewChangedSinceLastClearMouseDown) {
                    selectionHandler.handleClearSelection();
                    this.receivedZoomOrPanEvent = true;
                }
            });

            clearCatcher.on('mousedown', () => {
                this.viewChangedSinceLastClearMouseDown = false;
            });

            clearCatcher.on('mousewheel', () => {
                this.receivedZoomOrPanEvent = true;
            });
        }

        public renderSelection(hasSelection: boolean) {
            if (this.bubbles) {
                this.bubbles
                    .style({
                        'fill-opacity': (d: MapBubble) => ColumnUtil.getFillOpacity(d.selected, false, hasSelection, false),
                        'stroke-opacity': (d: MapBubble) => ColumnUtil.getFillOpacity(d.selected, false, hasSelection, false),
                    });
            }
            if (this.slices) {
                this.slices
                    .style({
                        "fill-opacity": (d) => ColumnUtil.getFillOpacity(d.data.selected, false, hasSelection, false),
                        "stroke-opacity": (d) => ColumnUtil.getFillOpacity(d.data.selected, false, hasSelection, false),
                    });
            }
            if (this.shapes) {
                this.shapes
                    .style({
                        "fill-opacity": (d) => ColumnUtil.getFillOpacity(d.selected, false, hasSelection, false),
                        "stroke-opacity": (d) => ColumnUtil.getFillOpacity(d.selected, false, hasSelection, false),
                    });
            }
        }

        public viewChanged() {
            this.viewChangedSinceLastClearMouseDown = true;
        }

        public resetZoomPan() {
            this.receivedZoomOrPanEvent = false;
        }

        public hasReceivedZoomOrPanEvent(): boolean {
            return this.receivedZoomOrPanEvent;
        }
    }
}