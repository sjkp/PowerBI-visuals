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

module powerbi {
    import ISize = powerbi.visuals.shapes.ISize;
    import IVector = powerbi.visuals.shapes.IVector;
    import IRect = powerbi.visuals.IRect;
    import VisualDataLabelsSettings = powerbi.visuals.VisualDataLabelsSettings;
    import DonutArcDescriptor = powerbi.visuals.DonutArcDescriptor;
    import NewDataLabelUtils = powerbi.visuals.NewDataLabelUtils;
    import labelStyle = powerbi.visuals.labelStyle;
    import DonutLabelUtils = powerbi.visuals.DonutLabelUtils;

    export interface DonutChartProperties {
        viewport: IViewport;
        dataLabelsSettings: VisualDataLabelsSettings;
        radius: number;
        arc: D3.Svg.Arc;
        outerArc: D3.Svg.Arc;
        outerArcRadiusRatio: number;
        innerArcRadiusRatio: number;
    }

    export interface DonutLabelDataPoint extends LabelDataPoint {
        dataLabel: string;
        dataLabelSize: ISize;
        categoryLabel: string;
        categoryLabelSize: ISize;
        donutArcDescriptor: DonutArcDescriptor;
        alternativeScale: number;
        angle: number;
        linesSize: ISize[];
        leaderLinePoints: number[][];
    }

    interface LabelCandidate {
        angle: number;
        point: LabelParentPoint;
        score: number;
        labelRects: DonutLabelRect;
        labelDataPoint?: DonutLabelDataPoint;
    }

    export interface DonutLabelRect {
        textRect: IRect;
        diagonalLineRect: IRect;
        horizontalLineRect: IRect;
    }

    export class DonutLabelLayout {

        /** Maximum distance labels will be offset by */
        private maximumOffset: number;
        /** The amount to increase the offset each attempt while laying out labels */
        private offsetIterationDelta: number;
        /** The amount of offset to start with when the data label is not centered */
        private startingOffset: number;

        private donutChartProperties: DonutChartProperties;
        private center: IVector;
        private outerRadius: number;
        private innerRadius: number;
        private additionalCharsWidth: number;

        constructor(options: DataLabelLayoutOptions, donutChartProperties: DonutChartProperties) {
            this.startingOffset = options.startingOffset;
            this.maximumOffset = options.maximumOffset;
            if (options.offsetIterationDelta != null) {
                debug.assert(options.offsetIterationDelta > 0, "label offset delta must be greater than 0");
                this.offsetIterationDelta = options.offsetIterationDelta;
            }

            this.donutChartProperties = donutChartProperties;
            this.center = {
                x: donutChartProperties.viewport.width / 2,
                y: donutChartProperties.viewport.height / 2,
            };
            this.outerRadius = this.donutChartProperties.radius * this.donutChartProperties.outerArcRadiusRatio;
            this.innerRadius = (this.donutChartProperties.radius / 2) * this.donutChartProperties.innerArcRadiusRatio;
            this.additionalCharsWidth = TextMeasurementService.measureSvgTextWidth({
                text: " ()",
                fontFamily: NewDataLabelUtils.LabelTextProperties.fontFamily,
                fontSize: jsCommon.PixelConverter.fromPoint(donutChartProperties.dataLabelsSettings.fontSize),
                fontWeight: NewDataLabelUtils.LabelTextProperties.fontWeight,
            });
        }

