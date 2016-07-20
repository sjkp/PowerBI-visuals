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
    import EnumExtensions = jsCommon.EnumExtensions;
    import DataRoleHelper = powerbi.data.DataRoleHelper;

    export interface ColumnChartConstructorOptions extends CartesianVisualConstructorOptions {
        chartType: ColumnChartType;
        animator: IColumnChartAnimator;
    }

    export interface ColumnChartData extends CartesianData {
        categoryFormatter: IValueFormatter;
        series: ColumnChartSeries[];
        valuesMetadata: DataViewMetadataColumn[];
        legendData: LegendData;
        hasHighlights: boolean;
        categoryMetadata: DataViewMetadataColumn;
        scalarCategoryAxis: boolean;
        labelSettings: VisualDataLabelsSettings;
        axesLabels: ChartAxesLabels;
        hasDynamicSeries: boolean;
        isMultiMeasure: boolean;
        defaultDataPointColor?: string;
        showAllDataPoints?: boolean;
    }

    export interface ColumnChartSeries extends CartesianSeries {
        displayName: string;
        key: string;
        index: number;
        data: ColumnChartDataPoint[];
        identity: SelectionId;
        color: string;
        labelSettings: VisualDataLabelsSettings;
    }

    export interface ColumnChartDataPoint extends CartesianDataPoint, SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        categoryValue: number;
        /** Adjusted for 100% stacked if applicable */
        value: number;
        /** The top (column) or right (bar) of the rectangle, used for positioning stacked rectangles */
        position: number;
        valueAbsolute: number;
        /** Not adjusted for 100% stacked */
        valueOriginal: number;
        seriesIndex: number;
        labelSettings: VisualDataLabelsSettings;
        categoryIndex: number;
        color: string;
        /** The original values from the highlighted rect, used in animations */
        originalValue: number;
        originalPosition: number;
        originalValueAbsolute: number;

        /**
         * True if this data point is a highlighted portion and overflows (whether due to the highlight
         * being greater than original or of a different sign), so it needs to be thinner to accomodate.
         */
        drawThinner?: boolean;
        key: string;
        lastSeries?: boolean;
        chartType: ColumnChartType;
    }

    const flagBar: number = 1 << 1;
    const flagColumn: number = 1 << 2;
    const flagClustered: number = 1 << 3;
    const flagStacked: number = 1 << 4;
    const flagStacked100: number = flagStacked | (1 << 5);

    export enum ColumnChartType {
        clusteredBar = flagBar | flagClustered,
        clusteredColumn = flagColumn | flagClustered,
        hundredPercentStackedBar = flagBar | flagStacked100,
        hundredPercentStackedColumn = flagColumn | flagStacked100,
        stackedBar = flagBar | flagStacked,
        stackedColumn = flagColumn | flagStacked,
    }

    export interface ColumnAxisOptions {
        xScale: D3.Scale.Scale;
        yScale: D3.Scale.Scale;
        seriesOffsetScale?: D3.Scale.Scale;
        columnWidth: number;
        /** Used by clustered only since categoryWidth !== columnWidth */
        categoryWidth?: number;
        isScalar: boolean;
        margin: IMargin;
    }

    export interface IColumnLayout {
        shapeLayout: {
            width: (d: ColumnChartDataPoint) => number;
            x: (d: ColumnChartDataPoint) => number;
            y: (d: ColumnChartDataPoint) => number;
            height: (d: ColumnChartDataPoint) => number;
        };
        shapeLayoutWithoutHighlights: {
            width: (d: ColumnChartDataPoint) => number;
            x: (d: ColumnChartDataPoint) => number;
            y: (d: ColumnChartDataPoint) => number;
            height: (d: ColumnChartDataPoint) => number;
        };
        zeroShapeLayout: {
            width: (d: ColumnChartDataPoint) => number;
            x: (d: ColumnChartDataPoint) => number;
            y: (d: ColumnChartDataPoint) => number;
            height: (d: ColumnChartDataPoint) => number;
        };
    }

    export interface ColumnChartContext {
        height: number;
        width: number;
        duration: number;
        hostService: IVisualHostServices;
        margin: IMargin;
        /** A group for graphics can be placed that won't be clipped to the data area of the chart. */
        unclippedGraphicsContext: D3.Selection;
        /** A SVG for graphics that should be clipped to the data area, e.g. data bars, columns, lines */
        mainGraphicsContext: D3.Selection;
        layout: CategoryLayout;
        animator: IColumnChartAnimator;
        onDragStart?: (datum: ColumnChartDataPoint) => void;
        interactivityService: IInteractivityService;
        viewportHeight: number;
        viewportWidth: number;
        is100Pct: boolean;
        isComboChart: boolean;
    }

    export interface IColumnChartStrategy {
        setData(data: ColumnChartData): void;
        setupVisualProps(columnChartProps: ColumnChartContext): void;
        setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureXDomain?: NumberRange): IAxisProperties;
        setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureYDomain?: NumberRange): IAxisProperties;
        drawColumns(useAnimation: boolean): ColumnChartDrawInfo;
        selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void;
        getClosestColumnIndex(x: number, y: number): number;
    }

    export interface IColumnChartConverterStrategy {
        getLegend(colors: IDataColorPalette, defaultLegendLabelColor: string, defaultColor?: string): LegendSeriesInfo;
        getValueBySeriesAndCategory(series: number, category: number): number;
        getMeasureNameByIndex(series: number, category: number): string;
        hasHighlightValues(series: number): boolean;
        getHighlightBySeriesAndCategory(series: number, category: number): number;
    }

    export interface LegendSeriesInfo {
        legend: LegendData;
        seriesSources: DataViewMetadataColumn[];
        seriesObjects: DataViewObjects[][];
    }

    export interface ColumnChartDrawInfo {
        eventGroup: D3.Selection;
        shapesSelection: D3.Selection;
        viewport: IViewport;
        axisOptions: ColumnAxisOptions;
        labelDataPoints: LabelDataPoint[];
    }
    const RoleNames = {
        category: 'Category',
        series: 'Series',
        y: 'Y',
    };

    /**
     * Renders a stacked and clustered column chart.
     */
    export class ColumnChart implements ICartesianVisual {
        private static ColumnChartClassName = 'columnChart';
        public static clusteredValidLabelPositions: RectLabelPosition[] = [RectLabelPosition.OutsideEnd, RectLabelPosition.InsideEnd, RectLabelPosition.InsideCenter, RectLabelPosition.InsideBase];
        public static stackedValidLabelPositions: RectLabelPosition[] = [RectLabelPosition.InsideCenter, RectLabelPosition.InsideEnd, RectLabelPosition.InsideBase];
        public static SeriesClasses: jsCommon.CssConstants.ClassAndSelector = jsCommon.CssConstants.createClassAndSelector('series');

        private svg: D3.Selection;
        private unclippedGraphicsContext: D3.Selection;
        private mainGraphicsContext: D3.Selection;
        private xAxisProperties: IAxisProperties;
        private yAxisProperties: IAxisProperties;
        private currentViewport: IViewport;
        private data: ColumnChartData;
        private style: IVisualStyle;
        private colors: IDataColorPalette;
        private chartType: ColumnChartType;
        private columnChart: IColumnChartStrategy;
        private hostService: IVisualHostServices;
        private cartesianVisualHost: ICartesianVisualHost;
        private interactivity: InteractivityOptions;
        private margin: IMargin;
        private options: CartesianVisualInitOptions;
        private lastInteractiveSelectedColumnIndex: number;
        private interactivityService: IInteractivityService;
        private dataView: DataView;
        private categoryAxisType: string;
        private animator: IColumnChartAnimator;
        private isScrollable: boolean;
        private tooltipsEnabled: boolean;
        private tooltipBucketEnabled: boolean;
        private element: JQuery;
        private isComboChart: boolean;

        constructor(options: ColumnChartConstructorOptions) {
            debug.assertValue(options, 'options');

            let chartType = options.chartType;
            debug.assertValue(chartType, 'chartType');
            this.chartType = chartType;
            this.categoryAxisType = null;
            this.animator = options.animator;
            this.isScrollable = options.isScrollable;
            this.tooltipsEnabled = options.tooltipsEnabled;
            this.tooltipBucketEnabled = options.tooltipBucketEnabled;
            this.interactivityService = options.interactivityService;
        }

        public static customizeQuery(options: CustomizeQueryOptions): void {
            let dataViewMapping = options.dataViewMappings[0];
            if (!dataViewMapping || !dataViewMapping.categorical || !dataViewMapping.categorical.categories)
                return;

            dataViewMapping.categorical.dataVolume = 4;

            if (CartesianChart.detectScalarMapping(dataViewMapping)) {
                let dataViewCategories = <data.CompiledDataViewRoleForMappingWithReduction>dataViewMapping.categorical.categories;
                dataViewCategories.dataReductionAlgorithm = { sample: {} };

                let values = <data.CompiledDataViewGroupedRoleMapping>dataViewMapping.categorical.values;

                if(values && values.group){
                    values.group.dataReductionAlgorithm = { top: {} };
                }
            }
            else {
                CartesianChart.expandCategoryWindow([dataViewMapping]);
            }
        }

        public static getSortableRoles(options: VisualSortableOptions): string[] {
            let dataViewMapping = options.dataViewMappings[0];
            if (!dataViewMapping || !dataViewMapping.categorical || !dataViewMapping.categorical.categories)
                return null;

            let dataViewCategories = <data.CompiledDataViewRoleForMappingWithReduction>dataViewMapping.categorical.categories;
            let categoryItems = dataViewCategories.for.in.items;
            if (!_.isEmpty(categoryItems)) {
                let categoryType = categoryItems[0].type;

                let objects: DataViewObjects;
                if (dataViewMapping.metadata)
                    objects = dataViewMapping.metadata.objects;

                //TODO: column chart should be sortable by X if it has scalar axis
                // But currenly it doesn't support this. Return 'category' once
                // it is supported.
                if (!CartesianChart.getIsScalar(objects, columnChartProps.categoryAxis.axisType, categoryType)) {
                    return ['Category', 'Y'];
                }
            }

            return null;
        }

        public updateVisualMetadata(x: IAxisProperties, y: IAxisProperties, margin) {
            this.xAxisProperties = x;
            this.yAxisProperties = y;
            this.margin = margin;
        }

        public init(options: CartesianVisualInitOptions) {
            this.svg = options.svg;
            this.svg.classed(ColumnChart.ColumnChartClassName, true);

            this.unclippedGraphicsContext = this.svg.append('g').classed('columnChartUnclippedGraphicsContext', true);
            this.mainGraphicsContext = this.unclippedGraphicsContext.append('svg').classed('mainGraphicsContext', true);
            this.style = options.style;
            this.currentViewport = options.viewport;
            this.hostService = options.host;
            this.interactivity = options.interactivity;
            this.colors = this.style.colorPalette.dataColors;
            this.cartesianVisualHost = options.cartesianHost;
            this.options = options;
            this.isComboChart = ComboChart.isComboChart(options.chartType);
            this.element = options.element;
        }

        private getCategoryLayout(numCategoryValues: number, options: CalculateScaleAndDomainOptions): CategoryLayout {
            let availableWidth: number;
            if (ColumnChart.isBar(this.chartType)) {
                availableWidth = this.currentViewport.height - (this.margin.top + this.margin.bottom);
            }
            else {
                availableWidth = this.currentViewport.width - (this.margin.left + this.margin.right);
            }

            let metaDataColumn = this.data ? this.data.categoryMetadata : undefined;
            let categoryDataType: ValueTypeDescriptor = AxisHelper.getCategoryValueType(metaDataColumn);
            let isScalar = this.data ? this.data.scalarCategoryAxis : false;
            let domain = AxisHelper.createDomain(this.data.series, categoryDataType, isScalar, options.forcedXDomain, options.ensureXDomain);
            return CartesianChart.getLayout(
                this.data,
                {
                    availableWidth: availableWidth,
                    categoryCount: numCategoryValues,
                    domain: domain,
                    isScalar: isScalar,
                    isScrollable: this.isScrollable,
                    trimOrdinalDataOnOverflow: options.trimOrdinalDataOnOverflow
                });
        }

        public static converter(
            dataView: DataView,
            colors: IDataColorPalette,
            is100PercentStacked: boolean = false,
            isScalar: boolean = false,
            dataViewMetadata: DataViewMetadata = null,
            chartType?: ColumnChartType,
            interactivityService?: IInteractivityService,
            tooltipsEnabled: boolean = true,
            tooltipBucketEnabled?: boolean): ColumnChartData {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(colors, 'colors');

            let xAxisCardProperties = CartesianHelper.getCategoryAxisProperties(dataViewMetadata);
            let valueAxisProperties = CartesianHelper.getValueAxisProperties(dataViewMetadata);
            isScalar = CartesianHelper.isScalar(isScalar, xAxisCardProperties);
            let dataViewCat = ColumnUtil.applyUserMinMax(isScalar, dataView.categorical, xAxisCardProperties);

            let converterStrategy = new ColumnChartConverterHelper(dataView);

            let categoryInfo = converterHelper.getPivotedCategories(dataViewCat, columnChartProps.general.formatString);
            let categories = categoryInfo.categories,
                categoryFormatter: IValueFormatter = categoryInfo.categoryFormatter,
                categoryIdentities: DataViewScopeIdentity[] = categoryInfo.categoryIdentities,
                categoryMetadata: DataViewMetadataColumn = dataViewCat && dataViewCat.categories && dataViewCat.categories.length > 0 ? dataViewCat.categories[0].source : undefined;

            let labelSettings: VisualDataLabelsSettings = dataLabelUtils.getDefaultColumnLabelSettings(is100PercentStacked || ColumnChart.isStacked(chartType));
            let defaultLegendLabelColor = LegendData.DefaultLegendLabelFillColor;
            let defaultDataPointColor = undefined;
            let showAllDataPoints = undefined;
            if (dataViewMetadata && dataViewMetadata.objects) {
                let objects = dataViewMetadata.objects;

                defaultDataPointColor = DataViewObjects.getFillColor(objects, columnChartProps.dataPoint.defaultColor);
                showAllDataPoints = DataViewObjects.getValue<boolean>(objects, columnChartProps.dataPoint.showAllDataPoints);
                defaultLegendLabelColor = DataViewObjects.getFillColor(objects, columnChartProps.legend.labelColor, LegendData.DefaultLegendLabelFillColor);

                let labelsObj = <DataLabelObject>objects['labels'];
                dataLabelUtils.updateLabelSettingsFromLabelsObject(labelsObj, labelSettings);
            }

            // Allocate colors
            let legendAndSeriesInfo = converterStrategy.getLegend(colors, defaultLegendLabelColor, defaultDataPointColor);
            let legend: LegendDataPoint[] = legendAndSeriesInfo.legend.dataPoints;
            let seriesSources: DataViewMetadataColumn[] = legendAndSeriesInfo.seriesSources;

            // Determine data points
            let result = ColumnChart.createDataPoints(
                dataView,
                categories,
                categoryIdentities,
                legend,
                legendAndSeriesInfo.seriesObjects,
                converterStrategy,
                labelSettings,
                is100PercentStacked,
                isScalar,
                converterHelper.categoryIsAlsoSeriesRole(dataView, RoleNames.series, RoleNames.category),
                categoryInfo.categoryObjects,
                defaultDataPointColor,
                chartType,
                categoryMetadata,
                tooltipsEnabled,
                tooltipBucketEnabled);
            let columnSeries: ColumnChartSeries[] = result.series;

            let valuesMetadata: DataViewMetadataColumn[] = [];
            for (let j = 0, jlen = legend.length; j < jlen; j++) {
                valuesMetadata.push(seriesSources[j]);
            }

            let labels = converterHelper.createAxesLabels(xAxisCardProperties, valueAxisProperties, categoryMetadata, valuesMetadata);

            if (!ColumnChart.isColumn(chartType)) {
                // Replace between x and y axes
                let temp = labels.xAxisLabel;
                labels.xAxisLabel = labels.yAxisLabel;
                labels.yAxisLabel = temp;
            }

            if (interactivityService) {
                for (let series of columnSeries) {
                    interactivityService.applySelectionStateToData(series.data);
                }

                interactivityService.applySelectionStateToData(legendAndSeriesInfo.legend.dataPoints);
            }

            return {
                categories: categories,
                categoryFormatter: categoryFormatter,
                series: columnSeries,
                valuesMetadata: valuesMetadata,
                legendData: legendAndSeriesInfo.legend,
                hasHighlights: result.hasHighlights,
                categoryMetadata: categoryMetadata,
                scalarCategoryAxis: isScalar,
                labelSettings: labelSettings,
                axesLabels: { x: labels.xAxisLabel, y: labels.yAxisLabel },
                hasDynamicSeries: result.hasDynamicSeries,
                isMultiMeasure: result.isMultiMeasure,
                defaultDataPointColor: defaultDataPointColor,
                showAllDataPoints: showAllDataPoints,
            };
        }

        private static canSupportOverflow(chartType: ColumnChartType, seriesCount: number): boolean {
            return !ColumnChart.isStacked(chartType) || seriesCount === 1;
        }

        private static createDataPoints(
            dataView: DataView,
            categories: any[],
            categoryIdentities: DataViewScopeIdentity[],
            legend: LegendDataPoint[],
            seriesObjectsList: DataViewObjects[][],
            converterStrategy: ColumnChartConverterHelper,
            defaultLabelSettings: VisualDataLabelsSettings,
            is100PercentStacked: boolean = false,
            isScalar: boolean = false,
            isCategoryAlsoSeries?: boolean,
            categoryObjectsList?: DataViewObjects[],
            defaultDataPointColor?: string,
            chartType?: ColumnChartType,
            categoryMetadata?: DataViewMetadataColumn,
            tooltipsEnabled?: boolean,
            tooltipBucketEnabled?: boolean): { series: ColumnChartSeries[]; hasHighlights: boolean; hasDynamicSeries: boolean; isMultiMeasure: boolean } {
            let dataViewCat = dataView.categorical;

            let reader = powerbi.data.createIDataViewCategoricalReader(dataView);
            let grouped = dataViewCat && dataViewCat.values ? dataViewCat.values.grouped() : undefined;
            let categoryCount = categories.length;
            let seriesCount = reader.hasValues('Y') ? reader.getSeriesCount('Y') : undefined;
            let columnSeries: ColumnChartSeries[] = [];

            if (seriesCount < 1 || categoryCount < 1)
                return { series: columnSeries, hasHighlights: false, hasDynamicSeries: false, isMultiMeasure: false };

            let dvCategories = dataViewCat.categories;
            categoryMetadata = !_.isEmpty(dvCategories) ? dvCategories[0].source : null;
            let categoryType = AxisHelper.getCategoryValueType(categoryMetadata);
            let isDateTime = AxisHelper.isDateTime(categoryType);
            let baseValuesPos = [], baseValuesNeg = [];

            let rawValues: number[][] = [];
            let rawHighlightValues: number[][] = [];

            let hasDynamicSeries = !!(dataViewCat.values && dataViewCat.values.source);
            let isMultiMeasure = !hasDynamicSeries && seriesCount > 1;

            let highlightsOverflow = false; // Overflow means the highlight larger than value or the signs being different
            let hasHighlights = converterStrategy.hasHighlightValues(0);
            for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
                let seriesValues = [];
                let seriesHighlightValues = [];
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let value = converterStrategy.getValueBySeriesAndCategory(seriesIndex, categoryIndex);
                    seriesValues[categoryIndex] = value;
                    if (hasHighlights) {
                        let highlightValue = converterStrategy.getHighlightBySeriesAndCategory(seriesIndex, categoryIndex);
                        seriesHighlightValues[categoryIndex] = highlightValue;
                        // There are two cases where we don't use overflow logic; if all are false, use overflow logic appropriate for the chart.
                        if (!((value >= 0 && highlightValue >= 0 && value >= highlightValue) || // Both positive; value greater than highlight
                            (value <= 0 && highlightValue <= 0 && value <= highlightValue))) { // Both negative; value less than highlight
                            highlightsOverflow = true;
                        }
                    }
                }
                rawValues.push(seriesValues);
                if (hasHighlights) {
                    rawHighlightValues.push(seriesHighlightValues);
                }
            }

            if (highlightsOverflow && !ColumnChart.canSupportOverflow(chartType, seriesCount)) {
                highlightsOverflow = false;
                hasHighlights = false;
                rawValues = rawHighlightValues;
            }

            let dataPointObjects: DataViewObjects[] = categoryObjectsList,
                formatStringProp = columnChartProps.general.formatString;
            for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
                let seriesDataPoints: ColumnChartDataPoint[] = [],
                    legendItem = legend[seriesIndex],
                    seriesLabelSettings: VisualDataLabelsSettings;

                if (!hasDynamicSeries) {
                    let labelsSeriesGroup = !_.isEmpty(grouped) && grouped[0].values ? grouped[0].values[seriesIndex] : null;
                    let labelObjects = (labelsSeriesGroup && labelsSeriesGroup.source && labelsSeriesGroup.source.objects) ? <DataLabelObject>labelsSeriesGroup.source.objects['labels'] : null;
                    if (labelObjects) {
                        seriesLabelSettings = Prototype.inherit(defaultLabelSettings);
                        dataLabelUtils.updateLabelSettingsFromLabelsObject(labelObjects, seriesLabelSettings);
                    }
                }

                columnSeries.push({
                    displayName: legendItem.label,
                    key: 'series' + seriesIndex,
                    index: seriesIndex,
                    data: seriesDataPoints,
                    identity: legendItem.identity,
                    color: legendItem.color,
                    labelSettings: seriesLabelSettings,
                });

                if (seriesCount > 1)
                    dataPointObjects = seriesObjectsList[seriesIndex];
                let valueColumnMetadata = reader.getValueMetadataColumn('Y', seriesIndex);
                let gradientMeasureIndex: number = GradientUtils.getGradientMeasureIndex(dataViewCat);
                let gradientValueColumn: DataViewValueColumn = GradientUtils.getGradientValueColumn(dataViewCat);
                let valueMeasureIndex: number = DataRoleHelper.getMeasureIndexOfRole(grouped, "Y");
                let pctFormatString = valueFormatter.getLocalizedString('Percentage');

                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    if (seriesIndex === 0) {
                        baseValuesPos.push(0);
                        baseValuesNeg.push(0);
                    }

                    let value = AxisHelper.normalizeNonFiniteNumber(rawValues[seriesIndex][categoryIndex]);
                    if (value == null) {
                        // Optimization: Ignore null dataPoints from the fabricated category/series combination in the self cross-join.
                        // However, we must retain the first series because it is used to compute things like axis scales, and value lookups.
                        if (seriesIndex > 0)
                            continue;
                    }

                    let originalValue: number = value;
                    let categoryValue = categories[categoryIndex];

                    // ignore variant measures
                    if (isDateTime && categoryValue != null && !(categoryValue instanceof Date))
                        continue;

                    if (isDateTime && categoryValue)
                        categoryValue = categoryValue.getTime();
                    if (isScalar && (categoryValue == null || isNaN(categoryValue)))
                        continue;

                    let multipliers: ValueMultiplers;
                    if (is100PercentStacked)
                        multipliers = StackedUtil.getStackedMultiplier(dataViewCat, categoryIndex, seriesCount, categoryCount, converterStrategy);

                    let unadjustedValue = value,
                        isNegative = value < 0;

                    if (multipliers) {
                        if (isNegative)
                            value *= multipliers.neg;
                        else
                            value *= multipliers.pos;
                    }

                    let valueAbsolute = Math.abs(value);
                    let position: number;
                    if (isNegative) {
                        position = baseValuesNeg[categoryIndex];

                        if (!isNaN(valueAbsolute))
                            baseValuesNeg[categoryIndex] -= valueAbsolute;
                    }
                    else {
                        if (!isNaN(valueAbsolute))
                            baseValuesPos[categoryIndex] += valueAbsolute;

                        position = baseValuesPos[categoryIndex];
                    }

                    let seriesGroup = grouped && grouped.length > seriesIndex && grouped[seriesIndex].values ? grouped[seriesIndex].values[valueMeasureIndex] : null;
                    let category = !_.isEmpty(dataViewCat.categories) ? dataViewCat.categories[0] : null;
                    let identity = SelectionIdBuilder.builder()
                        .withCategory(category, categoryIndex)
                        .withSeries(dataViewCat.values, seriesGroup)
                        .withMeasure(converterStrategy.getMeasureNameByIndex(seriesIndex))
                        .createSelectionId();

                    let rawCategoryValue = reader.getCategoryValue('Category', categoryIndex);
                    let color = ColumnChart.getDataPointColor(legendItem, categoryIndex, dataPointObjects);
                    let gradientColumnForTooltip = gradientMeasureIndex === 0 ? null : gradientValueColumn;

                    let valueHighlight: any;
                    let unadjustedValueHighlight: any;
                    let absoluteValueHighlight: number;
                    let highlightValue: string;
                    let highlightPosition: number;
                    let highlightIdentity: SelectionId;
                    if (hasHighlights) {
                        valueHighlight = reader.getHighlight('Y', categoryIndex, seriesIndex);
                        unadjustedValueHighlight = valueHighlight;

                        let highlightedTooltip: boolean = true;
                        if (valueHighlight === null) {
                            valueHighlight = 0;
                            highlightedTooltip = false;
                        }

                        if (is100PercentStacked) {
                            valueHighlight *= multipliers.pos;
                        }
                        absoluteValueHighlight = Math.abs(valueHighlight);
                        highlightPosition = position;

                        if (valueHighlight > 0) {
                            highlightPosition -= valueAbsolute - absoluteValueHighlight;
                        }
                        else if (valueHighlight === 0 && value > 0) {
                            highlightPosition -= valueAbsolute;
                        }

                        highlightIdentity = SelectionId.createWithHighlight(identity);

                        let highlightedValueAndPct: string;
                        let highlightedValueFormat: string;
                        if (highlightedTooltip && unadjustedValueHighlight != null && valueHighlight != null) {
                            let highlightedPct: string = valueFormatter.format(valueHighlight, pctFormatString);
                            highlightedValueFormat = converterHelper.formatFromMetadataColumn(unadjustedValueHighlight, valueColumnMetadata, formatStringProp);
                            highlightedValueAndPct = highlightedValueFormat + ' (' + highlightedPct + ')';
                        }
                        if (is100PercentStacked) {
                            highlightValue = highlightedValueAndPct;
                        }
                        else {
                            highlightValue = highlightedValueFormat;
                        }
                    }

                    let tooltipInfo: TooltipDataItem[];

                    if (tooltipsEnabled) {
                        tooltipInfo = [];
                        if (category) {
                            tooltipInfo.push({
                                displayName: reader.getCategoryDisplayName('Category'),
                                value: converterHelper.formatFromMetadataColumn(rawCategoryValue, category.source, formatStringProp),
                            });
                        }

                        if (hasDynamicSeries) {
                            if (!category || category.source !== dataViewCat.values.source) {
                                // Category/series on the same column -- don't repeat its value in the tooltip.
                                tooltipInfo.push({
                                    displayName: dataViewCat.values.source.displayName,
                                    value: converterHelper.formatFromMetadataColumn(grouped[seriesIndex].name, dataViewCat.values.source, formatStringProp),
                                });
                            }
                        }

                        if (originalValue != null) {
                            let valueString: string;
                            let formattedOriginalValue = converterHelper.formatFromMetadataColumn(originalValue, valueColumnMetadata, formatStringProp);
                            if (is100PercentStacked) {
                                let originalPct: string = valueFormatter.format(valueAbsolute, pctFormatString);
                                valueString = formattedOriginalValue + ' (' + originalPct + ')';
                            }
                            else {
                                valueString = formattedOriginalValue;
                            }
                            tooltipInfo.push({
                                displayName: valueColumnMetadata.displayName,
                                value: valueString,
                            });
                        }

                        if (highlightValue != null) {
                            tooltipInfo.push({
                                displayName: ToolTipComponent.localizationOptions.highlightedValueDisplayName,
                                value: highlightValue,
                            });
                        }

                        if (gradientColumnForTooltip && gradientColumnForTooltip.values[categoryIndex] != null) {
                            tooltipInfo.push({
                                displayName: gradientColumnForTooltip.source.displayName,
                                value: converterHelper.formatFromMetadataColumn(gradientColumnForTooltip.values[categoryIndex], gradientColumnForTooltip.source, formatStringProp),
                            });
                        }

                        if (tooltipBucketEnabled) {
                            TooltipBuilder.addTooltipBucketItem(reader, tooltipInfo, categoryIndex, hasDynamicSeries ? seriesIndex : undefined);
                        }
                    }

                    let series = columnSeries[seriesIndex];
                    let dataPointLabelSettings = (series.labelSettings) ? series.labelSettings : defaultLabelSettings;
                    let labelColor = dataPointLabelSettings.labelColor;
                    let lastValue = undefined;
                    //Stacked column/bar label color is white by default (except last series)
                    if ((ColumnChart.isStacked(chartType))) {
                        lastValue = this.getStackedLabelColor(isNegative, seriesIndex, seriesCount, categoryIndex, rawValues);
                        labelColor = (lastValue || (seriesIndex === seriesCount - 1 && !isNegative)) ? labelColor : dataLabelUtils.defaultInsideLabelColor;
                    }

                    let dataPoint: ColumnChartDataPoint = {
                        categoryValue: categoryValue,
                        value: value,
                        position: position,
                        valueAbsolute: valueAbsolute,
                        valueOriginal: unadjustedValue,
                        seriesIndex: seriesIndex,
                        labelSettings: dataPointLabelSettings,
                        categoryIndex: categoryIndex,
                        color: color,
                        selected: false,
                        originalValue: value,
                        originalPosition: position,
                        originalValueAbsolute: valueAbsolute,
                        identity: identity,
                        key: identity.getKey(),
                        tooltipInfo: tooltipInfo,
                        labelFill: labelColor,
                        labelFormatString: valueColumnMetadata.format,
                        lastSeries: lastValue,
                        chartType: chartType
                    };

                    seriesDataPoints.push(dataPoint);

                    if (hasHighlights) {
                        let highlightDataPoint: ColumnChartDataPoint = {
                            categoryValue: categoryValue,
                            value: valueHighlight,
                            position: highlightPosition,
                            valueAbsolute: absoluteValueHighlight,
                            valueOriginal: unadjustedValueHighlight,
                            seriesIndex: seriesIndex,
                            labelSettings: dataPointLabelSettings,
                            categoryIndex: categoryIndex,
                            color: color,
                            selected: false,
                            highlight: true,
                            originalValue: value,
                            originalPosition: position,
                            originalValueAbsolute: valueAbsolute,
                            drawThinner: highlightsOverflow,
                            identity: highlightIdentity,
                            key: highlightIdentity.getKey(),
                            tooltipInfo: tooltipInfo,
                            labelFormatString: valueColumnMetadata.format,
                            labelFill: labelColor,
                            lastSeries: lastValue,
                            chartType: chartType
                        };

                        seriesDataPoints.push(highlightDataPoint);
                    }
                }
            }

            return {
                series: columnSeries,
                hasHighlights: hasHighlights,
                hasDynamicSeries: hasDynamicSeries,
                isMultiMeasure: isMultiMeasure,
            };
        }

        private static getDataPointColor(
            legendItem: LegendDataPoint,
            categoryIndex: number,
            dataPointObjects?: DataViewObjects[]): string {
            debug.assertValue(legendItem, 'legendItem');
            debug.assertValue(categoryIndex, 'categoryIndex');
            debug.assertAnyValue(dataPointObjects, 'dataPointObjects');

            if (dataPointObjects) {
                let colorOverride = DataViewObjects.getFillColor(dataPointObjects[categoryIndex], columnChartProps.dataPoint.fill);
                if (colorOverride)
                    return colorOverride;
            }

            return legendItem.color;
        }

        private static getStackedLabelColor(isNegative: boolean, seriesIndex: number, seriesCount: number, categoryIndex: number, rawValues: number[][]): boolean {
            let lastValue = !(isNegative && seriesIndex === seriesCount - 1 && seriesCount !== 1);
            //run for the next series and check if current series is last
            for (let i = seriesIndex + 1; i < seriesCount; i++) {
                let nextValues = AxisHelper.normalizeNonFiniteNumber(rawValues[i][categoryIndex]);
                if ((nextValues !== null) && (((!isNegative || (isNegative && seriesIndex === 0)) && nextValues > 0) || (isNegative && seriesIndex !== 0))) {
                    lastValue = false;
                    break;
                }
            }
            return lastValue;
        }

        public static sliceSeries(series: ColumnChartSeries[], endIndex: number, startIndex: number = 0): ColumnChartSeries[] {
            let newSeries: ColumnChartSeries[] = [];
            if (series && series.length > 0) {
                for (let i = 0, len = series.length; i < len; i++) {
                    let iNewSeries = newSeries[i] = Prototype.inherit(series[i]);
                    // TODO: [investigate] possible perf improvement.
                    // if data[n].categoryIndex > endIndex implies data[n+1].categoryIndex > endIndex
                    // then we could short circuit the filter loop.
                    iNewSeries.data = series[i].data.filter(d => d.categoryIndex >= startIndex && d.categoryIndex < endIndex);
                }
            }
            return newSeries;
        }

        public static getInteractiveColumnChartDomElement(element: JQuery): HTMLElement {
            return element.children("svg").get(0);
        }

        public setData(dataViews: DataView[]): void {
            debug.assertValue(dataViews, "dataViews");
            let is100PctStacked = ColumnChart.isStacked100(this.chartType);
            this.data = {
                categories: [],
                categoryFormatter: null,
                series: [],
                valuesMetadata: [],
                legendData: null,
                hasHighlights: false,
                categoryMetadata: null,
                scalarCategoryAxis: false,
                labelSettings: dataLabelUtils.getDefaultColumnLabelSettings(is100PctStacked || ColumnChart.isStacked(this.chartType)),
                axesLabels: { x: null, y: null },
                hasDynamicSeries: false,
                defaultDataPointColor: null,
                isMultiMeasure: false,
            };

            if (dataViews.length > 0) {
                let dataView = this.dataView = dataViews[0];

                if (dataView && dataView.categorical) {
                    let dvCategories = dataView.categorical.categories;
                    let categoryMetadata = (dvCategories && dvCategories.length > 0)
                        ? dvCategories[0].source
                        : null;
                    let categoryType = AxisHelper.getCategoryValueType(categoryMetadata);

                    this.data = ColumnChart.converter(
                        dataView,
                        this.cartesianVisualHost.getSharedColors(),
                        is100PctStacked,
                        CartesianChart.getIsScalar(dataView.metadata ? dataView.metadata.objects : null, columnChartProps.categoryAxis.axisType, categoryType),
                        dataView.metadata,
                        this.chartType,
                        this.interactivityService,
                        this.tooltipsEnabled,
                        this.tooltipBucketEnabled);
                }
            }

            this.setChartStrategy();
        }

        private setChartStrategy(): void {
            switch (this.chartType) {
                case ColumnChartType.clusteredBar:
                    this.columnChart = new ClusteredBarChartStrategy();
                    break;
                case ColumnChartType.clusteredColumn:
                    this.columnChart = new ClusteredColumnChartStrategy();
                    break;
                case ColumnChartType.stackedBar:
                case ColumnChartType.hundredPercentStackedBar:
                    this.columnChart = new StackedBarChartStrategy();
                    break;
                case ColumnChartType.stackedColumn:
                case ColumnChartType.hundredPercentStackedColumn:
                default:
                    this.columnChart = new StackedColumnChartStrategy();
                    break;
            }

            // For single series, render stacked as a clustered
            if (ColumnChart.isStacked(this.chartType) && this.data.series.length === 1) {
                switch (this.chartType) {
                    case (ColumnChartType.stackedBar):
                        this.columnChart = new ClusteredBarChartStrategy();
                        break;
                    case (ColumnChartType.stackedColumn):
                        this.columnChart = new ClusteredColumnChartStrategy();
                        break;
                }
            }
        }

        public calculateLegend(): LegendData {
            // if we're in interactive mode, return the interactive legend
            if (this.interactivity && this.interactivity.isInteractiveLegend) {
                return this.createInteractiveLegendDataPoints(0);
            }
            let legendData = this.data ? this.data.legendData : null;
            let legendDataPoints = legendData ? legendData.dataPoints : [];

            if (_.isEmpty(legendDataPoints))
                return null;

            return legendData;
        }

        public hasLegend(): boolean {
            return this.data && (this.data.hasDynamicSeries || (this.data.series && this.data.series.length > 1));
        }

        public enumerateObjectInstances(enumeration: ObjectEnumerationBuilder, options: EnumerateVisualObjectInstancesOptions): void {
            switch (options.objectName) {
                case 'dataPoint':
                    if (this.dataView && !GradientUtils.hasGradientRole(this.dataView.categorical))
                        this.enumerateDataPoints(enumeration);
                    break;
                case 'labels':
                    this.enumerateDataLabels(enumeration);
                    break;
            }
        }

        private enumerateDataLabels(enumeration: ObjectEnumerationBuilder): void {
            let data = this.data,
                labelSettings = this.data.labelSettings,
                seriesCount = data.series.length,
                showLabelPerSeries = !data.hasDynamicSeries && (seriesCount > 1 || !data.categoryMetadata);

            //Draw default settings
            dataLabelUtils.enumerateDataLabels(this.getLabelSettingsOptions(enumeration, labelSettings, null, showLabelPerSeries));

            if (seriesCount === 0)
                return;

            //Draw series settings
            if (showLabelPerSeries && labelSettings.showLabelPerSeries) {
                for (let i = 0; i < seriesCount; i++) {
                    let series = data.series[i],
                        labelSettings: VisualDataLabelsSettings = (series.labelSettings) ? series.labelSettings : this.data.labelSettings;

                    enumeration.pushContainer({ displayName: series.displayName });
                    dataLabelUtils.enumerateDataLabels(this.getLabelSettingsOptions(enumeration, labelSettings, series));
                    enumeration.popContainer();
                }
            }
        }

        private getLabelSettingsOptions(enumeration: ObjectEnumerationBuilder, labelSettings: VisualDataLabelsSettings, series?: ColumnChartSeries, showAll?: boolean): VisualDataLabelsSettingsOptions {
            return {
                enumeration: enumeration,
                dataLabelsSettings: labelSettings,
                show: true,
                displayUnits: !ColumnChart.isStacked100(this.chartType),
                precision: true,
                selector: series && series.identity ? series.identity.getSelector() : null,
                showAll: showAll,
                fontSize: true,
            };
        }

        private enumerateDataPoints(enumeration: ObjectEnumerationBuilder): void {
            let data = this.data;
            if (!data)
                return;

            let seriesCount = data.series.length;

            if (seriesCount === 0)
                return;

            if (data.hasDynamicSeries || seriesCount > 1 || !data.categoryMetadata) {
                for (let i = 0; i < seriesCount; i++) {
                    let series = data.series[i];
                    enumeration.pushInstance({
                        objectName: 'dataPoint',
                        displayName: series.displayName,
                        selector: ColorHelper.normalizeSelector(series.identity.getSelector()),
                        properties: {
                            fill: { solid: { color: series.color } }
                        },
                    });
                }
            }
            else {
                // For single-category, single-measure column charts, the user can color the individual bars.
                let singleSeriesData = data.series[0].data;
                let categoryFormatter = data.categoryFormatter;

                // Add default color and show all slices
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

                if (data.showAllDataPoints) {
                    for (let i = 0; i < singleSeriesData.length; i++) {
                        let singleSeriesDataPoints = singleSeriesData[i],
                            categoryValue: any = data.categories[i];
                        enumeration.pushInstance({
                            objectName: 'dataPoint',
                            displayName: categoryFormatter ? categoryFormatter.format(categoryValue) : categoryValue,
                            selector: ColorHelper.normalizeSelector(singleSeriesDataPoints.identity.getSelector(), /*isSingleSeries*/true),
                            properties: {
                                fill: { solid: { color: singleSeriesDataPoints.color } }
                            },
                        });
                    }
                }
            }
        }

        public calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[] {
            let data = this.data;
            this.currentViewport = options.viewport;
            let margin = this.margin = options.margin;

            let origCatgSize = (data && data.categories) ? data.categories.length : 0;
            let chartLayout: CategoryLayout = data ? this.getCategoryLayout(origCatgSize, options) : {
                categoryCount: 0,
                categoryThickness: CartesianChart.MinOrdinalRectThickness,
                outerPaddingRatio: CartesianChart.OuterPaddingRatio,
                isScalar: false
            };
            this.categoryAxisType = chartLayout.isScalar ? axisType.scalar : null;

            if (data && !chartLayout.isScalar && !this.isScrollable && options.trimOrdinalDataOnOverflow) {
                // trim data that doesn't fit on dashboard
                let catgSize = Math.min(origCatgSize, chartLayout.categoryCount);
                if (catgSize !== origCatgSize) {
                    data = Prototype.inherit(data);
                    data.series = ColumnChart.sliceSeries(data.series, catgSize);
                    data.categories = data.categories.slice(0, catgSize);
                }
            }
            this.columnChart.setData(data);

            let preferredPlotArea = this.getPreferredPlotArea(chartLayout.isScalar, chartLayout.categoryCount, chartLayout.categoryThickness);
            let is100Pct = ColumnChart.isStacked100(this.chartType);

            let chartContext: ColumnChartContext = {
                height: preferredPlotArea.height,
                width: preferredPlotArea.width,
                duration: 0,
                hostService: this.hostService,
                unclippedGraphicsContext: this.unclippedGraphicsContext,
                mainGraphicsContext: this.mainGraphicsContext,
                margin: this.margin,
                layout: chartLayout,
                animator: this.animator,
                interactivityService: this.interactivityService,
                viewportHeight: this.currentViewport.height - (margin.top + margin.bottom),
                viewportWidth: this.currentViewport.width - (margin.left + margin.right),
                is100Pct: is100Pct,
                isComboChart: this.isComboChart,
            };
            this.ApplyInteractivity(chartContext);
            this.columnChart.setupVisualProps(chartContext);

            let ensureXDomain: NumberRange;
            let ensureYDomain: NumberRange;

            let isBarChart = ColumnChart.isBar(this.chartType);

            if (isBarChart) {
                let temp = options.forcedXDomain;
                options.forcedXDomain = options.forcedYDomain;
                options.forcedYDomain = temp;

                // In the case of clustered and stacked bar charts, the y1 reference line is a vertical line
                ensureXDomain = options.ensureYDomain;
            }
            else {
                ensureYDomain = options.ensureYDomain;
            }

            this.xAxisProperties = this.columnChart.setXScale(
                is100Pct,
                options.forcedTickCount,
                options.forcedXDomain,
                isBarChart ? options.valueAxisScaleType : options.categoryAxisScaleType,
                isBarChart ? options.valueAxisDisplayUnits : options.categoryAxisDisplayUnits,
                isBarChart ? options.valueAxisPrecision : options.categoryAxisPrecision,
                ensureXDomain);

            this.yAxisProperties = this.columnChart.setYScale(
                is100Pct,
                options.forcedTickCount,
                options.forcedYDomain,
                isBarChart ? options.categoryAxisScaleType : options.valueAxisScaleType,
                isBarChart ? options.categoryAxisDisplayUnits : options.valueAxisDisplayUnits,
                isBarChart ? options.categoryAxisPrecision : options.valueAxisPrecision,
                ensureYDomain);

            if (options.showCategoryAxisLabel && this.xAxisProperties.isCategoryAxis || options.showValueAxisLabel && !this.xAxisProperties.isCategoryAxis) {
                this.xAxisProperties.axisLabel = data.axesLabels.x;
            }
            else {
                this.xAxisProperties.axisLabel = null;
            }
            if (options.showValueAxisLabel && !this.yAxisProperties.isCategoryAxis || options.showCategoryAxisLabel && this.yAxisProperties.isCategoryAxis) {
                this.yAxisProperties.axisLabel = data.axesLabels.y;
            }
            else {
                this.yAxisProperties.axisLabel = null;
            }

            return [this.xAxisProperties, this.yAxisProperties];
        }

        public getPreferredPlotArea(isScalar: boolean, categoryCount: number, categoryThickness: number): IViewport {
            let plotArea: IViewport = {
                height: this.currentViewport.height - this.margin.top - this.margin.bottom,
                width: this.currentViewport.width - this.margin.left - this.margin.right
            };

            if (this.isScrollable && !isScalar) {
                let preferredCategorySpan = CartesianChart.getPreferredCategorySpan(categoryCount, categoryThickness);
                if (ColumnChart.isBar(this.chartType)) {
                    plotArea.height = Math.max(preferredCategorySpan, plotArea.height);
                }
                else
                    plotArea.width = Math.max(preferredCategorySpan, plotArea.width);
            }
            return plotArea;
        }

        private ApplyInteractivity(chartContext: ColumnChartContext): void {
            let interactivity = this.interactivity;
            if (interactivity) {
                if (interactivity.dragDataPoint) {
                    chartContext.onDragStart = (datum: ColumnChartDataPoint) => {
                        if (!datum.identity)
                            return;

                        this.hostService.onDragStart({
                            event: <any>d3.event,
                            data: {
                                data: datum.identity.getSelector()
                            }
                        });
                    };
                }

                if (interactivity.isInteractiveLegend) {
                    let dragMove = () => {
                        let mousePoint = d3.mouse(this.mainGraphicsContext[0][0]); // get the x and y for the column area itself
                        let x: number = mousePoint[0];
                        let y: number = mousePoint[1];
                        let index: number = this.columnChart.getClosestColumnIndex(x, y);
                        this.selectColumn(index);
                    };

                    let ColumnChartSvg: EventTarget = ColumnChart.getInteractiveColumnChartDomElement(this.element);

                    //set click interaction on the visual
                    this.svg.on('click', dragMove);
                    //set click interaction on the background
                    d3.select(ColumnChartSvg)
                        .on('click', dragMove)
                        .style('touch-action', 'none');
                    let drag = d3.behavior.drag()
                        .origin(Object)
                        .on("drag", dragMove);
                    //set drag interaction on the visual
                    this.svg.call(drag);
                    //set drag interaction on the background
                    d3.select(ColumnChartSvg).call(drag);
                }
            }
        }

        private selectColumn(indexOfColumnSelected: number, force: boolean = false): void {
            if (!force && this.lastInteractiveSelectedColumnIndex === indexOfColumnSelected) return; // same column, nothing to do here

            let legendData: LegendData = this.createInteractiveLegendDataPoints(indexOfColumnSelected);
            let legendDataPoints: LegendDataPoint[] = legendData.dataPoints;
            this.cartesianVisualHost.updateLegend(legendData);
            if (legendDataPoints.length > 0) {
                this.columnChart.selectColumn(indexOfColumnSelected, this.lastInteractiveSelectedColumnIndex);
            }
            this.lastInteractiveSelectedColumnIndex = indexOfColumnSelected;
        }

        private createInteractiveLegendDataPoints(columnIndex: number): LegendData {
            let data = this.data;
            if (!data || _.isEmpty(data.series))
                return { dataPoints: [] };

            let formatStringProp = columnChartProps.general.formatString;
            let legendDataPoints: LegendDataPoint[] = [];
            let category = data.categories && data.categories[columnIndex];
            let allSeries = data.series;
            let dataPoints = data.legendData && data.legendData.dataPoints;
            let converterStrategy = new ColumnChartConverterHelper(this.dataView);

            for (let i = 0, len = allSeries.length; i < len; i++) {
                let measure = converterStrategy.getValueBySeriesAndCategory(i, columnIndex);
                let valueMetadata = data.valuesMetadata[i];
                let formattedLabel = converterHelper.getFormattedLegendLabel(valueMetadata, this.dataView.categorical.values, formatStringProp);
                let dataPointColor: string;
                if (allSeries.length === 1) {
                    let series = allSeries[0];
                    dataPointColor = series.data.length > columnIndex && series.data[columnIndex].color;
                } else {
                    dataPointColor = dataPoints.length > i && dataPoints[i].color;
                }

                legendDataPoints.push({
                    color: dataPointColor,
                    icon: LegendIcon.Box,
                    label: formattedLabel,
                    category: data.categoryFormatter ? data.categoryFormatter.format(category) : category,
                    measure: valueFormatter.format(measure, valueFormatter.getFormatString(valueMetadata, formatStringProp)),
                    identity: SelectionId.createNull(),
                    selected: false
                });
            }

            return { dataPoints: legendDataPoints };
        }

        public overrideXScale(xProperties: IAxisProperties): void {
            this.xAxisProperties = xProperties;
        }

        public render(suppressAnimations: boolean): CartesianVisualRenderResult {
            let columnChartDrawInfo = this.columnChart.drawColumns(!suppressAnimations /* useAnimations */);
            let data = this.data;

            let margin = this.margin;
            let viewport = this.currentViewport;
            let height = viewport.height - (margin.top + margin.bottom);
            let width = viewport.width - (margin.left + margin.right);

            this.mainGraphicsContext
                .attr('height', height)
                .attr('width', width);

            if (this.tooltipsEnabled)
                TooltipManager.addTooltip(columnChartDrawInfo.eventGroup, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo);

            let allDataPoints: ColumnChartDataPoint[] = [];
            let behaviorOptions: ColumnBehaviorOptions = undefined;
            if (this.interactivityService) {
                for (let i = 0, ilen = data.series.length; i < ilen; i++) {
                    allDataPoints = allDataPoints.concat(data.series[i].data);
                }
                behaviorOptions = {
                    datapoints: allDataPoints,
                    eventGroup: columnChartDrawInfo.eventGroup,
                    bars: columnChartDrawInfo.shapesSelection,
                    hasHighlights: data.hasHighlights,
                    mainGraphicsContext: this.mainGraphicsContext,
                    viewport: columnChartDrawInfo.viewport,
                    axisOptions: columnChartDrawInfo.axisOptions,
                    showLabel: data.labelSettings.show
                };
            }

            if (this.interactivity && this.interactivity.isInteractiveLegend) {
                if (this.data.series.length > 0) {
                    this.selectColumn(CartesianHelper.findMaxCategoryIndex(this.data.series), true); // start with the last column
                }
            }
            SVGUtil.flushAllD3TransitionsIfNeeded(this.options);
            return { dataPoints: allDataPoints, behaviorOptions: behaviorOptions, labelDataPoints: columnChartDrawInfo.labelDataPoints, labelsAreNumeric: true };
        }

        public onClearSelection(): void {
            if (this.interactivityService) {
                this.interactivityService.clearSelection();
            }
        }

        public getVisualCategoryAxisIsScalar(): boolean {
            return this.data ? this.data.scalarCategoryAxis : false;
        }

        public getSupportedCategoryAxisType(): string {
            let metaDataColumn = this.data ? this.data.categoryMetadata : undefined;
            let valueType = AxisHelper.getCategoryValueType(metaDataColumn);
            let isOrdinal = AxisHelper.isOrdinal(valueType);
            return isOrdinal ? axisType.categorical : axisType.both;
        }

        public setFilteredData(startIndex: number, endIndex: number): CartesianData {
            let data = Prototype.inherit(this.data);
            data.series = ColumnChart.sliceSeries(data.series, endIndex, startIndex);
            data.categories = data.categories.slice(startIndex, endIndex);
            this.columnChart.setData(data);
            return data;
        }

        public static getLabelFill(labelColor: string, isInside: boolean, isCombo: boolean): string {
            if (labelColor) {
                return labelColor;
            }
            if (isInside && !isCombo) {
                return NewDataLabelUtils.defaultInsideLabelColor;
            }
            return NewDataLabelUtils.defaultLabelColor;
        }

        public supportsTrendLine(): boolean {
            let dataView = this.dataView;
            let reader = powerbi.data.createIDataViewCategoricalReader(dataView);
            let isScalar = this.data ? this.data.scalarCategoryAxis : false;
            return this.chartType === ColumnChartType.clusteredColumn && isScalar && reader.hasValues("Y");
        }

        public static isBar(chartType: ColumnChartType): boolean {
            return EnumExtensions.hasFlag(chartType, flagBar);
        }

        public static isColumn(chartType: ColumnChartType): boolean {
            return EnumExtensions.hasFlag(chartType, flagColumn);
        }

        public static isClustered(chartType: ColumnChartType): boolean {
            return EnumExtensions.hasFlag(chartType, flagClustered);
        }

        public static isStacked(chartType: ColumnChartType): boolean {
            return EnumExtensions.hasFlag(chartType, flagStacked);
        }

        public static isStacked100(chartType: ColumnChartType): boolean {
            return EnumExtensions.hasFlag(chartType, flagStacked100);
        }
    }

    class ColumnChartConverterHelper implements IColumnChartConverterStrategy {
        private dataView: DataViewCategorical;
        private reader: powerbi.data.IDataViewCategoricalReader;

        constructor(dataView: DataView) {
            this.dataView = dataView && dataView.categorical;
            this.reader = powerbi.data.createIDataViewCategoricalReader(dataView);
        }

        public getLegend(colors: IDataColorPalette, defaultLegendLabelColor: string, defaultColor?: string): LegendSeriesInfo {
            let legend: LegendDataPoint[] = [];
            let seriesSources: DataViewMetadataColumn[] = [];
            let seriesObjects: DataViewObjects[][] = [];
            let grouped: boolean = false;
            let reader = this.reader;

            let colorHelper = new ColorHelper(colors, columnChartProps.dataPoint.fill, defaultColor);
            let legendTitle = undefined;
            if (this.dataView && this.dataView.values) {
                let allValues = this.dataView.values;
                let valueGroups = allValues.grouped();

                let hasDynamicSeries = !!(allValues && allValues.source);

                let formatStringProp = columnChartProps.general.formatString;
                for (let valueGroupsIndex = 0, valueGroupsLen = valueGroups.length; valueGroupsIndex < valueGroupsLen; valueGroupsIndex++) {
                    let valueGroup = valueGroups[valueGroupsIndex],
                        valueGroupObjects = valueGroup.objects,
                        values = valueGroup.values;

                    for (let valueIndex = 0, valuesLen = values.length; valueIndex < valuesLen; valueIndex++) {
                        let series = values[valueIndex];
                        let source = series.source;
                        // Gradient and tooltips measures do not create series.
                        if ((DataRoleHelper.hasRole(source, 'Gradient') || DataRoleHelper.hasRole(source, 'Tooltips')) && !DataRoleHelper.hasRole(source, 'Y'))
                            continue;

                        seriesSources.push(source);
                        seriesObjects.push(series.objects);

                        let selectionIdBuilder = new SelectionIdBuilder();
                        selectionIdBuilder = selectionIdBuilder.withMeasure(this.getMeasureNameByIndex(valueIndex));
                        if (reader.hasDynamicSeries()) {
                            selectionIdBuilder = selectionIdBuilder.withSeries(reader.getSeriesValueColumns(), reader.getSeriesValueColumnGroup(valueGroupsIndex));
                        }

                        let selectionId = selectionIdBuilder.createSelectionId();

                        let label = converterHelper.getFormattedLegendLabel(source, allValues, formatStringProp);

                        let color = hasDynamicSeries
                            ? colorHelper.getColorForSeriesValue(valueGroupObjects, allValues.identityFields, source.groupName)
                            : colorHelper.getColorForMeasure(source.objects, source.queryName);

                        legend.push({
                            icon: LegendIcon.Box,
                            color: color,
                            label: label,
                            identity: selectionId,
                            selected: false,
                        });

                        if (series.identity && source.groupName !== undefined) {
                            grouped = true;
                        }
                    }
                }

                let dvValues = this.dataView.values;
                legendTitle = dvValues && dvValues.source ? dvValues.source.displayName : "";
            }

            let legendData: LegendData = {
                title: legendTitle,
                dataPoints: legend,
                grouped: grouped,
                labelColor: defaultLegendLabelColor,
            };

            return {
                legend: legendData,
                seriesSources: seriesSources,
                seriesObjects: seriesObjects,
            };
        }

        public getValueBySeriesAndCategory(series: number, category: number): number {
            return this.reader.getValue('Y', category, series);
        }

        public getMeasureNameByIndex(index: number): string {
            return this.dataView.values[index].source.queryName;
        }

        public hasHighlightValues(series: number): boolean {
            let column = this.dataView && this.dataView.values ? this.dataView.values[series] : undefined;
            return column && !!column.highlights;
        }

        public getHighlightBySeriesAndCategory(series: number, category: number): number {
            return this.dataView.values[series].highlights[category];
        }
    }
}
