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
    import DataView = powerbi.DataView;
    import DataViewMetadata = powerbi.DataViewMetadata;
    import DataViewObjects = powerbi.DataViewObjects;
    import DataViewScopeIdentity = powerbi.DataViewScopeIdentity;
    import formattingService = powerbi.formattingService;
    import IDataColorPalette = powerbi.IDataColorPalette;
    import ValueType = powerbi.ValueType;
    import PrimitiveType = powerbi.PrimitiveType;
    import VisualDataChangedOptions = powerbi.VisualDataChangedOptions;
    import DataViewObjectDescriptors = powerbi.data.DataViewObjectDescriptors;
    import SQExpr = powerbi.data.SQExpr;
    import SQExprBuilder = powerbi.data.SQExprBuilder;
    import dataLabelUtils = powerbi.visuals.dataLabelUtils;
    import FunnelChart = powerbi.visuals.FunnelChart;
    import FunnelData = powerbi.visuals.FunnelData;
    import funnelChartCapabilities = powerbi.visuals.funnelChartCapabilities;
    import funnelChartProps = powerbi.visuals.funnelChartProps;
    import labelPosition = powerbi.visuals.labelPosition;
    import SelectionId = powerbi.visuals.SelectionId;
    import SVGUtil = powerbi.visuals.SVGUtil;
    import WebFunnelAnimator = powerbi.visuals.WebFunnelAnimator;
    import visualStyles = powerbi.visuals.visualStyles;
    import buildSelector = powerbitests.helpers.buildSelectorForColumn;
    import DataViewBuilder = powerbitests.helpers.DataViewBuilder;
    import EventType = powerbitests.helpers.ClickEventType;
    import VisualBuilder = powerbitests.helpers.VisualBuilder;
    import Spy = jasmine.Spy;
    import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
    import PixelConverter = jsCommon.PixelConverter;
    import FunnelDataPoint = powerbi.visuals.FunnelDataPoint;
    import IFunnelRect = powerbi.visuals.IFunnelRect;
    import LabelDataPoint = powerbi.LabelDataPoint;

    let minHeightFunnelCategoryLabelsVisible: number = 80; // Matches powerbi.visualHost.MobileVisualPluginService.MinHeightFunnelCategoryLabelsVisible
    let categoryLabelsVisibleGreaterThanMinHeight: number = minHeightFunnelCategoryLabelsVisible + 1;
    let categoryLabelsSmallerThanMinHeight: number = minHeightFunnelCategoryLabelsVisible - 1;
    let categoryLabelsVisibleGreaterThanMinHeightString: string = categoryLabelsVisibleGreaterThanMinHeight.toString();
    let categoryLabelsVisibleSmallerThanMinHeightString: string = categoryLabelsSmallerThanMinHeight.toString();

    let labelColor: string = dataLabelUtils.defaultLabelColor;
    const defaultInsideLabelColor: string = "#ffffff";
    const getPercentLabelSettingsMethod: string = "getDefaultPercentLabelSettings";
    const getLabelSettingsMethod: string = "getDefaultLabelSettings";
    const nonHighlightedFillOpacity: number = 0.4;
    const highlightedFillOpacity: number = 1; 

    powerbitests.mocks.setLocale();

    describe("FunnelChart", () => {

        it("FunnelChart registered capabilities", () => {
            expect(powerbi.visuals.plugins.funnel.capabilities).toBe(funnelChartCapabilities);
        });

        it("Capabilities should include dataViewMappings", () => {
            expect(funnelChartCapabilities.dataViewMappings).toBeDefined();
        });

        it("Capabilities should include dataRoles", () => {
            expect(funnelChartCapabilities.dataRoles).toBeDefined();
        });

        it("Capabilities should not suppressDefaultTitle", () => {
            expect(funnelChartCapabilities.suppressDefaultTitle).toBeUndefined();
        });

        it("FormatString property should match calculated", () => {
            expect(DataViewObjectDescriptors.findFormatString(funnelChartCapabilities.objects)).toEqual(funnelChartProps.general.formatString);
        });
    });

    describe("FunnelChart Dataview Validation", () => {
        let dataViewBuilder: DataViewBuilder;

        let colors: IDataColorPalette;
        let hostServices: powerbi.IVisualHostServices;

        beforeEach(() => {
            dataViewBuilder = new DataViewBuilder();
            
            colors = visualStyles.create().colorPalette.dataColors;
            hostServices = mocks.createVisualHostServices();
        });

        let dataViewMetadataOneMeasure: DataViewMetadata = {
            columns: [
                { displayName: "col1", queryName: "col1", roles: { "Category": true } },
                { displayName: "col2", queryName: "col2", isMeasure: true, roles: { "Y": true } },
            ]
        };

        let dataViewMetadataTwoMeasures: DataViewMetadata = {
            columns: [
                { displayName: "col1", queryName: "col1", roles: { "Category": true } },
                { displayName: "col2", queryName: "col2", isMeasure: true, roles: { "Y": true } },
                { displayName: "col3", queryName: "col3", isMeasure: true, roles: { "Y": true } },
            ]
        };

        let categoryColumnRef = SQExprBuilder.fieldDef({ schema: "s", entity: "e", column: "p" });

        it("Check explicit color is applied", () => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Jean Tablau"
            ];
            
            let objects: DataViewObjects[] = [
                            { dataPoint: { fill: { solid: { color: "#FF0000" } } } },
                            { dataPoint: { fill: { solid: { color: "#00FF00" } } } },
                            { dataPoint: { fill: { solid: { color: "#0000FF" } } } }
            ];

            dataViewBuilder.setMetadata(dataViewMetadataOneMeasure);
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadataOneMeasure.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .setObjects(objects)
                .buildCategory();

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setValues([100, 200, 700])
                    .setSource(dataViewMetadataOneMeasure.columns[1])
                    .buildNewValue()
                .buildValueColumns();
                
            let dataView: DataView = dataViewBuilder.build();

            let actualData: FunnelData = FunnelChart.converter(dataView, colors, hostServices);

            helpers.assertColorsMatch(actualData.dataPoints[0].color, "#FF0000");
            expect(actualData.dataPoints[0].labelFill).toBe(null);
            helpers.assertColorsMatch(actualData.dataPoints[1].color, "#00FF00");
            expect(actualData.dataPoints[1].labelFill).toBe(null);
            helpers.assertColorsMatch(actualData.dataPoints[2].color, "#0000FF");
            expect(actualData.dataPoints[2].labelFill).toBe(null);
        });

        it("Check by default color doesnt set to anything.", () => {
            let categoricalValues: any[] = [
                "John Domo",
                "Delta Force",
                "Jean Tablau"
            ];

            dataViewBuilder.setMetadata(dataViewMetadataOneMeasure);
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadataOneMeasure.columns[0])
                .setValues(categoricalValues)
                .setIdentity(categoricalValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setValues([100, 200, 700])
                    .setSource(dataViewMetadataOneMeasure.columns[1])
                    .buildNewValue()
                .buildValueColumns();

            let dataView: DataView = dataViewBuilder.build();

            let defaultDataPointColor: string = "#00FF00";

            let actualData: FunnelData = FunnelChart.converter(dataView, colors, hostServices, defaultDataPointColor);

            actualData.dataPoints.forEach(slice => {
                helpers.assertColorsMatch(slice.color, defaultDataPointColor);
                expect(slice.labelFill).toEqual(null);
            });
        });

        it("Check multi-measures and custom colors", () => {

            // clone 2 measure version and define objects

            let dataViewMetadata: DataViewMetadata = {
                columns: [
                    { displayName: "col2", queryName: "col2", isMeasure: true, roles: { "Y": true }, objects: { dataPoint: { fill: { solid: { color: "#FF0000" } } } } },
                    { displayName: "col3", queryName: "col3", isMeasure: true, roles: { "Y": true }, objects: { dataPoint: { fill: { solid: { color: "#00FF00" } } } } }
                ]
            };

            dataViewBuilder.setMetadata(dataViewMetadata);
            dataViewBuilder.setCategories([]);

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setValues([100])
                    .setSource(dataViewMetadata.columns[0])
                    .buildNewValue()
                .newValueBuilder()
                    .setValues([300])
                    .setSource(dataViewMetadata.columns[1])
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            let actualData: FunnelData = FunnelChart.converter(dataView, colors, hostServices);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithMeasure("col2"),
                SelectionId.createWithMeasure("col3")];

            let expectedData: FunnelData = {
                dataPoints: [
                    {
                        value: 100,
                        originalValue: 100,
                        label: 'col2',
                        identity: selectionIds[0],
                        key: selectionIds[0].getKey(),
                        selected: false,
                        categoryOrMeasureIndex: 0,
                        tooltipInfo: [{ displayName: "col2", value: "100" }, { displayName: "Percent of first", value: "100%" }],
                        color: "#FF0000",
                        labelFill: null,
                    }, {
                        value: 300,
                        originalValue: 300,
                        label: 'col3',
                        identity: selectionIds[1],
                        key: selectionIds[1].getKey(),
                        selected: false,
                        categoryOrMeasureIndex: 1,
                        tooltipInfo: [{ displayName: "col3", value: "300" }, { displayName: "Percent of first", value: "300%" }, { displayName: "Percent of previous", value: "300%" }],
                        color: "#00FF00",
                        labelFill: null,
                    }],
                categoryLabels: ["col2", "col3"],
                valuesMetadata: [dataViewMetadata.columns[0], dataViewMetadata.columns[1]],
                hasHighlights: false,
                highlightsOverflow: false,
                canShowDataLabels: true,
                dataLabelsSettings: FunnelChart[getLabelSettingsMethod](),
                percentBarLabelSettings: FunnelChart[getPercentLabelSettingsMethod](),
                hasNegativeValues: false,
                allValuesAreNegative: false,
            };
            expect(actualData).toEqual(expectedData);
        });

        it("Check converter with category and single measure", () => {
            let categoryValues: any[] = [
                "a",
                "b",
                "c"
            ];

            let categoryIdentities: DataViewScopeIdentity[] = categoryValues.map((value: any) => {
                return mocks.dataViewScopeIdentity(value);
            });
            
            dataViewBuilder.setMetadata(dataViewMetadataOneMeasure);
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadataOneMeasure.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryIdentities)
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
                
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setValues([100, 200, 700])
                    .setSource(dataViewMetadataOneMeasure.columns[1])
                    .buildNewValue()
                .buildValueColumns();
                
            let dataView: DataView = dataViewBuilder.build();
            
            let actualData: FunnelData = FunnelChart.converter(dataView, colors, hostServices);
            let categoryQueryName: string = dataView.categorical.categories[0].source.queryName;
            let selectionIds: SelectionId[] = [
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[0]), "col2"),
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[1]), "col2"),
                SelectionId.createWithSelectorForColumnAndMeasure(buildSelector(categoryQueryName, categoryIdentities[2]), "col2")];
            let sliceColor: string = colors.getColorByIndex(0).value;

            let expectedData: FunnelData = {
                dataPoints: [
                    {
                        value: 100,
                        originalValue: 100,
                        label: 'a',
                        identity: selectionIds[0],
                        key: selectionIds[0].getKey(),
                        selected: false,
                        categoryOrMeasureIndex: 0,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "100" }, { displayName: "Percent of first", value: "100%" }],
                        color: sliceColor,
                        labelFill: null,
                    }, {
                        value: 200,
                        originalValue: 200,
                        label: 'b',
                        identity: selectionIds[1],
                        key: selectionIds[1].getKey(),
                        selected: false,
                        categoryOrMeasureIndex: 1,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "200" }, { displayName: "Percent of first", value: "200%" }, { displayName: "Percent of previous", value: "200%" }],
                        color: sliceColor,
                        labelFill: null,
                    }, {
                        value: 700,
                        originalValue: 700,
                        label: 'c',
                        identity: selectionIds[2],
                        key: selectionIds[2].getKey(),
                        selected: false,
                        categoryOrMeasureIndex: 2,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "700" }, { displayName: "Percent of first", value: "700%" }, { displayName: "Percent of previous", value: "350%" }],
                        color: sliceColor,
                        labelFill: null,
                    }],
                categoryLabels: categoryValues,
                valuesMetadata: [dataViewMetadataOneMeasure.columns[1]],
                hasHighlights: false,
                highlightsOverflow: false,
                canShowDataLabels: true,
                dataLabelsSettings: FunnelChart[getLabelSettingsMethod](),
                percentBarLabelSettings: FunnelChart[getPercentLabelSettingsMethod](),
                hasNegativeValues: false,
                allValuesAreNegative: false,
            };
            expect(actualData).toEqual(expectedData);
        });

        it("Validate highlighted (null) tooltip", () => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Jean Tablau"
            ];
            
            let objects: DataViewObjects[] = [
                            { dataPoint: { fill: { solid: { color: "#FF0000" } } } },
                            { dataPoint: { fill: { solid: { color: "#00FF00" } } } },
                            { dataPoint: { fill: { solid: { color: "#0000FF" } } } }
            ];

            dataViewBuilder.setMetadata(dataViewMetadataOneMeasure);

            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadataOneMeasure.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setObjects(objects)
                .buildCategory();
           
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadataOneMeasure.columns[1])
                    .setValues([100, 200, 700])
                    .setHighlights([null, 140, 420])
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            let defaultDataPointColor: string = "#00FF00";

            let actualData: FunnelData = FunnelChart.converter(dataView, colors, hostServices, defaultDataPointColor, true);
           
            //first highlight tooltip won't show because highlighted value is null
            expect(actualData.dataPoints[0].tooltipInfo).toEqual([{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }]);
            
            //tooltips with highlighted value. Since first value highlighted value is 0, there is no 'percent of first' value
            expect(actualData.dataPoints[2].tooltipInfo).toEqual([{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }, { displayName: 'Highlighted', value: '140' }]);
            expect(actualData.dataPoints[4].tooltipInfo).toEqual([{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }, { displayName: 'Highlighted', value: '420' }, { displayName: "Percent of previous (highlighted)", value: "300%" }]);
            expect(actualData.dataPoints[2].tooltipInfo).toBe(actualData.dataPoints[3].tooltipInfo);
        });

        it("Validate highlighted (0) tooltip", () => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Jean Tablau"
            ];

            let objects: DataViewObjects[] = [
                { dataPoint: { fill: { solid: { color: "#FF0000" } } } },
                { dataPoint: { fill: { solid: { color: "#00FF00" } } } },
                { dataPoint: { fill: { solid: { color: "#0000FF" } } } }
            ];

            dataViewBuilder.setMetadata(dataViewMetadataOneMeasure);

            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadataOneMeasure.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setObjects(objects)
                .buildCategory();

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                .setSource(dataViewMetadataOneMeasure.columns[1])
                .setValues([100, 200, 700])
                .setHighlights([0, 140, 420])
                .buildNewValue()
                .buildValueColumns();

            let dataView: DataView = dataViewBuilder.build();

            let defaultDataPointColor: string = "#00FF00";

            let actualData: FunnelData = FunnelChart.converter(dataView, colors, hostServices, defaultDataPointColor, true);
           
            //first highlight tooltip is regular because the hilight value is 0
            expect(actualData.dataPoints[0].tooltipInfo).toEqual([{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }, { displayName: 'Highlighted', value: '0' }]);
            
            //tooltips with highlighted value. Since first value highlighted value is 0, there is no 'percent of first' value
            expect(actualData.dataPoints[2].tooltipInfo).toEqual([{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }, { displayName: 'Highlighted', value: '140' }]);
            expect(actualData.dataPoints[4].tooltipInfo).toEqual([{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }, { displayName: 'Highlighted', value: '420' }, { displayName: "Percent of previous (highlighted)", value: "300%" }]);
            expect(actualData.dataPoints[0].tooltipInfo).toBe(actualData.dataPoints[1].tooltipInfo);
        });

        it("validate tooltip info not being created when tooltips are disabled", () => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Jean Tablau"
            ];

            let objects: DataViewObjects[] = [
                { dataPoint: { fill: { solid: { color: "#FF0000" } } } },
                { dataPoint: { fill: { solid: { color: "#00FF00" } } } },
                { dataPoint: { fill: { solid: { color: "#0000FF" } } } }
            ];

            dataViewBuilder.setMetadata(dataViewMetadataOneMeasure);

            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadataOneMeasure.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setObjects(objects)
                .buildCategory();

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                .setSource(dataViewMetadataOneMeasure.columns[1])
                .setValues([100, 200, 700])
                .setHighlights([0, 140, 420])
                .buildNewValue()
                .buildValueColumns();

            let dataView: DataView = dataViewBuilder.build();

            let defaultDataPointColor: string = "#00FF00";

            let actualData: FunnelData = FunnelChart.converter(dataView, colors, hostServices, defaultDataPointColor, false);
           
            //first tooltip is regular because highlighted value is 0
            expect(actualData.dataPoints[0].tooltipInfo).toBeUndefined();
            expect(actualData.dataPoints[1].tooltipInfo).toBeUndefined();
            
            //tooltips with highlighted value
            expect(actualData.dataPoints[2].tooltipInfo).toBeUndefined();
            expect(actualData.dataPoints[3].tooltipInfo).toBeUndefined();
            expect(actualData.dataPoints[4].tooltipInfo).toBeUndefined();
            expect(actualData.dataPoints[5].tooltipInfo).toBeUndefined();
        });

        it("Check converter with no category and multi-measures", () => {
            dataViewBuilder
                .setMetadata(dataViewMetadataTwoMeasures)
                .setCategories([]);
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadataTwoMeasures.columns[1])
                    .setValues([100])
                    .setSubtotal(100)
                    .buildNewValue()
                .newValueBuilder()
                    .setSource(dataViewMetadataTwoMeasures.columns[2])
                    .setValues([300])
                    .setSubtotal(300)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            let actualData: FunnelData = FunnelChart.converter(dataView, colors, hostServices);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithMeasure("col2"),
                SelectionId.createWithMeasure("col3")];
            let sliceColor: string = colors.getColorByIndex(0).value;

            let expectedData: FunnelData = {
                dataPoints: [
                    {
                        value: 100,
                        originalValue: 100,
                        label: 'col2',
                        identity: selectionIds[0],
                        key: selectionIds[0].getKey(),
                        selected: false,
                        categoryOrMeasureIndex: 0,
                        tooltipInfo: [{ displayName: "col2", value: "100" }, { displayName: "Percent of first", value: "100%" }],
                        color: sliceColor,
                        labelFill: null,
                    }, {
                        value: 300,
                        originalValue: 300,
                        label: 'col3',
                        identity: selectionIds[1],
                        key: selectionIds[1].getKey(),
                        selected: false,
                        categoryOrMeasureIndex: 1,
                        tooltipInfo: [{ displayName: "col3", value: "300" }, { displayName: "Percent of first", value: "300%" }, { displayName: "Percent of previous", value: "300%" }],
                        color: sliceColor,
                        labelFill: null,
                    }],
                categoryLabels: ["col2", "col3"],
                valuesMetadata: [dataViewMetadataTwoMeasures.columns[1], dataViewMetadataTwoMeasures.columns[2]],
                hasHighlights: false,
                highlightsOverflow: false,
                canShowDataLabels: true,
                dataLabelsSettings: FunnelChart[getLabelSettingsMethod](),
                percentBarLabelSettings: FunnelChart[getPercentLabelSettingsMethod](),
                hasNegativeValues: false,
                allValuesAreNegative: false,
            };
            expect(actualData).toEqual(expectedData);
        });

        it('Check converter with no category and multi-measures with highlights', () => {
            dataViewBuilder
                .setMetadata(dataViewMetadataTwoMeasures)
                .setCategories([]);

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                .setSource(dataViewMetadataTwoMeasures.columns[1])
                .setValues([300])
                .setHighlights([15])
                .setSubtotal(300)
                .buildNewValue()
                .newValueBuilder()
                .setSource(dataViewMetadataTwoMeasures.columns[2])
                .setValues([900])
                .setHighlights([250])
                .setSubtotal(900)
                .buildNewValue()
                .buildValueColumns();

            let dataView: DataView = dataViewBuilder.build();

            let actualData: FunnelData = FunnelChart.converter(dataView, colors, hostServices);
            let selectionIds: SelectionId[] = [
                SelectionId.createWithMeasure("col2"),
                SelectionId.createWithMeasure("col3")
            ];
            let sliceColor: string = colors.getColorByIndex(0).value;

            let expectedData: powerbi.visuals.FunnelData = {
                dataPoints: [
                        {
                        label: 'col2',
                        value: 300,
                        originalValue: 300,
                        categoryOrMeasureIndex: 0,
                        identity: selectionIds[0],
                        selected: false,
                        key: selectionIds[0].getKey(),
                        tooltipInfo: [{ displayName: "col2", value: "300" }, { displayName: 'Highlighted', value: '15' }, { displayName: "Percent of first (highlighted)", value: "100%" }],
                        color: sliceColor,
                        labelFill: null,
                        },
                        {
                        label: 'col2',
                        value: 300,
                        originalValue: 300,
                        categoryOrMeasureIndex: 0,
                        identity: SelectionId.createWithHighlight(selectionIds[0]),
                        selected: false,
                        key: SelectionId.createWithHighlight(selectionIds[0]).getKey(),
                        tooltipInfo: [{ displayName: "col2", value: "300" }, { displayName: 'Highlighted', value: '15' }, { displayName: "Percent of first (highlighted)", value: "100%" }],
                        color: sliceColor,
                        highlight: true,
                        originalHighlightValue: 15,
                        highlightValue: 15,
                        },
                        {
                        label: 'col3',
                        value: 900,
                        originalValue: 900,
                        categoryOrMeasureIndex: 1,
                        identity: selectionIds[1],
                        selected: false,
                        key: selectionIds[1].getKey(),
                        tooltipInfo: [{ displayName: "col3", value: "900" }, { displayName: 'Highlighted', value: '250' }, { displayName: "Percent of first (highlighted)", value: "1,666.67%" }, { displayName: "Percent of previous (highlighted)", value: "1,666.67%" }],
                        color: sliceColor,
                        labelFill: null,
                    },
                    {
                        label: 'col3',
                        value: 900,
                        originalValue: 900,
                        categoryOrMeasureIndex: 1,
                        identity: SelectionId.createWithHighlight(selectionIds[1]),
                        selected: false,
                        key: SelectionId.createWithHighlight(selectionIds[1]).getKey(),
                        tooltipInfo: [{ displayName: "col3", value: "900" }, { displayName: 'Highlighted', value: '250' }, { displayName: "Percent of first (highlighted)", value: "1,666.67%" }, { displayName: "Percent of previous (highlighted)", value: "1,666.67%" }],
                        color: sliceColor,
                        highlight: true,
                        originalHighlightValue: 250,
                        highlightValue: 250,
                    }],
                categoryLabels: ['col2', 'col3'],
                valuesMetadata: [dataViewMetadataTwoMeasures.columns[1], dataViewMetadataTwoMeasures.columns[2]],
                hasHighlights: true,
                highlightsOverflow: false,
                canShowDataLabels: true,
                dataLabelsSettings: FunnelChart[getLabelSettingsMethod](),
                percentBarLabelSettings: FunnelChart[getPercentLabelSettingsMethod](),
                hasNegativeValues: false,
                allValuesAreNegative: false,
            };
            expect(actualData).toEqual(expectedData);
        });

        it('Negative values with positive values are converted to zero by converter', () => {
            dataViewBuilder
                .setMetadata(dataViewMetadataTwoMeasures)
                .setCategories([]);

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                .setSource(dataViewMetadataTwoMeasures.columns[1])
                .setValues([300])
                .setHighlights([-5])
                .setSubtotal(300)
                .buildNewValue()
                .newValueBuilder()
                .setSource(dataViewMetadataTwoMeasures.columns[2])
                .setValues([-200])
                .setHighlights([250])
                .setSubtotal(-200)
                .buildNewValue()
                .buildValueColumns();

            let dataView: DataView = dataViewBuilder.build();

            let actualData = FunnelChart.converter(dataView, colors, hostServices);

            // Negative values warning flags
            expect(actualData.hasNegativeValues).toBeTruthy();
            expect(actualData.allValuesAreNegative).toBeFalsy();

            // Render and original values
            expect(actualData.dataPoints[1].highlightValue).toBe(0);
            expect(actualData.dataPoints[1].originalHighlightValue).toBe(-5);
            expect(actualData.dataPoints[2].value).toBe(0);
            expect(actualData.dataPoints[2].originalValue).toBe(-200);
        });

        it('When all values are negative converter converts to absolute values', () => {
            dataViewBuilder
                .setMetadata(dataViewMetadataTwoMeasures)
                .setCategories([]);

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                .setSource(dataViewMetadataTwoMeasures.columns[1])
                .setValues([-100])
                .setHighlights([-5])
                .setSubtotal(-100)
                .buildNewValue()
                .newValueBuilder()
                .setSource(dataViewMetadataTwoMeasures.columns[2])
                .setValues([-200])
                .setHighlights([-150])
                .setSubtotal(-200)
                .buildNewValue()
                .buildValueColumns();

            let dataView: DataView = dataViewBuilder.build();

            let actualData = FunnelChart.converter(dataView, colors, hostServices);

            // Negative values warning flags
            expect(actualData.hasNegativeValues).toBeFalsy();
            expect(actualData.allValuesAreNegative).toBeTruthy();

            // Render and original values
            expect(actualData.dataPoints[0].value).toBe(100);
            expect(actualData.dataPoints[0].originalValue).toBe(-100);
            expect(actualData.dataPoints[1].highlightValue).toBe(5);
            expect(actualData.dataPoints[1].originalHighlightValue).toBe(-5);
            expect(actualData.dataPoints[2].value).toBe(200);
            expect(actualData.dataPoints[2].originalValue).toBe(-200);
            expect(actualData.dataPoints[3].highlightValue).toBe(150);
            expect(actualData.dataPoints[3].originalHighlightValue).toBe(-150);
    });

        it('non-categorical multi-measure tooltip values test', () => {
            let dataViewMetadata: DataViewMetadata = {
                columns: [
                    { displayName: "a", queryName: "a", isMeasure: true, roles: { "Y": true } },
                    { displayName: "b", queryName: "b", isMeasure: true, roles: { "Y": true } },
                    { displayName: "c", queryName: "c", isMeasure: true, roles: { "Y": true } },
                ]
            };
            
            dataViewBuilder.setMetadata(dataViewMetadata);
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[0])
                    .setValues([1])
                    .buildNewValue()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([2])
                    .buildNewValue()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[2])
                    .setValues([3])
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            let actualData: FunnelData = FunnelChart.converter(dataView, colors, hostServices);

            expect(actualData.dataPoints[0].tooltipInfo).toEqual([{ displayName: "a", value: "1" }, { displayName: "Percent of first", value: "100%" }]);
            expect(actualData.dataPoints[1].tooltipInfo).toEqual([{ displayName: "b", value: "2" }, { displayName: "Percent of first", value: "200%" }, { displayName: "Percent of previous", value: "200%" }]);
            expect(actualData.dataPoints[2].tooltipInfo).toEqual([{ displayName: "c", value: "3" }, { displayName: "Percent of first", value: "300%" }, { displayName: "Percent of previous", value: "150%" }]);
        });
    });

    describe("FunnelChart Interactivity", () => {
        let dataViewBuilder: DataViewBuilder = new DataViewBuilder();
        
        let visualBuilder: VisualBuilder;
        
        let dataViewMetadataCategorySeriesColumns: DataViewMetadata = {
            columns: [
                { queryName: "select0", displayName: "Squad", roles: { "Category": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) },
                { displayName: "Period", roles: { "Series": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                { displayName: null, groupName: "201501", isMeasure: true, roles: { "Y": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                { displayName: null, groupName: "201502", isMeasure: true, roles: { "Y": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
                { displayName: null, groupName: "201503", isMeasure: true, roles: { "Y": true }, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double) },
            ]
        };
        let categoryColumnRef: SQExpr =
            SQExprBuilder.fieldDef({ schema: "s", entity: "e", column: "Squad" });
        let DefaultOpacity: string = "" + FunnelChart.DefaultBarOpacity;
        let DimmedOpacity: string = "" + FunnelChart.DimmedBarOpacity;

        let interactiveCategoryValues: any[] = [
            "a",
            "b"
        ];
        
        dataViewBuilder.setMetadata(dataViewMetadataCategorySeriesColumns);
        
        dataViewBuilder.categoryBuilder()
            .setSource(dataViewMetadataCategorySeriesColumns.columns[0])
            .setValues(interactiveCategoryValues)
            .setIdentity(interactiveCategoryValues.map((value) => {
                return mocks.dataViewScopeIdentity(value);
            }))
            .setIdentityFields([categoryColumnRef])
            .buildCategory();
        
        dataViewBuilder.valueColumnsBuilder()
            .newValueBuilder()
                .setSource(dataViewMetadataCategorySeriesColumns.columns[2])
                .setValues([0.00110, 120])
                .setIdentity(mocks.dataViewScopeIdentity("201501"))
                .buildNewValue()
            .newValueBuilder()
                .setSource(dataViewMetadataCategorySeriesColumns.columns[3])
                .setValues([210, 220])
                .setIdentity(mocks.dataViewScopeIdentity("201502"))
                .buildNewValue()
            .newValueBuilder()
                .setSource(dataViewMetadataCategorySeriesColumns.columns[4])
                .setValues([310, 0.00320])
                .setIdentity(mocks.dataViewScopeIdentity("201503"))
                .buildNewValue()
            .buildValueColumns();
        
        let interactiveDataViewOptions: VisualDataChangedOptions = {
            dataViews: [dataViewBuilder.build()]
        };

        dataViewBuilder = new DataViewBuilder();
        
        dataViewBuilder.setMetadata(dataViewMetadataCategorySeriesColumns);
        
        dataViewBuilder.categoryBuilder()
            .setSource(dataViewMetadataCategorySeriesColumns.columns[0])
            .setValues(interactiveCategoryValues)
            .setIdentity(interactiveCategoryValues.map((value: any) => {
                return mocks.dataViewScopeIdentity(value);
            }))
            .setIdentityFields([categoryColumnRef])
            .buildCategory();
        
        dataViewBuilder.valueColumnsBuilder()
            .newValueBuilder()
                .setSource(dataViewMetadataCategorySeriesColumns.columns[2])
                .setValues([0.00110, 120])
                .setIdentity(mocks.dataViewScopeIdentity("201501"))
                .buildNewValue()
            .newValueBuilder()
                .setSource(dataViewMetadataCategorySeriesColumns.columns[3])
                .setValues([0.00210, 220])
                .setIdentity(mocks.dataViewScopeIdentity("201502"))
                .buildNewValue()
            .newValueBuilder()
                .setSource(dataViewMetadataCategorySeriesColumns.columns[4])
                .setValues([0.00310, 320])
                .setIdentity(mocks.dataViewScopeIdentity("201503"))
                .buildNewValue()
            .buildValueColumns();
        
        let smallerInteractiveDataViewOptions: powerbi.VisualDataChangedOptions = {
            dataViews: [dataViewBuilder.build()]
        };

        beforeEach(() => {
            dataViewBuilder = new DataViewBuilder();
            
            visualBuilder = new VisualBuilder(
                () => new powerbi.visuals.FunnelChart({
                    animator: new powerbi.visuals.WebFunnelAnimator(),
                    behavior: new powerbi.visuals.FunnelWebBehavior(),
                    tooltipsEnabled: true,
                }),
                500,
                500
            );
            
            visualBuilder.interactivitySelection = true;
            
            visualBuilder.build();
            });

        function getOptionsForValues(values: number[]): VisualDataChangedOptions {
            let dataViewBuilder: DataViewBuilder = new DataViewBuilder();

            let categoryValues: any[] = [
                "a",
                "b"
            ];
            
            dataViewBuilder.setMetadata(dataViewMetadataCategorySeriesColumns);
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadataCategorySeriesColumns.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadataCategorySeriesColumns.columns[2])
                    .setValues(values)
                    .setIdentity(mocks.dataViewScopeIdentity("201501"))
                    .buildNewValue()
                .buildValueColumns();
            
            return { dataViews: [dataViewBuilder.build()] };
        }

        it("Interactors are rendered with a minimum size", (done) => {
            let options = getOptionsForValues([0.001, 200, 700]);
            visualBuilder.visual.onDataChanged(options);

            setTimeout(() => {
                let bars: JQuery = $(FunnelChart.Selectors.funnel.bars.selector);
                let interactors: JQuery = $(FunnelChart.Selectors.funnel.interactors.selector);

                expect(interactors.length).toBe(1);
                expect(interactors.eq(0).attr("y")).toBe(bars.eq(0).attr("y"));

                let interactorWidth: number = parseInt(interactors.eq(0).attr("width"), 10);
                expect(interactorWidth).toBe(FunnelChart.MinimumInteractorSize);
                done();
            }, DefaultWaitForRender);
        });

        it("NaN in values shows warning", (done) => {
            let warningSpy: Spy = jasmine.createSpy("warning");
            visualBuilder.host.setWarnings = warningSpy;
            let options: VisualDataChangedOptions = getOptionsForValues([110, 120, NaN]);
            visualBuilder.visual.onDataChanged(options);

            setTimeout(() => {
                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(warningSpy.calls.argsFor(0)[0][0].code).toBe("NaNNotSupported");
                done();
            });
        });

        it("Negative Infinity in values shows warning", (done) => {
            let warningSpy: Spy = jasmine.createSpy("warning");
            visualBuilder.host.setWarnings = warningSpy;

            let options: VisualDataChangedOptions = getOptionsForValues([110, 120, Number.NEGATIVE_INFINITY]);
            visualBuilder.visual.onDataChanged(options);

            setTimeout(() => {
                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(warningSpy.calls.argsFor(0)[0][0].code).toBe("InfinityValuesNotSupported");
                done();
            });
        });

        it("Positive Infinity in values shows warning", (done) => {
            let warningSpy: Spy = jasmine.createSpy("warning");
            visualBuilder.host.setWarnings = warningSpy;

            let options: VisualDataChangedOptions = getOptionsForValues([110, 120, Number.POSITIVE_INFINITY]);
            visualBuilder.visual.onDataChanged(options);

            setTimeout(() => {
                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(warningSpy.calls.argsFor(0)[0][0].code).toBe("InfinityValuesNotSupported");
                done();
            });
        });

        it("Out of range value in values shows warning", (done) => {
            let warningSpy: Spy = jasmine.createSpy("warning");
            visualBuilder.host.setWarnings = warningSpy;

            let options: VisualDataChangedOptions = getOptionsForValues([110, 120, 1e301]);
            visualBuilder.visual.onDataChanged(options);

            setTimeout(() => {
                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(warningSpy.calls.argsFor(0)[0][0].code).toBe("ValuesOutOfRange");
                done();
            });
        });

        it('Negative value in values shows warning', (done) => {
            let warningSpy: Spy = jasmine.createSpy('warning');
            visualBuilder.host.setWarnings = warningSpy;

            let options = getOptionsForValues([110, -120, 130]);
            visualBuilder.visual.onDataChanged(options);

            setTimeout(() => {
                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('NegativeValuesNotSupported');
                done();
            });
        });

        it('All values are negative in values shows warning', (done) => {
            let warningSpy: Spy = jasmine.createSpy('warning');
            visualBuilder.host.setWarnings = warningSpy;

            let options = getOptionsForValues([-110, -120, -130]);
            visualBuilder.visual.onDataChanged(options);

            setTimeout(() => {
                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('AllNegativeValuesNotSupported');
                done();
            });
        });

        it('All good in values does not show warning', (done) => {
            let warningSpy: Spy = jasmine.createSpy('warning');
            visualBuilder.host.setWarnings = warningSpy;

            let options: VisualDataChangedOptions = getOptionsForValues([110, 120, 300]);
            visualBuilder.visual.onDataChanged(options);

            setTimeout(() => {
                expect(warningSpy).toHaveBeenCalledWith([]);
                done();
            });
        });

        it("funnel chart category select", (done) => {
            visualBuilder.visual.onDataChanged(interactiveDataViewOptions);

            setTimeout(() => {
                let bars: JQuery = $(FunnelChart.Selectors.funnel.bars.selector);

                spyOn(visualBuilder.host, "onSelect").and.callThrough();

                bars.first().d3Click(0, 0);

                expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);

                expect(visualBuilder.host.onSelect).toHaveBeenCalledWith(
                    {
                        visualObjects: [
                            {
                                objectName: 'dataPoint',
                                selectorsByColumn:
                                {
                                    dataMap: {
                                        "select0": interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[0]
                                    }
                                }
                            }
                        ]
                    });
                done();
            });
        });

        it("context menu", (done) => {
            visualBuilder.visual.onDataChanged(interactiveDataViewOptions);

            setTimeout(() => {
                spyOn(visualBuilder.host, "onContextMenu").and.callThrough();

                let bars = $(FunnelChart.Selectors.funnel.bars.selector);
                bars.first().d3ContextMenu(5, 15);

                expect(visualBuilder.host.onContextMenu).toHaveBeenCalledWith(
                    {
                        data: [
                            {
                                dataMap: {
                                    "select0": interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[0]
                                }
                            }
                        ],
                        position: {
                            x: 5,
                            y: 15
                        }
                    });
                done();
            });
        });

        it("funnel chart category select via interactor", (done) => {
            visualBuilder.visual.onDataChanged(smallerInteractiveDataViewOptions);

            setTimeout(() => {
                let bars: JQuery = $(FunnelChart.Selectors.funnel.bars.selector);
                let interactors: JQuery = $(FunnelChart.Selectors.funnel.interactors.selector);

                spyOn(visualBuilder.host, "onSelect").and.callThrough();

                interactors.first().d3Click(0, 0);

                expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);

                expect(visualBuilder.host.onSelect).toHaveBeenCalledWith(
                    {
                        visualObjects: [
                            {
                                objectName: 'dataPoint',
                                selectorsByColumn:
                                {
                                    dataMap: {
                                        "select0": interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[0]
                                    }
                                }
                            }
                        ]
                    });
                done();
            });
        });

        it("funnel chart category multi-select", (done) => {
            visualBuilder.visual.onDataChanged(interactiveDataViewOptions);
            setTimeout(() => {
                let bars: JQuery = $(FunnelChart.Selectors.funnel.bars.selector);

                spyOn(visualBuilder.host, "onSelect").and.callThrough();

                bars.first().d3Click(0, 0);

                expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
                expect(visualBuilder.host.onSelect).toHaveBeenCalledWith(
                    {
                        visualObjects: [
                            {
                                objectName: 'dataPoint',
                                selectorsByColumn:
                                {
                                    dataMap: {
                                        "select0": interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[0]
                                    }
                                }
                            }
                        ]
                    });

                bars.last().d3Click(0, 0, EventType.CtrlKey);

                //expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
                expect(visualBuilder.host.onSelect).toHaveBeenCalledWith(
                    {
                        visualObjects: [
                            {
                                objectName: 'dataPoint',
                                selectorsByColumn:
                                {
                                    dataMap: {
                                        "select0": interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[0]
                                    }
                                }
                            }
                        ]
                    });

                done();
            });
        });

        it("funnel chart external clear", (done) => {
            visualBuilder.visual.onDataChanged(interactiveDataViewOptions);

            setTimeout(() => {
                let bars: JQuery = $(FunnelChart.Selectors.funnel.bars.selector);

                spyOn(visualBuilder.host, "onSelect").and.callThrough();

                bars.first().d3Click(0, 0);

                expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);

                expect(visualBuilder.host.onSelect).toHaveBeenCalledWith(
                    {
                        visualObjects: [
                            {
                                objectName: 'dataPoint',
                                selectorsByColumn:
                                {
                                    dataMap: {
                                        "select0": interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[0]
                                    }
                                }
                            }
                        ]
                    });

                visualBuilder.visual.onClearSelection();

                expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);

                done();
            });
        });

        it("funnel chart clear on clearCatcher click", (done) => {
            visualBuilder.visual.onDataChanged(interactiveDataViewOptions);

            setTimeout(() => {
                let bars: JQuery = $(FunnelChart.Selectors.funnel.bars.selector);

                spyOn(visualBuilder.host, "onSelect").and.callThrough();

                bars.first().d3Click(0, 0);

                expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
                expect(visualBuilder.host.onSelect).toHaveBeenCalledWith(
                    {
                        visualObjects: [
                            {
                                objectName: 'dataPoint',
                                selectorsByColumn:
                                {
                                    dataMap: {
                                        "select0": interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[0]
                                    }
                                }
                            }
                        ]
                    });

                let clearCatcher: JQuery = $(".clearCatcher");
                clearCatcher.first().d3Click(0, 0);

                expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
                expect(visualBuilder.host.onSelect).toHaveBeenCalledWith(
                    {
                        visualObjects: []
                    });

                done();
            });
        });
    });

    describe("FunnelChart DOM Validation", () => {
        let dataViewBuilder: DataViewBuilder;
        
        let visualBuilder: VisualBuilder;
        let dataViewMetadata: DataViewMetadata = {
            columns: [
                { displayName: "col1", queryName: "select0", roles: { "Category": true } },
                { displayName: "col2", queryName: "select1", isMeasure: true, roles: { "Y": true }, objects: { general: { formatString: "$0" } } },
            ],
            objects: {
                labels: { show: true, labelPrecision: 0 }
            }
        };
        let categoryColumnRef: SQExpr = SQExprBuilder.fieldDef({ schema: "s", entity: "e", column: "col1" });

        beforeEach(() => {
            dataViewBuilder = new DataViewBuilder();
            
            dataViewBuilder.setMetadata(dataViewMetadata);
            
            visualBuilder = new VisualBuilder(
                powerbi.visuals.plugins.funnel.create,
                500,
                500
            );
            
            visualBuilder.build();
        });

        it("Ensure DOM built", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Jean Tablau"
            ];
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 700])
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();

            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                FunnelChartHelpers.validatePercentBars(true, dataView);
                FunnelChartHelpers.validateDataLabels(dataView);
                expect($(".funnelChart g").length).toBe(7);
                expect($(".funnelChart .axis").find("text").length).toBe(3);
                expect($(".funnelChart .labelGraphicsContext").find("text").length).toBe(3);
                expect($(".funnelChart .labelGraphicsContext").find("text").first().text()).toBe("$100");

                done();
            }, DefaultWaitForRender);
        });

        it("Funnel partial highlight", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Jean Tablau"
            ];
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 700])
                    .setHighlights([50, 140, 420])
                    .setSubtotal(1000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();

            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                FunnelChartHelpers.validatePercentBars(true, dataView);
                FunnelChartHelpers.validateDataLabels(dataView);
                expect($(".funnelChart g").length).toBe(7);
                expect($(".funnelBar").length).toBe(6);
                expect(parseFloat($(".funnelBar").css("fill-opacity"))).toBeCloseTo(nonHighlightedFillOpacity, 2);
                expect($(".highlight").length).toBe(3);
                expect(parseFloat($(".highlight").css("fill-opacity"))).toBeCloseTo(highlightedFillOpacity, 2);

                expect(+$(".highlight").eq(0).attr("width"))
                    .toBeLessThan(+$(".funnelBar").eq(0).attr("width"));
                expect(+$(".highlight").eq(0).attr("x"))
                    .toBeGreaterThan(+$(".funnelBar").eq(0).attr("x"));

                expect($(".funnelChart .axis").find("text").length).toBe(3);

                expect(+$(".funnelBar:not(.highlight)").eq(2).attr("x")).toBe(0);

                done();
            }, DefaultWaitForRender);
        });

        it("Funnel partial highlight with overflow", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Jean Tablau"
            ];
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 700])
                    .setHighlights([150, 340, 1020])
                    .setSubtotal(1000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();

            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                FunnelChartHelpers.validatePercentBars(true, dataView);
                FunnelChartHelpers.validateDataLabels(dataView);
                expect($(".funnelChart g").length).toBe(7);
                expect($(".funnelBar").length).toBe(6);
                expect(parseFloat($(".funnelBar").css("fill-opacity"))).toBeCloseTo(nonHighlightedFillOpacity, 2);
                expect($(".highlight").length).toBe(3);
                expect(parseFloat($(".highlight").css("fill-opacity"))).toBeCloseTo(highlightedFillOpacity, 2);

                expect(+$(".highlight").eq(0).attr("width"))
                    .toBeGreaterThan(+$(".funnelBar").eq(0).attr("width"));
                expect(+$(".highlight").eq(0).attr("x"))
                    .toBeLessThan(+$(".funnelBar").eq(0).attr("x"));

                expect($(".funnelChart .axis").find("text").length).toBe(3);

                // The largest highlight should start at the farthest left point
                expect(+$(".highlight").eq(2).attr("x")).toBe(0);

                done();
            }, DefaultWaitForRender);
        });

        it("Ensure Max Width is respected", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force"
            ];
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200])
                    .setSubtotal(300)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                let rect: JQuery = $(".funnelChart").find(".funnelBar").first();
                expect(+rect.attr("height")).toBeLessThan(40);
                done();
            }, DefaultWaitForRender);
        });

        it("Ensure Labels that do not fit in the bar are shown outside and are the bar fill color", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Jean Tablau"
            ];
            
            let dataViewMetadataWithLabelsObject: DataViewMetadata = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsObject.objects = { labels: { labelPosition: labelPosition.insideCenter } };
            
            dataViewBuilder.setMetadata(dataViewMetadataWithLabelsObject);
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadataWithLabelsObject.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadataWithLabelsObject.columns[1])
                    .setValues([1000, 2000, 20])
                    .setSubtotal(3020)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {  
                let labels: JQuery = $(".funnelChart .labelGraphicsContext text");
                let firstBarWidth: number = +$(".funnelChart").find(".funnelBar").first().attr("width");
                let firstBarX: number = +$(".funnelChart").find(".funnelBar").first().attr("x");
                let lastBarWidth: number = +$(".funnelChart").find(".funnelBar").last().attr("width");
                let lastBarX: number = +$(".funnelChart").find(".funnelBar").last().attr("x");

                expect(labels.length).toBe(3);
                expect($(labels[0]).attr("x")).toEqual($(labels[1]).attr("x"));
                expect($(labels[1]).attr("x")).not.toEqual($(labels[2]).attr("x"));

                // Check that the first label is inside and white
                helpers.assertColorsMatch($(labels[0]).css("fill"), defaultInsideLabelColor);
                expect($(labels[0]).attr("x")).toBeGreaterThan(firstBarX);
                expect($(labels[0]).attr("x")).toBeLessThan(firstBarX + firstBarWidth);

                // Check that the last label is outside and equal to fill color
                helpers.assertColorsMatch($(labels[2]).css("fill"), labelColor);
                expect($(labels[2]).attr("x")).toBeGreaterThan(lastBarX + lastBarWidth);
                done();
            }, DefaultWaitForRender);
        });

        it("Ensure labels shown match default values when there are no highlights", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Mr Bing"
            ];
            
            let dataViewMetadataWithLabelsObject = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsObject.objects = {
                labels: {
                    labelPosition: labelPosition.insideCenter
                }
            };
            
            dataViewBuilder.setMetadata(dataViewMetadataWithLabelsObject);
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadataWithLabelsObject.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadataWithLabelsObject.columns[1])
                    .setValues([5, 100, 200])
                    .setSubtotal(305)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                FunnelChartHelpers.validateDataLabels(dataView);

                done();
            }, DefaultWaitForRender);
        });

        it('Ensure labels shown match original values when they were negative', (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Mr Bing"
            ];
            
            let dataViewMetadataWithLabelsObject = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsObject.objects = {
                labels: {
                    labelPosition: labelPosition.insideCenter
                }
            };
            
            dataViewBuilder.setMetadata(dataViewMetadataWithLabelsObject);
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadataWithLabelsObject.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadataWithLabelsObject.columns[1])
                    .setValues([5, -100, 200])
                    .setSubtotal(105)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                let labels = $(".funnelChart .labelGraphicsContext .label");
                expect(labels.eq(1).text()).toBe("-$100");

                done();
            }, DefaultWaitForRender);
        });

        it("Ensure labels shown match highlight values when there are highlights", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Mr Bing"
            ];
            
            let dataViewMetadataWithLabelsObject = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsObject.objects = {
                labels: {
                    labelPosition: labelPosition.insideCenter
                }
            };
            
            dataViewBuilder.setMetadata(dataViewMetadataWithLabelsObject);

            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadataWithLabelsObject.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadataWithLabelsObject.columns[1])
                    .setValues([5, 100, 200])
                    .setHighlights([465, 234, 300])
                    .setSubtotal(305)
                    .buildNewValue()
                .buildValueColumns();

            let dataView: DataView = dataViewBuilder.build();

            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                FunnelChartHelpers.validateDataLabels(dataView);

                done();
            }, DefaultWaitForRender);
        });

        it("Ensure Labels hide when viewport forces bars to be smaller than min height", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Bugs Bunny",
                "Mickey Mouse",
                "Donald Duck",
                "VRM Jones"
            ];
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 300, 400, 500, 600])
                    .setSubtotal(2100)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                expect($(".funnelChart g").length).toBe(10);
                expect($(".funnelChart .axis").find("text").length).toBe(6);
                expect($(".funnelChart .labelGraphicsContext text").length).toBe(6);
                visualBuilder.visual.onResizing({ height: 50, width: 100 });
                setTimeout(() => {
                    expect($(".funnelChart g").length).toBe(4);
                    expect($(".funnelChart .axis").find("text").length).toBe(0);
                    expect($(".funnelChart .labelGraphicsContext text").length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it("Ensure Labels show but percent bar hides when adding percent bars would cause labels to hide", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Bugs Bunny",
                "Mickey Mouse",
                "Donald Duck",
                "VRM Jones"
            ];
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 300, 400, 500, 600])
                    .setSubtotal(2100)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                FunnelChartHelpers.validatePercentBars(true, dataView);
                expect($(".funnelChart g").length).toBe(10);
                expect($(".funnelChart .axis").find("text").length).toBe(6);
                expect($(".funnelChart .labelGraphicsContext text").length).toBe(6);
                visualBuilder.visual.onResizing({ height: 100, width: 100 });
                setTimeout(() => {
                    FunnelChartHelpers.validatePercentBars(false, dataView);
                    expect($(".funnelChart g").length).toBe(10);
                    expect($(".funnelChart .axis").find("text").length).toBe(6);
                    expect($(".funnelChart .labelGraphicsContext text").length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it("Ensure percent bars hide when viewport forces bars to be smaller than min height", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Bugs Bunny",
                "Mickey Mouse",
                "Donald Duck",
                "VRM Jones"
            ];
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 300, 400, 500, 600])
                    .setSubtotal(2100)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                FunnelChartHelpers.validatePercentBars(true, dataView);
                expect($(".funnelChart g").length).toBe(10);
                expect($(".funnelChart .axis").find("text").length).toBe(6);
                expect($(".funnelChart .labelGraphicsContext text").length).toBe(6);
                visualBuilder.visual.onResizing({ height: 50, width: 100 });
                setTimeout(() => {
                    FunnelChartHelpers.validatePercentBars(false, dataView);
                    expect($(".funnelChart g").length).toBe(4);
                    expect($(".funnelChart .axis").find("text").length).toBe(0);
                    expect($(".funnelChart .labelGraphicsContext text").length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it("Ensure percent bars hide when single value data set", (done) => {
            let categoryValues: any[] = [
                "John Domo"
            ];
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100])
                    .setSubtotal(100)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                FunnelChartHelpers.validatePercentBars(false, dataView);
                expect($(".funnelChart g").length).toBe(5);
                expect($(".funnelChart .axis").find("text").length).toBe(1);
                expect($(".funnelChart .labelGraphicsContext text").length).toBe(1);
                
                done();
            }, DefaultWaitForRender);
        });

        it("Ensure percent bars hide when baseline value is zero", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Bugs Bunny",
                "Mickey Mouse",
                "Donald Duck",
                "VRM Jones"
            ];
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([0, 200, 300, 400, 500, 600])
                    .setSubtotal(2000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                FunnelChartHelpers.validatePercentBars(false, dataView);
                expect($(".funnelChart g").length).toBe(10);
                expect($(".funnelChart .axis").find("text").length).toBe(6);
                expect($(".funnelChart .labelGraphicsContext text").length).toBe(6);

                done();
            }, DefaultWaitForRender);
        });

        it("Ensure percent bars hide when settings are off", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Bugs Bunny",
                "Mickey Mouse",
                "Donald Duck",
                "VRM Jones"
            ];

            let percentBarOffMetadata: DataViewMetadata = powerbi.Prototype.inherit(dataViewMetadata);
            percentBarOffMetadata.objects = { percentBarLabel: { show: false } };
            
            dataViewBuilder.setMetadata(percentBarOffMetadata);

            dataViewBuilder.categoryBuilder()
                .setSource(percentBarOffMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                .setSource(percentBarOffMetadata.columns[1])
                .setValues([50, 200, 300, 400, 500, 600])
                .setSubtotal(2000)
                .buildNewValue()
                .buildValueColumns();

            let dataView: DataView = dataViewBuilder.build();

            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                FunnelChartHelpers.validatePercentBars(false, dataView);
                expect($(".funnelChart g").length).toBe(10);
                expect($(".funnelChart .axis").find("text").length).toBe(6);
                expect($(".funnelChart .labelGraphicsContext text").length).toBe(6);

                done();
            }, DefaultWaitForRender);
        });

        it("Ensure percent bars font size", (done) => {
            let fontSize = 15;
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Bugs Bunny",
                "Mickey Mouse",
                "Donald Duck",
                "VRM Jones"
            ];

            let percentBarOnMetadata: DataViewMetadata = powerbi.Prototype.inherit(dataViewMetadata);
            percentBarOnMetadata.objects = { percentBarLabel: { show: true, fontSize: fontSize } };

            dataViewBuilder.setMetadata(percentBarOnMetadata);

            dataViewBuilder.categoryBuilder()
                .setSource(percentBarOnMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                .setSource(percentBarOnMetadata.columns[1])
                .setValues([50, 200, 300, 400, 500, 600])
                .setSubtotal(2000)
                .buildNewValue()
                .buildValueColumns();

            let dataView: DataView = dataViewBuilder.build();

            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                FunnelChartHelpers.validatePercentBars(true, dataView, fontSize);

                done();
            }, DefaultWaitForRender);
        });

        it("Ensure percent bars font size position with many categories", (done) => {
            let fontSize = 35;
            let categoryValues: any[] = [
                "United States",
                "United Kingdom",
                "Russia",
                "Turkey",
                "Romania",
                "Latvia",
                "Laos",
                "Jamaica",
                "Canada",
                "India",
            ];

            let percentBarOnMetadata: DataViewMetadata = powerbi.Prototype.inherit(dataViewMetadata);
            percentBarOnMetadata.objects = { percentBarLabel: { show: true, fontSize: fontSize } };

            dataViewBuilder.setMetadata(percentBarOnMetadata);

            dataViewBuilder.categoryBuilder()
                .setSource(percentBarOnMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                .setSource(percentBarOnMetadata.columns[1])
                .setValues([50, 200, 300, 400, 500, 600, 450, 900, 100, 255])
                .setSubtotal(2000)
                .buildNewValue()
                .buildValueColumns();

            let dataView: DataView = dataViewBuilder.build();

            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                let funnelBox = $('svg.funnelChart').get(0).getBoundingClientRect();
                let percentBars = $('.percentBars text');
                let topTextBox = percentBars.get(0).getBoundingClientRect();
                let bottomTextBox = percentBars.get(1).getBoundingClientRect();

                expect(topTextBox.top).toBeGreaterThan(funnelBox.top);
                expect(bottomTextBox.bottom).toBeLessThan(funnelBox.bottom);

                done();
            }, DefaultWaitForRender);
        });

        it("Default labels validation", (done) => {
            let metadataWithDisplayUnits: DataViewMetadata = $.extend(true, {}, dataViewMetadata);
            metadataWithDisplayUnits.objects = { labels: { labelDisplayUnits: 1000 } };

            let fontSize: string = "12px";
            
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Mr Bing"
            ];
            
            dataViewBuilder.setMetadata(metadataWithDisplayUnits);
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([555, 2000, 20])
                    .setSubtotal(2575)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {    
                let labels: JQuery = $(".funnelChart .labelGraphicsContext text");
                let firstBarX: number = +$(".funnelChart").find(".funnelBar").first().attr("x");
                let firstBarWidth: number = +$(".funnelChart").find(".funnelBar").first().attr("width");
                let lastBarX: number = +$(".funnelChart").find(".funnelBar").last().attr("x");
                let lastBarWidth: number = +$(".funnelChart").find(".funnelBar").last().attr("width");

                expect(labels.length).toBe(3);
                helpers.assertColorsMatch($(labels[0]).css("fill"), defaultInsideLabelColor);
                helpers.assertColorsMatch($(labels[2]).css("fill"), labelColor);
                expect($(labels[0]).css("fill-opacity")).toEqual("1");
                expect($(labels[1]).css("fill-opacity")).toEqual("1");
                expect($(labels[2]).css("fill-opacity")).toEqual("1");
                expect($(labels.first().css("font-size")).selector).toBe(fontSize);
                expect($(labels[0]).text()).toEqual("$1K");

                // Check that the first label is inside
                expect($(labels[0]).attr("x")).toBeGreaterThan(firstBarX);
                expect($(labels[0]).attr("x")).toBeLessThan(firstBarX + firstBarWidth);

                // Check that the last label is outside
                expect($(labels[2]).attr("x")).toBeGreaterThan(lastBarX + lastBarWidth);
                done();
            }, DefaultWaitForRender);
        });

        it("Change text size validation", (done) => {
            
            var assert = () => {
                let labels: JQuery = $(".funnelChart .labelGraphicsContext text");

                expect(labels.length).toBe(3);
                expect($(labels.first().css("font-size")).selector).toBe('16px');
                expect($(labels[0]).text()).toEqual("$1K");

                done();
            };

            FunnelChartHelpers.testLabelsFontSize(
                dataViewBuilder,
                categoryColumnRef,
                visualBuilder,
                dataViewMetadata,
                12,
                assert);
        });

        it("labels filtered when heigher than bar height", (done) => {

            var assert = () => {
                let labels: JQuery = $(".funnelChart .labelGraphicsContext text");
                expect(labels.length).toBe(2); // Labels are put outside of bar.
                done();
            };

            FunnelChartHelpers.testLabelsFontSize(
                dataViewBuilder,
                categoryColumnRef,
                visualBuilder,
                dataViewMetadata,
                40,
                assert);
        });
        
        it("Default labels validation - with value 0", (done) => {
            let metadataWithDisplayUnits: DataViewMetadata = $.extend(true, {}, dataViewMetadata);
            metadataWithDisplayUnits.objects = { labels: { labelDisplayUnits: 1000 } };
            
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Mr Bing"
            ];
            
            dataViewBuilder.setMetadata(metadataWithDisplayUnits);
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([555, 2000, 0])
                    .setSubtotal(2555)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {    
                // The funnel bars are rotated 90 degrees, so for the bars, "y" and "height" correspond
                // to what we would think of as the position and size along the x-axis.
                // The funnel data labels are not rotated, so for the labels we need to use "x" and "width".

                let labels: JQuery = $(".funnelChart .labelGraphicsContext text");
                expect(labels.length).toBe(3);
                expect($(labels[2]).text()).toEqual("$0K");
                helpers.assertColorsMatch($(labels[0]).css("fill"), defaultInsideLabelColor);
                
                //last value is 0, should be default color 
                helpers.assertColorsMatch($(labels[2]).css("fill"), labelColor);
                
                // Check that all labels are centering 
                expect($(labels[2]).attr("x")).toEqual($(labels[0]).attr("x"));
                expect($(labels[2]).attr("x")).toEqual($(labels[1]).attr("x"));

                done();
            }, DefaultWaitForRender);
        });

        it("Validate label colors and positioning", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Mr Bing"
            ];
            
            dataViewBuilder.setMetadata(dataViewMetadata);
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([2000, 1555, 20])
                    .setSubtotal(3575)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {    
                let labels: JQuery = $(".funnelChart .labelGraphicsContext text");
                let firstBarX: number = +$(".funnelChart").find(".funnelBar").first().attr("x");
                let firstBarWidth: number = +$(".funnelChart").find(".funnelBar").first().attr("width");

                // The first label should be white and should be inside the bar.
                expect($(labels[0]).text()).toEqual("$2K");
                helpers.assertColorsMatch($(labels[0]).css("fill"), defaultInsideLabelColor);
                expect($(labels[0]).attr("x")).toBeGreaterThan(firstBarX);
                expect($(labels[0]).attr("x")).toBeLessThan(firstBarX + firstBarWidth);

                // The third label should be the same as the fill color and should be outside the bar.
                let thirdBarX: number = +$(".funnelChart").find(".funnelBar").eq(2).attr("x");
                let thirdBarWidth: number = +$(".funnelChart").find(".funnelBar").eq(2).attr("width");
                
                //Data labels precision = 0
                expect($(labels[2]).text()).toEqual("$0K");
                helpers.assertColorsMatch($(labels[2]).css("fill"), labelColor);
                expect($(labels[2]).attr("x")).toBeGreaterThan(thirdBarX + thirdBarWidth);
                done();
            }, DefaultWaitForRender);
        });

        it("Change labels position validation", (done) => {
            let dataViewMetadataWithLabelsObject: DataViewMetadata = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsObject.objects = { labels: { labelPosition: labelPosition.insideBase } };

            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Mr Bing"
            ];
            
            dataViewBuilder.setMetadata(dataViewMetadata);
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([1000, 2000, 2000])
                    .setSubtotal(5000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                let labels: JQuery = $(".funnelChart .labelGraphicsContext .label");
                let firstBarX: number = +$(".funnelChart").find(".funnelBar").first().attr("x");
                let firstBarWidth: number = +$(".funnelChart").find(".funnelBar").first().attr("width");
                let firstBar: number = firstBarX + firstBarWidth;

                expect(labels.length).toBe(3);
                helpers.assertColorsMatch($(labels[0]).css("fill"), defaultInsideLabelColor);
                helpers.assertColorsMatch($(labels[1]).css("fill"), defaultInsideLabelColor);
                helpers.assertColorsMatch($(labels[2]).css("fill"), defaultInsideLabelColor);
                
                //Check that the labels position is inside
                expect($(labels[0]).attr("x")).toBeGreaterThan(firstBarX);
                expect($(labels[0]).attr("x")).toBeLessThan(firstBar);
                done();
            }, DefaultWaitForRender);
        });

        it("Change labels color validation", (done) => {
            let color: string = "#CC0099";
            
            let dataViewMetadataWithLabelsObject: DataViewMetadata = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsObject.objects = {
                labels: {
                    color: { solid: { color: "#CC0099" } },
                }
            };
            
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Mr Bing"
            ];
            
            dataViewBuilder.setMetadata(dataViewMetadataWithLabelsObject);
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadataWithLabelsObject.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadataWithLabelsObject.columns[1])
                    .setValues([1555, 2000, 20])
                    .setSubtotal(3575)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                let labels: JQuery = $(".funnelChart .labelGraphicsContext text");
                expect(labels.length).toBe(3);
                
                // Check color has changed for both inside outside labels.
                helpers.assertColorsMatch($(labels[0]).css("fill"), color);
                helpers.assertColorsMatch($(labels[1]).css("fill"), color);
                helpers.assertColorsMatch($(labels[2]).css("fill"), color);
                done();
            }, DefaultWaitForRender);
        });

        it("Hide labels validation", (done) => {
            let dataViewMetadataWithLabelsObject: DataViewMetadata = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsObject.objects = { labels: { show: false } };

            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Mr Bing"
            ];
            
            dataViewBuilder.setMetadata(dataViewMetadataWithLabelsObject);
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadataWithLabelsObject.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadataWithLabelsObject.columns[1])
                    .setValues([1555, 2000, 20])
                    .setSubtotal(3575)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                let labels: JQuery = $(".funnelChart .labelGraphicsContext text");
                expect(labels.length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });

        it("Funnel highlighted values - validate labels", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Mr Bing"
            ];

            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 700])
                    .setSubtotal(1000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataViewNoHighlights: DataView = dataViewBuilder.build();
            
            dataViewBuilder = new DataViewBuilder();
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 700])
                    .setHighlights([50, 140, 420])
                    .setSubtotal(1000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataViewHighlightsA: DataView = dataViewBuilder.build();
            
            dataViewBuilder = new DataViewBuilder();
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 700])
                    .setHighlights([75, 40, 220])
                    .setSubtotal(1000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataViewHighlightsB: DataView = dataViewBuilder.build();
            
            visualBuilder.visual.onDataChanged({ dataViews: [dataViewNoHighlights] });
            visualBuilder.visual.onDataChanged({ dataViews: [dataViewHighlightsA] });
            visualBuilder.visual.onDataChanged({ dataViews: [dataViewHighlightsB] });
            visualBuilder.visual.onDataChanged({ dataViews: [dataViewNoHighlights] });

            setTimeout(() => {
                let labels: JQuery = $(".funnelChart .labelGraphicsContext text");
                expect(labels.length).toBe(3);
                helpers.assertColorsMatch($(labels[0]).css("fill"), defaultInsideLabelColor);
                expect($(labels[0]).text()).toEqual("$100");
                expect($(labels[1]).text()).toEqual("$200");
                expect($(labels[2]).text()).toEqual("$700");

                done();
            }, DefaultWaitForRender);
        });

        it("Funnel highlighted values - validate percent bars", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Mr Bing"
            ];

            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 700])
                    .setSubtotal(1000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataViewNoHighlights: DataView = dataViewBuilder.build();
            
            dataViewBuilder = new DataViewBuilder();
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 700])
                    .setHighlights([50, 140, 420])
                    .setSubtotal(1000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataViewHighlightsA: DataView = dataViewBuilder.build();
            
            dataViewBuilder = new DataViewBuilder();
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 700])
                    .setHighlights([75, 40, 220])
                    .setSubtotal(1000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataViewHighlightsB: DataView = dataViewBuilder.build();

            visualBuilder.visual.onDataChanged({ dataViews: [dataViewNoHighlights] });

            setTimeout(() => {
                FunnelChartHelpers.validatePercentBars(true, dataViewNoHighlights);
                visualBuilder.visual.onDataChanged({ dataViews: [dataViewHighlightsA] });
                setTimeout(() => {
                    FunnelChartHelpers.validatePercentBars(true, dataViewHighlightsA);
                    visualBuilder.visual.onDataChanged({ dataViews: [dataViewHighlightsB] });
                    setTimeout(() => {
                        FunnelChartHelpers.validatePercentBars(true, dataViewHighlightsB);
                        visualBuilder.visual.onDataChanged({ dataViews: [dataViewNoHighlights] });
                        setTimeout(() => {
                            FunnelChartHelpers.validatePercentBars(true, dataViewNoHighlights);
                            done();
                        }, DefaultWaitForRender);
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it("labels should support display units with no precision", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Mr Bing"
            ];
            
            let dataViewMetadataWithLabelsObject: DataViewMetadata = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsObject.objects = {
                labels: { show: true, labelDisplayUnits: 1000, labelPrecision: 0 }
            };

            dataViewBuilder.setMetadata(dataViewMetadataWithLabelsObject);

            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadataWithLabelsObject.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadataWithLabelsObject.columns[1])
                    .setValues([1555, 2000, 20])
                    .setSubtotal(3575)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                expect($(".funnelChart .labelGraphicsContext text").first().text()).toBe("$2K");
                done();
            }, DefaultWaitForRender);
        });

        it("labels should support display units with precision", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Mr Bing"
            ];
            
            let dataViewMetadataWithLabelsObject: DataViewMetadata = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsObject.objects = {
                labels: { show: true, labelDisplayUnits: 1000, labelPrecision: 2 }
            };

            dataViewBuilder.setMetadata(dataViewMetadataWithLabelsObject);

            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadataWithLabelsObject.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadataWithLabelsObject.columns[1])
                    .setValues([1556, 2000, 20])
                    .setSubtotal(3575)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();
            
            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                expect($(".funnelChart .labelGraphicsContext text").first().text()).toBe("$1.56K");
                done();
            }, DefaultWaitForRender);
        });

        it("Default decimal labels validation", (done) => {
            let metadataWithDisplayUnits = $.extend(true, {}, dataViewMetadata);
            metadataWithDisplayUnits.objects = { labels: { labelDisplayUnits: 1000 } };
            metadataWithDisplayUnits.columns[1].objects.general.formatString = "$#,0.00"; // Match format string to output result

            let fontSize = "12px";
            
            let categoryValues: any = [
                "John Domo",
                "Delta Force",
                "Mr Bing"
            ];
            
            dataViewBuilder.setMetadata(metadataWithDisplayUnits);
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([555, 2000, 20])
                    .setSubtotal(2575)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: powerbi.DataView = dataViewBuilder.build();
                
            dataView.categorical.values[0].source["objects"]["general"]["formatString"] = "$0.00";
            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {    
                let labels = $(".funnelChart .labelGraphicsContext text");
                let firstBarX = +$(".funnelChart").find(".funnelBar").first().attr("x");
                let firstBarWidth = +$(".funnelChart").find(".funnelBar").first().attr("width");
                let lastBarX = +$(".funnelChart").find(".funnelBar").last().attr("x");
                let lastBarWidth = +$(".funnelChart").find(".funnelBar").last().attr("width");

                expect(labels.length).toBe(3);
                helpers.assertColorsMatch($(labels[0]).css("fill"), defaultInsideLabelColor);
                helpers.assertColorsMatch($(labels[2]).css("fill"), labelColor);
                expect($(labels[0]).css("fill-opacity")).toEqual("1");
                expect($(labels[1]).css("fill-opacity")).toEqual("1");
                expect($(labels[2]).css("fill-opacity")).toEqual("1");
                expect($(labels.first().css("font-size")).selector).toBe(fontSize);
                expect($(labels[0]).text()).toEqual("$0.56K");

                // Check that the first label is inside
                expect($(labels[0]).attr("x")).toBeGreaterThan(firstBarX);
                expect($(labels[0]).attr("x")).toBeLessThan(firstBarX + firstBarWidth);

                // Check that the last label is outside
                expect($(labels[2]).attr("x")).toBeGreaterThan(lastBarX + lastBarWidth);
                done();
            }, DefaultWaitForRender);
        });

        it("Category Labels with repeated items due to source formatting", (done) => {
            let visualBuilder: VisualBuilder = new VisualBuilder(
                powerbi.visuals.plugins.funnel.create,
                500,
                500
            );
            visualBuilder.build();

            var dataViewMetadata: DataViewMetadata = {
                columns: [
                    {
                        displayName: "Date",
                        queryName: "select0",
                        format: "%d\-MMM",
                        objects: { general: { formatString: "%d\-MMM" } },
                        type: ValueType.fromDescriptor({ dateTime: true }),
                        roles: { 'Category': true }
                    },
                    {
                        displayName: "Sales",
                        queryName: "select1",
                        format: "g",
                        isMeasure: true,
                        roles: { "Y": true },
                        objects: { general: { formatString: "g" } }
                    },
                ]
            };

            let categoryValues: Date[] = [
                new Date(2010, 0, 1),   //1-Jan-2010
                new Date(2010, 1, 1),
                new Date(2010, 2, 1),
                new Date(2011, 0, 1),
                new Date(2012, 0, 1),
                new Date(2013, 0, 1)
            ];

            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2010/1/1"),
                mocks.dataViewScopeIdentity("2010/2/1"),
                mocks.dataViewScopeIdentity("2010/3/1"),
                mocks.dataViewScopeIdentity("2011/1/1"),
                mocks.dataViewScopeIdentity("2012/1/1"),
                mocks.dataViewScopeIdentity("2013/1/1")
            ];

            let dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: categoryValues,
                        identity: categoryIdentities,
                    }],
                    values: powerbi.data.DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[1],
                            min: 1,
                            max: 6,
                            subtotal: 21,
                            values: [1, 2, 3, 4, 5, 6]
                        }])
                }
            };

            let Months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"];

            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                expect($(".funnelChart .axis").find("text").length).toBe(categoryValues.length);
                for (let i = 0, len = categoryValues.length; i < len; i++) {
                    expect($(".funnelChart .axis").find("text")[i].textContent).toBe(categoryValues[i].getDate() + "-" + Months[categoryValues[i].getMonth()]);
                }
                done();
            }, DefaultWaitForRender);
        }
            );

        it("funnel axis tooltip", (done) => {
            let tickValueClassSelector = '.tick title';
            let categoryValues: any[] = [
                "Donald Duck Donald Duck Donald Duck Donald Duck Donald Duck Donald Duck Donald Duck Donald Duck Donald Duck",
                "Mickey Mouse",
                "Pluto"
            ];

            let dataViewMetadataWithLabelsObject: DataViewMetadata = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsObject.objects = {
                labels: { show: true, labelDisplayUnits: 1000, labelPrecision: 2 }
            };

            dataViewBuilder.setMetadata(dataViewMetadataWithLabelsObject);

            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadataWithLabelsObject.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                .setSource(dataViewMetadataWithLabelsObject.columns[1])
                .setValues([1555, 2000, 20])
                .setSubtotal(3575)
                .buildNewValue()
                .buildValueColumns();

            let dataView: DataView = dataViewBuilder.build();

            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                expect($(tickValueClassSelector)[0].textContent).toBe(categoryValues[0]);
                expect($(tickValueClassSelector)[1].textContent).toBe(categoryValues[1]);
                expect($(tickValueClassSelector)[2].textContent).toBe(categoryValues[2]);
                done();
            }, DefaultWaitForRender);
        });

        it("funnel percent bars tooltip", (done) => {
            let categoryValues: any[] = [
                "Donald Duck",
                "Mickey Mouse",
                "Pluto"
            ];

            let percentBarsSelector = '.value title';
            let dataViewMetadataWithLabelsObject: DataViewMetadata = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsObject.objects = {
                labels: { show: true, labelDisplayUnits: 1000, labelPrecision: 2 }
            };

            dataViewBuilder.setMetadata(dataViewMetadataWithLabelsObject);

            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadataWithLabelsObject.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                .setSource(dataViewMetadataWithLabelsObject.columns[1])
                .setValues([1555, 2000, 20])
                .setSubtotal(3575)
                .buildNewValue()
                .buildValueColumns();

            let dataView: DataView = dataViewBuilder.build();

            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                expect($(percentBarsSelector)[0].textContent).toBe('100%');
                expect($(percentBarsSelector)[1].textContent).toBe('1.3%');
                done();
            }, DefaultWaitForRender);
        });
        
        it("Axis labels should not take more than 25% of the viewport (regular viewport)", (done) => {
            let categoryValues: any[] = [
                "Goofy",
                "Donald Duck",
                "Mickey Mouse",
            ];

            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                .setSource(dataViewMetadata.columns[1])
                .setValues([100, 200, 700])
                .buildNewValue()
                .buildValueColumns();

            let dataView: DataView = dataViewBuilder.build();

            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                let yAxisLabelsWidth = FunnelChartHelpers.getYAxisWidth() - FunnelChart.YAxisPadding;
                let viewportWidth = FunnelChartHelpers.getViewportWidth();
                let axisPercent = yAxisLabelsWidth / viewportWidth;

                // Round to 2 decimal places and make sure it doesn't exceed 25%
                expect(Math.round(axisPercent * 100) / 100).not.toBeGreaterThan(.25);
                done();
            }, DefaultWaitForRender);
        });

        it("Axis labels should not take more than 25% of the viewport (small viewport)", (done) => {
            let categoryValues: any[] = [
                "Goofy",
                "Donald Duck",
                "Mickey Mouse",
            ];

            let visualBuilder: VisualBuilder = new VisualBuilder(
                powerbi.visuals.plugins.funnel.create,
                80,
                80
            );
            visualBuilder.build();

            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                .setSource(dataViewMetadata.columns[1])
                .setValues([100, 200, 700])
                .buildNewValue()
                .buildValueColumns();

            let dataView: DataView = dataViewBuilder.build();

            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                let yAxisLabelsWidth = FunnelChartHelpers.getYAxisWidth() - FunnelChart.YAxisPadding;
                let viewportWidth = FunnelChartHelpers.getViewportWidth();
                let axisPercent = yAxisLabelsWidth / viewportWidth;

                // Round to 2 decimal places and make sure it doesn't exceed 25%
                expect(Math.round(axisPercent * 100) / 100).not.toBeGreaterThan(.25);
                done();
            }, DefaultWaitForRender);
        });
    });

    describe("funnel chart web animation", () => {
        let dataViewBuilder: DataViewBuilder;
        
        let visualBuilder: VisualBuilder;
        
        let dataViewMetadata: DataViewMetadata = {
            columns: [
                { displayName: "col1", queryName: "col1", roles: { "Category": true } },
                { displayName: "col2", queryName: "col2", roles: { "Y": true } },
                { displayName: "col3", queryName: "col3", roles: { "Y": true } },
            ]
        };
        let categoryColumnRef: SQExpr =
            SQExprBuilder.fieldDef({ schema: "s", entity: "e", column: "col1" });

        beforeEach(() => {
            dataViewBuilder = new DataViewBuilder();
            
            dataViewBuilder.setMetadata(dataViewMetadata);
            
            visualBuilder = new VisualBuilder(
                () => new powerbi.visuals.FunnelChart({
                    animator: new powerbi.visuals.WebFunnelAnimator(),
                    behavior: new powerbi.visuals.FunnelWebBehavior(),
                    tooltipsEnabled: true,
                }),
                500,
                500
            );
            
            visualBuilder.build();
        });

        it("funnel highlight animation", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Jean Tablau"
            ];
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 700])
                    .setSubtotal(1000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataViewNoHighlights: DataView = dataViewBuilder.build();
            
            dataViewBuilder = new DataViewBuilder();
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 700])
                    .setHighlights([50, 140, 420])
                    .setSubtotal(1000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataViewHighlightsA: DataView = dataViewBuilder.build();
            
            dataViewBuilder = new DataViewBuilder();
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 700])
                    .setHighlights([75, 40, 220])
                    .setSubtotal(1000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataViewHighlightsB: DataView = dataViewBuilder.build();

            let animator: WebFunnelAnimator = <WebFunnelAnimator>(<FunnelChart>visualBuilder.visual).animator;
            spyOn(animator, "animate").and.callThrough();

            visualBuilder.visual.onDataChanged({ dataViews: [dataViewNoHighlights] });
            visualBuilder.visual.onDataChanged({ dataViews: [dataViewHighlightsA] });
            visualBuilder.visual.onDataChanged({ dataViews: [dataViewHighlightsB] });
            visualBuilder.visual.onDataChanged({ dataViews: [dataViewNoHighlights] });

            expect(animator).toBeTruthy();
            expect(animator.animate).toHaveBeenCalled();

            done();
        });

        it("funnel highlight animation - percent bars", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Jean Tablau"
            ];
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 700])
                    .setSubtotal(1000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataViewNoHighlights: DataView = dataViewBuilder.build();
            
            dataViewBuilder = new DataViewBuilder();
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 700])
                    .setHighlights([50, 140, 420])
                    .setSubtotal(1000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataViewHighlightsA: DataView = dataViewBuilder.build();
            
            dataViewBuilder = new DataViewBuilder();
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 700])
                    .setHighlights([75, 40, 220])
                    .setSubtotal(1000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataViewHighlightsB: DataView = dataViewBuilder.build();

            let animator: WebFunnelAnimator = <WebFunnelAnimator>(<FunnelChart>visualBuilder.visual).animator;
            expect(animator).toBeTruthy();

            let animatorSpy: Spy = spyOn(animator, "animate");
            animatorSpy.and.callThrough();

            visualBuilder.visual.onDataChanged({ dataViews: [dataViewNoHighlights] });
            expect(animator.animate).toHaveBeenCalled();

            setTimeout(() => {
                FunnelChartHelpers.validatePercentBars(true, dataViewNoHighlights);
                visualBuilder.visual.onDataChanged({ dataViews: [dataViewHighlightsA] });
                setTimeout(() => {
                    FunnelChartHelpers.validatePercentBars(true, dataViewHighlightsA);
                    visualBuilder.visual.onDataChanged({ dataViews: [dataViewHighlightsB] });
                    setTimeout(() => {
                        FunnelChartHelpers.validatePercentBars(true, dataViewHighlightsB);
                        visualBuilder.visual.onDataChanged({ dataViews: [dataViewNoHighlights] });
                        setTimeout(() => {
                            FunnelChartHelpers.validatePercentBars(true, dataViewNoHighlights);
                            expect(animator.animate).toHaveBeenCalled();
                            expect(animatorSpy.calls.count()).toBe(4);

                            done();
                        }, DefaultWaitForRender);
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it("funnel highlight animation - suppressAnimations", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Jean Tablau"
            ];
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 700])
                    .setSubtotal(1000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataViewNoHighlights: DataView = dataViewBuilder.build();
            
            dataViewBuilder = new DataViewBuilder();
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 700])
                    .setHighlights([50, 140, 420])
                    .setSubtotal(1000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataViewHighlightsA: DataView = dataViewBuilder.build();
            
            dataViewBuilder = new DataViewBuilder();
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 700])
                    .setHighlights([75, 40, 220])
                    .setSubtotal(1000)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataViewHighlightsB: DataView = dataViewBuilder.build();

            let animator: WebFunnelAnimator = <WebFunnelAnimator>(<FunnelChart>visualBuilder.visual).animator;
            spyOn(animator, "animate").and.callThrough();

            visualBuilder.visual.onDataChanged({ suppressAnimations: true, dataViews: [dataViewNoHighlights] });
            visualBuilder.visual.onDataChanged({ suppressAnimations: true, dataViews: [dataViewHighlightsA] });
            visualBuilder.visual.onDataChanged({ suppressAnimations: true, dataViews: [dataViewHighlightsB] });
            visualBuilder.visual.onDataChanged({ suppressAnimations: true, dataViews: [dataViewNoHighlights] });

            expect(animator).toBeTruthy();
            expect(animator.animate).not.toHaveBeenCalled();

            done();
        });

        it("funnel highlight animation - small viewport forcing small bars also hides category and data labels", (done) => {
            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Jean Tablau",
                "Bugs Bunny",
                "Mickey Mouse",
                "Donald Duck",
                "VRM Jones"
            ];

            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 300, 400, 500, 600, 700])
                    .setHighlights([50, 140, 220, 386, 418, 563, 610])
                    .setSubtotal(2800)
                    .buildNewValue()
                .buildValueColumns();
            
            let dataViewHighlights: DataView = dataViewBuilder.build();

            let animator: WebFunnelAnimator = <WebFunnelAnimator>(<FunnelChart>visualBuilder.visual).animator;
            spyOn(animator, "animate").and.callThrough();

            visualBuilder.visual.onDataChanged({ dataViews: [dataViewHighlights] });

            expect(animator).toBeTruthy();
            expect(animator.animate).toHaveBeenCalled();

            setTimeout(() => {
                FunnelChartHelpers.validatePercentBars(true, dataViewHighlights);
                expect($(".funnelChart g").length).toBe(11);
                expect($(".funnelChart .axis").find("text").length).toBe(7);
                expect($(".funnelChart .labelGraphicsContext text").length).toBe(7);
                visualBuilder.visual.onResizing({ height: 50, width: 100 });
                setTimeout(() => {
                    FunnelChartHelpers.validatePercentBars(false, dataViewHighlights);
                    expect($(".funnelChart g").length).toBe(4);
                    expect($(".funnelChart .axis").find("text").length).toBe(0);
                    expect($(".funnelChart .labelGraphicsContext text").length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
    });

    describe("Enumerate Objects", () => {
        let dataViewBuilder: DataViewBuilder;
        
        let visualBuilder: VisualBuilder;
        
        let dataViewMetadata: DataViewMetadata = {
            columns: [
                {
                    displayName: "col1",
                    queryName: "col1",
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                    roles: { "Category": true }
                },
                {
                    displayName: "col2",
                    queryName: "col2",
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    isMeasure: true,
                    roles: { "Y": true },
                },
                {
                    displayName: "col3",
                    queryName: "col3",
                    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                    isMeasure: true,
                    roles: { "Y": true },
                }
            ]
        };

        let dataViewGradientMetadata: DataViewMetadata = {
            columns: [
                { displayName: "col1", queryName: "col1", roles: { "Category": true } },
                { displayName: "col2", queryName: "col2", isMeasure: true, roles: { "Y": true } },
                { displayName: "col3", queryName: "col3", isMeasure: true, roles: { "Gradient": true } },
            ]
        };

        let dataViewGradientAndYMetadata: DataViewMetadata = {
            columns: [
                { displayName: "col1", queryName: "col1", roles: { "Category": true } },
                { displayName: "col2", queryName: "col2", isMeasure: true, roles: { "Y": true, "Gradient": true } },
                { displayName: "col3", queryName: "col3", isMeasure: true, roles: { "Y": true } },
            ]
        };

        let categoryColumnRef: SQExpr =
            SQExprBuilder.fieldDef({ schema: "s", entity: "e", column: "col1" });

        beforeEach(() => {
            dataViewBuilder = new DataViewBuilder();
            
            dataViewBuilder.setMetadata(dataViewMetadata);
            
            visualBuilder = new VisualBuilder(
                powerbi.visuals.plugins.funnel.create,
                500,
                500
            );

            visualBuilder.build();
        });

        it("Check enumeration: category measure", () => {
            let categoryValues: any[] = [
                "a",
                "b",
                "c"
            ];
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100, 200, 300, 400, 500])
                    .buildNewValue()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[2])
                    .setValues([200, 400, 600, 800, 1000])
                    .buildNewValue()
                .buildValueColumns();
            
            let dataChangedOptions: VisualDataChangedOptions = {
                dataViews: [dataViewBuilder.build()]
            };

            visualBuilder.visual.onDataChanged(dataChangedOptions);
            let points = <VisualObjectInstanceEnumerationObject>visualBuilder.visual.enumerateObjectInstances({ objectName: 'dataPoint' });
            expect(points.instances.length).toBe(4);
            expect(points.instances[1].displayName).toBe('a');
            expect(points.instances[1].properties['fill']).toBeDefined();
            expect(points.instances[2].displayName).toBe('b');
            expect(points.instances[2].properties['fill']).toBeDefined();
        });

        it("Check enumeration: multi-measure", () => {
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[1])
                    .setValues([100])
                    .buildNewValue()
                .newValueBuilder()
                    .setSource(dataViewMetadata.columns[2])
                    .setValues([200])
                    .buildNewValue()
                .buildValueColumns();
            
            let dataChangedOptions: VisualDataChangedOptions = {
                dataViews: [dataViewBuilder.build()]
            };

            visualBuilder.visual.onDataChanged(dataChangedOptions);
            let points = <VisualObjectInstanceEnumerationObject>visualBuilder.visual.enumerateObjectInstances({ objectName: 'dataPoint' });
            expect(points.instances.length).toBe(3);
            expect(points.instances[1].displayName).toBe('col2');
            expect(points.instances[1].properties['fill']).toBeDefined();
            expect(points.instances[2].displayName).toBe('col3');
            expect(points.instances[2].properties['fill']).toBeDefined();
        });

        it("Gradient color", () => {
            let dataColors: IDataColorPalette = visualStyles.create().colorPalette.dataColors;
            let colors: string[] = ["#d9f2fb", "#ff557f", "#b1eab7"];
            let objectDefinitions: DataViewObjects[] = [
                { dataPoint: { fill: { solid: { color: colors[0] } } } },
                { dataPoint: { fill: { solid: { color: colors[1] } } } },
                { dataPoint: { fill: { solid: { color: colors[2] } } } }
            ];
            
            let categoryValues: any[] = [
                "a",
                "b",
                "c"
            ];

            dataViewBuilder.setMetadata(dataViewGradientMetadata);
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewGradientMetadata.columns[0])
                .setValues(categoryValues)
                .setObjects(objectDefinitions)
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewGradientMetadata.columns[1])
                    .setValues([100, 200, 300, 400, 500])
                    .buildNewValue()
                .newValueBuilder()
                    .setSource(dataViewGradientMetadata.columns[1])
                    .setValues([200, 400, 600, 800, 1000])
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();

            let defaultDataPointColor: string = "#00FF00";

            let actualData: FunnelData = FunnelChart.converter(dataView, dataColors, visualBuilder.host, defaultDataPointColor);

            helpers.assertColorsMatch(actualData.dataPoints[0].color, colors[0]);
            helpers.assertColorsMatch(actualData.dataPoints[1].color, colors[1]);
            helpers.assertColorsMatch(actualData.dataPoints[2].color, colors[2]);
        });

        it("Gradient color - validate tool tip", () => {
            let dataColors: IDataColorPalette = visualStyles.create().colorPalette.dataColors;
            let colors: string[] = ["#d9f2fb", "#ff557f", "#b1eab7"];
            let objectDefinitions: DataViewObjects[] = [
                { dataPoint: { fill: { solid: { color: colors[0] } } } },
                { dataPoint: { fill: { solid: { color: colors[1] } } } },
                { dataPoint: { fill: { solid: { color: colors[2] } } } }
            ];

            let categoryValues: any[] = [
                "a",
                "b",
                "c"
            ];

            dataViewBuilder.setMetadata(dataViewGradientMetadata);
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewGradientMetadata.columns[0])
                .setValues(categoryValues)
                .setObjects(objectDefinitions)
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewGradientMetadata.columns[1])
                    .setValues([100, 200, 300, 400, 500])
                    .setSubtotal([1500])
                    .buildNewValue()
                .newValueBuilder()
                    .setSource(dataViewGradientMetadata.columns[2])
                    .setValues([200, 400, 600, 800, 1000])
                    .setSubtotal([3000])
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();

            let defaultDataPointColor: string = "#00FF00";
            let actualData: FunnelData = FunnelChart.converter(dataView, dataColors, visualBuilder.host, defaultDataPointColor);

            expect(actualData.dataPoints[0].tooltipInfo).toEqual([{ displayName: "col1", value: "a" }, { displayName: "col2", value: "100" }, { displayName: "col3", value: "200" }, { displayName: "Percent of first", value: "100%" }]);
            expect(actualData.dataPoints[1].tooltipInfo).toEqual([{ displayName: "col1", value: "b" }, { displayName: "col2", value: "200" }, { displayName: "col3", value: "400" }, { displayName: "Percent of first", value: "200%" }, { displayName: "Percent of previous", value: "200%" }]);
            expect(actualData.dataPoints[2].tooltipInfo).toEqual([{ displayName: "col1", value: "c" }, { displayName: "col2", value: "300" }, { displayName: "col3", value: "600" }, { displayName: "Percent of first", value: "300%" }, { displayName: "Percent of previous", value: "150%" }]);
        });

        it("Gradient and Y have the index - validate tool tip", () => {
            let dataColors: IDataColorPalette = visualStyles.create().colorPalette.dataColors;
            let dataViewGradientMetadata: DataViewMetadata = {
                columns: [
                    { displayName: "col1", queryName: "col1" },
                    { displayName: "col2", queryName: "col2", isMeasure: true, roles: { "Gradient": true } },
                    { displayName: "col3", queryName: "col3", isMeasure: true, roles: { "Y": true } },
                ]
            };

            let categoryValues: any[] = [
                "a",
                "b",
                "c"
            ];

            dataViewBuilder.setMetadata(dataViewGradientAndYMetadata);
            
            dataViewBuilder.categoryBuilder()
                .setSource(dataViewGradientAndYMetadata.columns[0])
                .setValues(categoryValues)
                .buildCategory();
            
            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                    .setSource(dataViewGradientMetadata.columns[1])
                    .setValues([100, 200, 300, 400, 500])
                    .setSubtotal([1500])
                    .buildNewValue()
                .newValueBuilder()
                    .setSource(dataViewGradientMetadata.columns[2])
                    .setValues([200, 400, 600, 800, 1000])
                    .setSubtotal([3000])
                    .buildNewValue()
                .buildValueColumns();
            
            let dataView: DataView = dataViewBuilder.build();

            let defaultDataPointColor: string = "#00FF00";
            let actualData: FunnelData = FunnelChart.converter(dataView, dataColors, visualBuilder.host, defaultDataPointColor);

            expect(actualData.dataPoints[0].tooltipInfo).toEqual([{ displayName: "col1", value: "a" }, { displayName: "col3", value: "200" }, { displayName: "col2", value: "100" }, { displayName: "Percent of first", value: "100%" }]);
            expect(actualData.dataPoints[1].tooltipInfo).toEqual([{ displayName: "col1", value: "b" }, { displayName: "col3", value: "400" }, { displayName: "col2", value: "200" }, { displayName: "Percent of first", value: "200%" }, { displayName: "Percent of previous", value: "200%" }]);
            expect(actualData.dataPoints[2].tooltipInfo).toEqual([{ displayName: "col1", value: "c" }, { displayName: "col3", value: "600" }, { displayName: "col2", value: "300" }, { displayName: "Percent of first", value: "300%" }, { displayName: "Percent of previous", value: "150%" }]);
        });

        it("converter does filter Gradient role", () => {
            let dataColors: IDataColorPalette = visualStyles.create().colorPalette.dataColors;

            let dataViewGradientMetadata: DataViewMetadata = {
                columns: [
                    { displayName: "col1", queryName: "col1", roles: { "Category": true } },
                    { displayName: "col2", queryName: "col2", isMeasure: true, roles: { "Gradient": true } },
                    { displayName: "col3", queryName: "col3", isMeasure: true, roles: { "Y": true } },
                ]
            };

            let categoryValues: any[] = [
                "a",
                "b",
                "c"
            ];

            dataViewBuilder.setMetadata(dataViewGradientMetadata);

            dataViewBuilder.categoryBuilder()
                .setSource(dataViewGradientMetadata.columns[0])
                .setValues(categoryValues)
                .buildCategory();

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                .setSource(dataViewGradientMetadata.columns[1])
                .setValues([100, 200, 300, 400, 500])
                .setSubtotal([1500])
                .buildNewValue()
                .newValueBuilder()
                .setSource(dataViewGradientMetadata.columns[2])
                .setValues([200, 400, 600, 800, 1000])
                .setSubtotal([3000])
                .buildNewValue()
                .buildValueColumns();

            let dataView: DataView = dataViewBuilder.build();
            let actualData: FunnelData = FunnelChart.converter(dataView, dataColors, visualBuilder.host);

            let expectedSliceValues = [200, 400, 600];
            actualData.dataPoints.map((slice, i) => {
                expect(slice.value).toBe(expectedSliceValues[i]);
            });
        });

        it("converter does not filter Gradient + Y role", () => {
            let dataColors: IDataColorPalette = visualStyles.create().colorPalette.dataColors;

            let categoryValues: any[] = [
                "a",
                "b",
                "c"
            ];

            dataViewBuilder.setMetadata(dataViewGradientMetadata);

            dataViewBuilder.categoryBuilder()
                .setSource(dataViewGradientMetadata.columns[0])
                .setValues(categoryValues)
                .buildCategory();

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                .setSource(dataViewGradientMetadata.columns[1])
                .setValues([100, 200, 300, 400, 500])
                .setSubtotal([1500])
                .buildNewValue()
                .newValueBuilder()
                .setSource(dataViewGradientMetadata.columns[2])
                .setValues([200, 400, 600, 800, 1000])
                .setSubtotal([3000])
                .buildNewValue()
                .buildValueColumns();

            let dataView: DataView = dataViewBuilder.build();
            let actualData: FunnelData = FunnelChart.converter(dataView, dataColors, visualBuilder.host);

            let expectedSliceValues = [100, 200, 300];
            actualData.dataPoints.map((slice, i) => {
                expect(slice.value).toBe(expectedSliceValues[i]);
            });
        });
    });

    describe("FunnelChart.prototype.createLabelDataPoints", () => {
        let type: powerbi.ValueTypeDescriptor = { numeric: true };

        let dataViewMetadata: DataViewMetadata = {
            columns: [
                { displayName: "col2", queryName: "col2", type: type, isMeasure: true, roles: { "Y": true }, objects: { dataPoint: { fill: { solid: { color: "#FF0000" } } } } },
            ]
        };

        let FunnelChartMock = {
            data: {
                dataPoints: [],
                valuesMetadata: dataViewMetadata,
                hasHighlights: false
            }
        };

        let createLabelDataPoints: (layout: IFunnelRect, settings: powerbi.visuals.VisualDataLabelsSettings)
            => LabelDataPoint[] = (<any>FunnelChart).prototype.createLabelDataPoints.bind(FunnelChartMock);

        it("Returns empty array for for no data points", () => {
            let layout = FunnelChartHelpers.getShapeLayout();
            let visualSettings: powerbi.visuals.VisualDataLabelsSettings = { show: true, labelColor: null };
            FunnelChartMock.data.dataPoints = [];
            var result = createLabelDataPoints(layout, visualSettings);
            expect(result.length).toBe(0);
        });

        it("Returns empty for data points with null or 0 value.", () => {
            let layout = FunnelChartHelpers.getShapeLayout();
            let visualSettings: powerbi.visuals.VisualDataLabelsSettings = { show: true, labelColor: null };
            FunnelChartMock.data.dataPoints =
                [{
                    value: null,
                    originalValue: null
                },
                {
                    value: undefined,
                    originalValue: undefined
                }];

            var result = createLabelDataPoints(layout, visualSettings);
            expect(result.length).toBe(0);
        });

        it("Default position is inside center", () => {
            let layout = FunnelChartHelpers.getShapeLayout();
            let visualSettings: powerbi.visuals.VisualDataLabelsSettings = { show: true, labelColor: null };
            FunnelChartMock.data.dataPoints = [{
                value: 20,
                originalValue: 20
            }];
            var result = createLabelDataPoints(layout, visualSettings);

            expect(result.length).toBe(1);
            expect(result[0].parentShape.validPositions.length).toBeGreaterThan(1);
            expect(result[0].parentShape.validPositions[0]).toBe(powerbi.RectLabelPosition.InsideCenter);
        });

        it("Fallback position is outside end", () => {
            let layout = FunnelChartHelpers.getShapeLayout();
            let visualSettings: powerbi.visuals.VisualDataLabelsSettings = { show: true, labelColor: null };
            FunnelChartMock.data.dataPoints = [{
                value: 20,
                originalValue: 20
            }];
            var result = createLabelDataPoints(layout, visualSettings);
            expect(result[0].parentShape.validPositions[1]).toBe(powerbi.RectLabelPosition.OutsideEnd);
        });

        it("Change position to Outside End/Fallback Inside End", () => {
            let layout = FunnelChartHelpers.getShapeLayout();
            let visualSettings: powerbi.visuals.VisualDataLabelsSettings = { show: true, labelColor: null, position: powerbi.visuals.labelPosition.outsideEnd };
            FunnelChartMock.data.dataPoints = [{
                value: 20,
                originalValue: 20
            }];
            var result = createLabelDataPoints(layout, visualSettings);
            expect(result[0].parentShape.validPositions[0]).toBe(powerbi.RectLabelPosition.OutsideEnd);
            expect(result[0].parentShape.validPositions[1]).toBe(powerbi.RectLabelPosition.InsideEnd);
        });

        it("For value 0 position center shape type point.", () => {
            let layout = FunnelChartHelpers.getShapeLayout();
            let visualSettings: powerbi.visuals.VisualDataLabelsSettings = { show: true, labelColor: null, position: powerbi.visuals.labelPosition.outsideEnd };
            FunnelChartMock.data.dataPoints = [{
                value: 0,
                originalValue: 0
            }];
            var result = createLabelDataPoints(layout, visualSettings);
            expect(result[0].parentShape.validPositions[0]).toBe(powerbi.NewPointLabelPosition.Center);
        });

        it("Default inside fill and outside fill are properly applied.", () => {
            let layout = FunnelChartHelpers.getShapeLayout();
            let visualSettings: powerbi.visuals.VisualDataLabelsSettings = { show: true, labelColor: null };
            FunnelChartMock.data.dataPoints = [{
                value: 20,
                originalValue: 20,
            }];
            var result = createLabelDataPoints(layout, visualSettings);
            expect(result[0].insideFill).toBe(powerbi.visuals.NewDataLabelUtils.defaultInsideLabelColor);
            expect(result[0].outsideFill).toBe(powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
        });

        it("The same default color used for inside/outside if value is 0", () => {
            let layout = FunnelChartHelpers.getShapeLayout();
            let visualSettings: powerbi.visuals.VisualDataLabelsSettings = { show: true, labelColor: null };
            FunnelChartMock.data.dataPoints = [{
                value: 0,
                originalValue: 0,
            }];
            var result = createLabelDataPoints(layout, visualSettings);
            expect(result[0].insideFill).toBe(powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
            expect(result[0].outsideFill).toBe(powerbi.visuals.NewDataLabelUtils.defaultLabelColor);
        });

        it("Change color for data point applied for both inside outside.", () => {
            let layout = FunnelChartHelpers.getShapeLayout();
            let visualSettings: powerbi.visuals.VisualDataLabelsSettings = { show: true, labelColor: null };
            let labelFill: string = "#ffffff";
            FunnelChartMock.data.dataPoints = [{
                value: 0,
                originalValue: 0,
                labelFill: labelFill
            }];
            var result = createLabelDataPoints(layout, visualSettings);
            expect(result[0].insideFill).toBe(labelFill);
            expect(result[0].outsideFill).toBe(labelFill);
        });

        it("Doesn't create for highlited null value", () => {
            let layout = FunnelChartHelpers.getShapeLayout();
            let visualSettings: powerbi.visuals.VisualDataLabelsSettings = { show: true, labelColor: null };
            FunnelChartMock.data.dataPoints = [{
                value: 0,
                originalValue: 0,
                highlight: false
            }];
            FunnelChartMock.data.hasHighlights = true;

            var result = createLabelDataPoints(layout, visualSettings);
            expect(result.length).toBe(0);

            FunnelChartMock.data.hasHighlights = false;

        });
    });

    describe("funnel categoryLabels tests", () => {

        it("funnel categoryLabels test with view port categoryLabelsVisibleSmallerThanMinHeight mobile", (done) => {
            FunnelChartHelpers.testCategoryLabels(categoryLabelsVisibleSmallerThanMinHeightString, true);

            setTimeout(() => {
                expect($(".funnelChart .axis").find("text").length).toBe(0);
                done();

            });
        });

        it("funnel categoryLabels test with view port categoryLabelsVisibleGreaterThanDefaultMinHeight mobile", (done) => {
            FunnelChartHelpers.testCategoryLabels(categoryLabelsVisibleGreaterThanMinHeightString, true);

            setTimeout(() => {
                expect($(".funnelChart .axis").find("text").length).toBe(3);
                done();

            });
        });

        it("funnel categoryLabels test with view port categoryLabelsVisibleSmallerThanDefaultMinHeight", (done) => {
            FunnelChartHelpers.testCategoryLabels(categoryLabelsVisibleSmallerThanMinHeightString, false);

            setTimeout(() => {
                expect($(".funnelChart .axis").find("text").length).toBe(3);
                done();

            });
        });

        it("funnel categoryLabels test with view port categoryLabelsVisibleGreaterThanDefaultMinHeight", (done) => {
            FunnelChartHelpers.testCategoryLabels(categoryLabelsVisibleGreaterThanMinHeightString, false);

            setTimeout(() => {
                expect($(".funnelChart .axis").find("text").length).toBe(3);
                done();

            });
        });
    });

    export module FunnelChartHelpers {
        let PercentBarValueFormatRegex: RegExp = /^[0-9\,]+(\.[0-9]{1})?%$/gi;

        function validatePercentValues(dataView: DataView, fontSize?: number): void {
            let values: any[] = dataView.categorical.values[0].values;
            let highlights: any[] = dataView.categorical.values[0].highlights;
            let hasHighlights: boolean = !!highlights;

            let topElement = $(FunnelChart.Selectors.percentBar.text.selector).first();
            let bottomElement = $(FunnelChart.Selectors.percentBar.text.selector).last();

            let topPercent: string = helpers.findElementText(topElement);
            let bottomPercent: string = helpers.findElementText(bottomElement);

            let topPercentTitle: string = helpers.findElementTitle(topElement) ? helpers.findElementTitle(topElement) : topPercent;
            let bottomPercentTitle: string = helpers.findElementTitle(bottomElement) ? helpers.findElementTitle(bottomElement) : bottomPercent;

            [topPercent, bottomPercent].map((percent: string) => {
                let validFormat = !!percent.match(PercentBarValueFormatRegex);
                expect(validFormat).toBeTruthy();

                let bottomPercentValue: number = hasHighlights
                    ? highlights[highlights.length - 1] / highlights[0]
                    : values[values.length - 1] / values[0];
                let bottomPercentText: string =
                    formattingService.formatValue(
                        bottomPercentValue,
                        powerbi.visuals.valueFormatter.getLocalizedString("Percentage1"));

                expect(topPercent).toBe("100%");
                expect(bottomPercent).toBe(bottomPercentText);
                //validate titles
                expect(topPercentTitle).toBe("100%");
                expect(bottomPercentTitle).toBe(bottomPercentText);

                if (fontSize) {
                    expect(topElement.css('font-size')).toBe(PixelConverter.fromPoint(fontSize));
                    expect(bottomElement.css('font-size')).toBe(PixelConverter.fromPoint(fontSize));
                }
            });
        }

        function validatePercentBarComponents(shown: boolean): void {
            let count: number = shown ? 2 : 0;

            expect($(FunnelChart.Selectors.percentBar.mainLine.selector).length).toBe(count);
            expect($(FunnelChart.Selectors.percentBar.leftTick.selector).length).toBe(count);
            expect($(FunnelChart.Selectors.percentBar.rightTick.selector).length).toBe(count);
            expect($(FunnelChart.Selectors.percentBar.text.selector).length).toBe(count);
        }

        export function validatePercentBars(shown: boolean, dataView: DataView, fontSize?: number): void {
            validatePercentBarComponents(shown);

            if (shown) {
                validatePercentValues(dataView, fontSize);
            }
        }

        export function validateDataLabels(dataView: powerbi.DataView): void {
            let values = dataView.categorical.values[0].values;
            let highlights = dataView.categorical.values[0].highlights;
            let hasHighlights = !!highlights;

            let allDataLabelsMatch = _.every($(".funnelChart .labelGraphicsContext .label"), (label: HTMLElement, i: number) => {
                let expectedValue = hasHighlights ? highlights[i] : values[i];
                let labelValue = label.textContent.match(/([\d\.\,]+)/g)[0];
                return expectedValue === parseInt(labelValue, 10);
            });

            expect(allDataLabelsMatch).toBeTruthy();
        }

        export function testCategoryLabels(domSizeString: string, isMobile: boolean) {
            let funnelCreateFn: () => powerbi.IVisual,
                dataViewBuilder: DataViewBuilder = new DataViewBuilder(),
                domSize: number = Number(domSizeString);
            
            if (isMobile) {
                funnelCreateFn = () => new powerbi.visuals.FunnelChart({
                    animator: null,
                    funnelSmallViewPortProperties: {
                        hideFunnelCategoryLabelsOnSmallViewPort: true,
                        minHeightFunnelCategoryLabelsVisible: minHeightFunnelCategoryLabelsVisible
                    }
                });
            }
            else {
                funnelCreateFn = () => new powerbi.visuals.FunnelChart();
            }
            
            let visualBuilder: VisualBuilder = new VisualBuilder(
                funnelCreateFn,
                domSize,
                domSize
            );

            visualBuilder.build();

            let dataViewMetadata: DataViewMetadata = {
                columns: [
                    { displayName: "col1", queryName: "col1", roles: { "Category": true } },
                    { displayName: "col2", queryName: "col2", isMeasure: true, roles: { "Y": true } },
                ]
            };

            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Jean Tablau"
            ];

            dataViewBuilder.setMetadata(dataViewMetadata);

            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .buildCategory();

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                .setSource(dataViewMetadata.columns[1])
                .setValues([100, 200, 700])
                .buildNewValue()
                .buildValueColumns();

            visualBuilder.visual.onDataChanged({
                dataViews: [dataViewBuilder.build()]
            });
        }

        export function testLabelsFontSize(dataViewBuilder: DataViewBuilder, categoryColumnRef: SQExpr, visualBuilder: VisualBuilder, dataViewMetadata: DataViewMetadata, fontSizeInPt: number, assertCallback: () => void) {

            let metadataWithDisplayUnits: DataViewMetadata = $.extend(true, {}, dataViewMetadata);
            metadataWithDisplayUnits.objects = { labels: { labelDisplayUnits: 1000, fontSize: fontSizeInPt } };

            let categoryValues: any[] = [
                "John Domo",
                "Delta Force",
                "Mr Bing"
            ];

            dataViewBuilder.setMetadata(metadataWithDisplayUnits);

            dataViewBuilder.categoryBuilder()
                .setSource(dataViewMetadata.columns[0])
                .setValues(categoryValues)
                .setIdentity(categoryValues.map((value: any) => {
                    return mocks.dataViewScopeIdentity(value);
                }))
                .setIdentityFields([categoryColumnRef])
                .buildCategory();

            dataViewBuilder.valueColumnsBuilder()
                .newValueBuilder()
                .setSource(dataViewMetadata.columns[1])
                .setValues([555, 2000, 20])
                .setSubtotal(2575)
                .buildNewValue()
                .buildValueColumns();

            let dataView: DataView = dataViewBuilder.build();

            visualBuilder.visual.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                assertCallback();
            }, DefaultWaitForRender);
        }

        /**
         * Gets the width of the Y axis (including labels).
         */
        export function getYAxisWidth(): number {

            // The "percent bars" group is translated the distance of the width of the Y axis.
            let percentBars = $('g.percentBars').first();
            let percentBarsTransform = percentBars.attr('transform');
            let translate = SVGUtil.parseTranslateTransform(percentBarsTransform);
            let translateX = +translate.x;
            return translateX;
        }

        export function getFunnelBarXTransform(): number {
            var el: JQuery = <any>$(".funnelBar").parent();
            var transform: string = el.attr("transform");
            if (_.isEmpty(transform)) {
                return 0;
            }

            var matrix: string[] = transform.replace(/[^0-9\-.,]/g, '').split(',');
            return parseInt(matrix[0], null);
        }

        /**
         * Gets the width of the viewport.
         */
        export function getViewportWidth(): number {
            return +$('.funnelChart').first().attr('width');
        }

        /**
         * Mocks shape layout for unit testing create label layout.
         */
        export function getShapeLayout(): IFunnelRect {
            var mock =  (d: FunnelDataPoint) => d.value; 
            return {
                x: mock,
                y: mock,
                width: mock,
                height: mock,
            };
        }
    }
}
