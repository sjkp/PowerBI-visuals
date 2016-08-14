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
    import LabelArrangeGrid = powerbi.LabelArrangeGrid;
    import LabelDataPoint = powerbi.LabelDataPoint;
    
    //import Label = powerbi.Label;
    import LabelParentRect = powerbi.LabelParentRect;
    import LabelParentPoint = powerbi.LabelParentPoint;
    import IRect = powerbi.visuals.IRect;
    import IPoint = powerbi.visuals.shapes.IPoint;
    import RectOrientation = powerbi.NewRectOrientation;
    import RectLabelPosition = powerbi.RectLabelPosition;
    import PointLabelPosition = powerbi.NewPointLabelPosition;
    import DataLabelRectPositioner = powerbi.DataLabelRectPositioner;
    import DataLabelPointPositioner = powerbi.DataLabelPointPositioner;
    import LabelLayout = powerbi.LabelLayout;
    import LabelDataPointParentType = powerbi.LabelDataPointParentType;

    let testOutsideFillColor = "#000000";
    let testInsideFillColor = "#FFFFFF";

    describe("LabelArrangeGrid tests", () => {
        let viewport: powerbi.IViewport = { width: 500, height: 500 };
        let labelArrangeGrid: LabelArrangeGrid;

        beforeEach(() => {
            let labelDataPoints: LabelDataPoint[] = [
                createLabelDataPoint("123"),
                createLabelDataPoint("12345"),
                createLabelDataPoint("1234567"),
            ];
            labelArrangeGrid = new LabelArrangeGrid([{ labelDataPoints: labelDataPoints, maxNumberOfLabels: labelDataPoints.length }], viewport);
        });

        it("Constructor creates correct grid system", () => {
            expect(labelArrangeGrid["viewport"]).toEqual(viewport);
            expect(labelArrangeGrid["cellSize"]).toEqual({ width: 140, height: 20 });
            expect(labelArrangeGrid["columnCount"]).toEqual(4);
            expect(labelArrangeGrid["rowCount"]).toEqual(25);
        });

        it("Empty grid has no conflict", () => {
            expect(labelArrangeGrid.hasConflict(createRect(0, 0, 500, 500))).toBe(false);
        });

        it("Grid treats outside viewport as conflict", () => {
            expect(labelArrangeGrid.hasConflict(createRect(-100, -100, 50, 50))).toBe(true);
            expect(labelArrangeGrid.hasConflict(createRect(-10, -10, 50, 50))).toBe(true);
            expect(labelArrangeGrid.hasConflict(createRect(450, 450, 100, 100))).toBe(true);
            expect(labelArrangeGrid.hasConflict(createRect(-50, -50, 600, 600))).toBe(true);
        });

        it("Grid detects no incorrect conflicts", () => {
            labelArrangeGrid.add(createRect(10, 10, 50, 50));
            labelArrangeGrid.add(createRect(100, 100, 100, 100));
            labelArrangeGrid.add(createRect(400, 10, 50, 50));
            expect(labelArrangeGrid.hasConflict(createRect(0, 0, 5, 5))).toBe(false);
            expect(labelArrangeGrid.hasConflict(createRect(205, 100, 100, 100))).toBe(false);
            expect(labelArrangeGrid.hasConflict(createRect(425, 75, 50, 50))).toBe(false);
        });

        it("Grid detects no incorrect conflicts", () => {
            labelArrangeGrid.add(createRect(10, 10, 50, 50));
            labelArrangeGrid.add(createRect(100, 100, 100, 100));
            labelArrangeGrid.add(createRect(400, 10, 50, 50));
            expect(labelArrangeGrid.hasConflict(createRect(35, 35, 5, 5))).toBe(true);
            expect(labelArrangeGrid.hasConflict(createRect(150, 100, 100, 100))).toBe(true);
            expect(labelArrangeGrid.hasConflict(createRect(425, 35, 50, 50))).toBe(true);
        });

        it("Grid tryPositionInViewport", () => {
            expect(labelArrangeGrid.tryPositionInViewport(createRect(-5, 0, 50, 50))).toEqual(createRect(0, 0, 50, 50));
            expect(labelArrangeGrid.tryPositionInViewport(createRect(10, -10, 50, 50))).toEqual(createRect(10, 0, 50, 50));
            expect(labelArrangeGrid.tryPositionInViewport(createRect(-5, -5, 50, 50))).toEqual(createRect(0, 0, 50, 50));
            expect(labelArrangeGrid.tryPositionInViewport(createRect(510, 10, 50, 50))).toEqual(createRect(450, 10, 50, 50));
            expect(labelArrangeGrid.tryPositionInViewport(createRect(10, 510, 50, 50))).toEqual(createRect(10, 450, 50, 50));
            expect(labelArrangeGrid.tryPositionInViewport(createRect(510, 510, 50, 50))).toEqual(createRect(450, 450, 50, 50));
        });

        it("Grid tryPositionInViewport returns null when movement causes a collision", () => {
            labelArrangeGrid.add(createRect(10, 10, 30, 30));
            expect(labelArrangeGrid.tryPositionInViewport(createRect(10, -10, 20, 20))).toBeUndefined();
        });

        it("Grid tryPositionInViewport returns null for rects too far outside viewport", () => {
            expect(labelArrangeGrid.tryPositionInViewport(createRect(-100, 20, 30, 30))).toBeUndefined();
        });
    });

    describe("LabelLayout tests", () => {
        let labelLayout: LabelLayout;
        let viewport = { width: 500, height: 500 };

        beforeEach(() => {
            labelLayout = new LabelLayout({
                startingOffset: 5,
                maximumOffset: 20,
                horizontalPadding:2,
                verticalPadding:2
            });
        });

        it("Label is correctly laid out", () => {
            let labelDataPoints = [
                createLabelDataPoint("text", true, {
                    orientation: RectOrientation.VerticalBottomBased,
                    rect: createRect(100, 100, 50, 100),
                    validPositions: [RectLabelPosition.OutsideEnd],
                }),
            ];
            let labels = labelLayout.layout([{ labelDataPoints: labelDataPoints, maxNumberOfLabels: labelDataPoints.length }], viewport);
            expect(labels.length).toBe(1);
            expect(labels[0].boundingBox).toEqual(createRect(105, 85, 40, 10));
            expect(labels[0].isVisible).toBe(true);
        });

        it("Label has correct text", () => {
            let labelDataPoints = [
                createLabelDataPoint("text", true, {
                    orientation: RectOrientation.VerticalBottomBased,
                    rect: createRect(100, 100, 50, 100),
                    validPositions: [RectLabelPosition.OutsideEnd],
                }),
            ];
            let labels = labelLayout.layout([{ labelDataPoints: labelDataPoints, maxNumberOfLabels: labelDataPoints.length }], viewport);
            expect(labels[0].text).toBe("text");
        });

        it("Label uses outside fill color", () => {
            let labelDataPoints = [
                createLabelDataPoint("text", true, {
                    orientation: RectOrientation.VerticalBottomBased,
                    rect: createRect(100, 100, 50, 100),
                    validPositions: [RectLabelPosition.OutsideEnd],
                }),
            ];
            let labels = labelLayout.layout([{ labelDataPoints: labelDataPoints, maxNumberOfLabels: labelDataPoints.length }], viewport);
            helpers.assertColorsMatch(labels[0].fill, testOutsideFillColor);
        });

        it("Label uses inside fill color", () => {
            let labelDataPoints = [
                createLabelDataPoint("text", true, {
                    orientation: RectOrientation.VerticalBottomBased,
                    rect: createRect(100, 100, 50, 100),
                    validPositions: [RectLabelPosition.InsideEnd],
                }),
            ];
            let labels = labelLayout.layout([{ labelDataPoints: labelDataPoints, maxNumberOfLabels: labelDataPoints.length }], viewport);
            expect(labels[0].fill).toBe(testInsideFillColor);
        });

        it("Layout changes position of overlapping labels", () => {
            let labelDataPoints = [
                createLabelDataPoint("tex0", true, {
                    orientation: RectOrientation.VerticalBottomBased,
                    rect: createRect(100, 100, 50, 100),
                    validPositions: [RectLabelPosition.OutsideEnd, RectLabelPosition.InsideEnd],
                }),
                createLabelDataPoint("tex1", true, {
                    orientation: RectOrientation.VerticalBottomBased,
                    rect: createRect(100, 100, 50, 100),
                    validPositions: [RectLabelPosition.OutsideEnd, RectLabelPosition.InsideEnd],
                }),
            ];
            let labels = labelLayout.layout([{ labelDataPoints: labelDataPoints, maxNumberOfLabels: labelDataPoints.length }], viewport);
            expect(labels.length).toBe(2);
            expect(labels[0].boundingBox).toEqual(createRect(105, 85, 40, 10));
            expect(labels[0].isVisible).toBe(true);
            helpers.assertColorsMatch(labels[0].fill, testOutsideFillColor);
            expect(labels[1].boundingBox).toEqual(createRect(105, 105, 40, 10));
            expect(labels[1].isVisible).toBe(true);
            expect(labels[1].fill).toBe(testInsideFillColor);
        });

        it("Layout changes offset when no other valid positions change", () => {
            let labelDataPoints = [
                createLabelDataPoint("tex0", true, {
                    orientation: RectOrientation.VerticalBottomBased,
                    rect: createRect(100, 100, 50, 100),
                    validPositions: [RectLabelPosition.OutsideEnd],
                }),
                createLabelDataPoint("tex0", true, {
                    orientation: RectOrientation.VerticalBottomBased,
                    rect: createRect(100, 100, 50, 100),
                    validPositions: [RectLabelPosition.OutsideEnd],
                }),
            ];
            let labels = labelLayout.layout([{ labelDataPoints: labelDataPoints, maxNumberOfLabels: labelDataPoints.length }], viewport);
            expect(labels.length).toBe(2);
            expect(labels[0].boundingBox).toEqual(createRect(105, 85, 40, 10));
            expect(labels[0].isVisible).toBe(true);
            expect(labels[1].boundingBox).toEqual(createRect(105, 73, 40, 10));
            expect(labels[1].isVisible).toBe(true);
        });

        it("Layout culls labels when offset gets too large", () => {
            let labelDataPoints = [
                createLabelDataPoint("tex0", true, {
                    orientation: RectOrientation.VerticalBottomBased,
                    rect: createRect(100, 100, 50, 100),
                    validPositions: [RectLabelPosition.OutsideEnd],
                }),
                createLabelDataPoint("tex1", true, {
                    orientation: RectOrientation.VerticalBottomBased,
                    rect: createRect(100, 100, 50, 100),
                    validPositions: [RectLabelPosition.OutsideEnd],
                }),
                createLabelDataPoint("tex2", true, {
                    orientation: RectOrientation.VerticalBottomBased,
                    rect: createRect(100, 100, 50, 100),
                    validPositions: [RectLabelPosition.OutsideEnd],
                }),
            ];
            let labels = labelLayout.layout([{ labelDataPoints: labelDataPoints, maxNumberOfLabels: labelDataPoints.length }], viewport);
            expect(labels.length).toBe(2);
        });
    });

    describe("DataLabelRectPositioner tests", () => {
        let parentRect = createRect(0, 0, 100, 50);
        let offset = 5;
        let vbLabelDataPoint = createLabelDataPoint("text", true, {
            orientation: RectOrientation.VerticalBottomBased,
            rect: parentRect,
            validPositions: [],
        });
        let vtLabelDataPoint = createLabelDataPoint("text", true, {
            orientation: RectOrientation.VerticalTopBased,
            rect: parentRect,
            validPositions: [],
        });
        let hlLabelDataPoint = createLabelDataPoint("text", true, {
            orientation: RectOrientation.HorizontalLeftBased,
            rect: parentRect,
            validPositions: [],
        });
        let hrLabelDataPoint = createLabelDataPoint("text", true, {
            orientation: RectOrientation.HorizontalRightBased,
            rect: parentRect,
            validPositions: [],
        });

        let topInside = createRect(30, 5, 40, 10);
        let bottomInside = createRect(30, 35, 40, 10);
        let leftInside = createRect(5, 20, 40, 10);
        let rightInside = createRect(55, 20, 40, 10);
        let topOutside = createRect(30, -15, 40, 10);
        let bottomOutside = createRect(30, 55, 40, 10);
        let leftOutside = createRect(-45, 20, 40, 10);
        let rightOutside = createRect(105, 20, 40, 10);
        let middleHorizontal = createRect(35, 20, 40, 10);
        let middleVertical = createRect(30, 25, 40, 10);

        it("Inside center positioning", () => {
            let position = RectLabelPosition.InsideCenter;
            expect(DataLabelRectPositioner.getLabelRect(vbLabelDataPoint, position, offset)).toEqual(middleVertical);
            expect(DataLabelRectPositioner.getLabelRect(vtLabelDataPoint, position, offset)).toEqual(middleVertical);
            expect(DataLabelRectPositioner.getLabelRect(hlLabelDataPoint, position, offset)).toEqual(middleHorizontal);
            expect(DataLabelRectPositioner.getLabelRect(hrLabelDataPoint, position, offset)).toEqual(middleHorizontal);
        });

        it("Inside base positioning", () => {
            let position = RectLabelPosition.InsideBase;
            expect(DataLabelRectPositioner.getLabelRect(vbLabelDataPoint, position, offset)).toEqual(bottomInside);
            expect(DataLabelRectPositioner.getLabelRect(vtLabelDataPoint, position, offset)).toEqual(topInside);
            expect(DataLabelRectPositioner.getLabelRect(hlLabelDataPoint, position, offset)).toEqual(leftInside);
            expect(DataLabelRectPositioner.getLabelRect(hrLabelDataPoint, position, offset)).toEqual(rightInside);
        });

        it("Inside End positioning", () => {
            let position = RectLabelPosition.InsideEnd;
            expect(DataLabelRectPositioner.getLabelRect(vbLabelDataPoint, position, offset)).toEqual(topInside);
            expect(DataLabelRectPositioner.getLabelRect(vtLabelDataPoint, position, offset)).toEqual(bottomInside);
            expect(DataLabelRectPositioner.getLabelRect(hlLabelDataPoint, position, offset)).toEqual(rightInside);
            expect(DataLabelRectPositioner.getLabelRect(hrLabelDataPoint, position, offset)).toEqual(leftInside);
        });

        it("Outside end positioning", () => {
            let position = RectLabelPosition.OutsideEnd;
            expect(DataLabelRectPositioner.getLabelRect(vbLabelDataPoint, position, offset)).toEqual(topOutside);
            expect(DataLabelRectPositioner.getLabelRect(vtLabelDataPoint, position, offset)).toEqual(bottomOutside);
            expect(DataLabelRectPositioner.getLabelRect(hlLabelDataPoint, position, offset)).toEqual(rightOutside);
            expect(DataLabelRectPositioner.getLabelRect(hrLabelDataPoint, position, offset)).toEqual(leftOutside);
        });

        it("Outside base positioning", () => {
            let position = RectLabelPosition.OutsideBase;
            expect(DataLabelRectPositioner.getLabelRect(vbLabelDataPoint, position, offset)).toEqual(bottomOutside);
            expect(DataLabelRectPositioner.getLabelRect(vtLabelDataPoint, position, offset)).toEqual(topOutside);
            expect(DataLabelRectPositioner.getLabelRect(hlLabelDataPoint, position, offset)).toEqual(leftOutside);
            expect(DataLabelRectPositioner.getLabelRect(hrLabelDataPoint, position, offset)).toEqual(rightOutside);
        });
    });

    describe("DataLabelPointPositioner tests", () => {
        let offset = 5;
        let pointLabelDataPoint = createLabelDataPoint("text", false, null, {
            point: createPoint(50, 50),
            radius: 5,
            validPositions: [],
        });

        it("Above positioning", () => {
            expect(DataLabelPointPositioner.getLabelRect(pointLabelDataPoint.textSize, <LabelParentPoint>pointLabelDataPoint.parentShape, PointLabelPosition.Above, offset)).toEqual(createRect(30, 30, 40, 10));
        });

        it("Below positioning", () => {
            expect(DataLabelPointPositioner.getLabelRect(pointLabelDataPoint.textSize, <LabelParentPoint>pointLabelDataPoint.parentShape, PointLabelPosition.Below, offset)).toEqual(createRect(30, 60, 40, 10));
        });

        it("Left positioning", () => {
            expect(DataLabelPointPositioner.getLabelRect(pointLabelDataPoint.textSize, <LabelParentPoint>pointLabelDataPoint.parentShape, PointLabelPosition.Left, offset)).toEqual(createRect(0, 45, 40, 10));
        });

        it("Right positioning", () => {
            expect(DataLabelPointPositioner.getLabelRect(pointLabelDataPoint.textSize, <LabelParentPoint>pointLabelDataPoint.parentShape, PointLabelPosition.Right, offset)).toEqual(createRect(60, 45, 40, 10));
        });

        it("Center positioning", () => {
            expect(DataLabelPointPositioner.getLabelRect(pointLabelDataPoint.textSize, <LabelParentPoint>pointLabelDataPoint.parentShape, PointLabelPosition.Center, offset)).toEqual(createRect(30, 45, 40, 10));
        });

        it("Above Left positioning", () => {
            let labelRect = DataLabelPointPositioner.getLabelRect(pointLabelDataPoint.textSize, <LabelParentPoint>pointLabelDataPoint.parentShape, PointLabelPosition.AboveLeft, offset);
            expect(labelRect.left).toBeCloseTo(1, 0);
            expect(labelRect.top).toBeCloseTo(35, 0);
            expect(labelRect.width).toBe(40);
            expect(labelRect.height).toBe(10);
        });

        it("Below Left positioning", () => {
            let labelRect = DataLabelPointPositioner.getLabelRect(pointLabelDataPoint.textSize, <LabelParentPoint>pointLabelDataPoint.parentShape, PointLabelPosition.BelowLeft, offset);
            expect(labelRect.left).toBeCloseTo(1, 0);
            expect(labelRect.top).toBeCloseTo(55, 0);
            expect(labelRect.width).toBe(40);
            expect(labelRect.height).toBe(10);
        });

        it("Above Right positioning", () => {
            let labelRect = DataLabelPointPositioner.getLabelRect(pointLabelDataPoint.textSize, <LabelParentPoint>pointLabelDataPoint.parentShape, PointLabelPosition.AboveRight, offset);
            expect(labelRect.left).toBeCloseTo(59, 0);
            expect(labelRect.top).toBeCloseTo(35, 0);
            expect(labelRect.width).toBe(40);
            expect(labelRect.height).toBe(10);
        });

        it("Below Right positioning", () => {
            let labelRect = DataLabelPointPositioner.getLabelRect(pointLabelDataPoint.textSize, <LabelParentPoint>pointLabelDataPoint.parentShape, PointLabelPosition.BelowRight, offset);
            expect(labelRect.left).toBeCloseTo(59, 0);
            expect(labelRect.top).toBeCloseTo(55, 0);
            expect(labelRect.width).toBe(40);
            expect(labelRect.height).toBe(10);
        });
    });

    function createLabelDataPoint(text: string, isParentRect?: boolean, parentRect?: LabelParentRect, parentPoint?: LabelParentPoint): LabelDataPoint {
        return {
            text: text,
            textSize: {
                width: text.length * 10,
                height: 10
            },
            labelSize: {
                width: text.length * 10,
                height: 10
            },
            isPreferred: true,
            insideFill: testInsideFillColor,
            outsideFill: testOutsideFillColor,
            parentType: !!isParentRect ? LabelDataPointParentType.Rectangle : LabelDataPointParentType.Point,
            parentShape: isParentRect ? parentRect : parentPoint,
            identity: null,
        };
    }

    function createRect(left: number, top: number, width: number, height: number): IRect {
        return {
            left: left,
            top: top,
            width: width,
            height: height,
        };
    }

    function createPoint(x: number, y: number): IPoint {
        return { x: x, y: y };
    }
}
