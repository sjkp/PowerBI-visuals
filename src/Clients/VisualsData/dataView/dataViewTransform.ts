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
    import inherit = Prototype.inherit;
    import inheritSingle = Prototype.inheritSingle;
    import ArrayExtensions = jsCommon.ArrayExtensions;
    import EnumExtensions = jsCommon.EnumExtensions;
    import INumberDictionary = jsCommon.INumberDictionary;
    
    export interface DataViewTransformApplyOptions {
        prototype: DataView;
        objectDescriptors: DataViewObjectDescriptors;
        dataViewMappings?: DataViewMapping[];
        transforms: DataViewTransformActions;
        colorAllocatorFactory: IColorAllocatorFactory;
        dataRoles: VisualDataRole[];
    }

    /** Describes the Transform actions to be done to a prototype DataView. */
    export interface DataViewTransformActions {
        /** Describes transform metadata for each semantic query select item, as the arrays align, by index. */
        selects?: DataViewSelectTransform[];

        /** Describes the DataViewObject definitions. */
        objects?: DataViewObjectDefinitions;

        /** Describes the splitting of a single input DataView into multiple DataViews. */
        splits?: DataViewSplitTransform[];

        /** Describes the projection metadata which includes projection ordering and active items. */
        roles?: DataViewRoleTransformMetadata;
    }

    export interface DataViewSplitTransform {
        selects: INumberDictionary<boolean>;
    }

    export interface DataViewProjectionOrdering {
        [roleName: string]: number[];
    }

    export interface DataViewProjectionActiveItemInfo {
        queryRef: string;

        /** Describes if the active item should be ignored in concatenation.
            If the active item has a drill filter, it will not be used in concatenation.
            If the value of suppressConcat is true, the activeItem will be ommitted from concatenation. */
        suppressConcat?: boolean;
    }

    export interface DataViewProjectionActiveItems {
        [roleName: string]: DataViewProjectionActiveItemInfo[];
    }

    export interface DataViewRoleTransformMetadata {
        /** Describes the order of selects (referenced by query index) in each role. */
        ordering?: DataViewProjectionOrdering;

        /** Describes the active items in each role. */
        activeItems?: DataViewProjectionActiveItems;
    }

    export interface MatrixTransformationContext {
        rowHierarchyRewritten: boolean;
        columnHierarchyRewritten: boolean;
        hierarchyTreesRewritten: boolean;
    }

    interface ValueRewrite<T> {
        from: T;
        to: T;
    }

    interface NumberToNumberMapping {
        [position: number]: number;
    }

    const enum CategoricalDataViewTransformation {
        None,
        Pivot,
        SelfCrossJoin,
    }

    export const enum StandardDataViewKinds {
        None = 0,
        Categorical = 1,
        Matrix = 1 << 1,
        Single = 1 << 2,
        Table = 1 << 3,
        Tree = 1 << 4,
    }

    // TODO: refactor & focus DataViewTransform into a service with well-defined dependencies.
    export module DataViewTransform {
        const fillRulePropertyDescriptor: DataViewObjectPropertyDescriptor = { type: { fillRule: {} } };

        const enum ColumnIdentifierKind {
            QueryName,
            Role,
        }

        export function apply(options: DataViewTransformApplyOptions): DataView[] {
            debug.assertValue(options, 'options');

            // TODO: Flow a context object through to capture errors/warnings about what happens here for better diagnosability.

            let prototype = options.prototype,
                objectDescriptors = options.objectDescriptors,
                transforms = options.transforms,
                colorAllocatorFactory = options.colorAllocatorFactory;

            if (!prototype)
                return transformEmptyDataView(objectDescriptors, transforms, colorAllocatorFactory);

            if (!transforms)
                return [prototype];

            let transformContext = DataViewTransformContext.create(prototype.metadata, objectDescriptors, options.dataViewMappings, options.dataRoles, transforms, colorAllocatorFactory);

            // If the query was pivoted, we must unpivot the DataViewMatrix and convert it to DataViewCategorical as the 
            // very first step in the transform.  This is because the visual capability role mapping(s) actually targets a Categorical
            // but the DSR from such query cannot be parsed into a Categorical.  Hence, create the Categorical from Matrix
            // before handing the DataView to the rest of the transform pipeline, so that the Categorical can receive the relevant transforms.
            prototype = DataViewPivotCategoricalToPrimaryGroups.unpivotResult(
                prototype,
                transformContext.selectTransforms,
                transformContext.roleKindByQueryRef,
                transformContext.queryProjectionsByRole,
                transformContext.applicableRoleMappings);

            // Transform Query DataView
            let visualDataViews: DataView[] = transformQueryToVisualDataView(prototype, transformContext);

            // Transform and generate derived visual DataViews
            visualDataViews = DataViewRegression.run({
                visualDataViews: visualDataViews,
                dataRoles: transformContext.dataRoles,
                objectDescriptors: objectDescriptors,
                objectDefinitions: transforms.objects,
                colorAllocatorFactory: colorAllocatorFactory,
                transformSelects: transforms.selects,
                applicableDataViewMappings: transformContext.applicableRoleMappings,
                roleKindByQueryRef: transformContext.roleKindByQueryRef,
                queryProjectionsByRole: transformContext.queryProjectionsByRole,
            });

            return visualDataViews;
        }

        function transformQueryToVisualDataView(prototype: DataView, transformContext: DataViewTransformContext): DataView[] {
            debug.assertValue(transformContext, 'transformContext');

            let transformedDataViews: DataView[] = [];
            let splits = transformContext.transforms.splits;
            if (_.isEmpty(splits)) {
                transformedDataViews.push(transformDataView(prototype, transformContext));
            } else {
                for (let split of splits) {
                    let transformed = transformDataView(prototype, transformContext, split.selects);
                    transformedDataViews.push(transformed);
                }
            }
            return transformedDataViews;
        }

        function transformEmptyDataView(objectDescriptors: DataViewObjectDescriptors, transforms: DataViewTransformActions, colorAllocatorFactory: IColorAllocatorFactory): DataView[] {
            if (transforms && transforms.objects) {
                let emptyDataView: DataView = {
                    metadata: {
                        columns: [],
                    }
                };

                transformObjects(
                    emptyDataView,
                    StandardDataViewKinds.None,
                    objectDescriptors,
                    transforms.objects,
                    transforms.selects,
                    colorAllocatorFactory);

                return [emptyDataView];
            }

            return [];
        }

        function transformDataView(
            prototype: DataView,
            transformContext: DataViewTransformContext,
            selectsToInclude?: INumberDictionary<boolean>): DataView {
            debug.assertValue(prototype, 'prototype');
            debug.assertValue(transformContext, 'transformContext');
            debug.assert(!selectsToInclude ||
                _.filter(
                    Object.keys(selectsToInclude),
                    (selectIndex) => selectsToInclude[selectIndex] && (!transformContext.selectTransforms || !transformContext.selectTransforms[selectIndex]))
                    .length === 0, // asserts that the number of select indices in selectsToInclude without a corresponding Select Transform === 0
                'If selectsToInclude is specified, every Select Index in it must have a corresponding Select Transform.');

            // TODO VSTS 7427800: Use applicableDataViewKinds/applicableRoleMappings instead of visualCapabilitiesDataViewKinds/visualCapabilitiesRoleMappings
            // when the input DataViewTransformActions becomes reliable.
            let targetDataViewKinds = transformContext.visualCapabilitiesDataViewKinds;
            let targetRoleMappings = transformContext.visualCapabilitiesRoleMappings;
            let selectTransforms = transformContext.selectTransforms;
            let objectDescriptors = transformContext.objectDescriptors;
            let projectionOrdering = transformContext.projectionOrdering;

            let transformed = inherit(prototype);
            transformed.metadata = inherit(prototype.metadata);

            transformed = transformSelects(transformed, targetDataViewKinds, targetRoleMappings, selectTransforms, projectionOrdering);
            
            transformObjects(transformed, transformContext.visualCapabilitiesDataViewKinds, objectDescriptors, transformContext.transforms.objects, selectTransforms, transformContext.colorAllocatorFactory);

            DataViewRemoveSelects.apply(transformed, targetDataViewKinds, selectsToInclude);

            // Note: Do this step after transformObjects() so that metadata columns in 'transformed' have roles and objects.general.formatString populated
            transformed = DataViewConcatenateCategoricalColumns.detectAndApply(
                transformed,
                transformContext.objectDescriptors,
                transformContext.applicableRoleMappings,
                transformContext.projectionOrdering,
                transformContext.projectionActiveItems);

            DataViewNormalizeValues.apply({
                dataview: transformed,
                dataViewMappings: targetRoleMappings,
                dataRoles: transformContext.dataRoles,
            });

            return transformed;
        }

        function transformSelects(
            dataView: DataView,
            targetDataViewKinds: StandardDataViewKinds,
            roleMappings: DataViewMapping[],
            selectTransforms: DataViewSelectTransform[],
            projectionOrdering: DataViewProjectionOrdering): DataView {
            debug.assertValue(dataView, 'prototype');
            debug.assertValue(targetDataViewKinds, 'targetDataViewKinds');
            debug.assert(targetDataViewKinds === StandardDataViewKinds.None || !_.isEmpty(roleMappings), 'if targetDataViewKinds !== None, then roleMappings must be non-empty');
            debug.assertAnyValue(selectTransforms, 'selectTransforms');
            debug.assertAnyValue(projectionOrdering, 'projectionOrdering');

            let columnRewrites: ValueRewrite<DataViewMetadataColumn>[] = [];
            if (selectTransforms) {
                dataView.metadata.columns = applyTransformsToColumns(
                    dataView.metadata.columns,
                    selectTransforms,
                    columnRewrites);
                    
                evaluateAggregateSources(dataView, selectTransforms);
            }

            // NOTE: no rewrites necessary for Tree (it doesn't reference the columns)

            if (dataView.categorical && EnumExtensions.hasFlag(targetDataViewKinds, StandardDataViewKinds.Categorical)) {
                dataView.categorical = applyRewritesToCategorical(dataView.categorical, columnRewrites);

                // TODO VSTS 7024199: separate out structural transformations from dataViewTransform.transformSelects(...)
                // NOTE: This is slightly DSR-specific.
                dataView = pivotIfNecessary(dataView, roleMappings);
            }

            // Don't perform this potentially expensive transform unless we actually have a matrix.
            // When we switch to lazy per-visual DataView creation, we'll be able to remove this check.
            if (dataView.matrix && EnumExtensions.hasFlag(targetDataViewKinds, StandardDataViewKinds.Matrix)) {
                let matrixTransformationContext: MatrixTransformationContext = {
                    rowHierarchyRewritten: false,
                    columnHierarchyRewritten: false,
                    hierarchyTreesRewritten: false
                };
                dataView.matrix = applyRewritesToMatrix(dataView.matrix, columnRewrites, roleMappings, projectionOrdering, matrixTransformationContext);

                // TODO VSTS 7024199: separate out structural transformations from dataViewTransform.transformSelects(...)
                if (shouldPivotMatrix(dataView.matrix, roleMappings))
                    DataViewPivotMatrix.apply(dataView.matrix, matrixTransformationContext);
            }

            // Don't perform this potentially expensive transform unless we actually have a table.
            // When we switch to lazy per-visual DataView creation, we'll be able to remove this check.
            if (dataView.table && EnumExtensions.hasFlag(targetDataViewKinds, StandardDataViewKinds.Table)) {
                dataView.table = applyRewritesToTable(dataView.table, columnRewrites, projectionOrdering);
            }

            return dataView;
        }

        function applyTransformsToColumns(
            prototypeColumns: DataViewMetadataColumn[],
            selects: DataViewSelectTransform[],
            rewrites: ValueRewrite<DataViewMetadataColumn>[]): DataViewMetadataColumn[] {
            debug.assertValue(prototypeColumns, 'columns');

            if (!selects)
                return prototypeColumns;

            // column may contain undefined entries
            let columns = inherit(prototypeColumns);

            for (let i = 0, len = prototypeColumns.length; i < len; i++) {
                let prototypeColumn = prototypeColumns[i];
                
                let select = selects[prototypeColumn.index];
                if (!select)
                    continue;

                let column: DataViewMetadataColumn = columns[i] = inheritColumnProperties(prototypeColumn, select);
                rewrites.push({
                    from: prototypeColumn,
                    to: column,
                });
            }
            
            debug.assert(_.every(rewrites, (rewrite) => rewrite.from.index === rewrite.to.index), 'post-condition: DataViewMetadataColumn.index is not expected to be rewritten by select transforms.');
            return columns;
        }
        
        function inheritColumnProperties(prototypeColumn: DataViewMetadataColumn, select: DataViewSelectTransform): DataViewMetadataColumn {
            debug.assertValue(prototypeColumn, 'prototypeColumn');
            debug.assertValue(select, 'select');
            
            let column: DataViewMetadataColumn = inherit(prototypeColumn);

                if (select.roles)
                    column.roles = select.roles;
                if (select.type)
                    column.type = select.type;
                column.format = getFormatForColumn(select, column);

                if (select.displayName)
                    column.displayName = select.displayName;
                if (select.queryName)
                    column.queryName = select.queryName;
                if (select.expr)
                    column.expr = select.expr;
                if (select.kpi)
                    column.kpi = select.kpi;
                if (select.sort)
                    column.sort = select.sort;
                if (select.discourageAggregationAcrossGroups)
                    column.discourageAggregationAcrossGroups = select.discourageAggregationAcrossGroups;

            return column;
        }
        
        function evaluateAggregateSources(dataView: DataView, selects: DataViewSelectTransform[]): void {
            debug.assertValue(dataView, 'dataView');
            debug.assertAnyValue(selects, 'selects');
            
            if (!selects)
                return;

            let columns = dataView.metadata.columns,
                evalContext: IEvalContext;
            for (let selectIdx = 0, len = selects.length; selectIdx < len; selectIdx++) {
                let select = selects[selectIdx];
                let aggregateSources = select && select.aggregateSources;
                if (!aggregateSources)
                    continue;
                
                if (!evalContext)
                    evalContext = createStaticEvalContext(createColorAllocatorCache(), dataView, selects);

                let column = findOrCreateColumn(columns, selectIdx, select);
                let columnAggregates = column.aggregates = <DataViewColumnAggregates>{};
                
                let type = ValueType.fromDescriptor(column.type);
                let value = evaluateAggregate(evalContext, selects, type, aggregateSources.min);
                if (value !== undefined)
                    columnAggregates.min = value;

                value = evaluateAggregate(evalContext, selects, type, aggregateSources.max);
                if (value !== undefined)
                    columnAggregates.max = value;
            }
        }
        
        function findOrCreateColumn(columns: DataViewMetadataColumn[], selectIdx: number, select: DataViewSelectTransform): DataViewMetadataColumn {
            debug.assertValue(columns, 'columns');
            debug.assertValue(selectIdx, 'selectIdx');
            debug.assertValue(select, 'select');
            
            for (let column of columns) {
                if (column.index === selectIdx && column.groupName === undefined)
                    return column;
            }

            let newColumn = inheritColumnProperties({ displayName: select.displayName }, select);
            columns.push(newColumn);
            return newColumn;
        }

        function evaluateAggregate(
            evalContext: IEvalContext,
            selects: DataViewSelectTransform[],
            type: ValueType,
            source: DataViewSelectAggregateSource): PrimitiveValue {
            debug.assertValue(evalContext, 'evalContext');
            debug.assertValue(selects, 'selects');
            debug.assertValue(type, 'type');
            debug.assertValue(source, 'source');

            let select = selects[source.index];
            if (select)
                return DataViewObjectEvaluator.evaluateValue(evalContext, select.expr, type);
        }

        /**
         * Get the column format. Order of precendence is:
         *  1. Select format
         *  2. Column format
         */
        function getFormatForColumn(select: DataViewSelectTransform, column: DataViewMetadataColumn): string {
            // TODO: we already copied the select.Format to column.format, we probably don't need this check
            return select.format || column.format;
        }

        function applyRewritesToCategorical(prototype: DataViewCategorical, columnRewrites: ValueRewrite<DataViewMetadataColumn>[]): DataViewCategorical {
            debug.assertValue(prototype, 'prototype');
            debug.assertValue(columnRewrites, 'columnRewrites');

            let categorical = inherit(prototype);

            function override(value: { source?: DataViewMetadataColumn }) {
                let rewrittenSource = findOverride(value.source, columnRewrites);
                if (rewrittenSource) {
                    let rewritten = inherit(value);
                    rewritten.source = rewrittenSource;
                    return rewritten;
                }
            }

            // apply metadata column rewrites to categories
            let categories = Prototype.overrideArray(prototype.categories, override);
            if (categories) {
                categorical.categories = categories;
            }

            // apply metadata column rewrites to both series and measure
            // If there is no measure, prototype.values will be an empty array, but it can still have a dynamic series.
            if (prototype.values) {
                let valueColumns = Prototype.overrideArray(prototype.values, override) || inheritSingle(prototype.values);

                categorical.values = valueColumns;
            
                if (valueColumns.source) {
                    let rewrittenValuesSource = findOverride(valueColumns.source, columnRewrites);
                    if (rewrittenValuesSource)
                        valueColumns.source = rewrittenValuesSource;
                }
            }

            DataViewCategoricalEvalGrouped.apply(categorical);

            return categorical;
        }

        function applyRewritesToTable(
            prototype: DataViewTable,
            columnRewrites: ValueRewrite<DataViewMetadataColumn>[],
            projectionOrdering: DataViewProjectionOrdering): DataViewTable {
            debug.assertValue(prototype, 'prototype');
            debug.assertValue(columnRewrites, 'columnRewrites');

            let table = inherit(prototype);

            // Copy the rewritten columns into the table view
            let override = (metadata: DataViewMetadataColumn) => findOverride(metadata, columnRewrites);
            let columns = Prototype.overrideArray(prototype.columns, override);
            if (columns)
                table.columns = columns;

            if (!projectionOrdering)
                return table;

            let newToOldPositions = createTableColumnPositionMapping(projectionOrdering, columnRewrites);
            if (!newToOldPositions)
                return table;

            // Reorder the columns
            let columnsClone = columns.slice(0);
            let keys = Object.keys(newToOldPositions);
            for (let i = 0, len = keys.length; i < len; i++) {
                let sourceColumn = columnsClone[newToOldPositions[keys[i]]];

                // In the case we've hit the end of our columns array, but still have position reordering keys,
                // there is a duplicate column so we will need to add a new column for the duplicate data
                if (i === columns.length)
                    columns.push(sourceColumn);
                else {
                    debug.assert(i < columns.length, 'The column index is out of range for reordering.');
                    columns[i] = sourceColumn;
                }
            }

            // Reorder the rows
            let rows = Prototype.overrideArray(table.rows,
                (row: any[]) => {
                    let newRow: any[] = [];
                    for (let i = 0, len = keys.length; i < len; ++i)
                        newRow[i] = row[newToOldPositions[keys[i]]];

                    return newRow;
                });

            if (rows)
                table.rows = rows;

            return table;
        }

        /** Creates a mapping of new position to original position. */
        function createTableColumnPositionMapping(
            projectionOrdering: DataViewProjectionOrdering,
            columnRewrites: ValueRewrite<DataViewMetadataColumn>[]): NumberToNumberMapping {
            let roles = Object.keys(projectionOrdering);

            // If we have more than one role then the ordering of columns between roles is ambiguous, so don't reorder anything.
            if (roles.length !== 1)
                return;

            let role = roles[0],
                originalOrder = _.map(columnRewrites, (rewrite: ValueRewrite<DataViewMetadataColumn>) => rewrite.from.index),
                newOrder = projectionOrdering[role];

            return createOrderMapping(originalOrder, newOrder);
        }

        function applyRewritesToMatrix(
            prototype: DataViewMatrix,
            columnRewrites: ValueRewrite<DataViewMetadataColumn>[],
            roleMappings: DataViewMapping[],
            projectionOrdering: DataViewProjectionOrdering,
            context: MatrixTransformationContext): DataViewMatrix {
            debug.assertValue(prototype, 'prototype');
            debug.assertValue(columnRewrites, 'columnRewrites');
            debug.assertValue(roleMappings, 'roleMappings');
            
            let firstRoleMappingWithMatrix = _.find(roleMappings, (roleMapping) => !!roleMapping.matrix);
            debug.assertValue(firstRoleMappingWithMatrix, 'roleMappings - at least one role mapping is expected to target DataViewMatrix');

            let matrixMapping = firstRoleMappingWithMatrix.matrix;
            let matrix = inherit(prototype);

            function override(metadata: DataViewMetadataColumn) {
                return findOverride(metadata, columnRewrites);
            }

            function overrideHierarchy(hierarchy: DataViewHierarchy): DataViewHierarchy {
                let rewrittenHierarchy: DataViewHierarchy = null;

                let newLevels = Prototype.overrideArray(
                    hierarchy.levels,
                    (level: DataViewHierarchyLevel) => {
                        let newLevel: DataViewHierarchyLevel = null;
                        let levelSources = Prototype.overrideArray(level.sources, override);
                        if (levelSources)
                            newLevel = ensureRewritten<DataViewHierarchyLevel>(newLevel, level, h => h.sources = levelSources);

                        return newLevel;
                    });
                if (newLevels)
                    rewrittenHierarchy = ensureRewritten<DataViewHierarchy>(rewrittenHierarchy, hierarchy, r => r.levels = newLevels);

                return rewrittenHierarchy;
            }

            let rows = overrideHierarchy(matrix.rows);
            if (rows) {
                matrix.rows = rows;
                context.rowHierarchyRewritten = true;
            }

            let columns = overrideHierarchy(matrix.columns);
            if (columns) {
                matrix.columns = columns;
                context.columnHierarchyRewritten = true;
            }

            let valueSources = Prototype.overrideArray(matrix.valueSources, override);
            if (valueSources) {
                matrix.valueSources = valueSources;
            }

            DataViewMatrixProjectionOrder.apply(matrix, matrixMapping, projectionOrdering, context);

            return matrix;
        }

        /**
         * Creates a mapping of indices, from indices to the specified newOrder array, back to indices to the specified
         * originalOrder array.
         * Each of the number value in originalOrder and newOrder is actually the unique key of a column (unqiue
         * under the context of the caller code), e.g. the Select Index in projection ordering array.
         * Also, the specified originalOrder must contain every value that exists in newOrder.
         *
         * If the specified originalOrder and newOrder are different in sequence order, then this function returns a collection of
         * key-value pair, each of which represents the new and old indices of a particular column:
         * - the key in each key-value pair is the index of the particular column key as it exists in the specified newOrder array
         * - the value in each key-value pair is the index of the particular column key as it exists in the specified originalOrder array
         *
         * For example on how the return value is consumed, see functions such as reorderMatrixHierarchyLevelColumnSources(...).
         *
         * If the specified originalOrder and newOrder are same, then this function returns undefined.
         *
         * @param originalOrder E.g. an array of metadata column "select indices", in the original order as they exist in Query DataView.
         * @param newOrder E.g. an array of metadata column "select indices", in rojection ordering.
         */
        function createOrderMapping(originalOrder: number[], newOrder: number[]): NumberToNumberMapping {
            // Optimization: avoid rewriting if the current order is correct
            if (ArrayExtensions.sequenceEqual(originalOrder, newOrder, (x: number, y: number) => x === y))
                return;

            let mapping: NumberToNumberMapping = {};
            for (let i = 0, len = newOrder.length; i < len; ++i) {
                let newPosition = newOrder[i];
                mapping[i] = originalOrder.indexOf(newPosition);
            }

            return mapping;
        }

        function findOverride(source: DataViewMetadataColumn, columnRewrites: ValueRewrite<DataViewMetadataColumn>[]): DataViewMetadataColumn {
            for (let i = 0, len = columnRewrites.length; i < len; i++) {
                let columnRewrite = columnRewrites[i];
                if (columnRewrite.from === source)
                    return columnRewrite.to;
            }
        }

        function ensureRewritten<T>(rewritten: T, prototype: T, callback?: (rewritten: T) => void): T {
            if (!rewritten)
                rewritten = inherit(prototype);

            if (callback)
                callback(rewritten);

            return rewritten;
        }

        export function transformObjects(
            dataView: DataView,
            targetDataViewKinds: StandardDataViewKinds,
            objectDescriptors: DataViewObjectDescriptors,
            objectDefinitions: DataViewObjectDefinitions,
            selectTransforms: DataViewSelectTransform[],
            colorAllocatorFactory: IColorAllocatorFactory): void {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(targetDataViewKinds, 'targetDataViewKinds');
            debug.assertAnyValue(objectDescriptors, 'objectDescriptors');
            debug.assertAnyValue(objectDefinitions, 'objectDefinitions');
            debug.assertAnyValue(selectTransforms, 'selectTransforms');
            debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');

            if (!objectDescriptors)
                return;

            let objectsForAllSelectors = DataViewObjectEvaluationUtils.groupObjectsBySelector(objectDefinitions);
            DataViewObjectEvaluationUtils.addImplicitObjects(objectsForAllSelectors, objectDescriptors, dataView.metadata.columns, selectTransforms);

            let metadataOnce = objectsForAllSelectors.metadataOnce;
            let dataObjects = objectsForAllSelectors.data;
            if (metadataOnce)
                evaluateMetadataObjects(dataView, selectTransforms, objectDescriptors, metadataOnce.objects, dataObjects, colorAllocatorFactory);

            let metadataObjects = objectsForAllSelectors.metadata;
            if (metadataObjects) {
                for (let i = 0, len = metadataObjects.length; i < len; i++) {
                    let metadataObject = metadataObjects[i];
                    let objectDefns = metadataObject.objects;
                    let colorAllocatorCache = populateColorAllocatorCache(dataView, selectTransforms, objectDefns, colorAllocatorFactory);
                    evaluateMetadataRepetition(dataView, selectTransforms, objectDescriptors, metadataObject.selector, objectDefns, colorAllocatorCache);
                }
            }

            for (let i = 0, len = dataObjects.length; i < len; i++) {
                let dataObject = dataObjects[i];
                let objectDefns = dataObject.objects;
                let colorAllocatorCache = populateColorAllocatorCache(dataView, selectTransforms, objectDefns, colorAllocatorFactory);
                evaluateDataRepetition(dataView, targetDataViewKinds, selectTransforms, objectDescriptors, dataObject.selector, dataObject.rules, objectDefns, colorAllocatorCache);
            }

            let userDefined = objectsForAllSelectors.userDefined;
            if (userDefined) {
                // TODO: We only handle user defined objects at the metadata level, but should be able to support them with arbitrary repetition.
                evaluateUserDefinedObjects(dataView, selectTransforms, objectDescriptors, userDefined, colorAllocatorFactory);
            }
        }

        function evaluateUserDefinedObjects(
            dataView: DataView,
            selectTransforms: DataViewSelectTransform[],
            objectDescriptors: DataViewObjectDescriptors,
            objectDefns: DataViewObjectDefinitionsForSelector[],
            colorAllocatorFactory: IColorAllocatorFactory): void {
            debug.assertValue(dataView, 'dataView');
            debug.assertAnyValue(selectTransforms, 'selectTransforms');
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(objectDefns, 'objectDefns');
            debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');

            let dataViewObjects: DataViewObjects = dataView.metadata.objects;
            if (!dataViewObjects) {
                dataViewObjects = dataView.metadata.objects = {};
            }

            for (let objectDefn of objectDefns) {
                let id = objectDefn.selector.id;

                let colorAllocatorCache = populateColorAllocatorCache(dataView, selectTransforms, objectDefn.objects, colorAllocatorFactory);
                let evalContext = createStaticEvalContext(colorAllocatorCache, dataView, selectTransforms);
                let objects = DataViewObjectEvaluationUtils.evaluateDataViewObjects(evalContext, objectDescriptors, objectDefn.objects);

                for (let objectName in objects) {
                    let object = <DataViewObject>objects[objectName];

                    let map = <DataViewObjectMap>dataViewObjects[objectName];
                    if (!map)
                        map = dataViewObjects[objectName] = [];
                    debug.assert(DataViewObjects.isUserDefined(map), 'expected DataViewObjectMap');

                    // NOTE: We do not check for duplicate ids.
                    map.push({ id: id, object: object });
                }
            }
        }

        /** Evaluates and sets properties on the DataView metadata. */
        function evaluateMetadataObjects(
            dataView: DataView,
            selectTransforms: DataViewSelectTransform[],
            objectDescriptors: DataViewObjectDescriptors,
            objectDefns: DataViewNamedObjectDefinition[],
            dataObjects: DataViewObjectDefinitionsForSelectorWithRule[],
            colorAllocatorFactory: IColorAllocatorFactory): void {
            debug.assertValue(dataView, 'dataView');
            debug.assertAnyValue(selectTransforms, 'selectTransforms');
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(objectDefns, 'objectDefns');
            debug.assertValue(dataObjects, 'dataObjects');
            debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');

            let colorAllocatorCache = populateColorAllocatorCache(dataView, selectTransforms, objectDefns, colorAllocatorFactory);
            let evalContext = createStaticEvalContext(colorAllocatorCache, dataView, selectTransforms);
            let objects = DataViewObjectEvaluationUtils.evaluateDataViewObjects(evalContext, objectDescriptors, objectDefns);
            if (objects) {
                dataView.metadata.objects = objects;

                for (let objectName in objects) {
                    let object = <DataViewObject>objects[objectName],
                        objectDesc = objectDescriptors[objectName];

                    for (let propertyName in object) {
                        let propertyDesc = objectDesc.properties[propertyName],
                            ruleDesc = propertyDesc.rule;
                        if (!ruleDesc)
                            continue;

                        let definitions = createRuleEvaluationInstance(
                            dataView,
                            colorAllocatorFactory,
                            ruleDesc,
                            objectName,
                            object[propertyName],
                            propertyDesc.type);
                        if (_.isEmpty(definitions))
                            continue;

                        dataObjects.push(...definitions);
                    }
                }
            }
        }

        function createRuleEvaluationInstance(
            dataView: DataView,
            colorAllocatorFactory: IColorAllocatorFactory,
            ruleDesc: DataViewObjectPropertyRuleDescriptor,
            objectName: string,
            propertyValue: DataViewPropertyValue,
            ruleType: StructuralTypeDescriptor): DataViewObjectDefinitionsForSelectorWithRule[] {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');
            debug.assertValue(ruleDesc, 'ruleDesc');
            debug.assertValue(propertyValue, 'propertyValue');
            debug.assertValue(ruleType, 'ruleType');

            let ruleOutput = ruleDesc.output;
            if (!ruleOutput)
                return;

            let selectorsToCreate = findSelectorsForRuleInput(dataView, ruleOutput.selector);
            if (_.isEmpty(selectorsToCreate))
                return;

            if (ruleType.fillRule) {
                return createRuleEvaluationInstanceFillRule(dataView, colorAllocatorFactory, ruleDesc, selectorsToCreate, objectName, <FillRule>propertyValue);
            }
        }

        function createRuleEvaluationInstanceFillRule(
            dataView: DataView,
            colorAllocatorFactory: IColorAllocatorFactory,
            ruleDesc: DataViewObjectPropertyRuleDescriptor,
            selectorsToCreate: Selector[],
            objectName: string,
            propertyValue: FillRule): DataViewObjectDefinitionsForSelectorWithRule[] {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');
            debug.assertValue(ruleDesc, 'ruleDesc');
            debug.assertValue(selectorsToCreate, 'selectorsToCreate');
            debug.assertValue(propertyValue, 'propertyValue');

            let colorAllocator = tryCreateColorAllocatorForFillRule(dataView, colorAllocatorFactory, ruleDesc.inputRole, ColumnIdentifierKind.Role, propertyValue);

            if (!colorAllocator)
                return;

            let rule = new ColorRuleEvaluation(ruleDesc.inputRole, colorAllocator);
            let fillRuleProperties: DataViewObjectPropertyDefinitions = {};
            fillRuleProperties[ruleDesc.output.property] = {
                solid: { color: rule }
            };

            let objectDefinitions: DataViewObjectDefinitionsForSelectorWithRule[] = [];

            for (let selectorIndex = 0, selectorCount = selectorsToCreate.length; selectorIndex < selectorCount; selectorIndex++) {
                objectDefinitions.push({
                    selector: selectorsToCreate[selectorIndex],
                    rules: [rule],
                        objects: [{
                            name: objectName,
                            properties: fillRuleProperties,
                        }]
                });
            }
            return objectDefinitions;
        }

        function tryCreateColorAllocatorForFillRule(
            dataView: DataView,
            colorAllocatorFactory: IColorAllocatorFactory,
            identifier: string,
            identifierKind: ColumnIdentifierKind,
            propertyValue: FillRule): IColorAllocator {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');
            debug.assertValue(identifier, 'identifier');
            debug.assertValue(identifierKind, 'identifierKind');
            debug.assertValue(propertyValue, 'propertyValue');

            if (propertyValue.linearGradient2)
                return createColorAllocatorLinearGradient2(dataView, colorAllocatorFactory, identifier, identifierKind, propertyValue, propertyValue.linearGradient2);

            if (propertyValue.linearGradient3)
                return createColorAllocatorLinearGradient3(dataView, colorAllocatorFactory, identifier, identifierKind, propertyValue, propertyValue.linearGradient3);
        }

        function createColorAllocatorLinearGradient2(
            dataView: DataView,
            colorAllocatorFactory: IColorAllocatorFactory,
            identifier: string,
            identifierKind: ColumnIdentifierKind,
            propertyValueFillRule: FillRule,
            linearGradient2: LinearGradient2): IColorAllocator {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');
            debug.assertValue(identifier, 'identifier');
            debug.assertValue(identifierKind, 'identifierKind');
            debug.assertValue(linearGradient2, 'linearGradient2');

            linearGradient2 = propertyValueFillRule.linearGradient2;
            if (linearGradient2.min.value === undefined ||
                linearGradient2.max.value === undefined) {
                let inputRange = findRuleInputColumnNumberRange(dataView, identifier, identifierKind);
                if (!inputRange)
                    return;

                if (linearGradient2.min.value === undefined)
                    linearGradient2.min.value = inputRange.min;
                if (linearGradient2.max.value === undefined)
                    linearGradient2.max.value = inputRange.max;
            }

            return colorAllocatorFactory.linearGradient2(propertyValueFillRule.linearGradient2);
        }

        function createColorAllocatorLinearGradient3(
            dataView: DataView,
            colorAllocatorFactory: IColorAllocatorFactory,
            identifier: string,
            identifierKind: ColumnIdentifierKind,
            propertyValueFillRule: FillRule,
            linearGradient3: LinearGradient3): IColorAllocator {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');
            debug.assertValue(identifier, 'identifier');
            debug.assertValue(identifierKind, 'identifierKind');
            debug.assertValue(linearGradient3, 'linearGradient3');

            let splitScales: boolean;
            linearGradient3 = propertyValueFillRule.linearGradient3;
            if (linearGradient3.min.value === undefined ||
                linearGradient3.mid.value === undefined ||
                linearGradient3.max.value === undefined) {
                let inputRange = findRuleInputColumnNumberRange(dataView, identifier, identifierKind);
                if (!inputRange)
                    return;

                splitScales =
                linearGradient3.min.value === undefined &&
                linearGradient3.max.value === undefined &&
                linearGradient3.mid.value !== undefined;

                if (linearGradient3.min.value === undefined) {
                    linearGradient3.min.value = inputRange.min;
                }
                if (linearGradient3.max.value === undefined) {
                    linearGradient3.max.value = inputRange.max;
                }
                if (linearGradient3.mid.value === undefined) {
                    let midValue: number = (linearGradient3.max.value + linearGradient3.min.value) / 2;
                    linearGradient3.mid.value = midValue;
                }
            }

            return colorAllocatorFactory.linearGradient3(propertyValueFillRule.linearGradient3, splitScales);
        }

        function populateColorAllocatorCache(
            dataView: DataView,
            selectTransforms: DataViewSelectTransform[],
            objectDefns: DataViewNamedObjectDefinition[],
            colorAllocatorFactory: IColorAllocatorFactory): IColorAllocatorCache {
            debug.assertValue(dataView, 'dataView');
            debug.assertAnyValue(selectTransforms, 'selectTransforms');
            debug.assertValue(objectDefns, 'objectDefns');
            debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');

            let cache = createColorAllocatorCache();
            let staticEvalContext = createStaticEvalContext();

            for (let i = 0, len = objectDefns.length; i < len; i++) {
                let objectDefnProperties = objectDefns[i].properties;

                for (let propertyName in objectDefnProperties) {
                    let fillProperty = <FillDefinition>objectDefnProperties[propertyName];
                    if (fillProperty &&
                        fillProperty.solid &&
                        fillProperty.solid.color &&
                        fillProperty.solid.color.kind === SQExprKind.FillRule) {

                        let fillRuleExpr = <SQFillRuleExpr>fillProperty.solid.color;

                        let inputExprQueryName = findFirstQueryNameForExpr(selectTransforms, fillRuleExpr.input);
                        if (!inputExprQueryName)
                            continue;

                        let fillRule = DataViewObjectEvaluator.evaluateProperty(
                            staticEvalContext,
                            fillRulePropertyDescriptor,
                            fillRuleExpr.rule);

                        let colorAllocator = tryCreateColorAllocatorForFillRule(dataView, colorAllocatorFactory, inputExprQueryName, ColumnIdentifierKind.QueryName, fillRule);
                        if (colorAllocator)
                            cache.register(fillRuleExpr, colorAllocator);
                    }
                }
            }

            return cache;
        }

        function evaluateDataRepetition(
            dataView: DataView,
            targetDataViewKinds: StandardDataViewKinds,
            selectTransforms: DataViewSelectTransform[],
            objectDescriptors: DataViewObjectDescriptors,
            selector: Selector,
            rules: RuleEvaluation[],
            objectDefns: DataViewNamedObjectDefinition[],
            colorAllocatorCache: IColorAllocatorCache): void {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(targetDataViewKinds, 'targetDataViewKinds');
            debug.assertAnyValue(selectTransforms, 'selectTransforms');
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(selector, 'selector');
            debug.assertAnyValue(rules, 'rules');
            debug.assertValue(objectDefns, 'objectDefns');
            debug.assertValue(colorAllocatorCache, 'colorAllocatorFactory');

            let containsWildcard = Selector.containsWildcard(selector);

            let dataViewCategorical = dataView.categorical;
            if (dataViewCategorical && EnumExtensions.hasFlag(targetDataViewKinds, StandardDataViewKinds.Categorical)) {
                let rewrittenSelector = rewriteCategoricalRoleSelector(dataViewCategorical, selector);

                // 1) Match against categories
                evaluateDataRepetitionCategoricalCategory(dataViewCategorical, selectTransforms, objectDescriptors, rewrittenSelector, rules, containsWildcard, objectDefns, colorAllocatorCache);

                // 2) Match against valueGrouping
                evaluateDataRepetitionCategoricalValueGrouping(dataViewCategorical, selectTransforms, objectDescriptors, rewrittenSelector, rules, containsWildcard, objectDefns, colorAllocatorCache);

                // Consider capturing diagnostics for unmatched selectors to help debugging.
            }

            let dataViewMatrix = dataView.matrix;
            if (dataViewMatrix && EnumExtensions.hasFlag(targetDataViewKinds, StandardDataViewKinds.Matrix)) {
                let rewrittenMatrix = evaluateDataRepetitionMatrix(dataViewMatrix, objectDescriptors, selector, rules, containsWildcard, objectDefns, colorAllocatorCache);
                if (rewrittenMatrix) {
                    // TODO: This mutates the DataView -- the assumption is that prototypal inheritance has already occurred.  We should
                    // revisit this, likely when we do lazy evaluation of DataView.
                    dataView.matrix = rewrittenMatrix;
                }

                // Consider capturing diagnostics for unmatched selectors to help debugging.
            }

            let dataViewTable = dataView.table;
            if (dataViewTable && EnumExtensions.hasFlag(targetDataViewKinds, StandardDataViewKinds.Table)) {
                let rewrittenSelector = rewriteTableRoleSelector(dataViewTable, selector);
                let rewrittenTable = evaluateDataRepetitionTable(dataViewTable, selectTransforms, objectDescriptors, rewrittenSelector, rules, containsWildcard, objectDefns, colorAllocatorCache);
                if (rewrittenTable) {
                    // TODO: This mutates the DataView -- the assumption is that prototypal inheritance has already occurred.  We should
                    // revisit this, likely when we do lazy evaluation of DataView.
                    dataView.table = rewrittenTable;
                }

                // Consider capturing diagnostics for unmatched selectors to help debugging.
            }
        }

        function rewriteTableRoleSelector(dataViewTable: DataViewTable, selector: Selector): Selector {
            if (Selector.hasRoleWildcard(selector)) {
                selector = findSelectorForRoleWildcard(selector, (r) => getIdentityExprsForRolesOnTable(r, dataViewTable));
            }

            return selector;
        }

        function rewriteCategoricalRoleSelector(dataViewCategorical: DataViewCategorical, selector: Selector): Selector {
            if (Selector.hasRoleWildcard(selector)) {
                selector = findSelectorForRoleWildcard(selector, (r) => getIdentityExprsForRolesOnCategorical(r, dataViewCategorical));
            }

            return selector;
        }

        function findSelectorForRoleWildcard(selector: Selector, getIdentityExprsForRoles: (r: string[]) => ISQExpr[]): Selector {
            let resultingSelector: Selector = {
                data: [],
                id: selector.id,
                metadata: selector.metadata
            };

            for (let dataSelector of selector.data) {
                if (Selector.isRoleWildcard(dataSelector)) {
                    let exprs = getIdentityExprsForRoles(dataSelector.roles);
                    if (!_.isEmpty(exprs)) {
                        resultingSelector.data.push(DataViewScopeWildcard.fromExprs(<SQExpr[]>exprs));
                        continue;
                    }
                }

                if (isUniqueDataSelector(resultingSelector.data, dataSelector)) {
                    resultingSelector.data.push(dataSelector);
                }
            }

            return resultingSelector;
        }

        function getIdentityExprsForRolesOnTable(roles: string[], dataViewTable: DataViewTable): ISQExpr[] {
            let allColumnsBelongToSelectorRole: boolean = allColumnsBelongToRole(dataViewTable.columns, roles);
            let exprs = dataViewTable.identityFields;
            if (allColumnsBelongToSelectorRole && exprs)
                return exprs;
        }

        function getIdentityExprsForRolesOnCategorical(roles: string[], dataViewCategorical: DataViewCategorical): ISQExpr[] {
            // NOTE: Matching role wildcards on categorical value groups is not yet implemented because no scenarios need it at the time of this writing.
            if (dataViewCategorical.categories) {
                for (let category of dataViewCategorical.categories) {
                    if (category.source && allColumnsBelongToRole([category.source], roles))
                        return category.identityFields;
                }
            }
        }

        function isUniqueDataSelector(dataSelectors: DataRepetitionSelector[], newSelector: DataRepetitionSelector): boolean {
            if (_.isEmpty(dataSelectors))
                return true;

            return !_.any(dataSelectors, (dataSelector: DataRepetitionSelector) => dataSelector.key === newSelector.key);
        }

        function allColumnsBelongToRole(columns: DataViewMetadataColumn[], selectorRoles: string[]): boolean {
            for (let column of columns) {
                var roles = column.roles;
                if (!roles || !_.any(selectorRoles, (selectorRole) => roles[selectorRole]))
                    return false;
            }

            return true;
        }

        function evaluateDataRepetitionCategoricalCategory(
            dataViewCategorical: DataViewCategorical,
            selectTransforms: DataViewSelectTransform[],
            objectDescriptors: DataViewObjectDescriptors,
            selector: Selector,
            rules: RuleEvaluation[],
            containsWildcard: boolean,
            objectDefns: DataViewNamedObjectDefinition[],
            colorAllocatorCache: IColorAllocatorCache): boolean {
            debug.assertValue(dataViewCategorical, 'dataViewCategorical');
            debug.assertAnyValue(selectTransforms, 'selectTransforms');
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(selector, 'selector');
            debug.assertAnyValue(rules, 'rules');
            debug.assertValue(containsWildcard, 'containsWildcard');
            debug.assertValue(objectDefns, 'objectDefns');
            debug.assertValue(colorAllocatorCache, 'colorAllocatorCache');

            if (!dataViewCategorical.categories || dataViewCategorical.categories.length === 0)
                return;

            let targetColumn = findSelectedCategoricalColumn(dataViewCategorical, selector);
            if (!targetColumn)
                return;

            let identities = targetColumn.identities,
                foundMatch: boolean,
                evalContext = createCategoricalEvalContext(colorAllocatorCache, dataViewCategorical, selectTransforms);

            if (!identities)
                return;

            debug.assert(targetColumn.column.values.length === identities.length, 'Column length mismatch');

            for (let i = 0, len = identities.length; i < len; i++) {
                let identity = identities[i];

                if (containsWildcard || Selector.matchesData(selector, [identity])) {
                    evalContext.setCurrentRowIndex(i);

                    let objects = DataViewObjectEvaluationUtils.evaluateDataViewObjects(evalContext, objectDescriptors, objectDefns);
                    if (objects) {
                        // TODO: This mutates the DataView -- the assumption is that prototypal inheritance has already occurred.  We should
                        // revisit this, likely when we do lazy evaluation of DataView.
                        if (!targetColumn.column.objects) {
                            targetColumn.column.objects = [];
                            targetColumn.column.objects.length = len;
                        }
                        targetColumn.column.objects[i] = objects;
                    }

                    if (!containsWildcard)
                        return true;

                    foundMatch = true;
                }
            }

            return foundMatch;
        }

        function evaluateDataRepetitionCategoricalValueGrouping(
            dataViewCategorical: DataViewCategorical,
            selectTransforms: DataViewSelectTransform[],
            objectDescriptors: DataViewObjectDescriptors,
            selector: Selector,
            rules: RuleEvaluation[],
            containsWildcard: boolean,
            objectDefns: DataViewNamedObjectDefinition[],
            colorAllocatorCache: IColorAllocatorCache): boolean {
            debug.assertValue(dataViewCategorical, 'dataViewCategorical');
            debug.assertAnyValue(selectTransforms, 'selectTransforms');
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(selector, 'selector');
            debug.assertAnyValue(rules, 'rules');
            debug.assertValue(containsWildcard, 'containsWildcard');
            debug.assertValue(objectDefns, 'objectDefns');
            debug.assertValue(colorAllocatorCache, 'colorAllocatorCache');

            let dataViewCategoricalValues = dataViewCategorical.values;
            if (!dataViewCategoricalValues || !dataViewCategoricalValues.identityFields)
                return;

            if (!Selector.matchesKeys(selector, <SQExpr[][]>[dataViewCategoricalValues.identityFields]))
                return;

            let valuesGrouped = dataViewCategoricalValues.grouped();
            if (!valuesGrouped)
                return;

            // NOTE: We do not set the evalContext row index below because iteration is over value groups (i.e., columns, no rows).
            // This should be enhanced in the future.
            let evalContext = createCategoricalEvalContext(colorAllocatorCache, dataViewCategorical, selectTransforms);

            let foundMatch: boolean;
            for (let i = 0, len = valuesGrouped.length; i < len; i++) {
                let valueGroup = valuesGrouped[i];
                let selectorMetadata = selector.metadata;
                let valuesInGroup = valueGroup.values;
                if (containsWildcard || Selector.matchesData(selector, [valueGroup.identity])) {
                    let objects = DataViewObjectEvaluationUtils.evaluateDataViewObjects(evalContext, objectDescriptors, objectDefns);
                    if (objects) {
                        // TODO: This mutates the DataView -- the assumption is that prototypal inheritance has already occurred.  We should
                        // revisit this, likely when we do lazy evaluation of DataView.

                        if (selectorMetadata) {
                            for (let j = 0, jlen = valuesInGroup.length; j < jlen; j++) {
                                let valueColumn = valuesInGroup[j],
                                    valueSource = valueColumn.source;
                                if (valueSource.queryName === selectorMetadata) {
                                    let valueSourceOverwrite = Prototype.inherit(valueSource);
                                    valueSourceOverwrite.objects = objects;
                                    valueColumn.source = valueSourceOverwrite;

                                    foundMatch = true;
                                    break;
                                }
                            }
                        }
                        else {
                            valueGroup.objects = objects;
                            setGrouped(dataViewCategoricalValues, valuesGrouped);

                            foundMatch = true;
                        }
                    }

                    if (!containsWildcard)
                        return true;
                }
            }

            return foundMatch;
        }

        function evaluateDataRepetitionMatrix(
            dataViewMatrix: DataViewMatrix,
            objectDescriptors: DataViewObjectDescriptors,
            selector: Selector,
            rules: RuleEvaluation[],
            containsWildcard: boolean,
            objectDefns: DataViewNamedObjectDefinition[],
            colorAllocatorCache: IColorAllocatorCache): DataViewMatrix {

            let evalContext = createMatrixEvalContext(colorAllocatorCache, dataViewMatrix);
            let rewrittenRows = evaluateDataRepetitionMatrixHierarchy(evalContext, dataViewMatrix.rows, objectDescriptors, selector, rules, containsWildcard, objectDefns);
            let rewrittenCols = evaluateDataRepetitionMatrixHierarchy(evalContext, dataViewMatrix.columns, objectDescriptors, selector, rules, containsWildcard, objectDefns);

            if (rewrittenRows || rewrittenCols) {
                let rewrittenMatrix = inheritSingle(dataViewMatrix);

                if (rewrittenRows)
                    rewrittenMatrix.rows = rewrittenRows;
                if (rewrittenCols)
                    rewrittenMatrix.columns = rewrittenCols;

                return rewrittenMatrix;
            }
        }

        function evaluateDataRepetitionMatrixHierarchy(
            evalContext: IEvalContext,
            dataViewMatrixHierarchy: DataViewHierarchy,
            objectDescriptors: DataViewObjectDescriptors,
            selector: Selector,
            rules: RuleEvaluation[],
            containsWildcard: boolean,
            objectDefns: DataViewNamedObjectDefinition[]): DataViewHierarchy {
            debug.assertAnyValue(dataViewMatrixHierarchy, 'dataViewMatrixHierarchy');
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(selector, 'selector');
            debug.assertAnyValue(rules, 'rules');
            debug.assertValue(objectDefns, 'objectDefns');

            if (!dataViewMatrixHierarchy)
                return;

            let root = dataViewMatrixHierarchy.root;
            if (!root)
                return;

            let rewrittenRoot = evaluateDataRepetitionMatrixNode(evalContext, root, objectDescriptors, selector, rules, containsWildcard, objectDefns);
            if (rewrittenRoot) {
                let rewrittenHierarchy = inheritSingle(dataViewMatrixHierarchy);
                rewrittenHierarchy.root = rewrittenRoot;

                return rewrittenHierarchy;
            }
        }

        function evaluateDataRepetitionMatrixNode(
            evalContext: IEvalContext,
            dataViewNode: DataViewMatrixNode,
            objectDescriptors: DataViewObjectDescriptors,
            selector: Selector,
            rules: RuleEvaluation[],
            containsWildcard: boolean,
            objectDefns: DataViewNamedObjectDefinition[]): DataViewMatrixNode {
            debug.assertValue(evalContext, 'evalContext');
            debug.assertValue(dataViewNode, 'dataViewNode');
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(selector, 'selector');
            debug.assertAnyValue(rules, 'rules');
            debug.assertValue(objectDefns, 'objectDefns');

            let childNodes = dataViewNode.children;
            if (!childNodes)
                return;

            let rewrittenNode: DataViewMatrixNode;
            let shouldSearchChildren: boolean;
            let childIdentityFields = dataViewNode.childIdentityFields;
            if (childIdentityFields) {
                // NOTE: selector matching in matrix currently only considers the current node, and does not consider parents as part of the match.
                shouldSearchChildren = Selector.matchesKeys(selector, <SQExpr[][]>[childIdentityFields]);
            }

            for (let i = 0, len = childNodes.length; i < len; i++) {
                let childNode = childNodes[i],
                    identity = childNode.identity,
                    rewrittenChildNode: DataViewMatrixNode = null;

                if (shouldSearchChildren) {
                    if (containsWildcard || Selector.matchesData(selector, [identity])) {
                        // TODO: Need to initialize context for rule-based properties.  Rule-based properties
                        // (such as fillRule/gradients) are not currently implemented.

                        let objects = DataViewObjectEvaluationUtils.evaluateDataViewObjects(evalContext, objectDescriptors, objectDefns);
                        if (objects) {
                            rewrittenChildNode = inheritSingle(childNode);
                            rewrittenChildNode.objects = objects;
                        }
                    }
                }
                else {
                    rewrittenChildNode = evaluateDataRepetitionMatrixNode(
                        evalContext,
                        childNode,
                        objectDescriptors,
                        selector,
                        rules,
                        containsWildcard,
                        objectDefns);
                }

                if (rewrittenChildNode) {
                    if (!rewrittenNode)
                        rewrittenNode = inheritNodeAndChildren(dataViewNode);
                    rewrittenNode.children[i] = rewrittenChildNode;

                    if (!containsWildcard) {
                        // NOTE: once we find a match for a non-wildcard selector, stop looking.
                        break;
                    }
                }
            }

            return rewrittenNode;
        }

        function inheritNodeAndChildren(node: DataViewMatrixNode): DataViewMatrixNode {
            if (Object.getPrototypeOf(node) !== Object.prototype) {
                return node;
            }

            let inherited = inheritSingle(node);
            inherited.children = inherit(node.children);
            return inherited;
        }

        function evaluateDataRepetitionTable(
            dataViewTable: DataViewTable,
            selectTransforms: DataViewSelectTransform[],
            objectDescriptors: DataViewObjectDescriptors,
            selector: Selector,
            rules: RuleEvaluation[],
            containsWildcard: boolean,
            objectDefns: DataViewNamedObjectDefinition[],
            colorAllocatorCache: IColorAllocatorCache): DataViewTable {
            debug.assertValue(dataViewTable, 'dataViewTable');
            debug.assertAnyValue(selectTransforms, 'selectTransforms');
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(selector, 'selector');
            debug.assertAnyValue(rules, 'rules');
            debug.assertValue(objectDefns, 'objectDefns');
            debug.assertValue(colorAllocatorCache, 'colorAllocatorCache');

            let evalContext = createTableEvalContext(colorAllocatorCache, dataViewTable, selectTransforms);
            let rewrittenRows = evaluateDataRepetitionTableRows(
                evalContext,
                dataViewTable.columns,
                dataViewTable.rows,
                dataViewTable.identity,
                dataViewTable.identityFields,
                objectDescriptors,
                selector,
                rules,
                containsWildcard,
                objectDefns);

            if (rewrittenRows) {
                let rewrittenTable = inheritSingle(dataViewTable);
                rewrittenTable.rows = rewrittenRows;

                return rewrittenTable;
            }
        }

        function evaluateDataRepetitionTableRows(
            evalContext: ITableEvalContext,
            columns: DataViewMetadataColumn[],
            rows: DataViewTableRow[],
            identities: DataViewScopeIdentity[],
            identityFields: ISQExpr[],
            objectDescriptors: DataViewObjectDescriptors,
            selector: Selector,
            rules: RuleEvaluation[],
            containsWildcard: boolean,
            objectDefns: DataViewNamedObjectDefinition[]): DataViewTableRow[] {
            debug.assertValue(evalContext, 'evalContext');
            debug.assertValue(columns, 'columns');
            debug.assertValue(rows, 'rows');
            debug.assertAnyValue(identities, 'identities');
            debug.assertAnyValue(identityFields, 'identityFields');
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(selector, 'selector');
            debug.assertAnyValue(rules, 'rules');
            debug.assertValue(objectDefns, 'objectDefns');

            if (_.isEmpty(identities) || _.isEmpty(identityFields))
                return;

            if (!selector.metadata ||
                !Selector.matchesKeys(selector, <SQExpr[][]>[identityFields]))
                return;

            let colIdx = _.findIndex(columns, col => col.queryName === selector.metadata);
            if (colIdx < 0)
                return;

            debug.assert(rows.length === identities.length, 'row length mismatch');
            let colLen = columns.length;
            let inheritedRows: DataViewTableRow[];

            for (let rowIdx = 0, rowLen = identities.length; rowIdx < rowLen; rowIdx++) {
                let identity = identities[rowIdx];

                if (containsWildcard || Selector.matchesData(selector, [identity])) {
                    evalContext.setCurrentRowIndex(rowIdx);

                    let objects = DataViewObjectEvaluationUtils.evaluateDataViewObjects(evalContext, objectDescriptors, objectDefns);
                    if (objects) {
                        if (!inheritedRows)
                            inheritedRows = inheritSingle(rows);

                        let inheritedRow = inheritedRows[rowIdx] = inheritSingle(inheritedRows[rowIdx]);
                        let objectsForColumns = inheritedRow.objects;
                        if (!objectsForColumns)
                            inheritedRow.objects = objectsForColumns = new Array(colLen);

                        objectsForColumns[colIdx] = objects;
                    }

                    if (!containsWildcard)
                        break;
                }
            }

            return inheritedRows;
        }

        function evaluateMetadataRepetition(
            dataView: DataView,
            selectTransforms: DataViewSelectTransform[],
            objectDescriptors: DataViewObjectDescriptors,
            selector: Selector,
            objectDefns: DataViewNamedObjectDefinition[],
            colorAllocatorCache: IColorAllocatorCache): void {
            debug.assertValue(dataView, 'dataView');
            debug.assertAnyValue(selectTransforms, 'selectTransforms');
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(selector, 'selector');
            debug.assertValue(objectDefns, 'objectDefns');
            debug.assertValue(colorAllocatorCache, 'colorAllocatorCache');

            // TODO: This mutates the DataView -- the assumption is that prototypal inheritance has already occurred.  We should
            // revisit this, likely when we do lazy evaluation of DataView.
            let columns = dataView.metadata.columns,
                metadataId = selector.metadata,
                evalContext = createStaticEvalContext(colorAllocatorCache, dataView, selectTransforms);
            for (let i = 0, len = columns.length; i < len; i++) {
                let column = columns[i];
                if (column.queryName === metadataId) {
                    let objects = DataViewObjectEvaluationUtils.evaluateDataViewObjects(evalContext, objectDescriptors, objectDefns);
                    if (objects)
                        column.objects = objects;
                }
            }
        }

        /** Attempts to find a column that can possibly match the selector. */
        function findSelectedCategoricalColumn(dataViewCategorical: DataViewCategorical, selector: Selector) {
            debug.assertValue(dataViewCategorical.categories[0], 'dataViewCategorical.categories[0]');

            let categoricalColumn = dataViewCategorical.categories[0];
            if (!categoricalColumn.identityFields)
                return;
            if (!Selector.matchesKeys(selector, <SQExpr[][]>[categoricalColumn.identityFields]))
                return;

            let identities = categoricalColumn.identity,
                targetColumn: DataViewCategoricalColumn = categoricalColumn;

            let selectedMetadataId = selector.metadata;
            if (selectedMetadataId) {
                let valueColumns = dataViewCategorical.values;
                if (valueColumns) {
                    for (let i = 0, len = valueColumns.length; i < len; i++) {
                        let valueColumn = valueColumns[i];
                        if (valueColumn.source.queryName === selectedMetadataId) {
                            targetColumn = valueColumn;
                            break;
                        }
                    }
                }
            }

            return {
                column: targetColumn,
                identities: identities,
            };
        }

        function findSelectorsForRuleInput(dataView: DataView, selectorRoles: string[]): Selector[] {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(selectorRoles, 'selectorRoles');

            let dataViewCategorical = dataView.categorical;
            if (!dataViewCategorical)
                return;

            let categories = dataViewCategorical.categories;
            if (!categories)
                return;

            let selectorsForRuleInput: Selector[] = [];
            let categoryRoles: { [name: string]: boolean };

            for (let categoryIndex = 0, categoryCount = categories.length; categoryIndex < categoryCount; categoryIndex++) {
                let categoryColumn = categories[categoryIndex],
                    categoryIdentityFields = categoryColumn.identityFields;
                categoryRoles = categoryColumn.source.roles;
                if (!categoryRoles || !categoryIdentityFields)
                    continue;

                let columnHasSelectorRole = _.any(selectorRoles, (role: string) => categoryRoles[role]);
                if (!columnHasSelectorRole)
                    continue;

                selectorsForRuleInput.push({ data: [DataViewScopeWildcard.fromExprs(<SQExpr[]>categoryIdentityFields)] });
            }

            return selectorsForRuleInput;
        }

        function findFirstQueryNameForExpr(selectTransforms: DataViewSelectTransform[], expr: SQExpr): string {
            debug.assertAnyValue(selectTransforms, 'selectTransforms');
            debug.assertValue(expr, 'expr');

            if (SQExpr.isSelectRef(expr))
                return expr.expressionName;

            if (!selectTransforms)
                return;

            for (let i = 0, len = selectTransforms.length; i < len; i++) {
                let select = selectTransforms[i],
                    columnExpr = select.expr;

                if (!columnExpr || !SQExpr.equals(expr, select.expr))
                    continue;

                return select.queryName;
            }
        }

        /** Attempts to find the value range for the single column with the given identifier/identifierKind. */
        function findRuleInputColumnNumberRange(dataView: DataView, identifier: string, identifierKind: ColumnIdentifierKind): NumberRange {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(identifier, 'identifier');
            debug.assertValue(identifierKind, 'identifierKind');

            let columns = dataView.metadata.columns;

            for (let i = 0, len = columns.length; i < len; i++) {
                let column = columns[i];

                if (identifierKind === ColumnIdentifierKind.Role) {
                    let valueColRoles = column.roles;

                    if (!valueColRoles || !valueColRoles[identifier])
                        continue;
                }
                else {
                    debug.assert(identifierKind === ColumnIdentifierKind.QueryName, 'identifierKind === ColumnIdentifierKind.QueryName');

                    if (column.queryName !== identifier)
                        continue;
                }

                let aggregates = column.aggregates;
                if (!aggregates)
                    continue;

                let min = <number>aggregates.min;
                if (min === undefined)
                    min = <number>aggregates.minLocal;
                if (min === undefined)
                    continue;

                let max = <number>aggregates.max;
                if (max === undefined)
                    max = <number>aggregates.maxLocal;
                if (max === undefined)
                    continue;

                return { min: min, max: max };
            }
        }

        // TODO: refactor this, setGrouped, and groupValues to a test helper to stop using it in the product
        export function createValueColumns(
            values: DataViewValueColumn[] = [],
            valueIdentityFields?: SQExpr[],
            source?: DataViewMetadataColumn): DataViewValueColumns {
            let result = <DataViewValueColumns>values;
            setGrouped(<DataViewValueColumns>values);

            if (valueIdentityFields)
                result.identityFields = valueIdentityFields;

            if (source)
                result.source = source;

            return result;
        }

        export function setGrouped(values: DataViewValueColumns, groupedResult?: DataViewValueColumnGroup[]): void {
            values.grouped = groupedResult
                ? () => groupedResult
                : () => groupValues(values);
        }

        /** Group together the values with a common identity. */
        function groupValues(values: DataViewValueColumn[]): DataViewValueColumnGroup[] {
            debug.assertValue(values, 'values');

            let groups: DataViewValueColumnGroup[] = [],
                currentGroup: DataViewValueColumnGroup;

            for (let i = 0, len = values.length; i < len; i++) {
                let value = values[i];

                if (!currentGroup || currentGroup.identity !== value.identity) {
                    currentGroup = {
                        values: []
                    };

                    if (value.identity) {
                        currentGroup.identity = value.identity;

                        let source = value.source;

                        // allow null, which will be formatted as (Blank).
                        if (source.groupName !== undefined)
                            currentGroup.name = source.groupName;
                        else if (source.displayName)
                            currentGroup.name = source.displayName;
                    }

                    groups.push(currentGroup);
                }

                currentGroup.values.push(value);
            }

            return groups;
        }

        function pivotIfNecessary(dataView: DataView, dataViewMappings: DataViewMapping[]): DataView {
            debug.assertValue(dataView, 'dataView');

            let transformedDataView: DataView;
            switch (determineCategoricalTransformation(dataView.categorical, dataViewMappings)) {
                case CategoricalDataViewTransformation.Pivot:
                    transformedDataView = DataViewPivotCategorical.apply(dataView);
                    break;

                case CategoricalDataViewTransformation.SelfCrossJoin:
                    transformedDataView = DataViewSelfCrossJoin.apply(dataView);
                    break;
            }

            return transformedDataView || dataView;
        }

        function determineCategoricalTransformation(categorical: DataViewCategorical, dataViewMappings: DataViewMapping[]): CategoricalDataViewTransformation {
            if (!categorical || _.isEmpty(dataViewMappings))
                return;

            let categories = categorical.categories;
            if (!categories || categories.length !== 1)
                return;

            let values = categorical.values;
            if (_.isEmpty(values))
                return;

            if (values.grouped().some(vg => !!vg.identity))
                return;

            // If we made it here, the DataView has a single category and no valueGrouping.
            let categoryRoles = categories[0].source.roles;

            for (let i = 0, len = dataViewMappings.length; i < len; i++) {
                let roleMappingCategorical = dataViewMappings[i].categorical;
                if (!roleMappingCategorical)
                    continue;

                if (!hasRolesGrouped(categoryRoles, <DataViewGroupedRoleMapping>roleMappingCategorical.values))
                    continue;

                // If we made it here, the DataView's single category has the value grouping role.
                let categoriesMapping = roleMappingCategorical.categories;
                let hasCategoryRole =
                    hasRolesBind(categoryRoles, <DataViewRoleBindMappingWithReduction>categoriesMapping) ||
                    hasRolesFor(categoryRoles, <DataViewRoleForMappingWithReduction>categoriesMapping);

                if (hasCategoryRole)
                    return CategoricalDataViewTransformation.SelfCrossJoin;

                return CategoricalDataViewTransformation.Pivot;
            }
        }

        function shouldPivotMatrix(matrix: DataViewMatrix, dataViewMappings: DataViewMapping[]): boolean {
            if (!matrix || _.isEmpty(dataViewMappings))
                return;

            let rowLevels = matrix.rows.levels;
            if (rowLevels.length < 1)
                return;

            let rows = matrix.rows.root.children;
            if (!rows || rows.length === 0)
                return;

            let rowRoles = rowLevels[0].sources[0].roles;

            for (let i = 0, len = dataViewMappings.length; i < len; i++) {
                let roleMappingMatrix = dataViewMappings[i].matrix;
                if (!roleMappingMatrix)
                    continue;

                if (!hasRolesFor(rowRoles, <DataViewRoleForMappingWithReduction>roleMappingMatrix.rows) &&
                    hasRolesFor(rowRoles, <DataViewRoleForMappingWithReduction>roleMappingMatrix.columns)) {
                    return true;
                }
            }
        }

        function hasRolesBind(roles: { [name: string]: boolean }, roleMapping: DataViewRoleBindMappingWithReduction): boolean {
            if (roles && roleMapping && roleMapping.bind)
                return roles[roleMapping.bind.to];
        }

        function hasRolesFor(roles: { [name: string]: boolean }, roleMapping: DataViewRoleForMappingWithReduction): boolean {
            if (roles && roleMapping && roleMapping.for)
                return roles[roleMapping.for.in];
        }

        function hasRolesGrouped(roles: { [name: string]: boolean }, roleMapping: DataViewGroupedRoleMapping): boolean {
            if (roles && roleMapping && roleMapping.group)
                return roles[roleMapping.group.by];
        }
    }
}