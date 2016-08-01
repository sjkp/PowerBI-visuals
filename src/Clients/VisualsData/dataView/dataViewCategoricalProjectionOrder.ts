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
    import DataViewMetadataColumnUtils = powerbi.data.DataViewMetadataColumnUtils;
    import inheritSingle = Prototype.inheritSingle;
    import INumberDictionary = jsCommon.INumberDictionary;

    /**
     * Responsible for applying projection order and split selects to DataViewCategorical.
     * If the specified prototype DataView needs to get transformed, the transformed DataView will be returned.
     * Else, the prototype DataView itself will be returned.
     */
    export module DataViewCategoricalProjectionOrder {
        export function apply(prototype: DataView, applicableRoleMappings: DataViewMapping[], projectionOrdering: DataViewProjectionOrdering, splitSelects: INumberDictionary<boolean>): DataView {
            debug.assertValue(prototype, 'prototype');
            debug.assertAnyValue(applicableRoleMappings, 'applicableRoleMappings');
            debug.assertAnyValue(projectionOrdering, 'projectionOrdering');
            debug.assertAnyValue(splitSelects, 'splitSelects');
           
            let transformedDataView: DataView;
            
            let categoricalRoleMappingsWithoutRegression: DataViewCategoricalMapping[] =
                _.chain(applicableRoleMappings)
                    .filter((mapping) => mapping.categorical && !DataViewMapping.getRegressionUsage(mapping))
                    .map((mapping) => mapping.categorical)
                    .value();

            if (prototype.categorical && categoricalRoleMappingsWithoutRegression.length >= 1) {
                let prototypeCategorical = prototype.categorical;

                // Apply projection order and split selects to categories.
                let transformedCategorical = applyToCategories(prototypeCategorical, categoricalRoleMappingsWithoutRegression, projectionOrdering, splitSelects);

                // Apply split selects to series and measures.
                transformedCategorical = applyToSeriesAndMeasures(
                    transformedCategorical || prototypeCategorical,
                    splitSelects);

                // Finally, if the categorical has been transformed, create an inherited dataView:
                if (transformedCategorical) {
                    transformedDataView = inheritSingle(prototype);
                    transformedDataView.categorical = transformedCategorical;
                }
            }

            return transformedDataView || prototype;
        }

        /**
         * Returns the combined projection ordering of the specified roles, filtered by splitSelects if specified.
         * Returns empty array if the columns for all category columns should get removed. 
         * Returns undefined if projection order cannot be computed.
         */
        function combineProjectionOrderAndSplitSelects(
            roles: string[],
            projectionOrdering: DataViewProjectionOrdering,
            splitSelects: INumberDictionary<boolean>): number[] {

            debug.assertValue(roles, 'roles');
            debug.assertAnyValue(projectionOrdering, 'projectionOrdering');
            debug.assertAnyValue(splitSelects, 'splitSelects');

            // If projectionOrdering is undefined, do not apply it.
            // But if projectionOrdering for roles is an empty array, this module should make sure nothing gets projected (by returning empty projection order).
            if (!projectionOrdering)
                return;

            let combinedProjectionOrder: number[] = _.reduce(
                roles,
                (combinedProjectionOrder, nextRole) => {
                    let projectionOrderOfNextRole: number[] = _.filter(projectionOrdering[nextRole], (selectIndex) => (!splitSelects || splitSelects[selectIndex]));
                    combinedProjectionOrder.push(...projectionOrderOfNextRole);

                    return combinedProjectionOrder;
                },
                <number[]>[]);

            return combinedProjectionOrder;
        }

        /**
         * If the specified prototypeCategorical.categories is not consistent with projectionOrder and splitSelects, apply them and return the result.
         * Else, returns undefined.
         */
        function applyToCategories(
            prototypeCategorical: DataViewCategorical,
            categoricalRoleMappingsWithoutRegression: DataViewCategoricalMapping[],
            projectionOrdering: DataViewProjectionOrdering,
            splitSelects: INumberDictionary<boolean>): DataViewCategorical {

            debug.assertValue(prototypeCategorical, 'prototypeCategorical');
            debug.assertValue(categoricalRoleMappingsWithoutRegression, 'categoricalRoleMappingsWithoutRegression');
            debug.assert(_.every(categoricalRoleMappingsWithoutRegression, (roleMapping) => !!roleMapping), 'categoricalRoleMappingsWithoutRegression must not contain falsy elements');
            debug.assertAnyValue(projectionOrdering, 'projectionOrdering');
            debug.assertAnyValue(splitSelects, 'splitSelects');

            if (!_.isEmpty(prototypeCategorical.categories)) {
                let categoryRoles = DataViewMapping.getRolesIfSameInAllCategoricalMappings(
                    categoricalRoleMappingsWithoutRegression,
                    DataViewMapping.getAllRolesInCategories);

                // if all applicable categorical role mappings have the same roles for categories (even if empty array)...
                if (categoryRoles) {
                    let projectionOrderFilteredBySplit = combineProjectionOrderAndSplitSelects(
                        categoryRoles,
                        projectionOrdering,
                        splitSelects);

                    // apply projectionOrderFilteredBySplit as long as it is defined, even if it is empty array
                    if (projectionOrderFilteredBySplit) {
                        return applyProjectionOrderToCategories(prototypeCategorical, projectionOrderFilteredBySplit, categoryRoles);
                    }
                }
            }
        }

        /**
         * If the specified prototypeCategorical.categories is not consistent with projectionOrder, apply projectionOrder and return the result.
         * Else, returns undefined.
         */
        function applyProjectionOrderToCategories(prototypeCategorical: DataViewCategorical, projectionOrder: number[], categoryRoles: string[]): DataViewCategorical {
            debug.assertValue(prototypeCategorical, 'prototypeCategorical');
            debug.assertValue(projectionOrder, 'projectionOrder');
            debug.assertValue(categoryRoles, 'categoryRoles');

            let prototypeCategories = prototypeCategorical.categories;

            if (_.isEmpty(prototypeCategories)) {
                debug.assert(_.isEmpty(projectionOrder), 'If DataViewCategory.categories is empty but projectionOrder of primary axis is non-empty, then something went wrong when projectionOrder was getting deserialized or reconstructed.  If projectionOrder for primary axis is truly non-empty, then the DSR and DataView should have some data there.');
                return;
            }

            if (isSelectIndexOrderEqual(prototypeCategories, projectionOrder))
                return;

            let originalMetadataColumns = _.map(prototypeCategories, (category) => category.source);
            let originalColumnInfos = DataViewMetadataColumnUtils.leftJoinMetadataColumnsAndProjectionOrder(
                originalMetadataColumns,
                projectionOrder,
                categoryRoles
            );

            // filter out the non-projected columns and sort the remaining ones by projection order:
            let projectionTargetColumnInfos = _.chain(originalColumnInfos)
                .filter((columnInfo) => columnInfo.projectionOrderIndex !== undefined)
                .sortBy((columnInfo) => columnInfo.projectionOrderIndex)
                .value();

            // construct a new array of category columns from the projection target array
            let transformedCategories = _.map(
                projectionTargetColumnInfos,
                (columnInfo) => prototypeCategories[columnInfo.sourceIndex]);

            let transformedCategorical = inheritSingle(prototypeCategorical);

            if (!_.isEmpty(transformedCategories)) {
                let dataViewObjects = DataViewCategoricalUtils.getCategoriesDataViewObjects(prototypeCategories);
                if (dataViewObjects) {
                    transformedCategories =
                        DataViewCategoricalUtils.setCategoriesDataViewObjects(transformedCategories, dataViewObjects) || transformedCategories;
                }

                transformedCategorical.categories = transformedCategories;
            } else {
                // if transformedCategories is an empty array, transformedCategorical.categories should become undefined
                transformedCategorical.categories = undefined;
            }
            
            return transformedCategorical;
        }

        function isSelectIndexOrderEqual(categories: DataViewCategoryColumn[], selectIndexOrder: number[]): boolean {
            debug.assertValue(categories, 'categories');
            debug.assertValue(selectIndexOrder, 'selectIndexOrder');

            return (categories.length === selectIndexOrder.length) &&
                _.every(selectIndexOrder, (selectIndex, i) => categories[i].source.index === selectIndex);
        }

        /**
         * If the specified prototypeCategorical.values is not consistent with projectionOrder and splitSelects, apply them and return the result.
         * Else, returns undefined.
         */
        function applyToSeriesAndMeasures(
            prototypeCategorical: DataViewCategorical,
            splitSelects: INumberDictionary<boolean>): DataViewCategorical {

            debug.assertValue(prototypeCategorical, 'prototypeCategorical');
            debug.assertAnyValue(splitSelects, 'splitSelects');

            // Note: Even if prototypeCategorical.values is an empty array, it may still have a field for dynamic series, in which case the split selects should still get applied.
            if (prototypeCategorical.values) {
                // TODO VSTS 5858830: also apply projection order to series and measures
                if (splitSelects) {
                    let transformedCategorical = inheritSingle(prototypeCategorical);
                    applySplitSelectsToSeriesAndMeasures(transformedCategorical, splitSelects);
                    
                    return transformedCategorical;
                }
            }
        }

        function applySplitSelectsToSeriesAndMeasures(categorical: DataViewCategorical, splitSelects: INumberDictionary<boolean>): void {
            debug.assertValue(categorical, 'categorical');
            debug.assertValue(splitSelects, 'splitSelects');

            let valueColumns: DataViewValueColumns = categorical.values;
            if (valueColumns) {
                let updatedColumns: boolean;

                if (valueColumns.source) {
                    if (!splitSelects[valueColumns.source.index]) {
                        // if processing a split and this is the split without series...
                        valueColumns.source = undefined;
                        valueColumns.identityFields = undefined;
                        
                        updatedColumns = true;
                    }
                }

                // Apply selectsToInclude to values by removing value columns not included
                for (let i = valueColumns.length - 1; i >= 0; i--) {
                    if (!splitSelects[valueColumns[i].source.index]) {
                        valueColumns.splice(i, 1);
                        updatedColumns = true;
                    }
                }

                if (updatedColumns) {
                    let hasRemainingDynamicSeries = !!valueColumns.source;
                    let hasRemainingMeasures = valueColumns.length > 0;
                    
                    if (hasRemainingDynamicSeries || hasRemainingMeasures) {
                        // Apply the latest updates to the values.grouped()
                        DataViewCategoricalEvalGrouped.apply(categorical);
                    } else {
                        categorical.values = undefined;
                    }
                }
            }
        }
    }
}
