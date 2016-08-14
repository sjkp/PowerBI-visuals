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

module powerbi {
    export module DataViewAnalysis {
        import ArrayExtensions = jsCommon.ArrayExtensions;
        import QueryProjectionsByRole = powerbi.data.QueryProjectionsByRole;
        import DataViewObjectDescriptors = powerbi.data.DataViewObjectDescriptors;
        import DataViewObjectDefinitions = powerbi.data.DataViewObjectDefinitions;

        export interface ValidateAndReshapeResult {
            dataView?: DataView;
            isValid: boolean;
        }

        export interface RoleKindByQueryRef {
            [queryRef: string]: VisualDataRoleKind;
        }

        export interface DataViewMappingResult {
            supportedMappings: DataViewMapping[];

            /** A set of mapping errors if there are no supported mappings */
            mappingErrors: DataViewMappingMatchError[];
        }

        export enum DataViewMappingMatchErrorCode {
            conditionRangeTooLarge,
            conditionRangeTooSmall,
            conditionKindExpectedMeasure,
            conditionKindExpectedGrouping,
            conditionKindExpectedGroupingOrMeasure,
        }

        export interface DataViewMappingMatchError {
            code: DataViewMappingMatchErrorCode;
            roleName: string;
            mappingIndex?: number;
            conditionIndex?: number;
        }

        /** Reshapes the data view to match the provided schema if possible. If not, returns null */
        export function validateAndReshape(dataView: DataView, dataViewMappings: DataViewMapping[]): ValidateAndReshapeResult {
            if (!dataViewMappings || dataViewMappings.length === 0)
                return { dataView: dataView, isValid: true };

            if (dataView) {
                for (let dataViewMapping of dataViewMappings) {
                    // Keep the original when possible.
                    if (supports(dataView, dataViewMapping))
                        return { dataView: dataView, isValid: true };

                    if (dataViewMapping.categorical && dataView.categorical)
                        return reshapeCategorical(dataView, dataViewMapping);

                    if (dataViewMapping.tree && dataView.tree)
                        return reshapeTree(dataView, dataViewMapping.tree);

                    if (dataViewMapping.single && dataView.single)
                        return reshapeSingle(dataView, dataViewMapping.single);

                    if (dataViewMapping.table && dataView.table)
                        return reshapeTable(dataView, dataViewMapping.table);
                }
            }

            return { isValid: false };
        }

        function reshapeCategorical(dataView: DataView, dataViewMapping: DataViewMapping): ValidateAndReshapeResult {
            debug.assertValue(dataViewMapping, 'dataViewMapping');

            //The functionality that used to compare categorical.values.length to schema.values doesn't apply any more, we don't want to use the same logic for re-shaping.
            let categoryRoleMapping = dataViewMapping.categorical;
            let categorical = dataView.categorical;
            if (!categorical)
                return { isValid: false };

            let rowCount;
            if (categoryRoleMapping.rowCount) {
                rowCount = categoryRoleMapping.rowCount.supported;
                if (rowCount && rowCount.max) {
                    let updated: DataViewCategorical;
                    let categories = categorical.categories;
                    let maxRowCount = rowCount.max;
                    let originalLength = undefined;
                    if (categories) {
                        for (let i = 0, len = categories.length; i < len; i++) {
                            let category = categories[i];
                            originalLength = category.values.length;
                            if (maxRowCount !== undefined && originalLength > maxRowCount) {

                                // Row count too large: Trim it to fit.
                                let updatedCategories = ArrayExtensions.range(category.values, 0, maxRowCount - 1);

                                updated = updated || { categories: [] };
                                updated.categories.push({
                                    source: category.source,
                                    values: updatedCategories
                                });
                            }
                        }
                    }

                    if (categorical.values && categorical.values.length > 0 && maxRowCount) {
                        if (!originalLength)
                            originalLength = categorical.values[0].values.length;

                        if (maxRowCount !== undefined && originalLength > maxRowCount) {
                            updated = updated || {};
                            updated.values = data.DataViewTransform.createValueColumns();

                            for (let i = 0, len = categorical.values.length; i < len; i++) {
                                let column = categorical.values[i],
                                    updatedColumn: DataViewValueColumn = {
                                        source: column.source,
                                        values: ArrayExtensions.range(column.values, 0, maxRowCount - 1)
                                    };

                                if (column.min !== undefined)
                                    updatedColumn.min = column.min;
                                if (column.max !== undefined)
                                    updatedColumn.max = column.max;
                                if (column.subtotal !== undefined)
                                    updatedColumn.subtotal = column.subtotal;

                                updated.values.push(updatedColumn);
                            }
                        }
                    }

                    if (updated) {
                        dataView = {
                            metadata: dataView.metadata,
                            categorical: updated,
                        };
                    }
                }
            }

            if (supportsCategorical(dataView, dataViewMapping))
                return { dataView: dataView, isValid: true };

            return null;
        }

