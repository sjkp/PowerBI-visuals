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
    export interface MinMaxLabelDataPointSorterOptions {
        unsortedLabelDataPointGroups: LabelDataPointGroup[];
        series: CartesianSeries[];
        yAxisProperties: IAxisProperties;
        viewport: IViewport;
    }

    interface WeightCalculationResult {
        weightedLabelDataPoints: WeightedLabelDataPoint[];
        minIndex: number;
        maxIndex: number;
    }

    interface WeightedLabelDataPoint extends LabelDataPoint {
        weight?: number; // A weighting used for sorting mins and maxes (details in the weight calculation function)
    }

    /**
     * Interface used to track non-min/max groups of labels so that they can be
     * sliced up without allocating many extra arrays
     */
    interface NonMinMaxSet {
        startingIndex: number;
        count: number;
    }

    enum MinMaxType {
        Minimum,
        Maximum,
        Neither,
    }

    interface MinMaxInRange {
        minIndex: number;
        minValue: number;
        maxIndex: number;
        maxValue: number;
    }

    interface MinMaxPoint {
        index: number;
        type: MinMaxType;
        value: number;
        weight?: number;
    }

    export class MinMaxLabelDataPointSorter {
        private unsortedLabelDataPointGroups: LabelDataPointGroup[];
        private series: CartesianSeries[];
        private yScale: D3.Scale.GenericScale<any>;
        private viewport: IViewport;
        
        /** A rough estimate for how wide labels are for purposes of calculating density, window size, etc. */
        public static estimatedLabelWidth = 40;

        private static minimumWeightToConsiderMinMax = 0.015;
        private static maxNumberToSortFactor = 2; // Once we've sorted first/last/min/max and local max/mins, we limit ourselves to twice the maximum number of labels to render

        constructor(options: MinMaxLabelDataPointSorterOptions) {
            this.unsortedLabelDataPointGroups = options.unsortedLabelDataPointGroups;
            this.series = options.series;
            this.yScale = options.yAxisProperties.scale;
            this.viewport = options.viewport;
        }

        public getSortedDataLabels(): LabelDataPointGroup[] {
            let unsortedLabelDataPointGroups = this.unsortedLabelDataPointGroups;
            let sortedLabelDataPointGroups: LabelDataPointGroup[] = [];

            for (let seriesIndex = 0, seriesCount = unsortedLabelDataPointGroups.length; seriesIndex < seriesCount; seriesIndex++) {
                let unsortedLabelDataPointGroup = unsortedLabelDataPointGroups[seriesIndex];
                let numberOfLabelsToSort = MinMaxLabelDataPointSorter.maxNumberToSortFactor * unsortedLabelDataPointGroup.maxNumberOfLabels;
                if (_.isEmpty(unsortedLabelDataPointGroup.labelDataPoints))
                    continue;
                let unsortedLabelDataPoints: LabelDataPoint[] = unsortedLabelDataPointGroup.labelDataPoints;
                let sortedLabelDataPoints: WeightedLabelDataPoint[] = [];
                let data = _.filter(this.series[seriesIndex].data, (dataPoint: CartesianDataPoint) => dataPoint.value != null);
                
                // Iterate over the data points to find the min and max index and values
                let globalMinMaxInRange = MinMaxLabelDataPointSorter.getMinMaxInRange(0, data.length - 1, data);

                // Add first, last, max, and min
                let numberOfLabelsAdded = this.addFirstLastMaxMin(unsortedLabelDataPoints, sortedLabelDataPoints, globalMinMaxInRange.maxIndex, globalMinMaxInRange.minIndex);

                let unsortedWeightedLabelDataPoints: WeightedLabelDataPoint[];
                // If we have enough labels added, don't bother adding local min/maxes
                if (!(numberOfLabelsAdded >= numberOfLabelsToSort)) {
                    // Prepare the data to calculate weights and find global min/max
                    unsortedWeightedLabelDataPoints = this.calculateWeights(unsortedLabelDataPoints, data, numberOfLabelsToSort, globalMinMaxInRange);
                    // Add all mins and maxes, sorted by weight (skipping first/last/min/max)
                    let maximumnMinMaxesToAdd = Math.max(numberOfLabelsToSort - numberOfLabelsAdded, 0);
                    numberOfLabelsAdded += this.addLocalMinMaxes(unsortedWeightedLabelDataPoints, sortedLabelDataPoints, globalMinMaxInRange.maxIndex, globalMinMaxInRange.minIndex, maximumnMinMaxesToAdd);
                }

                // If we have enough labels added, don't bother adding non-min/maxes
                if (!(numberOfLabelsAdded >= numberOfLabelsToSort)) {
                    // Split the remaining array and add labels at the mid point of the largest sections until all labels
                    //   are added or we've added maxNumber
                    let maximumNonMinMaxesToAdd = Math.max(numberOfLabelsToSort - numberOfLabelsAdded, 0);
                    this.addNonMinMaxes(unsortedWeightedLabelDataPoints, sortedLabelDataPoints, maximumNonMinMaxesToAdd);
                }

                sortedLabelDataPointGroups.push({ labelDataPoints: sortedLabelDataPoints, maxNumberOfLabels: unsortedLabelDataPointGroup.maxNumberOfLabels });
            }

            return sortedLabelDataPointGroups;
        }

        /**
         * The weight for each min/max is made up of four values, which are averaged into 
         * a single weight.  You have a weight based on the value difference for both the
         * left and right side and a weight for the index difference for both left and
         * right.  These values are normalized as such:
         *
         * valueWeight = abs(scaledValueDifference / totalScaledValueDifference)
         * indexWeight = abs(indexDifference / categoryCount)
         *
         * Since we don't care about the direction of these change, we take the absolute
         * value for both.  We use scaled coordinates for the valueWeight because this
         * will more accurately represent what the user sees (consider a log scale; small
         * visual changes at the top would otherwise trump large visual changes at the
         * bottom of the axis)
         *
         * In code, the averaging is done by averaging together the "current" value and
         * index weights and then assigning it to the current dataPoint.  Then, when the
         * "next" data point's weight is calculated, that weight (with respect to "current")
         * is then averaged with the weight originally assigned.  Data points next to nulls
         * or on the edge of the visual only have a weight associated with the one side that
         * is non-null.
         *
         * Also note that weights are only calculated for minimums and maximums.
         *
         * @param labelDataPoints The labelDataPoints to apply the weighting to
         */
        private calculateWeights(labelDataPoints: LabelDataPoint[], data: CartesianDataPoint[], numberOfLabelsToSort: number, globalMinMax: MinMaxInRange): WeightedLabelDataPoint[] {
            let previousMinMaxPoint: MinMaxPoint;
            let currentMinMaxPoint: MinMaxPoint;
            let categoryCount = data.length;
            let yScale = this.yScale;

            // Obtain all maximums and minimums
            let minMaxPoints = this.findMinMaxesBasedOnSmoothedValues(labelDataPoints, data);

            // Iterate over the mins/maxes, calcuating the weight as you go.  "Current" weight is calcuated with
            //   regard to previous, which is used for the "current" data point's left weight and the "previous"
            //   data point's right weight.
            let totalValueDifference = Math.abs(yScale(globalMinMax.maxValue) - yScale(globalMinMax.minValue));
            for (let minMaxIndex = 0, minMaxCount = minMaxPoints.length; minMaxIndex < minMaxCount; minMaxIndex++) {
                currentMinMaxPoint = minMaxPoints[minMaxIndex];
                let weight: number;
                if (previousMinMaxPoint) {
                    let valueWeight = Math.abs((yScale(previousMinMaxPoint.value) - yScale(currentMinMaxPoint.value)) / totalValueDifference);
                    let indexWeight = Math.abs((previousMinMaxPoint.index - currentMinMaxPoint.index)) / (categoryCount - 1);
                    weight = (valueWeight + indexWeight) / 2;
                } // Note: if there is no previous data point, do not calculate a weight because there is no left weight
                if (weight != null && previousMinMaxPoint) {
                    let previousLabelDataPoint = labelDataPoints[previousMinMaxPoint.index];
                    if (previousLabelDataPoint.weight != null) {
                        // Previous has a left weight; average that with this weight which provides the right weight
                        previousLabelDataPoint.weight = (previousLabelDataPoint.weight + weight) / 2;
                    }
                    else {
                        // Previous has no left weight because it's the first of a line segment; just use the right weight
                        previousLabelDataPoint.weight = weight;
                    }
                    // Current's left weight is set
                    labelDataPoints[currentMinMaxPoint.index].weight = weight;
                } // Current's right weight will be applied by the next iteration unless it has none
                previousMinMaxPoint = currentMinMaxPoint;
            }

            // Cull min/maxes that are extremely low weight.
            for (let labelDataPoint of labelDataPoints) {
                if (labelDataPoint.weight < MinMaxLabelDataPointSorter.minimumWeightToConsiderMinMax) {
                    labelDataPoint.weight = undefined;
                }
            }

            return labelDataPoints;
        }

        private findMinMaxesBasedOnSmoothedValues(labelDataPoints: LabelDataPoint[], data: CartesianDataPoint[]): MinMaxPoint[] {
            let minMaxPoints: MinMaxPoint[] = [];
            
            let windowSize = this.getWindowSize(data);
            let halfWindowSize = Math.floor(windowSize / 2);
            let scaledSmoothedValues = this.calculateSmoothedValues(data, windowSize);

            // Find mins and maxes based on the scaled and smooth values
            for (let categoryIndex = 0, categoryCount = labelDataPoints.length; categoryIndex < categoryCount; categoryIndex++) {
                let minMaxType = this.getMinMaxType(categoryIndex, scaledSmoothedValues);
                if (minMaxType === MinMaxType.Neither)
                    continue;
                let currentMinMaxPoint: MinMaxPoint = {
                    index: categoryIndex,
                    type: minMaxType,
                    value: data[categoryIndex].value,
                };
                minMaxPoints.push(currentMinMaxPoint);
            }

            // Adjust mins and maxes to be the actual mins/maxes based on the data, because the min/max of the smoothed values
            //   may not be the actual min max in the data within the window, and we want to apply the weight to the actual min/max
            let previousMinMax: MinMaxPoint;
            let currentMinMax: MinMaxPoint;
            let nextMinMax: MinMaxPoint;
            for (let minMaxIndex = 0, minMaxCount = minMaxPoints.length; minMaxIndex < minMaxCount; minMaxIndex++) {
                previousMinMax = minMaxPoints[minMaxIndex - 1];
                currentMinMax = minMaxPoints[minMaxIndex];
                nextMinMax = minMaxPoints[minMaxIndex + 1];
                if (!previousMinMax || !nextMinMax)
                    continue;
                let actualMinMaxInRange = MinMaxLabelDataPointSorter.getMinMaxInRange(Math.max(previousMinMax.index, currentMinMax.index - halfWindowSize), Math.min(nextMinMax.index, currentMinMax.index + halfWindowSize), data);
                if (currentMinMax.type === MinMaxType.Maximum) {
                    let actualIndex = actualMinMaxInRange.maxIndex;
                    currentMinMax.index = actualIndex;
                    currentMinMax.value = data[actualIndex].value;
                }
                else {
                    let actualIndex = actualMinMaxInRange.minIndex;
                    currentMinMax.index = actualIndex;
                    currentMinMax.value = data[actualIndex].value;
                }
            }
            
            return minMaxPoints;
        }

        private static getMinMaxInRange(startIndex: number, endIndex: number, data: CartesianDataPoint[]): MinMaxInRange {
            let minValue: number;
            let maxValue: number;
            let minIndex: number;
            let maxIndex: number;

            // Iterate over the data points to find the min and max index and values
            for (let categoryIndex = startIndex, dataLength = data.length; categoryIndex <= endIndex && categoryIndex < dataLength; categoryIndex++) {
                let value = data[categoryIndex].value;
                if (value == null)
                    continue;
                if (minValue === undefined || value < minValue) {
                    minValue = value;
                    minIndex = categoryIndex;
                }
                if (maxValue === undefined || value > maxValue) {
                    maxValue = value;
                    maxIndex = categoryIndex;
                }
            }
            return {
                minIndex: minIndex,
                minValue: minValue,
                maxIndex: maxIndex,
                maxValue: maxValue,
            };
        }

        private getWindowSize(data: CartesianDataPoint[]): number {
            let idealSize = (data.length / this.viewport.width) * MinMaxLabelDataPointSorter.estimatedLabelWidth;
            let actualsize = Math.floor(idealSize / 2) * 2 + 1; // Force the window size to be a nearby odd number
            return actualsize;
        }

        private calculateSmoothedValues(data: CartesianDataPoint[], windowSize: number): number[] {
            let gaussianValues: number[] = MinMaxLabelDataPointSorter.getGaussianDistribution(windowSize);
            let scaledAndSmoothedValues: number[] = [];

            for (let categoryIndex = 0, categoryCount = data.length; categoryIndex < categoryCount; categoryIndex++) {
                if (windowSize === 1) {
                    scaledAndSmoothedValues.push(data[categoryIndex].value);
                }
                else {
                    let scaledValue = this.getSmoothedValue(data, categoryIndex, windowSize, gaussianValues);
                    scaledAndSmoothedValues.push(scaledValue);
                }
            }

            return scaledAndSmoothedValues;
        }

        private static getGaussianDistribution(windowSize: number): number[] {
            debug.assert(windowSize / 2 !== Math.floor(windowSize / 2), "window size should be a whole odd number");
            let gaussianDistribution: number[] = [];
            let halfWayIndex = Math.floor(windowSize / 2); // Value at which, value should be 1.
            // Standard gaussian equation:
            //   y = a * e ^ -((x-b)^2 / (2c^2))
            //   height: 1 (height at the maximum)
            //   maxPosition: 1 (position of maximum)
            //   standardDeviation: 0.5 (standard deviation; this ratio places the edge of the window around 0.1)
            let height = 1;
            let maxPosition = halfWayIndex;
            let standardDeviation = halfWayIndex / 2;
            for (let i = 0; i < halfWayIndex; i++) {
                let gaussianValue = height * Math.pow(Math.E, (-1 * ((i - maxPosition) * (i - maxPosition)) / (2 * standardDeviation * standardDeviation)));
                gaussianDistribution.push(gaussianValue);
            }
            gaussianDistribution.push(1); // Add the maximum, which should always be 1
            for (let i = halfWayIndex - 1; i >= 0; i--) { // Invert the left side of the curve to create the right side.
                gaussianDistribution.push(gaussianDistribution[i]);
            }
            return gaussianDistribution;
        }

        private getSmoothedValue(data: CartesianDataPoint[], categoryIndex: number, windowSize: number, gaussianValues: number[]): number {
            if (data[categoryIndex].value == null)
                return data[categoryIndex].value;
            let halfWindowSize = Math.floor(windowSize / 2);
            let startingIndex = categoryIndex - halfWindowSize;
            let endingIndex = categoryIndex + halfWindowSize;
            let totalValue = 0;
            let totalValueCount = 0;
            let lastDataIndex = data.length - 1;

            for (let currentIndex = startingIndex, gaussianIndex = 0; currentIndex <= endingIndex; currentIndex++ , gaussianIndex++) {
                let valueIndex = Math.max(0, Math.min(currentIndex, lastDataIndex));
                let value = data[valueIndex].value;
                if (value != null) {
                    totalValue += value * gaussianValues[gaussianIndex];
                    totalValueCount++;
                }
            }

            return totalValue / totalValueCount;
        }

        private addFirstLastMaxMin(unsorted: WeightedLabelDataPoint[], sorted: WeightedLabelDataPoint[], maxIndex: number, minIndex: number): number {
            let labelsAdded = 0;
            // Don't add anything if unsorted is empty
            if (_.isEmpty(unsorted))
                return labelsAdded;
            // Push first
            sorted.push(unsorted[0]);
            labelsAdded++;
            // Push last only last != first
            let lastIndex = unsorted.length - 1;
            if (lastIndex !== 0) {
                sorted.push(unsorted[lastIndex]);
                labelsAdded++;
            }
            // Push max if it is neither first nor last
            if (maxIndex !== 0 && maxIndex !== lastIndex) {
                sorted.push(unsorted[maxIndex]);
                labelsAdded++;
            }
            // Push min if it is neither first nor last
            if (minIndex !== 0 && minIndex !== lastIndex) {
                sorted.push(unsorted[minIndex]);
                labelsAdded++;
            }
            return labelsAdded;
        }

        private addLocalMinMaxes(unsorted: WeightedLabelDataPoint[], sorted: WeightedLabelDataPoint[], maxIndex: number, minIndex: number, maxNumberOfLabels: number): number {
            let lastIndex = unsorted.length - 1;
            // Obtain all local min/maxes; all min/maxes should have weights now and we filter out first/last/max/min
            let localMinMaxes = _.filter(unsorted, (labelDataPoint, index) => {
                if (index === 0 || index === lastIndex || index === maxIndex || index === minIndex) {
                    return false;
                }
                return labelDataPoint.weight != null;
            });
            let sortedMinMaxes = _.sortBy(localMinMaxes, (weighedLabelDataPoint) => {
                return -weighedLabelDataPoint.weight; // Return weight as a negative since _.sortBy sorts ascending, and we want descending
            });
            let labelsAdded = 0;
            // Add labels until you run out of max/mins or you've sorted enough labels
            for (let i = 0, ilen = Math.min(sortedMinMaxes.length, maxNumberOfLabels); i < ilen; i++) {
                sorted.push(sortedMinMaxes[i]);
                labelsAdded++;
            }
            return labelsAdded;
        }

        private addNonMinMaxes(unsorted: WeightedLabelDataPoint[], sorted: WeightedLabelDataPoint[], maxNumberOfLabels: number): void {
            // First construct sets of non-min/maxes by iterating over the unsorted data points.
            let nonMinMaxSets: NonMinMaxSet[] = [];
            let currentNonMinMaxSet: NonMinMaxSet;
            for (let categoryIndex = 0, categoryCount = unsorted.length; categoryIndex < categoryCount; categoryIndex++) {
                if (unsorted[categoryIndex].weight != null) {
                    // If the current data point is a min/max, we add the old NonMinMaxSet to the array, reset it so that
                    //   a new one will be constructed, and then continue
                    if (currentNonMinMaxSet && currentNonMinMaxSet.count > 0) {
                        nonMinMaxSets.push(currentNonMinMaxSet);
                        currentNonMinMaxSet = null;
                    }
                    continue;
                }
                if (!currentNonMinMaxSet) {
                    // If the previous data point was a min/max and this one isn't, set up a new NonMinMaxSet
                    currentNonMinMaxSet = {
                        startingIndex: categoryIndex,
                        count: 1,
                    };
                }
                else {
                    // Otherwise, we're just "adding" another non-min/max point to the set, so increase count.
                    currentNonMinMaxSet.count++;
                }
            }

            let numberOfLabelsAdded = 0;
            while (nonMinMaxSets.length > 0 && numberOfLabelsAdded < maxNumberOfLabels) {
                // Find the index of the largest set
                let currentMaxCount = 0;
                let maxIndex = 0;
                for (let i = 0, ilen = nonMinMaxSets.length; i < ilen; i++) {
                    let currentCount = nonMinMaxSets[i].count;
                    if (currentCount > currentMaxCount) {
                        currentMaxCount = currentCount;
                        maxIndex = i;
                    }
                }
                let setToSplit = nonMinMaxSets.splice(maxIndex, 1)[0];
                if (setToSplit.count === 1) {
                    sorted.push(unsorted[setToSplit.startingIndex]);
                }
                else {
                    let splitIndex = Math.floor(setToSplit.count / 2) + setToSplit.startingIndex;
                    // Split the array in two, putting the split point into sorted, and creating two new sets by splitting the old set
                    sorted.push(unsorted[splitIndex]);
                    let leftCount = splitIndex - setToSplit.startingIndex;
                    if (leftCount > 0) {
                        nonMinMaxSets.push({
                            startingIndex: setToSplit.startingIndex,
                            count: leftCount,
                        });
                    }
                    let rightCount = setToSplit.startingIndex + setToSplit.count - splitIndex - 1;
                    if (rightCount > 0) {
                        nonMinMaxSets.push({
                            startingIndex: splitIndex + 1,
                            count: rightCount,
                        });
                    }
                }
                numberOfLabelsAdded++;
            }
        }

        private getMinMaxType(index: number, scaledDataPoints: number[]): MinMaxType {
            let currentValue = scaledDataPoints[index];
            // Check to see if the point's value is null; these are not considered min/maxes
            if (scaledDataPoints[index] == null)
                return MinMaxType.Neither;
            // If the array is of length one, return neither to exit early
            if (scaledDataPoints.length < 2)
                return MinMaxType.Neither;

            // Check for cases at the very edge of the array
            if (scaledDataPoints[index - 1] == null) {
                return scaledDataPoints[index + 1] > currentValue ? MinMaxType.Minimum : MinMaxType.Maximum;
            }
            if (scaledDataPoints[index + 1] == null) {
                return scaledDataPoints[index - 1] > currentValue ? MinMaxType.Minimum : MinMaxType.Maximum;
            }

            let prevValue = scaledDataPoints[index - 1];
            let nextValue = scaledDataPoints[index + 1];
            // Check for cases next to nulls
            if (prevValue == null && nextValue == null) {
                return MinMaxType.Neither;
            }
            if (prevValue == null) {
                return nextValue > currentValue ? MinMaxType.Minimum : MinMaxType.Maximum;
            }
            if (nextValue == null) {
                return prevValue > currentValue ? MinMaxType.Minimum : MinMaxType.Maximum;
            }

            // Check for typical min/maxes
            if (prevValue > currentValue && currentValue < nextValue) {
                return MinMaxType.Minimum;
            }
            if (prevValue < currentValue && currentValue > nextValue) {
                return MinMaxType.Maximum;
            }

            return MinMaxType.Neither;
        }
    }
}