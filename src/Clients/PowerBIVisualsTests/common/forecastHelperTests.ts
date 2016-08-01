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

module powerbitests {
    import lineStyle = powerbi.visuals.lineStyle;
    import DataColorPalette = powerbi.visuals.DataColorPalette;
    import ObjectEnumerationBuilder = powerbi.visuals.ObjectEnumerationBuilder;
    import ForecastHelper = powerbi.visuals.ForecastHelper;
    import Forecast = powerbi.visuals.Forecast;
    import DataViewTransform = powerbi.data.DataViewTransform;

    describe('ForecastHelper', () => {
        describe('enumerateObjectInstances', () => {
            it('with no forecast generates a default forecast object', () => {
                let enumerationBuilder = new ObjectEnumerationBuilder();
                ForecastHelper.enumerateObjectInstances(enumerationBuilder, undefined);
                let instances = enumerationBuilder.complete().instances;

                expect(instances.length).toBe(1);
                expect(instances[0]).toEqual({
                    selector: {
                        id: '0'
                    },
                    properties: {
                        show: false,
                        lineColor: ForecastHelper.defaults.lineColor,
                        confidenceBandStyle: ForecastHelper.defaults.confidenceBandStyle,
                        transparency: ForecastHelper.defaults.transparency,
                        style: ForecastHelper.defaults.style
                    },
                    objectName: 'forecast',
                });
            });

            it('with forecast object', () => {
                let enumerationBuilder = new ObjectEnumerationBuilder();

                let forecast: Forecast = {
                    id: '1',
                    points: [{
                        point: { x: 0, y: 0 },
                        upperBound: { x: 50, y: 50 },
                        lowerBound: { x: -50, y: -50 },
                    }, {
                        point: { x: 100, y: 100 },
                        upperBound: { x: 150, y: 150 },
                        lowerBound: { x: 50, y: 50 },
                    }, {
                        point: { x: 50, y: 50 },
                        upperBound: { x: 100, y: 100 },
                        lowerBound: { x: 0, y: 0 },
                    }],
                    show: true,
                    lineColor: { solid: { color: 'red' } },
                    confidenceBandStyle: powerbi.visuals.confidenceBandStyle.fill,
                    transparency: 80,
                    style: lineStyle.solid
                };

                ForecastHelper.enumerateObjectInstances(enumerationBuilder, forecast);
                let instances = enumerationBuilder.complete().instances;

                expect(instances[0]).toEqual({
                    selector: {
                        id: '1'
                    },
                    properties: {
                        show: true,
                        lineColor: { solid: { color: 'red' } },
                        confidenceBandStyle: powerbi.visuals.confidenceBandStyle.fill,
                        transparency: 80,
                        style: lineStyle.solid
                    },
                    objectName: 'forecast',
                });
            });
        });

        describe('readDataView', () => {
            it('invalid data view', () => {
                let defaultColors = new DataColorPalette();
                expect(ForecastHelper.readDataView(null, null, defaultColors)).toBeUndefined();

                expect(ForecastHelper.readDataView(
                    { single: { value: 10 }, metadata: { columns: [] } },
                    { single: { value: 10 }, metadata: { columns: [] } },
                    defaultColors)).toBeUndefined();

                expect(ForecastHelper.readDataView(
                    {
                        categorical: {
                            categories: [],
                            values: DataViewTransform.createValueColumns(),
                        },
                        metadata: {
                            columns: []
                        },
                    },
                    {
                        categorical: {
                            categories: [],
                            values: DataViewTransform.createValueColumns(),
                        },
                        metadata: {
                            columns: []
                        },
                    },
                    defaultColors)).toBeUndefined();

                // Only category column
                let categoryField = powerbi.data.SQExprBuilder.entity('schema', 'table', 'category_column');
                let categoryValues = ['a', 'b'];
                let dataViewWithOnlyCategories = powerbi.data.createCategoricalDataViewBuilder().withCategory({
                    identityFrom: {
                        fields: [categoryField],
                        identities: _.map(categoryValues, v => mocks.dataViewScopeIdentity(v))
                    },
                    source: {
                        displayName: 'category column',
                        isMeasure: false,
                        index: 0,
                        queryName: 'select1',
                        roles: { 'Category': true },
                        type: powerbi.ValueType.fromDescriptor({ text: true }),
                    },
                    values: categoryValues
                }).build();
                expect(ForecastHelper.readDataView(dataViewWithOnlyCategories, dataViewWithOnlyCategories, defaultColors)).toBeUndefined();

                // Only value column
                let dataViewWithOnlyValues = powerbi.data.createCategoricalDataViewBuilder().withValues({
                    columns: [
                        {
                            source: {
                                displayName: 'value column',
                                isMeasure: false,
                                index: 0,
                                queryName: 'select1',
                                roles: { 'Y': true },
                                type: powerbi.ValueType.fromDescriptor({ numeric: true }),
                            },
                            values: [1],
                        }
                    ]
                }).build();
                expect(ForecastHelper.readDataView(dataViewWithOnlyValues, dataViewWithOnlyValues, defaultColors)).toBeUndefined();
            });

            it('valid data view', () => {
                let defaultColors = new DataColorPalette();
                let dataViews = new helpers.ForecastBuilder().buildDataViews();

                expect(ForecastHelper.readDataView(dataViews[1], dataViews[0], defaultColors)).toEqual({
                    id: '1',
                    points: [
                        {
                            point: { x: 4, y: 10 },
                            upperBound: { x: 4, y: 10 },
                            lowerBound: { x: 4, y: 10 }
                        }, {
                            point: { x: 5, y: 40 },
                            upperBound: { x: 5, y: 50 },
                            lowerBound: { x: 5, y: 30 }
                        }, {
                            point: { x: 6, y: 0 },
                            upperBound: { x: 6, y: 15 },
                            lowerBound: { x: 6, y: -15 }
                        }
                    ],
                    show: true,
                    lineColor: { solid: { color: '#000' } },
                    confidenceBandStyle: powerbi.visuals.confidenceBandStyle.fill,
                    transparency: 80,
                    style: lineStyle.solid
                });
            });
        });

        it('isDataViewForForecast', () => {
            let dataViews = new helpers.ForecastBuilder().buildDataViews();
            expect(ForecastHelper.isDataViewForForecast(dataViews[0])).toBe(false);
            expect(ForecastHelper.isDataViewForForecast(dataViews[1])).toBe(true);
        });
    });
}
