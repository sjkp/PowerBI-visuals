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

module powerbitests.helpers {
    import DataView = powerbi.DataView;
    import DataViewBuilderColumnOptions = powerbi.data.DataViewBuilderColumnOptions;
    import DataViewBuilderSeriesData = powerbi.data.DataViewBuilderSeriesData;
    import DataViewBuilderValuesColumnOptions = powerbi.data.DataViewBuilderValuesColumnOptions;
    import DataViewObjects = powerbi.DataViewObjects;
    import SQExprBuilder = powerbi.data.SQExprBuilder;
    import ValueType = powerbi.ValueType;

    const dashedArray = '5px, 5px';
    const dottedArray = '1px, 5px';

    export interface VerifyTrendLineProperties {
        color: string;
        opacity: number;
        style: string;
    };

    export function verifyTrendLines(lines: JQuery, properties: VerifyTrendLineProperties[]) {
        expect(lines.length).toBe(properties.length);

        lines.each((i, element) => {
            let line = $(element);
            verifyTrendLine(line, properties[i]);
        });
    }

    export function verifyTrendLine(line: JQuery, properties: VerifyTrendLineProperties) {
        helpers.assertColorsMatch(line.css('stroke'), properties.color);

        if (properties.style === powerbi.visuals.lineStyle.dotted)
            expect(line.css('stroke-dasharray')).toEqual(dottedArray);
        else if (properties.style === powerbi.visuals.lineStyle.dashed)
            expect(line.css('stroke-dasharray')).toEqual(dashedArray);
        else
            expect(line.css('stroke-dasharray')).toBeUndefined();

        expect(parseFloat(line.css('stroke-opacity'))).toBeCloseTo(properties.opacity, 3);
    }

    export interface TrendLineBuilderOptions {
        combineSeries?: boolean;
        xIsMeasure?: boolean;
        dynamicSeries?: boolean;
        highlights?: boolean;
        multipleSeries?: boolean;
        yRole?: string;
    }

    let defaultOptions: TrendLineBuilderOptions = {
        combineSeries: true,
        dynamicSeries: true,
        highlights: false,
        multipleSeries: true,
        xIsMeasure: false,
        yRole: 'Y',
    };

    export class TrendLineBuilder {
        private options: TrendLineBuilderOptions;
        private objects: DataViewObjects;

        private sourceDataView: DataView;
        private trendLineDataView: DataView;

        private sourceCategoryField = SQExprBuilder.entity('schema', 'table', 'category_column');
        private sourceSeriesField = SQExprBuilder.entity('schema', 'table', 'series_column');

        constructor(options: TrendLineBuilderOptions) {
            this.options = $.extend(_.clone(defaultOptions), options);
        }

        public withObjects(objects: DataViewObjects): this {
            this.objects = objects;
            return this;
        }

        public buildDataViews(): DataView[] {
            this.sourceDataView = this.buildSourceDataView();
            this.sourceDataView.metadata.objects = this.objects || this.getDefaultObjects();

            this.trendLineDataView = this.buildRegressionDataView();
            this.trendLineDataView.metadata.objects = this.objects || this.getDefaultObjects();

            return [this.sourceDataView, this.trendLineDataView];
        }

        public getTrendLineDataView(): DataView {
            return this.trendLineDataView;
        }

        public getSourceDataView(): DataView {
            return this.sourceDataView;
        }

        private getDefaultObjects(): DataViewObjects {
            return {
                trend: {
                    combineSeries: this.options.combineSeries,
                    show: true,
                    displayName: 'trend',
                }
            };
        }

        private buildSourceDataView(): DataView {
            let options = this.options;
            let builder = powerbi.data.createCategoricalDataViewBuilder();

            let valueColumns: DataViewBuilderColumnOptions[] = [];
            let valueSource: DataViewBuilderSeriesData[][];
            if (options.xIsMeasure) {
                builder.withCategory({
                    identityFrom: {
                        fields: [this.sourceCategoryField],
                    },
                    source: {
                        displayName: 'col1',
                        queryName: 'col1',
                        index: 0,
                        type: ValueType.fromDescriptor({ text: true }),
                        roles: {
                            'Category': true
                        },
                    },
                    values: ['a', 'b', 'c', 'd', 'e', 'f'],
                });

                valueColumns.push({
                    source: {
                        displayName: 'x',
                        queryName: 'x',
                        index: 1,
                        isMeasure: true,
                        type: ValueType.fromDescriptor({ numeric: true }),
                        roles: {
                            'X': true
                        },
                    }
                });

                valueSource = this.sourceDataWithXMeasure;
            }
            else {
                builder.withCategory({
                    identityFrom: {
                        fields: [this.sourceCategoryField],
                    },
                    source: {
                        displayName: 'col1',
                        queryName: 'col1',
                        index: 0,
                        type: ValueType.fromDescriptor({ numeric: true }),
                        roles: {
                            'Category': true
                        },
                    },
                    values: [1, 2, 3, 4, 5, 6],
                });

                valueSource = this.sourceData;
            }
            
            valueColumns.push({
                source: {
                    displayName: 'col3',
                    queryName: 'col3',
                    index: 2,
                    isMeasure: true,
                    type: ValueType.fromDescriptor({ numeric: true }),
                    roles: {
                        [this.options.yRole]: true
                    },
                }
            });

            if (!options.highlights) {
                valueSource = this.withoutHighlights(valueSource);
            }

            if (options.dynamicSeries) {
                let seriesValues: any[];
                if (options.multipleSeries) {
                    seriesValues = ['a', 'b'];
                }
                else {
                    seriesValues = ['a'];
                }

                builder.withGroupedValues({
                    groupColumn: {
                        source: {
                            displayName: 'col2',
                            queryName: 'col2',
                            index: 1,
                            isMeasure: false,
                            type: ValueType.fromDescriptor({ text: true }),
                            roles: {
                                'Series': true
                            },
                        },
                        values: seriesValues,
                        identityFrom: {
                            fields: [this.sourceSeriesField]
                        }
                    },
                    valueColumns: valueColumns,
                    data: valueSource,
                });
            }
            else {
                if (options.multipleSeries) {
                    valueColumns.push({
                        source: {
                            displayName: 'col4',
                            queryName: 'col4',
                            index: 3,
                            isMeasure: true,
                            type: ValueType.fromDescriptor({ numeric: true }),
                            roles: {
                                [this.options.yRole]: true
                            },
                        }
                    });
                }

                let columns: DataViewBuilderValuesColumnOptions[] = [];
                for (let measureIndex = 0; measureIndex < valueColumns.length; measureIndex++) {
                    columns.push({
                        source: valueColumns[measureIndex].source,
                        values: valueSource[measureIndex][0].values,
                        highlights: valueSource[measureIndex][0].highlights,
                    });
                }

                builder.withValues({
                    columns: columns
                });
            }

            return builder.build();
        }

