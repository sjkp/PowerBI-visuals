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

module powerbi.data {

    export class SemanticQueryRewriter {
        private exprRewriter: ISQExprVisitor<SQExpr>;

        constructor(exprRewriter: ISQExprVisitor<SQExpr>) {
            this.exprRewriter = exprRewriter;
        }

        public rewriteFrom(fromValue: SQFrom): SQFrom {
            let fromContents: { [name: string]: SQFromEntitySource } = {};
            let originalFrom = fromValue,
                originalFromKeys = originalFrom.keys();
            for (let i = 0, len = originalFromKeys.length; i < len; i++) {
                let keyName = originalFromKeys[i],
                    originalSource = originalFrom.source(keyName);
                // Note: Add a visitor when adding the rewrites for subqueries
                if (isSQFromEntitySource(originalSource)) {
                    let originalEntityExpr = SQExprBuilder.entity(originalSource.schema, originalSource.entity, keyName),
                        updatedEntityExpr = <SQEntityExpr>originalEntityExpr.accept(this.exprRewriter);

                    fromContents[keyName] = new SQFromEntitySource(updatedEntityExpr.schema, updatedEntityExpr.entity);
                } else if (isSQFromSubquerySource(originalSource))
                    // Note: Add a visitor when adding the rewrites for subqueries
                    debug.assert(false, "rewrite subqueries");
                else
                    debug.assertFail("unknown source type");
            }
            return new SQFrom(fromContents);
        }

        public rewriteSelect(selectItems: NamedSQExpr[], from: SQFrom): NamedSQExpr[] {
            debug.assertValue(selectItems, 'selectItems');
            debug.assertValue(from, 'from');

            return this.rewriteNamedSQExpressions(selectItems, from);
        }

        public rewriteGroupBy(groupByitems: NamedSQExpr[], from: SQFrom): NamedSQExpr[] {
            debug.assertAnyValue(groupByitems, 'groupByitems');
            debug.assertValue(from, 'from');

            if (_.isEmpty(groupByitems))
                return;

            return this.rewriteNamedSQExpressions(groupByitems, from);
        }

        private rewriteNamedSQExpressions(expressions: NamedSQExpr[], from: SQFrom): NamedSQExpr[] {
            debug.assertValue(expressions, 'expressions');

            return _.map(expressions, item => {
                return {
                    name: item.name,
                    expr: SQExprRewriterWithSourceRenames.rewrite(item.expr.accept(this.exprRewriter), from)
                };
            });
        }

        public rewriteOrderBy(orderByItems: SQSortDefinition[], from: SQFrom): SQSortDefinition[] {
            debug.assertAnyValue(orderByItems, 'orderByItems');
            debug.assertValue(from, 'from');

            if (_.isEmpty(orderByItems))
                return;

            let orderBy: SQSortDefinition[] = [];
            for (let i = 0, len = orderByItems.length; i < len; i++) {
                let item = orderByItems[i],
                    updatedExpr = SQExprRewriterWithSourceRenames.rewrite(item.expr.accept(this.exprRewriter), from);
                orderBy.push({
                    direction: item.direction,
                    expr: updatedExpr,
                });
            }

            return orderBy;
        }

        public rewriteWhere(whereItems: SQFilter[], from: SQFrom): SQFilter[] {
            debug.assertAnyValue(whereItems, 'whereItems');
            debug.assertValue(from, 'from');

            if (_.isEmpty(whereItems))
                return;

            let where: SQFilter[] = [];
            for (let i = 0, len = whereItems.length; i < len; i++) {
                let originalWhere = whereItems[i];

                let updatedWhere: SQFilter = {
                    condition: SQExprRewriterWithSourceRenames.rewrite(originalWhere.condition.accept(this.exprRewriter), from),
                };

                if (originalWhere.target)
                    updatedWhere.target = _.map(originalWhere.target, e => SQExprRewriterWithSourceRenames.rewrite(e.accept(this.exprRewriter), from));

                where.push(updatedWhere);
            }

            return where;
        }

        public rewriteTransform(transformItems: SQTransform[], from: SQFrom): SQTransform[] {
            debug.assertAnyValue(transformItems, 'transformItems');
            debug.assertAnyValue(from, 'from');

            if (_.isEmpty(transformItems))
                return;

            let transforms: SQTransform[] = [];
            for (let transformItem of transformItems) {
                let inputColumns: SQTransformTableColumn[];
                if (transformItem.input.table && !_.isEmpty(transformItem.input.table.columns)) {
                    inputColumns = _.map(transformItem.input.table.columns, c => {
                        return {
                            role: c.role,
                            expression: {
                                name: c.expression.name,
                                expr: SQExprRewriterWithSourceRenames.rewrite(c.expression.expr.accept(this.exprRewriter), from)
                            }
                        };
                    });
                }

                let newTransform: SQTransform = {
                    name: transformItem.name,
                    algorithm: transformItem.algorithm,
                    input: {
                        parameters: transformItem.input.parameters,
                    },
                    output: transformItem.output
                };

                if (transformItem.input.table) {
                    newTransform.input.table = {
                        name: transformItem.input.table.name,
                        columns: inputColumns
                    };
                }

                transforms.push(newTransform);
            }

            return transforms;
        }
    }
} 