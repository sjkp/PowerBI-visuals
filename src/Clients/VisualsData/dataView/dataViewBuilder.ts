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
    import DataViewTransform = powerbi.data.DataViewTransform;
    import SQExprBuilder = powerbi.data.SQExprBuilder;

    /** Utility for creating a DataView from columns of data. */
    export interface IDataViewBuilderCategorical {
        withCategory(options: DataViewBuilderCategoryColumnOptions): IDataViewBuilderCategorical;
        withCategories(categories: DataViewCategoryColumn[]): IDataViewBuilderCategorical;
        withValues(options: DataViewBuilderValuesOptions): IDataViewBuilderCategorical;
        withGroupedValues(options: DataViewBuilderGroupedValuesOptions): IDataViewBuilderCategorical;

        build(): DataView;
    }

    export interface DataViewBuilderColumnOptions {
        source: DataViewMetadataColumn;
    }

    export interface DataViewBuilderCategoryColumnOptions extends DataViewBuilderColumnOptions {
        values: PrimitiveValue[];
        identityFrom: DataViewBuilderColumnIdentitySource;
    }

    export interface DataViewBuilderValuesOptions {
        columns: DataViewBuilderValuesColumnOptions[];
    }

    export interface DataViewBuilderGroupedValuesOptions {
        groupColumn: DataViewBuilderCategoryColumnOptions;
        valueColumns: DataViewBuilderColumnOptions[];
        data: DataViewBuilderSeriesData[][];
    }

    /** Indicates the source set of identities. */
    export interface DataViewBuilderColumnIdentitySource {
        fields: SQExpr[];
        identities?: DataViewScopeIdentity[];
    }

    export interface DataViewBuilderValuesColumnOptions extends DataViewBuilderColumnOptions, DataViewBuilderSeriesData {
    }

    export interface DataViewBuilderSeriesData {
        values: PrimitiveValue[];
        highlights?: PrimitiveValue[];

        /** Client-computed maximum value for a column. */
        maxLocal?: any;

        /** Client-computed maximum value for a column. */
        minLocal?: any;
    }

    export function createCategoricalDataViewBuilder(): IDataViewBuilderCategorical {
        return new CategoricalDataViewBuilder();
    }

    interface ColumnMetadata {
        column: DataViewMetadataColumn;
        identityFrom: DataViewBuilderColumnIdentitySource;
        values: PrimitiveValue[];
    }

    class CategoricalDataViewBuilder implements IDataViewBuilderCategorical {
        private categories: DataViewCategoryColumn[];
        private staticMeasureColumns: DataViewMetadataColumn[];
        private dynamicMeasureColumns: DataViewMetadataColumn[];
        private dynamicSeriesMetadata: ColumnMetadata;
        private columnIndex: number;
        private staticSeriesValues: DataViewBuilderValuesColumnOptions[];
        private dynamicSeriesValues: DataViewBuilderSeriesData[][];

        constructor() {
            this.categories = [];
            this.staticMeasureColumns = [];
            this.dynamicMeasureColumns = [];
            this.columnIndex = 0;
        }

        public withCategory(options: DataViewBuilderCategoryColumnOptions): IDataViewBuilderCategorical {
            let categoryValues = options.values,
                identityFrom = options.identityFrom,
                type = options.source.type;

            let categoryColumn: DataViewCategoryColumn = {
                source: options.source,
                identityFields: options.identityFrom.fields,
                identity: options.identityFrom.identities || [],
                values: categoryValues,
            };

            if (!options.identityFrom.identities) {
                for (let categoryIndex = 0, categoryLength = categoryValues.length; categoryIndex < categoryLength; categoryIndex++) {
                    categoryColumn.identity.push(
                        getScopeIdentity(identityFrom, categoryIndex, categoryValues[categoryIndex], type));
                }
            }

            if (!this.categories)
                this.categories = [];

            this.categories.push(categoryColumn);

            return this;
        }

        public withCategories(categories: DataViewCategoryColumn[]): IDataViewBuilderCategorical {
            if (_.isEmpty(this.categories))
                this.categories = categories;
            else
                Array.prototype.push.apply(this.categories, categories);

            return this;
        }

        /**
         * Adds static series columns.
         *
         * Note that it is illegal to have both dynamic series and static series in a visual DataViewCategorical.  It is only legal to have them both in 
         * a query DataViewCategorical, where DataViewTransform is expected to split them up into separate visual DataViewCategorical objects.
         */
        public withValues(options: DataViewBuilderValuesOptions): IDataViewBuilderCategorical {
            debug.assertValue(options, 'options');

            let columns = options.columns;
            debug.assertValue(columns, 'columns');

            for (let column of columns) {
                this.staticMeasureColumns.push(column.source);
            }

            this.staticSeriesValues = columns;

            return this;
        }

        /**
         * Adds dynamic series columns.
         *
         * Note that it is illegal to have both dynamic series and static series in a visual DataViewCategorical.  It is only legal to have them both in 
         * a query DataViewCategorical, where DataViewTransform is expected to split them up into separate visual DataViewCategorical objects.
         */
        public withGroupedValues(options: DataViewBuilderGroupedValuesOptions): IDataViewBuilderCategorical {
            debug.assertValue(options, 'options');

            let groupColumn = options.groupColumn;
            debug.assertValue(groupColumn, 'groupColumn');

            this.dynamicSeriesMetadata = {
                column: groupColumn.source,
                identityFrom: groupColumn.identityFrom,
                values: groupColumn.values,
            };

            let valueColumns = options.valueColumns;
            for (let valueColumn of valueColumns) {
                this.dynamicMeasureColumns.push(valueColumn.source);
            }

            this.dynamicSeriesValues = options.data;

            return this;
        }

        private fillData(dataViewValues: DataViewValueColumns) {
            let categoryColumn = _.first(this.categories);
            let categoryLength = (categoryColumn && categoryColumn.values) ? categoryColumn.values.length : 0;

            if (this.hasDynamicSeries()) {
                for (let seriesIndex = 0; seriesIndex < this.dynamicSeriesMetadata.values.length; seriesIndex++) {
                    let seriesMeasures = this.dynamicSeriesValues[seriesIndex];
                    debug.assert(seriesMeasures.length === this.dynamicMeasureColumns.length, 'seriesMeasures.length === this.dynamicMeasureColumns.length');

                    for (let measureIndex = 0, measuresLen = this.dynamicMeasureColumns.length; measureIndex < measuresLen; measureIndex++) {
                        let groupIndex = seriesIndex * measuresLen + measureIndex;

                        applySeriesData(dataViewValues[groupIndex], seriesMeasures[measureIndex], categoryLength);
                    }
                }
            }

            if (this.hasStaticSeries()) {
                // Note: when the target categorical has both dynamic and static series, append static measures at the end of the values array.
                let staticColumnsStartingIndex = this.hasDynamicSeries() ? (this.dynamicSeriesValues.length * this.dynamicMeasureColumns.length) : 0;

                for (let measureIndex = 0, measuresLen = this.staticMeasureColumns.length; measureIndex < measuresLen; measureIndex++) {
                    applySeriesData(dataViewValues[staticColumnsStartingIndex + measureIndex], this.staticSeriesValues[measureIndex], categoryLength);
                }
            }
        }

        /**
         * Returns the DataView with metadata and DataViewCategorical.
         * Returns undefined if the combination of parameters is illegal, such as having both dynamic series and static series when building a visual DataView.
         */
        public build(): DataView {
            let metadataColumns: DataViewMetadataColumn[] = [];
            let categorical: DataViewCategorical = {};

            let categoryMetadata = this.categories;
            let dynamicSeriesMetadata = this.dynamicSeriesMetadata;

            // --- Build metadata columns and value groups ---
            for (let columnMetadata of categoryMetadata) {
                pushIfNotExists(metadataColumns, columnMetadata.source);
            }

            if (this.hasDynamicSeries()) {
                // Dynamic series, or Dyanmic & Static series.
                pushIfNotExists(metadataColumns, dynamicSeriesMetadata.column);

                categorical.values = DataViewTransform.createValueColumns([], dynamicSeriesMetadata.identityFrom.fields, dynamicSeriesMetadata.column);

                // For each series value we will make one column per measure
                let seriesValues = dynamicSeriesMetadata.values;
                for (let seriesIndex = 0; seriesIndex < seriesValues.length; seriesIndex++) {
                    let seriesValue = seriesValues[seriesIndex];
                    let seriesIdentity = getScopeIdentity(dynamicSeriesMetadata.identityFrom, seriesIndex, seriesValue, dynamicSeriesMetadata.column.type);

                    for (let measure of this.dynamicMeasureColumns) {

                        // Note related to VSTS 7705322: It is possible that the 'measure' object is part of visual DataView with prototypal inheritance,
                        // in which case _.clone() would not copy any inherited properties. Meanwhile, this builder class can also be used for building
                        // query DataView, hence this code should not produce an inherited object from 'measure'.
                        let column = _.toPlainObject<DataViewMetadataColumn>(measure);

                        column.groupName = <string>seriesValue;

                        pushIfNotExists(metadataColumns, column);
                        categorical.values.push({
                            source: column,
                            values: [],
                            identity: seriesIdentity,
                        });
                    }
                }

                if (this.hasStaticSeries()) {
                    // IMPORTANT: In the Dyanmic & Static series case, the groups array shall not include any static group. This is to match the behavior of production code that creates query DataView objects.
                    // Get the current return value of grouped() before adding static measure columns, an use that as the return value of this categorical.
                    // Otherwise, the default behavior of DataViewValueColumns.grouped() from DataViewTransform.createValueColumns() is to create series groups from all measure columns.
                    let dynamicSeriesGroups = categorical.values.grouped();
                    categorical.values.grouped = () => dynamicSeriesGroups;

                    this.appendStaticMeasureColumns(metadataColumns, categorical.values);
                }
            }
            else {
                // Static series only / no series
                categorical.values = DataViewTransform.createValueColumns();
                this.appendStaticMeasureColumns(metadataColumns, categorical.values);
            }

            let categories = this.categories;
            if (!_.isEmpty(categories))
                categorical.categories = categories;

            // --- Fill in data point values ---
            this.fillData(categorical.values);

            let dataView: DataView = {
                metadata: {
                    columns: metadataColumns,
                },
                categorical: categorical,
            };

            if (this.isLegalDataView(dataView)) {
                return dataView;
            }
        }

        private appendStaticMeasureColumns(metadataColumns: DataViewMetadataColumn[], valueColumns: DataViewValueColumns): void {
            debug.assertValue(metadataColumns, 'metadataColumns');
            debug.assertValue(valueColumns, 'valueColumns');

            if (!_.isEmpty(this.staticMeasureColumns)) {
                for (let column of this.staticMeasureColumns) {
                    pushIfNotExists(metadataColumns, column);
                    valueColumns.push({
                        source: column,
                        values: [],
                    });
                }
            }
        }

        private isLegalDataView(dataView: DataView): boolean {
            if (this.hasDynamicSeries() && this.hasStaticSeries() && CategoricalDataViewBuilder.isVisualDataView(dataView.metadata.columns)) {
                // It is illegal to have both dynamic series and static series in a visual DataViewCategorical,
                // because the DataViewValueColumns interface today cannot express that 100% (see its 'source' property and return value of its 'grouped()' function).
                return false;
            }

            return true;
        }

        /**
         * This function infers that if any metadata column has 'queryName', 
         * then the user of this builder is building a visual DataView (as opposed to query DataView).
         *
         * @param metadataColumns The complete collection of metadata columns in the categorical.
         */
        private static isVisualDataView(metadataColumns: DataViewMetadataColumn[]): boolean {
            return !_.isEmpty(metadataColumns) &&
                _.any(metadataColumns, (metadataColumn) => !!metadataColumn.queryName);
        }

        private hasDynamicSeries(): boolean {
            return !!this.dynamicSeriesMetadata; // In Map visual scenarios, you can have dynamic series without measure columns
        }

        private hasStaticSeries(): boolean {
            return !!this.staticSeriesValues;
        }
    }

    function getScopeIdentity(
        source: DataViewBuilderColumnIdentitySource,
        index: number,
        value: PrimitiveValue,
        valueType: ValueTypeDescriptor): DataViewScopeIdentity {
        let identities = source.identities;
        if (identities) {
            return identities[index];
        }

        debug.assert(source.fields && source.fields.length === 1, 'Inferring identity, expect exactly one field.');

        return createDataViewScopeIdentity(
            SQExprBuilder.equal(
                source.fields[0],
                SQExprBuilder.typedConstant(value, valueType)));
    }

    function pushIfNotExists(items: DataViewMetadataColumn[], itemToAdd: DataViewMetadataColumn): void {
        if (_.contains(items, itemToAdd))
            return;

        items.push(itemToAdd);
    }

    function applySeriesData(target: DataViewValueColumn, source: DataViewBuilderSeriesData, categoryLength: number): void {
        debug.assertValue(target, 'target');
        debug.assertValue(source, 'source');
        debug.assertValue(categoryLength, 'categoryLength');

        let values = source.values;
        debug.assert(categoryLength === values.length || categoryLength === 0, 'categoryLength === values.length || categoryLength === 0');

        target.values = values;

        let highlights = source.highlights;
        if (highlights) {
            debug.assert(categoryLength === highlights.length, 'categoryLength === highlights.length');

            target.highlights = highlights;
        }

        let aggregates: DataViewColumnAggregates;
        if (source.minLocal !== undefined) {
            if (!aggregates)
                aggregates = {};

            aggregates.minLocal = source.minLocal;
        }

        if (source.maxLocal !== undefined) {
            if (!aggregates)
                aggregates = {};

            aggregates.maxLocal = source.maxLocal;
        }

        if (aggregates) {
            target.source.aggregates = aggregates;
            _.extend(target, aggregates);
        }
    }
}