        /**
         * Arrange takes a set of data labels and lays them out them in order, assuming that
         * the given array has already been sorted with the most preferred labels at the
         * front.
         * 
         * Details:
         * - We iterate over offsets from the target position, increasing from 0
         * - For each offset, we iterate over each data label
         * - For each data label, we iterate over each position that is valid for
         *     both the specific label and this layout
         * - When a valid position is found, we position the label there and no longer
         *     reposition it.
         * - This prioritizes the earlier labels to be positioned closer to their
         *     target points in the position they prefer.
         * - This prioritizes putting data labels close to a valid position over
         *     placing them at their preferred position (it will place it at a less
         *     preferred position if it will be a smaller offset)
         */
        public layout(labelDataPoints: DonutLabelDataPoint[]): Label[] {
            // Clear data labels for a new layout
            for (let donutLabel of labelDataPoints) {
                donutLabel.hasBeenRendered = false;
                donutLabel.labelSize = donutLabel.textSize;
            }

            let resultingLabels: Label[] = [];
            let preferredLabels: DonutLabelDataPoint[] = [];
            let viewport = this.donutChartProperties.viewport;
            let labelDataPointsGroup: LabelDataPointGroup = {
                labelDataPoints: labelDataPoints,
                maxNumberOfLabels: labelDataPoints.length
            };
            let grid = new LabelArrangeGrid([labelDataPointsGroup], viewport);
            for (let i = labelDataPoints.length - 1; i >= 0; i--) {
                let labelPoint = labelDataPoints[i];
                if (labelPoint.isPreferred) {
                    let label = labelDataPoints.splice(i, 1);
                    preferredLabels = label.concat(preferredLabels);
                }
            }

            // first iterate all the preferred labels
            if (preferredLabels.length > 0)
                resultingLabels = this.positionLabels(preferredLabels, grid);
            
            // While there are invisible not preferred labels and label distance is less than the max
            // allowed distance
            if (labelDataPoints.length > 0) {
                let labels = this.positionLabels(labelDataPoints, grid);
                resultingLabels = resultingLabels.concat(labels);
            }

            return resultingLabels;
        }

        private positionLabels(labelDataPoints: DonutLabelDataPoint[], grid: LabelArrangeGrid): Label[] {
            let resultingLabels: Label[] = [];
            let offsetDelta = this.offsetIterationDelta;
            let currentOffset = this.startingOffset;
            let currentCenteredOffset = 0;

            while (currentOffset <= this.maximumOffset) {
                for (let labelPoint of labelDataPoints) {
                    if (labelPoint.hasBeenRendered)
                        continue;
                    let label = this.tryPositionForDonut(labelPoint, grid, currentOffset);
                    if (label)
                        resultingLabels.push(label);
                }

                currentOffset += offsetDelta;
                currentCenteredOffset += offsetDelta;
            }

            return resultingLabels;
        }

        /**
         * We try to move the label 25% up/down if the label is truncated or it collides with other labels.
         * after we moved it once we check that the new position doesn't failed (collides with other labels).
         */
        private tryPositionForDonut(labelPoint: DonutLabelDataPoint, grid: LabelArrangeGrid, currentLabelOffset: number): Label {
            let parentShape: LabelParentPoint = <LabelParentPoint>labelPoint.parentShape;
            if (_.isEmpty(parentShape.validPositions) || parentShape.validPositions[0] === NewPointLabelPosition.None)
                return;

            let defaultPosition: NewPointLabelPosition = parentShape.validPositions[0];

            let bestCandidate = this.tryAllPositions(labelPoint, grid, defaultPosition, currentLabelOffset);

            if (bestCandidate && bestCandidate.score === 0) {
                return this.buildLabel(bestCandidate, grid);
            }
            // If we haven't found a non-truncated label, try to split into 2 lines.
            if (this.donutChartProperties.dataLabelsSettings.labelStyle === labelStyle.both) {
                // Try to split the label to two lines if both data and category label are on
                let splitLabelDataPoint = this.splitDonutDataPoint(labelPoint);
                let bestSplitCandidate = this.tryAllPositions(splitLabelDataPoint, grid, defaultPosition, currentLabelOffset);
                // If the best candidate with a split line is better than the best candidate with a single line, return the former.
                if (bestSplitCandidate && (!bestCandidate || (bestSplitCandidate.score < bestCandidate.score))) {
                    return this.buildLabel(bestSplitCandidate, grid);
                }
            }

            // We didn't find a better candidate by splitting the label lines, so return our best single-line candidate.
            if (bestCandidate) {
                return this.buildLabel(bestCandidate, grid);
            }
        }

