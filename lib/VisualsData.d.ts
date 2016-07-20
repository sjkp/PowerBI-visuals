






























































































declare module powerbi.data {
    /** Allows generic traversal and type discovery for a SQExpr tree. */
    interface ISQExprVisitorWithArg<T, TArg> {
        visitEntity(expr: SQEntityExpr, arg: TArg): T;
        visitColumnRef(expr: SQColumnRefExpr, arg: TArg): T;
        visitMeasureRef(expr: SQMeasureRefExpr, arg: TArg): T;
        visitAggr(expr: SQAggregationExpr, arg: TArg): T;
        visitPercentile(expr: SQPercentileExpr, arg: TArg): T;
        visitHierarchy(expr: SQHierarchyExpr, arg: TArg): T;
        visitHierarchyLevel(expr: SQHierarchyLevelExpr, arg: TArg): T;
        visitPropertyVariationSource(expr: SQPropertyVariationSourceExpr, arg: TArg): T;
        visitSelectRef(expr: SQSelectRefExpr, arg: TArg): T;
        visitAnd(expr: SQAndExpr, arg: TArg): T;
        visitBetween(expr: SQBetweenExpr, arg: TArg): T;
        visitIn(expr: SQInExpr, arg: TArg): T;
        visitOr(expr: SQOrExpr, arg: TArg): T;
        visitCompare(expr: SQCompareExpr, arg: TArg): T;
        visitContains(expr: SQContainsExpr, arg: TArg): T;
        visitExists(expr: SQExistsExpr, arg: TArg): T;
        visitNot(expr: SQNotExpr, arg: TArg): T;
        visitStartsWith(expr: SQStartsWithExpr, arg: TArg): T;
        visitConstant(expr: SQConstantExpr, arg: TArg): T;
        visitDateSpan(expr: SQDateSpanExpr, arg: TArg): T;
        visitDateAdd(expr: SQDateAddExpr, arg: TArg): T;
        visitNow(expr: SQNowExpr, arg: TArg): T;
        visitDefaultValue(expr: SQDefaultValueExpr, arg: TArg): T;
        visitAnyValue(expr: SQAnyValueExpr, arg: TArg): T;
        visitArithmetic(expr: SQArithmeticExpr, arg: TArg): T;
        visitFillRule(expr: SQFillRuleExpr, arg: TArg): T;
        visitResourcePackageItem(expr: SQResourcePackageItemExpr, arg: TArg): T;
        visitScopedEval(expr: SQScopedEvalExpr, arg: TArg): T;
        visitWithRef(expr: SQWithRefExpr, arg: TArg): T;
        visitTransformTableRef(expr: SQTransformTableRefExpr, arg: TArg): T;
        visitTransformOutputRoleRef(expr: SQTransformOutputRoleRefExpr, arg: TArg): T;
    }
    interface ISQExprVisitor<T> extends ISQExprVisitorWithArg<T, void> {
    }
    /** Default IQueryExprVisitorWithArg implementation that others may derive from. */
    class DefaultSQExprVisitorWithArg<T, TArg> implements ISQExprVisitorWithArg<T, TArg> {
        visitEntity(expr: SQEntityExpr, arg: TArg): T;
        visitColumnRef(expr: SQColumnRefExpr, arg: TArg): T;
        visitMeasureRef(expr: SQMeasureRefExpr, arg: TArg): T;
        visitAggr(expr: SQAggregationExpr, arg: TArg): T;
        visitPercentile(expr: SQPercentileExpr, arg: TArg): T;
        visitHierarchy(expr: SQHierarchyExpr, arg: TArg): T;
        visitHierarchyLevel(expr: SQHierarchyLevelExpr, arg: TArg): T;
        visitPropertyVariationSource(expr: SQPropertyVariationSourceExpr, arg: TArg): T;
        visitSelectRef(expr: SQSelectRefExpr, arg: TArg): T;
        visitBetween(expr: SQBetweenExpr, arg: TArg): T;
        visitIn(expr: SQInExpr, arg: TArg): T;
        visitAnd(expr: SQAndExpr, arg: TArg): T;
        visitOr(expr: SQOrExpr, arg: TArg): T;
        visitCompare(expr: SQCompareExpr, arg: TArg): T;
        visitContains(expr: SQContainsExpr, arg: TArg): T;
        visitExists(expr: SQExistsExpr, arg: TArg): T;
        visitNot(expr: SQNotExpr, arg: TArg): T;
        visitStartsWith(expr: SQStartsWithExpr, arg: TArg): T;
        visitConstant(expr: SQConstantExpr, arg: TArg): T;
        visitDateSpan(expr: SQDateSpanExpr, arg: TArg): T;
        visitDateAdd(expr: SQDateAddExpr, arg: TArg): T;
        visitNow(expr: SQNowExpr, arg: TArg): T;
        visitDefaultValue(expr: SQDefaultValueExpr, arg: TArg): T;
        visitAnyValue(expr: SQAnyValueExpr, arg: TArg): T;
        visitArithmetic(expr: SQArithmeticExpr, arg: TArg): T;
        visitFillRule(expr: SQFillRuleExpr, arg: TArg): T;
        visitResourcePackageItem(expr: SQResourcePackageItemExpr, arg: TArg): T;
        visitScopedEval(expr: SQScopedEvalExpr, arg: TArg): T;
        visitWithRef(expr: SQWithRefExpr, arg: TArg): T;
        visitTransformTableRef(expr: SQTransformTableRefExpr, arg: TArg): T;
        visitTransformOutputRoleRef(expr: SQTransformOutputRoleRefExpr, arg: TArg): T;
        visitDefault(expr: SQExpr, arg: TArg): T;
    }
    /** Default ISQExprVisitor implementation that others may derive from. */
    class DefaultSQExprVisitor<T> extends DefaultSQExprVisitorWithArg<T, void> implements ISQExprVisitor<T> {
    }
    /** Default ISQExprVisitor implementation that implements default traversal and that others may derive from. */
    class DefaultSQExprVisitorWithTraversal implements ISQExprVisitor<void>, IFillRuleDefinitionVisitor<void, void> {
        visitEntity(expr: SQEntityExpr): void;
        visitColumnRef(expr: SQColumnRefExpr): void;
        visitMeasureRef(expr: SQMeasureRefExpr): void;
        visitAggr(expr: SQAggregationExpr): void;
        visitPercentile(expr: SQPercentileExpr): void;
        visitHierarchy(expr: SQHierarchyExpr): void;
        visitHierarchyLevel(expr: SQHierarchyLevelExpr): void;
        visitPropertyVariationSource(expr: SQPropertyVariationSourceExpr): void;
        visitSelectRef(expr: SQSelectRefExpr): void;
        visitBetween(expr: SQBetweenExpr): void;
        visitIn(expr: SQInExpr): void;
        visitAnd(expr: SQAndExpr): void;
        visitOr(expr: SQOrExpr): void;
        visitCompare(expr: SQCompareExpr): void;
        visitContains(expr: SQContainsExpr): void;
        visitExists(expr: SQExistsExpr): void;
        visitNot(expr: SQNotExpr): void;
        visitStartsWith(expr: SQStartsWithExpr): void;
        visitConstant(expr: SQConstantExpr): void;
        visitDateSpan(expr: SQDateSpanExpr): void;
        visitDateAdd(expr: SQDateAddExpr): void;
        visitNow(expr: SQNowExpr): void;
        visitDefaultValue(expr: SQDefaultValueExpr): void;
        visitAnyValue(expr: SQAnyValueExpr): void;
        visitArithmetic(expr: SQArithmeticExpr): void;
        visitFillRule(expr: SQFillRuleExpr): void;
        visitLinearGradient2(gradient2: LinearGradient2Definition): void;
        visitLinearGradient3(gradient3: LinearGradient3Definition): void;
        visitResourcePackageItem(expr: SQResourcePackageItemExpr): void;
        visitScopedEval(expr: SQScopedEvalExpr): void;
        visitWithRef(expr: SQWithRefExpr): void;
        visitTransformTableRef(expr: SQTransformTableRefExpr): void;
        visitTransformOutputRoleRef(expr: SQTransformOutputRoleRefExpr): void;
        visitDefault(expr: SQExpr): void;
        private visitFillRuleStop(stop);
    }
}

declare module powerbi {
    /** Defines a custom enumeration data type, and its values. */
    interface IEnumType {
        /** Gets the members of the enumeration, limited to the validMembers, if appropriate. */
        members(validMembers?: EnumMemberValue[]): IEnumMember[];
    }
    function createEnumType(members: IEnumMember[]): IEnumType;
}

declare module powerbi {
    import SQExpr = powerbi.data.SQExpr;
    interface FillDefinition {
        solid?: {
            color?: SQExpr;
        };
        gradient?: {
            startColor?: SQExpr;
            endColor?: SQExpr;
        };
        pattern?: {
            patternKind?: SQExpr;
            color?: SQExpr;
        };
    }
    module FillDefinitionHelpers {
        function createSolidFillDefinition(color: string): FillDefinition;
        function createSolidFillSQExpr(color: string): SQExpr | StructuralObjectDefinition;
    }
    module FillSolidColorTypeDescriptor {
        /** Gets a value indicating whether the descriptor is nullable or not. */
        function nullable(descriptor: FillSolidColorTypeDescriptor): boolean;
    }
}

declare module powerbi {
    import SQExpr = powerbi.data.SQExpr;
    interface FillRuleTypeDescriptor {
    }
    interface FillRuleDefinition extends FillRuleGeneric<SQExpr, SQExpr> {
    }
    interface FillRule extends FillRuleGeneric<string, number> {
    }
    type LinearGradient2 = LinearGradient2Generic<string, number>;
    type LinearGradient3 = LinearGradient3Generic<string, number>;
    type LinearGradient2Definition = LinearGradient2Generic<SQExpr, SQExpr>;
    type LinearGradient3Definition = LinearGradient3Generic<SQExpr, SQExpr>;
    type RuleColorStopDefinition = RuleColorStopGeneric<SQExpr, SQExpr>;
    type RuleColorStop = RuleColorStopGeneric<string, number>;
    interface IFillRuleDefinitionVisitor<T2, T3> {
        visitLinearGradient2(linearGradient2: LinearGradient2Definition, arg?: any): T2;
        visitLinearGradient3(linearGradient3: LinearGradient3Definition, arg?: any): T3;
    }
}

declare module powerbi {
    import SQExpr = powerbi.data.SQExpr;
    interface ImageTypeDescriptor {
    }
    type ImageDefinition = ImageDefinitionGeneric<SQExpr>;
    module ImageDefinition {
        const urlType: ValueTypeDescriptor;
    }
}

declare module powerbi {
    import SQExpr = powerbi.data.SQExpr;
    interface ParagraphsTypeDescriptor {
    }
    type ParagraphsDefinition = ParagraphDefinition[];
    type ParagraphDefinition = ParagraphDefinitionGeneric<SQExpr>;
    type TextRunDefinition = TextRunDefinitionGeneric<SQExpr>;
    interface ParagraphDefinitionGeneric<TExpr> {
        horizontalTextAlignment?: string;
        textRuns: TextRunDefinitionGeneric<TExpr>[];
    }
    interface TextRunDefinitionGeneric<TExpr> {
        textStyle?: TextRunStyle;
        url?: string;
        value: string | TExpr;
    }
}

declare module powerbi {
    import SemanticFilter = powerbi.data.SemanticFilter;
    type StructuralObjectDefinition = FillDefinition | FillRuleDefinition | SemanticFilter | DefaultValueDefinition | ImageDefinition | ParagraphsDefinition;
    module StructuralTypeDescriptor {
        function isValid(type: StructuralTypeDescriptor): boolean;
    }
}

declare module powerbi {
    interface ValueTypeDescriptor {
        extendedType?: ExtendedType;
    }
    /** Describes a data value type, including a primitive type and extended type if any (derived from data category). */
    class ValueType implements ValueTypeDescriptor {
        private static typeCache;
        private underlyingType;
        private category;
        private temporalType;
        private geographyType;
        private miscType;
        private formattingType;
        private enumType;
        private scriptingType;
        /** Do not call the ValueType constructor directly. Use the ValueType.fromXXX methods. */
        constructor(type: ExtendedType, category?: string, enumType?: IEnumType);
        /** Creates or retrieves a ValueType object based on the specified ValueTypeDescriptor. */
        static fromDescriptor(descriptor: ValueTypeDescriptor): ValueType;
        /** Advanced: Generally use fromDescriptor instead. Creates or retrieves a ValueType object for the specified ExtendedType. */
        static fromExtendedType(extendedType: ExtendedType): ValueType;
        /** Creates or retrieves a ValueType object for the specified PrimitiveType and data category. */
        static fromPrimitiveTypeAndCategory(primitiveType: PrimitiveType, category?: string): ValueType;
        /** Creates a ValueType to describe the given IEnumType. */
        static fromEnum(enumType: IEnumType): ValueType;
        /** Determines if the specified type is compatible from at least one of the otherTypes. */
        static isCompatibleTo(type: ValueTypeDescriptor, otherTypes: ValueTypeDescriptor[]): boolean;
        /** Determines if the instance ValueType is convertable from the 'other' ValueType. */
        isCompatibleFrom(other: ValueType): boolean;
        /**
         * Determines if the instance ValueType is equal to the 'other' ValueType
         * @param {ValueType} other the other ValueType to check equality against
         * @returns True if the instance ValueType is equal to the 'other' ValueType
         */
        equals(other: ValueType): boolean;
        /** Gets the exact primitive type of this ValueType. */
        primitiveType: PrimitiveType;
        /** Gets the exact extended type of this ValueType. */
        extendedType: ExtendedType;
        /** Gets the data category string (if any) for this ValueType. */
        categoryString: string;
        /** Indicates whether the type represents text values. */
        text: boolean;
        /** Indicates whether the type represents any numeric value. */
        numeric: boolean;
        /** Indicates whether the type represents integer numeric values. */
        integer: boolean;
        /** Indicates whether the type represents Boolean values. */
        bool: boolean;
        /** Indicates whether the type represents any date/time values. */
        dateTime: boolean;
        /** Indicates whether the type represents duration values. */
        duration: boolean;
        /** Indicates whether the type represents binary values. */
        binary: boolean;
        /** Indicates whether the type represents none values. */
        none: boolean;
        /** Returns an object describing temporal values represented by the type, if it represents a temporal type. */
        temporal: TemporalType;
        /** Returns an object describing geographic values represented by the type, if it represents a geographic type. */
        geography: GeographyType;
        /** Returns an object describing the specific values represented by the type, if it represents a miscellaneous extended type. */
        misc: MiscellaneousType;
        /** Returns an object describing the formatting values represented by the type, if it represents a formatting type. */
        formatting: FormattingType;
        /** Returns an object describing the enum values represented by the type, if it represents an enumeration type. */
        enum: IEnumType;
        scripting: ScriptType;
    }
    class ScriptType implements ScriptTypeDescriptor {
        private underlyingType;
        constructor(type: ExtendedType);
        source: boolean;
    }
    class TemporalType implements TemporalTypeDescriptor {
        private underlyingType;
        constructor(type: ExtendedType);
        year: boolean;
        month: boolean;
        paddedDateTableDate: boolean;
    }
    class GeographyType implements GeographyTypeDescriptor {
        private underlyingType;
        constructor(type: ExtendedType);
        address: boolean;
        city: boolean;
        continent: boolean;
        country: boolean;
        county: boolean;
        region: boolean;
        postalCode: boolean;
        stateOrProvince: boolean;
        place: boolean;
        latitude: boolean;
        longitude: boolean;
    }
    class MiscellaneousType implements MiscellaneousTypeDescriptor {
        private underlyingType;
        constructor(type: ExtendedType);
        image: boolean;
        imageUrl: boolean;
        webUrl: boolean;
        barcode: boolean;
    }
    class FormattingType implements FormattingTypeDescriptor {
        private underlyingType;
        constructor(type: ExtendedType);
        color: boolean;
        formatString: boolean;
        alignment: boolean;
        labelDisplayUnits: boolean;
        fontSize: boolean;
        labelDensity: boolean;
    }
    /** Defines primitive value types. Must be consistent with types defined by server conceptual schema. */
    enum PrimitiveType {
        Null = 0,
        Text = 1,
        Decimal = 2,
        Double = 3,
        Integer = 4,
        Boolean = 5,
        Date = 6,
        DateTime = 7,
        DateTimeZone = 8,
        Time = 9,
        Duration = 10,
        Binary = 11,
        None = 12,
    }
    /** Defines extended value types, which include primitive types and known data categories constrained to expected primitive types. */
    enum ExtendedType {
        Numeric = 256,
        Temporal = 512,
        Geography = 1024,
        Miscellaneous = 2048,
        Formatting = 4096,
        Scripting = 8192,
        Null = 0,
        Text = 1,
        Decimal = 258,
        Double = 259,
        Integer = 260,
        Boolean = 5,
        Date = 518,
        DateTime = 519,
        DateTimeZone = 520,
        Time = 521,
        Duration = 10,
        Binary = 11,
        None = 12,
        Years = 66048,
        Years_Text = 66049,
        Years_Integer = 66308,
        Years_Date = 66054,
        Years_DateTime = 66055,
        Months = 131584,
        Months_Text = 131585,
        Months_Integer = 131844,
        Months_Date = 131590,
        Months_DateTime = 131591,
        PaddedDateTableDates = 197127,
        Address = 6554625,
        City = 6620161,
        Continent = 6685697,
        Country = 6751233,
        County = 6816769,
        Region = 6882305,
        PostalCode = 6947840,
        PostalCode_Text = 6947841,
        PostalCode_Integer = 6948100,
        StateOrProvince = 7013377,
        Place = 7078913,
        Latitude = 7144448,
        Latitude_Decimal = 7144706,
        Latitude_Double = 7144707,
        Longitude = 7209984,
        Longitude_Decimal = 7210242,
        Longitude_Double = 7210243,
        Image = 13109259,
        ImageUrl = 13174785,
        WebUrl = 13240321,
        Barcode = 13305856,
        Barcode_Text = 13305857,
        Barcode_Integer = 13306116,
        Color = 19664897,
        FormatString = 19730433,
        Alignment = 20058113,
        LabelDisplayUnits = 20123649,
        FontSize = 20189443,
        LabelDensity = 20254979,
        Enumeration = 26214401,
        ScriptSource = 32776193,
        SearchEnabled = 65541,
    }
}

declare module powerbi.data {
    /**
     * Represents the versions of the data shape binding structure.
     * NOTE Keep this file in sync with the Sql\InfoNav\src\Data\Contracts\DsqGeneration\DataShapeBindingVersions.cs
     * file in the TFS Dev branch.
     */
    const enum DataShapeBindingVersions {
        /** The initial version of data shape binding */
        Version0 = 0,
        /** Explicit subtotal support for axis groupings. */
        Version1 = 1,
    }
    interface DataShapeBindingLimitTarget {
        Primary?: number;
    }
    enum DataShapeBindingLimitType {
        Top = 0,
        First = 1,
        Last = 2,
        Sample = 3,
        Bottom = 4,
    }
    interface DataShapeBindingLimit {
        Count?: number;
        Target: DataShapeBindingLimitTarget;
        Type: DataShapeBindingLimitType;
    }
    interface DataShapeBinding {
        Version?: number;
        Primary: DataShapeBindingAxis;
        Secondary?: DataShapeBindingAxis;
        Aggregates?: DataShapeBindingAggregate[];
        Projections?: number[];
        Limits?: DataShapeBindingLimit[];
        Highlights?: FilterDefinition[];
        DataReduction?: DataShapeBindingDataReduction;
        IncludeEmptyGroups?: boolean;
        SuppressedJoinPredicates?: number[];
    }
    interface DataShapeBindingDataReduction {
        Primary?: DataShapeBindingDataReductionAlgorithm;
        Secondary?: DataShapeBindingDataReductionAlgorithm;
        DataVolume?: number;
    }
    interface DataShapeBindingDataReductionAlgorithm {
        Top?: DataShapeBindingDataReductionTopLimit;
        Sample?: DataShapeBindingDataReductionSampleLimit;
        Bottom?: DataShapeBindingDataReductionBottomLimit;
        Window?: DataShapeBindingDataReductionDataWindow;
    }
    interface DataShapeBindingDataReductionTopLimit {
        Count?: number;
    }
    interface DataShapeBindingDataReductionSampleLimit {
        Count?: number;
    }
    interface DataShapeBindingDataReductionBottomLimit {
        Count?: number;
    }
    interface DataShapeBindingDataReductionDataWindow {
        Count?: number;
        RestartTokens?: RestartToken;
    }
    interface DataShapeBindingAxis {
        Groupings: DataShapeBindingAxisGrouping[];
    }
    enum SubtotalType {
        None = 0,
        Before = 1,
        After = 2,
    }
    interface DataShapeBindingAxisGrouping {
        Projections: number[];
        GroupBy?: number[];
        SuppressedProjections?: number[];
        Subtotal?: SubtotalType;
        ShowItemsWithNoData?: number[];
    }
    interface DataShapeBindingAggregate {
        Select: number;
        Kind?: DataShapeBindingAggregateKind;
        Aggregations?: DataShapeBindingSelectAggregateContainer[];
    }
    const enum DataShapeBindingAggregateKind {
        None = 0,
        Min = 1,
        Max = 2,
    }
    interface DataShapeBindingSelectAggregateContainer {
        Percentile?: DataShapeBindingSelectPercentileAggregate;
        Min?: DataShapeBindingSelectMinAggregate;
        Max?: DataShapeBindingSelectMaxAggregate;
    }
    interface DataShapeBindingSelectPercentileAggregate {
        Exclusive?: boolean;
        K: number;
    }
    interface DataShapeBindingSelectMaxAggregate {
    }
    interface DataShapeBindingSelectMinAggregate {
    }
}

