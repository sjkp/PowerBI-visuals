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

/// <reference path="../../_references.ts"/>

module powerbitests.customVisuals.sampleDataViews {
    import ValueType = powerbi.ValueType;

    export class PulseChartData extends DataViewBuilder {
        public static ColumnTimestamp: string = "Timestamp";
        public static ColumnValue: string = "Value";
        public static ColumnEventTitle: string = "Event Title";
        public static ColumnEventDescription: string = "Event Description";

        public valuesTimestamp = helpers.getRandomUniqueSortedDates(100, new Date(2014,0,1), new Date(2015,5,10));
        public valuesValue: number[] = helpers.getRandomNumbers(this.valuesTimestamp.length, 100, 1000);
        public valuesEvents: powerbi.visuals.samples.PulseChartTooltipData[] = this.generateEvents(this.valuesValue.length, 5);

        public getDataView(columnNames?: string[]): powerbi.DataView {
            return this.createCategoricalDataViewBuilder([
                {
                    source: {
                        displayName: PulseChartData.ColumnTimestamp,
                        format: "%M/%d/yyyy",
                        type: ValueType.fromDescriptor({ dateTime: true }),
                        roles: { Timestamp: true }
                    },
                    values: this.valuesTimestamp
                },
                {
                    source: {
                        displayName: PulseChartData.ColumnEventTitle,
                        type: ValueType.fromDescriptor({ text: true }),
                        roles: { EventTitle: true }
                    },
                    values: this.valuesEvents.map(x => x && x.title)
                },
                {
                    source: {
                        displayName: PulseChartData.ColumnEventDescription,
                        type: ValueType.fromDescriptor({ text: true }),
                        roles: { EventDescription: true }
                    },
                    values: this.valuesEvents.map(x => x && x.description)
                }
                ],[
                {
                    source: {
                        displayName: PulseChartData.ColumnValue,
                        type: ValueType.fromDescriptor({ integer: true }),
                        roles: { Value: true }
                    },
                    values: this.valuesValue
                }
                ], columnNames).build();
        }

        private generateEvents(valuesCount: number, eventCount: number): powerbi.visuals.samples.PulseChartTooltipData[] {
            let startIndex = valuesCount/eventCount;
            let eventIndexesSpace = (valuesCount - startIndex) / eventCount;
            let eventIndexes = d3.range(eventCount).map(x => startIndex + x * eventIndexesSpace);
            let events = d3.range(valuesCount).map(x =>
                eventIndexes.some(index => index === x)
                ? <powerbi.visuals.samples.PulseChartTooltipData> {
                      title: helpers.getRandomWord(6, 12),
                      description:  helpers.getRandomText(20, 4, 12)
                  }
                : null);

            return events;
        }
    }
}
