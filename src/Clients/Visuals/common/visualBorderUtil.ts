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
    /** Helper class for Visual border styles */
    export module VisualBorderUtil {
        /**
         * Gets The Boder Width string (e.g. 0px 1px 2px 3px)
         * @param {OutlineType} string Type of the Outline, one of Visuals.outline.<XX> const strings
         * @param {number} outlineWeight Weight of the outline in pixels
         * @returns String representing the Border Width
         */
        export function getBorderWidth(outlineType: string, outlineWeight: number): string {
            switch (outlineType) {
                case outline.none:
                    return '0px';
                case outline.bottomOnly:
                    return '0px 0px ' + outlineWeight + 'px 0px';
                case outline.topOnly:
                    return outlineWeight + 'px 0px 0px 0px';
                case outline.leftOnly:
                    return '0px 0px 0px ' + outlineWeight + 'px';
                case outline.rightOnly:
                    return '0px ' + outlineWeight + 'px 0px 0px';
                case outline.topBottom:
                    return outlineWeight + 'px 0px';
                case outline.leftRight:
                    return '0px ' + outlineWeight + 'px';
                case outline.frame:
                    return outlineWeight + 'px';
                default:
                    debug.assertFail('Unexpected OutlineType value: ' + outlineType);
                    return '0px';
            }
        }
    }
} 