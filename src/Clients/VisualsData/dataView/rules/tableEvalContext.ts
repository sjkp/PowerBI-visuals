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

module powerbi.data {
    import SQExpr = powerbi.data.SQExpr;

    export interface ITableEvalContext extends IEvalContext {
        setCurrentRowIndex(index: number): void;
    }

    export function createTableEvalContext(colorAllocatorProvider: IColorAllocatorCache, dataViewTable: DataViewTable, selectTransforms: DataViewSelectTransform[]): ITableEvalContext {
        return new TableEvalContext(colorAllocatorProvider, dataViewTable, selectTransforms);
    }

    class TableEvalContext implements ITableEvalContext {
        private colorAllocatorProvider: IColorAllocatorCache;
        private dataView: DataViewTable;
        private rowIdx: number;
        private selectTransforms: DataViewSelectTransform[];

        constructor(colorAllocatorProvider: IColorAllocatorCache, dataView: DataViewTable, selectTransforms: DataViewSelectTransform[]) {
            debug.assertValue(colorAllocatorProvider, 'colorAllocatorProvider');
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(selectTransforms, 'selectTransforms');

            this.colorAllocatorProvider = colorAllocatorProvider;
            this.dataView = dataView;
            this.selectTransforms = selectTransforms;
        }

        public getColorAllocator(expr: SQFillRuleExpr): IColorAllocator {
            return this.colorAllocatorProvider.get(expr);
        }

        public getExprValue(expr: SQExpr): PrimitiveValue {
            debug.assertValue(expr, 'expr');

            let rowIdx = this.rowIdx;
            if (rowIdx == null)
                return;

            return getExprValueFromTable(expr, this.selectTransforms, this.dataView, rowIdx);
        }

        public getRoleValue(roleName: string): PrimitiveValue {
            return;
        }

        public setCurrentRowIndex(index: number): void {
            debug.assertValue(index, 'index');

            this.rowIdx = index;
        }
    }
}