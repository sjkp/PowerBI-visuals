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
    import LabelStyle = powerbi.visuals.labelStyle;

    let donutColors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

    const labelsElement = '.donutChart .label';
    const fontFamily = 'wf_standard-font';
    const maxHeightToScaleDonutLegend = 300; // Matches powerbi.visualHost.MobileVisualPluginService.MaxHeightToScaleDonutLegend

    powerbitests.mocks.setLocale();

    describe("DonutChart", () => {
        let dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'col1', queryName: 'col1', roles: { Category: true } },
                { displayName: 'col2', queryName: 'col2', isMeasure: true, roles: { Y: true } },
                { displayName: 'col3', queryName: 'col3', isMeasure: true, roles: { Tooltips: true } }]
        };

        let dataViewMetadataWithFormats: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'col1', queryName: 'col1', format: '$0', roles: { Category: true } },
                { displayName: 'col2', queryName: 'col2', format: '#,0', isMeasure: true, roles: { Y: true } },
                { displayName: 'col3', queryName: 'col3', format: '#,0', isMeasure: true, roles: { Tooltips: true } }]
        };

        let categoryMetaData: powerbi.DataViewMetadataColumn = { displayName: 'category', queryName: 'category', roles: { Category: true } };
        let seriesMetaData: powerbi.DataViewMetadataColumn = { displayName: 'series', queryName: 'series', roles: { Series: true } };
        let measureColumnDynamic1: powerbi.DataViewMetadataColumn = { displayName: 'sales', queryName: 'selectSales', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), groupName: 'A', roles: { Y: true } };
        let measureColumnDynamic2: powerbi.DataViewMetadataColumn = { displayName: 'sales', queryName: 'selectSales', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), groupName: 'B', roles: { Y: true } };
        let measureColumnDynamic1WithFormats: powerbi.DataViewMetadataColumn = { displayName: 'sales', queryName: 'selectSales', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), objects: { general: { formatString: '$0' } }, groupName: 'A', roles: { Y: true } };
        let measureColumnDynamic2WithFormats: powerbi.DataViewMetadataColumn = { displayName: 'sales', queryName: 'selectSales', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), objects: { general: { formatString: '#,0' } }, groupName: 'B', roles: { Y: true } };
        let tooltipColumnDynamic1: powerbi.DataViewMetadataColumn = { displayName: 'tooltip', queryName: 'selectTooltip', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), groupName: 'A', roles: { Tooltips: true } };
        let tooltipColumnDynamic2: powerbi.DataViewMetadataColumn = { displayName: 'tooltip', queryName: 'selectTooltip', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), groupName: 'B', roles: { Tooltips: true } };

        let dataViewMetadata3Measure1Tooltip: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'col1', queryName: 'col1', isMeasure: true, roles: { Y: true } },
                { displayName: 'col2', queryName: 'col2', isMeasure: true, roles: { Y: true } },
                { displayName: 'col3', queryName: 'col3', isMeasure: true, roles: { Y: true } },
                { displayName: 'col4', queryName: 'col4', isMeasure: true, roles: { Tooltips: true } }]
        };

        let dataViewMetadata1Category1Measure1Tooltip: powerbi.DataViewMetadata = {
            columns: [
                categoryMetaData,
                seriesMetaData,
                measureColumnDynamic1,
                measureColumnDynamic2,
                tooltipColumnDynamic1,
                tooltipColumnDynamic2]
        };

        let dataViewMetadata1Category2Measure2Tooltip: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'col1', queryName: 'col1', roles: { Category: true } },
                { displayName: 'col2', queryName: 'col2', isMeasure: true, roles: { Y: true } },
                { displayName: 'col3', queryName: 'col3', isMeasure: true, roles: { Y: true } },
                { displayName: 'col4', queryName: 'col4', isMeasure: true, roles: { Tooltips: true } },
                { displayName: 'col5', queryName: 'col5', isMeasure: true, roles: { Tooltips: true } }]
        };

        let dataViewMetadata1Category2MeasureWithFormat1Tooltip: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'col1', queryName: 'col1', roles: { Category: true } },
                { displayName: 'col2', queryName: 'col2', isMeasure: true, objects: { general: { formatString: "\$#,0;(\$#,0);\$#,0" } }, roles: { Y: true } },
                { displayName: 'col3', queryName: 'col3', isMeasure: true, roles: { Y: true } },
                { displayName: 'col4', queryName: 'col4', isMeasure: true, objects: { general: { formatString: "\$#,0;(\$#,0);\$#,0" } }, roles: { Tooltips: true } }]
        };

        let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });
        let seriesColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'series' });

        it('DonutChart registered capabilities', () => {
            expect(powerbi.visuals.plugins.donutChart.capabilities).toBe(powerbi.visuals.donutChartCapabilities);
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

            let plugin = powerbi.visuals.plugins.donutChart;
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
                        roles: { Category: true }
                    },
                    {
                        displayName: 'col2',
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        queryName: 'col2',
                        roles: { Y: true }
                    }],
            };

            beforeEach(() => {
                element = powerbitests.helpers.testDom('500', '650');
                v = new DonutChart({
                    animator: new powerbi.visuals.WebDonutChartAnimator(),
                    isScrollable: true,
                    tooltipsEnabled: true,
                    behavior: new powerbi.visuals.DonutChartWebBehavior(),
                });
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
                    labels: {
                        show: true,
                        labelStyle: LabelStyle.both
                    },
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
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('NaNNotSupported');
                    done();
                }, DefaultWaitForRender);
            });

            it('Negative value in values shows a warning', (done) => {
                let warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                let options = getOptionsForValueWarning([300, -200, 700]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).toHaveBeenCalled();
                    expect(warningSpy.calls.count()).toBe(1);
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('NegativeValuesNotSupported');
                    done();
                }, DefaultWaitForRender);
            });

            it('All values are negative shows a warning', (done) => {
                let warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                let options = getOptionsForValueWarning([-300, -200, -700]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).toHaveBeenCalled();
                    expect(warningSpy.calls.count()).toBe(1);
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('AllNegativeValuesNotSupported');
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
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('InfinityValuesNotSupported');
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
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('InfinityValuesNotSupported');
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
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('ValuesOutOfRange');
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

            it('Layout - with labels and without', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelPrecision: 0, labelStyle: LabelStyle.data },
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
                    dataViewMetadataWithLabels.objects['labels']['show'] = true;
                    dataViewMetadataWithLabels.objects['labels']['labelStyle'] = LabelStyle.category;
                    dataViews[0].metadata = dataViewMetadataWithLabels;
                    v.onDataChanged({
                        dataViews: dataViews,
                    });
                    setTimeout(() => {
                        let categoryLabelsWidth = v['radius'];
                        dataViewMetadataWithLabels.objects['labels']['show'] = false;
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
                    labels: { show: true, labelPrecision: 0, labelStyle: LabelStyle.both },
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
                    let labels = element.find(labelsElement);
                    expect(helpers.findElementText($(labels[0]).first())).toBe("a (100)");
                    expect(helpers.findElementText($(labels[1]).first())).toBe("b (200)");
                    expect(helpers.findElementText($(labels[2]).first())).toBe("c (700)");

                    expect(helpers.findElementTitle($(labels[0]).first())).toBe("a (100)");
                    expect(helpers.findElementTitle($(labels[1]).first())).toBe("b (200)");
                    expect(helpers.findElementTitle($(labels[2]).first())).toBe("c (700)");
                    done();
                }, DefaultWaitForRender);
            });

            it('Show the correct text - measure with default display units from model', (done) => {

                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelStyle: LabelStyle.both },
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
                    let labels = element.find(labelsElement);

                    expect(helpers.findElementText($(labels[0]))).toBe("a (12.35K)");
                    expect(helpers.findElementText($(labels[1]))).toBe("b (15.53K)");
                    expect(helpers.findElementText($(labels[2]))).toBe("c (0.78K)");

                    expect(helpers.findElementTitle($(labels[0]))).toBe("a (12.35K)");
                    expect(helpers.findElementTitle($(labels[1]))).toBe("b (15.53K)");
                    expect(helpers.findElementTitle($(labels[2]))).toBe("c (0.78K)");

                    done();
                }, DefaultWaitForRender);
            });

            it('Show the correct text - measure with display units and no precision', (done) => {

                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelDisplayUnits: 1000, labelPrecision: 0, labelStyle: LabelStyle.both },
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
                    let labels = element.find(labelsElement);

                    expect(helpers.findElementText($(labels[0]))).toBe("a (12K)");
                    expect(helpers.findElementText($(labels[1]))).toBe("b (16K)");
                    expect(helpers.findElementText($(labels[2]))).toBe("c (1K)");

                    expect(helpers.findElementTitle($(labels[0]))).toBe("a (12K)");
                    expect(helpers.findElementTitle($(labels[1]))).toBe("b (16K)");
                    expect(helpers.findElementTitle($(labels[2]))).toBe("c (1K)");

                    done();
                }, DefaultWaitForRender);
            });

            it('Show the correct text - measure with display units and precision', (done) => {

                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelDisplayUnits: 1000000, labelPrecision: 3, labelStyle: LabelStyle.both },
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
                    let labels = element.find(labelsElement);

                    expect(helpers.findElementText($(labels[0]))).toBe("a (0.012M)");
                    expect(helpers.findElementText($(labels[1]))).toBe("b (0.016M)");
                    expect(helpers.findElementText($(labels[2]))).toBe("c (0.001M)");

                    expect(helpers.findElementTitle($(labels[0]))).toBe("a (0.012M)");
                    expect(helpers.findElementTitle($(labels[1]))).toBe("b (0.016M)");
                    expect(helpers.findElementTitle($(labels[2]))).toBe("c (0.001M)");
                    done();
                }, DefaultWaitForRender);
            });

            it('Show the correct text - measure', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelPrecision: 0, labelStyle: LabelStyle.data },
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
                    let labels = element.find(labelsElement);
                    expect(helpers.findElementText($(labels[0]))).toBe("100");
                    expect(helpers.findElementText($(labels[1]))).toBe("200");
                    expect(helpers.findElementText($(labels[2]))).toBe("700");
                    expect(helpers.findElementTitle($(labels[0]))).toBe("100");
                    expect(helpers.findElementTitle($(labels[1]))).toBe("200");
                    expect(helpers.findElementTitle($(labels[2]))).toBe("700");
                    done();
                }, DefaultWaitForRender);
            });

            it('Show the correct text - category', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelStyle: LabelStyle.category },
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
                    let labels = element.find(labelsElement);

                    expect(helpers.findElementText($(labels[0]))).toBe("a");
                    expect(helpers.findElementText($(labels[1]))).toBe("b");
                    expect(helpers.findElementText($(labels[2]))).toBe("c");

                    expect(helpers.findElementTitle($(labels[0]))).toBe("a");
                    expect(helpers.findElementTitle($(labels[1]))).toBe("b");
                    expect(helpers.findElementTitle($(labels[2]))).toBe("c");
                    done();
                }, DefaultWaitForRender);
            });

            it('Show the correct text - category and series, with slicing and single measure ', (done) => {
                let categoryValues = ['a', 'b', 'c'];
                let categoryIdentities = _.map(categoryValues, (v) => mocks.dataViewScopeIdentity(v));
                let seriesValues = ['A', 'B'];
                let seriesIdentities = _.map(seriesValues, (v) => mocks.dataViewScopeIdentity(v));

                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata1Category1Measure1Tooltip);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelStyle: LabelStyle.category },
                };
                v.onDataChanged({
                    dataViews: [{
                        categorical: {
                            categories: [{
                                source: dataViewMetadata1Category1Measure1Tooltip.columns[0],
                                values: categoryValues,
                                identity: categoryIdentities,
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([
                                {
                                    source: dataViewMetadata1Category1Measure1Tooltip.columns[2],
                                    values: [200, 210, 220],
                                    identity: seriesIdentities[0],
                                }, {
                                    source: dataViewMetadata1Category1Measure1Tooltip.columns[3],
                                    values: [300, 310, 320],
                                    identity: seriesIdentities[1],
                                }
                            ],
                                [seriesColumnRef],
                                seriesMetaData)
                        },
                        metadata: dataViewMetadata1Category1Measure1Tooltip,
                    }]
                });

                setTimeout(() => {
                    let labels = element.find(labelsElement);

                    expect(helpers.findElementText($(labels[0]))).toBe("A");
                    expect(helpers.findElementText($(labels[1]))).toBe("B");

                    expect(helpers.findElementTitle($(labels[0]))).toBe("A");
                    expect(helpers.findElementTitle($(labels[1]))).toBe("B");
                    done();
                }, DefaultWaitForRender);
            });

            it('No data labels', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: false },
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
                    let label = element.find(labelsElement);
                    expect($(label[0]).length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            });

            it('Verify data labels - default style', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelStyle: LabelStyle.data },
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
                    let labels = element.find(labelsElement);
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
                    labels: { show: true, labelStyle: LabelStyle.data },
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
                    labels: { show: true, labelStyle: LabelStyle.data },
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
                    labels: { show: true, color: color, labelStyle: LabelStyle.data },
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
                    let labels = element.find(labelsElement);
                    let fill = $(labels[0]).css('fill');
                    helpers.assertColorsMatch(fill, color.solid.color);
                    done();
                }, DefaultWaitForRender);
            });

            it('Verify data labels - changing category color', (done) => {
                let color = { solid: { color: "rgb(255, 0, 0)" } }; // Red
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, color: color, labelStyle: LabelStyle.category },
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
                    let labels = element.find(labelsElement);
                    let fill = $(labels[0]).css('fill');
                    helpers.assertColorsMatch(fill, color.solid.color);
                    done();
                }, DefaultWaitForRender);
            });

            it('Long data labels - big viewport', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelStyle: LabelStyle.category },
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
                    let labels = element.find(labelsElement);

                    expect(helpers.findElementText($(labels[0]))).toBe("abcdefghijklmnopqrstuvwxyz");
                    expect(helpers.findElementText($(labels[1]))).toBe("01234567890123456789");
                    expect(helpers.findElementText($(labels[2]))).toBe("abcdefg");
                    expect(helpers.findElementText($(labels[3]))).toBe("d");
                    expect(helpers.findElementText($(labels[4]))).toBe("e");

                    expect(helpers.findElementTitle($(labels[0]))).toBe("abcdefghijklmnopqrstuvwxyz");
                    expect(helpers.findElementTitle($(labels[1]))).toBe("01234567890123456789");
                    expect(helpers.findElementTitle($(labels[2]))).toBe("abcdefg");
                    expect(helpers.findElementTitle($(labels[3]))).toBe("d");
                    expect(helpers.findElementTitle($(labels[4]))).toBe("e");
                    done();
                }, DefaultWaitForRender);
            });

            it('Long data labels - small viewport', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelStyle: LabelStyle.category },
                };
                v.onResizing({ height: 600, width: 600 });
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
                    let labels = element.find(labelsElement);
                    expect(helpers.findElementText($(labels[0]))).toContain('…');
                    expect(helpers.findElementText($(labels[1]))).toContain('…');
                    expect(helpers.findElementText($(labels[2]))).toBe("abcdefg");
                    expect(helpers.findElementText($(labels[3]))).toBe("d");
                    expect(helpers.findElementText($(labels[4]))).toBe("e");

                    expect(helpers.findElementTitle($(labels[0]))).toBe("abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz");
                    expect(helpers.findElementTitle($(labels[1]))).toBe("01234567890123456789");
                    expect(helpers.findElementTitle($(labels[2]))).toBe("abcdefg");
                    expect(helpers.findElementTitle($(labels[3]))).toBe("d");
                    expect(helpers.findElementTitle($(labels[4]))).toBe("e");
                    done();
                }, DefaultWaitForRender);
            });

            it('data labels visibility after resizing', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelPrecision: 0, labelStyle: LabelStyle.both },
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
                    let labels = element.find(labelsElement);
                    expect(labels.length).toBe(3);
                    done();
                }, DefaultWaitForRender);
            });

            it('Data lables with null', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelStyle: LabelStyle.category },
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
                    let labels = element.find(labelsElement);
                    expect(labels.length).toBe(3);
                    done();
                }, DefaultWaitForRender);
            });

            it('Verify font size', (done) => {
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, fontSize: 15, labelStyle: LabelStyle.both },
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
                    let labels = element.find(labelsElement);
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
                            roles: { Category: true }
                        },
                        {
                            displayName: 'col2',
                            isMeasure: true,
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                            queryName: 'col1',
                            format: '%#,0',
                            roles: { Y: true }
                        },
                        {
                            displayName: 'col3',
                            isMeasure: true,
                            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                            queryName: 'col3',
                            format: '#,0',
                            roles: { Y: true }
                        }],
                    objects: {
                        labels: { show: true, labelPrecision: 0, labelDisplayUnits: null, labelStyle: LabelStyle.data },
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
                                values: [10, 20, 30],
                            }, {
                                    source: dataViewMetadataWithLabels.columns[2],
                                    values: [100, 2000, 7000],
                                }])
                        }
                    }]
                });
                setTimeout(() => {
                    let labels = element.find(labelsElement);
                    expect(helpers.findElementText(labels.first())).toBe('%1,000');
                    expect(helpers.findElementText(labels.last())).toBe('7,000');
                    expect(helpers.findElementTitle(labels.first())).toBe('%1,000');
                    expect(helpers.findElementTitle(labels.last())).toBe('7,000');
                    done();
                }, DefaultWaitForRender);
            });

            it('Circular margin validation ', (done) => {

                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelStyle: LabelStyle.both },
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
                    let labels = element.find(labelsElement);
                    
                    //The first label is most right, the second label is most left
                    expect($(labels[0]).attr('x')).toBeGreaterThan(+$(labels[1]).attr('x'));
                    expect($(labels[0]).attr('x')).toBeGreaterThan(+$(labels[2]).attr('x'));
                    expect($(labels[2]).attr('x')).toBeGreaterThan(+$(labels[1]).attr('x'));
                    
                    //The last label is top, the second label is button.
                    expect($(labels[1]).attr('y')).toBeGreaterThan(+$(labels[0]).attr('y'));
                    expect($(labels[1]).attr('y')).toBeGreaterThan(+$(labels[2]).attr('y'));
                    expect($(labels[0]).attr('y')).toBeGreaterThan(+$(labels[2]).attr('y'));
                    done();
                }, DefaultWaitForRender);
            });

            it('Data labels split to two lines', () => {
                let secondLineSelector = '.donutChart .label-second-line';
                let dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelStyle: LabelStyle.both },
                };

                v.onResizing({ height: 500, width: 700 });

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['Category Label 1', 'Category Label 2'],
                                identity: [mocks.dataViewScopeIdentity('Category Label 1'),
                                    mocks.dataViewScopeIdentity('Category Label 2')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [150, 150],
                                subtotal: 300
                            }])
                        }
                    }]
                });
                let labels = element.find(labelsElement);
                expect(helpers.findElementText($(labels[0]))).toBe("Category Label 1 (150)");
                expect(helpers.findElementText($(labels[1]))).toBe("Category Label 2 (150)");
                expect(helpers.findElementTitle($(labels[0]))).toBe("Category Label 1 (150)");
                expect(helpers.findElementTitle($(labels[1]))).toBe("Category Label 2 (150)");

                // Label should be split into two lines
                v.onResizing({ height: 500, width: 500 });
                labels = element.find(labelsElement);
                expect(helpers.findElementText($(labels[0]))).toBe("150");
                expect(helpers.findElementText($(labels[1]))).toBe("150");

                labels = element.find(secondLineSelector);
                expect(helpers.findElementText($(labels[0]))).toBe("Category Label 1");
                expect(helpers.findElementText($(labels[1]))).toBe("Category Label 2");

                // Label should be split into two lines and be truncated
                v.onResizing({ height: 500, width: 300 });
                labels = element.find(secondLineSelector);
                expect(helpers.findElementText($(labels[0]))).toContain("…");
                expect(helpers.findElementText($(labels[1]))).toContain("…");

            });
        });

        describe('converter', () => {
            let categoryValues = ['a', 'b', 'c'];
            let categoryIdentities = _.map(categoryValues, (v) => mocks.dataViewScopeIdentity(v));

            it('empty', () => {
                let dataView: powerbi.DataView = {
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
                    highlightsOverflow: false,
                    dataLabelsSettings: powerbi.visuals.dataLabelUtils.getDefaultDonutLabelSettings(),
                    legendObjectProperties: undefined,
                    maxValue: 0,
                    visibleGeometryCulled: false,
                    hasNegativeValues: false,
                    allValuesAreNegative: false,
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
                            values: [300, null, Number.POSITIVE_INFINITY]
                        }])
                    },
                    metadata: dataViewMetadata,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithIdAndMeasureAndCategory(categoryId, dataViewMetadata.columns[1].queryName, dataViewMetadata.columns[0].queryName));
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(<powerbi.data.SQExpr[]>dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        measure: 300,
                        originalMeasure: 300,
                        value: Math.abs(300 / Number.MAX_VALUE),
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "300 (0%)" }],
                        color: sliceColors[0],
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[1],
                        measure: 0,
                        originalMeasure: null,
                        value: 0.0,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }],
                        color: sliceColors[1],
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[2],
                        measure: Number.MAX_VALUE,
                        originalMeasure: Number.POSITIVE_INFINITY,
                        value: 1,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "+Infinity (100%)" }],
                        color: sliceColors[2],
                        strokeWidth: 0,
                    }].map(buildDataPoint);

                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);

                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
            });

            it('categorical, all negative', () => {
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
                            values: [-300, -400, -500]
                        }])
                    },
                    metadata: dataViewMetadata,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithIdAndMeasureAndCategory(categoryId, dataViewMetadata.columns[1].queryName, dataViewMetadata.columns[0].queryName));
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(<powerbi.data.SQExpr[]>dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        measure: Math.abs(-300),
                        originalMeasure: -300,
                        value: Math.abs(-300 /1200),
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-300 (25%)" }],
                        color: sliceColors[0],
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[1],
                        measure: Math.abs(-400),
                        originalMeasure: -400,
                        value: Math.abs(-400 / 1200),
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "-400 (33.33%)"}],
                        color: sliceColors[1],
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[2],
                        measure: Math.abs(-500),
                        originalMeasure: -500,
                        value: Math.abs(-500 / 1200),
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "-500 (41.67%)" }],
                        color: sliceColors[2],
                        strokeWidth: 0,
                    }].map(buildDataPoint);

                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);

                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
            });

            it('categorical, has negative value', () => {
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
                            values: [300, 400, -500]
                        }])
                    },
                    metadata: dataViewMetadata,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithIdAndMeasureAndCategory(categoryId, dataViewMetadata.columns[1].queryName, dataViewMetadata.columns[0].queryName));
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(<powerbi.data.SQExpr[]>dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        measure: 300,
                        originalMeasure: 300,
                        value: 300 / 700,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "300 (42.86%)" }],
                        color: sliceColors[0],
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[1],
                        measure: 400,
                        originalMeasure: 400,
                        value: 400 / 700,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "400 (57.14%)" }],
                        color: sliceColors[1],
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[2],
                        measure: 0,
                        originalMeasure: -500,
                        value: 0,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "-500 (0%)" }],
                        color: sliceColors[2],
                        strokeWidth: 0,
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
                let selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithIdAndMeasureAndCategory(categoryId, dataViewMetadata.columns[1].queryName, dataViewMetadata.columns[0].queryName));
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(<powerbi.data.SQExpr[]>dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        measure: 0,
                        originalMeasure: -300,
                        value: 0.0,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-300 (0%)" }],
                        color: sliceColors[0],
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[1],
                        measure: 0,
                        originalMeasure: null,
                        value: 0.0,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }],
                        color: sliceColors[1],
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[2],
                        measure: 700,
                        originalMeasure: 700,
                        value: 1,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "700 (100%)" }],
                        color: sliceColors[2],
                        strokeWidth: 0,
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
                let selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithIdAndMeasureAndCategory(categoryId, dataViewMetadata.columns[1].queryName, dataViewMetadata.columns[0].queryName));
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(<powerbi.data.SQExpr[]>dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        measure: 0,
                        originalMeasure: -300,
                        value: 0,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-300 (0%)" }],
                        color: sliceColors[0],
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[1],
                        measure: 0,
                        originalMeasure: null,
                        value: 0,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }],
                        color: sliceColors[1],
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[2],
                        measure: 700,
                        originalMeasure: 700,
                        value: 1,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "700 (100%)" }],
                        color: sliceColors[2],
                        strokeWidth: 0,
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
            });

            it('category and multi-measure slices and add two tooltip bucket items', () => {

                let dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure2Tooltip.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata1Category2Measure2Tooltip.columns[1],
                            values: [200, null, 150],
                        }, {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[2],
                            values: [300, 300, -50],
                            }, {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[3],
                                values: [-100, null, 30],
                            }, {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[4],
                                values: [null, 200, -50],
                            }])
                    },
                    metadata: dataViewMetadata1Category2Measure2Tooltip,
                }; 
                let actualData = DonutChart.converter(dataView, donutColors, /*defaultDataPointColor*/null, /*viewport*/null, /*disableGeometricCulling*/null, /*interactivityService*/null, /*tooltipsEnabled*/true, /*tooltipBucketEnabled*/true);
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(<powerbi.data.SQExpr[]>dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let categoryQueryName = dataView.categorical.categories[0].source.queryName;
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[0]), dataViewMetadata1Category2Measure2Tooltip.columns[1].queryName),
                        measure: 200,
                        originalMeasure: 200,
                        value: 200 / (200 + 300 + 300 + 150),
                        index: 0,
                        label: 'col2',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "200 (21.05%)" }, { displayName: "col4", value: "-100" }],
                        color: sliceColors[0],
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[0]), dataViewMetadata1Category2Measure2Tooltip.columns[2].queryName),
                        measure: 300,
                        originalMeasure: 300,
                        value: 300 / (200 + 300 + 300 + 150),
                        index: 1,
                        label: 'col3',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col3", value: "300 (31.58%)" }, { displayName: "col4", value: "-100" }],
                        color: sliceColors[0],
                        strokeWidth: 1,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), dataViewMetadata1Category2Measure2Tooltip.columns[1].queryName),
                        measure: 0,
                        originalMeasure: null,
                        value: 0.0,
                        index: 2,
                        label: 'col2',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col5", value: "200" }],
                        color: sliceColors[1],
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), dataViewMetadata1Category2Measure2Tooltip.columns[2].queryName),
                        measure: 300,
                        originalMeasure: 300,
                        value: 300/(200+300+300+150),
                        index: 3,
                        label: 'col3',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col3", value: "300 (31.58%)" }, { displayName: "col5", value: "200" }],
                        color: sliceColors[1],
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), dataViewMetadata1Category2Measure2Tooltip.columns[1].queryName),
                        measure: 150,
                        originalMeasure: 150,
                        value: 150 / (200 + 300 + 300 + 150),
                        index: 4,
                        label: 'col2',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "150 (15.79%)" }, { displayName: "col4", value: "30" }, { displayName: "col5", value: "-50" }],
                        color: sliceColors[2],
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), dataViewMetadata1Category2Measure2Tooltip.columns[2].queryName),
                        measure: 0,
                        originalMeasure: -50,
                        value: 0,
                        index: 5,
                        label: 'col3',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col3", value: "-50 (0%)" }, { displayName: "col4", value: "30" }, { displayName: "col5", value: "-50" }],
                        color: sliceColors[2],
                        strokeWidth: 0,
                    }].map(buildDataPoint);

                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);

                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints.length).toBe(3);
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
                expect(actualData.legendData.dataPoints[1].label).toBe('b');
                expect(actualData.legendData.dataPoints[2].label).toBe('c');
            });

            it('category and series, with slicing and single measure', () => {
                let seriesValues = ['A', 'B'];
                let seriesIdentities = _.map(seriesValues, (v) => mocks.dataViewScopeIdentity(v));
                let dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category1Measure1Tooltip.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category1Measure1Tooltip.columns[2],
                                values: [200, 210, 220],
                                identity: seriesIdentities[0],
                            }, {
                                source: dataViewMetadata1Category1Measure1Tooltip.columns[3],
                                values: [300, 310, 320],
                                identity: seriesIdentities[1],
                            }
                        ],
                            [seriesColumnRef],
                            seriesMetaData)
                    },
                    metadata: dataViewMetadata1Category1Measure1Tooltip,
                };

                let actualData = DonutChart.converter(dataView, donutColors);

                let identity: SelectionId[][] = [];
                for (let seriesIndex = 0; seriesIndex < seriesValues.length; seriesIndex++) {
                    identity.push([]);
                    for (let categoryIndex = 0; categoryIndex < categoryValues.length; categoryIndex++) {
                        identity[seriesIndex].push(powerbi.visuals.SelectionIdBuilder.builder()
                            .withCategory(dataView.categorical.categories[0], categoryIndex)
                            .withSeries(dataView.categorical.values, dataView.categorical.values[seriesIndex])
                            .withMeasure('selectSales')
                            .createSelectionId());
                    }
                }

                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(<powerbi.data.SQExpr[]>dataView.categorical.categories[0].identityFields);

                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor(categoryValues[0]).value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor(categoryValues[1]).value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor(categoryValues[2]).value,
                ];

                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: identity[0][0],
                        label: seriesValues[0],
                        measure: 200,
                        originalMeasure: 200,
                        value: 200/1560,
                        index: 0,
                        tooltipInfo: [{ displayName: "category", value: "a" }, { displayName: "series", value: "A" }, { displayName: "sales", value: "200.00 (12.82%)" }],
                        color: sliceColors[0],
                        labelFormatString: undefined,
                        strokeWidth: 0,
                    }, {
                        identity: identity[1][0],
                        label: seriesValues[1],
                        measure: 300,
                        originalMeasure: 300,
                        value: 300/1560,
                        index: 1,
                        tooltipInfo: [{ displayName: "category", value: "a" }, { displayName: "series", value: "B" }, { displayName: "sales", value: "300.00 (19.23%)" }],
                        color: sliceColors[0],
                        labelFormatString: undefined,
                        strokeWidth: 1,
                    }, {
                        identity: identity[0][1],
                        label: seriesValues[0],
                        measure: 210,
                        originalMeasure: 210,
                        value: 210 / 1560,
                        index: 2,
                        tooltipInfo: [{ displayName: "category", value: "b" }, { displayName: "series", value: "A" }, { displayName: "sales", value: "210.00 (13.46%)" }],
                        color: sliceColors[1],
                        labelFormatString: undefined,
                        strokeWidth: 0,
                    }, {
                        identity: identity[1][1],
                        label: seriesValues[1],
                        measure: 310,
                        originalMeasure: 310,
                        value: 310 / 1560,
                        index: 3,
                        tooltipInfo: [{ displayName: "category", value: "b" }, { displayName: "series", value: "B" }, { displayName: "sales", value: "310.00 (19.87%)" }],
                        color: sliceColors[1],
                        labelFormatString: undefined,
                        strokeWidth: 1,
                    }, {
                        identity: identity[0][2],
                        label: seriesValues[0],
                        measure: 220,
                        originalMeasure: 220,
                        value: 220 / 1560,
                        index: 4,
                        tooltipInfo: [{ displayName: "category", value: "c" }, { displayName: "series", value: "A" }, { displayName: "sales", value: "220.00 (14.1%)" }],
                        color: sliceColors[2],
                        labelFormatString: undefined,
                        strokeWidth: 0,
                    }, {
                        identity: identity[1][2],
                        label: seriesValues[1],
                        measure: 320,
                        originalMeasure: 320,
                        value: 320 / 1560,
                        index: 5,
                        tooltipInfo: [{ displayName: "category", value: "c" }, { displayName: "series", value: "B" }, { displayName: "sales", value: "320.00 (20.51%)" }],
                        color: sliceColors[2],
                        labelFormatString: undefined,
                        strokeWidth: 1,
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                
                // Legend
                expect(actualData.legendData.title).toBe('category');
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
                            values: [300, null, 700]
                        }])
                    },
                    metadata: dataViewMetadata,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithIdAndMeasureAndCategory(categoryId, dataViewMetadata.columns[1].queryName, dataViewMetadata.columns[0].queryName));
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(<powerbi.data.SQExpr[]>dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    hexGreen,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        measure: 300,
                        originalMeasure: 300,
                        value: 0.3,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "300 (30%)" }],
                        color: sliceColors[0],
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[1],
                        measure: 0,
                        originalMeasure: null,
                        value: 0,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }],
                        color: sliceColors[1],
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[2],
                        measure: 700,
                        originalMeasure: 700,
                        value: 0.7,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "700 (70%)" }],
                        color: sliceColors[2],
                        strokeWidth: 0,
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
                            values: [300, 500, 700]
                        }])
                    },
                    metadata: null,
                };

                //red will be used as the default color
                let redHexColor = "FF0000";

                let actualData = DonutChart.converter(dataView, donutColors, redHexColor, null, true);
                let selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithIdAndMeasureAndCategory(categoryId, dataViewMetadata.columns[1].queryName, dataViewMetadata.columns[0].queryName));
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        measure: 300,
                        originalMeasure: 300,
                        value: 300/1500,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "300 (20%)" }],
                        color: redHexColor,
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[1],
                        measure: 500,
                        originalMeasure: 500,
                        value: 500 / 1500,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "500 (33.33%)" }],
                        color: redHexColor,
                        strokeWidth: 1,
                    }, {
                        identity: selectionIds[2],
                        measure: 700,
                        originalMeasure: 700,
                        value: 700 / 1500,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "700 (46.67%)" }],
                        color: redHexColor,
                        strokeWidth: 1,
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
                            values: [300, null, 700]
                        }])
                    },
                    metadata: null,
                };

                let actualData = DonutChart.converter(dataView, donutColors, hexDefaultColorRed);
                let selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithIdAndMeasureAndCategory(categoryId, dataViewMetadata.columns[1].queryName, dataViewMetadata.columns[0].queryName));
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        measure: 300,
                        originalMeasure: 300,
                        value: 0.3,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "300 (30%)" }],
                        color: hexDefaultColorRed,
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[1],
                        measure: 0,
                        originalMeasure: null,
                        value: 0,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }],
                        color: hexGreen,
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[2],
                        measure: 700,
                        originalMeasure: 700,
                        value: 0.7,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "700 (70%)" }],
                        color: hexDefaultColorRed,
                        strokeWidth: 1,
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
                            source: dataViewMetadata1Category2Measure2Tooltip.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[1],
                                values: [200, null, 150]
                            },
                            {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[2],
                                values: [300, 300, 50]
                            }
                        ])
                    },
                    metadata: dataViewMetadata1Category2Measure2Tooltip,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(<powerbi.data.SQExpr[]>dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];

                let categoryQueryName = dataView.categorical.categories[0].source.queryName;
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[0]), 'col2'),
                        measure: 200,
                        originalMeasure: 200,
                        label: 'col2',
                        value: 0.2,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "200 (20%)" }],
                        color: sliceColors[0],
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[0]), 'col3'),
                        measure: 300,
                        originalMeasure: 300,
                        label: 'col3',
                        value: 0.3,
                        index: 1,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col3", value: "300 (30%)" }],
                        color: sliceColors[0],
                        strokeWidth: 1,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), 'col2'),
                        measure: 0,
                        originalMeasure: null,
                        label: 'col2',
                        value: 0,
                        index: 2,
                        tooltipInfo: [{ displayName: "col1", value: "b" }],
                        color: sliceColors[1],
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), 'col3'),
                        measure: 300,
                        originalMeasure: 300,
                        label: 'col3',
                        value: 0.3,
                        index: 3,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col3", value: "300 (30%)" }],
                        color: sliceColors[1],
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), 'col2'),
                        label: 'col2',
                        measure: 150,
                        originalMeasure: 150,
                        value: 0.15,
                        index: 4,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "150 (15%)" }],
                        color: sliceColors[2],
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), 'col3'),
                        label: 'col3',
                        measure: 50,
                        originalMeasure: 50,
                        value: 0.05,
                        index: 5,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col3", value: "50 (5%)" }],
                        color: sliceColors[2],
                        strokeWidth: 1,
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
                            source: dataViewMetadata1Category2Measure2Tooltip.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[1],
                                values: [200, null, 150]
                            },
                            {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[2],
                                values: [300, 300, 50]
                            }
                        ])
                    },
                    metadata: dataViewMetadata1Category2Measure2Tooltip,
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
                                source: dataViewMetadata3Measure1Tooltip.columns[0],
                                values: [Number.POSITIVE_INFINITY]
                            }
                        ])
                    },
                    metadata: dataViewMetadata3Measure1Tooltip,
                };

                // Slicing does not come into effect for non-categorical single-measure
                let actualData = DonutChart.converter(dataView, donutColors);
                let selectionIds = dataViewMetadata3Measure1Tooltip.columns.map((c) => SelectionId.createWithMeasure(c.displayName));
                let sliceColors = [donutColors.getColorByIndex(0).value];
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        label: 'col1',
                        measure: Number.MAX_VALUE,
                        originalMeasure: Number.POSITIVE_INFINITY,
                        value: 1.0,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "+Infinity (100%)" }],
                        color: sliceColors[0],
                        strokeWidth: 0,
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                
                // Legend
                expect(actualData.legendData.title).toBe('');
                expect(actualData.legendData.dataPoints[0].label).toBe('col1');
            });

            it('non-categorical multi-measure, with slicing and add one tooltip bucket item', () => {    
                // Explicitly set the color for the first measure.
                let columnWithColor = powerbi.Prototype.inherit(dataViewMetadata3Measure1Tooltip.columns[0]);
                columnWithColor.objects = { dataPoint: { fill: { solid: { color: 'red' } } } };

                let dataView: powerbi.DataView = {
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: columnWithColor,
                                values: [200]
                            },
                            {
                                source: dataViewMetadata3Measure1Tooltip.columns[1],
                                values: [300]
                            },
                            {
                                source: dataViewMetadata3Measure1Tooltip.columns[2],
                                values: [500]
                            },
                            {
                                source: dataViewMetadata3Measure1Tooltip.columns[3],
                                values: [100]
                            }
                        ])
                    },
                    metadata: dataViewMetadata3Measure1Tooltip,
                };

                // Slicing does not come into effect for non-categorical multi-measure
                let actualData = DonutChart.converter(dataView, donutColors, /*defaultDataPointColor*/null, /*viewport*/null, /*disableGeometricCulling*/null, /*interactivityService*/null, /*tooltipsEnabled*/true, /*tooltipBucketEnabled*/true);
                let selectionIds = dataViewMetadata3Measure1Tooltip.columns.map((c) => SelectionId.createWithMeasure(c.displayName));

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
                        originalMeasure: 200,
                        value: 0.2,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "200 (20%)" }, { displayName: "col4", value: "100" }],
                        color: sliceColors[0],
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[1],
                        label: 'col2',
                        measure: 300,
                        originalMeasure: 300,
                        value: 0.3,
                        index: 1,
                        tooltipInfo: [{ displayName: "col2", value: "300 (30%)" }, { displayName: "col4", value: "100" }],
                        color: sliceColors[1],
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[2],
                        label: 'col3',
                        measure: 500,
                        originalMeasure: 500,
                        value: 0.5,
                        index: 2,
                        tooltipInfo: [{ displayName: "col3", value: "500 (50%)" }, { displayName: "col4", value: "100" }],
                        color: sliceColors[2],
                        strokeWidth: 0,
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)[1]).toEqual(expectSlices[1]);
                
                // Legend
                expect(actualData.legendData.title).toBe('');
                expect(actualData.legendData.dataPoints[0].label).toBe('col1');
            });

            it('non-categorical single-measure, with slicing and turn off tooltip bucket', () => {
                let dataView: powerbi.DataView = {
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata3Measure1Tooltip.columns[0],
                                values: [200]
                            }, {
                                source: dataViewMetadata3Measure1Tooltip.columns[3],
                                values: [100]
                            },

                        ])
                    },
                    metadata: dataViewMetadata3Measure1Tooltip,
                };

                // Slicing does not come into effect for non-categorical single-measure
                let actualData = DonutChart.converter(dataView, donutColors);
                let selectionIds = dataViewMetadata3Measure1Tooltip.columns.map((c) => SelectionId.createWithMeasure(c.displayName));
                let sliceColors = [donutColors.getColorByIndex(0).value];
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        label: 'col1',
                        measure: 200,
                        originalMeasure: 200,
                        value: 1.0,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "200 (100%)" }],
                        color: sliceColors[0],
                        strokeWidth: 0,
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
                let selectionIds = dataView.categorical.values.map((c) => SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(seriesMetaData.queryName, c.identity), c.source.queryName));
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
                        originalMeasure: Number.POSITIVE_INFINITY,
                        value: 1.0,
                        index: 0,
                        tooltipInfo: [{ displayName: "series", value: "A" }, { displayName: "sales", value: "+Infinity (100%)" }],
                        color: sliceColors[0],
                        labelFormatString: undefined,
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[1],
                        label: 'B',
                        measure: 300,
                        originalMeasure: 300,
                        value: Math.abs(300 / Number.MAX_VALUE),
                        index: 1,
                        tooltipInfo: [{ displayName: "series", value: "B" }, { displayName: "sales", value: "300.00 (0%)" }],
                        color: sliceColors[1],
                        labelFormatString: undefined,
                        strokeWidth: 0,
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
                let selectionIds = dataView.categorical.values.map((c) => SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(seriesMetaData.queryName, c.identity), c.source.queryName));
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
                        originalMeasure: 200,
                        value: 0.4,
                        index: 0,
                        tooltipInfo: [{ displayName: "series", value: "A" }, { displayName: "sales", value: "200.00 (40%)" }],
                        color: sliceColors[0],
                        labelFormatString: undefined,
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[1],
                        label: 'B',
                        measure: 300,
                        originalMeasure: 300,
                        value: 0.6,
                        index: 1,
                        tooltipInfo: [{ displayName: "series", value: "B" }, { displayName: "sales", value: "300.00 (60%)" }],
                        color: sliceColors[1],
                        labelFormatString: undefined,
                        strokeWidth: 0,
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                
                // Legend
                expect(actualData.legendData.title).toBe('series');
                expect(actualData.legendData.dataPoints[0].label).toBe('A');
                expect(actualData.legendData.dataPoints[1].label).toBe('B');
            });

            it('non-categorical series and tooltip bucket', () => {
                let identityA = mocks.dataViewScopeIdentity('A');
                let identityB = mocks.dataViewScopeIdentity('B');
                let dataView: powerbi.DataView = {
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: measureColumnDynamic1,
                                values: [200],
                                identity: identityA,
                            }, {
                                source: tooltipColumnDynamic1,
                                values: [40],
                                identity: identityA,
                            }, {
                                source: measureColumnDynamic2,
                                values: [300],
                                identity: identityB,
                            }, {
                                source: tooltipColumnDynamic2,
                                values: [50],
                                identity: identityB,
                            }
                        ],
                            [seriesColumnRef],
                            seriesMetaData)
                    },
                    metadata: dataViewMetadata,
                };

                let actualData = DonutChart.converter(dataView, donutColors, /*defaultDataPointColor*/null, /*viewport*/null, /*disableGeometricCulling*/null, /*interactivityService*/null, /*tooltipsEnabled*/true, /*tooltipBucketEnabled*/true);
                
                // Legend
                expect(actualData.legendData.title).toBe('series');
                expect(actualData.legendData.dataPoints[0].label).toBe('A');
                expect(actualData.legendData.dataPoints[1].label).toBe('B');
                //Tooltips
                expect(actualData.dataPoints[0].data.tooltipInfo).toEqual([{ displayName: "series", value: "A" }, { displayName: "sales", value: "200.00 (40%)" }, { displayName: "tooltip", value: "40" }]);
                expect(actualData.dataPoints[1].data.tooltipInfo).toEqual([{ displayName: "series", value: "B" }, { displayName: "sales", value: "300.00 (60%)" }, { displayName: "tooltip", value: "50" }]);
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
                var selectionIds = dataView.categorical.values.map((c) => SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(seriesMetaData.queryName, c.identity), c.source.queryName));
                var columnRefId = powerbi.data.SQExprShortSerializer.serializeArray([categoryColumnRef]);
                var sliceColors = [
                    donutColors.getColorScaleByKey(columnRefId).getColor('A').value,
                ];

                var expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        label: 'A',
                        measure: 200,
                        originalMeasure: 200,
                        value: 1,
                        index: 0,
                        tooltipInfo: [{ displayName: "series", value: "A" }, { displayName: "sales", value: "200.00 (100%)" }],
                        color: sliceColors[0],
                        labelFormatString: undefined,
                        strokeWidth: 0,
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
                let selectionIds = dataView.categorical.values.map((c) => SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(seriesMetaData.queryName, c.identity), c.source.queryName));
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        label: 'A',
                        measure: 200,
                        originalMeasure: 200,
                        value: 0.4,
                        index: 0,
                        tooltipInfo: [{ displayName: "series", value: "A" }, { displayName: "sales", value: "200.00 (40%)" }],
                        color: 'green',
                        labelFormatString: undefined,
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[1],
                        label: 'B',
                        measure: 300,
                        originalMeasure: 300,
                        value: 0.6,
                        index: 1,
                        tooltipInfo: [{ displayName: "series", value: "B" }, { displayName: "sales", value: "300.00 (60%)" }],
                        color: 'red',
                        labelFormatString: undefined,
                        strokeWidth: 0,
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
                let selectionIds = dataView.categorical.values.map((c) => SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(seriesMetaData.queryName, c.identity), c.source.queryName));
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
                        originalMeasure: 200,
                        measureFormat: '$0',
                        value: 0.4,
                        index: 0,
                        tooltipInfo: [{ displayName: "series", value: "A" }, { displayName: "sales", value: "$200 (40%)" }],
                        color: sliceColors[0],
                        categoryLabel: 'A',
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[1],
                        label: 'B',
                        measure: 300,
                        originalMeasure: 300,
                        measureFormat: '#,0',
                        value: 0.6,
                        index: 1,
                        tooltipInfo: [{ displayName: "series", value: "B" }, { displayName: "sales", value: "300 (60%)" }],
                        color: sliceColors[1],
                        categoryLabel: 'B',
                        strokeWidth: 0,
                    }].map(buildDataPoint);

                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
            });

            it('with highlights', () => {
                // categorical, multi-measure slices, with highlights
                let dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure2Tooltip.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[1],
                                values: [200, null, 150],
                                highlights: [100, null, 15],
                            },
                            {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[2],
                                values: [300, 300, 50],
                                highlights: [150, 75, 50],
                            }
                        ])
                    },
                    metadata: dataViewMetadata1Category2Measure2Tooltip,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(<powerbi.data.SQExpr[]>dataView.categorical.categories[0].identityFields);
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
                        measure: 200,
                        originalMeasure: 200,
                        label: 'col2',
                        highlightRatio: 0.5,
                        highlightValue: 100,
                        originalHighlightValue: 100,
                        value: 0.2,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "200 (20%)" }, { displayName: highlightDisplayName, value: "100 (10%)" }],
                        color: sliceColors[0],
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[0]), 'col3'),
                        measure: 300,
                        originalMeasure: 300,
                        label: 'col3',
                        highlightRatio: 0.5,
                        highlightValue: 150,
                        originalHighlightValue: 150,
                        value: 0.3,
                        index: 1,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col3", value: "300 (30%)" }, { displayName: highlightDisplayName, value: "150 (15%)" }],
                        color: sliceColors[0],
                        labelFormatString: undefined,
                        strokeWidth: 1,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), 'col2'),
                        measure: 0,
                        originalMeasure: null,
                        label: 'col2',
                        highlightRatio: 1e-9,
                        highlightValue: 0,
                        originalHighlightValue: null,
                        value: 0,
                        index: 2,
                        tooltipInfo: [{ displayName: "col1", value: "b" }],
                        color: sliceColors[1],
                        labelFormatString: undefined,
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), 'col3'),
                        measure: 300,
                        originalMeasure: 300,
                        label: 'col3',
                        highlightRatio: 0.25,
                        highlightValue: 75,
                        originalHighlightValue: 75,
                        value: 0.3,
                        index: 3,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col3", value: "300 (30%)" }, { displayName: highlightDisplayName, value: "75 (7.5%)" }],
                        color: sliceColors[1],
                        labelFormatString: undefined,
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), 'col2'),
                        label: 'col2',
                        highlightRatio: 0.1,
                        highlightValue: 15,
                        originalHighlightValue: 15,
                        measure: 150,
                        originalMeasure: 150,
                        value: 0.15,
                        index: 4,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "150 (15%)" }, { displayName: highlightDisplayName, value: "15 (1.5%)" }],
                        color: sliceColors[2],
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), 'col3'),
                        label: 'col3',
                        highlightRatio: 1,
                        highlightValue: 50,
                        originalHighlightValue: 50,
                        measure: 50,
                        originalMeasure: 50,
                        value: 0.05,
                        index: 5,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col3", value: "50 (5%)" }, { displayName: highlightDisplayName, value: "50 (5%)" }],
                        color: sliceColors[2],
                        labelFormatString: undefined,
                        strokeWidth: 1,
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints.length).toBe(3);
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
                expect(actualData.legendData.dataPoints[1].label).toBe('b');
                expect(actualData.legendData.dataPoints[2].label).toBe('c');
            });

            it('with highlights, has negative value', () => {
                // categorical, multi-measure slices, with highlights
                let dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure2Tooltip.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[1],
                                values: [200, 0, 150],
                                highlights: [100, -200, 15],
                            },
                            {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[2],
                                values: [300, 300, 50],
                                highlights: [150, 75, 50],
                            }
                        ])
                    },
                    metadata: dataViewMetadata1Category2Measure2Tooltip,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(<powerbi.data.SQExpr[]>dataView.categorical.categories[0].identityFields);
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
                        measure: 200,
                        originalMeasure: 200,
                        label: 'col2',
                        highlightRatio: 0.5,
                        highlightValue: 100,
                        originalHighlightValue: 100,
                        value: 0.2,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "200 (20%)" }, { displayName: highlightDisplayName, value: "100 (10%)" }],
                        color: sliceColors[0],
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[0]), 'col3'),
                        measure: 300,
                        originalMeasure: 300,
                        label: 'col3',
                        highlightRatio: 0.5,
                        highlightValue: 150,
                        originalHighlightValue: 150,
                        value: 0.3,
                        index: 1,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col3", value: "300 (30%)" }, { displayName: highlightDisplayName, value: "150 (15%)" }],
                        color: sliceColors[0],
                        labelFormatString: undefined,
                        strokeWidth: 1,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), 'col2'),
                        measure: 0,
                        originalMeasure: 0,
                        label: 'col2',
                        highlightRatio: 1e-9,
                        highlightValue: 0,
                        originalHighlightValue: -200,
                        value: 0,
                        index: 2,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0 (0%)" }, { displayName: highlightDisplayName, value: "-200 (0%)" }],
                        color: sliceColors[1],
                        labelFormatString: undefined,
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), 'col3'),
                        measure: 300,
                        originalMeasure: 300,
                        label: 'col3',
                        highlightRatio: 0.25,
                        highlightValue: 75,
                        originalHighlightValue: 75,
                        value: 0.3,
                        index: 3,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col3", value: "300 (30%)" }, { displayName: highlightDisplayName, value: "75 (7.5%)" }],
                        color: sliceColors[1],
                        labelFormatString: undefined,
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), 'col2'),
                        label: 'col2',
                        highlightRatio: 0.1,
                        highlightValue: 15,
                        originalHighlightValue: 15,
                        measure: 150,
                        originalMeasure: 150,
                        value: 0.15,
                        index: 4,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "150 (15%)" }, { displayName: highlightDisplayName, value: "15 (1.5%)" }],
                        color: sliceColors[2],
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), 'col3'),
                        label: 'col3',
                        highlightRatio: 1,
                        highlightValue: 50,
                        originalHighlightValue: 50,
                        measure: 50,
                        originalMeasure: 50,
                        value: 0.05,
                        index: 5,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col3", value: "50 (5%)" }, { displayName: highlightDisplayName, value: "50 (5%)" }],
                        color: sliceColors[2],
                        labelFormatString: undefined,
                        strokeWidth: 1,
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints.length).toBe(3);
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
                expect(actualData.legendData.dataPoints[1].label).toBe('b');
                expect(actualData.legendData.dataPoints[2].label).toBe('c');
            });

            it('with highlights, all negative values', () => {
                // categorical, multi-measure slices, with highlights
                let dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure2Tooltip.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[1],
                                values: [-200, -150, -100],
                                highlights: [-100, -50, -15],
                            }
                        ])
                    },
                    metadata: dataViewMetadata1Category2Measure2Tooltip,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(<powerbi.data.SQExpr[]>dataView.categorical.categories[0].identityFields);
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
                        measure: 200,
                        originalMeasure: -200,
                        label: 'a',
                        highlightRatio: 0.5,
                        highlightValue: 100,
                        originalHighlightValue: -100,
                        value: 200 / 450,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-200 (44.44%)" }, { displayName: highlightDisplayName, value: "-100 (22.22%)" }],
                        color: sliceColors[0],
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), 'col2'),
                        measure: 150,
                        originalMeasure: -150,
                        label: 'b',
                        highlightRatio: 50 / 150,
                        highlightValue: 50,
                        originalHighlightValue: -50,
                        value: 150 / 450,
                        index: 1,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "-150 (33.33%)" }, { displayName: highlightDisplayName, value: "-50 (11.11%)" }],
                        color: sliceColors[1],
                        labelFormatString: undefined,
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), 'col2'),
                        label: 'c',
                        highlightRatio: 0.15,
                        highlightValue: 15,
                        originalHighlightValue: -15,
                        measure: 100,
                        originalMeasure: -100,
                        value: 100 / 450,
                        index: 2,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "-100 (22.22%)" }, { displayName: highlightDisplayName, value: "-15 (3.33%)" }],
                        color: sliceColors[2],
                        strokeWidth: 0,
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints.length).toBe(3);
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
                expect(actualData.legendData.dataPoints[1].label).toBe('b');
                expect(actualData.legendData.dataPoints[2].label).toBe('c');
            });

            it('with highlights, all negative values and overflow', () => {
                // categorical, multi-measure slices, with highlights
                let dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure2Tooltip.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[1],
                                values: [-200, -150, -100],
                                highlights: [-100, -300, -15],
                            }
                        ])
                    },
                    metadata: dataViewMetadata1Category2Measure2Tooltip,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(<powerbi.data.SQExpr[]>dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let categoryQueryName = dataView.categorical.categories[0].source.queryName;
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[0]), 'col2'),
                        measure: 100,
                        originalMeasure: -100,
                        label: 'a',
                        highlightRatio: 1,
                        value: 100 / 415,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-100 (24.1%)" }],
                        color: sliceColors[0],
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), 'col2'),
                        measure: 300,
                        originalMeasure: -300,
                        label: 'b',
                        highlightRatio: 1,
                        value: 300 / 415,
                        index: 1,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "-300 (72.29%)" }],
                        color: sliceColors[1],
                        labelFormatString: undefined,
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), 'col2'),
                        label: 'c',
                        highlightRatio: 1,
                        measure: 15,
                        originalMeasure: -15,
                        value: 15 / 415,
                        index: 2,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "-15 (3.61%)" }],
                        color: sliceColors[2],
                        strokeWidth: 0,
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
            it('with highlights - special case tooltip validation and add one tooltip bucket item', () => {    
                // categorical, multi-measure slices, zero-highlight as special case
                let dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure2Tooltip.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2MeasureWithFormat1Tooltip.columns[1],
                                values: [200, null, 0],
                                highlights: [0, null, 0],
                            }, {
                                source: dataViewMetadata1Category2MeasureWithFormat1Tooltip.columns[2],
                                values: [300, 300, 50],
                                highlights: [0, 75, 50],
                            }, {
                                source: dataViewMetadata1Category2MeasureWithFormat1Tooltip.columns[3],
                                values: [100, -200, 50]
                            }]),
                    },
                    metadata: null,
                };

                let actualData = DonutChart.converter(dataView, donutColors, /*defaultDataPointColor*/null, /*viewport*/null, /*disableGeometricCulling*/null, /*interactivityService*/null, /*tooltipsEnabled*/true, /*tooltipBucketEnabled*/true);
                let highlightName = powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName;

                expect(actualData.dataPoints[0].data.tooltipInfo).toEqual([{ displayName: "col1", value: "a" }, { displayName: "col2", value: "$200 (23.53%)" }, { displayName: highlightName, value: "$0 (0%)" }, { displayName: 'col4', value: '$100' }]);
                expect(actualData.dataPoints[1].data.tooltipInfo).toEqual([{ displayName: "col1", value: "a" }, { displayName: "col3", value: "300 (35.29%)" }, { displayName: highlightName, value: "0 (0%)" }, { displayName: 'col4', value: '$100' }]);
                expect(actualData.dataPoints[2].data.tooltipInfo).toEqual([{ displayName: "col1", value: "b" }, { displayName: 'col4', value: '($200)' }]);
                expect(actualData.dataPoints[3].data.tooltipInfo).toEqual([{ displayName: "col1", value: "b" }, { displayName: "col3", value: "300 (35.29%)" }, { displayName: highlightName, value: "75 (8.82%)" }, { displayName: 'col4', value: '($200)' }]);
                expect(actualData.dataPoints[4].data.tooltipInfo).toEqual([{ displayName: "col1", value: "c" }, { displayName: "col2", value: "$0 (0%)" }, { displayName: highlightName, value: "$0 (0%)" }, { displayName: 'col4', value: '$50' }]);
                expect(actualData.dataPoints[5].data.tooltipInfo).toEqual([{ displayName: "col1", value: "c" }, { displayName: "col3", value: "50 (5.88%)" }, { displayName: highlightName, value: "50 (5.88%)" }, { displayName: 'col4', value: '$50' }]);
            });

            //validate tooltip that tooltip info doesn't change if data and category labels are on and off 
            it('on/off data lables - tooltip validation', () => {

                let dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure2Tooltip.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2MeasureWithFormat1Tooltip.columns[1],
                                values: [200, 100, 150],
                            }, {
                                source: dataViewMetadata1Category2MeasureWithFormat1Tooltip.columns[2],
                                values: [300, 300, 50],
                            }]),
                    },
                    metadata: null,
                };

                let tooltipInfo1 = [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "$200 (18.18%)" }];
                let tooltipInfo2 = [{ displayName: "col1", value: "a" }, { displayName: "col3", value: "300 (27.27%)" }];
                let tooltipInfo3 = [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "$100 (9.09%)" }];
                let tooltipInfo4 = [{ displayName: "col1", value: "b" }, { displayName: "col3", value: "300 (27.27%)" }];
                let tooltipInfo5 = [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "$150 (13.64%)" }];
                let tooltipInfo6 = [{ displayName: "col1", value: "c" }, { displayName: "col3", value: "50 (4.55%)" }];
                let actualData = DonutChart.converter(dataView, donutColors);
                expect(actualData.dataPoints[0].data.tooltipInfo).toEqual(tooltipInfo1);
                expect(actualData.dataPoints[1].data.tooltipInfo).toEqual(tooltipInfo2);
                expect(actualData.dataPoints[2].data.tooltipInfo).toEqual(tooltipInfo3);
                expect(actualData.dataPoints[3].data.tooltipInfo).toEqual(tooltipInfo4);
                expect(actualData.dataPoints[4].data.tooltipInfo).toEqual(tooltipInfo5);
                expect(actualData.dataPoints[5].data.tooltipInfo).toEqual(tooltipInfo6);

                //data labels are on
                dataViewMetadata1Category2Measure2Tooltip.objects = {
                    labels: { show: true, labelStyle: LabelStyle.data },
                };
                actualData = DonutChart.converter(dataView, donutColors);
                expect(actualData.dataPoints[0].data.tooltipInfo).toEqual(tooltipInfo1);
                expect(actualData.dataPoints[1].data.tooltipInfo).toEqual(tooltipInfo2);
                expect(actualData.dataPoints[2].data.tooltipInfo).toEqual(tooltipInfo3);

                //data labels and category labels are on
                dataViewMetadata1Category2Measure2Tooltip.objects = {
                    labels: { show: true, labelStyle: LabelStyle.both },
                };
                actualData = DonutChart.converter(dataView, donutColors);
                expect(actualData.dataPoints[0].data.tooltipInfo).toEqual(tooltipInfo1);
                expect(actualData.dataPoints[1].data.tooltipInfo).toEqual(tooltipInfo2);
                expect(actualData.dataPoints[2].data.tooltipInfo).toEqual(tooltipInfo3);

                //data labels off and category labels are on
                dataViewMetadata1Category2Measure2Tooltip.objects = {
                    labels: { show: true, labelStyle: LabelStyle.category },
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
                            source: dataViewMetadata1Category2Measure2Tooltip.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2MeasureWithFormat1Tooltip.columns[1],
                                values: [200, null, 150],
                                highlights: [100, null, 250 /* NOTE: this highlight value > the corresponding non-highlight value */],
                            }, {
                                source: dataViewMetadata1Category2MeasureWithFormat1Tooltip.columns[2],
                                values: [300, 300, 50],
                                highlights: [150, 75, 50],
                            }]),
                    },
                    metadata: null,
                };

                let actualData = DonutChart.converter(dataView, donutColors);
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(<powerbi.data.SQExpr[]>dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let categoryQueryName = dataView.categorical.categories[0].source.queryName;
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[0]), 'col2'),
                        measure: 100,
                        originalMeasure: 100,
                        measureFormat: "\$#,0;(\$#,0);\$#,0",
                        label: 'col2',
                        value: 0.16,
                        highlightRatio: 1.0,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "$100 (16%)" }],
                        color: sliceColors[0],
                        labelFormatString: undefined,
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[0]), 'col3'),
                        measure: 150,
                        originalMeasure: 150,
                        measureFormat: undefined,
                        label: 'col3',
                        value: 0.24,
                        highlightRatio: 1.0,
                        index: 1,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col3", value: "150 (24%)" }],
                        color: sliceColors[0],
                        labelFormatString: undefined,
                        strokeWidth: 1,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), 'col2'),
                        label: 'col2',
                        measure: 0,
                        originalMeasure: null,
                        measureFormat: "\$#,0;(\$#,0);\$#,0",
                        value: 0.0,
                        highlightRatio: 1.0,
                        index: 2,
                        tooltipInfo: [{ displayName: "col1", value: "b" }],
                        color: sliceColors[1],
                        labelFormatString: undefined,
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), 'col3'),
                        label: 'col3',
                        measure: 75,
                        originalMeasure: 75,
                        measureFormat: undefined,
                        value: 0.12,
                        highlightRatio: 1.0,
                        index: 3,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col3", value: "75 (12%)" }],
                        color: sliceColors[1],
                        labelFormatString: undefined,
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), 'col2'),
                        measure: 250,
                        originalMeasure: 250,
                        measureFormat: "\$#,0;(\$#,0);\$#,0",
                        label: 'col2',
                        value: 0.4,
                        highlightRatio: 1.0,
                        index: 4,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "$250 (40%)" }],
                        color: sliceColors[2],
                        labelFormatString: undefined,
                        strokeWidth: 0,
                    }, {
                        identity: SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), 'col3'),
                        measure: 50,
                        originalMeasure: 50,
                        measureFormat: undefined,
                        label: 'col3',
                        value: 0.08,
                        highlightRatio: 1.0,
                        index: 5,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col3", value: "50 (8%)" }],
                        color: sliceColors[2],
                        labelFormatString: undefined,
                        strokeWidth: 1,
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
                let selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithIdAndMeasureAndCategory(categoryId, dataViewMetadata.columns[1].queryName, dataViewMetadata.columns[0].queryName));
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(<powerbi.data.SQExpr[]>dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        measure: 100,
                        originalMeasure: 100,
                        value: 0.25,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "100 (25%)" }],
                        color: sliceColors[0],
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[2],
                        measure: 300,
                        originalMeasure: 300,
                        value: 0.75,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "300 (75%)" }],
                        color: sliceColors[2],
                        strokeWidth: 0,
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
                let selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithIdAndMeasureAndCategory(categoryId, dataViewMetadata.columns[1].queryName, dataViewMetadata.columns[0].queryName));
                let categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(<powerbi.data.SQExpr[]>dataView.categorical.categories[0].identityFields);
                let sliceColors = [
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('a').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('b').value,
                    donutColors.getColorScaleByKey(categoryColumnId).getColor('c').value,
                ];
                let expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        measure: 100,
                        originalMeasure: 100,
                        value: 0.25,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "100 (25%)" }],
                        color: sliceColors[0],
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[1],
                        measure: 0,
                        originalMeasure: 0,
                        value: 0.0,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0 (0%)" }],
                        color: sliceColors[1],
                        strokeWidth: 0,
                    }, {
                        identity: selectionIds[2],
                        measure: 300,
                        originalMeasure: 300,
                        value: 0.75,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "300 (75%)" }],
                        color: sliceColors[2],
                        strokeWidth: 0,
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
                    { displayName: 'a', queryName: 'a', isMeasure: true, roles: { Y: true } },
                    { displayName: 'b', queryName: 'b', isMeasure: true, roles: { Y: true } },
                    { displayName: 'c', queryName: 'c', isMeasure: true, roles: { Y: true } }
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

            expect(actualData.dataPoints[0].data.tooltipInfo).toEqual([{ displayName: 'a', value: '1 (16.67%)' }]);
            expect(actualData.dataPoints[1].data.tooltipInfo).toEqual([{ displayName: 'b', value: '2 (33.33%)' }]);
            expect(actualData.dataPoints[2].data.tooltipInfo).toEqual([{ displayName: 'c', value: '3 (50%)' }]);
        });

        it('validate tooltip info not being created when tooltips are disabled', () => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'a', queryName: 'a', isMeasure: true, roles: { Y: true } },
                    { displayName: 'b', queryName: 'b', isMeasure: true, roles: { Y: true } },
                    { displayName: 'c', queryName: 'c', isMeasure: true, roles: { Y: true } }
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

            let actualData = DonutChart.converter(dataView, donutColors, /*defaultDataPointColor*/undefined, /*viewport*/undefined, /*disableGeometricCulling*/undefined, /*interactivityService*/undefined, /*tooltipsEnabled*/false);

            expect(actualData.dataPoints[0].data.tooltipInfo).toBeUndefined();
            expect(actualData.dataPoints[1].data.tooltipInfo).toBeUndefined();
            expect(actualData.dataPoints[2].data.tooltipInfo).toBeUndefined();
        });

        it('validate tooltip info not being created when tooltips are disabled and tooltipBuckets are enabled', () => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'a', queryName: 'a', isMeasure: true, roles: { Y: true } },
                    { displayName: 'b', queryName: 'b', isMeasure: true, roles: { Y: true } },
                    { displayName: 'c', queryName: 'c', isMeasure: true, roles: { Y: true } },
                    { displayName: 'd', queryName: 'd', isMeasure: true, roles: { Tooltips: true } },
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
                        },
                        {
                            source: dataViewMetadata.columns[3],
                            values: [4],
                        }
                    ])
                }
            };
             
            let actualData = DonutChart.converter(dataView, donutColors, /*defaultDataPointColor*/undefined, /*viewport*/undefined, /*disableGeometricCulling*/undefined, /*interactivityService*/undefined, /*tooltipsEnabled*/false, /*tooltipBucketEnabled*/true);

            expect(actualData.dataPoints[0].data.tooltipInfo).toBeUndefined();
            expect(actualData.dataPoints[1].data.tooltipInfo).toBeUndefined();
            expect(actualData.dataPoints[2].data.tooltipInfo).toBeUndefined();
        });

        function buildDataPoint(data: { identity: SelectionId; measure: number; originalMeasure: number; highlightRatio?: number; highlightValue?: number; originalHighlightValue?:number; measureFormat?: string; value: number; index: any; label: string; tooltipInfo?: powerbi.visuals.TooltipDataItem[]; highlightedTooltipInfo?: powerbi.visuals.TooltipDataItem[]; color?: string; strokeWidth: number; labelFormatString?: string; }): DonutDataPoint {
            return <DonutDataPoint>{
                identity: data.identity,
                measure: data.measure,
                originalMeasure: data.originalMeasure,
                measureFormat: data.measureFormat,
                percentage: data.value,
                index: data.index,
                label: data.label,
                selected: false,
                highlightRatio: data.highlightRatio,
                highlightValue: data.highlightValue,
                originalHighlightValue: data.originalHighlightValue,
                tooltipInfo: data.tooltipInfo,
                color: data.color,
                strokeWidth: data.strokeWidth,
                labelFormatString: data.labelFormatString
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
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                    roles: { Category: true }
                }, {
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true }
                }
            ],
        };

        if (hasLegendObject) {
            dataViewMetadataTwoColumn.objects = { legend: { show: true } };
        }
        else {
            dataViewMetadataTwoColumn.objects = {
                labels: {
                    show: true, labelStyle: LabelStyle.category
                }
            };
        }

        let dataViewMetadata1Category2Measure2Tooltip: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'col1', queryName: 'col1', roles: { Category: true } },
                { displayName: 'col2', queryName: 'col2', isMeasure: true, roles: { Y: true } },
                { displayName: 'col3', queryName: 'col3', isMeasure: true, roles: { Y: true } }]
        };
        if (hasLegendObject) {
            dataViewMetadata1Category2Measure2Tooltip.objects = { legend: { show: true } };
        }
        else {
            dataViewMetadata1Category2Measure2Tooltip.objects = undefined;
        }

        let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });

        beforeEach(() => {
            hostServices = mocks.createVisualHostServices();
            element = powerbitests.helpers.testDom('500', '500');
            if (interactiveChart)
                v = new powerbi.visuals.DonutChart({
                    sliceWidthRatio: 0,
                    disableGeometricCulling: true,
                    smallViewPortProperties: {
                        maxHeightToScaleDonutLegend: maxHeightToScaleDonutLegend
                    }
                });
            else {
                v = new DonutChart({
                    sliceWidthRatio: 0,
                    animator: new powerbi.visuals.WebDonutChartAnimator(),
                    isScrollable: true,
                    tooltipsEnabled: true,
                    behavior: new powerbi.visuals.DonutChartWebBehavior(),
                });
            }
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
                    metadata: dataViewMetadata1Category2Measure2Tooltip,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure2Tooltip.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[1],
                                values: [200, 100, 150]
                            }, {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[2],
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
                    expect($(labelsElement).length).toBe(3);
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
                    expect($(labelsElement).length).toBe(3);
                }
                done();
            }, DefaultWaitForRender);
        });

        it('pie chart dom validation with very long labels', (done) => {
            //make sure category labels on
            let dataViewMetadataTwoColumnLabels = powerbi.Prototype.inherit(dataViewMetadataTwoColumn);
            dataViewMetadataTwoColumnLabels.objects = { labels: { show: true, labelStyle: LabelStyle.category } };

            v.onResizing({ height: 600, width: 400 });
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
                }

                done();
            }, DefaultWaitForRender);
        });

        it('pie chart opacity validation with overlapping slices', (done) => {
            dataViewMetadataTwoColumn.objects = {
                labels: { show: true, labelStyle: LabelStyle.category },
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
                    expect($('.donutChart .line-label').filter(function () {
                        return $(this).css('opacity') === '0.5';
                    }).length).toBe(3);
                    expect($(labelsElement).length).toBe(3);
                }
                
                // lines are not present on interactive legend mode, and currently if regular legend is on we hide labels
                if (interactiveChart) {
                    expect($('.donutChart .donutChart polyline').filter(function () {
                        return $(this).css('opacity') === '0.5';
                    }).length).toBe(0);
                    expect($(labelsElement).length).toBe(0);
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
            sliceToClick.d3Click(0, 0);

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
                clearCatcher.d3Click(0, 0);

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
            slices.eq(sliceToClick).d3Click(0, 0);

            expect(onSelectSpy).toHaveBeenCalled();
            expect(onSelectSpy.calls.argsFor(0)[0].visualObjects[0]).toEqual({
                    objectName: 'dataPoint',
                    selectorsByColumn:
                    {
                        dataMap: { 'col1': identities[sliceToClick] },
                        metadata: dataViewMetadataTwoColumn.columns[1].queryName
                    }
            });
        });

        it('pie chart: context menu for slice', () => {
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

            let onContextMenuSpy = spyOn(hostServices, 'onContextMenu');

            let slices = $('.donutChart .slice');
            let sliceToClick = 1;
            slices.eq(sliceToClick).d3ContextMenu(5, 15);

            expect(onContextMenuSpy).toHaveBeenCalled();
            expect(onContextMenuSpy.calls.argsFor(0)[0].data[0]).toEqual({
                dataMap: {
                    col1: identities[sliceToClick]
                },
                metadata: dataViewMetadataTwoColumn.columns[1].queryName
            });
            expect(onContextMenuSpy.calls.argsFor(0)[0].position).toEqual({ x: 5, y: 15 });
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
            sliceToClick.d3Click(0, 0);

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
            slices.eq(sliceToClick).d3Click(0, 0);

            expect(onSelectSpy).toHaveBeenCalled();
            expect(onSelectSpy.calls.argsFor(0)[0].visualObjects[0]).toEqual({
                objectName: 'dataPoint',
                selectorsByColumn:
                {
                    dataMap: { 'col1': identities[sliceToClick] },
                    metadata: dataViewMetadataTwoColumn.columns[1].queryName
                }
            });
        });

        it('pie chart: context menu for highlighted slice', () => {
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

            let onContextMenuSpy = spyOn(hostServices, 'onContextMenu');

            let slices = $('.donutChart .slice-highlight');
            let sliceToClick = 1;
            slices.eq(sliceToClick).d3ContextMenu(5, 15);

            expect(onContextMenuSpy).toHaveBeenCalled();
            expect(onContextMenuSpy.calls.argsFor(0)[0].data[0]).toEqual({
                dataMap: { col1: identities[sliceToClick] },
                metadata: dataViewMetadataTwoColumn.columns[1].queryName
            });
            expect(onContextMenuSpy.calls.argsFor(0)[0].position).toEqual({ x: 5, y: 15 });
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
            slicesToClick.eq(0).d3Click(0, 0);
            slicesToClick.eq(1).d3Click(0, 0, powerbitests.helpers.ClickEventType.CtrlKey);

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
                        expect($(labelsElement).length).toBe(3);
                    }
                }

                // Click the background
                let clearCatcher = $('.clearCatcher');
                clearCatcher.d3Click(0, 0);

                setTimeout(() => {
                    slices.each(function () {
                        expect(parseFloat($(this).css('fill-opacity'))).toBe(1);
                    });
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('pie chart stroke validation', (done) => {
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
                            values: [100, 50, 20],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                let slices = $('.donutChart .slice');
                for (let i = 0; i < slices.length; i++) {
                    expect(slices[i].style.strokeWidth).toBe("0px");
                }
                done();
            }, DefaultWaitForRender);
        });

        it('pie chart stroke validation - categorical multi-measure', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata1Category2Measure2Tooltip,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure2Tooltip.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[1],
                                values: [200, 100, 150]
                            }, {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[2],
                                values: [300, 200, 50]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                let slices = $('.donutChart .slice');
                expect(slices.length).toBe(6);
                for (let i = 0; i < slices.length; i++) {
                    if (i % 2 === 0)
                        expect(slices[i].style.strokeWidth).toBe("0px");
                    else
                        expect(slices[i].style.strokeWidth).toBe("1px");
                }

                done();
            }, DefaultWaitForRender);
        });

        it('pie chart stroke validation - categorical multi-measure with small values', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata1Category2Measure2Tooltip,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure2Tooltip.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[1],
                                values: [1, 1000, 1500]
                            }, {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[2],
                                values: [1000, 1, 50]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                let slices = $('.donutChart .slice');
                if (!interactiveChart) {
                    //The slices with very small values are not drawn
                    expect(slices.length).toBe(4);
                    for (let i = 0; i < slices.length - 1; i++) {
                        expect(slices[i].style.strokeWidth).toBe("0px");
                    }
                    //only last slice get stroke width 1 
                    expect(slices[slices.length - 1].style.strokeWidth).toBe("1px");
                }
                else {
                    expect(slices.length).toBe(6);
                    for (let i = 0; i < slices.length; i++) {
                        if (i % 2 === 0)
                            expect(slices[i].style.strokeWidth).toBe("0px");
                        else
                            expect(slices[i].style.strokeWidth).toBe("1px");
                    }
                }
                done();
            }, DefaultWaitForRender);
        });

        it('pie chart stroke validation - with highlight', (done) => {
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
                            values: [100, 50, 20],
                            highlights: [50, 20, 5],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                let slices = $('.donutChart .slice');
                let highlightSlices = $('.donutChart .slice-highlight');
                for (let i = 0; i < slices.length; i++) {
                    expect(slices[i].style.strokeWidth).toBe("0px");
                    expect(highlightSlices[i].style.strokeWidth).toBe("0px");
                }
                done();
            }, DefaultWaitForRender);
        });

        it('pie chart stroke validation - categorical multi-measure with highlight', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata1Category2Measure2Tooltip,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure2Tooltip.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[1],
                                values: [200, 100, 150],
                                highlights: [100, 60, 130],
                            }, {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[2],
                                values: [300, 200, 50],
                                highlights: [50, 20, 5],
                            }])
                    }
                }]
            });

            setTimeout(() => {
                let slices = $('.donutChart .slice');
                let highlightSlices = $('.donutChart .slice-highlight');
                expect(slices.length).toBe(6);
                expect(highlightSlices.length).toBe(6);
                for (let i = 0; i < slices.length; i++) {
                    if (i % 2 === 0) {
                        expect(slices[i].style.strokeWidth).toBe("0px");
                        expect(highlightSlices[i].style.strokeWidth).toBe("0px");
                    }
                    else {
                        expect(slices[i].style.strokeWidth).toBe("1px");
                        expect(highlightSlices[i].style.strokeWidth).toBe("1px");
                    }
                }

                done();
            }, DefaultWaitForRender);
        });

        it('pie chart labels visibility - moving guide line up or down by 25% of the slice perimeter where labels are truncated ', (done) => {
            //category labels on
            let dataViewMetadataTwoColumnLabels = powerbi.Prototype.inherit(dataViewMetadataTwoColumn);
            dataViewMetadataTwoColumnLabels.objects = { labels: { show: true, labelStyle: LabelStyle.data } };
            v.onResizing({ height: 600, width: 600 });
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
                let labelsBefore = element.find(labelsElement);
                let labelsBeforeY1 = $(labelsBefore[0]).attr('y');
                let labelsBeforeY2 = $(labelsBefore[1]).attr('y');
                let labelsBeforeY3 = $(labelsBefore[2]).attr('y');
                
                //add data labels 
                dataViewMetadataTwoColumnLabels.objects = { labels: { show: true, labelStyle: LabelStyle.both } };
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
                if (!interactiveChart) {
                    let labelsAfter = element.find(labelsElement);
                    let labelsAfterY1 = $(labelsAfter[0]).attr('y');
                    let labelsAfterY2 = $(labelsAfter[1]).attr('y');
                    let labelsAfterY3 = $(labelsAfter[2]).attr('y');

                    //labels move up or down by 25% of the slice perimeter, that whole label will be fit.
                    expect(+labelsBeforeY1).toBeGreaterThan(+labelsAfterY1);
                    expect(+labelsBeforeY2).toBeLessThan(+labelsAfterY2);
                    expect(+labelsBeforeY3).toBeGreaterThan(+labelsAfterY3);
                }
                else
                    expect($(labelsBefore).length).toBe(0);

                done();
            }, DefaultWaitForRender);
        });

        it('pie chart labels visibility - moving guide line up or down by 25% of the slice perimeter where labels have conflict', (done) => {
           
            //category labels on
            let dataViewMetadataTwoColumnLabels = powerbi.Prototype.inherit(dataViewMetadataTwoColumn);
            dataViewMetadataTwoColumnLabels.objects = { labels: { show: true, labelStyle: LabelStyle.data } };
            v.onResizing({ height: 600, width: 600 });
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumnLabels,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumnLabels.columns[0],
                            values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumnLabels.columns[1],
                            values: [3, 14, 400],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                let labels = element.find(labelsElement);
                if (!interactiveChart)
                    expect($(labels).length).toBe(3);
                else
                    expect($(labels).length).toBe(0);

                done();
            }, DefaultWaitForRender);
        });

        it('pie chart labels visibility - moving guide line up or down by 25% of the slice perimeter where lines have conflict', (done) => {
            
            //category labels on
            let dataViewMetadataTwoColumnLabels = powerbi.Prototype.inherit(dataViewMetadataTwoColumn);
            dataViewMetadataTwoColumnLabels.objects = { categoryLabels: { show: false }, labels: { show: true } };
            v.onResizing({ height: 600, width: 600 });
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumnLabels,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumnLabels.columns[0],
                            values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumnLabels.columns[1],
                            values: [300, 5, 5],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                let labels = element.find(labelsElement);
                if (!interactiveChart) {
                    //Third label has a conflict with diagonal line of second label
                    expect($(labels).length).toBe(2);
                }
                else
                    expect($(labels).length).toBe(0);

                done();
            }, DefaultWaitForRender);
        });

        it('pie chart labels visibility - validate that labels are not cut off', (done) => {
            
            //category labels on
            let dataViewMetadataTwoColumnLabels = powerbi.Prototype.inherit(dataViewMetadataTwoColumn);
            dataViewMetadataTwoColumnLabels.objects = { labels: { show: true, labelStyle: LabelStyle.category } };
            v.onResizing({ height: 600, width: 600 });
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumnLabels,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumnLabels.columns[0],
                            values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumnLabels.columns[1],
                            values: [300, 140, 400],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                let labelsBefore = element.find(labelsElement);
                let labelsBeforeY3 = $(labelsBefore[2]).attr('y');

                v.onResizing({ height: 600, width: 350 });

                if (!interactiveChart) {
                    let labelsAfter = element.find(labelsElement);
                    let labelsAfterY3 = $(labelsAfter[2]).attr('y');

                    //'Jean Tablau' moved up 
                    expect(+labelsBeforeY3).toBeGreaterThan(+labelsAfterY3);
                }
                else
                    expect($(labelsBefore).length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });

        it('pie chart labels visibility - validate font-family', (done) => {
            
            //category labels on
            let dataViewMetadataTwoColumnLabels = powerbi.Prototype.inherit(dataViewMetadataTwoColumn);
            dataViewMetadataTwoColumnLabels.objects = { labels: { show: true, labelStyle: LabelStyle.category } };
            v.onResizing({ height: 600, width: 600 });
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumnLabels,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumnLabels.columns[0],
                            values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumnLabels.columns[1],
                            values: [300, 140, 400],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                let labels = element.find(labelsElement);
                if (!interactiveChart) {
                    let labelsFontFamily = $(labels).css('font-family');
                    let fonts = labelsFontFamily.split(',');
                    expect(fonts[0]).toEqual(fontFamily);
                } else
                    expect($(labels).length).toBe(0);
                done();
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

                    icons.first().d3Click(0, 0);
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
                                    expect(helpers.findElementText($('.legendTitle'))).toBe(testTitle);
                                    expect(helpers.findElementTitle($('.legendTitle'))).toBe(testTitle);
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

        if (interactiveChart) {
            it('pie chart arrow scale normal size', (done) => {
                const regexScaleIsNormal = /scale\(\s*1(\.0+)?\s*\)/i;

                let viewportHeight = maxHeightToScaleDonutLegend + DonutChart.InteractiveLegendContainerHeight * 2;

                v.onResizing({ height: viewportHeight, width: 400 });
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
                    let arrowG = $('.donutLegendArrow').parent();
                    expect(arrowG).toBeInDOM();
                    expect(arrowG.attr('transform')).toMatch(regexScaleIsNormal);
                    done();
                }, DefaultWaitForRender);
            });

            it('pie chart arrow scale small size', (done) => {
                const regexScaleIsLessThanOne = /scale\(\s*0\.\d+\s*\)/i;

                let viewportHeight = maxHeightToScaleDonutLegend - 10 + DonutChart.InteractiveLegendContainerHeight * 2;
                v.onResizing({ height: viewportHeight, width: 400 });
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
                    let arrowG = $('.donutLegendArrow').parent();
                    expect(arrowG).toBeInDOM();
                    expect(arrowG.attr('transform')).toMatch(regexScaleIsLessThanOne);
                    done();
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
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                    roles: { Category: true }
                }, {
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true }
                }
            ],
        };

        let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = new powerbi.visuals.DonutChart({ tooltipsEnabled: true });
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
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                    roles: { Category: true }
                }, {
                    displayName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true }
                }
            ],
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.plugins.pieChart.create();
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
            dataViewMetadataTwoColumnLabels.objects = { labels: { show: true, labelStyle: LabelStyle.category }, legend: { show: true, position: 'Top' } };
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
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                    roles: { Category: true }
                }, {
                    displayName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true }
                }
            ],
        };
        let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.plugins.donutChart.create();

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
                labels: { show: true, labelStyle: LabelStyle.category },
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
            expect(points.instances.length).toBe(3);
            expect(points.instances[0].displayName).toEqual('a');
            expect(points.instances[0].properties['fill']).toBeDefined();
            expect(points.instances[1].displayName).toEqual('b');
            expect(points.instances[1].properties['fill']).toBeDefined();
            expect(points.instances[2].displayName).toEqual('c');
            expect(points.instances[2].properties['fill']).toBeDefined();
            done();
        });

        it('Check enumeration for category and series', (done) => {
            let dataViewMetadata1Category2Measure2Tooltip: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1', roles: { Category: true } },
                    { displayName: 'col2', isMeasure: true, roles: { Y: true } },
                    { displayName: 'col3', isMeasure: true, roles: { Y: true } }]
            };

            let categoryIdentities = [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')];
            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure2Tooltip.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata1Category2Measure2Tooltip.columns[1],
                            values: [-200, null, 150],
                            identity: mocks.dataViewScopeIdentity('foo'),
                        }, {
                                source: dataViewMetadata1Category2Measure2Tooltip.columns[2],
                                values: [-300, 300, -50],
                                identity: mocks.dataViewScopeIdentity('bar'),
                            }])
                    }
                }]
            };

            v.onDataChanged(dataChangedOptions);

            let points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'dataPoint' });
            expect(points.instances.length).toBe(3);
            expect(points.instances[0].displayName).toEqual('a');
            expect(points.instances[0].properties['fill']).toBeDefined();
            expect(points.instances[1].displayName).toEqual('b');
            expect(points.instances[1].properties['fill']).toBeDefined();
            expect(points.instances[2].displayName).toEqual('c');
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
                expect(points.instances.length).toBe(3);
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
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                    roles: { Category: true }
                }, {
                    displayName: 'col2',
                    isMeasure: true,
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    roles: { Y: true }
                }
            ],
        };
        let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });

        beforeEach(() => {

            element = powerbitests.helpers.testDom('500', '500');
            v = new DonutChart({
                sliceWidthRatio: 0,
                animator: new powerbi.visuals.WebDonutChartAnimator(),
                isScrollable: true,
                tooltipsEnabled: true,
                behavior: new powerbi.visuals.DonutChartWebBehavior(),
            });
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
