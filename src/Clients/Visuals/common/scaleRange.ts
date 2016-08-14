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
    const defaultMaxValue: number = 100;

    export interface IScaledRange<T> {
        // initial data type
        getValue(): ValueRange<T>;
        setValue(value: ValueRange<T>);

        // scaled to 0..100 number.
        setScaledValue(value: ValueRange<number>);
        getScaledValue(): ValueRange<number>;
    }

    /**
     * Implements IRange interface for the Date type. 
     */
    export class DateRange implements IScaledRange<Date> {
        private value: ValueRange<Date>;
        private scaledValue: ValueRange<number>;
        private scale: D3.Scale.TimeScale;

        constructor(min: Date, max: Date, start?: Date, end?: Date) {
            debug.assert(max > min, "Requires max date to be bigger than min date.");
            debug.assert((!start || start >= min) && (!end || end <= max), "Specified date is out of boundaries");
            let interval = <any>d3.time.day;

            this.scale = d3.time.scale()
                .domain([min, max])
                .range([0, defaultMaxValue])
                .nice(interval);

            this.value = {
                min: start || min,
                max: end || max
            };
            this.setValue(this.value);
        }

        public getScaledValue(): ValueRange<number> {
            return this.scaledValue;
        }

        public setValue(original: ValueRange<Date>): void {
            debug.assert(original != null, "Value can't be null");
            debug.assert(original.min != null, "Min can't be null");
            debug.assert(original.max != null, "Max can't be null");

            this.value = original;

            this.scaledValue = {
                min: this.scale(original.min),
                max: this.scale(original.max)
            };

        }

        public getValue(): ValueRange<Date> {
            return this.value;
        }

        /**
         * Updates scaled value. 
         * Value should in range [0 .. 100].
         */
        public setScaledValue(value: ValueRange<number>): void {
            debug.assert(value.min <= 100 && value.min >= 0 &&
                value.max >= 0 && value.max <= 100 && value.max >= value.min, "Value is out of range");

            this.scaledValue = value;

            this.value = {
                min: this.scale.invert(value.min),
                max: this.scale.invert(value.max)
            };
        }
    }
}