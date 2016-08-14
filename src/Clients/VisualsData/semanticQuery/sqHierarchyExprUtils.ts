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

    export module SQHierarchyExprUtils {
        export function getConceptualHierarchyLevelFromExpr(
            conceptualSchema: FederatedConceptualSchema,
            fieldExpr: FieldExprPattern): ConceptualHierarchyLevel {
            let hierarchyLevel = getHierarchyLevel(fieldExpr);
            if (hierarchyLevel)
                return SQHierarchyExprUtils.getConceptualHierarchyLevel(
                    conceptualSchema,
                    hierarchyLevel.schema,
                    hierarchyLevel.entity,
                    hierarchyLevel.name,
                    hierarchyLevel.level);
        }

        export function getConceptualHierarchyLevel(
            conceptualSchema: FederatedConceptualSchema,
            schemaName: string,
            entity: string,
            hierarchy: string,
            hierarchyLevel: string): ConceptualHierarchyLevel {

            let schema = conceptualSchema.schema(schemaName);
            let conceptualHierarchy = schema.findHierarchy(entity, hierarchy);
            if (conceptualHierarchy) {
                return conceptualHierarchy.levels.withName(hierarchyLevel);
            }
        }

        export function getConceptualHierarchy(sqExpr: SQExpr, federatedSchema: FederatedConceptualSchema): ConceptualHierarchy {
            if (sqExpr instanceof SQHierarchyExpr) {
                let hierarchy = <SQHierarchyExpr>sqExpr;

                if (sqExpr.arg instanceof SQEntityExpr) {
                    let entityExpr = <SQEntityExpr>sqExpr.arg;
                    return federatedSchema
                        .schema(entityExpr.schema)
                        .findHierarchy(entityExpr.entity, hierarchy.hierarchy);
                } else if (sqExpr.arg instanceof SQPropertyVariationSourceExpr) {
                    let variationExpr = <SQPropertyVariationSourceExpr>sqExpr.arg;
                    let sourceEntityExpr = <SQEntityExpr>variationExpr.arg;
                    return federatedSchema
                        .schema(sourceEntityExpr.schema)
                        .findHierarchyByVariation(sourceEntityExpr.entity, variationExpr.property, variationExpr.name, hierarchy.hierarchy);
                }
            }
        }

        export function expandExpr(schema: FederatedConceptualSchema, expr: SQExpr, suppressHierarchyLevelExpansion?: boolean): SQExpr | SQExpr[] {
            return SQExprHierarchyToHierarchyLevelConverter.convert(expr, schema) ||
                SQExprVariationConverter.expand(expr, schema) ||
                // If we are calling expandExpr from suppressHierarchyLevelExpansion, we should not expand the hierarchylevels
                (!suppressHierarchyLevelExpansion && SQExprHierarchyLevelConverter.expand(expr, schema)) ||
                expr;
        }

        export function isHierarchyOrVariation(schema: FederatedConceptualSchema, expr: SQExpr): boolean {
            if (expr instanceof SQHierarchyExpr || expr instanceof SQHierarchyLevelExpr)
                return true;

            let conceptualProperty = expr.getConceptualProperty(schema);
            if (conceptualProperty) {
                let column = conceptualProperty.column;
                if (column && column.variations && column.variations.length > 0)
                    return true;
            }

            return false;
        }

        // Return column reference expression for hierarchy level expression.
        export function getSourceVariationExpr(hierarchyLevelExpr: data.SQHierarchyLevelExpr): SQColumnRefExpr {
            let fieldExprPattern: data.FieldExprPattern = data.SQExprConverter.asFieldPattern(hierarchyLevelExpr);
            if (fieldExprPattern.columnHierarchyLevelVariation) {
                let entity: data.SQExpr = SQExprBuilder.entity(fieldExprPattern.columnHierarchyLevelVariation.source.schema, fieldExprPattern.columnHierarchyLevelVariation.source.entity);

                return SQExprBuilder.columnRef(entity, fieldExprPattern.columnHierarchyLevelVariation.source.name);
            }
        }

        // Return hierarchy expression for hierarchy level expression.
        export function getSourceHierarchy(hierarchyLevelExpr: data.SQHierarchyLevelExpr): SQHierarchyExpr {
            let fieldExprPattern: data.FieldExprPattern = data.SQExprConverter.asFieldPattern(hierarchyLevelExpr);
            let hierarchyLevel = fieldExprPattern.hierarchyLevel;
            if (hierarchyLevel) {
                let entity: data.SQExpr = SQExprBuilder.entity(hierarchyLevel.schema, hierarchyLevel.entity, hierarchyLevel.entityVar);
                return SQExprBuilder.hierarchy(entity, hierarchyLevel.name);
            }
        }

        export function getHierarchySourceAsVariationSource(hierarchyLevelExpr: SQHierarchyLevelExpr): SQPropertyVariationSourceExpr {

            // Make sure the hierarchy level source is a hierarchy
            if (!(hierarchyLevelExpr.arg instanceof SQHierarchyExpr))
                return;
                        
            // Check if the hierarchy source if a variation
            let hierarchyRef = <SQHierarchyExpr>hierarchyLevelExpr.arg;
            if (hierarchyRef.arg instanceof SQPropertyVariationSourceExpr)
                return <SQPropertyVariationSourceExpr>hierarchyRef.arg;
        }

        /**
        * Returns true if firstExpr and secondExpr are levels in the same hierarchy and firstExpr is before secondExpr in allLevels.
        */
        export function areHierarchyLevelsOrdered(allLevels: SQHierarchyLevelExpr[], firstExpr: SQExpr, secondExpr: SQExpr): boolean {

            // Validate that both items hierarchy levels
            if (!(firstExpr instanceof SQHierarchyLevelExpr) || !(secondExpr instanceof SQHierarchyLevelExpr))
                return false;

            let firstLevel = <SQHierarchyLevelExpr>firstExpr;
            let secondLevel = <SQHierarchyLevelExpr>secondExpr;

            // Validate that both items belong to the same hierarchy
            if (!SQExpr.equals(firstLevel.arg, secondLevel.arg))
                return false;

            // Determine the order
            let firstIndex = SQExprUtils.indexOfExpr(allLevels, firstLevel);
            let secondIndex = SQExprUtils.indexOfExpr(allLevels, secondLevel);

            return firstIndex !== -1 && secondIndex !== -1 && firstIndex < secondIndex;
        }

        /**
         * Given an ordered set of levels and an ordered subset of those levels, returns the index where
         * expr should be inserted into the subset to maintain the correct order.
         */
        export function getInsertionIndex(allLevels: SQHierarchyLevelExpr[], orderedSubsetOfLevels: SQHierarchyLevelExpr[], expr: SQHierarchyLevelExpr): number {

            let insertIndex = 0;

            // Loop through the supplied levels until the insertion would no longer be in the correct order
            while (insertIndex < orderedSubsetOfLevels.length &&
                areHierarchyLevelsOrdered(allLevels, orderedSubsetOfLevels[insertIndex], expr)) {
                insertIndex++;
            }

            return insertIndex;
        }

        function getHierarchyLevel(fieldExpr: FieldExprPattern): FieldExprHierarchyLevelPattern {
            return fieldExpr.hierarchyLevel ||
                fieldExpr.hierarchyLevelAggr ||
                (fieldExpr.columnHierarchyLevelVariation && fieldExpr.columnHierarchyLevelVariation.level);
        }
    }

    export module SQExprHierarchyToHierarchyLevelConverter {
        export function convert(sqExpr: SQExpr, federatedSchema: FederatedConceptualSchema): SQExpr[] {
            debug.assertValue(sqExpr, 'sqExpr');
            debug.assertValue(federatedSchema, 'federatedSchema');

            if (sqExpr instanceof SQHierarchyExpr) {
                let hierarchyExpr = <SQHierarchyExpr>sqExpr;

                let conceptualHierarchy = SQHierarchyExprUtils.getConceptualHierarchy(hierarchyExpr, federatedSchema);
                if (conceptualHierarchy)
                    return _.map(conceptualHierarchy.levels, hierarchyLevel => SQExprBuilder.hierarchyLevel(sqExpr, hierarchyLevel.name));
            }
        }
    }

    module SQExprHierarchyLevelConverter {
        export function expand(expr: SQExpr, schema: FederatedConceptualSchema): SQExpr[] {
            debug.assertValue(expr, 'sqExpr');
            debug.assertValue(schema, 'federatedSchema');
            let exprs: SQExpr[] = [];

            if (expr instanceof SQHierarchyLevelExpr) {
                let fieldExpr = SQExprConverter.asFieldPattern(expr);
                if (fieldExpr.hierarchyLevel) {
                    let fieldExprItem = FieldExprPattern.toFieldExprEntityItemPattern(fieldExpr);
                    let hierarchy = schema
                        .schema(fieldExprItem.schema)
                        .findHierarchy(fieldExprItem.entity, fieldExpr.hierarchyLevel.name);

                    if (hierarchy) {
                        let hierarchyLevels = hierarchy.levels;
                        for (let hierarchyLevel of hierarchyLevels) {
                            if (hierarchyLevel.name === fieldExpr.hierarchyLevel.level) {
                                exprs.push(expr);
                                break;
                            }
                            else
                                exprs.push(
                                    SQExprBuilder.hierarchyLevel(
                                        SQExprBuilder.hierarchy(
                                            SQExprBuilder.entity(fieldExprItem.schema, fieldExprItem.entity, fieldExprItem.entityVar),
                                            hierarchy.name),
                                        hierarchyLevel.name)
                                );
                        }
                    }
                }
            }

            if (!_.isEmpty(exprs))
                return exprs;
        }
    }

    module SQExprVariationConverter {
        export function expand(expr: SQExpr, schema: FederatedConceptualSchema): SQExpr[] {
            debug.assertValue(expr, 'sqExpr');
            debug.assertValue(schema, 'federatedSchema');

            let exprs: SQExpr[];
            let conceptualProperty = expr.getConceptualProperty(schema);

            if (conceptualProperty) {
                let column = conceptualProperty.column;
                if (column && column.variations && column.variations.length > 0) {
                    let variations = column.variations;

                    // for SU11, we support only one variation
                    debug.assert(variations.length === 1, "variations.length");
                    let variation = variations[0];

                    let fieldExpr = SQExprConverter.asFieldPattern(expr);
                    let fieldExprItem = FieldExprPattern.toFieldExprEntityItemPattern(fieldExpr);

                    exprs = [];
                    if (variation.defaultHierarchy) {
                        let hierarchyExpr = SQExprBuilder.hierarchy(
                            SQExprBuilder.propertyVariationSource(
                                SQExprBuilder.entity(fieldExprItem.schema, fieldExprItem.entity, fieldExprItem.entityVar),
                                variation.name, conceptualProperty.name),
                            variation.defaultHierarchy.name);

                        for (let level of variation.defaultHierarchy.levels)
                            exprs.push(SQExprBuilder.hierarchyLevel(hierarchyExpr, level.name));
                    }
                }
            }

            return exprs;
        }
    }
}