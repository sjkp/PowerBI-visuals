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
    import DataRoleHelper = powerbi.data.DataRoleHelper;

    export function createIDataViewCategoricalReader(dataView: DataView): IDataViewCategoricalReader {
        return new DataViewCategoricalReader(dataView);
    }

    export interface IDataViewCategoricalReader {
        // Category functions
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
        // Value functions
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
        // Series Methods
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

    /**
     * A mapping used to map indeces within a specific roleName to an index into the values
     * of a grouped.  This is used so that you can iterate over values within a role without
     * expensive filtering or extra traversal.
     */ 
    interface RoleIndexMapping {
        [roleName: string]: number[];
    }

    class DataViewCategoricalReader implements IDataViewCategoricalReader {
        private dataView: DataView;
        private categories: DataViewCategoryColumn[];
        private grouped: DataViewValueColumnGroup[];
        private dataHasDynamicSeries: boolean;
        private valueRoleIndexMapping: RoleIndexMapping;
        
        // Validation variables
        private hasValidCategories: boolean;
        private hasAnyValidValues: boolean;

        constructor(dataView: DataView) {
            debug.assertValue(dataView, 'dataView');
            this.dataView = dataView;
            // Validate categories
            let categorical: DataViewCategorical;
            if (dataView)
                categorical = dataView.categorical;
            let categories: DataViewCategoryColumn[];
            if (categorical)
                categories = this.categories = categorical.categories;
            this.hasValidCategories = !_.isEmpty(categories);

            // Validate values
            let values: DataViewValueColumns;
            if (categorical)
                values = categorical.values;
            // We need to access grouped as long as values is non-null; if it's an empty array (meaning there is a category + series), we'll use grouped for non-value stuff
            // TODO: think a bit more about how to represent this internally; Maybe split this up between hasGroup and hasValidValues or something
            this.hasAnyValidValues = false;
            if (values != null) {
                let grouped = dataView.categorical.values.grouped();

                if (grouped.length > 0) {
                    this.hasAnyValidValues = true;
                    this.grouped = grouped;

                    // Iterate through the first group's values to populate the valueRoleIndexMapping
                    let valueRoleIndexMapping: RoleIndexMapping = {};
                    let firstGroupValues = grouped[0].values;
                    for (let valueIndex = 0, valueCount = firstGroupValues.length; valueIndex < valueCount; valueIndex++) {
                        let valueRoles = firstGroupValues[valueIndex].source.roles;
                        for (let role in valueRoles) {
                            if (valueRoles[role]) {
                                if (!valueRoleIndexMapping[role])
                                    valueRoleIndexMapping[role] = [];
                                valueRoleIndexMapping[role].push(valueIndex);
                            }
                        }
                    }
                    this.valueRoleIndexMapping = valueRoleIndexMapping;
                }
            }

            if (this.hasAnyValidValues)
                this.dataHasDynamicSeries = !!this.dataView.categorical.values.source;
        }

        // Category methods
        
        public hasCategories(): boolean {
            return this.hasValidCategories;
        }

        public getCategoryCount(): number {
            if (this.hasValidCategories)
                return this.categories[0].values.length;
            else
                return 0;
        }

        public getCategoryValues(roleName: string): any {
            if (this.hasValidCategories) {
                let categories = this.getCategoryFromRole(roleName);
                return categories ? categories.values : undefined;
            }
        }

        public getCategoryValue(roleName: string, categoryIndex: number): any {
            if (this.hasValidCategories) {
                let categories = this.getCategoryFromRole(roleName);
                return categories ? categories.values[categoryIndex] : undefined;
            }
        }

        public getCategoryColumn(roleName: string): DataViewCategoryColumn {
            if (this.hasValidCategories)
                return this.getCategoryFromRole(roleName);
        }

        public getCategoryMetadataColumn(roleName: string): DataViewMetadataColumn {
            if (this.hasValidCategories) {
                let categories = this.getCategoryFromRole(roleName);
                return categories ? categories.source : undefined;
            }
        }

        public getCategoryColumnIdentityFields(roleName: string): powerbi.data.ISQExpr[] {
            if (this.hasValidCategories) {
                let categories = this.getCategoryFromRole(roleName);
                return categories ? categories.identityFields : undefined;
            }
        }

        public getCategoryDisplayName(roleName: string): string {
            if (this.hasValidCategories) {
                let targetColumn = this.getCategoryColumn(roleName);
                if (targetColumn && targetColumn.source) {
                    return targetColumn.source.displayName;
                }
            }
        }

        public hasCompositeCategories(): boolean {
            if (this.hasValidCategories)
                return this.categories.length > 1;
        }

        public hasCategoryWithRole(roleName: string): boolean {
            return DataRoleHelper.getCategoryIndexOfRole(this.categories, roleName) !== -1;
        }

        public getCategoryObjects(roleName: string, categoryIndex: number): DataViewObjects {
            if (this.hasValidCategories) {
                let category = this.getCategoryFromRole(roleName);
                if (category && category.objects) {
                    return category.objects[categoryIndex];
                }
            }
        }

        private getCategoryFromRole(roleName: string): DataViewCategoryColumn {
            let categories = this.categories;
            return categories[DataRoleHelper.getCategoryIndexOfRole(categories, roleName)];
        }

        // Value and measure methods

        public hasValues(roleName: string): boolean {
            return this.valueRoleIndexMapping && !_.isEmpty(this.valueRoleIndexMapping[roleName]);
        }

        public hasHighlights(roleName: string): boolean {
            if (this.hasValues(roleName)) {
                return !_.isEmpty(this.grouped[0].values[this.valueRoleIndexMapping[roleName][0]].highlights);
            }
            return false;
        }
        
        public getValue(roleName: string, categoryIndex: number, seriesIndex: number = 0): any {
            if (this.hasValues(roleName)) {
                if (this.dataHasDynamicSeries) {
                    // For dynamic series, we only ever obtain the first value column from a role
                    return this.getValueInternal(roleName, categoryIndex, seriesIndex, 0, false /* getHighlight */);
                }
                else {
                    // For static series or single series, we obtain value columns from the first series
                    //    and use the seriesIndex to index into the value columns within the role
                    return this.getValueInternal(roleName, categoryIndex, 0, seriesIndex, false /* getHighlight */);
                }
            }
        }

        public getHighlight(roleName: string, categoryIndex: number, seriesIndex: number = 0): any {
            if (this.hasValues(roleName)) {
                if (this.dataHasDynamicSeries) {
                    // For dynamic series, we only ever obtain the first value column from a role
                    return this.getValueInternal(roleName, categoryIndex, seriesIndex, 0, true /* getHighlight */);
                }
                else {
                    // For static series or single series, we obtain value columns from the first series
                    //    and use the seriesIndex to index into the value columns within the role
                    return this.getValueInternal(roleName, categoryIndex, 0, seriesIndex, true /* getHighlight */);
                }
            }
        }

        public getAllValuesForRole(roleName: string, categoryIndex: number, seriesIndex: number = 0): any[] {
            if (this.hasValues(roleName)) {
                let valuesInRole = [];
                for (let roleValueIndex = 0, roleValueCount = this.valueRoleIndexMapping[roleName].length; roleValueIndex < roleValueCount; roleValueIndex++) {
                    valuesInRole.push(this.getValueInternal(roleName, categoryIndex, seriesIndex, roleValueIndex, false /* getHighlight */));
                }
                return valuesInRole;
            }
        }

        public getAllHighlightsForRole(roleName: string, categoryIndex: number, seriesIndex: number = 0): any[] {
            if (this.hasValues(roleName)) {
                let valuesInRole = [];
                for (let roleValueIndex = 0, roleValueCount = this.valueRoleIndexMapping[roleName].length; roleValueIndex < roleValueCount; roleValueIndex++) {
                    valuesInRole.push(this.getValueInternal(roleName, categoryIndex, seriesIndex, roleValueIndex, true /* getHighlight */));
                }
                return valuesInRole;
            }
        }

        /**
         * Obtains the value from grouped.
         *
         * Grouped:             [0] [1] [2] [3] (seriesIndex)
         *                         /   \
         * .values:       [T0] [V0] [V1] [T1] [V2] (valueColumnIndex)
         *                    /    \ \  \           
         * v.values:  [0, 1, 2, 3, 4] [5, 6, 7, 8, 9] (categoryIndex)
         * 
         *--------------------------------|
         *                      |Category |
         * Series|Value Columns |A B C D E|
         *--------------------------------|
         *      0|col0 (tooltip)|         |
         *       |col1 (value)  |         |
         *       |col2 (value)  |         |
         *       |col3 (tooltip)|         |
         *       |col4 (value)  |         |
         *--------------------------------|
         *      1|col0 (tooltip)|         |
         *       |col1 (value)  |0 1 2 3 4|
         *       |col2 (value)  |5 6 7 8 9|
         *       |col3 (tooltip)|         |
         *       |col4 (value)  |         |
         *--------------------------------|
         *      2|col0 (tooltip)|...      |
         * 
         * valueColumnIndexInRole is for indexing into the values for a single role
         * valueColumnIndex is for indexing into the entire value array including
         * all roles
         * 
         * The valueRoleIndexMapping converts roleValueIndex and role (value role
         * with an index of 1) into groupedValueIndex (2)
         *
         * Example: getValueInternal(V, 3, 1, 1) returns 8: The second group,
         * the second value column with role "value" (which is converted to a
         * groupedValueIndex of 2) and the fourth value within that value column.
         */
        private getValueInternal(roleName: string, categoryIndex: number, groupIndex: number, valueColumnIndexInRole: number, getHighlight: boolean): any {
            if (this.hasValues(roleName)) {
                let valueColumnIndex = this.valueRoleIndexMapping[roleName][valueColumnIndexInRole];
                let groupedValues = this.grouped[groupIndex].values[valueColumnIndex];
                return getHighlight ? groupedValues.highlights[categoryIndex] : groupedValues.values[categoryIndex];
            }
        }

        public getFirstNonNullValueForCategory(roleName: string, categoryIndex: number): any {
            if (this.hasValues(roleName)) {
                if (!this.dataHasDynamicSeries) {
                    debug.assert(this.grouped.length === 1, "getFirstNonNullValueForCategory shouldn't be called if you have a static series");
                    return this.getValue(roleName, categoryIndex);
                }
                for (let seriesIndex = 0, seriesCount = this.grouped.length; seriesIndex < seriesCount; seriesIndex++) {
                    let value = this.getValue(roleName, categoryIndex, seriesIndex);
                    if (value != null) {
                        return value;
                    }
                }
            }
        }

        public getMeasureQueryName(roleName: string): string {
            if (this.hasValues(roleName))
                return this.grouped[0].values[this.valueRoleIndexMapping[roleName][0]].source.queryName;
        }

        public getValueColumn(roleName: string, seriesIndex: number = 0): DataViewValueColumn {
            if (this.hasValues(roleName)) {
                if (this.dataHasDynamicSeries) {
                    return this.grouped[seriesIndex].values[this.valueRoleIndexMapping[roleName][0]];
                }
                else {
                    return this.grouped[0].values[this.valueRoleIndexMapping[roleName][seriesIndex]];
                }
            }
        }
        
        public getValueMetadataColumn(roleName: string, seriesIndex: number = 0): DataViewMetadataColumn {
            let valueColumn = this.getValueColumn(roleName, seriesIndex);
            if (valueColumn) {
                return valueColumn.source;
            }
        }

        public getAllValueMetadataColumnsForRole(roleName: string, seriesIndex: number = 0): DataViewMetadataColumn[] {
            if (this.hasValues(roleName)) {
                let metadata = [];
                for (let roleValueIndex = 0, roleValueCount = this.valueRoleIndexMapping[roleName].length; roleValueIndex < roleValueCount; roleValueIndex++) {
                    let column = this.grouped[seriesIndex].values[this.valueRoleIndexMapping[roleName][roleValueIndex]].source;
                    metadata.push(column);
                }
                return metadata;
            }
        }

        public getValueDisplayName(roleName: string, seriesIndex?: number): string {
            if (this.hasValues(roleName)) {
                let targetColumn = this.getValueColumn(roleName, seriesIndex);
                if (targetColumn && targetColumn.source) {
                    return targetColumn.source.displayName;
                }
            }
        }

        // Series methods

        public hasDynamicSeries(): boolean {
            return this.dataHasDynamicSeries;
        }

        public getSeriesCount(valueRoleName?: string): number {
            if (!this.hasAnyValidValues)
                return;

            if (this.dataHasDynamicSeries) {
                return this.grouped.length;
            }
            else {
                let roleIndexMap = valueRoleName && this.valueRoleIndexMapping[valueRoleName];

                if (roleIndexMap)
                    return roleIndexMap.length;

                return 1;
            }
        }

        public getSeriesObjects(seriesIndex: number): DataViewObjects {
            if (this.hasAnyValidValues)
                return this.grouped[seriesIndex].objects;
        }

        public getSeriesValueColumns(): DataViewValueColumns {
            if (this.hasAnyValidValues)
                return this.dataView.categorical.values;
        }

        public getSeriesValueColumnGroup(seriesIndex: number): DataViewValueColumnGroup {
            if (this.hasAnyValidValues)
                return this.grouped[seriesIndex];
        }

        public getSeriesMetadataColumn(): DataViewMetadataColumn {
            if (this.hasAnyValidValues)
                return this.dataView.categorical.values.source;
        }

        public getSeriesColumnIdentityFields(): powerbi.data.ISQExpr[] {
            if (this.hasAnyValidValues)
                return this.dataView.categorical.values.identityFields;
        }

        public getSeriesName(seriesIndex: number): PrimitiveValue {
            if (this.hasAnyValidValues)
                return this.grouped[seriesIndex].name;
        }

        public getSeriesDisplayName(): string {
            if (this.hasAnyValidValues && this.dataHasDynamicSeries)
                return this.dataView.categorical.values.source.displayName;
        }
        
        public getStaticObjects(): DataViewObjects {
            let result: DataViewObjects = null;
            if(this.dataView.metadata && this.dataView.metadata.objects) {
                result = this.dataView.metadata.objects;
            }
            
            return result;
        }
    }
}