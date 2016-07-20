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
    import ITextAsSVGMeasurer = powerbi.ITextAsSVGMeasurer;

    /**
     * Default ranges are for when we have a field chosen for the axis,
     * but no values are returned by the query.
     */
    export const emptyDomain = [0, 0];

    export interface IAxisProperties {
        /** 
         * The D3 Scale object.
         */
        scale: D3.Scale.GenericScale<any>;
        /** 
         * The D3 Axis object.
         */
        axis: D3.Svg.Axis;
        /**
         * An array of the tick values to display for this axis.
         */
        values: any[];
        /** 
         * The ValueType of the column used for this axis.
         */
        axisType: ValueType;
        /**
         * A formatter with appropriate properties configured for this field.
         */
        formatter: IValueFormatter;
        /**
         * The axis title label.
         */
        axisLabel: string;
        /**
         * Cartesian axes are either a category or value axis.
         */
        isCategoryAxis: boolean;    
        /** 
         * (optional) The max width for category tick label values. used for ellipsis truncation / label rotation.
         */
        xLabelMaxWidth?: number;
        /** 
         * (optional) The thickness of each category on the axis.
         */
        categoryThickness?: number;
        /** 
         * (optional) The outer padding in pixels applied to the D3 scale.
         */
        outerPadding?: number;
        /** 
         * (optional) Whether we are using a default domain.
         */
        usingDefaultDomain?: boolean;
        /** 
         * (optional) do default d3 axis labels fit?
         */
        willLabelsFit?: boolean;
        /**
         * (optional) word break axis labels
         */
        willLabelsWordBreak?: boolean;
        /** 
         * (optional) Whether log scale is possible on the current domain.
         */
        isLogScaleAllowed?: boolean;
        /** 
         * (optional) Whether domain contains zero value and log scale is enabled.
         */
        hasDisallowedZeroInDomain?: boolean;
        /** 
         *(optional) The original data domain. Linear scales use .nice() to round to cleaner edge values. Keep the original data domain for later.
         */
        dataDomain?: number[];
        /** 
         * (optional) The D3 graphics context for this axis
         */
        graphicsContext?: D3.Selection;
    }

    export interface IMargin {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }

    export interface CreateAxisOptions {
        /**
         * The dimension length for the axis, in pixels.
         */
        pixelSpan: number;
        /** 
         * The data domain. [min, max] for a scalar axis, or [1...n] index array for ordinal.
         */
        dataDomain: number[];
        /** 
         * The DataViewMetadataColumn will be used for dataType and tick value formatting.
         */
        metaDataColumn: DataViewMetadataColumn; //TODO: remove this, we should just be passing in the formatString and the ValueType, not this DataView-specific object
        /**
         * The format string.
         */
        formatString: string;
        /** 
         * outerPadding to be applied to the axis.
         */
        outerPadding: number; 
        /** 
         * Indicates if this is the category axis.
         */
        isCategoryAxis?: boolean;
        /**
         * If true and the dataType is numeric or dateTime,
         * create a linear axis, else create an ordinal axis.
         */
        isScalar?: boolean;
        /**
         * (optional) The scale is inverted for a vertical axis,
         * and different optimizations are made for tick labels.
         */
        isVertical?: boolean;
        /** 
         * (optional) For visuals that do not need zero (e.g. column/bar) use tickInterval.
         */
        useTickIntervalForDisplayUnits?: boolean;
        /**
         * (optional) Combo charts can override the tick count to
         * align y1 and y2 grid lines.
         */
        forcedTickCount?: number;
        /**
         * (optional) For scalar axis with scalar keys, the number of ticks should never exceed the number of scalar keys, 
         * or labeling will look wierd (i.e. level of detail is Year, but month labels are shown between years)
         */
        maxTickCount?: number;
        /** 
         * (optional) Callback for looking up actual values from indices, 
         * used when formatting tick labels. 
         */
        getValueFn?: (index: number, type: ValueType) => any;
        /**
         * (optional) The width/height of each category on the axis.
         */
        categoryThickness?: number;
        /** (optional) the scale type of the axis. e.g. log, linear */
        scaleType?: string;
        /** (optional) user selected display units */
        axisDisplayUnits?: number;
        /** (optional) user selected precision */
        axisPrecision?: number;
        /** (optional) for 100 percent stacked charts, causes formatString override and minTickInterval adjustments */
        is100Pct?: boolean;
        /** (optional) sets clamping on the D3 scale, useful for drawing column chart rectangles as it simplifies the math during layout */
        shouldClamp?: boolean;
    }

    export interface CreateScaleResult {
        scale: D3.Scale.GenericScale<any>;
        bestTickCount: number;
        usingDefaultDomain?: boolean;
    }

    export interface TickLabelMargins {
        xMax: number;
        yLeft: number;
        yRight: number;
    }

    export module AxisHelper {
        let XLabelMaxAllowedOverflow = 35;
        let TextHeightConstant = 10;
        let MinTickCount = 2;
        let DefaultBestTickCount = 3;
        let LeftPadding = 10;
        let ScalarTickLabelPadding = 3;

        export function getRecommendedNumberOfTicksForXAxis(availableWidth: number) {
            if (availableWidth < 300)
                return 3;
            if (availableWidth < 500)
                return 5;

            return 8;
        }

        export function getRecommendedNumberOfTicksForYAxis(availableWidth: number) {
            if (availableWidth < 150)
                return 3;
            if (availableWidth < 300)
                return 5;

            return 8;
        }

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
        export function getBestNumberOfTicks(min: number, max: number, valuesMetadata: DataViewMetadataColumn[], maxTickCount: number, isDateTime?: boolean): number {
            debug.assert(maxTickCount >= 0, "maxTickCount must be greater or equal to zero");

            if (isNaN(min) || isNaN(max))
                return DefaultBestTickCount;

            debug.assert(min <= max, "min value needs to be less or equal to max value");

            if (maxTickCount <= 1 || (max <= 1 && min >= -1))
                return maxTickCount;

            if (min === max) {
                // datetime needs to only show one tick value in this case so formatting works correctly
                if (!!isDateTime)
                    return 1;
                return DefaultBestTickCount;
            }

            if (hasNonIntegerData(valuesMetadata))
                return maxTickCount;

            // e.g. 5 - 2 + 1 = 4, => [2,3,4,5]
            return Math.min(max - min + 1, maxTickCount);
        }

        export function hasNonIntegerData(valuesMetadata: DataViewMetadataColumn[]): boolean {
            for (let i = 0, len = valuesMetadata.length; i < len; i++) {
                let currentMetadata = valuesMetadata[i];
                if (currentMetadata && currentMetadata.type && !currentMetadata.type.integer) {
                    return true;
                }
            }

            return false;
        }

        export function getRecommendedTickValues(maxTicks: number,
            scale: D3.Scale.GenericScale<any>,
            axisType: ValueType,
            isScalar: boolean,
            minTickInterval?: number): any[] {

            if (!isScalar || isOrdinalScale(scale)) {
                return getRecommendedTickValuesForAnOrdinalRange(maxTicks, scale.domain());
            }
            else if (isDateTime(axisType)) {
                return getRecommendedTickValuesForADateTimeRange(maxTicks, scale.domain());
            }
            return getRecommendedTickValuesForAQuantitativeRange(maxTicks, scale, minTickInterval);
        }

        export function getRecommendedTickValuesForAnOrdinalRange(maxTicks: number, labels: string[]): string[] {
            let tickLabels: string[] = [];

            // return no ticks in this case
            if (maxTicks <= 0)
                return tickLabels;

            let len = labels.length;
            if (maxTicks > len)
                return labels;

            for (let i = 0, step = Math.ceil(len / maxTicks); i < len; i += step) {
                tickLabels.push(labels[i]);
            }
            return tickLabels;
        }

        export function getRecommendedTickValuesForAQuantitativeRange(maxTicks: number, scale: D3.Scale.GenericScale<any>, minInterval?: number): number[] {
            let tickLabels: number[] = [];

            //if maxticks is zero return none
            if (maxTicks === 0)
                return tickLabels;

            let quantitiveScale = <D3.Scale.QuantitativeScale>scale;
            if (quantitiveScale.ticks) {
                tickLabels = quantitiveScale.ticks(maxTicks);
                if (tickLabels.length > maxTicks && maxTicks > 1)
                    tickLabels = quantitiveScale.ticks(maxTicks - 1);
                if (tickLabels.length < MinTickCount) {
                    tickLabels = quantitiveScale.ticks(maxTicks + 1);
                }
                tickLabels = createTrueZeroTickLabel(tickLabels);

                if (minInterval && tickLabels.length > 1) {
                    let tickInterval = tickLabels[1] - tickLabels[0];
                    while (tickInterval > 0 && tickInterval < minInterval) {
                        for (let i = 1; i < tickLabels.length; i++) {
                            tickLabels.splice(i, 1);
                        }

                        tickInterval = tickInterval * 2;
                    }
                    // keep at least two labels - the loop above may trim all but one if we have odd # of tick labels and dynamic range < minInterval
                    if (tickLabels.length === 1) {
                        tickLabels.push(tickLabels[0] + minInterval);
                    }
                }
                return tickLabels;
            }

            debug.assertFail('must pass a quantitative scale to this method');

            return tickLabels;
        }

        /** 
         * Round out very small zero tick values (e.g. -1e-33 becomes 0).
         * 
         * @param ticks Array of numbers (from d3.scale.ticks([maxTicks])).
         * @param epsilon Max ratio of calculated tick interval which we will recognize as zero.
         * 
         * e.g.
         *     ticks = [-2, -1, 1e-10, 3, 4]; epsilon = 1e-5;
         *     closeZero = 1e-5 * | 2 - 1 | = 1e-5
         *     // Tick values <= 1e-5 replaced with 0
         *     return [-2, -1, 0, 3, 4];
         */
        function createTrueZeroTickLabel(ticks: number[], epsilon: number = 1e-5): number[] {
            if (!ticks || ticks.length < 2)
                return ticks;

            let closeZero = epsilon * Math.abs(ticks[1] - ticks[0]);

            return ticks.map((tick) => Math.abs(tick) <= closeZero ? 0 : tick);
        }

        function getRecommendedTickValuesForADateTimeRange(maxTicks: number, dataDomain: number[]): number[] {
            let tickLabels: number[] = [];

            if (dataDomain[0] === 0 && dataDomain[1] === 0)
                return [];

            let dateTimeTickLabels = DateTimeSequence.calculate(new Date(dataDomain[0]), new Date(dataDomain[1]), maxTicks).sequence;
            tickLabels = dateTimeTickLabels.map(d => d.getTime());
            tickLabels = ensureValuesInRange(tickLabels, dataDomain[0], dataDomain[1]);
            return tickLabels;
        }

        function normalizeLinearDomain(domain: NumberRange): NumberRange {
            if (isNaN(domain.min) || isNaN(domain.max)) {
                domain.min = emptyDomain[0];
                domain.max = emptyDomain[1];
            }
            else if (domain.min === domain.max) {
                // d3 linear scale will give zero tickValues if max === min, so extend a little
                domain.min = domain.min < 0 ? domain.min * 1.2 : domain.min * 0.8;
                domain.max = domain.max < 0 ? domain.max * 0.8 : domain.max * 1.2;
            }
            else {
                // Check that min is very small and is a negligable portion of the whole domain.
                // (fix floating pt precision bugs)
                // sometimes highlight value math causes small negative numbers which makes the axis add
                // a large tick interval instead of just rendering at zero.
                if (Math.abs(domain.min) < 0.0001 && domain.min / (domain.max - domain.min) < 0.0001) {
                    domain.min = 0;
                }
            }

            return domain;
        }

        export function getMargin(availableWidth: number, availableHeight: number, xMargin: number, yMargin: number): IMargin {
            if (getRecommendedNumberOfTicksForXAxis(availableWidth - xMargin) === 0
                || getRecommendedNumberOfTicksForYAxis(availableHeight - yMargin) === 0) {
                return {
                    top: 0,
                    right: xMargin,
                    bottom: yMargin,
                    left: 0
                };
            }

            return {
                top: 20,
                right: 30,
                bottom: 40,
                left: 30
            };
        }        

        // TODO: Put the parameters into one object
        export function getTickLabelMargins(
            viewport: IViewport,
            yMarginLimit: number,
            textWidthMeasurer: ITextAsSVGMeasurer,
            textHeightMeasurer: ITextAsSVGMeasurer,
            axes: CartesianAxisProperties,
            bottomMarginLimit: number,
            properties: TextProperties,
            scrollbarVisible?: boolean,
            showOnRight?: boolean,
            renderXAxis?: boolean,
            renderY1Axis?: boolean,
            renderY2Axis?: boolean): TickLabelMargins /*IMargin - can't update this because custom visuals use it*/ {

            debug.assertValue(axes, 'axes');
            let xAxisProperties: IAxisProperties = axes.x;
            let y1AxisProperties: IAxisProperties = axes.y1;
            let y2AxisProperties: IAxisProperties = axes.y2;

            debug.assertValue(viewport, 'viewport');
            debug.assertValue(textWidthMeasurer, 'textWidthMeasurer');
            debug.assertValue(textHeightMeasurer, 'textHeightMeasurer');
            debug.assertValue(xAxisProperties, 'xAxis');
            debug.assertValue(y1AxisProperties, 'yAxis');

            let xLabels = xAxisProperties.values;
            let y1Labels = y1AxisProperties.values;

            let leftOverflow = 0;
            let rightOverflow = 0;
            let maxWidthY1 = 0;
            let maxWidthY2 = 0;
            let xMax = 0; // bottom margin
            let ordinalLabelOffset = xAxisProperties.categoryThickness ? xAxisProperties.categoryThickness / 2 : 0;
            let scaleIsOrdinal = isOrdinalScale(xAxisProperties.scale);

            let xLabelOuterPadding = 0;
            if (xAxisProperties.outerPadding !== undefined) {
                xLabelOuterPadding = xAxisProperties.outerPadding;
            }
            else if (xAxisProperties.xLabelMaxWidth !== undefined) {
                xLabelOuterPadding = Math.max(0, (viewport.width - xAxisProperties.xLabelMaxWidth * xLabels.length) / 2);
            }

            if (getRecommendedNumberOfTicksForXAxis(viewport.width) !== 0
                || getRecommendedNumberOfTicksForYAxis(viewport.height) !== 0) {
                let rotation;
                if (scrollbarVisible)
                    rotation = LabelLayoutStrategy.DefaultRotationWithScrollbar;
                else
                    rotation = LabelLayoutStrategy.DefaultRotation;

                if (renderY1Axis) {
                    for (let i = 0, len = y1Labels.length; i < len; i++) {
                        properties.text = y1Labels[i];
                        maxWidthY1 = Math.max(maxWidthY1, textWidthMeasurer(properties));
                    }
                }

                if (y2AxisProperties && renderY2Axis) {
                    let y2Labels = y2AxisProperties.values;
                    for (let i = 0, len = y2Labels.length; i < len; i++) {
                        properties.text = y2Labels[i];
                        maxWidthY2 = Math.max(maxWidthY2, textWidthMeasurer(properties));
                    }
                }

                let textHeight = textHeightMeasurer(properties);
                let maxNumLines = Math.floor(bottomMarginLimit / textHeight);
                let xScale = xAxisProperties.scale;
                let xDomain = xScale.domain();
                if (renderXAxis && xLabels.length > 0) {
                    for (let i = 0, len = xLabels.length; i < len; i++) {
                        // find the max height of the x-labels, perhaps rotated or wrapped
                        let height: number;
                        properties.text = xLabels[i];
                        let width = textWidthMeasurer(properties);
                        if (xAxisProperties.willLabelsWordBreak) {
                            // Split label and count rows
                            let wordBreaks = jsCommon.WordBreaker.splitByWidth(properties.text, properties, textWidthMeasurer, xAxisProperties.xLabelMaxWidth, maxNumLines);
                            height = wordBreaks.length * textHeight;
                            // word wrapping will truncate at xLabelMaxWidth
                            width = xAxisProperties.xLabelMaxWidth;
                        }
                        else if (!xAxisProperties.willLabelsFit && scaleIsOrdinal) {
                            height = width * rotation.sine;
                            width = width * rotation.cosine;
                        }
                        else {
                            height = TextHeightConstant;
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
                                let xPos = xScale(xDomain[0]);
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
                                let xPos = xScale(xDomain[1]);
                                // xPos already incorporates xLabelOuterPadding, don't subtract it twice
                                rightOverflow = (width / 2) - (viewport.width - xPos);
                                rightOverflow = Math.max(rightOverflow, 0);
                            }
                        }

                        xMax = Math.max(xMax, height);
                    }
                    // trim any actual overflow to the limit
                    leftOverflow = Math.min(leftOverflow, XLabelMaxAllowedOverflow);
                    rightOverflow = Math.min(rightOverflow, XLabelMaxAllowedOverflow);
                }
            }

            let rightMargin = 0,
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

        export function columnDataTypeHasValue(dataType: ValueTypeDescriptor) {
            return dataType && (dataType.bool || dataType.numeric || dataType.text || dataType.dateTime);
        }

        export function createOrdinalType(): ValueType {
            return ValueType.fromDescriptor({ text: true });
        }

        export function isOrdinal(type: ValueTypeDescriptor): boolean {
            return !!(type && (type.text || type.bool || (type.misc && type.misc.barcode) || (type.geography && type.geography.postalCode)));
        }

        export function isOrdinalScale(scale: any): boolean {
            return typeof scale.invert === 'undefined';
        }

        export function isDateTime(type: ValueTypeDescriptor): boolean {
            return !!(type && type.dateTime);
        }

        export function invertScale(scale: any, x) {
            if (isOrdinalScale(scale)) {
                return invertOrdinalScale(scale, x);
            }
            return scale.invert(x);
        }

        export function extent(scale: any): number[] {
            if (isOrdinalScale(scale)) {
                return scale.rangeExtent();
            }
            return scale.range();
        }

        export function invertOrdinalScale(scale: D3.Scale.OrdinalScale, x: number) {
            let leftEdges = scale.range();
            if (leftEdges.length < 2)
                return 0;

            let width = scale.rangeBand();
            let halfInnerPadding = (leftEdges[1] - leftEdges[0] - width) / 2;

            let j;
            for (j = 0; x > (leftEdges[j] + width + halfInnerPadding) && j < (leftEdges.length - 1); j++)
                ;
            return scale.domain()[j];
        }

        export function findClosestXAxisIndex(categoryValue: number, categoryAxisValues: CartesianDataPoint[]): number {
            let closestValueIndex: number = -1;
            let minDistance = Number.MAX_VALUE;
            for (let i in categoryAxisValues) {
                let distance = Math.abs(categoryValue - categoryAxisValues[i].categoryValue);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestValueIndex = parseInt(i, 10);
                }
            }
            return closestValueIndex;
        }

        export function lookupOrdinalIndex(scale: D3.Scale.OrdinalScale, pixelValue: number): number {
            let closestValueIndex: number = -1;
            let minDistance = Number.MAX_VALUE;
            let domain = scale.domain();
            if (domain.length < 2)
                return 0;
            var halfWidth = (scale(1) - scale(0)) / 2;
            for (let idx in domain) {
                let leftEdgeInPixels = scale(idx);
                var midPoint = leftEdgeInPixels + halfWidth;
                let distance = Math.abs(pixelValue - midPoint);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestValueIndex = parseInt(idx, 10);
                }
            }
            return closestValueIndex;
        }

        /** scale(value1) - scale(value2) with zero checking and min(+/-1, result) */
        export function diffScaled(
            scale: D3.Scale.GenericScale<any>,
            value1: any,
            value2: any): number {
            debug.assertValue(scale, 'scale');

            let value: number = scale(value1) - scale(value2);
            if (value === 0)
                return 0;

            if (value < 0)
                return Math.min(value, -1);
            return Math.max(value, 1);
        }

        export function createDomain(data: CartesianSeries[], axisType: ValueTypeDescriptor, isScalar: boolean, forcedScalarDomain: any[], ensureDomain?: NumberRange): number[] {
            if (isScalar && !isOrdinal(axisType)) {
                let userMin, userMax;
                if (forcedScalarDomain && forcedScalarDomain.length === 2) {
                    userMin = forcedScalarDomain[0];
                    userMax = forcedScalarDomain[1];
                }
                return createScalarDomain(data, userMin, userMax, axisType, ensureDomain);
            }

            return createOrdinalDomain(data);
        }

        export function ensureValuesInRange(values: number[], min: number, max: number): number[] {
            debug.assert(min <= max, "min must be less or equal to max");
            let filteredValues = values.filter(v => v >= min && v <= max);
            if (filteredValues.length < 2)
                filteredValues = [min, max];
            return filteredValues;
        }

        /**
         * Gets the ValueType of a category column, defaults to Text if the type is not present.
         */
        export function getCategoryValueType(metadataColumn: DataViewMetadataColumn, isScalar?: boolean): ValueType {
            if (metadataColumn && columnDataTypeHasValue(metadataColumn.type))
                return <ValueType>metadataColumn.type;

            if (isScalar) {
                return ValueType.fromDescriptor({ numeric: true });
            }

            return ValueType.fromDescriptor({ text: true });
        }

        /**
         * Create a D3 axis including scale. Can be vertical or horizontal, and either datetime, numeric, or text.
         * @param options The properties used to create the axis.
         */
        export function createAxis(options: CreateAxisOptions): IAxisProperties {
            let pixelSpan = options.pixelSpan,
                dataDomain = options.dataDomain,
                metaDataColumn = options.metaDataColumn,
                formatString = options.formatString,
                outerPadding = options.outerPadding || 0,
                isCategoryAxis = !!options.isCategoryAxis,
                isScalar = !!options.isScalar,
                isVertical = !!options.isVertical,
                useTickIntervalForDisplayUnits = !!options.useTickIntervalForDisplayUnits, // DEPRECATE: same meaning as isScalar?
                getValueFn = options.getValueFn,
                categoryThickness = options.categoryThickness,
                axisDisplayUnits = options.axisDisplayUnits,
                axisPrecision = options.axisPrecision,
                is100Pct = !!options.is100Pct;

            let dataType: ValueType = AxisHelper.getCategoryValueType(metaDataColumn, isScalar);

            // Create the Scale
            let scaleResult: CreateScaleResult = AxisHelper.createScale(options);
            let scale = scaleResult.scale;
            let bestTickCount = scaleResult.bestTickCount;
            let scaleDomain = scale.domain();
            let isLogScaleAllowed = AxisHelper.isLogScalePossible(dataDomain, dataType);

            // fix categoryThickness if scalar and the domain was adjusted when making the scale "nice"
            if (categoryThickness && isScalar && dataDomain && dataDomain.length === 2) {
                let oldSpan = dataDomain[1] - dataDomain[0];
                let newSpan = scaleDomain[1] - scaleDomain[0];
                if (oldSpan > 0 && newSpan > 0) {
                    categoryThickness = categoryThickness * oldSpan / newSpan;
                }
            }

            // Prepare Tick Values for formatting
            let tickValues: any[];
            if (isScalar && bestTickCount === 1) {
                tickValues = [dataDomain[0]];
            }
            else {
                let minTickInterval = isScalar ? getMinTickValueInterval(formatString, dataType, is100Pct) : undefined;
                tickValues = getRecommendedTickValues(bestTickCount, scale, dataType, isScalar, minTickInterval);
            }

            if (options.scaleType && options.scaleType === axisScale.log && isLogScaleAllowed) {
                tickValues = tickValues.filter((d) => { return AxisHelper.powerOfTen(d); });
            }

            let formatter = createFormatter(
                scaleDomain,
                dataDomain,
                dataType,
                isScalar,
                formatString,
                bestTickCount,
                tickValues,
                getValueFn,
                useTickIntervalForDisplayUnits,
                axisDisplayUnits,
                axisPrecision);

            // sets default orientation only, cartesianChart will fix y2 for comboChart
            // tickSize(pixelSpan) is used to create gridLines
            let axis = d3.svg.axis()
                .scale(scale)
                .tickSize(6, 0)
                .orient(isVertical ? 'left' : 'bottom')
                .ticks(bestTickCount)
                .tickValues(tickValues);

            let formattedTickValues = [];
            if (metaDataColumn)
                formattedTickValues = formatAxisTickValues(axis, tickValues, formatter, dataType, getValueFn);

            let xLabelMaxWidth;
            // Use category layout of labels if specified, otherwise use scalar layout of labels
            if (!isScalar && categoryThickness) {
                xLabelMaxWidth = Math.max(1, categoryThickness - CartesianChart.TickLabelPadding * 2);
            }
            else {
                // When there are 0 or 1 ticks, then xLabelMaxWidth = pixelSpan       
                xLabelMaxWidth = tickValues.length > 1 ? getScalarLabelMaxWidth(scale, tickValues) : pixelSpan;
                xLabelMaxWidth = xLabelMaxWidth - ScalarTickLabelPadding * 2;
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
                usingDefaultDomain: scaleResult.usingDefaultDomain,
                isLogScaleAllowed: isLogScaleAllowed,
                dataDomain: dataDomain,
            };
        }

        function getScalarLabelMaxWidth(scale: D3.Scale.GenericScale<any>, tickValues: number[]): number {
            debug.assertValue(scale, "scale");
            debug.assertNonEmpty(tickValues, "tickValues");
            // find the distance between two ticks. scalar ticks can be anywhere, such as:
            // |---50----------100--------|
            if (scale && !_.isEmpty(tickValues)) {
                return Math.abs(scale(tickValues[1]) - scale(tickValues[0]));
            }

            return 1;
        }

        export function createScale(options: CreateAxisOptions): CreateScaleResult {
            let pixelSpan = options.pixelSpan,
                dataDomain = options.dataDomain,
                metaDataColumn = options.metaDataColumn,
                outerPadding = options.outerPadding || 0,
                isScalar = !!options.isScalar,
                isVertical = !!options.isVertical,
                forcedTickCount = options.forcedTickCount,
                categoryThickness = options.categoryThickness,
                shouldClamp = !!options.shouldClamp,
                maxTickCount = options.maxTickCount;

            let dataType: ValueType = AxisHelper.getCategoryValueType(metaDataColumn, isScalar);

            let maxTicks = isVertical ? getRecommendedNumberOfTicksForYAxis(pixelSpan) : getRecommendedNumberOfTicksForXAxis(pixelSpan);
            if (maxTickCount &&
                maxTicks > maxTickCount)
                maxTicks = maxTickCount;

            let scalarDomain = dataDomain ? dataDomain.slice() : null;
            let bestTickCount = maxTicks;
            let scale: D3.Scale.GenericScale<any>;
            let usingDefaultDomain = false;

            if (dataDomain == null || (dataDomain.length === 2 && dataDomain[0] == null && dataDomain[1] == null) || (dataDomain.length !== 2 && isScalar)) {
                usingDefaultDomain = true;

                if (dataType.dateTime || !isOrdinal(dataType))
                    dataDomain = emptyDomain;
                else //ordinal
                    dataDomain = [];

                if (isOrdinal(dataType)) {
                    scale = createOrdinalScale(pixelSpan, dataDomain, categoryThickness ? outerPadding / categoryThickness : 0);
                }
                else {
                    scale = createNumericalScale(options.scaleType, pixelSpan, dataDomain, dataType, outerPadding, bestTickCount);
                }
            }
            else {
                if (isScalar && dataDomain.length > 0) {
                    bestTickCount = forcedTickCount !== undefined
                        ? (maxTicks !== 0 ? forcedTickCount : 0)
                        : AxisHelper.getBestNumberOfTicks(dataDomain[0], dataDomain[dataDomain.length - 1], [metaDataColumn], maxTicks, dataType.dateTime);

                    let normalizedRange = normalizeLinearDomain({ min: dataDomain[0], max: dataDomain[dataDomain.length - 1] });
                    scalarDomain = [normalizedRange.min, normalizedRange.max];
                }

                if (isScalar && dataType.numeric && !dataType.dateTime) {
                    scale = createNumericalScale(options.scaleType, pixelSpan, scalarDomain, dataType, outerPadding, bestTickCount, shouldClamp);
                }
                else if (isScalar && dataType.dateTime) {
                    // Use of a linear scale, instead of a D3.time.scale, is intentional since we want
                    // to control the formatting of the time values, since d3's implementation isn't
                    // in accordance to our design.
                    //     scalarDomain: should already be in long-int time (via category.values[0].getTime())
                    scale = createLinearScale(pixelSpan, scalarDomain, outerPadding, null, shouldClamp); // DO NOT PASS TICKCOUNT
                }
                else if (dataType.text || dataType.dateTime || dataType.numeric || dataType.bool) {
                    scale = createOrdinalScale(pixelSpan, scalarDomain, categoryThickness ? outerPadding / categoryThickness : 0);
                    bestTickCount = maxTicks === 0 ? 0
                        : Math.min(
                            scalarDomain.length,
                            (pixelSpan - outerPadding * 2) / CartesianChart.MinOrdinalRectThickness);
                }
                else {
                    debug.assertFail('unsupported dataType, something other than text or numeric');
                }
            }

            // vertical ordinal axis (e.g. categorical bar chart) does not need to reverse
            if (isVertical && isScalar) {
                scale.range(scale.range().reverse());
            }

            ColumnUtil.normalizeInfinityInScale(scale);

            return {
                scale: scale,
                bestTickCount: bestTickCount,
                usingDefaultDomain: usingDefaultDomain,
            };
        }

        export function createFormatter(
            scaleDomain: any[],
            dataDomain: any[],
            dataType,
            isScalar: boolean,
            formatString: string,
            bestTickCount: number,
            tickValues: any[],
            getValueFn: any,
            useTickIntervalForDisplayUnits: boolean = false,
            axisDisplayUnits?: number,
            axisPrecision?: number): IValueFormatter {

            let formatter: IValueFormatter;
            if (dataType.dateTime) {
                if (isScalar) {
                    let value = new Date(scaleDomain[0]);
                    let value2 = new Date(scaleDomain[1]);
                    // datetime with only one value needs to pass the same value
                    // (from the original dataDomain value, not the adjusted scaleDomain)
                    // so formatting works correctly.
                    if (bestTickCount === 1)
                        value = value2 = new Date(dataDomain[0]);
                    // this will ignore the formatString and create one based on the smallest non-zero portion of the values supplied.
                    formatter = valueFormatter.create({
                        format: formatString,
                        value: value,
                        value2: value2,
                        tickCount: bestTickCount,
                    });
                }
                else {
                    // Use the model formatString for ordinal datetime
                    formatter = valueFormatter.createDefaultFormatter(formatString, true);
                }
            }
            else {
                if (getValueFn == null && !isScalar) {
                    debug.assertFail('getValueFn must be supplied for ordinal tickValues');
                }
                if (useTickIntervalForDisplayUnits && isScalar && tickValues.length > 1) {
                    let value1 = axisDisplayUnits ? axisDisplayUnits : tickValues[1] - tickValues[0];

                    let options: ValueFormatterOptions = {
                        format: formatString,
                        value: value1,
                        value2: 0, //force tickInterval or display unit to be used
                        allowFormatBeautification: true,
                    };

                    if (axisPrecision)
                        options.precision = axisPrecision;
                    else
                        options.detectAxisPrecision = true;

                    formatter = valueFormatter.create(options);
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
        function formatAxisTickValues(
            axis: D3.Svg.Axis,
            tickValues: any[],
            formatter: IValueFormatter,
            dataType: ValueType,
            getValueFn?: (index: number, type: ValueType) => any) {

            let formattedTickValues = [];

            if (!getValueFn)
                getValueFn = data => data;

            if (formatter) {
                axis.tickFormat(d => formatter.format(getValueFn(d, dataType)));
                formattedTickValues = tickValues.map(d => formatter.format(getValueFn(d, dataType)));
            }
            else {
                formattedTickValues = tickValues.map((d) => getValueFn(d, dataType));
            }

            return formattedTickValues;
        }

        export function getMinTickValueInterval(formatString: string, columnType: ValueType, is100Pct?: boolean): number {
            let isCustomFormat = formatString && !powerbi.NumberFormat.isStandardFormat(formatString);
            if (isCustomFormat) {
                let precision = powerbi.NumberFormat.getCustomFormatMetadata(formatString, true /*calculatePrecision*/).precision;
                if (formatString.indexOf('%') > -1)
                    precision += 2; //percent values are multiplied by 100 during formatting
                return Math.pow(10, -precision);
            }
            else if (is100Pct)
                return 0.01;
            else if (columnType.integer)
                return 1;

            return 0;
        }

        function createScalarDomain(data: CartesianSeries[], userMin: DataViewPropertyValue, userMax: DataViewPropertyValue, axisType: ValueTypeDescriptor, ensureDomain?: NumberRange): number[] {
            debug.assertValue(data, 'data');
            if (data.length === 0) {
                return null;
            }

            let defaultMinX = <number>d3.min(data, (kv) => { return d3.min(kv.data, d => { return d.categoryValue; }); });
            let defaultMaxX = <number>d3.max(data, (kv) => { return d3.max(kv.data, d => { return d.categoryValue; }); });

            return combineDomain([userMin, userMax], [defaultMinX, defaultMaxX], ensureDomain);
        }

        /**
         * Creates a [min,max] from your Cartiesian data values.
         * 
         * @param data The series array of CartesianDataPoints.
         * @param includeZero Columns and bars includeZero, line and scatter do not.
         */
        export function createValueDomain(data: CartesianSeries[], includeZero: boolean): number[] {
            debug.assertValue(data, 'data');
            if (data.length === 0)
                return null;

            let minY = <number>d3.min(data, (kv) => { return d3.min(kv.data, d => { return d.value; }); });
            let maxY = <number>d3.max(data, (kv) => { return d3.max(kv.data, d => { return d.value; }); });

            if (includeZero)
                return [Math.min(minY, 0), Math.max(maxY, 0)];
            return [minY, maxY];
        }

        function createOrdinalDomain(data: CartesianSeries[]): number[] {
            if (_.isEmpty(data))
                return [];

            // each series shares the same categories for oridinal axes (even if a series has some nulls)
            let domain = [];
            let firstSeries = data[0];
            for (let dp of firstSeries.data) {
                if (!dp.highlight)
                    domain.push(dp.categoryIndex);
            }
            return domain;
        }

        export module LabelLayoutStrategy {
            export function willLabelsFit(
                axisProperties: IAxisProperties,
                availableWidth: number,
                textMeasurer: ITextAsSVGMeasurer,
                properties: TextProperties): boolean {

                let labels = axisProperties.values;
                if (labels.length === 0)
                    return false;

                let labelMaxWidth = axisProperties.xLabelMaxWidth !== undefined
                    ? axisProperties.xLabelMaxWidth
                    : availableWidth / labels.length;

                return !labels.some(d => {
                    properties.text = d;
                    return textMeasurer(properties) > labelMaxWidth;
                });
            }

            export function willLabelsWordBreak(
                axisProperties: IAxisProperties,
                margin: IMargin,
                availableWidth: number,
                textWidthMeasurer: ITextAsSVGMeasurer,
                textHeightMeasurer: ITextAsSVGMeasurer,
                textTruncator: (properties: TextProperties, maxWidth: number) => string,
                properties: TextProperties) {
                let labels = axisProperties.values;
                let labelMaxWidth = axisProperties.xLabelMaxWidth !== undefined
                    ? axisProperties.xLabelMaxWidth
                    : availableWidth / labels.length;
                let maxRotatedLength = margin.bottom / DefaultRotation.sine;
                let height = textHeightMeasurer(properties);
                let maxNumLines = Math.max(1, Math.floor(margin.bottom / height));  // TODO: not taking axis label into account

                if (labels.length === 0)
                    return false;

                // If no break character and exceeds max width, word breaking will not work, return false
                let mustRotate = labels.some(label => {
                    // Detect must rotate and return immediately
                    properties.text = label;
                    return !jsCommon.WordBreaker.hasBreakers(label) && textWidthMeasurer(properties) > labelMaxWidth;
                });
                if (mustRotate)
                    return false;

                let moreWordBreakChars = labels.filter((label, index: number) => {
                    // ...otherwise compare rotation versus word breaking
                    let allowedLengthProjectedOnXAxis =
                        // Left margin is the width of Y axis.
                        margin.left
                        // There could be a padding before the first category.
                        + axisProperties.outerPadding
                        // Align the rotated text's top right corner to the middle of the corresponding category first.
                        + axisProperties.categoryThickness * (index + 0.5)
                        // Subtracting the left padding space from the allowed length
                        - LeftPadding;
                    let allowedLength = allowedLengthProjectedOnXAxis / DefaultRotation.cosine;
                    let rotatedLength = Math.min(allowedLength, maxRotatedLength);
                    
                    // Which shows more characters? Rotated or maxNumLines truncated to labelMaxWidth?
                    let wordBreakChars = jsCommon.WordBreaker.splitByWidth(label, properties, textWidthMeasurer, labelMaxWidth, maxNumLines, textTruncator).join(' ');
                    properties.text = label;
                    let rotateChars = textTruncator(properties, rotatedLength);

                    // prefer word break (>=) as it takes up less plot area
                    return TextUtil.removeEllipses(wordBreakChars).length >= TextUtil.removeEllipses(rotateChars).length;
                });

                // prefer word break (>=) as it takes up less plot area
                return moreWordBreakChars.length >= Math.floor(labels.length / 2);
            }

            export const DefaultRotation = {
                sine: Math.sin(Math.PI * (35 / 180)),
                cosine: Math.cos(Math.PI * (35 / 180)),
                tangent: Math.tan(Math.PI * (35 / 180)),
                transform: 'rotate(-35)',
                dy: '-0.5em',
            };

            export const DefaultRotationWithScrollbar = {
                sine: Math.sin(Math.PI * (90 / 180)),
                cosine: Math.cos(Math.PI * (90 / 180)),
                tangent: Math.tan(Math.PI * (90 / 180)),
                transform: 'rotate(-90)',
                dy: '-0.8em',
            };

            export function rotate(
                labelSelection: D3.Selection,
                maxBottomMargin: number,
                textTruncator: (properties: TextProperties, maxWidth: number) => string,
                textProperties: TextProperties,
                needRotate: boolean,
                needEllipsis: boolean,
                axisProperties: IAxisProperties,
                margin: IMargin,
                scrollbarVisible: boolean) {

                let rotatedLength;
                let defaultRotation: any;

                if (scrollbarVisible)
                    defaultRotation = DefaultRotationWithScrollbar;
                else
                    defaultRotation = DefaultRotation;

                if (needRotate) {
                    rotatedLength = maxBottomMargin / defaultRotation.sine;
                }

                labelSelection.each(function () {
                    let axisLabel = d3.select(this);
                    let labelText = axisLabel.text();
                    textProperties.text = labelText;
                    if (needRotate) {
                        let textContentIndex = axisProperties.values.indexOf(this.textContent);
                        let allowedLengthProjectedOnXAxis =
                            // Left margin is the width of Y axis.
                            margin.left
                            // There could be a padding before the first category.
                            + axisProperties.outerPadding
                            // Align the rotated text's top right corner to the middle of the corresponding category first.
                            + axisProperties.categoryThickness * (textContentIndex + 0.5);

                        // Subtracting the left padding space from the allowed length.
                        if (!scrollbarVisible)
                            allowedLengthProjectedOnXAxis -= LeftPadding;

                        // Truncate if scrollbar is visible or rotatedLength exceeds allowedLength
                        let allowedLength = allowedLengthProjectedOnXAxis / defaultRotation.cosine;
                        if (scrollbarVisible || needEllipsis || (allowedLength < rotatedLength)) {
                            labelText = textTruncator(textProperties, Math.min(allowedLength, rotatedLength));
                            axisLabel.text(labelText);
                        }

                        axisLabel.style('text-anchor', 'end')
                            .attr({
                                'dx': '-0.5em',
                                'dy': defaultRotation.dy,
                                'transform': defaultRotation.transform
                            });
                    } else {
                        let newLabelText = textTruncator(textProperties, axisProperties.xLabelMaxWidth);
                        if (newLabelText !== labelText)
                            axisLabel.text(newLabelText);
                        axisLabel.style('text-anchor', 'middle')
                            .attr(
                            {
                                'dx': '0em',
                                'dy': '1em',
                                'transform': 'rotate(0)'
                            });
                    }
                });
            }

            export function wordBreak(
                text: D3.Selection,
                axisProperties: IAxisProperties,
                maxHeight: number
            ) {
                let allowedLength = axisProperties.xLabelMaxWidth;

                text.each(function () {
                    let node = d3.select(this);

                    // Reset style of text node
                    node
                        .style('text-anchor', 'middle')
                        .attr({
                            'dx': '0em',
                            'dy': '1em',
                            'transform': 'rotate(0)'
                        });

                    TextMeasurementService.wordBreak(this, allowedLength, maxHeight);
                });
            }

            export function clip(text: D3.Selection, availableWidth: number, svgEllipsis: (textElement: SVGTextElement, maxWidth: number) => void) {
                if (text.size() === 0)
                    return;

                text.each(function () {
                    let text = d3.select(this);
                    svgEllipsis(text[0][0], availableWidth);
                });
            }
        }

        export function createOrdinalScale(pixelSpan: number, dataDomain: any[], outerPaddingRatio: number = 0): D3.Scale.OrdinalScale {
            debug.assert(outerPaddingRatio >= 0 && outerPaddingRatio < 4, 'outerPaddingRatio should be a value between zero and four');
            let scale = d3.scale.ordinal()
            /* Avoid using rangeRoundBands here as it is adding some extra padding to the axis*/
                .rangeBands([0, pixelSpan], CartesianChart.InnerPaddingRatio, outerPaddingRatio)
                .domain(dataDomain);
            return scale;
        }

        export function isLogScalePossible(domain: any[], axisType?: ValueType): boolean {
            if (domain == null)
                return false;
            if (isDateTime(axisType))
                return false;

            return (domain[0] > 0 && domain[1] > 0) || (domain[0] < 0 && domain[1] < 0);//doman must exclude 0
        }

        //this function can return different scales e.g. log, linear
        // NOTE: export only for testing, do not access directly
        export function createNumericalScale(
            axisScaleType: string,
            pixelSpan: number,
            dataDomain: any[],
            dataType: ValueType,
            outerPadding: number = 0,
            niceCount?: number,
            shouldClamp?: boolean): D3.Scale.GenericScale<any> {

            if (axisScaleType === axisScale.log && isLogScalePossible(dataDomain, dataType)) {
                return createLogScale(pixelSpan, dataDomain, outerPadding, niceCount);
            }
            else {
                return createLinearScale(pixelSpan, dataDomain, outerPadding, niceCount, shouldClamp);
            }
        }

        function createLogScale(pixelSpan: number, dataDomain: any[], outerPadding: number = 0, niceCount?: number): D3.Scale.LinearScale {
            debug.assert(isLogScalePossible(dataDomain), "dataDomain cannot include 0");
            let scale = d3.scale.log()
                .range([outerPadding, pixelSpan - outerPadding])
                .domain([dataDomain[0], dataDomain[1]])
                .clamp(true);

            if (niceCount) {
                scale.nice(niceCount);
            }

            return scale;
        }

        // NOTE: export only for testing, do not access directly
        export function createLinearScale(pixelSpan: number, dataDomain: any[], outerPadding: number = 0, niceCount?: number, shouldClamp?: boolean): D3.Scale.LinearScale {
            let scale = d3.scale.linear()
                .range([outerPadding, pixelSpan - outerPadding])
                .domain([dataDomain[0], dataDomain[1]])
                .clamp(shouldClamp);
            // .nice(undefined) still modifies the scale boundaries, and for datetime this messes things up.
            // we use millisecond ticks since epoch for datetime, so we don't want any "nice" with numbers like 17398203392.
            if (niceCount) {
                scale.nice(niceCount);
            }
            return scale;
        }

        export function getRangeForColumn(sizeColumn: DataViewValueColumn): NumberRange {
            let result: NumberRange = {};
            if (sizeColumn) {
                result.min = sizeColumn.min == null
                    ? sizeColumn.minLocal == null ? d3.min(sizeColumn.values) : sizeColumn.minLocal
                    : sizeColumn.min;
                result.max = sizeColumn.max == null
                    ? sizeColumn.maxLocal == null ? d3.max(sizeColumn.values) : sizeColumn.maxLocal
                    : sizeColumn.max;
            }
            return result;
        }
        
        /**
         * Set customized domain, but don't change when nothing is set
         */
        export function applyCustomizedDomain(customizedDomain, forcedDomain: any[]): any[] {
            let domain: any[] = [undefined, undefined];

            if (forcedDomain && forcedDomain.length === 2) {
                domain = [forcedDomain[0], forcedDomain[1]];
            }

            if (customizedDomain && customizedDomain.length === 2) {
                if (customizedDomain[0] != null) {
                    domain[0] = customizedDomain[0];
                }
                if (customizedDomain[1] != null) {
                    domain[1] = customizedDomain[1];
                }
            }

            if (domain[0] == null && domain[1] == null) {
                return forcedDomain;//return untouched object
            }

            //do extra check to see if the user input was valid with the merged axis values.
            if (domain[0] != null && domain[1] != null) {
                if (domain[0] > domain[1]) {
                    return forcedDomain;
                }
            }

            return domain;
        }
        
        /**
         * Combine the forced domain with the actual domain if one of the values was set.
         * The forcedDomain is in 1st priority. Extends the domain if the any reference point requires it.
         */
        export function combineDomain(forcedDomain: any[], domain: any[], ensureDomain?: NumberRange): any[] {
            let combinedDomain: any[] = domain ? [domain[0], domain[1]] : [];

            if (ensureDomain) {
                if (combinedDomain[0] == null || ensureDomain.min < combinedDomain[0])
                    combinedDomain[0] = ensureDomain.min;

                if (combinedDomain[1] == null || ensureDomain.max > combinedDomain[1])
                    combinedDomain[1] = ensureDomain.max;
            }

            let domainBeforeForced: any[] = [combinedDomain[0], combinedDomain[1]];

            if (forcedDomain && forcedDomain.length === 2) {
                if (forcedDomain[0] != null) {
                    combinedDomain[0] = forcedDomain[0];
                }
                if (forcedDomain[1] != null) {
                    combinedDomain[1] = forcedDomain[1];
                }
                if (combinedDomain[0] > combinedDomain[1]) {
                    combinedDomain = domainBeforeForced;//this is invalid, so take the original domain considering the values and the reference line
                }
            }
            return combinedDomain;
        }

        export function createAxisLabel(properties: DataViewObject, label: string, unitType: string, y2: boolean = false): string {
            let propertyName = y2 ? 'secAxisStyle' : 'axisStyle';
            if (!properties || !properties[propertyName]) {
                return label;
            }

            let modifiedLabel;
            if (properties[propertyName] === axisStyle.showBoth) {
                modifiedLabel = label + ' (' + unitType + ')';//todo: localize
            }
            else if (properties[propertyName] === axisStyle.showUnitOnly) {
                modifiedLabel = unitType;
            }
            else {
                modifiedLabel = label;
            }
            return modifiedLabel;
        }

        export function scaleShouldClamp(combinedDomain: any[], domain: any[]): boolean {
            if (!combinedDomain || !domain || combinedDomain.length < 2 || domain.length < 2)
                return false;
            //when the start or end is different, clamp it
            return combinedDomain[0] !== domain[0] || combinedDomain[1] !== domain[1];
        }

        export function normalizeNonFiniteNumber(value: number): number {
            if (isNaN(value))
                return null;
            else if (value === Number.POSITIVE_INFINITY)
                return Number.MAX_VALUE;
            else if (value === Number.NEGATIVE_INFINITY)
                return -Number.MAX_VALUE;

            return value;
        }

        /**
         * Indicates whether the number is power of 10.
         */
        export function powerOfTen(d: any): boolean {
            let value = Math.abs(d);
            // formula log2(Y)/log2(10) = log10(Y)
            // because double issues this won't return exact value
            // we need to ceil it to nearest number.
            let log10: number = Math.log(value) / Math.LN10;
            log10 = Math.ceil(log10 - 1e-12);
            return value / Math.pow(10, log10) === 1;
        }
    }
}