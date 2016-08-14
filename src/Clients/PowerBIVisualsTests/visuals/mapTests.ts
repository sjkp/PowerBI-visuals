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
    import ValueType = powerbi.ValueType;
    import PrimitiveType = powerbi.PrimitiveType;
    import LegendPosition = powerbi.visuals.LegendPosition;
    import ILegend = powerbi.visuals.ILegend;
    import dataLabelUtils = powerbi.visuals.dataLabelUtils;
    import PixelConverter = jsCommon.PixelConverter;
    import MapShapeDataPointRenderer = powerbi.visuals.MapShapeDataPointRenderer;
    import ColorHelper = powerbi.visuals.ColorHelper;
    import DataView = powerbi.DataView;
    import SelectionIdBuilder = powerbi.visuals.SelectionIdBuilder;
    import IGeoTaggingAnalyzerService = powerbi.IGeoTaggingAnalyzerService;
    import MapData = powerbi.visuals.MapData;
    import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

    powerbitests.mocks.setLocale();

    describe("Map", () => {
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
                expect(powerbi.visuals.plugins.map.capabilities).toBe(powerbi.visuals.mapCapabilities);
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
                    ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double, "Latitude")
                ]);

                expect(powerbi.visuals.mapCapabilities.dataRoles[3].preferredTypes.map(ValueType.fromDescriptor)).toEqual([
                    ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double, "Longitude")
                ]);
            });

            it('FormatString property should match calculated', () => {
                expect(powerbi.data.DataViewObjectDescriptors.findFormatString(powerbi.visuals.mapCapabilities.objects)).toEqual(powerbi.visuals.mapProps.general.formatString);
            });
        });

        it ('globalMapControlLoaded is globally defined', () => {
            expect(globalMapControlLoaded).toBeDefined();
        });

        it('getMeasureIndexOfRole', () => {
            let dataView = new MapDataBuilder().build(true, true);
            let grouped = dataView.categorical.values.grouped();

            let result = powerbi.data.DataRoleHelper.getMeasureIndexOfRole(grouped, "InvalidRoleName");
            expect(result).toBe(-1);

            result = powerbi.data.DataRoleHelper.getMeasureIndexOfRole(grouped, "Size");
            expect(result).toBe(0);

            result = powerbi.data.DataRoleHelper.getMeasureIndexOfRole(grouped, "X");
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

        it('calculateRadius', () => {
            var range: powerbi.visuals.SimpleRange = { min: -100, max: 100 };

            // Null should be the minimum size
            let diff = 0;
            let result = Map.calculateRadius(range, null);
            expect(result).toBe(6);

            // Min
            diff = range.max - range.min;
            result = Map.calculateRadius(range, -100);
            expect(result).toBe(6);

            // Middle of zero
            result = Map.calculateRadius(range, 0);
            expect(result).toBe(14 / 2 + 6);

            // Max
            result = Map.calculateRadius(range, 100);
            expect(result).toBe(20);

            // No scale (div by zero or no range scenario
            result = Map.calculateRadius({ min: 100, max: 100 }, 100);
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

            it('with multiple measure columns, no "Size" role, none numeric', () => {
                let dataBuilder = new MapDataBuilder();
                dataBuilder.sizeColumn.roles = undefined;
                dataBuilder.sizeColumn.type = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text);
                dataBuilder.latitudeColumn.type = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text);
                dataBuilder.longitudeColumn.type = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text);
                let dataView = dataBuilder.build(true, true);
                expect(Map.hasSizeField(dataView.categorical.values, 0)).toBe(false);
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
                    let dataView = new MapDataBuilder().buildWithSeries(false, false);
                    expect(Map.shouldEnumerateDataPoints(dataView, /*usesSizeForGradient*/ false)).toBe(true);
                });
            });
        });

        describe('Regression test for Defect 6414910: should Enumerate Category Labels', () => {
            it('filled Map with filled map feature switch on', () => {
                expect(Map.shouldEnumerateCategoryLabels(/*enableGeoShaping*/ true, /*filledMapDataLabelsEnabled*/ true)).toBe(true);
            });

            it('filled Map with filled map feature switch off', () => {
                expect(Map.shouldEnumerateCategoryLabels(/*enableGeoShaping*/ true, /*filledMapDataLabelsEnabled*/ false)).toBe(false);
            });

            it('Bubble Map with filled map feature switch on', () => {
                expect(Map.shouldEnumerateCategoryLabels(/*enableGeoShaping*/ false, /*filledMapDataLabelsEnabled*/ true)).toBe(true);
            });

            it('Bubble Map with filled map feature switch off', () => {
                expect(Map.shouldEnumerateCategoryLabels(/*enableGeoShaping*/ false, /*filledMapDataLabelsEnabled*/ false)).toBe(true);
            });
        });

        it("enumerateDataPoints with dynamic series", () => {
            let dataBuilder = new MapDataBuilder();
            let dataView = dataBuilder.buildWithSeries(true, false);

            let colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
            let fillProp = <powerbi.DataViewObjectPropertyIdentifier>{ objectName: "dataPoint", propertyName: "fill" };
            let colorHelper = new ColorHelper(colors, fillProp);

            let enumerationBuilder = new powerbi.visuals.ObjectEnumerationBuilder();
            var legendDataPoints = Map.createLegendData(dataView, colorHelper).dataPoints;
            Map.enumerateDataPoints(enumerationBuilder, legendDataPoints, colors, true, null, false, []);
            let enumeratedDataPoints = enumerationBuilder.complete();

            expect(enumeratedDataPoints.instances.length).toBe(legendDataPoints.length);
            
            // ensure first object is 'fill' and not 'defaultColor'
            expect(enumeratedDataPoints.instances[0]['properties']['fill']).toBeDefined();

            let series0Id = powerbi.visuals.SelectionIdBuilder.builder()
                .withSeries(dataView.categorical.values, dataView.categorical.values[0])
                .createSelectionId();
            expect(enumeratedDataPoints.instances[0].selector).toEqual(series0Id.getSelector());
        });

        it('enumerateDataPoints correctly handles hasDynamicSeries=true', () => {
            let dataBuilder = new MapDataBuilder();
            let dataView = dataBuilder.buildWithSeries(true, false);
            let visualBuilder = new MapVisualBuilder();
            let visual = visualBuilder.build(false, true);

            visual.onDataChanged({ dataViews: [dataView] });

            let result = visual.enumerateObjectInstances({
                objectName: 'legend',
            });
            expect((<powerbi.VisualObjectInstanceEnumerationObject>result).instances.length).toBe(1);
        });

        describe('enumerateDataPoints with hasDynamicSeries=false', () => {
            let dataView: DataView;
            let visual: Map;

            beforeEach(() => {
                let dataBuilder = new MapDataBuilder();
                dataView = dataBuilder.build(true, false);
                let visualBuilder = new MapVisualBuilder();
                visual = visualBuilder.build(false, true);

                visual.onDataChanged({ dataViews: [dataView] });
            });

            it('no legend', () => {
                let result = visual.enumerateObjectInstances({
                    objectName: 'legend',
                });
                expect(result).toBeUndefined();
            });

            it('data points for categories', () => {
                let enumeratedObjects = <VisualObjectInstanceEnumerationObject>visual.enumerateObjectInstances({
                    objectName: 'dataPoint',
                });

                let categoryColumn = dataView.categorical.categories[0];
                // +1 for default color and "show all"
                expect(enumeratedObjects.instances.length).toBe(categoryColumn.values.length + 1);

                for (let i = 0; i < categoryColumn.values.length; i++) {
                    let instance = enumeratedObjects.instances[i + 1];
                    expect(instance.displayName).toEqual(categoryColumn.values[i]);
                    expect(instance.properties['fill']).toBeDefined();

                    let id = powerbi.visuals.SelectionIdBuilder.builder()
                        .withCategory(categoryColumn, i)
                        .createSelectionId();
                    expect(instance.selector).toEqual(id.getSelector());
                }
            });
        });
    });

    describe("Map Converter", () => {
        describe("Simple category", () => {
            let colorHelper: ColorHelper;
            let dataBuilder: MapDataBuilder;
            let dataView: DataView;
            let geoTaggingAnalyzerService: IGeoTaggingAnalyzerService;
            let data: MapData;
            let categoryCount: number;
            const colors = [
                { value: "#000000" },
                { value: "#000001" },
                { value: "#000002" },
                { value: "#000003" }
            ];
            const fills = [
                'rgba(0,0,0,0.6)',
                'rgba(0,0,1,0.6)',
                'rgba(0,0,2,0.6)',
                'rgba(0,0,3,0.6)',
            ];

            beforeEach(() => {
                dataBuilder = new MapDataBuilder();
                dataView = dataBuilder.build(false, false);
                let fillProp = <powerbi.DataViewObjectPropertyIdentifier>{ objectName: "dataPoint", propertyName: "fill" };
                let palette = new powerbi.visuals.DataColorPalette(colors);
                colorHelper = new ColorHelper(palette, fillProp);
                geoTaggingAnalyzerService = powerbi.createGeoTaggingAnalyzerService(mocks.getLocalizedString);
                data = Map.converter(dataView, colorHelper, geoTaggingAnalyzerService, false);
                categoryCount = data.dataPoints.length;
            });

            it("Data point count", () => {
                expect(data.dataPoints.length).toBe(categoryCount);
            });

            it("Geocoding category", () => {
                expect(data.geocodingCategory).toBe('StateOrProvince');
            });

            it("Category value", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.categoryValue).toBe(dataBuilder.categoryValues[categoryIndex]);
                }
            });

            it("Geocode query", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.geocodingQuery).toBe(dataBuilder.categoryValues[categoryIndex]);
                }
            });

            it("SubDataPoint count", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.subDataPoints.length).toBe(1);
                }
            });

            it("SubDataPoint identity", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    let expectedId = new SelectionIdBuilder().withCategory(dataView.categorical.categories[0], categoryIndex).createSelectionId();
                    expect(dataPoint.subDataPoints[0].identity).toEqual(expectedId);
                }
            });

            it("SubDataPoint fill", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.subDataPoints[0].fill).toEqual(fills[0]);
                }
            });

            it("SubDataPoint tooltipInfo", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.subDataPoints[0].tooltipInfo).toEqual([
                        {
                            displayName: dataBuilder.categoryColumn.displayName, value: dataBuilder.categoryValues[categoryIndex],
                        },
                    ]);
                }
            });
        });

        describe("Numeric category", () => {
            let colorHelper: ColorHelper;
            let dataBuilder: MapDataBuilder;
            let dataView: DataView;
            let geoTaggingAnalyzerService: IGeoTaggingAnalyzerService;
            let data: MapData;
            let categoryCount: number;
            const colors = [
                { value: "#000000" },
                { value: "#000001" },
                { value: "#000002" },
                { value: "#000003" }
            ];

            beforeEach(() => {
                dataBuilder = new MapDataBuilder();
                dataView = dataBuilder.withNumericCategories().build(false, false);
                let fillProp = <powerbi.DataViewObjectPropertyIdentifier>{ objectName: "dataPoint", propertyName: "fill" };
                let palette = new powerbi.visuals.DataColorPalette(colors);
                colorHelper = new ColorHelper(palette, fillProp);
                geoTaggingAnalyzerService = powerbi.createGeoTaggingAnalyzerService(mocks.getLocalizedString);
                data = Map.converter(dataView, colorHelper, geoTaggingAnalyzerService, false);
                categoryCount = data.dataPoints.length;
            });

            it("Data point count", () => {
                expect(data.dataPoints.length).toBe(categoryCount);
            });

            it("Geocoding category", () => {
                expect(data.geocodingCategory).toBe('PostalCode');
            });

            it("Category value", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.categoryValue).toBe(dataBuilder.numericCategoryValuesFormatted[categoryIndex]);
                }
            });

            it("Geocode query", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.geocodingQuery).toBe(dataBuilder.numericCategoryValuesFormatted[categoryIndex]);
                }
            });

            it("SubDataPoint tooltipInfo", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.subDataPoints[0].tooltipInfo).toEqual([
                        {
                            displayName: dataBuilder.categoryColumn.displayName, value: dataBuilder.numericCategoryValuesFormatted[categoryIndex],
                        },
                    ]);
                }
            });
        });

        describe("Simple category with measures", () => {
            let colorHelper: ColorHelper;
            let dataBuilder: MapDataBuilder;
            let dataView: DataView;
            let geoTaggingAnalyzerService: IGeoTaggingAnalyzerService;
            let data: MapData;
            let categoryCount: number;

            beforeEach(() => {
                dataBuilder = new MapDataBuilder();
                dataView = dataBuilder.build(true, true, true, true);
                let fillProp = <powerbi.DataViewObjectPropertyIdentifier>{ objectName: "dataPoint", propertyName: "fill" };
                let palette = new powerbi.visuals.DataColorPalette();
                colorHelper = new ColorHelper(palette, fillProp);
                geoTaggingAnalyzerService = powerbi.createGeoTaggingAnalyzerService(mocks.getLocalizedString);
                data = Map.converter(dataView, colorHelper, geoTaggingAnalyzerService, /*isFilledMap*/false, /*tooltipBucketEnabled*/true);
                categoryCount = data.dataPoints.length;
            });

            it("Size value", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.value).toBe(dataBuilder.getSizeValue(categoryIndex));
                }
            });

            it("Latitude value", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.location.latitude).toBe(dataBuilder.getLatValue(categoryIndex));
                }
            });

            it("Longitude value", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.location.longitude).toBe(dataBuilder.getLongValue(categoryIndex));
                }
            });

            it("SubDataPoint tooltipInfo", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.subDataPoints[0].tooltipInfo).toEqual([
                        {
                            displayName: dataBuilder.categoryColumn.displayName, value: dataBuilder.categoryValues[categoryIndex],
                        },
                        {
                            displayName: dataBuilder.latitudeColumn.displayName, value: dataBuilder.getLatValue(categoryIndex).toString(),
                        },
                        {
                            displayName: dataBuilder.longitudeColumn.displayName, value: dataBuilder.getLongValue(categoryIndex).toString(),
                        },
                        {
                            displayName: dataBuilder.sizeColumn.displayName, value: powerbi.visuals.valueFormatter.format(dataBuilder.getSizeValue(categoryIndex), ',0.00'),
                        },
                        {
                            displayName: dataBuilder.gradientColumn.displayName, value: dataBuilder.getGradientValue(categoryIndex).toString(),
                        },
                        {
                            displayName: dataBuilder.tooltipColumn.displayName, value: dataBuilder.getTooltipsValue(categoryIndex).toString(),
                        },
                    ]);
                }
            });
        });

        describe("Simple category with null measures", () => {
            let colorHelper: ColorHelper;
            let dataBuilder: MapDataBuilder;
            let dataView: DataView;
            let geoTaggingAnalyzerService: IGeoTaggingAnalyzerService;
            let data: MapData;
            let categoryCount: number;

            beforeEach(() => {
                dataBuilder = new MapDataBuilder();
                dataView = dataBuilder.withNullLatLong().build(true, true);
                let fillProp = <powerbi.DataViewObjectPropertyIdentifier>{ objectName: "dataPoint", propertyName: "fill" };
                let palette = new powerbi.visuals.DataColorPalette();
                colorHelper = new ColorHelper(palette, fillProp);
                geoTaggingAnalyzerService = powerbi.createGeoTaggingAnalyzerService(mocks.getLocalizedString);
                data = Map.converter(dataView, colorHelper, geoTaggingAnalyzerService, false);
                categoryCount = data.dataPoints.length;
            });

            it("Size value", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.value).toBe(dataBuilder.getSizeValue(categoryIndex));
                }
            });

            it("Latitude value", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    if (categoryIndex === 1) {
                        expect(dataPoint.location).toBeUndefined();
                    }
                    else {
                        expect(dataPoint.location.latitude).toBe(dataBuilder.getLatValue(categoryIndex));
                    }
                }
            });

            it("Longitude value", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    if (categoryIndex === 1) {
                        expect(dataPoint.location).toBeUndefined();
                    }
                    else {
                        expect(dataPoint.location.longitude).toBe(dataBuilder.getLongValue(categoryIndex));
                    }
                }
            });

            it("SubDataPoint tooltipInfo", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    if (categoryIndex === 1) {
                        expect(dataPoint.subDataPoints[0].tooltipInfo).toEqual([
                            {
                                displayName: dataBuilder.categoryColumn.displayName, value: dataBuilder.categoryValues[categoryIndex],
                            },
                            {
                                displayName: dataBuilder.latitudeColumn.displayName, value: '(Blank)',
                            },
                            {
                                displayName: dataBuilder.longitudeColumn.displayName, value: '(Blank)',
                            },
                            {
                                displayName: dataBuilder.sizeColumn.displayName, value: powerbi.visuals.valueFormatter.format(dataBuilder.getSizeValue(categoryIndex), ',0.00'),
                            },
                        ]);
                    }
                    else {
                        expect(dataPoint.subDataPoints[0].tooltipInfo).toEqual([
                            {
                                displayName: dataBuilder.categoryColumn.displayName, value: dataBuilder.categoryValues[categoryIndex],
                            },
                            {
                                displayName: dataBuilder.latitudeColumn.displayName, value: dataBuilder.getLatValue(categoryIndex).toString(),
                            },
                            {
                                displayName: dataBuilder.longitudeColumn.displayName, value: dataBuilder.getLongValue(categoryIndex).toString(),
                            },
                            {
                                displayName: dataBuilder.sizeColumn.displayName, value: powerbi.visuals.valueFormatter.format(dataBuilder.getSizeValue(categoryIndex), ',0.00'),
                            },
                        ]);
                    }
                }
            });
        });

        describe("Simple category with 0 values (bubble)", () => {
            let colorHelper: ColorHelper;
            let dataBuilder: MapDataBuilder;
            let dataView: DataView;
            let geoTaggingAnalyzerService: IGeoTaggingAnalyzerService;
            let data: MapData;
            let categoryCount: number;

            beforeEach(() => {
                dataBuilder = new MapDataBuilder();
                dataView = dataBuilder.withZeroValue().build(true, false);
                let fillProp = <powerbi.DataViewObjectPropertyIdentifier>{ objectName: "dataPoint", propertyName: "fill" };
                let palette = new powerbi.visuals.DataColorPalette();
                colorHelper = new ColorHelper(palette, fillProp);
                geoTaggingAnalyzerService = powerbi.createGeoTaggingAnalyzerService(mocks.getLocalizedString);
                data = Map.converter(dataView, colorHelper, geoTaggingAnalyzerService, false);
                categoryCount = data.dataPoints.length;
            });

            it("Size value", () => {
                expect(data.dataPoints[0].value).toBe(dataBuilder.getSizeValue(0));
                // The category index === 1 is skipped due to being a bubble map value with a size of 0
                expect(data.dataPoints[1].value).toBe(dataBuilder.getSizeValue(2));
            });

            it("SubDataPoint tooltipInfo", () => {
                expect(data.dataPoints[0].subDataPoints[0].tooltipInfo).toEqual([
                    {
                        displayName: dataBuilder.categoryColumn.displayName, value: dataBuilder.categoryValues[0],
                    },
                    {
                        displayName: dataBuilder.sizeColumn.displayName, value: powerbi.visuals.valueFormatter.format(dataBuilder.getSizeValue(0), ',0.00'),
                    },
                ]);
                // The category index === 1 is skipped due to being a bubble map value with a size of 0
                expect(data.dataPoints[1].subDataPoints[0].tooltipInfo).toEqual([
                    {
                        displayName: dataBuilder.categoryColumn.displayName, value: dataBuilder.categoryValues[2],
                    },
                    {
                        displayName: dataBuilder.sizeColumn.displayName, value: powerbi.visuals.valueFormatter.format(dataBuilder.getSizeValue(2), ',0.00'),
                    },
                ]);
            });
        });

        describe("Simple category with 0 values (filled)", () => {
            let colorHelper: ColorHelper;
            let dataBuilder: MapDataBuilder;
            let dataView: DataView;
            let geoTaggingAnalyzerService: IGeoTaggingAnalyzerService;
            let data: MapData;
            let categoryCount: number;

            beforeEach(() => {
                dataBuilder = new MapDataBuilder();
                dataView = dataBuilder.withZeroValue().build(true, false);
                let fillProp = <powerbi.DataViewObjectPropertyIdentifier>{ objectName: "dataPoint", propertyName: "fill" };
                let palette = new powerbi.visuals.DataColorPalette();
                colorHelper = new ColorHelper(palette, fillProp);
                geoTaggingAnalyzerService = powerbi.createGeoTaggingAnalyzerService(mocks.getLocalizedString);
                data = Map.converter(dataView, colorHelper, geoTaggingAnalyzerService, true);
                categoryCount = data.dataPoints.length;
            });

            it("Size value", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.value).toBe(dataBuilder.getSizeValue(categoryIndex));
                }
            });

            it("SubDataPoint tooltipInfo", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.subDataPoints[0].tooltipInfo).toEqual([
                        {
                            displayName: dataBuilder.categoryColumn.displayName, value: dataBuilder.categoryValues[categoryIndex],
                        },
                        {
                            displayName: dataBuilder.sizeColumn.displayName, value: powerbi.visuals.valueFormatter.format(dataBuilder.getSizeValue(categoryIndex), ',0.00'),
                        },
                    ]);
                }
            });
        });

        describe("Category and series with measures", () => {
            let colorHelper: ColorHelper;
            let dataBuilder: MapDataBuilder;
            let dataView: DataView;
            let geoTaggingAnalyzerService: IGeoTaggingAnalyzerService;
            let data: MapData;
            let categoryCount: number;
            let seriesCount: number;
            const colors = [
                { value: "#000000" },
                { value: "#000001" },
                { value: "#000002" },
                { value: "#000003" }
            ];
            const fills = [
                'rgba(0,0,0,0.6)',
                'rgba(0,0,1,0.6)',
                'rgba(0,0,2,0.6)',
                'rgba(0,0,3,0.6)',
            ];

            beforeEach(() => {
                dataBuilder = new MapDataBuilder();
                dataView = dataBuilder.buildWithSeries(true, true);
                let fillProp = <powerbi.DataViewObjectPropertyIdentifier>{ objectName: "dataPoint", propertyName: "fill" };
                let palette = new powerbi.visuals.DataColorPalette(colors);
                colorHelper = new ColorHelper(palette, fillProp);
                geoTaggingAnalyzerService = powerbi.createGeoTaggingAnalyzerService(mocks.getLocalizedString);
                data = Map.converter(dataView, colorHelper, geoTaggingAnalyzerService, false);
                categoryCount = data.dataPoints.length;
                seriesCount = data.dataPoints[0].subDataPoints.length;
            });

            it("Size value", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
                        expect(dataPoint.subDataPoints[seriesIndex].value).toBe(dataBuilder.getSizeValue(categoryIndex, seriesIndex));
                    }
                }
            });

            it("Fill value", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
                        expect(dataPoint.subDataPoints[seriesIndex].fill).toBe(fills[seriesIndex]);
                    }
                }
            });

            it("SubDataPoint tooltipInfo", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
                        let dataPoint = data.dataPoints[categoryIndex];
                        expect(dataPoint.subDataPoints[seriesIndex].tooltipInfo).toEqual([
                            {
                                displayName: dataBuilder.categoryColumn.displayName, value: dataBuilder.categoryValues[categoryIndex],
                            },
                            {
                                displayName: dataBuilder.seriesColumn.displayName, value: dataBuilder.seriesValues[seriesIndex],
                            },
                            {
                                displayName: dataBuilder.latitudeColumn.displayName, value: dataBuilder.getLatValue(categoryIndex, seriesIndex).toString(),
                            },
                            {
                                displayName: dataBuilder.longitudeColumn.displayName, value: dataBuilder.getLongValue(categoryIndex, seriesIndex).toString(),
                            },
                            {
                                displayName: dataBuilder.sizeColumn.displayName, value: powerbi.visuals.valueFormatter.format(dataBuilder.getSizeValue(categoryIndex, seriesIndex), ',0.00'),
                            },
                        ]);
                    }
                }
            });

            it("Null series name doesn't throw exception", () => {
                dataView = dataBuilder.withNullSeriesName().buildWithSeries(true, true);
                data = Map.converter(dataView, colorHelper, geoTaggingAnalyzerService, false);
                let legendData = Map.createLegendData(dataView, colorHelper);
                expect(data).toBeTruthy(); // Simple checks to expect this not to fail
                expect(legendData).toBeTruthy();
            });
        });

        describe("Category and category as series with measures", () => {
            let colorHelper: ColorHelper;
            let dataBuilder: MapDataBuilder;
            let dataView: DataView;
            let geoTaggingAnalyzerService: IGeoTaggingAnalyzerService;
            let data: MapData;
            let categoryCount: number;
            let seriesCount: number;
            const colors = [
                { value: "#000000" },
                { value: "#000001" },
                { value: "#000002" },
                { value: "#000003" }
            ];
            const fills = [
                'rgba(0,0,0,0.6)',
                'rgba(0,0,1,0.6)',
                'rgba(0,0,2,0.6)',
                'rgba(0,0,3,0.6)',
            ];

            beforeEach(() => {
                dataBuilder = new MapDataBuilder();
                dataView = dataBuilder.withCategoriesAsSeries().buildWithSeries(true, true);
                let fillProp = <powerbi.DataViewObjectPropertyIdentifier>{ objectName: "dataPoint", propertyName: "fill" };
                let palette = new powerbi.visuals.DataColorPalette(colors);
                colorHelper = new ColorHelper(palette, fillProp);
                geoTaggingAnalyzerService = powerbi.createGeoTaggingAnalyzerService(mocks.getLocalizedString);
                data = Map.converter(dataView, colorHelper, geoTaggingAnalyzerService, false);
                categoryCount = data.dataPoints.length;
                seriesCount = data.dataPoints[0].subDataPoints.length;
            });

            it("Category and series count", () => {
                expect(categoryCount).toBe(3);
                expect(seriesCount).toBe(1);
            });

            it("Size value", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.value).toBe(dataBuilder.getSizeValue(categoryIndex, categoryIndex));
                    expect(dataPoint.subDataPoints[0].value).toBe(dataBuilder.getSizeValue(categoryIndex, categoryIndex));
                }
            });

            it("Fill value", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.subDataPoints[0].fill).toBe(fills[categoryIndex]);
                }
            });

            it("Latitude value", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.location.latitude).toBe(dataBuilder.getLatValue(categoryIndex, categoryIndex));
                }
            });

            it("Longitude value", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.location.longitude).toBe(dataBuilder.getLongValue(categoryIndex, categoryIndex));
                }
            });

            it("SubDataPoint tooltipInfo", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.subDataPoints[0].tooltipInfo).toEqual([
                        {
                            displayName: dataBuilder.categoryColumn.displayName, value: dataBuilder.categoryValues[categoryIndex],
                        },
                        {
                            displayName: dataBuilder.seriesSameAsCategoryColumn.displayName, value: dataBuilder.categoryValues[categoryIndex],
                        },
                        {
                            displayName: dataBuilder.latitudeColumn.displayName, value: dataBuilder.getLatValue(categoryIndex, categoryIndex).toString(),
                        },
                        {
                            displayName: dataBuilder.longitudeColumn.displayName, value: dataBuilder.getLongValue(categoryIndex, categoryIndex).toString(),
                        },
                        {
                            displayName: dataBuilder.sizeColumn.displayName, value: powerbi.visuals.valueFormatter.format(dataBuilder.getSizeValue(categoryIndex, categoryIndex), ',0.00'),
                        },
                    ]);
                }
            });
        });

        describe("Category and series with no measures", () => {
            let colorHelper: ColorHelper;
            let dataBuilder: MapDataBuilder;
            let dataView: DataView;
            let geoTaggingAnalyzerService: IGeoTaggingAnalyzerService;
            let data: MapData;
            let categoryCount: number;
            let seriesCount: number;
            const colors = [
                { value: "#000000" },
                { value: "#000001" },
                { value: "#000002" },
                { value: "#000003" }
            ];
            const fills = [
                'rgba(0,0,0,0.6)',
                'rgba(0,0,1,0.6)',
                'rgba(0,0,2,0.6)',
                'rgba(0,0,3,0.6)',
            ];

            beforeEach(() => {
                dataBuilder = new MapDataBuilder();
                dataView = dataBuilder.buildWithSeries(false, false);
                let fillProp = <powerbi.DataViewObjectPropertyIdentifier>{ objectName: "dataPoint", propertyName: "fill" };
                let palette = new powerbi.visuals.DataColorPalette(colors);
                colorHelper = new ColorHelper(palette, fillProp);
                geoTaggingAnalyzerService = powerbi.createGeoTaggingAnalyzerService(mocks.getLocalizedString);
                data = Map.converter(dataView, colorHelper, geoTaggingAnalyzerService, false);
                categoryCount = data.dataPoints.length;
                seriesCount = data.dataPoints[0].subDataPoints.length;
            });

            it("Size value", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
                        expect(dataPoint.subDataPoints[seriesIndex].value).toBeUndefined();
                    }
                }
            });

            it("Fill value", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
                        expect(dataPoint.subDataPoints[seriesIndex].fill).toBe(fills[seriesIndex]);
                    }
                }
            });

            it("SubDataPoint tooltipInfo", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
                        let dataPoint = data.dataPoints[categoryIndex];
                        expect(dataPoint.subDataPoints[seriesIndex].tooltipInfo).toEqual([
                            {
                                displayName: dataBuilder.categoryColumn.displayName, value: dataBuilder.categoryValues[categoryIndex],
                            },
                            {
                                displayName: dataBuilder.seriesColumn.displayName, value: dataBuilder.seriesValues[seriesIndex],
                            },
                        ]);
                    }
                }
            });

            it("Null series name doesn't throw exception", () => {
                dataView = dataBuilder.withNullSeriesName().buildWithSeries(true, true);
                data = Map.converter(dataView, colorHelper, geoTaggingAnalyzerService, false);
                let legendData = Map.createLegendData(dataView, colorHelper);
                expect(data).toBeTruthy(); // Simple checks to expect this not to fail
                expect(legendData).toBeTruthy();
            });
        });

        describe("Category and category as series with no measures", () => {
            let colorHelper: ColorHelper;
            let dataBuilder: MapDataBuilder;
            let dataView: DataView;
            let geoTaggingAnalyzerService: IGeoTaggingAnalyzerService;
            let data: MapData;
            let categoryCount: number;
            const colors = [
                { value: "#000000" },
                { value: "#000001" },
                { value: "#000002" },
                { value: "#000003" }
            ];
            const fills = [
                'rgba(0,0,0,0.6)',
                'rgba(0,0,1,0.6)',
                'rgba(0,0,2,0.6)',
                'rgba(0,0,3,0.6)',
            ];

            beforeEach(() => {
                dataBuilder = new MapDataBuilder();
                dataView = dataBuilder.withCategoriesAsSeries().buildWithCategoryAsSeries(false, false);
                let fillProp = <powerbi.DataViewObjectPropertyIdentifier>{ objectName: "dataPoint", propertyName: "fill" };
                let palette = new powerbi.visuals.DataColorPalette(colors);
                colorHelper = new ColorHelper(palette, fillProp);
                geoTaggingAnalyzerService = powerbi.createGeoTaggingAnalyzerService(mocks.getLocalizedString);
                data = Map.converter(dataView, colorHelper, geoTaggingAnalyzerService, false);
                categoryCount = data.dataPoints.length;
            });

            it("Category and series count", () => {
                expect(categoryCount).toBe(3);
            });

            it("Fill value", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.subDataPoints[0].fill).toBe(fills[categoryIndex]);
                }
            });

            it("SubDataPoint tooltipInfo", () => {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let dataPoint = data.dataPoints[categoryIndex];
                    expect(dataPoint.subDataPoints[0].tooltipInfo).toEqual([
                        {
                            displayName: dataBuilder.categoryColumn.displayName, value: dataBuilder.categoryValues[categoryIndex],
                        },
                    ]);
                }
            });
        });
    });

    describe("Map geocoding", () => {
        let visualBuilder: MapVisualBuilder;
        let v: powerbi.IVisual;
        let scheduleRedrawInterval: number;

        beforeEach(() => {
            visualBuilder = new MapVisualBuilder();
            v = visualBuilder.build(false);

            // immediate redraw
            scheduleRedrawInterval = Map.ScheduleRedrawInterval;
            Map.ScheduleRedrawInterval = 0;
        });

        afterEach(() => {
            Map.ScheduleRedrawInterval = scheduleRedrawInterval;
        });

        it("Bubbles only after requests complete", (done) => {
            let dataBuilder = new MapDataBuilder();
            let dataView = dataBuilder.build(false, false);

            // need the original geocode method so we can call from the spy
            let geocoder = visualBuilder.testGeocoder;
            let geocode = geocoder.geocode;

            // ensure geocoding is really async. remember what the geocoder would return but give back an
            // unresolved one.
            type GeocodingCalls = { innerPromise: any; outerPromise: any };

            let geocodingCalls: GeocodingCalls[] = [];
            spyOn(geocoder, 'geocode').and.callFake((...args: any[]) => {
                let promises = { innerPromise: geocode.apply(geocoder, args), outerPromise: $.Deferred() };
                geocodingCalls.push(promises);
                return promises.outerPromise;
            });

            // prevent loading from cache so async attempt will be made (just making robust to changes in mock)
            spyOn(geocoder, 'tryGeocodeImmediate').and.returnValue(null);

            // this will start the geocoding
            v.onDataChanged({ dataViews: [dataView] });

            expect(geocodingCalls.length).toBe(dataBuilder.categoryValues.length);

            setTimeout(() => {
                // shouldn't be any bubbles because geocoding isn't yet complete
                let bubbles = getBubbles();
                expect(bubbles.length).toBe(0);

                // tie outerPromises to inner ones
                for (let pair of geocodingCalls)
                    ((inner, outer) => {
                        inner.then((location) => {
                            outer.resolve(location);
                        });
                    })(pair.innerPromise, pair.outerPromise);

                setTimeout(() => {
                    let bubbles = getBubbles();
                    expect(bubbles.length).toBe(dataBuilder.categoryValues.length);

                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it("Requests cancelled on data change", (done) => {
            let dataBuilder = new MapDataBuilder();
            let dataView = dataBuilder.build(false, false);

            // need the original geocode method so we can call from the spy
            let geocoder = visualBuilder.testGeocoder;
            let geocode = geocoder.geocode;

            // ensure geocoding is really async. remember what the geocoder would return but give back an
            // unresolved one.
            type GeocodingCalls = { innerPromise: any; outerPromise: any; isCancelled: boolean };

            let geocodingCalls: GeocodingCalls[] = [];
            spyOn(geocoder, 'geocode').and.callFake((query: string, category?: string, options?: powerbi.GeocodeOptions) => {
                expect(options && options.timeout).toBeTruthy();
                let promises: GeocodingCalls = {
                    innerPromise: geocode.apply(geocoder, [query, category, options]),
                    outerPromise: $.Deferred(),
                    isCancelled: false,
                };

                options.timeout.finally(() => {
                    promises.isCancelled = true;
                });

                geocodingCalls.push(promises);
                return promises.outerPromise;
            });

            // prevent loading from cache so async attempt will be made (just making robust to changes in mock)
            spyOn(geocoder, 'tryGeocodeImmediate').and.returnValue(null);

            // this will start the geocoding
            v.onDataChanged({ dataViews: [dataView] });

            let numberOfRequests = geocodingCalls.length;
            expect(numberOfRequests).toBe(dataBuilder.categoryValues.length);

            setTimeout(() => {
                // shouldn't be any bubbles because geocoding isn't yet complete
                let bubbles = getBubbles();
                expect(bubbles.length).toBe(0);

                // next query will the ones that haven't yet completed
                v.onDataChanged({ dataViews: [dataView] });

                setTimeout(() => {
                    for (let i = 0; i < numberOfRequests; ++i)
                        expect(geocodingCalls[i].isCancelled).toBe(true);

                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it("Requests cancelled on destroy", (done) => {
            let dataBuilder = new MapDataBuilder();
            let dataView = dataBuilder.build(false, false);

            // need the original geocode method so we can call from the spy
            let geocoder = visualBuilder.testGeocoder;
            let geocode = geocoder.geocode;

            // ensure geocoding is really async. remember what the geocoder would return but give back an
            // unresolved one.
            type GeocodingCalls = { innerPromise: any; outerPromise: any; isCancelled: boolean };

            let geocodingCalls: GeocodingCalls[] = [];
            spyOn(geocoder, 'geocode').and.callFake((query: string, category?: string, options?: powerbi.GeocodeOptions) => {
                expect(options && options.timeout).toBeTruthy();
                let promises: GeocodingCalls = {
                    innerPromise: geocode.apply(geocoder, [query, category, options]),
                    outerPromise: $.Deferred(),
                    isCancelled: false,
                };

                options.timeout.finally(() => {
                    promises.isCancelled = true;
                });

                geocodingCalls.push(promises);
                return promises.outerPromise;
            });

            // prevent loading from cache so async attempt will be made (just making robust to changes in mock)
            spyOn(geocoder, 'tryGeocodeImmediate').and.returnValue(null);

            // this will start the geocoding
            v.onDataChanged({ dataViews: [dataView] });

            let numberOfRequests = geocodingCalls.length;
            expect(numberOfRequests).toBe(dataBuilder.categoryValues.length);

            setTimeout(() => {
                v.destroy();

                setTimeout(() => {
                    for (let i = 0; i < numberOfRequests; ++i)
                        expect(geocodingCalls[i].isCancelled).toBe(true);

                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it("Bubbles render with numeric categories", (done) => {
            let dataBuilder = new MapDataBuilder();
            let dataView = dataBuilder.withNumericCategories().build(false, false);

            // need the original geocode method so we can call from the spy
            let geocoder = visualBuilder.testGeocoder;
            let geocode = geocoder.geocode;

            // ensure geocoding is really async. remember what the geocoder would return but give back an
            // unresolved one.
            type GeocodingCalls = { innerPromise: any; outerPromise: any };

            let geocodingCalls: GeocodingCalls[] = [];
            spyOn(geocoder, 'geocode').and.callFake((...args: any[]) => {
                let promises = { innerPromise: geocode.apply(geocoder, args), outerPromise: $.Deferred() };
                geocodingCalls.push(promises);
                return promises.outerPromise;
            });

            // prevent loading from cache so async attempt will be made (just making robust to changes in mock)
            spyOn(geocoder, 'tryGeocodeImmediate').and.returnValue(null);

            // this will start the geocoding
            v.onDataChanged({ dataViews: [dataView] });

            expect(geocodingCalls.length).toBe(dataBuilder.categoryValues.length);

            setTimeout(() => {
                // shouldn't be any bubbles because geocoding isn't yet complete
                let bubbles = getBubbles();
                expect(bubbles.length).toBe(0);

                // tie outerPromises to inner ones
                for (let pair of geocodingCalls)
                    ((inner, outer) => {
                        inner.then((location) => {
                            outer.resolve(location);
                        });
                    })(pair.innerPromise, pair.outerPromise);

                setTimeout(() => {
                    let bubbles = getBubbles();
                    expect(bubbles.length).toBe(dataBuilder.categoryValues.length);

                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
    });

    describe("Slow Bing Map load", () => {
        let scheduleRedrawInterval: number;

        beforeEach(() => {
            // immediate redraw
            scheduleRedrawInterval = Map.ScheduleRedrawInterval;
            Map.ScheduleRedrawInterval = 0;
        });

        afterEach(() => {
            Map.ScheduleRedrawInterval = scheduleRedrawInterval;
        });

        it("Geocoding completes after Maps eventually initializes", (done) => {
            let visualBuilder = new MapVisualBuilder();

            let mapControlFactory = visualBuilder.testMapControlFactory;
            let ensureMapMethod = mapControlFactory.ensureMap;
            let ensureMapRelease = $.Deferred();

            // defer calling back until later to simulate slow Bing Maps initialization
            spyOn(mapControlFactory, 'ensureMap').and.callFake((locale: string, action: () => void) => {
                ensureMapMethod.apply(mapControlFactory, [locale, () => { ensureMapRelease.then(() => { action(); }); } ]);
            });

            let v: powerbi.IVisual = visualBuilder.build(false);

            let dataBuilder = new MapDataBuilder();
            let dataView = dataBuilder.build(false, false);

            // need the original geocode method so we can call from the spy
            let geocoder = visualBuilder.testGeocoder;
            let geocode = geocoder.geocode;

            // ensure geocoding is really async. remember what the geocoder would return but give back an
            // unresolved one.
            type GeocodingCalls = { innerPromise: any; outerPromise: any; isCancelled: boolean };

            let geocodingCalls: GeocodingCalls[] = [];
            spyOn(geocoder, 'geocode').and.callFake((query: string, category?: string, options?: powerbi.GeocodeOptions) => {
                expect(options && options.timeout).toBeTruthy();
                let promises: GeocodingCalls = {
                    innerPromise: geocode.apply(geocoder, [query, category, options]),
                    outerPromise: $.Deferred(),
                    isCancelled: false,
                };

                options.timeout.finally(() => {
                    promises.isCancelled = true;
                });

                geocodingCalls.push(promises);
                return promises.outerPromise;
            });

            // prevent loading from cache so async attempt will be made (just making robust to changes in mock)
            spyOn(geocoder, 'tryGeocodeImmediate').and.returnValue(null);

            // give map data but it should not do any geocoding yet as it's waiting for Bing Maps to initialize
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect(geocodingCalls.length).toBe(0);

                // now complete Bing Maps initializtion
                ensureMapRelease.resolve();

                setTimeout(() => {
                    // geocoding should have started in ensureMap callback
                    expect(geocodingCalls.length).toBe(dataBuilder.categoryValues.length);

                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it("Destroy map before slow Bing Maps initialization completes", (done) => {
            let visualBuilder = new MapVisualBuilder();

            let mapControlFactory = visualBuilder.testMapControlFactory;
            let ensureMapMethod = mapControlFactory.ensureMap;
            let ensureMapRelease = $.Deferred();

            // defer calling back until later to simulate slow Bing Maps initialization
            spyOn(mapControlFactory, 'ensureMap').and.callFake((locale: string, action: () => void) => {
                ensureMapMethod.apply(mapControlFactory, [locale, () => { ensureMapRelease.then(() => { action(); }); }]);
            });

            let v: powerbi.IVisual = visualBuilder.build(false);

            let dataBuilder = new MapDataBuilder();
            let dataView = dataBuilder.build(false, false);

            // need the original geocode method so we can call from the spy
            let geocoder = visualBuilder.testGeocoder;
            let geocode = geocoder.geocode;

            // ensure geocoding is really async. remember what the geocoder would return but give back an
            // unresolved one.
            type GeocodingCalls = { innerPromise: any; outerPromise: any; isCancelled: boolean };

            let geocodingCalls: GeocodingCalls[] = [];
            spyOn(geocoder, 'geocode').and.callFake((query: string, category?: string, options?: powerbi.GeocodeOptions) => {
                expect(options && options.timeout).toBeTruthy();
                let promises: GeocodingCalls = {
                    innerPromise: geocode.apply(geocoder, [query, category, options]),
                    outerPromise: $.Deferred(),
                    isCancelled: false,
                };

                options.timeout.finally(() => {
                    promises.isCancelled = true;
                });

                geocodingCalls.push(promises);
                return promises.outerPromise;
            });

            // prevent loading from cache so async attempt will be made (just making robust to changes in mock)
            spyOn(geocoder, 'tryGeocodeImmediate').and.returnValue(null);

            // give map data but it should not do any geocoding yet as it's waiting for Bing Maps to initialize
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect(geocodingCalls.length).toBe(0);

                // Bing Maps initializtion completes after visual destroyed
                v.destroy();

                ensureMapRelease.resolve();

                setTimeout(() => {
                    // destroy is now detected and prevents geocoding.
                    expect(geocodingCalls.length).toBe(0);

                    // but cancelled because of the destroy
                    expect(_.every(geocodingCalls, c => c.isCancelled)).toBe(true);

                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
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
            let dataView = new MapDataBuilder().withCategoryLabels(null, null, null, 18).withShortCategoryNames().build(false, false);

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

            let seriesExpr = powerbi.data.SQExprShortSerializer.serializeArray(<powerbi.data.SQExpr[]>dataView.categorical.values.identityFields);
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

        it("Should draw category labels when enabled, plus stems", function (done) {
            var dataView = new MapDataBuilder().withCategoryLabels().withShortCategoryNames().build(false, false);
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {

                expect($(".labelGraphicsContext")).toBeInDOM();
                expect($(".labelGraphicsContext .label").length).toBe(3);
                expect($(".labelGraphicsContext .label").first().css('font-size')).toBe(PixelConverter.fromPoint(dataLabelUtils.DefaultFontSizeInPt));

                expect($(".leader-lines")).toBeInDOM();
                expect($(".leader-lines .line-label").length).toBe(3);

                done();
            }, powerbitests.DefaultWaitForRender);
        });

        it("Selecting the main shape of a location by polygon area", function () {

            let smallAreaShape: powerbi.IGeocodeBoundaryPolygon = {
                nativeBing: '', //contents aren't used.
                absoluteString: "",
                absolute: convertStringToFloatArray("651.42857 598.07649 360.71069 399.14985 232.41705 700.51064 331.77076 362.54979 5.5147103 333.66089 357.63656 323.71624 284.29287 " +
                    "4.5011369 402.56243 336.31585 683.48959 167.91896 404.46235 382.93639"),
                geographic: new Float64Array(3),
                absoluteBounds: {
                    left: 10,
                    top: 10,
                    width: 100,
                    height: 100,
                },
            };

            let largeAreaShape: powerbi.IGeocodeBoundaryPolygon = {
                nativeBing: '', //contents aren't used.
                absoluteString: "",
                absolute: convertStringToFloatArray("445.71429 812.36222 243.25675 885.30681 111.31949 715.29937 232.23533 537.2844 438.90267 597.27253"),
                geographic: new Float64Array(3),
                absoluteBounds: {
                    left: 10,
                    top: 10,
                    width: 30,
                    height: 30,
                }
            };

            let indexOfLargestShape: number = MapShapeDataPointRenderer.getIndexOfLargestShape([smallAreaShape, largeAreaShape]);
            expect(indexOfLargestShape).toBe(1);
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

    describe("Filled Map label data point creation", () => {
        let v: powerbi.IVisual;

        beforeEach(() => {
            v = new MapVisualBuilder().build(true);
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
            let labelColor = "#ffffff";
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

    function getBubbles(): JQuery {
        return $('.mapControl circle.bubble');
    }

    function callCreateLabelDataPoints(v: powerbi.IVisual): powerbi.LabelDataPoint[] {
        let map = <any>v;
        return map.dataPointRenderer.createLabelDataPoints();
    }

    function convertStringToFloatArray(path: string): Float64Array {
        let stringArray = path.split(" ");
        let f64s = new Float64Array(stringArray.length);

        for (let i: number = 0; i < stringArray.length; i++) {
            f64s[i] = parseFloat(stringArray[i]);
        }
        return f64s;
    }

    class MapDataBuilder {
        public categoryColumn: powerbi.DataViewMetadataColumn = { displayName: 'state', queryName: 'state', roles: { Category: true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) };
        public categoryAsSeriesColumn: powerbi.DataViewMetadataColumn = { displayName: 'state', queryName: 'state', roles: { Category: true, Series: true, }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) };
        public categoryValues: any[] = ['Montana', 'California', 'Arizona'];
        public shortCategoryValues = ['MT', 'CA', 'AZ'];
        public categoryColumnExpr: powerbi.data.SQExpr = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'state' });
        public addressCategoryColumn: powerbi.DataViewMetadataColumn = { displayName: 'address', queryName: 'address', roles: { Category: true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) };
        public addressCategoryValues = ['Some address', 'Some different address', 'Another different address'];
        public addressColumnExpr: powerbi.data.SQExpr = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'address' });
        public numericCategoryColumn: powerbi.DataViewMetadataColumn = { displayName: 'zip code', queryName: 'zip coe', roles: { Category: true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer) };
        public numericCategoryValues = [98033, 98034, 98052];
        public numericColumnExpr: powerbi.data.SQExpr = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'zip code' });
        public numericCategoryValuesFormatted = ["98033", "98034", "98052"];
        
        public seriesColumn: powerbi.DataViewMetadataColumn = { displayName: 'region', queryName: 'region', roles: { Series: true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) };
        public seriesSameAsCategoryColumn: powerbi.DataViewMetadataColumn = { displayName: 'state', queryName: 'state', roles: { Series: true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) };
        public seriesColumnExpr: powerbi.data.SQExpr = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'region' });;

        public sizeColumn: powerbi.DataViewMetadataColumn = { displayName: 'size', queryName: 'size', isMeasure: true, format: '#,0.00', roles: { Size: true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) };
        public longitudeColumn: powerbi.DataViewMetadataColumn = { displayName: 'longitude', queryName: 'longitude', isMeasure: true, roles: { X: true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) };
        public latitudeColumn: powerbi.DataViewMetadataColumn = { displayName: 'latitude', queryName: 'latitude', isMeasure: true, roles: { Y: true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) };
        public gradientColumn: powerbi.DataViewMetadataColumn = { displayName: 'gradient', queryName: 'gradient', isMeasure: true, roles: { Gradient: true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) };
        public tooltipColumn: powerbi.DataViewMetadataColumn = { displayName: 'tooltips', queryName: 'tooltips', isMeasure: true, roles: { Tooltips: true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) };

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
                values: [46.87, 37.81, 34.68],
                subtotal: 119.36
            }, {
                values: [46.87, 37.81, 34.68],
                subtotal: 119.36
            }, {
                values: [46.87, 37.81, 34.68],
                subtotal: 119.36
            }
        ];
        private latitudeValues: SeriesValues[] = [
            {
                values: [-114, -122.46, -111.76],
                subtotal: -348.22
            }, {
                values: [-114, -122.46, -111.76],
                subtotal: -348.22
            }, {
                values: [-114, -122.46, -111.76],
                subtotal: -348.22
            }, {
                values: [-114, -122.46, -111.76],
                subtotal: -348.22
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
        private tooltipsValues: SeriesValues[] = [
            {
                values: [10, 11, 12],
                subtotal: 33,
            }, {
                values: [20, 21, 22],
                subtotal: 63,
            }, {
                values: [30, 31, 32],
                subtotal: 93,
            }, {
                values: [40, 41, 42],
                subtotal: 123,
            },
        ];

        public build(size: boolean, longLat: boolean, gradient: boolean = false, tooltips: boolean = false): powerbi.DataView {
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
            if (tooltips) {
                dataViewMetadata.columns.push(this.tooltipColumn);
                valueDataArray.push({
                    source: this.tooltipColumn,
                    values: this.tooltipsValues[0].values,
                    subtotal: this.tooltipsValues[0].subtotal,
                });
            }

            return <powerbi.DataView>{
                metadata: dataViewMetadata,
                categorical: {
                    categories: categories,
                    values: DataViewTransform.createValueColumns(valueDataArray),
                },
            };
        }

        public buildWithSeries(size: boolean, longLat: boolean): powerbi.DataView {
            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: []
            };
            if (this.objects)
                dataViewMetadata.objects = this.objects;

            var valueDataArray: powerbi.DataViewValueColumn[] = [];
            var categories: powerbi.DataViewCategoryColumn[] = this.buildCategories(dataViewMetadata);

            dataViewMetadata.columns.push(this.seriesColumn);
            let grouped: powerbi.DataViewValueColumnGroup[] = [];

            for (let seriesIdx = 0; seriesIdx < this.seriesValues.length; seriesIdx++) {
                let seriesValue = this.seriesValues[seriesIdx];
                let seriesIdentity = mocks.dataViewScopeIdentityWithEquality(this.seriesColumnExpr, seriesValue);
                let valuesForGrouped = [];

                if (size) {
                    let sizeColumn: powerbi.DataViewMetadataColumn = $.extend({}, this.sizeColumn);
                    sizeColumn.groupName = seriesValue;

                    dataViewMetadata.columns.push(sizeColumn);
                    let sizeArray = {
                        source: sizeColumn,
                        values: this.sizeValues[seriesIdx].values,
                        subtotal: this.sizeValues[seriesIdx].subtotal,
                        identity: seriesIdentity,
                    };
                    valueDataArray.push(sizeArray);
                    valuesForGrouped.push(sizeArray);

                }
                if (longLat) {
                    let longitudeColumn: powerbi.DataViewMetadataColumn = $.extend({}, this.longitudeColumn);
                    longitudeColumn.groupName = seriesValue;
                    let latitudeColumn: powerbi.DataViewMetadataColumn = $.extend({}, this.latitudeColumn);
                    latitudeColumn.groupName = seriesValue;

                    dataViewMetadata.columns.push(longitudeColumn);
                    dataViewMetadata.columns.push(latitudeColumn);
                    let longArray = {
                        source: longitudeColumn,
                        values: this.longitudeValues[seriesIdx].values,
                        subtotal: this.longitudeValues[seriesIdx].subtotal,
                        identity: seriesIdentity,
                    };
                    valueDataArray.push(longArray);
                    valuesForGrouped.push(longArray);
                    let latArray = {
                        source: latitudeColumn,
                        values: this.latitudeValues[seriesIdx].values,
                        subtotal: this.latitudeValues[seriesIdx].subtotal,
                        identity: seriesIdentity,
                    };
                    valueDataArray.push(latArray);
                    valuesForGrouped.push(latArray);
                }
                grouped.push({
                    values: valuesForGrouped,
                    identity: mocks.dataViewScopeIdentityWithEquality(this.seriesColumnExpr, seriesValue),
                    name: seriesValue,
                });
            }

            let values = DataViewTransform.createValueColumns(valueDataArray, [this.seriesColumnExpr], this.seriesColumn);
            values.grouped = () => grouped;

            return <powerbi.DataView>{
                metadata: dataViewMetadata,
                categorical: {
                    categories: categories,
                    values: values,
                }
            };
        }

        public buildWithCategoryAsSeries(size: boolean, longLat: boolean): powerbi.DataView {
            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [],
            };
            if (this.objects)
                dataViewMetadata.objects = this.objects;

            var valueDataArray: powerbi.DataViewValueColumn[] = [];
            var categories: powerbi.DataViewCategoryColumn[] = this.buildCategories(dataViewMetadata, true);
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

            return <powerbi.DataView>{
                metadata: dataViewMetadata,
                categorical: {
                    categories: categories,
                    values: DataViewTransform.createValueColumns(valueDataArray),
                },
            };
        }

        public getSizeValue(categoryIndex: number, seriesIndex: number = 0): number {
            return this.sizeValues[seriesIndex].values[categoryIndex];
        }

        public getLatValue(categoryIndex: number, seriesIndex: number = 0): number {
            return this.latitudeValues[seriesIndex].values[categoryIndex];
        }

        public getLongValue(categoryIndex: number, seriesIndex: number = 0): number {
            return this.longitudeValues[seriesIndex].values[categoryIndex];
        }

        public getGradientValue(categoryIndex: number, seriesIndex: number = 0): number {
            return this.gradientValues[seriesIndex].values[categoryIndex];
        }

        public getTooltipsValue(categoryIndex: number, seriesIndex: number = 0): number {
            return this.tooltipsValues[seriesIndex].values[categoryIndex];
        }

        public withAddresses(): MapDataBuilder {
            this.categoryValues = this.addressCategoryValues;
            this.categoryColumn = this.addressCategoryColumn;
            this.categoryColumnExpr = this.addressColumnExpr;
            return this;
        }

        public withNumericCategories(): MapDataBuilder {
            this.categoryValues = this.numericCategoryValues;
            this.categoryColumn = this.numericCategoryColumn;
            this.categoryColumnExpr = this.categoryColumnExpr;
            return this;
        }

        public withoutCategory(): MapDataBuilder {
            this.suppressCategories = true;
            return this;
        }

        public withNullCategory(): MapDataBuilder {
            this.categoryValues[1] = null;
            return this;
        }

        public withNullValue(): MapDataBuilder {
            this.sizeValues[0].values[1] = null;
            this.sizeValues[0].subtotal = 400;
            return this;
        }

        public withZeroValue(): MapDataBuilder {
            this.sizeValues[0].values[1] = 0;
            this.sizeValues[0].subtotal = 400;
            return this;
        }

        public withCategoryLabels(color?: string, labelDisplayUnits?: number, labelPrecision?: number, fontSize?: number): MapDataBuilder {
            if (!this.objects) {
                this.objects = {};
            }
            this.objects["categoryLabels"] = <powerbi.visuals.DataLabelObject>{
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
            this.seriesColumn = this.seriesSameAsCategoryColumn;
            this.seriesValues = this.categoryValues;
            this.seriesColumnExpr = this.categoryColumnExpr;

            // values should only be expressed on the diagonal
            this.clearNonDiagonalValues(this.sizeValues);
            this.clearNonDiagonalValues(this.latitudeValues);
            this.clearNonDiagonalValues(this.longitudeValues);

            return this;
        }

        public withNullSeriesName(): MapDataBuilder {
            this.seriesValues[1] = null;
            return this;
        }

        public withNullLatLong(): MapDataBuilder {
            for (let i = 0, ilen = this.latitudeValues.length; i < ilen; i++) {
                this.latitudeValues[i].values[1] = null;
                this.longitudeValues[i].values[1] = null;
            }
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

        private buildCategories(dataViewMetadata: powerbi.DataViewMetadata, createAsSeries: boolean = false): powerbi.DataViewCategoryColumn[] {
            if (this.suppressCategories)
                return;

            let categoryColumn = createAsSeries ? this.categoryAsSeriesColumn : this.categoryColumn;

            dataViewMetadata.columns.push(categoryColumn);

            let categoryIdentities = this.categoryValues.map((v) => mocks.dataViewScopeIdentityWithEquality(this.categoryColumnExpr, v));
            var categories: powerbi.DataViewCategoryColumn[] = [{
                source: categoryColumn,
                values: this.categoryValues,
                identity: categoryIdentities,
            }];

            if (this.categoryObjects)
                categories[0].objects = this.categoryObjects;

            return categories;
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

        private _visual: Map;

        constructor() {
            this._style = powerbi.visuals.visualStyles.create();
            // mock geocoding
            this._host = powerbi.Prototype.inherit(mocks.createVisualHostServices(), h => h.geocoder = () => this.testGeocoder);
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
                ensureMap: (locale: string, action: () => void) => {
                    Microsoft.Maps = <any>mocks.MockMaps; // Hook the mock up to Microsoft.Maps for use in Map code
                    action();
                },
            };
        }

        public build(filledMap: boolean, minerva: boolean = false): Map {
            this._visual = new Map({ filledMap: filledMap, geocoder: this._testGeocoder, mapControlFactory: this._testMapControlFactory, filledMapDataLabelsEnabled: true });
            this._visual.init(this.buildInitOptions());

            return this._visual;
        }

        public buildInitOptions(): powerbi.VisualInitOptions {
            return <powerbi.VisualInitOptions> {
                element: this._element,
                host: this._host,
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
