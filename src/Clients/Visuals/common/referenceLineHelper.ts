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
    export module ReferenceLineHelper {
        export const referenceLineProps = {
            show: 'show',
            displayName: 'displayName',
            lineColor: 'lineColor',
            transparency: 'transparency',
            value: 'value',
            style: 'style',
            position: 'position',
            dataLabelShow: 'dataLabelShow',
            dataLabelColor: 'dataLabelColor',
            dataLabelDecimalPoints: 'dataLabelDecimalPoints',
            dataLabelHorizontalPosition: 'dataLabelHorizontalPosition',
            dataLabelVerticalPosition: 'dataLabelVerticalPosition',
            dataLabelDisplayUnits: 'dataLabelDisplayUnits',
        };

        export function enumerateObjectInstances(enumeration: ObjectEnumerationBuilder, referenceLines: DataViewObjectMap, defaultColor: string, objectName: string): void {
            debug.assertValue(enumeration, 'enumeration');

            if (_.isEmpty(referenceLines)) {
                // NOTE: We do not currently have support for object maps in the property pane. For now we will generate a single reference line 
                // object that the format pane can handle.In the future we will need property pane support for multiple reference lines. Also, we're
                // assuming that the user-defined IDs will be numeric strings, this may change in the future and will likley be controlled by the property pane.
                let instance: VisualObjectInstance = {
                    selector: {
                        id: '0'
                    },
                    properties: {
                        show: false,
                        value: '',
                        lineColor: { solid: { color: defaultColor } },
                        transparency: 50,
                        style: lineStyle.dashed,
                        position: referenceLinePosition.back,
                        dataLabelShow: false,
                    },
                    objectName: objectName
                };

                enumeration.pushInstance(instance);

                return;
            }

            for (let referenceLine of referenceLines) {
                let referenceLineProperties = referenceLine.object;
                let show = DataViewObject.getValue(referenceLineProperties, referenceLineProps.show, false);
                let displayName = DataViewObject.getValue(referenceLineProperties, referenceLineProps.displayName);
                let value = DataViewObject.getValue(referenceLineProperties, referenceLineProps.value);
                let lineColor = DataViewObject.getValue(referenceLineProperties, referenceLineProps.lineColor, { solid: { color: defaultColor } });
                let transparency = DataViewObject.getValue(referenceLineProperties, referenceLineProps.transparency, 50);
                let style = DataViewObject.getValue(referenceLineProperties, referenceLineProps.style, lineStyle.dashed);
                let position = DataViewObject.getValue(referenceLineProperties, referenceLineProps.position, referenceLinePosition.back);
                let dataLabelShow = DataViewObject.getValue(referenceLineProperties, referenceLineProps.dataLabelShow, false);

                let instance: VisualObjectInstance = {
                    selector: {
                        id: referenceLine.id
                    },
                    properties: {
                        show: show,
                        displayName: displayName,
                        value: value,
                        lineColor: lineColor,
                        transparency: transparency,
                        style: style,
                        position: position,
                        dataLabelShow: dataLabelShow,
                    },
                    objectName: objectName
                };

                // Show the data label properties only if the user chose to show the data label
                if (dataLabelShow) {
                    let dataLabelColor = DataViewObject.getValue(referenceLineProperties, referenceLineProps.dataLabelColor, { solid: { color: defaultColor } });
                    let dataLabelHorizontalPosition = DataViewObject.getValue(referenceLineProperties, referenceLineProps.dataLabelHorizontalPosition, referenceLineDataLabelHorizontalPosition.left);
                    let dataLabelVerticalPosition = DataViewObject.getValue(referenceLineProperties, referenceLineProps.dataLabelVerticalPosition, referenceLineDataLabelVerticalPosition.above);
                    let dataLabelDecimalPoints = DataViewObject.getValue(referenceLineProperties, referenceLineProps.dataLabelDecimalPoints, undefined) < 0
                        ? undefined
                        : DataViewObject.getValue(referenceLineProperties, referenceLineProps.dataLabelDecimalPoints, undefined);
                    let dataLabelDisplayUnits = DataViewObject.getValue(referenceLineProperties, referenceLineProps.dataLabelDisplayUnits, 0);

                    instance.properties[referenceLineProps.dataLabelColor] = dataLabelColor;
                    instance.properties[referenceLineProps.dataLabelHorizontalPosition] = dataLabelHorizontalPosition;
                    instance.properties[referenceLineProps.dataLabelVerticalPosition] = dataLabelVerticalPosition;
                    instance.properties[referenceLineProps.dataLabelDisplayUnits] = dataLabelDisplayUnits;
                    instance.properties[referenceLineProps.dataLabelDecimalPoints] = dataLabelDecimalPoints;
                }

                enumeration.pushInstance(instance);
            }
        }

        export function render(options: ReferenceLineOptions): void {
            let graphicContext = options.graphicContext;
            let axes = options.axes;
            let referenceLineProperties = options.referenceLineProperties;
            let isHorizontal = options.isHorizontal;
            let viewport = options.viewport;
            let classAndSelector = options.classAndSelector;

            let xScale = axes.x.scale;
            let yScale = axes.y1.scale;

            let refValue = DataViewObject.getValue(referenceLineProperties, referenceLineProps.value, 0);
            let lineColor = DataViewObject.getValue(referenceLineProperties, referenceLineProps.lineColor, { solid: { color: options.defaultColor } });
            let transparency = DataViewObject.getValue<number>(referenceLineProperties, referenceLineProps.transparency);
            let style = DataViewObject.getValue(referenceLineProperties, referenceLineProps.style, lineStyle.dashed);
            let position = DataViewObject.getValue(referenceLineProperties, referenceLineProps.position, referenceLinePosition.back);

            let refLine = graphicContext.select(classAndSelector.selector);
                       
            let index = $(refLine[0]).index();
            let isRefLineExists = index !== -1; 
            let isPositionChanged = true;
            if (isRefLineExists) {
                let lastIndex = $(refLine[0]).siblings().length;
                if (position === referenceLinePosition.back && index === 0)
                    isPositionChanged = false;
                else if (position === referenceLinePosition.front && index === lastIndex)
                    isPositionChanged = false;
            }

            if (isRefLineExists && isPositionChanged) 
                refLine.remove();
            
            if (!isRefLineExists || isPositionChanged) 
                refLine = (position === referenceLinePosition.back) ? graphicContext.insert('line', ":first-child") : graphicContext.append('line');            

            let refLineX1 = isHorizontal ? 0 : xScale(refValue);
            let refLineY1 = isHorizontal ? yScale(refValue) : 0;
            let refLineX2 = isHorizontal ? viewport.width : xScale(refValue);
            let refLineY2 = isHorizontal ? yScale(refValue) : viewport.height;

            refLine.attr({
                'class': classAndSelector.class,
                x1: refLineX1,
                y1: refLineY1,
                x2: refLineX2,
                y2: refLineY2,
            })
                .style({
                    'stroke': lineColor.solid.color,
                });

            if (transparency != null) 
                refLine.style('stroke-opacity', ((100 - transparency) / 100));            

            if (style === lineStyle.dashed) {
                refLine.style('stroke-dasharray', ("5, 5"));
            }
            else if (style === lineStyle.dotted) {
                refLine.style({
                    'stroke-dasharray': ("1, 5"),
                    'stroke-linecap': "round"
                });
            }
            else if (style === lineStyle.solid) {
                refLine.style({
                    'stroke-dasharray': null,
                    'stroke-linecap': null
                });
            }
        }

        export function createLabelDataPoint(options: ReferenceLineDataLabelOptions): LabelDataPoint {
            let offsetRefLine = 5;

            let axes = options.axes;
            let referenceLineProperties = options.referenceLineProperties;
            let isHorizontal = options.isHorizontal;
            let viewport = options.viewport;

            let xScale = axes.x.scale;
            let yScale = axes.y1.scale;

            // Get the data label properties                
            let refValue = DataViewObject.getValue(referenceLineProperties, referenceLineProps.value, 0);
            let color = DataViewObject.getValue<Fill>(referenceLineProperties, referenceLineProps.dataLabelColor, { solid: { color: options.defaultColor } });
            let decimalPoints: number = <number>(referenceLineProperties[referenceLineProps.dataLabelDecimalPoints] < 0 ? undefined : referenceLineProperties[referenceLineProps.dataLabelDecimalPoints]);
            let horizontalPosition = referenceLineProperties[referenceLineProps.dataLabelHorizontalPosition] || referenceLineDataLabelHorizontalPosition.left;
            let verticalPosition = referenceLineProperties[referenceLineProps.dataLabelVerticalPosition] || referenceLineDataLabelVerticalPosition.above;
            let displayUnits = DataViewObject.getValue(referenceLineProperties, referenceLineProps.dataLabelDisplayUnits, 0);

            // Format the reference line data label text according to the matching axis formatter
            // When options is null default formatter is used either boolean, numeric, or text
            let axisFormatter = isHorizontal ? axes.y1.formatter : axes.x.formatter;
            let formatterForReferenceLineDataLabel = axisFormatter;

            if (axisFormatter.options != null) {
                let formatterOptions = Prototype.inherit(axisFormatter.options);
                formatterOptions.precision = decimalPoints;
                formatterOptions.value = displayUnits;
                formatterOptions.detectAxisPrecision = false;
                formatterForReferenceLineDataLabel = valueFormatter.create(formatterOptions);
            }

            let text: string = NewDataLabelUtils.getLabelFormattedText(formatterForReferenceLineDataLabel.format(<number>refValue));

            let properties: TextProperties = {
                text: text,
                fontFamily: dataLabelUtils.LabelTextProperties.fontFamily,
                fontSize: dataLabelUtils.LabelTextProperties.fontSize,
                fontWeight: dataLabelUtils.LabelTextProperties.fontWeight,
            };

            // Get the height and with of the text element that will be created in order to place it correctly
            let rectWidth: number = TextMeasurementService.measureSvgTextWidth(properties);
            let rectHeight: number = TextMeasurementService.estimateSvgTextHeight(properties);

            let dataLabelX: number;
            let dataLabelY: number;

            let x1 = isHorizontal ? 0 : xScale(refValue);
            let y1 = isHorizontal ? yScale(refValue) : 0;
            let x2 = isHorizontal ? viewport.width : xScale(refValue);
            let y2 = isHorizontal ? yScale(refValue) : viewport.height;
            let validPositions = [NewPointLabelPosition.Above];

            if (isHorizontal) {
                // Horizontal line. y1 = y2
                dataLabelX = (horizontalPosition === referenceLineDataLabelHorizontalPosition.left) ? x1 + offsetRefLine : x2 - (rectWidth / 2) - offsetRefLine;
                dataLabelY = y1;
                validPositions = (verticalPosition === referenceLineDataLabelVerticalPosition.above) ? [NewPointLabelPosition.Above] : [NewPointLabelPosition.Below];
            }
            else {
                // Vertical line. x1 = x2 
                dataLabelX = x1;
                dataLabelY = (verticalPosition === referenceLineDataLabelVerticalPosition.above) ? y1 + (rectHeight / 2) + offsetRefLine : y2 - (rectHeight / 2) - offsetRefLine;
                validPositions = (horizontalPosition === referenceLineDataLabelHorizontalPosition.left) ? [NewPointLabelPosition.Left] : [NewPointLabelPosition.Right];
            }

            let textWidth = TextMeasurementService.measureSvgTextWidth(properties);
            let textHeight = TextMeasurementService.estimateSvgTextHeight(properties, true /* tightFitForNumeric */);
            let parentShape: LabelParentPoint;

            parentShape = {
                point: {
                    x: dataLabelX,
                    y: dataLabelY,
                },
                radius: 0,
                validPositions: validPositions,
            };
            
            return {
                isPreferred: true,
                text: text,
                textSize: {
                    width: textWidth,
                    height: textHeight,
                },
                outsideFill: color.solid.color,
                insideFill: null,
                parentShape: parentShape,
                parentType: LabelDataPointParentType.Point,
                fontSize: 9,
                identity: null,
                secondRowText: null,
                key: options.key,
            };
        }

        export function extractReferenceLineValue(referenceLineProperties: DataViewObject): number {
            let referenceLineValue: number = null;

            if (referenceLineProperties && DataViewObject.getValue(referenceLineProperties, ReferenceLineHelper.referenceLineProps.show, false))
                referenceLineValue = DataViewObject.getValue(referenceLineProperties, ReferenceLineHelper.referenceLineProps.value, null);

            return referenceLineValue;
        }
    }
}