        function reshapeSingle(dataView: DataView, singleRoleMapping: DataViewSingleMapping): ValidateAndReshapeResult {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(singleRoleMapping, 'singleRoleMapping');

            if (dataView.single)
                return { dataView: dataView, isValid: true };

            return { isValid: false };
        }

        function reshapeTree(dataView: DataView, treeRoleMapping: DataViewTreeMapping): ValidateAndReshapeResult {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(treeRoleMapping, 'treeRoleMapping');

            // TODO: Need to implement the reshaping of Tree
            let metadata = dataView.metadata;
            if (validateRange(countGroups(metadata.columns), treeRoleMapping.depth) == null /*&& conforms(countMeasures(metadata.columns), treeRoleMapping.aggregates)*/)
                return { dataView: dataView, isValid: true };

            return { isValid: false };
        }

        function reshapeTable(dataView: DataView, tableRoleMapping: DataViewTableMapping): ValidateAndReshapeResult {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(tableRoleMapping, 'tableRoleMapping');

            if (dataView.table)
                return { dataView: dataView, isValid: true };

            return { isValid: false };
        }

        export function countGroups(columns: DataViewMetadataColumn[]): number {
            let count = 0;

            for (let i = 0, len = columns.length; i < len; i++) {
                if (!columns[i].isMeasure)
                    ++count;
            }

            return count;
        }

        export function countMeasures(columns: DataViewMetadataColumn[]): number {
            let count = 0;

            for (let i = 0, len = columns.length; i < len; i++) {
                if (columns[i].isMeasure)
                    ++count;
            }

            return count;
        }

        /** Indicates whether the dataView conforms to the specified schema. */
        export function supports(dataView: DataView, roleMapping: DataViewMapping, usePreferredDataViewSchema?: boolean): boolean {
            if (!roleMapping || !dataView)
                return false;

            if (roleMapping.scriptResult && !supportsScriptResult(dataView.scriptResult, roleMapping.scriptResult))
                return false;

            if (roleMapping.categorical && !supportsCategorical(dataView, roleMapping.categorical, usePreferredDataViewSchema))
                return false;

            if (roleMapping.tree && !supportsTree(dataView, roleMapping.tree))
                return false;

            if (roleMapping.single && !supportsSingle(dataView.single, roleMapping.single))
                return false;

            if (roleMapping.table && !supportsTable(dataView.table, roleMapping.table, usePreferredDataViewSchema))
                return false;

            return true;
        }

