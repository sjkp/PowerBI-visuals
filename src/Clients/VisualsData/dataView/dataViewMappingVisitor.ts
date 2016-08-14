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
    export const enum RoleItemContext {
        CategoricalValue,
        CategoricalValueGroup,
    }

    export interface IDataViewMappingVisitor {
        visitRole(role: string, context?: RoleItemContext): void;
        visitReduction?(reductionAlgorithm?: ReductionAlgorithm): void;
    }

    export module DataViewMapping {
        export function visitMapping(mapping: DataViewMapping, visitor: IDataViewMappingVisitor): void {
            debug.assertValue(mapping, 'mapping');
            debug.assertValue(visitor, 'visitor');

            let categorical = mapping.categorical;
            if (categorical)
                visitCategorical(categorical, visitor);

            let table = mapping.table;
            if (table)
                visitTable(table, visitor);

            let matrix = mapping.matrix;
            if (matrix)
                visitMatrix(matrix, visitor);

            let tree = mapping.tree;
            if (tree)
                visitTree(tree, visitor);
            
            let single = mapping.single;
            if (single)
                visitSingle(single, visitor);
        }

        export function visitCategorical(mapping: DataViewCategoricalMapping, visitor: IDataViewMappingVisitor): void {
            debug.assertValue(mapping, 'mapping');
            debug.assertValue(visitor, 'visitor');

            visitCategoricalCategories(mapping.categories, visitor);

            let values = mapping.values;
            visitCategoricalValues(values, visitor);
            visitGrouped(<DataViewGroupedRoleMapping>values, visitor);
        }

        export function visitCategoricalCategories(mapping: DataViewRoleMappingWithReduction | DataViewListRoleMappingWithReduction, visitor: IDataViewMappingVisitor): void {
            debug.assertAnyValue(mapping, 'mapping');
            debug.assertValue(visitor, 'visitor');

            if (mapping) {
                visitBind(<DataViewRoleBindMapping>mapping, visitor);
                visitFor(<DataViewRoleForMapping>mapping, visitor);
                visitList(<DataViewListRoleMapping>mapping, visitor);

                visitReduction(mapping, visitor);
            }
        }

        export function visitCategoricalValues(mapping: DataViewRoleMapping | DataViewGroupedRoleMapping | DataViewListRoleMapping, visitor: IDataViewMappingVisitor): void {
            debug.assertAnyValue(mapping, 'mapping');
            debug.assertValue(visitor, 'visitor');

            if (mapping) {
                visitBind(<DataViewRoleBindMapping>mapping, visitor, RoleItemContext.CategoricalValue);
                visitFor(<DataViewRoleForMapping>mapping, visitor, RoleItemContext.CategoricalValue);
                visitList(<DataViewListRoleMapping>mapping, visitor, RoleItemContext.CategoricalValue);

                let group = (<DataViewGroupedRoleMapping>mapping).group;
                if (group) {
                    for (let item of group.select) {
                        visitBind(<DataViewRoleBindMapping>item, visitor, RoleItemContext.CategoricalValueGroup);
                        visitFor(<DataViewRoleForMapping>item, visitor, RoleItemContext.CategoricalValueGroup);
                    }
                }
            }
        }

        export function visitTable(mapping: DataViewTableMapping, visitor: IDataViewMappingVisitor): void {
            debug.assertValue(mapping, 'mapping');
            debug.assertValue(visitor, 'visitor');

            let rows = mapping.rows;
            visitBind(<DataViewRoleBindMapping>rows, visitor);
            visitFor(<DataViewRoleForMapping>rows, visitor);
            visitList(<DataViewListRoleMapping>rows, visitor);

            visitReduction(rows, visitor);
        }

        function visitMatrix(mapping: DataViewMatrixMapping, visitor: IDataViewMappingVisitor): void {
            debug.assertValue(mapping, 'mapping');
            debug.assertValue(visitor, 'visitor');

            visitMatrixItems(mapping.rows, visitor);
            visitMatrixItems(mapping.columns, visitor);
            visitMatrixItems(mapping.values, visitor);
        }

        /**
         * For visiting DataViewMatrixMapping.rows, DataViewMatrixMapping.columns, or DataViewMatrixMapping.values.
         *
         * @param mapping Can be one of DataViewMatrixMapping.rows, DataViewMatrixMapping.columns, or DataViewMatrixMapping.values.
         * @param visitor The visitor.
         */
        export function visitMatrixItems(mapping: DataViewRoleForMappingWithReduction | DataViewListRoleMappingWithReduction, visitor: IDataViewMappingVisitor): void {
            debug.assertAnyValue(mapping, 'mapping');
            debug.assertValue(visitor, 'visitor');

            if (mapping) {
                visitFor(<DataViewRoleForMapping>mapping, visitor);
                visitList(<DataViewListRoleMapping>mapping, visitor);

                visitReduction(mapping, visitor);
            }
        }

        function visitTree(mapping: DataViewTreeMapping, visitor: IDataViewMappingVisitor): void {
            debug.assertValue(mapping, 'mapping');
            debug.assertValue(visitor, 'visitor');

            visitTreeNodes(mapping.nodes, visitor);
            visitTreeValues(mapping.values, visitor);
        }

        export function visitTreeNodes(mapping: DataViewRoleForMappingWithReduction, visitor: IDataViewMappingVisitor): void {
            debug.assertAnyValue(mapping, 'mapping');
            debug.assertValue(visitor, 'visitor');

            if (mapping) {
                visitFor(mapping, visitor);

                visitReduction(mapping, visitor);
            }
        }

        export function visitTreeValues(mapping: DataViewRoleForMapping, visitor: IDataViewMappingVisitor): void {
            debug.assertAnyValue(mapping, 'mapping');
            debug.assertValue(visitor, 'visitor');

            if (mapping) {
                visitFor(mapping, visitor);
            }
        }

        function visitBind(mapping: DataViewRoleBindMapping, visitor: IDataViewMappingVisitor, context?: RoleItemContext): void {
            debug.assertValue(mapping, 'mapping');
            debug.assertValue(visitor, 'visitor');

            let bind = mapping.bind;
            if (bind) {
                if (context != null)
                    visitor.visitRole(bind.to, context);
                else
                    visitor.visitRole(bind.to);
            }
        }

        function visitFor(mapping: DataViewRoleForMapping, visitor: IDataViewMappingVisitor, context?: RoleItemContext): void {
            debug.assertValue(mapping, 'mapping');
            debug.assertValue(visitor, 'visitor');

            let forValue = mapping.for;
            if (forValue) {
                if (context != null)
                    visitor.visitRole(forValue.in, context);
                else
                    visitor.visitRole(forValue.in);
            }
        }

        function visitList(mapping: DataViewListRoleMapping, visitor: IDataViewMappingVisitor, context?: RoleItemContext): void {
            debug.assertValue(mapping, 'mapping');
            debug.assertValue(visitor, 'visitor');

            let select = mapping.select;
            if (select) {
                for (let item of select) {
                    visitBind(<DataViewRoleBindMapping>item, visitor, context);
                    visitFor(<DataViewRoleForMapping>item, visitor, context);
                }
            }
        }

        export function visitGrouped(mapping: DataViewGroupedRoleMapping, visitor: IDataViewMappingVisitor): void {
            debug.assertAnyValue(mapping, 'mapping');
            debug.assertValue(visitor, 'visitor');

            if (!mapping)
                return;

            let group = mapping.group;
            if (group) {
                visitor.visitRole(group.by);

                visitReduction(group, visitor);
            }
        }

        function visitReduction(mapping: HasReductionAlgorithm, visitor: IDataViewMappingVisitor): void {
            debug.assertValue(mapping, 'mapping');
            debug.assertValue(visitor, 'visitor');

            if (visitor.visitReduction) {
                let reductionAlgorithm = mapping.dataReductionAlgorithm;
                if (reductionAlgorithm) {
                    visitor.visitReduction(reductionAlgorithm);
                }
            }
        }

        function visitSingle(mapping: DataViewSingleMapping, visitor: IDataViewMappingVisitor): void {
            debug.assertValue(mapping, 'mapping');
            debug.assertValue(visitor, 'visitor');

            visitor.visitRole(mapping.role);
        }
    }
}