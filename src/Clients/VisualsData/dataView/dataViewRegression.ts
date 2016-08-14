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
    import DataViewMapping = powerbi.DataViewMapping;
    import RoleKindByQueryRef = DataViewAnalysis.RoleKindByQueryRef;

    export interface DataViewRegressionRunOptions {
        visualDataViews: DataView[];
        dataRoles: VisualDataRole[];
        objectDescriptors: DataViewObjectDescriptors;
        objectDefinitions: DataViewObjectDefinitions;
        colorAllocatorFactory: IColorAllocatorFactory;
        transformSelects: DataViewSelectTransform[];
        applicableDataViewMappings: DataViewMapping[];
        roleKindByQueryRef: RoleKindByQueryRef;
        queryProjectionsByRole: QueryProjectionsByRole;
    }

    export module DataViewRegression {
        // TODO VSTS 6842046: Currently we are using a constant queryName since we don't have a way to generate
        // unique ones. There is a bug filed to do this by lawong, so this part will be fixed with that bug.
        const regressionXQueryName: string = 'RegressionX';
        const regressionSeriesQueryName: string = 'RegressionSeries';
        export const regressionYQueryName: string = 'RegressionY';

        export function run(options: DataViewRegressionRunOptions): DataView[] {
            debug.assertValue(options, 'options');

            let visualDataViews: DataView[] = options.visualDataViews;
            let dataRoles: VisualDataRole[] = options.dataRoles;
            let objectDescriptors: DataViewObjectDescriptors = options.objectDescriptors;
            let objectDefinitions: DataViewObjectDefinitions = options.objectDefinitions;
            let colorAllocatorFactory: IColorAllocatorFactory = options.colorAllocatorFactory;
            let transformSelects: DataViewSelectTransform[] = options.transformSelects;
            let applicableDataViewMappings = options.applicableDataViewMappings;
            let roleKindByQueryRef = options.roleKindByQueryRef;
            let queryProjectionsByRole = options.queryProjectionsByRole;

            if (!_.isEmpty(visualDataViews) && transformSelects) {
                // compute linear regression line if applicable
                if (!roleKindByQueryRef || !queryProjectionsByRole || _.isEmpty(applicableDataViewMappings) || !objectDescriptors || !objectDefinitions)
                    return visualDataViews;

                let regressionDataViewMapping: DataViewMapping = _.find(applicableDataViewMappings, (dataViewMapping) => {
                    return !!DataViewMapping.getRegressionUsage(dataViewMapping);
                });

                if (regressionDataViewMapping) {
                    let regressionDataViews: DataView[] = [];
                    for (let visualDataView of visualDataViews) {
                        let regressionDataView: DataView = this.linearRegressionTransform(visualDataView, dataRoles, regressionDataViewMapping, objectDescriptors, objectDefinitions, colorAllocatorFactory);

                        if (regressionDataView)
                            regressionDataViews.push(regressionDataView);
                    }

                    if (!_.isEmpty(regressionDataViews))
                        visualDataViews.push(...regressionDataViews);
                }
            }

            return visualDataViews;
        }

        /**
         * This function will compute the linear regression algorithm on the sourceDataView and create a new dataView.
         * It works on scalar axis only.
         * The algorithm is as follows
         *
         * 1. Find the cartesian X and Y roles and the columns that correspond to those roles
         * 2. Get the data points, (X, Y) pairs, for each series, combining if needed.
         * 3. Compute the X and Y points for regression line using Y = Slope * X + Intercept
         * If highlights values are present, repeat steps 2 & 3 using highlight values.
         * 4. Create the new dataView using the points computed above
         */
        export function linearRegressionTransform(
            sourceDataView: DataView,
            dataRoles: VisualDataRole[],
            regressionDataViewMapping: DataViewMapping,
            objectDescriptors: DataViewObjectDescriptors,
            objectDefinitions: DataViewObjectDefinitions,
            colorAllocatorFactory: IColorAllocatorFactory): DataView {
            debug.assertValue(sourceDataView, 'sourceDataView');
            debug.assertValue(sourceDataView.categorical, 'sourceDataView.categorical');
            debug.assertValue(dataRoles, 'dataRoles');
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(objectDefinitions, 'objectDefinitions');
            debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');

            if (!sourceDataView.categorical)
                return;

            // Step 1
            let xColumns: DataViewCategoricalColumn[] = getColumnsForCartesianRoleKind(CartesianRoleKind.X, sourceDataView.categorical, dataRoles);
            let yColumns: DataViewCategoricalColumn[] = getColumnsForCartesianRoleKind(CartesianRoleKind.Y, sourceDataView.categorical, dataRoles);

            if (_.isEmpty(xColumns) || _.isEmpty(yColumns))
                return;

            let xColumnSource = xColumns[0].source;
            let yColumnSource = yColumns[0].source;

            let combineSeries = true;
            let regressionUsage = DataViewMapping.getRegressionUsage(regressionDataViewMapping);
            if (regressionUsage && sourceDataView.metadata.objects) {
                let combineSeriesPropertyId = regressionUsage['combineSeries'];
                if (combineSeriesPropertyId) {
                    combineSeries = DataViewObjects.getValue<boolean>(sourceDataView.metadata.objects, combineSeriesPropertyId, true);
                }
            }

            // Step 2
            let dataPointsBySeries = getDataPointsBySeries(xColumns, yColumns, combineSeries, /* preferHighlights */ false);
            let lineDefSet = calculateLineDefinitions(dataPointsBySeries);
            if (!lineDefSet)
                return;

            let xMin = lineDefSet.xMin;
            let xMax = lineDefSet.xMax;

            let shouldComputeHightlights = hasHighlightValues(yColumns) || hasHighlightValues(xColumns);
            let highlightsLineDefSet: LineDefinitionSet;
            if (shouldComputeHightlights) {
                let highlightDataPointsBySeries = getDataPointsBySeries(xColumns, yColumns, combineSeries, /* preferHighlights */ true);
                highlightsLineDefSet = calculateLineDefinitions(highlightDataPointsBySeries);
                if (highlightsLineDefSet) {
                    xMin = _.min([xMin, highlightsLineDefSet.xMin]);
                    xMax = _.max([xMax, highlightsLineDefSet.xMax]);
                }
                else {
                    shouldComputeHightlights = false;
                }
            }

            // Step 3
            let valuesByTrend: number[][] = [];
            for (let trend of lineDefSet.lineDefs) {
                valuesByTrend.push(computeLineYValues(trend, +xMin, +xMax));
            }

            let highlightsByTrend: number[][];
            if (shouldComputeHightlights) {
                highlightsByTrend = [];
                for (let trend of highlightsLineDefSet.lineDefs) {
                    highlightsByTrend.push(computeLineYValues(trend, +xMin, +xMax));
                }
            }

            // Step 4
            let groupValues: PrimitiveValue[];
            if (combineSeries) {
                groupValues = ['combinedRegressionSeries'];
            }
            else {
                // If we are producing a trend line per series we need to maintain the group identities so that we can map between the
                // trend line and the original series (to match the color for example).
                if (sourceDataView.categorical.values.source) {
                    // Source data view has dynamic series.
                    let groups = sourceDataView.categorical.values.grouped();
                    groupValues = _.map(groups, (group) => group.name);
                }
                else {
                    // Source data view has static or no series.
                    groupValues = _.map(yColumns, (column) => column.source.queryName);
                }
            }

            // Step 5
            let regressionDataView: DataView = createRegressionDataView(
                xColumnSource,
                yColumnSource,
                groupValues,
                [xMin, xMax],
                valuesByTrend,
                highlightsByTrend,
                sourceDataView,
                regressionDataViewMapping,
                objectDescriptors,
                objectDefinitions,
                colorAllocatorFactory);

            return regressionDataView;
        }

        function calculateLineDefinitions(dataPointsBySeries: DataPointSet[]): LineDefinitionSet {
            let xMin: PrimitiveValue;
            let xMax: PrimitiveValue;
            let lineDefs: LineDefinition[] = [];
            for (let dataPointSet of dataPointsBySeries) {
                let unsortedXValues: PrimitiveValue[] = dataPointSet.xValues;
                let unsortedYValues: PrimitiveValue[] = dataPointSet.yValues;

                if (_.isEmpty(unsortedXValues) || _.isEmpty(unsortedYValues))
                    return;

                // get the data type for each column; we will have null type when dataPoints have different type or if a value is null
                let xDataType: string = getDataType(unsortedXValues);
                if (!xDataType)
                    return;
                let yDataType: string = getDataType(unsortedYValues);
                if (!yDataType)
                    return;

                let sortedDataPointSet: DataPointSet = sortValues(unsortedXValues, unsortedYValues);
                let minCategoryValue: PrimitiveValue = sortedDataPointSet.xValues[0];
                let maxCategoryValue: PrimitiveValue = sortedDataPointSet.xValues[sortedDataPointSet.xValues.length - 1];

                let lineDef: LineDefinition = computeRegressionLine(sortedDataPointSet.xValues, sortedDataPointSet.yValues);

                xMin = _.min([xMin, minCategoryValue]);
                xMax = _.max([xMax, maxCategoryValue]);

                lineDefs.push(lineDef);
            }

            return {
                lineDefs: lineDefs,
                xMin: xMin,
                xMax: xMax,
            };
        }

        function getColumnsForCartesianRoleKind(roleKind: CartesianRoleKind, categorical: DataViewCategorical, roles: VisualDataRole[]): DataViewCategoricalColumn[] {
            debug.assertValue(roleKind, 'roleKind');
            debug.assertValue(categorical, 'categorical');

            let columns = getColumnsWithRoleKind(roleKind, categorical.values, roles);
            if (!_.isEmpty(columns))
                return columns;

            let categories = categorical.categories;
            if (_.isEmpty(categories))
                return;

            debug.assert(categories.length === 1, 'composite category columns not supported');
            let categoryColumn = categories[0];
            columns = getColumnsWithRoleKind(roleKind, [categoryColumn], roles);
            if (!_.isEmpty(columns))
                return columns;
        }

        function getColumnsWithRoleKind(roleKind: CartesianRoleKind, columns: DataViewCategoricalColumn[], roles: VisualDataRole[]): DataViewCategoricalColumn[] {
            if (_.isEmpty(columns))
                return;

            return _.filter(columns, (column) => {
                for (let roleName in column.source.roles) {
                    if (!column.source.roles[roleName])
                        continue;

                    let role = _.find(roles, (role) => role.name === roleName);
                    if (role && role.cartesianKind === roleKind)
                        return true;
                }

                return false;
            });
        }

        function getDataType(values: PrimitiveValue[]): string {
            let firstNonNull: PrimitiveValue = _.find(values, (value) => value != null);
            if (firstNonNull == null)
                return;

            let dataType: string = typeof firstNonNull;

            if (_.some(values, (value) => value != null && typeof value !== dataType))
                return;

            return dataType;
        }

        function sortValues(unsortedXValues: PrimitiveValue[], unsortedYValues: PrimitiveValue[]): DataPointSet {
            debug.assertValue(unsortedXValues, 'unsortedXValues');
            debug.assertValue(unsortedYValues, 'unsortedYValues');

            let zippedValues = _.zip(unsortedXValues, unsortedYValues);
            let [xValues, yValues] = _.chain(zippedValues)
                .filter((valuePair) => valuePair[0] != null && valuePair[1] != null)
                .sortBy((valuePair) => valuePair[0])
                .unzip()
                .value();

            return {
                xValues: xValues,
                yValues: yValues
            };
        }

        /**
         * Computes a line definition using linear regression.
         *   xBar: average of X values, yBar: average of Y values
         *   ssXX: sum of squares of X values = Sum(xi - xBar)^2
         *   ssXY: sum of squares of X and Y values  = Sum((xi - xBar)(yi - yBar)
         *   Slope: ssXY / ssXX
         *   Intercept: yBar - xBar * slope
         */
        function computeRegressionLine(xValues: number[], yValues: number[]): LineDefinition {
            debug.assertValue(xValues, 'xValues');
            debug.assertValue(yValues, 'yValues');

            let xBar = _.sum(xValues) / xValues.length;
            let yBar = _.sum(yValues) / yValues.length;

            let ssXX = _.chain(xValues)
                .map((x) => {
                    return (x - xBar) ** 2;
                })
                .sum();

            let ssXY = _.chain(xValues)
                .map((x, i) => {
                    return (x - xBar) * (yValues[i] - yBar);
                })
                .sum();

            let slope = ssXY / ssXX;
            let intercept = yBar - (xBar * slope);

            return {
                slope: slope,
                intercept: intercept
            };
        }

        function computeLineYValues(lineDef: LineDefinition, x1: number, x2: number): number[] {
            return [x1 * lineDef.slope + lineDef.intercept, x2 * lineDef.slope + lineDef.intercept];
        }

        function getValuesFromColumn(column: DataViewCategoricalColumn, preferHighlights: boolean): PrimitiveValue[] {
            if (preferHighlights) {
                // Attempt to use highlight values. When X is categorical, we may not have highlight values so we should fall back to the non-highlight values.
                let valueColumn = <DataViewValueColumn>column;
                if (valueColumn.highlights) {
                    return valueColumn.highlights;
                }
            }

            return column.values;
        }

        function getDataPointsBySeries(xColumns: DataViewCategoricalColumn[], yColumns: DataViewCategoricalColumn[], combineSeries: boolean, preferHighlights: boolean): DataPointSet[] {
            let dataPointsBySeries: DataPointSet[] = [];
            let xValueArray: PrimitiveValue[][] = _.map(xColumns, (column) => getValuesFromColumn(column, preferHighlights));
            let seriesYValues: PrimitiveValue[][] = _.map(yColumns, (column) => getValuesFromColumn(column, preferHighlights));

            let multipleXValueColumns: boolean = xColumns.length > 1;
            for (let i = 0; i < seriesYValues.length; i++) {
                let xValues = multipleXValueColumns ? xValueArray[i] : xValueArray[0];
                let yValues = seriesYValues[i];

                if (combineSeries && dataPointsBySeries.length > 0) {
                    dataPointsBySeries[0].xValues = dataPointsBySeries[0].xValues.concat(xValues);
                    dataPointsBySeries[0].yValues = dataPointsBySeries[0].yValues.concat(yValues);
                }
                else {
                    dataPointsBySeries.push({
                        xValues: xValues,
                        yValues: yValues,
                    });
                }
            }

            return dataPointsBySeries;
        }

        function createRegressionDataView(
            xColumnSource: DataViewMetadataColumn,
            yColumnSource: DataViewMetadataColumn,
            groupValues: PrimitiveValue[],
            categories: PrimitiveValue[],
            values: PrimitiveValue[][],
            highlights: PrimitiveValue[][],
            sourceDataView: DataView,
            regressionDataViewMapping: DataViewMapping,
            objectDescriptors: DataViewObjectDescriptors,
            objectDefinitions: DataViewObjectDefinitions,
            colorAllocatorFactory: IColorAllocatorFactory): DataView {
            debug.assertValue(xColumnSource, 'xColumnSource');
            debug.assertValue(yColumnSource, 'yColumnSource');
            debug.assertValue(categories, 'categories');
            debug.assertValue(values, 'values');
            debug.assertValue(sourceDataView, 'sourceDataView');
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(objectDefinitions, 'objectDefinitions');
            debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');
            debug.assertAnyValue(highlights, 'highlights');
            debug.assert(!highlights || highlights.length === values.length, 'highlights should have the same length as values');

            let xRole: string = (<DataViewRoleForMapping>regressionDataViewMapping.categorical.categories).for.in;
            let grouped = (<DataViewGroupedRoleMapping>regressionDataViewMapping.categorical.values).group;
            let yRole: string;
            let seriesRole: string;
            if (grouped && !_.isEmpty(grouped.select)) {
                yRole = (<DataViewRoleForMapping>grouped.select[0]).for ?
                    (<DataViewRoleForMapping>grouped.select[0]).for.in :
                    (<DataViewRoleBindMapping>grouped.select[0]).bind.to;
                seriesRole = grouped.by;
            }
            if (!yRole || !seriesRole)
                return;

            let categoricalRoles: { [name: string]: boolean } = {[xRole]: true};
            let valueRoles: { [name: string]: boolean } = {[yRole]: true};
            let seriesRoles: { [name: string]: boolean } = {[seriesRole]: true};

            let valuesBySeries: DataViewBuilderSeriesData[][] = [];
            for (let index in values) {
                let seriesData: DataViewBuilderSeriesData = {
                    values: values[index],
                };

                if (highlights)
                    seriesData.highlights = highlights[index];

                valuesBySeries.push([seriesData]);
            }

            let regressionDataView: DataView = createCategoricalDataViewBuilder()
                .withCategory({
                    source: {
                        displayName: xColumnSource.displayName,
                        queryName: regressionXQueryName,
                        type: xColumnSource.type,
                        isMeasure: false,
                        roles: categoricalRoles
                    },
                    values: categories,
                    identityFrom: {
                        fields: [SQExprBuilder.columnRef(SQExprBuilder.entity('s', 'RegressionEntity'), 'RegressionCategories')],
                    },
                })
                .withGroupedValues({
                    groupColumn: {
                        source: {
                            displayName: yColumnSource.displayName + 'Regression',
                            queryName: regressionSeriesQueryName,
                            type: yColumnSource.type,
                            isMeasure: yColumnSource.isMeasure,
                            roles: seriesRoles
                        },
                        values: groupValues,
                        identityFrom: {
                            fields: [SQExprBuilder.columnRef(SQExprBuilder.entity('s', 'RegressionEntity'), 'RegressionSeries')],
                        }
                    },
                    valueColumns: [{
                        source: {
                            displayName: yColumnSource.displayName,
                            queryName: regressionYQueryName,
                            type: yColumnSource.type,
                            isMeasure: yColumnSource.isMeasure,
                            roles: valueRoles
                        },
                    }],
                    data: valuesBySeries
                })
                .build();
            DataViewTransform.transformObjects(regressionDataView, data.StandardDataViewKinds.Categorical, objectDescriptors, objectDefinitions, [], colorAllocatorFactory);
            return regressionDataView;
        }

        function hasHighlightValues(columns: DataViewCategoricalColumn[]): boolean {
            return _.any(columns, (column) => {
                let valueColumn = <DataViewValueColumn>column;
                return valueColumn.highlights != null;
            });
        }
    }

    interface DataPointSet {
        xValues: any[];
        yValues: any[];
    }

    interface LineDefinition {
        slope: number;
        intercept: number;
    }

    interface LineDefinitionSet {
        lineDefs: LineDefinition[];
        xMin: PrimitiveValue;
        xMax: PrimitiveValue;
    }
}
