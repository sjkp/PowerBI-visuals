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

    export interface QueryDefinition {
        Version?: number;
        From: EntitySource[];
        Where?: QueryFilter[];
        OrderBy?: QuerySortClause[];
        Select: QueryExpressionContainer[];
        GroupBy?: QueryExpressionContainer[];
        Transform?: QueryTransform[];
    }

    export interface FilterDefinition {
        Version?: number;
        From: EntitySource[];
        Where: QueryFilter[];
    }

    export enum EntitySourceType {
        Table = 0,
        Pod = 1,
        Expression = 2,
    }

    export interface EntitySource {
        Name: string;
        EntitySet?: string; // TODO: Remove this when Q&A Silverlight is removed and make Entity required
        Entity?: string;
        Schema?: string;
        Expression?: QueryExpressionContainer;
        Type?: EntitySourceType;
    }

    export interface QueryFilter {
        Target?: QueryExpressionContainer[];
        Condition: QueryExpressionContainer;
    }

    export interface QuerySortClause {
        Expression: QueryExpressionContainer;
        Direction: SortDirection;
    }

    export interface QueryExpressionContainer {
        Name?: string;

        SourceRef?: QuerySourceRefExpression;
        Column?: QueryColumnExpression;
        Measure?: QueryMeasureExpression;
        Aggregation?: QueryAggregationExpression;
        Percentile?: QueryPercentileExpression;
        Hierarchy?: QueryHierarchyExpression;
        HierarchyLevel?: QueryHierarchyLevelExpression;
        PropertyVariationSource?: QueryPropertyVariationSourceExpression;
        Subquery?: QuerySubqueryExpression;

        // Logical
        And?: QueryBinaryExpression;
        Between?: QueryBetweenExpression;
        In?: QueryInExpression;
        Or?: QueryBinaryExpression;
        Comparison?: QueryComparisonExpression;
        Not?: QueryNotExpression;
        Contains?: QueryContainsExpression;
        StartsWith?: QueryStartsWithExpression;
        Exists?: QueryExistsExpression;

        // Constants
        Boolean?: QueryBooleanExpression;
        DateTime?: QueryDateTimeExpression;
        DateTimeSecond?: QueryDateTimeSecondExpression;
        Date?: QueryDateTimeExpression;
        Decimal?: QueryDecimalExpression;
        Integer?: QueryIntegerExpression;
        Null?: QueryNullExpression;
        Number?: QueryNumberExpression;
        String?: QueryStringExpression;
        Literal?: QueryLiteralExpression;

        DateSpan?: QueryDateSpanExpression;
        DateAdd?: QueryDateAddExpression;
        Now?: QueryNowExpression;

        // Default Values
        DefaultValue?: QueryDefaultValueExpression;
        AnyValue?: QueryAnyValueExpression;

        Arithmetic?: QueryArithmeticExpression;

        // Evaluation Expressions
        ScopedEval?: QueryScopedEvalExpression;

        // Reference Expressions
        WithRef?: QueryWithRefExpression;

        // Transform Expressions
        TransformTableRef?: QueryTransformTableRefExpression;
        TransformOutputRoleRef?: QueryTransformOutputRoleRefExpression;

        // Client-only expressions
        FillRule?: QueryFillRuleExpression;
        ResourcePackageItem?: QueryResourcePackageItem;
        SelectRef?: QuerySelectRefExpression;
    }
    
    export interface QueryPropertyExpression {
        Expression: QueryExpressionContainer;
        Property: string;
    }

    export interface QueryColumnExpression extends QueryPropertyExpression {
    }

    export interface QueryMeasureExpression extends QueryPropertyExpression {
    }

    export interface QuerySourceRefExpression {
        Source: string;
    }

    export interface QuerySelectRefExpression {
        ExpressionName: string;
    }

    export interface QueryAggregationExpression {
        Function: QueryAggregateFunction;
        Expression: QueryExpressionContainer;
    }

    export interface QueryPercentileExpression {
        Expression: QueryExpressionContainer;
        K: number;
        Exclusive?: boolean;
    }

    export interface QueryHierarchyExpression {
        Expression: QueryExpressionContainer;
        Hierarchy: string;
    }

    export interface QueryHierarchyLevelExpression {
        Expression: QueryExpressionContainer;
        Level: string;
    }

    export interface QueryPropertyVariationSourceExpression {
        Expression: QueryExpressionContainer;
        Name: string;
        Property: string;
    }

    export interface QuerySubqueryExpression {
        Query: QueryDefinition;
    }

    export interface QueryBinaryExpression {
        Left: QueryExpressionContainer;
        Right: QueryExpressionContainer;
    }

    export interface QueryBetweenExpression {
        Expression: QueryExpressionContainer;
        LowerBound: QueryExpressionContainer;
        UpperBound: QueryExpressionContainer;
    }

    export interface QueryInExpression {
        Expressions: QueryExpressionContainer[];
        Values: QueryExpressionContainer[][];
    }

    export interface QueryComparisonExpression extends QueryBinaryExpression {
        ComparisonKind: QueryComparisonKind;
    }

    export interface QueryContainsExpression extends QueryBinaryExpression { }

    export interface QueryNotExpression {
        Expression: QueryExpressionContainer;
    }

    export interface QueryStartsWithExpression extends QueryBinaryExpression { }

    export interface QueryExistsExpression {
        Expression: QueryExpressionContainer;
    }

    export interface QueryConstantExpression<T> {
        Value: T;
    }

    export interface QueryLiteralExpression {
        Value: string;
    }

    export interface QueryBooleanExpression extends QueryConstantExpression<boolean> { }
    export interface QueryDateTimeExpression extends QueryConstantExpression<string> { }
    export interface QueryDateTimeSecondExpression extends QueryConstantExpression<string> { }
    export interface QueryDecimalExpression extends QueryConstantExpression<number> { }
    export interface QueryIntegerExpression extends QueryConstantExpression<number> { }
    export interface QueryNumberExpression extends QueryConstantExpression<string> { }
    export interface QueryNullExpression { }
    export interface QueryStringExpression extends QueryConstantExpression<string> { }

    export interface QueryDateSpanExpression {
        TimeUnit: TimeUnit;
        Expression: QueryExpressionContainer;
    }

    export interface QueryDateAddExpression {
        Amount: number;
        TimeUnit: TimeUnit;
        Expression: QueryExpressionContainer;
    }

    export interface QueryNowExpression { }

    export interface QueryDefaultValueExpression { }

    export interface QueryAnyValueExpression { }

    export interface QueryArithmeticExpression {
        Left: QueryExpressionContainer;
        Right: QueryExpressionContainer;
        Operator: ArithmeticOperatorKind;
    }

    export const enum ArithmeticOperatorKind {
        Add = 0,
        Subtract = 1,
        Multiply = 2,
        Divide = 3,
    }

    export function getArithmeticOperatorName(arithmeticOperatorKind: ArithmeticOperatorKind): string {
        switch (arithmeticOperatorKind) {
            case ArithmeticOperatorKind.Add:
                return "Add";
            case ArithmeticOperatorKind.Subtract:
                return "Subtract";
            case ArithmeticOperatorKind.Multiply:
                return "Multiply";
            case ArithmeticOperatorKind.Divide:
                return "Divide";
        }
        throw new Error('Unexpected ArithmeticOperatorKind: ' + arithmeticOperatorKind);
    }

    export interface QueryFillRuleExpression {
        Input: QueryExpressionContainer;
        FillRule: FillRuleGeneric<QueryExpressionContainer, QueryExpressionContainer>;
    }

    export interface QueryResourcePackageItem {
        PackageName: string;
        PackageType: number;
        ItemName: string;
    }

    export interface QueryScopedEvalExpression {
        Expression: QueryExpressionContainer;
        Scope: QueryExpressionContainer[];
    }

    export interface QueryWithRefExpression {
        ExpressionName: string;
    }

    export interface QueryTransformTableRefExpression {
        Source: string;
    }

    export interface QueryTransformOutputRoleRefExpression {
        Role: string;
        Transform?: string;
    }

    export enum TimeUnit {
        Day = 0,
        Week = 1,
        Month = 2,
        Year = 3,
        Decade = 4,
        Second = 5,
        Minute = 6,
        Hour = 7,
    }

    export enum QueryAggregateFunction {
        Sum = 0,
        Avg = 1,
        Count = 2,
        Min = 3,
        Max = 4,
        CountNonNull = 5,
        Median = 6,
        StandardDeviation = 7,
        Variance = 8,
    }

    export enum QueryComparisonKind {
        Equal = 0,
        GreaterThan = 1,
        GreaterThanOrEqual = 2,
        LessThan = 3,
        LessThanOrEqual = 4,
    }

    /** Defines semantic data types. */
    export enum SemanticType {
        None = 0x0,
        Number = 0x1,
        Integer = Number + 0x2,
        DateTime = 0x4,
        Time = 0x08,
        Date = DateTime + 0x10,
        Month = Integer + 0x20,
        Year = Integer + 0x40,
        YearAndMonth = 0x80,
        MonthAndDay = 0x100,
        Decade = Integer + 0x200,
        YearAndWeek = 0x400,
        String = 0x800,
        Boolean = 0x1000,
        Table = 0x2000,
        Range = 0x4000,
    }

    export interface QueryMetadata {
        Select?: SelectMetadata[];
        Filters?: FilterMetadata[];
    }

    // TODO: Stop using SemanticType and ConceptualDataCategory here (may need server contract changes)
    export interface SelectMetadata {
        Restatement: string;

        /* SemanticType or PrimitiveType. */
        Type?: number;

        Format?: string;
        DataCategory?: ConceptualDataCategory;

        /** The select projection name. */
        Name?: string;

        /* If defined, this indicates the KPI class*/
        kpiStatusGraphic?: string; // old version of kpi data

        /* If defined, this indicates the KPI metadata*/
        kpi?: DataViewKpiColumnMetadata;
    }

    export interface FilterMetadata {
        Restatement: string;
        Kind?: FilterKind;
        /** The expression being filtered.  This is reflected in the filter card UI. */
        expression?: QueryExpressionContainer;
    }

    export enum FilterKind {
        Default,
        Period,
    }

    export interface QueryTransform {
        Name: string;
        Algorithm: string;
        Input: QueryTransformInput;
        Output: QueryTransformOutput;
    }

    export interface QueryTransformInput {
        Parameters: QueryExpressionContainer[];
        Table?: QueryTransformTable;
    }

    export interface QueryTransformOutput {
        Table?: QueryTransformTable;
    }

    export interface QueryTransformTable {
        Name: string;
        Columns: QueryTransformTableColumn[];
    }

    export interface QueryTransformTableColumn {
        Role?: string;
        Expression: QueryExpressionContainer;
    }
}