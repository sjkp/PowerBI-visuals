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
    export interface ColumnBehaviorOptions {
        datapoints: SelectableDataPoint[];
        bars: D3.Selection;
        eventGroup: D3.Selection;
        mainGraphicsContext: D3.Selection;
        hasHighlights: boolean;
        viewport: IViewport;
        axisOptions: ColumnAxisOptions;
        showLabel: boolean;
    }

    export class ColumnChartWebBehavior implements IInteractiveBehavior {
        private options: ColumnBehaviorOptions;

        public bindEvents(options: ColumnBehaviorOptions, selectionHandler: ISelectionHandler) {
            this.options = options;
            let eventGroup = options.eventGroup;

            eventGroup.on('click', () => {
                let d = ColumnChartWebBehavior.getDatumForLastInputEvent();
                
                selectionHandler.handleSelection(d, d3.event.ctrlKey);
            });

            eventGroup.on('contextmenu', () => {
                if (d3.event.ctrlKey)
                    return;

                d3.event.preventDefault();

                let d = ColumnChartWebBehavior.getDatumForLastInputEvent();
                let position = InteractivityUtils.getPositionOfLastInputEvent();
                
                selectionHandler.handleContextMenu(d, position);
            });
        }

        public renderSelection(hasSelection: boolean) {
            let options = this.options;
            options.bars.style("fill-opacity", (d: ColumnChartDataPoint) => ColumnUtil.getFillOpacity(d.selected, d.highlight, !d.highlight && hasSelection, !d.selected && options.hasHighlights));
        }

        private static getDatumForLastInputEvent(): any {
            let target = d3.event.target;
            return d3.select(target).datum();
        }
    }
} 