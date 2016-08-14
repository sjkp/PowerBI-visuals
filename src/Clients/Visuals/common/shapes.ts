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
    "use strict";

    export module shapes {
        import Utility = jsCommon.Utility;

        export class Polygon {

            private _absoluteCentroid: IPoint;
            private _absoluteBoundingRect: Rect;
            public polygonPoints: IPoint[];
            public pixelBoundingRect: Rect;

            constructor(absolutePoints: Float64Array) {
                this.polygonPoints = this.convertArrayPathToPoints(absolutePoints);
            }

            public absoluteCentroid(): IPoint {
                if (this._absoluteCentroid == null) {
                    this._absoluteCentroid = this.calculatePolygonCentroid();
                }
                return this._absoluteCentroid;
            }

            public absoluteBoundingRect(): Rect {
                if (this._absoluteBoundingRect == null) {
                    this._absoluteBoundingRect = this.calculateBoundingRect();
                }
                return this._absoluteBoundingRect;
            }          

            /**
             * Check if label text contain in polygon shape.
             * 
             * @return true/false is the label fit in polygon.
             * measure if rects points are inside the polygon shape
             * return true if there is at least 3 point inside the polygon
             */
            public contains(rect: IRect): boolean {
                let topLeft: IPoint = { x: rect.left, y: rect.top };
                let topRight: IPoint = { x: rect.left + rect.width, y: rect.top };
                let bottomLeft: IPoint = { x: rect.left, y: rect.top + rect.height };
                let bottomRight: IPoint = { x: rect.left + rect.width, y: rect.top + rect.height };

                return (this.inside(topLeft)
                    && this.inside(topRight)
                    && this.inside(bottomLeft)
                    && this.inside(bottomRight));
            }

            /**
            * Check if label text is outside of polygon shape.
            * It checks 8 points in the label. TopLeft, TopCenter, TopRight, MiddleLeft, MiddleRight, BottomLeft, BottomMiddle, BottomRight
            * @return true/false is there is any conflict (at least one point inside the shape).
            */
            public conflicts(rect: IRect): boolean {
                if (!this.isConflictWithBoundingBox(rect)) {
                    return false;
                }
                let topLeft: IPoint = { x: rect.left, y: rect.top };
                let topCenter: IPoint = { x: rect.left + rect.width/2, y: rect.top };
                let topRight: IPoint = { x: rect.left + rect.width, y: rect.top };
                let bottomLeft: IPoint = { x: rect.left, y: rect.top + rect.height };
                let bottomCenter: IPoint = { x: rect.left + rect.width/2, y: rect.top + rect.height };
                let bottomRight: IPoint = { x: rect.left + rect.width, y: rect.top + rect.height };
                let middleLeft: IPoint = { x: rect.left, y: rect.top + rect.height / 2};
                let middleRight: IPoint = { x: rect.left + rect.width, y: rect.top + rect.height/2 };

                return (this.inside(topLeft)
                    || this.inside(topCenter)
                    || this.inside(topRight)
                    || this.inside(bottomLeft)
                    || this.inside(bottomCenter)
                    || this.inside(bottomRight)
                    || this.inside(middleLeft)
                    || this.inside(middleRight));
            }

            /**
            * returns intersection point of a line (depicted by two points) and a polygon.
            * 
            * @return the point of intersection or null if there is no intersection.
            */
            public lineIntersectionPoint(p0: IPoint, p1: IPoint): IPoint {
                for (var i = 0; i < this.polygonPoints.length; i++) {
                    let p2: IPoint = this.polygonPoints[i];
                    let p3: IPoint = (i === this.polygonPoints.length - 1 ? this.polygonPoints[0] : this.polygonPoints[i + 1]);

                    let intersection = this.getLineIntersection(p0, p1, p2, p3);

                    if (intersection !== null) {
                        return intersection;
                    }
                }

                return null;
            }

            /**
             * calculate Polygon Area.
             *
             * @return the area of the polygon (as number).
             */
            public static calculateAbsolutePolygonArea(polygonPoints: IPoint[]): number {
                let i, j = 1;
                let area = 0.0;

                for (i = 0; i < polygonPoints.length; i++) {
                    area += polygonPoints[i].x * polygonPoints[j].y - polygonPoints[j].x * polygonPoints[i].y;
                    j = (j + 1) % polygonPoints.length;
                }
                area *= 0.5;
                return area;
            }

            /**
            * Check if label text is outside of polygon bounding box.
            * 
            * @return true/false is there is any conflict (at least one point inside the shape).
            */
            private isConflictWithBoundingBox(rect: IRect): boolean {
                return Rect.isIntersecting(this.absoluteBoundingRect(), rect);
            }

            /**
             * Calculate Polygon Centroid.
             *
             * @return 'center' point of the polygon.
             * calculate the polygon area
             * calculate the average points of the polygon by x & y axis. 
             * divided the average point by the area
             */
            private calculatePolygonCentroid(): IPoint {
                let area, tempPoint, cx, cy, i, j: number;
                
                /* First calculate the polygon's signed area A */
                area = Polygon.calculateAbsolutePolygonArea(this.polygonPoints);

                /* Now calculate the centroid coordinates Cx and Cy */
                cx = cy = 0.0;
                j = 1;
                for (i = 0; i < this.polygonPoints.length; i++) {
                    tempPoint = this.polygonPoints[i].x * this.polygonPoints[j].y - this.polygonPoints[j].x * this.polygonPoints[i].y;
                    cx += (this.polygonPoints[i].x + this.polygonPoints[j].x) * tempPoint;
                    cy += (this.polygonPoints[i].y + this.polygonPoints[j].y) * tempPoint;
                    j = (j + 1) % this.polygonPoints.length;
                }
                cx = cx / (6.0 * area);
                cy = cy / (6.0 * area);

                return {
                    x: cx,
                    y: cy,
                };
            }

            private calculateBoundingRect(): Rect {
                let minX: number = Number.POSITIVE_INFINITY;
                let minY: number = Number.POSITIVE_INFINITY;
                let maxX: number = Number.NEGATIVE_INFINITY;
                let maxY: number = Number.NEGATIVE_INFINITY;

                for (let i = 0; i < this.polygonPoints.length; i++) {
                    if (this.polygonPoints[i].x < minX) {
                        minX = this.polygonPoints[i].x;
                    } else if (this.polygonPoints[i].x > maxX) {
                        maxX = this.polygonPoints[i].x;
                    }

                    if (this.polygonPoints[i].y < minY) {
                        minY = this.polygonPoints[i].y;
                    } else if (this.polygonPoints[i].y > maxY) {
                        maxY = this.polygonPoints[i].y;
                    }
                }

                return {
                    left: minX,
                    top: minY,
                    width: maxX - minX,
                    height: maxY - minY
                };
            }

            /**
             * Check if point exist inside polygon shape.
             * 
             * @return true/false if point exist inside shape.
             * ray-casting algorithm based on:
             * http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
             */
            private inside(point: IPoint): boolean {
                var x = point.x, y = point.y;

                var insideVar: boolean = false;
                for (var i = 0, j = this.polygonPoints.length - 1; i < this.polygonPoints.length; j = i++) {
                    var xi = this.polygonPoints[i].x, yi = this.polygonPoints[i].y;
                    var xj = this.polygonPoints[j].x, yj = this.polygonPoints[j].y;

                    var intersect: boolean = ((yi > y) !== (yj > y))
                        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                    if (intersect) {
                        insideVar = !insideVar;
                    }
                }
                return insideVar;
            };

            /**
             * Checks if a line (presented as two points) intersects with a another line
             */
            private getLineIntersection(line0p1: IPoint, line0p2: IPoint, line1p1: IPoint, line1p2: IPoint): IPoint {
                let p0_x: number = line0p1.x;
                let p0_y: number = line0p1.y;
                let p1_x: number = line0p2.x;
                let p1_y: number = line0p2.y;
                let p2_x: number = line1p1.x;
                let p2_y: number = line1p1.y;
                let p3_x: number = line1p2.x;
                let p3_y: number = line1p2.y;

                let s1_x: number = p1_x - p0_x;
                let s1_y: number = p1_y - p0_y;
                let s2_x: number = p3_x - p2_x;
                let s2_y: number = p3_y - p2_y;

                //Calculating collisions using cross products
                let s: number = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
                let t: number = (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

                // 0<=s<=1 and 0<=t<=1 ensures that the collision is part of the original line
                if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
                    // Collision detected
                    return { x: (p0_x + (t * s1_x)), y: (p0_y + (t * s1_y)) };
                }

                return null; // No collision
            }

            private convertArrayPathToPoints(path: Float64Array): IPoint[] {
                let pointsRes: IPoint[] = [];

                for (var i = 0; i < path.length; i += 2) {
                    let x = path[i];
                    let y = path[i + 1];
                    let newPoint = {
                        x: x,
                        y: y,
                    };
                    pointsRes.push(newPoint);
                }
                return pointsRes;
            }
        }

        export module Point {

            export function offset(point: IPoint, offsetX: number, offsetY: number): IPoint {
                let newPointX = ((point.x + offsetX) >= 0) ? (point.x + offsetX) : 0;
                let newPointY = ((point.y + offsetY) >= 0) ? (point.y + offsetY) : 0;
                return { x: newPointX, y: newPointY };
            }

            export function equals(point: IPoint, other: IPoint): boolean {
                return point !== undefined && point !== null && other !== undefined && other !== null && point.x === other.x && point.y === other.y;
            }

            export function clone(point: IPoint): IPoint {
                return (point !== null) ? { x: point.x, y: point.y } : null;
            }

            export function toString(point: IPoint): string {
                return "{x:" + point.x + ", y:" + point.y + "}";
            }

            export function serialize(point: IPoint): string {
                return point.x + "," + point.y;
            }

            export function getDistance(point: IPoint, other: IPoint): number {
                if ((point === null) || (other) === null) {
                    return null;
                }
                let diffX = other.x - point.x;
                let diffY = other.y - point.y;
                return Math.sqrt(diffX * diffX + diffY * diffY);
            }

            export function equalWithPrecision(point1: IPoint, point2: IPoint): boolean {
                return point1 === point2 ||
                    (point1 !== undefined && point2 !== undefined && Double.equalWithPrecision(point1.x, point2.x) && Double.equalWithPrecision(point1.y, point2.y));
            }

            export function parsePoint(value: any, defaultValue?: IPoint): IPoint {
                if (value === null) {
                    return (defaultValue === undefined) ? null : defaultValue;
                } else if (value === undefined) {
                    return (defaultValue === undefined) ? null : defaultValue;
                } else {
                      if (value.length === 2) {
                        return { x: Utility.parseNumber(value[0]), y: Utility.parseNumber(value[1]) };
                      } else if (typeof value === "string") {
                          let parts = (<string>value).split(",");
                          if (parts.length !== 2) {
                              return (defaultValue === undefined) ? null : defaultValue;
                          }
                          return { x: Utility.parseNumber(parts[0]), y: Utility.parseNumber(parts[1]) };
                    } else if ((value.length !== 2) && (typeof value !== "string")) {
                          return (defaultValue === undefined) ? null : defaultValue;
                      }
                        else {
                        return { x: Utility.parseNumber(value.x), y: Utility.parseNumber(value.y) };
                    }
                }
            }
        }

        export module Size {

            export function isEmpty(size: ISize): boolean {
                return size.width === 0 && size.height === 0;
            }

            export function equals(size: ISize, other: ISize): boolean {
                return size !== undefined && size !== null && other !== undefined && other !== null && size.width === other.width && size.height === other.height;
            }

            export function clone(size: ISize): ISize {
                return (size !== null) ? { width: size.width, height: size.height } : null;
            }

            export function inflate(size: ISize, padding: IThickness): ISize {
                let result = clone(size);
                if (padding) {
                    result.width += padding.left + padding.right;
                    result.height += padding.top + padding.bottom;
                }
                return result;
            }

            export function deflate(size: ISize, padding: IThickness): ISize {
                let result = clone(size);
                if (padding) {
                    result.width = result.width - padding.left - padding.right;
                    if (result.width < 0) {
                        result.width = 0;
                    }
                    result.height = result.height - padding.top - padding.bottom;
                    if (result.height < 0) {
                        result.height = 0;
                    }
                }
                return result;
            }

            export function combine(size: ISize, other: ISize): ISize {
                if (other) {
                    size.width = Math.max(size.width, other.width);
                    size.height = Math.max(size.height, other.height);
                }
                return size;
            }

            export function toRect(size: ISize): IRect {
                return { left: 0, top: 0, width: size.width, height: size.height };
            }

            export function toString(size: ISize): string {
                return "{width:" + size.width + ", height:" + size.height + "}";
            }

            export function equal(size1: ISize, size2: ISize): boolean {
                return size1 === size2 ||
                    (size1 !== undefined && size2 !== undefined && size1.width === size2.width && size1.height === size2.height);
            }

            export function equalWithPrecision(size1: ISize, size2: ISize): boolean {
                return size1 === size2 ||
                    (size1 !== undefined && size2 !== undefined && Double.equalWithPrecision(size1.width, size2.width) && Double.equalWithPrecision(size1.height, size2.height));
            }

            export function parseSize(value: any, defaultValue?: ISize): ISize {
                if (value === null) {
                    return (defaultValue === undefined) ? null : defaultValue;
                } else if (value === undefined) {
                    return (defaultValue === undefined) ? null : defaultValue;
                } else {
                    if (value.length === 2) {
                        return { width: Utility.parseNumber(value[0]), height: Utility.parseNumber(value[1]) };
                    } else if (typeof value === "string") {
                        let parts = (<string>value).split(",");
                        if (parts.length !== 2) {
                            return (defaultValue === undefined) ? null : defaultValue;
                        }
                        return { width: Utility.parseNumber(parts[0]), height: Utility.parseNumber(parts[1]) };
                    }
                      else if ((value.length !== 2) && (typeof value !== "string")) {
                            return (defaultValue === undefined) ? null : defaultValue;
                    } else {
                        return { width: Utility.parseNumber(value.width), height: Utility.parseNumber(value.height) };
                    }
                }
            }
        }

        export module Rect {

            export function getOffset(rect: IRect): IPoint {
                return { x: rect.left, y: rect.top };
            }

            export function getSize(rect: IRect): ISize {
                return { width: rect.width, height: rect.height };
            }

            export function setSize(rect: IRect, value: ISize): void {
                rect.width = value.width;
                rect.height = value.height;
            }

            export function right(rect: IRect): number {
                return rect.left + rect.width;
            }

            export function bottom(rect: IRect): number {
                return rect.top + rect.height;
            }

            export function topLeft(rect: IRect): IPoint {
                return { x: rect.left, y: rect.top };
            }

            export function topRight(rect: IRect): IPoint {
                return { x: rect.left + rect.width, y: rect.top };
            }

            export function bottomLeft(rect: IRect): IPoint {
                return { x: rect.left, y: rect.top + rect.height };
            }

            export function bottomRight(rect: IRect): IPoint {
                return { x: rect.left + rect.width, y: rect.top + rect.height };
            }

            export function equals(rect: IRect, other: IRect): boolean {
                return other !== undefined && other !== null &&
                    rect.left === other.left && rect.top === other.top && rect.width === other.width && rect.height === other.height;
            }

            export function clone(rect: IRect): IRect {
                return (rect !== null) ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null;
            }

            export function toString(rect: IRect): string {
                return "{left:" + rect.left + ", top:" + rect.top + ", width:" + rect.width + ", height:" + rect.height + "}";
            }

            export function offset(rect: IRect, offsetX: number, offsetY: number): IRect {
                let newLeft = ((rect.left + offsetX) >= 0) ? rect.left + offsetX : 0;
                let newTop = ((rect.top + offsetY) >= 0) ? rect.top + offsetY : 0;

                return { left: newLeft, top: newTop, width: rect.width, height: rect.height };
            }

            export function inflate(rect: IRect, padding: IThickness): IRect {
                let result = clone(rect);
                if (padding) {
                    result.left -= padding.left;
                    result.top -= padding.top;
                    result.width += padding.left + padding.right;
                    result.height += padding.top + padding.bottom;
                }
                return result;
            }

            export function deflate(rect: IRect, padding: IThickness): IRect {
                let result = clone(rect);
                if (padding) {
                    result.left += padding.left;
                    result.top += padding.top;
                    result.width -= padding.left + padding.right;
                    result.height -= padding.top + padding.bottom;
                }
                return result;
            }

            export function inflateBy(rect: IRect, padding: number): IRect {
                return { left: rect.left - padding, top: rect.top - padding, width: rect.width + padding + padding, height: rect.height + padding + padding };
            }

            export function deflateBy(rect: IRect, padding: number): IRect {
                return { left: rect.left + padding, top: rect.top + padding, width: rect.width - padding - padding, height: rect.height - padding - padding };
            }
            
            /**
             * Get closest point.
             * 
             * @return the closest point on the rect to the (x,y) point given.
             * In case the (x,y) given is inside the rect, (x,y) will be returned.
             * Otherwise, a point on a border will be returned.
             */
            export function getClosestPoint(rect: IRect, x: number, y: number): IPoint {
                return {
                    x: Math.min(Math.max(rect.left, x), rect.left + rect.width),
                    y: Math.min(Math.max(rect.top, y), rect.top + rect.height)
                };
            }

            export function equal(rect1: IRect, rect2: IRect): boolean {
                return rect1 === rect2 ||
                    (rect1 !== undefined && rect2 !== undefined && rect1.left === rect2.left && rect1.top === rect2.top && rect1.width === rect2.width && rect1.height === rect2.height);
            }

            export function equalWithPrecision(rect1: IRect, rect2: IRect): boolean {
                return rect1 === rect2 ||
                    (rect1 !== undefined && rect2 !== undefined &&
                    Double.equalWithPrecision(rect1.left, rect2.left) && Double.equalWithPrecision(rect1.top, rect2.top) &&
                    Double.equalWithPrecision(rect1.width, rect2.width) && Double.equalWithPrecision(rect1.height, rect2.height));
            }

            export function isEmpty(rect: IRect): boolean {
                return rect === undefined || rect === null || (rect.width === 0 && rect.height === 0);
            }

            export function containsPoint(rect: IRect, point: IPoint): boolean {
                if ((rect === null) || (point === null)) {
                    return false;
                }
                return Double.lessOrEqualWithPrecision(rect.left, point.x) &&
                    Double.lessOrEqualWithPrecision(point.x, rect.left + rect.width) &&
                    Double.lessOrEqualWithPrecision(rect.top, point.y) &&
                    Double.lessOrEqualWithPrecision(point.y, rect.top + rect.height);
            }

            export function isIntersecting(rect1: IRect, rect2: IRect): boolean {
                if (!rect1 || !rect2) {
                    return false;
                }
                let left = Math.max(rect1.left, rect2.left);
                let right = Math.min(rect1.left + rect1.width, rect2.left + rect2.width);
                if (left > right) {
                    return false;
                }
                let top = Math.max(rect1.top, rect2.top);
                let bottom = Math.min(rect1.top + rect1.height, rect2.top + rect2.height);
                return top <= bottom;
            }

            export function intersect(rect1: IRect, rect2: IRect): IRect {
                if (!rect1) {
                    return rect2;
                }
                if (!rect2) {
                    return rect1;
                }
                let left = Math.max(rect1.left, rect2.left);
                let top = Math.max(rect1.top, rect2.top);
                let right = Math.min(rect1.left + rect1.width, rect2.left + rect2.width);
                let bottom = Math.min(rect1.top + rect1.height, rect2.top + rect2.height);
                if (left <= right && top <= bottom) {
                    return { left: left, top: top, width: right - left, height: bottom - top };
                } else {
                    return { left: 0, top: 0, width: 0, height: 0 };
                }
            }

            export function combine(rect1: IRect, rect2: IRect): IRect {
                if (!rect1) {
                    return rect2;
                }
                if (!rect2) {
                    return rect1;
                }
                let left = Math.min(rect1.left, rect2.left);
                let top = Math.min(rect1.top, rect2.top);
                let right = Math.max(rect1.left + rect1.width, rect2.left + rect2.width);
                let bottom = Math.max(rect1.top + rect1.height, rect2.top + rect2.height);

                return { left: left, top: top, width: right - left, height: bottom - top };
            }

            export function parseRect(value: any, defaultValue?: IRect): IRect {
                if (value === null) {
                    return (defaultValue === undefined) ? null : defaultValue;
                } else if (value === undefined) {
                    return (defaultValue === undefined) ? null : defaultValue;
                } else {
                    if (value.length === 4) {
                        return { left: Utility.parseNumber(value[0]), top: Utility.parseNumber(value[1]), width: Utility.parseNumber(value[2]), height: Utility.parseNumber(value[3]) };
                    } else if (typeof value === "string") {
                        let parts = (<string>value).split(",");
                        if (parts.length !== 4) {
                            return (defaultValue === undefined) ? null : defaultValue;
                        }
                        return {
                            left: Utility.parseNumber(parts[0]), top: Utility.parseNumber(parts[1]), width: Utility.parseNumber(parts[2]), height: Utility.parseNumber(parts[3])
                        };
                    }
                    else if ((value.length !== 4) && (typeof value !== "string")) {
                        return (defaultValue === undefined) ? null : defaultValue;
                    }
                    else {
                        return { left: Utility.parseNumber(value.left), top: Utility.parseNumber(value.top), width: Utility.parseNumber(value.width), height: Utility.parseNumber(value.height) };
                    }
                }
            }

            export function getCentroid(rect: IRect): IPoint {
                return {
                    x: rect.left + (rect.width / 2),
                    y: rect.top + (rect.height / 2)
                };
            }
        }

        export module Thickness {

            export function inflate(thickness: IThickness, other: IThickness): IThickness {
                let result = clone(thickness);
                if (other) {
                    result.left = thickness.left + other.left;
                    result.right = thickness.right + other.right;
                    result.bottom = thickness.bottom + other.bottom;
                    result.top = thickness.top + other.top;
                }
                return result;
            }

            export function getWidth(thickness: IThickness): number {
                return thickness.left + thickness.right;
            }

            export function getHeight(thickness: IThickness): number {
                return thickness.top + thickness.bottom;
            }

            export function clone(thickness: IThickness): IThickness {
                return (thickness !== null) ? { left: thickness.left, top: thickness.top, right: thickness.right, bottom: thickness.bottom } : null;
            }

            export function equals(thickness: IThickness, other: IThickness): boolean {
                return thickness !== undefined && thickness !== null && other !== undefined && other !== null && thickness.left === other.left && thickness.bottom === other.bottom && thickness.right === other.right && thickness.top === other.top;
            }

            export function flipHorizontal(thickness: IThickness): void {
                let temp = thickness.right;
                thickness.right = thickness.left;
                thickness.left = temp;
            }

            export function flipVertical(thickness: IThickness): void {
                let top = thickness.top;
                thickness.top = thickness.bottom;
                thickness.bottom = top;
            }

            export function toString(thickness: IThickness): string {
                return "{top:" + thickness.top + ", left:" + thickness.left + ", right:" + thickness.right + ", bottom:" + thickness.bottom + "}";
            }

            export function toCssString(thickness: IThickness): string {
                return thickness.top + "px " + thickness.right + "px " + thickness.bottom + "px " + thickness.left + "px";
            }

            export function isEmpty(thickness: IThickness): boolean {
                return thickness.left === 0 && thickness.top === 0 && thickness.right === 0 && thickness.bottom === 0;
            }

            export function equal(thickness1: IThickness, thickness2: IThickness): boolean {
                return thickness1 === thickness2 ||
                    (thickness1 !== undefined && thickness2 !== undefined && thickness1.left === thickness2.left && thickness1.top === thickness2.top && thickness1.right === thickness2.right && thickness1.bottom === thickness2.bottom);
            }

            export function equalWithPrecision(thickness1: IThickness, thickness2: IThickness): boolean {
                return thickness1 === thickness2 ||
                    (thickness1 !== undefined && thickness2 !== undefined &&
                    Double.equalWithPrecision(thickness1.left, thickness2.left) && Double.equalWithPrecision(thickness1.top, thickness2.top) &&
                    Double.equalWithPrecision(thickness1.right, thickness2.right) && Double.equalWithPrecision(thickness1.bottom, thickness2.bottom));
            }

            export function parseThickness(value: any, defaultValue?: IThickness, resetValue?: any): IThickness {
                if (value === null) {
                    return (defaultValue === undefined) ? null : defaultValue;
                } else if (value === undefined) {
                    return (defaultValue === undefined) ? null : defaultValue;
                } else {
                    if (value.length === 4) {
                        return { left: Utility.parseNumber(value[0]), top: Utility.parseNumber(value[1]), right: Utility.parseNumber(value[2]), bottom: Utility.parseNumber(value[3]) };
                    } else if (typeof value === "string") {
                        let parts = (<string>value).split(",");
                        if (parts.length !== 4) {
                            return (defaultValue === undefined) ? null : defaultValue;
                        }
                        return { left: Utility.parseNumber(parts[0]), top: Utility.parseNumber(parts[1]), right: Utility.parseNumber(parts[2]), bottom: Utility.parseNumber(parts[3]) };
                    } else if ((value.length !== 4) && (typeof value !== "string")) {
                        return (defaultValue === undefined) ? null : defaultValue;
                    }
                    else {
                        return { left: Utility.parseNumber(value.left), top: Utility.parseNumber(value.top), right: Utility.parseNumber(value.right), bottom: Utility.parseNumber(value.bottom) };
                    }
                }
            }
        }

        export module Vector {

            export function isEmpty(vector: IVector): boolean {
                return vector.x === 0 && vector.y === 0;
            }

            export function equals(vector: IVector, other: IPoint): boolean {
                return vector !== undefined && vector !== null && other !== undefined && other !== null && vector.x === other.x && vector.y === other.y;
            }

            export function clone(vector: IVector): IVector {
                return (vector !== null) ? { x: vector.x, y: vector.y } : null;
            }

            export function toString(vector: IVector): string {
                return "{x:" + vector.x + ", y:" + vector.y + "}";
            }

            export function getLength(vector: IVector): number {
                return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            }

            export function getLengthSqr(vector: IVector): number {
                return vector.x * vector.x + vector.y * vector.y;
            }

            export function scale(vector: IVector, scalar: number): IVector {
                return { x: vector.x * scalar, y: vector.y * scalar };
            }

            export function normalize(vector: IVector): IVector {
                return !isEmpty(vector) ? scale(vector, 1 / getLength(vector)) : vector;
            }

            export function rotate90DegCW(vector: IVector): IVector {
                return { x: vector.y, y: -vector.x };
            }

            export function rotate90DegCCW(vector: IVector): IVector {
                return { x: -vector.y, y: vector.x };
            }

            export function rotate(vector: IVector, angle: number): IVector {
                let newX = vector.x * Math.cos(angle) - vector.y * Math.sin(angle);
                let newY = vector.x * Math.sin(angle) + vector.y * Math.cos(angle);
                return { x: newX, y: newY };
            }

            export function equal(vector1: IVector, vector2: IVector): boolean {
                return vector1 === vector2 ||
                    (vector1 !== undefined && vector2 !== undefined && vector1.x === vector2.x && vector1.y === vector2.y);
            }

            export function equalWithPrecision(vector1: IVector, vector2: IVector): boolean {
                return vector1 === vector2 ||
                    (vector1 !== undefined && vector2 !== undefined && Double.equalWithPrecision(vector1.x, vector2.x) && Double.equalWithPrecision(vector1.y, vector2.y));
            }

            export function add(vect1: IVector, vect2: IVector): IVector {
                if (!vect1 || !vect2) {
                    return undefined;
                }
                return { x: vect1.x + vect2.x, y: vect1.y + vect2.y };
            }

            export function subtract(vect1: IVector, vect2: IVector): IVector {
                if (!vect1 || !vect2) {
                    return undefined;
                }
                return { x: vect1.x - vect2.x, y: vect1.y - vect2.y };
            }

            export function dotProduct(vect1: IVector, vect2: IVector): number {
                if (!vect1 || !vect2) {
                    return undefined;
                }
                return vect1.x * vect2.x + vect1.y * vect2.y;
            }

            export function getDeltaVector(p0: IPoint, p1: IPoint): IVector {
                if (!p0 || !p1) {
                    return undefined;
                }
                return { x: p1.x - p0.x, y: p1.y - p0.y };
            }
        }

    }
}