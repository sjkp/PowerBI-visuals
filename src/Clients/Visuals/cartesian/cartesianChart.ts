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
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;

    const DEFAULT_AXIS_SCALE_TYPE: string = axisScale.linear;
    const COMBOCHART_DOMAIN_OVERLAP_TRESHOLD_PERCENTAGE = 0.1;
    // the interactive right margin is set to be the circle selection radius of the hover line
    const INTERACTIVITY_RIGHT_MARGIN = 6;
    export const DEFAULT_AXIS_COLOR = '#777';

    export const enum CartesianChartType {
        Line,
        Area,
        StackedArea,
        ClusteredColumn,
        StackedColumn,
        ClusteredBar,
        StackedBar,
        HundredPercentStackedBar,
        HundredPercentStackedColumn,
        Scatter,
        ComboChart,
        DataDot,
        Waterfall,
        LineClusteredColumnCombo,
        LineStackedColumnCombo,
        DataDotClusteredColumnCombo,
        DataDotStackedColumnCombo,
    }

    export interface CalculateScaleAndDomainOptions {
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

    export interface MergedValueAxisResult {
        domain: number[];
        merged: boolean;
        tickCount: number;
    }

    export interface CartesianSmallViewPortProperties {
        hideLegendOnSmallViewPort: boolean;
        hideAxesOnSmallViewPort: boolean;
        MinHeightLegendVisible: number;
        MinHeightAxesVisible: number;
    }

    export interface AxisRenderingOptions {
        axisLabels: ChartAxesLabels;
        viewport: IViewport;
        margin: IMargin;
        hideXAxisTitle: boolean;
        hideYAxisTitle: boolean;
        hideY2AxisTitle?: boolean;
        xLabelColor?: Fill;
        yLabelColor?: Fill;
        y2LabelColor?: Fill;
        fontSize: number;
    }

    export interface CartesianConstructorOptions {
        chartType: CartesianChartType;
        isScrollable?: boolean;
        animator?: IGenericAnimator;
        cartesianSmallViewPortProperties?: CartesianSmallViewPortProperties;
        behavior?: IInteractiveBehavior;
        isLabelInteractivityEnabled?: boolean;
        tooltipsEnabled?: boolean;
        tooltipBucketEnabled?: boolean;
        trimOrdinalDataOnOverflow?: boolean;
        advancedLineLabelsEnabled?: boolean;
    }

    export interface ICartesianVisual {
        init(options: CartesianVisualInitOptions): void;
        setData(dataViews: DataView[]): void;
        calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[];
        overrideXScale(xProperties: IAxisProperties): void;
        render(suppressAnimations: boolean, resizeMode?: ResizeMode): CartesianVisualRenderResult;
        calculateLegend(): LegendData;
        hasLegend(): boolean;
        onClearSelection(): void;
        enumerateObjectInstances?(enumeration: ObjectEnumerationBuilder, options: EnumerateVisualObjectInstancesOptions): void;
        getVisualCategoryAxisIsScalar?(): boolean;
        getSupportedCategoryAxisType?(): string;
        getPreferredPlotArea?(isScalar: boolean, categoryCount: number, categoryThickness: number): IViewport;
        setFilteredData?(startIndex: number, endIndex: number): CartesianData;
        supportsTrendLine?(): boolean;
        shouldSuppressAnimation?(): boolean;
    }

    export interface CartesianVisualConstructorOptions {
        isScrollable: boolean;
        interactivityService?: IInteractivityService;
        animator?: IGenericAnimator;
        isLabelInteractivityEnabled?: boolean;
        tooltipsEnabled?: boolean;
        tooltipBucketEnabled?: boolean;
        advancedLineLabelsEnabled?: boolean;
    }

    export interface CartesianVisualRenderResult {
        dataPoints: SelectableDataPoint[];
        behaviorOptions: any;
        labelDataPoints: LabelDataPoint[];
        labelsAreNumeric: boolean;
        labelDataPointGroups?: LabelDataPointGroup[];
    }

    export interface CartesianDataPoint {
        categoryValue: any;
        value: number;
        categoryIndex: number;
        seriesIndex: number;
        highlight?: boolean;
    }

    export interface CartesianSeries {
        data: CartesianDataPoint[];
    }

    export interface CartesianData {
        series: CartesianSeries[];
        categoryMetadata: DataViewMetadataColumn;
        categories: any[];
        hasHighlights?: boolean;
    }

    export interface CartesianVisualInitOptions extends VisualInitOptions {
        svg: D3.Selection;
        cartesianHost: ICartesianVisualHost;
        chartType?: CartesianChartType;
        labelsContext?: D3.Selection; //TEMPORARY - for PlayAxis
    }

    export interface ICartesianVisualHost {
        updateLegend(data: LegendData): void;
        getSharedColors(): IDataColorPalette;
        triggerRender(suppressAnimations: boolean): void;
    }

    export interface ChartAxesLabels {
        x: string;
        y: string;
        y2?: string;
    }

    export const enum AxisLinesVisibility {
        ShowLinesOnXAxis = 1,
        ShowLinesOnYAxis = 2,
        ShowLinesOnBothAxis = ShowLinesOnXAxis | ShowLinesOnYAxis,
    }

    export interface CategoryLayout {
        categoryCount: number;
        categoryThickness: number;
        outerPaddingRatio: number;
        isScalar?: boolean;
    }

    export interface CategoryLayoutOptions {
        availableWidth: number;
        categoryCount: number;
        domain: any;
        trimOrdinalDataOnOverflow: boolean;
        isScalar?: boolean;
        isScrollable?: boolean;
    }

    export interface CartesianAxisProperties {
        x: IAxisProperties;
        y1: IAxisProperties;
        y2?: IAxisProperties;
    }

    export interface ReferenceLineOptions {
        graphicContext: D3.Selection;
        referenceLineProperties: DataViewObject;
        axes: CartesianAxisProperties;
        viewport: IViewport;
        classAndSelector: ClassAndSelector;
        defaultColor: string;
        isHorizontal: boolean;
    }

    export interface ReferenceLineDataLabelOptions {
        referenceLineProperties: DataViewObject;
        axes: CartesianAxisProperties;
        viewport: IViewport;
        defaultColor: string;
        isHorizontal: boolean;
        key: string;
    }
    
    export interface ViewportDataRange {
        startIndex: number;
        endIndex: number;
    }

    export interface ScalarKeys {
        values: PrimitiveValueRange[];
    }

    type RenderPlotAreaDelegate = (
        layers: ICartesianVisual[],
        axesLayout: CartesianAxesLayout,
        suppressAnimations: boolean) => void;

    /** 
     * Renders a data series as a cartestian visual.
     */
    export class CartesianChart implements IVisual {
        public static MinOrdinalRectThickness = 20;
        public static MinScalarRectThickness = 2;
        public static OuterPaddingRatio = 0.4;
        public static InnerPaddingRatio = 0.2;
        public static TickLabelPadding = 2; // between text labels, used by AxisHelper
        public static LoadMoreThreshold = 1; // Load more data 1 item before the last (so 2nd to last) item is shown

        private static ClassName = 'cartesianChart';
        private static PlayAxisBottomMargin = 80; //do not change unless we add dynamic label measurements for play slider
        private static FontSize = 11;
        private static FontSizeString = jsCommon.PixelConverter.toString(CartesianChart.FontSize);

        public static AxisTextProperties: TextProperties = {
            fontFamily: Font.Family.regular.css,
            fontSize: CartesianChart.FontSizeString,
        };

        private element: JQuery;
        private chartAreaSvg: D3.Selection;
        private clearCatcher: D3.Selection;
        private type: CartesianChartType;
        private hostServices: IVisualHostServices;
        private layers: ICartesianVisual[];
        private legend: ILegend;
        private legendMargins: IViewport;
        private layerLegendData: LegendData;
        private hasSetData: boolean;
        private visualInitOptions: VisualInitOptions;
        private legendObjectProperties: DataViewObject;
        private categoryAxisProperties: DataViewObject;
        private valueAxisProperties: DataViewObject;
        private xAxisReferenceLines: DataViewObjectMap;
        private y1AxisReferenceLines: DataViewObjectMap;
        private cartesianSmallViewPortProperties: CartesianSmallViewPortProperties;
        private interactivityService: IInteractivityService;
        private behavior: IInteractiveBehavior;
        private sharedColorPalette: SharedColorPalette;
        private isLabelInteractivityEnabled: boolean;
        private tooltipsEnabled: boolean;
        private tooltipBucketEnabled: boolean;
        private trimOrdinalDataOnOverflow: boolean;
        private isMobileChart: boolean;
        private advancedLineLabelsEnabled: boolean;

        private trendLines: TrendLine[];

        private xRefLine: ClassAndSelector = createClassAndSelector('x-ref-line');
        private y1RefLine: ClassAndSelector = createClassAndSelector('y1-ref-line');

        public animator: IGenericAnimator;

        private axes: CartesianAxes;
        private scrollableAxes: ScrollableAxes;
        private svgAxes: SvgCartesianAxes;
        private svgBrush: SvgBrush;
        private renderedPlotArea: IViewport; // to help disable animation when property changes result in layout changes (e.g. 'legend off' should not animate)

        // TODO: Remove onDataChanged & onResizing once all visuals have implemented update.
        private dataViews: DataView[];
        private currentViewport: IViewport;
        private background: VisualBackground;
        
        private loadMoreDataHandler: CartesianLoadMoreDataHandler;

        private static getAxisVisibility(type: CartesianChartType): AxisLinesVisibility {
            switch (type) {
                case CartesianChartType.StackedBar:
                case CartesianChartType.ClusteredBar:
                case CartesianChartType.HundredPercentStackedBar:
                    return AxisLinesVisibility.ShowLinesOnXAxis;
                case CartesianChartType.Scatter:
                    return AxisLinesVisibility.ShowLinesOnBothAxis;
                default:
                    return AxisLinesVisibility.ShowLinesOnYAxis;
            }
        }

        constructor(options: CartesianConstructorOptions) {
            let isScrollable = false;
            this.trimOrdinalDataOnOverflow = true;
            if (options) {
                this.tooltipsEnabled = options.tooltipsEnabled;
                this.tooltipBucketEnabled = options.tooltipBucketEnabled;
                this.type = options.chartType;
                this.isLabelInteractivityEnabled = options.isLabelInteractivityEnabled;
                this.advancedLineLabelsEnabled = options.advancedLineLabelsEnabled;
                if (options.trimOrdinalDataOnOverflow !== undefined)
                    this.trimOrdinalDataOnOverflow = options.trimOrdinalDataOnOverflow;
                if (options.isScrollable)
                    isScrollable = options.isScrollable;
                this.animator = options.animator;
                if (options.cartesianSmallViewPortProperties) {
                    this.cartesianSmallViewPortProperties = options.cartesianSmallViewPortProperties;
                }

                if (options.behavior) {
                    this.behavior = options.behavior;
                }
            }

            this.axes = new CartesianAxes(isScrollable, ScrollableAxes.ScrollbarWidth, this.trimOrdinalDataOnOverflow);
            this.svgAxes = new SvgCartesianAxes(this.axes);
            this.svgBrush = new SvgBrush(ScrollableAxes.ScrollbarWidth);
            this.scrollableAxes = new ScrollableAxes(this.axes, this.svgBrush);
        }

        public init(options: VisualInitOptions) {
            this.visualInitOptions = options;
            this.layers = [];

            let element = this.element = options.element;

            this.currentViewport = options.viewport;
            this.hostServices = options.host;

            let chartAreaSvg = this.chartAreaSvg = d3.select(element.get(0)).append('svg');
            chartAreaSvg.classed(CartesianChart.ClassName, true);
            chartAreaSvg.style('position', 'absolute');

            if (this.behavior) {
                this.clearCatcher = appendClearCatcher(chartAreaSvg);
                this.interactivityService = createInteractivityService(this.hostServices);
            }

            if (options.style.maxMarginFactor != null)
                this.axes.setMaxMarginFactor(options.style.maxMarginFactor);

            let axisLinesVisibility = CartesianChart.getAxisVisibility(this.type);
            this.axes.setAxisLinesVisibility(axisLinesVisibility);

            this.svgAxes.init(chartAreaSvg);
            this.svgBrush.init(chartAreaSvg);

            this.sharedColorPalette = new SharedColorPalette(options.style.colorPalette.dataColors);

            this.legend = createLegend(
                element,
                options.interactivity && options.interactivity.isInteractiveLegend,
                this.type !== CartesianChartType.Waterfall ? this.interactivityService : undefined,
                this.axes.isScrollable);

            this.isMobileChart = options.interactivity && options.interactivity.isInteractiveLegend;
        }

        private isPlayAxis(): boolean {
            if (!this.dataViews || !this.dataViews[0])
                return false;

            let dataView = this.dataViews[0];
            let categoryRoleIsPlay: boolean = dataView.categorical
                && dataView.categorical.categories
                && dataView.categorical.categories[0]
                && dataView.categorical.categories[0].source
                && dataView.categorical.categories[0].source.roles
                && dataView.categorical.categories[0].source.roles['Play'];

            return this.type === CartesianChartType.Scatter
                && (this.animator || this.isMobileChart)
                && dataView.matrix != null
                && (!dataView.categorical || categoryRoleIsPlay);
        }

        public static getIsScalar(objects: DataViewObjects, propertyId: DataViewObjectPropertyIdentifier, type: ValueTypeDescriptor, scalarKeys?: ScalarKeys): boolean {
            if (!CartesianChart.supportsScalar(type, scalarKeys))
                return false;

            let axisTypeValue = DataViewObjects.getValue(objects, propertyId);
            if (!objects || axisTypeValue == null)
                return true;

            return (axisTypeValue === axisType.scalar);
        }

        private static supportsScalar(type: ValueTypeDescriptor, scalarKeys?: ScalarKeys): boolean {
            // if scalar key is present, it supports scalar
            if (scalarKeys && !_.isEmpty(scalarKeys.values))
                return true;

            // otherwise does not support scalar if the type is non-numeric.
            return !AxisHelper.isOrdinal(type);
        }

        public static getAdditionalTelemetry(dataView: DataView): any {
            let telemetry: any = {};

            let categoryColumn = dataView && dataView.categorical && _.first(dataView.categorical.categories);
            if (categoryColumn) {
                telemetry.axisType = visuals.CartesianChart.getIsScalar(dataView.metadata.objects, visuals.columnChartProps.categoryAxis.axisType, categoryColumn.source.type)
                    ? 'scalar'
                    : 'categorical';
            }

            return telemetry;
        }

        public static detectScalarMapping(dataViewMapping: data.CompiledDataViewMapping): boolean {
            if (!dataViewMapping || !dataViewMapping.categorical || !dataViewMapping.categorical.categories)
                return false;

            let dataViewCategories = <data.CompiledDataViewRoleForMappingWithReduction>dataViewMapping.categorical.categories;
            let categoryItems = dataViewCategories.for.in.items;
            if (_.isEmpty(categoryItems))
                return false;

            let categoryType = categoryItems[0].type;

            if (!dataViewMapping.metadata)
                return false;

            let objects = dataViewMapping.metadata.objects;

            return CartesianChart.getIsScalar(objects, columnChartProps.categoryAxis.axisType, categoryType);
        }

        private populateObjectProperties(dataViews: DataView[]) {
            if (dataViews && dataViews.length > 0) {
                let dataViewMetadata = dataViews[0].metadata;

                if (dataViewMetadata) {
                    this.legendObjectProperties = DataViewObjects.getObject(dataViewMetadata.objects, 'legend', {});
                    this.xAxisReferenceLines = DataViewObjects.getUserDefinedObjects(dataViewMetadata.objects, 'xAxisReferenceLine');
                    this.y1AxisReferenceLines = DataViewObjects.getUserDefinedObjects(dataViewMetadata.objects, 'y1AxisReferenceLine');
                }
                else {
                    this.legendObjectProperties = {};
                }

                this.categoryAxisProperties = CartesianHelper.getCategoryAxisProperties(dataViewMetadata);
                this.valueAxisProperties = CartesianHelper.getValueAxisProperties(dataViewMetadata);
            }
        }

        private updateInternal(options: VisualUpdateOptions, operationKind?: VisualDataChangeOperationKind): void {
            let dataViews = this.dataViews = options.dataViews;
            this.currentViewport = options.viewport;
            
            if (!dataViews) return;

            if (this.layers.length === 0) {
                // Lazily instantiate the chart layers on the first data load.
                let objects: DataViewObjects = this.extractMetadataObjects(dataViews);
                this.layers = this.createAndInitLayers(objects);

                debug.assert(this.layers.length > 0, 'createAndInitLayers should update the layers.');
            }
            let layers = this.layers;

            if (operationKind != null) {
                if (!_.isEmpty(dataViews)) {
                    this.populateObjectProperties(dataViews);
                    this.axes.update(dataViews);
                    this.svgAxes.update(this.categoryAxisProperties, this.valueAxisProperties);
                    let dataView = dataViews[0];
                    if (dataView.metadata) {
                        // flatten background data
                        this.background = {
                            image: DataViewObjects.getValue<ImageValue>(dataView.metadata.objects, scatterChartProps.plotArea.image),
                            transparency: DataViewObjects.getValue(dataView.metadata.objects, scatterChartProps.plotArea.transparency, visualBackgroundHelper.getDefaultTransparency()),
                        };
                        
                        let isScalar = true;
                        let categoryColumn = dataView && dataView.categorical && _.first(dataView.categorical.categories);

                        if (categoryColumn && categoryColumn.source) {
                            isScalar = visuals.CartesianChart.getIsScalar(dataView.metadata.objects, visuals.columnChartProps.categoryAxis.axisType, categoryColumn.source.type);
                        }

                        // Clear the load more handler if we're scalar and there's an existing handler. 
                        // Setup a handler if we're categorical and don't have one.
                        if (isScalar && this.loadMoreDataHandler) {
                            this.loadMoreDataHandler = null;
                        }
                        else if (!isScalar && !this.loadMoreDataHandler) {
                            this.loadMoreDataHandler = new CartesianLoadMoreDataHandler(null, this.hostServices.loadMoreData, CartesianChart.LoadMoreThreshold);
                        }
                    }
                }

                this.sharedColorPalette.clearPreferredScale();
                let layerDataViews = getLayerDataViews(dataViews);
                let trendLineDataViews = _.filter(dataViews, (dataView) => TrendLineHelper.isDataViewForRegression(dataView));
                this.trendLines = [];

                for (let i = 0, layerCount = layers.length; i < layerCount; i++) {
                    let layerDataView = layerDataViews[i];
                    layers[i].setData(layerDataView ? [layerDataView] : []);

                    if (this.supportsTrendLines(i)) {
                        let trendLineDataView = trendLineDataViews[i];
                        if (trendLineDataView) {
                            let y2 = (i > 0);
                            let trendLines = TrendLineHelper.readDataView(trendLineDataView, layerDataView, y2, this.sharedColorPalette);
                            this.trendLines.push(...trendLines);
                        }
                    }

                    if (layerCount > 1)
                        this.sharedColorPalette.rotateScale();
                }
            }
            
            // If the data changed (there's an operationKind), say we're done loading data so logic 
            // during the render phase can request more data if there is not enough.
            if (this.loadMoreDataHandler && operationKind != null) {
                this.loadMoreDataHandler.onLoadMoreDataCompleted();
            }

            this.render(!this.hasSetData || options.suppressAnimations, options.resizeMode, operationKind);

            this.hasSetData = this.hasSetData || (dataViews && dataViews.length > 0);

            if (dataViews && dataViews.length > 0) {
                let warnings = getInvalidValueWarnings(
                    dataViews,
                    false /*supportsNaN*/,
                    false /*supportsNegativeInfinity*/,
                    false /*supportsPositiveInfinity*/);

                this.axes.addWarnings(warnings);

                if (warnings && warnings.length > 0)
                    this.hostServices.setWarnings(warnings);
            }
        }

        // TODO: Remove onDataChanged & onResizing once we have a flag to distinguish between resize and data changed events.
        public onDataChanged(options: VisualDataChangedOptions): void {
            this.updateInternal({
                dataViews: options.dataViews,
                suppressAnimations: options.suppressAnimations,
                viewport: this.currentViewport
            }, options.operationKind != null ? options.operationKind : VisualDataChangeOperationKind.Create);
        }

        // TODO: Remove onDataChanged & onResizing once we have a flag to distinguish between resize and data changed events.
        public onResizing(viewport: IViewport, resizeMode?: ResizeMode): void {
            this.updateInternal({
                dataViews: this.dataViews,
                suppressAnimations: true,
                viewport: viewport,
                resizeMode: resizeMode,
            });
        }

        public scrollTo(position: number): void {
            this.scrollableAxes.scrollTo(position);
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let enumeration = new ObjectEnumerationBuilder();
            let layersLength = this.layers ? this.layers.length : 0;

            if (options.objectName === 'legend') {
                if (!this.shouldShowLegendCard())
                    return;

                let show = DataViewObject.getValue(this.legendObjectProperties, legendProps.show, this.legend.isVisible());
                let showTitle = DataViewObject.getValue(this.legendObjectProperties, legendProps.showTitle, true);
                let titleText = DataViewObject.getValue(this.legendObjectProperties, legendProps.titleText, this.layerLegendData ? this.layerLegendData.title : '');
                let labelColor = DataViewObject.getValue(this.legendObjectProperties, legendProps.labelColor, LegendData.DefaultLegendLabelFillColor);
                let fontSize = DataViewObject.getValue(this.legendObjectProperties, legendProps.fontSize, this.layerLegendData && this.layerLegendData.fontSize ? this.layerLegendData.fontSize : SVGLegend.DefaultFontSizeInPt);

                enumeration.pushInstance({
                    selector: null,
                    properties: {
                        show: show,
                        position: LegendPosition[this.legend.getOrientation()],
                        showTitle: showTitle,
                        titleText: titleText,
                        labelColor: labelColor,
                        fontSize: fontSize,
                    },
                    objectName: options.objectName
                });
            }
            else if (options.objectName === 'categoryAxis' && this.axes.hasCategoryAxis()) {
                this.getCategoryAxisValues(enumeration);
            }
            else if (options.objectName === 'valueAxis') {
                this.getValueAxisValues(enumeration);
            }
            else if (options.objectName === 'y1AxisReferenceLine') {
                let refLinedefaultColor = this.sharedColorPalette.getColorByIndex(0).value;
                ReferenceLineHelper.enumerateObjectInstances(enumeration, this.y1AxisReferenceLines, refLinedefaultColor, options.objectName);
            }
            else if (options.objectName === 'xAxisReferenceLine') {
                let refLinedefaultColor = this.sharedColorPalette.getColorByIndex(0).value;
                ReferenceLineHelper.enumerateObjectInstances(enumeration, this.xAxisReferenceLines, refLinedefaultColor, options.objectName);
            }
            else if (options.objectName === 'trend') {
                if (this.supportsTrendLines()) {
                    TrendLineHelper.enumerateObjectInstances(enumeration, this.trendLines);
                }
            }
            else if (options.objectName === 'plotArea') {
                visualBackgroundHelper.enumeratePlot(enumeration, this.background);
            }

            if (options.objectName === 'dataPoint' &&
                ComboChart.isComboChart(this.type)) {
                ComboChart.enumerateDataPoints(enumeration, options, this.layers);
            }
            else {
                for (let i = 0, len = layersLength; i < len; i++) {
                    let layer = this.layers[i];
                    if (layer.enumerateObjectInstances) {
                        layer.enumerateObjectInstances(enumeration, options);
                    }
                }
            }

            return enumeration.complete();
        }

        private supportsTrendLines(layerIndex?: number): boolean {
            let layerDataViews = getLayerDataViews(this.dataViews);

            if (_.isEmpty(this.layers))
                return false;

            // If layerIndex was not given then check all layers.
            let layers = layerIndex == null ? this.layers : [this.layers[layerIndex]];

            return _.all(layers, (layer, index) => {
                if (!layerDataViews[index])
                    return true;
                return layer.supportsTrendLine && layer.supportsTrendLine();
            });
        }

        private shouldShowLegendCard(): boolean {
            let layers = this.layers;
            let dataViews = this.dataViews;

            if (layers && dataViews) {
                let layersLength = layers.length;
                let layersWithValuesCtr = 0;

                for (let i = 0; i < layersLength; i++) {
                    if (layers[i].hasLegend()) {
                        return true;
                    }

                    // if there are at least two layers with values legend card should be shown (even if each of the individual layers don't have legend)
                    let dataView = dataViews[i];
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

        private getAxisScaleOptions(axisType: AxisLocation): string[] {
            let scaleOptions = [DEFAULT_AXIS_SCALE_TYPE];
            if (this.axes.isLogScaleAllowed(axisType))
                scaleOptions.push(axisScale.log);
            return scaleOptions;
        }

        private getCategoryAxisValues(enumeration: ObjectEnumerationBuilder): void {
            if (!this.categoryAxisProperties) {
                return;
            }
            let supportedType = axisType.both;
            let isScalar = false;
            let scaleOptions = this.getAxisScaleOptions(AxisLocation.X);

            if (this.layers && this.layers[0].getSupportedCategoryAxisType) {
                supportedType = this.layers[0].getSupportedCategoryAxisType();
                if (supportedType === axisType.scalar) {
                    isScalar = true;
                }
                else {
                    isScalar = CartesianHelper.isScalar(supportedType === axisType.both, this.categoryAxisProperties);
                }
            }

            if (!isScalar) {
                this.categoryAxisProperties['start'] = null;
                this.categoryAxisProperties['end'] = null;
            }

            let instance: VisualObjectInstance = {
                selector: null,
                properties: {},
                objectName: 'categoryAxis',
                validValues: {
                    axisScale: scaleOptions,
                    axisStyle: this.axes.categoryAxisHasUnitType ? [axisStyle.showTitleOnly, axisStyle.showUnitOnly, axisStyle.showBoth] : [axisStyle.showTitleOnly]
                }
            };

            instance.properties['show'] = this.categoryAxisProperties['show'] != null ? this.categoryAxisProperties['show'] : true;
            if (this.axes.isYAxisCategorical())//in case of e.g. barChart
                instance.properties['position'] = this.valueAxisProperties && this.valueAxisProperties['position'] != null ? this.valueAxisProperties['position'] : yAxisPosition.left;
            if (supportedType === axisType.both) {
                instance.properties['axisType'] = isScalar ? axisType.scalar : axisType.categorical;
            }
            if (isScalar) {
                instance.properties['axisScale'] = this.categoryAxisProperties['axisScale'] || DEFAULT_AXIS_SCALE_TYPE;
                instance.properties['start'] = this.categoryAxisProperties['start'];
                instance.properties['end'] = this.categoryAxisProperties['end'];
            }
            instance.properties['showAxisTitle'] = this.categoryAxisProperties['showAxisTitle'] != null ? this.categoryAxisProperties['showAxisTitle'] : false;

            instance.properties['axisStyle'] = this.categoryAxisProperties['axisStyle'] ? this.categoryAxisProperties['axisStyle'] : axisStyle.showTitleOnly;
            instance.properties['labelColor'] = this.categoryAxisProperties['labelColor'] || DEFAULT_AXIS_COLOR;

            if (isScalar) {
                instance.properties['labelDisplayUnits'] = this.categoryAxisProperties['labelDisplayUnits'] ? this.categoryAxisProperties['labelDisplayUnits'] : 0;
                let labelPrecision = this.categoryAxisProperties['labelPrecision'];
                instance.properties['labelPrecision'] = (labelPrecision === undefined || labelPrecision < 0)
                    ? dataLabelUtils.defaultLabelPrecision
                    : labelPrecision;
            }
            enumeration.pushInstance(instance);
        }

        //TODO: wrap all these object getters and other related stuff into an interface.
        private getValueAxisValues(enumeration: ObjectEnumerationBuilder): void {
            if (!this.valueAxisProperties) {
                return;
            }
            let scaleOptions = this.getAxisScaleOptions(AxisLocation.Y1);
            let secScaleOption = this.getAxisScaleOptions(AxisLocation.Y2);

            let instance: VisualObjectInstance = {
                selector: null,
                properties: {},
                objectName: 'valueAxis',
                validValues: {
                    axisScale: scaleOptions,
                    secAxisScale: secScaleOption,
                    axisStyle: this.axes.valueAxisHasUnitType ? [axisStyle.showTitleOnly, axisStyle.showUnitOnly, axisStyle.showBoth] : [axisStyle.showTitleOnly],
                    secAxisStyle: this.axes.secondaryValueAxisHasUnitType ? [axisStyle.showTitleOnly, axisStyle.showUnitOnly, axisStyle.showBoth] : [axisStyle.showTitleOnly],
                }
            };

            instance.properties['show'] = this.valueAxisProperties['show'] != null ? this.valueAxisProperties['show'] : true;
            instance.properties['axisLabel'] = this.valueAxisProperties['axisLabel'];
            if (!this.axes.isYAxisCategorical()) {
                instance.properties['position'] = this.valueAxisProperties['position'] != null ? this.valueAxisProperties['position'] : yAxisPosition.left;
            }
            instance.properties['axisScale'] = this.valueAxisProperties['axisScale'] || DEFAULT_AXIS_SCALE_TYPE;
            instance.properties['start'] = this.valueAxisProperties['start'];
            instance.properties['end'] = this.valueAxisProperties['end'];
            instance.properties['showAxisTitle'] = this.valueAxisProperties['showAxisTitle'] != null ? this.valueAxisProperties['showAxisTitle'] : false;
            instance.properties['axisStyle'] = this.valueAxisProperties['axisStyle'] != null ? this.valueAxisProperties['axisStyle'] : axisStyle.showTitleOnly;
            instance.properties['labelColor'] = this.valueAxisProperties['labelColor'] || DEFAULT_AXIS_COLOR;

            if (this.type !== CartesianChartType.HundredPercentStackedBar && this.type !== CartesianChartType.HundredPercentStackedColumn) {
                instance.properties['labelDisplayUnits'] = this.valueAxisProperties['labelDisplayUnits'] ? this.valueAxisProperties['labelDisplayUnits'] : 0;
                let labelPrecision = this.valueAxisProperties['labelPrecision'];
                instance.properties['labelPrecision'] = (labelPrecision === undefined || labelPrecision < 0)
                    ? dataLabelUtils.defaultLabelPrecision
                    : labelPrecision;
            }

            if (this.layers.length === 2) {
                instance.properties['secShow'] = this.valueAxisProperties['secShow'] != null ? this.valueAxisProperties['secShow'] : this.axes.hasY2Axis();
            }

            if (this.axes.hasY2Axis() && instance.properties['secShow']) {
                instance.properties['secAxisLabel'] = '';
                instance.properties['secPosition'] = this.valueAxisProperties['secPosition'] != null ? this.valueAxisProperties['secPosition'] : yAxisPosition.right;
                instance.properties['secAxisScale'] = this.valueAxisProperties['secAxisScale'] || DEFAULT_AXIS_SCALE_TYPE;
                instance.properties['secStart'] = this.valueAxisProperties['secStart'];
                instance.properties['secEnd'] = this.valueAxisProperties['secEnd'];
                instance.properties['secShowAxisTitle'] = this.valueAxisProperties['secShowAxisTitle'] != null ? this.valueAxisProperties['secShowAxisTitle'] : false;
                instance.properties['secAxisStyle'] = this.valueAxisProperties['secAxisStyle'] ? this.valueAxisProperties['secAxisStyle'] : axisStyle.showTitleOnly;
                instance.properties['labelColor'] = this.valueAxisProperties['secLabelColor'];
                instance.properties['secLabelDisplayUnits'] = this.valueAxisProperties['secLabelDisplayUnits'] ? this.valueAxisProperties['secLabelDisplayUnits'] : 0;
                instance.properties['secLabelPrecision'] = this.valueAxisProperties['secLabelPrecision'] < 0 ? 0 : this.valueAxisProperties['secLabelPrecision'];
            }

            enumeration.pushInstance(instance);
        }

        public onClearSelection(): void {
            if (this.hasSetData) {
                for (let i = 0, len = this.layers.length; i < len; i++) {
                    let layer = this.layers[i];
                    layer.onClearSelection();
                    layer.render(true /* suppressAnimations */);
                }
            }
        }

        private extractMetadataObjects(dataViews: DataView[]): DataViewObjects {
            let objects: DataViewObjects;
            if (dataViews && dataViews.length > 0) {
                let dataViewMetadata = dataViews[0].metadata;
                if (dataViewMetadata)
                    objects = dataViewMetadata.objects;
            }
            return objects;
        }

        private createAndInitLayers(objects: DataViewObjects): ICartesianVisual[] {
            // Create the layers
            let layers = CartesianLayerFactory.createLayers(
                this.type,
                objects,
                this.interactivityService,
                this.animator,
                this.axes.isScrollable,
                this.tooltipsEnabled,
                this.tooltipBucketEnabled,
                this.advancedLineLabelsEnabled);

            // Initialize the layers
            let cartesianOptions = <CartesianVisualInitOptions>Prototype.inherit(this.visualInitOptions);
            cartesianOptions.svg = this.svgAxes.getScrollableRegion();
            cartesianOptions.labelsContext = this.svgAxes.getLabelsRegion();
            cartesianOptions.cartesianHost = {
                updateLegend: data => this.legend.drawLegend(data, this.currentViewport),
                getSharedColors: () => this.sharedColorPalette,
                triggerRender: (suppressAnimations: boolean) => this.render(suppressAnimations),
            };
            cartesianOptions.chartType = this.type;

            for (let i = 0, len = layers.length; i < len; i++)
                layers[i].init(cartesianOptions);

            return layers;
        }

        private renderLegend(): void {
            let layers = this.layers;
            let legendData: LegendData = { title: "", dataPoints: [] };

            for (let i = 0, len = layers.length; i < len; i++) {
                this.layerLegendData = layers[i].calculateLegend();
                if (this.layerLegendData) {
                    legendData.title = i === 0 ? this.layerLegendData.title || ""
                        : legendData.title;
                    legendData.labelColor = this.layerLegendData.labelColor;
                    
                    // Data points have have duplicate identities (ex. Combo Chart uses a measure in both line and column).
                    // Add the layer number (if it's set) so the D3 keys are different.
                    if (!_.isEmpty(this.layerLegendData.dataPoints)) {
                        this.layerLegendData.dataPoints.forEach((dataPoint) => dataPoint.layerNumber = i);
                    }

                    legendData.dataPoints = legendData.dataPoints.concat(this.layerLegendData.dataPoints || []);
                    legendData.fontSize = this.layerLegendData.fontSize || SVGLegend.DefaultFontSizeInPt;
                    if (this.layerLegendData.grouped) {
                        legendData.grouped = true;
                    }
                }
            }

            let legendProperties = this.legendObjectProperties;

            if (legendProperties) {
                LegendData.update(legendData, legendProperties);
                let position = <string>legendProperties[legendProps.position];

                if (position)
                    this.legend.changeOrientation(LegendPosition[position]);
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

        private render(suppressAnimations: boolean, resizeMode?: ResizeMode, operationKind?: VisualDataChangeOperationKind): void {
            // Note: interactive legend shouldn't be rendered explicitly here
            // The interactive legend is being rendered in the render method of ICartesianVisual
            if (!(this.visualInitOptions.interactivity && this.visualInitOptions.interactivity.isInteractiveLegend)) {
                this.renderLegend();
            }

            let legendMargins = this.legendMargins = this.legend.getMargins();
            let legendOrientation = this.legend.getOrientation();
            let hideAxisLabels = this.hideAxisLabels(legendMargins);

            let plotAreaViewport: IViewport = {
                height: this.currentViewport.height - legendMargins.height,
                width: this.currentViewport.width - legendMargins.width
            };

            let padding = Prototype.inherit(SvgCartesianAxes.AxisPadding);
            let playAxisControlLayout: IRect;
            if (this.isPlayAxis()) {
                plotAreaViewport.height -= CartesianChart.PlayAxisBottomMargin;
                playAxisControlLayout = {
                    left: Legend.isLeft(legendOrientation) ? legendMargins.width : 0,
                    top: Legend.isTop(legendOrientation) ? legendMargins.height + plotAreaViewport.height : plotAreaViewport.height,
                    height: CartesianChart.PlayAxisBottomMargin,
                    width: plotAreaViewport.width
                };
            }

            this.chartAreaSvg.attr({
                'width': plotAreaViewport.width,
                'height': plotAreaViewport.height,
            });
            Legend.positionChartArea(this.chartAreaSvg, this.legend);

            let interactivityRightMargin = this.calculateInteractivityRightMargin();

            let [ensureXDomain, ensureYDomain] = this.getMinimumDomainExtents();

            let axesLayout = this.axes.negotiateAxes(
                this.layers,
                plotAreaViewport,
                padding,
                playAxisControlLayout,
                hideAxisLabels,
                CartesianChart.AxisTextProperties,
                interactivityRightMargin,
                ensureXDomain,
                ensureYDomain);
                
            let categoryAxis = axesLayout.axes.x.isCategoryAxis ? axesLayout.axes.x : axesLayout.axes.y1;
            
            if (this.loadMoreDataHandler) {
                this.loadMoreDataHandler.setScale(categoryAxis.scale);
            }

            // Even if the caller thinks animations are ok, now that we've laid out the axes and legend we should disable animations
            // if the plot area changed. Animations for property changes like legend on/off are not desired.
            let plotAreaHasChanged: boolean =
                !this.renderedPlotArea
                || (this.renderedPlotArea.height !== axesLayout.plotArea.height ||
                    this.renderedPlotArea.width !== axesLayout.plotArea.width);
            suppressAnimations = suppressAnimations || plotAreaHasChanged;

            this.scrollableAxes.render(
                axesLayout,
                this.layers,
                suppressAnimations,
                (layers, axesLayout, suppressAnimations) => this.renderPlotArea(layers, axesLayout, suppressAnimations, legendMargins, resizeMode),
                this.loadMoreDataHandler,
                operationKind === VisualDataChangeOperationKind.Append /* preserveScrollbar */);

            // attach scroll event
            this.chartAreaSvg.on('wheel', () => {
                if (!(this.axes.isXScrollBarVisible || this.axes.isYScrollBarVisible)) return;
                TooltipManager.ToolTipInstance.hide();
                let wheelEvent: any = d3.event;
                let dy = wheelEvent.deltaY;
                this.scrollableAxes.scrollDelta(dy);
                (<MouseWheelEvent>wheelEvent).preventDefault();
            });

            this.renderedPlotArea = axesLayout.plotArea;
        }

        /**
         * Gets any minimum domain extents.
         * Reference lines and trend lines may enforce minimum extents on X and/or Y domains.
         */
        private getMinimumDomainExtents(): NumberRange[] {
            let xs: number[] = [];
            let ys: number[] = [];

            if (!_.isEmpty(this.xAxisReferenceLines)) {
                let xAxisReferenceLineProperties: DataViewObject = this.xAxisReferenceLines[0].object;
                let value = ReferenceLineHelper.extractReferenceLineValue(xAxisReferenceLineProperties);
                xs.push(value);
            }

            if (!_.isEmpty(this.y1AxisReferenceLines)) {
                let y1AxisReferenceLineProperties: DataViewObject = this.y1AxisReferenceLines[0].object;
                let value = ReferenceLineHelper.extractReferenceLineValue(y1AxisReferenceLineProperties);
                ys.push(value);
            }

            let ensureXDomain: NumberRange = {
                min: d3.min(xs),
                max: d3.max(xs)
            };

            let ensureYDomain: NumberRange = {
                min: d3.min(ys),
                max: d3.max(ys)
            };

            return [ensureXDomain, ensureYDomain];
        }

        private getPlotAreaRect(axesLayout: CartesianAxesLayout, legendMargins: IViewport): IRect {
            let rect: Rect = {
                left: axesLayout.margin.left,
                top: axesLayout.margin.top,
                width: axesLayout.plotArea.width,
                height: axesLayout.plotArea.height,
            };

            // Adjust the margins to the legend position 
            if (this.legend) {
                let legendPosition = this.legend.getOrientation();

                if (Legend.isTop(legendPosition)) {
                    rect.top += legendMargins.height;
                }
                else if (Legend.isLeft(legendPosition)) {
                    rect.left += legendMargins.width;
                }
            }

            return rect;
        }

        private renderBackgroundImage(layout: IRect): void {
            visualBackgroundHelper.renderBackgroundImage(
                this.background,
                this.element,
                layout);
        }

        private hideAxisLabels(legendMargins: IViewport): boolean {
            if (this.cartesianSmallViewPortProperties) {
                if (this.cartesianSmallViewPortProperties.hideAxesOnSmallViewPort && (this.currentViewport.height < this.cartesianSmallViewPortProperties.MinHeightAxesVisible) && !this.visualInitOptions.interactivity.isInteractiveLegend) {
                    return true;
                }
            }
            return false;
        }

        private calculateInteractivityRightMargin(): number {
            // add right margin in order not to cut the circle selection of the hover line 
            if (this.visualInitOptions.interactivity && this.visualInitOptions.interactivity.isInteractiveLegend && !this.trimOrdinalDataOnOverflow) {
                return INTERACTIVITY_RIGHT_MARGIN;
            } else {
                return 0;
            }
        }

        private renderPlotArea(
            layers: ICartesianVisual[],
            axesLayout: CartesianAxesLayout,
            suppressAnimations: boolean,
            legendMargins: IViewport,
            resizeMode?: ResizeMode): void {
            debug.assertValue(layers, 'layers');

            let axes = axesLayout.axes;
            let plotArea = axesLayout.plotArea;
            let plotAreaRect = this.getPlotAreaRect(axesLayout, legendMargins);
            let duration = AnimatorCommon.GetAnimationDuration(this.animator, suppressAnimations);
            let easing = this.animator && this.animator.getEasing();

            this.renderBackgroundImage(plotAreaRect);

            if (!_.isEmpty(easing))
                this.svgAxes.renderAxes(axesLayout, duration, easing);
            else
                this.svgAxes.renderAxes(axesLayout, duration);

            this.renderReferenceLines(axesLayout);

            this.renderLayers(layers, plotArea, axes, suppressAnimations, resizeMode);

            this.renderTrendLines(axesLayout);
        }

        private renderTrendLines(axesLayout: CartesianAxesLayout): void {
            let scrollableRegion = this.svgAxes.getScrollableRegion();
            TrendLineHelper.render(this.trendLines, scrollableRegion, axesLayout.axes, axesLayout.plotArea);
        }

        private renderReferenceLines(axesLayout: CartesianAxesLayout): void {
            let axes = axesLayout.axes;
            let plotArea = axesLayout.plotArea;
            let scrollableRegion = this.svgAxes.getScrollableRegion();
            let refLineDefaultColor = this.sharedColorPalette.getColorByIndex(0).value;

            let showY1ReferenceLines = false;
            if (this.y1AxisReferenceLines) {
                for (let referenceLineProperties of this.y1AxisReferenceLines) {
                    let object: DataViewObject = referenceLineProperties.object;
                    if (object[ReferenceLineHelper.referenceLineProps.show]) {

                        let isHorizontal = !axes.y1.isCategoryAxis;
                        let y1RefLineOptions = {
                            graphicContext: scrollableRegion,
                            referenceLineProperties: object,
                            axes: axes,
                            viewport: plotArea,
                            classAndSelector: this.y1RefLine,
                            defaultColor: refLineDefaultColor,
                            isHorizontal: isHorizontal
                        };

                        ReferenceLineHelper.render(y1RefLineOptions);
                        showY1ReferenceLines = true;
                    }
                }
            }

            if (!showY1ReferenceLines) {
                scrollableRegion.selectAll(this.y1RefLine.selector).remove();
            }

            let showXReferenceLines = false;
            if (this.xAxisReferenceLines) {
                for (let referenceLineProperties of this.xAxisReferenceLines) {
                    let object: DataViewObject = referenceLineProperties.object;
                    if (object[ReferenceLineHelper.referenceLineProps.show]) {
                        let isHorizontal = false;
                        let xRefLineOptions = {
                            graphicContext: scrollableRegion,
                            referenceLineProperties: object,
                            axes: axes,
                            viewport: plotArea,
                            classAndSelector: this.xRefLine,
                            defaultColor: refLineDefaultColor,
                            isHorizontal: isHorizontal
                        };

                        ReferenceLineHelper.render(xRefLineOptions);
                        showXReferenceLines = true;
                    }
                }
            }

            if (!showXReferenceLines) {
                scrollableRegion.selectAll(this.xRefLine.selector).remove();
            }
        }

        private getReferenceLineLabels(axes: CartesianAxisProperties, plotArea: IViewport): LabelDataPoint[] {
            let refLineDefaultColor = this.sharedColorPalette.getColorByIndex(0).value;
            let referenceLineLabels: LabelDataPoint[] = [];
            if (this.y1AxisReferenceLines) {
                for (let referenceLineProperties of this.y1AxisReferenceLines) {
                    let object: DataViewObject = referenceLineProperties.object;
                    if (object[ReferenceLineHelper.referenceLineProps.show] && object[ReferenceLineHelper.referenceLineProps.dataLabelShow]) {
                        let isHorizontal = !axes.y1.isCategoryAxis;
                        let y1RefLineLabelOptions: ReferenceLineDataLabelOptions = {
                            referenceLineProperties: object,
                            axes: axes,
                            viewport: plotArea,
                            defaultColor: refLineDefaultColor,
                            isHorizontal: isHorizontal,
                            key: JSON.stringify({
                                type: 'y1AxisReferenceLine',
                                id: referenceLineProperties.id,
                            }),
                        };

                        referenceLineLabels.push(ReferenceLineHelper.createLabelDataPoint(y1RefLineLabelOptions));
                    }
                }
            }

            if (this.xAxisReferenceLines) {
                for (let referenceLineProperties of this.xAxisReferenceLines) {
                    let object: DataViewObject = referenceLineProperties.object;
                    if (object[ReferenceLineHelper.referenceLineProps.show] && object[ReferenceLineHelper.referenceLineProps.dataLabelShow]) {
                        let isHorizontal = false;
                        let xRefLineLabelOptions: ReferenceLineDataLabelOptions = {
                            referenceLineProperties: object,
                            axes: axes,
                            viewport: plotArea,
                            defaultColor: refLineDefaultColor,
                            isHorizontal: isHorizontal,
                            key: JSON.stringify({
                                type: 'xAxisReferenceLine',
                                id: referenceLineProperties.id,
                            }),
                        };

                        referenceLineLabels.push(ReferenceLineHelper.createLabelDataPoint(xRefLineLabelOptions));
                    }
                }
            }

            return referenceLineLabels;
        }

        private renderDataLabels(labelDataPointGroups: LabelDataPointGroup[], labelsAreNumeric: boolean, plotArea: IViewport, suppressAnimations: boolean, isCombo: boolean): void {
            let labelBackgroundRegion = this.svgAxes.getLabelBackground();
            let labelRegion = this.svgAxes.getLabelsRegion();

            if (this.behavior) {
                let labelLayoutOptions = NewDataLabelUtils.getDataLabelLayoutOptions(this.type);
                let labelLayout = new LabelLayout(labelLayoutOptions);
                let dataLabels = labelLayout.layout(labelDataPointGroups, plotArea);

                if (isCombo) {
                    NewDataLabelUtils.drawLabelBackground(labelBackgroundRegion, dataLabels, "#FFFFFF", 0.7);
                }

                let svgLabels: D3.UpdateSelection;
                let animator = this.animator;
                if (animator && !suppressAnimations) {
                    let isPlayAxis = this.isPlayAxis();
                    let duration = isPlayAxis ? PlayChart.FrameAnimationDuration : animator.getDuration();
                    svgLabels = NewDataLabelUtils.animateDefaultLabels(
                        labelRegion,
                        dataLabels,
                        duration,
                        labelsAreNumeric,
                        isPlayAxis ? 'linear' : animator.getEasing());
                }
                else {
                    svgLabels = NewDataLabelUtils.drawDefaultLabels(labelRegion, dataLabels, labelsAreNumeric);
                }

                if (labelLayoutOptions.allowLeaderLines) {
                    let filteredLabels = _.filter(dataLabels, (d: Label) => d.leaderLinePoints != null && !_.isEmpty(d.leaderLinePoints) && d.identity != null);
                    NewDataLabelUtils.drawLabelLeaderLines(labelRegion, filteredLabels, (d: Label) => d.identity.getKey());
                }

                if (this.interactivityService && this.isLabelInteractivityEnabled) {
                    let labelsBehaviorOptions: LabelsBehaviorOptions = {
                        labelItems: svgLabels,
                    };
                    this.interactivityService.bind(dataLabels, new LabelsBehavior(), labelsBehaviorOptions, { isLabels: true });
                }
            }
            else {
                let labelLayout = new LabelLayout({
                    maximumOffset: NewDataLabelUtils.maxLabelOffset,
                    startingOffset: NewDataLabelUtils.startingLabelOffset,
                    attemptToMoveLabelsIntoViewport: true,
                });

                let dataLabels = labelLayout.layout(labelDataPointGroups, plotArea);

                if (isCombo) {
                    NewDataLabelUtils.drawLabelBackground(labelBackgroundRegion, dataLabels, "#FFFFFF", 0.7);
                }
                NewDataLabelUtils.drawDefaultLabels(labelRegion, dataLabels, labelsAreNumeric);
            }
        }

        private renderLayers(layers: ICartesianVisual[], plotArea: IViewport, axes: CartesianAxisProperties, suppressAnimations: boolean, resizeMode?: ResizeMode): void {
            let labelDataPointGroups: LabelDataPointGroup[] = [];
            let dataPoints: SelectableDataPoint[] = [];
            let layerBehaviorOptions: any[] = [];
            let labelsAreNumeric: boolean = true;

            // some layer (e.g. scatterChart) may want to suppress animations. if any does, suppress for all.
            if (!suppressAnimations) {
                for (let layer of layers) {
                    if (layer.shouldSuppressAnimation && layer.shouldSuppressAnimation()) {
                        suppressAnimations = true;
                        break;
                    }
                }
            }

            for (let layer of layers) {
                let result = layer.render(suppressAnimations, resizeMode);
                if (result) {
                    if (this.behavior) {
                        // NOTE: these are not needed if we don't have interactivity
                        dataPoints = dataPoints.concat(result.dataPoints);
                        layerBehaviorOptions.push(result.behaviorOptions);
                    }

                    if (result.labelDataPointGroups) {
                        let resultLabelDataPointsGroups = result.labelDataPointGroups;
                        for (let resultLabelDataPointsGroup of resultLabelDataPointsGroups) {
                            if (!resultLabelDataPointsGroup)
                                continue;
                            labelDataPointGroups.push({
                                labelDataPoints: NewDataLabelUtils.removeDuplicates(resultLabelDataPointsGroup.labelDataPoints || []),
                                maxNumberOfLabels: resultLabelDataPointsGroup.maxNumberOfLabels,
                            });
                        }
                    }
                    else {
                        let resultsLabelDataPoints = result.labelDataPoints || [];
                        labelDataPointGroups.push({
                            labelDataPoints: NewDataLabelUtils.removeDuplicates(resultsLabelDataPoints),
                            maxNumberOfLabels: resultsLabelDataPoints.length,
                        });
                    }

                    labelsAreNumeric = labelsAreNumeric && result.labelsAreNumeric;
                }
            }

            let referenceLineLabels = this.getReferenceLineLabels(axes, plotArea);
            if (!_.isEmpty(referenceLineLabels)) {
                labelDataPointGroups.unshift({
                    labelDataPoints: referenceLineLabels,
                    maxNumberOfLabels: referenceLineLabels.length,
                });
            }

            this.renderDataLabels(
                labelDataPointGroups,
                labelsAreNumeric,
                plotArea,
                suppressAnimations,
                ComboChart.isComboChart(this.type));

            if (this.interactivityService) {
                let behaviorOptions: CartesianBehaviorOptions = {
                    layerOptions: layerBehaviorOptions,
                    clearCatcher: this.clearCatcher,
                };

                this.interactivityService.bind(dataPoints, this.behavior, behaviorOptions);
            }
        }

        /**
         * Returns the actual viewportWidth if visual is not scrollable.
         * @return If visual is scrollable, returns the plot area needed to draw all the datapoints.
         */
        public static getPreferredPlotArea(
            categoryCount: number,
            categoryThickness: number,
            viewport: IViewport,
            isScrollable: boolean,
            isScalar: boolean,
            margin?: IMargin,
            noOuterPadding?: boolean): IViewport {

            if (!margin)
                margin = { top: 0, right: 0, bottom: 0, left: 0 };

            let plotArea: IViewport = {
                height: viewport.height - margin.top - margin.bottom,
                width: viewport.width - margin.left - margin.right
            };
            if (!isScalar && isScrollable) {
                let preferredCategorySpan = CartesianChart.getPreferredCategorySpan(categoryCount, categoryThickness, noOuterPadding);
                plotArea.width = Math.max(preferredCategorySpan, plotArea.width);
            }
            return plotArea;
        }

        /**
         * Returns preferred Category span if the visual is scrollable.
         */
        public static getPreferredCategorySpan(categoryCount: number, categoryThickness: number, noOuterPadding?: boolean): number {
            let span = (categoryThickness * categoryCount);
            if (noOuterPadding)
                return span;
            return span + (categoryThickness * CartesianChart.OuterPaddingRatio * 2);
        }
        
        /**
         * Note: Public for testing access.
         */
        public static getLayout(data: ColumnChartData, options: CategoryLayoutOptions): CategoryLayout {
            let categoryCount = options.categoryCount,
                availableWidth = options.availableWidth,
                domain = options.domain,
                trimOrdinalDataOnOverflow = options.trimOrdinalDataOnOverflow,
                isScalar = !!options.isScalar,
                isScrollable = !!options.isScrollable;

            let categoryThickness = CartesianChart.getCategoryThickness(data ? data.series : null, categoryCount, availableWidth, domain, isScalar, trimOrdinalDataOnOverflow);

            // Total width of the outer padding, the padding that exist on the far right and far left of the chart.
            let totalOuterPadding = categoryThickness * CartesianChart.OuterPaddingRatio * 2;

            // visibleCategoryCount will be used to discard data that overflows on ordinal-axis charts.
            // Needed for dashboard visuals            
            let calculatedBarCount = Double.floorWithPrecision((availableWidth - totalOuterPadding) / categoryThickness);
            let visibleCategoryCount = Math.min(calculatedBarCount, categoryCount);
            let willScroll = visibleCategoryCount < categoryCount && isScrollable;

            let outerPaddingRatio = CartesianChart.OuterPaddingRatio;
            if (!isScalar && !willScroll) {
                // use dynamic outer padding to improve spacing when we have few categories
                let oneOuterPadding = (availableWidth - (categoryThickness * visibleCategoryCount)) / 2;
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
        public static getCategoryThickness(seriesList: CartesianSeries[], numCategories: number, plotLength: number, domain: number[], isScalar: boolean, trimOrdinalDataOnOverflow: boolean): number {
            let thickness;
            if (numCategories < 2)
                thickness = plotLength * (1 - CartesianChart.OuterPaddingRatio);
            else if (isScalar && domain && domain.length > 1) {
                // the smallest interval defines the column width.
                let minInterval = CartesianChart.getMinInterval(seriesList);
                let domainSpan = domain[domain.length - 1] - domain[0];
                // account for outside padding
                let ratio = minInterval / (domainSpan + (minInterval * CartesianChart.OuterPaddingRatio * 2));
                thickness = plotLength * ratio;
                thickness = Math.max(thickness, CartesianChart.MinScalarRectThickness);
            }
            else {
                // Divide the available width up including outer padding (in terms of category thickness) on
                // both sides of the chart, and categoryCount categories. Reverse math:
                // availableWidth = (categoryThickness * categoryCount) + (categoryThickness * (outerPadding * 2)),
                // availableWidth = categoryThickness * (categoryCount + (outerPadding * 2)),
                // categoryThickness = availableWidth / (categoryCount + (outerpadding * 2))
                thickness = plotLength / (numCategories + (CartesianChart.OuterPaddingRatio * 2));
                if (trimOrdinalDataOnOverflow) {
                    thickness = Math.max(thickness, CartesianChart.MinOrdinalRectThickness);
                }
            }
            
            // spec calls for using the whole plot area, but the max rectangle thickness is "as if there were three categories"
            // (outerPaddingRatio has the same units as '# of categories' so they can be added)
            let maxRectThickness = plotLength / (3 + (CartesianChart.OuterPaddingRatio * 2));

            thickness = Math.min(thickness, maxRectThickness);

            if (!isScalar && numCategories >= 3 && trimOrdinalDataOnOverflow) {
                return Math.max(thickness, CartesianChart.MinOrdinalRectThickness);
            }

            return thickness;
        }

        private static getMinInterval(seriesList: CartesianSeries[]): number {
            let minInterval = Number.MAX_VALUE;
            if (seriesList.length > 0) {
                let series0data = seriesList[0].data.filter(d => !d.highlight);
                for (let i = 0, ilen = series0data.length - 1; i < ilen; i++) {
                    minInterval = Math.min(minInterval, Math.abs(series0data[i + 1].categoryValue - series0data[i].categoryValue));
                }
            }
            return minInterval;
        }
        
        /**
         * Expands the category data reduction algorithm window if there are no series in any of the data view mappings.
         */
        public static expandCategoryWindow(mappings: powerbi.data.CompiledDataViewMapping[]): void {
            const NoSeriesWindowCount: number = 1000;

            if (!shouldExpandCategoryWindow(mappings)) {
                return;
            }

            for (let mapping of mappings) {
                if (!mapping.categorical) {
                    return;
                }

                let categories = <data.CompiledDataViewRoleForMappingWithReduction>mapping.categorical.categories;

                if (!categories) {
                    return;
                }

                debug.assertValue(categories.dataReductionAlgorithm, 'categories does not have dataReductionAlgorithm');
                debug.assertValue(categories.dataReductionAlgorithm.window, 'dataReductionAlgorithm does not have a window');

                categories.dataReductionAlgorithm = {
                    window: { count: NoSeriesWindowCount }
                };
            }
        }
    }

    /**
     * Determines if the category window should be expanded. The window should be expanded if there are no series in any of the data view mappings.
     */
    function shouldExpandCategoryWindow(mappings: powerbi.data.CompiledDataViewMapping[]): boolean {
        if (_.isEmpty(mappings)) {
            return false;
        }

        // Check if any of the mappings have series
        let hasSeries = _.any(mappings, (mapping: powerbi.data.CompiledDataViewMapping): boolean => {
            let categorical = mapping.categorical;

            if (!categorical) {
                return false;
            }

            let categories = <data.CompiledDataViewRoleForMappingWithReduction>categorical.categories;

            if (!categories) {
                return false;
            }

            let values = <data.CompiledDataViewGroupedRoleMapping>categorical.values;

            return !!(values && values.group && values.group.by && !_.isEmpty(values.group.by.items));
        });

        return !hasSeries;
    }

    function getLayerDataViews(dataViews: DataView[]): DataView[] {
        if (_.isEmpty(dataViews))
            return [];

        // TODO: figure out a more general way to correlate between layers and input data views.
        return _.filter(dataViews, (dataView) => !TrendLineHelper.isDataViewForRegression(dataView));
    }

    function hasMultipleYAxes(layers: ICartesianVisual[]): boolean {
        debug.assertValue(layers, 'layers');

        return layers.length > 1;
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

    function tryMergeYDomains(layers: ICartesianVisual[], visualOptions: CalculateScaleAndDomainOptions): MergedValueAxisResult {
        debug.assert(layers.length < 3, 'merging of more than 2 layers is not supported');

        let noMerge: MergedValueAxisResult = {
            domain: undefined,
            merged: false,
            tickCount: undefined
        };

        if (layers.length < 2)
            return noMerge;

        let min: number;
        let max: number;
        let minOfMax: number;
        let maxOfMin: number;

        // TODO: replace full calculateAxesProperties with just a data domain calc
        // we need to be aware of which chart require zero (column/bar) and which don't (line)
        let y1props = layers[0].calculateAxesProperties(visualOptions)[1];
        let y2props = layers[1].calculateAxesProperties(visualOptions)[1];
        let firstYDomain = y1props.scale.domain();
        let secondYDomain = y2props.scale.domain();

        if (y1props.values && y1props.values.length > 0 && y2props.values && y2props.values.length > 0) {
            noMerge.tickCount = Math.max(y1props.values.length, y2props.values.length);
        }

        min = Math.min(firstYDomain[0], secondYDomain[0]);
        max = Math.max(firstYDomain[1], secondYDomain[1]);

        if (visualOptions.forceMerge) {
            return {
                domain: [min, max],
                merged: true,
                tickCount: noMerge.tickCount
            };
        }

        // If domains don't intersect don't merge axis.
        if (firstYDomain[0] > secondYDomain[1] || firstYDomain[1] < secondYDomain[0])
            return noMerge;

        maxOfMin = Math.max(firstYDomain[0], secondYDomain[0]);
        minOfMax = Math.min(firstYDomain[1], secondYDomain[1]);

        let range = (max - min);

        if (range === 0) {
            return noMerge;
        }

        let intersection = Math.abs((minOfMax - maxOfMin) / range);

        // Only merge if intersection of domains greater than 10% of total range.
        if (intersection < COMBOCHART_DOMAIN_OVERLAP_TRESHOLD_PERCENTAGE)
            return noMerge;
        else
            return {
                domain: [min, max],
                merged: true,
                tickCount: noMerge.tickCount
            };
    }

    export const enum AxisLocation {
        X,
        Y1,
        Y2,
    }

    export interface CartesianAxesLayout {
        axes: CartesianAxisProperties;
        margin: IMargin;
        marginLimits: IMargin;
        axisLabels: ChartAxesLabels;
        viewport: IViewport;
        plotArea: IViewport;
        preferredPlotArea: IViewport;
        tickLabelMargins: any;
        tickPadding: IMargin;
        rotateXTickLabels90?: boolean;
    }

    class SvgBrush {
        private element: D3.Selection;
        private brushGraphicsContext: D3.Selection;
        private brush: D3.Svg.Brush;
        private brushWidth: number;
        private scrollCallback: () => void;
        private isHorizontal: boolean;
        private brushStartExtent: number[];

        private static events = {
            brushStart: 'brushstart',
            brush: 'brush',
            brushEnd: 'brushend'
        };

        private static Brush = createClassAndSelector('brush');

        constructor(brushWidth: number) {
            this.brush = d3.svg.brush();
            this.brushWidth = brushWidth;
        }

        public init(element: D3.Selection): void {
            this.element = element;
        }

        public remove(): void {
            this.element.selectAll(SvgBrush.Brush.selector).remove();
            // Remove the listeners
            this.brush
                .on(SvgBrush.events.brushStart, null)
                .on(SvgBrush.events.brush, null)
                .on(SvgBrush.events.brushEnd, null);
            this.brushGraphicsContext = undefined;
        }

        public getExtent(): number[] {
            return this.brush.extent();
        }

        public setExtent(extent: number[]): void {
            this.brush.extent(extent);
        }

        public setScale(scale: D3.Scale.OrdinalScale): void {
            if (this.isHorizontal)
                this.brush.x(scale);
            else
                this.brush.y(scale);
        }

        public setOrientation(isHorizontal: boolean): void {
            this.isHorizontal = isHorizontal;
        }

        public renderBrush(
            extentLength: number,
            brushX: number,
            brushY: number,
            scrollCallback: () => void): void {

            // create graphics context if it doesn't exist
            if (!this.brushGraphicsContext) {
                this.brushGraphicsContext = this.element.append("g")
                    .classed(SvgBrush.Brush.class, true);
            }

            this.scrollCallback = scrollCallback;
            
            // events
            this.brush
                .on(SvgBrush.events.brushStart, () => this.brushStartExtent = this.brush.extent())
                .on(SvgBrush.events.brush, () => {
                    window.requestAnimationFrame(scrollCallback);
                })
                .on(SvgBrush.events.brushEnd, () => {
                    this.resizeExtent(extentLength);
                    this.updateExtentPosition(extentLength);
                    this.brushStartExtent = null;
                });

            // position the graphics context
            let brushContext = this.brushGraphicsContext
                .attr({
                    "transform": SVGUtil.translate(brushX, brushY),
                    "drag-resize-disabled": "true" /* Disables resizing of the visual when dragging the scrollbar in edit mode */
                })
                .call(this.brush);
              
            // Disable the zooming feature by removing the resize elements
            brushContext.selectAll(".resize")
                .remove();

            if (this.isHorizontal)
                brushContext.selectAll("rect").attr("height", this.brushWidth);
            else
                brushContext.selectAll("rect").attr("width", this.brushWidth);
        }

        public scroll(scrollBarLength: number): void {
            this.updateExtentPosition(scrollBarLength);
            this.scrollCallback();
        }

        private updateExtentPosition(scrollBarLength: number): void {
            let extent = this.brush.extent();
            debug.assertNonEmpty(extent, 'updateExtentPosition, extent');
            let newStartPos = extent[0];
            let halfScrollBarLen = scrollBarLength / 2;

            if (extent[0] === extent[1]) {
                // user clicked on the brush background, width will be zero, offset x by half width
                newStartPos = newStartPos - halfScrollBarLen;
            }

            if (extent[1] - extent[0] > scrollBarLength) {
                // user is dragging one edge after mousedown in the background, figure out which side is moving
                // also, center up on the new extent center
                let halfDragLength = (extent[1] - extent[0]) / 2;
                if (extent[0] < this.brushStartExtent[0])
                    newStartPos = extent[0] + halfDragLength - halfScrollBarLen;
                else
                    newStartPos = extent[1] - halfDragLength - halfScrollBarLen;
            }

            if (this.isHorizontal)
                this.brushGraphicsContext.select(".extent").attr('x', newStartPos);
            else
                this.brushGraphicsContext.select(".extent").attr('y', newStartPos);
        }

        private resizeExtent(extentLength: number): void {
            if (this.isHorizontal)
                this.brushGraphicsContext.select(".extent").attr("width", extentLength);
            else
                this.brushGraphicsContext.select(".extent").attr("height", extentLength);
        }
    }

    class ScrollableAxes {
        public static ScrollbarWidth = 10;

        private brush: SvgBrush;
        private brushMinExtent: number;
        private scrollScale: D3.Scale.OrdinalScale;
        private axisScale: D3.Scale.OrdinalScale;

        private axes: CartesianAxes;

        constructor(axes: CartesianAxes, svgBrush: SvgBrush) {
            this.axes = axes;
            this.brush = svgBrush;
        }

        private filterDataToViewport(
            mainAxisScale: D3.Scale.OrdinalScale,
            layers: ICartesianVisual[],
            axes: CartesianAxisProperties,
            scrollScale: D3.Scale.OrdinalScale,
            extent: number[],
            visibleCategoryCount: number): ViewportDataRange {

            if (!scrollScale) {
                return;
            }

            let selected: number[];
            let data: CartesianData[] = [];

            // NOTE: using start + numVisibleCategories to make sure we don't have issues with exactness related to extent start/end
            //      (don't use extent[1])
            /*
             When extent[0] and extent[1] are very close to the boundary of a new index, due to floating point err,
             the "start" might move to the next index but the "end" might not change until you slide one more pixel.
             It makes things really jittery during scrolling, sometimes you see N columns and sometimes you briefly see N+1.
            */
            let startIndex = AxisHelper.lookupOrdinalIndex(scrollScale, extent[0]);
            let endIndex = startIndex + visibleCategoryCount; // NOTE: intentionally 1 past end index

            let domain = scrollScale.domain();
            selected = domain.slice(startIndex, endIndex); // NOTE: Up to but not including 'end'

            if (_.isEqual(selected, mainAxisScale.domain())) {
                return; //no need to do any more work
            }

            if (selected && selected.length > 0) {
                for (let i = 0; i < layers.length; i++) {
                    data[i] = layers[i].setFilteredData(selected[0], selected[selected.length - 1] + 1);
                }
                mainAxisScale.domain(selected);

                let axisPropsToUpdate: IAxisProperties;
                if (this.axes.isXScrollBarVisible) {
                    axisPropsToUpdate = axes.x;
                }
                else {
                    axisPropsToUpdate = axes.y1;
                }

                axisPropsToUpdate.axis.scale(mainAxisScale);
                axisPropsToUpdate.scale(mainAxisScale);

                // tick values are indices for ordinal axes
                axisPropsToUpdate.axis.ticks(selected.length);
                axisPropsToUpdate.axis.tickValues(selected);

                // use the original tick format to format the tick values
                let tickFormat = axisPropsToUpdate.axis.tickFormat();
                axisPropsToUpdate.values = _.map(selected, (d) => tickFormat(d));
            }

            return {
                startIndex: startIndex,
                endIndex: endIndex - 1 // Subtract 1 since it's actually 1 past the end index
            };
        }

        public render(
            axesLayout: CartesianAxesLayout,
            layers: ICartesianVisual[],
            suppressAnimations: boolean,
            renderDelegate: RenderPlotAreaDelegate,
            loadMoreDataHandler?: CartesianLoadMoreDataHandler,
            preserveScrollPosition?: boolean): void {

            let plotArea = axesLayout.plotArea;

            if (plotArea.width < 1 || plotArea.height < 1)
                return; //do nothing - too small

            this.axisScale = null;
            let brushX: number;
            let brushY: number;
            let scrollbarLength: number;
            let numVisibleCategories: number;
            let categoryThickness: number;
            let newAxisLength: number;

            let showingScrollBar = this.axes.isXScrollBarVisible || this.axes.isYScrollBarVisible;

            // If the scrollbars are visible, calculate values.
            // We also need to calculate values if we have a loadMoreData handler since they're used to make sure we have enough 
            // data to fill the viewport (even if there aren't any scrollbars).
            if (loadMoreDataHandler || showingScrollBar) {
                if (!this.axes.isYAxisCategorical()) {
                    this.axisScale = <D3.Scale.OrdinalScale>axesLayout.axes.x.scale;
                    brushX = axesLayout.margin.left;
                    brushY = axesLayout.viewport.height;
                    categoryThickness = axesLayout.axes.x.categoryThickness;
                    let outerPadding = axesLayout.axes.x.outerPadding;
                    numVisibleCategories = Double.floorWithPrecision((plotArea.width - outerPadding * 2) / categoryThickness);
                    scrollbarLength = (numVisibleCategories + 1) * categoryThickness;
                    newAxisLength = plotArea.width;
                }
                else {
                    this.axisScale = <D3.Scale.OrdinalScale>axesLayout.axes.y1.scale;
                    brushX = axesLayout.viewport.width;
                    brushY = axesLayout.margin.top;
                    categoryThickness = axesLayout.axes.y1.categoryThickness;
                    let outerPadding = axesLayout.axes.y1.outerPadding;
                    numVisibleCategories = Double.floorWithPrecision((plotArea.height - outerPadding * 2) / categoryThickness);
                    scrollbarLength = (numVisibleCategories + 1) * categoryThickness;
                    newAxisLength = plotArea.height;
                }
            }

            // No scrollbars, render the chart normally.
            if (!showingScrollBar) {

                // Load more data if we don't have enough.
                // The window size should be big enough so we don't hit this code, but it's here as a backup.
                if (loadMoreDataHandler) {
                    loadMoreDataHandler.viewportDataRange = { startIndex: 0, endIndex: numVisibleCategories };

                    if (loadMoreDataHandler.shouldLoadMoreData()) {
                        loadMoreDataHandler.loadMoreData();
                    }
                }

                this.brush.remove();
                renderDelegate(layers, axesLayout, suppressAnimations);
                return;
            }

            // viewport is REALLY small
            if (numVisibleCategories < 1) {
                return; // don't do anything
            }

            this.scrollScale = this.axisScale.copy();
            this.scrollScale.rangeBands([0, scrollbarLength]); //no inner/outer padding, keep the math simple
            this.brushMinExtent = this.scrollScale(numVisibleCategories - 1);

            // Options: use newAxisLength to squeeze-pop and keep the chart balanced, 
            //          or use scrollbarLength to keep rects still - but it leaves unbalanced right edge
            // 1. newAxisLength ex: As you resize smaller we constantly adjust the inner/outer padding to keep things balanced with the same # of rects, 
            //      when we need to drop a rect we pop out the rectangle and the padding seems to jump (to keep things cenetered and balanced). 
            // 2. scrollbarLenghth ex: As you resize smaller we can leave all rectangles in the exact same place, no squeezing inner/outer padding,
            //      when we need to drop a rect we just remove it - but this leaves the right side with lots of empty room (bad for dashboard tiles)
            // we are using option 1 to squeeze pop and show balanced layout at all sizes, but this is the less ideal experience during resize.
            // we should consider using option 2 during resize, then switch to option 1 when resize ends.
            this.axisScale.rangeBands([0, newAxisLength], CartesianChart.InnerPaddingRatio, CartesianChart.OuterPaddingRatio);

            this.brush.setOrientation(this.axes.isXScrollBarVisible);
            this.brush.setScale(this.scrollScale);
            this.brush.setExtent([0, this.brushMinExtent]);

            // This function will be called whenever we scroll.
            let renderOnScroll = (extent: number[], suppressAnimations: boolean) => {
                let dataRange = this.filterDataToViewport(this.axisScale, layers, axesLayout.axes, this.scrollScale, extent, numVisibleCategories);
                if (dataRange == null)
                    return;
                
                if (loadMoreDataHandler) {
                    loadMoreDataHandler.viewportDataRange = dataRange;
                
                    if (loadMoreDataHandler.shouldLoadMoreData()) {
                        loadMoreDataHandler.loadMoreData();
                    }
                }

                renderDelegate(layers, axesLayout, suppressAnimations);
            };

            let scrollCallback = () => this.onBrushed(scrollbarLength, renderOnScroll);
            this.brush.renderBrush(this.brushMinExtent, brushX, brushY, scrollCallback);

            // Either scroll to the specified location or simply render the visual.
            if (preserveScrollPosition && loadMoreDataHandler) {
                let startIndex = loadMoreDataHandler.viewportDataRange ? loadMoreDataHandler.viewportDataRange.startIndex : 0;

                // Clamp 1st to update the size of the extent, then scroll to the new index
                ScrollableAxes.clampBrushExtent(this.brush, scrollbarLength, this.brushMinExtent);

                // ScrollTo takes care of the rendering
                this.scrollTo(startIndex);
            }
            else {
                renderOnScroll(this.brush.getExtent(), suppressAnimations);
            }
        }

        public scrollDelta(delta): void {
            if (this.axisScale && !_.isEmpty(this.axisScale.domain())) {
                let currentStartIndex = this.axisScale.domain()[0];
                let newStartIndex = currentStartIndex + Math.round(delta / CartesianChart.MinOrdinalRectThickness);
                this.scrollTo(newStartIndex);
            }
        }

        // PUBLIC FOR UNIT TESTING ONLY
        public scrollTo(startIndex: number): void {
            debug.assert(this.axes.isXScrollBarVisible || this.axes.isYScrollBarVisible, 'scrolling is not available');
            debug.assertValue(this.scrollScale, 'scrollScale');

            let lastIndex = _.last(this.scrollScale.domain());
            startIndex = Math.max(0, Math.min(startIndex, lastIndex));

            let extent = this.brush.getExtent();
            let extentLength = extent[1] - extent[0];
            let halfCategoryThickness = (this.scrollScale(1) - this.scrollScale(0)) / 2;
            extent[0] = this.scrollScale(startIndex) + halfCategoryThickness;
            extent[1] = extent[0] + extentLength + halfCategoryThickness;
            this.brush.setExtent(extent);

            let scrollbarLength = this.scrollScale.rangeExtent()[1];
            ScrollableAxes.clampBrushExtent(this.brush, scrollbarLength, this.brushMinExtent);
            this.brush.scroll(scrollbarLength);
        }

        private onBrushed(scrollbarLength: number, render: (extent: number[], suppressAnimations: boolean) => void): void {
            let brush = this.brush;

            ScrollableAxes.clampBrushExtent(this.brush, scrollbarLength, this.brushMinExtent);
            let extent = brush.getExtent();
            render(extent, /*suppressAnimations*/ true);
        }

        private static clampBrushExtent(brush: SvgBrush, scrollbarLength: number, minExtent: number): void {
            let extent = brush.getExtent();
            let width = extent[1] - extent[0];

            if (width === minExtent && extent[1] <= scrollbarLength && extent[0] >= 0)
                return;

            if (width > minExtent) {
                let padding = (width - minExtent) / 2;
                extent[0] += padding;
                extent[1] -= padding;
            }

            else if (width < minExtent) {
                let padding = (minExtent - width) / 2;
                extent[0] -= padding;
                extent[1] += padding;
            }

            if (extent[0] < 0) {
                extent[0] = 0;
                extent[1] = minExtent;
            }

            else if (extent[0] > scrollbarLength - minExtent) {
                extent[0] = scrollbarLength - minExtent;
                extent[1] = scrollbarLength;
            }

            brush.setExtent(extent);
        }
    }

    export class SvgCartesianAxes {
        // These match D3's internal axis padding values
        public static AxisPadding: IMargin = {
            left: 10,
            right: 10,
            top: 0,
            bottom: 13, // don't change this - fixes defect 6658705 when in "Fit-to-Page" view and the scale factor is greater than 1.0
        };

        private axisGraphicsContext: D3.Selection;
        private xAxisGraphicsContext: D3.Selection;
        private y1AxisGraphicsContext: D3.Selection;
        private y2AxisGraphicsContext: D3.Selection;
        private svgScrollable: D3.Selection;
        private axisGraphicsContextScrollable: D3.Selection;
        private labelRegion: D3.Selection;
        private labelBackgroundRegion: D3.Selection;

        private categoryAxisProperties: DataViewObject;
        private valueAxisProperties: DataViewObject;

        private static AxisGraphicsContext = createClassAndSelector('axisGraphicsContext');
        private static TickPaddingRotatedX = 5;
        private static AxisLabelFontSize = 11;
        private static Y2TickSize = -6;

        constructor(private axes: CartesianAxes) {
        }

        public getScrollableRegion(): D3.Selection {
            return this.axisGraphicsContextScrollable;
        }

        public getLabelsRegion(): D3.Selection {
            return this.labelRegion;
        }

        public getLabelBackground(): D3.Selection {
            return this.labelBackgroundRegion;
        }

        public getXAxis(): D3.Selection {
            return this.xAxisGraphicsContext;
        }

        public getY1Axis(): D3.Selection {
            return this.y1AxisGraphicsContext;
        }

        public getY2Axis(): D3.Selection {
            return this.y2AxisGraphicsContext;
        }

        public update(categoryAxisProperties: DataViewObject, valueAxisProperties: DataViewObject): void {
            this.categoryAxisProperties = categoryAxisProperties;
            this.valueAxisProperties = valueAxisProperties;
        }

        public init(svg: D3.Selection): void {
            /*
                The layout of the visual will look like:
                <svg>
                    <g>
                        <nonscrollable axis/>
                    </g>
                    <svgScrollable>
                        <g>
                            <scrollable axis/>
                        </g>
                    </svgScrollable>
                    <g xbrush/>
                </svg>

            */

            let axisGraphicsContext = this.axisGraphicsContext = svg.append('g')
                .classed(SvgCartesianAxes.AxisGraphicsContext.class, true);

            this.svgScrollable = svg.append('svg')
                .classed('svgScrollable', true)
                .style('overflow', 'hidden');

            let axisGraphicsContextScrollable = this.axisGraphicsContextScrollable = this.svgScrollable.append('g')
                .classed(SvgCartesianAxes.AxisGraphicsContext.class, true);

            this.labelBackgroundRegion = this.svgScrollable.append('g')
                .classed(NewDataLabelUtils.labelBackgroundGraphicsContextClass.class, true);

            this.labelRegion = this.svgScrollable.append('g')
                .classed(NewDataLabelUtils.labelGraphicsContextClass.class, true);

            let showLinesOnX = this.axes.showLinesOnX;
            let showLinesOnY = this.axes.showLinesOnY;

            // NOTE: We infer the axis which should scroll based on whether or not we draw grid lines for the other axis, and
            // only allow one axis to scroll.
            let scrollX = showLinesOnY;
            let scrollY = !scrollX;
            if (scrollY) {
                this.y1AxisGraphicsContext = axisGraphicsContextScrollable.append('g').attr('class', 'y axis');
                this.y2AxisGraphicsContext = axisGraphicsContextScrollable.append('g').attr('class', 'y axis');
            }
            else {
                this.y1AxisGraphicsContext = axisGraphicsContext.append('g').attr('class', 'y axis');
                this.y2AxisGraphicsContext = axisGraphicsContext.append('g').attr('class', 'y axis');
            }

            if (scrollX) {
                this.xAxisGraphicsContext = axisGraphicsContextScrollable.append('g').attr('class', 'x axis');
            }
            else {
                this.xAxisGraphicsContext = axisGraphicsContext.append('g').attr('class', 'x axis');
            }

            this.xAxisGraphicsContext.classed('showLinesOnAxis', showLinesOnX);
            this.y1AxisGraphicsContext.classed('showLinesOnAxis', showLinesOnY);
            this.y2AxisGraphicsContext.classed('showLinesOnAxis', showLinesOnY);

            this.xAxisGraphicsContext.classed('hideLinesOnAxis', !showLinesOnX);
            this.y1AxisGraphicsContext.classed('hideLinesOnAxis', !showLinesOnY);
            this.y2AxisGraphicsContext.classed('hideLinesOnAxis', !showLinesOnY);
        }

        private static updateAnimatedTickTooltips(axisSelection: D3.Transition.Transition, values: any[]): void {
            axisSelection.each('end', function () {
                d3.select(this)
                    .selectAll('text')
                    .append('title')
                    .text((d, i) => values[i]);
            });
        }

        private static updateTickTooltips(axisSelection: D3.Selection, values: any[]): void {
            axisSelection.selectAll('text').append('title').text((d, i) => values[i]);
        }

        public renderAxes(axesLayout: CartesianAxesLayout, duration: number, easing: string = 'cubic-in-out'): void {
            let marginLimits = axesLayout.marginLimits;
            let plotArea = axesLayout.plotArea;
            let viewport = axesLayout.viewport;
            let margin = axesLayout.margin;
            let axes = axesLayout.axes;
            let tickLabelMargins = axesLayout.tickLabelMargins;

            let bottomMarginLimit = marginLimits.bottom;
            let leftRightMarginLimit = marginLimits.left;

            let xLabelColor: Fill;
            let yLabelColor: Fill;
            let y2LabelColor: Fill;

            if (this.axes.shouldRenderAxis(axes.x)) {
                if (axes.x.isCategoryAxis) {
                    xLabelColor = this.categoryAxisProperties && this.categoryAxisProperties['labelColor'] ? this.categoryAxisProperties['labelColor'] : null;
                } else {
                    xLabelColor = this.valueAxisProperties && this.valueAxisProperties['labelColor'] ? this.valueAxisProperties['labelColor'] : null;
                }
                axes.x.axis.orient("bottom");
                // we only rotate ordinal tick labels
                if (!axes.x.willLabelsFit && AxisHelper.isOrdinalScale(axes.x.scale))
                    axes.x.axis.tickPadding(SvgCartesianAxes.TickPaddingRotatedX);

                let xAxisGraphicsElement = this.xAxisGraphicsContext;
                if (duration) {
                    xAxisGraphicsElement
                        .transition()
                        .duration(duration)
                        .ease(easing)
                        .call(axes.x.axis)
                        .call(SvgCartesianAxes.updateAnimatedTickTooltips, axes.x.values);
                }
                else {
                    xAxisGraphicsElement
                        .call(axes.x.axis);
                }

                xAxisGraphicsElement
                    .call(SvgCartesianAxes.darkenZeroLine)
                    .call(SvgCartesianAxes.setAxisLabelColor, xLabelColor);

                let xAxisTextNodes = xAxisGraphicsElement.selectAll('text');
                if (axes.x.willLabelsWordBreak) {
                    xAxisTextNodes
                        .call(AxisHelper.LabelLayoutStrategy.wordBreak, axes.x, bottomMarginLimit);
                } else {
                    xAxisTextNodes
                        .call(AxisHelper.LabelLayoutStrategy.rotate,
                        bottomMarginLimit,
                        TextMeasurementService.getTailoredTextOrDefault,
                        CartesianChart.AxisTextProperties,
                        !axes.x.willLabelsFit && AxisHelper.isOrdinalScale(axes.x.scale),
                        bottomMarginLimit === tickLabelMargins.xMax,
                        axes.x,
                        margin,
                        this.axes.isXScrollBarVisible || this.axes.isYScrollBarVisible);
                }

                if (!duration) {
                    SvgCartesianAxes.updateTickTooltips(xAxisGraphicsElement, axes.x.values);
                }
            }
            else {
                this.xAxisGraphicsContext.selectAll('*').remove();
            }

            if (this.axes.shouldRenderAxis(axes.y1)) {
                if (axes.y1.isCategoryAxis) {
                    yLabelColor = this.categoryAxisProperties && this.categoryAxisProperties['labelColor'] ? this.categoryAxisProperties['labelColor'] : null;
                } else {
                    yLabelColor = this.valueAxisProperties && this.valueAxisProperties['labelColor'] ? this.valueAxisProperties['labelColor'] : null;
                }
                let showY1OnRight = this.axes.shouldShowY1OnRight();
                let y1TickPadding = showY1OnRight ? axesLayout.tickPadding.right : axesLayout.tickPadding.left;
                axes.y1.axis
                    .tickSize(-plotArea.width)
                    .tickPadding(y1TickPadding)
                    .orient(this.axes.getYAxisOrientation().toLowerCase());

                let y1AxisGraphicsElement = this.y1AxisGraphicsContext;
                if (duration) {
                    y1AxisGraphicsElement
                        .transition()
                        .duration(duration)
                        .ease(easing)
                        .call(axes.y1.axis)
                        .call(SvgCartesianAxes.updateAnimatedTickTooltips, axes.y1.values);
                }
                else {
                    y1AxisGraphicsElement
                        .call(axes.y1.axis);
                }

                y1AxisGraphicsElement
                    .call(SvgCartesianAxes.darkenZeroLine)
                    .call(SvgCartesianAxes.setAxisLabelColor, yLabelColor);

                if (tickLabelMargins.yLeft >= leftRightMarginLimit) {
                    y1AxisGraphicsElement.selectAll('text')
                        .call(AxisHelper.LabelLayoutStrategy.clip,
                        // Can't use padding space to render text, so subtract that from available space for ellipses calculations
                        leftRightMarginLimit - y1TickPadding,
                        TextMeasurementService.svgEllipsis);
                }

                if (!duration) {
                    SvgCartesianAxes.updateTickTooltips(y1AxisGraphicsElement, axes.y1.values);
                }

                if (axes.y2 && (!this.valueAxisProperties || this.valueAxisProperties['secShow'] == null || this.valueAxisProperties['secShow'])) {
                    y2LabelColor = this.valueAxisProperties && this.valueAxisProperties['secLabelColor'] ? this.valueAxisProperties['secLabelColor'] : null;

                    let y2TickPadding = showY1OnRight ? axesLayout.tickPadding.left : axesLayout.tickPadding.right;
                    axes.y2.axis
                        .tickSize(SvgCartesianAxes.Y2TickSize)
                        .tickPadding(y2TickPadding)
                        .orient(showY1OnRight ? yAxisPosition.left.toLowerCase() : yAxisPosition.right.toLowerCase());

                    let y2AxisGraphicsElement = this.y2AxisGraphicsContext;
                    if (duration) {
                        y2AxisGraphicsElement
                            .transition()
                            .duration(duration)
                            .ease(easing)
                            .call(axes.y2.axis)
                            .call(SvgCartesianAxes.updateAnimatedTickTooltips, axes.y2.values);
                    }
                    else {
                        y2AxisGraphicsElement
                            .call(axes.y2.axis);
                    }

                    y2AxisGraphicsElement
                        .call(SvgCartesianAxes.darkenZeroLine)
                        .call(SvgCartesianAxes.setAxisLabelColor, y2LabelColor);

                    if (tickLabelMargins.yRight >= leftRightMarginLimit) {
                        y2AxisGraphicsElement.selectAll('text')
                            .call(AxisHelper.LabelLayoutStrategy.clip,
                            // Can't use padding space to render text, so subtract that from available space for ellipses calculations
                            leftRightMarginLimit - y2TickPadding,
                            TextMeasurementService.svgEllipsis);
                    }

                    if (!duration) {
                        SvgCartesianAxes.updateTickTooltips(y2AxisGraphicsElement, axes.y2.values);
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
            //TODO: Add label for second Y axis for combo chart
            let axisLabels = axesLayout.axisLabels;
            let chartHasAxisLabels = (axisLabels.x != null) || (axisLabels.y != null || axisLabels.y2 != null);
            if (chartHasAxisLabels) {
                let hideXAxisTitle = !this.axes.shouldRenderAxisTitle(axes.x, /* defaultValue */ true, /* secondary */ false);
                let hideYAxisTitle = !this.axes.shouldRenderAxisTitle(axes.y1, /* defaultValue */ true,  /* secondary */false);
                let hideY2AxisTitle = !this.axes.shouldRenderAxisTitle(axes.y2, /* defaultValue */ false,  /* secondary */true);

                let renderAxisOptions: AxisRenderingOptions = {
                    axisLabels: axisLabels,
                    viewport: viewport,
                    margin: margin,
                    hideXAxisTitle: hideXAxisTitle,
                    hideYAxisTitle: hideYAxisTitle,
                    hideY2AxisTitle: hideY2AxisTitle,
                    xLabelColor: xLabelColor,
                    yLabelColor: yLabelColor,
                    y2LabelColor: y2LabelColor,
                    fontSize: SvgCartesianAxes.AxisLabelFontSize,
                };

                this.renderAxesLabels(renderAxisOptions);
            }
            else {
                this.axisGraphicsContext.selectAll('.xAxisLabel').remove();
                this.axisGraphicsContext.selectAll('.yAxisLabel').remove();
            }

            this.translateAxes(viewport, margin);
        }

        private renderAxesLabels(options: AxisRenderingOptions): void {
            debug.assertValue(options, 'options');
            debug.assertValue(options.viewport, 'options.viewport');
            debug.assertValue(options.axisLabels, 'options.axisLabels');

            this.axisGraphicsContext.selectAll('.xAxisLabel').remove();
            this.axisGraphicsContext.selectAll('.yAxisLabel').remove();

            let margin = options.margin;
            let width = options.viewport.width - (margin.left + margin.right);
            let height = options.viewport.height;
            let fontSize = options.fontSize;

            let axisTextProperties = _.clone(CartesianChart.AxisTextProperties);
            axisTextProperties.fontSize = fontSize + "px";

            let showOnRight = this.axes.shouldShowY1OnRight();

            if (!options.hideXAxisTitle) {
                axisTextProperties.text = options.axisLabels.x;
                let heightOffset = TextMeasurementService.estimateSvgTextHeight(axisTextProperties);

                let xAxisLabel = this.axisGraphicsContext.append("text")
                    .style("text-anchor", "middle")
                    .text(options.axisLabels.x)
                    .call((text: D3.Selection) => {
                        text.each(function () {
                            let text = d3.select(this);
                            text.attr({
                                "class": "xAxisLabel",
                                "transform": SVGUtil.translate(width / 2, height - heightOffset)
                            });
                        });
                    });

                xAxisLabel.style("fill", options.xLabelColor ? options.xLabelColor.solid.color : null);

                xAxisLabel.call(AxisHelper.LabelLayoutStrategy.clip,
                    width,
                    TextMeasurementService.svgEllipsis)
                    .call(tooltipUtils.tooltipUpdate, [options.axisLabels.x]);
            }

            if (!options.hideYAxisTitle) {
                axisTextProperties.text = options.axisLabels.y;
                let textHeight = TextMeasurementService.estimateSvgTextHeight(axisTextProperties);

                let yAxisLabel = this.axisGraphicsContext.append("text")
                    .style("text-anchor", "middle")
                    .text(options.axisLabels.y)
                    .call((text: D3.Selection) => {
                        text.each(function () {
                            let text = d3.select(this);
                            text.attr({
                                "class": "yAxisLabel",
                                "transform": "rotate(-90)",
                                "y": showOnRight ? width + margin.right - textHeight : -margin.left,
                                "x": -((height - margin.top - margin.bottom) / 2),
                                "dy": "1em",
                            });
                        });
                    });

                yAxisLabel.style("fill", options.yLabelColor ? options.yLabelColor.solid.color : null);

                yAxisLabel.call(AxisHelper.LabelLayoutStrategy.clip,
                    height - (margin.bottom + margin.top),
                    TextMeasurementService.svgEllipsis)
                    .call(tooltipUtils.tooltipUpdate, [options.axisLabels.y]);
            }

            if (!options.hideY2AxisTitle && options.axisLabels.y2) {
                axisTextProperties.text = options.axisLabels.y2;
                let textHeight = TextMeasurementService.estimateSvgTextHeight(axisTextProperties);

                let y2AxisLabel = this.axisGraphicsContext.append("text")
                    .style("text-anchor", "middle")
                    .text(options.axisLabels.y2)
                    .call((text: D3.Selection) => {
                        text.each(function () {
                            let text = d3.select(this);
                            text.attr({
                                "class": "yAxisLabel",
                                "transform": "rotate(-90)",
                                "y": showOnRight ? -margin.left : width + margin.right - textHeight,
                                "x": -((height - margin.top - margin.bottom) / 2),
                                "dy": "1em",
                            });
                        });
                    });

                y2AxisLabel.style("fill", options.y2LabelColor ? options.y2LabelColor.solid.color : null);

                y2AxisLabel.call(AxisHelper.LabelLayoutStrategy.clip,
                    height - (margin.bottom + margin.top),
                    TextMeasurementService.svgEllipsis)
                    .call(tooltipUtils.tooltipUpdate, [options.axisLabels.y2]);
            }
        }

        private translateAxes(viewport: IViewport, margin: IMargin): void {
            let width = viewport.width - (margin.left + margin.right);
            let height = viewport.height - (margin.top + margin.bottom);

            let showY1OnRight = this.axes.shouldShowY1OnRight();

            this.xAxisGraphicsContext
                .attr('transform', SVGUtil.translate(0, height));

            this.y1AxisGraphicsContext
                .attr('transform', SVGUtil.translate(showY1OnRight ? width : 0, 0));

            this.y2AxisGraphicsContext
                .attr('transform', SVGUtil.translate(showY1OnRight ? 0 : width, 0));

            this.svgScrollable.attr({
                'x': 0,
                'width': viewport.width,
                'height': viewport.height
            });

            this.axisGraphicsContext.attr('transform', SVGUtil.translate(margin.left, margin.top));
            this.axisGraphicsContextScrollable.attr('transform', SVGUtil.translate(margin.left, margin.top));
            this.labelRegion.attr('transform', SVGUtil.translate(margin.left, margin.top));
            this.labelBackgroundRegion.attr('transform', SVGUtil.translate(margin.left, margin.top));

            if (this.axes.isXScrollBarVisible) {
                this.svgScrollable.attr({
                    'x': margin.left
                });
                this.axisGraphicsContextScrollable.attr('transform', SVGUtil.translate(0, margin.top));
                this.labelRegion.attr('transform', SVGUtil.translate(0, margin.top));
                this.labelBackgroundRegion.attr('transform', SVGUtil.translate(0, margin.top));
                this.svgScrollable.attr('width', width);
            }
            else if (this.axes.isYScrollBarVisible) {
                this.svgScrollable.attr('height', height + margin.top);
            }
        }

        /**
         * Within the context of the given selection (g), find the offset of
         * the zero tick using the d3 attached datum of g.tick elements.
         * 'Classed' is undefined for transition selections
         */
        private static darkenZeroLine(g: D3.Selection): void {
            // remove zero-line class from all first, filtering can cause lines that are no longer zero to still be dark (since the key is index based)
            g.selectAll('g.tick line').classed('zero-line', false);
            let zeroTick = g.selectAll('g.tick').filter((data) => data === 0).node();
            if (zeroTick) {
                d3.select(zeroTick).select('line').classed('zero-line', true);
            }
        }

        private static setAxisLabelColor(g: D3.Selection, fill: Fill): void {
            g.selectAll('g.tick text').style('fill', fill ? fill.solid.color : null);
        }
    }

    export class CartesianAxes {
        private static YAxisLabelPadding = 20;
        private static XAxisLabelPadding = 18;
        private static MaxMarginFactor = 0.25;
        private static MinimumMargin: IMargin = {
            left: 1,
            right: 1,
            top: 8, //half of the default font height
            bottom: 25,
        };

        private categoryAxisProperties: DataViewObject;
        private valueAxisProperties: DataViewObject;

        private maxMarginFactor: number;
        private yAxisOrientation: string;
        private scrollbarWidth: number;
        private trimOrdinalDataOnOverflow: boolean;
        public showLinesOnX: boolean;
        public showLinesOnY: boolean;
        public isScrollable: boolean;
        public isXScrollBarVisible: boolean;
        public isYScrollBarVisible: boolean;
        public categoryAxisHasUnitType: boolean;
        public valueAxisHasUnitType: boolean;
        public secondaryValueAxisHasUnitType: boolean;

        private layout: CartesianAxesLayout;

        constructor(isScrollable: boolean, scrollbarWidth: number, trimOrdinalDataOnOverflow: boolean) {
            this.scrollbarWidth = scrollbarWidth;
            this.isScrollable = isScrollable;
            this.maxMarginFactor = CartesianAxes.MaxMarginFactor;
            this.yAxisOrientation = yAxisPosition.left;
            this.trimOrdinalDataOnOverflow = trimOrdinalDataOnOverflow;
        }

        public shouldShowY1OnRight(): boolean {
            return this.yAxisOrientation === yAxisPosition.right;
        }

        public isYAxisCategorical(): boolean {
            return this.layout && this.layout.axes.y1.isCategoryAxis;
        }

        public hasCategoryAxis(): boolean {
            let axes = this.layout && this.layout.axes;
            if (!axes)
                return false;

            return this.isYAxisCategorical()
                ? axes.y1 && axes.y1.axis != null
                : axes.x && axes.x.axis != null;
        }

        public hasY2Axis(): boolean {
            return this.layout && this.layout.axes.y2 != null;
        }

        public getYAxisOrientation(): string {
            return this.yAxisOrientation;
        }

        public setAxisLinesVisibility(axisLinesVisibility: AxisLinesVisibility): void {
            this.showLinesOnX = EnumExtensions.hasFlag(axisLinesVisibility, AxisLinesVisibility.ShowLinesOnBothAxis) ||
                EnumExtensions.hasFlag(axisLinesVisibility, AxisLinesVisibility.ShowLinesOnXAxis);

            this.showLinesOnY = EnumExtensions.hasFlag(axisLinesVisibility, AxisLinesVisibility.ShowLinesOnBothAxis) ||
                EnumExtensions.hasFlag(axisLinesVisibility, AxisLinesVisibility.ShowLinesOnYAxis);
        }

        public setMaxMarginFactor(factor: number): void {
            this.maxMarginFactor = factor;
        }

        public update(dataViews: DataView[]) {
            if (dataViews && dataViews.length > 0) {
                let dataViewMetadata = dataViews[0].metadata;
                this.categoryAxisProperties = CartesianHelper.getCategoryAxisProperties(dataViewMetadata);
                this.valueAxisProperties = CartesianHelper.getValueAxisProperties(dataViewMetadata);
            }

            let axisPosition = this.valueAxisProperties['position'];
            this.yAxisOrientation = axisPosition ? axisPosition.toString() : yAxisPosition.left;
        }

        public addWarnings(warnings: IVisualWarning[]): void {
            let axes = this.layout && this.layout.axes;
            if (axes && axes.x && axes.x.hasDisallowedZeroInDomain
                || axes.y1 && axes.y1.hasDisallowedZeroInDomain
                || axes.y2 && axes.y2.hasDisallowedZeroInDomain) {
                warnings.unshift(new ZeroValueWarning());
            }
        }

        /** 
         * Computes the Cartesian Chart axes from the set of layers.
         */
        private calculateAxes(
            layers: ICartesianVisual[],
            viewport: IViewport,
            margin: IMargin,
            playAxisControlLayout: IRect,
            textProperties: TextProperties,
            scrollbarVisible: boolean,
            existingAxisProperties: CartesianAxisProperties,
            hideAxisTitles: boolean,
            ensureXDomain?: NumberRange,
            ensureYDomain?: NumberRange): CartesianAxisProperties {
            debug.assertValue(layers, 'layers');

            let visualOptions: CalculateScaleAndDomainOptions = {
                viewport: viewport,
                margin: margin,
                forcedXDomain: [this.categoryAxisProperties ? this.categoryAxisProperties['start'] : null, this.categoryAxisProperties ? this.categoryAxisProperties['end'] : null],
                forceMerge: this.valueAxisProperties && this.valueAxisProperties['secShow'] === false,
                showCategoryAxisLabel: false,
                showValueAxisLabel: false,
                trimOrdinalDataOnOverflow: this.trimOrdinalDataOnOverflow,
                categoryAxisScaleType: this.categoryAxisProperties && this.categoryAxisProperties['axisScale'] != null ? <string>this.categoryAxisProperties['axisScale'] : DEFAULT_AXIS_SCALE_TYPE,
                valueAxisScaleType: this.valueAxisProperties && this.valueAxisProperties['axisScale'] != null ? <string>this.valueAxisProperties['axisScale'] : DEFAULT_AXIS_SCALE_TYPE,
                categoryAxisDisplayUnits: this.categoryAxisProperties && this.categoryAxisProperties['labelDisplayUnits'] != null ? <number>this.categoryAxisProperties['labelDisplayUnits'] : 0,
                valueAxisDisplayUnits: this.valueAxisProperties && this.valueAxisProperties['labelDisplayUnits'] != null ? <number>this.valueAxisProperties['labelDisplayUnits'] : 0,
                categoryAxisPrecision: this.categoryAxisProperties ? CartesianHelper.getPrecision(this.categoryAxisProperties['labelPrecision']) : null,
                valueAxisPrecision: this.valueAxisProperties ? CartesianHelper.getPrecision(this.valueAxisProperties['labelPrecision']) : null,
                playAxisControlLayout: playAxisControlLayout,
                ensureXDomain: ensureXDomain,
                ensureYDomain: ensureYDomain,
            };

            let skipMerge = this.valueAxisProperties && this.valueAxisProperties['secShow'] === true;

            let yAxisWillMerge = false;
            let mergeResult: MergedValueAxisResult;
            if (hasMultipleYAxes(layers) && !skipMerge) {
                mergeResult = tryMergeYDomains(layers, visualOptions);
                yAxisWillMerge = mergeResult.merged;
                if (yAxisWillMerge) {
                    visualOptions.forcedYDomain = mergeResult.domain;
                }
                else {
                    visualOptions.forcedTickCount = mergeResult.tickCount;
                }
            }

            if (this.valueAxisProperties) {
                visualOptions.forcedYDomain = AxisHelper.applyCustomizedDomain([this.valueAxisProperties['start'], this.valueAxisProperties['end']], visualOptions.forcedYDomain);
            }

            let result: CartesianAxisProperties;
            for (let layerNumber = 0, len = layers.length; layerNumber < len; layerNumber++) {
                let currentlayer = layers[layerNumber];

                if (layerNumber === 1 && !yAxisWillMerge) {
                    visualOptions.forcedYDomain = this.valueAxisProperties ? [this.valueAxisProperties['secStart'], this.valueAxisProperties['secEnd']] : null;
                    visualOptions.valueAxisScaleType = this.valueAxisProperties && this.valueAxisProperties['secAxisScale'] != null ? <string>this.valueAxisProperties['secAxisScale'] : DEFAULT_AXIS_SCALE_TYPE;
                    visualOptions.valueAxisDisplayUnits = this.valueAxisProperties && this.valueAxisProperties['secLabelDisplayUnits'] != null ? <number>this.valueAxisProperties['secLabelDisplayUnits'] : 0;
                    visualOptions.valueAxisPrecision = this.valueAxisProperties ? CartesianHelper.getPrecision(this.valueAxisProperties['secLabelPrecision']) : null;
                }
                visualOptions.showCategoryAxisLabel = (!!this.categoryAxisProperties && !!this.categoryAxisProperties['showAxisTitle']);//here

                visualOptions.showValueAxisLabel = shouldShowYAxisLabel(layerNumber, this.valueAxisProperties, yAxisWillMerge);

                let axes = currentlayer.calculateAxesProperties(visualOptions);

                if (layerNumber === 0) {
                    result = {
                        x: axes[0],
                        y1: axes[1]
                    };
                }
                else if (axes && !result.y2) {
                    if (result.x.usingDefaultDomain || _.isEmpty(result.x.dataDomain)) {
                        visualOptions.showValueAxisLabel = (!!this.valueAxisProperties && !!this.valueAxisProperties['showAxisTitle']);

                        let axes = currentlayer.calculateAxesProperties(visualOptions);
                        // no categories returned for the first layer, use second layer x-axis properties
                        result.x = axes[0];
                        // and 2nd value axis to be the primary
                        result.y1 = axes[1];
                    }
                    else {
                        // make sure all layers use the same x-axis/scale for drawing
                        currentlayer.overrideXScale(result.x);
                        if (!yAxisWillMerge && !axes[1].usingDefaultDomain)
                            result.y2 = axes[1];
                    }
                }

                if (existingAxisProperties && existingAxisProperties.x) {
                    result.x.willLabelsFit = existingAxisProperties.x.willLabelsFit;
                    result.x.willLabelsWordBreak = existingAxisProperties.x.willLabelsWordBreak;
                } else {
                    let width = viewport.width - (margin.left + margin.right);
                    result.x.willLabelsFit = AxisHelper.LabelLayoutStrategy.willLabelsFit(
                        result.x,
                        width,
                        TextMeasurementService.measureSvgTextWidth,
                        textProperties);

                    // If labels do not fit and we are not scrolling, try word breaking
                    result.x.willLabelsWordBreak = (!result.x.willLabelsFit && !scrollbarVisible) && AxisHelper.LabelLayoutStrategy.willLabelsWordBreak(
                        result.x,
                        margin,
                        width,
                        TextMeasurementService.measureSvgTextWidth,
                        TextMeasurementService.estimateSvgTextHeight,
                        TextMeasurementService.getTailoredTextOrDefault,
                        textProperties);
                }
            }

            // Adjust for axis titles
            if (hideAxisTitles) {
                result.x.axisLabel = null;
                result.y1.axisLabel = null;
                if (result.y2) {
                    result.y2.axisLabel = null;
                }
            }
            this.addUnitTypeToAxisLabels(result);

            return result;
        }

        /**
         * Negotiate the axes regions, the plot area, and determine if we need a scrollbar for ordinal categories.
         * @param layers an array of Cartesian layout layers (column, line, etc.)
         * @param parentViewport the full viewport for the visual
         * @param padding the D3 axis padding values
         * @param playAxisControlLayout if this is a playable Cartesian chart, includes the layout for the play controls (start/stop, time slider)
         * @param hideAxisLabels forces axis titles to be hidden
         * @param textProperties text properties to be used by text measurement
         * @param interactivityRightMargin extra right margin for the interactivity
         * @param ensureXDomain if non null, includes values that must be part of the axis domain
         * @param ensureYDomain if non null, includes values that must be part of the axis domain
         */
        public negotiateAxes(
            layers: ICartesianVisual[],
            parentViewport: IViewport,
            padding: IMargin,
            playAxisControlLayout: IRect,
            hideAxisLabels: boolean,
            textProperties: TextProperties,
            interactivityRightMargin: number,
            ensureXDomain?: NumberRange,
            ensureYDomain?: NumberRange): CartesianAxesLayout {

            // 1> MinMargins -> some initial axis properties / text
            // 2> Get axis margins for the initial text, no rotateXTickLabels90. margins grown? -> axis properties / text again (possibly more tick labels now)
            // ?> do we have more labels? do we need rotate? are we done?
            // 3> margins again (rotate? margins grow?) -> text again (less tick labls now?)
            // FREEZE PROPERTIES THAT CAN CHANGE
            // 4> margins (final), axes (final)
            
            // 1.a) initialize margins
            let margin: IMargin = Prototype.inherit(CartesianAxes.MinimumMargin);
            let viewport: IViewport = Prototype.inherit(parentViewport);
            let leftRightMarginLimit = viewport.width * this.maxMarginFactor;
            let bottomMarginLimit = Math.max(CartesianAxes.MinimumMargin.bottom, Math.ceil(viewport.height * this.maxMarginFactor));
            let marginLimits = {
                left: leftRightMarginLimit,
                right: leftRightMarginLimit,
                top: 0,
                bottom: bottomMarginLimit,
            };

            // 1.b) Calculate axis properties using initial margins
            let axes = this.calculateAxes(
                layers,
                viewport,
                margin,
                playAxisControlLayout,
                textProperties,
                /*scrollbarVisible*/ false,
                /*previousAxisProperties*/ null,
                hideAxisLabels,
                ensureXDomain,
                ensureYDomain);

            // these are used by getTickLabelMargins
            let renderXAxis = this.shouldRenderAxis(axes.x);
            let renderY1Axis = this.shouldRenderAxis(axes.y1);
            let renderY2Axis = this.shouldRenderAxis(axes.y2, true);
            let showY1OnRight = this.shouldShowY1OnRight();

            let plotArea: IViewport = {
                width: viewport.width - (margin.left + margin.right),
                height: viewport.height - (margin.top + margin.bottom)
            };

            let isScalar = false;
            if (!_.isEmpty(layers)) {
                if (layers[0].getVisualCategoryAxisIsScalar)
                    isScalar = layers[0].getVisualCategoryAxisIsScalar();
            }

            // 2.a) calculate axis tick margins
            let tickLabelMargins = undefined;
            tickLabelMargins = AxisHelper.getTickLabelMargins(
                plotArea,
                marginLimits.left,
                TextMeasurementService.measureSvgTextWidth,
                TextMeasurementService.estimateSvgTextHeight,
                axes,
                marginLimits.bottom,
                textProperties,
                /*scrolling*/ false,
                showY1OnRight,
                renderXAxis,
                renderY1Axis,
                renderY2Axis);

            margin = this.updateAxisMargins(axes, tickLabelMargins, padding, showY1OnRight, renderY1Axis, renderY2Axis, isScalar ? 0 : interactivityRightMargin);

            // if any of these change, we need to calculate margins again
            let previousTickCountY1 = axes.y1 && axes.y1.values.length;
            let previousTickCountY2 = axes.y2 && axes.y2.values.length;
            let previousWillFitX = axes.x && axes.x.willLabelsFit;
            let previousWillBreakX = axes.x && axes.x.willLabelsWordBreak;

            // 2.b) Re-calculate the axes with the new margins.
            axes = this.calculateAxes(
                layers,
                viewport,
                margin,
                playAxisControlLayout,
                textProperties,
                /*scrollbarVisible*/ false,
                /*previousAxes*/ null,
                hideAxisLabels,
                ensureXDomain,
                ensureYDomain);

            plotArea.width = viewport.width - (margin.left + margin.right);
            plotArea.height = viewport.height - (margin.top + margin.bottom);

            // check properties that affect getTickLabelMargin - if these are the same, we don't need to calculate axis margins again
            let preferredPlotArea: IViewport = this.getPreferredPlotArea(axes, layers, isScalar);
            let rotateXTickLabels90 = !this.willAllCategoriesFitInPlotArea(plotArea, preferredPlotArea);
            let allDone = ((!axes.y1 || axes.y1.values.length === previousTickCountY1)
                && (!axes.y2 || axes.y2.values.length === previousTickCountY2)
                && (!axes.x || axes.x.willLabelsFit === previousWillFitX)
                && (!axes.x || axes.x.willLabelsWordBreak === previousWillBreakX)
                && !rotateXTickLabels90);

            this.isXScrollBarVisible = false;
            this.isYScrollBarVisible = false;
            if (!allDone) {
                // 3.a) calculate axis tick margins
                tickLabelMargins = AxisHelper.getTickLabelMargins(
                    plotArea,
                    marginLimits.left,
                    TextMeasurementService.measureSvgTextWidth,
                    TextMeasurementService.estimateSvgTextHeight,
                    axes,
                    marginLimits.bottom,
                    textProperties,
                    rotateXTickLabels90,
                    showY1OnRight,
                    renderXAxis,
                    renderY1Axis,
                    renderY2Axis);

                margin = this.updateAxisMargins(axes, tickLabelMargins, padding, showY1OnRight, renderY1Axis, renderY2Axis, isScalar ? 0 : interactivityRightMargin);

                // 3.b) Re-calculate the axes with the new final margins
                axes = this.calculateAxes(
                    layers,
                    viewport,
                    margin,
                    playAxisControlLayout,
                    textProperties,
                    /*scrollbarVisible*/ rotateXTickLabels90,
                    axes,
                    hideAxisLabels,
                    ensureXDomain,
                    ensureYDomain);

                // now we can determine if we need actual scrolling
                // rotateXTickLabels90 will give more plotArea to categories since the left-overflow of a rotated category label doesn't exist anymore
                plotArea.width = viewport.width - (margin.left + margin.right);
                plotArea.height = viewport.height - (margin.top + margin.bottom);
                preferredPlotArea = this.getPreferredPlotArea(axes, layers, isScalar);
                let willScroll = !this.willAllCategoriesFitInPlotArea(plotArea, preferredPlotArea);
                if (willScroll) {
                    if (this.showLinesOnY) {
                        this.isXScrollBarVisible = true;
                        plotArea.height -= this.scrollbarWidth;
                        viewport.height -= this.scrollbarWidth;
                    }
                    if (this.showLinesOnX) {
                        this.isYScrollBarVisible = true;
                        plotArea.width -= this.scrollbarWidth;
                        viewport.width -= this.scrollbarWidth;
                    }

                    // 3.c) Re-calculate the axes with the final margins (and the updated viewport - scrollbarWidth)
                    axes = this.calculateAxes(
                        layers,
                        viewport,
                        margin,
                        playAxisControlLayout,
                        textProperties,
                    /*scrollbarVisible*/ true,
                        axes,
                        hideAxisLabels,
                        ensureXDomain,
                        ensureYDomain);
                }
            }

            ///////DONE
            let axisLabels = hideAxisLabels ?
                { x: null, y: null, y2: null } :
                { x: axes.x.axisLabel, y: axes.y1.axisLabel, y2: axes.y2 ? axes.y2.axisLabel : null };

            this.layout = {
                axes: axes,
                axisLabels: axisLabels,
                margin: margin,
                marginLimits: marginLimits,
                viewport: viewport,
                plotArea: plotArea,
                preferredPlotArea: preferredPlotArea,
                tickLabelMargins: tickLabelMargins,
                tickPadding: padding,
                rotateXTickLabels90: rotateXTickLabels90,
            };

            return this.layout;
        }

        private getPreferredPlotArea(axes, layers, isScalar): IViewport {
            let preferredPlotArea: IViewport;
            if (!isScalar && this.isScrollable && !_.isEmpty(layers) && layers[0].getPreferredPlotArea) {
                let categoryThickness = this.showLinesOnY ? axes.x.categoryThickness : axes.y1.categoryThickness;
                let categoryCount = this.showLinesOnY ? axes.x.dataDomain.length : axes.y1.dataDomain.length;
                preferredPlotArea = layers[0].getPreferredPlotArea(isScalar, categoryCount, categoryThickness);
            }
            return preferredPlotArea;
        }

        private willAllCategoriesFitInPlotArea(plotArea: IViewport, preferredPlotArea: IViewport): boolean {
            if (this.showLinesOnY && preferredPlotArea && Double.greaterWithPrecision(preferredPlotArea.width, plotArea.width)) {
                return false;
            }
            if (this.showLinesOnX && preferredPlotArea && Double.greaterWithPrecision(preferredPlotArea.height, plotArea.height)) {
                return false;
            }
            return true;
        }

        private updateAxisMargins(
            axes: CartesianAxisProperties,
            tickLabelMargins: TickLabelMargins,
            padding: IMargin,
            showY1OnRight: boolean,
            renderY1Axis: boolean,
            renderY2Axis: boolean,
            interactivityRightMargin: number): IMargin {

            // We look at the y axes as main and second sides, if the y axis orientation is right then the main side represents the right side.
            let maxY1Padding = showY1OnRight ? tickLabelMargins.yRight : tickLabelMargins.yLeft,
                maxY2Padding = showY1OnRight ? tickLabelMargins.yLeft : tickLabelMargins.yRight,
                maxXAxisBottom = tickLabelMargins.xMax;

            maxY1Padding += padding.left;
            if ((renderY2Axis && !showY1OnRight) || (showY1OnRight && renderY1Axis))
                maxY2Padding += padding.right;
            maxXAxisBottom += padding.bottom;

            let axisLabels = { x: axes.x.axisLabel, y: axes.y1.axisLabel, y2: axes.y2 ? axes.y2.axisLabel : null };
            if (axisLabels.x != null)
                maxXAxisBottom += CartesianAxes.XAxisLabelPadding;
            if (axisLabels.y != null)
                maxY1Padding += CartesianAxes.YAxisLabelPadding;
            if (axisLabels.y2 != null)
                maxY2Padding += CartesianAxes.YAxisLabelPadding;

            let margin: IMargin = Prototype.inherit(CartesianAxes.MinimumMargin);
            margin.left = showY1OnRight ? maxY2Padding : maxY1Padding;
            margin.right = showY1OnRight ? maxY1Padding : maxY2Padding;
            margin.right += interactivityRightMargin; // for mobile interactive legend
            margin.bottom = maxXAxisBottom;

            return margin;
        }

        public isLogScaleAllowed(axisType: AxisLocation): boolean {
            let axes = this.layout && this.layout.axes;
            if (!axes)
                return false;

            switch (axisType) {
                case AxisLocation.X:
                    return axes.x.isLogScaleAllowed;
                case AxisLocation.Y1:
                    return axes.y1.isLogScaleAllowed;
                case AxisLocation.Y2:
                    return axes.y2 && axes.y2.isLogScaleAllowed;
            }
        }

        public axesHaveTicks(viewport: IViewport): boolean {
            if (!this.layout)
                return false;

            let margin = this.layout.margin;

            let width = viewport.width - (margin.left + margin.right);
            let height = viewport.height - (margin.top + margin.bottom);

            // TODO: this is never the case, remove.
            if (AxisHelper.getRecommendedNumberOfTicksForXAxis(width) === 0
                && AxisHelper.getRecommendedNumberOfTicksForYAxis(height) === 0) {
                return false;
            }

            return true;
        }

        public shouldRenderAxisTitle(axisProperties: IAxisProperties, defaultValue: boolean, secondary: boolean): boolean {
            let propertyName = secondary ? 'secShowAxisTitle' : 'showAxisTitle';

            return !!this.getAxisProperty(axisProperties, propertyName, defaultValue);
        }

        public shouldRenderAxis(axisProperties: IAxisProperties, secondary: boolean = false): boolean {
            if (!axisProperties)
                return false;

            let propertyName = secondary ? 'secShow' : 'show';

            return this.getAxisProperty(axisProperties, propertyName, true)
                && axisProperties.values
                && axisProperties.values.length > 0;
        }

        private getAxisProperty(axisProperties: IAxisProperties, propertyName: string, defaultValue: DataViewPropertyValue): DataViewPropertyValue {
            if (!axisProperties)
                return defaultValue;

            let properties = axisProperties.isCategoryAxis
                ? this.categoryAxisProperties
                : this.valueAxisProperties;

            if (properties && properties[propertyName] != null)
                return properties[propertyName];
            else
                return defaultValue;
        }

        // TODO: clean this up
        private addUnitTypeToAxisLabels(axes: CartesianAxisProperties): void {
            let unitType = CartesianAxes.getUnitType(axes.x.formatter);
            if (axes.x.isCategoryAxis) {
                this.categoryAxisHasUnitType = unitType != null;
            }
            else {
                this.valueAxisHasUnitType = unitType != null;
            }

            if (axes.x.axisLabel && unitType) {
                if (axes.x.isCategoryAxis) {
                    axes.x.axisLabel = AxisHelper.createAxisLabel(this.categoryAxisProperties, axes.x.axisLabel, unitType);
                }
                else {
                    axes.x.axisLabel = AxisHelper.createAxisLabel(this.valueAxisProperties, axes.x.axisLabel, unitType);
                }
            }

            unitType = CartesianAxes.getUnitType(axes.y1.formatter);

            if (!axes.y1.isCategoryAxis) {
                this.valueAxisHasUnitType = unitType != null;
            }
            else {
                this.categoryAxisHasUnitType = unitType != null;
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
                let unitType = CartesianAxes.getUnitType(axes.y2.formatter);
                this.secondaryValueAxisHasUnitType = unitType != null;
                if (axes.y2.axisLabel && unitType) {
                    axes.y2.axisLabel = AxisHelper.createAxisLabel(this.valueAxisProperties, axes.y2.axisLabel, unitType, true);
                }
            }
        }

        private static getUnitType(formatter: IValueFormatter) {
            if (formatter &&
                formatter.displayUnit &&
                formatter.displayUnit.value > 1)
                return formatter.displayUnit.title;
        }
    }

    module CartesianLayerFactory {

        export function createLayers(
            type: CartesianChartType,
            objects: DataViewObjects,
            interactivityService: IInteractivityService,
            animator?: any,
            isScrollable: boolean = false,
            tooltipsEnabled?: boolean,
            tooltipBucketEnabled?: boolean,
            advancedLineLabelsEnabled?: boolean): ICartesianVisual[] {

            let layers: ICartesianVisual[] = [];

            let cartesianOptions: CartesianVisualConstructorOptions = {
                isScrollable: isScrollable,
                animator: animator,
                interactivityService: interactivityService,
                tooltipsEnabled: tooltipsEnabled,
                tooltipBucketEnabled: tooltipBucketEnabled,
                advancedLineLabelsEnabled: advancedLineLabelsEnabled
            };

            switch (type) {
                case CartesianChartType.Area:
                    layers.push(createLineChartLayer(LineChartType.area, /* inComboChart */ false, cartesianOptions));
                    //layers.push(createLineChartLayer(LineChartType.default, /* inComboChart */ false, cartesianOptions, true));
                    break;
                case CartesianChartType.Line:
                    layers.push(createLineChartLayer(LineChartType.default, /* inComboChart */ false, cartesianOptions));
                    //layers.push(createLineChartLayer(LineChartType.default, /* inComboChart */ false, cartesianOptions, true));
                    break;
                case CartesianChartType.StackedArea:
                    layers.push(createLineChartLayer(LineChartType.stackedArea, /* inComboChart */ false, cartesianOptions));
                    break;
                case CartesianChartType.Scatter:
                    layers.push(createScatterChartLayer(cartesianOptions));
                    //layers.push(createLineChartLayer(LineChartType.default, /* inComboChart */ false, cartesianOptions, true));
                    break;
                case CartesianChartType.Waterfall:
                    layers.push(createWaterfallChartLayer(cartesianOptions));
                    break;
                case CartesianChartType.DataDot:
                    layers.push(createDataDotChartLayer(cartesianOptions));
                    break;
                case CartesianChartType.StackedColumn:
                    layers.push(createColumnChartLayer(ColumnChartType.stackedColumn, cartesianOptions));
                    break;
                case CartesianChartType.ClusteredColumn:
                    layers.push(createColumnChartLayer(ColumnChartType.clusteredColumn, cartesianOptions));
                    break;
                case CartesianChartType.HundredPercentStackedColumn:
                    layers.push(createColumnChartLayer(ColumnChartType.hundredPercentStackedColumn, cartesianOptions));
                    break;
                case CartesianChartType.StackedBar:
                    layers.push(createColumnChartLayer(ColumnChartType.stackedBar, cartesianOptions));
                    break;
                case CartesianChartType.ClusteredBar:
                    layers.push(createColumnChartLayer(ColumnChartType.clusteredBar, cartesianOptions));
                    break;
                case CartesianChartType.HundredPercentStackedBar:
                    layers.push(createColumnChartLayer(ColumnChartType.hundredPercentStackedBar, cartesianOptions));
                    break;
                case CartesianChartType.ComboChart:
                    let columnType = getComboColumnType();
                    layers.push(createColumnChartLayer(columnType, cartesianOptions));
                    layers.push(createLineChartLayer(LineChartType.default, /* inComboChart */ true, cartesianOptions));
                    break;
                case CartesianChartType.LineClusteredColumnCombo:
                    layers.push(createColumnChartLayer(ColumnChartType.clusteredColumn, cartesianOptions));
                    layers.push(createLineChartLayer(LineChartType.default, /* inComboChart */ true, cartesianOptions));
                    break;
                case CartesianChartType.LineStackedColumnCombo:
                    layers.push(createColumnChartLayer(ColumnChartType.stackedColumn, cartesianOptions));
                    layers.push(createLineChartLayer(LineChartType.default, /* inComboChart */ true, cartesianOptions));
                    break;
                case CartesianChartType.DataDotClusteredColumnCombo:
                    layers.push(createColumnChartLayer(ColumnChartType.clusteredColumn, cartesianOptions));
                    layers.push(createDataDotChartLayer(cartesianOptions));
                    break;
                case CartesianChartType.DataDotStackedColumnCombo:
                    layers.push(createColumnChartLayer(ColumnChartType.stackedColumn, cartesianOptions));
                    layers.push(createDataDotChartLayer(cartesianOptions));
                    break;
            }

            return layers;
        }

        function createLineChartLayer(type: LineChartType, inComboChart: boolean, defaultOptions: CartesianVisualConstructorOptions, isTrendLayer?: boolean): LineChart {
            let options: LineChartConstructorOptions = {
                animator: defaultOptions.animator,
                interactivityService: defaultOptions.interactivityService,
                isScrollable: defaultOptions.isScrollable,
                tooltipsEnabled: !isTrendLayer && defaultOptions.tooltipsEnabled,
                tooltipBucketEnabled: defaultOptions.tooltipBucketEnabled,
                chartType: type,
                advancedLineLabelsEnabled: defaultOptions.advancedLineLabelsEnabled
            };

            if (inComboChart) {
                options.chartType = options.chartType | LineChartType.lineShadow;
            }

            return new LineChart(options);
        }

        function createScatterChartLayer(defaultOptions: CartesianVisualConstructorOptions): ScatterChart {
            defaultOptions.isScrollable = false;
            return new ScatterChart(defaultOptions);
        }

        function createWaterfallChartLayer(defaultOptions: CartesianVisualConstructorOptions): WaterfallChart {
            return new WaterfallChart(defaultOptions);
        }

        function createDataDotChartLayer(defaultOptions: CartesianVisualConstructorOptions): DataDotChart {
            return new DataDotChart(defaultOptions);
        }

        function createColumnChartLayer(type: ColumnChartType, defaultOptions: CartesianVisualConstructorOptions): ColumnChart {
            let options: ColumnChartConstructorOptions = {
                animator: <IColumnChartAnimator>defaultOptions.animator,
                interactivityService: defaultOptions.interactivityService,
                isScrollable: defaultOptions.isScrollable,
                tooltipsEnabled: defaultOptions.tooltipsEnabled,
                tooltipBucketEnabled: defaultOptions.tooltipBucketEnabled,
                chartType: type
            };
            return new ColumnChart(options);
        }

        function getComboColumnType(objects?: DataViewObjects): ColumnChartType {
            // This supports existing serialized forms of pinned combo-chart visuals
            let columnType: ColumnChartType = ColumnChartType.clusteredColumn;
            if (objects) {
                let comboChartTypes: ComboChartDataViewObject = (<ComboChartDataViewObjects>objects).general;
                if (comboChartTypes) {
                    switch (comboChartTypes.visualType1) {
                        case 'Column':
                            columnType = ColumnChartType.clusteredColumn;
                            break;
                        case 'ColumnStacked':
                            columnType = ColumnChartType.stackedColumn;
                            break;
                        default:
                            debug.assertFail('Unsupported cartesian chart type ' + comboChartTypes.visualType1);
                    }

                    // second visual is always LineChart (for now)
                    if (comboChartTypes.visualType2) {
                        debug.assert(comboChartTypes.visualType2 === 'Line', 'expecting a LineChart for VisualType2');
                    }
                }
            }

            return columnType;
        }
    }

    export class SharedColorPalette implements IDataColorPalette {
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
    
    export class CartesianLoadMoreDataHandler {

        public viewportDataRange: ViewportDataRange;
        
        private loadMoreThresholdIndex: number;
        private loadingMoreData: boolean;
        private loadMoreThreshold: number;
        private loadMoreCallback: () => void;

        /**
         * Constructs the handler.
         * @param scale - The scale for the loaded data.
         * @param loadMoreCallback - The callback to execute to load more data.
         * @param loadMoreThreshold - How many indexes before the last index loading more data will be triggered.
         * Ex: loadMoreThreshold = 2, dataLength = 10 (last index = 9) will trigger a load when item with index 9 - 2 = 7 or greater is displayed.
         */
        constructor(scale: D3.Scale.GenericScale<any>, loadMoreCallback: () => void, loadMoreThreshold: number = 0) {
            debug.assertValue(loadMoreCallback, 'loadMoreCallback');
            debug.assert(loadMoreThreshold >= 0, 'loadMoreThreshold must be greater than or equal to 0');
            this.loadMoreThreshold = loadMoreThreshold;
            this.loadMoreCallback = loadMoreCallback;
            this.setScale(scale);
        }

        public setScale(scale: D3.Scale.GenericScale<any>): void {
            if (!scale) {
                return;
            }

            // Length of the scale is the amount of data we have loaded. Subtract 1 to get the index.
            // Subtract the threshold to calculate the index at which we need to load more data.
            this.loadMoreThresholdIndex = scale.domain().length - 1 - this.loadMoreThreshold;
        }

        public isLoadingMoreData(): boolean {
            return this.loadingMoreData;
        }

        public onLoadMoreDataCompleted(): void {
            this.loadingMoreData = false;
        }

        public shouldLoadMoreData(): boolean {
            let viewportDataRange = this.viewportDataRange;
            
            if (!viewportDataRange || this.isLoadingMoreData()) {
                return false;
            }

            // If the index of the data we're displaying is more than the threshold, return true.
            return viewportDataRange.endIndex >= this.loadMoreThresholdIndex;
        }

        public loadMoreData(): void {
            if (this.isLoadingMoreData()) {
                return;
            }

            this.loadingMoreData = true;
            this.loadMoreCallback();
        }
    }
}