        function supportsCategorical(dataView: DataView, categoryRoleMapping: DataViewCategoricalMapping, usePreferredDataViewSchema?: boolean): boolean {
            debug.assertValue(categoryRoleMapping, 'categoryRoleMapping');

            let dataViewCategorical = dataView.categorical;
            if (!dataViewCategorical)
                return false;

            // TODO: Disabling this implementation isn't right.
            //if (!conforms(countMeasures(dataView.metadata.columns), categoryRoleMapping.values.roles.length))
            //    return false;

            if (categoryRoleMapping.rowCount) {
                let rowCount = categoryRoleMapping.rowCount.supported;
                if (usePreferredDataViewSchema && categoryRoleMapping.rowCount.preferred)
                    rowCount = categoryRoleMapping.rowCount.preferred;

                if (rowCount) {
                    let len: number = 0;
                    if (dataViewCategorical.values && dataViewCategorical.values.length)
                        len = dataViewCategorical.values[0].values.length;
                    else if (dataViewCategorical.categories && dataViewCategorical.categories.length)
                        len = dataViewCategorical.categories[0].values.length;

                    if (validateRange(len, rowCount) != null)
                        return false;
                }
            }

            return true;
        }

        function supportsSingle(dataViewSingle: DataViewSingle, singleRoleMapping: DataViewSingleMapping): boolean {
            debug.assertValue(singleRoleMapping, 'singleRoleMapping');

            if (!dataViewSingle)
                return false;

            return true;
        }

        function supportsTree(dataView: DataView, treeRoleMapping: DataViewTreeMapping): boolean {
            debug.assertValue(treeRoleMapping, 'treeRoleMapping');

            let metadata = dataView.metadata;
            return validateRange(countGroups(metadata.columns), treeRoleMapping.depth) == null;
        }

        function supportsTable(dataViewTable: DataViewTable, tableRoleMapping: DataViewTableMapping, usePreferredDataViewSchema?: boolean): boolean {
            debug.assertValue(tableRoleMapping, 'tableRoleMapping');

            if (!dataViewTable)
                return false;

            if (tableRoleMapping.rowCount) {
                let rowCount = tableRoleMapping.rowCount.supported;
                if (usePreferredDataViewSchema && tableRoleMapping.rowCount.preferred)
                    rowCount = tableRoleMapping.rowCount.preferred;

                if (rowCount) {
                    let len: number = 0;
                    if (dataViewTable.rows && dataViewTable.rows.length)
                        len = dataViewTable.rows.length;

                    if (validateRange(len, rowCount) != null)
                        return false;
                }
            }

            return true;
        }

        function supportsScriptResult(dataView: DataViewScriptResultData, scriptResultRoleMapping: DataViewScriptResultMapping): boolean {
            debug.assertValue(scriptResultRoleMapping, 'scriptResultRoleMapping');

            if (!dataView)
                return false;

            if (!dataView.imageBase64)
                return false;

            return true;
        }

        /** 
         * Determines whether the value conforms to the range in the role condition, returning undefined
         * if so or an appropriate error code if not.
         */
        export function validateRange(value: number, roleCondition: RoleCondition, ignoreMin?: boolean): DataViewMappingMatchErrorCode {
            debug.assertValue(value, 'value');

            if (!roleCondition)
                return;

            if (!ignoreMin && roleCondition.min !== undefined && roleCondition.min > value)
                return DataViewMappingMatchErrorCode.conditionRangeTooSmall;

            if (roleCondition.max !== undefined && roleCondition.max < value)
                return DataViewMappingMatchErrorCode.conditionRangeTooLarge;
        }

        /** 
         * Determines whether the value conforms to the kind in the role condition, returning undefined
         * if so or an appropriate error code if not.
         */
        function validateKind(roleCondition: RoleCondition, roleName: string, projections: QueryProjectionsByRole, roleKindByQueryRef: RoleKindByQueryRef): DataViewMappingMatchErrorCode {
            if (!roleCondition || roleCondition.kind === undefined) {
                return;
            }
            let expectedKind = roleCondition.kind;
            let roleCollection = projections[roleName];
            if (roleCollection) {
                let roleProjections = roleCollection.all();
                for (let roleProjection of roleProjections) {
                    if (roleKindByQueryRef[roleProjection.queryRef] !== expectedKind) {
                        switch (expectedKind) {
                            case VisualDataRoleKind.Measure:
                                return DataViewMappingMatchErrorCode.conditionKindExpectedMeasure;
                            case VisualDataRoleKind.Grouping:
                                return DataViewMappingMatchErrorCode.conditionKindExpectedGrouping;
                            case VisualDataRoleKind.GroupingOrMeasure:
                                return DataViewMappingMatchErrorCode.conditionKindExpectedGroupingOrMeasure;
                        }
                    }
                }
            }
        }

