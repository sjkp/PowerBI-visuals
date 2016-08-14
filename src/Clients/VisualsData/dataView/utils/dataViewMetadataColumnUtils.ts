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

/// <reference path="../../_references.ts"/>

module powerbi.data {
    import INumberDictionary = jsCommon.INumberDictionary;

    export module DataViewMetadataColumnUtils {

        export interface MetadataColumnAndProjectionIndex {
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
        export function isForRole(metadataColumn: DataViewMetadataColumn, targetRole: string): boolean {
            debug.assertValue(metadataColumn, 'metadataColumn');
            debug.assertValue(targetRole, 'targetRole');

            let roles = metadataColumn.roles;
            return !!roles && !!roles[targetRole];
        }

        /**
         * Returns true iff the specified metadataColumn is assigned to any one of the specified targetRoles.
         */
        export function isForAnyRole(metadataColumn: DataViewMetadataColumn, targetRoles: string[]): boolean {
            debug.assertValue(metadataColumn, 'metadataColumn');
            debug.assertValue(targetRoles, 'targetRoles');

            let roles = metadataColumn.roles;
            return !!roles && _.any(targetRoles, (targetRole) => roles[targetRole]);
        }

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
        export function leftJoinMetadataColumnsAndProjectionOrder(
            columnSources: DataViewMetadataColumn[],
            projectionOrdering: number[],
            roles: string[]): MetadataColumnAndProjectionIndex[] {
            debug.assertAnyValue(columnSources, 'columnSources');
            debug.assert(_.every(columnSources, column => _.isNumber(column.index)),
                'pre-condition: Every value in columnSources must already have its Select Index property initialized.');
            debug.assertValue(projectionOrdering, 'projectionOrdering');
            debug.assertNonEmpty(roles, 'roles');

            let jointResult: MetadataColumnAndProjectionIndex[] = [];

            if (!_.isEmpty(columnSources)) {
                let selectIndexToProjectionIndicesMap = createSelectIndexToProjectionOrderIndicesMapping(projectionOrdering);

                for (let j = 0, jlen = columnSources.length; j < jlen; j++) {
                    var column = columnSources[j];
                    if (isForAnyRole(column, roles)) {
                        let projectionIndices: number[] = selectIndexToProjectionIndicesMap[column.index];
                        if (!_.isEmpty(projectionIndices)) {
                            for (let projectionIndex of projectionIndices) {
                                let jointColumnInfo: MetadataColumnAndProjectionIndex = {
                                    metadataColumn: column,
                                    sourceIndex: j,
                                    projectionOrderIndex: projectionIndex, 
                                };

                                jointResult.push(jointColumnInfo);
                            }
                        } else { // if select index not in projection ordering
                            let jointColumnInfo: MetadataColumnAndProjectionIndex = {
                                metadataColumn: column,
                                sourceIndex: j,
                                projectionOrderIndex: undefined, 
                            };

                            jointResult.push(jointColumnInfo);
                        }
                    }
                }
            }

            return jointResult;
        }

        function createSelectIndexToProjectionOrderIndicesMapping(selectIndicesByProjectionOrder: number[]): INumberDictionary<number[]> {
            debug.assertValue(selectIndicesByProjectionOrder, 'selectIndicesByProjectionOrder');

            let selectIndexToProjectionIndicesMap: INumberDictionary<number[]> = {};
            for (let i = 0, ilen = selectIndicesByProjectionOrder.length; i < ilen; i++) {
                let selectIndex = selectIndicesByProjectionOrder[i];
                let projectionOrders = selectIndexToProjectionIndicesMap[selectIndex];
                if (!projectionOrders) {
                    projectionOrders = selectIndexToProjectionIndicesMap[selectIndex] = [];
                }

                projectionOrders.push(i);
            }

            return selectIndexToProjectionIndicesMap;
        }
    }
} 