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
    import inheritSingle = Prototype.inheritSingle;

    export interface DataViewNormalizeValuesApplyOptions {
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
    export interface IMetadataColumnFilter {
        (columnIndex: number): boolean;
    }

    /**
     * Returns true iff the specified value is of matching type as required by the role assigned to the column associated with this filter object.
     */
    export interface IColumnValueFilter {
        (value: any): boolean;
    }

    /**
     * Interface of a function for deciding whether a value needs to be normalized due to not having a matching type as required by a role tied to the column associated with the specified columnIndex.
     *
     * @param columnIndex the position of the column in the select statement, i.e. the same semantic as the index property on the DataViewMetadataColumn interface.
     * @returns false iff the specified value needs to be normalized due to not having a matching type as required by a role tied to the column associated with the specified columnIndex.
     */
    export interface IValueFilter {
        (columnIndex: number, value: any): boolean;
    }

    export module DataViewNormalizeValues {
        export function apply(options: DataViewNormalizeValuesApplyOptions): void {
            debug.assertValue(options, 'options');

            let rolesToNormalize = _.filter(options.dataRoles, role => !_.isEmpty(role.requiredTypes));

            filterVariantMeasures(options.dataview, options.dataViewMappings, rolesToNormalize);
        }

        export function filterVariantMeasures(dataview: DataView, dataViewMappings: DataViewMapping[], rolesToNormalize: VisualDataRole[]): void {
            debug.assertValue(dataview, 'dataview');

            // Don't perform this unless we actually have dataViewMappings and variant measures to suppress
            // When we switch to lazy per-visual DataView creation, we'll be able to remove this check.
            if (_.isEmpty(dataViewMappings) || _.isEmpty(rolesToNormalize))
                return;

            let columnFilter = generateMetadataColumnFilter(dataview.metadata.columns, rolesToNormalize);
            let valueFilter = generateValueFilter(dataview.metadata.columns, rolesToNormalize);

            let usedMappings = {};
            for (let dataViewMapping of dataViewMappings) {
                // Get dataview specified in mappings which are also in dataview
                for (let dataViewMappingProp in dataViewMapping) {
                    if (dataview[dataViewMappingProp] != null)
                        usedMappings[dataViewMappingProp] = true;
                }
            }

            if (usedMappings['categorical'])
                filterVariantMeasuresCategorical(dataview.categorical, columnFilter, valueFilter);
            if (usedMappings['table'])
                filterVariantMeasuresTable(dataview.table, columnFilter, valueFilter);
            if (usedMappings['tree'])
                filterVariantMeasuresTreeNode(dataview.tree.root, columnFilter, valueFilter);
            if (usedMappings['matrix'])
                filterVariantMeasuresMatrix(dataview.matrix, columnFilter, valueFilter);
            if (usedMappings['single'])
                filterVariantMeasuresSingle(dataview, dataViewMappings, rolesToNormalize, valueFilter);
        }

        export function generateMetadataColumnFilter(columns: DataViewMetadataColumn[], rolesToNormalize: VisualDataRole[]): IMetadataColumnFilter {
            if (!columns || !rolesToNormalize)
                return () => false;

            let columnsToNormalize = {};
            for (let column of columns) {
                let roles = column.roles;
                if (!roles)
                    continue;
                for (let role of rolesToNormalize) {
                    if (!roles[role.name])
                        continue;
                    columnsToNormalize[column.index] = true;
                    break;
                }
            }

            return (columnIndex: number) => {
                if (isNaN(columnIndex))
                    return false;

                return !!columnsToNormalize[columnIndex];
            };
        }

        export function generateValueFilter(columns: DataViewMetadataColumn[], rolesToNormalize: VisualDataRole[]): IValueFilter {
            if (!columns || !rolesToNormalize)
                return () => true;

            let columnValueFilters: IColumnValueFilter[] = [];

            // Build columnValueFilters based on role requiredTypes
            for (let column of columns) {
                let columnValueFilter = generateColumnValueFilter(column, rolesToNormalize);

                if (columnValueFilter)
                    columnValueFilters[column.index] = columnValueFilter;
            }

            return <IValueFilter>(columnIndex: number, value: any) => {
                if (columnValueFilters[columnIndex])
                    return columnValueFilters[columnIndex](value);

                return true;
            };
        }

        function generateColumnValueFilter(column: DataViewMetadataColumn, rolesToNormalize: VisualDataRole[]): IColumnValueFilter {
            let requiredTypes = getColumnRequiredTypes(column, rolesToNormalize);

            if (_.isEmpty(requiredTypes))
                return;

            return (value: any): boolean => {
                return doesValueMatchTypes(value, requiredTypes);
            };
        }

        export function getColumnRequiredTypes(column: DataViewMetadataColumn, rolesToNormalize: VisualDataRole[]): ValueType[] {
            let requiredTypes = [];
            let columnRoles = column && column.roles;

            if (!columnRoles)
                return requiredTypes;

            for (let role of rolesToNormalize) {
                if (!columnRoles[role.name])
                    continue;
                for (let typeDescriptor of role.requiredTypes) {
                    let type = ValueType.fromDescriptor(typeDescriptor);
                    requiredTypes.push(type);
                }
            }

            return requiredTypes;
        }

        function filterVariantMeasuresCategorical(dataview: DataViewCategorical, columnFilter: IMetadataColumnFilter, valueFilter: IValueFilter): void {
            let values = dataview && dataview.values;
            if (!values)
                return;

            let valuesGrouped = values.grouped();
            if (!valuesGrouped)
                return;

            for (let valueGroup of valuesGrouped) {
                let valuesInGroup = valueGroup.values;
                for (let valueColumn of valuesInGroup) {
                    let columnIndex = valueColumn.source.index;
                    if (!columnFilter(columnIndex))
                        continue;

                    for (let i = 0, ilen = valueColumn.values.length; i < ilen; i++) {
                        valueColumn.values = normalizeVariant(valueColumn.values, i, columnIndex, valueFilter);
                    }
                }
            }
        }

        function filterVariantMeasuresTable(dataview: DataViewTable, columnFilter: IMetadataColumnFilter, valueFilter: IValueFilter): void {
            let columns = dataview && dataview.columns;

            if (!columns)
                return;

            let filteredColumns = [];
            for (let column of columns) {
                if (columnFilter(column.index))
                    filteredColumns.push(column.index);
            }

            let rows = dataview.rows;
            for (let i = 0, ilen = rows.length; i < ilen; i++) {
                for (let index of filteredColumns) {
                    rows[i] = normalizeVariant(rows[i], index, index, valueFilter);
                }
            }
        }

        function filterVariantMeasuresTreeNode(node: DataViewTreeNode, columnFilter: IMetadataColumnFilter, valueFilter: IValueFilter): void {
            if (node.values) {
                for (let columnIndex in node.values) {
                    // In dataView.tree, the keys in node.values correspond to columnIndex of the node value
                    if (columnFilter(<any>columnIndex)) {
                        // According to nojorgen, it is possible to have primitive values as values in the node.values dictionary.
                        if (typeof (node.values[columnIndex]) === 'object' && ('value' in node.values[columnIndex]))
                            node.values[columnIndex] = normalizeVariant(node.values[columnIndex], 'value', <any>columnIndex, valueFilter);
                        else // if node.values[columnIndex] is a primitive value
                            node.values = normalizeVariant(node.values, columnIndex, <any>columnIndex, valueFilter);
                    }
                }
            }
            else if (node.children) {
                for (let child of node.children) {
                    filterVariantMeasuresTreeNode(child, columnFilter, valueFilter);
                }
            }
        }

        function filterVariantMeasuresMatrix(dataview: DataViewMatrix, columnFilter: IMetadataColumnFilter, valueFilter: IValueFilter): void {
            let root = dataview && dataview.rows && dataview.rows.root;

            if (!root)
                return;

            // Recurse into rows.children
            // e.g. rows.children -> .children -> .children.values
            filterVariantMeasuresMatrixRecursive(dataview, root, columnFilter, valueFilter);
        }

        function filterVariantMeasuresMatrixRecursive(dataviewMatrix: DataViewMatrix, node: DataViewTreeNode, columnFilter: IMetadataColumnFilter, valueFilter: IValueFilter): void {
            if (node.values) {
                for (let id in node.values) {
                    // Note related to VSTS 6547124: In dataView.matrix, the keys in node.values are NOT equivalent to value.valueSourceIndex.
                    let nodeValue: DataViewMatrixNodeValue = node.values[id];

                    // the property DataViewMatrixNodeValue.valueSourceIndex will not exist if valueSourceIndex is 0 for that value
                    let valueSourceIndex: number = nodeValue.valueSourceIndex || 0;

                    // index is an optional property on DataViewMetadataColumn, but I am not sure when it will ever be undefined in a matrix' column metadata
                    let columnIndex = dataviewMatrix.valueSources[valueSourceIndex].index;

                    if (_.isNumber(columnIndex) && columnFilter(columnIndex)) {
                        node.values[id] = normalizeVariant(nodeValue, 'value', columnIndex, valueFilter);
                    }
                }
            }
            else if (node.children) {
                for (let child of node.children) {
                    filterVariantMeasuresMatrixRecursive(dataviewMatrix, child, columnFilter, valueFilter);
                }
            }
        }

        function filterVariantMeasuresSingle(dataview: DataView, dataViewMappings: DataViewMapping[], rolesToNormalize: VisualDataRole[], valueFilter: IValueFilter): void {
            if (!dataview.single)
                return;

            let roleNames: string[] = [];
            for (let role of rolesToNormalize) {
                if (role.name)
                    roleNames.push(role.name);
            }

            let columns = dataview.metadata.columns;
            for (let dataViewMapping of dataViewMappings) {
                let roleName = dataViewMapping.single.role;
                if (roleNames.indexOf(roleName) !== -1) {
                    let column = firstColumnByRoleName(columns, roleName);
                    if (column)
                        dataview.single = normalizeVariant(dataview.single, 'value', column.index, valueFilter);
                    return;
                }
            }
        }

        export function normalizeVariant<T>(object: T, key: string|number, columnIndex: number, valueFilter: IValueFilter): T {
            if (!object)
                return;

            let value = object[key];
            if (value !== null && !valueFilter(columnIndex, value)) {
                object = inheritSingle(object);
                object[key] = null;
            }

            return object;
        }

        function doesValueMatchTypes<T>(value: T, types: ValueType[]): boolean {
            for (let type of types) {
                if (type.numeric || type.integer)
                    return typeof (value) === 'number';
            }

            return false;
        }

        function firstColumnByRoleName(columns: DataViewMetadataColumn[], roleName: string): DataViewMetadataColumn {
            for (let column of columns) {
                let columnRoles = column && column.roles;
                if (columnRoles && columnRoles[roleName])
                    return column;
            }
        }
    }
}