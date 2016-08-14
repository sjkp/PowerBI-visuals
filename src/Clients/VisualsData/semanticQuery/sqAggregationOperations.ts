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
    import Agg = powerbi.data.QueryAggregateFunction;

    export interface ISQAggregationOperations {
        /** Returns an array of supported aggregates for a given expr and role type. */
        getSupportedAggregates(
            expr: SQExpr,
            schema: FederatedConceptualSchema,
            targetTypes: ValueTypeDescriptor[]): QueryAggregateFunction[];

        /* forConsumption optional argument may not be need when Min/Max(Date) becomes supported aggregate. See datetimeMinMaxSupported feature switch*/
        isSupportedAggregate(
            expr: SQExpr,
            schema: FederatedConceptualSchema,
            aggregate: QueryAggregateFunction,
            targetTypes: ValueTypeDescriptor[],
            forConsumption?: boolean): boolean;

        createExprWithAggregate(
            expr: SQExpr,
            schema: FederatedConceptualSchema,
            aggregateNonNumericFields: boolean,
            targetTypes: ValueTypeDescriptor[],
            preferredAggregate?: QueryAggregateFunction): SQExpr;
    }

    export function createSQAggregationOperations(datetimeMinMaxSupported: boolean): ISQAggregationOperations {
        return new SQAggregationOperations(datetimeMinMaxSupported);
    }

    class SQAggregationOperations implements ISQAggregationOperations {
        constructor(private datetimeMinMaxSupported: boolean) {
        }

        /* forConsumption optional argument may not be need when Min/Max(Date) becomes supported aggregate. See datetimeMinMaxSupported feature switch*/
        public getSupportedAggregates(
            expr: SQExpr,
            schema: FederatedConceptualSchema,
            targetTypes: ValueTypeDescriptor[],
            forConsumption?: boolean): QueryAggregateFunction[] {

            debug.assertValue(expr, 'expr');
            debug.assertValue(schema, 'schema');
            debug.assertAnyValue(targetTypes, 'targetTypes');

            let metadata = getMetadataForUnderlyingType(expr, schema);

            // don't use expr.validate as validate will be using this function and we end up in a recursive loop
            if (!metadata)
                return [];

            let valueType = metadata.type,
                fieldKind = metadata.kind,
                isPropertyIdentity = metadata.idOnEntityKey;

            if (!valueType)
                return [];

            // Cannot aggregate on model measures
            if (fieldKind === FieldKind.Measure)
                return [];

            if (valueType.numeric || valueType.integer) {
                let aggregates = [Agg.Sum, Agg.Avg, Agg.Min, Agg.Max, Agg.Count, Agg.CountNonNull, Agg.StandardDeviation, Agg.Variance];
                let fieldExpr = SQExprConverter.asFieldPattern(expr);
                let fieldExprItem = FieldExprPattern.toFieldExprEntityItemPattern(fieldExpr);

                let currentSchema = schema.schema(fieldExprItem.schema);
                if (currentSchema.capabilities.supportsMedian)
                    aggregates.push(Agg.Median);

                return aggregates;
            }

            let aggregates: QueryAggregateFunction[] = [];

            // Min/Max of DateTime
            if ((this.datetimeMinMaxSupported || forConsumption) &&
                valueType.dateTime &&
                (_.isEmpty(targetTypes) || ValueType.isCompatibleTo(valueType, targetTypes))) {
                aggregates.push(Agg.Min);
                aggregates.push(Agg.Max);
            }

            // The supported aggregation types for an identity field are restricted to 'Count Non-Null' (e.g. for the field well aggregation options)
            // but a valid semantic query can return a less-restricted aggregation option which we should honor. (e.g. this results from Q&A)
            let distinctCountAggExists = SQExprInfo.getAggregate(expr) === Agg.Count;
            if (!(isPropertyIdentity && !distinctCountAggExists))
                aggregates.push(Agg.Count);

            aggregates.push(Agg.CountNonNull);

            return aggregates;
        }

        /* forConsumption optional argument may not be need when Min/Max(Date) becomes supported aggregate. See datetimeMinMaxSupported feature switch*/
        public isSupportedAggregate(
            expr: SQExpr,
            schema: FederatedConceptualSchema,
            aggregate: QueryAggregateFunction,
            targetTypes: ValueTypeDescriptor[],
            forConsumption?: boolean): boolean {

            debug.assertValue(expr, 'expr');
            debug.assertValue(schema, 'schema');

            let supportedAggregates = this.getSupportedAggregates(expr, schema, targetTypes, forConsumption);
            return _.contains(supportedAggregates, aggregate);
        }

        public createExprWithAggregate(
            expr: SQExpr,
            schema: FederatedConceptualSchema,
            aggregateNonNumericFields: boolean,
            targetTypes: ValueTypeDescriptor[],
            preferredAggregate?: QueryAggregateFunction): SQExpr {

            debug.assertValue(expr, 'expr');
            debug.assertValue(schema, 'schema');

            let aggregate: QueryAggregateFunction;
            if (preferredAggregate != null && this.isSupportedAggregate(expr, schema, preferredAggregate, targetTypes)) {
                aggregate = preferredAggregate;
            }
            else {
                aggregate = expr.getDefaultAggregate(schema, aggregateNonNumericFields);
            }
            if (aggregate !== undefined)
                expr = SQExprBuilder.aggregate(expr, aggregate);

            return expr;
        }
    }

    function getMetadataForUnderlyingType(expr: SQExpr, schema: FederatedConceptualSchema): SQExprMetadata {
        // Unwrap the aggregate (if the expr has one), and look at the underlying type.
        let metadata = SQExprBuilder.removeAggregate(expr).getMetadata(schema);

        if (!metadata)
            metadata = expr.getMetadata(schema);

        return metadata;
    }
}