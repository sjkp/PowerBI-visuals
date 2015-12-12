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
    import ArrayExtensions = jsCommon.ArrayExtensions;
    import DataShapeBindingDataReduction = powerbi.data.DataShapeBindingDataReduction;
    import RoleKindByQueryRef = DataViewAnalysis.RoleKindByQueryRef;

    export module DataViewPivotCategoricalToPrimaryGroups {

        /**
         * If mapping requests cross axis data reduction and the binding has secondary grouping, mutates the binding to
         * pivot the secondary before the primary.
         */
        export function pivotBinding(binding: DataShapeBinding, allMappings: CompiledDataViewMapping[], finalMapping: CompiledDataViewMapping, defaultDataVolume: number): void {
            // unpivot is inferred from result in DataViewTransform.apply but it does not have the
            // compiled mappings available, let alone the merged mapping, only the original
            // DataViewMappings. to keep that inference easy, only apply pivot when there's
            // only one matching mapping
            if (!allMappings || allMappings.length !== 1)
                return;

            if (!finalMapping.categorical || !finalMapping.categorical.dataReductionAlgorithm)
                return;

            if (!binding)
                return;

            if (!canPivotCategorical(binding, finalMapping))
                return;

            // pivot secondary onto front of primary
            binding.Primary.Groupings = [binding.Secondary.Groupings[0], binding.Primary.Groupings[0]];

            binding.Secondary = undefined;
        
            // set primary to pivot reduction
            binding.DataReduction = {
                Primary: DataShapeBindingDataReduction.createFrom(finalMapping.categorical.dataReductionAlgorithm),
                DataVolume: finalMapping.categorical.dataVolume || defaultDataVolume,
            };
        }

        /** narrowly targets scatter chart scenario for now to keep code simple */
        function isPivotableAxis(axis: powerbi.data.DataShapeBindingAxis): boolean {
            return axis
                && axis.Groupings
                && axis.Groupings.length === 1
                && !_.isEmpty(axis.Groupings[0].Projections)
                && !axis.Groupings[0].Subtotal
                && _.isEmpty(axis.Groupings[0].SuppressedProjections);
        }

        function canPivotCategorical(binding: DataShapeBinding, mapping: CompiledDataViewMapping): boolean {
            if (!isPivotableAxis(binding.Primary))
                return false;
            if (!isPivotableAxis(binding.Secondary) || binding.Secondary.Groupings[0].Projections.length !== 1)
                return false;

            return true;
        }

        export function unpivotResult(oldDataView: DataView, selects: DataViewSelectTransform[], dataViewMappings: DataViewMapping[]): DataView {
            if (!inferUnpivotTransform(selects, dataViewMappings, oldDataView))
                return oldDataView;

            // This returns a subsetted version of the DataView rather than using prototypal inheritance because
            // any dataviews in the old one (including ones invented after this code is written) will correspond
            // to a pivoted query result and therefore will be in the wrong shape for the unpivoted query the
            // querying code made.
            let newDataView: DataView = {
                metadata: {
                    columns: ArrayExtensions.copy(oldDataView.metadata.columns),
                },
            };
            
            // preserve view types that aren't affected by pivoting
            if (oldDataView.single)
                newDataView.single = oldDataView.single;
            if (oldDataView.table)
                newDataView.table = oldDataView.table;

            // other views are derived from matrix
            if (oldDataView.matrix) {
                let newDataViewMatrix = unpivotMatrix(oldDataView.matrix);

                // categorical only if there's data
                if (!_.isEmpty(newDataViewMatrix.valueSources))
                    newDataView.categorical = categoricalFromUnpivotedMatrix(newDataViewMatrix, newDataView.metadata.columns);
            }

            return newDataView;
        }

        /** Convert selection info to projections */
        function projectionsFromSelects(selects: DataViewSelectTransform[]): QueryProjectionsByRole {
            let projections: QueryProjectionsByRole = {};
            for (let select of selects) {
                let roles = select.roles;
                if (!roles)
                    continue;

                for (let roleName in roles) {
                    if (roles[roleName]) {
                        let qp = projections[roleName];
                        if (!qp)
                            qp = projections[roleName] = new QueryProjectionCollection([]);
                        qp.all().push({ queryRef: select.queryName });
                    }
                }
            }

            return projections;
        }

        /** Use selections and metadata to fashion query role kinds */
        function createRoleKindFromMetadata(selects: DataViewSelectTransform[], metadata: DataViewMetadata): RoleKindByQueryRef {
            let roleKindByQueryRef: DataViewAnalysis.RoleKindByQueryRef = {};
            for (let column of metadata.columns) {
                if ((!column.index && column.index !== 0) || column.index < 0 || column.index >= selects.length)
                    continue;

                let select = selects[column.index];
                if (select) {
                    let queryRef = select.queryName;
                    if (queryRef && roleKindByQueryRef[queryRef] === undefined) {
                        roleKindByQueryRef[queryRef] = column.isMeasure ? VisualDataRoleKind.Measure : VisualDataRoleKind.Grouping;
                    }
                }
            }
            return roleKindByQueryRef;
        }

        /** Get roles from a role mapping */
        function getRolesInRoleMapping(role: (roleName: string) => void, roleMapping: DataViewRoleBindMapping | DataViewRoleForMapping | DataViewGroupedRoleMapping | DataViewListRoleMapping): void {
            if (!roleMapping)
                return;

            if ((<DataViewRoleBindMapping>roleMapping).bind)
                role((<DataViewRoleBindMapping>roleMapping).bind.to);

            if ((<DataViewRoleForMapping>roleMapping).for)
                role((<DataViewRoleForMapping>roleMapping).for.in);

            if ((<DataViewGroupedRoleMapping>roleMapping).group) {
                role((<DataViewGroupedRoleMapping>roleMapping).group.by);
                getRolesInRoleMappings(role, (<DataViewGroupedRoleMapping>roleMapping).group.select);
            }

            getRolesInRoleMappings(role, (<DataViewListRoleMapping>roleMapping).select);
        }

        /** Get roles from a list of role mappings */
        function getRolesInRoleMappings(role: (roleName: string) => void, roleMappings: (DataViewRoleBindMapping | DataViewRoleForMapping)[]): void {
            if (!_.isEmpty(roleMappings)) {
                for (let roleMapping of roleMappings)
                    getRolesInRoleMapping(role, roleMapping);
            }
        }

        /**
         * Infer from the query result and the visual mappings whether the query was pivoted.
         * Narrowly targets scatter chart scenario for now to keep code simple
         */
        function inferUnpivotTransform(selects: DataViewSelectTransform[], dataViewMappings: DataViewMapping[], dataView: DataView): boolean {
            if (!selects || !dataViewMappings || !dataView)
                return false;

            // select applicable mappings based on select roles
            let roleKinds: RoleKindByQueryRef = createRoleKindFromMetadata(selects, dataView.metadata);
            let projections: QueryProjectionsByRole = projectionsFromSelects(selects);
            dataViewMappings = DataViewAnalysis.chooseDataViewMappings(projections, dataViewMappings, roleKinds);

            // NOTE: limiting to simple situation that handles scatter for now - see the other side in canPivotCategorical
            if (!dataViewMappings || dataViewMappings.length !== 1)
                return false;

            let categoricalMapping = dataViewMappings[0].categorical;
            if (!categoricalMapping)
                return false;

            // pivoted query will have produced a matrix
            let matrixDataview = dataView.matrix;
            if (!matrixDataview)
                return false;

            // matrix must have two levels of grouping
            if (!matrixDataview.rows || !matrixDataview.rows.levels || matrixDataview.rows.levels.length !== 2)
                return false;

            // get category and value grouping roles
            let categoryGroups: string[] = [];
            let valueGroups: string[] = [];

            let addGroupingRole = (roleName: string, groups: string[]) => {
                let roleProjections: QueryProjectionCollection = projections[roleName];
                if (!roleProjections)
                    return;

                for (let roleProjection of roleProjections.all()) {
                    if (roleKinds[roleProjection.queryRef] === VisualDataRoleKind.Grouping)
                        groups.push(roleProjection.queryRef);
                }
            };

            getRolesInRoleMapping((roleName: string) => { addGroupingRole(roleName, categoryGroups); }, categoricalMapping.categories);
            getRolesInRoleMapping((roleName: string) => { addGroupingRole(roleName, valueGroups); }, categoricalMapping.values);

            // need both for pivot to have been done
            if (_.isEmpty(categoryGroups) || _.isEmpty(valueGroups))
                return false;

            // if there was a pivot, there won't be any measures left in the columns
            for (let level of matrixDataview.columns.levels) {
                for (let source of level.sources) {
                    if (!source.isMeasure)
                        return false;
                }
            }

            return true;
        }

        interface GroupValue {
            identity: DataViewScopeIdentity;
            value: any;
        }

        interface DataViewMatrixNodeValues {
            [id: number]: DataViewMatrixNodeValue;
        }

        /**
         * matrix will have two groupings in the rows, outer (series) and inner (categories), and none in the columns.
         * this function changes that so that the categories become the rows and the series the columns.
         */
        function unpivotMatrix(oldMatrix: DataViewMatrix): DataViewMatrix {
            let oldRows = oldMatrix.rows;
            let oldRoot = oldRows.root;
            let oldChildren = oldRoot.children;

            // series are the outer grouping
            let series: GroupValue[] = [];
            let seriesIdLevel = oldRows.levels[0];
            let seriesIdFields = oldRoot.childIdentityFields;

            // categories are the inner grouping. 
            let categories: GroupValue[] = [];
            let categoryIdLevel = oldRows.levels[1];
            let categoryIdFields = oldChildren[0].childIdentityFields;

            let measureCount = oldMatrix.valueSources.length;

            // within each series value, the category list may not be complete so cannot simply use the inner loop index
            // to reference it.
            let findcat = (identity: DataViewScopeIdentity) => {
                return _.findIndex(categories, pair => DataViewScopeIdentity.equals(pair.identity, identity));
            };

            // collect series and categories from the row hierarchy
            for (let seriesNode of oldChildren) {
                series.push({ value: seriesNode.value, identity: seriesNode.identity });

                for (let categoryNode of seriesNode.children) {
                    let catindex = findcat(categoryNode.identity);
                    if (catindex === -1)
                        categories.push({ value: categoryNode.value, identity: categoryNode.identity });
                }
            }
            
            // extract intersection values from pivoted matrix
            // values will be indexed by categories then series
            let matrixValues: DataViewMatrixNodeValues[][] = new Array<DataViewMatrixNodeValues[]>(categories.length);
            for (let j = 0; j < series.length; ++j) { // outer is series
                let seriesNode = oldChildren[j];
                for (let categoryNode of seriesNode.children) { // inner is categories but maybe a subset
                    let i = findcat(categoryNode.identity); // must lookup actual category index

                    if (!matrixValues[i])
                        matrixValues[i] = new Array<DataViewMatrixNodeValues>(series.length);

                    matrixValues[i][j] = categoryNode.values;
                }
            }

            // unpivoted matrix columns are the series
            let newColumns: DataViewHierarchy = {
                root: {
                    children: _.map(series, (s: any) => {
                        return {
                            level: 0,
                            value: s.value,
                            identity: s.identity,
                        };
                    }),
                    childIdentityFields: seriesIdFields,
                },
                levels: [
                    seriesIdLevel,
                    
                ],
            };
            if (measureCount > 0) {
                let newColChildren: DataViewMatrixNode[] = _.map(oldMatrix.columns.root.children, (srcnode: DataViewMatrixNode) => {
                    let dstnode: DataViewMatrixNode = { level: 1 };
                    if (srcnode.levelSourceIndex)
                        dstnode.levelSourceIndex = srcnode.levelSourceIndex;
                    return dstnode;
                });

                for (let i = 0; i < newColumns.root.children.length; ++i)
                    newColumns.root.children[i].children = newColChildren;

                newColumns.levels.push(oldMatrix.columns.levels[0]);
            }

            // unpivoted rows are the categories
            let newRows: DataViewHierarchy = {
                root: {
                    children: _.map(categories, (s: GroupValue) => { return { level: 0, value: s.value, identity: s.identity }; }),
                    childIdentityFields: categoryIdFields,
                },
                levels: [
                    categoryIdLevel,
                ],
            };

            // put values into rows
            if (measureCount > 0) {
                for (let i = 0; i < categories.length; ++i) {
                    let row = newRows.root.children[i];
                    let rowValues: DataViewMatrixNodeValues = {};

                    for (let j = 0; j < series.length; ++j) {
                        let mvalues = matrixValues[i][j];
                        for (let k = 0; k < measureCount; ++k) {
                            let l = j * measureCount + k;
                            rowValues[l] = !mvalues
                                ? ( k === 0 ? { value: null } : { value: null, valueSourceIndex: k } )
                                : mvalues[k];
                        }
                    }

                    row.values = rowValues;
                }
            }

            let newMatrix: DataViewMatrix = {
                rows: newRows,
                columns: newColumns,
                valueSources: oldMatrix.valueSources,
            };

            return newMatrix;
        }

        /** build a categorical data view from an unpivoted matrix. */
        function categoricalFromUnpivotedMatrix(matrix: DataViewMatrix, columnMetadata: DataViewMetadataColumn[]): DataViewCategorical {
            let seriesCount = matrix.columns.root.children.length;
            let measureMetadata = matrix.valueSources;
            let measureCount = measureMetadata.length;

            // create categories from rows
            let categories: DataViewCategoryColumn[] = [
                {
                    source: matrix.rows.levels[0].sources[0],
                    values: _.map(matrix.rows.root.children, x => x.value),
                    identity: _.map(matrix.rows.root.children, x => x.identity),
                    identityFields: matrix.rows.root.childIdentityFields,
                },
            ];

            // create grouped values
            let groups: DataViewValueColumnGroup[] = [];
            for (let j = 0; j < seriesCount; ++j) {
                let seriesColumn = matrix.columns.root.children[j];
                let group: DataViewValueColumnGroup = {
                    values: [],
                    identity: seriesColumn.identity,
                    name: seriesColumn.value || null,
                };

                groups.push(group);

                for (let k = 0; k < measureCount; ++k) {
                    let valueColumnMetadataSrc = measureMetadata[k];
                    let valueColumnMetadataDst: DataViewMetadataColumn = <DataViewMetadataColumn>{};
                    for (let key in valueColumnMetadataSrc)
                        valueColumnMetadataDst[key] = valueColumnMetadataSrc[key];
                    valueColumnMetadataDst.groupName = group.name;

                    columnMetadata.push(valueColumnMetadataDst);

                    let valueColumn: DataViewValueColumn = {
                        source: valueColumnMetadataDst,
                        values: [],
                        identity: group.identity,
                    };

                    group.values.push(valueColumn);

                    // grab measure values in the group from across rows of matrix
                    let index = k + j * measureCount;

                    for (let categoryNode of matrix.rows.root.children) {
                        let value = categoryNode.values[index].value;

                        valueColumn.values.push(value);
                    }
                }
            }

            // and now ungrouped
            let values: DataViewValueColumns = <DataViewValueColumns>[];
            for (let group of groups) {
                for (let k = 0; k < measureCount; ++k) {
                    values.push(group.values[k]);
                }
            }

            values.grouped = () => groups;
            values.identityFields = matrix.columns.root.childIdentityFields;
            values.source = matrix.columns.levels[0].sources[0];

            // final assembly
            let categorical: DataViewCategorical = {
                categories: categories,
                values: values,
            };

            return categorical;
        }
    }
}
