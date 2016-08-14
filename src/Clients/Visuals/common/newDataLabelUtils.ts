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
    import ISize = shapes.ISize;

    export module NewDataLabelUtils {
        export const DefaultLabelFontSizeInPt = 9;
        export const MapPolylineOpacity = 0.5;
        export const LabelDensityBufferFactor = 3;
        export const LabelDensityPadding = 6;
        export let startingLabelOffset = 8;
        export let maxLabelOffset = 8;
        export let maxLabelWidth: number = 50;
        export let hundredPercentFormat = '0.00 %;-0.00 %;0.00 %';
        export let LabelTextProperties: TextProperties = {
            fontFamily: Font.Family.regularSecondary.css,
            fontSize: PixelConverter.fromPoint(DefaultLabelFontSizeInPt),
            fontWeight: 'normal',
        };
        export let defaultLabelColor = "#777777";
        export let defaultInsideLabelColor = "#ffffff"; //white
        export const horizontalLabelBackgroundPadding = 4;
        export const verticalLabelBackgroundPadding = 2;
        
        let labelBackgroundRounding = 4;
        let defaultLabelPrecision: number = undefined;
        let defaultCountLabelPrecision: number = 0;

        export let labelGraphicsContextClass: ClassAndSelector = createClassAndSelector('labelGraphicsContext');
        export let labelBackgroundGraphicsContextClass: ClassAndSelector = createClassAndSelector('labelBackgroundGraphicsContext');
        let labelsClass: ClassAndSelector = createClassAndSelector('label');
        let secondLineLabelClass: ClassAndSelector = createClassAndSelector('label-second-line');

        const linesGraphicsContextClass: ClassAndSelector = createClassAndSelector('leader-lines');
        const lineClass: ClassAndSelector = createClassAndSelector('line-label');

        export function drawDefaultLabels(context: D3.Selection, dataLabels: Label[], numeric: boolean = false, twoRows: boolean = false, hasTooltip: boolean = false): D3.UpdateSelection {
            let filteredDataLabels = _.filter(dataLabels, (d: Label) => d.isVisible);
            let labels = context.selectAll(labelsClass.selector)
                .data(filteredDataLabels, labelKeyFunction);
            labels.enter()
                .append("text")
                .classed(labelsClass.class, true);
            let labelAttr = {
                x: (d: Label) => {
                    return (d.boundingBox.left + (d.boundingBox.width / 2));
                },
                y: (d: Label) => {
                    if (d.hasBackground)
                        return d.boundingBox.top + d.boundingBox.height - verticalLabelBackgroundPadding;
                    else
                        return d.boundingBox.top + d.boundingBox.height;
                },
                dy: "-0.15em",
            };
            if (numeric) { // For numeric labels, we use a tighter bounding box, so remove the dy because it doesn't need to be centered
                labelAttr.dy = undefined;
            }

            labels
                .interrupt()
                .text((d: Label) => d.text)
                .attr(labelAttr)
                .style({
                    'fill': (d: Label) => d.fill,
                    'font-size': (d: Label) => PixelConverter.fromPoint(d.fontSize || DefaultLabelFontSizeInPt),
                    'text-anchor': (d: Label) => d.textAnchor,
                });
            labels.exit()
                .remove();

            let filteredCategoryLabels = _.filter(twoRows ? dataLabels : [], (d: Label) => d.isVisible && !_.isEmpty(d.secondRowText));
            let secondLineLabels = context.selectAll(secondLineLabelClass.selector)
                .data(filteredCategoryLabels, (d: Label, index: number) => { return d.identity ? d.identity.getKeyWithoutHighlight() : index; });
            secondLineLabels.enter()
                .append("text")
                .classed(secondLineLabelClass.class, true);

            labelAttr = {
                x: (d: Label) => {
                    return (d.boundingBox.left + (d.boundingBox.width / 2));
                },
                y: (d: Label) => {
                    let boundingBoxHeight = (d.text !== undefined) ? d.boundingBox.height / 2 : d.boundingBox.height;
                    if (d.hasBackground)
                        return d.boundingBox.top + boundingBoxHeight - verticalLabelBackgroundPadding;
                    else
                        return d.boundingBox.top + boundingBoxHeight;
                },
                dy: "-0.15em",
            };
            if (numeric) { // For numeric labels, we use a tighter bounding box, so remove the dy because it doesn't need to be centered
                labelAttr.dy = undefined;
            }
            secondLineLabels
                .interrupt()
                .text((d: Label) => d.secondRowText)
                .attr(labelAttr)
                .style({
                    'fill': (d: Label) => d.fill,
                    'font-size': (d: Label) => PixelConverter.fromPoint(d.fontSize || DefaultLabelFontSizeInPt),
                    'text-anchor': (d: Label) => d.textAnchor,
                });

            secondLineLabels.exit()
                .remove();

            if (hasTooltip) {
                labels.append('title').text((d: Label) => d.tooltip);
                secondLineLabels.append('title').text((d: Label) => d.tooltip);
                labels.style("pointer-events", "all");
                secondLineLabels.style("pointer-events", "all");
            }

            return labels;
        }

        export function animateDefaultLabels(context: D3.Selection, dataLabels: Label[], duration: number, numeric: boolean = false, easeType: string = 'cubic-in-out'): D3.UpdateSelection {
            let labels = context.selectAll(labelsClass.selector)
                .data(_.filter(dataLabels, (d: Label) => d.isVisible), labelKeyFunction);

            labels.enter()
                .append("text")
                .classed(labelsClass.class, true)
                .style('opacity', 0);

            let labelAttr = {
                x: (d: Label) => {
                    return (d.boundingBox.left + (d.boundingBox.width / 2));
                },
                y: (d: Label) => {
                    return d.boundingBox.top + d.boundingBox.height;
                },
                dy: "-0.15em",
            };
            if (numeric) { // For numeric labels, we use a tighter bounding box, so remove the dy because it doesn't need to be centered
                labelAttr.dy = undefined;
            }

            labels.text((d: Label) => d.text)
                .style({
                    'fill': (d: Label) => d.fill,
                    'font-size': (d: Label) => PixelConverter.fromPoint(d.fontSize || DefaultLabelFontSizeInPt),
                })
                .transition()
                .ease(easeType)
                .duration(duration)
                .attr(labelAttr)
                .style('opacity', 1);

            labels.exit()
                .transition()
                .duration(duration)
                .style('opacity', 0)
                .remove();

            return labels;
        }

        /** Draws black rectangles based on the bounding bx of labels, to be used in debugging */
        export function drawLabelBackground(context: D3.Selection, dataLabels: Label[], fill?: string, fillOpacity?: number): D3.UpdateSelection {
            let labelRects = context.selectAll("rect")
                .data(_.filter(dataLabels, (d: Label) => d.isVisible), labelKeyFunction);

            labelRects.enter()
                .append("rect");

            labelRects
                .attr({
                    x: (d: Label) => {
                        return d.boundingBox.left - horizontalLabelBackgroundPadding;
                    },
                    y: (d: Label) => {
                        return d.boundingBox.top - verticalLabelBackgroundPadding;
                    },
                    rx: labelBackgroundRounding,
                    ry: labelBackgroundRounding,
                    width: (d: Label) => {
                        return d.boundingBox.width + 2 * horizontalLabelBackgroundPadding;
                    },
                    height: (d: Label) => {
                        if (d.text === undefined && d.secondRowText === undefined) {
                                return 0;
                        }
                        return d.boundingBox.height + 2 * verticalLabelBackgroundPadding;
                    },
                })
                .style("fill", fill ? fill : "#000000")
                .style("fill-opacity", fillOpacity != null ? fillOpacity : 1);

            labelRects.exit()
                .remove();

            return labelRects;
        }

        export function drawLabelLeaderLines(context: D3.Selection, filteredDataLabels: Label[], key?: (data: any, index?: number) => any, leaderLineColor?: string) {
            if (context.select(linesGraphicsContextClass.selector).empty())
                context.append('g').classed(linesGraphicsContextClass.class, true);

            let lines = context.select(linesGraphicsContextClass.selector).selectAll('polyline')
                .data(filteredDataLabels, key);

            lines.enter()
                .append('polyline')
                .classed(lineClass.class, true);

            lines
                .attr('points', (d: Label) => {
                    return d.leaderLinePoints;
                }).
                style({
                    'stroke': (d: Label) => leaderLineColor ? leaderLineColor : d.fill,
                    'stroke-width': DonutLabelUtils.LineStrokeWidth,
                });

            lines
                .exit()
                .remove();
        }

        export function getLabelFormattedText(label: string | number, format?: string, formatter?: IValueFormatter): string {
            return formatter ? formatter.format(label) : formattingService.formatValue(label, format);
        }

        export function getDisplayUnitValueFromAxisFormatter(axisFormatter: IValueFormatter, labelSettings: VisualDataLabelsSettings): number {
            if (axisFormatter && axisFormatter.displayUnit && labelSettings.displayUnits === 0)
                return axisFormatter.displayUnit.value;
            return null;
        }

        function getLabelPrecision(precision: number, format: string): number {
            debug.assertAnyValue(format, 'format');

            if (precision !== defaultLabelPrecision)
                return precision;

            if (format) {
                // Calculate precision from positive format by default
                let positiveFormat = format.split(";")[0];
                let formatMetadata = NumberFormat.getCustomFormatMetadata(positiveFormat, true /*calculatePrecision*/);
                if (formatMetadata.hasDots) {
                    return formatMetadata.precision;
                }
            }
            // For count fields we do not want a precision by default
            return defaultCountLabelPrecision;
        }

        export function createColumnFormatterCacheManager(): IColumnFormatterCacheManager {
            return <IColumnFormatterCacheManager> {

                cache: { defaultFormatter: null, },
                getOrCreate(formatString: string, labelSetting: VisualDataLabelsSettings, value2?: number) {
                    if (formatString) {
                        let cacheKeyObject = {
                            formatString: formatString,
                            displayUnits: labelSetting.displayUnits,
                            precision: getLabelPrecision(labelSetting.precision, formatString),
                            value2: value2
                        };
                        let cacheKey = JSON.stringify(cacheKeyObject);
                        if (!this.cache[cacheKey])
                            this.cache[cacheKey] = valueFormatter.create(getOptionsForLabelFormatter(labelSetting, formatString, value2, cacheKeyObject.precision));
                        return this.cache[cacheKey];
                    }
                    if (!this.cache.defaultFormatter) {
                        this.cache.defaultFormatter = valueFormatter.create(getOptionsForLabelFormatter(labelSetting, formatString, value2, labelSetting.precision));
                    }
                    return this.cache.defaultFormatter;
                }
            };
        }

        function getOptionsForLabelFormatter(labelSetting: VisualDataLabelsSettings, formatString: string, value2?: number, precision?: number): ValueFormatterOptions {
            return {
                displayUnitSystemType: DisplayUnitSystemType.DataLabels,
                format: formatString,
                precision: precision,
                value: labelSetting.displayUnits,
                value2: value2,
                allowFormatBeautification: true,
            };
        }

        export function removeDuplicates(labelDataPoints: LabelDataPoint[]): LabelDataPoint[] {
            let uniqueLabelDataPoints: LabelDataPoint[] = [];
            let labelDataPointMap = {};
            let sameParentIsInArray = (newValue: any, array: any[], parentIsRect: boolean) => {
                return array.some((arrayValue) => {
                    if (parentIsRect) {
                        return shapes.Rect.equals(newValue.parentShape.rect, arrayValue.rect);
                    }
                    else {
                        return shapes.Point.equals(newValue.parentShape.point, arrayValue.point);
                    }
                });
            };
            for (let dataPoint of labelDataPoints) {
                let parentIsRect = dataPoint.parentType === LabelDataPointParentType.Rectangle;
                let resultsFromMap = labelDataPointMap[dataPoint.text];
                if (!resultsFromMap) {
                    uniqueLabelDataPoints.push(dataPoint);
                    labelDataPointMap[dataPoint.text] = [dataPoint.parentShape];
                }
                else {
                    if (!sameParentIsInArray(dataPoint, resultsFromMap, parentIsRect)) {
                        uniqueLabelDataPoints.push(dataPoint);
                        resultsFromMap.push(dataPoint.parentShape);
                    }
                }
            }
            return uniqueLabelDataPoints;
        }
           
        export function getDataLabelLayoutOptions(type: CartesianChartType): DataLabelLayoutOptions {
            switch (type) {
                case CartesianChartType.Scatter:
                    return {
                        maximumOffset: ScatterChart.dataLabelLayoutMaximumOffset,
                        startingOffset: ScatterChart.dataLabelLayoutStartingOffset,
                        offsetIterationDelta: ScatterChart.dataLabelLayoutOffsetIterationDelta,
                        allowLeaderLines: true,
                        attemptToMoveLabelsIntoViewport: true,
                    };
                default:
                    return {
                        maximumOffset: NewDataLabelUtils.maxLabelOffset,
                        startingOffset: NewDataLabelUtils.startingLabelOffset,
                        attemptToMoveLabelsIntoViewport: true,
                    };
            }
        }

        export function getTextSize(text: string, fontSize: number): ISize {
            let labelTextProperties = NewDataLabelUtils.LabelTextProperties;
            let properties = {
                text: text,
                fontFamily: labelTextProperties.fontFamily,
                fontSize: jsCommon.PixelConverter.fromPoint(fontSize),
                fontWeight: labelTextProperties.fontWeight,
            };
            return {
                width: TextMeasurementService.measureSvgTextWidth(properties),
                height: TextMeasurementService.estimateSvgTextHeight(properties),
            };
        }

        /**
         * Obtains the key from the label.  Index is required to use as a backup in cases
         * where labels have no key or identity.
         */
        function labelKeyFunction(label: Label, index: number): any {
            if (label.key) {
                return label.key;
            }
            if (label.identity) {
                return label.identity.getKeyWithoutHighlight();
            }
            return index;
        }
    }
}
