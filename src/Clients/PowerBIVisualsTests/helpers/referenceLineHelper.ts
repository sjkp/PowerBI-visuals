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

module powerbitests.helpers {
    const dashedArray = '5px, 5px';
    const dottedArray = '1px, 5px';

    export interface VerifyReferenceLineProperties {
        color: string;
        opacity: number;
        style: string;
        inFront: boolean;
        isHorizontal: boolean;
        label?: {
            text: string;
            color: string;
            horizontalPosition: string;
            verticalPosition: string;
            displayUnits: number;
        };
    };

    function node1IsBeforeNode2(node1: JQuery, node2: JQuery): boolean {
        let flags = node1.get(0).compareDocumentPosition(node2.get(0));

        return 0 !== (flags & Node.DOCUMENT_POSITION_FOLLOWING);
    }

    export function verifyReferenceLine(line: JQuery, label: JQuery, graphicsContext: JQuery, properties: VerifyReferenceLineProperties) {

        helpers.assertColorsMatch(line.css('stroke'), properties.color);

        if (properties.style === powerbi.visuals.lineStyle.dotted)
            expect(line.css('stroke-dasharray')).toEqual(dottedArray);
        else if (properties.style === powerbi.visuals.lineStyle.dashed)
            expect(line.css('stroke-dasharray')).toEqual(dashedArray);
        else
            expect(line.css('stroke-dasharray')).toBeUndefined();

        expect(parseFloat(line.css('stroke-opacity'))).toBeCloseTo(properties.opacity, 3);

        let y1 = line.attr('y1');
        let y2 = line.attr('y2');
        let x1 = line.attr('x1');
        let x2 = line.attr('x2');
        if (properties.isHorizontal) {
            expect(y1).toEqual(y2);
        }
        else {
            expect(x1).toEqual(x2);
        }

        expect(node1IsBeforeNode2(line, graphicsContext)).toBe(!properties.inFront);

        if (!properties.label)
            return;

        expect(label.text()).toEqual(properties.label.text);

        let labelColor = properties.label.color;
        helpers.assertColorsMatch(label.css('fill'), labelColor);

        let labelX = parseFloat(label.attr('x'));
        let labelY = parseFloat(label.attr('y'));
        if (properties.isHorizontal) {
            if (properties.label.horizontalPosition === powerbi.visuals.referenceLineDataLabelHorizontalPosition.left) {
                expect(helpers.isCloseTo(labelX, parseFloat(x1), 30)).toBeTruthy();
            }
            else {
                expect(helpers.isCloseTo(labelX + label.width(), parseFloat(x2), 30)).toBeTruthy();
            }

            if (properties.label.verticalPosition === powerbi.visuals.referenceLineDataLabelVerticalPosition.above) {
                expect(labelY).toBeLessThan(parseFloat(y1));
            }
            else {
                expect(labelY).toBeGreaterThan(parseFloat(y1));
            }
        }
        else {
            if (properties.label.horizontalPosition === powerbi.visuals.referenceLineDataLabelHorizontalPosition.left) {
                expect(labelX).toBeLessThan(parseFloat(x1));
            }
            else {
                expect(labelX).toBeGreaterThan(parseFloat(x1));
            }

            if (properties.label.verticalPosition === powerbi.visuals.referenceLineDataLabelVerticalPosition.above) {
                expect(helpers.isCloseTo(labelY, parseFloat(y1), 30)).toBeTruthy();
            }
            else {
                expect(helpers.isCloseTo(labelY, parseFloat(y2), 30)).toBeTruthy();
            }
        }
    }
}