        /** Determines the appropriate DataViewMappings for the projections. */
        export function chooseDataViewMappings(
            projections: QueryProjectionsByRole,
            mappings: DataViewMapping[],
            roleKindByQueryRef: RoleKindByQueryRef,
            objectDescriptors?: DataViewObjectDescriptors,
            objectDefinitions?: DataViewObjectDefinitions): DataViewMappingResult {
            debug.assertValue(projections, 'projections');
            debug.assertAnyValue(mappings, 'mappings');

            let supportedMappings: DataViewMapping[] = [];
            let errors: DataViewMappingMatchError[] = [];

            if (!_.isEmpty(mappings)) {
                for (let mappingIndex = 0, mappingCount = mappings.length; mappingIndex < mappingCount; mappingIndex++) {
                    let mapping = mappings[mappingIndex],
                        mappingConditions = mapping.conditions,
                        requiredProperties = mapping.requiredProperties;
                    let allPropertiesValid: boolean = areAllPropertiesValid(requiredProperties, objectDescriptors, objectDefinitions);
                    let conditionsMet: DataViewMappingCondition[] = [];

                    if (!_.isEmpty(mappingConditions)) {
                        for (let conditionIndex = 0, conditionCount = mappingConditions.length; conditionIndex < conditionCount; conditionIndex++) {
                            let condition = mappingConditions[conditionIndex];
                            let currentConditionErrors = checkForConditionErrors(projections, condition, roleKindByQueryRef);
                            if (!_.isEmpty(currentConditionErrors)) {
                                for (let error of currentConditionErrors) {
                                    error.mappingIndex = mappingIndex;
                                    error.conditionIndex = conditionIndex;
                                    errors.push(error);
                                }
                            }
                            else
                                conditionsMet.push(condition);
                        }
                    }
                    else {
                        conditionsMet.push({});
                    }

                    if (!_.isEmpty(conditionsMet) && allPropertiesValid) {
                        let supportedMapping = _.cloneDeep(mapping);

                        let updatedConditions = _.filter(conditionsMet, (condition) => Object.keys(condition).length > 0);
                        if (!_.isEmpty(updatedConditions))
                            supportedMapping.conditions = updatedConditions;
                        supportedMappings.push(supportedMapping);
                    }
                }
            }

            return {
                supportedMappings: ArrayExtensions.emptyToNull(supportedMappings),
                mappingErrors: ArrayExtensions.emptyToNull(errors),
            };
        }

        function checkForConditionErrors(projections: QueryProjectionsByRole, condition: DataViewMappingCondition, roleKindByQueryRef: RoleKindByQueryRef): DataViewMappingMatchError[] {
            debug.assertValue(projections, 'projections');
            debug.assertValue(condition, 'condition');

            let conditionRoles = Object.keys(condition);
            let errors: DataViewMappingMatchError[] = [];

            for (let i = 0, len = conditionRoles.length; i < len; i++) {
                let roleName: string = conditionRoles[i],
                    isDrillable = projections[roleName] && !_.isEmpty(projections[roleName].activeProjectionRefs),
                    roleCondition = condition[roleName];

                let roleCount = getPropertyCount(roleName, projections, isDrillable);
                let rangeError = validateRange(roleCount, roleCondition);
                if (rangeError != null) {
                    errors.push({
                        code: rangeError,
                        roleName: roleName,
                    });
                }
                let kindError = validateKind(roleCondition, roleName, projections, roleKindByQueryRef);
                if (kindError != null) {
                    errors.push({
                        code: kindError,
                        roleName: roleName,
                    });
                }
            }

            return errors;
        }

