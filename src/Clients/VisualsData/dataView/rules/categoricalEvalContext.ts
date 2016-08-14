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
    export interface ICategoricalEvalContext extends IEvalContext {
        setCurrentRowIndex(index: number): void;
    }

    export function createCategoricalEvalContext(colorAllocatorProvider: IColorAllocatorCache, dataViewCategorical: DataViewCategorical, selectTransforms: DataViewSelectTransform[]): ICategoricalEvalContext {
        return new CategoricalEvalContext(colorAllocatorProvider, dataViewCategorical, selectTransforms);
    }

    class CategoricalEvalContext implements ICategoricalEvalContext {
        private colorAllocatorProvider: IColorAllocatorCache;
        private dataView: DataViewCategorical;
        private selectTransforms: DataViewSelectTransform[];
        private columnsByRole: { [name: string]: DataViewCategoricalColumn };
        private index: number;

        constructor(colorAllocatorProvider: IColorAllocatorCache, dataView: DataViewCategorical, selectTransforms: DataViewSelectTransform[]) {
            debug.assertValue(colorAllocatorProvider, 'colorAllocatorProvider');
            debug.assertValue(dataView, 'dataView');
            debug.assertAnyValue(selectTransforms, 'selectTransforms');

            this.colorAllocatorProvider = colorAllocatorProvider;
            this.dataView = dataView;
            this.selectTransforms = selectTransforms;
            this.columnsByRole = {};
        }

        public getColorAllocator(expr: SQFillRuleExpr): IColorAllocator {
            return this.colorAllocatorProvider.get(expr);
        }

        public getExprValue(expr: SQExpr): PrimitiveValue {
            let rowIdx = this.index;
            if (!_.isNumber(rowIdx))
                return;

            let selectTransforms = this.selectTransforms;
            if (!selectTransforms)
                return;
            
            let selectIdx = findSelectIndex(expr, selectTransforms);
            if (selectIdx === -1)
                return;
                
            let dataView = this.dataView;
            let column = findValueColumn(dataView.values, selectIdx);
            if (!column)
                return;
                
            return column.values[rowIdx];
        }

        public getRoleValue(roleName: string): PrimitiveValue {
            let columnsByRole = this.columnsByRole;
            let column = columnsByRole[roleName];
            if (!column)
                column = columnsByRole[roleName] = findRuleInputColumn(this.dataView, roleName);
            
            if (!column)
                return;

            let index = this.index;
            if (index != null)
                return column.values[this.index];
        }

        public setCurrentRowIndex(index: number): void {
            debug.assertValue(index, 'index');

            this.index = index;
        }
    }

    function findRuleInputColumn(dataViewCategorical: DataViewCategorical, inputRole: string): DataViewCategoricalColumn {
        debug.assertValue(dataViewCategorical, 'dataViewCategorical');

        return findRuleInputInColumns(dataViewCategorical.values, inputRole) ||
            findRuleInputInColumns(dataViewCategorical.categories, inputRole);
    }

    function findRuleInputInColumns(columns: DataViewCategoricalColumn[], inputRole: string): DataViewCategoricalColumn {
        debug.assertAnyValue(columns, 'columns');

        if (!columns)
            return;

        for (let column of columns) {
            let roles = column.source.roles;
            if (!roles || !roles[inputRole])
                continue;

            return column;
        }
    }
    
    function findValueColumn(columns: DataViewValueColumn[], selectIdx: number): DataViewCategoricalColumn {
        debug.assertAnyValue(columns, 'columns');
        debug.assertValue(selectIdx, 'selectIdx');
        
        if (!columns)
            return;
            
        for (let column of columns) {
            if (column.identity)
                continue;
            
            if (column.source.index === selectIdx)    
                return column;
        }
    }
}