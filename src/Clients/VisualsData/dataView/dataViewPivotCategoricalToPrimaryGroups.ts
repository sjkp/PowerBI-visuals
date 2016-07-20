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
    import inheritSingle = powerbi.Prototype.inheritSingle;

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

            // don't pivot if either axis has a data reduction
            if (binding.DataReduction && (binding.DataReduction.Primary || binding.DataReduction.Secondary))
                return false;

            return true;
        }

        export function unpivotResult(
            oldDataView: DataView,
            selects: DataViewSelectTransform[],
            roleKindByQueryRef: DataViewAnalysis.RoleKindByQueryRef,
            queryProjectionsByRole: QueryProjectionsByRole,
            applicableRoleMappings: DataViewMapping[]): DataView {

            if (!inferUnpivotTransform(oldDataView, selects, roleKindByQueryRef, queryProjectionsByRole, applicableRoleMappings))
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
                if (!_.isEmpty(newDataViewMatrix.valueSources)) {
                    // Guard against a DataViewMatrix with composite grouping in columns, because composite group in Series is 
                    // not yet expressible in the current version of DataViewValueColumns and DataViewValueColumnGroup interfaces.
                    // this.canPivotCategorical() would have returned false in the first place for this query.
                    let hasCompositeGroupInSeries = DataViewMatrixUtils.containsCompositeGroup(newDataViewMatrix.columns);
                    if (!hasCompositeGroupInSeries) {
                        newDataView.categorical = categoricalFromUnpivotedMatrix(newDataViewMatrix, newDataView.metadata.columns);
                    }
                }
            }

            return newDataView;
        }

        /**
         * Infer from the query result and the visual mappings whether the query was pivoted.
         * Narrowly targets scatter chart scenario for now to keep code simple
         */
        function inferUnpivotTransform(
            dataView: DataView,
            selects: DataViewSelectTransform[],
            roleKindByQueryRef: DataViewAnalysis.RoleKindByQueryRef,
            queryProjectionsByRole: QueryProjectionsByRole,
            applicableRoleMappings: DataViewMapping[]): boolean {

            if (_.isEmpty(selects) || !dataView || _.isEmpty(applicableRoleMappings))
                return false;

            let applicableRoleMappingWithoutRegression = _.filter(applicableRoleMappings, (mapping) => !DataViewMapping.getRegressionUsage(mapping));

            // NOTE: limiting to simple situation that handles scatter for now - see the other side in canPivotCategorical
            if (applicableRoleMappingWithoutRegression.length !== 1)
                return false;

            let categoricalMapping = applicableRoleMappingWithoutRegression[0].categorical;
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
                let roleProjections: QueryProjectionCollection = queryProjectionsByRole[roleName];
                if (!roleProjections)
                    return;

                for (let roleProjection of roleProjections.all()) {
                    if (roleKindByQueryRef[roleProjection.queryRef] === VisualDataRoleKind.Grouping)
                        groups.push(roleProjection.queryRef);
                }
            };

            DataViewMapping.visitCategoricalCategories(categoricalMapping.categories, {
                visitRole: (roleName: string) => { addGroupingRole(roleName, categoryGroups); }
            });

            DataViewMapping.visitGrouped(<DataViewGroupedRoleMapping>categoricalMapping.values, {
                visitRole: (roleName: string) => { addGroupingRole(roleName, valueGroups); }
            });
            
            DataViewMapping.visitCategoricalValues(categoricalMapping.values, {
                visitRole: (roleName: string) => { addGroupingRole(roleName, valueGroups); }
            });

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
            let series: DataViewMatrixNode[] = [];
            let seriesIdLevel = oldRows.levels[0];
            let seriesIdFields = oldRoot.childIdentityFields;

            // categories are the inner grouping. 
            let categoryIndex: _.Dictionary<number> = {};
            let categories: DataViewMatrixNode[] = [];
            let categoryIdLevel = oldRows.levels[1];
            let categoryIdFields = _.isEmpty(oldChildren) ? undefined : oldChildren[0].childIdentityFields;

            let measureCount = oldMatrix.valueSources.length;

            // within each series value, the category list may not be complete so cannot simply use the inner loop index
            // to reference it.
            let findCategory = (identity: DataViewScopeIdentity) => {
                let index = categoryIndex[identity.key];

                debug.assert(index !== undefined, "findcat() !== undefined");

                return index;
            };

            // collect series and categories from the row hierarchy
            if (oldChildren) {
                let addCategory = (categoryNode: DataViewMatrixNode) => {
                    let key = categoryNode.identity.key;
                    let index = categoryIndex[key];
                    if (index === undefined) {
                        index = categories.length;
                        categoryIndex[key] = index;
                        categories.push(categoryNode);
                    }
                };

                for (let seriesNode of oldChildren) {
                    series.push(seriesNode);

                    for (let categoryNode of seriesNode.children) {
                        addCategory(categoryNode);
                    }
                }
            }
            
            // extract intersection values from pivoted matrix
            // values will be indexed by categories then series
            let matrixValues: DataViewMatrixNodeValues[][] = new Array<DataViewMatrixNodeValues[]>(categories.length);
            for (let j = 0; j < series.length; ++j) { // outer is series
                let seriesNode = oldChildren[j];
                for (let categoryNode of seriesNode.children) { // inner is categories but maybe a subset
                    let i = findCategory(categoryNode.identity); // must lookup actual category index

                    if (!matrixValues[i])
                        matrixValues[i] = new Array<DataViewMatrixNodeValues>(series.length);

                    matrixValues[i][j] = categoryNode.values;
                }
            }

            // columns of the unpivoted matrix are the series
            let newColumns: DataViewHierarchy = {
                root: {
                    children: _.map(series, s => {
                        let inheritedNode = inheritSingle(s);
                        inheritedNode.level = 0; // s.level should already be 0, but just in case...
                        inheritedNode.children = undefined; // if Measure Headers exist in oldMatrix.columns, newColumns.root.children will get populated later in this function
                        inheritedNode.childIdentityFields = undefined;
                        return inheritedNode;
                    }),
                    childIdentityFields: seriesIdFields,
                },
                levels: [
                    seriesIdLevel,
                    
                ],
            };

            // Re-add any Measure Headers from oldMatrix.columns as leaf nodes under newColumns
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

            // rows of the unpivoted matrix are the categories
            let newRows: DataViewHierarchy = {
                root: {
                    children: _.map(categories, c => {
                        let inheritedNode = inheritSingle(c);
                        inheritedNode.level = 0;
                        inheritedNode.children = undefined; // c.children should already be undefined, but just in case...
                        inheritedNode.childIdentityFields = undefined; // c.children should already be undefined, but just in case...
                        return inheritedNode;
                    }),
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
                        let mvalues = matrixValues[i] && matrixValues[i][j];
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

            let categories: DataViewCategoryColumn[] = createCategoryColumnsFromUnpivotedMatrix(matrix);

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

        function createCategoryColumnsFromUnpivotedMatrix(unpivotedMatrix: DataViewMatrix): DataViewCategoryColumn[] {
            debug.assertValue(unpivotedMatrix, 'unpivotedMatrix');
            debug.assert(unpivotedMatrix && unpivotedMatrix.rows && unpivotedMatrix.rows.levels && (unpivotedMatrix.rows.levels.length === 1),
                'pre-condition: unpivotedMatrix should have exactly one level in row hierarchy');

            // Create categories from rows.  If matrix.rows.levels[0].sources represents a composite group, expand each column in the 
            // composite group into a separate DataViewCategoryColumn.  The identity and childIdentityFields properties will be the 
            // same amongst the resulting DataViewCategoryColumns.
            let categoryIdentity = _.map(unpivotedMatrix.rows.root.children, x => x.identity);
            let categoryIdentityFields = unpivotedMatrix.rows.root.childIdentityFields;
            let categorySourceColumns = unpivotedMatrix.rows.levels[0].sources;

            let categories: DataViewCategoryColumn[] = [];
            for (var i = 0, ilen = categorySourceColumns.length; i < ilen; i++) {
                let groupLevelValues = _.map(unpivotedMatrix.rows.root.children, (categoryNode: DataViewMatrixNode) => {
                    let levelValues: DataViewMatrixGroupValue[] = categoryNode.levelValues;

                    // Please refer to the interface comments on when this is undefined... But in today's code
                    // I believe we will not see undefined levelValues in the rows of any unpivotedMatrix. 
                    if (levelValues !== undefined) {
                        debug.assert(levelValues[i] && (levelValues[i].levelSourceIndex === i),
                            'pre-condition: DataViewMatrixNode.levelValues is expected to have one DataViewMatrixGroupValue node per level source column, sorted by levelSourceIndex.');
                        return levelValues[i].value;
                    }
                });

                categories.push({
                    source: categorySourceColumns[i],
                    values: groupLevelValues,
                    identity: categoryIdentity,
                    identityFields: categoryIdentityFields,
                });
            }

            return categories;
        }
    }
}