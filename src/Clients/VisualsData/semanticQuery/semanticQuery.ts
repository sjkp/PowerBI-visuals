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
    import ArrayExtensions = jsCommon.ArrayExtensions;
    import ArrayNamedItems = jsCommon.ArrayNamedItems;

    export interface NamedSQExpr {
        name: string;
        expr: SQExpr;
    }

    export interface SQFilter {
        target?: SQExpr[];
        condition: SQExpr;
    }

    /** Represents a sort over an expression. */
    export interface SQSortDefinition {
        expr: SQExpr;
        direction: SortDirection;
    }

    export interface QueryFromEnsureEntityResult {
        name: string;
        new?: boolean;
    }

    export interface SQSourceRenames {
        [from: string]: string;
    }

    export interface SQTransform {
        name: string;
        algorithm: string;
        input: SQTransformInput;
        output: SQTransformOutput;
    }

    export interface SQTransformInput {
        parameters: NamedSQExpr[];
        table?: SQTransformTable;
    }

    export interface SQTransformOutput {
        table?: SQTransformTable;
    }

    export interface SQTransformTable {
        name: string;
        columns: SQTransformTableColumn[];
    }

    export interface SQTransformTableColumn {
        role?: string;
        expression: NamedSQExpr;
    }

    /**
     * Represents a semantic query that is:
     * 1) Round-trippable with a JSON QueryDefinition.
     * 2) Immutable
     * 3) Long-lived and does not have strong references to a conceptual model (only names).
     */
    export class SemanticQuery {
        private static empty: SemanticQuery;
        private fromValue: SQFrom;
        private whereItems: SQFilter[];
        private orderByItems: SQSortDefinition[];
        private selectItems: NamedSQExpr[];
        private groupByItems: NamedSQExpr[];
        private transformItems: SQTransform[];

        constructor(from: SQFrom, where: SQFilter[], orderBy: SQSortDefinition[], select: NamedSQExpr[], groupBy: NamedSQExpr[], transformItems: SQTransform[]) {
            debug.assertValue(from, 'from');
            debug.assertValue(select, 'select');

            this.fromValue = from;
            this.whereItems = where;
            this.orderByItems = orderBy;
            this.selectItems = select;
            this.groupByItems = groupBy;
            this.transformItems = transformItems;
        }

        public static create(): SemanticQuery {
            if (!SemanticQuery.empty)
                SemanticQuery.empty = new SemanticQuery(new SQFrom(), null, null, [], null, null);

            return SemanticQuery.empty;
        }

        private static createWithTrimmedFrom(
            from: SQFrom,
            where: SQFilter[],
            transform: SQTransform[],
            orderBy: SQSortDefinition[],
            select: NamedSQExpr[],
            groupBy: NamedSQExpr[]): SemanticQuery {

            let unreferencedKeyFinder = new UnreferencedKeyFinder(from.keys());

            // Where
            if (where) {
                for (let i = 0, len = where.length; i < len; i++) {
                    let filter = where[i];

                    filter.condition.accept(unreferencedKeyFinder);

                    let filterTarget = filter.target;
                    if (filterTarget) {
                        for (let j = 0, jlen = filterTarget.length; j < jlen; j++)
                            if (filterTarget[j])
                                filterTarget[j].accept(unreferencedKeyFinder);
                    }
                }
            }

            // Transform
            if (transform) {
                for (let i = 0, len = transform.length; i < len; i++) {
                    let table = transform[i].input.table;
                    if (!table || _.isEmpty(table.columns))
                        continue;

                    for (let column of table.columns) {
                        column.expression.expr.accept(unreferencedKeyFinder);
                    }
                }
            }

            // OrderBy
            if (orderBy) {
                for (let i = 0, len = orderBy.length; i < len; i++)
                    orderBy[i].expr.accept(unreferencedKeyFinder);
            }

            // Select
            for (let i = 0, len = select.length; i < len; i++)
                select[i].expr.accept(unreferencedKeyFinder);

            // GroupBy
            if (groupBy) {
                for (let i = 0, len = groupBy.length; i < len; i++)
                    groupBy[i].expr.accept(unreferencedKeyFinder);
            }

            let unreferencedKeys = unreferencedKeyFinder.result();
            for (let i = 0, len = unreferencedKeys.length; i < len; i++)
                from.remove(unreferencedKeys[i]);

            return new SemanticQuery(from, where, orderBy, select, groupBy, transform);
        }

        public from(): SQFrom {
            return this.fromValue.clone();
        }

        /** Returns a query equivalent to this, with the specified selected items. */
        select(values: NamedSQExpr[]): SemanticQuery;
        /** Gets the items being selected in this query. */
        select(): ArrayNamedItems<NamedSQExpr>;
        public select(values?: NamedSQExpr[]): any {
            if (_.isEmpty(arguments))
                return this.getSelect();

            return this.setSelect(values);
        }

        private getSelect(): ArrayNamedItems<NamedSQExpr> {
            return SemanticQuery.createNamedExpressionArray(this.selectItems);
        }

        private static createNamedExpressionArray(items: NamedSQExpr[]): ArrayNamedItems<NamedSQExpr> {
            return ArrayExtensions.extendWithName<NamedSQExpr>(_.map(items, s => {
                return {
                    name: s.name,
                    expr: s.expr,
                };
            }));
        }

        private setSelect(values: NamedSQExpr[]): SemanticQuery {
            let from = this.fromValue.clone();
            let selectItems = SemanticQuery.rewriteExpressionsWithSourceRenames(values, from);
            return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, this.transformItems, this.orderByItems, selectItems, this.groupByItems);
        }

        private static rewriteExpressionsWithSourceRenames(values: NamedSQExpr[], from: SQFrom): NamedSQExpr[] {
            let items: NamedSQExpr[] = [];

            for (let i = 0, len = values.length; i < len; i++) {
                let value = values[i];
                items.push({
                    name: value.name,
                    expr: SQExprRewriterWithSourceRenames.rewrite(value.expr, from)
                });
            }

            return items;
        }

        /** Removes the given expression from the select. */
        public removeSelect(expr: SQExpr): SemanticQuery {
            debug.assertValue(expr, 'expr');

            let originalItems = this.selectItems,
                selectItems: NamedSQExpr[] = [];
            for (let i = 0, len = originalItems.length; i < len; i++) {
                let originalExpr = originalItems[i];
                if (SQExpr.equals(originalExpr.expr, expr))
                    continue;

                selectItems.push(originalExpr);
            }

            return SemanticQuery.createWithTrimmedFrom(this.fromValue.clone(), this.whereItems, this.transformItems, this.orderByItems, selectItems, this.groupByItems);
        }

        /** Removes the given expression from order by. */
        public removeOrderBy(expr: SQExpr): SemanticQuery {
            let sorts = this.orderBy();
            for (let i = sorts.length - 1; i >= 0; i--) {
                if (SQExpr.equals(sorts[i].expr, expr))
                    sorts.splice(i, 1);
            }

            return SemanticQuery.createWithTrimmedFrom(this.fromValue.clone(), this.whereItems, this.transformItems, sorts, this.selectItems, this.groupByItems);
        }

        /** Removes the given expression from transforms. */
        public removeTransform(transform: SQTransform): SemanticQuery {
            let transforms = this.transforms();
            for (let i = 0, len = transforms.length; i < len; i++) {
                if (transforms[i].name === transform.name) {
                    transforms.splice(i, 1);
                    break;
                }
            }

            return SemanticQuery.createWithTrimmedFrom(this.fromValue.clone(), this.whereItems, transforms, this.orderByItems, this.selectItems, this.groupByItems);
        }

        public selectNameOf(expr: SQExpr): string {
            let index = SQExprUtils.indexOfNamedExpr(this.selectItems, expr);
            if (index >= 0)
                return this.selectItems[index].name;
        }

        public setSelectAt(index: number, expr: SQExpr): SemanticQuery {
            debug.assertValue(expr, 'expr');

            if (index >= this.selectItems.length)
                return;

            let select = this.select(),
                from = this.fromValue.clone(),
                originalName = select[index].name;
            select[index] = {
                name: originalName,
                expr: SQExprRewriterWithSourceRenames.rewrite(expr, from)
            };

            return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, this.transformItems, this.orderByItems, select, this.groupByItems);
        }

        /** Adds a the expression to the select clause. */
        public addSelect(expr: SQExpr, exprName?: string): SemanticQuery {
            debug.assertValue(expr, 'expr');

            let selectItems = this.select(),
                from = this.fromValue.clone();
            selectItems.push(this.createNamedExpr(selectItems, from, expr, exprName));

            return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, this.transformItems, this.orderByItems, selectItems, this.groupByItems);
        }

        private createNamedExpr(currentNames: ArrayNamedItems<NamedSQExpr>, from: SQFrom, expr: SQExpr, exprName?: string): NamedSQExpr {
            return {
                name: SQExprUtils.uniqueName(currentNames, expr, exprName),
                expr: SQExprRewriterWithSourceRenames.rewrite(expr, from)
            };
        }

        /** Returns a query equivalent to this, with the specified groupBy items. */
        groupBy(values: NamedSQExpr[]): SemanticQuery;
        /** Gets the groupby items in this query. */
        groupBy(): ArrayNamedItems<NamedSQExpr>;
        public groupBy(values?: NamedSQExpr[]): any {
            if (_.isEmpty(arguments))
                return this.getGroupBy();

            return this.setGroupBy(values);
        }

        private getGroupBy(): ArrayNamedItems<NamedSQExpr> {
            return SemanticQuery.createNamedExpressionArray(this.groupByItems);
        }

        private setGroupBy(values: NamedSQExpr[]): SemanticQuery {
            let from = this.fromValue.clone();
            let groupByItems = SemanticQuery.rewriteExpressionsWithSourceRenames(values, from);
            return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, this.transformItems, this.orderByItems, this.selectItems, groupByItems);
        }

        public addGroupBy(expr: SQExpr): SemanticQuery {
            debug.assertValue(expr, 'expr');

            let groupByItems = this.groupBy(),
                from = this.fromValue.clone();
            groupByItems.push(this.createNamedExpr(groupByItems, from, expr));

            return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, this.transformItems, this.orderByItems, this.selectItems, groupByItems);
        }

        /** Gets or sets the sorting for this query. */
        orderBy(values: SQSortDefinition[]): SemanticQuery;
        orderBy(): SQSortDefinition[];

        public orderBy(values?: SQSortDefinition[]): any {
            if (_.isEmpty(arguments))
                return this.getOrderBy();

            return this.setOrderBy(values);
        }

        private getOrderBy(): SQSortDefinition[] {
            let result: SQSortDefinition[] = [];

            let orderBy = this.orderByItems;
            if (orderBy) {
                for (let i = 0, len = orderBy.length; i < len; i++) {
                    let clause = orderBy[i];

                    result.push({
                        expr: clause.expr,
                        direction: clause.direction,
                    });
                }
            }

            return result;
        }

        private setOrderBy(values: SQSortDefinition[]): SemanticQuery {
            debug.assertValue(values, 'values');

            let updatedOrderBy: SQSortDefinition[] = [],
                from = this.fromValue.clone();
            for (let i = 0, len = values.length; i < len; i++) {
                let clause = values[i];
                updatedOrderBy.push({
                    expr: SQExprRewriterWithSourceRenames.rewrite(clause.expr, from),
                    direction: clause.direction,
                });
            }

            return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, this.transformItems, updatedOrderBy, this.selectItems, this.groupByItems);
        }

        /** Gets or sets the filters for this query. */
        where(values: SQFilter[]): SemanticQuery;
        where(): SQFilter[];

        public where(values?: SQFilter[]): any {
            if (_.isEmpty(arguments))
                return this.getWhere();

            return this.setWhere(values);
        }

        private getWhere(): SQFilter[] {
            let result: SQFilter[] = [];

            let whereItems = this.whereItems;
            if (whereItems) {
                for (let i = 0, len = whereItems.length; i < len; i++)
                    result.push(whereItems[i]);
            }

            return result;
        }

        private setWhere(values: SQFilter[]): SemanticQuery {
            debug.assertValue(values, 'values');

            let updatedWhere: SQFilter[] = [],
                from = this.fromValue.clone();
            for (let i = 0, len = values.length; i < len; i++) {
                let filter = values[i];
                let updatedFilter: SQFilter = {
                    condition: SQExprRewriterWithSourceRenames.rewrite(filter.condition, from),
                };

                let filterTarget = filter.target;
                if (filterTarget) {
                    updatedFilter.target = [];
                    for (let j = 0, jlen = filterTarget.length; j < jlen; j++)
                        if (filterTarget[j]) {
                            let updatedTarget = SQExprRewriterWithSourceRenames.rewrite(filterTarget[j], from);
                            updatedFilter.target.push(updatedTarget);
                        }
                }

                updatedWhere.push(updatedFilter);
            }

            return SemanticQuery.createWithTrimmedFrom(from, updatedWhere, this.transformItems, this.orderByItems, this.selectItems, this.groupByItems);
        }

        public addWhere(filter: SemanticFilter): SemanticQuery {
            debug.assertValue(filter, 'filter');

            let updatedWhere: SQFilter[] = this.where(),
                incomingWhere: SQFilter[] = filter.where(),
                from = this.fromValue.clone();

            for (let i = 0, len = incomingWhere.length; i < len; i++) {
                let clause = incomingWhere[i];

                let updatedClause: SQFilter = {
                    condition: SQExprRewriterWithSourceRenames.rewrite(clause.condition, from),
                };

                if (clause.target)
                    updatedClause.target = _.map(clause.target, t => SQExprRewriterWithSourceRenames.rewrite(t, from));

                updatedWhere.push(updatedClause);
            }

            return SemanticQuery.createWithTrimmedFrom(from, updatedWhere, this.transformItems, this.orderByItems, this.selectItems, this.groupByItems);
        }

        /** Returns a query equivalent to this, with the specified transform items. */
        transforms(transforms: SQTransform[]): SemanticQuery;
        transforms(): SQTransform[];

        public transforms(transforms?: SQTransform[]): any {
            if (_.isEmpty(arguments))
                return this.getTransforms();

            return this.setTransforms(transforms);
        }

        private getTransforms(): SQTransform[] {
            let transforms: SQTransform[] = [];

            if (!_.isEmpty(this.transformItems)) {
                for (let transform of this.transformItems) {
                    transforms.push(transform);
                }
            }

            return transforms;
        }

        private setTransforms(transforms: SQTransform[]): SemanticQuery {
            let from = this.fromValue.clone();
            let transformItems: SQTransform[] = [];

            for (let transform of transforms) {
                let inputColumns: SQTransformTableColumn[];
                if (transform.input.table && !_.isEmpty(transform.input.table.columns)) {
                    inputColumns = _.map(transform.input.table.columns, c => {
                        return {
                            role: c.role,
                            expression: this.createNamedExpr(ArrayExtensions.extendWithName<NamedSQExpr>([]), from, c.expression.expr, c.expression.name)
                        };
                    });
                }

                let newTransform: SQTransform = {
                    name: transform.name,
                    algorithm: transform.algorithm,
                    input: {
                        parameters: transform.input.parameters,
                    },
                    output: transform.output
                };

                if (transform.input.table) {
                    newTransform.input.table = {
                        name: transform.input.table.name,
                        columns: inputColumns
                    };
                }

                transformItems.push(newTransform);
            }

            return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, transforms, this.orderByItems, this.selectItems, this.groupByItems);
        }

        public rewrite(exprRewriter: ISQExprVisitor<SQExpr>): SemanticQuery {
            let rewriter = new SemanticQueryRewriter(exprRewriter);
            let from = rewriter.rewriteFrom(this.fromValue);
            let where = rewriter.rewriteWhere(this.whereItems, from);
            let orderBy = rewriter.rewriteOrderBy(this.orderByItems, from);
            let select = rewriter.rewriteSelect(this.selectItems, from);
            let groupBy = rewriter.rewriteGroupBy(this.groupByItems, from);
            let transform = rewriter.rewriteTransform(this.transformItems, from);

            return SemanticQuery.createWithTrimmedFrom(from, where, transform, orderBy, select, groupBy);
        }

        public static equals(x: SemanticQuery, y: SemanticQuery): boolean {
            debug.assertValue(x, 'x SemanticQuery');
            debug.assertValue(y, 'y SemanticQuery');

            return x.from().equals(y.from())
                && ArrayExtensions.sequenceEqual(x.where(), y.where(), SQFilter.equals)
                && ArrayExtensions.sequenceEqual(x.orderBy(), y.orderBy(), SQUtils.sqSortDefinitionEquals)
                && ArrayExtensions.sequenceEqual(x.select(), y.select(), SQUtils.namedSQExprEquals)
                && ArrayExtensions.sequenceEqual(x.groupBy(), y.groupBy(), SQUtils.namedSQExprEquals)
                && ArrayExtensions.sequenceEqual(x.transforms(), y.transforms(), SQUtils.sqTransformEquals);
        }
    }

    /** Represents a semantic filter condition.  Round-trippable with a JSON FilterDefinition.  Instances of this class are immutable. */
    export class SemanticFilter implements ISemanticFilter {
        private fromValue: SQFrom;
        private whereItems: SQFilter[];

        constructor(from: SQFrom, where: SQFilter[]) {
            debug.assertValue(from, 'from');
            debug.assertValue(where, 'where');

            this.fromValue = from;
            this.whereItems = where;
        }

        public static fromSQExpr(contract: SQExpr): SemanticFilter {
            debug.assertValue(contract, 'contract');

            let from = new SQFrom();

            let rewrittenContract = SQExprRewriterWithSourceRenames.rewrite(contract, from);
            // DEVNOTE targets of some filters are visual specific and will get resolved only during query generation.
            //         Thus not setting a target here.
            let where: SQFilter[] = [{
                condition: rewrittenContract
            }];

            return new SemanticFilter(from, where);
        }

        public static getDefaultValueFilter(fieldSQExprs: SQExpr | SQExpr[]): SemanticFilter {
            return SemanticFilter.getDataViewScopeIdentityComparisonFilters(fieldSQExprs, SQExprBuilder.defaultValue());
        }

        public static getAnyValueFilter(fieldSQExprs: SQExpr | SQExpr[]): SemanticFilter {
            return SemanticFilter.getDataViewScopeIdentityComparisonFilters(fieldSQExprs, SQExprBuilder.anyValue());
        }

        private static getDataViewScopeIdentityComparisonFilters(fieldSQExprs: SQExpr | SQExpr[], value: SQExpr): SemanticFilter {
            debug.assertValue(fieldSQExprs, 'fieldSQExprs');
            debug.assertValue(value, 'value');

            if (fieldSQExprs instanceof Array) {
                let values: SQConstantExpr[] = Array.apply(null, Array(fieldSQExprs.length)).map(() => { return value; });
                return SemanticFilter.fromSQExpr(SQExprUtils.getDataViewScopeIdentityComparisonExpr(<SQExpr[]>fieldSQExprs, values));
            }

            return SemanticFilter.fromSQExpr(SQExprBuilder.equal(<SQExpr>fieldSQExprs, value));
        }

        public from(): SQFrom {
            return this.fromValue.clone();
        }

        public conditions(): SQExpr[] {
            let expressions: SQExpr[] = [];

            let where = this.whereItems;
            for (let i = 0, len = where.length; i < len; i++) {
                let filter = where[i];
                expressions.push(filter.condition);
            }
            return expressions;
        }

        public where(): SQFilter[] {
            let result: SQFilter[] = [];

            let whereItems = this.whereItems;
            for (let i = 0, len = whereItems.length; i < len; i++)
                result.push(whereItems[i]);

            return result;
        }

        public rewrite(exprRewriter: ISQExprVisitor<SQExpr>): SemanticFilter {
            let rewriter = new SemanticQueryRewriter(exprRewriter);
            let from = rewriter.rewriteFrom(this.fromValue);
            let where = rewriter.rewriteWhere(this.whereItems, from);

            return new SemanticFilter(from, where);
        }

        public validate(schema: FederatedConceptualSchema, aggrUtils: ISQAggregationOperations, errors?: SQExprValidationError[]): SQExprValidationError[] {
            let validator = new SQExprValidationVisitor(schema, aggrUtils, errors);
            this.rewrite(validator);
            return validator.errors;
        }

        /** Merges a list of SemanticFilters into one. */
        public static merge(filters: SemanticFilter[]): SemanticFilter {
            if (_.isEmpty(filters))
                return null;

            if (filters.length === 1)
                return filters[0];

            let firstFilter = filters[0];
            let from = firstFilter.from(),
                where: SQFilter[] = ArrayExtensions.take(firstFilter.whereItems, firstFilter.whereItems.length);

            for (let i = 1, len = filters.length; i < len; i++)
                SemanticFilter.applyFilter(filters[i], from, where);

            return new SemanticFilter(from, where);
        }

        public static isDefaultFilter(filter: SemanticFilter): boolean {
            if (!filter || filter.where().length !== 1)
                return false;

            return SQExprUtils.isDefaultValue(filter.where()[0].condition);
        }

        public static isAnyFilter(filter: SemanticFilter): boolean {
            if (!filter || filter.where().length !== 1)
                return false;

            return SQExprUtils.isAnyValue(filter.where()[0].condition);
        }

        public static isSameFilter(leftFilter: SemanticFilter, rightFilter: SemanticFilter): boolean {
            if (jsCommon.JsonComparer.equals<SemanticFilter>(leftFilter, rightFilter)) {
                return !((SemanticFilter.isDefaultFilter(leftFilter) && SemanticFilter.isAnyFilter(rightFilter))
                    || (SemanticFilter.isAnyFilter(leftFilter) && SemanticFilter.isDefaultFilter(rightFilter)));
            }
            return false;
        }

        private static applyFilter(filter: SemanticFilter, from: SQFrom, where: SQFilter[]): void {
            debug.assertValue(filter, 'filter');
            debug.assertValue(from, 'from');
            debug.assertValue(where, 'where');

            // Where
            let filterWhereItems = filter.whereItems;
            for (let i = 0; i < filterWhereItems.length; i++) {
                let filterWhereItem = filterWhereItems[i];

                let updatedWhereItem: SQFilter = {
                    condition: SQExprRewriterWithSourceRenames.rewrite(filterWhereItem.condition, from),
                };

                if (filterWhereItem.target)
                    updatedWhereItem.target = _.map(filterWhereItem.target, e => SQExprRewriterWithSourceRenames.rewrite(e, from));

                where.push(updatedWhereItem);
            }
        }
    }

    export class SQExprRewriterWithSourceRenames extends SQExprRewriter {
        private renames: SQSourceRenames;

        constructor(renames: SQSourceRenames) {
            debug.assertValue(renames, 'renames');

            super();
            this.renames = renames;
        }

        public visitEntity(expr: SQEntityExpr): SQExpr {
            let updatedName = this.renames[expr.entity];

            if (updatedName)
                return new SQEntityExpr(expr.schema, expr.entity, updatedName);

            return super.visitEntity(expr);
        }

        public rewriteFilter(filter: SQFilter): SQFilter {
            debug.assertValue(filter, 'filter');

            let updatedTargets = undefined;
            if (filter.target)
                updatedTargets = this.rewriteArray(filter.target);

            let updatedCondition = filter.condition.accept(this);

            if (filter.condition === updatedCondition && filter.target === updatedTargets)
                return filter;

            let updatedFilter: SQFilter = {
                condition: updatedCondition,
            };

            if (updatedTargets)
                updatedFilter.target = updatedTargets;

            return updatedFilter;
        }

        public rewriteArray(exprs: SQExpr[]): SQExpr[] {
            debug.assertValue(exprs, 'exprs');

            let updatedExprs: SQExpr[];

            for (let i = 0, len = exprs.length; i < len; i++) {
                let expr = exprs[i],
                    rewrittenExpr = expr.accept(this);

                if (expr !== rewrittenExpr && !updatedExprs)
                    updatedExprs = ArrayExtensions.take(exprs, i);

                if (updatedExprs)
                    updatedExprs.push(rewrittenExpr);
            }

            return updatedExprs || exprs;
        }

        public static rewrite(expr: SQExpr, from: SQFrom): SQExpr {
            debug.assertValue(expr, 'expr');
            debug.assertValue(from, 'from');

            let renames = QuerySourceRenameDetector.run(expr, from);
            let rewriter = new SQExprRewriterWithSourceRenames(renames);
            return expr.accept(rewriter);
        }
    }

    /** Responsible for updating a QueryFrom based on SQExpr references. */
    class QuerySourceRenameDetector extends DefaultSQExprVisitorWithTraversal {
        private from: SQFrom;
        private renames: SQSourceRenames;

        public static run(expr: SQExpr, from: SQFrom): SQSourceRenames {
            let detector = new QuerySourceRenameDetector(from);
            expr.accept(detector);

            return detector.renames;
        }

        constructor(from: SQFrom) {
            debug.assertValue(from, 'from');
            super();

            this.from = from;
            this.renames = {};
        }

        public visitEntity(expr: SQEntityExpr): void {
            // TODO: Renames must take the schema into account, not just entity set name.
            let existingEntity = this.from.source(expr.variable);
            if (existingEntity && isSQFromEntitySource(existingEntity) && existingEntity.schema === expr.schema && existingEntity.entity === expr.entity)
                return;

            let actualEntity = this.from.ensureSource(
                new SQFromEntitySource(expr.schema, expr.entity),
                expr.variable);

            this.renames[expr.entity] = actualEntity.name;
        }
    }

    /** Visitor for finding unreferenced sources. */
    class UnreferencedKeyFinder extends DefaultSQExprVisitorWithTraversal {
        private keys: string[];

        constructor(keys: string[]) {
            debug.assertValue(keys, 'keys');

            super();
            this.keys = keys;
        }

        public visitEntity(expr: SQEntityExpr): void {
            let index = this.keys.indexOf(expr.variable);
            if (index >= 0)
                this.keys.splice(index, 1);
        }

        public result(): string[] {
            return this.keys;
        }
    }
}