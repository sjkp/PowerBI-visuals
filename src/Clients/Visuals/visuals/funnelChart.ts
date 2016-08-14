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

module powerbi.visuals {
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
    import PixelConverter = jsCommon.PixelConverter;
    import LabelUtils = NewDataLabelUtils;

    export interface FunnelChartConstructorOptions {
        animator?: IFunnelAnimator;
        funnelSmallViewPortProperties?: FunnelSmallViewPortProperties;
        behavior?: FunnelWebBehavior;
        tooltipsEnabled?: boolean;
        tooltipBucketEnabled?: boolean;
    }

    export interface FunnelPercent {
        value: number;
        percent: number;
        isTop: boolean;
    }

    /**
     * value and highlightValue may be modified in the converter to
     * allow rendering non-standard values, such as negatives.
     * Store the original values for non-rendering, user-facing elements
     * e.g. data labels
     */
    export interface FunnelDataPoint extends SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        value: number;
        originalValue: number;
        label: string;
        key: string;
        categoryOrMeasureIndex: number;
        highlight?: boolean;
        highlightValue?: number;
        originalHighlightValue?: number;
        color: string;
    }

    export interface FunnelData {
        dataPoints: FunnelDataPoint[];
        categoryLabels: string[];
        valuesMetadata: DataViewMetadataColumn[];
        hasHighlights: boolean;
        highlightsOverflow: boolean;
        dataLabelsSettings: VisualDataLabelsSettings;
        percentBarLabelSettings: VisualDataLabelsSettings;
        canShowDataLabels: boolean;
        hasNegativeValues: boolean;
        allValuesAreNegative: boolean;
    }

    export interface FunnelAxisOptions {
        maxScore: number;
        valueScale: D3.Scale.LinearScale;
        categoryScale: D3.Scale.OrdinalScale;
        maxWidth: number;
        margin: IMargin;
        rangeStart: number;
        rangeEnd: number;
        barToSpaceRatio: number;
        categoryLabels: string[];
    }
    
    export interface IFunnelRect {
        width: (d: FunnelDataPoint) => number;
        x: (d: FunnelDataPoint) => number;
        y: (d: FunnelDataPoint) => number;
        height: (d: FunnelDataPoint) => number;
    }

    export interface IFunnelLayout {
        percentBarLayout: {
            mainLine: {
                x2: (d: FunnelPercent) => number;
                transform: (d: FunnelPercent) => string;
            },
            leftTick: {
                y2: (d: FunnelPercent) => number;
                transform: (d: FunnelPercent) => string;
            },
            rightTick: {
                y2: (d: FunnelPercent) => number;
                transform: (d: FunnelPercent) => string;
            },
            text: {
                x: (d: FunnelPercent) => number;
                y: (d: FunnelPercent) => number;
                style: () => string;
                transform: (d: FunnelPercent) => string;
                fill: string;
                maxWidth: number,
            },
        };
        shapeLayout: IFunnelRect;
        shapeLayoutWithoutHighlights: IFunnelRect;
        zeroShapeLayout: IFunnelRect;
        interactorLayout: IFunnelRect;
    }

    export interface IFunnelChartSelectors {
        funnel: {
            bars: ClassAndSelector;
            highlights: ClassAndSelector;
            interactors: ClassAndSelector;
        };
        percentBar: {
            root: ClassAndSelector;
            mainLine: ClassAndSelector;
            leftTick: ClassAndSelector;
            rightTick: ClassAndSelector;
            text: ClassAndSelector;
        };
    }

    export interface FunnelSmallViewPortProperties {
        hideFunnelCategoryLabelsOnSmallViewPort: boolean;
        minHeightFunnelCategoryLabelsVisible: number;
    }

    /**
     * Renders a funnel chart.
     */
    export class FunnelChart implements IVisual {
        private static LabelInsidePosition = [powerbi.RectLabelPosition.InsideCenter, powerbi.RectLabelPosition.OutsideEnd];
        private static LabelOutsidePosition = [powerbi.RectLabelPosition.OutsideEnd, powerbi.RectLabelPosition.InsideEnd];
        private static LabelOrientation = NewRectOrientation.HorizontalLeftBased;
        
        public static DefaultBarOpacity = 1;
        public static DimmedBarOpacity = 0.4;
        public static PercentBarToBarRatio = 0.75;
        public static TickPadding = 0;
        public static InnerTickSize = 0;
        public static MinimumInteractorSize = 15;
        public static InnerTextClassName = 'labelSeries';
        public static Selectors: IFunnelChartSelectors = {
            funnel: {
                bars: createClassAndSelector('funnelBar'),
                highlights: createClassAndSelector('highlight'),
                interactors: createClassAndSelector('funnelBarInteractor'),
            },
            percentBar: {
                root: createClassAndSelector('percentBars'),
                mainLine: createClassAndSelector('mainLine'),
                leftTick: createClassAndSelector('leftTick'),
                rightTick: createClassAndSelector('rightTick'),
                text: createClassAndSelector('value'),
            },
        };
        public static FunnelBarHighlightClass = [FunnelChart.Selectors.funnel.bars.class, FunnelChart.Selectors.funnel.highlights.class].join(' ');
        public static YAxisPadding = 10;

        private static VisualClassName = 'funnelChart';
        private static DefaultFontFamily = Font.Family.regularSecondary.css;
        private static BarToSpaceRatio = 0.1;
        private static MaxBarHeight = 40;
        private static MinBarThickness = 12;
        private static LabelFunnelPadding = 6;
        private static OverflowingHighlightWidthRatio = 0.5;
        private static MaxMarginFactor = 0.25;

        private svg: D3.Selection;
        private funnelGraphicsContext: D3.Selection;
        private percentGraphicsContext: D3.Selection;
        private clearCatcher: D3.Selection;
        private axisGraphicsContext: D3.Selection;
        private labelGraphicsContext: D3.Selection;
        private currentViewport: IViewport;
        private colors: IDataColorPalette;
        private data: FunnelData;
        private hostServices: IVisualHostServices;
        private margin: IMargin;
        private options: VisualInitOptions;
        private interactivityService: IInteractivityService;
        private behavior: FunnelWebBehavior;
        private defaultDataPointColor: string;
        private labelPositionObjects: string[] = [labelPosition.outsideEnd, labelPosition.insideCenter];
        // TODO: Remove onDataChanged & onResizing once all visuals have implemented update.
        private dataViews: DataView[];
        private funnelSmallViewPortProperties: FunnelSmallViewPortProperties;
        private tooltipsEnabled: boolean;
        private tooltipBucketEnabled: boolean;

        /**
         * Note: Public for testing.
         */
        public animator: IFunnelAnimator;

        constructor(options?: FunnelChartConstructorOptions) {
            if (options) {
                this.tooltipsEnabled = options.tooltipsEnabled;
                this.tooltipBucketEnabled = options.tooltipBucketEnabled;
                if (options.funnelSmallViewPortProperties) {
                    this.funnelSmallViewPortProperties = options.funnelSmallViewPortProperties;
                }
                if (options.animator) {
                    this.animator = options.animator;
                }
                if (options.behavior) {
                    this.behavior = options.behavior;
                }
            }
        }

        public static converter(dataView: DataView, colors: IDataColorPalette, hostServices: IVisualHostServices, defaultDataPointColor?: string, tooltipsEnabled: boolean = true, tooltipBucketEnabled?: boolean): FunnelData {
            let reader = data.createIDataViewCategoricalReader(dataView);
            let dataPoints: FunnelDataPoint[] = [];
            let formatStringProp = funnelChartProps.general.formatString;
            let categorical: DataViewCategorical = dataView.categorical;
            let hasHighlights = reader.hasHighlights("Y");
            let valueMetaData: DataViewMetadataColumn[] = [];
            for (let seriesIndex = 0, seriesCount = reader.getSeriesCount("Y"); seriesIndex < seriesCount; seriesIndex++) {
                valueMetaData.push(reader.getValueMetadataColumn("Y", seriesIndex));
            }
            let highlightsOverflow = false;
            let hasNegativeValues = false;
            let allValuesAreNegative = false;
            let categoryLabels = [];
            let dataLabelsSettings: VisualDataLabelsSettings = this.getDefaultLabelSettings();
            let percentBarLabelSettings: VisualDataLabelsSettings = this.getDefaultPercentLabelSettings();
            let colorHelper = new ColorHelper(colors, funnelChartProps.dataPoint.fill, defaultDataPointColor);
            let firstValue: number;
            let firstHighlight: number;
            let previousValue: number;
            let previousHighlight: number;
            let gradientValueColumn: DataViewValueColumn = GradientUtils.getGradientValueColumn(categorical);

            if (dataView && dataView.metadata && dataView.metadata.objects) {
                let labelsObj = <DataLabelObject>dataView.metadata.objects['labels'];
                if (labelsObj)
                    dataLabelUtils.updateLabelSettingsFromLabelsObject(labelsObj, dataLabelsSettings);

                let percentLabelsObj = <DataLabelObject>dataView.metadata.objects['percentBarLabel'];
                if (percentLabelsObj)
                    dataLabelUtils.updateLabelSettingsFromLabelsObject(percentLabelsObj, percentBarLabelSettings);
            }

            // If we don't have a valid value column, just return
            if (!reader.hasValues("Y"))
                return {
                    dataPoints: dataPoints,
                    categoryLabels: categoryLabels,
                    valuesMetadata: valueMetaData,
                    hasHighlights: hasHighlights,
                    highlightsOverflow: highlightsOverflow,
                    canShowDataLabels: true,
                    dataLabelsSettings: dataLabelsSettings,
                    hasNegativeValues: hasNegativeValues,
                    allValuesAreNegative: allValuesAreNegative,
                    percentBarLabelSettings: percentBarLabelSettings,
                };

            // Calculate the first value for percent tooltip values
            firstValue = reader.getValue("Y", 0, 0);
            if (hasHighlights) {
                firstHighlight = reader.getHighlight("Y", 0, 0);
            }
            let pctFormatString = valueFormatter.getLocalizedString('Percentage');

            if (reader.hasCategories()) {
                // Funnel chart with categories
                for (let categoryIndex = 0, categoryCount = reader.getCategoryCount(); categoryIndex < categoryCount; categoryIndex++) {
                    let categoryColumn = reader.getCategoryColumn("Category");
                    let categoryValue = reader.getCategoryValue("Category", categoryIndex);
                    let valueMetadataColumn = reader.getValueMetadataColumn("Y");

                    let identity = SelectionIdBuilder.builder()
                        .withCategory(categoryColumn, categoryIndex)
                        .withMeasure(valueMetadataColumn.queryName)
                        .createSelectionId();

                    let value = reader.getValue("Y", categoryIndex);
                    let formattedCategoryValue = converterHelper.formatFromMetadataColumn(categoryValue, categoryColumn.source, formatStringProp);

                    let tooltipInfo: TooltipDataItem[];
                    if (tooltipsEnabled) {
                        tooltipInfo = [];
                                                
                        tooltipInfo.push({
                            displayName: categoryColumn.source.displayName,
                            value: formattedCategoryValue,
                        });

                        if (value != null) {
                            tooltipInfo.push({
                                displayName: valueMetadataColumn.displayName,
                                value: converterHelper.formatFromMetadataColumn(value, valueMetadataColumn, formatStringProp),
                            });
                        }

                        let highlightValue: number;
                        if (hasHighlights) {
                            highlightValue = reader.getHighlight("Y", categoryIndex);
                            if (highlightValue != null) {
                                tooltipInfo.push({
                                    displayName: ToolTipComponent.localizationOptions.highlightedValueDisplayName,
                                    value: converterHelper.formatFromMetadataColumn(highlightValue, valueMetadataColumn, formatStringProp),
                                });
                            }
                        }

                        let gradientColumnMetadata = gradientValueColumn ? gradientValueColumn.source : undefined;
                        if (gradientColumnMetadata && gradientColumnMetadata !== valueMetadataColumn && gradientValueColumn.values[categoryIndex] != null) {
                            tooltipInfo.push({
                                displayName: gradientColumnMetadata.displayName,
                                value: converterHelper.formatFromMetadataColumn(reader.getValue("Gradient", categoryIndex), gradientColumnMetadata, formatStringProp),
                            });
                        }

                        if (hasHighlights) {
                            FunnelChart.addFunnelPercentsToTooltip(pctFormatString, tooltipInfo, hostServices, firstHighlight ? highlightValue / firstHighlight : null, previousHighlight ? highlightValue / previousHighlight : null, true);
                        }
                        else {
                            FunnelChart.addFunnelPercentsToTooltip(pctFormatString, tooltipInfo, hostServices, firstValue ? value / firstValue : null, previousValue ? value / previousValue : null);
                        }      

                        if (tooltipBucketEnabled) {
                            TooltipBuilder.addTooltipBucketItem(reader, tooltipInfo, categoryIndex);
                        }      
                    }
                    
                    // Same color for all bars
                    let color = colorHelper.getColorForMeasure(reader.getCategoryObjects("Category", categoryIndex), '');

                    dataPoints.push({
                        label: formattedCategoryValue,
                        value: value,
                        originalValue: value,
                        categoryOrMeasureIndex: categoryIndex,
                        identity: identity,
                        selected: false,
                        key: identity.getKey(),
                        tooltipInfo: tooltipInfo,
                        color: color,
                        labelFill: dataLabelsSettings.labelColor,
                    });

                    if (hasHighlights) {
                        let highlightIdentity = SelectionId.createWithHighlight(identity);
                        let highlightValue = reader.getHighlight("Y", categoryIndex);
                        dataPoints.push({
                            label: formattedCategoryValue,
                            value: value,
                            originalValue: value,
                            categoryOrMeasureIndex: categoryIndex,
                            identity: highlightIdentity,
                            selected: false,
                            key: highlightIdentity.getKey(),
                            highlight: true,
                            highlightValue: highlightValue,
                            originalHighlightValue: highlightValue,
                            tooltipInfo: tooltipInfo,
                            color: color,
                        });
                        previousHighlight = highlightValue;
                    }
                    previousValue = value;
                }
            }
            else {
                // Non-categorical static series
                let categoryIndex = 0; // For non-categorical data, we use categoryIndex = 0
                for (let seriesIndex = 0, seriesCount = reader.getSeriesCount("Y"); seriesIndex < seriesCount; seriesIndex++) {
                    let value = reader.getValue("Y", categoryIndex, seriesIndex);
                    let valueMetadataColumn = reader.getValueMetadataColumn("Y", seriesIndex);
                    let identity = SelectionId.createWithMeasure(valueMetadataColumn.queryName);

                    let tooltipInfo: TooltipDataItem[];
                    // Same color for all bars
                    let color = colorHelper.getColorForMeasure(valueMetadataColumn.objects, '');

                    if (tooltipsEnabled) {
                        tooltipInfo = [];

                        if (value != null) {
                            tooltipInfo.push({
                                displayName: valueMetadataColumn.displayName,
                                value: converterHelper.formatFromMetadataColumn(value, valueMetadataColumn, formatStringProp),
                            });
                        }

                        if (hasHighlights) {
                            let highlightValue = reader.getHighlight("Y", categoryIndex, seriesIndex);
                            if (highlightValue != null) {
                                tooltipInfo.push({
                                    displayName:  ToolTipComponent.localizationOptions.highlightedValueDisplayName,
                                    value: converterHelper.formatFromMetadataColumn(highlightValue, valueMetadataColumn, formatStringProp),
                                });
                            }
                            FunnelChart.addFunnelPercentsToTooltip(pctFormatString, tooltipInfo, hostServices, firstHighlight ? highlightValue / firstHighlight : null, previousHighlight ? highlightValue / previousHighlight : null, true);
                        }
                        else {
                            FunnelChart.addFunnelPercentsToTooltip(pctFormatString, tooltipInfo, hostServices, firstValue ? value / firstValue : null, previousValue ? value / previousValue : null);
                        }

                        if (tooltipBucketEnabled) {
                            let tooltipValues = reader.getAllValuesForRole("Tooltips", categoryIndex, undefined);
                            let tooltipMetadataColumns = reader.getAllValueMetadataColumnsForRole("Tooltips", undefined);

                            if (tooltipValues && tooltipMetadataColumns) {
                                for (let j = 0; j < tooltipValues.length; j++) {
                                    if (tooltipValues[j] != null) {
                                        tooltipInfo.push({
                                            displayName: tooltipMetadataColumns[j].displayName,
                                            value: converterHelper.formatFromMetadataColumn(tooltipValues[j], tooltipMetadataColumns[j], formatStringProp),
                                        });
                                    }
                                }
                            }
                        }
                    }
                    
                    dataPoints.push({
                        label: valueMetadataColumn.displayName,
                        value: value,
                        originalValue: value,
                        categoryOrMeasureIndex: seriesIndex,
                        identity: identity,
                        selected: false,
                        key: identity.getKey(),
                        tooltipInfo: tooltipInfo,
                        color: color,
                        labelFill: dataLabelsSettings.labelColor,
                    });
                    if (hasHighlights) {
                        let highlightIdentity = SelectionId.createWithHighlight(identity);
                        let highlight = reader.getHighlight("Y", categoryIndex, seriesIndex);
                        dataPoints.push({
                            label: valueMetadataColumn.displayName,
                            value: value,
                            originalValue: value,
                            categoryOrMeasureIndex: seriesIndex,
                            identity: highlightIdentity,
                            key: highlightIdentity.getKey(),
                            selected: false,
                            highlight: true,
                            originalHighlightValue: highlight,
                            highlightValue: highlight,
                            tooltipInfo: tooltipInfo,
                            color: color,
                        });
                        previousHighlight = highlight;
                    }
                    previousValue = value;
                }
            }

            for (let i = 0; i < dataPoints.length; i += hasHighlights ? 2 : 1) {
                let dataPoint = dataPoints[i];
                categoryLabels.push(dataPoint.label);
            }

            // Calculate negative value warning flags
            allValuesAreNegative = dataPoints.length > 0 && _.every(dataPoints, (dataPoint: FunnelDataPoint) => (dataPoint.highlight ? dataPoint.highlightValue <= 0 : true) && dataPoint.value < 0);
            for (let dataPoint of dataPoints) {
                if (allValuesAreNegative) {
                    dataPoint.value = Math.abs(dataPoint.value);
                    if (dataPoint.highlight)
                        dataPoint.highlightValue = Math.abs(dataPoint.highlightValue);
                }
                else {
                    let value = dataPoint.value;
                    let isValueNegative = value < 0;
                    if (isValueNegative)
                        dataPoint.value = 0;

                    let isHighlightValueNegative = false;
                    if (dataPoint.highlight) {
                        let highlightValue = dataPoint.highlightValue;
                        isHighlightValueNegative = highlightValue < 0;
                        dataPoint.highlightValue = isHighlightValueNegative ? 0 : highlightValue;
                    }

                    if (!hasNegativeValues)
                        hasNegativeValues = isValueNegative || isHighlightValueNegative;
                }

                if (dataPoint.highlightValue > dataPoint.value) {
                    highlightsOverflow = true;
                }
            }

            return {
                dataPoints: dataPoints,
                categoryLabels: categoryLabels,
                valuesMetadata: valueMetaData,
                hasHighlights: hasHighlights,
                highlightsOverflow: highlightsOverflow,
                canShowDataLabels: true,
                dataLabelsSettings: dataLabelsSettings,
                hasNegativeValues: hasNegativeValues,
                allValuesAreNegative: allValuesAreNegative,
                percentBarLabelSettings: percentBarLabelSettings,
            };
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let enumeration = new ObjectEnumerationBuilder();

            switch (options.objectName) {
                case 'dataPoint':
                    let dataViewCat: DataViewCategorical = this.dataViews && this.dataViews.length > 0 && this.dataViews[0] && this.dataViews[0].categorical;
                    let hasGradientRole = GradientUtils.hasGradientRole(dataViewCat);
                    if (!hasGradientRole) {
                        this.enumerateDataPoints(enumeration);
                    }
                    break;
                case 'labels':
                    let labelSettingsOptions = FunnelChart.getLabelSettingsOptions(enumeration, this.data.dataLabelsSettings, true, this.labelPositionObjects);
                    dataLabelUtils.enumerateDataLabels(labelSettingsOptions);
                    break;
                case 'percentBarLabel':
                    let percentLabelSettingOptions = FunnelChart.getLabelSettingsOptions(enumeration, this.data.percentBarLabelSettings, false);
                    dataLabelUtils.enumerateDataLabels(percentLabelSettingOptions);
                    break;
            }

            return enumeration.complete();
        }

        private static getLabelSettingsOptions(enumeration: ObjectEnumerationBuilder, labelSettings: VisualDataLabelsSettings, isDataLabels: boolean, positionObject?: any): VisualDataLabelsSettingsOptions {
            return {
                enumeration: enumeration,
                dataLabelsSettings: labelSettings,
                show: true,
                displayUnits: isDataLabels,
                precision: isDataLabels,
                position: isDataLabels,
                positionObject: positionObject,
                fontSize: true,
            };
        }

        private enumerateDataPoints(enumeration: ObjectEnumerationBuilder): void {
            let data = this.data;
            if (!data)
                return;

            let dataPoints = data.dataPoints;

            enumeration.pushInstance({
                objectName: 'dataPoint',
                selector: null,
                properties: {
                    defaultColor: { solid: { color: this.defaultDataPointColor || this.colors.getColorByIndex(0).value } }
                },
            });

            for (let i = 0; i < dataPoints.length; i++) {
                let dataPont = dataPoints[i];
                if (dataPont.highlight)
                    continue;

                let color = dataPont.color;
                let selector = dataPont.identity.getSelector();
                let isSingleSeries = !!selector.data;

                enumeration.pushInstance({
                    objectName: 'dataPoint',
                    displayName: dataPont.label,
                    selector: ColorHelper.normalizeSelector(selector, isSingleSeries),
                    properties: {
                        fill: { solid: { color: color } }
                    },
                });
            }
        }

        public init(options: VisualInitOptions) {
            this.options = options;
            let element = options.element;
            let svg = this.svg = d3.select(element.get(0))
                .append('svg')
                .classed(FunnelChart.VisualClassName, true);

            if (this.behavior)
                this.clearCatcher = appendClearCatcher(this.svg);

            this.currentViewport = options.viewport;
            this.margin = {
                left: 5,
                right: 5,
                top: 0,
                bottom: 0
            };
            let style = options.style;
            this.colors = style.colorPalette.dataColors;
            this.hostServices = options.host;
            if (this.behavior) {
                this.interactivityService = createInteractivityService(this.hostServices);
            }
            this.percentGraphicsContext = svg.append('g').classed(FunnelChart.Selectors.percentBar.root.class, true);
            this.funnelGraphicsContext = svg.append('g');
            this.axisGraphicsContext = svg.append('g');
            this.labelGraphicsContext = svg
                .append("g")
                .classed(LabelUtils.labelGraphicsContextClass.class, true);

            this.updateViewportProperties();
        }

        private updateViewportProperties() {
            let viewport = this.currentViewport;
            this.svg.attr('width', viewport.width)
                .attr('height', viewport.height);
        }

        public update(options: VisualUpdateOptions): void {
            debug.assertValue(options, 'options');
            this.data = {
                dataPoints: [],
                categoryLabels: [],
                valuesMetadata: [],
                hasHighlights: false,
                highlightsOverflow: false,
                canShowDataLabels: true,
                dataLabelsSettings: dataLabelUtils.getDefaultLabelSettings(),
                hasNegativeValues: false,
                allValuesAreNegative: false,
                percentBarLabelSettings: dataLabelUtils.getDefaultLabelSettings(true),
            };

            let dataViews = this.dataViews = options.dataViews;
            this.currentViewport = options.viewport;

            if (dataViews && dataViews.length > 0) {
                let dataView = dataViews[0];

                if (dataView.metadata && dataView.metadata.objects) {
                    let defaultColor = DataViewObjects.getFillColor(dataView.metadata.objects, funnelChartProps.dataPoint.defaultColor);
                    if (defaultColor)
                        this.defaultDataPointColor = defaultColor;
                }

                if (dataView.categorical) {
                    this.data = FunnelChart.converter(dataView, this.colors, this.hostServices, this.defaultDataPointColor, this.tooltipsEnabled, this.tooltipBucketEnabled);

                    if (this.interactivityService) {
                        this.interactivityService.applySelectionStateToData(this.data.dataPoints);
                    }
                }

                let warnings = getInvalidValueWarnings(
                    dataViews,
                    false /*supportsNaN*/,
                    false /*supportsNegativeInfinity*/,
                    false /*supportsPositiveInfinity*/);

                if (this.data.allValuesAreNegative) {
                    warnings.push(new AllNegativeValuesWarning());
                }
                else if (this.data.hasNegativeValues) {
                    warnings.push(new NegativeValuesNotSupportedWarning());
                }

                this.hostServices.setWarnings(warnings);
            }

            this.updateViewportProperties();
            this.updateInternal(options.suppressAnimations);
        }

        // TODO: Remove onDataChanged & onResizing once all visuals have implemented update.
        public onDataChanged(options: VisualDataChangedOptions): void {
            this.update({
                dataViews: options.dataViews,
                suppressAnimations: options.suppressAnimations,
                viewport: this.currentViewport
            });
        }

        // TODO: Remove onDataChanged & onResizing once all visuals have implemented update.
        public onResizing(viewport: IViewport): void {
            this.currentViewport = viewport;
            this.update({
                dataViews: this.dataViews,
                suppressAnimations: true,
                viewport: this.currentViewport
            });
        }

        private getMaxLabelLength(labels: string[], properties: TextProperties): number {
            let max = 0;
            let textMeasurer: ITextAsSVGMeasurer = TextMeasurementService.measureSvgTextWidth;
            
            for (let i = 0, len = labels.length; i < len; i++) {
                properties.text = labels[i];
                max = Math.max(max, textMeasurer(properties));
            }
            
            return max + FunnelChart.LabelFunnelPadding;
        }

        private updateInternal(suppressAnimations: boolean) {
            if (this.data == null)
                return;

            let data = this.data;
            let dataPoints = data.dataPoints;
            let dataPointsWithoutHighlights = dataPoints.filter((d: FunnelDataPoint) => !d.highlight);
            let isHidingPercentBars = this.isHidingPercentBars();

            let axisOptions = this.setUpAxis();
            let margin = axisOptions.margin;

            let funnelContext = this.funnelGraphicsContext.attr('transform',
                SVGUtil.translate(margin.left, margin.top));
                
            let labelContext = this.labelGraphicsContext.attr('transform',
                SVGUtil.translate(margin.left, margin.top)); 

            this.percentGraphicsContext.attr('transform',
                SVGUtil.translate(margin.left, margin.top));

            this.svg.style('font-family', dataLabelUtils.StandardFontFamily);
            
            let layout = FunnelChart.getLayout(data, axisOptions);
            let labels: Label[] = this.getLabels(layout);    
            let result: FunnelAnimationResult;
            let shapes: D3.UpdateSelection;

            if (this.animator && !suppressAnimations) {
                let animationOptions: FunnelAnimationOptions = {
                    viewModel: data,
                    interactivityService: this.interactivityService,
                    layout: layout,
                    axisGraphicsContext: this.axisGraphicsContext,
                    shapeGraphicsContext: funnelContext,
                    percentGraphicsContext: this.percentGraphicsContext,
                    labelGraphicsContext: this.labelGraphicsContext,
                    axisOptions: axisOptions,
                    dataPointsWithoutHighlights: dataPointsWithoutHighlights,
                    labelLayout: labels,
                    isHidingPercentBars: isHidingPercentBars,
                    visualInitOptions: this.options,
                };
                result = this.animator.animate(animationOptions);
                shapes = result.shapes;
            }
            if (!this.animator || suppressAnimations || result.failed) {
                FunnelChart.drawDefaultAxis(this.axisGraphicsContext, axisOptions, isHidingPercentBars);
                shapes = FunnelChart.drawDefaultShapes(data, dataPoints, funnelContext, layout, this.interactivityService && this.interactivityService.hasSelection());
                FunnelChart.drawPercentBars(data, this.percentGraphicsContext, layout, isHidingPercentBars);
                LabelUtils.drawDefaultLabels(labelContext, labels, false);
            }

            if (this.interactivityService) {
                let interactors: D3.UpdateSelection = FunnelChart.drawInteractorShapes(dataPoints, funnelContext, layout);
                let behaviorOptions: FunnelBehaviorOptions = {
                    bars: shapes,
                    interactors: interactors,
                    clearCatcher: this.clearCatcher,
                    hasHighlights: data.hasHighlights,
                };

                this.interactivityService.bind(dataPoints, this.behavior, behaviorOptions);

                if (this.tooltipsEnabled) {
                    TooltipManager.addTooltip(interactors, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo);
                }
            }
            if (this.tooltipsEnabled) {
                TooltipManager.addTooltip(shapes, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo);
            }

            SVGUtil.flushAllD3TransitionsIfNeeded(this.options);
        }

        private getUsableVerticalSpace(): number {
            let categoryLabels = this.data.categoryLabels;
            let margin = this.margin;
            let verticalSpace = this.currentViewport.height - (margin.top + margin.bottom);
            return verticalSpace - (FunnelChart.MinBarThickness * categoryLabels.length);
        }

        private isHidingPercentBars(): boolean {
            let data = this.data;

            if (data.percentBarLabelSettings.show) {
                let percentBarTextHeight = this.getPercentBarTextHeight();
                let verticalSpace = this.getUsableVerticalSpace() - (2 * FunnelChart.MinBarThickness * FunnelChart.PercentBarToBarRatio) - (2 * percentBarTextHeight);
                return verticalSpace <= 0;
            }
            return true;
        }

        private isSparklines(): boolean {
            return this.getUsableVerticalSpace() <= 0;
        }

        private setUpAxis(): FunnelAxisOptions {
            let data = this.data;
            let dataPoints = data.dataPoints;
            let categoryLabels = data.categoryLabels;
            let viewport = this.currentViewport;
            let margin = this.margin;
            let isSparklines = this.isSparklines();
            let isHidingPercentBars = this.isHidingPercentBars();
            let percentBarTextHeight = isHidingPercentBars ? 0 : this.getPercentBarTextHeight();
            let verticalRange = viewport.height - (margin.top + margin.bottom) - (2 * percentBarTextHeight);
            let maxMarginFactor = FunnelChart.MaxMarginFactor;

            if (categoryLabels.length > 0 && isSparklines) {
                categoryLabels = [];
                data.canShowDataLabels = false;
            } else if (this.showCategoryLabels()) {
                let textProperties = FunnelChart.getTextProperties();
                // Get the amount of space needed for the labels, then add the minimum level of padding for the axis.
                let longestLabelLength = this.getMaxLabelLength(categoryLabels, textProperties);
                let maxLabelLength = viewport.width * maxMarginFactor;
                let labelLength = Math.min(longestLabelLength, maxLabelLength);
                margin.left = labelLength + FunnelChart.YAxisPadding;
            } else {
                categoryLabels = [];
            }

            let horizontalRange = viewport.width - (margin.left + margin.right);
            let barToSpaceRatio = FunnelChart.BarToSpaceRatio;
            let maxScore = d3.max(dataPoints.map(d => d.value));

            if (data.hasHighlights) {
                let maxHighlight = d3.max(dataPoints.map(d => d.highlightValue));
                maxScore = d3.max([maxScore, maxHighlight]);
            }

            let minScore = 0;
            let rangeStart = 0;
            let rangeEnd = verticalRange;

            let delta: number;
            if (isHidingPercentBars)
                delta = verticalRange - (categoryLabels.length * FunnelChart.MaxBarHeight);
            else
                delta = verticalRange - (categoryLabels.length * FunnelChart.MaxBarHeight) - (2 * FunnelChart.MaxBarHeight * FunnelChart.PercentBarToBarRatio);

            if (categoryLabels.length > 0 && delta > 0) {
                rangeStart = Math.ceil(delta / 2);
                rangeEnd = Math.ceil(verticalRange - delta / 2);
            }

            // Offset funnel axis start and end by percent bar text height
            if (!isHidingPercentBars) {
                rangeStart += percentBarTextHeight;
                rangeEnd += percentBarTextHeight;
            }

            let valueScale = d3.scale.linear()
                .domain([minScore, maxScore])
                .range([horizontalRange, 0]);
            let categoryScale = d3.scale.ordinal()
                .domain(d3.range(0, data.categoryLabels.length))
                .rangeBands([rangeStart, rangeEnd], barToSpaceRatio, isHidingPercentBars ? barToSpaceRatio : FunnelChart.PercentBarToBarRatio);

            return {
                margin: margin,
                valueScale: valueScale,
                categoryScale: categoryScale,
                maxScore: maxScore,
                maxWidth: horizontalRange,
                rangeStart: rangeStart,
                rangeEnd: rangeEnd,
                barToSpaceRatio: barToSpaceRatio,
                categoryLabels: categoryLabels,
            };
        }

        private getPercentBarTextHeight(): number {
            let percentBarTextProperties = FunnelChart.getTextProperties(this.data.percentBarLabelSettings.fontSize);
            return TextMeasurementService.estimateSvgTextHeight(percentBarTextProperties);
        }

        public onClearSelection(): void {
            if (this.interactivityService)
                this.interactivityService.clearSelection();
        }

        public static getLayout(data: FunnelData, axisOptions: FunnelAxisOptions): IFunnelLayout {
            let highlightsOverflow = data.highlightsOverflow;
            let categoryScale = axisOptions.categoryScale;
            let valueScale = axisOptions.valueScale;
            let maxScore = axisOptions.maxScore;
            let columnHeight = categoryScale.rangeBand();
            let percentBarTickHeight = Math.ceil(columnHeight / 2);
            let overFlowHighlightColumnWidth = columnHeight * FunnelChart.OverflowingHighlightWidthRatio;
            let overFlowHighlightOffset = overFlowHighlightColumnWidth / 2;
            let lastCategoryIndex = axisOptions.categoryLabels.length - 1;
            let horizontalDistance = Math.abs(valueScale(maxScore) - valueScale(0));
            let emptyHorizontalSpace = (value: number): number => (horizontalDistance - Math.abs(valueScale(value) - valueScale(0))) /2;
            let getMinimumShapeSize = (value: number): number => Math.max(FunnelChart.MinimumInteractorSize, Math.abs(valueScale(value) - valueScale(0)));
            let percentBarFontSize = PixelConverter.fromPoint(data.percentBarLabelSettings.fontSize);
            let percentBarTextProperties = FunnelChart.getTextProperties(data.percentBarLabelSettings.fontSize);
            let baselineDelta = TextMeasurementService.estimateSvgTextBaselineDelta(percentBarTextProperties);
            let percentBarYOffset = TextMeasurementService.estimateSvgTextHeight(percentBarTextProperties) - baselineDelta;

            return {
                percentBarLayout: {
                    mainLine: {
                        x2: (d: FunnelPercent) => Math.abs(valueScale(d.value) - valueScale(0)),
                        transform: (d: FunnelPercent) => {
                            let xOffset = valueScale(d.value) - emptyHorizontalSpace(d.value);
                            let yOffset = d.isTop
                                ? categoryScale(0) - percentBarTickHeight
                                : categoryScale(lastCategoryIndex) + columnHeight + percentBarTickHeight;
                            return SVGUtil.translate(xOffset, yOffset);
                        },
                    },
                    leftTick: {
                        y2: (d: FunnelPercent) => percentBarTickHeight,
                        transform: (d: FunnelPercent) => {
                            let xOffset = valueScale(d.value) - emptyHorizontalSpace(d.value);
                            let yOffset = d.isTop
                                ? categoryScale(0) - percentBarTickHeight - (percentBarTickHeight / 2)
                                : categoryScale(lastCategoryIndex) + columnHeight + percentBarTickHeight - (percentBarTickHeight / 2);
                            return SVGUtil.translate(xOffset, yOffset);
                        },
                    },
                    rightTick: {
                        y2: (d: FunnelPercent) => percentBarTickHeight,
                        transform: (d: FunnelPercent) => {
                            let columnOffset = valueScale(d.value) - emptyHorizontalSpace(d.value);
                            let columnWidth = Math.abs(valueScale(d.value) - valueScale(0));
                            let xOffset = columnOffset + columnWidth;
                            let yOffset = d.isTop
                                ? categoryScale(0) - percentBarTickHeight - (percentBarTickHeight / 2)
                                : categoryScale(lastCategoryIndex) + columnHeight + percentBarTickHeight - (percentBarTickHeight / 2);
                            return SVGUtil.translate(xOffset, yOffset);
                        },
                    },
                    text: {
                        x: (d: FunnelPercent) => Math.ceil((Math.abs(valueScale(maxScore) - valueScale(0)) / 2)),
                        y: (d: FunnelPercent) => {
                            return d.isTop
                                ? -percentBarTickHeight / 2 - baselineDelta
                                : percentBarYOffset + (percentBarTickHeight / 2);
                        },
                        style: () => `font-size: ${percentBarFontSize};`,
                        transform: (d: FunnelPercent) => {
                            let xOffset = d.isTop
                                ? categoryScale(0) - percentBarTickHeight
                                : categoryScale(lastCategoryIndex) + columnHeight + percentBarTickHeight;
                            return SVGUtil.translate(0, xOffset);
                        },
                        fill: data.percentBarLabelSettings.labelColor,
                        maxWidth: horizontalDistance,
                    },
                },
                shapeLayout: {
                    height: ((d: FunnelDataPoint) => d.highlight && highlightsOverflow ? overFlowHighlightColumnWidth : columnHeight),
                    width: (d: FunnelDataPoint) => {
                        return Math.abs(valueScale(FunnelChart.getValueFromDataPoint(d)) - valueScale(0));
                    },
                    y: (d: FunnelDataPoint) => {
                        return categoryScale(d.categoryOrMeasureIndex) + (d.highlight && highlightsOverflow ? overFlowHighlightOffset : 0);
                    },
                    x: (d: FunnelDataPoint) => {
                        let value = FunnelChart.getValueFromDataPoint(d);
                        return valueScale(value) - emptyHorizontalSpace(value);
                    },
                },
                shapeLayoutWithoutHighlights: {
                    height: ((d: FunnelDataPoint) => columnHeight),
                    width: (d: FunnelDataPoint) => {
                        return Math.abs(valueScale(d.value) - valueScale(0));
                    },
                    y: (d: FunnelDataPoint) => {
                        return categoryScale(d.categoryOrMeasureIndex) + (0);
                    },
                    x: (d: FunnelDataPoint) => {
                        return valueScale(d.value) - emptyHorizontalSpace(d.value);
                    },
                },
                zeroShapeLayout: {
                    height: ((d: FunnelDataPoint) => d.highlight && highlightsOverflow ? overFlowHighlightColumnWidth : columnHeight),
                    width: (d: FunnelDataPoint) => 0,
                    y: (d: FunnelDataPoint) => {
                        return categoryScale(d.categoryOrMeasureIndex) + (d.highlight && highlightsOverflow ? overFlowHighlightOffset : 0);
                    },
                    x: (d: FunnelDataPoint) => {
                        return valueScale((valueScale.domain()[0] + valueScale.domain()[1]) / 2);
                    },
                },
                interactorLayout: {
                    height: ((d: FunnelDataPoint) => d.highlight && highlightsOverflow ? overFlowHighlightColumnWidth : columnHeight),
                    width: (d: FunnelDataPoint) => getMinimumShapeSize(FunnelChart.getValueFromDataPoint(d)),
                    y: (d: FunnelDataPoint) => {
                        return categoryScale(d.categoryOrMeasureIndex) + (d.highlight && highlightsOverflow ? overFlowHighlightOffset : 0);
                    },
                    x: (d: FunnelDataPoint) => {
                        let size = getMinimumShapeSize(FunnelChart.getValueFromDataPoint(d));
                        return (horizontalDistance - size) / 2;
                    },
                },
            };
        }

        public static drawDefaultAxis(graphicsContext: D3.Selection, axisOptions: FunnelAxisOptions, isHidingPercentBars: boolean): void {
            //Generate ordinal domain
            var indices = d3.range(0, axisOptions.categoryLabels.length);
            let xScaleForAxis = d3.scale.ordinal()
                .domain(indices)
                .rangeBands([axisOptions.rangeStart, axisOptions.rangeEnd], axisOptions.barToSpaceRatio, isHidingPercentBars ? axisOptions.barToSpaceRatio : FunnelChart.PercentBarToBarRatio);
            let xAxis = d3.svg.axis()
                .scale(xScaleForAxis)
                .orient("right")
                .tickPadding(FunnelChart.TickPadding)
                .innerTickSize(FunnelChart.InnerTickSize)
                .ticks(indices.length)
                .tickValues(indices)
                .tickFormat((i) => { return axisOptions.categoryLabels[i]; }); //To output the category label
            graphicsContext.attr('class', 'axis hideLinesOnAxis')
                .attr('transform', SVGUtil.translate(0, axisOptions.margin.top))
                .call(xAxis);

            graphicsContext.selectAll('.tick')
                .call(tooltipUtils.tooltipUpdate, axisOptions.categoryLabels);
                
            // Subtract the padding from the margin since we can't have text there. Then shorten the labels if necessary.
            let leftRightMarginLimit = axisOptions.margin.left - FunnelChart.LabelFunnelPadding;
            graphicsContext.selectAll('.tick text')
                .call(AxisHelper.LabelLayoutStrategy.clip, leftRightMarginLimit, TextMeasurementService.svgEllipsis);
        }

        public static drawDefaultShapes(data: FunnelData, dataPoints: FunnelDataPoint[], graphicsContext: D3.Selection, layout: IFunnelLayout, hasSelection: boolean): D3.UpdateSelection {
            let hasHighlights = data.hasHighlights;
            let columns = graphicsContext.selectAll(FunnelChart.Selectors.funnel.bars.selector).data(dataPoints, (d: FunnelDataPoint) => d.key);

            columns.enter()
                .append('rect')
                .attr("class", (d: FunnelDataPoint) => d.highlight ? FunnelChart.FunnelBarHighlightClass : FunnelChart.Selectors.funnel.bars.class);

            columns
                .style("fill", (d: FunnelDataPoint) => {
                    return d.color;
                })
                .style("fill-opacity", (d: FunnelDataPoint) => ColumnUtil.getFillOpacity(d.selected, d.highlight, hasSelection, hasHighlights))
                .attr(layout.shapeLayout);

            columns.exit().remove();

            return columns;
        }

        public static getValueFromDataPoint(dataPoint: FunnelDataPoint, asOriginal: boolean = false): number {
            if (asOriginal)
                return dataPoint.highlight ? (dataPoint.originalHighlightValue) : dataPoint.originalValue;
            else
                return dataPoint.highlight ? dataPoint.highlightValue : dataPoint.value;
        }

        public static drawInteractorShapes(dataPoints: FunnelDataPoint[], graphicsContext: D3.Selection, layout: IFunnelLayout): D3.UpdateSelection {
            // Draw invsible ineractors for just data points which are below threshold
            let interactorsData = dataPoints.filter((d: FunnelDataPoint) => {
                return !d.highlight && layout.interactorLayout.width(d) === FunnelChart.MinimumInteractorSize;
            });
            
            let columns = graphicsContext.selectAll(FunnelChart.Selectors.funnel.interactors.selector).data(interactorsData, (d: FunnelDataPoint) => d.key);
            columns.enter()
                .append('rect')
                .attr("class", FunnelChart.Selectors.funnel.interactors.class);

            columns
                .style("fill-opacity", 0)
                .attr(layout.interactorLayout);

            columns.exit().remove();

            return columns;
        }

        private static drawPercentBarComponents(graphicsContext: D3.Selection, data: FunnelPercent[], layout: IFunnelLayout, percentLabelSettings: VisualDataLabelsSettings) {
            // Main line
            let mainLine: D3.UpdateSelection = graphicsContext.selectAll(FunnelChart.Selectors.percentBar.mainLine.selector).data(data);
            mainLine.exit().remove();
            mainLine.enter()
                .append('line')
                .classed(FunnelChart.Selectors.percentBar.mainLine.class, true);
            mainLine
                .attr(layout.percentBarLayout.mainLine);

            // Left tick
            let leftTick: D3.UpdateSelection = graphicsContext.selectAll(FunnelChart.Selectors.percentBar.leftTick.selector).data(data);
            leftTick.exit().remove();
            leftTick.enter()
                .append('line')
                .classed(FunnelChart.Selectors.percentBar.leftTick.class, true);
            leftTick
                .attr(layout.percentBarLayout.leftTick);

            // Right tick
            let rightTick: D3.UpdateSelection = graphicsContext.selectAll(FunnelChart.Selectors.percentBar.rightTick.selector).data(data);
            rightTick.exit().remove();
            rightTick.enter()
                .append('line')
                .classed(FunnelChart.Selectors.percentBar.rightTick.class, true);
            rightTick
                .attr(layout.percentBarLayout.rightTick);

            // Text
            let text: D3.UpdateSelection = graphicsContext.selectAll(FunnelChart.Selectors.percentBar.text.selector).data(data);
            let localizedString: string = valueFormatter.getLocalizedString("Percentage1");
            text.exit().remove();
            text.enter().append('text').classed(FunnelChart.Selectors.percentBar.text.class, true);
            text
                .attr(layout.percentBarLayout.text)
                .text((fp: FunnelPercent) => {
                    return dataLabelUtils.getLabelFormattedText({
                        label: fp.percent,
                        format: localizedString,
                        fontSize: percentLabelSettings.fontSize,
                        maxWidth: layout.percentBarLayout.text.maxWidth,
                    });
                })
                .append('title').text((d: FunnelPercent) => formattingService.formatValue(d.percent, localizedString));           
        }

        public static drawPercentBars(data: FunnelData, graphicsContext: D3.Selection, layout: IFunnelLayout, isHidingPercentBars: boolean): void {
            if (isHidingPercentBars || !data.dataPoints || (data.hasHighlights ? data.dataPoints.length / 2 : data.dataPoints.length) < 2) {
                FunnelChart.drawPercentBarComponents(graphicsContext, [], layout, data.percentBarLabelSettings);
                return;
            }

            let dataPoints = [data.dataPoints[data.hasHighlights ? 1 : 0], data.dataPoints[data.dataPoints.length - 1]];
            let baseline = FunnelChart.getValueFromDataPoint(dataPoints[0]);

            if (baseline <= 0) {
                FunnelChart.drawPercentBarComponents(graphicsContext, [], layout, data.percentBarLabelSettings);
                return;
            }

            let percentData: FunnelPercent[] = [
                {
                    value: FunnelChart.getValueFromDataPoint(dataPoints[0]),
                    percent: 1,
                    isTop: true,
                },
                {
                    value: FunnelChart.getValueFromDataPoint(dataPoints[1]),
                    percent: FunnelChart.getValueFromDataPoint(dataPoints[1]) / baseline,
                    isTop: false,
                },
            ];

            FunnelChart.drawPercentBarComponents(graphicsContext, percentData, layout, data.percentBarLabelSettings);
        }

        private showCategoryLabels(): boolean {
            if (this.funnelSmallViewPortProperties) {
                if ((this.funnelSmallViewPortProperties.hideFunnelCategoryLabelsOnSmallViewPort) && (this.currentViewport.height < this.funnelSmallViewPortProperties.minHeightFunnelCategoryLabelsVisible)) {
                    return false;
                }
            }
            return true;
        }

        private static addFunnelPercentsToTooltip(pctFormatString: string, tooltipInfo: TooltipDataItem[], hostServices: IVisualHostServices, percentOfFirst?: number, percentOfPrevious?: number, highlight?: boolean): void {
            if (percentOfFirst != null) {
                tooltipInfo.push({
                    displayName: hostServices.getLocalizedString("Funnel_PercentOfFirst" + (highlight ? "_Highlight" : "")),
                    value: valueFormatter.format(percentOfFirst, pctFormatString),
                });
            }
            if (percentOfPrevious != null) {
                tooltipInfo.push({
                    displayName: hostServices.getLocalizedString("Funnel_PercentOfPrevious" + (highlight ? "_Highlight" : "")),
                    value: valueFormatter.format(percentOfPrevious, pctFormatString),
                });
            }
        }

        private static getTextProperties(fontSize?: number): TextProperties {
            return {
                fontSize: PixelConverter.fromPoint(fontSize || dataLabelUtils.DefaultFontSizeInPt),
                fontFamily: FunnelChart.DefaultFontFamily,
            };
        }
        
        private static getDefaultLabelSettings(): VisualDataLabelsSettings {
            return {
                show: true,
                position: powerbi.visuals.labelPosition.insideCenter,
                displayUnits: 0,
                labelColor: null,
                fontSize: LabelUtils.DefaultLabelFontSizeInPt,
            };
        }
        
        private static getDefaultPercentLabelSettings(): VisualDataLabelsSettings {
           return {
                show: true,
                position: PointLabelPosition.Above,
                displayUnits: 0,
                labelColor: LabelUtils.defaultLabelColor,
                fontSize: LabelUtils.DefaultLabelFontSizeInPt,
            };
        }
        
        /**
         * Creates labels layout.
         */
        private getLabels(layout: IFunnelLayout): Label[] {
            let labels: Label[] = [];
            if (this.data.dataLabelsSettings.show && this.data.canShowDataLabels) {
                let labelDataPoints: LabelDataPoint[] = this.createLabelDataPoints(layout.shapeLayout, this.data.dataLabelsSettings);
                let newLabelLayout = new LabelLayout({
                        maximumOffset: LabelUtils.maxLabelOffset,
                        startingOffset: LabelUtils.startingLabelOffset
                    });
                let labelDataPointsGroup: LabelDataPointGroup = {
                        labelDataPoints: labelDataPoints,
                        maxNumberOfLabels: labelDataPoints.length
                    };
                let labelViewport: IViewport = {
                    width: this.currentViewport.width - this.margin.left,
                    height: this.currentViewport.height - this.margin.top
                };
                    
                labels = newLabelLayout.layout([labelDataPointsGroup], labelViewport);
            }
            
            return labels;
        }
        
        /**
         * Creates labelDataPoints for rendering labels
         */
        private createLabelDataPoints(shapeLayout: IFunnelRect, visualSettings: VisualDataLabelsSettings): LabelDataPoint[] {
            let data: FunnelData = this.data;
            let dataPoints = data.dataPoints;
            if(_.isEmpty(dataPoints)) {
                return [];
            }
            let points = new Array<LabelDataPoint>();
            // Because labels share the same formatting use the first one as default.
            let generalSettings = dataPoints[0];
            
            // Shape
            let validPositions = FunnelChart.LabelInsidePosition;
            let height: number = shapeLayout.height(generalSettings);
            if (visualSettings.position && visualSettings.position === labelPosition.outsideEnd) {
                validPositions = FunnelChart.LabelOutsidePosition;
            }
            
            let maxAbsoluteValue: number = null;
            // Formatter
            if(visualSettings.displayUnits === 0 /* Auto */) {
                // if display unit is auto let formatter decide what scale to use based on maximum value.
                maxAbsoluteValue = data.dataPoints.reduce((memo, value) => Math.abs(memo.value) > Math.abs(value.value) ? memo : value).value;
            }
            let formatString = valueFormatter.getFormatString(data.valuesMetadata[0], funnelChartProps.general.formatString);
            let formattersCache = LabelUtils.createColumnFormatterCacheManager();
            
            // Text Properties
            let fontSize = visualSettings.fontSize;
            let properties: TextProperties = {
                fontFamily: LabelUtils.LabelTextProperties.fontFamily,
                fontSize: PixelConverter.fromPoint(fontSize || LabelUtils.DefaultLabelFontSizeInPt),
                fontWeight: LabelUtils.LabelTextProperties.fontWeight,
            };
            
            let outsideFill: string = generalSettings.labelFill || LabelUtils.defaultLabelColor;
            let insideFill: string = generalSettings.labelFill || LabelUtils.defaultInsideLabelColor;
            
            
            for (let dataPoint of dataPoints) {
                let value = FunnelChart.getValueFromDataPoint(dataPoint, true /* asOriginal */);
                if (value == null
                    || (data.hasHighlights && !dataPoint.highlight)) {
                    continue;
                }
                
                let labelFormatString = (formatString != null) ? formatString : generalSettings.labelFormatString;
                let formatter = formattersCache.getOrCreate(labelFormatString, visualSettings, maxAbsoluteValue);
                let labelText = formatter.format(value);
                properties.text = labelText;
                
                let textWidth = TextMeasurementService.measureSvgTextWidth(properties);
                let textHeight = TextMeasurementService.estimateSvgTextHeight(properties);
                let parentType = LabelDataPointParentType.Rectangle;
                let shape: any = {
                    rect: {
                        left: shapeLayout.x(dataPoint),
                        top: shapeLayout.y(dataPoint),
                        width: shapeLayout.width(dataPoint),
                        height: height
                    },
                    orientation: FunnelChart.LabelOrientation,
                    validPositions: validPositions
                };
                
                var point: LabelDataPoint = {
                    isPreferred: true,
                    // text
                    text: labelText,
                    textSize: {
                        width: textWidth,
                        height: textHeight
                    },
                    fontSize: fontSize,
                    // parent shape
                    parentType: parentType,
                    parentShape: shape,
                    // colors
                    insideFill: insideFill,
                    outsideFill: outsideFill,
                    // additional properties
                    identity: dataPoint.identity,
                    hasBackground: false
                };
                
                // For zero value we are using point in order to center text position.
                if(dataPoint.value === 0) {
                    shape = <LabelParentPoint> {
                       validPositions: [ NewPointLabelPosition.Center ],
                       point: {
                          x: shapeLayout.x(dataPoint),
                          y: shapeLayout.y(dataPoint) + height / 2
                       }
                       
                    };
                    parentType = LabelDataPointParentType.Point;
                    point.parentShape = shape;
                    point.parentType = parentType;
                    point.insideFill = point.outsideFill;
                }
                
                points.push(point);
            }
            
            return points;
        }
    }
}