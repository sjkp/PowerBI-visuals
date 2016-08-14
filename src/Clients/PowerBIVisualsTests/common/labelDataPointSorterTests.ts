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

module powerbitests {
    import LabelDataPointGroup = powerbi.LabelDataPointGroup;
    import MinMaxLabelDataPointSorter = powerbi.visuals.MinMaxLabelDataPointSorter;
    import MinMaxLabelDataPointSorterOptions = powerbi.visuals.MinMaxLabelDataPointSorterOptions;
    import Viewport = powerbi.IViewport;

    function createLabelDataPointSorterOptions(values: number[][], viewport: Viewport, maxNumberOfLabels: number): MinMaxLabelDataPointSorterOptions {
        let labelDataPointGroups: LabelDataPointGroup[] = [];
        let series: powerbi.visuals.CartesianSeries[] = [];
        let seriesIndex;
        let seriesCount;
        for (seriesIndex = 0, seriesCount = values.length; seriesIndex < seriesCount; seriesIndex++) {
            labelDataPointGroups.push({
                labelDataPoints: _.map(values[seriesIndex], (value, index) => <any>{ text: values[seriesIndex][index].toString() }),
                maxNumberOfLabels: maxNumberOfLabels,
            });
            series.push(<any>{
                data: _.map(values[seriesIndex], (value) => {
                    return { value: value };
                })
            });
        }
        return <MinMaxLabelDataPointSorterOptions> {
            unsortedLabelDataPointGroups: labelDataPointGroups,
            series: series,
            yAxisProperties: {
                scale: (value) => -value,
            },
            viewport: viewport,
        };
    }

    describe('LabelDataPointSorter', () => {
        let defaultViewport: Viewport = {
            width: 500,
            height: 500,
        };

        it('Max and min at edge', () => {
            let unsorted = createLabelDataPointSorterOptions([[0, 1, 2, 3, 4, 5, 6, 7, 8]], defaultViewport, 10);
            let sorter = new MinMaxLabelDataPointSorter(unsorted);
            let sorted = sorter.getSortedDataLabels();
            expect(_.map(sorted[0].labelDataPoints, (labelDataPoint) => labelDataPoint.text)).toEqual(['0', '8', '4', '2', '6', '1', '3', '5', '7']);
        });

        it('Max in middle', () => {
            let unsorted = createLabelDataPointSorterOptions([[0, 1, 2, 3, 4, 8, 7, 6, 5]], defaultViewport, 10);
            let sorter = new MinMaxLabelDataPointSorter(unsorted);
            let sorted = sorter.getSortedDataLabels();
            expect(_.map(sorted[0].labelDataPoints, (labelDataPoint) => labelDataPoint.text)).toEqual(['0', '5', '8', '3', '6', '2', '4', '7', '1']);
        });

        it('Min in middle', () => {
            let unsorted = createLabelDataPointSorterOptions([[0, -1, -2, -3, -4, -8, -7, -6, -5]], defaultViewport, 10);
            let sorter = new MinMaxLabelDataPointSorter(unsorted);
            let sorted = sorter.getSortedDataLabels();
            expect(_.map(sorted[0].labelDataPoints, (labelDataPoint) => labelDataPoint.text)).toEqual(['0', '-5', '-8', '-3', '-6', '-2', '-4', '-7', '-1']);
        });

        it('Several max and mins', () => {
            let unsorted = createLabelDataPointSorterOptions([[1, 5, 0, 7, 4, 8, 3, 6, 2]], defaultViewport, 10);
            let sorter = new MinMaxLabelDataPointSorter(unsorted);
            let sorted = sorter.getSortedDataLabels();
            expect(_.map(sorted[0].labelDataPoints, (labelDataPoint) => labelDataPoint.text)).toEqual(['1', '2', '8', '0', '7', '5', '3', '4', '6']);
        });

        it('All equal', () => {
            let unsorted = createLabelDataPointSorterOptions([[1, 1, 1, 1, 1, 1, 1, 1, 1]], defaultViewport, 10);
            let sorter = new MinMaxLabelDataPointSorter(unsorted);
            let sorted = sorter.getSortedDataLabels();
            expect(_.map(sorted[0].labelDataPoints, (labelDataPoint) => labelDataPoint.text)).toEqual(['1', '1', '1', '1', '1', '1', '1', '1', '1']);
        });
    });
}