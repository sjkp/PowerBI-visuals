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
    import ArrayExtensions = jsCommon.ArrayExtensions;
    import DataViewMatrix = powerbi.DataViewMatrix;
    import inheritSingle = Prototype.inheritSingle;
    import INumberDictionary = jsCommon.INumberDictionary;
    import MetadataColumnAndProjectionIndex = powerbi.data.DataViewMetadataColumnUtils.MetadataColumnAndProjectionIndex;

    interface SourceIndexMappingEntry {
        originalSourceIndex: number;
        newSourceIndex: number;
    }
    
    export module DataViewMatrixProjectionOrder {
        export function apply(
            prototype: DataViewMatrix,
            matrixMapping: DataViewMatrixMapping,
            projectionOrdering: DataViewProjectionOrdering,
            context: MatrixTransformationContext): DataViewMatrix {
            debug.assertValue(prototype, 'prototype');
            debug.assertValue(matrixMapping, 'matrixMapping');
            debug.assertAnyValue(projectionOrdering, 'projectionOrdering');
            debug.assertValue(context, 'context');

            let transformingMatrix = prototype;
            if (projectionOrdering) {
                transformingMatrix = projectMeasures(transformingMatrix, matrixMapping, projectionOrdering, context);
                transformingMatrix = reorderCompositeGroups(transformingMatrix, matrixMapping, projectionOrdering);
            }

            return transformingMatrix;
        }

        /**
         * Re-orders matrix intersection values and measure headers, by projection ordering. 
         */
        function projectMeasures(
            prototype: DataViewMatrix,
            matrixRoleMapping: DataViewMatrixMapping,
            projectionOrdering: DataViewProjectionOrdering,
            context: MatrixTransformationContext): DataViewMatrix {
            debug.assertValue(prototype, 'prototype');
            debug.assertValue(matrixRoleMapping, 'matrixRoleMapping');
            debug.assertValue(projectionOrdering, 'projectionOrdering');
            debug.assertValue(context, 'context');

            if (!projectionOrdering)
                return prototype;

            let valuesRoleNames = getMatrixValuesRoleNames(matrixRoleMapping); 
            if (_.isEmpty(valuesRoleNames)) {
                debug.assertFail('Unable to get the matrix values role name from: ' + JSON.stringify(matrixRoleMapping));
                return prototype;
            }

            let valueSources = prototype.valueSources;
            let projectionOrderingForValuesRoles = getCombinedProjectionOrdering(projectionOrdering, valuesRoleNames);
            if (_.isEmpty(valueSources) || isEqualProjectionOrdering(prototype.valueSources, projectionOrderingForValuesRoles)) {
                return prototype;
            }

            let jointMetadataColumns: MetadataColumnAndProjectionIndex[] = DataViewMetadataColumnUtils
                .leftJoinMetadataColumnsAndProjectionOrder(valueSources, projectionOrderingForValuesRoles, valuesRoleNames);

            let jointMetadataColumnsOrderedByProjection = _.chain(jointMetadataColumns)
                .filter((column) => column.projectionOrderIndex !== undefined)
                .sortBy((column) => column.projectionOrderIndex)
                .value();

            let matrix = inheritSingle(prototype);

            // project values in each intersection row
            matrix.rows = projectIntersectionValues(matrix.rows, /* originalValueSources */ matrix.valueSources, jointMetadataColumnsOrderedByProjection);

            // fix up valueSources
            let projectedValueSources = _.map(jointMetadataColumnsOrderedByProjection, (jointMetadataColumn) => jointMetadataColumn.metadataColumn);
            matrix.valueSources = projectedValueSources;

            // fix up measure headers
            matrix.columns = DataViewMatrixMeasureHeaders.update(matrix.columns, [...projectedValueSources]);

            context.hierarchyTreesRewritten = true;

            return matrix;
        }
        
        function getMatrixValuesRoleNames(matrixRoleMapping: DataViewMatrixMapping): string[] {
            debug.assertValue(matrixRoleMapping, 'matrixRoleMapping');

            let valuesRoles: string[] = [];
            DataViewMapping.visitMatrixItems(matrixRoleMapping.values, {
                visitRole(role: string) {
                    valuesRoles.push(role);
                }
            });

            return valuesRoles;
        }

        function getCombinedProjectionOrdering(projectionOrdering: DataViewProjectionOrdering, roles: string[]): number[] {
            debug.assertValue(projectionOrdering, 'projectionOrdering');
            debug.assertValue(roles, 'roles');

            let combinedOrdering: number[] = [];

            for (let role of roles) {
                let roleProjectionOrdering: number[] = projectionOrdering[role];
                if (!_.isEmpty(roleProjectionOrdering)) {
                    combinedOrdering.push(...roleProjectionOrdering);
                }
            }

            return combinedOrdering;
        }

        function isEqualProjectionOrdering(valueSources: DataViewMetadataColumn[], valueProjectionOrdering: number[]): boolean {
            debug.assertValue(valueSources, 'valueSources');
            debug.assertValue(valueProjectionOrdering, 'valueProjectionOrdering');

            let currentSelectIndices: number[] = _.map(valueSources, (valueSource) => valueSource.index);
            return ArrayExtensions.sequenceEqual(currentSelectIndices, valueProjectionOrdering, (a, b) => a === b);
        }

        function projectIntersectionValues(
            prototypeRowHierarchy: DataViewHierarchy,
            originalValueSources: DataViewMetadataColumn[],
            projectedValueSourceEntries: MetadataColumnAndProjectionIndex[]): DataViewHierarchy {
            debug.assertValue(prototypeRowHierarchy, 'prototypeRowHierarchy');
            debug.assertNonEmpty(originalValueSources, 'originalValueSources'); // otherwise this code can get a divide-by-zero error
            debug.assertValue(projectedValueSourceEntries, 'projectedValueSourceEntries');

            let originalValueSourcesLength = originalValueSources.length;
            let projectingValueSourcesLength = projectedValueSourceEntries.length;
            let columnGroupInstanceCount: number;

            let rowHierarchy = inheritSingle(prototypeRowHierarchy);
            rowHierarchy.root = DataViewPivotMatrix.cloneTreeExecuteOnLeaf(
                rowHierarchy.root,
                (node: DataViewMatrixNode) => {
                    let originalValues = node.values;
                    if (!originalValues)
                        return;

                    // calculate columnGroupInstanceCount on first leaf node:
                    if (columnGroupInstanceCount === undefined) {
                        debug.assert(Object.keys(node.values).length % originalValueSourcesLength === 0, 'expecting the intersection values to have one value per measure column per column group instance');
                        columnGroupInstanceCount = Object.keys(node.values).length / originalValueSourcesLength;
                    }
                    debug.assert(columnGroupInstanceCount === (Object.keys(node.values).length / originalValueSourcesLength), 'expecting every interaction values collection to have the same length');

                    if (projectingValueSourcesLength > 0) {
                        // if at least one measure column is being projected...
                        let projectedValues: { [id: number]: DataViewTreeNodeValue } = {};

                        // for each column group instance (e.g. 'Canada', 'US', ...)
                        for (let columnGroupInstanceIndex = 0; columnGroupInstanceIndex < columnGroupInstanceCount; columnGroupInstanceIndex++) {
                            let offsetInOriginalValues = columnGroupInstanceIndex * originalValueSourcesLength;
                            let offsetInProjectedValues = columnGroupInstanceIndex * projectingValueSourcesLength;

                            // for each measure value source being projected (e.g. Revenue, Quantity, ...) 
                            for (let projectingValueSourceIndex = 0; projectingValueSourceIndex < projectingValueSourcesLength; projectingValueSourceIndex++) {
                                let originalValueSourceIndex = projectedValueSourceEntries[projectingValueSourceIndex].sourceIndex;
                                let nodeValue = originalValues[offsetInOriginalValues + originalValueSourceIndex];

                                if (projectingValueSourceIndex !== (nodeValue.valueSourceIndex || 0)) {
                                    nodeValue = inheritSingle(nodeValue);
                                    nodeValue.valueSourceIndex = projectingValueSourceIndex || undefined;
                                }

                                projectedValues[offsetInProjectedValues + projectingValueSourceIndex] = nodeValue;
                            } 
                        }

                        node.values = projectedValues;
                    } else {
                        // if no measure column is being projected...
                        node.values = undefined;
                    }
                });

            return rowHierarchy;
        }

        /**
         * Returns a inheritSingle() version of the specified prototype DataViewMatrix with any composite group levels
         * and values re-ordered by projection ordering.
         * Returns undefined if no re-ordering under the specified prototype is necessary.
         */
        function reorderCompositeGroups(
            prototype: DataViewMatrix,
            supportedDataViewMapping: DataViewMatrixMapping,
            projectionOrdering: DataViewProjectionOrdering): DataViewMatrix {
            debug.assertValue(prototype, 'prototype');
            debug.assertValue(supportedDataViewMapping, 'supportedDataViewMapping');
            debug.assertValue(projectionOrdering, 'projectionOrdering');

            // reorder levelValues in any composite groups in rows hierarchy
            let transformedRowsHierarchy: DataViewHierarchy;
            DataViewMapping.visitMatrixItems(supportedDataViewMapping.rows, {
                visitRole: (role: string, context?: RoleItemContext): void => {
                    transformedRowsHierarchy = reorderMatrixHierarchyCompositeGroups(
                        transformedRowsHierarchy || prototype.rows,
                        role,
                        projectionOrdering);
                }
            });

            // reorder levelValues in any composite groups in columns hierarchy
            let transformedColumnsHierarchy: DataViewHierarchy;
            DataViewMapping.visitMatrixItems(supportedDataViewMapping.columns, {
                visitRole: (role: string, context?: RoleItemContext): void => {
                    transformedColumnsHierarchy = reorderMatrixHierarchyCompositeGroups(
                        transformedColumnsHierarchy || prototype.columns,
                        role,
                        projectionOrdering);
                }
            });

            let transformedDataView: DataViewMatrix;
            if (transformedRowsHierarchy || transformedColumnsHierarchy) {
                transformedDataView = inheritSingle(prototype);
                transformedDataView.rows = transformedRowsHierarchy || transformedDataView.rows;
                transformedDataView.columns = transformedColumnsHierarchy || transformedDataView.columns;
            }

            return transformedDataView || prototype;
        }

        /**
         * Returns a inheritSingle() version of the specified matrixHierarchy with any composite group levels and
         * values re-ordered by projection ordering.
         * Returns undefined if no re-ordering under the specified matrixHierarchy is necessary.
         */
        function reorderMatrixHierarchyCompositeGroups(
            matrixHierarchy: DataViewHierarchy,
            hierarchyRole: string,
            projectionOrdering: DataViewProjectionOrdering): DataViewHierarchy {
            debug.assertValue(matrixHierarchy, 'matrixHierarchy');
            debug.assertValue(hierarchyRole, 'hierarchyRole');
            debug.assertValue(projectionOrdering, 'projectionOrdering');

            let transformedHierarchy: DataViewHierarchy;
            let selectIndicesInProjectionOrder: number[] = projectionOrdering[hierarchyRole];

            // reordering needs to happen only if there are multiple columns for the hierarchy's role in the projection
            let hasMultipleColumnsInProjection = selectIndicesInProjectionOrder && selectIndicesInProjectionOrder.length >= 2;
            if (hasMultipleColumnsInProjection && !_.isEmpty(matrixHierarchy.levels)) {
                for (let i = matrixHierarchy.levels.length - 1; i >= 0; i--) {
                    var hierarchyLevel: DataViewHierarchyLevel = matrixHierarchy.levels[i];

                    // compute a mapping for any necessary reordering of columns at this given level, based on projection ordering
                    let levelSourceIndexMappings: SourceIndexMappingEntry[] =
                        createMatrixHierarchyLevelSourcesPositionMapping(hierarchyLevel, hierarchyRole, projectionOrdering);

                    if (!_.isEmpty(levelSourceIndexMappings)) {
                        if (transformedHierarchy === undefined) {
                            // Because we start inspecting the hierarchy from the deepest level and work backwards to the root,
                            // the current hierarchyLevel is therefore the inner-most level that needs re-ordering of composite group values...
                            transformedHierarchy = inheritSingle(matrixHierarchy);
                            transformedHierarchy.levels = inheritSingle(matrixHierarchy.levels);

                            // Because the current hierarchyLevel is the inner-most level that needs re-ordering of composite group values,
                            // inheriting all nodes from root down to this level will also prepare the nodes for any transform that needs to
                            // happen in other hierarchy levels in the later iterations of this for-loop.
                            transformedHierarchy.root = DataViewMatrixUtils.inheritMatrixNodeHierarchy(matrixHierarchy.root, i, true);
                        }

                        // reorder the metadata columns in the sources array at that level
                        let transformingHierarchyLevel = inheritSingle(matrixHierarchy.levels[i]); // inherit at most once during the whole dataViewTransform for this obj...
                        transformedHierarchy.levels[i] = reorderMatrixHierarchyLevelColumnSources(transformingHierarchyLevel, levelSourceIndexMappings);

                        // reorder the level values in the composite group nodes at the current hierarchy level
                        reorderMatrixHierarchyLevelValues(transformedHierarchy.root, i, levelSourceIndexMappings);
                    }
                }
            }

            return transformedHierarchy;
        }

        /**
         * If reordering is needed on the level's metadata column sources (i.e. hierarchyLevel.sources),
         * returns the mapping from the target LevelSourceIndex (based on projection order) to original LevelSourceIndex.
         *
         * The returned value maps level source indices from the new target order (calculated from projection order)
         * back to the original order as they appear in the specified hierarchyLevel's sources.
         *
         * Note: The return value is the mapping from new index to old index, for consistency with existing and similar functions in this module.
         *
         * @param hierarchyLevel The hierarchy level that contains the metadata column sources.
         * @param hierarchyRoleName The role name for the hierarchy where the specified hierarchyLevel belongs.
         * @param projection The projection ordering that includes an ordering for the specified hierarchyRoleName.
         */
        function createMatrixHierarchyLevelSourcesPositionMapping(
            hierarchyLevel: DataViewHierarchyLevel,
            hierarchyRole: string,
            projectionOrdering: DataViewProjectionOrdering): SourceIndexMappingEntry[] {
            debug.assertValue(hierarchyLevel, 'hierarchyLevel');
            debug.assertValue(hierarchyRole, 'hierarchyRole');
            debug.assertValue(projectionOrdering, 'projectionOrdering');
            debug.assertValue(projectionOrdering[hierarchyRole], 'pre-condition: The specified projectionOrdering must contain an ordering for the specified hierarchyRole name.');

            let levelSourceIndexMappings: SourceIndexMappingEntry[];
            let levelSourceColumns = hierarchyLevel.sources;

            if (levelSourceColumns && levelSourceColumns.length >= 2) {
                // The hierarchy level has multiple columns, so it is possible to have composite group, go on to check other conditions...

                // This code does not support projecting the same field multiple times in a matrix hierarchy, but it can still
                // sort the columns in a composite group even if a column is getting projected multiple times.
                let uniqueProjectionOrdering = _.uniq(projectionOrdering[hierarchyRole]);

                let columnsForHierarchyRoleOrderedByLevelSourceIndex = DataViewMetadataColumnUtils.leftJoinMetadataColumnsAndProjectionOrder(
                    levelSourceColumns,
                    uniqueProjectionOrdering,
                    [hierarchyRole]);

                debug.assert(_.every(columnsForHierarchyRoleOrderedByLevelSourceIndex, (projectedColumn) => projectedColumn.projectionOrderIndex !== undefined),
                    'pre-condition: The projection order for the ' + hierarchyRole + ' role is expected to contain the Select Index of every metadata column for that role in levelSourceColumns.' +
                    ' In other words, removing column from a matrix grouping hierarchy via projection ordering is not supported nor expected. projectionOrdering: ' + JSON.stringify(projectionOrdering));

                if (columnsForHierarchyRoleOrderedByLevelSourceIndex && columnsForHierarchyRoleOrderedByLevelSourceIndex.length >= 2) {
                    // The hierarchy level has multiple columns for the hierarchy's role, go on to calculate newToOldLevelSourceIndicesMapping...
                    let columnsForHierarchyRoleOrderedByProjection = _.sortBy(
                        columnsForHierarchyRoleOrderedByLevelSourceIndex,
                        columnInfo => columnInfo.projectionOrderIndex);

                    levelSourceIndexMappings = _.map(
                        columnsForHierarchyRoleOrderedByProjection,
                        (value, i) => {
                            let entry: SourceIndexMappingEntry = {
                                originalSourceIndex: value.sourceIndex,
                                newSourceIndex: i,
                            };
                            return entry;
                        }
                    );
                }
            }

            return levelSourceIndexMappings;
        }

        /**
         * Applies re-ordering on the specified transformingHierarchyLevel's sources.
         * Returns the same object as the specified transformingHierarchyLevel.
         */
        function reorderMatrixHierarchyLevelColumnSources(transformingHierarchyLevel: DataViewHierarchyLevel, levelSourceIndexMappings: SourceIndexMappingEntry[]): DataViewHierarchyLevel {
            debug.assertValue(transformingHierarchyLevel, 'transformingHierarchyLevel');
            debug.assertNonEmpty(levelSourceIndexMappings, 'levelSourceIndexMappings');

            let originalLevelSources = transformingHierarchyLevel.sources;

            transformingHierarchyLevel.sources = originalLevelSources.slice(0); // make a clone of the array before modifying it, because the for-loop depends on the origin array.

            for (let mapping of levelSourceIndexMappings) {
                debug.assert(mapping.originalSourceIndex < originalLevelSources.length,
                    'pre-condition: The value in every mapping in the specified levelSourceIndicesReorderingMap must be a valid index to the specified hierarchyLevel.sources array property');

                transformingHierarchyLevel.sources[mapping.newSourceIndex] = originalLevelSources[mapping.originalSourceIndex];
            }

            return transformingHierarchyLevel;
        }

        /**
         * Reorders the elements in levelValues in each node under transformingHierarchyRootNode at the specified hierarchyLevel,
         * and updates their DataViewMatrixGroupValue.levelSourceIndex property.
         *
         * Returns the same object as the specified transformingHierarchyRootNode.
         */
        function reorderMatrixHierarchyLevelValues(
            transformingHierarchyRootNode: DataViewMatrixNode,
            transformingHierarchyLevelIndex: number,
            levelSourceIndexMappings: SourceIndexMappingEntry[]): DataViewMatrixNode {
            debug.assertValue(transformingHierarchyRootNode, 'transformingHierarchyRootNode');
            debug.assertNonEmpty(levelSourceIndexMappings, 'levelSourceIndexMappings');
            debug.assert(levelSourceIndexMappings.length === _.uniq(levelSourceIndexMappings, (mapping) => mapping.originalSourceIndex).length,
                'levelSourceIndexMappings must not contain duplicate originalSourceIndex');

            let mappingsByOriginalLevelSourceIndex: INumberDictionary<SourceIndexMappingEntry> =
                _.reduce(
                    levelSourceIndexMappings,
                    (mappingsByOriginalLevelSourceIndex, value) => {
                        mappingsByOriginalLevelSourceIndex[value.originalSourceIndex] = value;
                        return mappingsByOriginalLevelSourceIndex;
                    },
                    <INumberDictionary<SourceIndexMappingEntry>>{}
                );

            DataViewMatrixUtils.forEachNodeAtLevel(transformingHierarchyRootNode, transformingHierarchyLevelIndex, (transformingMatrixNode: DataViewMatrixNode) => {
                let originalLevelValues = transformingMatrixNode.levelValues;

                // Note: Technically this function is incomplete, and cannot be until DataViewProjectionOrdering can express select indices per composite group (as opposed to per role).
                // The driving source of the new LevelValues should be the "projection for this composite group", a concept that isn't yet implemented in DataViewProjectionOrdering.
                // The following code isn't correct in the special case where a column is projected twice in this composite group,
                // in which case the DSR will not have the duplicate columns; DataViewTransform is supposed to expand the duplicates.
                // Until we fully implement composite group projection, though, we'll just sort what we have in transformingMatrixNode.levelValues.

                if (!_.isEmpty(originalLevelValues)) {
                    debug.assert(_.every(originalLevelValues, (levelValue) => !!mappingsByOriginalLevelSourceIndex[levelValue.levelSourceIndex]),
                        'Invalid levelSourceIndexMappings or transformingHierarchyRootNode: levelSourceIndexMappings should contain an entry for every levelSourceIndex in the matrix hierarchy.');

                    // First, re-order the elements in transformingMatrixNode.levelValues by the new levelSourceIndex order.
                    // _.sortBy() also creates a new array, which we want to do for all nodes (including when levelValues.length === 1)
                    // because we don't want to accidentally modify the array AND its value references in Query DataView
                    let newlyOrderedLevelValues = _.sortBy(originalLevelValues, levelValue => {
                        let mapping = mappingsByOriginalLevelSourceIndex[levelValue.levelSourceIndex];
                        return mapping && mapping.newSourceIndex;
                    });

                    for (let i = 0, ilen = newlyOrderedLevelValues.length; i < ilen; i++) {
                        let transformingLevelValue = inheritSingle(newlyOrderedLevelValues[i]);
                        let mapping = mappingsByOriginalLevelSourceIndex[transformingLevelValue.levelSourceIndex];
                        transformingLevelValue.levelSourceIndex = mapping && mapping.newSourceIndex;
                        newlyOrderedLevelValues[i] = transformingLevelValue;
                    }

                    transformingMatrixNode.levelValues = newlyOrderedLevelValues;

                    // For consistency with how DataViewTreeNode.value works, and for a bit of backward compatibility,
                    // copy the last value from DataViewMatrixNode.levelValues to DataViewMatrixNode.value.
                    let newlyOrderedLastLevelValue = _.last(newlyOrderedLevelValues);
                    if (transformingMatrixNode.value !== newlyOrderedLastLevelValue.value) {
                        transformingMatrixNode.value = newlyOrderedLastLevelValue.value;
                    }
                    if ((transformingMatrixNode.levelSourceIndex || 0) !== newlyOrderedLastLevelValue.levelSourceIndex) {
                        transformingMatrixNode.levelSourceIndex = newlyOrderedLastLevelValue.levelSourceIndex;
                    }
                }
            });

            return transformingHierarchyRootNode;
        }
    }

    module DataViewMatrixMeasureHeaders {
        /**
         * Inherits and updates the measure headers properties in the column hierarchy to match the specified newValueSources.  
         */
        export function update(
            prototypeColumnHierarchy: DataViewHierarchy,
            newValueSources: DataViewMetadataColumn[]): DataViewHierarchy {
            debug.assertValue(prototypeColumnHierarchy, 'prototypeColumnHierarchy');
            debug.assertValue(newValueSources, 'newValueSources');

            let prototypeColumnHierarchyLevels: DataViewHierarchyLevel[] = prototypeColumnHierarchy.levels;

            let hasExistingMeasureHeaders = hasMeasureHeadersLevel(prototypeColumnHierarchyLevels);

            let hasDynamicColumnGroupLevel = hasExistingMeasureHeaders ?
                _.size(prototypeColumnHierarchyLevels) >= 2 :
                _.size(prototypeColumnHierarchyLevels) >= 1;

            let isMeasureHeadersLevelNeeded = hasDynamicColumnGroupLevel ?
                newValueSources.length >= 2 :
                newValueSources.length >= 1;

            let columnHierarchy: DataViewHierarchy;

            if (hasExistingMeasureHeaders) {
                if (isMeasureHeadersLevelNeeded) {
                    columnHierarchy = updateExistingMeasureHeaders(prototypeColumnHierarchy, newValueSources);
                } else { // if measure headers no longer needed
                    columnHierarchy = removeMeasureHeaders(prototypeColumnHierarchy);
                }
            } else { // !hasExistingMeasureHeaders
                if (isMeasureHeadersLevelNeeded) {
                    columnHierarchy = addMeasureHeaders(prototypeColumnHierarchy, newValueSources);
                } else { // no existing measure headers level, and still does not need one
                    columnHierarchy = prototypeColumnHierarchy;
                }
            }

            return columnHierarchy;
        }

        function hasMeasureHeadersLevel(columnHierarchyLevels: DataViewHierarchyLevel[]): boolean {
            debug.assertAnyValue(columnHierarchyLevels, 'columnHierarchyLevels');

            return !_.isEmpty(columnHierarchyLevels) &&
                _.every(_.last(columnHierarchyLevels).sources, (leafLevelSource) => leafLevelSource.isMeasure);
        }

        function updateExistingMeasureHeaders(
            prototypeColumnHierarchy: DataViewHierarchy,
            newValueSources: DataViewMetadataColumn[]): DataViewHierarchy {
            debug.assert(prototypeColumnHierarchy && hasMeasureHeadersLevel(prototypeColumnHierarchy.levels), 'prototypeColumnHierarchy && hasExistingMeasureHeadersLevel(prototypeColumnHierarchy.levels)');
            debug.assertValue(newValueSources, 'newValueSources');

            // create inherited objects under columnHierarchy.levels for updating:
            let columnHierarchy = inheritSingle(prototypeColumnHierarchy);
            let columnHierarchyLevels = 
                columnHierarchy.levels = 
                inheritSingle(columnHierarchy.levels);

            let measureHeaderLevelIndex = columnHierarchyLevels.length - 1;
            let measureHeadersLevel =
                columnHierarchyLevels[measureHeaderLevelIndex] = 
                inheritSingle(columnHierarchyLevels[measureHeaderLevelIndex]);

            // update the column sources under columnHierarchy.levels:
            measureHeadersLevel.sources = newValueSources;

            // create inherited objects under columnHierarchy.root for updating:
            columnHierarchy.root = DataViewMatrixUtils.
                inheritMatrixNodeHierarchy(columnHierarchy.root, measureHeaderLevelIndex, /* useInheritSingle */ true);
            
            // update the measure header nodes under columnHierarchy.root:
            DataViewMatrixUtils.forEachNodeDepthFirst(
                columnHierarchy.root,
                (node: DataViewMatrixNode) => {
                    if (isParentOfMeasureHeaders(node, measureHeaderLevelIndex)) {
                        node.children = createMeasureHeaderNodes(measureHeaderLevelIndex, newValueSources.length, node.isSubtotal);
                        return DataViewMatrixUtils.DepthFirstTraversalCallbackResult.skipDescendantNodes;
                    } else {
                        return DataViewMatrixUtils.DepthFirstTraversalCallbackResult.continueToChildNodes;
                    }
                });

            return columnHierarchy;
        }

        function removeMeasureHeaders(prototypeColumnHierarchy: DataViewHierarchy): DataViewHierarchy {
            debug.assert(prototypeColumnHierarchy && hasMeasureHeadersLevel(prototypeColumnHierarchy.levels), 'prototypeColumnHierarchy && hasExistingMeasureHeadersLevel(prototypeColumnHierarchy.levels)');

            // create inherited objects under columnHierarchy.levels for updating:
            let columnHierarchy = inheritSingle(prototypeColumnHierarchy);
            let columnHierarchyLevels = 
                columnHierarchy.levels = 
                inheritSingle(columnHierarchy.levels);

            let measureHeaderLevelIndex = columnHierarchyLevels.length - 1;

            // remove the hierarch level under columnHierarchy.levels:
            columnHierarchyLevels.splice(measureHeaderLevelIndex, 1);

            // create inherited objects under columnHierarchy.root for updating:
            columnHierarchy.root = DataViewMatrixUtils.
                inheritMatrixNodeHierarchy(columnHierarchy.root, measureHeaderLevelIndex, /* useInheritSingle */ true);

            // remove the measure header nodes under columnHierarchy.root:
            DataViewMatrixUtils.forEachNodeDepthFirst(
                columnHierarchy.root,
                (node: DataViewMatrixNode) => {
                    if (isParentOfMeasureHeaders(node, measureHeaderLevelIndex)) {
                        node.children = undefined;
                        return DataViewMatrixUtils.DepthFirstTraversalCallbackResult.skipDescendantNodes;
                    } else {
                        return DataViewMatrixUtils.DepthFirstTraversalCallbackResult.continueToChildNodes;
                    }
                });

            return columnHierarchy;
        }

        function addMeasureHeaders(
            prototypeColumnHierarchy: DataViewHierarchy,
            newValueSources: DataViewMetadataColumn[]): DataViewHierarchy {
            debug.assert(prototypeColumnHierarchy && !hasMeasureHeadersLevel(prototypeColumnHierarchy.levels), 'prototypeColumnHierarchy && !hasExistingMeasureHeadersLevel(prototypeColumnHierarchy.levels)');
            debug.assertValue(newValueSources, 'newValueSources');

            // create inherited objects under columnHierarchy.levels for updating:
            let columnHierarchy = inheritSingle(prototypeColumnHierarchy);
            let columnHierarchyLevels = 
                columnHierarchy.levels = 
                inheritSingle(columnHierarchy.levels);

            // add a new level under columnHierarchy.levels:
            let measureHeaderLevel: DataViewHierarchyLevel = {
                sources: newValueSources,
            };
            columnHierarchyLevels.push(measureHeaderLevel);
            let measureHeaderLevelIndex = columnHierarchyLevels.length - 1;

            // create inherited objects under columnHierarchy.root for updating:
            columnHierarchy.root = DataViewMatrixUtils.
                inheritMatrixNodeHierarchy(columnHierarchy.root, measureHeaderLevelIndex, /* useInheritSingle */ true);

            // add measure header nodes under columnHierarchy.root:
            DataViewMatrixUtils.forEachNodeDepthFirst(
                columnHierarchy.root,
                (node: DataViewMatrixNode) => {
                    if (DataViewMatrixUtils.isLeafNode(node)) {
                        node.children = createMeasureHeaderNodes(measureHeaderLevelIndex, newValueSources.length, node.isSubtotal);
                        return DataViewMatrixUtils.DepthFirstTraversalCallbackResult.skipDescendantNodes;
                    } else {
                        return DataViewMatrixUtils.DepthFirstTraversalCallbackResult.continueToChildNodes;
                    }
                });

            return columnHierarchy;
        }

        function isParentOfMeasureHeaders(node: DataViewMatrixNode, measureHeadersLevelIndex: number): boolean {
            debug.assert(node && _.every(node.children, (childNode) => childNode.level === node.children[0].level), 'node must be defined and all of its child nodes must have the same level value.');
            debug.assertValue(measureHeadersLevelIndex, 'measureHeadersLevelIndex');

            // Note related to VSTS 7426900: In a matrix with 3+ levels in column hierarchy and 2+ measure fields,
            // under the grand total branch of the hierarchy tree, the parent node at level 0 will have
            // direct child nodes with level > 1.  Hence, for locating the parent node of measure headers, 
            // this code cannot simply check node.level === measureHeadersLevelIndex - 1.

            let childNodes = node.children;
            return !_.isEmpty(childNodes) &&
                childNodes[0].level === measureHeadersLevelIndex; 
        }

        function createMeasureHeaderNodes(level: number, measureFieldCount: number, isSubtotal: boolean): DataViewMatrixNode[] {
            let measureHeaderNodes: DataViewMatrixNode[] = [];

            for (let i = 0, ilen = measureFieldCount; i < ilen; i++) {
                let measureHeaderNode: DataViewMatrixNode = {
                    level: level,
                };

                if (i > 0) {
                    measureHeaderNode.levelSourceIndex = i;
                }

                if (isSubtotal) {
                    measureHeaderNode.isSubtotal = true;
                }

                measureHeaderNodes.push(measureHeaderNode);
            }

            return measureHeaderNodes;
        }
    }
}