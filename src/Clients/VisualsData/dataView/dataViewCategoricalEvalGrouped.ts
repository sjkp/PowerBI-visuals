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

module powerbi.data {
    import inheritSingle = powerbi.Prototype.inheritSingle;
    
    /** Responsible for evaluating and setting DataViewCategorical's values grouped() function. */
    export module DataViewCategoricalEvalGrouped {
        export function apply(categorical: DataViewCategorical): void {
            debug.assertValue(categorical, 'categorical');
            
            let valueColumns = categorical.values;
            if (!valueColumns)
                return;

            let isDynamicSeries = !!valueColumns.source;

            // Dynamic or not, always update the return values of grouped() to have the rewritten 'source' property
            let seriesGroups: DataViewValueColumnGroup[];
            if (isDynamicSeries) {
                // We have a dynamic series, so update the return value of grouped() to have the DataViewValueColumn objects with rewritten 'source'.
                // Also, exclude any column that belongs to a static series.
                seriesGroups = inheritSingle(valueColumns.grouped());
                
                let nextSeriesGroupIndex = 0;
                let currentSeriesGroup: DataViewValueColumnGroup;
                for (let i = 0, ilen = valueColumns.length; i < ilen; i++) {
                    let currentValueColumn = valueColumns[i];
                    if (!currentSeriesGroup || (currentValueColumn.identity !== currentSeriesGroup.identity)) {
                        let existingSeriesGroup = seriesGroups[nextSeriesGroupIndex];
                        if (existingSeriesGroup) {
                            currentSeriesGroup = inheritSingle(existingSeriesGroup);
                        }
                        else {
                            debug.assert(!currentValueColumn.identity, '!currentValueColumn.identity -- Extra valueGroup items should be statics (no identity).');
                            currentSeriesGroup = existingSeriesGroup = seriesGroups[nextSeriesGroupIndex] = { values: null };
                        }
                        
                        seriesGroups[nextSeriesGroupIndex] = currentSeriesGroup;
                        currentSeriesGroup.values = [];
                        nextSeriesGroupIndex++;
                        debug.assert(currentValueColumn.identity === currentSeriesGroup.identity, 'expecting the value columns are sequenced by series groups');
                    }
                    currentSeriesGroup.values.push(currentValueColumn);
                }
            }
            else {
                // We are in a static series, so we should throw away the grouped and recreate it using the static values
                //   which have already been filtered
                seriesGroups = [{ values: valueColumns }];
            }

            valueColumns.grouped = () => seriesGroups;
            categorical.values = valueColumns;
        }
    }   
}
