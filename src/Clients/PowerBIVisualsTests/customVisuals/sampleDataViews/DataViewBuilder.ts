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

module powerbitests.customVisuals.sampleDataViews {
    import SQExprBuilder = powerbi.data.SQExprBuilder;
    import SQExpr = powerbi.data.SQExpr;
    import DataViewBuilderValuesColumnOptions = powerbi.data.DataViewBuilderValuesColumnOptions;
    import DataViewBuilderColumnIdentitySource = powerbi.data.DataViewBuilderColumnIdentitySource;

    export interface DataViewBuilderColumnOptions extends powerbi.data.DataViewBuilderColumnOptions {
        values: any[];
    }

    export interface DataViewBuilderCategoryColumnOptions extends DataViewBuilderColumnOptions {
        objects?: powerbi.DataViewObjects[];
        isGroup?: boolean;
    }

    export interface DataViewBuilderAllColumnOptions {
        categories: DataViewBuilderCategoryColumnOptions[];
        grouped: DataViewBuilderCategoryColumnOptions[];
        values: DataViewBuilderValuesColumnOptions[];
    }

    export abstract class DataViewBuilder {
        static DataViewName: string = "Data";
        private aggregateFunction: (array: number[]) => number = _.sum;

        static setDefaultQueryName(source: powerbi.DataViewMetadataColumn): powerbi.DataViewMetadataColumn {
            if(!source.queryName) {
                debug.assertValue(source && source.displayName, "source.displayName is not defined");
                source.queryName = DataViewBuilder.DataViewName + "." + source.displayName;
            }

            return source;
        }

        static constExpr(fakeValue: string | number | boolean | Date): SQExpr {
            if (fakeValue === null)
                return SQExprBuilder.nullConstant();

            if (fakeValue === true || fakeValue === false)
                return SQExprBuilder.boolean(<boolean>fakeValue);

            if (typeof (fakeValue) === 'number')
                return SQExprBuilder.double(<number>fakeValue);

            if (fakeValue instanceof Date)
                return SQExprBuilder.dateTime(<Date>fakeValue);

            return SQExprBuilder.text(<string>fakeValue);
        }

        static getDataViewBuilderColumnIdentitySources(
            options: DataViewBuilderColumnOptions[] | DataViewBuilderColumnOptions)
            : DataViewBuilderColumnIdentitySource[] {

            let optionsArray: DataViewBuilderColumnOptions[] = <any>(_.isArray(options) ? options : [options]);

            let fields = optionsArray.map(opt => {
                debug.assertValue(opt && opt.source && opt.source.displayName, "source.displayName is not defined");
                return SQExprBuilder.columnRef(
                    SQExprBuilder.entity(undefined, DataViewBuilder.DataViewName), opt.source.displayName);
                });

            let optionsIdentityExpressions: powerbi.data.SQCompareExpr[][] = optionsArray.map((opt, i) => 
                opt.values.map(x => SQExprBuilder.equal(fields[i].source, DataViewBuilder.constExpr(x))));
            let identityExpressions: SQExpr[] = [];

            if(optionsIdentityExpressions.length > 1) {
                let identityExpressionsLength = optionsIdentityExpressions.length;
                let identityExpressionsValuesLength = _.max(_.map(optionsIdentityExpressions, x=>x.length));

                for(let vi = 0; vi < identityExpressionsValuesLength; vi++) {
                    let current: SQExpr = optionsIdentityExpressions[0][vi]; 
                    for(let ci = 1; ci < identityExpressionsLength; ci++) {
                        current = SQExprBuilder.and(current, optionsIdentityExpressions[ci][vi]);
                    }

                    identityExpressions.push(current);
                }
            } else {
                identityExpressions = optionsIdentityExpressions[0];
            }

            return optionsArray.map((opt,i) => <DataViewBuilderColumnIdentitySource>{ 
                    fields: fields,
                    identities: identityExpressions.map(powerbi.data.createDataViewScopeIdentity)
                });
        }

        static getValuesTable(categories?: powerbi.DataViewCategoryColumn[], values?: powerbi.DataViewValueColumn[]): any[][] {
            let columns = _.sortBy((categories || []).concat(<powerbi.DataViewCategoricalColumn[]>values || []), x => x.source.index);
            let maxLength: number = _.max(columns.map(x => x.values.length));
            return _.range(maxLength).map(i => columns.map(x => x.values[i]));
        }

        static createDataViewBuilderColumnOptions(
            categoriesColumns: (DataViewBuilderCategoryColumnOptions | DataViewBuilderCategoryColumnOptions[])[],
            valuesColumns: (DataViewBuilderValuesColumnOptions | DataViewBuilderValuesColumnOptions[])[],
            filter?: (options: DataViewBuilderColumnOptions) => boolean): DataViewBuilderAllColumnOptions {

            let filterColumns = filter
                ? (options) => _.isArray(options.values) && filter(options)
                : (options) => _.isArray(options.values);

            let resultCategoriesColumns = _.isEmpty(categoriesColumns) ? [] : (<DataViewBuilderCategoryColumnOptions[]>_
                .flatten(categoriesColumns)).filter(filterColumns);

            let resultValuesColumns = _.isEmpty(valuesColumns) ? [] : (<DataViewBuilderValuesColumnOptions[]>_
                .flatten(valuesColumns)).filter(filterColumns);

            let allColumns = (resultCategoriesColumns || []).concat(<powerbi.DataViewCategoricalColumn[]>resultValuesColumns || []);
            allColumns.forEach((x: powerbi.DataViewCategoricalColumn,i) => x.source.index = i);

            return { 
                    categories: resultCategoriesColumns.filter(x => !x.isGroup),
                    grouped: resultCategoriesColumns.filter(x => x.isGroup),
                    values: resultValuesColumns
                };
        }