        function areAllPropertiesValid(requiredProperties: DataViewObjectPropertyIdentifier[], objectDescriptors: DataViewObjectDescriptors, objectDefinitions?: DataViewObjectDefinitions): boolean {
            if (_.isEmpty(requiredProperties))
                return true;

            if (!objectDescriptors || !objectDefinitions)
                return false;

            let staticEvalContext: data.IEvalContext = data.createStaticEvalContext();

            return _.every(requiredProperties, (requiredProperty) => {
                let objectDescriptorValue = null;
                let objectDescriptorProperty = objectDescriptors[requiredProperty.objectName];
                if (objectDescriptorProperty)
                    objectDescriptorValue = objectDescriptorProperty.properties[requiredProperty.propertyName];
                let objectDefinitionValue = DataViewObjectDefinitions.getValue(objectDefinitions, requiredProperty, null);

                if (!objectDescriptorValue || !objectDefinitionValue)
                    return false;

                return data.DataViewObjectEvaluator.evaluateProperty(staticEvalContext, objectDescriptorValue, objectDefinitionValue);
            });
        }

        export function getPropertyCount(roleName: string, projections: QueryProjectionsByRole, useActiveIfAvailable?: boolean): number {
            debug.assertValue(roleName, 'roleName');
            debug.assertValue(projections, 'projections');

            let projectionsForRole = projections[roleName];
            if (projectionsForRole) {
                if (useActiveIfAvailable)
                    return 1;
                return projectionsForRole.all().length;
            }

            return 0;
        }

        export function hasSameCategoryIdentity(dataView1: DataView, dataView2: DataView): boolean {
            if (dataView1
                && dataView2
                && dataView1.categorical
                && dataView2.categorical) {
                let dv1Categories = dataView1.categorical.categories;
                let dv2Categories = dataView2.categorical.categories;
                if (dv1Categories
                    && dv2Categories
                    && dv1Categories.length === dv2Categories.length) {
                    for (let i = 0, len = dv1Categories.length; i < len; i++) {
                        let dv1Identity = dv1Categories[i].identity;
                        let dv2Identity = dv2Categories[i].identity;

                        let dv1Length = getLengthOptional(dv1Identity);
                        if (dv1Length !== getLengthOptional(dv2Identity))
                            return false;

                        for (let j = 0; j < dv1Length; j++) {
                            if (!DataViewScopeIdentity.equals(dv1Identity[j], dv2Identity[j]))
                                return false;
                        }
                    }

                    return true;
                }
            }

            return false;
        }

        function getLengthOptional(identity: DataViewScopeIdentity[]): number {
            if (identity)
                return identity.length;

            return 0;
        }

        export function areMetadataColumnsEquivalent(column1: DataViewMetadataColumn, column2: DataViewMetadataColumn): boolean {
            if (!column1 && !column2)
                return true;

            if (!column1 || !column2)
                return false;

            if (column1.displayName !== column2.displayName)
                return false;

            if (column1.queryName !== column2.queryName)
                return false;

            if (column1.isMeasure !== column2.isMeasure)
                return false;

            if (column1.type !== column2.type)
                return false;

            if (column1.sort !== column2.sort)
                return false;

            return true;
        }

        /* Returns true if the metadata columns at the same positions in the array are equivalent. */
        export function isMetadataEquivalent(metadata1: DataViewMetadata, metadata2: DataViewMetadata): boolean {
            if (!metadata1 && !metadata2)
                return true;

            if (!metadata1 || !metadata2)
                return false;

            let previousColumnsLength = metadata1.columns.length;
            let newColumnsLength = metadata2.columns.length;

            if (previousColumnsLength !== newColumnsLength)
                return false;

            for (let i: number = 0; i < newColumnsLength; i++) {
                if (!DataViewAnalysis.areMetadataColumnsEquivalent(metadata1.columns[i], metadata2.columns[i]))
                    return false;
            }

            return true;
        }
    }
}