        private generateCandidate(labelDataPoint: DonutLabelDataPoint, candidatePosition: NewPointLabelPosition, grid: LabelArrangeGrid, currentLabelOffset: number): LabelCandidate {
            let angle = this.generateCandidateAngleForPosition(labelDataPoint.donutArcDescriptor, candidatePosition);
            let parentShape = this.getPointPositionForAngle(angle);
            let parentPoint = parentShape.point;
            let score = this.score(labelDataPoint, parentPoint);
            let leaderLinePoints = DonutLabelUtils.getLabelLeaderLineForDonutChart(labelDataPoint.donutArcDescriptor, this.donutChartProperties, parentPoint, angle);
            let leaderLinesSize: ISize[] = DonutLabelUtils.getLabelLeaderLinesSizeForDonutChart(leaderLinePoints);

            let newLabelDataPoint = _.clone(labelDataPoint);
            newLabelDataPoint.angle = angle;
            newLabelDataPoint.parentShape = parentShape;
            newLabelDataPoint.leaderLinePoints = leaderLinePoints;
            newLabelDataPoint.linesSize = leaderLinesSize;

            let boundingBoxs: DonutLabelRect = DonutLabelLayout.tryPositionPoint(grid, parentShape.validPositions[0], newLabelDataPoint, currentLabelOffset, this.center, this.donutChartProperties.viewport);

            return {
                angle: angle,
                point: parentShape,
                score: score,
                labelRects: boundingBoxs,
                labelDataPoint: newLabelDataPoint,
            };
        }

        private tryAllPositions(labelDataPoint: DonutLabelDataPoint, grid: LabelArrangeGrid, defaultPosition: NewPointLabelPosition, currentLabelOffset: number): LabelCandidate {
            let boundingBoxs = DonutLabelLayout.tryPositionPoint(grid, defaultPosition, labelDataPoint, currentLabelOffset, this.center, this.donutChartProperties.viewport);

            let originalPoint: LabelParentPoint = <LabelParentPoint>labelDataPoint.parentShape;
            let originalCandidate: LabelCandidate = {
                point: originalPoint,
                angle: labelDataPoint.angle,
                score: this.score(labelDataPoint, originalPoint.point),
                labelRects: boundingBoxs,
                labelDataPoint: labelDataPoint,
            };

            if (boundingBoxs && boundingBoxs.textRect && originalCandidate.score === 0) {
                return originalCandidate;
            }

            let positions: NewPointLabelPosition[] = [];
            let bestCandidate: LabelCandidate;
            if (boundingBoxs && boundingBoxs.textRect) {
                // We have a truncated label here, otherwised we would have returned already
                positions = this.getLabelPointPositions(labelDataPoint, /* isTruncated */ true);
                bestCandidate = originalCandidate;
            }
            else {
                positions = this.getLabelPointPositions(labelDataPoint, /* isTruncated */ false);
            }

            // Try to reposition the label if necessary
            for (let position of positions) {
                let candidate = this.generateCandidate(labelDataPoint, position, grid, currentLabelOffset);
                if (candidate.labelRects && candidate.labelRects.textRect) {
                    if (bestCandidate == null || candidate.score < bestCandidate.score) {
                        bestCandidate = candidate;
                        if (bestCandidate.score === 0)
                            return bestCandidate;
                    }
                }
            }

            return bestCandidate;
        }

