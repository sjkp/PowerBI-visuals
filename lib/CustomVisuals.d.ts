
declare function requireAll(requireContext: any): any;




























declare module powerbi.visuals.samples {
    import ArcDescriptor = D3.Layout.ArcDescriptor;
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    import LegendData = powerbi.visuals.LegendData;
    import IValueFormatter = powerbi.visuals.IValueFormatter;
    import SelectableDataPoint = powerbi.visuals.SelectableDataPoint;
    import TooltipDataItem = powerbi.visuals.TooltipDataItem;
    import IInteractivityService = powerbi.visuals.IInteractivityService;
    import IVisualWarning = powerbi.IVisualWarning;
    import IVisualErrorMessage = powerbi.IVisualErrorMessage;
    import VisualCapabilities = powerbi.VisualCapabilities;
    import DataView = powerbi.DataView;
    import DataViewObjectPropertyIdentifier = powerbi.DataViewObjectPropertyIdentifier;
    import IEnumType = powerbi.IEnumType;
    import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
    import ObjectEnumerationBuilder = powerbi.visuals.ObjectEnumerationBuilder;
    import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
    import DataViewValueColumns = powerbi.DataViewValueColumns;
    import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
    import DataViewValueColumn = powerbi.DataViewValueColumn;
    import IVisual = powerbi.IVisual;
    import IDataColorPalette = powerbi.IDataColorPalette;
    import VisualInitOptions = powerbi.VisualInitOptions;
    import VisualUpdateOptions = powerbi.VisualUpdateOptions;
    import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
    interface AsterPlotData {
        dataPoints: AsterDataPoint[];
        highlightedDataPoints?: AsterDataPoint[];
        settings: AsterPlotSettings;
        hasHighlights: boolean;
        legendData: LegendData;
        labelFormatter: IValueFormatter;
        centerText: string;
    }
    interface AsterArcDescriptor extends ArcDescriptor {
        isLabelHasConflict?: boolean;
        data: AsterDataPoint;
    }
    interface AsterDataPoint extends SelectableDataPoint {
        color: string;
        sliceHeight: number;
        sliceWidth: number;
        label: string;
        highlight?: boolean;
        tooltipInfo: TooltipDataItem[];
        labelFontSize: string;
    }
    interface AsterPlotBehaviorOptions {
        selection: D3.Selection;
        clearCatcher: D3.Selection;
        interactivityService: IInteractivityService;
        hasHighlights: boolean;
    }
    class AsterPlotWarning implements IVisualWarning {
        private message;
        constructor(message: string);
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
    class AsterPlotSettings {
        static Default: AsterPlotSettings;
        static parse(dataView: DataView, capabilities: VisualCapabilities): AsterPlotSettings;
        static getProperties(capabilities: VisualCapabilities): {
            [i: string]: {
                [i: string]: DataViewObjectPropertyIdentifier;
            };
        } & {
            general: {
                formatString: DataViewObjectPropertyIdentifier;
            };
            dataPoint: {
                fill: DataViewObjectPropertyIdentifier;
            };
        };
        static createEnumTypeFromEnum(type: any): IEnumType;
        private static getValueFnByType(type);
        static enumerateObjectInstances(settings: AsterPlotSettings, options: EnumerateVisualObjectInstancesOptions, capabilities: VisualCapabilities): ObjectEnumerationBuilder;
        originalSettings: AsterPlotSettings;
        createOriginalSettings(): void;
        legend: {
            show: boolean;
            position: string;
            showTitle: boolean;
            titleText: string;
            labelColor: string;
            fontSize: number;
        };
        labels: {
            show: boolean;
            color: string;
            displayUnits: number;
            precision: number;
            fontSize: number;
        };
        outerLine: {
            show: boolean;
            thickness: number;
        };
    }
    class AsterPlotColumns<T> {
        static Roles: AsterPlotColumns<string>;
        static getColumnSources(dataView: DataView): AsterPlotColumns<DataViewMetadataColumn>;
        static getTableValues(dataView: DataView): AsterPlotColumns<any[]>;
        static getTableRows(dataView: DataView): AsterPlotColumns<any[]>[];
        static getCategoricalValues(dataView: DataView): AsterPlotColumns<any[]>;
        static getSeriesValues(dataView: DataView): string[];
        static getCategoricalColumns(dataView: DataView): AsterPlotColumns<DataViewCategoryColumn & DataViewValueColumn[] & DataViewValueColumns>;
        private static getColumnSourcesT<T>(dataView);
        Category: T;
        Y: T;
    }
    class AsterPlot implements IVisual {
        static capabilities: VisualCapabilities;
        private static AsterSlices;
        private static AsterSlice;
        private static AsterHighlightedSlice;
        private static OuterLine;
        private static labelGraphicsContextClass;
        private static linesGraphicsContextClass;
        private static CenterLabelClass;
        private static CenterTextFontHeightCoefficient;
        private static CenterTextFontWidthCoefficient;
        static converter(dataView: DataView, colors: IDataColorPalette): AsterPlotData;
        private static parseSettings(dataView, categorySource);
        private layout;
        private svg;
        private mainGroupElement;
        private mainLabelsElement;
        private slicesElement;
        private centerText;
        private clearCatcher;
        private colors;
        private hostServices;
        private interactivityService;
        private legend;
        private data;
        private settings;
        private behavior;
        init(options: VisualInitOptions): void;
        update(options: VisualUpdateOptions): void;
        private renderArcsAndLabels(duration, isHighlight?);
        private getLabelLayout(arc, viewport);
        private drawLabels(data, context, layout, viewport, outlineArc, labelArc);
        private renderLegend();
        private updateViewPortAccordingToLegend();
        private drawOuterLine(innerRadius, radius, data);
        private drawCenterText(innerRadius);
        private clear();
        onClearSelection(): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumerationObject;
    }
    module asterPlotUtils {
        var DimmedOpacity: number;
        var DefaultOpacity: number;
        function getFillOpacity(selected: boolean, highlight: boolean, hasSelection: boolean, hasPartialHighlights: boolean): number;
    }
}

declare module powerbi.visuals.samples {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    interface TornadoChartTextOptions {
        fontFamily?: string;
        fontSize?: number;
        sizeUnit?: string;
    }
    interface TornadoChartConstructorOptions {
        svg?: D3.Selection;
        animator?: IGenericAnimator;
        margin?: IMargin;
        columnPadding?: number;
    }
    interface TornadoChartSeries {
        fill: string;
        name: string;
        selectionId: SelectionId;
        categoryAxisEnd: number;
    }
    interface TornadoChartSettings {
        labelOutsideFillColor: string;
        categoriesFillColor: string;
        labelSettings: VisualDataLabelsSettings;
        showLegend?: boolean;
        showCategories?: boolean;
        legendFontSize?: number;
        legendColor?: string;
        getLabelValueFormatter?: (formatString: string) => IValueFormatter;
    }
    interface TornadoChartDataView {
        categories: TextData[];
        series: TornadoChartSeries[];
        settings: TornadoChartSettings;
        legend: LegendData;
        dataPoints: TornadoChartPoint[];
        highlightedDataPoints?: TornadoChartPoint[];
        hasDynamicSeries: boolean;
        hasHighlights: boolean;
        labelHeight: number;
        maxLabelsWidth: number;
        legendObjectProperties: DataViewObject;
    }
    interface TornadoChartPoint extends SelectableDataPoint {
        dx?: number;
        dy?: number;
        px?: number;
        py?: number;
        angle?: number;
        width?: number;
        height?: number;
        label?: LabelData;
        color: string;
        tooltipData: TooltipDataItem[];
        categoryIndex: number;
        highlight?: boolean;
        value: number;
        minValue: number;
        maxValue: number;
        formatString: string;
    }
    interface LabelData {
        dx: number;
        value: number | string;
        source: number | string;
        color: string;
    }
    interface LineData {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }
    interface TextData {
        text: string;
        height: number;
        width: number;
        textProperties: TextProperties;
    }
    interface TornadoBehaviorOptions {
        columns: D3.Selection;
        clearCatcher: D3.Selection;
        interactivityService: IInteractivityService;
    }
    class TornadoChartWarning implements IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
    function getTornadoChartWarning(): IVisualWarning;
    class TornadoChart implements IVisual {
        private static ClassName;
        static capabilities: VisualCapabilities;
        private static Properties;
        static getProperties(capabilities: VisualCapabilities): any;
        private static Columns;
        private static Column;
        private static Axes;
        private static Axis;
        private static Labels;
        private static Label;
        private static LabelTitle;
        private static LabelText;
        private static Categories;
        private static Category;
        private static CategoryTitle;
        private static CategoryText;
        private static MaxSeries;
        private static MaxPrecision;
        private static LabelPadding;
        private static CategoryMinHeight;
        private static DefaultFontSize;
        private static DefaultLegendFontSize;
        private static HighlightedShapeFactor;
        private static CategoryLabelMargin;
        static ScrollBarWidth: number;
        private static DefaultTornadoChartSettings;
        static converter(dataView: DataView, textOptions: TornadoChartTextOptions, colors: IDataColorPalette): TornadoChartDataView;
        static parseSeries(dataViewValueColumns: DataViewValueColumns, index: number, isGrouped: boolean, columnGroup: DataViewValueColumnGroup, colors: IDataColorPalette): TornadoChartSeries;
        private static getColor(properties, defaultColor, objects, colors);
        private static getTextData(text, textOptions, measureWidth?, measureHeight?, overrideFontSize?);
        colors: IDataColorPalette;
        textOptions: TornadoChartTextOptions;
        private columnPadding;
        private leftLabelMargin;
        private durationAnimations;
        private InnerTextHeightDelta;
        private margin;
        private root;
        private svg;
        private main;
        private columns;
        private axes;
        private labels;
        private categories;
        private clearCatcher;
        private legend;
        private behavior;
        private interactivityService;
        private animator;
        private hostService;
        private scrolling;
        private viewport;
        private dataView;
        private heightColumn;
        private allLabelsWidth;
        private allColumnsWidth;
        private columnWidth;
        constructor(tornadoChartConstructorOptions?: TornadoChartConstructorOptions);
        init(visualInitOptions: VisualInitOptions): void;
        update(visualUpdateOptions: VisualUpdateOptions): void;
        private validateDataView(dataView);
        private updateElements();
        private static parseSettings(objects, value, colors);
        private static getPrecision(objects);
        private static getLegendData(series, hasDynamicSeries);
        private render();
        private clearData();
        onClearSelection(): void;
        private renderWithScrolling(tornadoChartDataView, scrollStart, scrollEnd);
        private updateViewport();
        private computeHeightColumn();
        private renderMiddleSection();
        /**
         * Calculate the width, dx value and label info for every data point
         */
        private calculateDataPoints(dataPoints);
        private renderColumns(columnsData, selectSecondSeries?);
        private renderTooltip(selection);
        private getColumnWidth(value, minValue, maxValue, width);
        private getLabelData(value, dxColumn, columnWidth, isColumnPositionLeft, formatStringProp, settings?);
        private renderAxes();
        private generateAxesData();
        private renderLabels(dataPoints, labelsSettings);
        private renderCategories();
        private renderLegend();
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        private enumerateDataPoint(enumeration);
        private enumerateCategoryAxis(enumeration);
        destroy(): void;
    }
}

declare module powerbi.visuals.samples {
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
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
    import IAxisProperties = powerbi.visuals.IAxisProperties;
    import IValueFormatter = powerbi.visuals.IValueFormatter;
    import DataViewPropertyValue = powerbi.DataViewPropertyValue;
    import IAnimationResult = powerbi.visuals.IAnimationResult;
    import IVisual = powerbi.IVisual;
    import VisualCapabilities = powerbi.VisualCapabilities;
    import LegendData = powerbi.visuals.LegendData;
    import VisualInitOptions = powerbi.VisualInitOptions;
    import DataViewObject = powerbi.DataViewObject;
    import IColorScale = powerbi.IColorScale;
    import IColorInfo = powerbi.IColorInfo;
    import DataViewObjects = powerbi.DataViewObjects;
    import DataView = powerbi.DataView;
    import VisualUpdateOptions = powerbi.VisualUpdateOptions;
    import VisualDataLabelsSettings = powerbi.visuals.VisualDataLabelsSettings;
    import ObjectEnumerationBuilder = powerbi.visuals.ObjectEnumerationBuilder;
    import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
    import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
    import IDataColorPalette = powerbi.IDataColorPalette;
    import LabelDataPoint = powerbi.LabelDataPoint;
    import DataViewCategorical = powerbi.DataViewCategorical;
    import DataViewMetadata = powerbi.DataViewMetadata;
    import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
    import SelectionId = powerbi.visuals.SelectionId;
    import LegendSeriesInfo = powerbi.visuals.LegendSeriesInfo;
    import ISelectionHandler = powerbi.visuals.ISelectionHandler;
    enum MekkoVisualChartType {
        clusteredBar,
        clusteredColumn,
        hundredPercentStackedBar,
        hundredPercentStackedColumn,
        stackedBar,
        stackedColumn,
    }
    enum MekkoChartType {
        HundredPercentStackedColumn = 0,
    }
    interface IMekkoChartVisualHost {
        updateLegend(data: LegendData): void;
        getSharedColors(): IDataColorPalette;
        triggerRender(suppressAnimations: boolean): void;
    }
    interface MekkoChartAnimationOptions extends IAnimationOptions {
        viewModel: MekkoChartData;
        series: D3.UpdateSelection;
        layout: IMekkoChartLayout;
        itemCS: ClassAndSelector;
        mainGraphicsContext: D3.Selection;
        viewPort: IViewport;
    }
    interface MekkoChartAnimationResult extends IAnimationResult {
        shapes: D3.UpdateSelection;
    }
    type IMekkoChartAnimator = IAnimator<IAnimatorOptions, MekkoChartAnimationOptions, MekkoChartAnimationResult>;
    interface MekkoChartAxisOptions {
        xScale: D3.Scale.Scale;
        yScale: D3.Scale.Scale;
        seriesOffsetScale?: D3.Scale.Scale;
        columnWidth: number;
        /** Used by clustered only since categoryWidth !== columnWidth */
        categoryWidth?: number;
        isScalar: boolean;
        margin: IMargin;
    }
    interface MekkoChartDataPoint {
        categoryValue: any;
        value: number;
        categoryIndex: number;
        seriesIndex: number;
        highlight?: boolean;
    }
    interface MekkoChartBaseSeries {
        data: MekkoChartDataPoint[];
    }
    interface MekkoChartBaseData {
        series: MekkoChartBaseSeries[];
        categoryMetadata: DataViewMetadataColumn;
        categories: any[];
        hasHighlights?: boolean;
    }
    interface MekkoChartAxesLabels {
        x: string;
        y: string;
        y2?: string;
    }
    interface MekkoChartAxisProperties {
        x: IAxisProperties;
        y1: IAxisProperties;
        y2?: IAxisProperties;
    }
    interface MekkoChartCategoryLayoutOptions {
        availableWidth: number;
        categoryCount: number;
        domain: any;
        trimOrdinalDataOnOverflow: boolean;
        isScalar?: boolean;
        isScrollable?: boolean;
    }
    interface MekkoChartColumnDataPoint extends MekkoChartDataPoint, SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
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
    interface MekkoChartSeries extends MekkoChartBaseSeries {
        displayName: string;
        key: string;
        index: number;
        data: MekkoChartColumnDataPoint[];
        identity: SelectionId;
        color: string;
        labelSettings: VisualDataLabelsSettings;
    }
    interface MekkoChartData extends MekkoChartBaseData {
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
    interface MekkoChartSmallViewPortProperties {
        hideLegendOnSmallViewPort: boolean;
        hideAxesOnSmallViewPort: boolean;
        MinHeightLegendVisible: number;
        MinHeightAxesVisible: number;
    }
    interface MekkoLabelDataPointsGroup {
        labelDataPoints: MekkoLabelDataPoint[];
        maxNumberOfLabels: number;
    }
    interface MekkoLabelDataPoint extends LabelDataPoint {
        isParentRect?: boolean;
    }
    interface MekkoChartVisualInitOptions extends VisualInitOptions {
        svg: D3.Selection;
        cartesianHost: IMekkoChartVisualHost;
        labelsContext?: D3.Selection;
    }
    interface IMekkoChartLayout {
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
    interface MekkoVisualRenderResult {
        dataPoints: SelectableDataPoint[];
        behaviorOptions: any;
        labelDataPoints: LabelDataPoint[];
        labelsAreNumeric: boolean;
        labelDataPointGroups?: MekkoLabelDataPointsGroup[];
    }
    interface MekkoCalculateScaleAndDomainOptions {
        viewport: IViewport;
        margin: IMargin;
        showCategoryAxisLabel: boolean;
        showValueAxisLabel: boolean;
        forceMerge: boolean;
        categoryAxisScaleType: string;
        valueAxisScaleType: string;
        trimOrdinalDataOnOverflow: boolean;
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
    interface MekkoConstructorOptions {
        chartType: MekkoChartType;
        isScrollable?: boolean;
        animator?: IGenericAnimator;
        cartesianSmallViewPortProperties?: MekkoChartSmallViewPortProperties;
        behavior?: IInteractiveBehavior;
    }
    interface MekkoColumnChartData extends MekkoChartData {
        borderSettings: MekkoBorderSettings;
        categoriesWidth: number[];
    }
    interface MekkoBorderSettings {
        show: boolean;
        color: any;
        width: number;
        maxWidth?: number;
    }
    interface MekkoLabelSettings {
        maxPrecision: number;
        minPrecision: number;
    }
    interface MekkoColumnAxisOptions extends MekkoChartAxisOptions {
    }
    interface IMekkoColumnLayout extends IMekkoChartLayout {
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
    interface MekkoAxisRenderingOptions {
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
    interface MekkoDataPoints {
        categoriesWidth: number[];
        series: MekkoChartSeries[];
        hasHighlights: boolean;
        hasDynamicSeries: boolean;
    }
    interface MekkoLegendDataPoint extends LegendDataPoint {
        fontSize?: number;
    }
    interface MekkoCreateAxisOptions extends CreateAxisOptions {
        formatString: string;
        is100Pct?: boolean;
        shouldClamp?: boolean;
        formatStringProp?: DataViewObjectPropertyIdentifier;
    }
    interface MekkoChartCategoryLayout {
        categoryCount: number;
        categoryThickness: number;
        outerPaddingRatio: number;
        isScalar?: boolean;
    }
    interface MekkoChartContext {
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
    interface MekkoColumnChartContext extends MekkoChartContext {
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
    interface MekkoChartConstructorBaseOptions {
        isScrollable: boolean;
        interactivityService?: IInteractivityService;
        animator?: IGenericAnimator;
        isLabelInteractivityEnabled?: boolean;
        tooltipsEnabled?: boolean;
        tooltipBucketEnabled?: boolean;
        cartesianLoadMoreEnabled?: boolean;
        advancedLineLabelsEnabled?: boolean;
    }
    interface MekkoChartConstructorOptions extends MekkoChartConstructorBaseOptions {
        chartType: MekkoVisualChartType;
        animator: IMekkoChartAnimator;
    }
    interface MekkoChartDrawInfo {
        eventGroup?: D3.Selection;
        shapesSelection: D3.Selection;
        viewport: IViewport;
        axisOptions: MekkoChartAxisOptions;
        labelDataPoints: LabelDataPoint[];
    }
    interface IMekkoChartStrategy {
        setData(data: MekkoChartData): void;
        setupVisualProps(columnChartProps: MekkoChartContext): void;
        setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureXDomain?: NumberRange): IAxisProperties;
        setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureYDomain?: NumberRange): IAxisProperties;
        drawColumns(useAnimation: boolean): MekkoChartDrawInfo;
        selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void;
        getClosestColumnIndex(x: number, y: number): number;
    }
    interface IMekkoChartConverterStrategy {
        getLegend(colors: IDataColorPalette, defaultLegendLabelColor: string, defaultColor?: string): LegendSeriesInfo;
        getValueBySeriesAndCategory(series: number, category: number): number;
        getMeasureNameByIndex(series: number, category: number): string;
        hasHighlightValues(series: number): boolean;
        getHighlightBySeriesAndCategory(series: number, category: number): number;
    }
    interface MekkoChartProperty {
        [propertyName: string]: DataViewObjectPropertyIdentifier;
    }
    interface MekkoChartProperties {
        [propertyName: string]: MekkoChartProperty;
    }
    interface MekkoChartClasses {
        [className: string]: ClassAndSelector;
    }
    class MekkoDataWrapper {
        private data;
        private isScalar;
        constructor(columnChartData: MekkoChartBaseData, isScalar: boolean);
        lookupXValue(index: number, type: ValueType): any;
    }
    class MekkoChartStrategy implements IMekkoChartStrategy {
        private static Classes;
        private layout;
        private data;
        private graphicsContext;
        private width;
        private height;
        private margin;
        private xProps;
        private yProps;
        private categoryLayout;
        private columnsCenters;
        private columnSelectionLineHandle;
        private animator;
        private interactivityService;
        private viewportHeight;
        private viewportWidth;
        private static validLabelPositions;
        setupVisualProps(columnChartProps: MekkoColumnChartContext): void;
        setData(data: MekkoColumnChartData): void;
        private static createFormatter(scaleDomain, dataDomain, dataType, isScalar, formatString, bestTickCount, tickValues, getValueFn, useTickIntervalForDisplayUnits?);
        /**
         * Format the linear tick labels or the category labels.
         */
        private static formatAxisTickValues(axis, tickValues, formatter, dataType, isScalar, getValueFn?);
        /**
         * Create a D3 axis including scale. Can be vertical or horizontal, and either datetime, numeric, or text.
         * @param options The properties used to create the axis.
         */
        private createAxis(options);
        private getCategoryAxis(data, size, layout, isVertical, forcedXMin?, forcedXMax?, axisScaleType?);
        setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[], axisScaleType?: string): IAxisProperties;
        setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[], axisScaleType?: string): IAxisProperties;
        drawColumns(useAnimation: boolean): MekkoChartDrawInfo;
        private static drawDefaultShapes(data, series, layout, itemCS, filterZeros, hasSelection);
        selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void;
        getClosestColumnIndex(x: number, y: number): number;
        /**
         * Get the chart's columns centers (x value).
         */
        private getColumnsCenters();
        private moveHandle(selectedColumnIndex);
        static getLayout(data: MekkoColumnChartData, axisOptions: MekkoColumnAxisOptions): IMekkoColumnLayout;
        private createMekkoLabelDataPoints();
    }
    interface MekkoChartSettings {
        columnBorder: MekkoBorderSettings;
        labelSettings: MekkoLabelSettings;
    }
    /**
     * Renders a data series as a cartestian visual.
     */
    class MekkoChart implements IVisual {
        static Classes: MekkoChartClasses;
        static capabilities: VisualCapabilities;
        static Properties: MekkoChartProperties;
        static DefaultSettings: MekkoChartSettings;
        private static getTextProperties(fontSize?);
        static MinOrdinalRectThickness: number;
        static MinScalarRectThickness: number;
        static OuterPaddingRatio: number;
        static InnerPaddingRatio: number;
        static TickLabelPadding: number;
        private static ClassName;
        private static AxisGraphicsContextClassName;
        private static MaxMarginFactor;
        private static MinBottomMargin;
        private static LeftPadding;
        private static RightPadding;
        private static BottomPadding;
        private static YAxisLabelPadding;
        private static XAxisLabelPadding;
        private static TickPaddingY;
        private static TickPaddingRotatedX;
        private static FontSize;
        static MaxNumberOfLabels: number;
        private static MinWidth;
        private static MinHeight;
        private axisGraphicsContext;
        private xAxisGraphicsContext;
        private y1AxisGraphicsContext;
        private y2AxisGraphicsContext;
        private element;
        private svg;
        private clearCatcher;
        private margin;
        private type;
        private hostServices;
        private layers;
        private legend;
        private legendMargins;
        private layerLegendData;
        private hasSetData;
        private visualInitOptions;
        private borderObjectProperties;
        private legendObjectProperties;
        private categoryAxisProperties;
        private valueAxisProperties;
        private cartesianSmallViewPortProperties;
        private interactivityService;
        private behavior;
        private y2AxisExists;
        private categoryAxisHasUnitType;
        private valueAxisHasUnitType;
        private hasCategoryAxis;
        private yAxisIsCategorical;
        private secValueAxisHasUnitType;
        private axes;
        private yAxisOrientation;
        private bottomMarginLimit;
        private leftRightMarginLimit;
        private sharedColorPalette;
        animator: IGenericAnimator;
        private isScrollable;
        private scrollY;
        private scrollX;
        private isXScrollBarVisible;
        private isYScrollBarVisible;
        private svgScrollable;
        private axisGraphicsContextScrollable;
        private labelGraphicsContextScrollable;
        private brushGraphicsContext;
        private brush;
        private static ScrollBarWidth;
        private dataViews;
        private currentViewport;
        constructor(options: MekkoConstructorOptions);
        init(options: VisualInitOptions): void;
        private renderAxesLabels(options);
        private adjustMargins(viewport);
        private translateAxes(viewport);
        /**
         * Returns preferred Category span if the visual is scrollable.
         */
        static getPreferredCategorySpan(categoryCount: number, categoryThickness: number, noOuterPadding?: boolean): number;
        static getIsScalar(objects: DataViewObjects, propertyId: DataViewObjectPropertyIdentifier, type: ValueType): boolean;
        private populateObjectProperties(dataViews);
        update(options: VisualUpdateOptions): void;
        /**
         * Clear the viewport area
         */
        private clearViewport();
        private setVisibility(status?);
        static getLayout(data: MekkoChartData, options: MekkoChartCategoryLayoutOptions): MekkoChartCategoryLayout;
        /**
         * Returns the thickness for each category.
         * For clustered charts, you still need to divide by
         * the number of series to get column width after calling this method.
         * For linear or time scales, category thickness accomodates for
         * the minimum interval between consequtive points.
         * For all types, return value has accounted for outer padding,
         * but not inner padding.
         */
        static getCategoryThickness(seriesList: MekkoChartBaseSeries[], numCategories: number, plotLength: number, domain: number[], isScalar: boolean, trimOrdinalDataOnOverflow: boolean): number;
        private static getMinInterval(seriesList);
        static parseLabelSettings(objects: DataViewObjects): VisualDataLabelsSettings;
        static parseBorderSettings(objects: DataViewObjects): MekkoBorderSettings;
        private enumerateBorder(enumeration);
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        private shouldShowLegendCard();
        private getCategoryAxisValues(enumeration);
        private getValueAxisValues(enumeration);
        onClearSelection(): void;
        private createAndInitLayers(dataViews);
        private renderLegend();
        private hideLegends();
        private addUnitTypeToAxisLabel(axes);
        private shouldRenderSecondaryAxis(axisProperties);
        private shouldRenderAxis(axisProperties, propertyName?);
        private render(suppressAnimations);
        private hideAxisLabels(legendMargins);
        private static getUnitType(axis, axisPropertiesLookup);
        private getMaxMarginFactor();
        private static getChartViewport(viewport, margin);
        private static wordBreak(text, axisProperties, columnsWidth, maxHeight, borderWidth);
        private renderChart(mainAxisScale, axes, width, tickLabelMargins, chartHasAxisLabels, axisLabels, viewport, suppressAnimations, scrollScale?, extent?);
        /**
         * Within the context of the given selection (g), find the offset of
         * the zero tick using the d3 attached datum of g.tick elements.
         * 'Classed' is undefined for transition selections
         */
        private static darkenZeroLine(g);
        private static setAxisLabelColor(g, fill);
        private static setAxisLabelFontSize(g, fontSize);
        private static moveBorder(g, scale, borderWidth, yOffset?);
    }
    function createLayers(type: MekkoChartType, objects: DataViewObjects, interactivityService: IInteractivityService, animator?: any, isScrollable?: boolean): IMekkoColumnChartVisual[];
    /**
     * Renders a stacked and clustered column chart.
     */
    interface IMekkoColumnChartVisual {
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
    class MekkoColumnChart implements IMekkoColumnChartVisual {
        private static ColumnChartClassName;
        static SeriesClasses: ClassAndSelector;
        static BorderClass: ClassAndSelector;
        private svg;
        private unclippedGraphicsContext;
        private mainGraphicsContext;
        private labelGraphicsContext;
        private xAxisProperties;
        private yAxisProperties;
        private currentViewport;
        private data;
        private style;
        private colors;
        private chartType;
        private columnChart;
        private hostService;
        private cartesianVisualHost;
        private interactivity;
        private margin;
        private options;
        private lastInteractiveSelectedColumnIndex;
        private supportsOverflow;
        private interactivityService;
        private dataViewCat;
        private categoryAxisType;
        private animator;
        private isScrollable;
        private element;
        constructor(options: MekkoChartConstructorOptions);
        init(options: MekkoChartVisualInitOptions): void;
        private getCategoryLayout(numCategoryValues, options);
        static getBorderWidth(border: MekkoBorderSettings): number;
        static getBorderColor(border: MekkoBorderSettings): any;
        static converter(dataView: DataViewCategorical, colors: IDataColorPalette, is100PercentStacked?: boolean, isScalar?: boolean, supportsOverflow?: boolean, dataViewMetadata?: DataViewMetadata, chartType?: MekkoVisualChartType): MekkoColumnChartData;
        private static getStackedMultiplier(rawValues, rowIdx, seriesCount, categoryCount);
        private static createDataPoints(dataViewCat, categories, categoryIdentities, legend, seriesObjectsList, converterStrategy, defaultLabelSettings, is100PercentStacked?, isScalar?, supportsOverflow?, isCategoryAlsoSeries?, categoryObjectsList?, defaultDataPointColor?, chartType?, categoryMetadata?);
        private static getDataPointColor(legendItem, categoryIndex, dataPointObjects?);
        private static getStackedLabelColor(isNegative, seriesIndex, seriesCount, categoryIndex, rawValues);
        static sliceSeries(series: MekkoChartSeries[], endIndex: number, startIndex?: number): MekkoChartSeries[];
        static getInteractiveColumnChartDomElement(element: JQuery): HTMLElement;
        getColumnsWidth(): number[];
        getBorderWidth(): number;
        setData(dataViews: DataView[]): void;
        calculateLegend(): LegendData;
        hasLegend(): boolean;
        enumerateObjectInstances(enumeration: ObjectEnumerationBuilder, options: EnumerateVisualObjectInstancesOptions): void;
        private enumerateDataLabels(enumeration);
        private getLabelSettingsOptions(enumeration, labelSettings, isSeries, series?);
        private enumerateDataPoints(enumeration);
        calculateAxesProperties(options: MekkoCalculateScaleAndDomainOptions): IAxisProperties[];
        getPreferredPlotArea(isScalar: boolean, categoryCount: number, categoryThickness: number): IViewport;
        private ApplyInteractivity(chartContext);
        private selectColumn(indexOfColumnSelected, force?);
        private createInteractiveMekkoLegendDataPoints(columnIndex);
        overrideXScale(xProperties: IAxisProperties): void;
        render(suppressAnimations: boolean): MekkoVisualRenderResult;
        onClearSelection(): void;
        getVisualCategoryAxisIsScalar(): boolean;
        getSupportedCategoryAxisType(): string;
        setFilteredData(startIndex: number, endIndex: number): MekkoChartBaseData;
    }
    interface MekkoChartBehaviorOptions {
        datapoints: SelectableDataPoint[];
        bars: D3.Selection;
        eventGroup: D3.Selection;
        mainGraphicsContext: D3.Selection;
        hasHighlights: boolean;
        viewport: IViewport;
        axisOptions: MekkoChartAxisOptions;
        showLabel: boolean;
    }
    class MekkoChartWebBehavior implements IInteractiveBehavior {
        private options;
        bindEvents(options: MekkoChartBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
        private static getDatumForLastInputEvent();
    }
    module MekkoChartUtils {
        var DimmedOpacity: number;
        var DefaultOpacity: number;
        function getSize(scale: D3.Scale.GenericScale<any>, size: number, zeroVal?: number): number;
        function calcValueDomain(data: MekkoChartSeries[], is100pct: boolean): NumberRange;
        function drawSeries(data: MekkoChartData, graphicsContext: D3.Selection, axisOptions: MekkoChartAxisOptions): D3.UpdateSelection;
        function applyInteractivity(columns: D3.Selection, onDragStart: any): void;
        function getFillOpacity(selected: boolean, highlight: boolean, hasSelection: boolean, hasPartialHighlights: boolean): number;
        function setChosenColumnOpacity(mainGraphicsContext: D3.Selection, columnGroupSelector: string, selectedColumnIndex: number, lastColumnIndex: number): void;
        function getClosestColumnIndex(coordinate: number, columnsCenters: number[]): number;
        function applyUserMinMax(isScalar: boolean, dataView: DataViewCategorical, xAxisCardProperties: DataViewObject): DataViewCategorical;
        function transformDomain(dataView: DataViewCategorical, min: DataViewPropertyValue, max: DataViewPropertyValue): DataViewCategorical;
    }
    class MekkoChartSharedColorPalette implements IDataColorPalette {
        private palette;
        private preferredScale;
        private rotated;
        constructor(palette: IDataColorPalette);
        getColorScaleByKey(scaleKey: string): IColorScale;
        getNewColorScale(): IColorScale;
        getColorByIndex(index: number): IColorInfo;
        getSentimentColors(): IColorInfo[];
        getBasePickerColors(): IColorInfo[];
        clearPreferredScale(): void;
        rotateScale(): void;
        private setPreferredScale(scaleKey);
    }
    module MekkochartHelper {
        function getCategoryAxisProperties(dataViewMetadata: DataViewMetadata, axisTitleOnByDefault?: boolean): DataViewObject;
        function getValueAxisProperties(dataViewMetadata: DataViewMetadata, axisTitleOnByDefault?: boolean): DataViewObject;
        function isScalar(isScalar: boolean, xAxisCardProperties: DataViewObject): boolean;
    }
}

declare module powerbi.visuals.samples {
    interface SankeyDiagramConstructorOptions {
        svg?: D3.Selection;
        margin?: IMargin;
        curvatureOfLinks?: number;
    }
    interface SankeyDiagramLabel {
        name: string;
        formattedName: string;
        width: number;
        height: number;
        colour: string;
    }
    interface SankeyDiagramTooltipData {
        tooltipData: TooltipDataItem[];
    }
    interface SankeyDiagramScale {
        x: number;
        y: number;
    }
    interface SankeyDiagramSettings {
        scale?: SankeyDiagramScale;
        fontSize: number;
        isVisibleLabels?: boolean;
        colourOfLabels: string;
    }
    interface SankeyDiagramNode extends SankeyDiagramTooltipData {
        label: SankeyDiagramLabel;
        inputWeight: number;
        outputWeight: number;
        links: SankeyDiagramLink[];
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        colour: string;
        selectionIds: SelectionId[];
    }
    interface SankeyDiagramLink extends SankeyDiagramTooltipData {
        source: SankeyDiagramNode;
        destination: SankeyDiagramNode;
        weigth: number;
        height?: number;
        dySource?: number;
        dyDestination?: number;
        colour: string;
        selectionId: SelectionId;
    }
    interface SankeyDiagramColumn {
        countOfNodes: number;
        sumValueOfNodes: number;
    }
    interface SankeyDiagramDataView {
        nodes: SankeyDiagramNode[];
        links: SankeyDiagramLink[];
        columns: SankeyDiagramColumn[];
        settings: SankeyDiagramSettings;
    }
    interface SankeyDiagramRoleNames {
        rows: string;
        columns: string;
        values: string;
    }
    class SankeyDiagram implements IVisual {
        private static ClassName;
        private static Nodes;
        private static Node;
        private static NodeRect;
        private static NodeLabel;
        private static Links;
        private static Link;
        private static DefaultColourOfNode;
        private static DefaultColourOfLink;
        private static DefaultSettings;
        private static MinWidthOfLabel;
        private static NodeBottomMargin;
        private static NodeMargin;
        private static LabelMargin;
        static RoleNames: SankeyDiagramRoleNames;
        static capabilities: VisualCapabilities;
        private static Properties;
        static getProperties(capabilities: VisualCapabilities): any;
        private margin;
        private nodeWidth;
        private curvatureOfLinks;
        private root;
        private svg;
        private main;
        private nodes;
        private links;
        private colours;
        private viewport;
        private textProperties;
        private dataView;
        private selectionManager;
        constructor(constructorOptions?: SankeyDiagramConstructorOptions);
        init(visualsInitOptions: VisualInitOptions): void;
        update(visualUpdateOptions: VisualUpdateOptions): void;
        private updateViewport(viewport);
        /**
         * Public for testability.
         */
        getPositiveNumber(value: number): number;
        private updateElements(height, width);
        converter(dataView: DataView): SankeyDiagramDataView;
        private getObjectsFromDataView(dataView);
        private getColour(properties, defaultColor, objects);
        private getTooltipDataForLink(valueFormatter, sourceNodeName, destinationNodeName, linkWeight);
        private updateValueOfNode(node);
        private getTooltipForNode(valueFormatter, nodeName, nodeWeight);
        private parseSettings(objects);
        private computePositions(sankeyDiagramDataView);
        private computeXPositions(sankeyDiagramDataView);
        private getScaleByAxisX(numberOfColumns?);
        /**
         * Public for testability.
         */
        sortNodesByX(nodes: SankeyDiagramNode[]): SankeyDiagramNode[];
        /**
         * Public for testability.
         */
        getColumns(nodes: SankeyDiagramNode[]): SankeyDiagramColumn[];
        /**
         * Public for testability.
         */
        getMaxColumn(columns?: SankeyDiagramColumn[]): SankeyDiagramColumn;
        private getScaleByAxisY(sumValueOfNodes);
        private getAvailableSumNodeMarginByY();
        private scalePositionsByAxes(nodes, columns, scale, viewportHeight);
        private computeYPosition(nodes, scale);
        private render(sankeyDiagramDataView);
        private renderNodes(sankeyDiagramDataView);
        private getLabelPositionByAxisX(node);
        private isLabelLargerThanWidth(node);
        private getCurrentPositionOfLabelByAxisX(node);
        private renderLinks(sankeyDiagramDataView);
        private getSvgPath(link);
        private renderTooltip(selection);
        private bindSelectionHandler(sankeyDiagramDataView, nodesSelection, linksSelection);
        private selectMany(selectionIds, clear?);
        private setSelection(nodes, links);
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        private enumerateLabels(enumeration);
        private enumerateLinks(enumeration);
    }
}

declare module powerbi.visuals.samples {
    import SelectableDataPoint = powerbi.visuals.SelectableDataPoint;
    import TooltipDataItem = powerbi.visuals.TooltipDataItem;
    import VisualDataLabelsSettings = powerbi.visuals.VisualDataLabelsSettings;
    import DataViewObjectPropertyIdentifier = powerbi.DataViewObjectPropertyIdentifier;
    import IVisual = powerbi.IVisual;
    import VisualCapabilities = powerbi.VisualCapabilities;
    import IInteractivityService = powerbi.visuals.IInteractivityService;
    import TextProperties = powerbi.TextProperties;
    import VisualUpdateOptions = powerbi.VisualUpdateOptions;
    import DataView = powerbi.DataView;
    import VisualInitOptions = powerbi.VisualInitOptions;
    import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
    import VisualObjectInstance = powerbi.VisualObjectInstance;
    import IInteractiveBehavior = powerbi.visuals.IInteractiveBehavior;
    import ISelectionHandler = powerbi.visuals.ISelectionHandler;
    interface BarData {
        scale: any;
        barIndex: number;
        categoryLabel: string;
        axis: any;
        x: number;
        y: number;
        key: string;
    }
    interface BarRect extends SelectableDataPoint {
        barIndex: number;
        start: number;
        end: number;
        fill: string;
        tooltipInfo?: TooltipDataItem[];
        key: string;
        highlight?: boolean;
    }
    interface TargetValue {
        barIndex: number;
        value: number;
        value2: number;
        fill: string;
        key: string;
    }
    interface ScaledValues {
        firstScale: number;
        secondScale: number;
        thirdScale: number;
        fourthScale: number;
        fifthScale: number;
    }
    interface BarValueRect extends BarRect {
    }
    interface BulletChartValues {
        targetValue: number;
        minimumPercent: number;
        needsImprovementPercent: number;
        satisfactoryPercent: number;
        goodPercent: number;
        veryGoodPercent: number;
        maximumPercent: number;
        targetValue2: number;
        secondTargetVisibility: boolean;
    }
    interface BulletChartOrientation {
        orientation: string;
        reverse: boolean;
        vertical: boolean;
    }
    interface BulletChartColors {
        badColor: string;
        needsImprovementColor: string;
        satisfactoryColor: string;
        goodColor: string;
        veryGoodColor: string;
        bulletColor: string;
    }
    interface BulletChartAxis {
        axis: boolean;
        axisColor: string;
        measureUnits: string;
        unitsColor: string;
    }
    interface BulletChartSettings {
        values: BulletChartValues;
        orientation: BulletChartOrientation;
        colors: BulletChartColors;
        axis: BulletChartAxis;
        labelSettings: VisualDataLabelsSettings;
    }
    interface BulletChartModel {
        bars: BarData[];
        bulletChartSettings: BulletChartSettings;
        bulletValueFormatString: string;
        barRects: BarRect[];
        valueRects: BarValueRect[];
        targetValues: TargetValue[];
        hasHighlights: boolean;
        viewportLength: number;
        labelHeight: number;
        labelHeightTop: number;
        spaceRequiredForBarHorizontally: number;
    }
    let bulletChartRoleNames: {
        value: string;
        targetValue: string;
        minValue: string;
        needsImprovementValue: string;
        satisfactoryValue: string;
        goodValue: string;
        veryGoodValue: string;
        maxValue: string;
        targetValue2: string;
    };
    interface BulletChartProperty {
        [propertyName: string]: DataViewObjectPropertyIdentifier;
    }
    interface BulletChartProperties {
        [propertyName: string]: BulletChartProperty;
    }
    let bulletChartProps: BulletChartProperties;
    class BulletChart implements IVisual {
        private static ScrollBarSize;
        private static SpaceRequiredForBarVertically;
        private static XMarginHorizontal;
        private static YMarginHorizontal;
        private static XMarginVertical;
        private static YMarginVertical;
        private static BulletSize;
        private static DefaultSubtitleFontSizeInPt;
        private static BarMargin;
        private static MaxLabelWidth;
        private static MaxMeasureUnitWidth;
        private static SubtitleMargin;
        private static AxisFontSizeInPt;
        private static SecondTargetLineSize;
        private static MarkerMarginHorizontal;
        private static MarkerMarginVertical;
        private static FontFamily;
        private baselineDelta;
        static capabilities: VisualCapabilities;
        private clearCatcher;
        private bulletBody;
        private scrollContainer;
        private labelGraphicsContext;
        private bulletGraphicsContext;
        private model;
        private behavior;
        private interactivityService;
        private hostService;
        private reverse;
        private vertical;
        static DefaultStyleProperties(): BulletChartSettings;
        private viewport;
        private viewportIn;
        private viewportScroll;
        private static getTextProperties(text, fontSize);
        static converter(dataView: DataView, options: VisualUpdateOptions): BulletChartModel;
        private static addItemToBarArray(collection, barIndex, start, end, fill, tooltipInfo?, categoryIdentity?, highlight?);
        init(options: VisualInitOptions): void;
        update(options: VisualUpdateOptions): void;
        private ClearViewport();
        onClearSelection(): void;
        private calculateLabelWidth(barData, bar?, reversed?);
        private calculateLabelHeight(barData, bar?, reversed?);
        private setUpBulletsHorizontally(bulletBody, model, reveresed);
        private setUpBulletsVertically(bulletBody, model, reveresed);
        private drawSecondTarget(selection, getX, getY);
        destroy(): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        private enumerateLabels(data);
        private enumerateValues(data);
        private enumerateOrientation(data);
        private enumerateAxis(data);
        private enumerateColors(data);
    }
    module TextMeasurementHelper {
        function estimateSvgTextBaselineDelta(textProperties: TextProperties): number;
    }
    interface BulletBehaviorOptions {
        rects: D3.Selection;
        valueRects: D3.Selection;
        clearCatcher: D3.Selection;
        interactivityService: IInteractivityService;
        bulletChartSettings: BulletChartSettings;
        hasHighlights: boolean;
    }
    class BulletWebBehavior implements IInteractiveBehavior {
        private options;
        bindEvents(options: BulletBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
    }
    module bulletChartUtils {
        var DimmedOpacity: number;
        var DefaultOpacity: number;
        function getFillOpacity(selected: boolean, highlight: boolean, hasSelection: boolean, hasPartialHighlights: boolean): number;
    }
}

declare module powerbi.visuals.samples {
    enum WordCloudScaleType {
        logn = 0,
        sqrt = 1,
        value = 2,
    }
    interface WordCloudText {
        text: string;
        textGroup: string;
        count: number;
        index: number;
        selectionId: SelectionId;
        color: string;
    }
    interface WordCloudDataPoint extends IPoint {
        text: string;
        xOff: number;
        yOff: number;
        rotate?: number;
        size?: number;
        padding: number;
        width: number;
        height: number;
        sprite?: number[];
        x0: number;
        y0: number;
        x1: number;
        y1: number;
        color: string;
        selectionIds: SelectionId[];
        wordIndex: number;
        widthOfWord?: number;
        count: number;
    }
    interface WordCloudData {
        dataView: DataView;
        settings: WordCloudSettings;
        texts: WordCloudText[];
        dataPoints: WordCloudDataPoint[];
    }
    interface WordCloudDataView {
        data: WordCloudDataPoint[];
        leftBorder: IPoint;
        rightBorder: IPoint;
    }
    interface WordCloudConstructorOptions {
        svg?: D3.Selection;
        animator?: IGenericAnimator;
        margin?: IMargin;
    }
    class WordCloudSettings {
        static Default: WordCloudSettings;
        static parse(dataView: DataView, capabilities: VisualCapabilities): WordCloudSettings;
        static getProperties(capabilities: VisualCapabilities): {
            [i: string]: {
                [i: string]: DataViewObjectPropertyIdentifier;
            };
        } & {
            general: {
                formatString: DataViewObjectPropertyIdentifier;
            };
            dataPoint: {
                fill: DataViewObjectPropertyIdentifier;
            };
        };
        static createEnumTypeFromEnum(type: any): IEnumType;
        private static getValueFnByType(type);
        static enumerateObjectInstances(settings: WordCloudSettings, options: EnumerateVisualObjectInstancesOptions, capabilities: VisualCapabilities): ObjectEnumerationBuilder;
        originalSettings: WordCloudSettings;
        createOriginalSettings(): void;
        general: {
            maxNumberOfWords: number;
            minFontSize: number;
            maxFontSize: number;
            isBrokenText: boolean;
        };
        stopWords: {
            show: boolean;
            isDefaultStopWords: boolean;
            words: any;
        };
        rotateText: {
            show: boolean;
            minAngle: number;
            maxAngle: number;
            maxNumberOfOrientations: number;
        };
    }
    class WordCloudColumns<T> {
        static Roles: WordCloudColumns<string>;
        static getColumnSources(dataView: DataView): WordCloudColumns<DataViewMetadataColumn>;
        static getTableValues(dataView: DataView): WordCloudColumns<any[]>;
        static getTableRows(dataView: DataView): WordCloudColumns<any[]>[];
        static getCategoricalValues(dataView: DataView): WordCloudColumns<any[]>;
        static getSeriesValues(dataView: DataView): string[];
        static getCategoricalColumns(dataView: DataView): WordCloudColumns<DataViewCategoryColumn & DataViewValueColumn[] & DataViewValueColumns>;
        private static getColumnSourcesT<T>(dataView);
        Category: T;
        Values: T;
    }
    class WordCloud implements IVisual {
        private static ClassName;
        private static Words;
        private static WordGroup;
        private static Size;
        private static StopWordsDelemiter;
        private static Radians;
        private static MinAngle;
        private static MaxAngle;
        private static MaxNumberOfWords;
        private static MinOpacity;
        private static MaxOpacity;
        static FontSizePercentageCoefficent: number;
        static capabilities: VisualCapabilities;
        private static Punctuation;
        private static StopWords;
        private static DefaultMargin;
        static converter(dataView: DataView, colors: IDataColorPalette, previousData: WordCloudData): WordCloudData;
        private static parseSettings(dataView, previousSettings);
        private static getReducedText(texts, stopWords, settings);
        private static getBrokenWords(words, stopWords, settings);
        private static getDataPoints(textGroups, settings, wordValueFormatter);
        private static getWordFontSize(texts, settings, value, minValue, maxValue, scaleType?);
        private static getAngle(settings);
        private settings;
        private data;
        private durationAnimations;
        private specialViewport;
        private fakeViewport;
        private canvasViewport;
        private colors;
        private root;
        private svg;
        private main;
        private wordsContainerSelection;
        private wordsGroupUpdateSelection;
        private wordsTextUpdateSelection;
        private canvas;
        private fontFamily;
        private animator;
        private layout;
        private hostService;
        private selectionManager;
        private visualUpdateOptions;
        private isUpdating;
        private incomingUpdateOptions;
        constructor(options?: WordCloudConstructorOptions);
        init(options: VisualInitOptions): void;
        update(visualUpdateOptions: VisualUpdateOptions): void;
        private computePositions(onPositionsComputed);
        private computeCycle(words, context, surface, borders, onPositionsComputed, wordsForDraw?, index?);
        private updateBorders(word, borders);
        private generateSprites(context, words, startIndex);
        private setSprites(context, words);
        private findPosition(surface, word, borders);
        private archimedeanSpiral(value);
        private checkIntersect(word, surface);
        private checkIntersectOfRectangles(word, leftBorder, rightBorder);
        private getCanvasContext();
        private UpdateSize();
        private render(wordCloudDataView);
        private setSelection(dataPoint);
        private scaleMainView(wordCloudDataView);
        private renderSelection();
        private setOpacity(element, opacityValue);
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumerationObject;
        private animation<T>(element, duration?, delay?, callback?);
        destroy(): void;
    }
}

declare module powerbi.visuals.samples {
    import SemanticFilter = powerbi.data.SemanticFilter;
    interface ITableView {
        data(data: any[], dataIdFunction: (d) => {}, dataAppended: boolean): ITableView;
        rowHeight(rowHeight: number): ITableView;
        columnWidth(columnWidth: number): ITableView;
        orientation(orientation: string): ITableView;
        rows(rows: number): ITableView;
        columns(columns: number): ITableView;
        viewport(viewport: IViewport): ITableView;
        render(): void;
        empty(): void;
    }
    module TableViewFactory {
        function createTableView(options: any): ITableView;
    }
    interface TableViewViewOptions {
        enter: (selection: D3.Selection) => void;
        exit: (selection: D3.Selection) => void;
        update: (selection: D3.Selection) => void;
        loadMoreData: () => void;
        baseContainer: D3.Selection;
        rowHeight: number;
        columnWidth: number;
        orientation: string;
        rows: number;
        columns: number;
        viewport: IViewport;
        scrollEnabled: boolean;
    }
    var chicletSlicerProps: {
        general: {
            orientation: DataViewObjectPropertyIdentifier;
            columns: DataViewObjectPropertyIdentifier;
            rows: DataViewObjectPropertyIdentifier;
            showDisabled: DataViewObjectPropertyIdentifier;
            multiselect: DataViewObjectPropertyIdentifier;
            selection: DataViewObjectPropertyIdentifier;
            selfFilterEnabled: DataViewObjectPropertyIdentifier;
        };
        header: {
            show: DataViewObjectPropertyIdentifier;
            title: DataViewObjectPropertyIdentifier;
            fontColor: DataViewObjectPropertyIdentifier;
            background: DataViewObjectPropertyIdentifier;
            outline: DataViewObjectPropertyIdentifier;
            textSize: DataViewObjectPropertyIdentifier;
            outlineColor: DataViewObjectPropertyIdentifier;
            outlineWeight: DataViewObjectPropertyIdentifier;
        };
        rows: {
            fontColor: DataViewObjectPropertyIdentifier;
            textSize: DataViewObjectPropertyIdentifier;
            height: DataViewObjectPropertyIdentifier;
            width: DataViewObjectPropertyIdentifier;
            background: DataViewObjectPropertyIdentifier;
            transparency: DataViewObjectPropertyIdentifier;
            selectedColor: DataViewObjectPropertyIdentifier;
            hoverColor: DataViewObjectPropertyIdentifier;
            unselectedColor: DataViewObjectPropertyIdentifier;
            disabledColor: DataViewObjectPropertyIdentifier;
            outline: DataViewObjectPropertyIdentifier;
            outlineColor: DataViewObjectPropertyIdentifier;
            outlineWeight: DataViewObjectPropertyIdentifier;
            borderStyle: DataViewObjectPropertyIdentifier;
        };
        images: {
            imageSplit: DataViewObjectPropertyIdentifier;
            stretchImage: DataViewObjectPropertyIdentifier;
            bottomImage: DataViewObjectPropertyIdentifier;
        };
        selectedPropertyIdentifier: DataViewObjectPropertyIdentifier;
        filterPropertyIdentifier: DataViewObjectPropertyIdentifier;
        formatString: DataViewObjectPropertyIdentifier;
        hasSavedSelection: boolean;
    };
    interface ChicletSlicerConstructorOptions {
        behavior?: ChicletSlicerWebBehavior;
    }
    interface ChicletSlicerData {
        categorySourceName: string;
        formatString: string;
        slicerDataPoints: ChicletSlicerDataPoint[];
        slicerSettings: ChicletSlicerSettings;
        hasSelectionOverride?: boolean;
    }
    interface ChicletSlicerDataPoint extends SelectableDataPoint {
        category?: string;
        value?: number;
        mouseOver?: boolean;
        mouseOut?: boolean;
        isSelectAllDataPoint?: boolean;
        imageURL?: string;
        selectable?: boolean;
        filtered?: boolean;
    }
    interface ChicletSlicerSettings {
        general: {
            orientation: string;
            columns: number;
            rows: number;
            multiselect: boolean;
            showDisabled: string;
            selection: string;
            selfFilterEnabled: boolean;
            getSavedSelection?: () => string[];
            setSavedSelection?: (filter: SemanticFilter, selectionIds: string[]) => void;
        };
        margin: IMargin;
        header: {
            borderBottomWidth: number;
            show: boolean;
            outline: string;
            fontColor: string;
            background?: string;
            textSize: number;
            outlineColor: string;
            outlineWeight: number;
            title: string;
        };
        headerText: {
            marginLeft: number;
            marginTop: number;
        };
        slicerText: {
            textSize: number;
            height: number;
            width: number;
            fontColor: string;
            selectedColor: string;
            hoverColor: string;
            unselectedColor: string;
            disabledColor: string;
            marginLeft: number;
            outline: string;
            background?: string;
            transparency: number;
            outlineColor: string;
            outlineWeight: number;
            borderStyle: string;
        };
        slicerItemContainer: {
            marginTop: number;
            marginLeft: number;
        };
        images: {
            imageSplit: number;
            stretchImage: boolean;
            bottomImage: boolean;
        };
    }
    class ChicletSlicer implements IVisual {
        static capabilities: VisualCapabilities;
        private element;
        private searchHeader;
        private searchInput;
        private currentViewport;
        private dataView;
        private slicerHeader;
        private slicerBody;
        private tableView;
        private slicerData;
        private settings;
        private interactivityService;
        private behavior;
        private hostServices;
        private waitingForData;
        private isSelectionLoaded;
        private isSelectionSaved;
        static DefaultFontFamily: string;
        static DefaultFontSizeInPt: number;
        private static cellTotalInnerPaddings;
        private static cellTotalInnerBorders;
        private static chicletTotalInnerRightLeftPaddings;
        static MinImageSplit: number;
        static MaxImageSplit: number;
        private static ItemContainer;
        private static HeaderText;
        private static Container;
        private static LabelText;
        private static Header;
        private static Input;
        private static Clear;
        private static Body;
        static DefaultStyleProperties(): ChicletSlicerSettings;
        constructor(options?: ChicletSlicerConstructorOptions);
        /**
         * Public to testability.
         */
        static getValidImageSplit(imageSplit: any): number;
        static converter(dataView: DataView, localizedSelectAllText: string, searchText: string, interactivityService: IInteractivityService): ChicletSlicerData;
        init(options: VisualInitOptions): void;
        private static canSelect(args);
        update(options: VisualUpdateOptions): void;
        onResizing(finalViewport: IViewport): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        private enumerateHeader(data);
        private enumerateRows(data);
        private enumerateGeneral(data);
        private enumerateImages(data);
        private updateInternal(resetScrollbarPosition);
        private initContainer();
        private createSearchHeader(container);
        private updateSearchHeader();
        private onLoadMoreData();
        private getSlicerBodyViewport(currentViewport);
        private updateSlicerBodyDimensions();
        static getChicletTextProperties(textSize?: number): TextProperties;
        private getHeaderHeight();
        private getRowHeight();
        private getBorderStyle(outlineElement);
        private getBorderWidth(outlineElement, outlineWeight);
        private getBorderRadius(borderType);
    }
    module ChicletSlicerTextMeasurementHelper {
        function estimateSvgTextBaselineDelta(textProperties: TextProperties): number;
    }
    interface ChicletSlicerBehaviorOptions {
        slicerItemContainers: D3.Selection;
        slicerItemLabels: D3.Selection;
        slicerItemInputs: D3.Selection;
        slicerClear: D3.Selection;
        dataPoints: ChicletSlicerDataPoint[];
        interactivityService: IInteractivityService;
        slicerSettings: ChicletSlicerSettings;
        isSelectionLoaded: boolean;
    }
    class ChicletSlicerWebBehavior implements IInteractiveBehavior {
        private slicers;
        private slicerItemLabels;
        private slicerItemInputs;
        private dataPoints;
        private interactivityService;
        private slicerSettings;
        private options;
        bindEvents(options: ChicletSlicerBehaviorOptions, selectionHandler: ISelectionHandler): void;
        loadSelection(selectionHandler: ISelectionHandler): void;
        private static getFilterFromSelectors(selectionHandler, isSelectionModeInverted);
        saveSelection(selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
        private renderMouseover();
        styleSlicerInputs(slicers: D3.Selection, hasSelection: boolean): void;
    }
}

declare module powerbi.visuals.samples {
    import LegendData = powerbi.visuals.LegendData;
    import IDataLabelInfo = powerbi.IDataLabelInfo;
    import LabelEnabledDataPoint = powerbi.visuals.LabelEnabledDataPoint;
    import SelectableDataPoint = powerbi.visuals.SelectableDataPoint;
    import TooltipDataItem = powerbi.visuals.TooltipDataItem;
    import VisualCapabilities = powerbi.VisualCapabilities;
    import DataView = powerbi.DataView;
    import DataViewObjectPropertyIdentifier = powerbi.DataViewObjectPropertyIdentifier;
    import IEnumType = powerbi.IEnumType;
    import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
    import ObjectEnumerationBuilder = powerbi.visuals.ObjectEnumerationBuilder;
    import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
    import DataViewValueColumns = powerbi.DataViewValueColumns;
    import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
    import DataViewValueColumn = powerbi.DataViewValueColumn;
    import IVisual = powerbi.IVisual;
    import IDataColorPalette = powerbi.IDataColorPalette;
    import VisualInitOptions = powerbi.VisualInitOptions;
    import VisualUpdateOptions = powerbi.VisualUpdateOptions;
    interface ChordChartData {
        settings: ChordChartSettings;
        dataView: DataView;
        dataMatrix: number[][];
        labelDataPoints: ChordArcDescriptor[];
        legendData?: LegendData;
        tooltipData: ChordTooltipData[][];
        sliceTooltipData: ChordTooltipData[];
        tickUnit: number;
        differentFromTo: boolean;
        defaultDataPointColor?: string;
        prevAxisVisible: boolean;
    }
    interface ChordArcDescriptor extends D3.Layout.ArcDescriptor, IDataLabelInfo {
        data: ChordArcLabelData;
    }
    interface ChordTicksArcDescriptor extends D3.Layout.ArcDescriptor {
        angleLabels: {
            angle: number;
            label: string;
        }[];
    }
    interface ChordArcLabelData extends LabelEnabledDataPoint, SelectableDataPoint {
        label: string;
        labelColor: string;
        barColor: string;
        isCategory: boolean;
    }
    interface ChordLabelEnabledDataPoint extends LabelEnabledDataPoint {
        data?: ChordArcLabelData;
    }
    interface ChordTooltipData {
        tooltipInfo: TooltipDataItem[];
    }
    class ChordChartSettings {
        static Default: ChordChartSettings;
        static parse(dataView: DataView, capabilities: VisualCapabilities): ChordChartSettings;
        static getProperties(capabilities: VisualCapabilities): {
            [i: string]: {
                [i: string]: DataViewObjectPropertyIdentifier;
            };
        } & {
            general: {
                formatString: DataViewObjectPropertyIdentifier;
            };
            dataPoint: {
                fill: DataViewObjectPropertyIdentifier;
            };
        };
        static createEnumTypeFromEnum(type: any): IEnumType;
        private static getValueFnByType(type);
        static enumerateObjectInstances(settings: any, options: EnumerateVisualObjectInstancesOptions, capabilities: VisualCapabilities): ObjectEnumerationBuilder;
        dataPoint: {
            defaultColor: any;
            showAllDataPoints: boolean;
        };
        axis: {
            show: boolean;
        };
        labels: {
            show: boolean;
            color: string;
            fontSize: number;
        };
    }
    class ChordChartColumns<T> {
        static Roles: ChordChartColumns<string>;
        static getColumnSources(dataView: DataView): ChordChartColumns<DataViewMetadataColumn>;
        static getTableValues(dataView: DataView): ChordChartColumns<any[]>;
        static getTableRows(dataView: DataView): ChordChartColumns<any[]>[];
        static getCategoricalValues(dataView: DataView): ChordChartColumns<any[]>;
        static getSeriesValues(dataView: DataView): string[];
        static getCategoricalColumns(dataView: DataView): ChordChartColumns<DataViewCategoryColumn & DataViewValueColumn[] & DataViewValueColumns>;
        private static getColumnSourcesT<T>(dataView);
        Category: T;
        Series: T;
        Y: T;
    }
    class ChordChart implements IVisual {
        static capabilities: VisualCapabilities;
        static PolylineOpacity: number;
        private static OuterArcRadiusRatio;
        private static InnerArcRadiusRatio;
        private static LabelMargin;
        private static DefaultMargin;
        private static VisualClassName;
        private static TicksFontSize;
        private static sliceClass;
        private static chordClass;
        private static sliceTicksClass;
        private static tickPairClass;
        private static tickLineClass;
        private static tickTextClass;
        private static labelGraphicsContextClass;
        private static labelsClass;
        private static linesGraphicsContextClass;
        private static lineClass;
        private chordLayout;
        private element;
        private svg;
        private mainGraphicsContext;
        private slices;
        private labels;
        private lines;
        private data;
        private settings;
        private layout;
        private duration;
        private colors;
        private selectionManager;
        private radius;
        private innerRadius;
        private outerRadius;
        static converter(dataView: DataView, colors: IDataColorPalette, prevAxisVisible: boolean): ChordChartData;
        private static parseSettings(dataView);
        private static getValidArrayLength(array);
        private static getChordArcDescriptors(groups, datum);
        init(options: VisualInitOptions): void;
        update(options: VisualUpdateOptions): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumerationObject;
        private calculateRadius();
        private drawCategoryLabels();
        private getDataLabelManager();
        private render();
        private clear();
        private clearTicks();
        private getChordTicksArcDescriptors();
        private drawTicks();
        private renderLabels(filteredData, layout, isDonut?, forAnimation?);
        private renderLines(filteredData, arc, outerArc);
        private getChordChartLabelLayout(outerArc);
        private static union_arrays(x, y);
    }
}

declare module powerbi.visuals.samples {
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import IInteractiveBehavior = powerbi.visuals.IInteractiveBehavior;
    import Lazy = jsCommon.Lazy;
    import ISize = powerbi.visuals.shapes.ISize;
    import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
    import DataViewValueColumn = powerbi.DataViewValueColumn;
    import SelectableDataPoint = powerbi.visuals.SelectableDataPoint;
    import TooltipEnabledDataPoint = powerbi.visuals.TooltipEnabledDataPoint;
    import ContentPositions = powerbi.ContentPositions;
    import LegendData = powerbi.visuals.LegendData;
    import NumberRange = powerbi.NumberRange;
    import PointDataLabelsSettings = powerbi.visuals.PointDataLabelsSettings;
    import SelectionId = powerbi.visuals.SelectionId;
    import DataViewObjectPropertyIdentifier = powerbi.DataViewObjectPropertyIdentifier;
    import IVisual = powerbi.IVisual;
    import TextProperties = powerbi.TextProperties;
    import IAxisProperties = powerbi.visuals.IAxisProperties;
    import IDataColorPalette = powerbi.IDataColorPalette;
    import VisualInitOptions = powerbi.VisualInitOptions;
    import IInteractivityService = powerbi.visuals.IInteractivityService;
    import DataViewObject = powerbi.DataViewObject;
    import VisualCapabilities = powerbi.VisualCapabilities;
    import IValueFormatter = powerbi.visuals.IValueFormatter;
    import VisualUpdateOptions = powerbi.VisualUpdateOptions;
    import CalculateScaleAndDomainOptions = powerbi.visuals.CalculateScaleAndDomainOptions;
    import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
    import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
    import ISelectionHandler = powerbi.visuals.ISelectionHandler;
    import DataView = powerbi.DataView;
    interface ElementProperty {
        [propertyName: string]: any;
    }
    interface ElementProperties {
        name: string;
        selector: string;
        className?: string;
        data?: any;
        styles?: ElementProperty;
        attributes?: ElementProperty;
    }
    interface EnhancedScatterChartRadiusData {
        sizeMeasure: DataViewValueColumn;
        index: number;
    }
    interface EnhancedScatterChartDataPoint extends SelectableDataPoint, TooltipEnabledDataPoint {
        x: any;
        y: any;
        size: number | ISize;
        radius: EnhancedScatterChartRadiusData;
        fill: string;
        labelFill?: string;
        labelFontSize: any;
        contentPosition: ContentPositions;
        formattedCategory: Lazy<string>;
        colorFill?: string;
        svgurl?: string;
        shapeSymbolType?: (number) => string;
        rotation: number;
        backdrop?: string;
        xStart?: number;
        xEnd?: number;
        yStart?: number;
        yEnd?: number;
    }
    interface EnhancedScatterChartBackdrop {
        show: boolean;
        url: string;
    }
    interface EnhancedScatterChartAxesLabels {
        x: string;
        y: string;
        y2?: string;
    }
    interface EnhancedScatterChartData {
        useShape: boolean;
        useCustomColor: boolean;
        backdrop?: EnhancedScatterChartBackdrop;
        outline?: boolean;
        crosshair?: boolean;
        xCol: DataViewMetadataColumn;
        yCol: DataViewMetadataColumn;
        dataPoints: EnhancedScatterChartDataPoint[];
        legendData: LegendData;
        axesLabels: EnhancedScatterChartAxesLabels;
        size?: DataViewMetadataColumn;
        sizeRange: NumberRange;
        dataLabelsSettings: PointDataLabelsSettings;
        defaultDataPointColor?: string;
        showAllDataPoints?: boolean;
        hasDynamicSeries?: boolean;
        fillPoint?: boolean;
        colorBorder?: boolean;
        colorByCategory?: boolean;
        selectedIds: SelectionId[];
    }
    interface EnhancedScatterDataRange {
        minRange: number;
        maxRange: number;
        delta: number;
    }
    interface EnhancedScatterChartProperty {
        [properyName: string]: DataViewObjectPropertyIdentifier;
    }
    interface EnhancedScatterChartProperties {
        [properyName: string]: EnhancedScatterChartProperty;
    }
    class EnhancedScatterChart implements IVisual {
        private static AxisGraphicsContextClassName;
        private static ClassName;
        private static MainGraphicsContextClassName;
        private static LegendLabelFontSizeDefault;
        private static LabelDisplayUnitsDefault;
        private static AxisFontSize;
        private static CrosshairTextMargin;
        private static BubbleRadius;
        private static MinSizeRange;
        private static MaxSizeRange;
        private static AreaOf300By300Chart;
        private static DataLabelXOffset;
        private static DataLabelYOffset;
        private static DotClasses;
        private static ImageClasses;
        private static TextProperties;
        static CrosshairCanvasSelector: ClassAndSelector;
        static CrosshairLineSelector: ClassAndSelector;
        static CrosshairVerticalLineSelector: ClassAndSelector;
        static CrosshairHorizontalLineSelector: ClassAndSelector;
        static CrosshairTextSelector: ClassAndSelector;
        static MaxTranslateValue: number;
        static MinTranslateValue: number;
        static DefaultBubbleOpacity: number;
        static DimmedBubbleOpacity: number;
        private legend;
        private svgScrollable;
        private axisGraphicsContext;
        private axisGraphicsContextScrollable;
        private xAxisGraphicsContext;
        private backgroundGraphicsContext;
        private y1AxisGraphicsContext;
        private svg;
        private element;
        private mainGraphicsSVGSelection;
        private mainGraphicsContext;
        private clearCatcher;
        private mainGraphicsG;
        private crosshairCanvasSelection;
        private crosshairVerticalLineSelection;
        private crosshairHorizontalLineSelection;
        private crosshairTextSelection;
        private style;
        private data;
        private dataView;
        private xAxisProperties;
        private yAxisProperties;
        private colors;
        private options;
        private interactivity;
        private interactivityService;
        private categoryAxisProperties;
        private valueAxisProperties;
        private yAxisOrientation;
        private scrollY;
        private scrollX;
        private dataViews;
        private legendObjectProperties;
        private hostServices;
        private layerLegendData;
        private legendLabelFontSize;
        private hasCategoryAxis;
        private yAxisIsCategorical;
        private bottomMarginLimit;
        private leftRightMarginLimit;
        private isXScrollBarVisible;
        private isYScrollBarVisible;
        private ScrollBarWidth;
        private categoryAxisHasUnitType;
        private valueAxisHasUnitType;
        private svgDefaultImage;
        private oldBackdrop;
        private behavior;
        private animator;
        private keyArray;
        private _margin;
        private margin;
        private _viewport;
        private viewport;
        private _viewportIn;
        private viewportIn;
        private legendViewport;
        static ColumnCategory: string;
        static ColumnSeries: string;
        static ColumnX: string;
        static ColumnY: string;
        static ColumnSize: string;
        static ColumnGradient: string;
        static ColumnColorFill: string;
        static ColumnShape: string;
        static ColumnImage: string;
        static ColumnRotation: string;
        static ColumnBackdrop: string;
        static ColumnXStart: string;
        static ColumnXEnd: string;
        static ColumnYStart: string;
        static ColumnYEnd: string;
        static capabilities: VisualCapabilities;
        /**
         * Public for testability.
         */
        static getPropertiesByCapabilities<T>(capabilities: VisualCapabilities): T;
        /**
         * Public for testability.
         */
        static Properties: EnhancedScatterChartProperties;
        private static substractMargin(viewport, margin);
        private static getCustomSymbolType(shape);
        init(options: VisualInitOptions): void;
        private adjustMargins();
        private getValueAxisProperties(dataViewMetadata, axisTitleOnByDefault?);
        private getCategoryAxisProperties(dataViewMetadata, axisTitleOnByDefault?);
        static converter(dataView: DataView, colorPalette: IDataColorPalette, interactivityService?: IInteractivityService, categoryAxisProperties?: DataViewObject, valueAxisProperties?: DataViewObject): EnhancedScatterChartData;
        private static createSeriesLegend(dataValues, colorPalette, categorical, formatString, defaultDataPointColor);
        private static getSizeRangeForGroups(dataViewValueGroups, sizeColumnIndex);
        private static getMetadata(categories, grouped, source);
        static createLazyFormattedCategory(formatter: IValueFormatter, value: string): Lazy<string>;
        private static createDataPoints(dataValues, metadata, categories, categoryValues, categoryFormatter, categoryIdentities, categoryObjects, colorPalette, hasDynamicSeries, labelSettings, defaultDataPointColor?, categoryQueryName?);
        private static getMeasureValue(measureIndex, seriesValues);
        private static getNumberFromDataViewValueColumnById(dataViewValueColumn, index);
        private static getValueFromDataViewValueColumnById(dataViewValueColumn, index);
        private static getDefaultData();
        setData(dataViews: DataView[]): void;
        update(options: VisualUpdateOptions): void;
        private populateObjectProperties(dataViews);
        private renderLegend();
        private shouldRenderAxis(axisProperties, propertyName?);
        private getMaxMarginFactor();
        private adjustViewportbyBackdrop();
        render(suppressAnimations: boolean): void;
        private cloneDataPoints(dataPoints);
        private darkenZeroLine(g);
        private getCategoryAxisFill();
        private getEnhanchedScatterChartLabelLayout(labelSettings, viewport, sizeRange);
        private static getBubbleRadius(radiusData, sizeRange, viewport);
        private static getBubblePixelAreaSizeRange(viewPort, minSizeRange, maxSizeRange);
        static projectSizeToPixels(size: number, actualSizeDataRange: EnhancedScatterDataRange, bubblePixelAreaSizeRange: EnhancedScatterDataRange): number;
        static project(value: number, actualSizeDataRange: EnhancedScatterDataRange, bubblePixelAreaSizeRange: EnhancedScatterDataRange): number;
        static rangeContains(range: EnhancedScatterDataRange, value: number): boolean;
        private getValueAxisFill();
        /**
         * Public for testability.
         */
        renderCrosshair(): D3.Selection;
        /**
         * Public for testability.
         */
        addCrosshairCanvasToDOM(rootElement: D3.Selection): D3.Selection;
        /**
         * Public for testability.
         */
        addCrosshairLineToDOM(rootElement: D3.Selection, elementSelector: ClassAndSelector): D3.Selection;
        /**
         * Public for testability.
         */
        addCrosshairTextToDOM(rootElement: D3.Selection): D3.Selection;
        /**
         * Public for testability.
         */
        bindCrosshairEvents(): void;
        /**
         * Public for testability.
         */
        updateCrosshair(x: number, y: number): void;
        /**
         * Public for testability.
         */
        addElementToDOM(rootElement: D3.Selection, properties: ElementProperties): D3.Selection;
        private renderBackground();
        private renderChart(mainAxisScale, xAxis, yAxis, tickLabelMargins, chartHasAxisLabels, axisLabels, suppressAnimations, scrollScale?, extent?);
        private renderAxesLabels(axisLabels, legendMargin, hideXAxisTitle, hideYAxisTitle, hideY2AxisTitle);
        private updateAxis();
        private getUnitType(xAxis);
        private addUnitTypeToAxisLabel(xAxis, yAxis);
        private drawScatterMarkers(scatterData, hasSelection, sizeRange, duration);
        static getBubbleOpacity(d: EnhancedScatterChartDataPoint, hasSelection: boolean): number;
        calculateAxes(categoryAxisProperties: DataViewObject, valueAxisProperties: DataViewObject, textProperties: TextProperties, scrollbarVisible: boolean): IAxisProperties[];
        calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[];
        /**
         * Public for testability.
         */
        optimizeTranslateValues(values: number[]): number[];
        /**
         * Public for testability.
         */
        optimizeTranslateValue(value: number): number;
        private enumerateDataPoints(enumeration);
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        hasLegend(): boolean;
        private getLegendValue(enumeration);
        private getCategoryAxisValues(enumeration);
        private getValueAxisValues(enumeration);
        onClearSelection(): void;
    }
    interface CustomVisualBehaviorOptions {
        layerOptions: any[];
        clearCatcher: D3.Selection;
    }
    class CustomVisualBehavior implements IInteractiveBehavior {
        private behaviors;
        constructor(behaviors: IInteractiveBehavior[]);
        bindEvents(options: CustomVisualBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
    }
    interface EnhancedScatterBehaviorOptions {
        dataPointsSelection: D3.Selection;
        data: EnhancedScatterChartData;
        plotContext: D3.Selection;
    }
    class EnhancedScatterChartWebBehavior implements IInteractiveBehavior {
        private dimmedBubbleOpacity;
        private defaultBubbleOpacity;
        private bubbles;
        private shouldEnableFill;
        private colorBorder;
        constructor(dimmedBubbleOpacity: number, defaultBubbleOpacity: number);
        bindEvents(options: EnhancedScatterBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
        private getMarkerFillOpacity(hasSize, shouldEnableFill, hasSelection, isSelected);
        getMarkerStrokeOpacity(hasSize: boolean, colorBorder: boolean, hasSelection: boolean, isSelected: boolean): number;
    }
}

declare var THREE: any;
declare var WebGLHeatmap: any;
declare var GlobeMapCanvasLayers: JQuery[];
declare module powerbi.visuals.samples {
    class GlobeMapSettings {
        static Default: GlobeMapSettings;
        static parse(dataView: DataView, capabilities: VisualCapabilities): GlobeMapSettings;
        static getProperties(capabilities: VisualCapabilities): {
            [i: string]: {
                [i: string]: DataViewObjectPropertyIdentifier;
            };
        } & {
            general: {
                formatString: DataViewObjectPropertyIdentifier;
            };
            dataPoint: {
                fill: DataViewObjectPropertyIdentifier;
            };
        };
        static createEnumTypeFromEnum(type: any): IEnumType;
        private static getValueFnByType(type);
        static enumerateObjectInstances(settings: GlobeMapSettings, options: EnumerateVisualObjectInstancesOptions, capabilities: VisualCapabilities): ObjectEnumerationBuilder;
        originalSettings: GlobeMapSettings;
        createOriginalSettings(): void;
        dataPoint: {};
    }
    class GlobeMapColumns<T> {
        static Roles: GlobeMapColumns<string>;
        static getColumnSources(dataView: DataView): GlobeMapColumns<DataViewMetadataColumn>;
        static getTableValues(dataView: DataView): GlobeMapColumns<any[]>;
        static getTableRows(dataView: DataView): GlobeMapColumns<any[]>[];
        static getCategoricalValues(dataView: DataView): GlobeMapColumns<any[]>;
        static getSeriesValues(dataView: DataView): string[];
        static getCategoricalColumns(dataView: DataView): GlobeMapColumns<DataViewCategoryColumn & DataViewValueColumn[] & DataViewValueColumns>;
        static getGroupedValueColumns(dataView: DataView): GlobeMapColumns<DataViewValueColumn>[];
        private static getColumnSourcesT<T>(dataView);
        Category: T;
        Series: T;
        X: T;
        Y: T;
        Height: T;
        Heat: T;
    }
    class GlobeMap implements IVisual {
        static MercartorSphere: any;
        private static GlobeSettings;
        private layout;
        private container;
        private domElement;
        private camera;
        private renderer;
        private scene;
        private orbitControls;
        private earth;
        private data;
        private settings;
        private heatmap;
        private heatTexture;
        private mapTextures;
        private barsGroup;
        private readyToRender;
        private deferredRenderTimerId;
        private globeMapLocationCache;
        private locationsToLoad;
        private locationsLoaded;
        private renderLoopEnabled;
        private needsRender;
        private mousePosNormalized;
        private mousePos;
        private rayCaster;
        private selectedBar;
        private hoveredBar;
        private averageBarVector;
        private zoomControl;
        private colors;
        private style;
        static capabilities: VisualCapabilities;
        private static converter(dataView, globeMapLocationCache, colors);
        private static parseSettings(dataView);
        private static createDataPointForEnumeration(dataView, source, seriesIndex, metaData, colorHelper, colors);
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        init(options: VisualInitOptions): void;
        private setup();
        private initScene();
        private shouldRender();
        private createEarth();
        zoomClicked(zoomDirection: any): void;
        rotateCam(deltaX: number, deltaY: number): void;
        private initTextures();
        private initHeatmap();
        private setEarthTexture();
        update(options: VisualUpdateOptions): void;
        cleanHeatAndBar(): void;
        private renderMagic();
        private getBarMaterialByIndex(index);
        private getToolTipDataForSeries(toolTipData, dataPointToolTip);
        private geocodeRenderDatum(renderDatum);
        private defferedRender();
        private initRayCaster();
        private intersectBars();
        private animateCamera(to, done?);
        destroy(): void;
        private initZoomControl();
        private initMercartorSphere();
        private getBingMapCanvas(resolution);
    }
}
declare function loadGlobeMapLibs(): void;

declare module powerbi.visuals.samples {
    interface RadarChartConstructorOptions {
        animator?: IGenericAnimator;
        svg?: D3.Selection;
        margin?: IMargin;
    }
    interface RadarChartDatapoint extends SelectableDataPoint {
        x: number;
        y: number;
        y0?: number;
        color?: string;
        value?: number;
        tooltipInfo?: TooltipDataItem[];
        labelFormatString?: string;
        labelFontSize?: string;
    }
    interface RadarChartData {
        legendData: LegendData;
        series: RadarChartSeries[];
        settings: RadarChartSettings;
        dataLabelsSettings: PointDataLabelsSettings;
    }
    interface RadarChartSeries {
        fill: string;
        name: string;
        data: RadarChartDatapoint[];
        identity: SelectionId;
    }
    interface RadarChartSettings {
        showLegend?: boolean;
    }
    interface RadarChartBehaviorOptions {
        selection: D3.Selection;
        clearCatcher: D3.Selection;
    }
    /**
     * RadarChartBehavior
     */
    class RadarChartWebBehavior implements IInteractiveBehavior {
        private selection;
        bindEvents(options: RadarChartBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
    }
    class RadarChart implements IVisual {
        static capabilities: VisualCapabilities;
        /** Note: Public for testability */
        static formatStringProp: DataViewObjectPropertyIdentifier;
        private static Properties;
        private static VisualClassName;
        private static Segments;
        private static SegmentNode;
        private static ZeroSegment;
        private static ZeroSegmentNode;
        private static ZeroLabel;
        private static Axis;
        private static AxisNode;
        private static AxisLabel;
        private static Chart;
        private static ChartNode;
        private static ChartArea;
        private static ChartPolygon;
        private static ChartDot;
        private static MaxPrecision;
        private static MinPrecision;
        private svg;
        private segments;
        private zeroSegment;
        private axis;
        private chart;
        private mainGroupElement;
        private colors;
        private viewport;
        private interactivityService;
        private animator;
        private margin;
        private legend;
        private legendObjectProperties;
        private radarChartData;
        private isInteractiveChart;
        private zeroPointRadius;
        private static DefaultMargin;
        private static SegmentLevels;
        private static SegmentFactor;
        private static Radians;
        private static Scale;
        static NodeFillOpacity: number;
        static AreaFillOpacity: number;
        static DimmedAreaFillOpacity: number;
        private angle;
        private radius;
        static AxesLabelsFontFamily: string;
        static AxesLabelsfontSize: string;
        static AxesLabelsMaxWidth: number;
        static converter(dataView: DataView, colors: IDataColorPalette): RadarChartData;
        constructor(options?: RadarChartConstructorOptions);
        init(options: VisualInitOptions): void;
        update(options: VisualUpdateOptions): void;
        private getRadarChartLabelLayout(labelSettings, allDataPoints);
        private drawCircularSegments(values);
        private drawDataLabels(series);
        private drawAxes(values);
        private drawAxesLabels(values, dataViewMetadataColumn?);
        private drawChart(series, duration);
        private calculateChartDomain(series);
        private renderLegend(radarChartData);
        private drawZeroCircularSegment(values);
        private drawZeroLabel();
        private getDataPoints(series);
        private getAllDataPointsList(series);
        private isPercentChart(dataPointsList);
        private parseLegendProperties(dataView);
        private static parseSettings(dataView);
        private static getPrecision(value);
        private static parseLabelSettings(dataView);
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        private getLabelSettingsOptions(enumeration, labelSettings);
        private enumerateDataLabels(enumeration);
        private enumerateLegend(settings);
        private enumerateDataPoint(enumeration);
        private updateViewport();
    }
}

declare module powerbi.visuals.samples {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    import IGenericAnimator = powerbi.visuals.IGenericAnimator;
    import IMargin = powerbi.visuals.IMargin;
    import TooltipEnabledDataPoint = powerbi.visuals.TooltipEnabledDataPoint;
    import SelectionId = powerbi.visuals.SelectionId;
    import IValueFormatter = powerbi.visuals.IValueFormatter;
    import IVisualWarning = powerbi.IVisualWarning;
    import IVisualErrorMessage = powerbi.IVisualErrorMessage;
    import IVisual = powerbi.IVisual;
    import VisualCapabilities = powerbi.VisualCapabilities;
    import ValueTypeDescriptor = powerbi.ValueTypeDescriptor;
    import ValueType = powerbi.ValueType;
    import VisualInitOptions = powerbi.VisualInitOptions;
    import DataView = powerbi.DataView;
    import VisualUpdateOptions = powerbi.VisualUpdateOptions;
    import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
    import VisualObjectInstance = powerbi.VisualObjectInstance;
    import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
    import IAxisProperties = powerbi.visuals.IAxisProperties;
    interface HistogramConstructorOptions {
        svg?: D3.Selection;
        animator?: IGenericAnimator;
        margin?: IMargin;
    }
    interface HistogramAxisSettings {
        axisColor?: string;
        displayUnits?: number;
        precision?: number;
        title?: boolean;
        show?: boolean;
        style?: string;
    }
    interface HistogramXAxisSettings extends HistogramAxisSettings {
    }
    interface HistogramYAxisSettings extends HistogramAxisSettings {
        start?: number;
        end?: number;
        position?: string;
    }
    interface HistogramLabelSettings {
        show?: boolean;
        color?: string;
        displayUnits?: number;
        precision?: number;
        fontSize?: number;
    }
    interface HistogramSettings {
        displayName?: string;
        fillColor?: string;
        frequency: boolean;
        bins?: number;
        precision: number;
        maxX?: number;
        xAxisSettings: HistogramXAxisSettings;
        yAxisSettings: HistogramYAxisSettings;
        labelSettings: HistogramLabelSettings;
    }
    interface HistogramData extends D3.Layout.Bin, TooltipEnabledDataPoint {
        range: number[];
        selectionIds: SelectionId[];
    }
    interface HistogramDataView {
        data: HistogramData[];
        xScale?: D3.Scale.LinearScale;
        yScale?: D3.Scale.LinearScale;
        settings: HistogramSettings;
        formatter: IValueFormatter;
        xLabelFormatter?: IValueFormatter;
        yLabelFormatter?: IValueFormatter;
    }
    class HistogramChartWarning implements IVisualWarning {
        static ErrorInvalidDataValues: string;
        private message;
        constructor(message: string);
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
    class Histogram implements IVisual {
        private static ClassName;
        private static FrequencyText;
        private static DensityText;
        private static Properties;
        private static DefaultHistogramSettings;
        private static Axes;
        private static Axis;
        private static Labels;
        private static Columns;
        private static Column;
        private static Legends;
        private static Legend;
        private static MinNumberOfBins;
        private static MaxNumberOfBins;
        private static MinPrecision;
        private static MaxPrecision;
        private static AdditionalWidthOfLabel;
        private static LegendSizeWhenTitleIsActive;
        private static LegendSizeWhenTitleIsNotActive;
        private static InnerPaddingRatio;
        static capabilities: VisualCapabilities;
        private ColumnPadding;
        private MinColumnHeight;
        private MinOpacity;
        private MaxOpacity;
        private TooltipDisplayName;
        private SeparatorNumbers;
        private LegendSize;
        private YLegendSize;
        private XLegendSize;
        private AxisSize;
        private DataLabelMargin;
        private widthOfColumn;
        private yTitleMargin;
        private outerPadding;
        private xAxisProperties;
        private yAxisProperties;
        private ExcludeBrackets;
        private IncludeBrackets;
        private margin;
        private durationAnimations;
        private viewport;
        private hostService;
        private selectionManager;
        private colors;
        private root;
        private svg;
        private main;
        private axes;
        private axisX;
        private axisY;
        private legend;
        private columns;
        private labels;
        private histogramDataView;
        private animator;
        private columnsSelection;
        private textProperties;
        constructor(histogramConstructorOptions?: HistogramConstructorOptions);
        init(visualsOptions: VisualInitOptions): void;
        converter(dataView: DataView): HistogramDataView;
        private static getValuesByFrequencies(sourceValues, frequencies, identities);
        private getData(values, numericalValues, data, settings, yValueFormatter, xValueFormatter);
        private static getRange(minValue, maxValue, step, index);
        private getTooltipData(value, range, settings, includeLeftBorder, yValueFormatter, xValueFormatter);
        private static getSelectionIds(values, bin, index);
        private static isValueContainedInRange(value, bin, index);
        private parseSettings(dataView);
        private static getLegend(title, style, displayUnit);
        private static getLabelFontSize(objects);
        private static getLabelShow(objects);
        private static getLabelColor(objects);
        private static getLabelDisplayUnits(objects);
        private static getLabelPrecision(objects);
        private static getXStyle(objects);
        private static getXDisplayUnit(objects);
        private static getXPrecision(objects);
        private static getXAxisShow(objects);
        private static getXAxisColor(objects);
        private static getXTitle(objects);
        private static getYStyle(objects);
        private static getYPosition(objects);
        private static getYAxisShow(objects);
        private static getYAxisColor(objects);
        private static getYStart(objects);
        private static getYEnd(objects);
        private static getYDisplayUnit(objects);
        private static getYPrecision(objects);
        private static getYTitle(objects);
        private static getBins(objects);
        private static getFrequency(objects);
        private static getPrecision(objects);
        validateData(data: HistogramDataView): boolean;
        update(visualUpdateOptions: VisualUpdateOptions): void;
        private getLegendSize(axisSettings);
        private getWidthOfLabel();
        private setSize(viewport);
        private updateElements(height, width);
        shouldShowYOnRight(): boolean;
        private columsAndAxesTransform(labelWidth);
        private render();
        private adjustTransformToAxisLabels();
        private renderColumns();
        private static renderTooltip(selection);
        private getColumnHeight(column, y);
        private renderAxes();
        private getLabaelLayout();
        private renderLabels();
        private static rangesToArray(data);
        private rangeToString(range, includeLeftBorder, valueFormatter);
        private renderLegend();
        private getDataLegends(settings);
        private static getLegendText(settings);
        private bindSelectionHandler(columnsSelection);
        private setSelection(columnsSelection, data?);
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        private static getObjectsFromDataView(dataView);
        destroy(): void;
        private calculateXAxes(source, textProperties, widthOfLabel, scrollbarVisible);
        private calculateXAxesProperties(options, metaDataColumn, innerPaddingRatio, minOrdinalRectThickness);
        private calculateYAxes(source, textProperties, widthOfLabel, scrollbarVisible);
        private calculateYAxesProperties(options, metaDataColumn, innerPaddingRatio, minOrdinalRectThickness);
    }
    /**
     * HistogramAxisHelper based on AxisHelper (Visuals/common/axisHelper.ts).
     */
    module HistogramAxisHelper {
        import BaseCreateAxisOptions = powerbi.visuals.CreateAxisOptions;
        /**
         * Default ranges are for when we have a field chosen for the axis,
         * but no values are returned by the query.
         */
        var emptyDomain: number[];
        interface CreateScaleResult {
            scale: D3.Scale.GenericScale<any>;
            bestTickCount: number;
            usingDefaultDomain?: boolean;
        }
        interface CreateAxisOptions extends BaseCreateAxisOptions {
            innerPaddingRatio: number;
            tickLabelPadding: number;
            minOrdinalRectThickness: number;
            maxTickCount?: number;
        }
        /**
         * Create a D3 axis including scale. Can be vertical or horizontal, and either datetime, numeric, or text.
         * @param options The properties used to create the axis.
         */
        function createAxis(options: CreateAxisOptions): IAxisProperties;
        /**
         * Indicates whether the number is power of 10.
         */
        function powerOfTen(d: any): boolean;
        function createFormatter(scaleDomain: any[], dataDomain: any[], dataType: any, isScalar: boolean, formatString: string, bestTickCount: number, tickValues: any[], getValueFn: any, useTickIntervalForDisplayUnits?: boolean, axisDisplayUnits?: number, axisPrecision?: number): IValueFormatter;
        function getMinTickValueInterval(formatString: string, columnType: ValueType, is100Pct?: boolean): number;
        function isLogScalePossible(domain: any[], axisType?: ValueType): boolean;
        function isDateTime(type: ValueTypeDescriptor): boolean;
        function getRecommendedTickValues(maxTicks: number, scale: D3.Scale.GenericScale<any>, axisType: ValueType, isScalar: boolean, minTickInterval?: number): any[];
        function getRecommendedTickValuesForAnOrdinalRange(maxTicks: number, labels: string[]): string[];
        function getRecommendedTickValuesForAQuantitativeRange(maxTicks: number, scale: D3.Scale.GenericScale<any>, minInterval?: number): number[];
        function isOrdinalScale(scale: any): boolean;
        /**
         * Gets the ValueType of a category column, defaults to Text if the type is not present.
         */
        function getCategoryValueType(metadataColumn: DataViewMetadataColumn, isScalar?: boolean): ValueType;
        function columnDataTypeHasValue(dataType: ValueTypeDescriptor): boolean;
        function createScale(options: CreateAxisOptions): CreateScaleResult;
        function normalizeInfinityInScale(scale: D3.Scale.GenericScale<any>): void;
        function createOrdinalScale(pixelSpan: number, dataDomain: any[], innerPaddingRatio: number, outerPaddingRatio: number): D3.Scale.OrdinalScale;
        function createNumericalScale(axisScaleType: string, pixelSpan: number, dataDomain: any[], dataType: ValueType, outerPadding?: number, niceCount?: number, shouldClamp?: boolean): D3.Scale.GenericScale<any>;
        function createLinearScale(pixelSpan: number, dataDomain: any[], outerPadding?: number, niceCount?: number, shouldClamp?: boolean): D3.Scale.LinearScale;
        function getRecommendedNumberOfTicksForXAxis(availableWidth: number): number;
        function getRecommendedNumberOfTicksForYAxis(availableWidth: number): number;
        function isOrdinal(type: ValueTypeDescriptor): boolean;
        /**
         * Get the best number of ticks based on minimum value, maximum value,
         * measure metadata and max tick count.
         *
         * @param min The minimum of the data domain.
         * @param max The maximum of the data domain.
         * @param valuesMetadata The measure metadata array.
         * @param maxTickCount The max count of intervals.
         * @param isDateTime - flag to show single tick when min is equal to max.
         */
        function getBestNumberOfTicks(min: number, max: number, valuesMetadata: DataViewMetadataColumn[], maxTickCount: number, isDateTime?: boolean): number;
        function ensureValuesInRange(values: number[], min: number, max: number): number[];
        function hasNonIntegerData(valuesMetadata: DataViewMetadataColumn[]): boolean;
    }
}

declare module powerbi.visuals.samples {
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import IEnumType = powerbi.IEnumType;
    import SelectionId = powerbi.visuals.SelectionId;
    import IGenericAnimator = powerbi.visuals.IGenericAnimator;
    import IMargin = powerbi.visuals.IMargin;
    import TooltipDataItem = powerbi.visuals.TooltipDataItem;
    import VisualDataLabelsSettings = powerbi.visuals.VisualDataLabelsSettings;
    import IValueFormatter = powerbi.visuals.IValueFormatter;
    import Fill = powerbi.Fill;
    import SelectableDataPoint = powerbi.visuals.SelectableDataPoint;
    import IVisual = powerbi.IVisual;
    import IViewport = powerbi.IViewport;
    import VisualCapabilities = powerbi.VisualCapabilities;
    import IInteractiveBehavior = powerbi.visuals.IInteractiveBehavior;
    import IDataColorPalette = powerbi.IDataColorPalette;
    import IInteractivityService = powerbi.visuals.IInteractivityService;
    import DataView = powerbi.DataView;
    import DataViewObjects = powerbi.DataViewObjects;
    import VisualInitOptions = powerbi.VisualInitOptions;
    import VisualUpdateOptions = powerbi.VisualUpdateOptions;
    import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
    import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
    import NumberRange = powerbi.NumberRange;
    import ISelectionHandler = powerbi.visuals.ISelectionHandler;
    module DotPlotLabelsOrientation {
        enum Orientation {
            Horizontal = 0,
            Vertical = 1,
        }
        var type: IEnumType;
    }
    var DotPlotProperties: any;
    interface DotPlotCalculateScaleAndDomainOptions {
        viewport: IViewport;
        margin: IMargin;
        showCategoryAxisLabel: boolean;
        showValueAxisLabel: boolean;
        forceMerge: boolean;
        categoryAxisScaleType: string;
        valueAxisScaleType: string;
        trimOrdinalDataOnOverflow: boolean;
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
    interface DotPlotSelectors {
        svgPlotSelector: ClassAndSelector;
        plotSelector: ClassAndSelector;
        plotGroupSelector: ClassAndSelector;
        axisSelector: ClassAndSelector;
        xAxisSelector: ClassAndSelector;
        circleSeletor: ClassAndSelector;
    }
    interface DotPlotChartCategory {
        value: string;
        selectionId: SelectionId;
        textWidth: number;
    }
    interface DotPlotConstructorOptions {
        animator?: IGenericAnimator;
        svg?: D3.Selection;
        margin?: IMargin;
        radius?: number;
        strokeWidth?: number;
    }
    interface DotPlotDataPoint {
        x: number;
        y: number;
        tooltipInfo: TooltipDataItem[];
    }
    interface DotPlotSettings {
        labelSettings?: VisualDataLabelsSettings;
        formatter?: IValueFormatter;
        tooltipFormatter?: IValueFormatter;
        categorySettings?: DotPlotCategorySettings;
        defaultDataPointColor?: string;
        categoryAxisSettings?: DotPlotCategoryAxisSettings;
        labelOrientation?: DotPlotLabelsOrientation.Orientation;
        labelTextMaxSize: number;
        xAxisLabelTexMaxSize: number;
    }
    interface DotPlotCategoryAxisSettings {
        show?: boolean;
        showAxisTitle?: boolean;
        labelColor?: Fill;
    }
    interface DotPlotCategorySettings {
        show?: boolean;
        fontColor?: string;
        fontSize?: number;
    }
    interface DotPlotDataGroup extends SelectableDataPoint {
        label?: string;
        value?: number;
        color?: string;
        tooltipInfo?: TooltipDataItem[];
        dataPoints: DotPlotDataPoint[];
        labelFontSize: string;
        highlight?: boolean;
    }
    interface DotPlotDataView {
        displayName: string;
        dataPoints: DotPlotDataGroup[];
        values: any[];
        settings: DotPlotSettings;
        categories: DotPlotChartCategory[];
    }
    class DotPlot implements IVisual {
        private viewportIn;
        static capabilities: VisualCapabilities;
        private DefaultMargin;
        private svg;
        private xAxis;
        private dotPlot;
        private clearCatcher;
        private behavior;
        private colors;
        private dataView;
        private animator;
        private durationAnimations;
        private dotPlotDataView;
        private radius;
        private strokeWidth;
        private interactivityService;
        private scaleType;
        private textProperties;
        private dotPlotSelectors;
        private DefaultDotPlotSettings;
        private static getTooltipData(value);
        static converter(dataView: DataView, objects: DataViewObjects, scale: D3.Scale.OrdinalScale, defaultMargin: IMargin, defaultSetting: DotPlotSettings, colors: IDataColorPalette, viewport: IViewport, radius: number): DotPlotDataView;
        constructor(options?: DotPlotConstructorOptions);
        init(options: VisualInitOptions): void;
        update(options: VisualUpdateOptions): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        private enumerateCategoryAxisValues(enumeration, dataView);
        private static getObjectsFromDataView(dataView);
        private static parseSettings(objects, defaultDotPlotSettings);
        private static parseCategoryAxisSettings(objects, defaultDotPlotSettings);
        private static getCategorySettings(objects, defaultDotPlotSettings);
        private static getPrecision(objects, defaultDotPlotSettings);
        private drawDotPlot(data, setting);
        private getEnhanchedDotplotLayout(labelSettings, viewport);
        private enumerateDataLabels(enumeration, dataView);
        private enumerateDataPoints(enumeration, dataView);
        private enumerateCategories(enumeration, dataView);
        private clearData();
        private renderTooltip(selection);
        private calculateAxes(viewportIn, categoryAxisSettings, textProperties, objects, scrollbarVisible);
        private calculateAxesProperties(viewportIn, categoryAxisSettings, options, metaDataColumn, objects);
        private renderAxis(height, viewportIn, xAxisProperties, categoryAxisSettings, data, duration);
        private static setAxisLabelColor(g, fill);
    }
    interface DotplotBehaviorOptions {
        columns: D3.Selection;
        clearCatcher: D3.Selection;
        interactivityService: IInteractivityService;
    }
    class DotplotBehavior implements IInteractiveBehavior {
        private columns;
        private clearCatcher;
        private interactivityService;
        bindEvents(options: DotplotBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
    }
    module dotPlotUtils {
        var DimmedOpacity: number;
        var DefaultOpacity: number;
        function getFillOpacity(selected: boolean, highlight: boolean, hasSelection: boolean, hasPartialHighlights: boolean): number;
    }
}

declare module powerbi.visuals.samples {
    enum LinkColorType {
        ByWeight,
        ByLinkType,
        Interactive,
    }
    class ForceGraphSettings {
        static Default: ForceGraphSettings;
        static parse(dataView: DataView, capabilities: VisualCapabilities): ForceGraphSettings;
        static getProperties(capabilities: VisualCapabilities): {
            [i: string]: {
                [i: string]: DataViewObjectPropertyIdentifier;
            };
        };
        static createEnumTypeFromEnum(type: any): IEnumType;
        private static getValueFnByType(type);
        static enumerateObjectInstances(settings: any, options: EnumerateVisualObjectInstancesOptions, capabilities: VisualCapabilities): VisualObjectInstanceEnumeration;
        labels: {
            show: boolean;
            color: string;
            fontSize: number;
        };
        links: {
            showArrow: boolean;
            showLabel: boolean;
            colorLink: LinkColorType;
            thickenLink: boolean;
            displayUnits: number;
            decimalPlaces: number;
        };
        nodes: {
            displayImage: boolean;
            defaultImage: string;
            imageUrl: string;
            imageExt: string;
            nameMaxLength: number;
            highlightReachableLinks: boolean;
        };
        size: {
            charge: number;
        };
    }
    class ForceGraphColumns<T> {
        static Roles: ForceGraphColumns<string>;
        static getMetadataColumns(dataView: DataView): ForceGraphColumns<DataViewMetadataColumn>;
        static getTableValues(dataView: DataView): ForceGraphColumns<any[]>;
        static getTableRows(dataView: DataView): ForceGraphColumns<any>[];
        Source: T;
        Target: T;
        Weight: T;
        LinkType: T;
        SourceType: T;
        TargetType: T;
    }
    interface ForceGraphLink {
        source: ForceGraphNode;
        target: ForceGraphNode;
        weight: number;
        formattedWeight: string;
        type: string;
        tooltipInfo: TooltipDataItem[];
    }
    interface ForceGraphNode {
        name: string;
        image: string;
        adj: {
            [i: string]: number;
        };
        x?: number;
        y?: number;
        isDrag?: boolean;
        isOver?: boolean;
    }
    interface ForceGraphNodes {
        [i: string]: ForceGraphNode;
    }
    interface ForceGraphData {
        nodes: ForceGraphNodes;
        links: ForceGraphLink[];
        minFiles: number;
        maxFiles: number;
        linkedByName: {};
        linkTypes: {};
        settings: ForceGraphSettings;
    }
    class ForceGraph implements IVisual {
        static VisualClassName: string;
        private static Count;
        private static DefaultValues;
        private static Href;
        private data;
        private settings;
        private root;
        private paths;
        private nodes;
        private forceLayout;
        private dataView;
        private colors;
        private uniqieId;
        private marginValue;
        private margin;
        private viewportValue;
        private viewport;
        private viewportInValue;
        private viewportIn;
        private static substractMargin(viewport, margin);
        private scale1to10(d);
        private getLinkColor(d);
        static capabilities: VisualCapabilities;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        static converter(dataView: DataView, colors: IDataColorPalette): ForceGraphData;
        private static parseSettings(dataView);
        init(options: VisualInitOptions): void;
        update(options: VisualUpdateOptions): void;
        private updateNodes();
        private tick();
        private fadePath(opacity, highlight);
        private isReachable(a, b);
        private fadeNode(node);
        destroy(): void;
    }
}

declare module powerbi.visuals.samples {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    import SelectableDataPoint = powerbi.visuals.SelectableDataPoint;
    import TooltipDataItem = powerbi.visuals.TooltipDataItem;
    import IValueFormatter = powerbi.visuals.IValueFormatter;
    import LegendData = powerbi.visuals.LegendData;
    import IVisual = powerbi.IVisual;
    import IViewport = powerbi.IViewport;
    import IDataColorPalette = powerbi.IDataColorPalette;
    import VisualCapabilities = powerbi.VisualCapabilities;
    import IMargin = powerbi.visuals.IMargin;
    import IInteractivityService = powerbi.visuals.IInteractivityService;
    import VisualInitOptions = powerbi.VisualInitOptions;
    import DataView = powerbi.DataView;
    import VisualUpdateOptions = powerbi.VisualUpdateOptions;
    import NumberRange = powerbi.NumberRange;
    import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
    import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
    import IInteractiveBehavior = powerbi.visuals.IInteractiveBehavior;
    import ISelectionHandler = powerbi.visuals.ISelectionHandler;
    import IVisualWarning = powerbi.IVisualWarning;
    import IVisualErrorMessage = powerbi.IVisualErrorMessage;
    enum GanttDateType {
        Day,
        Week,
        Month,
        Year,
    }
    interface Task extends SelectableDataPoint {
        id: number;
        name: string;
        start: Date;
        duration: number;
        completion: number;
        resource: string;
        end: Date;
        taskType: string;
        description: string;
        color: string;
        tooltipInfo: TooltipDataItem[];
    }
    interface GroupedTask {
        id: number;
        name: string;
        tasks: Task[];
    }
    interface GanttChartFormatters {
        startDateFormatter: IValueFormatter;
        completionFormatter: IValueFormatter;
        durationFormatter: IValueFormatter;
    }
    interface GanttViewModel {
        dataView: DataView;
        settings: GanttSettings<any>;
        tasks: Task[];
        series: GanttSeries[];
        legendData: LegendData;
        taskTypes: TaskTypes;
    }
    interface GanttDataPoint extends SelectableDataPoint {
        color: string;
        value: any;
    }
    interface GanttSeries extends SelectableDataPoint {
        tasks: Task[];
        fill: string;
        name: string;
    }
    interface TaskTypes {
        types: string[];
        typeName: string;
    }
    interface GanttCalculateScaleAndDomainOptions {
        viewport: IViewport;
        margin: IMargin;
        showCategoryAxisLabel: boolean;
        showValueAxisLabel: boolean;
        forceMerge: boolean;
        categoryAxisScaleType: string;
        valueAxisScaleType: string;
        trimOrdinalDataOnOverflow: boolean;
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
    interface GanttSettings<T> {
        general: {
            groupTasks: T;
        };
        legend: {
            show: T;
            position: T;
            showTitle: T;
            titleText: T;
            labelColor: T;
            fontSize: T;
        };
        taskLabels: {
            show: T;
            fill: T;
            fontSize: T;
            width: T;
        };
        taskCompletion: {
            show: T;
            fill: T;
        };
        taskResource: {
            show: T;
            fill: T;
            fontSize: T;
        };
        dateType: {
            type: T;
        };
    }
    class Gantt implements IVisual {
        private viewport;
        private colors;
        private legend;
        private textProperties;
        static DefaultSettings: GanttSettings<any>;
        static DefaultValues: {
            AxisTickSize: number;
            MaxTaskOpacity: number;
            MinTaskOpacity: number;
            ProgressBarHeight: number;
            ResourceWidth: number;
            TaskColor: string;
            TaskLineWidth: number;
            DefaultDateType: string;
            DateFormatStrings: {
                Day: string;
                Week: string;
                Month: string;
                Year: string;
            };
        };
        static capabilities: VisualCapabilities;
        private static Properties;
        private static getProperties(capabilities);
        private static DefaultMargin;
        private margin;
        private style;
        private body;
        private ganttSvg;
        private viewModel;
        private timeScale;
        private axisGroup;
        private chartGroup;
        private taskGroup;
        private lineGroup;
        private clearCatcher;
        private ganttDiv;
        private selectionManager;
        private behavior;
        private interactivityService;
        private hostServices;
        private isInteractiveChart;
        init(options: VisualInitOptions): void;
        /**
         * Create the vieport area of the gantt chart
         */
        private createViewport(element);
        /**
         * Clear the viewport area
         */
        private clearViewport();
        /**
         * Update div container size to the whole viewport area
         * @param viewport The vieport to change it size
         */
        private updateChartSize();
        /**
         * Get task property from the data view
         * @param columnSource
         * @param child
         * @param propertyName The property to get
         */
        private static getTaskProperty<T>(columnSource, child, propertyName);
        /**
         * Check if dataView has a given role
         * @param column The dataView headers
         * @param name The role to find
         */
        private static hasRole(column, name);
        /**
        * Get the tooltip info (data display names & formated values)
        * @param task All task attributes.
        * @param formatters Formatting options for gantt attributes.
        */
        private static getTooltipInfo(task, formatters, timeInterval?);
        /**
        * Check if task has data for task
        * @param dataView
        */
        private static isChartHasTask(dataView);
        /**
         * Returns the chart formatters
         * @param dataView The data Model
         */
        private static getFormatters(dataView);
        /**
        * Create task objects dataView
        * @param dataView The data Model.
        * @param formatters task attributes represented format.
        * @param series An array that holds the color data of different task groups.
        */
        private static createTasks(dataView, formatters, colors);
        /**
       * Create the gantt tasks series based on all task types
       * @param taskTypes All unique types from the tasks array.
       */
        private static createSeries(objects, tasks, dataView, colors);
        /**
        * Convert the dataView to view model
        * @param dataView The data Model
        */
        static converter(dataView: DataView, colors: IDataColorPalette): GanttViewModel;
        private static parseSettings(dataView, colors);
        private static isValidDate(date);
        private static convertToDecimal(number);
        /**
        * Gets all unique types from the tasks array
        * @param dataView The data model.
        */
        private static getAllTasksTypes(dataView);
        /**
         * Get legend data, calculate position and draw it
         */
        private renderLegend();
        /**
        * Called on data change or resizing
        * @param options The visual option that contains the dataview and the viewport
        */
        update(options: VisualUpdateOptions): void;
        private getDateType();
        private calculateAxes(viewportIn, textProperties, startDate, endDate, axisLength, ticksCount, scrollbarVisible);
        private calculateAxesProperties(viewportIn, options, axisLength, metaDataColumn);
        private groupTasks(tasks);
        private renderAxis(xAxisProperties, duration);
        /**
        * Update task labels and add its tooltips
        * @param tasks All tasks array
        * @param width The task label width
        */
        private updateTaskLabels(tasks, width);
        private renderTasks(groupedTasks);
        onClearSelection(): void;
        /**
         * Returns the matching Y coordinate for a given task index
         * @param taskIndex Task Number
         */
        private getTaskLabelCoordinateY(taskIndex);
        /**
         * Set the task progress bar in the gantt
         * @param task All task attributes
         */
        private setTaskProgress(task);
        /**
         * Set the task progress bar in the gantt
         * @param lineNumber Line number that represents the task number
         */
        private getBarYCoordinate(lineNumber);
        private getBarHeight();
        /**
        * convert task duration to width in the time scale
        * @param task The task to convert
        */
        private taskDurationToWidth(task);
        private getTooltipForMilstoneLine(timestamp, milestoneTitle);
        /**
        * Create vertical dotted line that represent milestone in the time axis (by default it shows not time)
        * @param tasks All tasks array
        * @param timestamp the milestone to be shown in the time axis (default Date.now())
        */
        private createMilestoneLine(tasks, milestoneTitle?, timestamp?);
        private updateElementsPositions(viewport, margin);
        private getMilestoneLineLength(numOfTasks);
        private enumerateGeneral(settings);
        private enumerateLegend(settings);
        private enumerateDataPoints(settings);
        private enumerateTaskCompletion(settings);
        private enumerateTaskLabels(settings);
        private enumerateTaskResources(settings);
        private enumerateDateType(settings);
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
    }
    interface GanttBehaviorOptions {
        clearCatcher: D3.Selection;
        taskSelection: D3.Selection;
        legendSelection: D3.Selection;
        interactivityService: IInteractivityService;
    }
    class GanttChartBehavior implements IInteractiveBehavior {
        private options;
        bindEvents(options: GanttBehaviorOptions, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
    }
    class GanttChartWarning implements IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
}

declare module powerbi.visuals.samples {
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    const Months: IEnumType;
    const WeekDays: IEnumType;
    enum GranularityType {
        year = 0,
        quarter = 1,
        month = 2,
        week = 3,
        day = 4,
    }
    interface GranularityName {
        granularityType: GranularityType;
        name: string;
    }
    interface TimelineMargins {
        LeftMargin: number;
        RightMargin: number;
        TopMargin: number;
        BottomMargin: number;
        CellWidth: number;
        CellHeight: number;
        StartXpoint: number;
        StartYpoint: number;
        ElementWidth: number;
        MinCellWidth: number;
        MaxCellHeight: number;
        PeriodSlicerRectWidth: number;
        PeriodSlicerRectHeight: number;
    }
    interface DefaultTimelineProperties {
        DefaultLabelsShow: boolean;
        TimelineDefaultTextSize: number;
        TimelineDefaultCellColor: string;
        TimelineDefaultCellColorOut: string;
        TimelineDefaultTimeRangeShow: boolean;
        DefaultTimeRangeColor: string;
        DefaultLabelColor: string;
        DefaultScaleColor: string;
        DefaultSliderColor: string;
        DefaultGranularity: GranularityType;
        DefaultFirstMonth: number;
        DefaultFirstDay: number;
        DefaultFirstWeekDay: number;
    }
    interface TimelineSelectors {
        TimelineVisual: ClassAndSelector;
        SelectionRangeContainer: ClassAndSelector;
        textLabel: ClassAndSelector;
        LowerTextCell: ClassAndSelector;
        UpperTextCell: ClassAndSelector;
        UpperTextArea: ClassAndSelector;
        LowerTextArea: ClassAndSelector;
        RangeTextArea: ClassAndSelector;
        CellsArea: ClassAndSelector;
        CursorsArea: ClassAndSelector;
        MainArea: ClassAndSelector;
        SelectionCursor: ClassAndSelector;
        Cell: ClassAndSelector;
        CellRect: ClassAndSelector;
        VertLine: ClassAndSelector;
        TimelineSlicer: ClassAndSelector;
        PeriodSlicerGranularities: ClassAndSelector;
        PeriodSlicerSelection: ClassAndSelector;
        PeriodSlicerSelectionRect: ClassAndSelector;
        PeriodSlicerRect: ClassAndSelector;
    }
    interface TimelineLabel {
        title: string;
        text: string;
        id: number;
    }
    interface ExtendedLabel {
        yearLabels?: TimelineLabel[];
        quarterLabels?: TimelineLabel[];
        monthLabels?: TimelineLabel[];
        weekLabels?: TimelineLabel[];
        dayLabels?: TimelineLabel[];
    }
    interface DatePeriod {
        identifierArray: (string | number)[];
        startDate: Date;
        endDate: Date;
        year: number;
        week: number[];
        fraction: number;
        index: number;
    }
    interface Granularity {
        getType(): GranularityType;
        splitDate(date: Date): (string | number)[];
        getDatePeriods(): DatePeriod[];
        resetDatePeriods(): void;
        getExtendedLabel(): ExtendedLabel;
        setExtendedLabel(extendedLabel: ExtendedLabel): void;
        createLabels(granularity: Granularity): TimelineLabel[];
        sameLabel(firstDatePeriod: DatePeriod, secondDatePeriod: DatePeriod): boolean;
        generateLabel(datePeriod: DatePeriod): TimelineLabel;
        addDate(date: Date, identifierArray: (string | number)[]): any;
        setNewEndDate(date: Date): void;
        splitPeriod(index: number, newFraction: number, newDate: Date): void;
    }
    interface TimelineCursorOverElement {
        index: number;
        datapoint: TimelineDatapoint;
    }
    class TimelineGranularity {
        private datePeriods;
        private extendedLabel;
        /**
        * Returns the short month name of the given date (e.g. Jan, Feb, Mar)
        */
        shortMonthName(date: Date): string;
        resetDatePeriods(): void;
        getDatePeriods(): DatePeriod[];
        getExtendedLabel(): ExtendedLabel;
        setExtendedLabel(extendedLabel: ExtendedLabel): void;
        createLabels(granularity: Granularity): TimelineLabel[];
        /**
        * Adds the new date into the given datePeriods array
        * If the date corresponds to the last date period, given the current granularity,
        * it will be added to that date period. Otherwise, a new date period will be added to the array.
        * i.e. using Month granularity, Feb 2 2015 corresponds to Feb 3 2015.
        * It is assumed that the given date does not correspond to previous date periods, other than the last date period
        */
        addDate(date: Date, identifierArray: (string | number)[]): void;
        setNewEndDate(date: Date): void;
        /**
         * Splits a given period into two periods.
         * The new period is added after the index of the old one, while the old one is simply updated.
         * @param index The index of the date priod to be split
         * @param newFraction The fraction value of the new date period
         * @param newDate The date in which the date period is split
         */
        splitPeriod(index: number, newFraction: number, newDate: Date): void;
        private previousMonth(month);
        private nextMonth(month);
        private countWeeks(startDate, endDate);
        determineWeek(date: Date): number[];
        private inPreviousYear(date);
        determineYear(date: Date): number;
    }
    class DayGranularity extends TimelineGranularity implements Granularity {
        getType(): GranularityType;
        splitDate(date: Date): (string | number)[];
        sameLabel(firstDatePeriod: DatePeriod, secondDatePeriod: DatePeriod): boolean;
        generateLabel(datePeriod: DatePeriod): TimelineLabel;
    }
    class MonthGranularity extends TimelineGranularity implements Granularity {
        getType(): GranularityType;
        splitDate(date: Date): (string | number)[];
        sameLabel(firstDatePeriod: DatePeriod, secondDatePeriod: DatePeriod): boolean;
        generateLabel(datePeriod: DatePeriod): TimelineLabel;
    }
    class WeekGranularity extends TimelineGranularity implements Granularity {
        getType(): GranularityType;
        splitDate(date: Date): (string | number)[];
        sameLabel(firstDatePeriod: DatePeriod, secondDatePeriod: DatePeriod): boolean;
        generateLabel(datePeriod: DatePeriod): TimelineLabel;
    }
    class QuarterGranularity extends TimelineGranularity implements Granularity {
        /**
         * Returns the date's quarter name (e.g. Q1, Q2, Q3, Q4)
         * @param date A date
         */
        private quarterText(date);
        getType(): GranularityType;
        splitDate(date: Date): (string | number)[];
        sameLabel(firstDatePeriod: DatePeriod, secondDatePeriod: DatePeriod): boolean;
        generateLabel(datePeriod: DatePeriod): TimelineLabel;
    }
    class YearGranularity extends TimelineGranularity implements Granularity {
        getType(): GranularityType;
        splitDate(date: Date): (string | number)[];
        sameLabel(firstDatePeriod: DatePeriod, secondDatePeriod: DatePeriod): boolean;
        generateLabel(datePeriod: DatePeriod): TimelineLabel;
    }
    class TimelineGranularityData {
        private dates;
        private granularities;
        private endingDate;
        /**
         * Returns the date of the previos day
         * @param date The following date
         */
        static previousDay(date: Date): Date;
        /**
         * Returns the date of the next day
         * @param date The previous date
         */
        static nextDay(date: Date): Date;
        /**
        * Returns an array of dates with all the days between the start date and the end date
        */
        private setDatesRange(startDate, endDate);
        constructor(startDate: Date, endDate: Date);
        /**
         * Adds a new granularity to the array of granularities.
         * Resets the new granularity, adds all dates to it, and then edits the last date period with the ending date.
         * @param granularity The new granularity to be added
         */
        addGranularity(granularity: Granularity): void;
        /**
         * Returns a specific granularity from the array of granularities
         * @param index The index of the requested granularity
         */
        getGranularity(index: number): Granularity;
        createGranularities(): void;
        createLabels(): void;
    }
    class Utils {
        /**
         * Returns the date of the start of the selection
         * @param timelineData The TimelineData which contains all the date periods
         */
        static getStartSelectionDate(timelineData: TimelineData): Date;
        /**
         * Returns the date of the end of the selection
         * @param timelineData The TimelineData which contains all the date periods
         */
        static getEndSelectionDate(timelineData: TimelineData): Date;
        /**
         * Returns the date period of the end of the selection
         * @param timelineData The TimelineData which contains all the date periods
         */
        static getEndSelectionPeriod(timelineData: TimelineData): DatePeriod;
        /**
         * Returns the color of a cell, depending on whether its date period is between the selected date periods.
         * CellRects should be transparent filled by default if there isn't any color sets.
         * @param d The TimelineDataPoint of the cell
         * @param timelineData The TimelineData with the selected date periods
         * @param timelineFormat The TimelineFormat with the chosen colors
         */
        static getCellColor(d: TimelineDatapoint, timelineData: TimelineData, cellFormat: CellFormat): string;
        /**
         * Returns the granularity type of the given granularity name
         * @param granularityName The name of the granularity
         */
        static getGranularityType(granularityName: string): GranularityType;
        /**
         * Returns the name of the granularity type
         * @param granularity The type of granularity
         */
        static getGranularityName(granularity: GranularityType): string;
        /**
         * Splits the date periods of the current granularity, in case the stard and end of the selection is in between a date period.
         * i.e. for a quarter granularity and a selection between Feb 6 and Dec 23, the date periods for Q1 and Q4 will be split accordingly
         * @param timelineData The TimelineData that contains the date periods
         * @param startDate The starting date of the selection
         * @param endDate The ending date of the selection
         */
        static separateSelection(timelineData: TimelineData, startDate: Date, endDate: Date): void;
        /**
         * Returns the ratio of the given date compared to the whole date period.
         * The ratio is calculated either from the start or the end of the date period.
         * i.e. the ratio of Feb 7 2016 compared to the month of Feb 2016,
         * is 0.2142 from the start of the month, or 0.7857 from the end of the month.
         * @param datePeriod The date period that contain the specified date
         * @param date The date
         * @param fromStart Whether to calculater the ratio from the start of the date period.
         */
        static getDateRatio(datePeriod: DatePeriod, date: Date, fromStart: boolean): number;
        /**
        * Returns the time range text, depending on the given granularity (e.g. "Feb 3 2014 - Apr 5 2015", "Q1 2014 - Q2 2015")
        */
        static timeRangeText(timelineData: TimelineData): string;
        static dateRangeText(datePeriod: DatePeriod): string;
        /**
         * Combines the first two partial date periods, into a single date period.
         * Returns whether a partial date period was found.
         * i.e. combines "Feb 1 2016 - Feb 5 2016" with "Feb 5 2016 - Feb 29 2016" into "Feb 1 2016 - Feb 29 2016"
         * @param datePeriods The list of date periods
         */
        static unseparateSelection(datePeriods: DatePeriod[]): boolean;
    }
    interface TimelineProperties {
        leftMargin: number;
        rightMargin: number;
        topMargin: number;
        bottomMargin: number;
        textYPosition: number;
        startXpoint: number;
        startYpoint: number;
        elementWidth: number;
        element: any;
        cellWidth: number;
        cellHeight: number;
        cellsYPosition: number;
    }
    interface TimelineFormat {
        cellFormat?: CellFormat;
        rangeTextFormat?: LabelFormat;
        labelFormat?: LabelFormat;
        calendarFormat?: CalendarFormat;
        granularityFormat?: GranularityFormat;
    }
    interface LabelFormat {
        showProperty: boolean;
        sizeProperty: number;
        colorProperty: string;
    }
    interface CalendarFormat {
        firstMonthProperty: number;
        firstDayProperty: number;
        weekDayProperty: number;
    }
    interface CellFormat {
        colorInProperty: string;
        colorOutProperty: string;
    }
    interface GranularityFormat {
        scaleColorProperty: string;
        sliderColorProperty: string;
    }
    interface TimelineData {
        dragging?: boolean;
        categorySourceName?: string;
        columnIdentity?: powerbi.data.SQColumnRefExpr;
        timelineDatapoints?: TimelineDatapoint[];
        elementsCount?: number;
        selectionStartIndex?: number;
        selectionEndIndex?: number;
        cursorDataPoints?: CursorDatapoint[];
        currentGranularity?: Granularity;
    }
    interface CursorDatapoint {
        x: number;
        cursorIndex: number;
        selectionIndex: number;
    }
    interface TimelineDatapoint {
        index: number;
        datePeriod: DatePeriod;
    }
    interface DateDictionary {
        [year: number]: Date;
    }
    class Calendar {
        private firstDayOfWeek;
        private firstMonthOfYear;
        private firstDayOfYear;
        private dateOfFirstWeek;
        private quarterFirstMonths;
        getFirstDayOfWeek(): number;
        getFirstMonthOfYear(): number;
        getFirstDayOfYear(): number;
        getQuarterStartDate(year: number, quarterIndex: number): Date;
        isChanged(calendarFormat: CalendarFormat): boolean;
        constructor(calendarFormat: CalendarFormat);
        private calculateDateOfFirstWeek(year);
        getDateOfFirstWeek(year: number): Date;
    }
    class Timeline implements IVisual {
        private requiresNoUpdate;
        private datasetsChangedState;
        private timelineProperties;
        private timelineFormat;
        private timelineData;
        private timelineGranularityData;
        private hostServices;
        private svg;
        private timelineDiv;
        private body;
        private rangeText;
        private mainGroupElement;
        private yearLabelsElement;
        private quarterLabelsElement;
        private monthLabelsElement;
        private weekLabelsElement;
        private dayLabelsElement;
        private cellsElement;
        private cursorGroupElement;
        private selectorContainer;
        private options;
        private periodSlicerRect;
        private selectedText;
        private vertLine;
        private horizLine;
        private textLabels;
        private selector;
        private initialized;
        private selectionManager;
        private clearCatcher;
        private dataView;
        private valueType;
        private values;
        private svgWidth;
        private newGranularity;
        static calendar: Calendar;
        static capabilities: VisualCapabilities;
        private timelineMargins;
        private defaultTimelineProperties;
        private timelineSelectors;
        /**
         * Changes the current granularity depending on the given granularity type
         * Separates the new granularity's date periods which contain the start/end selection
         * Unseparates the date periods of the previous granularity.
         * @param granularity The new granularity type
         */
        changeGranularity(granularity: GranularityType, startDate: Date, endDate: Date): void;
        init(options: VisualInitOptions): void;
        private addWrappElements();
        private clear();
        private drawGranular(timelineProperties);
        fillColorGranularity(granularityFormat: GranularityFormat): void;
        redrawPeriod(granularity: GranularityType): void;
        private static setMeasures(labelFormat, granularityType, datePeriodsCount, viewport, timelineProperties, timelineMargins);
        private visualChangeOnly(options);
        /**
         * Note: Public for testability.
         */
        datasetsChanged(options: VisualUpdateOptions): boolean;
        private unavailableType(dataViewCategorical);
        private unavailableChildIdentityField(dataViewTree);
        private createTimelineOptions(dataView);
        prepareValues(values: any): any;
        private createTimelineData();
        update(options: VisualUpdateOptions): void;
        selectPeriod(periodNameIndex: any): void;
        private static isDataNotMatch(dataView);
        static converter(timelineData: TimelineData, timelineProperties: TimelineProperties, defaultTimelineProperties: DefaultTimelineProperties, timelineGranularityData: TimelineGranularityData, dataView: DataView, initialized: boolean, granularityType: GranularityType, viewport: IViewport, timelineMargins: TimelineMargins): TimelineFormat;
        private render(timelineData, timelineFormat, timelineProperties, options);
        private renderLabels(labels, labelsElement, index, isLast);
        private clearData();
        private static updateCursors(timelineData, cellWidth);
        private static fillTimelineFormat(objects, timelineProperties);
        fillCells(cellFormat: CellFormat): void;
        renderCells(timelineData: TimelineData, timelineFormat: TimelineFormat, timelineProperties: TimelineProperties, suppressAnimations: any): void;
        dragstarted(): void;
        dragged(currentCursor: CursorDatapoint): void;
        /**
         * Note: Public for testability.
         */
        findCursorOverElement(x: number): TimelineCursorOverElement;
        dragended(): void;
        private drag;
        renderCursors(timelineData: TimelineData, timelineFormat: TimelineFormat, cellHeight: number, cellsYPosition: number): D3.UpdateSelection;
        renderTimeRangeText(timelineData: TimelineData, timeRangeFormat: LabelFormat): void;
        setSelection(timelineData: TimelineData): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        enumerateRangeHeader(enumeration: ObjectEnumerationBuilder, dataview: DataView): void;
        enumerateCells(enumeration: ObjectEnumerationBuilder, dataview: DataView): void;
        enumerateGranularity(enumeration: ObjectEnumerationBuilder, dataview: DataView): void;
        enumerateLabels(enumeration: ObjectEnumerationBuilder, dataview: DataView): void;
        enumerateCalendar(enumeration: ObjectEnumerationBuilder, dataview: DataView): void;
        enumerateWeekDay(enumeration: ObjectEnumerationBuilder, dataview: DataView): void;
    }
}

declare module powerbi.visuals.samples {
    import LegendData = powerbi.visuals.LegendData;
    import IValueFormatter = powerbi.visuals.IValueFormatter;
    import SelectableDataPoint = powerbi.visuals.SelectableDataPoint;
    import TooltipDataItem = powerbi.visuals.TooltipDataItem;
    import VisualDataLabelsSettings = powerbi.visuals.VisualDataLabelsSettings;
    import DataViewObjectPropertyIdentifier = powerbi.DataViewObjectPropertyIdentifier;
    import IInteractivityService = powerbi.visuals.IInteractivityService;
    import IVisual = powerbi.IVisual;
    import VisualCapabilities = powerbi.VisualCapabilities;
    import IDataColorPalette = powerbi.IDataColorPalette;
    import DataView = powerbi.DataView;
    import VisualInitOptions = powerbi.VisualInitOptions;
    import VisualUpdateOptions = powerbi.VisualUpdateOptions;
    import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
    import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
    interface StreamData {
        series: StreamGraphSeries[];
        legendData: LegendData;
        valueFormatter: IValueFormatter;
        categoryFormatter: IValueFormatter;
        streamGraphSettings: StreamGraphSettings;
        categoriesText: string[];
    }
    interface StreamDataPoint {
        x: number;
        y: number;
        y0?: number;
        text: string;
        labelFontSize: string;
    }
    interface StreamGraphSeries extends SelectableDataPoint {
        dataPoints: StreamDataPoint[];
        tooltipInfo?: TooltipDataItem[];
        highlight?: boolean;
    }
    interface StreamGraphSettings {
        legendSettings: StreamGraphLegendSettings;
        categoryAxisSettings: StreamGraphAxisSettings;
        valueAxisSettings: StreamGraphAxisSettings;
        dataLabelsSettings: VisualDataLabelsSettings;
    }
    interface StreamGraphLegendSettings {
        show: boolean;
        showTitle: boolean;
        labelColor: string;
        titleText: string;
        fontSize: number;
    }
    interface StreamGraphAxisSettings {
        show: boolean;
        labelColor: string;
        showAxisTitle: boolean;
    }
    interface StreamProperty {
        [propertyName: string]: DataViewObjectPropertyIdentifier;
    }
    interface StreamGraphBehaviorOptions {
        selection: D3.Selection;
        clearCatcher: D3.Selection;
        interactivityService: IInteractivityService;
    }
    class StreamGraph implements IVisual {
        private static VisualClassName;
        private static Properties;
        private static Layer;
        private static XAxisLabel;
        private static YAxisLabel;
        private static MaxNumberOfAxisXValues;
        static capabilities: VisualCapabilities;
        private margin;
        private viewport;
        private svg;
        private dataPointsContainer;
        private axisGraphicsContext;
        private xAxis;
        private yAxis;
        private clearCatcher;
        private interactivityService;
        private behavior;
        private colors;
        private dataView;
        private legend;
        private data;
        converter(dataView: DataView, colors: IDataColorPalette, interactivityService: IInteractivityService): StreamData;
        private parseSettings(dataView);
        init(options: VisualInitOptions): void;
        update(options: VisualUpdateOptions): void;
        private getStreamGraphLabelLayout(xScale, yScale);
        private renderChart(series, duration);
        private drawAxis(data, xScale, yScale);
        private renderYAxisLabels();
        private getYAxisTitleFromValues(values);
        private renderXAxisLabels();
        private renderLegend(streamGraphData);
        private updateViewPort();
        private setMaxTicks(axis, maxSize, maxValue?);
        private getFittedTickLength(axis, maxSize, maxTicks);
        private getFittedTickValues(axis, maxSize, maxTicks);
        private measureTicks(ticks, measureTickFunction);
        private getTicksByAxis(axis);
        private getMeasureTickFunction(axis, ticks);
        private getTextPropertiesFunction(text);
        private getWiggle(dataView);
        private enumerateValueAxisValues(enumeration);
        private enumerateCategoryAxisValues(enumeration);
        private enumerateLegend(enumeration);
        private clearData();
        onClearSelection(): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
    }
    module streamGraphUtils {
        var DimmedOpacity: number;
        var DefaultOpacity: number;
        function getFillOpacity(selected: boolean, highlight: boolean, hasSelection: boolean, hasPartialHighlights: boolean): number;
    }
}

declare module powerbi.visuals.samples {
    interface PulseChartConstructorOptions {
        animator?: IGenericAnimator;
        svg?: D3.Selection;
        behavior?: IInteractiveBehavior;
    }
    interface PulseBehaviorOptions {
        layerOptions?: any[];
        clearCatcher: D3.Selection;
    }
    interface TooltipSettings {
        dataPointColor: string;
        marginTop: number;
        timeHeight: number;
    }
    interface PulseChartChartDataLabelsSettings extends PointDataLabelsSettings {
        labelDensity: string;
    }
    interface PulseChartSeries extends SelectableDataPoint {
        name?: string;
        displayName: string;
        key: string;
        lineIndex: number;
        xCol: DataViewMetadataColumn;
        yCol: DataViewMetadataColumn;
        labelSettings: PulseChartChartDataLabelsSettings;
        data: PulseChartDataPoint[];
        color: string;
        identity: SelectionId;
        width: number;
        xAxisProperties?: PulseChartXAxisProperties;
        widthOfGap: number;
    }
    interface PulseChartTooltipData {
        value: string;
        title: string;
        description: string;
        offsetX?: number;
    }
    interface PulseChartAnimationPosition {
        series: number;
        index: number;
    }
    interface PulseChartPointXY {
        x: number;
        y: number;
    }
    interface PulseChartPrimitiveDataPoint extends TooltipEnabledDataPoint, SelectableDataPoint, LabelEnabledDataPoint {
        categoryValue: any;
        value: number;
        categoryIndex: number;
        seriesIndex: number;
        highlight?: boolean;
        key: string;
        labelSettings: PulseChartChartDataLabelsSettings;
        pointColor?: string;
    }
    interface PulseChartDataPoint extends PulseChartPrimitiveDataPoint, PulseChartPointXY {
        groupIndex: number;
        popupInfo?: PulseChartTooltipData;
        eventSize: number;
        runnerCounterValue: any;
        runnerCounterFormatString: any;
    }
    interface PulseChartLegend extends DataViewObject {
        show?: boolean;
        showTitle?: boolean;
        titleText?: string;
        position?: LegendPosition;
    }
    interface PulseChartPopupSettings {
        show: boolean;
        alwaysOnTop: boolean;
        width: number;
        height: number;
        color: string;
        fontSize: number;
        fontColor: string;
        showTime: boolean;
        showTitle: boolean;
        timeColor: string;
        timeFill: string;
    }
    interface PulseChartDotsSettings {
        color: string;
        size: number;
        minSize: number;
        maxSize: number;
        transparency: number;
    }
    function createEnumTypeFromEnum(type: any): IEnumType;
    enum PulseChartXAxisDateFormat {
        DateOnly,
        TimeOnly,
    }
    enum XAxisPosition {
        Center,
        Bottom,
    }
    enum RunnerCounterPosition {
        TopLeft,
        TopRight,
    }
    interface PulseChartGapsSettings {
        show: boolean;
        visibleGapsPercentage: number;
    }
    interface PulseChartSeriesSetting {
        fill: string;
        width: number;
    }
    interface PulseChartPlaybackSettings {
        pauseDuration: number;
        playSpeed: number;
        autoplay: boolean;
        autoplayPauseDuration: number;
        color: string;
        position: PulseChartAnimationPosition;
    }
    interface PulseChartRunnerCounterSettings {
        show: boolean;
        label: string;
        position: RunnerCounterPosition;
        fontSize: number;
        fontColor: string;
    }
    interface PulseChartAxisSettings {
        formatterOptions?: ValueFormatterOptions;
        fontColor: string;
        color: string;
        show: boolean;
    }
    interface PulseChartXAxisSettings extends PulseChartAxisSettings {
        position: XAxisPosition;
        dateFormat?: PulseChartXAxisDateFormat;
        backgroundColor: string;
    }
    interface PulseChartYAxisSettings extends PulseChartAxisSettings {
    }
    interface PulseChartSettings {
        formatStringProperty: DataViewObjectPropertyIdentifier;
        displayName?: string;
        dots: PulseChartDotsSettings;
        fillColor?: string;
        precision: number;
        legend?: PulseChartLegend;
        colors?: IColorPalette;
        series: PulseChartSeriesSetting;
        popup: PulseChartPopupSettings;
        gaps: PulseChartGapsSettings;
        xAxis: PulseChartXAxisSettings;
        yAxis: PulseChartYAxisSettings;
        runnerCounter: PulseChartRunnerCounterSettings;
        playback: PulseChartPlaybackSettings;
    }
    interface PulseChartAxesLabels {
        x: string;
        y: string;
        y2?: string;
    }
    interface PulseChartData {
        settings: PulseChartSettings;
        columns: PulseChartDataRoles<DataViewCategoricalColumn>;
        categoryMetadata: DataViewMetadataColumn;
        hasHighlights: boolean;
        series: PulseChartSeries[];
        isScalar?: boolean;
        dataLabelsSettings: PointDataLabelsSettings;
        axesLabels: PulseChartAxesLabels;
        hasDynamicSeries?: boolean;
        defaultSeriesColor?: string;
        categoryData?: PulseChartPrimitiveDataPoint[];
        categories: any[];
        legendData?: LegendData;
        grouped: DataViewValueColumnGroup[];
        xScale?: D3.Scale.TimeScale | D3.Scale.LinearScale;
        commonYScale?: D3.Scale.LinearScale;
        yScales?: D3.Scale.LinearScale[];
        yAxis?: D3.Svg.Axis;
        widthOfXAxisLabel: number;
        widthOfTooltipValueLabel: number;
        heightOfTooltipDescriptionTextLine: number;
        runnerCounterHeight: number;
    }
    interface PulseChartProperty {
        [propertyName: string]: DataViewObjectPropertyIdentifier;
    }
    interface PulseChartProperties {
        [objectName: string]: PulseChartProperty;
    }
    interface PulseChartXAxisProperties {
        values: (Date | number)[];
        scale: D3.Scale.TimeScale;
        axis: D3.Svg.Axis;
        rotate: boolean;
    }
    interface PulseChartPoint {
        x: number;
        value: Date | number;
    }
    interface PulseChartDataRoles<T> {
        Timestamp?: T;
        Category?: T;
        Value?: T;
        EventTitle?: T;
        EventDescription?: T;
        EventSize?: T;
        RunnerCounter?: T;
    }
    interface PulseChartElementDimensions {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    class PulseChart implements IVisual {
        static RoleDisplayNames: PulseChartDataRoles<string>;
        static RoleNames: PulseChartDataRoles<string>;
        static capabilities: VisualCapabilities;
        private static Properties;
        static getProperties(capabilities: VisualCapabilities): any;
        private static DefaultMargin;
        private static DefaultViewport;
        private static PlaybackButtonsHeight;
        private static PopupMinHeight;
        private static PopupMinWidth;
        private static PopupMaxHeight;
        private static PopupMaxWidth;
        private static MaxWidthOfYAxis;
        private static PopupTextPadding;
        private static XAxisTickSpace;
        private static XAxisTickHeight;
        private static MinimumTicksToRotate;
        private static AxisTickRotateAngle;
        private static GetPopupValueTextProperties(text?, fontSizeValue?);
        private static GetPopupTitleTextProperties(text?, fontSizeValue?);
        private static GetPopupDescriptionTextProperties(text?, fontSizeValue?);
        static GetRunnerCounterTextProperties(text?: string, fontSizeValue?: number): TextProperties;
        static ConvertTextPropertiesToStyle(textProperties: TextProperties): Object;
        private static GetDateTimeFormatString(dateFormatType, dateFormat);
        private static GetFullWidthOfDateFormat(dateFormat, textProperties);
        static AddOnTouchClick(selection: D3.Selection, callback: (data: any, index: number) => any): D3.Selection;
        private static DefaultSettings;
        private static DefaultTooltipSettings;
        private static MaxGapCount;
        private static MinGapWidth;
        private static Chart;
        private static Line;
        private static LineContainer;
        private static LineNode;
        private static XAxisNode;
        private static Dot;
        private static DotsContainer;
        private static Tooltip;
        private static TooltipRect;
        private static TooltipTriangle;
        private static Gaps;
        private static Gap;
        private static GapNode;
        private static TooltipLine;
        private static TooltipTime;
        private static TooltipTimeRect;
        private static TooltipTitle;
        private static TooltipDescription;
        private static TooltipContainer;
        private static AnimationDot;
        private static getCategoricalColumnOfRole(dataView, roleName);
        static converter(dataView: DataView, colors: IDataColorPalette, interactivityService?: IInteractivityService): PulseChartData;
        private static createAxisY(commonYScale, height, formatterOptions, show?);
        private static createAxisX(isScalar, series, originalScale, formatterOptions, dateFormat, position, widthOfXAxisLabel);
        private static getXAxisScales(series, isScalar, originalScale);
        private static getXAxisValuesToDisplay(scale, rotate, isScalar, dateFormat, widthOfXAxisLabel);
        private static getGroupIndex(index, grouped);
        private static getGapWidths(values);
        private static createScale(isScalar, domain, minX, maxX);
        data: PulseChartData;
        margin: IMargin;
        viewport: IViewport;
        size: IViewport;
        handleSelectionTimeout: number;
        host: IVisualHostServices;
        private svg;
        private chart;
        private dots;
        private yAxis;
        private gaps;
        private animationDot;
        private lineX;
        private selectionManager;
        private animator;
        private animationHandler;
        private colors;
        private rootSelection;
        private animationSelection;
        private lastSelectedPoint;
        runnerCounterPlaybackButtonsHeight: number;
        popupHeight: number;
        constructor(options?: PulseChartConstructorOptions);
        init(options: VisualInitOptions): void;
        update(options: VisualUpdateOptions): void;
        private updateData(data);
        private getDataArrayToCompare(data);
        private validateData(data);
        private getChartWidth();
        private getChartHeight(xAxisRotated);
        private updateElements();
        calculateXAxisProperties(width: number): void;
        calculateYAxisProperties(height: number): void;
        private getYAxisScales(height);
        autoplayPauseDuration: number;
        isAutoPlay: boolean;
        render(suppressAnimations: boolean): void;
        private renderAxes(data, duration);
        private renderXAxis(data, duration);
        private renderYAxis(data, duration);
        renderChart(): void;
        private drawLinesStatic(limit, isAnimated);
        private drawLinesStaticBeforeAnimation(limit);
        private moveAnimationDot(d);
        playAnimation(delay?: number): void;
        pauseAnimation(): void;
        stopAnimation(): void;
        findNextPoint(position: PulseChartAnimationPosition): PulseChartAnimationPosition;
        findPrevPoint(position: PulseChartAnimationPosition): PulseChartAnimationPosition;
        isAnimationSeriesAndIndexLast(position: PulseChartAnimationPosition): boolean;
        isAnimationSeriesLast(position: PulseChartAnimationPosition): boolean;
        isAnimationIndexLast(position: PulseChartAnimationPosition): boolean;
        private drawLines(data);
        private showAnimationDot();
        private hideAnimationDot();
        private getInterpolation(data, start);
        clearSelection(): void;
        private handleSelection(position);
        private animationDuration;
        private pauseDuration;
        private dotOpacity;
        private drawDots(data);
        private renderGaps(data, duration);
        private setSelection(selectionIds?);
        private isPopupShow(d, selectionIds?);
        private drawTooltips(data, selectionIds?);
        private isHigherMiddle(value, groupIndex);
        private static getObjectsFromDataView(dataView);
        private static parseSettings(dataView, colors, columns);
        private static getPopupSettings(objects, colors);
        private static getDotsSettings(objects, colors);
        private static getSeriesSettings(objects, colors);
        private static getGapsSettings(objects);
        private static getAxisXSettings(objects, colors);
        private static getAxisYSettings(objects, colors);
        private static getPlaybackSettings(objects, colors);
        private static getRunnerCounterSettings(objects, colors, columns);
        private clearAll(hide);
        clearChart(): void;
        clearRedundant(position: PulseChartAnimationPosition): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
        private getSettings(name);
        private readGeneralInstance(enumeration);
        private readPopupInstance(enumeration);
        private readDotsInstance(enumeration);
        private xAxisInstance(enumeration);
        private yAxisInstance(enumeration);
        private readSeriesInstance(enumeration);
        private readGapsInstance(enumeration);
        private readPlaybackInstance(enumeration);
        private readRunnerCounterInstance(enumeration);
        destroy(): void;
    }
    class PulseAnimator {
        private chart;
        private svg;
        private animationPlay;
        private animationPause;
        private animationReset;
        private animationToEnd;
        private animationPrev;
        private animationNext;
        private runnerCounter;
        private runnerCounterText;
        private static AnimationPlay;
        private static AnimationPause;
        private static AnimationReset;
        private static AnimationToEnd;
        private static AnimationPrev;
        private static AnimationNext;
        private static RunnerCounter;
        private animatorState;
        static AnimationMinPosition: PulseChartAnimationPosition;
        private static DimmedOpacity;
        private static DefaultOpacity;
        private static DefaultControlsColor;
        private container;
        animationPlayingIndex: number;
        private runnerCounterValue;
        private runnerCounterTopLeftPosition;
        private runnerCounterPosition;
        private maxTextWidthOfRunnerCounterValue;
        private color;
        private isAutoPlayed;
        isAnimated: boolean;
        isPlaying: boolean;
        isPaused: boolean;
        isStopped: boolean;
        constructor(chart: PulseChart, svg: D3.Selection);
        private setDefaultValues();
        render(): void;
        setControlsColor(color: string): void;
        private renderControls();
        private static setControlVisiblity(element, isVisible, isDisabled?);
        private disableControls();
        show(): void;
        setRunnerCounterValue(index?: number): void;
        private drawCounterValue();
        play(delay?: number, renderDuringPlaying?: boolean): void;
        playNext(): void;
        pause(): void;
        reset(): void;
        private next();
        private prev();
        toEnd(): void;
        stop(): void;
        private positionValue;
        position: PulseChartAnimationPosition;
        flooredPosition: PulseChartAnimationPosition;
        private isPositionWasSaved;
        private autoPlayPosition;
        savedPosition: PulseChartAnimationPosition;
        clear(): void;
        clearTimeouts(): void;
    }
    module PulseChartDataLabelUtils {
        function getDefaultPulseChartLabelSettings(): PulseChartChartDataLabelsSettings;
    }
    module PulseChartAxisPropertiesHelper {
        function getCategoryAxisProperties(dataViewMetadata: DataViewMetadata, axisTitleOnByDefault?: boolean): DataViewObject;
        function getValueAxisProperties(dataViewMetadata: DataViewMetadata, axisTitleOnByDefault?: boolean): DataViewObject;
    }
}

declare module powerbi.visuals.samples {
    interface LineDotPoint {
        time: number | Date;
        value: number;
        dot: number;
        sum: number;
        selector: SelectionId;
    }
    interface Legend {
        text: string;
        transform?: string;
        dx?: string;
        dy?: string;
    }
    interface LineDotChartViewModel {
        points: LineDotPoint[];
        settings: LineDotChartSettings;
        xAxis: IAxisProperties;
        yAxis: IAxisProperties;
        yAxis2: IAxisProperties;
        legends: Legend[];
    }
    interface LineDotChartSettings {
        lineFill: string;
        lineThickness: number;
        dotFill: string;
        dotSizeMin: number;
        dotSizeMax: number;
        counterTitle: string;
        xAxisTitle: string;
        yAxisTitle: string;
        duration: number;
        isanimated: boolean;
        isstopped: boolean;
    }
    class LineDotChart implements IVisual {
        private selectionManager;
        private hostServices;
        private isDateTime;
        private static DefaultSettings;
        /**
        * Informs the System what it can do
        * Fields, Formatting options, data reduction & QnA hints
        */
        static capabilities: VisualCapabilities;
        private static Identity;
        private static Axes;
        private static Axis;
        private static Legends;
        private static Legend;
        private static Values;
        private static Properties;
        private model;
        private root;
        private main;
        private axes;
        private axisX;
        private axisY;
        private axisY2;
        private legends;
        private line;
        private colors;
        private margin;
        private LegendSize;
        private AxisSize;
        init(options: VisualInitOptions): void;
        update(options: VisualUpdateOptions): void;
        destroy(): void;
        setIsStopped(isstopped: Boolean): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        private selectDot(dotelement, selector);
        private clearSelection();
        private converter(dataView, viewport);
        private parseSettings(dataView);
        private generateAxisLabels(viewport, settings);
        private resize(viewport);
        private draw(model);
        private pointDelay(points, num, animation_duration);
        private showDataPoint(data, index);
        private hideDataPoint(data, index);
        private addTooltip(model, element);
        private renderLegends(model);
    }
}

declare module powerbi.visuals.samples {
    interface SunburstSlice {
        children?: SunburstSlice[];
        value?: any;
        color?: string;
        name?: string;
        parent?: SunburstSlice;
        selector: SelectionId;
        total: number;
        tooltipInfo?: TooltipDataItem[];
    }
    interface SunburstViewModel {
        root: SunburstSlice;
    }
    var sunburstRoleNames: {
        nodes: string;
        values: string;
    };
    class Sunburst implements IVisual {
        private static minOpacity;
        private svg;
        private g;
        private arc;
        private total;
        private viewport;
        private colors;
        private selectionManager;
        private static roleNames;
        static capabilities: VisualCapabilities;
        init(options: VisualInitOptions): void;
        private static setAllUnhide(selection);
        update(options: VisualUpdateOptions): void;
        private updateInternal(dataRootNode);
        private static getTreePath(node);
        private onResize();
        private highlightPath(d, sunBurst, setUnhide);
        private renderTooltip(selection);
        private static getTooltipData(displayName, value);
        private covertTreeNodeToSunBurstNode(originParentNode, sunburstParentNode, colors, pathIdentity, color);
        converter(dataView: DataView, colors: IDataColorPalette): SunburstSlice;
    }
}

declare module powerbi.visuals.plugins {
    let sunburstCustom: IVisualPlugin;
    let asterPlot: IVisualPlugin;
    var tornadoChart: IVisualPlugin;
    var sankeyDiagram: IVisualPlugin;
    let mekkoChart: IVisualPlugin;
    var bulletChart: IVisualPlugin;
    var wordCloud: IVisualPlugin;
    var chicletSlicer: IVisualPlugin;
    var chordChart: IVisualPlugin;
    var enhancedScatterChart: IVisualPlugin;
    var radarChart: IVisualPlugin;
    var dotPlot: IVisualPlugin;
    var histogram: IVisualPlugin;
    var timeline: IVisualPlugin;
    var forceGraph: IVisualPlugin;
    let gantt: IVisualPlugin;
    let streamGraph: IVisualPlugin;
    let pulseChart: IVisualPlugin;
    var lineDotChart: IVisualPlugin;
}
