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
    import Map = powerbi.visuals.Map;
    import MapSeriesInfo = powerbi.visuals.MapSeriesInfo;
    import ValueType = powerbi.ValueType;
    import PrimitiveType = powerbi.PrimitiveType;
    import SQExprShortSerializer = powerbi.data.SQExprShortSerializer;
    import LegendPosition = powerbi.visuals.LegendPosition;
    import ILegend = powerbi.visuals.ILegend;
    import dataLabelUtils = powerbi.visuals.dataLabelUtils;
    import PixelConverter = jsCommon.PixelConverter;

    powerbitests.mocks.setLocale();

    describe("Map",() => {
        let element: JQuery;
        let mockGeotaggingAnalyzerService;

        var viewport = {
            height: 800,
            width: 500,
        };

        beforeEach(() => {
            mockGeotaggingAnalyzerService = powerbi.createGeoTaggingAnalyzerService((stringId: string) => mocks.getLocalizedString(stringId));
            element = powerbitests.helpers.testDom(viewport.height.toString(), viewport.width.toString());
        });

        describe('capabilities', () => {

            it('Map registered capabilities', () => {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('map').capabilities).toBe(powerbi.visuals.mapCapabilities);
        });

            it('Capabilities should include dataViewMappings', () => {
            expect(powerbi.visuals.mapCapabilities.dataViewMappings).toBeDefined();
        });

            it('Capabilities should include dataRoles', () => {
            expect(powerbi.visuals.mapCapabilities.dataRoles).toBeDefined();
        });

            it('Capabilities should not suppressDefaultTitle', () => {
            expect(powerbi.visuals.mapCapabilities.suppressDefaultTitle).toBeUndefined();
        });

            it('Capabilities DataRole preferredTypes', () => {
            //Map's Category, X and Y fieldWells have preferences for geographic locations, longitude and latitude respectively
            expect(powerbi.visuals.mapCapabilities.dataRoles.map(r => !!r.preferredTypes)).toEqual([
                true,
                false,
                true,
                true,
                false,
                false,
            ]);

            expect(powerbi.visuals.mapCapabilities.dataRoles[0].preferredTypes.map(ValueType.fromDescriptor)).toEqual([
                ValueType.fromExtendedType(powerbi.ExtendedType.Address),
                ValueType.fromExtendedType(powerbi.ExtendedType.City),
                ValueType.fromExtendedType(powerbi.ExtendedType.Continent),
                ValueType.fromExtendedType(powerbi.ExtendedType.Country),
                ValueType.fromExtendedType(powerbi.ExtendedType.County),
                ValueType.fromExtendedType(powerbi.ExtendedType.Place),
                ValueType.fromExtendedType(powerbi.ExtendedType.PostalCode_Text),
                ValueType.fromExtendedType(powerbi.ExtendedType.Region),
                ValueType.fromExtendedType(powerbi.ExtendedType.StateOrProvince)
            ]);

            expect(powerbi.visuals.mapCapabilities.dataRoles[2].preferredTypes.map(ValueType.fromDescriptor)).toEqual([
                ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double, "Longitude")
            ]);

            expect(powerbi.visuals.mapCapabilities.dataRoles[3].preferredTypes.map(ValueType.fromDescriptor)).toEqual([
                ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double, "Latitude")
            ]);
        });

            it('FormatString property should match calculated', () => {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(powerbi.visuals.mapCapabilities.objects)).toEqual(powerbi.visuals.mapProps.general.formatString);
        });
        });

        it('getMeasureIndexOfRole', () => {
            let dataView = new MapDataBuilder().build(true, true);
            let grouped = dataView.categorical.values.grouped();

            let result = powerbi.visuals.DataRoleHelper.getMeasureIndexOfRole(grouped, "InvalidRoleName");
            expect(result).toBe(-1);

            result = powerbi.visuals.DataRoleHelper.getMeasureIndexOfRole(grouped, "Size");
            expect(result).toBe(0);

            result = powerbi.visuals.DataRoleHelper.getMeasureIndexOfRole(grouped, "X");
            expect(result).toBe(1);
        });

        it('calculateGroupSizes', () => {
            let dataView = new MapDataBuilder().build(true, false);
            var grouped = dataView.categorical.values.grouped();

            let groupSizeTotals = [];
            let range = null;
            let sizeIndex = 0;
            let result = Map.calculateGroupSizes(dataView.categorical, grouped, groupSizeTotals, sizeIndex, range);
            expect(result.min).toBe(100);
            expect(result.max).toBe(300);
            expect(groupSizeTotals.length).toBe(3);
            expect(groupSizeTotals[0]).toBe(100);
            expect(groupSizeTotals[1]).toBe(200);
            expect(groupSizeTotals[2]).toBe(300);

            groupSizeTotals = [];
            sizeIndex = -1;
            result = Map.calculateGroupSizes(dataView.categorical, grouped, groupSizeTotals, sizeIndex, range);
            expect(result).toBe(null);
            expect(groupSizeTotals.length).toBe(3);
            expect(groupSizeTotals[0]).toBe(null);
            expect(groupSizeTotals[1]).toBe(null);
            expect(groupSizeTotals[2]).toBe(null);
        });

        it('createMapDataPoint',() => {
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let group = "Arizona";
            let value = 100;
            let mapSeriesInfo: MapSeriesInfo = {
                sizeValuesForGroup: [{
                    value: 100,
                    index: 0,
                    fill: "#112233",
                    stroke: "#223344",
                    seriesId: mocks.dataViewScopeIdentity("Sales"),
                }],
                latitude: null,
                longitude: null,

            };
            let radius = 3;

            // No seriesInfo means the result is null
            let result = Map.createMapDataPoint(group, value, null, radius, colors, null);
            expect(result).toBe(null);

            result = Map.createMapDataPoint(group, value, mapSeriesInfo, radius, colors, mocks.dataViewScopeIdentity("Arizona"));
            expect(result.seriesInfo).toBe(mapSeriesInfo);
            expect(result.radius).toBe(radius);
            expect(result.location).toBe(null);
            expect(result.cachedLocation).toBe(result.location);
            expect(result.geocodingQuery).toBe(group);
            expect(result.categoryValue).toBe(group);

            // No group, latitude, or longitude shouldn't render
            group = null;
            result = Map.createMapDataPoint(group, value, mapSeriesInfo, radius, colors, null);
            expect(result).toBe(null);

        });

        describe('calculateSeriesInfo', () => {

            it('no series, size and lat long', () => {
                let dataView = new MapDataBuilder().build(true, true);

                let sizeIndex = 0;
                let latIndex = 1;
                let longIndex = 2;
                let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
                var result = Map.calculateSeriesInfo(dataView.categorical.values.grouped(), 0, sizeIndex, latIndex, longIndex, colors);
            expect(result.sizeValuesForGroup.length).toBe(1);
                expect(result.sizeValuesForGroup[0].value).toBe(100);
            expect(result.sizeValuesForGroup[0].index).toBe(0);
                expect(result.latitude).toBe(-114);
                expect(result.longitude).toBe(46.87);

                result = Map.calculateSeriesInfo(dataView.categorical.values.grouped(), 1, sizeIndex, latIndex, longIndex, colors);
                expect(result.sizeValuesForGroup.length).toBe(1);
                expect(result.sizeValuesForGroup[0].value).toBe(200);
                expect(result.sizeValuesForGroup[0].index).toBe(0);
                expect(result.latitude).toBe(-122.46);
                expect(result.longitude).toBe(37.81);

                var result = Map.calculateSeriesInfo(dataView.categorical.values.grouped(), 2, sizeIndex, latIndex, longIndex, colors);
                expect(result.sizeValuesForGroup.length).toBe(1);
                expect(result.sizeValuesForGroup[0].value).toBe(300);
                expect(result.sizeValuesForGroup[0].index).toBe(0);
                expect(result.latitude).toBe(-111.76);
                expect(result.longitude).toBe(34.68);
            });

            it('multi-series', () => {
                let dataView: powerbi.DataView = new MapDataBuilder().buildWithSeries(true, false);

                let sizeIndex = 0;
                let latIndex = -1;
                let longIndex = -1;
                let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
                let categoryColumnRef = dataView.categorical.values.identityFields;
                let result = Map.calculateSeriesInfo(dataView.categorical.values.grouped(), 0, sizeIndex, longIndex, latIndex, colors, undefined, undefined, categoryColumnRef);

                expect(result.sizeValuesForGroup.length).toBe(4);
                for (let i = 0; i < result.sizeValuesForGroup.length; i++) {
                    expect(result.sizeValuesForGroup[i].index).toBe(i);
                    expect(result.sizeValuesForGroup[i].fill).not.toBeNull();
                    expect(result.sizeValuesForGroup[i].stroke).not.toBeNull();
                }

                expect(result.sizeValuesForGroup[0].value).toBe(100);
                expect(result.sizeValuesForGroup[1].value).toBe(10);
                expect(result.sizeValuesForGroup[2].value).toBe(1000);
                expect(result.sizeValuesForGroup[3].value).toBe(1);

            expect(result.sizeValuesForGroup[1].fill).not.toBe(result.sizeValuesForGroup[0].fill);

            expect(result.latitude).toBe(null);
            expect(result.longitude).toBe(null);
        });

            it('with lat long and no size', () => {
                let dataView = new MapDataBuilder().build(false, true);

                let sizeIndex = -1;
                let latIndex = 0;
                let longIndex = 1;
                let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

                let result = Map.calculateSeriesInfo(dataView.categorical.values.grouped(), 0, sizeIndex, longIndex, latIndex, colors);
            expect(result.sizeValuesForGroup.length).toBe(1);
            expect(result.sizeValuesForGroup[0].value).toBe(null);
            expect(result.sizeValuesForGroup[0].index).toBe(0);
            expect(result.latitude).toBe(46.87);
            expect(result.longitude).toBe(-114);

                result = Map.calculateSeriesInfo(dataView.categorical.values.grouped(), 1, sizeIndex, longIndex, latIndex, colors);
                expect(result.sizeValuesForGroup.length).toBe(1);
                expect(result.sizeValuesForGroup[0].value).toBe(null);
                expect(result.sizeValuesForGroup[0].index).toBe(0);
                expect(result.latitude).toBe(37.81);
                expect(result.longitude).toBe(-122.46);

                result = Map.calculateSeriesInfo(dataView.categorical.values.grouped(), 2, sizeIndex, longIndex, latIndex, colors);
                expect(result.sizeValuesForGroup.length).toBe(1);
                expect(result.sizeValuesForGroup[0].value).toBe(null);
                expect(result.sizeValuesForGroup[0].index).toBe(0);
                expect(result.latitude).toBe(34.68);
                expect(result.longitude).toBe(-111.76);
        });

            it('Gradient color', () => {
                let dataView = new MapDataBuilder().build(true, false, true);

                let sizeIndex = 0;
                let latIndex = -1;
                let longIndex = -1;
                let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
                var objectDefinitions: powerbi.DataViewObjects[] = [
                    { dataPoint: { fill: { solid: { color: "#d9f2fb" } } } },
                    { dataPoint: { fill: { solid: { color: "#b1eab7" } } } }
                ];
                var result = Map.calculateSeriesInfo(dataView.categorical.values.grouped(), 0, sizeIndex, longIndex, latIndex, colors, null, objectDefinitions);
                expect(result.sizeValuesForGroup[0].fill).toBe('rgba(217,242,251,0.6)');

                result = Map.calculateSeriesInfo(dataView.categorical.values.grouped(), 1, sizeIndex, longIndex, latIndex, colors, null, objectDefinitions);
                expect(result.sizeValuesForGroup[0].fill).toBe('rgba(177,234,183,0.6)');
        });

            it('same field category & series', () => {
                let dataBuilder = new MapDataBuilder();
                dataBuilder.withCategoriesAsSeries();
                let dataView = dataBuilder.buildWithSeries(true, false);

                let groupedValues = dataView.categorical.values.grouped();

                let sizeIndex = 0;
                var latIndex = -1;
                let longIndex = -1;
                let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

                let result0 = Map.calculateSeriesInfo(groupedValues, 0, sizeIndex, longIndex, latIndex, colors, undefined, undefined, [dataBuilder.seriesColumnExpr]);
                expect(result0.sizeValuesForGroup.length).toBe(1);
                expect(result0.sizeValuesForGroup[0].value).toBe(100);
                expect(result0.sizeValuesForGroup[0].index).toBe(0);
                expect(result0.sizeValuesForGroup[0].fill).not.toBeNull();
                expect(result0.sizeValuesForGroup[0].stroke).not.toBeNull();

                let result1 = Map.calculateSeriesInfo(groupedValues, 1, sizeIndex, longIndex, latIndex, colors, undefined, undefined, [dataBuilder.seriesColumnExpr]);
                expect(result1.sizeValuesForGroup.length).toBe(1);
                expect(result1.sizeValuesForGroup[0].value).toBe(20);
                expect(result1.sizeValuesForGroup[0].index).toBe(1);
                expect(result1.sizeValuesForGroup[0].fill).not.toBeNull();
                expect(result1.sizeValuesForGroup[0].stroke).not.toBeNull();

                let result2 = Map.calculateSeriesInfo(groupedValues, 2, sizeIndex, longIndex, latIndex, colors, undefined, undefined, [dataBuilder.seriesColumnExpr]);
                expect(result2.sizeValuesForGroup.length).toBe(1);
                expect(result2.sizeValuesForGroup[0].value).toBe(3000);
                expect(result2.sizeValuesForGroup[0].index).toBe(2);
                expect(result2.sizeValuesForGroup[0].fill).not.toBeNull();
                expect(result2.sizeValuesForGroup[0].stroke).not.toBeNull();

                expect(result0.sizeValuesForGroup[0].fill).not.toBe(result1.sizeValuesForGroup[0].fill);
                expect(result1.sizeValuesForGroup[0].fill).not.toBe(result2.sizeValuesForGroup[0].fill);
                expect(result0.sizeValuesForGroup[0].fill).not.toBe(result2.sizeValuesForGroup[0].fill);
        });

        });

        describe('calculateSeriesLegend', () => {
            it('no series', () => {
                let dataBuilder = new MapDataBuilder();
                let dataView = dataBuilder.build(true, false);

                var groupIndex: number = 0;
                var sizeIndex = 0;
                var colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
                var result = Map.calculateSeriesLegend(dataView.categorical.values.grouped(), groupIndex, sizeIndex, colors);
            expect(result.length).toBe(1);
        });

            it('dynamic series', () => {
                let dataBuilder = new MapDataBuilder();
                let dataView = dataBuilder.buildWithSeries(true, false);
                let seriesColumnExpr = dataBuilder.seriesColumnExpr;

                var groupIndex: number = 0;
                var sizeIndex = 0;
                var colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

                let seriesColors = _.map(dataBuilder.seriesValues, (v) => colors.getColorScaleByKey(SQExprShortSerializer.serialize(seriesColumnExpr)).getColor(v));

                var result = Map.calculateSeriesLegend(dataView.categorical.values.grouped(), groupIndex, sizeIndex, colors, undefined, [seriesColumnExpr]);

                expect(result.length).toBe(4);
                for (let i = 0; i < result.length; i++) {
                    expect(result[i].label).toBe(dataBuilder.seriesValues[i]);
                    expect(result[i].color).toBe(seriesColors[i].value);
                }
        });

            it('default color', () => {
                let dataView = new MapDataBuilder().build(true, false);

                var groupIndex: number = 0;
                var sizeIndex = 0;
                var colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
                var hexDefaultColorRed = "#FF0000";
                var result = Map.calculateSeriesLegend(dataView.categorical.values.grouped(), groupIndex, sizeIndex, colors, hexDefaultColorRed);
                expect(result.length).toBe(1);
                expect(result[0].color).toBe(hexDefaultColorRed);
        });

            it('null legend', () => {
                let dataBuilder = new MapDataBuilder();
                dataBuilder.seriesValues[0] = null;
                var dataView: powerbi.DataView = dataBuilder.buildWithSeries(true, true);

            let groupIndex: number = 0,
                sizeIndex = 0;
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let result = Map.calculateSeriesLegend(dataView.categorical.values.grouped(), groupIndex, sizeIndex, colors);
            expect(result[0].label).toBe(powerbi.visuals.valueFormatter.format(null));
                expect(result[1].label).not.toBe(powerbi.visuals.valueFormatter.format(null));
        });
        });

        it('calculateRadius',() => {
            var range: powerbi.visuals.SimpleRange = { min: -100, max: 100 };

            // Null should be the minimum size
            let diff = 0;
            let result = Map.calculateRadius(range, 0, null);
            expect(result).toBe(6);

            // Min
            diff = range.max - range.min;
            result = Map.calculateRadius(range, diff, -100);
            expect(result).toBe(6);

            // Middle of zero
            result = Map.calculateRadius(range, diff, 0);
            expect(result).toBe(14 / 2 + 6);

            // Max
            result = Map.calculateRadius(range, diff, 100);
            expect(result).toBe(20);

            // No scale (div by zero or no range scenario
            result = Map.calculateRadius({ min: 100, max: 100 }, 0, 100);
            expect(result).toBe(6);
        });

        describe('getGeocodingCategory', () => {
            it('from role', () => {
                let dataBuilder = new MapDataBuilder();
                dataBuilder.categoryColumn.displayName = 'foo';
                dataBuilder.categoryColumn.roles = { Country: true };
                let dataView = dataBuilder.build(true, false);

                var result = Map.getGeocodingCategory(dataView.categorical, mockGeotaggingAnalyzerService);
                expect(result).toBe("Country");
        });

            it('from column name', () => {
                let dataBuilder = new MapDataBuilder();
                dataBuilder.categoryColumn.displayName = 'country';
                let dataView = dataBuilder.build(true, false);

                var result = Map.getGeocodingCategory(dataView.categorical, mockGeotaggingAnalyzerService);
                expect(result).toBe("Country");
        });

            it('from value type', () => {
                let dataBuilder = new MapDataBuilder();
                dataBuilder.categoryColumn.type = ValueType.fromDescriptor({ geography: { country: true } });
                let dataView = dataBuilder.build(true, false);

                var result = Map.getGeocodingCategory(dataView.categorical, mockGeotaggingAnalyzerService);
                expect(result).toBe("Country");
            });
        });

        /* Disable due to way tests run in GCI */
        /*
        it('Map Geocode With Size',() => {
            
            v = powerbi.visuals.VisualFactory.getPlugin('map').create();
            v.init({
                element: element,
                host: mocks.createHostService(),
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                }
            });

            v.onDataChanged([dataView]);
            
            // Only validation at this point is no exceptions are thrown
        });
        */

        describe('hasSizeField', () => {
            it('with no measure columns', () => {
                let dataBuilder = new MapDataBuilder();
                let dataView = dataBuilder.build(false, false);
                expect(Map.hasSizeField(dataView.categorical.values, 0)).toBe(false);
        });

            it('with meaure column with "Size" role', () => {
                let dataBuilder = new MapDataBuilder();
                let dataView = dataBuilder.build(true, false);
                expect(Map.hasSizeField(dataView.categorical.values, 0)).toBe(true);
        });

            it('with measure column, but no "Size" role', () => {
                let dataBuilder = new MapDataBuilder();
                dataBuilder.sizeColumn.roles = undefined;
                let dataView = dataBuilder.build(true, false);
                expect(Map.hasSizeField(dataView.categorical.values, 0)).toBe(true);
        });

            if ('with multiple measure columns, no "Size" role, none numeric', () => {
                let dataBuilder = new MapDataBuilder();
                dataBuilder.sizeColumn.roles = undefined;
                dataBuilder.sizeColumn.type = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text);
                dataBuilder.latitudeColumn.type = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text);
                dataBuilder.longitudeColumn.type = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text);
                let dataView = dataBuilder.build(true, true);
                expect(Map.hasSizeField(dataView.categorical.values, 0)).toBe(false);
        });
        });

        // TODO: These tooltip tests don't test anything useful, these tests should call the individual converters and check the tooltip infos.
        //it('Map.tooltipInfo single series', () => {
        //    let dataView = new MapDataBuilder().build(true, false);

        //    var groupIndex: number = 0;
        //    var sizeIndex = 0;
        //    var latIndex = -1;
        //    var longIndex = -1;
        //    var categoryValue = dataView.categorical.categories[0].values[0];
        //    var colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
        //    var seriesInfo = Map.calculateSeriesInfo(dataView.categorical.values.grouped(), groupIndex, sizeIndex, longIndex, latIndex, colors);
        //    var value = seriesInfo.sizeValuesForGroup[0].value;

        //    var tooltipInfo: powerbi.visuals.TooltipDataItem[] = powerbi.visuals.TooltipBuilder.createTooltipInfo(powerbi.visuals.mapProps.general.formatString, dataView.categorical, categoryValue, value);
        //    var tooltipInfoTestData: powerbi.visuals.TooltipDataItem[] = [{ displayName: "state", value: "Montana" }, { displayName: "size", value: "100.00" }];
        //    expect(tooltipInfo).toEqual(tooltipInfoTestData);
        //});

        //it('Map.tooltipInfo multi series', () => {
        //    let dataView = new MapDataBuilder().buildWithSeries(true, true);

        //    var sizeIndex = 0;
        //    var latIndex = 1;
        //    var longIndex = 2;
        //    var categoryValues = dataView.categorical.categories[0].values;
        //    var colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

        //    var groupIndex: number = 0;
        //    var seriesInfo = Map.calculateSeriesInfo(dataView.categorical.values.grouped(), groupIndex, sizeIndex, longIndex, latIndex, colors);
        //    var value = seriesInfo.sizeValuesForGroup[0].value;
        //    var tooltipInfo: powerbi.visuals.TooltipDataItem[] = powerbi.visuals.TooltipBuilder.createTooltipInfo(powerbi.visuals.mapProps.general.formatString, dataView.categorical, categoryValues[0], value);
        //    var tooltipInfoTestData: powerbi.visuals.TooltipDataItem[] = [{ displayName: '', value: '2012' }, { displayName: '', value: 'Canada' }, { displayName: '', value: '150.00' }];
        //    expect(tooltipInfo).toEqual(tooltipInfoTestData);
        //});

        //it('Map.tooltipInfo no series, no values',() => {
        //    var dataViewMetadata: powerbi.DataViewMetadata = {
        //        columns: [
        //            { displayName: 'col1' },
        //        ]
        //    };
        //    var dataView: powerbi.DataView = {
        //        metadata: dataViewMetadata,
        //        categorical: {
        //            categories: [{
        //                source: dataViewMetadata.columns[0],
        //                values: ['Montana', 'California', 'Arizona']
        //            }],
        //        }
        //    };

        //    var groupIndex: number = 0;
        //    var sizeIndex = 0;
        //    var latIndex = -1;
        //    var longIndex = -1;
        //    var categoryValue = dataView.categorical.categories[0].values[0];
        //    var colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
        //    var seriesInfo = Map.calculateSeriesInfo(undefined, groupIndex, sizeIndex, latIndex, longIndex, colors);
        //    var value = seriesInfo.sizeValuesForGroup[0].value;
        //    var tooltipInfo: powerbi.visuals.TooltipDataItem[] = powerbi.visuals.TooltipBuilder.createTooltipInfo(powerbi.visuals.mapProps.general.formatString, dataView.categorical, categoryValue, value);
        //    var tooltipInfoTestData: powerbi.visuals.TooltipDataItem[] = [{ displayName: "col1", value: "Montana" }];
        //    expect(tooltipInfo).toEqual(tooltipInfoTestData);
        //});

        //it('Map.calculateSeriesInfo - Gradient tooltip', () => {
        //    let dataView = new MapDataBuilder().build(true, false, true);

        //    var sizeIndex = 0;
        //    var latIndex = -1;
        //    var longIndex = -1;
        //    var colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
        //    var objectDefinitions: powerbi.DataViewObjects[] = [
        //        { dataPoint: { fill: { solid: { color: "#d9f2fb" } } } },
        //        { dataPoint: { fill: { solid: { color: "#b1eab7" } } } }
        //    ];

        //    //expected tool tips 
        //    var tooltipContainer: powerbi.visuals.TooltipDataItem[][] = [];
        //    tooltipContainer.push([{ displayName: 'col1', value: 'Montana' }, { displayName: 'col2', value: '-100' }, { displayName: 'col3', value: '75' }]);
        //    tooltipContainer.push([{ displayName: 'col1', value: 'California' }, { displayName: 'col2', value: '200' }, { displayName: 'col3', value: '50' }]);
        //    tooltipContainer.push([{ displayName: 'col1', value: 'Arizona' }, { displayName: 'col2', value: '700' }, { displayName: 'col3', value: '0' }]);

        //    for (var i = 0; i < dataView.categorical.values[0].values.length; i++) {
        //        var result = Map.calculateSeriesInfo(dataView.categorical.values.grouped(), i, sizeIndex, longIndex, latIndex, colors, null, objectDefinitions);
        //        var categoryValue = dataView.categorical.categories[0].values[i];
        //        var value = result.sizeValuesForGroup[0].value;
        //        var tooltipInfo: powerbi.visuals.TooltipDataItem[] = powerbi.visuals.TooltipBuilder.createTooltipInfo(
        //            powerbi.visuals.mapProps.general.formatString, dataView.categorical, categoryValue, value, null, null, 0, i);
        //        expect(tooltipInfo).toEqual(tooltipContainer[i]);
        //    }});

        //it('Map.calculateSeriesInfo - Gradient and Y have the index validate tooltip', () => {
        //    let dataView = new MapDataBuilder().build(true, true, true);

        //    var sizeIndex = 0;
        //    var latIndex = -1;
        //    var longIndex = -1;
        //    var colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
        //    var objectDefinitions: powerbi.DataViewObjects[] = [
        //        { dataPoint: { fill: { solid: { color: "#d9f2fb" } } } },
        //        { dataPoint: { fill: { solid: { color: "#b1eab7" } } } }
        //    ];

        //    var categorical = dataView.categorical;
        //    var gradientMeasureIndex = powerbi.visuals.GradientUtils.getGradientMeasureIndex(categorical);
        //    var gradientValueColumn = dataView.categorical.values[gradientMeasureIndex];

        //    //expected tool tips 
        //    var tooltipContainer: powerbi.visuals.TooltipDataItem[][] = [];
        //    tooltipContainer.push([{ displayName: 'col1', value: 'Montana' }, { displayName: 'col2', value: '-100' }]);
        //    tooltipContainer.push([{ displayName: 'col1', value: 'California' }, { displayName: 'col2', value: '200' }]);
        //    tooltipContainer.push([{ displayName: 'col1', value: 'Arizona' }, { displayName: 'col2', value: '700' }]);

        //    for (var i = 0; i < dataView.categorical.values[0].values.length; i++) {
        //        var seriesData: powerbi.visuals.TooltipSeriesDataItem[] = [];
        //        if (gradientValueColumn && gradientMeasureIndex !== 0) {
        //            // Saturation color
        //            seriesData.push({ value: gradientValueColumn.values[i], metadata: { source: gradientValueColumn.source, values: [] } });
        //        }
        //        var result = Map.calculateSeriesInfo(dataView.categorical.values.grouped(), i, sizeIndex, longIndex, latIndex, colors, null, objectDefinitions);
        //        var categoryValue = dataView.categorical.categories[0].values[i];
        //        var value = result.sizeValuesForGroup[0].value;
        //        var tooltipInfo: powerbi.visuals.TooltipDataItem[] = powerbi.visuals.TooltipBuilder.createTooltipInfo(
        //            powerbi.visuals.mapProps.general.formatString, dataView.categorical, categoryValue, value, null, null, 0, i);
        //        expect(tooltipInfo).toEqual(tooltipContainer[i]);
        //    }
        //});

        describe('warnings', () => {

            it('shows warning with no Location set', () => {
                var dataView: powerbi.DataView = {
                metadata: {
                    columns: [{ displayName: 'NotLocation', roles: { 'NotCategory': true, }, }],
                }
            };

            let warnings = Map.showLocationMissingWarningIfNecessary(dataView);
            expect(warnings[0]).not.toBeNull();
        });

            it('shows warning with no columns set', () => {
                var dataView: powerbi.DataView = {
                metadata: {
                    columns: [],
                }
            };

            let warnings = Map.showLocationMissingWarningIfNecessary(dataView);
            expect(warnings[0]).not.toBeNull();
        });

            it('does not show warning with location set', () => {
                var dataView: powerbi.DataView = {
                metadata: {
                    columns: [{ displayName: 'Location', queryName: 'Location', roles: { 'Category': true, }, }],
                }
            };

            let warnings = Map.showLocationMissingWarningIfNecessary(dataView);
            expect(warnings.length).toEqual(0);
        });
        });

        describe('legend', () => {
            it('is explicitly hidden', () => {
                var dataView: powerbi.DataView = {
                metadata: {
                    columns: [],
                    objects: {
                        legend: {
                            show: false
                        }
                    }
                }
            };

            expect(Map.isLegendHidden(dataView)).toBe(true);
        });

            it('is explicitly shown', () => {
                var dataView: powerbi.DataView = {
                metadata: {
                    columns: [],
                    objects: {
                        legend: {
                            show: true
                        }
                    }
                }
            };

            expect(Map.isLegendHidden(dataView)).toBe(false);
        });

            it('is implicitly hidden', () => {
                var dataView: powerbi.DataView = {
                metadata: {
                    columns: [],
                }
            };

            expect(Map.isLegendHidden(dataView)).toBe(false);
        });

            it('position is bottom', () => {
                var dataView: powerbi.DataView = {
                metadata: {
                    columns: [],
                    objects: {
                        legend: {
                            position: 'Bottom'
                        }
                    }
                }
            };

            expect(Map.legendPosition(dataView)).toBe(LegendPosition.Bottom);
        });

            it('enumerateLegend', () => {
            let dataView: powerbi.DataView = {
                metadata: {
                    columns: [],
                    objects: {
                        legend: {
                            show: true
                        }
                    }
                }
            };

            let legend: ILegend = {
                changeOrientation: () => { },
                drawLegend: () => { },
                getMargins: () => <powerbi.IViewport>{
                    width: 0,
                    height: 0
                },
                getOrientation: () => LegendPosition.Top,
                isVisible: () => true,
                reset: () => { },
            };

            let enumerationBuilder = new powerbi.visuals.ObjectEnumerationBuilder();
            Map.enumerateLegend(enumerationBuilder, dataView, legend, "");
            let objects = enumerationBuilder.complete();

            expect(objects.instances.length).toBe(1);
            let firstObject = objects.instances[0];
            expect(firstObject.objectName).toBe('legend');
            expect(firstObject.selector).toBeNull();

            let properties = firstObject.properties;
                expect(properties).toBeDefined();
            expect(properties['show']).toBe(true);
            expect(properties['position']).toBe('Top');
        });
        });

        describe('shouldEnumerateDataPoints', () => {
            describe('filled map', () => {
                it('no series, with size role', () => {
                    let dataView = new MapDataBuilder().build(true, false);
            expect(Map.shouldEnumerateDataPoints(dataView, /*usesSizeForGradient*/ true)).toBe(false);
        });

                it('no series, without size role', () => {
                    let dataView = new MapDataBuilder().build(false, false);
            expect(Map.shouldEnumerateDataPoints(dataView, /*usesSizeForGradient*/ true)).toBe(true);
        });

                it('with series', () => {
                    let dataView = new MapDataBuilder().buildWithSeries(true, false);
            expect(Map.shouldEnumerateDataPoints(dataView, /*usesSizeForGradient*/ true)).toBe(true);
        });
            });

            describe('bubble map', () => {
                it('no series, with gradient role', () => {
                    let dataView = new MapDataBuilder().build(false, false, true);
            expect(Map.shouldEnumerateDataPoints(dataView, /*usesSizeForGradient*/ false)).toBe(false);
        });

                it('no series, without gradient role', () => {
                    let dataView = new MapDataBuilder().build(false, false, false);
            expect(Map.shouldEnumerateDataPoints(dataView, /*usesSizeForGradient*/ false)).toBe(true);
        });

                it('with series', () => {
                    let dataView = new MapDataBuilder().buildWithSeries(false, false, false);
                    expect(Map.shouldEnumerateDataPoints(dataView, /*usesSizeForGradient*/ false)).toBe(true);
                });
            });
        });

        it("enumerateDataPoints with dynamic series", () => {
            let dataBuilder = new MapDataBuilder();
            let dataView = dataBuilder.buildWithSeries(true, false);

            let groupIndex: number = 0;
            let sizeIndex = 0;
            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            let enumerationBuilder = new powerbi.visuals.ObjectEnumerationBuilder();
            var legendDataPoints = Map.calculateSeriesLegend(dataView.categorical.values.grouped(), groupIndex, sizeIndex, colors, undefined, [dataBuilder.seriesColumnExpr]);
            Map.enumerateDataPoints(enumerationBuilder, legendDataPoints, colors, true, null, false, []);
            let enumeratedDataPoints = enumerationBuilder.complete();

            expect(enumeratedDataPoints.instances.length).toBe(legendDataPoints.length);
            // ensure first object is 'fill' and not 'defaultColor'
            expect(enumeratedDataPoints.instances[0]['properties']['fill']).toBeDefined();
        });
    });

    describe("Bubble Map DOM Tests", () => {
        let visualBuilder: MapVisualBuilder;
        let v: powerbi.IVisual;

        beforeEach(() => {
            visualBuilder = new MapVisualBuilder();
            v = visualBuilder.build(false);
        });

        it("should create map chart element", (done) => {
            let dataView = new MapDataBuilder().build(false, false);
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect($('.mapControl')).toBeInDOM();

                done();
            }, DefaultWaitForRender);
        });

        it("should have bubble for each category", (done) => {
            let dataBuilder = new MapDataBuilder();
            let dataView = dataBuilder.build(false, false);
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                let bubbles = getBubbles();
                expect(bubbles.length).toBe(dataBuilder.categoryValues.length);

                done();
            }, DefaultWaitForRender);
        });

        it("should raise warning with no category", (done) => {
            let warningSpy = jasmine.createSpy('setWarnings');
            visualBuilder.host.setWarnings = warningSpy;
            let dataView = new MapDataBuilder().withoutCategory().build(false, false);
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect(warningSpy).toHaveBeenCalledWith([new powerbi.visuals.NoMapLocationWarning()]);

                done();
            }, DefaultWaitForRender);
        });

        it("should draw category labels when enabled", (done) => {
            let dataView = new MapDataBuilder().withCategoryLabels().withShortCategoryNames().build(false, false);

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect($(".labelGraphicsContext")).toBeInDOM();
                expect($(".labelGraphicsContext .label").length).toBe(3);
                expect($(".labelGraphicsContext .label").first().css('font-size')).toBe(PixelConverter.fromPoint(dataLabelUtils.DefaultFontSizeInPt));

                done();
            }, DefaultWaitForRender);
        });

        it("should draw category labels with different font size", (done) => {
            let dataView = new MapDataBuilder().withCategoryLabels(null, null,null, 18).withShortCategoryNames().build(false, false);

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect($(".labelGraphicsContext")).toBeInDOM();
                expect($(".labelGraphicsContext .label").length).toBe(3);
                expect($(".labelGraphicsContext .label").first().css('font-size')).toBe(PixelConverter.fromPoint(18));

                done();
            }, DefaultWaitForRender);
        });

        it('legend colors should be in order', (done) => {
            let visualBuilder = new MapVisualBuilder();
            let v = visualBuilder.build(false);
            let dataBuilder = new MapDataBuilder();
            let dataView = dataBuilder.buildWithSeries(true, false);
            v.onDataChanged({ dataViews: [dataView] });

            let seriesExpr = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.values.identityFields);
            let scale = visualBuilder.style.colorPalette.dataColors.getColorScaleByKey(seriesExpr);
            let colors = _.map(scale.getDomain(), (k) => scale.getColor(k));

            setTimeout(() => {
                let legendItems = getLegendItems();

                expect(legendItems.length).toBe(dataBuilder.seriesValues.length);

                for (let i = 0; i < legendItems.length; i++) {
                    let legendItem = legendItems.eq(i);
                    let legendColor = getLegendColor(legendItem);
                    let color = jsCommon.Color.parseColorString(legendColor);
                    let expectedColor = jsCommon.Color.parseColorString(colors[i].value);
                    expect(color).toEqual(expectedColor);
                }

                done();
            }, DefaultWaitForRender);
        });

        function getBubbles(): JQuery {
            return $('.mapControl circle.bubble');
        }

        function getLegendItems(): JQuery {
            return $('.legend .legendItem');
        }

        function getLegendColor(legendItem: JQuery): string {
            return legendItem.children('.legendIcon').css('fill');
        }
    });

    describe("Filled Map DOM Tests", () => {
        let visualBuilder: MapVisualBuilder;
        let v: powerbi.IVisual;

        beforeEach(() => {
            visualBuilder = new MapVisualBuilder();
            v = visualBuilder.build(true);
        });

        it("should create map chart element", (done) => {
            let dataView = new MapDataBuilder().build(false, false);
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect($('.mapControl')).toBeInDOM();

                done();
            }, DefaultWaitForRender);
        });

        it("should have path for each category", (done) => {
            let dataBuilder = new MapDataBuilder();
            let dataView = dataBuilder.build(false, false);
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                let shapes = getShapes();
                expect(shapes.length).toBe(dataBuilder.categoryValues.length);

                done();
            }, DefaultWaitForRender);
        });

        it("should raise warning with address data", (done) => {
            let warningSpy = jasmine.createSpy('setWarnings');
            visualBuilder.host.setWarnings = warningSpy;
            let dataBuilder = new MapDataBuilder();
            let dataView = dataBuilder.withAddresses().build(false, false);
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect(warningSpy).toHaveBeenCalledWith([new powerbi.visuals.FilledMapWithoutValidGeotagCategoryWarning()]);

                done();
            }, DefaultWaitForRender);
        });

        it("should gracefully handle null data", (done) => {
            let dataBuilder = new MapDataBuilder();
            let dataView = dataBuilder.withNullValue().build(true, false);
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                let shapes = getShapes();
                expect(shapes.length).toBe(dataBuilder.categoryValues.length - 1);

                done();
            }, DefaultWaitForRender);
        });

        function getShapes(): JQuery {
            return $('.mapControl polygon.shape');
        }
    });

    describe("label data point creation", () => {
        let v: powerbi.IVisual;

        beforeEach(() => {
            v = new MapVisualBuilder().build(false);
        });

        it("Label data points have correct text", () => {
            let dataView = new MapDataBuilder().withCategoryLabels().build(false, false);
            v.onDataChanged({ dataViews: [dataView] });

            let labelDataPoints = callCreateLabelDataPoints(v);
            expect(labelDataPoints[0].text).toEqual("Montana");
            expect(labelDataPoints[1].text).toEqual("California");
            expect(labelDataPoints[2].text).toEqual("Arizona");
        });

        it("Label data points have correct default fill", () => {
            let dataView = new MapDataBuilder().withCategoryLabels().build(false, false);
            v.onDataChanged({ dataViews: [dataView] });

            let labelDataPoints = callCreateLabelDataPoints(v);
            helpers.assertColorsMatch(labelDataPoints[0].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[1].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[2].outsideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[0].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[1].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[2].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
        });

        it("Label data points have correct fill", () => {
            let labelColor = "#007700";
            let dataView = new MapDataBuilder().withCategoryLabels(labelColor).build(false, false);
            v.onDataChanged({ dataViews: [dataView] });

            let labelDataPoints = callCreateLabelDataPoints(v);
            helpers.assertColorsMatch(labelDataPoints[0].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[1].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[2].outsideFill, labelColor);
            helpers.assertColorsMatch(labelDataPoints[0].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[1].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            helpers.assertColorsMatch(labelDataPoints[2].insideFill, powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
        });
    });

    function callCreateLabelDataPoints(v: powerbi.IVisual): powerbi.LabelDataPoint[]{
        let map = <any>v;
        return map.dataPointRenderer.createLabelDataPoints();
    }

    class MapDataBuilder {
        public categoryColumn: powerbi.DataViewMetadataColumn = { displayName: 'state', queryName: 'state', roles: { Category: true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) };
        public categoryValues = ['Montana', 'California', 'Arizona'];
        public shortCategoryValues = ['MT', 'CA', 'AZ'];
        public categoryColumnExpr: powerbi.data.SQExpr = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'state' });
        public addressCategoryColumn: powerbi.DataViewMetadataColumn = { displayName: 'address', queryName: 'address', roles: { Category: true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) };
        public addressCategoryValues = ['Some address', 'Some different address', 'Another different address'];
        public addressColumnExpr: powerbi.data.SQExpr = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'address' });

        public seriesColumn: powerbi.DataViewMetadataColumn = { displayName: 'region', queryName: 'region', roles: { Series: true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) };
        public seriesColumnExpr: powerbi.data.SQExpr = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'region' });;

        public sizeColumn: powerbi.DataViewMetadataColumn = { displayName: 'size', queryName: 'size', isMeasure: true, format: '#,0.00', roles: { Size: true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) };
        public longitudeColumn: powerbi.DataViewMetadataColumn = { displayName: 'longitude', queryName: 'longitude', isMeasure: true, roles: { X: true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) };
        public latitudeColumn: powerbi.DataViewMetadataColumn = { displayName: 'latitude', queryName: 'latitude', isMeasure: true, roles: { Y: true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) };
        public gradientColumn: powerbi.DataViewMetadataColumn = { displayName: 'gradient', queryName: 'gradient', isMeasure: true, roles: { Gradient: true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) };

        public seriesValues = ['A', 'B', 'C', 'D'];

        public objects: powerbi.DataViewObjects;
        public categoryObjects: powerbi.DataViewObjects[];

        private suppressCategories = false;

        private sizeValues: SeriesValues[] = [
            {
            values: [100, 200, 300],
            subtotal: 600,
            }, {
                values: [10, 20, 30],
                subtotal: 60,
            }, {
                values: [1000, 2000, 3000],
                subtotal: 6000,
            }, {
                values: [1, 2, 3],
                subtotal: 6,
            }
        ];
        private longitudeValues: SeriesValues[] = [
            {
            values: [46.87, 37.81, 34.68],
                subtotal: 119.36
            }, {
                values: [460.87, 370.81, 340.68],
                subtotal: 1172.36
            }, {
                values: [4.87, 3.81, 3.68],
                subtotal: 12.36
            }, {
                values: [40.87, 30.81, 30.68],
                subtotal: 101.36
            }
        ];
        private latitudeValues: SeriesValues[] = [
            {
            values: [-114, -122.46, -111.76],
            subtotal: -348.22
            }, {
                values: [-1140, -1220.46, -1110.76],
                subtotal: -3471.22
            }, {
                values: [-11, -12.46, -11.76],
                subtotal: -35.22
            }, {
                values: [-1, -1.46, -1.76],
                subtotal: -4.22
            }
        ];
        private gradientValues: SeriesValues[] = [
            {
                values: [75, 50, 0],
                subtotal: 125,
            }, {
                values: [25, 10, 40],
                subtotal: 75,
            }, {
                values: [50, 30, 20],
                subtotal: 100,
            }, {
                values: [80, 20, 70],
                subtotal: 170,
            },
        ];

        private buildCategories(dataViewMetadata: powerbi.DataViewMetadata): powerbi.DataViewCategoryColumn[] {
            if (this.suppressCategories)
                return;

                dataViewMetadata.columns.push(this.categoryColumn);

            let categoryIdentities = this.categoryValues.map((v) => mocks.dataViewScopeIdentityWithEquality(this.categoryColumnExpr, v));
            var categories: powerbi.DataViewCategoryColumn[] = [{
                    source: this.categoryColumn,
                    values: this.categoryValues,
                identity: categoryIdentities,
                }];

            if (this.categoryObjects)
                categories[0].objects = this.categoryObjects;

            return categories;
            }

        public build(size: boolean, longLat: boolean, gradient: boolean = false): powerbi.DataView {
            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [],
            };
            if (this.objects)
                dataViewMetadata.objects = this.objects;

            var valueDataArray: powerbi.DataViewValueColumn[] = [];
            var categories: powerbi.DataViewCategoryColumn[] = this.buildCategories(dataViewMetadata);
            if (size) {
                dataViewMetadata.columns.push(this.sizeColumn);
                valueDataArray.push({
                    source: this.sizeColumn,
                    values: this.sizeValues[0].values,
                    subtotal: this.sizeValues[0].subtotal,
                });
            }
            if (longLat) {
                dataViewMetadata.columns.push(this.longitudeColumn);
                dataViewMetadata.columns.push(this.latitudeColumn);
                valueDataArray.push({
                    source: this.longitudeColumn,
                    values: this.longitudeValues[0].values,
                    subtotal: this.longitudeValues[0].subtotal,
                });
                valueDataArray.push({
                    source: this.latitudeColumn,
                    values: this.latitudeValues[0].values,
                    subtotal: this.latitudeValues[0].subtotal,
                });
            }
            if (gradient) {
                dataViewMetadata.columns.push(this.gradientColumn);
                valueDataArray.push({
                    source: this.gradientColumn,
                    values: this.gradientValues[0].values,
                    subtotal: this.gradientValues[0].subtotal,
                });
            }

            return <powerbi.DataView> {
                metadata: dataViewMetadata,
                categorical: {
                    categories: categories,
                    values: DataViewTransform.createValueColumns(valueDataArray),
                },
            };
        }

        public buildWithSeries(size: boolean, longLat: boolean, gradient: boolean = false): powerbi.DataView {
            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: []
            };
            if (this.objects)
                dataViewMetadata.objects = this.objects;

            var valueDataArray: powerbi.DataViewValueColumn[] = [];
            var categories: powerbi.DataViewCategoryColumn[] = this.buildCategories(dataViewMetadata);

            dataViewMetadata.columns.push(this.seriesColumn);

            for (let seriesIdx = 0; seriesIdx < this.seriesValues.length; seriesIdx++) {
                let seriesValue = this.seriesValues[seriesIdx];
                let seriesIdentity = mocks.dataViewScopeIdentityWithEquality(this.seriesColumnExpr, seriesValue);

                if (size) {
                    let sizeColumn: powerbi.DataViewMetadataColumn = $.extend({}, this.sizeColumn);
                    sizeColumn.groupName = seriesValue;

                    dataViewMetadata.columns.push(sizeColumn);
                    valueDataArray.push({
                        source: sizeColumn,
                        values: this.sizeValues[seriesIdx].values,
                        subtotal: this.sizeValues[seriesIdx].subtotal,
                        identity: seriesIdentity,
                    });
                }
                if (longLat) {
                    let longitudeColumn: powerbi.DataViewMetadataColumn = $.extend({}, this.longitudeColumn);
                    longitudeColumn.groupName = seriesValue;
                    let latitudeColumn: powerbi.DataViewMetadataColumn = $.extend({}, this.latitudeColumn);
                    latitudeColumn.groupName = seriesValue;

                    dataViewMetadata.columns.push(longitudeColumn);
                    dataViewMetadata.columns.push(latitudeColumn);
                    valueDataArray.push({
                        source: longitudeColumn,
                        values: this.longitudeValues[seriesIdx].values,
                        subtotal: this.longitudeValues[seriesIdx].subtotal,
                        identity: seriesIdentity,
                    });
                    valueDataArray.push({
                        source: latitudeColumn,
                        values: this.latitudeValues[seriesIdx].values,
                        subtotal: this.latitudeValues[seriesIdx].subtotal,
                        identity: seriesIdentity,
                    });
                }
                if (gradient) {
                    let gradientColumn: powerbi.DataViewMetadataColumn = $.extend({}, this.gradientColumn);
                    gradientColumn.groupName = seriesValue;

                    dataViewMetadata.columns.push(gradientColumn);
                    valueDataArray.push({
                        source: this.gradientColumn,
                        values: this.gradientValues[seriesIdx].values,
                        subtotal: this.gradientValues[seriesIdx].subtotal,
                        identity: seriesIdentity,
                    });
                }
            }

            return <powerbi.DataView> {
                metadata: dataViewMetadata,
                categorical: {
                    categories: categories,
                    values: DataViewTransform.createValueColumns(valueDataArray, [this.seriesColumnExpr], this.seriesColumn),
                }
            };
        }

        public withAddresses(): MapDataBuilder {
            this.categoryValues = this.addressCategoryValues;
            this.categoryColumn = this.addressCategoryColumn;
            this.categoryColumnExpr = this.addressColumnExpr;
            return this;
        }

        public withoutCategory(): MapDataBuilder {
            this.suppressCategories = true;
            return this;
        }

        public withNullValue(): MapDataBuilder {
            this.sizeValues[0].values[1] = null;
            return this;
        }

        public withCategoryLabels(color?: string, labelDisplayUnits?: number, labelPrecision?: number, fontSize?: number): MapDataBuilder {
            if (!this.objects) {
                this.objects = {};
            }
            this.objects["categoryLabels"] = <powerbi.visuals.DataLabelObject> {
                show: true,
                color: { solid: { color: color } },
                labelDisplayUnits: labelDisplayUnits,
                labelPosition: undefined,
                labelPrecision: labelPrecision,
                fontSize: fontSize || dataLabelUtils.DefaultFontSizeInPt,
            };
            return this;
        };

        public withShortCategoryNames(): MapDataBuilder {
            this.categoryValues = this.shortCategoryValues;
            return this;
        }

        public withCategoriesAsSeries(): MapDataBuilder {
            this.seriesColumn = this.categoryColumn;
            this.seriesValues = this.categoryValues;
            this.seriesColumnExpr = this.categoryColumnExpr;

            // values should only be expressed on the diagonal
            this.clearNonDiagonalValues(this.sizeValues);
            this.clearNonDiagonalValues(this.latitudeValues);
            this.clearNonDiagonalValues(this.longitudeValues);

            return this;
        }

        private clearNonDiagonalValues(array: SeriesValues[]): void {
            for (let i = 0; i < array.length; i++) {
                for (let j = 0; j < array[i].values.length; j++) {
                    if (i !== j)
                        array[i].values[j] = null;
                }

                array[i].subtotal = array[i].values[i];
            }
        }
    }

    interface SeriesValues {
        values: number[];
        subtotal: number;
    }

    class MapVisualBuilder {
        private _style: powerbi.IVisualStyle;
        public get style(): powerbi.IVisualStyle { return this._style; }

        private _host: powerbi.IVisualHostServices;
        public get host(): powerbi.IVisualHostServices { return this._host; }

        private _svg: D3.Selection;
        private _viewport: powerbi.IViewport;

        private _element: JQuery;
        public get element(): JQuery { return this._element; }

        private _testGeocoder: powerbi.IGeocoder;
        public get testGeocoder(): powerbi.IGeocoder { return this._testGeocoder; }

        private _testMapControlFactory: powerbi.visuals.IMapControlFactory;
        public get testMapControlFactory(): powerbi.visuals.IMapControlFactory { return this._testMapControlFactory; }

        private _visual: powerbi.IVisual;

        constructor() {
            this._style = powerbi.visuals.visualStyles.create();
            this._host = mocks.createVisualHostServices();
            this._svg = d3.select($('<svg/>').get(0));
            this._viewport = {
                height: 500,
                width: 500,
            };
            this._element = powerbitests.helpers.testDom('500', '500');
            this._testGeocoder = new mocks.MockGeocoder();
            this._testMapControlFactory = {
                createMapControl: (element, options) => {
                    return <any>(new mocks.MockMapControl(this._element[0], 500, 500));
                },
                ensureMap: (action: () => void) => {
                    Microsoft.Maps = <any>mocks.MockMaps; // Hook the mock up to Microsoft.Maps for use in Map code
                    action();
                },
            };
        }

        public build(filledMap: boolean, minerva: boolean = false): powerbi.IVisual {
            this._visual = new Map({ filledMap: filledMap, geocoder: this._testGeocoder, mapControlFactory: this._testMapControlFactory });
            this._visual.init(this.buildInitOptions());

            return this._visual;
        }

        public buildInitOptions(): powerbi.VisualInitOptions {
            let host = powerbi.Prototype.inherit(this._host, h => h.geocoder = () => this.testGeocoder);

            return <powerbi.VisualInitOptions> {
                element: this._element,
                host: host,
                style: this._style,
                viewport: this._viewport,
                interactivity: { isInteractiveLegend: false },
                animation: { transitionImmediate: true },
                svg: this._svg,
            };
        }

        public withSize(width: number, height: number): MapVisualBuilder {
            this._element = powerbitests.helpers.testDom(height.toString(), width.toString());
            this._viewport = {
                width: width,
                height: height,
            };

            return this;
        }
    }
}

// Declaration of the Microsoft.Maps module with something inside it so it actually gets compiled
module Microsoft.Maps {
    export let mock;
}