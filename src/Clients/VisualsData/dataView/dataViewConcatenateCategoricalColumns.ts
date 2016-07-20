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
    import inherit = Prototype.inherit;
    import inheritSingle = Prototype.inheritSingle;
    import valueFormatter = powerbi.visuals.valueFormatter;

    export module DataViewConcatenateCategoricalColumns {

        /* Represents a collection of DataViewCategoryColumn that are tied to the same role. */
        interface CategoryColumnsByRole {
            /* The name of the role shared by all the objects in the categories property. */
            roleName: string;

            /**
             * The list of columns that are tied to roleName, in the same order as they appear
             * in the categories property of their owner DataViewCategorical object.
             */
            categories: DataViewCategoryColumn[];
        }

        export function detectAndApply(
            dataView: DataView,
            objectDescriptors: DataViewObjectDescriptors,
            applicableRoleMappings: DataViewMapping[],
            projectionOrdering: DataViewProjectionOrdering,
            projectionActiveItems: DataViewProjectionActiveItems): DataView {
            debug.assertValue(dataView, 'dataView');
            debug.assertAnyValue(objectDescriptors, 'objectDescriptors');
            debug.assertAnyValue(applicableRoleMappings, 'applicableRoleMappings');
            debug.assertAnyValue(projectionOrdering, 'projectionOrdering');
            debug.assertAnyValue(projectionActiveItems, 'projectionActiveItems');

            let result = dataView;
            let dataViewCategorical: DataViewCategorical = dataView.categorical;

            if (dataViewCategorical) {
                let concatenationSource: CategoryColumnsByRole = detectCategoricalRoleForHierarchicalGroup(dataViewCategorical, applicableRoleMappings);

                if (concatenationSource) {
                    // Consider: Perhaps the re-ordering of categorical columns should happen in the function transformSelects(...) of dataViewTransform?
                    let columnsSortedByProjectionOrdering = sortColumnsByProjectionOrdering(projectionOrdering, concatenationSource.roleName, concatenationSource.categories);
                    if (columnsSortedByProjectionOrdering.length >= 2) {
                        let activeItemsToIgnoreInConcatenation =
                            _.chain(projectionActiveItems && projectionActiveItems[concatenationSource.roleName])
                                .filter((activeItemInfo: DataViewProjectionActiveItemInfo) => activeItemInfo.suppressConcat)
                                .map((activeItemInfo: DataViewProjectionActiveItemInfo) => activeItemInfo.queryRef)
                                .value();

                        result = applyConcatenation(dataView, objectDescriptors, concatenationSource.roleName, columnsSortedByProjectionOrdering, activeItemsToIgnoreInConcatenation);
                    }
                }
            }

            return result;
        }

        /** For applying concatenation to the DataViewCategorical that is the data for one of the frames in a play chart. */
        export function applyToPlayChartCategorical(
            metadata: DataViewMetadata,
            objectDescriptors: DataViewObjectDescriptors,
            categoryRoleName: string,
            categorical: DataViewCategorical): DataView {
            debug.assertValue(metadata, 'metadata');
            debug.assertAnyValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(categorical, 'categorical');

            let result: DataView;
            if (!_.isEmpty(categorical.categories) && categorical.categories.length >= 2) {
                // In PlayChart, the code converts the Visual DataView with a matrix into multiple Visual DataViews, each with a categorical.
                // metadata and metadata.columns could already be inherited objects as they come from the Visual DataView with a matrix.
                // To guarantee that this method does not have any side effect on prototypeMetadata (which might already be an inherited obj),
                // use inherit() rather than inheritSingle() here.
                let transformingColumns = inherit(metadata.columns);
                let transformingMetadata = inherit(metadata, m => { m.columns = transformingColumns; });

                let transformingDataView = { metadata: transformingMetadata, categorical: categorical };
                result = applyConcatenation(transformingDataView, objectDescriptors, categoryRoleName, categorical.categories, []);
            }
            else {
                result = { metadata: metadata, categorical: categorical };
            }

            return result;
        }

        /**
         * Returns the role and its assocated category columns (from dataViewCategorical.categories)
         * that should be concatenated for the case of hierarchical group.
         *
         * Note: In the future if we support sibling hierarchical groups in categorical,
         * change the return type to CategoryColumnsByRole[] and update detection logic.
         */
        function detectCategoricalRoleForHierarchicalGroup(dataViewCategorical: DataViewCategorical, applicableRoleMappings: DataViewMapping[]): CategoryColumnsByRole {
            debug.assertValue(dataViewCategorical, 'dataViewCategorical');
            debug.assertAnyValue(applicableRoleMappings, 'applicableRoleMappings');

            let result: CategoryColumnsByRole;

            // The following code will choose a role name only if all applicableRoleMappings share the same role for Categorical Category and
            // that role has a { max: 1 } restriction in visual capabilities role mapping conditions.
            // Handling multiple applicableRoleMappings is necessary for TransformActions with splits, which can happen in scenarios such as:
            // 1. combo chart with a field for both Line and Column values, and
            // 2. chart with regression line enabled.
            // In case 1, you can pretty much get exactly the one from applicableRoleMappings for which this code is currently processing for,
            // by looking at the index of the current split in DataViewTransformActions.splits.
            // In case 2, however, applicableRoleMappings.length will be different than DataViewTransformActions.splits.length, hence it is
            // not straight forward to figure out for which one in applicableRoleMappings is this code currently processing.
            // SO... This code will just choose the category role name if it is consistent across all applicableRoleMappings.

            let isEveryRoleMappingForCategorical = !_.isEmpty(applicableRoleMappings) &&
                _.every(applicableRoleMappings, (roleMapping) => !!roleMapping.categorical);

            if (isEveryRoleMappingForCategorical) {
                let targetRoleName = getSingleCategoryRoleNameInEveryRoleMapping(applicableRoleMappings);
                if (targetRoleName &&
                    isVisualExpectingMaxOneCategoryColumn(targetRoleName, applicableRoleMappings)) { // the { max: 1 } check on category role

                    let categoryColumnsForTargetRole: DataViewCategoryColumn[] = _.filter(
                        dataViewCategorical.categories,
                        (categoryColumn: DataViewCategoryColumn) => categoryColumn.source.roles && !!categoryColumn.source.roles[targetRoleName]);

                    // There is no need to concatenate columns unless there is actually more than one column
                    if (categoryColumnsForTargetRole.length >= 2) {
                        // At least for now, we expect all category columns for the same role to have the same number of value entries.
                        // If that's not the case, we won't run the concatenate logic for that role at all...
                        let areValuesCountsEqual: boolean = _.every(
                            categoryColumnsForTargetRole,
                            (categoryColumn: DataViewCategoryColumn) => categoryColumn.values.length === categoryColumnsForTargetRole[0].values.length);
                        
                        if (areValuesCountsEqual) {
                            result = {
                                roleName: targetRoleName,
                                categories: categoryColumnsForTargetRole,
                            };
                        }
                    }
                }
            }
            return result;
        }

        /** If all mappings in the specified roleMappings have the same single role name for their categorical category roles, return that role name, else returns undefined. */
        function getSingleCategoryRoleNameInEveryRoleMapping(categoricalRoleMappings: DataViewMapping[]): string {
            debug.assertNonEmpty(categoricalRoleMappings, 'categoricalRoleMappings');
            debug.assert(_.every(categoricalRoleMappings, (roleMapping) => !!roleMapping.categorical), 'All mappings in categoricalRoleMappings must contain a DataViewCategoricalMapping');

            let result: string;

            // With "list" in role mapping, it is possible to have multiple role names for category.
            // For now, proceed to concatenate category columns only when categories are bound to 1 Role.
            // We can change this if we want to support independent (sibling) group hierarchies in categorical.
            let uniqueCategoryRoles: string[] = _.chain(categoricalRoleMappings)
                .map((roleMapping) => {
                    let categoryRoles = getAllRolesInCategories(roleMapping.categorical);
                    return categoryRoles.length === 1 ? categoryRoles[0] : undefined;
                })
                .uniq() // Note: _.uniq() does not treat two arrays with same elements as equal
                .value();
            
            let isSameCategoryRoleNameInAllRoleMappings = uniqueCategoryRoles.length === 1 && uniqueCategoryRoles[0] !== undefined;
            if (isSameCategoryRoleNameInAllRoleMappings) {
                result = uniqueCategoryRoles[0];
            }

            return result;
        }

        /**
         * Returns true if every one of specified roleMappings has non-empty 'conditions', and that every one of their conditions
         * has a { max: 1 } restriction for the specified categoricalRoleName.
        */
        function isVisualExpectingMaxOneCategoryColumn(categoricalRoleName: string, roleMappings: DataViewMapping[]): boolean {
            debug.assertValue(categoricalRoleName, 'categoricalRoleName');
            debug.assertNonEmpty(roleMappings, 'roleMappings');

            let isVisualExpectingMaxOneCategoryColumn = _.every(
                roleMappings,
                (roleMapping) => {
                    return !_.isEmpty(roleMapping.conditions) &&
                        _.every(roleMapping.conditions, condition => condition[categoricalRoleName] && condition[categoricalRoleName].max === 1);
                });

            return isVisualExpectingMaxOneCategoryColumn;
        }

        /**
         * Returns the array of role names that are mapped to categorical categories.
         * Returns an empty array if none exists.
         */
        function getAllRolesInCategories(categoricalRoleMapping: DataViewCategoricalMapping): string[] {
            debug.assertValue(categoricalRoleMapping, 'categoricalRoleMapping');

            let roleNames: string[] = [];
            DataViewMapping.visitCategoricalCategories(
                categoricalRoleMapping.categories,
                {
                    visitRole: (roleName: string) => {
                        roleNames.push(roleName);
                    }
                });

            return roleNames;
        }

        function applyConcatenation(dataView: DataView, objectDescriptors: DataViewObjectDescriptors, roleName: string, columnsSortedByProjectionOrdering: DataViewCategoryColumn[], queryRefsToIgnore: string[]): DataView {
            debug.assert(dataView && dataView.categorical && _.size(dataView.categorical.categories) >= 1, 'dataView && dataView.categorical && _.size(dataView.categorical.categories) >= 1');
            debug.assertAnyValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(roleName, 'roleName');
            debug.assert(columnsSortedByProjectionOrdering && columnsSortedByProjectionOrdering.length >= 2, 'columnsSortedByProjectionOrdering && columnsSortedByProjectionOrdering.length >= 2');
            debug.assert(_.every(columnsSortedByProjectionOrdering, (column) => _.contains(dataView.categorical.categories, column)), 'every column in columnsSortedByProjectionOrdering should exist in dataView.categorical.categories');

            let formatStringPropId: DataViewObjectPropertyIdentifier = DataViewObjectDescriptors.findFormatString(objectDescriptors);
            let concatenatedValues: string[] = concatenateValues(columnsSortedByProjectionOrdering, queryRefsToIgnore, formatStringPropId);

            let columnsSourceSortedByProjectionOrdering = _.map(columnsSortedByProjectionOrdering, categoryColumn => categoryColumn.source);
            let concatenatedColumnMetadata: DataViewMetadataColumn = createConcatenatedColumnMetadata(roleName, columnsSourceSortedByProjectionOrdering, queryRefsToIgnore);
            let transformedDataView = inheritSingle(dataView);
            addToMetadata(transformedDataView, concatenatedColumnMetadata);

            let dataViewCategorical: DataViewCategorical = dataView.categorical;

            // It is correct to take the objects from the first column as it is the one that is being set by DataViewTransform.findSelectedCategoricalColumn(...)
            let dataViewObjects = dataViewCategorical.categories[0].objects;

            let concatenatedCategoryColumn: DataViewCategoryColumn = createConcatenatedCategoryColumn(
                columnsSortedByProjectionOrdering,
                concatenatedColumnMetadata,
                concatenatedValues,
                dataViewObjects);

            let transformedCategoricalCategories: DataViewCategoryColumn[] = _.difference(dataViewCategorical.categories, columnsSortedByProjectionOrdering);
            transformedCategoricalCategories.push(concatenatedCategoryColumn);

            let transformedCategorical: DataViewCategorical = inheritSingle(dataViewCategorical);
            transformedCategorical.categories = transformedCategoricalCategories;
            transformedDataView.categorical = transformedCategorical;

            return transformedDataView;
        }

        function concatenateValues(columnsSortedByProjectionOrdering: DataViewCategoryColumn[], queryRefsToIgnore: string[], formatStringPropId: DataViewObjectPropertyIdentifier): string[] {
            debug.assertValue(columnsSortedByProjectionOrdering, 'columnsSortedByProjectionOrdering');
            debug.assertAnyValue(queryRefsToIgnore, 'queryRefsToIgnore');
            debug.assertAnyValue(formatStringPropId, 'formatStringPropId');

            let concatenatedValues: string[] = [];

            // concatenate the values in dataViewCategorical.categories[0..length-1].values[j], and store it in combinedValues[j]
            for (let categoryColumn of columnsSortedByProjectionOrdering) {
                let formatString = valueFormatter.getFormatString(categoryColumn.source, formatStringPropId);

                for (let i = 0, len = categoryColumn.values.length; i < len; i++) {
                    if (!_.contains(queryRefsToIgnore, categoryColumn.source.queryName)) {
                        let value = categoryColumn.values && categoryColumn.values[i];
                        let formattedValue = valueFormatter.format(value, formatString);
                        concatenatedValues[i] = (concatenatedValues[i] === undefined) ? formattedValue : (formattedValue + ' ' + concatenatedValues[i]);
                    }
                }
            }

            return concatenatedValues;
        }

        /**
        * Returns a new array of elements from columns as they are ordered for the specified roleName in the specified projectionOrdering.
        */
        function sortColumnsByProjectionOrdering(projectionOrdering: DataViewProjectionOrdering, roleName: string, columns: DataViewCategoryColumn[]): DataViewCategoryColumn[] {
            debug.assertAnyValue(projectionOrdering, 'projectionOrdering');
            debug.assertValue(roleName, 'roleName');
            debug.assertValue(columns, 'columns');

            let columnsInProjectionOrdering: DataViewCategoryColumn[];

            if (projectionOrdering) {
                // the numeric values in projectionOrdering correspond to the index property of DataViewMetadataColumn
                let columnsByIndex: { [index: number]: DataViewCategoricalColumn } = {};
                for (let column of columns) {
                    if (column.source.roles[roleName]) {
                        debug.assert(!columnsByIndex[column.source.index], 'The specified columns should not contain multiple columns with same index: ' + column.source.index);
                        columnsByIndex[column.source.index] = column;
                    }
                }

                let columnIndicesInProjectionOrdering: number[] = projectionOrdering[roleName];

                columnsInProjectionOrdering = _.chain(columnIndicesInProjectionOrdering)
                    .map(columnIndex => columnsByIndex[columnIndex])
                    .filter((column: DataViewCategoricalColumn) => !!column)
                    .value();
            }
            else {
                // If projectionOrder is unspecified, just return the columns for the specified role in their current order
                columnsInProjectionOrdering = _.filter(columns, column => column.source.roles[roleName]);
            }

            return columnsInProjectionOrdering;
        }

        /**
         * Creates the column metadata that will back the column with the concatenated values. 
         */
        function createConcatenatedColumnMetadata(roleName: string, sourceColumnsSortedByProjectionOrdering: DataViewMetadataColumn[], queryRefsToIgnore?: string[]): DataViewMetadataColumn {
            debug.assertValue(roleName, 'roleName');
            debug.assertNonEmpty(sourceColumnsSortedByProjectionOrdering, 'sourceColumnsSortedByProjectionOrdering');
            debug.assert(_.chain(sourceColumnsSortedByProjectionOrdering).map(c => c.isMeasure).uniq().value().length === 1, 'pre-condition: caller code should not attempt to combine a mix of measure columns and non-measure columns');

            let concatenatedDisplayName: string;

            for (let columnSource of sourceColumnsSortedByProjectionOrdering) {
                if (!_.contains(queryRefsToIgnore, columnSource.queryName)) {
                    concatenatedDisplayName = (concatenatedDisplayName == null) ? columnSource.displayName : (columnSource.displayName + ' ' + concatenatedDisplayName);
                }
            }

            let newRoles: { [name: string]: boolean } = {};
            newRoles[roleName] = true;

            let newColumnMetadata: DataViewMetadataColumn = {
                displayName: concatenatedDisplayName,
                roles: newRoles,
                type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
            };

            let columnSourceForCurrentDrillLevel = _.last(sourceColumnsSortedByProjectionOrdering);
            if (columnSourceForCurrentDrillLevel.isMeasure !== undefined) {
                newColumnMetadata.isMeasure = columnSourceForCurrentDrillLevel.isMeasure;
            }

            // TODO VSTS 6842046: Investigate whether we should change that property to mandatory or change the Chart visual code.
            // If queryName is not set at all, the column chart visual will only render column for the first group instance.
            // If queryName is set to any string other than columnForCurrentDrillLevel.source.queryName, then drilldown by group instance is broken (VSTS 6847879).
            newColumnMetadata.queryName = columnSourceForCurrentDrillLevel.queryName;

            return newColumnMetadata;
        }

        function addToMetadata(transformedDataView: DataView, newColumn: DataViewMetadataColumn): void {
            debug.assertValue(transformedDataView, 'transformedDataView');
            debug.assertValue(newColumn, 'newColumn');

            let transformedColumns = inheritSingle(transformedDataView.metadata.columns);
            transformedColumns.push(newColumn);

            let transformedMetadata = inheritSingle(transformedDataView.metadata);
            transformedMetadata.columns = transformedColumns;

            transformedDataView.metadata = transformedMetadata;
        }

        function createConcatenatedCategoryColumn(
            sourceColumnsSortedByProjectionOrdering: DataViewCategoryColumn[],
            columnMetadata: DataViewMetadataColumn,
            concatenatedValues: string[],
            dataViewObjects: DataViewObjects[]): DataViewCategoryColumn {
            debug.assert(sourceColumnsSortedByProjectionOrdering && sourceColumnsSortedByProjectionOrdering.length >= 2, 'sourceColumnsSortedByProjectionOrdering && sourceColumnsSortedByProjectionOrdering.length >= 2');
            debug.assertValue(columnMetadata, 'columnMetadata');
            debug.assertValue(concatenatedValues, 'concatenatedValues');
            debug.assertAnyValue(dataViewObjects, 'dataViewObjects');

            let newCategoryColumn: DataViewCategoryColumn = {
                source: columnMetadata,
                values: concatenatedValues
            };

            // We expect every DataViewCategoryColumn in concatenationSourceColumns to have the same set of identities, always.
            // So, we'll just take the identities and identityFields from the first column
            let firstColumn = sourceColumnsSortedByProjectionOrdering[0];

            if (firstColumn.identity) {
                newCategoryColumn.identity = firstColumn.identity;
            }

            if (firstColumn.identityFields) {
                newCategoryColumn.identityFields = firstColumn.identityFields;
            }

            if (dataViewObjects) {
                newCategoryColumn.objects = dataViewObjects;
            }

            return newCategoryColumn;
        }
    }
}