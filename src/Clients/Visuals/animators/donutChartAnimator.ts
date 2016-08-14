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
    export interface DonutChartAnimationOptions extends IAnimationOptions {
        viewModel: DonutData;
        graphicsContext: D3.Selection;
        labelGraphicsContext: D3.Selection;
        colors: IDataColorPalette;
        layout: DonutLayout;
        sliceWidthRatio: number;
        radius: number;
        viewport: IViewport;
        innerArcRadiusRatio: number;
        labels: Label[];
    }

    export interface DonutChartAnimationResult extends IAnimationResult {
        shapes: D3.UpdateSelection;
        highlightShapes: D3.UpdateSelection;
    }

    export type IDonutChartAnimator = IAnimator<IAnimatorOptions, DonutChartAnimationOptions, DonutChartAnimationResult>;

    export class WebDonutChartAnimator extends BaseAnimator<IAnimatorOptions, DonutChartAnimationOptions, DonutChartAnimationResult> implements IDonutChartAnimator {
        private previousViewModel: DonutData;

        constructor(options?: IAnimatorOptions) {
            super(options);
        }

        public animate(options: DonutChartAnimationOptions): DonutChartAnimationResult {
            let result: DonutChartAnimationResult = {
                failed: true,
                shapes: null,
                highlightShapes: null,
            };

            let viewModel = options.viewModel;
            let previousViewModel = this.previousViewModel;
            if (viewModel.highlightsOverflow || (previousViewModel && previousViewModel.highlightsOverflow)) {
                // Do not animate when we have highlights but they are overflowing
                this.previousViewModel = viewModel;
                return result;
            }
            let previousHasHighlights = previousViewModel && previousViewModel.hasHighlights;
            let currentHasHighlights = viewModel.hasHighlights;

            if (!previousViewModel) {
                // This is the initial drawing of the chart, which has no special animation for now.
            }
            else if (currentHasHighlights && !previousHasHighlights) {
                result = this.animateNormalToHighlighted(options);
            }
            else if (currentHasHighlights && previousHasHighlights) {
                result = this.animateHighlightedToHighlighted(options);
            }
            else if (!currentHasHighlights && previousHasHighlights) {
                result = this.animateHighlightedToNormal(options);
            }
            this.previousViewModel = viewModel;
            return result;
        }

        private animateNormalToHighlighted(options: DonutChartAnimationOptions): DonutChartAnimationResult {
            let shapes = this.animateDefaultShapes(options);

            let highlightShapes = options.graphicsContext.select('.slices')
                .selectAll('path.slice-highlight')
                .data(options.viewModel.dataPoints.filter((value: DonutArcDescriptor) => value.data.highlightRatio != null), (d: DonutArcDescriptor) => d.data.identity.getKey());

            highlightShapes.enter()
                .insert('path')
                .classed('slice-highlight', true)
                .each(function (d) { this._current = d; });

            DonutChart.isSingleColor(options.viewModel.dataPoints.filter((value: DonutArcDescriptor) => value.data.highlightRatio != null));

            highlightShapes
                .style('fill', (d: DonutArcDescriptor) => d.data.color ? d.data.color : options.colors.getNewColorScale().getColor(d.data.identity.getKey()).value)
                .style('fill-opacity', (d: DonutArcDescriptor) => ColumnUtil.getFillOpacity(d.data.selected, true, false, options.viewModel.hasHighlights))
                .style("stroke-dasharray", (d: DonutArcDescriptor) => DonutChart.drawStrokeForDonutChart(options.radius, options.innerArcRadiusRatio, d, options.sliceWidthRatio, d.data.highlightRatio))
                .style("stroke-width", (d: DonutArcDescriptor) => d.data.strokeWidth)
                .attr(options.layout.shapeLayout)  // Start at the non-highlight layout, then transition to the highlight layout.
                .transition()
                .duration(this.animationDuration)
                .attr(options.layout.highlightShapeLayout);

            highlightShapes.exit()
                .remove();

            NewDataLabelUtils.drawDefaultLabels(options.labelGraphicsContext, options.labels, false, true, true /*has tooltip */);
            NewDataLabelUtils.drawLabelLeaderLines(options.labelGraphicsContext, options.labels);

            return {
                failed: false,
                shapes: shapes,
                highlightShapes: highlightShapes,
            };
        }

        private animateHighlightedToHighlighted(options: DonutChartAnimationOptions): DonutChartAnimationResult {
            let shapes = this.animateDefaultShapes(options);

            let highlightShapes = this.animateDefaultHighlightShapes(options);
            NewDataLabelUtils.drawDefaultLabels(options.labelGraphicsContext, options.labels, false, true, true /*has tooltip */);
            NewDataLabelUtils.drawLabelLeaderLines(options.labelGraphicsContext, options.labels);

            return {
                failed: false,
                shapes: shapes,
                highlightShapes: highlightShapes,
            };
        }

        private animateHighlightedToNormal(options: DonutChartAnimationOptions): DonutChartAnimationResult {
            let hasSelection = options.interactivityService && options.interactivityService.hasSelection();
            let duration = this.animationDuration;

            let shapes = options.graphicsContext.select('.slices')
                .selectAll('path.slice')
                .data(options.viewModel.dataPoints, (d: DonutArcDescriptor) => d.data.identity.getKey());

            shapes.enter()
                .insert('path')
                .classed('slice', true)
                .each(function (d) { this._current = d; });

            DonutChart.isSingleColor(options.viewModel.dataPoints);

            // For any slice that is selected we want to keep showing it as dimmed (partially highlighted). After the highlight animation
            // finishes we will set the opacity based on the selection state.
            shapes
                .style('fill', (d: DonutArcDescriptor) => d.data.color ? d.data.color : options.colors.getNewColorScale().getColor(d.data.identity.getKey()).value)
                .style('fill-opacity', (d: DonutArcDescriptor) => ColumnUtil.getFillOpacity(d.data.selected, false, d.data.selected, !d.data.selected))
                .style("stroke-dasharray", (d: DonutArcDescriptor) => DonutChart.drawStrokeForDonutChart(options.radius, options.innerArcRadiusRatio, d, options.sliceWidthRatio))
                .style("stroke-width", (d: DonutArcDescriptor) => d.data.strokeWidth)
                .transition()
                .duration(duration)
                .attr(options.layout.shapeLayout)
                .transition()
                .duration(0)
                .delay(duration)
                .style("fill-opacity", (d: DonutArcDescriptor) => ColumnUtil.getFillOpacity(d.data.selected, false, hasSelection, false));;

            shapes.exit()
                .remove();

            let highlightShapes = options.graphicsContext.select('.slices')
                .selectAll('path.slice-highlight')
                .data(options.viewModel.dataPoints.filter((value: DonutArcDescriptor) => value.data.highlightRatio != null), (d: DonutArcDescriptor) => d.data.identity.getKey());

            highlightShapes.enter()
                .insert('path')
                .classed('slice-highlight', true)
                .each(function (d) { this._current = d; });

            DonutChart.isSingleColor(options.viewModel.dataPoints.filter((value: DonutArcDescriptor) => value.data.highlightRatio != null));

            highlightShapes
                .style('fill', (d: DonutArcDescriptor) => d.data.color ? d.data.color : options.colors.getNewColorScale().getColor(d.data.identity.getKey()).value)
                .style('fill-opacity', (d: DonutArcDescriptor) => ColumnUtil.getFillOpacity(false, true, false, true))
                .style("stroke-dasharray", (d: DonutArcDescriptor) => DonutChart.drawStrokeForDonutChart(options.radius, options.innerArcRadiusRatio, d, options.sliceWidthRatio, d.data.highlightRatio))
                .style("stroke-width", (d: DonutArcDescriptor) => d.data.strokeWidth)
                .transition()
                .duration(duration)
                .attr(hasSelection ? options.layout.zeroShapeLayout : options.layout.shapeLayout)  // Transition to the non-highlight layout
                .remove();

            highlightShapes.exit()
                .remove();

            NewDataLabelUtils.drawDefaultLabels(options.labelGraphicsContext, options.labels, false, true, true /*has tooltip */);
            NewDataLabelUtils.drawLabelLeaderLines(options.labelGraphicsContext, options.labels);

            return {
                failed: false,
                shapes: shapes,
                highlightShapes: highlightShapes,
            };
        }

        private animateDefaultShapes(options: DonutChartAnimationOptions): D3.UpdateSelection {
            let shapes = options.graphicsContext.select('.slices')
                .selectAll('path.slice')
                .data(options.viewModel.dataPoints, (d: DonutArcDescriptor) => d.data.identity.getKey());

            shapes.enter()
                .insert('path')
                .classed('slice', true)
                .each(function (d) { this._current = d; });

            DonutChart.isSingleColor(options.viewModel.dataPoints);

            shapes
                .style('fill', (d: DonutArcDescriptor) => d.data.color ? d.data.color : options.colors.getNewColorScale().getColor(d.data.identity.getKey()).value)
                .style('fill-opacity', (d: DonutArcDescriptor) => ColumnUtil.getFillOpacity(d.data.selected, false, false, options.viewModel.hasHighlights))
                .style("stroke-dasharray", (d: DonutArcDescriptor) => DonutChart.drawStrokeForDonutChart(options.radius, options.innerArcRadiusRatio, d, options.sliceWidthRatio))
                .style("stroke-width", (d: DonutArcDescriptor) => d.data.strokeWidth)
                .transition()
                .duration(this.animationDuration)
                .attr(options.layout.shapeLayout);

            shapes.exit()
                .remove();

            return shapes;
        }

        private animateDefaultHighlightShapes(options: DonutChartAnimationOptions): D3.UpdateSelection {
            let highlightShapes = options.graphicsContext.select('.slices')
                .selectAll('path.slice-highlight')
                .data(options.viewModel.dataPoints.filter((value: DonutArcDescriptor) => value.data.highlightRatio != null), (d: DonutArcDescriptor) => d.data.identity.getKey());

            highlightShapes.enter()
                .insert('path')
                .classed('slice-highlight', true)
                .each(function (d) { this._current = d; });

            DonutChart.isSingleColor(options.viewModel.dataPoints.filter((value: DonutArcDescriptor) => value.data.highlightRatio != null));

            highlightShapes
                .style('fill', (d: DonutArcDescriptor) => d.data.color ? d.data.color : options.colors.getNewColorScale().getColor(d.data.identity.getKey()).value)
                .style('fill-opacity', (d: DonutArcDescriptor) => ColumnUtil.getFillOpacity(d.data.selected, true, false, options.viewModel.hasHighlights))
                .style("stroke-dasharray", (d: DonutArcDescriptor) => DonutChart.drawStrokeForDonutChart(options.radius, options.innerArcRadiusRatio, d, options.sliceWidthRatio, d.data.highlightRatio))
                .style("stroke-width", (d: DonutArcDescriptor) => d.data.strokeWidth)
                .transition()
                .duration(this.animationDuration)
                .attr(options.layout.highlightShapeLayout);

            highlightShapes.exit()
                .remove();

            return highlightShapes;
        }
    }
} 