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
    import Color = jsCommon.Color;
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
    import PixelConverter = jsCommon.PixelConverter;
    import DataRoleHelper = powerbi.data.DataRoleHelper;
    import IDataViewCategoricalReader = powerbi.data.IDataViewCategoricalReader;

    export interface ScatterChartConstructorOptions extends CartesianVisualConstructorOptions {
    }

    export interface ScatterChartDataPoint extends SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        x: any;
        y: any;
        size: any;
        radius: RadiusData;
        fill: string;
        formattedCategory: jsCommon.Lazy<string>;
        fontSize?: number;
    }

    export interface ScatterChartDataPointSeries {
        identityKey: string;
        dataPoints?: ScatterChartDataPoint[];
        hasSize?: boolean;
        fill?: string;
    }

    export interface RadiusData {
        sizeMeasure: DataViewValueColumn;
        index: number;
    }

    export interface DataRange {
        minRange: number;
        maxRange: number;
        delta: number;
    }

    export interface ScatterChartData extends PlayableChartData, ScatterBehaviorChartData {
        xCol: DataViewMetadataColumn;
        yCol: DataViewMetadataColumn;
        dataPoints: ScatterChartDataPoint[];
        dataPointSeries: ScatterChartDataPointSeries[];
        legendData: LegendData;
        axesLabels: ChartAxesLabels;
        size?: DataViewMetadataColumn;
        sizeRange: NumberRange;
        dataLabelsSettings: PointDataLabelsSettings;
        defaultDataPointColor?: string;
        showAllDataPoints?: boolean;
        hasDynamicSeries?: boolean;
        fillPoint?: boolean;
        colorBorder?: boolean;
        colorByCategory?: boolean;
    }

    export interface ScatterChartViewModel {
        xAxisProperties: IAxisProperties;
        yAxisProperties: IAxisProperties;
        viewport: IViewport;
        data: ScatterChartData;
        drawBubbles: boolean;
        isPlay: boolean;
        fillMarkers: boolean;
        hasSelection: boolean;
        animationDuration: number;
        animationOptions: AnimationOptions;
        easeType: string;
        suppressDataPointRendering: boolean;
    }

    interface ScatterChartMeasureMetadata {
        idx: {
            x?: number;
            y?: number;
            size?: number;
        };
        cols: {
            x?: DataViewMetadataColumn;
            y?: DataViewMetadataColumn;
            size?: DataViewMetadataColumn;
        };
        axesLabels: ChartAxesLabels;
    }

    interface MouseCoordinates {
        x: number;
        y: number;
    }

    export interface ScatterConverterOptions {
        viewport: IViewport;
        colors: any;
        interactivityService?: any;
        categoryAxisProperties?: any;
        valueAxisProperties?: any;
    }

    interface ScatterObjectProperties {
        fillPoint?: boolean;
        colorBorder?: boolean;
        showAllDataPoints?: boolean;
        defaultDataPointColor?: string;
        colorByCategory?: boolean;
    }

    /** Styles to apply to scatter chart data point marker */
    export interface ScatterMarkerStyle {
        'stroke-opacity': number;
        stroke: string;
        fill: string;
        'fill-opacity': number;
    }

    export interface CartesianExtents {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
    }

    export class ScatterChart implements ICartesianVisual {
        private static BubbleRadius = 3 * 2;
        public static DefaultBubbleOpacity = 0.85;
        public static DimmedBubbleOpacity = 0.4;
        public static StrokeDarkenColorValue = 255 * 0.25;
        //label layout settings
        public static dataLabelLayoutStartingOffset: number = 2;
        public static dataLabelLayoutOffsetIterationDelta: number = 6;
        public static dataLabelLayoutMaximumOffset: number = ScatterChart.dataLabelLayoutStartingOffset + (2 * ScatterChart.dataLabelLayoutOffsetIterationDelta);
        // Chart Area and size range values as defined by PV charts
        private static AreaOf300By300Chart = 90000;
        private static MinSizeRange = 200;
        private static MaxSizeRange = 3000;
        private static ClassName = 'scatterChart';
        // Animated rendering threshold - if more than this number of data points, rendering is grouped by series and not animated
        public static NoAnimationThreshold = 1000;
        // No render resize threshold - if more than this number of data points, rendering is suppressed during resize
        public static NoRenderResizeThreshold = 1000;

        private svg: D3.Selection;
        private element: JQuery;
        private currentViewport: IViewport;
        private style: IVisualStyle;
        private data: ScatterChartData;
        private dataView: DataView;
        private host: IVisualHostServices;
        private margin: IMargin;

        private colors: IDataColorPalette;
        private options: CartesianVisualInitOptions;
        private interactivity: InteractivityOptions;
        private cartesianVisualHost: ICartesianVisualHost;
        private isMobileChart: boolean;
        private interactivityService: IInteractivityService;
        private categoryAxisProperties: DataViewObject;
        private valueAxisProperties: DataViewObject;
        private animator: IGenericAnimator;
        private tooltipsEnabled: boolean;
        private tooltipBucketEnabled: boolean;

        private xAxisProperties: IAxisProperties;
        private yAxisProperties: IAxisProperties;

        private renderer: SvgRenderer;
        private playAxis: PlayAxis<ScatterChartData>;

        constructor(options: ScatterChartConstructorOptions) {
            if (options) {
                this.tooltipsEnabled = options.tooltipsEnabled;
                this.tooltipBucketEnabled = options.tooltipBucketEnabled;
                this.interactivityService = options.interactivityService;
                this.animator = options.animator;
            }

            this.renderer = new SvgRenderer();
        }

        public init(options: CartesianVisualInitOptions) {
            this.options = options;
            this.element = options.element;
            this.currentViewport = options.viewport;
            this.style = options.style;
            this.host = options.host;
            this.colors = this.style.colorPalette.dataColors;
            this.interactivity = options.interactivity;
            this.cartesianVisualHost = options.cartesianHost;
            this.isMobileChart = options.interactivity && options.interactivity.isInteractiveLegend;

            let svg = this.svg = options.svg;

            // TODO: should we always be adding the playchart class name?
            svg.classed(ScatterChart.ClassName + ' ' + PlayChart.ClassName, true);

            this.renderer.init(svg, options.labelsContext, this.isMobileChart, this.tooltipsEnabled);
        }

        public static getAdditionalTelemetry(dataView: DataView): any {
            let telemetry = {
                hasSize: DataRoleHelper.hasRoleInDataView(dataView, 'Size'),
                hasPlayAxis: DataRoleHelper.hasRoleInDataView(dataView, 'Play'),
            };

            return telemetry;
        }

        private static getObjectProperties(dataView: DataView, dataLabelsSettings?: PointDataLabelsSettings): ScatterObjectProperties {
            let objects: DataViewObjects;
            if (dataView && dataView.metadata && dataView.metadata.objects)
                objects = dataView.metadata.objects;
            else
                objects = {};

            let objectProperties: ScatterObjectProperties = {};

            objectProperties.defaultDataPointColor = DataViewObjects.getFillColor(objects, columnChartProps.dataPoint.defaultColor);
            objectProperties.showAllDataPoints = DataViewObjects.getValue<boolean>(objects, columnChartProps.dataPoint.showAllDataPoints, false);

            let labelsObj = <DataLabelObject>objects['categoryLabels'];
            if (labelsObj && dataLabelsSettings)
                dataLabelUtils.updateLabelSettingsFromLabelsObject(labelsObj, dataLabelsSettings);

            // NOTE: "fill point" defaults to on when we have a gradient role.
            let hasGradient = dataView && GradientUtils.hasGradientRole(dataView.categorical);
            objectProperties.fillPoint = DataViewObjects.getValue(objects, scatterChartProps.fillPoint.show, hasGradient);

            objectProperties.colorBorder = DataViewObjects.getValue(objects, scatterChartProps.colorBorder.show, false);
            objectProperties.colorByCategory = DataViewObjects.getValue(objects, scatterChartProps.colorByCategory.show, false);

            return objectProperties;
        }

        public static converter(dataView: DataView, options: ScatterConverterOptions, playFrameInfo?: PlayFrameInfo, tooltipsEnabled: boolean = true, tooltipBucketEnabled?: boolean): ScatterChartData {
            let reader = powerbi.data.createIDataViewCategoricalReader(dataView);
            let categoryValues: any[],
                categoryFormatter: IValueFormatter,
                categoryObjects: DataViewObjects[],
                categoryIdentities: DataViewScopeIdentity[],
                categoryQueryName: string;

            let currentViewport = options.viewport;
            let colorPalette = options.colors;
            let interactivityService = options.interactivityService;
            let categoryAxisProperties = options.categoryAxisProperties;
            let valueAxisProperties = options.valueAxisProperties;

            let dataViewCategorical: DataViewCategorical = dataView.categorical;
            let gradientValueColumn: DataViewValueColumn = GradientUtils.getGradientValueColumn(dataViewCategorical);

            if (dataViewCategorical.categories && dataViewCategorical.categories.length > 0) {
                categoryValues = dataViewCategorical.categories[0].values;
                categoryFormatter = valueFormatter.create({ format: valueFormatter.getFormatString(dataViewCategorical.categories[0].source, scatterChartProps.general.formatString), value: categoryValues[0], value2: categoryValues[categoryValues.length - 1] });
                categoryIdentities = dataViewCategorical.categories[0].identity;
                categoryObjects = dataViewCategorical.categories[0].objects;
                categoryQueryName = dataViewCategorical.categories[0].source.queryName;
            }
            else {
                categoryValues = [null];
                // creating default formatter for null value (to get the right string of empty value from the locale)
                categoryFormatter = valueFormatter.createDefaultFormatter(null);
            }

            let categories = dataViewCategorical.categories;
            let dataValues = dataViewCategorical.values;
            let hasDynamicSeries = !!dataValues.source;
            let grouped = dataValues.grouped();
            let dvSource = dataValues.source;
            let scatterMetadata = ScatterChart.getMetadata(grouped, dvSource);
            let dataLabelsSettings = dataLabelUtils.getDefaultPointLabelSettings();
            let sizeRange = ScatterChart.getSizeRangeForGroups(grouped, scatterMetadata.idx.size);

            let objProps = ScatterChart.getObjectProperties(dataView, dataLabelsSettings);

            let dataPointSeries = ScatterChart.createDataPointSeries(
                reader,
                dataValues,
                scatterMetadata,
                categories,
                categoryValues,
                categoryFormatter,
                categoryIdentities,
                categoryObjects,
                colorPalette,
                currentViewport,
                hasDynamicSeries,
                dataLabelsSettings,
                gradientValueColumn,
                objProps.defaultDataPointColor,
                categoryQueryName,
                objProps.colorByCategory,
                playFrameInfo,
                tooltipsEnabled,
                tooltipBucketEnabled);
            let dataPoints = _.reduce(dataPointSeries, (a, s) => a.concat(s.dataPoints), []);

            let legendItems = hasDynamicSeries
                ? ScatterChart.createSeriesLegend(dataValues, colorPalette, dataValues, valueFormatter.getFormatString(dvSource, scatterChartProps.general.formatString), objProps.defaultDataPointColor)
                : [];

            let legendTitle = dataValues && dvSource ? dvSource.displayName : "";
            if (!legendTitle) {
                legendTitle = categories && categories.length > 0 && categories[0].source.displayName ? categories[0].source.displayName : "";
            }

            if (categoryAxisProperties && categoryAxisProperties["showAxisTitle"] !== null && categoryAxisProperties["showAxisTitle"] === false) {
                scatterMetadata.axesLabels.x = null;
            }
            if (valueAxisProperties && valueAxisProperties["showAxisTitle"] !== null && valueAxisProperties["showAxisTitle"] === false) {
                scatterMetadata.axesLabels.y = null;
            }

            if (interactivityService) {
                interactivityService.applySelectionStateToData(dataPoints);
                interactivityService.applySelectionStateToData(legendItems);
            }

            return {
                xCol: scatterMetadata.cols.x,
                yCol: scatterMetadata.cols.y,
                dataPoints: dataPoints,
                dataPointSeries: dataPointSeries,
                legendData: { title: legendTitle, dataPoints: legendItems, grouped: hasDynamicSeries},
                axesLabels: scatterMetadata.axesLabels,
                size: scatterMetadata.cols.size,
                sizeRange: sizeRange,
                dataLabelsSettings: dataLabelsSettings,
                defaultDataPointColor: objProps.defaultDataPointColor,
                hasDynamicSeries: hasDynamicSeries,
                showAllDataPoints: objProps.showAllDataPoints,
                fillPoint: objProps.fillPoint,
                colorBorder: objProps.colorBorder,
                colorByCategory: objProps.colorByCategory,
            };
        }

        private static getSizeRangeForGroups(
            dataViewValueGroups: DataViewValueColumnGroup[],
            sizeColumnIndex: number): NumberRange {

            let result: NumberRange = {};
            if (dataViewValueGroups) {
                dataViewValueGroups.forEach((group) => {
                    let sizeColumn = ScatterChart.getMeasureValue(sizeColumnIndex, group.values);
                    let currentRange: NumberRange = AxisHelper.getRangeForColumn(sizeColumn);
                    if (result.min == null || result.min > currentRange.min) {
                        result.min = currentRange.min;
                    }
                    if (result.max == null || result.max < currentRange.max) {
                        result.max = currentRange.max;
                    }
                });
            }
            return result;
        }

        private static createDataPointSeries(
            reader: IDataViewCategoricalReader,
            dataValues: DataViewValueColumns,
            metadata: ScatterChartMeasureMetadata,
            categories: DataViewCategoryColumn[],
            categoryValues: any[],
            categoryFormatter: IValueFormatter,
            categoryIdentities: DataViewScopeIdentity[],
            categoryObjects: DataViewObjects[],
            colorPalette: IDataColorPalette,
            viewport: IViewport,
            hasDynamicSeries: boolean,
            labelSettings: PointDataLabelsSettings,
            gradientValueColumn: DataViewValueColumn,
            defaultDataPointColor: string,
            categoryQueryName: string,
            colorByCategory: boolean,
            playFrameInfo: PlayFrameInfo,
            tooltipsEnabled: boolean,
            tooltipBucketEnabled?: boolean): ScatterChartDataPointSeries[] {

            let hasX = reader.hasValues("X");
            let hasY = reader.hasValues("Y");

            if (!hasX && !hasY) {
                return [];
            }

            let dataPointSeries: ScatterChartDataPointSeries[] = [],
                indicies = metadata.idx,
                formatStringProp = scatterChartProps.general.formatString,
                dataValueSource = dataValues.source,
                grouped = dataValues.grouped();

            let colorHelper = new ColorHelper(colorPalette, scatterChartProps.dataPoint.fill, defaultDataPointColor);

            for (let seriesIndex = 0, len = grouped.length; seriesIndex < len; seriesIndex++) {
                let grouping = grouped[seriesIndex];
                let seriesValues = grouping.values;
                let measureX = ScatterChart.getMeasureValue(indicies.x, seriesValues);
                let measureY = ScatterChart.getMeasureValue(indicies.y, seriesValues);
                let measureSize = ScatterChart.getMeasureValue(indicies.size, seriesValues);

                let seriesColor: string;
                if (hasDynamicSeries) {
                    seriesColor = colorHelper.getColorForSeriesValue(grouping.objects, dataValues.identityFields, grouping.name);
                }
                else if (!colorByCategory && !categoryObjects) {
                    // If we have no Size measure then use a blank query name
                    let measureSource = (measureSize != null)
                        ? measureSize.source.queryName
                        : '';

                    seriesColor = colorHelper.getColorForMeasure(null, measureSource);
                }

                let series: ScatterChartDataPointSeries = {
                    identityKey: (grouping && grouping.identity && grouping.identity.key) || "",
                    dataPoints: [],
                    hasSize: !!(measureSize && measureSize.values),
                    fill: seriesColor,
                };

                dataPointSeries.push(series);

                for (let categoryIndex = 0, ilen = categoryValues.length; categoryIndex < ilen; categoryIndex++) {
                    let categoryValue = categoryValues[categoryIndex];

                    // Zero out X and Y if the role doesn't exist, so you still get a set of vertical/horizontal dots
                    let xVal = hasX ? AxisHelper.normalizeNonFiniteNumber(reader.getValue("X", categoryIndex, seriesIndex)) : 0;
                    let yVal = hasY ? AxisHelper.normalizeNonFiniteNumber(reader.getValue("Y", categoryIndex, seriesIndex)) : 0;
                    // Undefined size is handled later if we don't have a size role, so this is fine to just be undefined
                    let size = AxisHelper.normalizeNonFiniteNumber(reader.getValue("Size", categoryIndex, seriesIndex));

                    // Do not render a dot if X or Y are null
                    if (xVal == null || yVal == null)
                        continue;

                    let color: string;
                    if (hasDynamicSeries) {
                        color = colorHelper.getColorForSeriesValue(grouping.objects, dataValues.identityFields, grouping.name);
                    }
                    else if (colorByCategory) {
                        color = colorHelper.getColorForSeriesValue(categoryObjects && categoryObjects[categoryIndex], dataValues.identityFields, categoryValue);
                    }
                    else {
                        // If we have no Size measure then use a blank query name
                        let measureSource = (measureSize != null)
                            ? measureSize.source.queryName
                            : '';

                        color = colorHelper.getColorForMeasure(categoryObjects && categoryObjects[categoryIndex], measureSource);
                    }

                    let category = !_.isEmpty(categories) ? categories[0] : null;
                    let identity = SelectionIdBuilder.builder()
                        .withCategory(category, categoryIndex)
                        .withSeries(dataValues, grouping)
                        .createSelectionId();

                    let tooltipInfo: TooltipDataItem[];

                    if (tooltipsEnabled) {
                        tooltipInfo = [];

                        if (category) {
                            tooltipInfo.push({
                                displayName: category.source.displayName,
                                value: converterHelper.formatFromMetadataColumn(categoryValue, category.source, formatStringProp),
                            });
                        }

                        if (hasDynamicSeries) {
                        // Dynamic series
                            if ( !category || category.source !== dataValueSource) {
                                tooltipInfo.push({
                                    displayName: dataValueSource.displayName,
                                    value: converterHelper.formatFromMetadataColumn(grouping.name, dataValueSource, formatStringProp),
                                });
                            }
                        }

                        if (measureX && xVal != null) {
                            tooltipInfo.push({
                                displayName: measureX.source.displayName,
                                value: converterHelper.formatFromMetadataColumn(xVal, measureX.source, formatStringProp),
                            });
                        }

                        if (measureY && yVal != null) {
                            tooltipInfo.push({
                                displayName: measureY.source.displayName,
                                value: converterHelper.formatFromMetadataColumn(yVal, measureY.source, formatStringProp),
                            });
                        }

                        if (measureSize && measureSize.values[categoryIndex] != null) {
                            tooltipInfo.push({
                                displayName: measureSize.source.displayName,
                                value: converterHelper.formatFromMetadataColumn(measureSize.values[categoryIndex], measureSize.source, formatStringProp),
                            });
                        }

                        if (gradientValueColumn && gradientValueColumn.values[categoryIndex] != null) {
                            tooltipInfo.push({
                                displayName: gradientValueColumn.source.displayName,
                                value: converterHelper.formatFromMetadataColumn(gradientValueColumn.values[categoryIndex], gradientValueColumn.source, formatStringProp),
                            });
                        }

                        if (playFrameInfo) {
                            tooltipInfo.push({
                                displayName: playFrameInfo.column.displayName,
                                value: converterHelper.formatFromMetadataColumn(playFrameInfo.label, playFrameInfo.column, formatStringProp),
                            });
                        }

                        if (tooltipBucketEnabled) {
                            TooltipBuilder.addTooltipBucketItem(reader, tooltipInfo, categoryIndex, seriesIndex);
                        }
                    }

                    let dataPoint: ScatterChartDataPoint = {
                        x: xVal,
                        y: yVal,
                        size: size,
                        radius: { sizeMeasure: measureSize, index: categoryIndex },
                        fill: color,
                        formattedCategory: ScatterChart.createLazyFormattedCategory(categoryFormatter, categories != null ? categoryValue : grouping.name),
                        selected: false,
                        identity: identity,
                        tooltipInfo: tooltipInfo,
                        labelFill: labelSettings.labelColor,
                    };

                    series.dataPoints.push(dataPoint);
                }
            }
            return dataPointSeries;
        }

        public static createLazyFormattedCategory(formatter: IValueFormatter, value: string): jsCommon.Lazy<string> {
            return new jsCommon.Lazy(() => formatter.format(value));
        }

        private static createSeriesLegend(
            dataValues: DataViewValueColumns,
            colorPalette: IDataColorPalette,
            categorical: DataViewValueColumns,
            formatString: string,
            defaultDataPointColor: string): LegendDataPoint[] {

            let grouped = dataValues.grouped();
            let colorHelper = new ColorHelper(colorPalette, scatterChartProps.dataPoint.fill, defaultDataPointColor);

            let legendItems: LegendDataPoint[] = [];
            for (let i = 0, len = grouped.length; i < len; i++) {
                let grouping = grouped[i];
                let color = colorHelper.getColorForSeriesValue(grouping.objects, dataValues.identityFields, grouping.name);
                let identity = SelectionIdBuilder.builder()
                    .withSeries(categorical, grouped[i])
                    .createSelectionId();
                legendItems.push({
                    color: color,
                    icon: LegendIcon.Circle,
                    label: valueFormatter.format(grouping.name, formatString),
                    identity: identity,
                    selected: false
                });
            }

            return legendItems;
        }

        public static getBubbleRadius(radiusData: RadiusData, sizeRange: NumberRange, viewport: IViewport): number {
            let actualSizeDataRange = null;
            let bubblePixelAreaSizeRange = null;
            let measureSize = radiusData.sizeMeasure;

            if (!measureSize)
                return ScatterChart.BubbleRadius;

            let minSize = sizeRange.min ? sizeRange.min : 0;
            let maxSize = sizeRange.max ? sizeRange.max : 0;

            let min = Math.min(minSize, 0);
            let max = Math.max(maxSize, 0);
            actualSizeDataRange = {
                minRange: min,
                maxRange: max,
                delta: max - min
            };

            bubblePixelAreaSizeRange = ScatterChart.getBubblePixelAreaSizeRange(viewport, ScatterChart.MinSizeRange, ScatterChart.MaxSizeRange);

            if (measureSize.values) {
                let sizeValue = measureSize.values[radiusData.index];
                if (sizeValue != null) {
                    return ScatterChart.projectSizeToPixels(sizeValue, actualSizeDataRange, bubblePixelAreaSizeRange) / 2;
                }
            }

            return ScatterChart.BubbleRadius;
        }

        public static getMeasureValue(measureIndex: number, seriesValues: DataViewValueColumn[]): DataViewValueColumn {
            if (measureIndex >= 0)
                return seriesValues[measureIndex];

            return null;
        }

        private static getMetadata(grouped: DataViewValueColumnGroup[], source: DataViewMetadataColumn): ScatterChartMeasureMetadata {
            let xIndex = DataRoleHelper.getMeasureIndexOfRole(grouped, 'X');
            let yIndex = DataRoleHelper.getMeasureIndexOfRole(grouped, 'Y');
            let sizeIndex = DataRoleHelper.getMeasureIndexOfRole(grouped, 'Size');
            let xCol: DataViewMetadataColumn;
            let yCol: DataViewMetadataColumn;
            let sizeCol: DataViewMetadataColumn;
            let xAxisLabel = "";
            let yAxisLabel = "";

            if (grouped && grouped.length) {
                let firstGroup = grouped[0];
                if (xIndex >= 0) {
                    xCol = firstGroup.values[xIndex].source;
                    xAxisLabel = firstGroup.values[xIndex].source.displayName;
                }
                if (yIndex >= 0) {
                    yCol = firstGroup.values[yIndex].source;
                    yAxisLabel = firstGroup.values[yIndex].source.displayName;
                }
                if (sizeIndex >= 0) {
                    sizeCol = firstGroup.values[sizeIndex].source;
                }
            }

            return {
                idx: {
                    x: xIndex,
                    y: yIndex,
                    size: sizeIndex,
                },
                cols: {
                    x: xCol,
                    y: yCol,
                    size: sizeCol,
                },
                axesLabels: {
                    x: xAxisLabel,
                    y: yAxisLabel
                }
            };
        }

        /** Create a new viewmodel with default data. */
        public static getDefaultData(): ScatterChartData {
            return {
                xCol: undefined,
                yCol: undefined,
                dataPoints: [],
                dataPointSeries: [],
                legendData: { dataPoints: [] },
                axesLabels: { x: '', y: '' },
                sizeRange: [],
                dataLabelsSettings: dataLabelUtils.getDefaultPointLabelSettings(),
                defaultDataPointColor: null,
                hasDynamicSeries: false,
            };
        }

        private renderAtFrame(data: ScatterChartData): void {
            this.data = data;
            this.cartesianVisualHost.triggerRender(false);
        }

        public setData(dataViews: DataView[]): void {
            this.data = ScatterChart.getDefaultData();

            if (this.playAxis && this.playAxis.isCurrentlyPlaying())
                this.playAxis.stop();

            if (dataViews.length > 0) {
                let dataView = dataViews[0] || dataViews[1];

                if (dataView) {
                    this.categoryAxisProperties = CartesianHelper.getCategoryAxisProperties(dataView.metadata, true);
                    this.valueAxisProperties = CartesianHelper.getValueAxisProperties(dataView.metadata, true);
                    this.dataView = dataView;

                    let converterOptions: ScatterConverterOptions = {
                        viewport: this.currentViewport,
                        colors: this.colors,
                        interactivityService: this.interactivityService,
                        categoryAxisProperties: this.categoryAxisProperties,
                        valueAxisProperties: this.valueAxisProperties,
                    };

                    if (PlayChart.isDataViewPlayable(dataView)) {
                        if (!this.playAxis) {
                            this.playAxis = new PlayAxis<ScatterChartData>({
                                animator: this.animator,
                                interactivityService: this.interactivityService,
                                isScrollable: false,
                            });
                            this.playAxis.init(this.options);
                        }

                        let playData = this.playAxis.setData(
                            dataView,
                            (dataView: DataView, playFrameInfo?: PlayFrameInfo) =>
                                ScatterChart.converter(dataView, converterOptions, playFrameInfo, this.tooltipsEnabled, this.tooltipBucketEnabled));
                        this.mergeSizeRanges(playData);
                        this.data = playData.currentViewModel;

                        this.playAxis.setRenderFunction((data) => this.renderAtFrame(data));
                    }
                    else {
                        if (this.playAxis) {
                            this.playAxis.remove();
                            this.playAxis = null;
                        }

                        if (dataView.categorical && dataView.categorical.values) {
                            this.data = ScatterChart.converter(dataView, converterOptions, undefined, this.tooltipsEnabled, this.tooltipBucketEnabled);
                        }
                    }
                }
            }
            else if (this.playAxis) {
                this.playAxis.remove();
                this.playAxis = null;
            }
        }

        private mergeSizeRanges(playData: PlayChartData<ScatterChartData>): void {
            if (playData && playData.currentViewModel) {
                let mergedSizeRange: NumberRange = playData.currentViewModel.sizeRange;
                for (let data of playData.allViewModels) {
                    let sizeRange = data.sizeRange;
                    if (sizeRange.min != null)
                        mergedSizeRange.min = Math.min(mergedSizeRange.min, sizeRange.min);
                    if (sizeRange.max != null)
                        mergedSizeRange.max = Math.max(mergedSizeRange.max, sizeRange.max);
                }
                for (let data of playData.allViewModels) {
                    data.sizeRange = mergedSizeRange;
                }
            }
        }

        public calculateLegend(): LegendData {
            return this.data && this.data.legendData;
        }

        public hasLegend(): boolean {
            return this.data && this.data.hasDynamicSeries;
        }

        public enumerateObjectInstances(enumeration: ObjectEnumerationBuilder, options: EnumerateVisualObjectInstancesOptions): void {
            switch (options.objectName) {
                case 'colorByCategory':
                    if (this.data) {
                        // Color by Legend takes precedent during render. Hide the slice but keep the colorByCategory value unchanged in case they remove the Legend field.
                        if (!this.data.hasDynamicSeries) {
                            enumeration.pushInstance({
                                objectName: 'colorByCategory',
                                selector: null,
                                properties: {
                                    show: this.data.colorByCategory,
                                },
                            });
                        }
                    }
                    break;
                case 'dataPoint':
                    // TODO: DataViewMatix (for PlayAxis) doesn't support category- or series-specific properties yet.
                    if (!this.playAxis) {
                        let categoricalDataView: DataViewCategorical = this.dataView && this.dataView.categorical ? this.dataView.categorical : null;
                        if (!GradientUtils.hasGradientRole(categoricalDataView))
                            return this.enumerateDataPoints(enumeration);
                    }
                    break;
                case 'categoryAxis':
                    enumeration.pushInstance({
                        selector: null,
                        properties: {
                            showAxisTitle: !this.categoryAxisProperties || this.categoryAxisProperties["showAxisTitle"] == null ? true : this.categoryAxisProperties["showAxisTitle"]
                        },
                        objectName: 'categoryAxis'
                    });
                    break;
                case 'valueAxis':
                    enumeration.pushInstance({
                        selector: null,
                        properties: {
                            showAxisTitle: !this.valueAxisProperties || this.valueAxisProperties["showAxisTitle"] == null ? true : this.valueAxisProperties["showAxisTitle"]
                        },
                        objectName: 'valueAxis'
                    });
                    break;
                case 'categoryLabels':
                    if (this.data)
                        dataLabelUtils.enumerateCategoryLabels(enumeration, this.data.dataLabelsSettings, true);
                    else
                        dataLabelUtils.enumerateCategoryLabels(enumeration, null, true);
                    break;
                case 'fillPoint':
                    // Check if the card should be shown or not based on the existence of size measure
                    if (this.hasSizeMeasure())
                        return;

                    enumeration.pushInstance({
                        objectName: 'fillPoint',
                        selector: null,
                        properties: {
                            show: this.data.fillPoint,
                        },
                    });
                    break;
                case 'colorBorder':
                    // Check if the card should be shown or not based on the existence of size measure
                    if (this.hasSizeMeasure())
                        enumeration.pushInstance({
                            objectName: 'colorBorder',
                            selector: null,
                            properties: {
                                show: this.data.colorBorder,
                            },
                        });
                    break;
            }
        }

        private hasSizeMeasure(): boolean {
            let sizeRange = this.data.sizeRange;
            return sizeRange && sizeRange.min !== undefined;
        }

        private enumerateDataPoints(enumeration: ObjectEnumerationBuilder): void {
            let data = this.data;
            if (!data)
                return;

            let seriesCount = data.dataPoints.length;

            if (!data.hasDynamicSeries) {
                enumeration.pushInstance({
                    objectName: 'dataPoint',
                    selector: null,
                    properties: {
                        defaultColor: { solid: { color: data.defaultDataPointColor || this.colors.getColorByIndex(0).value } }
                    }
                }).pushInstance({
                    objectName: 'dataPoint',
                    selector: null,
                    properties: {
                        showAllDataPoints: !!data.showAllDataPoints
                    }
                });

                for (let i = 0; i < seriesCount; i++) {
                    let seriesDataPoints = data.dataPoints[i];
                    enumeration.pushInstance({
                        objectName: 'dataPoint',
                        displayName: seriesDataPoints.formattedCategory.getValue(),
                        selector: ColorHelper.normalizeSelector(seriesDataPoints.identity.getSelector(), /*isSingleSeries*/ true),
                        properties: {
                            fill: { solid: { color: seriesDataPoints.fill } }
                        },
                    });
                }
            }
            else {
                let legendDataPointLength = data.legendData.dataPoints.length;
                for (let i = 0; i < legendDataPointLength; i++) {
                    let series = data.legendData.dataPoints[i];
                    enumeration.pushInstance({
                        objectName: 'dataPoint',
                        displayName: series.label,
                        selector: ColorHelper.normalizeSelector(series.identity.getSelector()),
                        properties: {
                            fill: { solid: { color: series.color } }
                        },
                    });
                }
            }
        }

        public supportsTrendLine(): boolean {
            let data = this.data;
            if (!data)
                return false;
            let dataView = this.dataView;
            let reader = powerbi.data.createIDataViewCategoricalReader(dataView);
            return !this.hasSizeMeasure() && data.dataPointSeries.length > 0 && reader.hasValues("X") && reader.hasValues("Y");
        }

        private static getExtents(data: ScatterChartData): CartesianExtents {
            let dps = data.dataPoints;
            if (_.isEmpty(dps)) {
                return {
                    minY: 0,
                    maxY: 0,
                    minX: 0,
                    maxX: 0,
                };
            }

            return {
                minY: d3.min<ScatterChartDataPoint, number>(dps, d => d.y),
                maxY: d3.max<ScatterChartDataPoint, number>(dps, d => d.y),
                minX: d3.min<ScatterChartDataPoint, number>(dps, d => d.x),
                maxX: d3.max<ScatterChartDataPoint, number>(dps, d => d.x),
            };
        }

        public calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[] {
            let data = this.data;
            let viewport = this.currentViewport = options.viewport;
            let margin = options.margin;

            this.currentViewport = viewport;
            this.margin = margin;

            let width = viewport.width - (margin.left + margin.right);
            let height = viewport.height - (margin.top + margin.bottom);

            let extents: CartesianExtents = {
                minY: 0,
                maxY: 10,
                minX: 0,
                maxX: 10
            };

            if (this.playAxis) {
                extents = this.playAxis.getCartesianExtents(extents, ScatterChart.getExtents);
                this.playAxis.setPlayControlPosition(options.playAxisControlLayout);
            }
            else if (!_.isEmpty(data.dataPoints)) {
                extents = ScatterChart.getExtents(data);
            }

            let xDomain = [extents.minX, extents.maxX];
            let combinedXDomain = AxisHelper.combineDomain(options.forcedXDomain, xDomain, options.ensureXDomain);

            this.xAxisProperties = AxisHelper.createAxis({
                pixelSpan: width,
                dataDomain: combinedXDomain,
                metaDataColumn: data.xCol,
                formatString: valueFormatter.getFormatString(data.xCol, scatterChartProps.general.formatString),
                outerPadding: 0,
                isScalar: true,
                isVertical: false,
                forcedTickCount: options.forcedTickCount,
                useTickIntervalForDisplayUnits: true,
                isCategoryAxis: true, //scatter doesn't have a categorical axis, but this is needed for the pane to react correctly to the x-axis toggle one/off
                scaleType: options.categoryAxisScaleType,
                axisDisplayUnits: options.categoryAxisDisplayUnits,
                axisPrecision: options.categoryAxisPrecision
            });
            this.xAxisProperties.axis.tickSize(-height, 0);
            this.xAxisProperties.axisLabel = this.data.axesLabels.x;

            let combinedDomain = AxisHelper.combineDomain(options.forcedYDomain, [extents.minY, extents.maxY], options.ensureYDomain);

            this.yAxisProperties = AxisHelper.createAxis({
                pixelSpan: height,
                dataDomain: combinedDomain,
                metaDataColumn: data.yCol,
                formatString: valueFormatter.getFormatString(data.yCol, scatterChartProps.general.formatString),
                outerPadding: 0,
                isScalar: true,
                isVertical: true,
                forcedTickCount: options.forcedTickCount,
                useTickIntervalForDisplayUnits: true,
                isCategoryAxis: false,
                scaleType: options.valueAxisScaleType,
                axisDisplayUnits: options.valueAxisDisplayUnits,
                axisPrecision: options.valueAxisPrecision
            });
            this.yAxisProperties.axisLabel = this.data.axesLabels.y;

            // TODO: these should be passed into the render method.
            return [this.xAxisProperties, this.yAxisProperties];
        }

        public overrideXScale(xProperties: IAxisProperties): void {
            this.xAxisProperties = xProperties;
        }

        public shouldSuppressAnimation(): boolean {
            return this.data && this.data.dataPoints && this.data.dataPoints.length > ScatterChart.NoAnimationThreshold;
        }

        public render(suppressAnimations: boolean, resizeMode?: ResizeMode): CartesianVisualRenderResult {
            if (!this.data)
                return;

            let data = this.data;

            let margin = this.margin;
            let viewport = this.currentViewport;

            let hasSelection = this.interactivityService && this.interactivityService.hasSelection();

            let plotArea: IViewport = {
                width: viewport.width - (margin.left + margin.right),
                height: viewport.height - (margin.top + margin.bottom)
            };

            let duration = AnimatorCommon.GetAnimationDuration(this.animator, suppressAnimations);
            if (this.playAxis && this.playAxis.isCurrentlyPlaying() && (this.isMobileChart || duration > 0)) {
                duration = PlayChart.FrameAnimationDuration;
            }

            let easeType = this.playAxis ? 'linear' : 'cubic-in-out'; // cubic-in-out is the d3.ease default
            let fillMarkers = (!data.sizeRange || !data.sizeRange.min) && data.fillPoint;
            let drawBubbles = this.hasSizeMeasure();
            let suppressDataPointRendering = resizeMode === ResizeMode.Resizing && data.dataPoints && data.dataPoints.length > ScatterChart.NoRenderResizeThreshold;

            let viewModel: ScatterChartViewModel = {
                data: data,
                drawBubbles: drawBubbles,
                isPlay: !!this.playAxis,
                xAxisProperties: this.xAxisProperties,
                yAxisProperties: this.yAxisProperties,
                viewport: plotArea,
                hasSelection: hasSelection,
                animationDuration: duration,
                animationOptions: this.options.animation,
                fillMarkers: fillMarkers,
                easeType: easeType,
                suppressDataPointRendering: suppressDataPointRendering,
            };

            if (drawBubbles) {
                // Bubbles must be drawn from largest to smallest.
                let sortedData = data.dataPoints.sort(ScatterChart.sortBubbles);
                viewModel.data = Prototype.inherit(viewModel.data);
                viewModel.data.dataPoints = sortedData;
            }

            let labelDataPoints: LabelDataPoint[] = [];
            if (data.dataLabelsSettings && data.dataLabelsSettings.show || data.dataLabelsSettings.showCategory) {
                labelDataPoints = ScatterChartDataLabels.createLabelDataPoints(viewModel);
            }

            let behaviorOptions = this.renderer.render(viewModel, this.interactivityService);

            if (this.isMobileChart) {
                behaviorOptions = <ScatterMobileBehaviorOptions> {
                    data: behaviorOptions.data,
                    dataPointsSelection: behaviorOptions.dataPointsSelection,
                    eventGroup: behaviorOptions.eventGroup,
                    plotContext: behaviorOptions.plotContext,
                    host: this.cartesianVisualHost,
                    root: this.svg,
                    visualInitOptions: this.options,
                    xAxisProperties: this.xAxisProperties,
                    yAxisProperties: this.yAxisProperties,
                    background: d3.select(this.element.get(0)),
                };
            }

            let playRenderResult: PlayChartRenderResult<ScatterChartData, ScatterChartViewModel>;
            if (this.playAxis) {
                playRenderResult = this.playAxis.render(suppressAnimations, viewModel, viewport, margin);

                if (this.interactivityService) {
                    let playBehaviorOptions: PlayBehaviorOptions = {
                        traceLineRenderer: this.renderer.createTraceLineRenderer(playRenderResult.viewModel),
                    };

                    if (hasSelection) {
                        PlayChart.renderTraceLines(playRenderResult.allDataPoints, playBehaviorOptions.traceLineRenderer, !suppressAnimations);
                    }

                    behaviorOptions.playOptions = playBehaviorOptions;
                }
            }

            return {
                dataPoints: playRenderResult ? playRenderResult.allDataPoints : data.dataPoints,
                behaviorOptions: behaviorOptions,
                labelDataPoints: labelDataPoints,
                labelsAreNumeric: false,
            };
        }

        public static getStrokeFill(d: ScatterChartDataPoint, colorBorder: boolean): string {
            if (d.size != null && colorBorder) {
                let colorRgb = Color.parseColorString(d.fill);
                return Color.hexString(Color.darken(colorRgb, ScatterChart.StrokeDarkenColorValue));
            }
            return d.fill;
        }

        public static getBubblePixelAreaSizeRange(viewPort: IViewport, minSizeRange: number, maxSizeRange: number): DataRange {
            let ratio = 1.0;
            if (viewPort.height > 0 && viewPort.width > 0) {
                let minSize = Math.min(viewPort.height, viewPort.width);
                ratio = (minSize * minSize) / ScatterChart.AreaOf300By300Chart;
            }

            let minRange = Math.round(minSizeRange * ratio);
            let maxRange = Math.round(maxSizeRange * ratio);
            return {
                minRange: minRange,
                maxRange: maxRange,
                delta: maxRange - minRange
            };
        }

        public static project(value: number, actualSizeDataRange: DataRange, bubblePixelAreaSizeRange: DataRange): number {
            if (actualSizeDataRange.delta === 0 || bubblePixelAreaSizeRange.delta === 0) {
                return (ScatterChart.rangeContains(actualSizeDataRange, value)) ? bubblePixelAreaSizeRange.minRange : null;
            }

            let relativeX = (value - actualSizeDataRange.minRange) / actualSizeDataRange.delta;
            return bubblePixelAreaSizeRange.minRange + relativeX * bubblePixelAreaSizeRange.delta;
        }

        public static projectSizeToPixels(size: number, actualSizeDataRange: DataRange, bubblePixelAreaSizeRange: DataRange): number {
            let projectedSize = 0;
            if (actualSizeDataRange) {
                // Project value on the required range of bubble area sizes
                projectedSize = bubblePixelAreaSizeRange.maxRange;
                if (actualSizeDataRange.delta !== 0) {
                    let value = Math.min(Math.max(size, actualSizeDataRange.minRange), actualSizeDataRange.maxRange);
                    projectedSize = ScatterChart.project(value, actualSizeDataRange, bubblePixelAreaSizeRange);
                }

                projectedSize = Math.sqrt(projectedSize / Math.PI) * 2;
            }

            return Math.round(projectedSize);
        }

        public static rangeContains(range: DataRange, value: number): boolean {
            return range.minRange <= value && value <= range.maxRange;
        }

        public static getMarkerFillOpacity(hasSize: boolean, shouldEnableFill: boolean, hasSelection: boolean, isSelected: boolean): number {
            if (hasSize || shouldEnableFill) {
                if (hasSelection && !isSelected) {
                    return ScatterChart.DimmedBubbleOpacity;
                }
                return ScatterChart.DefaultBubbleOpacity;
            } else {
                return 0;
            }
        }

        public static getMarkerStrokeOpacity(hasSize: boolean, colorBorder: boolean, hasSelection: boolean, isSelected: boolean): number {
            if (hasSize && colorBorder) {
                return 1;
            } else {
                if (hasSelection && !isSelected) {
                    return ScatterChart.DimmedBubbleOpacity;
                }
                return ScatterChart.DefaultBubbleOpacity;
            }
        }

        public static getMarkerStrokeFill(hasSize: boolean, colorBorder: boolean, fill: string): string {
            if (hasSize && colorBorder) {
                let colorRgb = Color.parseColorString(fill);
                return Color.hexString(Color.darken(colorRgb, ScatterChart.StrokeDarkenColorValue));
            }
            return fill;
        }

        public static getMarkerStyle(d: ScatterChartDataPoint, colorBorder: boolean, hasSelection: boolean, fillMarkers: boolean): ScatterMarkerStyle {
            return {
                'stroke-opacity': ScatterChart.getMarkerStrokeOpacity(d.size != null, colorBorder, hasSelection, d.selected),
                stroke: ScatterChart.getMarkerStrokeFill(d.size != null, colorBorder, d.fill),
                fill: d.fill,
                'fill-opacity': ScatterChart.getMarkerFillOpacity(d.size != null, fillMarkers, hasSelection, d.selected),
            };
        }

        public static getSeriesStyle(hasSize: boolean, colorBorder: boolean, hasSelection: boolean, fillMarkers: boolean, fill: string): ScatterMarkerStyle {
            return {
                'stroke-opacity': ScatterChart.getMarkerStrokeOpacity(hasSize, colorBorder, hasSelection, false),
                stroke: ScatterChart.getMarkerStrokeFill(hasSize, colorBorder, fill),
                fill: fill,
                'fill-opacity': ScatterChart.getMarkerFillOpacity(hasSize, fillMarkers, hasSelection, false),
            };
        }

        public static getBubbleOpacity(d: ScatterChartDataPoint, hasSelection: boolean): number {
            if (hasSelection && !d.selected) {
                return ScatterChart.DimmedBubbleOpacity;
            }
            return ScatterChart.DefaultBubbleOpacity;
        }

        public onClearSelection(): void {
            if (this.interactivityService)
                this.interactivityService.clearSelection();
        }

        public getSupportedCategoryAxisType(): string {
            return axisType.scalar;
        }

        public static sortBubbles(a: ScatterChartDataPoint, b: ScatterChartDataPoint): number {
            let diff = (b.radius.sizeMeasure.values[b.radius.index] - a.radius.sizeMeasure.values[a.radius.index]);
            if (diff !== 0)
                return diff;

            // Tie-break equal size bubbles using identity.
            return b.identity.getKey().localeCompare(a.identity.getKey());
        }
    }

    class SvgRenderer {
        private static DotClass: ClassAndSelector = createClassAndSelector('dot');
        private static MainGraphicsContext = createClassAndSelector('mainGraphicsContext');
        private static ScatterMarkerSeriesGroup = createClassAndSelector('scatterMarkerSeriesGroup');

        private mainGraphicsContext: D3.Selection;
        private mainGraphicsG: D3.Selection;
        private mainGraphicsBackgroundRect: D3.Selection;
        private labelGraphicsContext: D3.Selection;
        private isMobileChart: boolean;
        private tooltipsEnabled: boolean;

        public init(element: D3.Selection, labelsContext: D3.Selection, isMobileChart: boolean, tooltipsEnabled: boolean): void {
            this.mainGraphicsG = element.append('g')
                .classed(SvgRenderer.MainGraphicsContext.class, true);

            this.isMobileChart = isMobileChart;
            if (isMobileChart) {
                // The backgroundRect catch user interactions when clicking/dragging on the background of the chart.
                this.mainGraphicsBackgroundRect = this.mainGraphicsG
                    .append("rect")
                    .classed("backgroundRect", true)
                    .attr({ width: "100%", height: "100%" });
            }

            this.mainGraphicsContext = this.mainGraphicsG.append('svg');
            this.labelGraphicsContext = labelsContext;
            this.tooltipsEnabled = tooltipsEnabled;

            // common rendering attributes
            this.mainGraphicsContext.attr('stroke-width', "1");
        }

        public render(viewModel: ScatterChartViewModel, interactivityService: IInteractivityService): ScatterBehaviorOptions {
            let viewport = viewModel.viewport;

            this.mainGraphicsContext
                .attr({
                    'width': viewport.width,
                    'height': viewport.height
                });

            let scatterMarkers: D3.Selection;
            if (viewModel.suppressDataPointRendering) {
                scatterMarkers = this.removeScatterMarkers();
            }
            else if (viewModel.animationDuration > 0) {
                scatterMarkers = this.drawScatterMarkers(viewModel);
            }
            else {
                scatterMarkers = this.drawScatterMarkersNoAnimation(viewModel, viewModel.drawBubbles);
            }

            if (viewModel.drawBubbles)
                scatterMarkers.order();

            if (this.tooltipsEnabled) {
                TooltipManager.addTooltip(this.mainGraphicsContext, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo);
            }
            SVGUtil.flushAllD3TransitionsIfNeeded(viewModel.animationOptions);

            return <ScatterBehaviorOptions> {
                dataPointsSelection: scatterMarkers,
                eventGroup: this.mainGraphicsG,
                data: viewModel.data,
                plotContext: this.mainGraphicsContext,
            };
        }

        public createTraceLineRenderer(viewModel: PlayChartViewModel<ScatterChartData, ScatterChartViewModel>): ScatterTraceLineRenderer {
            return new ScatterTraceLineRenderer(viewModel, this.mainGraphicsContext, this.tooltipsEnabled);
        }

        private removeScatterMarkers(): D3.Selection {
            this.mainGraphicsContext.selectAll(SvgRenderer.ScatterMarkerSeriesGroup.selector)
                .remove();

            return this.mainGraphicsContext.selectAll(SvgRenderer.DotClass.selector);
        }

        private drawScatterMarkers(viewModel: ScatterChartViewModel): D3.UpdateSelection {
            let data = viewModel.data;
            let xScale = viewModel.xAxisProperties.scale;
            let yScale = viewModel.yAxisProperties.scale;

            // put all the markers in a single fake group. keeps the dom structure consistent between
            // drawScatterMarkers and drawScatterMarkersGrouped.
            let fakeDataPointSeries: ScatterChartDataPointSeries[] = [
                {
                    identityKey: "",
                    dataPoints: data.dataPoints,
                },
            ];

            let fakeSeriesGroups = this.mainGraphicsContext.selectAll(SvgRenderer.ScatterMarkerSeriesGroup.selector)
                .data(fakeDataPointSeries, (s: ScatterChartDataPointSeries) => s.identityKey);

            fakeSeriesGroups.enter()
                .append('g')
                .classed(SvgRenderer.ScatterMarkerSeriesGroup.class, true);

            // groups for real series may have been inserted by drawScatterMarkersGrouped, remove them
            fakeSeriesGroups.exit()
                .remove();

            let markers = fakeSeriesGroups.selectAll(SvgRenderer.DotClass.selector)
                .data((s: ScatterChartDataPointSeries) => s.dataPoints, (d: ScatterChartDataPoint) => d.identity.getKey());

            markers.enter().append('circle')
                .classed(SvgRenderer.DotClass.class, true)
                .style('opacity', 0) // Fade new bubbles into visibility
                .attr('r', 0);

            markers
                .style({
                    'stroke-opacity': (d: ScatterChartDataPoint) => ScatterChart.getMarkerStrokeOpacity(d.size != null, data.colorBorder, viewModel.hasSelection, d.selected),
                    'stroke': (d: ScatterChartDataPoint) => ScatterChart.getStrokeFill(d, data.colorBorder),
                    'fill': (d: ScatterChartDataPoint) => d.fill,
                    'fill-opacity': (d: ScatterChartDataPoint) => ScatterChart.getMarkerFillOpacity(d.size != null, viewModel.fillMarkers, viewModel.hasSelection, d.selected),
                })
                .transition()
                .ease(viewModel.easeType)
                .duration(viewModel.animationDuration)
                .style('opacity', 1) // Fill-opacity is used for selected / highlight changes, opacity is for enter/exit fadein/fadeout
                .attr({
                    r: (d: ScatterChartDataPoint) => ScatterChart.getBubbleRadius(d.radius, data.sizeRange, viewModel.viewport),
                    cx: d => xScale(d.x),
                    cy: d => yScale(d.y),
                });

            markers
                .exit()
                .transition()
                .ease(viewModel.easeType)
                .duration(viewModel.animationDuration)
                .style('opacity', 0) // Fade out bubbles that are removed
                .attr('r', 0)
                .remove();

            return markers;
        }

        private drawScatterMarkersNoAnimation(viewModel: ScatterChartViewModel, isBubble: boolean): D3.Selection {
            let data = viewModel.data;
            let xScale = viewModel.xAxisProperties.scale;
            let yScale = viewModel.yAxisProperties.scale;

            let seriesGroups: D3.UpdateSelection;
            if (isBubble) {
                let fakeDataPointSeries: ScatterChartDataPointSeries[] = [
                    {
                        identityKey: "",
                        dataPoints: data.dataPoints,
                    },
                ];

                seriesGroups = this.mainGraphicsContext.selectAll(SvgRenderer.ScatterMarkerSeriesGroup.selector)
                    .data(fakeDataPointSeries, (s: ScatterChartDataPointSeries) => s.identityKey);
            }
            else {
                seriesGroups = this.mainGraphicsContext.selectAll(SvgRenderer.ScatterMarkerSeriesGroup.selector).data(data.dataPointSeries, (s: ScatterChartDataPointSeries) => s.identityKey);
            }

            // a group for each series
            seriesGroups.enter()
                .append('g')
                .classed(SvgRenderer.ScatterMarkerSeriesGroup.class, true);

            // this will also remove the fake group that might have been created by drawScatterMarkers
            seriesGroups.exit()
                .remove();

            seriesGroups
                .each(function (s: ScatterChartDataPointSeries): void {
                    let seriesStyle: ScatterMarkerStyle = ScatterChart.getSeriesStyle(s.hasSize, data.colorBorder, viewModel.hasSelection, viewModel.fillMarkers, s.fill);

                    let g = d3.select(<EventTarget>this);
                    SvgRenderer.applyStyle(this, seriesStyle);

                    let markers = g.selectAll(SvgRenderer.DotClass.selector).data(s.dataPoints, (m: ScatterChartDataPoint) => m.identity.getKey());

                    markers.interrupt();

                    markers.enter()
                        .append('circle')
                        .classed(SvgRenderer.DotClass.class, true);

                    markers.exit()
                        .remove();

                    markers.each(function (d: ScatterChartDataPoint) {
                        let style = ScatterChart.getMarkerStyle(d, data.colorBorder, viewModel.hasSelection, viewModel.fillMarkers);
                        SvgRenderer.styleException(style, seriesStyle);
                        SvgRenderer.applyStyle(this, style);
                    });

                    markers.attr({
                        r: (d: ScatterChartDataPoint) => ScatterChart.getBubbleRadius(d.radius, data.sizeRange, viewModel.viewport),
                        cx: d => xScale(d.x),
                        cy: d => yScale(d.y),
                    });
                });

            return this.mainGraphicsContext.selectAll(SvgRenderer.DotClass.selector);
        }

        private static styleException(elementStyle: ScatterMarkerStyle, seriesStyle: ScatterMarkerStyle): void {
            if (seriesStyle) {
                for (let name in elementStyle) {
                    if (elementStyle[name] === seriesStyle[name]) {
                        elementStyle[name] = null;
                    }
                }
            }
        }

        private static applyStyle(element: SVGStylable, style: ScatterMarkerStyle): void {
            for (let name in style) {
                let elementValue = element.style[name];
                let styleValue = style[name];
                if (styleValue == null) {
                    if (elementValue === "")
                        continue;
                } else {
                    styleValue = styleValue.toString();
                    if (styleValue === elementValue)
                        continue;
                }

                element.style[name] = styleValue;
            }
        }
    }

    module ScatterChartDataLabels {
        let validLabelPositions = [
            NewPointLabelPosition.Below,
            NewPointLabelPosition.Above,
            NewPointLabelPosition.Right,
            NewPointLabelPosition.Left,
            NewPointLabelPosition.BelowRight,
            NewPointLabelPosition.BelowLeft,
            NewPointLabelPosition.AboveRight,
            NewPointLabelPosition.AboveLeft
        ];

        /*
         * Represents standard Cartesian quadrant numbering:
         * 2 1
         * 3 4
         */
        export const enum QuadrantNumber {
            First,
            Second,
            Third,
            Fourth
        }

        export function createLabelDataPoints(viewModel: ScatterChartViewModel): LabelDataPoint[] {
            let xScale = viewModel.xAxisProperties.scale;
            let yScale = viewModel.yAxisProperties.scale;
            let sizeRange = viewModel.data.sizeRange;
            let labelDataPoints: LabelDataPoint[] = [];
            let dataPoints = viewModel.data.dataPoints;
            let labelSettings = viewModel.data.dataLabelsSettings;
            let preferredLabelsKeys = getPreferredLabelsKeys(viewModel);

            for (let dataPoint of dataPoints) {
                let text = dataPoint.formattedCategory.getValue();

                let properties: TextProperties = {
                    text: text,
                    fontFamily: NewDataLabelUtils.LabelTextProperties.fontFamily,
                    fontSize: PixelConverter.fromPoint(labelSettings.fontSize || NewDataLabelUtils.DefaultLabelFontSizeInPt),
                    fontWeight: NewDataLabelUtils.LabelTextProperties.fontWeight,
                };
                let textWidth = TextMeasurementService.measureSvgTextWidth(properties);
                let textHeight = TextMeasurementService.estimateSvgTextHeight(properties);

                labelDataPoints.push({
                    isPreferred: preferredLabelsKeys ? isLabelPreferred(dataPoint.identity.getKey(), preferredLabelsKeys) : false,
                    text: text,
                    textSize: {
                        width: textWidth,
                        height: textHeight,
                    },
                    outsideFill: labelSettings.labelColor ? labelSettings.labelColor : NewDataLabelUtils.defaultLabelColor,
                    insideFill: NewDataLabelUtils.defaultInsideLabelColor,
                    parentType: LabelDataPointParentType.Point,
                    parentShape: {
                        point: {
                            x: xScale(dataPoint.x),
                            y: yScale(dataPoint.y),
                        },
                        radius: ScatterChart.getBubbleRadius(dataPoint.radius, sizeRange, viewModel.viewport),
                        validPositions: validLabelPositions,
                    },
                    identity: dataPoint.identity,
                    fontSize: labelSettings.fontSize || NewDataLabelUtils.DefaultLabelFontSizeInPt,
                });
            }

            return labelDataPoints;
        }

        function getPreferredLabelsKeys(viewModel: ScatterChartViewModel): string[] {
            let width = viewModel.viewport.width;
            let height = viewModel.viewport.height;

            let visualCenter = new Point(width / 2, height / 2);
            let quadrantsCenters: Point[] = getQuadrantsCenters(width, height);

            return getCandidateLabels(visualCenter, quadrantsCenters, viewModel);
        }

        function getQuadrantsCenters(visualWidth: number, visualHeight: number): Point[] {
            let quadrantsCenters: Point[] = [];
            let quarterWidth = visualWidth / 4;
            let quarterHeight = visualHeight / 4;

            quadrantsCenters.push(new Point(quarterWidth, quarterHeight));
            quadrantsCenters.push(new Point(quarterWidth * 3, quarterHeight));
            quadrantsCenters.push(new Point(quarterWidth, quarterHeight * 3));
            quadrantsCenters.push(new Point(quarterWidth * 3, quarterHeight * 3));

            return quadrantsCenters;
        }

        function getCandidateLabels(
            visualCenter: Point,
            quadrantsCenters: Point[],
            viewModel: ScatterChartViewModel): string[] {
            let minDistances: number[] = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
            let ids: SelectionId[] = [];

            let xScale = viewModel.xAxisProperties.scale;
            let yScale = viewModel.yAxisProperties.scale;

            let distance: number;

            for (let dp of viewModel.data.dataPoints) {
                let x = xScale(dp.x);
                let y = yScale(dp.y);
                let quadrantNumber = getPointQuadrantNumber(x, y, visualCenter);
                if (viewModel.drawBubbles) {
                    // Since the array is sorted by size the preferred label will be the first label in the quadrant
                    if (!ids[quadrantNumber])
                        ids[quadrantNumber] = dp.identity;
                }
                else {
                    distance = getDistanceBetweenPoints(quadrantsCenters[quadrantNumber].x, quadrantsCenters[quadrantNumber].y, x, y);
                    if (distance < minDistances[quadrantNumber]) {
                        ids[quadrantNumber] = dp.identity;
                        minDistances[quadrantNumber] = distance;
                    }
                }

            }

            let preferredLabelsKeys: string[] = [];
            for (let id of ids) {
                if (id)
                    preferredLabelsKeys.push(id.getKey());
            }

            return preferredLabelsKeys;
        }

        function getPointQuadrantNumber(x: number, y: number, centerPoint: Point): number {
            if (x > centerPoint.x && y <= centerPoint.y)
                return QuadrantNumber.First;
            if (x <= centerPoint.x && y <= centerPoint.y)
                return QuadrantNumber.Second;
            if (x <= centerPoint.x && y > centerPoint.y)
                return QuadrantNumber.Third;
            else
                return QuadrantNumber.Fourth;
        }

        function getDistanceBetweenPoints(x1: number, y1: number, x2: number, y2: number): number {
            return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        }

        function isLabelPreferred(key: string, preferredLabelsKeys: string[]) {
            for (let preferredLabel of preferredLabelsKeys) {
                if (key.localeCompare(preferredLabel) === 0)
                    return true;
            }
            return false;
        }
    }

    class ScatterTraceLineRenderer implements ITraceLineRenderer {
        private static TraceLine: ClassAndSelector = createClassAndSelector('traceLine');
        private static TraceBubble: ClassAndSelector = createClassAndSelector('traceBubble');

        private viewModel: PlayChartViewModel<ScatterChartData, ScatterChartViewModel>;
        private element: D3.Selection;
        private tooltipsEnabled: boolean;

        constructor(viewModel: PlayChartViewModel<ScatterChartData, ScatterChartViewModel>, element: D3.Selection, tooltipsEnabled: boolean) {
            this.viewModel = viewModel;
            this.element = element;
            this.tooltipsEnabled = tooltipsEnabled;
        }

        public remove() {
            this.element.selectAll(ScatterTraceLineRenderer.TraceLine.selector).remove();
            this.element.selectAll(ScatterTraceLineRenderer.TraceBubble.selector).remove();
        }

        public render(selectedPoints: SelectableDataPoint[], shouldAnimate: boolean): void {
            let viewModel = this.viewModel;
            let scatterViewModel = viewModel.viewModel;
            let seriesPoints: ScatterChartDataPoint[][] = [];

            if (!_.isEmpty(selectedPoints) && !scatterViewModel.suppressDataPointRendering) {
                let currentFrameIndex = viewModel.data.currentFrameIndex;

                // filter to the selected identity, only up to and including the current frame. Add frames during play.
                let hasBubbleAtCurrentFrame: boolean[] = [];
                for (var selectedIndex = 0, selectedLen = selectedPoints.length; selectedIndex < selectedLen; selectedIndex++) {
                    seriesPoints[selectedIndex] = [];
                    hasBubbleAtCurrentFrame[selectedIndex] = false;
                    for (let frameIndex = 0, frameLen = viewModel.data.allViewModels.length; frameIndex < frameLen && frameIndex <= currentFrameIndex; frameIndex++) {
                        let value = _.find(viewModel.data.allViewModels[frameIndex].dataPoints, (value, index) => {
                            return value.identity.getKey() === selectedPoints[selectedIndex].identity.getKey();
                        });

                        if (value != null) {
                            // TODO: Revisit this, we should be able to keep track without modifying Scatter's data points.
                            (<PlayChartDataPoint>value).frameIndex = frameIndex;
                            seriesPoints[selectedIndex].push(value);
                            if (frameIndex === currentFrameIndex)
                                hasBubbleAtCurrentFrame[selectedIndex] = true;
                        }
                    }
                }

                let xScale = scatterViewModel.xAxisProperties.scale;
                let yScale = scatterViewModel.yAxisProperties.scale;

                let line = d3.svg.line()
                    .x((d: ScatterChartDataPoint) => xScale(d.x))
                    .y((d: ScatterChartDataPoint) => yScale(d.y))
                    .defined((d: ScatterChartDataPoint) => d.x !== null && d.y !== null);

                // Render Lines
                let traceLines = this.element.selectAll(ScatterTraceLineRenderer.TraceLine.selector)
                    .data(selectedPoints, (sp: ScatterChartDataPoint) => sp.identity.getKey());

                traceLines.enter()
                    .append('path')
                    .classed(ScatterTraceLineRenderer.TraceLine.class, true);

                // prepare array of new/previous lengths
                // NOTE: can't use lambda because we need the "this" context to be the DOM Element associated with the .each()
                let previousLengths: number[] = [], newLengths: number[] = [];
                let reverse = false;
                traceLines.each(function (d, i) {
                    let existingPath = (<SVGPathElement>this);
                    let previousLength = existingPath.hasAttribute('d') ? existingPath.getTotalLength() : 0;
                    previousLengths.push(previousLength);
                    // create offline SVG for new path measurement
                    let tempSvgPath = $('<svg><path></path></svg>');
                    let tempPath = $('path', tempSvgPath);
                    tempPath.attr('d', line(seriesPoints[i]));
                    let newLength = seriesPoints[i].length > 0 ? (<SVGPathElement>tempPath.get()[0]).getTotalLength() : 0;
                    newLengths.push(newLength);

                    reverse = reverse || (newLength < previousLength);
                });

                // animate using stroke-dash* trick
                if (!reverse) {
                    // growing line
                    traceLines
                        .style('stroke', (d: ScatterChartDataPoint) => ScatterChart.getStrokeFill(d, true))
                        .attr({
                            'd': (d, i: number) => {
                                return line(seriesPoints[i]);
                            },
                            'stroke-dasharray': (d, i) => newLengths[i] + " " + newLengths[i],
                            'stroke-dashoffset': (d, i) => newLengths[i] - previousLengths[i],
                        });
                    if (shouldAnimate) {
                        traceLines
                            .transition()
                            .ease('linear')
                            .duration(PlayChart.FrameAnimationDuration)
                            .attr('stroke-dashoffset', 0);
                    }
                    else {
                        traceLines.attr('stroke-dashoffset', 0);
                    }
                }
                else {
                    // shrinking line
                    if (shouldAnimate) {
                        traceLines
                            .transition()
                            .ease('linear')
                            .duration(PlayChart.FrameAnimationDuration)
                            .attr('stroke-dashoffset', (d, i) => previousLengths[i] - newLengths[i])
                            .transition()
                            .ease('linear')
                            .duration(1) // animate the shrink first, then update with new line properties
                            .delay(PlayChart.FrameAnimationDuration)
                            .style('stroke', (d: ScatterChartDataPoint) => ScatterChart.getStrokeFill(d, true))
                            .attr({
                                'd': (d, i) => {
                                    return line(seriesPoints[i]);
                                },
                                'stroke-dasharray': (d, i) => newLengths[i] + " " + newLengths[i],
                                'stroke-dashoffset': 0,
                            });
                    }
                    else {
                        traceLines
                            .style('stroke', (d: ScatterChartDataPoint) => ScatterChart.getStrokeFill(d, true))
                            .attr({
                                'd': (d, i) => {
                                    return line(seriesPoints[i]);
                                },
                                'stroke-dasharray': (d, i) => newLengths[i] + " " + newLengths[i],
                                'stroke-dashoffset': 0,
                            });
                    }
                }

                traceLines.exit()
                    .remove();

                // Render circles
                let circlePoints: ScatterChartDataPoint[] = [];
                for (let selectedIndex = 0; selectedIndex < seriesPoints.length; selectedIndex++) {
                    let points = seriesPoints[selectedIndex];

                    // slice to length-1 because we draw lines to the current bubble but we don't need to draw the current frame's bubble
                    let newPoints = hasBubbleAtCurrentFrame[selectedIndex] ? points.slice(0, points.length - 1) : points;

                    circlePoints = circlePoints.concat(newPoints);
                }

                let circles = this.element.selectAll(ScatterTraceLineRenderer.TraceBubble.selector)
                    .data(circlePoints, (d: ScatterChartDataPoint) => d.identity.getKey() + d.x + d.y + d.size);

                circles.enter()
                    .append('circle')
                    .style('opacity', 0) //fade new bubbles into visibility
                    .classed(ScatterTraceLineRenderer.TraceBubble.class, true);

                circles
                    .attr('cx', (d: ScatterChartDataPoint) => xScale(d.x))
                    .attr('cy', (d: ScatterChartDataPoint) => yScale(d.y))
                    .attr('r', (d: ScatterChartDataPoint) => ScatterChart.getBubbleRadius(d.radius, (<ScatterChartData>viewModel.data.currentViewModel).sizeRange, viewModel.viewport))
                    .style({
                        'stroke-opacity': (d: ScatterChartDataPoint) => ScatterChart.getBubbleOpacity(d, true),
                        'stroke': (d: ScatterChartDataPoint) => ScatterChart.getStrokeFill(d, viewModel.data.currentViewModel.colorBorder),
                        'fill': (d: ScatterChartDataPoint) => d.fill,
                        // vary the opacity along the traceline from 0.20 to 0.80, with 0.85 left for the circle already drawn by scatterChart
                        'fill-opacity': (d: ScatterChartDataPoint) => d.size != null ? 0.20 + ((<PlayChartDataPoint>d).frameIndex / currentFrameIndex) * 0.60 : 0,
                    })
                    .transition()
                    .ease('linear')
                    .duration(PlayChart.FrameAnimationDuration)
                    .style('opacity', 1);

                circles.exit()
                    .transition()
                    .ease('linear')
                    .duration(PlayChart.FrameAnimationDuration)
                    .style('opacity', 0) // fade exiting bubbles out
                    .remove();

                if (this.tooltipsEnabled) {
                    TooltipManager.addTooltip(circles, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo);
                }

                // sort the z-order, smallest size on top
                circles.sort((d1: ScatterChartDataPoint, d2: ScatterChartDataPoint) => { return d2.size - d1.size; });
            }
            else {
                this.remove();
            }
        }
    }
}
