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

/// <reference path="../../_references.ts"/>

module powerbitests {
    import Shapes = powerbi.visuals.shapes;
    import Point = powerbi.visuals.shapes.Point;
    import Size = powerbi.visuals.shapes.Size;
    import Rect = powerbi.visuals.shapes.Rect;
    import Thickness = powerbi.visuals.shapes.Thickness;
    import Vector = powerbi.visuals.shapes.Vector;
    import IRect = powerbi.visuals.IRect;

    describe("Point tests", () => {

        let pointA;

        it("offset with positive value", () => {
            let pointA: Shapes.IPoint = { x: 10, y: 10 };
            let offset = Point.offset(pointA, 20, 25);
            expect(offset.x).toBe(30);
            expect(offset.y).toBe(35);
        });

        it("offset with negative value", () => {
            let pointA: Shapes.IPoint = { x: 100, y: 100 };
            let offset = Point.offset(pointA, -20, -25);
            expect(offset.x).toBe(80);
            expect(offset.y).toBe(75);
        });

        it("Check equals - return true", () => {
            let pointA: Shapes.IPoint = { x: 100, y: 100 };
            let pointB: Shapes.IPoint = { x: 100, y: 100 };
            let offset = Point.equals(pointA, pointB);
            expect(offset).toBe(true);
        });

        it("Check equals - return false", () => {
            let pointA: Shapes.IPoint = { x: 100, y: 100 };
            let pointB: Shapes.IPoint = { x: 50, y: 100 };
            let offset = Point.equals(pointA, pointB);
            expect(offset).toBe(false);
        });

        it("Check clone", () => {
            let point: Shapes.IPoint = { x: 100, y: 100 };
            let clonePoint = Point.clone(point);
            expect(clonePoint.x).toBe(point.x);
            expect(clonePoint.y).toBe(point.y);
        });

        it("Point - To String", () => {
            let point: Shapes.IPoint = { x: 100, y: 100 };
            let pointToString = Point.toString(point);
            expect(pointToString).toBe("{x:100, y:100}");
        });

        it("Check Serialize", () => {
            let point: Shapes.IPoint = { x: 200, y: 200 };
            let pointSerialize = Point.serialize(point);
            expect(pointSerialize).toBe("200,200");
        });

        it("Check Distance ", () => {
            let pointA: Shapes.IPoint = { x: 200, y: 200 };
            let pointB: Shapes.IPoint = { x: 250, y: 300 };
            let distance = Point.getDistance(pointA, pointB);
            let calculatedDistance = Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + (Math.pow(pointB.y - pointA.y, 2)));
            expect(distance).toBe(calculatedDistance);
        });

        it("Check Distance (null values)", () => {
            pointA = null;
            let pointB: Shapes.IPoint = { x: 150, y: 200 };
            let distance = Point.getDistance(pointA, pointB);
            expect(distance).toBe(null);
        });

        it("Check zero Distance ", () => {
            let pointA: Shapes.IPoint = { x: 200, y: 200 };
            let pointB: Shapes.IPoint = { x: 200, y: 200 };
            let distance = Point.getDistance(pointA, pointB);
            expect(distance).toBe(0);
        });

        it("Equals (static) - return true ", () => {
            let pointA: Shapes.IPoint = { x: 200, y: 200 };
            let pointB: Shapes.IPoint = { x: 200, y: 200 };
            let arePointsEqual = Point.equals(pointA, pointB);
            expect(arePointsEqual).toBe(true);
        });

        it("Equals (static) - point A is null ", () => {
            let pointB: Shapes.IPoint = { x: 200, y: 200 };
            let arePointsEqual = Point.equals(null, pointB);
            expect(arePointsEqual).toBe(false);
        });

        it("Equals (static) - point B is null ", () => {
            let pointA: Shapes.IPoint = { x: 200, y: 200 };
            let arePointsEqual = Point.equals(pointA, null);
            expect(arePointsEqual).toBe(false);
        });

        it("Equals (static) - points are null ", () => {
            let arePointsEqual = Point.equals(null, null);
            expect(arePointsEqual).toBe(false);
        });

        it("Equals with Precision - return true ", () => {
            let pointA: Shapes.IPoint = { x: 200.23, y: 200.32 };
            let pointB: Shapes.IPoint = { x: 200.23, y: 200.32 };
            let arePointsEqual = Shapes.Point.equalWithPrecision(pointA, pointB);
            expect(arePointsEqual).toBe(true);
        });

        it("Parse Point (from string no default value)", () => {
            let pointStr = "200,215";
            let pointA = Point.parsePoint(pointStr);
            expect(pointA.x).toBe(200);
            expect(pointA.y).toBe(215);
        });

        it("Parse Point (from string,2 points)", () => {
            let pointStr = "190,220";
            let pointA = Point.parsePoint(pointStr);
            expect(pointA.x).toBe(190);
            expect(pointA.y).toBe(220);
        });

        it("Parse Point (from string,2 points (default value ignored)", () => {
            let pointStr = "190,220";
            let defaultValue: Shapes.IPoint = { x: 110, y: 100 };
            let pointA = Point.parsePoint(pointStr, defaultValue);
            expect(pointA.x).toBe(190);
            expect(pointA.y).toBe(220);
        });

        it("Parse Point (from empty string)", () => {
            let pointStr = "";
            let pointA = Point.parsePoint(pointStr);
            expect(pointA).toBe(null);
        });

        it("Parse Point - from empty string (default value taken)", () => {
            let pointStr = "";
            let defaultValue: Shapes.IPoint = { x: 110, y: 100 };
            let pointA = Point.parsePoint(pointStr, defaultValue);
            expect(pointA.x).toBe(defaultValue.x);
            expect(pointA.y).toBe(defaultValue.y);
        });

        it("Parse Point (from int array)", () => {
            let intArray = [190, 220];
            let pointA = Point.parsePoint(intArray);
            expect(pointA.x).toBe(190);
            expect(pointA.y).toBe(220);
        });

        it("Parse Point - from int array (default value ignored)", () => {
            let intArray = [190, 220];
            let defaultValue: Shapes.IPoint = { x: 110, y: 100 };
            let pointA = Point.parsePoint(intArray, defaultValue);
            expect(pointA.x).toBe(190);
            expect(pointA.y).toBe(220);
        });

        it("Parse Point (int with more than 2 elements)", () => {
            let intArray = [190, 220, 200, 210];
            let pointA = Point.parsePoint(intArray);
            expect(pointA).toBe(null);
        });

        it("Parse Point (int with more than 2 elements (default value taken)", () => {
            let intArray = [190, 220, 200, 210];
            let defaultValue: Shapes.IPoint = { x: 110, y: 100 };
            pointA = Point.parsePoint(intArray, defaultValue);
            expect(pointA.x).toBe(110);
            expect(pointA.y).toBe(100);
        });

        it("Parse Point (int with one element)", () => {
            let intArray = [190];
            let pointA = Point.parsePoint(intArray);
            expect(pointA).toBe(null);
        });

        it("Parse Point - int with one element (default value taken)", () => {
            let intArray = [190];
            let defaultValue: Shapes.IPoint = { x: 110, y: 100 };
            let pointA = Point.parsePoint(intArray, defaultValue);
            expect(pointA.x).toBe(defaultValue.x);
            expect(pointA.y).toBe(defaultValue.y);
        });

        it("Parse Point (int with empty array)", () => {
            let intArray = [];
            let pointA = Point.parsePoint(intArray);
            expect(pointA).toBe(null);
        });

        it("Parse Point (int with empty array (default value taken)", () => {
            let intArray = [];
            let defaultValue: Shapes.IPoint = { x: 110, y: 100 };
            let pointA = Point.parsePoint(intArray, defaultValue);
            expect(pointA.x).toBe(110);
            expect(pointA.y).toBe(100);
        });

        it("Parse Point  - not string and not array)", () => {
            let num: boolean = true;
            let pointA = Point.parsePoint(num);
            expect(pointA).toBe(null);

        });

        it("Parse Point - not string and not array (default value taken)", () => {
            let num: boolean = true;
            let defaultValue: Shapes.IPoint = { x: 110, y: 100 };
            let pointA = Point.parsePoint(num, defaultValue);
            expect(pointA.x).toBe(110);
            expect(pointA.y).toBe(100);
        });

        it("Parse Point - getting null", () => {
            let pointA = Point.parsePoint(null);
            expect(pointA).toBe(null);
        });

        it("Parse Point - getting null (default value taken)", () => {
            let defaultValue: Shapes.IPoint = { x: 110, y: 100 };
            let pointA = Point.parsePoint(null, defaultValue);
            expect(pointA.x).toBe(110);
            expect(pointA.y).toBe(100);
        });
    });

    describe("Size Tests", () => {

        it("Is Empty - true", () => {
            let size: Shapes.ISize = { width: 0, height: 0 };
            let isEmpty = Size.isEmpty(size);
            expect(isEmpty).toBe(true);
        });

        it("Is Empty - false", () => {
            let size: Shapes.ISize = { width: 50, height: 50 };
            let isEmpty = Size.isEmpty(size);
            expect(isEmpty).toBe(false);
        });

        it("Check equals - return true", () => {
            let sizeA: Shapes.ISize = { width: 120, height: 100 };
            let sizeB: Shapes.ISize = { width: 120, height: 100 };
            let sizeEquals = Size.equals(sizeA, sizeB);
            expect(sizeEquals).toBe(true);
        });

        it("Check equals - return false", () => {
            let sizeA: Shapes.ISize = { width: 120, height: 100 };
            let sizeB: Shapes.ISize = { width: 120, height: 150 };
            let sizeEquals = Size.equals(sizeA, sizeB);
            expect(sizeEquals).toBe(false);
        });

        it("Check equals - null", () => {
            let size: Shapes.ISize = { width: 120, height: 100 };
            let sizeEquals = Size.equals(size, null);
            expect(sizeEquals).toBe(false);
        });

        it("clone", () => {
            let size: Shapes.ISize = { width: 120, height: 100 };
            let sizeCloned = Size.clone(size);
            expect(sizeCloned.width).toBe(size.width);
            expect(sizeCloned.height).toBe(size.height);
        });

        it("clone - null", () => {
            let size = null;
            let sizeCloned = Size.clone(size);
            expect(sizeCloned).toBe(null);
        });

        it("inflate - Positive values", () => {
            let size: Shapes.ISize = { width: 120, height: 100 };
            let padding: Shapes.IThickness = { left: 5, top: 10, right: 5, bottom: 10 };
            let sizeInflated = Size.inflate(size, padding);
            expect(sizeInflated.width).toBe(130);
            expect(sizeInflated.height).toBe(120);
        });

        it("inflate - Zero values", () => {
            let size: Shapes.ISize = { width: 120, height: 100 };
            let padding: Shapes.IThickness = { left: 0, top: 0, right: 0, bottom: 0 };
            let sizeInflated = Size.inflate(size, padding);
            expect(sizeInflated.width).toBe(size.width);
            expect(sizeInflated.height).toBe(size.height);
        });

        it("deflate - Positive values", () => {
            let size: Shapes.ISize = { width: 120, height: 100 };
            let padding: Shapes.IThickness = { left: 5, top: 10, right: 5, bottom: 10 };
            let sizeDeflated = Size.deflate(size, padding);
            expect(sizeDeflated.width).toBe(110);
            expect(sizeDeflated.height).toBe(80);
        });

        it("deflate - Zero values", () => {
            let size: Shapes.ISize = { width: 120, height: 100 };
            let padding: Shapes.IThickness = { left: 0, top: 0, right: 0, bottom: 0 };
            let sizeDeflated = Size.deflate(size, padding);
            expect(sizeDeflated.width).toBe(size.width);
            expect(sizeDeflated.height).toBe(size.height);
        });

        it("Combine 2 sizes", () => {
            let sizeA: Shapes.ISize = { width: 70, height: 110 };
            let sizeB: Shapes.ISize = { width: 30, height: 120 };
            Size.combine(sizeA, sizeB);
            let newSize: Shapes.ISize = { width: 70, height: 120 };
            expect(newSize.width).toBe(70);
            expect(newSize.height).toBe(120);
        });

        it("Combine 2 sizes (A contains B)", () => {
            let sizeA: Shapes.ISize = { width: 150, height: 120 };
            let sizeB: Shapes.ISize = { width: 80, height: 110 };
            let newSize = Size.combine(sizeA, sizeB);
            expect(newSize.width).toBe(sizeA.width);
            expect(newSize.height).toBe(sizeA.height);
        });

        it("Combine 2 sizes (B contains A)", () => {
            let sizeA: Shapes.ISize = { width: 150, height: 120 };
            let sizeB: Shapes.ISize = { width: 180, height: 170 };
            let newSize = Size.combine(sizeA, sizeB);
            expect(newSize.width).toBe(sizeB.width);
            expect(newSize.height).toBe(sizeB.height);
        });

        it("Combine 2 sizes (one empty)", () => {
            let sizeA: Shapes.ISize = { width: 110, height: 120 };
            let sizeB: Shapes.ISize = { width: 0, height: 0 };
            let newSize = Size.combine(sizeA, sizeB);
            expect(newSize.width).toBe(sizeA.width);
            expect(newSize.height).toBe(sizeA.height);
        });

        it("To Rect", () => {
            let size: Shapes.ISize = { width: 120, height: 100 };
            let sizeToRect = Size.toRect(size);
            expect(sizeToRect.left).toBe(0);
            expect(sizeToRect.top).toBe(0);
            expect(sizeToRect.width).toBe(120);
            expect(sizeToRect.height).toBe(100);
        });

        it("To string", () => {
            let size: Shapes.ISize = { width: 150, height: 30 };
            let sizeToString = Size.toString(size);
            expect(sizeToString).toBe("{width:150, height:30}");
        });

        it("Equals (static) - return true ", () => {
            let SizeA: Shapes.ISize = { width: 200, height: 200 };
            let SizeB: Shapes.ISize = { width: 200, height: 200 };
            let areSizesEqual = Size.equals(SizeA, SizeB);
            expect(areSizesEqual).toBe(true);
        });

        it("Equals (static) - size A is null ", () => {
            let SizeB: Shapes.ISize = { width: 200, height: 200 };
            let areSizesEqual = Size.equals(null, SizeB);
            expect(areSizesEqual).toBe(false);
        });

        it("Equals (static) - size B is null ", () => {
            let SizeA: Shapes.ISize = { width: 200, height: 200 };
            let areSizesEqual = Size.equals(SizeA, null);
            expect(areSizesEqual).toBe(false);
        });

        it("Equals (static) - sizes are null ", () => {
            let areSizesEqual = Size.equals(null, null);
            expect(areSizesEqual).toBe(false);
        });

        it("Equals with Precision - return true ", () => {
            let SizeA: Shapes.ISize = { width: 200.23, height: 200.32 };
            let SizeB: Shapes.ISize = { width: 200.23, height: 200.32 };
            let areSizesEqual = Shapes.Size.equalWithPrecision(SizeA, SizeB);
            expect(areSizesEqual).toBe(true);
        });

        it("Parse Size (from string no default value)", () => {
            let sizeStr = "200,215";
            let sizeA = Size.parseSize(sizeStr);
            expect(sizeA.width).toBe(200);
            expect(sizeA.height).toBe(215);
        });

        it("Parse Size (from string,2 points)", () => {
            let sizeStr = "190,220";
            let sizeA = Size.parseSize(sizeStr);
            expect(sizeA.width).toBe(190);
            expect(sizeA.height).toBe(220);
        });

        it("Parse Size - from string,2 points (default value ignored)", () => {
            let sizeStr = "190,220";
            let defaultValue: Shapes.ISize = { width: 110, height: 100 };
            let sizeA = Size.parseSize(sizeStr, defaultValue);
            expect(sizeA.width).toBe(190);
            expect(sizeA.height).toBe(220);
        });

        it("Parse Size (from empty string)", () => {
            let sizeStr = "";
            let sizeA = Size.parseSize(sizeStr);
            expect(sizeA).toBe(null);
        });

        it("Parse Size - from empty string (default value taken)", () => {
            let sizeStr = "";
            let defaultValue: Shapes.ISize = { width: 110, height: 100 };
            let sizeA = Size.parseSize(sizeStr, defaultValue);
            expect(sizeA.width).toBe(110);
            expect(sizeA.height).toBe(100);
        });

        it("Parse Size (from int array)", () => {
            let intArray = [190, 220];
            let sizeA = Size.parseSize(intArray);
            expect(sizeA.width).toBe(190);
            expect(sizeA.height).toBe(220);
        });

        it("Parse Size - from int array (default value ignored)", () => {
            let intArray = [190, 220];
            let defaultValue: Shapes.ISize = { width: 110, height: 100 };
            let sizeA = Size.parseSize(intArray, defaultValue);
            expect(sizeA.width).toBe(190);
            expect(sizeA.height).toBe(220);
        });

        it("Parse Size (int with more than 2 elements)", () => {
            let intArray = [190, 220, 200, 210];
            let sizeA = Size.parseSize(intArray);
            expect(sizeA).toBe(null);
        });

        it("Parse Size (int with more than 2 elements (default value taken)", () => {
            let intArray = [190, 220, 200, 210];
            let defaultValue: Shapes.ISize = { width: 110, height: 100 };
            let sizeA = Size.parseSize(intArray, defaultValue);
            expect(sizeA.width).toBe(defaultValue.width);
            expect(sizeA.height).toBe(defaultValue.height);
        });

        it("Parse Size (int with one element)", () => {
            let intArray = [190];
            let sizeA = Size.parseSize(intArray);
            expect(sizeA).toBe(null);
        });

        it("Parse Size (int with one element (default value taken)", () => {
            let intArray = [190];
            let defaultValue: Shapes.ISize = { width: 110, height: 100 };
            let sizeA = Size.parseSize(intArray, defaultValue);
            expect(sizeA.width).toBe(defaultValue.width);
            expect(sizeA.height).toBe(defaultValue.height);
        });

        it("Parse Size (int with empty array)", () => {
            let intArray = [];
            let sizeA = Size.parseSize(intArray);
            expect(sizeA).toBe(null);
        });

        it("Parse Size (int with empty array (default value taken)", () => {
            let intArray = [];
            let defaultValue: Shapes.ISize = { width: 110, height: 100 };
            let sizeA = Size.parseSize(intArray, defaultValue);
            expect(sizeA.width).toBe(110);
            expect(sizeA.height).toBe(100);
        });

        it("Parse Size (not string and not array)", () => {
            let num: boolean = true;
            let sizeA = Size.parseSize(num);
            expect(sizeA).toBe(null);
        });

        it("Parse Size (not string and not array (default value taken)", () => {
            let num: boolean = true;
            let defaultValue: Shapes.ISize = { width: 110, height: 100 };
            let sizeA = Size.parseSize(num, defaultValue);
            expect(sizeA.width).toBe(110);
            expect(sizeA.height).toBe(100);
        });

        it("Parse Size - getting null", () => {
            let sizeA = Size.parseSize(null);
            expect(sizeA).toBe(null);
        });

        it("Parse Size - getting null (default value taken)", () => {
            let defaultValue: Shapes.ISize = { width: 110, height: 100 };
            let sizeA = Size.parseSize(null, defaultValue);
            expect(sizeA.width).toBe(110);
            expect(sizeA.height).toBe(100);
        });
    });

    describe("Rect tests", () => {

        let rectA;
        let rectB;
        let isEmpty;
        let isIntersecting;
        let defaultRect: IRect = { left: 110, top: 100, width: 150, height: 117 };

        function AreRectsEqual(rectA, rectB): boolean {
            return (rectB.left === rectA.left && rectB.top === rectA.top && rectB.width === rectA.width && rectB.height === rectA.height);
        }

        it("Is Empty - true", () => {
            rectA = { left: 0, top: 0, width: 0, height: 0 };
            let isEmpty = Rect.isEmpty(rectA);
            expect(isEmpty).toBe(true);
        });

        it("Is Empty - false", () => {
            rectA = { left: 0, top: 0, width: 50, height: 20 };
            let isEmpty = Rect.isEmpty(rectA);
            expect(isEmpty).toBe(false);
        });

        it("Is Empty - null", () => {
            rectA = null;
            isEmpty = Rect.isEmpty(rectA);
            expect(isEmpty).toBe(true);
        });

        it("Is Intersecting - true", () => {
            rectA = { left: 0, top: 0, width: 200, height: 300 };
            rectB = { left: 170, top: 30, width: 300, height: 400 };
            isIntersecting = Rect.isIntersecting(rectA, rectB);
            expect(isIntersecting).toBe(true);
        });

        it("Is Intersecting - false", () => {
            rectA = { left: 0, top: 0, width: 10, height: 10 };
            rectB = { left: 100, top: 200, width: 500, height: 400 };
            isIntersecting = Rect.isIntersecting(rectA, rectB);
            expect(isIntersecting).toBe(false);
        });

        it("Is Intersecting - first rect is null", () => {
            rectA = { left: 0, top: 0, width: 200, height: 200 };
            rectB = null;
            isIntersecting = Rect.isIntersecting(rectA, rectB);
            expect(isIntersecting).toBe(false);
        });

        it("Is Intersecting - second rect is null", () => {
            rectA = null;
            rectB = { left: 0, top: 0, width: 200, height: 200 };
            isIntersecting = Rect.isIntersecting(rectA, rectB);
            expect(isIntersecting).toBe(false);
        });

        it("Get offset", () => {
            rectA = { left: 0, top: 0, width: 200, height: 200 };
            rectB = Rect.getOffset(rectA);
            expect(rectB.x).toBe(0);
            expect(rectB.y).toBe(0);
        });

        it("Get size", () => {
            rectA = { left: 0, top: 0, width: 200, height: 200 };
            rectB = Rect.getSize(rectA);
            expect(rectB.width).toBe(200);
            expect(rectB.height).toBe(200);
        });

        it("Set size", () => {
            rectA = { left: 0, top: 0, width: 200, height: 200 };
            let newSize: Shapes.ISize = { width: 150, height: 170 };
            Rect.setSize(rectA, newSize);
            expect(rectA.width).toBe(150);
            expect(rectA.height).toBe(170);
        });

        it("Get Right (Property)", () => {
            rectA = { left: 120, top: 50, width: 200, height: 200 };
            let right = Rect.right(rectA);
            expect(right).toBe(320);
        });

        it("Get Bottom (Property)", () => {
            rectA = { left: 70, top: 130, width: 200, height: 200 };
            let bottom = Rect.bottom(rectA);
            expect(bottom).toBe(330);
        });

        it("Get TopLeft (Property)", () => {
            rectA = { left: 0, top: 0, width: 200, height: 200 };
            let topLeft = Rect.topLeft(rectA);
            expect(topLeft.x).toBe(0);
            expect(topLeft.y).toBe(0);
        });

        it("Get TopRight (Property)", () => {
            rectA = { left: 80, top: 170, width: 150, height: 220 };
            let topRight = Rect.topRight(rectA);
            expect(topRight.x).toBe(230);
            expect(topRight.y).toBe(170);
        });

        it("Get BottomLeft (Property)", () => {
            rectA = { left: 0, top: 10, width: 30, height: 220 };
            let bottomLeft = Rect.bottomLeft(rectA);
            expect(bottomLeft.x).toBe(rectA.left);
            expect(bottomLeft.y).toEqual(rectA.top + rectA.height);
        });

        it("Get BottomRight (Property)", () => {
            rectA = { left: 50, top: 90, width: 200, height: 270 };
            let bottomRight = Rect.bottomRight(rectA);
            expect(bottomRight.x).toBe(250);
            expect(bottomRight.y).toBe(360);
        });

        it("Check equals - return true", () => {
            rectA = { left: 50, top: 90, width: 200, height: 270 };
            rectB = { left: 50, top: 90, width: 200, height: 270 };
            let rectEquals = Rect.equals(rectA, rectB);
            expect(rectEquals).toBe(true);
        });

        it("Check equals - return false", () => {
            rectA = { left: 50, top: 90, width: 200, height: 270 };
            rectB = { left: 50, top: 90, width: 250, height: 270 };
            let rectEquals = Rect.equals(rectA, rectB);
            expect(rectEquals).toBe(false);
        });

        it("Check equals - null", () => {
            rectA = { left: 70, top: 90, width: 130, height: 270 };
            let rectEquals = Rect.equals(rectA, null);
            expect(rectEquals).toBe(false);
        });

        it("Clone", () => {
            rectA = { left: 70, top: 90, width: 130, height: 270 };
            rectB = Rect.clone(rectA);
            expect(AreRectsEqual(rectA, rectB)).toBe(true);
        });

        it("Rect ToString", () => {
            rectA = { left: 70, top: 90, width: 130, height: 270 };
            let rectToString = "{left:70, top:90, width:130, height:270}";
            expect(Rect.toString(rectA)).toBe(rectToString);
        });

        it("Rect offset - Positive Values", () => {
            rectA = { left: 70, top: 90, width: 130, height: 270 };
            let rectB = Rect.offset(rectA, 30, 30);
            expect(rectB.left).toBe(rectA.left + 30);
            expect(rectB.top).toBe(rectA.top + 30);
            expect(rectB.width).toBe(rectA.width);
            expect(rectB.height).toBe(rectA.height);
        });

        it("Rect offset - Zero Values", () => {
            rectA = { left: 70, top: 90, width: 130, height: 270 };
            let rectB = Rect.offset(rectA, 0, 0);
            expect(rectB.left).toBe(rectA.left);

        });

        it("Rect offset - Negative Values", () => {
            rectA = { left: 70, top: 90, width: 130, height: 270 };
            rectB = Rect.offset(rectA, -30, -60);
            expect(rectB.left).toBe(rectA.left - 30);
            expect(rectB.top).toBe(rectA.top - 60);
            expect(rectB.width).toBe(rectA.width);
            expect(rectB.height).toBe(rectA.height);
        });

        it("Rect offset - Negative Offset Bigger than Top Left", () => {
            rectA = { left: 70, top: 90, width: 130, height: 270 };
            rectB = Rect.offset(rectA, -100, -130);
            expect(rectB.left).toBe(0);
            expect(rectB.top).toBe(0);
            expect(rectB.width).toBe(rectA.width);
            expect(rectB.height).toBe(rectA.height);
        });

        it("Rect inflate", () => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            let thickness: Shapes.IThickness = { left: 30, top: 20, right: 50, bottom: 40 };
            rectB = Rect.inflate(rectA, thickness);
            expect(rectB.left).toBe(40);
            expect(rectB.top).toBe(90);
            expect(rectB.width).toBe(210);
            expect(rectB.height).toBe(330);
        });

        it("Rect inflate - Zero Values", () => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            let thickness: Shapes.IThickness = { left: 0, top: 0, right: 0, bottom: 0 };
            rectB = Rect.inflate(rectA, thickness);
            expect(rectB.left).toBe(70);
            expect(rectB.top).toBe(110);
            expect(rectB.width).toBe(130);
            expect(rectB.height).toBe(270);
        });

        it("Rect deflate", () => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            let thickness: Shapes.IThickness = { left: 30, top: 20, right: 50, bottom: 40 };
            rectB = Rect.deflate(rectA, thickness);
            expect(rectB.left).toBe(100);
            expect(rectB.top).toBe(130);
            expect(rectB.width).toBe(50);
            expect(rectB.height).toBe(210);
        });

        it("Rect deflate - Zero Values", () => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            let thickness: Shapes.IThickness = { left: 0, top: 0, right: 0, bottom: 0 };
            rectB = Rect.deflate(rectA, thickness);
            expect(rectB.left).toBe(70);
            expect(rectB.top).toBe(110);
            expect(rectB.width).toBe(130);
            expect(rectB.height).toBe(270);
        });

        it("Rect inflateBy", () => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectA = Rect.inflateBy(rectA, 20);
            expect(rectA.left).toBe(50);
            expect(rectA.top).toBe(90);
            expect(rectA.width).toBe(170);
            expect(rectA.height).toBe(310);
        });

        it("Rect inflateBy - Zero Values", () => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectA = Rect.inflateBy(rectA, 0);
            expect(rectA.left).toBe(70);
            expect(rectA.top).toBe(110);
            expect(rectA.width).toBe(130);
            expect(rectA.height).toBe(270);
        });

        it("Rect deflateBy", () => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectA = Rect.deflateBy(rectA, 30);
            expect(rectA.left).toBe(100);
            expect(rectA.top).toBe(140);
            expect(rectA.width).toBe(70);
            expect(rectA.height).toBe(210);
        });

        it("Rect deflateBy - Zero Values", () => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectA = Rect.deflateBy(rectA, 0);
            expect(rectA.left).toBe(70);
            expect(rectA.top).toBe(110);
            expect(rectA.width).toBe(130);
            expect(rectA.height).toBe(270);
        });

        it("Contains Point - Return true", () => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            let newPoint: Shapes.IPoint = { x: 100, y: 140 };
            let isContains = Shapes.Rect.containsPoint(rectA, newPoint);
            expect(isContains).toBe(true);
        });

        it("Contains Point check floating point rounding precision", () => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            var inPoint: Shapes.IPoint = { x: 69.99999, y: 140 };
            var outPoint: Shapes.IPoint = { x: 69.9999, y: 140 };
            var containsInner = Shapes.Rect.containsPoint(rectA, inPoint);
            var containsOuter = Shapes.Rect.containsPoint(rectA, outPoint);
            expect(containsInner).toBe(true);
            expect(containsOuter).toBe(false);
        });

        it("Contains Point - Return false", () => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            let newPoint: Shapes.IPoint = { x: 220, y: 170 };
            let isContains = Shapes.Rect.containsPoint(rectA, newPoint);
            expect(isContains).toBe(false);
        });

        it("Contains Point - null", () => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            let isContains = Shapes.Rect.containsPoint(rectA, null);
            expect(isContains).toBe(false);
        });

        it("Is Intersecting - Return true", () => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectB = { left: 70, top: 150, width: 130, height: 320 };
            let isIntersecting = Shapes.Rect.isIntersecting(rectA, rectB);
            expect(isIntersecting).toBe(true);
        });

        it("Is Intersecting - Return false", () => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectB = { left: 30, top: 20, width: 20, height: 20 };
            let isIntersecting = Shapes.Rect.isIntersecting(rectA, rectB);
            expect(isIntersecting).toBe(false);
        });

        it("Is Intersecting - first null", () => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectB = null;
            let isIntersecting = Shapes.Rect.isIntersecting(rectA, rectB);
            expect(isIntersecting).toBe(false);
        });

        it("Is Intersecting - second null", () => {
            rectA = null;
            rectB = { left: 70, top: 110, width: 130, height: 270 };
            let isIntersecting = Shapes.Rect.isIntersecting(rectA, rectB);
            expect(isIntersecting).toBe(false);
        });

        it("Intersect - Rect A Contains B", () => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectB = { left: 90, top: 140, width: 20, height: 20 };
            expect(isIntersecting).toBe(false);
        });

        it("Intersect - Rect B Contains A", () => {
            rectA = { left: 110, top: 150, width: 30, height: 25 };
            rectB = { left: 90, top: 140, width: 100, height: 120 };
            expect(isIntersecting).toBe(false);
        });

        it("Intersect - Rect A Intersect B", () => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectB = { left: 90, top: 130, width: 80, height: 70 };
            expect(isIntersecting).toBe(false);
        });

        it("Intersect - Rect A don't Intersect B", () => {
            rectA = { left: 0, top: 0, width: 20, height: 30 };
            rectB = { left: 70, top: 110, width: 130, height: 270 };
            expect(isIntersecting).toBe(false);
        });

        it("Intersect - Rect A is null", () => {
            rectA = null;
            rectB = { left: 70, top: 110, width: 130, height: 270 };
            expect(isIntersecting).toBe(false);
        });

        it("Intersect - Rect B is null", () => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectB = null;
            expect(isIntersecting).toBe(false);
        });

        it("Combine 2 rects", () => {
            rectA = { left: 50, top: 50, width: 50, height: 50 };
            rectB = { left: 60, top: 60, width: 60, height: 60 };
            let newRect = Rect.combine(rectA, rectB);
            let newRectCalculated: IRect = { left: 50, top: 50, width: 70, height: 70 };
            expect(AreRectsEqual(newRectCalculated, newRect)).toBe(true);
        });

        it("Combine 2 rects (A contains B)", () => {
            rectA = { left: 150, top: 150, width: 20, height: 20 };
            rectB = { left: 160, top: 160, width: 10, height: 10 };
            let newRect = Rect.combine(rectA, rectB);
            expect(AreRectsEqual(rectA, newRect)).toBe(true);
        });

        it("Combine 2 rects (B contains A)", () => {
            rectA = { left: 150, top: 150, width: 20, height: 20 };
            rectB = { left: 130, top: 130, width: 50, height: 50 };
            let newRect = Rect.combine(rectA, rectB);
            expect(AreRectsEqual(newRect, rectB)).toBe(true);
        });

        it("Combine 2 rects (one empty)", () => {
            rectA = { left: 150, top: 150, width: 20, height: 20 };
            rectB = { left: 0, top: 0, width: 0, height: 0 };
            let newRect = rectA;
            Rect.combine(rectA, rectB);
            expect(AreRectsEqual(rectA, newRect)).toBe(true);
        });

        it("Parse Rect (from string no default value)", () => {
            let rectStr = "200,215,200,180";
            rectA = Rect.parseRect(rectStr);
            expect(rectA.left).toBe(200);
            expect(rectA.top).toBe(215);
            expect(rectA.width).toBe(200);
            expect(rectA.height).toBe(180);
        });

        it("Parse Rect - from string,(default value ignored)", () => {
            let rectStr = "190,220,150,170";
            rectA = Rect.parseRect(rectStr, defaultRect);
            expect(rectA.left).toBe(190);
            expect(rectA.top).toBe(220);
            expect(rectA.width).toBe(150);
            expect(rectA.height).toBe(170);
        });

        it("Parse Rect (from empty string)", () => {
            let rectStr = "";
            rectA = Rect.parseRect(rectStr);
            expect(rectA).toBe(null);
        });

        it("Parse Rect - from empty string (default value taken)", () => {
            let rectStr = "";
            rectA = Rect.parseRect(rectStr, defaultRect);
            expect(rectA.left).toBe(defaultRect.left);
            expect(rectA.top).toBe(defaultRect.top);
            expect(rectA.width).toBe(defaultRect.width);
            expect(rectA.height).toBe(defaultRect.height);
        });

        it("Parse Rect (from int array)", () => {
            let intArray = [190, 220, 100, 150];
            rectA = Rect.parseRect(intArray);
            expect(rectA.left).toBe(190);
            expect(rectA.top).toBe(220);
            expect(rectA.width).toBe(100);
            expect(rectA.height).toBe(150);
        });

        it("Parse Rect - from int array (default value ignored)", () => {
            let intArray = [190, 220, 130, 115];
            rectA = Rect.parseRect(intArray, defaultRect);
            expect(rectA.left).toBe(190);
            expect(rectA.top).toBe(220);
            expect(rectA.width).toBe(130);
            expect(rectA.height).toBe(115);
        });

        it("Parse Rect (int with more than 4 elements)", () => {
            let intArray = [190, 220, 200, 210, 118];
            rectA = Rect.parseRect(intArray);
            expect(rectA).toBe(null);
        });

        it("Parse Rect (int with more than 4 elements (default value ignored)", () => {
            let intArray = [190, 220, 200, 210];
            let defaultValue = { left: 110, top: 100, width: 115, height: 170 };
            rectA = Rect.parseRect(intArray, defaultValue);
            expect(rectA.left).toBe(190);
            expect(rectA.top).toBe(220);
            expect(rectA.width).toBe(200);
            expect(rectA.height).toBe(210);
        });

        it("Parse Rect (int with one element)", () => {
            let intArray = [190];
            rectA = Rect.parseRect(intArray);
            expect(rectA).toBe(null);
        });

        it("Parse Rect (int with one element (default value taken)", () => {
            let intArray = [190];
            rectA = Rect.parseRect(intArray, defaultRect);
            expect(rectA.left).toBe(defaultRect.left);
            expect(rectA.top).toBe(defaultRect.top);
            expect(rectA.width).toBe(defaultRect.width);
            expect(rectA.height).toBe(defaultRect.height);
        });

        it("Parse Rect (int with empty array)", () => {
            let intArray = [];
            rectA = Rect.parseRect(intArray);
            expect(rectA).toBe(null);
        });

        it("Parse Rect (int with empty array (default value taken)", () => {
            let intArray = [];
            let defaultValue = { left: 110, top: 100, width: 115, height: 170 };
            rectA = Rect.parseRect(intArray, defaultValue);
            expect(rectA.left).toBe(defaultValue.left);
            expect(rectA.top).toBe(defaultValue.top);
            expect(rectA.width).toBe(defaultValue.width);
            expect(rectA.height).toBe(defaultValue.height);
        });

        it("Parse Rect (not string and not array)", () => {
            let num: boolean = true;
            rectA = Rect.parseRect(num);
            expect(rectA).toBe(null);
        });

        it("Parse Rect (not string and not array (default value taken)", () => {
            let num: boolean = true;
            let defaultValue = { left: 110, top: 100, width: 115, height: 170 };
            rectA = Rect.parseRect(num, defaultValue);
            expect(rectA.left).toBe(defaultValue.left);
            expect(rectA.top).toBe(defaultValue.top);
            expect(rectA.width).toBe(defaultValue.width);
            expect(rectA.height).toBe(defaultValue.height);
        });

        it("Parse Rect - getting null", () => {
            rectA = Rect.parseRect(null);
            expect(rectA).toBe(null);
        });

        it("Parse Rect - getting null (default value taken)", () => {
            let defaultValue = { left: 110, top: 100, width: 115, height: 170 };
            rectA = Rect.parseRect(null, defaultValue);
            expect(rectA.left).toBe(defaultValue.left);
            expect(rectA.top).toBe(defaultValue.top);
            expect(rectA.width).toBe(defaultValue.width);
            expect(rectA.height).toBe(defaultValue.height);
        });

    });

    describe("Thickness tests", () => {

        let thicknessA;
        let thicknessB;
        let defaultThickness: Shapes.IThickness = { left: 105, top: 100, right: 122, bottom: 122 };

        it("Inflate", () => {
            thicknessA = { left: 120, top: 100, right: 150, bottom: 170 };
            thicknessB = { left: 20, top: 20, right: 20, bottom: 20 };
            let newThickness = Thickness.inflate(thicknessA, thicknessB);
            expect(newThickness.left).toBe(140);
            expect(newThickness.top).toBe(120);
            expect(newThickness.right).toBe(170);
            expect(newThickness.bottom).toBe(190);
        });

        it("Get Width", () => {
            thicknessA = { left: 115, top: 134, right: 212, bottom: 270 };
            let thicknessWidth = Thickness.getWidth(thicknessA);
            expect(thicknessWidth).toBe(327);
        });

        it("Get Width - Zero Thickness", () => {
            thicknessA = { left: 0, top: 0, right: 0, bottom: 0 };
            let thicknessWidth = Thickness.getWidth(thicknessA);
            expect(thicknessWidth).toBe(0);
        });

        it("Get Height", () => {
            thicknessA = { left: 80, top: 215, right: 212, bottom: 15 };
            let thicknessHeight = Thickness.getHeight(thicknessA);
            expect(thicknessHeight).toBe(230);
        });

        it("Get Height", () => {
            thicknessA = { left: 0, top: 0, right: 0, bottom: 0 };
            let thicknessHeight = Thickness.getHeight(thicknessA);
            expect(thicknessHeight).toBe(0);
        });

        it("Clone", () => {
            thicknessA = { left: 158, top: 150, right: 215, bottom: 412 };
            thicknessB = Thickness.clone(thicknessA);
            expect(thicknessB.left).toBe(thicknessA.left);
            expect(thicknessB.top).toBe(thicknessA.top);
            expect(thicknessB.right).toBe(thicknessA.right);
            expect(thicknessB.bottom).toBe(thicknessA.bottom);
        });

        it("Clone - null value", () => {
            thicknessA = null;
            thicknessB = Thickness.clone(thicknessA);
            expect(thicknessB).toBe(null);

        });

        it("Equals - return true", () => {
            thicknessA = { left: 87, top: 156, right: 180, bottom: 95 };
            thicknessB = { left: 87, top: 156, right: 180, bottom: 95 };
            let isEquals = Thickness.equals(thicknessA, thicknessB);
            expect(isEquals).toBe(true);
        });

        it("Equals - return false", () => {
            thicknessA = { left: 87, top: 156, right: 180, bottom: 95 };
            thicknessB = { left: 87, top: 100, right: 180, bottom: 95 };
            let isEquals = Thickness.equals(thicknessA, thicknessB);
            expect(isEquals).toBe(false);
        });

        it("Equals - first value is null", () => {
            thicknessA = null;
            thicknessB = { left: 87, top: 156, right: 180, bottom: 95 };
            let isEquals = Thickness.equals(thicknessA, thicknessB);
            expect(isEquals).toBe(false);
        });

        it("Equals - second value is null", () => {
            thicknessA = { left: 87, top: 156, right: 180, bottom: 95 };
            thicknessB = null;
            let isEquals = Thickness.equals(thicknessA, thicknessB);
            expect(isEquals).toBe(false);
        });

        it("Flip Horizontal", () => {
            thicknessA = { left: 87, top: 156, right: 180, bottom: 95 };
            Thickness.flipHorizontal(thicknessA);
            expect(thicknessA.left).toBe(180);
            expect(thicknessA.right).toBe(87);
            expect(thicknessA.top).toBe(156);
            expect(thicknessA.bottom).toBe(95);

        });

        it("Flip Vertical", () => {
            thicknessA = { left: 87, top: 156, right: 180, bottom: 95 };
            Thickness.flipVertical(thicknessA);
            expect(thicknessA.left).toBe(87);
            expect(thicknessA.right).toBe(180);
            expect(thicknessA.top).toBe(95);
            expect(thicknessA.bottom).toBe(156);

        });

        it("To string", () => {
            thicknessA = { left: 158, top: 150, right: 215, bottom: 412 };
            let thicknessString = Thickness.toString(thicknessA);
            expect(thicknessString).toBe("{top:150, left:158, right:215, bottom:412}");

        });

        it("To Css String", () => {
            thicknessA = { left: 95, top: 140, right: 217, bottom: 107 };
            let thicknessString = Thickness.toCssString(thicknessA);
            expect(thicknessString).toBe("140px 217px 107px 95px");

        });

        it("Is Empty true", () => {
            thicknessA = { left: 0, top: 0, right: 0, bottom: 0 };
            let isEmpty = Thickness.isEmpty(thicknessA);
            expect(isEmpty).toBe(true);

        });

        it("Is Empty false", () => {
            thicknessA = { left: 125, top: 130, right: 114, bottom: 47 };
            let isEmpty = Thickness.isEmpty(thicknessA);
            expect(isEmpty).toBe(false);

        });

        it("Equals (static) - return true ", () => {
            thicknessA = { left: 87, top: 156, right: 180, bottom: 95 };
            thicknessB = { left: 87, top: 156, right: 180, bottom: 95 };
            let areThicknessesEqual = Thickness.equals(thicknessA, thicknessB);
            expect(areThicknessesEqual).toBe(true);
        });

        it("Equals (static) - return false ", () => {
            thicknessA = { left: 125, top: 130, right: 114, bottom: 47 };
            thicknessB = { left: 125, top: 130, right: 110, bottom: 47 };
            let areThicknessesEqual = Thickness.equals(thicknessA, thicknessB);
            expect(areThicknessesEqual).toBe(false);
        });

        it("Equals (static) - Thickness A is null ", () => {
            let thicknessB: Shapes.IThickness = { left: 125, top: 130, right: 114, bottom: 47 };
            let areThicknessesEqual = Thickness.equals(null, thicknessB);
            expect(areThicknessesEqual).toBe(false);
        });

        it("Equals (static) - Thickness B is null ", () => {
            let thicknessA: Shapes.IThickness = { left: 125, top: 130, right: 114, bottom: 47 };
            let areThicknessesEqual = Thickness.equals(thicknessA, null);
            expect(areThicknessesEqual).toBe(false);
        });

        it("Equals (static) - Thicknesses are null ", () => {
            let areThicknessesEqual = Thickness.equals(null, null);
            expect(areThicknessesEqual).toBe(false);
        });

        it("Equals with Precision (static) - return true ", () => {
            thicknessA = { left: 125, top: 130, right: 114, bottom: 47 };
            thicknessB = { left: 125, top: 130, right: 114, bottom: 47 };
            let areThicknessesEqual = Shapes.Thickness.equalWithPrecision(thicknessA, thicknessB);
            expect(areThicknessesEqual).toBe(true);
        });

        it("Parse Thickness (from string no default value)", () => {
            let thicknessStr = "200,215,200,180";
            thicknessA = Thickness.parseThickness(thicknessStr);
            expect(thicknessA.left).toBe(200);
            expect(thicknessA.top).toBe(215);
            expect(thicknessA.right).toBe(200);
            expect(thicknessA.bottom).toBe(180);
        });

        it("Parse Thickness - from string,(default value ignored)", () => {
            let thicknessStr = "190,220,150,170";
            thicknessA = Thickness.parseThickness(thicknessStr, defaultThickness);
            expect(thicknessA.left).toBe(190);
            expect(thicknessA.top).toBe(220);
            expect(thicknessA.right).toBe(150);
            expect(thicknessA.bottom).toBe(170);
        });

        it("Parse Thickness (from empty string)", () => {
            let thicknessStr = "";
            thicknessA = Thickness.parseThickness(thicknessStr);
            expect(thicknessA).toBe(null);
        });

        it("Parse Thickness - from empty string (default value taken)", () => {
            let thicknessStr = "";
            thicknessA = Thickness.parseThickness(thicknessStr, defaultThickness);
            expect(thicknessA.left).toBe(defaultThickness.left);
            expect(thicknessA.top).toBe(defaultThickness.top);
            expect(thicknessA.right).toBe(defaultThickness.right);
            expect(thicknessA.bottom).toBe(defaultThickness.bottom);
        });

        it("Parse Thickness (from int array)", () => {
            let intArray = [190, 220, 100, 150];
            thicknessA = Thickness.parseThickness(intArray);
            expect(thicknessA.left).toBe(190);
            expect(thicknessA.top).toBe(220);
            expect(thicknessA.right).toBe(100);
            expect(thicknessA.bottom).toBe(150);
        });

        it("Parse Thickness - from int array (default value ignored)", () => {
            let intArray = [190, 220, 130, 115];
            thicknessA = Thickness.parseThickness(intArray, defaultThickness);
            expect(thicknessA.left).toBe(190);
            expect(thicknessA.top).toBe(220);
            expect(thicknessA.right).toBe(130);
            expect(thicknessA.bottom).toBe(115);
        });

        it("Parse Thickness (int with more than 4 elements)", () => {
            let intArray = [190, 220, 200, 210, 118];
            thicknessA = Thickness.parseThickness(intArray);
            expect(thicknessA).toBe(null);
        });

        it("Parse Thickness (int with more than 4 elements (default value ignored)", () => {
            let intArray = [190, 220, 200, 210];
            thicknessA = Thickness.parseThickness(intArray, defaultThickness);
            expect(thicknessA.left).toBe(190);
            expect(thicknessA.top).toBe(220);
            expect(thicknessA.right).toBe(200);
            expect(thicknessA.bottom).toBe(210);
        });

        it("Parse Thickness (int with one element)", () => {
            let intArray = [190];
            thicknessA = Thickness.parseThickness(intArray);
            expect(thicknessA).toBe(null);
        });

        it("Parse Thickness (int with one element (default value taken)", () => {
            let intArray = [190];
            thicknessA = Thickness.parseThickness(intArray, defaultThickness);
            expect(thicknessA.left).toBe(defaultThickness.left);
            expect(thicknessA.top).toBe(defaultThickness.top);
            expect(thicknessA.right).toBe(defaultThickness.right);
            expect(thicknessA.bottom).toBe(defaultThickness.bottom);
        });

        it("Parse Thickness (int with empty array)", () => {
            let intArray = [];
            thicknessA = Thickness.parseThickness(intArray);
            expect(thicknessA).toBe(null);
        });

        it("Parse Thickness (int with empty array (default value taken)", () => {
            let intArray = [];
            thicknessA = Thickness.parseThickness(intArray, defaultThickness);
            expect(thicknessA.left).toBe(defaultThickness.left);
            expect(thicknessA.top).toBe(defaultThickness.top);
            expect(thicknessA.right).toBe(defaultThickness.right);
            expect(thicknessA.bottom).toBe(defaultThickness.bottom);
        });

        it("Parse Thickness (not string and not array)", () => {
            let num: boolean = true;
            thicknessA = Thickness.parseThickness(num);
            expect(thicknessA).toBe(null);
        });

        it("Parse Thickness (not string and not array (default value taken)", () => {
            let num: boolean = true;
            thicknessA = Thickness.parseThickness(num, defaultThickness);
            expect(thicknessA.left).toBe(defaultThickness.left);
            expect(thicknessA.top).toBe(defaultThickness.top);
            expect(thicknessA.right).toBe(defaultThickness.right);
            expect(thicknessA.bottom).toBe(defaultThickness.bottom);
        });

        it("Parse Thickness - getting null", () => {
            thicknessA = Thickness.parseThickness(null);
            expect(thicknessA).toBe(null);
        });

        it("Parse Thickness - getting null (default value taken)", () => {
            thicknessA = Thickness.parseThickness(null, defaultThickness);
            expect(thicknessA.left).toBe(defaultThickness.left);
            expect(thicknessA.top).toBe(defaultThickness.top);
            expect(thicknessA.right).toBe(defaultThickness.right);
            expect(thicknessA.bottom).toBe(defaultThickness.bottom);
        });

    });

    describe("Vector tests", () => {
        let vectorA;
        let vectorB;

        it("Is Empty true", () => {
            vectorA = { x: 0, y: 0 };
            let isEmpty = Vector.isEmpty(vectorA);
            expect(isEmpty).toBe(true);

        });

        it("Is Empty false", () => {
            vectorA = { x: 125, y: 130 };
            let isEmpty = Vector.isEmpty(vectorA);
            expect(isEmpty).toBe(false);

        });

        it("Equals - return true", () => {
            vectorA = { x: 180, y: 95 };
            vectorB = { x: 180, y: 95 };
            let isEquals = Vector.equals(vectorA, vectorB);
            expect(isEquals).toBe(true);
        });

        it("Equals - return false", () => {
            vectorA = { x: 180, y: 95 };
            vectorB = { x: 100, y: 180 };
            let isEquals = Vector.equals(vectorA, vectorB);
            expect(isEquals).toBe(false);
        });

        it("Equals - first value is null", () => {
            vectorA = null;
            vectorB = { x: 150, y: 117 };
            let isEquals = Vector.equals(vectorA, vectorB);
            expect(isEquals).toBe(false);
        });

        it("Equals - second value is null", () => {
            vectorA = { x: 156, y: 95 };
            vectorB = null;
            let isEquals = Vector.equals(vectorA, vectorB);
            expect(isEquals).toBe(false);
        });

        it("Clone", () => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.clone(vectorA);
            expect(vectorB.left).toBe(vectorA.left);
            expect(vectorB.top).toBe(vectorA.top);

        });

        it("Clone - null value", () => {
            vectorA = null;
            vectorB = Vector.clone(vectorA);
            expect(vectorB).toBe(null);

        });

        it("To string", () => {
            vectorA = { x: 215, y: 412 };
            let vectorString = Vector.toString(vectorA);
            expect(vectorString).toBe("{x:215, y:412}");

        });

        it("Get Length", () => {
            vectorA = { x: 215, y: 412 };
            let vectorLength = Vector.getLength(vectorA);
            let vectorLengthCalculated = Math.sqrt(215 * 215 + 412 * 412);
            expect(vectorLength).toBe(vectorLengthCalculated);
        });

        it("Get Length - Zero", () => {
            vectorA = { x: 0, y: 0 };
            let vectorLength = Vector.getLength(vectorA);
            expect(vectorLength).toBe(0);
        });

        it("Get Length Sqr", () => {
            vectorA = { x: 215, y: 412 };
            let vectorLength = Vector.getLengthSqr(vectorA);
            let vectorLengthCalculated = 215 * 215 + 412 * 412;
            expect(vectorLength).toBe(vectorLengthCalculated);
        });

        it("Get Length Sqr - Zero", () => {
            vectorA = { x: 0, y: 0 };
            let vectorLength = Vector.getLengthSqr(vectorA);
            expect(vectorLength).toBe(0);
        });

        it("Scale - Greater than 1", () => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.scale(vectorA, 15);
            expect(vectorB.x).toBe(vectorA.x * 15);
            expect(vectorB.y).toBe(vectorA.y * 15);
        });

        it("Scale -  1", () => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.scale(vectorA, 1);
            expect(vectorB.x).toBe(vectorA.x);
            expect(vectorB.y).toBe(vectorA.y);
        });

        it("Scale -  between 0 and 1", () => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.scale(vectorA, 0.4);
            expect(vectorB.x).toBe(vectorA.x * 0.4);
            expect(vectorB.y).toBe(vectorA.y * 0.4);
        });

        it("Scale -  0", () => {
            vectorA = { x: 215, y: 412 };;
            vectorB = Vector.scale(vectorA, 0);
            expect(vectorB.x).toBe(0);
            expect(vectorB.y).toBe(0);
        });

        it("Scale -  Negative", () => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.scale(vectorA, -4);
            expect(vectorB.x).toBe(vectorA.x * -4);
            expect(vectorB.y).toBe(vectorA.y * -4);
        });

        it("Normalize", () => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.normalize(vectorA);
            let vectorALength = Vector.getLength(vectorA);
            let newVector: Shapes.IVector = { x: vectorA.x / vectorALength, y: vectorA.y / vectorALength };
            expect(newVector.x).toBe(vectorB.x);
            expect(newVector.y).toBe(vectorB.y);
        });

        it("Normalize - empty vector", () => {
            vectorA = { x: 0, y: 0 };
            vectorB = Vector.normalize(vectorA);
            expect(vectorB.x).toBe(0);
            expect(vectorB.y).toBe(0);
        });

        it("Rotate Vector 90 degrees CW", () => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.rotate90DegCW(vectorA);
            expect(vectorB.x).toBe(vectorA.y);
            expect(vectorB.y).toBe(-vectorA.x);
        });

        it("Rotate Vector 90 degrees CCW", () => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.rotate90DegCCW(vectorA);
            expect(vectorB.x).toBe(-vectorA.y);
            expect(vectorB.y).toBe(vectorA.x);
        });

        /*Using the Vector rotate formula newX=(X*cosA)-(y*sinA) */
        it("Rotate - between 0 to 360 degrees", () => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.rotate(vectorA, 47);
            let newVector: Shapes.IVector = { x: vectorA.x * Math.cos(47) - vectorA.y * Math.sin(47), y: vectorA.x * Math.sin(47) + vectorA.y * Math.cos(47) };
            expect(vectorB.x).toBe(newVector.x);
            expect(vectorB.y).toBe(newVector.y);
        });

        it("Rotate - 0 degrees", () => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.rotate(vectorA, 0);
            expect(vectorB.x).toBe(vectorA.x);
            expect(vectorB.y).toBe(vectorA.y);
        });

        it("Equals (static) - return true ", () => {
            vectorA = { x: 130, y: 47 };
            vectorB = { x: 130, y: 47 };
            let areVectorsEqual = Vector.equals(vectorA, vectorB);
            expect(areVectorsEqual).toBe(true);
        });

        it("Equals (static) - return false ", () => {
            vectorA = { x: 114, y: 47 };
            vectorB = { x: 110, y: 47 };
            let areVectorsEqual = Vector.equals(vectorA, vectorB);
            expect(areVectorsEqual).toBe(false);
        });

        it("Equals (static) - Vector A is null ", () => {
            vectorB = { x: 121, y: 88 };
            let areVectorsEqual = Vector.equals(null, vectorB);
            expect(areVectorsEqual).toBe(false);
        });

        it("Equals (static) - Vector B is null ", () => {
            vectorA = { x: 114, y: 47 };
            let areVectorsEqual = Vector.equals(vectorA, null);
            expect(areVectorsEqual).toBe(false);
        });

        it("Equals (static) - Vectors are null ", () => {
            let areVectorsEqual = Vector.equals(null, null);
            expect(areVectorsEqual).toBe(false);
        });

        it("Equals with Precision (static) - return true ", () => {
            vectorA = { x: 130, y: 114.4 };
            vectorB = { x: 130, y: 114.4 };
            let areVectorsEqual = Shapes.Thickness.equalWithPrecision(vectorA, vectorB);
            expect(areVectorsEqual).toBe(true);
        });

        it("Equals with Precision (static) - return false ", () => {
            vectorA = { x: 130.2, y: 114 };
            vectorB = { x: 130, y: 114 };
            let areVectorsEqual = Shapes.Thickness.equalWithPrecision(vectorA, vectorB);
            expect(areVectorsEqual).toBe(true);
        });

        it("Add 2 Vectors", () => {
            vectorA = { x: 114, y: 47 };
            vectorB = { x: 117, y: 134 };
            let newVector = Vector.add(vectorA, vectorB);
            expect(newVector.x).toBe(vectorA.x + vectorB.x);
            expect(newVector.y).toBe(vectorA.y + vectorB.y);
        });

        it("Add Vector to Empty Vector", () => {
            vectorA = { x: 114, y: 47 };
            vectorB = { x: 0, y: 0 };
            let newVector = Vector.add(vectorA, vectorB);
            expect(newVector.x).toBe(vectorA.x);
            expect(newVector.y).toBe(vectorA.y);
        });

        it("Add Vector to its Inverse vector", () => {
            vectorA = { x: 114, y: 47 };
            vectorB = { x: -114, y: -47 };
            let newVector = Vector.add(vectorA, vectorB);
            expect(newVector.x).toBe(0);
            expect(newVector.y).toBe(0);
        });

        it("Subtract 2 Vectors", () => {
            vectorA = { x: 114, y: 47 };
            vectorB = { x: 117, y: 134 };
            let newVector = Vector.subtract(vectorA, vectorB);
            expect(newVector.x).toBe(vectorA.x - vectorB.x);
            expect(newVector.y).toBe(vectorA.y - vectorB.y);
        });

        it("Subtract Vector to Empty Vector", () => {
            vectorA = { x: 114, y: 47 };
            vectorB = { x: 0, y: 0 };
            let newVector = Vector.subtract(vectorA, vectorB);
            expect(newVector.x).toBe(vectorA.x);
            expect(newVector.y).toBe(vectorA.y);
        });

        it("Subtract Vector from the same vector", () => {
            vectorA = { x: 116, y: 49 };
            vectorB = { x: 116, y: 49 };
            let newVector = Vector.subtract(vectorA, vectorB);
            expect(newVector.x).toBe(0);
            expect(newVector.y).toBe(0);
        });

        it("dotProduct", () => {
            vectorA = { x: 116, y: 49 };
            vectorA = { x: 140, y: 154 };
            let dotProduct = Shapes.Vector.dotProduct(vectorA, vectorB);
            let dotProductCalculated = vectorA.x * vectorB.x + vectorA.y * vectorB.y;
            expect(dotProduct).toBe(dotProductCalculated);
        });

        it("Delta Vector", () => {
            let pointA: Shapes.IPoint = { x: 145, y: 217 };
            let pointB: Shapes.IPoint = { x: 140, y: 154 };
            let vectorA = Shapes.Vector.getDeltaVector(pointA, pointB);
            expect(vectorA.x).toBe(pointB.x - pointA.x);
            expect(vectorA.y).toBe(pointB.y - pointA.y);
        });
    });
}