        static setUpDataViewBuilderColumnOptions(
            options: DataViewBuilderAllColumnOptions, 
            aggregateFunction: (array: number[]) => number): DataViewBuilderAllColumnOptions {
            let resultOptions = _.clone(options);
            resultOptions.categories = resultOptions.categories && resultOptions.categories.map(x => _.clone(x));
            resultOptions.values = resultOptions.values && resultOptions.values.map(x => _.clone(x));
            resultOptions.grouped = resultOptions.grouped && resultOptions.grouped.map(x => _.clone(x));;

            if(!_.isEmpty(options.categories)) {
                resultOptions.categories.forEach(x => x.source = DataViewBuilder.setDefaultQueryName(x.source));
                let allRows: any[][] =  DataViewBuilder.getValuesTable(options.categories, options.values);
                let categoriesLength = options.categories.length;
                let grouped = _.toArray(_.groupBy(allRows, x => _.take(x, categoriesLength)));
                resultOptions.categories.forEach((c,i) => c.values = grouped.map(x => x[0][i] === undefined ? null : x[0][i])); 

                if(!_.isEmpty(options.values) && _.isEmpty(options.grouped)) {//Not completed for group categories
                    resultOptions.values.forEach((c,i) =>
                        c.values = grouped.map(v => aggregateFunction(v.map(x => x[categoriesLength + i] || 0)))); 
                }
            }

            if(!_.isEmpty(options.values)) {
                resultOptions.values.forEach(x => x.source = DataViewBuilder.setDefaultQueryName(x.source));
            }

            if(!_.isEmpty(options.grouped)) {
                resultOptions.grouped.forEach(x => x.source = DataViewBuilder.setDefaultQueryName(x.source));
            }

            return resultOptions;
        }

        static setUpDataView(dataView: powerbi.DataView, options: DataViewBuilderAllColumnOptions)
            : powerbi.DataView {
            if(!_.isEmpty(options.categories) && _.isEmpty(options.grouped)) {
                let category = dataView.categorical.categories[0];

                //Tree. (completed only for one category)
                dataView.tree = {
                    root: {
                        childIdentityFields: category.identityFields,
                        children: category.values.map((v,i) => <any>{ values: [v], name: v, identity: category.identity[i] })
                    }
                };

                //Table.
                dataView.table = {
                    columns: dataView.categorical.categories.concat(
                        <powerbi.DataViewCategoricalColumn[]>dataView.categorical.values || []).map(x => x.source),
                    identityFields: category.identityFields,
                    rows: DataViewBuilder.getValuesTable(dataView.categorical.categories, dataView.categorical.values)
                };

                if(_.isEmpty(options.values)) {
                    delete dataView.categorical.values;
                }
            }

            return dataView;
        }

        protected createCategoricalDataViewBuilder(
            categoriesColumns: (DataViewBuilderCategoryColumnOptions | DataViewBuilderCategoryColumnOptions[])[],
            valuesColumns: (DataViewBuilderValuesColumnOptions | DataViewBuilderValuesColumnOptions[])[],
            columnNames: string[]) {
            let builder = powerbi.data.createCategoricalDataViewBuilder();

            let originalOptions = DataViewBuilder.createDataViewBuilderColumnOptions(
                categoriesColumns,
                valuesColumns,
                columnNames && (options => _.contains(columnNames, options.source.displayName)));
            let options = DataViewBuilder.setUpDataViewBuilderColumnOptions(originalOptions, this.aggregateFunction);

            if(!_.isEmpty(options.categories)) {
                let identityFrom = DataViewBuilder.getDataViewBuilderColumnIdentitySources(options.categories);
                builder.withCategories(options.categories.map((category,i) => <powerbi.DataViewCategoryColumn> {
                        source: category.source,
                        values: category.values,
                        objects: category.objects,
                        identity: identityFrom[i].identities,
                        identityFields: identityFrom[i].fields
                    }));
            }

            if(!_.isEmpty(options.grouped)) {
                let groupedCategory = options.grouped[0]; //Finished only for one category.

                let categoryValues = originalOptions.categories 
                    && originalOptions.categories[0] 
                    && originalOptions.categories[0].values 
                    || [];
                let uniqueCategoryValues =_.unique(categoryValues) || [undefined];
                let uniqueGroupedValues = _.unique(groupedCategory.values);

                builder.withGroupedValues({
                    groupColumn: <powerbi.data.DataViewBuilderCategoryColumnOptions> {
                            source: groupedCategory.source,
                            values: uniqueGroupedValues,
                            identityFrom: DataViewBuilder.getDataViewBuilderColumnIdentitySources(groupedCategory)[0]
                        },
                    valueColumns: options.values.map(x => <DataViewBuilderColumnOptions>{ source: x.source }),
                    data: uniqueGroupedValues.map(groupedValue => options.values.map((column, columnIndex) => 
                        <powerbi.data.DataViewBuilderSeriesData>{
                            values: column.values && uniqueCategoryValues
                                .map(categoryValue => {
                                    let index = _.findIndex(d3.range(categoryValues.length), 
                                        i => categoryValues[i] === categoryValue && groupedCategory.values[i] === groupedValue);
                                    return column.values[index] === undefined ? null : column.values[index];
                                }),
                            highlights: column.highlights,
                            minLocal: column.minLocal,
                            maxLocal: column.maxLocal
                        }))
                    }); 
            } else if(!_.isEmpty(options.values)) {
                 builder.withValues({ columns: options.values });
            }

            let builderBuild = builder.build.bind(builder);
            builder.build = () => DataViewBuilder.setUpDataView(builderBuild(), options);

            return builder;
        }

        public abstract getDataView(columnNames?: string[]): powerbi.DataView;
    }
}