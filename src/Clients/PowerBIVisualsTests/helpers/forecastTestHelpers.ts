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

    export interface VerifyForecastProperties {
        color: string;
        opacity: number;
    };

    export function verifyForecasts(lines: JQuery, confidenceBand: JQuery, properties: VerifyForecastProperties[]) {
        expect(lines.length).toBe(properties.length);
        expect(confidenceBand.length).toBe(properties.length);

        lines.each((i, element) => {
            let line = $(element);
            verifyForecast(line, confidenceBand, properties[i]);
        });
    }

    export function verifyForecast(line: JQuery, confidenceBand: JQuery, properties: VerifyForecastProperties) {
        helpers.assertColorsMatch(line.css('stroke'), properties.color);
        helpers.assertColorsMatch(confidenceBand.css('fill'), properties.color);
        helpers.assertOpacitiesMatch(confidenceBand.css('fill-opacity'), properties.opacity);
    }

    export interface ForecastBuilderOptions {
        yRole?: string;
    }

    export class ForecastBuilder {
        private options: ForecastBuilderOptions;
        private objects: DataViewObjects;

        private sourceDataView: DataView;
        private forecastDataView: DataView;

        private sourceCategoryField = SQExprBuilder.entity('schema', 'table', 'category_column');

        constructor() {
            this.options = {
                yRole: 'Y',
            };
        }

        public withObjects(objects: DataViewObjects): this {
            this.objects = objects;
            return this;
        }

        public buildDataViews(): DataView[] {
            this.sourceDataView = this.buildSourceDataView();
            this.sourceDataView.metadata.objects = this.objects || this.getDefaultObjects();

            this.forecastDataView = this.buildForecastDataView();
            this.forecastDataView.metadata.objects = this.objects || this.getDefaultObjects();

            return [this.sourceDataView, this.forecastDataView];
        }

        public getForecastDataView(): DataView {
            return this.forecastDataView;
        }

        public getSourceDataView(): DataView {
            return this.sourceDataView;
        }

        private getDefaultObjects(): DataViewObjects {
            return {
                forecast: [{
                    id: '1',
                    object: { show: true },
                }]
            };
        }

        private buildSourceDataView(): DataView {
            let builder = powerbi.data.createCategoricalDataViewBuilder();

            let valueColumns: DataViewBuilderColumnOptions[] = [];
            let valueSource: DataViewBuilderSeriesData[][];

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
                values: this.categories,
            });

            valueSource = this.sourceData;

            valueColumns.push({
                source: {
                    displayName: 'col2',
                    queryName: 'col2',
                    index: 1,
                    isMeasure: true,
                    type: ValueType.fromDescriptor({ numeric: true }),
                    roles: {
                        [this.options.yRole]: true
                    },
                }
            });

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

            return builder.build();
        }

        private buildForecastDataView(): DataView {
            let builder = powerbi.data.createCategoricalDataViewBuilder();

            builder.withCategory({
                identityFrom: {
                    fields: [SQExprBuilder.columnRef(SQExprBuilder.entity('s', 'ForecastEntity'), 'ForecastCategories')],
                },
                source: {
                    displayName: 'col1',
                    queryName: 'col1',
                    type: ValueType.fromDescriptor({ numeric: true }),
                    roles: {
                        'Category': true
                    },
                },
                values: this.categories,
            });

            let seriesValues: string[] = ['a'];

            let valueSource = this.forecastData;

            let data: DataViewBuilderSeriesData[][] = [];
            for (let seriesIndex = 0; seriesIndex < seriesValues.length; seriesIndex++) {
                data.push(valueSource[seriesIndex]);
            }

            builder.withGroupedValues({
                groupColumn: {
                    source: {
                        displayName: 'col3',
                        queryName: 'col3',
                        type: ValueType.fromDescriptor({ text: true }),
                        isMeasure: false,
                        roles: {
                            'Series': true
                        },
                    },
                    values: seriesValues,
                    identityFrom: {
                        fields: [SQExprBuilder.columnRef(SQExprBuilder.entity('s', 'ForecastEntity'), 'ForecastSeries')],
                    }
                },
                valueColumns: [
                {
                    source: {
                        displayName: 'Forecast Value',
                        queryName: 'ForecastValue',
                        isMeasure: true,
                        type: ValueType.fromDescriptor({ numeric: true }),
                        roles: {
                            'forecast.ForecastValue': true,
                        },
                    }
                }, {
                    source: {
                        displayName: 'Confidence High Bound',
                        queryName: 'ConfidenceHighBound',
                        isMeasure: true,
                        type: ValueType.fromDescriptor({ numeric: true }),
                        roles: {
                            'forecast.ConfidenceHighBound': true,
                        },
                    }
                }, {
                    source: {
                        displayName: 'Confidence Low Bound',
                        queryName: 'ConfidenceLowBound',
                        isMeasure: true,
                        type: ValueType.fromDescriptor({ numeric: true }),
                        roles: {
                            'forecast.ConfidenceLowBound': true
                        },
                    }
                }],
                data: data,
            });

            return builder.build();
        }

        private categories: powerbi.PrimitiveValue[] = [1, 2, 3, 4, 5, 6];

        private sourceData: DataViewBuilderSeriesData[][] = [
            [
                { values: [60, 20, 50, 10, null, null] }
            ]
        ];

        private forecastData: DataViewBuilderSeriesData[][] = [
            [
                { values: [null, null, null, 10, 40, 0], highlights: [null, null, null, 10, 40, 0] },
                { values: [null, null, null, 10, 50, 15], highlights: [null, null, null, 10, 50, 15] },
                { values: [null, null, null, 10, 30, -15], highlights: [null, null, null, 10, 30, -15] },
            ]
        ];
    }
}
