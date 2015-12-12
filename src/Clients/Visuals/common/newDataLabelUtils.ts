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

    export module NewDataLabelUtils {
        export const DefaultLabelFontSizeInPt = 9;
        export let startingLabelOffset = 8;
        export let maxLabelOffset = 8;
        export let maxLabelWidth: number = 50;
        export let hundredPercentFormat = '0.00 %;-0.00 %;0.00 %';
        export let LabelTextProperties: TextProperties = {
            fontFamily: 'wf_standard-font',
            fontSize: PixelConverter.fromPoint(DefaultLabelFontSizeInPt),
            fontWeight: 'normal',
        };
        export let defaultLabelColor = "#777777";
        export let defaultInsideLabelColor = "#ffffff"; //white
        let horizontalLabelBackgroundMargin = 4;
        let verticalLabelBackgroundMargin = 2;
        let labelBackgroundRounding = 4;
        let defaultLabelPrecision: number = undefined;
        let defaultCountLabelPrecision: number = 0;

        export let labelGraphicsContextClass: ClassAndSelector = createClassAndSelector('labelGraphicsContext');
        export let labelBackgroundGraphicsContextClass: ClassAndSelector = createClassAndSelector('labelBackgroundGraphicsContext');
        let labelsClass: ClassAndSelector = createClassAndSelector('label');

        export function drawDefaultLabels(context: D3.Selection, dataLabels: Label[], numeric: boolean = false): D3.UpdateSelection {
            let labels = context.selectAll(labelsClass.selector)
                .data(_.filter(dataLabels, (d: Label) => d.isVisible), (d: Label, index: number) => { return d.identity ? d.identity.getKeyWithoutHighlight() : index; });

            labels.enter()
                .append("text")
                .classed(labelsClass.class, true);

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

            labels
                .text((d: Label) => d.text)
                .attr(labelAttr)
                .style({
                    'fill': (d: Label) => d.fill,
                    'font-size': (d: Label) => PixelConverter.fromPoint(d.fontSize || DefaultLabelFontSizeInPt)
                });

            labels.exit()
                .remove();

            return labels;
        }

        export function animateDefaultLabels(context: D3.Selection, dataLabels: Label[], duration: number, numeric: boolean = false, easeType: string = 'cubic-in-out'): D3.UpdateSelection {
            let labels = context.selectAll(labelsClass.selector)
                .data(_.filter(dataLabels, (d: Label) => d.isVisible), (d: Label, index: number) => { return d.identity ? d.identity.getKeyWithoutHighlight() : index; });

            labels.enter()
                .append("text")
                .classed(labelsClass.class, true);

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

            labels
                .text((d: Label) => d.text)
                .style({
                    'fill': (d: Label) => d.fill,
                    'font-size': (d: Label) => PixelConverter.fromPoint(d.fontSize || DefaultLabelFontSizeInPt),
                })
                .transition()
                .ease(easeType)
                .duration(duration)
                .attr(labelAttr);

            labels.exit()
                .remove();

            return labels;
        }

        /** Draws black rectangles based on the bounding bx of labels, to be used in debugging */
        export function drawLabelBackground(context: D3.Selection, dataLabels: Label[], fill?: string, fillOpacity?: number): D3.UpdateSelection {
            let labelRects = context.selectAll("rect")
                .data(_.filter(dataLabels, (d: Label) => d.isVisible));

            labelRects.enter()
                .append("rect");

            labelRects
                .attr({
                    x: (d: Label) => {
                        return d.boundingBox.left - horizontalLabelBackgroundMargin;
                    },
                    y: (d: Label) => {
                        return d.boundingBox.top - verticalLabelBackgroundMargin;
                    },
                    rx: labelBackgroundRounding,
                    ry: labelBackgroundRounding,
                    width: (d: Label) => {
                        return d.boundingBox.width + 2 * horizontalLabelBackgroundMargin;
                    },
                    height: (d: Label) => {
                        return d.boundingBox.height + 2 * verticalLabelBackgroundMargin;
                    },
                })
                .style("fill", fill ? fill : "#000000")
                .style("fill-opacity", fillOpacity != null ? fillOpacity : 1);

            labelRects.exit()
                .remove();

            return labelRects;
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

        export function removeDuplicates(labelDataPoints: LabelDataPoint[]): LabelDataPoint[]{
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
                let parentIsRect = dataPoint.isParentRect;
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
    }
}
