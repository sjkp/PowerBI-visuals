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
    import CartesianChart = powerbi.visuals.CartesianChart;
    import CartesianAxes = powerbi.visuals.CartesianAxes;
    import SvgCartesianAxes = powerbi.visuals.SvgCartesianAxes;
    import CartesianAxesLayout = powerbi.visuals.CartesianAxesLayout;
    import ScalarKeys = powerbi.visuals.ScalarKeys;
    import DataView = powerbi.DataView;
    import DataViewTransform = powerbi.data.DataViewTransform;
    import mocks = powerbitests.mocks;
    import PrimitiveType = powerbi.PrimitiveType;
    import ValueType = powerbi.ValueType;
    import visuals = powerbi.visuals;
    import AxisPropertiesBuilder = powerbitests.helpers.AxisPropertiesBuilder;

    powerbitests.mocks.setLocale();

    describe('CartesianChart', () => {
        let defaultChartType = visuals.plugins.columnChart.name;

        it('setData called on all layers when data changed', () => {
            let visual = new CartesianChartBuilder().build(visuals.plugins.lineStackedColumnComboChart.name);

            let dataViews = buildComboDataViews();
            // First onDataChanged initializes layers
            visual.onDataChanged({ dataViews: dataViews });

            let layers = getCartesianLayers(visual);
            expect(layers.length).toBe(2);

            let setDataSpy1 = spyOn(layers[0], 'setData');
            let setDataSpy2 = spyOn(layers[1], 'setData');

            visual.onDataChanged({ dataViews: dataViews });

            expect(setDataSpy1).toHaveBeenCalled();
            expect(setDataSpy2).toHaveBeenCalled();
        });

        it('viewport change does not trigger conversion', () => {
            let visual = new CartesianChartBuilder().build(defaultChartType);
            let dataView: DataView = buildSimpleDataView();
            
            visual.onDataChanged({ dataViews: [dataView] });

            let layers = getCartesianLayers(visual);
            let setDataSpy = spyOn(layers[0], 'setData');

            visual.onResizing({
                width: 200,
                height: 200,
            });

            expect(setDataSpy).not.toHaveBeenCalled();
        });

        describe('detectScalarMapping', () => {
            it('invalid data mapping', () => {
                expect(CartesianChart.detectScalarMapping(null)).toBe(false);

                expect(CartesianChart.detectScalarMapping({
                    metadata: {}
                })).toBe(false);

                expect(CartesianChart.detectScalarMapping({
                    metadata: {},
                    categorical: {}
                })).toBe(false);

                expect(CartesianChart.detectScalarMapping({
                    metadata: {},
                    categorical: {
                        categories: {
                            for: {
                                in: {
                                    role: 'Category',
                                    items: [],
                                }
                            }
                        }
                    }
                })).toBe(false);
            });

            it('ordinal value type', () => {
                expect(CartesianChart.detectScalarMapping({
                    metadata: {},
                    categorical: {
                        categories: {
                            for: {
                                in: {
                                    role: 'Category',
                                    items: [{
                                        type: ValueType.fromDescriptor({ text: true }),
                                        queryName: 'select1',
                                    }],
                                }
                            }
                        }
                    }
                })).toBe(false);
            });

            it('scalar value type', () => {
                expect(CartesianChart.detectScalarMapping({
                    metadata: {},
                    categorical: {
                        categories: {
                            for: {
                                in: {
                                    role: 'Category',
                                    items: [{
                                        type: ValueType.fromDescriptor({ numeric: true }),
                                        queryName: 'select1',
                                    }],
                                }
                            }
                        }
                    }
                })).toBe(true);
            });

            it('explicit scalar axisType', () => {
                expect(CartesianChart.detectScalarMapping({
                    metadata: {
                        objects: {
                            ['categoryAxis']: {
                                axisType: visuals.axisType.scalar
                            }
                        }
                    },
                    categorical: {
                        categories: {
                            for: {
                                in: {
                                    role: 'Category',
                                    items: [{
                                        type: ValueType.fromDescriptor({ text: true }),
                                        queryName: 'select1',
                                    }],
                                }
                            }
                        }
                    }
                })).toBe(false);
            });

            it('explicit categorical axisType overrides value type', () => {
                expect(CartesianChart.detectScalarMapping({
                    metadata: {
                        objects: {
                            ['categoryAxis']: {
                                axisType: visuals.axisType.categorical
                            }
                        }
                    },
                    categorical: {
                        categories: {
                            for: {
                                in: {
                                    role: 'Category',
                                    items: [{
                                        type: ValueType.fromDescriptor({ numeric: true }),
                                        queryName: 'select1',
                                    }],
                                }
                            }
                        }
                    }
                })).toBe(false);
            });
        });

        describe('getIsScalar with category types and scalar keys', () => {
            it('getIsScalar with scalar category', () => {
                let dataViewScalar = buildSimpleDataView(true);
                let dvCategories = dataViewScalar.categorical.categories;
                let categoryType = <ValueType>dvCategories[0].source.type;
                expect(CartesianChart.getIsScalar(dataViewScalar.metadata.objects, visuals.lineChartProps.categoryAxis.axisType, categoryType)).toBe(true);
            });

            it('getIsScalar with text category', () => {
                let dataViewScalar = buildSimpleDataView(false);
                let dvCategories = dataViewScalar.categorical.categories;
                let categoryType = <ValueType>dvCategories[0].source.type;
                expect(CartesianChart.getIsScalar(dataViewScalar.metadata.objects, visuals.lineChartProps.categoryAxis.axisType, categoryType)).toBe(false);
            });

            it('getIsScalar with scalar category and scalar keys', () => {
                let dataViewScalar = buildSimpleDataView(true);
                let dvCategories = dataViewScalar.categorical.categories;
                let categoryType = <ValueType>dvCategories[0].source.type;
                let dates = [{ min: new Date(2014, 4, 2) }, { min: new Date(2015, 2, 4) }];
                let scalarKeys: ScalarKeys = {
                    values: dates
                };
                expect(CartesianChart.getIsScalar(dataViewScalar.metadata.objects, visuals.lineChartProps.categoryAxis.axisType, categoryType, scalarKeys)).toBe(true);
            });

            it('getIsScalar with text category and scalar keys', () => {
                let dataViewScalar = buildSimpleDataView(false);
                let dvCategories = dataViewScalar.categorical.categories;
                let categoryType = <ValueType>dvCategories[0].source.type;
                let dates = [{ min: new Date(2014, 4, 2) }, { min: new Date(2015, 2, 4) }];
                let scalarKeys: ScalarKeys = {
                    values: dates
                };
                expect(CartesianChart.getIsScalar(dataViewScalar.metadata.objects, visuals.lineChartProps.categoryAxis.axisType, categoryType, scalarKeys)).toBe(true);
            });

        });

        it('getAdditionalTelemetry', () => {
            let dataView = buildSimpleDataView(true);
            dataView.metadata.objects = {
                categoryAxis: {
                    axisType: powerbi.visuals.axisType.scalar
                }
            };

            let telemetry = CartesianChart.getAdditionalTelemetry(dataView);
            expect(telemetry).toEqual({ axisType: 'scalar' });
        });
    });

    describe('SvgCartesianAxes', () => {
        
        // TODO: test negotiateAxes

        it('renderAxes - scalar does not rotate', () => {
            let metaDataColumnLotsOfPrecision: powerbi.DataViewMetadataColumn = {
                displayName: 'PageHits',
                type: ValueType.fromDescriptor({ numeric: true }),
                objects: { general: { formatString: '0.00000' } },
            };

            let viewport = { height: 210, width: 210 };
            let defaultMargin = { left: 1, right: 1, top: 8, bottom: 25 };
            let plotArea = {
                width: viewport.width - (defaultMargin.left + defaultMargin.right),
                height: viewport.height - (defaultMargin.top + defaultMargin.bottom),
            };

            let svgAxes = new CartesianChartBuilder(viewport.width, viewport.height).buildAxes();
            
            let axesLayout: CartesianAxesLayout = {
                axes: {
                    x: AxisPropertiesBuilder.buildAxisProperties([1000, 9000], metaDataColumnLotsOfPrecision),
                    y1: AxisPropertiesBuilder.buildAxisProperties([0, 10]),
                },
                axisLabels: { x: null, y: null },
                margin: defaultMargin,
                marginLimits: { left: 60, right: 60, top: 0, bottom: 60 },
                viewport: viewport,
                plotArea: plotArea,
                preferredPlotArea: plotArea,
                tickLabelMargins: { bottom: 20, left: 40, right: 0 },
                tickPadding: SvgCartesianAxes.AxisPadding,
            };

            svgAxes.renderAxes(axesLayout, 0);

            let ticksText: JQuery = $('.x.axis .tick').find('text');
            expect(ticksText.attr('transform')).toBe('rotate(0)');
        });
    });

    function buildSimpleDataView(scalar: boolean = false): DataView {
        let categories: any[];
        let categoryColumn: powerbi.DataViewMetadataColumn;
        if (scalar) {
            categories = [100, 200];
            categoryColumn = sampleData.scalarCategoryColumn;
        }
        else {
            categories = ['abc', 'def'];
            categoryColumn = sampleData.categoryColumn;
        }

        let categoryIdentities = _.map(categories, (c) => mocks.dataViewScopeIdentity(c));
        let values = [1, 2];

        return <DataView> {
            metadata: {
                columns: [categoryColumn, sampleData.valueColumn]
            },
            categorical: {
                categories: [{
                    source: categoryColumn,
                    values: categories,
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([
                    {
                        source: sampleData.y1Column,
                        values: values,
                    }
                ])
            }
        };
    }

    function buildComboDataViews(): DataView[] {
        let categories = ['abc', 'def'];
        let categoryIdentities = _.map(categories, (c) => mocks.dataViewScopeIdentity(c));
        let values1 = [1, 2];
        let values2 = [3, 4];

        return <DataView[]>[
            {
                metadata: {
                    columns: [sampleData.categoryColumn, sampleData.y1Column]
                },
                categorical: {
                    categories: [{
                        source: sampleData.categoryColumn,
                        values: categories,
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: sampleData.y1Column,
                            values: values1,
                        }
                    ])
                }
            }, {
                metadata: {
                    columns: [sampleData.categoryColumn, sampleData.y2Column]
                },
                categorical: {
                    categories: [{
                        source: sampleData.categoryColumn,
                        values: categories,
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: sampleData.y2Column,
                            values: values2,
                        }
                    ])
                }
            }
        ];
    }

    function getCartesianLayers(visual: CartesianChart): visuals.ICartesianVisual[] {
        return <visuals.ICartesianVisual[]>visual['layers'];
    }

    module sampleData {
        export let categoryColumn: powerbi.DataViewMetadataColumn = {
            displayName: 'categories',
            queryName: 'categories',
            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
            roles: { ['Category']: true },
        };

        export let scalarCategoryColumn: powerbi.DataViewMetadataColumn = {
            displayName: 'scalar categories',
            queryName: 'categories',
            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer),
            roles: { ['Category']: true },
        };

        export let valueColumn: powerbi.DataViewMetadataColumn = {
            displayName: 'values',
            queryName: 'values',
            isMeasure: true,
            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
            roles: { ['Values']: true },
        };

        export let y1Column: powerbi.DataViewMetadataColumn = {
            displayName: 'y1',
            queryName: 'y1',
            isMeasure: true,
            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
            roles: { ['Y']: true },
        };

        export let y2Column: powerbi.DataViewMetadataColumn = {
            displayName: 'y2',
            queryName: 'y2',
            isMeasure: true,
            type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
            roles: { ['Y2']: true },
        };
    }

    class CartesianChartBuilder {
        public visual: CartesianChart;
        public element: JQuery;
        public hostServices: powerbi.IVisualHostServices;
        public viewport: powerbi.IViewport;

        constructor(width: number = 500, height: number = 500) {
            this.viewport = {
                width: width,
                height: height,
            };

            this.hostServices = powerbitests.mocks.createVisualHostServices();
        }

        public build(chartType: string, interactiveChart: boolean = false): CartesianChart {
            this.element = powerbitests.helpers.testDom(this.viewport.width.toString(), this.viewport.height.toString());

            this.visual = <CartesianChart>powerbi.visuals.plugins[chartType].create();
            this.visual.init({
                element: this.element,
                host: this.hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: this.viewport.height,
                    width: this.viewport.width
                },
                interactivity: { isInteractiveLegend: interactiveChart },
                animation: { transitionImmediate: true },
            });

            return this.visual;
        }

        public buildAxes(): SvgCartesianAxes {
            let axes = new CartesianAxes(true, 10, true);
            let svgAxes = new SvgCartesianAxes(axes);

            this.element = powerbitests.helpers.testDom(this.viewport.width.toString(), this.viewport.height.toString());
            let chartAreaSvg = d3.select(this.element.get(0)).append('svg');
            svgAxes.init(chartAreaSvg);

            return svgAxes;
        }
    }
}