declare module powerbi.data {
    module DataShapeBindingDataReduction {
        function createFrom(reduction: ReductionAlgorithm): DataShapeBindingDataReductionAlgorithm;
    }
}

declare module powerbi.data {
    interface FederatedConceptualSchemaInitOptions {
        schemas: {
            [name: string]: ConceptualSchema;
        };
        links?: ConceptualSchemaLink[];
    }
    /** Represents a federated conceptual schema. */
    class FederatedConceptualSchema {
        private schemas;
        private links;
        constructor(options: FederatedConceptualSchemaInitOptions);
        schema(name: string): ConceptualSchema;
    }
    /** Describes a semantic relationship between ConceptualSchemas. */
    interface ConceptualSchemaLink {
    }
}

declare module powerbi.data {
    module Selector {
        function filterFromSelector(selectors: Selector[], isNot?: boolean): SemanticFilter;
        function matchesData(selector: Selector, identities: DataViewScopeIdentity[]): boolean;
        function matchesKeys(selector: Selector, keysList: SQExpr[][]): boolean;
        /** Determines whether two selectors are equal. */
        function equals(x: Selector, y: Selector): boolean;
        function getKey(selector: Selector): string;
        function containsWildcard(selector: Selector): boolean;
        function hasRoleWildcard(selector: Selector): boolean;
        function isRoleWildcard(dataItem: DataRepetitionSelector): dataItem is DataViewRoleWildcard;
        function convertSelectorsByColumnToSelector(selectorsByColumn: SelectorsByColumn): Selector;
    }
}

