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

module powerbitests.customVisuals.helpers {
    //(<any>jasmine).DEFAULT_TIMEOUT_INTERVAL = 999999;
    import Rect = powerbi.visuals.Rect;

    export type isInRange = (value: number, min: number, max: number) => boolean;
    export type compareValues = (value1: number, value2) => boolean;

    export let d3TimerEnabled: boolean = (() => {
        let d3Timer = d3.timer;
        let d3DisabledTimer = _.merge(callback => d3Timer(callback, 0, 0), d3Timer);

        Object.defineProperty(helpers, 'd3TimerEnabled', { enumerable: true, 
            get: () => d3Timer === d3.timer,
            set: (value) => {
                if(d3TimerEnabled===!value) {
                    (<any>d3).timer = value ? d3Timer : d3DisabledTimer;
                }
            }
        });

        return true;
    })();

    export function getRelativePosition(fromElement: JQuery, toElement: JQuery): powerbi.visuals.shapes.IPoint {
        if(!fromElement.length || !toElement.length) {
            return null;
        }

        let fromElementRect = fromElement[0].getBoundingClientRect();
        let toElementRect = toElement[0].getBoundingClientRect();

        return {
                x: toElementRect.left - fromElementRect.left,
                y: toElementRect.top - fromElementRect.top  
            };
    }

    export function renderTimeout(fn: Function, timeout: number = powerbitests.DefaultWaitForRender): number {
        return setTimeout(fn, timeout);
    }

    export function getTextElementRects(textElement: Element): Rect {
        var clientRect = textElement.getBoundingClientRect();
        var fontSizeString = window.getComputedStyle(textElement).fontSize;
        debug.assert(fontSizeString.indexOf("em") === -1,"em fontSize is not supported");
        var fontSize = fontSizeString.indexOf("pt") === -1
            ? parseFloat(fontSizeString)
            : jsCommon.PixelConverter.fromPointToPixel(parseFloat(fontSizeString));
        return <Rect>{ 
                left: clientRect.left,
                top: clientRect.bottom - fontSize,
                height: fontSize,
                width: clientRect.width
            };
    }

    export function isSomeTextElementOverlapped(textElements: Element[], isInRange: isInRange): boolean {
        return isSomeRectangleOverlapped(textElements.map(getTextElementRects), isInRange);
    }

    export function isSomeElementOverlapped(elements: Element[], isInRange: isInRange): boolean {
        var rects = elements.map(x => <Rect>x.getBoundingClientRect());
        return isSomeRectangleOverlapped(rects, isInRange);
    }

    export function isSomeRectangleOverlapped(rects: powerbi.visuals.Rect[], isInRange: isInRange): boolean {
        return rects.some((rect1, i1) =>
            rects.some((rect2, i2) => i1 !== i2 && isRectangleOverlapped(rect1, rect2, isInRange)));
    }

    export function isRectangleOverlapped(rect1: Rect, rect2: Rect, isInRange: isInRange): boolean {
        var xOverlap = isInRange(rect1.left, rect2.left, rect2.left + rect2.width)
            || isInRange(rect2.left, rect1.left, rect1.left + rect1.width);
        var yOverlap = isInRange(rect1.top, rect2.top, rect2.top + rect2.height)
            || isInRange(rect2.top, rect1.top, rect1.top + rect1.height);
        return xOverlap && yOverlap;
    }

    export function isSomeTextElementInOrOutElement(
        mainElement: Element,
        textElements: Element[],
        compareValues: compareValues): boolean {
        return isSomeRectangleInOrOutRectangle(
            <Rect>mainElement.getBoundingClientRect(),
            textElements.map(getTextElementRects),
            compareValues);
    }

    export function isSomeElementInOrOutElement(
        mainElement: Element,
        elements: Element[],
        compareValues: compareValues): boolean {
        var mainRect = <Rect>mainElement.getBoundingClientRect();
        var rects = elements.map(x => <Rect>x.getBoundingClientRect());
        return isSomeRectangleInOrOutRectangle(mainRect, rects, compareValues);
    }

    export function isSomeRectangleInOrOutRectangle(
        mainRect: Rect,
        rects: powerbi.visuals.Rect[],
        compareValues: compareValues): boolean {
        return rects.some((rect) => isRectangleInOrOutRectangle(mainRect, rect, compareValues));
    }

    export function isRectangleInOrOutRectangle(
        mainRect: Rect,
        rect: Rect,
        compareValues: compareValues): boolean {
        return compareValues(rect.left, mainRect.left) && compareValues(rect.top, mainRect.top)
            && compareValues(mainRect.left + mainRect.width, rect.left + rect.width)
            && compareValues(mainRect.top + mainRect.height, rect.top + rect.height);
    }
}