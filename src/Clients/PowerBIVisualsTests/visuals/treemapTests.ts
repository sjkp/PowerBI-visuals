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
    import ArrayExtensions = jsCommon.ArrayExtensions;
    import buildSelectorForColumn = helpers.buildSelectorForColumn;
    import CssConstants = jsCommon.CssConstants;
    import data = powerbi.data;
    import DataViewAnalysis = powerbi.DataViewAnalysis;
    import DataViewTransform = powerbi.data.DataViewTransform;
    import DataView = powerbi.DataView;
    import QueryProjectionCollection = powerbi.data.QueryProjectionCollection;
    import QueryProjectionsByRole = powerbi.data.QueryProjectionsByRole;
    import SQExprBuilder = powerbi.data.SQExprBuilder;
    import Treemap = powerbi.visuals.Treemap;
    import TreemapNode = powerbi.visuals.TreemapNode;
    import SelectionId = powerbi.visuals.SelectionId;
    import ValueType = powerbi.ValueType;
    import PrimitiveType = powerbi.PrimitiveType;
    import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

    const dataTypeNumber = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double);
    const dataTypeString = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text);

    powerbitests.mocks.setLocale();

    const dataViewMetadataCategorySeriesColumns: powerbi.DataViewMetadata = {
        columns: [
            { displayName: 'Squad', queryName: 'select0', roles: { "Category": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) },
            { displayName: 'Period', queryName: 'select1', roles: { "Series": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
            { displayName: null, queryName: 'select2', groupName: '201501', isMeasure: true, roles: { "Values": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
            { displayName: null, queryName: 'select2', groupName: '201502', isMeasure: true, roles: { "Values": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
            { displayName: null, queryName: 'select2', groupName: '201503', isMeasure: true, roles: { "Values": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) }
        ]
    };
    const categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'Squad' });
    const seriesColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'Period' });

    let dataViewMetadataCategoryColumn: powerbi.DataViewMetadata = {
        columns: [
            { displayName: 'Genre', queryName: 'select0', roles: { "Category": true }, type: dataTypeString },
            { displayName: 'TotalSales', queryName: 'select1', isMeasure: true, roles: { "Values": true }, type: dataTypeNumber }
        ]
    };

    let dataViewMetadataCategoryColumnAndLongText: powerbi.DataViewMetadata = {
        columns: [
            { displayName: 'Category group', queryName: 'select0', roles: { "Category": true }, type: dataTypeString },
            { displayName: 'Measure with long name', queryName: 'select1', isMeasure: true, roles: { "Values": true }, type: dataTypeNumber },
            { displayName: 'Measure', queryName: 'select2', isMeasure: true, roles: { "Values": true }, type: dataTypeNumber }
        ]
    };

    let dataViewMetadataCategoryAndMeasures: powerbi.DataViewMetadata = {
        columns: [
            { displayName: 'Area', queryName: 'select0', roles: { "Category": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) },
            { displayName: 'BugsFiled', queryName: 'select1', isMeasure: true, roles: { "Values": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
            { displayName: 'BugsFixed', queryName: 'select2', isMeasure: true, roles: { "Values": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) }
        ]
    };

    describe("Treemap",() => {
        let categoryColumn: powerbi.DataViewMetadataColumn = { displayName: 'year', queryName: 'select0', type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) };
        let measureColumn: powerbi.DataViewMetadataColumn = { displayName: 'sales', queryName: 'select1', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) };

        it('Treemap registered capabilities',() => {
            expect(powerbi.visuals.plugins.treemap.capabilities).toBe(powerbi.visuals.treemapCapabilities);
        });

        it('Capabilities should include dataViewMappings',() => {
            expect(powerbi.visuals.treemapCapabilities.dataViewMappings).toBeDefined();
        });

        it('Capabilities should include dataRoles',() => {
            expect(powerbi.visuals.treemapCapabilities.dataRoles).toBeDefined();
        });

        it('Capabilities should include objects',() => {
            expect(powerbi.visuals.treemapCapabilities.objects).toBeDefined();
        });

        it('Capabilities should include implicitSort',() => {
            expect(powerbi.visuals.treemapCapabilities.sorting.implicit).toBeDefined();
        });

        it('FormatString property should match calculated',() => {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(powerbi.visuals.treemapCapabilities.objects)).toEqual(powerbi.visuals.treemapProps.general.formatString);
        });

        it('preferred capability does not support zero rows',() => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'Year' },
                    { displayName: 'Value', isMeasure: true }],
            };

            let dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: []
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: []
                    }]),
                }
            };

            expect(DataViewAnalysis.supports(dataView, powerbi.visuals.treemapCapabilities.dataViewMappings[0], true))
                .toBe(false);
        });

        it('preferred capability does not support one row',() => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'Year' },
                    { displayName: 'Value', isMeasure: true }],
            };

            let dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2012, 2013]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: [200]
                    }]),
                }
            };

            expect(DataViewAnalysis.supports(dataView, powerbi.visuals.treemapCapabilities.dataViewMappings[0], true))
                .toBe(false);
        });

        it ('Capabilities should only allow one measure if there are group and detail',() => {
            let allowedProjections: QueryProjectionsByRole =
                {
                    'Group': new QueryProjectionCollection([{ queryRef: '0' }]),
                    'Details': new QueryProjectionCollection([{ queryRef: '1' }]),
                    'Values': new QueryProjectionCollection([{ queryRef: '2' }]),
                };
            let disallowedProjections1: QueryProjectionsByRole =
                {
                    'Group': new QueryProjectionCollection([{ queryRef: '0' }]),
                    'Details': new QueryProjectionCollection([{ queryRef: '1' }]),
                    'Values': new QueryProjectionCollection([
                        { queryRef: '2' },
                        { queryRef: '3' }
                    ])
                };
            let disallowedProjections2: QueryProjectionsByRole =
                {
                    'Group': new QueryProjectionCollection([{ queryRef: '0' }]),
                    'Details': new QueryProjectionCollection([{ queryRef: '1' }]),
                    'Values': new QueryProjectionCollection([
                        { queryRef: '2' },
                        { queryRef: '3' },
                        { queryRef: '4' }
                    ])
                };

            let dataViewMappings = powerbi.visuals.treemapCapabilities.dataViewMappings;

            let expectedDataViewMappings = _.cloneDeep(dataViewMappings);
            expectedDataViewMappings[0].conditions = [expectedDataViewMappings[0].conditions[1]];
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections, dataViewMappings, {}).supportedMappings).toEqual(expectedDataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(disallowedProjections1, dataViewMappings, {}).supportedMappings).toBe(null);
            expect(DataViewAnalysis.chooseDataViewMappings(disallowedProjections2, dataViewMappings, {}).supportedMappings).toBe(null);
        });

        it('Capabilities should only allow one measure if is a detail group',() => {
            let allowedProjections: QueryProjectionsByRole =
                {
                    'Details': new QueryProjectionCollection([{ queryRef: '1' }]),
                    'Values': new QueryProjectionCollection([{ queryRef: '0' }]),
                };
            let disallowedProjections: QueryProjectionsByRole =
                {
                    'Details': new QueryProjectionCollection([{ queryRef: '1' }]),
                    'Values': new QueryProjectionCollection([
                        { queryRef: '2' },
                        { queryRef: '0' }
                    ]),
                };

            let dataViewMappings = powerbi.visuals.treemapCapabilities.dataViewMappings;
            let expectedDataViewMappings = _.cloneDeep(dataViewMappings);
            expectedDataViewMappings[0].conditions = [expectedDataViewMappings[0].conditions[1]];

            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections, dataViewMappings, {}).supportedMappings).toEqual(expectedDataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(disallowedProjections, dataViewMappings, {}).supportedMappings).toBe(null);
        });

        it('Capabilities should allow multiple measures if there is no detail group',() => {
            let allowedProjections1: QueryProjectionsByRole =
                {
                    'Group': new QueryProjectionCollection([{ queryRef: '2' }]),
                    'Values': new QueryProjectionCollection([
                        { queryRef: '1' },
                        { queryRef: '0' }
                    ])
                };

            let allowedProjections2: QueryProjectionsByRole =
                {
                    'Group': new QueryProjectionCollection([{ queryRef: '1' }]),
                    'Values': new QueryProjectionCollection([
                        { queryRef: '2' },
                        { queryRef: '0' },
                        { queryRef: '3' }
                    ]),
                };

            let allowedProjections3: QueryProjectionsByRole =
                {
                    'Group': new QueryProjectionCollection([{ queryRef: '1' }]),
                    'Values': new QueryProjectionCollection([{ queryRef: '0' }]),
                };

            let allowedProjections4: QueryProjectionsByRole =
                {
                    'Values': new QueryProjectionCollection([
                        { queryRef: '0' },
                        { queryRef: '1' }
                    ]),
                };

            let dataViewMappings = powerbi.visuals.treemapCapabilities.dataViewMappings;
            
            let expectedDataViewMappingsWithMultiValues = _.cloneDeep(dataViewMappings);
            expectedDataViewMappingsWithMultiValues[0].conditions = [expectedDataViewMappingsWithMultiValues[0].conditions[0]];

            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections1, dataViewMappings, {}).supportedMappings).toEqual(expectedDataViewMappingsWithMultiValues);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections2, dataViewMappings, {}).supportedMappings).toEqual(expectedDataViewMappingsWithMultiValues);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections3, dataViewMappings, {}).supportedMappings).toEqual(expectedDataViewMappingsWithMultiValues);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections4, dataViewMappings, {}).supportedMappings).toEqual(expectedDataViewMappingsWithMultiValues);
        });

        it('Capabilities should not allow multiple category groups',() => {
            let disallowedProjections1: QueryProjectionsByRole =
                {
                    'Group': new QueryProjectionCollection([
                        { queryRef: '0' },
                        { queryRef: '1' }
                    ]),
                };

            let disallowedProjections2: QueryProjectionsByRole =
                {
                    'Group': new QueryProjectionCollection([
                        { queryRef: '0' },
                        { queryRef: '1' }
                    ]),
                    'Values': new QueryProjectionCollection([{ queryRef: '2' }]),
                };

            let disallowedProjections3: QueryProjectionsByRole =
                {
                    'Group': new QueryProjectionCollection([
                        { queryRef: '0' },
                        { queryRef: '1' }
                    ]),
                    'Details': new QueryProjectionCollection([{ queryRef: '2' }]),
                    'Values': new QueryProjectionCollection([{ queryRef: '3' }]),
                };

            var dataViewMappings = powerbi.visuals.treemapCapabilities.dataViewMappings;
            expect(DataViewAnalysis.chooseDataViewMappings(disallowedProjections1, dataViewMappings, {}).supportedMappings).toBe(null);
            expect(DataViewAnalysis.chooseDataViewMappings(disallowedProjections2, dataViewMappings, {}).supportedMappings).toBe(null);
            expect(DataViewAnalysis.chooseDataViewMappings(disallowedProjections3, dataViewMappings, {}).supportedMappings).toBe(null);
        });

        it('Capabilities should not allow multiple detail groups',() => {
            let disallowedProjections1: QueryProjectionsByRole =
                {
                    'Details': new QueryProjectionCollection([
                        { queryRef: '0' },
                        { queryRef: '1' }
                    ])
                };

            let disallowedProjections2: QueryProjectionsByRole =
                {
                    'Details': new QueryProjectionCollection([
                        { queryRef: '0' },
                        { queryRef: '1' }
                    ]),
                    'Values': new QueryProjectionCollection([{ queryRef: '2' }])
                };

            let disallowedProjections3: QueryProjectionsByRole =
                {
                    'Group': new QueryProjectionCollection([{ queryRef: '0' }]),
                    'Details': new QueryProjectionCollection([
                        { queryRef: '1' },
                        { queryRef: '2' }
                    ]),
                    'Values': new QueryProjectionCollection([{ queryRef: '3' }]),
                };

            var dataViewMappings = powerbi.visuals.treemapCapabilities.dataViewMappings;
            expect(DataViewAnalysis.chooseDataViewMappings(disallowedProjections1, dataViewMappings, {}).supportedMappings).toBe(null);
            expect(DataViewAnalysis.chooseDataViewMappings(disallowedProjections2, dataViewMappings, {}).supportedMappings).toBe(null);
            expect(DataViewAnalysis.chooseDataViewMappings(disallowedProjections3, dataViewMappings, {}).supportedMappings).toBe(null);
        });

        it('Capabilities should allow one category and/or one detail groups',() => {
            let allowedProjections1: QueryProjectionsByRole =
                {
                    'Group': new QueryProjectionCollection([{ queryRef: '0' }])
                };

            let allowedProjections2: QueryProjectionsByRole =
                {
                    'Details': new QueryProjectionCollection([{ queryRef: '0' }])
                };

            let allowedProjections3: QueryProjectionsByRole =
                {
                    'Group': new QueryProjectionCollection([{ queryRef: '0' }]),
                    'Details': new QueryProjectionCollection([{ queryRef: '1' }]),
                };

            let allowedProjections4: QueryProjectionsByRole =
                {
                    'Values': new QueryProjectionCollection([{ queryRef: '0' }]),
                };

            let dataViewMappings = powerbi.visuals.treemapCapabilities.dataViewMappings;
            let expectedDataViewMappings = _.cloneDeep(dataViewMappings);
            expectedDataViewMappings[0].conditions = [expectedDataViewMappings[0].conditions[0]];

            let expectedOneDetailDataViewMappings = _.cloneDeep(dataViewMappings);
            expectedOneDetailDataViewMappings[0].conditions = [expectedOneDetailDataViewMappings[0].conditions[1]];

            let expectValuesOnlyDataViewMappings = _.cloneDeep(expectedDataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections1, dataViewMappings, {}).supportedMappings).toEqual(expectedDataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections2, dataViewMappings, {}).supportedMappings).toEqual(expectedOneDetailDataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections3, dataViewMappings, {}).supportedMappings).toEqual(expectedOneDetailDataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections4, dataViewMappings, {}).supportedMappings).toEqual(expectValuesOnlyDataViewMappings);
        });
    });

    describe("treemap data labels validation",() => {
        let v: powerbi.IVisual, element: JQuery;
        let hostServices: powerbi.IVisualHostServices;

        beforeEach(() => {
            hostServices = powerbitests.mocks.createVisualHostServices();
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.plugins.treemap.create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
        });

        it("check color for legend title and legend items treemap chart", (done) => {
            let labelColor = "#002121";

            let dataViewGradientMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1' },
                    { displayName: 'col2', isMeasure: true, roles: { 'Values': true } },
                    { displayName: 'col3', isMeasure: true, roles: { 'Gradient': true } }
                ],
                objects: {
                    legend:
                    {
                        titleText: 'my title text',
                        show: true,
                        showTitle: true,
                        labelColor: { solid: { color: labelColor } },
                    }
                }
            };

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewGradientMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewGradientMetadata.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewGradientMetadata.columns[1],
                            values: [5, 990, 5],
                        }])
                    }
                }],
            });

            let legend = element.find('.legend');
            let legendGroup = legend.find('#legendGroup');
            let legendTitle = legendGroup.find('.legendTitle');
            let legendText = legendGroup.find('.legendItem').find('.legendText');

            setTimeout(() => {
                helpers.assertColorsMatch(legendTitle.css('fill'), labelColor);
                helpers.assertColorsMatch(legendText.first().css('fill'), labelColor);

                done();
            }, DefaultWaitForRender);
        });

        it("check default legend font size", (done) => {
            let labelFontSize = powerbi.visuals.SVGLegend.DefaultFontSizeInPt;

            let dataViewGradientMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1' },
                    { displayName: 'col2', isMeasure: true, roles: { 'Values': true } },
                    { displayName: 'col3', isMeasure: true, roles: { 'Gradient': true } }
                ],
                objects: {
                    legend:
                    {
                        titleText: 'my title text',
                        show: true,
                        showTitle: true,
                    }
                }
            };

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewGradientMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewGradientMetadata.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewGradientMetadata.columns[1],
                            values: [5, 990, 5],
                        }])
                    }
                }],
            });

            let legend = element.find('.legend');
            let legendGroup = legend.find('#legendGroup');
            let legendTitle = legendGroup.find('.legendTitle');
            let legendText = legendGroup.find('.legendItem').find('.legendText');

            setTimeout(() => {
                helpers.assertFontSizeMatch(legendTitle.css('font-size'), labelFontSize);
                helpers.assertFontSizeMatch(legendText.css('font-size'), labelFontSize);
                
                done();
            }, DefaultWaitForRender);
        });

        it("check color for legend title and legend items treemap chart", (done) => {
            let labelFontSize = 13;

            let dataViewGradientMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1' },
                    { displayName: 'col2', isMeasure: true, roles: { 'Values': true } },
                    { displayName: 'col3', isMeasure: true, roles: { 'Gradient': true } }
                ],
                objects: {
                    legend:
                    {
                        titleText: 'my title text',
                        show: true,
                        showTitle: true,
                        fontSize :labelFontSize,
                    }
                }
            };

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewGradientMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewGradientMetadata.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewGradientMetadata.columns[1],
                            values: [5, 990, 5],
                        }])
                    }
                }],
            });

            let legend = element.find('.legend');
            let legendGroup = legend.find('#legendGroup');
            let legendTitle = legendGroup.find('.legendTitle');
            let legendText = legendGroup.find('.legendItem').find('.legendText');

            setTimeout(() => {
                helpers.assertFontSizeMatch(legendTitle.css('font-size'), labelFontSize);
                helpers.assertFontSizeMatch(legendText.css('font-size'), labelFontSize);

                done();
            }, DefaultWaitForRender);
        });

        it('NaN in values shows a warning', (done) => {
            let warningSpy = jasmine.createSpy('warning');
            hostServices.setWarnings = warningSpy;

            let dataChangedOptions = getOptionsForValueWarnings([NaN, 120]);
            v.onDataChanged(dataChangedOptions);

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

            let options = getOptionsForValueWarnings([300, -200, 700]);
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

            let options = getOptionsForValueWarnings([-300, -200, -700]);
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

            let dataChangedOptions = getOptionsForValueWarnings([Number.NEGATIVE_INFINITY, 120]);
            v.onDataChanged(dataChangedOptions);

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

            let dataChangedOptions = getOptionsForValueWarnings([Number.POSITIVE_INFINITY, 120]);
            v.onDataChanged(dataChangedOptions);

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

            let dataChangedOptions = getOptionsForValueWarnings([1e301, 120]);
            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('ValuesOutOfRange');
                done();
            }, DefaultWaitForRender);
        });

        it('All okay in values does not show a warning', (done) => {
            let warningSpy = jasmine.createSpy('warning');
            hostServices.setWarnings = warningSpy;

            let dataChangedOptions = getOptionsForValueWarnings([300, 120]);
            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                expect(warningSpy).toHaveBeenCalledWith([]);
                done();
            }, DefaultWaitForRender);
        });

        function getOptionsForValueWarnings(values: number[]) {
            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: values,
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }],
                            [seriesColumnRef],
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };

            return dataChangedOptions;
        }

        it('labels should be visible by default',(done) => {

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            [seriesColumnRef],
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                expect($('.treemap .labels .minorLabel').css('opacity')).toBe('1');
                expect($('.treemap .labels .majorLabel').css('opacity')).toBe('1');
                done();
            }, DefaultWaitForRender);
        });

        it('labels should be visible',(done) => {

            dataViewMetadataCategorySeriesColumns.objects = {
                labels: { show: true },
                categoryLabels: { show: true }
            };

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields:[categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                expect($('.treemap .labels .minorLabel').css('opacity')).toBe('1');
                expect($('.treemap .labels .majorLabel').css('opacity')).toBe('1');
                done();
            }, DefaultWaitForRender);
        });

        it('labels should be hidden',(done) => {

            dataViewMetadataCategorySeriesColumns.objects = {
                labels: { show: false },
                categoryLabels: { show: false }
            };

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                expect($('.treemap .labels .minorLabel').length).toEqual(0);
                expect($('.treemap .labels .majorLabel').length).toEqual(0);
                done();
            }, DefaultWaitForRender);
        });

        it('Verify values when labels are on and categoryLabels are on', (done) => {

            dataViewMetadataCategorySeriesColumns.objects = {
                labels: { show: true, labelPrecision: 0 },
                categoryLabels: { show: true } // in progress
            };

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategoryColumn.columns[1],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                expect($('.treemap .labels .majorLabel').length).toEqual(2);
                expect($('.treemap .labels .minorLabel').first().text()).toBe('110');
                expect($('.treemap .labels .minorLabel').last().text()).toBe('120');
                done();
            }, DefaultWaitForRender);
        });

        it('Verify values when labels are on and categoryLabels are on with slices', (done) => {

            dataViewMetadataCategorySeriesColumns.objects = {
                labels: { show: true, labelPrecision: 0 },
                categoryLabels: { show: true }
            };

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                expect($('.treemap .labels .majorLabel').length).toEqual(2);
                expect($('.treemap .labels .minorLabel').first().text()).toBe('201501 110');
                expect($('.treemap .labels .minorLabel').last().text()).toBe('201503 320');
                done();
            }, DefaultWaitForRender);
        });

        it('Verify values when labels are on and categoryLabels are off', (done) => {

            dataViewMetadataCategorySeriesColumns.objects = {
                labels: { show: true, labelPrecision: 0 },
                categoryLabels: { show: false }
            };

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                expect($('.treemap .labels .majorLabel').length).toEqual(0);
                expect($('.treemap .labels .minorLabel').first().text()).toBe('110');
                expect($('.treemap .labels .minorLabel').last().text()).toBe('320');
                done();
            }, DefaultWaitForRender);
        });

        it('Verify values when labels are off and categoryLabels are on', (done) => {

            dataViewMetadataCategorySeriesColumns.objects = {
                labels: { show: false },
                categoryLabels: { show: true }
            };

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                expect($('.treemap .labels .majorLabel').length).toEqual(2);
                expect($('.treemap .labels .minorLabel').first().text()).toBe('201501');
                expect($('.treemap .labels .minorLabel').last().text()).toBe('201503');
                done();
            }, DefaultWaitForRender);
        });

        it('Verify values for labels with display units and precision', (done) => {

            dataViewMetadataCategorySeriesColumns.objects = {
                labels: { show: true, labelDisplayUnits: 1000000, labelPrecision: 3 },
                categoryLabels: { show: false }
            };

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110000, 120000],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210000, 220000],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310000, 320000],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                expect($('.treemap .labels .minorLabel').length).toEqual(6);
                expect($('.treemap .labels .minorLabel').first().text()).toBe('0.110M');
                expect($('.treemap .labels .minorLabel').last().text()).toBe('0.320M');
                done();
            }, DefaultWaitForRender);
        });

        it('Verify values for labels with display units and no precision', (done) => {

            dataViewMetadataCategorySeriesColumns.objects = {
                labels: { show: true, labelDisplayUnits: 1000000, labelPrecision: 0 },
                categoryLabels: { show: false }
            };

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110000, 120000],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210000, 220000],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310000, 320000],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                expect($('.treemap .labels .minorLabel').length).toEqual(6);
                expect($('.treemap .labels .minorLabel').first().text()).toBe('0M');
                expect($('.treemap .labels .minorLabel').last().text()).toBe('0M');
                done();
            }, DefaultWaitForRender);
        });

        it('Verify values for labels without display units and precision', (done) => {

            dataViewMetadataCategorySeriesColumns.objects = {
                labels: { show: true, labelDisplayUnits: 0, labelPrecision: 2 },
                categoryLabels: { show: false }
            };

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110.123, 120.123],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210.234, 220.234],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310.345, 320.345],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                expect($('.treemap .labels .minorLabel').length).toEqual(6);
                expect($('.treemap .labels .minorLabel').first().text()).toBe('110.12');
                expect($('.treemap .labels .minorLabel').last().text()).toBe('320.35');
                done();
            }, DefaultWaitForRender);
        });

        it('Verify values for labels without display units and no precision', (done) => {

            dataViewMetadataCategorySeriesColumns.objects = {
                labels: { show: true, labelDisplayUnits: 0, labelPrecision: 0 },
                categoryLabels: { show: false }
            };

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                expect($('.treemap .labels .minorLabel').length).toEqual(6);
                expect($('.treemap .labels .minorLabel').first().text()).toBe('110');
                expect($('.treemap .labels .minorLabel').last().text()).toBe('320');
                done();
            }, DefaultWaitForRender);
        });

        it('hidden labels with highlights dom validation',(done) => {

            dataViewMetadataCategorySeriesColumns.objects = {
                labels: { show: false },
                categoryLabels: { show: false }
            };
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("Drama"),
                mocks.dataViewScopeIdentity("Comedy"),
                mocks.dataViewScopeIdentity("Documentary"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['Drama', 'Comedy', 'Documentary'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120, 130],
                                highlights: [60, 80, 20]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.treemap .labels .majorLabel').length).toBe(0);
                expect($('.treemap .labels .minorLabel').length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });

        it('labels color should changed from settings',(done) => {

            let colorRgb = 'rgb(120,110,100)';
            dataViewMetadataCategorySeriesColumns.objects = {
                labels: {
                    color: { solid: { color: colorRgb } },
                    show: true,
                },
                categoryLabels: { show: true }
            };
            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                let minorActualColor = $('.treemap .labels .minorLabel').css('fill');
                let majorActualColor = $('.treemap .labels .majorLabel').css('fill');

                helpers.assertColorsMatch(minorActualColor, colorRgb);
                helpers.assertColorsMatch(majorActualColor, colorRgb);

                done();
            }, DefaultWaitForRender);
        });

        it("labels content mutil-measure", (done) => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'a', queryName: 'a', isMeasure: true, roles: { 'Values': true } },
                    { displayName: 'b', queryName: 'b', isMeasure: true, roles: { 'Values': true } },
                    { displayName: 'c', queryName: 'c', isMeasure: true, roles: { 'Values': true } }
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

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect($('.treemap .labels .majorLabel').length).toEqual(3);
                expect($('.treemap .labels .majorLabel').first().text()).toBe('a');
                expect($('.treemap .labels .majorLabel').last().text()).toBe('c');
                done();
            }, DefaultWaitForRender);
                
        });
    });

    describe("Enumerate Objects",() => {
        let v: powerbi.IVisual, element: JQuery;
        
        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.plugins.treemap.create();
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

        it('Check basic enumeration', (done) => {
            let dataView = {
                metadata: dataViewMetadataCategorySeriesColumns,
                categorical: {
                    categories: [{
                        source: dataViewMetadataCategorySeriesColumns.columns[0],
                        values: ['The Nuthatches', 'Skylarks'],
                        identity: [
                            mocks.dataViewScopeIdentity('The Nuthatches'),
                            mocks.dataViewScopeIdentity('Skylarks'),
                        ],
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategorySeriesColumns.columns[2],
                            values: [110, 120],
                            identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                        }, {
                            source: dataViewMetadataCategorySeriesColumns.columns[3],
                            values: [210, 220],
                            identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                        }, {
                            source: dataViewMetadataCategorySeriesColumns.columns[4],
                            values: [310, 320],
                            identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                        }],
                        undefined,
                        dataViewMetadataCategorySeriesColumns.columns[1])
                }
            };

            v.onDataChanged({
                dataViews: [dataView]
            });

            setTimeout(() => {
                let points = <VisualObjectInstanceEnumerationObject>v.enumerateObjectInstances({ objectName: 'dataPoint' });
                expect(points.instances.length).toBe(2);

                let categoryColumn = dataView.categorical.categories[0];
                for (let i = 0; i < categoryColumn.values.length; i++) {
                    let instance = points.instances[i];
                    expect(instance.displayName).toEqual(categoryColumn.values[i]);
                    expect(instance.properties['fill']).toBeDefined();

                    let id = powerbi.visuals.SelectionIdBuilder.builder()
                        .withCategory(categoryColumn, i)
                        .createSelectionId();
                    expect(instance.selector).toEqual(id.getSelector());
                }

                done();
            }, DefaultWaitForRender);
        });
    });

    function treemapDomValidation(hasLegendObject: boolean) {
        let v: powerbi.IVisual;
        let element: JQuery;
        let hostServices: powerbi.IVisualHostServices;

        if (hasLegendObject) {
            dataViewMetadataCategorySeriesColumns.objects = { legend: { show: true } };
        }
        else {
            dataViewMetadataCategorySeriesColumns.objects = undefined;
        }

        beforeEach(() => {
            hostServices = mocks.createVisualHostServices();
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.plugins.treemap.create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
        });

        it('treemap categories and series dom validation', (done) => {
            dataViewMetadataCategorySeriesColumns.objects = {
                labels: { show: false },
                categoryLabels: { show: true }
            };

            let dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            let renderLegend = dataViewMetadataCategorySeriesColumns.objects && dataViewMetadataCategorySeriesColumns.objects['legend'];

            setTimeout(() => {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(2);
                expect($('.treemap .shapes .nodeGroup').length).toBe(6);
                expect($('.treemap .labels .majorLabel').length).toBe(2);
                expect($('.treemap .labels .majorLabel').last().text()).toBe('Skylarks');
                expect($('.treemap .labels .minorLabel').length).toBe(6);
                expect($('.treemap .labels .minorLabel').last().text()).toBe('201503');
                if (renderLegend) {
                    expect($('.legend .item').length).toBe(2);
                    expect($('.legend .item').first().text()).toBe('The Nuthatches');
                    expect($('.legend .title').text()).toBe('Squad');
                }
                done();
            }, DefaultWaitForRender);
        });

        it('treemap categories and series onDataChanged dom validation', (done) => {
            dataViewMetadataCategorySeriesColumns.objects = {
                labels: { show: false },
                categoryLabels: { show: true }
            };

            let initialDataViews: DataView[] = [{
                metadata: dataViewMetadataCategorySeriesColumns,
                categorical: {
                    categories: [{
                        source: dataViewMetadataCategorySeriesColumns.columns[0],
                        values: ['The Nuthatches', 'Skylarks'],
                        identity: [
                            mocks.dataViewScopeIdentity('a'),
                            mocks.dataViewScopeIdentity('b'),
                        ],
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategorySeriesColumns.columns[2],
                            values: [110, 120],
                            identity: mocks.dataViewScopeIdentity('201501'),
                        }, {
                            source: dataViewMetadataCategorySeriesColumns.columns[3],
                            values: [210, 220],
                            identity: mocks.dataViewScopeIdentity('201502'),
                        }, {
                            source: dataViewMetadataCategorySeriesColumns.columns[4],
                            values: [310, 320],
                            identity: mocks.dataViewScopeIdentity('201503'),
                        }],
                        undefined,
                        dataViewMetadataCategorySeriesColumns.columns[1])
                }
            }];
            let updatedMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'Squad', queryName: 'select0', roles: { "Category": true }, type: dataTypeString },
                    { displayName: 'Period', queryName: 'select0', roles: { "Series": true }, type: dataTypeNumber },
                    { displayName: null, groupName: '201503', isMeasure: true, roles: { 'Values': true }, type: dataTypeNumber },
                    { displayName: null, groupName: '201504', isMeasure: true, roles: { 'Values': true }, type: dataTypeNumber }
                ]
            };

            updatedMetadata.objects = {
                labels: { show: false },
                categoryLabels: { show: true }
            };

            let updatedDataViews: DataView[] = [{
                metadata: updatedMetadata,
                categorical: {
                    categories: [{
                        source: updatedMetadata.columns[0],
                        values: ['The Nuthatches', 'OddOneOut'],
                        identity: [
                            mocks.dataViewScopeIdentity('a'),
                            mocks.dataViewScopeIdentity('b'),
                        ],
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: updatedMetadata.columns[2],
                            values: [210, 220],
                            identity: mocks.dataViewScopeIdentity('201503'),
                        }, {
                            source: updatedMetadata.columns[3],
                            values: [310, 320],
                            identity: mocks.dataViewScopeIdentity('201504'),
                        }],
                        undefined,
                        dataViewMetadataCategorySeriesColumns.columns[1])
                }
            }];
            v.onDataChanged({ dataViews: initialDataViews });

            let renderLegend = dataViewMetadataCategorySeriesColumns.objects && dataViewMetadataCategorySeriesColumns.objects['legend'];

            setTimeout(() => {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(2);
                expect($('.treemap .shapes .nodeGroup').length).toBe(6);
                expect($('.treemap .labels .majorLabel').length).toBe(2);
                expect($('.treemap .labels .majorLabel').last().text()).toBe('Skylarks');
                expect($('.treemap .labels .minorLabel').length).toBe(6);
                expect($('.treemap .labels .minorLabel').last().text()).toBe('201503');
                if (renderLegend) {
                    expect($('.legend .item').length).toBe(2);
                    expect($('.legend .item').first().text()).toBe('The Nuthatches');
                    expect($('.legend .item').last().text()).toBe('Skylarks');
                    expect($('.legend .title').text()).toBe('Squad');
                }
                v.onDataChanged({ dataViews: updatedDataViews });
                setTimeout(() => {
                    expect($('.treemap .shapes .rootNode').length).toBe(1);
                    expect($('.treemap .shapes .parentGroup').length).toBe(2);
                    expect($('.treemap .shapes .nodeGroup').length).toBe(4);
                    expect($('.treemap .labels .majorLabel').length).toBe(2);
                    expect($('.treemap .labels .majorLabel').last().text()).toBe('OddOneOut');
                    expect($('.treemap .labels .minorLabel').length).toBe(4);
                    expect($('.treemap .labels .minorLabel').last().text()).toBe('201504');
                    if (renderLegend) {
                        expect($('.legend .item').first().text()).toBe('The Nuthatches');
                        expect($('.legend .item').last().text()).toBe('OddOneOut');
                        expect($('.legend .title').text()).toBe('Squad');
                    }
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('treemap categories and series onResize from small to medium tile dom validation', (done) => {
            let onDataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                                mocks.dataViewScopeIdentity('b'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: mocks.dataViewScopeIdentity('201501'),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: mocks.dataViewScopeIdentity('201502'),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: mocks.dataViewScopeIdentity('201503'),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };
            v.onDataChanged(onDataChangedOptions);

            v.onResizing({
                height: 100,
                width: 200
            });

            setTimeout(() => {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(2);
                expect($('.treemap .shapes .nodeGroup').length).toBe(6);
                expect($('.treemap .labels .majorLabel').length).toBe(2);
                expect($('.treemap .labels .minorLabel').length).toBe(4);
                v.onResizing({ height: 300, width: 300 });
                setTimeout(() => {
                    expect($('.treemap .shapes .rootNode').length).toBe(1);
                    expect($('.treemap .shapes .parentGroup').length).toBe(2);
                    expect($('.treemap .shapes .nodeGroup').length).toBe(6);
                    expect($('.treemap .labels .majorLabel').length).toBe(2);
                    expect($('.treemap .labels .minorLabel').length).toBe(6);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('treemap categories and measure dom validation', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataCategoryColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategoryColumn.columns[0],
                            values: ['Drama', 'Comedy', 'Documentary'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                                mocks.dataViewScopeIdentity('b'),
                                mocks.dataViewScopeIdentity('c'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategoryColumn.columns[1],
                                values: [110, 120, 130]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(3);
                expect($('.treemap .shapes .nodeGroup').length).toBe(0);
                expect($('.treemap .labels .majorLabel').length).toBe(3);
                expect($('.treemap .labels .majorLabel').last().text()).toBe('Documentary');
                expect($('.treemap .labels .minorLabel').length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });

        it('treemap culls invisible rectangles dom validation', (done) => {
            spyOn(hostServices, 'setWarnings').and.callThrough();

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataCategoryColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategoryColumn.columns[0],
                            values: ['Drama', 'Comedy', 'Documentary'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                                mocks.dataViewScopeIdentity('b'),
                                mocks.dataViewScopeIdentity('c'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategoryColumn.columns[1],
                                values: [110, 120, 0.000000001]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(2);
                expect($('.treemap .shapes .nodeGroup').length).toBe(0);
                expect($('.treemap .labels .majorLabel').length).toBe(2);
                expect($('.treemap .labels .majorLabel').last().text()).toBe('Comedy');
                expect($('.treemap .labels .minorLabel').length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });

        it('treemap categories and measure with highlights dom validation', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity("Drama"),
                mocks.dataViewScopeIdentity("Comedy"),
                mocks.dataViewScopeIdentity("Documentary"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataCategoryColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategoryColumn.columns[0],
                            values: ['Drama', 'Comedy', 'Documentary'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategoryColumn.columns[1],
                                values: [110, 120, 130],
                                highlights: [60, 80, 20]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(6);
                expect($('.treemap .shapes .nodeGroup').length).toBe(0);
                expect($('.treemap .shapes .parentGroup.treemapNodeHighlight').length).toBe(3);
                expect($('.treemap .shapes .nodeGroup.treemapNodeHighlight').length).toBe(0);
                expect($('.treemap .labels .majorLabel').length).toBe(3);
                expect($('.treemap .labels .majorLabel').last().text()).toBe('Documentary');
                expect($('.treemap .labels .minorLabel').length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });

        it('treemap categories and measure with overflowing highlights dom validation', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataCategoryColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategoryColumn.columns[0],
                            values: ['Drama', 'Comedy', 'Documentary'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                                mocks.dataViewScopeIdentity('b'),
                                mocks.dataViewScopeIdentity('c'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategoryColumn.columns[1],
                                values: [110, 120, 130],
                                highlights: [140, 160, 135]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(3);
                expect($('.treemap .shapes .nodeGroup').length).toBe(0);
                expect($('.treemap .shapes .parentGroup.treemapNodeHighlight').length).toBe(0);
                expect($('.treemap .shapes .nodeGroup.treemapNodeHighlight').length).toBe(0);
                expect($('.treemap .labels .majorLabel').length).toBe(3);
                expect($('.treemap .labels .majorLabel').last().text()).toBe('Documentary');
                expect($('.treemap .labels .minorLabel').length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });

        it('treemap categories and measures with highlights dom validation', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataCategoryAndMeasures,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategoryAndMeasures.columns[0],
                            values: ['Front end', 'Back end'],
                            identity: [
                                mocks.dataViewScopeIdentity('f'),
                                mocks.dataViewScopeIdentity('b'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategoryAndMeasures.columns[1],
                                values: [110, 120],
                                highlights: [60, 60]
                            }, {
                                source: dataViewMetadataCategoryAndMeasures.columns[2],
                                values: [210, 220],
                                highlights: [140, 200]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(2);
                expect($('.treemap .shapes .nodeGroup').length).toBe(8);
                expect($('.treemap .shapes .parentGroup.treemapNodeHighlight').length).toBe(0);
                expect($('.treemap .shapes .nodeGroup.treemapNodeHighlight').length).toBe(4);
                expect($('.treemap .labels .majorLabel').length).toBe(2);
                expect($('.treemap .labels .majorLabel').last().text()).toBe('Back end');
                expect($('.treemap .labels .minorLabel').length).toBe(4);

                done();
            }, DefaultWaitForRender);
        });

        it('treemap categories and measure onDataChanged dom validation', (done) => {
            let initialDataViews: DataView[] = [{
                metadata: dataViewMetadataCategoryColumn,
                categorical: {
                    categories: [{
                        source: dataViewMetadataCategoryColumn.columns[0],
                        values: ['Drama', 'Comedy', 'Documentary'],
                        identity: [
                            mocks.dataViewScopeIdentity('a'),
                            mocks.dataViewScopeIdentity('b'),
                            mocks.dataViewScopeIdentity('c'),
                        ],
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategoryColumn.columns[1],
                            values: [110, 120, 130]
                        }])
                }
            }];
            let updatedDataViews: DataView[] = [{
                metadata: dataViewMetadataCategoryColumn,
                categorical: {
                    categories: [{
                        source: dataViewMetadataCategoryColumn.columns[0],
                        values: ['Comedy', 'Documentary'],
                        identity: [
                            mocks.dataViewScopeIdentity('b'),
                            mocks.dataViewScopeIdentity('c'),
                        ],
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategoryColumn.columns[1],
                            values: [120, 130]
                        }])
                }
            }];

            v.onDataChanged({ dataViews: initialDataViews });

            setTimeout(() => {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(3);
                expect($('.treemap .shapes .nodeGroup').length).toBe(0);
                expect($('.treemap .labels .majorLabel').length).toBe(3);
                expect($('.treemap .labels .majorLabel').first().text()).toBe('Drama');
                expect($('.treemap .labels .minorLabel').length).toBe(0);
                v.onDataChanged({ dataViews: updatedDataViews });
                setTimeout(() => {
                    expect($('.treemap .shapes .rootNode').length).toBe(1);
                    expect($('.treemap .shapes .parentGroup').length).toBe(2);
                    expect($('.treemap .shapes .nodeGroup').length).toBe(0);
                    expect($('.treemap .labels .majorLabel').length).toBe(2);
                    expect($('.treemap .labels .majorLabel').first().text()).toBe('Comedy');
                    expect($('.treemap .labels .minorLabel').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('treemap categories and measure onResize from small to medium tile dom validation', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataCategoryColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategoryColumn.columns[0],
                            values: ['Drama', 'Comedy', 'Documentary'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                                mocks.dataViewScopeIdentity('b'),
                                mocks.dataViewScopeIdentity('c'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategoryColumn.columns[1],
                                values: [110, 120, 130]
                            }])
                    }
                }]
            });

            v.onResizing({
                height: 100,
                width: 200
            });

            setTimeout(() => {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(3);
                expect($('.treemap .shapes .nodeGroup').length).toBe(0);
                expect($('.treemap .labels .majorLabel').length).toBe(3);
                expect($('.treemap .labels .minorLabel').length).toBe(0);
                v.onResizing({ height: 300, width: 300 });
                setTimeout(() => {
                    expect($('.treemap .shapes .rootNode').length).toBe(1);
                    expect($('.treemap .shapes .parentGroup').length).toBe(3);
                    expect($('.treemap .shapes .nodeGroup').length).toBe(0);
                    expect($('.treemap .labels .majorLabel').length).toBe(3);
                    expect($('.treemap .labels .minorLabel').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('treemap category and measure labeling validation', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataCategoryColumnAndLongText,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategoryColumnAndLongText.columns[0],
                            values: ['Very very long value'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategoryColumnAndLongText.columns[1],
                                values: [100]
                            }, {
                                source: dataViewMetadataCategoryColumnAndLongText.columns[2],
                                values: [100]
                            }])
                    }
                }]
            });

            v.onResizing({
                height: 12,
                width: 100
            });

            setTimeout(() => {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(1);
                expect($('.treemap .shapes .nodeGroup').length).toBe(2);
                expect($('.treemap .labels .majorLabel').length).toBe(0);
                expect($('.treemap .labels .minorLabel').length).toBe(0);
                v.onResizing({ height: 24, width: 100 });
                setTimeout(() => {
                    expect($('.treemap .shapes .rootNode').length).toBe(1);
                    expect($('.treemap .shapes .parentGroup').length).toBe(1);
                    expect($('.treemap .shapes .nodeGroup').length).toBe(2);
                    expect($('.treemap .labels .majorLabel').length).toBe(1);
                    expect($('.treemap .labels .minorLabel').length).toBe(0);
                    expect($('.treemap .labels .majorLabel').first().text().length).toBeGreaterThan(0);
                    v.onResizing({ height: 32, width: 200 });
                    setTimeout(() => {
                        expect($('.treemap .shapes .rootNode').length).toBe(1);
                        expect($('.treemap .shapes .parentGroup').length).toBe(1);
                        expect($('.treemap .shapes .nodeGroup').length).toBe(2);
                        expect($('.treemap .labels .majorLabel').length).toBe(1);
                        expect($('.treemap .labels .minorLabel').length).toBe(0);
                        expect($('.treemap .labels .majorLabel').first().text().length).toBeGreaterThan(0);
                        v.onResizing({ height: 64, width: 200 });
                        setTimeout(() => {
                            expect($('.treemap .shapes .rootNode').length).toBe(1);
                            expect($('.treemap .shapes .parentGroup').length).toBe(1);
                            expect($('.treemap .shapes .nodeGroup').length).toBe(2);
                            expect($('.treemap .labels .majorLabel').length).toBe(1);
                            expect($('.treemap .labels .majorLabel').first().text().length).toBeGreaterThan(0);
                            expect($('.treemap .labels .minorLabel').length).toBe(2);
                            expect($('.treemap .labels .minorLabel').first().text().length).toBeGreaterThan(0);
                            expect($('.treemap .labels .minorLabel').last().text().length).toBeGreaterThan(0);
                            done();
                        }, DefaultWaitForRender);
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('treemap same category and series dom validation', (done) => {
            dataViewMetadataCategorySeriesColumns.objects = {
                labels: { show: false },
                categoryLabels: { show: true }
            };
            let categoryIdentities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('201501'),
                mocks.dataViewScopeIdentity('201502'),
            ];
            let seriesIdentities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('201501'),
                mocks.dataViewScopeIdentity('201502'),
            ];

            let onDataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['201501', '201502'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, null],
                                identity: seriesIdentities[0],
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [null, 220],
                                identity: seriesIdentities[1],
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };
            v.onDataChanged(onDataChangedOptions);

            let renderLegend = dataViewMetadataCategorySeriesColumns.objects && dataViewMetadataCategorySeriesColumns.objects['legend'];

            setTimeout(() => {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(2);
                expect($('.treemap .shapes .nodeGroup').length).toBe(2);
                expect($('.treemap .labels .majorLabel').length).toBe(2);
                expect($('.treemap .labels .majorLabel').last().text()).toBe('201502');
                expect($('.treemap .labels .minorLabel').length).toBe(2);
                expect($('.treemap .labels .minorLabel').last().text()).toBe('201502');
                if (renderLegend) {
                    expect($('.legend .item').length).toBe(2);
                    expect($('.legend .item').first().text()).toBe('201502');
                    expect($('.legend .title').text()).toBe('Squad');
                }
                done();
            }, DefaultWaitForRender);
        });

        if (hasLegendObject) {
            it('legend formatting', (done) => {

                let dataView = {
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                };

                // Check legend should show, if show is undefined
                dataView.metadata.objects = { legend: {} };

                v.onDataChanged({
                    dataViews: [dataView]
                });

                setTimeout(() => {
                    expect($('.legendItem')).toBeInDOM();
                    
                    //change legend position
                    dataView.metadata.objects = { legend: { show: true } };
                    v.onDataChanged({
                        dataViews: [dataView]
                    });

                    setTimeout(() => {
                        expect($('.legendItem')).toBeInDOM();
                        
                        //change legend position
                        dataView.metadata.objects = { legend: { show: true, position: 'Right' } };
                        v.onDataChanged({
                            dataViews: [dataView]
                        });

                        setTimeout(() => {
                            expect($('.legendItem')).toBeInDOM();

                            dataView.metadata.objects = { legend: { show: true, position: 'TopCenter', showTitle: true } };
                            v.onDataChanged({
                                dataViews: [dataView]
                            });
                            setTimeout(() => {
                                expect($('#legendGroup').attr('transform')).toBeDefined();

                                //set title
                                let testTitle = 'Test Title';
                                dataView.metadata.objects = { legend: { show: true, position: 'Right', showTitle: true, titleText: testTitle } };
                                v.onDataChanged({
                                    dataViews: [dataView]
                                });
                                setTimeout(() => {

                                    expect($('.legendItem')).toBeInDOM();
                                    expect(helpers.findElementText($('.legendTitle'))).toBe(testTitle);
                                    expect(helpers.findElementTitle($('.legendTitle'))).toBe(testTitle);
                                    expect($('#legendGroup').attr('transform')).not.toBeDefined();

                                    //hide legend
                                    dataView.metadata.objects = { legend: { show: false, position: 'Right' } };
                                    v.onDataChanged({
                                        dataViews: [dataView]
                                    });
                                    setTimeout(() => {
                                        expect($('.legendItem')).not.toBeInDOM();
                                        done();
                                    }, DefaultWaitForRender);
                                }, DefaultWaitForRender);
                            }, DefaultWaitForRender);
                        }, DefaultWaitForRender);
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });
        }
    };

    describe("Treemap DOM validation", () => treemapDomValidation(false));
    describe("Treemap DOM validation - with legend", () => treemapDomValidation(true));

    describe("treemap web animation",() => {
        let v: powerbi.IVisual, element: JQuery;

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = new Treemap({
                animator: new powerbi.visuals.WebTreemapAnimator,
                isScrollable: true,
                behavior: new powerbi.visuals.TreemapWebBehavior(),
                tooltipsEnabled: true,
            });
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

        it('treemap highlight animation', (done) => {
            let noHighlightsDataViews = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };

            let highlightsDataViewsA = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                highlights: [60, 70],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                highlights: [160, 170],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                highlights: [260, 270],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };

            let highlightsDataViewsB = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                highlights: [20, 10],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                highlights: [120, 110],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                highlights: [220, 210],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };

            v.onDataChanged(noHighlightsDataViews);
            setTimeout(() => {
                let svgInit = $('.treemap');
                let initialHeight = svgInit.attr('height'), initialWidth = svgInit.attr('width');

                let animator = <powerbi.visuals.WebTreemapAnimator>(<Treemap>v).animator;
                spyOn(animator, 'animate').and.callThrough();

                v.onDataChanged(highlightsDataViewsA);
                v.onDataChanged(highlightsDataViewsB);
                v.onDataChanged(noHighlightsDataViews);

                expect(animator).toBeTruthy();
                expect(animator.animate).toHaveBeenCalled();

                setTimeout(() => {
                    let svg = $('.treemap');
                    expect(svg).toBeInDOM();

                    expect(svg.attr('height')).toBe(initialHeight);
                    expect(svg.attr('width')).toBe(initialWidth);

                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('treemap highlight animation - suppressAnimations', (done) => {
            let noHighlightsDataViews = {
                suppressAnimations: true,
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };

            let highlightsDataViewsA = {
                suppressAnimations: true,
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                highlights: [60, 70],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                highlights: [160, 170],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                highlights: [260, 270],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };

            let highlightsDataViewsB = {
                suppressAnimations: true,
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                mocks.dataViewScopeIdentity('The Nuthatches'),
                                mocks.dataViewScopeIdentity('Skylarks'),
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                highlights: [20, 10],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                highlights: [120, 110],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502')),
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                highlights: [220, 210],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503')),
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };

            v.onDataChanged(noHighlightsDataViews);
            setTimeout(() => {
                let svgInit = $('.treemap');
                let initialHeight = svgInit.attr('height'), initialWidth = svgInit.attr('width');

                let animator = <powerbi.visuals.WebTreemapAnimator>(<Treemap>v).animator;
                spyOn(animator, 'animate').and.callThrough();

                v.onDataChanged(highlightsDataViewsA);
                v.onDataChanged(highlightsDataViewsB);
                v.onDataChanged(noHighlightsDataViews);

                expect(animator).toBeTruthy();
                expect(animator.animate).not.toHaveBeenCalled();

                setTimeout(() => {
                    let svg = $('.treemap');
                    expect(svg).toBeInDOM();

                    expect(svg.attr('height')).toBe(initialHeight);
                    expect(svg.attr('width')).toBe(initialWidth);

                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
    });

    describe("treemap interactivity",() => {
        let v: powerbi.IVisual, element: JQuery;
        let hostServices: powerbi.IVisualHostServices;
        let defaultOpacity = '';
        let dimmedOpacity = Treemap.DimmedShapeOpacity.toString();

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            hostServices = mocks.createVisualHostServices();
            v = new Treemap({
                animator: new powerbi.visuals.WebTreemapAnimator,
                isScrollable: true,
                behavior: new powerbi.visuals.TreemapWebBehavior(),
                tooltipsEnabled: true,
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
                interactivity: { selection: true }
            });
        });

        it('treemap categories and series - single select', (done) => {
            let categoryIdentities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
            ];
            let seriesIdentities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('201501'),
                mocks.dataViewScopeIdentity('201502'),
                mocks.dataViewScopeIdentity('201503'),
            ];
            let onDataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['A', 'B'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: seriesIdentities[0],
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: seriesIdentities[1],
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: seriesIdentities[2],
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };
            v.onDataChanged(onDataChangedOptions);

            setTimeout(() => {
                let rootShape = $('.treemap .shapes .rootNode');
                let shapes = $('.treemap .shapes .parentGroup');
                let nestedShapes = $('.treemap .shapes .nodeGroup');

                spyOn(hostServices, 'onSelect').and.callThrough();

                // Select a major label
                $('.majorLabel').first().d3Click(0, 0);
                expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[2].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[3].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[4].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[5].style.fillOpacity).toBe(dimmedOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith(
                    {
                        visualObjects: [
                            {
                                objectName: 'dataPoint',
                                selectorsByColumn:
                                {
                                    dataMap: { 'select0': categoryIdentities[0] },
                                }
                            }
                        ]
                    });
                $('.majorLabel').first().d3Click(0, 0);
                
                // Select the first nested shape
                $('.nodeGroup').first().d3Click(0, 0);
                expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[1].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[2].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[3].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[4].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[5].style.fillOpacity).toBe(dimmedOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith(
                    {
                        visualObjects: [
                            {
                                objectName: 'dataPoint',
                                selectorsByColumn:
                                {
                                    dataMap: { 'select0': categoryIdentities[0], 'select1': seriesIdentities[0] },
                                    metadata: dataViewMetadataCategorySeriesColumns.columns[2].queryName
                                }
                            }
                        ]
                    });

                // Select the last minor label
                $('.minorLabel').last().d3Click(0, 0);
                expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[0].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[1].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[2].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[3].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[4].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[5].style.fillOpacity).toBe(defaultOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith(
                    {
                        visualObjects: [
                            {
                                objectName: 'dataPoint',
                                selectorsByColumn:
                                {
                                    dataMap: { 'select0': categoryIdentities[1], 'select1': seriesIdentities[2] },
                                    metadata: dataViewMetadataCategorySeriesColumns.columns[2].queryName
                                }
                            }
                        ]
                    });

                $('.minorLabel').last().d3Click(0, 0);
                expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[2].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[3].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[4].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[5].style.fillOpacity).toBe(defaultOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith({ visualObjects: [] });

                done();
            }, DefaultWaitForRender);
        });

        it('treemap categories and measures - single click on category node (parent shape must be selectable)', (done) => {
            let identities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('f'),
                mocks.dataViewScopeIdentity('b'),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataCategoryAndMeasures,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategoryAndMeasures.columns[0],
                            values: ['Front end', 'Back end'],
                            identity: identities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategoryAndMeasures.columns[1],
                                values: [110, 120]
                            }, {
                                source: dataViewMetadataCategoryAndMeasures.columns[2],
                                values: [210, 220]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                let rootShape = $('.treemap .shapes .rootNode');
                let shapes = $('.treemap .shapes .parentGroup');
                let nestedShapes = $('.treemap .shapes .nodeGroup');

                expect(shapes[0].style.fill).toBe(CssConstants.noneValue);
                expect(shapes[1].style.fill).toBe(CssConstants.noneValue);
                expect(nestedShapes[0].style.fill).not.toBe(CssConstants.noneValue);
                expect(nestedShapes[1].style.fill).not.toBe(CssConstants.noneValue);
                expect(nestedShapes[2].style.fill).not.toBe(CssConstants.noneValue);
                expect(nestedShapes[3].style.fill).not.toBe(CssConstants.noneValue);

                spyOn(hostServices, 'onSelect').and.callThrough();

                // Select the shape for the second category instance
                $('.parentGroup').last().d3Click(0, 0);
                expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[0].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[1].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[2].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[3].style.fillOpacity).toBe(defaultOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith(
                    {
                        visualObjects: [
                            {
                                objectName: 'dataPoint',
                                selectorsByColumn:
                                {
                                    dataMap: { 'select0': identities[1] },
                                }
                            }
                        ]
                    });

                done();
            }, DefaultWaitForRender);
        });

        it('context menu', (done) => {
            let identities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('f'),
                mocks.dataViewScopeIdentity('b'),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataCategoryAndMeasures,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategoryAndMeasures.columns[0],
                            values: ['Front end', 'Back end'],
                            identity: identities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategoryAndMeasures.columns[1],
                                values: [110, 120]
                            }, {
                                source: dataViewMetadataCategoryAndMeasures.columns[2],
                                values: [210, 220]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                spyOn(hostServices, 'onContextMenu').and.callThrough();

                // Select the shape for the last data point
                $('.nodeGroup').last().d3ContextMenu(5, 15);
                expect(hostServices.onContextMenu).toHaveBeenCalledWith(
                    {
                        data: [
                            {
                                dataMap: { 'select0': identities[1] },
                                metadata: dataViewMetadataCategoryAndMeasures.columns[2].queryName
                            }
                        ], position: {
                            x: 5,
                            y: 15
                        }
                    });

                done();
            }, DefaultWaitForRender);
        });

        // Disabling due to changes in how we handle selection breaking the preservation of selection across data view changes.  Bug filed as #4904881
        /*it('treemap categories and series onDataChanged - single click on old and new shapes', (done) => {
            let categoryIdentities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
            ];

            let initialDataViews: DataView[] = [{
                metadata: dataViewMetadataCategorySeriesColumns,
                categorical: {
                    categories: [{
                        source: dataViewMetadataCategorySeriesColumns.columns[0],
                        values: ['A', 'B'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategorySeriesColumns.columns[2],
                            values: [110, 120],
                            identity: mocks.dataViewScopeIdentity('201501'),
                        }, {
                            source: dataViewMetadataCategorySeriesColumns.columns[3],
                            values: [210, 220],
                            identity: mocks.dataViewScopeIdentity('201502'),
                        }, {
                            source: dataViewMetadataCategorySeriesColumns.columns[4],
                            values: [310, 320],
                            identity: mocks.dataViewScopeIdentity('201503'),
                        }],
                        undefined,
                        dataViewMetadataCategorySeriesColumns.columns[1])
                }
            }];
            let updatedMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'Squad', roles: { "Category": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) },
                    { displayName: 'Period', roles: { "Series": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                    { displayName: '201503', isMeasure: true, roles: { 'Values': true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                    { displayName: '201504', isMeasure: true, roles: { 'Values': true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) }
                ]
            };
            let updatedDataViewsSeriesIdentities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('201503'),
                mocks.dataViewScopeIdentity('201504'),
            ];
            let updatedDataViews: DataView[] = [{
                metadata: updatedMetadata,
                categorical: {
                    categories: [{
                        source: updatedMetadata.columns[0],
                        values: ['A', 'B'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: updatedMetadata.columns[2],
                            values: [210, 220],
                            identity: updatedDataViewsSeriesIdentities[0],
                        }, {
                            source: updatedMetadata.columns[3],
                            values: [310, 320],
                            identity: updatedDataViewsSeriesIdentities[1],
                        }],
                        undefined,
                        dataViewMetadataCategorySeriesColumns.columns[1])
                }
            }];

            v.onDataChanged({ dataViews: initialDataViews });

            setTimeout(() => {
                let rootShape = $('.treemap .shapes .rootNode');
                let shapes = $('.treemap .shapes .parentGroup');
                let nestedShapes = $('.treemap .shapes .nodeGroup');

                spyOn(hostServices, 'onSelect').and.callThrough();

                // Make a selection
                $('.majorLabel').first().d3Click(0, 0);
                expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[2].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[3].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[4].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[5].style.fillOpacity).toBe(dimmedOpacity);

                // Change data
                v.onDataChanged({ dataViews: updatedDataViews });
                setTimeout(() => {
                    shapes = $('.treemap .shapes .parentGroup');
                    nestedShapes = $('.treemap .shapes .nodeGroup');

                    expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                    expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                    expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                    expect(nestedShapes[0].style.fillOpacity).toBe(defaultOpacity);
                    expect(nestedShapes[1].style.fillOpacity).toBe(dimmedOpacity);
                    expect(nestedShapes[2].style.fillOpacity).toBe(defaultOpacity);
                    expect(nestedShapes[3].style.fillOpacity).toBe(dimmedOpacity);

                    // Select a new shape
                    $('.nodeGroup').last().d3Click(0, 0);
                    expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                    expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                    expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                    expect(nestedShapes[0].style.fillOpacity).toBe(dimmedOpacity);
                    expect(nestedShapes[1].style.fillOpacity).toBe(defaultOpacity);
                    expect(nestedShapes[2].style.fillOpacity).toBe(dimmedOpacity);
                    expect(nestedShapes[3].style.fillOpacity).toBe(defaultOpacity);
                    expect(hostServices.onSelect).toHaveBeenCalledWith(
                        {
                            data: [categoryIdentities[1]]
                        });

                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        }); */

        it('treemap categories and series - selection across resize', (done) => {
            let categoryIdentities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
            ];
            let seriesIdentities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('201501'),
                mocks.dataViewScopeIdentity('201502'),
                mocks.dataViewScopeIdentity('201503'),
            ];
            let onDataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['A', 'B'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: seriesIdentities[0],
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: seriesIdentities[1],
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: seriesIdentities[2],
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };
            v.onDataChanged(onDataChangedOptions);

            setTimeout(() => {
                let rootShape = $('.treemap .shapes .rootNode');
                let shapes = $('.treemap .shapes .parentGroup');
                let nestedShapes = $('.treemap .shapes .nodeGroup');

                spyOn(hostServices, 'onSelect').and.callThrough();

                // Select a major label
                $('.majorLabel').first().d3Click(0, 0);
                expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[2].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[3].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[4].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[5].style.fillOpacity).toBe(dimmedOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith(
                    {
                        visualObjects: [
                            {
                                objectName: 'dataPoint',
                                selectorsByColumn:
                                {
                                    dataMap: { 'select0': categoryIdentities[0] },
                                }
                            }
                        ]
                    });

                v.onResizing({ width: 300, height: 300 });

                setTimeout(() => {    
                    // Select a major label
                    expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                    expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                    expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                    expect(nestedShapes[0].style.fillOpacity).toBe(defaultOpacity);
                    expect(nestedShapes[1].style.fillOpacity).toBe(defaultOpacity);
                    expect(nestedShapes[2].style.fillOpacity).toBe(defaultOpacity);
                    expect(nestedShapes[3].style.fillOpacity).toBe(dimmedOpacity);
                    expect(nestedShapes[4].style.fillOpacity).toBe(dimmedOpacity);
                    expect(nestedShapes[5].style.fillOpacity).toBe(dimmedOpacity);

                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('treemap external clear selection ', (done) => {
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
            ];
            let seriesIdentities = [
                mocks.dataViewScopeIdentity('201501'),
                mocks.dataViewScopeIdentity('201502'),
                mocks.dataViewScopeIdentity('201503'),
            ];
            let onDataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['A', 'B'],
                            identity: [
                                categoryIdentities[0],
                                categoryIdentities[1],
                            ],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: seriesIdentities[0]
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: seriesIdentities[1]
                            }, {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: seriesIdentities[2]
                            }],
                            undefined,
                            dataViewMetadataCategorySeriesColumns.columns[1])
                    }
                }]
            };
            v.onDataChanged(onDataChangedOptions);

            setTimeout(() => {
                let rootShape = $('.treemap .shapes .rootNode');
                let shapes = $('.treemap .shapes .parentGroup');
                let nestedShapes = $('.treemap .shapes .nodeGroup');

                spyOn(hostServices, 'onSelect').and.callThrough();

                $('.nodeGroup').first().d3Click(0, 0);
                expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[1].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[2].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[3].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[4].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[5].style.fillOpacity).toBe(dimmedOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith(
                    {
                        visualObjects: [
                            {
                                objectName: 'dataPoint',
                                selectorsByColumn:
                                {
                                    dataMap: { 'select0': categoryIdentities[0], 'select1': seriesIdentities[0] },
                                    metadata: dataViewMetadataCategorySeriesColumns.columns[2].queryName
                                }
                            }
                        ]
                    });

                v.onClearSelection();
                expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[2].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[3].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[4].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[5].style.fillOpacity).toBe(defaultOpacity);
                done();
            }, DefaultWaitForRender);
        });
    });

    describe("treemap converter validation", () => {

        let viewport: powerbi.IViewport = {
            width: 500,
            height: 500,
        };

        it('treemap dataView multi measure',() => {
            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'EventCount',
                        queryName: 'EventCount',
                        isMeasure: true,
                        roles: { 'Values': true },
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        objects: { dataPoint: { fill: { solid: { color: 'red' } } } }
                    },
                    {
                        displayName: 'MedalCount',
                        queryName: 'MedalCount',
                        isMeasure: true,
                        roles: { 'Values': true },
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double)
                    }
                ]
            };

            let dataView = {
                metadata: metadata,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[0],
                            values: [110]
                        }, {
                            source: metadata.columns[1],
                            values: [210]
                        }])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport);
            let rootNode = treeMapData.root;
            let selectionIds: SelectionId[] = [
                SelectionId.createWithMeasure("EventCount"),
                SelectionId.createWithMeasure("MedalCount"),
            ];

            let nodes = rootNode.children;
            expect(nodes.length).toBe(2);
            expect(nodes[0].name).toBe('EventCount');
            expect(nodes[0].size).toBe(110);
            expect(nodes[0].children).not.toBeDefined();
            expect((<TreemapNode>nodes[0]).key).toBe(selectionIds[0].getKey());

            expect(nodes[1].name).toBe('MedalCount');
            expect(nodes[1].size).toBe(210);
            expect(nodes[1].children).not.toBeDefined();
            expect((<TreemapNode>nodes[1]).key).toBe(selectionIds[1].getKey());

            let shapeColors = nodes.map(n => (<TreemapNode>n).color);
            expect(shapeColors).toEqual(ArrayExtensions.distinct(shapeColors));
            expect(shapeColors[0]).toEqual('red');

            // Legend
            expect(treeMapData.legendData.title).toBe('');
            expect(treeMapData.legendData.dataPoints[0].label).toBe('EventCount');
        });

        it('treemap dataView multi measure with null values',() => {
            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'EventCost', queryName: 'EventCost', isMeasure: true, roles: { 'Values': true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), objects: { general: { formatString: '$0' } } },
                    { displayName: 'MedalCount', queryName: 'MedalCount', isMeasure: true, roles: { 'Values': true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) }
                ]
            };

            let dataView = {
                metadata: metadata,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[0],
                            values: [110]
                        }, {
                            source: metadata.columns[1],
                            values: [null]
                        }])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport);
            let rootNode = treeMapData.root;
            let selectionIds: SelectionId[] = [
                SelectionId.createWithMeasure("EventCost"),
                SelectionId.createWithMeasure("MedalCount"),
            ];

            let nodes = rootNode.children;
            expect(nodes.length).toBe(1);
            let node: TreemapNode = <TreemapNode>nodes[0];

            expect(node.name).toBe('EventCost');
            expect(node.size).toBe(110);
            expect(node.children).not.toBeDefined();
            expect(node.labelFormatString).toBe('$0');
            expect(node.key).toBe(selectionIds[0].getKey());

            // Legend
            expect(treeMapData.legendData.title).toBe('');
            expect(treeMapData.legendData.dataPoints[0].label).toBe('EventCost');
        });

        it('treemap dataView multi category single measure', () => {
            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'Continent', queryName: 'select0', roles: { "Category": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) },
                    { displayName: 'EventCost', queryName: 'select1', isMeasure: true, roles: { 'Values': true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double), objects: { general: { formatString: '$0' } } },
                ]
            };
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
                mocks.dataViewScopeIdentity('c'),
                mocks.dataViewScopeIdentity('d'),
                mocks.dataViewScopeIdentity('e'),
            ];

            let dataView: DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['Africa', 'Asia', 'Australia', 'Europe', 'North America'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[1],
                            values: [110, 120, 130, 140, 150]
                        }])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport);
            let rootNode = treeMapData.root;

            let nodes = rootNode.children;
            expect(nodes.length).toBe(5);

            let node: TreemapNode = <TreemapNode>nodes[0];
            expect(node.name).toBe('Africa');
            expect(node.size).toBe(110);
            expect(node.labelFormatString).toBe('$0');
            expect(node.children).toBeUndefined();

            node = <TreemapNode>nodes[1];
            expect(node.name).toBe('Asia');
            expect(node.size).toBe(120);
            expect(node.labelFormatString).toBe('$0');
            expect(node.children).toBeUndefined();

            node = <TreemapNode>nodes[2];
            expect(node.name).toBe('Australia');
            expect(node.size).toBe(130);
            expect(node.labelFormatString).toBe('$0');
            expect(node.children).toBeUndefined();

            node = <TreemapNode>nodes[3];
            expect(node.name).toBe('Europe');
            expect(node.size).toBe(140);
            expect(node.labelFormatString).toBe('$0');
            expect(node.children).toBeUndefined();

            node = <TreemapNode>nodes[4];
            expect(node.name).toBe('North America');
            expect(node.size).toBe(150);
            expect(node.labelFormatString).toBe('$0');
            expect(node.children).toBeUndefined();

            let shapeColors = nodes.map(n => (<TreemapNode>n).color);
            expect(shapeColors).toEqual(ArrayExtensions.distinct(shapeColors));

            // Legend
            expect(treeMapData.legendData.title).toBe('Continent');
            expect(treeMapData.legendData.dataPoints[0].label).toBe('Africa');
        });

        it('treemap dataView multi category multi measure', () => {
            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'Continent', queryName: 'select0', roles: { "Category": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) },
                    { displayName: 'EventCount', queryName: 'select1', isMeasure: true, roles: { 'Values': true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                    { displayName: 'MedalCount', queryName: 'select2', isMeasure: true, roles: { 'Values': true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) }
                ]
            };
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
                mocks.dataViewScopeIdentity('c'),
                mocks.dataViewScopeIdentity('d'),
                mocks.dataViewScopeIdentity('e'),
            ];

            let dataView: DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['Africa', 'Asia', 'Australia', 'Europe', 'North America'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[1],
                            values: [110, 120, 130, 140, 150]
                        }, {
                            source: metadata.columns[2],
                            values: [210, 220, 230, 240, 250]
                        }])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport);
            let rootNode = treeMapData.root;

            let selectionIds: SelectionId[] = categoryIdentities.map((categoryId) => SelectionId.createWithId(categoryId));

            let nodes = rootNode.children;
            expect(nodes.length).toBe(5);

            let node: TreemapNode = <TreemapNode>nodes[0];
            expect(node.name).toBe('Africa');
            expect(node.size).toBe(320);
            expect(node.children).toBeDefined();
            expect(node.children.length).toBe(2);
            expect(node.key).toBe(JSON.stringify({ nodeKey: selectionIds[0].getKey(), depth: 1 }));

            node = <TreemapNode>nodes[1];
            expect(node.name).toBe('Asia');
            expect(node.size).toBe(340);
            expect(node.children).toBeDefined();
            expect(node.children.length).toBe(2);
            expect(node.key).toBe(JSON.stringify({ nodeKey: selectionIds[1].getKey(), depth: 1 }));

            node = <TreemapNode>nodes[2];
            expect(node.name).toBe('Australia');
            expect(node.size).toBe(360);
            expect(node.children).toBeDefined();
            expect(node.children.length).toBe(2);
            expect(node.key).toBe(JSON.stringify({ nodeKey: selectionIds[2].getKey(), depth: 1 }));

            node = <TreemapNode>nodes[3];
            expect(node.name).toBe('Europe');
            expect(node.size).toBe(380);
            expect(node.children).toBeDefined();
            expect(node.children.length).toBe(2);
            expect(node.key).toBe(JSON.stringify({ nodeKey: selectionIds[3].getKey(), depth: 1 }));

            node = <TreemapNode>nodes[4];
            expect(node.name).toBe('North America');
            expect(node.size).toBe(400);
            expect(node.children).toBeDefined();
            expect(node.children.length).toBe(2);
            expect(node.key).toBe(JSON.stringify({ nodeKey: selectionIds[4].getKey(), depth: 1 }));

            let childIds = [
                SelectionId.createWithIdAndMeasure(categoryIdentities[4], 'select1'),
                SelectionId.createWithIdAndMeasure(categoryIdentities[4], 'select2'),
            ];

            let childNode: TreemapNode = <TreemapNode>node.children[0];
            expect(childNode.name).toBe('EventCount');
            expect(childNode.size).toBe(150);
            expect(childNode.children).not.toBeDefined();
            expect((<TreemapNode>childNode).key).toBe(JSON.stringify({ nodeKey: childIds[0].getKey(), depth: 2 }));
            expect(childNode.color).toBe(node.color);

            childNode = <TreemapNode>node.children[1];
            expect(childNode.name).toBe('MedalCount');
            expect(childNode.size).toBe(250);
            expect(childNode.children).not.toBeDefined();
            expect((<TreemapNode>childNode).key).toBe(JSON.stringify({ nodeKey: childIds[1].getKey(), depth: 2 }));
            expect(childNode.color).toBe(node.color);

            let shapeColors = nodes.map(n => (<TreemapNode>n).color);
            expect(shapeColors).toEqual(ArrayExtensions.distinct(shapeColors));

            // Legend
            expect(treeMapData.legendData.title).toBe('Continent');
            expect(treeMapData.legendData.dataPoints[0].label).toBe('Africa');
        });

        it('treemap dataView multi category one measure',() => {
            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'Year', queryName: 'select0', roles: { "Series": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) },
                    { displayName: 'MedalCount', queryName: 'select1', isMeasure: true, roles: { 'Values': true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) }
                ]
            };
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
                mocks.dataViewScopeIdentity('c'),
            ];

            let dataView: DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['2004', '2008', '2012'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[1],
                            values: [110, 120, 130]
                        }])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport);
            let rootNode = treeMapData.root;
            let selectionIds = [
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], metadata.columns[1].queryName),
                SelectionId.createWithIdAndMeasure(categoryIdentities[2], metadata.columns[1].queryName),
            ];

            let nodes = rootNode.children;
            expect(nodes.length).toBe(3);
            expect(nodes[0].name).toBe('2004');
            expect(nodes[0].size).toBe(110);
            expect(nodes[0].children).not.toBeDefined();
            expect((<TreemapNode>nodes[0]).key).toBe(JSON.stringify({ nodeKey: selectionIds[0].getKey(), depth: 1 }));

            expect(nodes[2].name).toBe('2012');
            expect(nodes[2].size).toBe(130);
            expect(nodes[2].children).not.toBeDefined();
            expect((<TreemapNode>nodes[2]).key).toBe(JSON.stringify({ nodeKey: selectionIds[1].getKey(), depth: 1 }));

            let shapeColors = nodes.map(n => (<TreemapNode>n).color);
            expect(shapeColors).toEqual(ArrayExtensions.distinct(shapeColors));

            // Legend
            expect(treeMapData.legendData.title).toBe('Year');
            expect(treeMapData.legendData.dataPoints[0].label).toBe('2004');

        });

        it('treemap dataView multi category/series',() => {

            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    { queryName: 'selectA', displayName: 'Continent', roles: { "Category": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) },
                    { queryName: 'selectB', displayName: 'Year', roles: { "Series": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                    { queryName: 'selectC', displayName: null, groupName: '2004', isMeasure: true, roles: { 'Values': true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                    { queryName: 'selectD', displayName: null, groupName: '2008', isMeasure: true, roles: { 'Values': true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                    { queryName: 'selectE', displayName: null, groupName: '2012', isMeasure: true, roles: { 'Values': true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) }
                ]
            };
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
                mocks.dataViewScopeIdentity('c'),
                mocks.dataViewScopeIdentity('d'),
                mocks.dataViewScopeIdentity('e'),
            ];
            let seriesIdentities = [
                mocks.dataViewScopeIdentity(2004),
                mocks.dataViewScopeIdentity(2008),
                mocks.dataViewScopeIdentity(2012),
            ];

            let dataView: DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['Africa', 'Asia', 'Australia', 'Europe', 'North America'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[2],
                            values: [110, 120, 130, 140, 150],
                            identity: seriesIdentities[0],
                        }, {
                            source: metadata.columns[3],
                            values: [210, 220, 230, 240, 250],
                            identity: seriesIdentities[1],
                        }, {
                            source: metadata.columns[4],
                            values: [310, 320, 330, 340, 350],
                            identity: seriesIdentities[2],
                        }],
                        undefined,
                        metadata.columns[1])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport);
            let rootNode = treeMapData.root;
            let selectionIds: SelectionId[] = [
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(metadata.columns[0].queryName, categoryIdentities[0]), null),
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(metadata.columns[0].queryName, categoryIdentities[4]), null),
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelectorForColumn(metadata.columns[1].queryName, seriesIdentities[2], buildSelectorForColumn(metadata.columns[0].queryName, categoryIdentities[4])), metadata.columns[4].queryName),
            ];

            let nodes = rootNode.children;
            expect(nodes.length).toBe(5);
            expect(nodes[0].name).toBe('Africa');
            expect(nodes[0].size).toBe(630);
            expect(nodes[0].children).toBeDefined();
            expect(nodes[0].children.length).toBe(3);
            expect((<TreemapNode>nodes[0]).key).toBe(JSON.stringify({ nodeKey: selectionIds[0].getKey(), depth: 1 }));

            let lastNode = (<TreemapNode>nodes[4]);
            expect(lastNode.name).toBe('North America');
            expect(lastNode.size).toBe(750);
            expect(lastNode.children).toBeDefined();
            expect(lastNode.children.length).toBe(3);
            expect(lastNode.key).toBe(JSON.stringify({ nodeKey: selectionIds[1].getKey(), depth: 1 }));

            let childNodes = lastNode.children;
            expect(childNodes[2].name).toBe('2012');
            expect(childNodes[2].size).toBe(350);
            expect(childNodes[2].children).not.toBeDefined();
            expect((<TreemapNode>childNodes[2]).key).toBe(JSON.stringify({ nodeKey: selectionIds[2].getKey(), depth: 2 }));
            childNodes.forEach(n => expect((<TreemapNode>n).color).toBe(lastNode.color));

            let shapeColors = nodes.map(n => (<TreemapNode>n).color);
            expect(shapeColors).toEqual(ArrayExtensions.distinct(shapeColors));

            // Legend
            expect(treeMapData.legendData.title).toBe('Continent');
            expect(treeMapData.legendData.dataPoints[0].label).toBe('Africa');
        });

        it('selection state set on converter result', () => {

            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    { queryName: 'selectA', displayName: 'Continent', roles: { "Category": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) },
                    { queryName: 'selectB', displayName: 'Year', roles: { "Series": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                    { queryName: 'selectC', displayName: null, groupName: '2004', isMeasure: true, roles: { 'Values': true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                    { queryName: 'selectD', displayName: null, groupName: '2008', isMeasure: true, roles: { 'Values': true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                    { queryName: 'selectE', displayName: null, groupName: '2012', isMeasure: true, roles: { 'Values': true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) }
                ]
            };
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
                mocks.dataViewScopeIdentity('c'),
                mocks.dataViewScopeIdentity('d'),
                mocks.dataViewScopeIdentity('e'),
            ];
            let seriesIdentities = [
                mocks.dataViewScopeIdentity(2004),
                mocks.dataViewScopeIdentity(2008),
                mocks.dataViewScopeIdentity(2012),
            ];

            let dataView: DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['Africa', 'Asia', 'Australia', 'Europe', 'North America'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[2],
                            values: [110, 120, 130, 140, 150],
                            identity: seriesIdentities[0],
                        }, {
                            source: metadata.columns[3],
                            values: [210, 220, 230, 240, 250],
                            identity: seriesIdentities[1],
                        }, {
                            source: metadata.columns[4],
                            values: [310, 320, 330, 340, 350],
                            identity: seriesIdentities[2],
                        }],
                        undefined,
                        metadata.columns[1])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let interactivityService = <powerbi.visuals.InteractivityService>powerbi.visuals.createInteractivityService(powerbitests.mocks.createVisualHostServices());
            let categorySelectionId = SelectionId.createWithId(categoryIdentities[1]);
            interactivityService['selectedIds'] = [categorySelectionId];

            let treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, interactivityService, viewport);

            expect(treeMapData.legendData.dataPoints[0].selected).toBe(false);
            expect(treeMapData.legendData.dataPoints[1].selected).toBe(true);
            expect(treeMapData.legendData.dataPoints[2].selected).toBe(false);
            expect(treeMapData.legendData.dataPoints[3].selected).toBe(false);
            expect(treeMapData.legendData.dataPoints[4].selected).toBe(false);

            let selectedNode = <TreemapNode>treeMapData.root.children[1];
            expect(selectedNode.selected).toBe(true);
            for (let yearNode of selectedNode.children) {
                expect((<TreemapNode>yearNode).selected).toBe(true);
            }

            let notSelected: TreemapNode[] = [].concat(treeMapData.root.children[0], treeMapData.root.children.slice(2));
            for (let continentNode of notSelected) {
                expect(continentNode.selected).toBe(false);
                for (let yearNode of continentNode.children) {
                    expect((<TreemapNode>yearNode).selected).toBe(false);
                }
            }
        });

        it('treemap dataView category static series with null values',() => {
            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'Continent', queryName: 'select1', roles: { "Category": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) },
                    { displayName: 'Sales', isMeasure: true, roles: { "Values": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                    { displayName: 'Profit', isMeasure: true, roles: { "Values": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                    { displayName: 'Revenue', isMeasure: true, roles: { "Values": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) }
                ]
            };
            let categoryIdentities = [
                mocks.dataViewScopeIdentity(null),
                mocks.dataViewScopeIdentity('b'),
                mocks.dataViewScopeIdentity('c'),
                mocks.dataViewScopeIdentity('d'),
                mocks.dataViewScopeIdentity('e'),
            ];

            let dataView: DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: [null, 'Asia', 'Australia', 'Europe', 'North America'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[1],
                            values: [null, 120, 130, 140, null],
                        }, {
                            source: metadata.columns[2],
                            values: [210, 220, null, 240, null],
                        }, {
                            source: metadata.columns[3],
                            values: [null, 320, 330, 340, null],
                        }])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport);
            let rootNode = treeMapData.root;

            let nodes = rootNode.children;
            expect(nodes.length).toBe(4);
            expect(nodes[0].name).toBe('(Blank)');
            expect(nodes[0].size).toBe(210);
            expect(nodes[0].children).toBeDefined();
            expect(nodes[0].children.length).toBe(1);
            expect((<TreemapNode>nodes[0]).key).toBe(JSON.stringify({ nodeKey: SelectionId.createWithId(categoryIdentities[0]).getKey(), depth: 1 }));

            let shapeColors = nodes.map(n => (<TreemapNode>n).color);
            expect(shapeColors).toEqual(ArrayExtensions.distinct(shapeColors));

            // Legend
            expect(treeMapData.legendData.title).toBe('Continent');
            expect(treeMapData.legendData.dataPoints[0].label).toBe('(Blank)');
            expect(treeMapData.legendData.dataPoints[1].label).toBe('Asia');

            // Tooltips
            let node1: TreemapNode = <TreemapNode>rootNode.children[0];
            let node11: TreemapNode = <TreemapNode>rootNode.children[0].children[0];
            let node2: TreemapNode = <TreemapNode>rootNode.children[1];
            expect(node1.tooltipInfo).toEqual([{ displayName: "Continent", value: "(Blank)" }]);
            expect(node11.tooltipInfo).toEqual([{ displayName: "Continent", value: "(Blank)" }, { displayName: "Profit", value: "210" }]);
            expect(node1.children.length).toBe(1);
            expect(node2.children.length).toBe(3);
        });

        it('treemap dataView category and dynamic series with null values', () => {
            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'Continent', queryName: 'select1', roles: { "Category": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) },
                    { displayName: 'Year', roles: { "Series": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                    { displayName: 'Sales', groupName: null, isMeasure: true, roles: { "Values": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                    { displayName: 'Sales', groupName: '2008', isMeasure: true, roles: { "Values": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                    { displayName: 'Sales', groupName: '2012', isMeasure: true, roles: { "Values": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) }
                ]
            };
            let categoryIdentities = [
                mocks.dataViewScopeIdentity(null),
                mocks.dataViewScopeIdentity('b'),
                mocks.dataViewScopeIdentity('c'),
                mocks.dataViewScopeIdentity('d'),
                mocks.dataViewScopeIdentity('e'),
            ];
            let seriesIdentities = [
                mocks.dataViewScopeIdentity(null),
                mocks.dataViewScopeIdentity(2008),
                mocks.dataViewScopeIdentity(2012),
            ];

            let dataView: DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: [null, 'Asia', 'Australia', 'Europe', 'North America'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[2],
                            values: [null, 120, 130, 140, null],
                            identity: seriesIdentities[0],
                        }, {
                            source: metadata.columns[3],
                            values: [210, 220, null, 240, null],
                            identity: seriesIdentities[1],
                        }, {
                            source: metadata.columns[4],
                            values: [null, 320, 330, 340, null],
                            identity: seriesIdentities[2],
                        }],
                        [seriesColumnRef],
                        metadata.columns[1])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport);
            let rootNode = treeMapData.root;

            let nodes = rootNode.children;
            expect(nodes.length).toBe(4);
            expect(nodes[0].name).toBe('(Blank)');
            expect(nodes[0].size).toBe(210);
            expect(nodes[0].children).toBeDefined();
            expect(nodes[0].children.length).toBe(1);
            expect((<TreemapNode>nodes[0]).key).toBe(JSON.stringify({ nodeKey: SelectionId.createWithId(categoryIdentities[0]).getKey(), depth: 1 }));

            let shapeColors = nodes.map(n => (<TreemapNode>n).color);
            expect(shapeColors).toEqual(ArrayExtensions.distinct(shapeColors));

            // Legend
            expect(treeMapData.legendData.title).toBe('Continent');
            expect(treeMapData.legendData.dataPoints[0].label).toBe('(Blank)');
            expect(treeMapData.legendData.dataPoints[1].label).toBe('Asia');

            // Tooltips
            let node1: TreemapNode = <TreemapNode>rootNode.children[0];
            let node11: TreemapNode = <TreemapNode>rootNode.children[0].children[0];
            let node2: TreemapNode = <TreemapNode>rootNode.children[1];
            let node21: TreemapNode = <TreemapNode>rootNode.children[1].children[0];
            let node22: TreemapNode = <TreemapNode>rootNode.children[1].children[1];

            expect(node1.tooltipInfo).toEqual([{ displayName: "Continent", value: "(Blank)" }]);
            expect(node11.tooltipInfo).toEqual([{ displayName: "Continent", value: "(Blank)" }, { displayName: "Year", value: "2008" }, { displayName: "Sales", value: "210" }]);
            expect(node21.tooltipInfo).toEqual([{ displayName: "Continent", value: "Asia" }, { displayName: "Year", value: "(Blank)" }, { displayName: "Sales", value: "120" }]);
            expect(node22.tooltipInfo).toEqual([{ displayName: "Continent", value: "Asia" }, { displayName: "Year", value: "2008" }, { displayName: "Sales", value: "220" }]);

            expect(node1.children.length).toBe(1);
            expect(node2.children.length).toBe(3);
        });

        it('treemap dataView category/series on the same column', () => {
            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'Continent', queryName: 'select1', roles: { "Category": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) },
                    { displayName: 'Continent', queryName: 'select1', roles: { "Series": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) },
                    { displayName: 'Sales', groupName: 'a', isMeasure: true, roles: { "Values": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                    { displayName: 'Sales', groupName: 'b', isMeasure: true, roles: { "Values": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                    { displayName: 'Sales', groupName: 'c', isMeasure: true, roles: { "Values": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) }
                ]
            };
            let categoryIdentities = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
                mocks.dataViewScopeIdentity('c'),
            ];

            let dataView: DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['Asia', 'Australia', 'Europe'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[2],
                            values: [null, 120, 130],
                            identity: categoryIdentities[0],
                        }, {
                            source: metadata.columns[3],
                            values: [210, 220, null],
                            identity: categoryIdentities[1],
                        }, {
                            source: metadata.columns[4],
                            values: [null, 320, 330],
                            identity: categoryIdentities[2],
                        }],
                        [seriesColumnRef],
                        metadata.columns[0])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport);
            let rootNode = treeMapData.root;

            // Tooltips
            let node1: TreemapNode = <TreemapNode>rootNode.children[0];
            let node11: TreemapNode = <TreemapNode>rootNode.children[0].children[0];
            let node2: TreemapNode = <TreemapNode>rootNode.children[1];
            expect(node1.tooltipInfo).toEqual([{ displayName: "Continent", value: 'Asia' }]);
            expect(node11.tooltipInfo).toEqual([{ displayName: "Continent", value: 'Asia' },{ displayName: "Sales", value: "210" }]);
            expect(node1.children.length).toBe(1);
            expect(node2.children.length).toBe(3);
        });

        it('treemap non-categorical multi-measure tooltip values test',() => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'a', queryName: 'a', isMeasure: true, roles: { 'Values': true } },
                    { displayName: 'b', queryName: 'b', isMeasure: true, roles: { 'Values': true } },
                    { displayName: 'c', queryName: 'c', isMeasure: true, roles: { 'Values': true } }
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

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport).root;

            let node1: TreemapNode = <TreemapNode>rootNode.children[0];
            let node2: TreemapNode = <TreemapNode>rootNode.children[1];
            let node3: TreemapNode = <TreemapNode>rootNode.children[2];

            expect(node1.tooltipInfo).toEqual([{ displayName: 'a', value: '1' }]);
            expect(node2.tooltipInfo).toEqual([{ displayName: 'b', value: '2' }]);
            expect(node3.tooltipInfo).toEqual([{ displayName: 'c', value: '3' }]);
        });

        it('treemap non-categorical multi-measure tooltip values test-has negative value', () => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'a', queryName: 'a', isMeasure: true, roles: { 'Values': true } },
                    { displayName: 'b', queryName: 'b', isMeasure: true, roles: { 'Values': true } },
                    { displayName: 'c', queryName: 'c', isMeasure: true, roles: { 'Values': true } }
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
                            values: [-2],
                        },
                        {
                            source: dataViewMetadata.columns[2],
                            values: [-3],
                        }
                    ])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport).root;

            let node: TreemapNode = <TreemapNode>rootNode.children[0];
            let length: number = rootNode.children.length;

            expect(node.tooltipInfo).toEqual([{ displayName: 'a', value: '1' }]);
            expect(length).toEqual(1);
        });

        it('treemap non-categorical multi-measure tooltip values test-all negative', () => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'a', queryName: 'a', isMeasure: true, roles: { 'Values': true } },
                    { displayName: 'b', queryName: 'b', isMeasure: true, roles: { 'Values': true } },
                    { displayName: 'c', queryName: 'c', isMeasure: true, roles: { 'Values': true } }
                ]
            };

            let dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[0],
                            values: [-1],
                        },
                        {
                            source: dataViewMetadata.columns[1],
                            values: [-2],
                        },
                        {
                            source: dataViewMetadata.columns[2],
                            values: [-3],
                        }
                    ])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport).root;

            let node1: TreemapNode = <TreemapNode>rootNode.children[0];
            let node2: TreemapNode = <TreemapNode>rootNode.children[1];
            let node3: TreemapNode = <TreemapNode>rootNode.children[2];

            expect(node1.tooltipInfo).toEqual([{ displayName: 'a', value: '-1' }]);
            expect(node2.tooltipInfo).toEqual([{ displayName: 'b', value: '-2' }]);
            expect(node3.tooltipInfo).toEqual([{ displayName: 'c', value: '-3' }]);
        });

        it('validate tooltip info not being created when tooltips are disabled', () => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'a', queryName: 'a', isMeasure: true, roles: { 'Values': true } },
                    { displayName: 'b', queryName: 'b', isMeasure: true, roles: { 'Values': true } },
                    { displayName: 'c', queryName: 'c', isMeasure: true, roles: { 'Values': true } }
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

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport, undefined, false).root;

            let node1: TreemapNode = <TreemapNode>rootNode.children[0];
            let node2: TreemapNode = <TreemapNode>rootNode.children[1];
            let node3: TreemapNode = <TreemapNode>rootNode.children[2];

            expect(node1.tooltipInfo).toBeUndefined();
            expect(node2.tooltipInfo).toBeUndefined();
            expect(node3.tooltipInfo).toBeUndefined();
        });

        it('validate tooltip info not being created when tooltips are disabled and tooltipBuckets are enabled', () => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'a', queryName: 'a', isMeasure: true, roles: { 'Values': true } },
                    { displayName: 'b', queryName: 'b', isMeasure: true, roles: { 'Values': true } },
                    { displayName: 'c', queryName: 'c', isMeasure: true, roles: { 'Values': true } },
                    { displayName: 'd', queryName: 'd', isMeasure: true, roles: { 'Tooltips': true } }
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

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, /*interactivityService*/null, viewport, /*legendObjectProperties*/undefined, /*tooltipsEnabled*/false, /*tooltipBucketEnabled*/true).root;

            let node1: TreemapNode = <TreemapNode>rootNode.children[0];
            let node2: TreemapNode = <TreemapNode>rootNode.children[1];
            let node3: TreemapNode = <TreemapNode>rootNode.children[2];

            expect(node1.tooltipInfo).toBeUndefined();
            expect(node2.tooltipInfo).toBeUndefined();
            expect(node3.tooltipInfo).toBeUndefined();
        });

        it('treemap dataView multi measure',() => {
            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'EventCount', queryName: 'select1', isMeasure: true, roles: { 'Values': true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                    { displayName: 'MedalCount', queryName: 'select2', isMeasure: true, roles: { 'Values': true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) }
                ]
            };
            let dataView: DataView = {
                metadata: metadata,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[0],
                            values: [110]
                        }, {
                            source: metadata.columns[1],
                            values: [210]
                        }])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport);
            let rootNode = treeMapData.root;

            let selectionIds: SelectionId[] = metadata.columns.map((measure) => SelectionId.createWithMeasure(measure.queryName));

            let nodes = rootNode.children;
            expect(nodes.length).toBe(2);

            let node: TreemapNode = <TreemapNode>nodes[0];
            expect(node.name).toBe('EventCount');
            expect(node.size).toBe(110);
            expect(node.children).not.toBeDefined();
            expect(node.key).toBe(selectionIds[0].getKey());

            node = <TreemapNode>nodes[1];
            expect(node.name).toBe('MedalCount');
            expect(node.size).toBe(210);
            expect(node.children).not.toBeDefined();
            expect(node.key).toBe(selectionIds[1].getKey());

            let shapeColors = nodes.map(n => (<TreemapNode>n).color);
            expect(shapeColors).toEqual(ArrayExtensions.distinct(shapeColors));

            // Legend
            expect(treeMapData.legendData.title).toBe('');
            expect(treeMapData.legendData.dataPoints[0].label).toBe('EventCount');
            expect(treeMapData.legendData.dataPoints[1].label).toBe('MedalCount');
        });

        it('treemap dataView single measure',() => {
            let metadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'EventCount', queryName: 'select1', isMeasure: true, roles: { 'Values': true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) }
                ]
            };
            let dataView: DataView = {
                metadata: metadata,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[0],
                            values: [110],
                        }
                    ]),
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport);
            let rootNode = treeMapData.root;

            let selectionIds: SelectionId[] = metadata.columns.map((measure) => SelectionId.createWithMeasure(measure.queryName));

            let nodes = rootNode.children;
            expect(nodes.length).toBe(1);

            let node: TreemapNode = <TreemapNode>nodes[0];
            expect(node.name).toBe('EventCount');
            expect(node.size).toBe(110);
            expect(node.children).not.toBeDefined();
            expect(node.key).toBe(selectionIds[0].getKey());

            let shapeColors = nodes.map(n => (<TreemapNode>n).color);
            expect(shapeColors).toEqual(ArrayExtensions.distinct(shapeColors));

            // Legend
            expect(treeMapData.legendData.title).toBe('');
            expect(treeMapData.legendData.dataPoints[0].label).toBe('EventCount');
        });

        it("treemap mutil-measures with highlights tooltip data test", () => {
            let dataView: DataView = {
                metadata: dataViewMetadataCategoryAndMeasures,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategoryAndMeasures.columns[1],
                            values: [110],
                            highlights: [60]
                        }, {
                            source: dataViewMetadataCategoryAndMeasures.columns[2],
                            values: [210],
                            highlights: [140]
                        }])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport).root;
            let node1: TreemapNode = <TreemapNode>rootNode.children[0];
            let node2: TreemapNode = <TreemapNode>rootNode.children[1];

            expect(node1.tooltipInfo).toEqual(node1.highlightedTooltipInfo);
            expect(node1.highlightedTooltipInfo).toEqual([{ displayName: "BugsFiled", value: "110" }, { displayName: 'Highlighted', value: '60' }]);

            expect(node2.tooltipInfo).toEqual(node2.highlightedTooltipInfo);
            expect(node2.highlightedTooltipInfo).toEqual([{ displayName: "BugsFixed", value: "210" }, { displayName: 'Highlighted', value: '140' }]);
        });

        it("treemap mutil-measures all negative values with highlights tooltip data test", () => {
            let dataView: DataView = {
                metadata: dataViewMetadataCategoryAndMeasures,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategoryAndMeasures.columns[1],
                            values: [-110],
                            highlights: [-60]
                        }, {
                            source: dataViewMetadataCategoryAndMeasures.columns[2],
                            values: [-210],
                            highlights: [-140]
                        }])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport).root;
            let node1: TreemapNode = <TreemapNode>rootNode.children[0];
            let node2: TreemapNode = <TreemapNode>rootNode.children[1];

            expect(node1.tooltipInfo).toEqual(node1.highlightedTooltipInfo);
            expect(node1.highlightedTooltipInfo).toEqual([{ displayName: "BugsFiled", value: "-110" }, { displayName: 'Highlighted', value: '-60' }]);

            expect(node2.tooltipInfo).toEqual(node2.highlightedTooltipInfo);
            expect(node2.highlightedTooltipInfo).toEqual([{ displayName: "BugsFixed", value: "-210" }, { displayName: 'Highlighted', value: '-140' }]);
        });

        it("treemap mutil-measures all negative values with overflow highlights tooltip data test", () => {
            let dataView: DataView = {
                metadata: dataViewMetadataCategoryAndMeasures,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategoryAndMeasures.columns[1],
                            values: [-110],
                            highlights: [-60]
                        }, {
                            source: dataViewMetadataCategoryAndMeasures.columns[2],
                            values: [-210],
                            highlights: [-240]
                        }])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport).root;
            let node1: TreemapNode = <TreemapNode>rootNode.children[0];
            let node2: TreemapNode = <TreemapNode>rootNode.children[1];

            expect(node1.tooltipInfo).toEqual(node1.highlightedTooltipInfo);
            expect(node1.highlightedTooltipInfo).toEqual([{ displayName: "BugsFiled", value: "-60" }]);

            expect(node2.tooltipInfo).toEqual(node2.highlightedTooltipInfo);
            expect(node2.highlightedTooltipInfo).toEqual([{ displayName: "BugsFixed", value: "-240" }]);
        });

        it("treemap mutil-measures has negative value with highlights tooltip data test", () => {
            let dataView: DataView = {
                metadata: dataViewMetadataCategoryAndMeasures,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategoryAndMeasures.columns[1],
                            values: [110],
                            highlights: [-60]
                        }, {
                            source: dataViewMetadataCategoryAndMeasures.columns[2],
                            values: [210],
                            highlights: [140]
                        }])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport).root;
            let node1: TreemapNode = <TreemapNode>rootNode.children[0];
            let node2: TreemapNode = <TreemapNode>rootNode.children[1];

            expect(node1.tooltipInfo).toEqual(node1.highlightedTooltipInfo);
            expect(node1.highlightedTooltipInfo).toEqual([{ displayName: "BugsFiled", value: "110" }, { displayName: 'Highlighted', value: '-60' }]);

            expect(node2.tooltipInfo).toEqual(node2.highlightedTooltipInfo);
            expect(node2.highlightedTooltipInfo).toEqual([{ displayName: "BugsFixed", value: "210" }, { displayName: 'Highlighted', value: '140' }]);
        });

        it("treemap mutil-measures has negative value with overflow highlights tooltip data test", () => {
            let dataView: DataView = {
                metadata: dataViewMetadataCategoryAndMeasures,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategoryAndMeasures.columns[1],
                            values: [110],
                            highlights: [-60]
                        }, {
                            source: dataViewMetadataCategoryAndMeasures.columns[2],
                            values: [210],
                            highlights: [240]
                        }])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport).root;
            let node1: TreemapNode = <TreemapNode>rootNode.children[0];

            expect(node1.tooltipInfo).toEqual(node1.highlightedTooltipInfo);
            expect(node1.highlightedTooltipInfo).toEqual([{ displayName: "BugsFixed", value: "240" }]);
        });

        it("treemap categories and measures with highlights tooltip data test", () => {
            let dataView: DataView = {
                metadata: dataViewMetadataCategoryAndMeasures,
                categorical: {
                    categories: [{
                        source: dataViewMetadataCategoryAndMeasures.columns[0],
                        values: ['Front end', 'Back end'],
                        identity: [
                            mocks.dataViewScopeIdentity('f'),
                            mocks.dataViewScopeIdentity('b'),
                        ],
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategoryAndMeasures.columns[1],
                            values: [110, 120],
                            highlights: [60, 60]
                        }, {
                            source: dataViewMetadataCategoryAndMeasures.columns[2],
                            values: [210, 220],
                            highlights: [140, 200]
                        }])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport).root;
            let node1: TreemapNode = <TreemapNode>rootNode.children[0].children[0];
            let node2: TreemapNode = <TreemapNode>rootNode.children[0].children[1];
            let node3: TreemapNode = <TreemapNode>rootNode.children[1].children[0];
            let node4: TreemapNode = <TreemapNode>rootNode.children[1].children[1];

            expect(node1.tooltipInfo).toEqual(node1.highlightedTooltipInfo);
            expect(node1.highlightedTooltipInfo).toEqual([{ displayName: "Area", value: "Front end" }, { displayName: "BugsFiled", value: "110" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "60" }]);

            expect(node2.tooltipInfo).toEqual(node2.highlightedTooltipInfo);
            expect(node2.highlightedTooltipInfo).toEqual([{ displayName: "Area", value: "Front end" }, { displayName: "BugsFixed", value: "210" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "140" }]);

            expect(node3.tooltipInfo).toEqual(node3.highlightedTooltipInfo);
            expect(node3.highlightedTooltipInfo).toEqual([{ displayName: "Area", value: "Back end" }, { displayName: "BugsFiled", value: "120" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "60" }]);

            expect(node4.tooltipInfo).toEqual(node4.highlightedTooltipInfo);
            expect(node4.highlightedTooltipInfo).toEqual([{ displayName: "Area", value: "Back end" }, { displayName: "BugsFixed", value: "220" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "200" }]);
        });

        it("treemap categories and measures (has null) with highlights (not null) tooltip data test", () => {
            // Treat this case as highlight overflow
            let dataView: DataView = {
                metadata: dataViewMetadataCategoryAndMeasures,
                categorical: {
                    categories: [{
                        source: dataViewMetadataCategoryAndMeasures.columns[0],
                        values: ['Front end', 'Back end'],
                        identity: [
                            mocks.dataViewScopeIdentity('f'),
                            mocks.dataViewScopeIdentity('b'),
                        ],
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategoryAndMeasures.columns[1],
                            values: [110, 120],
                            highlights: [60, 60]
                        }, {
                            source: dataViewMetadataCategoryAndMeasures.columns[2],
                            values: [210, null],
                            highlights: [140, 200]
                        }])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport).root;
            let node1: TreemapNode = <TreemapNode>rootNode.children[0].children[0];
            let node2: TreemapNode = <TreemapNode>rootNode.children[0].children[1];
            let node3: TreemapNode = <TreemapNode>rootNode.children[1].children[0];
            let node4: TreemapNode = <TreemapNode>rootNode.children[1].children[1];

            expect(rootNode.children[0].children.length).toBe(2);
            expect(rootNode.children[1].children.length).toBe(2);
            expect(node1.tooltipInfo).toEqual(node1.highlightedTooltipInfo);
            expect(node1.highlightedTooltipInfo).toEqual([{ displayName: "Area", value: "Front end" }, { displayName: "BugsFiled", value: "60" }]);

            expect(node2.tooltipInfo).toEqual(node2.highlightedTooltipInfo);
            expect(node2.highlightedTooltipInfo).toEqual([{ displayName: "Area", value: "Front end" }, { displayName: "BugsFixed", value: "140" }]);

            expect(node3.tooltipInfo).toEqual(node3.highlightedTooltipInfo);
            expect(node3.highlightedTooltipInfo).toEqual([{ displayName: "Area", value: "Back end" }, { displayName: "BugsFiled", value: "60" }]);

            expect(node4.tooltipInfo).toEqual(node4.highlightedTooltipInfo);
            expect(node4.highlightedTooltipInfo).toEqual([{ displayName: "Area", value: "Back end" }, { displayName: "BugsFixed", value: "200" }]);

        });

        it("treemap gradient color test",() => {
            let dataPointColors = ["#d9f2fb", "#ff557f", "#b1eab7"];
            let objectDefinitions: powerbi.DataViewObjects[] = [
                { dataPoint: { fill: { solid: { color: dataPointColors[0] } } } },
                { dataPoint: { fill: { solid: { color: dataPointColors[1] } } } },
                { dataPoint: { fill: { solid: { color: dataPointColors[2] } } } }
            ];

            let dataViewGradientMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1' },
                    { displayName: 'col2', isMeasure: true, roles: { 'Values': true }},
                    { displayName: 'col3', isMeasure: true, roles: { 'Gradient': true } }
                ]
            };

            let dataView: DataView = {
                metadata: dataViewGradientMetadata,
                categorical: {
                    categories: [{
                        source: dataViewGradientMetadata.columns[0],
                        values: ['Front end', 'Back end'],
                        objects: objectDefinitions,
                        identity: [
                            mocks.dataViewScopeIdentity('f'),
                            mocks.dataViewScopeIdentity('b'),
                        ]
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewGradientMetadata.columns[1],
                            values: [110, 120],
                            highlights: [60, 60]
                        }, {
                            source: dataViewGradientMetadata.columns[2],
                            values: [210, 220],
                            highlights: [140, 200]
                        }])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport, null).root;
            let node1: TreemapNode = <TreemapNode>rootNode.children[0];
            let node2: TreemapNode = <TreemapNode>rootNode.children[1];

            helpers.assertColorsMatch(node1.color, dataPointColors[0]);
            helpers.assertColorsMatch(node2.color, dataPointColors[1]);
        });

        it("treemap gradient color test - validate tooltip", () => {
            let dataPointColors = ["#d9f2fb", "#ff557f", "#b1eab7"];
            let objectDefinitions: powerbi.DataViewObjects[] = [
                { dataPoint: { fill: { solid: { color: dataPointColors[0] } } } },
                { dataPoint: { fill: { solid: { color: dataPointColors[1] } } } },
                { dataPoint: { fill: { solid: { color: dataPointColors[2] } } } }
            ];

            let dataViewGradientMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1' },
                    { displayName: 'col2', isMeasure: true, roles: { 'Values': true } },
                    { displayName: 'col3', roles: { 'Gradient': true } }
                ]
            };

            let dataView: DataView = {
                metadata: dataViewGradientMetadata,
                categorical: {
                    categories: [{
                        source: dataViewGradientMetadata.columns[0],
                        values: ['Front end', 'Back end'],
                        objects: objectDefinitions,
                        identity: [
                            mocks.dataViewScopeIdentity('f'),
                            mocks.dataViewScopeIdentity('b'),
                        ]
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewGradientMetadata.columns[1],
                            values: [110, 120]
                        }, {
                            source: dataViewGradientMetadata.columns[2],
                            values: [210, 220]
                        }])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport, null).root;
            let node1: TreemapNode = <TreemapNode>rootNode.children[0];
            let node2: TreemapNode = <TreemapNode>rootNode.children[1];

            expect(node1.tooltipInfo).toEqual([{ displayName: 'col1', value: 'Front end' }, { displayName: 'col2', value: '110' }, { displayName: 'col3', value: '210' }]);
            expect(node2.tooltipInfo).toEqual([{ displayName: 'col1', value: 'Back end' }, { displayName: 'col2', value: '120' }, { displayName: 'col3', value: '220' }]);
        });

        it("treemap Gradient and Y have the index - validate tooltip", () => {
            let dataPointColors = ["#d9f2fb", "#ff557f", "#b1eab7"];
            let objectDefinitions: powerbi.DataViewObjects[] = [
                { dataPoint: { fill: { solid: { color: dataPointColors[0] } } } },
                { dataPoint: { fill: { solid: { color: dataPointColors[1] } } } },
                { dataPoint: { fill: { solid: { color: dataPointColors[2] } } } }
            ];

            let dataViewGradientMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1'},
                    { displayName: 'col2', isMeasure: true, roles: { 'Gradient': true } },
                    { displayName: 'col3', isMeasure: true, roles: { 'Values': true } }
                ]
            };

            let dataView: DataView = {
                metadata: dataViewGradientMetadata,
                categorical: {
                    categories: [{
                        source: dataViewGradientMetadata.columns[0],
                        values: ['Front end', 'Back end'],
                        objects: objectDefinitions,
                        identity: [
                            mocks.dataViewScopeIdentity('f'),
                            mocks.dataViewScopeIdentity('b'),
                        ]
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewGradientMetadata.columns[1],
                            values: [110, 120],
                            highlights: [60, 60]
                        }, {
                            source: dataViewGradientMetadata.columns[2],
                            values: [210, 220],
                            highlights: [140, 200]
                        }])
                }
            };

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport, null).root;
            let node1: TreemapNode = <TreemapNode>rootNode.children[0];
            let node2: TreemapNode = <TreemapNode>rootNode.children[1];

            helpers.assertColorsMatch(node1.color, dataPointColors[0]);
            helpers.assertColorsMatch(node2.color, dataPointColors[1]);
            expect(node1.tooltipInfo).toEqual([{ displayName: 'col1', value: 'Front end' }, { displayName: 'col3', value: '210' }, { displayName: 'Highlighted', value: '140' }, { displayName: 'col2', value: '110' }]);
            expect(node2.tooltipInfo).toEqual([{ displayName: 'col1', value: 'Back end' }, { displayName: 'col3', value: '220' }, { displayName: 'Highlighted', value: '200' }, { displayName: 'col2', value: '120' }]);
        });

        it('treemap non-categorical series, formatted color and tooltips', () => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1', queryName: 'col1', roles: { 'Series': true } },
                    { displayName: 'col2', queryName: 'col2', groupName: 'a', isMeasure: true, roles: { 'Values': true } },
                    { displayName: 'col2', queryName: 'col2', groupName: 'b', isMeasure: true, roles: { 'Values': true } },
                ]
            };

            let dataView: powerbi.DataView = {
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[1],
                            values: [200],
                            identity: mocks.dataViewScopeIdentity('a'),
                        }, {
                            source: dataViewMetadata.columns[2],
                            values: [300],
                            identity: mocks.dataViewScopeIdentity('b'),
                        }
                    ],
                        [seriesColumnRef],
                        dataViewMetadata.columns[0])
                },
                metadata: dataViewMetadata,
            };
            
            let groupedValues = dataView.categorical.values.grouped();
            groupedValues[0].objects = { dataPoint: { fill: { solid: { color: '#00FF00' } } } };
            groupedValues[1].objects = { dataPoint: { fill: { solid: { color: '#FF0000' } } } };
            dataView.categorical.values.grouped = () => groupedValues;

            let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport, null).root;
            let node1: TreemapNode = <TreemapNode>rootNode.children[0];
            let node2: TreemapNode = <TreemapNode>rootNode.children[1];

            helpers.assertColorsMatch(node1.color, '#00FF00');
            helpers.assertColorsMatch(node2.color, '#FF0000');
            expect(node1.tooltipInfo).toEqual([{ displayName: 'col1', value: 'a' }, { displayName: 'col2', value: '200' }]);
            expect(node2.tooltipInfo).toEqual([{ displayName: 'col1', value: 'b' }, { displayName: 'col2', value: '300' }]);
        });

        describe("Field used a gradient and value", () => {
            let dataBuilder: TreemapDataBuilder;

            beforeEach(() => {
                dataBuilder = new TreemapDataBuilder();
            });
            
            it("Categorial treemap with gradient (multiple value columns)", () => {

                let dataView = dataBuilder.build(true, true);
                let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
                let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

                // Make sure the number of categories in the node match the number of categories in the data view
                let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport, null).root;
                expect(rootNode.children.length).toEqual(dataView.categorical.categories[0].values.length);
            });

            it("Categorial treemap with gradient (single value column)", () => {

                let dataView = dataBuilder.withOneValueColumn().build(true, true);
                let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
                let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

                // Make sure the number of categories in the node match the number of categories in the data view
                let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport, null).root;
                expect(rootNode.children.length).toEqual(dataView.categorical.categories[0].values.length);
            });

            it("Non-categorial treemap with gradient", () => {

                let dataView = dataBuilder.withSingleValues().withoutCategory().build(true, true);
                let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
                let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

                // Make sure we're getting the right number of values back
                let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport, null).root;
                expect(rootNode.children.length).toEqual(dataView.categorical.values.length);
            });
        });
        
        describe("Correct number of nodes", () => {
            let dataBuilder: TreemapDataBuilder;

            beforeEach(() => {
                dataBuilder = new TreemapDataBuilder();
            });

            it("Categorial treemap with gradient (multiple value columns)", () => {

                let dataView = dataBuilder.build(true);
                let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
                let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

                // Make sure the number of categories in the node match the number of categories in the data view
                let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport, null).root;
                expect(rootNode.children.length).toEqual(dataView.categorical.categories[0].values.length);

                // Make sure the right number of values are nested in each of the categories 
                // (number of values per category minus 1 for the gradient)
                let valueCount = dataView.categorical.values.length - 1;
                let node1: TreemapNode = <TreemapNode>rootNode.children[0];
                let node2: TreemapNode = <TreemapNode>rootNode.children[1];
                expect(node1.children.length).toEqual(valueCount);
                expect(node2.children.length).toEqual(valueCount);
            });

            it("Categorial treemap with gradient (single value column)", () => {

                let dataView = dataBuilder.withOneValueColumn().build(true);
                let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
                let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

                // Make sure the number of categories in the node match the number of categories in the data view
                let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport, null).root;
                expect(rootNode.children.length).toEqual(dataView.categorical.categories[0].values.length);

                // Since there's only 1 value for each category, we should have one node under the root for each
                // category and no children under that node.
                let node1: TreemapNode = <TreemapNode>rootNode.children[0];
                let node2: TreemapNode = <TreemapNode>rootNode.children[1];
                expect(node1.children).toBeUndefined();
                expect(node2.children).toBeUndefined();
            });

            it("Categorical treemap with gradient (no values)", () => {
                let dataView = dataBuilder.withoutValues().build(true);
                let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
                let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

                // We expect gradient to be also used as values if there aren't any values. We should have 1 node per category with no children
                let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport, null).root;
                expect(rootNode.children.length).toEqual(dataView.categorical.categories[0].values.length);
                
                for (let child of rootNode.children) {
                    expect(child.children).toBeUndefined();
                }
            });

            it("Non-categorial treemap with gradient", () => {

                let dataView = dataBuilder.withSingleValues().withoutCategory().build(true);
                let dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
                let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

                // Make sure we're getting the right number of values back (number of values minus 1 for the gradient)
                let rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, viewport, null).root;
                expect(rootNode.children.length).toEqual(dataView.categorical.values.length - 1);
            });
        });

        it("checkValueForShape function", () => {
            let values = [10, 0.01, -5, null, NaN, 0];
            let cullableValue = 0.1;

            // allValuesAreNegative = false;
            let allValuesAreNegative = false;
            let expectResults = [true, false, false, false, false, false];
            let actualResults = [];
            let expectDataCulled = [false, true, true, false, false, false];
            let actualDataCulled = [];
            for (let count = 0; count < values.length; count++) {
                let dataWasCulled = false;
                let valueShape = powerbi.visuals.Treemap.checkValueForShape(values[count], cullableValue, allValuesAreNegative, dataWasCulled);
                actualResults.push(valueShape.validShape);
                actualDataCulled.push(valueShape.dataWasCulled);
            }

            expect(actualResults).toEqual(expectResults);
            expect(actualDataCulled).toEqual(expectDataCulled);

            // allValuesAreNegative = true;
            allValuesAreNegative = true;
            expectResults = [true, false, true, false, false, false];
            actualResults = [];
            expectDataCulled = [false, true, false, false, false, false];
            actualDataCulled = [];
            for (let count = 0; count < values.length; count++) {
                let dataWasCulled = false;
                let valueShape = powerbi.visuals.Treemap.checkValueForShape(values[count], cullableValue, allValuesAreNegative, dataWasCulled);
                actualResults.push(valueShape.validShape);
                actualDataCulled.push(valueShape.dataWasCulled);
            }

            expect(actualResults).toEqual(expectResults);
            expect(actualDataCulled).toEqual(expectDataCulled);
        });
    });

    /**
     * Note: This is a very bare-bones builder class. It will need more work to properly support all of the test scenarios.
     */
    class TreemapDataBuilder {

        public categoryColumn: powerbi.DataViewMetadataColumn = { displayName: 'cat1' };
        public categoryValues = ['Front end', 'Back end'];
        public singleCategoryValues = ['Front end'];

        public valueColumns: powerbi.DataViewMetadataColumn[] = [
            { displayName: 'value1', isMeasure: true, queryName: 'value1', roles: { 'Values': true } },
            { displayName: 'value2', isMeasure: true, queryName: 'value2', roles: { 'Values': true } },
            { displayName: 'value3', isMeasure: true, queryName: 'value3', roles: { 'Values': true } },
        ];
        public values = [[110, 120], [210, 220], [310, 320]];
        public singleValues = [[110], [210], [310]];
        
        public valuesSource: powerbi.DataViewMetadataColumn;
        public dynamicSeriesSource: powerbi.DataViewMetadataColumn = { displayName: 'Year', roles: { 'Details': true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) };

        public gradientColumn: powerbi.DataViewMetadataColumn = { displayName: 'gradient', roles: { 'Gradient': true } };
        public gradientValues = [410, 420];
        public gradientSingleValues = [410];

        public build(gradient: boolean, gradientValuesRole?: boolean): powerbi.DataView {

            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: []
            };
            
            let valueDataArray: powerbi.DataViewValueColumn[] = [];
            
            if (this.valueColumns !== null && this.values !== null) {
                debug.assert(this.valueColumns.length === this.values.length, 'The number of columns does not match the number of values.');
                
                for (let i = 0; i < this.valueColumns.length; i++) {

                    let valueColumn = this.valueColumns[i];
                    dataViewMetadata.columns.push(valueColumn);

                    let value = this.values[i];
                    valueDataArray.push({
                        source: valueColumn,
                        values: value
                    });
                }
            }
            else if ((this.valueColumns !== null && this.values == null)
                || (this.valueColumns == null && this.values !== null)) {
                debug.assertFail('Either valueColumns or values is null and the other is not.');
            }
            
            if (gradient) {
                
                if (gradientValuesRole) {
                    debug.assert(!_.isEmpty(this.valueColumns), 'No value to set gradient value to.');
                    let gradientColumn = valueDataArray[0];
                    gradientColumn.source.roles['Gradient'] = true;
                }
                else {
                    dataViewMetadata.columns.push(this.gradientColumn);
                    valueDataArray.push({
                        source: this.gradientColumn,
                        values: this.gradientValues
                    });
                }
            }

            let categories: powerbi.DataViewCategoryColumn[] = this.buildCategories(dataViewMetadata);

            return <powerbi.DataView>{
                metadata: dataViewMetadata,
                categorical: {
                    categories: categories,
                    values: DataViewTransform.createValueColumns(valueDataArray, null, this.valuesSource)
                }
            };
        }

        public withSingleValues(): TreemapDataBuilder {
            this.values = this.singleValues;
            this.gradientValues = this.gradientSingleValues;
            return this;
        }

        public withoutCategory(): TreemapDataBuilder {
            this.categoryColumn = null;
            this.categoryValues = null;
            return this;
        }

        public withOneValueColumn(): TreemapDataBuilder {
            this.valueColumns = [this.valueColumns[0]];
            this.values = [this.values[0]];

            return this;
        }

        public withoutValues(): TreemapDataBuilder {
            this.valueColumns = null;
            this.values = null;

            return this;
        }
        
        public withDynamicSeries(): TreemapDataBuilder {
            this.valuesSource = this.dynamicSeriesSource;
            return this;
        }

        private buildCategories(dataViewMetadata: powerbi.DataViewMetadata): powerbi.DataViewCategoryColumn[] {

            if (!this.categoryColumn) {
                return;
            }

            dataViewMetadata.columns.push(this.categoryColumn);

            let categoryIdentities = this.categoryValues.map((v) => mocks.dataViewScopeIdentity(v[0]));
            let categories: powerbi.DataViewCategoryColumn[] = [{
                source: this.categoryColumn,
                values: this.categoryValues,
                identity: categoryIdentities
            }];

            return categories;
        }

    }
}
