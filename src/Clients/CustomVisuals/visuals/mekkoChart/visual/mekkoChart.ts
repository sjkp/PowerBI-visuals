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

/// <reference path="../../../_references.ts"/>

module powerbi.visuals.samples {
    import EnumExtensions = jsCommon.EnumExtensions;
    import PixelConverter = jsCommon.PixelConverter;
    import ArrayExtensions = jsCommon.ArrayExtensions;
    import WordBreaker = jsCommon.WordBreaker;
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
    import NewDataLabelUtils = powerbi.visuals.NewDataLabelUtils;
    import IViewport = powerbi.IViewport;
    import IRect = powerbi.visuals.IRect;
    import SelectableDataPoint = powerbi.visuals.SelectableDataPoint;
    import NumberRange = powerbi.NumberRange;
    import IGenericAnimator = powerbi.visuals.IGenericAnimator;
    import IInteractiveBehavior = powerbi.visuals.IInteractiveBehavior;
    import TooltipEnabledDataPoint = powerbi.visuals.TooltipEnabledDataPoint;
    import LabelEnabledDataPoint = powerbi.visuals.LabelEnabledDataPoint;
    import IMargin = powerbi.visuals.IMargin;
    import Fill = powerbi.Fill;
    import LegendDataPoint = powerbi.visuals.LegendDataPoint;
    import CreateAxisOptions = powerbi.visuals.CreateAxisOptions;
    import DataViewObjectPropertyIdentifier = powerbi.DataViewObjectPropertyIdentifier;
    import IAnimator = powerbi.visuals.IAnimator;
    import IAnimatorOptions = powerbi.visuals.IAnimatorOptions;
    import IAnimationOptions = powerbi.visuals.IAnimationOptions;
    import IInteractivityService = powerbi.visuals.IInteractivityService;
    import IVisualHostServices = powerbi.IVisualHostServices;
    import ValueType = powerbi.ValueType;
    import AxisHelper = powerbi.visuals.AxisHelper;
    import IAxisProperties = powerbi.visuals.IAxisProperties;
    import IValueFormatter = powerbi.visuals.IValueFormatter;
    import valueFormatter = powerbi.visuals.valueFormatter;
    import Double = powerbi.Double;
    import DataViewPropertyValue = powerbi.DataViewPropertyValue;
    import IAnimationResult = powerbi.visuals.IAnimationResult;
    import TextProperties = powerbi.TextProperties;
    import TextMeasurementService = powerbi.TextMeasurementService;
    import IVisual = powerbi.IVisual;
    import VisualCapabilities = powerbi.VisualCapabilities;
    import VisualDataRoleKind = powerbi.VisualDataRoleKind;
    import createDisplayNameGetter = powerbi.data.createDisplayNameGetter;
    import ILegend = powerbi.visuals.ILegend;
    import LegendData = powerbi.visuals.LegendData;
    import VisualInitOptions = powerbi.VisualInitOptions;
    import DataViewObject = powerbi.DataViewObject;
    import IColorScale = powerbi.IColorScale;
    import IColorInfo = powerbi.IColorInfo;
    import InteractivityUtils = powerbi.visuals.InteractivityUtils;
    import yAxisPosition = powerbi.visuals.yAxisPosition;
    import appendClearCatcher = powerbi.visuals.appendClearCatcher;
    import createInteractivityService = powerbi.visuals.createInteractivityService;
    import createLegend = powerbi.visuals.createLegend;
    import SVGUtil = powerbi.visuals.SVGUtil;
    import DataViewObjects = powerbi.DataViewObjects;
    import axisType = powerbi.visuals.axisType;
    import DataView = powerbi.DataView;
    import VisualUpdateOptions = powerbi.VisualUpdateOptions;
    import getInvalidValueWarnings = powerbi.visuals.getInvalidValueWarnings;
    import VisualDataLabelsSettings = powerbi.visuals.VisualDataLabelsSettings;
    import dataLabelUtils = powerbi.visuals.dataLabelUtils;
    import DataLabelObject = powerbi.visuals.DataLabelObject;
    import ObjectEnumerationBuilder = powerbi.visuals.ObjectEnumerationBuilder;
    import VisualObjectInstance = powerbi.VisualObjectInstance;
    import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
    import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
    import legendProps = powerbi.visuals.legendProps;
    import LegendPosition = powerbi.visuals.LegendPosition;
    import axisScale = powerbi.visuals.axisScale;
    import axisStyle = powerbi.visuals.axisStyle;
    import Prototype = powerbi.Prototype;
    import GetAnimationDuration = powerbi.visuals.AnimatorCommon.GetAnimationDuration;
    import DataLabelLayoutOptions = powerbi.DataLabelLayoutOptions;
    import LabelLayout = powerbi.LabelLayout;
    import Label = powerbi.Label;
    import ITextAsSVGMeasurer = powerbi.ITextAsSVGMeasurer;
    import TickLabelMargins = powerbi.visuals.TickLabelMargins;
    import IVisualStyle = powerbi.IVisualStyle;
    import IDataColorPalette = powerbi.IDataColorPalette;
    import InteractivityOptions = powerbi.InteractivityOptions;
    import LabelDataPoint = powerbi.LabelDataPoint;
    import DataViewCategorical = powerbi.DataViewCategorical;
    import DataViewMetadata = powerbi.DataViewMetadata;
    import converterHelper = powerbi.visuals.converterHelper;
    import DataViewScopeIdentity = powerbi.DataViewScopeIdentity;
    import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
    import ValueMultiplers = powerbi.visuals.ValueMultiplers;
    import DataViewValueColumnGroup = powerbi.DataViewValueColumnGroup;
    import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
    import SelectionIdBuilder = powerbi.visuals.SelectionIdBuilder;
    import TooltipSeriesDataItem = powerbi.visuals.TooltipSeriesDataItem;
    import DataViewValueColumn = powerbi.DataViewValueColumn;
    import TooltipDataItem = powerbi.visuals.TooltipDataItem;
    import TooltipBuilder = powerbi.visuals.TooltipBuilder;
    import SelectionId = powerbi.visuals.SelectionId;
    import GradientUtils = powerbi.visuals.GradientUtils;
    import VisualDataLabelsSettingsOptions = powerbi.visuals.VisualDataLabelsSettingsOptions;
    import ColorHelper = powerbi.visuals.ColorHelper;
    import LegendIcon = powerbi.visuals.LegendIcon;
    import TooltipManager = powerbi.visuals.TooltipManager;
    import TooltipEvent = powerbi.visuals.TooltipEvent;
    import LegendSeriesInfo = powerbi.visuals.LegendSeriesInfo;
    import DataViewValueColumns = powerbi.DataViewValueColumns;
    import ISelectionHandler = powerbi.visuals.ISelectionHandler;

    var flagBar: number = 1 << 1;
    var flagColumn: number = 1 << 2;
    var flagClustered: number = 1 << 3;
    var flagStacked: number = 1 << 4;
    var flagStacked100: number = flagStacked | (1 << 5);

    export enum MekkoVisualChartType {
        clusteredBar = flagBar | flagClustered,
        clusteredColumn = flagColumn | flagClustered,
        hundredPercentStackedBar = flagBar | flagStacked100,
        hundredPercentStackedColumn = flagColumn | flagStacked100,
        stackedBar = flagBar | flagStacked,
        stackedColumn = flagColumn | flagStacked,
    }

    export enum MekkoChartType {
        HundredPercentStackedColumn,
    }

    export interface IMekkoChartVisualHost {
        updateLegend(data: LegendData): void;
        getSharedColors(): IDataColorPalette;
        triggerRender(suppressAnimations: boolean): void;
    }

    export interface MekkoChartAnimationOptions extends IAnimationOptions {
        viewModel: MekkoChartData;
        series: D3.UpdateSelection;
        layout: IMekkoChartLayout;
        itemCS: ClassAndSelector;
        mainGraphicsContext: D3.Selection;
        viewPort: IViewport;
    }

    export interface MekkoChartAnimationResult extends IAnimationResult {
        shapes: D3.UpdateSelection;
    }

    export type IMekkoChartAnimator = IAnimator<IAnimatorOptions, MekkoChartAnimationOptions, MekkoChartAnimationResult>;

    export interface MekkoChartAxisOptions {
        xScale: D3.Scale.Scale;
        yScale: D3.Scale.Scale;
        seriesOffsetScale?: D3.Scale.Scale;
        columnWidth: number;
        /** Used by clustered only since categoryWidth !== columnWidth */
        categoryWidth?: number;
        isScalar: boolean;
        margin: IMargin;
    }

    export interface MekkoChartDataPoint {
        categoryValue: any;
        value: number;
        categoryIndex: number;
        seriesIndex: number;
        highlight?: boolean;
    }

    export interface MekkoChartBaseSeries {
        data: MekkoChartDataPoint[];
    }

    export interface MekkoChartBaseData {
        series: MekkoChartBaseSeries[];
        categoryMetadata: DataViewMetadataColumn;
        categories: any[];
        hasHighlights?: boolean;
    }

    export interface MekkoChartAxesLabels {
        x: string;
        y: string;
        y2?: string;
    }

    export interface MekkoChartAxisProperties {
        x: IAxisProperties;
        y1: IAxisProperties;
        y2?: IAxisProperties;
    }

    export interface MekkoChartCategoryLayoutOptions {
        availableWidth: number;
        categoryCount: number;
        domain: any;
        trimOrdinalDataOnOverflow: boolean;
        isScalar?: boolean;
        isScrollable?: boolean;
    }

    export interface MekkoChartColumnDataPoint extends
        MekkoChartDataPoint, SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {

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
        chartType: MekkoVisualChartType;
    }

    export interface MekkoChartSeries extends MekkoChartBaseSeries {
        displayName: string;
        key: string;
        index: number;
        data: MekkoChartColumnDataPoint[];
        identity: SelectionId;
        color: string;
        labelSettings: VisualDataLabelsSettings;
    }

    export interface MekkoChartData extends MekkoChartBaseData {
        categoryFormatter: IValueFormatter;
        series: MekkoChartSeries[];
        valuesMetadata: DataViewMetadataColumn[];
        legendData: LegendData;
        hasHighlights: boolean;
        categoryMetadata: DataViewMetadataColumn;
        scalarCategoryAxis: boolean;
        labelSettings: VisualDataLabelsSettings;
        axesLabels: MekkoChartAxesLabels;
        hasDynamicSeries: boolean;
        isMultiMeasure: boolean;
        defaultDataPointColor?: string;
        showAllDataPoints?: boolean;
    }

    export interface MekkoChartSmallViewPortProperties {
        hideLegendOnSmallViewPort: boolean;
        hideAxesOnSmallViewPort: boolean;
        MinHeightLegendVisible: number;
        MinHeightAxesVisible: number;
    }

    export interface MekkoLabelDataPointsGroup/* extends LabelDataPointsGroup */ {
        labelDataPoints: MekkoLabelDataPoint[];
        maxNumberOfLabels: number;
    }

    export interface MekkoLabelDataPoint extends LabelDataPoint {
        isParentRect?: boolean;
    }

    export interface MekkoChartVisualInitOptions extends VisualInitOptions {
        svg: D3.Selection;
        cartesianHost: IMekkoChartVisualHost;
        labelsContext?: D3.Selection; //TEMPORARY - for PlayAxis
    }

    export interface IMekkoChartLayout {
        shapeLayout: {
            width: (d: MekkoChartColumnDataPoint) => number;
            x: (d: MekkoChartColumnDataPoint) => number;
            y: (d: MekkoChartColumnDataPoint) => number;
            height: (d: MekkoChartColumnDataPoint) => number;
        };
        shapeLayoutWithoutHighlights: {
            width: (d: MekkoChartColumnDataPoint) => number;
            x: (d: MekkoChartColumnDataPoint) => number;
            y: (d: MekkoChartColumnDataPoint) => number;
            height: (d: MekkoChartColumnDataPoint) => number;
        };
        zeroShapeLayout: {
            width: (d: MekkoChartColumnDataPoint) => number;
            x: (d: MekkoChartColumnDataPoint) => number;
            y: (d: MekkoChartColumnDataPoint) => number;
            height: (d: MekkoChartColumnDataPoint) => number;
        };
    }

    export interface MekkoVisualRenderResult {
        dataPoints: SelectableDataPoint[];
        behaviorOptions: any;
        labelDataPoints: LabelDataPoint[];
        labelsAreNumeric: boolean;
        labelDataPointGroups?: MekkoLabelDataPointsGroup[];
    }

    export interface MekkoCalculateScaleAndDomainOptions {
        viewport: IViewport;
        margin: IMargin;
        showCategoryAxisLabel: boolean;
        showValueAxisLabel: boolean;
        forceMerge: boolean;
        categoryAxisScaleType: string;
        valueAxisScaleType: string;
        trimOrdinalDataOnOverflow: boolean;
        // optional
        playAxisControlLayout?: IRect;
        forcedTickCount?: number;
        forcedYDomain?: any[];
        forcedXDomain?: any[];
        ensureXDomain?: NumberRange;
        ensureYDomain?: NumberRange;
        categoryAxisDisplayUnits?: number;
        categoryAxisPrecision?: number;
        valueAxisDisplayUnits?: number;
        valueAxisPrecision?: number;
    }

    export interface MekkoConstructorOptions {
        chartType: MekkoChartType;
        isScrollable?: boolean;
        animator?: IGenericAnimator;
        cartesianSmallViewPortProperties?: MekkoChartSmallViewPortProperties;
        behavior?: IInteractiveBehavior;
    }

    export interface MekkoColumnChartData extends MekkoChartData {
        borderSettings: MekkoBorderSettings;
        categoriesWidth: number[];
    }

    export interface MekkoBorderSettings {
        show: boolean;
        color: any;
        width: number;
        maxWidth?: number;
    }

    export interface MekkoLabelSettings {
        maxPrecision: number;
        minPrecision: number;
    }

    export interface MekkoColumnAxisOptions extends MekkoChartAxisOptions { }

    export interface IMekkoColumnLayout extends IMekkoChartLayout {
        shapeBorder?: {
            width: (d: MekkoChartColumnDataPoint) => number;
            x: (d: MekkoChartColumnDataPoint) => number;
            y: (d: MekkoChartColumnDataPoint) => number;
            height: (d: MekkoChartColumnDataPoint) => number;
        };
        shapeXAxis?: {
            width: (d: MekkoChartColumnDataPoint) => number;
            x: (d: MekkoChartColumnDataPoint) => number;
            y: (d: MekkoChartColumnDataPoint) => number;
            height: (d: MekkoChartColumnDataPoint) => number;
        };
    }

    export interface MekkoAxisRenderingOptions {
        axisLabels: MekkoChartAxesLabels;
        legendMargin: number;
        viewport: IViewport;
        margin: IMargin;
        hideXAxisTitle: boolean;
        hideYAxisTitle: boolean;
        hideY2AxisTitle?: boolean;
        xLabelColor?: Fill;
        yLabelColor?: Fill;
        y2LabelColor?: Fill;
    }

    export interface MekkoDataPoints {
        categoriesWidth: number[];
        series: MekkoChartSeries[];
        hasHighlights: boolean;
        hasDynamicSeries: boolean;
    }

    export interface MekkoLegendDataPoint extends LegendDataPoint {
        fontSize?: number;
    }

    export interface MekkoCreateAxisOptions extends CreateAxisOptions {
        formatString: string;
        is100Pct?: boolean;
        shouldClamp?: boolean;
        formatStringProp?: DataViewObjectPropertyIdentifier;
    }

    export interface MekkoChartCategoryLayout {
        categoryCount: number;
        categoryThickness: number;
        outerPaddingRatio: number;
        isScalar?: boolean;
    }

    export interface MekkoChartContext {
        height: number;
        width: number;
        duration: number;
        hostService: IVisualHostServices;
        margin: IMargin;
        /** A group for graphics can be placed that won't be clipped to the data area of the chart. */
        unclippedGraphicsContext: D3.Selection;
        /** A SVG for graphics that should be clipped to the data area, e.g. data bars, columns, lines */
        mainGraphicsContext: D3.Selection;
        layout: MekkoChartCategoryLayout;
        animator: IMekkoChartAnimator;
        onDragStart?: (datum: MekkoChartColumnDataPoint) => void;
        interactivityService: IInteractivityService;
        viewportHeight: number;
        viewportWidth: number;
        is100Pct: boolean;
        isComboChart: boolean;
    }

    export interface MekkoColumnChartContext extends MekkoChartContext {
        height: number;
        width: number;
        duration: number;
        margin: IMargin;
        mainGraphicsContext: D3.Selection;
        labelGraphicsContext: D3.Selection;
        layout: MekkoChartCategoryLayout;
        animator: IMekkoChartAnimator;
        onDragStart?: (datum: MekkoChartColumnDataPoint) => void;
        interactivityService: IInteractivityService;
        viewportHeight: number;
        viewportWidth: number;
        is100Pct: boolean;
        hostService: IVisualHostServices;
        isComboChart: boolean;
    }

    export interface MekkoChartConstructorBaseOptions {
        isScrollable: boolean;
        interactivityService?: IInteractivityService;
        animator?: IGenericAnimator;
        isLabelInteractivityEnabled?: boolean;
        tooltipsEnabled?: boolean;
        tooltipBucketEnabled?: boolean;
        cartesianLoadMoreEnabled?: boolean;
        advancedLineLabelsEnabled?: boolean;
    }

    export interface MekkoChartConstructorOptions extends MekkoChartConstructorBaseOptions {
        chartType: MekkoVisualChartType;
        animator: IMekkoChartAnimator;
    }

    export interface MekkoChartDrawInfo {
        eventGroup?: D3.Selection;
        shapesSelection: D3.Selection;
        viewport: IViewport;
        axisOptions: MekkoChartAxisOptions;
        labelDataPoints: LabelDataPoint[];
    }

