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
    import ConceptualEntity = powerbi.data.ConceptualEntity;
    import ConceptualMultiplicity = powerbi.data.ConceptualMultiplicity;
    import SQEntityExpr = powerbi.data.SQEntityExpr;
    import StringExtensions = jsCommon.StringExtensions;

    export module SQExprUtils {
        export function supportsArithmetic(expr: SQExpr, schema: FederatedConceptualSchema): boolean {
            let metadata = expr.getMetadata(schema),
                type = metadata && metadata.type;

            if (!metadata || !type) {
                return false;
            }
            
            return type.numeric || type.dateTime || type.duration;
        }

        export function indexOfExpr(items: SQExpr[], searchElement: SQExpr): number {
            debug.assertValue(items, 'items');
            debug.assertValue(searchElement, 'searchElement');

            for (let i = 0, len = items.length; i < len; i++) {
                if (SQExpr.equals(items[i], searchElement))
                    return i;
            }
            return -1;
        }
        
        export function indexOfNamedExpr(items: NamedSQExpr[], searchElement: SQExpr): number {
            debug.assertValue(items, 'items');
            debug.assertValue(searchElement, 'searchElement');

            for (let i = 0, len = items.length; i < len; i++) {
                let item = items[i];
                if (item && SQExpr.equals(item.expr, searchElement))
                    return i;
            }
            return -1;
        }

        export function sequenceEqual(x: SQExpr[], y: SQExpr[]): boolean {
            debug.assertValue(x, 'x');
            debug.assertValue(y, 'y');

            let len = x.length;
            if (len !== y.length)
                return false;

            for (let i = 0; i < len; i++) {
                if (!SQExpr.equals(x[i], y[i]))
                    return false;
            }

            return true;
        }
        
        export function uniqueName(namedItems: NamedSQExpr[], expr: SQExpr, exprDefaultName?: string): string {
            debug.assertValue(namedItems, 'namedItems');

            // Determine all names
            let names: { [name: string]: boolean } = {};
            for (let i = 0, len = namedItems.length; i < len; i++)
                names[namedItems[i].name] = true;

            return StringExtensions.findUniqueName(names, exprDefaultName || defaultName(expr));
        }

        /** Generates a default expression name  */
        export function defaultName(expr: SQExpr, fallback: string = 'select'): string {
            if (!expr)
                return fallback;

            return expr.accept(SQExprDefaultNameGenerator.instance, fallback);
        }

        /** Gets a value indicating whether the expr is a model measure or an aggregate. */
        export function isMeasure(expr: SQExpr): boolean {
            debug.assertValue(expr, 'expr');

            return expr.accept(IsMeasureVisitor.instance);
        }

        /** Gets a value indicating whether the expr is an AnyValue or equals comparison to AnyValue*/
        export function isAnyValue(expr: SQExpr): boolean {
            debug.assertValue(expr, 'expr');

            return expr.accept(IsAnyValueVisitor.instance);
        }

        /** Gets a value indicating whether the expr is a DefaultValue or equals comparison to DefaultValue*/
        export function isDefaultValue(expr: SQExpr): boolean {
            debug.assertValue(expr, 'expr');

            return expr.accept(IsDefaultValueVisitor.instance);
        }

        export function discourageAggregation(expr: SQExpr, schema: FederatedConceptualSchema): boolean {
            let capabilities = getSchemaCapabilities(expr, schema);
            return capabilities && capabilities.discourageQueryAggregateUsage;
        }

        export function getAggregateBehavior(expr: SQExpr, schema: FederatedConceptualSchema): ConceptualAggregateBehavior {
            debug.assertValue(expr, 'expr');
            debug.assertValue(schema, 'schema');

            let column = getConceptualColumn(expr, schema);
            if (column)
                return column.aggregateBehavior;
        }

        export function getSchemaCapabilities(expr: SQExpr, schema: FederatedConceptualSchema): ConceptualCapabilities {
            debug.assertValue(expr, 'expr');
            debug.assertValue(schema, 'schema');

            let field = SQExprConverter.asFieldPattern(expr);
            if (!field)
                return;

            let fieldExprItem = FieldExprPattern.toFieldExprEntityItemPattern(field);
            let conceptualSchema = schema.schema(fieldExprItem.schema);
            if (conceptualSchema)
                return conceptualSchema.capabilities;
        }

        export function getKpiMetadata(expr: SQExpr, schema: FederatedConceptualSchema): DataViewKpiColumnMetadata {
            let kpiStatusProperty = getKpiStatusProperty(expr, schema);
            if (kpiStatusProperty)
                return kpiStatusProperty.kpiValue.measure.kpi.statusMetadata;

            let kpiTrendProperty = getKpiTrendProperty(expr, schema);
            if (kpiTrendProperty)
                return kpiTrendProperty.kpiValue.measure.kpi.trendMetadata;
        }

        export function getConceptualEntity(entityExpr: SQEntityExpr, schema: FederatedConceptualSchema): ConceptualEntity {
            debug.assertValue(entityExpr, 'entityExpr');

            let conceptualEntity = schema
                .schema(entityExpr.schema)
                .entities
                .withName(entityExpr.entity);
            return conceptualEntity;
        }

        function getKpiStatusProperty(expr: SQExpr, schema: FederatedConceptualSchema): ConceptualProperty {
            let property = expr.getConceptualProperty(schema);
            if (!property)
                return;

            let kpiValue = property.kpiValue;
            if (kpiValue && kpiValue.measure.kpi.status === property)
                return property;
        }

        function getKpiTrendProperty(expr: SQExpr, schema: FederatedConceptualSchema): ConceptualProperty {
            let property = expr.getConceptualProperty(schema);
            if (!property)
                return;

            let kpiValue = property.kpiValue;
            if (kpiValue && kpiValue.measure.kpi.trend === property)
                return property;
        }

        export function getDefaultValue(fieldSQExpr: SQExpr, schema: FederatedConceptualSchema): SQConstantExpr {
            let column = getConceptualColumn(fieldSQExpr, schema);
            if (column)
                return column.defaultValue;
        }

        function getConceptualColumn(fieldSQExpr: SQExpr, schema: FederatedConceptualSchema): ConceptualColumn {
            if (!fieldSQExpr || !schema)
                return;

            let sqField = SQExprConverter.asFieldPattern(fieldSQExpr);
            if (!sqField)
                return;

            let column: FieldExprPropertyPattern = sqField.column;

            if (column) {
                if (schema.schema(column.schema) && sqField.column.name) {
                    let property = schema.schema(column.schema).findProperty(column.entity, sqField.column.name);

                    if (property)
                        return property.column;
                }
            }
            else {
                let hierarchyLevelField: FieldExprHierarchyLevelPattern = sqField.hierarchyLevel;
                if (hierarchyLevelField) {
                    let fieldExprItem = FieldExprPattern.toFieldExprEntityItemPattern(sqField);
                    let schemaName = fieldExprItem.schema;
                    if (schema.schema(schemaName)) {
                        let hierarchy = schema.schema(schemaName)
                            .findHierarchy(fieldExprItem.entity, hierarchyLevelField.name);

                        if (hierarchy) {
                            let hierarchyLevel: ConceptualHierarchyLevel = hierarchy.levels.withName(hierarchyLevelField.level);
                            if (hierarchyLevel && hierarchyLevel.column)
                                return hierarchyLevel.column.column;
                        }
                    }
                }
            }
        }

        export function getDefaultValues(fieldSQExprs: SQExpr[], schema: FederatedConceptualSchema): SQConstantExpr[] {
            if (_.isEmpty(fieldSQExprs) || !schema)
                return;
            let result: SQConstantExpr[] = [];
            for (let sqExpr of fieldSQExprs) {
                let defaultValue = getDefaultValue(sqExpr, schema);
                if (defaultValue)
                    result.push(defaultValue);
            }
            return result;
        }

        /** Return compare or and expression for key value pairs. */
        export function getDataViewScopeIdentityComparisonExpr(fieldsExpr: SQExpr[], values: SQConstantExpr[]): SQExpr {
            debug.assert(fieldsExpr.length === values.length, "fileds and values need to be the same size");

            let compareExprs: SQCompareExpr[] = [];
            for (let i = 0; i < fieldsExpr.length; i++) {
                compareExprs.push(SQExprBuilder.compare(QueryComparisonKind.Equal, fieldsExpr[i], values[i]));
            }

            if (_.isEmpty(compareExprs))
                return;

            let resultExpr: SQExpr;
            for (let compareExpr of compareExprs) {
                resultExpr = SQExprBuilder.and(resultExpr, compareExpr);
            }

            return resultExpr;
        }

        export function getActiveTablesNames(queryDefn: data.SemanticQuery): string[] {
            let tables: string[] = [];
            let entitiesVisitor = new data.SQFromEntitiesVisitor();

            if (queryDefn) {
                let selectedItems = queryDefn.from();
                if (selectedItems !== undefined) {
                    for (let key of selectedItems.keys()) 
                        selectedItems.source(key).accept(entitiesVisitor, /*arg*/null);
                }
            }
            tables = _.map(entitiesVisitor.entities, (value: SQEntityExpr) => value.entity);
            return tables;
        }

        export function isRelatedToMany(
            schema: FederatedConceptualSchema,
            sourceExpr: SQEntityExpr,
            targetExpr: SQEntityExpr): boolean {

            return isRelated(schema, sourceExpr, targetExpr, ConceptualMultiplicity.ZeroOrOne, ConceptualMultiplicity.Many) ||
                isRelated(schema, targetExpr, sourceExpr, ConceptualMultiplicity.Many, ConceptualMultiplicity.ZeroOrOne);
        }

        export function isRelatedToOne(
            schema: FederatedConceptualSchema,
            sourceExpr: SQEntityExpr,
            targetExpr: SQEntityExpr): boolean {

            return isRelated(schema, sourceExpr, targetExpr, ConceptualMultiplicity.Many, ConceptualMultiplicity.ZeroOrOne) ||
                isRelated(schema, targetExpr, sourceExpr, ConceptualMultiplicity.ZeroOrOne, ConceptualMultiplicity.Many);
        }

        function isRelated(
            schema: FederatedConceptualSchema,
            sourceExpr: SQEntityExpr,
            targetExpr: SQEntityExpr,
            sourceMultiplicity: ConceptualMultiplicity,
            targetMultiplicity: ConceptualMultiplicity): boolean {

            let source = SQExprUtils.getConceptualEntity(sourceExpr, schema);
            debug.assertValue(source, "could not resolve conceptual entity form sourceExpr.");

            if (_.isEmpty(source.navigationProperties))
                return false;

            let target = SQExprUtils.getConceptualEntity(targetExpr, schema);
            debug.assertValue(target, "could not resolve conceptual entity form targetExpr.");

            let queue: ConceptualEntity[] = [];
            queue.push(source);

            // walk the relationship path from source.
            while (!_.isEmpty(queue)) {
                let current = queue.shift();

                let navProperties = current.navigationProperties;
                if (_.isEmpty(navProperties))
                    continue;

                for (let navProperty of navProperties) {
                    if (!navProperty.isActive)
                        continue;

                    if (navProperty.targetMultiplicity === targetMultiplicity && navProperty.sourceMultiplicity === sourceMultiplicity) {
                        if (navProperty.targetEntity === target)
                            return true;
                        queue.push(navProperty.targetEntity);
                    }
                }
            }

            return false;
        }

        export function isRelatedOneToOne(
            schema: FederatedConceptualSchema,
            sourceExpr: SQEntityExpr,
            targetExpr: SQEntityExpr): boolean {

            let source = SQExprUtils.getConceptualEntity(sourceExpr, schema);
            debug.assertValue(source, "could not resolve conceptual entity form sourceExpr.");
            let target = SQExprUtils.getConceptualEntity(targetExpr, schema);
            debug.assertValue(target, "could not resolve conceptual entity form targetExpr.");

            let sourceNavigations = source.navigationProperties;
            let targetNavigations = target.navigationProperties;

            if (_.isEmpty(sourceNavigations) && _.isEmpty(targetNavigations))
                return false;

            return hasOneToOneNavigation(sourceNavigations, target) || hasOneToOneNavigation(targetNavigations, source);
        }

        function hasOneToOneNavigation(navigationProperties: ArrayNamedItems<ConceptualNavigationProperty>, targetEntity: ConceptualEntity): boolean {
            if (_.isEmpty(navigationProperties))
                return false;

            for (let navigationProperty of navigationProperties) {
                if (!navigationProperty.isActive)
                    continue;

                if (navigationProperty.targetEntity !== targetEntity)
                    continue;

                if (navigationProperty.sourceMultiplicity === ConceptualMultiplicity.ZeroOrOne &&
                    navigationProperty.targetMultiplicity === ConceptualMultiplicity.ZeroOrOne) {
                    return true;
                }
            }

            return false;
        }

        /** Performs a union of the 2 arrays with SQExpr.equals as comparator to skip duplicate items,
            and returns a new array. When available, we should use _.unionWith from lodash. */
        export function concatUnique(leftExprs: SQExpr[], rightExprs: SQExpr[]): SQExpr[] {
            debug.assertValue(leftExprs, 'leftExprs');
            debug.assertValue(rightExprs, 'rightExprs');

            let concatExprs = ArrayExtensions.copy(leftExprs);
            for (let expr of rightExprs) {
                if (indexOfExpr(concatExprs, expr) === -1) {
                    concatExprs.push(expr);
                }
            }

            return concatExprs;
        }

        class SQExprDefaultNameGenerator extends DefaultSQExprVisitorWithArg<string, string> {
            public static instance: SQExprDefaultNameGenerator = new SQExprDefaultNameGenerator();

            public visitEntity(expr: SQEntityExpr): string {
                return expr.entity;
            }

            public visitColumnRef(expr: SQColumnRefExpr): string {
                return expr.source.accept(this) + '.' + expr.ref;
            }

            public visitMeasureRef(expr: SQMeasureRefExpr, fallback: string): string {
                return expr.source.accept(this) + '.' + expr.ref;
            }

            public visitAggr(expr: SQAggregationExpr, fallback: string): string {
                return QueryAggregateFunction[expr.func] + '(' + expr.arg.accept(this) + ')';
            }

            public visitPercentile(expr: SQPercentileExpr, fallback: string): string {
                let func = expr.exclusive
                    ? 'Percentile.Exc('
                    : 'Percentile.Inc(';

                return func + expr.arg.accept(this) + ', ' + expr.k + ')';
            }

            public visitArithmetic(expr: SQArithmeticExpr, fallback: string): string {
                return powerbi.data.getArithmeticOperatorName(expr.operator) + '(' + expr.left.accept(this) + ', ' + expr.right.accept(this) + ')';
            }

            public visitConstant(expr: SQConstantExpr): string {
                return 'const';
            }

            public visitTransformOutputRoleRef(expr: SQTransformOutputRoleRefExpr, fallback: string): string {
                let name = expr.role;
                if (expr.transform)
                    name += '.' + expr.transform;
                return name;
            }

            public visitDefault(expr: SQExpr, fallback: string): string {
                return fallback || 'expr';
            }
        }

        class IsMeasureVisitor extends DefaultSQExprVisitor<boolean> {
            public static instance: IsMeasureVisitor = new IsMeasureVisitor();

            public visitMeasureRef(expr: SQMeasureRefExpr): boolean {
                return true;
            }

            public visitAggr(expr: SQAggregationExpr): boolean {
                return true;
            }

            public visitArithmetic(expr: SQArithmeticExpr): boolean {
                return true;
            }

            public visitDefault(expr: SQExpr): boolean {
                return false;
            }
        }

        class IsDefaultValueVisitor extends DefaultSQExprVisitor<boolean> {
            public static instance: IsDefaultValueVisitor = new IsDefaultValueVisitor();

            public visitCompare(expr: SQCompareExpr): boolean {
                if (expr.comparison !== QueryComparisonKind.Equal)
                    return false;

                return expr.right.accept(this);
            }

            public visitAnd(expr: SQAndExpr): boolean {
                return expr.left.accept(this) && expr.right.accept(this);
            }

            public visitDefaultValue(expr: SQDefaultValueExpr): boolean {
                return true;
            }

            public visitDefault(expr: SQExpr): boolean {
                return false;
            }
        }

        class IsAnyValueVisitor extends DefaultSQExprVisitor<boolean> {
            public static instance: IsAnyValueVisitor = new IsAnyValueVisitor();

            public visitCompare(expr: SQCompareExpr): boolean {
                if (expr.comparison !== QueryComparisonKind.Equal)
                    return false;

                return expr.right.accept(this);
            }

            public visitAnd(expr: SQAndExpr): boolean {
                return expr.left.accept(this) && expr.right.accept(this);
            }

            public visitAnyValue(expr: SQAnyValueExpr): boolean {
                return true;
            }

            public visitDefault(expr: SQExpr): boolean {
                return false;
            }
        }
    }
}