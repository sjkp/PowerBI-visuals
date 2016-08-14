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
    import PixelConverter = jsCommon.PixelConverter;

    export class ClusteredColumnChartStrategy implements IColumnChartStrategy {
        private static classes = {
            item: {
                class: 'column',
                selector: '.column',
            },
        };

        private data: ColumnChartData;
        private graphicsContext: ColumnChartContext;
        private seriesOffsetScale: D3.Scale.OrdinalScale;
        private width: number;
        private height: number;
        private margin: IMargin;
        private xProps: IAxisProperties;
        private yProps: IAxisProperties;
        private categoryLayout: CategoryLayout;
        private viewportHeight: number;
        private viewportWidth: number;
        private columnsCenters: number[];
        private columnSelectionLineHandle: D3.Selection;
        private animator: IColumnChartAnimator;
        private interactivityService: IInteractivityService;
        private layout: IColumnLayout;
        private isComboChart: boolean;

        public setupVisualProps(columnChartProps: ColumnChartContext): void {
            this.graphicsContext = columnChartProps;
            this.margin = columnChartProps.margin;
            this.width = this.graphicsContext.width;
            this.height = this.graphicsContext.height;
            this.categoryLayout = columnChartProps.layout;
            this.animator = columnChartProps.animator;
            this.interactivityService = columnChartProps.interactivityService;
            this.viewportHeight = columnChartProps.viewportHeight;
            this.viewportWidth = columnChartProps.viewportWidth;
            this.isComboChart = columnChartProps.isComboChart;
        }

        public setData(data: ColumnChartData) {
            this.data = data;
        }

        public setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureXDomain?: NumberRange): IAxisProperties {
            let width = this.width;

            let forcedXMin, forcedXMax;

            if (forcedXDomain && forcedXDomain.length === 2) {
                forcedXMin = forcedXDomain[0];
                forcedXMax = forcedXDomain[1];
            }

            let props = this.xProps = ColumnUtil.getCategoryAxis(
                this.data,
                width,
                this.categoryLayout,
                false,
                forcedXMin,
                forcedXMax,
                axisScaleType,
                axisDisplayUnits,
                axisPrecision,
                ensureXDomain);

            // create clustered offset scale
            let seriesLength = this.data.series.length;
            let columnWidth = (this.categoryLayout.categoryThickness * (1 - CartesianChart.InnerPaddingRatio)) / seriesLength;
            this.seriesOffsetScale = d3.scale.ordinal()
                .domain(this.data.series.map(s => s.index))
                .rangeBands([0, seriesLength * columnWidth]);

            return props;
        }

        public setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureYDomain?: NumberRange): IAxisProperties {
            debug.assert(!is100Pct, 'Cannot have 100% clustered chart.');

            let height = this.viewportHeight;
            let valueDomain = AxisHelper.createValueDomain(this.data.series, true) || emptyDomain;
            let combinedDomain = AxisHelper.combineDomain(forcedYDomain, valueDomain, ensureYDomain);
            let shouldClamp = AxisHelper.scaleShouldClamp(combinedDomain, valueDomain);

            this.yProps = AxisHelper.createAxis({
                pixelSpan: height,
                dataDomain: combinedDomain,
                metaDataColumn: this.data.valuesMetadata[0],
                formatString: valueFormatter.getFormatString(this.data.valuesMetadata[0], columnChartProps.general.formatString),
                outerPadding: 0,
                isScalar: true,
                isVertical: true,
                forcedTickCount: forcedTickCount,
                useTickIntervalForDisplayUnits: true,
                isCategoryAxis: false,
                scaleType: axisScaleType,
                axisDisplayUnits: axisDisplayUnits,
                axisPrecision: axisPrecision,
                shouldClamp: shouldClamp,
            });

            return this.yProps;
        }

        public drawColumns(useAnimation: boolean): ColumnChartDrawInfo {
            let data = this.data;
            debug.assertValue(data, 'data could not be null or undefined');

            this.columnsCenters = null; // invalidate the columnsCenters so that will be calculated again

            let categoryWidth = (this.categoryLayout.categoryThickness * (1 - CartesianChart.InnerPaddingRatio));
            let columnWidth = categoryWidth / data.series.length;
            let axisOptions: ColumnAxisOptions = {
                columnWidth: columnWidth,
                categoryWidth: categoryWidth,
                xScale: this.xProps.scale,
                yScale: this.yProps.scale,
                seriesOffsetScale: this.seriesOffsetScale,
                isScalar: this.categoryLayout.isScalar,
                margin: this.margin,
            };
            let clusteredColumnLayout = this.layout = ClusteredColumnChartStrategy.getLayout(data, axisOptions);
            let dataLabelSettings = data.labelSettings;
            let labelDataPoints: LabelDataPoint[] = [];
            if (dataLabelSettings && dataLabelSettings.show) {
                labelDataPoints = this.createLabelDataPoints();
            }

            let result: ColumnChartAnimationResult;
            let shapes: D3.UpdateSelection;
            let series = ColumnUtil.drawSeries(data, this.graphicsContext.mainGraphicsContext, axisOptions);
            if (this.animator && useAnimation) {
                result = this.animator.animate({
                    viewModel: data,
                    series: series,
                    layout: clusteredColumnLayout,
                    itemCS: ClusteredColumnChartStrategy.classes.item,
                    interactivityService: this.interactivityService,
                    mainGraphicsContext: this.graphicsContext.mainGraphicsContext,
                    viewPort: { height: this.height, width: this.width }
                });
                shapes = result.shapes;
            }
            if (!this.animator || !useAnimation || result.failed) {
                shapes = ColumnUtil.drawDefaultShapes(data, series, clusteredColumnLayout, ClusteredColumnChartStrategy.classes.item, !this.animator, this.interactivityService && this.interactivityService.hasSelection());
            }

            ColumnUtil.applyInteractivity(shapes, this.graphicsContext.onDragStart);

            return {
                eventGroup: this.graphicsContext.mainGraphicsContext,
                shapesSelection: shapes,
                viewport: { height: this.height, width: this.width },
                axisOptions: axisOptions,
                labelDataPoints: labelDataPoints,
            };
        }

        public selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void {
            ColumnUtil.setChosenColumnOpacity(this.graphicsContext.mainGraphicsContext, ClusteredColumnChartStrategy.classes.item.selector, selectedColumnIndex, lastSelectedColumnIndex);
            this.moveHandle(selectedColumnIndex);
        }

        public getClosestColumnIndex(x: number, y: number): number {
            return ColumnUtil.getClosestColumnIndex(x, this.getColumnsCenters());
        }

        /**
         * Get the chart's columns centers (x value).
         */
        private getColumnsCenters(): number[] {
            if (!this.columnsCenters) { // lazy creation
                let categoryWidth: number = this.categoryLayout.categoryThickness * (1 - CartesianChart.InnerPaddingRatio);
                // use the axis scale and first series data to get category centers
                if (this.data.series.length > 0) {
                    let xScaleOffset = 0;
                    if (!this.categoryLayout.isScalar)
                        xScaleOffset = categoryWidth / 2;
                    let firstSeries = this.data.series[0];
                    this.columnsCenters = firstSeries.data.map(d => this.xProps.scale(this.categoryLayout.isScalar ? d.categoryValue : d.categoryIndex) + xScaleOffset);
                }
            }
            return this.columnsCenters;
        }

        private moveHandle(selectedColumnIndex: number) {
            let columnCenters = this.getColumnsCenters();
            let x = columnCenters[selectedColumnIndex];

            let hoverLine = d3.select('.interactive-hover-line');
            if (!hoverLine.empty() && !this.columnSelectionLineHandle) {

                this.columnSelectionLineHandle = d3.select(hoverLine.node().parentNode);
            }

            if (!this.columnSelectionLineHandle) {
                let handle = this.columnSelectionLineHandle = this.graphicsContext.unclippedGraphicsContext.append('g');
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
                let handle = this.columnSelectionLineHandle;
                handle.select('line').attr({ x1: x, x2: x });
                handle.select('circle').attr({ cx: x });
            }
        }

        public static getLayout(data: ColumnChartData, axisOptions: ColumnAxisOptions): IColumnLayout {
            let columnWidth = axisOptions.columnWidth;
            let halfColumnWidth = 0.5 * columnWidth;
            let quarterColumnWidth = halfColumnWidth / 2;
            let isScalar = axisOptions.isScalar;
            let xScale = axisOptions.xScale;
            let yScale = axisOptions.yScale;
            let seriesOffsetScale = axisOptions.seriesOffsetScale;
            let scaledY0 = yScale(0);
            let xScaleOffset = 0;

            if (isScalar)
                xScaleOffset = axisOptions.categoryWidth / 2;

            return {
                shapeLayout: {
                    width: (d: ColumnChartDataPoint) => d.drawThinner ? halfColumnWidth : columnWidth,
                    x: (d: ColumnChartDataPoint) => xScale(isScalar ? d.categoryValue : d.categoryIndex) + seriesOffsetScale(d.seriesIndex) - xScaleOffset + (d.drawThinner ? quarterColumnWidth : 0),
                    y: (d: ColumnChartDataPoint) => scaledY0 + AxisHelper.diffScaled(yScale, Math.max(0, d.value), 0),
                    height: (d: ColumnChartDataPoint) => Math.abs(AxisHelper.diffScaled(yScale, 0, d.value)),
                },
                shapeLayoutWithoutHighlights: {
                    width: (d: ColumnChartDataPoint) => columnWidth,
                    x: (d: ColumnChartDataPoint) => xScale(isScalar ? d.categoryValue : d.categoryIndex) + seriesOffsetScale(d.seriesIndex) - xScaleOffset,
                    y: (d: ColumnChartDataPoint) => scaledY0 + AxisHelper.diffScaled(yScale, Math.max(0, d.originalValue), 0),
                    height: (d: ColumnChartDataPoint) => Math.abs(AxisHelper.diffScaled(yScale, 0, d.originalValue)),
                },
                zeroShapeLayout: {
                    width: (d: ColumnChartDataPoint) => d.drawThinner ? halfColumnWidth : columnWidth,
                    x: (d: ColumnChartDataPoint) => xScale(isScalar ? d.categoryValue : d.categoryIndex) + seriesOffsetScale(d.seriesIndex) - xScaleOffset + (d.drawThinner ? quarterColumnWidth : 0),
                    y: (d: ColumnChartDataPoint) => scaledY0,
                    height: (d: ColumnChartDataPoint) => 0,
                },
            };
        }

        private createLabelDataPoints(): LabelDataPoint[] {
            let labelDataPoints: LabelDataPoint[] = [];
            let data = this.data;
            let series = data.series;
            let formattersCache = NewDataLabelUtils.createColumnFormatterCacheManager();
            let shapeLayout = this.layout.shapeLayout;

            for (let currentSeries of series) {
                let labelSettings = currentSeries.labelSettings ? currentSeries.labelSettings : data.labelSettings;
                if (!labelSettings.show)
                    continue;

                let axisFormatter: number = NewDataLabelUtils.getDisplayUnitValueFromAxisFormatter(this.yProps.formatter, labelSettings);
                for (let dataPoint of currentSeries.data) {
                    if ((data.hasHighlights && !dataPoint.highlight) || dataPoint.value == null) {
                        continue;
                    }

                    // Calculate parent rectangle
                    let parentRect: IRect = {
                        left: shapeLayout.x(dataPoint),
                        top: shapeLayout.y(dataPoint),
                        width: shapeLayout.width(dataPoint),
                        height: shapeLayout.height(dataPoint),
                    };

                    // Calculate label text
                    let formatString = dataPoint.labelFormatString;
                    let formatter = formattersCache.getOrCreate(formatString, labelSettings, axisFormatter);
                    let text = NewDataLabelUtils.getLabelFormattedText(formatter.format(dataPoint.value));

                    // Calculate text size
                    let properties: TextProperties = {
                        text: text,
                        fontFamily: NewDataLabelUtils.LabelTextProperties.fontFamily,
                        fontSize: PixelConverter.fromPoint(labelSettings.fontSize || NewDataLabelUtils.DefaultLabelFontSizeInPt),
                        fontWeight: NewDataLabelUtils.LabelTextProperties.fontWeight,
                    };
                    let textWidth = TextMeasurementService.measureSvgTextWidth(properties);
                    let textHeight = TextMeasurementService.estimateSvgTextHeight(properties, true /* tightFitForNumeric */);

                    labelDataPoints.push({
                        isPreferred: true,
                        text: text,
                        textSize: {
                            width: textWidth,
                            height: textHeight,
                        },
                        outsideFill: ColumnChart.getLabelFill(labelSettings.labelColor, false, this.isComboChart),
                        insideFill: ColumnChart.getLabelFill(labelSettings.labelColor, true, this.isComboChart),
                        parentType: LabelDataPointParentType.Rectangle,
                        parentShape: {
                            rect: parentRect,
                            orientation: dataPoint.value >= 0 ? NewRectOrientation.VerticalBottomBased : NewRectOrientation.VerticalTopBased,
                            validPositions: ColumnChart.clusteredValidLabelPositions,
                        },
                        identity: dataPoint.identity,
                        fontSize: labelSettings.fontSize || NewDataLabelUtils.DefaultLabelFontSizeInPt,
                    });
                }
            }

            return labelDataPoints;
        }
    }

    export class ClusteredBarChartStrategy implements IColumnChartStrategy {
        private static classes = {
            item: {
                class: 'bar',
                selector: '.bar'
            },
        };

        private data: ColumnChartData;
        private graphicsContext: ColumnChartContext;
        private seriesOffsetScale: D3.Scale.OrdinalScale;
        private width: number;
        private height: number;
        private margin: IMargin;
        private xProps: IAxisProperties;
        private yProps: IAxisProperties;
        private categoryLayout: CategoryLayout;
        private viewportHeight: number;
        private viewportWidth: number;
        private barsCenters: number[];
        private columnSelectionLineHandle: D3.Selection;
        private animator: IColumnChartAnimator;
        private interactivityService: IInteractivityService;
        private layout: IColumnLayout;
        private isComboChart: boolean;

        public setupVisualProps(barChartProps: ColumnChartContext): void {
            this.graphicsContext = barChartProps;
            this.margin = barChartProps.margin;
            this.width = this.graphicsContext.width;
            this.height = this.graphicsContext.height;
            this.categoryLayout = barChartProps.layout;
            this.animator = barChartProps.animator;
            this.interactivityService = barChartProps.interactivityService;
            this.viewportHeight = barChartProps.viewportHeight;
            this.viewportWidth = barChartProps.viewportWidth;
            this.isComboChart = barChartProps.isComboChart;
        }

        public setData(data: ColumnChartData) {
            this.data = data;
        }

        public setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureYDomain?: NumberRange): IAxisProperties {
            let height = this.height;
            let forcedYMin, forcedYMax;

            if (forcedYDomain && forcedYDomain.length === 2) {
                forcedYMin = forcedYDomain[0];
                forcedYMax = forcedYDomain[1];
            }

            let props = this.yProps = ColumnUtil.getCategoryAxis(
                this.data,
                height,
                this.categoryLayout,
                true,
                forcedYMin,
                forcedYMax,
                axisScaleType,
                axisDisplayUnits,
                axisPrecision,
                ensureYDomain
            );

            // create clustered offset scale
            let seriesLength = this.data.series.length;
            let columnWidth = (this.categoryLayout.categoryThickness * (1 - CartesianChart.InnerPaddingRatio)) / seriesLength;
            this.seriesOffsetScale = d3.scale.ordinal()
                .domain(this.data.series.map(s => s.index))
                .rangeBands([0, seriesLength * columnWidth]);

            return props;
        }

        public setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[], axisScaleType?: string, axisDisplayUnits?: number, axisPrecision?: number, ensureXDomain?: NumberRange): IAxisProperties {
            debug.assert(!is100Pct, 'Cannot have 100% clustered chart.');
            debug.assert(forcedTickCount === undefined, 'Cannot have clustered bar chart as combo chart.');

            let width = this.width;
            let valueDomain = AxisHelper.createValueDomain(this.data.series, true) || emptyDomain;
            let combinedDomain = AxisHelper.combineDomain(forcedXDomain, valueDomain, ensureXDomain);
            let shouldClamp = AxisHelper.scaleShouldClamp(combinedDomain, valueDomain);

            this.xProps = AxisHelper.createAxis({
                pixelSpan: width,
                dataDomain: combinedDomain,
                metaDataColumn: this.data.valuesMetadata[0],
                formatString: valueFormatter.getFormatString(this.data.valuesMetadata[0], columnChartProps.general.formatString),
                outerPadding: 0,
                isScalar: true,
                isVertical: false,
                forcedTickCount: forcedTickCount,
                useTickIntervalForDisplayUnits: true,
                isCategoryAxis: false,
                scaleType: axisScaleType,
                axisDisplayUnits: axisDisplayUnits,
                axisPrecision: axisPrecision,
                shouldClamp: shouldClamp,
            });

            this.xProps.axis.tickSize(-this.viewportHeight, 0);

            return this.xProps;
        }

        public drawColumns(useAnimation: boolean): ColumnChartDrawInfo {
            let data = this.data;
            debug.assertValue(data, 'data could not be null or undefined');

            this.barsCenters = null; // invalidate the columnsCenters so that will be calculated again

            let categoryWidth = (this.categoryLayout.categoryThickness * (1 - CartesianChart.InnerPaddingRatio));
            let columnWidth = categoryWidth / data.series.length;
            let axisOptions: ColumnAxisOptions = {
                columnWidth: columnWidth,
                categoryWidth: categoryWidth,
                xScale: this.xProps.scale,
                yScale: this.yProps.scale,
                seriesOffsetScale: this.seriesOffsetScale,
                isScalar: this.categoryLayout.isScalar,
                margin: this.margin,
            };
            let clusteredBarLayout = this.layout = ClusteredBarChartStrategy.getLayout(data, axisOptions);
            let dataLabelSettings = data.labelSettings;
            let labelDataPoints: LabelDataPoint[] = [];
            if (dataLabelSettings && dataLabelSettings.show) {
                labelDataPoints = this.createLabelDataPoints();
            }

            let result: ColumnChartAnimationResult;
            let shapes: D3.UpdateSelection;
            let series = ColumnUtil.drawSeries(data, this.graphicsContext.mainGraphicsContext, axisOptions);
            if (this.animator && useAnimation) {
                result = this.animator.animate({
                    viewModel: data,
                    series: series,
                    layout: clusteredBarLayout,
                    itemCS: ClusteredBarChartStrategy.classes.item,
                    interactivityService: this.interactivityService,
                    mainGraphicsContext: this.graphicsContext.mainGraphicsContext,
                    viewPort: { height: this.height, width: this.width }
                });
                shapes = result.shapes;
            }
            if (!this.animator || !useAnimation || result.failed) {
                shapes = ColumnUtil.drawDefaultShapes(data, series, clusteredBarLayout, ClusteredBarChartStrategy.classes.item, !this.animator, this.interactivityService && this.interactivityService.hasSelection());
            }

            ColumnUtil.applyInteractivity(shapes, this.graphicsContext.onDragStart);

            return {
                eventGroup: this.graphicsContext.mainGraphicsContext,
                shapesSelection: shapes,
                viewport: { height: this.height, width: this.width },
                axisOptions: axisOptions,
                labelDataPoints: labelDataPoints,
            };
        }

        public selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void {
            ColumnUtil.setChosenColumnOpacity(this.graphicsContext.mainGraphicsContext, ClusteredBarChartStrategy.classes.item.selector, selectedColumnIndex, lastSelectedColumnIndex);
            this.moveHandle(selectedColumnIndex);
        }

        public getClosestColumnIndex(x: number, y: number): number {
            return ColumnUtil.getClosestColumnIndex(y, this.getBarsCenters());
        }

        /** 
         * Get the chart's columns centers (y value).
         */
        private getBarsCenters(): number[] {
            if (!this.barsCenters) { // lazy creation
                let barWidth: number = this.categoryLayout.categoryThickness * (1 - CartesianChart.InnerPaddingRatio);
                // use the axis scale and first series data to get category centers
                if (this.data.series.length > 0) {
                    let yScaleOffset = 0;
                    if (!this.categoryLayout.isScalar)
                        yScaleOffset = barWidth / 2;
                    let firstSeries = this.data.series[0];
                    this.barsCenters = firstSeries.data.map(d => this.yProps.scale(this.categoryLayout.isScalar ? d.categoryValue : d.categoryIndex) + yScaleOffset);
                }
            }
            return this.barsCenters;
        }

        private moveHandle(selectedColumnIndex: number) {
            let barCenters = this.getBarsCenters();
            let y = barCenters[selectedColumnIndex];

            let hoverLine = d3.select('.interactive-hover-line');
            if (!hoverLine.empty() && !this.columnSelectionLineHandle) {

                this.columnSelectionLineHandle = d3.select(hoverLine.node().parentNode);
            }

            if (!this.columnSelectionLineHandle) {
                let handle = this.columnSelectionLineHandle = this.graphicsContext.unclippedGraphicsContext.append('g');
                handle.append('line')
                    .classed('interactive-hover-line', true)
                    .attr({
                        x1: 0,
                        x2: this.width,
                        y1: y,
                        y2: y,
                    });
                handle.append('circle')
                    .attr({
                        cx: 0,
                        cy: y,
                        r: '6px',
                    })
                    .classed('drag-handle', true);
            }
            else {
                let handle = this.columnSelectionLineHandle;
                handle.select('line').attr({ y1: y, y2: y });
                handle.select('circle').attr({ cy: y });
            }
        }

        public static getLayout(data: ColumnChartData, axisOptions: ColumnAxisOptions): IColumnLayout {
            let columnWidth = axisOptions.columnWidth;
            let halfColumnWidth = 0.5 * columnWidth;
            let quarterColumnWidth = halfColumnWidth / 2;
            let isScalar = axisOptions.isScalar;
            let xScale = axisOptions.xScale;
            let yScale = axisOptions.yScale;
            let seriesOffsetScale = axisOptions.seriesOffsetScale;
            let scaledX0 = xScale(0);
            let yScaleOffset = 0;

            if (isScalar)
                yScaleOffset = axisOptions.categoryWidth / 2;

            return {
                shapeLayout: {
                    width: (d: ColumnChartDataPoint) => Math.abs(AxisHelper.diffScaled(xScale, 0, d.value)),
                    x: (d: ColumnChartDataPoint) => scaledX0 + AxisHelper.diffScaled(xScale, Math.min(0, d.value), 0),
                    y: (d: ColumnChartDataPoint) => yScale(isScalar ? d.categoryValue : d.categoryIndex) + seriesOffsetScale(d.seriesIndex) - yScaleOffset + (d.drawThinner ? quarterColumnWidth : 0),
                    height: (d: ColumnChartDataPoint) => d.drawThinner ? halfColumnWidth : columnWidth,
                },
                shapeLayoutWithoutHighlights: {
                    width: (d: ColumnChartDataPoint) => Math.abs(AxisHelper.diffScaled(xScale, 0, d.originalValue)),
                    x: (d: ColumnChartDataPoint) => scaledX0 + AxisHelper.diffScaled(xScale, Math.min(0, d.originalValue), 0),
                    y: (d: ColumnChartDataPoint) => yScale(isScalar ? d.categoryValue : d.categoryIndex) + seriesOffsetScale(d.seriesIndex) - yScaleOffset,
                    height: (d: ColumnChartDataPoint) => columnWidth,
                },
                zeroShapeLayout: {
                    width: (d: ColumnChartDataPoint) => 0,
                    x: (d: ColumnChartDataPoint) => scaledX0 + AxisHelper.diffScaled(xScale, Math.min(0, d.value), 0),
                    y: (d: ColumnChartDataPoint) => yScale(isScalar ? d.categoryValue : d.categoryIndex) + seriesOffsetScale(d.seriesIndex) - yScaleOffset + (d.drawThinner ? quarterColumnWidth : 0),
                    height: (d: ColumnChartDataPoint) => d.drawThinner ? halfColumnWidth : columnWidth,
                },
            };
        }

        private createLabelDataPoints(): LabelDataPoint[] {
            let labelDataPoints: LabelDataPoint[] = [];
            let data = this.data;
            let series = data.series;
            let formattersCache = NewDataLabelUtils.createColumnFormatterCacheManager();
            let shapeLayout = this.layout.shapeLayout;

            for (let currentSeries of series) {
                let labelSettings = currentSeries.labelSettings ? currentSeries.labelSettings : data.labelSettings;
                if (!labelSettings.show)
                    continue;

                let axisFormatter: number = NewDataLabelUtils.getDisplayUnitValueFromAxisFormatter(this.yProps.formatter, labelSettings);
                for (let dataPoint of currentSeries.data) {
                    if ((data.hasHighlights && !dataPoint.highlight) || dataPoint.value == null) {
                        continue;
                    }

                    // Calculate label text
                    let formatString = dataPoint.labelFormatString;
                    let formatter = formattersCache.getOrCreate(formatString, labelSettings, axisFormatter);
                    let text = NewDataLabelUtils.getLabelFormattedText(formatter.format(dataPoint.value));

                    // Calculate text size
                    let properties: TextProperties = {
                        text: text,
                        fontFamily: NewDataLabelUtils.LabelTextProperties.fontFamily,
                        fontSize: PixelConverter.fromPoint(labelSettings.fontSize || NewDataLabelUtils.DefaultLabelFontSizeInPt),
                        fontWeight: NewDataLabelUtils.LabelTextProperties.fontWeight,
                    };
                    let textWidth = TextMeasurementService.measureSvgTextWidth(properties);
                    let textHeight = TextMeasurementService.estimateSvgTextHeight(properties, true /* tightFitForNumeric */);

                    // Calculate parent rectangle
                    let parentRect: IRect = {
                        left: shapeLayout.x(dataPoint),
                        top: shapeLayout.y(dataPoint),
                        width: shapeLayout.width(dataPoint),
                        height: shapeLayout.height(dataPoint),
                    };

                    labelDataPoints.push({
                        isPreferred: true,
                        text: text,
                        textSize: {
                            width: textWidth,
                            height: textHeight,
                        },
                        outsideFill: ColumnChart.getLabelFill(labelSettings.labelColor, false, this.isComboChart),
                        insideFill: ColumnChart.getLabelFill(labelSettings.labelColor, true, this.isComboChart),
                        parentType: LabelDataPointParentType.Rectangle,
                        parentShape: {
                            rect: parentRect,
                            orientation: dataPoint.value >= 0 ? NewRectOrientation.HorizontalLeftBased : NewRectOrientation.HorizontalRightBased,
                            validPositions: ColumnChart.clusteredValidLabelPositions,
                        },
                        identity: dataPoint.identity,
                        fontSize: labelSettings.fontSize || NewDataLabelUtils.DefaultLabelFontSizeInPt,
                    });
                }
            }

            return labelDataPoints;
        }
    }
} 