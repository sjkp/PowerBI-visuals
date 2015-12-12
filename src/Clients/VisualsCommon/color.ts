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

/// <reference path="_references.ts"/>

module jsCommon {
    import Double = powerbi.Double;

    export module Color {
        export function rotate(rgbString: string, rotateFactor: number): string {
            if (rotateFactor === 0)
                return rgbString;

            let originalRgb = parseColorString(rgbString);
            let originalHsv = rgbToHsv(originalRgb);
            let rotatedHsv = rotateHsv(originalHsv, rotateFactor);
            let rotatedRgb = hsvToRgb(rotatedHsv);
            return hexString(rotatedRgb);
        }

        export function normalizeToHexString(color: string) {
            let rgb = parseColorString(color);
            return hexString(rgb);
        }

        export function parseColorString(color: string): RgbColor {
            debug.assertValue(color, 'color');

            if (color.indexOf('#') >= 0) {
                if (color.length === 7) {
                    // #RRGGBB
                    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
                    if (result == null || result.length < 4)
                        return;

                    return {
                        R: parseInt(result[1], 16),
                        G: parseInt(result[2], 16),
                        B: parseInt(result[3], 16),
                    };
                } else if (color.length === 4) {
                    // #RGB
                    let result = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(color);
                    if (result == null || result.length < 4)
                        return;

                    return {
                        R: parseInt(result[1] + result[1], 16),
                        G: parseInt(result[2] + result[2], 16),
                        B: parseInt(result[3] + result[3], 16),
                    };
                }
            }
            else if (color.indexOf('rgb(') >= 0) {
                // rgb(R, G, B)
                let result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(color);
                if (result == null || result.length < 4)
                    return;

                return {
                    R: parseInt(result[1], 10),
                    G: parseInt(result[2], 10),
                    B: parseInt(result[3], 10),
                };
            }
            else if (color.indexOf('rgba(') >= 0) {
                // rgba(R, G, B, A)
                let result = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)$/.exec(color);
                if (result == null || result.length < 5)
                    return;

                return {
                    R: parseInt(result[1], 10),
                    G: parseInt(result[2], 10),
                    B: parseInt(result[3], 10),
                    A: parseFloat(result[4]),
                };
            }
        }

        function rgbToHsv(rgbColor: RgbColor): HsvColor {
            let s, h;
            let r = rgbColor.R / 255,
                g = rgbColor.G / 255,
                b = rgbColor.B / 255;

            let min = Math.min(r, Math.min(g, b));
            let max = Math.max(r, Math.max(g, b));

            let v = max;
            let delta = max - min;
            if (max === 0 || delta === 0) {
                // R, G, and B must be 0.0, or all the same.
                // In this case, S is 0.0, and H is undefined.
                // Using H = 0.0 is as good as any...
                s = 0;
                h = 0;
            }
            else {
                s = delta / max;
                if (r === max) {
                    // Between Yellow and Magenta
                    h = (g - b) / delta;
                }
                else if (g === max) {
                    // Between Cyan and Yellow
                    h = 2 + (b - r) / delta;
                }
                else {
                    // Between Magenta and Cyan
                    h = 4 + (r - g) / delta;
                }
            }

            // Scale h to be between 0.0 and 1.
            // This may require adding 1, if the value
            // is negative.
            h /= 6;
            if (h < 0) {
                h += 1;
            }

            return {
                H: h,
                S: s,
                V: v,
            };
        }

        function hsvToRgb(hsvColor: HsvColor): RgbColor {
            let r, g, b;
            let h = hsvColor.H,
                s = hsvColor.S,
                v = hsvColor.V;

            if (s === 0) {
                // If s is 0, all colors are the same.
                // This is some flavor of gray.
                r = v;
                g = v;
                b = v;
            }
            else {
                let p, q, t, fractionalSector, sectorNumber, sectorPos;

                // The color wheel consists of 6 sectors.
                // Figure out which sector you//re in.
                sectorPos = h * 6;
                sectorNumber = Math.floor(sectorPos);

                // get the fractional part of the sector.
                // That is, how many degrees into the sector
                // are you?
                fractionalSector = sectorPos - sectorNumber;

                // Calculate values for the three axes
                // of the color.
                p = v * (1.0 - s);
                q = v * (1.0 - (s * fractionalSector));
                t = v * (1.0 - (s * (1 - fractionalSector)));

                // Assign the fractional colors to r, g, and b
                // based on the sector the angle is in.
                switch (sectorNumber) {
                    case 0:
                        r = v;
                        g = t;
                        b = p;
                        break;

                    case 1:
                        r = q;
                        g = v;
                        b = p;
                        break;

                    case 2:
                        r = p;
                        g = v;
                        b = t;
                        break;

                    case 3:
                        r = p;
                        g = q;
                        b = v;
                        break;

                    case 4:
                        r = t;
                        g = p;
                        b = v;
                        break;

                    case 5:
                        r = v;
                        g = p;
                        b = q;
                        break;
                }
            }

            return {
                R: Math.floor(r * 255),
                G: Math.floor(g * 255),
                B: Math.floor(b * 255),
            };
        }

        function rotateHsv(hsvColor: HsvColor, rotateFactor: number): HsvColor {
            let newH = hsvColor.H + rotateFactor;

            return {
                H: newH > 1 ? newH - 1 : newH,
                S: hsvColor.S,
                V: hsvColor.V,
            };
        }

        export function darken(color: RgbColor, diff: number): RgbColor {
            let flooredNumber = Math.floor(diff);
            return {
                R: Math.max(0, color.R - flooredNumber),
                G: Math.max(0, color.G - flooredNumber),
                B: Math.max(0, color.B - flooredNumber),
            };
        }

        export function rgbString(color: RgbColor): string {
            if (color.A == null)
                return "rgb(" + color.R + "," + color.G + "," + color.B + ")";
            return "rgba(" + color.R + "," + color.G + "," + color.B + "," + color.A + ")";
        }

        export function hexString(color: RgbColor): string {
            return "#" + componentToHex(color.R) + componentToHex(color.G) + componentToHex(color.B);
        }

        function componentToHex(hexComponent: number): string {
            let clamped = Double.ensureInRange(hexComponent, 0, 255);
            let hex = clamped.toString(16).toUpperCase();
            return hex.length === 1 ? "0" + hex : hex;
        }

        export interface RgbColor {
            R: number;
            G: number;
            B: number;
            A?: number;
        }

        interface HsvColor {
            H: number;
            S: number;
            V: number;
        }
    }
}