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
    import PixelConverter = jsCommon.PixelConverter;

    export interface LineChartConstructorOptions extends CartesianVisualConstructorOptions {
        chartType?: LineChartType;
    }

    export interface ILineChartConfiguration {
        xAxisProperties: IAxisProperties;
        yAxisProperties: IAxisProperties;
        margin: any;
    }

    export interface LineChartCategoriesData extends LineChartDataPoint { }

    export interface LineChartData extends CartesianData {
        series: LineChartSeries[];
        isScalar?: boolean;
        dataLabelsSettings: PointDataLabelsSettings;
        axesLabels: ChartAxesLabels;
        hasDynamicSeries?: boolean;
        defaultSeriesColor?: string;
        categoryData?: LineChartCategoriesData[];
    }

    export interface LineChartSeries extends CartesianSeries, SelectableDataPoint {
        displayName: string;
        key: string;
        lineIndex: number;
        color: string;
        xCol: DataViewMetadataColumn;
        yCol: DataViewMetadataColumn;
        data: LineChartDataPoint[];
        labelSettings: VisualDataLabelsSettings;
    }

    export interface LineChartDataPoint extends CartesianDataPoint, TooltipEnabledDataPoint, SelectableDataPoint, LabelEnabledDataPoint {
        value: number;
        categoryIndex: number;
        seriesIndex: number;
        key: string;
        labelSettings: VisualDataLabelsSettings;
        pointColor?: string;
        stackedValue?: number;
    }

    export interface HoverLineDataPoint {
        color: string;
        label: string;
        category: string;
        measure: any;
        value: number;
    }

    export const enum LineChartType {
        default = 1 << 0,
        area = 1 << 1,
        smooth = 1 << 2,
        lineShadow = 1 << 3,
        stackedArea = 1 << 4
    }

    enum LineChartRelativePosition {
        none,
        equal,
        lesser,
        greater,
    };

    /** 
     * Renders a data series as a line visual.
     */
    export class LineChart implements ICartesianVisual {
        private static ClassName = 'lineChart';
        private static MainGraphicsContextClassName = 'mainGraphicsContext';
        private static CategorySelector: ClassAndSelector = createClassAndSelector('cat');
        private static CategoryValuePoint: ClassAndSelector = createClassAndSelector('dot');
        private static CategoryPointSelector: ClassAndSelector = createClassAndSelector('point');
        private static CategoryAreaSelector: ClassAndSelector = createClassAndSelector('catArea');
        private static HoverLineCircleDot: ClassAndSelector = createClassAndSelector('circle-item');
        private static PointRadius = 5;
        private static HorizontalShift = 0;
        private static CircleRadius = 4;
        private static PathElementName = 'path';
        private static CircleElementName = 'circle';
        private static CircleClassName = 'selection-circle';
        private static LineElementName = 'line';
        private static RectOverlayName = 'rect';
        public static AreaFillOpacity = 0.4;
        public static DimmedAreaFillOpacity = 0.2;

        private isInteractiveChart: boolean;
        private isScrollable: boolean;

        private element: JQuery;
        private cartesainSVG: D3.Selection;
        private mainGraphicsContext: D3.Selection;
        private mainGraphicsSVG: D3.Selection;
        private hoverLineContext: D3.Selection;
        private options: CartesianVisualInitOptions;
        private dataViewCat: DataViewCategorical;

        private colors: IDataColorPalette;
        private host: IVisualHostServices;
        private data: LineChartData;
        private clippedData: LineChartData;
        private lineType: LineChartType;
        private cartesianVisualHost: ICartesianVisualHost;

        private xAxisProperties: IAxisProperties;
        private yAxisProperties: IAxisProperties;
        private margin: IMargin;
        private currentViewport: IViewport;

        private selectionCircles: D3.Selection[];
        private dragHandle: D3.Selection;
        private hoverLine: D3.Selection;
        private lastInteractiveSelectedColumnIndex: number;

        private interactivityService: IInteractivityService;
        private animator: IGenericAnimator;
        private seriesLabelFormattingEnabled: boolean;

        private static validLabelPositions = [NewPointLabelPosition.Above];
        private static validStackedLabelPositions = [RectLabelPosition.InsideCenter, RectLabelPosition.InsideEnd, RectLabelPosition.InsideBase];

        private overlayRect: D3.Selection;
        private isComboChart: boolean;

        public static customizeQuery(options: CustomizeQueryOptions): void {
            let dataViewMapping = options.dataViewMappings[0];
            if (!dataViewMapping || !dataViewMapping.categorical || !dataViewMapping.categorical.categories)
                return;

            let dataViewCategories = <data.CompiledDataViewRoleForMappingWithReduction>dataViewMapping.categorical.categories;
            let categoryItems = dataViewCategories.for.in.items;
            if (!_.isEmpty(categoryItems)) {
                let categoryType = categoryItems[0].type;

                let objects: DataViewObjects;
                if (dataViewMapping.metadata)
                    objects = dataViewMapping.metadata.objects;

                if (CartesianChart.getIsScalar(objects, lineChartProps.categoryAxis.axisType, categoryType)) {
                    dataViewCategories.dataReductionAlgorithm = { sample: {} };
                }
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

                //TODO: line chart should be sortable by X if it has scalar axis
                // But currently it doesn't support this. Always return 'category' 
                // once it is supported.
                if (!CartesianChart.getIsScalar(objects, lineChartProps.categoryAxis.axisType, categoryType))
                    return ['Category'];
            }

            return null;
        }

        public static converter(
            dataView: DataView,
            blankCategoryValue: string,
            colors: IDataColorPalette,
            isScalar: boolean,
            interactivityService?: IInteractivityService,
            shouldCalculateStacked?: boolean): LineChartData {
            let categorical = dataView.categorical;
            let category = categorical.categories && categorical.categories.length > 0
                ? categorical.categories[0]
                : {
                    source: undefined,
                    values: [blankCategoryValue],
                    identity: undefined,
                };

            let xAxisCardProperties = CartesianHelper.getCategoryAxisProperties(dataView.metadata);
            isScalar = CartesianHelper.isScalar(isScalar, xAxisCardProperties);
            categorical = ColumnUtil.applyUserMinMax(isScalar, categorical, xAxisCardProperties);

            let formatStringProp = lineChartProps.general.formatString;
            let categoryType: ValueType = AxisHelper.getCategoryValueType(category.source, isScalar);
            let isDateTime = AxisHelper.isDateTime(categoryType);
            let categoryValues = category.values;
            let categoryData = [];
            let series: LineChartSeries[] = [];
            let seriesLen = categorical.values ? categorical.values.length : 0;
            let hasDynamicSeries = !!(categorical.values && categorical.values.source);
            let values = categorical.values;
            let defaultLabelSettings: PointDataLabelsSettings = dataLabelUtils.getDefaultPointLabelSettings();
            let defaultSeriesColor: string;

            if (dataView.metadata && dataView.metadata.objects) {
                let objects = dataView.metadata.objects;
                defaultSeriesColor = DataViewObjects.getFillColor(objects, lineChartProps.dataPoint.defaultColor);

                let labelsObj = <DataLabelObject>objects['labels'];
                dataLabelUtils.updateLabelSettingsFromLabelsObject(labelsObj, defaultLabelSettings);
            }

            let colorHelper = new ColorHelper(colors, lineChartProps.dataPoint.fill, defaultSeriesColor);

            let grouped: DataViewValueColumnGroup[];
            if (dataView.categorical.values)
                grouped = dataView.categorical.values.grouped();
            
            let stackedValues;
            if (shouldCalculateStacked) {
                //initialize array with zeros            
                stackedValues = categorical.values && categorical.values.length > 0 ? _.times(categorical.values[0].values.length, () => 0) : [];
            }         

            for (let seriesIndex = 0; seriesIndex < seriesLen; seriesIndex++) {
                let column = categorical.values[seriesIndex];
                let valuesMetadata = column.source;
                let dataPoints: LineChartDataPoint[] = [];
                let groupedIdentity = grouped[seriesIndex];
                let identity = hasDynamicSeries && groupedIdentity ?
                    SelectionId.createWithIdAndMeasure(groupedIdentity.identity, column.source.queryName) :
                    SelectionId.createWithMeasure(column.source.queryName);
                let key = identity.getKey();
                let color = this.getColor(colorHelper, hasDynamicSeries, values, grouped, seriesIndex, groupedIdentity);
                let seriesLabelSettings: VisualDataLabelsSettings;

                if (!hasDynamicSeries) {
                    let labelsSeriesGroup = grouped && grouped.length > 0 && grouped[0].values ? grouped[0].values[seriesIndex] : null;
                    let labelObjects = (labelsSeriesGroup && labelsSeriesGroup.source && labelsSeriesGroup.source.objects) ? <DataLabelObject> labelsSeriesGroup.source.objects['labels'] : null;
                    if (labelObjects) {
                        seriesLabelSettings = Prototype.inherit(defaultLabelSettings);
                        dataLabelUtils.updateLabelSettingsFromLabelsObject(labelObjects, seriesLabelSettings);
                    }
                }

                let dataPointLabelSettings = (seriesLabelSettings) ? seriesLabelSettings : defaultLabelSettings;

                for (let categoryIndex = 0, len = column.values.length; categoryIndex < len; categoryIndex++) {
                    let categoryValue = categoryValues[categoryIndex];
                    let value = AxisHelper.normalizeNonFiniteNumber(column.values[categoryIndex]);

                    // When Scalar, skip null categories and null values so we draw connected lines and never draw isolated dots.
                    if (isScalar && (categoryValue == null || value == null))
                        continue;

                    let categorical: DataViewCategorical = dataView.categorical;
                    let tooltipInfo: TooltipDataItem[] = TooltipBuilder.createTooltipInfo(formatStringProp, categorical, categoryValue, value, null, null, seriesIndex);
                    
                    let dataPoint: LineChartDataPoint = {
                        categoryValue: isDateTime && categoryValue ? categoryValue.getTime() : categoryValue,
                        value: value,
                        categoryIndex: categoryIndex,
                        seriesIndex: seriesIndex,
                        tooltipInfo: tooltipInfo,
                        selected: false,
                        identity: identity,
                        key: JSON.stringify({ ser: key, catIdx: categoryIndex }),
                        labelFill: dataPointLabelSettings.labelColor,
                        labelFormatString: valuesMetadata.format,
                        labelSettings: dataPointLabelSettings 
                    };
                    
                    if (shouldCalculateStacked) {
                        stackedValues[categoryIndex] += value;
                        dataPoint.stackedValue = stackedValues[categoryIndex];
                    }

                    if (category.objects && category.objects[categoryIndex]) {
                        dataPoint['pointColor'] = DataViewObjects.getFillColor(category.objects[categoryIndex], lineChartProps.dataPoint.fill);
                    }

                    dataPoints.push(dataPoint);

                    if (!categoryData[categoryIndex]) {
                        categoryData[categoryIndex] = dataPoint;
                    }
                }

                if (interactivityService) {
                    interactivityService.applySelectionStateToData(dataPoints);
                }

                if (dataPoints.length > 0) {
                    series.push({
                        displayName: valuesMetadata.displayName,
                        key: key,
                        lineIndex: seriesIndex,
                        color: color,
                        xCol: category.source,
                        yCol: column.source,
                        data: dataPoints,
                        identity: identity,
                        selected: false,
                        labelSettings: seriesLabelSettings,
                    });
                }
            }

            xAxisCardProperties = CartesianHelper.getCategoryAxisProperties(dataView.metadata);
            let valueAxisProperties = CartesianHelper.getValueAxisProperties(dataView.metadata);
             
            // Convert to DataViewMetadataColumn
            let valuesMetadataArray: powerbi.DataViewMetadataColumn[] = [];
            if (values) {
                for (let i = 0; i < values.length; i++) {

                    if (values[i] && values[i].source && values[i].source.displayName) {
                        valuesMetadataArray.push({ displayName: values[i].source.displayName });
                    }
                }
            }

            let axesLabels = converterHelper.createAxesLabels(xAxisCardProperties, valueAxisProperties, category.source, valuesMetadataArray);
            if (interactivityService) {
                interactivityService.applySelectionStateToData(series);
            }

            return {
                series: series,
                isScalar: isScalar,
                dataLabelsSettings: defaultLabelSettings,
                axesLabels: { x: axesLabels.xAxisLabel, y: axesLabels.yAxisLabel },
                hasDynamicSeries: hasDynamicSeries,
                categoryMetadata: category.source,
                categories: categoryValues,
                categoryData: categoryData
            };
        }

        public static getInteractiveLineChartDomElement(element: JQuery): HTMLElement {
            return element.children("svg").get(0);
        }

        private static getColor(
            colorHelper: ColorHelper,
            hasDynamicSeries: boolean,
            values: DataViewValueColumns,
            grouped: DataViewValueColumnGroup[],
            seriesIndex: number,
            groupedIdentity: DataViewValueColumnGroup): string {

            let objects: DataViewObjects;
            if (hasDynamicSeries) {
                if (grouped && grouped[seriesIndex])
                    objects = grouped[seriesIndex].objects;
            }
            else if (values[seriesIndex]) {
                objects = values[seriesIndex].source.objects;
            }

            return hasDynamicSeries && groupedIdentity 
                ? colorHelper.getColorForSeriesValue(objects, values.identityFields, groupedIdentity.name)
                : colorHelper.getColorForMeasure(objects, values[seriesIndex].source.queryName);
        }

        private static createStackedValueDomain(data: LineChartSeries[]): number[] {
            debug.assertValue(data, 'data');
            if (data.length === 0)
                return null;

            let minY = <number>d3.min(data, (kv) => { return d3.min(kv.data, d => { return d.stackedValue; }); });
            let maxY = <number>d3.max(data, (kv) => { return d3.max(kv.data, d => { return d.stackedValue; }); });

            return [minY, maxY];
        }

        constructor(options: LineChartConstructorOptions) {
            this.isScrollable = options.isScrollable ? options.isScrollable : false;
            this.lineType = options.chartType ? options.chartType : LineChartType.default;
            this.interactivityService = options.interactivityService;
            this.animator = options.animator;
            this.seriesLabelFormattingEnabled = options.seriesLabelFormattingEnabled;
        }

        public init(options: CartesianVisualInitOptions) {
            this.options = options;
            let element = this.element = options.element;
            this.cartesainSVG = options.svg;
            this.host = options.host;
            this.currentViewport = options.viewport;
            this.colors = options.style.colorPalette.dataColors;
            this.isInteractiveChart = options.interactivity && options.interactivity.isInteractiveLegend;
            this.cartesianVisualHost = options.cartesianHost;

            let chartType = options.chartType;
            this.isComboChart = chartType === CartesianChartType.ComboChart || chartType === CartesianChartType.LineClusteredColumnCombo || chartType === CartesianChartType.LineStackedColumnCombo;

            element.addClass(LineChart.ClassName);

            let svg = options.svg;

            let graphicsContextParent = this.mainGraphicsSVG = svg.append('svg')
                .classed('lineChartSVG', true);

            if (!this.isComboChart && !this.isInteractiveChart) {
                this.overlayRect = graphicsContextParent
                    .append(LineChart.RectOverlayName)
                    .style("opacity", SVGUtil.AlmostZero);
            }
            this.mainGraphicsContext = graphicsContextParent
                .append('g')
                .classed(LineChart.MainGraphicsContextClassName, true);

            this.hoverLineContext = svg.append('g')
                .classed('hover-line', true);

            this.hoverLineContext.append(LineChart.LineElementName)
                .attr("x1", 0).attr("x2", 0)
                .attr("y1", 0).attr("y2", 0);

            let hoverLine = this.hoverLine = this.hoverLineContext.select(LineChart.LineElementName);
            if (this.isInteractiveChart) {
                hoverLine.classed('interactive', true);
            }

            // define circles object - which will hold the handle circles. 
            // this object will be populated on render() function, with number of circles which matches the nubmer of lines.
            this.selectionCircles = [];

            let callout = AxisHelper.ToolTip.createCallout();
            this.element.append(callout);

            hoverLine.style('opacity', SVGUtil.AlmostZero);
            callout.css('opacity', SVGUtil.AlmostZero);

            this.xAxisProperties = {
                axis: null,
                scale: null,
                axisType: null,
                formatter: null,
                graphicsContext: null,
                values: null,
                axisLabel: null,
                isCategoryAxis: true
            };

            if (this.isInteractiveChart) {
                let rootSvg: EventTarget = LineChart.getInteractiveLineChartDomElement(this.element);
                let dragMove = () => {
                    let x: number = d3.mouse(rootSvg)[0];

                    let index: number = this.findIndex(x - this.margin.left);
                    this.selectColumn(index);
                };

                // assign drag and onClick events
                let drag = d3.behavior.drag()
                    .origin(Object)
                    .on("drag", dragMove);

                d3.select(rootSvg).call(drag);
                d3.select(rootSvg).on('click', dragMove);
            }
        }

        public setData(dataViews: DataView[]): void {
            this.data = {
                series: [],
                dataLabelsSettings: dataLabelUtils.getDefaultPointLabelSettings(),
                axesLabels: { x: null, y: null },
                hasDynamicSeries: false,
                categories: [],
                categoryMetadata: undefined,
                categoryData: [],
            };

            if (dataViews.length > 0) {
                let dataView = dataViews[0];

                if (dataView) {
                    if (dataView.categorical) {
                        let dataViewCat = this.dataViewCat = dataView.categorical;
                        let dvCategories = dataViewCat.categories;
                        let categoryType = ValueType.fromDescriptor({ text: true });
                        if (dvCategories && dvCategories.length > 0 && dvCategories[0].source && dvCategories[0].source.type)
                            categoryType = dvCategories[0].source.type;

                        let convertedData = LineChart.converter(
                            dataView,
                            valueFormatter.format(null),
                            this.cartesianVisualHost.getSharedColors(),
                            CartesianChart.getIsScalar(dataView.metadata ? dataView.metadata.objects : null, lineChartProps.categoryAxis.axisType, categoryType),
                            this.interactivityService,
                            EnumExtensions.hasFlag(this.lineType, LineChartType.stackedArea));
                        this.data = convertedData;
                    }
                }
            }
        }

        public calculateLegend(): LegendData {
            return this.createLegendDataPoints(0); // start with index 0 
        }

        public hasLegend(): boolean {
            return this.data && (this.data.hasDynamicSeries || (this.data.series && this.data.series.length > 1));
        }

        public setFilteredData(startIndex: number, endIndex: number): CartesianData {
            let catgSize = endIndex - startIndex;
            let data = this.clippedData = Prototype.inherit(this.data);
            data.series = LineChart.sliceSeries(data.series, catgSize, startIndex);
            data.categories = data.categories.slice(startIndex, endIndex);
            return data;
        }

        public calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[] {
            let data = this.data;
            let viewport = options.viewport;
            let margin = options.margin;
            this.currentViewport = viewport;
            this.margin = margin;

            let origCatgSize = data.series && data.series.length > 0 ? data.series[0].data.length : 0;
            let categoryWidth = CartesianChart.MinOrdinalRectThickness;
            let isScalar = this.data.isScalar;

            let preferredPlotArea = this.getPreferredPlotArea(isScalar, origCatgSize, categoryWidth);

            /* preferredPlotArea would be same as currentViewport width when there is no scrollbar. 
              In that case we want to calculate the available plot area for the shapes by subtracting the margin from available viewport */
            if (preferredPlotArea.width === this.currentViewport.width) {
                preferredPlotArea.width -= (margin.left + margin.right);
            }
            preferredPlotArea.height -= (margin.top + margin.bottom);

            this.clippedData = undefined;
            if (data && !isScalar && !this.isScrollable) {
                // trim data that doesn't fit on dashboard
                let categoryCount = this.getCategoryCount(origCatgSize);
                let catgSize = Math.min(origCatgSize, categoryCount);

                if (catgSize !== origCatgSize) {
                    data = this.clippedData = Prototype.inherit(data);
                    this.clippedData.series = LineChart.sliceSeries(data.series, catgSize);
                }
            }

            let xMetaDataColumn: DataViewMetadataColumn;
            let yMetaDataColumn: DataViewMetadataColumn;
            if (data.series && data.series.length > 0) {
                xMetaDataColumn = data.series[0].xCol;
                yMetaDataColumn = data.series[0].yCol;
            }

            let valueDomain = EnumExtensions.hasFlag(this.lineType, LineChartType.stackedArea) ? LineChart.createStackedValueDomain(data.series) : AxisHelper.createValueDomain(data.series, false);
            let hasZeroValueInYDomain = options.valueAxisScaleType === axisScale.log && !AxisHelper.isLogScalePossible(valueDomain);
            let combinedDomain = AxisHelper.combineDomain(options.forcedYDomain, valueDomain);
            this.yAxisProperties = AxisHelper.createAxis({
                pixelSpan: preferredPlotArea.height,
                dataDomain: combinedDomain,
                metaDataColumn: yMetaDataColumn,
                formatStringProp: lineChartProps.general.formatString,
                outerPadding: 0,
                isScalar: true,
                isVertical: true,
                forcedTickCount: options.forcedTickCount,
                useTickIntervalForDisplayUnits: true,
                isCategoryAxis: false,
                shouldClamp: AxisHelper.scaleShouldClamp(combinedDomain, valueDomain),
                scaleType: options.valueAxisScaleType,
                axisDisplayUnits: options.valueAxisDisplayUnits,
                axisPrecision: options.valueAxisPrecision
            });

            let xDomain = AxisHelper.createDomain(data.series, this.xAxisProperties.axisType, this.data.isScalar, options.forcedXDomain);
            let hasZeroValueInXDomain = options.valueAxisScaleType === axisScale.log && !AxisHelper.isLogScalePossible(xDomain);
            this.xAxisProperties = AxisHelper.createAxis({
                pixelSpan: preferredPlotArea.width,
                dataDomain: xDomain,
                metaDataColumn: xMetaDataColumn,
                formatStringProp: lineChartProps.general.formatString,
                outerPadding: 0,
                isScalar: this.data.isScalar,
                isVertical: false,
                forcedTickCount: options.forcedTickCount,
                useTickIntervalForDisplayUnits: true,
                getValueFn: (index, type) => this.lookupXValue(index, type),
                categoryThickness: CartesianChart.getCategoryThickness(data.series, origCatgSize, this.getAvailableWidth(), xDomain, isScalar),
                isCategoryAxis: true,
                scaleType: options.categoryAxisScaleType,
                axisDisplayUnits: options.categoryAxisDisplayUnits,
                axisPrecision: options.categoryAxisPrecision
            });

            this.xAxisProperties.axisLabel = options.showCategoryAxisLabel ? data.axesLabels.x : null;
            this.yAxisProperties.axisLabel = options.showValueAxisLabel ? data.axesLabels.y : null;

            this.xAxisProperties.hasDisallowedZeroInDomain = hasZeroValueInXDomain;
            this.yAxisProperties.hasDisallowedZeroInDomain = hasZeroValueInYDomain;
        
            return [this.xAxisProperties, this.yAxisProperties];
        }

        public enumerateObjectInstances(enumeration: ObjectEnumerationBuilder, options: EnumerateVisualObjectInstancesOptions): void {
            switch (options.objectName) {
                case 'dataPoint':
                    this.enumerateDataPoints(enumeration);
                    break;
                case 'labels':
                    this.enumerateDataLabels(enumeration);
                    break;
            }
        }

        private enumerateDataPoints(enumeration: ObjectEnumerationBuilder): void {
            let data = this.data;
            if (!data || !data.series || data.series.length === 0)
                return;

            let formatStringProp = lineChartProps.general.formatString;
            let singleSeriesData = data.series;
            let seriesLength = singleSeriesData.length;

            for (let i = 0; i < seriesLength; i++) {
                let selector = ColorHelper.normalizeSelector(singleSeriesData[i].identity.getSelector());

                let label = converterHelper.getFormattedLegendLabel(singleSeriesData[i].yCol, this.dataViewCat.values, formatStringProp);
                enumeration.pushInstance({
                    objectName: 'dataPoint',
                    displayName: label,
                    selector: selector,
                    properties: {
                        fill: { solid: { color: data.defaultSeriesColor || singleSeriesData[i].color } }
                    },
                });
            }
        }

        private enumerateDataLabels(enumeration: ObjectEnumerationBuilder): void {
            let data = this.data,
                labelSettings = this.data.dataLabelsSettings,
                seriesCount = data.series.length,
                showLabelPerSeries = !data.hasDynamicSeries && (seriesCount > 1 || !data.categoryMetadata) && this.seriesLabelFormattingEnabled;

            //Draw default settings
            dataLabelUtils.enumerateDataLabels(this.getLabelSettingsOptions(enumeration, labelSettings, null, showLabelPerSeries));

            if (seriesCount === 0)
                return;

            //Draw series settings
            if (showLabelPerSeries && labelSettings.showLabelPerSeries) {
                for (let i = 0; i < seriesCount; i++) {
                    let series = data.series[i],
                        labelSettings: VisualDataLabelsSettings = (series.labelSettings) ? series.labelSettings : this.data.dataLabelsSettings;

                    enumeration.pushContainer({ displayName: series.displayName });
                    dataLabelUtils.enumerateDataLabels(this.getLabelSettingsOptions(enumeration, labelSettings, series));
                    enumeration.popContainer();
                }
            }
        }

        private getLabelSettingsOptions(enumeration: ObjectEnumerationBuilder, labelSettings: VisualDataLabelsSettings, series?: LineChartSeries, showAll?: boolean): VisualDataLabelsSettingsOptions {
            return {
                enumeration: enumeration,
                dataLabelsSettings: labelSettings,
                show: true,
                displayUnits: true,
                precision: true,
                selector: series && series.identity ? series.identity.getSelector() : null,
                showAll: showAll,
                fontSize: true,
            };
        }

        public overrideXScale(xProperties: IAxisProperties): void {
            this.xAxisProperties = xProperties;
        }

        public onClearSelection(): void {
            if (this.interactivityService)
                this.interactivityService.clearSelection();
        }

        public render(suppressAnimations: boolean): CartesianVisualRenderResult {
            let duration = AnimatorCommon.GetAnimationDuration(this.animator, suppressAnimations);
            let result: CartesianVisualRenderResult;
            if (!this.isInteractiveChart) // If we're not a mobile interactive chart, use the new render path
                result = this.renderNew(duration);
            else // If not, use the old path kept around for mobile compatibility until mobile code can be moved and tested within the new render path
                result = this.renderOld(duration);

            // This should always be the last line in the render code.
            SVGUtil.flushAllD3TransitionsIfNeeded(this.options);

            return result;
        }

        private renderNew(duration: number): CartesianVisualRenderResult {
            let data = this.clippedData ? this.clippedData : this.data;
            if (!data)
                return;
            let isStackedArea = EnumExtensions.hasFlag(this.lineType, LineChartType.stackedArea);
            let margin = this.margin;
            let viewport = this.currentViewport;
            let height = viewport.height - (margin.top + margin.bottom);
            let width = viewport.width - (margin.left + margin.right);
            let xScale = this.xAxisProperties.scale;
            let yScale = this.yAxisProperties.scale;
            let horizontalOffset = LineChart.HorizontalShift + this.extraLineShift();

            let hasSelection = this.interactivityService && this.interactivityService.hasSelection();
            let renderAreas: boolean = EnumExtensions.hasFlag(this.lineType, LineChartType.area) || EnumExtensions.hasFlag(this.lineType, LineChartType.stackedArea);
            let area;
            let yDomain = yScale.domain();
            let xPosition = (d: LineChartDataPoint) => { return xScale(this.getXValue(d)) + horizontalOffset; };
            let y0Position = isStackedArea ? (d: LineChartDataPoint) => { return yScale(Math.max(d.stackedValue - d.value, yDomain[0])); } : (d: LineChartDataPoint) => height;
            let yPosition = isStackedArea ? (d: LineChartDataPoint) => { return yScale(d.stackedValue); } : (d: LineChartDataPoint) => { return yScale(d.value); };
            
            if (renderAreas) {
                area = d3.svg.area()
                    .x(xPosition)
                    .y0(y0Position)
                    .y1(yPosition)
                    .defined((d: LineChartDataPoint) => { return d.value !== null; });
            }

            let line = d3.svg.line()
                .x(xPosition)
                .y(yPosition)
                .defined((d: LineChartDataPoint) => {
                    return d.value !== null;
                });

            if (EnumExtensions.hasFlag(this.lineType, LineChartType.smooth)) {
                line.interpolate('basis');
                if (area) {
                    area.interpolate('basis');
                }
            }

            this.mainGraphicsContext
                .attr('height', height)
                .attr('width', width);
            let areas = undefined;
            // Render Areas
            if (renderAreas) {
                areas = this.mainGraphicsContext.selectAll(LineChart.CategoryAreaSelector.selector).data(data.series, (d: LineChartSeries) => d.identity.getKey());
                areas.enter()
                    .append(LineChart.PathElementName)
                    .classed(LineChart.CategoryAreaSelector.class, true);
                areas
                    .style('fill', (d: LineChartSeries) => d.color)
                    .style('fill-opacity', (d: LineChartSeries) => (hasSelection && !d.selected) ? LineChart.DimmedAreaFillOpacity : LineChart.AreaFillOpacity)
                    .transition()
                    .ease('linear')
                    .duration(duration)
                    .attr('d', (d: LineChartSeries) => area(d.data));
                areas.exit()
                    .remove();
            }
            
            // Render Lines
            let lines = this.mainGraphicsContext.selectAll(".line").data(data.series, (d: LineChartSeries) => d.identity.getKey());
            lines.enter()
                .append(LineChart.PathElementName)
                .classed('line', true);
            lines
                .style('stroke', (d: LineChartSeries) => d.color)
                .style('stroke-opacity', (d: LineChartSeries) => ColumnUtil.getFillOpacity(d.selected, false, hasSelection, false))
                .transition()
                .ease('linear')
                .duration(duration)
                .attr('d', (d: LineChartSeries) => {
                    return line(d.data);
                });
            lines.exit()
                .remove();            

            // Render extra lines that are wider and invisible used for better interactivity
            let interactivityLines;
            if (this.interactivityService) {
                interactivityLines = this.mainGraphicsContext.selectAll(".interactivity-line").data(data.series, (d: LineChartSeries) => d.identity.getKey());
                interactivityLines.enter()
                    .append(LineChart.PathElementName)
                    .classed('interactivity-line', true);
                interactivityLines
                    .attr('d', (d: LineChartSeries) => {
                        return line(d.data);
                    });
                interactivityLines.exit()
                    .remove();
            }

            // Prepare grouping for dots
            let dotGroups = this.mainGraphicsContext.selectAll(LineChart.CategorySelector.selector)
                .data(data.series, (d: LineChartSeries) => d.identity.getKey());

            dotGroups.enter()
                .append('g')
                .classed(LineChart.CategorySelector.class, true);

            dotGroups.exit()
                .remove();

            // Render dots
            let dots = dotGroups.selectAll(LineChart.CategoryValuePoint.selector)
                .data((series: LineChartSeries) => {
                    return series.data.filter((value: LineChartDataPoint, i: number) => {
                        return this.shouldDrawCircle(series, i);
                    });
                }, (d: LineChartDataPoint) => d.key);
            dots.enter()
                .append(LineChart.CircleElementName)
                .classed(LineChart.CategoryValuePoint.class, true);
            dots
                .style('fill', function () {
                    let lineSeries = d3.select(this.parentNode).datum();
                    return lineSeries.color;
                })
                .style('fill-opacity', function () {
                    let lineSeries = d3.select(this.parentNode).datum();
                    return ColumnUtil.getFillOpacity(lineSeries.selected, false, hasSelection, false);
                })
                .transition()
                .duration(duration)
                .attr({
                    cx: (d: LineChartDataPoint, i: number) => xScale(this.getXValue(d)) + horizontalOffset,
                    cy: (d: LineChartDataPoint, i: number) => yScale(d.value),
                    r: LineChart.CircleRadius
                });
            dots.exit()
                .remove();

            // Render highlights
            let highlights = dotGroups.selectAll(LineChart.CategoryPointSelector.selector)
                .data((series: LineChartSeries) => {
                    return _.filter(series.data, (value: LineChartDataPoint) => { return value.pointColor != null; });
                }, (d: LineChartDataPoint) => d.key);
            highlights.enter()
                .append(LineChart.CircleElementName)
                .classed(LineChart.CategoryPointSelector.class, true);
            highlights
                .style('fill', (d: LineChartDataPoint) => d.pointColor)
                .transition()
                .duration(duration)
                .attr({
                    cx: (d: LineChartDataPoint) => xScale(this.getXValue(d)),
                    cy: (d: LineChartDataPoint) => yScale(d.value),
                    r: LineChart.PointRadius
                });
            highlights.exit()
                .remove();
            
            // Add data labels
            let labelDataPoints: LabelDataPoint[] = [];
            if (data.dataLabelsSettings.show) {
                labelDataPoints = this.createLabelDataPoints();
            }

            let dataPointsToBind: SelectableDataPoint[] = undefined;
            let behaviorOptions: LineChartBehaviorOptions = undefined;
            if (this.interactivityService) {
                // Add tooltips
                if (!this.isComboChart) {
                    this.overlayRect
                        .attr({
                            x: 0,
                            width: width,
                            height: height
                        });

                    let seriesTooltipApplier = (tooltipEvent: TooltipEvent) => {
                        let pointX: number = tooltipEvent.elementCoordinates[0];
                        let index: number = this.findIndex(pointX);
                        let categoryData = this.selectColumnForToolTip(index);
                        return this.getSeriesTooltipInfo(categoryData);
                    };
                    
                    let clearHoverLine = () => {
                        this.hoverLine.style('opacity', SVGUtil.AlmostZero);
                        this.hoverLineContext.selectAll(LineChart.HoverLineCircleDot.selector).remove();
                    };

                    TooltipManager.addTooltip(this.mainGraphicsSVG, seriesTooltipApplier, true, clearHoverLine);
                } else {
                    let seriesTooltipApplier = (tooltipEvent: TooltipEvent) => {
                        let pointX: number = tooltipEvent.elementCoordinates[0];
                        return this.getTooltipInfoByPointX(tooltipEvent.data, pointX);
                    };

                    TooltipManager.addTooltip(interactivityLines, seriesTooltipApplier, true);
                    TooltipManager.addTooltip(dots, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo, true);
                    TooltipManager.addTooltip(highlights, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo, true);
                }

                // Register interactivity
                dataPointsToBind = data.series.slice();

                for (let i = 0, ilen = data.series.length; i < ilen; i++) {
                    dataPointsToBind = dataPointsToBind.concat(data.series[i].data);
                }

                behaviorOptions = {
                    lines: lines,
                    interactivityLines: interactivityLines,
                    dots: dots,
                    areas: areas,
                    tooltipOverlay: this.overlayRect,
                };
            }

            return { dataPoints: dataPointsToBind, behaviorOptions: behaviorOptions, labelDataPoints: labelDataPoints, labelsAreNumeric: true };
        }

        private renderOld(duration: number): CartesianVisualRenderResult {
            let data = this.clippedData ? this.clippedData : this.data;
            if (!data)
                return;

            let margin = this.margin;
            let viewport = this.currentViewport;
            let height = viewport.height - (margin.top + margin.bottom);
            let xScale = this.xAxisProperties.scale;
            let yScale = this.yAxisProperties.scale;

            let hasSelection = this.interactivityService && this.interactivityService.hasSelection();

            let area;
            if (EnumExtensions.hasFlag(this.lineType, LineChartType.area)) {
                area = d3.svg.area()
                    .x((d: LineChartDataPoint) => { return xScale(this.getXValue(d)); })
                    .y0(height)
                    .y1((d: LineChartDataPoint) => { return yScale(d.value); })
                    .defined((d: LineChartDataPoint) => { return d.value !== null; });
            }

            let line = d3.svg.line()
                .x((d: LineChartDataPoint) => {
                    return xScale(this.getXValue(d));
                })
                .y((d: LineChartDataPoint) => {
                    return yScale(d.value);
                })
                .defined((d: LineChartDataPoint) => {
                    return d.value !== null;
                });

            if (EnumExtensions.hasFlag(this.lineType, LineChartType.smooth)) {
                line.interpolate('basis');
                if (area) {
                    area.interpolate('basis');
                }
            }

            let extraLineShift = this.extraLineShift();

            this.mainGraphicsContext.attr('transform', SVGUtil.translate(LineChart.HorizontalShift + extraLineShift, 0));
            
            this.mainGraphicsContext.attr('height', this.getAvailableHeight())
                .attr('width', this.getAvailableWidth());
            this.hoverLineContext.attr('transform', SVGUtil.translate(LineChart.HorizontalShift + extraLineShift, 0));

            if (EnumExtensions.hasFlag(this.lineType, LineChartType.area)) {
                let catAreaSelect = this.mainGraphicsContext.selectAll(LineChart.CategoryAreaSelector.selector)
                    .data(data.series, (d: LineChartDataPoint) => d.identity.getKey());

                let catAreaEnter =
                    catAreaSelect
                        .enter().append('g')
                        .classed(LineChart.CategoryAreaSelector.class, true);

                catAreaEnter.append(LineChart.PathElementName);

                let catAreaUpdate = this.mainGraphicsContext.selectAll(LineChart.CategoryAreaSelector.selector);

                catAreaUpdate.select(LineChart.PathElementName)
                    .transition()
                    .ease('linear')
                    .duration(duration)
                    .attr('d', (d: LineChartSeries) => area(d.data))
                    .style('fill', (d: LineChartSeries) => d.color)
                    .style('fill-opacity', (d: LineChartSeries) => (hasSelection && !d.selected) ? LineChart.DimmedAreaFillOpacity : LineChart.AreaFillOpacity);

                catAreaSelect.exit().remove();
            }

            let catSelect = this.mainGraphicsContext.selectAll(LineChart.CategorySelector.selector)
                .data(data.series, (d: LineChartDataPoint) => d.identity.getKey());

            let catEnter = catSelect
                .enter()
                .append('g')
                .classed(LineChart.CategorySelector.class, true);

            catEnter.append(LineChart.PathElementName);
            catEnter.selectAll(LineChart.CategoryValuePoint.selector)
                .data((d: LineChartSeries) => d.data)
                .enter()
                .append(LineChart.CircleElementName)
                .classed(LineChart.CategoryValuePoint.class, true);

            // moving this up to avoid using the svg path generator with NaN values
            // do not move this without validating that no errors are thrown in the browser console
            catSelect.exit().remove();

            // add the drag handle, if needed
            if (this.isInteractiveChart && !this.dragHandle) {
                let handleTop = this.getAvailableHeight();
                this.dragHandle = this.hoverLineContext.append('circle')
                    .attr('cx', 0)
                    .attr('cy', handleTop)
                    .attr('r', '6px')
                    .classed('drag-handle', true);
            }

            // Create the selection circles 
            let linesCount = catSelect.data().length; // number of lines plotted
            while (this.selectionCircles.length < linesCount) {
                let addedCircle = this.hoverLineContext.append(LineChart.CircleElementName)
                    .classed(LineChart.CircleClassName, true)
                    .attr('r', LineChart.CircleRadius).style('opacity', 0);
                this.selectionCircles.push(addedCircle);
            }

            while (this.selectionCircles.length > linesCount) {
                this.selectionCircles.pop().remove();
            }

            let catUpdate = this.mainGraphicsContext.selectAll(LineChart.CategorySelector.selector);

            let lineSelection = catUpdate.select(LineChart.PathElementName)
                .classed('line', true)
                .style('stroke', (d: LineChartSeries) => d.color)
                .style('stroke-opacity', (d: LineChartSeries) => ColumnUtil.getFillOpacity(d.selected, false, hasSelection, false));
            lineSelection
                .transition()
                .ease('linear')
                .duration(duration)
                .attr('d', (d: LineChartSeries) => {
                    return line(d.data);
                });

            let that = this;
            let updateSelection = catUpdate.selectAll(LineChart.CategoryValuePoint.selector);
            let transitions = updateSelection
                .style('fill', function () {
                    let lineSeries = d3.select(this.parentNode).datum();
                    return lineSeries.color;
                })
                .style('fill-opacity', function () {
                    let lineSeries = d3.select(this.parentNode).datum();
                    return ColumnUtil.getFillOpacity(lineSeries.selected, false, hasSelection, false);
                })
                .transition()
                .duration(duration)
                .attr({
                    'cx': function (d: LineChartDataPoint, i: number) {
                        let lineSeries = d3.select(this.parentNode).datum();
                        let circleIndex = that.shouldDrawCircle(lineSeries, i);
                        return circleIndex ? xScale(that.getXValue(d)) : 0;
                    },
                    'cy': function (d: LineChartDataPoint, i: number) {
                        let lineSeries = d3.select(this.parentNode).datum();
                        let circleIndex = that.shouldDrawCircle(lineSeries, i);
                        return circleIndex ? yScale(d.value) : 0;
                    },
                    'r': function (d: LineChartDataPoint, i: number) {
                        let lineSeries = d3.select(this.parentNode).datum();
                        let circleIndex = that.shouldDrawCircle(lineSeries, i);
                        return circleIndex ? LineChart.CircleRadius : 0;
                    }
                });
            if (this.isInteractiveChart && this.hasDataPoint(data.series)) {
                let selectionSize = updateSelection.size();
                let endedTransitionCount = 0;
                transitions.each('end', () => {
                    // When transitions finish, and it's an interactive chart - select the first column (draw the legend and the handle)
                    endedTransitionCount++;
                    if (endedTransitionCount === selectionSize) { // all transitions had finished
                        this.selectColumn(0, true);
                    }
                });
            }

            if (data.dataLabelsSettings.show) {
                let layout = dataLabelUtils.getLineChartLabelLayout(xScale, yScale, data.dataLabelsSettings, data.isScalar, this.yAxisProperties.formatter);
                let dataPoints: LineChartDataPoint[] = [];

                for (let i = 0, ilen = data.series.length; i < ilen; i++) {
                    Array.prototype.push.apply(dataPoints, data.series[i].data);
                }

                dataLabelUtils.drawDefaultLabelsForDataPointChart(dataPoints, this.mainGraphicsSVG, layout, this.currentViewport);
                this.mainGraphicsSVG.select('.labels').attr('transform', SVGUtil.translate(LineChart.HorizontalShift + extraLineShift, 0));
            }
            else {
                dataLabelUtils.cleanDataLabels(this.mainGraphicsSVG);
            }

            TooltipManager.addTooltip(this.cartesainSVG, (tooltipEvent: TooltipEvent) => {
                let pointX: number = tooltipEvent.elementCoordinates[0];
                return this.getTooltipInfoByPointX(tooltipEvent.data, pointX);
            }, true);

            catSelect.exit().remove();

            return null; // This render path doesn't use the interactivity service
        }

        /**
         * Note: Static for tests.
         */
        public getSeriesTooltipInfo(pointData: HoverLineDataPoint[]): TooltipDataItem[] {

            let tooltipinfo: TooltipDataItem[] = [];
            let maxNumberOfItems = 10; // to limit the number of rows we display
            
            // count to the maximum number of rows we can display
            let count = 0;
            for (let point of pointData) {
                if (count >= maxNumberOfItems) break;
                if (point.value) {
                    tooltipinfo.push({
                        header: point.category,
                        color: point.color,
                        displayName: point.label,
                        value: point.measure
                    });
                    count++;
                }
            }

            return tooltipinfo;
        }

        public getTooltipInfoByPointX(pointData: any, pointX: number): TooltipDataItem[] {
            let index: number = this.findIndex(pointX);
            return pointData.data[index].tooltipInfo;
        }

        public getVisualCategoryAxisIsScalar(): boolean {
            return this.data ? this.data.isScalar : false;
        }

        public getSupportedCategoryAxisType(): string {
            let dvCategories = this.dataViewCat ? this.dataViewCat.categories : undefined;
            let categoryType = ValueType.fromDescriptor({ text: true });
            if (dvCategories && dvCategories.length > 0 && dvCategories[0].source && dvCategories[0].source.type)
                categoryType = dvCategories[0].source.type;

            let isOrdinal = AxisHelper.isOrdinal(categoryType);
            return isOrdinal ? axisType.categorical : axisType.both;
        }

        public getPreferredPlotArea(isScalar: boolean, categoryCount: number, categoryThickness: number): IViewport {
            return CartesianChart.getPreferredPlotArea(
                categoryCount,
                categoryThickness,
                this.currentViewport,
                this.isScrollable,
                isScalar);
        }

        private getCategoryCount(origCatgSize): number {
            let availableWidth = this.getAvailableWidth();
            let categoryThickness = CartesianChart.MinOrdinalRectThickness;
            return Math.min(Math.round((availableWidth - categoryThickness * CartesianChart.OuterPaddingRatio * 2) / categoryThickness), origCatgSize);
        }

        private getAvailableWidth(): number {
            return this.currentViewport.width - (this.margin.left + this.margin.right);
        }

        private getAvailableHeight(): number {
            return this.currentViewport.height - (this.margin.top + this.margin.bottom);
        }

        private static sliceSeries(series: LineChartSeries[], newLength: number, startIndex: number = 0): LineChartSeries[] {
            let newSeries: LineChartSeries[] = [];
            if (series && series.length > 0) {
                debug.assert(series[0].data.length >= newLength, "invalid newLength");
                for (let i = 0, len = series.length; i < len; i++) {
                    newSeries[i] = Prototype.inherit(series[i]);
                    newSeries[i].data = series[i].data.slice(startIndex, startIndex + newLength);
                }
            }
            return newSeries;
        }

        private extraLineShift(): number {
            if (!this.data.isScalar) {
                // This will place the line points in the middle of the bands
                // So they center with Labels when scale is ordinal.
                let xScale = <D3.Scale.OrdinalScale>this.xAxisProperties.scale;
                if (xScale.rangeBand)
                    return xScale.rangeBand() / 2;
            }
            return 0;
        }

        private hasDataPoint(series: LineChartSeries[]): boolean {
            if (series.length === 0)
                return false;
            for (let i = 0, len = series.length; i < len; i++) {
                if (series[i].data.length > 0)
                    return true;
            }
            return false;
        }

        private lookupXValue(index: number, type: ValueType): any {
            debug.assertValue(this.data, 'this.data');

            let isDateTime = AxisHelper.isDateTime(type);
            if (isDateTime && this.data.isScalar)
                return new Date(index);

            if (this.data && this.data.series && this.data.series.length > 0) {
                let firstSeries = this.data.series[0];
                if (firstSeries) {
                    let data = firstSeries.data;
                    if (data) {
                        let dataAtIndex = data[index];
                        if (dataAtIndex) {
                            if (isDateTime)
                                return new Date(dataAtIndex.categoryValue);
                            return dataAtIndex.categoryValue;
                        }
                    }
                }
            }

            return index;
        }

        private getXValue(d: LineChartDataPoint): any {
            return this.data.isScalar ? d.categoryValue : d.categoryIndex;
        }

        /**
          * This checks to see if a data point is isolated, which means
          * the previous and next data point are both null.
          */
        private shouldDrawCircle(d: LineChartSeries, i: number): boolean {
            let dataLength = d.data.length;
            let isLastPoint = i === (dataLength - 1);
            let isFirstPoint = i === 0;

            if (i > dataLength - 1 || d.data[i] === null || d.data[i].value === null)
                return false;

            if (isFirstPoint && isLastPoint)
                return true;
            if (isFirstPoint && dataLength > 1 && d.data[i + 1].value === null)
                return true;
            if (!isFirstPoint && isLastPoint && d.data[i - 1].value === null)
                return true;
            if (!isFirstPoint && !isLastPoint && d.data[i - 1].value === null && d.data[i + 1].value === null)
                return true;
            return false;
        }

        public selectColumnForToolTip(columnIndex: number, force: boolean = false) {
            let horizontalOffset = LineChart.HorizontalShift + this.extraLineShift();
            let x = this.getChartX(columnIndex) + horizontalOffset;

            let dataPoints = this.createTooltipDataPoints(columnIndex);
            this.setHoverLineForToolTip(x);
            this.setDotsForToolTip(x, dataPoints);

            return dataPoints;
        }

        private setHoverLineForToolTip(chartX: number) {
            chartX = chartX || 0;
            this.hoverLine
                .attr('x1', chartX)
                .attr('x2', chartX)
                .attr("y1", 0)
                .attr("y2", this.getAvailableHeight())
                .style('opacity', 1);
        }

        private setDotsForToolTip(chartX: number, dataPoints: HoverLineDataPoint[]) {
            let tooltipDots = this.hoverLineContext.selectAll(LineChart.HoverLineCircleDot.selector).data(dataPoints);
            tooltipDots
                .enter()
                .append(LineChart.CircleElementName)
                .classed(LineChart.HoverLineCircleDot.class, true);
            tooltipDots
                .filter(d => d.value)
                .attr('fill', d => d.color)
                .attr("r", 3)
                .attr("cx", chartX)
                .attr("cy", d => this.yAxisProperties.scale(d.value));
            tooltipDots.exit().remove();
        }

        /**
         * Updates the hover line and the legend with the selected colums (given by columnIndex).
         * This is for the Mobile renderer with InteractiveLegend
         */
        public selectColumn(columnIndex: number, force: boolean = false) {
            if (!force && this.lastInteractiveSelectedColumnIndex === columnIndex) return; // same column, nothing to do here

            this.lastInteractiveSelectedColumnIndex = columnIndex;
            let x = this.getChartX(columnIndex);
            this.setHoverLine(x);
            let legendItems = this.createLegendDataPoints(columnIndex);
            this.options.cartesianHost.updateLegend(legendItems);
        }

        private setHoverLine(chartX: number) {
            this.hoverLine
                .attr('x1', chartX)
                .attr('x2', chartX)
                .attr("y1", 0).attr("y2", this.getAvailableHeight())
                .style('opacity', 1);

            let that = this;
            this.mainGraphicsContext
                .selectAll(LineChart.CategorySelector.selector)
                .selectAll(LineChart.PathElementName)
                .each(function (series: LineChartSeries) {
                    // Get the item color for the handle dots
                    let color = series.color;
                    let circleToChange = that.selectionCircles[series.lineIndex];

                    circleToChange
                        .attr({
                            'cx': chartX,
                            'cy': () => {
                                let pathElement = d3.select(this).node<D3.D3Element>();
                                let pos = that.getPosition(chartX, pathElement);
                                return pos.y;
                            }
                        })
                        .style({
                            'opacity': 1,
                            'fill': color
                        });

                    if (that.dragHandle) that.dragHandle.attr('cx', chartX);
                });
        }

        private getChartX(columnIndex: number) {
            let x: number;
            if (this.data.isScalar) {
                x = Math.max(0, this.xAxisProperties.scale(this.data.categoryData[columnIndex].categoryValue));
            } else {
                x = Math.max(0, this.xAxisProperties.scale(columnIndex));
            }

            let rangeEnd = powerbi.visuals.AxisHelper.extent(this.xAxisProperties.scale)[1];

            x = Math.min(x, rangeEnd);
            if (isNaN(x)) {
                return;
            }
            return x;
        }

        /**
         * Finds the index of the category of the given x coordinate given.
         */
        private findIndex(pointX: number): number {
            // we are using mouse coordinates that do not know about any potential CSS transform scale
            let svgNode = <SVGSVGElement>(this.mainGraphicsSVG.node());
            let ratios = SVGUtil.getTransformScaleRatios(svgNode);
            if (ratios.x > 1.00001 || ratios.x < 0.99999 ) {
                pointX = pointX / ratios.x;
            }

            let scaleX = powerbi.visuals.AxisHelper.invertScale(this.xAxisProperties.scale, pointX);
            if (this.data.isScalar) {
                scaleX = AxisHelper.findClosestXAxisIndex(scaleX, this.data.categoryData);
            }
            
            return scaleX;
        }

        private getPosition(x: number, pathElement: D3.D3Element): SVGPoint {
            let pathLength = pathElement.getTotalLength();
            let pos: SVGPoint;
            let beginning = 0, end = pathLength, target;

            while (true) {
                target = Math.floor((beginning + end) / 2);
                pos = pathElement.getPointAtLength(target);
                SVGUtil.ensureValidSVGPoint(pos);
                if ((target === end || target === beginning) && pos.x !== x)
                    break;
                if (pos.x > x) end = target;
                else if (pos.x < x) beginning = target;
                else
                    break;
            }
            return pos;
        }

        private createTooltipDataPoints(columnIndex: number): HoverLineDataPoint[] {
            let data = this.data;
            if (!data || data.series.length === 0)
                return null;

            let dataPoints: HoverLineDataPoint[] = [];
            let category: any;

            let categoryDataPoint: LineChartDataPoint = data.categoryData[columnIndex];
            let isDateTime: boolean = AxisHelper.isDateTime(this.xAxisProperties.axisType);
            if (this.data.isScalar) {
                if (isDateTime) {
                    category = this.lookupXValue(categoryDataPoint.categoryValue, this.xAxisProperties.axisType);
                }
                else {
                    category = categoryDataPoint.categoryValue;
                }
            }
            else {
                category = this.lookupXValue(columnIndex, this.xAxisProperties.axisType);
            }

            let formatStringProp = lineChartProps.general.formatString;

            for (let series of data.series) {
                let lineData = series.data;
                let lineDataPoint = lineData.filter((data) => {
                    if (this.data.isScalar)
                        return data.categoryValue === categoryDataPoint.categoryValue;
                    else
                        return data.categoryIndex === columnIndex;
                })[0];

                let measure = lineDataPoint && lineDataPoint.value;
                if (measure) {
                    let label = converterHelper.getFormattedLegendLabel(series.yCol, this.dataViewCat.values, formatStringProp);
                    dataPoints.push({
                        color: series.color,
                        label: label,
                        category: valueFormatter.format(category, valueFormatter.getFormatString(series.xCol, formatStringProp)),
                        measure: valueFormatter.format(measure, valueFormatter.getFormatString(series.yCol, formatStringProp)),
                        value: measure
                    });
                }
            }

            return dataPoints;
        }

        private createLegendDataPoints(columnIndex: number): LegendData {
            let data = this.data;
            if (!data || !data.series || data.series.length < 1)
                return null;

            let legendDataPoints: LegendDataPoint[] = [];
            let category: any;

            // 'category' and 'measure' are only for Mobile interactive legend, Minerva legend does not need them
            let categoryDataPoint: LineChartDataPoint = data.categoryData[columnIndex];
            if (this.isInteractiveChart && categoryDataPoint) {
                if (this.data.isScalar) {
                    category = categoryDataPoint.categoryValue;
                    let isDateTime = AxisHelper.isDateTime(this.xAxisProperties.axisType);
                    if (isDateTime)
                        category = new Date(category);
                }
                else {
                    category = this.lookupXValue(columnIndex, this.xAxisProperties.axisType);
                }
            }

            let formatStringProp = lineChartProps.general.formatString;
            let seriesYCol: DataViewMetadataColumn = null;
            // iterating over the line data (i is for a line)
            for (let i = 0, len = data.series.length; i < len; i++) {
                let series = data.series[i];
                let lineData = series.data;

                // 'category' and 'measure' are only for Mobile interactive legend, Minerva legend does not need them
                let measure: any;
                if (this.isInteractiveChart) {
                    let lineDataPoint;
                    if (this.data.isScalar) {
                        // TODO: search for matching x-value
                        let targetCategoryValue = categoryDataPoint.categoryValue;
                        for (let i = 0; i < lineData.length; i++) {
                            if (lineData[i].categoryValue === targetCategoryValue) {
                                lineDataPoint = lineData[i];
                                break;
                            }
                        }
                    }
                    else {
                        // ordinal series share x-indicies
                        lineDataPoint = lineData[columnIndex];
                    }
                    measure = lineDataPoint && lineDataPoint.value;
                }

                let label = converterHelper.getFormattedLegendLabel(series.yCol, this.dataViewCat.values, formatStringProp);
                seriesYCol = series.yCol;
                legendDataPoints.push({
                    color: series.color,
                    icon: LegendIcon.Line,
                    label: label,
                    // TODO: category: CartesianChartInteractiveLegend only needs one category value for part of the Title, we don't need to put it on each point.
                    category: valueFormatter.format(category, valueFormatter.getFormatString(series.xCol, formatStringProp)),
                    measure: valueFormatter.format(measure, valueFormatter.getFormatString(series.yCol, formatStringProp)),
                    identity: series.identity,
                    selected: series.selected,
                });
            }

            let dvValues = this.dataViewCat ? this.dataViewCat.values : null;
            let title = dvValues && dvValues.source ? dvValues.source.displayName : "";
            return {
                title: title,
                dataPoints: legendDataPoints
            };
        }

        private createLabelDataPoints(): LabelDataPoint[] {
            let xScale = this.xAxisProperties.scale;
            let yScale = this.yAxisProperties.scale;
            let horizontalOffset = LineChart.HorizontalShift + this.extraLineShift();
            let labelDataPoints: LabelDataPoint[] = [];
            let data = this.data;
            let series = data.series;
            let formattersCache = NewDataLabelUtils.createColumnFormatterCacheManager();        
            let isStackedArea = EnumExtensions.hasFlag(this.lineType, LineChartType.stackedArea);
            
            for (let currentSeries of series) {
                let labelSettings = (currentSeries.labelSettings) ? currentSeries.labelSettings : data.dataLabelsSettings;
                if (!labelSettings.show)
                    continue;

                let axisFormatter: number = NewDataLabelUtils.getDisplayUnitValueFromAxisFormatter(this.yAxisProperties.formatter, labelSettings);
                let dataPoints = currentSeries.data;
                let categoryIndex = 0;
                for (let dataPoint of dataPoints) {
                    if (dataPoint.value === null || dataPoint.value === undefined) {
                        categoryIndex++;
                        continue;
                    }
                    let formatString = "";
                    formatString = dataPoint.labelFormatString;
                    let formatter = formattersCache.getOrCreate(formatString, labelSettings, axisFormatter);
                    let text = NewDataLabelUtils.getLabelFormattedText(formatter.format(dataPoint.value));

                    let properties: TextProperties = {
                        text: text,
                        fontFamily: NewDataLabelUtils.LabelTextProperties.fontFamily,
                        fontSize: PixelConverter.fromPoint(labelSettings.fontSize),
                        fontWeight: NewDataLabelUtils.LabelTextProperties.fontWeight,
                    };
                    let textWidth = TextMeasurementService.measureSvgTextWidth(properties);
                    let textHeight = TextMeasurementService.estimateSvgTextHeight(properties, true /* tightFitForNumeric */);   
                    let parentShape: LabelParentRect | LabelParentPoint;
                    let isParentRect: boolean = false;

                    if (isStackedArea) { 
                        parentShape = {
                            rect: {
                                left: xScale(this.getXValue(dataPoint)),
                                top: yScale(Math.max(dataPoint.stackedValue, dataPoint.stackedValue - dataPoint.value)),
                                width: horizontalOffset * 2,
                                height: Math.abs(yScale(dataPoint.stackedValue) - yScale(dataPoint.stackedValue - dataPoint.value))
                            },
                            orientation: dataPoint.value >= 0 ? NewRectOrientation.VerticalBottomBased : NewRectOrientation.VerticalTopBased,
                            validPositions: LineChart.validStackedLabelPositions,
                        };

                        isParentRect = true;
                    }
                    else {
                        parentShape = {
                            point: {
                                x: xScale(this.getXValue(dataPoint)) + horizontalOffset,
                                y: yScale(dataPoint.value),
                            },
                            radius: 0,
                            validPositions: LineChart.validLabelPositions,
                        };                        
                    }
                    
                    labelDataPoints.push({
                        isPreferred: true,
                        text: text,
                        textSize: {
                            width: textWidth,
                            height: textHeight,
                        },
                        outsideFill: labelSettings.labelColor ? labelSettings.labelColor : NewDataLabelUtils.defaultLabelColor,
                        insideFill: labelSettings.labelColor && isStackedArea ? labelSettings.labelColor : NewDataLabelUtils.defaultInsideLabelColor,
                        isParentRect: isParentRect,
                        parentShape: parentShape,
                        fontSize: labelSettings.fontSize,
                        identity: undefined,
                    });

                    categoryIndex++;
                }
            }

            return labelDataPoints;
        }
        
        /**
         * Obtains the pointLabelPosition for the category index within the given series
         * 
         * Rules for line chart data labels:
         * 1. Top and bottom > left and right
         * 2. Top > bottom unless we're at a local minimum
         * 3. Right > left unless:
         *    a. There is no data point to the left and there is one to the right
         *    b. There is an equal data point to the right, but not to the left
         */
        //private getValidLabelPositions(series: LineChartSeries, categoryIndex: number): NewPointLabelPosition[]{
        //    let data = series.data;
        //    let dataLength = data.length;
        //    let isLastPoint = categoryIndex === (dataLength - 1);
        //    let isFirstPoint = categoryIndex === 0;
            
        //    let currentValue = data[categoryIndex].value;
        //    let previousValue = !isFirstPoint ? data[categoryIndex - 1].value : undefined;
        //    let nextValue = !isLastPoint ? data[categoryIndex + 1].value : undefined;
        //    let previousRelativePosition = LineChartRelativePosition.equal;
        //    let nextRelativePosition = LineChartRelativePosition.equal;
        //    if (previousValue === null || previousValue === undefined) {
        //        previousRelativePosition = LineChartRelativePosition.none;
        //    }
        //    else if (previousValue > currentValue) {
        //        previousRelativePosition = LineChartRelativePosition.greater;
        //    }
        //    else if (previousValue < currentValue) {
        //        previousRelativePosition = LineChartRelativePosition.lesser;
        //    }
        //    if (nextValue === null || nextValue === undefined) {
        //        nextRelativePosition = LineChartRelativePosition.none;
        //    }
        //    else if (nextValue > currentValue) {
        //        nextRelativePosition = LineChartRelativePosition.greater;
        //    }
        //    else if (nextValue < currentValue) {
        //        nextRelativePosition = LineChartRelativePosition.lesser;
        //    }

        //    switch (previousRelativePosition) {
        //        case LineChartRelativePosition.none:
        //            switch (nextRelativePosition) {
        //                case LineChartRelativePosition.none:
        //                    return [NewPointLabelPosition.Above, NewPointLabelPosition.Below, NewPointLabelPosition.Right, NewPointLabelPosition.Left];
        //                case LineChartRelativePosition.equal:
        //                    return [NewPointLabelPosition.Above, NewPointLabelPosition.Below, NewPointLabelPosition.Left, NewPointLabelPosition.Right];
        //                case LineChartRelativePosition.greater:
        //                    return [NewPointLabelPosition.Below, NewPointLabelPosition.Above, NewPointLabelPosition.Left, NewPointLabelPosition.Right];
        //                case LineChartRelativePosition.lesser:
        //                    return [NewPointLabelPosition.Above, NewPointLabelPosition.Below, NewPointLabelPosition.Left, NewPointLabelPosition.Right];
        //            }
        //        case LineChartRelativePosition.equal:
        //            switch (nextRelativePosition) {
        //                case LineChartRelativePosition.none:
        //                    return [NewPointLabelPosition.Above, NewPointLabelPosition.Below, NewPointLabelPosition.Right, NewPointLabelPosition.Left];
        //                case LineChartRelativePosition.equal:
        //                    return [NewPointLabelPosition.Above, NewPointLabelPosition.Below, NewPointLabelPosition.Right, NewPointLabelPosition.Left];
        //                case LineChartRelativePosition.greater:
        //                    return [NewPointLabelPosition.Below, NewPointLabelPosition.Above, NewPointLabelPosition.Right, NewPointLabelPosition.Left];
        //                case LineChartRelativePosition.lesser:
        //                    return [NewPointLabelPosition.Above, NewPointLabelPosition.Below, NewPointLabelPosition.Right, NewPointLabelPosition.Left];
        //            }
        //        case LineChartRelativePosition.greater:
        //            switch (nextRelativePosition) {
        //                case LineChartRelativePosition.none:
        //                    return [NewPointLabelPosition.Below, NewPointLabelPosition.Above, NewPointLabelPosition.Right, NewPointLabelPosition.Left];
        //                case LineChartRelativePosition.equal:
        //                    return [NewPointLabelPosition.Below, NewPointLabelPosition.Above, NewPointLabelPosition.Left, NewPointLabelPosition.Right];
        //                case LineChartRelativePosition.greater:
        //                    return [NewPointLabelPosition.Below, NewPointLabelPosition.Above, NewPointLabelPosition.Right, NewPointLabelPosition.Left];
        //                case LineChartRelativePosition.lesser:
        //                    return [NewPointLabelPosition.Above, NewPointLabelPosition.Below, NewPointLabelPosition.Right, NewPointLabelPosition.Left];
        //            }
        //        case LineChartRelativePosition.lesser:
        //            switch (nextRelativePosition) {
        //                case LineChartRelativePosition.none:
        //                    return [NewPointLabelPosition.Above, NewPointLabelPosition.Below, NewPointLabelPosition.Right, NewPointLabelPosition.Left];
        //                case LineChartRelativePosition.equal:
        //                    return [NewPointLabelPosition.Above, NewPointLabelPosition.Below, NewPointLabelPosition.Left, NewPointLabelPosition.Right];
        //                case LineChartRelativePosition.greater:
        //                    return [NewPointLabelPosition.Above, NewPointLabelPosition.Below, NewPointLabelPosition.Right, NewPointLabelPosition.Left];
        //                case LineChartRelativePosition.lesser:
        //                    return [NewPointLabelPosition.Above, NewPointLabelPosition.Below, NewPointLabelPosition.Right, NewPointLabelPosition.Left];
        //            }
        //    }
        //}
    }
}