    export interface IMekkoChartStrategy {
        setData(data: MekkoChartData): void;
        setupVisualProps(columnChartProps: MekkoChartContext): void;
        setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureXDomain?: NumberRange): IAxisProperties;
        setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureYDomain?: NumberRange): IAxisProperties;
        drawColumns(useAnimation: boolean): MekkoChartDrawInfo;
        selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void;
        getClosestColumnIndex(x: number, y: number): number;
    }

    export interface IMekkoChartConverterStrategy {
        getLegend(colors: IDataColorPalette, defaultLegendLabelColor: string, defaultColor?: string): LegendSeriesInfo;
        getValueBySeriesAndCategory(series: number, category: number): number;
        getMeasureNameByIndex(series: number, category: number): string;
        hasHighlightValues(series: number): boolean;
        getHighlightBySeriesAndCategory(series: number, category: number): number;
    }

    export interface MekkoChartProperty {
        [propertyName: string]: DataViewObjectPropertyIdentifier;
    }

    export interface MekkoChartProperties {
        [propertyName: string]: MekkoChartProperty;
    }

    export interface MekkoChartClasses {
        [className: string]: ClassAndSelector;
    }

    export class MekkoDataWrapper {
        private data: MekkoChartBaseData;
        private isScalar: boolean;

        public constructor(columnChartData: MekkoChartBaseData, isScalar: boolean) {
            this.data = columnChartData;
            this.isScalar = isScalar;
        }

        public lookupXValue(index: number, type: ValueType): any {
            debug.assertValue(this.data, 'this.data');

            var isDateTime: boolean = AxisHelper.isDateTime(type);
            if (isDateTime && this.isScalar) {
                return new Date(index);
            }

            var data = this.data;
            if (type.text) {
                debug.assert(index < data.categories.length, 'category index out of range');
                return data.categories[index];
            }
            else {
                var firstSeries = data.series[0];
                if (firstSeries) {
                    var seriesValues = firstSeries.data;
                    if (seriesValues) {
                        if (this.data.hasHighlights) {
                            index = index * 2;
                        }
                        var dataPoint = seriesValues[index];
                        if (dataPoint) {
                            if (isDateTime) {
                                return new Date(dataPoint.categoryValue);
                            }
                            return dataPoint.categoryValue;
                        }
                    }
                }
            }

            return index;
        }
    }

    export class MekkoChartStrategy implements IMekkoChartStrategy {
        private static Classes: MekkoChartClasses = {
            item: createClassAndSelector('column'),
            highlightItem: createClassAndSelector('highlightColumn')
        };

        private layout: IMekkoColumnLayout;
        private data: MekkoColumnChartData;
        private graphicsContext: MekkoColumnChartContext;
        private width: number;
        private height: number;
        private margin: IMargin;
        private xProps: IAxisProperties;
        private yProps: IAxisProperties;
        private categoryLayout: MekkoChartCategoryLayout;
        private columnsCenters: number[];
        private columnSelectionLineHandle: D3.Selection;
        private animator: IMekkoChartAnimator;
        private interactivityService: IInteractivityService;
        private viewportHeight: number;
        private viewportWidth: number;

        private static validLabelPositions = [1];

        public setupVisualProps(columnChartProps: MekkoColumnChartContext): void {
            this.graphicsContext = columnChartProps;
            this.margin = columnChartProps.margin;
            this.width = this.graphicsContext.width;
            this.height = this.graphicsContext.height;
            this.categoryLayout = columnChartProps.layout;
            this.animator = columnChartProps.animator;
            this.interactivityService = columnChartProps.interactivityService;
            this.viewportHeight = columnChartProps.viewportHeight;
            this.viewportWidth = columnChartProps.viewportWidth;
        }

        public setData(data: MekkoColumnChartData) {
            this.data = data;
        }

        private static createFormatter(
            scaleDomain: any[],
            dataDomain: any[],
            dataType,
            isScalar: boolean,
            formatString: string,
            bestTickCount: number,
            tickValues: any[],
            getValueFn: any,
            useTickIntervalForDisplayUnits: boolean = false): IValueFormatter {

            var formatter: IValueFormatter;
            if (dataType.dateTime) {
                if (isScalar) {
                    var value = new Date(scaleDomain[0]);
                    var value2 = new Date(scaleDomain[1]);
                    // datetime with only one value needs to pass the same value
                    // (from the original dataDomain value, not the adjusted scaleDomain)
                    // so formatting works correctly.
                    if (bestTickCount === 1)
                        value = value2 = new Date(dataDomain[0]);
                    formatter = valueFormatter.create({ format: formatString, value: value, value2: value2, tickCount: bestTickCount });
                }
                else {
                    if (getValueFn == null) {
                        debug.assertFail('getValueFn must be supplied for ordinal datetime tickValues');
                    }
                    var minDate: Date = getValueFn(0, dataType);
                    var maxDate: Date = getValueFn(scaleDomain.length - 1, dataType);
                    formatter = valueFormatter.create({ format: formatString, value: minDate, value2: maxDate, tickCount: bestTickCount });
                }
            }
            else {
                if (getValueFn == null && !isScalar) {
                    debug.assertFail('getValueFn must be supplied for ordinal tickValues');
                }
                if (useTickIntervalForDisplayUnits && isScalar && tickValues.length > 1) {
                    var domainMin = tickValues[1] - tickValues[0];
                    var domainMax = 0; //force tickInterval to be used with display units
                    formatter = valueFormatter.create({ format: formatString, value: domainMin, value2: domainMax, allowFormatBeautification: true });
                }
                else {
                    // do not use display units, just the basic value formatter
                    // datetime is handled above, so we are ordinal and either boolean, numeric, or text.
                    formatter = valueFormatter.createDefaultFormatter(formatString, true);
                }
            }

            return formatter;
        }

        /**
         * Format the linear tick labels or the category labels.
         */
        private static formatAxisTickValues(
            axis: D3.Svg.Axis,
            tickValues: any[],
            formatter: IValueFormatter,
            dataType: ValueType,
            isScalar: boolean,
            getValueFn?: (index: number, type: ValueType) => any) {

            var formattedTickValues = [];
            if (formatter) {
                // getValueFn takes an ordinal axis index or builds DateTime from milliseconds, do not pass a numeric scalar value.
                if (getValueFn && !(dataType.numeric && isScalar)) {
                    axis.tickFormat(d => formatter.format(getValueFn(d, dataType)));
                    formattedTickValues = tickValues.map(d => formatter.format(getValueFn(d, dataType)));
                }
                else {
                    axis.tickFormat(d => formatter.format(d));
                    formattedTickValues = tickValues.map((d) => formatter.format(d));
                }
            }
            else {
                formattedTickValues = tickValues.map((d) => getValueFn(d, dataType));
            }

            return formattedTickValues;
        }

        /**
         * Create a D3 axis including scale. Can be vertical or horizontal, and either datetime, numeric, or text.
         * @param options The properties used to create the axis.
         */
        private createAxis(options): IAxisProperties {
            var pixelSpan = options.pixelSpan,
                dataDomain = options.dataDomain,
                metaDataColumn = options.metaDataColumn,
                formatStringProp = options.formatStringProp,
                outerPadding = options.outerPadding || 0,
                isCategoryAxis = !!options.isCategoryAxis,
                isScalar = !!options.isScalar,
                isVertical = !!options.isVertical,
                useTickIntervalForDisplayUnits = !!options.useTickIntervalForDisplayUnits, // DEPRECATE: same meaning as isScalar?
                getValueFn = options.getValueFn,
                categoryThickness = options.categoryThickness;

            var formatString = valueFormatter.getFormatString(metaDataColumn, formatStringProp);
            var dataType: ValueType = AxisHelper.getCategoryValueType(metaDataColumn, isScalar);
            var isLogScaleAllowed = AxisHelper.isLogScalePossible(dataDomain, dataType);

            var scale = d3.scale.linear();
            var scaleDomain = [0, 1];
            var bestTickCount = dataDomain.length || 1;

            var borderWidth: number = MekkoColumnChart.getBorderWidth(options.borderSettings);
            var chartWidth = pixelSpan - borderWidth * (bestTickCount - 1);

            if (chartWidth < MekkoChart.MinOrdinalRectThickness) {
                chartWidth = MekkoChart.MinOrdinalRectThickness;
            }

            scale.domain(scaleDomain)
                .range([0, chartWidth]);
            var tickValues = dataDomain;

            var formatter = MekkoChartStrategy.createFormatter(
                scaleDomain,
                dataDomain,
                dataType,
                isScalar,
                formatString,
                bestTickCount,
                tickValues,
                getValueFn,
                useTickIntervalForDisplayUnits);

            // sets default orientation only, cartesianChart will fix y2 for comboChart
            // tickSize(pixelSpan) is used to create gridLines
            var axis = d3.svg.axis()
                .scale(scale)
                .tickSize(6, 0)
                .orient(isVertical ? 'left' : 'bottom')
                .ticks(bestTickCount)
                .tickValues(dataDomain);

            var formattedTickValues = [];
            if (metaDataColumn) {
                formattedTickValues = MekkoChartStrategy.formatAxisTickValues(axis, tickValues, formatter, dataType, isScalar, getValueFn);
            }

            var xLabelMaxWidth;
            // Use category layout of labels if specified, otherwise use scalar layout of labels
            if (!isScalar && categoryThickness) {
                xLabelMaxWidth = Math.max(1, categoryThickness - MekkoChart.TickLabelPadding * 2);
            }
            else {
                // When there are 0 or 1 ticks, then xLabelMaxWidth = pixelSpan
                // When there is > 1 ticks then we need to +1 so that their widths don't overlap
                // Example: 2 ticks are drawn at 33.33% and 66.66%, their width needs to be 33.33% so they don't overlap.
                var labelAreaCount = tickValues.length > 1 ? tickValues.length + 1 : tickValues.length;
                xLabelMaxWidth = labelAreaCount > 1 ? pixelSpan / labelAreaCount : pixelSpan;
                xLabelMaxWidth = Math.max(1, xLabelMaxWidth - MekkoChart.TickLabelPadding * 2);
            }

            return {
                scale: scale,
                axis: axis,
                formatter: formatter,
                values: formattedTickValues,
                axisType: dataType,
                axisLabel: null,
                isCategoryAxis: isCategoryAxis,
                xLabelMaxWidth: xLabelMaxWidth,
                categoryThickness: categoryThickness,
                outerPadding: outerPadding,
                usingDefaultDomain: false,//scaleResult.usingDefaultDomain,
                isLogScaleAllowed: isLogScaleAllowed
            };
        }

        private getCategoryAxis(
            data: MekkoColumnChartData,
            size: number,
            layout: MekkoChartCategoryLayout,
            isVertical: boolean,
            forcedXMin?: DataViewPropertyValue,
            forcedXMax?: DataViewPropertyValue,
            axisScaleType?: string): IAxisProperties {

            var categoryThickness = layout.categoryThickness;
            var isScalar: boolean = layout.isScalar;
            var outerPaddingRatio = layout.outerPaddingRatio;
            var dw = new MekkoDataWrapper(data, isScalar);
            var domain: number[] = [];

            if (data.series &&
                (data.series.length > 0) &&
                data.series[0].data &&
                (data.series[0].data.length > 0)
            ) {
                var domainDoubles = data.series[0].data.map((item: MekkoChartColumnDataPoint) => {
                    return item.originalPosition + (item.value / 2);
                });

                domain = domainDoubles.filter(function (item, pos) {
                    return domainDoubles.indexOf(item) === pos;
                });
            }

            var axisProperties: IAxisProperties = this.createAxis({
                pixelSpan: size,
                dataDomain: domain,
                metaDataColumn: data.categoryMetadata,
                formatStringProp: MekkoChart.Properties["general"]["formatString"],
                outerPadding: categoryThickness * outerPaddingRatio,
                isCategoryAxis: true,
                isScalar: isScalar,
                isVertical: isVertical,
                categoryThickness: categoryThickness,
                useTickIntervalForDisplayUnits: true,
                getValueFn: (index, type) => {
                    var domainIndex = domain.indexOf(index);
                    var value = dw.lookupXValue(domainIndex, type);
                    return value;
                },
                scaleType: axisScaleType,
                borderSettings: data.borderSettings
            });
            // intentionally updating the input layout by ref
            layout.categoryThickness = axisProperties.categoryThickness;
            return axisProperties;
        }

        public setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[], axisScaleType?: string): IAxisProperties {
            var width = this.width;
            var forcedXMin, forcedXMax;

            if (forcedXDomain && forcedXDomain.length === 2) {
                forcedXMin = forcedXDomain[0];
                forcedXMax = forcedXDomain[1];
            }

            var props = this.xProps = this.getCategoryAxis(
                this.data,
                width,
                this.categoryLayout,
                false,
                forcedXMin,
                forcedXMax,
                axisScaleType);

            return props;
        }

        public setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[], axisScaleType?: string): IAxisProperties {
            var height = this.viewportHeight;
            var valueDomain = MekkoChartUtils.calcValueDomain(this.data.series, is100Pct);
            var valueDomainArr = [valueDomain.min, valueDomain.max];
            var combinedDomain = AxisHelper.combineDomain(forcedYDomain, valueDomainArr);
            var shouldClamp = AxisHelper.scaleShouldClamp(combinedDomain, valueDomainArr);
            var metadataColumn = this.data.valuesMetadata[0];
            var formatString = is100Pct ?
                this.graphicsContext.hostService.getLocalizedString('Percentage')
                : valueFormatter.getFormatString(metadataColumn, MekkoChart.Properties["general"]["formatString"]);

            var mekkoMekkoCreateAxisOptions: MekkoCreateAxisOptions = {
                pixelSpan: height,
                dataDomain: combinedDomain,
                metaDataColumn: metadataColumn,
                formatString: formatString,
                outerPadding: 0,
                isScalar: true,
                isVertical: true,
                forcedTickCount: forcedTickCount,
                useTickIntervalForDisplayUnits: true,
                isCategoryAxis: false,
                scaleType: axisScaleType,
                axisDisplayUnits: 0,
                axisPrecision: 0,
                is100Pct: is100Pct,
                shouldClamp: shouldClamp,
                formatStringProp: undefined,
            };

            this.yProps = AxisHelper.createAxis(mekkoMekkoCreateAxisOptions);
            return this.yProps;
        }

        public drawColumns(useAnimation: boolean): MekkoChartDrawInfo {
            var data = this.data;
            debug.assertValue(data, 'data should not be null or undefined');
            this.columnsCenters = null; // invalidate the columnsCenters so that will be calculated again

            var axisOptions: MekkoColumnAxisOptions = {
                columnWidth: 0,
                xScale: this.xProps.scale,
                yScale: this.yProps.scale,
                isScalar: this.categoryLayout.isScalar,
                margin: this.margin,
            };
            var stackedColumnLayout = this.layout = MekkoChartStrategy.getLayout(data, axisOptions);
            //var dataLabelSettings = data.labelSettings;
            var labelDataPoints: MekkoLabelDataPoint[] = this.createMekkoLabelDataPoints();
            var result: MekkoChartAnimationResult;
            var shapes: D3.UpdateSelection;
            var series = MekkoChartUtils.drawSeries(data, this.graphicsContext.mainGraphicsContext, axisOptions);
            if (this.animator && useAnimation) {
                result = this.animator.animate({
                    viewModel: data,
                    series: series,
                    layout: stackedColumnLayout,
                    itemCS: MekkoChartStrategy.Classes["item"],
                    interactivityService: this.interactivityService,
                    mainGraphicsContext: this.graphicsContext.mainGraphicsContext,
                    viewPort: { height: this.height, width: this.width },
                });
                shapes = result.shapes;
            }
            if (!this.animator || !useAnimation || result.failed) {
                shapes = MekkoChartStrategy.drawDefaultShapes(data,
                    series,
                    stackedColumnLayout,
                    MekkoChartStrategy.Classes["item"],
                    !this.animator,
                    this.interactivityService && this.interactivityService.hasSelection());
            }

            MekkoChartUtils.applyInteractivity(shapes, this.graphicsContext.onDragStart);

            return {
                shapesSelection: shapes,
                viewport: { height: this.height, width: this.width },
                axisOptions,
                labelDataPoints: labelDataPoints,
            };
        }

        private static drawDefaultShapes(data: MekkoColumnChartData,
            series: D3.UpdateSelection,
            layout: IMekkoColumnLayout,
            itemCS: ClassAndSelector,
            filterZeros: boolean,
            hasSelection: boolean): D3.UpdateSelection {
            // We filter out invisible (0, null, etc.) values from the dataset
            // based on whether animations are enabled or not, Dashboard and
            // Exploration mode, respectively.

            var rectName: string = 'rect';
            filterZeros = false;

            var dataSelector: (d: MekkoChartSeries) => any[];
            if (filterZeros) {
                dataSelector = (d: MekkoChartSeries) => {
                    var filteredData = _.filter(d.data, (datapoint: MekkoChartColumnDataPoint) => !!datapoint.value);
                    return filteredData;
                };
            }
            else {
                dataSelector = (d: MekkoChartSeries) => d.data;
            }

            var shapeSelection = series.selectAll(itemCS.selector);
            var shapes = shapeSelection.data(dataSelector, (d: MekkoChartColumnDataPoint) => d.key);

            shapes.enter()
                .append(rectName)
                .attr("class", (d: MekkoChartColumnDataPoint) => itemCS.class.concat(d.highlight ? " highlight" : ""));

            shapes
                .style("fill", (d: MekkoChartColumnDataPoint) => d.color)
                .style("fill-opacity", (d: MekkoChartColumnDataPoint) => MekkoChartUtils.getFillOpacity(d.selected, d.highlight, hasSelection, data.hasHighlights))
                .attr(layout.shapeLayout);

            shapes
                .exit()
                .remove();

            var borderSelection = series.selectAll(MekkoColumnChart.BorderClass.selector);
            var borders = borderSelection.data(dataSelector, (d: MekkoChartColumnDataPoint) => d.key);

            var borderColor = MekkoColumnChart.getBorderColor(data.borderSettings);

            borders.enter()
                .append(rectName)
                .classed(MekkoColumnChart.BorderClass.class, true);

            borders
                .style("fill", (d: MekkoChartColumnDataPoint) => borderColor)
                .style("fill-opacity", (d: MekkoChartColumnDataPoint) => {
                    return data.hasHighlights
                        ? MekkoChartUtils.DimmedOpacity
                        : MekkoChartUtils.DefaultOpacity;
                })
                .attr(layout.shapeBorder);

            borders
                .exit()
                .remove();

            return shapes;
        }

        public selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void {
            MekkoChartUtils.setChosenColumnOpacity(
                this.graphicsContext.mainGraphicsContext,
                MekkoChartStrategy.Classes["item"].selector,
                selectedColumnIndex,
                lastSelectedColumnIndex);

            this.moveHandle(selectedColumnIndex);
        }

        public getClosestColumnIndex(x: number, y: number): number {
            return MekkoChartUtils.getClosestColumnIndex(x, this.getColumnsCenters());
        }

        /**
         * Get the chart's columns centers (x value).
         */
        private getColumnsCenters(): number[] {
            if (!this.columnsCenters) { // lazy creation
                var categoryWidth: number = this.categoryLayout.categoryThickness * (1 - MekkoChart.InnerPaddingRatio);
                // use the axis scale and first series data to get category centers
                if (this.data.series.length > 0) {
                    var xScaleOffset = 0;
                    if (!this.categoryLayout.isScalar) {
                        xScaleOffset = categoryWidth / 2;
                    }
                    var firstSeries = this.data.series[0];
                    if (firstSeries &&
                        firstSeries.data) {
                        this.columnsCenters = firstSeries.data.map(d => this.xProps.scale(this.categoryLayout.isScalar ? d.categoryValue : d.categoryIndex) + xScaleOffset);
                    }
                }
            }
            return this.columnsCenters;
        }

        private moveHandle(selectedColumnIndex: number) {
            var columnCenters = this.getColumnsCenters();
            var x = columnCenters[selectedColumnIndex];

            if (!this.columnSelectionLineHandle) {
                var handle = this.columnSelectionLineHandle = this.graphicsContext.mainGraphicsContext.append('g');
                handle.append('line')
                    .classed('interactive-hover-line', true)
                    .attr({
                        x1: x,
                        x2: x,
                        y1: 0,
                        y2: this.height,
                    });

                handle.append('circle')
                    .attr({
                        cx: x,
                        cy: this.height,
                        r: '6px',
                    })
                    .classed('drag-handle', true);
            }
            else {
                var handle = this.columnSelectionLineHandle;
                handle.select('line').attr({ x1: x, x2: x });
                handle.select('circle').attr({ cx: x });
            }
        }

        public static getLayout(data: MekkoColumnChartData, axisOptions: MekkoColumnAxisOptions): IMekkoColumnLayout {
            var xScale = axisOptions.xScale;
            var yScale = axisOptions.yScale;
            var scaledY0 = yScale(0);
            var scaledX0 = xScale(0);

            var borderWidth: number = MekkoColumnChart.getBorderWidth(data.borderSettings);

            var columnWidthScale = (d: MekkoChartColumnDataPoint) => {
                var value: number = AxisHelper.diffScaled(xScale, d.value, 0);
                return value;
            };

            var columnStart = (d: MekkoChartColumnDataPoint) => {
                var value: number = scaledX0 +
                    AxisHelper.diffScaled(xScale, d.originalPosition, 0) +
                    borderWidth * d.categoryIndex;
                return value;
            };

            var borderStart = (d: MekkoChartColumnDataPoint) => {
                var value: number = scaledX0 +
                    AxisHelper.diffScaled(xScale, d.originalPosition, 0) +
                    AxisHelper.diffScaled(xScale, d.value, 0) +
                    borderWidth * d.categoryIndex;

                return value;
            };

            return {
                shapeLayout: {
                    width: columnWidthScale,
                    x: columnStart,
                    y: (d: MekkoChartColumnDataPoint) => scaledY0 + AxisHelper.diffScaled(yScale, d.position, 0),
                    height: (d: MekkoChartColumnDataPoint) => MekkoChartUtils.getSize(yScale, d.valueAbsolute)
                },
                shapeBorder: {
                    width: (d: MekkoChartColumnDataPoint) => borderWidth,
                    x: borderStart,
                    y: (d: MekkoChartColumnDataPoint) => scaledY0 + AxisHelper.diffScaled(yScale, d.position, 0),
                    height: (d: MekkoChartColumnDataPoint) => MekkoChartUtils.getSize(yScale, d.valueAbsolute)
                },
                shapeLayoutWithoutHighlights: {
                    width: columnWidthScale,
                    x: columnStart,
                    y: (d: MekkoChartColumnDataPoint) => scaledY0 + AxisHelper.diffScaled(yScale, d.position, 0),
                    height: (d: MekkoChartColumnDataPoint) => MekkoChartUtils.getSize(yScale, d.originalValueAbsolute)
                },
                zeroShapeLayout: {
                    width: columnWidthScale,
                    x: columnStart,
                    y: (d: MekkoChartColumnDataPoint) => scaledY0 + AxisHelper.diffScaled(yScale, d.position, 0) + MekkoChartUtils.getSize(yScale, d.valueAbsolute),
                    height: (d: MekkoChartColumnDataPoint) => 0
                },
                shapeXAxis: {
                    width: columnWidthScale,
                    x: columnStart,
                    y: (d: MekkoChartColumnDataPoint) => scaledY0 + AxisHelper.diffScaled(yScale, d.position, 0),
                    height: (d: MekkoChartColumnDataPoint) => MekkoChartUtils.getSize(yScale, d.valueAbsolute)
                },
            };
        }

        private createMekkoLabelDataPoints(): MekkoLabelDataPoint[] {
            var labelDataPoints: MekkoLabelDataPoint[] = [];
            var data = this.data;
            var series = data.series;
            var formattersCache = NewDataLabelUtils.createColumnFormatterCacheManager();
            var shapeLayout = this.layout.shapeLayout;

            for (var i: number = 0, ilen = series.length; i < ilen; i++) {
                var currentSeries = series[i];
                var labelSettings = currentSeries.labelSettings ? currentSeries.labelSettings : data.labelSettings;

                if (!labelSettings.show) {
                    continue;
                }

                if (!currentSeries.data) {
                    continue;
                }

                var axisFormatter: number = NewDataLabelUtils.getDisplayUnitValueFromAxisFormatter(this.yProps.formatter, labelSettings);

                for (var j: number = 0; j < currentSeries.data.length; j++) {
                    var dataPoint: MekkoChartColumnDataPoint = currentSeries.data[j];
                    if ((data.hasHighlights && !dataPoint.highlight) || dataPoint.value == null) {
                        continue;
                    }

                    // Calculate parent rectangle
                    var parentRect: IRect = {
                        left: shapeLayout.x(dataPoint),
                        top: shapeLayout.y(dataPoint),
                        width: shapeLayout.width(dataPoint),
                        height: shapeLayout.height(dataPoint),
                    };

                    // Calculate label text
                    var formatString = null;
                    var value: number = dataPoint.valueOriginal;

                    if (!labelSettings.displayUnits) {
                        formatString = NewDataLabelUtils.hundredPercentFormat;
                        value = dataPoint.valueAbsolute;
                    }

                    var formatter = formattersCache.getOrCreate(formatString, labelSettings, axisFormatter);
                    var text = NewDataLabelUtils.getLabelFormattedText(formatter.format(value));

                    // Calculate text size
                    var properties: TextProperties = {
                        text: text,
                        fontFamily: NewDataLabelUtils.LabelTextProperties.fontFamily,
                        fontSize: NewDataLabelUtils.LabelTextProperties.fontSize,
                        fontWeight: NewDataLabelUtils.LabelTextProperties.fontWeight,
                    };
                    var textWidth = TextMeasurementService.measureSvgTextWidth(properties);
                    var textHeight = TextMeasurementService.estimateSvgTextHeight(properties);

                    labelDataPoints.push({
                        isPreferred: true,
                        text: text,
                        textSize: {
                            width: textWidth,
                            height: textHeight,
                        },
                        outsideFill: labelSettings.labelColor ? labelSettings.labelColor : NewDataLabelUtils.defaultLabelColor,
                        insideFill: labelSettings.labelColor ? labelSettings.labelColor : NewDataLabelUtils.defaultInsideLabelColor,
                        isParentRect: true,
                        parentShape: {
                            rect: parentRect,
                            orientation: 1,
                            validPositions: MekkoChartStrategy.validLabelPositions,
                        },
                        identity: dataPoint.identity,
                        parentType: 1,//LabelDataPointParentType.Rectangle,
                    });
                }
            }

            return labelDataPoints;
        }
    }

    export interface MekkoChartSettings {
        columnBorder: MekkoBorderSettings;
        labelSettings: MekkoLabelSettings;
    }

    /**
     * Renders a data series as a cartestian visual.
     */
    export class MekkoChart implements IVisual {
        public static Classes: MekkoChartClasses = {
            series: createClassAndSelector('series')
        };

        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: 'Category',
                    kind: VisualDataRoleKind.Grouping,
                    displayName: 'Category',
                }, {
                    name: 'Series',
                    kind: VisualDataRoleKind.Grouping,
                    displayName: 'Series',
                }, {
                    name: 'Y',
                    kind: VisualDataRoleKind.Measure,
                    displayName: 'Y Axis',
                }, {
                    name: 'Width',
                    kind: VisualDataRoleKind.Measure,
                    displayName: 'Axis width',
                }
            ],
            objects: {
                columnBorder: {
                    displayName: 'Column Border',
                    properties: {
                        show: {
                            displayName: createDisplayNameGetter('Visual_Show'),
                            type: { bool: true }
                        },
                        color: {
                            displayName: createDisplayNameGetter('Visual_LabelsFill'),
                            description: createDisplayNameGetter('Visual_LabelsFillDescription'),
                            type: { fill: { solid: { color: true } } }
                        },
                        width: {
                            displayName: 'Width',
                            type: { numeric: true }
                        },
                    },
                },
                labels: {
                    displayName: createDisplayNameGetter('Visual_DataPointsLabels'),
                    description: createDisplayNameGetter('Visual_DataPointsLabelsDescription'),
                    properties: {
                        show: {
                            displayName: createDisplayNameGetter('Visual_Show'),
                            type: { bool: true }
                        },
                        showSeries: {
                            displayName: createDisplayNameGetter('Visual_Show'),
                            type: { bool: true }
                        },
                        color: {
                            displayName: createDisplayNameGetter('Visual_LabelsFill'),
                            description: createDisplayNameGetter('Visual_LabelsFillDescription'),
                            type: { fill: { solid: { color: true } } }
                        },
                        labelDisplayUnits: {
                            displayName: createDisplayNameGetter('Visual_DisplayUnits'),
                            description: createDisplayNameGetter('Visual_DisplayUnitsDescription'),
                            type: { formatting: { labelDisplayUnits: true } },
                            suppressFormatPainterCopy: true
                        },
                        labelPrecision: {
                            displayName: createDisplayNameGetter('Visual_Precision'),
                            description: createDisplayNameGetter('Visual_PrecisionDescription'),
                            placeHolderText: createDisplayNameGetter('Visual_Precision_Auto'),
                            type: { numeric: true },
                            suppressFormatPainterCopy: true
                        },
                        showAll: {
                            displayName: createDisplayNameGetter('Visual_ShowAll'),
                            type: { bool: true }
                        },
                        fontSize: {
                            displayName: createDisplayNameGetter('Visual_TextSize'),
                            type: { formatting: { fontSize: true } }
                        },
                    },
                },
                legend: {
                    displayName: createDisplayNameGetter('Visual_Legend'),
                    properties: {
                        show: {
                            displayName: createDisplayNameGetter('Visual_Show'),
                            type: { bool: true }
                        },
                        position: {
                            displayName: createDisplayNameGetter('Visual_LegendPosition'),
                            type: { formatting: { legendPosition: true } }
                        },
                        showTitle: {
                            displayName: createDisplayNameGetter('Visual_LegendShowTitle'),
                            type: { bool: true }
                        },
                        titleText: {
                            displayName: 'Title text',
                            type: { text: true }
                        },
                        fontSize: {
                            displayName: 'Text size',
                            type: { formatting: { fontSize: true } }
                        },
                    }
                },
                categoryAxis: {
                    displayName: createDisplayNameGetter('Visual_XAxis'),
                    properties: {
                        show: {
                            displayName: createDisplayNameGetter('Visual_Show'),
                            type: { bool: true }
                        },
                        position: {
                            displayName: createDisplayNameGetter('Visual_YAxis_Position'),
                            type: { formatting: { yAxisPosition: true } }
                        },
                        axisScale: {
                            displayName: createDisplayNameGetter('Visual_Axis_Scale'),
                            type: { formatting: { axisScale: true } }
                        },
                        axisType: {
                            displayName: createDisplayNameGetter('Visual_Axis_Type'),
                            type: { formatting: { axisType: true } }
                        },
                        showAxisTitle: {
                            displayName: createDisplayNameGetter('Visual_Axis_Title'),
                            type: { bool: true }
                        },
                        axisStyle: {
                            displayName: createDisplayNameGetter('Visual_Axis_Style'),
                            type: { formatting: { axisStyle: true } }
                        },
                        labelColor: {
                            displayName: createDisplayNameGetter('Visual_Axis_LabelColor'),
                            type: { fill: { solid: { color: true } } }
                        },
                        fontSize: {
                            displayName: createDisplayNameGetter('Visual_TextSize'),
                            type: { formatting: { fontSize: true } }
                        },
                    }
                },
                valueAxis: {
                    displayName: createDisplayNameGetter('Visual_YAxis'),
                    properties: {
                        show: {
                            displayName: createDisplayNameGetter('Visual_Show'),
                            type: { bool: true }
                        },
                        position: {
                            displayName: createDisplayNameGetter('Visual_YAxis_Position'),
                            type: { formatting: { yAxisPosition: true } }
                        },
                        axisScale: {
                            displayName: createDisplayNameGetter('Visual_Axis_Scale'),
                            type: { formatting: { axisScale: true } }
                        },
                        intersection: {
                            displayName: createDisplayNameGetter('Visual_Axis_Intersection'),
                            type: { numeric: true }
                        },
                        showAxisTitle: {
                            displayName: createDisplayNameGetter('Visual_Axis_Title'),
                            type: { bool: true }
                        },
                        axisStyle: {
                            displayName: createDisplayNameGetter('Visual_Axis_Style'),
                            type: { formatting: { axisStyle: true } }
                        },
                        labelColor: {
                            displayName: createDisplayNameGetter('Visual_Axis_LabelColor'),
                            type: { fill: { solid: { color: true } } }
                        },
                        fontSize: {
                            displayName: createDisplayNameGetter('Visual_TextSize'),
                            type: { formatting: { fontSize: true } }
                        }
                    }
                },
                dataPoint: {
                    displayName: createDisplayNameGetter('Visual_DataPoint'),
                    properties: {
                        defaultColor: {
                            displayName: createDisplayNameGetter('Visual_DefaultColor'),
                            type: { fill: { solid: { color: true } } }
                        },
                        showAllDataPoints: {
                            displayName: createDisplayNameGetter('Visual_DataPoint_Show_All'),
                            type: { bool: true }
                        },
                        fill: {
                            displayName: createDisplayNameGetter('Visual_Fill'),
                            type: { fill: { solid: { color: true } } }
                        },
                        fillRule: {
                            displayName: createDisplayNameGetter('Visual_Gradient'),
                            type: { fillRule: {} },
                            rule: {
                                inputRole: 'Gradient',
                                output: {
                                    property: 'fill',
                                    selector: ['Category'],
                                },
                            },
                        }
                    }
                },

            },
            dataViewMappings: [{
                conditions: [
                    { 'Category': { min: 0, max: 1 }, 'Series': { min: 0, max: 1 }, 'Y': { min: 0, max: 1 }, 'Width': { min: 0, max: 1 } },
                ],
                categorical: {
                    categories: {
                        for: { in: 'Category' },
                        dataReductionAlgorithm: { top: {} }
                    },
                    values: {
                        group: {
                            by: 'Series',
                            select: [{ for: { in: 'Y' } }, { for: { in: 'Width' } }],
                            dataReductionAlgorithm: { top: {} }
                        }
                    },
                    rowCount: { preferred: { min: 1, max: 1 }, supported: { min: 0 } }
                },
            }],
            supportsHighlight: true,
            sorting: {
                default: {},
            },
            drilldown: {
                roles: ['Category']
            },
        };

        public static Properties: MekkoChartProperties = {
            dataPoint: {
                defaultColor: { objectName: 'dataPoint', propertyName: 'defaultColor' },
                fill: { objectName: 'dataPoint', propertyName: 'fill' },
                showAllDataPoints: { objectName: 'dataPoint', propertyName: 'showAllDataPoints' },
            },
            general: {
                formatString: { objectName: 'general', propertyName: 'formatString' }
            },
            columnBorder: {
                show: { objectName: 'columnBorder', propertyName: 'show', },
                color: { objectName: 'columnBorder', propertyName: 'color' },
                width: { objectName: 'columnBorder', propertyName: 'width' }
            }
        };

        public static DefaultSettings: MekkoChartSettings = {
            columnBorder: {
                show: true,
                color: '#fff',
                width: 2,
                maxWidth: 5,
            },
            labelSettings: {
                maxPrecision: 4,
                minPrecision: 0,
            }
        };

        private static getTextProperties(fontSize: number = MekkoChart.FontSize): TextProperties {
            return {
                fontFamily: 'wf_segoe-ui_normal',
                fontSize: PixelConverter.toString(fontSize),
            };
        }

        public static MinOrdinalRectThickness = 20;
        public static MinScalarRectThickness = 2;
        public static OuterPaddingRatio = 0.4;
        public static InnerPaddingRatio = 0.2;
        public static TickLabelPadding = 2;

        private static ClassName = 'cartesianChart';
        private static AxisGraphicsContextClassName = 'axisGraphicsContext';
        private static MaxMarginFactor = 0.25;
        private static MinBottomMargin = 50;
        private static LeftPadding = 10;
        private static RightPadding = 10;
        private static BottomPadding = 16;
        private static YAxisLabelPadding = 20;
        private static XAxisLabelPadding = 20;
        private static TickPaddingY = 10;
        private static TickPaddingRotatedX = 5;
        private static FontSize = 11;

        public static MaxNumberOfLabels = 100;

        private static MinWidth: number = 100;
        private static MinHeight: number = 100;

        private axisGraphicsContext: D3.Selection;
        private xAxisGraphicsContext: D3.Selection;
        private y1AxisGraphicsContext: D3.Selection;
        private y2AxisGraphicsContext: D3.Selection;
        private element: JQuery;
        private svg: D3.Selection;
        private clearCatcher: D3.Selection;
        private margin: IMargin;
        private type: MekkoChartType;
        private hostServices: IVisualHostServices;
        private layers: IMekkoColumnChartVisual[];
        private legend: ILegend;
        private legendMargins: IViewport;
        private layerLegendData: LegendData;
        private hasSetData: boolean;
        private visualInitOptions: VisualInitOptions;

        private borderObjectProperties: DataViewObject;
        private legendObjectProperties: DataViewObject;
        private categoryAxisProperties: DataViewObject;

        private valueAxisProperties: DataViewObject;
        private cartesianSmallViewPortProperties: MekkoChartSmallViewPortProperties;
        private interactivityService: IInteractivityService;
        private behavior: IInteractiveBehavior;
        private y2AxisExists: boolean;
        private categoryAxisHasUnitType: boolean;
        private valueAxisHasUnitType: boolean;
        private hasCategoryAxis: boolean;
        private yAxisIsCategorical: boolean;
        private secValueAxisHasUnitType: boolean;
        private axes: MekkoChartAxisProperties;
        private yAxisOrientation: string;
        private bottomMarginLimit: number;
        private leftRightMarginLimit: number;
        private sharedColorPalette: MekkoChartSharedColorPalette;

        public animator: IGenericAnimator;

        // Scrollbar related
        private isScrollable: boolean;
        private scrollY: boolean;
        private scrollX: boolean;
        private isXScrollBarVisible: boolean;
        private isYScrollBarVisible: boolean;
        private svgScrollable: D3.Selection;
        private axisGraphicsContextScrollable: D3.Selection;
        private labelGraphicsContextScrollable: D3.Selection;
        private brushGraphicsContext: D3.Selection;
        private brush: D3.Svg.Brush;
        private static ScrollBarWidth = 10;
        // TODO: Remove onDataChanged & onResizing once all visuals have implemented update.
        private dataViews: DataView[];
        private currentViewport: IViewport;

        constructor(options: MekkoConstructorOptions) {
            this.isScrollable = false;
            if (options) {
                this.type = options.chartType;
                if (options.isScrollable)
                    this.isScrollable = options.isScrollable;
                this.animator = options.animator;
                if (options.cartesianSmallViewPortProperties) {
                    this.cartesianSmallViewPortProperties = options.cartesianSmallViewPortProperties;
                }

                if (options.behavior) {
                    this.behavior = options.behavior;
                }
            } else {
                this.behavior = new CustomVisualBehavior([new MekkoChartWebBehavior()]);
            }
        }

        public init(options: VisualInitOptions) {
            this.visualInitOptions = options;
            this.layers = [];

            var element = this.element = options.element;
            var viewport = this.currentViewport = options.viewport;
            this.hostServices = options.host;
            this.brush = d3.svg.brush();
            element.addClass(MekkoChart.ClassName);
            this.margin = {
                top: 1,
                right: 1,
                bottom: 1,
                left: 1
            };
            this.yAxisOrientation = yAxisPosition.left;
            this.adjustMargins(viewport);

            this.sharedColorPalette = new MekkoChartSharedColorPalette(options.style.colorPalette.dataColors);

            var showLinesOnX = true;
            var showLinesOnY = true;

            var svg = this.svg = d3.select(element.get(0)).append('svg');
            svg.style('position', 'absolute');

            var axisGraphicsContext = this.axisGraphicsContext = svg.append('g')
                .classed(MekkoChart.AxisGraphicsContextClassName, true);

            this.svgScrollable = svg.append('svg')
                .classed('svgScrollable', true)
                .style('overflow', 'hidden');

            var axisGraphicsContextScrollable = this.axisGraphicsContextScrollable = this.svgScrollable.append('g')
                .classed(MekkoChart.AxisGraphicsContextClassName, true);

            this.labelGraphicsContextScrollable = this.svgScrollable.append('g')
                .classed(NewDataLabelUtils.labelGraphicsContextClass.class, true);

            if (this.behavior) {
                this.clearCatcher = appendClearCatcher(this.axisGraphicsContextScrollable);
            }

            var axisGroup = showLinesOnX ? axisGraphicsContextScrollable : axisGraphicsContext;

            this.xAxisGraphicsContext = showLinesOnX ? axisGraphicsContext.append('g').attr('class', 'x axis') : axisGraphicsContextScrollable.append('g').attr('class', 'x axis');
            this.y1AxisGraphicsContext = axisGroup.append('g').attr('class', 'y axis');
            this.y2AxisGraphicsContext = axisGroup.append('g').attr('class', 'y axis');

            this.xAxisGraphicsContext.classed('showLinesOnAxis', showLinesOnX);
            this.y1AxisGraphicsContext.classed('showLinesOnAxis', showLinesOnY);
            this.y2AxisGraphicsContext.classed('showLinesOnAxis', showLinesOnY);

            this.xAxisGraphicsContext.classed('hideLinesOnAxis', !showLinesOnX);
            this.y1AxisGraphicsContext.classed('hideLinesOnAxis', !showLinesOnY);
            this.y2AxisGraphicsContext.classed('hideLinesOnAxis', !showLinesOnY);

            if (this.behavior) {
                this.interactivityService = createInteractivityService(this.hostServices);
            }
            this.legend = createLegend(
                element,
                options.interactivity && options.interactivity.isInteractiveLegend,
                this.interactivityService,
                true);
        }

        private renderAxesLabels(options: MekkoAxisRenderingOptions): void {
            debug.assertValue(options, 'options');
            debug.assertValue(options.viewport, 'options.viewport');
            debug.assertValue(options.axisLabels, 'options.axisLabels');

            this.axisGraphicsContext.selectAll('.xAxisLabel').remove();
            this.axisGraphicsContext.selectAll('.yAxisLabel').remove();

            var margin = this.margin;
            var width = options.viewport.width - (margin.left + margin.right);
            var height = options.viewport.height;
            var fontSize = MekkoChart.FontSize;
            var heightOffset = fontSize;

            var showOnRight = this.yAxisOrientation === yAxisPosition.right;

            if (!options.hideXAxisTitle) {
                var xAxisLabel = this.axisGraphicsContext.append("text")
                    .style("text-anchor", "middle")
                    .text(options.axisLabels.x)
                    .call((text: D3.Selection) => {
                        text.each(function () {
                            var text = d3.select(this);
                            text.attr({
                                "class": "xAxisLabel",
                                "transform": SVGUtil.translate(width / 2, height - heightOffset)
                            });
                        });
                    });

                xAxisLabel.style("fill", options.xLabelColor ? options.xLabelColor.solid.color : null);

                xAxisLabel.call(AxisHelper.LabelLayoutStrategy.clip,
                    width,
                    TextMeasurementService.svgEllipsis);
            }

            if (!options.hideYAxisTitle) {
                var yAxisLabel = this.axisGraphicsContext.append("text")
                    .style("text-anchor", "middle")
                    .text(options.axisLabels.y)
                    .call((text: D3.Selection) => {
                        text.each(function () {
                            var text = d3.select(this);
                            text.attr({
                                "class": "yAxisLabel",
                                "transform": "rotate(-90)",
                                "y": showOnRight ? width + margin.right - fontSize : -margin.left,
                                "x": -((height - margin.top - options.legendMargin) / 2),
                                "dy": "1em"
                            });
                        });
                    });

                yAxisLabel.style("fill", options.yLabelColor ? options.yLabelColor.solid.color : null);

                yAxisLabel.call(AxisHelper.LabelLayoutStrategy.clip,
                    height - (margin.bottom + margin.top),
                    TextMeasurementService.svgEllipsis);
            }

            if (!options.hideY2AxisTitle && options.axisLabels.y2) {
                var y2AxisLabel = this.axisGraphicsContext.append("text")
                    .style("text-anchor", "middle")
                    .text(options.axisLabels.y2)
                    .call((text: D3.Selection) => {
                        text.each(function () {
                            var text = d3.select(this);
                            text.attr({
                                "class": "yAxisLabel",
                                "transform": "rotate(-90)",
                                "y": showOnRight ? -margin.left : width + margin.right - fontSize,
                                "x": -((height - margin.top - options.legendMargin) / 2),
                                "dy": "1em"
                            });
                        });
                    });

                y2AxisLabel.style("fill", options.y2LabelColor ? options.y2LabelColor.solid.color : null);

                y2AxisLabel.call(AxisHelper.LabelLayoutStrategy.clip,
                    height - (margin.bottom + margin.top),
                    TextMeasurementService.svgEllipsis);
            }
        }

        private adjustMargins(viewport: IViewport): void {
            var margin = this.margin;

            var width = viewport.width - (margin.left + margin.right);
            var height = viewport.height - (margin.top + margin.bottom);

            // Adjust margins if ticks are not going to be shown on either axis
            var xAxis = this.element.find('.x.axis');

            if (AxisHelper.getRecommendedNumberOfTicksForXAxis(width) === 0
                && AxisHelper.getRecommendedNumberOfTicksForYAxis(height) === 0) {
                this.margin = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                };
                xAxis.hide();
            } else {
                xAxis.show();
            }
        }

        private translateAxes(viewport: IViewport): void {
            this.adjustMargins(viewport);
            var margin = this.margin;

            var width = viewport.width - (margin.left + margin.right);
            var height = viewport.height - (margin.top + margin.bottom);

            var showY1OnRight = this.yAxisOrientation === yAxisPosition.right;

            this.xAxisGraphicsContext
                .attr('transform', SVGUtil.translate(0, height));

            this.y1AxisGraphicsContext
                .attr('transform', SVGUtil.translate(showY1OnRight ? width : 0, 0));

            this.y2AxisGraphicsContext
                .attr('transform', SVGUtil.translate(showY1OnRight ? 0 : width, 0));

            this.svg.attr({
                'width': viewport.width,
                'height': viewport.height
            });

            this.svg.style('top', this.legend.isVisible() ? this.legend.getMargins().height + 'px' : 0);

            this.svgScrollable.attr({
                'width': viewport.width,
                'height': viewport.height
            });

            this.svgScrollable.attr({
                'x': 0
            });

            this.axisGraphicsContext.attr('transform', SVGUtil.translate(margin.left, margin.top));
            this.axisGraphicsContextScrollable.attr('transform', SVGUtil.translate(margin.left, margin.top));
            this.labelGraphicsContextScrollable.attr('transform', SVGUtil.translate(margin.left, margin.top));

            if (this.isXScrollBarVisible) {
                this.svgScrollable.attr({
                    'x': this.margin.left
                });
                this.axisGraphicsContextScrollable.attr('transform', SVGUtil.translate(0, margin.top));
                this.labelGraphicsContextScrollable.attr('transform', SVGUtil.translate(0, margin.top));
                this.svgScrollable.attr('width', width);
                this.svg.attr('width', viewport.width)
                    .attr('height', viewport.height + MekkoChart.ScrollBarWidth);
            }
            else if (this.isYScrollBarVisible) {
                this.svgScrollable.attr('height', height + margin.top);
                this.svg.attr('width', viewport.width + MekkoChart.ScrollBarWidth)
                    .attr('height', viewport.height);
            }
        }

        /**
         * Returns preferred Category span if the visual is scrollable.
         */
        public static getPreferredCategorySpan(categoryCount: number, categoryThickness: number, noOuterPadding?: boolean): number {
            var span = (categoryThickness * categoryCount);
            if (noOuterPadding)
                return span;
            return span + (categoryThickness * MekkoChart.OuterPaddingRatio * 2);
        }

        public static getIsScalar(objects: DataViewObjects, propertyId: DataViewObjectPropertyIdentifier, type: ValueType): boolean {
            var axisTypeValue = DataViewObjects.getValue(objects, propertyId);

            if (!objects || axisTypeValue === undefined) {
                // If we don't have anything set (Auto), show charts as Scalar if the category type is numeric or time.
                // If we have the property, it will override the type.
                return !AxisHelper.isOrdinal(type);
            }

            // also checking type here to be in sync with AxisHelper, which ignores scalar if the type is non-numeric.
            return (axisTypeValue === axisType.scalar) && !AxisHelper.isOrdinal(type);
        }

        private populateObjectProperties(dataViews: DataView[]) {
            if (dataViews && dataViews.length > 0) {
                var dataViewMetadata = dataViews[0].metadata;

                if (dataViewMetadata) {
                    this.legendObjectProperties = DataViewObjects.getObject(dataViewMetadata.objects, 'legend', {});
                    this.borderObjectProperties = DataViewObjects.getObject(dataViewMetadata.objects, 'columnBorder', {});
                }
                else {
                    this.legendObjectProperties = {};
                    this.borderObjectProperties = {};
                }

                this.categoryAxisProperties = MekkochartHelper.getCategoryAxisProperties(dataViewMetadata);
                this.valueAxisProperties = MekkochartHelper.getValueAxisProperties(dataViewMetadata);

                if (dataViewMetadata &&
                    dataViewMetadata.objects) {
                    var categoryAxis = dataViewMetadata.objects['categoryAxis'];
                    var valueAxis = dataViewMetadata.objects['valueAxis'];

                    if (categoryAxis) {
                        this.categoryAxisProperties['showBorder'] = categoryAxis['showBorder'];
                        this.categoryAxisProperties['fontSize'] = categoryAxis['fontSize'];
                    }

                    if (valueAxis) {
                        this.valueAxisProperties['fontSize'] = valueAxis['fontSize'];
                    }
                }
                var axisPosition = this.valueAxisProperties['position'];
                this.yAxisOrientation = axisPosition ? axisPosition.toString() : yAxisPosition.left;
            }
        }

        public update(options: VisualUpdateOptions) {
            debug.assertValue(options, 'options');

            var dataViews = this.dataViews = options.dataViews;
            this.currentViewport = options.viewport;

            if (!dataViews) {
                this.clearViewport();
                return;
            }

            if ((this.currentViewport.width < MekkoChart.MinWidth) ||
                (this.currentViewport.height < MekkoChart.MinHeight)) {
                this.clearViewport();
                return;
            }

            if (this.layers.length === 0) {
                // Lazily instantiate the chart layers on the first data load.
                this.layers = this.createAndInitLayers(dataViews);

                debug.assert(this.layers.length > 0, 'createAndInitLayers should update the layers.');
            }
            var layers = this.layers;

            if (dataViews && dataViews.length > 0) {
                var warnings = getInvalidValueWarnings(
                    dataViews,
                    false /*supportsNaN*/,
                    false /*supportsNegativeInfinity*/,
                    false /*supportsPositiveInfinity*/);

                if (warnings && warnings.length > 0) {
                    this.hostServices.setWarnings(warnings);
                }
                this.populateObjectProperties(dataViews);
            }

            this.sharedColorPalette.clearPreferredScale();
            for (var i: number = 0, len: number = layers.length; i < len; i++) {
                layers[i].setData(getLayerData(dataViews, i, len));

                if (len > 1) {
                    this.sharedColorPalette.rotateScale();
                }
            }

            // Note: interactive legend shouldn't be rendered explicitly here
            // The interactive legend is being rendered in the render method of ICartesianVisual
            if (!(this.visualInitOptions.interactivity && this.visualInitOptions.interactivity.isInteractiveLegend)) {
                this.renderLegend();
            }
            this.render(!this.hasSetData || options.suppressAnimations);
            this.hasSetData = this.hasSetData || (dataViews && dataViews.length > 0);
        }

        /**
         * Clear the viewport area
         */
        private clearViewport(): void {
            this.legend.reset();
            this.setVisibility(false);
        }

        private setVisibility(status: boolean = true): void {
            this.svg.style('display', status ? 'block' : 'none');
            this.element.find('.legend').toggle(status);
        }

        public static getLayout(data: MekkoChartData, options: MekkoChartCategoryLayoutOptions): MekkoChartCategoryLayout {
            var categoryCount = options.categoryCount,
                availableWidth = options.availableWidth,
                domain = options.domain,
                trimOrdinalDataOnOverflow = options.trimOrdinalDataOnOverflow,
                isScalar = !!options.isScalar,
                isScrollable = !!options.isScrollable;

            var categoryThickness = MekkoChart.getCategoryThickness(data ? data.series : null, categoryCount, availableWidth, domain, isScalar, trimOrdinalDataOnOverflow);

            // Total width of the outer padding, the padding that exist on the far right and far left of the chart.
            var totalOuterPadding = categoryThickness * MekkoChart.OuterPaddingRatio * 2;

            // visibleCategoryCount will be used to discard data that overflows on ordinal-axis charts.
            // Needed for dashboard visuals            
            var calculatedBarCount = Double.floorWithPrecision((availableWidth - totalOuterPadding) / categoryThickness);
            var visibleCategoryCount = Math.min(calculatedBarCount, categoryCount);
            var willScroll = visibleCategoryCount < categoryCount && isScrollable;

            var outerPaddingRatio = MekkoChart.OuterPaddingRatio;
            if (!isScalar && !willScroll) {
                // use dynamic outer padding to improve spacing when we have few categories
                var oneOuterPadding = (availableWidth - (categoryThickness * visibleCategoryCount)) / 2;
                outerPaddingRatio = oneOuterPadding / categoryThickness;
            }

            // If scrollable, visibleCategoryCount will be total categories
            if (!isScalar && isScrollable)
                visibleCategoryCount = categoryCount;

            return {
                categoryCount: visibleCategoryCount,
                categoryThickness: categoryThickness,
                outerPaddingRatio: outerPaddingRatio,
                isScalar: isScalar
            };
        }

        /** 
         * Returns the thickness for each category.
         * For clustered charts, you still need to divide by
         * the number of series to get column width after calling this method.
         * For linear or time scales, category thickness accomodates for
         * the minimum interval between consequtive points.
         * For all types, return value has accounted for outer padding,
         * but not inner padding.
         */
        public static getCategoryThickness(seriesList: MekkoChartBaseSeries[], numCategories: number, plotLength: number, domain: number[], isScalar: boolean, trimOrdinalDataOnOverflow: boolean): number {
            var thickness;
            if (numCategories < 2)
                thickness = plotLength * (1 - MekkoChart.OuterPaddingRatio);
            else if (isScalar && domain && domain.length > 1) {
                // the smallest interval defines the column width.
                var minInterval = MekkoChart.getMinInterval(seriesList);
                var domainSpan = domain[domain.length - 1] - domain[0];
                // account for outside padding
                var ratio = minInterval / (domainSpan + (minInterval * MekkoChart.OuterPaddingRatio * 2));
                thickness = plotLength * ratio;
                thickness = Math.max(thickness, MekkoChart.MinScalarRectThickness);
            }
            else {
                // Divide the available width up including outer padding (in terms of category thickness) on
                // both sides of the chart, and categoryCount categories. Reverse math:
                // availableWidth = (categoryThickness * categoryCount) + (categoryThickness * (outerPadding * 2)),
                // availableWidth = categoryThickness * (categoryCount + (outerPadding * 2)),
                // categoryThickness = availableWidth / (categoryCount + (outerpadding * 2))
                thickness = plotLength / (numCategories + (MekkoChart.OuterPaddingRatio * 2));
                if (trimOrdinalDataOnOverflow) {
                    thickness = Math.max(thickness, MekkoChart.MinOrdinalRectThickness);
                }
            }

            // spec calls for using the whole plot area, but the max rectangle thickness is "as if there were three categories"
            // (outerPaddingRatio has the same units as '# of categories' so they can be added)
            var maxRectThickness = plotLength / (3 + (MekkoChart.OuterPaddingRatio * 2));

            thickness = Math.min(thickness, maxRectThickness);

            if (!isScalar && numCategories >= 3 && trimOrdinalDataOnOverflow) {
                return Math.max(thickness, MekkoChart.MinOrdinalRectThickness);
            }

            return thickness;
        }

        private static getMinInterval(seriesList: MekkoChartBaseSeries[]): number {
            var minInterval = Number.MAX_VALUE;
            if (seriesList.length > 0) {
                var series0data = seriesList[0].data.filter(d => !d.highlight);
                for (var i = 0, ilen = series0data.length - 1; i < ilen; i++) {
                    minInterval = Math.min(minInterval, Math.abs(series0data[i + 1].categoryValue - series0data[i].categoryValue));
                }
            }
            return minInterval;
        }

        public static parseLabelSettings(objects: DataViewObjects): VisualDataLabelsSettings {
            var labelSettings: VisualDataLabelsSettings = dataLabelUtils.getDefaultColumnLabelSettings(true);
            var labelsObj: DataLabelObject = <DataLabelObject>objects['labels'];
            var minPrecision = MekkoChart.DefaultSettings.labelSettings.minPrecision,
                maxPrecision = MekkoChart.DefaultSettings.labelSettings.maxPrecision;

            dataLabelUtils.updateLabelSettingsFromLabelsObject(labelsObj, labelSettings);

            if (labelSettings.precision < minPrecision) {
                labelSettings.precision = minPrecision;
            }

            if (labelSettings.precision > maxPrecision) {
                labelSettings.precision = maxPrecision;
            }

            return labelSettings;
        }

        public static parseBorderSettings(objects: DataViewObjects): MekkoBorderSettings {
            var show: boolean = DataViewObjects.getValue(
                objects,
                MekkoChart.Properties["columnBorder"]["show"],
                MekkoChart.DefaultSettings.columnBorder.show);

            var color = DataViewObjects.getFillColor(
                objects,
                MekkoChart.Properties["columnBorder"]["color"],
                MekkoChart.DefaultSettings.columnBorder.color);

            var width: number = DataViewObjects.getValue(
                objects,
                MekkoChart.Properties["columnBorder"]["width"],
                MekkoChart.DefaultSettings.columnBorder.width);

            var maxWidth: number = MekkoChart.DefaultSettings.columnBorder.maxWidth;

            if (width > maxWidth) {
                width = maxWidth;
            } else if (width < 0) {
                width = 0;
            }

            if (!show) {
                width = 0;
            }

            return {
                show: show,
                color: color,
                width: width,
            };
        }

        private enumerateBorder(enumeration: ObjectEnumerationBuilder): void {
            var objects: DataViewObjects = {
                columnBorder: this.borderObjectProperties
            };

            var show = DataViewObjects.getValue(
                objects,
                MekkoChart.Properties["columnBorder"]["show"],
                MekkoChart.DefaultSettings.columnBorder.show);

            var color = DataViewObjects.getFillColor(
                objects,
                MekkoChart.Properties["columnBorder"]["color"],
                MekkoChart.DefaultSettings.columnBorder.color);

            var width = DataViewObjects.getValue(
                objects,
                MekkoChart.Properties["columnBorder"]["width"],
                MekkoChart.DefaultSettings.columnBorder.width);

            var maxWidth: number = MekkoChart.DefaultSettings.columnBorder.maxWidth;

            if (width > maxWidth) {
                width = maxWidth;
            } else if (width < 0) {
                width = 0;
            }

            var instance: VisualObjectInstance = {
                objectName: 'columnBorder',
                selector: null,
                properties: {
                    show: show,
                    color: color,
                    width: width,
                },
            };
            enumeration
                .pushInstance(instance);
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            var enumeration = new ObjectEnumerationBuilder();
            var layersLength = this.layers ? this.layers.length : 0;

            if (options.objectName === 'columnBorder') {
                this.enumerateBorder(enumeration);
            }
            else if (options.objectName === 'legend') {
                if (!this.shouldShowLegendCard()) {
                    return;
                }

                var show = DataViewObject.getValue(this.legendObjectProperties, legendProps.show, this.legend.isVisible());
                var showTitle = DataViewObject.getValue(this.legendObjectProperties, legendProps.showTitle, true);
                var titleText = DataViewObject.getValue(this.legendObjectProperties, legendProps.titleText, this.layerLegendData && this.layerLegendData.title ? this.layerLegendData.title : '');
                var fontSize = DataViewObject.getValue(this.legendObjectProperties, legendProps.fontSize, this.layerLegendData && this.layerLegendData.fontSize ? this.layerLegendData.fontSize : NewDataLabelUtils.DefaultLabelFontSizeInPt);

                enumeration.pushInstance({
                    selector: null,
                    properties: {
                        show: show,
                        position: LegendPosition[this.legend.getOrientation()],
                        showTitle: showTitle,
                        titleText: titleText,
                        fontSize: fontSize
                    },
                    objectName: options.objectName
                });
            }
            else if (options.objectName === 'categoryAxis' && this.hasCategoryAxis) {
                this.getCategoryAxisValues(enumeration);
            }
            else if (options.objectName === 'valueAxis') {
                this.getValueAxisValues(enumeration);
            }

            for (var i: number = 0, len: number = layersLength; i < len; i++) {
                var layer = this.layers[i];
                if (layer.enumerateObjectInstances) {
                    layer.enumerateObjectInstances(enumeration, options);
                }
            }

            return enumeration.complete();
        }

        private shouldShowLegendCard(): boolean {
            var layers = this.layers;
            var dataViews = this.dataViews;

            if (layers && dataViews) {
                var layersLength = layers.length;
                var layersWithValuesCtr = 0;

                for (var i: number = 0; i < layersLength; i++) {
                    if (layers[i].hasLegend()) {
                        return true;
                    }

                    // if there are at least two layers with values legend card should be shown (even if each of the individual layers don't have legend)
                    var dataView = dataViews[i];
                    if (dataView && dataView.categorical && dataView.categorical.values && dataView.categorical.values.length > 0) {
                        layersWithValuesCtr++;
                        if (layersWithValuesCtr > 1) {
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        private getCategoryAxisValues(enumeration: ObjectEnumerationBuilder): void {
            var supportedType: string = axisType.both;
            var isScalar: boolean = false;
            var logPossible: boolean = !!this.axes.x.isLogScaleAllowed;
            var scaleOptions: string[] = [axisScale.log, axisScale.linear];//until options can be update in propPane, show all options

            if (this.layers && this.layers[0].getSupportedCategoryAxisType) {
                supportedType = this.layers[0].getSupportedCategoryAxisType();
                if (supportedType === axisType.scalar) {
                    isScalar = true;
                }
                else {
                    isScalar = MekkochartHelper.isScalar(supportedType === axisType.both, this.categoryAxisProperties);
                }
            }

            if (!isScalar) {
                if (this.categoryAxisProperties) {
                    this.categoryAxisProperties['start'] = null;
                    this.categoryAxisProperties['end'] = null;
                }
            }

            var instance: VisualObjectInstance = {
                selector: null,
                properties: {},
                objectName: 'categoryAxis',
                validValues: {
                    axisScale: scaleOptions
                }
            };

            instance.properties['show'] = this.categoryAxisProperties && this.categoryAxisProperties['show'] != null ? this.categoryAxisProperties['show'] : true;
            if (this.yAxisIsCategorical)//in case of e.g. barChart
                instance.properties['position'] = this.valueAxisProperties && this.valueAxisProperties['position'] != null ? this.valueAxisProperties['position'] : yAxisPosition.left;
            if (supportedType === axisType.both) {
                instance.properties['axisType'] = isScalar ? axisType.scalar : axisType.categorical;
            }
            if (isScalar) {
                instance.properties['axisScale'] = (this.categoryAxisProperties && this.categoryAxisProperties['axisScale'] != null && logPossible) ? this.categoryAxisProperties['axisScale'] : axisScale.linear;
                instance.properties['start'] = this.categoryAxisProperties ? this.categoryAxisProperties['start'] : null;
                instance.properties['end'] = this.categoryAxisProperties ? this.categoryAxisProperties['end'] : null;
            }
            instance.properties['showAxisTitle'] = this.categoryAxisProperties && this.categoryAxisProperties['showAxisTitle'] != null ? this.categoryAxisProperties['showAxisTitle'] : false;
            instance.properties['showBorder'] = this.categoryAxisProperties && this.categoryAxisProperties['showBorder'] != null ? this.categoryAxisProperties['showAxisTitle'] : false;

            instance.properties['fontSize'] = this.categoryAxisProperties && this.categoryAxisProperties['fontSize'] != null ? this.categoryAxisProperties['fontSize'] : NewDataLabelUtils.DefaultLabelFontSizeInPt;

            enumeration
                .pushInstance(instance)
                .pushInstance({
                    selector: null,
                    properties: {
                        axisStyle: this.categoryAxisProperties && this.categoryAxisProperties['axisStyle'] ? this.categoryAxisProperties['axisStyle'] : axisStyle.showTitleOnly,
                        labelColor: this.categoryAxisProperties ? this.categoryAxisProperties['labelColor'] : null,
                        fontSize: this.categoryAxisProperties && this.categoryAxisProperties['fontSize'] != null ? this.categoryAxisProperties['fontSize'] : NewDataLabelUtils.DefaultLabelFontSizeInPt
                    },
                    objectName: 'categoryAxis',
                    validValues: {
                        axisStyle: this.categoryAxisHasUnitType ? [axisStyle.showTitleOnly, axisStyle.showUnitOnly, axisStyle.showBoth] : [axisStyle.showTitleOnly],
                    }
                });
        }

        //todo: wrap all these object getters and other related stuff into an interface
        private getValueAxisValues(enumeration: ObjectEnumerationBuilder): void {
            var scaleOptions: string[] = [axisScale.log, axisScale.linear];  //until options can be update in propPane, show all options
            var logPossible: boolean = !!this.axes.y1.isLogScaleAllowed;
            //var secLogPossible = this.axes.y2 != null && this.axes.y2.isLogScaleAllowed;

            var instance: VisualObjectInstance = {
                selector: null,
                properties: {},
                objectName: 'valueAxis',
                validValues: {
                    axisScale: scaleOptions,
                    secAxisScale: scaleOptions
                }
            };

            instance.properties['show'] = this.valueAxisProperties && this.valueAxisProperties['show'] != null ? this.valueAxisProperties['show'] : true;

            if (!this.yAxisIsCategorical) {
                instance.properties['position'] = this.valueAxisProperties && this.valueAxisProperties['position'] != null ? this.valueAxisProperties['position'] : yAxisPosition.left;
            }
            instance.properties['axisScale'] = (this.valueAxisProperties && this.valueAxisProperties['axisScale'] != null && logPossible) ? this.valueAxisProperties['axisScale'] : axisScale.linear;
            instance.properties['start'] = this.valueAxisProperties ? this.valueAxisProperties['start'] : null;
            instance.properties['end'] = this.valueAxisProperties ? this.valueAxisProperties['end'] : null;
            instance.properties['showAxisTitle'] = this.valueAxisProperties && this.valueAxisProperties['showAxisTitle'] != null ? this.valueAxisProperties['showAxisTitle'] : false;

            instance.properties['fontSize'] = this.valueAxisProperties && this.valueAxisProperties['fontSize'] != null ? this.valueAxisProperties['fontSize'] : NewDataLabelUtils.DefaultLabelFontSizeInPt;

            enumeration
                .pushInstance(instance)
                .pushInstance({
                    selector: null,
                    properties: {
                        axisStyle: this.valueAxisProperties && this.valueAxisProperties['axisStyle'] != null ? this.valueAxisProperties['axisStyle'] : axisStyle.showTitleOnly,
                        labelColor: this.valueAxisProperties ? this.valueAxisProperties['labelColor'] : null,
                        fontSize: this.valueAxisProperties && this.valueAxisProperties['fontSize'] != null ? this.valueAxisProperties['fontSize'] : NewDataLabelUtils.DefaultLabelFontSizeInPt
                    },
                    objectName: 'valueAxis',
                    validValues: {
                        axisStyle: this.valueAxisHasUnitType ? [axisStyle.showTitleOnly, axisStyle.showUnitOnly, axisStyle.showBoth] : [axisStyle.showTitleOnly]
                    },
                });

            if (this.layers.length === 2) {
                instance.properties['secShow'] = this.valueAxisProperties && this.valueAxisProperties['secShow'] != null ? this.valueAxisProperties['secShow'] : this.y2AxisExists;
                if (instance.properties['secShow']) {
                    instance.properties['axisLabel'] = '';//this.layers[0].getVisualType();//I will keep or remove this, depending on the decision made
                }
            }
        }

        public onClearSelection(): void {
            if (this.hasSetData) {
                for (var i: number = 0, len: number = this.layers.length; i < len; i++) {
                    var layer = this.layers[i];
                    layer.onClearSelection();
                    layer.render(true /* suppressAnimations */);
                }
            }
        }

        private createAndInitLayers(dataViews: DataView[]): IMekkoColumnChartVisual[] {
            var objects: DataViewObjects;
            if (dataViews && dataViews.length > 0) {
                var dataViewMetadata = dataViews[0].metadata;
                if (dataViewMetadata)
                    objects = dataViewMetadata.objects;
            }

            // Create the layers
            var layers: IMekkoColumnChartVisual[] = createLayers(this.type, objects, this.interactivityService, this.animator, this.isScrollable);

            // Initialize the layers
            var cartesianOptions = <MekkoChartVisualInitOptions>Prototype.inherit(this.visualInitOptions);
            cartesianOptions.svg = this.axisGraphicsContextScrollable;
            cartesianOptions.cartesianHost = {
                updateLegend: data => this.legend.drawLegend(data, this.currentViewport),
                getSharedColors: () => this.sharedColorPalette,
                triggerRender: undefined,
            };

            for (var i: number = 0, len: number = layers.length; i < len; i++) {
                layers[i].init(cartesianOptions);
            }

            return layers;
        }

        private renderLegend(): void {
            var layers: IMekkoColumnChartVisual[] = this.layers;
            var legendData: LegendData = { title: "", dataPoints: [] };

            for (var i: number = 0, len: number = layers.length; i < len; i++) {
                this.layerLegendData = layers[i].calculateLegend();
                if (this.layerLegendData) {
                    legendData.title = i === 0 ? this.layerLegendData.title || ""
                        : legendData.title;
                    legendData.dataPoints = legendData.dataPoints.concat(this.layerLegendData.dataPoints || []);
                    if (this.layerLegendData.grouped) {
                        legendData.grouped = true;
                    }
                }
            }

            var legendProperties: DataViewObject = this.legendObjectProperties;
            if (legendProperties) {
                if (!legendProperties['fontSize']) {
                    legendProperties['fontSize'] = NewDataLabelUtils.DefaultLabelFontSizeInPt;
                }

                LegendData.update(legendData, legendProperties);
                var position = <string>legendProperties[legendProps.position];

                if (position) {
                    this.legend.changeOrientation(LegendPosition[position]);
                }
            }
            else {
                this.legend.changeOrientation(LegendPosition.Top);
            }

            if ((legendData.dataPoints.length === 1 && !legendData.grouped) || this.hideLegends()) {
                legendData.dataPoints = [];
            }

            this.legend.drawLegend(legendData, this.currentViewport);
        }

        private hideLegends(): boolean {
            if (this.cartesianSmallViewPortProperties) {
                if (this.cartesianSmallViewPortProperties.hideLegendOnSmallViewPort && (this.currentViewport.height < this.cartesianSmallViewPortProperties.MinHeightLegendVisible)) {
                    return true;
                }
            }
            return false;
        }

        private addUnitTypeToAxisLabel(axes: MekkoChartAxisProperties): void {
            var unitType = MekkoChart.getUnitType(axes, (axis: MekkoChartAxisProperties): IAxisProperties => axis.x);
            if (axes.x.isCategoryAxis) {
                this.categoryAxisHasUnitType = unitType !== null;
            }
            else {
                this.valueAxisHasUnitType = unitType !== null;
            }

            if (axes.x.axisLabel && unitType) {
                if (axes.x.isCategoryAxis) {
                    axes.x.axisLabel = AxisHelper.createAxisLabel(this.categoryAxisProperties, axes.x.axisLabel, unitType);
                }
                else {
                    axes.x.axisLabel = AxisHelper.createAxisLabel(this.valueAxisProperties, axes.x.axisLabel, unitType);
                }
            }

            unitType = MekkoChart.getUnitType(axes, (axis: MekkoChartAxisProperties): IAxisProperties => axis.y1);

            if (!axes.y1.isCategoryAxis) {
                this.valueAxisHasUnitType = unitType !== null;
            }
            else {
                this.categoryAxisHasUnitType = unitType !== null;
            }

            if (axes.y1.axisLabel && unitType) {
                if (!axes.y1.isCategoryAxis) {
                    axes.y1.axisLabel = AxisHelper.createAxisLabel(this.valueAxisProperties, axes.y1.axisLabel, unitType);
                }
                else {
                    axes.y1.axisLabel = AxisHelper.createAxisLabel(this.categoryAxisProperties, axes.y1.axisLabel, unitType);
                }
            }

            if (axes.y2) {
                var unitType = MekkoChart.getUnitType(axes, (axis: MekkoChartAxisProperties): IAxisProperties => axis.y2);
                this.secValueAxisHasUnitType = unitType !== null;
                if (axes.y2.axisLabel && unitType) {
                    if (this.valueAxisProperties && this.valueAxisProperties['secAxisStyle']) {
                        if (this.valueAxisProperties['secAxisStyle'] === axisStyle.showBoth) {
                            axes.y2.axisLabel = axes.y2.axisLabel + ' (' + unitType + ')';
                        }
                        else if (this.valueAxisProperties['secAxisStyle'] === axisStyle.showUnitOnly) {
                            axes.y2.axisLabel = unitType;
                        }
                    }
                }
            }
        }

        private shouldRenderSecondaryAxis(axisProperties: IAxisProperties): boolean {
            if (!axisProperties) {
                return false;
            }
            if (!this.valueAxisProperties || this.valueAxisProperties["secShow"] == null || this.valueAxisProperties["secShow"]) {
                return axisProperties.values && axisProperties.values.length > 0;
            }
            return false;
        }

        private shouldRenderAxis(axisProperties: IAxisProperties, propertyName: string = "show"): boolean {
            if (!axisProperties) {
                return false;
            }
            else if (axisProperties.isCategoryAxis && (!this.categoryAxisProperties || this.categoryAxisProperties[propertyName] == null || this.categoryAxisProperties[propertyName])) {
                return axisProperties.values && axisProperties.values.length > 0;
            }
            else if (!axisProperties.isCategoryAxis && (!this.valueAxisProperties || this.valueAxisProperties[propertyName] == null || this.valueAxisProperties[propertyName])) {
                return axisProperties.values && axisProperties.values.length > 0;
            }
            return false;
        }

        private render(suppressAnimations: boolean): void {
            this.setVisibility(true);

            var legendMargins: IViewport = this.legendMargins = this.legend.getMargins();
            var viewport: IViewport = {
                height: this.currentViewport.height - legendMargins.height,
                width: this.currentViewport.width - legendMargins.width
            };

            var maxMarginFactor = this.getMaxMarginFactor();
            var leftRightMarginLimit = this.leftRightMarginLimit = viewport.width * maxMarginFactor;
            this.bottomMarginLimit = Math.max(MekkoChart.MinBottomMargin, Math.ceil(viewport.height * maxMarginFactor));

            var xAxisTextProperties = MekkoChart.getTextProperties(this.categoryAxisProperties && parseFloat(<any>this.categoryAxisProperties['fontSize']) || undefined);
            var y1AxisTextProperties = MekkoChart.getTextProperties(this.valueAxisProperties && parseFloat(<any>this.valueAxisProperties['fontSize']) || undefined);

            var margin = this.margin;
            // reset defaults
            margin.top = parseFloat(y1AxisTextProperties.fontSize) / 2;
            margin.bottom = MekkoChart.MinBottomMargin;
            margin.right = 0;

            var axes: MekkoChartAxisProperties = this.axes = calculateAxes(
                this.layers,
                viewport,
                margin,
                this.categoryAxisProperties,
                this.valueAxisProperties,
                this.isXScrollBarVisible || this.isYScrollBarVisible,
                null);

            this.yAxisIsCategorical = axes.y1.isCategoryAxis;
            this.hasCategoryAxis = this.yAxisIsCategorical ? axes.y1 && axes.y1.values.length > 0 : axes.x && axes.x.values.length > 0;

            var renderXAxis = this.shouldRenderAxis(axes.x);
            var renderY1Axis = this.shouldRenderAxis(axes.y1);
            var renderY2Axis = this.shouldRenderSecondaryAxis(axes.y2);

            var width: number = viewport.width - (margin.left + margin.right);
            var isScalar: boolean = false;
            var mainAxisScale;
            var preferredViewport: IViewport;
            this.isXScrollBarVisible = false;
            this.isYScrollBarVisible = false;

            var yAxisOrientation = this.yAxisOrientation;
            var showY1OnRight = yAxisOrientation === yAxisPosition.right;

            if (this.layers) {
                if (this.layers[0].getVisualCategoryAxisIsScalar) {
                    isScalar = this.layers[0].getVisualCategoryAxisIsScalar();
                }

                if (!isScalar && this.isScrollable && this.layers[0].getPreferredPlotArea) {
                    var categoryThickness = this.scrollX ? axes.x.categoryThickness : axes.y1.categoryThickness;
                    var categoryCount = this.scrollX ? axes.x.values.length : axes.y1.values.length;
                    preferredViewport = this.layers[0].getPreferredPlotArea(isScalar, categoryCount, categoryThickness);
                    if (this.scrollX && preferredViewport && preferredViewport.width > viewport.width) {
                        this.isXScrollBarVisible = true;
                        viewport.height -= MekkoChart.ScrollBarWidth;
                    }

                    if (this.scrollY && preferredViewport && preferredViewport.height > viewport.height) {
                        this.isYScrollBarVisible = true;
                        viewport.width -= MekkoChart.ScrollBarWidth;
                        width = viewport.width - (margin.left + margin.right);
                    }
                }
            }

            // Only create the g tag where there is a scrollbar
            if (this.isXScrollBarVisible || this.isYScrollBarVisible) {
                if (!this.brushGraphicsContext) {
                    this.brushGraphicsContext = this.svg.append("g")
                        .classed('x brush', true);
                }
            }
            else {
                // clear any existing brush if no scrollbar is shown
                this.svg.selectAll('.brush').remove();
                this.brushGraphicsContext = undefined;
            }

            // Recalculate axes now that scrollbar visible variables have been set
            axes = calculateAxes(
                this.layers,
                viewport,
                margin,
                this.categoryAxisProperties,
                this.valueAxisProperties,
                this.isXScrollBarVisible || this.isYScrollBarVisible,
                null);

            // we need to make two passes because the margin changes affect the chosen tick values, which then affect the margins again.
            // after the second pass the margins are correct.
            var doneWithMargins: boolean = false,
                maxIterations: number = 2,
                numIterations: number = 0;
            var tickLabelMargins = undefined;
            var chartHasAxisLabels = undefined;
            var axisLabels: MekkoChartAxesLabels = undefined;
            while (!doneWithMargins && numIterations < maxIterations) {
                numIterations++;
                tickLabelMargins = getTickLabelMargins(
                    { width: width, height: viewport.height },
                    leftRightMarginLimit,
                    TextMeasurementService.measureSvgTextWidth,
                    TextMeasurementService.estimateSvgTextHeight,
                    axes,
                    this.bottomMarginLimit,
                    xAxisTextProperties,
                    y1AxisTextProperties,
                    null,
                    false,
                    this.isXScrollBarVisible || this.isYScrollBarVisible,
                    showY1OnRight,
                    renderXAxis,
                    renderY1Axis,
                    renderY2Axis);

                // We look at the y axes as main and second sides, if the y axis orientation is right so the main side represents the right side
                var maxMainYaxisSide = showY1OnRight ? tickLabelMargins.yRight : tickLabelMargins.yLeft,
                    maxSecondYaxisSide = showY1OnRight ? tickLabelMargins.yLeft : tickLabelMargins.yRight,
                    xMax = renderXAxis ? (tickLabelMargins.xMax / 1.8) : 0;

                maxMainYaxisSide += MekkoChart.LeftPadding;
                maxSecondYaxisSide += MekkoChart.RightPadding;
                xMax += MekkoChart.BottomPadding;

                if (this.hideAxisLabels(legendMargins)) {
                    axes.x.axisLabel = null;
                    axes.y1.axisLabel = null;
                    if (axes.y2) {
                        axes.y2.axisLabel = null;
                    }
                }

                this.addUnitTypeToAxisLabel(axes);

                axisLabels = { x: axes.x.axisLabel, y: axes.y1.axisLabel, y2: axes.y2 ? axes.y2.axisLabel : null };
                chartHasAxisLabels = (axisLabels.x != null) || (axisLabels.y != null || axisLabels.y2 != null);

                if (axisLabels.x != null) {
                    xMax += MekkoChart.XAxisLabelPadding;
                }
                if (axisLabels.y != null) {
                    maxMainYaxisSide += MekkoChart.YAxisLabelPadding;
                }
                if (axisLabels.y2 != null) {
                    maxSecondYaxisSide += MekkoChart.YAxisLabelPadding;
                }

                margin.left = showY1OnRight ? maxSecondYaxisSide : maxMainYaxisSide;
                margin.right = showY1OnRight ? maxMainYaxisSide : maxSecondYaxisSide;
                margin.bottom = xMax;
                this.margin = margin;

                width = viewport.width - (margin.left + margin.right);

                // re-calculate the axes with the new margins
                var previousTickCountY1 = axes.y1.values.length;
                var previousTickCountY2 = axes.y2 && axes.y2.values.length;
                axes = calculateAxes(
                    this.layers,
                    viewport,
                    margin,
                    this.categoryAxisProperties,
                    this.valueAxisProperties,
                    this.isXScrollBarVisible || this.isYScrollBarVisible,
                    axes);

                // the minor padding adjustments could have affected the chosen tick values, which would then need to calculate margins again
                // e.g. [0,2,4,6,8] vs. [0,5,10] the 10 is wider and needs more margin.
                if (axes.y1.values.length === previousTickCountY1 && (!axes.y2 || axes.y2.values.length === previousTickCountY2))
                    doneWithMargins = true;
            }

            this.renderChart(mainAxisScale, axes, width, tickLabelMargins, chartHasAxisLabels, axisLabels, viewport, suppressAnimations);
        }

        private hideAxisLabels(legendMargins: IViewport): boolean {
            if (this.cartesianSmallViewPortProperties) {
                if (this.cartesianSmallViewPortProperties.hideAxesOnSmallViewPort && ((this.currentViewport.height + legendMargins.height) < this.cartesianSmallViewPortProperties.MinHeightAxesVisible) && !this.visualInitOptions.interactivity.isInteractiveLegend) {
                    return true;
                }
            }
            return false;
        }

        private static getUnitType(axis: MekkoChartAxisProperties, axisPropertiesLookup: (axis: MekkoChartAxisProperties) => IAxisProperties) {
            if (axisPropertiesLookup(axis).formatter &&
                axisPropertiesLookup(axis).formatter.displayUnit &&
                axisPropertiesLookup(axis).formatter.displayUnit.value > 1) {
                return axisPropertiesLookup(axis).formatter.displayUnit.title;
            }
            return null;
        }

        private getMaxMarginFactor(): number {
            return this.visualInitOptions.style.maxMarginFactor || MekkoChart.MaxMarginFactor;
        }

        private static getChartViewport(viewport: IViewport, margin: IMargin): IViewport {
            return {
                width: viewport.width - margin.left - margin.right,
                height: viewport.height - margin.top - margin.bottom,
            };
        }

        private static wordBreak(
            text: D3.Selection,
            axisProperties: IAxisProperties,
            columnsWidth: number[],
            maxHeight: number,
            borderWidth: number): void {

            //var allowedLength = axisProperties.xLabelMaxWidth;
            text.each(function (data: any, index: number) {
                var width: number, allowedLength: number;
                var node = d3.select(this);
                if (columnsWidth.length >= index) {
                    width = columnsWidth[index];
                    allowedLength = axisProperties.scale(width);
                } else {
                    allowedLength = axisProperties.xLabelMaxWidth;
                }
                // Reset style of text node
                node
                    .style('text-anchor', 'middle')
                    .attr({
                        'dx': '0em',
                        'dy': '1em',
                        'transform': 'rotate(0)'
                    });

                TextMeasurementService.wordBreak(this, allowedLength, axisProperties.willLabelsWordBreak ? maxHeight : 0);
            });
        }

        private renderChart(
            mainAxisScale: any,
            axes: MekkoChartAxisProperties,
            width: number,
            tickLabelMargins: any,
            chartHasAxisLabels: boolean,
            axisLabels: MekkoChartAxesLabels,
            viewport: IViewport,
            suppressAnimations: boolean,
            scrollScale?: any,
            extent?: number[]) {

            var bottomMarginLimit: number = this.bottomMarginLimit;
            var leftRightMarginLimit: number = this.leftRightMarginLimit;
            var layers: IMekkoColumnChartVisual[] = this.layers;
            var duration: number = GetAnimationDuration(this.animator, suppressAnimations);
            var chartViewport: IViewport = MekkoChart.getChartViewport(viewport, this.margin);

            debug.assertValue(layers, 'layers');

            var xLabelColor: Fill;
            var yLabelColor: Fill;
            var y2LabelColor: Fill;

            var xFontSize: any;
            var yFontSize: any;
            //hide show x-axis here
            if (this.shouldRenderAxis(axes.x)) {
                if (axes.x.isCategoryAxis) {
                    xLabelColor = this.categoryAxisProperties && this.categoryAxisProperties['labelColor'] ? this.categoryAxisProperties['labelColor'] : null;
                    xFontSize = this.categoryAxisProperties && this.categoryAxisProperties['fontSize'] != null ? this.categoryAxisProperties['fontSize'] : NewDataLabelUtils.DefaultLabelFontSizeInPt;
                } else {
                    xLabelColor = this.valueAxisProperties && this.valueAxisProperties['labelColor'] ? this.valueAxisProperties['labelColor'] : null;
                    xFontSize = this.valueAxisProperties && this.valueAxisProperties['fontSize'] ? this.valueAxisProperties['fontSize'] : NewDataLabelUtils.DefaultLabelFontSizeInPt;
                }
                axes.x.axis.orient("bottom");
                if (!axes.x.willLabelsFit) {
                    axes.x.axis.tickPadding(MekkoChart.TickPaddingRotatedX);
                }

                var xAxisGraphicsElement: D3.Selection = this.xAxisGraphicsContext;
                if (duration) {
                    xAxisGraphicsElement
                        .transition()
                        .duration(duration)
                        .call(axes.x.axis);
                }
                else {
                    xAxisGraphicsElement
                        .call(axes.x.axis);
                }

                xAxisGraphicsElement
                    .call(MekkoChart.darkenZeroLine)
                    .call(MekkoChart.setAxisLabelColor, xLabelColor)
                    .call(MekkoChart.setAxisLabelFontSize, xFontSize);

                var xAxisTextNodes = xAxisGraphicsElement.selectAll('text');

                var columnWidth: number[] = [];
                var borderWidth: number = 0;
                if (this.layers && this.layers.length) {
                    columnWidth = this.layers[0].getColumnsWidth();
                    borderWidth = this.layers[0].getBorderWidth();
                }

                xAxisGraphicsElement
                    .call(MekkoChart.moveBorder, axes.x.scale, borderWidth, xFontSize / 2 - 8);

                xAxisTextNodes
                    .call(MekkoChart.wordBreak, axes.x, columnWidth, bottomMarginLimit, borderWidth);
            }
            else {
                this.xAxisGraphicsContext.selectAll('*').remove();
            }

            if (this.shouldRenderAxis(axes.y1)) {
                if (axes.y1.isCategoryAxis) {
                    yLabelColor = this.categoryAxisProperties && this.categoryAxisProperties['labelColor'] ? this.categoryAxisProperties['labelColor'] : null;
                    yFontSize = this.categoryAxisProperties && this.categoryAxisProperties['fontSize'] != null ? this.categoryAxisProperties['fontSize'] : NewDataLabelUtils.DefaultLabelFontSizeInPt;
                } else {
                    yLabelColor = this.valueAxisProperties && this.valueAxisProperties['labelColor'] ? this.valueAxisProperties['labelColor'] : null;
                    yFontSize = this.valueAxisProperties && this.valueAxisProperties['fontSize'] != null ? this.valueAxisProperties['fontSize'] : NewDataLabelUtils.DefaultLabelFontSizeInPt;
                }
                var yAxisOrientation = this.yAxisOrientation;
                var showY1OnRight = yAxisOrientation === yAxisPosition.right;
                axes.y1.axis
                    .tickSize(-width)
                    .tickPadding(MekkoChart.TickPaddingY)
                    .orient(yAxisOrientation.toLowerCase());

                var y1AxisGraphicsElement: D3.Selection = this.y1AxisGraphicsContext;
                if (duration) {
                    y1AxisGraphicsElement
                        .transition()
                        .duration(duration)
                        .call(axes.y1.axis);
                }
                else {
                    y1AxisGraphicsElement
                        .call(axes.y1.axis);
                }

                y1AxisGraphicsElement
                    .call(MekkoChart.darkenZeroLine)
                    .call(MekkoChart.setAxisLabelColor, yLabelColor)
                    .call(MekkoChart.setAxisLabelFontSize, yFontSize);

                if (tickLabelMargins.yLeft >= leftRightMarginLimit) {
                    y1AxisGraphicsElement.selectAll('text')
                        .call(AxisHelper.LabelLayoutStrategy.clip,
                        // Can't use padding space to render text, so subtract that from available space for ellipses calculations
                        leftRightMarginLimit - MekkoChart.LeftPadding,
                        TextMeasurementService.svgEllipsis);
                }

                if (axes.y2 && (!this.valueAxisProperties || this.valueAxisProperties['secShow'] == null || this.valueAxisProperties['secShow'])) {
                    y2LabelColor = this.valueAxisProperties && this.valueAxisProperties['secLabelColor'] ? this.valueAxisProperties['secLabelColor'] : null;

                    axes.y2.axis
                        .tickPadding(MekkoChart.TickPaddingY)
                        .orient(showY1OnRight ? yAxisPosition.left.toLowerCase() : yAxisPosition.right.toLowerCase());

                    if (duration) {
                        this.y2AxisGraphicsContext
                            .transition()
                            .duration(duration)
                            .call(axes.y2.axis);
                    }
                    else {
                        this.y2AxisGraphicsContext
                            .call(axes.y2.axis);
                    }

                    this.y2AxisGraphicsContext
                        .call(MekkoChart.darkenZeroLine)
                        .call(MekkoChart.setAxisLabelColor, y2LabelColor);

                    if (tickLabelMargins.yRight >= leftRightMarginLimit) {
                        this.y2AxisGraphicsContext.selectAll('text')
                            .call(AxisHelper.LabelLayoutStrategy.clip,
                            // Can't use padding space to render text, so subtract that from available space for ellipses calculations
                            leftRightMarginLimit - MekkoChart.RightPadding,
                            TextMeasurementService.svgEllipsis);
                    }
                }
                else {
                    this.y2AxisGraphicsContext.selectAll('*').remove();
                }
            }
            else {
                this.y1AxisGraphicsContext.selectAll('*').remove();
                this.y2AxisGraphicsContext.selectAll('*').remove();
            }

            // Axis labels
            if (chartHasAxisLabels) {
                var hideXAxisTitle: boolean = !this.shouldRenderAxis(axes.x, "showAxisTitle");
                var hideYAxisTitle: boolean = !this.shouldRenderAxis(axes.y1, "showAxisTitle");
                var hideY2AxisTitle: boolean = this.valueAxisProperties && this.valueAxisProperties["secShowAxisTitle"] != null && this.valueAxisProperties["secShowAxisTitle"] === false;

                var renderAxisOptions: MekkoAxisRenderingOptions = {
                    axisLabels: axisLabels,
                    legendMargin: this.legendMargins.height,
                    viewport: viewport,
                    hideXAxisTitle: hideXAxisTitle,
                    hideYAxisTitle: hideYAxisTitle,
                    hideY2AxisTitle: hideY2AxisTitle,
                    xLabelColor: xLabelColor,
                    yLabelColor: yLabelColor,
                    y2LabelColor: y2LabelColor,
                    margin: undefined,
                };

                this.renderAxesLabels(renderAxisOptions);
            }
            else {
                this.axisGraphicsContext.selectAll('.xAxisLabel').remove();
                this.axisGraphicsContext.selectAll('.yAxisLabel').remove();
            }

            this.translateAxes(viewport);

            var dataPoints: SelectableDataPoint[] = [];
            var layerBehaviorOptions: any[] = [];
            var labelDataPointsGroup: MekkoLabelDataPointsGroup[] = [];

            //Render chart columns
            if (this.behavior) {
                for (var i: number = 0, len: number = layers.length; i < len; i++) {
                    var result: MekkoVisualRenderResult = layers[i].render(suppressAnimations);
                    if (result) {
                        dataPoints = dataPoints.concat(result.dataPoints);
                        layerBehaviorOptions.push(result.behaviorOptions);

                        if (result.labelDataPointGroups) {
                            var resultLabelDataPointsGroups = result.labelDataPointGroups;
                            for (var j: number = 0, jlen = resultLabelDataPointsGroups.length; j < jlen; j++) {
                                var resultLabelDataPointsGroup = resultLabelDataPointsGroups[j];
                                labelDataPointsGroup.push({
                                    labelDataPoints: resultLabelDataPointsGroup.labelDataPoints,
                                    maxNumberOfLabels: resultLabelDataPointsGroup.maxNumberOfLabels,
                                });
                            }
                        }
                        else {
                            var resultsLabelDataPoints: MekkoLabelDataPoint[] = result.labelDataPoints;
                            var reducedDataPoints: MekkoLabelDataPoint[] = resultsLabelDataPoints;
                            labelDataPointsGroup.push({
                                labelDataPoints: reducedDataPoints,
                                maxNumberOfLabels: reducedDataPoints.length,
                            });
                        }
                    }
                }

                var labelLayoutOptions: DataLabelLayoutOptions = {
                    maximumOffset: NewDataLabelUtils.maxLabelOffset,
                    startingOffset: NewDataLabelUtils.startingLabelOffset
                };

                var labelLayout: LabelLayout = new LabelLayout(labelLayoutOptions);
                var dataLabels: Label[] = labelLayout.layout(labelDataPointsGroup, chartViewport);

                if (layers.length > 1) {
                    NewDataLabelUtils.drawLabelBackground(this.labelGraphicsContextScrollable, dataLabels, "#FFFFFF", 0.7);
                }
                if (this.animator && !suppressAnimations) {
                    NewDataLabelUtils.animateDefaultLabels(this.labelGraphicsContextScrollable, dataLabels, this.animator.getDuration());
                }
                else {
                    NewDataLabelUtils.drawDefaultLabels(this.labelGraphicsContextScrollable, dataLabels);
                }
                this.labelGraphicsContextScrollable.selectAll("text.label").style("pointer-events", "none");
                if (this.interactivityService) {
                    var behaviorOptions: CustomVisualBehaviorOptions = {
                        layerOptions: layerBehaviorOptions,
                        clearCatcher: this.clearCatcher,
                    };
                    this.interactivityService.bind(dataPoints, this.behavior, behaviorOptions);
                }
            }

        }

        /**
         * Within the context of the given selection (g), find the offset of
         * the zero tick using the d3 attached datum of g.tick elements.
         * 'Classed' is undefined for transition selections
         */
        private static darkenZeroLine(g: D3.Selection): void {
            var zeroTick = g.selectAll('g.tick').filter((data) => data === 0).node();
            if (zeroTick) {
                d3.select(zeroTick).select('line').classed('zero-line', true);
            }
        }

        private static setAxisLabelColor(g: D3.Selection, fill: Fill): void {
            g.selectAll('g.tick text').style('fill', fill ? fill.solid.color : null);
        }

        private static setAxisLabelFontSize(g: D3.Selection, fontSize: number): void {
            var value = PixelConverter.toString(fontSize);
            g.selectAll('g.tick text').attr('font-size', value);
        }

        private static moveBorder(g: D3.Selection, scale: D3.Scale.LinearScale, borderWidth: number, yOffset: number = 0): void {
            g.selectAll('g.tick')
                .attr("transform", function (value: number, index: number) {
                    return SVGUtil.translate(scale(value) + (borderWidth * index), yOffset);
                });
        }
    }

    function getTickLabelMargins(
        viewport: IViewport,
        yMarginLimit: number,
        textWidthMeasurer: ITextAsSVGMeasurer,
        textHeightMeasurer: ITextAsSVGMeasurer,
        axes: MekkoChartAxisProperties,
        bottomMarginLimit: number,
        xAxisTextProperties: TextProperties,
        y1AxisTextProperties: TextProperties,
        y2AxisTextProperties: TextProperties,
        enableOverflowCheck: boolean,
        scrollbarVisible?: boolean,
        showOnRight?: boolean,
        renderXAxis?: boolean,
        renderY1Axis?: boolean,
        renderY2Axis?: boolean): TickLabelMargins {

        var XLabelMaxAllowedOverflow = 35;

        debug.assertValue(axes, 'axes');
        var xAxisProperties: IAxisProperties = axes.x;
        var y1AxisProperties: IAxisProperties = axes.y1;
        var y2AxisProperties: IAxisProperties = axes.y2;

        debug.assertValue(viewport, 'viewport');
        debug.assertValue(textWidthMeasurer, 'textWidthMeasurer');
        debug.assertValue(textHeightMeasurer, 'textHeightMeasurer');
        debug.assertValue(xAxisProperties, 'xAxis');
        debug.assertValue(y1AxisProperties, 'yAxis');

        var xLabels = xAxisProperties.values;
        var y1Labels = y1AxisProperties.values;

        var leftOverflow = 0;
        var rightOverflow = 0;
        var maxWidthY1 = 0;
        var maxWidthY2 = 0;
        var xMax = 0; // bottom margin
        var ordinalLabelOffset = xAxisProperties.categoryThickness ? xAxisProperties.categoryThickness / 2 : 0;
        var scaleIsOrdinal = AxisHelper.isOrdinalScale(xAxisProperties.scale);

        var xLabelOuterPadding = 0;
        if (xAxisProperties.outerPadding !== undefined) {
            xLabelOuterPadding = xAxisProperties.outerPadding;
        }
        else if (xAxisProperties.xLabelMaxWidth !== undefined) {
            xLabelOuterPadding = Math.max(0, (viewport.width - xAxisProperties.xLabelMaxWidth * xLabels.length) / 2);
        }

        if (AxisHelper.getRecommendedNumberOfTicksForXAxis(viewport.width) !== 0
            || AxisHelper.getRecommendedNumberOfTicksForYAxis(viewport.height) !== 0) {
            var rotation;
            if (scrollbarVisible)
                rotation = AxisHelper.LabelLayoutStrategy.DefaultRotationWithScrollbar;
            else
                rotation = AxisHelper.LabelLayoutStrategy.DefaultRotation;

            if (renderY1Axis) {
                for (var i = 0, len = y1Labels.length; i < len; i++) {
                    y1AxisTextProperties.text = y1Labels[i];
                    maxWidthY1 = Math.max(maxWidthY1, textWidthMeasurer(y1AxisTextProperties));
                }
            }

            if (y2AxisProperties && renderY2Axis) {
                var y2Labels = y2AxisProperties.values;
                for (var i = 0, len = y2Labels.length; i < len; i++) {
                    y2AxisTextProperties.text = y2Labels[i];
                    maxWidthY2 = Math.max(maxWidthY2, textWidthMeasurer(y2AxisTextProperties));
                }
            }

            var textHeight = textHeightMeasurer(xAxisTextProperties);
            var maxNumLines = Math.floor(bottomMarginLimit / textHeight);
            var xScale = xAxisProperties.scale;
            var xDomain = xScale.domain();
            if (renderXAxis && xLabels.length > 0) {
                for (var i = 0, len = xLabels.length; i < len; i++) {
                    // find the max height of the x-labels, perhaps rotated or wrapped
                    var height: number;
                    xAxisTextProperties.text = xLabels[i];
                    var width = textWidthMeasurer(xAxisTextProperties);
                    if (xAxisProperties.willLabelsWordBreak) {
                        // Split label and count rows
                        var wordBreaks = WordBreaker.splitByWidth(xAxisTextProperties.text, xAxisTextProperties, textWidthMeasurer, xAxisProperties.xLabelMaxWidth, maxNumLines);
                        height = wordBreaks.length * textHeight;
                        // word wrapping will truncate at xLabelMaxWidth
                        width = xAxisProperties.xLabelMaxWidth;
                    }
                    else if (!xAxisProperties.willLabelsFit && scaleIsOrdinal) {
                        height = width * rotation.sine;
                        width = width * rotation.cosine;
                    }
                    else {
                        height = textHeight;
                    }

                    // calculate left and right overflow due to wide X labels
                    // (Note: no right overflow when rotated)
                    if (i === 0) {
                        if (scaleIsOrdinal) {
                            if (!xAxisProperties.willLabelsFit /*rotated text*/)
                                leftOverflow = width - ordinalLabelOffset - xLabelOuterPadding;
                            else
                                leftOverflow = (width / 2) - ordinalLabelOffset - xLabelOuterPadding;
                            leftOverflow = Math.max(leftOverflow, 0);
                        }
                        else if (xDomain.length > 1) {
                            // Scalar - do some math
                            var xPos = xScale(xDomain[0]);
                            // xPos already incorporates xLabelOuterPadding, don't subtract it twice
                            leftOverflow = (width / 2) - xPos;
                            leftOverflow = Math.max(leftOverflow, 0);
                        }
                    } else if (i === len - 1) {
                        if (scaleIsOrdinal) {
                            // if we are rotating text (!willLabelsFit) there won't be any right overflow
                            if (xAxisProperties.willLabelsFit || xAxisProperties.willLabelsWordBreak) {
                                // assume this label is placed near the edge
                                rightOverflow = (width / 2) - ordinalLabelOffset - xLabelOuterPadding;
                                rightOverflow = Math.max(rightOverflow, 0);
                            }
                        }
                        else if (xDomain.length > 1) {
                            // Scalar - do some math
                            var xPos = xScale(xDomain[1]);
                            // xPos already incorporates xLabelOuterPadding, don't subtract it twice
                            rightOverflow = (width / 2) - (viewport.width - xPos);
                            rightOverflow = Math.max(rightOverflow, 0);
                        }
                    }

                    xMax = Math.max(xMax, height);
                }
                // trim any actual overflow to the limit
                leftOverflow = enableOverflowCheck ? Math.min(leftOverflow, XLabelMaxAllowedOverflow) : 0;
                rightOverflow = enableOverflowCheck ? Math.min(rightOverflow, XLabelMaxAllowedOverflow) : 0;
            }
        }

        var rightMargin = 0,
            leftMargin = 0,
            bottomMargin = Math.min(Math.ceil(xMax), bottomMarginLimit);

        if (showOnRight) {
            leftMargin = Math.min(Math.max(leftOverflow, maxWidthY2), yMarginLimit);
            rightMargin = Math.min(Math.max(rightOverflow, maxWidthY1), yMarginLimit);
        }
        else {
            leftMargin = Math.min(Math.max(leftOverflow, maxWidthY1), yMarginLimit);
            rightMargin = Math.min(Math.max(rightOverflow, maxWidthY2), yMarginLimit);
        }

        return {
            xMax: Math.ceil(bottomMargin),
            yLeft: Math.ceil(leftMargin),
            yRight: Math.ceil(rightMargin),
        };
    }

    function getLayerData(dataViews: DataView[], currentIdx: number, totalLayers: number): DataView[] {
        if (totalLayers > 1) {
            if (dataViews && dataViews.length > currentIdx)
                return [dataViews[currentIdx]];
            return [];
        }

        return dataViews;
    }

    /**
     * Returns a boolean, that indicates if y axis title should be displayed.
     * @return True if y axis title should be displayed,
     * otherwise false.
     */
    function shouldShowYAxisLabel(layerNumber: number, valueAxisProperties: DataViewObject, yAxisWillMerge: boolean): boolean {
        return ((layerNumber === 0 && !!valueAxisProperties && !!valueAxisProperties['showAxisTitle']) ||
            (layerNumber === 1 && !yAxisWillMerge && !!valueAxisProperties && !!valueAxisProperties['secShowAxisTitle']));
    }

    /**
     * Computes the Cartesian Chart axes from the set of layers.
     */
    function calculateAxes(
        layers: IMekkoColumnChartVisual[],
        viewport: IViewport,
        margin: IMargin,
        categoryAxisProperties: DataViewObject,
        valueAxisProperties: DataViewObject,
        scrollbarVisible: boolean,
        existingAxisProperties: MekkoChartAxisProperties): MekkoChartAxisProperties {
        debug.assertValue(layers, 'layers');

        var visualOptions: MekkoCalculateScaleAndDomainOptions = {
            viewport: viewport,
            margin: margin,
            forcedXDomain: [categoryAxisProperties ? categoryAxisProperties['start'] : null, categoryAxisProperties ? categoryAxisProperties['end'] : null],
            forceMerge: valueAxisProperties && valueAxisProperties['secShow'] === false,
            showCategoryAxisLabel: false,
            showValueAxisLabel: false,
            categoryAxisScaleType: categoryAxisProperties && categoryAxisProperties['axisScale'] != null ? <string>categoryAxisProperties['axisScale'] : axisScale.linear,
            valueAxisScaleType: valueAxisProperties && valueAxisProperties['axisScale'] != null ? <string>valueAxisProperties['axisScale'] : axisScale.linear,
            trimOrdinalDataOnOverflow: false
        };

        var yAxisWillMerge = false;

        if (valueAxisProperties) {
            visualOptions.forcedYDomain = AxisHelper.applyCustomizedDomain([valueAxisProperties['start'], valueAxisProperties['end']], visualOptions.forcedYDomain);
        }

        var result: MekkoChartAxisProperties;
        for (var layerNumber: number = 0, len: number = layers.length; layerNumber < len; layerNumber++) {
            var currentlayer = layers[layerNumber];
            visualOptions.showCategoryAxisLabel = (!!categoryAxisProperties && !!categoryAxisProperties['showAxisTitle']);//here
            //visualOptions.showBorder = (!!categoryAxisProperties && !!categoryAxisProperties['showBorder']);//here
            visualOptions.showValueAxisLabel = shouldShowYAxisLabel(layerNumber, valueAxisProperties, yAxisWillMerge);

            var axes = currentlayer.calculateAxesProperties(visualOptions);

            if (layerNumber === 0) {
                result = {
                    x: axes[0],
                    y1: axes[1]
                };
            }

            result.x.willLabelsFit = false;
            result.x.willLabelsWordBreak = false;
        }

        return result;
    }

    export function createLayers(
        type: MekkoChartType,
        objects: DataViewObjects,
        interactivityService: IInteractivityService,
        animator?: any,
        isScrollable: boolean = true): IMekkoColumnChartVisual[] {

        var layers: IMekkoColumnChartVisual[] = [];

        var cartesianOptions: MekkoChartConstructorBaseOptions = {
            isScrollable: isScrollable,
            animator: animator,
            interactivityService: interactivityService
        };

        layers.push(createMekkoChartLayer(MekkoVisualChartType.hundredPercentStackedColumn, cartesianOptions));

        return layers;
    }

    function createMekkoChartLayer(type: MekkoVisualChartType, defaultOptions: MekkoChartConstructorBaseOptions): MekkoColumnChart {
        var options: MekkoChartConstructorOptions = {
            animator: <IMekkoChartAnimator>defaultOptions.animator,
            interactivityService: defaultOptions.interactivityService,
            isScrollable: defaultOptions.isScrollable,
            chartType: type
        };
        return new MekkoColumnChart(options);
    }

    var RoleNames = {
        category: 'Category',
        series: 'Series',
        y: 'Y',
        width: 'Width'
    };

    /**
     * Renders a stacked and clustered column chart.
     */
    export interface IMekkoColumnChartVisual /*extends ICartesianVisual*/ {
        getColumnsWidth(): number[];
        getBorderWidth(): number;

        init(options: MekkoChartVisualInitOptions): void;
        setData(dataViews: DataView[], resized?: boolean): void;
        calculateAxesProperties(options: MekkoCalculateScaleAndDomainOptions): IAxisProperties[];
        overrideXScale(xProperties: IAxisProperties): void;
        render(suppressAnimations: boolean): MekkoVisualRenderResult;
        calculateLegend(): LegendData;
        hasLegend(): boolean;
        onClearSelection(): void;
        enumerateObjectInstances?(enumeration: ObjectEnumerationBuilder, options: EnumerateVisualObjectInstancesOptions): void;
        getVisualCategoryAxisIsScalar?(): boolean;
        getSupportedCategoryAxisType?(): string;
        getPreferredPlotArea?(isScalar: boolean, categoryCount: number, categoryThickness: number): IViewport;
        setFilteredData?(startIndex: number, endIndex: number): MekkoChartBaseData;
    }

    // export interface IMekkoColumnChartStrategy /*extends IColumnChartStrategy*/ {
    //     drawColumns(useAnimation: boolean): MekkoColumnChartDrawInfo;

    //     setData(data: MekkoChartBaseData): void;
    //     setupVisualProps(columnChartProps: MekkoChartContext): void;
    //     setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number): IAxisProperties;
    //     setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number): IAxisProperties;

    //     selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void;
    //     getClosestColumnIndex(x: number, y: number): number;
    // }

    export class MekkoColumnChart implements IMekkoColumnChartVisual {
        private static ColumnChartClassName = 'columnChart';

        public static SeriesClasses: ClassAndSelector = createClassAndSelector("series");
        public static BorderClass: ClassAndSelector = createClassAndSelector("mekkoborder");

        private svg: D3.Selection;
        private unclippedGraphicsContext: D3.Selection;
        private mainGraphicsContext: D3.Selection;
        private labelGraphicsContext: D3.Selection;
        private xAxisProperties: IAxisProperties;
        private yAxisProperties: IAxisProperties;
        private currentViewport: IViewport;
        private data: MekkoColumnChartData;
        private style: IVisualStyle;
        private colors: IDataColorPalette;
        private chartType: MekkoVisualChartType;
        private columnChart: IMekkoChartStrategy;
        private hostService: IVisualHostServices;
        private cartesianVisualHost: IMekkoChartVisualHost;
        private interactivity: InteractivityOptions;
        private margin: IMargin;
        private options: MekkoChartVisualInitOptions;
        private lastInteractiveSelectedColumnIndex: number;
        private supportsOverflow: boolean;
        private interactivityService: IInteractivityService;
        private dataViewCat: DataViewCategorical;
        private categoryAxisType: string;
        private animator: IMekkoChartAnimator;
        private isScrollable: boolean;
        private element: JQuery;

        constructor(options: MekkoChartConstructorOptions) {
            debug.assertValue(options, 'options');

            var chartType: MekkoVisualChartType = options.chartType;
            debug.assertValue(chartType, 'chartType');
            this.chartType = chartType;
            this.categoryAxisType = null;
            this.animator = options.animator;
            this.isScrollable = options.isScrollable;
            this.interactivityService = options.interactivityService;
        }

        public init(options: MekkoChartVisualInitOptions) {
            this.svg = options.svg;
            this.unclippedGraphicsContext = this.svg.append('g').classed('columnChartUnclippedGraphicsContext', true);
            this.mainGraphicsContext = this.unclippedGraphicsContext.append('svg').classed('columnChartMainGraphicsContext', true);
            this.labelGraphicsContext = this.svg.append('g').classed(NewDataLabelUtils.labelGraphicsContextClass.class, true);

            this.style = options.style;
            this.currentViewport = options.viewport;
            this.hostService = options.host;
            this.interactivity = options.interactivity;
            this.colors = this.style.colorPalette.dataColors;
            this.cartesianVisualHost = options.cartesianHost;
            this.options = options;
            this.supportsOverflow = !EnumExtensions.hasFlag(this.chartType, flagStacked);
            var element = this.element = options.element;
            element.addClass(MekkoColumnChart.ColumnChartClassName);

            this.columnChart = new MekkoChartStrategy();
        }

        private getCategoryLayout(numCategoryValues: number, options: MekkoCalculateScaleAndDomainOptions): MekkoChartCategoryLayout {
            var availableWidth: number = this.currentViewport.width - (this.margin.left + this.margin.right);
            var metaDataColumn = this.data ? this.data.categoryMetadata : undefined;
            var categoryDataType: ValueType = AxisHelper.getCategoryValueType(metaDataColumn);
            var isScalar = this.data ? this.data.scalarCategoryAxis : false;
            var domain = AxisHelper.createDomain(this.data.series, categoryDataType, isScalar, options.forcedXDomain);

            return MekkoChart.getLayout(
                this.data,
                {
                    availableWidth: availableWidth,
                    categoryCount: numCategoryValues,
                    domain: domain,
                    isScalar: isScalar,
                    isScrollable: this.isScrollable,
                    trimOrdinalDataOnOverflow: false
                });
        }

        public static getBorderWidth(border: MekkoBorderSettings) {
            if (!border ||
                !border.show ||
                !border.width) {
                return 0;
            }

            var width: number = border.width;

            if (width < 0) {
                return 0;
            }
            if (width > border.maxWidth) {
                return border.maxWidth;
            }

            return width;
        }

        public static getBorderColor(border: MekkoBorderSettings) {
            if (!border) {
                return MekkoChart.DefaultSettings.columnBorder.color;
            }
            return border.color;
        }

        public static converter(dataView: DataViewCategorical,
            colors: IDataColorPalette,
            is100PercentStacked: boolean = false,
            isScalar: boolean = false,
            supportsOverflow: boolean = false,
            dataViewMetadata: DataViewMetadata = null,
            chartType?: MekkoVisualChartType): MekkoColumnChartData {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(colors, 'colors');

            var xAxisCardProperties = MekkochartHelper.getCategoryAxisProperties(dataViewMetadata);
            var valueAxisProperties = MekkochartHelper.getValueAxisProperties(dataViewMetadata);
            isScalar = MekkochartHelper.isScalar(isScalar, xAxisCardProperties);
            dataView = MekkoChartUtils.applyUserMinMax(isScalar, dataView, xAxisCardProperties);

            var converterStrategy = new MekkoChartConverterHelper(dataView);

            var categoryInfo = converterHelper.getPivotedCategories(dataView, MekkoChart.Properties["general"]["formatString"]);
            var categories = categoryInfo.categories,
                categoryFormatter: IValueFormatter = categoryInfo.categoryFormatter,
                categoryIdentities: DataViewScopeIdentity[] = categoryInfo.categoryIdentities,
                categoryMetadata: DataViewMetadataColumn = dataView.categories && dataView.categories.length > 0 ? dataView.categories[0].source : undefined;
            //labelFormatString: string = dataView.values && dataView.values[0] ? valueFormatter.getFormatString(dataView.values[0].source, columnChartProps.general.formatString) : undefined;

            var borderSettings: MekkoBorderSettings = MekkoChart.DefaultSettings.columnBorder;
            var labelSettings: VisualDataLabelsSettings = dataLabelUtils.getDefaultColumnLabelSettings(true);

            var defaultDataPointColor = undefined;
            var showAllDataPoints = undefined;
            if (dataViewMetadata && dataViewMetadata.objects) {
                var objects = dataViewMetadata.objects;

                defaultDataPointColor = DataViewObjects.getFillColor(objects, MekkoChart.Properties["dataPoint"]["defaultColor"]);
                showAllDataPoints = DataViewObjects.getValue<boolean>(objects, MekkoChart.Properties["dataPoint"]["showAllDataPoints"]);

                labelSettings = MekkoChart.parseLabelSettings(objects);
                borderSettings = MekkoChart.parseBorderSettings(objects);
            }

            // Allocate colors
            var legendAndSeriesInfo = converterStrategy.getLegend(colors, defaultDataPointColor);
            var legend: MekkoLegendDataPoint[] = legendAndSeriesInfo.legend.dataPoints;
            var seriesSources: DataViewMetadataColumn[] = legendAndSeriesInfo.seriesSources;

            // Determine data points
            var result: MekkoDataPoints = MekkoColumnChart.createDataPoints(
                dataView,
                categories,
                categoryIdentities,
                legend,
                legendAndSeriesInfo.seriesObjects,
                converterStrategy,
                labelSettings,
                is100PercentStacked,
                isScalar,
                supportsOverflow,
                converterHelper.categoryIsAlsoSeriesRole(dataView, RoleNames.series, RoleNames.category),
                categoryInfo.categoryObjects,
                defaultDataPointColor,
                chartType,
                categoryMetadata);
            var columnSeries: MekkoChartSeries[] = result.series;

            var valuesMetadata: DataViewMetadataColumn[] = [];
            for (var j = 0, jlen = legend.length; j < jlen; j++) {
                valuesMetadata.push(seriesSources[j]);
            }

            var labels = converterHelper.createAxesLabels(xAxisCardProperties, valueAxisProperties, categoryMetadata, valuesMetadata);

            return {
                categories: categories,
                categoriesWidth: result.categoriesWidth,
                categoryFormatter: categoryFormatter,
                series: columnSeries,
                valuesMetadata: valuesMetadata,
                legendData: legendAndSeriesInfo.legend,
                hasHighlights: result.hasHighlights,
                categoryMetadata: categoryMetadata,
                scalarCategoryAxis: isScalar,
                borderSettings: borderSettings,
                labelSettings: labelSettings,
                axesLabels: { x: labels.xAxisLabel, y: labels.yAxisLabel },
                hasDynamicSeries: result.hasDynamicSeries,
                defaultDataPointColor: defaultDataPointColor,
                showAllDataPoints: showAllDataPoints,
                isMultiMeasure: false,
            };
        }

        private static getStackedMultiplier(
            rawValues: number[][],
            rowIdx: number,
            seriesCount: number,
            categoryCount: number): ValueMultiplers {

            var pos: number = 0,
                neg: number = 0;

            for (var i = 0; i < seriesCount; i++) {
                var value: number = rawValues[i][rowIdx];
                value = AxisHelper.normalizeNonFiniteNumber(value);

                if (value > 0) {
                    pos += value;
                } else if (value < 0) {
                    neg -= value;
                }
            }

            var absTotal: number = pos + neg;
            return {
                pos: pos ? (pos / absTotal) / pos : 1,
                neg: neg ? (neg / absTotal) / neg : 1,
            };
        }

        private static createDataPoints(
            dataViewCat: DataViewCategorical,
            categories: any[],
            categoryIdentities: DataViewScopeIdentity[],
            legend: MekkoLegendDataPoint[],
            seriesObjectsList: DataViewObjects[][],
            converterStrategy: MekkoChartConverterHelper,

            defaultLabelSettings: VisualDataLabelsSettings,
            is100PercentStacked: boolean = false,
            isScalar: boolean = false,
            supportsOverflow: boolean = false,
            isCategoryAlsoSeries?: boolean,
            categoryObjectsList?: DataViewObjects[],
            defaultDataPointColor?: string,
            chartType?: MekkoVisualChartType,
            categoryMetadata?: DataViewMetadataColumn): MekkoDataPoints {

            var grouped = dataViewCat && dataViewCat.values ? dataViewCat.values.grouped() : undefined;

            var categoryCount = categories.length;
            var seriesCount = legend.length;
            var columnSeries: MekkoChartSeries[] = [];

            if (seriesCount < 1 || categoryCount < 1 || categories[0] === null) {
                return {
                    series: columnSeries,
                    hasHighlights: false,
                    hasDynamicSeries: false,
                    categoriesWidth: [],
                };
            }

            var dvCategories = dataViewCat.categories;
            categoryMetadata = (dvCategories && dvCategories.length > 0)
                ? dvCategories[0].source
                : null;
            var categoryType = AxisHelper.getCategoryValueType(categoryMetadata);
            var isDateTime = AxisHelper.isDateTime(categoryType);
            var baseValuesPos = [], baseValuesNeg = [];

            var rawValues: number[][] = [];
            var rawHighlightValues: number[][] = [];

            var hasDynamicSeries = !!(dataViewCat.values && dataViewCat.values.source);
            var widthColumns: number[] = [];
            var widthIndex = -1;

            var seriesIndex: number = 0;
            var highlightsOverflow = false; // Overflow means the highlight larger than value or the signs being different
            var hasHighlights = converterStrategy.hasHighlightValues(0);
            for (seriesIndex = 0; seriesIndex < dataViewCat.values.length; seriesIndex++) {
                if (dataViewCat.values[seriesIndex].source.roles &&
                    dataViewCat.values[seriesIndex].source.roles[RoleNames.width] &&
                    !dataViewCat.values[seriesIndex].source.roles[RoleNames.y]) {

                    widthIndex = seriesIndex;
                    var widthValues: number[] = dataViewCat.values[seriesIndex].values;
                    for (var i: number = 0, valuesLen = widthValues.length; i < valuesLen; i++) {
                        widthColumns[i] = d3.sum([0, widthColumns[i], widthValues[i]]);
                    }
                    continue;
                }
                var seriesValues = [];
                var seriesHighlightValues = [];
                for (var categoryIndex: number = 0; categoryIndex < categoryCount; categoryIndex++) {
                    var value = converterStrategy.getValueBySeriesAndCategory(seriesIndex, categoryIndex);
                    seriesValues[categoryIndex] = value;
                    if (hasHighlights) {
                        var highlightValue = converterStrategy.getHighlightBySeriesAndCategory(seriesIndex, categoryIndex);
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

            //console.log(dataViewCat);

            if (highlightsOverflow && !supportsOverflow) {
                highlightsOverflow = false;
                hasHighlights = false;
                rawValues = rawHighlightValues;
            }

            if (widthColumns.length < 1) {
                for (seriesIndex = 0; seriesIndex < dataViewCat.values.length; seriesIndex++) {
                    if (dataViewCat.values[seriesIndex].source.roles &&
                        dataViewCat.values[seriesIndex].source.roles[RoleNames.width]) {

                        widthIndex = seriesIndex;
                        var widthValues: number[] = dataViewCat.values[seriesIndex].values;
                        for (var i: number = 0, valuesLen: number = widthValues.length; i < valuesLen; i++) {
                            widthColumns[i] = d3.sum([0, widthColumns[i], widthValues[i]]);
                        }
                        continue;
                    }
                }
            }

            if (widthColumns.length < 1) {
                for (seriesIndex = 0; seriesIndex < categoryCount; seriesIndex++) {
                    widthColumns.push(1);
                }
            }

            var totalSum: number = d3.sum(widthColumns);
            var linearScale = d3.scale.linear()
                .domain([0, totalSum])
                .range([0, 1]);

            var columnStartX: number[] = [0];
            var columnWidth: number[] = [];
            for (seriesIndex = 0; seriesIndex < (categoryCount - 1); seriesIndex++) {
                var stepWidth: number = columnStartX[columnStartX.length - 1] + (widthColumns[seriesIndex] || 0);
                columnStartX.push(stepWidth);
            }

            for (seriesIndex = 0; seriesIndex < categoryCount; seriesIndex++) {
                columnStartX[seriesIndex] = linearScale(columnStartX[seriesIndex]);
                columnWidth[seriesIndex] = linearScale(widthColumns[seriesIndex]);
            }

            var dataPointObjects: DataViewObjects[] = categoryObjectsList,
                formatStringProp = MekkoChart.Properties["general"]["formatString"];
            for (seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
                var seriesDataPoints: MekkoChartColumnDataPoint[] = [],
                    legendItem = legend[seriesIndex],
                    seriesLabelSettings: VisualDataLabelsSettings;

                if (!hasDynamicSeries) {
                    var labelsSeriesGroup = grouped && grouped.length > 0 && grouped[0].values ? grouped[0].values[seriesIndex] : null;
                    var labelObjects = (labelsSeriesGroup && labelsSeriesGroup.source && labelsSeriesGroup.source.objects) ? <DataLabelObject>labelsSeriesGroup.source.objects['labels'] : null;
                    if (labelObjects) {
                        seriesLabelSettings = Prototype.inherit(defaultLabelSettings);
                        dataLabelUtils.updateLabelSettingsFromLabelsObject(labelObjects, seriesLabelSettings);
                    }
                }

                var series: MekkoChartSeries = {
                    displayName: legendItem.label,
                    key: 'series' + seriesIndex,
                    index: seriesIndex,
                    data: seriesDataPoints,
                    identity: legendItem.identity,
                    color: legendItem.color,
                    labelSettings: seriesLabelSettings,
                };

                if (seriesCount > 1) {
                    dataPointObjects = seriesObjectsList[seriesIndex];
                }
                var metadata = dataViewCat.values[seriesIndex].source;

                for (var categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    if (seriesIndex === 0) {
                        baseValuesPos.push(0);
                        baseValuesNeg.push(0);
                    }

                    var value = AxisHelper.normalizeNonFiniteNumber(rawValues[seriesIndex][categoryIndex]);
                    if (value == null) {
                        // Optimization: Ignore null dataPoints from the fabricated category/series combination in the self cross-join.
                        // However, we must retain the first series because it is used to compute things like axis scales, and value lookups.
                        if (seriesIndex > 0) {
                            continue;
                        }
                    }

                    var originalValue: number = value;
                    var categoryValue = categories[categoryIndex];
                    if (isDateTime && categoryValue) {
                        categoryValue = categoryValue.getTime();
                    }
                    if (isScalar && (categoryValue == null || isNaN(categoryValue))) {
                        continue;
                    }

                    var multipliers: ValueMultiplers;
                    if (is100PercentStacked) {
                        multipliers = MekkoColumnChart.getStackedMultiplier(rawValues, categoryIndex, seriesCount, categoryCount);
                    }
                    var unadjustedValue = value,
                        isNegative = value < 0;

                    if (multipliers) {
                        if (isNegative) {
                            value *= multipliers.neg;
                        } else {
                            value *= multipliers.pos;
                        }
                    }

                    var valueAbsolute = Math.abs(value);
                    var position: number;
                    if (isNegative) {
                        position = baseValuesNeg[categoryIndex];

                        if (!isNaN(valueAbsolute)) {
                            baseValuesNeg[categoryIndex] -= valueAbsolute;
                        }
                    }
                    else {
                        if (!isNaN(valueAbsolute)) {
                            baseValuesPos[categoryIndex] += valueAbsolute;
                        }

                        position = baseValuesPos[categoryIndex];
                    }

                    var columnGroup: DataViewValueColumnGroup = grouped && grouped.length > seriesIndex && grouped[seriesIndex].values ? grouped[seriesIndex] : null;
                    var category: DataViewCategoryColumn = dataViewCat.categories && dataViewCat.categories.length > 0 ? dataViewCat.categories[0] : null;
                    var identity = SelectionIdBuilder.builder()
                        .withCategory(category, categoryIndex)
                        .withSeries(dataViewCat.values, columnGroup)
                        .withMeasure(converterStrategy.getMeasureNameByIndex(seriesIndex))
                        .createSelectionId();

                    var rawCategoryValue = categories[categoryIndex];
                    var color = MekkoColumnChart.getDataPointColor(legendItem, categoryIndex, dataPointObjects);

                    var seriesData: TooltipSeriesDataItem[] = [];

                    if (columnGroup) {

                        var seriesValueColumn: DataViewValueColumn = {
                            values: [],
                            source: dataViewCat.values.source,
                        };
                        seriesData.push({
                            value: columnGroup.name,
                            metadata: seriesValueColumn,
                        });

                        for (var columnIndex: number = 0; columnIndex < columnGroup.values.length; columnIndex++) {
                            var columnValues: DataViewValueColumn = columnGroup.values[columnIndex];
                            seriesData.push({
                                value: columnValues.values[categoryIndex],
                                metadata: columnValues,
                            });
                        }
                    }

                    var tooltipInfo: TooltipDataItem[] = TooltipBuilder.createTooltipInfo(formatStringProp, null/*dataViewCat*/, rawCategoryValue, originalValue, [category], seriesData, null/*seriesIndex*/, categoryIndex);

                    var dataPointLabelSettings = (series && series.labelSettings) ? series.labelSettings : defaultLabelSettings;
                    var labelColor = dataPointLabelSettings.labelColor;
                    var lastValue = undefined;
                    //Stacked column/bar label color is white by default (except last series)
                    if ((EnumExtensions.hasFlag(chartType, flagStacked))) {
                        lastValue = this.getStackedLabelColor(isNegative, seriesIndex, seriesCount, categoryIndex, rawValues);
                        labelColor = (lastValue || (seriesIndex === seriesCount - 1 && !isNegative)) ? labelColor : dataLabelUtils.defaultInsideLabelColor;
                    }

                    value = columnWidth[categoryIndex];
                    var originalPosition: number = columnStartX[categoryIndex];

                    var dataPoint: MekkoChartColumnDataPoint = {
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
                        originalPosition: originalPosition,//position,
                        originalValueAbsolute: valueAbsolute,
                        identity: identity,
                        key: identity.getKey(),
                        tooltipInfo: tooltipInfo,
                        labelFill: labelColor,
                        labelFormatString: metadata.format,
                        lastSeries: lastValue,
                        chartType: chartType,
                    };

                    seriesDataPoints.push(dataPoint);

                    if (hasHighlights) {
                        var valueHighlight = rawHighlightValues[seriesIndex][categoryIndex];
                        var unadjustedValueHighlight = valueHighlight;

                        var highlightedTooltip: boolean = true;
                        if (valueHighlight === null) {
                            valueHighlight = 0;
                            highlightedTooltip = false;
                        }

                        if (is100PercentStacked) {
                            valueHighlight *= multipliers.pos;
                        }
                        var absoluteValueHighlight = Math.abs(valueHighlight);
                        var highlightPosition = position;

                        if (valueHighlight > 0) {
                            highlightPosition -= valueAbsolute - absoluteValueHighlight;
                        }
                        else if (valueHighlight === 0 && value > 0) {
                            highlightPosition -= valueAbsolute;
                        }

                        var highlightIdentity = SelectionId.createWithHighlight(identity);
                        var rawCategoryValue = categories[categoryIndex];
                        //var highlightedValue: number = highlightedTooltip ? valueHighlight : undefined;
                        //var tooltipInfo: TooltipDataItem[] = TooltipBuilder.createTooltipInfo(formatStringProp, dataViewCat, rawCategoryValue, originalValue, null, null, seriesIndex, categoryIndex, highlightedValue);

                        if (highlightedTooltip) {
                            // Override non highlighted data point
                            dataPoint.tooltipInfo = tooltipInfo;
                        }

                        var highlightDataPoint: MekkoChartColumnDataPoint = {
                            categoryValue: categoryValue,
                            value: value,
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
                            originalPosition: originalPosition,
                            originalValueAbsolute: valueAbsolute,
                            drawThinner: highlightsOverflow,
                            identity: highlightIdentity,
                            key: highlightIdentity.getKey(),
                            tooltipInfo: tooltipInfo,
                            labelFormatString: metadata.format,
                            labelFill: labelColor,
                            lastSeries: lastValue,
                            chartType: chartType,
                        };

                        seriesDataPoints.push(highlightDataPoint);
                    }
                }

                columnSeries.push(series);
            }

            return {
                series: columnSeries,
                categoriesWidth: columnWidth,
                hasHighlights: hasHighlights,
                hasDynamicSeries: hasDynamicSeries,
            };
        }

        private static getDataPointColor(
            legendItem: MekkoLegendDataPoint,
            categoryIndex: number,
            dataPointObjects?: DataViewObjects[]): string {
            debug.assertValue(legendItem, 'legendItem');
            debug.assertValue(categoryIndex, 'categoryIndex');
            debug.assertAnyValue(dataPointObjects, 'dataPointObjects');

            if (dataPointObjects) {
                var colorOverride = DataViewObjects.getFillColor(
                    dataPointObjects[categoryIndex],
                    MekkoChart.Properties["dataPoint"]["fill"]);

                if (colorOverride) {
                    return colorOverride;
                }
            }

            return legendItem.color;
        }

        private static getStackedLabelColor(isNegative: boolean, seriesIndex: number, seriesCount: number, categoryIndex: number, rawValues: number[][]): boolean {
            var lastValue = !(isNegative && seriesIndex === seriesCount - 1 && seriesCount !== 1);
            //run for the next series and check if current series is last
            for (var i: number = seriesIndex + 1; i < seriesCount; i++) {
                var nextValues: number = AxisHelper.normalizeNonFiniteNumber(rawValues[i][categoryIndex]);
                if ((nextValues !== null) && (((!isNegative || (isNegative && seriesIndex === 0)) && nextValues > 0) || (isNegative && seriesIndex !== 0))) {
                    lastValue = false;
                    break;
                }
            }
            return lastValue;
        }

        public static sliceSeries(series: MekkoChartSeries[], endIndex: number, startIndex: number = 0): MekkoChartSeries[] {
            var newSeries: MekkoChartSeries[] = [];
            if (series && series.length > 0) {
                for (var i = 0, len = series.length; i < len; i++) {
                    var iNewSeries = newSeries[i] = Prototype.inherit(series[i]);
                    iNewSeries.data = series[i].data.filter(d => d.categoryIndex >= startIndex && d.categoryIndex < endIndex);
                }
            }

            return newSeries;
        }

        public static getInteractiveColumnChartDomElement(element: JQuery): HTMLElement {
            return element.children("svg").get(0);
        }

        public getColumnsWidth(): number[] {
            var data: MekkoColumnChartData = this.data;
            if (!data ||
                !data.series ||
                !data.series[0] ||
                !data.series[0].data) {
                return [];
            }

            return data.categoriesWidth;
        }

        public getBorderWidth(): number {
            return MekkoColumnChart.getBorderWidth(this.data.borderSettings);
        }

        public setData(dataViews: DataView[]): void {
            debug.assertValue(dataViews, "dataViews");
            var is100PctStacked: boolean = true;
            this.data = {
                categories: [],
                categoriesWidth: [],
                categoryFormatter: null,
                series: [],
                valuesMetadata: [],
                legendData: null,
                hasHighlights: false,
                categoryMetadata: null,
                scalarCategoryAxis: false,
                borderSettings: null,
                labelSettings: dataLabelUtils.getDefaultColumnLabelSettings(is100PctStacked),
                axesLabels: { x: null, y: null },
                hasDynamicSeries: false,
                defaultDataPointColor: null,
                isMultiMeasure: false,
            };

            if (dataViews.length > 0) {
                var dataView = dataViews[0];

                if (dataView && dataView.categorical) {
                    var dataViewCat = this.dataViewCat = dataView.categorical;

                    this.data = MekkoColumnChart.converter(
                        dataViewCat,
                        this.cartesianVisualHost.getSharedColors(),
                        true,//s100PctStacked,
                        false,
                        this.supportsOverflow,
                        dataView.metadata,
                        this.chartType);

                    var series: MekkoChartSeries[] = this.data.series;
                    for (var i: number = 0, ilen: number = series.length; i < ilen; i++) {
                        var currentSeries: MekkoChartSeries = series[i];
                        if (this.interactivityService) {
                            this.interactivityService.applySelectionStateToData(currentSeries.data);
                        }
                    }
                }
            }
        }

        public calculateLegend(): LegendData {
            // if we're in interactive mode, return the interactive legend
            if (this.interactivity && this.interactivity.isInteractiveLegend) {
                return this.createInteractiveMekkoLegendDataPoints(0);
            }
            var legendData = this.data ? this.data.legendData : null;
            var MekkoLegendDataPoints = legendData ? legendData.dataPoints : [];

            if (ArrayExtensions.isUndefinedOrEmpty(MekkoLegendDataPoints))
                return null;

            return legendData;
        }

        public hasLegend(): boolean {
            return this.data && (this.data.hasDynamicSeries || (this.data.series && this.data.series.length > 1));
        }

        public enumerateObjectInstances(enumeration: ObjectEnumerationBuilder, options: EnumerateVisualObjectInstancesOptions): void {
            switch (options.objectName) {
                case 'dataPoint':
                    if (!GradientUtils.hasGradientRole(this.dataViewCat))
                        this.enumerateDataPoints(enumeration);
                    break;
                case 'labels':
                    this.enumerateDataLabels(enumeration);
                    break;
            }
        }

        private enumerateDataLabels(enumeration: ObjectEnumerationBuilder): void {
            var data = this.data,
                labelSettings = this.data.labelSettings,
                seriesCount = data.series.length;

            //Draw default settings
            dataLabelUtils.enumerateDataLabels(this.getLabelSettingsOptions(enumeration, labelSettings, false));

            if (seriesCount === 0) {
                return;
            }

            //Draw series settings
            if (!data.hasDynamicSeries && (seriesCount > 1 || !data.categoryMetadata)) {
                for (var i = 0; i < seriesCount; i++) {
                    var series: MekkoChartSeries = data.series[i],
                        labelSettings: VisualDataLabelsSettings = (series.labelSettings) ? series.labelSettings : this.data.labelSettings;

                    //enumeration.pushContainer({ displayName: series.displayName });
                    dataLabelUtils.enumerateDataLabels(this.getLabelSettingsOptions(enumeration, labelSettings, true, series));
                    //enumeration.popContainer();
                }
            }
        }

        private getLabelSettingsOptions(enumeration: ObjectEnumerationBuilder, labelSettings: VisualDataLabelsSettings, isSeries: boolean, series?: MekkoChartSeries): VisualDataLabelsSettingsOptions {
            var is100PctStacked: boolean = true;
            return {
                enumeration: enumeration,
                dataLabelsSettings: labelSettings,
                show: !isSeries,
                displayUnits: is100PctStacked,
                precision: true,
                selector: series && series.identity ? series.identity.getSelector() : null
            };
        }

        private enumerateDataPoints(enumeration: ObjectEnumerationBuilder): void {
            var data: MekkoColumnChartData = this.data;
            if (!data || !data.series) {
                return;
            }

            var seriesCount = data.series.length;

            if (seriesCount === 0) {
                return;
            }

            if (data.hasDynamicSeries || seriesCount > 1 || !data.categoryMetadata) {
                for (var i: number = 0; i < seriesCount; i++) {
                    var series: MekkoChartSeries = data.series[i];
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
                var singleSeriesData: MekkoChartColumnDataPoint[] = data.series[0].data;
                var categoryFormatter: IValueFormatter = data.categoryFormatter;

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

                for (var i: number = 0; i < singleSeriesData.length; i++) {
                    var singleSeriesDataPoints = singleSeriesData[i],
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

        public calculateAxesProperties(options: MekkoCalculateScaleAndDomainOptions): IAxisProperties[] {
            var data: MekkoColumnChartData = this.data;
            this.currentViewport = options.viewport;
            var margin: IMargin = this.margin = options.margin;

            var origCatgSize = (data && data.categories) ? data.categories.length : 0;
            var chartLayout: MekkoChartCategoryLayout = data ? this.getCategoryLayout(origCatgSize, options) : {
                categoryCount: 0,
                categoryThickness: MekkoChart.MinOrdinalRectThickness,
                outerPaddingRatio: MekkoChart.OuterPaddingRatio,
                isScalar: false
            };
            this.categoryAxisType = chartLayout.isScalar ? axisType.scalar : null;
            this.columnChart.setData(data);

            var preferredPlotArea = this.getPreferredPlotArea(chartLayout.isScalar, chartLayout.categoryCount, chartLayout.categoryThickness);

            /* preferredPlotArea would be same as currentViewport width when there is no scrollbar.
             In that case we want to calculate the available plot area for the shapes by subtracting the margin from available viewport */
            if (preferredPlotArea.width === this.currentViewport.width) {
                preferredPlotArea.width -= (margin.left + margin.right);
            }
            preferredPlotArea.height -= (margin.top + margin.bottom);

            var is100Pct: boolean = true;

            // When the category axis is scrollable the height of the category axis and value axis will be different
            // The height of the value axis would be same as viewportHeight
            var chartContext: MekkoColumnChartContext = {
                height: preferredPlotArea.height,
                width: preferredPlotArea.width,
                duration: 0,
                hostService: this.hostService,
                unclippedGraphicsContext: this.unclippedGraphicsContext,
                mainGraphicsContext: this.mainGraphicsContext,
                labelGraphicsContext: this.labelGraphicsContext,
                margin: this.margin,
                layout: chartLayout,
                animator: this.animator,
                interactivityService: this.interactivityService,
                viewportHeight: this.currentViewport.height - (margin.top + margin.bottom),
                viewportWidth: this.currentViewport.width - (margin.left + margin.right),
                is100Pct: is100Pct,
                isComboChart: true,
            };
            this.ApplyInteractivity(chartContext);
            this.columnChart.setupVisualProps(chartContext);

            var isBarChart = EnumExtensions.hasFlag(this.chartType, flagBar);

            if (isBarChart) {
                var temp = options.forcedXDomain;
                options.forcedXDomain = options.forcedYDomain;
                options.forcedYDomain = temp;
            }

            this.xAxisProperties = this.columnChart.setXScale(is100Pct, options.forcedTickCount, options.forcedXDomain, isBarChart ? options.valueAxisScaleType : options.categoryAxisScaleType);
            this.yAxisProperties = this.columnChart.setYScale(is100Pct, options.forcedTickCount, options.forcedYDomain, isBarChart ? options.categoryAxisScaleType : options.valueAxisScaleType);

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
            var viewport: IViewport = {
                height: this.currentViewport.height,
                width: this.currentViewport.width
            };

            if (this.isScrollable && !isScalar) {
                var preferredWidth = MekkoChart.getPreferredCategorySpan(categoryCount, categoryThickness);
                if (EnumExtensions.hasFlag(this.chartType, flagBar)) {
                    viewport.height = Math.max(preferredWidth, viewport.height);
                }
                else
                    viewport.width = Math.max(preferredWidth, viewport.width);
            }
            return viewport;
        }

        private ApplyInteractivity(chartContext: MekkoColumnChartContext): void {
            var interactivity = this.interactivity;
            if (interactivity) {
                if (interactivity.dragDataPoint) {
                    chartContext.onDragStart = (datum: MekkoChartColumnDataPoint) => {
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
                    var dragMove = () => {
                        var mousePoint = d3.mouse(this.mainGraphicsContext[0][0]); // get the x and y for the column area itself
                        var x: number = mousePoint[0];
                        var y: number = mousePoint[1];
                        var index: number = this.columnChart.getClosestColumnIndex(x, y);
                        this.selectColumn(index);
                    };

                    var ColumnChartSvg: EventTarget = MekkoColumnChart.getInteractiveColumnChartDomElement(this.element);

                    //set click interaction on the visual
                    this.svg.on('click', dragMove);
                    //set click interaction on the background
                    d3.select(ColumnChartSvg).on('click', dragMove);
                    var drag = d3.behavior.drag()
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

            var legendData: LegendData = this.createInteractiveMekkoLegendDataPoints(indexOfColumnSelected);
            var MekkoLegendDataPoints: MekkoLegendDataPoint[] = legendData.dataPoints;
            this.cartesianVisualHost.updateLegend(legendData);
            if (MekkoLegendDataPoints.length > 0) {
                this.columnChart.selectColumn(indexOfColumnSelected, this.lastInteractiveSelectedColumnIndex);
            }
            this.lastInteractiveSelectedColumnIndex = indexOfColumnSelected;
        }

        private createInteractiveMekkoLegendDataPoints(columnIndex: number): LegendData {
            var data: MekkoColumnChartData = this.data;
            if (!data || ArrayExtensions.isUndefinedOrEmpty(data.series)) {
                return { dataPoints: [] };
            }

            var formatStringProp = MekkoChart.Properties["general"]["formatString"];
            var MekkoLegendDataPoints: MekkoLegendDataPoint[] = [];
            var category = data.categories && data.categories[columnIndex];
            var allSeries: MekkoChartSeries[] = data.series;
            var dataPoints = data.legendData && data.legendData.dataPoints;
            var converterStrategy = new MekkoChartConverterHelper(this.dataViewCat);

            for (var i: number = 0, len = allSeries.length; i < len; i++) {
                var measure = converterStrategy.getValueBySeriesAndCategory(i, columnIndex);
                var valueMetadata = data.valuesMetadata[i];
                var formattedLabel = converterHelper.getFormattedLegendLabel(valueMetadata, this.dataViewCat.values, formatStringProp);
                var dataPointColor: string;
                if (allSeries.length === 1) {
                    var series = allSeries[0];
                    dataPointColor = series.data.length > columnIndex && series.data[columnIndex].color;
                } else {
                    dataPointColor = dataPoints.length > i && dataPoints[i].color;
                }

                MekkoLegendDataPoints.push({
                    color: dataPointColor,
                    icon: LegendIcon.Box,
                    label: formattedLabel,
                    category: data.categoryFormatter ? data.categoryFormatter.format(category) : category,
                    measure: valueFormatter.format(measure, valueFormatter.getFormatString(valueMetadata, formatStringProp)),
                    identity: SelectionId.createNull(),
                    selected: false,
                });
            }

            return { dataPoints: MekkoLegendDataPoints };
        }

        public overrideXScale(xProperties: IAxisProperties): void {
            this.xAxisProperties = xProperties;
        }

        public render(suppressAnimations: boolean): MekkoVisualRenderResult {
            var MekkoColumnChartDrawInfo = this.columnChart.drawColumns(!suppressAnimations /* useAnimations */);
            var data: MekkoColumnChartData = this.data;

            var margin = this.margin;
            var viewport = this.currentViewport;
            var height = viewport.height - (margin.top + margin.bottom);
            var width = viewport.width - (margin.left + margin.right);

            this.mainGraphicsContext
                .attr('height', height)
                .attr('width', width);

            TooltipManager.addTooltip(MekkoColumnChartDrawInfo.shapesSelection, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo);
            var allDataPoints: MekkoChartColumnDataPoint[] = [];
            var behaviorOptions: MekkoChartBehaviorOptions = undefined;
            if (this.interactivityService) {
                for (var i: number = 0, ilen = data.series.length; i < ilen; i++) {
                    allDataPoints = allDataPoints.concat(data.series[i].data);
                }
                behaviorOptions = {
                    datapoints: allDataPoints,
                    bars: MekkoColumnChartDrawInfo.shapesSelection,
                    hasHighlights: data.hasHighlights,
                    eventGroup: this.mainGraphicsContext,
                    mainGraphicsContext: this.mainGraphicsContext,
                    viewport: MekkoColumnChartDrawInfo.viewport,
                    axisOptions: MekkoColumnChartDrawInfo.axisOptions,
                    showLabel: data.labelSettings.show
                };
            }

            if (this.interactivity && this.interactivity.isInteractiveLegend) {
                if (this.data.series.length > 0) {
                    this.selectColumn(0, true); // start with the first column
                }
            }
            SVGUtil.flushAllD3TransitionsIfNeeded(this.options);
            return {
                dataPoints: allDataPoints,
                behaviorOptions: behaviorOptions,
                labelDataPoints: MekkoColumnChartDrawInfo.labelDataPoints,
                labelsAreNumeric: true
            };
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
            var metaDataColumn = this.data ? this.data.categoryMetadata : undefined;
            var valueType = AxisHelper.getCategoryValueType(metaDataColumn);
            var isOrdinal = AxisHelper.isOrdinal(valueType);
            return isOrdinal ? axisType.categorical : axisType.both;
        }

        public setFilteredData(startIndex: number, endIndex: number): MekkoChartBaseData {
            var data = Prototype.inherit(this.data);

            data.series = MekkoColumnChart.sliceSeries(data.series, endIndex, startIndex);
            data.categories = data.categories.slice(startIndex, endIndex);

            this.columnChart.setData(data);

            return data;
        }
    }

    class MekkoChartConverterHelper implements IMekkoChartConverterStrategy {
        private dataView: DataViewCategorical;

        constructor(dataView: DataViewCategorical) {
            this.dataView = dataView;
        }

        private static hasRole(column: DataViewMetadataColumn, name: string): boolean {
            var roles = column.roles;
            return roles && roles[name];
        }

        public getLegend(colors: IDataColorPalette, defaultColor?: string): LegendSeriesInfo {
            var legend: MekkoLegendDataPoint[] = [];
            var seriesSources: DataViewMetadataColumn[] = [];
            var seriesObjects: DataViewObjects[][] = [];
            var grouped: boolean = false;

            var colorHelper = new ColorHelper(colors, MekkoChart.Properties["dataPoint"]["fill"], defaultColor);
            var legendTitle = undefined;
            if (this.dataView && this.dataView.values) {
                var allValues = this.dataView.values;
                var valueGroups = allValues.grouped();

                var hasDynamicSeries = !!(allValues && allValues.source);

                var formatStringProp = MekkoChart.Properties["general"]["formatString"];
                for (var valueGroupsIndex = 0, valueGroupsLen = valueGroups.length; valueGroupsIndex < valueGroupsLen; valueGroupsIndex++) {
                    var valueGroup = valueGroups[valueGroupsIndex],
                        valueGroupObjects = valueGroup.objects,
                        values = valueGroup.values;

                    for (var valueIndex = 0, valuesLen = values.length; valueIndex < valuesLen; valueIndex++) {
                        var series: DataViewValueColumn = values[valueIndex];
                        var source: DataViewMetadataColumn = series.source;
                        // Gradient measures do not create series.
                        if (MekkoChartConverterHelper.hasRole(source, 'Width') && !MekkoChartConverterHelper.hasRole(source, 'Y')) {
                            continue;
                        }

                        seriesSources.push(source);
                        seriesObjects.push(series.objects);

                        var selectionId = series.identity ?
                            SelectionId.createWithIdAndMeasure(series.identity, source.queryName) :
                            SelectionId.createWithMeasure(this.getMeasureNameByIndex(valueIndex));

                        var label = converterHelper.getFormattedLegendLabel(source, allValues, formatStringProp);

                        var color = hasDynamicSeries
                            ? colorHelper.getColorForSeriesValue(valueGroupObjects || source.objects, allValues.identityFields, source.groupName)
                            : colorHelper.getColorForMeasure(valueGroupObjects || source.objects, source.queryName);

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

                var dvValues: DataViewValueColumns = this.dataView.values;
                legendTitle = dvValues && dvValues.source ? dvValues.source.displayName : "";
            }

            var legendData = {
                title: legendTitle,
                dataPoints: legend,
                grouped: grouped,
            };

            return {
                legend: legendData,
                seriesSources: seriesSources,
                seriesObjects: seriesObjects,
            };
        }

        public getValueBySeriesAndCategory(series: number, category: number): number {
            return this.dataView.values[series].values[category];
        }

        public getMeasureNameByIndex(index: number): string {
            return this.dataView.values[index].source.queryName;
        }

        public hasHighlightValues(series: number): boolean {
            var column = this.dataView && this.dataView.values ? this.dataView.values[series] : undefined;
            return column && !!column.highlights;
        }

        public getHighlightBySeriesAndCategory(series: number, category: number): number {
            return this.dataView.values[series].highlights[category];
        }
    }

    interface CustomVisualBehaviorOptions {
        layerOptions: any[];
        clearCatcher: D3.Selection;
    }

    class CustomVisualBehavior implements IInteractiveBehavior {
        private behaviors: IInteractiveBehavior[];

        constructor(behaviors: IInteractiveBehavior[]) {
            this.behaviors = behaviors || [];
        }

        public bindEvents(options: CustomVisualBehaviorOptions, selectionHandler: ISelectionHandler): void {
            var behaviors: IInteractiveBehavior[] = this.behaviors;

            for (var i = 0, ilen = behaviors.length; i < ilen; i++) {
                behaviors[i].bindEvents(options.layerOptions[i], selectionHandler);
            }

            options.clearCatcher.on("click", () => {
                selectionHandler.handleClearSelection();
            });
        }

        public renderSelection(hasSelection: boolean) {
            for (var behaviorName in this.behaviors) {
                this.behaviors[behaviorName].renderSelection(hasSelection);
            }
        }
    }

    export interface MekkoChartBehaviorOptions {
        datapoints: SelectableDataPoint[];
        bars: D3.Selection;
        eventGroup: D3.Selection;
        mainGraphicsContext: D3.Selection;
        hasHighlights: boolean;
        viewport: IViewport;
        axisOptions: MekkoChartAxisOptions;
        showLabel: boolean;
    }

    export class MekkoChartWebBehavior implements IInteractiveBehavior {
        private options: MekkoChartBehaviorOptions;

        public bindEvents(options: MekkoChartBehaviorOptions, selectionHandler: ISelectionHandler) {
            this.options = options;
            var eventGroup = options.eventGroup;

            eventGroup.on('click', () => {
                var d = MekkoChartWebBehavior.getDatumForLastInputEvent();

                selectionHandler.handleSelection(d, d3.event.ctrlKey);
            });

            eventGroup.on('contextmenu', () => {
                if (d3.event.ctrlKey)
                    return;

                d3.event.preventDefault();

                var d = MekkoChartWebBehavior.getDatumForLastInputEvent();
                var position = InteractivityUtils.getPositionOfLastInputEvent();

                selectionHandler.handleContextMenu(d, position);
            });
        }

        public renderSelection(hasSelection: boolean) {
            var options = this.options;
            options.bars.style("fill-opacity", (d: MekkoChartColumnDataPoint) => {
                return MekkoChartUtils.getFillOpacity(d.selected, d.highlight, !d.highlight && hasSelection, !d.selected && options.hasHighlights);
            });
        }

        private static getDatumForLastInputEvent(): any {
            var target = d3.event.target;
            return d3.select(target).datum();
        }
    }

    export module MekkoChartUtils {
        var PctRoundingError = 0.0001;
        var rectName = 'rect';

        export var DimmedOpacity = 0.4;
        export var DefaultOpacity = 1.0;

        export function getSize(scale: D3.Scale.GenericScale<any>, size: number, zeroVal: number = 0): number {
            return AxisHelper.diffScaled(scale, zeroVal, size);
        }

        export function calcValueDomain(data: MekkoChartSeries[], is100pct: boolean): NumberRange {
            var defaultNumberRange = {
                min: 0,
                max: 10
            };

            if (data.length === 0)
                return defaultNumberRange;

            // Can't use AxisHelper because Stacked layout has a slightly different calc, (position - valueAbs)
            var min = d3.min<MekkoChartSeries, number>(data, d => {
                return d3.min<MekkoChartColumnDataPoint, number>(d.data, e => e.position - e.valueAbsolute);
            });

            var max = d3.max<MekkoChartSeries, number>(data, d => {
                return d3.max<MekkoChartColumnDataPoint, number>(d.data, e => e.position);
            });

            if (is100pct) {
                min = Double.roundToPrecision(min, PctRoundingError);
                max = Double.roundToPrecision(max, PctRoundingError);
            }

            return {
                min: min,
                max: max,
            };
        }

        export function drawSeries(data: MekkoChartData, graphicsContext: D3.Selection, axisOptions: MekkoChartAxisOptions): D3.UpdateSelection {
            var colGroupSelection = graphicsContext.selectAll(MekkoChart.Classes["series"].selector);
            var series = colGroupSelection.data(data.series, (d: MekkoChartSeries) => d.key);

            series
                .enter()
                .append('g')
                .classed(MekkoChart.Classes["series"].class, true);

            series
                .style({
                    fill: (d: MekkoChartSeries) => d.color,
                });

            series
                .exit()
                .remove();

            return series;
        }

        export function applyInteractivity(columns: D3.Selection, onDragStart): void {
            debug.assertValue(columns, 'columns');

            if (onDragStart) {
                columns
                    .attr('draggable', 'true')
                    .on('dragstart', onDragStart);
            }
        }

        export function getFillOpacity(selected: boolean, highlight: boolean, hasSelection: boolean, hasPartialHighlights: boolean): number {
            if ((hasPartialHighlights && !highlight) || (hasSelection && !selected))
                return DimmedOpacity;
            return DefaultOpacity;
        }

        export function setChosenColumnOpacity(mainGraphicsContext: D3.Selection, columnGroupSelector: string, selectedColumnIndex: number, lastColumnIndex: number): void {
            var series = mainGraphicsContext.selectAll(MekkoChart.Classes["series"].selector);
            var lastColumnUndefined = typeof lastColumnIndex === 'undefined';
            // find all columns that do not belong to the selected column and set a dimmed opacity with a smooth animation to those columns
            series.selectAll(rectName + columnGroupSelector).filter((d: MekkoChartColumnDataPoint) => {
                return (d.categoryIndex !== selectedColumnIndex) && (lastColumnUndefined || d.categoryIndex === lastColumnIndex);
            }).transition().style('fill-opacity', DimmedOpacity);

            // set the default opacity for the selected column
            series.selectAll(rectName + columnGroupSelector).filter((d: MekkoChartColumnDataPoint) => {
                return d.categoryIndex === selectedColumnIndex;
            }).style('fill-opacity', DefaultOpacity);
        }

        export function getClosestColumnIndex(coordinate: number, columnsCenters: number[]): number {
            var currentIndex = 0;
            var distance: number = Number.MAX_VALUE;
            for (var i = 0, ilen = columnsCenters.length; i < ilen; i++) {
                var currentDistance = Math.abs(coordinate - columnsCenters[i]);
                if (currentDistance < distance) {
                    distance = currentDistance;
                    currentIndex = i;
                }
            }

            return currentIndex;
        }

        export function applyUserMinMax(isScalar: boolean, dataView: DataViewCategorical, xAxisCardProperties: DataViewObject): DataViewCategorical {
            if (isScalar) {
                var min = xAxisCardProperties['start'];
                var max = xAxisCardProperties['end'];

                return MekkoChartUtils.transformDomain(dataView, min, max);
            }

            return dataView;
        }

        export function transformDomain(dataView: DataViewCategorical, min: DataViewPropertyValue, max: DataViewPropertyValue): DataViewCategorical {
            if (!dataView.categories || !dataView.values || dataView.categories.length === 0 || dataView.values.length === 0)
                return dataView;// no need to do something when there are no categories

            if (typeof min !== "number" && typeof max !== "number")
                return dataView;//user did not set min max, nothing to do here

            var category = dataView.categories[0];//at the moment we only support one category
            var categoryType = category ? category.source.type : null;

            // Min/Max comparison won't work if category source is Ordinal
            if (AxisHelper.isOrdinal(categoryType))
                return;

            var categoryValues = category.values;
            var categoryObjects = category.objects;

            if (!categoryValues || !categoryObjects)
                return dataView;
            var newcategoryValues = [];
            var newValues = [];
            var newObjects = [];

            //get new min max
            if (typeof min !== "number") {
                min = categoryValues[0];
            }
            if (typeof max !== "number") {
                max = categoryValues[categoryValues.length - 1];
            }

            //don't allow this
            if (min > max)
                return dataView;

            //build measure array
            for (var j = 0, len = dataView.values.length; j < len; j++) {
                newValues.push([]);
            }

            for (var t = 0, len = categoryValues.length; t < len; t++) {
                if (categoryValues[t] >= min && categoryValues[t] <= max) {
                    newcategoryValues.push(categoryValues[t]);
                    if (categoryObjects) {
                        newObjects.push(categoryObjects[t]);
                    }

                    //on each measure set the new range
                    if (dataView.values) {
                        for (var k = 0; k < dataView.values.length; k++) {
                            newValues[k].push(dataView.values[k].values[t]);
                        }
                    }
                }
            }

            //don't write directly to dataview
            var resultDataView = Prototype.inherit(dataView);
            var resultDataViewValues = resultDataView.values = Prototype.inherit(resultDataView.values);
            var resultDataViewCategories = resultDataView.categories = Prototype.inherit(dataView.categories);
            var resultDataViewCategories0 = resultDataView.categories[0] = Prototype.inherit(resultDataViewCategories[0]);

            resultDataViewCategories0.values = newcategoryValues;
            //only if we had objects, then you set the new objects
            if (resultDataViewCategories0.objects) {
                resultDataViewCategories0.objects = newObjects;
            }

            //update measure array
            for (var t = 0, len = dataView.values.length; t < len; t++) {
                var measureArray = resultDataViewValues[t] = Prototype.inherit(resultDataViewValues[t]);
                measureArray.values = newValues[t];
            }

            return resultDataView;
        }
    }

    export class MekkoChartSharedColorPalette implements IDataColorPalette {
        private palette: IDataColorPalette;
        private preferredScale: IColorScale;
        private rotated: boolean;

        constructor(palette: IDataColorPalette) {
            this.palette = palette;
            this.clearPreferredScale();
        }

        public getColorScaleByKey(scaleKey: string): IColorScale {
            this.setPreferredScale(scaleKey);
            return this.preferredScale;
        }

        public getNewColorScale(): IColorScale {
            return this.preferredScale;
        }

        public getColorByIndex(index: number): IColorInfo {
            return this.palette.getColorByIndex(index);
        }

        public getSentimentColors(): IColorInfo[] {
            return this.palette.getSentimentColors();
        }

        public getBasePickerColors(): IColorInfo[] {
            return this.palette.getBasePickerColors();
        }

        public clearPreferredScale(): void {
            this.preferredScale = this.palette.getNewColorScale();
            this.rotated = false;
        }

        public rotateScale(): void {
            // We create a new rotated the scale such that the first color of the new scale is the first
            // free color of the previous scale. Note that the new scale does not have any colors allocated
            // to particular keys.
            this.preferredScale = this.preferredScale.clone();
            this.preferredScale.clearAndRotateScale();
            this.rotated = true;
        }

        private setPreferredScale(scaleKey: string): void {
            if (!this.rotated) {
                // The first layer to express a preference sets the preferred scale.
                this.preferredScale = this.palette.getColorScaleByKey(scaleKey);
            }
        }
    }

    export module MekkochartHelper {
        export function getCategoryAxisProperties(dataViewMetadata: DataViewMetadata, axisTitleOnByDefault?: boolean): DataViewObject {
            var toReturn: DataViewObject = {};
            if (!dataViewMetadata)
                return toReturn;

            var objects = dataViewMetadata.objects;

            if (objects) {
                var categoryAxisObject = objects['categoryAxis'];

                if (categoryAxisObject) {
                    toReturn = {
                        show: categoryAxisObject['show'],
                        axisType: categoryAxisObject['axisType'],
                        axisScale: categoryAxisObject['axisScale'],
                        start: categoryAxisObject['start'],
                        end: categoryAxisObject['end'],
                        showAxisTitle: categoryAxisObject['showAxisTitle'] == null ? axisTitleOnByDefault : categoryAxisObject['showAxisTitle'],
                        axisStyle: categoryAxisObject['axisStyle'],
                        labelColor: categoryAxisObject['labelColor'],
                        labelDisplayUnits: categoryAxisObject['labelDisplayUnits'],
                        labelPrecision: categoryAxisObject['labelPrecision'],
                        duration: categoryAxisObject['duration'],
                    };
                }
            }
            return toReturn;
        }

        export function getValueAxisProperties(dataViewMetadata: DataViewMetadata, axisTitleOnByDefault?: boolean): DataViewObject {
            var toReturn: DataViewObject = {};
            if (!dataViewMetadata)
                return toReturn;

            var objects = dataViewMetadata.objects;

            if (objects) {
                var valueAxisObject = objects['valueAxis'];
                if (valueAxisObject) {
                    toReturn = {
                        show: valueAxisObject['show'],
                        position: valueAxisObject['position'],
                        axisScale: valueAxisObject['axisScale'],
                        start: valueAxisObject['start'],
                        end: valueAxisObject['end'],
                        showAxisTitle: valueAxisObject['showAxisTitle'] == null ? axisTitleOnByDefault : valueAxisObject['showAxisTitle'],
                        axisStyle: valueAxisObject['axisStyle'],
                        labelColor: valueAxisObject['labelColor'],
                        labelDisplayUnits: valueAxisObject['labelDisplayUnits'],
                        labelPrecision: valueAxisObject['labelPrecision'],
                        secShow: valueAxisObject['secShow'],
                        secPosition: valueAxisObject['secPosition'],
                        secAxisScale: valueAxisObject['secAxisScale'],
                        secStart: valueAxisObject['secStart'],
                        secEnd: valueAxisObject['secEnd'],
                        secShowAxisTitle: valueAxisObject['secShowAxisTitle'],
                        secAxisStyle: valueAxisObject['secAxisStyle'],
                        secLabelColor: valueAxisObject['secLabelColor'],
                        secLabelDisplayUnits: valueAxisObject['secLabelDisplayUnits'],
                        secLabelPrecision: valueAxisObject['secLabelPrecision'],
                    };
                }
            }
            return toReturn;
        }

        export function isScalar(isScalar: boolean, xAxisCardProperties: DataViewObject): boolean {
            if (isScalar) {
                //now check what the user wants
                isScalar = xAxisCardProperties && xAxisCardProperties['axisType'] ? xAxisCardProperties['axisType'] === axisType.scalar : true;
            }
            return isScalar;
        }
    }
}