        private buildLabel(labelLayout: LabelCandidate, grid: LabelArrangeGrid): Label {
            let resultingBoundingBox = labelLayout.labelRects.textRect;
            let labelPoint = labelLayout.labelDataPoint;

            grid.add(resultingBoundingBox);
            grid.add(labelLayout.labelRects.horizontalLineRect);
            grid.add(labelLayout.labelRects.diagonalLineRect);
            labelPoint.hasBeenRendered = true;
            let left = resultingBoundingBox.left - this.center.x;
            //We need to add or subtract half resultingBoundingBox.width because Donut chart labels get text anchor start/end
            if (left < 0)
                left += resultingBoundingBox.width / 2;
            else
                left -= resultingBoundingBox.width / 2;
            let textAnchor = labelPoint.parentShape.validPositions[0] === NewPointLabelPosition.Right ? 'start' : 'end';
            let boundingBox: IRect = {
                left: left,
                top: resultingBoundingBox.top - this.center.y,
                height: resultingBoundingBox.height,
                width: resultingBoundingBox.width,
            };

            // After repositioning the label we need to recalculate its size and format it according to the current available space
            let labelSettingsStyle = this.donutChartProperties.dataLabelsSettings.labelStyle;
            let spaceAvailableForLabels = DonutLabelUtils.getSpaceAvailableForDonutLabels((<LabelParentPoint>labelPoint.parentShape).point.x, this.donutChartProperties.viewport);
            let formattedDataLabel: string;
            let formattedCategoryLabel: string;
            let text: string;
            let getLabelFormattedText = powerbi.visuals.dataLabelUtils.getLabelFormattedText;
            let fontSize = labelPoint.fontSize;
            let hasOneLabelRow = labelSettingsStyle === labelStyle.both && labelPoint.secondRowText == null;

            // Giving 50/50 space when both category and measure are on
            if (hasOneLabelRow) {
                labelPoint.dataLabel = " (" + labelPoint.dataLabel + ")";
                spaceAvailableForLabels /= 2;
            }

            if (labelSettingsStyle === labelStyle.both || labelSettingsStyle === labelStyle.data) {
                formattedDataLabel = getLabelFormattedText({
                    label: labelPoint.dataLabel,
                    maxWidth: spaceAvailableForLabels,
                    fontSize: fontSize
                });
            }

            if (labelSettingsStyle === labelStyle.both || labelSettingsStyle === labelStyle.category) {
                formattedCategoryLabel = getLabelFormattedText({
                    label: labelPoint.categoryLabel,
                    maxWidth: spaceAvailableForLabels,
                    fontSize: fontSize
                });
            }

            switch (labelSettingsStyle) {
                case labelStyle.both:
                    if (labelPoint.secondRowText == null) {
                        text = formattedCategoryLabel + formattedDataLabel;
                    }
                    else {
                        text = formattedDataLabel;
                        labelPoint.secondRowText = formattedCategoryLabel;                
                    }
                    break;
                case labelStyle.data:
                    text = formattedDataLabel;
                    break;
                case labelStyle.category:
                    text = formattedCategoryLabel;
                    break;
            }

            // Limit text size width for correct leader line calculation
            labelPoint.textSize.width = Math.min(labelPoint.textSize.width, hasOneLabelRow ? spaceAvailableForLabels * 2 : spaceAvailableForLabels);

            return {
                boundingBox: boundingBox,
                text: text,
                tooltip: labelPoint.tooltip,
                isVisible: true,
                fill: labelPoint.outsideFill,
                identity: labelPoint.identity,
                fontSize: fontSize,
                selected: false,
                textAnchor: textAnchor,
                leaderLinePoints: labelPoint.leaderLinePoints,
                hasBackground: false,
                secondRowText: labelPoint.secondRowText,
            };
        }

        private static tryPositionPoint(grid: LabelArrangeGrid, position: NewPointLabelPosition, labelDataPoint: DonutLabelDataPoint, offset: number, center: IVector, viewport: IViewport): DonutLabelRect {
            let parentPoint: LabelParentPoint = <LabelParentPoint>labelDataPoint.parentShape;
            
            // Limit label width to fit the availabe space for labels
            let textSize: ISize = _.clone(labelDataPoint.textSize);
            textSize.width = Math.min(textSize.width, DonutLabelUtils.getSpaceAvailableForDonutLabels(parentPoint.point.x, viewport));

            // Create label rectangle
            let labelRect = DataLabelPointPositioner.getLabelRect(textSize, parentPoint, position, offset);

            // Create label diagonal line rectangle
            let diagonalLineParentPoint: LabelParentPoint = {
                point: {
                    x: labelDataPoint.leaderLinePoints[0][0],
                    y: labelDataPoint.leaderLinePoints[0][1] < 0 ? labelDataPoint.leaderLinePoints[1][1] : labelDataPoint.leaderLinePoints[0][1]
                },
                radius: 0,
                validPositions: null
            };
            let diagonalLineRect = DataLabelPointPositioner.getLabelRect(labelDataPoint.linesSize[DonutLabelUtils.DiagonalLineIndex], diagonalLineParentPoint, position, offset);

            // Create label horizontal line rectangle
            let horizontalLineParentPoint: LabelParentPoint = {
                point: {
                    x: labelDataPoint.leaderLinePoints[1][0],
                    y: labelDataPoint.leaderLinePoints[1][1]
                },
                radius: 0,
                validPositions: null
            };
            let horizontalLineRect = DataLabelPointPositioner.getLabelRect(labelDataPoint.linesSize[DonutLabelUtils.HorizontalLineIndex], horizontalLineParentPoint, position, offset);

            if (!labelRect || !diagonalLineRect || !horizontalLineRect)
                return;

            labelRect.left += center.x;
            labelRect.top += center.y;
            let centerForLinesWidth = center.x - labelRect.width / 2;
            diagonalLineRect.left += centerForLinesWidth;
            diagonalLineRect.top += center.y;
            horizontalLineRect.left += centerForLinesWidth;
            horizontalLineRect.top += center.y;

            if (!grid.hasConflict(labelRect) && !grid.hasConflict(diagonalLineRect) && !grid.hasConflict(horizontalLineRect))
                return { textRect: labelRect, diagonalLineRect: diagonalLineRect, horizontalLineRect: horizontalLineRect };
        }