        private buildRegressionDataView(): DataView {
            let options = this.options;
            let builder = powerbi.data.createCategoricalDataViewBuilder();

            builder.withCategory({
                identityFrom: {
                    fields: [SQExprBuilder.columnRef(SQExprBuilder.entity('s', 'RegressionEntity'), 'RegressionCategories')],
                },
                source: {
                    displayName: 'col1Regression',
                    queryName: 'RegressionX',
                    type: ValueType.fromDescriptor({ numeric: true }),
                    roles: {
                        'regression.X': true
                    },
                },
                values: [1, 6],
            });

            let seriesValues: string[];
            if (options.combineSeries || !options.multipleSeries) {
                seriesValues = ['a'];
            }
            else {
                if (options.dynamicSeries) {
                    seriesValues = ['a', 'b'];
                }
                else {
                    seriesValues = ['col3', 'col4'];
                }
            }

            let valueSource = this.regressionData;
            if (!options.highlights)
                valueSource = this.withoutHighlights(valueSource);

            let data: DataViewBuilderSeriesData[][] = [];
            for (let seriesIndex = 0; seriesIndex < seriesValues.length; seriesIndex++) {
                data.push(valueSource[seriesIndex]);
            }

            builder.withGroupedValues({
                groupColumn: {
                    source: {
                        displayName: 'col3Regression',
                        queryName: "RegressionSeries",
                        type: ValueType.fromDescriptor({ text: true }),
                        isMeasure: false,
                        roles: {
                            'regression.Series': true
                        },
                    },
                    values: seriesValues,
                    identityFrom: {
                        fields: [SQExprBuilder.columnRef(SQExprBuilder.entity('s', 'RegressionEntity'), 'RegressionSeries')],
                    }
                },
                valueColumns: [{
                    source: {
                        displayName: 'col3',
                        queryName: 'RegressionY',
                        isMeasure: true,
                        type: ValueType.fromDescriptor({ numeric: true }),
                        roles: {
                            'regression.Y': true
                        },
                    }
                }],
                data: data,
            });
            
            return builder.build();
        }

        private withoutHighlights(data: DataViewBuilderSeriesData[][]): DataViewBuilderSeriesData[][] {
            let newData: DataViewBuilderSeriesData[][] = _.clone(data);
            for (let i = 0; i < data.length; i++) {
                let series = newData[i];
                for (let j = 0; j < series.length; j++) {
                    let column = series[j];
                    column.highlights = undefined;
                }
            }

            return newData;
        }

        private sourceDataWithXMeasure: DataViewBuilderSeriesData[][] = [
            [
                { values: [10, 30, 50, 40, 20, 60], highlights: [1, 3, 5, 4, 2, 6] },  // X
                { values: [60, 20, 50, 10, 30, 40], highlights: [6, 2, 5, 1, 3, 4] },  // Y
            ],
            [
                { values: [35, 55, 45, 25, 65, 15], highlights: [3, 5, 4, 2, 6, 1] },  // X
                { values: [45, 65, 25, 55, 15, 35], highlights: [4, 6, 2, 5, 1, 3] },  // Y
            ]
        ];

        private sourceData: DataViewBuilderSeriesData[][] = [
            [
                { values: [60, 20, 50, 10, 30, 40], highlights: [6, 2, 5, 1, 3, 4] },  // Y
            ],
            [
                { values: [45, 65, 25, 55, 15, 35], highlights: [4, 6, 2, 5, 1, 3] },  // Y
            ]
        ];

        private regressionData: DataViewBuilderSeriesData[][] = [
            [
                { values: [10, 60], highlights: [3, 6] },
            ],
            [
                { values: [15, 65], highlights: [4, 3] },
            ]
        ];
    }
}
