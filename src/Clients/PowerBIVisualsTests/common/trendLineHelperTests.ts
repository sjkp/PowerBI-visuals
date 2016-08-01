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
    import ColorHelper = powerbi.visuals.ColorHelper;
    import DataColorPalette = powerbi.visuals.DataColorPalette;
    import ObjectEnumerationBuilder = powerbi.visuals.ObjectEnumerationBuilder;
    import TrendLineHelper = powerbi.visuals.TrendLineHelper;
    import TrendLine = powerbi.visuals.TrendLine;
    import DataViewTransform = powerbi.data.DataViewTransform;

    describe('TrendLineHelper', () => {
        let samplePoints: powerbi.visuals.IPoint[] = [{ x: 0, y: 0 }, { x: 100, y: 100 }];

        let defaultColors: DataColorPalette;

        beforeEach(() => {
            defaultColors = new DataColorPalette();
        });

        describe('enumerateObjectInstances', () => {
            it('with no trend lines generates a trend line object', () => {
                let enumerationBuilder = new ObjectEnumerationBuilder();
                TrendLineHelper.enumerateObjectInstances(enumerationBuilder, undefined);
                let instances = enumerationBuilder.complete().instances;

                expect(instances.length).toBe(1);
                expect(instances[0]).toEqual({
                    selector: null,
                    properties: {
                        show: false,
                        lineColor: TrendLineHelper.defaults.lineColor,
                        transparency: TrendLineHelper.defaults.transparency,
                        style: TrendLineHelper.defaults.lineStyle,
                        combineSeries: TrendLineHelper.defaults.combineSeries,
                    },
                    objectName: 'trend',
                });
            });

            it('with trend line object', () => {
                let enumerationBuilder = new ObjectEnumerationBuilder();

                let trendLine: TrendLine = {
                    points: samplePoints,
                    show: true,
                    displayName: 'test display name',
                    lineColor: { solid: { color: 'red' } },
                    style: lineStyle.dotted,
                    transparency: 20,
                    combineSeries: true,
                    y2Axis: false,
                    useHighlightValues: TrendLineHelper.defaults.useHighlightValues,
                };

                TrendLineHelper.enumerateObjectInstances(enumerationBuilder, [trendLine]);
                let instances = enumerationBuilder.complete().instances;

                expect(instances[0]).toEqual({
                    selector: null,
                    properties: {
                        show: true,
                        displayName: 'test display name',
                        lineColor: { solid: { color: 'red' } },
                        style: lineStyle.dotted,
                        transparency: 20,
                        combineSeries: true,
                        useHighlightValues: TrendLineHelper.defaults.useHighlightValues,
                    },
                    objectName: 'trend',
                });
            });
        });

        describe('readDataView', () => {
            it('invalid data view', () => {
                expect(TrendLineHelper.readDataView(null, null, false, defaultColors)).toBeUndefined();

                expect(TrendLineHelper.readDataView(
                    { single: { value: 10 }, metadata: { columns: [] } },
                    { single: { value: 10 }, metadata: { columns: [] } },
                    false,
                    defaultColors)).toBeUndefined();

                expect(TrendLineHelper.readDataView(
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
                    false,
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
                expect(TrendLineHelper.readDataView(dataViewWithOnlyCategories, dataViewWithOnlyCategories, false, defaultColors)).toBeUndefined();

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
                expect(TrendLineHelper.readDataView(dataViewWithOnlyValues, dataViewWithOnlyValues, false, defaultColors)).toBeUndefined();
            });

            it('combined series', () => {
                let dataViews = new helpers.TrendLineBuilder({
                    combineSeries: true,
                    multipleSeries: true,
                }).buildDataViews();

                expect(TrendLineHelper.readDataView(dataViews[1], dataViews[0], false, defaultColors)).toEqual([{
                    points: [{ x: 1, y: 10 }, { x: 6, y: 60 }],
                    show: true,
                    displayName: 'trend',
                    lineColor: { solid: { color: '#000' } },
                    transparency: TrendLineHelper.defaults.transparency,
                    style: TrendLineHelper.defaults.lineStyle,
                    combineSeries: true,
                    y2Axis: false,
                    useHighlightValues: TrendLineHelper.defaults.useHighlightValues,
                }]);
            });

            it('grouped data view for multiple series', () => {
                let dataViews = new helpers.TrendLineBuilder({
                    combineSeries: false,
                    dynamicSeries: true,
                    multipleSeries: true,
                }).buildDataViews();

                let sourceDataView = dataViews[0];
                let groups = sourceDataView.categorical.values.grouped();
                let colorHelper = new ColorHelper(defaultColors);

                expect(TrendLineHelper.readDataView(dataViews[1], dataViews[0], false, defaultColors)).toEqual([
                    {
                        points: [{ x: 1, y: 10 }, { x: 6, y: 60 }],
                        show: true,
                        displayName: 'trend',
                        lineColor: { solid: { color: TrendLineHelper.darkenTrendLineColor(colorHelper.getColorForSeriesValue(null, sourceDataView.categorical.values.identityFields, groups[0].name)) } },
                        transparency: TrendLineHelper.defaults.transparency,
                        style: TrendLineHelper.defaults.lineStyle,
                        combineSeries: false,
                        y2Axis: false,
                        useHighlightValues: TrendLineHelper.defaults.useHighlightValues,
                    }, {
                        points: [{ x: 1, y: 15 }, { x: 6, y: 65 }],
                        show: true,
                        displayName: 'trend',
                        lineColor: { solid: { color: TrendLineHelper.darkenTrendLineColor(colorHelper.getColorForSeriesValue(null, sourceDataView.categorical.values.identityFields, groups[1].name)) } },
                        transparency: TrendLineHelper.defaults.transparency,
                        style: TrendLineHelper.defaults.lineStyle,
                        combineSeries: false,
                        y2Axis: false,
                        useHighlightValues: TrendLineHelper.defaults.useHighlightValues,
                    }]);
            });

            describe('explicit colors in source data view are matched', () => {
                it('dynamic series color', () => {
                    let dataViews = new helpers.TrendLineBuilder({
                        combineSeries: false,
                        dynamicSeries: true,
                        multipleSeries: true,
                    }).buildDataViews();

                    let sourceDataView = dataViews[0];
                    let groups = sourceDataView.categorical.values.grouped();
                    groups[1].objects = {
                        dataPoint: {
                            fill: { solid: { color: '#123' } }
                        }
                    };
                    sourceDataView.categorical.values.grouped = () => groups;
                    let colorHelper = new ColorHelper(defaultColors, { objectName: 'dataPoint', propertyName: 'fill' });

                    expect(TrendLineHelper.readDataView(dataViews[1], dataViews[0], false, defaultColors)).toEqual([
                        {
                            points: [{ x: 1, y: 10 }, { x: 6, y: 60 }],
                            show: true,
                            displayName: 'trend',
                            lineColor: { solid: { color: TrendLineHelper.darkenTrendLineColor(colorHelper.getColorForSeriesValue(groups[0].objects, sourceDataView.categorical.values.identityFields, groups[0].name)) } },
                            transparency: TrendLineHelper.defaults.transparency,
                            style: TrendLineHelper.defaults.lineStyle,
                            combineSeries: false,
                            y2Axis: false,
                            useHighlightValues: TrendLineHelper.defaults.useHighlightValues,
                        }, {
                            points: [{ x: 1, y: 15 }, { x: 6, y: 65 }],
                            show: true,
                            displayName: 'trend',
                            lineColor: { solid: { color: TrendLineHelper.darkenTrendLineColor('#123') } },
                            transparency: TrendLineHelper.defaults.transparency,
                            style: TrendLineHelper.defaults.lineStyle,
                            combineSeries: false,
                            y2Axis: false,
                            useHighlightValues: TrendLineHelper.defaults.useHighlightValues,
                        }]);
                });

                it('static series color', () => {
                    let dataViews = new helpers.TrendLineBuilder({
                        combineSeries: false,
                        dynamicSeries: false,
                        multipleSeries: true,
                    }).buildDataViews();

                    let sourceDataView = dataViews[0];
                    sourceDataView.categorical.values[1].source.objects = {
                        dataPoint: {
                            fill: { solid: { color: '#123' } }
                        }
                    };
                    let colorHelper = new ColorHelper(defaultColors, { objectName: 'dataPoint', propertyName: 'fill' });

                    expect(TrendLineHelper.readDataView(dataViews[1], dataViews[0], false, defaultColors)).toEqual([
                        {
                            points: [{ x: 1, y: 10 }, { x: 6, y: 60 }],
                            show: true,
                            displayName: 'trend',
                            lineColor: { solid: { color: TrendLineHelper.darkenTrendLineColor(colorHelper.getColorForMeasure(sourceDataView.categorical.values[0].source.objects, sourceDataView.categorical.values[0].source.queryName)) } },
                            transparency: TrendLineHelper.defaults.transparency,
                            style: TrendLineHelper.defaults.lineStyle,
                            combineSeries: false,
                            y2Axis: false,
                            useHighlightValues: TrendLineHelper.defaults.useHighlightValues,
                        }, {
                            points: [{ x: 1, y: 15 }, { x: 6, y: 65 }],
                            show: true,
                            displayName: 'trend',
                            lineColor: { solid: { color: TrendLineHelper.darkenTrendLineColor('#123') } },
                            transparency: TrendLineHelper.defaults.transparency,
                            style: TrendLineHelper.defaults.lineStyle,
                            combineSeries: false,
                            y2Axis: false,
                            useHighlightValues: TrendLineHelper.defaults.useHighlightValues,
                        }]);
                });
            });

            it('legacy color', () => {
                let dataViews = new helpers.TrendLineBuilder({
                    combineSeries: true,
                }).buildDataViews();

                dataViews[1].categorical.values[0].source.objects = {
                    dataPoint: {
                        fill: { solid: { color: '#123' } },
                    }
                };

                expect(TrendLineHelper.readDataView(dataViews[1], dataViews[0], false, defaultColors)).toEqual([{
                    points: [{ x: 1, y: 10 }, { x: 6, y: 60 }],
                    show: true,
                    displayName: 'trend',
                    lineColor: { solid: { color: '#123' } },
                    transparency: TrendLineHelper.defaults.transparency,
                    style: TrendLineHelper.defaults.lineStyle,
                    combineSeries: true,
                    y2Axis: false,
                    useHighlightValues: TrendLineHelper.defaults.useHighlightValues,
                }]);

                // --- Legacy color overrides line color
                dataViews[1].metadata.objects = {
                    trend: {
                        show: true,
                        displayName: 'legacy',
                        lineColor: { solid: { color: '#456' } }
                    },
                    dataPoint: {
                        fill: { solid: { color: '#123' } },
                    }
                };

                expect(TrendLineHelper.readDataView(dataViews[1], dataViews[0], false, defaultColors)).toEqual([{
                    points: [{ x: 1, y: 10 }, { x: 6, y: 60 }],
                    show: true,
                    displayName: 'legacy',
                    lineColor: { solid: { color: '#123' } },
                    transparency: TrendLineHelper.defaults.transparency,
                    style: TrendLineHelper.defaults.lineStyle,
                    combineSeries: true,
                    y2Axis: false,
                    useHighlightValues: TrendLineHelper.defaults.useHighlightValues,
                }]);
            });

            it('invalid numbers', () => {
                let dataViews = new helpers.TrendLineBuilder({}).buildDataViews();

                let regressionDataView = dataViews[1];
                regressionDataView.categorical.categories[0].values = [20, null];
                regressionDataView.categorical.values[0].values = [NaN, 100];
                regressionDataView.categorical.values.grouped()[0].values[0].values = [NaN, 100];

                expect(TrendLineHelper.readDataView(dataViews[1], dataViews[0], false, defaultColors)).toEqual([{
                    points: [],
                    show: true,
                    displayName: 'trend',
                    lineColor: TrendLineHelper.defaults.lineColor,
                    transparency: TrendLineHelper.defaults.transparency,
                    style: TrendLineHelper.defaults.lineStyle,
                    combineSeries: true,
                    y2Axis: false,
                    useHighlightValues: TrendLineHelper.defaults.useHighlightValues,
                }]);
            });

            it('use y2 axis', () => {
                let dataViews = new helpers.TrendLineBuilder({}).buildDataViews();

                expect(TrendLineHelper.readDataView(dataViews[1], dataViews[0], true, defaultColors)).toEqual([{
                    points: [{ x: 1, y: 10 }, { x: 6, y: 60 }],
                    show: true,
                    displayName: 'trend',
                    lineColor: { solid: { color: '#000' } },
                    transparency: TrendLineHelper.defaults.transparency,
                    style: TrendLineHelper.defaults.lineStyle,
                    combineSeries: true,
                    y2Axis: true,
                    useHighlightValues: TrendLineHelper.defaults.useHighlightValues,
                }]);
            });

            it('useHighlightValues', () => {
                let dataViews = new helpers.TrendLineBuilder({
                    highlights: true,
                }).buildDataViews();

                expect(TrendLineHelper.readDataView(dataViews[1], dataViews[0], false, defaultColors)).toEqual([{
                    points: [{ x: 1, y: 3 }, { x: 6, y: 6 }],
                    show: true,
                    displayName: 'trend',
                    lineColor: { solid: { color: '#000' } },
                    transparency: TrendLineHelper.defaults.transparency,
                    style: TrendLineHelper.defaults.lineStyle,
                    combineSeries: true,
                    y2Axis: false,
                    useHighlightValues: TrendLineHelper.defaults.useHighlightValues,
                }]);
            });
        });

        it('isDataViewForRegression', () => {
            let dataView: powerbi.DataView = {
                single: {
                    value: 10
                },
                metadata: {
                    columns: [
                        {
                            displayName: 'column1',
                            index: 0,
                            isMeasure: true,
                            queryName: 'select1',
                            roles: {
                                'Category': true,
                            },
                            type: powerbi.ValueType.fromDescriptor({ numeric: true }),
                        }
                    ]
                }
            };

            expect(TrendLineHelper.isDataViewForRegression(dataView)).toBe(false);

            dataView.metadata.columns[0].roles['regression.X'] = true;

            expect(TrendLineHelper.isDataViewForRegression(dataView)).toBe(true);
        });
    });
}
