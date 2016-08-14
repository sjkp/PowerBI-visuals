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

module powerbi.visuals.utility {
    import ExtendedCSSProperties = jsCommon.ExtendedCSSProperties;
    import IThickness = powerbi.visuals.shapes.IThickness;

    export module StyleUtils {
        export function getRotateAngleFromElement(element: JQuery): number {
            let rawElemStyle = <ExtendedCSSProperties>element.get(0).style;

            let transformString = rawElemStyle.transform || rawElemStyle.webkitTransform;
            if (transformString) {
                let transform = transformString.match(/rotate\((-?\d+(?:\.\d*)?)deg\)/);
                if (transform) {
                    return parseFloat(transform[1]);
                }
            }

            return 0;
        }

        export function getTranslateTransformFromElement(element: JQuery): IPoint {
            let rawElemStyle = <ExtendedCSSProperties>element.get(0).style;
            
            // IE will recognize "webkitTransform" as "WebkitTransform" and set that as style property. 
            // This means transform property is not read.
            // We put the "transform" before the "webkitTransform" to counteract the weirdness of IE. 
            let transformString = rawElemStyle.transform || rawElemStyle.webkitTransform;

            let retValue: IPoint = { x: 0, y: 0 };

            if (transformString && transformString.length > 0) {
                let transform = transformString.match(/translate\((-?\d+(?:\.\d*)?)px, (-?\d+(?:\.\d*)?)px\)/);
                if (transform) {
                    retValue.x = parseFloat(transform[1]);
                    retValue.y = parseFloat(transform[2]);
                }
            }

            return retValue;
        }

        export function getPadding(element: JQuery): IThickness {
            if (!element)
                return;

            return {
                left: parseFloat(element.css('padding-left')) || 0,
                right: parseFloat(element.css('padding-right')) || 0,
                top: parseFloat(element.css('padding-top')) || 0,
                bottom: parseFloat(element.css('padding-bottom')) || 0,
            };
        }
    }
}