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

module powerbi.extensibility {
    /**
     * This class is designed to simplify the creation of SelectionId objects
     * It allows chaining to build up an object before calling 'create' to build a SelectionId
     */
    export class SelectionIdBuilder implements ISelectionIdBuilder {
        private dataMap: SelectorForColumn;
        private measure: string;

        public withCategory(categoryColumn: DataViewCategoryColumn, index: number): this{
            if (categoryColumn && categoryColumn.source && categoryColumn.source.queryName && categoryColumn.identity)
                this.ensureDataMap()[categoryColumn.source.queryName] = categoryColumn.identity[index];
            
            return this;
        }

        public withSeries(seriesColumn: DataViewValueColumns, valueColumn: DataViewValueColumn | DataViewValueColumnGroup): this {
            if (seriesColumn && seriesColumn.source && seriesColumn.source.queryName && valueColumn)
                this.ensureDataMap()[seriesColumn.source.queryName] = valueColumn.identity;

            return this;
        }

        public withMeasure(measureId: string): this {
            this.measure = measureId;

            return this;
        }

        public createSelectionId(): ISelectionId {
            return visuals.SelectionId.createWithSelectorForColumnAndMeasure(this.ensureDataMap(), this.measure);
        }

        private ensureDataMap(): SelectorForColumn {
            if (!this.dataMap)
                this.dataMap = {};

            return this.dataMap;
        }
    }
}
