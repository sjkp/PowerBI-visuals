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
    import ISize = shapes.ISize;

    export module DonutLabelUtils {
        export const LineStrokeWidth: number = 1;
        export const DiagonalLineIndex: number = 0;
        export const HorizontalLineIndex: number = 1;

        export function getLabelLeaderLineForDonutChart(donutArcDescriptor: DonutArcDescriptor, donutProperties: DonutChartProperties,
            parentPoint: IPoint, sliceArc: number = 0): number[][] {
            let innerLinePointMultiplier = 2.05;
            let textPoint: number[];
            let midPoint: number[];
            let chartPoint: number[];
            // Label position has changed
            if (sliceArc) {
                let arc = sliceArc;
                let outerRadius = donutProperties.radius * donutProperties.outerArcRadiusRatio;
                let innerRadius = (donutProperties.radius / 2) * donutProperties.innerArcRadiusRatio;
                midPoint = [Math.cos(arc) * outerRadius, Math.sin(arc) * outerRadius];
                chartPoint = [Math.cos(arc) * innerRadius, Math.sin(arc) * innerRadius];
            }
            // Original label position
            else {
                midPoint = donutProperties.outerArc.centroid(donutArcDescriptor);
                chartPoint = donutProperties.arc.centroid(donutArcDescriptor);
            }
            let textPointX = parentPoint.x;
            let lineMargin = NewDataLabelUtils.maxLabelOffset / 2;
            textPointX += textPointX < 0 ? -lineMargin : lineMargin;
            textPoint = [textPointX, parentPoint.y];
            chartPoint[0] *= innerLinePointMultiplier;
            chartPoint[1] *= innerLinePointMultiplier;
            return [chartPoint, midPoint, textPoint];
        }

        /** We calculate the rectangles of the leader lines for collision detection 
          *width: x2 - x1; height: y2 - y1 */
        export function getLabelLeaderLinesSizeForDonutChart(leaderLinePoints: number[][]): ISize[] {
            if (leaderLinePoints && leaderLinePoints.length > 2) {
                let diagonalLineSize: ISize = {
                    width: Math.abs(leaderLinePoints[1][0] - leaderLinePoints[0][0]),
                    height: Math.abs(leaderLinePoints[1][1] - leaderLinePoints[0][1]),
                };
                // For horizontal line we set 1 in the height
                let horizontalLineSize: ISize = {
                    width: Math.abs(leaderLinePoints[2][0] - leaderLinePoints[1][0]),
                    height: DonutLabelUtils.LineStrokeWidth,
                };
                return [diagonalLineSize, horizontalLineSize];
            }
            return null;
        }

        export function getXPositionForDonutLabel(textPointX: number): number {
            let margin = textPointX < 0 ? -NewDataLabelUtils.maxLabelOffset : NewDataLabelUtils.maxLabelOffset;
            return textPointX += margin;
        }

        export function getSpaceAvailableForDonutLabels(labelXPos: number, viewport: IViewport): number {
            return viewport.width / 2 - Math.abs(labelXPos) - NewDataLabelUtils.maxLabelOffset;
        }
    }
}