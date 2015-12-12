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
    import DataViewTransform = powerbi.data.DataViewTransform;
    import DonutChart = powerbi.visuals.DonutChart;
    import DonutData = powerbi.visuals.DonutData;
    import DonutDataPoint = powerbi.visuals.DonutDataPoint;
    import SelectionId = powerbi.visuals.SelectionId;
    import LegendPosition = powerbi.visuals.LegendPosition;
    import ValueType = powerbi.ValueType;
    import PrimitiveType = powerbi.PrimitiveType;
    import buildSelector = powerbitests.helpers.buildSelectorForColumn;
    import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
    import PixelConverter = jsCommon.PixelConverter;

    let donutColors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

    powerbitests.mocks.setLocale();

    describe("DonutChart", () => {
        let dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'col1', queryName: 'col1', },
                { displayName: 'col2', queryName: 'col2', isMeasure: true }]
        };

        let dataViewMetadataWithFormats: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'col1', queryName: 'col1', format: '$0' },
                { displayName: 'col2', queryName: 'col2', format: '#,0', isMeasure: true, }]
        };

        let seriesMetaData: powerbi.DataViewMetadataColumn = { displayName: 'series', queryName: 'series' };
        let measureColumnDynamic1: powerbi.DataViewMetadataColumn = { displayName: 'sales', queryName: 'selectSales', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), groupName: 'A' };
        let measureColumnDynamic2: powerbi.DataViewMetadataColumn = { displayName: 'sales', queryName: 'selectSales', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), groupName: 'B' };
        let measureColumnDynamic1WithFormats: powerbi.DataViewMetadataColumn = { displayName: 'sales', queryName: 'selectSales', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), objects: { general: { formatString: '$0' } }, groupName: 'A' };
        let measureColumnDynamic2WithFormats: powerbi.DataViewMetadataColumn = { displayName: 'sales', queryName: 'selectSales', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), objects: { general: { formatString: '#,0' } }, groupName: 'B' };
        
        let dataViewMetadata3Measure: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'col1', queryName: 'col1', isMeasure: true, },
                { displayName: 'col2', queryName: 'col2', isMeasure: true, },
                { displayName: 'col3', queryName: 'col3', isMeasure: true, }]
        };

        let dataViewMetadata1Category2Measure: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'col1', queryName: 'col1',  },
                { displayName: 'col2', queryName: 'col2', isMeasure: true, },
                { displayName: 'col3', queryName: 'col3', isMeasure: true, }]
        };

        let dataViewMetadata1Category2MeasureWithFormat: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'col1', queryName: 'col1',},
                { displayName: 'col2', queryName: 'col2', isMeasure: true, objects: { general: { formatString: "\$#,0;(\$#,0);\$#,0" } } },
                { displayName: 'col3', queryName: 'col3', isMeasure: true, }]
        };

        let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });

        it('DonutChart registered capabilities', () => {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('donutChart').capabilities).toBe(powerbi.visuals.donutChartCapabilities);
        });

        it('Capabilities should not suppressDefaultTitle', () => {
            expect(powerbi.visuals.donutChartCapabilities.suppressDefaultTitle).toBeUndefined();
        });

        it('Donutchart preferred capabilities requires at least 2 row', () => {
            let dataViewWithSingleRow: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['a'],
                        identity: [mocks.dataViewScopeIdentity('a')]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100],
                        subtotal: 100
                    }])
                }
            };

            let dataViewWithTwoRows: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['a', 'b'],
                        identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b')]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200],
                        subtotal: 300
                    }])
                }
            };

            let plugin = powerbi.visuals.visualPluginFactory.create().getPlugin('donutChart');
            expect(powerbi.DataViewAnalysis.supports(dataViewWithSingleRow, plugin.capabilities.dataViewMappings[0], true)).toBe(false);
            expect(powerbi.DataViewAnalysis.supports(dataViewWithTwoRows, plugin.capabilities.dataViewMappings[0])).toBe(true);
        });

        describe("Data Labels", () => {
            let v: powerbi.IVisual;
            let element: JQuery;
            let hostServices = powerbitests.mocks.createVisualHostServices();
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                        queryName: 'col1',
                    },
                    {
                        displayName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        queryName: 'col2',
                    }],
            };

            beforeEach(() => {
                element = powerbitests.helpers.testDom('500', '650');
                v = powerbi.visuals.visualPluginFactory.createMinerva({}).getPlugin('donutChart').create();
                v.init({
                    element: element,
                    host: hostServices,
                    style: powerbi.visuals.visualStyles.create(),
                    viewport: {
                        height: element.height(),
                        width: element.width()
                    },
                    animation: { transitionImmediate: true },
                });
            });

            function getOptionsForValueWarning(values: number[]) {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true },
                    categoryLabels: { show: true }
                };

                let options = {
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: values,
                            }])
                        }
                    }]
                };

                return options;
            }

            it('NaN in values shows a warning', (done) => {
                let warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                let options = getOptionsForValueWarning([300, NaN, 700]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).toHaveBeenCalled();
                    expect(warningSpy.calls.count()).toBe(1);
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('GeometryCulledWarning');
                    done();
                }, DefaultWaitForRender);
            });

            it('Negative Infinity in values shows a warning', (done) => {
                let warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                let options = getOptionsForValueWarning([300, Number.NEGATIVE_INFINITY, 700]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).toHaveBeenCalled();
                    expect(warningSpy.calls.count()).toBe(1);
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('GeometryCulledWarning');
                    done();
                }, DefaultWaitForRender);
            });

            it('Positive Infinity in values shows a warning', (done) => {
                let warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                let options = getOptionsForValueWarning([300, Number.POSITIVE_INFINITY, 700]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).toHaveBeenCalled();
                    expect(warningSpy.calls.count()).toBe(1);
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('GeometryCulledWarning');
                    done();
                }, DefaultWaitForRender);
            });

            it('Out of range value in values shows a warning', (done) => {
                let warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                let options = getOptionsForValueWarning([300, 1e301, 700]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).toHaveBeenCalled();
                    expect(warningSpy.calls.count()).toBe(1);
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('GeometryCulledWarning');
                    done();
                }, DefaultWaitForRender);
            });

            it('All are good in values does not show warning', (done) => {
                let warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                let options = getOptionsForValueWarning([300, 200, 700]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).toHaveBeenCalledWith([]);
                    done();
                }, DefaultWaitForRender);
            });

            it('Layout - with labels and without',(done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelPrecision: 0 },
                    categoryLabels: { show: false }
                };

                let dataViews = [{
                    metadata: dataViewMetadataWithLabels,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataWithLabels.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataWithLabels.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }];
                
                v.onDataChanged({
                    dataViews: dataViews,
                });

                setTimeout(() => {
                    let dataLabelsWidth = v['radius'];
                    dataViewMetadataWithLabels.objects['labels']['show'] = false;
                    dataViewMetadataWithLabels.objects['categoryLabels']['show'] = true;
                    dataViews[0].metadata = dataViewMetadataWithLabels;
                    v.onDataChanged({
                        dataViews: dataViews,
                    });
                    setTimeout(() => {
                        let categoryLabelsWidth = v['radius'];
                        dataViewMetadataWithLabels.objects['labels']['show'] = false;
                        dataViewMetadataWithLabels.objects['categoryLabels']['show'] = false;
                        dataViews[0].metadata = dataViewMetadataWithLabels;
                        v.onDataChanged({
                            dataViews: dataViews,
                        });
                        setTimeout(() => {
                            let noLabelsWidth = v['radius'];
                            expect(dataLabelsWidth).toEqual(categoryLabelsWidth);
                            expect(noLabelsWidth).toBeGreaterThan(categoryLabelsWidth);
                            done();
                        }, DefaultWaitForRender);
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });

            it('Show the correct text - measure and category', (done) => {

                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelPrecision: 0 },
                    categoryLabels: { show: true }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    let labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toBe("a (100)");
                    expect($(labels[1]).text()).toBe("b (200)");
                    expect($(labels[2]).text()).toBe("c (700)");
                    done();
                }, DefaultWaitForRender);
            });

            it('Show the correct text - measure with default display units from model', (done) => {

                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, },
                    categoryLabels: { show: true }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [12345, 15533, 776],
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    let labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toBe("a (12.35K)");
                    expect($(labels[1]).text()).toBe("b (15.53K)");
                    expect($(labels[2]).text()).toBe("c (0.78K)");
                    done();
                }, DefaultWaitForRender);
            });

            it('Show the correct text - measure with display units and no precision', (done) => {

                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelDisplayUnits: 1000, labelPrecision: 0 },
                    categoryLabels: { show: true }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [12345, 15533, 776],
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    let labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toBe("a (12K)");
                    expect($(labels[1]).text()).toBe("b (16K)");
                    expect($(labels[2]).text()).toBe("c (1K)");
                    done();
                }, DefaultWaitForRender);
            });

            it('Show the correct text - measure with display units and precision', (done) => {

                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelDisplayUnits: 1000000, labelPrecision: 3 },
                    categoryLabels: { show: true }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [12345, 15533, 776],
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    let labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toBe("a (0.012M)");
                    expect($(labels[1]).text()).toBe("b (0.016M)");
                    expect($(labels[2]).text()).toBe("c (0.001M)");
                    done();
                }, DefaultWaitForRender);
            });

            it('Show the correct text - measure', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelPrecision: 0, },
                    categoryLabels: { show: false }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    let labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toBe("100");
                    expect($(labels[1]).text()).toBe("200");
                    expect($(labels[2]).text()).toBe("700");
                    done();
                }, DefaultWaitForRender);
            });

            it('Show the correct text - category', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: false },
                    categoryLabels: { show: true }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    let labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toBe("a");
                    expect($(labels[1]).text()).toBe("b");
                    expect($(labels[2]).text()).toBe("c");
                    done();
                }, DefaultWaitForRender);
            });

            it('No data labels', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: false },
                    categoryLabels: { show: false }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    let label = element.find('.donutChart .labels').find('text');
                    expect($(label[0]).length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            });

            it('Verify data labels - default style', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true },
                    categoryLabels: { show: false }
                };

                let labelColor = powerbi.visuals.dataLabelUtils.defaultLabelColor;
                let opacity = '1';
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    let labels = element.find('.donutChart .labels').find('text');
                    let fill = $(labels[0]).css('fill');
                    helpers.assertColorsMatch(fill, labelColor);
                    expect($(labels[0]).css('opacity')).toBe(opacity);
                    done();
                }, DefaultWaitForRender);
            });

            it('check color for legend title and legend items donut chart', (done) => {
                let labelColor = powerbi.visuals.dataLabelUtils.defaultLabelColor;
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);

                dataViewMetadataWithLabels.objects = {
                    labels: { show: true },
                    categoryLabels: { show: false },
                    legend: {
                        titleText: 'my title text',
                        show: true,
                        showTitle: true,
                        labelColor: { solid: { color: labelColor } },
                    },
                };
                
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    let legend = element.find('.legend');
                    let legendTitle = legend.find('.legendTitle');
                    let legendText = legend.find('.legendItem').find('.legendText');
                    helpers.assertColorsMatch(legendTitle.css('fill'), labelColor);
                    helpers.assertColorsMatch(legendText.first().css('fill'), labelColor);
                    done();
                }, DefaultWaitForRender);
            });

            it('check font size for legend title and legend items donut chart', (done) => {
                let labelFontSize = 13;
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);

                dataViewMetadataWithLabels.objects = {
                    labels: { show: true },
                    categoryLabels: { show: false },
                    legend: {
                        titleText: 'my title text',
                        show: true,
                        showTitle: true,
                        fontSize: labelFontSize,
                    },
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    let legend = element.find('.legend');
                    let legendTitle = legend.find('.legendTitle');
                    let legendText = legend.find('.legendItem').find('.legendText');
                    expect(Math.round(parseInt(legendTitle.css('font-size'), 10))).toBe(Math.round(parseInt(PixelConverter.fromPoint(labelFontSize), 10)));
                    expect(Math.round(parseInt(legendText.css('font-size'), 10))).toBe(Math.round(parseInt(PixelConverter.fromPoint(labelFontSize), 10)));
                    done();
                }, DefaultWaitForRender);
            });

            it('Verify data labels - changing measure color', (done) => {
                let color = { solid: { color: "rgb(255, 0, 0)" } }; // Red
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, color: color },
                    categoryLabels: { show: false }
                };
                
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    let labels = element.find('.donutChart .labels').find('text');
                    let fill = $(labels[0]).css('fill');
                    helpers.assertColorsMatch(fill, color.solid.color);
                    done();
                }, DefaultWaitForRender);
            });

            it('Verify data labels - changing category color', (done) => {
                let color = { solid: { color: "rgb(255, 0, 0)" } }; // Red
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: false, color: color },
                    categoryLabels: { show: true }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    let labels = element.find('.donutChart .labels').find('text');
                    let fill = $(labels[0]).css('fill');
                    helpers.assertColorsMatch(fill, color.solid.color);
                    done();
                }, DefaultWaitForRender);
            });

            it('Long data labels - big viewport', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: false },
                    categoryLabels: { show: true }
                };

                v.onResizing({ height: 600, width: 1000 });

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['abcdefghijklmnopqrstuvwxyz', '01234567890123456789', 'abcdefg', 'd', 'e'],
                                identity: [mocks.dataViewScopeIdentity('abcdefghijklmnopqrstuvwxyz'),
                                    mocks.dataViewScopeIdentity('01234567890123456789'),
                                    mocks.dataViewScopeIdentity('abcdefg'),
                                    mocks.dataViewScopeIdentity('d'),
                                    mocks.dataViewScopeIdentity('e')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [110, 120, 130, 140, 150],
                                subtotal: 650
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    let labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toBe("abcdefghijklmnopqrstuvwxyz");
                    expect($(labels[1]).text()).toBe("01234567890123456789");
                    expect($(labels[2]).text()).toBe("abcdefg");
                    expect($(labels[3]).text()).toBe("d");
                    expect($(labels[4]).text()).toBe("e");
                    done();
                }, DefaultWaitForRender);
            });

            it('Long data labels - small viewport', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: false },
                    categoryLabels: { show: true }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz', '01234567890123456789', 'abcdefg', 'd', 'e'],
                                identity: [mocks.dataViewScopeIdentity('abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz'),
                                    mocks.dataViewScopeIdentity('01234567890123456789'),
                                    mocks.dataViewScopeIdentity('abcdefg'),
                                    mocks.dataViewScopeIdentity('d'),
                                    mocks.dataViewScopeIdentity('e')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [110, 120, 130, 140, 150],
                                subtotal: 650
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    let labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toContain('…');
                    expect($(labels[1]).text()).toContain('…');
                    expect($(labels[2]).text()).toBe("abcdefg");
                    expect($(labels[3]).text()).toBe("d");
                    expect($(labels[4]).text()).toBe("e");
                    done();
                }, DefaultWaitForRender);
            });

            it('data labels visibility after resizing', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelPrecision: 0 },
                    categoryLabels: { show: true }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,

                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'),
                                    mocks.dataViewScopeIdentity('b'),
                                    mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [110, 120, 130],
                                subtotal: 360
                            }])
                        }
                    }]
                });
                v.onResizing({
                    height: 600,
                    width: 600,
                });
                setTimeout(() => {
                    let labels = element.find('.donutChart .labels').find('text');
                    expect(labels.length).toBe(3);
                    done();
                }, DefaultWaitForRender);
            });

            it('Data lables with null', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: false },
                    categoryLabels: { show: true }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    let labels = element.find('.donutChart .labels').find('text');
                    expect(labels.length).toBe(3);
                    done();
                }, DefaultWaitForRender);
            });

            it('Verify font size', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, fontSize: 15, },
                    categoryLabels: { show: true }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    let labels = element.find('.donutChart .labels').find('text');
                    expect(labels.first().css('font-size')).toBe(15 * 4 / 3 + 'px');
                    done();
                }, DefaultWaitForRender);
            });

            it('Data labels with multiple formats', (done) => {
                //override view port size
                element = powerbitests.helpers.testDom('1500', '1500');
                v.init({
                    element: element,
                    host: hostServices,
                    style: powerbi.visuals.visualStyles.create(),
                    viewport: {
                        height: element.height(),
                        width: element.width()
                    },
                    animation: { transitionImmediate: true },
                });
                let dataViewMetadataWithLabels: powerbi.DataViewMetadata = {
                    columns: [
                        {
                            displayName: 'col1',
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                            queryName: 'col1',
                        },
                        {
                            displayName: 'col2',
                            isMeasure: true,
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                            queryName: 'col1',
                            format: '%#,0',
                        },
                        {
                            displayName: 'col3',
                            isMeasure: true,
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                            queryName: 'col3',
                            format: '#,0'
                        }],
                    objects: {
                        labels: { show: true, labelPrecision: 0, labelDisplayUnits: null },
                        categoryLabels: { show: false }
                    }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [10,20,30],
                            }, {
                                    source: dataViewMetadataWithLabels.columns[2],
                                    values: [100,2000, 7000],
                                }])
                        }
                    }]
                });
                setTimeout(() => {
                    let labels = element.find('.donutChart .labels').find('text');
                    expect(labels.first().text()).toBe('%1,000');
                    expect(labels.last().text()).toBe('7,000');
                    done();
                }, DefaultWaitForRender);
            });

            it('Circular margin validation ', (done) => {

                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, },
                    categoryLabels: { show: true }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [12345, 15533, 776],
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    let labels = element.find('.donutChart .labels').find('text');
                    //The first label is most right, the second label is most left
                    expect($(labels[0]).attr('x')).toBeGreaterThan($(labels[1]).attr('x'));
                    expect($(labels[0]).attr('x')).toBeGreaterThan($(labels[2]).attr('x'));
                    expect($(labels[2]).attr('x')).toBeGreaterThan($(labels[1]).attr('x'));
                    //The last label is top, the second label is button.
                    expect($(labels[1]).attr('y')).toBeGreaterThan($(labels[0]).attr('y'));
                    expect($(labels[1]).attr('y')).toBeGreaterThan($(labels[2]).attr('y'));
                    expect($(labels[0]).attr('y')).toBeGreaterThan($(labels[2]).attr('y'));
                    done();
                }, DefaultWaitForRender);
            });
        });

        describe('converter', () => {
            let categoryIdentities = [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')];

            it('empty', () => {

                let dataView: powerbi.DataView = {
                    categorical: {
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [],
                                subtotal: 0
                            }])
                        }
                    },
                    metadata: dataViewMetadata,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let expectSlices: DonutData = {
                    dataPointsToDeprecate: [],
                    dataPointsToEnumerate: [],
                    dataPoints: [],
                    unCulledDataPoints: [],
                    legendData: { title: "", dataPoints: [], labelColor: powerbi.visuals.LegendData.DefaultLegendLabelFillColor, fontSize: powerbi.visuals.SVGLegend.DefaultFontSizeInPt },
                    hasHighlights: false,
                    dataLabelsSettings: powerbi.visuals.dataLabelUtils.getDefaultDonutLabelSettings(),
                    legendObjectProperties: undefined,
                    maxValue: 0,
                    visibleGeometryCulled: false,
                };
                expect(actualData).toEqual(expectSlices);
            });

            it('categorical, with infinity', () => {
                let dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [-300, null, Number.POSITIVE_INFINITY]
                        }])
                    },
                    metadata: dataViewMetadata,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithIdAndMeasureAndCategory(categoryId, null, dataViewMetadata.columns[0].queryName));
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        measure: -300,
                        value: Math.abs(-300/Number.MAX_VALUE),
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-300" }],
                        color: sliceColors[0],
                    }, {
                        identity: selectionIds[1],
                        measure: 0,
                        value: 0.0,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                        color: sliceColors[1],
                    }, {
                        identity: selectionIds[2],
                        measure: Number.MAX_VALUE,
                        value: 1,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "+Infinity" }],
                        color: sliceColors[2],
                    }].map(buildDataPoint);

                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);

                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
            });

            it('categorical, with slicing', () => {
                let dataView: powerbi.DataView = {
                    categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['a', 'b', 'c'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [-300, null, 700]
                    }])
                    },
                    metadata: dataViewMetadata,
                };
                
                let actualData = DonutChart.converter(dataView, donutColors);
                let selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithIdAndMeasureAndCategory(categoryId, null, dataViewMetadata.columns[0].queryName));
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let expectSlices: DonutDataPoint[] = [
                        {
                            identity: selectionIds[0],
                            measure: -300,
                            value: 0.3,
                            index: 0,
                            label: 'a',
                            tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-300" }],
                            color: sliceColors[0],
                        }, {
                            identity: selectionIds[1],
                            measure: 0,
                            value: 0.0,
                            index: 1,
                            label: 'b',
                            tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                            color: sliceColors[1],
                        }, {
                            identity: selectionIds[2],
                            measure: 700,
                            value: 0.7,
                            index: 2,
                            label: 'c',
                            tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "700" }],
                            color: sliceColors[2],
                    }].map(buildDataPoint);

                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);

                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
            });

            it('categorical, no slicing', () => {
                let dataView: powerbi.DataView = {
                    categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['a', 'b', 'c'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [-300, null, 700]
                    }])
                    },
                    metadata: dataViewMetadata,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithIdAndMeasureAndCategory(categoryId, null, dataViewMetadata.columns[0].queryName));
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let expectSlices: DonutDataPoint[] = [
                        {
                            identity: selectionIds[0],
                            measure: -300,
                            value: 0.3,
                            index: 0,
                            label: 'a',
                            tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-300" }],
                            color: sliceColors[0],
                        }, {
                            identity: selectionIds[1],
                            measure: 0,
                            value: 0.0,
                            index: 1,
                            label: 'b',
                            tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                            color: sliceColors[1]
                        }, {
                            identity: selectionIds[2],
                            measure: 700,
                            value: 0.7,
                            index: 2,
                            label: 'c',
                            tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "700" }],
                            color: sliceColors[2],
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
            });

            it('category and series, with slicing', () => {

                let dataView: powerbi.DataView = {
                    categorical: {
                    categories: [{
                        source: dataViewMetadata1Category2Measure.columns[0],
                        values: ['a', 'b', 'c'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata1Category2Measure.columns[1],
                        values: [-200, null, 150],
                        identity: mocks.dataViewScopeIdentity('foo'),
                    }, {
                        source: dataViewMetadata1Category2Measure.columns[2],
                        values: [-300, 300, -50],
                        identity: mocks.dataViewScopeIdentity('bar'),
                    }])
                    },
                    metadata: dataViewMetadata1Category2Measure,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let v = dataView.categorical.values;
                let categoryQueryName = dataView.categorical.categories[0].source.queryName;
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(v[0].source.queryName, v[0].identity, buildSelector(categoryQueryName, categoryIdentities[0])), null),
                        measure: -200,
                        value: 0.2,
                        index: 0,
                        label: 'col2',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-200" }],
                        color: sliceColors[0],
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(v[1].source.queryName, v[1].identity, buildSelector(categoryQueryName, categoryIdentities[0])), null),
                        measure: -300,
                        value: 0.3,
                        index: 0,
                        label: 'col3',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col3", value: "-300" }],
                        color: sliceColors[0],
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(v[0].source.queryName, v[0].identity, buildSelector(categoryQueryName, categoryIdentities[1])), null),
                        measure: 0,
                        value: 0.0,
                        index: 1,
                        label: 'col2',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                        color: sliceColors[1],
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(v[1].source.queryName, v[1].identity, buildSelector(categoryQueryName, categoryIdentities[1])), null),
                        measure: 300,
                        value: 0.3,
                        index: 1,
                        label: 'col3',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col3", value: "300" }],
                        color: sliceColors[1],
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(v[0].source.queryName, v[0].identity, buildSelector(categoryQueryName, categoryIdentities[2])), null),
                        measure: 150,
                        value: 0.15,
                        index: 2,
                        label: 'col2',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "150" }],
                        color: sliceColors[2],
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(v[1].source.queryName, v[1].identity, buildSelector(categoryQueryName, categoryIdentities[2])), null),
                        measure: -50,
                        value: 0.05,
                        index: 2,
                        label: 'col3',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col3", value: "-50" }],
                        color: sliceColors[2],
                    }].map(buildDataPoint);

                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);

                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints.length).toBe(3);
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
                expect(actualData.legendData.dataPoints[1].label).toBe('b');
                expect(actualData.legendData.dataPoints[2].label).toBe('c');
            });

            it('categorical, no slicing, formatted color', () => {

                let hexGreen = "#00FF00";
                let dataView: powerbi.DataView = {
                    categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['a', 'b', 'c'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                        objects: [
                            undefined,
                            { dataPoint: { fill: { solid: { color: hexGreen } } } },
                            undefined,
                        ]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [-300, null, 700]
                    }])
                    },
                    metadata: dataViewMetadata,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithIdAndMeasureAndCategory(categoryId, null, dataViewMetadata.columns[0].queryName));
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    hexGreen,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        measure: -300,
                        value: 0.3,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-300" }],
                        color: sliceColors[0],
                    }, {
                        identity: selectionIds[1],
                        measure: 0,
                        value: 0.0,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                        color: sliceColors[1],
                    }, {
                        identity: selectionIds[2],
                        measure: 700,
                        value: 0.7,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "700" }],
                        color: sliceColors[2],
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
            });

            it('categorical, no slicing, default color', () => {
                let dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [-300, null, 700]
                        }])
                    },
                    metadata: null,
                };

                //red will be used as the default color
                let redHexColor = "FF0000";

                let actualData = DonutChart.converter(dataView, donutColors, redHexColor, null, true);
                let selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithIdAndMeasureAndCategory(categoryId, null, dataViewMetadata.columns[0].queryName));
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        measure: -300,
                        value: 0.3,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-300" }],
                        color: redHexColor
                    }, {
                        identity: selectionIds[1],
                        measure: 0,
                        value: 0.0,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                        color: redHexColor
                    }, {
                        identity: selectionIds[2],
                        measure: 700,
                        value: 0.7,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "700" }],
                        color: redHexColor
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
            });

            it('categorical, no slicing, formatted color and default color', () => {

                let hexGreen = "#00FF00";
                //red will be used as the default color
                let hexDefaultColorRed = "FF0000";

                let dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            objects: [
                                undefined,
                                { dataPoint: { fill: { solid: { color: hexGreen } } } },
                                undefined
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [-300, null, 700]
                        }])
                    },
                    metadata: null,
                };

                let actualData = DonutChart.converter(dataView, donutColors, hexDefaultColorRed);
                let selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithIdAndMeasureAndCategory(categoryId, null, dataViewMetadata.columns[0].queryName));
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        measure: -300,
                        value: 0.3,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-300" }],
                        color: hexDefaultColorRed
                    }, {
                        identity: selectionIds[1],
                        measure: 0,
                        value: 0.0,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                        color: hexGreen
                    }, {
                        identity: selectionIds[2],
                        measure: 700,
                        value: 0.7,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "700" }],
                        color: hexDefaultColorRed
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
            });

            it('categorical multi-measure, with slicing', () => {
                let dataView: powerbi.DataView = {
                    categorical: {
                    categories: [{
                        source: dataViewMetadata1Category2Measure.columns[0],
                        values: ['a', 'b', 'c'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata1Category2Measure.columns[1],
                            values: [-200, null, 150]
                        },
                        {
                            source: dataViewMetadata1Category2Measure.columns[2],
                            values: [-300, 300, -50]
                        }
                    ])
                    },
                    metadata: dataViewMetadata1Category2Measure,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];

                let categoryQueryName = dataView.categorical.categories[0].source.queryName;
                let expectSlices: DonutDataPoint[] = [
                        {
                            identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[0]), 'col2'),
                            measure: -200,
                            label: 'col2',
                            value: 0.2,
                            index: 0,
                            tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-200" }],
                            color: sliceColors[0],
                        }, {
                            identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[0]), 'col3'),
                            measure: -300,
                            label: 'col3',
                            value: 0.3,
                            index: 0,
                            tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col3", value: "-300" }],
                            color: sliceColors[0],
                        }, {
                            identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), 'col2'),
                            measure: 0,
                            label: 'col2',
                            value: 0,
                            index: 1,
                            tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                            color: sliceColors[1],
                        }, {
                            identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), 'col3'),
                            measure: 300,
                            label: 'col3',
                            value: 0.3,
                            index: 1,
                            tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col3", value: "300" }],
                            color: sliceColors[1],
                        }, {
                            identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), 'col2'),
                            label: 'col2',
                            measure: 150,
                            value: 0.15,
                            index: 2,
                            tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "150" }],
                            color: sliceColors[2],
                        }, {
                            identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), 'col3'),
                            label: 'col3',
                            measure: -50,
                            value: 0.05,
                            index: 2,
                            tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col3", value: "-50" }],
                            color: sliceColors[2],
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints.length).toBe(3);
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
                expect(actualData.legendData.dataPoints[1].label).toBe('b');
                expect(actualData.legendData.dataPoints[2].label).toBe('c');
            });

            it('selection state set on converter result', () => {
                let dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2Measure.columns[1],
                                values: [-200, null, 150]
                            },
                            {
                                source: dataViewMetadata1Category2Measure.columns[2],
                                values: [-300, 300, -50]
                            }
                        ])
                    },
                    metadata: dataViewMetadata1Category2Measure,
                };

                let interactivityService = <powerbi.visuals.InteractivityService>powerbi.visuals.createInteractivityService(powerbitests.mocks.createVisualHostServices());
                let categorySelectionId = SelectionId.createWithId(categoryIdentities[1]);
                interactivityService['selectedIds'] = [categorySelectionId];

                let actualData = DonutChart.converter(dataView, donutColors, null, null, null, interactivityService);

                expect(actualData.dataPoints[0].data.selected).toBe(false);
                expect(actualData.dataPoints[1].data.selected).toBe(false);
                expect(actualData.dataPoints[2].data.selected).toBe(true);
                expect(actualData.dataPoints[3].data.selected).toBe(true);
                expect(actualData.dataPoints[4].data.selected).toBe(false);
                expect(actualData.dataPoints[5].data.selected).toBe(false);

                // Legend
                expect(actualData.legendData.dataPoints[0].selected).toBe(false);
                expect(actualData.legendData.dataPoints[1].selected).toBe(true);
                expect(actualData.legendData.dataPoints[2].selected).toBe(false);
            });

            it('non-categorical single-measure, with infinity', () => {
                let dataView: powerbi.DataView = {
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata3Measure.columns[0],
                                values: [Number.POSITIVE_INFINITY]
                            }
                        ])
                    },
                    metadata: dataViewMetadata3Measure,
                };

                // Slicing does not come into effect for non-categorical single-measure
                let actualData = DonutChart.converter(dataView, donutColors);
                let selectionIds = dataViewMetadata3Measure.columns.map((c) => SelectionId.createWithMeasure(c.displayName));
                let sliceColors = [donutColors.getColorByIndex(0).value];
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        label: 'col1',
                        measure: Number.MAX_VALUE,
                        value: 1.0,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "+Infinity" }],
                        color: sliceColors[0],
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('');
                expect(actualData.legendData.dataPoints[0].label).toBe('col1');
            });

            it('non-categorical multi-measure, with slicing', () => {
                // Explicitly set the color for the first measure.
                let columnWithColor = powerbi.Prototype.inherit(dataViewMetadata3Measure.columns[0]);
                columnWithColor.objects = { dataPoint: { fill: { solid: { color: 'red' } } } };

                let dataView: powerbi.DataView = {
                    categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: columnWithColor,
                            values: [200]
                        },
                        {
                            source: dataViewMetadata3Measure.columns[1],
                            values: [-300]
                        },
                        {
                            source: dataViewMetadata3Measure.columns[2],
                            values: [500]
                        }
                    ])
                    },
                    metadata: dataViewMetadata3Measure,
                };

                // Slicing does not come into effect for non-categorical multi-measure
                let actualData = DonutChart.converter(dataView, donutColors);
                let selectionIds = dataViewMetadata3Measure.columns.map((c) => SelectionId.createWithMeasure(c.displayName));
                
                let sliceColors = [
                    'red',
                    donutColors.getColorByIndex(1).value,
                    donutColors.getColorByIndex(2).value,
                ];
                let expectSlices: DonutDataPoint[] = [
                        {
                            identity: selectionIds[0],
                            label: 'col1',
                            measure: 200,
                            value: 0.2,
                            index: 0,
                            tooltipInfo: [{ displayName: "col1", value: "200" }],
                            color: sliceColors[0],
                        }, {
                            identity: selectionIds[1],
                            label: 'col2',
                            measure: -300,
                            value: 0.3,
                            index: 1,
                            tooltipInfo: [{ displayName: "col2", value: "-300" }],
                            color: sliceColors[1],
                        }, {
                            identity: selectionIds[2],
                            label: 'col3',
                            measure: 500,
                            value: 0.5,
                            index: 2,
                            tooltipInfo: [{ displayName: "col3", value: "500" }],
                            color: sliceColors[2],
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('');
                expect(actualData.legendData.dataPoints[0].label).toBe('col1');
            });

            it('non-categorical single-measure, with slicing', () => {
                let dataView: powerbi.DataView = {
                    categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata3Measure.columns[0],
                            values: [200]
                        }
                    ])
                    },
                    metadata: dataViewMetadata3Measure,
                };

                // Slicing does not come into effect for non-categorical single-measure
                let actualData = DonutChart.converter(dataView, donutColors);
                let selectionIds = dataViewMetadata3Measure.columns.map((c) => SelectionId.createWithMeasure(c.displayName));
                let sliceColors = [donutColors.getColorByIndex(0).value];
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        label: 'col1',
                        measure: 200,
                        value: 1.0,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "200" }],
                        color: sliceColors[0],
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('');
                expect(actualData.legendData.dataPoints[0].label).toBe('col1');
            });

            it('non-categorical series, infinity', () => {
                let dataView: powerbi.DataView = {
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: measureColumnDynamic1,
                                values: [Number.POSITIVE_INFINITY],
                                identity: mocks.dataViewScopeIdentity('A'),
                            }, {
                                source: measureColumnDynamic2,
                                values: [300],
                                identity: mocks.dataViewScopeIdentity('B'),
                            }
                        ],
                            [categoryColumnRef],
                        seriesMetaData)
                    },
                    metadata: dataViewMetadata,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let selectionIds = dataView.categorical.values.map((c) => SelectionId.createWithId(c.identity));
                let columnRefId = powerbi.data.SQExprShortSerializer.serializeArray([categoryColumnRef]);
                let sliceColors = [
                    donutColors.getColorScaleByKey(columnRefId).getColor('A').value,
                    donutColors.getColorScaleByKey(columnRefId).getColor('B').value,
                ];

                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        label: 'A',
                        measure: Number.MAX_VALUE,
                        value: 1.0,
                        index: 0,
                        tooltipInfo: [{ displayName: "series", value: "A" }, { displayName: "sales", value: "+Infinity" }],
                        color: sliceColors[0],
                        labelFormatString: undefined,
                    }, {
                        identity: selectionIds[1],
                        label: 'B',
                        measure: 300,
                        value: Math.abs(300 / Number.MAX_VALUE),
                        index: 1,
                        tooltipInfo: [{ displayName: "series", value: "B" }, { displayName: "sales", value: "300" }],
                        color: sliceColors[1],
                        labelFormatString: undefined,
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('series');
                expect(actualData.legendData.dataPoints[0].label).toBe('A');
                expect(actualData.legendData.dataPoints[1].label).toBe('B');
            });

            it('non-categorical series', () => {
                let dataView: powerbi.DataView = {
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: measureColumnDynamic1,
                                values: [200],
                                identity: mocks.dataViewScopeIdentity('A'),
                            }, {
                                source: measureColumnDynamic2,
                                values: [300],
                                identity: mocks.dataViewScopeIdentity('B'),
                            }
                        ],
                        [categoryColumnRef],
                        seriesMetaData)
                    },
                    metadata: dataViewMetadata,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let selectionIds = dataView.categorical.values.map((c) => SelectionId.createWithId(c.identity));
                let columnRefId = powerbi.data.SQExprShortSerializer.serializeArray([categoryColumnRef]);
                let sliceColors = [
                    donutColors.getColorScaleByKey(columnRefId).getColor('A').value,
                    donutColors.getColorScaleByKey(columnRefId).getColor('B').value,
                ];

                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        label: 'A',
                        measure: 200,
                        value: 0.4,
                        index: 0,
                        tooltipInfo: [{ displayName: "series", value: "A" }, { displayName: "sales", value: "200" }],
                        color: sliceColors[0],
                        labelFormatString: undefined,
                    }, {
                        identity: selectionIds[1],
                        label: 'B',
                        measure: 300,
                        value: 0.6,
                        index: 1,
                        tooltipInfo: [{ displayName: "series", value: "B" }, { displayName: "sales", value: "300" }],
                        color: sliceColors[1],
                        labelFormatString: undefined,
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('series');
                expect(actualData.legendData.dataPoints[0].label).toBe('A');
                expect(actualData.legendData.dataPoints[1].label).toBe('B');
            });

            it('non-categorical series with one series', () => {
                var dataView: powerbi.DataView = {
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: measureColumnDynamic1,
                                values: [200],
                                identity: mocks.dataViewScopeIdentity('A'),
                            }
                        ],
                        [categoryColumnRef],
                        seriesMetaData)
                    },
                    metadata: dataViewMetadata,
                };

                var actualData = DonutChart.converter(dataView, donutColors);
                var selectionIds = dataView.categorical.values.map((c) => SelectionId.createWithId(c.identity));
                var columnRefId = powerbi.data.SQExprShortSerializer.serializeArray([categoryColumnRef]);
                var sliceColors = [
                    donutColors.getColorScaleByKey(columnRefId).getColor('A').value,
                ];

                var expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        label: 'A',
                        measure: 200,
                        value: 1,
                        index: 0,
                        tooltipInfo: [{ displayName: "series", value: "A" }, { displayName: "sales", value: "200" }],
                        color: sliceColors[0],
                        labelFormatString: undefined,
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('series');
                expect(actualData.legendData.dataPoints[0].label).toBe('A');
            });

            it('non-categorical series, formatted color', () => {
                let dataView: powerbi.DataView = {
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: measureColumnDynamic1,
                                values: [200],
                                identity: mocks.dataViewScopeIdentity('col1'),
                            }, {
                                source: measureColumnDynamic2,
                                values: [300],
                                identity: mocks.dataViewScopeIdentity('col2'),
                            }
                        ],
                            [categoryColumnRef],
                        seriesMetaData)
                    },
                    metadata: dataViewMetadata,
                };

                let groupedValues = dataView.categorical.values.grouped();
                groupedValues[0].objects = { dataPoint: { fill: { solid: { color: 'green' } } } };
                groupedValues[1].objects = { dataPoint: { fill: { solid: { color: 'red' } } } };
                dataView.categorical.values.grouped = () => groupedValues;

                let actualData = DonutChart.converter(dataView, donutColors);
                let selectionIds = dataView.categorical.values.map((c) => SelectionId.createWithId(c.identity));                        

                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        label: 'A',
                        measure: 200,
                        value: 0.4,
                        index: 0,
                        tooltipInfo: [{ displayName: "series", value: "A" }, { displayName: "sales", value: "200" }],
                        color: 'green',
                        labelFormatString: undefined,
                    }, {
                        identity: selectionIds[1],
                        label: 'B',
                        measure: 300,
                        value: 0.6,
                        index: 1,
                        tooltipInfo: [{ displayName: "series", value: "B" }, { displayName: "sales", value: "300" }],
                        color: 'red',
                        labelFormatString: undefined,
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);               
            });           

            it('data with format string', () => {
                
                let dataView: powerbi.DataView = {
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: measureColumnDynamic1WithFormats,
                                values: [200],
                                identity: mocks.dataViewScopeIdentity('A'),
                            }, {
                                source: measureColumnDynamic2WithFormats,
                                values: [300],
                                identity: mocks.dataViewScopeIdentity('B'),
                            }
                        ],
                            [categoryColumnRef],
                        seriesMetaData)
                    },
                    metadata: dataViewMetadataWithFormats,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let selectionIds = dataView.categorical.values.map((c) => SelectionId.createWithId(c.identity));
                let columnRefId = powerbi.data.SQExprShortSerializer.serializeArray([categoryColumnRef]);
                let sliceColors = [
                    donutColors.getColorScaleByKey(columnRefId).getColor('A').value,
                    donutColors.getColorScaleByKey(columnRefId).getColor('B').value,
                ];

                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        label: 'A',
                        measure: 200,
                        measureFormat: '$0',
                        value: 0.4,
                        index: 0,
                        tooltipInfo: [{ displayName: "series", value: "A" }, { displayName: "sales", value: "$200" }],
                        color: sliceColors[0],
                        categoryLabel: 'A',
                    }, {
                        identity: selectionIds[1],
                        label: 'B',
                        measure: 300,
                        measureFormat: '#,0',
                        value: 0.6,
                        index: 1,
                        tooltipInfo: [{ displayName: "series", value: "B" }, { displayName: "sales", value: "300" }],
                        color: sliceColors[1],
                        categoryLabel: 'B',
                    }].map(buildDataPoint);

                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
            });

            it('with highlights',() => {
                // categorical, multi-measure slices, with highlights
                let dataView: powerbi.DataView = {
                    categorical: {
                    categories: [{
                        source: dataViewMetadata1Category2Measure.columns[0],
                        values: ['a', 'b', 'c'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                                source: dataViewMetadata1Category2Measure.columns[1],
                            values: [-200, null, 150],
                                highlights: [-100, null, 15],
                            },
                            {
                                source: dataViewMetadata1Category2Measure.columns[2],
                            values: [-300, 300, -50],
                            highlights: [-150, 75, 50],
                            }
                        ])
                    },
                    metadata: dataViewMetadata1Category2Measure,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let categoryQueryName = dataView.categorical.categories[0].source.queryName;
                let highlightDisplayName = powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName;
                let expectSlices: DonutDataPoint[] = [
                        {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[0]), 'col2'),
                        measure: -200,
                        label: 'col2',
                            highlightRatio: 0.5,
                        value: 0.2,
                            index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-200" }, { displayName: highlightDisplayName, value: "-100" }],
                            color: sliceColors[0],
                        }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[0]), 'col3'),
                        measure: -300,
                        label: 'col3',
                        highlightRatio: 0.5,
                        value: 0.3,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col3", value: "-300" }, { displayName: highlightDisplayName, value: "-150" }],
                        color: sliceColors[0],
                        labelFormatString: undefined,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), 'col2'),
                        measure: 0,
                        label: 'col2',
                        highlightRatio: 1e-9,
                        value: 0,
                        index: 1,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                        color: sliceColors[1],
                        labelFormatString: undefined,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), 'col3'),
                            measure: 300,
                        label: 'col3',
                        highlightRatio: 0.25,
                            value: 0.3,
                            index: 1,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col3", value: "300" }, { displayName: highlightDisplayName, value: "75" }],
                            color: sliceColors[1],
                        labelFormatString: undefined,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), 'col2'),
                        label: 'col2',
                        highlightRatio: 0.1,
                        measure: 150,
                        value: 0.15,
                        index: 2,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "150" }, { displayName: highlightDisplayName, value: "15" }],
                        color: sliceColors[2],
                        }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), 'col3'),
                        label: 'col3',
                        highlightRatio: 1,
                        measure: -50,
                        value: 0.05,
                            index: 2,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col3", value: "-50" }, { displayName: highlightDisplayName, value: "50" }],
                            color: sliceColors[2],
                        labelFormatString: undefined,
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints.length).toBe(3);
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
                expect(actualData.legendData.dataPoints[1].label).toBe('b');
                expect(actualData.legendData.dataPoints[2].label).toBe('c');
            });

            //validate tooltip on highlighted values, the first tooptip is regular because highlighted value is 0, another tooltips are highlighted tooltips 
            it('with highlights - special case tooltip validation',() => {
                // categorical, multi-measure slices, zero-highlight as special case
                let dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2MeasureWithFormat.columns[1],
                                values: [-200, null, 150],
                                highlights: [0, null, 10],
                            }, {
                                source: dataViewMetadata1Category2MeasureWithFormat.columns[2],
                                values: [-300, 300, -50],
                                highlights: [0, 75, 50],
                            }]),
                    },
                    metadata: null,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
               
                let highlightName = powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName;

                //regular tooltip
                expect(actualData.dataPoints[0].data.tooltipInfo).toEqual([{ displayName: "col1", value: "a" }, { displayName: "col2", value: "($200)" }]);
                expect(actualData.dataPoints[1].data.tooltipInfo).toEqual([{ displayName: "col1", value: "a" }, { displayName: "col3", value: "-300" }]);
                expect(actualData.dataPoints[2].data.tooltipInfo).toEqual([{ displayName: "col1", value: "b" }, { displayName: "col2", value: "$0" }]);
                //tooltips with highlighted values
                expect(actualData.dataPoints[3].data.tooltipInfo).toEqual([{ displayName: "col1", value: "b" }, { displayName: "col3", value: "300" }, { displayName: highlightName, value: "75" }]);
                expect(actualData.dataPoints[4].data.tooltipInfo).toEqual([{ displayName: "col1", value: "c" }, { displayName: "col2", value: "$150" }, { displayName: highlightName, value: "$10" }]);
                expect(actualData.dataPoints[5].data.tooltipInfo).toEqual([{ displayName: "col1", value: "c" }, { displayName: "col3", value: "-50" }, { displayName: highlightName, value: "50" }]);
            });

            //validate tooltip that tooltip info doesn't change if data and category labels are on and off 
            it('on/off data lables - tooltip validation', () => {
               
                let dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2MeasureWithFormat.columns[1],
                                values: [-200, 100, 150],
                            }, {
                                source: dataViewMetadata1Category2MeasureWithFormat.columns[2],
                                values: [-300, 300, -50],
                            }]),
                    },
                    metadata: null,
                };

                let tooltipInfo1 = [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "($200)" }];
                let tooltipInfo2 = [{ displayName: "col1", value: "a" }, { displayName: "col3", value: "-300" }];
                let tooltipInfo3 = [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "$100" }];
                let tooltipInfo4 = [{ displayName: "col1", value: "b" }, { displayName: "col3", value: "300" }];
                let tooltipInfo5 = [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "$150" }];
                let tooltipInfo6 = [{ displayName: "col1", value: "c" }, { displayName: "col3", value: "-50" }];
                let actualData = DonutChart.converter(dataView, donutColors);
                expect(actualData.dataPoints[0].data.tooltipInfo).toEqual(tooltipInfo1);
                expect(actualData.dataPoints[1].data.tooltipInfo).toEqual(tooltipInfo2);
                expect(actualData.dataPoints[2].data.tooltipInfo).toEqual(tooltipInfo3);
                expect(actualData.dataPoints[3].data.tooltipInfo).toEqual(tooltipInfo4);
                expect(actualData.dataPoints[4].data.tooltipInfo).toEqual(tooltipInfo5);
                expect(actualData.dataPoints[5].data.tooltipInfo).toEqual(tooltipInfo6);

                //data labels are on
                dataViewMetadata1Category2Measure.objects = {
                    labels: { show: true },
                    categoryLabels: { show: false }
                };
                actualData = DonutChart.converter(dataView, donutColors);
                expect(actualData.dataPoints[0].data.tooltipInfo).toEqual(tooltipInfo1);
                expect(actualData.dataPoints[1].data.tooltipInfo).toEqual(tooltipInfo2);
                expect(actualData.dataPoints[2].data.tooltipInfo).toEqual(tooltipInfo3);

                //data labels and category labels are on
                dataViewMetadata1Category2Measure.objects = {
                    labels: { show: true },
                    categoryLabels: { show: true }
                };
                actualData = DonutChart.converter(dataView, donutColors);
                expect(actualData.dataPoints[0].data.tooltipInfo).toEqual(tooltipInfo1);
                expect(actualData.dataPoints[1].data.tooltipInfo).toEqual(tooltipInfo2);
                expect(actualData.dataPoints[2].data.tooltipInfo).toEqual(tooltipInfo3);

                //data labels off and category labels are on
                dataViewMetadata1Category2Measure.objects = {
                    labels: { show: false },
                    categoryLabels: { show: true }
                };
                actualData = DonutChart.converter(dataView, donutColors);
                expect(actualData.dataPoints[0].data.tooltipInfo).toEqual(tooltipInfo1);
                expect(actualData.dataPoints[1].data.tooltipInfo).toEqual(tooltipInfo2);
                expect(actualData.dataPoints[2].data.tooltipInfo).toEqual(tooltipInfo3);
            });

            it('with highlights that overflow', () => {
                // categorical, no slicing - with OverFlow
                let dataView: powerbi.DataView = {
                    categorical: {
                    categories: [{
                        source: dataViewMetadata1Category2Measure.columns[0],
                        values: ['a', 'b', 'c'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata1Category2MeasureWithFormat.columns[1],
                            values: [-200, null, 150],
                            highlights: [-100, null, 250 /* NOTE: this highlight value > the corresponding non-highlight value */],
                        }, {
                            source: dataViewMetadata1Category2MeasureWithFormat.columns[2],
                            values: [-300, 300, -50],
                            highlights: [-150, 75, 50],
                        }]),
                    },
                    metadata: null,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let categoryQueryName = dataView.categorical.categories[0].source.queryName;
                let highlightName = powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName;
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[0]), 'col2'),
                        measure: -100,
                        measureFormat: "\$#,0;(\$#,0);\$#,0",
                        label: 'col2',
                        value: 0.16,
                        highlightRatio: 1.0,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "($200)" }, { displayName: highlightName, value: "($100)" }],
                        color: sliceColors[0],
                        labelFormatString: undefined,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[0]), 'col3'),
                        measure: -150,
                        measureFormat: undefined,
                        label: 'col3',
                        value: 0.24,
                        highlightRatio: 1.0,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col3", value: "-300" }, { displayName: highlightName, value: "-150" }],
                        color: sliceColors[0],
                        labelFormatString: undefined,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), 'col2'),
                        label: 'col2',
                        measure: 0,
                        measureFormat: "\$#,0;(\$#,0);\$#,0",
                        value: 0.0,
                        highlightRatio: 1.0,
                        index: 1,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "$0" }],
                        color: sliceColors[1],
                        labelFormatString: undefined,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), 'col3'),
                        label: 'col3',
                        measure: 75,
                        measureFormat: undefined,
                        value: 0.12,
                        highlightRatio: 1.0,
                        index: 1,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col3", value: "300" }, { displayName: highlightName, value: "75" }],
                        color: sliceColors[1],
                        labelFormatString: undefined,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), 'col2'),
                        measure: 250,
                        measureFormat: "\$#,0;(\$#,0);\$#,0",
                        label: 'col2',
                        value: 0.4,
                        highlightRatio: 1.0,
                        index: 2,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "$150" }, { displayName: highlightName, value: "$250" }],
                        color: sliceColors[2],
                        labelFormatString: undefined,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), 'col3'),
                        measure: 50,
                        measureFormat: undefined,
                        label: 'col3',
                        value: 0.08,
                        highlightRatio: 1.0,
                        index: 2,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col3", value: "-50" }, { displayName: highlightName, value: "50" }],
                        color: sliceColors[2],
                        labelFormatString: undefined,
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
            });

            it('with culling', () => {
                let dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [100, 0, 300]
                        }])
                    },
                    metadata: dataViewMetadata,
                };

                let viewPort = { height: 10, width: 10 };
                let actualData = DonutChart.converter(dataView, donutColors, null, viewPort, false);
                let selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithIdAndMeasureAndCategory(categoryId, null, dataViewMetadata.columns[0].queryName));
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        measure: 100,
                        value: 0.25,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "100" }],
                        color: sliceColors[0],
                    }, {
                        identity: selectionIds[2],
                        measure: 300,
                        value: 0.75,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "300" }],
                        color: sliceColors[2],
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
            });

            it('without culling', () => {
                let dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [100, 0, 300]
                        }])
                    },
                    metadata: dataViewMetadata,
                };

                let viewPort = { height: 10, width: 10 };
                let actualData = DonutChart.converter(dataView, donutColors, null, viewPort, true);
                let selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithIdAndMeasureAndCategory(categoryId, null, dataViewMetadata.columns[0].queryName));
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        measure: 100,
                        value: 0.25,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "100" }],
                        color: sliceColors[0],
                    }, {
                        identity: selectionIds[1],
                        measure: 0,
                        value: 0.0,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                        color: sliceColors[1],
                    }, {
                        identity: selectionIds[2],
                        measure: 300,
                        value: 0.75,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "300" }],
                        color: sliceColors[2],
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
            });
        });

        it('non-categorical multi-measure tooltip values test', () => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'a', queryName: 'a', isMeasure: true },
                    { displayName: 'b', queryName: 'b', isMeasure: true },
                    { displayName: 'c', queryName: 'c', isMeasure: true }
                ]
            };

            let dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[0],
                            values: [1],
                        },
                        {
                            source: dataViewMetadata.columns[1],
                            values: [2],
                        },
                        {
                            source: dataViewMetadata.columns[2],
                            values: [3],
                        }
                    ])
                }
            };

            let actualData = DonutChart.converter(dataView, donutColors);
            
            expect(actualData.dataPoints[0].data.tooltipInfo).toEqual([{ displayName: 'a', value: '1' }]);
            expect(actualData.dataPoints[1].data.tooltipInfo).toEqual([{ displayName: 'b', value: '2' }]);
            expect(actualData.dataPoints[2].data.tooltipInfo).toEqual([{ displayName: 'c', value: '3' }]);
        });

        function buildDataPoint(data: { identity: SelectionId; measure: number; highlightRatio?: number; measureFormat?: string; value: number; index: any; label: string; tooltipInfo?: powerbi.visuals.TooltipDataItem[]; highlightedTooltipInfo?: powerbi.visuals.TooltipDataItem[]; color?: string; labelFormatString?: string }): DonutDataPoint {
            return <DonutDataPoint> {
                identity: data.identity,
                measure: data.measure,
                measureFormat: data.measureFormat,
                percentage: data.value,
                index: data.index,
                label: data.label,
                selected: false,
                highlightRatio: data.highlightRatio || 0,
                tooltipInfo: data.tooltipInfo,
                color: data.color,
                labelColor: powerbi.visuals.dataLabelUtils.defaultLabelColor,
                labelFormatString: data.labelFormatString,
                labelFontSize: powerbi.visuals.dataLabelUtils.DefaultFontSizeInPt,
            };
        }
    });

    function pieChartDomValidation(interactiveChart: boolean, hasLegendObject: boolean) {
        let v: powerbi.IVisual;
        let element: JQuery;
        let hostServices: powerbi.IVisualHostServices;

        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    queryName: 'col1',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                }, {
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                }
            ],
        };

        if (hasLegendObject) {
            dataViewMetadataTwoColumn.objects = { legend: { show: true } };
        }
        else {
            dataViewMetadataTwoColumn.objects = undefined;
        }

        let dataViewMetadata1Category2Measure: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'col1', queryName: 'col1' },
                { displayName: 'col2', queryName: 'col2', isMeasure: true },
                { displayName: 'col3', queryName: 'col3', isMeasure: true }]
        };
        if (hasLegendObject) {
            dataViewMetadata1Category2Measure.objects = { legend: { show: true } };
        }
        else {
            dataViewMetadata1Category2Measure.objects = undefined;
        }

        let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });

        beforeEach(() => {
            hostServices = mocks.createVisualHostServices();
            element = powerbitests.helpers.testDom('500', '500');
            if (interactiveChart)
                v = powerbi.visuals.visualPluginFactory.createMobile().getPlugin('pieChart').create();
            else
                v = powerbi.visuals.visualPluginFactory.createMinerva({}).getPlugin('pieChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: interactiveChart, selection: true },
                animation: { transitionImmediate: true }
            });
        });

        it('pie chart dom validation', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                expect($('.donutChart .slice').length).toBe(3);
                done();
            }, DefaultWaitForRender);
        });

        it('pie chart dom validation with partial highlights', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                            highlights: [50, 0, 300],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();

                let dimmedOpacity = interactiveChart ? 0.6 : powerbi.visuals.ColumnUtil.DimmedOpacity;
                let slices = $('.donutChart .slice');
                expect(slices.length).toBe(3);
                slices.each((i, element) =>
                    expect(parseFloat($(element).css('fill-opacity'))).toBeCloseTo(dimmedOpacity, 0)
                    );

                let highlightSlices = $('.donutChart .slice-highlight');
                expect(highlightSlices.length).toBe(3);
                highlightSlices.each((i, element) =>
                    expect(parseFloat($(element).css('fill-opacity'))).toBeCloseTo(powerbi.visuals.ColumnUtil.DefaultOpacity, 2)
                    );

                done();
            }, DefaultWaitForRender);
        });

        it('pie chart should clear dom validation', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                expect($('.donutChart .slice').length).toBe(3);
                if (interactiveChart)
                    expect($('.legend-item').length).toBe(3);
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataTwoColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn.columns[0],
                                values: [],
                                identity: [],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataTwoColumn.columns[1],
                                values: [],
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    expect($('.donutChart')).toBeInDOM();
                    expect($('.donutChart .slice').length).toBe(0);
                    if (interactiveChart)
                        expect($('.legend-item').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('pie chart dom validation with slices', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata1Category2Measure,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2Measure.columns[1],
                                values: [200, 100, 150]
                            }, {
                                source: dataViewMetadata1Category2Measure.columns[2],
                                values: [300, 200, 50]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                expect($('.donutChart .slice').length).toBe(6);
                done();
            }, DefaultWaitForRender);
        });

        it('pie chart dom validation with normal slices', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [300, 300, 400],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                let svg = $('.donutChart');
                expect(svg).toBeInDOM();

                // Disabling test due to instability in test infrastructure.
                //expect($('.donutChart polyline').filter(function () {
                //       return $(this).css('opacity') === '0.5'
                //    }).length).toBe(3);

                //expect(svg.attr('height')).toBe(initialHeight);
                //expect(svg.attr('width')).toBe(initialWidth);

                done();
            }, DefaultWaitForRender);
        });

        it('pie chart label dom validation with thin slices', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [5, 990, 5],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                // lines are not present on interactive legend mode, and currently if regular legend is on we hide labels
                if (!interactiveChart && !hasLegendObject) {
                    expect($('.donutChart polyline').length).toBe(3);
                }
                done();
            }, DefaultWaitForRender * 2);
        });
        
        it('pie chart with duplicate labels dom validation', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['abc', 'abc', 'abc'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                expect($('.donutChart .slice').length).toBe(3);
                if (!interactiveChart && !hasLegendObject) {
                    expect($('.donutChart polyline').length).toBe(3);
                    expect($('.donutChart .labels text').length).toBe(3);
                }
                done();
            }, DefaultWaitForRender);
        });

        it('pie chart labels visibility after resize', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            });
            v.onResizing({ height: 600, width: 600 });
            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                if (!interactiveChart && !hasLegendObject) {
                    expect($('.donutChart .labels text').length).toBe(3);
                }
                done();
            }, DefaultWaitForRender);
        });

        it('pie chart dom validation with very long labels', (done) => {

            //make sure category labels on
            let dataViewMetadataTwoColumnLabels = powerbi.Prototype.inherit(dataViewMetadataTwoColumn);
            dataViewMetadataTwoColumnLabels.objects = { categoryLabels: { show: true }, labels: { show: false } };

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumnLabels,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumnLabels.columns[0],
                            values: ['John Domo Who lives far far away', 'Delta Force of the 56th Battalion 2015', 'Jean Tablau from the silicon valley'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumnLabels.columns[1],
                            values: [300, 300, 400],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                let labels = $('.labels').find('text');
                for (let i = 0; i < labels.length; i++) {
                    let text = $(labels[i]).text().substr(-1);
                    expect(text).toEqual('…');
                }
                done();
            }, DefaultWaitForRender);
        });

        it('pie chart culling invisible slices validation', (done) => {
            spyOn(hostServices, 'setWarnings').and.callThrough();

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 50, 0.000001],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                if (interactiveChart) {
                    // Culling is disabled on interactive charts
                    expect($('.donutChart .slice').length).toBe(3);
                }
                else {
                    expect($('.donutChart .slice').length).toBe(2);
                    expect(hostServices.setWarnings).toHaveBeenCalledWith([new powerbi.visuals.GeometryCulledWarning()]);
                }

                done();
            }, DefaultWaitForRender);
        });

        it('pie chart opacity validation with overlapping slices', (done) => {
            dataViewMetadataTwoColumn.objects = {
                labels: { show: false },
                categoryLabels: { show: true }
            };
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['abc', 'def', 'ghi', 'jkl'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c'), mocks.dataViewScopeIdentity('d')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [1, 1, 5, 90],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                if (!interactiveChart && !hasLegendObject) {
                    expect($('.donutChart polyline').filter(function () {
                        return $(this).css('opacity') === '0.5';
                    }).length).toBe(3);
                    expect($('.donutChart text').length).toBe(3);
                }
                // lines are not present on interactive legend mode, and currently if regular legend is on we hide labels
                if (interactiveChart) {
                    expect($('.donutChart polyline').filter(function () {
                        return $(this).css('opacity') === '0.5';
                    }).length).toBe(0);
                    expect($('.donutChart text').length).toBe(0);
                }
                done();
            }, DefaultWaitForRender * 2);
        });

        it('pie chart radius calculation validation', (done) => {

            // spy on calculateRadius() method
            let pieChart: any = v;
            spyOn(pieChart, 'calculateRadius').and.callThrough();

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['abc', 'def', 'ghi', 'jkl'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c'), mocks.dataViewScopeIdentity('d')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [2, 3, 4, 90],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                // verify the calculateRadius() was called during the rendering on the visual 
                expect(pieChart.calculateRadius).toHaveBeenCalled();
                // call calculateRadius() and test for the result, based on whether the chart is interactive or not
                let radiusResult = pieChart.calculateRadius();
                let height = $('.donutChart').height();
                let width = $('.donutChart').width();
                let widthOrHeight = Math.min(width, height);

                let hw = height / width;
                let denom = 2 + (1 / (1 + Math.exp(-5 * (hw - 1))));

                let expectedRadius = interactiveChart ? widthOrHeight / 2 : widthOrHeight / denom;
                expect(radiusResult).toBeCloseTo(expectedRadius, 0);
                done();
            }, DefaultWaitForRender * 2);
        });

        it('pie chart slice select', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            });

            let slices = $('.donutChart .slice');
            let sliceToClickIndex = 1;
            let sliceToClick = $(slices[sliceToClickIndex]);
            let otherSlices = slices.not(sliceToClick);
            let renderLegend = dataViewMetadataTwoColumn.objects && dataViewMetadataTwoColumn.objects['legend'];

            slices.each(function () {
                expect(parseFloat($(this).css('fill-opacity'))).toBe(1);
            });

            let pieChart: any = v;
            if (interactiveChart) {
                let interactivityState = pieChart.interactivityState;
                var pieLegend = interactivityState.interactiveLegend;

                spyOn(pieChart, 'setInteractiveChosenSlice').and.callThrough();
                spyOn(pieLegend, 'updateLegend').and.callThrough();
            }

            // Click the first slice
            (<any>sliceToClick).d3Click();

            setTimeout(() => {
                expect($('.donutChart .slice').length).toBe(3);
                if (interactiveChart) {
                    expect(pieChart.setInteractiveChosenSlice).toHaveBeenCalledWith(sliceToClickIndex);
                    expect(pieLegend.updateLegend).toHaveBeenCalledWith(sliceToClickIndex);
                }
                else {
                    expect(parseFloat(sliceToClick.css('fill-opacity'))).toBe(1);
                    otherSlices.each(function () {
                        expect(parseFloat($(this).css('fill-opacity'))).toBeLessThan(1);
                    });

                    // Legend
                    if (renderLegend) {
                        expect($('.legend .item').length).toBe(3);
                        let icons = $('.legend .icon.tall');
                        expect(icons[sliceToClickIndex].style.backgroundColor).toBe('rgb(55, 70, 73)');
                        expect(icons[0].style.backgroundColor).toBe('rgb(166, 166, 166)');
                        expect(icons[2].style.backgroundColor).toBe('rgb(166, 166, 166)');
                    }
                }

                // Click the background
                let clearCatcher = $('.clearCatcher');
                (<any>clearCatcher).d3Click();

                setTimeout(() => {
                    slices.each(function () {
                        expect(parseFloat($(this).css('fill-opacity'))).toBe(1);
                    });
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('pie chart selecting a slice triggers select', () => {
            if (interactiveChart) {
                // not applicable to interactive charts
                expect($('.donutChart')).toBeInDOM();
                return;
            }

            let identities = [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: identities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            });

            let onSelectSpy = spyOn(hostServices, 'onSelect');

            let slices = $('.donutChart .slice');
            let sliceToClick = 1;
            (<any>$(slices[sliceToClick])).d3Click();

            expect(onSelectSpy).toHaveBeenCalled();
            expect(onSelectSpy.calls.argsFor(0)[0].data[0]).toEqual({ data: [identities[sliceToClick]] });
        });

        it('pie chart highlighted slice select', (done) => {
            if (interactiveChart) {
                // not applicable to interactive charts
                expect($('.donutChart')).toBeInDOM();
                done();
                return;
            }

            let identities = [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: identities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                            highlights: [50, 100, 350],
                        }])
                    }
                }]
            });

            let slices = $('.donutChart .slice');
            let sliceToClickIndex = 1;
            let sliceToClick = $(slices[sliceToClickIndex]);
            let otherSlices = slices.not(sliceToClick);

            // Click the first slice
            (<any>sliceToClick).d3Click();

            setTimeout(() => {
                expect($('.donutChart .slice').length).toBe(3);
                expect(parseFloat(sliceToClick.css('fill-opacity'))).toBe(1);
                otherSlices.each(function () {
                    expect(parseFloat($(this).css('fill-opacity'))).toBeLessThan(1);
                });
                done();
            }, DefaultWaitForRender);
        });

        it('pie chart selecting a highlighted slice triggers select', () => {
            if (interactiveChart) {
                // not applicable to interactive charts
                expect($('.donutChart')).toBeInDOM();
                return;
            }

            let identities = [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: identities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                            highlights: [50, 100, 350],
                        }])
                    }
                }]
            });

            let onSelectSpy = spyOn(hostServices, 'onSelect');

            let slices = $('.donutChart .slice-highlight');
            let sliceToClick = 1;
            (<any>$(slices[sliceToClick])).d3Click();

            expect(onSelectSpy).toHaveBeenCalled();
            expect(onSelectSpy.calls.argsFor(0)[0].data[0]).toEqual({ data: [identities[sliceToClick]] });
        });

        it('pie chart slice multi-select', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            });

            let slices = $('.donutChart .slice');
            let slicesToClickIndex = [1, 2];
            let slicesToClick = $(slices).slice(1, 3);
            let otherSlices = slices.not(slicesToClick);
            let renderLegend = dataViewMetadataTwoColumn.objects && dataViewMetadataTwoColumn.objects['legend'];

            slices.each(function () {
                expect(parseFloat($(this).css('fill-opacity'))).toBe(1);
            });

            let pieChart: any = v;
            if (interactiveChart) {
                let interactivityState = pieChart.interactivityState;
                var pieLegend = interactivityState.interactiveLegend;

                spyOn(pieChart, 'setInteractiveChosenSlice').and.callThrough();
                spyOn(pieLegend, 'updateLegend').and.callThrough();
            }

            // Click the first slice, then the second with ctrl key
            (<any>slicesToClick.eq(0)).d3Click();
            (<any>slicesToClick.eq(1)).d3Click(0, 0, powerbitests.helpers.ClickEventType.CtrlKey);

            setTimeout(() => {
                expect($('.donutChart .slice').length).toBe(3);
                if (interactiveChart) {
                    slicesToClickIndex.forEach((i) => {
                        expect(pieChart.setInteractiveChosenSlice).toHaveBeenCalledWith(i);
                        expect(pieLegend.updateLegend).toHaveBeenCalledWith(i);
                    });
                }
                else {

                    otherSlices.each(function () {
                        expect(parseFloat($(this).css('fill-opacity'))).toBeLessThan(1);
                    });

                    // Legend
                    if (renderLegend) {
                        expect($('.legend .item').length).toBe(3);
                        let icons = $('.legend .icon.tall');
                        expect(icons[0].style.backgroundColor).toBe('rgb(166, 166, 166)');
                        expect(icons[1].style.backgroundColor).toBe('rgb(157, 73, 140)');
                        expect(icons[2].style.backgroundColor).toBe('rgb(187, 203, 80)');
                        let labels = $('.labels').find('text');
                        expect($(labels[0]).css('opacity')).toBe('0');
                        expect($(labels[1]).css('opacity')).toBe('0');
                        expect($(labels[2]).css('opacity')).toBe('0');
                    }
                    else {
                        expect($('.labels').find('text').length).toBe(3);
                    }
                }

                // Click the background
                let clearCatcher = $('.clearCatcher');
                (<any>clearCatcher).d3Click();

                setTimeout(() => {
                    slices.each(function () {
                        expect(parseFloat($(this).css('fill-opacity'))).toBe(1);
                    });
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('pie chart legend interactivity', () => {
            expect($('.donutChart')).toBeInDOM();

            if (!interactiveChart) {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataTwoColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataTwoColumn.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });

                // click on legend item
                let renderLegend = dataViewMetadataTwoColumn.objects && dataViewMetadataTwoColumn.objects['legend'];
                if (renderLegend) {
                    let icons = $('.legend .icon.tall');
                    let slices = $('.donutChart .slice');

                    (<any>icons.first()).d3Click(0, 0);
                    setTimeout(() => {
                        expect(icons[0].style.backgroundColor).toBe('rgb(1, 184, 170)');
                        expect(icons[1].style.backgroundColor).toBe('rgb(166, 166, 166)');
                        expect(icons[2].style.backgroundColor).toBe('rgb(166, 166, 166)');

                        expect(parseFloat(slices[0].style.fillOpacity)).toBe(1);
                        expect(parseFloat(slices[1].style.fillOpacity)).toBeLessThan(1);
                        expect(parseFloat(slices[2].style.fillOpacity)).toBeLessThan(1);
                    }, DefaultWaitForRender * 2);
                }
            }
        });

        if (hasLegendObject) {
            it('legend formatting', (done) => {
                let dataView = {
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                };

                dataView.metadata.objects = { legend: { show: true } };

                v.onDataChanged({
                    dataViews: [dataView]
                });

                setTimeout(() => {
                    expect($('.donutChart')).toBeInDOM();
                    expect($('.donutChart .slice').length).toBe(3);
                    if (hasLegendObject) {
                        expect($('.legend').attr('orientation')).toBe(LegendPosition.Top.toString());
                    }

                    //change legend position
                    dataView.metadata.objects = { legend: { show: true, position: 'Right' } };

                    v.onDataChanged({
                        dataViews: [dataView]
                    });
                    setTimeout(() => {
                        expect($('.donutChart')).toBeInDOM();
                        expect($('.donutChart .slice').length).toBe(3);
                        if (hasLegendObject) {
                            expect($('.legend').attr('orientation')).toBe(LegendPosition.Right.toString());
                        }

                        dataView.metadata.objects = { legend: { show: true, position: 'TopCenter', showTitle: true } };
                        v.onDataChanged({
                            dataViews: [dataView]
                        });
                        setTimeout(() => {
                            if (hasLegendObject) {
                                expect($('#legendGroup').attr('transform')).toBeDefined();
                            }

                            //set title
                            let testTitle = 'Test Title';
                            dataView.metadata.objects = { legend: { show: true, position: 'Right', showTitle: true, titleText: testTitle } };
                            v.onDataChanged({
                                dataViews: [dataView]
                            });
                            setTimeout(() => {
                                expect($('.donutChart')).toBeInDOM();
                                if (hasLegendObject) {
                                    expect($('.legend').attr('orientation')).toBe(LegendPosition.Right.toString());
                                    expect($('.legendTitle').text()).toBe(testTitle);
                                    expect($('#legendGroup').attr('transform')).not.toBeDefined();
                                }
                                //hide legend
                                dataView.metadata.objects = { legend: { show: false, position: 'Right' } };
                                v.onDataChanged({
                                    dataViews: [dataView]
                                });
                                setTimeout(() => {
                                    expect($('.donutChart')).toBeInDOM();
                                    if (hasLegendObject) {
                                        expect($('.legend').attr('orientation')).toBe(LegendPosition.None.toString());
                                    }
                                    done();
                                }, DefaultWaitForRender);
                            }, DefaultWaitForRender);
                        }, DefaultWaitForRender);
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });
        }
    }

    describe("PieChart DOM validation", () => pieChartDomValidation(false, false));
    describe("PieChart DOM validation - with legend", () => pieChartDomValidation(false, true));
    describe("Interactive PieChart DOM validation", () => pieChartDomValidation(true, false));

    describe("Dashboard PieChart DOM validation", () => () => {
        let v: powerbi.IVisual, element: JQuery;
        let hostServices = mocks.createVisualHostServices();

        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    queryName: 'col1',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                }, {
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                }
            ],
        };

        let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.createDashboard({}).getPlugin('donutChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: false, selection: true },
                animation: { transitionImmediate: true }
            });
        });

        it('culls data by default', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 50, 0.000001],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                expect($('.donutChart .slice').length).toBe(2);
                expect(hostServices.setWarnings).toHaveBeenCalledWith([new powerbi.visuals.GeometryCulledWarning()]);

                done();
            }, DefaultWaitForRender);
        });
    });

    describe("Pie Chart Interactivity", () => {
        let v: powerbi.IVisual, element: JQuery;
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                }, {
                    displayName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                }
            ],
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('pieChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: true },
                animation: { transitionImmediate: true }, // disable animations for testing
            });

            let dataViewMetadataTwoColumnLabels = powerbi.Prototype.inherit(dataViewMetadataTwoColumn);
            dataViewMetadataTwoColumnLabels.objects = { categoryLabels: { show: true }, labels: { show: false }, legend: { show: true, position: 'Top' } };
            let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumnLabels,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumnLabels.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumnLabels.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            });
        });

        it('legend structure', (done) => {
            setTimeout(() => {
                expect($('[data-legend-index=0]>.category').text()).toBe("a");
                expect($('[data-legend-index=0]>.value').text()).toBe("100");
                helpers.assertColorsMatch($('[data-legend-index=0]>.percentage').css('color'), $('.slice').eq(0).css('fill'));
                expect($('[data-legend-index=1]>.category').text()).toBe("b");
                expect($('[data-legend-index=1]>.value').text()).toBe("200");
                helpers.assertColorsMatch($('[data-legend-index=1]>.percentage').css('color'), $('.slice').eq(1).css('fill'));
                expect($('[data-legend-index=2]>.category').text()).toBe("c");
                expect($('[data-legend-index=2]>.value').text()).toBe("700");
                helpers.assertColorsMatch($('[data-legend-index=2]>.percentage').css('color'), $('.slice').eq(2).css('fill'));
                expect($('.donutLegend').length).toBe(1);
                expect($('.legend-item').length).toBe(3);
                expect($('.donutChart .slice').length).toBe(3);
                done();
            }, DefaultWaitForRender);
        });

        it('legend - test that there is only one interactive legend', (done) => {
            v.onResizing({ height: 600, width: 600 });

            setTimeout(() => {
                // interactive-legend is the type of interactive legend for all visuals except donut, for this visual we have special legend called donutLegend
                expect($('.interactive-legend')).not.toBeInDOM();
                expect($('.donutLegend')).toBeInDOM();
                done();
            }, DefaultWaitForRender);
        });

        it('slice drag', (done) => {

            function setD3Event(x, y) {
                let event = <any>document.createEvent('MouseEvents');
                event.sourceEvent = {
                    type: 'mouseEvent',
                    pageX: x,
                    pageY: y,
                    stopPropagation: () => { },
                };
                d3.event = <any>event;
            }

            let pieChart: any = v;
            let interactivityState = pieChart.interactivityState;

            spyOn(powerbi.visuals.SVGUtil, 'translateAndRotate');
            spyOn(pieChart, 'setInteractiveChosenSlice').and.callThrough();
            spyOn(pieChart, 'getAngleFromDragEvent').and.callThrough();

            // simulate a drag gesture from below the center of the donut to it's upper part, 180 degrees drag.
            let centerCoordinates = interactivityState.donutCenter;
            let dragFromCoordinates = { x: centerCoordinates.x, y: centerCoordinates.y - 20 };
            let dragToCoordinates = { x: centerCoordinates.x, y: centerCoordinates.y + 20 };

            let currentRotation = pieChart.interactivityState.currentRotate; 
            // simulate dragging using setting d3.event
            setD3Event(dragFromCoordinates.x, dragFromCoordinates.y);
            pieChart.interactiveDragStart(); // call dragStart
            setD3Event(dragToCoordinates.x, dragToCoordinates.y);
            pieChart.interactiveDragMove(); // call dragMove
            pieChart.interactiveDragEnd(); // complete the drag - call dragEnd

            expect(pieChart.getAngleFromDragEvent.calls.count()).toBe(2); // angle should have been calculated twice (first for dragstart and second for dragEnd)
            expect((<any>powerbi.visuals.SVGUtil.translateAndRotate).calls.first().args[4]).toBe(currentRotation + 180); // first call to rotate (mathches dragMove) should rotate the chart by 180 degrees
            expect(pieChart.setInteractiveChosenSlice).toHaveBeenCalledWith(2);
            done();
        });

        function swipeTest(swipeLeft: boolean, expectedSliceIndex: number, done: any) {
            let pieChart: any = v;
            let interactivityState = pieChart.interactivityState;
            var pieLegend = interactivityState.interactiveLegend;

            spyOn(pieChart, 'setInteractiveChosenSlice').and.callThrough();
            spyOn(pieLegend, 'updateLegend').and.callThrough();

            // drag on the legend
            pieLegend.dragLegend(swipeLeft);
            setTimeout(() => {
                expect(pieChart.setInteractiveChosenSlice).toHaveBeenCalledWith(expectedSliceIndex);
                expect(pieLegend.updateLegend).toHaveBeenCalledWith(expectedSliceIndex);
                expect($('.donutChart').length).toBe(1);
                expect($('.donutLegend').length).toBe(1);
                expect($('.legend-item').length).toBe(3);
                expect($('.donutChart .slice').length).toBe(3);
                done();
            }, DefaultWaitForRender);
        }

        it('legend items swipe right', (done) => swipeTest(false, 2, done)); // swiping right - exepecting to get the last slice index
        it('legend items swipe left', (done) => swipeTest(true, 1, done)); // swiping left - exepecting to get the second slice index

        function rotateValidation(swipeLeft: boolean, done: any) {
            let pieChart: any = v;
            let interactivityState = pieChart.interactivityState;
            var pieLegend = interactivityState.interactiveLegend;

            spyOn(pieChart, 'setInteractiveChosenSlice').and.callThrough();
            spyOn(pieLegend, 'updateLegend').and.callThrough();

            // verify the order of the legend items, and their rotation.
            // the middle should be item 0, to the right, item 1 and to the left of item 0 is item 2.
            // meaning, DOM elements order is item2 -> item0 -> item1
            let legendItems = $('.legend-item');
            expect(legendItems.length).toEqual(3);
            expect(legendItems.eq(0).attr('data-legend-index')).toEqual('2');
            expect(legendItems.eq(1).attr('data-legend-index')).toEqual('0');
            expect(legendItems.eq(2).attr('data-legend-index')).toEqual('1');

            // drag on the legend
            pieLegend.dragLegend(swipeLeft);

            setTimeout(() => {
                // items should be rotated
                let rotatedLegendItems = $('.legend-item');
                if (swipeLeft) {
                    expect(rotatedLegendItems.eq(0).attr('data-legend-index')).toBe('0');
                    expect(rotatedLegendItems.eq(1).attr('data-legend-index')).toBe('1');
                    expect(rotatedLegendItems.eq(2).attr('data-legend-index')).toBe('2');
                } else {
                    expect(rotatedLegendItems.eq(0).attr('data-legend-index')).toBe('1');
                    expect(rotatedLegendItems.eq(1).attr('data-legend-index')).toBe('2');
                    expect(rotatedLegendItems.eq(2).attr('data-legend-index')).toBe('0');
                }
                done();
            }, DefaultWaitForRender);
        }

        it('legend items are rotated correctly when swiping right', (done) => rotateValidation(false, done));
        it('legend items are rotated correctly when swiping left', (done) => rotateValidation(true, done));
    });

    describe("Enumerate Objects", () => {
        let v: powerbi.IVisual, element: JQuery;
        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                }, {
                    displayName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                }
            ],
        };
        let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('donutChart').create();

            v.init({
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
        });

        it('Check enumeration for categorical', (done) => {
            dataViewMetadataTwoColumn.objects = {
                labels: { show: false },
                categoryLabels: { show: true }
            };
            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            };

            v.onDataChanged(dataChangedOptions);
            let points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'dataPoint' });
            expect(points.instances.length).toBe(4);
            expect(points.instances[1].displayName).toEqual('a');
            expect(points.instances[1].properties['fill']).toBeDefined();
            expect(points.instances[2].displayName).toEqual('b');
            expect(points.instances[2].properties['fill']).toBeDefined();
            done();
        });

        it('Check enumeration for category and series', (done) => {
            let dataViewMetadata1Category2Measure: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1' },
                    { displayName: 'col2', isMeasure: true },
                    { displayName: 'col3', isMeasure: true }]
            };

            let categoryIdentities = [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')];
            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata1Category2Measure.columns[1],
                            values: [-200, null, 150],
                            identity: mocks.dataViewScopeIdentity('foo'),
                        }, {
                                source: dataViewMetadata1Category2Measure.columns[2],
                                values: [-300, 300, -50],
                                identity: mocks.dataViewScopeIdentity('bar'),
                            }])
                    }
                }]
            };

            v.onDataChanged(dataChangedOptions);

            let points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'dataPoint' });
            expect(points.instances.length).toBe(4);
            expect(points.instances[1].displayName).toEqual('a');
            expect(points.instances[1].properties['fill']).toBeDefined();
            expect(points.instances[2].displayName).toEqual('b');
            expect(points.instances[2].properties['fill']).toBeDefined();
            done();
        });

        it('Check datapoints enumeration after hiding legend', (done) => {
            let dataView = {
                metadata: dataViewMetadataTwoColumn,
                categorical: {
                    categories: [{
                        source: dataViewMetadataTwoColumn.columns[0],
                        values: ['a', 'b', 'c'],
                        identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataTwoColumn.columns[1],
                        values: [100, 200, 700],
                    }])
                }
            };

            dataView.metadata.objects = { legend: { show: false } };

            v.onDataChanged({
                dataViews: [dataView]
            });

            setTimeout(() => {
                // Check legend is hidden
                expect($('.legend').attr('orientation')).toBe(LegendPosition.None.toString());
                let points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'dataPoint' });
                expect(points.instances.length).toBe(4);
                done();
            }, DefaultWaitForRender);
        });
    });

    describe("Pie Chart Web Animation", () => {
        let v: powerbi.IVisual, element: JQuery;
        let hostServices = powerbitests.mocks.createVisualHostServices();
        let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)
                }, {
                    displayName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                }
            ],
        };
        let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });

        beforeEach(() => {

            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.createMinerva({}).getPlugin('pieChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { selection: true },
                animation: { transitionImmediate: true }
            });
        });

        it('pie chart partial highlight animations', (done) => {
            let dataViewsNoHighlights = {
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            };
            let dataViewsHighlightsA = {
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                            highlights: [50, 26, 560],
                        }])
                    }
                }]
            };
            let dataViewsHighlightsB = {
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                            highlights: [20, 126, 60],
                        }])
                    }
                }]
            };

            v.onDataChanged(dataViewsNoHighlights);
            setTimeout(() => {
                let svgInit = $('.donutChart');
                let initialHeight = svgInit.attr('height'), initialWidth = svgInit.attr('width');

                let animator = <powerbi.visuals.WebDonutChartAnimator>(<DonutChart>v).animator;
                spyOn(animator, 'animate').and.callThrough();

                v.onDataChanged(dataViewsHighlightsA);
                v.onDataChanged(dataViewsHighlightsB);
                v.onDataChanged(dataViewsNoHighlights);

                expect(animator).toBeTruthy();
                expect(animator.animate).toHaveBeenCalled();

                setTimeout(() => {
                    let svg = $('.donutChart');
                    expect(svg).toBeInDOM();

                    expect(svg.attr('height')).toBe(initialHeight);
                    expect(svg.attr('width')).toBe(initialWidth);

                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('pie chart partial highlight animations - suppressAnimations', (done) => {
            let dataViewsNoHighlights = {
                suppressAnimations: true,
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            };
            let dataViewsHighlightsA = {
                suppressAnimations: true,
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                            highlights: [50, 26, 560],
                        }])
                    }
                }]
            };
            let dataViewsHighlightsB = {
                suppressAnimations: true,
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                            highlights: [20, 126, 60],
                        }])
                    }
                }]
            };

            v.onDataChanged(dataViewsNoHighlights);
            setTimeout(() => {
                let svgInit = $('.donutChart');
                let initialHeight = svgInit.attr('height'), initialWidth = svgInit.attr('width');

                let animator = <powerbi.visuals.WebDonutChartAnimator>(<DonutChart>v).animator;
                spyOn(animator, 'animate').and.callThrough();

                v.onDataChanged(dataViewsHighlightsA);
                v.onDataChanged(dataViewsHighlightsB);
                v.onDataChanged(dataViewsNoHighlights);

                expect(animator).toBeTruthy();
                expect(animator.animate).not.toHaveBeenCalled();

                setTimeout(() => {
                    let svg = $('.donutChart');
                    expect(svg).toBeInDOM();

                    expect(svg.attr('height')).toBe(initialHeight);
                    expect(svg.attr('width')).toBe(initialWidth);

                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
    });
}