declare module powerbi.data {
    interface QueryDefinition {
        Version?: number;
        From: EntitySource[];
        Where?: QueryFilter[];
        OrderBy?: QuerySortClause[];
        Select: QueryExpressionContainer[];
        GroupBy?: QueryExpressionContainer[];
        Transform?: QueryTransform[];
    }
    interface FilterDefinition {
        Version?: number;
        From: EntitySource[];
        Where: QueryFilter[];
    }
    enum EntitySourceType {
        Table = 0,
        Pod = 1,
        Expression = 2,
    }
    interface EntitySource {
        Name: string;
        EntitySet?: string;
        Entity?: string;
        Schema?: string;
        Expression?: QueryExpressionContainer;
        Type?: EntitySourceType;
    }
    interface QueryFilter {
        Target?: QueryExpressionContainer[];
        Condition: QueryExpressionContainer;
    }
    interface QuerySortClause {
        Expression: QueryExpressionContainer;
        Direction: SortDirection;
    }
    interface QueryExpressionContainer {
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
        And?: QueryBinaryExpression;
        Between?: QueryBetweenExpression;
        In?: QueryInExpression;
        Or?: QueryBinaryExpression;
        Comparison?: QueryComparisonExpression;
        Not?: QueryNotExpression;
        Contains?: QueryContainsExpression;
        StartsWith?: QueryStartsWithExpression;
        Exists?: QueryExistsExpression;
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
        DefaultValue?: QueryDefaultValueExpression;
        AnyValue?: QueryAnyValueExpression;
        Arithmetic?: QueryArithmeticExpression;
        ScopedEval?: QueryScopedEvalExpression;
        WithRef?: QueryWithRefExpression;
        TransformTableRef?: QueryTransformTableRefExpression;
        TransformOutputRoleRef?: QueryTransformOutputRoleRefExpression;
        FillRule?: QueryFillRuleExpression;
        ResourcePackageItem?: QueryResourcePackageItem;
        SelectRef?: QuerySelectRefExpression;
    }
    interface QueryPropertyExpression {
        Expression: QueryExpressionContainer;
        Property: string;
    }
    interface QueryColumnExpression extends QueryPropertyExpression {
    }
    interface QueryMeasureExpression extends QueryPropertyExpression {
    }
    interface QuerySourceRefExpression {
        Source: string;
    }
    interface QuerySelectRefExpression {
        ExpressionName: string;
    }
    interface QueryAggregationExpression {
        Function: QueryAggregateFunction;
        Expression: QueryExpressionContainer;
    }
    interface QueryPercentileExpression {
        Expression: QueryExpressionContainer;
        K: number;
        Exclusive?: boolean;
    }
    interface QueryHierarchyExpression {
        Expression: QueryExpressionContainer;
        Hierarchy: string;
    }
    interface QueryHierarchyLevelExpression {
        Expression: QueryExpressionContainer;
        Level: string;
    }
    interface QueryPropertyVariationSourceExpression {
        Expression: QueryExpressionContainer;
        Name: string;
        Property: string;
    }
    interface QuerySubqueryExpression {
        Query: QueryDefinition;
    }
    interface QueryBinaryExpression {
        Left: QueryExpressionContainer;
        Right: QueryExpressionContainer;
    }
    interface QueryBetweenExpression {
        Expression: QueryExpressionContainer;
        LowerBound: QueryExpressionContainer;
        UpperBound: QueryExpressionContainer;
    }
    interface QueryInExpression {
        Expressions: QueryExpressionContainer[];
        Values: QueryExpressionContainer[][];
    }
    interface QueryComparisonExpression extends QueryBinaryExpression {
        ComparisonKind: QueryComparisonKind;
    }
    interface QueryContainsExpression extends QueryBinaryExpression {
    }
    interface QueryNotExpression {
        Expression: QueryExpressionContainer;
    }
    interface QueryStartsWithExpression extends QueryBinaryExpression {
    }
    interface QueryExistsExpression {
        Expression: QueryExpressionContainer;
    }
    interface QueryConstantExpression<T> {
        Value: T;
    }
    interface QueryLiteralExpression {
        Value: string;
    }
    interface QueryBooleanExpression extends QueryConstantExpression<boolean> {
    }
    interface QueryDateTimeExpression extends QueryConstantExpression<string> {
    }
    interface QueryDateTimeSecondExpression extends QueryConstantExpression<string> {
    }
    interface QueryDecimalExpression extends QueryConstantExpression<number> {
    }
    interface QueryIntegerExpression extends QueryConstantExpression<number> {
    }
    interface QueryNumberExpression extends QueryConstantExpression<string> {
    }
    interface QueryNullExpression {
    }
    interface QueryStringExpression extends QueryConstantExpression<string> {
    }
    interface QueryDateSpanExpression {
        TimeUnit: TimeUnit;
        Expression: QueryExpressionContainer;
    }
    interface QueryDateAddExpression {
        Amount: number;
        TimeUnit: TimeUnit;
        Expression: QueryExpressionContainer;
    }
    interface QueryNowExpression {
    }
    interface QueryDefaultValueExpression {
    }
    interface QueryAnyValueExpression {
    }
    interface QueryArithmeticExpression {
        Left: QueryExpressionContainer;
        Right: QueryExpressionContainer;
        Operator: ArithmeticOperatorKind;
    }
    const enum ArithmeticOperatorKind {
        Add = 0,
        Subtract = 1,
        Multiply = 2,
        Divide = 3,
    }
    function getArithmeticOperatorName(arithmeticOperatorKind: ArithmeticOperatorKind): string;
    interface QueryFillRuleExpression {
        Input: QueryExpressionContainer;
        FillRule: FillRuleGeneric<QueryExpressionContainer, QueryExpressionContainer>;
    }
    interface QueryResourcePackageItem {
        PackageName: string;
        PackageType: number;
        ItemName: string;
    }
    interface QueryScopedEvalExpression {
        Expression: QueryExpressionContainer;
        Scope: QueryExpressionContainer[];
    }
    interface QueryWithRefExpression {
        ExpressionName: string;
    }
    interface QueryTransformTableRefExpression {
        Source: string;
    }
    interface QueryTransformOutputRoleRefExpression {
        Role: string;
        Transform?: string;
    }
    enum TimeUnit {
        Day = 0,
        Week = 1,
        Month = 2,
        Year = 3,
        Decade = 4,
        Second = 5,
        Minute = 6,
        Hour = 7,
    }
    enum QueryAggregateFunction {
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
    enum QueryComparisonKind {
        Equal = 0,
        GreaterThan = 1,
        GreaterThanOrEqual = 2,
        LessThan = 3,
        LessThanOrEqual = 4,
    }
    /** Defines semantic data types. */
    enum SemanticType {
        None = 0,
        Number = 1,
        Integer = 3,
        DateTime = 4,
        Time = 8,
        Date = 20,
        Month = 35,
        Year = 67,
        YearAndMonth = 128,
        MonthAndDay = 256,
        Decade = 515,
        YearAndWeek = 1024,
        String = 2048,
        Boolean = 4096,
        Table = 8192,
        Range = 16384,
    }
    interface QueryMetadata {
        Select?: SelectMetadata[];
        Filters?: FilterMetadata[];
    }
    interface SelectMetadata {
        Restatement: string;
        Type?: number;
        Format?: string;
        DataCategory?: ConceptualDataCategory;
        /** The select projection name. */
        Name?: string;
        kpiStatusGraphic?: string;
        kpi?: DataViewKpiColumnMetadata;
    }
    interface FilterMetadata {
        Restatement: string;
        Kind?: FilterKind;
        /** The expression being filtered.  This is reflected in the filter card UI. */
        expression?: QueryExpressionContainer;
    }
    enum FilterKind {
        Default = 0,
        Period = 1,
    }
    interface QueryTransform {
        Name: string;
        Algorithm: string;
        Input: QueryTransformInput;
        Output: QueryTransformOutput;
    }
    interface QueryTransformInput {
        Parameters: QueryExpressionContainer[];
        Table?: QueryTransformTable;
    }
    interface QueryTransformOutput {
        Table?: QueryTransformTable;
    }
    interface QueryTransformTable {
        Name: string;
        Columns: QueryTransformTableColumn[];
    }
    interface QueryTransformTableColumn {
        Role?: string;
        Expression: QueryExpressionContainer;
    }
}

declare module powerbi.data {
    /** Represents a projection from a query result. */
    interface QueryProjection {
        /** Name of item in the semantic query Select clause. */
        queryRef: string;
        /** Optional format string. */
        format?: string;
    }
    /** A set of QueryProjections, grouped by visualization property, and ordered within that property. */
    interface QueryProjectionsByRole {
        [roleName: string]: QueryProjectionCollection;
    }
    class QueryProjectionCollection {
        private items;
        private _activeProjectionRefs;
        private _showAll;
        constructor(items: QueryProjection[], activeProjectionRefs?: string[], showAll?: boolean);
        /** Returns all projections in a mutable array. */
        all(): QueryProjection[];
        activeProjectionRefs: string[];
        showAll: boolean;
        addActiveQueryReference(queryRef: string): void;
        getLastActiveQueryReference(): string;
        /** Replaces the given oldQueryRef with newQueryRef in this QueryProjectionCollection. */
        replaceQueryRef(oldQueryRef: string, newQueryRef: string): void;
        clone(): QueryProjectionCollection;
    }
    module QueryProjectionsByRole {
        /** Clones the QueryProjectionsByRole. */
        function clone(roles: QueryProjectionsByRole): QueryProjectionsByRole;
        /** Returns the QueryProjectionCollection for that role.  Even returns empty collections so that 'drillable' and 'activeProjection' fields are preserved. */
        function getRole(roles: QueryProjectionsByRole, name: string): QueryProjectionCollection;
    }
}

declare module powerbi {
    interface VisualElement {
        DataRoles?: DataRole[];
        Settings?: VisualElementSettings;
    }
    /** Defines common settings for a visual element. */
    interface VisualElementSettings {
        DisplayUnitSystemType?: DisplayUnitSystemType;
    }
    interface DataRole {
        Name: string;
        Projection: number;
        isActive?: boolean;
    }
    /** The system used to determine display units used during formatting */
    enum DisplayUnitSystemType {
        /** Default display unit system, which saves space by using units such as K, M, bn with PowerView rules for when to pick a unit. Suitable for chart axes. */
        Default = 0,
        /** A verbose display unit system that will only respect the formatting defined in the model. Suitable for explore mode single-value cards. */
        Verbose = 1,
        /**
         * A display unit system that uses units such as K, M, bn if we have at least one of those units (e.g. 0.9M is not valid as it's less than 1 million).
         * Suitable for dashboard tile cards
         */
        WholeUnits = 2,
        /**A display unit system that also contains Auto and None units for data labels*/
        DataLabels = 3,
    }
}
declare module powerbi.data.contracts {
    interface DataViewSource {
        data: any;
        type?: string;
    }
}

declare module powerbi {
    /** Repreasents the sequence of the dates/times */
    class DateTimeSequence {
        private static MIN_COUNT;
        private static MAX_COUNT;
        min: Date;
        max: Date;
        unit: DateTimeUnit;
        sequence: Date[];
        interval: number;
        intervalOffset: number;
        /** Creates new instance of the DateTimeSequence */
        constructor(unit: DateTimeUnit);
        /**
         * Add a new Date to a sequence.
         * @param date - date to add
         */
        add(date: Date): void;
        /**
         * Extends the sequence to cover new date range
         * @param min - new min to be covered by sequence
         * @param max - new max to be covered by sequence
         */
        extendToCover(min: Date, max: Date): void;
        /**
         * Move the sequence to cover new date range
         * @param min - new min to be covered by sequence
         * @param max - new max to be covered by sequence
         */
        moveToCover(min: Date, max: Date): void;
        /**
         * Calculate a new DateTimeSequence
         * @param dataMin - Date representing min of the data range
         * @param dataMax - Date representing max of the data range
         * @param expectedCount - expected number of intervals in the sequence
         * @param unit - of the intervals in the sequence
         */
        static calculate(dataMin: Date, dataMax: Date, expectedCount: number, unit?: DateTimeUnit): DateTimeSequence;
        static calculateYears(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateMonths(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateWeeks(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateDays(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateHours(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateMinutes(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateSeconds(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateMilliseconds(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static addInterval(value: Date, interval: number, unit: DateTimeUnit): Date;
        private static fromNumericSequence(date, sequence, unit);
        private static getDelta(min, max, unit);
        static getIntervalUnit(min: Date, max: Date, maxCount: number): DateTimeUnit;
    }
    /** DateUtils module provides DateTimeSequence with set of additional date manipulation routines */
    module DateUtils {
        /**
         * Adds a specified number of years to the provided date.
         * @param date - date value
         * @param yearDelta - number of years to add
         */
        function addYears(date: Date, yearDelta: number): Date;
        /**
         * Adds a specified number of months to the provided date.
         * @param date - date value
         * @param monthDelta - number of months to add
         */
        function addMonths(date: Date, monthDelta: number): Date;
        /**
         * Adds a specified number of weeks to the provided date.
         * @param date - date value
         * @param weeks - number of weeks to add
         */
        function addWeeks(date: Date, weeks: number): Date;
        /**
         * Adds a specified number of days to the provided date.
         * @param date - date value
         * @param days - number of days to add
         */
        function addDays(date: Date, days: number): Date;
        /**
         * Adds a specified number of hours to the provided date.
         * @param date - date value
         * @param hours - number of hours to add
         */
        function addHours(date: Date, hours: number): Date;
        /**
         * Adds a specified number of minutes to the provided date.
         * @param date - date value
         * @param minutes - number of minutes to add
         */
        function addMinutes(date: Date, minutes: number): Date;
        /**
         * Adds a specified number of seconds to the provided date.
         * @param date - date value
         * @param seconds - number of seconds to add
         */
        function addSeconds(date: Date, seconds: number): Date;
        /**
         * Adds a specified number of milliseconds to the provided date.
         * @param date - date value
         * @param milliseconds - number of milliseconds to add
         */
        function addMilliseconds(date: Date, milliseconds: number): Date;
    }
}

declare module powerbi {
    class DisplayUnit {
        value: number;
        title: string;
        labelFormat: string;
        applicableRangeMin: number;
        applicableRangeMax: number;
        project(value: number): number;
        reverseProject(value: number): number;
        isApplicableTo(value: number): boolean;
        isScaling(): boolean;
    }
    class DisplayUnitSystem {
        units: DisplayUnit[];
        displayUnit: DisplayUnit;
        private unitBaseValue;
        protected static UNSUPPORTED_FORMATS: RegExp;
        constructor(units?: DisplayUnit[]);
        title: string;
        update(value: number): void;
        private findApplicableDisplayUnit(value);
        format(value: number, format: string, decimals?: number, trailingZeros?: boolean): string;
        isFormatSupported(format: string): boolean;
        isPercentageFormat(format: string): boolean;
        shouldRespectScalingUnit(format: string): boolean;
        getNumberOfDecimalsForFormatting(format: string, decimals?: number): number;
        isScalingUnit(): boolean;
        private formatHelper(value, nonScientificFormat, format, decimals?, trailingZeros?);
        /** Formats a single value by choosing an appropriate base for the DisplayUnitSystem before formatting. */
        formatSingleValue(value: number, format: string, decimals?: number, trailingZeros?: boolean): string;
        private shouldUseValuePrecision(value);
        protected isScientific(value: number): boolean;
        protected hasScientitifcFormat(format: string): boolean;
        protected supportsScientificFormat(format: string): boolean;
        protected shouldFallbackToScientific(value: number, format: string): boolean;
        protected getScientificFormat(data: number, format: string, decimals: number, trailingZeros: boolean): string;
    }
    /** Provides a unit system that is defined by formatting in the model, and is suitable for visualizations shown in single number visuals in explore mode. */
    class NoDisplayUnitSystem extends DisplayUnitSystem {
        constructor();
    }
    /** Provides a unit system that creates a more concise format for displaying values. This is suitable for most of the cases where
        we are showing values (chart axes) and as such it is the default unit system. */
    class DefaultDisplayUnitSystem extends DisplayUnitSystem {
        private static units;
        constructor(unitLookup: (exponent: number) => DisplayUnitSystemNames);
        format(data: number, format: string, decimals?: number, trailingZeros?: boolean): string;
        static reset(): void;
        private static getUnits(unitLookup);
    }
    /** Provides a unit system that creates a more concise format for displaying values, but only allows showing a unit if we have at least
        one of those units (e.g. 0.9M is not allowed since it's less than 1 million). This is suitable for cases such as dashboard tiles
        where we have restricted space but do not want to show partial units. */
    class WholeUnitsDisplayUnitSystem extends DisplayUnitSystem {
        private static units;
        constructor(unitLookup: (exponent: number) => DisplayUnitSystemNames);
        static reset(): void;
        private static getUnits(unitLookup);
        format(data: number, format: string, decimals?: number, trailingZeros?: boolean): string;
    }
    class DataLabelsDisplayUnitSystem extends DisplayUnitSystem {
        private static AUTO_DISPLAYUNIT_VALUE;
        private static NONE_DISPLAYUNIT_VALUE;
        protected static UNSUPPORTED_FORMATS: RegExp;
        private static units;
        constructor(unitLookup: (exponent: number) => DisplayUnitSystemNames);
        isFormatSupported(format: string): boolean;
        private static getUnits(unitLookup);
        format(data: number, format: string, decimals?: number, trailingZeros?: boolean): string;
    }
    interface DisplayUnitSystemNames {
        title: string;
        format: string;
    }
}

declare module powerbi {
    class NumericSequence {
        private static MIN_COUNT;
        private static MAX_COUNT;
        private maxAllowedMargin;
        private canExtendMin;
        private canExtendMax;
        interval: number;
        intervalOffset: number;
        min: number;
        max: number;
        precision: number;
        sequence: number[];
        static calculate(range: NumericSequenceRange, expectedCount: number, maxAllowedMargin?: number, minPower?: number, useZeroRefPoint?: boolean, steps?: number[]): NumericSequence;
        /**
         * Calculates the sequence of int numbers which are mapped to the multiples of the units grid.
         * @min - The minimum of the range.
         * @max - The maximum of the range.
         * @maxCount - The max count of intervals.
         * @steps - array of intervals.
         */
        static calculateUnits(min: number, max: number, maxCount: number, steps: number[]): NumericSequence;
        trimMinMax(min: number, max: number): void;
    }
}

declare module powerbi {
    class NumericSequenceRange {
        private static DEFAULT_MAX;
        private static MIN_SUPPORTED_DOUBLE;
        private static MAX_SUPPORTED_DOUBLE;
        min: number;
        max: number;
        includeZero: boolean;
        forcedSingleStop: number;
        hasDataRange: boolean;
        hasFixedMin: boolean;
        hasFixedMax: boolean;
        private _ensureIncludeZero();
        private _ensureNotEmpty();
        private _ensureDirection();
        getSize(): number;
        shrinkByStep(range: NumericSequenceRange, step: number): void;
        static calculate(dataMin: number, dataMax: number, fixedMin?: number, fixedMax?: number, includeZero?: boolean): NumericSequenceRange;
        static calculateDataRange(dataMin: number, dataMax: number, includeZero?: boolean): NumericSequenceRange;
        static calculateFixedRange(fixedMin: number, fixedMax: number, includeZero?: boolean): NumericSequenceRange;
    }
    /** Note: Exported for testability */
    module ValueUtil {
        function hasValue(value: any): boolean;
    }
}

declare module powerbi.visuals {
    /**
     * Formats the value using provided format expression
     * @param value - value to be formatted and converted to string.
     * @param format - format to be applied if the number shouldn't be abbreviated.
     * If the number should be abbreviated this string is checked for special characters like $ or % if any
     */
    interface ICustomValueFormatter {
        (value: any, format?: string): string;
    }
    interface ICustomValueColumnFormatter {
        (value: any, column: DataViewMetadataColumn, formatStringProp: DataViewObjectPropertyIdentifier, nullsAreBlank?: boolean): string;
    }
    interface ValueFormatterOptions {
        /** The format string to use. */
        format?: string;
        /** The data value. */
        value?: any;
        /** The data value. */
        value2?: any;
        /** The number of ticks. */
        tickCount?: any;
        /** The display unit system to use */
        displayUnitSystemType?: DisplayUnitSystemType;
        /** True if we are formatting single values in isolation (e.g. card), as opposed to multiple values with a common base (e.g. chart axes) */
        formatSingleValues?: boolean;
        /** True if we want to trim off unnecessary zeroes after the decimal and remove a space before the % symbol */
        allowFormatBeautification?: boolean;
        /** Specifies the maximum number of decimal places to show*/
        precision?: number;
        /** Detect axis precision based on value */
        detectAxisPrecision?: boolean;
        /** Specifies the column type of the data value */
        columnType?: ValueTypeDescriptor;
    }
    interface IValueFormatter {
        format(value: any): string;
        displayUnit?: DisplayUnit;
        options?: ValueFormatterOptions;
    }
    /** Captures all locale-specific options used by the valueFormatter. */
    interface ValueFormatterLocalizationOptions {
        null: string;
        true: string;
        false: string;
        NaN: string;
        infinity: string;
        negativeInfinity: string;
        /** Returns a beautified form the given format string. */
        beautify(format: string): string;
        /** Returns an object describing the given exponent in the current language. */
        describe(exponent: number): DisplayUnitSystemNames;
        restatementComma: string;
        restatementCompoundAnd: string;
        restatementCompoundOr: string;
    }
    module valueFormatter {
        const DefaultIntegerFormat: string;
        const DefaultNumericFormat: string;
        const DefaultDateFormat: string;
        function getLocalizedString(stringId: string): string;
        function getFormatMetadata(format: string): powerbi.NumberFormat.NumericFormatMetadata;
        function setLocaleOptions(options: ValueFormatterLocalizationOptions): void;
        function createDefaultFormatter(formatString: string, allowFormatBeautification?: boolean): IValueFormatter;
        /** Creates an IValueFormatter to be used for a range of values. */
        function create(options: ValueFormatterOptions): IValueFormatter;
        function format(value: any, format?: string, allowFormatBeautification?: boolean): string;
        /**
         * Value formatting function to handle variant measures.
         * For a Date/Time value within a non-date/time field, it's formatted with the default date/time formatString instead of as a number
         * @param {any} value Value to be formatted
         * @param {DataViewMetadataColumn} column Field which the value belongs to
         * @param {DataViewObjectPropertyIdentifier} formatStringProp formatString Property ID
         * @param {boolean} nullsAreBlank? Whether to show "(Blank)" instead of empty string for null values
         * @returns Formatted value
         */
        function formatVariantMeasureValue(value: any, column: DataViewMetadataColumn, formatStringProp: DataViewObjectPropertyIdentifier, nullsAreBlank?: boolean): string;
        function getFormatString(column: DataViewMetadataColumn, formatStringProperty: DataViewObjectPropertyIdentifier, suppressTypeFallback?: boolean): string;
        /** The returned string will look like 'A, B, ..., and C'  */
        function formatListAnd(strings: string[]): string;
        /** The returned string will look like 'A, B, ..., or C' */
        function formatListOr(strings: string[]): string;
        function getDisplayUnits(displayUnitSystemType: DisplayUnitSystemType): DisplayUnit[];
    }
}

declare module powerbi.data {
    module DataViewMatrixUtils {
        const enum DepthFirstTraversalCallbackResult {
            stop = 0,
            continueToChildNodes = 1,
            skipDescendantNodes = 2,
        }
        function isLeafNode(node: DataViewMatrixNode): boolean;
        /**
         * Invokes the specified callback once per node in the node tree starting from the specified rootNodes in depth-first order.
         *
         * If rootNodes is null or undefined or empty, the specified callback will not get invoked.
         *
         * The traversalPath parameter in the callback is an ordered set of nodes that form the path from the specified
         * rootNodes down to the callback node argument itself.  If callback node is one of the specified rootNodes,
         * then traversalPath will be an array of length 1 containing that very node.
         *
         * IMPORTANT: The traversalPath array passed to the callback will be modified after the callback function returns!
         * If your callback needs to retain a copy of the traversalPath, please clone the array before returning.
         */
        function forEachNodeDepthFirst(rootNodes: DataViewMatrixNode | DataViewMatrixNode[], callback: (node: DataViewMatrixNode, traversalPath?: DataViewMatrixNode[]) => DepthFirstTraversalCallbackResult): void;
        /**
         * Invokes the specified callback once per leaf node (including root-level leaves and descendent leaves) of the
         * specified rootNodes, with an optional index parameter in the callback that is the 0-based index of the
         * particular leaf node in the context of this forEachLeafNode(...) invocation.
         *
         * If rootNodes is null or undefined or empty, the specified callback will not get invoked.
         *
         * The traversalPath parameter in the callback is an ordered set of nodes that form the path from the specified
         * rootNodes down to the leafNode argument itself.  If callback leafNode is one of the specified rootNodes,
         * then traversalPath will be an array of length 1 containing that very node.
         *
         * IMPORTANT: The traversalPath array passed to the callback will be modified after the callback function returns!
         * If your callback needs to retain a copy of the traversalPath, please clone the array before returning.
         */
        function forEachLeafNode(rootNodes: DataViewMatrixNode | DataViewMatrixNode[], callback: (leafNode: DataViewMatrixNode, index?: number, traversalPath?: DataViewMatrixNode[]) => void): void;
        /**
         * Invokes the specified callback once for each node at the specified targetLevel in the node tree.
         *
         * Note: Be aware that in a matrix with multiple column grouping fields and multiple value fields, the DataViewMatrixNode
         * for the Grand Total column in the column hierarchy can have children nodes where level > (parent.level + 1):
         *  {
         *      "level": 0,
         *      "isSubtotal": true,
         *      "children": [
         *          { "level": 2, "isSubtotal": true },
         *          { "level": 2, "levelSourceIndex": 1, "isSubtotal": true }
         *      ]
         *  }
         */
        function forEachNodeAtLevel(node: DataViewMatrixNode, targetLevel: number, callback: (node: DataViewMatrixNode) => void): void;
        /**
         * Returned an object tree where each node and its children property are inherited from the specified node
         * hierarchy, from the root down to the nodes at the specified deepestLevelToInherit, inclusively.
         *
         * The inherited nodes at level === deepestLevelToInherit will NOT get an inherited version of children array
         * property, i.e. its children property is the same array object referenced in the input node's object tree.
         *
         * @param node The input node with the hierarchy object tree.
         * @param deepestLevelToInherit The highest level for a node to get inherited. See DataViewMatrixNode.level property.
         * @param useInheritSingle If true, then a node will get inherited in the returned object tree only if it is
         * not already an inherited object. Same goes for the node's children property.  This is useful for creating
         * "visual DataView" objects from "query DataView" objects, as object inheritance is the mechanism for
         * "visual DataView" to override properties in "query DataView", and that "query DataView" never contains
         * inherited objects.
         */
        function inheritMatrixNodeHierarchy(node: DataViewMatrixNode, deepestLevelToInherit: number, useInheritSingle: boolean): DataViewMatrixNode;
        /**
         * Returns true if the specified matrixOrHierarchy contains any composite grouping, i.e. a grouping on multiple columns.
         * An example of composite grouping is one on [Year, Quarter, Month], where a particular group instance can have
         * Year === 2016, Quarter === 'Qtr 1', Month === 1.
         *
         * Returns false if the specified matrixOrHierarchy does not contain any composite group,
         * or if matrixOrHierarchy is null or undefined.
         */
        function containsCompositeGroup(matrixOrHierarchy: DataViewMatrix | DataViewHierarchy): boolean;
    }
}

declare module powerbi.data {
    module DataViewMetadataColumnUtils {
        interface MetadataColumnAndProjectionIndex {
            /**
            * A metadata column taken from a source collection, e.g. DataViewHierarchyLevel.sources, DataViewMatrix.valueSources...
            */
            metadataColumn: DataViewMetadataColumn;
            /**
             * The index of this.metadataColumn in its sources collection.
             *
             * E.g.1 This can be the value of the property DataViewMatrixGroupValue.levelSourceIndex which is the index of this.metadataColumn in DataViewHierarchyLevel.sources.
             * E.g.2 This can be the value of the property DataViewMatrixNodeValue.valueSourceIndex which refer to columns in DataViewMatrix.valueSources.
             */
            sourceIndex: number;
            /**
            * The index of this.metadataColumn in the projection ordering of a given role.
            * This property is undefined if the column is not projected.
            */
            projectionOrderIndex?: number;
        }
        /**
         * Returns true iff the specified metadataColumn is assigned to the specified targetRole.
         */
        function isForRole(metadataColumn: DataViewMetadataColumn, targetRole: string): boolean;
        /**
         * Returns true iff the specified metadataColumn is assigned to any one of the specified targetRoles.
         */
        function isForAnyRole(metadataColumn: DataViewMetadataColumn, targetRoles: string[]): boolean;
        /**
         * Left-joins each metadata column of the specified target roles in the specified columnSources
         * with projection ordering index into a wrapper object.
         *
         * If a metadata column is for one of the target roles but its select index is not projected, the projectionOrderIndex property
         * in that MetadataColumnAndProjectionIndex object will be undefined.
         *
         * If a metadata column is for one of the target roles and its select index is projected more than once, that metadata column
         * will be included in multiple MetadataColumnAndProjectionIndex objects, once per occurrence in projection.
         *
         * If the specified projectionOrdering does not contain duplicate values, then the returned objects will be in the same order
         * as their corresponding metadata column object appears in the specified columnSources.
         *
         * Note: In order for this function to reliably calculate the "source index" of a particular column, the
         * specified columnSources must be a non-filtered array of column sources from the DataView, such as
         * the DataViewHierarchyLevel.sources and DataViewMatrix.valueSources array properties.
         *
         * @param columnSources E.g. DataViewHierarchyLevel.sources, DataViewMatrix.valueSources...
         * @param projectionOrdering The select indices in projection ordering.  It should be the ordering for the specified target roles.
         * @param roles The roles for filtering out the irrevalent columns in columnSources.
         */
        function leftJoinMetadataColumnsAndProjectionOrder(columnSources: DataViewMetadataColumn[], projectionOrdering: number[], roles: string[]): MetadataColumnAndProjectionIndex[];
    }
}

declare module powerbi {
    interface IColorAllocator {
        /** Computes the color corresponding to the provided value. */
        color(value: PrimitiveValue): string;
    }
    interface IColorAllocatorFactory {
        /** Creates a gradient that that transitions between two colors. */
        linearGradient2(options: LinearGradient2): IColorAllocator;
        /** Creates a gradient that that transitions between three colors. */
        linearGradient3(options: LinearGradient3, splitScales: boolean): IColorAllocator;
    }
}

declare module powerbi.data {
    interface CompiledDataViewRoleBindMappingWithReduction extends CompiledDataViewRoleBindMapping, HasReductionAlgorithm {
    }
    interface CompiledDataViewRoleForMappingWithReduction extends CompiledDataViewRoleForMapping, HasReductionAlgorithm {
    }
}

declare module powerbi.data {
    module DataRoleHelper {
        function getMeasureIndexOfRole(grouped: DataViewValueColumnGroup[], roleName: string): number;
        function getCategoryIndexOfRole(categories: DataViewCategoryColumn[], roleName: string): number;
        function hasRole(column: DataViewMetadataColumn, name: string): boolean;
        function hasRoleInDataView(dataView: DataView, name: string): boolean;
        function hasRoleInValueColumn(valueColumn: DataViewValueColumn, name: string): boolean;
    }
}

declare module powerbi.data {
    function createIDataViewCategoricalReader(dataView: DataView): IDataViewCategoricalReader;
    interface IDataViewCategoricalReader {
        hasCategories(): boolean;
        getCategoryCount(): number;
        getCategoryValues(roleName: string): any;
        getCategoryValue(roleName: string, categoryIndex: number): any;
        getCategoryColumn(roleName: string): DataViewCategoryColumn;
        getCategoryMetadataColumn(roleName: string): DataViewMetadataColumn;
        getCategoryColumnIdentityFields(roleName: string): powerbi.data.ISQExpr[];
        getCategoryDisplayName(roleName: string): string;
        hasCompositeCategories(): boolean;
        hasCategoryWithRole(roleName: string): boolean;
        getCategoryObjects(roleName: string, categoryIndex: number): DataViewObjects;
        hasValues(roleName: string): boolean;
        hasHighlights(roleName: string): boolean;
        /**
         * Obtains the value for the given role name, category index, and series index.
         *
         * Note: in cases where have multiple values in a role where the multiple values
         * are not being used to create a static series, the first is obtained. (this is
         * a rare case)
         */
        getValue(roleName: string, categoryIndex: number, seriesIndex?: number): any;
        /**
         * Obtains the highlighted value for the given role name, category index, and series index.
         *
         * Note: in cases where have multiple values in a role where the multiple values
         * are not being used to create a static series, the first is obtained. (this is
         * a rare case)
         */
        getHighlight(roleName: string, categoryIndex: number, seriesIndex?: number): any;
        /**
         * Obtains all the values for the given role name, category index, and series index, drawing
         * from each of the value columns at that intersection.  Used when you have multiple
         * values in a role that are not conceptually a static series.
         */
        getAllValuesForRole(roleName: string, categoryIndex: number, seriesIndex?: number): any[];
        /**
        * Obtains all meta data for the given role name, category index, and series index, drawing
        * from each of the value columns at that intersection.  Used when you have multiple
        * values in a role that are not conceptually a static series.
        */
        getAllValueMetadataColumnsForRole(roleName: string, seriesIndex?: number): DataViewMetadataColumn[];
        /**
         * Obtains all the highlight values for the given role name, category index, and series index, drawing
         * from each of the value columns at that intersection.  Used when you have multiple
         * values in a role that are not conceptually a static series.
         */
        getAllHighlightsForRole(roleName: string, categoryIndex: number, seriesIndex?: number): any[];
        /**
         * Obtains the first non-null value for the given role name and category index.
         * It should mainly be used for values that are expected to be the same across
         * series, but avoids false nulls when the data is sparse.
         */
        getFirstNonNullValueForCategory(roleName: string, categoryIndex: number): any;
        getMeasureQueryName(roleName: string): string;
        getValueColumn(roleName: string, seriesIndex?: number): DataViewValueColumn;
        getValueMetadataColumn(roleName: string, seriesIndex?: number): DataViewMetadataColumn;
        getValueDisplayName(roleName: string, seriesIndex?: number): string;
        hasDynamicSeries(): boolean;
        /**
         * Get the series count.  This requires a value role name for cases where you may
         * have a static series, but is not required if the only series you expect are dynamic
         * or single series.
         *
         * @param valueRoleName The role of the value for which a static series may exist
         */
        getSeriesCount(valueRoleName?: string): number;
        getSeriesObjects(seriesIndex: number): DataViewObjects;
        getSeriesValueColumns(): DataViewValueColumns;
        getSeriesValueColumnGroup(seriesIndex: number): DataViewValueColumnGroup;
        getSeriesMetadataColumn(): DataViewMetadataColumn;
        getSeriesColumnIdentityFields(): powerbi.data.ISQExpr[];
        getSeriesName(seriesIndex: number): PrimitiveValue;
        getSeriesDisplayName(): string;
        getStaticObjects(): DataViewObjects;
    }
}

declare module powerbi.data {
    module DataViewConcatenateCategoricalColumns {
        function detectAndApply(dataView: DataView, objectDescriptors: DataViewObjectDescriptors, applicableRoleMappings: DataViewMapping[], projectionOrdering: DataViewProjectionOrdering, projectionActiveItems: DataViewProjectionActiveItems): DataView;
        /** For applying concatenation to the DataViewCategorical that is the data for one of the frames in a play chart. */
        function applyToPlayChartCategorical(metadata: DataViewMetadata, objectDescriptors: DataViewObjectDescriptors, categoryRoleName: string, categorical: DataViewCategorical): DataView;
    }
}

declare module powerbi {
    module DataViewMapping {
        /**
         * Returns dataViewMapping.usage.regression if defined.  Else, returns undefined.
         */
        function getRegressionUsage(dataViewMapping: DataViewMapping): _.Dictionary<DataViewObjectPropertyIdentifier>;
    }
}

declare module powerbi {
    const enum RoleItemContext {
        CategoricalValue = 0,
        CategoricalValueGroup = 1,
    }
    interface IDataViewMappingVisitor {
        visitRole(role: string, context?: RoleItemContext): void;
        visitReduction?(reductionAlgorithm?: ReductionAlgorithm): void;
    }
    module DataViewMapping {
        function visitMapping(mapping: DataViewMapping, visitor: IDataViewMappingVisitor): void;
        function visitCategorical(mapping: DataViewCategoricalMapping, visitor: IDataViewMappingVisitor): void;
        function visitCategoricalCategories(mapping: DataViewRoleMappingWithReduction | DataViewListRoleMappingWithReduction, visitor: IDataViewMappingVisitor): void;
        function visitCategoricalValues(mapping: DataViewRoleMapping | DataViewGroupedRoleMapping | DataViewListRoleMapping, visitor: IDataViewMappingVisitor): void;
        function visitTable(mapping: DataViewTableMapping, visitor: IDataViewMappingVisitor): void;
        /**
         * For visiting DataViewMatrixMapping.rows, DataViewMatrixMapping.columns, or DataViewMatrixMapping.values.
         *
         * @param mapping Can be one of DataViewMatrixMapping.rows, DataViewMatrixMapping.columns, or DataViewMatrixMapping.values.
         * @param visitor The visitor.
         */
        function visitMatrixItems(mapping: DataViewRoleForMappingWithReduction | DataViewListRoleMappingWithReduction, visitor: IDataViewMappingVisitor): void;
        function visitTreeNodes(mapping: DataViewRoleForMappingWithReduction, visitor: IDataViewMappingVisitor): void;
        function visitTreeValues(mapping: DataViewRoleForMapping, visitor: IDataViewMappingVisitor): void;
        function visitGrouped(mapping: DataViewGroupedRoleMapping, visitor: IDataViewMappingVisitor): void;
    }
}

declare module powerbi.data {
    interface DataViewNormalizeValuesApplyOptions {
        dataview: DataView;
        dataViewMappings: DataViewMapping[];
        dataRoles: VisualDataRole[];
    }
    /**
     * Interface of a function for deciding whether a column is tied to any role that has required type(s).
     *
     * @param columnIndex the position of the column in the select statement, i.e. the same semantic as the index property on the DataViewMetadataColumn interface.
     * @returns true iff the column in the specified columnIndex is tied to any role that has required type(s), i.e. if the value in that column potentially needs to get normalized.
     */
    interface IMetadataColumnFilter {
        (columnIndex: number): boolean;
    }
    /**
     * Returns true iff the specified value is of matching type as required by the role assigned to the column associated with this filter object.
     */
    interface IColumnValueFilter {
        (value: any): boolean;
    }
    /**
     * Interface of a function for deciding whether a value needs to be normalized due to not having a matching type as required by a role tied to the column associated with the specified columnIndex.
     *
     * @param columnIndex the position of the column in the select statement, i.e. the same semantic as the index property on the DataViewMetadataColumn interface.
     * @returns false iff the specified value needs to be normalized due to not having a matching type as required by a role tied to the column associated with the specified columnIndex.
     */
    interface IValueFilter {
        (columnIndex: number, value: any): boolean;
    }
    module DataViewNormalizeValues {
        function apply(options: DataViewNormalizeValuesApplyOptions): void;
        function filterVariantMeasures(dataview: DataView, dataViewMappings: DataViewMapping[], rolesToNormalize: VisualDataRole[]): void;
        function generateMetadataColumnFilter(columns: DataViewMetadataColumn[], rolesToNormalize: VisualDataRole[]): IMetadataColumnFilter;
        function generateValueFilter(columns: DataViewMetadataColumn[], rolesToNormalize: VisualDataRole[]): IValueFilter;
        function getColumnRequiredTypes(column: DataViewMetadataColumn, rolesToNormalize: VisualDataRole[]): ValueType[];
        function normalizeVariant<T>(object: T, key: string | number, columnIndex: number, valueFilter: IValueFilter): T;
    }
}

declare module powerbi {
    module DataViewObjects {
        /** Gets the value of the given object/property pair. */
        function getValue<T>(objects: DataViewObjects, propertyId: DataViewObjectPropertyIdentifier, defaultValue?: T): T;
        /** Gets an object from objects. */
        function getObject(objects: DataViewObjects, objectName: string, defaultValue?: DataViewObject): DataViewObject;
        /** Gets a map of user-defined objects. */
        function getUserDefinedObjects(objects: DataViewObjects, objectName: string): DataViewObjectMap;
        /** Gets the solid color from a fill property. */
        function getFillColor(objects: DataViewObjects, propertyId: DataViewObjectPropertyIdentifier, defaultColor?: string): string;
        /** Returns true if the given object represents a collection of user-defined objects */
        function isUserDefined(objectOrMap: DataViewObject | DataViewObjectMap): boolean;
    }
    module DataViewObject {
        function getValue<T>(object: DataViewObject, propertyName: string, defaultValue?: T): T;
        /** Gets the solid color from a fill property using only a propertyName */
        function getFillColorByPropertyName(objects: DataViewObjects, propertyName: string, defaultColor?: string): string;
    }
}

declare module powerbi.data {
    /** Defines the values for particular objects. */
    interface DataViewObjectDefinitions {
        [objectName: string]: DataViewObjectDefinition[];
    }
    interface DataViewObjectDefinition {
        selector?: Selector;
        properties: DataViewObjectPropertyDefinitions;
    }
    interface DataViewObjectPropertyDefinitions {
        [name: string]: DataViewObjectPropertyDefinition;
    }
    type DataViewObjectPropertyDefinition = SQExpr | StructuralObjectDefinition;
    module DataViewObjectDefinitions {
        /** Creates or reuses a DataViewObjectDefinition for matching the given objectName and selector within the defns. */
        function ensure(defns: DataViewObjectDefinitions, objectName: string, selector: Selector): DataViewObjectDefinition;
        /**
         * Removes every property defined in targetDefns from sourceDefns if exists.
         * Properties are matches using ObjectName, Selector, and PropertyName.
         * @param {DataViewObjectDefinition} targetDefns Defenitions to remove properties from
         * @param {DataViewObjectDefinition} sourceDefns Defenitions to match properties against
         */
        function deleteProperties(targetDefns: DataViewObjectDefinitions, sourceDefns: DataViewObjectDefinitions): void;
        /**
         * Fills in missing properties with default ones, mutating the first definitions.
         * Properties are matched agains defaultDefns using ObjectName, Selector, and PropertyName.
         * It just fills missing properties, it doesn't overwrite existing ones.
         * Any property already in targetDefns will not change.
         * Any property in defaultDefns but not in targetDefns will be added by reference.
         * @param {DataViewObjectDefinitions} targetDefns Default definitions. Will be mutated. Expected to be defined
         * @param {DataViewObjectDefinitions} defaultDefns Definitions to fill inside targetDefns
         */
        function extend(targetDefns: DataViewObjectDefinitions, defaultDefns: DataViewObjectDefinitions): void;
        /**
         * Delete the first matching property from the Defns if it matches objName + selector + propertyName
         * @param {DataViewObjectDefinitions} defns
         * @param {string} objectName
         * @param {Selector} selector
         * @param {string} propertyName
         */
        function deleteProperty(defns: DataViewObjectDefinitions, objectName: string, selector: Selector, propertyName: string): void;
        /**
         *
         * @param {DataViewObjectDefinitions} defns
         * @param {DataViewObjectPropertyIdentifier} propertyId
         * @param {Selector} selector
         * @param {DataViewObjectPropertyDefinition} value
         */
        function setValue(defns: DataViewObjectDefinitions, propertyId: DataViewObjectPropertyIdentifier, selector: Selector, value: DataViewObjectPropertyDefinition): void;
        /**
         *
         * @param {DataViewObjectDefinitions} defns
         * @param {DataViewObjectPropertyIdentifier} propertyId
         * @param {Selector} selector
         * @returns
         */
        function getValue(defns: DataViewObjectDefinitions, propertyId: DataViewObjectPropertyIdentifier, selector: Selector): DataViewObjectPropertyDefinition;
        function getPropertyContainer(defns: DataViewObjectDefinitions, propertyId: DataViewObjectPropertyIdentifier, selector: Selector): DataViewObjectPropertyDefinitions;
        /**
         * Get the first DataViewObjectDefinition that match selector and objectName
         * @param {DataViewObjectDefinitions} defns DataViewObjectDefinitions to search
         * @param {string} objectName objectName to match
         * @param {Selector} selector selector to match
         * @returns The first match, if any. If no match, returns undefined
         */
        function getObjectDefinition(defns: DataViewObjectDefinitions, objectName: string, selector: Selector): DataViewObjectDefinition;
        function propertiesAreEqual(a: DataViewObjectPropertyDefinition, b: DataViewObjectPropertyDefinition): boolean;
        function allPropertiesAreEqual(a: DataViewObjectPropertyDefinitions, b: DataViewObjectPropertyDefinitions): boolean;
        function encodePropertyValue(value: DataViewPropertyValue, valueTypeDescriptor: ValueTypeDescriptor): DataViewObjectPropertyDefinition;
        function clone(original: DataViewObjectDefinitions): DataViewObjectDefinitions;
    }
    module DataViewObjectDefinition {
        function deleteSingleProperty(defn: DataViewObjectDefinition, propertyName: string): void;
    }
}

declare module powerbi.data {
    module DataViewObjectDescriptors {
        /** Attempts to find the format string property.  This can be useful for upgrade and conversion. */
        function findFormatString(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier;
        /** Attempts to find the filter property.  This can be useful for propagating filters from one visual to others. */
        function findFilterOutput(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier;
        /** Attempts to find the self filter property. */
        function findSelfFilter(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier;
        function isSelfFilter(descriptor: DataViewObjectPropertyDescriptor): boolean;
        /** Attempts to find the self filter enabled property. */
        function findSelfFilterEnabled(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier;
        /** Attempts to find the default value property.  This can be useful for propagating schema default value. */
        function findDefaultValue(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier;
    }
}

declare module powerbi.data {
    interface DataViewObjectDefinitionsByRepetition {
        metadataOnce?: DataViewObjectDefinitionsForSelector;
        userDefined?: DataViewObjectDefinitionsForSelector[];
        metadata?: DataViewObjectDefinitionsForSelector[];
        data: DataViewObjectDefinitionsForSelectorWithRule[];
    }
    interface DataViewObjectDefinitionsForSelector {
        selector?: Selector;
        objects: DataViewNamedObjectDefinition[];
    }
    interface DataViewObjectDefinitionsForSelectorWithRule extends DataViewObjectDefinitionsForSelector {
        rules?: RuleEvaluation[];
    }
    interface DataViewNamedObjectDefinition {
        name: string;
        properties: DataViewObjectPropertyDefinitions;
    }
    module DataViewObjectEvaluationUtils {
        function evaluateDataViewObjects(evalContext: IEvalContext, objectDescriptors: DataViewObjectDescriptors, objectDefns: DataViewNamedObjectDefinition[]): DataViewObjects;
        function groupObjectsBySelector(objectDefinitions: DataViewObjectDefinitions): DataViewObjectDefinitionsByRepetition;
        function addImplicitObjects(objectsForAllSelectors: DataViewObjectDefinitionsByRepetition, objectDescriptors: DataViewObjectDescriptors, columns: DataViewMetadataColumn[], selectTransforms: DataViewSelectTransform[]): void;
    }
}

declare module powerbi.data {
    /** Responsible for evaluating object property expressions to be applied at various scopes in a DataView. */
    module DataViewObjectEvaluator {
        function run(evalContext: IEvalContext, objectDescriptor: DataViewObjectDescriptor, propertyDefinitions: DataViewObjectPropertyDefinitions): DataViewObject;
        /** Note: Exported for testability */
        function evaluateProperty(evalContext: IEvalContext, propertyDescriptor: DataViewObjectPropertyDescriptor, propertyDefinition: DataViewObjectPropertyDefinition): any;
        function evaluateValue(evalContext: IEvalContext, definition: SQExpr | RuleEvaluation, valueType: ValueType): any;
    }
}
declare module powerbi.data {
    /** Responsible for evaluating and setting DataViewCategorical's values grouped() function. */
    module DataViewCategoricalEvalGrouped {
        function apply(categorical: DataViewCategorical): void;
    }
}
declare module powerbi.data {
    import DataViewMatrix = powerbi.DataViewMatrix;
    module DataViewMatrixProjectionOrder {
        function apply(prototype: DataViewMatrix, matrixMapping: DataViewMatrixMapping, projectionOrdering: DataViewProjectionOrdering, context: MatrixTransformationContext): DataViewMatrix;
    }
}

declare module powerbi.data {
    module DataViewPivotCategorical {
        /**
         * Pivots categories in a categorical DataView into valueGroupings.
         * This is akin to a mathematical matrix transpose.
         */
        function apply(dataView: DataView): DataView;
    }
}

declare module powerbi.data {
    module DataViewPivotMatrix {
        /** Pivots row hierarchy members in a matrix DataView into column hierarchy. */
        function apply(dataViewMatrix: DataViewMatrix, context: MatrixTransformationContext): void;
        function cloneTree(node: DataViewMatrixNode): DataViewMatrixNode;
        function cloneTreeExecuteOnLeaf(node: DataViewMatrixNode, callback?: (node: DataViewMatrixNode) => void): DataViewMatrixNode;
    }
}

declare module powerbi.data {
    module DataViewSelfCrossJoin {
        /**
         * Returns a new DataView based on the original, with a single DataViewCategorical category that is "cross joined"
         * to itself as a value grouping.
         * This is the mathematical equivalent of taking an array and turning it into an identity matrix.
         */
        function apply(dataView: DataView): DataView;
    }
}

declare module powerbi.data {
    module DataViewPivotCategoricalToPrimaryGroups {
        /**
         * If mapping requests cross axis data reduction and the binding has secondary grouping, mutates the binding to
         * pivot the secondary before the primary.
         */
        function pivotBinding(binding: DataShapeBinding, allMappings: CompiledDataViewMapping[], finalMapping: CompiledDataViewMapping, defaultDataVolume: number): void;
        function unpivotResult(oldDataView: DataView, selects: DataViewSelectTransform[], roleKindByQueryRef: DataViewAnalysis.RoleKindByQueryRef, queryProjectionsByRole: QueryProjectionsByRole, applicableRoleMappings: DataViewMapping[]): DataView;
    }
}
declare module powerbi.data {
    import INumberDictionary = jsCommon.INumberDictionary;
    /** Responsible for removing selects from the DataView. */
    module DataViewRemoveSelects {
        function apply(dataView: DataView, targetDataViewKinds: StandardDataViewKinds, selectsToInclude: INumberDictionary<boolean>): void;
    }
}
declare module powerbi.data {
    import RoleKindByQueryRef = powerbi.DataViewAnalysis.RoleKindByQueryRef;
    /**
     * A property bag containing information about a DataViewTransform session, including input arguments and some values derived from the input arguments.
     *
     * This interface is part of the internal implementation of DataViewTransform and is subject to frequent changes.
     *
     * All properties in this context interface are agnostic to any specific "split" in the transform.
     * E.g. DataViewTransformContext.transforms.splits has the select indices in each split, but an instance of this context is not tied to a particular split.
     *
     * Also, DataViewTransformContext does not include a property for the dataView object(s) in transformation, because almost all of the existing DataViewTransform functions
     * handles one dataView at a time, and DataViewTransformContext should not have a property containing the dataView for a specific split.
     *
     * And to avoid confusion, this DataViewTransformContext does not include a property for the visual dataView, because almost all functions in DataViewTransform
     * are chained together by taking the output DataView from one function and use it as the input of the next.  It never needs to get back to the very original prototype.
     *
     * ////////////////////////////////////////////////////////////////////////////////////////////////////////////
     * 2016/06/29 Notes about visualCapabilitiesRoleMappings/visualCapabilitiesDataViewKinds vs. applicableRoleMappings/applicableDataViewKinds:
     *
     * - Short version -
     * For the time being, use visualCapabilitiesRoleMappings/visualCapabilitiesDataViewKinds for the essential transforms that would otherwise
     * crash the visuals code if not performed (such as DataViewTransform.transformSelects()).
     *
     * Use applicableRoleMappings/applicableDataViewKinds for the more advanced transforms that procude the correct visual dataView (such as categorical concatentation).
     *
     * - Long version -
     * visualCapabilitiesRoleMappings is the full list of role mappings as specified in Visual Capabilities, whereas applicableRoleMappings is the
     * actual applicable one(s) based on the select fields in each of the role buckets.
     *
     * There is a bug (VSTS 7427800) in DataViewTransformActionsSerializer such that some DataViewTransformActions converted from VisualElements will contain incorrect values.
     *
     * With incorrect DataViewTransformActions input, DataViewAnalysis cannot possibly compute the correct applicableRoleMappings, and hence the
     * visual dataView from DataViewTransform will be incorrect.  This is why sometimes when you open a report in PBI Portal, the initial rendering of some visuals
     * are incorrect (most frequently on combo chart).
     *
     * However, no one has fixed or complained about it yet because the visuals will automatically re-render correctly within a couple seconds, thanks to the
     * automatic query re-generation and re-execution that always follow after the initial rendering.  The DataViewTransformActions from this re-generated query
     * will be correct and the visuals will then render with the correctly transformed visual dataView.
     *
     * Because of the above, the existing DataViewTransform code thus far has never relied on applicableRoleMappings for deciding whether to perform the very essential transforms
     * such as DataViewTransform.transformSelects(), because without which the dataView will be missing some important properties and will lead to crashes in visuals code.
     * As long as the relevant dataView kind is in visualCapabilitiesDataViewKinds, those transform operations will get carried out, even if it is not in applicableDataViewKinds.
     *
     * Unfortunately, there are also some transform operations that requires applicableRoleMappings, and hence DataViewTransformContext has both sets of properties for now.
     *
     * When the bug in DataViewTransformActionsSerializer gets fixed and DataViewTransformActions is always correct,
     * then visualCapabilitiesRoleMappings/visualCapabilitiesDataViewKinds can be completely replaced by applicableRoleMappings/applicableDataViewKinds in DataViewTransform.
     */
    interface DataViewTransformContext {
        /**
         * The metadata property of the query DataView.
         */
        queryDataViewMetadata: DataViewMetadata;
        /**
         * From Visual Capabilities.  Can be undefined.
         */
        objectDescriptors?: DataViewObjectDescriptors;
        /**
         * From Visual Capabilities.  Can be undefined.
         */
        dataRoles?: VisualDataRole[];
        transforms: DataViewTransformActions;
        colorAllocatorFactory: IColorAllocatorFactory;
        /**
         * The select transforms for this DataViewTransform session.
         * This property contains the same object as this.transforms.selects.
         *
         * Can be undefined or empty.  Can contain undefined elements.
         */
        selectTransforms?: DataViewSelectTransform[];
        /** This property contains the same object as this.transforms.roles.ordering.  Can be undefined. */
        projectionOrdering?: DataViewProjectionOrdering;
        /** This property contains the same object as this.transforms.roles.activeItems.  Can be undefined. */
        projectionActiveItems?: DataViewProjectionActiveItems;
        /** The mapping from queryRef to VisualDataRoleKind value (Grouping, Measure, etc), computed from query DataView's metadata. */
        roleKindByQueryRef: RoleKindByQueryRef;
        /** The mapping from role name to query projection. */
        queryProjectionsByRole: QueryProjectionsByRole;
        /**
         * The full list of possible target dataView kinds in this DataViewTransform session, as specified in Visual Capabilities role mappings.
         *
         * Can be undefined.
         *
         * Note: When applicableRoleMappings becomes reliable, all usages of this property should use applicableRoleMappings instead.
         */
        visualCapabilitiesRoleMappings?: DataViewMapping[];
        /**
         * All possible target dataView kinds in this DataViewTransform session, which is taken from all possible dataView kinds listed in visual capabilities role mapping.
         *
         * Note: When applicableDataViewKinds becomes reliable, all usages of this property should use applicableDataViewKinds instead.
         */
        visualCapabilitiesDataViewKinds: StandardDataViewKinds;
        /**
         * The applicable DataViewMappings for this transform, as computed by DataViewAnalysis.
         * This property is undefined if there is no supported DataViewMappings for the other specified inputs.
         *
         * Note: There is currently a bug in DataViewTransformActionsSerializer that leads to incorrect DataViewTransformActions.
         * As a result, this property can contain incorrect value until the query is regenerated and this property recomputed.
         */
        applicableRoleMappings?: DataViewMapping[];
        /**
         * The applicable dataView kinds of this DataViewTransform session, as computed from applicableRoleMappings.
         *
         * Note: There is currently a bug in DataViewTransformActionsSerializer that leads to incorrect DataViewTransformActions.
         * As a result, this property can contain incorrect value until the query is regenerated and this property recomputed.
         */
        applicableDataViewKinds: StandardDataViewKinds;
    }
    module DataViewTransformContext {
        /**
         * Creates an object that all properties in the DataViewTransformContext interface.
         *
         * @param queryDataViewMetadata The metadata property of the query DataView.
         * @param objectDescriptors From Visual Capabilities.  Can be undefined.
         * @param dataViewMappings From Visual Capabilities.  Can be undefined.
         * @param dataRoles From Visual Capabilities.  Can be undefined.
         * @param transforms
         * @param colorAllocatorFactory
         */
        function create(queryDataViewMetadata: DataViewMetadata, objectDescriptors: DataViewObjectDescriptors, dataViewMappings: DataViewMapping[], dataRoles: VisualDataRole[], transforms: DataViewTransformActions, colorAllocatorFactory: IColorAllocatorFactory): DataViewTransformContext;
    }
}
declare module powerbi.data {
    import INumberDictionary = jsCommon.INumberDictionary;
    interface DataViewTransformApplyOptions {
        prototype: DataView;
        objectDescriptors: DataViewObjectDescriptors;
        dataViewMappings?: DataViewMapping[];
        transforms: DataViewTransformActions;
        colorAllocatorFactory: IColorAllocatorFactory;
        dataRoles: VisualDataRole[];
    }
    /** Describes the Transform actions to be done to a prototype DataView. */
    interface DataViewTransformActions {
        /** Describes transform metadata for each semantic query select item, as the arrays align, by index. */
        selects?: DataViewSelectTransform[];
        /** Describes the DataViewObject definitions. */
        objects?: DataViewObjectDefinitions;
        /** Describes the splitting of a single input DataView into multiple DataViews. */
        splits?: DataViewSplitTransform[];
        /** Describes the projection metadata which includes projection ordering and active items. */
        roles?: DataViewRoleTransformMetadata;
    }
    interface DataViewSplitTransform {
        selects: INumberDictionary<boolean>;
    }
    interface DataViewProjectionOrdering {
        [roleName: string]: number[];
    }
    interface DataViewProjectionActiveItemInfo {
        queryRef: string;
        /** Describes if the active item should be ignored in concatenation.
            If the active item has a drill filter, it will not be used in concatenation.
            If the value of suppressConcat is true, the activeItem will be ommitted from concatenation. */
        suppressConcat?: boolean;
    }
    interface DataViewProjectionActiveItems {
        [roleName: string]: DataViewProjectionActiveItemInfo[];
    }
    interface DataViewRoleTransformMetadata {
        /** Describes the order of selects (referenced by query index) in each role. */
        ordering?: DataViewProjectionOrdering;
        /** Describes the active items in each role. */
        activeItems?: DataViewProjectionActiveItems;
    }
    interface MatrixTransformationContext {
        rowHierarchyRewritten: boolean;
        columnHierarchyRewritten: boolean;
        hierarchyTreesRewritten: boolean;
    }
    const enum StandardDataViewKinds {
        None = 0,
        Categorical = 1,
        Matrix = 2,
        Single = 4,
        Table = 8,
        Tree = 16,
    }
    module DataViewTransform {
        function apply(options: DataViewTransformApplyOptions): DataView[];
        function transformObjects(dataView: DataView, targetDataViewKinds: StandardDataViewKinds, objectDescriptors: DataViewObjectDescriptors, objectDefinitions: DataViewObjectDefinitions, selectTransforms: DataViewSelectTransform[], colorAllocatorFactory: IColorAllocatorFactory): void;
        function createValueColumns(values?: DataViewValueColumn[], valueIdentityFields?: SQExpr[], source?: DataViewMetadataColumn): DataViewValueColumns;
        function setGrouped(values: DataViewValueColumns, groupedResult?: DataViewValueColumnGroup[]): void;
    }
}

declare module powerbi.data {
    function createDisplayNameGetter(displayNameKey: string): (IStringResourceProvider) => string;
    function getDisplayName(displayNameGetter: data.DisplayNameGetter, resourceProvider: jsCommon.IStringResourceProvider): string;
}

declare module powerbi.data {
    /** Represents a data reader. */
    interface IDataReader {
        /** Executes a query, with a promise of completion.  The response object should be compatible with the transform implementation. */
        execute?(options: DataReaderExecutionOptions): RejectablePromise2<DataReaderData, IClientError>;
        /** Transforms the given data into a DataView.  When this function is not specified, the data is put on a property on the DataView. */
        transform?(obj: DataReaderData): DataReaderTransformResult;
        /** Stops all future communication and reject and pending communication  */
        stopCommunication?(): void;
        /** Resumes communication which enables future requests */
        resumeCommunication?(): void;
        /** Clear cache */
        clearCache?(dataSource: DataReaderDataSource): void;
        /** rewriteCacheEntries */
        rewriteCacheEntries?(dataSource: DataReaderDataSource, rewriter: DataReaderCacheRewriter): void;
        /** Sets the result into the local cache */
        setLocalCacheResult?(options: DataReaderExecutionOptions, dataAsObject: DataReaderData): void;
    }
    /** Represents a query generator. */
    interface IQueryGenerator {
        /** Query generation function to convert a (prototype) SemanticQuery to a runnable query command. */
        execute(options: QueryGeneratorOptions): QueryGeneratorResult;
    }
    interface IFederatedConceptualSchemaReader {
        /** Executes a request for conceptual schema with a promise of completion. */
        execute(options: FederatedConceptualSchemaReaderOptions): IPromise<FederatedConceptualSchemaResponse>;
        /** Transforms the given data into a FederatedConceptualSchema. */
        transform(obj: FederatedConceptualSchemaResponse): SchemaReaderTransformResult;
    }
    /** Represents a custom data reader plugin, to be registered in the powerbi.data.plugins object. */
    interface IDataReaderPlugin {
        /** The name of this plugin. */
        name: string;
        /** Factory method for the IDataReader. */
        reader(hostServices: IDataReaderHostServices): IDataReader;
        /** Factory method for the IQueryGenerator. */
        queryGenerator?(): IQueryGenerator;
        /** Factory method for the IFederatedConceptualSchemaReader. */
        schemaReader?(hostServices: IDataReaderHostServices): IFederatedConceptualSchemaReader;
    }
    interface QueryGeneratorOptions {
        query: SemanticQuery;
        mappings: CompiledDataViewMapping[];
        additionalProjections?: AdditionalQueryProjection[];
        highlightFilter?: SemanticFilter;
        restartToken?: RestartToken;
        dataWindow?: QueryGeneratorDataWindow;
    }
    interface AdditionalQueryProjection {
        queryName: string;
        selector: Selector;
        aggregates?: ProjectionAggregates;
        joinPredicate?: JoinPredicateBehavior;
    }
    interface ProjectionAggregates {
        min?: boolean;
        max?: boolean;
        percentiles?: ProjectionPercentileAggregate[];
    }
    interface ProjectionPercentileAggregate {
        exclusive?: boolean;
        k: number;
    }
    interface QueryGeneratorResult {
        command: DataReaderQueryCommand;
        splits?: DataViewSplitTransform[];
        /**
         * If the query generator needs to rewrite the input query, this property will contain information about the important changes.
         *
         * Any rewrite done by query generator should be internal to the particular query generator, but in some rare cases this information
         * is needed in order for other components to correctly consume the query result.
         */
        queryRewrites?: QueryRewriteRecordContainer[];
    }
    /**
     * In each instance of QueryRewriteRecordContainer, exactly one of the optional properties will be populated with change record.
     */
    interface QueryRewriteRecordContainer {
        selectExprAdded?: QueryRewriteSelectExprAddedRecord;
        aggregatesAdded?: QueryRewriteSelectExprAggregatesAddedRecord;
        projectionQueryRefChanged?: QueryRewriteProjectionQueryRefChangedRecord;
    }
    /** Indicates a new SQExpr got added at a particular index. */
    interface QueryRewriteSelectExprAddedRecord {
        selectIndex: number;
        namedSQExpr: NamedSQExpr;
    }
    interface QueryRewriteSelectExprAggregatesAddedRecord {
        originalQueryRef: string;
        aggregates: QueryRewriteAddedAggregates;
    }
    interface QueryRewriteAddedAggregates {
        min?: QueryRewriteAddedAggregateSource;
        max?: QueryRewriteAddedAggregateSource;
    }
    interface QueryRewriteAddedAggregateSource {
        index: number;
        expr: SQExpr;
    }
    /** Indicates a queryRef in the query projection for a particular role got changed. */
    interface QueryRewriteProjectionQueryRefChangedRecord {
        /** The role for which a queryRef in the query projection got changed. */
        role: string;
        /** The original queryRef. */
        oldQueryRef: string;
        /** The new, internal queryRef. */
        newInternalQueryRef: string;
    }
    interface DataReaderTransformResult {
        dataView?: DataView;
        restartToken?: RestartToken;
        error?: IClientError;
        warning?: IClientWarning;
        /** A value of true in this property indicates that the DataReaderData object from which this result is generated should not get persisted as contract cache nor server cache. */
        disallowPersisting?: boolean;
    }
    interface QueryGeneratorDataWindow {
    }
    interface RestartToken {
    }
    interface DataReaderQueryCommand {
    }
    /** Represents a query command defined by an IDataReader. */
    interface DataReaderCommand {
    }
    /** Represents a data source defined by an IDataReader. */
    interface DataReaderDataSource {
    }
    /** Represents arbitrary data defined by an IDataReader. */
    interface DataReaderData {
    }
    /** Represents cacheRewriter that will rewrite the cache of reader as defined by an IDataReader. */
    interface DataReaderCacheRewriter {
    }
    interface DataReaderExecutionOptions {
        dataSource?: DataReaderDataSource;
        command: DataReaderCommand;
        allowCache?: boolean;
        allowClientSideFilters?: boolean;
        cacheResponseOnServer?: boolean;
        ignoreViewportForCache?: boolean;
    }
    interface FederatedConceptualSchemaReaderOptions {
        dataSources: ConceptualSchemaReaderDataSource[];
    }
    interface ConceptualSchemaReaderDataSource {
        id: number;
        /** Specifies the name used in Semantic Queries to reference this DataSource. */
        name: string;
        /** Specifies the type of IDataReaderPlugin. */
        type?: string;
    }
    interface FederatedConceptualSchemaResponse {
        data: FederatedConceptualSchemaData;
    }
    interface FederatedConceptualSchemaData {
    }
    interface SchemaReaderTransformResult {
        schema: FederatedConceptualSchema;
        error?: SchemaReaderError;
    }
    interface SchemaReaderError {
        requestId?: string;
        serviceError?: ServiceError;
        clientError: IClientError;
    }
    interface IDataReaderHostServices {
        promiseFactory(): IPromiseFactory;
    }
}

declare module powerbi {
    /** Enumeration of DateTimeUnits */
    enum DateTimeUnit {
        Year = 0,
        Month = 1,
        Week = 2,
        Day = 3,
        Hour = 4,
        Minute = 5,
        Second = 6,
        Millisecond = 7,
    }
    interface IFormattingService {
        /**
         * Formats the value using provided format expression and culture
         * @param value - value to be formatted and converted to string.
         * @param format - format to be applied. If undefined or empty then generic format is used.
         */
        formatValue(value: any, format?: string): string;
        /**
         * Replaces the indexed format tokens (for example {0:c2}) in the format string with the localized formatted arguments.
         * @param formatWithIndexedTokens - format string with a set of indexed format tokens.
         * @param args - array of values which should replace the tokens in the format string.
         * @param culture - localization culture. If undefined then the current culture is used.
         */
        format(formatWithIndexedTokens: string, args: any[], culture?: string): string;
        /** Gets a value indicating whether the specified format a standard numeric format specifier. */
        isStandardNumberFormat(format: string): boolean;
        /** Performs a custom format with a value override.  Typically used for custom formats showing scaled values. */
        formatNumberWithCustomOverride(value: number, format: string, nonScientificOverrideFormat: string): string;
        /** Gets the format string to use for dates in particular units. */
        dateFormatString(unit: DateTimeUnit): string;
    }
}

declare module powerbi.data {
    /** Represents common expression patterns for 'field' expressions such as columns, column aggregates, measures, etc. */
    interface FieldExprPattern {
        column?: FieldExprColumnPattern;
        columnAggr?: FieldExprColumnAggrPattern;
        columnHierarchyLevelVariation?: FieldExprColumnHierarchyLevelVariationPattern;
        entity?: FieldExprEntityPattern;
        entityAggr?: FieldExprEntityAggrPattern;
        hierarchy?: FieldExprHierarchyPattern;
        hierarchyLevel?: FieldExprHierarchyLevelPattern;
        hierarchyLevelAggr?: FieldExprHierarchyLevelAggrPattern;
        measure?: FieldExprMeasurePattern;
        percentile?: FieldExprPercentilePattern;
        percentOfGrandTotal?: FieldExprPercentOfGrandTotalPattern;
        selectRef?: FieldExprSelectRefPattern;
    }
    /** By design there is no default, no-op visitor. Components concerned with patterns need to be aware of all patterns as they are added. */
    interface IFieldExprPatternVisitor<T> {
        visitColumn(column: FieldExprColumnPattern): T;
        visitColumnAggr(columnAggr: FieldExprColumnAggrPattern): T;
        visitColumnHierarchyLevelVariation(columnHierarchyLevelVariation: FieldExprColumnHierarchyLevelVariationPattern): T;
        visitEntity(entity: FieldExprEntityPattern): T;
        visitEntityAggr(entityAggr: FieldExprEntityAggrPattern): T;
        visitHierarchy(hierarchy: FieldExprHierarchyPattern): T;
        visitHierarchyLevel(hierarchyLevel: FieldExprHierarchyLevelPattern): T;
        visitHierarchyLevelAggr(hierarchyLevelAggr: FieldExprHierarchyLevelAggrPattern): T;
        visitMeasure(measure: FieldExprMeasurePattern): T;
        visitPercentile(percentile: FieldExprPercentilePattern): T;
        visitPercentOfGrandTotal(percentOfGrandTotal: FieldExprPercentOfGrandTotalPattern): T;
        visitSelectRef(selectRef: FieldExprSelectRefPattern): T;
    }
    interface FieldExprEntityPattern {
        schema: string;
        entity: string;
        entityVar?: string;
    }
    interface FieldExprEntityItemPattern extends FieldExprEntityPattern {
    }
    interface FieldExprEntityPropertyPattern extends FieldExprEntityItemPattern {
        name: string;
    }
    type FieldExprColumnPattern = FieldExprEntityPropertyPattern;
    type FieldExprMeasurePattern = FieldExprEntityPropertyPattern;
    type FieldExprHierarchyPattern = FieldExprEntityPropertyPattern;
    type FieldExprPropertyPattern = FieldExprColumnPattern | FieldExprMeasurePattern | FieldExprHierarchyPattern;
    interface FieldExprEntityAggrPattern extends FieldExprEntityPattern {
        aggregate: QueryAggregateFunction;
    }
    interface FieldExprColumnAggrPattern extends FieldExprColumnPattern {
        aggregate: QueryAggregateFunction;
    }
    interface FieldExprHierarchyLevelPattern extends FieldExprEntityItemPattern {
        name: string;
        level: string;
    }
    interface FieldExprHierarchyLevelAggrPattern extends FieldExprHierarchyLevelPattern {
        aggregate: QueryAggregateFunction;
    }
    interface FieldExprColumnHierarchyLevelVariationPattern {
        source: FieldExprColumnPattern;
        level: FieldExprHierarchyLevelPattern;
        variationName: string;
    }
    interface FieldExprPercentilePattern {
        arg: FieldExprPattern;
        k: number;
        exclusive: boolean;
    }
    interface FieldExprPercentOfGrandTotalPattern {
        baseExpr: FieldExprPattern;
    }
    interface FieldExprSelectRefPattern {
        expressionName: string;
    }
    module SQExprBuilder {
        function fieldExpr(fieldExpr: FieldExprPattern): SQExpr;
        function fromColumnAggr(columnAggr: FieldExprColumnAggrPattern): SQAggregationExpr;
        function fromColumn(column: FieldExprColumnPattern): SQColumnRefExpr;
        function fromEntity(entityPattern: FieldExprEntityPattern): SQEntityExpr;
        function fromEntityAggr(entityAggr: FieldExprEntityAggrPattern): SQAggregationExpr;
        function fromHierarchyLevelAggr(hierarchyLevelAggr: FieldExprHierarchyLevelAggrPattern): SQAggregationExpr;
        function fromHierarchyLevel(hierarchyLevelPattern: FieldExprHierarchyLevelPattern): SQHierarchyLevelExpr;
        function fromHierarchy(hierarchyPattern: FieldExprHierarchyPattern): SQHierarchyExpr;
    }
    module SQExprConverter {
        function asFieldPattern(sqExpr: SQExpr, schema?: FederatedConceptualSchema): FieldExprPattern;
    }
    module FieldExprPattern {
        function visit<T>(expr: SQExpr | FieldExprPattern, visitor: IFieldExprPatternVisitor<T>): T;
        function toColumnRefSQExpr(columnPattern: FieldExprColumnPattern): SQColumnRefExpr;
        function getAggregate(fieldExpr: FieldExprPattern): QueryAggregateFunction;
        function isAggregation(fieldExpr: FieldExprPattern): boolean;
        function hasFieldExprName(fieldExpr: FieldExprPattern): boolean;
        function getPropertyName(fieldExpr: FieldExprPattern): string;
        function getHierarchyName(fieldExpr: FieldExprPattern): string;
        function getColumnRef(fieldExpr: FieldExprPattern): FieldExprPropertyPattern;
        function getFieldExprName(fieldExpr: FieldExprPattern): string;
        function getSchema(fieldExpr: FieldExprPattern): string;
        function toFieldExprEntityPattern(fieldExpr: FieldExprPattern): FieldExprEntityPattern;
        function toFieldExprEntityItemPattern(fieldExpr: FieldExprPattern): FieldExprEntityPattern;
    }
}

declare module powerbi {
    module DataViewAnalysis {
        import QueryProjectionsByRole = powerbi.data.QueryProjectionsByRole;
        import DataViewObjectDescriptors = powerbi.data.DataViewObjectDescriptors;
        import DataViewObjectDefinitions = powerbi.data.DataViewObjectDefinitions;
        interface ValidateAndReshapeResult {
            dataView?: DataView;
            isValid: boolean;
        }
        interface RoleKindByQueryRef {
            [queryRef: string]: VisualDataRoleKind;
        }
        interface DataViewMappingResult {
            supportedMappings: DataViewMapping[];
            /** A set of mapping errors if there are no supported mappings */
            mappingErrors: DataViewMappingMatchError[];
        }
        enum DataViewMappingMatchErrorCode {
            conditionRangeTooLarge = 0,
            conditionRangeTooSmall = 1,
            conditionKindExpectedMeasure = 2,
            conditionKindExpectedGrouping = 3,
            conditionKindExpectedGroupingOrMeasure = 4,
        }
        interface DataViewMappingMatchError {
            code: DataViewMappingMatchErrorCode;
            roleName: string;
            mappingIndex?: number;
            conditionIndex?: number;
        }
        /** Reshapes the data view to match the provided schema if possible. If not, returns null */
        function validateAndReshape(dataView: DataView, dataViewMappings: DataViewMapping[]): ValidateAndReshapeResult;
        function countGroups(columns: DataViewMetadataColumn[]): number;
        function countMeasures(columns: DataViewMetadataColumn[]): number;
        /** Indicates whether the dataView conforms to the specified schema. */
        function supports(dataView: DataView, roleMapping: DataViewMapping, usePreferredDataViewSchema?: boolean): boolean;
        /**
         * Determines whether the value conforms to the range in the role condition, returning undefined
         * if so or an appropriate error code if not.
         */
        function validateRange(value: number, roleCondition: RoleCondition, ignoreMin?: boolean): DataViewMappingMatchErrorCode;
        /** Determines the appropriate DataViewMappings for the projections. */
        function chooseDataViewMappings(projections: QueryProjectionsByRole, mappings: DataViewMapping[], roleKindByQueryRef: RoleKindByQueryRef, objectDescriptors?: DataViewObjectDescriptors, objectDefinitions?: DataViewObjectDefinitions): DataViewMappingResult;
        function getPropertyCount(roleName: string, projections: QueryProjectionsByRole, useActiveIfAvailable?: boolean): number;
        function hasSameCategoryIdentity(dataView1: DataView, dataView2: DataView): boolean;
        function areMetadataColumnsEquivalent(column1: DataViewMetadataColumn, column2: DataViewMetadataColumn): boolean;
        function isMetadataEquivalent(metadata1: DataViewMetadata, metadata2: DataViewMetadata): boolean;
    }
}

declare module powerbi.data {
    module DataViewRoleWildcard {
        function fromRoles(roles: string[]): DataViewRoleWildcard;
        function equals(firstRoleWildcard: DataViewRoleWildcard, secondRoleWildcard: DataViewRoleWildcard): boolean;
    }
}

declare module powerbi {
    module DataViewScopeIdentity {
        /** Compares the two DataViewScopeIdentity values for equality. */
        function equals(x: DataViewScopeIdentity, y: DataViewScopeIdentity, ignoreCase?: boolean): boolean;
        function filterFromIdentity(identities: DataViewScopeIdentity[], isNot?: boolean): data.SemanticFilter;
        function filterFromExprs(orExprs: data.SQExpr[], isNot?: boolean): data.SemanticFilter;
    }
    module data {
        function createDataViewScopeIdentity(expr: SQExpr): DataViewScopeIdentity;
    }
}

declare module powerbi.data {
    module DataViewScopeWildcard {
        function matches(wildcard: DataViewScopeWildcard, instance: DataViewScopeIdentity): boolean;
        function equals(firstScopeWildcard: DataViewScopeWildcard, secondScopeWildcard: DataViewScopeWildcard): boolean;
        function fromExprs(exprs: SQExpr[]): DataViewScopeWildcard;
    }
}

declare module powerbi.data {
    interface IColorAllocatorCache {
        get(key: SQFillRuleExpr): IColorAllocator;
        register(key: SQFillRuleExpr, colorAllocator: IColorAllocator): this;
    }
    function createColorAllocatorCache(): IColorAllocatorCache;
}

declare module powerbi.data {
    /** Responsible for providing specific values to be used by expression and rule evaluation. */
    interface IEvalContext {
        getColorAllocator(expr: SQFillRuleExpr): IColorAllocator;
        getExprValue(expr: SQExpr): PrimitiveValue;
        getRoleValue(roleName: string): PrimitiveValue;
    }
}

declare module powerbi.data {
    import DataViewMapping = powerbi.DataViewMapping;
    import RoleKindByQueryRef = DataViewAnalysis.RoleKindByQueryRef;
    interface DataViewRegressionRunOptions {
        visualDataViews: DataView[];
        dataRoles: VisualDataRole[];
        objectDescriptors: DataViewObjectDescriptors;
        objectDefinitions: DataViewObjectDefinitions;
        colorAllocatorFactory: IColorAllocatorFactory;
        transformSelects: DataViewSelectTransform[];
        applicableDataViewMappings: DataViewMapping[];
        roleKindByQueryRef: RoleKindByQueryRef;
        queryProjectionsByRole: QueryProjectionsByRole;
    }
    module DataViewRegression {
        const regressionYQueryName: string;
        function run(options: DataViewRegressionRunOptions): DataView[];
        /**
         * This function will compute the linear regression algorithm on the sourceDataView and create a new dataView.
         * It works on scalar axis only.
         * The algorithm is as follows
         *
         * 1. Find the cartesian X and Y roles and the columns that correspond to those roles
         * 2. Get the data points, (X, Y) pairs, for each series, combining if needed.
         * 3. Compute the X and Y points for regression line using Y = Slope * X + Intercept
         * If highlights values are present, repeat steps 2 & 3 using highlight values.
         * 4. Create the new dataView using the points computed above
         */
        function linearRegressionTransform(sourceDataView: DataView, dataRoles: VisualDataRole[], regressionDataViewMapping: DataViewMapping, objectDescriptors: DataViewObjectDescriptors, objectDefinitions: DataViewObjectDefinitions, colorAllocatorFactory: IColorAllocatorFactory): DataView;
    }
}

declare module powerbi.data {
    import RoleKindByQueryRef = DataViewAnalysis.RoleKindByQueryRef;
    interface DataViewSelectTransform {
        displayName?: string;
        queryName?: string;
        format?: string;
        type?: ValueType;
        roles?: {
            [roleName: string]: boolean;
        };
        kpi?: DataViewKpiColumnMetadata;
        sort?: SortDirection;
        expr?: SQExpr;
        discourageAggregationAcrossGroups?: boolean;
        /** Describes the default value applied to a column, if any. */
        defaultValue?: DefaultValueDefinition;
        aggregateSources?: DataViewSelectAggregateSources;
    }
    interface DataViewSelectAggregateSources {
        min?: DataViewSelectAggregateSource;
        max?: DataViewSelectAggregateSource;
    }
    interface DataViewSelectAggregateSource {
        index: number;
    }
    module DataViewSelectTransform {
        /** Convert selection info to projections */
        function projectionsFromSelects(selects: DataViewSelectTransform[], projectionActiveItems: DataViewProjectionActiveItems): QueryProjectionsByRole;
        /** Use selections and metadata to fashion query role kinds */
        function createRoleKindFromMetadata(selects: DataViewSelectTransform[], metadata: DataViewMetadata): RoleKindByQueryRef;
    }
}
declare module powerbi.data {
    interface ICategoricalEvalContext extends IEvalContext {
        setCurrentRowIndex(index: number): void;
    }
    function createCategoricalEvalContext(colorAllocatorProvider: IColorAllocatorCache, dataViewCategorical: DataViewCategorical, selectTransforms: DataViewSelectTransform[]): ICategoricalEvalContext;
}

declare module powerbi.data {
    interface ITableEvalContext extends IEvalContext {
        setCurrentRowIndex(index: number): void;
    }
    function createTableEvalContext(colorAllocatorProvider: IColorAllocatorCache, dataViewTable: DataViewTable, selectTransforms: DataViewSelectTransform[]): ITableEvalContext;
}

declare module powerbi.data {
    class RuleEvaluation {
        evaluate(evalContext: IEvalContext): any;
    }
}

declare module powerbi.data {
    class ColorRuleEvaluation extends RuleEvaluation {
        private inputRole;
        private allocator;
        constructor(inputRole: string, allocator: IColorAllocator);
        evaluate(evalContext: IEvalContext): any;
    }
}

declare module powerbi.data {
    import ArrayNamedItems = jsCommon.ArrayNamedItems;
    class ConceptualSchema {
        entities: ArrayNamedItems<ConceptualEntity>;
        capabilities: ConceptualCapabilities;
        /** Indicates whether the user can edit this ConceptualSchema.  This is used to enable/disable model authoring UX. */
        canEdit: boolean;
        findProperty(entityName: string, propertyName: string): ConceptualProperty;
        findHierarchy(entityName: string, name: string): ConceptualHierarchy;
        findHierarchyByVariation(variationEntityName: string, variationColumnName: string, variationName: string, hierarchyName: string): ConceptualHierarchy;
        findTargetEntityOfVariation(variationEntityName: string, variationColumnName: string, variationName: string): ConceptualEntity;
        /**
        * Returns the first property of the entity whose kpi is tied to kpiProperty
        */
        findPropertyWithKpi(entityName: string, kpiProperty: ConceptualProperty): ConceptualProperty;
    }
    interface ConceptualCapabilities {
        discourageQueryAggregateUsage: boolean;
        normalizedFiveStateKpiRange: boolean;
        supportsMedian: boolean;
        supportsPercentile: boolean;
        supportsScopedEval: boolean;
    }
    interface ConceptualPropertyItemContainer {
        properties: ArrayNamedItems<ConceptualProperty>;
        hierarchies?: ArrayNamedItems<ConceptualHierarchy>;
        displayFolders?: ArrayNamedItems<ConceptualDisplayFolder>;
    }
    interface ConceptualPropertyItem {
        name: string;
        displayName: string;
        hidden?: boolean;
    }
    interface ConceptualEntity extends ConceptualPropertyItemContainer {
        name: string;
        displayName: string;
        visibility?: ConceptualVisibility;
        calculated?: boolean;
        queryable?: ConceptualQueryableState;
        navigationProperties?: ArrayNamedItems<ConceptualNavigationProperty>;
    }
    interface ConceptualDisplayFolder extends ConceptualPropertyItem, ConceptualPropertyItemContainer {
    }
    interface ConceptualProperty extends ConceptualPropertyItem {
        type: ValueType;
        kind: ConceptualPropertyKind;
        format?: string;
        column?: ConceptualColumn;
        queryable?: ConceptualQueryableState;
        measure?: ConceptualMeasure;
        kpiValue?: ConceptualProperty;
    }
    interface ConceptualHierarchy extends ConceptualPropertyItem {
        levels: ArrayNamedItems<ConceptualHierarchyLevel>;
    }
    interface ConceptualHierarchyLevel extends ConceptualPropertyItem {
        column: ConceptualProperty;
    }
    interface ConceptualNavigationProperty {
        name: string;
        isActive: boolean;
        sourceColumn?: ConceptualColumn;
        targetEntity: ConceptualEntity;
        sourceMultiplicity: ConceptualMultiplicity;
        targetMultiplicity: ConceptualMultiplicity;
    }
    interface ConceptualVariationSource {
        name: string;
        isDefault: boolean;
        navigationProperty?: ConceptualNavigationProperty;
        defaultHierarchy?: ConceptualHierarchy;
        defaultProperty?: ConceptualProperty;
    }
    interface ConceptualColumn {
        defaultAggregate?: ConceptualDefaultAggregate;
        keys?: ArrayNamedItems<ConceptualProperty>;
        idOnEntityKey?: boolean;
        calculated?: boolean;
        defaultValue?: SQConstantExpr;
        variations?: ArrayNamedItems<ConceptualVariationSource>;
        aggregateBehavior?: ConceptualAggregateBehavior;
        groupingDefinition?: ConceptualGroupingDefinition;
    }
    interface ConceptualGroupingDefinition {
        binningDefinition?: ConceptualBinningDefinition;
    }
    interface ConceptualBinningDefinition {
        binSize?: ConceptualBinSize;
    }
    interface ConceptualBinSize {
        value: number;
        unit: ConceptualBinUnit;
    }
    interface ConceptualMeasure {
        kpi?: ConceptualPropertyKpi;
    }
    interface ConceptualPropertyKpi {
        statusMetadata: DataViewKpiColumnMetadata;
        trendMetadata?: DataViewKpiColumnMetadata;
        status?: ConceptualProperty;
        goal?: ConceptualProperty;
        trend?: ConceptualProperty;
    }
    const enum ConceptualVisibility {
        Visible = 0,
        Hidden = 1,
        ShowAsVariationsOnly = 2,
        IsPrivate = 4,
    }
    const enum ConceptualQueryableState {
        Queryable = 0,
        Error = 1,
    }
    const enum ConceptualBinUnit {
        Number = 0,
        Percent = 1,
        Log = 2,
        Percentile = 3,
        Year = 4,
        Quarter = 5,
        Month = 6,
        Week = 7,
        Day = 8,
    }
    const enum ConceptualMultiplicity {
        ZeroOrOne = 0,
        One = 1,
        Many = 2,
    }
    const enum ConceptualPropertyKind {
        Column = 0,
        Measure = 1,
        Kpi = 2,
    }
    const enum ConceptualDefaultAggregate {
        Default = 0,
        None = 1,
        Sum = 2,
        Count = 3,
        Min = 4,
        Max = 5,
        Average = 6,
        DistinctCount = 7,
    }
    enum ConceptualDataCategory {
        None = 0,
        Address = 1,
        City = 2,
        Company = 3,
        Continent = 4,
        Country = 5,
        County = 6,
        Date = 7,
        Image = 8,
        ImageUrl = 9,
        Latitude = 10,
        Longitude = 11,
        Organization = 12,
        Place = 13,
        PostalCode = 14,
        Product = 15,
        StateOrProvince = 16,
        WebUrl = 17,
    }
    const enum ConceptualAggregateBehavior {
        Default = 0,
        DiscourageAcrossGroups = 1,
    }
}

declare module powerbi {
    import ArrayNamedItems = jsCommon.ArrayNamedItems;
    import FederatedConceptualSchema = powerbi.data.FederatedConceptualSchema;
    import QueryProjectionsByRole = data.QueryProjectionsByRole;
    interface ScriptResult {
        source: string;
        provider: string;
    }
    module ScriptResultUtil {
        function findScriptResult(dataViewMappings: DataViewMapping[] | data.CompiledDataViewMapping[]): DataViewScriptResultMapping | data.CompiledDataViewScriptResultMapping;
        function extractScriptResult(dataViewMappings: data.CompiledDataViewMapping[]): ScriptResult;
        function extractScriptResultFromVisualConfig(dataViewMappings: DataViewMapping[], objects: powerbi.data.DataViewObjectDefinitions): ScriptResult;
        function getScriptInput(projections: QueryProjectionsByRole, selects: ArrayNamedItems<data.NamedSQExpr>, schema: FederatedConceptualSchema): data.ScriptInput;
    }
}

declare module powerbi.data.segmentation {
    interface DataViewTableSegment extends DataViewTable {
        /**
         * Index of the last item that had a merge flag in the underlying data.
         * We assume merge flags are not random but adjacent to each other.
         */
        lastMergeIndex?: number;
    }
    interface DataViewTreeSegmentNode extends DataViewTreeNode {
        /** Indicates whether the node is a duplicate of a node from a previous segment. */
        isMerge?: boolean;
    }
    interface DataViewCategoricalSegment extends DataViewCategorical {
        /**
         * Index of the last item that had a merge flag in the underlying data.
         * We assume merge flags are not random but adjacent to each other.
         */
        lastMergeIndex?: number;
    }
    interface DataViewMatrixSegmentNode extends DataViewMatrixNode {
        /**
         * Index of the last item that had a merge flag in the underlying data.
         * We assume merge flags are not random but adjacent to each other.
         */
        isMerge?: boolean;
    }
    module DataViewMerger {
        function mergeDataViews(source: DataView, segment: DataView): void;
        /** Note: Public for testability */
        function mergeTables(source: DataViewTable, segment: DataViewTableSegment): void;
        /**
         * Merge categories values and identities
         *
         * Note: Public for testability
         */
        function mergeCategorical(source: DataViewCategorical, segment: DataViewCategoricalSegment): void;
        /** Note: Public for testability */
        function mergeTreeNodes(sourceRoot: DataViewTreeNode, segmentRoot: DataViewTreeNode, allowDifferentStructure: boolean): void;
    }
}

declare module powerbi.data {
    /** Rewrites an expression tree, including all descendant nodes. */
    class SQExprRewriter implements ISQExprVisitor<SQExpr>, IFillRuleDefinitionVisitor<LinearGradient2Definition, LinearGradient3Definition> {
        visitColumnRef(expr: SQColumnRefExpr): SQExpr;
        visitMeasureRef(expr: SQMeasureRefExpr): SQExpr;
        visitAggr(expr: SQAggregationExpr): SQExpr;
        visitSelectRef(expr: SQSelectRefExpr): SQExpr;
        visitPercentile(expr: SQPercentileExpr): SQExpr;
        visitHierarchy(expr: SQHierarchyExpr): SQExpr;
        visitHierarchyLevel(expr: SQHierarchyLevelExpr): SQExpr;
        visitPropertyVariationSource(expr: SQPropertyVariationSourceExpr): SQExpr;
        visitEntity(expr: SQEntityExpr): SQExpr;
        visitAnd(orig: SQAndExpr): SQExpr;
        visitBetween(orig: SQBetweenExpr): SQExpr;
        visitIn(orig: SQInExpr): SQExpr;
        private rewriteAll(origExprs);
        visitOr(orig: SQOrExpr): SQExpr;
        visitCompare(orig: SQCompareExpr): SQExpr;
        visitContains(orig: SQContainsExpr): SQExpr;
        visitExists(orig: SQExistsExpr): SQExpr;
        visitNot(orig: SQNotExpr): SQExpr;
        visitStartsWith(orig: SQStartsWithExpr): SQExpr;
        visitConstant(expr: SQConstantExpr): SQExpr;
        visitDateSpan(orig: SQDateSpanExpr): SQExpr;
        visitDateAdd(orig: SQDateAddExpr): SQExpr;
        visitNow(orig: SQNowExpr): SQExpr;
        visitDefaultValue(orig: SQDefaultValueExpr): SQExpr;
        visitAnyValue(orig: SQAnyValueExpr): SQExpr;
        visitArithmetic(orig: SQArithmeticExpr): SQExpr;
        visitScopedEval(orig: SQScopedEvalExpr): SQExpr;
        visitWithRef(orig: SQWithRefExpr): SQExpr;
        visitTransformTableRef(orig: SQTransformTableRefExpr): SQExpr;
        visitTransformOutputRoleRef(orig: SQTransformOutputRoleRefExpr): SQExpr;
        visitFillRule(orig: SQFillRuleExpr): SQExpr;
        visitLinearGradient2(origGradient2: LinearGradient2Definition): LinearGradient2Definition;
        visitLinearGradient3(origGradient3: LinearGradient3Definition): LinearGradient3Definition;
        private visitFillRuleStop(stop);
        visitResourcePackageItem(orig: SQResourcePackageItemExpr): SQExpr;
    }
}

declare module powerbi.data {
    /** Responsible for writing equality comparisons against a field to an SQInExpr. */
    module EqualsToInRewriter {
        function run(expr: SQExpr): SQExpr;
    }
}

declare module powerbi.data {
    interface FilterValueScopeIdsContainer {
        isNot: boolean;
        scopeIds: DataViewScopeIdentity[];
    }
    module SQExprConverter {
        function asScopeIdsContainer(filter: SemanticFilter, fieldSQExprs: SQExpr[]): FilterValueScopeIdsContainer;
        /** Gets a comparand value from the given DataViewScopeIdentity. */
        function getFirstComparandValue(identity: DataViewScopeIdentity): any;
    }
}

declare module powerbi.data {
    /** Recognizes DataViewScopeIdentity expression trees to extract comparison keys. */
    module ScopeIdentityExtractor {
        function getKeys(expr: SQExpr): SQExpr[];
        function getValues(expr: SQExpr): SQExpr[];
        function getInExpr(expr: SQExpr): SQInExpr;
    }
}

declare module powerbi.data {
    module PrimitiveValueEncoding {
        function decimal(value: number): string;
        function double(value: number): string;
        function integer(value: number): string;
        function dateTime(value: Date): string;
        function text(value: string): string;
        function nullEncoding(): string;
        function boolean(value: boolean): string;
    }
}

declare module powerbi.data {
    interface ISQAggregationOperations {
        /** Returns an array of supported aggregates for a given expr and role type. */
        getSupportedAggregates(expr: SQExpr, schema: FederatedConceptualSchema, targetTypes: ValueTypeDescriptor[]): QueryAggregateFunction[];
        isSupportedAggregate(expr: SQExpr, schema: FederatedConceptualSchema, aggregate: QueryAggregateFunction, targetTypes: ValueTypeDescriptor[], forConsumption?: boolean): boolean;
        createExprWithAggregate(expr: SQExpr, schema: FederatedConceptualSchema, aggregateNonNumericFields: boolean, targetTypes: ValueTypeDescriptor[], preferredAggregate?: QueryAggregateFunction): SQExpr;
    }
    function createSQAggregationOperations(datetimeMinMaxSupported: boolean): ISQAggregationOperations;
}

declare module powerbi.data {
    module SQHierarchyExprUtils {
        function getConceptualHierarchyLevelFromExpr(conceptualSchema: FederatedConceptualSchema, fieldExpr: FieldExprPattern): ConceptualHierarchyLevel;
        function getConceptualHierarchyLevel(conceptualSchema: FederatedConceptualSchema, schemaName: string, entity: string, hierarchy: string, hierarchyLevel: string): ConceptualHierarchyLevel;
        function getConceptualHierarchy(sqExpr: SQExpr, federatedSchema: FederatedConceptualSchema): ConceptualHierarchy;
        function expandExpr(schema: FederatedConceptualSchema, expr: SQExpr, suppressHierarchyLevelExpansion?: boolean): SQExpr | SQExpr[];
        function isHierarchyOrVariation(schema: FederatedConceptualSchema, expr: SQExpr): boolean;
        function getSourceVariationExpr(hierarchyLevelExpr: data.SQHierarchyLevelExpr): SQColumnRefExpr;
        function getSourceHierarchy(hierarchyLevelExpr: data.SQHierarchyLevelExpr): SQHierarchyExpr;
        function getHierarchySourceAsVariationSource(hierarchyLevelExpr: SQHierarchyLevelExpr): SQPropertyVariationSourceExpr;
        /**
        * Returns true if firstExpr and secondExpr are levels in the same hierarchy and firstExpr is before secondExpr in allLevels.
        */
        function areHierarchyLevelsOrdered(allLevels: SQHierarchyLevelExpr[], firstExpr: SQExpr, secondExpr: SQExpr): boolean;
        /**
         * Given an ordered set of levels and an ordered subset of those levels, returns the index where
         * expr should be inserted into the subset to maintain the correct order.
         */
        function getInsertionIndex(allLevels: SQHierarchyLevelExpr[], orderedSubsetOfLevels: SQHierarchyLevelExpr[], expr: SQHierarchyLevelExpr): number;
    }
    module SQExprHierarchyToHierarchyLevelConverter {
        function convert(sqExpr: SQExpr, federatedSchema: FederatedConceptualSchema): SQExpr[];
    }
}

declare module powerbi.data {
    interface SQExprGroup {
        expr: SQExpr;
        children: SQHierarchyLevelExpr[];
        /** Index of expression in the query. */
        selectQueryIndex: number;
    }
    module SQExprGroupUtils {
        /** Group all projections. Eacch group can consist of either a single property, or a collection of hierarchy items. */
        function groupExprs(schema: FederatedConceptualSchema, exprs: SQExpr[]): SQExprGroup[];
    }
}

declare module powerbi.data {
    /** Represents an immutable expression within a SemanticQuery. */
    abstract class SQExpr implements ISQExpr {
        private _kind;
        constructor(kind: SQExprKind);
        static equals(x: SQExpr, y: SQExpr, ignoreCase?: boolean): boolean;
        validate(schema: FederatedConceptualSchema, aggrUtils: ISQAggregationOperations, errors?: SQExprValidationError[]): SQExprValidationError[];
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
        kind: SQExprKind;
        static isArithmetic(expr: SQExpr): expr is SQArithmeticExpr;
        static isColumn(expr: SQExpr): expr is SQColumnRefExpr;
        static isConstant(expr: SQExpr): expr is SQConstantExpr;
        static isEntity(expr: SQExpr): expr is SQEntityExpr;
        static isHierarchy(expr: SQExpr): expr is SQHierarchyExpr;
        static isHierarchyLevel(expr: SQExpr): expr is SQHierarchyLevelExpr;
        static isAggregation(expr: SQExpr): expr is SQAggregationExpr;
        static isMeasure(expr: SQExpr): expr is SQMeasureRefExpr;
        static isPercentile(expr: SQExpr): expr is SQPercentileExpr;
        static isSelectRef(expr: SQExpr): expr is SQSelectRefExpr;
        static isScopedEval(expr: SQExpr): expr is SQScopedEvalExpr;
        static isWithRef(expr: SQExpr): expr is SQWithRefExpr;
        static isTransformTableRef(expr: SQExpr): expr is SQTransformTableRefExpr;
        static isTransformOutputRoleRef(expr: SQExpr): expr is SQTransformOutputRoleRefExpr;
        static isResourcePackageItem(expr: SQExpr): expr is SQResourcePackageItemExpr;
        getMetadata(federatedSchema: FederatedConceptualSchema): SQExprMetadata;
        getDefaultAggregate(federatedSchema: FederatedConceptualSchema, forceAggregation?: boolean): QueryAggregateFunction;
        /** Return the SQExpr[] of group on columns if it has group on keys otherwise return the SQExpr of the column.*/
        getKeyColumns(schema: FederatedConceptualSchema): SQExpr[];
        /** Returns a value indicating whether the expression would group on keys other than itself.*/
        hasGroupOnKeys(schema: FederatedConceptualSchema): boolean;
        private getPropertyKeys(schema);
        getConceptualProperty(federatedSchema: FederatedConceptualSchema): ConceptualProperty;
        getTargetEntityForVariation(federatedSchema: FederatedConceptualSchema, variationName: string): string;
        getTargetEntity(federatedSchema: FederatedConceptualSchema): SQEntityExpr;
        private getHierarchyLevelConceptualProperty(federatedSchema);
        private getMetadataForVariation(field, federatedSchema);
        private getMetadataForHierarchyLevel(field, federatedSchema);
        private getMetadataForPercentOfGrandTotal();
        private getPropertyMetadata(field, property);
        private getMetadataForProperty(field, federatedSchema);
        private static getMetadataForEntity(field, federatedSchema);
    }
    const enum SQExprKind {
        Entity = 0,
        ColumnRef = 1,
        MeasureRef = 2,
        Aggregation = 3,
        PropertyVariationSource = 4,
        Hierarchy = 5,
        HierarchyLevel = 6,
        And = 7,
        Between = 8,
        In = 9,
        Or = 10,
        Contains = 11,
        Compare = 12,
        StartsWith = 13,
        Exists = 14,
        Not = 15,
        Constant = 16,
        DateSpan = 17,
        DateAdd = 18,
        Now = 19,
        AnyValue = 20,
        DefaultValue = 21,
        Arithmetic = 22,
        FillRule = 23,
        ResourcePackageItem = 24,
        ScopedEval = 25,
        WithRef = 26,
        Percentile = 27,
        SelectRef = 28,
        TransformTableRef = 29,
        TransformOutputRoleRef = 30,
    }
    interface SQExprMetadata {
        kind: FieldKind;
        type: ValueType;
        format?: string;
        idOnEntityKey?: boolean;
        aggregate?: QueryAggregateFunction;
        defaultAggregate?: ConceptualDefaultAggregate;
    }
    const enum FieldKind {
        /** Indicates the field references a column, which evaluates to a distinct set of values (e.g., Year, Name, SalesQuantity, etc.). */
        Column = 0,
        /** Indicates the field references a measure, which evaluates to a single value (e.g., SalesYTD, Sum(Sales), etc.). */
        Measure = 1,
    }
    /** Note: Exported for testability */
    function defaultAggregateForDataType(type: ValueType): QueryAggregateFunction;
    /** Note: Exported for testability */
    function defaultAggregateToQueryAggregateFunction(aggregate: ConceptualDefaultAggregate): QueryAggregateFunction;
    class SQEntityExpr extends SQExpr {
        schema: string;
        entity: string;
        variable: string;
        constructor(schema: string, entity: string, variable?: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQArithmeticExpr extends SQExpr {
        left: SQExpr;
        right: SQExpr;
        operator: ArithmeticOperatorKind;
        constructor(left: SQExpr, right: SQExpr, operator: ArithmeticOperatorKind);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQScopedEvalExpr extends SQExpr {
        expression: SQExpr;
        scope: SQExpr[];
        constructor(expression: SQExpr, scope: SQExpr[]);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
        getMetadata(federatedSchema: FederatedConceptualSchema): SQExprMetadata;
    }
    class SQWithRefExpr extends SQExpr {
        expressionName: string;
        constructor(expressionName: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    abstract class SQPropRefExpr extends SQExpr {
        ref: string;
        source: SQExpr;
        constructor(kind: SQExprKind, source: SQExpr, ref: string);
    }
    class SQColumnRefExpr extends SQPropRefExpr {
        constructor(source: SQExpr, ref: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQMeasureRefExpr extends SQPropRefExpr {
        constructor(source: SQExpr, ref: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQAggregationExpr extends SQExpr {
        arg: SQExpr;
        func: QueryAggregateFunction;
        constructor(arg: SQExpr, func: QueryAggregateFunction);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQPercentileExpr extends SQExpr {
        arg: SQExpr;
        k: number;
        exclusive: boolean;
        constructor(arg: SQExpr, k: number, exclusive: boolean);
        getMetadata(federatedSchema: FederatedConceptualSchema): SQExprMetadata;
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQPropertyVariationSourceExpr extends SQExpr {
        arg: SQExpr;
        name: string;
        property: string;
        constructor(arg: SQExpr, name: string, property: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQHierarchyExpr extends SQExpr {
        arg: SQExpr;
        hierarchy: string;
        constructor(arg: SQExpr, hierarchy: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQHierarchyLevelExpr extends SQExpr {
        arg: SQExpr;
        level: string;
        constructor(arg: SQExpr, level: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQSelectRefExpr extends SQExpr {
        expressionName: string;
        constructor(expressionName: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQAndExpr extends SQExpr {
        left: SQExpr;
        right: SQExpr;
        constructor(left: SQExpr, right: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQBetweenExpr extends SQExpr {
        arg: SQExpr;
        lower: SQExpr;
        upper: SQExpr;
        constructor(arg: SQExpr, lower: SQExpr, upper: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQInExpr extends SQExpr {
        args: SQExpr[];
        values: SQExpr[][];
        constructor(args: SQExpr[], values: SQExpr[][]);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQOrExpr extends SQExpr {
        left: SQExpr;
        right: SQExpr;
        constructor(left: SQExpr, right: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQCompareExpr extends SQExpr {
        comparison: QueryComparisonKind;
        left: SQExpr;
        right: SQExpr;
        constructor(comparison: QueryComparisonKind, left: SQExpr, right: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQContainsExpr extends SQExpr {
        left: SQExpr;
        right: SQExpr;
        constructor(left: SQExpr, right: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQStartsWithExpr extends SQExpr {
        left: SQExpr;
        right: SQExpr;
        constructor(left: SQExpr, right: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQExistsExpr extends SQExpr {
        arg: SQExpr;
        constructor(arg: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQNotExpr extends SQExpr {
        arg: SQExpr;
        constructor(arg: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQConstantExpr extends SQExpr implements ISQConstantExpr {
        type: ValueType;
        /** The native JavaScript representation of the value. */
        value: any;
        /** The string encoded, lossless representation of the value. */
        valueEncoded: string;
        constructor(type: ValueType, value: any, valueEncoded: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
        getMetadata(federatedSchema: FederatedConceptualSchema): SQExprMetadata;
    }
    class SQDateSpanExpr extends SQExpr {
        unit: TimeUnit;
        arg: SQExpr;
        constructor(unit: TimeUnit, arg: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQDateAddExpr extends SQExpr {
        unit: TimeUnit;
        amount: number;
        arg: SQExpr;
        constructor(unit: TimeUnit, amount: number, arg: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQNowExpr extends SQExpr {
        constructor();
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQDefaultValueExpr extends SQExpr {
        constructor();
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQAnyValueExpr extends SQExpr {
        constructor();
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQFillRuleExpr extends SQExpr {
        input: SQExpr;
        rule: FillRuleDefinition;
        constructor(input: SQExpr, fillRule: FillRuleDefinition);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQResourcePackageItemExpr extends SQExpr {
        packageName: string;
        packageType: number;
        itemName: string;
        constructor(packageName: string, packageType: number, itemName: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQTransformTableRefExpr extends SQExpr {
        source: string;
        constructor(source: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQTransformOutputRoleRefExpr extends SQExpr {
        role: string;
        transform: string;
        constructor(role: string, transform?: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    /** Provides utilities for creating & manipulating expressions. */
    module SQExprBuilder {
        function entity(schema: string, entity: string, variable?: string): SQEntityExpr;
        function columnRef(source: SQExpr, prop: string): SQColumnRefExpr;
        function measureRef(source: SQExpr, prop: string): SQMeasureRefExpr;
        function aggregate(source: SQExpr, aggregate: QueryAggregateFunction): SQAggregationExpr;
        function selectRef(expressionName: string): SQSelectRefExpr;
        function percentile(source: SQExpr, k: number, exclusive: boolean): SQPercentileExpr;
        function arithmetic(left: SQExpr, right: SQExpr, operator: ArithmeticOperatorKind): SQArithmeticExpr;
        function scopedEval(expression: SQExpr, scope: SQExpr[]): SQScopedEvalExpr;
        function withRef(expressionName: string): SQWithRefExpr;
        function hierarchy(source: SQExpr, hierarchy: string): SQHierarchyExpr;
        function propertyVariationSource(source: SQExpr, name: string, property: string): SQPropertyVariationSourceExpr;
        function hierarchyLevel(source: SQExpr, level: string): SQHierarchyLevelExpr;
        function transformTableRef(source: string): SQTransformTableRefExpr;
        function transformOutputRoleRef(role: string, transform?: string): SQTransformOutputRoleRefExpr;
        function and(left: SQExpr, right: SQExpr): SQExpr;
        function between(arg: SQExpr, lower: SQExpr, upper: SQExpr): SQBetweenExpr;
        function inExpr(args: SQExpr[], values: SQExpr[][]): SQInExpr;
        function or(left: SQExpr, right: SQExpr): SQExpr;
        function compare(kind: QueryComparisonKind, left: SQExpr, right: SQExpr): SQCompareExpr;
        function contains(left: SQExpr, right: SQExpr): SQContainsExpr;
        function exists(arg: SQExpr): SQExistsExpr;
        function equal(left: SQExpr, right: SQExpr): SQCompareExpr;
        function not(arg: SQExpr): SQNotExpr;
        function startsWith(left: SQExpr, right: SQExpr): SQStartsWithExpr;
        function nullConstant(): SQConstantExpr;
        function now(): SQNowExpr;
        function defaultValue(): SQDefaultValueExpr;
        function anyValue(): SQAnyValueExpr;
        function boolean(value: boolean): SQConstantExpr;
        function dateAdd(unit: TimeUnit, amount: number, arg: SQExpr): SQDateAddExpr;
        function dateTime(value: Date, valueEncoded?: string): SQConstantExpr;
        function dateSpan(unit: TimeUnit, arg: SQExpr): SQDateSpanExpr;
        function decimal(value: number, valueEncoded?: string): SQConstantExpr;
        function double(value: number, valueEncoded?: string): SQConstantExpr;
        function integer(value: number, valueEncoded?: string): SQConstantExpr;
        function text(value: string, valueEncoded?: string): SQConstantExpr;
        /** Returns an SQExpr that evaluates to the constant value. */
        function typedConstant(value: PrimitiveValue, type: ValueTypeDescriptor): SQConstantExpr;
        function setAggregate(expr: SQExpr, aggregate: QueryAggregateFunction): SQExpr;
        function removeAggregate(expr: SQExpr): SQExpr;
        function setPercentOfGrandTotal(expr: SQExpr): SQExpr;
        function removePercentOfGrandTotal(expr: SQExpr): SQExpr;
        function removeEntityVariables(expr: SQExpr): SQExpr;
        function fillRule(expr: SQExpr, rule: FillRuleDefinition): SQFillRuleExpr;
        function resourcePackageItem(packageName: string, packageType: number, itemName: string): SQResourcePackageItemExpr;
    }
    /** Provides utilities for obtaining information about expressions. */
    module SQExprInfo {
        function getAggregate(expr: SQExpr): QueryAggregateFunction;
    }
    const enum SQExprValidationError {
        invalidAggregateFunction = 0,
        invalidSchemaReference = 1,
        invalidEntityReference = 2,
        invalidColumnReference = 3,
        invalidMeasureReference = 4,
        invalidHierarchyReference = 5,
        invalidHierarchyLevelReference = 6,
        invalidLeftOperandType = 7,
        invalidRightOperandType = 8,
        invalidValueType = 9,
        invalidPercentileArgument = 10,
        invalidScopeArgument = 11,
    }
    class SQExprValidationVisitor extends SQExprRewriter {
        errors: SQExprValidationError[];
        private schema;
        private aggrUtils;
        constructor(schema: FederatedConceptualSchema, aggrUtils: ISQAggregationOperations, errors?: SQExprValidationError[]);
        visitIn(expr: SQInExpr): SQExpr;
        visitCompare(expr: SQCompareExpr): SQExpr;
        visitColumnRef(expr: SQColumnRefExpr): SQExpr;
        visitMeasureRef(expr: SQMeasureRefExpr): SQExpr;
        visitAggr(expr: SQAggregationExpr): SQExpr;
        visitHierarchy(expr: SQHierarchyExpr): SQExpr;
        visitHierarchyLevel(expr: SQHierarchyLevelExpr): SQExpr;
        visitPercentile(expr: SQPercentileExpr): SQExpr;
        visitEntity(expr: SQEntityExpr): SQExpr;
        visitContains(expr: SQContainsExpr): SQExpr;
        visitStartsWith(expr: SQContainsExpr): SQExpr;
        visitArithmetic(expr: SQArithmeticExpr): SQExpr;
        visitScopedEval(expr: SQScopedEvalExpr): SQExpr;
        visitWithRef(expr: SQWithRefExpr): SQExpr;
        visitTransformTableRef(expr: SQTransformTableRefExpr): SQExpr;
        visitTransformOutputRoleRef(expr: SQTransformOutputRoleRefExpr): SQExpr;
        private validateOperandsAndTypeForStartOrContains(left, right);
        private validateArithmeticTypes(left, right);
        private validateCompatibleType(left, right);
        private validateEntity(schemaName, entityName);
        private validateHierarchy(schemaName, entityName, hierarchyName);
        private validateHierarchyLevel(schemaName, entityName, hierarchyName, levelName);
        private register(error);
        private isQueryable(fieldExpr);
    }
}

declare module powerbi.data {
    import ConceptualEntity = powerbi.data.ConceptualEntity;
    import SQEntityExpr = powerbi.data.SQEntityExpr;
    module SQExprUtils {
        function supportsArithmetic(expr: SQExpr, schema: FederatedConceptualSchema): boolean;
        function indexOfExpr(items: SQExpr[], searchElement: SQExpr): number;
        function indexOfNamedExpr(items: NamedSQExpr[], searchElement: SQExpr): number;
        function sequenceEqual(x: SQExpr[], y: SQExpr[]): boolean;
        function uniqueName(namedItems: NamedSQExpr[], expr: SQExpr, exprDefaultName?: string): string;
        /** Generates a default expression name  */
        function defaultName(expr: SQExpr, fallback?: string): string;
        /** Gets a value indicating whether the expr is a model measure or an aggregate. */
        function isMeasure(expr: SQExpr): boolean;
        /** Gets a value indicating whether the expr is an AnyValue or equals comparison to AnyValue*/
        function isAnyValue(expr: SQExpr): boolean;
        /** Gets a value indicating whether the expr is a DefaultValue or equals comparison to DefaultValue*/
        function isDefaultValue(expr: SQExpr): boolean;
        function discourageAggregation(expr: SQExpr, schema: FederatedConceptualSchema): boolean;
        function getAggregateBehavior(expr: SQExpr, schema: FederatedConceptualSchema): ConceptualAggregateBehavior;
        function getSchemaCapabilities(expr: SQExpr, schema: FederatedConceptualSchema): ConceptualCapabilities;
        function getKpiMetadata(expr: SQExpr, schema: FederatedConceptualSchema): DataViewKpiColumnMetadata;
        function getConceptualEntity(entityExpr: SQEntityExpr, schema: FederatedConceptualSchema): ConceptualEntity;
        function getDefaultValue(fieldSQExpr: SQExpr, schema: FederatedConceptualSchema): SQConstantExpr;
        function getDefaultValues(fieldSQExprs: SQExpr[], schema: FederatedConceptualSchema): SQConstantExpr[];
        /** Return compare or and expression for key value pairs. */
        function getDataViewScopeIdentityComparisonExpr(fieldsExpr: SQExpr[], values: SQConstantExpr[]): SQExpr;
        function getActiveTablesNames(queryDefn: data.SemanticQuery): string[];
        function isRelatedToMany(schema: FederatedConceptualSchema, sourceExpr: SQEntityExpr, targetExpr: SQEntityExpr): boolean;
        function isRelatedToOne(schema: FederatedConceptualSchema, sourceExpr: SQEntityExpr, targetExpr: SQEntityExpr): boolean;
        function isRelatedOneToOne(schema: FederatedConceptualSchema, sourceExpr: SQEntityExpr, targetExpr: SQEntityExpr): boolean;
        /** Performs a union of the 2 arrays with SQExpr.equals as comparator to skip duplicate items,
            and returns a new array. When available, we should use _.unionWith from lodash. */
        function concatUnique(leftExprs: SQExpr[], rightExprs: SQExpr[]): SQExpr[];
    }
}

declare module powerbi.data {
    class SemanticQueryRewriter {
        private exprRewriter;
        constructor(exprRewriter: ISQExprVisitor<SQExpr>);
        rewriteFrom(fromValue: SQFrom): SQFrom;
        rewriteSelect(selectItems: NamedSQExpr[], from: SQFrom): NamedSQExpr[];
        rewriteGroupBy(groupByitems: NamedSQExpr[], from: SQFrom): NamedSQExpr[];
        private rewriteNamedSQExpressions(expressions, from);
        rewriteOrderBy(orderByItems: SQSortDefinition[], from: SQFrom): SQSortDefinition[];
        rewriteWhere(whereItems: SQFilter[], from: SQFrom): SQFilter[];
        rewriteTransform(transformItems: SQTransform[], from: SQFrom): SQTransform[];
    }
}

declare module powerbi.data {
    type SQFromSource = SQFromEntitySource | SQFromSubquerySource;
    /** Represents an entity reference in SemanticQuery from. */
    class SQFromEntitySource {
        schema: string;
        entity: string;
        constructor(schema: string, entity: string);
        accept<T, TArg>(visitor: ISQFromSourceVisitor<T, TArg>, arg: TArg): T;
        equals(source: SQFromEntitySource): boolean;
    }
    /** Represents a subquery reference in SemanticQuery from.
        for subquery use SQExpr instead of SemanticQuery when we have one for QuerySubqueryExpression
     */
    class SQFromSubquerySource {
        subquery: SemanticQuery;
        constructor(subquery: SemanticQuery);
        accept<T, TArg>(visitor: ISQFromSourceVisitor<T, TArg>, arg: TArg): T;
        equals(source: SQFromSubquerySource): boolean;
    }
    /** Represents a SemanticQuery/SemanticFilter from clause. */
    class SQFrom {
        private items;
        constructor(items?: {
            [name: string]: SQFromSource;
        });
        keys(): string[];
        source(key: string): SQFromSource;
        sources(): {
            [name: string]: SQFromSource;
        };
        ensureSource(source: SQFromSource, desiredVariableName?: string): QueryFromEnsureEntityResult;
        remove(key: string): void;
        private getSourceKeyFromItems(source);
        private addSource(source, desiredVariableName);
        clone(): SQFrom;
        equals(comparand: SQFrom): boolean;
    }
    function equals(left: SQFromSource, right: SQFromSource): boolean;
    function isSQFromEntitySource(source: SQFromSource): source is SQFromEntitySource;
    function isSQFromSubquerySource(source: SQFromSource): source is SQFromSubquerySource;
    interface ISQFromSourceVisitor<T, Targ> {
        visitEntity(source: SQFromEntitySource, arg: Targ): T;
        visitSubquery(source: SQFromSubquerySource, arg: Targ): T;
    }
    class SQFromSourceCandidateNameVisitor implements ISQFromSourceVisitor<string, void> {
        /** Converts the entity name into a short reference name.  Follows the Semantic Query convention of a short name. */
        visitEntity(source: SQFromEntitySource): string;
        visitSubquery(source: SQFromSubquerySource): string;
    }
    class SQFromEntitiesVisitor implements ISQFromSourceVisitor<void, string> {
        entities: SQEntityExpr[];
        constructor();
        visitEntity(source: SQFromEntitySource, key: string): void;
        visitSubquery(source: SQFromSubquerySource, key: string): void;
    }
}

declare module powerbi.data {
    import ArrayNamedItems = jsCommon.ArrayNamedItems;
    interface NamedSQExpr {
        name: string;
        expr: SQExpr;
    }
    interface SQFilter {
        target?: SQExpr[];
        condition: SQExpr;
    }
    /** Represents a sort over an expression. */
    interface SQSortDefinition {
        expr: SQExpr;
        direction: SortDirection;
    }
    interface QueryFromEnsureEntityResult {
        name: string;
        new?: boolean;
    }
    interface SQSourceRenames {
        [from: string]: string;
    }
    interface SQTransform {
        name: string;
        algorithm: string;
        input: SQTransformInput;
        output: SQTransformOutput;
    }
    interface SQTransformInput {
        parameters: NamedSQExpr[];
        table?: SQTransformTable;
    }
    interface SQTransformOutput {
        table?: SQTransformTable;
    }
    interface SQTransformTable {
        name: string;
        columns: SQTransformTableColumn[];
    }
    interface SQTransformTableColumn {
        role?: string;
        expression: NamedSQExpr;
    }
    /**
     * Represents a semantic query that is:
     * 1) Round-trippable with a JSON QueryDefinition.
     * 2) Immutable
     * 3) Long-lived and does not have strong references to a conceptual model (only names).
     */
    class SemanticQuery {
        private static empty;
        private fromValue;
        private whereItems;
        private orderByItems;
        private selectItems;
        private groupByItems;
        private transformItems;
        constructor(from: SQFrom, where: SQFilter[], orderBy: SQSortDefinition[], select: NamedSQExpr[], groupBy: NamedSQExpr[], transformItems: SQTransform[]);
        static create(): SemanticQuery;
        private static createWithTrimmedFrom(from, where, transform, orderBy, select, groupBy);
        from(): SQFrom;
        /** Returns a query equivalent to this, with the specified selected items. */
        select(values: NamedSQExpr[]): SemanticQuery;
        /** Gets the items being selected in this query. */
        select(): ArrayNamedItems<NamedSQExpr>;
        private getSelect();
        private static createNamedExpressionArray(items);
        private setSelect(values);
        private static rewriteExpressionsWithSourceRenames(values, from);
        /** Removes the given expression from the select. */
        removeSelect(expr: SQExpr): SemanticQuery;
        /** Removes the given expression from order by. */
        removeOrderBy(expr: SQExpr): SemanticQuery;
        /** Removes the given expression from transforms. */
        removeTransform(transform: SQTransform): SemanticQuery;
        selectNameOf(expr: SQExpr): string;
        setSelectAt(index: number, expr: SQExpr): SemanticQuery;
        /** Adds a the expression to the select clause. */
        addSelect(expr: SQExpr, exprName?: string): SemanticQuery;
        private createNamedExpr(currentNames, from, expr, exprName?);
        /** Returns a query equivalent to this, with the specified groupBy items. */
        groupBy(values: NamedSQExpr[]): SemanticQuery;
        /** Gets the groupby items in this query. */
        groupBy(): ArrayNamedItems<NamedSQExpr>;
        private getGroupBy();
        private setGroupBy(values);
        addGroupBy(expr: SQExpr): SemanticQuery;
        /** Gets or sets the sorting for this query. */
        orderBy(values: SQSortDefinition[]): SemanticQuery;
        orderBy(): SQSortDefinition[];
        private getOrderBy();
        private setOrderBy(values);
        /** Gets or sets the filters for this query. */
        where(values: SQFilter[]): SemanticQuery;
        where(): SQFilter[];
        private getWhere();
        private setWhere(values);
        addWhere(filter: SemanticFilter): SemanticQuery;
        /** Returns a query equivalent to this, with the specified transform items. */
        transforms(transforms: SQTransform[]): SemanticQuery;
        transforms(): SQTransform[];
        private getTransforms();
        private setTransforms(transforms);
        rewrite(exprRewriter: ISQExprVisitor<SQExpr>): SemanticQuery;
        static equals(x: SemanticQuery, y: SemanticQuery): boolean;
    }
    /** Represents a semantic filter condition.  Round-trippable with a JSON FilterDefinition.  Instances of this class are immutable. */
    class SemanticFilter implements ISemanticFilter {
        private fromValue;
        private whereItems;
        constructor(from: SQFrom, where: SQFilter[]);
        static fromSQExpr(contract: SQExpr): SemanticFilter;
        static getDefaultValueFilter(fieldSQExprs: SQExpr | SQExpr[]): SemanticFilter;
        static getAnyValueFilter(fieldSQExprs: SQExpr | SQExpr[]): SemanticFilter;
        private static getDataViewScopeIdentityComparisonFilters(fieldSQExprs, value);
        from(): SQFrom;
        conditions(): SQExpr[];
        where(): SQFilter[];
        rewrite(exprRewriter: ISQExprVisitor<SQExpr>): SemanticFilter;
        validate(schema: FederatedConceptualSchema, aggrUtils: ISQAggregationOperations, errors?: SQExprValidationError[]): SQExprValidationError[];
        /** Merges a list of SemanticFilters into one. */
        static merge(filters: SemanticFilter[]): SemanticFilter;
        static isDefaultFilter(filter: SemanticFilter): boolean;
        static isAnyFilter(filter: SemanticFilter): boolean;
        static isSameFilter(leftFilter: SemanticFilter, rightFilter: SemanticFilter): boolean;
        private static applyFilter(filter, from, where);
    }
    class SQExprRewriterWithSourceRenames extends SQExprRewriter {
        private renames;
        constructor(renames: SQSourceRenames);
        visitEntity(expr: SQEntityExpr): SQExpr;
        rewriteFilter(filter: SQFilter): SQFilter;
        rewriteArray(exprs: SQExpr[]): SQExpr[];
        static rewrite(expr: SQExpr, from: SQFrom): SQExpr;
    }
}

declare module powerbi.data {
    module SQFilter {
        /**
         * Returns true if leftFilter and rightFilter have the same target and condition.
         */
        function equals(leftFilter: SQFilter, rightFilter: SQFilter): boolean;
        /**
         * Returns true if leftFilter and rightFilter have the same target.
         */
        function targetsEqual(leftFilter: SQFilter, rightFilter: SQFilter): boolean;
        function contains(filters: SQFilter[], searchTarget: SQFilter): boolean;
    }
}

declare module powerbi.data {
    module SQUtils {
        function sqSortDefinitionEquals(left: SQSortDefinition, right: SQSortDefinition): boolean;
        function namedSQExprEquals(left: NamedSQExpr, right: NamedSQExpr): boolean;
        function sqTransformTableColumnsEquals(left: SQTransformTableColumn, right: SQTransformTableColumn): boolean;
        function sqTransformTableEquals(left: SQTransformTable, right: SQTransformTable): boolean;
        function sqTransformInputEquals(left: SQTransformInput, right: SQTransformInput): boolean;
        function sqTransformOutputEquals(left: SQTransformOutput, right: SQTransformOutput): boolean;
        function sqTransformEquals(left: SQTransform, right: SQTransform): boolean;
    }
}

declare module powerbi.data {
    /** Utility for creating a DataView from columns of data. */
    interface IDataViewBuilderCategorical {
        withCategory(options: DataViewBuilderCategoryColumnOptions): IDataViewBuilderCategorical;
        withCategories(categories: DataViewCategoryColumn[]): IDataViewBuilderCategorical;
        withValues(options: DataViewBuilderValuesOptions): IDataViewBuilderCategorical;
        withGroupedValues(options: DataViewBuilderGroupedValuesOptions): IDataViewBuilderCategorical;
        build(): DataView;
    }
    interface DataViewBuilderColumnOptions {
        source: DataViewMetadataColumn;
    }
    interface DataViewBuilderCategoryColumnOptions extends DataViewBuilderColumnOptions {
        values: PrimitiveValue[];
        identityFrom: DataViewBuilderColumnIdentitySource;
    }
    interface DataViewBuilderValuesOptions {
        columns: DataViewBuilderValuesColumnOptions[];
    }
    interface DataViewBuilderGroupedValuesOptions {
        groupColumn: DataViewBuilderCategoryColumnOptions;
        valueColumns: DataViewBuilderColumnOptions[];
        data: DataViewBuilderSeriesData[][];
    }
    /** Indicates the source set of identities. */
    interface DataViewBuilderColumnIdentitySource {
        fields: SQExpr[];
        identities?: DataViewScopeIdentity[];
    }
    interface DataViewBuilderValuesColumnOptions extends DataViewBuilderColumnOptions, DataViewBuilderSeriesData {
    }
    interface DataViewBuilderSeriesData {
        values: PrimitiveValue[];
        highlights?: PrimitiveValue[];
        /** Client-computed maximum value for a column. */
        maxLocal?: any;
        /** Client-computed maximum value for a column. */
        minLocal?: any;
    }
    function createCategoricalDataViewBuilder(): IDataViewBuilderCategorical;
}

declare module powerbi.data {
    import SQExpr = powerbi.data.SQExpr;
    function createStaticEvalContext(colorAllocatorCache?: IColorAllocatorCache): IEvalContext;
    function createStaticEvalContext(colorAllocatorCache: IColorAllocatorCache, dataView: DataView, selectTransforms: DataViewSelectTransform[]): IEvalContext;
    function getExprValueFromTable(expr: SQExpr, selectTransforms: DataViewSelectTransform[], table: DataViewTable, rowIdx: number): PrimitiveValue;
    function findSelectIndex(expr: SQExpr, selectTransforms: DataViewSelectTransform[]): number;
}

declare module powerbi.data {
    function createMatrixEvalContext(colorAllocatorProvider: IColorAllocatorCache, dataViewMatrix: DataViewMatrix): IEvalContext;
}

declare module powerbi {
    /** Culture interfaces. These match the Globalize library interfaces intentionally. */
    interface Culture {
        name: string;
        calendar: Calendar;
        calendars: CalendarDictionary;
        numberFormat: NumberFormatInfo;
    }
    interface Calendar {
        patterns: any;
        firstDay: number;
    }
    interface CalendarDictionary {
        [key: string]: Calendar;
    }
    interface NumberFormatInfo {
        decimals: number;
        groupSizes: number[];
        negativeInfinity: string;
        positiveInfinity: string;
    }
    /**
     * NumberFormat module contains the static methods for formatting the numbers.
     * It extends the JQuery.Globalize functionality to support complete set of .NET
     * formatting expressions for numeric types including custom formats.
     */
    module NumberFormat {
        const NumberFormatComponentsDelimeter: string;
        interface NumericFormatMetadata {
            format: string;
            hasLiterals: boolean;
            hasE: boolean;
            hasCommas: boolean;
            hasDots: boolean;
            hasPercent: boolean;
            hasPermile: boolean;
            precision: number;
            scale: number;
        }
        interface NumberFormatComponents {
            hasNegative: boolean;
            positive: string;
            negative: string;
            zero: string;
        }
        function getNumericFormat(value: number, baseFormat: string): string;
        function addDecimalsToFormat(baseFormat: string, decimals: number, trailingZeros: boolean): string;
        function hasFormatComponents(format: string): boolean;
        function getComponents(format: string): NumberFormatComponents;
        /** Evaluates if the value can be formatted using the NumberFormat */
        function canFormat(value: any): boolean;
        function isStandardFormat(format: string): boolean;
        /** Formats the number using specified format expression and culture */
        function format(value: number, format: string, culture: Culture): string;
        /** Performs a custom format with a value override.  Typically used for custom formats showing scaled values. */
        function formatWithCustomOverride(value: number, format: string, nonScientificOverrideFormat: string, culture: Culture): string;
        /**
         * Returns the formatMetadata of the format
         * When calculating precision and scale, if format string of
         * positive[;negative;zero] => positive format will be used
         * @param (required) format - format string
         * @param (optional) calculatePrecision - calculate precision of positive format
         * @param (optional) calculateScale - calculate scale of positive format
         */
        function getCustomFormatMetadata(format: string, calculatePrecision?: boolean, calculateScale?: boolean): NumericFormatMetadata;
    }
    var formattingService: IFormattingService;
}

declare module powerbi.data {
    /** Serializes SQExpr in a form optimized in-memory comparison, but not intended for storage on disk. */
    module SQExprShortSerializer {
        function serialize(expr: SQExpr): string;
        function serializeArray(exprs: SQExpr[]): string;
    }
}

declare module powerbi.visuals {
    import Selector = powerbi.data.Selector;
    import SelectorForColumn = powerbi.SelectorForColumn;
    /**
     * A combination of identifiers used to uniquely identify
     * data points and their bound geometry.
     */
    class SelectionId implements ISelectionId {
        private selector;
        private selectorsByColumn;
        private key;
        private keyWithoutHighlight;
        highlight: boolean;
        constructor(selector: Selector, highlight: boolean);
        equals(other: SelectionId): boolean;
        /**
         * Checks equality against other for all identifiers existing in this.
         */
        includes(other: SelectionId, ignoreHighlight?: boolean): boolean;
        getKey(): string;
        getKeyWithoutHighlight(): string;
        hasIdentity(): boolean;
        getSelector(): Selector;
        getSelectorsByColumn(): Selector;
        static createNull(highlight?: boolean): SelectionId;
        static createWithId(id: DataViewScopeIdentity, highlight?: boolean): SelectionId;
        static createWithMeasure(measureId: string, highlight?: boolean): SelectionId;
        static createWithIdAndMeasure(id: DataViewScopeIdentity, measureId: string, highlight?: boolean): SelectionId;
        static createWithIdAndMeasureAndCategory(id: DataViewScopeIdentity, measureId: string, queryName: string, highlight?: boolean): SelectionId;
        static createWithIds(id1: DataViewScopeIdentity, id2: DataViewScopeIdentity, highlight?: boolean): SelectionId;
        static createWithIdsAndMeasure(id1: DataViewScopeIdentity, id2: DataViewScopeIdentity, measureId: string, highlight?: boolean): SelectionId;
        static createWithSelectorForColumnAndMeasure(dataMap: SelectorForColumn, measureId: string, highlight?: boolean): SelectionId;
        static createWithHighlight(original: SelectionId): SelectionId;
        private static idArray(id1, id2);
    }
    /**
     * This class is designed to simplify the creation of SelectionId objects
     * It allows chaining to build up an object before calling 'create' to build a SelectionId
     */
    class SelectionIdBuilder implements ISelectionIdBuilder {
        private dataMap;
        private measure;
        static builder(): SelectionIdBuilder;
        withCategoryIdentity(categoryColumn: DataViewCategoryColumn, identity: DataViewScopeIdentity): this;
        withCategory(categoryColumn: DataViewCategoryColumn, index: number): this;
        withSeries(seriesColumn: DataViewValueColumns, valueColumn: DataViewValueColumn | DataViewValueColumnGroup): this;
        withMeasure(measureId: string): this;
        createSelectionId(): SelectionId;
        private ensureDataMap();
    }
}

declare module powerbi {
    import DataViewObjectDefinitions = data.DataViewObjectDefinitions;
    import DisplayNameGetter = data.DisplayNameGetter;
    /** Defines a list of style presets for a particular IVisual */
    interface VisualStylePresets {
        /** Title of PropertyPane section for selecting the style */
        sectionTitle: DisplayNameGetter;
        /** Title of PropertyPane slice for selecting the style */
        sliceTitle: DisplayNameGetter;
        /** Default style preset name for the Visual. Usually looked up with when searching by name fails.
         * Must be one of the presets */
        defaultPresetName: string;
        /** List of style presets for the IVisual indexed by preset name */
        presets: _.Dictionary<VisualStylePreset>;
    }
    /** Defines some rules to derive IVisual formatting elements from a Report Theme */
    interface VisualStylePreset {
        /** Serialized name. Changing it would break saved reports */
        name: string;
        /** Display name for the style preset */
        displayName: DisplayNameGetter;
        /** Discription text for the style preset, can be used for a tooltip */
        description?: DisplayNameGetter;
        /**
         * Evaluate the style preset against a report theme and produce DataViewObjectDefinitions for affected objects
         * @param IVisualStyle Report theme
         */
        evaluate: (theme: IVisualStyle) => DataViewObjectDefinitions;
    }
    module VisualStylePresetHelpers {
        /**
         * Get a visual style preset by name.
         * If stylePresets is undefined, returns undefined
         * If the name doesn't match one or name is undefined, the default preset should be returned, can be undefined
         * @param {string} name name of the Style Preset
         */
        function getStylePreset(stylePresets: VisualStylePresets, name: string): VisualStylePreset;
        function getStylePresetsEnum(stylePresets: VisualStylePresets): IEnumType;
    }
}
