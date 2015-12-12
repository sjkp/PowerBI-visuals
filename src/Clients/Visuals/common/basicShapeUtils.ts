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
    export module ShapeFactory {

        export module ShapeFactoryConsts {
            export const PaddingConstRatio: number = 0.01;
            export const TrianglePaddingConstRatio: number = 0.15;
            export const TriangleEndPaddingConstRatio: number = 0.85;
            export const ShapeConstRatio: number = 1.0 - (ShapeFactoryConsts.PaddingConstRatio * 2);
            export const SmallPaddingConstValue: number = 10;
            export const OvalRadiusConst: number = 2;
            export const OvalRadiusConstPadding: number = 0.2;
            export const ArrowLeftHeadPoint: Point = { x : 0.05, y : 0.42 };
            export const ArrowMiddleHeadPoint: Point = { x: 0.5, y: 0.016 };
            export const ArrowRightHeadPoint: Point = { x: 0.95, y: 0.42 };
            export const ArrowRightMiddleHeadPoint: Point = { x: 0.764, y: 0.42 };
            export const ArrowBottomRightPoint: Point = { x: 0.764, y: 0.993 }; 
            export const ArrowBottomLeftPoint: Point = { x: 0.246, y: 0.993 };
            export const ArrowLeftMiddleHeadPoint: Point = { x: 0.246, y: 0.42 };
        }

        /** this function creates a rectangle svg   */
        export function createRectangle(data: BasicShapeData, viewportHeight: number, viewportWidth: number, selectedElement: D3.Selection, degrees: number): void {
            let x = (viewportWidth * ShapeFactoryConsts.PaddingConstRatio) + (data.lineWeight / 2);
            let y = (viewportHeight * ShapeFactoryConsts.PaddingConstRatio) + (data.lineWeight / 2);
            let width = (viewportWidth * ShapeFactoryConsts.ShapeConstRatio) - (data.lineWeight);
            let height = (viewportHeight * ShapeFactoryConsts.ShapeConstRatio) - (data.lineWeight);
            let attrs = { x: x, y: y, width: width, height: height, rx: data.roundEdge, ry: data.roundEdge };
            let scale = getScale(width, height, degrees);

            createShape(data, viewportHeight, viewportWidth, selectedElement, degrees, scale, 'rect', attrs);
        }

        /** this function creates a oval svg   */
        export function createOval(data: BasicShapeData, viewportHeight: number, viewportWidth: number, selectedElement: D3.Selection, degrees: number): void {
            let widthForCircle = (viewportWidth / ShapeFactoryConsts.OvalRadiusConst).toString();
            let heightForCircle = (viewportHeight / ShapeFactoryConsts.OvalRadiusConst).toString();
            let radiusXForCircle = ((viewportWidth / (ShapeFactoryConsts.OvalRadiusConst + ShapeFactoryConsts.OvalRadiusConstPadding)) - data.lineWeight);
            let radiusYForCircle = ((viewportHeight / (ShapeFactoryConsts.OvalRadiusConst + ShapeFactoryConsts.OvalRadiusConstPadding))- data.lineWeight);
            let attrs = { cx: widthForCircle, cy: heightForCircle, rx: radiusXForCircle, ry: radiusYForCircle };

            let scale = getScale(viewportWidth, viewportHeight, degrees);

            createShape(data, viewportHeight, viewportWidth, selectedElement, degrees, scale, 'ellipse', attrs);
        }

        /** this function creates a line svg   */
        export function createLine(data: BasicShapeData, viewportHeight: number, viewportWidth: number, selectedElement: D3.Selection, degrees: number): void {
            let x1, y1, x2, y2;
            let width = (viewportWidth - ShapeFactoryConsts.SmallPaddingConstValue) - ShapeFactoryConsts.SmallPaddingConstValue;
            let height = (viewportHeight - ShapeFactoryConsts.SmallPaddingConstValue) - ShapeFactoryConsts.SmallPaddingConstValue;

            let ratio;
            if (degrees <= 45) {
                ratio = degrees / 90;

                x1 = viewportWidth / 2 + width * ratio;
                y1 = ShapeFactoryConsts.SmallPaddingConstValue;
                x2 = viewportWidth / 2 - width * ratio;
                y2 = (viewportHeight - ShapeFactoryConsts.SmallPaddingConstValue);
            } else if (degrees <= 135) {
                ratio = (degrees - 45) / 90;

                x1 = (viewportWidth - ShapeFactoryConsts.SmallPaddingConstValue);
                y1 = ShapeFactoryConsts.SmallPaddingConstValue + height * ratio;
                x2 = ShapeFactoryConsts.SmallPaddingConstValue;
                y2 = (viewportHeight - ShapeFactoryConsts.SmallPaddingConstValue) - height * ratio;
            } else if (degrees <= 225) {
                ratio = (degrees - 135) / 90;

                x1 = (viewportWidth - ShapeFactoryConsts.SmallPaddingConstValue) - width * ratio;
                y1 = (viewportHeight - ShapeFactoryConsts.SmallPaddingConstValue);
                x2 = ShapeFactoryConsts.SmallPaddingConstValue + width * ratio;
                y2 = ShapeFactoryConsts.SmallPaddingConstValue;
            } else if (degrees <= 315) {
                ratio = (degrees - 225) / 90;

                x1 = ShapeFactoryConsts.SmallPaddingConstValue;
                y1 = (viewportHeight - ShapeFactoryConsts.SmallPaddingConstValue) - height * ratio;
                x2 = (viewportWidth - ShapeFactoryConsts.SmallPaddingConstValue);
                y2 = ShapeFactoryConsts.SmallPaddingConstValue + height * ratio;
            } else if (degrees <= 360) {
                ratio = (degrees - 315) / 90;

                x1 = ShapeFactoryConsts.SmallPaddingConstValue + width * ratio;
                y1 = ShapeFactoryConsts.SmallPaddingConstValue;
                x2 = (viewportWidth - ShapeFactoryConsts.SmallPaddingConstValue) - width * ratio;
                y2 = (viewportHeight - ShapeFactoryConsts.SmallPaddingConstValue);
            }

            // create the inner path with the wanted shape
            selectedElement
                .append('svg')
                .attr({
                    width: viewportWidth,
                    height: viewportHeight
                })
                .append('line')
                .attr({
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2,
                })
                .style({
                    'vector-effect': 'non-scaling-stroke',
                    'stroke-width': data.lineWeight + 'px',
                    'stroke-opacity': data.lineTransparency / 100,
                    'stroke': data.lineColor
                });
        }

        /** this function creates a arrow svg   */
        export function createUpArrow(data: BasicShapeData, viewportHeight: number, viewportWidth: number, selectedElement: D3.Selection, degrees: number): void {
            let lineWeight = data.lineWeight;
            let viewportHeightWeight = viewportHeight - lineWeight;
            let viewportWidthWeight = viewportWidth - lineWeight;

            let arrowPoints = [
                { 'x': (viewportWidthWeight * ShapeFactoryConsts.ArrowLeftHeadPoint.x).toString(), 'y': (viewportHeightWeight * ShapeFactoryConsts.ArrowLeftHeadPoint.y).toString() },
                { 'x': (viewportWidthWeight * ShapeFactoryConsts.ArrowMiddleHeadPoint.x).toString(), 'y': (viewportHeightWeight * ShapeFactoryConsts.ArrowMiddleHeadPoint.y).toString() },
                { 'x': (viewportWidthWeight * ShapeFactoryConsts.ArrowRightHeadPoint.x).toString(), 'y': (viewportHeightWeight * ShapeFactoryConsts.ArrowRightHeadPoint.y).toString() },
                { 'x': (viewportWidthWeight * ShapeFactoryConsts.ArrowRightMiddleHeadPoint.x).toString(), 'y': (viewportHeightWeight * ShapeFactoryConsts.ArrowRightMiddleHeadPoint.y).toString() },
                { 'x': (viewportWidthWeight * ShapeFactoryConsts.ArrowBottomRightPoint.x).toString(), 'y': (viewportHeightWeight * ShapeFactoryConsts.ArrowBottomRightPoint.y).toString() },
                { 'x': (viewportWidthWeight * ShapeFactoryConsts.ArrowBottomLeftPoint.x).toString(), 'y': (viewportHeightWeight * ShapeFactoryConsts.ArrowBottomLeftPoint.y).toString() },
                { 'x': (viewportWidthWeight * ShapeFactoryConsts.ArrowLeftMiddleHeadPoint.x).toString(), 'y': (viewportHeightWeight * ShapeFactoryConsts.ArrowLeftMiddleHeadPoint.y).toString() },
            ];

            // create the inner path with the wanted shape
            createPathFromArray(data, arrowPoints, selectedElement, viewportHeight, viewportWidth, degrees);
        }

        /** this function creates a triangle svg   */
        export function createTriangle(data: BasicShapeData, viewportHeight: number, viewportWidth: number, selectedElement: D3.Selection, degrees: number): void {
            let lineWeight = data.lineWeight;
            // remove the basic line weight
            if (lineWeight > 3) {
                lineWeight -= 3;
            }

            let firstPointX = ((viewportWidth + lineWeight) * ShapeFactoryConsts.TrianglePaddingConstRatio);
            let firstPointY = (viewportHeight - ShapeFactoryConsts.SmallPaddingConstValue - lineWeight) < 0 ?
                (viewportHeight - ShapeFactoryConsts.SmallPaddingConstValue) : (viewportHeight - ShapeFactoryConsts.SmallPaddingConstValue - lineWeight);
            let secondPointY = ((viewportHeight + lineWeight) * ShapeFactoryConsts.TrianglePaddingConstRatio);
            let thirdPointX = ((viewportWidth - lineWeight) * ShapeFactoryConsts.TriangleEndPaddingConstRatio) < 0 ?
                (viewportWidth * ShapeFactoryConsts.TriangleEndPaddingConstRatio) : ((viewportWidth - lineWeight) * ShapeFactoryConsts.TriangleEndPaddingConstRatio);
            let thirdPointY = (viewportHeight - ShapeFactoryConsts.SmallPaddingConstValue - lineWeight) < 0 ?
                (viewportHeight - ShapeFactoryConsts.SmallPaddingConstValue) : (viewportHeight - lineWeight - ShapeFactoryConsts.SmallPaddingConstValue);
            let secondPointX = ((firstPointX + thirdPointX) / 2);

            if (firstPointX < 10) {
                firstPointX = ShapeFactoryConsts.SmallPaddingConstValue;
            }

            if (secondPointY < 10) {
                secondPointY = ShapeFactoryConsts.SmallPaddingConstValue;
            }

            let trianglePoints = [
                { 'x': firstPointX, 'y': firstPointY },
                { 'x': secondPointX, 'y': secondPointY },
                { 'x': thirdPointX, 'y': thirdPointY },
            ];

            createPathFromArray(data, trianglePoints, selectedElement, viewportHeight, viewportWidth, degrees);
        }

        /** this funcion adds a path to an svg element from an array of points (x,y) */
        function createPathFromArray(data: BasicShapeData, points: Object[], selectedElement: D3.Selection, viewportHeight: number, viewportWidth: number, degrees: number): void {
            let lineFunction = d3.svg.line()
                .x(function (d) { return d.x; })
                .y(function (d) { return d.y; })
                .interpolate('linear');
            let attrs = { d: lineFunction(points) + ' Z' };

            let scale = getScale(viewportWidth, viewportHeight, degrees);

            createShape(data, viewportHeight, viewportWidth, selectedElement, degrees, scale, 'path', attrs);
        }

        function createShape(data: BasicShapeData, viewportHeight: number, viewportWidth: number, selectedElement: D3.Selection, degrees: number, scale: number, shapeType: string, shapeAttrs: Object): void {
            selectedElement
                .append('div')
                .style({
                    'transform': 'rotate(' + degrees + 'deg) scale(' + scale + ')',
                    'transform-origin': 'center',
                    // for testing with phantomjs we need the webkit prefix
                    '-webkit-transform': 'rotate(' + degrees + 'deg) scale(' + scale + ')',
                    '-webkit-transform-origin': 'center',
                    'width': viewportWidth + 'px',
                    'height': viewportHeight + 'px'
                })
                .append('svg')
                .attr({
                    width: viewportWidth,
                    height: viewportHeight
                })
                .append(shapeType)
                .attr(shapeAttrs)
                .style({
                    'vector-effect': 'non-scaling-stroke',
                    'stroke-width': data.lineWeight + 'px',
                    'stroke': data.lineColor,
                    'stroke-opacity': data.lineTransparency / 100,
                    'fill': data.fillColor,
                    'fill-opacity': data.showFill === true ? data.shapeTransparency / 100 : 0
                });
        }

        // this function return the scale to add to the shape. 
        // it calculate it by the ratio of the original shape's diagonal and the shape's diagonal after rotate (the maximum diagonal that still fit to the container).
        // it calculate the shape's diagonal by the rotate angle.
        function getScale(width: number, height: number, degrees: number): number {
            let originalWidth = width;
            let originalHeight = height;
            let offsetAngle = Math.atan2(height, width);
            let originalFactor = Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2));
            let radians = (degrees / 180) * Math.PI;

            if (width >= height) {
                if (degrees < 90) {
                    radians += offsetAngle;
                } else if (degrees < 180) {
                    radians -= offsetAngle;
                } else if (degrees < 270) {
                    radians += offsetAngle;
                } else {
                    radians -= offsetAngle;
                }

                return (originalHeight / Math.abs(Math.sin(radians))) / originalFactor;
            }
            else {
                if (degrees < 90) {
                    radians -= offsetAngle;
                } else if (degrees < 180) {
                    radians += offsetAngle;
                } else if (degrees < 270) {
                    radians -= offsetAngle;
                } else {
                    radians += offsetAngle;
                }

                return (originalWidth / Math.abs(Math.cos(radians))) / originalFactor;
            }
        }
    }
}