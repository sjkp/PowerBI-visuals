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
    import StringExtensions = jsCommon.StringExtensions;

    /** Represents an immutable expression within a SemanticQuery. */
    export abstract class SQExpr implements ISQExpr {
        private _kind: SQExprKind;

        constructor(kind: SQExprKind) {
            debug.assertValue(kind, 'kind');

            this._kind = kind;
        }

        public static equals(x: SQExpr, y: SQExpr, ignoreCase?: boolean): boolean {
            return SQExprEqualityVisitor.run(x, y, ignoreCase);
        }

        public validate(schema: FederatedConceptualSchema, aggrUtils: ISQAggregationOperations, errors?: SQExprValidationError[]): SQExprValidationError[] {
            let validator = new SQExprValidationVisitor(schema, aggrUtils, errors);
            this.accept(validator);
            return validator.errors;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            debug.assertFail('abstract method');
            return;
        }

        public get kind(): SQExprKind {
            return this._kind;
        }
        
        public static isArithmetic(expr: SQExpr): expr is SQArithmeticExpr {
            debug.assertValue(expr, 'expr');
            
            return expr.kind === SQExprKind.Arithmetic;
        }

        public static isColumn(expr: SQExpr): expr is SQColumnRefExpr {
            debug.assertValue(expr, 'expr');

            return expr.kind === SQExprKind.ColumnRef;
        }

        public static isConstant(expr: SQExpr): expr is SQConstantExpr {
            debug.assertValue(expr, 'expr');

            return expr.kind === SQExprKind.Constant;
        }

        public static isEntity(expr: SQExpr): expr is SQEntityExpr {
            debug.assertValue(expr, 'expr');

            return expr.kind === SQExprKind.Entity;
        }

        public static isHierarchy(expr: SQExpr): expr is SQHierarchyExpr {
            debug.assertValue(expr, 'expr');

            return expr.kind === SQExprKind.Hierarchy;
        }

        public static isHierarchyLevel(expr: SQExpr): expr is SQHierarchyLevelExpr {
            debug.assertValue(expr, 'expr');

            return expr.kind === SQExprKind.HierarchyLevel;
        }

        public static isAggregation(expr: SQExpr): expr is SQAggregationExpr {
            debug.assertValue(expr, 'expr');

            return expr.kind === SQExprKind.Aggregation;
        }

        public static isMeasure(expr: SQExpr): expr is SQMeasureRefExpr {
            debug.assertValue(expr, 'expr');

            return expr.kind === SQExprKind.MeasureRef;
        }

        public static isPercentile(expr: SQExpr): expr is SQPercentileExpr {
            debug.assertValue(expr, 'expr');

            return expr.kind === SQExprKind.Percentile;
        }

        public static isSelectRef(expr: SQExpr): expr is SQSelectRefExpr {
            debug.assertValue(expr, 'expr');

            return expr.kind === SQExprKind.SelectRef;
        }
        
        public static isScopedEval(expr: SQExpr): expr is SQScopedEvalExpr {
            debug.assertValue(expr, 'expr');
            
            return expr.kind === SQExprKind.ScopedEval;
        }
        
        public static isWithRef(expr: SQExpr): expr is SQWithRefExpr {
            debug.assertValue(expr, 'expr');
            
            return expr.kind === SQExprKind.WithRef;
        }

        public static isTransformTableRef(expr: SQExpr): expr is SQTransformTableRefExpr {
            debug.assertValue(expr, 'expr');

            return expr.kind === SQExprKind.TransformTableRef;
        }

        public static isTransformOutputRoleRef(expr: SQExpr): expr is SQTransformOutputRoleRefExpr {
            debug.assertValue(expr, 'expr');

            return expr.kind === SQExprKind.TransformOutputRoleRef;
        }

        public static isResourcePackageItem(expr: SQExpr): expr is SQResourcePackageItemExpr {
            debug.assertValue(expr, 'expr');

            return expr.kind === SQExprKind.ResourcePackageItem;
        }

        public getMetadata(federatedSchema: FederatedConceptualSchema): SQExprMetadata {
            debug.assertValue(federatedSchema, 'federatedSchema');

            let field = SQExprConverter.asFieldPattern(this);
            if (!field)
                return;

            if (field.column || field.columnAggr || field.measure)
                return this.getMetadataForProperty(field, federatedSchema);

            if (field.hierarchyLevel || field.hierarchyLevelAggr)
                return this.getMetadataForHierarchyLevel(field, federatedSchema);

            if (field.columnHierarchyLevelVariation)
                return this.getMetadataForVariation(field, federatedSchema);

            if (field.percentOfGrandTotal)
                return this.getMetadataForPercentOfGrandTotal();

            return SQExpr.getMetadataForEntity(field, federatedSchema);
        }

        public getDefaultAggregate(federatedSchema: FederatedConceptualSchema, forceAggregation: boolean = false): QueryAggregateFunction {
            debug.assertValue(federatedSchema, 'federatedSchema');

            let property = this.getConceptualProperty(federatedSchema) || this.getHierarchyLevelConceptualProperty(federatedSchema);
            if (!property)
                return;

            let aggregate: QueryAggregateFunction;

            if (property && property.kind === ConceptualPropertyKind.Column) {
                let propertyDefaultAggregate = property.column ? property.column.defaultAggregate : null;

                if ((property.type.integer || property.type.numeric) &&
                    propertyDefaultAggregate !== ConceptualDefaultAggregate.None) {
                    aggregate = defaultAggregateToQueryAggregateFunction(propertyDefaultAggregate);
                    if (aggregate === undefined)
                        aggregate = defaultAggregateForDataType(property.type);
                }

                // If we haven't found an appropriate aggregate, and want to force aggregation anyway, 
                // aggregate on CountNonNull.
                if (aggregate === undefined && forceAggregation) {
                    aggregate = QueryAggregateFunction.CountNonNull;
                }
            }

            return aggregate;
        }

        /** Return the SQExpr[] of group on columns if it has group on keys otherwise return the SQExpr of the column.*/
        public getKeyColumns(schema: FederatedConceptualSchema): SQExpr[] {
            let columnRefExpr = SQExprColumnRefInfoVisitor.getColumnRefSQExpr(schema, this);
            if (!columnRefExpr)
                return;

            let keySQExprs: SQExpr[] = [];
            let keys = this.getPropertyKeys(schema);
            if (keys && keys.length > 0) {
                for (let i = 0, len = keys.length; i < len; i++) {
                    keySQExprs.push(SQExprBuilder.columnRef(columnRefExpr.source, keys[i].name));
                }
            }
            else
                keySQExprs.push(columnRefExpr);

            return keySQExprs;
        }

        /** Returns a value indicating whether the expression would group on keys other than itself.*/
        public hasGroupOnKeys(schema: FederatedConceptualSchema): boolean {
            let columnRefExpr = SQExprColumnRefInfoVisitor.getColumnRefSQExpr(schema, this);
            if (!columnRefExpr)
                return;
            let keys = this.getPropertyKeys(schema);

            if (!keys || keys.length < 1)
                return false;

            if (keys.length > 1)
                return true;

            let keySqExpr = SQExprBuilder.columnRef(columnRefExpr.source, keys[0].name);
            return !SQExpr.equals(keySqExpr, this);
        }

        private getPropertyKeys(schema: FederatedConceptualSchema): jsCommon.ArrayNamedItems<ConceptualProperty> {
            let property = this.getConceptualProperty(schema) || this.getHierarchyLevelConceptualProperty(schema);
            if (!property)
                return;

            return property.column ? property.column.keys : undefined;
        }

        public getConceptualProperty(federatedSchema: FederatedConceptualSchema): ConceptualProperty {
            let field = SQExprConverter.asFieldPattern(this);
            if (!field)
                return;

            let fieldExprItem = FieldExprPattern.toFieldExprEntityItemPattern(field);
            let propertyName = FieldExprPattern.getPropertyName(field);

            if (propertyName)
                return federatedSchema
                    .schema(fieldExprItem.schema)
                    .findProperty(fieldExprItem.entity, propertyName);
        }

        public getTargetEntityForVariation(federatedSchema: FederatedConceptualSchema, variationName: string): string {
            let property = this.getConceptualProperty(federatedSchema);
            if (property && property.column && !_.isEmpty(property.column.variations)) {
                let variations = property.column.variations;
                for (let variation of variations)
                    if (variation.name === variationName)
                        return variation.navigationProperty.targetEntity.name;
            }
        }

        public getTargetEntity(federatedSchema: FederatedConceptualSchema): SQEntityExpr {
            return SQEntityExprInfoVisitor.getEntityExpr(federatedSchema, this);
        }

        private getHierarchyLevelConceptualProperty(federatedSchema: FederatedConceptualSchema): ConceptualProperty {
            let field = SQExprConverter.asFieldPattern(this);
            if (!field)
                return;

            let fieldExprHierachyLevel = field.hierarchyLevel || field.hierarchyLevelAggr;
            if (fieldExprHierachyLevel) {
                let fieldExprEntity = FieldExprPattern.toFieldExprEntityItemPattern(field);

                let hierarchy = federatedSchema
                    .schema(fieldExprEntity.schema)
                    .findHierarchy(fieldExprEntity.entity, fieldExprHierachyLevel.name);

                if (hierarchy) {
                    let hierarchyLevel = hierarchy.levels.withName(fieldExprHierachyLevel.level);
                    if (hierarchyLevel)
                        return hierarchyLevel.column;
                }
            }
        }

        private getMetadataForVariation(field: data.FieldExprPattern, federatedSchema: FederatedConceptualSchema): SQExprMetadata {
            debug.assertValue(field, 'field');
            debug.assertValue(federatedSchema, 'federatedSchema');

            let columnHierarchyLevelVariation = field.columnHierarchyLevelVariation;
            let fieldExprItem = FieldExprPattern.toFieldExprEntityItemPattern(field);
            let sourceProperty = federatedSchema
                .schema(fieldExprItem.schema)
                .findProperty(fieldExprItem.entity, columnHierarchyLevelVariation.source.name);

            if (sourceProperty && sourceProperty.column && sourceProperty.column.variations) {
                for (let variation of sourceProperty.column.variations) {
                    if (variation.defaultHierarchy && variation.defaultHierarchy.levels) {
                        for (let level of variation.defaultHierarchy.levels) {
                            if (level.name === columnHierarchyLevelVariation.level.level) {
                                let property = level.column;
                                return {
                                    kind: (property.kind === ConceptualPropertyKind.Measure) ? FieldKind.Measure : FieldKind.Column,
                                    type: property.type,
                                    format: property.format,
                                    idOnEntityKey: property.column ? property.column.idOnEntityKey : false,
                                    defaultAggregate: property.column ? property.column.defaultAggregate : null
                                };
                            }
                        }
                    }
                }
            }
        }

        private getMetadataForHierarchyLevel(field: FieldExprPattern, federatedSchema: FederatedConceptualSchema): SQExprMetadata {
            debug.assertValue(field, 'field');
            debug.assertValue(federatedSchema, 'federatedSchema');

            let property = this.getHierarchyLevelConceptualProperty(federatedSchema);
            if (!property)
                return;

            return this.getPropertyMetadata(field, property);
        }

        private getMetadataForPercentOfGrandTotal(): SQExprMetadata {
            return {
                kind: FieldKind.Measure,
                format: '#,##0.00%',
                type: ValueType.fromExtendedType(ExtendedType.Double)
            };
        }

        private getPropertyMetadata(field: FieldExprPattern, property: ConceptualProperty): SQExprMetadata {
            let format = property.format;
            let type = property.type;
            let columnAggregate = field.columnAggr || field.hierarchyLevelAggr;

            if (columnAggregate) {
                switch (columnAggregate.aggregate) {
                    case QueryAggregateFunction.Count:
                    case QueryAggregateFunction.CountNonNull:
                        type = ValueType.fromExtendedType(ExtendedType.Integer);
                        format = undefined;
                        break;
                    case QueryAggregateFunction.Avg:
                        if (type.integer)
                            type = ValueType.fromExtendedType(ExtendedType.Double);
                        break;
                }
            }

            return {
                kind: (property.kind === ConceptualPropertyKind.Measure || (columnAggregate && columnAggregate.aggregate !== undefined)) ? FieldKind.Measure : FieldKind.Column,
                type: type,
                format: format,
                idOnEntityKey: property.column ? property.column.idOnEntityKey : false,
                aggregate: columnAggregate ? columnAggregate.aggregate : undefined,
                defaultAggregate: property.column ? property.column.defaultAggregate : null
            };
        }

        private getMetadataForProperty(field: FieldExprPattern, federatedSchema: FederatedConceptualSchema): SQExprMetadata {
            debug.assertValue(field, 'field');
            debug.assertValue(federatedSchema, 'federatedSchema');

            let property = this.getConceptualProperty(federatedSchema);
            if (!property)
                return;

            return this.getPropertyMetadata(field, property);
        }

        private static getMetadataForEntity(field: FieldExprPattern, federatedSchema: FederatedConceptualSchema): SQExprMetadata {
            debug.assertValue(field, 'field');
            debug.assertValue(federatedSchema, 'federatedSchema');

            let fieldExprItem = FieldExprPattern.toFieldExprEntityItemPattern(field);
            let entity = federatedSchema
                .schema(fieldExprItem.schema)
                .entities
                .withName(fieldExprItem.entity);

            if (!entity)
                return;

            // We only support count and countnonnull for entity.
            if (field.entityAggr) {
                switch (field.entityAggr.aggregate) {
                    case QueryAggregateFunction.Count:
                    case QueryAggregateFunction.CountNonNull:
                        return {
                            kind: FieldKind.Measure,
                            type: ValueType.fromExtendedType(ExtendedType.Integer),
                            format: undefined,
                            idOnEntityKey: false,
                            aggregate: field.entityAggr.aggregate
                        };
                }
            }
        }
    }

    export const enum SQExprKind {
        Entity,
        ColumnRef,
        MeasureRef,
        Aggregation,
        PropertyVariationSource,
        Hierarchy,
        HierarchyLevel,
        And,
        Between,
        In,
        Or,
        Contains,
        Compare,
        StartsWith,
        Exists,
        Not,
        Constant,
        DateSpan,
        DateAdd,
        Now,
        AnyValue,
        DefaultValue,
        Arithmetic,
        FillRule,
        ResourcePackageItem,
        ScopedEval,
        WithRef,
        Percentile,
        SelectRef,
        TransformTableRef,
        TransformOutputRoleRef,
    }

    export interface SQExprMetadata {
        kind: FieldKind;
        type: ValueType;
        format?: string;
        idOnEntityKey?: boolean;
        aggregate?: QueryAggregateFunction;
        defaultAggregate?: ConceptualDefaultAggregate;
    }

    export const enum FieldKind {
        /** Indicates the field references a column, which evaluates to a distinct set of values (e.g., Year, Name, SalesQuantity, etc.). */
        Column,

        /** Indicates the field references a measure, which evaluates to a single value (e.g., SalesYTD, Sum(Sales), etc.). */
        Measure,
    }

    /** Note: Exported for testability */
    export function defaultAggregateForDataType(type: ValueType): QueryAggregateFunction {
        if (type.integer || type.numeric)
            return QueryAggregateFunction.Sum;

        return QueryAggregateFunction.Count;
    }

    /** Note: Exported for testability */
    export function defaultAggregateToQueryAggregateFunction(aggregate: ConceptualDefaultAggregate): QueryAggregateFunction {
        switch (aggregate) {
            case ConceptualDefaultAggregate.Average:
                return QueryAggregateFunction.Avg;
            case ConceptualDefaultAggregate.Count:
                return QueryAggregateFunction.CountNonNull;
            case ConceptualDefaultAggregate.DistinctCount:
                return QueryAggregateFunction.Count;
            case ConceptualDefaultAggregate.Max:
                return QueryAggregateFunction.Max;
            case ConceptualDefaultAggregate.Min:
                return QueryAggregateFunction.Min;
            case ConceptualDefaultAggregate.Sum:
                return QueryAggregateFunction.Sum;
            default:
                return;
        }
    }

    export class SQEntityExpr extends SQExpr {
        public schema: string;
        public entity: string;
        public variable: string;

        constructor(schema: string, entity: string, variable?: string) {
            debug.assertValue(entity, 'entity');

            super(SQExprKind.Entity);
            this.schema = schema;
            this.entity = entity;
            if (variable)
                this.variable = variable;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitEntity(this, arg);
        }
    }

    export class SQArithmeticExpr extends SQExpr {
        public left: SQExpr;
        public right: SQExpr;
        public operator: ArithmeticOperatorKind;

        constructor(left: SQExpr, right: SQExpr, operator: ArithmeticOperatorKind) {
            debug.assertValue(left, 'left');
            debug.assertValue(right, 'right');
            debug.assertValue(operator, 'operator');

            super(SQExprKind.Arithmetic);
            this.left = left;
            this.right = right;
            this.operator = operator;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitArithmetic(this, arg);
        }
    }

    export class SQScopedEvalExpr extends SQExpr {
        public expression: SQExpr;
        public scope: SQExpr[];

        constructor(expression: SQExpr, scope: SQExpr[]) {
            debug.assertValue(expression, 'expression');
            debug.assertValue(scope, 'scope');

            super(SQExprKind.ScopedEval);
            this.expression = expression;
            this.scope = scope;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitScopedEval(this, arg);
        }

        public getMetadata(federatedSchema: FederatedConceptualSchema): SQExprMetadata {
            return this.expression.getMetadata(federatedSchema);
        }
    }
    
    export class SQWithRefExpr extends SQExpr {
        public expressionName: string;

        constructor(expressionName: string) {
            debug.assertValue(expressionName, 'expressionName');

            super(SQExprKind.WithRef);
            this.expressionName = expressionName;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitWithRef(this, arg);
        }
    }

    export abstract class SQPropRefExpr extends SQExpr {
        public ref: string;
        public source: SQExpr;

        constructor(kind: SQExprKind, source: SQExpr, ref: string) {
            debug.assertValue(kind, 'kind');
            debug.assertValue(source, 'source');
            debug.assertValue(ref, 'ref');

            super(kind);
            this.source = source;
            this.ref = ref;
        }
    }

    export class SQColumnRefExpr extends SQPropRefExpr {
        constructor(source: SQExpr, ref: string) {
            super(SQExprKind.ColumnRef, source, ref);
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitColumnRef(this, arg);
        }
    }

    export class SQMeasureRefExpr extends SQPropRefExpr {
        constructor(source: SQExpr, ref: string) {
            super(SQExprKind.MeasureRef, source, ref);
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitMeasureRef(this, arg);
        }
    }

    export class SQAggregationExpr extends SQExpr {
        public arg: SQExpr;
        public func: QueryAggregateFunction;

        constructor(arg: SQExpr, func: QueryAggregateFunction) {
            debug.assertValue(arg, 'arg');
            debug.assertValue(func, 'func');

            super(SQExprKind.Aggregation);
            this.arg = arg;
            this.func = func;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitAggr(this, arg);
        }
    }

    export class SQPercentileExpr extends SQExpr {
        public arg: SQExpr;
        public k: number;
        public exclusive: boolean;

        constructor(arg: SQExpr, k: number, exclusive: boolean) {
            debug.assertValue(arg, 'arg');
            debug.assertValue(k, 'k');
            debug.assert(0 <= k && k <= 1, '0 <= k && k <= 1');
            debug.assertValue(exclusive, 'exclusive');

            super(SQExprKind.Percentile);
            this.arg = arg;
            this.k = k;
            this.exclusive = exclusive;
        }

        public getMetadata(federatedSchema: FederatedConceptualSchema): SQExprMetadata {
            debug.assertValue(federatedSchema, 'federatedSchema');

            let argMetadata = this.arg.getMetadata(federatedSchema);
            if (argMetadata) {
                return {
                    kind: FieldKind.Measure,
                    type: argMetadata.type,
                };
            }
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitPercentile(this, arg);
        }
    }

    export class SQPropertyVariationSourceExpr extends SQExpr {
        public arg: SQExpr;
        public name: string;
        public property: string;

        constructor(arg: SQExpr, name: string, property: string) {
            debug.assertValue(arg, 'arg');
            debug.assertValue(name, 'name');
            debug.assertValue(property, 'property');

            super(SQExprKind.PropertyVariationSource);
            this.arg = arg;
            this.name = name;
            this.property = property;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitPropertyVariationSource(this, arg);
        }
    }

    export class SQHierarchyExpr extends SQExpr {
        public arg: SQExpr;
        public hierarchy: string;

        constructor(arg: SQExpr, hierarchy: string) {
            debug.assertValue(arg, 'arg');
            debug.assertValue(hierarchy, 'hierarchy');

            super(SQExprKind.Hierarchy);
            this.arg = arg;
            this.hierarchy = hierarchy;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitHierarchy(this, arg);
        }
    }

    export class SQHierarchyLevelExpr extends SQExpr {
        public arg: SQExpr;
        public level: string;

        constructor(arg: SQExpr, level: string) {
            debug.assertValue(arg, 'arg');
            debug.assertValue(level, 'level');

            super(SQExprKind.HierarchyLevel);
            this.arg = arg;
            this.level = level;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitHierarchyLevel(this, arg);
        }
    }

    export class SQSelectRefExpr extends SQExpr {
        public expressionName: string;

        constructor(expressionName: string) {
            debug.assertValue(expressionName, 'arg');

            super(SQExprKind.SelectRef);
            this.expressionName = expressionName;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitSelectRef(this, arg);
        }
    }

    export class SQAndExpr extends SQExpr {
        left: SQExpr;
        right: SQExpr;

        constructor(left: SQExpr, right: SQExpr) {
            debug.assertValue(left, 'left');
            debug.assertValue(right, 'right');

            super(SQExprKind.And);
            this.left = left;
            this.right = right;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitAnd(this, arg);
        }
    }

    export class SQBetweenExpr extends SQExpr {
        arg: SQExpr;
        lower: SQExpr;
        upper: SQExpr;

        constructor(arg: SQExpr, lower: SQExpr, upper: SQExpr) {
            debug.assertValue(arg, 'arg');
            debug.assertValue(lower, 'lower');
            debug.assertValue(upper, 'upper');

            super(SQExprKind.Between);
            this.arg = arg;
            this.lower = lower;
            this.upper = upper;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitBetween(this, arg);
        }
    }

    export class SQInExpr extends SQExpr {
        args: SQExpr[];
        values: SQExpr[][];

        constructor(args: SQExpr[], values: SQExpr[][]) {
            debug.assertValue(args, 'args');
            debug.assertValue(values, 'values');

            super(SQExprKind.In);
            this.args = args;
            this.values = values;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitIn(this, arg);
        }
    }

    export class SQOrExpr extends SQExpr {
        left: SQExpr;
        right: SQExpr;

        constructor(left: SQExpr, right: SQExpr) {
            debug.assertValue(left, 'left');
            debug.assertValue(right, 'right');

            super(SQExprKind.Or);
            this.left = left;
            this.right = right;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitOr(this, arg);
        }
    }

    export class SQCompareExpr extends SQExpr {
        comparison: QueryComparisonKind;
        left: SQExpr;
        right: SQExpr;

        constructor(comparison: QueryComparisonKind, left: SQExpr, right: SQExpr) {
            debug.assertValue(comparison, 'kind');
            debug.assertValue(left, 'left');
            debug.assertValue(right, 'right');

            super(SQExprKind.Compare);
            this.comparison = comparison;
            this.left = left;
            this.right = right;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitCompare(this, arg);
        }
    }

    export class SQContainsExpr extends SQExpr {
        left: SQExpr;
        right: SQExpr;

        constructor(left: SQExpr, right: SQExpr) {
            debug.assertValue(left, 'left');
            debug.assertValue(right, 'right');

            super(SQExprKind.Contains);
            this.left = left;
            this.right = right;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitContains(this, arg);
        }
    }

    export class SQStartsWithExpr extends SQExpr {
        left: SQExpr;
        right: SQExpr;

        constructor(left: SQExpr, right: SQExpr) {
            debug.assertValue(left, 'left');
            debug.assertValue(right, 'right');

            super(SQExprKind.StartsWith);
            this.left = left;
            this.right = right;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitStartsWith(this, arg);
        }
    }

    export class SQExistsExpr extends SQExpr {
        arg: SQExpr;

        constructor(arg: SQExpr) {
            debug.assertValue(arg, 'arg');

            super(SQExprKind.Exists);
            this.arg = arg;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitExists(this, arg);
        }
    }

    export class SQNotExpr extends SQExpr {
        arg: SQExpr;

        constructor(arg: SQExpr) {
            debug.assertValue(arg, 'arg');

            super(SQExprKind.Not);
            this.arg = arg;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitNot(this, arg);
        }
    }

    export class SQConstantExpr extends SQExpr implements ISQConstantExpr {
        public type: ValueType;

        /** The native JavaScript representation of the value. */
        public value: any;

        /** The string encoded, lossless representation of the value. */
        public valueEncoded: string;

        constructor(type: ValueType, value: any, valueEncoded: string) {
            debug.assertValue(type, 'type');

            super(SQExprKind.Constant);
            this.type = type;
            this.value = value;
            this.valueEncoded = valueEncoded;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitConstant(this, arg);
        }

        public getMetadata(federatedSchema: FederatedConceptualSchema): SQExprMetadata {
            debug.assertValue(federatedSchema, 'federatedSchema');

            return {
                // Returning Measure as the kind for a SQConstantExpr is slightly ambiguous allowing the return object to conform to SQEXprMetadata.
                // A getType or similiar function in the future would be more appropriate. 
                kind: FieldKind.Measure,
                type: this.type,
            };
        }
    }

    export class SQDateSpanExpr extends SQExpr {
        public unit: TimeUnit;
        public arg: SQExpr;

        constructor(unit: TimeUnit, arg: SQExpr) {
            debug.assertValue(unit, 'unit');
            debug.assertValue(arg, 'arg');

            super(SQExprKind.DateSpan);
            this.unit = unit;
            this.arg = arg;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitDateSpan(this, arg);
        }
    }

    export class SQDateAddExpr extends SQExpr {
        public unit: TimeUnit;
        public amount: number;
        public arg: SQExpr;

        constructor(unit: TimeUnit, amount: number, arg: SQExpr) {
            debug.assertValue(unit, 'unit');
            debug.assertValue(amount, 'amount');
            debug.assertValue(arg, 'arg');

            super(SQExprKind.DateAdd);
            this.unit = unit;
            this.arg = arg;
            this.amount = amount;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitDateAdd(this, arg);
        }
    }

    export class SQNowExpr extends SQExpr {
        constructor() {
            super(SQExprKind.Now);
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitNow(this, arg);
        }
    }

    export class SQDefaultValueExpr extends SQExpr {
        constructor() {
            super(SQExprKind.DefaultValue);
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitDefaultValue(this, arg);
        }
    }

    export class SQAnyValueExpr extends SQExpr {
        constructor() {
            super(SQExprKind.AnyValue);
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitAnyValue(this, arg);
        }
    }

    export class SQFillRuleExpr extends SQExpr {
        public input: SQExpr;
        public rule: FillRuleDefinition;

        constructor(
            input: SQExpr,
            fillRule: FillRuleDefinition) {
            debug.assertValue(input, 'input');
            debug.assertValue(fillRule, 'fillRule');

            super(SQExprKind.FillRule);
            this.input = input;
            this.rule = fillRule;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitFillRule(this, arg);
        }
    }

    export class SQResourcePackageItemExpr extends SQExpr {
        public packageName: string;
        public packageType: number;
        public itemName: string;

        constructor(packageName: string, packageType: number, itemName: string) {
            debug.assertValue(packageName, 'packageName');
            debug.assertValue(itemName, 'itemName');

            super(SQExprKind.ResourcePackageItem);
            this.packageName = packageName;
            this.packageType = packageType;
            this.itemName = itemName;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitResourcePackageItem(this, arg);
        }
    }

    export class SQTransformTableRefExpr extends SQExpr {
        public source: string;

        constructor(source: string) {
            debug.assertValue(source, 'source');

            super(SQExprKind.TransformTableRef);
            this.source = source;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitTransformTableRef(this, arg);
        }
    }

    export class SQTransformOutputRoleRefExpr extends SQExpr {
        public role: string;
        public transform: string;

        constructor(role: string, transform?: string) {
            debug.assertValue(role, 'role');

            super(SQExprKind.TransformOutputRoleRef);

            this.role = role;
            if (transform)
                this.transform = transform;
        }

        public accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T {
            return visitor.visitTransformOutputRoleRef(this, arg);
        }
    }

    /** Provides utilities for creating & manipulating expressions. */
    export module SQExprBuilder {
        export function entity(schema: string, entity: string, variable?: string): SQEntityExpr {
            return new SQEntityExpr(schema, entity, variable);
        }

        export function columnRef(source: SQExpr, prop: string): SQColumnRefExpr {
            return new SQColumnRefExpr(source, prop);
        }

        export function measureRef(source: SQExpr, prop: string): SQMeasureRefExpr {
            return new SQMeasureRefExpr(source, prop);
        }

        export function aggregate(source: SQExpr, aggregate: QueryAggregateFunction): SQAggregationExpr {
            return new SQAggregationExpr(source, aggregate);
        }

        export function selectRef(expressionName: string): SQSelectRefExpr {
            return new SQSelectRefExpr(expressionName);
        }

        export function percentile(source: SQExpr, k: number, exclusive: boolean): SQPercentileExpr {
            return new SQPercentileExpr(source, k, exclusive);
        }

        export function arithmetic(left: SQExpr, right: SQExpr, operator: ArithmeticOperatorKind): SQArithmeticExpr {
            return new SQArithmeticExpr(left, right, operator);
        }

        export function scopedEval(expression: SQExpr, scope: SQExpr[]): SQScopedEvalExpr {
            return new SQScopedEvalExpr(expression, scope);
        }
        
        export function withRef(expressionName: string): SQWithRefExpr {
            return new SQWithRefExpr(expressionName);
        }

        export function hierarchy(source: SQExpr, hierarchy: string): SQHierarchyExpr {
            return new SQHierarchyExpr(source, hierarchy);
        }

        export function propertyVariationSource(source: SQExpr, name: string, property: string): SQPropertyVariationSourceExpr {
            return new SQPropertyVariationSourceExpr(source, name, property);
        }

        export function hierarchyLevel(source: SQExpr, level: string): SQHierarchyLevelExpr {
            return new SQHierarchyLevelExpr(source, level);
        }

        export function transformTableRef(source: string) {
            return new SQTransformTableRefExpr(source);
        }

        export function transformOutputRoleRef(role: string, transform?: string) {
            return new SQTransformOutputRoleRefExpr(role, transform);
        }

        export function and(left: SQExpr, right: SQExpr): SQExpr {
            if (!left)
                return right;
            if (!right)
                return left;

            return new SQAndExpr(left, right);
        }

        export function between(arg: SQExpr, lower: SQExpr, upper: SQExpr): SQBetweenExpr {
            return new SQBetweenExpr(arg, lower, upper);
        }

        export function inExpr(args: SQExpr[], values: SQExpr[][]): SQInExpr {
            return new SQInExpr(args, values);
        }

        export function or(left: SQExpr, right: SQExpr): SQExpr {
            if (!left)
                return right;
            if (!right)
                return left;
            if (left instanceof SQInExpr && right instanceof SQInExpr) {
                let inExpr = tryUseInExprs(<SQInExpr>left, <SQInExpr>right);
                if (inExpr)
                    return inExpr;
            }

            return new SQOrExpr(left, right);
        }

        function tryUseInExprs(left: SQInExpr, right: SQInExpr): SQInExpr {
            if (!left.args || !right.args)
                return;

            let leftArgLen = left.args.length;
            let rightArgLen = right.args.length;
            if (leftArgLen !== rightArgLen)
                return;

            for (let i = 0; i < leftArgLen; ++i) {
                if (!SQExpr.equals(left.args[i], right.args[i]))
                    return;
            }

            let combinedValues = left.values.concat(right.values);
            return SQExprBuilder.inExpr(left.args, combinedValues);
        }

        export function compare(kind: QueryComparisonKind, left: SQExpr, right: SQExpr): SQCompareExpr {
            return new SQCompareExpr(kind, left, right);
        }

        export function contains(left: SQExpr, right: SQExpr): SQContainsExpr {
            return new SQContainsExpr(left, right);
        }

        export function exists(arg: SQExpr): SQExistsExpr {
            return new SQExistsExpr(arg);
        }

        export function equal(left: SQExpr, right: SQExpr): SQCompareExpr {
            return compare(QueryComparisonKind.Equal, left, right);
        }

        export function not(arg: SQExpr): SQNotExpr {
            return new SQNotExpr(arg);
        }

        export function startsWith(left: SQExpr, right: SQExpr): SQStartsWithExpr {
            return new SQStartsWithExpr(left, right);
        }

        export function nullConstant(): SQConstantExpr {
            return new SQConstantExpr(
                ValueType.fromExtendedType(ExtendedType.Null),
                null,
                PrimitiveValueEncoding.nullEncoding());
        }

        export function now(): SQNowExpr {
            return new SQNowExpr();
        }

        export function defaultValue(): SQDefaultValueExpr {
            return new SQDefaultValueExpr();
        }

        export function anyValue(): SQAnyValueExpr {
            return new SQAnyValueExpr();
        }

        export function boolean(value: boolean): SQConstantExpr {
            return new SQConstantExpr(
                ValueType.fromExtendedType(ExtendedType.Boolean),
                value,
                PrimitiveValueEncoding.boolean(value));
        }

        export function dateAdd(unit: TimeUnit, amount: number, arg: SQExpr): SQDateAddExpr {
            return new SQDateAddExpr(unit, amount, arg);
        }

        export function dateTime(value: Date, valueEncoded?: string): SQConstantExpr {
            if (valueEncoded === undefined)
                valueEncoded = PrimitiveValueEncoding.dateTime(value);

            return new SQConstantExpr(ValueType.fromExtendedType(ExtendedType.DateTime), value, valueEncoded);
        }

        export function dateSpan(unit: TimeUnit, arg: SQExpr): SQDateSpanExpr {
            return new SQDateSpanExpr(unit, arg);
        }

        export function decimal(value: number, valueEncoded?: string): SQConstantExpr {
            if (valueEncoded === undefined)
                valueEncoded = PrimitiveValueEncoding.decimal(value);

            return new SQConstantExpr(ValueType.fromExtendedType(ExtendedType.Decimal), value, valueEncoded);
        }

        export function double(value: number, valueEncoded?: string): SQConstantExpr {
            if (valueEncoded === undefined)
                valueEncoded = PrimitiveValueEncoding.double(value);

            return new SQConstantExpr(ValueType.fromExtendedType(ExtendedType.Double), value, valueEncoded);
        }

        export function integer(value: number, valueEncoded?: string): SQConstantExpr {
            if (valueEncoded === undefined)
                valueEncoded = PrimitiveValueEncoding.integer(value);

            return new SQConstantExpr(ValueType.fromExtendedType(ExtendedType.Integer), value, valueEncoded);
        }

        export function text(value: string, valueEncoded?: string): SQConstantExpr {
            debug.assert(!valueEncoded || valueEncoded === PrimitiveValueEncoding.text(value), 'Incorrect encoded value specified.');

            return new SQConstantExpr(
                ValueType.fromExtendedType(ExtendedType.Text),
                value,
                valueEncoded || PrimitiveValueEncoding.text(value));
        }

        /** Returns an SQExpr that evaluates to the constant value. */
        export function typedConstant(value: PrimitiveValue, type: ValueTypeDescriptor): SQConstantExpr {
            if (value == null)
                return nullConstant();

            if (_.isBoolean(value)) {
                return boolean(<boolean>value);
            }

            if (_.isString(value)) {
                return text(<string>value);
            }

            if (_.isNumber(value)) {
                if (type.integer && Double.isInteger(<number>value))
                    return integer(<number>value);

                return double(<number>value);
            }

            if (value instanceof Date) {
                return dateTime(value);
            }
        }

        export function setAggregate(expr: SQExpr, aggregate: QueryAggregateFunction): SQExpr {
            return FieldExprChangeAggregateRewriter.rewrite(expr, aggregate);
        }

        export function removeAggregate(expr: SQExpr): SQExpr {
            return FieldExprRemoveAggregateRewriter.rewrite(expr);
        }

        export function setPercentOfGrandTotal(expr: SQExpr): SQExpr {
            return SQExprSetPercentOfGrandTotalRewriter.rewrite(expr);
        }

        export function removePercentOfGrandTotal(expr: SQExpr): SQExpr {
            return SQExprRemovePercentOfGrandTotalRewriter.rewrite(expr);
        }

        export function removeEntityVariables(expr: SQExpr): SQExpr {
            return SQExprRemoveEntityVariablesRewriter.rewrite(expr);
        }

        export function fillRule(expr: SQExpr, rule: FillRuleDefinition): SQFillRuleExpr {
            debug.assertValue(expr, 'expr');
            debug.assertValue(rule, 'rule');

            return new SQFillRuleExpr(expr, rule);
        }

        export function resourcePackageItem(packageName: string, packageType: number, itemName: string): SQResourcePackageItemExpr {
            return new SQResourcePackageItemExpr(packageName, packageType, itemName);
        }
    }

    /** Provides utilities for obtaining information about expressions. */
    export module SQExprInfo {
        export function getAggregate(expr: SQExpr): QueryAggregateFunction {
            return SQExprAggregateInfoVisitor.getAggregate(expr);
        }
    }

    class SQExprEqualityVisitor implements ISQExprVisitorWithArg<boolean, SQExpr>, IFillRuleDefinitionVisitor<boolean, boolean> {
        private static instance: SQExprEqualityVisitor = new SQExprEqualityVisitor(/* ignoreCase */ false);
        private static ignoreCaseInstance: SQExprEqualityVisitor = new SQExprEqualityVisitor(true);
        private ignoreCase: boolean;

        public static run(x: SQExpr, y: SQExpr, ignoreCase?: boolean): boolean {
            // Normalize falsy to null
            x = x || null;
            y = y || null;

            if (x === y)
                return true;

            if (!x !== !y)
                return false;

            debug.assertValue(x, 'x');
            debug.assertValue(y, 'y');
            if (ignoreCase)
                return x.accept(SQExprEqualityVisitor.ignoreCaseInstance, y);

            return x.accept(SQExprEqualityVisitor.instance, y);
        }

        constructor(ignoreCase: boolean) {
            this.ignoreCase = ignoreCase;
        }

        public visitColumnRef(expr: SQColumnRefExpr, comparand: SQColumnRefExpr): boolean {
            return comparand instanceof SQColumnRefExpr &&
                expr.ref === comparand.ref &&
                this.equals(expr.source, comparand.source);
        }

        public visitMeasureRef(expr: SQMeasureRefExpr, comparand: SQMeasureRefExpr): boolean {
            return comparand instanceof SQMeasureRefExpr &&
                expr.ref === comparand.ref &&
                this.equals(expr.source, comparand.source);
        }

        public visitAggr(expr: SQAggregationExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQAggregationExpr &&
                expr.func === comparand.func &&
                this.equals(expr.arg, comparand.arg);
        }

        public visitPercentile(expr: SQPercentileExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQPercentileExpr &&
                expr.exclusive === comparand.exclusive &&
                expr.k === comparand.k &&
                this.equals(expr.arg, comparand.arg);
        }

        public visitHierarchy(expr: SQHierarchyExpr, comparand: SQHierarchyExpr): boolean {
            return comparand instanceof SQHierarchyExpr &&
                expr.hierarchy === comparand.hierarchy &&
                this.equals(expr.arg, comparand.arg);
        }

        public visitHierarchyLevel(expr: SQHierarchyLevelExpr, comparand: SQHierarchyLevelExpr): boolean {
            return comparand instanceof SQHierarchyLevelExpr &&
                expr.level === comparand.level &&
                this.equals(expr.arg, comparand.arg);
        }

        public visitPropertyVariationSource(expr: SQPropertyVariationSourceExpr, comparand: SQPropertyVariationSourceExpr): boolean {
            return comparand instanceof SQPropertyVariationSourceExpr &&
                expr.name === comparand.name &&
                expr.property === comparand.property &&
                this.equals(expr.arg, comparand.arg);
        }

        public visitSelectRef(expr: SQSelectRefExpr, comparand: SQSelectRefExpr): boolean {
            return comparand instanceof SQSelectRefExpr &&
                expr.expressionName === comparand.expressionName;
        }

        public visitBetween(expr: SQBetweenExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQBetweenExpr &&
                this.equals(expr.arg, comparand.arg) &&
                this.equals(expr.lower, comparand.lower) &&
                this.equals(expr.upper, comparand.upper);
        }

        public visitIn(expr: SQInExpr, comparand: SQExpr): boolean {
            if (!(comparand instanceof SQInExpr) || !this.equalsAll(expr.args, comparand.args))
                return false;

            let values = expr.values,
                compareValues = (<SQInExpr>comparand).values;
            if (values.length !== compareValues.length)
                return false;

            for (let i = 0, len = values.length; i < len; i++) {
                if (!this.equalsAll(values[i], compareValues[i]))
                    return false;
            }

            return true;
        }

        public visitEntity(expr: SQEntityExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQEntityExpr &&
                expr.schema === comparand.schema &&
                expr.entity === comparand.entity &&
                this.optionalEqual(expr.variable, comparand.variable);
        }

        public visitAnd(expr: SQAndExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQAndExpr &&
                this.equals(expr.left, comparand.left) &&
                this.equals(expr.right, comparand.right);
        }

        public visitOr(expr: SQOrExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQOrExpr &&
                this.equals(expr.left, comparand.left) &&
                this.equals(expr.right, comparand.right);
        }

        public visitCompare(expr: SQCompareExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQCompareExpr &&
                expr.comparison === comparand.comparison &&
                this.equals(expr.left, comparand.left) &&
                this.equals(expr.right, comparand.right);
        }

        public visitContains(expr: SQContainsExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQContainsExpr &&
                this.equals(expr.left, comparand.left) &&
                this.equals(expr.right, comparand.right);
        }

        public visitDateSpan(expr: SQDateSpanExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQDateSpanExpr &&
                expr.unit === comparand.unit &&
                this.equals(expr.arg, comparand.arg);
        }

        public visitDateAdd(expr: SQDateAddExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQDateAddExpr &&
                expr.unit === comparand.unit &&
                expr.amount === comparand.amount &&
                this.equals(expr.arg, comparand.arg);
        }

        public visitExists(expr: SQExistsExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQExistsExpr &&
                this.equals(expr.arg, comparand.arg);
        }

        public visitNot(expr: SQNotExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQNotExpr &&
                this.equals(expr.arg, comparand.arg);
        }

        public visitNow(expr: SQNowExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQNowExpr;
        }

        public visitDefaultValue(expr: SQDefaultValueExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQDefaultValueExpr;
        }

        public visitAnyValue(expr: SQAnyValueExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQAnyValueExpr;
        }

        public visitResourcePackageItem(expr: SQResourcePackageItemExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQResourcePackageItemExpr &&
                expr.packageName === comparand.packageName &&
                expr.packageType === comparand.packageType &&
                expr.itemName === comparand.itemName;
        }

        public visitStartsWith(expr: SQStartsWithExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQStartsWithExpr &&
                this.equals(expr.left, comparand.left) &&
                this.equals(expr.right, comparand.right);
        }

        public visitConstant(expr: SQConstantExpr, comparand: SQExpr): boolean {
            if (comparand instanceof SQConstantExpr && expr.type === comparand.type)
                return expr.type.text && this.ignoreCase ?
                    StringExtensions.equalIgnoreCase(expr.valueEncoded, comparand.valueEncoded) :
                    expr.valueEncoded === comparand.valueEncoded;

            return false;
        }

        public visitFillRule(expr: SQFillRuleExpr, comparand: SQExpr): boolean {
            if (comparand instanceof SQFillRuleExpr && this.equals(expr.input, comparand.input)) {
                let leftRule = expr.rule,
                    rightRule = comparand.rule;

                if (leftRule === rightRule)
                    return true;

                let leftLinearGradient2 = leftRule.linearGradient2,
                    rightLinearGradient2 = rightRule.linearGradient2;
                if (leftLinearGradient2 && rightLinearGradient2) {
                    return this.visitLinearGradient2(leftLinearGradient2, rightLinearGradient2);
                }

                let leftLinearGradient3 = leftRule.linearGradient3,
                    rightLinearGradient3 = rightRule.linearGradient3;
                if (leftLinearGradient3 && rightLinearGradient3) {
                    return this.visitLinearGradient3(leftLinearGradient3, rightLinearGradient3);
                }
            }

            return false;
        }

        public visitLinearGradient2(left2: LinearGradient2Definition, right2: LinearGradient2Definition): boolean {
            debug.assertValue(left2, 'left2');
            debug.assertValue(right2, 'right2');

            return this.equalsFillRuleStop(left2.min, right2.min) &&
                this.equalsFillRuleStop(left2.max, right2.max);
        }

        public visitLinearGradient3(left3: LinearGradient3Definition, right3: LinearGradient3Definition): boolean {
            debug.assertValue(left3, 'left3');
            debug.assertValue(right3, 'right3');

            return this.equalsFillRuleStop(left3.min, right3.min) &&
                this.equalsFillRuleStop(left3.mid, right3.mid) &&
                this.equalsFillRuleStop(left3.max, right3.max);
        }

        private equalsFillRuleStop(stop1: RuleColorStopDefinition, stop2: RuleColorStopDefinition): boolean {
            debug.assertValue(stop1, 'stop1');
            debug.assertValue(stop2, 'stop2');

            if (!this.equals(stop1.color, stop2.color))
                return false;

            if (!stop1.value)
                return stop1.value === stop2.value;

            return this.equals(stop1.value, stop2.value);
        }

        public visitArithmetic(expr: SQArithmeticExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQArithmeticExpr &&
                expr.operator === comparand.operator &&
                this.equals(expr.left, comparand.left) &&
                this.equals(expr.right, comparand.right);
        }

        public visitScopedEval(expr: SQScopedEvalExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQScopedEvalExpr &&
                this.equals(expr.expression, comparand.expression) &&
                this.equalsAll(expr.scope, comparand.scope);
        }
        
        public visitWithRef(expr: SQWithRefExpr, comparand: SQExpr): boolean {
            return  comparand instanceof SQWithRefExpr &&
                expr.expressionName === comparand.expressionName;
        }

        public visitTransformTableRef(expr: SQTransformTableRefExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQTransformTableRefExpr &&
                expr.source === comparand.source;
        }

        public visitTransformOutputRoleRef(expr: SQTransformOutputRoleRefExpr, comparand: SQExpr): boolean {
            return comparand instanceof SQTransformOutputRoleRefExpr &&
                expr.role === comparand.role &&
                expr.transform === comparand.transform;
        }

        private optionalEqual(x: string, y: string) {
            // Only check equality if both values are specified.
            if (x && y)
                return x === y;

            return true;
        }

        private equals(x: SQExpr, y: SQExpr): boolean {
            return x.accept(this, y);
        }

        private equalsAll(x: SQExpr[], y: SQExpr[]): boolean {
            let len = x.length;
            if (len !== y.length)
                return false;

            for (let i = 0; i < len; i++) {
                if (!this.equals(x[i], y[i]))
                    return false;
            }

            return true;
        }
    }

    /** Rewrites a root-level expression. */
    class SQExprRootRewriter extends DefaultSQExprVisitor<SQExpr> {
        public visitDefault(expr: SQExpr): SQExpr {
            return expr;
        }
    }

    export const enum SQExprValidationError {
        invalidAggregateFunction,
        invalidSchemaReference,
        invalidEntityReference,
        invalidColumnReference,
        invalidMeasureReference,
        invalidHierarchyReference,
        invalidHierarchyLevelReference,
        invalidLeftOperandType,
        invalidRightOperandType,
        invalidValueType,
        invalidPercentileArgument,
        invalidScopeArgument,
    }

    export class SQExprValidationVisitor extends SQExprRewriter {
        public errors: SQExprValidationError[];
        private schema: FederatedConceptualSchema;
        private aggrUtils: ISQAggregationOperations;

        constructor(schema: FederatedConceptualSchema, aggrUtils: ISQAggregationOperations, errors?: SQExprValidationError[]) {
            debug.assertValue(schema, 'schema');
            debug.assertValue(aggrUtils, 'aggrUtils');

            super();
            this.schema = schema;
            this.aggrUtils = aggrUtils;
            if (errors)
                this.errors = errors;
        }

        public visitIn(expr: SQInExpr): SQExpr {
            let inExpr = <SQInExpr>super.visitIn(expr);
            let args = inExpr.args;
            let values = inExpr.values;
            for (let valueTuple of values) {
                debug.assert(valueTuple.length === args.length, 'args and value tuple are not the same length');
                for (let i = 0, len = valueTuple.length; i < len; ++i)
                    this.validateCompatibleType(args[i], valueTuple[i]);
            }

            return inExpr;
        }

        public visitCompare(expr: SQCompareExpr): SQExpr {
            let compareExpr = <SQCompareExpr>super.visitCompare(expr);
            this.validateCompatibleType(compareExpr.left, compareExpr.right);

            return compareExpr;
        }

        public visitColumnRef(expr: SQColumnRefExpr): SQExpr {
            let fieldExpr = SQExprConverter.asFieldPattern(expr);
            if (fieldExpr) {
                let fieldExprItem = FieldExprPattern.toFieldExprEntityItemPattern(fieldExpr);
                let entity = this.validateEntity(fieldExprItem.schema, fieldExprItem.entity);
                if (entity) {
                    let prop = entity.properties.withName(fieldExpr.column.name);
                    if (!prop ||
                        prop.kind !== ConceptualPropertyKind.Column ||
                        !this.isQueryable(fieldExpr))
                        this.register(SQExprValidationError.invalidColumnReference);
                }
            }
            return expr;
        }

        public visitMeasureRef(expr: SQMeasureRefExpr): SQExpr {
            let fieldExpr = SQExprConverter.asFieldPattern(expr);
            if (fieldExpr) {
                let fieldExprItem = FieldExprPattern.toFieldExprEntityItemPattern(fieldExpr);
                let entity = this.validateEntity(fieldExprItem.schema, fieldExprItem.entity);
                if (entity) {
                    let prop = entity.properties.withName(fieldExpr.measure.name);
                    if (!prop ||
                        prop.kind !== ConceptualPropertyKind.Measure ||
                        !this.isQueryable(fieldExpr))
                        this.register(SQExprValidationError.invalidMeasureReference);
                }
            }
            return expr;
        }

        public visitAggr(expr: SQAggregationExpr): SQExpr {
            let aggregateExpr = <SQAggregationExpr>super.visitAggr(expr);

            let columnRefExpr = SQExprColumnRefInfoVisitor.getColumnRefSQExpr(this.schema, aggregateExpr.arg);
            if (columnRefExpr) {
                if (!this.aggrUtils.isSupportedAggregate(expr, this.schema, expr.func, /*targetTypes*/null, /*forConsumption*/true))
                    this.register(SQExprValidationError.invalidAggregateFunction);
            }

            return aggregateExpr;
        }

        public visitHierarchy(expr: SQHierarchyExpr): SQExpr {
            let fieldExpr = SQExprConverter.asFieldPattern(expr);
            if (fieldExpr) {
                let fieldExprItem: FieldExprHierarchyPattern = <FieldExprHierarchyPattern>fieldExpr.hierarchy;
                if (fieldExprItem) {
                    this.validateHierarchy(fieldExprItem.schema, fieldExprItem.entity, fieldExprItem.name);
                } else {
                    this.register(SQExprValidationError.invalidHierarchyReference);
                }
            }
            return expr;
        }

        public visitHierarchyLevel(expr: SQHierarchyLevelExpr): SQExpr {
            let fieldExpr = SQExprConverter.asFieldPattern(expr);
            if (fieldExpr) {
                let hierarchyLevelFieldExprItem: FieldExprHierarchyLevelPattern = <FieldExprHierarchyLevelPattern>fieldExpr.hierarchyLevel;
                if (hierarchyLevelFieldExprItem) {
                    this.validateHierarchyLevel(hierarchyLevelFieldExprItem.schema, hierarchyLevelFieldExprItem.entity, hierarchyLevelFieldExprItem.name, hierarchyLevelFieldExprItem.level);
                } else if (!fieldExpr.columnHierarchyLevelVariation) {
                    this.register(SQExprValidationError.invalidHierarchyLevelReference);
                }
            }
            return expr;
        }

        public visitPercentile(expr: SQPercentileExpr): SQExpr {
            expr.arg.accept(this);

            if (_.isEmpty(this.errors)) {
                let argMetadata = expr.arg.getMetadata(this.schema);
                if (!argMetadata ||
                    argMetadata.kind !== FieldKind.Column ||
                    !(argMetadata.type && (argMetadata.type.integer || argMetadata.type.numeric))) {
                    this.register(SQExprValidationError.invalidPercentileArgument);
                }
            }

            return expr;
        }

        public visitEntity(expr: SQEntityExpr): SQExpr {
            this.validateEntity(expr.schema, expr.entity);
            return expr;
        }

        public visitContains(expr: SQContainsExpr): SQExpr {
            this.validateOperandsAndTypeForStartOrContains(expr.left, expr.right);
            return expr;
        }

        public visitStartsWith(expr: SQContainsExpr): SQExpr {
            this.validateOperandsAndTypeForStartOrContains(expr.left, expr.right);
            return expr;
        }

        public visitArithmetic(expr: SQArithmeticExpr): SQExpr {
            this.validateArithmeticTypes(expr.left, expr.right);
            return expr;
        }

        public visitScopedEval(expr: SQScopedEvalExpr): SQExpr {
            for (let scopeRef of expr.scope) {
                if (!(SQExpr.isWithRef(scopeRef) || SQExpr.isColumn(scopeRef))) {
                    this.register(SQExprValidationError.invalidScopeArgument);
                }
            }
            return expr;
        }
        
        public visitWithRef(expr: SQWithRefExpr): SQExpr {
            return expr;
        }

        public visitTransformTableRef(expr: SQTransformTableRefExpr): SQExpr {
            return expr;
        }

        public visitTransformOutputRoleRef(expr: SQTransformOutputRoleRefExpr): SQExpr {
            return expr;
        }

        private validateOperandsAndTypeForStartOrContains(left: SQExpr, right: SQExpr): void {
            if (left instanceof SQColumnRefExpr) {
                this.visitColumnRef(<SQColumnRefExpr>left);
            } else if (left instanceof SQHierarchyLevelExpr) {
                this.visitHierarchyLevel(<SQHierarchyLevelExpr>left);
            } else {
                this.register(SQExprValidationError.invalidLeftOperandType);
            }

            if (!(right instanceof SQConstantExpr) || !(<SQConstantExpr>right).type.text)
                this.register(SQExprValidationError.invalidRightOperandType);
            else
                this.validateCompatibleType(left, right);
        }

        private validateArithmeticTypes(left: SQExpr, right: SQExpr): void {
            if (!SQExprUtils.supportsArithmetic(left, this.schema))
                this.register(SQExprValidationError.invalidLeftOperandType);
            if (!SQExprUtils.supportsArithmetic(right, this.schema))
                this.register(SQExprValidationError.invalidRightOperandType);
        }

        private validateCompatibleType(left: SQExpr, right: SQExpr): void {
            let leftMetadata = left.getMetadata(this.schema),
                leftType = leftMetadata && leftMetadata.type,
                rightMetadata = right.getMetadata(this.schema),
                rightType = rightMetadata && rightMetadata.type;

            if (leftType && rightType && !leftType.isCompatibleFrom(rightType))
                this.register(SQExprValidationError.invalidValueType);
        }

        private validateEntity(schemaName: string, entityName: string): ConceptualEntity {
            let schema = this.schema.schema(schemaName);
            if (schema) {
                let entity = schema.entities.withName(entityName);
                if (entity)
                    return entity;

                this.register(SQExprValidationError.invalidEntityReference);
            }
            else {
                this.register(SQExprValidationError.invalidSchemaReference);
            }
        }

        private validateHierarchy(schemaName: string, entityName: string, hierarchyName: string): ConceptualHierarchy {
            let entity = this.validateEntity(schemaName, entityName);
            if (entity) {
                let hierarchy = entity.hierarchies.withName(hierarchyName);
                if (hierarchy)
                    return hierarchy;

                this.register(SQExprValidationError.invalidHierarchyReference);
            }
        }

        private validateHierarchyLevel(schemaName: string, entityName: string, hierarchyName: string, levelName: string): ConceptualHierarchyLevel {
            let hierarchy = this.validateHierarchy(schemaName, entityName, hierarchyName);
            if (hierarchy) {
                let hierarchyLevel = hierarchy.levels.withName(levelName);
                if (hierarchyLevel)
                    return hierarchyLevel;

                this.register(SQExprValidationError.invalidHierarchyLevelReference);
            }
        }

        private register(error: SQExprValidationError) {
            if (!this.errors)
                this.errors = [];
            this.errors.push(error);
        }

        private isQueryable(fieldExpr: FieldExprPattern): boolean {
            let fieldExprItem = FieldExprPattern.toFieldExprEntityItemPattern(fieldExpr);
            if (fieldExpr.hierarchyLevel || fieldExpr.hierarchyLevelAggr) {
                let hierarchyLevelConceptualProperty = SQHierarchyExprUtils.getConceptualHierarchyLevelFromExpr(this.schema, fieldExpr);
                return hierarchyLevelConceptualProperty && hierarchyLevelConceptualProperty.column.queryable !== ConceptualQueryableState.Error;
            }

            return this.schema.schema(fieldExprItem.schema).findProperty(fieldExprItem.entity, FieldExprPattern.getPropertyName(fieldExpr)).queryable !== ConceptualQueryableState.Error;
        }
    }

    /** Returns an expression's aggregate function, or undefined if it doesn't have one. */
    class SQExprAggregateInfoVisitor extends DefaultSQExprVisitor<QueryAggregateFunction> {
        public visitAggr(expr: SQAggregationExpr): QueryAggregateFunction {
            return expr.func;
        }

        public visitDefault(expr: SQExpr): QueryAggregateFunction {
            return;
        }

        public static getAggregate(expr: SQExpr): QueryAggregateFunction {
            let visitor = new SQExprAggregateInfoVisitor();
            return expr.accept(visitor);
        }
    }

    /** Returns a SQExprColumnRef expression or undefined.*/
    class SQExprColumnRefInfoVisitor extends DefaultSQExprVisitor<SQColumnRefExpr> {
        private schema: FederatedConceptualSchema;

        constructor(schema: FederatedConceptualSchema) {
            super();
            this.schema = schema;
        }

        public visitColumnRef(expr: SQColumnRefExpr): SQColumnRefExpr {
            return expr;
        }

        public visitHierarchyLevel(expr: SQHierarchyLevelExpr): SQColumnRefExpr {
            let ref: string = expr.level;
            let hierarchy = <SQHierarchyExpr>(expr.arg);
            let sourceExpr: SQColumnRefExpr = hierarchy.accept(this);

            if (hierarchy && hierarchy.arg instanceof SQPropertyVariationSourceExpr) {
                let propertyVariationSource = <SQPropertyVariationSourceExpr>hierarchy.arg;
                let targetEntity = sourceExpr.getTargetEntityForVariation(this.schema, propertyVariationSource.name);

                if (sourceExpr && targetEntity) {
                    let schemaName = (<SQEntityExpr>(sourceExpr.source)).schema;
                    let targetEntityExpr = SQExprBuilder.entity(schemaName, targetEntity);
                    let schemaHierarchy = this.schema.schema(schemaName).findHierarchy(targetEntity, hierarchy.hierarchy);

                    if (schemaHierarchy) {
                        for (let level of schemaHierarchy.levels)
                            if (level.name === ref)
                                return new SQColumnRefExpr(targetEntityExpr, level.column.name);
                    }
                }
            }
            else {
                let entityExpr = <SQEntityExpr>(hierarchy.arg);
                let hierarchyLevelRef = SQHierarchyExprUtils.getConceptualHierarchyLevel(this.schema,
                    entityExpr.schema,
                    entityExpr.entity,
                    hierarchy.hierarchy,
                    expr.level);

                if (hierarchyLevelRef)
                    return new SQColumnRefExpr(hierarchy.arg, hierarchyLevelRef.column.name);
            }
        }

        public visitHierarchy(expr: SQHierarchyExpr): SQColumnRefExpr {
            return expr.arg.accept(this);
        }

        public visitPropertyVariationSource(expr: SQPropertyVariationSourceExpr): SQColumnRefExpr {
            let propertyName = expr.property;
            return new SQColumnRefExpr(expr.arg, propertyName);
        }

        public visitAggr(expr: SQAggregationExpr): SQColumnRefExpr {
            return expr.arg.accept(this);
        }

        public visitDefault(expr: SQExpr): SQColumnRefExpr {
            return;
        }

        public static getColumnRefSQExpr(schema: FederatedConceptualSchema, expr: SQExpr): SQColumnRefExpr {
            let visitor = new SQExprColumnRefInfoVisitor(schema);
            return expr.accept(visitor);
        }
    }

    /** Returns a SQEntityExpr expression or undefined.*/
    class SQEntityExprInfoVisitor extends DefaultSQExprVisitor<SQEntityExpr> {
        private schema: FederatedConceptualSchema;

        constructor(schema: FederatedConceptualSchema) {
            super();
            this.schema = schema;
        }

        public visitEntity(expr: SQEntityExpr): SQEntityExpr {
            return expr;
        }

        public visitColumnRef(expr: SQColumnRefExpr): SQEntityExpr {
            return SQEntityExprInfoVisitor.getEntity(expr);
        }

        public visitHierarchyLevel(expr: SQHierarchyLevelExpr): SQEntityExpr {
            let columnRef = SQEntityExprInfoVisitor.getColumnRefSQExpr(this.schema, expr);
            return SQEntityExprInfoVisitor.getEntity(columnRef);
        }

        public visitHierarchy(expr: SQHierarchyExpr): SQEntityExpr {
            return expr.arg.accept(this);
        }

        public visitPropertyVariationSource(expr: SQPropertyVariationSourceExpr): SQEntityExpr {
            let columnRef = SQEntityExprInfoVisitor.getColumnRefSQExpr(this.schema, expr);
            return SQEntityExprInfoVisitor.getEntity(columnRef);
        }

        public visitAggr(expr: SQAggregationExpr): SQEntityExpr {
            let columnRef = SQEntityExprInfoVisitor.getColumnRefSQExpr(this.schema, expr);
            return SQEntityExprInfoVisitor.getEntity(columnRef);
        }

        public visitMeasureRef(expr: SQMeasureRefExpr): SQEntityExpr {
            return expr.source.accept(this);
        }

        public static getColumnRefSQExpr(schema: FederatedConceptualSchema, expr: SQExpr): SQColumnRefExpr {
            let visitor = new SQExprColumnRefInfoVisitor(schema);
            return expr.accept(visitor);
        }

        public static getEntity(columnRef: SQColumnRefExpr): SQEntityExpr {
            let field = SQExprConverter.asFieldPattern(columnRef);
            let column = field.column;
            return SQExprBuilder.entity(column.schema, column.entity, column.entityVar);
        }

        public static getEntityExpr(schema: FederatedConceptualSchema, expr: SQExpr): SQEntityExpr {
            let visitor = new SQEntityExprInfoVisitor(schema);
            return expr.accept(visitor);
        }
    }

    class SQExprChangeAggregateRewriter extends SQExprRootRewriter {
        private func: QueryAggregateFunction;

        constructor(func: QueryAggregateFunction) {
            debug.assertValue(func, 'func');

            super();
            this.func = func;
        }

        public visitAggr(expr: SQAggregationExpr): SQExpr {
            if (expr.func === this.func)
                return expr;

            return new SQAggregationExpr(expr.arg, this.func);
        }

        public visitColumnRef(expr: SQColumnRefExpr): SQExpr {
            return new SQAggregationExpr(expr, this.func);
        }

        public static rewrite(expr: SQExpr, func: QueryAggregateFunction): SQExpr {
            debug.assertValue(expr, 'expr');
            debug.assertValue(func, 'func');

            let rewriter = new SQExprChangeAggregateRewriter(func);
            return expr.accept(rewriter);
        }
    }

    class FieldExprChangeAggregateRewriter implements IFieldExprPatternVisitor<SQExpr> {
        private sqExpr: SQExpr;
        private aggregate: QueryAggregateFunction;

        constructor(sqExpr: SQExpr, aggregate: QueryAggregateFunction) {
            this.sqExpr = sqExpr;
            this.aggregate = aggregate;
        }

        public static rewrite(sqExpr: SQExpr, aggregate: QueryAggregateFunction): SQExpr {
            return FieldExprPattern.visit(sqExpr, new FieldExprChangeAggregateRewriter(sqExpr, aggregate));
        }

        public visitPercentOfGrandTotal(pattern: FieldExprPercentOfGrandTotalPattern): SQExpr {
            pattern.baseExpr = SQExprConverter.asFieldPattern(
                SQExprChangeAggregateRewriter.rewrite(
                    SQExprBuilder.fieldExpr(pattern.baseExpr),
                    this.aggregate));
            return SQExprBuilder.fieldExpr({ percentOfGrandTotal: pattern });
        }

        public visitColumn(column: FieldExprColumnPattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitColumnAggr(columnAggr: FieldExprColumnAggrPattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitColumnHierarchyLevelVariation(columnHierarchyLevelVariation: FieldExprColumnHierarchyLevelVariationPattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitSelectRef(selectRef: FieldExprSelectRefPattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitEntity(entity: FieldExprEntityPattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitEntityAggr(entityAggr: FieldExprEntityAggrPattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitHierarchy(hierarchy: FieldExprHierarchyPattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitHierarchyLevel(hierarchyLevel: FieldExprHierarchyLevelPattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitHierarchyLevelAggr(hierarchyLevelAggr: FieldExprHierarchyLevelAggrPattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitMeasure(measure: FieldExprMeasurePattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitPercentile(percentile: FieldExprPercentilePattern): SQExpr {
            return this.defaultRewrite();
        }

        private defaultRewrite(): SQExpr {
            return SQExprChangeAggregateRewriter.rewrite(this.sqExpr, this.aggregate);
        }
    }

    class FieldExprRemoveAggregateRewriter implements IFieldExprPatternVisitor<SQExpr> {

        constructor(private sqExpr: SQExpr) {
        }

        public static rewrite(sqExpr: SQExpr): SQExpr {
            return FieldExprPattern.visit(sqExpr, new FieldExprRemoveAggregateRewriter(sqExpr));
        }

        public visitPercentOfGrandTotal(pattern: FieldExprPercentOfGrandTotalPattern): SQExpr {
            return FieldExprRemoveAggregateRewriter.rewrite(SQExprBuilder.fieldExpr(pattern.baseExpr));
        }

        public visitColumn(column: FieldExprColumnPattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitColumnAggr(columnAggr: FieldExprColumnAggrPattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitColumnHierarchyLevelVariation(columnHierarchyLevelVariation: FieldExprColumnHierarchyLevelVariationPattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitSelectRef(selectRef: FieldExprSelectRefPattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitEntity(entity: FieldExprEntityPattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitEntityAggr(entityAggr: FieldExprEntityAggrPattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitHierarchy(hierarchy: FieldExprHierarchyPattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitHierarchyLevel(hierarchyLevel: FieldExprHierarchyLevelPattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitHierarchyLevelAggr(hierarchyLevelAggr: FieldExprHierarchyLevelAggrPattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitMeasure(measure: FieldExprMeasurePattern): SQExpr {
            return this.defaultRewrite();
        }

        public visitPercentile(percentile: FieldExprPercentilePattern): SQExpr {
            return this.defaultRewrite();
        }

        private defaultRewrite(): SQExpr {
            return SQExprRemoveAggregateRewriter.rewrite(this.sqExpr);
        }
    }

    class SQExprRemoveAggregateRewriter extends SQExprRootRewriter {
        private static instance: SQExprRemoveAggregateRewriter = new SQExprRemoveAggregateRewriter();

        public visitAggr(expr: SQAggregationExpr): SQExpr {
            return expr.arg;
        }

        public static rewrite(expr: SQExpr): SQExpr {
            debug.assertValue(expr, 'expr');

            return expr.accept(SQExprRemoveAggregateRewriter.instance);
        }
    }

    class SQExprRemoveEntityVariablesRewriter extends SQExprRewriter {
        private static instance: SQExprRemoveEntityVariablesRewriter = new SQExprRemoveEntityVariablesRewriter();

        public visitEntity(expr: SQEntityExpr): SQExpr {
            if (expr.variable)
                return SQExprBuilder.entity(expr.schema, expr.entity);

            return expr;
        }

        public static rewrite(expr: SQExpr): SQExpr {
            debug.assertValue(expr, 'expr');

            return expr.accept(SQExprRemoveEntityVariablesRewriter.instance);
        }
    }

    class SQExprRemovePercentOfGrandTotalRewriter extends SQExprRootRewriter {
        private static instance: SQExprRemovePercentOfGrandTotalRewriter = new SQExprRemovePercentOfGrandTotalRewriter();

        public static rewrite(expr: SQExpr): SQExpr {
            debug.assertValue(expr, 'expr');
            return expr.accept(SQExprRemovePercentOfGrandTotalRewriter.instance);
        }

        public visitDefault(expr: SQExpr): SQExpr {
            let fieldExpr = SQExprConverter.asFieldPattern(expr);
            if (fieldExpr && fieldExpr.percentOfGrandTotal)
                expr = SQExprBuilder.fieldExpr(fieldExpr.percentOfGrandTotal.baseExpr);

            return expr;
        }
    }

    class SQExprSetPercentOfGrandTotalRewriter extends SQExprRootRewriter {
        private static instance: SQExprSetPercentOfGrandTotalRewriter = new SQExprSetPercentOfGrandTotalRewriter();

        public static rewrite(expr: SQExpr): SQExpr {
            debug.assertValue(expr, 'expr');
            return expr.accept(SQExprSetPercentOfGrandTotalRewriter.instance);
        }

        public visitDefault(expr: SQExpr): SQExpr {
            let fieldExpr = SQExprConverter.asFieldPattern(expr);
            if (fieldExpr && !fieldExpr.percentOfGrandTotal)
                expr = SQExprBuilder.fieldExpr({ percentOfGrandTotal: { baseExpr: SQExprConverter.asFieldPattern(expr) } });

            return expr;
        }
    }
}