        /**
         * Returns an array of valid positions for hidden and truncated labels.
         * For truncated labels will return positions with more available space. 
         * For hidden labels will return all possible positions by the order we draw labels (clockwise) 
         */
        private getLabelPointPositions(labelPoint: DonutLabelDataPoint, isTruncated: boolean): NewPointLabelPosition[] {
            let parentShape: LabelParentPoint = <LabelParentPoint>labelPoint.parentShape;
            let position = parentShape.validPositions[0];

            if (!isTruncated) {
                return position === NewPointLabelPosition.Left
                    ? [NewPointLabelPosition.AboveLeft, NewPointLabelPosition.BelowLeft]
                    : [NewPointLabelPosition.BelowRight, NewPointLabelPosition.AboveRight];
            }

            if (parentShape.point.y < 0) {
                return position === NewPointLabelPosition.Right
                    ? [NewPointLabelPosition.AboveRight]
                    : [NewPointLabelPosition.AboveLeft];
            }
            else {
                return position === NewPointLabelPosition.Right
                    ? [NewPointLabelPosition.BelowRight]
                    : [NewPointLabelPosition.BelowLeft];
            }
        }

        /**
         * Returns a new DonutLabelDataPoint after splitting it into two lines
         */
        private splitDonutDataPoint(labelPoint: DonutLabelDataPoint): DonutLabelDataPoint {
            let textSize: ISize = {
                width: Math.max(labelPoint.categoryLabelSize.width, labelPoint.dataLabelSize.width),
                height: labelPoint.dataLabelSize.height * 2,
            };

            let newLabelPoint: DonutLabelDataPoint = _.clone(labelPoint);
            newLabelPoint.textSize = textSize;
            newLabelPoint.secondRowText = labelPoint.categoryLabel;
            return newLabelPoint;
        }

        private generateCandidateAngleForPosition(d: DonutArcDescriptor, position: NewPointLabelPosition): number {
            let midAngle = d.startAngle + ((d.endAngle - d.startAngle) / 2);

            switch (position) {
                case NewPointLabelPosition.AboveRight:
                case NewPointLabelPosition.BelowLeft:
                    return ((d.startAngle + midAngle) - Math.PI) / 2;
                case NewPointLabelPosition.AboveLeft:
                case NewPointLabelPosition.BelowRight:
                    return ((midAngle + d.endAngle) - Math.PI) / 2;
                default:
                    debug.assertFail("Unsupported label position");
            }
        }

        private getPointPositionForAngle(angle: number): LabelParentPoint {
            // Calculate the new label coordinates
            let labelX = DonutLabelUtils.getXPositionForDonutLabel(Math.cos(angle) * this.outerRadius);
            let labelY = Math.sin(angle) * this.outerRadius;

            let newPosition = labelX < 0 ? NewPointLabelPosition.Left : NewPointLabelPosition.Right;
            let pointPosition: LabelParentPoint = {
                point: {
                    x: labelX,
                    y: labelY,
                },
                validPositions: [newPosition],
                radius: 0,
            };
            return pointPosition;
        }

        private score(labelPoint: DonutLabelDataPoint, point: powerbi.visuals.shapes.IPoint): number {
            let spaceAvailableForLabels = DonutLabelUtils.getSpaceAvailableForDonutLabels(point.x, this.donutChartProperties.viewport);
            let textWidth: number;

            // Check if we show category and data labels in one row
            if (this.donutChartProperties.dataLabelsSettings.labelStyle === labelStyle.both && labelPoint.secondRowText == null) {
                // Each of the labels gets half of the available space for labels so we take this into consideration in the score
                textWidth = Math.max(labelPoint.categoryLabelSize.width, labelPoint.dataLabelSize.width + this.additionalCharsWidth);
                spaceAvailableForLabels /= 2;
            }
            else {
                textWidth = labelPoint.textSize.width;
            }

            return Math.max(textWidth - spaceAvailableForLabels, 0);
        }

    }
}
