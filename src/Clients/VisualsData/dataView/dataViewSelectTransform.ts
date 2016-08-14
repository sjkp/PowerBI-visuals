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
    import RoleKindByQueryRef = DataViewAnalysis.RoleKindByQueryRef;

    export interface DataViewSelectTransform {
        displayName?: string;
        queryName?: string;
        format?: string;
        type?: ValueType;
        roles?: { [roleName: string]: boolean };
        kpi?: DataViewKpiColumnMetadata;
        sort?: SortDirection;
        expr?: SQExpr;
        discourageAggregationAcrossGroups?: boolean;

        /** Describes the default value applied to a column, if any. */
        defaultValue?: DefaultValueDefinition;
        
        aggregateSources?: DataViewSelectAggregateSources;
    }

    export interface DataViewSelectAggregateSources {
         min?: DataViewSelectAggregateSource;
         max?: DataViewSelectAggregateSource;
    }

    export interface DataViewSelectAggregateSource {
         index: number;
    }    

    export module DataViewSelectTransform {
        /** Convert selection info to projections */
        export function projectionsFromSelects(selects: DataViewSelectTransform[], projectionActiveItems: DataViewProjectionActiveItems): QueryProjectionsByRole {
            debug.assertAnyValue(selects, "selects");
            debug.assertAnyValue(projectionActiveItems, "projectionActiveItems");

            if (_.isEmpty(selects))
                return {};

            let projections: QueryProjectionsByRole = {};
            for (let select of selects) {
                if (!select)
                    continue;

                let roles = select.roles;
                if (!roles)
                    continue;

                for (let roleName in roles) {
                    if (roles[roleName]) {
                        let qp = projections[roleName];
                        if (!qp)
                            qp = projections[roleName] = new QueryProjectionCollection([]);
                        qp.all().push({ queryRef: select.queryName });

                        if (projectionActiveItems && projectionActiveItems[roleName])
                            qp.activeProjectionRefs = _.map(projectionActiveItems[roleName], (activeItem: DataViewProjectionActiveItemInfo) => activeItem.queryRef);
                    }
                }
            }

            return projections;
        }

        /** Use selections and metadata to fashion query role kinds */
        export function createRoleKindFromMetadata(selects: DataViewSelectTransform[], metadata: DataViewMetadata): RoleKindByQueryRef {
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
    }
}